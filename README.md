# azukiazusa's blog

https://azukiazusa.dev

[Storybook](https://azukiazusa1.github.io/sapper-blog-app/)

## プロジェクトの構成

このプロジェクトは [Turborepo](https://turborepo.org/) + [npm workspaces](https://docs.npmjs.com/cli/v9/using-npm/workspaces/) によるモノレポ構成となっています。

|                          | 概要                                         |
| ------------------------ | -------------------------------------------- |
| `app`                    | メインアプリケーション                                             |
| `contents`               | ブログの記事データ |
| `packages`               |                                              |
| ├ `content-management`               | Contentful のデータとレポジトリの記事データを同期するスクリプト |
| ├ `content-preview` | ローカルで編集したマークダウンファイルをプレビューするアプリ |
| ├ `rehype-alert`| マークダウンのアラート記法を変換する rehype のプラグイン |
| ├ `remark-link-card`| マークダウンをリンクカードに変換する remark のプラグイン |
| ├ `remark-contentful-image` | contentful の画像を最適化する remark のプラグイン |
| ├ `eslint-config-custom` | `packages` 共通の `eslint` の設定ファイル                      |
| └ `tsconfig`             | `packages` 共通の `tsconfig.json`                              |

## Setup

```sh
$ git clone git@github.com:azukiazusa1/sapper-blog-app.git
$ cd sapper-blog-app
$ npm i
$ npm run dev
```

## Build

```sh
$ npm run build
```

### lint & typecheck

```sh
$ npn run lint
$ npm run typecheck
```

### test

```sh
$ npm run test
```

### e2e

```sh
$ npm run test:e2e -w=app
```
