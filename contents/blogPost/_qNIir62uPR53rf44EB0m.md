---
id: _qNIir62uPR53rf44EB0m
title: "CSS Grid Layout の gap を装飾する `column-rule` と `row-rule`"
slug: "css-grid-gap-decoration"
about: "グリッドレイアウトで「列の間に線を引く」といった装飾は多くの場面で必要になります。しかし、flexbox や grid で列の間に線を引くためのプロパティは存在せず、ボーダーや背景色を利用して線のように見せるといったワークアラウンドが必要でした。CSS Grid Layout の gap を装飾する `column-rule` と `row-rule` を使用することにより、flexbox や grid で簡単に列や行の間に線を引くことができるようになります。"
createdAt: "2026-05-08T20:34+09:00"
updatedAt: "2026-05-08T20:34+09:00"
tags: ["css"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4M8U2MzWbXPSm546ch1Am/e59afed7052907ffd32bf643e27ae694/tempura_omusubi_18424-768x768.png"
  title: "天むすのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`rule-break` の説明として、記事の内容に合っているものはどれですか?"
      answers:
        - text: "gap の幅そのものを増減させるプロパティで、デフォルトは `none` である"
          correct: false
          explanation: "`rule-break` は gap の幅を変えるプロパティではなく、交差点で装飾線を途切れさせるかどうかを指定するプロパティとして説明されています。"
        - text: "行の装飾が交差点で途切れるかどうかを指定し、デフォルトの `normal` では T 字交差で線が途切れる"
          correct: true
          explanation: "記事では、`rule-break` のデフォルトは `normal` で、T 字に交差する場合は線が途切れ、十字交差では線が途切れないと説明されています。"
        - text: "線の色を交差点ごとに切り替えるプロパティで、`intersection` は赤と青を交互に指定する"
          correct: false
          explanation: "線の色のパターン指定は `rule-color` と `repeat()` の説明で扱われています。`intersection` は交差点での重なりを調整する値として紹介されています。"
        - text: "flexbox では使えず、CSS Multi-column Layout だけに適用される"
          correct: false
          explanation: "記事全体では、従来 multicol 専用だった `column-rule` を flexbox や grid にも適用できるようにする提案として CSS Gap Decorations が説明されています。"

published: true
---

グリッドレイアウトで「列の間に線を引く」といった装飾は多くの場面で必要になります。CSS で「列の間に区切り線を引く」ためのプロパティとして [`column-rule`](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/column-rule) がありますが、これらは[段組みレイアウト](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/CSS_layout/Multiple-column_Layout)（multicol）専用のプロパティであり、flexbox や grid には適用されませんでした。

flexbox や grid で列の間に線を引きたいという要望は多く存在したものの、それを実現する手段が存在しませんでした。そのためボーダーを特定の列にだけつける、あるいは背景色を利用して線のように見せたり、あるいは `::before` 擬似要素を利用して線を引くといったワークアラウンドが使われてきました。

```css
/* 方法1: 各アイテムの border-right / border-bottom を使い、最後の列・行だけ消す */
.card {
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}
.card:nth-child(3n) {
  border-right: none;
}
.card:nth-last-child(-n + 3) {
  border-bottom: none;
}
```

```css
/* 方法2: gap を背景色で塗りつぶす */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background-color: #ccc;
}

.card {
  /* セルは背景色で塗りつぶす */
  background-color: white;
}
```

しかしこのようなワークアラウンドは直感的でなく、視覚的な表現のためだけに余分なコードが必要になるため、セマンティックな HTML の原則にも反します。またボーダーをつける方法では、列の幅が変わると線の位置も変わってしまうため、都度 `nth-child` で調整する必要があり、保守性も低いという問題もありました。

このような問題を解決するために従来の `column-rule`（multicol 専用だった）を flexbox や grid にも適用できるようにするための提案が行われ、補完的なプロパティとして行の間に線を引くための `row-rule` が追加されることになりました。これらのプロパティを使用することにより、flexbox や grid で簡単に列や行の間に線を引くことができるようになります。

b> gap-decorations

!> CSS Gap Decorations は現時点では実験的な機能です。Chrome と Edge 139 では Developer Trial として提供されており、使用するには `chrome://flags/#enable-experimental-web-platform-features` Experimental Web Platform Features を有効にする必要があります。

この記事では CSS Grid Layout の gap を装飾する `column-rule` と `row-rule` について解説します。

## `column-rule` と `row-rule` の使い方

`column-rule` と `row-rule` を使用した「列の間に線を引く」ためのコードは非常にシンプルです。以下のように flexbox や grid のコンテナに対して、`gap` で余白を確保し、`column-rule` / `row-rule` で装飾します。

`column-rule` は `column-rule-width`（線の太さ）、`column-rule-style`（線のスタイル）、`column-rule-color`（線の色）の 3 つのサブプロパティのショートハンドです。`row-rule` も同様に `row-rule-width`、`row-rule-style`、`row-rule-color` のショートハンドです。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  column-rule: 1px solid #ccc;
  row-rule: 1px solid #ccc;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/6DDupw2vxKdRLfwrHtqSm0/75790b812fbc9415156ed86f13862fd3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-08_20.59.57.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/wBoMQQq?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/wBoMQQq">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

flexbox でも同様に使用できます。`display: flex` と `flex-wrap: wrap` を組み合わせた場合でも、`column-rule` と `row-rule` は gap に対して装飾を適用します。

```css
.flex {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  column-rule: 1px solid #ccc;
  row-rule: 1px solid #ccc;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2Fbw6zOXvhT9BNtSBlfv7I/803c6e2f588e56158f1fcac4dae270ca/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="column-decorations" src="https://codepen.io/azukiazusa1/embed/XJNdzjE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/XJNdzjE">
  column-decorations</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 値の指定に `repeat()` を使用して複雑なパターンの線を引く

`rule-color` プロパティはギャップの装飾の色を指定するプロパティです。`repeat()` 関数と組み合わせることができるため、複雑なパターンの色を指定することもできます。以下の例では、列の間の線を赤と青の交互のパターンにしています。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  column-rule-width: 4px;
  column-rule-style: solid;

  /* 赤と青の交互のパターンにする */
  column-rule-color: repeat(auto, red, blue);
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/46AAoZ7uQVRNfVqenCrOdg/6734c4f01cc81c1e3637fdf4af0218db/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="rule-color" src="https://codepen.io/azukiazusa1/embed/pvNgGvv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pvNgGvv">
  rule-color</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`rule-width` プロパティも同様に `repeat()` 関数と組み合わせることができます。数独のようなグリッドで、列の間の線を太くして区切りをわかりやすくする、といったことも簡単にできます。

```css
.sudoku {
  --cell: 48px;

  display: grid;
  grid-template-columns: repeat(9, var(--cell));
  grid-template-rows: repeat(9, var(--cell));
  gap: 8px;
  padding: 8px;
  width: max-content;

  /* 3 列ごとに太い線を引く */
  column-rule:
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb);

  row-rule:
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb),
    4px solid #111,
    repeat(2, 1px solid #bbb);
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5MBJM86I6XHCzhEaDKxymt/7b2a2f723414bb705fee891d3194213d/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/NPbxoxZ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPbxoxZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## `rule-break` で交差点で線を途切方を指定する

`rule-break` は行の装飾が交差点で途切れるかどうかを指定するプロパティです。デフォルトは `normal` で T 字に交差する場合は線が途切れ、十字交差は線が途切れない状態になります。

スプレッドシートのような表形式のレイアウトを考えてみるとわかりやすいでしょう。セル結合して複数の列にまたがる見出しがある場合、T 字交差が発生します。`rule-break: normal` の場合は、セル結合している列の間の線は途切れていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/36ivGxgUcPVTFlQZ1rYa3v/86fb4d7e59ed076a9e4d054da822e07d/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="sheet" src="https://codepen.io/azukiazusa1/embed/NPbxeYE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPbxeYE">
  sheet</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`rule-break` には `normal` の他に以下のような値があります。

- `none`: セルの結合状況を無視して、常に gap の端から端まで線を引く。セル結合があっても線は貫通する
- `intersection`: `column-rule` と `row-rule` が交差する十字点で、両者が重なり合わないよう描画を調整する。格子の交点で自然な仕上がりになる

先程のセル結合の例で `rule-break: none` にすると、セル結合している列の間の線も途切れずに引かれることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5gCrS8xyC7bPZrQUdMgvjA/807cfff046e78055c56462041de6ea65/image.png)

