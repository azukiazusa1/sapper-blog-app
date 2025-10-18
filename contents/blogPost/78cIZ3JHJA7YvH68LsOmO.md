---
id: 78cIZ3JHJA7YvH68LsOmO
title: "Remix v3 を実際に動かして試してみた"
slug: "try-remix-v3"
about: "2025 年 10 月に発表された Remix v3 は React から独立し、Web 標準技術を活用した新しいフレームワークへと進化しました。この記事では、Remix v3 のセットアップ手順と新機能を実際に動かして試してみた内容を紹介します。"
createdAt: "2025-10-18T15:10+09:00"
updatedAt: "2025-10-18T15:10+09:00"
tags: ["Remix"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7McsOmeqz60JlIHJDBerAY/29713d8460b7afec5eda2b42c7f3bda3/eggplant_22747-768x709.png"
  title: "ナスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Remix v3 の最も大きな変更点は何ですか？"
      answers:
        - text: "TypeScript のサポートを追加した"
          correct: false
          explanation: "TypeScript サポートは以前から存在していました"
        - text: "React から独立して独自のフレームワークとして再設計された"
          correct: true
          explanation: "Remix v3 は React から離れ、Web 標準技術を活用した独自のフレームワークとして再設計されました"
        - text: "Vue.js ベースのフレームワークになった"
          correct: false
          explanation: null
        - text: "サーバーサイドレンダリングを廃止した"
          correct: false
          explanation: null
    - question: "Remix v3 で JSX の変換に使用されるランタイムを指定するための tsconfig.json の設定は何ですか？"
      answers:
        - text: "jsxFactory"
          correct: false
          explanation: null
        - text: "jsxRuntime"
          correct: false
          explanation: null
        - text: "jsxImportSource"
          correct: true
          explanation: "tsconfig.json で `jsxImportSource` オプションに `@remix-run/dom` を指定することで、Remix の JSX ランタイムが使用されます"
        - text: "jsxFragmentFactory"
          correct: false
          explanation: null
    - question: "Remix v3 でコンポーネントの状態を管理するために使用される JavaScript の機能は何ですか？"
      answers:
        - text: "クラス"
          correct: false
          explanation: null
        - text: "クロージャー"
          correct: true
          explanation: "Remix v3 ではコンポーネントの状態を管理するために JavaScript のクロージャーを使用します。変数をクロージャー内で定義し、コンポーネント内で参照します"
        - text: "プロトタイプ"
          correct: false
          explanation: null
        - text: "ジェネレータ"
          correct: false
          explanation: null
    - question: "Remix v3 でイベントハンドリングに `on` 属性を使用する理由として正しいものはどれですか？"
      answers:
        - text: "パフォーマンスが向上するため"
          correct: false
          explanation: null
        - text: "イベントの抽象化と型安全性を確保するため"
          correct: true
          explanation: "`on` 属性を使用することで、イベントをコンポーネントと同じレベルの抽象化として扱い、型安全性を確保できます。`onclick` などの DOM API 属性は文字列として扱われるため型安全性の確保が困難です"
        - text: "ブラウザの互換性を向上させるため"
          correct: false
          explanation: null
        - text: "バンドルサイズを削減するため"
          correct: false
          explanation: null
    - question: "Remix v3 でコンポーネントを再レンダリングするために使用するメソッドは何ですか？"
      answers:
        - text: "this.update()"
          correct: false
          explanation: null
        - text: "this.render()"
          correct: true
          explanation: "コンポーネント内で `this.render()` メソッドを呼び出すことでコンポーネントが再レンダリングされ、更新した状態が反映されます"
        - text: "this.forceUpdate()"
          correct: false
          explanation: null
        - text: "this.setState()"
          correct: false
          explanation: null

published: true
---

2025 年 10 月 10 日に行われた [Remix Jam 2025](https://www.youtube.com/live/xt_iEOn2a6Y?t=11764s) にて、Remix v3 が発表されました。Remix v3 は React から離れ、独自のフレームワークとして再設計されるという大きな変更が行われています。Remix v3 で新しいアーキテクチャが導入された理由について、以下の 3 つが挙げられています。

- 従来のフロントエンドエコシステムの複雑性の解消
- Web 標準への回帰とシンプルなモデルの追求
- AI エージェント時代への対応

この記事では、Remix v3 の新機能と変更点を実際に動かして試してみた内容を紹介します。

## Remix v3 のセットアップ

:::warning
Remix v3 は 2025 年 10 月現在開発中のパッケージです。以下の手順は将来変更される可能性があります。
:::

それでは Remix v3 をセットアップしてみましょう。コードの内容は以下のレポジトリを参考にしています。

https://github.com/remix-run/remix/tree/main/demos/bookstore

Remix v3 はいくつかの `@remix-run` スコープのパッケージとして提供されています。まずは以下の 5 つのパッケージをインストールします。

- `@remix-run/dom`: Remix のための JSX ランタイム
- `@remix-run/events`: Remix のためのイベントシステム
- `@remix-run/node-fetch-server`: Node.js, Deno, Bun といったランタイムの違いを吸収するための `fetch` API 実装
- `@remix-run/fetch-router`: `fetch` API を使用したルーティングシステム
- `@remix-run/lazy-file`: ファイルを遅延読み込みするためのユーティリティ

原因は不明ですが、`playwright` パッケージをインストールしていないと `npm error sh: playwright: command not found` エラーが発生するので、あらかじめ `playwright` もインストールしておきます。

```bash
npm install playwright
```

その後、以下のコマンドで Remix v3 のパッケージとビルド関連ツールをインストールします。

```bash
npm install @remix-run/dom @remix-run/events @remix-run/node-fetch-server @remix-run/fetch-router @remix-run/lazy-file
npm install -D @types/node esbuild tsx
```

次に、`package.json` の `scripts` セクションに `dev` スクリプトを追加します。また ESModule を使用するために `type` フィールドも追加します。

```json:package.json
{
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server.ts",
    "dev:browser": "esbuild app/assets/*.tsx --outbase=app/assets --outdir=public/assets --bundle --minify --splitting --format=esm --entry-names='[dir]/[name]' --chunk-names='chunks/[name]-[hash]' --sourcemap --watch",
  }
}
```

`tsconfig.json` ファイルを作成し、以下の内容を追加します。ここでのポイントは `jsxImportSource` オプションで `@remix-run/dom` を指定している点です。これにより JSX の変換に Remix の JSX ランタイムが使用されるようになります。

```json:tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "lib": ["ES2024", "DOM", "DOM.Iterable"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "target": "ESNext",
    "allowImportingTsExtensions": true,
    "rewriteRelativeImportExtensions": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "jsx": "react-jsx",
    "jsxImportSource": "@remix-run/dom"
  }
}
```

ルーティングを定義する `routes.ts` ファイルを作成します。ルーティングの定義は `@remix-run/fetch-router` パッケージからインポートした `route` 関数を使用して行います。

```tsx:routes.ts
import { route, resources } from '@remix-run/fetch-router'

export const routes = route({
  assets: '/assets/*path',

  "home": "/",
  "about": "/about",

  // resources は CRUD ルート（/, /:id, /:id/create, /:id/edit など）を簡単に定義できるユーティリティ
  "posts": resources("/posts", {
    param: "postId"
  })
})
```

`app/router.ts` ファイルを作成し、`routes.ts` で定義したルーティングを使用して `Router` インスタンスを作成します。

```tsx:app/router.ts
import { createRouter } from '@remix-run/fetch-router'
import { routes } from '../routes.ts'
import { assets } from "./public.ts"

export const router = createRouter()

router.get(routes.assets, assets);

// TODO: 後から Remix のコンポーネントに差し替える
router.get(routes.home, async () => {
  return new Response('<h1>Home Page</h1>', {
    headers: { 'Content-Type': 'text/html' },
  })
})
```

`assets` ハンドラーは `app/public.ts` ファイルに実装します。ここでは `@remix-run/lazy-file` パッケージからインポートした `openFile` 関数を使用して、`public` ディレクトリ内の静的ファイルを配信するハンドラーを作成しています。

```tsx:app/public.ts
import * as path from "node:path";
import type { InferRouteHandler } from "@remix-run/fetch-router";
import { openFile } from "@remix-run/lazy-file/fs";

import { routes } from "../routes.ts";

const publicDir = path.join(import.meta.dirname, "..", "public");
const publicAssetsDir = path.join(publicDir, "assets");

export const assets: InferRouteHandler<typeof routes.assets> = async ({
  params,
}) => {
  return serveFile(path.join(publicAssetsDir, params.path));
};

function serveFile(filename: string): Response {
  try {
    const file = openFile(filename);

    return new Response(file, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        "Content-Type": file.type,
      },
    });
  } catch (error) {
    if (isNoEntityError(error)) {
      return new Response("Not found", { status: 404 });
    }

    throw error;
  }
}

function isNoEntityError(
  error: unknown
): error is NodeJS.ErrnoException & { code: "ENOENT" } {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
```

最後に、サーバーエントリーポイントとなる `server.ts` ファイルを作成します。ここでは `@remix-run/node-fetch-server` パッケージからインポートした `createRequestListener` 関数を使用してサーバーを作成し、`routes.ts` で定義したルーティングを適用しています。

```tsx:server.ts
import * as http from 'node:http'
import { createRequestListener } from '@remix-run/node-fetch-server'

import { router } from './app/router.ts'

const server = http.createServer(
  createRequestListener(async (request) => {
    try {
      return await router.fetch(request)
    } catch (error) {
      console.error(error)
      return new Response('Internal Server Error', { status: 500 })
    }
  }),
)

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 44100

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)

})
```

以上で Remix v3 のセットアップは完了です。以下のコマンドで開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:44100` にアクセスすると、`<h1>Home Page</h1>` と表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4noPvtAWgRAeH0EnKoV8dS/aac30057135dfe95ae675f388cd7a564/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-18_16.05.25.png)

## Remix コンポーネントを作成する

それでは Remix のコンポーネントを作成し、新しい機能を試してみましょう。`app/utils/render.ts` ファイルを作成し、サーバーで JSX コンポーネントをレンダリングするためのユーティリティ関数を実装します。

```tsx:app/utils/render.ts
import type { Remix } from "@remix-run/dom";
import { renderToStream } from "@remix-run/dom/server";
import { html } from "@remix-run/fetch-router";

export function render(element: Remix.RemixElement, init?: ResponseInit) {
  return html(renderToStream(element), init);
}
```

`layout.tsx` ファイルを作成し、共通のレイアウトコンポーネントを実装します。

```tsx:app/layout.tsx
import type { Remix } from "@remix-run/dom";

import { routes } from "../routes.ts";

export function Document({
  title = "my remix app",
  children,
}: {
  title?: string;
  children?: Remix.RemixNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}

export function Layout({ children }: { children?: Remix.RemixNode }) {
  return (
    <Document>
      <header>
        <nav>
          <a href={routes.about.href()}>About</a>
          <a href={routes.posts.index.href()}>Posts</a>
          <a href={routes.posts.new.href()}>New Post</a>
        </nav>
      </header>
      <main>
        <div>{children}</div>
      </main>
    </Document>
  );
}
```

`app/Home.tsx` ファイルを作成し、ホームページのコンポーネントを実装します。

```tsx:app/Home.tsx
import type { InferRouteHandler, RouteHandlers } from '@remix-run/fetch-router'
import { routes } from '../routes.ts'
import { render } from './utils/render.ts'
import { Layout } from './layout.tsx'

export const Home: InferRouteHandler<typeof routes.home> = () => {
  return render(
    <Layout>
      <h1>Welcome to Remix v3!</h1>
      <p>This is the home page.</p>
    </Layout>
  );
};
```

`app/router.ts` ファイルを編集し、ホームページのルートハンドラーとして `Home` コンポーネントを使用するように変更します。

```tsx:app/router.ts {3,7}
import { createRouter } from '@remix-run/fetch-router'
import { routes } from '../routes.ts'
import { Home } from './Home.tsx'

export const router = createRouter()

router.get(routes.home, Home)
```

再度開発サーバーを起動し、ブラウザで `http://localhost:44100` にアクセスすると、`Welcome to Remix v3!` と表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6WekLOc0RDFAMuF22Trynx/449a9835e17fc380758402f34e56cea5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-18_16.59.43.png)

### 状態管理とイベントハンドリング

Remix v3 の新しいイベントシステムを使用して、状態管理とイベントハンドリングを実装してみましょう。状態管理とイベントハンドリングを伴うコンポーネントはサーバーサイドではなくクライアントサイドで動作するため、`app/assets/` ディレクトリ内に配置し、JavaScript ファイルを `/assets/` パスで配信するようにします。

まずは `app/assets/entry.ts` ファイルを作成し、`assets` ディレクトリの JavaScript ファイルを読み込めるようにします。

```tsx:app/assets/entry.ts
import { createFrame } from "@remix-run/dom";

createFrame(document, {
  async loadModule(moduleUrl, name) {
    let mod = await import(moduleUrl);
    if (!mod) {
      throw new Error(`Unknown module: ${moduleUrl}#${name}`);
    }

    let Component = mod[name];
    if (!Component) {
      throw new Error(`Unknown component: ${moduleUrl}#${name}`);
    }

    return Component;
  },

  async resolveFrame(frameUrl) {
    let res = await fetch(frameUrl);
    if (res.ok) {
      return res.text();
    }

    throw new Error(`Failed to fetch ${frameUrl}`);
  },
});
```

`layout.tsx` ファイルの `<Document>` を編集し、`script` タグで `entry.ts` ファイルを読み込むようにします。

```tsx:app/layout.tsx {17-21}
import type { Remix } from "@remix-run/dom";

