---
id: gDg1Jh0b_FYNDM2qotiXe
title: "Scoped Custom Element Registries でカスタム要素の名前衝突を防ぐ"
slug: "scoped-custom-element-registries"
about: "Web Components を利用してアプリケーションを構築する際に、異なるコンポーネントライブラリが同じ名前のカスタム要素を定義していると、名前の衝突が発生します。Scoped Custom Element Registries を使用すると、同じページの異なるスコープで同名のカスタム要素に別々の実装を登録できます。この記事では Scoped Custom Element Registries について紹介します"
createdAt: "2026-08-15T15:46+09:00"
updatedAt: "2026-08-15T15:46+09:00"
tags: ["JavaScript", "Web Components", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1uG010TUCDlIiMzvVhkMUF/4c6312183326e9121297be3c9343a430/shark-fin_21263-768x591.png"
  title: "shark-fin 21263-768x591"
audio: null
selfAssessment:
  quizzes:
    - question: "同じページで同名のカスタム要素に異なる実装を割り当てる方法として正しいものはどれですか？"
      answers:
        - text: "グローバルな customElements に同じ名前を複数回登録する"
          correct: false
          explanation: "同じレジストリに登録済みの名前を再度登録すると NotSupportedError が発生します。"
        - text: "複数の CustomElementRegistry を作成し、それぞれに同じ名前を登録する"
          correct: true
          explanation: "レジストリが異なれば、同じカスタム要素名に別々のコンストラクターを登録できます。"
        - text: "customElements.define() の第3引数に名前空間を指定する"
          correct: false
          explanation: "customElements.define() にレジストリの名前空間を指定する引数はありません。"
        - text: "カスタム要素を登録するたびに新しい Document を作成する"
          correct: false
          explanation: "Scoped Custom Element Registries は同じ Document 内で複数のレジストリを利用する仕組みです。"
    - question: "作成した CustomElementRegistry を Shadow Root に関連付けるオプションはどれですか？"
      answers:
        - text: "registryName"
          correct: false
          explanation: "registryName という attachShadow() のオプションはありません。"
        - text: "customElements"
          correct: false
          explanation: "customElements はグローバルレジストリを参照するプロパティであり、attachShadow() のオプションではありません。"
        - text: "customElementRegistry"
          correct: true
          explanation: "attachShadow() の customElementRegistry オプションに使用するレジストリを渡します。"
        - text: "elementRegistry"
          correct: false
          explanation: "elementRegistry という attachShadow() のオプションはありません。"
published: true
---
b> scoped-custom-element-registries

[Web Components](https://developer.mozilla.org/ja/docs/Web/API/Web_components) は、再利用可能な独自の HTML 要素を作成するための技術の総称です。主に、独自の要素名と振る舞いを定義する Custom Elements、DOM 構造やスタイルをカプセル化する Shadow DOM、再利用するマークアップを宣言する `<template>` 要素や `<slot>` 要素から構成されます。これらはブラウザが提供する標準 API であり、React や Vue.js といったフレームワークに依存せずに利用できることが特徴です。

Web Components は、ボタン、ダイアログ、入力フォームといった UI コンポーネントをライブラリとして提供するために使われることが多く、[Material Web Components](https://github.com/material-components/material-web) や [Shoelace](https://shoelace.style/) などのライブラリが公開されています。その他、プロダクトのデザインシステムに沿った UI コンポーネントを配布して社内で利用する、マイクロフロントエンドのように複数のプロジェクトで共通の UI コンポーネントを利用する、といった用途でも Web Components が活用されています。

これらのライブラリの利用者は JavaScript モジュールを読み込み、`<my-button>` のようなカスタム要素を通常の HTML と同じように記述します。Web Components を利用したライブラリは、フレームワークに依存せずに利用できるため、社内の複数のプロジェクトで共通の UI コンポーネントを利用する場合に特に便利です。

一方で Web Components ライブラリを使用するうえで障壁となるのが名前の衝突です。複数のライブラリが同じ名前のカスタム要素を定義している場合、どちらか一方の定義しか利用できません。たとえば、あるライブラリが `<my-card>` を定義しているときに、別のライブラリも同じ `<my-card>` を定義しようとすると、後から登録した側が例外で失敗します。現状は接頭辞の命名規則（`md-` や `sl-` など）で衝突を避けるという、確実とは言えない方法に頼っています。

Scoped Custom Element Registries はこの問題を解決します。これによりカスタム要素をカプセル化できるようになります。同じページに複数の `CustomElementRegistry` のインスタンスを作成し、それぞれに同名のカスタム要素を登録できるのです。

```js
// registry を作成する
const registry = new CustomElementRegistry();

// registry にカスタム要素を登録する
class MyCard extends HTMLElement {}
registry.define("my-card", MyCard);

// Shadow Root を作成し、registry を関連付ける
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({
  mode: "open",
  customElementRegistry: registry,
});
// Shadow Root 内で <my-card> を使用する
shadowRoot.innerHTML = `<my-card></my-card>`;
```

この記事では、Scoped Custom Element Registries の概要について紹介します。

## 従来のカスタム要素の登録方法

まずは従来の方法でカスタム要素を作成する流れを確認しましょう。カスタム要素の振る舞いは、`HTMLElement` を継承したクラスとして定義します。

```js
class MyCard extends HTMLElement {
  connectedCallback() {
    this.textContent = "My Card";
  }
}
```

`connectedCallback()` は、カスタム要素がドキュメントに接続されたときに呼び出されるライフサイクルコールバックです。この例では、要素のテキストとして `My Card` を設定しています。

クラスを作成しただけでは、ブラウザはどの HTML 要素にこの振る舞いを適用するのか判断できません。`customElements.define()` メソッドに要素名とクラスを渡して、カスタム要素をレジストリへ登録します。レジストリとは、カスタム要素の名前とその要素の振る舞いを実装する JavaScript クラスの対応関係を管理する仕組みです。レジストリはグローバルな `window.customElements` として提供されます。

```js
customElements.define("my-card", MyCard);
```

カスタム要素の名前には、標準の HTML 要素と区別するためにハイフンを含める必要があります。登録後は、通常の HTML 要素と同じように使用できます。

```html
<my-card></my-card>
```

`customElements.define()` が呼び出されると、すでにドキュメントに存在する `<my-card>` に `MyCard` の定義が適用されます。このように、レジストリへの登録をきっかけに既存の要素へカスタム要素の定義が適用されることをアップグレードと呼びます。

`window.customElements` は、ドキュメント全体で共有されるグローバルな `CustomElementRegistry` です。次のように同じ名前で別のクラスを登録しようとすると、`NotSupportedError` が発生します。

```js
class AnotherCard extends HTMLElement {}

customElements.define("my-card", AnotherCard);
// Uncaught NotSupportedError
// Failed to execute 'define' on 'CustomElementRegistry': the name "my-card" has already been used with this registry
```

そのため、同じページで複数のライブラリを組み合わせる場合には、カスタム要素の名前に注意を払う必要があるのです。

アプリケーションが管理するコンポーネントだけであれば、接頭辞などの命名規則で衝突を避けられるかもしれません。しかし、異なるバージョンのライブラリが推移的な依存関係として読み込まれる場合や、プラグイン、ブラウザ拡張、外部のウィジェットを組み合わせる場合には、ページ全体の名前を調整することが難しくなります。

## Scoped Custom Element Registry を作成する

グローバルなレジストリと異なり、Scoped Custom Element Registry は `CustomElementRegistry` コンストラクターから作成します。コンストラクターには引数はありません。

```js
class DemoCard extends HTMLElement {}

const registry = new CustomElementRegistry();
registry.define("demo-card", DemoCard);
```

作成したレジストリの `define()` メソッドでカスタム要素を登録しても、その要素はまだ HTML 内で使用できません。Scoped Custom Element Registry は、どの DOM ツリーで使用するかを明示的に指定する必要があります。カスタム要素はその DOM ツリーのスコープ内でのみ有効になります。

Shadow Root に関連付けるには、`attachShadow()` メソッドの `customElementRegistry` オプションに渡します。

```js
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({
  mode: "open",
  customElementRegistry: registry,
});

shadowRoot.innerHTML = `<demo-card></demo-card>`;
```

:::note
[Shadow Root](https://developer.mozilla.org/ja/docs/Web/API/ShadowRoot) とは、文書の DOM ツリーから分離してレンダリングされた部分ツリーのルートノードです。Shadow Root を持つ要素は Shadow Host と呼ばれ、Shadow Root とその子孫を合わせた仕組みを Shadow DOM と呼びます。Shadow Root を使うと、コンポーネント内部の HTML 構造やスタイルを外部から分離できるという利点があります。
:::

レジストリは Shadow Root だけでなく、通常の `Element` にも関連付けられます。先ほど作成した `registry` を使って、`document.createElement()` の第 2 引数に `customElementRegistry` を指定してみましょう。Shadow DOM を使わずに、生成した要素とその子孫にレジストリのスコープを効かせられます。

```js
const card = document.createElement("demo-card", {
  customElementRegistry: registry,
});

document.body.append(card);
```

:::warning
Scoped Custom Element Registry を関連付けたツリーからは、グローバルな `customElements` に登録された定義が見えなくなります。カスタム要素の定義の検索はノードに関連付けられた 1 つのレジストリだけを対象としており、グローバルなレジストリへのフォールバックは行われないためです。そのため、そのスコープで使用するカスタム要素は、グローバルに登録済みのものであってもレジストリへ登録し直す必要があります。
:::

## 同じ要素名に異なる実装を登録する

ここからは 2 つの Scoped Custom Element Registry を作成し、それぞれのレジストリに `demo-card` という同じ名前を登録してみましょう。2 つのレジストリを使用することで、同じページで同名のカスタム要素に異なる実装を割り当てられます。

はじめに Shadow Root を作成するためのホスト要素を 2 つ用意しておきます。

```html
<div id="host-a"></div>
<div id="host-b"></div>
```

それぞれ異なる内容を描画するカスタム要素 `BlueCard` と `OrangeCard` を定義します。

```js
class BlueCard extends HTMLElement {
  connectedCallback() {
    this.textContent = "BlueCard";
  }
}

class OrangeCard extends HTMLElement {
  connectedCallback() {
    this.textContent = "OrangeCard";
  }
}
```

続いて 2 つのレジストリを作成します。同じ `demo-card` という名前を使用していますが、レジストリが異なるため問題なく登録できます。

```js
const registryA = new CustomElementRegistry();
const registryB = new CustomElementRegistry();

registryA.define("demo-card", BlueCard);
registryB.define("demo-card", OrangeCard);
```

2 つのホスト要素に Shadow Root を作成し、異なるレジストリを関連付けます。それぞれの Shadow Root に同じ `<demo-card>` を挿入します。

```js
const shadowRootA = document.querySelector("#host-a").attachShadow({
  mode: "open",
  customElementRegistry: registryA,
});
const shadowRootB = document.querySelector("#host-b").attachShadow({
  mode: "open",
  customElementRegistry: registryB,
});

shadowRootA.innerHTML = `
  <style>
    demo-card {
      display: block;
      padding: 16px;
      color: blue;
      border: 2px solid blue;
    }
  </style>
  <demo-card></demo-card>
`;

shadowRootB.innerHTML = `
  <style>
    demo-card {
      display: block;
      padding: 16px;
      color: orange;
      border: 2px solid orange;
    }
  </style>
  <demo-card></demo-card>
`;
```

このコードを実行すると、`registryA` の `<demo-card>` は `BlueCard` に、`registryB` の `<demo-card>` は `OrangeCard` にそれぞれアップグレードされます。CSS のセレクターはどちらも `demo-card` ですが、カスタム要素の定義とスタイルはそれぞれの Shadow Root 内にスコープ化されるため、異なる内容と色で表示されます。一方の Shadow Root に書かれた `demo-card` のスタイルが、もう一方の `<demo-card>` に適用されることはありません。

<iframe height="300" style="width: 100%;" scrolling="no" title="Scoped Custom Element Registries demo" src="https://codepen.io/azukiazusa1/embed/myRYaaP?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myRYaaP">
  Scoped Custom Element Registries demo</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Shadow Root を作成した後にレジストリを関連付ける

`attachShadow()` の呼び出し時点でレジストリを渡せないケースでは、`CustomElementRegistry.prototype.initialize()` メソッドを使用できます。このメソッドは、レジストリがまだ関連付けられていない `Element` または `ShadowRoot` を対象として、レジストリを関連付けます。

```js
const registry = new CustomElementRegistry();
registry.define("demo-card", DemoCard);

registry.initialize(shadowRoot);
```

主な用途の 1 つは宣言的 Shadow DOM です。`<template>` 要素に `shadowrootcustomelementregistry` 属性を指定すると、レジストリが未設定の Shadow Root が作成されます。HTML パーサーが先に作成したこの Shadow Root に対して、JavaScript の実行後にレジストリを関連付けられます。

```html
<div id="host">
  <template shadowrootmode="open" shadowrootcustomelementregistry>
    <style>
      demo-card {
        display: block;
        padding: 16px;
        color: purple;
        border: 2px solid purple;
      }
    </style>
    <demo-card></demo-card>
  </template>
</div>
```

```js
registry.initialize(document.querySelector("#host").shadowRoot);
```

`initialize()` は、対象とその子孫にあるレジストリが未設定のノードを初期化し、登録済みの定義を使用してカスタム要素のアップグレードも試みます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Declarative Shadow DOM with a scoped custom element registry" src="https://codepen.io/azukiazusa1/embed/jEyodyv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEyodyv">
  Declarative Shadow DOM with a scoped custom element registry</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- Web Components を利用してアプリケーションを構築する際に、異なるコンポーネントライブラリが同じ名前のカスタム要素を定義していると、名前の衝突が発生するという問題があった
- Scoped Custom Element Registries を使用すると、同じページの異なるスコープで、同名のカスタム要素に別々の実装を割り当てられる
- レジストリを `Element` や `ShadowRoot` に関連付けることで、DOM を生成するコンテキストごとに使用するカスタム要素の定義を選択できる

## 参考

- [HTML Standard - Custom elements](https://html.spec.whatwg.org/multipage/custom-elements.html)
- [DOM Standard - Shadow trees](https://dom.spec.whatwg.org/#shadow-trees)
- [Scoped Custom Element Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md)
- [Revamped Scoped Custom Element Registries](https://github.com/whatwg/html/issues/10854)
- [W3C TAG Design Review](https://github.com/w3ctag/design-reviews/issues/1070)
- [Intent to Ship: Scoped Custom Element Registry](https://groups.google.com/a/chromium.org/g/blink-dev/c/mAteNymnc_s)
- [Make custom elements behave with scoped registries  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/scoped-registries)
