---
id: HcGweZYTVPQAYGQUkl7cF
title: "React Server Components を手軽に扱うフレームワーク react-server"
slug: "react-server"
about: "react-server は Node.js で JavaScript ファイルを実行するかのように React Server Components を扱うことを目的としたフレームワークです。Next.js の機能が過剰に感じられるような小さなアプリケーションを開発する際に有用です。"
createdAt: "2025-02-01T10:57+09:00"
updatedAt: "2025-02-01T10:57+09:00"
tags: ["React", "React Server Components"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3J3O1Nlkl7ZpyX0foboIUd/97f5be4422aeb574a13d9074386a1993/shark-fin_21263-768x591.png"
  title: "shark-fin 21263-768x591"
audio: null
selfAssessment:
  quizzes:
    - question: "アプリケーションをビルドする際に使用するコマンドはどれか？"
      answers:
        - text: "npx react-server ./src/App.tsx"
          correct: false
          explanation: null
        - text: "npx react-server build ./src/App.tsx"
          correct: true
          explanation: null
        - text: "npx vite ./src/App.tsx"
          correct: false
          explanation: null
        - text: "npx vite build ./src/App.tsx"
          correct: false
          explanation: null
    - question: "レスポンスキャッシュを有効にするために使われるフックはどれか？"
      answers:
        - text: "useCache()"
          correct: false
          explanation: null
        - text: "useResponseCache()"
          correct: true
          explanation: null
        - text: "useCacheConsumer()"
          correct: false
          explanation: null
        - text: "useCacheContext()"
          correct: false
          explanation: null
published: true
---
2025 年 2 月現在 React Server Components を扱う方法として最も知られているのは Next.js を利用する方法でしょう。実際に Next.js は React Server Components が React の Canary の機能である段階で、すでに安定した機能として提供されていました。このため React Server Components が Next.js 固有の機能だと思われていたこともあったかもしれません。

-> React Canary とは安定版のバージョンがリリースされる前に React コミュニティに提供するリリースチャンネルです。Canary リリースでリリースされた機能には破壊的な変更が含まれるため、開発者が直接本番環境で使用することは想定されていません。Canary リリースの機能はフレームワークを介して使用して、フレームワークのレイヤーで破壊的変更を吸収して提供することが想定されています。Next.js は React Server Components に限らず Canary リリースの機能を積極的に取り入れているため、今後も React の新しい機能をいち早く利用できるフレームワークとして利点があります。

React Server Components を使用したい場合に Next.js を採用するのは確かに有効な選択肢です。しかし、小規模なアプリケーションを開発するような場合には Next.js の機能が過剰に感じられるかもしれません。例えばキャッシュやデータフェッチの仕様が複雑であったり、いざとなったら Next.js のソースコードを読み込んで理解する覚悟が必要といった意見が見受けられます。[^1][^2]

React Server Components を手軽に扱うためのフレームワークとして react-server が開発されました。このフレームワークの目的は、Node.js で JavaScript ファイルを実行するかのように React Server Components を扱うことです。react-server は [Vite](https://vitejs.dev/) ベースのフレームワークであり、React Server Components だけでなく Server Actions もサポートされています。

https://react-server.dev/

この記事では react-server の基本的な使い方について紹介します。

## プロジェクトを作成する

まずは react-server のプロジェクトを作成します。Node.js の v20.0.0 以上もしくは Bun v1.1.45 以上が必要です。Deno は 2025 年 2 月現在サポートされていません。

以下のコマンドを実行してプロジェクトを作成した後に、`@lazarv/react-server` をインストールします。`react` と `react-dom` は react-server に含まれているため、個別にインストールする必要はありません。

```bash
mkdir my-react-server-app
cd my-react-server-app
npm init -y
npm install @lazarv/react-server
```

早速初めての React Server Component を作成してみましょう。`src` ディレクトリを作成し、その中に `App.tsx` ファイルを作成します。react-server は TypeScript をデフォルトでサポートしています。

```jsx:src/App.tsx
import React from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};
export default async function App() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  const data = (await res.json()) as Todo;
  return (
    <>
      <h1>Hello, React Server Components</h1>
      <p>{data.title}</p>
      <p>{data.completed ? "Completed" : "Not completed"}</p>
    </>
  );
}
```

以下のコマンドでサーバーを起動します。

```bash
npx react-server ./src/App.tsx
```

http://localhost:3000 にアクセスすると、`Hello, React Server Components!` と表示されるはずです。ファイルを編集すると HMR によりリアルタイムに変更が反映されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4gDOiG2ogbZ8LhIWMrymFL/dd9940e9dc6f82078f6921754f2bb5d9/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-01_12.06.02.png)

ビルドは以下のコマンドで行います。

```bash
npx react-server build ./src/App.tsx
```

ビルドが完了すると `.react-server` ディレクトリが作成され、その中にビルドされたファイルが格納されます。ビルドしたファイルは以下のコマンドで実行できます。

```bash
npx react-server start
```

## Vite との統合

react-server は Vite の [Environment API](https://ja.vite.dev/guide/api-environment) 上で構築されています。つまり react-server は多くの Vite の機能やプラグインといっしょに使うことができるのです。Vite で作成した React アプリケーションは簡単に react-server に移行できます。

まずは以下のコマンドで Vite のプロジェクトを作成します。

```bash
npm create vite my-react-server-app -- --template react-ts
```

続いて `index.html` の中身を `src/main.tsx` に移動します。

```tsx:src/main.tsx
import App from "./App";
import "./index.css";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React + TS</title>
      </head>
      <body>
        <div id="root">
          <App />
        </div>
      </body>
    </html>
  );
}
```

`App.tsx` では `useState()` を使用しているため、`"use client"` ディレクティブを追加して Clietn Actions としてマークする必要があります。

```tsx:src/App.tsx {1}
"use client";
import { useState } from 'react'
import reactLogo from './assets/react.svg'
```

依存関係から `react` と `react-dom` を削除し、`@lazarv/react-server` をインストールします。

```bash
npm uninstall react react-dom
npm install @lazarv/react-server
```

`@larazv/react-server` React の experimental バージョンを使用しているため、`tsconfig.json` の `types` フィールドに `"react/experimental"` と `"react-dom/experimental"` を追加する必要があります。

```json:tsconfig.json
{
  "compilerOptions": {
    "types": ["react/experimental", "react-dom/experimental"],
  }
}
```

`package.json` の `scripts` フィールド `react-server` を使うように変更します。

```json:package.json
{
  "scripts": {
    "dev": "react-server ./src/main.tsx",
    "build": "react-server build ./src/main.tsx",
    "lint": "eslint .",
    "start": "react-server start"
  }
}
```

`npm run dev` でサーバーが起動できるかどうか確認してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/piIsIhKCQ1QQNTyH1up2K/479bcb9da27887698a7ca4253613e977/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-01_13.23.08.png)

Vite のプラグインも試してみましょう。Tailwind CSS をインストールしてみます。Tailwind CSS は v4 から Vite のプラグインとしてシームレスに使用できるようになりました。

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.ts` を編集し、`tailwindcss` プラグインを追加します。

```ts:vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()]
})
```

`index.css` で `tailwindcss` をインポートするように変更します。

```css:index.css
@import "tailwindcss";
```

`App.tsx` で Tailwind CSS を使用してみましょう。

```tsx:src/App.tsx
export default function App() {
  return (
    <div className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl">Hello, React Server Components</h1>
      <p className="text-lg">This is a React Server Components app with Tailwind CSS!</p>
    </div>
  );
}
```

`npm run dev` でサーバーを起動し、http://localhost:3000 にアクセスしてみましょう。Tailwind CSS のスタイルが Vite のプラグインを通じて適用されていることが確認できるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/6653Z0cbTIWpZyUBSrA0UV/ccfe6652052c8f646d0ced19ea507089/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-01_13.29.23.png)

## フレームワークの設定

ビルドや開発時のオプションはコマンドライン引数もしくは設定ファイルにより設定できます。設定ファイルは `react-server.config.{js,mjs,ts,mts.json}` という名前でプロジェクトのルートディレクトリに配置します。また本番環境でのみ有効にしたい設定は `react-server.production.config.{js,mjs,ts,mts,json}` という名前で配置します。

Vite を利用している場合には `vite.config.ts` を設定の一部として使用できます。以下の例は開発サーバーのポートを `9999` に変更する例です。

```ts:vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  port: 9999,
});
```

## ルーティング

react-server のルーティングは `<Route>` コンポーネントを使用して定義する方法と、ファイルベースのルーティングを使用する方法の 2 つがあります。ここではファイルベースのルーティングを使用する方法を紹介します。

react-server ではコマンドを実行する際にエントリーポイントを指定しない場合、自動でファイルベースのルーティングを使用します。

```bash
npx react-server
```

TypeScript を使用している場合にはルーティングは自動で型安全になります。例えば `<Link>` コンポーネントの `to` プロパティに存在しないパスを指定した場合には型チェックによりエラーが発生します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2v5XgY85z6i2ADVfsvfgog/ab32b15a6c7ee874dae72b249de04792/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-02-01_14.01.19.png)

型チェックを有効にするためには `tsconfig.json` の `include` フィールドに `.react-server/**/*.ts` を追加する必要があります。

```json:tsconfig.json
{
  "include": [".react-server/**/*.ts"]
}
```

ファイルベースルーティングは Next.js のファイルベースルーティングと互換性があり、以下の機能をそのまま利用できます。

- Static and dynamic routes
- Layouts and pages
- Nested routes
- Route groups
- Parallel routes
- Error handling
- Loading states

ルーティングの設定は `react-server.config.ts` もしくは `vit.config.ts` に記述します。`root` はルーティングの起点となるディレクトリを指定します。また `public` は静的ファイルを配置するディレクトリを指定します。

以下の設定例は Next.js と同じルールでルーティングを設定しています。

```ts:vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  root: "app",
  page: {
    include: ["**/page.tsx"],
  },
  public: "public",
});
```

以下のディレクトリ構造では `/`, `/about`, `/blog/[slug]` ルートが生成されます。

```bash
app
├── about
│   └── page.tsx
├── blog
│   └── [slug]
│       └── page.tsx
└── page.tsx
```

`page.tsx` ファイルでは React コンポーネントを `default` エクスポートすることでページを定義します。パスパラメータは関数の引数として受け取ることができます。

```tsx:app/blog/[slug]/page.tsx
type Params = {
  slug: string;
};


