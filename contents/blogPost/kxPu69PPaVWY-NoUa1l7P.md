---
id: kxPu69PPaVWY-NoUa1l7P
title: "フルスタックフレームワーク TanStack Start を試してみた"
slug: "try-tanstack-start"
about: "TanStack Start は TanStack Router と Vite をベースにしたフルスタック React フレームワークです。型安全なルーティング、サーバーサイドレンダリング、ストリーミング、サーバー関数、API ルートなどの機能を提供します。この記事では TanStack Start の概要と基本的な使い方を紹介します。"
createdAt: "2025-12-13T14:30+09:00"
updatedAt: "2025-12-13T14:30+09:00"
tags: ["TanStack", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2xFZxHybOXhJ7wqb9IBXGk/f1453325bb1d9c213e262bf7fcb82910/food_burrito_9446-768x614.png"
  title: "ブリトーのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "TanStack Start でサーバー側でのみ実行される関数を定義する方法はどれですか？"
      answers:
        - text: "import 'server-only';"
          correct: false
          explanation: ""
        - text: '"use server" ディレクティブ'
          correct: false
          explanation: ""
        - text: "createServerFn() 関数"
          correct: true
          explanation: "createServerFn() はサーバー側でのみ実行される関数を定義します。クライアント側から呼ばれた場合はネットワーク経由でサーバーにリクエストが送信されます。"
        - text: "ファイル名を .server.ts にする"
          correct: false
          explanation: ""
    - question: "TanStack Start のファイルベースルーティングで、パスパラメータ `/posts/:postId` に対応するファイル名はどれですか？"
      answers:
        - text: "src/routes/posts/$postId.tsx"
          correct: true
          explanation: "パスパラメータはファイル名の先頭に $ を付けて表現します。`$postId.tsx` が `/posts/:postId` に対応します。"
        - text: "src/routes/posts/[postId].tsx"
          correct: false
          explanation: ""
        - text: "src/routes/posts/:postId.tsx"
          correct: false
          explanation: ""
        - text: "src/routes/posts/{postId}.tsx"
          correct: false
          explanation: ""

published: true
---

TanStack Start は [TanStack Router](https://tanstack.com/router/latest) と [Vite](https://vitejs.dev/) をベースにしたフルスタック React フレームワークです。TanStack Router が提供する型安全なルーティング機能に加えて、サーバーサイドレンダリング（SSR）, ストリーミング, サーバー関数, API ルートなどの機能を備えています。この記事では TanStack Start の概要と基本的な使い方を紹介します。TanStack Start は Next.js や Remix と同じ立ち位置のフレームワークと言えるでしょう。

この記事では TanStack Start の概要と基本的な使い方を紹介します。

## TanStack Start プロジェクトを作成する

それでは TanStack Start プロジェクトをゼロから作成してみましょう。Tanstack Start プロジェクトを作成するには TanStack CLI を使用するのが簡単です。以下のコマンドを実行します。

```bash
npm create @tanstack/start@latest
```

コマンドを実行すると対話形式でプロジェクト名や追加のライブラリを選択できます。ここではシンプルに Tailwind CSS と Biome のみを追加してテンプレートを選択せずに進めます。作成されたプロジェクトのディレクトリ構造は以下のようになります。

```sh
├── biome.json
├── package-lock.json
├── package.json
├── public
│   ├── ...
├── README.md
├── src
│   ├── components
│   │   └── Header.tsx
│   ├── data
│   │   └── demo.punk-songs.ts
│   ├── logo.svg
│   ├── router.tsx
│   ├── routes
│   │   ├── __root.tsx
│   │   ├── demo
│   │   │   ├── ...
│   │   └── index.tsx
│   ├── routeTree.gen.ts
│   └── styles.css
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```

`npm run dev` コマンドで開発サーバーを起動し、`http://localhost:3000` にアクセスすると以下のようなデフォルトのページが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5lMSEy91A3CRDyx8A3Keu9/8d05e39d3557ff842844caa427c35c9f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_15.01.12.png)

## ルーティング

TanStack Start は TanStack Router をベースにしているため、TanStack Router と同等の機能が利用できます。ルーティングが提供する詳細な機能を知りたい場合には [TanStack Router のドキュメント](https://tanstack.com/router/latest/docs/introduction) を参照すると良いでしょう。

`src/router.tsx` ファイルでルーターが定義されているため、ここでルーターの設定（スクロールの復元やプリロードの設定など）を行うことができます。`routeTree` は自動生成されるオブジェクトで、`src/routes` ディレクトリ内のファイル構造に基づいてルートが定義されます。そのためルーターの設定以外では基本的に `src/router.tsx` ファイルを編集する必要はありません。

```ts:src/router.tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
```

### ファイルベースのルーティング

TanStack Start ではファイルベースのルーティングが採用されており、`src/routes` ディレクトリ内に配置された各ファイルがルートコンポーネントとして扱われ型安全なルーティングが提供されます。例えば `src/routes/index.tsx` ファイルはルートパス `/` に対応し、`src/routes/demo/punk-songs.tsx` ファイルは `/demo/punk-songs` パスに対応します。

試しに `/about` パスに対応するルートコンポーネントを追加してみましょう。`src/routes/about.tsx` ファイルを作成すると、以下のコードが自動で生成されます。

```tsx:src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/about"!</div>
}
```

`createFileRoute` 関数ではそのルートに対するオプションを指定できます。例えば `head` オプションを指定すると、そのルートにアクセスした際の HTML の `<head>` 内にメタデータを追加できます。

```tsx:src/routes/about.tsx
export const Route = createFileRoute('/about')({
  component: RouteComponent,
  head: () => ({
    title: 'About Us',
    meta: [
      {
        name: 'description',
        content: 'Learn more about us on this page.',
      },
    ],
  }),
})
```

`routeTree.gen.ts` ファイルを確認すると、新たに `/about` ルートが追加され型定義も自動で更新されていることがわかります。

```ts:src/routeTree.gen.ts
import { Route as AboutRouteImport } from './routes/about'

const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport,
} as any)

// ... 省略 ...

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/about': typeof AboutRoute
}
```

ルート定義に加えて型定義も自動で更新されるため、ルーティングに関する型安全性が保証されます。試しに `<Link>` コンポーネントの `to` プロパティを設定しようとすると、以下のように `/about` ルートが補完候補として表示されることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3ibHMP7eyKpFiUZ3DPaT8I/be6c6017b78fc21dcb2cb92b8380d6d3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_15.24.05.png)

http://localhost:3000/about にアクセスすると以下のように新たに追加したルートコンポーネントが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3OPY8WtD9w50L9Zyiv3FXN/50ede3e19151c432ca2e79c43bad40bb/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_15.29.40.png)

パスパラメータを使用した動的ルーティングもサポートも試してみましょう。`/posts/:postId` パスに対応するルートコンポーネントを追加するには `src/routes/posts/$postId.tsx` ファイルを作成します。パスパラメータ `postId` は `Route.useParams()` フックで取得できます。

```tsx:src/routes/posts/[postId].tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { postId } = Route.useParams()
  return <div>Hello "/posts/{postId}"!</div>
}
```

`useParams()` フックの文字列の型も自動で生成されるため、型安全にパスパラメータを扱うことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4uZGjILM8aO5yotta4IEGy/de18fa7af048ac73de03267ec4ae2f59/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_15.54.13.png)

