---
id: EfsQJ0kNFfS0cBZ_HcFp3
title: "React.memo でメモ化したコンポーネントはモック関数が使えない"
slug: "react-memo-mocked-component-cannot-use-mock-function"
about: "テストにおいて子コンポーネントをモックしたい場合には通常のテストと同様に jest.mock() を使います。しかし、React.memo() でメモ化したコンポーネントはモック自体には成功するものの、mockImplementation のようなモック関数が使えません。"
createdAt: "2023-07-22T21:15+09:00"
updatedAt: "2023-07-22T21:15+09:00"
tags: ["React", "Jest", "テスト"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5WJgPkui5OJOxaqKgR5PCe/c7a7a415b8a4daf7b318b983f576f05e/food_kebab_18639.png"
  title: "ケパブのイラスト"
audio: null
selfAssessment: null
published: true
---
## TL;DR

メモ化する前のコンポーネントをモックすることで解決できます。

## はじめに

React コンポーネントのテストにおいては、子コンポーネントはなるべくモックしないというプラクティスがあります。なぜなら、フロントエンドのテストはユーザーの視点でテストを書くという原則が広く支持されているからです。ユーザーはモックされたコンポーネントを見ることはありません。

とはいえ、状況に応じては子コンポーネントをモックしてテストを書くほうが適している場合もあります。例えば、スナップショットテストを書く際には子コンポーネントをモックすることでスナップショットファイルのサイズを小さくでき、スナップショットファイルの差分を見やすくなります。他にも、レンダリングに大きなコストが掛かったり、好ましくない副作用があるコンポーネントをモックすることもあるでしょう。

React コンポーネントをモックする際には、通常の関数をモックするのと同じように `jest.mock` を使用します。例えば以下のようなコンポーネントで `<SuperExpensiveComponent />` をモックしたいとします。

```tsx:Counter.tsx
import { useState } from 'react';
import {SuperExpensiveComponent} from './SuperExpensiveComponent';

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <SuperExpensiveComponent />
    </div>
  );
};
```

テストコードは以下のようになります。

```tsx:Counter.test.tsx
import { Counter } from "./Counter";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SuperExpensiveComponent } from "./SuperExpensiveComponent";

// SuperExpensiveComponent をモックする
jest.mock("./SuperExpensiveComponent");
// コンポーネントをモックしたので型定義を追加する
const MockedSuperExpensiveComponent =
  SuperExpensiveComponent as jest.MockedFunction<
    typeof SuperExpensiveComponent
  >;

beforeEach(() => {
  // モックしたコンポーネントの実装
  MockedSuperExpensiveComponent.mockImplementation(() => <div>Mocked</div>);
});

afterEach(() => {
  // テストごとにモックをリセットする
  MockedSuperExpensiveComponent.mockReset();
});

describe("Counter", () => {
  test("レンダリングできる", () => {
    conrender(<Counter />);


  })
  test("カウントアップボタンを押すとカウントが 1 増える", async () => {
    render(<Counter />);

    await userEvent.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByText("Count: 1")).toBeInTheDocument();
  });
});
```

`jest.mock("./SuperExpensiveComponent");` で `<SuperExpensiveComponent />` をモジュールごとモックしています。TypeScript では関数をモックした場合には型定義を追加する必要があります。`const MockedSuperExpensiveComponent = SuperExpensiveComponent as jest.MockedFunction<typeof SuperExpensiveComponent>;` で型定義を追加しています。`beforeEach` ブロック内ではモックしたコンポーネントの実装を定義しています。

## React.memo でメモ化したコンポーネントはモックできない

上記のテストコードは正しく動作していて、開発者はテストの実行に時間がかからなく皆ハッピーです。しばらく経ったある日、カウンターアプリのパフォーマンスが遅すぎると顧客から苦情が入りました。紆余曲折の後、開発者はついに `<SuperExpensiveComponent />` の再レンダリングに時間が掛かっていることに気づきました。そこで、`<SuperExpensiveComponent />` を `React.memo` でメモ化することにしました。目論見通り、カウンターパフォーマンスが改善されたので、大喜びでプルリクエストを提出しました。

```tsx:SuperExpensiveComponent.tsx
import React from "react";

export const _SuperExpensiveComponent = () => {
  const now = Date.now();
  while (Date.now() - now < 1000) {}

  return <div>Hey I'm a super expensive component</div>;
};

export const SuperExpensiveComponent = React.memo(_SuperExpensiveComponent);
```

しかし、すぐに CI が失敗していることに気づきました、変更箇所は `<SuperExpensiveComponent>` をメモ化しただけで機能を変更した記憶は全くありません。CI のログを見ると、以下のようなエラーが出ていました。

```sh
TypeError: MockedSuperExpensiveComponent.mockImplementation is not a function

  14 | beforeEach(() => {
  15 |   // モックしたコンポーネントの実装
> 16 |   MockedSuperExpensiveComponent.mockImplementation(() => <div>Mocked</div>);
      |                                 ^
  17 | });
  18 |
  19 | afterEach(() => {

  at Object.<anonymous> (src/Counter.spec.tsx:16:33)
```

どうやら、`jest.mock` でモックしたはずのコンポーネンがモックに失敗しているようです。

## メモ化する前のコンポーネントをモックする

どうやら `React.memo()` でメモ化したコンポーネントは、モック自体には成功しているものの、`mockImplementation` などのモック関数を使用できないようです。解決策はメモ化する前のコンポーネントをモックすることです。まずはメモ化する前のコンポーネントも `export` するように修正します。

```diff:SuperExpensiveComponent.tsx
  import React from "react";

- const _SuperExpensiveComponent = () => {
+  export const _SuperExpensiveComponent = () => {
    const now = Date.now();
    while (Date.now() - now < 1000) {}

    return <div>Hey I'm a super expensive component</div>;
  };

  export const SuperExpensiveComponent = React.memo(_SuperExpensiveComponent);
```

テストコードはないでは、メモ化する前のコンポーネントを import して型を追加するように修正します。

```diff:Counter.test.tsx
  import { Counter } from "./Counter";
  import { render, screen } from "@testing-library/react";
  import userEvent from "@testing-library/user-event";
- import { SuperExpensiveComponent } from "./SuperExpensiveComponent";
+ import { _SuperExpensiveComponent } from "./SuperExpensiveComponent";

  // SuperExpensiveComponent をモックする
  jest.mock("./SuperExpensiveComponent");

  // コンポーネントをモックしたので型定義を追加する
- const MockedSuperExpensiveComponent =
-   SuperExpensiveComponent as jest.MockedFunction<
-     typeof SuperExpensiveComponent
-   >;
+ const MockedSuperExpensiveComponent = 
+   _SuperExpensiveComponent as jest.MockedFunction<
+     typeof _SuperExpensiveComponent
+   >;

  beforeEach(() => {
    // モックしたコンポーネントの実装
    MockedSuperExpensiveComponent.mockImplementation(() => <div>Mocked</div>);
  });

  afterEach(() => {
    // テストごとにモックをリセットする
    MockedSuperExpensiveComponent.mockReset();
  });
```

## 参考

- [reactjs - How to mock a React.MemoExoticComponent (React.memo) with jest using typescript - Stack Overflow](https://stackoverflow.com/questions/70798843/how-to-mock-a-react-memoexoticcomponent-react-memo-with-jest-using-typescript)
