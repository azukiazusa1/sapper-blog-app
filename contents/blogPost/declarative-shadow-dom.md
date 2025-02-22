---
id: tjPnFQgH3TUcNZkyn8Jyc
title: "HTML だけで Shadow DOM を構築するための宣言型 Shadow DOM"
slug: "declarative-shadow-dom"
about: "宣言型 Shadow DOM は `<template>` 要素を使用して Shadow DOM を構築する方法です。宣言型 Shadow DOM を使用することで、従来の JavaScript を使用した Shadow DOM の構築方法と比較して、サーバーサイドレンダリング（SSR）に対応しているため、パフォーマンスの向上や SEO 対策に期待されます。"
createdAt: "2024-10-19T15:45+09:00"
updatedAt: "2024-10-19T15:45+09:00"
tags: ["", "Web Components"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6WxinEzAH94ePMLyqRlYRM/3653adc2ffb0f76dde660d87c538e298/bats-halloween_20798-768x591.png"
  title: "ハロウィンのコウモリのイラスト"
selfAssessment:
  quizzes:
    - question: "宣言型 Shadow DOM はどの要素を使用して Shadow DOM を構築するか？"
      answers:
        - text: "<shadow-dom mode=\"open\">"
          correct: false
          explanation: null
        - text: "<shadow-root mode='open'>"
          correct: false
          explanation: null
        - text: "<template shadowrootmode=\"open\">"
          correct: true
          explanation: null
        - text: "<shadow-dom shadowrootmode=\"open\">"
          correct: false
          explanation: null
published: true
---
[Shadow DOM](https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_shadow_DOM) は Web Components を構成する 3 つの技術の 1 つです。Shadow DOM はコンポーネントのカプセル化を実現します。Shadow DOM で定義されたスタイルは Shadow DOM の外部に影響を与えず、また外部のスタイルの影響を受けません。

Shadow DOM は再利用可能なコンポーネントを構築するために重要な技術ですが、従来は JavaScript を使用しなければ Shadow DOM を構築できないという問題がありました。Shadow DOM を構築するためには、ホストとなる DOM 要素で `attachShadow` メソッドを使用して Shadow DOM を構築し、`innerHTML` プロパティもしくは `appendChild` メソッドを使用して Shadow DOM に HTML を追加する必要があります。

```js
const host = document.querySelector("#host");
// mode が open の場合、Shadow DOM は外部の JavaScript からアクセス可能
const shadowRoot = host.attachShadow({ mode: "open" });
shadowRoot.innerHTML = `
  <style>
    p {
      color: red;
    }
  </style>
  <p>Hello, Shadow DOM!</p>
`;
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qBejvxr?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qBejvxr">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

JavaScript を用いたアプローチの欠点は、サーバー側でレンダリングできないことです。多くのアプリケーションではコンテンツが描画されるまでのパフォーマンスを向上させたり、SEO 対策のためにサーバーサイドレンダリング（SSR）を行っています。サーバーで生成された HTML には Shadow DOM が含まれていないため、クライアント側で Shadow DOM を構築する必要があり、パフォーマンスに影響を与えます。また、ページの読み込み後にコンテンツが挿入されるため、レイアウトシフトが発生する可能性もあります。

宣言型 Shadow DOM（Declarative Shadow DOM）は、上記の問題を解決するために提案され、現在では [Baseline 2024](https://web.dev/baseline/2024?hl=ja) に組み込まれているため、すべてのモダンブラウザで利用可能です。

b> declarative-shadow-dom

## 宣言型 Shadow DOM を作成する

宣言型 Shadow DOM は、`<template>` 要素を使用して Shadow DOM を構築します。`<template>` 要素に `shadowrootmode` 属性の値に `open` または `closed` を指定することで HTML パーサーにより Shadow DOM が構築されます。`shadowrootmode` 属性に渡す値は `attachShadow` メソッドの `mode` パラメータと同じです。`open` の場合、外部の JavaScript から Shadow DOM にアクセス可能になります。

```html
<hello-shadow-dom>
  <template shadowrootmode="open">
    <style>
      p {
        color: red;
      }
    </style>
    <p>Hello, Shadow DOM!</p>
  </template>
</hello-shadow-dom>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/VwoWRXM?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/VwoWRXM">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## カスタム要素と組み合わせる

宣言型で作成された Shadow DOM に対して後からカスタム要素を組み合わせることができます。用途としては、サーバー側で生成された Shadow DOM にクライアント側でカスタム要素を登録することにより、クリックイベントなどの動的な振る舞いを追加することが挙げられます。

まずはじめに `<template>` 要素を使用して Shadow DOM を構築します。

```html
<shadow-button>
  <template shadowrootmode="open">
    <button>Click me!</button>
  </template>
</shadow-button>
```

次に JavaScript を使用してカスタム要素を登録します。カスタム要素を作成するためには、`HTMLElement` クラスを継承したクラスを作成し、`customElements.define` メソッドを使用して登録します。

`HTMLElement` を継承したクラス内では `shadowRoot` プロパティにアクセスできます。このプロパティにはカスタム要素にすでにアタッチされている Shadow DOM が格納されています。`connectedCallback` メソッド内で `this.shadowRoot` が存在するかどうかを確認し、存在する場合は Shadow DOM を JavaScript から作成する必要はありません。そうでない場合には対応する Shadow ルートが存在しないため、`attachShadow` メソッドを使用して Shadow DOM を作成します。

```js
class ShadowButton extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    if (this.shadowRoot) {
      const button = this.shadowRoot.querySelector("button");
      button.addEventListener("click", () => {
        alert("Hello, Shadow DOM!");
      });
    } else {
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
      <button>Click me!</button>
    `;
      shadowRoot.querySelector("button").addEventListener("click", () => {
        alert("Hello, Shadow DOM!");
      });
    }
  }
}
```

`customElements.define` メソッドを使用してカスタム要素を登録する際の第 1 引数は宣言型 Shadow DOM で使用したカスタム要素の名前と一致している必要があります。

```js
customElements.define("shadow-button", ShadowButton);
```

これでボタンをクリックするとアラートが表示されるカスタム要素が作成されました。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/mdNwgLZ?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/mdNwgLZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## JavaScript から宣言型 Shadow DOM を作成する

JavaScript から宣言型 Shadow DOM を作成する場合、従来の Shadow DOM の作成方法と同様に `attachShadow` メソッドを使用します。しかし、`innerHTML` や `insertAdjacentHTML` メソッドはセキュリティ上の理由から宣言型 Shadow ルートが適用された HTML を解析できません。

```js
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({ mode: "open" });
shadowRoot.innerHTML = `
  <hello-shadow-dom>
    <template shadowrootmode="open">
      <style>
        p {
          color: red;
        }
      </style>
      <p>Hello, Shadow DOM!</p>
    </template>
`;
```

上記のコードを実行するとコンソールに以下の Warning が表示され、画面には何もレンダリングされません。

```sh
Found declarative shadowrootmode attribute on a template, but declarative Shadow DOM is not being parsed. Use setHTMLUnsafe() or parseHTMLUnsafe() instead.
```

Shadow ルートが適用された HTML を解析するためには、`setHTMLUnsafe` メソッドまたは `parseHTMLUnsafe` メソッドを使用します。

!> それぞれのメソッド名のプレフィックスについている `Unsafe` はスクリプトをサニタイズせずに実行するため XSS のリスクがあることを示しています。将来デフォルトでサニタイズされて実行される `setHTML` と `parseHTML` メソッドが仕様に追加される予定です。https://github.com/WICG/sanitizer-api/blob/main/explainer.md

```js
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({ mode: "open" });
shadowRoot.setHTMLUnsafe(`
  <hello-shadow-dom>
    <template shadowrootmode="open">
      <style>
        p {
          color: red;
        }
      </style>
      <p>Hello, Shadow DOM!</p>
    </template>
`);
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/jOgwRyW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jOgwRyW">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- 従来の Shadow DOM の作成方法は JavaScript を使用する必要があり、サーバーサイドレンダリング（SSR）に対応していないという問題があった
- 宣言型 Shadow DOM は `<template>` 要素で `shadowrootmode` 属性の値に `open` または `closed` を指定することで HTML パーサーにより Shadow DOM を構築することができる
- `shadowrootmode` 属性の値が `open` の場合は外部の JavaScript から Shadow DOM にアクセス可能になる
- `HTMLElement` クラスを継承したクラス内では `shadowRoot` プロパティにアクセスでき、カスタム要素にすでにアタッチされている Shadow DOM が格納されている
- JavaScript から宣言型 Shadow DOM を作成する場合、セキュリティ上の理由から `innerHTML` や `insertAdjacentHTML` メソッドは使用できない。代わりに `setHTMLUnsafe` または `parseHTMLUnsafe` メソッドを使用する

## 参考

- [4.12.3 The template element](https://html.spec.whatwg.org/multipage/scripting.html#attr-template-shadowrootmode)
- [Declarative Shadow DOM](https://github.com/mfreed7/declarative-shadow-dom/blob/master/README.md)
- [宣言型の Shadow DOM  |  web.dev](https://web.dev/articles/declarative-shadow-dom?hl=ja)
- [シャドウ DOM の使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_shadow_DOM)
