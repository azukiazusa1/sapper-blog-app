---
id: eUlzvBFiOXchSZ3UGnj4V
title: "Remix の SPA モード"
slug: "remix-spa-mode"
about: "Remix は React のフルスタックフレームワークで、Web 標準に基づいた API で構築されていることが特徴です。Node.js のようなサーバーサイドの JavaScript 環境で動作することを前提としています。しかし、現実の世界ではサーバーを用意せずに、静的なファイルをホスティングするだけの環境で Web アプリケーションを構築することが有効な場合も多くあります。このような需要を満たすために、Remix v2.5.0 から実験的に SPA モードが導入されました。"
createdAt: "2024-01-14T11:22+09:00"
updatedAt: "2024-01-14T11:22+09:00"
tags: ["Remix", "React", "Vite"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1iHj52uiyVL7aWghdvgF35/3f40de12f4d9a942af3f0d690a9a04d0/winter_yuki-usagi_illust_1803.png"
  title: "雪うさぎのイラスト"
selfAssessment: null
published: true
---
Remix は React のフルスタックフレームワークで、Web 標準に基づいて構築されていることが特徴です。例えばデータのミューテーションはクライアントからサーバーの API をコールするのではなく、HTML のフォームを使って行うといます。また `Response/Request` オブジェクトや `FormData` など、Web 標準の API を活用することで、開発者が学習コストを抑えながら、Web アプリケーションを構築できるようになっています。

Remix は UX や SEO に優れた Web アプリケーションを構築する目的で、Node.js のようなサーバーサイドの JavaScript 環境で動作することを前提としています。

しかし、現実の世界ではフロントエンドのためにサーバーを用意せずに、静的なファイルをホスティングするだけの環境で Web アプリケーションを構築することが有効な場合も多くあります。サーバーサイドで動作することによりメリットは確かにありますが、サーバー管理や運用のコストも無視できません。
SEO や Web Vitals などの指標が収益に直結しないアプリケーション（例えば社内向けのアプリケーション）では、サーバーを用意することによるコストに見合うメリットがない場合もあります。

ほかにも長い間運用されているアプリケーションでは Java や PHP などのバックエンドのテンプレートによるレンダリングを使っていることもあるでしょう。このようなアプリケーションを React に移行していく際には、既存のバックエンドと統合して、徐々に React によるレンダリングを導入していくことが有効な場合もあります。

このような需要を満たすために、Remix v2.5.0 から実験的に SPA モードが導入されました。SPA モードでは [クライアントデータ API](https://remix.run/docs/en/main/guides/client-data) をもとに構築されています。

## SPA モードの概要

Remix の SPA モードは [React Router](https://reactrouter.com/en/main) + [Vite](https://ja.vitejs.dev/) をベースとしており、以下の Remix の機能が利用できます。

- ファイルベースのルーティング
- `route.lazy` による自動的なコード分割
- [`<Link prefetch>`](https://remix.run/docs/en/main/components/link#prefetch) によるルートモジュールの事前読み込み
- [`<Meta>`](https://remix.run/docs/en/main/components/meta)、[`<Links>`](https://remix.run/docs/en/main/components/links) コンポーネントによる `<head>` タグの制御

SPA モードではサーバーランタイムを使わないため、データローディングやミューテーションは [クライアントデータ API](https://remix.run/docs/en/main/guides/client-data) のみ使用できます。

ビルド時には `root.tsx` ファイルの [`HydrateFallback`](https://remix.run/docs/en/main/route/hydrate-fallback) コンポーネントをエントリーポイントとして、 `index.html` が生成されます。`/about` や `/blog` などのルートがあったとしても、出力されるファイルは `index.html` のみです。そのため、静的ファイルを配信する CDN やサーバーの設定で、`/about` にアクセスしたときには `index.html` を返すように設定する必要があります。

## SPA モードの使い方

Remix の SPA モードを使用する場合には、`vite.config.ts` で `unstable_ssr: false` を設定します。

```ts:vite.config.ts
// vite.config.ts
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    remix({
      unstable_ssr: false,
    }),
  ],
});
```

または、以下のコマンドで SPA モードのテンプレートアプリケーションを作成できます。

```sh
npx create-remix@latest --template remix-run/remix/templates/spa
```

開発時には `remix vite:dev` コマンドを実行します。

```sh
npm run remix vite:dev
```

ビルドは `remix build` コマンドです。

```sh
npm run remix build
```

ビルドの成果物はデフォルトで `build/client/index.html` に出力されます。以下のように `npx http-server` コマンドでファイルを配信するサーバーを起動して確認できます。

```sh
npx http-server -p 3000 build/client/
```

## SPA モードでの開発における相違点

SPA モードではサーバーランタイムを使わないため、普段の Remix で使えるいくつかの機能の制限があります。ここでは、SPA モードでの開発時に注意する点をいくつか紹介します。普段の Remix のことを便器上 SSR モードと呼ぶことにします。

- データの取得
- データのミューテーション
- `headers` 関数
- `HydrateFallback` コンポーネント

### データの取得

SPA モードで大きく異なる点は、データの取得・更新をすべてクライアントサイドで行う必要がある点です。SSR モードにおいては表示に必要なデータを取得する際には、`loader` という関数を `export` することで、サーバーサイドでデータを取得し、コンポーネントでは `useLoaderData` フックを使ってデータを取得できます。

```tsx:app/routes/blog._index.tsx
import { useLoaderData } from "@remix-run/react";

export async function loader() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
}

export default function Blog() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Blog</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
```

SPA モードではサーバーランタイムを使わないため、`loader` 関数を `export` していると例外が発生します。

```sh
[vite] Internal server error: SPA Mode: 1 invalid route export(s) in `routes/blog._index.tsx`: `loader`. See https://remix.run/future/spa-mode for more information.
```

SPA モードでは `loader` 関数を `export` する代わりに、[clientLoader](https://remix.run/docs/en/main/route/client-loader) 関数を `export` します。`clientLoader` 関数は `loader` 関数と同じようにデータを取得するための関数ですが、サーバーでは実行されず、クライアントサイドでのみ実行されます。

```tsx:app/routes/blog._index.tsx {3-5}
import { useLoaderData } from "@remix-run/react";

export async function clientLoader() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
}

export default function Blog() {
  const data = useLoaderData<typeof clientLoader>();
  return (
    <>
      <h1>Blog</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.id}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </>
  );
}
```

なお、`clientLoader` 関数は引数のオブジェクトのプロパティとして `params`, `request`, `serverLoader` を受け取りますが、SPA モードでは `serverLoader` 関数を呼び出すことができません。`serverLoader` 関数を呼び出していると、ビルド時ではなく、実行時に例外が発生する点に注意が必要です。

```tsx:app/routes/blog._index.tsx
import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  useLoaderData,
} from "@remix-run/react";

export async function clientLoader({ serverLoader }: ClientLoaderFunctionArgs) {
  // You cannot call serverLoader() in SPA Mode (routeId: "routes/blog")
  await serverLoader();
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  return data;
}
```

### データのミューテーション

SSR モードでは `action` という関数を `export` することで、サーバーサイドでフォームの POST リクエストを処理できます。`action` 関数は `<form>` がサブミットされたときに実行され、引数の `request.formData()` でフォームのデータを取得できます。

```tsx:app/routes/blog.new.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  console.log(body);
  // await createBlogPost({
  //   title: body.get("title")!,
  //   content: body.get("content")!,
  // });
  return redirect(`/blog`);
}

export default function New() {
  return (
    <div>
      <h1>Create Blog Post</h1>
      <Form method="post">
        <input type="text" name="title" />
        <textarea name="content" />
        <button type="submit">Create</button>
      </Form>
    </div>
  );
}
```

お察しのとおりかもしれませんが、データの取得と同様に、SPA モードでは `action` 関数を `export` することはできません。SPA モードでは `action` 関数の代わりに、[clientAction](https://remix.run/docs/en/main/route/client-action) 関数を `export` します。この関数はクライアントサイドでのみ実行されます。

```tsx:app/routes/blog.new.tsx
// @remix-run/node" の redirect は使えない
import { ClientActionFunctionArgs, Form, redirect } from "@remix-run/react";

export async function clientAction({ request }: ClientActionFunctionArgs) {
  const body = await request.formData();
  console.log(body);
  // await createBlogPost({
  //   title: body.get("title")!,
  //   content: body.get("content")!,
  // });
  return redirect(`/blog`);
}
```

`clientAction` 関数の引数のオブジェクトのプロパティとして受け取れる `serverAction` 関数は、SPA モードでは呼び出すことができません。`serverAction` 関数を呼び出していると、ビルド時ではなく、実行時に例外が発生する点に注意が必要です。

```tsx:app/routes/blog.new.tsx
export async function clientAction({
  request,
  serverAction,
}: ClientActionFunctionArgs) {
  // You cannot call serverAction() in SPA Mode (routeId: "routes/blog.new")
  await serverAction();
  // ...
}
```

### `headers` 関数

SSR モードでは `headers` という関数を `export` することで、レスポンスヘッダーを設定できます。`headers` 関数は `Response` オブジェクトを返す関数で、`Response` オブジェクトの `headers` プロパティにヘッダーを設定します。

```tsx:app/routes/blog._index.tsx
import type {
  HeadersFunction,
} from "@remix-run/node";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=300, s-maxage=3600",
});
```

SPA モードで `headers` 関数を `export` すると例外が発生します。Remix で `headers` 関数を代替する方法は存在しません。ファイルを配信する CDN などでヘッダーを設定することになるでしょう。

### `HydrateFallback` コンポーネント

SPA モードでは `root.tsx` の `HydrateFallback` コンポーネントがエントリーポイントとなります。

```tsx:app/root.tsx
import {
  Links,
  LiveReload,
  Meta,
  Scripts,
} from "@remix-run/react";

export function HydrateFallback() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <p>Loading...</p>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
```

SSR モードにおける `HydrateFallback` コンポーネントは [clientLoader](https://remix.run/docs/en/main/route/client-loader) によるデータの取得中にルートのコンポーネントのかわりに表示されるコンポーネントです。

```tsx :app/routes/blog._index.tsx
// 最初の SSR リクエストでは loader が実行される
export async function loader() {
  const data = getServerDataFromDb();
  return json(data);
}

// クライアントナビゲーションの場合は clientLoader が実行される
// loader を使用せずに clientLoader のみを定義することもできる
export async function clientLoader() {
  const data = await fetchDataFromApi();
  return data;
}

// loader と clientLoader を併用する場合、
// hydrate プロパティを true に設定してハイドレーションの実行が必要なことを Remix に伝える
// ハイドレーションが必要な場合に HydrateFallback が表示される
// clientLoader のみを利用している場合には、自動的に true に設定される
// https://remix.run/docs/en/main/route/client-loader#clientloaderhydrate
clientLoader.hydrate = true;

// これはルートコンポーネント
export default function Blog() {
  const data = useLoaderData<typeof loader>();
  return <>...</>;
}

// clientLoader のみを定義していて、表示の大部分をデータに依存する場合など、
// ルートコンポーネントを SSR リクエスト中に表示したくない場合がある
// HydrateFallback は SSR 時にフォールバックとして表示され、
// clientLoader が完了するとルートコンポーネントに置き換わる
export function HydrateFallback() {
  return <>Loading...</>;
}
```

SSR モードでは `clientLoader` と合わせて `HydrateFallback` コンポーネントを使うことが想定されており、個別のルートに対して `HydrateFallback` コンポーネントを設定できます。一方 SPA モードでは `HydrateFallback` コンポーネントは `root.tsx` 以外の場所で使用することはできません。`root.tsx` 以外の場所で `HydrateFallback` コンポーネントを `export` した場合例外が発生します。

```sh
[vite] Internal server error: SPA Mode: Invalid `HydrateFallback` export found in `routes/blog._index.tsx`. `HydrateFallback` is only permitted on the root route in SPA Mode. See https://remix.run/future/spa-mode for more information.
```

## SPA モードにおける機能の制限

SPA モードではサーバーランタイムを使わないため、普段の Remix で使えるいくつかの機能の制限があります。

- プログレッシブエンハンスメント
- パフォーマンスの最適化
- サーバーであることが前提の機能

### プログレッシブエンハンスメント

Remix では [プログレッシブエンハンスメント](https://remix.run/docs/en/main/discussion/progressive-enhancement) を備えています。Remix におけるプログレッシブエンハンスメントでは、JavaScript が無効な環境にいるユーザーに対しては最低限の機能を提供して、JavaScript が有効な環境にいるユーザーに対してはより高度な機能を行います。

例えば、データのミューテーションにおいては Remix は HTML の `<form>` を使用するため、JavaScript が無効な環境にいるユーザーに対しても HTML のフォームのサブミットを実行することで実現できます。その上で JavaScript が有効な環境にいるユーザーに対しては、フォームのサブミットを JavaScript でインターセプトすることでより高度なユーザー体験を提供できます。

SPA モードではデータの取得・ミューテーションをすべてクライアントサイドで行う必要があるため、プログレッシブエンハンスメントを行うことができません。JavaScript が無効な状態である場合。`root.tsx` ファイルの `HydrateFallback` コンポーネントが表示された状態のままになります。

### パフォーマンスの最適化

サーバーサイドでデータを取得してレンダリング、またはデータのミューテーションを行うことにより、以下のようなメリットがあります。

- クライアントサイドよりも近い距離でデータを取得できる
- クライアントサイドの JavaScript のバンドルサイズを小さくできる
- データ更新時のラウンドトリップの削減
- [ストリーミング](https://remix.run/docs/en/main/guides/streaming#1-project-setup)

SPA モードではこれらのメリットを享受することができません。

### サーバーであることが前提の機能

以下のようなサーバーで使われることが前提の機能は SPA モードでは使用できません。

- [セッション](https://remix.run/docs/en/main/utils/sessions)
- [クッキー](https://remix.run/docs/en/main/utils/cookies)
- （サーバーサイドでの）[リダイレクト](https://remix.run/docs/en/main/utils/redirect)

## まとめ

- Remix の SPA モードは、サーバーサイドの JavaScript 環境を必要としない、フロントエンドのみの Web アプリケーションを構築するためのモード
- SPA モードでビルドすると、`root.tsx` ファイルの `HydrateFallback` コンポーネントから `index.html` が生成される。`/about` や `/blog` などのルートがあったとしても、出力されるファイルは `index.html` のみなので、静的ファイルを配信する CDN やサーバーの設定で、`/about` にアクセスしたときには `index.html` を返すように設定する必要がある
- SPA モードではサーバーランタイムを使わないため、普段の Remix で使えるいくつかの機能の制限がある。例えば、データの取得・ミューテーションはすべてクライアントサイドで行う必要がある

## 参考

- [SPA Mode - Remix](https://remix.run/docs/en/main/future/spa-mode)
- [🗺️ Remix SPA Target · remix-run/remix · Discussion #7638](https://github.com/remix-run/remix/discussions/7638)
