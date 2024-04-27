---
id: ycgBY7jU3tV6WRBA3Lm0p
title: "Remix v2.9 で導入された Single Fetch"
slug: "single-fetch-in-remix"
about: "Remix v2.9 で導入された Single Fetch はクライアントサイドでのページ遷移が行われた際に、サーバーへの複数の HTTP リクエストを並行して行う代わりに、1 つの HTTP リクエストを実行しまとめてレスポンスを返す機能です。Single Fetch は v2.9 ではフィーチャーフラグとして提供されており、v3 以降ではデフォルトの挙動となります。"
createdAt: "2024-04-27T14:08+09:00"
updatedAt: "2024-04-27T14:08+09:00"
tags: ["Remix"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4DVzjypAQSqn27JG6jP3tf/b202d3977496f29ced7c06adcb655e8e/wagashi_kashiwamochi_illust_3195-768x672.png"
  title: "柏餅のイラスト"
quizzes:
  - question: "シリアライズ形式の変更による修正が必要ないのはどれか？"
    answers:
      - text: "`loader`/`action` 関数でオブジェクト返している場合"
        correct: false
        explanation: "オブジェクトをそのまま返している場合は、`turbo-stream` によるストリーミング形式が使用されるため、修正が必要です。"
      - text: "`loader`/`action` 関数で `json` 関数の結果を返している場合"
        correct: true
        explanation: "`json` 関数を使用している場合は引き続き `JSON.stringify` によるシリアライズが行われるため、修正が必要ありません。"
      - text: "`loader`/`action` 関数で `defer` 関数の結果を返している場合"
        correct: false
        explanation: "`defer` 関数を使用している場合は、`turbo-stream` によるストリーミング形式が使用されるため、修正が必要です。"
  - question: "Single Fetch において正しく型推論が行われるための修正とし正しいものはどれか？"
    answers:
      - text: "`useLoaderData` の型引数の `typeof loader` を `SingleFetchLoader<typeof loader>` に変更する"
        correct: false
        explanation: "`SingleFetchLoader` という型は存在しません。`useLoaderData` を使用している場合は変更は不要です。"
      - text: "`tsconfig.json` の `includes` に `node_modules/@remix-run/react/future/single-fetch.d.ts` を追加する"
        correct: true
      - text: "`loader` 関数で値を返す際に常にオブジェクトを返すように変更する"
        correct: false
      - text: "正しい型推論は行われなくなるため、`as` を使って型をキャストする"
        correct: false
  - question: "`headers` 関数の代わりに用いられる適切な手段はなにか"
    answers:
      - text: "代替手段はないため、レスポンスヘッダーは設定できなくなる"
        correct: false
      - text: "設定ファイル `remix.config.js` でヘッダーを設定する"
        correct: false
      - text: "`loader`/`action` 関数の引数として受け取る `response` オブジェクトを直接操作する"
        correct: true
      - text: "`loader`/`action` 関数の引数として受け取る `headers` オブジェクトを直接操作する"
        correct: false
published: true
---

Remix に対してドキュメントリクエストが行われると、Remix はリクエストパスにマッチしたすべての [loader](https://remix.run/docs/en/main/route/loader) 関数を呼び出し、それらの結果を組み合わせてページを構築します。対して、ユーザーがクライアントサイドでのページ遷移を行った場合、Remix はそれぞれの `loader` 関数ごとに個別のリクエストをサーバーに対して行います。

このように、ドキュメントリクエストを行う場合とクライアントサイドでのページ遷移する場合で、Remix は一貫性のない方法でデータ取得を行っているという問題点がありました。

Remix v2.9 で導入された Single Fetch はクライアントサイドでのページ遷移が行われた際に、サーバーへの複数の HTTP リクエストを並行して行う代わりに、1 つの HTTP リクエストを実行しまとめてレスポンスを返す機能です。いくつかの API の破壊的変更はありますが、アプリケーションのコードに大きな変更を加えることなく、Single Fetch を導入するできます。Single Fetch は v2.9 ではフィーチャーフラグとして提供されており、v3 以降ではデフォルトの挙動となります。

Single Fetch には以下のような利点があげられています。

- CDN キャッシュカバレッジの向上
- よりシンプルなヘッダーの操作
- Remix 自体のコードの簡素化

また将来以下の機能を実装するための準備としての役割も担っています。

- [Middleware](https://github.com/remix-run/remix/discussions/7642)
- [Server Context](https://github.com/remix-run/remix/discussions/7644)
- 静的データの事前生成
- 効率的なサブリクエストのキャッシュ
- React Server Components のサポート
- より詳細な再検証

## Single Fetch を導入する

それでは実際に Single Fetch の挙動を試してみましょう。サンプルコードとして、記事の一覧を取得する画面を考えます。この画面はネストされたルートで構成されており、`/blog/1` に遷移すると、`/blog` と `/blog/1` の両方のパスにマッチします。

```tsx:app/routes/blog.tsx
// /blog
import { Link, Outlet, json, useLoaderData } from "@remix-run/react";
import { getPosts } from "~/data";
export async function loader() {
  const posts = await getPosts();
  return json({
    posts,
  });
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Blog</h1>
      <Link to="/blog/new">Create Blog Post</Link>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/blog/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>

      <Outlet />
    </>
  );
}
```

```tsx:app/routes/blog.$id/routes.tsx
// /blog/1
import type { LoaderFunctionArgs } from "@remix-run/node";
import { defer, json } from "@remix-run/node";
import { Await, Outlet, useLoaderData } from "@remix-run/react";
import { getComments, getPost } from "~/data";
import Comments from "./Comments";
import { Suspense } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (params.id === undefined) {
    throw new Error("No ID provided");
  }
  const comments = getComments(Number(params.id));
  const post = await getPost(Number(params.id));
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return defer({ post, comments });
};

export default function BlogPost() {
  const { post, comments } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>{post.title}</h1>
      <time>{post.createdAt}</time>
      <p>{post.body}</p>

      <Suspense fallback={<p>Loading comments...</p>}>
        <Await resolve={comments}>
          {(resolveComments) => <Comments comments={resolveComments} />}
        </Await>
      </Suspense>
    </div>
  );
}
```

トップページから `/blog/1` への遷移を行った場合、`/blog` と `/blog/1` のそれぞれマッチしたパスの `loader` 関数が呼び出されます。Devtools のネットワークタブを確認すると、確かに 2 つのリクエストが行われていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5vqdo1ZNneq3rOhHCUbW0G/73790585135011c4b2de0344b5965659/__________2024-04-27_15.33.07.png)

次に、Single Fetch フィーチャーフラグを有効にして挙動を確認してみましょう。`vite.config.js` で `future.unstable_singleFetch` を有効にします。

```js:vite.config.js {14-18}
import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// nativeFetch: true が必要
// https://github.com/remix-run/remix/issues/9324
installGlobals({
  nativeFetch: true,
});

export default defineConfig({
  plugins: [
    remix({
      future: {
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
  ],
});
```

再度トップページから `/blog/1` への遷移を行い、Devtools のネットワークタブを確認すると、1 つのリクエストのみが行われていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7J2TzKl8gyc8qbYCPQp2qR/8cf7b7c32b7ab5dda54598d5574b92d6/__________2024-04-27_15.54.56.png)

## 破壊的な変更

Single Fetch にはいくつかの破壊的な変更があります。

- 新しいストリーミング形式による、データのシリアライズ形式の変更
- `action` 関数の `4xx`/`5xx` エラーの際の再検証がオプトインとなる
- `headers` 関数が使用されなくなる

### 新しいストリーミング形式

Remix では `loader`/`action` 関数でデータをクライアントと受け渡しする際に、`JSON.stringify` によりシリアライズを、[defer](https://remix.run/docs/en/main/guides/streaming#3-deferring-data-in-loaders) 関数で Promise を返す際にはカスタムのストリーミング形式を使用していました。Single Fetch では [turbo-stream](https://github.com/jacob-ebey/turbo-stream) を内部で使用するようになり、JSON よりも複雑なデータ構造をシリアライズ、デシリアライズが可能になります。

`turbo-stream` は以下のデータ型を新たにサポートします。

- `BigInt`
- `Date`
- `Error`
- `Map`
- `Set`
- `URL`
- `Promise`
- `RegExp`
- `Symbol`

`loader`/`action` 関数において上記のデータ型を使用していた場合にコードの変更が必要となるかどうかは、どのような方法で値を返しているかにより変わります。`json` 関数を使用している場合には、引き続き `JSON.stringify` によるシリアライズが行われます。そのため、コードを変更する必要はありません。

下記の例では `Date` 型が自動で `string` 型に変換されています。

```ts:app/routes/blog.tsx
type Post = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
};

export async function loader() {
  const posts = await getPosts();
  return json({
    posts,
  });
}

export default function Blog() {
  const { posts } = useLoaderData<typeof loader>();
  console.log(typeof posts[0].createdAt); // string
  // ...
}
```

`defer` 関数またはオブジェクトをそのまま返していた場合には、`turbo-stream` によるストリーミング形式が使用されるようになります。`Date` 型は `string` 型に変換されず、そのまま `Date` 型として受け取るように変更されます。

```ts:app/routes/blog.$id/routes.tsx
type Post = {
  id: number;
  title: string;
  body: string;
  createdAt: Date;
};

export async function loader(params) {
  const posts = getPost(params.id);
  return posts;
}

export default function Blog() {
  const data = useLoaderData<typeof loader>();
  console.log(typeof data.createdAt); // Date

  // ...
}
```

このことは `loader` 関数から Promise を返すために、もはや `defer` 関数を使用する必要がないことを意味します。`defer` 関数を使用している箇所は単純なオブジェクトを返すように変更できます。

```ts:app/routes/blog.$id/routes.tsx {7}
export async function loader(params) {
  const comments = getComments(params.id);
  const post = await getPost(params.id);
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
  return { post, comments };
}
```

同様に以前までのシリアライズ形式を維持する必要がないのであれば、`json` 関数を使用せずにオブジェクトをそのまま返すことが好ましいでしょう。関数の返却方法の違いにより、型変換の一貫性が損なわれることを避けることができます。

#### 型定義の修正

また、Single Fetch において正しく型推論が行われるようにするためにいくつかの修正が必要です。まずは `tsconfig.json` の `includes` に `"node_modules/@remix-run/react/future/single-fetch.d.ts"` を追加します。

```json:tsconfig.json
{
  "include": [
    // ...
    "node_modules/@remix-run/react/future/single-fetch.d.ts"
  ]
}
```

`useLoaderData`, `useActionData`, `useRouteLoaderData`, `useFetcher` 関数を使用している場合にはコードの変更は不要です。

```tsx
export default function Blog() {
  const data = useLoaderData<typeof loader>();
  data.createdAt; // Date

  // ...
}
```

`useMatch` 関数では型をキャストする際に `UIMatch` から `UIMatch_SingleFetch` に変更する必要があります。

```diff
  let matches = useMatches();
- let rootMatch = matches[0] as UIMatch<typeof loader>;
+ let rootMatch = matches[0] as UIMatch_SingleFetch<typeof loader>;
```

`meta` 関数では `MetaArgs` から `MetaArgs_SingleFetch` に変更する必要があります。

```diff
  export function meta({
    data,
    matches,
- }: MetaArgs<typeof loader, { root: typeof rootLoader }>) {
+ }: MetaArgs_SingleFetch<typeof loader, { root: typeof rootLoader }>) {
    // ...
  }
```

### `action` 関数の再検証

以前までの Remix では [action](https://remix.run/docs/en/main/route/action) 関数の結果に関わらず、すべてのアクティブな `loader` を再検証していました。この動作をオプトアウトするためには [shouldRevalidate](https://remix.run/docs/en/main/route/should-revalidate) 関数を使用していました。

```tsx
export const loader = () => {
  // 決して変わることがないようなデータを返す
  return json({
    publicAccessKey: process.env.PUBLIC_ACCESS_KEY,
  });
};

// このルートは常に再検証を行わない
export const shouldRevalidate = () => false;
```

例として、記事の作成画面を見てみましょう。フォームが送信されると、サーバーサイドで実行される `action` 関数内で新しい記事を作成し、記事の一覧画面へリダイレクトします。

```tsx:app/routes/blog.new.tsx
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect } from "@remix-run/react";
import { createBlogPost } from "~/data";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  if (Math.random() > 0.5) {
    throw new Response("Server error", { status: 500 });
  }
  await createBlogPost({
    title: formData.get("title")?.toString() || "",
    body: formData.get("body")?.toString() || "",
  });
  return redirect(`/blog`);
}

export default function New() {
  return (
    <div>
      <h1>Create Blog Post</h1>
      <Form method="post">
        <input type="text" name="title" />
        <textarea name="body" />
        <button type="submit">Create</button>
      </Form>
    </div>
  );
}
```

新しい記事を作成した後、`loader()` 関数が実行され新しい記事が一覧に表示されていることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2IIQwH3oKzllLfxAqOgp1o/c4145cd3699e29d3216aec3f0124cc3d/_____2024-04-27_16.48.26.mov" controls></video>

Single Fetch では `action` 関数がステータスコード `4xx/5xx` を設定して返した場合にデフォルトで再検証が行われなくなります。`action` 関数が `4xx/5xx` エラーを返す多くの場合では、データのミューテーションを行っていないので、データを再読込する必要がないと考えられるためこのような変更が行われました。

引き続き `4xx/5xx` を返す際に再検証を行いたい場合には、`loader` 関数を呼び出しているルートごとに `shouldRevalidate` 関数を export し、
返り値として `true` を返すことで常に再検証が行われるようになります。

```tsx:app/routes/blog.tsx
export const loader = () => {
  const posts = getPosts();
  return json(posts);
};

// action 関数が実行されると常に loader 関数を再検証する
export const shouldRevalidate = () => true;
```

`shouldRevalidate` 関数の引数の `unstable_actionStatus` には直前の `action` 関数で返されたのステータスコードが渡されます。このプロパティを使用することで、特定のステータスコードの場合に再検証するかどうかを判断できます。

```tsx:app/routes/blog.tsx
import type { ShouldRevalidateFunction } from "@remix-run/node";

export const shouldRevalidate: ShouldRevalidateFunction = ({
  unstable_actionStatus,
}) => {
  if (unstable_actionStatus === 200) {
    return true;
  }
  return false;
};
```

### `headers` 関数の廃止

[headers](https://remix.run/docs/en/main/route/headers) 関数は、ルートごとに独自のレスポンスヘッダーを設定するために使用されていました。

```tsx:app/routes/blog.tsx
import type { HeadersFunction } from "@remix-run/node";

export const headers: HeadersFunction = () => ({
  "x-my-custom-header": "my-custom-value",
});
```

Single Fetch では `headers` 関数を export していても、その値はもはや使用されません。代わりに `loader/action` 関数の引数で受けとる `response` オブジェクトを直接変更することでレスポンスヘッダーやステータスコードを設定できます。

```tsx:app/routes/blog.tsx
export async function loader({ response }: LoaderFunctionArgs) {
  response.status = 200;
  response.headers.append("x-my-custom-header", "my-custom-value");
  const posts = getPosts();
  return posts;
}
```

`loader/action` 関数内で受け取る `response` オブジェクトは各ルートの `loader/action` ごとに異なるインスタンスとなります。ネストされたルートにおいて複数の `loader` 関数が呼び出される場合でも、別のルートの `response` オブジェクトは参照できません。

ルートごとに異なる値が設定されている場合には、以下のルールに従って値が決定されます。

- ステータスコード
  - すべてのステータスコードが設定されていない、または値が 300 未満の場合、最も深いルート（この例では `/blog/1`）のステータスコードが使用される
  - ステータスコードが 300 以上の場合、最も浅いルート（この例では `/blog`）のステータスコードが使用される
- ヘッダー
  - すべてのヘッダー操作が完了した後に、ヘッダーの操作が再現され新しいヘッダーが作成される。この順番は `action` 関数 → `loader` 関数の順で上から下へと適用される
  - `header.set` では子ハンドラが親ハンドラの値を上書きする
  - `header.append` では親ハンドラと子ハンドラの両方から同じ値を設定するために使われる
  - `header.delete` では親ハンドラの値を子ハンドラから削除するために使用される。子ハンドラが親ハンドラの値を削除することはできない

Single Fetch ではステータスコードを設定するために、新たに `Response` オブジェクトを生成して返す必要がなくなりました。例えば 404 ステータスコードを返す場合は以下のように `Response` オブジェクトを生成して `throw` していました。

```tsx:app/routes/blog.$id/routes.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  if (!post) {
    throw new Response("Not Found", { status: 404 });
  }
}
```

これをは以下のように変更できます。

```tsx:app/routes/blog.tsx
export async function loader({ params, response }: LoaderFunctionArgs) {
  if (!post) {
    response.status = 404;
    throw response;
  }
}
```

同様に `redirect()` 関数によるリダイレクトも引数の `response` オブジェクトを `throw` する方法に変更できます。

```tsx:app/routes/blog.new.tsx
export async function action({ request, response }: ActionFunctionArgs) {
  response.status = 302;
  response.headers.set("Location", "/blog");
  throw response;
}
```

## `clientLoader` 使用時の挙動の違い

[clientLoader](https://remix.run/docs/en/main/route/client-loader) を使用している場合には Single Fetch の挙動が少々変わります。ルートファイルで `clientLoader` を export している場合、Single Fetch がオプトアウトされそのルートのみ単独でデータ取得が実行され、その他の `clientLoader` を export していないルートのみでリクエストがまとめられます。

例として `/dashboards` と `/dashboards/invoice` ではそれぞれ `loader` のみが `export` され、`/dashboards/invoice/1` では `clientLoader` が `export` されている場合を考えます。

```tsx:app/routes/dashboards.tsx
export async function loader() {
  const dashboards = await getDashboards();
  return { dashboards };
}
```

```tsx:app/routes/dashboards.invoice.tsx
export async function loader() {
  const invoices = await getInvoices();
  return { invoices };
}
```

```tsx:app/routes/dashboards.invoice.$id/routes.tsx
export async function loader({ params }: LoaderFunctionArgs) {
  const invoice = await getInvoice(params.id);
  return { invoice };
}

export async function clientLoader({ params, serverLoader }: ClientLoaderFunctionArgs) {
  const serverData = await serverLoader();
  const details = await getInvoiceDetails(params.id);
  return {
    ...serverData,
    ...details,
   };
}
```

ユーザーが `/` から `/dashboards/invoice/1` に遷移した場合、`/dashboards` と `/dashboards/invoice` の `loader` 関数が実行され、これらのリクエストはまとめられます。

```sh
GET /dashboards/invoice/1.data?_routes=routes/dashboards,routes/invoice
```

そして `/dashboards/invoice/1` が呼び出されると、`serverLoader` が実行され、独立したリクエストとしてデータ取得が行われます。

```sh
GET /dashboards/invoice/1.data?_routes=routes/dashboards/invoice/1
```

## まとめ

- Remix v2.9 で導入された Single Fetch は、クライアントサイドでのページ遷移が行われた際に、サーバーへの複数のデータ取得を行う代わりに、1 つのデータ取得を行う機能
- Single Fetch にはいくつかの破壊的な変更があり、新しいストリーミング形式、`action` 関数の再検証、`headers` 関数の廃止が含まれる
- `loader`/`action` 関数が `json()` 関数を使用して値を返している場合にはコードの変更は不要。`defer` 関数を使用している、またはオブジェクトをそのまま返している場合には、シリアライズ形式が変更されるためコードの変更が必要
- `action` 関数が `4xx/5xx` エラーを返す場合には再検証がデフォルトで実行されなくなる。再検証を行いたい場合には `shouldRevalidate` 関数で `true` を返す
- `headers` 関数はもはや使用されない。代わりに `loader`/`action` 関数内で受け取る `response` オブジェクトを直接変更することでレスポンスヘッダーを設定できる

## 参考

- [🗺️ Single Data Fetch · remix-run/remix · Discussion #7640](https://github.com/remix-run/remix/discussions/7640)
- [Single Fetch | Remix](https://remix.run/docs/en/main/guides/single-fetch)
