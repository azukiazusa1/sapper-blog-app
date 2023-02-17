---
title: "Satori + SvelteKit で OGP 画像を自動生成する"
about: "Satori とは Vercel が公開している OGP 画像生成ライブラリです。OGP 画像を表示したい場合、記事ごとに対応する OGP 画像が必要になるわけで、新しい記事を投稿するたびに新たな画像を生成しなければいけません。都度画像を生成する手間は取れないわけで、このOGP 画像を生成する工程を自動化する仕組みが必要となります。Satori は記事のタイトルなどをもとに動的 OGP 画像を生成するユースケースのために使用できます。"
createdAt: "2022-12-18T00:00+09:00"
updatedAt: "2022-12-18T00:00+09:00"
tags: ["Svelte", "SvelteKit", "OGP"]
published: true
---
Satori とは Vercel が公開している OGP 画像生成ライブラリです。

https://github.com/vercel/satori

OGP 画像とは、Twitter などの SNS などでシェアされる際に表示されるサムネイル画像のことです。例えば、ブログなどの場合には以下のようにタイトルを画像として表示しているのを見かけたことがあるのではないでしょうか？

![スクリーンショット 2022-12-17 18.38.39](//images.ctfassets.net/in6v9lxmm5c8/2LkIKN4yIr6FzdwFRiCrwz/d775afd509c49c6c96faadd1c7d26dfe/____________________________2022-12-17_18.38.39.png)

このような OGP 画像を表示したい場合、記事ごとに対応する OGP 画像が必要になるわけで、新しい記事を投稿するたびに新たな画像を生成しなければいけません。都度画像を生成する手間は取れないわけで、このOGP 画像を生成する工程を自動化する仕組みが必要となります。

Satori はこのように記事のタイトルなどをもとに動的に OGP 画像を生成するユースケースのために使用できます。OGP 画像を生成する場合、画像を生成する API を用意していおいてクエリパラメータでタイトルなどを指定して動的に生成する方法がよく上げられています。

例えば、Vercel の提供する [Open Graph Image as a Service](https://og-image.vercel.app/) が該当するでしょう。`https://og-image.vercel.app/azukiazusa` のように URL パスで文字列を指定して画像を生成できます。

![azukiazusa](https://og-image.vercel.app/azukiazusa)

この記事では SSG であらかじめ静的に生成された HTML を表示するブログ向けに SvelteKit を用いてビルド時に静的に OGP 画像を生成する方法を紹介します。

## satori のインストール

この記事では SSG のためのフレームワークとして SvelteKit を利用していますが、その他のフレームワークでも同じように動かせると思うので、あまり詳細の内容までは踏み込みません。まずは冒頭で紹介した OGP 画像を生成するためのツールである [satori](https://github.com/vercel/satori) をインストールします。

```sh
npm install satori
```

satori の特徴は JSX 構文により HTML と CSS を用いて直感的に画像を生成できるところにあります。JSX を使用せずにオブジェクト形式で記述することもできますが、よほど特別な事情がない限り JSX 形式で書くのがわかりやすいでしょう。JSX を使用するためには React をインストールする必要があります。

```sh
npm install react @types/react
```

さらに、`tsconfig.json` の `compilerOptions` に `"jsx": "react-jsx"` を追加します。

```json:tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx"
  }
}
```

Satori は SVG 形式で画像を生成するのですが、OGP 画像は SVG をサポートしていません。そのため、satori により生成された画像を別の形式に変換する必要があります。今回は SVG から PNG に変換するために Node.js 上で使える [sharp](https://github.com/lovell/sharp) というライブラリを使用します。

```sh
npm install sharp
```

最後に、Satori を使用するためにはフォントデータが必要です。[Google Fonts](https://fonts.google.com/) などでダウンロードしておいてローカルに配置しておきましょう。今回は [Noto Sans Japanese](https://fonts.google.com/noto/specimen/Noto+Sans+JP) をダウンロードして `/fonts/NotoSansJP-Regular.otf` に配置しておきます。

## Satori で画像を生成する

まずは Satori を使用して画像を生成する関数を作成しましょう。`src/lib/generateOgpImage.tsx` ファイルを作成します。

```tsx:src/lib/generateOgpImage.tsx
import React from 'react'
import satori from 'satori'
import sharp from 'sharp'
import fs from 'fs'

export const generateOgpImage = async (title: string): Buffer => {
  // フォントデータを読み込む
  const font = fs.readFileSync('./fonts/NotoSansJP-Regular.otf')
  // JSX から画像を生成する
  const svg = await satori(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'column',
        backgroundColor: 'rgb(55,65,81)',
        fontWeight: 600,
        padding: 48,
        border: '48px solid rgb(31,41,55)',
      }}
    >
      <div style={{ color: '#fff', fontSize: 64, maxWidth: 1000 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ color: '#d1d5db', fontSize: 48, display: 'flex', alignItems: 'center' }}>
          <img
            src="https://avatars.githubusercontent.com/u/59350345?s=400&u=9248ba88eab0723c214e002bea66ca1079ef89d8&v=4"
            width={48}
            height={48}
            style={{ borderRadius: 9999, marginRight: 24 }}
          />
          azukiazusa
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Noto Sans JP',
          data: font,
          style: 'normal',
        },
      ],
    },
  )

  // SVG から PNG 形式に変換する
  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return png
}
```

はじめに `fs.readFileSync('./fonts/NotoSansJP-Regular.otf')` でフォントデータを読み込みます。これは後ほど `satori` 関数のオプションとして渡します。

続いて `satori` 関数を呼び出しここで画像を生成します。前述したとおり、JSX により HTML と CSS を用いて画像を生成できます。Satori においてサポートされている HTML と CSS はいくつかの制限が存在します。通常静的で目に見える要素のみが実装されています。例えば、HTML の `<input>` 要素や CSS の `cursor` プロパティはサポートされていません。

サポートされている要素は以下から確認できます。
- [HTML 要素](https://github.com/vercel/satori/blob/main/src/handler/presets.ts)
- [CSS](https://github.com/vercel/satori#css)

また、実験的な機能ではありますが。TailwindCSS 形式のプロパティを使用することもできます。

```html
  <div tw="bg-gray-50 flex w-full">
    <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
      ...
```

実際にどのように描画されるかどうか確認するには、[Playground](https://og-playground.vercel.app/) で確認するのがよいでしょう。

![スクリーンショット 2022-12-17 20.24.03](//images.ctfassets.net/in6v9lxmm5c8/3VyfaiQkY7fRXIpIl28Bgw/23c3b48d25c5c868829bc0ccb2b59e20/____________________________2022-12-17_20.24.03.png)

`satori` 関数の第2引数には画像を生成する際のオプションを渡します。画像のサイズや使用するフォントの情報などです。OGP 画像のサイズは 1200×630px が一般的[要出典]ですのでそのとおりに `width` と `height` プロパティを渡しています。

最後に `sharp` により PNG 形式に変換して完了です。

```ts
const png = sharp(Buffer.from(svg)).png().toBuffer()
```

## 画像を生成するエンドポイントを作成する

先程作成した `generateOgpImage` 関数を使用して生成した画像を返却するエンドポイントを作成しましょう。SvelteKit のルーティングはファイルベースのルーティングを採用しており、ディレクトリの構造と同じパスでルートを作成します。例えば `src/routes/blog/[slug]` のようなディレクトリは `/blog/foo` や `/blog/bar/` のようなルートを作成します。

[ルーティング](https://kit.svelte.jp/docs/routing)

`routes` のディレクトリにはそれぞれ1つ以上のルートファイルが存在します。ルートファイルは `+page.svelte` のように接頭辞として `+` がついているのでそれで判別可能です。

Next.js の API Routes のようにサーバー側で動作するエンドポイントを作成するためには、ルートファイルとして `+server.ts` ファイルを作成します。今回は `src/routes/blog/ogp/[title].png/+server.ts` ファイルを作成して `/blog/ogp/記事のタイトル.png` のようなパスで画像を配置できるようにします。

[+server](https://kit.svelte.jp/docs/routing#server)

```ts:src/routes/blog/ogp/[title].png/+server.ts
import { generateOgpImage } from '$lib/generateOgpImage'
import type { RequestHandler } from '@sveltejs/kit'

export const prerender = true

export const GET: RequestHandler = async ({ params }) => {
  const { title } = params
  const png = await generateOgpImage(title)

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
```

`+server.ts` では `GET`,`POST`,`PATCH`,`PUT`,`DELETE` のような HTTP メソッドに対応する名前の関数を `export` します。この関数は [RequestEvent](https://kit.svelte.jp/docs/types#public-types-requestevent) を引数にとり [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) オブジェクトを返却します。

さらに SvelteKit の面白い点として、サーバー側ルートであっても `export const prerender = true` を宣言することでプレレンダリングできます。これにより、ビルド時に静的アセットとして OGP 画像を配置することが可能です。

## 記事詳細画面で OGP 画像を設定する

OGP 画像を生成する仕組みが整ったので、記事詳細画面から OGP 画像を設定するようにしましょう。`src/routes/blog/[slug]/+page.svelte` ファイルが記事の詳細画面のコンポーネントだとします。

```html:src/routes/blog/[slug]/+page.svelte
<script lang="ts">
  import ArticleCard from '../../../components/ArticleCard.svelte'
  import type { PageData } from './$types'

  export let data: PageData
  const baseUrl = process.env.BASE_URL
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
  <<meta property="og:title" content={title} />
  <meta property="og:image" content={`baseUrl/blog/ogp/${encodeURIComponent(post.title)}.png`} />
  <meta property="og:description" content={description} />
</svelte:head>

<ArticleCard title={post.title} contents={post.contents} />
<!-- svelte-ignore a11y-missing-content -->
<a href={`/blog/ogp/${encodeURIComponent(post.title)}.png`} />
```

`export let data: PageData` はページのレンダリングが開始する前にサーバーで取得されたデータです。Next.js のおける `getStaticProps` に相当するものだと考えればよいでしょう。型注釈に使用している `PageData` は `./$types` から import していますが、これは SvelteKit により自動で生成されるもので、サーバー側の関数の返り値の型（`+page.server.ts` の `load` 関数）が自動で割り当てられます。

OGP の情報の設定は `<head>` タグ内に記述します。SvelteKit では `<svelte:head>` という特殊なタグを使用することで `<head>` タグ内に要素を挿入できます。OGP 画像は `<meta property="og:image" />` というタグで設定します。`property` の値には先程作成した OGP 画像を生成するパスを指定します。ここでは相対パスではなく絶対パスで指定する必要があるところに注意しましょう。

最後にとある事情で空の `<a>` タグで OGP 画像へのパスを指定します。これは、SvelteKit が プレレンダリング可能なページを各ページの `<a>` タグをクローリングして見つけるためです。この仕様により、動的なルートにおいて Next.js の `getStaticPaths` のような関数を用意する必要はないのですが、`<meta>` タグの `property` 属性に指定したパスはクローリングしてくれないためハック的な方法で空の `<a>` タグを置いています。

ここまでの作業が完了したら、OGP 画像を生成できるはずです。`npm run build` コマンドでアプリケーションをビルドして成果物に OGP 画像が含まれていることを確認できます。このブログでも同様のことを行って OGP 画像を生成しているので、参考にしてみてください。

https://github.com/azukiazusa1/sapper-blog-app
