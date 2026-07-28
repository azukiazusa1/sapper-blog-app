---
id: 7j43coVQLgrnSe5w3Byk7
title: "矢印キーによるフォーカス移動を宣言的に実装する `focusgroup` 属性"
slug: "focusgroup-html-attribute"
about: "`focusgroup` 属性は、ツールバーやタブリストなどの複合ウィジェットにおける矢印キーのフォーカス移動を宣言的に実装する HTML 属性です。従来必要だった roving tabindex の JavaScript をブラウザに任せ、単一の Tab ストップ、折り返し、最後にフォーカスした項目の記憶などを提供します。この記事では Chrome 150 で利用可能になった `focusgroup` 属性の使い方を紹介します。"
createdAt: "2026-07-29T15:00+09:00"
updatedAt: "2026-07-29T15:00+09:00"
tags: ["HTML", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4t9IQJgE4lC3lhfC9YhX2w/8e87c4bd4df3651e9a3eaac71032a0b2/fruit_gold-kiwi_11118-768x542.png"
  title: "ゴールドキウイのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`focusgroup` を指定した複合ウィジェットを Tab キーで移動するとき、記事で説明されている基本的な挙動はどれですか？"
      answers:
        - text: "グループ内のすべての項目がそれぞれ Tab ストップになる"
          correct: false
          explanation: "`focusgroup` はグループを原則として単一の Tab ストップにまとめます。項目間は矢印キーで移動します。"
        - text: "グループ全体が Tab キーでは到達できなくなる"
          correct: false
          explanation: "グループには少なくとも 1 つの Tab ストップが保証されるため、Tab キーでも到達できます。"
        - text: "グループは原則として単一の Tab ストップになり、項目間は矢印キーで移動する"
          correct: true
          explanation: "記事で説明している通り、Tab キーはグループへの出入りに、矢印キーはグループ内の移動に使われます。"
        - text: "Tab キーを押すたびにグループ内の先頭項目へ戻る"
          correct: false
          explanation: "デフォルトでは最後にフォーカスした項目が記憶されます。常に先頭へ戻るわけではありません。"
    - question: '`focusgroup="toolbar wrap"` の `wrap` がもたらす挙動として正しいものはどれですか？'
      answers:
        - text: "最後の項目からさらに進むと、先頭の項目へフォーカスが移る"
          correct: true
          explanation: "`wrap` は端を越えて移動しようとしたとき、反対側の端へフォーカスを折り返します。"
        - text: "フォーカスがグループの外へ自動的に移る"
          correct: false
          explanation: "`wrap` はグループ内で移動を循環させる指定です。グループの外へ移動する指定ではありません。"
        - text: "ツールバーの表示が複数行に折り返される"
          correct: false
          explanation: "`wrap` は CSS のレイアウトではなく、矢印キーによるフォーカス移動の折り返しを制御します。"
        - text: "最後にフォーカスした項目を記憶しなくなる"
          correct: false
          explanation: "フォーカスの記憶を無効にするのは `nomemory` です。`wrap` とは別の機能です。"
    - question: "`focusgroupstart` を付けた項目を、グループへ入るたびにフォーカスさせたい場合の指定はどれですか？"
      answers:
        - text: '`focusgroup="toolbar wrap"` と組み合わせる'
          correct: false
          explanation: "`wrap` は矢印キー移動の折り返しを制御します。フォーカスの記憶は無効になりません。"
        - text: '対象の項目へ `tabindex="-1"` を追加する'
          correct: false
          explanation: '`tabindex="-1"` は通常の候補から項目を外す方向に働き、開始項目の固定には使いません。'
        - text: 'コンテナへ `focusgroup="none"` を指定する'
          correct: false
          explanation: "`none` は祖先の focusgroup から要素とその子孫を除外するための値です。"
        - text: "コンテナへ `nomemory` を追加する"
          correct: true
          explanation: "デフォルトの記憶は `focusgroupstart` より優先されます。`nomemory` を指定すると、再入場時にも開始項目が使われます。"
    - question: '`focusgroup="none"` を指定した部分ツリーについて、記事で説明されている挙動はどれですか？'
      answers:
        - text: "矢印キーと Tab キーのどちらからも到達できなくなる"
          correct: false
          explanation: "矢印キーの移動からは除外されますが、通常の Tab キーによる移動には残ります。"
        - text: "矢印キーの移動では読み飛ばされるが、Tab キーでは到達できる"
          correct: true
          explanation: "記事の例では補助的な操作を矢印キーの流れから外しつつ、Tab キーで利用できる状態を保っています。"
        - text: "祖先の focusgroup と同じ矢印キー操作を引き継ぐ"
          correct: false
          explanation: "`none` は祖先の focusgroup への参加を明示的に取り消す指定です。"
        - text: "自動的に独立した新しい focusgroup を作る"
          correct: false
          explanation: "独立したグループを作るには別の有効な behavior token を指定します。`none` 自体はグループを作りません。"
published: true
---

!> 2026 年 7 月現在、`focusgroup` 属性は Chrome 150 以降で利用できます。一方でロール推論を含む一部の設計は議論が続いています。実際のプロダクトで利用する場合は、ブラウザの対応状況と最新の仕様を確認してください。

ツールバーやタブリスト、メニューのように、複数の操作項目を 1 つのまとまりとして扱う UI は[複合ウィジェット（composite widget）](https://www.w3.org/TR/wai-aria-1.2/#composite)と呼ばれます。WAI-ARIA 1.2 では `composite` ロールを「ナビゲーション可能な子孫または所有された子要素を含むことができるウィジェット」と定義しています。複合ウィジェットでは、Tab キーでウィジェットの中に入り、項目間は矢印キーで移動する操作が一般的です。

[WAI-ARIA 1.2 のフォーカス管理](https://www.w3.org/TR/wai-aria-1.2/#managingfocus)では、`listbox`、`menu`、`menubar`、`radiogroup`、`tablist` などのコンテナについて、作成者が内部のフォーカスを管理することが求められています。また WAI-ARIA の [`composite` ロール](https://www.w3.org/TR/wai-aria-1.2/#composite)では、複合ウィジェットをページ全体のナビゲーションにおける 1 つの移動先とし、内部を移動するための別のナビゲーション手段を提供することが推奨されています。

具体的にどのキーを使うかは、[ARIA Authoring Practices Guide（APG）のキーボードインターフェイス](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)と各 UI パターンで示されています。たとえば[ツールバーパターン](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)では、ツールバーを Tab キーによる 1 つの移動先にまとめ、左右の矢印キーでコントロール間のフォーカスを移動するように求めています。ARIA のロールを指定するだけではこのキーボード操作は実装されないため、これまでは開発者が JavaScript でフォーカスを管理する必要がありました。

たとえば 4 つのボタンがあるツールバーで、すべてのボタンを通常の Tab キーによる移動の対象にすると、ツールバーを通過するために Tab キーを 4 回押す必要があります。そこで従来は、現在選択できる 1 項目だけを `tabindex="0"`、それ以外を `tabindex="-1"` にする roving tabindex という手法が使われてきました。

```html
<div role="toolbar" aria-label="文字の書式" id="manual-toolbar">
  <button type="button" tabindex="0">太字</button>
  <button type="button" tabindex="-1">斜体</button>
  <button type="button" tabindex="-1">下線</button>
  <button type="button" tabindex="-1">取り消し線</button>
</div>
```

矢印キーが押されたときには、JavaScript で現在の項目を探し、移動先の `tabindex` を更新してから `focus()` メソッドを呼び出します。

```javascript
const manualToolbar = document.querySelector("#manual-toolbar");
const manualItems = [...manualToolbar.querySelectorAll("button")];

manualToolbar.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  const currentIndex = manualItems.indexOf(document.activeElement);
  let nextIndex = currentIndex;

  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % manualItems.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + manualItems.length) % manualItems.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = manualItems.length - 1;
  }

  manualItems.forEach((item, index) => {
    item.tabIndex = index === nextIndex ? 0 : -1;
  });
  manualItems[nextIndex].focus();
});
```

これは簡略化した実装です。実際には無効化・非表示になった項目を読み飛ばす処理、右から左へ記述する言語や縦書きへの対応、項目が動的に増減した場合の処理、最後にフォーカスした項目の記憶なども考慮する必要があります。同じ仕組みが多くの UI ライブラリで繰り返し実装されていることも課題でした。

`focusgroup` 属性は、このようなフォーカスナビゲーションをブラウザに任せるための HTML 属性です。上記のツールバーは次の HTML だけで実装できます。

```html
<div role="toolbar" focusgroup="toolbar wrap" aria-label="文字の書式">
  <button type="button">太字</button>
  <button type="button">斜体</button>
  <button type="button">下線</button>
  <button type="button">取り消し線</button>
</div>
```

以下のデモで矢印キーによるフォーカス移動を確認できます。`focusgroup="toolbar wrap"` を指定することで、ツールバーの子孫のボタンは左右の矢印キーで移動し、端を越えると反対側へ折り返します。

<iframe height="300" style="width: 100%;" title="focusgroup=&quot;toolbar wrap&quot; を指定したツールバーのデモ" src="https://codepen.io/azukiazusa1/embed/YPNJQpN?default-tab=html%2Cresult" loading="lazy">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/YPNJQpN">
  focusgroup toolbar</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

この記事では、`focusgroup` 属性の基本的な使い方について紹介します。

## `focusgroup` 属性の基本的な使い方

`focusgroup` 属性には、対象となる UI パターンを表す behavior token を指定します。上記の `toolbar` は、要素とその子孫がツールバーとして振る舞うことを表します。behavior token は必須であり、`focusgroup="wrap"` のように修飾 token だけを指定した場合や値を省略した場合、属性は何の効果も持ちません。

矢印キーによる移動の対象となるのは、`focusgroup` を指定した要素の子孫のうちフォーカス可能な要素です。直接の子要素に限られないため、レイアウトのために `<div>` で囲んだボタンも同じグループの項目として扱われます。

```html
<div role="toolbar" focusgroup="toolbar wrap" aria-label="文字の書式">
  <div class="button-group">
    <button type="button">太字</button>
    <button type="button">斜体</button>
  </div>

  <div class="button-group">
    <button type="button">下線</button>
    <button type="button">取り消し線</button>
  </div>
</div>
```

4 つのボタンは 2 つの `<div>` に分かれていますが、いずれも同じ focusgroup の項目です。左右の矢印キーを押すと `<div>` の境界に関係なく「太字」→「斜体」→「下線」→「取り消し線」の順に移動します。

`focusgroup="toolbar"` が指定された要素へ Tab キーで入ると、ブラウザはグループ内に 1 つの Tab ストップ（Tab キーまたは Shift + Tab キーによる順次フォーカス移動で、フォーカスが止まる位置のこと）を提供します。グループ内のボタンは左右の矢印キーで移動し、もう一度 Tab キーを押すとグループの次の要素へ移動します。開発者が各ボタンの `tabindex` を更新する必要はありません。

矢印キーに加えて、Home キーと End キーでグループ内の最初と最後の項目へ移動できます。ただし仕様ではブラウザの任意の動作とされており、テキスト入力欄のように Home キーと End キーに固有の動作を持つ要素にフォーカスがある場合、ブラウザはこの移動を行いません。

また、デフォルトでは最後にフォーカスしていた項目が記憶されます。たとえば「下線」ボタンにフォーカスした状態で Tab キーを押してツールバーから出た後、Shift + Tab キーで戻ると「下線」ボタンへフォーカスが戻ります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6AR3g17eWIGoX5YoqIZo9n/fae4370993a7b761b2d2c112eda5eeae/5f146449-6895-44b6-bff4-793ba17f4f3a.mov" controls></video>

### behavior token とデフォルトの操作

現行の Open UI の Explainer では、以下の behavior token が定義されています。それぞれの token は単に矢印キーの動作を変えるだけでなく、どのような複合ウィジェットなのかという意図も表し、アクセシビリティツリーに公開されます。

| behavior token | 最小コンテナロール | 推論される子要素の最小ロール | デフォルトの修飾 |
| -------------- | ------------------ | ---------------------------- | ---------------- |
| `toolbar`      | `toolbar`          | なし                         | `inline`         |
| `tablist`      | `tablist`          | `tab`                        | `inline wrap`    |
| `radiogroup`   | `radiogroup`       | `radio`                      | `wrap`           |
| `listbox`      | `listbox`          | `option`                     | `block`          |
| `menu`         | `menu`             | `menuitem`                   | `block wrap`     |
| `menubar`      | `menubar`          | `menuitem`                   | `inline wrap`    |

behavior token は、フォーカスナビゲーションの動作と ARIA ロールを結び付けます。たとえば `<div focusgroup="tablist">` のように、明示的なロールもネイティブのセマンティクスも持たない汎用的な要素へ `tablist` token を指定すると、ブラウザはコンテナを `tablist`、子の `<button>` を `tab` としてアクセシビリティツリーに公開します。同時に、`tablist` のデフォルトである `inline wrap` が適用され、インライン軸の矢印キーでフォーカスが循環します。

![](https://images.ctfassets.net/in6v9lxmm5c8/73bQ4b83EONLUmr2jTaZdd/7f2132070c23b61d3693c636d70e7427/image.png)

`focusgroup` は、要素がすでに持つネイティブのセマンティクスや明示的な `role` を上書きしません。たとえば `<ul focusgroup="menubar">` は自動的に `menubar` へ変わらず、リストのセマンティクスを保ちます。リストをアプリケーションのメニューバーとして使うのであれば、`role="menubar"` や子要素のロールを開発者が明示する必要があります。

`inline` はインライン軸、`block` はブロック軸の矢印キーだけに反応することを表します。通常の横書きでは `inline` が左右、`block` が上下に対応します。物理的な方向を固定するのではなく論理方向を使うため、`direction: rtl` や縦書きの writing mode にも追従します。

軸の修飾は、次のように解決されます。

- `inline` と `block` を両方指定した場合：どちらの軸でも移動できる
- どちらか一方だけ指定した場合：その軸だけに移動できる
- どちらも指定しない場合：behavior token のデフォルトが適用される

そのため、軸のデフォルトを持たない `radiogroup` では上下左右のすべての矢印キーで移動できます。一方 `toolbar` はデフォルトが `inline` なので、上下の矢印キーでは移動しません。上下でも移動させたい場合は `focusgroup="toolbar inline block"` のように両方の軸を明示します。

`radiogroup` の例を見てみましょう。`radiogroup` のデフォルトの修飾は `wrap` だけなので、軸の制限がなく、左右の矢印キーでも上下の矢印キーでも移動できることがわかります。

<iframe height="300" style="width: 100%;" scrolling="no" title="focus-group-radio" src="https://codepen.io/azukiazusa1/embed/RNKeemR?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/RNKeemR">
  focus-group-radio</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`wrap` は、端を越えて移動しようとしたときに反対側の端へフォーカスを移します。たとえば `focusgroup="toolbar wrap"` では、最後のボタンで右矢印キーを押すと先頭のボタンに戻ります。ツールバーはデフォルトでは折り返さないため、`wrap` を明示しています。一方、`tablist` や `menu` にはデフォルトで `wrap` が含まれます。折り返しを無効にしたい場合は `nowrap` を指定します。

behavior token と修飾 token は空白区切りで指定し、順番に意味はありません。可読性のために、behavior token を先頭に書くと理解しやすいでしょう。

## `focusgroupstart` とフォーカスの記憶

初めて focusgroup に入ったときに特定の項目へフォーカスさせたい場合は、その項目へ `focusgroupstart` 属性を指定します。

```html
<button type="button">focusgroup の前</button>

<div role="toolbar" focusgroup="toolbar nomemory" aria-label="配置">
  <button type="button">左揃え</button>
  <button type="button" focusgroupstart>中央揃え</button>
  <button type="button">右揃え</button>
</div>

<button type="button">focusgroup の後</button>
```

この例では、前後のボタンから Tab キーまたは Shift + Tab キーで focusgroup に入ると「中央揃え」ボタンへフォーカスします。

<iframe height="300" style="width: 100%;" title="focusgroupstart と nomemory を組み合わせたデモ" src="https://codepen.io/azukiazusa1/embed/myRzwMB?default-tab=html%2Cresult" loading="lazy">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/myRzwMB">
  focusgroupstart と nomemory</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ここで重要なのは、デフォルトのフォーカス記憶は `focusgroupstart` よりも優先されることです。`nomemory` がない場合、初回は `focusgroupstart` の項目が使われますが、2 回目以降は最後にフォーカスしていた項目へ戻ります。常に `focusgroupstart` から開始したい場合は、上記のように `nomemory` を組み合わせます。

## 一部の要素を矢印キーの移動から除外する

`focusgroup="none"` を指定すると、その要素と子孫を祖先の focusgroup から除外できます。次の例では、使用頻度が低いヘルプ関連のボタンを、ツールバーの矢印キーによる移動から除外しています。

```html
<div role="toolbar" focusgroup="toolbar wrap" aria-label="編集">
  <button type="button">元に戻す</button>
  <button type="button">やり直す</button>

  <span focusgroup="none">
    <button type="button">ヘルプ</button>
    <button type="button">ショートカット一覧</button>
  </span>

  <button type="button">保存</button>
</div>
```

「やり直す」ボタンで右矢印キーを押すと、「ヘルプ」と「ショートカット一覧」を読み飛ばして「保存」ボタンへ移動します。ただし `focusgroup="none"` は要素を操作不能にするものではありません。除外された 2 つのボタンは通常の Tab キーによる移動には残ります。

<iframe height="300" style="width: 100%;" title="focusgroup=&quot;none&quot; で一部の項目を矢印キーの移動から除外したデモ" src="https://codepen.io/azukiazusa1/embed/pvRxwrY?default-tab=html%2Cresult" loading="lazy">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pvRxwrY">
  focusgroup none</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

### segment と Tab ストップ

除外された要素が Tab キーの移動に残るのは、`focusgroup="none"` が focusgroup を focus group segment（以下 segment）に分割するためです。segment とは DOM 要素ではなく、「除外された要素をまたがずに矢印キーで移動できる、連続した項目のまとまり」を指す仕様上の概念です。ブラウザはこの segment ごとに Tab ストップを計算します。

segment の境界を作るのは次の 2 つです。

- `focusgroup="none"` で除外された要素（フォーカス可能な要素を含む場合）
- 入れ子になった別の focusgroup（項目を含む場合）

上記の例は「ヘルプ」「ショートカット一覧」を含む `<span>` が境界となり、次のように分けられます。

- segment 1：「元に戻す」「やり直す」
- 除外された要素：「ヘルプ」「ショートカット一覧」
- segment 2：「保存」

各 segment には 1 つずつ Tab ストップが保証されます。そのため Tab キーで進むと、segment 1 の項目 →「ヘルプ」→「ショートカット一覧」→ segment 2 の「保存」という順番でフォーカスが移動します。除外された要素は focusgroup の管理下にないため、それぞれが通常どおり独立した Tab ストップになります。

一方、矢印キーによる移動では segment の境界を越えられます。segment 1 の「やり直す」で右矢印キーを押すと、除外された 2 つのボタンを読み飛ばし、segment 2 の「保存」へ移動します。つまり、`focusgroup="none"` は Tab キーの移動経路には残りつつ、矢印キーの移動経路からだけ取り除かれます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2ucU0suVayuzWsCJ0teVqr/483cb9dfcec5f53c971c316fc9d0f4d0/d2ef19df-ccb3-4859-8053-f723e187697c.mov" controls></video>

segment が増えるほど Tab ストップも増えるため、`focusgroup="none"` を多用するとグループを 1 つの Tab ストップにまとめるという利点が薄れます。矢印キーの移動から外したい項目が多い場合は、そもそも同じ focusgroup にまとめるべきかを検討してください。

## focusgroup を入れ子にする

メニューバーの中にサブメニューがある場合のように、focusgroup は入れ子にできます。子の focusgroup は祖先の focusgroup から暗黙的に除外され、それぞれが独立してフォーカス移動を管理します。

```html
<div role="menubar" focusgroup="menubar" aria-label="アプリケーションメニュー">
  <!--menubar` ロールが所有できる子要素が `menuitem`、`menuitemcheckbox`、`menuitemradio`、`group` に限られるためサブメニューを `role="none"` の要素で囲んでいる　-->
  <div role="none">
    <button
      type="button"
      role="menuitem"
      popovertarget="file-menu"
      aria-haspopup="menu"
    >
      ファイル
    </button>

    <!-- popover でメニューポップアップを表示。メニューは入れ子の focusgroup -->
    <div id="file-menu" role="menu" focusgroup="menu" popover>
      <button type="button" role="menuitem" autofocus>新規作成</button>
      <button type="button" role="menuitem">開く</button>
      <button type="button" role="menuitem">保存</button>
    </div>
  </div>

  <button type="button" role="menuitem">編集</button>
</div>
```

子の focusgroup を開くことや、祖先から子へフォーカスを移すことは `focusgroup` の責務ではありません。この例では Popover API の `popovertarget` と `autofocus` がその役割を担っています。

`menubar` には `inline wrap` がデフォルトで指定されるため、「ファイル」と「編集」は左右の矢印キーで移動します。サブメニューの `menu` は `block wrap` であるため、開いた後は上下の矢印キーで項目を移動します。

<iframe height="300" style="width: 100%;" title="focusgroup を入れ子にしたメニューバーのデモ" src="https://codepen.io/azukiazusa1/embed/WbRaOgP?default-tab=html%2Cresult" loading="lazy">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/WbRaOgP">
  focus-group-nest</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 選択状態は開発者が管理する

`focusgroup` はフォーカスの移動を提供しますが、項目の選択状態までは変更しません。タブリストでは、矢印キーで別のタブへフォーカスを移した後、選択されたタブと表示するタブパネルを JavaScript で更新する必要があります。

```html
<div id="settings-tabs" focusgroup="tablist nomemory" aria-label="設定">
  <button
    type="button"
    id="tab-general"
    aria-selected="true"
    aria-controls="panel-general"
    focusgroupstart
  >
    一般
  </button>
  <button
    type="button"
    id="tab-notification"
    aria-selected="false"
    aria-controls="panel-notification"
  >
    通知
  </button>
</div>

<div role="tabpanel" id="panel-general" aria-labelledby="tab-general" tabindex="0">
  一般設定の内容
</div>
<div
  role="tabpanel"
  id="panel-notification"
  aria-labelledby="tab-notification"
  hidden
>
  通知設定の内容
</div>
```

`aria-*` 属性は `focusgroup` から推論されません。タブの選択状態を表す `aria-selected`、タブとパネルの関係を表す `aria-controls` と `aria-labelledby`、タブリストの名前を表す `aria-label` は開発者が指定します。縦方向のタブリストであれば、`focusgroup="tablist block"` に加えて `aria-orientation="vertical"` も明示する必要があります。

<iframe height="300" style="width: 100%;" title="focusgroup=&quot;tablist&quot; を使ったタブリストのデモ" src="https://codepen.io/azukiazusa1/embed/JoEmJOX?default-tab=html%2Cresult" loading="lazy">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/JoEmJOX">
  focusgroup tablist</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


デモではタブへフォーカスが移動したときに、`aria-selected`、`hidden`、`focusgroupstart` を更新しています。

```javascript
const tabs = [...document.querySelectorAll("#settings-tabs > button")];

tabs.forEach((tab) => {
  tab.addEventListener("focus", () => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.toggleAttribute("focusgroupstart", selected);

      const panel = document.getElementById(item.getAttribute("aria-controls"));
      panel.hidden = !selected;
    });
  });
});
```

`focusgroupstart` を JavaScript で更新しているのは、`nomemory` を指定しているためです。記憶が無効な状態では、グループへ入るたびにブラウザは `focusgroupstart` が付いた項目を探します。この属性を動かさなければ、「通知」タブを選択したまま Tab キーでグループを出て戻ってきても、常に先頭の「一般」タブへフォーカスしてしまいます。

ここで「そもそもデフォルトの記憶に任せれば、最後にフォーカスしたタブへ戻るのだから同じではないか」という疑問が浮かぶかもしれません。この例のように、フォーカスの移動と同時に選択が切り替わる場合は、たしかに結果は変わりません。しかし記憶が覚えているのは最後にフォーカスした項目であり、選択中の項目ではありません。APG のタブパターンが求めているのは後者です。
例えば、URL のクエリからの復元など、JavaScript で選択タブを変更した場合。記憶は古いフォーカス位置を指したままになってしまいます。

`nomemory` と `focusgroupstart` の組み合わせは、フォーカス履歴という副次的な状態に頼らず宣言的に表現できます。

## アクセシビリティのセマンティクス

現行の Explainer では、behavior token に応じた最小限の ARIA ロールをブラウザが推論する設計が提案されています。たとえば、ロールを持たない `<div focusgroup="tablist">` は `tablist`、その子の `<button>` は `tab` としてアクセシビリティツリーに公開されます。

この子要素のロール推論は現行の Explainer に含まれていますが、最終的に仕様へ残すか、最初のバージョンから削除するか、将来の機能として延期するかは議論が続いています。ここでは、それぞれの立場で示されている理由を紹介します。

### 子要素のロール推論を残す立場

子要素のロール推論を残す立場では、behavior token が表す操作パターンと最低限必要なセマンティクスをまとめて提供することで、ARIA ロールの指定漏れを減らせると考えます。たとえば `focusgroup="tablist"` を指定した汎用的なコンテナでは、子の `<button>` を `tab` として公開できます。開発者がすべてのボタンへ同じロールを繰り返し指定しなくても、APG のパターンに沿ったアクセシビリティツリーを作りやすくなるという利点があります。子要素のロール推論を `<button>` へ拡張した [Pull Request](https://github.com/openui/open-ui/pull/1379) では、ボタンが複合ウィジェットの項目を作るうえで最も一般的な構成要素であることを理由に挙げ、どの書き方を選んでもスクリーンリーダーへ公開されるツリーは同一になると説明しています。

ただし、推論は既存のセマンティクスを無条件に書き換えるものではありません。現行案では、コンテナのロール自体が behavior token から推論され、子要素に明示的な `role` がなく、既存のネイティブなセマンティクスを壊さない場合に限って子要素のロールを推論します。`<button>` はタブやメニュー項目などを作るためによく使われることから、例外的に推論の対象です。`menuitemcheckbox` と `menuitemradio` のように複数の候補がある派生ロールは推測せず、開発者が明示します。

なお、ロール推論を残す案でも、`focusgroup` を指定するだけでウィジェット固有の状態管理まで自動化されるわけではありません。選択状態を表す `aria-selected` や `aria-checked`、ラベル、タブパネルとの関連付けなどは、利用する UI パターンに合わせて適切に実装する必要があります。

### 子要素のロール推論を削除または延期する立場

一方で、フォーカス移動という「振る舞い」を指定した結果として、要素が支援技術へ公開する「意味」まで暗黙的に変化するのは責務が広すぎるという懸念があります。推論の対象、ネイティブ要素との競合、明示的なコンテナロールと behavior token が一致しない場合の扱いなど、ブラウザが判断すべき規則も複雑になります。

子要素のロールは開発者が明示できるため、最初のバージョンではコンテナのパターンとフォーカスナビゲーションだけを提供し、子要素の推論を将来の検討事項にする案も示されています。この方法であれば、まずナビゲーション機能を導入し、実際にどの程度ロールの指定漏れや記述負担が発生するかを調べてから、推論を標準化できます。

[現行の Explainer](https://open-ui.org/components/scoped-focusgroup.explainer/#open-questions) は子要素のロール推論を採用した形で本文を記述していますが、Open questions では、推論を最初のバージョンから外すか、将来へ延期するかが改めて検討されています。つまり、2026 年 7 月時点では最終決定ではありません。

### behavior token という設計自体への代替案

議論の対象は、子要素のロール推論だけにとどまりません。[Open questions](https://open-ui.org/components/scoped-focusgroup.explainer/#open-questions) では、「UI パターンを表す token を `focusgroup` 属性で受け取る」という設計そのものについて、次のような代替案が挙げられています。

- 現行案：behavior token が操作パターンと（任意の）子要素のロール推論を担う
- コンテナロールを必須にする案：コンテナへ明示的な `role` を要求し、`focusgroup` は `wrap` や `inline` などの修飾だけを受け取る（behavior token を廃止する）
- 属性を分割する案：`pattern="tablist" focusgroup="wrap"` のように、パターンの指定と移動の修飾を別の属性へ分ける。責務は明確になるが、属性が増える
- ネイティブ要素に寄せる案：将来的な `<tabs>` や `<toolbar>` のような要素で解決し、属性を不要にする。ただし要素が揃うまで時間がかかり、カスタム要素で UI を構築する場合には結局宣言的な移動の手段が必要になる

たとえば「[tablist behavior token is misleading](https://github.com/openui/open-ui/issues/1417)」という issue では、`tablist` という名前がタブの活性化や選択状態の管理まで提供すると期待させるにもかかわらず、実際には「`focusgroup="inline wrap"` の短縮形にすぎない」という指摘がなされています。そのうえで、behavior token の大半を削除し、方向・折り返し・記憶を表す修飾だけに絞るべきだと提案しています。`focusgroup` がフォーカス移動だけを担うという設計を突き詰めると、UI パターンの名前を token にすること自体が疑問の対象になる、というわけです。

また、behavior token としてどのパターンを認めるかも検討中です。たとえば MDN は `grid` と `listbox` を複合ウィジェットとして使わないよう推奨しているため、`focusgroup` がこれらをサポートすること自体が「使ってよい」というシグナルになってしまう、という指摘があります。

:::note
2 次元のグリッド状のナビゲーション（`grid` パターンのように、上下の矢印キーで行を、左右の矢印キーで列を移動する操作）は、実装の複雑さを理由に Future Considerations へ移されており、現行の提案には含まれていません。データテーブルやカレンダーのような UI では、引き続き JavaScript でフォーカスを管理する必要があります。
:::

## 対応状況を検出する

`focusgroup` に対応するブラウザは、HTML の `focusgroup` 属性に対応する `focusGroup` DOM プロパティを公開します。次のコードで機能を検出できます。

```javascript
if ("focusGroup" in HTMLElement.prototype) {
  // focusgroup に対応している
} else {
  // roving tabindex の実装やポリフィルを使用する
}
```

## まとめ

- `focusgroup` 属性は、複合ウィジェットにおける矢印キーのフォーカス移動を宣言的に実装する
- グループを原則として 1 つの Tab ストップにまとめ、矢印キーによる移動と最後にフォーカスした項目の記憶をブラウザに任せられる
- `wrap` と `nowrap` で端に到達したときの挙動を指定し、`nomemory` でフォーカスの記憶を無効にできる
- `focusgroupstart` は最初にフォーカスする項目を指定し、`focusgroup="none"` は一部の要素を矢印キーの移動から除外する
- `focusgroup` はフォーカス移動だけを扱い、タブやラジオボタンの選択状態は開発者が管理する
- Chrome 150 で利用できるが、HTML Standard への追加やロール推論などは引き続き議論されている

## 参考

- [Focusgroup (Explainer) | Open UI](https://open-ui.org/components/scoped-focusgroup.explainer/)
- [[focusgroup] Declarative directional focus navigation for composite widgets | WHATWG](https://github.com/whatwg/html/issues/11641)
- [[focusgroup] Add the focusgroup attribute | WHATWG](https://github.com/whatwg/html/pull/11723)
- [[html-aam] Add focusgroup attribute mapping | W3C ARIA](https://github.com/w3c/aria/pull/2778)
- [[focusgroup] Extend child role inference to button, add default modifiers | Open UI](https://github.com/openui/open-ui/pull/1379)
- [Chrome 150 Release Notes](https://developer.chrome.com/release-notes/150)
- [Request for developer feedback: focusgroup | Chrome for Developers](https://developer.chrome.com/blog/focusgroup-rfc)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Managing Focus and Supporting Keyboard Navigation | WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#managingfocus)
- [Developing a Keyboard Interface | APG](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [Toolbar Pattern | APG](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)
- [focusgroup polyfill | Microsoft](https://github.com/microsoft/polyfills/tree/main/packages/focusgroup)