export default function BlogPage({ slug }: Params) {
  return <h1>Blog: {slug}</h1>;
}
```

`layout.tsx` ファイルを作成することで複数のページで共通するレイアウトを定義できます。`layout.tsx` は `children` プロパティを受け取り、`children` はページのコンテンツを表します。

```tsx:app/layout.tsx
export default function Layout({ children }) {
  return (
    <div>
      <header>Header</header>
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}
```

ナビゲーションには `@lazarv/react-server/navigation` パッケージの `Link` コンポーネントを使用します。

```tsx:app/page.tsx
import { Link } from "@lazarv/react-server/navigation";

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/about">About</Link>
      <Link href="/blog/hello">Blog</Link>
    </div>
  );
}
```

`<Link>` コンポーネントに `prefetch` プロパティを追加することでページのプリフェッチ有効にします。ユーザーがリンクにマウスでホバーした際にリンク先のページを事前に読み込むことで、ページ遷移時のパフォーマンスを向上させることが期待できます。

```tsx:app/page.tsx
import { Link } from "@lazarv/react-server/navigation";

export default function Home() {
  return <Link to="/about" prefetch>About</Link>;
}
```

デフォルトではプリフェッチされたページの内容は無期限でキャッシュされます。`prefetch` プロパティの値としてキャッシュの有効期限をミリ秒単位で指定できます。

```tsx:app/page.tsx
import { Link } from "@lazarv/react-server/navigation";

