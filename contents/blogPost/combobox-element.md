---
id: mGBxvhj0rG4xaFSgCEbdm
title: "HTML 標準でコンボボックスを実現する `<combobox>` 要素の提案"
slug: "combobox-element"
about: "コンボボックスとは、テキストボックスとドロップダウンリストを組み合わせた UI コンポーネントです。コンボボックスはユーザーがテキストボックスに入力した文字列に基づいて、ドロップダウンリストのアイテムをフィルタリングできます。`<combobox>` 要素は、HTML の標準でコンボボックスを実現することを目的としています。"
createdAt: "2023-11-18T20:47+09:00"
updatedAt: "2023-11-18T20:47+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4iPhizXr67YiwF2rEDUN4s/1ebad5ee0a7515b18d4f526db3a756c6/castella_15340.png"
  title: "カステラのイラスト"
audio: null
selfAssessment: null
published: true
---
コンボボックスとは、テキストボックスとドロップダウンリストを組み合わせた UI コンポーネントです。コンボボックスはユーザーがテキストボックスに入力した文字列に基づいて、ドロップダウンリストのアイテムをフィルタリングできます。

[Open UI](https://open-ui.org/) グループより、コンボボックスを実現するための [`<combobox>`](https://open-ui.org/components/combobox.explainer/) 要素が提案されています。この要素は、HTML の標準でコンボボックスを実現することを目的としています。

最もシンプルな `<combobox>` 要素の使い方は以下のようになります。

```html
<combobox>
  <option>Apple</option>
  <option>Banana</option>
  <option>Cherry</option>
</combobox>
```

## 背景

ウェブの黎明期から `<input>`、`<button>`、`<select>` のようなインタラクティブな要素はユーザーエクスペリエンスのために極めて重要な要素でした。ウェブ標準が提供する要素は基礎的な機能を提供することにとどまっていましたが、ウェブが成熟するにつれて、より複雑な UI コンポーネントが求められるようになりました。

例えば `<select>` 要素はカスタマイズ性に欠けているため、開発者によって独自の実装が行われることがよくありました。このような独自の実装はデザイン上は申し分ないものの、しばしばパフォーマンスやアクセシビリティ上の観点を損ねたものになってしまうことがありました。

[`<selectlist>`](https://open-ui.org/components/selectlist/) 要素はこのような問題を解決するために提案された要素です。CSS の擬似クラスとスロットにより、より高いカスタマイズ性を提供する要素です。

現在多くのウェブサイトでは、[コンボボックス](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%9C%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9) と呼ばれる UI コンポーネントが使用されています。コンボボックスの提案は `<selectlist>` のように、複雑な実装を標準の `<combobox>` 要素として提供することで、よりシンプルな手段でコンボボックスを実現することを目的としています。

このように広くウェブサイトで利用されている要素を標準化することにより、信頼性やパフォーマンス、アクセシビリティの向上が期待されます。標準の要素を使用することで、アクセシビリティを損なう可能性がある独自の実装を行う必要がなくなるためです。

## `<combobox>` 要素の構成

`<combobox>` 要素は以下の要素から構成されています。

- `<combobox>`：コンボボックスのルート要素.`<input>` 要素と `<listbox>` 要素を含む。
- `<input type=selectlist>` スロット：
  - `<selectedoption>`：現在選択されているオプションのテキストを表示する。ユーザーがオプションを選択するたびに、ブラウザによってこの要素のテキストが更新されます。
- `<listbox>` スロット：`<option>` と `<optgroup>` 要素を含むコンテナ要素。この要素が開発者により提供されない場合、`<combobox>` 要素はリストボックスを自動的に生成します。この要素は CSS の最上位レイヤー（Top layer）に配置されます。
  - `<option>`：1 つ以上の選択可能なオプションを表す。
  - `<optgroup>`：label 属性により `<option>` 要素をグループ化する。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Oc386uud6qJglfKWTGIc3/61618d763abeecb626cfadd448d638ed/__________2023-11-15_21.45.23.png)

https://open-ui.org/components/combobox.explainer/#anatomy より引用。

`<combobox>` の構成要素は `<selectlist>` 要素とよく似た構造になっていることがわかります。

## `<combobox>` 要素の使い方

`<select>` 要素と同じように、`<combobox>` 要素の配下に `<option>` 要素を配置することで、コンボボックスの候補を定義できます。

[`<selectlist>`](https://open-ui.org/components/selectlist/) 要素と同様に、その他の必要な部分（テキストボックスやドロップダウンリスト）はブラウザにより自動的に生成されます。

```html
<combobox>
  <option>Apple</option>
  <option>Banana</option>
  <option>Cherry</option>
</combobox>
```

### スロットによるカスタマイズ

`<combobox>` 要素はスロットを用いてカスタマイズが可能です。テキストボックスやドロップダウンリストを独自の実装に置き換えることが可能です。

```html
<combobox>
  <!-- type="selectlist" はリストボックスを開閉する要素として振る舞う -->
  <input type="selectlist" placeholder="Select a favorite fruit" />
  <!-- selectedoption は現在選択されている option のテキストが反映される -->
  <selectedoption></selectedoption>
  <listbox>
    <!-- <select> 要素と異なり <option> も自由にカスタマイズできる -->
    <option>Apple <img src="./apple.png" alt="" /></option>
    <option>Banana <img src="./banana.png" alt="" /></option>
    <option>Cherry <img src="./cheryr.png" alt="" /></option>
  </listbox>
</combobox>
```

### `filter` 属性

`filter` 属性は boolean 型の属性です。`<combobox>` 要素に `filter` 属性を指定すると、ユーザーの `<input>` に対する入力に応じて動的にリストボックスの内容がフィルタリングされます。

```html
<combobox filter>
  <input type="selectlist" placeholder="Select a favorite fruit" />
  <listbox>
    <option>Apple</option>
    <option>Banana</option>
    <option>Cherry</option>
  </listbox>
</combobox>
```

`<input>` 要素に何も入力されていない状態では、リストボックスの内容はすべて表示されます。入力を開始することでリストボックスのフィルタリングが開始されます。

フィルタリングは**入力した文字列から始まる**オプションのみが表示されるようになります。例えば、`"a"` という文字列を入力した場合、`"Apple"` というオプションのみが表示されます。`"a"` が文字列の途中に含まれる `"Banana"` は表示されません。

### `search` 属性

`search` 属性はよりリッチな検索機能を提供するための属性です。以下の値を受け取ります。

- `pattern`：[input 要素の pattern 属性](https://html.spec.whatwg.org/#the-pattern-attribute) と同じ形式の正規表現により、リストボックスの内容をフィルタリングする。
- `startswith`：ユーザーの入力がオプションの先頭の文字列と一致する場合に、そのオプションを表示する。（`filter` 属性と同じ動作）
- `include`：テキストがオプションのどこかに含まれている場合に、そのオプションを表示する。例えば `"a"` という文字列を入力した場合、`"Apple"` と `"Banana"` オプションが表示される。

### `multiple` 属性

複数選択可能な `multiple` 属性が今後追加される予定です。

## アクセシビリティの考慮事項

`<combobox>` 要素のキーボード操作は [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) のコンボボックスのパターンに従います。具体的には、以下のキーボード操作がサポートされています。

### コンボボックスのキーボード操作

- `↓`：リストボックスが利用可能な場合、リストボックスにフォーカスを移動する
  - `↓` が押される前にオートコンプリートによって候補が選択されている場合には、自動で選択された候補の次の候補にフォーカスが移動する
  - それ以外の場合には、リストボックスの最初の候補にフォーカスが移動する
- `↑`：リストボックスが利用可能な場合、リストボックスの最後の要素にフォーカスを移動する
- `Escape`：コンボボックスが編集可能で、オートコンプリートの候補がリストボックスに選択されている場合、選択中の値を受け入れる
- `Alt + ↓`：リストボックスが利用可能かつ閉じている場合、フォーカスを移動せずにリストボックスを開く
- `Alt + ↑`：リストボックスが開いている場合
  - リストボックスにフォーカスがあれば、コンボボックスにフォーカスを戻す
  - それ以外の場合、リストボックスを閉じる

### リストボックスのキーボード操作

- `Enter`：フォーカスされたオプションを受け入れて、リストボックスを閉じ、コンボボックスが編集可能であればカーソルを値の末尾に移動する
- `Escape`：リストボックスを閉じ、コンボボックスにフォーカスを戻す
- `↓`：フォーカスを次のオプションに移動する。フォーカスが最後のオプションにある場合には、フォーカスをコンボボックスに戻すか、何もしない。
- `↑`：フォーカスを前のオプションに移動する。フォーカスが最初のオプションにある場合には、フォーカスをコンボボックスに戻すか、何もしない。
- `→`：コンボボックスが編集可能であれば、リストボックスを閉じずにコンボボックスにフォーカスを戻し、カーソルを一文字右に移動する
- `←`：コンボボックスが編集可能であれば、リストボックスを閉じずにコンボボックスにフォーカスを戻し、カーソルを一文字左に移動する

## まとめ

- `<combobox>` 要素は HTML の標準でコンボボックスを実現することを目的としている
- `<selectlist>` 要素とよく似た構造になっていて、スロットによりカスタマイズが可能
- `filter` または `search` 属性により、リストボックスの内容を動的にフィルタリングできる
- アクセシビリティの観点から、キーボード操作による操作がサポートされている

## 参考

- [Open UI: Combobox](https://open-ui.org/components/combobox.explainer/)
- [Combobox Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
