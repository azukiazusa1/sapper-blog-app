---
id: ApAJY5BzlnqFfMMnGSkB6
title: "`contrast-color()` 関数を使用した自動コントラスト調整"
slug: "automatic-contrast-adjustment-with-contrast-color-function"
about: "`contrast-color()` 関数は、指定した色に対して `white` もしくは `black` のどちらがより高いコントラスト比を持つかを自動的に判断し、適切な色を返す関数です。動的に色が変わる場合やユーザーがカスタムテーマを使用する場合など、常にコントラスト比を確保するのが難しい状況で役立ちます。"
createdAt: "2026-04-28T20:58+09:00"
updatedAt: "2026-04-28T20:58+09:00"
tags: ["CSS", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10j9bepBZ34HUkLxtsSLfz/4ac28382b1c7f186e89baa4864b10322/pirate-ship_13574-768x729.png"
  title: "海賊船のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`contrast-color()` 関数の基本的な役割として、記事で説明されているものはどれですか?"
      answers:
        - text: "指定した色に対して、`white` または `black` のうちコントラスト比が高い方を返す"
          correct: true
          explanation: "記事では、`contrast-color()` は指定した色に対して `white` もしくは `black` のどちらがより高いコントラスト比を持つかを判断して返す関数だと説明されています。"
        - text: "指定した色の明度を HSL 値から計算して、新しい背景色を返す"
          correct: false
          explanation: "HSL 値を使ってテキスト色の明度を調整する方法は GitHub ラベルの例として紹介されていますが、`contrast-color()` の基本的な役割ではありません。"
        - text: "背景色と前景色の両方を自動的に生成して、常に同じ配色に固定する"
          correct: false
          explanation: "記事では、`contrast-color()` は渡された色に対する `white` または `black` を返す関数として説明されています。背景色と前景色の両方を固定する関数ではありません。"
        - text: "任意の候補色リストから、ブラウザが選んだ色を返す"
          correct: false
          explanation: "初期の仕様では候補色のリストやアルゴリズムを指定できる案がありましたが、現在の記事で説明されている実装は `black` と `white` のどちらかを返すものです。"
published: true
---
コントラスト比とは、テキストや要素の前景色と背景色の明るさの差を数値化したものです。ウェブアクセシビリティの観点から、十分なコントラスト比を確保することは重要です。視覚障害のあるユーザーや高齢者にとって、低コントラストのテキストは読みづらく、情報を理解するのが難しくなります。また、屋外の強い日差しの下といった環境条件によっても、コントラストの重要性が増します。

WCAG（Web Content Accessibility Guidelines）の基準では、最低限のコントラスト比を以下のように定めています。

| レベル | 通常テキスト | 大きなテキスト（18pt以上、または14pt以上の太字） |
| ------ | ------------ | ------------------------------------------------ |
| AA     | 4.5:1        | 3:1                                              |
| AAA    | 7:1          | 4.5:1                                            |

静的に色を指定する場合はあらかじめ上記の基準を満たすように色を選択することが求められますが、動的に色が変わる場合やユーザーがカスタムテーマを使用する場合など、常にコントラスト比を確保するのは難しいことがあります。例えば GitHub のラベルはユーザーが自由に色を選択できるため、常に同じテキスト色を使用していると、コントラスト比が十分とならないことがあります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7qXfHJzQpJeCNKJEGZx37h/e915809b6a5538f4bfadcde8d57d4258/image.png)

このような状況では、`hsl()` 関数を使用して、背景色に対して十分なコントラスト比を持つテキスト色を動的に生成することができます。GitHub のラベルの例では、背景色の HSL 値を使用して、テキスト色の明度を調整することで、常に十分なコントラスト比を確保しています。

```css
.label {
  color: hsl(
    var(--label-h),
    calc(var(--label-s) * 1%),
    calc((var(--label-l) + var(--lighten-by)) * 1%)
  );
}
```

ただしこのような方法は、背景色の HSL 値を正確に把握し、適切な計算を行う必要があるため、実装が複雑になることがあります。CSS ネイティブな方法でコントラスト比を自動的に調整する方法として、`contrast-color()` 関数があります。

