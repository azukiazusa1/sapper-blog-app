---
title: "Vue 向けの Vite 製の UI コンポーネントカタログツール Histoire"
about: "Histoireはフランス語で「Story」という意味の単語であり、Storybook のように UI コンポーネントのカタログを作成するツールです。Vite にネイティブ対応、Vue の SFC 形式で Story を書けるといった特徴があります。"
createdAt: "2022-06-05T00:00+09:00"
updatedAt: "2022-06-05T00:00+09:00"
tags: ["Vue.js", "Histoire"]
published: true
---
[Histoire](https://histoire.dev/) はフランス語で「Story」という意味の単語であり、[Storybook](https://storybook.js.org/) のように UI コンポーネントのカタログを作成するツールです。

Histoire は以下のような特徴を謳っています。

- Vite にネイティブ対応
  - Histoire は Vite 向けのツールであるので、`vite.config.ts` の設定を再利用することができます。このあたりの特徴は [Vitest](https://vitest.dev/) と同様ですね
- Story をフレームワークそのままの書き方で作成できる
  - Storybook の場合 Vue でコンポーネントを作成していたとしても Story を作成する場合には `.stories.ts` のような拡張子でファイルを作成して Storybook 向けのコンポーネントの記述をする必要があります。一方 Histoire は Story を作成する際にも `.vue` や `.svelte` のような拡張子を使用することができ、フレームワークの特徴に合わせた書き方ができます。
- 早くて軽い
  - やはり Vite を使っているだけあってビルド速度は高速なようです
- 拡張性が高い
- すばらしい UX

## Histoire をはじめる

それでは早速 Histoire をはじめてみましょう。Histoire は現在（2022/06/04）以下のフレームワークに対応しています。

> 
| Framework | Versions | Support | Auto CodeGen | Auto Docs |
| --------- | -------- | ------- | ------------ | ---- |
| [Vue](https://vuejs.org/) | 3.2+ | ✅ | ✅ | Todo |
| [Svelte](https://svelte.dev/) | - | Planned | - | - |
| [Solid](https://www.solidjs.com/) | - | Planned | - | - |
| [Angular](https://angular.io/) | - | TBD | - | - |
| [React](https://reactjs.org/) | - | [Alternative](https://www.ladle.dev) | - | - |

https://github.com/histoire-dev/histoire#supported-frameworks

React の代替として [Ladle](https://www.ladle.dev) があげられています。Ladle もまた Vite ベースなので Histoire が Vue 向け、Ladle が React 向けという立ち位置のように感じます。

### インストール

以下コマンドで Histoire をインストールします。

```sh
$ npm i -D histoire
```

続いて `package.json` に scripts を追加します。

```json
{
  "scripts": {
    "story:dev": "histoire dev",
    "story:build": "histoire build",
    "story:preview": "histoire preview"
  }
}
```

プロジェクトで TypeScript を使用している場合、`env.d.ts` を作成して以下を記述します。

```ts
/// <reference types="histoire" />
```

### グローバル CSS を設定する

グローバルに読み込む CSS がある場合 Histoire の設定ファイルを作成する必要があります。設定ファイルは `vite.config.ts` の `histoire` プロパティとして記載するか、`histoire.config.ts` ファイルを新たに作成して設定を記載する2通りの方法があります。ここでは後者の方法を使用します。

```ts
// histoire.config.ts
import { defineConfig } from 'histoire'

export default defineConfig({
  setupFile: '/src/histoire.setup.ts'
})
```

[setupFile](https://histoire.dev/reference/config.html#setupfile) オプションは各ストーリープレビューの設定時にデフォルトで実行されるセットアップファイルを指定します。`src/histoire.setup.ts` ファイルを作成してそこで CSS を読み込みます。

```ts
// src/histoire.setup.ts
import './index.css
```

### Story を作成する

それでは実際に Story を作成しましょう。全ての Story は `.story.vue` 拡張子を使用します。

```vue
<script lang="ts" setup>
import AppButton from "./AppButton.vue";
</script>

<template>
  <Story title="buttons">
    <AppButton> I am a button </AppButton>
  </Story>
</template>
```

上記のように通常の Vue の SFC ファイルと全く同じスタイルで Story を記述することができます。Story は `<template>` タグ内の `<Story>` タグの中に記述する必要があります。

`<Story>` タグは `title` Props を受け取ることができ、これを指定すると任意のタイトルを付与することができます。

Story を作成したら開発サーバーを起動しましょう。

```sh
$ npm run story:dev
```

http:://localhost:3000 にアクセスすると作成した `buttons` ストーリーが表示されます。その他、Design System メニューも自動で作成されており、どうやら TailwindCSS の設定に基づき生成されているようです。

![スクリーンショット 2022-06-04 20.08.32](//images.ctfassets.net/in6v9lxmm5c8/7k27iG1nL7Rkq7ObsAByHy/d112ae1a3d58ce00a8a349929fad6d2a/____________________________2022-06-04_20.08.32.png)

![スクリーンショット 2022-06-04 20.11.21](//images.ctfassets.net/in6v9lxmm5c8/47uJ47BWJ4OHtnsA97RKIK/c75f494e2af215e5e7f2c35a127e6484/____________________________2022-06-04_20.11.21.png)

Storybook と同じように Controls タブが存在し、Props を変更することができます。

![controls](//images.ctfassets.net/in6v9lxmm5c8/3ArUCQRJPJnDCVb3GVeeBd/1011794d73d5dfef45bcee028634e2bd/controls.gif)

その他の機能としてはデフォルトで以下を設定できるようです。
- ダークモードの切り替え
  - ![darkmode](//images.ctfassets.net/in6v9lxmm5c8/6dfv4fjMfaRJi49ByDLFRp/601046f0ff54cabe580e9dd7fd0aa5b0/darkmode.gif)
- レスポンスサイズの設定
  - ![responsive](//images.ctfassets.net/in6v9lxmm5c8/B5JC30hw0AZStMJmjftt6/ffcc5a60978524b8e17cf2f6d693806a/responsive.gif)
- 背景色の設定
  - ![background-color](//images.ctfassets.net/in6v9lxmm5c8/5Y7Uv7VmoEkJpoXEHY4Kiw/a482d5768e51cc7dfec89c5558717b1e/background-color.gif)

### Story を複数作成する

`<Variants>` タグを使用することで、1つのコンポーネントに対して複数の表示を作成することができます。`<Variants>` タグも `<Story>` タグと同様に `title` Props を与えることができます。

```ts
<script lang="ts" setup>
import AppButton from "./AppButton.vue";
</script>

<template>
  <Story title="buttons">
    <Variant title="default">
      <AppButton> I am a button </AppButton>
    </Variant>
    <Variant title="secondary">
      <AppButton color="secondary"> I am a button </AppButton>
    </Variant>
    <Variant title="disabled">
      <AppButton disabled> I am a button </AppButton>
    </Variant>
  </Story>
</template>
```

`<Variant>` タグを追加したことにより、`buttons` メニューの配下にサブメニューが追加されました。

![スクリーンショット 2022-06-04 20.28.20](//images.ctfassets.net/in6v9lxmm5c8/3eDRTtPS91RyHOrcsKQugW/3cb920bbeb1b327be75de8b606b61e18/____________________________2022-06-04_20.28.20.png)

#### レイアウトの変更

デフォルトでは `<Variant>` タグを使用した場合、1つの `variant` につき一つのメニュが追加され、それぞれ別のページに表示されます。ですが、時には全ての `variant` を横に並べて表示して比較したいこともあるでしょう。

そのような場合には、`<Story>` に `layout` Props を渡して `{ type: 'grid' }` を指定することで、全ての `variant` を1つのページに グリッドレイアウトで表示できます。

```diff
  <script lang="ts" setup>
  import AppButton from "./AppButton.vue";
  </script>

  <template>
-   <Story title="buttons">
+   <Story title="buttons" :layout="{ type: 'grid' }">
      <Variant title="default">
        <AppButton> I am a button </AppButton>
      </Variant>
      <Variant title="secondary">
        <AppButton color="secondary"> I am a button </AppButton>
      </Variant>
      <Variant title="disabled">
        <AppButton disabled> I am a button </AppButton>
      </Variant>
    </Story>
  </template>
```

![スクリーンショット 2022-06-04 20.39.19](//images.ctfassets.net/in6v9lxmm5c8/7j84o7MjrzNnynIEDKAJQJ/eebd24f1a5585ebdb7a83c7fd7ef309f/____________________________2022-06-04_20.39.19.png)

### コンポーネントに状態を渡す

デフォルトでは Controls タブで Props の状態を変更することができますが、それ以外の状態をコンポーネントに渡して操作したいこともあるでしょう。例えば、次の例ではボタンコンポーネントのスロットに渡す文字列を状態として保持するようにしています。

```vue
<script lang="ts" setup>
import { ref } from "vue";
import AppButton from "./AppButton.vue";

const label = ref("Hello World");
</script>

<template>
  <Story title="buttons">
    <AppButton>{{ label }}</AppButton>
  </Story>
</template>
```

あまり難しいことは考えずに、普段の Vue で行っている方法と同じく `ref` で状態を定義しています。このままでは状態を更新することができないので Controls タブに `label` を更新できるようにします。

`<Story>` タグ又は `<Variant>` タグの `controls` スロットを使用することで Controls タブにフォームを追加することができます。`<Story>` タグ直下にスロットを配置した場合全ての `variant` の Controls タブにフォームが追加され、`<Variant>` タグ配下にスロットを配置した場合にはその `variant` の Controls タブのみにフォームが追加されます。

`<HstText>` は Histoire に予め用意されているコンポーネントで、 Controls タグ向けの UI のフォームを利用することができます。

```vue
<script lang="ts" setup>
import { ref } from "vue";
import AppButton from "./AppButton.vue";

const label = ref("Hello World");
</script>

<template>
  <Story title="buttons">
    <AppButton>{{ label }}</AppButton>

    <template #controls>
      <HstText v-model="label" title="label" />
    </template>
  </Story>
</template>
```

Controls タブに `label` フォームが追加され、ボタン内部のテキストを操作できるようになりました。

![controls-label](//images.ctfassets.net/in6v9lxmm5c8/6ggmgqu50thR2BMpdql69J/53349b3f319c563470e4ef46fe613b5f/controls-label.gif)

### イベント

Histoire の `hstEvent` 関数を使用することでコンポーネントが emit するイベントの一覧を Events タブに表示することができます。

```vue
<script lang="ts" setup>
import AppButton from "./AppButton.vue";
import { hstEvent } from "histoire/client";
</script>

<template>
  <Story title="buttons">
    <AppButton @click="hstEvent('Click', $event)">I am a button</AppButton>
  </Story>
</template>
```

![events](//images.ctfassets.net/in6v9lxmm5c8/6gS8Ty2VXPyYBSKX27XMbb/6d1285bc0b8866243ae756bad9ae5735/events.gif)

### ドキュメント

ファイルのルートレベルに `<doc>` タグを追加することでコンポーネントのドキュメントをマークダウン記法で記述することができます。ドキュメントは Docs タグに表示されます。

```vue
<script lang="ts" setup>
import AppButton from "./AppButton.vue";
</script>

<template>
  <Story title="buttons">
    <AppButton>I am a button</AppButton>
  </Story>
</template>

<docs lang="md">
# Buttons

This is a button.

## Props

| Name     | Type                         | Default   | Description                    |
| -------- | ---------------------------- | --------- | ------------------------------ |
| color    | "primary" &#124; "secondary" | "primary" | The color of the button        |
| disabled | boolean                      | false     | Whether the button is disabled |
</docs>
```

![スクリーンショット 2022-06-04 21.59.44](//images.ctfassets.net/in6v9lxmm5c8/18FVWY0ET2Pt2HIh9tRqCo/f9f067325e984a29494a516a1bebb3f5/____________________________2022-06-04_21.59.44.png)

### ソースコード

デフォルトでは Story からソースコードを自動で生成して表示しますが、`<Story>` または `<Variant>` タグに `source` Props を渡すか、`source` スロットを使用することで表示されるソースコードを上書きすることでできます。

```vue
<script lang="ts" setup>
import AppButton from "./AppButton.vue";
</script>

<template>
  <Story title="buttons">
    <AppButton>I am a button</AppButton>
    <template #source>custome source code</template>
  </Story>
</template>
```

![スクリーンショット 2022-06-04 22.08.12](//images.ctfassets.net/in6v9lxmm5c8/30qvPuYI0SklR2lhRExcL0/428a1c0ce3ad6a591ed97d3009de3769/____________________________2022-06-04_22.08.12.png)

### プラグイン

Storybook の Addons のようにプラグインにより機能を拡張することができます。例としてスクリーンショットを撮影してビジュアルリグレッションテストを実施する [https://histoire.dev/guide/plugins.html](https://github.com/histoire-dev/histoire/tree/main/packages/histoire-plugin-screenshot) を使ってみましょう。

まずはパッケージをインストールします。

```
$ npm i -D @histoire/plugin-screenshot
```

Histoire の設定ファイル（この記事内では `histoire.config.ts`）においてプラグインを追加します。

```diff
  // histoire.config.ts
  import { defineConfig } from 'histoire'
+ import { HstScreenshot } from '@histoire/plugin-screenshot'

  export default defineConfig({
    setupFile: '/src/histoire.setup.ts',
+   plugins: [
+     HstScreenshot({})
+   ]
  })
```

ビルドコマンドを実行した際にスクリーンショットが撮影されるようになります。

```sh
$ npm run story:build
```

## 感想

Vite 製のツールはやっぱり早く動作するので良いですね。エコシステムはまだまだ充実してるとはいえないですが、一通りの機能は揃っているので試してみるには良さそうですね。

個人的には Vue の SFC ファイル形式で Story を記述できるところが気に入っています。Storybook 用の新しい書き方を学ぶコストが削減できていい感じです。

サンプルコードは以下のレポジトリにあります。

https://github.com/azukiazusa1/histoire-example
