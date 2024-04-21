---
id: ZtOsiNu7G_CCYKn6gAeoJ
title: "コンテナ要素に基づく相対的な CSS の単位（cqw, cqh, cqi, cqb, cqmin, cqmax）"
slug: "relative-css-units-based-on-container-elements"
about: "コンテナクエリ単位とは、コンテナ要素に基づいてスタイルを定義するための相対的な長さを表す単位です。例えば `1cqw` はコンテナ要素の幅の 1% に相当します。"
createdAt: "2024-04-21T11:22+09:00"
updatedAt: "2024-04-21T11:22+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/uQLyqz3fxCsDd6MRxmews/8b7cad4f67f60c3629805c51fec95a42/container-ship_13264.png"
  title: "コンテナ船のイラスト"
selfAssessment:
  quizzes:
    - question: "コンテナクエリ単位の説明として誤っているものはどれか？"
      answers:
        - text: "cqw はコンテナ要素の幅（`width`）のパーセンテージを表す"
          correct: false
          explanation: null
        - text: "cqh はコンテナ要素の高さ（`height`）のパーセンテージを表す"
          correct: false
          explanation: null
        - text: "cqi はコンテナ要素のインラインサイズのパーセンテージを表す"
          correct: false
          explanation: null
        - text: "cqb はコンテナ要素のボーダーボックスのパーセンテージを表す"
          correct: true
          explanation: "cqb はコンテナ要素のブロックサイズのパーセンテージを表します。"
    - question: "コンテナ要素を定義するために使用する CSS プロパティはどれか？"
      answers:
        - text: "container-type"
          correct: true
          explanation: null
        - text: "container"
          correct: false
          explanation: null
        - text: "container-query"
          correct: false
          explanation: null
        - text: "container-size"
          correct: false
          explanation: null
        - text: "container-width"
          correct: false
          explanation: null
    - question: "コンテナ要素の width が 800px のとき、`5cqi` は何ピクセルに相当するか？"
      answers:
        - text: "5px"
          correct: false
          explanation: null
        - text: "40px"
          correct: true
          explanation: "5cqi はコンテナ要素のインラインサイズの 5% に相当するため、800px の 5% は 40px です。"
        - text: "800px"
          correct: false
          explanation: null
        - text: "400px"
          correct: false
          explanation: null
published: true
---
コンテナクエリ（`@container`）とは、親コンテナ要素に基づいてスタイルを定義できる CSS の機能です。メディアクエリ（`@media`）では画面全体の幅に応じてスタイルを変更する必要がありましたが、コンテナクエリでは任意の要素に基づいたスタイルを適用できるため、より柔軟なレイアウトの実現が可能です。

