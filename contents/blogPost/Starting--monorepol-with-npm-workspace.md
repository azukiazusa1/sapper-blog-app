---
id: 6n06Hq4mrLydu5FE8lDAKw
title: "npm workspace で始めるモノレポ生活"
slug: "Starting--monorepol-with-npm-workspace"
about: "workspace は複数のパッケージ（`package.json`）をレポジトリを管理するために使用されます。このようなレポジトリは**モノレポ**として知られています。"
createdAt: "2022-04-10T00:00+09:00"
updatedAt: "2022-04-10T00:00+09:00"
tags: ["JavaScript", "npm"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5aBvLSXirDOkziSXDURioE/e547110fe258417a05556347c142e813/npm.png"
  title: "npm"
audio: null
selfAssessment: null
published: true
---
workspace とは npmv7 から追加された機能で、 [yarn](https://classic.yarnpkg.com/lang/en/docs/workspaces/) や [pnpm](https://pnpm.io/workspaces) の workspace を追従した機能です。

workspace は複数のパッケージ（`package.json`）をレポジトリを管理するために使用されます。このようなレポジトリは**モノレポ**として知られています。例えば以下のようにバックエンドとフロントエンドのプロジェクトをただ一つのレポジトリで管理するようにします。

```sh
.
├── backend
│   ├── src
│   │   ├── server.ts
│   │   └── ...
│   ├── package.json
│   └── package-lock.json
└── frontend
    ├── src
    │   ├── main.ts
    │   ├── components
    │   └── ...
    ├── package.json
    └── package-lock.json
```

モノレポの戦略を選択した場合すべてのチームが同じレポジトリを共有することになります。一般にモノレポを選択する理由として以下のようなメリットがあげられます。

- コードの再利用
- チーム間のコラボレーションが容易になる
- コードの結合性
- コードの全体を把握しやすい
- 大規模なリファクタリングがやりやすい
- リリースを管理しやすい

もちろんモノレポを選択した場合にもたらされるのはメリットだけではなく、いくつかのデメリットと複雑性も生じます。例えば以下のような例です。

- 各プロジェクトのパッケージの依存関係の管理
- CI のジョブの複雑化

npm workspace は 1 つ目の「各プロジェクトのパッケージの依存関係の管理」を解決するために用いられます。npm workspace は複数のプロジェクトのパッケージをトップレベルの `package-json` で管理できます。また似た機能を提供するツールに [Lerna](https://github.com/lerna/lerna) が存在します。

例えば、バックエンドとフロントエンドのプロジェクトどちらも `Jest` パッケージを使用しているという例を考えてます。

## npm workspace を始める

それでは実際に npm workspace を始めてみましょう。npm workspace を利用するには npm のバージョン 7 以降が必要です。

```sh
$ npm install -g npm@latest
$ npm -v
8.6.0
```

### ルートパッケージを作成する

まずはプロジェクトのトップレベルで npm プロジェクトを作成します。

```sh
$ npm init -y
```

このパッケージは公開することはないので `private` フィールドを `true` にしておくとよいです。

```diff
  {
+   "private": true
  }
```

### ワークスペースを作成する

ルートパッケージ上で `npm init` コマンドに `-w` オプションを付与することでワークスペースを作成できます。`-w` オプションの引数にディレクトリ名を指定します。

```sh
$ npm init -w backend
```

上記コマンドを実行すると `backend` ディレクトリが作成されその中に `package.json` ファイルが作成されます。さらにルートパッケージの `package.json` ファイルには `workspace` フィールドが追加されます。

```diff
  {
 +  "workspaces": [
 +    "backend"
 +  ]
  }
```

続いてフロントエンドのパッケージも追加しておきましょう。

```sh
$ npm init -w frontend
```

現在のレポジトリの構成は以下のようになっています。

```sh
.
├── package.json
├── frontend
│   └── package.json
└── backend
    └── package.json
```

### パッケージをインストールする

`npm install` コマンドでパッケージをインストールする際に `-ws` オプションを付与することですべてのワークスペースに対して単一のパッケージをインストールできます。

```sh
$ npm install lodash -ws
```

この時、レポジトリの構造は以下のようになります。

```sh
.
├── backend
│   ├── package.json
├── frontend
│   └── package.json
├── node_modules
│   ├── backend -> ../backend  
│   ├── frontend -> ../frontend
│   └── lodash
├── package-lock.json
└── package.json
```

ルートパッケージの `node_modules` に `lodash` が配置されるので npm のホイスティング（巻き上げ）により、よりそれぞれのワークスペースで `lodash` をインストールせずとも使用できます。

```js
// frontend/index.js
const lodash = require("lodash");

const chunked = lodash.chunk(["a", "b", "c", "d"], 2);

console.log(chunked);
```

```sh
$ node frontend/index.js 
[ [ 'a', 'b' ], [ 'c', 'd' ] ]
```

特定のワークスペースのみにパッケージをインストールしたい場合には `-w` オプションで対象のワークスペースを指定してインストールコマンドを実行します。

```sh
$ npm i dayjs -w backend
```

フロントエンド、バックエンドのそれぞれの `dependencies` は次のようになっています。

```json
// frontend/package.json
{
  "name": "frontend",
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

```json
// frontend/package.json
{
  "name": "backend",
  "dependencies": {
    "dayjs": "^1.11.0",
    "lodash": "^4.17.21"
  }
}
```

### npm スクリプトの実行

npm スクリプトを実行する場合にもパッケージをインストールする場合と同様にワークスペースを指定できます。例えば次のコマンドはすべてのワークスペースをテストを実行します。

```sh
$ npm run test -ws
```

以下のコマンドはフロントエンドのテストのみを実行します。

```sh
$ npm run test -w frontend
```

また `-ws` オプションですべてのワークスペースの npm スクリプトを実行する際にワークスペースを特定のワークスペースのみに対象の npm スクリプトが定義されていないかもしれません。例えば `serve` コマンドはバックエンドプロジェクトには定義されていますがフロントエンドのプロジェクトには定義されていない例を考えてます。

```json
// backend/package.json
{
  "name": "backend",
  "scripts": {
    "test": "jest",
    "serve": "node index.js"
  },
}
```

```json
// frontend/package.json
{
  "name": "fronend",
  "scripts": {
    "test": "jest"
  },
}
```

このような状態でスクリプトを実行するとエラーが発生してしまいます。

```sh
$ npm run serve -ws 

> backend@1.0.0 serve
> node index.js

server
npm ERR! Lifecycle script `serve` failed with error: 
npm ERR! Error: Missing script: "serve"

To see a list of scripts, run:
  npm run 
npm ERR!   in workspace: frontend@1.0.0 
npm ERR!   at location: /npm-workspace/frontend 
```

このような場合には `--if-present` オプションを付与して実行すると npm スクリプトが定義されているワークスペースのみが実行されます。

```sh
$ npm run serve -ws --if-present

> backend@1.0.0 serve
> node index.js

server
```

さらにすべてのワークスペースの npm スクリプトを実行するとき実行順序はルートパッケージの `workspaces` フィールドの順番に依存されます。例えば `workspaces` の順場が `backend` → `frontend` となっている場合。

```json
{
  "workspaces": [
    "backend",
    "frontend"
  ]
}
```

実行結果は以下のようになります。

```sh
$ npm run test -ws

> backend@1.0.0 test
> echo I am backend

I am backend

> frontend@1.0.0 test
> echo I am frontend

I am frontend
```

次にルートパッケージの `workspaces` の順序を入れ替えて実行しています。

```json
{
  "workspaces": [
    "frontend",
    "backend"
  ]
}

```sh
$ npm run test -ws

> backend@1.0.0 test
> echo I am backend

I am backend

> frontend@1.0.0 test
> echo I am frontend

I am frontend
```

今度は `frontend` → `backend` の順番で実行されます。

```sh
$ npm run test -ws

> frontend@1.0.0 test
> echo I am frontend

I am frontend

> backend@1.0.0 test
> echo I am backend

I am backend
```

### ワークスペース間でコードを共有する

npm workspaces でワークスペースを管理している場合それぞれのワークスペース同士でパッケージを参照できます。例えば、次のようにバックエンドで作成したコードをフロントエンドから参照できます。

```js
// backend/utils.js
const add = (a, b) => a + b;

module.exports = {
  add,
};
```

```js
const utils = require("backend/utils");

const result = utils.add(1, 2);

console.log(result);
```

```sh
$ node frontend/index.js
3
```

