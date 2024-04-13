---
id: neYCDZrKWrx-S0KgYrvIl
title: "ポップアップが画面内に収まらない場合に自動的に表示位置を調整する CSS Anchor Positioning"
slug: "css-anchor-positioning"
about: "CSS Anchor Positioning とは、特定の要素を Anchor（基準）としてツールチップなどの要素の位置を決定する機能の総称です。CSS Anchor Positioning を使用することで、Floating UI のように自動で画面内に表示されるツールチップやコンテキストメニューを実装できます。"
createdAt: "2024-04-13T15:49+09:00"
updatedAt: "2024-04-13T15:49+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1EPm4o37p3DUb9Cbyd9hfm/caed52576bb54a5e721f1a201db29252/ikari_13001.png"
  title: "錨のイラスト"
selfAssessment:
  quizzes:
    - question: "アンカー要素を定義するために使用する CSS プロパティは何か？"
      answers:
        - text: "anchor-name"
          correct: true
        - text: "anchor"
          correct: false
        - text: "anchor-element"
          correct: false
        - text: "anchor-id"
          correct: false
    - question: "ポップアップが画面内に収まらない場合に自動的に表示位置を調整するためのプロパティは何か？"
      answers:
        - text: "position-try-options"
          correct: true
        - text: "position-fallback-options"
          correct: false
        - text: "position-adjust-options"
          correct: false
        - text: "position-retry-options"
          correct: false
published: true
---

!> CSS Anchor Positioning は 2024 年 4 月現在 Chrome Canary でのみ利用可能です。