```css
.card {
  display: grid;
  grid-template-columns: 1fr;
}

@container (min-width: 600px) {
  /* カードの親要素の幅が 600px 以上の場合、2 列に変更 */
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

コンテナクエリを使用してスタイルを適用する場合、コンテナクエリ単位を使用できます。コンテナクエリ単位は、親コンテナ要素に対する相対的な長さを表す単位です。コンテナクエリ単位は以下の 6 つが定義されています。

- cqw：コンテナ要素の幅（`width`）のパーセンテージ。`1cqw` はコンテナ要素の幅の 1% に相当する。
- cqh：コンテナ要素の高さ（`height`）のパーセンテージ。`1cqh` はコンテナ要素の高さの 1% に相当する。
- cqi：コンテナ要素のインラインサイズのパーセンテージ。`1cqi` はコンテナ要素のインラインサイズの 1% に相当する。
- cqb：コンテナ要素のブロックサイズのパーセンテージ。`1cqb` はコンテナ要素のブロックサイズの 1% に相当する。
- cqmin：コンテナ要素のインラインまたはブロックサイズの小さい方の値のパーセンテージ。
- cqmax：コンテナ要素のインラインまたはブロックサイズの大きい方の値のパーセンテージ。

<details>
<summary>インラインサイズ、ブロックサイズとは</summary>

インラインサイズ、ブロックサイズとは [CSS の論理プロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_logical_properties_and_values) における概念です。簡単に説明すると、インラインサイズは幅（`width`）に、ブロックサイズは高さ（`height`）に対応します。

論理プロパティは言語表記方向（LTR または RTL）に依存してレイアウトを制御するという目的で導入されました。例えば、英語のような左から右に書かれる言語では、`left` が `start` に、`right` が `end` に対応しています。反対にアラビア語のような右から左に書かれる言語では、`left` が `end` に、`right` が `start` に対応しています。

論理プロパティは言語表記方向（LTR または RTL）に依存してレイアウトを制御するという目的で導入されました。例えば、英語のような左から右に書かれる言語では、`left` が `inline-start` に、`right` が `inline-end` に対応しています。反対にアラビア語のような右から左に書かれる言語では、`left` が `inline-end` に、`right` が `inline-start` に対応しています。

縦書きの文章においては `inline` と `block` の意味が入れ替わることには注意が必要です。縦書きの場合、`inline` は垂直方向を指し、`block` は水平方向を指します。つまり、縦書きの場合、`inline-size` は高さ（`height`）を、`block-size` は幅（`width`）を指すことになります。

横書きの文章の場合には、将来の多言語対応に備えて、普段から論理プロパティを使用することが好ましいでしょう。

</details>

コンテナクエリ単位を使用することで、コンテナ要素の具体的なサイズに依存せずにスタイルを適用できるため、コンテナ要素を気にせずに柔軟に使用できます。コンテナクエリ単位の使用例を見ていきましょう。

## コンテナクエリ単位の使用例

コンテナクエリを使用できるようにするために、コンテナ要素を定義する必要があります。

以下の HTML において、`.container` 要素がコンテナ要素と定義する例を示します。

```html
<div class="container">
  <div class="box">This is a super cool box!</div>
</div>
```

コンテナ要素を定義するためには CSS の [container-type](https://developer.mozilla.org/ja/docs/Web/CSS/container-type) プロパティを使用します。`container-type` プロパティは以下の値を指定できます。

- `size`：コンテナクエリはインラインいおよびブロックサイズに基づいて適用される
- `inline-size`：コンテナクエリはインラインサイズに基づいて適用される
- `normal`：基本値（通常動作）

```css
.container {
  container-type: inline-size;
}
```

コンテナ要素を定義したら、`.box` 要素にコンテナクエリを使用してスタイルを適用します。

```css
.box {
  /* コンテナ要素のインラインサイズの 80% */
  font-size: 5cqi;
}
```

以下のデモでは、`width` がそれぞれ異なる `.container` 要素に対して、`.box` 要素の文字の大きさが変化していることが確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/jORQQgK?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jORQQgK">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- コンテナクエリ単位はコンテナ要素に基づいてスタイルを定義するための相対的な長さを表す単位
- コンテナクエリ単位は以下の 6 つが定義されている
  - cqw：コンテナ要素の幅（`width`）のパーセンテージ
  - cqh：コンテナ要素の高さ（`height`）のパーセンテージ
  - cqi：コンテナ要素のインラインサイズのパーセンテージ
  - cqb：コンテナ要素のブロックサイズのパーセンテージ
  - cqmin：コンテナ要素のインラインまたはブロックサイズの小さい方の値のパーセンテージ
  - cqmax：コンテナ要素のインラインまたはブロックサイズの大きい方の値のパーセンテージ
- コンテナクエリ単位を使用するためには、コンテナ要素を定義する必要がある
- コンテナ要素を定義するためには、`container-type` プロパティを使用する

## 参考

- [知っておくと便利なCSSの単位: コンテナクエリに基づく相対単位（cqw, cqh, cqi, cqb, cqmin, cqmaxなど）の便利な使い方を解説 | コリス](https://coliss.com/articles/build-websites/operation/css/container-query-length-units.html)
- [CSS コンテナークエリー - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_containment/Container_queries)
- [Container query length units](https://developer.mozilla.org/en-US/docs/Web/CSS/length#container_query_length_units)
