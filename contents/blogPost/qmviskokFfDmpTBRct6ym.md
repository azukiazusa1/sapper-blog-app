---
id: qmviskokFfDmpTBRct6ym
title: "::scroll-button と ::scroll-marker を使って CSS だけでカルーセルを作る"
slug: "css-only-carousel"
about: "カルーセルは Web アプリケーションでよく使われる UI コンポーネントの一つであるものの、標準化された実装方法が存在しないため、各ライブラリやフレームワークで独自の実装が行われています。この問題を解決するため、CSS だけを使用してカルーセルを実装するための新しい仕様が提案されています。:この仕様では ::scroll-button と ::scroll-marker 擬似要素を使用してカルーセルを実装します。"
createdAt: "2025-03-22T10:47+09:00"
updatedAt: "2025-03-22T10:47+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3NIiIv95Y3LE0DFID3IfDr/7506445d554037aff677ce70410828e4/merry-go-round_9366-768x828.png"
  title: "メリーゴランドのイラスト"
selfAssessment:
  quizzes:
    - question: "scroll-marker-group プロパティの値として指定できるものはどれか"
      answers:
        - text: "left"
          correct: false
          explanation: ""
        - text: "inline"
          correct: false
          explanation: ""
        - text: "top"
          correct: false
          explanation: ""
        - text: "before"
          correct: true
          explanation: ""

published: true
---

カルーセルは Web アプリケーションでよく使われる UI コンポーネントの 1 つです。複数の画像をスライド形式で表示する手法であり、ユーザーは左右にスクロールすることで操作できます。カルーセルは一般的な UI パターンであるにも関わらず、標準化された実装方法が存在しないため、各ライブラリやフレームワークで独自の実装が行われています。しかしカルーセルを正しく実装するのは複雑であり、アクセシビリティ上の問題を引き起こすこともありました。

このような実装上の問題を解決するため、CSS だけを使用してカルーセルを実装するための新しい仕様が提案されています。この仕様では `::scroll-button` と `::scroll-marker` 擬似要素を使用してカルーセルを実装します。これらの疑似要素は Chrome v136 から利用可能です。

b> ::scroll-button

b> ::scroll-marker


この記事では、`::scroll-button` と `::scroll-marker` 擬似要素を使用してカルーセルを実装する方法について説明します。

## カルーセルのコンテナを作る

新しい CSS の機能を試して見る前に、まずはカルーセルのコンテナを作成します。カルーセルは通常、横に並んだ要素をスクロールすることで実現されます。

横並びの要素を作成するためには、CSS の `display: grid` を使用します。`grid-auto-flow: column` を指定することで、要素を横に並べることができます。さらに、`overflow-x: auto` を指定することで、要素がはみ出した場合にスクロールさせることができます。

またスクロールが中途半端な位置で止まらないように、`scroll-snap-type: x mandatory` を指定します。これにより `x` 軸方向にスクロールする際スクロールがピタッと止まるようになります。スクロールをどの位置で止めるかは `scroll-snap-align` プロパティで指定します。`scroll-snap-align: center` を指定することで、要素の中央にスクロールが止まるようになります。

```html
<div class="container">
  <div class="carousel">
    <div class="carousel-item">
      <img src="https://picsum.photos/id/237/300/300" alt="" />
    </div>
    <!-- ... -->
  </div>
</div>

<style>
  .container {
    position: relative;
    width: 100%;
    height: 400px;
  }
  .carousel {
    display: grid;
    grid-auto-columns: 100%;
    grid-auto-flow: column;
    place-items: center;
    height: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .carousel-item {
    scroll-snap-align: center;
  }
</style>
```

まずは横方向に画像をスクロールできるカルーセルを作成しました。以下のように画像が 1 枚ごとにスクロールされていることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5zsCCfZ2SeYceAh5XSiYtg/06a7929c34d8660ac79ddf274f72c950/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-22_11.33.44.mov" controls></video>

## ::scroll-button でスクロールボタンを追加する

`::scroll-button` 擬似要素はインタラクティブなスクロールボタンを追加します。スクロールボタンはクリックして操作できる他、キーボード操作でフォーカスすることも可能です。

ユーザーがスクロールボタンをクリックすると指定した方向に一定量のスクロールが行われます。`::scroll-button` 擬似要素は `::scroll-button(方向)` の形式で指定します。例えば右方向にスクロールするボタンは `::scroll-button(right)` です。

