---
id: ctl4wS8gUgNzk-WS5MqpQ
title: "React Server Components を使うためのミニマムなフレームワーク Waku"
slug: "react-server-components-minimal-framework-waku"
about: "Waku は小規模から中規模の React プロジェクトを構築するためのミニマムなフレームワークです。従来は React Server Components を使うためには Next.js のような比較的大規模なフレームワークが必要でした。Waku もまた React Server Components に対応しているため、最小限の構成で React Server Components を使いたい場合に適しています。"
createdAt: "2024-03-02T16:13+09:00"
updatedAt: "2024-03-02T16:13+09:00"
tags: ["React", "Waku", "React Server Components", "Server Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4CZrXiDdjmGeZjNFo8C5By/6290bfa40d2e48694226a037a6af6b23/spring_sanshoku_dango_6767.png"
  title: "桜と三色だんごのイラスト"
published: true
---
!> Waku は 2024 年 3 月現在、開発中のフレームワークです。将来 API が変更される可能性があります。また、今後追加予定の機能については [Roadmap](https://github.com/dai-shi/waku/issues/24) を参照してください。

Waku は小規模から中規模の React プロジェクトを構築するためのミニマムなフレームワークです。従来は [React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md#sharing-code-between-server-and-client) を使うためには Next.js のような比較的大規模なフレームワークが必要でした。Waku もまた React Server Components に対応しているため、最小限の構成で React Server Components を使いたい場合に適しています。

https://waku.gg/

## Waku プロジェクトを作成

Waku プロジェクトを作成するためには、以下のコマンドを実行します。

```bash
npm create waku@latest
```

パッケージをインストールして、開発サーバーを起動してみましょう。

```bash
npm install
npm run dev
```

http://localhost:3000/ にアクセスすると、Waku のデフォルトのページが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2VLsIg18YD4bHOnNWfEzqk/74d92f61a53c1fb5df2ae9c0cc883305/__________2024-03-02_16.27.10.png)

## React Server Components

冒頭で述べたように、Waku は React Server Components に対応しています。React Server Components は React の新しいパラダイムであり、サーバー上でのみ実行されるコンポーネントを提供します。サーバー上でのみ実行されることで、以下のような利点があります。

- クライアントに JavaScript が送信されないため、バンドルサイズを削減できる
- コンポーネントを非同期関数として、直接データベースや外部 API からデータを取得でき、パフォーマンス上の利点がある

React Server Components は、サーバー上でのみ実行されるため、クライアント側でのイベントハンドリングや状態管理はできません。具体的には、`useState` や `useEffect` などのフックや、`onClick` や `onChange` などのイベントハンドラーは使えないということです。クライアントサイドでのインタラクティブな操作を行うためには、`"use client;"` ディレクティブを宣言してクライアントコンポーネントとして「オプトイン」する必要があります。

逆に言えば、`"use client;"` を宣言しない限りすべてのコンポーネントはデフォルトでサーバーコンポーネントとして実行されます。このデフォルトでサーバーサイドで実行されるというメンタルモデルは全く新しい概念であり、従来までの考え方を改め新しい設計方針を取り入れる必要があるでしょう。

それでは実際に React Server Components を体験してみましょう。`src/templates/home-page.tsx` がトップページ（`/`）を描画しているコンポーネントです（ルーティングの設定は後ほど説明します）。このファイルを以下のように書き換えてみましょう。

```tsx:src/templates/home-page.tsx
import { Link } from "waku";

type Post = {
  id: number;
  title: string;
  body: string;
};

export const HomePage = async () => {
  // 外部 API からデータを取得
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data: Post[] = await res.json();

  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
      <ul className="mt-4 flex flex-col space-y-4">
        {data.map((post: any) => (
          <li key={post.id}>
            <Link to={`/post/${post.id}`} className="text-blue-500">
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

このコンポーネントは外部 API からデータを取得して描画するコンポーネントです。`async/await` を使って非同期コンポーネントとして実装している点がサーバーコンポーネントの特徴と言えるでしょう。ナビゲーションは `waku` パッケージの `Link` コンポーネントを使っています。

画面を確認すると、トップページに外部 API から取得したデータが表示されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6VcM6CRDPfxPHwA8YCoaZT/af65add4ea556e1df7fdb70defc4aebd/__________2024-03-02_17.47.40.png)

## ルーティング

Waku のプロジェクトのエントリーポイントは `src/entries.ts` です。このファイルで `createPages()` 関数を使ってルーティングとレイアウトを設定します。

!> [Roadmap](https://github.com/dai-shi/waku/issues/24) によると、ファイルベースのルーティングに対応する予定がるようです。

```ts:src/entries.ts
import { createPages } from 'waku';

import { RootLayout } from './templates/root-layout.js';
import { HomePage } from './templates/home-page.js';
import { AboutPage } from './templates/about-page.js';

export default createPages(async ({ createPage, createLayout }) => {
  // ルートのレイアウトを設定
  createLayout({
    render: 'static',
    path: '/',
    component: RootLayout,
  });

  // / に対するページを設定
  createPage({
    render: 'static',
    path: '/',
    component: HomePage,
  });

  // /about に対するページを設定
  createPage({
    render: 'static',
    path: '/about',
    component: AboutPage,
  });
});
```

`createPages()` 関数は `createPage` と `createLayout` という 2 つの関数を引数に取るコールバック関数を受け取ります。2 つの関数は共通して以下のようなオプションを受け取ります。

- `render`：`"static"`（静的プリレンダリング SSG）か `"server"`（サーバーサイドレンダリング SSR）を指定
- `path`：ルートパス
- `component`：描画する React コンポーネント

`createLayout` は Next.js や Remix のようなレイアウトを設定するための関数です。`path: "/"` に対してレイアウトを指定すると、すべてのページに対する共通のレイアウトを設定できます。すべてのページに共通するレイアウトはルートレイアウトとも呼ばれます。

レイアウトは階層ごとに複数設定でき、このようなレイアウトをネストされたレイアウト（Nested Layout）と呼びます。例えば `createLayout` でレイアウトを設定する際にパスで `"/about"` を指定すると、`/about` とその配下の `/about/foo`, `/about/bar` などのページに対してのみ適用されます。

レイアウトコンポーネントは `children` を Props として受け取るコンポーネントであり、`children` には各ページのコンポーネントが渡されます。

```tsx:src/templates/root-layout.tsx
import '../styles.css';

import type { ReactNode } from 'react';

import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';

type RootLayoutProps = { children: ReactNode };

export const RootLayout = async ({ children }: RootLayoutProps) => {
  const data = await getData();

  return (
    <div id="__waku" className="font-['Nunito']">
      <meta property="description" content={data.description} />
      <link rel="icon" type="image/png" href={data.icon} />
      <Header />
      <main className="flex min-h-svh items-center justify-center *:min-h-64 *:min-w-64">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const getData = async () => {
  const data = {
    description: 'An internet website!',
    icon: '/images/favicon.png',
  };

  return data;
};
```

### ダイナミックルーティング

ルートパスにセグメント（`[]`）で囲まれたパスを指定することで、ダイナミックルーティングを設定できます。例えば `"/post/[id]"` というパスを指定すると、`/post/1`, `/post/2`, `/post/3` など複数のページに対して同じコンポーネントを描画できます。

```ts:src/entries.ts
export default createPages(async ({ createPage, createLayout }) => {
  createPage({
    render: 'dynamic',
    path: '/post/[id]',
    component: PostPage,
  });
});
```

動的なルーティングをビルド時に静的にプリレンダリングするためには、`staticPaths` オプションに生成されるパスのセグメントを配列で指定する必要があります。

```ts:src/entries.ts
export default createPages(async ({ createPage, createLayout }) => {
  const posts = await fetchPosts();

  createPage({
    render: 'static',
    path: '/post/[id]',
    component: PostPage,
    staticPaths: posts.map((post) => post.id),
  });
});
```

ルートパスのセグメントの値はコンポーネントの Props として受け取ります。

```tsx:src/templates/post-page.tsx
export const PostPage = async ({ id }: { id: string }) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  const data = await res.json();
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
};
```

## メタデータ

Waku ではコンポーネント内で `<title>`, `<meta>`, `<link>` などのメタデータを宣言した場合には、ドキュメントの先頭に自動で巻き上げられます。Waku でメタデータを宣言するために特に意識するべき項目はありません。

```tsx:src/templates/home-page.tsx
export const PostPage = async ({ id }: { id: string }) => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);

  const data = await res.json();
  return (
    <div>
      {/* 自動で <head> タグ内に挿入される */}
      <title>{data.title}</title>
      <meta
        name="description"
        content={data.body.slice(0, 100)}
      />
      <h1 className="text-4xl font-bold tracking-tight">{data.title}</h1>
      <p>{data.body}</p>
    </div>
  );
};
```

## 環境変数

Waku ではデフォルトですべての環境変数はプライベートとして扱われます。つまり、サーバーコンポーネント内でのみ環境変数にアクセスできるということです。サーバーコンポーネント内で環境変数を取得するためには `getEnv()` 関数を使います。

```tsx:src/templates/home-page.tsx
import { getEnv } from 'waku';
export const HomePage = async () => {
  const apiKey = getEnv('API_KEY');
  const res = await fetch(`https://api.example.com/posts?apiKey=${apiKey}`);
  // ...
};
```

クライアントコンポーネント内で環境変数にアクセスする場合には、環境変数の変数名の先頭に `"WAKU_PUBLIC_"` を付けてパブリックにする必要があります。パブリックな環境変数はユーザーのブラウザに公開されるため、センシティブな情報を含めることは避けるべきです。

クライアントコンポーネントから環境変数にアクセスする場合には `import.meta.env` を使います。

```tsx:src/components/Counter.tsx
"use client";
export const Counter = () => {
  const initialCount = import.meta.env.WAKU_PUBLIC_INITIAL_COUNT;
  const [count, setCount] = useState(Number(initialCount));
  // ...
};
```

## Server Actions

Waku では [Server Actions](https://ja.react.dev/reference/react/use-server#server-actions-in-forms) にも対応しています。Server Actions はクライアントサイドのフォームの送信やボタンクリックなどのイベントから、サーバーサイドで実行される関数を呼び出せます。クライアント JavaScript の削減、プログレッシブエンハンスメントなフォームを実現します。

まずは `src/actions.ts` にフォームの送信時に実行される関数を定義します。このファイルでは `"use server;"` ディレクティブを宣言することで、クライアントサイドのコードから呼び出せる、サーバサイドの関数であることを示しています。

```ts:src/actions.ts
"use server";

import { RenderContext } from "waku/server";
export async function createPost(this: RenderContext, formData: FormData) {
  const title = formData.get("title");
  const body = formData.get("body");

  console.log(`title: ${title}, body: ${body}`);
}
```

Waku では Server Actions 関数の `this` に `RenderContext` オブジェクトがバインドされているようです。（`renderer` 関数と `context` プロパティがありますが、用途は不明でした）。`<form>` の `action` 属性に渡す関数は `FormData` を引数として受け取るため、`formData.get()` でフォームの値を取得できます。

次に、`src/templates/create-post-page.tsx` にフォームを実装します。

```tsx:src/templates/create-post-page.tsx
import { createPost } from "../actions.js";
import { Form } from "../components/form.js";

export const createPostPage = () => {
  return (
    <>
      <h1 className="text-4xl font-bold tracking-tight">Create a post</h1>
      <Form createPost={createPost} />
    </>
  );
};
```

`<Form>` コンポーネントでは [useFormStatus()](https://ja.react.dev/reference/react-dom/hooks/useFormStatus#use-form-status) 使っているためクライアントコンポーネントとして扱う必要があります。そのため、このコンポーネントは別のファイルに分けてクライアントコンポーネントとして実装します。

!> 現在はクライアントコンポーネントから直接 Server Actions を import できないようです。[Roadmap](https://github.com/dai-shi/waku/issues/24) によると、今後のアップデートで対応される予定です。

```tsx:src/components/form.tsx
/// <reference types="react/canary" />
/// <reference types="react-dom/canary" />

"use client";

import { useFormStatus } from "react-dom";

const Button = () => {
  // フォームの状態を取得するフック
  // useFormStatus は <form> の中でしか使えないのでコンポーネントを分ける
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-4 bg-blue-500 text-white rounded-md p-2 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Creating..." : "Create"}
    </button>
  );
};

export const Form = ({
  createPost,
}: {
  createPost: (formData: FormData) => Promise<void>;
}) => {
  return (
    <form action={createPost}>
      <div className="mt-4">
        <label htmlFor="title" className="block">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <div className="mt-4">
        <label htmlFor="body" className="block">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>
      <Button></Button>
    </form>
  );
};
```

`<form>` の `action` 属性に `createPost` 関数を渡すことで、フォームの送信時に `createPost` 関数が実行されます。`useFormStatus()` フックをは直近のフォームのサブミット状態を取得するためのフックです。`pending` はフォームの送信中かどうかを示す真偽値で、この値が `true` の間はボタンが無効化されて「Creating...」と表示されます。

作製したコンポーネントを `src/entries.ts` でルーティングします。

```ts:src/entries.ts
export default createPages(async ({ createPage, createLayout }) => {
  createPage({
    render: 'static',
    path: '/new-post',
    component: CreatePostPage,
  });
});
```

http://localhost:3000/new-post にアクセスすると、フォームが表示されます。フォームに何かしらの値を入力して送信してみましょう。コンソールに以下のようなログが出力されることが確認できます。

```bash
title: hoge, body: foo
```

## まとめ

- Waku は React Server Components を使うためのミニマムなフレームワーク
- サーバーコンポーネントを使うことでパフォーマンス上の利点がある。デフォルトですべてのコンポーネントはサーバーコンポーネントとして実行される。インタラクティブな操作を行うためにはクライアントコンポーネントとして「オプトイン」する必要がある
- `src/entries.ts` がエントリーポイントで、`createPages()` 関数を使ってルーティングとレイアウトを設定する
- `<title>`, `<meta>`, `<link>` といったメタデータをコンポーネント内で宣言すると、自動でドキュメントの先頭に巻き上げられる
- サーバーコンポーネント内で環境変数にアクセスするためには `getEnv()` 関数を使う。クライアントコンポーネントから環境変数にアクセスするためには `"WAKU_PUBLIC_"` を付けてパブリックに、`import.meta.env` を使う
- Server Actions はクライアントサイドのフォームの送信やボタンクリックなどのイベントから、サーバーサイドで実行される関数を呼び出せる。`"use server;"` ディレクティブを宣言することで、クライアントサイドのコードから呼び出せる、サーバサイドの関数であることを示す

## 参考

- [Waku](https://waku.gg/)
- [dai-shi/waku: ⛩️ The minimal React framework](https://github.com/dai-shi/waku?tab=readme-ov-file)
- [waku/examples at main · dai-shi/waku](https://github.com/dai-shi/waku/tree/main/examples)
- [Making Sense of React Server Components](https://www.joshwcomeau.com/react/server-components/#specifying-client-components-5)
- [一言で理解するReact Server Components](https://zenn.dev/uhyo/articles/react-server-components-multi-stage)
