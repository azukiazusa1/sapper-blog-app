---
id: 7qPfVNwMnYhq8xDwCpVd1
title: "forcusgroup で矢印キーによるフォーカスナビゲーションを実装する"
slug: "focusgroup-arrow-key-focus-navigation"
about: "カスタム UI ウィジェットを実装する際には、ウィジェットのロールに応じたキーボード操作によるフォーカスナビゲーションを実装することが求められています。従来このようなキーボード操作は JavaScript を用いて実装する必要がありました。`focusgroup` の提案は、このようなキーボード操作を独立して使用できるプリミティブとして提案されています。この機能を利用することで、開発者は JavaScript を用いることなく一貫したフォーカスナビゲーションを実装できます。"
createdAt: "2023-10-09T14:22+09:00"
updatedAt: "2023-10-09T14:22+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1O7pJ4CancGYPONNS7fexD/8e328193917523d13df3eb65319004a7/kinomi_donguri_illust_1034.png"
  title: "どんぐりのイラスト"
published: true
---
!> この記事で紹介している機能は Chrome Canary の Experimental Web Platform features フラグを有効にした場合のみ利用可能です。将来にわたって API が変更される可能性があります。

カスタム UI ウィジェットを実装する際には、ウィジェットのロールに応じたキーボード操作によるフォーカスナビゲーションを実装することが求められています。例として [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) を参照すると、以下のようなキーボード操作が求められていることがわかります。

- [タブ](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)：左の矢印キーで前のタブに、右の矢印キーで次のタブにフォーカスを移動する
- [アコーディオン](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/)：上の矢印キーで前のアコーディオンに、下の矢印キーで次のアコーディオンにフォーカスを移動する
- [コンボボックス](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)：上の矢印キーで前のオプションに、下の矢印キーで次のオプションにフォーカスを移動する
- [グリッド](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)：上下左右の矢印キーで前後左右のセルにフォーカスを移動する

このようなキーボード操作は開発者自身によって JavaScript を用いて実装する必要がありました。適切な方法でキーボード操作によるフォーカスナビゲーションをを実装することはしばしば困難であり、また実装によってはアクセシビリティの問題を引き起こすおそれがありました。

一方で、ネイティブの Web コントロールでははじめからキーボードによるフォーカスナビゲーションが実装されています。例えば、`<select>` 要素では上下の矢印キーで前後のオプションにフォーカスを移動できます。また、`<input type="radio">` 要素では `name` 属性 d えグループ化されたラジオボタン同士であれば、左右の矢印キーで前後のオプションにフォーカスを移動できます。`<input type="datetime">` で表示されるカレンダーでは、上下左右の矢印キーで前後左右のセルにフォーカスを移動できます。

