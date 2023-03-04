---
id: 5Im9odBz5VHh32lzohqfYe
title: "TailWindCSSとは"
slug: "what-is-tailwindcss"
about: "TailWindCSSはBootStrap・Materialize CSSなどに代表するCSSフレームワークの一つです。 その特徴として、**Utility First**を掲げています。"
createdAt: "2021-01-31T00:00+09:00"
updatedAt: "2021-01-31T00:00+09:00"
tags: ["tailwindcss", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2GQfDJKqG7T0kWVwn1DZeJ/679ebd658ac716ded2dd61bb200e4780/tailwindcss.png"
  title: "tailwindcss"
published: true
---
TailWindCSS は BootStrap・Materialize CSS などに代表する CSS フレームワークの 1 つです。
その特徴として、**Utility First**を掲げています。

# Utility Firstとは
Utility First とは、どういうことでしょう。
例えば、BootStrap の場合にはボタンを表示したい場合には次のようになります。

```html
<button class="btn btn-primary">Button</button>
```

`btn` というクラスが、あらかじめデザインされたコンポーネントを意味します。さらに、色を変更したい場合には、`btn-primary` を `btn-danger`・`btn-success` に変えたり、サイズを変更するために `btn-lg` を与えたりとある程度の拡張性ももっています。

![スクリーンショット 20210131 20.54.31.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FCF4wKhFELhvA2sbB3yWB%2Fa01f8cc0ba1a9eeacf91f3ff1fdb7a08.png?alt=media&token=4ddb93b2-c3f4-435e-8bf8-e539df3ef801)

他方で、TailWindCSS を用いて記述した場合には、次のようになります。

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Button</button>
```

見て分かるとおり、`btn` のようなクラスは存在せずすべてがユーティリティクラスのみで構成されています。このようにユーティリティクラスを組み合わせて実装することになります。

![スクリーンショット 20210131 21.34.31.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FCF4wKhFELhvA2sbB3yWB%2Fe1f1d258cfd2f7e1276c371d9630ddf6.png?alt=media&token=c986f603-bf31-43f2-a000-d15c4b05ec9e)

そのため、他の CSS フレームワークと異なりカスタマイズ性が高いのが特徴です。

# TailWindCSSの導入

## npmプロジェクトの作成

TailWindCSS の導入に際して、npm または yarn を使います。まずは npm プロジェクトを作成します。

```sh
npm init -y
```

## パッケージのインストール

必要なものをいろいろインストールします。

```sh
npm install tailwindcss@latest postcss@latest autoprefixer@latest postcss-cli
```

postcss・autoprefixer は必須ではありませんが、実際のプロジェクトでは PostCSS の plugin としてインストールすることがおすすめされています。

## postcss.config.jsの作成

次に `postcss.config.js` を作成して、tailwindcss をプラグインとして追加します。

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

## TailWindCSSの設定ファイルの作成

次に、TailWindCSS の設定ファイルである `tailwind.config.js` を作成します。
以下のコマンドを使用します。

```sh
npx tailwindcss init
```

プロジェクトのルート配下に次のように作成されました。

```js
// tailwind.config.js
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

## TailWindCSSの読み込み

CSS ファイルを作成して、そこで TailWindCSS を読み込むようにします。
src フォルダに `src/css/styles.css` を作成しました。

```css
/* src/styles.css */
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

## ビルド

それでは、TailwWindCSS を CSS にビルドしましょう。
`package.json` にビルドコマンドを追加します。

```diff
{
  "name": "tailwind",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
+    "build": "NODE_ENV=production postcss src/css/styles.css -o src/public/compiled.css"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "autoprefixer": "^10.2.4",
    "postcss": "^8.2.4",
    "postcss-cli": "^8.3.1",
    "tailwindcss": "^2.0.2"
  }
}
```

以下のコマンドを実行すると、`src/public/compiled.css` が作成されます。

```sh
npm run build
```

## ビルドの最適化

出力されたビルドファイルは、使用していないクラスも含めてすべてのユーティリティクラスが出力されるので、ファイルサイズがとても大きくなってしまいます。

TailWindCSS では、使用されていないクラスを検知してビルドファイルに含めないようにできます。

`tailwind.config.js` の `purge` オプションを変更します。

```diff
module.exports = {
-  purge: [],
+  purge: [
+    './src/**/*.html',
+    './src/**/*.js',
+  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

本番ビルド時には、`purge` で指定されたファイルで使用されたクラスのみを出力するようになりました。

## 独自クラスの作成

ユーティリティクラスのみを使って記述する関係上、たくさんのクラスを HTML タグに付与する必要があるので読みづらくなったり、重複する箇所が出てきたりします。

そんなときは、`@apply` ディレクトリを使用することで独自クラスを作成できます。

`src/css/styles.css` に次のように追加します。

```css
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";

.btn-primary {
  @apply bg-blue-500 text-white font-bold py-2 px-4 rounded
}

.btn-primary:hover {
  @apply bg-blue-700
}
```

`@apply` の後には、TailWindCSS のユーティリティクラスを記述します。
ここで作成したクラスは、次のように利用できます。

```html
<button class="btn-primary">Button</button>
```
