---
id: k-VACXj49n_znzc0EJ1Jf
title: "新しいビルドツールの Farm"
slug: "new-build-tool-farm"
about: "Farm は Rust 製の新しいビルドツールです。パフォーマンスを重視して設計されており、Vite と互換性のある JavaScript プラグインをサポートしているという特徴があります。バンドルの戦略には Partial Bundling というものを採用しており、モジュールのネットワークリクエスト数を削減するため、20 ~ 30 のファイルにバンドルするという特徴があります。"
createdAt: "2024-07-21T15:44+09:00"
updatedAt: "2024-07-21T15:44+09:00"
tags: ["Farm"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4DfgoHVxTQuVVAtFg03zu/004b498010998fb16d10c8ab4c7dff02/anmitsu_illust_3649.png"
  title: "あんみつのイラスト"
selfAssessment:
  quizzes:
    - question: "Farm のプラグインとしてサポートされていない言語はどれか？"
      answers:
        - text: "Rust"
          correct: false
          explanation: "Farm は Rust 製のビルドツールであり、Rust のプラグインをサポートしています。"
        - text: "JavaScript"
          correct: false
          explanation: "Farm 互換性のために JavaScript プラグインをサポートしています。"
        - text: "Go"
          correct: true
          explanation: null
published: true
---
Farm は Rust 製の新しいビルドツールです。パフォーマンスを重視して設計されており、Vite と互換性のある JavaScript プラグインをサポートしているという特徴があります。

https://www.farmfe.org/

## Farm の特徴

ビルドのパフォーマンスはアプリケーションの開発体験に大きな影響を与えます。従来は Webpack がビルドツールとしてデファクトスタンダードでしたが、アプリケーションの規模が大きくなりモジュールの数が増えるにつれ、ビルド時間が長くなるという問題がありました。ときには Hot Module Replacement（HMR）が反映されるまで数秒かかることもありました。

このようなビルドのパフォーマンス問題を解決するために、Vite のような新しいビルドツールが登場しました。Vite は開発モードの場合 esbuild でビルドを行い、ブラウザの Native ES Modules を使用していることが特徴です。ファイルが変更された場合にすべてのモジュールを再ビルドするのではなく、変更されたモジュールだけを再ビルドすることで高速な HMR を実現しています。

一方でネイティブ ES Modules の使用はネットワークのラウンドトリップ数が増加するため最適化されたローディングパフォーマンスを得ることができません。そのため Vite ではプロダクションビルド時には　ES Modules を使用せずに Rollup を使用してバンドルを行っています。このことはこのことは開発時とプロダクション時で一貫性のないビルドプロセスを持ち、本番の時のみ発生する問題を発生させる可能性があります。

Farm 従来のビルドツールよりもより早く、一貫性のある方法でビルドを行うことを目指して作られました。Farm は高速化のために可能な限り Rust で書かれており、かつ既存のツールと互換性を持つことが特徴です。

## Farm で使ってみる

それでは Farm を実際に使ってみましょう。以下のコマンドを実行してプロジェクトを作成します。

```sh
npm create farm@latest
```

対話形式でプロジェクトのテンプレートを設定できます。ここでは `react` を選択しました。

```sh
$ npm create farm@latest

 ⚡ Welcome To Farm !

✔ Project name · farm-project
? Select a framework: ›
  Vanilla
❯ React  (https://react.dev/)
  Vue3
  Vue2
  Svelte
  Solid
  Lit
  Preact
  NestJS
  Tauri
  Electron
```

代わりにコマンドラインオプションを使用してプロジェクト名とテンプレートを指定することもできます。

```sh
npm create farm@latest farm-project --template react
```

プロジェクトのディレクトリに移動し、依存関係をインストールして開発サーバーを起動します。

```sh
cd farm-project
npm install
npm run dev
```

http://localhost:9000 にアクセスすると以下のような画面が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Rs1Jw7nFujphdtD9JsgFo/0c1b9cbbe4a360e01a19b28c942163d4/__________2024-07-21_16.30.09.png)

ビルドの設定は `farm.config.ts` で行うことができます。以下はデフォルトの設定です。

```js
import { defineConfig } from "@farmfe/core";

export default defineConfig({
  plugins: ["@farmfe/plugin-react"],
});
```

設定可能な項目については [Configuring Farm | Farm](https://www.farmfe.org/docs/config/configuring-farm) を参照してください。

本番向けのビルドを行うには以下のコマンドを実行します。

```sh
npm run build
```

## Farm のプラグイン

Farm は以下の 4 種類のプラグインをサポートしています。

- Farm Compilation Plugins：ビルド時にコードを変換するプラグイン。Rust で書かれたプラグインと Rollup と互換性のある JavaScript プラグインをサポートしている
- Vite/Rollup/Unplugin Plugin：Vite や Rollup で使用できるプラグインはそのまま Farm でも使用できる
- Farm Runtime Plugin：Farm のランタイムに影響を与えるプラグイン
- Swc Plugins：Swc で使用できるプラグイン

Farm Compilation Plugins は Rust または JavaScript で書かれたプラグインを使用できます。Rust のプラグインはより高速に動作するため推奨されています。JavaScript のプラグインは従来のエコシステムと互換性を持たせたい場合に使用します。

プラグインを使用するに、必要なパッケージをインストールします。Farm の公式で提供されているプラグインの一覧は [Using Plugins | Farm](https://www.farmfe.org/docs/using-plugins) から確認できます。

```sh
npm install -D @farmfe/plugin-sass @farmfe/js-plugin-postcss
```

プロジェクトのディレクトリに `farm.config.ts` を作成し、`plugins` プロパティの配列にプラグインを追加します。

```js:farm.config.ts
import farmPostcssPlugin from "@farmfe/js-plugin-postcss";

export default defineConfig({
  // ...
  plugins: [
    // rust のプラグインはパッケージ名を指定する
    "@farmfe/plugin-sass",
    // JavaScript のプラグイン関数を呼び出して、オブジェクトとして渡す
    farmPostcssPlugin(),
  ],
});
```

Vite や Rollup 形式のプラグインもそのまま Farm で使用できます。これらのプラグインは `farm.config.ts` の `vitPlugins` プロパティに追加します。

```js:farm.config.ts
import vue from '@vitejs/plugin-vue',
import vueJsx from '@vitejs/plugin-vue-jsx';

export default defineConfig({
  vitePlugins: [
    vue(),
    vueJsx()
  ]
});
```

Vite のプラグインのパフォーマンスを改善するために `filter` プロパティを返す関数形式で指定することもできます。この場合、`filter` でマッチしたファイル以外のモジュールではスキップされます。

```js:farm.config.ts
import vue from '@vitejs/plugin-vue',

function configureVitePluginVue() {
  return {
    vitePlugin: vue(),
    filters: ['\\.vue$', '\\\\0.+']
  };
}

export default defineConfig({
  vitePlugins: [
    configureVitePluginVue
  ]
});
```

## Partial Bundling

Farm ではモジュールをバンドルする際に Partial Bundling という戦略を採用しています。

従来の Webpack のようなバンドラではモジュールの分割のために [splitChunks](https://webpack.js.org/plugins/split-chunks-plugin/) のような optimization オプションを使用していました。これはすべてをバンドルしてから最適化のためのファイルを分割するというアプローチです。この方法は設定を調整する必要があり、最適な設定を見つけるのが難しいという問題がありました。

もう 1 つのアプローチとして native ES modules を使用する方法があります。設定の複雑さの問題を解決しつつ、すべてのモジュールを個別にコンパイルしてキャッシュできるという利点があります。その一方で、モジュールの数が数百ある場合ネットワークリクエストが増大するため実行時のパフォーマンスが低下するという問題があります。

Partial Bundling はこれらの問題を解決するために生まれました。Partial Bundling ではすべてのモジュールを 20 ~ 30 のファイルになるようにバンドルし、リクエストが増大することを防いでいます。またモジュール数が少なくなることでキャッシュヒット率が向上するという利点もあります。

Farm は常にバンドルするのではなく、同時モジュール要求または要求階層が Farm のしきい値を超えた場合にのみ、Farm は必要な場合にのみ部分的なバンドルを実行します。

Farm によるバンドルは以下のルールに従って実行されます。

- 可変モジュールと不変モジュールは常に異なるファイルに出力される：デフォルトでは `node_modules` 以下のモジュールは不変モジュールとして扱われる。`react` や `react-dom` などのライブラリと `main.tsx` といったアプリケーションコードが同じファイルに出力されることはない
- 異なるタイプのモジュールは異なるファイルに出力される：`index.css` と `index.tsx` は異なるファイルに出力される
- 同じパッケージのモジュールは同じファイルに出力される
- リソースの読み込みのターゲット同時リクエスト数は、デフォルトで 20 ~ 30 の間である必要がある
- 出力ファイルは同程度のサイズになるように分割され、デフォルトでは少なくとも 20KB 以上のサイズになるように分割される

Partial Bundling は複雑な設定をせずとも最適なバンドルが行われるように調整されますが、ユーザーにより動作をカスタマイズできるように多くのオプションをサポートしています。すべてのオプションは以下のリンクを参照してください。

https://www.farmfe.org/docs/advanced/partial-bundling#partial-bundling-options

## 環境変数

Farm では `dotenv` を使用しているため、`.env` ファイルを作成して環境変数を設定できます。デフォルトではプロジェクトルートの `.env` ファイルが読み込まれますが、`farm.config.ts` の `envDir` プロパティでカスタマイズ可能です。

意図しない環境変数が誤ってクライアントに公開されるのを防ぐために、`FARM_` もしくは `VITE_` で始まる環境変数のみが読み込まれます。

```sh:.env
FARM_APP_TITLE=Farm App
# vite との互換性を持つために VITE_ で始まる環境変数も読み込まれる
VITE_CLIENT_ID=1234567890
# これは読み込まれない
APP_SECRET=secret
```

環境変数は `process.env` もしくは `import.meta.env` からアクセスできます。

```js
console.log(process.env.FARM_APP_TITLE); // Farm App
console.log(import.meta.env.VITE_CLIENT_ID); // 1234567890
```

## まとめ

- Farm は Rust 製の新しいビルドツールで、高速なビルドを実現している
- 既存のツールと互換性があり、Vite Plugin をサポートしている
- Farm のプラグインは Rust または JavaScript で書かれたプラグインを使用できる。パフォーマンスを重視するために Rust を使用することが推奨されている。従来のエコシステムと互換性を持たせたい場合には JavaScript を使用する
- Partial Bundling というバンドル戦略を採用している。Partial Bundling はモジュールのネットワークリクエスト数を削減するため、20 ~ 30 のファイルにバンドルする

## 参考

- [Farm](https://www.farmfe.org/)
- [rfcs/rfcs/003-partial-bundling/rfc.md at main · farm-fe/rfcs](https://github.com/farm-fe/rfcs/blob/main/rfcs/003-partial-bundling/rfc.md)
- [Vite を使う理由 | Vite](https://ja.vitejs.dev/guide/why)
