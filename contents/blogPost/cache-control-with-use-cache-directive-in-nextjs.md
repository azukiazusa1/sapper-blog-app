---
id: FYbTNdYRpcMFBLw9pP1vn
title: "Next.js の \"use cache\" ディレクティブによるキャッシュ制御"
slug: "cache-control-with-use-cache-directive-in-nextjs"
about: "Next.js の App Router はデフォルトでキャッシュされる設計でリリースされました。一方でデフォルトでキャッシュされることに対して不満を持つ開発者も多かったように思います。このようなフィードバックを受けて、Next.js 15 ではいくつかのキャッシュ戦略が変更されました。さらに現在 canary チャンネルで提供されている dynamicIO フラグを有効にすることで、\"use cache\" ディレクティブを用いてキャッシュを制御できるようになります。"
createdAt: "2024-11-02T14:07+09:00"
updatedAt: "2024-11-02T14:07+09:00"
tags: ["Next.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5IHFOKe4B4op2Lswy5oV5L/8492e6c2a69e71e860cfef85adfba655/bird_kamo_susuki_11286.png"
  title: "すすきとカモのイラスト"
selfAssessment:
  quizzes:
    - question: "Next.js で `dynamicIO` フラグを有効にしている場合、キャッシュの有効期限を指定するために使用する関数はどれか？"
      answers:
        - text: "cacheExpire()"
          correct: false
          explanation: null
        - text: "cacheLife()"
          correct: true
          explanation: null
        - text: "cacheTag()"
          correct: false
          explanation: null
        - text: "cacheControl()"
          correct: false
          explanation: null
published: true
---
Next.js の App Router では最もパフォーマンスの高いオプションで提供されるために、デフォルトでキャッシュが有効になっており、必要に応じてオプトアウトする設計でリリースされました。例えば global `fetch` 関数に patch が当てられており、ネットワークリクエストで取得されたデータは何もオプションを設定せずともキャッシュされ再利用されます。キャッシュを更新するためには開発者が明示的に revalidate する必要がありました。

Next.js のキャッシュ戦略は確かにパフォーマンスを向上させるうえで有効なものとなっていました。一方で[複雑なキャッシュの構造](https://nextjs.org/docs/app/building-your-application/caching) を理解することが難しいため学習コストが高く、またキャッシュの事故は重大なインシデントに繋がりかねないこともあるため、デフォルトでキャッシュされることに対して不満を持つ開発者も多かったように思います。

このような開発者からのフィードバックを受けて、Next.js 15 ではいくつかのキャッシュ戦略が変更されました。`GET` ルートハンドラーとクライアントルーターキャッシュのキャッシュを、デフォルトでキャッシュされるものからデフォルトでキャッシュされないものに変更しています。

さらにリリースノートでは今後数カ月間の間、Next.js のキャッシュの改善を継続して行っていくと述べられています。このような改善の一環として、現在 canary チャンネルで提供されている dynamicIO フラグがあります。dynamicIO フラグを有効にすることで、`"use cache"` ディレクティブを用いてキャッシュを制御できるようになります。

この記事では dynamicIO フラグを有効にした場合のあらゆるキャッシュの挙動について説明します。

## "use cache" ディレクティブを使う

`"use cache"` ディレクティブは Next.js の canary チャンネルでのみ利用可能です。以下のコマンドで canary バージョンの Next.js プロジェクトを作成します。

```bash
npx create-next-app@canary
```

続いて `next.config.ts` ファイルを編集して、`dynamicIO` フラグを有効にする必要があります。

```ts:next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  }
};

export default nextConfig;
```

## キャッシュの挙動の変更

`dynamicIO` フラグを有効にすることで、Next.js の従来の挙動とは異なるキャッシュ戦略を利用できます。デフォルトでは `fetch` 関数はキャッシュされないようになります。これにより、コンポーネント内で `fetch` 関数を使用してデータを取得する場合、新たにエラーが発生するようになりました。例えば以下のコードは API から TODO リストを取得して表示するコンポーネントです。

```tsx:app/page.tsx
export default async function Page() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await data.json();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

このコードを `npm run dev` で実行すると、以下のエラーが発生します。

> [ Server ] Error: Route "/": A component accessed data, headers, params, searchParams, or a short-lived cache without a Suspense boundary nor a "use cache" above it. We don't have the exact line number added to error messages yet but you can see which component in the stack below. See more info: https://nextjs.org/docs/messages/next-prerender-missing-suspense

コンポーネントが動的なデータを参照しているのにもかかわらず、`<Suspense>` もしくは `"use cache"` を使用していないという旨のエラーメッセージが表示されます。動的なデータとは `fetch` 関数を使って取得したデータに限らず、ヘッダーや Cookie、クエリパラメータやランダムなデータなども含まれます。

`dynamicIO` フラグを有効にした状態では、このようなデータを参照する場合にはデータをキャッシュするか、リクエストごとに取得するかを選択する必要があるのです。

### リクエストごとにデータを取得する

ダッシュボード画面のように頻繁に変更されるデータを取得するような場合には、キャッシュせずにリクエスト事にデータを取得することが適しています。このような場合には、`<Suspense>` コンポーネントでラップする必要があります。

```tsx:app/page.tsx
import { Suspense } from "react";

async function TodoList() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await data.json();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TodoList />
    </Suspense>
  );
}
```

ルートコンポーネントの場合には、`<Suspense>` の代わりに [loading.tsx](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming) ファイルを使用することもできます。

```tsx:app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>;
}
```

この方法を利用した場合には、デフォルトで何もキャッシュされない状態となります。

### データをキャッシュする

エラーを解消する 2 つ目の方法はデータをキャッシュすることです。`layout.tsx` もしくは `page.tsx` ファイルの先頭で `"use cache"` ディレクティブを宣言することにより、ページ全体ですべてのデータをキャッシュするようになります。

```tsx:app/page.tsx {1}
"use cache";

