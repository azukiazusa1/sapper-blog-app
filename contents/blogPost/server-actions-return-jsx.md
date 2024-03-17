---
id: t96F1iNem6Il3xN76Ou65
title: "Server Actions の戻り値には JSX を使える"
slug: "server-actions-return-jsx"
about: "Server Actions の戻り値には、シリアライズ可能なデータ型を返す必要があります。ドキュメントでは Server Actions の戻り値に JSX を使うことはサポートされていないと記述されていますが、実際には Server Actions の戻り値に JSX を使うことができます。ただし、公式にサポートされている仕様ではないので、思わぬバグを踏む、将来追加される機能に対応しないおそれがあることを理解した上で、使うかどうかを判断する必要があります。"
createdAt: "2023-11-04T14:45+09:00"
updatedAt: "2023-11-04T14:45+09:00"
tags: ["Next.js", "React", "Server Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1vnOta8eY4gfwZyzBUZ5SW/98f05649778e17085b4727413f2dcb1c/flower_cosmos_illust_1012.png"
  title: "コスモスのイラスト"
selfAssessment: null
published: true
---
Server Actions の戻り値には、サーバーからクライアントにデータを渡せるように、シリアライズ可能な形式である必要があります。具体的には、以下の型をサポートしています。

- Primitives
  - string
  - number
  - bigint
  - boolean
  - undefined
  - null
  - symbol, only symbols registered in the global Symbol registry via Symbol.for
- Iterables containing serializable values
  - String
  - Array
  - Map
  - Set
- TypedArray and ArrayBuffer
- Date
- FormData instances
- Plain objects: those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
- Functions that are server actions
- Promises

[Serializable arguments and return values](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)

上記にないデータ型、例えば Class は、シリアライズできないので、Server Actions 戻り値に使うことができないというわけですね。

```ts
"user strict";
class User {
  name: string;
  amount: number;
  constructor(name: string, amount: number) {
    this.name = name;
    this.amount = amount;
  }
}

export const action = (formData: FormData) => {
  const name = formData.get("name") as string;
  const amount = Number(formData.get("amount")) as number;

  const user = new User(name, amount);

  // 実行時エラーになる
  // Uncaught (in promise) Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
  return {
    user,
  };
};
```

ただし面白いことに、ドキュメントでは React Elements または JSX はサポートされていないと記述されているものの、実際には Server Actions の戻り値に JSX を使うことができます。

```tsx:app/lib/actions.tsx
"use server";
export const action = async (
  formData: FormData
): Promise<{ message: ReactElement }> => {
  const name = formData.get("name") as string;

  // create user...

  return {
    message: <div>user created. name: {name}</div>,
  };
};
```

コンポーネント側では、以下のように Server Actions の戻り値を受け取って　JSX をレンダリングできます。

```tsx:app/Form.tsx
"use client";
import { ReactElement, useState } from "react";
import { action } from "@/app/lib/actions";

export default function Form() {
  const [message, setMessage] = useState<ReactElement | null>(null);

  return (
    <form
      action={async (formData) => {
        const result = await action(formData);
        setMessage(result.message);
      }}
    >
      <input name="name" />
      <button type="submit">Create</button>

      {message && <>{message}</>}
    </form>
  );
}
```

## 使い所

Server Actions で JSX を返すことができるのであれば、どのような場面で使えるのでしょうか？例として、ページネーション付きの投稿一覧を表示するページを考えてみましょう。

Server Actions では API から得られたデータを単に返すだけでなく、次のデータが存在するかどうかでボタンを返すかどうか決めたり、ボタンをクリックしたときの次のページ番号を予め設定しておいたりできます。

Server Actions 関数を見てみましょう。次のページまたは前のページが存在するかどうかで、`pagination` をどのように返すのか決めています。また、`<button>` の `value` 属性には、次のページ番号を設定して、Server Actions の引数の `FormData` から取得できるようにしています。

```tsx:app/lib/actions.tsx
"use server";
type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

const PAGE_SIZE = 10;
const PAGE_TOTAL = 100;

const hasNextPage = (offset: number, total: number) => {
  return offset + PAGE_SIZE < total;
};

export const action = async (
  formData: FormData
): Promise<{ pagination: ReactElement; postList: ReactElement }> => {
  const offset = formData.get("offset") as string;

  const json = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=${PAGE_SIZE}`
  );
  const posts = (await json.json()) as Post[];

  const nextPage = hasNextPage(Number(offset), PAGE_TOTAL)
    ? Number(offset) + PAGE_SIZE
    : null;
  const prevPage = Number(offset) - PAGE_SIZE;

  return {
    pagination: (
      <>
        {prevPage >= 0 && (
          <button name="offset" value={prevPage}>
            Previous Page
          </button>
        )}
        {nextPage && (
          <button name="offset" value={nextPage}>
            Next Page
          </button>
        )}
      </>
    ),

    postList: (
      <>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </>
    ),
  };
};
```

コンポーネント側の実装は以下のとおりです。`useState` を利用して、Server Actions から受け取った値をもとに `postList` と `pagination` を更新しています。クライアントコンポーネント側の実装は単に `postList` と `pagination` を表示するだけのシンプルなものになりました。

```tsx:app/Form.tsx
"use client";
import { action } from "@/app/lib/actions";
import { ReactElement, useState } from "react";