import { routes } from "../routes.ts";

export function Document({
  title = "my remix app",
  children,
}: {
  title?: string;
  children?: Remix.RemixNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          type="module"
          async
          src={routes.assets.href({ path: "entry.js" })}
        />
        <title>{title}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`app/assets` ファイルのファイルが `assets` パスで配信されるようにするため、別プロセスで `esbuild` を実行してバンドルします。

```bash
npm run dev:browser
```

`app/assets/Counter.tsx` ファイルを作成し、カウンターコンポーネントを実装しましょう。`/assets/` パスとコンポーネントの紐づけは `@remix-run/dom` パッケージの `hydrated` 関数を使用して行います。

```tsx:app/assets/Counter.tsx
import { type Remix, hydrated } from "@remix-run/dom";
import { press } from "@remix-run/events/press";
import { routes } from "../../routes";

export const Counter = hydrated(
  routes.assets.href({ path: "Counter.js#Counter" }),
  function (this: Remix.Handle) {
    let counter = 0;

    return () => (
      <button
        on={press(() => {
          counter++;
          this.render();
        })}
      >
        {`Clicked ${counter} times`}
      </button>
    );
  }
);
```

Remix v3 ではコンポーネントの状態を管理するために JavaScript の[クロージャー](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Closures) を使用します。上記の `Counter` コンポーネントでは、`counter` 変数をクロージャー内で定義し、コンポーネント内で参照しています。関数内の `this` は `Remix.Handle` 型として型付けされており、`this.render()` メソッドを呼び出すことでコンポーネントが再レンダリングされ、更新した状態が反映されます。

ボタンをクリックしたときのイベントハンドリングでは `onclick` 属性の代わりに `on` 属性を使用し、`@remix-run/events` パッケージの `press` イベントハンドラーを使用しています。`on` 属性を使用するのはイベントハンドリングの抽象化と型安全性を理由に挙げられています。

DOM API の `onclick` や `oninput` といった属性は、イベント名を文字列として扱うため、型安全性を確保するためにはグローバルな HTML 要素の型を拡張する必要があります。React の場合は `JSX.IntrinsicElements` インターフェースを拡張することで `onClick` や `onInput` 属性の型を定義できますが、Remix v3 では `on` 属性を使用するというアプローチを採用しています。これはイベントをコンポーネントと同じレベルの抽象化として扱うためです。

ここでは `@remix-run/events` パッケージの `press` イベントハンドラーを使用し、クリックイベントの複雑さを抽象化しています（クリック操作の複雑さは [Building a Button Part 1: Press Events – React Spectrum Blog](https://react-spectrum.adobe.com/blog/building-a-button-part-1.html) でも説明されています）。`press` イベントハンドラーの他に `dom.submit` や `dom.input` といったより具体的なイベントハンドラーも提供されています。

あらかじめ用意されたイベントハンドラーだけでなく、独自のイベントハンドラーを実装することも可能です。例えば Remix Jam 2025 のデモでは、`tempo` イベントハンドラーを実装し、ボタンが押され続けている間に行われる処理をうまく抽象化しています。`tempo` イベントハンドラー内では独自のロジックと、UI コンポーネントとは独立した状態を管理しています。

```tsx
import { createInteraction, events } from "@remix-run/events";
import { pressDown } from "@remix-run/events/press";

export const tempo = createInteraction<HTMLElement, number>(
  "rmx:tempo",
  ({ target, dispatch }) => {
    let taps: number[] = [];
    let resetTimer: number = 0;

    function handleTap() {
      clearTimeout(resetTimer);
      taps.push(Date.now());
      taps = taps.filter((tap) => Date.now() - tap < 4000);
      if (taps.length >= 4) {
        let intervals = [];
        for (let i = 1; i < taps.length; i++) {
          intervals.push(taps[i] - taps[i - 1]);
        }
        let bpm = intervals.map((interval) => 60000 / interval);
        let avgTempo = Math.round(
          bpm.reduce((sum, value) => sum + value, 0) / bpm.length,
        );
        dispatch({ detail: avgTempo });
      }
      resetTimer = window.setTimeout(() => {
        taps = [];
      }, 4000);
    }

    return events(target, [pressDown(handleTap)]);
  },
);
```

`tempo` イベントハンドラーは以下のように使用できます。

```tsx
<button
  on={tempo((event) => {
    bpm = event.detail;
    this.update();
  })}
>
  BPM: {bpm}
</button>
```

元のコードに戻りましょう。作成した `Counter` コンポーネントを `app/Home.tsx` ファイルで使用するように編集します。

```tsx:app/Home.tsx {8,10}
import type { InferRouteHandler, RouteHandlers } from "@remix-run/fetch-router";
import { routes } from "../routes.ts";
import { render } from "./utils/render.ts";
import { Layout } from "./layout.tsx";
import { Counter } from "./assets/Counter.tsx";

export const Home: InferRouteHandler<typeof routes.home> = () => {
  return render(
    <Layout>
      <h1>Welcome to Remix v3!</h1>
      <Counter />
    </Layout>
  );
};
```

ブラウザで `http://localhost:44100` にアクセスし、`Clicked 0 times` ボタンをクリックすると、クリック数が増加することが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5NPF2P0EkiOGfRlmCbeSHo/801807a3567eb80a3b7faeb850894ce3/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-10-18_17.38.59.mov" controls></video>

## 記事の CRUD 機能を実装する

より実践的な例として、Post の CRUD 機能を実装してみましょう。まずはメモリ上で Post を管理するための `app/models/post.ts` ファイルを作成します。

```tsx:app/models/post.ts
export interface Post {
  id: string;
  title: string;
  content: string;
}

let posts: Post[] = [
  {
    id: "1",
    title: "First Post",
    content: "This is the content of the first post.",
  },
  {
    id: "2",
    title: "Second Post",
    content: "This is the content of the second post.",
  }
];

export function getAllPosts(): Post[] {
  return posts;
}

export function getPostById(id: string): Post | undefined {
  return posts.find((post) => post.id === id);
}

export function createPost(title: string, content: string): Post {
  const newPost: Post = {
    id: String(posts.length + 1),
    title,
    content,
  };
  posts.push(newPost);
  return newPost;
}

export function updatePost(id: string, title: string, content: string): Post | undefined {
  const post = getPostById(id);
  if (post) {
    post.title = title;
    post.content = content;
    return post;
  }
  return undefined;
}

export function deletePost(id: string): boolean {
  const index = posts.findIndex((post) => post.id === id);
  if (index !== -1) {
    posts.splice(index, 1);
    return true;
  }
  return false;
}
```

`app/posts.tsx` ファイルを作成し、Post の一覧表示、詳細表示、新規作成、編集、削除の各コンポーネントを実装します。`RouteHandlers<typeof routes.posts>` 型を満たすように各ルートハンドラーを実装します。

```tsx:app/posts.tsx
import type { RouteHandlers } from "@remix-run/fetch-router";
import type { routes } from "../routes";

export const handlers: RouteHandlers<typeof routes.posts> = {
  // GET /posts
  index: () => {
    return new Response("Posts index");
  },
  // GET /posts/:postId
  show: ({ params }) => {
    return new Response(`Post ID: ${params.postId}`);
  },
  // GET /posts/new
  new: () => {
    return new Response("New post form");
  },
  // POST /posts
  create: () => {
    return new Response("Create a new post");
  },
  // GET /posts/:postId/edit
  edit: ({ params }) => {
    return new Response(`Edit form for post ID: ${params.postId}`);
  },
  // PUT /posts/:postId
  update: ({ params }) => {
    return new Response(`Update post ID: ${params.postId}`);
  },
  // DELETE /posts/:postId
  destroy: ({ params }) => {
    return new Response(`Delete post ID: ${params.postId}`);
  },
};
```

`app/router.ts` ファイルを編集し `router.map(...)` メソッドを使用して、`posts` ルートに対して `handlers` を適用します。

```tsx:app/router.ts {5,12}
import { createRouter } from "@remix-run/fetch-router";
import { routes } from "../routes.ts";
import { assets } from "./public.ts";
import { Home } from "./Home.tsx";
import { handlers } from "./posts.tsx";

export const router = createRouter();

router.get(routes.assets, assets);

router.get(routes.home, Home);
router.map(routes.posts, handlers);
```

http://localhost:44100/posts にアクセスすると `Posts index` と表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/56E4NfVLljvRadA2vFsE7H/134525863b071e9f6555b82947b7f864/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-18_19.43.01.png)

### 記事の一覧表示と削除ボタン

記事の一覧表示と削除ボタンを実装してみましょう。`app/posts.tsx` ファイルを編集し、`index` ルートハンドラーを以下のように実装します。

```tsx:app/posts.tsx
import type { RouteHandlers } from "@remix-run/fetch-router";
import { routes } from "../routes";
import { getAllPosts } from "./models/post";
import { render } from "./utils/render";
import { Layout } from "./layout";

export const handlers: RouteHandlers<typeof routes.posts> = {
  // GET /posts
  index: () => {
    const posts = getAllPosts();

    return render(
      <Layout>
        <h1
          css={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#2563eb",
            marginBottom: "2rem",
            borderBottom: "3px solid #e5e7eb",
            paddingBottom: "0.5rem",
          }}
        >
          Posts
        </h1>

        <ul
          css={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {posts.map((post) => (
            <li
              key={post.id}
              css={{
                padding: "1rem",
                backgroundColor: "#f9fafb",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                transition: "all 0.2s ease",
              }}
            >
              <a
                href={routes.posts.show.href({ postId: post.id })}
                css={{
                  color: "#1f2937",
                  textDecoration: "none",
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  padding: "0.5rem",
                  "&:hover": {
                    color: "#2563eb",
                  },
                }}
              >
                {post.title}
              </a>
            </li>
          ))}
        </ul>
      </Layout>
    );
  },
  // 他のルートハンドラーは省略
}
```

`getAllPosts` 関数を使用して記事の一覧を取得し、`<ul>` 要素内で記事のタイトルをリンクとして表示しています。スタイルは Remix v3 の組み込み属性である `css` 属性を使用し、CSS-in-JS のような書き方で定義しています。記事の詳細画面へのリンクは `routes.posts.show.href({ postId: post.id })` を使用して生成しているため、型安全にルーティングが行えます。

記事の一覧が表示されていることを確認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/4vdBOffQzWJlMo5Zf3sXvx/b8d9a5bb91f98f996a531056602a5f97/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-18_20.02.40.png)

一覧の各記事に削除ボタンを追加してみましょう。削除ボタンをクリックしたときに確認ダイアログを表示し、OK ボタンが押されたとき `fetch` API を使用して記事を削除するリクエストを送信します。JavaScript が動作する必要があるので、`app/assets/` ディレクトリ内に `DeletePostButton.tsx` ファイルを作成します。

```tsx:app/assets/DeletePostButton.tsx
import { hydrated, type Remix } from "@remix-run/dom";
import { routes } from "../../routes";
import { dom } from "@remix-run/events";

export const DeletePostButton = hydrated(
  routes.assets.href({ path: "DeletePostButton.js#DeletePostButton" }),
  function (this: Remix.Handle) {
    const route = routes.posts.destroy;
    let deleting = false;

    return ({ postId }: { postId: string }) => (
      // JavaScript が動かない環境でも動作するように、通常の form 要素を使用
      <form
        action={route.href({ postId })}
        method={route.method}
        // Remix のイベントハンドラでは abortController の signal を受け取る
        // これを使って非同期処理のキャンセルが可能
        on={dom.submit(async (event, signal) => {
          event.preventDefault();
          deleting = true;
          if (confirm("Are you sure you want to delete this post?")) {
            await fetch(route.href({ postId }), {
              method: route.method,
              signal,
            });
          }

          // キャンセルされた場合は何もしない
          if (signal.aborted) return;

          // 削除後にページをリロードして状態を反映
          // 他にメソッドが用意されているかも
          window.location.reload();

          this.render();
          deleting = false;
        })}
      >
        <button
          css={{
            marginLeft: "1rem",
            padding: "0.25rem 0.5rem",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: "500",
            "&:hover": {
              backgroundColor: "#dc2626",
            },
          }}
          type="submit"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </form>
    );
  }
);
```

ボタンのクリックイベントハンドリングを使用する代わりに、`form` 要素の `onsubmit` イベントハンドリングを使用しています。これにより JavaScript が動作しない環境でもフォーム送信が行われ、記事の削除が可能になります。`form` 要素の `action` 属性と `method` 属性には `routes.posts.destroy.href({ postId })` と `routes.posts.destroy.method` を使用して、型安全にルーティング情報を設定しています。

`dom.submit` イベントハンドラー内では `fetch` API を使用して記事削除のリクエストを送信し、削除後にページをリロードして状態を反映しています。Remix v3 のイベントハンドラーでは [AbortController](https://developer.mozilla.org/ja/docs/Web/API/AbortController) の `signal` を受け取ることができ、非同期処理のキャンセルができるように設計されています。連続して同じ操作が行われた際に、自動で前の操作がキャンセルされるようになっています。

`app/posts.tsx` ファイルを編集し、記事一覧の各記事に `DeletePostButton` コンポーネントを追加します。

```tsx:app/posts.tsx {1,39}
import { DeletePostButton } from "./assets/DeletePostButton";

// ...

{posts.map((post) => (
  <li
    key={post.id}
    css={{
      padding: "1rem",
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
      border: "1px solid #e5e7eb",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "&:hover": {
        backgroundColor: "#f3f4f6",
        borderColor: "#2563eb",
        transform: "translateX(4px)",
      },
    }}
  >
    <a
      href={routes.posts.show.href({ postId: post.id })}
      css={{
        color: "#1f2937",
        textDecoration: "none",
        fontSize: "1.125rem",
        fontWeight: "500",
        padding: "0.5rem",
        "&:hover": {
          color: "#2563eb",
        },
      }}
    >
      {post.title}

    </a>
    <DeletePostButton postId={post.id} />
  </li>
))}
```

`destroy` ルートハンドラーで記事を削除できるように実装します。

```tsx:app/posts.tsx {59-65}
import { deletePost, getAllPosts } from "./models/post";

  // DELETE /posts/:postId
  destroy: ({ params }) => {
    const success = deletePost(params.postId);
    if (success) {
      return new Response("Post deleted");
    } else {
      return new Response("Post not found", { status: 404 });
    }
  },
```

削除ボタンを押したとき記事が削除されることを確認しましょう。

![](https://videos.ctfassets.net/in6v9lxmm5c8/3GM0HAsIsr4FzOH6ubORCe/6d69a8c1e59c93eb5127c3029464ee6f/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-10-18_20.43.21.mov)

### 記事の新規作成

新しい記事を作成するフォームを実装してみましょう。`app/post.tsx` の `handlers` オブジェクトを編集し、`new` ルートハンドラーを実装します。

```tsx:app/posts.tsx
// GET /posts/new
  new: () => {
    return render(
      <Layout>
        <h1
          css={{
            fontSize: "2.5rem",
            fontWeight: "700",
            color: "#2563eb",
            marginBottom: "2rem",
            borderBottom: "3px solid #e5e7eb",
            paddingBottom: "0.5rem",
          }}
        >
          New Post
        </h1>

        <form
          method="POST"
          action={routes.posts.create.href()}
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            maxWidth: "600px",
          }}
        >
          <div
            css={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="title"
              css={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              css={{
                padding: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                "&:focus": {
                  outline: "none",
                  borderColor: "#2563eb",
                  boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
                },
              }}
            />
          </div>

          <div
            css={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <label
              htmlFor="content"
              css={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              css={{
                padding: "0.75rem",
                fontSize: "1rem",
                border: "1px solid #e5e7eb",
                borderRadius: "0.375rem",
                fontFamily: "inherit",
                resize: "vertical",
                "&:focus": {
                  outline: "none",
                  borderColor: "#2563eb",
                  boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
                },
              }}
            />
          </div>

          <div css={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              css={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#ffffff",
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
            >
              Create Post
            </button>
            <a
              href={routes.posts.index.href()}
              css={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                color: "#374151",
                backgroundColor: "#f3f4f6",
                border: "none",
                borderRadius: "0.375rem",
                textDecoration: "none",
                display: "inline-block",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                },
              }}
            >
              Cancel
            </a>
          </div>
        </form>
      </Layout>
    );
  },
```

HTML のフォームを使用して記事のタイトルと内容を入力できるようにしています。`create` ルートハンドラーでは引数として `formData` オブジェクトを受け取り、フォームから送信されたデータを取得して記事を作成します。記事の作成が成功したら `@remix-run/fetch-router` パッケージの `redirect` 関数を使用して記事一覧ページにリダイレクトします。

```tsx:app/posts.tsx
import { createPost, getAllPosts } from "./models/post";
import { redirect } from "@remix-run/fetch-router";

  // POST /posts
  create: async ({ formData }) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title || !content) {
      return new Response("Title and content are required", { status: 400 });
    }

    createPost(title, content);
    return redirect(routes.posts.index.href());
  },
```

ブラウザで `http://localhost:44100/posts/new` にアクセスし、記事の新規作成フォームが表示されることを確認しましょう。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4IocDfjIvmhtnfO6lSUsrG/6e3a0b09b1e3068b377469b188f8c299/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-10-18_20.58.17.mov" controls></video>

その他記事の詳細画面や、編集画面も同様に実装可能です。ここでは割愛しますが、興味がある方は以下のレポジトリを参考にしてください。

## まとめ

- 2025 年 10 月 10 日の Remix Jam 2025 で Remix v3 が発表された。v3 は React から離れて独自のフレームワークとして再設計された
- `@remix-run/dom`, `@remix-run/events`, `@remix-run/node-fetch-server`, `@remix-run/fetch-router`, `@remix-run/lazy-file` など複数のパッケージをインストールして Remix v3 アプリをセットアップした
- `@remix-run/fetch-router` の `route` 関数を使用してルーティングを定義し、型安全なルーティングが可能
- JavaScript のクロージャーを使用してコンポーネントの状態を管理し、`this.render()` メソッドで再レンダリング
- `on` 属性と `@remix-run/events` パッケージの `press`、`dom.submit` などのイベントハンドラーを使用し、型安全性とイベントの抽象化を実現している
- `createInteraction` を使用して独自のイベントハンドラー（例：`tempo` イベント）を実装できる
- `css` 属性を使用してインラインでスタイルを定義でき、疑似クラス（`:hover` など）もサポート
- イベントハンドラーで `signal` を受け取り、非同期処理のキャンセルが可能で、連続操作時に自動的に前の操作がキャンセルされる

## 参考

- [Remix Jam 2025](https://www.youtube.com/live/xt_iEOn2a6Y?t=11764s)
- [remix-run/remix: Build Better Websites. Create modern, resilient user experiences with web fundamentals.](https://github.com/remix-run/remix)
- [Remix 3 発表まとめ - React を捨て、Web標準で新しい世界へ](https://zenn.dev/coji/articles/remix3-introduction)