export default function Home() {
  // 5 秒後にキャッシュが破棄される
  return <Link to="/about" prefetch={5000}>About</Link>;
}
```

`useClient` フックの `prefetch` 関数を使用することで、任意のタイミングでページをプリフェッチできます。

```tsx:app/page.tsx
"use client";
import { Link } from "@lazarv/react-server/navigation";
import { useClient } from "@lazarv/react-server/client";

export default function Home() {
  const { prefetch } = useClient();
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => prefetch("/about")}>Prefetch About Page</button>
      <Link to="/about">About</Link>
    </div>
  );
}
```

## Static Generation

ページを静的な HTML として生成する場合にはページに一致するファイルを `*.static.ts` という名前で作成します。`/about` ページを静的に生成する場合には `app/about/page.static.tsx` というファイル名になります。

パスパラメータが含まれないページの場合は `true` を `default` エクスポートすることで静的ページとして扱われます。

```tsx:app/about/page.static.tsx
export default true;
```

パスパラメータが含まれるページの場合にはルートパラメータの配列を返すか、ルートパラメータの配列を返す非同期関数を `default` エクスポートします。

```tsx:app/blog/[slug]/page.static.tsx
export default async function() {
  return [{ slug: "hello" }, { slug: "world" }];
}
```

## キャッシュ

react-server では以下の 2 つのキャッシュがサポートされています。

- レスポンスキャッシュ
- in-memory キャッシュ

### レスポンスキャッシュ

`withCache` 関数を使用することで Server Component のレスポンスをキャッシュできます。レスポンスキャッシュにはキャッシュプロバイダーと `Cache-Control` ヘッダーの `stale-while-revalidate` の両方が使用されます。サーバーサイドのキャッシュはキャッシュの有効期限が切れるまで後続のリクエストで再利用されます。クライアントサイドのキャッシュは同じクライアントからのリクエストで再利用されます。

```tsx:app/page.tsx
import { withCache } from "@lazarv/react-server";

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return await res.json();
}

