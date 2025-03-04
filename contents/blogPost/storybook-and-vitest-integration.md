---
id: rh3o_bA8oAPySel9vcooK
title: "Storybook と Vitest の統合したコンポーネントテスト"
slug: "storybook-and-vitest-integration"
about: "Storybook v8.3 以降、ストーリーをテストするためのテストランナーとして Vitest を使用できるようになりました。Vitest を使用することで複雑なセットアップが不要になります。また、推奨されているブラウザモードを使用することで、実際のブラウザでの挙動をより正確に再現できます。"
createdAt: "2024-10-06T15:39+09:00"
updatedAt: "2024-10-06T15:39+09:00"
tags: ["storybook", "Vitest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1H045Ib8GgFJzLFn2eqfJ6/3d6e6093d220e641143e50b5488a9d3d/sweets_mont-blanc_cake_illust_3604-768x620.png"
  title: "モンブランケーキのイラスト"
selfAssessment:
  quizzes:
    - question: "Storybook と Vitest を連携するために使われるコマンドとして最適なものはどれか？"
      answers:
        - text: "npx storybook add @storybook/experimental-addon-test"
          correct: true
          explanation: "必要なパッケージをインストールし、設定も自動で行うことができます。"
        - text: "npm install @storybook/experimental-addon-test"
          correct: false
          explanation: null
        - text: "npx storybook add @storybook/vitest"
          correct: false
          explanation: "@storybook/vitest というパッケージは存在しません。"
        - text: "npm install @storybook/vitest"
          correct: false
          explanation: null
published: true
---
!> Storybook Vitest Plugin は 2024 年 10 月 5 日現在実験的な機能として提供されており、API が将来にわたって変更される可能性があります。

Storybook v8.3 より、ストーリーをテストするためのテストランナーとして Vitest を使用できるようになりました。今までも `composeStories` 関数で作成済みのストーリーを使いまわし、Jest などのテストランナーを用いてたテストを行うことができましたが、複雑なセットアップが必要でした。

また Vitest では [ブラウザモード](https://vitest.dev/guide/browser/) により、ヘッドレスブラウザ上で Storybook のテストを高速に実行できる点が特徴です。ヘッドレスブラウザ上でテストを実行することにより、例えば jsdom や happy-dom などのシミュレーションを使用する方法と比べて、実際のブラウザでの挙動をより正確に再現できます。これはブラウザの機能や API に依存するコンポーネントをテストする際に特に有用です。

## テスト環境のセットアップ

Vitest と統合してテストを実行するためには、はじめに以下の要件を満たす必要があります。

- Storybook 8.3 以降
- Storybook のフレームワークが Vite を使用していること。もしくは、[Storybook Next.js framework](https://storybook.js.org/docs/get-started/frameworks/nextjs) を使用している。
- Vitest 2.0 以降
- Next.js のプロジェクトの場合、Next.js 14.1 以降

以下のコマンドを実行することで、`@storybook/experimental-addon-test` プラグインとその他に必要なパッケージをインストールし、自動で設定を行うことができます。

```bash
npx storybook add @storybook/experimental-addon-test
```

テストの設定として `vitest.workspace.ts` ファイルが作成されています。中身を確認してみましょう。

```typescript:vitest.workspace.ts
import { defineWorkspace } from "vitest/config";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";

// More info at: https://storybook.js.org/docs/writing-tests/vitest-plugin
export default defineWorkspace([
  "vite.config.ts",
  {
    extends: "vite.config.ts",
    plugins: [
      // See options at: https://storybook.js.org/docs/writing-tests/vitest-plugin#storybooktest
      storybookTest(),
    ],
    test: {
      name: "storybook",
      browser: {
        // vitest のブラウザモードを有効にする
        enabled: true,
        headless: true,
        name: "chromium",
        provider: "playwright",
      },
      // Make sure to adjust this pattern to match your stories files.
      include: ["**/*.stories.?(m)[jt]s?(x)"],
      setupFiles: ["./.storybook/vitest.setup.ts"],
    },
  },
]);
```

ブラウザモードでテストを実行することが推奨されているため、デフォルトで有効になっています。この設定を `test.browser.enabled` に `false` を設定することで、ブラウザモードを無効にして Node.js 上でテストを実行することも可能です。

セットアップが完了したら、`package.json` に `test` スクリプトを追加しておきましょう。

```json
{
  "scripts": {
    "test": "vitest"
  }
}
```

## ストーリーをテストする

それでは実際に Storybook のストーリーをテストしてみましょう。テスト対象のコンポーネントとして、簡単な入力フォームを作成します。フォームが送信されたら、入力された名前を表示するコンポーネントです。

```tsx:InputForm.tsx
import React, { useState } from "react";

export const InputForm = () => {
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState(false);
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        onChange={handleInput}
        value={name}
      />
      <button type="submit">Submit</button>
      {/* フォームが送信されたら、入力された名前を表示 */}
      {submit && <p>Hello, {name}!</p>}
    </form>
  );
};
```

このコンポーネントのストーリーを Storybook に追加します。

```tsx:InputForm.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";

import { InputForm } from "./InputForm";

const meta = {
  component: InputForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
```

ストーリーを追加すると、テスト対象として認識されます。何もテストが記述されていない場合には、コンポーネントをレンダリングできるかどうかを確認するスモークテストのみが実行されます。以下のコマンドでテストを実行しましょう。Vitest は CI 以外の環境で実行している場合、watch モードで実行されます。

```bash
npm run test

      [storybook] Browser runner started by playwright at http://localhost:5173/

 ✓ |storybook| src/InputForm.stories.tsx (1) 321ms
   ✓ Primary

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  17:15:22
   Duration  1.81s (transform 15ms, setup 139ms, collect 18ms, tests 321ms, environment 0ms, prepare 22ms)


 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

`src/InputForm.stories.tsx` に記述されたストーリーがテストされ、成功したことが確認できます。

### テスト対象から除外する

すべてのストーリーをテストの対象とするのではなく、特定のストーリーだけをテストの対象としたり、あるいは除外したいような場合があるでしょう。そのような場合には、`tags` プロパティを使用してテストの対象を絞ることができます。`vitest.workspace.ts` のプラグインの設定において、`include` と `exclude` プロパティを使用してテストの対象を指定できます。

```typescript:vitest.workspace.ts
import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "vite.config.ts",
  {
    plugins: [
      storybookTest({
        tags: {
          exclude: ["skip"],
        },
      }),
    ],
  }
]);
```

上記の設定では `skip` タグが付与されたストーリーをテストの対象から除外しています。ストーリーに対するタグは `meta.tags` もしくは個別のストーリーに対して `tags` プロパティを使用して設定できます。

```tsx:InputForm.stories.tsx {6}
const meta = {
  component: InputForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "skip"],
} satisfies Meta<typeof InputForm>;
```

`InputForm` のストーリーに `skip` タグを付与することで、テストの対象から除外されることが確認できます。

```bash
npm run tset

 ↓ |storybook| src/InputForm.stories.tsx (0) [skipped]
   ↓ No valid tests found (0) [skipped]

 Test Files  1 skipped (1)
      Tests  no tests
   Start at  11:58:01
   Duration  171ms
