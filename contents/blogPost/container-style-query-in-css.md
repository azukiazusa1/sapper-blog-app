---
id: JrHW2MnFst3QRSAMN6E6E
title: "親要素のスタイルの基づいてスタイルを適用するコンテナスタイルクエリー CSS"
slug: "container-style-query-in-css"
about: "CSS の @container ルールは、コンテナ（親要素）の特性に基づいてスタイルを適用するためのルールです。コンテナースタイルクエリーはコンテナサイズクエリーとコンテナスタイルクエリーの 2 種類に分類されます。コンテナスタイルクエリは style() 関数記法で定義されたスタイルを @container ルールで評価し、指定された条件が一致する場合にスタイルが適用されます。"
createdAt: "2024-03-30T14:12+09:00"
updatedAt: "2024-03-30T14:12+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7439inVTcQXUvjyo9Fm80E/ecacb8aa7e8d241e6568a1aa5b663daf/takenoko_illust_3126-768x578.png"
  title: "たけのこのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "コンテナスタイルクエリーでスタイルを適用するためのルールはどれか？"
      answers:
        - text: "container(--color: red) { ... }"
          correct: false
          explanation: "コンテナスタイルクエリーではコンテナサイズクエリと区別するため、style() 関数記法を使用します。"
        - text: "@container style(--color: red) { ... }"
          correct: true
          explanation: null
        - text: "if (--color: red) { ... } else { ... }"
          correct: false
          explanation: null
        - text: ".card:container(--color: red) { ... }"
          correct: false
          explanation: null
published: true
---
CSS の `@container` ルールは、コンテナ（親要素）の特性に基づいてスタイルを適用するためのルールです。コンテナースタイルクエリーは以下の 2 種類に分類されます。

- コンテナサイズクエリー：コンテナ要素の現在のサイズに基づいてスタイルを適用する。e.g. `@container (min-width: 30em) { ... }`
- コンテナスタイルクエリー：コンテナ要素のスタイルに基づいてスタイルを適用する。e.g. `@container style(--color: red) { ... }`

この記事では、コンテナースタイルクエリーについて見ていきます。

## コンテナスタイルクエリーの概要

コンテナスタイルクエリは `style()` 関数記法で定義されたスタイルを `@container` ルールで評価します。`@media` ルールと同様に、指定された条件が一致する場合にスタイルが適用されます。

例を見てみましょう。ここでは `@container()` ルールに `--bg-color` カスタムプロパティが `black` の場合に、`p` 要素のテキストカラーを `white` に変更します。

```css
.wrapper {
  background-color: var(--bg-color, white);
}

p {
  color: black;
}

@container style(--bg-color: black) {
  p {
    color: white;
  }
}
```

結果は以下のようになります。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qBwPMON?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qBwPMON">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

現在 `style()` に渡せるプロパティはカスタムプロパティのみですが、将来的には他のプロパティもサポートされる予定です。

## 直接の親要素ではない要素を元にスタイルを適用する

要素が入れ子になっている場合について考えてみましょう。以下の HTML は `.wrapper` > `.inner` > `p` の構造を持っています。このとき、`.wrapper` と `.inner` にそれぞれ同一のカスタムプロパティが定義されている場合、コンテナスタイルクエリーはどの要素を基準にスタイルを適用するでしょうか？

```html
<div class="wrapper" style="--weather: sunny;">
  <div class="inner" style="--weather: rainy;">
    <p>Text</p>
  </div>
</div>
```

```css
@container style(--weather: sunny) {
  p {
    color: orange;
  }
}

@container style(--weather: rainy) {
  p {
    color: blue;
  }
}
```

このとき、コンテナスタイルクエリの対象の `p` 要素に最も近い親要素が基準となります。つまり、`.inner` 要素に定義された `--weather: rainy` が適用されるため、テキストカラーは青色になります。

常に `.wrapper` 要素を基準にスタイルを適用したい場合は、`container-name` プロパティを `.wrapper` 要素に指定し、`@container` ルールにおいて `container-name` で指定した名前を参照します。

```css
.wrapper {
  container-name: wrapper;
}

@container wrapper style(--weather: sunny) {
  p {
    color: orange;
  }
}

@container wrapper style(--weather: rainy) {
  p {
    color: blue;
  }
}
```

このようにすることで、`.wrapper` 要素を基準にスタイルが適用されます。以下のように文字の色がオレンジ色になっていることが確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/YzMrONx?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/YzMrONx">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `@container` ルールはコンテナ（親要素）の特性に基づいてスタイルを適用するためのルールで、コンテナサイズクエリーとコンテナスタイルクエリーの 2 種類がある
- コンテナスタイルクエリーは `@container style(--custom-property: value) { ... }` でスタイルを定義し、`--custom-property` が一致する場合にスタイルが適用される
- 入れ子になっている要素の場合、最も近い親要素が基準となるが、`container-name` プロパティを使用することで基準を指定できる

## 参考

- [コンテナーのサイズおよびスタイルクエリーの使用 CSS:カスケーディングスタイルシート|MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_containment/Container_size_and_style_queries)
- [スタイルクエリ スタートガイド](https://developer.chrome.com/docs/css-ui/style-queries?hl=ja)
