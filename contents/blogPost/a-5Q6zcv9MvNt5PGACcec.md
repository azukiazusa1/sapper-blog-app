---
id: a-5Q6zcv9MvNt5PGACcec
title: "calc-size() で height: auto; な要素のアニメーションをサポートする"
slug: "calc-size-animation"
about: "CSS において height プロパティを 0 から auto に変化させた場合に、アニメーションが適用されないのはよく知られた問題です。この記事では calc-size() 関数を使って height: auto; な要素のアニメーションを実装する方法を紹介します。"
createdAt: "2024-09-14T15:06+09:00"
updatedAt: "2024-09-14T15:06+09:00"
tags: ["css"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5KmmkJ9bsVEjBZtfVTuf4q/164b74d0014bc1177449cdd146d5a2f9/shiromi_osashimi_7881-768x591.png"
  title: "白身のお刺身のイラスト"
selfAssessment:
  quizzes:
    - question: "details 要素の中身を対象とする疑似要素はどれか？"
      answers:
        - text: "::details-content"
          correct: true
          explanation: ""
        - text: "::content"
          correct: false
          explanation: ""
        - text: "::details"
          correct: false
          explanation: ""
        - text: "::summary"
          correct: false
          explanation: ""

published: true
---

!> `calc-size()` は 2024 年 9 月 14 日時点で Chrome v129 で #enable-experimental-web-platform-features フラグを有効にすることで利用可能です。

CSS において `height` プロパティを `0` から `auto` に変化させた場合に、アニメーションが適用されないのはよく知られた問題です。アニメーションを適用するためには、具体的な値を指定する必要があるためです。そのため、JavaScript を使って要素の高さを計算してアニメーションを実装することが一般的でした。

このような問題を解決するために、`calc-size()` 関数が提案されました。この関数は `calc()` とよく似ていますが、`calc-size()` は `auto`, `min-content`, `max-content`, `fit-content`, `stretch`, `contain` などの値をサポートしていることが特徴です。`calc-size()` 関数はこのような値を具体的な値に変換して返すことができます。

## アコーディオンの開閉をアニメーションする

実際に `calc-size()` を使ってアコーディオンの開閉をアニメーションする例を見てみましょう。アコーディオンには HTML の `details` 要素を使います。

```html
<details>
  <summary>Like Pokémon</summary>
  <div class="content">
    <ul>
      <li>Pikachu</li>
      <li>Charmander</li>
      <li>Bulbasaur</li>
    </ul>
  </div>
</details>
```

CSS では `details` 要素の中身が閉じているときに `height: 0` にし、開いているときに `height: auto` にして、高さが変化した際にアニメーションを適用します。`details` 要素の中身は CSS 擬似要素 `::details-content` で指定します。`details` 要素が開いているかどうかは、`open` 属性が付与されているかどうかで判定できます。

```css
details::details-content {
  display: block;
  height: 0;
  opacity: 0;
  overflow: hidden;
  transition: height 0.5s;
}

details[open]::details-content {
  height: calc-size(auto, size);
  opacity: 1;
  overflow: auto;
}
```

`details` が開いているときの `height` には `calc-size(auto, size)` を指定しています。これにより、`height` が具体的な値に変換されるため、`transition: height 0.5s` で設定したアニメーションが適用されます。`calc-size()` 関数の第 2 引数は第 1 引数のからの相対的な値を指定します。ここでは `size` のみを指定しているので、`auto` と同じ値です。`calc-size(auto, size + 10px)` のように指定することで、`auto` から `10px` 大きくなる値を指定することもできます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/RwzmwZV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/RwzmwZV">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

実際にアコーディオンの開閉時にアニメーションが適用されていることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6AyHA3WOuyFESDZAEfIhr1/0da32bc379d0694a97443171ed9ab55b/_____2024-09-14_17.26.05.mov" controls></video>

## まとめ

- `height: auto;` な要素のアニメーションを実装するためには、`calc-size()` 関数を使うことができる
- `calc-size()` 関数を使うことで、`auto`, `min-content`, `max-content`, `fit-content`, `stretch`, `contain` などの値を具体的な値に変換して返すことができる
- `calc-size(auto, size)` は `auto` と同じ値を返す
- `calc-size(auto, size + 10px)` のように指定することで、`auto` から `10px` 大きくなる値を指定することもできる

## 参考

- [csswg-drafts/css-values-5/calc-size-explainer.md at main · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/blob/main/css-values-5/calc-size-explainer.md)