```

## ユーザー操作のテストの記述

ユーザーの操作をシミュレートしたテストを記述するためには、`play` 関数を使用します。`play` 関数はストーリーがレンダリングされた後に実行される小さなコードスニペットです。これを使用してコンポーネントを操作できます。

まずは `play` 関数内でテストを実行するために必要なパッケージをインストールします。

```bash
npm i -D @storybook/test
```

それではテストを記述しましょう。`play` 関数の引数には `canvasElement` というオブジェクトが渡されます。`canvasElement` オブジェクトには、テスト対象のコンポーネントがレンダリングされた DOM 要素が格納されています。`canvasElement` オブジェクトに `within` 関数を呼び出すことで、`findByRole` のようなセレクタ関数を使用できます。

また、ユーザーの操作は `UserEvent` オブジェクトを使用してシミュレートします。

```tsx:InputForm.stories.tsx
import { within, userEvent } from "@storybook/test";

export const SubmitForm: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // フォームの入力欄を取得
    const input = await canvas.findByRole("textbox", { name: "Name" });

    // UserEvent.type はフォームに入力する
    // delay オプションを渡すことで、よりリアルなユーザーの入力をシミュレートできる
    await userEvent.type(input, "John", { delay: 100 });

    // Submit ボタンを取得
    const submit = await canvas.findByRole("button", { name: "Submit" });
    // Submit ボタンをクリック
    await userEvent.click(submit);

    // フォームが送信された後、入力された名前が表示されることを確認
    // findByXxx は要素が見つからない場合エラーをスローするため、
    // 期待した結果が見つからない場合にはテストが失敗する
    await canvas.findByText("Hello, John!");
  },
};
```

テストを実行すると、2 つのテストが実行されていることが確認できます。

```bash
npm run test

 RERUN  src/InputForm.stories.tsx x1

 ✓ |storybook| src/InputForm.stories.tsx (2)
   ✓ Primary
   ✓ Submit Form

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  17:30:06
   Duration  162ms
