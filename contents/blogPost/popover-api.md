---
id: 9CTiQWW7hhTtmwyFOdsga
title: "ポップオーバー API で JavaScript を使わずにポップアップを表示する"
slug: "popover-api"
about: "Chrome 114 から追加されたポップオーバー API を使うと、JavaScript を使わずに簡単にポップアップを表示することができます。"
createdAt: "2023-06-11T14:12+09:00"
updatedAt: "2023-06-11T14:12+09:00"
tags: ["HTML", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/pvlbjQtVe4nU6bC0ldMTM/0d9b1a018fd5d7a2bcc196f5cc7f1688/bread-g41ce9fcdd_640.jpg"
  title: "toast"
audio: null
selfAssessment: null
published: true
---
[Chrome 114](https://developer.chrome.com/blog/new-in-chrome-114/) から追加された [ポップオーバー API](https://developer.mozilla.org/ja/docs/Web/API/Popover_API) を使うと、JavaScript を使わずに簡単にポップアップを表示できます。ただポップアップとして表示・非表示を切り替えられるだけでなく、以下のような複雑な要素もデフォルトでサポートしています。

- ポップアップの外側をクリックするとポップアップが閉じる
- Escape キーを押すとポップアップが閉じる
- 最も大きな z-index の上に表示される（[top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)）
- ポップアップが非表示になったとき、ポップアップ内にフォーカスがある場合前にフォーカスしていた要素にフォーカスが戻る
- 1 度に 1 つのポップアップしか表示できない（入れ子のポップアップは例外）
- ポップオーバーの表示・非表示を切り替える要素に `expanded` ステートがアクセシビリティツリーに公開される（`aria-expanded` 属性と同等）

最も簡単なポップアップは以下のコードで実装できます。

```html
<button popovertarget="popover">ポップアップを表示</button>
<div popover id="popover">ポップアップの中身</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/bGQdWQd?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/bGQdWQd">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## ポップオーバーの基本的な使い方

ポップオーバーはコンテンツが表示される要素（＝ポップオーバー要素）と、ポップオーバーの表示を切り替える要素（＝コントロール要素）の 2 つの要素で構成されます。

ポップオーバー要素には `popover` 属性を指定します。また、ポップアップ要素とコントロール要素を関連付けるために `id` 属性を持っている必要があります。

```html
<div popover id="popover">ポップアップの中身</div>
```

`popover` 属性が指定された要素はユーザーエージェントスタイルシートによって `display: none;` が適用されます。`popover` 属性が指定された要素ははじめは非表示になっているということです。

値なしで `popover` 属性を指定している場合、`popover=auto"` をしているのと同じになります。`popover` 属性は `auto` と `manual` の 2 つの値を取ることができます。`auto` の場合、ポップオーバーとして必要な機能を自動的に提供してくれるので、基本的には `auto` を指定するのが良いでしょう。

- `auto`
  - ポップオーバーを「簡単に解除（light-dismiss）」できる。つまり、ポップオーバーの外側をクリックするか、Escape キーを押すとポップオーバーが閉じるようになる。
  - 1 度に 1 つのポップオーバーしか表示できない。すでにポップアップが表示されている状態で他のポップアップを表示すると、すでに表示されているポップアップが閉じられる
- `manual`
  - ポップオーバーを「簡単に解除」できない。
  - 1　度に複数のポップアップを表示できる

コントロール要素には、`popovertarget` 属性を指定します。この属性の値は、ポップオーバー要素の `id` 属性の値と同じにする必要があります。

```html
<button popovertarget="popover">ポップアップを表示</button>
<di popover id="popover">ポップアップの中身</div>
```

デフォルトでターゲット要素の挙動はトグルボタンとなっています。つまり、ターゲット要素をクリックするとポップアップが表示され、もう一度クリックするとポップアップが非表示になります。この挙動を変更するには、`popovertargetaction` 属性を指定します。`popovertargetaction` 属性の値は `toggle`, `show`, `hide` の 3 つの値を取ることができます。

- `toggle`：デフォルトの挙動。ターゲット要素をクリックするとポップアップが表示され、もう一度クリックするとポップアップが非表示になる
- `show`：ターゲット要素をクリックするとポップアップが表示される
- `hide`：ターゲット要素をクリックするとポップアップが非表示になる

以下の例では、1 つ目のボタンはポップアップを表示するためのボタン、2 つ目のボタンはポップアップを非表示にするためのボタンと、ボタンごとに役割を分けています。

```html
<button popovertarget="popover" popovertargetaction="show">
  ポップアップを表示
</button>
<button popovertarget="popover" popovertargetaction="hide">
  ポップアップを非表示
</button>
<div popover id="popover">ポップアップの中身</div>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/OJaVgMy?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/OJaVgMy">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## ポップオーバーの CSS

ポップオーバーには以下の CSS 擬似クラス, 擬似要素が用意されています。

- `:popover-open`：ポップオーバーが表示されているときに付与される
- `::backdrop`：ポップオーバーの背景として表示される要素

```css
[popover]:popover-open {
  /* ポップオーバーが表示されているときのスタイル */
  boder-color: orange;
}

[popover]::backdrop {
  /* ポップオーバーの背景として表示される要素のスタイル */
  background-color: rgba(0, 0, 0, 0.5);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/GRwJEOo?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GRwJEOo">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## JavaScript からポップオーバーを制御する

### JavaScript でポップオーバーの表示・非表示を切り替える

ポップオーバー API は [HTMLElement.popover](https://developer.mozilla.org/ja/docs/Web/API/HTMLElement/popover) 要素を通して JavaScript から制御できます。ポップオーバーの表示・非表示を切り替えるメソッドがいくつか用意されています。

- `showPopover()`：ポップオーバーを表示する
- `hidePopover()`：ポップオーバーを非表示にする
- `togglePopover()`：ポップオーバーの表示・非表示を切り替える

JavaScript を利用した例として、ボタンをマウスオーバーしたときにポップオーバーを表示するようにしてみましょう。ポップオーバーが既に表示されているときに `showPopover()` を呼び出すと `InvalidStateError` が発生します。そのため、[elemebt.matches()](https://developer.mozilla.org/ja/docs/Web/API/Element/matches) メソッドを使用して、ポップオーバーが表示されているかどうかを判定しています。

ポップオーバーが表示されている場合には `:popover-open` 擬似クラスが付与されるので、これを利用して判定しています。

```javascript
const button = document.querySelector("button");
const popover = document.querySelector("#popover");

button.addEventListener("mouseenter", () => {
  // ポップオーバーが既に表示されている場合は何もしない
  if (popover.matches(":popover-open")) return;
  popover.showPopover();
});

button.addEventListener("mouseleave", () => {
  // ポップオーバーが既に表示されていない場合は何もしない
  if (!popover.matches(":popover-open")) return;
  popover.hidePopover();
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/WNYvOpp?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WNYvOpp">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### `beforetoggle` イベントでポップオーバーの表示・非表示の前に処理を実行する

もう 1 つ JavaScript を利用した例として、ポップオーバーが表示された後トーストのように数秒経過したら自動で閉じるように変更してみましょう。`beforetoggle` イベントを購読することで、ポップオーバーの表示・非表示の前に処理を実行できます。`beforetoggle` イベントのコールバック内で、3 秒後にポップオーバーを非表示にするようにしています。

```javascript
const popover = document.querySelector("#popover");

popover.addEventListener("toggle", (event) => {
  setTimeout(() => {
    if (event.target.matches(":popover-open")) {
      event.target.hidePopover();
    }
  }, 3000);
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/ZEmGyer?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ZEmGyer">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 入れ子のポップオーバー

`popover="auto"` を指定した場合、既にポップオーバーが表示されている状態で他のポップオーバーを表示すると、既に表示されているポップオーバーが閉じられます。その例外として、入れ子のポップオーバーは閉じられません。

ポップオーバーを入れ子にする方法は 3 つあります。

- DOM で直接子要素にする
- コントロール要素が入れ子の関係にある
- `anchor` 属性でポップオーバーの親要素を指定する

### DOM で直接子要素にする

DOM 上であるポップオーバーが別のポップオーバーの直接の子要素になっている場合、入れ子のポップオーバーとして扱われます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/WNYvOMO?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WNYvOMO">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## コントロール要素が入れ子の関係にある

child ポップオーバーをコントロールする要素が、parent ポップオーバーのコンテンツ内に存在する場合、DOM 上で入れ子の関係となっていなくても、入れ子のポップオーバーとして扱われ、child ポップオーバーを開いても parent ポップオーバーは閉じられません。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qBQdjoG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qBQdjoG">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## `anchor` 属性でポップオーバーの親要素を指定する

ポップオーバー要素が `anchor` 属性で別のポップオーバー要素を指定していた場合、ポップオーバー要素は入れ子の関係とみなされます。 `anchor` 属性は祖先となる要素を id で指定します。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/abQOwKM?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/abQOwKM">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## アクセシビリティ上の観点

`popover` 属性または `popovertarget` 属性が指定された要素はどのような要素にも指定でき、セマンティクスに影響を与えることはありません。つまり、新たなロールが割り当てられることはないということです。例えば `<article popover>` というように `popover` 属性を指定しても、`article` 要素のロールは変わらず `article` ロールのままです。

ポップオーバーをコントロールする要素はキーボードでも操作可能にするために、`<button>` 要素で実装するのが好ましいでしょう。ポップオーバーのコンテンツには、ポップオーバーを使用する状況に応じて適切なロールを割り当てることが求められます。

ポップアップをトリガーする要素はポップオーバーの表示・非表示を切り替える要素に `expanded` ステートがアクセシビリティツリーに公開されます。これは `aria-expanded` 属性が指定されているのと同じです。ポップオーバーが開いている場合には `true`、閉じている場合には `false` が設定されます。

また、`popover="true"` を指定している場合にはポップオーバーとして必要な機能が自動的に提供されます。

- ポップオーバーの外側をクリックするか、Escape キーを押すとポップオーバーが閉じるようになる。
- すでにポップアップが表示されている状態で他のポップアップを表示すると、すでに表示されているポップアップが閉じられる
- ポップアップが非表示になったとき、ポップアップ内にフォーカスがある場合前にフォーカスしていた要素にフォーカスが戻る

上記のような機能は通常 JavaScript を用いて実装する必要があり、意外と適切に実装するのが難しいのではじめから提供されているポップオーバー API を使用することは大きなメリットと言えるでしょう。

## まとめ

- ポップオーバーのコンテンツには `popover` 属性を指定する。ポップオーバーの表示・非表示を切り替える要素には `popovertarget` 属性をポップオーバーのコンテンツの `id` 属性の値と同じにする
- ポップオーバーが表示されているときには `:popover-open` 擬似クラスが、ポップオーバーの背景として表示される要素には `::backdrop` 擬似要素が付与される
- `showPopover()`、`hidePopover()`、`togglePopover()` メソッドを使用して JavaScript からポップオーバーの表示・非表示を切り替える。`beforetoggle` イベントを購読することで、ポップオーバーの表示・非表示の前に処理を実行することができる
- できる入れ子のポップオーバーの親要素は子要素が表示されても閉じられない
- ポップオーバー API はデフォルトでアクセシブルな実装になっている。セマンティクスは変わらないので利用者によって定義する必要がある

## 参考

- [ポップオーバー API の使用 - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Popover_API/Using)
- [Popover API (Explainer) | Open UI](https://open-ui.org/components/popover.research.explainer/)