export default async function Page() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = await data.json();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

取得するデータをキャッシュすることにより、ページを静的にレンダリングすることが可能になります。

## 部分的にデータをキャッシュする

`layout.tsx` もしくは `page.tsx` ファイルの先頭で `"use cache"` ディレクティブを宣言すると、ページ全体のデータ取得をキャッシュできました。`"use cache"` ディレクティブによるキャッシュ動作はネストされたコンポーネントに継承されます。

```tsx:app/page.tsx
"use cache";

import { TodoList } from "./TodoList";

export default function Page() {
  return <TodoList />;
}
```

```tsx:app/TodoList.tsx
// このファイルでは "use cache" ディレクティブを宣言していないが、
// 親コンポーネント "use cache" ディレクティブが宣言されているためリクエストがキャッシュされる

export async function TodoList() {
  const data = await fetch("https://jsonplaceholder.typicode.com/todos");
  // ...
}
```

ときにはページ全体ではなく、一部のデータのみをキャッシュして表示したい場合もあるでしょう。例えば、ヘッダーに表示するユーザー情報はデータの変更頻度が低いため、キャッシュして表示することが適していますが、コンテンツ部分はリクエストごとに取得することが適しているかもしれません。

### コンポーネント単位でのキャッシュ

このような場合には `"use cache"` ディレクティブを関数もしくはコンポーネントといった単位で部分的に指定できます。以下の例では、`<UserInfo>` コンポーネントの先頭で `"use cache"` ディレクティブを宣言しています。

```tsx:app/UserInfo.tsx
export default async function UserInfo() {
  "use cache";
  const result = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await result.json();
  return (
    <p>{user.name}</p>
  );
}
```

続いて `page.tsx` ファイルで `<UserInfo>` コンポーネントをインポートして表示します。`page.tsx` ファイルでは API から取得した TODO リストを表示していますが、この部分は `<Suspense>` コンポーネントでラップし、動的に取得するようにしています。

```tsx:app/page.tsx
import { Suspense } from "react";
import UserInfo from "./UserInfo";
import TodoList from "./TodoList";

export default function Page() {
  return (
    <>
    <UserInfo />
    <Suspense fallback={<div>Loading...</div>}>
      <TodoList />
    </Suspense>
    </>
  );
}
```

これにより、同じページ内でも一部のデータはキャッシュして表示し、他のデータはリクエストごとに取得するようにできます。

コンポーネント単位で `"use cache"` ディレクティブを指定した場合、そのコンポーネント内で実行されるすべてのフェッチや計算をキャッシュできます。コンポーネントの Props がキャッシュキーとして利用され、同じ Props が渡された場合にはアプリケーション全体でキャッシュされたデータが再利用されます。

例として以下のような `<Random>` コンポーネントがあるとします。このコンポーネントは `Math.random()` を使ってランダムな数値を生成し、表示します。なお、`"use cache"` ディレクティブを指定する場合必ず `async` 関数でなければなりません。

```tsx:app/Random.tsx
export const Random = async ({ id }) => {
  "use cache";

  const data = Math.random();
  return <div>{data}</div>;
};
```

このコンポーネントを `a/pages.tsx` と `b/pages.tsx` でそれぞれ使用してみましょう。

```tsx:app/a/pages.tsx
import { Random } from "../Random";

export default function Page() {
  return (
    <>
      <h1>Page A</h1>
      <Random id="1" />
      <Random id="2" />
      <Random id="2" />
      <Random id="3" />
      <Random id="3" />
      <Random id="3" />
    </>
  );
}
```

```tsx:app/b/pages.tsx
import { Random } from "../Random";

export default function Page() {
  return (
    <>
      <h1>Page B</h1>
      <Random id="1" />
      <Random id="2" />
      <Random id="2" />
      <Random id="3" />
      <Random id="3" />
      <Random id="3" />
    </>
  );
}
```

