---
id: qZT6XmBzlfnuDwwCU0opf
title: "flex-wrap: balance で Flexbox の折り返しを均等にする"
slug: "balance-flex-lines-with-flex-wrap-balance"
about: "flex-wrap: wrap では、最後の行に少数のアイテムだけが残り、行ごとのアイテムの量が大きく偏ることがあります。flex-wrap: balance は、通常の折り返しで決まる行数を維持しながら、各行の長さが近くなるように Flex アイテムを振り分けます。この記事では balance 使い方について紹介します。"
createdAt: "2026-08-30T19:06+09:00"
updatedAt: "2026-08-30T19:06+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3SN9mgUHBid0xGpl0bczaR/6c87c65fcca690c71ca4a0da033bda66/bread_bread-roll_5687-768x628.png"
  title: "ロールパンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "通常の `flex-wrap: wrap` と比べた `flex-wrap: balance` の挙動として、記事の説明に合うものはどれですか？"
      answers:
        - text: "アイテムが 1 行に収まるまで、すべてのアイテムの幅を縮小する"
          correct: false
          explanation: "`balance` はすべてを 1 行へ収める値ではありません。複数行の Flexbox としてアイテムを折り返します。"
        - text: "通常の折り返しで決まる行数を維持し、各行の長さが近くなるように改行位置を選び直す"
          correct: true
          explanation: "記事では、通常の `wrap` で行数を求めた後、その行数へアイテムを均等に振り分けると説明しています。"
        - text: "最後の行だけに `justify-content: space-between` を自動で適用する"
          correct: false
          explanation: "`balance` が変更するのはアイテムを各行へ分ける位置です。`justify-content` の値を変更する機能ではありません。"
        - text: "DOM 上のアイテムを幅の短い順へ並べ替えてから折り返す"
          correct: false
          explanation: "記事では、`balance` は DOM 順を維持した連続するアイテム群へ分けると説明しています。"
    - question: "`flex-line-count: 2` の意味として、記事の説明に合うものはどれですか？"
      answers:
        - text: "均等化に使用する最小行数を 2 にする"
          correct: true
          explanation: "`flex-line-count` は、`balance` でアイテムを均等化するときの最小行数を指定します。"
        - text: "アイテムが収まらない場合でも行数を必ず 2 以下に制限する"
          correct: false
          explanation: "`flex-line-count` は最大行数ではありません。アイテムを収めるために必要なら 3 行以上が作られます。"
        - text: "各行へ必ず 2 個ずつアイテムを配置する"
          correct: false
          explanation: "指定するのはアイテム数ではなく最小行数です。各行に何個入るかはアイテムのサイズによって決まります。"
        - text: "2 行目から後の Flex アイテムを非表示にする"
          correct: false
          explanation: "`flex-line-count` は表示を切り詰めるプロパティではなく、Flex アイテムを行へ振り分ける際に使われます。"
published: true
---

b> flexbox-flex-wrap-balance

Flexbox を使ってタグやナビゲーション項目を横に並べるとき、コンテナへ収まらないアイテムを次の行へ送るために `flex-wrap: wrap` を指定します。しかし、通常の折り返しでは前の行へできるだけ多くのアイテムを詰めるため、最後の行に 1 つだけアイテムが残ることがあります。最後の行に残ったアイテムが `flex-grow` でコンテナいっぱいに広がると、ほかの行にあるアイテムとの大きさの差も目立ってしまいます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5xcKUE9UyQCkcLXvpRNW94/e585c05a55061635d2854c3ae23b13df/image.png)

この偏りを避けるために、コンテナクエリで特定の幅だけマージンを加えたり、JavaScript でコンテナの幅を調整したりする方法が考えられます。しかし、要素の幅が変化するたびに計算を行う必要があり、実装が複雑になります。

```css
.tags {
  container-type: inline-size;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* この幅では最後のアイテムが 1 つだけ残ることを前提とする */
@container (400px <= width < 460px) {
  .tags li:last-child {
    flex-grow: 0; /* 余った空間を広がるために使わせない */
    margin-inline: auto; /* 残った空間を左右へ均等に配分して中央寄せする */
  }
}
```

