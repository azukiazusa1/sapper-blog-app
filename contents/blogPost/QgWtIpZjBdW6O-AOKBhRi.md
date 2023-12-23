---
id: QgWtIpZjBdW6O-AOKBhRi
title: "input[type=checkbox] 要素に switch 属性を指定することによる HTML 標準のスイッチ UI の提案"
slug: "input-type-checkbox-switch"
about: 'スイッチは多くのウェブサイトで使われているものの、HTML の標準要素としては存在していませんでした。そのため多くの開発者は、スイッチを実装するために独自の実装を行っていましたが、このような独自の実装はアクセシビリティの問題を引き起こす可能性がありました。この問題を解決するために、WHATWG により `input[type="checkbox"]` 要素に `switch` 属性を追加することが提案されました。この属性を指定することで、チェックボックスをスイッチとして利用できます。'
createdAt: "2023-12-23T16:31+09:00"
updatedAt: "2023-12-23T16:31+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7JMBg7AGfyKjOq5A9IKtCB/6b734f49345ec2e4d71a1f3136154b30/christmas_tonakai_5266.png"
  title: "赤い鼻のトナカイのイラスト"
published: true
---

!> input 要素の switch 属性は 2023 年 12 月現在実験的に実装されている機能です。将来的に仕様が変更される可能性があります。

