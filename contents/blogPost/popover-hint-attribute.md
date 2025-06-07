---
id: a5An4Fiwaic1aJ1xBBcmA
title: "ユーザーにヒントを表示するための `popover=hint` 属性"
slug: "popover-hint-attribute"
about: "ポップオーバー API は 2024 年の Baseline に組み込まれており、主要なブラウザでサポートされています。Chrome Beta 133 では 3 番目の値として `hint` が追加されました。`popover=hint` はユーザーに対してヒントを表示する「ツールチップ」として動作します。この記事では `popover=hint` 属性について詳しく見ていきます。"
createdAt: "2025-01-18T12:25+09:00"
updatedAt: "2025-01-18T12:25+09:00"
tags: ["HTML", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/A8RqJOVzwDWoeB5TdGtJC/27dfae6d55b286533a39a15774ed896d/kotatsu_mikan_illust_1797-768x603.png"
  title: "kotatsu mikan illust 1797-768x603"
audio: null
selfAssessment:
  quizzes:
    - question: "`popover=hint` 属性の特徴として正しいものはどれか？"
      answers:
        - text: "他の `popover=hint` が表示された場合のみ自動的に閉じられる"
          correct: true
          explanation: null
        - text: "他の `popover` が表示された場合は自動的に閉じられる"
          correct: false
          explanation: "popover=auto の場合の挙動です"
        - text: "いかなる場合でも自動的に閉じられることはない"
          correct: false
          explanation: "popover=manual の場合の挙動です"
        - text: "トリガー要素にホバーもしくはフォーカスした場合にポップオーバーが表示される"
          correct: false
          explanation: null
published: true
---
!> `popover=hint` 属性は 2024 年 1 月現在 Chrome Beta 133 でのみサポートされています。

[ポップオーバー API](https://developer.mozilla.org/ja/docs/Web/API/Popover_API) は 2024 年の Baseline に組み込まれており、主要なブラウザでサポートされています。

b> popover

`popover` 属性を使用すると HTML のみを使用してアクセシブルなポップオーバーを作成できます。ポップオーバーの作成は非常に簡単です。

- ポップオーバーを表示する要素に `popover` 属性を追加する
- ポップオーバーをトリガーする要素に `popovertarget` 属性を追加する
- `popovertarget` の属性の値には `popover` 属性を持つ要素の `id` を指定する

```html
<button popovertarget="my-popover">Show popover</button>

<div id="my-popover" popover>
  <p>This is a popover</p>
</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/azojWBm?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/azojWBm">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

また、ポップオーバーをより細かく制御するために `popover` 属性に値を設定することもできます。現在は `auto` と `manual` の 2 つの値がサポートされています。

Chrome Beta 133 では 3 番目の値として `hint` が追加されました。`popover=hint` はユーザーに対してヒントを表示する「ツールチップ」として動作します。この記事では `popover=hint` 属性について詳しく見ていきます。

## `popover=hint` 属性の特徴

`popover=hint` 属性の違いは他のポップオーバーが表示されたときに自動的に閉じられるかどうかです。`popover=auto` 属性を使用した場合、他のポップオーバーが表示されたときに自動的に閉じられます。これは `<select>` 要素のようなピッカーが開いた場合も同様です。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3IID956Fnielq3RZHtVTAZ/49afc6f0883890ddfc3e08370649113a/_____2025-01-18_13.36.09.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/JoPBNmr?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/JoPBNmr">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

一方 `popover=hint` 属性を使用した場合には、すでに表示されている他のポップオーバーが表示されたとしても自動的に閉じられることはありません。ヒントとして表示されるコンテンツは他のコンテンツに対して「二次的」な情報を提供するためです。ヒントコンテンツを閲覧しながら他のコンテンツを操作することが想定されています。

唯一の例外は他のヒントが表示された場合です。1 度に複数のヒントが表示されているとユーザーの混乱を招くため、他のヒントが表示された場合には自動的に閉じられます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1I2cFYK9RSAFRJXV67VKyd/777fbc152351fd5d46aad129ff7b1da8/_____2025-01-18_13.44.09.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/yyBqbjY?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/yyBqbjY">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ポップオーバーが開いたときにすでに開いているポップオーバーを強制的に閉じない挙動は `popover=manual` 属性を指定した場合と同じです。`popover=hint` は他の `hint` が表示された場合は例外として自動的に閉じられますが、`popover=manual` はいかなる場合でも自動的に閉じられません。

`popover=manual` と `popover=hint` のより大きな違いとして「簡単な解除（Light dismiss）」可能かどうかがあります。簡単な解除とは以下のような操作をした場合にポップオーバーが閉じることを指します。

- ポップオーバーの外側をクリック
- ESC キーを押す

`popover=hint` は簡単な解除が可能である一方、`popover=manual` は簡単な解除ができません。3 つの属性の違いを表でまとめると以下のようになります。

|            | `popover=auto` | `popover=manual` | `popover=hint`                   |
| ---------- | -------------- | ---------------- | -------------------------------- |
| 強制非表示 | ◯              | ✗                | 他の `hint` が表示された場合のみ |
| 簡単な解除 | ◯              | ✗                | ◯                                |

## ポップオーバーのネスト

複数のポップオーバーが同時に表示されることはないルールには例外があります。ポップオーバーがネストされている場合です。

```html
<button popovertarget="popover1">Show Parent</button>

<div id="popover1" popover>
  <p>This is Parent</p>

  <button popovertarget="popover2">Show Child</button>
  <div id="popover2" popover>
    <p>This is Child</p>
  </div>
</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/PwYBmyV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PwYBmyV">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

子のポップオーバーは親のポップオーバーの子孫要素として存在しているため、子のポップオーバーが表示されている間に親のポップオーバーを閉じることはありません。

ポップオーバーのネストは `popover=hint` 属性を使用した場合少々複雑になります。ポップオーバーのスタックは `auto stack` と `hint stack` の 2 つに分類されることになります。`popover=auto` 属性の場合従来と同じように常に `auto stack` に追加されます。`popover=hint` の場合親要素によってどのスタックに追加されるかが決まります。親要素が `popover=hint` の場合は `hint stack` に、`popover=auto` の場合は `auto stack` に追加されます。

`popover=auto` は決して `popover=hint` の子要素として追加されることはありません。

具体例を見てみましょう。以下のように `popover=auto` の子要素に `popover=hint` の子要素がある場合、子要素が表示されている間に親要素を閉じることはありません。

```html
<button popovertarget="popover1">Show Parent</button>

<div id="popover1" popover>
  <p>This is Parent</p>

  <button popovertarget="popover2">Show Child</button>
  <div id="popover2" popover="hint">
    <p>This is Child</p>
  </div>
</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/NPKBjoK?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/NPKBjoK">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

反対に `popover=hint` の子要素に `popover=auto` の子要素がある場合、子要素が表示すると親要素が閉じられます（すべてのポップアップが非表示になります）。

```html
<button popovertarget="popover1">Show Parent</button>

<div id="popover1" popover="hint">
  <p>This is Parent</p>

  <button popovertarget="popover2">Show Child</button>
  <div id="popover2" popover>
    <p>This is Child</p>
  </div>
</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/MYgBmLe?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/MYgBmLe">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`popover=hint` の子要素に `popover=hint` の子要素がある場合、親要素が閉じられることはありません。

```html
<button popovertarget="popover1">Show Parent</button>

<div id="popover1" popover="hint">
  <p>This is Parent</p>

  <button popovertarget="popover2">Show Child</button>
  <div id="popover2" popover="hint">
    <p>This is Child</p>
  </div>
</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/zxOLwew?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/zxOLwew">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## ポップオーバーをトリガーさせる方法について

ユーザーにヒントを提供するツールチップのような UI はユーザーが要素をホバーしたときに表示されることが一般的です。ですが `popover=hint` の仕様において、どのような方法で表示させるかは範囲の対象外とされています。

ポップオーバーがどのような方法で表示させるかについては [Interest Invokers](https://open-ui.org/components/interest-invokers.explainer/) という提案で議論されています。これは `interesttarget` 属性を使用することによりポップオーバーを表示させる方法を提供します。

```html
<button interesttarget="my-tooltip">Hover/Focus to show the tooltip</button>

<span popover="hint" id="my-toolip">This is the tooltip</span>
```

現時点で使える方法としては JavaScript を使用してポップオーバーを表示させる方法があります。`popover.showPopover()` メソッドを使用することでポップオーバーの表示を切り替えることができます。

```html
<label for="name">名前：</label>
<input id="name" type="text" popovertarget="my-popover" />

<div id="my-popover" popover="hint">
  <p>名前は全角カナで入力してください。</p>
</div>

<script>
  const select = document.querySelector("input");
  const popover = document.querySelector("#my-popover");

  select.addEventListener("mouseover", () => {
    popover.showPopover();
  });

  select.addEventListener("mouseout", () => {
    popover.hidePopover();
  });
</script>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4a9yvRea8z9TkZlBcpITF0/9280e88c49a66a9e039f2a6a3ad20b0b/_____2025-01-18_14.52.48.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/PwYBmvg?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PwYBmvg">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `popover` 属性の 3 つ目の値として `hint` が追加された
- `popover=hint` は他の `hint` が表示された場合のみ自動的に閉じられる
- `popover=hint` は簡単な解除（Light dismiss）が可能
- `popover=hint` の子要素に `popover=auto` の子要素がある場合、子要素が表示されている間に親要素を閉じることはない

## 参考

- [Popover=hint (Explainer) | Open UI](https://open-ui.org/components/popover-hint.research.explainer/)
- [ポップオーバー API の使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Popover_API/Using)
- [Chrome 133 ベータ版 | Blog | Chrome for Developers](https://developer.chrome.com/blog/chrome-133-beta?hl=ja)