[`flex-wrap: balance`](https://drafts.csswg.org/css-flexbox-2/#valdef-flex-wrap-balance) は、通常の折り返しで決まる行数を維持しながら、各行の長さが近くなるように Flex アイテムを振り分ける値です。この記事では、`flex-wrap: balance` の使い方と、どのように Flex アイテムが各行へ振り分けられるかを紹介します。

!> 2026 年 8 月現在、`flex-wrap: balance` を利用できるのは Chrome・Edge 150 以降です。Firefox と Safari は対応していません。CSS Flexible Box Layout Module Level 2 は Editor's Draft であり、今後仕様が変更される可能性があります。

## `flex-wrap: wrap` では最後の行が偏る

まずは、通常の `flex-wrap: wrap` がどのように Flex アイテムを行へ振り分けるか確認しましょう。以下の例では、リストを Flex コンテナにして、各アイテムへ `flex: 1 1 80px` を指定しています。

```html
<ul class="tags">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>Web API</li>
</ul>
```

```css
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  max-inline-size: 430px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tags li {
  flex: 1 1 80px;
  padding: 0.75rem 1rem;
  border: 1px solid #6d7fc6;
  border-radius: 0.5rem;
  background: #eef1ff;
  text-align: center;
}
```

`flex` の 3 つの値は、順番に `flex-grow`、`flex-shrink`、`flex-basis` を表します。この例では、各アイテムの基準となる幅を `80px` とし、行に余った空間があれば同じ割合で広がるようにしています。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GgWJdxy?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgWJdxy">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

折り返しの判定に使われるのは、`flex-basis` の `80px` に左右の `padding` と `border` を加えた `114px` です。コンテナの幅が `430px` の場合、1 行目にアイテムを 3 つ並べると `114px * 3 + 12px * 2 = 366px` で収まりますが、4 つ並べると `114px * 4 + 12px * 3 = 492px` となりコンテナからはみ出してしまいます。通常の折り返しアルゴリズムは、次のアイテムが収まらなくなるまで現在の行へ追加するため、4 つ目だけが 2 行目へ送られます。その後、各行で `flex-grow` が計算されるため、2 行目のアイテムは幅いっぱいまで広がってしまいます。

## `flex-wrap: balance` の使い方

`flex-wrap` に `balance` を指定すると、折り返した行の長さを均等にできます。

```diff
  .tags {
    display: flex;
-   flex-wrap: wrap;  
+   flex-wrap: balance;
    gap: 12px;
  }
```

これにより、先ほどの 4 つのアイテムは 1 行目と 2 行目にそれぞれ 2 つずつアイテムが配置されるようになります。`flex-grow` の計算は行ごとに行われるため、2 行のアイテムは同じ程度まで広がります。

<iframe height="300" style="width: 100%;" scrolling="no" title="flex-wrap: balance" src="https://codepen.io/azukiazusa1/embed/dPvoeev?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/dPvoeev">
  flex-wrap: wrap</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`balance` だけを指定した場合、行を通常の方向へ積み重ねる `wrap` も指定したものとして扱われます。方向を明示する場合は、以下のように 2 つのキーワードを組み合わせることもできます。

```css
.tags {
  flex-wrap: wrap balance;
}

.tags--reverse {
  flex-wrap: balance wrap-reverse;
}
```

## Flex アイテムが各行へ振り分けられる仕組み

通常の `wrap` は、先頭からアイテムを取り出し、次のアイテムが収まらなくなるまで現在の行へ追加する貪欲法を使います。一度 1 行目へ入ったアイテムを、後から 2 行目へ移して全体を調整することはありません。

一方、[`balance` のアルゴリズム](https://drafts.csswg.org/css-flexbox-2/#algo-balance) は次の手順で行の区切り位置を選び直します。

1. 通常の `wrap` で生成される行数を求める
2. DOM 順を維持したまま、アイテムをその行数分の連続したグループへ分ける
3. それぞれの行へ最低 1 つのアイテムを割り当てる
4. 行に含まれるアイテムの伸縮前の幅（マージンを含む）の合計とコンテナ幅の差を「誤差」とし、全行の誤差の二乗和が最小になる分け方を選ぶ

たとえば、先ほどの 4 アイテムは通常の `wrap` では 2 行になります。`balance` も 2 行という数は維持しますが、3 + 1 ではなく 2 + 2 に分けたほうが行ごとの空き幅が近くなるため、3 つ目のアイテムを 2 行目へ移します。

:::info
`balance` は、単純に各行のアイテム数を揃える機能ではありません。各アイテムが伸び縮みする前の幅にマージンを加え、それぞれの行が使う幅ができるだけ近くなるように分けます。そのため、アイテムごとの幅が異なる場合は、行ごとの個数が違う分け方が選ばれることもあります。
:::

行へアイテムを割り当てた後は、行ごとに通常の Flexbox の伸縮処理が行われます。そのため `flex-grow` を指定した例では、2 + 2 に分かれたそれぞれの行で、アイテムが同じ程度まで広がります。

## `flex-line-count` で最小行数を指定する

b> flexbox-flex-wrap-balance

通常、`balance` が使用する行数は、`wrap` でアイテムを配置した場合と同じです。コンテナにすべてのアイテムが収まるなら、`balance` を指定しても 1 行のままです。

CSS Flexible Box Layout Module Level 2 では、均等化に使う最小行数を指定する [`flex-line-count`](https://drafts.csswg.org/css-flexbox-2/#flex-line-count-property) プロパティも定義されています。

```css
.tags {
  display: flex;
  flex-wrap: balance;
  flex-line-count: 5;
}

.tags li {
  flex: 1 1 0;
  min-inline-size: 0;
}
```

`flex-basis` が `0` なのでアイテムは通常なら 1 行に収まりますが、この例では最低 5 行へ分けてアイテムを均等化します。指定できる値は `1` 以上の整数で、初期値は `1` です。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GgWJdXQ?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgWJdXQ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`flex-line-count` は最大行数ではない点に注意してください。各アイテムを収めるために 6 行以上が必要なら、`flex-line-count: 5` を指定していても必要な数だけ行が作られます。

反対に、指定した値はアイテムの数によって上限が抑えられます。`flex-line-count: 5` を指定していてもアイテムが 2 つしかなければ、最小行数は 2 として扱われます。`balance` はそれぞれの行へ最低 1 つのアイテムを割り当てるため、アイテムの数を超える行が作られることはありません。

## なぜ `flex-wrap` の値として設計されたのか

Flex アイテムを各行へ均等に配置する要望は新しいものではありません。[2014 年の CSSWG の議論](https://lists.w3.org/Archives/Public/www-style/2014Oct/0293.html)では、`flex-wrap: balance` という考え方自体には賛同が得られたものの、Flexbox Level 1 への追加は延期されました。その後、[2018 年に CSSWG Issue #3070](https://github.com/w3c/csswg-drafts/issues/3070) として改めて提案されています。

[提案の Explainer](https://github.com/bfgeek/flex-wrap-balance) は、既存の `text-wrap: balance` から意味を類推しやすく、折り返し方法を制御する `flex-wrap` の自然な拡張であるとして `flex-wrap: balance` を提案しました。一方で、折り返すかどうかと、どのようにアイテムを配置するかは別の責務だという考え方もあります。

[2025 年 9 月の CSSWG の議論](https://www.w3.org/2025/09/17-css-minutes.html)では、均等化を `item-pack: balance` のような独立したプロパティにする案が検討されました。

## まとめ

- `flex-wrap: balance` は、通常の `wrap` で決まる行数を維持しながら、各行のアイテムの伸縮前の合計幅が近くなるように Flex アイテムの改行位置を選び直す
- `flex-line-count` は、`balance` で均等化するときの最小行数を `1` 以上の整数で指定する
- 既存の `text-wrap: balance` から意味を類推しやすく、折り返し方法を制御する `flex-wrap` の自然な拡張として設計されたが、`item-pack: balance` のような独立したプロパティにする案も検討された

## 参考

- [CSS Flexible Box Layout Module Level 2](https://drafts.csswg.org/css-flexbox-2/)
- [CSSWG Issue #3070: Add flex-wrap: balance](https://github.com/w3c/csswg-drafts/issues/3070)
- [flex-wrap: balance Explainer](https://github.com/bfgeek/flex-wrap-balance)
- [CSS Working Group Teleconference – 17 September 2025](https://www.w3.org/2025/09/17-css-minutes.html)
- [Chrome 150 release notes](https://developer.chrome.com/release-notes/150)
- [Web features explorer - flex-wrap: balance](https://web-platform-dx.github.io/web-features-explorer/features/flexbox-flex-wrap-balance/)
- [WG New Spec: flex-wrap: balance - W3C TAG Design Reviews](https://github.com/w3ctag/design-reviews/issues/1227)
- [flex-wrap: balance - Mozilla Standards Positions](https://github.com/mozilla/standards-positions/issues/1405)
- [flex-wrap: balance - WebKit Standards Positions](https://github.com/WebKit/standards-positions/issues/660)