しかしながら、このようなキーボード操作を独立して使用できるプリミティブは存在していませんでした。[focusgroup](https://open-ui.org/components/focusgroup.explainer/) は、矢印キーを用いたフォーカスナビゲーションを実装するための新たな Web プリミティブとして提案されています。この機能を利用することで、開発者は JavaScript を用いることなく一貫したフォーカスナビゲーションを実装できます。

## `focusgroup` の使用方法

`focusgroup` には **線形フォーカスグループ** と **グリッドフォーカスグループ** の 2 種類が存在します。線形フォーカスグループは要素のリスト間における矢印キーによるナビゲーションです。グリッドフォーカスグループは、表形式のデータ構造に対する矢印キーによるナビゲーションを提供します。複数の線形を 1 つのフォーカスグループに結合できますが、線形フォーカスグループとグリッドフォーカスグループを結合したり、グリッドフォーカスグループ同士を結合することはできません。

フォーカスグループを定義する方法には HTML の属性として宣言する方法と、CSS のプロパティとして宣言する方法の 2 通りが存在します。

まずは HTML の属性として宣言する方法を見てみましょう。以下の HTML では親要素である `<ul>` に `focusgroup` 属性を指定しています。`focusgroup` 属性を指定した要素は **フォーカスグループ定義** となり、関連付けられたフォーカスグループアイテムのフォーカスナビゲーションを缶知ります。

```html
<ul id="menu1" role="menu" tabindex="0" focusgroup>
  <li id="mi1" tabindex="0" role="menuitem">Action 1</li>
  <li id="mi2" tabindex="-1" role="menuitem">Action 2</li>
  <li id="mi3" tabindex="-1" role="menuitem">Action 3</li>
  <li id="mi4" tabindex="-1" role="menuitem">Action 4</li>
</ul>
```

フォーカスグループ定義の直接の子要素はすべて **フォーカスグループ候補** です。フォーカスグループ候補のうち、`<button>` や `<input>` など暗黙のうちにフォーカス可能な要素や、`tabIndex` や `contenteditable` 属性を指定した要素は **フォーカスグループアイテム** となります。フォーカスグループ定義のに属するフォーカスグループアイテムの間で矢印キーによるフォーカスナビゲーションが可能となります。

実際に試してみると、`tabindex` を付与した `<li>` 要素間で矢印キーの上下左右を押すことでフォーカスが移動することがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/28TaYm7mDTKaWF8nYLAYht/b07c399077868b1289f03da2b2be34c9/_____2023-10-09_15.11.17.mov" controls></video>

フォーカスグループアイテム間では、`tabindex="-1"` が指定されている項目であっても、矢印キーによるフォーカスナビゲーションが可能です。

上記の例では、`<li>` 要素のはじめの項目には `tabindex="0"` を、その他の `<li>` 要素には `tabindex="-1"` を指定しています。これによりメニュー項目の途中で Tab キーを押すことで、最後のメニュー項目に移動せずに別の要素にフォーカスを移動できます。（ラジオボタンのグループ化と同等の挙動となります）。

## CSS による `focusgroup`

フォーカスグループ定義は HTML の `forcusgroup` 属性だけでなく、CSS の `focus-group` プロパティを用いて宣言できます。

```css
#menu1 {
  focus-group: auto;
}
```

`auto` は HTML の `focusgroup` 属性で暗黙的に指定される値と同等です。

## フォーカスグループ定義が受け取る値

`focusgroup` 属性に対する値には、以下の 3 種類が存在します。

- `extend`：線形フォーカスグループを祖先の線形フォーカスグループに結合する。
- `direction`：線形フォーカスグループのナビゲーションに使用するキーを制限するか。`horizontal`（左右の矢印キーのみ）、`vertical`（上下の矢印キーのみ）、`both`（制限ない）のいずれかを指定する。デフォルトは `both`。
- `wrap`：フォーカスグループの最後の項目に到達した時、どのような挙動を取るか。`wrap` は最初の項目に戻る。`nowrap` はフォーカスを移動しない。デフォルトは `nowrap`。グリッドフォーカスグループの場合には、行と列のそれぞれに対して折り返すかどうかを指定できる。

HTML の `focusgroup` 属性を指定する場合には、これらの値はスペース区切りで設定します。例えば、フォーカスグループ定義の挙動を上下の矢印キーのみうけつけ、最後の項目に到達した時に最初の項目に戻るようにしたい場合には、以下のように指定します。

```html
<ul focusgroup="vertical wrap">
  ...
</ul>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/w25PNrUVKrdWWzJXBYNrs/94d01c23ffe3e5a29c8920ed8363a12c/_____2023-10-09_15.27.20.mov" controls></video>

CSS で指定する場合には、それぞれの設定項目に対応するプロパティを指定します。（`focus-group` プロパティを利用してショートハンドで指定することもできます）。

```css
#menu1 {
  focus-group-name: auto;
  focus-group-wrap: wrap;
  focus-group-direction: horizontal;
}
```

HTML 属性と CSS で競合する値が設定された場合には、CSS で指定された値で上書きされます。

## 線形フォーカスグループの拡張

フォーカスグループはデフォルトでは直接の子要素のみをフォーカスグループ候補として扱います。つまり、以下のようなアコーディオンを実装した場合には、アコーディオンのヘッダーのボタンはフォーカスグループ候補として扱われなくなってしまいます。

```html
<div focusgroup>
  <h3><button type="button">ヘルプ１</button></h3>
  <div>
    <p>ヘルプ１の内容</p>
  </div>
  <h3><button type="button">ヘルプ２</button></h3>
  <div>
    <p>ヘルプ２の内容</p>
  </div>
