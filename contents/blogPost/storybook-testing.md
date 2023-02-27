---
id: ogyaJAeyrZRJfA56wjUMT
title: "Storybook 単体でインタラクションテストを実施する"
slug: "storybook-testing"
about: "Storybook の Component Story Format 3.0 では新機能として play() 関数が追加されました。  `play()` 関数は Storybook 上で ユーザーのインタラクションな操作を表現することができます。  以前は composeStories() 関数により Storybook 上で作成したストーリーを Jest で再利用する方法を書いたのですが、どうやら Storybook のみで完結してテストを実行することができるようですのでこちらを試してみます。"
createdAt: "2022-03-06T00:00+09:00"
updatedAt: "2022-03-06T00:00+09:00"
tags: ["storybook", "Jest", "Vue.js"]
published: true
---
!> Storybook のインタラクションテストは現在（2022/03/06）beta 機能です。

Storybook の [Component Story Format 3.0](https://storybook.js.org/blog/component-story-format-3-0/) では新機能として `play()` 関数が追加されました。

`play()` 関数は Storybook 上でユーザーのクリックやフォーム入力のようなインタラクションな操作を表現できます。

以前は `composeStories()` 関数により Storybook 上で作成したストーリーを Jest で再利用する方法を書いたのですが、どうやら Storybook のみで完結してテストを実行できるようですのでこちらを試してみます。

## Vite プロジェクトの作成

まずは以下コマンドで Vite プロジェクトを作成します。

```sh
$ npm init vite@latest my-vue-app -- --template vue-ts
$ cd my-vue-app
$ npm install
```

## Storybook のインストール

続いて以下コマンドで Storybook のひな形を作成します。
なお `play()` 関数を利用するには Storybook version が 6.4.0 以降である必要があります。

```sh
$ npx sb init
# 自動生成されるフォルダは不要なので削除
$ rm -rf src/stories
```

Storybook 内でインタラクションを実行できるようにするために以下のパッケージをインストールします。

```sh
$ npm i -D @storybook/addon-interactions @storybook/jest @storybook/testing-library @storybook/test-runner jest
```

- @storybook/addon-interactions - `play()` 関数によるインタラクションを Storybook 上のタブで確認するためのアドオンです。
- @storybook/jest、@storybook/testing-library - [Testing Library](https://testing-library.com/) のような構文を用いて Storybook でテストを記述できます。
- @storybook/test-runner - Storybook 上のストーリーをテストできるテストランナーです
- jest - @storybook/test-runner を動かすために必要です（peer dependency）。

インストールが完了したら `.storybook/main.js` にアドオンを追加し、デバッグを有効にします。

```js:.storybook/main.js
module.exports = {
  addons: ['@storybook/addon-interactions'],
};
```

最後に、`package.json` にテストスクリプトを追加します。

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

## ストーリーの作成

準備が整いましたので、簡単なストーリーを作成して確認してみましょう。`src/components` フォルダに `Couter.vue` と `Couner.stories.ts` 作成します。

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
const increment = () => {
  count.value++;
};
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

```ts
import type { Story, Meta } from '@storybook/vue3'
import Counter from "./Counter.vue";

export default {
  title: "Counter",
  component: Counter,
  argTypes: {}
} as Meta;

const Template: Story = (args) => ({
  components: { Counter },
  setup() {
    return { args }
  },
  template: "<Counter />",
});

export const Default = Template.bind({});
Default.args = {}
```

以下コマンドで Storybook を起動して確認します。

```sh
$ npm run storybook
```

![スクリーンショット 2022-03-06 12.56.56](//images.ctfassets.net/in6v9lxmm5c8/4oyda3r6DPk9BzQb8s5ecW/86458582eae00b022e8b03f24adea5b8/____________________________2022-03-06_12.56.56.png)

それでは Storybook のテストランナーを実行してみましょう。テストランナーを実行するには Storybook が起動している状態である必要があります。別ターミナルで以下コマンドを実行しましょう。

```sh
$ npm run test-storybook
```

テストランナーによりすべてのストーリーに対してテストが実行されます。今はまだ `play()` 関数によるインタラクションテストを記述していないので、スモークテストのみが実行されます。スモークテストはエラーなくストーリーが描画されていることを確認します。

```sh
page loaded in 639ms.
 PASS   browser: chromium  src/components/Counter.stories.ts
  Counter
    Default
      ✓ smoke-test (117 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        4.74 s
Ran all test suites.
```

テストが正しく動作しているかどうか意図的にエラーを起こして確認してみましょう。

```diff
  <script setup lang="ts">
  import { ref } from "vue";

+ throw new Error("Error");

  const count = ref(0);
  const increment = () => {
    count.value++;
  };
  const reset = () => {
    count.value = 0;
  };
  </script>
```

テストを実行するとテストが失敗したことが報告され、どのストーリーでテストが失敗したのかを教えてくれます。

```sh
$ npm run test-storybook

> my-vue-app@0.0.0 test-storybook
> test-storybook

page loaded in 652ms.
 FAIL   browser: chromium  src/components/Counter.stories.ts
  Counter
    Default
      ✕ smoke-test (84 ms)

  ● Counter › Default › smoke-test

    page.evaluate: StorybookTestRunnerError: 
    An error occurred in the following story:
    http://localhost:6006/?path=/story/counter--default&addonPanel=storybook/interactions/panel

    Message:
     Error

      at Object.<anonymous> (<anonymous>:75:13)
      ...

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.466 s
Ran all test suites.
```

## インタラクションテストの作成

続いて、`play()` 関数を使ってインタラクションテストを作成しましょう。

```ts
import { within, fireEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
// ...

Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  expect(canvas.getByText('Count: 0')).toBeInTheDocument()

  await fireEvent.click(canvas.getByText('Increment'));
  await fireEvent.click(canvas.getByText('Increment'));

  expect(canvas.getByText('Count: 2')).toBeInTheDocument()

  await fireEvent.click(canvas.getByText('Reset'));

  expect(canvas.getByText('Count: 0')).toBeInTheDocument()
}
```

`play` 関数は `StoryContext` という型の引数を受け取り分割代入で `canvasElement` を取得しています。この `canvasElement` を使用することでコンポーネントのルート要素を取得できます。

前述の `canvas` から対象の要素を取得して @storybook/testing-library からインポートした `fireEvent` オブジェクトを利用して入力やクリックなどのイベントを発生させることができます。要素の取得方法は [testing-library の Query](https://testing-library.com/docs/react-testing-library/cheatsheet/#queries) とほぼ同じですので普段テストを記述しているときと変わらない感じで `play` 関数を記述できます。

さらに `@storybook/jest` の `expect` 関数を用いることによりアサーションを追加できます。

それでは `play()` 関数を追加しましたのでテストを実行してみましょう。

```sh
$ npm run test-storybook

> my-vue-app@0.0.0 test-storybook
> test-storybook

page loaded in 706ms.
 FAIL   browser: chromium  src/components/Counter.stories.ts
  Counter
    Default
      ✕ play-test (107 ms)

  ● Counter › Default › play-test

    page.evaluate: StorybookTestRunnerError: 
    An error occurred in the following story:
    http://localhost:6006/?path=/story/counter--default&addonPanel=storybook/interactions/panel

    Message:
     Unable to find an element with the text: Count: 0. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

    Ignored nodes: comments, <script />, <style />
    <div
      data-v-app=""
      id="root"
    >
      <div>
        <p>
          Count: 2
        </p>
        <button>
          Increment
        </button>
        <button>
          Reset
        </button>
      </div>
    </div>

      at Object.<anonymous> (<anonymous>:75:13)
      ...

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        4.829 s
Ran all test suites.
```

スモークテストの代わりに `play()` 関数で記述したテストが実行されています。どうやらテストに失敗してしまっているようです。`An error occurred in the following story:` の下に表示されている URL `http://localhost:6006/?path=/story/counter--default&addonPanel=storybook/interactions/panel` からストーリーを確認してみましょう。

![スクリーンショット 2022-03-06 13.37.09](//images.ctfassets.net/in6v9lxmm5c8/6hPnIxbS4PMcdFI4p4vipD/d4cfbaf5505e602d1ef4277df9db946c/____________________________2022-03-06_13.37.09.png)

Interactions タブからインタラクションテストの結果を確認できます。最後の　`getByText("Count: 0")` のアサーションに失敗しているようです。またインタラクションの状態は巻き戻すことができるのでデバッグに役立つことでしょう。

![story-interactions](//images.ctfassets.net/in6v9lxmm5c8/1zEtWwZpBUUKX4ipiEWRoS/393c142be063f825529e855971a1cdcb/story-interactions.gif)

どうやら `Reset` ボタンをクリックしたときの処理の実装を忘れてしまっているようです。コンポーネントを修正しましょう。

```diff
  <script setup lang="ts">
  import { ref } from "vue";

  const count = ref(0);
  const increment = () => {
    count.value++;
  };
+ const reset = () => {
+   count.value = 0;
+ };
  </script>

  <template>
    <div>
      <p>Count: {{ count }}</p>
      <button @click="increment">Increment</button>
      <button @click="reset">Reset</button>
    </div>
  </template>
```

修正が完了したら再度テストを実行しましょう。

```sh
npm run test-storybook

> my-vue-app@0.0.0 test-storybook
> test-storybook

page loaded in 579ms.
 PASS   browser: chromium  src/components/Counter.stories.ts
  Counter
    Default
      ✓ play-test (74 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        2.946 s, estimated 5 s
Ran all test suites.
```

すべてのテストが成功していますね。

## クロスブラウザテスト

テストランナーはデフォルトでは `chromium` で実行されますが、`--browsers` オプションによりテストを実行するブラウザを複数指定できます。

以下のコマンドでは `firefox` と `chromium` のそれぞれのブラウザでテストを実行します。

```sh
$ npm run test-storybook -- --browsers firefox chromium 

> my-vue-app@0.0.0 test-storybook
> test-storybook "--browsers" "firefox" "chromium"

page loaded in 1035ms.
 PASS   browser: firefox  src/components/Counter.stories.ts
  Counter
    Default
      ✓ play-test (60 ms)

page loaded in 778ms.
 PASS   browser: chromium  src/components/Counter.stories.ts
  Counter
    Default
      ✓ play-test (168 ms)

Test Suites: 2 passed, 2 of 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        9.275 s
Ran all test suites.
```

## テストフックでスナップショットテストを追加する

!> テストフックは実験的な機能であるため将来破壊的な変更がされる恐れがあります。

テストランナーによりストーリーの描画と `play()` 関数によるインタラクションをテストできますが、これらのテストはブラウザ上で実施されるため例えば Node.js 上のみ動作するスナップショットテストなどは実施できません。

スナップショットテストを実施するためにはテストフックを使用します。テストフックは各ストーリーのテストのライフサイクルに処理を実行することが可能です。

- `setup` - すべてのテストの実施前に実行します。
- `preRender` - ストーリーが描画される前に実行されます。
- `postRender` - ストーリーが描画された後に実行されます。

`preRender` と `postRender` フックは引数に　[Playwright の Page](https://playwright.dev/docs/pages) オブジェクトとストーリーの `id`,`title`,`name` を持っている `context` オブジェクトが渡されます。

テストフックは `.storybook/test-runner.js` に記述をします。

```js
// .storybook/test-runner.js
const { toMatchImageSnapshot } = require("jest-image-snapshot");

const customSnapshotsDir = `${process.cwd()}/__snapshots__`;

/**
 * @type {import('@storybook/test-runner').TestRunnerConfig}
 */
module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postRender(page, context) {
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir,
      customSnapshotIdentifier: context.id,
    });
  },
};
```

スナップショットテストのためのアサーションを追加しましょう。

```sh
npm i -D jest-image-snapshot
```

テストを実行するとスナップショットテストも同時に実施されていることが確認できます。

```sh
npm run test-storybook

> my-vue-app@0.0.0 test-storybook
> test-storybook

page loaded in 574ms.
 PASS   browser: chromium  src/components/Counter.stories.ts
  Counter
    Default
      ✓ play-test (307 ms)

 › 1 snapshot written.
Snapshot Summary
 › 1 snapshot written from 1 test suite.

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   1 written, 1 total
Time:        3.643 s
Ran all test suites.
```

## CI 上でテストを実行する

皆さん気になっているころだと思われますが、CI 上でテストを実行する方法も紹介されています。

https://github.com/storybookjs/test-runner#2-running-against-locally-built-storybooks-in-ci

まずは以下のパッケージをインストールします。

```sh
npm i -D concurrently http-server wait-on
```

`package.json` に CI 用のスクリプトを追加します。Storybook をビルドしてローカルにサーブしてからテストを実行します。

```json
{
  "scripts": {
    "test-storybook:ci": "concurrently -k -s first -n \"SB,TEST\" -c \"magenta,blue\" \"yarn build-storybook --quiet && npx http-server storybook-static --port 6006 --silent\" \"wait-on tcp:6006 && yarn test-storybook\""
  }
}
```

GitHub ACtions を利用するために `.github/workflows/test.yaml` ファイルを作成していワークフローを追加しましょう。

```yaml
name: Storybook Tests
on: push
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14.x'
      - name: Install dependencies
        run: yarn
      - name: Run Storybook tests
        run: yarn test-storybook:ci
```

## 感想

Storybook で定義したインタラクションをアサートするためだけにテストファイルを作成しないでよいので面倒事が 1 つ少なくなった感じです。

ただ、テストを実行するためにわざわざ Storybook を起動させなければならなかったり、Jest の `describe`、`test` に相当するものがないのでテスト実行時のメッセージがすべて `play-test` となってしまうなどの欠点も目立ちますね。

まだまだ新しい機能ですので、今後の動向に期待が期待できるところです。

今回実装したコードは以下より参照できます。

https://github.com/azukiazusa1/vue-storybook-test-runner-example

## 参考

https://storybook.js.org/blog/interaction-testing-with-storybook/

https://github.com/storybookjs/test-runner

