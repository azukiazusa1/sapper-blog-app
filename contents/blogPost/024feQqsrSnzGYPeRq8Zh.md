---
id: 024feQqsrSnzGYPeRq8Zh
title: "ボタンが押し込まれた状態を表す Press Button の提案"
slug: "proposal-press-button"
about: 'UI デザインにおいてボタンが「押し込まれた」状態を表現することはしばしばあります。しかし、ネイティブの HTML 要素では表現できず `aria-pressed` 属性を使用する必要がありました。Press Button Proposal では `type="press"` 属性を追加することでボタンが押し込まれた状態を表現することが提案されています。'
createdAt: "2025-02-22T16:47+09:00"
updatedAt: "2025-02-22T16:47+09:00"
tags: [HTML, Open UI, アクセシビリティ]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10SqxdMAu3IfqTRI3fWHyO/21cd23fd87afa920c8ceb5587ba2a15e/takowasabi_15883-768x630.png"
  title: "たこわさびのイラスト"
selfAssessment:
  quizzes:
    - question: "Press Button Proposal でボタンを押し込まれた状態を表現するために追加される属性は何か？"
      answers:
        - text: "<button type='press'>"
          correct: true
          explanation: ""
        - text: "<button type='pressed'>"
          correct: false
          explanation: ""
        - text: "<button press>"
          correct: false
          explanation: ""
        - text: "<button press='true'>"
          correct: false
          explanation: ""

published: true
---

UI デザインにおいてボタンが「押し込まれた」状態を表現することはしばしばあります。代表的な例としてミュートボタンがあります。ミュートボタンは音声の入力をミュートにするためのボタンで、押し込まれた状態であればミュートになり、押し込まれていない状態であればミュートが解除されていることを表します。

今まではボタンが押し込まれた状態を表現するためにいくつかの方法がありました。

- [aria-pressed](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed) 属性を使用する
- ボタンの状態に応じてラベルを変更する（例: ミュート、ミュート解除）

`aria-pressed` 属性を使用する方法では `aria-pressed=true` であればボタンが押し込まれている状態を表します。スクリーンリーダーには「選択中、ミュート、切り替えボタン」のように読み上げられます。`aria-pressed` 属性を使用している場合には、状態が変更されたとしてもボタンの状態を表すラベルは変更してはいけません。

`aria-pressed` 属性はボタンをクリックするたびに更新されることが期待されます。また値を更新する場合には JavaScript を使用する必要があります。

```html
<button aria-pressed="true">ミュート</button>

<script>
  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    button.setAttribute(
      "aria-pressed",
      button.getAttribute("aria-pressed") === "true" ? "false" : "true",
    );
  });
</script>
```

しかしボタンが押し込まれた状態を表すために `aria-*` 属性を使用しなければいけないという状況はあまり好ましくありません。なぜなら、「必要なセマンティクスと動作がすでに組み込まれたネイティブの HTML 要素や属性を使用できる場合は、ネイティブのものを使用する」という WAI-ARIA の原則に反しているからです。これはつまり `<button>` 要素が使える状況であるならば、`<div role="button">` を使用するべきではないということです。

https://www.w3.org/TR/using-aria/#rule1

このようにネイティブなものが存在しないため `aria-*` や `role` 属性を使わざるをえない例として `role="search"` がありました。この問題はネイティブの `<search>` 要素が登場したことにより解決されました。

`<search>` 要素と同じ役割が期待されているのが Press Button の提案です。これは Open UI Community によって提案されており、`aria-*` 属性や JavaScript を使用せずにボタンが押し込まれた状態を表現することが目的です。

https://open-ui.org/components/press-button.explainer/

## Press Button の概要

Press Button Proposal では以下の事項が提案されています。