### root ルート

root ルートはすべてのルートの親ルートとして機能し、アプリケーション全体で共通のレイアウトや状態を提供するために使用されます。`src/routes/__root.tsx` ファイルが root ルートに対応しており、ここでヘッダーやフッターなどの共通コンポーネントを定義できます。

```tsx:src/routes/__root.tsx
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
```

## データフェッチングとサーバー関数

データフェッチングは Web アプリケーションを構築するうえで最も基本的な機能の 1 つです。TanStack Start（TanStack Router）はルートごとに非同期でデータをフェッチするための仕組みを提供しています。`loader` 関数をルートに定義することで、そのルートにアクセスした際にデータを取得できます。

例えば `/posts` ルートにアクセスした際にブログ記事の一覧を取得するには、`createFileRoute` 関数のオプションに `loader` 関数を追加します。`loader` 関数で return したデータは `Route.useLoaderData()` フックで取得できます。

```tsx:src/routes/posts/index.tsx
import { createFileRoute } from '@tanstack/react-router'

type Post = {
  id: string
  title: string
}

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
  loader: async () => {
   const json = await fetch('https://jsonplaceholder.typicode.com/posts')
   const posts: Post[] = await json.json()
   return { posts }
  }
})

function RouteComponent() {
  const { posts } = Route.useLoaderData()
  return <div>
    <h1>Posts</h1>

    <ul>
      {posts.slice(0, 10).map((post) => (
        <li key={post.id}>
          <a href={`/posts/${post.id}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  </div>
}
```

ルートローダーは「TanStack Router で実行されるすべてのコードはデフォルトで isomorphic（クライアントとサーバーの両方で動作）である」という基本原則に従っています。ルートに直接アクセスした場合、ローダーはサーバー側で実行され、データの取得が完了してから HTML がクライアントに送信されます。一方、クライアント側のナビゲーションによってルートにアクセスした場合、ローダーはクライアント側で実行されます。Chrome の DevTools でネットワークタブを確認すると、クライアント側のナビゲーション時に `https://jsonplaceholder.typicode.com/posts` へのリクエストが発行されていることがわかります。

