---
id: 52SVAX8y8jAchlZbb9sHp
title: "新しい UI テストの手法を提供するテストライブラリ SafeTest"
slug: "safetest-a-test-library-offering-a-new-ui-testing-approach"
about: "SafeTest は Playwright と Jest/Vitest を組み合わせた UI テストライブラリです。特定のライブラリに依存せず、React, Vue, Angular, Svelte などのフレームワークに対応しています。SafeTest は単体テストと Playwright を使った E2E テストの手法を組み合わせることで、それぞれの手法が抱える欠点を補うことを目指しています。"
createdAt: "2024-02-25T13:14+09:00"
updatedAt: "2024-02-25T13:14+09:00"
tags: ["テスト", "playwright", "Jest", "Vitest", "SafeTest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5WK06VVQT5RTHDCT00Savz/061569f5f920b0bb314547c03ca3b25e/movie-theater_9205.png"
  title: "映画館のイラスト"
selfAssessment: null
published: true
---
[SafeTest](https://github.com/kolodny/safetest) は Playwright と Jest/Vitest を組み合わせた UI テストライブラリです。特定のライブラリに依存せず、React, Vue, Angular, Svelte などのフレームワークに対応しています。

従来のフロントエンドのテストの手法は [Testing Library](https://testing-library.com/) を使った単体テストと [Cypress](https://www.cypress.io/) や [Playwright](https://playwright.dev/) を使った E2E テストの 2 つの手法が主に用いられていました。それぞれの手法にはそれぞれの長所と短所があります。

- 単体テスト

  - 👍 jsdom のようなブラウザをエミュレートした環境でテストを実行するため、テストが高速に実行できる
  - 👍 コンポーネント単位の細かい粒度でのテストが実行できる
  - 👍 コンポーネントが依存する関数のモックが容易で、モックに対するアサーションも可能
  - 👎 本物のブラウザでなければ発見できないバグを見逃す恐れがある

- E2E テスト
  - 👍 本物のブラウザでテストを実行できる。`viewport` などのエミュレートも可能、複数のブラウザでテストを実行でき、ブラウザ特有のバグを発見できる
  - 👍 スクリーンショットやビデオ録画などの高度な機能
  - 👎 テストの実行時間が遅い
  - 👎 基本的にページ単位でしかテストを実行できないので、デバッグは難しい
  - 👎 ネットワークリクエストを置き換える以外の方法でモックが困難

SafeTest は単体テストと Playwright を使った E2E テストの手法を組み合わせることで、それぞれの手法が抱える欠点を補うことを目指しています。SafeTest は以下のような機能を提供しています。

- Playwright の主要な機能
  - [Page](https://playwright.dev/docs/api/class-page) オブジェクトを使った要素の取得、クリックなどの操作
  - [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot) によるスクリーンショットの比較
  - [Video recording](https://playwright.dev/docs/videos)
  - [Trace viewer](https://playwright.dev/docs/trace-viewer)
  - [Network interception](https://playwright.dev/docs/network)
- [コンポーネント内のロジックのオーバーライド](https://github.com/kolodny/safetest?tab=readme-ov-file#overrides)
- Jest/Vitest 機能の利用
- コンポーネント単位のテスト
- モック・スパイの利用

## インストール

それでは SafeTest を実際に使ってみましょう。ここの例では `create-next-app` を使って作成した Next.js のプロジェクトを対象に SafeTest を導入します。

まずは以下のコマンドで SafeTest をインストールします。

```bash
npm install --save-dev safetest vitest @vitejs/plugin-react
```

SafeTest は内部で Playwright を使用しているため、Playwright もインストールする必要があります。

```bash
npx playwright install
```

`package.json` に以下のスクリプトを追加します。

```json
{
  "scripts": {
    "safetest": "OPT_URL=${OPT_URL:-http://localhost:3000/} vitest --config vite.safetest.config.mts",
    "safetest:ci": "rm -f artifacts.json && OPT_URL=${DEPLOYED_URL} OPT_CI=1 OPT_DOCKER=1 OPT_ARTIFACTS=artifacts.json npm run safetest -- --run --bail=5",
    "safetest:regenerate-screenshots": "OPT_DOCKER=1 npm run safetest -- --run --update",
    "generate-map": "npx safetest generate-import-map app/Bootstrap.tsx app > app/imports.tsx"
  }
}
```

`generate-map` コマンドはテストファイルと `import` 文をマッピングするファイルを自動で生成するためのコマンドです。SafeTest では本番環境に影響を与えないために動的にファイルをロードする必要があるので、テストファイルを作成するたびにこのコマンドを実行する必要があります。

`safetest` コマンドでテストを実行します。`OPT_URL` 環境変数を設定して `vitest` コマンドを実行しています。`OPT_URL` に渡す値は開発サーバーを起動した際の URL です。Vitest を使用する場合には、`vite.safetest.config.mts` という名前の設定ファイルを作成する必要があります。

```ts:vite.safetest.config.mts
import { defineConfig } from 'vite';
import base from './vite.config.mjs';

// https://vitejs.dev/config/
export default defineConfig({
  ...base,
  test: {
    globals: true,
    testTimeout: 30000,
    reporters: ['basic', 'json'],
    outputFile: 'results.json',
    setupFiles: ['setup-safetest'],
    include: ['**/*.safetest.?(c|m)[jt]s?(x)'],
    poolOptions: {
      threads: {
        singleThread: true,
      },
      forks: {
        singleFork: true,
      },
    },
    inspect: process.env.CI ? false : true,
  },
});
```

また Vitest 向けの設定ファイルとして `vite.config.mts` ファイルも作成します。

```ts:vite.config.mts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
```

最後に `setup-safetest.ts` という名前のファイルを作成し、以下のような内容を追加します。

```ts:setup-safetest.ts
import { setup } from "safetest/setup";

setup({
  // eslint-disable-next-line no-undef
  bootstrappedAt: require.resolve("./app/layout.tsx"),
  ciOptions: {
    usingArtifactsDir: "artifacts",
  },
});
```

`bootstrappedAt` はアプリケーションのエントリーポイントを指定します。この値はライブラリやフレームワークによって異なるため、適切な値を指定してください。

## アプリケーションのブートストラップ

SafeTest はアプリケーションの起動時にテスト用のフックをインジェクションするという手法を採用しています。なお、テスト用のフックはテストの実行ときのみ動的にロードされるため、本番環境のアプリケーションに影響を与えることはありません。このフックにより、アプリケーションのロジックのオーバーライドや Playwright の機能の利用を可能としています。

そのためアプリケーションのエントリーポイントでテスト用のフックがロードされるようにコードを追加する必要があります。フレームワークやバンドラーによって方法は異なります。ここでは Next.js の場合の例を示します。

```tsx:app/Bootstrap.tsx
'use client';

import { Bootstrap as SafetestBootstrap } from 'safetest/react';
import { imports } from './imports';

export const Bootstrap = (props: React.PropsWithChildren) => (
  <SafetestBootstrap imports={imports}>{props.children}</SafetestBootstrap>
);
```

`imports` ファイルは `npm run generate-map` コマンドを実行することで自動で生成されます。このコマンドを試してみるために、`app/page.safetest.ts` という名前のテストファイルを作成しましょう。

```ts:app/page.safetest.ts
import { describe, it, expect } from 'safetest/vitest';

describe('app test', () => {
  it("1 + 1 = 2", () => {
    expect(1 + 1).toBe(2);
  });
});
```

`npm run generate-map` コマンドを実行すると、以下のようなコードが自動で追加されます。先ほど作成したファイルの名前で、モジュール名をキーとした `import` 文が追加されます。

```ts:app/imports.tsx
export const imports = {
  './page.safetest': () => import('./page.safetest'),
};
```

`<Bootstrap>` コンポーネントはアプリケーションのエントリーポイントで呼び出されます。Next.js の場合は `app/layout.tsx` です。

```tsx:app/layout.tsx {2, 12}
import "./globals.css";
import { Bootstrap } from "./Bootstrap";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en">
    <body className={inter.className}>
      <Bootstrap>{children}</Bootstrap>
    </body>
  </html>
  );
}
```

## 最初のテストの作成

SafeTest のセットアップが完了したので、テストを作成してみましょう。以下のテストはアプリケーションのルートページ全体が正しく表示されるかどうかをテストするものです。

```ts:app/page.safetest.tsx
import { describe, it, expect } from "safetest/jest";
import { render } from "safetest/react";

describe("App", () => {
  it("renders without crashing", async () => {
    const { page } = await render();
    await expect(
      page.getByText("Get started by editing app/page.tsx")
    ).toBeVisible();

    expect(await page.screenshot()).toMatchImageSnapshot();
  });
});
```

`render()` 関数はアプリケーションのエントリーポイントからページ全体をレンダリングします。

`render()` 関数が返す `page` は Playwright の [Page](https://playwright.dev/docs/api/class-page) オブジェクトです。`page.getByText()` 関数で特定の要素が存在するかどうかを確認しています。

`expect(await page.screenshot()).toMatchImageSnapshot()` では、スクリーンショットを撮影し、以前に撮影したスクリーンショットと比較しています。スクリーンショットに差分がある場合にはテストが失敗します。

このようにテストの API は Playwright で使われているものと同じものが使えます。基本的には Playwright のドキュメントを参照しながらテストを書くようになるでしょう。

## テストの実行

テストを実行する際には、必ずアプリケーションを起動しておく必要があります。以下のコマンドでまずはアプリケーションを起動します。

```bash
npm run dev
```

別ターミナルで `npm run safetest` コマンドを実行すると、テストが実行されます。

```bash
npm run safetest
```

テストが成功すると以下のような結果が表示されます。

```bash
 ✓ app/page.safetest.ts  (1 test) 6457ms

  Snapshots  1 written
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  15:16:53
   Duration  6.82s (transform 22ms, setup 142ms, collect 14ms, tests 6.46s, environment 0ms, prepare 140ms)

JSON report written to safetest-example/results.json
```

`page.screenshot()` 関数によって撮影されたスクリーンショットは `__image_snapshots__` ディレクトリ保存されます。

## コンポーネントのテスト

`page()` 関数の引数を指定しない場合には、アプリケーションのルートコンポーネントをテストすることになります。`render()` 関数の引数にコンポーネントを指定することで、特定のコンポーネントのみをレンダリングしてテストできます。

`app/Counter.tsx` という名前のコンポーネントを作成し、そのコンポーネントをテストしてみましょう。

```tsx:app/Counter.tsx
"use client";
import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(count - 1)}>Decrement</button>
    </div>
  );
};
```

テストファイルとして `app/Counter.safetest.tsx` を作成します。`render()` 関数の引数に `<Counter>` コンポーネントを指定して、`<Counter>` コンポーネントのみがレンダリングされるようにします。

```ts:app/Counter.safetest.tsx
import { describe, it, expect } from "safetest/vitest";
import { render } from "safetest/react";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("should increment and decrement the count", async () => {
    const { page } = await render(<Counter />);
    await expect(page.getByText("0")).toBeVisible();

    await page.getByRole("button", { name: "Increment" }).click();
    await expect(page.getByText("1")).toBeVisible();

    await page.getByRole("button", { name: "Decrement" }).click();
    await expect(page.getByText("0")).toBeVisible();
  });
});
```

新しいテストファイルを作製した場合には、まず `npm run generate-map` コマンドを実行して `app/imports.tsx` を更新する必要があります。

```ts:app/imports.tsx
export const imports = {
  './page.safetest': () => import('./page.safetest'),
  './Counter.safetest': () => import('./Counter.safetest'),
};
```

`npm run safetest` コマンドを実行すると、新しいテストが追加されたことが確認できます。

```bash
 ✓ app/Counter.safetest.tsx  (1 test) 1132ms
 ✓ app/page.safetest.ts  (1 test) 808ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  15:30:37
   Duration  2.34s (transform 26ms, setup 147ms, collect 25ms, tests 1.94s, environment 0ms, prepare 166ms)
```

## モックとスパイの利用

コンポーネントの Props としてモック関数を渡すことで、その関数が呼び出されたかどうかをテストできます。`<Button>` コンポーネントをテストする場合を例に挙げます。ボタンがクリックされた時に Props として渡した `onClick` 関数が呼び出されるかどうかをテストします。

```tsx:app/Button.safetest.tsx {7}
import { describe, it, expect, browserMock } from "safetest/vitest";
import { render } from "safetest/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should call the onClick handler", async () => {
    const onClick = browserMock.fn();
    const { page } = await render(<Button onClick={onClick}>Click me</Button>);
    await page.getByRole("button").click();
    expect(await onClick).toHaveBeenCalled();
  });
});
```

`browserMock.fn()` 関数を使うことで、モック関数を作成できます。このモック関数は Jest/Vitest のモック関数と同じように使えます。`expect(await onClick).toHaveBeenCalled()` でモック関数が呼び出されたかどうかをテストしています。

## Node.js とブラウザ間の通信

SafeTest は Node.js とブラウザの両方の環境で同時に実行されます。Node.js とブラウザ間を通信することで、コンポーネントをレンダリングした後に Props で渡す値を変更するなどが可能です。上記の例で挙げた `browserMock.fn()` 関数を渡してアサーションすることも、Node.js とブラウザ間の通信を利用している機能の 1 つです。

いくつかの複雑なユースケースを解決するために、`bridge()` 関数が提供されています。例として、郵便番号が入力された時にその値を元に API をコールして住所を自動入力するというフォームを考えてみましょう。API をコールする関数は Props として渡されるとします。

```tsx:app/AddressForm.safetest.tsx
"use client";

import { useState } from "react";

type Props = {
  /** API をコールして住所を取得する関数 */
  getAddress: (postCode: string) => Promise<string>;
};

export const AddressForm = ({ getAddress }: Props) => {
  const [postCode, setPostCode] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleClick = async () => {
    try {
      setError("");
      const address = await getAddress(postCode);
      setAddress(address);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <form>
      <label htmlFor="postCode">Post Code</label>
      <input
        id="postCode"
        type="text"
        value={postCode}
        onChange={(e) => setPostCode(e.target.value)}
      />
      <button type="button" onClick={() => handleClick()}>
        Get Address
      </button>

      {error && <p>{error}</p>}

      <label htmlFor="address">Address</label>
      <input
        id="address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </form>
  );
};
```

テストコードに移りましょう。`getAddress` 関数を Props として渡す時、あらかじめ宣言された変数の値を返すようにします。

`render()` 関数の戻り値には `bridge()` 関数が含まれており、この関数を使って Node.js とブラウザ間の通信を行います。`bridge()` 内で変数を変更することで、エラーが発生した場合の挙動をテストできます。

```tsx:app/AddressForm.safetest.tsx {10, 30}
import { describe, it, expect, browserMock } from "safetest/vitest";
import { render } from "safetest/react";
import { AddressForm } from "./AddressForm";

describe("AddressForm", () => {
  it("should fill out address when get address is clicked", async () => {
    let error = false;
    let address = "123 Fake St";

    const { page, bridge } = await render(
      <AddressForm
        getAddress={async () => {
          if (error) {
            throw new Error("failed to get address");
          }
          return address;
        }}
      />
    );

    // ボタンをクリックした時、取得した住所がフォームに入力されることをテスト
    await page.getByRole("textbox", { name: "Post Code" }).fill("12345");
    await page.getByRole("button", { name: "Get Address" }).click();
    await page.waitForLoadState();
    await expect(page.getByRole("textbox", { name: "Address" })).toHaveValue(
      address
    );

    // エラーが発生した時、エラーメッセージが表示されることをテスト
    bridge(() => (error = true));
    await page.getByRole("button", { name: "Get Address" }).click();
    await expect(page.getByText("failed to get address")).toBeVisible();
  });
});
```

## オーバーライド

ネットワークリクエストや、`new Date()` など外部に依存する関数を使用しているコンポーネントをテストしたい場合があります。SafeTest ではこのような一部の関数をオーバーライドすることですることで、コンポーネントのテストを実行します。

例として、TODO リストを表示するコンポーネントをテストする場合を考えてみましょう。このコンポーネントでは `fetch` 関数を使用して外部の API からデータを取得しています。

```tsx:app/TodoList.tsx
"use client";
import { useEffect, useState } from "react";

export type Todo = {
  id: number;
  title: string;
};

type Result =
  | {
      state: "loading";
    }
  | {
      state: "error";
      message: string;
    }
  | {
      state: "success";
      todos: Todo[];
    };


const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");

  if (!response.ok) {
    return Promise.reject(new Error("Failed to fetch todos"));
  }
  return response.json();
};


const useTodoList = (): Result => {
  const [result, setResult] = useState<Result>({ state: "loading" });

  useEffect(() => {
    fetchTodos()
      .then((todos) => {
        setResult({ state: "success", todos });
      })
      .catch((e) => {
        setResult({ state: "error", message: e.message });
      });
  }, []);

  return result;
};

export const TodoList = () => {
  const result = useTodoList();
  return (
    <>
      {result.state === "loading" && <p>Loading...</p>}
      {result.state === "error" && <p>{result.message}</p>}
      {result.state === "success" && (
        <ul>
          {result.todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
        </ul>
      )}
    </>
  );
};
```

関数のオーバーライドを行うためには、アプリケーションのコードを変更する必要があります。オーバーライドをしたい関数を対象に、`createOverride` 関数を使ってオーバーライド可能な関数を作成します。

`createOverride()` 関数によって作成された関数は、`.useValue()` メソッドで値を取り出すことになります。

```tsx:app/TodoList.tsx {7, 11, 14}
import { createOverride } from "safetest/react";

const fetchTodos = async (): Promise<Todo[]> => {
  // ...
};

export const FetchTodos = createOverride(fetchTodos);

const useTodoList = (): Result => {
  const [result, setResult] = useState<Result>({ state: "loading" });
  const fetchTodo = FetchTodos.useValue();

  useEffect(() => {
    fetchTodo()
      .then((todos) => {
        setResult({ state: "success", todos });
      })
      .catch((e) => {
        setResult({ state: "error", message: e.message });
      });
  }, [fetchTodo]);

  return result;
};
```

テストコード内では `React.Context` と同じ要領で `<FetchProvider.Override>` コンポーネントでテスト対象のコンポーネントをラップします。関数の実装を `with` プロパティに渡すことでオーバーライドされます。

```tsx:app/TodoList.safetest.tsx {12, 23-25}
import { describe, it, expect } from "safetest/vitest";
import { render } from "safetest/react";
import { TodoList, FetchTodos, Todo } from "./TodoList";

describe("TodoList", () => {
  it("should render a list of todos", async () => {
    const todos: Todo[] = [
      { id: 1, title: "Buy milk" },
      { id: 2, title: "Walk the dog" },
    ];
    const { page } = await render(
      <FetchTodos.Override with={() => () => Promise.resolve(todos)}>
        <TodoList />
      </FetchTodos.Override>
    );

    await expect(page.getByText("Buy milk")).toBeVisible();
    await expect(page.getByText("Walk the dog")).toBeVisible();
  });

  it("should show an error message when fetching todos fails", async () => {
    const { page } = await render(
      <FetchTodos.Override
        with={() => () => Promise.reject(new Error("Failed to fetch todos"))}
      >
        <TodoList />
      </FetchTodos.Override>
    );

    await expect(page.getByText("Failed to fetch todos")).toBeVisible();
  });
});
```

## まとめ

- SafeTest は Playwright と Jest/Vitest を使った UI テストライブラリ
- 単体テストと E2E テストの手法を組み合わせることで、それぞれの手法が抱える欠点を補うことを目指している
- コンポーネント内のロジックのオーバーライドや Playwright の機能の利用が可能
- `render()` 関数の引数にコンポーネントを指定することで、特定のコンポーネントのみをテストできる
- Props にモック関数を渡すことで、その関数が呼び出されたかどうかをテストできる

## 参考

- [kolodny/safetest](https://github.com/kolodny/safetest)
- [Introducing SafeTest: A Novel Approach to Front End Testing](https://netflixtechblog.com/introducing-safetest-a-novel-approach-to-front-end-testing-37f9f88c152d)
- [safetest/examples/next-app at main · kolodny/safetest](https://github.com/kolodny/safetest/tree/main/examples/next-app)
- [「SafeTest」がすごい ー Netflix内で利用されている、新しいフロントエンドテストライブラリ - TechFeed](https://techfeed.io/entries/65cc0f0f7036d02cdfb92e6b)
