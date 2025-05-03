---
id: 7oZHTejplMpwDVU6l3aaOM
title: "Qwik City でブログアプリを作る"
slug: "qwik-city-blog-app"
about: "Qwik City は Qwik のメタフレームワークです。React における Next.js、Vue.js における Nuxt.js のような関係と同等です。"
createdAt: "2022-10-16T00:00+09:00"
updatedAt: "2022-10-16T00:00+09:00"
tags: ["qwik", "qwik-city"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2fsleaKJlBIpyN2TiFGRZY/a357ef5bf101a7bf4062a6e55bd691d1/android-chrome-192x192.png"
  title: "Qwik"
audio: null
selfAssessment: null
published: true
---
[Qwik City](https://qwik.builder.io/qwikcity/overview/)（またの名を Qwik Router）は [Qwik](https://qwik.builder.io/docs/overview/) のメタフレームワークです。React における Next.js、Vue.js における Nuxt.js のような関係と同等です。Qwik は長期的で安定したプリミティブに焦点を当てており、breaking changes なしで安定した状態を保つことができます。一方 Qwik City は大規模なサイトを構築するための意見とパフォーマンスの高い方法をもたらします。

Qwik City は Qwik のアーキテクチャのおかげで、余分な JavaScript をブラウザに配信することはありません。体感として、[Remix](https://remix.run/) のアーキテクチャによく似ているようにも感じます。

## Qwik City のインストール

それでは早速 Qwik City でアプリケーションを作成しましょう。以下のコマンドから Qick City のテンプレートを作成できます。

```sh
npm create qwik@latest
```

starter を選択するように聞かれるので「Basic」を選択しました。

```sh
🐰 Let's create a Qwik app 🐇   v0.11.0

✔ Where would you like to create your new project? … ./qwik-app

? Select a starter › (use ↓↑ arrows, hit enter)
❯   Basic
    Recommended for your first Qwik app (comes with Qwik City)
    Documentation Site
    Library
```

インストールが完了したら以下コマンドで開発サーバーを起動します。

```sh
cd qwik-app
npm run dev
```

http://localhost:5173 を訪れてみましょう。次のように表示されているはずです！

![スクリーンショット 2022-10-15 9.31.08](//images.ctfassets.net/in6v9lxmm5c8/13fKpINKthVG1qpp9sKCQD/097a11f06545f3051981aa4a05e08a5c/____________________________2022-10-15_9.31.08.png)

### Static Site Generation (SSG) インテグレーションの追加

`qwik add` コマンドにより、さまざまなインテグレーションを追加できます。現在追加可能なインテグレーションは次のとおりです。

- [Cloudflare Pages Server](https://developers.cloudflare.com/pages)
- [Nodejs Express Server](https://expressjs.com/)
- [Netlify Edge Functions](https://docs.netlify.com/)
- [Static Site Generation (SSG)](https://qwik.builder.io/qwikcity/static-site-generation/overview/)

今回は Static Site Generation (SSG)インテグレーションを追加します。Sstatic Site Generation は日本語では静的サイトジェネレーションと呼ばれ、ビルド時に静的な HTML を生成する仕組みです。Server Side Rendering（SSR）と異なり、ユーザーがサイトに訪れるたびに HTML を構築する必要がなく、また「hydration」も必要がないのでパフォーマンス上メリットがあります。一方でログインしているユーザーの情報に応じてコンテンツを出し分けるなどは行うことができません。そのため、すべてのユーザーに同じ内容を提供するブログやドキュメントサイトに適しています。

以下のコマンドで SSG インテグレーションを追加しましょう。

```sh
npm run qwik add static-node
```

コマンドを実行すると `entry.static.tsx` ファイルが追加されています。このファイルがビルド時のエントリーポイントとなります。

```tsx
import { qwikCityGenerate } from '@builder.io/qwik-city/static/node';
import render from './entry.ssr';
import { fileURLToPath } from 'url';
import { join } from 'path';

// Execute Qwik City Static Site Generator
qwikCityGenerate(render, {
  origin: 'https://qwik.builder.io',
  outDir: join(fileURLToPath(import.meta.url), '..', '..', 'dist'),
});
```

SSG を実行する `qwikCityGenerate` 関数は `@builder.io/qwik-city/static/node` モジュールからインポートされています。このことは将来 Node.js に限らず Deno や Bun などをビルド時のランタイムとして使用できるようになることを示しています。

また `package.json` に `build.static` コマンドが実行されており、このコマンドにより SSG のビルドを実行できます。

## ディレクトリ構造

まずはじめに Qwik City のディレクトリ後続を確認しておきましょう。

### `src/routes`

Qwik City は Next.js のようにファイルシステムベースのルーティングを採用しています。ファイルシステムベースのルーティングとは、ある特定のディレクトリの構造がそのままパスの構造となることを指します。

Qwik Coty では `src/routes` 配下のディレクトリが対象となります。例えば `src/routes/about/index.tsx` という場所にファイルを作成すると、自動的に `/about` というパスを担当することになります。実際に `src/routes/about/index.tsx` にファイルを作成して試してみましょう。

```tsx
import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export const head: DocumentHead = {
  title: "About ",
  meta: [
    {
      name: "description",
      content: "This is about page.",
    },
  ],
};

export default component$(() => {
  return (
    <div>
      <h1>This is about page.</h1>
    </div>
  );
});
```

静的な `<head>` を生成する場合には `head` オブジェクトを export します。

それでは http://localhost:5173/about にアクセスしてみましょう。`src/pages/about/index.tsx` に作成した内容が表示されています。

>! 原因は不明ですが、新しいページを作成した後該当のパスを訪れても 404 エラーとなり何も表示されません。ターミナルのログには `QWIK WARN A unsupported value was passed to the JSX, skipping render. Value: Symbol(skip render)` と表示されているかと思います。このような場合には、一度ジョブを終了してから再度 `npm run dev` を実行すると表示されるようです。

![スクリーンショット 2022-10-15 9.53.46](//images.ctfassets.net/in6v9lxmm5c8/6Jo7WM1ej4GoCydyqMP8ur/e2c0fb7e3e64a0a62033bc4c6222c296/____________________________2022-10-15_9.53.46.png)

Qwik City ではその他のファイルシステムベースのルーティングとは異なり、ファイル名は必ず `index.[filetype]` とする必要があります。例えば、`src/routes/contact.tsx` というファイルを作成しても、`/contract` というパスは登録されません。必ず `src/routes/contract/index.tsx` のような形式にする必要があります。

この方式を採用する利点として、`routes` フォルダ配下にページに関連するコンポーネントなどを配置できる点があげられます。Next.js の方式の場合、`pages` ディレクトリ配下に作成したファイルはすべて自動的にルーティングが登録されてしまうため、ページ関連以外のファイルを配置できません。Qwik City の形式の場合、`index.[filetype]` 以外の形式のファイルは無視されるため、気にせず配置できます。

Qwik City は `.mdx` 形式のファイルもサポートしています。MDX はマークダウンと jsx でページを作成する機能です。`src/routes/contact/index.mdx` ファイルを作成して Contarct ページを MDX で作ってみましょう。

```mdx
---
title: Contact
---

import Form from "./Form";

# Contact

For more information, _please contact_:

<Form />

```

一般的なマークダウン記法とともに jsx を書くことができるので、`<Form />` コンポーネントをインポートして問い合わせフォームを表示しています。`<Form />` コンポーネントを作成しましょう。前述のとおり、Qwik City では `src/routes` 配下にページ以外のファイルを配置できるので、`src/pages/contact/Form.tsx` に作成します。

```tsx
import { component$, useStylesScoped$ } from "@builder.io/qwik";
import styles from "./form.css?inline";

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <form>
      <label for="name">Name</label>
      <input id="name" name="name" type="text" />
      <label for="email">Email</label>
      <input id="email" name="email" type="email" />
      <label for="message">Message</label>
      <textarea id="message" name="message" />
      <button type="submit">Send</button>
    </form>
  );
});
```

中身はよくあるフォームです。`useStylesScoped$` フックを使用することで、特定のコンポーネント内にのみスタイルが適用される scoped styles としてスタイルを適用できます。

`src/pages/contract/form.css` ファイルも作成しておきましょう。

```css
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

input, textarea {
  margin: 0 0 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
```

これで http://localhost:5173/contract を訪れると、Contact ページが作成されていることがわかります。

![スクリーンショット 2022-10-17 19.57.05](//images.ctfassets.net/in6v9lxmm5c8/5oQ80LckDASBd1XpQjjhhG/72a3627692e3ef7128988d547d675855/____________________________2022-10-17_19.57.05.png)

### `layouts.tsx`

`src/ruotes` 配下に存在する `layouts.tsx` ファイルも特別な意味を持つファイルです。`laytouts.tsx` はページ間で再利用されるナビゲーションバーやフッターをレイアウトとして提供します。デフォルトの `layout.tsx` は次のようになっています。

```tsx
import { component$, Slot } from '@builder.io/qwik';
import Header from '../components/header/header';

export default component$(() => {
  return (
    <>
      <main>
        <Header />
        <section>
          <Slot />
        </section>
      </main>
      <footer>
        <a href="https://www.builder.io/" target="_blank">
          Made with ♡ by Builder.io
        </a>
      </footer>
    </>
  );
});
```

`<Slot />` コンポーネントを配置した箇所にそれぞれのルートのページが描画されます。せっかくなので、ヘッダーとフッターを少し編集しておきましょう。

```tsx
import { component$, useStylesScoped$ } from "@builder.io/qwik";
import { QwikLogo } from "../icons/qwik";
import { Link } from "@builder.io/qwik-city";
import styles from "./header.css?inline";

type NavItemProps = {
  href: string;
  label: string;
};

export const NavItem = ({ href, label }: NavItemProps) => {
  return (
    <li>
      <Link href={href}>{label}</Link>
    </li>
  );
};

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="logo">
        <a href="https://qwik.builder.io/" target="_blank">
          <QwikLogo />
        </a>
      </div>
      <ul>
        <NavItem href="/" label="Home" />
        <NavItem href="/about" label="About" />
        <NavItem href="/contact" label="Contact" />
      </ul>
    </header>
  );
});
```

内部のリンクは `@builder.io/qwik-city` からインポートして `<Link />` コンポーネントを使用します。1 つ注意しなければいけない点として、コンポーネントはすべて `export` する必要があります。`<NavItem />` コンポーネントはこのヘッダーコンポーネント内部でのみ使用するのにも関わらず `export` しているのはそのためです。これは Qwik の遅延ロードのためのオプティマイザの制約によるものです。詳しくは以下を参照してください。

https://qwik.builder.io/docs/advanced/optimizer#optimizer-rules

#### レイアウトのネスト

レイアウトはネストすることも可能です。`routes` ディレクトリ内の階層に対して `layout.tsx` 
を作成することでさらにレイアウトを適用できます。

例えば `src/routes/about/layout.tsx` を作成した場合 `/about` ページには次の順番でレイアウトが適用されます。

1. `src/routes/layout.tsx`
2. `src/routes/about/layout.tsx`

実際に `src/routes/about/layout.tsx` ファイルを作成して試してみましょう。`/about` 配下のすべてのページにはトップに画像を表示することにしてみましょう。

```tsx
import { Slot, component$ } from "@builder.io/qwik";

export default component$(() => {
  return (
    <>
      <img
        src="https://i.picsum.photos/id/1006/3000/2000.jpg?hmac=x83pQQ7LW1UTo8HxBcIWuRIVeN_uCg0cG6keXvNvM8g"
        width={600}
        height={400}
        alt="Dog and woman standing next to each other looking at the landscape from a cliff"
      />
      <Slot />
    </>
  );
});
```

http://localhost:5173/about にアクセスしてみると、たしかに作成したレイアウトが使用されています。

![スクリーンショット 2022-10-15 14.54.56](//images.ctfassets.net/in6v9lxmm5c8/4C3zB9BywZiYg9Qj3m33CZ/5458c5b7b427b96acfe2bef81b1b9877/____________________________2022-10-15_14.54.56.png)

### `root.tsx`

`root.tsx` ファイルは Next.js の `_document.tsx` や `App.tsx` のようにアプリケーション全体の設定を行えます。例えばグローバル CSS を読み込んだり `<head>` の設定を行うために利用されます。

```tsx
import { component$ } from '@builder.io/qwik';
import { QwikCity, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';
import { RouterHead } from './components/router-head/router-head';

import './global.css';

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCity>
      <head>
        <meta charSet="utf-8" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  );
});
```

### `src/components`

コンポーネントを配置するためのディレクトリとして推奨されています。ここに配置したファイルが特別な意味を持つことはありません。

### `public`

画像など、静的なファイルを配置するディレクトリです。[Vite public directory](https://vitejs.dev/guide/assets.html#the-public-directory) も参考にしてください。

## microCMS のセットアップ

ブログのコンテンツを管理するために [microCMS](https://microcms.io/) と呼ばれるヘッドレス CMS（Content Management System）を利用します。ヘッドレス CMS とは、コンテンツを管理するバックエンド側のみを提供する仕組み。従来の WordPress のような通常の CMS では、コンテンツを管理する仕組みとコンテンツを表示する仕組みのどちらも提供していましたが、ヘッドレス CMS ではコンテンツを表示する仕組みを自由に管理できるのが特徴です。

一般にヘッドレス CMS では管理画面からコンテンツを作成した後、API を用いてコンテンツ情報を取得して表示することになります。

はじめに microCMS のサインイン画面からアカウントを登録しておきましょう。

![スクリーンショット 2022-10-16 11.30.10](//images.ctfassets.net/in6v9lxmm5c8/3k1CPbEB1bBevMepO6XS5m/f6783766ca5de38866257737d1327865/____________________________2022-10-16_11.30.10.png)

アカウントの登録が完了したら、続いてサービスを作成します。エンドポイント名は後から使用するで控えておくと良いでしょう。　サービス名は任意で構いません。

![スクリーンショット 2022-10-15 17.10.20](//images.ctfassets.net/in6v9lxmm5c8/4R3cuzxqKKtvqUimqy3LfP/0d7fbe00f5eb0798c0a99b54ce12269e/____________________________2022-10-15_17.10.20.png)

API のスキーマを作成します。ヘッドレス CMS ではコンテンツの形式を自由に決定できるのが特徴ですが、ここでは簡単に進めるためにあらかじめ用意されている「ブログ」テンプレートを使用しましょう。

![スクリーンショット 2022-10-15 16.56.14](//images.ctfassets.net/in6v9lxmm5c8/49xkh6m3zpYgqKKz2Nu6si/f43a2250290695c8a8e669c7a020388c/____________________________2022-10-15_16.56.14.png)

作成ボタンからいくつか記事を作成しておきましょう。

![スクリーンショット 2022-10-15 16.58.32](//images.ctfassets.net/in6v9lxmm5c8/26xHgBZRG8F7HTcsxrfP4N/de2b3c7455b4e7ad08bfc22fd92aeb43/____________________________2022-10-15_16.58.32.png)

サイドメニュの「1 個の API キー」から API キーを取得して控えておきます。この API キーは公開されてはいけません。

![スクリーンショット 2022-10-15 17.03.18](//images.ctfassets.net/in6v9lxmm5c8/59bPsIPUI65cPThNyGxirr/53357751d0a19135a3088ddc017e1453/____________________________2022-10-15_17.03.18.png)

ここまでの作業で microCMS 側での作業は完了です。Qwik City のコードに戻り、`.env` ファイルを作成して控えておいた API キーとエンドポイント名を記述します。

```.env
VITE_API_KEY=XXXXXX
VITE_SERVICE_DOMAIN=XXXXXX
```

`.env` ファイルに記述した内容は `import.meta.env` から取得できます。

### API クライアントの作成

microCMS の API から記事を取得する API クライアントを作成します。API の仕様は以下のドキュメントから参照できます。

https://document.microcms.io/content-api/get-list-contents

`src/lib/client.ts` にファイルを作成します。

```ts
import { createClient } from "microcms-js-sdk";

export type Response<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
  revisedAt: string;
  updatedAt: string;
};

const baseUrl = `https://${
  import.meta.env.VITE_SERVICE_DOMAIN
}.microcms.io/api/v1/blogs`;

const requestInit: RequestInit = {
  headers: {
    "X-API-KEY": import.meta.env.VITE_API_KEY,
  },
};

export const getPostList = async (): Promise<ContentsResponse<Post>> => {
  const response = await fetch(baseUrl, requestInit);
  const data = await response.json();
  return data;
};

export const getPost = async (id: string): Promise<Post> => {
  const response = await fetch(`${baseUrl}/${id}`, requestInit);
  const data = await response.json();
  return data;
};
```

`ContentsResponse` は microCMS コンテンツ API のレスポンスの型で、`Post` がコンテンツの形式です。

API のエンドポイントは `https://{サービスドメイン名}.microcms.io/api/v1/{エンドポイント名}` の形式となっております。このエンドポイントを `baseUrl` として設定しておきます。

リクエストヘッダーには `X-MICROCMS-API-KEY: {API キー}` を認証情報として含める必要があります。共通のヘッダーを `requestInit` そして設定します。

`getPostList` と `getPost` はそれぞれ記事の一覧の取得、特定のコンテンツの取得を行う関数です。特定のコンテンツを取得するためにはコンテンツの ID を使用するので、`getPost` 関数の引数で `id` を受け取るようにしています。

## 記事一覧の取得

microCMS のセットアップが完了したので、早速トップ画面で記事の一覧を取得してみましょう。Qwik City においてコンポーネントが描画される前にサーバーサイドでデータを取得には以下の HTTP メソッドに対応したリクエストハンドラ関数を実装します。

- `onGet`
- `onPost`
- `onPut`
- `onRequest`

`GET` メソッドでルートが呼び出された場合には `onGet` 関数が、`Post` メソッドでルートが呼び出された場合には `onPost` 関数がそれぞれ呼ばれます。`onRequest` 関数はすべてのリクエストメソッドに対応しており、フォールバックとして使用できます。

またこれらのリクエストハンドラ関数はページコンポーネントやレイアウトコンポーネントなど `pages` ディレクトリ配下のみで利用できます。

記事一覧ページにおいては、以下のように `onGet` 関数を実装して export します。

```tsx
import { RequestHandler } from "@builder.io/qwik-city";
import { getPostList, Post } from "~/lib/client";

export const onGet: RequestHandler<Post[]> = async () => {
  const data = await getPostList();
  return data.contents;
};
```

`onGet` 関数で取得したデータをコンポーネントから利用するためには `useEndpoint` フックを使います。`useEndpoint` フックは [ResourceReturn](https://qwik.builder.io/docs/components/resource/) 型のオブジェクトを返します。`ResourceReturn` 型は Promise ライクで Qwik によりシリアライズ可能なオブジェクトです。`resource.state` はリソースの状態を表しており、以下のいずれかとなります。

- `pending` - データを取得中である
- `resolved` - データを利用可能である
- `rejected` - エラーまたはタイムアウトのためデータを利用できない

`ResourceReturn` 型のオブジェクトは [<Resource />](https://qwik.builder.io/docs/components/resource/#resource) 要素を使用して、リソースの状態に応じて描画できます。`onPending`,`onRejected`,`OnResolved` はそれぞれ `resource.state` の `pending`,`resolved`,`rejected` に対応しています。

```tsx
import { component$, Resource } from "@builder.io/qwik";
import { RequestHandler, useEndpoint } from "@builder.io/qwik-city";

export default component$(() => {
  const resource = useEndpoint<Post[]>();

  return (
    <div>
      <h1>Post List</h1>

      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onRejected={(error) => <div>Error: {error.message}</div>}
        onResolved={(posts) => (
          <ul>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </ul>
        )}
      />
    </div>
  );
});
```

一覧ページの全体像は以下のとおりです。

```tsx
import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { client, ContentsResponse, Post } from "~/lib/client";

export const onGet: RequestHandler<Post[]> = async () => {
  const data = await client.get<ContentsResponse<Post>>({ endpoint: "blogs" });
  return data.contents;
};

export const head: DocumentHead = {
  title: "Qwik Blog",
};

export const PostItem = component$((props: { post: Post }) => {
  const { post } = props;
  return (
    <li>
      <Link href={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  );
});

export default component$(() => {
  const value = useEndpoint<Post[]>();

  return (
    <div>
      <h1>Post List</h1>

      <Resource
        value={value}
        onPending={() => <div>Loading...</div>}
        onRejected={(error) => <div>Error: {error.message}</div>}
        onResolved={(posts) => (
          <ul>
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </ul>
        )}
      />
    </div>
  );
});
```

実際に記事の一覧が表示されていることを確認しましょう。

![スクリーンショット 2022-10-16 12.42.33](//images.ctfassets.net/in6v9lxmm5c8/3HXvKTYMNJDzWiGqyaqFbg/c1e1dcbde22f56658e0c17bb01437422/____________________________2022-10-16_12.42.33.png)

## 記事詳細画面

続いて、ブログの詳細を表示する画面を作成しましょう。`src/pages/posts/[id]/index.tsx` ファイルを作成します。`[id]` のようにディレクトリ名を `[]` で囲った場合パスパラメータとして使用できます。ルート名をパスパラメータとした場合、以下のように動的にルートにマッチします。

- /posts/i62f_oybcsx
- /posts/y-e7ewlx7
- /posts/10pj070vden

### 記事の取得

microCMS の API では `content_id` を指定して特定のコンテンツを取得できるので、ブログ詳細画面ではこのパスパラメータを利用してコンテンツを取得します。

パスパラメータは `onGet` 関数の引数の `params` から取得できます。

```tsx
export const onGet: RequestHandler<Post> = async ({ params }) => {
  const data = await getPost(params.id);
  return data;
};
```

### SSG におおける動的ルーティング

SSG においてはパスパラメータを用いて動的にルートにマッチングさせる場合にも、ビルド時にあらかじめどのようなパラメータ `id` でアクセスが行われるか把握して各ページを生成しておく必要があります。これを実現するために、`onStaticGenerate` 関数を実装します。

`onStaticGenerate` 関数内では `getPostList` 関数ですべての記事を取得し、`id` の配列として返却します。ここで返却した `id` のリストが事前生成されるページのパスとなります。

```tsx
export const onStaticGenerate: StaticGenerateHandler = async () => {
  const data = await getPostList();
  const ids = data.contents.map((post) => post.id);
  return {
    params: ids.map((id) => {
      return { id };
    }),
  };
};
```

### 動的な Head の設定

`<head>` に設定する値があらかじめ決まっているならば前述のとおり `head` オブジェクトを export すればよいのですが、ここでは API から取得した値を動的に設定する必要があります。そのような場合には、`head` を関数として利用します。

```tsx
export const head: DocumentHead<Post> = ({ data }) => {
  return {
    title: data.title,
    meta: [
      {
        name: "description",
        content: data.content.slice(0, 100) + "...",
      },
    ],
  };
};
```

関数に引数の `data` には `onGet` の返り値が渡されるので、API から取得した値を使って `<head>` を設定できます。

### コンポーネントの実装

最後に取得した記事データをもとにコンポーネントを実装しましょう。記事一覧の場合と同様に `useEndPoint` フックから `onGet` 関数で取得したデータを `ResourceReturn<T>` として取得できます。

記事の内容は `post.content` に HTML 形式で入っているため `dangerouslySetInnerHTML` で HTML として描画できます。

```tsx
export default component$(() => {
  const resource = useEndpoint<Post>();

  return (
    <Resource
      value={resource}
      onPending={() => <div>Loading...</div>}
      onRejected={(error) => <div>Error: {error.message}</div>}
      onResolved={(post) => (
        <article>
          <h1>{post.title}</h1>
          <p>
            <time>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
          <div dangerouslySetInnerHTML={post.content} />
        </article>
      )}
    />
  );
});
```

最終的な内容は以下のようになります。

```tsx
import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  StaticGenerateHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { getPost, getPostList, Post } from "~/lib/client";

export const onGet: RequestHandler<Post> = async ({ params }) => {
  const data = await getPost(params.id);
  return data;
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  const data = await getPostList();
  const ids = data.contents.map((post) => post.id);
  return {
    params: ids.map((id) => {
      return { id };
    }),
  };
};

export const head: DocumentHead<Post> = ({ data }) => {
  return {
    title: data.title,
    meta: [
      {
        name: "description",
        content: data.content.slice(0, 100) + "...",
      },
    ],
  };
};

export default component$(() => {
  const resource = useEndpoint<Post>();

  return (
    <Resource
      value={resource}
      onPending={() => <div>Loading...</div>}
      onRejected={(error) => <div>Error: {error.message}</div>}
      onResolved={(post) => (
        <article>
          <h1>{post.title}</h1>
          <p>
            <time>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </p>
          <div dangerouslySetInnerHTML={post.content} />
        </article>
      )}
    />
  );
});
```

次のように、作成した記事の内容が表示されていることでしょう。

![スクリーンショット 2022-10-16 12.53.00](//images.ctfassets.net/in6v9lxmm5c8/35T4ie714vR6WXwXmi08dR/455ddfd8b7a09ad3af8a1509298a122c/____________________________2022-10-16_12.53.00.png)

## デプロイ

最後に作成したアプリケーションをデプロイしましょう。デプロイ先には [Vercel](https://vercel.com/) を選択しました。サインインしてアカウントを作成しておきます。

作成したアプリケーションはあらかじめ GitHub レポジトリに公開しておきます。新しいプロジェクトを作成する際に「Continue with GitHub」を選択して、公開したレポジトリを選択します。

![スクリーンショット 2022-10-16 13.03.51](//images.ctfassets.net/in6v9lxmm5c8/61vpKPHfPUzTygfkbWRpnl/cff7d6e323db691248c7d2dbbf0e881f/____________________________2022-10-16_13.03.51.png)

「Build and Output Settings」からビルドの設定します。

- BUILD COMMAND - `npm run build.client && npm run build.static && npm run ssg`
- OUTPUT DIRECTORY - `dist`

![スクリーンショット 2022-10-16 13.31.09](//images.ctfassets.net/in6v9lxmm5c8/4KqG6mLy5zABtxECo3VDdB/7031729c4960ea8bb48a578eff6160cc/____________________________2022-10-16_13.31.09.png)

Environment Variables には `.env` に設定した値を設定します。

![スクリーンショット 2022-10-16 13.07.55](//images.ctfassets.net/in6v9lxmm5c8/7IZlue6qm205oAaZECs51f/955713ff665f85fb769b98ca1b39366a/____________________________2022-10-16_13.07.55.png)

設定が完了したら「Deploy」ボタンでデプロイを実行します。

以下の画面が表示されていればデプロイは成功しています。

![スクリーンショット 2022-10-16 13.33.56](//images.ctfassets.net/in6v9lxmm5c8/4NwBYZhDDts3bbvysSfoBa/53f43d501063ecdab9c593e8d8c9a9a4/____________________________2022-10-16_13.33.56.png)

デプロイしたアプリケーションを確認してみましょう！

https://qwik-city-blog-app.vercel.app/