![](https://videos.ctfassets.net/in6v9lxmm5c8/1JBijkljm4PHGnymxCkokf/83370013d13f403aa9d97d9c9c1d8e7b/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-12-13_16.18.28.mov)

この挙動はルートローダーでセンシティブなデータを扱う場合に特に注意が必要です。サーバーもしくはクライアントのいずれかでのみ実行したいコードがある場合には、明示的に実行制御を行う関数を使用する必要があります。

| 実行場所     | 関数                          | 説明                                                                                                                                     |
| ------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| サーバー     | `createServerFn()`            | サーバーのみで実行される関数。クライアント側から呼ばれた場合はネットワーク経由でサーバーにリクエストが送信される。                       |
| サーバー     | `createServerOnlyFn()`        | サーバーのみで実行される関数。クライアント側から呼ばれた場合はエラーがスローされる。                                                     |
| クライアント | `createClientOnlyFn()`        | クライアントのみで実行される関数。サーバー側から呼ばれた場合はエラーがスローされる。                                                     |
| クライアント | `<ClientOnly>` コンポーネント | クライアント側でのみレンダリングされるコンポーネント。サーバー側では `fallback` プロパティで指定したコンポーネントがレンダリングされる。 |

もし API ルートで `fetch` 関数を使用してデータを取得する場合に API キーが必要な場合には、`createServerFn()` 関数を使用してサーバー側でのみ実行される関数を定義します。

```ts:src/routes/api/getPosts.ts
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
type Post = {
  id: string
  title: string
}


export const fetchPosts = createServerFn().handler(async () => {
  const apiKey = process.env.API_KEY
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })
  const posts = await res.json() as Post[]
  return posts
})

export const Route = createFileRoute('/posts/')({
  component: RouteComponent,
  loader: async () => {
    const posts = await fetchPosts()
    return { posts }
  },
})
```

クライアントルーティングでルートにアクセスした場合には `https://jsonplaceholder.typicode.com/posts` へのリクエストは発行されず、`http://localhost:3000/_serverFn/xxx` のような API エンドポイントに対してリクエストが発行されることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/2pOH5xoKG0bVRTmuLym9uB/f8bfb5e745512d8bba1d2c87ebce77ac/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_16.41.48.png)

よりきめ細かい制御が必要な場合 `createIsomorphicFn` 関数を使用し、サーバーで実行された場合とクライアントで実行された場合の両方のハンドラーを定義できます。

```ts
import { createIsomorphicFn } from '@tanstack/react-start'

const storage = createIsomorphicFn()
  .server((key: string) {
    // サーバー側ではファイルに保存する
    const fs = require('node:fs')
    return fs.readFileSync(`/data/${key}`, 'utf-8')
  })
  .client((key: string) {
    // クライアント側では localStorage に保存する
    return localStorage.getItem(key)
  })
```

