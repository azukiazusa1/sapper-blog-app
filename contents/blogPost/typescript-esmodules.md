---
id: 45qK9o9TALslQf3v0xiCt9
title: "TypeScript + ESModules の開発環境をシュッと作る"
slug: "typescript-esmodules"
about: "ほぼ設定なしで TypeScript + ESModules の開発環境をシュッと作る時のレシピです。"
createdAt: "2023-02-19T00:00+09:00"
updatedAt: "2023-02-19T00:00+09:00"
tags: ["TypeScript", "Vitest"]
published: true
---
## プロジェクトの作成

はじめに以下のコマンドで `package.json` を作成します。

```sh
npm init -y
```

ESModules として扱いたいので `package.json` に `"type": "module"` を追加します。

```diff:package.json
  {
    "name": "ts-esmodules",
    "version": "1.0.0",
    "description": "",
+   "type": "module",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
```

## TypeScript のインストール

以下のコマンドで TypeScript とその他必要なパッケージをインストールします。

```sh
npm i -D typescript @tsconfig/node-lts-strictest-esm ts-node
```

`@tsconfig/node-lts-strictest-esm` は [TSConfig bases](https://github.com/tsconfig/bases) から提供されているパッケージの 1 つです。TSConifg bases はフレームワークごとに最適な設定の TSConfig を公開しているレポジトリです。それぞれの TSConfig は npm パッケージとして提供されています。今回使用している `@tsconfig/node-lts-strictest-esm` は Node LTS + ESM かつ厳格な設定となっています。

TSConfig bases は `tsconfig.json` を作成して `extends` にパッケージを記述するだけで設定を適用できます。

```json:tsconfig.json
{
  "extends": "@tsconfig/node-lts-strictest-esm"
}
```

TypeScript をそのまま実行するために [ts-node](https://typestrong.org/ts-node/) を使います。`ts-node` を ESModules で実行するためには `esm` オプションが必要です。`tsconfig.json` の `"ts-node"` オプションに `"esm": true` を追加します。

```diff:tsconfig.json
  {
    "extends": "@tsconfig/node-lts-strictest-esm",
+   "ts-node": {
+     "esm": true
+   }
  }
```

コードの実行は早いほうが好きなのでトランスパイラに [SWC](https://swc.rs/) を使用します。`ts-node` は組み込みのオプションで SWC をサポートしています。SWC を使用するためには以下のパッケージをインストールします。

```sh
npm i -D @swc/core @swc/helpers regenerator-runtime
```

その後、`tsconfig.json` の `"ts-node"` オプションに `"swc": true` を追加します。

```diff:tsconfig.json
  {
    "extends": "@tsconfig/node-lts-strictest-esm",
    "ts-node": {
+     "swc": true,
      "esm": true
    }
  }
```

ここまでで TypeScript を実行する環境が整いました。簡単なコードで試してみましょう。

```ts:src/calc.ts
export const add = (a: number, b: number) => a + b;
```

```ts:src/main.ts
import { add } from "./calc.js";

console.log(add(1, 2));
```

ESModules の場合モジュールの `import` ときに拡張子が必須となっているので注意が必要です。`.ts` ファイルであったとしても必ず `.js` として記載する必要があります。このあたりの問題は TypeScript 5.0 の [--moduleResolution bundler](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0-beta/#moduleresolution-bundler) で改善される見込みです。

`package.json` に TypeScript を実行するコマンドを追加しましょう。

```json:package.json
{
  "scripts": {
    "start": "ts-node src/main.ts"
  },
}
```

これで問題なく実行できるはずです。

```sh
npm start

> ts-esmodules@1.0.0 start
> ts-node src/main.ts

3
```

トランスパイラに SWC を指定しているため、実行時に型チェックを行いません。手癖として `typecheck` スクリプトを追加しておくのがよいでしょう。

```json:package.json
{
  "scripts": {
    "start": "ts-node src/main.ts",
    "typecheck": "tsc --noEmit",
  }
}
```

## リンター・フォーマッター

綺麗なコードが好きなのでリンターとフォーマッターも導入します。以下のコマンドで対話的に [ESLint](https://eslint.org/) を導入できます。

```sh
npm init @eslint/config
```

```sh
? How would you like to use ESLint? … 
  To check syntax only
❯ To check syntax and find problems
  To check syntax, find problems, and enforce code style
? What type of modules does your project use? … 
❯ JavaScript modules (import/export)
  CommonJS (require/exports)
  None of these
? Which framework does your project use? … 
  React
  Vue.js
❯ None of these
? Does your project use TypeScript? › Yes
? Where does your code run? …  (Press <space> to select, <a> to toggle all, <i> to invert selection)
  Browser
✔ Node
? What format do you want your config file to be in? … 
❯ JavaScript
  YAML
  JSON
@typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint@latest
? Would you like to install them now? › Yes
? Which package manager do you want to use? … 
❯ npm
  yarn
  pnpm
```

コマンドの実行が完了すると `eslintrc.cjs` ファイルが作成されます。おすすめの設定が入っているので、設定を変更せずともこのまま使い始めることができます。

```js:eslintrc.js
module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
    }
}
```

続いて [Prettier](https://prettier.io/) を導入します。ESLint と組み合わせ使う場合にはルールの競合を防ぐため `eslint-config-prettier` パッケージも必要です。

```sh
npm i -D prettier eslint-config-prettier
```

デフォルトの設定で Prettier の設定ファイルである `.prettierrc` を作成します。

```sh
echo {}> .prettierrc
```

`eslintrc.cjs` の `extends` に `prettier` を追記します。`extends` は最後のルールが優先されるので必ず `prettier` を一番最後にする必要があります。

```diff:eslintrc.js
  module.exports = {
    env: {
      es2021: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
+     "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {},
  };
```

リントとフォーマットを実行するスクリプトを追加します。それぞれ単にコードスタイルをチェックするだけのスクリプトと、修正まで行うスクリプトどちらも用意しておくと便利です。

```json:package.json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
  },
}
```

## テスト

テスト用のライブラリとして [Vitest](https://vitest.dev/) を使用します。Jest と互換性のある構文を持ちながら、ゼロコンフィグで始めることができます。

```sh 
npm i -D vitest
```

簡単なテストコードを書いてみましょう。

```ts
import { add } from "./calc.js";
import { describe, it, expect } from "vitest";

describe("add", () => {
  it("should add two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

`package.json` にテストスクリプトを追加します。

```json:package.json
{
  "scripts": {
    "test": "vitest"
  },
}
```

設定なしですぐに実行できます。

```sh
npm test
```

## VSCode

プロジェクトのルートディレクトリに `.vscode` ディレクトリを設定しておくと、拡張機能や設定ファイルを共有できるので便利です。`.vscode/extensions.json` ではプロジェクトでおすすめの拡張機能を記述できます。

VSCode の拡張子の画面から歯車アイコン → Add to Workspace Recommendations で簡単に拡張子を設定に追加できます。

![VSCode の Vitest 拡張子のページ。歯車アイコンを押した後のポップアップメニューが表示されている。ポップアップメニューの中に「Add to Workspace Recommendations」がある](//images.ctfassets.net/in6v9lxmm5c8/6mFXPoAQLwDxEZM5i1gNuB/0e786d68409ec44060c311ef71598813/____________________________2023-02-19_10.50.34.png)

おすすめの拡張子として ESLint,Prettier,Vitest の 3 つを追加しておきました。

```json:.vscode/extensions.json
{
  "recommendations": [
    "zixuanchen.vitest-explorer",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

`.vscode/settings.json` ではプロジェクトで適用される設定を記述します。この設定は個人の設定よりも優先されます。ここでは、デフォルトのフォーマットとして Prettier を使用する設定と、Vitest の拡張子を有効にする設定を入れました。

```json:.vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "vitest.enable": true
}
```