`/a` と `/b` にアクセスすると、ページをまたいで同じ ID に対しては同じ数値が表示されることが確認できます。この結果はキャッシュの有効期限が切れるまで、ページをリロードしても変わりません。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2k5Vn4Ld5tyA6rySp4PPIc/7f2aab0d030b5349f6b5df7aeb54987f/_____2024-11-02_16.22.54.mov"></video>

### 関数単位でのキャッシュ

`"use cache"` ディレクティブは任意の async 関数に適用できます。キャッシュキーには関数の引数とクロージャーが自動で使用されます。

```tsx:getData.ts

export async function getData(id: string) {
  "use cache";

  const data = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  return await data.json();
}
```

部分的なキャシュはより安全にデータを取得するために方法としても利用できます。ページ全体でキャシュを有効にしている場合、新しくデータ取得処理を追加した場合におもわぬデータがキャッシュされる可能性があります。部分的なキャッシュを利用している場合に新たなデータ取得処理を追加した場合に
は、ビルド時にエラーが発生するため、動的にデータ取得をするかキャッシュするかの選択を忘れることがありません。

## キャッシュタグを指定する

何らかのアクションの後に特定のキャッシュをクリアしたい場合には、[revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) を使用します。例えば、フォームを送信した後にキャッシュをクリアする場合には、サーバーアクション関数内で `revalidateTag` を呼び出すことができます。

```tsx:app/actions.ts
"use server"

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addTodo()
  revalidateTag("todos")
}
```

`revalidateTag` の引数に指定するキーは `"use cache"` ディレクティブを使用している関数内で `cacheTag` を使用して指定できます。

```tsx:app/getData.ts
import { unstable_cacheTag as cacheTag } from 'next/cache'

export async function getData() {
  "use cache";
  cacheTag("todos");

  const data = await fetch(`https://jsonplaceholder.typicode.com/todos`);
  return await data.json();
}
```

## キャッシュの期間を指定する

特定のデータやページ単位でキャッシュの保存期間を制御するためには、`cacheLife()` 関数を使用します。

```tsx:app/getData.ts
import { unstable_cacheLife as cacheLife } from 'next/cache'

export async function getData() {
  "use cache";
  cacheLife("minutes");

  const data = await fetch(`https://jsonplaceholder.typicode.com/todos`);
  return await data.json();
}
```

`cacheLife` 関数の引数はデフォルトで以下のいずれかを指定できます。

- `"seconds"`
- `"minutes"`
- `"hours"`
- `"days"`
- `"weeks"`
- `"max"`

よりきめ細かい期間を制御したい場合には、`next.config.ts` ファイルでキャッシュのプロファイルを設定できます。以下の例では `TodoList` というキャッシュプロファイルを定義しています。

```ts:next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
    cacheLife: {
      TodoList: {
        // クライアントがサーバーをチェックせずに値をキャッシュする期間
        stale: 3600,
        // サーバー上でキャッシュを更新する頻度
        revalidate: 900,
        // 値が動的に切り替わる前に古いままでいられる最大期間
        // revalidate よりも長く設定する必要がある
        expire: 86400,
      },
    },
  },
}

export default nextConfig
```

この設定で定義したプロファイルは、`cacheLife("TodoList")` で指定できます。

```tsx:app/getData.ts
import { unstable_cacheLife as cacheLife } from 'next/cache'

export async function getData() {
  "use cache";
  cacheLife("TodoList");

  const data = await fetch(`https://jsonplaceholder.typicode.com/todos`);
  return await data.json();
}
```

## まとめ

- 従来の Next.js のキャッシュはデフォルトでキャッシュされる設計であったが、Next.js v15 からこの方針が徐々に変更されてるようになった
- `dynamicIO` フラグを有効にすることで、`fetch` 関数によるデータ取得がデフォルトでキャッシュされないようになる
- コンポーネント内で動的なデータを参照する場合には `<Suspense>` コンポーネントでラップするか、`"use cache"` ディレクティブを使用する必要がある
- `<Suspense>` コンポーネントでラップすることで、データをリクエストごとに取得することができる
- `"use cache"` ディレクティブを `layout.tsx` もしくは `page.tsx` ファイルの先頭で宣言することで、ページ全体のデータ取得をキャッシュすることができる
- `"use cache"` ディレクティブを関数もしくはコンポーネントといった単位で部分的に指定できる
- `revalidateTag` 関数でキャッシュをクリアするためのタグを指定する場合には、`"use cache"` ディレクティブ内で `cacheTag()` 関数を使用する
- `cacheLife` 関数を使用することで、キャッシュの保存期間を指定することができる

## 参考

- [Directives: use cache | Next.js](https://nextjs.org/docs/canary/app/api-reference/directives/use-cache)
- [Our Journey with Caching | Next.js](https://nextjs.org/blog/our-journey-with-caching)
- [Next.js 15 Caching Semantics](https://nextjs.org/blog/next-15#caching-semantics)
- [Next.js Conf 2024 Opening Keynote](https://www.youtube.com/watch?v=19g66ezsKAg&t=1527s)
