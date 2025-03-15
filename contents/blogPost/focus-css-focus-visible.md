---
id: 5sXIOchj7CR5ZQXG7TuaRZ
title: "focus() メソッドで CSS の :focus-visible 擬似クラスが適用されるかどうかは最後の操作によって異なる"
slug: "focus-css-focus-visible"
about: ":focus-visible 擬似クラスはユーザーの入力方法によって異なるフォーカス表示をしたい時に便利です。この擬似クラスはキーボード操作によりフォーカスされた場合に適用されますが、マウス操作によりフォーカスした場合には適用されません。  それでは、JavaScript の focus()メソッドによりフォーカスされた場合には、`:focus-visible` 擬似クラスは適用されるのでしょうか？実はこれは最後 `focus()` メソッドが呼ばれる前に要素にフォーカスがあったかどうかにより異なります。"
createdAt: "2023-01-29T00:00+09:00"
updatedAt: "2023-01-29T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4ZtFORIkatlJkfuZwTLWUC/b2f96ca0fb8957f0524edf28983a9391/_Pngtree_rock_489662.png"
  title: "rock"
selfAssessment: null
published: true
---
[:focus-visible](https://developer.mozilla.org/ja/docs/Web/CSS/:focus-visible) 擬似クラスはユーザーの入力方法によって異なるフォーカス表示をしたいときに便利です。この擬似クラスはキーボード操作によりフォーカスされた場合に適用されますが、マウス操作によりフォーカスした場合には適用されません。

それでは、JavaScript の [focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) メソッドによりフォーカスされた場合には、`:focus-visible` 擬似クラスは適用されるのでしょうか？実はこれは最後 `focus()` メソッドが呼ばれる前に要素にフォーカスがあったかどうかにより異なります。

## `focus()` メソッドによるフォーカスリングの表示

実際に `focus()` メソッドによる `:focus-visible` 擬似クラスの違いを確かめてみましょう。下記の CodePen では「A」のボタンは `:focus` 擬似クラスで青いアウトラインを「B」のボタンでは `:focus-visible` で赤いアウトラインを表示するようにスタイリングしています。

A のボタンはマウスによる操作とキーボードによる操作どちらでもアウトラインが表示されますが、B のボタンは Tab キーによるキーボード操作でのみアウトラインが表示されることがわかります。

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS focus-visible" src="https://codepen.io/azukiazusa1/embed/mdjKzNv?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/mdjKzNv">
  CSS focus-visible</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

「Focus A」ボタンをクリックすると A のボタンに「Focus B」ボタンをクリックすると B のボタンにそれぞれ JavaScript によりフォーカスされます。「Focus A」にクリックすると `focus()` メソッドが呼ばれたことによりいかなる場合でも A のボタンにアウトラインが表示されます。

`:focus-visible` 擬似クラスを使用している B のボタンの場合にはどうでしょう。マウス操作により「Focus B」ボタンをクリックしたときには B のボタンにアウトラインが表示されないのに対して、キーボード操作で「Focus B」ボタンをクリックしたときには B のボタンにアウトラインが表示されることがわかります。

![](//images.ctfassets.net/in6v9lxmm5c8/2VtCDd32Es3xDrxSB43q01/d6451e899f00fed49d92a99248acad10/focus-button.gif)

## :focus-visible の仕様を確認する

どうしてこのような挙動となるのか、`:focus-visible` の仕様書を確認してみましょう。以下のように記述されています。

> - If the previously-focused element indicated focus, and a script causes focus to move elsewhere, indicate focus on the newly focused element.
>
> Conversely, if the previously-focused element did not indicate focus, and a script causes focus to move elsewhere, don’t indicate focus on the newly focused element.
>
> - If a newly-displayed element automatically gains focus (such as an action button in a freshly opened dialog), that element should indicate focus.

[Selectors Level 4](https://w3c.github.io/csswg-drafts/selectors/#the-focus-visible-pseudo)

- 前にフォーカスがしていた要素がフォーカスを示していたおり、スクリプトによって他の要素にフォーカスが移動して場合、新たなフォーカスした要素に視覚的なフォーカスを表示する。反対に以前フォーカスしていた要素がフォーカスを示さずに、スクリプトによって他の要素にフォーカスが移動した場合、新たな要素に視覚的なフォーカスを表示しない。
- 新しく表示された要素に自動的にフォーカスが当たった場合（例えば、開いたばかりのダイアログのアクションボタンなど）、その要素に視覚的なフォーカスを表示する

このように、`focus()` メソッドにより `:focus-visible` が適用されるかどうかは、前にフォーカスしていた要素により決定されるのです。

## `focus({ focusVisible: true })` オプション

`focus()` メソッドにより `:focus-visible` が適用されるかどうかその時の状況に依存しているため、時により不都合が生じます。このような問題に対処するために、`focus` メソッドに指定可能なオプションとして `focusVisible` が提案されています。

https://github.com/whatwg/html/issues/7830

このオプションは `boolean` 値を取り、`true` が指定された場合には常に新たにフォーカスされた要素に対して視覚的なフォーカスを表示します。`true` が指定されない場合には元のとおり前にフォーカスしていた要素により決定されます。

次の例が現在 Firefox 104 以降でのみ動作します。「Focus B」をいかなる方法でクリックしたとしても、B のボタンにアウトラインが表示されます。

<iframe height="300" style="width: 100%;" scrolling="no" title="focus() focus-visible" src="https://codepen.io/azukiazusa1/embed/OJwEadX?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/OJwEadX">
  focus() focus-visible</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