```css
.carousel {

  /** スクロールボタンをクリックしたとき、スムーズにスクロールする */
  scroll-behavior: smooth;

  /* ... */
  &::scroll-button(right) {
    position: absolute;
    top: 40%;
    right: 20;
    content: "⮕" / "Scroll Right";
  }

  &::scroll-button(left) {
    position: absolute;
    top: 40%;
    left: 20;
    content: "⬅" / "Scroll Left";
  }

  &::scroll-button(*) {
    width: 50px;
    height: 50px;
    background-color: transparent;
    border-radius: 50%;
    color: #fff;
    border: 1px solid #444;
  }

  &::scroll-button(*):hover {
    background-color: #444;
    color: #fff;
  }
}
```

`::scroll-button` 擬似要素は `content` プロパティを使用してボタンの内容を指定します。`content` プロパティは 2 つの値を指定でき、1 つ目の値はボタンの内容、2 つ目の値は alt テキストとして使用されます。スクロールボタンをクリックしたときのスクロール量は `scroll-snap` を指定している場合、スナップされる要素の幅となります。

実際にスクロールボタンをクリックしてみると、以下のようにスクロールできます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2vNJLJDuQUZINk83dSJc0c/5839f03ed409158a967764765cbb35d4/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-22_12.02.31.mov" controls></video>

## ::scroll-marker でスクロールマーカーを追加する

`::scroll-marker` 擬似要素はスクロールマーカーを追加します。スクロールマーカーは、カルーセルの全体のアイテムの数と現在の位置を示すために使用されます。またスクロールマーカーのアイテムをクリックすることで、指定した位置にスクロールすることもできます。

`::scroll-marker` 擬似要素は `::scroll-marker(方向)` の形式で指定します。例えば右方向のスクロールマーカーは `::scroll-marker(right)` です。

```css
.carousel {
  /** マーカーグループを作成する */
  scroll-marker-group: after;

  /** マーカーグループのスタイルを指定する */
    &::scroll-marker-group {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
  }
}

.carousel-item {

  /** スクロールマーカーのスタイルを指定する */
  &::scroll-marker {
    content: "";
    border: 1px solid #444;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  /** スクロールマーカーがビュー内にあるときのスタイルを指定する */
  &::scroll-marker:target-current {
    background-color: #444;
  }
}
```

スクロールマーカーを追加するにはスクロールコンテナとなる要素に `scroll-marker-group` プロパティを指定します。`scroll-marker-group` プロパティの値は `before` または `after` のいずれかを指定します。これにより、スクロールマーカーのグループが作成されます。スクロールマーカーグループのスタイルは `::scroll-marker-group` 擬似要素を使用して指定します。

スクロールマーカーの個々のアイテムのスタイルはカルーセルの各アイテムに対して `::scroll-marker` 擬似要素を使用して指定します。スクロールマーカーがビュー内にあるときのスタイルは `::scroll-marker:target-current` 擬似要素を使用して指定します。これを使用すると、カルーセルの現在の位置を示すことができます。

スクロールマーカーは以下のように `.scroll-marker-item` クラスを持つ要素の数だけ作成されます。スクロールを進めたり戻したりするたびに、アクティブなスクロールマーカーが変化することがわかります。また、スクロールマーカーをクリックした際に対象の要素までスクロールすることも確認できます。

 <video src="https://videos.ctfassets.net/in6v9lxmm5c8/2mnmgszI96VFpLwnUn22je/3720ec2d429dcbd3cfe487b097ea00ff/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-22_12.28.02.mov" controls></video>

ここまで実装したコードの全体は以下から確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/pvoVqOe?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pvoVqOe">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- カルーセルは Web アプリケーションでよく使われる UI コンポーネントの 1 つであるものの、標準化された実装方法が存在しないため、各ライブラリやフレームワークで独自の実装が行われている。この問題を解決するため、CSS だけを使用してカルーセルを実装するための新しい仕様が提案されている。
- `::scroll-button` と `::scroll-marker` 擬似要素を使用すると CSS だけでカルーセルを実装できる。
- `::scroll-button` 擬似要素はインタラクティブなスクロールボタンを追加し、ユーザーがクリックして操作できるようにする。
- `::scroll-marker` 擬似要素はスクロールマーカーを追加し、カルーセルの全体のアイテムの数と現在の位置を示すために使用される。また、スクロールマーカーのアイテムをクリックすることで、指定した位置にスクロールすることもできる。
- `::scroll-button` と `::scroll-marker` 擬似要素は Chrome v136 から利用可能である。

## 参考

- [CSS Overflow Module Level 5](https://drafts.csswg.org/css-overflow-5/)
- [Carousel explainer | carousel](https://flackr.github.io/carousel/#scroll-markers)
- [CSS Overflow - Broad Research](https://css.oddbird.net/overflow/explainer/)
- [CSS を使用したカルーセル  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/carousels-with-css?hl=ja)