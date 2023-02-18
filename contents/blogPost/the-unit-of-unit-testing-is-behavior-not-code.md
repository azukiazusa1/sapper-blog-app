---
id: 7x8XdvoLhYbhcrb0inxAfL
title: "単体テストの単位はコードではなく振る舞いである"
slug: "the-unit-of-unit-testing-is-behavior-not-code"
about: "単体テストの目的は、ソフトウェア開発プロジェクトを持続可能なものにすることです。この目的を達成するための単体テストの機能の 1 つにリファクタリングに対する耐性が上げられます。これは内部のコードを変更した前後でも、外部の振る舞いから見た振る舞いが壊れていないことを保証してくれる度合いです。この耐性が高ければ、開発者は安全にコードを変更できます。  この記事では、単体テストをコード単位で書いた場合と振る舞い単位で書いた場合をそれぞれ提示して、リファクタリングに対する耐性がどのように異なるのかを見ていきます。"
createdAt: "2023-01-08T00:00+09:00"
updatedAt: "2023-01-08T00:00+09:00"
tags: ["テスト", "React", "Vitest"]
published: true
---
単体テストの目的は、ソフトウェア開発プロジェクトを持続可能なものにすることです。この目的を達成するための単体テストの機能の 1 つにリファクタリングに対する耐性が上げられます。これは内部のコードを変更した前後でも、外部の振る舞いから見た振る舞いが壊れていないことを保証してくれる度合いです。この耐性が高ければ、開発者は安全にコードを変更できます。

この記事では、単体テストをコード単位で書いた場合と振る舞い単位で書いた場合をそれぞれ提示して、リファクタリングに対する耐性がどのように異なるのかを見ていきます。

## テスト対象のコード例

コード例として、Presenter / Container パターンにより実装された Counter アプリを使用します。ここでは以下の 3 つのレイヤーが登場します。
- hooks:主に状態管理などのロジック操作を行う
- Container：複数の hooks を1つにまとめて、取得したデータを Presenter に渡す役割を担う
- Presenter：UI に関心を持ち、受け取った Props をどのように表示するかの役割を担う

実際のコード例を見てみましょう。まずは hooks です。初期値として `initailValue` を引数に受け取り、現在のカウント数（`count`）、カウントを増加させる関数（`increment`）、カウントを減少させる関数（`decrement`) を提供します。

```ts:components/Counter/hooks.ts
import { useState, useCallback } from "react";

export const useCounter = (initailValue: number = 0) => {
  const [count, setCount] = useState(initailValue);
  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  return { count, increment, decrement };
};
```

Container では Props として `initialCount` を受け取り、その値をもとに hooks を呼び出して Presenter に渡しています。Prenter は単に hooks の値を受け渡しているだけで利点があまりないようにも感じられます。

Container を間に挟むメリットは、Storybook などで UI のみを確認したい要な場合に Presenter から完全にロジックを取り除けることです。例えば hooks の中で API をコールしていたり Context に依存していたりすると、データの準備に手間がかかる場合があります。

```tsx:components/Counter/Container.tsx
import { CounterPresenter } from "./Presenter";
import { useCounter } from "./hooks";

type Props = {
  initialCount: number;
};

export const CounterContainer: React.FC<Props> = ({ initialCount }) => {
  const { count, increment, decrement } = useCounter(initialCount);

  return (
    <CounterPresenter
      count={count}
      increment={increment}
      decrement={decrement}
    />
  );
};
```

続いて Presenter です。すべての表示に必要な値を Props から受け取り、ロジックを持たないようにしています。

```tsx:components/Counter/Presenter.tsx
type Props = {
  count: number;
  increment: () => void;
  decrement: () => void;
};

export const CounterPresenter: React.FC<Props> = ({
  count,
  increment,
  decrement,
}) => (
  <div>
    <h1>Counter</h1>
    <p>{count}</p>
    <button onClick={increment}>+</button>
    <button onClick={decrement}>-</button>
  </div>
);
```

それぞれレイヤーのコンポーネントが用意できたました。Counter アプリが実際に動作することを確認してみましょう。`App.tsx` から `<CounterPresenter>` を呼び出します。

```tsx:App.tsx
import "./App.css";
import { CounterContainer } from "./components/Counter/Container";

function App() {
  return (
    <div className="App">
      <CounterContainer initialCount={0} />
    </div>
  );
}

export default App;
```

期待どおりにアプリケーションが動作していることが確認できました。