</div>
```

これらのアコーディオンのヘッダーを同じフォーカスグループに結合するには、`<h3>` 要素の `focusgroup` 属性の値に `extend` を指定します。

```html {2, 6}
<div focusgroup>
  <h3 focusgroup="extend"><button type="button">ヘルプ１</button></h3>
  <div>
    <p>ヘルプ１の内容</p>
  </div>
  <h3 focusgroup="extend"><button type="button">ヘルプ２</button></h3>
  <div>
    <p>ヘルプ２の内容</p>
  </div>
</div>
```

`focusgroup="extend"` が指定された場合には、祖先要素の `focusgroup` を探索します。祖先要素の `focusgroup` が見つかった場合には、自身のフォーカスグループ定義と祖先のフォーカスグループ定義を結合します。このようにして、アコーディオンのヘッダーのボタンは同じフォーカスグループ定義のフォーカスグループ候補として扱われるようになります。

## グリッドフォーカスグループ

グリッドフォーカスグループは、例えば Excel にように表形式のデータ構造に対する矢印キーによるナビゲーションを提供します。上下左右の矢印キーで前後左右のセルにフォーカスを移動できます。
グリッドフォーカスグループは、`focusgroup` 属性の値に `grid`
を指定することで定義できます。

```html
<table role="grid" focusgroup="grid">
  <tbody>
    <tr>
      <th>Date</th>
      <th>Type</th>
      <th>Amount</th>
      <th>Balance</th>
    </tr>
    <tr>
      <td tabindex="0">01-Jan-16</td>
      <td tabindex="-1">Deposit</td>
      <td tabindex="-1">$1,000,000.00</td>
      <td tabindex="-1">$1,000,000.00</td>
    </tr>
    <tr>
      <td tabindex="-1">02-Jan-16</td>
      <td tabindex="-1">Debit</td>
      <td tabindex="-1">$250.00</td>
      <td tabindex="-1">$999,750.00</td>
    </tr>
    <tr>
      <td tabindex="-1">03-Jan-16</td>
      <td tabindex="-1">Debit</td>
      <td tabindex="-1">$9.00</td>
      <td tabindex="-1">$999,741.00</td>
    </tr>
    <tr>
      <td tabindex="-1">04-Jan-16</td>
      <td tabindex="-1">Debit</td>
      <td tabindex="-1">$88.00</td>
      <td tabindex="-1">$999,653.00</td>
    </tr>
    <tr>
      <td tabindex="-1">05-Jan-16</td>
      <td tabindex="-1">Debit</td>
      <td tabindex="-1">$3,421.00</td>
      <td tabindex="-1">$996,232.00</td>
    </tr>
    <tr>
      <td tabindex="-1">06-Jan-16</td>
      <td tabindex="-1">Debit</td>
      <td tabindex="-1">$700.00</td>
      <td tabindex="-1">$995,532.00</td>
    </tr>
  </tbody>
</table>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1M5CafNZN7Lp7uJJt20AEo/0e18685346f6de1f91c9b62b02ca321d/_____2023-10-09_16.02.49.mov" controls></video>

前述のとおり、グリッドは `focusgroup="extend"` によるフォーカスグループの拡張を行うことはできません。また、線形フォーカスグループとグリッドフォーカスグループを結合することもできません。

## 参考

- [focusgroup (Explainer) | OpenUI](https://open-ui.org/components/focusgroup.explainer/)
