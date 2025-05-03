---
id: bbV2MsCXhRe66c_SGsSA1
title: "CSS トランジションの開始時のスタイルを定義する `@starting-style` ルール"
slug: "starting-style-rule-for-css-transitions"
about: "`@starting-style` ルールは、CSS トランジションの開始時のスタイルを定義するためのアットルールです。CSS トランジションの既定のルールでは前回のスタイル変更イベントでレンダリングされていなかった要素では、アニメーションが適用されない、`display: none` から他の値に変更した場合にアニメーションが適用されないといった問題があります。`@starting-style` ルールを使用することでこれらの問題を解決できます。"
createdAt: "2024-06-09T15:22+09:00"
updatedAt: "2024-06-09T15:22+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4218OVTiHNkM4d9CORGRAE/e548eb3c3eef448d0be93c7b74d04f42/cute_katatsumuri_illust_3236-768x580.png"
  title: "cute katatsumuri illust 3236-768x580"
audio: null
selfAssessment:
  quizzes:
    - question: "既定の CSS トランジションのルールではアニメーションが適用されず、`@starting-style` ルールを使用することで解決できるプロパティはの変化はどれか？"
      answers:
        - text: "opacity: 0 → opacity: 1"
          correct: true
          explanation: null
        - text: "display: none → display: block"
          correct: false
          explanation: null
        - text: "box-shadow: none → box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)"
          correct: false
          explanation: null
        - text: "visibility: hidden → visibility: visible"
          correct: false
          explanation: null
published: true
---
`@starting-style` ルールは、CSS トランジションの開始時のスタイルを定義するための[アットルール](https://developer.mozilla.org/ja/docs/Web/CSS/At-rule)です。`@starting-style` アットルールは以下の 2 通りの記法で定義されます。

1. 独立したブロックとして記述する方法

```css
@starting-style {
  .box {
    background-color: red;
  }
}
```

2. 既存のルールセットに入れ子にする方法

```css
.box {
  background-color: red;

  @starting-style {
    background-color: blue;
  }
}
```

## なぜ `@starting-style` ルールが必要なのか

CSS トランジションは、要素のスタイルが変化する際にアニメーションを適用するための仕組みです。CSS トランジションの既定のルールでは以下のような問題があげられます。

- 前回のスタイル変更イベントでレンダリングされていなかった要素では、アニメーションが適用されない
- `display: none` から他の値に変更した場合にアニメーションが適用されない

1 つ目の問題について詳しく見ていきます。JavaScript を用いて DOM に動的に要素を追加する例を考えてみましょう。以下の例では、ボタンをクリックすると `box` クラスを持つ要素が追加されます。

```javascript
const button = document.querySelector("#add");
const container = document.querySelector(".container");

button.addEventListener("click", () => {
  const box = document.createElement("div");
  box.classList.add("box");
  container.appendChild(box);
});
```

`box` クラスを持つ要素が出現する際にアニメーションを適用したい場合、CSS トランジションを使用すると以下のような記述が思いつくかもしれません。はじめに
CSS で初期値として `opacity: 0` を設定しておきます。

```css
.box {
  opacity: 0;
  transition: opacity 1s;
}
```

そして、JavaScript で要素が追加される際に `opacity` プロパティを変更します。

```javascript {5}
button.addEventListener("click", () => {
  const box = document.createElement("div");
  box.classList.add("box");
  container.appendChild(box);
  box.style.opacity = 1;
});
```

しかし、この方法では要素が追加される瞬間にアニメーションが適用されません。`opacity: 1;` は要素のスタイルが計算される前に設定されるため、`opacity: 0;` ではなく `opacity: 1;` が初期値とみなされてしまうためです。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/KKLvovw?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/KKLvovw">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

この問題を解決するためには、`getBoundingClientRect()` メソッドを使用して強制的に要素のスタイルを再計算するようなハックが必要でした。

```javascript {5}
button.addEventListener("click", () => {
  const box = document.createElement("div");
  box.classList.add("box");
  container.appendChild(box);
  box.getBoundingClientRect();
  box.style.opacity = 1;
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/QWRMmOW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/QWRMmOW">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

もしくは `requestAnimationFrame()` を使用して要素が描画されたことを確認してからアニメーションを適用する方法もありました。

```javascript {5-7}
button.addEventListener("click", () => {
  const box = document.createElement("div");
  box.classList.add("box");
  container.appendChild(box);
  requestAnimationFrame(() => {
    box.style.opacity = 1;
  });
});
```

## DOM に要素を追加する際のアニメーションに `@starting-style` ルールを使用する

`@starting-style` ルールを使用することで要素が動的に DOM に追加される際のアニメーションの問題を解決できます。JavaScript 上で `opacity` プロパティを変更する代わりに、`@starting-style` ルールを使用して初期スタイルを定義します。

```css
.box {
  opacity: 1;
  transition: opacity 1s;

  @starting-style {
    opacity: 0;
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/PovKROV?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PovKROV">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

もしくは、`@starting-style` ルールを独立したブロックとして記述することもできます。

```css
.box {
  opacity: 1;
  transition: opacity 1s;
}

@starting-style {
  .box {
    opacity: 0;
  }
}
```

!> `@starting-style` アットルールのブロック内でも外のスコープと同じ [詳細度](https://developer.mozilla.org/ja/docs/Web/CSS/Specificity) が適用されます。そのため `@starting-style` ルール内の記述が確実に適用されるようするために、元のルールより後に記述する必要があります。元のルールが後に定義されている場合上書きされるため、`@starting-style` ルールが適用されません。`@starting-style` を入れ子にしている場合にはこのような問題は発生しません。

## ポップオーバーの開閉時にアニメーションを適用する

[ポップオーバー](https://developer.mozilla.org/ja/docs/Web/API/Popover_API) のように [最上位レイヤー](https://developer.mozilla.org/ja/docs/Glossary/Top_layer) に表示される要素の開閉時にアニメーションを適用したい場合には、`@starting-style` ルールが有効な手段となります。ポップオーバーは開いている状態と閉じている状態を `display: none` により切り替えるため、CSS トランジションではアニメーションを適用できません。

```css
[popover] {
  transform: scaleX(0);
}

[popover]:popover-open {
  transform: scaleX(1);
  transition: transform 1s;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qBGXoWr?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qBGXoWr">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

以下のように `@starting-style` ルールを入れ子に、そこにトランジションの開始時のスタイルを定義することで、ポップオーバーが開いた瞬間にアニメーションが適用されるようになります。

```css
[popover]:popover-open {
  transform: scaleX(1);
  transition: transform 1s;

  @starting-style {
    transform: scaleX(0);
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qBGXoZj?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qBGXoZj">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `@starting-style` ルールは CSS トランジションの開始時のスタイルを定義するためのアットルール
- CSS トランジションでは要素が動的に DOM に追加される際にアニメーションが適用されない、`display: none` から他の値に変更した場合にアニメーションが適用されないといった問題がある
- `@starting-style` ルールを使用することで上記のような問題を解決できる

## 参考

- [@starting-style - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@starting-style)
- [3.3. Defining before-change style: the @starting-style rule](https://drafts.csswg.org/css-transitions-2/#defining-before-change-style)
- [Do you still need Framer Motion? - Motion One Blog](https://motion.dev/blog/do-you-still-need-framer-motion)