export default function Form({
  initialPostList,
}: {
  initialPostList: ReactElement;
}) {
  const [postList, setPostList] = useState(initialPostList);
  const [pagination, setPagination] = useState(
    <button name="offset" value="10">
      Next Page
    </button>
  );

  return (
    <form
      action={async (formData) => {
        const { pagination, postList } = await action(formData);

        setPostList(postList);
        setPagination(pagination);
      }}
    >
      {postList}
      {pagination}
    </form>
  );
}
```

以下のように、問題なく動作していることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/68fWx8l9Q2uBderQ5weejH/9c2594e98cb0be54ce25336e1a4fd0fd/_____2023-11-04_16.19.49.mov" controls></video>

## Server Actions で JSX を返す実装に頼って良いのか

React のドキュメントには、Server Actions の戻り値に JSX を使うことはサポートされていないと記述されています。現状、Server Actions の戻り値に JSX を使うことはできますが、この挙動は意図したものなのでしょうか？

React のコアメンテナである Sebastian Markbåge 氏は、以下のようにコメントしています。

> It’s supported if you know what you’re doing. It’s just that it’s not necessarily the happy path. You have to be aware it doesn’t refresh and some edge cases.

https://twitter.com/sebmarkbage/status/1716685670356513108

以下は上記のコメントの翻訳です。

> あなたが何をしているのか理解していれば、それはサポートされています。ただし、必ずしも最善の方法とは限りません。リフレッシュしないことや、いくつかのエッジケースに注意する必要があります。

Server Actions の戻り値に JSX を使うことは、公式にサポートされている仕様とは言えません。そのため思わぬバグを踏む、将来追加される機能に対応しないおそれがあることを理解した上で、使うかどうかを判断する必要があります。多くの場合は JSX を返さない実装で代替可能であると考えられますし、まずはその方法を検討すべきでしょう。

例えば Server Actions に既に親しんでいる方であれば、`useState` で　Server Actions から返された状態を管理するのではなく、`useFormState` を使うことで JavaScript が動作しない環境においても動作するプログレッシブエンハンスメントを実現できることをご存知でしょう。

しかしながら、以下のように Server Actions が JSX を返す実装をした場合には、コードはうまく動作しませんでした。仕様に反した実装がうまく動作しない典型的な例ですね。

```tsx:app/Form.tsx
"use client";
import { useFormState } from "react-dom";
import { action } from "@/app/lib/actions";
import { ReactElement } from "react";

export default function Form({
  initialPostList,
}: {
  initialPostList: ReactElement;
}) {
  // 実行時エラーとなる
  // Uncaught Error: Only plain objects, and a few built-ins, can be passed to Server Actions. Classes or null prototypes are not supported.
  const [state, dispatch] = useFormState(action, {
    postList: initialPostList,
    pagination: (
      <button name="offset" value="10">
        Read More
      </button>
    ),
  });

  return (
    <form action={dispatch}>
      {state.postList}
      {state.pagination}
    </form>
  );
}
```

かわりに Server Actions からは JSX を返さずに単純なオブジェクトを返すように変更すれば、コードは正常に動作するようになります。

```tsx:app/lib/actions.tsx
"use server";

export type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type State = {
  nextPage: number | null;
  prevPage: number;
  postList: Post[];
};

const PAGE_SIZE = 10;
const PAGE_TOTAL = 100;

const hasNextPage = (offset: number, total: number) => {
  return offset + PAGE_SIZE < total;
};

export const action = async (prevState: State, formData: FormData) => {
  const offset = formData.get("offset") as string;

  const json = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_start=${offset}&_limit=${PAGE_SIZE}`
  );
  const postList = (await json.json()) as Post[];

  const nextPage = hasNextPage(Number(offset), PAGE_TOTAL)
    ? Number(offset) + PAGE_SIZE
    : null;
  const prevPage = Number(offset) - PAGE_SIZE;

  return {
    nextPage,
    prevPage,
    postList,
  };
};
```

```tsx:app/Form.tsx
"use client";
import { useFormState } from "react-dom";
import { action, Post } from "@/app/lib/actions";
import { ReactElement } from "react";

export default function Form({ initialPostList }: { initialPostList: Post[] }) {
  const [state, dispatch] = useFormState(action, {
    postList: initialPostList,
    prevPage: 0,
    nextPage: 10,
  });

  return (
    <form action={dispatch}>
      {state.postList.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}

      {state.prevPage > 0 && (
        <button type="submit" name="offset" value={state.prevPage}>
          Prev Page
        </button>
      )}

      {state.nextPage !== null && (
        <button type="submit" name="offset" value={state.nextPage}>
          Next Page
        </button>
      )}
    </form>
  );
}
```

このコードは JavaScript が動作しない環境でも動作します。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1uHAPP7ij2vrpL0LRgz2S6/d53eceeba84c16f7c2e20a229ffa95b4/_____2023-11-04_16.20.38.mov" controls></video>

## まとめ

- Server Actions の戻り値には、シリアライズ可能なデータ型を返す必要がある
- ドキュメントでは Server Actions の戻り値に JSX を使うことはサポートされていないと記述されているが、実際には Server Actions の戻り値に JSX を使うことができる
- Server Actions の戻り値に JSX を使うことは、公式にサポートされている仕様ではない。そのため思わぬバグを踏む、将来追加される機能に対応しないおそれがあることを理解した上で、使うかどうかを判断する必要がある。多くの場合は単純なオブジェクトを返す実装で代替可能であると考えられる