![+ ボタンをクリックするとカウントが1づつ増えていき、- ボタンをクリックするとカウントが1づつ減る様子](//images.ctfassets.net/in6v9lxmm5c8/16S1aFU9XltWsisr7yPjJq/ac900497ed4b31127b85518056eb458a/Counter-1.gif)

テスト対象のコードが用意できましたので、単体テストのコードを書いていきます。

## コード単位に書かれたテスト

はじめに、単体テストはコードを分割した単位で書いていく方針でやってみます。hooks,Container,Presenter,に対応する 3 つのテストを作成するわけです。

まずは hooks のテストです。hooks 層は単純なロジックだけを持っているためテストを書くにあたって複雑なことをする必要がありません。

```ts:components/Counter.hooks.spec.tsx
import { useCounter } from "./hooks";
import { act, renderHook } from "@testing-library/react";
import { describe, test, expect } from "vitest";

describe("useCounter", () => {
  test("increment 関数を呼ぶと count が 1 増える", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  test("decrement 関数を呼ぶと count が 1 減る", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
    act(() => result.current.decrement());
    expect(result.current.count).toBe(-1);
  });

  test("initailValue を指定すると count の初期値を指定できる", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

続いて Container 層のテストです。Container の役割は Presenter に値を渡すことでありますので、Presenter をモックして期待した値が渡されているかテストします。

```tsx:components/Counter/Container.spec.tsx
import { CounterContainer } from "./Container";
import * as Presenter from "./Presenter";
import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

describe("CounterContainer", () => {
  test("Presenter に Props が渡される", () => {
    const mockPresenter = vi.spyOn(Presenter, "CounterPresenter");
    render(<CounterContainer initialCount={0} />);

    expect(mockPresenter).toHaveBeenCalledWith(
      expect.objectContaining({
        increment: expect.any(Function),
        decrement: expect.any(Function),
        count: 0,
      }),
      {}
    );
  });

  test("initialCount が 10 のとき、count は 10 になる", () => {
    const mockPresenter = vi.spyOn(Presenter, "CounterPresenter");
    render(<CounterContainer initialCount={10} />);

    expect(mockPresenter).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 10,
      }),
      {}
    );
  });
});
```

最後に Presenter 層をテストします。`count` Props の値によって表示される値が変化すること、「+」ボタンをクリックすると `increment` が、「-」ボタンをクリックすると `decrement` がそれぞれ呼ばれることを検査します。

`increment` と `decrement` が呼ばれることを確認するために、これらの関数はモックとして渡します。

```tsx:components/Counter/Presenter.spec.tsx
import "@testing-library/jest-dom";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CounterPresenter } from "./Presenter";

