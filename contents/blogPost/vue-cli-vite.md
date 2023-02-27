---
id: 29y31RSKGdMHfpIUuKXswj
title: "Vue CLIで作成したプロジェクトをViteに置き換える"
slug: "vue-cli-vite"
about: "Viteは、一言でいうとフロントエンドのめっちゃ早いビルドツールです。Vue CLIで作成したプロジェクトをViteに置き換えるためにvue-cli-plugin-viteをというプラグインを使います。"
createdAt: "2021-05-16T00:00+09:00"
updatedAt: "2021-05-16T00:00+09:00"
tags: ["Vue.js"]
published: true
---
# Viteとは

Vite は、一言でいうとフロントエンドのめっちゃ早いビルドツールです。
v2.x では以下のテンプレートに対応しています。

- vanilla
- vue
- vue-ts
- react
- react-ts
- preact
- preact-ts
- lit-element
- lit-element-ts
- svelte
- svelte-ts

# Vue CLIで作成したプロジェクトをViteに置き換える

## vue-cli-plugin-viteをインストール

Vue CLI で作成したプロジェクトを Vite に置き換えるために vue-cli-plugin-vite をというプラグインを使います。

https://www.npmjs.com/package/vue-cli-plugin-vite

これは開発ビルドのみに Vite によるビルドを適用するパッケージであり、コードベースへの変更なしに適用できることを謳っています。

以下のコマンドを実施します。

```sh
$ vue add vite
 WARN  There are uncommitted changes in the current repository, it's recommended to commit or stash them first.
? Still proceed? (y/N) 
```

まだコミットされたいない変更がある場合、先にコミットかスタッシュすることを推奨されます。
コミットされていない変更はないので `y` を入力します。

インストールが完了すると、`bin/vite` というファイルが生成され、`package.json` に `vite` コマンドが追加されます。

```diff
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
+    "vite": "node ./bin/vite"
  },
```

`npm run vite` コマンドで開発サーバーを起動できます。

## Vue CLIとの比較

正確に計測はできてないですが、おおむね以下のとおりでした。

|  | Vue CLI | Vite |
|:---|:---:|---:|
| 初回起動 | 約15秒 | 約3秒 |
| HMR | 約3秒 | 1秒未満 |

## 修正が必要だったところ

コードベースの変更ゼロを謳ってるとはいえ、いくつか修正が必要な箇所が存在したので上げていきます。

### コンポーネントをimportする際に拡張子を省略しない

以下のような `import` の書き方をしているとファイルを読み込むことができずエラーとなりました。

```diff
- import AppButton from '@/components/AppButton
+ import AppButton from '@/components/AppButton.vue
```

TypeScript で SFC を記述している場合には大丈夫かと思われますが、注意が必要です。

### requireは使えない

`require('xxx')` の構文は使うことができないので、該当の箇所は `import` 文に置き換える必要があります。

```diff
- require('vue-flash-message/dist/vue-flash-message.min.css')
+ import 'vue-flash-message/dist/vue-flash-message.min.css'
```