[スイッチ](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) とは、オンとオフの 2 つの状態を持つ UI コンポーネントのことです。チェックボックスとよく似ていますが、スイッチは第 3 の状態である[未確定の状態](https://developer.mozilla.org/ja/docs/Web/HTML/Element/input/checkbox#%E6%9C%AA%E6%B1%BA%E5%AE%9A%E7%8A%B6%E6%85%8B%E3%81%AE%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9)持たないという点が異なります。

このスイッチ UI は多くのウェブサイトで利用されているものの、HTML の標準要素としては存在していませんでした。そのため多くの開発者は、スイッチ UI を実装するために独自の実装を行っていましたが、このような独自の実装はアクセシビリティの問題を引き起こす可能性がありました。

この問題を解決するために、WHATWG により `input[type="checkbox"]` 要素に `switch` 属性を追加することが提案されました。この属性を指定することで、チェックボックスをスイッチ UI として利用できるようになります。

https://github.com/whatwg/html/pull/9546

```html
<input type="checkbox" switch />
```

![](https://images.ctfassets.net/in6v9lxmm5c8/1MYjBznOACkctwJ51GhN7a/ba3f12e2ca7a089e89ff00d10a069bf7/__________2023-12-23_16.54.30.png)

この提案は現在 [Safari Technology Preview 185](https://developer.apple.com/documentation/safari-technology-preview-release-notes/stp-release-185#HTML) にのみ実験的に実装されています。

## スタイリング

`<input type="checkbox">` 要素に `switch` 属性を指定した場合、ブラウザのデフォルトのスタイルが適用されスイッチ UI として表示されます。

スイッチ UI はウェブコンポーネントとして実装されており、`thumb` と `track` という 2 つのパーツで構成されています。`thumb` はスイッチのハンドル部分で、`track` はスイッチの背景部分です。これらのパーツはそれぞれ `::thumb` と `::track` という疑似要素を使ってスタイルを指定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/79eQfVrg2yJl7Yso2Wr5Ho/dc17d105e864ff4ef9291e300bd7e57c/__________2023-12-23_18.16.10.png)

!> `::thumb` と `::track` 疑似要素を使用したスタイリングは 2023 年 12 月現在、Safari Technology Preview 185 で、Develop > Feature Flags... から「:thumb and ::track pseudo-elements」を有効にすることで利用できます。

チェックボックスなどと同じく、スイッチ UI のデフォルトのスタイルを変更しカスタマイズしたい場合には、`appearance: none` を指定してデフォルトのスタイルを無効化する必要があります。スイッチがオンの場合のスタイルは `:checked` 疑似クラスを使って指定できます。

```css
input[type="checkbox"][switch] {
  appearance: none;

  background-color: #e5e5ea;
  position: relative;
  width: 78px;
  height: 48px;
  border-radius: 8px;
}
input[type="checkbox"][switch]::thumb {
  width: 42px;
  height: 42px;
  margin-top: 2px;
  margin-left: 2px;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 9px 28px -6px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;
}
input[type="checkbox"][switch]:checked::thumb {
  transform: translateX(32px);
}
input[type="checkbox"][switch]:checked {
  background: #35c759;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/xCOXTYFIDOuD7BjksEa9N/d43506fe5f0b0c16033a93809b6ea96e/__________2023-12-23_19.38.22.png)

### スイッチの色の変更

スイッチの見た目を大きくカスタマイズせずに、色の変更だけを行いたい場合には、[accent-color](https://developer.mozilla.org/ja/docs/Web/CSS/accent-color) プロパティを使うことで簡単に実現できます。

```css
input[type="checkbox"][switch] {
  accent-color: #e60000;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/1sEhrosQSTLB9LRIMavfAi/6db4e6f0f5500a73332a091c7cd260c5/__________2023-12-23_19.09.30.png)

`color-scheme: dark;` を指定することで、スイッチの背景色をダークモードに最適な配色に変更できます。

```css
.box1 {
  background-color: #e9e9eb;
}

.box2 {
  background-color: #1c1c1e;
}

.box2 input[type="checkbox"][switch] {
  color-scheme: dark;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/9xPXI1JAdrpPCYnz3kAEF/326653ff4027917cf2b7155729bbb995/__________2023-12-23_19.17.13.png)

## アクセシビリティ上の考慮事項

`input[type="checkbox"]` 要素に `switch` 属性を指定すると、デフォルトのロールが [switch](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/switch_role) に変更されます。また `checked` 属性が `true` の場合には、スイッチがオンの状態であることがアクセシビリティツリーに伝えられます。

チェックボックスと同等のキーボード操作もサポートされています。フォーカスが当たっている状態でスペースキーを押すと、チェックボックスと同様に `checked` 属性の値がトグルされます。

アクセシビリティ上の注意点として、2023 年 12 月現在ではスイッチにフォーカスした際にデフォルトでフォーカスリングが表示されないようです。このため、スイッチにフォーカスした際にはフォーカスリングを表示するように CSS で指定する必要があります。

```css
input[type="checkbox"][switch]:focus {
  outline: 2px solid blue;
}
```

## 未確定の状態（`indeterminate`）のサポート

`input[type="checkbox"]` 要素には `indeterminate` 属性を指定することで、未確定の状態を表すことができます。この属性は HTML から設定できず、JavaScript から HTMLInputElement オブジェクトの `indeterminate` プロパティを使用して設定する必要があります。

```js
const checkbox = document.querySelector("input[type='checkbox']");

checkbox.indeterminate = true;
```

未確定の状態のチェックボックスは多くのブラウザでチェックボックス内に水平線が表示されるようになっています。また [:indeterminate](https://developer.mozilla.org/ja/docs/Web/CSS/:indeterminate) 疑似クラスを使って、未確定の状態のチェックボックスにスタイルを適用できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2eMGw9lDEza946sPALwnEu/1b7a4f92ed537fc298180b8db10f168a/__________2023-12-23_18.06.06.png)

この `:indeterminate` 疑似クラスは以下の要素を対象としています。

- `<input type="checkbox">` 要素で、JavaScript によって `indeterminate` プロパティが `true` に設定されている場合
- `<input type="radio">` 要素で、フォーム内の同じ `name` の値を持つすべてのラジオボタンが未選択である場合
- `<progress>` 要素で、中間の状態の場合

ただし、冒頭で述べた通り、スイッチ UI はチェックボックスと異なり未確定の状態を持つことはありません。つまり、`<input type="checkbox">` 要素であっても、`switch` 属性を指定されている場合 `indeterminate` プロパティが `true` に設定されいたとしても `:indeterminate` 疑似クラスは適用されません。

## `<switch>` 要素としての提案

この記事では `input[type="checkbox"]` 要素に `switch` 属性を指定することでスイッチ UI を実装する方法を紹介しましたが、[Open UI](https://open-ui.org/) では `<switch>` 要素を提案しています。

https://github.com/openui/open-ui/pull/785

この提案は WHATWG によるものに対して異なるアプローチであると述べられています。

`<switch>` 要素は以下のようにシンプルに実装できます。

```html
<switch></switch>
```

または、スロットを用いることでカスタマイズが可能です。

```html
<switch>
  <track>
    <toggled></toggled>
    <untoggled></untoggled>
  </track>
  <thumb></thumb>
</switch>
```

大きな違いとしては、thumb にアイコンを指定したい場合に `background-image` を使うのではなく、`<thumb>` 要素の中に直接 `<svg>` 要素を記述することでアイコンを指定する点が挙げられています。これはアイコンに対して `currentColor` を指定できるという利点があります。

他にも track に国際化されたテキストを埋め込みたい場合にも、CSS を使わずに `<track>` 要素に対して直接テキストを記述できるという利点があります。

一方で、`input[type="checkbox"]` 要素に `switch` 属性を指定する方法は、古いブラウザに対しても下位互換性が維持されるという利点があると言えるでしょう。

## まとめ

- `input[type="checkbox"]` 要素に `switch` 属性を指定することでスイッチ UI を実装できる
- `switch` 属性によりスイッチを実装するメリットは、スイッチ UI が標準の HTML 要素として実装されることで、アクセシビリティの問題を引き起こす可能性が低くなること
- スイッチは `thumb` と `track` という 2 つのパーツで構成されていて、それぞれに対して疑似要素によりスタイルを指定できる
- whatwg による `input[type="checkbox"]` 要素に `switch` 属性を指定する提案と、Open UI による `<switch>` 要素の提案がある

## 参考

- [Add switch attribute to the input element to allow for a two-state switch control. by lilyspiniolas · Pull Request #9546 · whatwg/html](https://github.com/whatwg/html/pull/9546)
- [Switch proposal by gfellerph · Pull Request #785 · openui/open-ui](https://github.com/openui/open-ui/pull/785)
- [switch demos](https://nt1m.github.io/html-switch-demos/)
- [Switch Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- [ARIA: switch ロール - アクセシビリティ | MDN](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/switch_role)