export default withCache(async function Home() {
  const data = await fetchData();
  return (
    <div>
      <h1>Home</h1>
      <p>{data.title}</p>
    </div>
  );
}, 30 * 1000); // キャッシュの有効期限を指定する
```

`withCache` の代わりに `useResponseCache` フックを使用することもできます。

```tsx:app/page.tsx
import { useResponseCache } from "@lazarv/react-server";

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return await res.json();
}

export default function Home() {
  useResponseCache(30 * 1000);
  const data = await fetchData();

  return (
    <div>
      <h1>Home</h1>
      <p>{data.title}</p>
    </div>
  );
}
```

### in-memory キャッシュ

`useCache` フックを使用することで in-memory キャッシュを使用できます。`useCache` フックは任意の非同期関数の結果をキャッシュします。キャッシュされた結果はすべての Server Component で共有されます。

```tsx:app/page.tsx
import { useCache } from "@lazarv/react-server";

const id = 1;

async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/" + id);
  return await res.json();
}

export default async function Home() {
  const data = await useCache(["todo", id], fetchData, 30 * 1000);

  console.log(data);

  return (
    <div>
      <h1>Home</h1>
      <p>{data.title}</p>
    </div>
  );
}
```

フォームをサブミットした後などキャッシュを無効にしたい場合には `revalidate` 関数を使用します。`revalidate` 関数の引数には `useCache` で指定したキャッシュキーを指定します。

```tsx:app/todo/[id]/page.tsx {7}
import { revalidate } from "@lazarv/react-server";

