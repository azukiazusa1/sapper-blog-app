---
id: G29-HEGEE84BayZunZJKR
title: Next.js の Interception Routes について
slug: nextjs-interception-routes
about: Intercepting routes は Next.js 13.3 から追加された機能で、App Router（app ディレクトリ）において使用できます。Intercepting routes ではブラウザの URL を遷移先のものに上書きしつつ、現在のレイアウトに新しいページを表示できます。これは例えば Instagram のように、ユーザーのプロフィールから写真をクリックすると、写真をモーダルを開き、ページを更新したり共通したりするとデフォルトのレイアウトで表示する場合などに便利です。
createdAt: "2023-04-09T13:38+09:00"
updatedAt: "2023-04-09T13:38+09:00"
tags: [Next.js]
thumbnail:
  url: https://images.ctfassets.net/in6v9lxmm5c8/4Sxp9WBwpkArsZj3vTXnE1/0fc392ade0505df2688b32ca95db303e/___Pngtree___samurai_japan_warrior_8177656.png
  title: samurai japan warrior
published: true
---

Intercepting routes は Next.js 13.3 から追加された機能で、App Router（app ディレクトリ）において使用できます。

Intercepting routes ではブラウザの URL を遷移先のものに上書きしつつ、現在のレイアウトに新しいページを表示できます。これは例えば以下のようなケースで便利です。

- Instagram のように、ユーザーのプロフィールから写真をクリックすると、写真をモーダルを開き、ページを更新したり共通したりするとデフォルトのレイアウトで表示する場合
- タスクの一覧を表示しつつ、新しいタスクを作成・更新するフォームをモーダルで表示したい場合

