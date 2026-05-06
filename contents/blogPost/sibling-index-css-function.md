---
id: ee-kiuIweTYq2ajLtjb1I
title: "兄弟要素のインデックスを返す CSS 関数 sibling-index()"
slug: "sibling-index-css-function"
about: "`sibling-index()` は要素の兄弟要素の中でのインデックスを返します。`sibling-index()` 関数により取得したインデックスを使用することにより、スタッガー（時間差）アニメーションや、色相を段階的に変えるといった、兄弟要素の位置に基づいたスタイリングが可能になります。これまでは JavaScript を使用して実装する必要があったような効果も、純粋な CSS で実現できるようになります。"
createdAt: "2026-05-06T11:55+09:00"
updatedAt: "2026-05-06T11:55+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3ulQYe5NFc8ZqEjhPXHo2x/cc22085819bfa4cd457cbb5fc2548ff9/animal_cute_shika_4776-768x759.png"
  title: "かわいい鹿のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`sibling-index()` が返す値として、記事で説明されているものはどれですか？"
      answers:
        - text: "同じ親を持つ要素の総数"
          correct: false
          explanation: "同じ親を持つ要素の総数を返すのは `sibling-count()` です。`sibling-index()` は現在の要素の位置を返します。"
        - text: "現在の要素が兄弟要素の中で何番目に位置しているかを示すインデックス"
          correct: true
          explanation: "記事では、`sibling-index()` は要素の兄弟要素の中でのインデックスを返し、インデックスは 1 から始まると説明されています。"
        - text: "現在の要素に指定された CSS カスタムプロパティの値"
          correct: false
          explanation: "記事では、従来はカスタムプロパティでインデックスを持たせる必要があったと説明されていますが、`sibling-index()` が返す値ではありません。"
        - text: "親要素から見た子孫要素全体の階層の深さ"
          correct: false
          explanation: "記事では階層の深さを返す関数としては説明されていません。対象は同じ親を持つ兄弟要素の中での位置です。"
published: true
---
`sibling-index()` は CSS Values and Units Module Level 5 で定義された関数で、要素の兄弟要素の中でのインデックスを返します。インデックスは 1 から始まり、同じ親を持つ要素の中で、現在の要素が何番目に位置しているかを示します。例えば、ある要素が親の子要素の中で 3 番目に位置している場合、`sibling-index()` は 3 を返します。

```css
li {
  /* 3 番目の要素なら 3 * 50px = 150px の幅にする */
  width: calc(sibling-index() * 50px);
  background-color: lawngreen;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/ogYjobv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ogYjobv">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`sibling-index()` 関数により取得したインデックスを使用することにより、スタッガー（時間差）アニメーションや、色相を段階的に変えるといった、兄弟要素の位置に基づいたスタイリングが可能になります。これまでは JavaScript を使用して実装する必要があったような効果も、純粋な CSS で実現できるようになります。

b> sibling-count

`sibling-index()` 関数が提案される以前でも `:nth-child()` や `:nth-of-type()` といった擬似クラスを使用して、兄弟要素の位置に基づいたスタイリングは可能でした。しかし、これらの擬似クラスは特定のパターンにマッチする要素を選択するためのものであり、要素自身が自分のインデックスを知ることはできませんでした。インデックスを取得したい場合には以下のような冗長なコードが必要でした。

```css
li {
  width: calc((var(--index) + 1) * 50px);
  background-color: lawngreen;
}

/* 要素の数だけ同様のコードが続く... */
li:nth-child(1) {
  --index: 0;
}
li:nth-child(2) {
  --index: 1;
}
li:nth-child(3) {
  --index: 2;
}
```

インデックスや個数を計算に使いたいというニーズは継続的に存在していましたが、これまでは CSS だけで完結させることができませんでした。`sibling-index()` 関数の追加により、これらのニーズを CSS だけで満たすことができるようになります。この記事では `sibling-index()` 関数を使用したスタイリングの例をいくつか紹介します。

## スタッガー（時間差）アニメーション

スタッガーアニメーションは、同一の要素に対してアニメーションの開始時間をずらすことで、波のような動きを作り出すテクニックです。`animation-delay` の計算に `sibling-index()` を使用することで、兄弟要素の位置に応じてアニメーションの開始時間をずらすことができます。以下のコード例では、リストアイテムが順番にフェードインするスタッガーアニメーションを実装しています。

```css
li {
  opacity: 0;
  transform: translateX(-12px);
  animation: slide-in 0.5s ease-out forwards;
  /* 1番目=120ms, 2番目=240ms, ... */
  animation-delay: calc(sibling-index() * 120ms);
}

