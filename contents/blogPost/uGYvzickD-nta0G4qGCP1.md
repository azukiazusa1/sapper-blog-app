---
id: uGYvzickD-nta0G4qGCP1
title: "react-to-web-component を使って React コンポーネントを Web Components に変換する"
slug: "react-to-web-component"
about: "@r2wc/react-to-web-component は React コンポーネントを Web Components に変換するためのライブラリです。このライブラリを使用することで、React コンポーネントを任意の HTML 要素として使用することが可能になります。"
createdAt: "2024-10-20T21:06+09:00"
updatedAt: "2024-10-20T21:06+09:00"
tags: ["React", "Web Components"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4nzzaC4dV8JumS0sEBj8cF/fc329a4105bec123124bf31a6effaef6/log-house19113-768x670.png"
  title: "ログハウスのイラスト"
selfAssessment: null

published: true
---

[@r2wc/react-to-web-component](https://) は React コンポーネントを [カスタム要素](https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_custom_elements) に変換するためのライブラリです。このライブラリを使用することで、React コンポーネントを任意の HTML 要素として使用することが可能になります。

## 使い方

例として、以下のような React コンポーネントがあるとします。

```jsx
import React from "react";

export const HelloWorld = () => {
  return <p>Hello, World!</p>;
};
```

`@r2wc/react-to-web-component` を使用して、この React コンポーネントを Web Components に変換するには、以下のように記述します。

```jsx
import r2wc from "@r2wc/react-to-web-component";
import { HelloWorld } from "./HelloWorld";

const HelloWorldComponent = r2wc(HelloWorld);

customElements.define("hello-world", HelloWorldComponent);
```

このコードを実行することで、`<hello-world>` というカスタム要素が作成され、React コンポーネントが Web Components として使用できるようになります。

```html
<hello-world></hello-world>
```

## カスタム要素の属性を受け取る

React コンポーネントが受け取る Props をカスタム要素の属性として受け取ることができます。例として以下の React コンポーネントは、`name` という Props を受け取ります。

```jsx
import React from "react";

export const HelloName = ({ name }) => {
  return <p>Hello, {name}!</p>;
};
```

この React コンポーネントを Web Components に変換するには、`Props` オプションにオブジェクトを渡します。属性名をキー、Props の型を値として指定します。属性の値には以下の型を指定できます。

- `"string"`
- `"number"`
- `"boolean"`
- `"array"`
- `"json"`
- `"function"`

また、キャメルケース（`CamelCase`）の Props は自動でケバブケース（`kebab-case`）に変換されます。

```jsx
import r2wc from "@r2wc/react-to-web-component";
import { HelloName } from "./HelloName";

const HelloNameComponent = r2wc(HelloName, {
  name: "string",
});

customElements.define("hello-name", HelloNameComponent);
```

以下のように `<hello-name>` 要素に `name` 属性を渡すことができます。

```html
<hello-name name="Alice"></hello-name>
```

### 関数型 Props の受け取り

Props の型として `"function"` を指定する場合には、`window` オブジェクト（つまりグローバルスコープ）に関数を登録する必要があります。以下の例では、`onClick` という関数型 Props を受け取る React コンポーネントを Web Components に変換しています。

```jsx
import r2wc from "@r2wc/react-to-web-component";
import { Button } from "./Button";

const ButtonComponent = r2wc(Button, {
  onClick: "function",
});

customElements.define("my-button", ButtonComponent);
```

`onclick` 属性に関数を登録するには、グローバルスコープで関数を定義し、属性の値として関数名を指定します。

```html
<script>
  function handleClick() {
    alert("Hello, World!");
  }
</script>

<my-button on-click="handleClick"></my-button>
```

### children の受け取り

React コンポーネントではよく `children` という Props を使用します。この `children` はコンポーネントの開始タグと終了タグの間に記述された要素を指しており、型としては `React.ReactNode` として扱われます。しかし Web Components に変換した場合には以下のように渡すことはできません。

```html
<!-- bad -->
<my-component>
  <p>Hello, World!</p>
</my-component>
```

代替策の 1 つとして、`children` Props を `string` 型として受け取ることが挙げられます。

```jsx
import r2wc from "@r2wc/react-to-web-component";
import { MyComponent } from "./MyComponent";

const MyComponentComponent = r2wc(MyComponent, {
  children: "string",
});
customElements.define("my-component", MyComponentComponent);
```

この場合は `children` 属性として文字列を渡すことができます。

```html
<my-component children="Hello, World!"></my-component>
```

ただし、この方法では HTML 要素を渡すことができません。もう 1 つの方法として、React コンポーネントをラップして `<slot>` 要素を使用する方法があります。

```jsx
import React from "react";

export const MyComponent = ({ children }) => {
  return (
    <p>
      {children}
      <slot />
    </p>
  );
};
```

`<slot>` 要素を有効にするために、`shadow` オプションを設定して Shadow DOM としてレンダリングされる必要があります。

```jsx
import r2wc from "@r2wc/react-to-web-component";
import { MyComponent } from "./MyComponent";

const MyComponentComponent = r2wc(MyComponent, {
  shadow: "open",
});

customElements.define("my-component", MyComponentComponent);
```

以下のように `<slot>` 要素を使用して、HTML 要素を渡すことができます。

```html
<my-component>
  <p>Hello, World!</p>
</my-component>
```

## まとめ

- `@r2wc/react-to-web-component` を使用することで、React コンポーネントを Web Components に変換することができる
- できる Props をカスタム要素の属性として受け取るためには、`Props` オプションにオブジェクトを渡す
- 関数型 Props を受け取る場合には、グローバルスコープに関数を登録する必要がある
- `children` Props を受け取る場合には、`string` 型として受け取るか、`<slot>` 要素を使用する

## 参考

- [react-to-web-component/docs/api.md at main · bitovi/react-to-web-component](https://github.com/bitovi/react-to-web-component/blob/main/docs/api.md)