## サーバー関数を使用したフォーム処理

サーバー関数を使用したフォームの送信処理を試してみましょう。まずは `createServerFn` 関数を使用してフォームが送信された際に実行されるサーバー関数を定義します。`src/routes/posts/new.tsx` ファイルにコードを追加します。

```tsx:src/routes/posts/new.tsx
import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const createPost = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    if (!(data instanceof FormData)) {
      throw new Error('Expected FormData')
    }
    const title = data.get('title')
    const content = data.get('content')

    const result = PostSchema.parse({ title, content })

    return result
  })
  .handler(async (input) => {
    // データベースに保存する処理などをここで行う
    console.log("Creating post:", input.data.title, input.data.content);

    return redirect({ to: "/posts" });
  })
```

`createServerFn` 関数の引数のオプションで HTTP メソッドを `POST` に設定し、`inputValidator` 関数でフォームデータのバリデーションを行います。`handler` 関数で実際の処理を実装します。ここではフォームデータを直接受け取るために `FormData` オブジェクトであることを検証する処理を入れていますが、より簡潔に `zod` スキーマを使用してバリデーションを行うこともできます。

```tsx:src/routes/posts/new.tsx
const createPost = createServerFn({ method: 'POST' })
  .inputValidator(PostSchema)
  .handler(async (input) => { ... })
```

`.handler` 関数内の処理ではデータベースに保存する処理などを行った後に `/posts` ルートにリダイレクトしています。

次にルートコンポーネントを実装します。`<form>` 要素の `action` 属性にサーバー関数の `.url` プロパティを設定することで、JavaScript が動作しない環境でもフォームの送信が動作するプログレッシブエンハンスメントが実現されます。

```tsx:src/routes/posts/new.tsx
const createPost = createServerFn({ method: "POST" })
  .inputValidator((data) => {
    // ... 省略 ...
  })
  .handler(async (input) => {
    // ... 省略 ...
  })

export const Route = createFileRoute('/posts/new')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <h1>Create New Post</h1>
      <form
        method="post"
        action={createPost.url}
      >
        <div>
          <label>
            Title:
            <input type="text" name="title" />
          </label>
        </div>
        <div>
          <label>
            Content:
            <textarea name="content" />
          </label>
        </div>
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}
```

Chrome の Devtools で `<form>` 要素を確認すると、`action` 属性に `/_serverFn/xxx` のようにサーバー関数の URL が設定されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/IXqGf44zzZqEGq7HOSKCu/9263aeaea4f34370c02adf7e442d8df1/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_17.39.47.png)

## サーバールート

サーバールートを使用すると、サーバーサイドでのみ実行される API エンドポイントを簡単に作成できます。サーバールートは通常のルートと同様に `src/routes` ディレクトリ内にファイルを作成することで定義します。`createFileRoute` 関数の `server.handlers` オプションにハンドラー関数を指定します。

```ts:src/routes/api/hello.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/hello')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return new Response(JSON.stringify({ message: 'Hello, world!' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})
```