export default function TodoPage({ id }) {
  async function action(formData) {
    const { title } = formData;
    await updateTodo(id, { title });
    await revalidate(["todo", id]);
    redirect("/");
  }
  return (
    <form
      action={action}
    >
      <input type="text" name="title" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### `"use cache"` ディレクティブ

`"useCache"` フックを使用する代わりに `"use cache"` ディレクティブを使用することもできます。`"use cache"` ディレクティブを宣言した関数は in-memory にキャッシュされます。`"use cache"` ディレクティブには `profile`, `key`, `ttl` のプロパティを指定できます。

```tsx:app/fetchData.ts
export async function fetchData() {
  "use cache ttl=200; tags=todos";
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  return await res.json();
}
```

`profile` は設定ファイルに定義されたキャッシュプロファイルを指定します。`react-server.config.ts` もしくは `vite.config.ts` にキャッシュプロファイルを定義できます。

```ts:vite.config.ts
{
  "cache": {
    "profiles": {
      "todos": { "ttl": 30000, "tags": "todos" }
    }
  }
}
```

定義したキャッシュプロファイルは以下のように使用できます。

```tsx:app/fetchData.ts
export async function fetchData() {
  "use cache profile=todos";
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  return await res.json();
}
```

## Adapter

デプロイ環境に合わせて最適なアプリケーションを構成するため Adapter を使用できます。現時点では以下の Adapter が提供されています。

- `@lazarv/react-server-adapter-vercel`

以下の Adapter は現在開発中です。

- `@lazarv/react-server-adapter-netlify`
- `@lazarv/react-server-adapter-cloudflare-pages`
- `@lazarv/react-server-adapter-cloudflare-workers`
- `@lazarv/react-server-adapter-sst`

Adapter を使用するためにははじめにパッケージをインストールします。

```bash
npm install @lazarv/react-server-adapter-vercel
```

インストールした Adapter は `react-server.config.ts` もしくは `vite.config.ts` に設定します。

```ts:vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  adapter: ["@lazarv/react-server-adapter-vercel", {
    // Adapter options
  }],
});
```

もしくはパッケージを import して設定します。

```ts:vite.config.ts
import { defineConfig } from "vite";
import vercelAdapter from "@lazarv/react-server-adapter-vercel";

export default defineConfig({
  adapter: vercelAdapter({
    // Adapter options
  }),
});
```

## まとめ

- react-server は React Server Components を手軽に扱うためのフレームワーク
- `npx react-server {entry-point}` で開発サーバーを起動
- `npx react-server build {entry-point}` でビルド
- `npx react-server start` でビルドしたファイルを実行
- Vite の Environment API を使用しているため、Vite の機能やプラグインを利用できる
- 設定ファイルは `react-server.config.ts` もしくは `vite.config.ts` に記述
- エントリーポイントを指定せずにコマンドを実行するとファイルベースのルーティングが使用される
  - ファイルベースは Next.js と互換性があり、多くの機能をそのまま利用できる
- Static Generation は `*.static.ts` ファイルを使用する。パスパラメータが含まれない場合は `true` をエクスポート、含まれる場合はルートパラメータの配列もしくは配列を返す非同期関数をエクスポート
- キャッシュにはレスポンスキャッシュと in-memory キャッシュがサポートされている
- Adapter を使用することでデプロイ環境に合わせたアプリケーションを構成できる

## 参考

- [@lazarv/react-server](https://react-server.dev/)

[^1]: [You Don't Need Next.js](https://www.docswell.com/s/ashphy/KM1NQ6-you-dont-need-nextjs#p1)

[^2]: [[Next.js App Router での MPA フロントエンド刷新 - Speaker Deck](https://speakerdeck.com/mugi_uno/next-dot-js-app-router-deno-mpa-hurontoendoshua-xin)]