describe("CounterPresenter", () => {
  test("count が 0 のとき、0が表示される", () => {
    const increment = vi.fn();
    const decrement = vi.fn();
    render(
      <CounterPresenter count={0} increment={increment} decrement={decrement} />
    );

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  test("count が 10 のとき、10が表示される", () => {
    const increment = vi.fn();
    const decrement = vi.fn();
    render(
      <CounterPresenter
        count={10}
        increment={increment}
        decrement={decrement}
      />
    );

    expect(screen.getByText("10")).toBeInTheDocument();
  });

  test("+ ボタンがクリックされると、increment が呼ばれる", async () => {
    const increment = vi.fn();
    const decrement = vi.fn();
    render(
      <CounterPresenter count={0} increment={increment} decrement={decrement} />
    );

    await userEvent.click(screen.getByRole("button", { name: "+" }));

    expect(increment).toHaveBeenCalled();
  });

  test("- ボタンがクリックされると、decrement が呼ばれる", async () => {
    const increment = vi.fn();
    const decrement = vi.fn();
    render(
      <CounterPresenter count={0} increment={increment} decrement={decrement} />
    );

    await userEvent.click(screen.getByRole("button", { name: "-" }));

    expect(decrement).toHaveBeenCalled();
  });
});
```

モックを利用することで、それぞれのレイヤーに関心のある事項に絞りテストを実行できました。これはうまくいっているように思えます。このように単体テストにおいてもモックを積極的に利用する考えを支持する人々は「ロンドン学派」と呼ばれています。

テスト対象のコードを細かな粒度で検証できることがロンドン学派のメリットです。また、テストを実行するにあたり複雑な依存関係のセットアップが不要なことも良い点です。Presenter のテストでは 単純な Props として値を渡せばよいため、例えば状態管理ライブラリや Context の複雑なセットアップは不要です。また関数はモックして渡されるので、API クライアントを準備する必要もないでしょう。

しかし、ロンドン学派のテストの手法には重大な欠点も存在します。実装とモックが密結合になることにより、実装の変更に対する耐性が失われることです。テストコードを書く目的の一つとしてコードを変更した後も機能が壊れていないことを確認する役目がありますが、コードの単位でテストを書いている場合には、実装を変更するたびにモックも変更しなければならないのでコードの変更の前後で機能が壊れていないことを保証できなくなります。

実際に先程書いたコードにリファクタリングをしてみてテストコードにどのような影響が及ぶのか確認してみましょう。

### コードをリファクタリングする

簡単なリファクタリングとして、hooks が提供する `increment`,`decrement` 関数名それぞれ `incrementByOne`,`decrementByOne` に名前を変更してみます。

```diff: components/Counter/hooks.tsx
  import { useState, useCallback } from "react";

  export const useCounter = (initailValue: number = 0) => {
    const [count, setCount] = useState(initailValue);
-   const increment  = useCallback(() => setCount(c => c + 1), []);    
-   const decrement  = useCallback(() => setCount(c => c - 1), []);
+   const incrementByOne = useCallback(() => setCount((c) => c + 1), []);
+   const decrementByOne = useCallback(() => setCount((c) => c - 1), []);

-   return { count, increment, decrement };
+   return { count, incrementByOne, decrementByOne };
  };
```

`useCounter` のインターフェースを変更したので、Container と Presenter もそれぞれ変更を加える必要があります。

```diff:components/Counter/Container.tsx
  export const CounterContainer: React.FC<Props> = ({ initialCount }) => {
-   const { count, increment, decrement } = useCounter(initialCount);
+   const { count, incrementByOne, decrementByOne } = useCounter(initialCount);

    return (
      <CounterPresenter
        count={count}
-       increment={increment}
-       decrement={decrement}
+       incrementByOne={incrementByOne}
+       decrementByOne={decrementByOne}
      />
    );
  };
```

```diff:components/Counter/Presenter.tsx
  type Props = {
    count: number;
-   increment: () => void;
-   decrement: () => void;
+   incrementByOne: () => void;
+   decrementByOne: () => void;
  };

  export const CounterPresenter: React.FC<Props> = ({
    count,
-   increment,
-   decrement,
+   incrementByOne,
+   decrementByOne,
  }) => (
    <div>
      <h1>Counter</h1>
      <p>{count}</p>
-     <button onClick={increment}>+</button>
-     <button onClick={decrement}>-</button>
+     <button onClick={incrementByOne}>+</button>
+     <button onClick={decrementByOne}>-</button>
    </div>
  );
```

リファクタリングの鉄則は外部から見た振る舞いを変更しないことです。アプリケーションを触ってみて以前までと動作が変わらないことを確認しておきましょう。

![コードを変更した後も Counter アプリの振る舞いが変わらない様子](//images.ctfassets.net/in6v9lxmm5c8/cglHhg83s8JAZUJlk1mYB/324f67dee82393ae745d575b1b10f628/Counter-2.gif)

簡単にですが、コードを変更した前後で何かが壊れていないことが確認できました。しかし、テストを実行すると多くのケースが失敗してしまいます。外部の振る舞いが変わっていないのも関わらず失敗するテストは偽陽性と呼ばれます。

```sh
$ npm run test

> presernter@0.0.0 test
> vitest

 ❯ src/components/Counter/Presenter.spec.tsx (4)
   ❯ CounterPresenter (4)
     ✓ count が 0 のとき、0が表示される
     ✓ count が 10 のとき、10が表示される
     × + ボタンがクリックされると、increment が呼ばれる
     × - ボタンがクリックされると、decrement が呼ばれる
 ❯ src/components/Counter/hooks.spec.ts (3)
   ❯ useCounter (3)
     × increment 関数を呼ぶと count が 1 増える
     × decrement 関数を呼ぶと count が 1 減る
     ✓ initailValue を指定すると count の初期値を指定できる
 ❯ src/components/Counter/Container.spec.tsx (2)
   ❯ CounterContainer (2)
     × Presenter に Props が渡される
     ✓ initialCount が 10 のとき、count は 10 になる
```

このようにコードの単位テストを書いている場合には、内部の実装を変更するたびにテストコードも同時に修正する必要があります。実装を変更するたびにテストコードを書き直しますので、変更を加えた後もテストコードが通っているのは本当に外部から見た振る舞いが変わっていいないからなのか、それとも現在の状態に合わせてテストコードを書き直したからなのか判断できません。

また実装を変更するたびにテストが必ず失敗する状態となっているので、次第に開発者はテストが失敗することを気にかけなくなっていきます。さらに、リファクタリング前後でテストコードの結果が頼りにならないので、できる限り内部のコードを変更しない方針を選択するようになってしまいます。

### モックを使いすぎていると感じたら危険信号

実装を変更するたびにテストが失敗する原因の一端として、テストコードが内部の実装に詳しすぎることがあげられます。内部でのみ使われている関数のインターフェースが変更されるたびに追従していく必要があるためです。

テストコードが内部の状態を知りすぎている状態はモックを使いすぎている場合によく生まれます。内部でのみ使われる API までモックをしているのはあまり良い状態ではありません。私個人としてはアプリケーションの境界の外側に限りモックを使うべきだと考えています。アプリケーションの境界外側とは、私達の所有しているコードからは状態を制御できないレイヤーを意味します。

例えば、フロントエンドのテストを書く際には Web API はモックされるべきでしょう。さもなければ、フロントエンドのテストコードの中に Wen API の裏側に隠されたデータベースをクリーンアップを行う必要があり、フロントエンドと Web API が密結合となってしまいます。

テストコードに多くのモックが使われてしまうのは、ひとえに単体テストはコードの単位で実行されなければならず、またすべての実装に対してテストを書かなければならないという思い込みがあるからだと考えます。1 つのレイヤーに対して 1 つのテストコードが存在していないと、なんだか悪いことをしている気分になってしまうのです。

ですが実際にレイヤごとに対応するテストを書いていると、それは内部の実装を知りすぎた状態となってしまいます。

内部の実装知りすぎないテストにするためには、アプリケーション振る舞いに注目してテストを書くようにします。つまり 1 つの振る舞いに対して 1 つのテストコードを書くのです。実装に振る舞いに対応したテストコードを書いてみます。

## 振る舞いに注目して書かれたテスト

振る舞いに注目して書かれたテストでは、できる限りモックを使用しません。今回の Counter アプリではアプリケーションの境界の外側に位置するレイヤーは出てこないので、モックを一切使用せずにテストをかけます。

```tsx:components/Counter/Counter.spec.tsx
import "@testing-library/jest-dom";
import { CounterContainer as Counter } from "./Container";
import { describe, test, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";

describe("Counter", () => {
  test("+ ボタンがクリックされると、count が 1 増える", async () => {
    const { getByRole, getByText } = render(<Counter initialCount={0} />);
    expect(getByText("0")).toBeInTheDocument();
    await userEvent.click(getByRole("button", { name: "+" }));
    expect(getByText("1")).toBeInTheDocument();
  });

  test("- ボタンがクリックされると、count が 1 減る", async () => {
    const { getByRole, getByText } = render(<Counter initialCount={0} />);
    expect(getByText("0")).toBeInTheDocument();
    await userEvent.click(getByRole("button", { name: "-" }));
    expect(gtByText("-1")).toBeInTheDocument();
  });

  test("initialCount が 10 のとき、count は 10 になる", async () => {
    const { getByText } = render(<Counter initialCount={10} />);
    expect(getByText("10")).toBeInTheDocument();
  });
});
```

先程の Presenter のテストに少し似ていますが、外部から見たユーザーの視点で書かれています。Presenter のテストでは + ボタンをクリックした時にモック関数が呼ばれているかどうかを検証していました。今回のテストでは + ボタンをクリックすると描画されている内容が変更されるという一連の流れをテストしています。この一連の流れが外部から見た 1 つの振る舞いでこれ以上分解することはできません。

このテストコードの中には先程のテストで出てきた `increment` や `decrement` といった内部の API が出てきません。そのためリファクタリングを実行した前後においても、テストコードに変更を加えずとも変わらず成功し続けています。外部から見た振る舞いは変わらないためです。

## テストコードの価値

振る舞いに注目したテストコードを見た時に、コード単位のテストコードと比較して実行されるテストの数が大きく減っていることに気づかれたかと思われます。以前よりも実行されるテストの数が減っていることについて、不安に感じるかもしれません。

しかし、テストコードは資産ではなく負債であることを忘れてはいけません。テストコードの数が多ければ多いほどコードに対する保守の工数が大きくなります。つまり、単にテストの数が多ければよいわけではないのです。品質の悪いコード（=偽陽性が高いコード）を多く抱えるのは問題となります。

テストコードが不要になったら捨てる決断も必要です。実装のコードがどこからも使われなくなったら消されることはよく行われますが、テストコードを捨てるのはなんだか命綱を捨てていくようなイメージがあり、なかなか踏み出せない現象がよく見られます。

実際には hooks レイヤーに対する直接的なテストは書かれていないのですが、間接的に実行されて検証されています。そのためカバレッジという観点で見ると、テストの数自体は減っていても変わりありません。

## 終わりに

単体テストを書く際には、振る舞いに注目して書くとリファクタリングに対する耐性が高くなることについて触れてきました。

リファクタリングに対する耐性が高いテストであると、開発者はテストコードに対する信頼性を高められ、安全に内部の実装の変更に進められます。

内部の実装を変更すると必ず失敗するテストとがある場合、一度見直してみると良いかも知れません。テストコードは資産ではなく負債であるということを忘れないようにしてください。

今回使用したコード例は以下のレポジトリから参照できます。

https://github.com/azukiazusa1/react-counter-app-testing-example/blob/main/src/components/Counter/Container.tsx

## 参考

- [単体テストの考え方/使い方](https://book.mynavi.jp/ec/products/detail/id=134252)
- [モックは必要悪で、しないにこしたことはない - blog.8-p.info](https://blog.8-p.info/ja/2021/10/12/mock/)
- 

