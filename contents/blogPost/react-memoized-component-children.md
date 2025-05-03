---
id: ZIKogACZlrNAxuysl3IyM
title: "【React】メモ化したコンポーネントに children を渡すと効果がなくなる"
slug: "react-memoized-component-children"
about: "React.memo は Props が変更されないかぎり、コンポーネントを再レンダリングしないようにする関数です。この関数はコンポーネントの余分なレンダリングを防ぎ、パフォーマンスを向上させる目的で使用されます。しかし、React.memo の使い方を誤ると意図しない再レンダリングが発生してしまうことがあります。ここではメモ化したコンポーネントに children を渡すと効果がなくなるというケースについて説明します。"
createdAt: "2023-08-13T13:25+09:00"
updatedAt: "2023-08-13T13:25+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/26v42ghVMvg6PeRZNiIeyP/03875423c434550a279b50c07f055663/food_takotaki_illust_3428.png"
  title: "たこ焼きのイラスト"
audio: null
selfAssessment: null
published: true
---
`React.memo` は Props が変更されないかぎり、コンポーネントを再レンダリングしないようにする関数です。この関数はコンポーネントの余分なレンダリングを防ぎ、パフォーマンスを向上させる目的で使用されます。

以下の例を見てみましょう。`<SuperSlowComponent>` は同期的に処理をブロッキングしており、レンダリングに時間がかかるようになっています。`<input>` に文字を入力するたびに `<SuperSlowComponent>` が再レンダリングされるため、文字の入力がもたつく感じを実感できます。

```tsx
import { useState } from "react";

const SuperSlowComponent = () => {
  const heavyProcess = () => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }
  };

  heavyProcess();
  console.log("rendered");

  return (
    <div>
      <div>super slow component</div>
    </div>
  );
};

const App = () => {
  const [text, setText] = useState("");

  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <SuperSlowComponent />
    </div>
  );
};

export default App;
```

https://codesandbox.io/p/sandbox/keen-gauss-nhcljv?file=%2Fsrc%2FApp.tsx%3A30%2C20

`<SuperSlowComponent>` は Props が変更されないので、`React.memo` を使ってメモ化できます。`React.memo` はコンポーネントをラップすることで、コンポーネントをメモ化します。

```tsx
import React, { useState } from "react";

const SuperSlowComponent = () => {
  const heavyProcess = () => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }
  };

  heavyProcess();
  console.log("rendered");

  return (
    <div>
      <div>super slow component</div>
    </div>
  );
};

const MemorizedComponent = React.memo(SuperSlowComponent);

const App = () => {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MemorizedComponent />
    </div>
  );
};

export default App;
```

https://codesandbox.io/p/sandbox/vigilant-smoke-9dd7xw?file=%2Fsrc%2FApp.tsx%3A30%2C20

`React.memo` によって `<SuperSlowComponent>` はメモ化され、`<input>` に文字を入力しても `<SuperSlowComponent>` は再レンダリングされなくなりました。これにより、文字の入力がもたつく感じがなくなりました。

## メモ化したコンポーネントに children を渡すと効果がなくなる

`React.memo` の使い方について簡単に説明してきました。しかし、`React.memo` の使い方を誤ると意図しない再レンダリングが発生してしまうことがあります。ここではメモ化したコンポーネントに children を渡すと効果がなくなるというケースについて説明します。

以下の例は上記の例で説明した `<MemorizedComponent>` に `children` を渡すように変更を加えたものです。確かに、文字が入力されるたびに `<SuperSlowComponent>` が再レンダリングされてしまっていることがわかります。

```tsx
import React, { useState } from "react";

const SuperSlowComponent = ({ children }) => {
  const heavyProcess = () => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }
  };

  heavyProcess();
  console.log("rendered");

  return <div>{children}</div>;
};

const MemorizedComponent = React.memo(SuperSlowComponent);

const App = () => {
  const [text, setText] = useState("");
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MemorizedComponent>
        <div>Hello 👋</div>
      </MemorizedComponent>
    </div>
  );
};

export default App;
```

https://codesandbox.io/p/sandbox/angry-mclean-4fm6c4?file=%2Fsrc%2FApp.tsx%3A30%2C20

なぜメモ化したコンポーネントに `children` を渡すと Props が変更されていないのにも関わらず再レンダリングされてしまうのでしょうか？1 つづつ順を追って説明していきます。

### `React.memo` は `Object.is` を使って Props の変更を検知する

`React.memo` の基本は、前回のレンダリング時と Props が変更されている検知し、すべての Props が前回と同一であるなら再レンダリングをスキップするというものです。Props が前回と同一であるかどうかを判定するために [Object.is](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Object/is) が使われています。`Object.is` は `===` と同じように値の比較を行いますが、`===` とは異なり `Object.is(NaN, NaN)` は `true` となります。

```js
Object.is(1, 1); // true
Object.is(1, "1"); // false
Object.is(NaN, NaN); // true
```

ここで肝となるのは、`Object.is` はオブジェクトの比較においては参照の比較を行うということです。つまり、以下のようなコードでは `Object.is` は常に `false` を返します。

```js
const obj1 = { a: 1 };
const obj2 = { a: 1 };
Object.is(obj1, obj2); // false
Object.is(obj1, obj1); // true
```

これを React において Props にオブジェクトを渡す場合に当てはめてみましょう。以下のように `<MemorizedComponent>` に `obj` というオブジェクトを渡しています。

