---
id: 8Wl4DxRU6rWWL5xPJgU09
title: "CSS の `reading-flow` プロパティで要素の読み上げ順を制御する"
slug: "css-reading-flow-property"
about: "Flex や Grid コンテナ内では要素の見た目上の順序と DOM 上の順序が異なることがあります。このような状態はキーボード操作やスクリーンリーダーなどの支援技術を使うユーザーにとって混乱を招く可能性があります。CSS の `reading-flow` プロパティ個の問題を解決するためのプロパティです。見た目上の順序に従って読み上げ順を制御することができます。"
createdAt: "2024-08-03T15:33+09:00"
updatedAt: "2024-08-03T15:33+09:00"
tags: ["CSS", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/BIHrVgoOfq5nkcwL38xXF/229f6f8c22993fa4afb3f1b18a3a671e/river-fishing_13259.png"
  title: "川で釣りをするイラスト"
selfAssessment:
  quizzes:
    - question: "Flex コンテナ内の要素の読み上げ順を制御するためのプロパティはどれか？"
      answers:
        - text: "reading-flow: auto;"
          correct: "false"
          explanation: "auto は DOM の順序に従うプロパティで、デフォルトの値です。"
        - text: "reading-flow: flex-visual;"
          correct: true
          explanation: ""
        - text: "reading-flow: grid-order;"
          correct: false
          explanation: "grid-order は Grid コンテナ内の要素の読み上げ順を制御するプロパティです。"
        - text: "reading-flow: visual;"
          correct: false
          explanation: "visual という値は存在しません。"

published: true
---

!> `reading-flow` プロパティは 2024 年 8 月現在 [Editor Draft](https://www.w3.org/standards/types/#ED) として提案されている機能です。W3C によって標準化されておらず、将来仕様が変更される可能性があります。Chrome Dev または Canary バージョン 128 以降で試すことができます。

Flex や Grid などの CSS レイアウトを使っている場合や、ドラッグアンドドロップで自由に要素を配置できる UI を実装している場合、要素の見た目上の並び順と、DOM 上の並び順が異なることがあります。このような状態はキーボード操作やスクリーンリーダーなどの支援技術を使うユーザーにとって混乱を招く可能性があります。見た目とは異なる順番で要素にフォーカスがされるためです。

例えば、Flex コンテナ内の要素は `flex-direction: column-reverse;` を指定すると要素の順番を逆順にして表示できます。下記の例では、`item 1`、`item 2`、`item 3` の順で DOM に配置されていますが、実際の見た目では `item 3`、`item 2`、`item 1` の順で表示されます。

```html
<div class="container">
  <div class="item">
    <button>Item 1</button>
  </div>
  <div class="item">
    <button>Item 2</button>
  </div>
  <div class="item">
    <button>Item 3</button>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column-reverse;
  }
  .item {
    width: 100px;
    height: 100px;
    border: 1px solid black;
  }
</style>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/bGPWeym?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/bGPWeym">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

実際に Tab キーを押してフォーカスを移動させると、`item 3` から `item 2`、`item 1` の順でフォーカスが移動することが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5QmkdoYIVOpcnTGuLmRDK0/72165da9142890db44482c76c54649a6/_____2024-08-03_15.49.11.mov" controls></video>

このようなアクセシビリティ上の問題が存在するため、`row-reverse` や `column-reverse`、`order` といった要素の表示順を制御するプロパティの使用は避けられていました。この問題を解決する手段として、`reading-flow` プロパティが提案されています。

## `reading-flow` プロパティで読み上げ順を制御する

`reading-flow` プロパティは Flex または Grid コンテナ内の要素の読み上げ順もしくはキーボードフォーカスの順序を制御するためのプロパティです。`reading-flow` プロパティには以下の値が設定できます。

- `auto`：DOM の順序に従う（デフォルト）
- `flex-visual`：Flex コンテナのみで使用可能。[writing-mode](https://developer.mozilla.org/ja/docs/Web/CSS/writing-mode) に従い、見た目上の順序に従う。例えば英語の場合は左から右に、アラビア語の場合は右から左に読む順序になる。
- `flex-flow`：Flex コンテナのみで使用可能。`flex-flow` プロパティの指定に従う
- `grid-rows`：Grid コンテナのみで使用可能。writing-mode に従い、列の見た目上の順序に従う
- `grid-columns`：Grid コンテナのみで使用可能。writing-mode に従い、行の見た目上の順序に従う
- `grid-order`：Grid コンテナのみで使用可能。`order` プロパティにより変更された順序に従う

記事の冒頭で紹介した Flex コンテナ内の要素の読み上げ順を制御する場合、`reading-flow: flex-visual;` を指定することで見た目上の順序に従って読み上げ順を制御できます。

```diff
.container {
  display: flex;
  flex-direction: column-reverse;
+ reading-flow: flex-visual;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/xxodEwR?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/xxodEwR">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`item 1`、`item 2`、`item 3` の順でキーボードフォーカスが移動することが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/77AZikMANZVRvo3gjc5bH1/4ee5f0e1f4fd083b4b0daaac108f369f/_____2024-08-03_16.17.16.mov" controls></video>

Grid コンテナではより複雑な並び順のレイアウトが可能ですが、同様に `reading-flow: grid-row` プロパティを使用して読み上げ順を制御できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/ExBmgXZ?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ExBmgXZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.    
</iframe>

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5BdCSOGW7MiW52oUhzU8Fp/22c8b11ffcdef56a338c6f1fbd967499/_____2024-08-03_16.51.37.mov" controls></video>

## まとめ

- Flex や Grid コンテナ内の要素の見た目上の順序と DOM 上の順序が異なる場合、アクセシビリティ上の問題が発生する可能性がある
- `reading-flow` プロパティは Flex または Grid コンテナ内の要素の読み上げ順もしくはキーボードフォーカスの順序を制御するためのプロパティ
- `reading-flow: flex-visual;` は Flex コンテナ内の要素の見た目上の順序に従って読み上げ順を制御する
- `reading-flow: grid-row;` は Grid コンテナ内の要素の列の見た目上の順序に従って読み上げ順を制御する

## 参考

- [CSS Display Module Level 4](https://drafts.csswg.org/css-display-4/#reading-flow)
- [\[css-flexbox\]\[css-grid\] Providing authors with a method of opting into following the visual order, rather than logical order · Issue #7387 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/7387)
- [Request for developer feedback on reading-flow and elements with display: contents  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/reading-flow-display-contents?hl=en)
- [フレックスアイテムの順序 - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_flexible_box_layout/Ordering_flex_items)
- [\[css-flexbox\]\[css-grid\] Providing authors with a method of opting into following the visual order, rather than logical order · Issue #7387 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/7387)