CSS Anchor Positioning とは、特定の要素を Anchor（基準）としてツールチップなどの要素の位置を決定する機能の総称です。CSS Anchor Positioning を使用することで、[Floating UI](https://floating-ui.com/) のように自動で画面内に表示されるツールチップやコンテキストメニューを実装できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2Wk0zDaoiXm1zEhfjgUINC/77c3208bf9f38532b36d11c79c1d69c3/_____2024-04-13_15.47.23.mov" controls></video>

## ポップオーバーの表示位置を調整する

冒頭の動画で使用されたコードを見てみましょう。ツールチップとして表示される要素は[ポップオーバー API](https://developer.mozilla.org/ja/docs/Web/API/Popover_API)を使用しています。

```html
<button popovertarget="menu">Open</button>
<div popover id="menu">
  <ul>
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
  </ul>
</div>
```

ポップオーバー API とは他のページコンテンツの上に表示されるポップオーバーコンテンツを表示するための標準的な仕組みです。HTML 属性を用いて宣言的にポップオーバーの表示非表示を切り替えられるという特徴があります。

ポップオーバーの表示を制御するための要素に対して `popovertarget` 属性を指定します。この属性の値には、ポップオーバー要素の `id` を指定します。ポップオーバー要素には `popover` 属性を指定します。`popovertarget` 属性を指定した要素をクリックするたびに、`popover` 属性を指定した要素の表示・非表示が切り替わります。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/zYXLxMW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/zYXLxMW">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

上記のコード例を実行すると、「Open」ボタンをクリックしたタイミングでポップオーバーが表示されることが確認できます。このとき、ポップオーバー要素はブラウザのデフォルトのスタイルシートにより画面の中央に表示されます。

CSS スタイルを追加してポップオーバーの表示位置を修正できますが、ここでは CSS Anchor Positioning を使用してポップオーバーを表示する位置を指定しましょう。まずはポップオーバーの表示位置の基準となるアンカー要素を定義する必要があります。アンカー要素を定義するためには以下の 2 つの方法があります。

- CSS プロパティ `anchor-name` を設定する
- HTML 属性 `anchor` を設定する

CSS プロパティ `anchor-name` を使用する場合、アンカー要素の名前 CSS 変数と同じ命名規則（[dashed-ident](https://drafts.csswg.org/css-values-4/#typedef-dashed-ident)）を使用します。

```css
.anchor {
  anchor-name: --my-anchor;
}
```

HTML 属性 `anchor` を使用する場合、アンカー要素とする要素の `id` を指定します。これにより暗黙的なアンカーが定義されます。

```html {1,2}
<button id="trigger" popovertarget="menu">Open</button>
<div popover id="menu" anchor="trigger">
  <ul>
    <li><a href="#">Item 1</a></li>
    <li><a href="#">Item 2</a></li>
    <li><a href="#">Item 3</a></li>
  </ul>
</div>
```

アンカーを作成することで、以下のようにポップオーバーがアンカー要素の近くに表示されるようになります。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/WNWKvxO?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WNWKvxO">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

さらに CSS の `anchor()` 関数を使用することで、アンカー要素の位置を指定することができます。`anchor()` 関数は以下の 3 つの引数を受け付けます。

- アンカー要素：CSS プロパティ `anchor-name` で定義したアンカー要素の名前。HTML 属性による暗黙的なアンカーを使用している場合には、この値を省略する
- アンカーの位置：アンカー要素の位置を指定するキーワード。以下の値を受け取る
  - `inside`, `outside`：`inside` はアンカー要素の内側、`outside` は外側に配置する
  - `top`, `right`, `bottom`, `left`：アンカー要素の上下左右の位置
  - `start`, `end`, `self-start`, `self-end`：論理プロパティによるアンカー要素の位置指定
  - `50%` のようなパーセンテージ値を指定する
- フォールバック：引数に不正な値が指定された場合に使用する値

以下の CSS は、アンカー要素の右から 12px 離れた位置にポップオーバーを表示するスタイルを定義しています。

```css
[popover] {
  top: anchor(top);
  left: calc(anchor(right) + 12px);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/VwNBLpw?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/VwNBLpw">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### position-try-options によるフォールバック

ここまでは固定的な値を用いてポップオーバーの位置を指定してきましたが、現実のユースケースではポップオーバーをトリガーする要素の位置に合わせてポップオーバーが表示される位置を調整することが求められます。例えば、以下のようにボタンが画面の右端に配置されている場合、ポップオーバーが画面外に表示されてしまう問題が発生します。

![](https://images.ctfassets.net/in6v9lxmm5c8/5kOyVDGJhmLIr5jCVEB919/f86c697ec1487d8e6bf5815ae373f4ba/__________2024-04-13_16.55.38.png)

従来まではこの問題は JavaScript を使用して解決する必要がありました。CSS Anchor Positioning では `position-try-options` というプロパティを使用することで、ポップオーバーの表示位置を調整することができます。`position-try-options` プロパティは絶対位置に配置された要素が包含ブロックを超える場合に、代替の位置を指定するためのプロパティです。

この要素は `@position-try` で定義されたルールを使用するあるいは、あらかじめ定義された以下のキーワードのいずれかを使用することができます。

- `flip-block`：ブロック軸に関するプロパティ（例：`margin-block-start`, `margin-block-end`）を反転させる
- `flip-inline`：インライン軸に関するプロパティ（例：`margin-inline-start`, `margin-inline-end`）を反転させる
- `flip-start`：`start` と `end` の値を反転させる（例：`margin-block-start`, `margin-inline-start`）

これらの値は複数指定することができます。以下のように `position-try-options` プロパティを使用すると、ポップオーバーが画面内に収まらない場合に自動的に表示位置が反転されるようになります。

```css
[popover] {
  top: anchor(top);
  left: calc(anchor(right) + 12px);
  position-try-options: flip-block flip-inline;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/BaEPNrZ?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/BaEPNrZ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3kDuiUKJZi2amDB1l0J8VC/28e5cf97be1ca99a47fe26e8668e7060/_____2024-04-13_17.21.32.mov" controls></video>

## まとめ

- CSS Anchor Positioning を使用することで、アンカー要素を基準にして要素の位置を指定できる
- アンカー要素を定義するためには CSS プロパティ `anchor-name` または HTML 属性 `anchor` を使用する
- アンカー要素を元にポップオーバーの表示位置を調整するために `anchor()` 関数を使用する
- `position-try-options` プロパティを使用することで、ポップオーバーが画面内に収まらない場合に自動的に表示位置を調整できる

## 参考

- [CSS Anchor Positioning](https://drafts.csswg.org/css-anchor-position-1/)
- [CSS のアンカー配置を使って要素同士をテザリングする  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning?hl=ja)
