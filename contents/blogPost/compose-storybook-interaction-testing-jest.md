---
id: 2OFN6XUeTuIEbRNxWYCZhF
title: "Storybook の interaction testing と jest を組み合わせる"
slug: "compose-storybook-interaction-testing-jest"
about: "Storybook の Component Story Format 3.0 では新機能として `play()` 関数が追加されました。  `play()` 関数は Storybook 上で ユーザーのクリックやフォーム入力のようなインタラクションな操作を表現することができます。  `play()` 関数の大きな特徴としては Component Story Format の移植性の高さを利用して Storybook 上で定義したインタラクションを `Jest` など他の領域においても再利用できることです。"
createdAt: "2022-01-23T00:00+09:00"
updatedAt: "2022-01-23T00:00+09:00"
tags: ["storybook", "Jest", "Vue.js"]
published: true
---
Storybook の [Component Story Format 3.0](https://storybook.js.org/blog/component-story-format-3-0/) では新機能として `play()` 関数が追加されました。

`play()` 関数は Storybook 上でユーザーのクリックやフォーム入力のようなインタラクションな操作を表現できます。

`play()` 関数の大きな特徴としては [Component Story Format](https://storybook.js.org/blog/component-story-format/) の移植性の高さを利用して Storybook 上で定義したインタラクションを `Jest` など他の領域においても再利用できることです。

この記事では Vite に Storybook を導入してインタラクションテストを作成して Jest で再利用するまでの手順をやってみたいと思います。

## Vite プロジェクトの作成

まずは以下コマンドで Vite プロジェクトを作成します。

```sh
npm init vite@latest my-vue-app -- --template vue-ts
cd my-vue-app
npm install
```

## Storybook のインストール

続いて以下コマンドで Storybook のひな形を作成します。
なお CSF3.0 を利用するには Storybook version が 6.4.0 以降である必要があります。

```sh
npx sb init
```

Storybook 内でインタラクションを実行できるようにするために以下のアドオンをインストールします。

```sh
npm i -D @storybook/addon-interactions @storybook/jest @storybook/testing-library
```

インストールが完了したら `.storybook/main.js` にアドオンを追加します。

```js
// .storybook/main.js
module.exports = {
  addons: ['@storybook/addon-interactions'],
};
```

## コンポーネントの作成

準備が整いましたので Storybook で描画する対象のコンポーネントを簡単に作成しましょう。作成するコンポーネントは以下の仕様を持つこととします。

- 新しいタスクを input 要素の入力できる
- 「追加」ボタンをクリックすると input 要素の入力をクリアして新たにタスクリストを表示する

まずは必要最低限の実装のみを行い Storybook 上で描画を確認できるようにします。

- components/TaskList.vue

```vue
<template>
  <form @submit.prevent>
    <div class="form-group">
      <label for="task-name">タスク名</label>
      <input type="text" id="task-name" />
      <button type="submit">追加</button>
    </div>
  </form>
</template>
```

## Story の作成

それでは作成したコンポーネントの Story を作成して描画を確認してみましょう。

- src/components/TaskList.stories.ts

```ts
import type { Story, Meta } from '@storybook/vue3'
import TaskList from "./TaskList.vue";

export default {
  title: "TaskList",
  component: TaskList,
  argTypes: {}
} as Meta;

const Template: Story = (args) => ({
  components: { TaskList },
  setup() {
    return { args }
  },
  template: "<TaskList />",
});

export const Default = Template.bind({});
Default.args = {}
```

以下コマンドで Storybook を起動します。

```sh
npm run storybook
```

![スクリーンショット 2022-01-22 23.41.23](//images.ctfassets.net/in6v9lxmm5c8/32OGPYfkUkbSVxATbOgHVN/29daf39cfe5724ae8bb06cc22d8521b2/____________________________2022-01-22_23.41.23.png)

## インタラクションを追加する

それでは本題のインタラクションを追加してみましょう。新たに `InputFilled` という Story を追加して `play` 関数を定義します。

- src/components/TaskList.stories.ts

```ts
import { userEvent, within, waitFor } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

// 省略...

export const InputFilled = Template.bind({});
InputFilled.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await userEvent.type(canvas.getByLabelText("タスク名"), "牛乳を買う");
  await userEvent.click(canvas.getByRole('button', { name: '追加' }));

  await waitFor(() => {
    const items = canvas.getAllByRole('listitem');
    expect(items.length).toBe(1);
  })
}
```

`play` 関数は `StoryContext` という型の引数を受け取り分割代入で `canvasElement` を取得しています。この `canvasElement` を使用することでコンポーネントのルートから実行を開始するようにインタラクションを調整できます。`@storybook/testing-library` からインポートした `screen` オブジェクトを用いるとトップレベルの要素から要素を取得します。

前述の `canvas` から対象の要素を取得して `@storybook/testing-library` からインポートした `useEvent` オブジェクトを利用して入力やクリックなどのイベントを発生させることができます。要素の取得方法は [testing-library](https://testing-library.com/docs/react-testing-library/cheatsheet/#queries) の Query とほぼ同じですので普段テストを記述しているときと変わらない感じで `play` 関数を記述できます。

さらに `@storybook/jest` の `expect` 関数を用いることによって `jest` さながらテストを記述することも可能です。

`play` 関数は Story がレンダリングされた後に実行されます。実際に Story を確認すると input 要素に `play` 関数でタイプした「牛乳を買う」という値が入力されています。

![スクリーンショット 2022-01-23 10.20.38](//images.ctfassets.net/in6v9lxmm5c8/7EP6kIz2DBLU0tc130bHBv/5398dcbe173deed7e988a69dec9129a0/____________________________2022-01-23_10.20.38.png)

Interactions タブを確認してみると `<li>` 要素が存在しないためエラーが発生していることが確認できます。このように Storybook を通じてイベントが壊れていないかどうかを確認できます。

インタラクションが成功するように実装を修正しましょう。

- src/components/TaskList.vue

```vue
<script setup lang="ts">
import { ref } from 'vue'
const taskName = ref("");
const taskList = ref<string[]>([]);

const onSubmit = () => {
  taskList.value.push(taskName.value);
  taskName.value = "";
}
</script>

<template>
  <form @submit.prevent=onSubmit"">
    <div class="form-group">
      <label for="task-name">タスク名</label>
      <input type="text" id="task-name" v-model="taskName" />
      <button type="submit">追加</button>
      <ul>
        <li v-for="task in taskList">{{ task }}</li>
      </ul>
    </div>
  </form>
</template>
```

すべてのインタラクションが成功していることが確認できます。

![スクリーンショット 2022-01-23 10.31.08 1](//images.ctfassets.net/in6v9lxmm5c8/6X0hVTrJDzADRQWa8qqEXv/99eae49fb6a34ca688a9b292536f0ae3/____________________________2022-01-23_10.31.08_1.png)

## インタラクションをデバッグする

Storybook 上で UI の状態を巻き戻してデバッグできます。この機能を有効にするには `.storybook/main.js` において `features.interactionsDebugger` を `true` にする必要があります。

- .storybook/main.js

```js
module.exports = {
  // ..
  features: {
    interactionsDebugger: true,
  },
};
```

Storybook を再起動すると Interactions タブにデバッグバーが追加されいます。

![interactions-dbug](//images.ctfassets.net/in6v9lxmm5c8/2OdDcXSlylnRXL9qF3Kcu0/7bc7d8550ee76aa33e9901b3a7d46a24/interactions-dbug.gif)

## Jest のインストール

Storybook 上でインタラクションを確認するのは人間による目視によるものですので Jest と組み合わせて自動でインタラクションをテストできるようにします。

まずは `Jest` を実行するために必要なパッケージをインストールします。

```sh
npm -D install jest @types/jest ts-jest vue-jest@next @testing-library/vue@next @testing-library/jest-dom @storybook/testing-vue3
```

[@storybook/testing-vue3](https://storybook.js.org/addons/@storybook/testing-vue3) は Storybook で定義した story をテストにおいて再利用するためのパッケージです。

インストールが完了したら設定ファイルを作成します。

- jest.config.cjs

```js
module.exports = {
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    "^.+\\.ts$": "ts-jest",
    "^.+\\.vue$": "vue-jest",
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```

- tsconfig.json

```json
{
  "compilerOptions": {
    // ..
    "types": ["@types/jest"],
  },
}
```

さらに Storybook でグローバルデコレータを使用している場合には Jest 実行時においても適用させるためにセットアップファイルを用意します。

- setupFile.ts

```js
import { setGlobalConfig } from '@storybook/testing-vue3';
import * as globalStorybookConfig from './.storybook/preview'; 

setGlobalConfig(globalStorybookConfig);
```

`jest` コマンド実行時に作成した `setupFile.js` をセットアップファイルとして指定するようにします。

- pakcage.json

```json
"scripts": {
  "test": "jest --setupFilesAfterEnv ./setupFile.ts"
}
```

## テストファイルの作成

それではテストファイルを作成しましょう。通常のコンポーネントのテストを書くときと異なりコンポーネントを直接インポートするのではなく、作成した Storybook のファイルから Story をインポートして `composeStories` 関数を使用することで作成した Story を Jest で再利用できます。

対象の Story の `play` 関数を呼び出すことが Jest であらためてイベントを記述せずとも実行してくれます。

- src/components/TaskList.spec.ts

```ts
import { render } from '@testing-library/vue';
import { composeStories } from '@storybook/testing-vue3';
import * as Stories from './TaskList.stories'; 

const { InputFilled, Default } = composeStories(Stories)

test('タスクが存在しないときリストは表示されない', () => {
  const { queryAllByRole } = render(Default())
  expect(queryAllByRole('listitem').length).toBe(0)
})

test('タスク名を入力して追加ボタンをクリックするとリストに追加される', async () => {
  const { container } = render(InputFilled());
  await Stories.InputFilled.play?.({ canvasElement: container } as any);
});
```

テストを実行して、すべてのテストが成功していることが確認できました。

```sh
npm run test

> my-vue-app@0.0.0 test
> jest --setupFilesAfterEnv ./setupFile.ts

 PASS  src/components/TaskList.spec.ts
  ✓ タスクが存在しないときリストは表示されない (55 ms)
  ✓ タスク名を入力して追加ボタンをクリックするとリストに追加される (109 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.637 s, estimated 10 s
Ran all test suites.
```

試しにボタン要素を削除してテストが失敗することも確認してみましょう。

- src/components/TaskList.vue

```diff
 <script setup lang="ts">
 import { ref } from "vue";
 const taskName = ref("");
 const taskList = ref<string[]>([]);

 const onSubmit = () => {
   taskList.value.push(taskName.value);
   taskName.value = "";
 };
 </script>

 <template>
   <form @submit.prevent="onSubmit">
     <div class="form-group">
       <label for="task-name">タスク名</label>
       <input type="text" id="task-name" v-model="taskName" />
-       <button type="submit">追加</button>
       <ul>
         <li v-for="task in taskList">{{ task }}</li>
       </ul>
     </div>
   </form>
 </template>
```

テストを実行すると想定通りにテストが失敗します。

```sh
npm run test

> my-vue-app@0.0.0 test
> jest --setupFilesAfterEnv ./setupFile.ts

 FAIL  src/components/TaskList.spec.ts
  ✓ タスクが存在しないときリストは表示されない (92 ms)
  ✕ タスク名を入力して追加ボタンをクリックするとリストに追加される (166 ms)

  ● タスク名を入力して追加ボタンをクリックするとリストに追加される

    TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "追加"

    Here are the accessible roles:

      textbox:

      Name "タスク名":
      <input
        id="task-name"
        type="text"
      />

      --------------------------------------------------
      list:

      Name "":
      <ul />

      --------------------------------------------------

    Ignored nodes: comments, <script />, <style />
    <div>
      <form>
        <div
          class="form-group"
        >
          <label
            for="task-name"
          >
            タスク名
          </label>
          <input
            id="task-name"
            type="text"
          />
          <ul>

          </ul>
        </div>
      </form>
    </div>

      26 |
      27 |   await userEvent.type(canvas.getByLabelText("タスク名"), "牛乳を買う");
    > 28 |   await userEvent.click(canvas.getByRole('button', { name: '追加' }));
         |                                ^
      29 |
      30 |   await waitFor(() => {
      31 |     const items = canvas.getAllByRole('listitem');

      at Object.getElementError (node_modules/@testing-library/dom/dist/config.js:38:19)
      at node_modules/@testing-library/dom/dist/query-helpers.js:90:38
      at node_modules/@testing-library/dom/dist/query-helpers.js:62:17
      at node_modules/@testing-library/dom/dist/query-helpers.js:111:19
      at Function.Object.<anonymous>.exports.InputFilled.play (src/components/TaskList.stories.ts:28:32)
      at Object.<anonymous> (src/components/TaskList.spec.ts:14:3)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 passed, 2 total
Snapshots:   0 total
Time:        6.032 s
Ran all test suites.
```

## 感想

Storybook 上でインタラクションをテストできるようになることでさらに活用の幅を広げることができるようになりました。実際に描画内容を目視しながらテストをできるので testing-library でテストを記述するのと比べてより取り組みやすくなっていると思います。

Story を再利用可能なところも嬉しい点ですね。

サンプルコードは以下のレポジトリから確認できます。

https://github.com/azukiazusa1/vue-storybook-interaction-tests-sample

## 参考

https://storybook.js.org/docs/vue/writing-stories/play-function
https://storybook.js.org/docs/vue/writing-tests/interaction-testing
https://zenn.dev/takepepe/articles/storybook-driven-development
https://qiita.com/dia/items/3b984afec9a51cc803d1

