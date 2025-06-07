---
id: thF3cdNOR_x10jcprT86U
title: ":user-valid、:user-invalid 擬似クラスでユーザーの操作の後に検証を行う"
slug: "user-valid-and-user-invalid-pseudo-classes"
about: "ユーザーの操作の後にフォームの検証に基づき有効か無効かを示すために使用できる :user-valid、:user-invalid 擬似クラスを紹介します。従来の :valid、:invalid 擬似クラスと異なり、ユーザーがフォームに入力するまではスタイルを適用されません。"
createdAt: "2023-10-13T20:16+09:00"
updatedAt: "2023-10-13T20:16+09:00"
tags: ["HTML", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6clMAwu1vaGtVLH2ouWoTF/90a5607f714e11b6bf114687d6c76111/akatonbo_yuuhi_illust_1074.png"
  title: "真っ赤な夕日と赤とんぼのイラスト"
audio: null
selfAssessment: null
published: true
---
`:user-valid`、`:user-invalid` 擬似クラスは、ユーザーの操作の後フォームの検証に基づき有効か無効かを示すために使用できます。フォームの検証として、以下のような例があげられます。

- `required` 属性を指定した要素に値が入力されているか
- `pattern` 属性を指定した要素に指定した正規表現にマッチしているか
- `min` や `max` 属性を指定した要素に指定した範囲内の値が入力されているか
- `type="email"` などの `type` 属性に指定した型に値が入力されているか

`:user-valid` は検証の結果要素が有効である場合に適用されます。つまり、`required` 属性が指定された `<input>` 要素に値が入力されている場合に適用されます。

反対に `:user-invalid` は検証の結果要素が無効である場合に適用されます。つまり `required` 属性が指定された `<input>` 要素に値が入力されていない場合です。

## `:valid`、`:invalid` 擬似クラスとの違い

フォームの検証結果に基づき要素のスタイルを変更するためには、従来は `:valid`、`:invalid` 擬似クラスを使用していました。しかし、`:valid`、`:invalid` 擬似クラスではページをロードした直後や入力中に評価されてしまうという欠点がありました。

ユーザーがフォームに入力する前から既にエラーを示すスタイルが適用されていると、どうしてエラーが発生しているのかわからず、ユーザーに混乱を与える恐れがあります。適切なタイミングでエラーを示すスタイルを適用するためには、JavaScript によって処理することが必要でした。

以下の例では、ページをロードした直後からすべての入力フォームが赤枠で表示されてしまっています。

<iframe height="300" style="width: 100%;" scrolling="no" title="invalid 擬似クラスを使ったログインフォーム" src="https://codepen.io/azukiazusa1/embed/QWzPQwM?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/QWzPQwM">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

この問題を解決するために使われるのが、`:user-valid`、`:user-invalid` 擬似クラスです。従来の `:valid`、`:invalid` 擬似クラスと異なり、ユーザーがフォームに入力するまではスタイルを適用されません。以下の基準を満たした場合のみ `:user-invalid` 擬似クラスが適用されます。

- ユーザーがフォームにフォーカスし、何かしらの値を入力し、再度フォームからフォーカスを外した場合
- ユーザーがフォームを送信しようとした場合

以下の例では、ページをロードした直後は `:user-invalid` 擬似クラスが適用されておらず、入力フォームが赤い枠線で囲まれていないことがわかります。

!> `:user-valid`、`:user-invalid` 擬似クラスは Chrome 119、Firefox 88、Safari 16.5 以降で利用可能です。

<iframe height="300" style="width: 100%;" scrolling="no" title="user:invalid を使ったログインフォーム" src="https://codepen.io/azukiazusa1/embed/abPxqBx?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/abPxqBx">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`:user-valid`、`:user-invalid` は JavaScript を用いずに、適切なタイミングでエラーを示すスタイルを適用するために有益です。

## アクセシビリティ上の考慮事項

入力フォームにエラーがあることを示す際に、ボーダーの色を変えることはよく見られますが、この対応のみではアクセシビリティ上の問題が残ります。例えば、色覚障害を持つユーザーは、ボーダーの色の変化に気づくことができません。また、たとえボーダーの色の変化に気づいたとしても、なぜエラーが発生したのか理解できないおそれがあります。

アクセシビリティに考慮したフォームを設計するためには、単なる装飾に加えてエラー文言を表示するなどの処理が必要です。

エラー文言を出し分けるためには一見 JavaScript が必要に思えますが、`:user-invalid` 擬似クラスと `:has()` 擬似クラスを組み合わせることで、JavaScript を用いずにエラー文言を出し分けることができます。この場合でも `:invalid` 擬似クラスと異なり、ユーザーがフォームに入力するまではエラー文言は表示されないことが有効に働いています。

<iframe height="300" style="width: 100%;" scrolling="no" title="user-invlalid と has を使ったログインフォーム" src="https://codepen.io/azukiazusa1/embed/GRPLQxW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GRPLQxW">
  user-invlalid を使ったログインフォーム</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `:user-valid`、`:user-invalid` 擬似クラスはユーザーの操作の後にフォームの検証に基づき有効か無効かを示すために使用できる
- `:user-valid`、`:user-invalid` 擬似クラスは `:valid`、`:invalid` 擬似クラスと異なり、ユーザーがフォームに入力するまではスタイルを適用されない
- `:user-valid`、`:user-invalid` 擬似クラスは JavaScript を用いずに、適切なタイミングでエラーを示すスタイルを適用するために有益
- `:has` 擬似クラスと組み合わせることで、JavaScript を用いずにエラー文言を出し分けることができる

## 参考

- [13.3.5. The User-interaction Pseudo-classes: :user-valid and :user-invalid](https://drafts.csswg.org/selectors/#user-pseudos)
- [:user-validと:user-invalid擬似クラス | フロントエンドBlog | ミツエーリンクス](https://www.mitsue.co.jp/knowledge/blog/frontend/202305/30_1750.html)