b> contrast-color

## contrast-color() 関数の概要

`contrast-color()` 関数は、指定した色に対して `white` もしくは `black` のどちらがより高いコントラスト比を持つかを自動的に判断し、適切な色を返す関数です。例えば `contrast-color(blue)` と指定すると、青色に対してコントラスト比が高い方の色（この場合は `white`）が返されます。一方で `contrast-color(yellow)` と指定すると、黄色に対してコントラスト比が高い方の色（この場合は `black`）が返されます。`white` と `black` のコントラスト比が同じ場合には `white` が返されます。アルゴリズムはブラウザの実装により異なる可能性があります。

```css
.element {
  /* data- 属性から背景色を取得 */
  --bg-color: attr(data-bg-color type(<color>));
  background-color: var(--bg-color);
  /* white と black のどちらが bg-color に対してコントラスト比が高いかを自動的に判断して適用 */
  color: contrast-color(var(--bg-color));
}
```

まだすべてのブラウザでサポートされているわけではないため、実際に使用する場合には `@supports` を使ってフォールバックを用意しておくと良いでしょう。

```css
.element {
  background-color: var(--bg-color);
  color: white;
}

@supports (color: contrast-color(red)) {
  .element {
    color: contrast-color(var(--bg-color));
  }
}
```

Chrome v147 以降で `contrast-color()` 関数が機能していることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1njhymBrYz7ItPqz4RJSx4/bb41b53517cf6b687440a72843bd9095/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/XJNryEp?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/XJNryEp">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

