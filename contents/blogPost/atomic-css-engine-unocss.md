---
id: 6i6snQMi1Wul2B4tnUm5ym
title: "Atomic CSS エンジン - UnoCSS"
slug: "atomic-css-engine-unocss"
about: "UnoCSS はフレームワークではなく、Atomic CSS エンジンです。全ては柔軟性とパフォーマンスを考慮して設計されています。UnoCSS にはコアユーティリティはなく、すべての機能はプリセットで提供されます。"
createdAt: "2022-06-11T00:00+09:00"
updatedAt: "2022-06-11T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/62Rm9VoIOW7mjUVoyY7bxg/d0e5bfc94f47dd45cbabad251c705b08/icon-gray.svg"
  title: "uno-css"
selfAssessment: null
published: true
---
[UnoCSS](https://github.com/unocss/unocss) は [Windi CSS](https://windicss.org/)、[Tailwind CSS](https://tailwindcss.com/) それと [Twind](https://github.com/tw-in-js/twind) に影響を受けた機能を持っています。

しかし、UnoCSS はフレームワークではなく、Atomic CSS エンジンです。すべては柔軟性とパフォーマンスを考慮して設計されています。UnoCSS にはコアユーティリティはなく、すべての機能はプリセットで提供されます。

## インストール

以下のコマンドで UnoCSS をインストールします。

```sh
$ npm i -D unocss
```

`uno.css` をエントリーポイントなるファイル（`main.ts` など）インポートします。

```ts
// main.ts
import 'uno.css'
```

VSCode 用の拡張もあるのでこちらもインストールしておくとよいでしょう。

https://marketplace.visualstudio.com/items?itemName=antfu.unocss

## プリセットの導入

UnoCSS のインストールは完了しましたが、前述のとおり UnoCSS はフレームワークではないので単体ではユーティリティクラスを提供していません。カスタムルールを定義することもできますが、ここではプリセットを導入しましょう。プリセットはあらかじめ作成されたユーティリティクラスを提供してくれます。

公式のプリセットでは以下が提供されています。

- [@unocss/preset-uno](https://github.com/unocss/unocss/tree/main/packages/preset-uno) - デフォルトのプリセット（`@unocss/preset-wind` と同等）
- [@unocss/preset-mini](https://github.com/unocss/unocss/tree/main/packages/preset-mini) - 最低限必要なルールと変数
- [@unocss/preset-wind](https://github.com/unocss/unocss/tree/main/packages/preset-wind) - Tailwind / Windi のコンパクトプリセット
- [@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify) - Windi CSS の [Attributify Mode](https://windicss.org/posts/v30.html#attributify-mode) を有効にするプリセット
- [@unocss/preset-icons](https://github.com/unocss/unocss/tree/main/packages/preset-icons) - アイコンを提供する
- [@unocss/preset-web-fonts](https://github.com/unocss/unocss/tree/main/packages/preset-web-fonts) - Web フォント
- [@unocss/preset-typography](https://github.com/unocss/unocss/tree/main/packages/preset-typography) - タイポグラフィ

まずはデフォルトのプリセットを有効化します。上記のプリセットは `unocss` モジュールで提供されてるので、新たにパッケージをインストールする必要はありません。

プリセットは `vite.config.ts` で以下のように追加します。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'

export default defineConfig({
  plugins: [
    Unocss({
      presets: [
        presetUno(),
      ]
    })]
})
```

それでは追加したデフォルトプリセットを使用してみましょう。デフォルトプリセットは Tailwind CSS、Windi CSS、Bootstrap、Tachyons などの共通のスーパーセットを提供します。また詳細なユーティリティクラスは以下のドキュメントから参照できます。

https://uno.antfu.me/

Tailwind CSS と似た感じでスタイルを適用できます。

```ts
function App() {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 border-none text-white font-bold py-2 px-4 rounded-1">
      Hello World
    </button>
  );
}

export default App;
```

![スクリーンショット 2022-06-11 20.14.12](//images.ctfassets.net/in6v9lxmm5c8/5GpDj9XQTv9kWNAaZj3QlU/85ba7dad715e660b8013c3197d0f528c/____________________________2022-06-11_20.14.12.png)

### Attributify Mode

[@unocss/preset-attributify](https://github.com/unocss/unocss/tree/main/packages/preset-attributify) プリセットを使用するとユーティリティクラスを使用する代わりに HTML 属性を利用できます。設定ファイルから `preset-attributify` ルールを追加します。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unocss(
      {
        presets: [
          presetAttributify(),
          presetUno(),
        ],
      }
    )
  ]
})
```

TypeScript を使用する場合には `shims.d.ts` を作成して次の記述します。

#### Vue

```ts
declare module '@vue/runtime-dom' {
  interface HTMLAttributes {
    [key: string]: any
  }
}
declare module '@vue/runtime-core' {
  interface AllowedComponentProps {
    [key: string]: any
  }
}
export {}
```

#### React

```ts
import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module 'react' {
  interface HTMLAttributes<T> extends AttributifyAttributes {}
}
```

#### Vue 3

```ts
import type { AttributifyAttributes } from '@unocss/preset-attributify'

declare module '@vue/runtime-dom' {
  interface HTMLAttributes extends AttributifyAttributes {}
}
```

attributify mode では以下のように HTML 属性で分けてユーティリティを記述できます。

```ts
function App() {
  return (
    <button
      bg="blue-400 hover:blue-500 dark:blue-500"
      text="sm white"
      font="mono light"
      p="y-2 x-4"
      border="2 rounded blue-200"
    >
      Hello World
    </button>
  );
}

export default App;
```

## カスタムルール

設定ファイルの `rules` ではカスタムルールを定義できます。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'

export default defineConfig({
  plugins: [
    Unocss(
      {
        presets: [
          presetUno(),
        ],
        rules: [
          ['bg-primary', { background: '#007bff' }],
        ],
      },
    )
  ]
})
```

## ショートカット

設定ファイルで `shortcuts` を定義すればユーティリティクラスの組み合わせを定義できます。

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Unocss from 'unocss/vite'
import { presetUno } from 'unocss'

export default defineConfig({
  plugins: [
    Unocss(
      {
        presets: [
          presetUno(),
        ],
        shortcuts: {
          btn: 'bg-blue-500 hover:bg-blue-700 border-none text-white font-bold py-2 px-4 rounded-1'
        }
      },
    )
  ]
})
```

定義したショートカットをクラスとして使用できます。

```ts
function App() {
  return <button className="btn">Hello World</button>;
}

export default App;
```

## リセット CSS 

UnoCSS は他の CSS フレームワークと異なりデフォルトではリセット CSS を適用していません。リセット CSS を使用するには `@unocss/reset` からインポートします。

```sh
$ npm i @unocss/reset
```

```ts
// main.ts
import '@unocss/reset/tailwind.css' // tailwind css と同じリセット CSS
```

`@unocss/reset` は上記の他にも以下のリセット CSS を提供しています。

> ```
> // main.js
> // pick one of the following
> 
> // normalize.css https://necolas.github.io/normalize.css/
> import '@unocss/reset/normalize.css'
> 
> // sanitize.css https://github.com/csstools/sanitize.css#usage
> import '@unocss/reset/sanitize/sanitize.css'
> import '@unocss/reset/sanitize/assets.css'
> 
> // reset.css by Eric Meyer https://meyerweb.com/eric/tools/css/reset/index.html
> import '@unocss/reset/eric-meyer.css'
> 
> // preflights from tailwind
> import '@unocss/reset/tailwind.css'
> 
> // opinionated reset by Anthony Fu
> // https://github.com/unocss/unocss/blob/main/packages/reset/antfu.md
> import '@unocss/reset/antfu.css'
> ```

https://github.com/unocss/unocss/tree/main/packages/reset

## デバッグ

Vite で開発サーバーを起動しているとき、http://localhost:3000/__unocss にアクセスすると UI 上で適用される CSS を確認できます。

![スクリーンショット 2022-06-11 20.34.28](//images.ctfassets.net/in6v9lxmm5c8/6K8MY5AQ1GijLbRQ3ZVUQG/e90093d677285726d04de14e43ce3d0c/____________________________2022-06-11_20.34.28.png)

![スクリーンショット 2022-06-11 20.35.18](//images.ctfassets.net/in6v9lxmm5c8/3RcHuy2Ksx4HK1VAR8xbpn/f3a14cbb60cae64a04dc185430e7acec/____________________________2022-06-11_20.35.18.png)

## 感想

UnoCSS の提供している機能は Windi CSS に近い感じですね。Tailwind CSS や Windi CSS と比較した点はカスタムルールの作りやすさという点があげられます。

UnoCSS の作成された動機や思想については以下の作者の記事を参照するとよいでしょう。

https://antfu.me/posts/reimagine-atomic-css
