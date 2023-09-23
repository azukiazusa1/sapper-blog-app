---
id: 5L4Qa7mLgBdHz-hd3mDWW
title: "Bun workspace で始めるモノレポ生活"
slug: "bun-workspace"
about: "Bun では `package.json` の `workspaces` を使用することでモノレポの管理が可能です。この記事では Bun によるモノレポを試してみます。"
createdAt: "2023-09-15T20:53+09:00"
updatedAt: "2023-09-15T20:53+09:00"
tags: ["Bun", "モノレポ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6vupdPg1DUC2o3Be9Agbif/cd7129fe3ea1b6c359cf6227f160db5f/food_chuuka-man_9600-768x630.png"
  title: "中華まんのイラスト"
published: true
---

Bun はパッケージマネージャーとしても利用できるので、npm の `workspaces` によるモノレポ管理も可能です。モノレポとは、複数のパッケージを 1 つのリポジトリで管理することです。モノレポを利用することで、同レポジトリ内のパッケージを互いに参照したり、`node_modules` をシェアしてディスク容量を節約するといったメリットがあります。

この記事では、Bun workspace を利用してモノレポを管理する方法を紹介します。

## Bun workspace の使い方

workspace ではディレクトリのルートレベルに、各パッケージを管理するためのルートパッケージが必要です。ルートパッケージは通常 `dependencies` または `devDependencies` のフィールドを含みません。`workspaces` フィールドには、ワークスペースとして管理するパッケージのパスを配列で指定します。`*` を指定することで、特定のディレクトリにある全てのディレクトリをワークスペースとして管理できます。以下の例では、`packages` ディレクトリにある全てのディレクトリをワークスペースとして管理しています。

また、ルートパッケージは誤って npm に publish しないために、`private` フィールドを `true` に設定することが推奨されています。

```json:package.json
{
  "name": "sample-workspace",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

ルートパッケージの作成が完了したので、`packages` ディレクトリ配下にパッケージを作成していきましょう。以下の 3 つのパッケージを作成します。

- `packages/app`
- `packages/lib`
- `packages/ui`

ディレクトリの構成は以下のようになります。

```sh
.
├── packages
│   ├── app
|   |   └── package.json
│   ├── lib
|   |   └── package.json
│   └── ui
|       └── package.json
├── package.json
├──  bun.lockb
└──  node_modules
```

`packages/lib` パッケージにのみ特定のライブラリをインストールしてみましょう。その場合、該当のディレクトリに移動してから `bun add` コマンドを実行します。

```sh
cd packages/lib
bun add dayjs
```

`bun add` コマンドを実行した後、`packages/lib/package.json` に `dayjs` が追加されます。さらにルートディレクトリに `bun.lockb` ファイルが作成されます。

```json:packages/lib/package.json
{
  "name": "lib",
  "version": "0.0.0",
  "dependencies": {
    "dayjs": "^1.11.9"
  }
}
```

`packages/lib` パッケージで他のパッケージから参照される関数を定義してみましょう。`packages/lib` パッケージの `src/index.ts` に以下のコードを追加します。

```ts:packages/lib/src/index.ts
import dayjs from "dayjs";

export const format = (date: Date) => dayjs(date).format("YYYY-MM-DD");
```

`bun build` コマンドを実行して、`packages/lib` パッケージをビルドします。

```sh
bun build ./index.ts --outdir=dist/index.js
```

`packages/lib/dist/index.js` が作成されます。`packages/lib` の `package.json` の `main` フィールドを `dist/index.js` に変更します。`main` フィールドでは、パッケージのエントリーポイントを指定します。

```json:packages/lib/package.json
{
  "name": "lib",
  "version": "0.0.0",
  "main": "dist/index.js",
  "dependencies": {
    "dayjs": "^1.11.9"
  }
}
```

`packages/app` パッケージから `packages/lib` パッケージを参照してみましょう。同じレポジトリの別のパッケージを参照するためには、パッケージの利用者の `package.json` の `dependencies` または `devDependencies` フィールドに、参照するパッケージ名を直接指定します。同レポジトリ内のパッケージであることを示すため、バージョンフィールドには、`"workspace:*"` を指定する必要があります。

`packages/app/package.json` を以下のように変更します。

```json:packages/app/package.json
{
  "name": "app",
  "version": "0.0.0",
  "dependencies": {
    "lib": "workspace:*"
  }
}
```

その後、ルートディレクトリで `bun install` コマンドを実行します。

```sh
bun install
```

`packages/app` から実際に `lib` パッケージを使ってみましょう。`packages/app` パッケージの `src/index.ts` に以下のコードを追加します。

```ts:packages/app/src/index.ts
import { format } from "lib";

const date = new Date();

console.log(format(date));
```

以下のコマンドでコードを実行します。

```sh
cd packages/app
bun run src/index.tsx
```

現在の時刻がフォーマットされて出力されれば成功です。

```sh
2023-09-15
```

## まとめ

- Bun workspace では、`workspaces` フィールドによって、ワークスペースとして管理するパッケージのパスを指定します。
- 個別のパッケージで `bun add` コマンドを実行して依存ライブラリをインストールする
- 同じレポジトリ内のパッケージを参照するためには、パッケージ名を直接指定して、バージョンフィールドには、`"workspace:*"` を指定する
