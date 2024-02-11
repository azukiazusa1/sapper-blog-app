---
id: DNfaKpQhltMZgpjArWaKL
title: "フルスタック Web フレームワーク HonoX を使ってみる"
slug: "full-stack-web-framework-honox"
about: "HonoX は Hono と Vite をベースにしたフルスタック Web フレームワークです。Hono が提供するサーバーサイドやクライアントサイドの機能を使いつつ、ファイルベースルーティングや Islands Architecture などの新しい機能を使うことができます。"
createdAt: "2024-02-10T16:55+09:00"
updatedAt: "2024-02-10T16:55+09:00"
tags: ["Hono", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5SRI4GJP8Vkwr1TlHaABJ7/5e4b7392342605af70473abdc1493731/chocolate_parfait_16886.png"
  title: "チョコレートパフェのイラスト"
published: true
---
?> HonoX は 2024 年 2 月現在アルファステージとなっています。セマンティックバージョンに従わずに破壊的な変更が行われる可能性があります。

HonoX は [Hono](https://hono.dev/) と [Vite](https://vitejs.dev/) をベースにしたフルスタック Web フレームワークです。以下のような特徴があります。

- ファイルベースのルーティング
- 高速な SSR
- BYOR（Bring Your Own Rerender）：レンダリングエンジンを自由に選択できます
- [islands](https://jasonformat.com/islands-architecture/) ハイドレーション
- ミドルウェア：バックエンドは Hono として動作するため、多くの [Hono のミドルウェア](https://hono.dev/guides/middleware) を使用できます

## HonoX を始める

新しい HonoX のプロジェクトを作成するためには、`hono-create` コマンドを使用します。

```bash
npm create hono@latest
```

`? Which template do you want to use?` という質問に対して `x-basic` を選択します。

```bash
create-hono version 0.3.2
✔ Target directory … hono-blog
? Which template do you want to use? › - Use arrow-keys. Return to submit.
↑ cloudflare-pages
cloudflare-workers
deno
fastly
lambda-edge
netlify
nextjs
nodejs
vercel
❯ x-basic

```

`hono-create` コマンドが完了すると、以下のようなディレクトリ構造が作成されます。

```sh
.
├── app
│   ├── islands
│   │   ├── counter.tsx
│   ├── routes
│ │ ├── \_renderer.tsx
│   │   └── index.tsx
│   ├── client.ts
│   ├── global.d.ts
│   └── server.ts
├── package.json
├── tsconfig.json
└── vite.config.ts

```

作成されたディレクトリに移動して、`npm install` と `npm run dev` を実行します。

```bash
cd hono-blog
npm install
npm run dev
```

http://localhost:5173 にアクセスすると、以下のような画面が表示されます。

![ブラウザのスクリーンショット、Hello, Hono! と表示されている。その下には 3 と increment ボタンが表示されている。](https://images.ctfassets.net/in6v9lxmm5c8/5e5wgEY6EYdNRgWbbhBugo/be532baa3287271c54b11e420409a0c5/__________2024-02-10_17.18.27.png)

## プロジェクトの構造

HonoX のプロジェクトは以下のような構造になっています。

- `app`：サーバーのエントリーポイント、やクライアントのすべてのコードが含まれています
- `app/islands`：インタラクションを行う islands コンポーネントを含むディレクトリ
- `app/routes`：ファイルベースのルーティングのためのディレクトリ。`index.tsx` は `/` に、`about.tsx` は `/about` にマッチする
- `app/routes/_renderer.tsx`：Hono の [JSX Renderer Middleware](https://hono.dev/middleware/builtin/jsx-renderer) が呼ばれるファイル。レイアウトとして機能する
- `app/client.ts`：クライアントエントリーポイント
- `app/server.ts`：サーバーエントリーポイント

## クライアントルートを作成する

それでは、どのようにページを作成しているのか見ていきましょう。`app/routes/index.tsx` は以下のようになっています。

```tsx:app/routes/index.tsx
import { css } from 'hono/css'
import { createRoute } from 'honox/factory'
import Counter from '../islands/counter'

const className = css`
  font-family: sans-serif;
`

export default createRoute((c) => {
  const name = c.req.query('name') ?? 'Hono'
  return c.render(
    <div class={className}>
      <h1>Hello, {name}!</h1>
      <Counter />
    </div>,
    { title: name }
  )
})
```

HonoX ではそれぞれのルートで `Handler | MiddlewareHandler` の配列を `default export` する必要があります。`createRoute` はそのためのヘルパー関数です。`createRoute` に渡すコール場アク関数では引数として `Context` を受け取ります。これは [Hono の Context](https://hono.dev/api/context) と同じです。ここでは `c.req.query('name')` でクエリパラメータを取得しています。

`c.render` 関数を使ってコンポーネントをレンダリングしています。ここで使われているのは HonoX のデフォルトのレンダリングエンジンである [hono/jsx](https://hono.dev/guides/jsx) です。基本的には React と同じように使えます。

`c.render` の第 2 引数にはページのカスタムデータを指定できます。ここでは `title` を指定して、ページのタイトルをカスタマイズしています。ここで指定した `title` は `_renderer.tsx` で引数として受け取り使われます。

```tsx:app/routes/_renderer.tsx {5, 11}
import { Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" />
        <Style />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

`c.render` の第 2 引数の型定義は `app/global.d.ts` で以下のようになっています。

```ts:app/global.d.ts {3-5, 12-14}
import {} from 'hono'

type Head = {
  title?: string
}

declare module 'hono' {
  interface Env {
    Variables: {}
    Bindings: {}
  }
  interface ContextRenderer {
    (content: string | Promise<string>, head?: Head): Response | Promise<Response>
  }
}
```

`title` 以外の `description` や `keywords` などのメタデータを指定したい場合には、ここの型定義と `_renderer.tsx` を変更する必要があります。

CSS ライブラリとして [hono/css](https://hono.dev/helpers/css) が使われています。これは Hono のビルドインの CSS in JS ライブラリです。CSS をテンプレートリテラルで書くことができます。

```tsx:app/routes/index.tsx
import { css } from 'hono/css'

const className = css`
  font-family: sans-serif;
`
```

`hono/css` を使う場合には、`_renderer.tsx` で必ず `<Style>` コンポーネントを挿入する必要があります。

```tsx:app/routes/_renderer.tsx {1, 13}
import { Style } from 'hono/css'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script } from 'honox/server'

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" />
        <Style />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

### islands コンポーネント

`app/routes/index.tsx` で使われている `<Counter>` コンポーネントは islands コンポーネントです。islands コンポーネントとは Islands Architecture に基づいて作られたコンポーネントです。

Islans Architecture とは、ページ内でサーバー側でレンダリングされる静的な部分とインタラクティブな部分を分離する手法です。以下の図のように、サーバーでレンダリングされる大部分を海に対して、インタラクティブな部分は独立した島に見立てられることから Islands Architecture と呼ばれています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6CWklbEvOAAnrHPKxlq6m3/d5ff3a6c49d401353ef3e2c456a7278b/islands-architecture-1.png)

[Islands Architecture - JASON Format](https://jasonformat.com/islands-architecture/) より引用。

Islands Architecture のメリットはパフォーマンスです。インタラクションのために必要なクライアント JavaScript の読み込みを待たずに、サーバーでレンダリングされた静的な部分をすぐに表示できることです。従来の SPA ではすべての JavaScript が読み込まれるまでページが表示されないため、ユーザーが待たされることがありました。JavaScript が必要ない大部分を先に表示することで、ユーザーエクスペリエンスを向上させることができます。

またそれぞれの islands コンポーネント同士も独立しているため、例えば優先度の高い Header は多くの JavaScript を必要とする Image Carousel の読み込みを待つ必要がありません。

Islands Architecture は HonoX の他にも [Astro](https://astro.build/) や [Fresh](https://fresh.deno.dev/) などでも採用されています。

HonoX では islands コンポーネントを `app/islands` ディレクトリに配置します。`app/islands/counter.tsx` は以下のようになっています。

```tsx:app/islands/counter.tsx
import { useState } from 'hono/jsx'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

`hono/jsx` の `useState` は React の `useState` と同じように使えます。`<button>` がクリックされると `count` がインクリメントされるいった簡単な状態管理を行っているコンポーネントです。

`hono/jsx` では以下のフックをサポートしています。

- useContext
- useEffect
- useState
- useCallback
- use
- startTransition
- useDeferredValue
- useMemo
- useLayoutEffect
- Memo
- isValidElement

この `<Counter>` コンポーネントは `routes/` ディレクトリ内のファイルから使われると、まずはサーバー側でレンダリングされます。その後クライアント側に JavaScript が送信されインタラクションが可能になります。

## ブログアプリケーションのチュートリアル

HonoX を使って簡単なブログアプリケーションを作成してみましょう。以下のような機能を持つブログアプリケーションを作成します。

- 記事の作成
- 記事の一覧表示
- 記事の詳細表示
- 記事の削除

完成したコードは以下のリポジトリで確認できます。

https://github.com/azukiazusa1/honox-blog-example

### レイアウトコンポーネントの作成

ページを作り始める前に、まずはそれぞれのページで共通して使うレイアウトコンポーネントを作成しましょう。`app/components` ディレクトリを作成し、`app/components/Layout.tsx` を作成します。

```tsx:app/components/layout.tsx
import { css, cx } from "hono/css";
import type { FC } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

const className = css``;

const headerClass = css`
  border-bottom: 1px solid #ddd;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 1rem;
  justify-content: space-between;
`;

const titleClass = css`
  font-size: 1.5rem;
  margin: 0;
`;

const navClass = css`
  display: flex;
  gap: 1rem;
`;

// & nesting selector https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector
// を使って疑似クラスをそ指定する
const linkClass = css`
  &:hover {
    background-color: #f4f4f4;
  }
  text-decoration: none;
  padding: 0.5rem 1rem;
  color: #262626;
  border-radius: 3px;
`;

const activeLinkClass = css`
  background-color: #f4f4f4;
`;

const containerClass = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
`;

const links = [
  { href: "/articles", text: "Articles" },
  { href: "/articles/create", text: "Create" },
];

export const Layout: FC = ({ children }) => {
  const c = useRequestContext();
  const current = c.req.path;
  return (
    <div class={className}>
      <header class={headerClass}>
        <h1 class={titleClass}>
          <a href="/" class={linkClass}>
            HonoX Blog 🔥
          </a>
        </h1>
        <nav class={navClass}>
          {links.map((link) => (
            <a
              href={link.href}
              // cx は clsx のように複数のクラスを結合する関数
              class={cx(linkClass, current === link.href && activeLinkClass)}
            >
              {link.text}
            </a>
          ))}
        </nav>
      </header>
      <main class={containerClass}>{children}</main>
    </div>
  );
};
```

いくつかポイントを見ていきましょう。`app/routes` ディレクトリ配下にあるファイルでは `createRoute` の引数からコンテキスト（`c`）を受け取っていました。ページコンポーネントから使われることが前提のコンポーネントでは、`useRequestContext` を使って直接コンテキストを取得できます。

ここでは、現在のパスを取得するために `c.req.path` の値を使っています。

```tsx:app/components/Layout.tsx
import { useRequestContext } from "hono/jsx-renderer";

// ...

export const Layout: FC = ({ children }) => {
  const c = useRequestContext();
  const current = c.req.path;
  // ...
};
```

現在の値と一致する場合には `activeLinkClass` を適用するようにしています。条件によってクラス名をつける場合には `cx` 関数を使うとスッキリとしたコードになります。`cx` 関数は [classnames](https://www.npmjs.com/package/classnames) や [clsx](https://www.npmjs.com/package/clsx) と同じように、複数のクラスを結合する関数です。複数の引数を受け取り、falsy な値を除外して結合します。

```tsx:app/components/Layout.tsx {14}
import { css, cx } from "hono/css";

// ...

export const Layout: FC = ({ children }) => {
  const c = useRequestContext();
  const current = c.req.path;
  return (
    // ...
    <nav class={navClass}>
      {links.map((link) => (
        <a
          href={link.href}
          class={cx(linkClass, current === link.href && activeLinkClass)}
        >
          {link.text}
        </a>
      ))}
    </nav>
    // ...
  );
};
```

作成したレイアウトコンポーネントは `app/routes/_renderer.tsx` で使われます。[jsxRenderer](https://hono.dev/middleware/builtin/jsx-renderer) 関数はレイアウトとして機能するミドルウェアです。

```tsx:app/routes/_renderer.tsx {4, 17}
import { Style } from "hono/css";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { Layout } from "../components/Layout";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" />
        <Style />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
});
```

続いてグローバル CSS を追加します。`hono/css` を使ってグローバル CSS を追加するには以下の 2 つの方法があります。

- `:hono-global` 疑似セレクタを使う
- `<Style>` コンポーネントの中で `css` 関数を使う

今回は後者の方法を使ってグローバル CSS を追加してみましょう。`app/routes/_renderer.tsx` に以下のように追記します。

```tsx:app/routes/_renderer.tsx {1, 14-33}
import { Style, css } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { Script } from "honox/server";
import { Layout } from "../components/Layout";

export default jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <Script src="/app/client.ts" />
        <Style>
          {css`
            html {
              font-size: 16px;
              font-family: system-ui, sans-serif;
            }
            body {
              min-height: 100vh;
              color: #262626;
              background-color: #f4f4f4;
            }
            *,
            *::before,
            *::after {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
          }`}
        </Style>
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
});
```

ここまでの実装が完了したら、http://localhost:5173 にアクセスして、レイアウトと CSS が適用されていることを確認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Ead52S27VkQm1QBur1Q03/f302715d75c1be58e10cd4da36f22b96/__________2024-02-11_10.22.41.png)

### 記事の作成

まずは記事の作成機能を作成します。`app/routes` ディレクトリに `articles/create.tsx` を作成します。このファイルは `/articles/create` というパスにマッチするルートです。

```tsx:app/routes/articles/create.tsx
import { css } from "hono/css";
import { createRoute } from "honox/factory";
import type { FC } from "hono/jsx";

const titleClass = css`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const formClass = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const labelClass = css`
  display: flex;
  flex-direction: column;
  font-weight: bold;
  gap: 0.5rem;
`;

const inputClass = css`
  width: 100%;
  padding: 0.5rem 0.25em;
  border-radius: 3px;
  border: 2px solid #ddd;
`;

const textareaClass = css`
  width: 100%;
  border: 2px solid #ddd;
  border-radius: 3px;
  padding: 0.5rem;
  min-height: 10rem;
  resize: vertical;
`;

const buttonClass = css`
  padding: 0.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 999px;
`;

const Page: FC = () => {
  return (
    <div>
      <h1 class={titleClass}>Create an article</h1>
      <form class={formClass} method="post">
        <label class={labelClass}>
          Title
          <input name="title" class={inputClass} type="text" />
        </label>
        <label class={labelClass}>
          Content
          <textarea name="content" class={textareaClass} />
        </label>
        <button class={buttonClass} type="submit">
          Create
        </button>
      </form>
    </div>
  );
};

export default createRoute((c) => {
  return c.render(<Page />, {
    title: "Create an article",
  });
});
```

タイトルとコンテンツを入力するための簡単なフォームです。http://localhost:5173/articles/create にアクセスして、フォームが表示されることを確認しましょう。

![https://images.ctfassets.net/in6v9lxmm5c8/4J2aUhBr6BPy7KDUpoy8Q/df8be278365044595559f4092f85e9b7/__________2024-02-11_10.36.53.png](https://images.ctfassets.net/in6v9lxmm5c8/3Z3z3Z3z3Z3z3Z3z3Z3z3Z/)

#### POST リクエストの処理

続いてフォームの送信を処理するために、`app/routes/articles/create.tsx` で POST リクエストを受け取るためのハンドラを追加します。

`export default` で `Handler | MiddlewareHandler` の配列（`createRoute`）を返した場合にはそのハンドラは GET リクエストのハンドラとして使われます。GET リクエスト以外のリクエストを受け取るためには、対応するメソッド名の変数を名前付き export します。

今回の例では POST リクエストを受け取るために `POST` という名前で変数を定義して export します。

```tsx:app/routes/articles/create.tsx
export const POST = createRoute(async (c) => {
  const body = await c.req.formData();

  console.log("title:", body.get("title"));
  console.log("content:", body.get("content"));

  return c.redirect("/articles");
});
```

リクエストボディは `c.req.formData()` メソッドで `FormData` オブジェクトとして受け取ります。リクエストを受け取ったら `c.redirect("/articles")` で記事の一覧画面へリダイレクトします（まだ記事の一覧画面は作成していないので、404 画面が表示されます）。

フォームになにか入力してサブミットボタンを押した時に、コンソールに入力した値が表示されることを確認しましょう。

```sh
title: フルスタック Web フレームワーク HonoX を使ってみる
content: HonoX は [Hono](https://hono.dev/) と [Vite](https://vitejs.dev/) をベースにしたフルスタック Web フレームワークです。 以下のような特徴があります。
```

#### ミドルウェアによるバリデーション

HonoX では Hono のミドルウェアを使うことができます。ここでは [Zod Validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator) ミドルウェアを使ってフォームの値のバリデーションを行ってみましょう。

以下のコマンドでミドルウェアをインストールします。

```sh
npm install @hono/zod-validator zod
```

ミドルウェアを使うには `createRoute()` の第 1 引数にミドルウェアを渡します。ミドルウェアはルートハンドラと同じように `Handler | MiddlewareHandler` の配列を返す関数です。

```tsx:app/routes/articles/create.tsx
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const Article = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
});

export const POST = createRoute(
  zValidator("form", Article, (result, c) => {
    if (result.success) {
      // TODO DB に保存する
      console.log(result.data);
      return c.redirect("/articles");
    }

    return c.render(<Page />, {
      title: "Create an article",
    });
  })
);
```

まずは `zod` でバリデーションスキーマを定義します。`Article` は `title` と `content` という 2 つのプロパティを持つオブジェクトです。`title` は 1 文字以上 255 文字以下、`content` は 1 文字以上であることをバリデーションしています。

次に `zValidator` ミドルウェアを使ってバリデーションを行います。`zValidator` は 3 つの引数を受け取ります。

1. バリデーションの名前：バリデーションのターゲット。`form` の他に `json`, `query`, `header`, `param`, `cookie` がある
2. バリデーションスキーマ：`zod` で定義したバリデーションスキーマ
3. コールバック関数：通常のルートハンドラに追加してバリデーションの結果を引数として受け取る関数

コールバック関数の第 1 引数のオブジェクトは Zod でバリデーションした結果です。`result.success` が `true` の場合にはバリデーションに成功しています。`result.data` にはバリデーションに成功したデータが入っています。バリデーションに失敗した場合には再度フォームを表示するようにしています。

バリデーションに失敗した場合にはエラーメッセージを表示し、前回入力した値をフォームに表示するように変更してみましょう。まずは `<Page>` コンポーネントでバリデーション結果を Props として受け取れるようにします。

```tsx:app/routes/articles/create.tsx
type Data = {
  title: {
    value: string;
    error: string[] | undefined;
  };
  content: {
    value: string;
    error: string[] | undefined;
  };
};

type Props = {
  data?: Data;
};

const Page: FC<Props> = ({ data }) => {
  // ...
};
```

この `data` Props が存在する場合には、フォームにエラーメッセージと前回入力した値を表示するように変更します。

```tsx:app/routes/articles/create.tsx {18, 21-22, 28, 30-31}
const errorClass = css`
  color: red;
  font-size: 0.75rem;
`;

const Page: FC<Props> = ({ data }) => {
  return (
    <div>
      <h1 class={titleClass}>Create an article</h1>
      <form class={formClass} method="post">
        <label class={labelClass}>
          Title
          <input
            name="title"
            class={inputClass}
            type="text"
            value={data?.title.value}
          />
        </label>
        {data?.title.error &&
          data.title.error.map((error) => <p class={errorClass}>{error}</p>)}
        <label class={labelClass}>
          Content
          <textarea
            name="content"
            class={textareaClass}
            value={data?.content.value}
          />
        </label>
        {data?.content.error &&
          data.content.error.map((error) => <p class={errorClass}>{error}</p>)}
        <button class={buttonClass} type="submit">
          Create
        </button>
      </form>
    </div>
  );
};
```

そして、POST リクエストのハンドラでバリデーションに失敗した場合には、`c.render()` で `<Page>` コンポーネントをレンダリングする際に Props としてバリデーション結果を渡すように変更します。

```tsx:app/routes/articles/create.tsx {14-20}
export const POST = createRoute(
  zValidator("form", Article, (result, c) => {
    if (result.success) {
      // TODO DB に保存する
      console.log(result.data);
      return c.redirect("/articles");
    }

    const { title, content } = result.data;
    const data: Data = {
      title: {
        value: title,
        error: result.error.flatten().fieldErrors.title,
      },
      content: {
        value: content,
        error: result.error.flatten().fieldErrors.content,
      },
    };

    return c.render(<Page data={data} />, {
      title: "Create an article",
    });
  })
);
```

フォームの値を空にしてサブミットボタンを押してみると、エラーメッセージが表示されることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6VY4Bpr1nwX4p6AFnqOXtN/7390c4e8fc3f7316f65c104e2ad7e4de/__________2024-02-11_15.19.58.png)

#### データの保存

後回しにしていたデータを保存する処理を実装します。ここでは簡単のため、JSON ファイルに保存することにします。`data/articles.json` というファイルに記事のデータを保存します。

```sh
mkdir data
echo '[]' > data/articles.json
```

`app/lib/db.ts` というファイルを作成し、記事を保存するための関数を実装します。

```ts:app/lib/db.ts
import fs from "fs/promises";

export type Article = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

export const createArticle = async ({
  title,
  content,
}: Pick<Article, "title" | "content">) => {
  const articlesJSON = await fs.readFile("./data/articles.json", {
    encoding: "utf-8",
  });
  const articles: Article[] = JSON.parse(articlesJSON);
  const id = crypto.randomUUID();
  const created_at = new Date().toISOString();
  const updated_at = created_at;
  const article: Article = { id, title, content, created_at, updated_at };
  articles.push(article);
  await fs.writeFile("./data/articles.json", JSON.stringify(articles));

  return article;
};
```

作成した `createArticle` 関数を `app/routes/articles/create.tsx` で使うように修正します。

```tsx:app/routes/articles/create.tsx {4-5}
export const POST = createRoute(
  zValidator("form", Article, async (result, c) => {
    if (result.success) {
      const { title, content } = result.data;
      await createArticle({ title, content });

      return c.redirect("/articles");
    }

    // ...
  })
);
```

ここまでの実装が完了したら、フォームに何か入力して記事を作成してみましょう。うまくいけば、`data/articles.json` に記事が追加されているはずです。

### 記事の一覧表示

記事の作成ができたら、次は記事の一覧表示機能を作成します。今回はまず記事の一覧を取得する関数から実装します。`app/lib/db.ts` に `getArticles` という関数を追加します。

```ts:app/lib/db.ts
export const getArticles = async () => {
  const articlesJSON = await fs.readFile("./data/articles.json", {
    encoding: "utf-8",
  });
  return JSON.parse(articlesJSON);
};
```

`app/routes/articles/index.tsx` というファイルを作成し、記事の一覧を表示するページを作成します。

```tsx:app/routes/articles/index.tsx
import { FC } from "hono/jsx";
import { createRoute } from "honox/factory";
import { Article, getArticles } from "../../lib/db";
import { css } from "hono/css";

type Props = {
  articles: Article[];
};

const titleClass = css`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const cards = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const card = css`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
  list-style: none;
`;

const Page: FC<Props> = ({ articles }) => {
  return (
    <div>
      <h1 class={titleClass}>Articles</h1>
      <ul class={cards}>
        {articles.map((article) => (
          <li class={card}>
            <a href={`/articles/${article.id}`}>{article.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default createRoute(async (c) => {
  const articles = await getArticles();
  return c.render(<Page articles={articles} />, { title: "Articles" });
});
```

記事の一覧をサーバーサイドで取得して表示してる簡単なページです。http://localhost:5173/articles にアクセスして、記事の一覧が表示されることを確認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/42W322FPmnFEDwheUCfV9e/c3d78c6fbd31bb11de7113bd4d7404b5/__________2024-02-11_19.46.53.png)

### 記事の詳細表示

続いて記事の詳細画面を作りましょう。ID を指定して記事を取得する関数を `app/lib/db.ts` に追加します。

```ts:app/lib/db.ts

export const getArticleById = async (id: string) => {
  const articlesJSON = await fs.readFile("./data/articles.json", {
    encoding: "utf-8",
  });
  const articles = JSON.parse(articlesJSON) as Article[];
  return articles.find((article) => article.id === id);
};
```

記事のマークダウンを変換するために必要な [@markdoc/markdoc](https://markdoc.dev/) パッケージをインストールします。

```sh
npm i @markdoc/markdoc
```

マークダウンを HTML に変換する関数を `app/lib/markdown.ts` というファイルに追加します。

```ts:app/lib/markdown.ts
import Markdoc from "@markdoc/markdoc";

export const parseMarkdown = (source: string) => {
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast);

  const html = Markdoc.renderers.html(content);
  return html;
};
```

`app/routes/articles/[id].tsx` というファイルを作成し、記事の詳細を表示するページを作成します。`[]` で囲まれた部分は動的なパスパラメータを表します。`[id].tsx` は `/articles/:id` というパスにマッチするルートです。

```tsx:app/routes/articles/[id].tsx
import { FC } from "hono/jsx";
import { Article, getArticleById } from "../../lib/db";
import { css } from "hono/css";
import create from "./create";
import { createRoute } from "honox/factory";
import { parseMarkdown } from "../../lib/markdown";

const cardClass = css`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
`;

const titleClass = css`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const contentClass = css`
  margin-top: 2rem;

  p + p {
    margin-top: 1rem;
  }

  ul {
    margin-top: 1rem;
  }

  ul li {
    list-style: disc;
    margin-left: 1rem;
    margin-bottom: 0.5rem;
  }
`;

type Props = {
  article: Article;
  content: string;
};

const Page: FC<Props> = ({ article, content }) => {
  return (
    <article class={cardClass}>
      <header>
        <h1 class={titleClass}>{article.title}</h1>
      </header>
      <div
        class={contentClass}
        id="contents"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};

export default createRoute(async (c) => {
  const { id } = c.req.param();
  const article = await getArticleById(id);
  if (!article) {
    return c.notFound();
  }

  const content = parseMarkdown(article.content);

  return c.render(<Page article={article} content={content} />, {
    title: article.title,
  });
});
```

パスパラメータを取得するために `c.req.param()` を使っています。もし指定された ID の記事が存在しない場合には `c.notFound()` を使って 404 エラーを返します。

```tsx:app/routes/articles/[id].tsx {2, 4-6}
export default createRoute(async (c) => {
  const { id } = c.req.param();
  const article = await getArticleById(id);
  if (!article) {
    return c.notFound();
  }

  const content = parseMarkdown(article.content);

  return c.render(<Page article={article} content={content} />, {
    title: article.title,
  });
});
```

`hono/jsx` では `dangerouslySetInnerHTML` を使って HTML をエスケープせずにレンダリングできます。

記事の一覧画面から詳細画面に遷移して、記事の内容が表示されることを確認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/3nwxfQkIiL13sTWrziPATB/94e8e2dc26bdf0dc6edd170071726747/__________2024-02-11_20.06.18.png)

### 404 ページ

記事が存在しない時に表示される 404 ページはデフォルトではそっけない画面が表示されます。この画面をカスタマイズするために `app/routes/_404.tsx` というファイルを作成します。

```tsx:app/routes/_404.tsx
import { NotFoundHandler } from "hono";

const handler: NotFoundHandler = (c) => {
  return c.render(<h1>Sorry, Not Found...</h1>);
};

export default handler;
```

### エラーページ

404 ページと同じように、エラーが発生した際のエラーページをカスタマイズするために `app/routes/_error.tsx` というファイルを作成します。

```tsx:app/routes/_error.tsx
// app/routes/_error.ts
import { ErrorHandler } from 'hono'

const handler: ErrorHandler = (e, c) => {
  return c.render(<h1>Error! {e.message}</h1>)
}

export default handler
```

### 記事の削除

最後の集大成として、記事の削除機能を作成します。まずは `app/lib/db.ts` に `deleteArticle` という関数を追加します。

```ts:app/lib/db.ts
export const deleteArticle = async (id: string) => {
  const articlesJSON = await fs.readFile("./data/articles.json", {
    encoding: "utf-8",
  });
  const articles = JSON.parse(articlesJSON) as Article[];
  const newArticles = articles.filter((article) => article.id !== id);
  await fs.writeFile("./data/articles.json", JSON.stringify(newArticles));
};
```

記事を削除するためのボタンを追加しましょう。ここではボタンをクリックした時に削除するかどうか確認するダイアログを表示し、OK をクリックしたときには `<form>` でリクエストを送信して削除を実行するようにします。

ボタンをクリックした時にダイアログを表示するというインタラクションを含むため、このコンポーネントは Islands コンポーネントとして実装する必要があります。`app/islands/DeleteButton.tsx` というファイルを作成し、以下のように実装します。

```tsx:app/islands/DeleteButton.tsx
import { css } from "hono/css";
import { FC, useRef } from "hono/jsx";

const dialogClass = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 3px;
  background-color: white;

  &::backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const dialogButtons = css`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const cancelButton = css`
  padding: 0.5rem;
  background-color: #ddd;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const buttonClass = css`
  background-color: red;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  cursor: pointer;
`;

export default function DeleteButton({ articleId }: { articleId: string }) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleClickDelete = () => {
    dialogRef.current?.showModal();
  };

  return (
    <div>
      <dialog class={dialogClass} ref={dialogRef}>
        <form method="POST" action={`/articles/${articleId}/delete`}>
          <p>Are you sure you want to delete this article?</p>
          <div class={dialogButtons}>
            <button value="cancel" formmethod="dialog" class={cancelButton}>
              Cancel
            </button>
            <button type="submit" class={buttonClass}>
              OK
            </button>
          </div>
        </form>
      </dialog>
      <button type="button" class={buttonClass} onClick={handleClickDelete}>
        Delete
      </button>
    </div>
  );
}
```

ここでは HTML 標準の [`<dialog>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog) 要素を使ってダイアログを表示しています。ダイアログを表示するには、ダイアログ要素の `ref` を取得し、ボタンがクリックされた時に `showModal()` メソッドを呼び出します。

ダイアログのキャンセルボタンが押された時に閉じる処理は、`form` 要素を使って実装できます。フォームのメソッドが `dialog` の場合には、サブミットボタンがダイアログを閉じるボタンとして機能するのです。

OK ボタンが押されたときには、`/articles/:id/delete` に POST リクエストを送信するようにしています。`app/routes/articles/[id]/delete.ts` というファイルを作成し、記事の削除を行うハンドラを実装します。

```tsx:app/routes/articles/[id]/delete.ts
import { createRoute } from "honox/factory";
import { deleteArticle } from "../../../lib/db";

export const POST = createRoute(async (c) => {
  const { id } = c.req.param();
  await deleteArticle(id);

  return c.redirect("/articles");
});
```

最後に、記事の一覧画面に `DeleteButton` コンポーネントを追加します。

```tsx:app/routes/articles/index.tsx {7-9, 22}
const card = css`
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1rem;
  width: 100%;
  list-style: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Page: FC<Props> = ({ articles }) => {
  return (
    <div>
      <h1 class={titleClass}>Articles</h1>
      <ul class={cards}>
        {articles.map((article) => (
          <li class={card}>
            <a href={`/articles/${article.id}`}>
              {article.title}
            </a>
            <DeleteButton articleId={article.id} />
          </li>
        ))}
      </ul>
    </div>
  );
};
```

記事の一覧画面に削除ボタンが表示されています。削除ボタンをクリックしてダイアログが表示され、OK ボタンを押すと記事が削除されることを確認しましょう。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2rUU2f8ETn59t9LEUVwBmv/f1055e2de784d3e18403d722a4f58aca/_____2024-02-11_20.58.09.mov" controls></video>

## 感想

HonoX を使ってフルスタック簡単なブログアプリケーションを作ってみました。多くの API は Hono と同じように使うことができるため、すでに Hono を使ったことがある人にとっては馴染みやすいフレームワークだと思います。

Next.js と比較して、軽量のフレームワークとして使用する分には十分な機能を持っていると感じました。アルファ版であるため行いくつか不安定な部分があるものの（HMR で追加したルートが反映されないなど）、今後のバージョンアップでのさらなる進化を期待しています。

## 参考

- [honojs/honox: HonoX](https://github.com/honojs/honox?tab=readme-ov-file)
- [yusukebe/honox-examples: HonoX examples](https://github.com/yusukebe/honox-examples)
- [Hono](https://hono.dev/)
- [Islands Architecture - JASON Format](https://jasonformat.com/islands-architecture/)
- [Astroアイランド | Docs](https://docs.astro.build/ja/concepts/islands/)
- [Release v4.0.0 · honojs/hono](https://github.com/honojs/hono/releases/tag/v4.0.0)
