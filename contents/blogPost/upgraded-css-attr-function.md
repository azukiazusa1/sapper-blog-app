---
id: LIuhtX1Ea2nSCAAzWDcmH
title: "アップグレードされた CSS の `attr()` 関数を使う"
slug: "upgraded-css-attr-function"
about: "`attr()` 関数は HTML の属性を読み取り、それを CSS で利用できるようにする関数です。従来までは `content` プロパティのみで使用できましたが、CSS Values and Units Module Level 5 ではこの制限が見直され、`attr()` 関数がカスタムプロパティを含む任意の CSS プロパティで使用できるようになりました。"
createdAt: "2025-02-22T17:00+09:00"
updatedAt: "2025-02-22T17:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6wzaMJqECxJhZnxu6P09gx/17378b55dd5eb61ff1cd6a294a4d9930/negi_nabe_11559-768x689.png"
  title: "ネギ鍋のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "CSS の `attr()` 関数で `data-color` 属性を `<color>` 型に解析する記述方法として正しいものはどれか"
      answers:
        - text: "attr(data-color type(<color>), black)"
          correct: true
          explanation: null
        - text: "attr(data-color type(color), black)"
          correct: false
          explanation: null
        - text: "attr(data-color, color, black)"
          correct: false
          explanation: null
        - text: "attr(data-color, type<color>, black)"
          correct: false
          explanation: null
published: true
---
`attr()` 関数は HTML の属性を読み取り、それを CSS で利用できるようにする関数です。よくある使われ方として `data-*` 属性の値を読み取りその値をコンテンツに表示するというものです。

```html
<ul>
  <li data-fruit="🍎">Apple</li>
  <li data-fruit="🍌">Banana</li>
  <li data-fruit="🍊">Orange</li>
</ul>

<style>
  li::before {
    content: attr(data-fruit);
  }
</style>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/QwWNeaV?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/QwWNeaV">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`attr()` 属性のもっと複雑な使用例も思いつきそうなのですが、`attr()` 属性は `content` プロパティのみで使用できるという制限がありました。しかし、CSS Values and Units Module Level 5 ではこの制限が見直され、`attr()` 関数がカスタムプロパティを含む任意の CSS プロパティで使用できるようになりました。また、値を `<string>` 型以外にも解析可能です。この機能は Chrome v133 以降で利用可能です。

b> attr

この記事では新しい `attr()` 関数の使い方を紹介します。

## 動的にカラーを指定する

記事のリストがあって、記事のカテゴリごとに文字色やボーダーの色を変えたい、みたいな状況だったします。素朴に書くと以下のように記事のカテゴリごとに CSS の class を指定することになります。

```html
<div class="entry categoryLife">
  <!-- ... -->
</div>

<div class="entry categoryTech">
  <!-- ... -->
</div>

<div class="entry categoryFood">
  <!-- ... -->
</div>
```

```css
.entry {
  /* ... */
}

.categoryLife {
  color: red;
  border-color: red;
}

.categoryTech {
  color: blue;
  border-color: blue;
}

.categoryFood {
  color: green;
  border-color: green;
}
```

この方法はカテゴリが増えるたびに CSS を追加しなければならないので、管理が面倒です。代わりに `attr()` 関数を使った方法を試してみましょう。

先ほどの例で `className` にカテゴリ名を指定する代わりに、`data-color` 属性にカラーコードを指定します。

```html 
<div class="entry" data-color="red">
  <!-- ... -->
</div>

<div class="entry" data-color="blue">
  <!-- ... -->
</div>

<div class="entry" data-color="green">
  <!-- ... -->
</div>
```

CSS 側では `attr()` 関数を使用して `data-color` の値を読み取ります。このとき `attr()` で取得した値が `<string>` 型ではなく `<color>` 型として解釈されるように `attr()` 関数に属性の型（`type(<color>)`）を指定します。また 2 つ目の引数にはフォールバック値を指定します。

```css
.entry {
  color: attr(data-color type(<color>), black);
  border: 1px solid attr(data-color type(<color>), black)
}
```

これによりカテゴリごとに CSS を追加する必要がなくなり、`.entry` クラスだけを管理すればよくなります。

とはいえ CSS のカスタムプロパティを `style` 属性に指定すれば今までも同じようなことができました。

```html
<div class="entry" style="--color: red">
  <!-- ... -->
</div>
  
<div class="entry" style="--color: blue">
  <!-- ... -->
</div>

<div class="entry" style="--color: green">
  <!-- ... -->
</div>
```

```css
.entry {
  color: var(--color, black);
  border: 1px solid var(--color, black);
}
```

それぞれの方法に一長一短があると思いますが、`attr()` 属性を使用する方法はスコープがより限られているという点で利点があると言えます。`attr()` 属性はその要素のみの属性を読み取るため、親要素の `data-*` 属性を誤って読み取る心配がありません。

## グリッドレイアウトで使用する

グリッドレイアウトにおいてそれぞれのセルの幅を個別の要素で指定する場合には `grid-column` や `grid-row` プロパティを使用します。`grid-column` や `grid-row` プロパティに `span <integer>` を指定することでセルの幅を指定できますが、使いたいセルの幅ごとに CSS を追加するのは不便です。

セルの幅を `data-colspan` 属性で指定し、`attr()` 関数を使用してその値を読み取るようにすれば、簡単にセルの幅を指定できます。

```html
<div class="grid">
  <div class="cell" data-colspan="2">2</div>
  <div class="cell" data-colspan="3">3</div>
  <div class="cell" data-colspan="1">1</div>
  <div class="cell" data-colspan="4">4</div>

  <div class="cell" data-colspan="5">5</div>
  <div class="cell" data-colspan="5">5</div>
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}

.cell {
  grid-column: span attr(data-colspan type(<integer>), 1);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/mydEbJx?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/mydEbJx">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

その他にも `grid-template-area` プロパティで使用する名前を `attr()` 関数で指定する方法も便利です。`grid-area` プロパティに指定する方は `<custom-ident>` 型です。

```html
<div class="grid">
  <header data-name="head">ヘッダー</header>
  <nav data-name="nav">ナビゲーション</nav>
  <main data-name="main">メイン領域</main>
  <footer data-name="foot">フッター</footer>
</div>
```

```css
.grid {
  display: grid;
  width: 100%;
  height: 250px;
  grid-template-areas:
    "head head"
    "nav  main"
    ".  foot";
  grid-template-rows: 50px 1fr 30px;
  grid-template-columns: 150px 1fr;
  
  & > * {
    grid-area: attr(data-name type(<custom-ident>), auto);
    border: 1px solid #bbb;
  }
}
```

## まとめ

- CSS Values and Units Module Level 5 では `attr()` 関数がカスタムプロパティを含む任意の CSS プロパティで使用できるようになる。Chrome v133 以降で利用可能
- 新しい `attr()` 関数では `<string>` 型以外にも `<color>`, `<integer>`, `<custom-ident>` などのさまざまな型を解析可能
- `attr()` 関数の 2 つ目の引数にはフォールバック値を指定できる

## 参考

- [CSS attr() のアップグレード  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/advanced-attr?hl=ja)
- [attr() - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/attr)
- [7.7. Attribute References: the attr() notation](https://drafts.csswg.org/css-values-5/#attr-notation)
