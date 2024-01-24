---
id: At6sKZoxNvUMIplTRlo8T
title: "Next.js の Server Actions について"
slug: "nextjs-server-action"
about: "Next.js の Server Actions はサーバーサイドのデータのミューテーション、クライアント JavaScript の削減、プログレッシブエンハンスメントなフォームを実現します。"
createdAt: "2023-05-06T14:13+09:00"
updatedAt: "2023-05-06T14:13+09:00"
tags: ["Next.js", "React", "Server Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5V2x2ggL5WcHuQ0q6BciJk/65a66ea2f5b02c508c07e1feb4965e5f/___Pngtree___blue_bird_flying_bird_cartoon_3926050.png"
  title: "blue-bird"
published: true
---
x> Server Actions は 2023/05/06 現在 Alpha 版の機能です。この記事で紹介している内容は今後変更される可能性があります。

Next.js の Server Actions はクライアントサイドのフォームの送信やボタンクリックなどのイベントからサーバーサイドで実行される関数を呼び出せます。クライアント JavaScript の削減、プログレッシブエンハンスメントなフォームを実現します。

## Server Actions をはじめる

Server Actions を使うには、まず `next.config.js` に `experimental: { serverActions: true }` を追加します。この設定により、Next.js が React の実験的な機能である [React Canary](https://react.dev/blog/2023/05/03/react-canaries) を使用するようになります。また、従来の `pages` ディレクトリではなく App Router でなければ Server Actions を使用できません。

```js:next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

設定が完了したら、一番シンプルな Server Actions を作成してみましょう。`app/page.tsx` ファイルを作成し、以下のように記述します。

```tsx:app/page.tsx
import { sql } from "@vercel/postgres";

async function addTweet(formData: FormData) {
  "use server";

  const tweet = formData.get("tweet");

  await sql`INSERT INTO tweets (tweet, likes) VALUES (${
    tweet?.toString() || ""
  }, ${0})`;
}
export default async function Home() {
  return (
    <main>
      <form action={addTweet}>
        <textarea name="tweet"></textarea>
        <button>Tweet</button>
      </form>
    </main>
  );
}
```

`Home` コンポーネントのフォームは `JavaScript` で状態管理を行わない非制御コンポーネントとなっています。Remix や SvelteKit のフォームのようにネイティブの HTML の要素のみで完結しています。実際にブラウザの設定で JavaScript を無効にしてもフォームは動作することを確認できます。

JavaScript が使えない環境においては、HTML の機能でフォームを送信してページ全体が再読み込みされます。JavaScript が有効となっている場合、JavaScript によりフォームの送信が実施されるので、ページ全体が再読み込みされないなど、よりよいユーザー体験を提供できます。このようのこのように古いブラウザや機能の限られた端末のユーザーをサポートしつつ、モダンなブラウザのユーザーにはリッチなユーザー体験を提供することは[プログレッシブエンハンスメント](https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement)と呼ばれています。 

通常の HTML のフォームと唯一異なる点は、`<form>` タグの `action` 属性に `addTweet` という JavaScript の関数を指定している点です。`addTweet` 関数はフォームがサブミットした際に**サーバーサイド**で実行されます。実際にこの例においては、`sql` タグを使ってサーバーサイドのみでアクセスできるデータベースに insert しています。このように、サーバーサイドでのみ実行される関数を Server Actions 関数と呼ぶことにします。

### `"use server"` ディレクティブ

Server Actions 関数は関数の内部のトップレベルで `"use server` ディレクティブを宣言する必要があります。

```ts:app/page.tsx
async function addTweet(formData: FormData) {
  "use server";

  // ...
}
```

`"use server"` ディレクティブを宣言していない関数を `<form>` の `action` 属性に指定した場合、クライアントサイドで実行される関数として扱わてしまうためエラーが発生します。

![Unhandled Runtime Error Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with use server.](https://images.ctfassets.net/in6v9lxmm5c8/x8QhWomOUMeRztbJstb1z/cbd9875b9a02c3f491f0bd333320d303/__________2023-05-06_15.56.32.png)

`"use server"` ディレクティブはファイルのトップレベルに宣言することも可能です。この場合、ファイル内のすべての関数がサーバーサイドで実行される関数として扱われるので、ファイル内にクライアントコンポーネントを配置できません。

```ts:app/actions.ts
"use server";

import { sql } from "@vercel/postgres";

async function addTweet(formData: FormData) {
  // ...
}
```

```tsx:app/page.tsx
import { addTweet } from "./actions";

export default function Home() {
  reutrn (
    <main>
      <form action={addTweet}>
      </form>
    </main>
  );
}
```

### 引数と戻り値

Server Actions 関数の引数と戻り値は React Server Component のプロトコルに従いシリアライズされます。そのため、例えば `Error` オブジェクトを throw などシリアライズできないオブジェクトを返すことができません。

```sh
Warning: Only plain objects can be passed to Client Components from Server Components. Error objects are not supported.
  {: Error}
```

React Sever Component のシリアライズについては以下の記事が参考になります。

https://postd.cc/how-react-server-components-work/

`<form>` の `action` 属性に関数を渡した場合、引数として [FormData](https://developer.mozilla.org/ja/docs/Web/API/FormData) オブジェクトを受け取るので通常のフォームを処理するのと同様に実装できます。

```ts:app/page.tsx
async function addTweet(formData: FormData) {
  "use server";

  const tweet = formData.get("tweet");

  await sql`INSERT INTO tweets (tweet, likes) VALUES (${
    tweet?.toString() || ""
  }, ${0})`;
}
```

## データ更新後の revalidate

`addTweet` 関数によるデータベースの更新を行った後、正しく保存されているか確認するためにツイートの一覧を表示するようにコンポーネントを変更してみましょう。以下のように、`sql` 関数を使ってデータベースからツイートの一覧を取得して表示します。

```diff :app/page.tsx
  export default async function Home() {
+   const { rows } = await sql`SELECT * FROM tweets ORDER BY created_at DESC`;

    return (
      <main>
        <form action={addTweet}>
          {/* ... */}
        </form>

+       <ul>
+         {rows.map((tweet) => (
+           <li key={tweet.id}>
+             <p>{tweet.tweet}</p>
+             <button>Like {tweet.likes}</button>
+           </li>
+         ))}
+       </ul>
      </main>
    );
  }
```

投稿したツイートの一覧を表示できるようになりましたが、1 つ問題があります。`tweet` ボタンでフォームを送信した後もツイートの一覧が表示されず、再度ページを読み込み必要があるのです。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1Mefwh4a4ClWgmFIUCAeXK/d08d6564d08e9792fd6491fbcacc970b/_____________2023-05-06_16.22.06.mov" controls></video>

Server Actions 関数内でデータの更新を実施した場合には `redirect` を呼び出すか、[revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath) または [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag) を呼び出してデータの再検証を行いキャッシュを更新する必要があります。

Server Actions 関数内で `revalidatePath` を呼び出すように修正してみましょう。`revalidatePath` は引数として渡したパスに紐づくデータを再検証します。`sql` でデータを更新した後に `revalidatePath` を呼び出すように修正します。

```diff :app/page.tsx
  import { sql } from "@vercel/postgres";
+ import { revalidatePath } from "next/cache";

  async function addTweet(formData: FormData) {
    "use server";

    const tweet = formData.get("tweet");

    await sql`INSERT INTO tweets (tweet, likes) VALUES (${
      tweet?.toString() || ""
    }, ${0})`;

+  revalidatePath("/");
  }
```

再度ツイートの投稿を試してみると、画面の更新を行わずとも新しいツイートが表示されるようになりました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5Ux2NQYSbFcnZjNoB0hyfT/498fb02e493a51d5a4d650d0377dd7f0/_____________2023-05-06_16.31.59.mov" controls></video>

## `useTransition` を使用したカスタム Server Actions

Server Actions フックはフォーム内の `action` や submit button の `formAction` 以外の場所でも使用できます。例として、ボタンをクリックしたときにいいね数を更新するような処理を実装してましょう。これは [useTransition](https://react.dev/reference/react/useTransition) フックが提供する `startTrantion` 関数を使用して実装できます。

`useTransition` 関数はクライアントコンポーネントでのみ使用できるフックですので、いいねボタンの部分をクライアントコンポーネントして分割する必要があります。`app/LikeButton.tsx` ファイルを作成し、先頭で `"use client"` ディレクティブを宣言します。

```tsx:app/LikeButton.tsx
"use client";

import { useTransition } from "react";
import { likeTweet, Tweet } from "./actions";

type Props = {
  tweet: Tweet;
};

export default function LikeButton({ tweet }: Props) {
  const [isPending, startTransition] = useTransition();
  return (
    <button onClick={() => startTransition(() => likeTweet(tweet.id))}>
      {isPending ? "loading..." : "Like"} {tweet.likes}
    </button>
  );
}
```

`"use client"` ディレクティブを宣言しているファイル内には `Server Actions` 関数を配置することはできません。そのため、ツイートのいいね数の更新を行う `likeTweet` 関数は `app/actions.ts` に配置しています。`app/actions` ファイルは先頭に `"use server"` ディレクティブを宣言しているため、`likeTweet` 関数は `Server Actions` として実行されます。

```ts:app/actions.ts
"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";

export type Tweet = {
  id: string;
  tweet: string;
  likes: number;
  created_at: Date;
};

export async function likeTweet(id: string) {
  await sql`UPDATE tweets SET likes = likes + 1 WHERE id = ${id}`;

  revalidatePath("/");
}
```

`app/page.tsx` ファイルを修正して `LikeButton` コンポーネントを使用するようにします。

```diff:app/page.tsx
  export default async function Home() {
    const { rows } = await sql`SELECT * FROM tweets ORDER BY created_at DESC`;

    return (
      <main>
        <form action={addTweet}>
          {/* ... */}
        </form>

        <ul>
          {rows.map((tweet) => (
            <li key={tweet.id}>
              <p>{tweet.tweet}</p>
-             <button>Like {tweet.likes}</button>
+             <LikeButton tweet={tweet} />
            </li>
          ))}
        </ul>
      </main>
    );
  }
```

これで、いいねボタンをクリックしたときにいいね数が更新されるようになりました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6c1GYb9A3GATJdM9fVaShO/70ec9747a62ac7d001f4df6a67cc2ea0/_____________2023-05-06_17.05.37.mov" controls></video>

!> `<form>` 以外の場所で `Server Actions` を使用する場合は、プログレッシブエンハンスメントが無効になることに注意してください。つまり、JavaScript が無効となっている環境ではボタンをクリックしても何も起こらないということです。できる限り JavaScript が読み込まれない環境をサポートしたい場合には、`onClick` で `Server Actions` 関数を呼び出すのではなく、ボタンを `<form>` で囲ってフォームとして扱うのが良いでしょう。

## `useOptimistic` を使用して楽観的更新を実現する

React の実験的な機能である `useOptimistic` フックを使うことで、楽観的な更新を提供できます。楽観的な更新とは、サーバーにリクエストを送信する前にクライアント側でデータを更新することです。これにより、ユーザーはサーバーからのレスポンスを待つことなく、すぐにデータの更新を確認できます。もしサーバサイドのエラーなどで処理が失敗した場合には、いいね数をフォールバックするなど適切なフィードバックをユーザーに提供する必要があります。

`useOptimistic` フックは `useTransition` フックと同様にクライアントコンポーネントでのみ使用できます。いいねボタンをクリックしたときに楽観的な更新を実現するように修正してみましょう。

```tsx:app/LikeButton.tsx
"use client";

import { experimental_useOptimistic as useOptimistic } from "react";
import { likeTweet, Tweet } from "./actions";

type Props = {
  tweet: Tweet;
};

export default function LikeButton({ tweet }: Props) {
  const [optimisticLikes, addOptimisticLikes] = useOptimistic(
    tweet.likes,
    (state, newLikes: number) => state + newLikes
  );
  return (
    <button
      onClick={async () => {
        addOptimisticLikes(1);
        await likeTweet(tweet.id);
      }}
    >
      {optimisticLikes} Likes
    </button>
  );
}
```

`useOptimistic` フックの第 1 引数には現在の状態を、第 2 引数には状態を更新する関数を渡します。`useOptimistic` フックの返り値の配列の 2 つ目の関数を呼び出すことで状態を更新できます。

ここではボタンがクリックされたときに `addOptimisticLikes` を呼び出してクライアント側の状態を更新した後に `likeTweet` 関数でサーバーにリクエストを送信しています。これにより、ボタンをクリックしたとき即座にいいね数が更新されるようになりました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3cHYFr7IS4RbT5rKOyiYF1/a0f63e043d02e93b93bcee69e1ca7653/_____________2023-05-06_20.57.47.mov" controls></video>

サーバー側の処理が失敗した場合には、`revalidatePath` 関数が呼ばれてデータの再検証が行われるため、クライアント側の状態がサーバー側の状態と同期されます。以下のように意図的にエラーを発生させて試すことができます。

```ts:app/actions.ts
export async function likeTweet(id: string) {
  try {
    throw new Error("test");
    await sql`UPDATE tweets SET likes = likes + 1 WHERE id = ${id}`;
  } catch (error) {
    console.error(error);
  } finally {
    revalidatePath("/");
  }
}
```

## `useFormStatus` をしてフォームの状態を表示する

`useFormStatus` フックをフォームアクションと合わせて使用すると、フォームが送信中であることを示す `pending` 状態が得られます。`pending` 状態の場合にはフォームの送信ボタンを無効にして、送信中であることをユーザーに伝えましょう。フォーム部分を `app/TweetForm.tsx` に切り出して `"use client"` を宣言します。ついでに、`addTweet` 関数も `app/actions.tsx` に移動しておきましょう。

x> 2023/05/06 現在では、以下のコードで動作しませんでした。

```tsx:app/TweetForm.tsx
"use client";

import { addTweet } from "./actions";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function TweetForm() {
  const { pending } = useFormStatus();

  return (
    <>
      <form action={addTweet}>
        <textarea name="tweet"></textarea>
        <button disabled={pending}>Tweet</button>
        {pending && <p>Submitting...</p>}
      </form>
    </>
  );
}
```

## バリデーション

フォームのバリデーションはクライアントサイドで行うものと、サーバサイドで行うものの 2 つがあるでしょう。例えば、ツイートの文字列制限（1 文字以上 140 文字以下など）はクライアントサイドでも検証できるため、サーバーにデータを送信する前に即座にフィードバックを返すことができます。一方で、1 日のツイート数に制限がある場合は、サーバサイドでなければ検証できません。

まずはクライアントサイドで実施するバリデーションを見てみましょう。以下のように、Server Actions 関数を呼び出す前にクライアント側でバリデーションを行います。`addTweet` の前に呼び出されるインラインの関数は `"use server"` ディレクティブを宣言しないので、クライアントサイドで実行されます。

```diff:app/TweetForm.tsx
  export default function TweetForm() {
+   const [error, setError] = useState<string | null>(null);
    const { pending } = useFormStatus();

    return (
      <>
        <form
-        action={addTweet}       
+        action={async (formData) => {
+          setError(null);
+          const tweet = formData.get("tweet");
+          if (typeof tweet !== "string" || tweet.length === 0) {
+            setError("Tweet cannot be empty");
+            return;
+          }
+          if (tweet.length > 140) {
+            setError("Tweet cannot be longer than 140 characters");
+            return;
+          }
+          await addTweet(tweet);
          }}
        >
          <textarea name="tweet"></textarea>
          <button disabled={pending}>Tweet</button>
          {pending && <p>Submitting...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
```

`addTweet` 関数はもはや `action` 属性に直接渡さないようになったので、引数に `formData` ではなく文字列を受け取るように変更しましょう。

```diff:app/actions.ts
- export async function addTweet(formData: FormData) {
+ export async function addTweet(tweet: string) {
  "use server";

- const tweet = formData.get("tweet") as string;

  await sql`INSERT INTO tweets (tweet, likes) VALUES (${tweet}, ${0})`;

  revalidatePath("/");
}
```

投稿された後にフォームの入力内容をリセットしたい場合には `useRef` でフォームの参照を取得して `reset` メソッドを呼び出すことができます。

```diff:app/TweetForm.tsx
+ import { useRef } from "react";

  export default function TweetForm() {
    const [error, setError] = useState<string | null>(null);
+   const formRef = useRef<HTMLFormElement>(null);

    return (
      <>
        <form
          action={async (formData) => {
            setError(null);
            const tweet = formData.get("tweet");
            if (typeof tweet !== "string" || tweet.length === 0) {
              setError("Tweet cannot be empty");
              return;
            }
            if (tweet.length > 140) {
              setError("Tweet cannot be longer than 140 characters");
              return;
            }
            await addTweet(tweet);
+           formRef.current?.reset();
          }}  
+         ref={formRef}
        >
```

続いてサーバサイドのバリデーションを考えてみましょう。Server Actions 関数内で `Error` を throw してもクライアント側でキャッチできないので、関数の返り値としてエラー情報を返すようにします。ここでは、関数の引数と返り値は React Server Component のプロトコルとしてシリアライズ可能な形式でなければいけないことに注意してください。

```diff:app/TweetForm.tsx
  export default function TweetForm() {
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    return (
      <>
        <form
          action={async (formData) => {
            setError(null);
            const tweet = formData.get("tweet");
            if (typeof tweet !== "string" || tweet.length === 0) {
              setError("Tweet cannot be empty");
              return;
            }
            if (tweet.length > 140) {
              setError("Tweet cannot be longer than 140 characters");
              return;
            }
-           await addTweet(tweet);
+           const result = await addTweet(tweet);
+           if (result.success === false) {
+             setError(result.error); 
+             return;
+           }
+           formRef.current?.reset();
          }}
          ref={formRef}
        >
```

```ts:app/actions.ts
const maxDailyTweets = 10;
let tweetCount = 0;

type Result =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function addTweet(tweet: string): Promise<Result> {
  "use server";
  if (tweetCount > maxDailyTweets) {
    return {
      success: false,
      error: "Exceeds the number of tweets possible per day",
    };
  }

  try {
    await sql`INSERT INTO tweets (tweet, likes) VALUES (${tweet}, ${0})`;
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to add tweet" };
  }

  tweetCount++;

  revalidatePath("/");
  return { success: true };
}
```

## まとめ

- Server Actions により、フォームの送信やボタンクリックなどクライアントサイドのイベントから、データベースの更新のようにサーバサイドの処理を呼び出すことができる
- データの更新後は `revalidatePath` または `revalidateTag` を呼び出してキャッシュを更新する
- `useOptimistic` で楽観的な更新を、`useFormStatus` フックを使うとフォームの送信状態を取得できる
- クライアントサイドのバリデーションの Server Actions 関数を呼び出す前に、サーバサイドのバリデーションの Server Actions 関数の返り値によって実施する

今回使用したコードは以下のレポジトリから参照できます。

https://github.com/azukiazusa1/nextjs-server-actions-example