@keyframes slide-in {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/1d0ptGDU0MzhukPrKYi8Tb/3317fb2e738aa32f4e7bb17d14ca8b9e/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-05-06_13.16.37.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qEqOVae?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qEqOVae">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 色相を段階的に変える

`sibling-index()` と `sibling-count()` を組み合わせることで、色相を段階的に変えるといったスタイリングも可能になります。`sibling-count()` は同じ親を持つ要素の総数を返す関数です。`sibling-index()` で取得したインデックスを角度（`hue`）に変換し、`oklch()` 関数の色相に渡すことで、実現しています。`sibling-count()` と組み合わせれば、要素が何個でも開始 hue から終了 hue まで均等に色相が変化するようにできます。

```css
li {
  --start: 200;
  --end: 320;
  background: oklch(
    65% 0.15
      calc(
        var(--start) + (var(--end) - var(--start)) / (sibling-count() - 1) *
          (sibling-index() - 1)
      )
  );
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/7dq7wplghCsAY4G2S5XKLl/6eef1c5892c1bc764775135c6c557723/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="sibling-index() oklch demo" src="https://codepen.io/azukiazusa1/embed/EaNVbWJ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/EaNVbWJ">
  sibling-index() oklch demo</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 扇形の配置

`sibling-index()` を使用して、要素の位置に応じた角度を計算し、`transform: rotate()` で回転させることで、扇形に要素を配置できます。扇形の配置に必要なのは、各要素を中心点を基準に異なる角度で回転させることです。扇全体の広がり（最大 360 度）を `--spread` として定義し、要素の数に応じてステップ角度を計算します。各要素の最終的な角度は、ステップ角度とインデックスから計算されます。

```css
.card {
  --spread: 60deg; /* 扇全体の広がり */
  --radius: 240px; /* 扇の半径 */

  /* 1 枚あたりのステップ角度 */
  --step: calc(var(--spread) / (sibling-count() - 1));

  /* 各カードの最終的な角度 (中央=0deg) */
  --angle: calc(var(--step) * (sibling-index() - 1) - var(--spread) / 2);

  /* カードを回転させる */
  transform: rotate(var(--angle)) translateY(calc(var(--radius) * -1));
  transform-origin: bottom center;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/3I5Bujdysm09OV5uy2gyZ5/7f82fa93188a6c029c0ec7d4068edc9d/image.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/RNoWjjG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/RNoWjjG">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 円形に出現するメニュー項目

フローティングアクションボタンでよく見る演出で、ボタンにカーソルを合わせると、複数のメニュー項目が円形に出現するというものがあります。これも `sibling-index()` を使用して、要素の位置に応じた角度を計算し、`transform: rotate()` で回転させることで実装できます。扇形の配置と同様に、各要素を中心点を基準に異なる角度で回転させることがポイントです。

```css
/* 円周上に並ぶメニュー項目 */
.menu .item {
  /* 1 始まりの index を 0 始まりに揃える */
  --i: calc(sibling-index() - 1);

  /* 中央のトリガーは数えたくないので - 1 で調整 */
  --total: calc(sibling-count() - 1);

  /* 円周を均等分割した角度 */
  --angle: calc(360deg / var(--total) * var(--i));

  /* 半径とアニメーション速度 */
  --radius: 110px;
  --delay-step: 70ms;

  /* 初期状態はすべて重なっていて透明 */
  transform: rotate(var(--angle)) translateY(0) rotate(calc(var(--angle) * -1));
  opacity: 0;

  /* index に応じてアニメーションの開始時間をずらす */
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
      calc(var(--i) * var(--delay-step)),
    opacity 0.3s ease-out calc(var(--i) * var(--delay-step));
}

/* トリガーにホバーしたとき、メニュー項目を円形に展開 */
.menu:hover .item {
  /* index に応じた角度で回転させて、半径分だけ移動させる */
  transform: rotate(var(--angle)) translateY(calc(var(--radius) * -1))
    rotate(calc(var(--angle) * -1));
  opacity: 1;
}
```

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/65olEaJkJt0VR9f9nIQBpi/cd1fdea5087c415f800e27fa513c2f0c/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-05-06_14.15.41.mov"></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/WboQXMz?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WboQXMz">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `sibling-index()` は要素の兄弟要素の中でのインデックスを返す CSS 関数
- `sibling-count()` は同じ親を持つ要素の総数を返す CSS 関数
- これらの関数を使用することで、スタッガーアニメーションや色相の段階的な変化、扇形の配置など、兄弟要素の位置に基づいたスタイリングが可能になる

## 参考

- [sibling-index() - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Values/sibling-index)
- [CSS Values and Units Module Level 5](https://drafts.csswg.org/css-values-5/#funcdef-sibling-index)
- [\[css-values\] Proposal: add sibling-count() and sibling-index() · Issue #4559 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/4559)
- [csswg-drafts/css-values-5/tree-counting-explainer.md at main · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/blob/main/css-values-5/tree-counting-explainer.md)