```tsx
const App = () => {
  const [text, setText] = useState("");
  const obj = { a: 1 };
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MemorizedComponent obj={obj} />
    </div>
  );
};
```

`<input>` に対する文字の入力が行われるたびに App コンポーネントが再レンダリングされます。再レンダリングが行われる時、`const obj = { a: 1 }` の部分が実行され、`obj` は毎回新しいオブジェクトを参照するようになります。つまり、`<MemorizedComponent>` に渡される `obj` は毎回新しいオブジェクトを参照するようになります。`<MemorizedComponent>` は `obj` が毎回新しいオブジェクトを参照するようになったので、Props が変更されたと判定され、再レンダリングが行われてしまうのです。

この状況の解決策は、`obj` を `useMemo` でメモ化することです。`useMemo` は依存配列の要素のいずれかの値が変更された場合のみ値が再計算されます。以下の例では依存配列に空の配列を渡しているので、`obj` は最初の一度だけ計算され、以降は再レンダリングされたとしても、同じオブジェクトを参照するようになります。

これにより、`<MemorizedComponent>` に渡される `obj` は毎回同じオブジェクトを参照するようになり、Props が変更されたと判定されることがなくなり、再レンダリングが行われなくなります。

```tsx
const App = () => {
  const [text, setText] = useState("");
  const obj = useMemo(() => ({ a: 1 }), []);
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MemorizedComponent obj={obj} />
    </div>
  );
};
```

### `children` はレンダープロップの特殊な構文である

レンダープロップとは Props を通じて JSX 要素をコンポーネントに渡すことです。例えば、ダイアログに対してヘッダーやフッターを「スロット」のように挿入したい場合、レンダープロップを使用するのが効果的です。

```tsx
const Dialog = ({ header, footer, children }) => {
  return (
    <dialog>
      <header>{header}</header>
      <div>{children}</div>
      <footer>{footer}</footer>
    </dialog>
  );
};

const App = () => {
  return (
    <Dialog
      header={<h1>Header</h1>}
      footer={<button onClick={() => {}}>OK</button>}
    >
      <p>Content</p>
    </Dialog>
  );
};
```

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

`children` はあたかも通常の HTML のように子要素を挿入するために使用される構文ですが、実際にはレンダープロップの特殊な構文に過ぎないのです。つまり、以下のような `children` の記述方法は：

<!-- textlint-enable -->

```tsx
<Dialog>
  <p>Content</p>
</Dialog>
```

以下の記述と同等であるということです。

```tsx
<Dialog children={<p>Content</p>} />
```

ここで冒頭の例に戻ってみましょう。一見すると、`<MemorizedComponent>` には一切の Props が渡されていないように見えます。そのため、親コンポーネントが再レンダリングされる前後で Props は変更されるはずがないと考えていました。しかし、実際には `children` は Props として渡されているのと同じなのです。

`<MemorizedComponent>` の `children` には `<div>Hello 👋</div>` を渡していました。これは JSX による記述ですが、実際には以下のように `React.createElement` の呼び出しに変換されます。

```js
React.createElement("div", null, "Hello 👋");
```

少々簡略化されていますが、`React.createElement` は以下のようなオブジェクトを返します。

```js
{
  type: "div",
  props: {
    children: "Hello 👋",
  },
}
```

ここまで来たら、もうおわかりでしょうか？`<MemorizedComponent>` には `children` という Props が渡されていて、その値は `React.createElement` によって生成されたオブジェクトです。親コンポーネントが再レンダリングされるたびに新しいオブジェクトが生成されるので、`<MemorizedComponent>` に渡される `children` も毎回新しいオブジェクトを参照するようになります。そのため、`<MemorizedComponent>` は Props が変更されたと判定され、再レンダリングが行われてしまうのです。

以下の例は、`const obj = { a: 1 };` を `<MemorizedComponent>` の Props として渡した例で見覚えがあるでしょう。

```tsx
const App = () => {
  const [text, setText] = useState("");
  const obj = React.createElement("div", null, "Hello 👋");
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MemorizedComponent children={obj} />
    </div>
  );
};
```

これがメモ化したコンポーネントに `children` を渡すと再レンダリングが行われてしまう理由です。

## メモ化したコンポーネントに `children` を渡すときの解決策

それでは、メモ化したコンポーネントに `children` を渡したときに再レンダリングされないようにするにはどうすればよいのでしょうか？解決策はオブジェクトを Props として渡す場合と同じです。`children` に渡す要素を `useMemo` でメモ化するのです。

```tsx
import React, { useState, useMemo } from "react";

const SuperSlowComponent = ({ children }) => {
  const heavyProcess = () => {
    let i = 0;
    while (i < 1000000000) {
      i++;
    }
  };

  heavyProcess();
  console.log("rendered");

  return <div>{children}</div>;
};

const MemorizedComponent = React.memo(SuperSlowComponent);

const App = () => {
  const [text, setText] = useState("");
  const child = useMemo(() => <div>Hello 👋</div>, []);
  return (
    <div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <MemorizedComponent>{child}</MemorizedComponent>
    </div>
  );
};

export default App;
```

https://codesandbox.io/p/sandbox/weathered-moon-nskvc8?file=%2Fsrc%2FApp.tsx%3A15%2C3

## まとめ

- メモ化したコンポーネントに `children` を渡すと、再レンダリングが行われてしまう
- `children` に渡す要素を `useMemo` でメモ化することで、再レンダリングを防ぐことができる