```

テストが失敗した場合、デバッグのために Storybook のリンクが表示されます。

```bash
 ❯ |storybook| src/InputForm.stories.tsx (2) 1150ms
   ✓ Primary
   × Submit Form 1077ms

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  |storybook| src/InputForm.stories.tsx > Submit Form
TestingLibraryElementError:
Click to debug the error directly in Storybook: http://localhost:6006/?path=/story/inputform--submit-form&addonPanel=storybook/interactions/panel
```

実際に画面上でテストの実行結果を確認したい場合には、Storybook を起動してブラウザで確認できます。

```bash
npm run storybook
```

「Interaction」タブを選択すると、どのような操作が行われたかを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6mOVtjPoa1Md0Bb8Z7ToUh/1ba10c2d4d6e59b0317ffd136c9d7627/__________2024-10-05_17.37.57.png)

### テストランナーとの比較

Storybook の [テストランナー](https://storybook.js.org/docs/writing-tests/test-runner) を使用した場合でも、同様にストーリー単位で `play()` 関数のテストブラウザ上で実行可能でした。Vitest を用いたテストとよくに似ていますが、テストランナーによる方法では別のプロセスで Storybook が起動されている必要です。

一方 Vitest では自動でストーリーをテストに変換するため、Storybook を起動している必要がないという利点があります。

## API をモックしたテスト

より現実に近いコンポーネントをテストするために、先ほど作成して `<InputForm>` コンポーネントでフォームが送信された時に API を呼び出すように変更してみましょう。API のレスポンスとして `{ message: string }` を返すので、このメッセージを表示するように変更します。

```tsx:InputForm.tsx {14-31}
import React, { useState } from "react";

export const InputForm = () => {
  const [name, setName] = useState("");
  const [submit, setSubmit] = useState(false);
  const [message, setMessage] = useState("");
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmit(true);
    try {
      const response = await fetch("/register", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error occurred");
    } finally {
      setSubmit(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        type="text"
        onChange={handleInput}
        value={name}
      />
      <button type="submit">Submit</button>
      {submit ? <p>Loading...</p> : <p>{message}</p>}
    </form>
  );
};
```

このコンポーネントをテストするためには、API のレスポンスをモックする必要があります。Storybook は [msw](https://mswjs.io/) と連携して、ストーリー内で API のモックを行うことができます。

まずは `msw` のアドオンをインストールします。

```bash
npm i msw msw-storybook-addon -D
```

続いて以下のコマンドで `msw` の service worker を生成します。

```bash
npx msw init public/
```

最後に `./storybook/preview.ts` に `msw` の設定を追加します。

```ts:./storybook/preview.ts {2, 4-5, 16}
import type { Preview } from "@storybook/react";
import { initialize, mswLoader } from "msw-storybook-addon";

// Initialize MSW
initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
```

この設定により、Storybook のストーリーごとに API のモックを行うことができます。`InputForm` コンポーネントのテストを記述しましょう。`parameters.msw.handlers` に API のモックを定義します。

```tsx:InputForm.stories.tsx
export const SubmitForm: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post<object, { name: string }>(
          "/register",
          async ({ request }) => {
            const json = await request.json();
            // 現実のサーバーのレスポンスに近い遅延を追加
            await delay();
            return HttpResponse.json({
              message: `Hello, ${json.name}`,
            });
          }
        ),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox", { name: "Name" });

    await userEvent.type(input, "John", { delay: 100 });

    const submit = await canvas.findByRole("button", { name: "Submit" });
    await userEvent.click(submit);

    await canvas.findByText("Loading...");

    await canvas.findByText("Hello, John");
  },
};
```

同様に、API のエラー時のテストも記述できます。

```tsx:InputForm.stories.tsx
export const SubmitFormError: Story = {
  parameters: {
    msw: {
      handlers: [
        http.post<object, { name: string }>("/register", async () => {
          await delay();
          return HttpResponse.json(
            {
              message: "internal server error",
            },
            {
              status: 500,
            }
          );
        }),
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = await canvas.findByRole("textbox", { name: "Name" });

    await userEvent.type(input, "John", { delay: 100 });

    const submit = await canvas.findByRole("button", { name: "Submit" });

    await userEvent.click(submit);

    await canvas.findByText("Loading...");

    await canvas.findByText("Error occurred");
  },
};
```

## まとめ

- Storybook 8.3 以降では、Vitest プラグインを使用することでストーリーをテストするためのテストランナーとして Vitest を使用できる
- Vitest を使用することで、ブラウザモードを有効にして Storybook のテストを高速に実行でき、設定をシンプルに保つことができる
- すべての `.stories.tsx` ファイルがテスト対象となり、ストーリーがテストされる。テスト対象として除外したい場合には、`tag` オプションを使用できる
- テストが何も記述されていない場合には、ストーリーがレンダリングされるかどうかを確認するスモークテストが実行される
- `play` 関数を使用してストーリー内でユーザー操作をシミュレートしたテストを記述できる
- `msw` を使用して API のモックを行い、コンポーネントが API との通信を行う際のテストを行うことができる

## 参考

- [Storybook 8.3](https://storybook.js.org/blog/storybook-8-3/)
- [Storybook Vitest plugin](https://storybook.js.org/docs/writing-tests/vitest-plugin)
- [\[RFC\] Storybook Vitest integration · storybookjs/storybook · Discussion #28386](https://github.com/storybookjs/storybook/discussions/28386)
- [Play function](https://storybook.js.org/docs/writing-stories/play-function)
- [Component testing in Storybook](https://storybook.js.org/blog/component-testing/)
- [Browser Mode | Guide | Vitest](https://vitest.dev/guide/browser/)