- `<button>` 要素の `type` 属性の値に `press` を追加する
- css 擬似クラス `:pressed` を追加する
- 新しい属性 `defaultpressed` を追加する
- [IDL](https://developer.mozilla.org/ja/docs/Glossary/IDL) プロパティに `pressed` を追加する。このプロパティは `true`, `false`, `mixed` のいずれかの値を持つ
- UA スタイルシートに `button:pressed` のスタイルルールを追加する

`type="press"` 属性を追加した場合、暗黙的に `pressed` 状態を持つことになります。初期状態は `false` です。`defaultpressed` 属性を使用することで初期状態を `true` もしくは `mixed` に設定できます。

`type="press"` 属性を持つボタンはクリックされるたびに `pressed` 状態がトグルされます。`pressed` 状態 `true` の場合は `:pressed` 擬似クラスが適用されます。開発者は `:pressed` 擬似クラスを使用して視覚的にボタンが押し込まれた状態を表現できます。`pressed` 状態が `mixed` の場合には `:indeterminate` 擬似クラスが適用されます。

## 代替案

Press Button Proposal の代替案として過去に以下のような提案がありました。

- `<input type="checkbox">` 要素を使用する
- `type="press"` ではなく `press` 属性を使用する

### `<input type="checkbox">` 要素を使用する

トグル状態を表現する方法として `<input type="checkbox">` 要素は一般的な方法として知られています。また似たようにトグル状態を表す
[switch](https://azukiazusa.dev/blog/input-type-checkbox-switch/) もチェックボックスの新しい属性として Safari に実装されました。以下の 2 点の理由から Press Button Proposal では `<input type="checkbox">` 要素を使用しないことが決定されました。

1. チェックボックスやスイッチはフォーム内で使われることが一般的であるが、Press Button はそうではない
2. Press Button もまたボタンであるので、ボタン要素を使用することが理にかなっている

### `press` 属性を使用する

boolean 値を持つ `press` を追加するのではなく、`type="press"` を使うように決定されたのはなぜでしょうか？`type` 属性に新しい値を追加する方法は 1 つ欠点があります。それは誤った値を指定した場合 `type="submit"` にフォールバックすることです。これは `type="press"` をサポートしていない古いブラウザで問題となる可能性があります。

しかし、「`<input type="checkbox">` 要素を使用する」でも述べられているように、Press Button はフォーム内で使われることはあまりないと考えられています。フォームの送信の問題を除けば、人間工学的に `type="press"` が適切であると考えられています。

例えばデフォルトで押された状態のボタンの書き方を比較すると、`type="press"` のほうが boolean を持つ状態が減っているため、よりシンプルに感じられます。

```html
<button type="press" defaultpressed="true"></button>

<button type="button" press defaultpressed></button>
```

また、`type="press"` の場合 Press Button を誤って `submit` や `reset` として扱ってしまうミスを防ぐことができます。

より優れた代替案として enum の値を持つ `press` 属性を使用することも考えられます。これは `defaultpress` 属性と IDL プロパティを持つ必要性がなくなるので有力です。

```html
<button type="button" press="true"></button>
```

これは `type="press"` と比べてより明確になる可能性はありますが、状態の反映に依存するため好ましくないと考えられています。また、既存の他の要素とも一致していません。

## まとめ

- UI デザインにおいてボタンが押し込まれた状態を表現することは一般的であるが、ネイティブの HTML 要素では表現できず `aria-presed` 属性を使用する必要があった
- Press Button Proposal では `type="press"` 属性を追加することでボタンが押し込まれた状態を表現することができる
- `defaultpressed` 属性を使用することで初期状態を設定できる
- `:pressed` 擬似クラスを使用してボタンが押し込まれた状態を視覚的に表現できる

## 参考

- [Press Buttons (Explainer) | Open UI](https://open-ui.org/components/press-button.explainer/)
- [Press Button Proposal · Issue #1058 · openui/open-ui](https://github.com/openui/open-ui/issues/1058)
- [Button Examples | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/button/examples/button/)
- [Toggle button | Proposals](https://muan.github.io/Proposals/#press-button)
- [Use cases for a button with a pressed state · Issue #1039 · openui/open-ui](https://github.com/openui/open-ui/issues/1039)