![](https://images.ctfassets.net/in6v9lxmm5c8/4RWYP3Qcrv3Lo7J9H7xgXa/ad172ed8244e4ba0774f2d17d0dae20b/instagram-example.gif)

## 使い方

Intercepting routes により「横取り」したいページは先頭に `(..)` をつけます。ちょうど相対パスと `../` と同じような感じです。また、`(...)` を使用すると `app` ディレクトリからの相対パスとなります。これが Interception routes の規約です。

Vercel より提供されている [nextgram](https://github.com/vercel/nextgram) というサンプルアプリケーションを見てみましょう。

このサンプルアプリケーションでは、写真の一覧から写真をクリックするとモーダルで写真を表示します。このとき、URL は `/photos/1` に変更されます。この状態でページを更新してみると、モーダルではなくデフォルトのレイアウトで写真が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/qIskyHzHD2xiBK1xcl88N/583ccc3b86afe8ed6f5b51029f1be6d2/next-gram.gif)

`app` ディレクトリ内は以下のようになっています。

```bash
app
├── @modal
│   ├── (..)photos
│   │   └── [id]
│   │       └── page.js
│   └── default.js
├── default.js
├── global.css
├── layout.js
├── opengraph-image.png
├── page.js
└── photos
    └── [id]
        └── page.js
```

`@modal/(..)photos/[id]/page.js` の箇所が Interception routes です。このファイルの内容が、`/photos/1` のようなルートにクライアントサイドで遷移したときに描画されます。

```tsx:app/@modal/(..)photos/[id]/page.js
import Photo from "../../../../components/frame";
import Modal from "../../../../components/modal";
import swagPhotos from "../../../../photos";

export default function PhotoModal({ params: { id: photoId } }) {
  const photos = swagPhotos;
  const photo = photoId && photos.find((p) => p.id === photoId);

  return (
    <Modal>
      <Photo photo={photo} />
    </Modal>
  );
}
```

`<Modal>` を閉じる際には `router.back()` を使用して前のページに戻るようになっていることがわかります。これはモーダルが表示される時に、`/photos/1` という URL に遷移することになるからです。

```tsx:components/modal/index.js
"use client";
import { useRouter } from "next/navigation";

export default function Modal({ children }) {
  const router = useRouter();

  const onDismiss = useCallback(() => {
    router.back();
  }, [router]);
```

### Parallel Routes

ディレクトリは `@modal` と先頭に `@` が付けられた名前から始まっています。これも Next.js 13.3 から追加された機能で [Parallel Routes](https://beta.nextjs.org/docs/routing/parallel-routes) と呼ばれています。

Parallel Routes は同じレイアウトの中に複数のページを表示するための機能です。この機能を利用して、写真の一覧とモーダルを同時に表示しています。

Parellel Routes は名前付きスロットにより生成されます。規約では `@modal` のように先頭に `@` が付けられた名前がスロットの名前として使用されます。この `@modal` スロットは同じ階層にある [Layout](https://beta.nextjs.org/docs/routing/pages-and-layouts#layouts) コンポーネントの Props として受け取ります。

```tsx:app/layout.js
import "./global.css";
import GithubCorner from "../components/github-corner";

export default function Layout(props) {
  return (
    <html>
      <body>
        <GithubCorner />
        {/*  通常の children props */}
        {props.children}
        {/* `@modal` ディレクトリが描画される */}
        {props.modal}
      </body>
    </html>
  );
}
```

ここで、`children` props は暗黙的に解決されます。つまり、`app/page.js` は `app/@children/page.js` と同等ということです。ディレクトリの `@modal` の部分は URL には影響を与えず、`/photos/1` のような URL として扱われます。

上記の `layout.js` の例では `/photos/1` という URL にアクセスした場合には `app/page.js` と `app/@modal/photos/[id]/page.js` の両方の内容が描画されることになります。

### 写真一覧ページ（`app/page.js`）

`page.js` の内容も見てみましょう。モーダルのトリガーとして、`<Link>` コンポーネントを使用していることがわかります。`/photos/1` という URL にページ遷移を発生させることにより、Parallel Routes として定義した `app/@modal/photos/[id].page.js` のモーダルが表示されます。

```tsx:app/page.js
import Link from "next/link";
import swagPhotos from "../photos";
import Image from "next/image";

export default function Home() {
  const photos = swagPhotos;

  return (
    <main className="container mx-auto">
      <h1 className="text-center text-4xl font-bold m-10">NextGram</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 auto-rows-max	 gap-6 m-10">
        {photos.map(({ id, imageSrc }) => (
          <Link key={id} href={`/photos/${id}`}>
            <Image
              alt=""
              src={imageSrc}
              height={500}
              width={500}
              className="w-full object-cover aspect-square"
            />
          </Link>
        ))}
      </div>
    </main>
  );
}
```

### デフォルトのレイアウト

ところで、`/photos/1` という URL には `app/photos/[id].tsx` というファイルにもマッチします。

```tsx:app/photos/[id].tsx
import React from "react";
import Photo from "../../../components/frame";
import swagPhotos from "../../../photos";

export default function PhotoPage({ params: { id } }) {
  const photo = swagPhotos.find((p) => p.id === id);

  return (
    <div className="container mx-auto my-10">
      <div className="w-1/2 mx-auto border border-gray-700">
        <Photo photo={photo} />
      </div>
    </div>
  );
}
```

このクライアントで遷移した時に `app/photos/[id].tsx` ではなく `app/@modal/photos/[id].tsx` が優先して解決されるからこそ、Interception routes という名前なのです。

クライアントサイド以外での遷移、例えば `/photos/1` に直接アクセスした場合には、`app/photos/[id].tsx` が解決されます。これにより、写真一覧から遷移したときにはモーダルが、ページを更新したときには写真の詳細ページが表示される機能が実現されています。

## 参考

- [Routing: Intercepting Routes | Next.js](https://beta.nextjs.org/docs/routing/intercepting-routes)
- [vercel/nextgram: A sample Next.js app showing dynamic routing with modals as a route.](https://github.com/vercel/nextgram)