:::info
`contrast-color()` 関数の初期の仕様では、候補色のリストやアルゴリズムを指定できる、より柔軟な機能が提案されていました（[CSSWG issue #7954](https://github.com/w3c/csswg-drafts/issues/7954)）。しかし、仕様の合意が取れない状態が長引いたことが原因となり、最小限の機能として `black` と `white` のどちらかを返すシンプルな関数として実装されることになりました（[CSSWG issue #9166](https://github.com/w3c/csswg-drafts/issues/9166)）。現実の現場では black/white だけでは足りないという議論もあり、今後の仕様の拡張に期待されます。
:::

`prefers-color-scheme: dark` のようなダークモードの切り替えに合わせて、背景色が変わる場合などにも、`contrast-color()` 関数を使用することで、常に十分なコントラスト比を確保するという使い方もできます。

```css
:root {
  --bg-color: white;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: black;
  }
}

.element {
  background-color: var(--bg-color);
  color: contrast-color(var(--bg-color));
}
```

`black` か `white` どちらかの値しか返さない制限を回避するために、`color-mix()` 関数を組み合わせて、より多様なコントラストカラーを生成する方法も考えられます。例えば、`contrast-color()` 関数で得られた色と背景色を `color-mix()` 関数で色を混ぜることで、単に白黒ではない色を生成することができます。

```css
.element {
  --bg-color: oklch(50% 0.1 270);
  background-color: var(--bg-color);
  /* contrast-color() 関数で得られた色と背景色を color-mix() 関数で混ぜる */
  color: color-mix(
    in srgb,
    contrast-color(var(--bg-color)) 80%,
    var(--bg-color) 20%
  );
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="contract-color" src="https://codepen.io/azukiazusa1/embed/GgNKPOg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgNKPOg">
  contract-color</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ただし、元の背景色の割合（ここは 20%）を増やすと、コントラスト比が下がる可能性があります。この手法を使用する場合には、コントラスト比が十分であることを確認するために、WCAG のコントラスト比チェッカーなどを使用してテストすることをおすすめします。

もしくは、`if()` 関数を使用して、`black` と `white` を条件に異なる色を返す方法も考えられます。この場合も、コントラスト比が十分であることを確認するために、テストを行うことが重要です。

```css
/**
* style() クエリを使用した時に、ブラウザが正しく値を <color> 型として判定できるように
* --contrast-color カスタムプロパティに syntax: "<color>" を指定しておく必要がある
*/
@property --contrast-color {
  syntax: "<color>";
  initial-value: white;
  inherits: true;
}

.element {
  --bg-color: attr(data-bg-color type(<color>));
  background-color: var(--bg-color);
  --contrast-color: contrast-color(var(--bg-color));
  /** if は条件が true の場合は first、false の場合は second を返す関数 */
  color: if(
    style(--contrast-color: black): oklch(43.5% 0.029 321.78) ;
      else: oklch(86.9% 0.005 56.366)
  );
  padding: 1rem;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="contrast-color" src="https://codepen.io/azukiazusa1/embed/YPpKdoX?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/YPpKdoX">
  contrast-color</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 既知の制限と注意点

`contrast-color()` 関数を使用しても、結果として得られる色の組み合わせが必ずしもアクセシブルではないことがあります。例えば背景色に `#2277d3` のような中間色を `contrast-color()` 関数に渡した場合、コントラストカラーとして `black` を返します。たしかに [WCAG 2 のコントラスト比チェッカー](https://webaim.org/resources/contrastchecker/) で調べてみると `black` は `4.64:1` に対して `white` は `4.51:1` となり、数値上は `black` の方がコントラスト比が高いことになります。しかし、実際の視覚的な印象としては、`white` の方が見やすいと感じる人も多いでしょう。これは、コントラスト比の数値だけではなく、色の特性や人間の視覚の特性も考慮する必要があるためです。

![](https://images.ctfassets.net/in6v9lxmm5c8/3p33uSBzVRTz2fozR3t99/98add399b60170977b1720cecca8c6ac/image.png)

WCAG 3 で採用が検討されている APCA（Advanced Perceptual Contrast Algorithm）では、コントラスト比の計算方法が変更され、より人間の視覚に近い評価ができるようになる予定です。将来的に `contrast-color()` 関数が APCA に対応するようになれば、より適切なコントラストカラーが返されるようになることが期待されます。現時点では `contrast-color()` 関数に中間色を渡すべきではないということを覚えておくと良いでしょう。

たとえ `contrast-color()` 関数のアルゴリズムが改善されたとしても、まだ完全にアクセシビリティを保証するものではないことに注意が必要です。コントラスト比は文字の大きさや太さ、フォントの種類などによっても影響を受けるため、`contrast-color()` 関数を使用する際には、他のアクセシビリティのベストプラクティスも併せて考慮することが重要です。

またより高いコントラスト比を希望する `prefers-contrast: more` メディアクエリが指定されている場合は異なるスタイルを適用するなど、ユーザーのアクセシビリティのニーズに合わせた柔軟な対応も検討すると良いでしょう。

## まとめ

- `contrast-color()` 関数は、指定した色に対して `white` もしくは `black` のどちらがより高いコントラスト比を持つかを自動的に判断し、適切な色を返す関数である
- 動的に色が変わる場合やユーザーがカスタムテーマを使用する場合など、常にコントラスト比を確保するのが難しい状況で役立つ
- `white` か `black` どちらかの値しか返さない制限を回避するために、`color-mix()` 関数や `if()` 関数を組み合わせて、より多様なコントラストカラーを生成する方法もある
- ただし、`contrast-color()` 関数を使用しても、結果として得られる色の組み合わせが必ずしもアクセシブルではないことがあるため、他のアクセシビリティのベストプラクティスも併せて考慮することが重要である

## 参考

- [contrast-color() - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Values/color_value/contrast-color)
- [CSS Color Module Level 5](https://drafts.csswg.org/css-color-5/#contrast-color)
- [Success Criterion 1.4.3 Contrast (Minimum)](https://w3c.github.io/wcag/guidelines/22/#contrast-minimum)
- [How to have the browser pick a contrasting color in CSS | WebKit](https://webkit.org/blog/16929/contrast-color/)
- [una.im | Automated accessible text with contrast-color()](https://una.im/contrast-color)
- [una.im | contrast-color() beyond black & white](https://una.im/advanced-contrast-color)
