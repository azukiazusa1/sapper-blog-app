---
id: LhvSTniEPZnf2FsQek-PU
title: "box-shadow で実装されたフォーカスリングはハイコントラストモードで表示されない"
slug: "box-shadow-focus-ring-not-visible-in-high-contrast-mode"
about: "フォーカスリングとは、キーボード操作でフォーカスが当たった要素を視覚的に示すための UI デザインのことです。フォーカスリングのカスタマイズに `box-shadow` プロパティを使うことがありますが、ハイコントラストモードではフォーカスリングが表示されない問題があります。この記事では、ハイコントラストモードでフォーカスリングを表示する方法について解説します。"
createdAt: "2024-08-11T14:42+09:00"
updatedAt: "2024-08-11T14:42+09:00"
tags: ["", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1GY9JhecokyNHOpl057BZR/c17178d7be348824769e0d5374c5e5ad/b-dama_colorful_18382.png"
  title: "カラフルなビー玉のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "通常時はアウトラインを非表示にして、ハイコントラストモードでフォーカスリングを表示する実装方法はどれか？"
      answers:
        - text: "outline: 0;"
          correct: false
          explanation: null
        - text: "outline: 2px solid transparent;"
          correct: true
          explanation: "outline の色を透明にすることで、フォーカスリングを非表示にしつつ、ハイコントラストモードでは表示することができます。"
        - text: "outline: 2px solid red;"
          correct: false
          explanation: null
        - text: "outline: none;"
          correct: false
          explanation: null
published: true
---
フォーカスリングとは、キーボード操作でフォーカスが当たった要素を視覚的に示すための UI デザインのことです。フォーカスリングはキーボード操作をしているユーザーにとって現在のフォーカス位置を把握するための重要な要素です。このことは WCAG 2.2 の 2.4.7 項目で要求されています。

> (レベル AA)
> キーボード操作が可能なあらゆるユーザインタフェースには、フォーカスインジケータが見える操作モードがある。

[達成基準 2.4.7 フォーカスの可視化](https://waic.jp/translations/WCAG22/#focus-visible)

ブラウザのデフォルトのスタイルでは `outline` プロパティを使って実装されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/1wSe9emYjnyTSb4QkYHoXt/550d4ee8bfdaa6bc536a07b560c6645c/__________2024-08-11_14.51.20.png)

デフォルトのスタイルはブラウザによって差異があり、また多くのブラウザでは青色のリングとして表示されるため、プロダクトのデザインに合わせるためカスタマイズして表示したいことでしょう。CSS の `outline` プロパティの値を変更することで、色や太さを変更できます。下記の CSS の例では、フォーカスリングの色を赤色に変更し、より太く表示するようにしています。

```css
button:focus {
  outline: 2px solid red;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5B6n8FzxG8SmwpAXWCykB3/d6c137d23c842403a5f65d1dc8a9586a/__________2024-08-11_15.04.24.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/MWMEvLd?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/MWMEvLd">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## `box-shadow` で実装されたフォーカスリング

より柔軟なデザインを実現するために、`box-shadow` プロパティを使ってフォーカスリングを実装することもあります。例えば `box-shadow` プロパティを使えば自由な形状のフォーカスリングを作成できたり、元の要素の width や height を気にせずに実装できるというメリットがあります。

`box-shadow` プロパティを使ってフォーカスリングを実装する場合、ブラウザのデフォルトの `outline` が表示されないようにする必要があります。

```css
button:focus {
  outline: 0;
  box-shadow: 0 0 3px 1px red;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4B6pDMCFg7XTKn8ukdcwsy/188ce4b2f28676007e3e7f4d66b44aa8/__________2024-08-11_15.26.32.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GRbMvLy?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GRbMvLy">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## ハイコントラストモードでは `box-shadow` が表示されない

`box-shadow` プロパティを使用したフォーカスリングは CSS フレームワークをはじめ多くのウェブサイトで利用されています。しかし、先ほどの `outline: 0;` を使用して元の `outline` を非表示にした場合、ハイコントラストモードでフォーカスリングが表示されないという問題があります。

ハイコントラストモードは Windows などの　OS で提供されているアクセシビリティ機能の 1 つで、コントラスト比が高い配色に変更することで、視覚障害のあるユーザーがウェブサイトを利用しやすくするための機能です。

ハイコントラストモードを使用している場合、強制的に配色が変更されるため、以下の CSS プロパティはブラウザが指定した値が代わりに適用されます。

- `color`
- `background-color`
- `text-decoration-color`
- `text-emphasis-color`
- `border-color`
- `outline-color`
- `column-rule-color`
- `-webkit-tap-highlight-color`
- SVG fill 属性
- SVG stroke 属性

また、以下のプロパティは特別な扱いとなります。

- `box-shadow`：`none` に強制される
- `text-shadow`：`none` に強制される
- `background-image`：URL ベースの文字列ではない場合、`none` に強制される
- `color-schema`：`light dark` に強制される
- `scrollbar-color`：`auto` に強制される

上記の通り、ハイコントラストモードでは `box-shadow` プロパティが `none` に強制されるため、フォーカスリングが表示されなってしまうのです。

ハイコントラストモードは Chrome の Devtools のコマンドパレットを `Ctrl + Shift + P` で開き、「Emulate CSS forced-color:auto」を検索することで有効にできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3z9xptlNOC5oT5rt4Jm9EB/4009dcc5ddfb528f578451801dcea034/__________2024-08-11_15.45.54.png)

確かに、ハイコントラストモードを有効にすると、ボタンにフォーカスしてもフォーカスリングが表示されません。

![](https://images.ctfassets.net/in6v9lxmm5c8/5PxrrhQmlWE9zGQnCDK2iz/6e60aebaf85e6280f7e88bee078b7abc/__________2024-08-11_15.47.31.png)

## ハイコントラストモードでもフォーカスリングを表示する

ハイコントラストモードでもフォーカスリングを表示するためには `outline` を非表示にしないことが必要です。ワークアラウンドとして、`outline` プロパティを `transparent` に設定する方法があります。

```css
button:focus {
  outline: 2px solid transparent;
  box-shadow: 0 0 3px 1px red;
}
```

この方法を用いることで、通常時は非表示になる `outline` をハイコントラストモードにおいては表示できます。ハイコントラストモードではデフォルトの `outline` が表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5Kot8NqHg1Fk7SckGCWvUV/2c2c582ab5b57c80bda80588af025b3e/__________2024-08-11_15.58.38.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/OJexxyw?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/OJexxyw">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 参考

- [Web Accessibility Cookbook](https://accessibility-cookbook.com/)
- [accessibility - CSS box-shadow vs outline - Stack Overflow](https://stackoverflow.com/questions/52589391/css-box-shadow-vs-outline)
- [forced-colors - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@media/forced-colors)