`rule-break: intersection` と `rule-break: normal` の違いは、十字交差点での見た目に現れます。`normal` では `column-rule` と `row-rule` がそのまま重なって描画されますが、`intersection` では交差点の描画が調整されるため、均一な格子線として見えます。テーブルのように行と列が対等に存在するレイアウトでは `intersection` が適しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/4o5SBHzqtsKeAQztDQKJbz/8fad5cbc8a61b9394d905de5e1b640d6/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/myOVaYL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myOVaYL">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- グリッドレイアウトで列の間に線を引くためにワークアラウンドが必要だった問題に対して、`column-rule` が flexbox や grid にも適用できるようになり、行の間に線を引くための `row-rule` も追加された
- `column-rule` と `row-rule` を使用することで、シンプルに列や行の間に線を引くことができるようになった
- 値の指定に `repeat()` を使用することで、複雑なパターンの線を引くこともできる
- `rule-break` プロパティを使用することで、交差点で線を途切れさせるかどうかを指定できる。デフォルトは `normal` で T 字交差は線が途切れ、十字交差は線が途切れない状態になる。`intersection` に設定すると、テーブルのようなレイアウトで交差点で線が重ならない自然な見た目になる

## 参考

- [CSS Gaps Module Level 1](https://drafts.csswg.org/css-gaps-1/)
- [Proposal: CSS Gap Decorations Level 1 · Issue #10393 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/10393)
- [MSEdgeExplainers/CSSGapDecorations/explainer.md at main · MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSGapDecorations/explainer.md)
- [CSS でギャップのスタイルを設定する新しい方法  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/gap-decorations?hl=ja)
- [The Gap Strikes Back: Now Stylable | CSS-Tricks](https://css-tricks.com/the-gap-strikes-back-now-stylable/)
