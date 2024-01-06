---
id: 2ukqc0KtB1lcVXLajOIbLp
title: "Vite だと require() が使えないよ〜"
slug: "vite-require"
about: "皆様はすでにプロジェクトに Vite は導入されていらっしゃいますでしょうか？私はできていません。  Vite はフロントエンドのビルディングツールであり、従来の Webpack 等と比較して高速に動作するといった特徴があります。Vue.js を開発した Evan You 氏によって開発ツールではありますが Vue.js に限らず React や Svelte にも対応しています。"
createdAt: "2022-01-16T00:00+09:00"
updatedAt: "2022-01-16T00:00+09:00"
tags: ["Vite"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4LlOrDdEXyxqi7wjIKAhgp/7bc2ba8009965c9fa02bf49493a13226/vite.svg"
  title: "vite"
published: true
---
皆様はすでにプロジェクトに Vite は導入されていらっしゃいますでしょうか？私はできていません。

Vite はフロントエンドのビルディングツールであり、従来の Webpack などと比較して高速に動作するといった特徴があります。Vue.js を開発した Evan You 氏によって開発ツールではありますが Vue.js に限らず React や Svelte にも対応しています。

Vue.js は 3.x しかサポートをしていないのですが [Vue 2.x 向けのプラグイン](https://www.npmjs.com/package/vite-plugin-vue2) をしようすれば Vue CLI 環境に開発ビルド時にのみ Vite を使用するといったことも可能になります。

しかし、Vite はビルドの高速化のために[Native ES Modules](https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Modules) を使用しているといった事情もあり Webpack からの移行にはひと手間かかります。

Webpack と比較したときに変更する必要がある機能について見てみましょう。

## require() が使えない

記事のタイトルにもありますとおり、まず大きな特徴として `require()` によるモジュールの読み込みができないという点があります。「`require` は未定義です」（`Uncaught ReferenceError: require is not defined`）という JavaScript のおなじみのエラーが発生します。

エラーの原因は単純明快で `require` はブラウザには存在しないためです。

`require()` 関数と `module.exports` オブジェクトは [CommonJS](https://ja.wikipedia.org/wiki/CommonJS) による仕様です。CommonJS とはブラウザ外における JavaScript（つまり Node.js など）のモジュールシステムの仕様を策定することを目的としたプロジェクトです。「ブラウザ外における JavaScript」とはっきり書かれているとおり、当然ブラウザはこの仕様には従わないのでブラウザには `require` は定義されていないというわけです。

さて、前述のとおり Vite は Native ES Moduels によって動作しています。Native ES Modules とは ECMAScript の仕様として定義されたモジュールであり、普段からよく使われている `import` と `export` を用いたやつです。

Native ES Modules の Native は何を意味するかといえば、バンドルツールを介さずに直接ブラウザで `import` 文が使えるということです。`<script>` タグに `type="module"` を含めることでそのスクリプトがモジュールであることを宣言します。

```js
<script type="module">
  /* ここに JavaScript モジュールコード */
</script>
```

上記の ES Modules は初めからブラウザで利用できるわけではありませんでした。そのため従来のバンドルツールは `import` 構文をブラウザで利用可能にするためには一度 Node.js 環境で 1 つのファイルに「バンドル」された後に実行されるという仕組みになっていました、このバンドルにかかる時間が開発サーバーの起動のボトルネックとなっていました。

Vite ではこのバンドルの手間を防ぐために Native ES Moduels を使用しているので基本的にブラウザのみで実行されます。そのため「ブラウザ外における JavaScript」のための仕様である `require()` は Vite において使用できないというわけです。 

その他 Nagive ES Modules については以下記事が詳しいです。

https://zenn.dev/uhyo/articles/what-is-native-esm-era

## require を import に置き換える

というわけで Vite では `require()` を使うことができないので適切に `import` に置き換える必要があります。

### Static import

まず `require()` がトップレベルで使われているのであれば単純に `import` に置き換えるだけでよいです。どちらの構文も同期的にモジュールを読み込みます。

```diff
- const lodash = require('lodash')
+ import loadsh from 'lodash'
```

上記のようにトップレベルで実行される静的な `improt` は Static import と呼ばれます。

### Dynamic import

少々ややこしいのは `require()` が `if` や関数内などのブロック内で使用されている場合です。前述の Static import はトップレベルのスコープでしか使えないという制限があります。

```ts
const someFunc = () => {
  // An import declaration can only be used in a namespace or module.
  import lodash from 'lodash'
}
```

`if` 文の中で `require` を使わざるを得ない状況として例えば [msw](https://mswjs.io/docs/getting-started/integrate/browser#start-worker) のような例があります。

```ts
// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("@/mocks/browser");
  worker.start();
}

createApp(App).mount("#app");
```

トップレベルで `./mocks/browser` のモジュールを読みこんでしまうと本番環境においても `msw` のコードが入り込んでしまうため、現在の環境に応じで条件付きでモジュールを読み込むことを推奨しています。

さて、Static import ではそのまま置き換えることができないのでこのような状況では Dynamic import を使用する必要があります。Dynamic import は `import` を関数としてどこからでも呼び出すことができます。

ただし、1 つ重要な点として `require()` は常に同期的に読み込むのに対して `import()` 関数は**非同期で読み込む - Promiseを返す** といった違いがあります。

これは ES Modules がサーバーサイドだけでなくブラウザにも使われることを考えてこのような仕様となっています。

https://qiita.com/suin/items/a106289e2d1d8d9c1490

つまり、上記の `require` を使ったコードは単純に `import()` 関数に置き換えることができません。

```ts
import { createApp } from "vue";
import App from "./App.vue";

if (process.env.NODE_ENV === "development") {
  // Property 'worker' does not exist on type 'Promise<typeof import("src/mocks/browser")>'.
  const { worker } = import("@/mocks/browser");
  worker.start();
}

createApp(App).mount("#app");
```

下記のように `async/await` を使用したコードに置き換える必要があります。

```ts
import { createApp } from "vue";
import App from "./App.vue";

const setup = async () => {
  if (import.meta.env.DEV) {
    const { worker } = await import("@/mocks/browser");
    worker.start();
  }
};

// setup が完了した後にアプリケーションをマウントする必要がある。
setup().then(() => createApp(App).mount("#app"));
```

## .cjs 拡張子

基本的には `require()` や `module.exports` を `import` と `export` に置き換えればよいわけなのですが、 `.eslintrc.js` や `jest.config.js` のように依然として CommonJS を使用しなければいけないファイルも存在します。

理由は単純に ESLint や Jest は Node.js 環境で実行されるためです。

このように Vite プロジェクトにおいても CommonJS の構文を使用しているファイルは拡張子を `.cjs` とすることが推奨されます。

拡張子が `.cjs` のものは CommonJS として、`.mjs` のものは　ES Modules として扱うことを明示的に示しています。

https://nodejs.medium.com/announcing-a-new-experimental-modules-1be8d2d6c2ff

また拡張子が `.js` のものは `package.json` の `type` の記述によって扱いが異なります。`type: "module"` を指定している場合には ES Modules として扱われ、`commonjs` または記述しない場合には CommonJS として扱われます。

## import.meta.env による環境変数の読み込み

Vite がブラウザのみで動作するということは、`process.env` により `.env` ファイルから環境変数を読み込むこともできなくなります。[process](https://nodejs.org/api/process.html) もまた Node.js のみに存在するオブジェクトです。

Vite において環境変数を利用するには `import.meta.env` を使います。`import.meta.env` はビルドイン変数として以下を公開しています。

- `import.meta.env.MODE`: {string} アプリが動作しているモード。
- `import.meta.env.BASE_URL`: {string} アプリが配信されているベース URL。これは base 設定オプションによって決まります。
- `import.meta.env.PROD`: {boolean} アプリがプロダクションで動作しているかどうか。
- `import.meta.env.DEV`: {boolean} アプリが開発で動作しているかどうか（常に - - `import.meta.env.PROD` の逆）

https://ja.vitejs.dev/guide/env-and-mode.html#env-variables

`import.meta` は ES2020 で策定されたモジュールのメタ情報を取得するための機能です。これは ES Moduels 内のみで使用できます。

https://qiita.com/uhyo/items/7b00ad577618554d3276
https://numb86-tech.hatenablog.com/entry/2020/08/08/232535

また Vite は [dotenv](https://github.com/motdotla/dotenv) によって `.env` ファイルに定義された環境変数を読み取ります。

この環境変数は `VITE_` のプレフィックスで始まる変数のみが公開されます。

```
VITE_SOME_SECRET=XXX
```

TypeScript のおいて `import.meta.env` のインテリセンスを効かせるようにするためには `src` ディレクトリ配下に `env.d.ts` ファイルを作成します。

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOME_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```