上記の例では `/api/hello` パスの `GET` メソッドに対するハンドラー関数を実装しています。ハンドラー関数では Web 標準の [Request](https://developer.mozilla.org/ja/docs/Web/API/Request) オブジェクトを受け取り、[Response](https://developer.mozilla.org/ja/docs/Web/API/Response) オブジェクトを返しています。ブラウザで `http://localhost:3000/api/hello` にアクセスすると以下のようにレスポンスが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5vfTkdg9sOxk6F6cmkmejK/1b614c3928bbc1b2b27d9947c23af19b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-13_17.50.43.png)

サーバールートと App ルート（通常のルート）は同じファイル内で定義できます。

```tsx:src/routes/api/hello.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/hello')({
  component: RouteComponent,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const data = await request.json()
        return new Response(JSON.stringify({ message: `Hello, ${data.name}!` }), {
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  },
})

function RouteComponent() {
  return <div>
    <h1>API Hello Route</h1>

    <form
      method="post"
      action="/api/hello"
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get('name')

        const response = await fetch('/api/hello', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name }),
        })

        const result = await response.json()
        alert(result.message)
      }}
    >
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <button type="submit">Send</button>
    </form>
  </div>
}
```

## ISR（Incremental Static Regeneration）

ISR（Incremental Static Regeneration）は、静的に生成されたコンテンツを CDN から配信しながら、バックグラウンドで定期的に再生成する仕組みです。これにより、静的サイトのパフォーマンスの利点と、動的コンテンツの鮮度の両方を享受できます。

TanStack Start の ISR は、標準的な HTTP キャッシュヘッダーを活用しており、あらゆる CDN で動作します。ページレベルとデータレベルの両方でキャッシュの動作を制御できます。

最も一般的な ISR のパターンは、`Cache-Control` ヘッダーを使用する方法です。`stale-while-revalidate` ディレクティブで指定した期間は古いコンテンツを許可しつつ、バックグラウンドで新しいコンテンツをフェッチしてキャッシュを更新します。

ルート定義の `headers` オプションでキャッシュヘッダーを設定できます。キャッシュヘッダーは Tanstack Router が提供するクライアントキャッシュである [staleTime](https://tanstack.com/router/latest/docs/framework/solid/guide/data-loading#using-staletime-to-control-how-long-data-is-considered-fresh) と組み合わせて使用できます。

```tsx:src/routes/posts/$postId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/posts/$postId')({
  loader: async ({ params }) => {
    const post = await fetchPost(params.postId)
    return { post }
  },
  headers: () => ({
    // CDN で 1 時間キャッシュし、最大 1 日間は古いコンテンツを許可する
    'Cache-Control':
      'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
  }),
  // クライアントキャッシュを 5 分間有効にする
  // クライアントキャッシュはメモリ上に保存される
  staleTime: 5 * 60_000,
})

function RouteComponent() {
  const { post } = Route.useLoaderData()
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

キャッシュを設定しないようにする場合には、`Cache-Control` ヘッダーに `private` ディレクティブを設定します。

```tsx:src/routes/user/profile.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/profile')({
  loader: async () => {
    const profile = await fetchUserProfile()
    return { profile }
  },
  headers: () => ({
    // キャッシュを無効化
    'Cache-Control': 'private, no-store',
  }),
})
```

静的プリレンダリングと組み合わせることで、ビルド時に生成された静的コンテンツを CDN から高速に配信しつつ、バックグラウンドで定期的に再生成できます。プリレンダリングは `vite.config.ts` ファイルで設定します。

```ts:vite.config.ts
// vite.config.ts
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
        // 事前にレンダリングされたページ内のリンクもクロールし、プリレンダリングする
        crawlLinks: true,
      },
    }),
  ],
})
```

## まとめ

- TanStack Start は TanStack Router と Vite をベースにしたフルスタック React フレームワークであり、型安全なルーティング、サーバーサイドレンダリング、ストリーミング、サーバー関数、API ルートなどの機能を提供する。
- ファイルベースのルーティングにより、`src/routes` ディレクトリ内のファイル構造に基づいてルートが自動生成され、型安全なルーティングが実現される。
- ルートごとに非同期でデータをフェッチするための `loader` 関数を定義でき、`Route.useLoaderData()` フックで取得できる。
- `createServerFn` 関数を使用してサーバー側でのみ実行される関数を定義でき、フォームの送信処理などに利用できる。
- サーバールートを使用してサーバーサイドでのみ実行される API エンドポイントを簡単に作成できる。
- ISR（Incremental Static Regeneration）はキャッシュヘッダー `stale-while-revalidate` で制御でき、静的に生成されたコンテンツを CDN から配信しながら、バックグラウンドで定期的に再生成する仕組みを提供する。

## 参考

- [TanStack Start](https://tanstack.com/start/latest)
- [Tanstack Start - A Client-Side First Full-Stack React Framework by Tanner Linsley](https://gitnation.com/contents/tanstack-start-a-client-side-first-full-stack-react-framework)
