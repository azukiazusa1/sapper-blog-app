---
id: E9h5F3wNHUVm_nI-nMQ0S
title: "`<details>` 要素の `name` 属性による排他的なアコーディオンの実装"
slug: "details-name-attribute-accordion"
about: "`<details>` 要素の `name` 属性を利用してグループ化することにより、排他的なアコーディオンを JavaScript なしで実装できます。"
createdAt: "2023-10-08T15:00+09:00"
updatedAt: "2023-10-08T15:00+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3QFLH315wDCOBd0pQ43yDr/ef51686c64b5f807b2c854b8d932b578/accordion_11614.png"
  title: "アコーディオンのイラスト"
published: true
---
!> `<details>` 要素の `name` 属性は 2023 年 10 月 8 日現在 Chrome Canary のみ実装されています。

アコーディオンは [Disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)（コンテンツを折りたたむ、または展開することを可能にするウィジェット） が垂直に並べられた UI の総称です。いくつかのアコーディオンはグループ化された Disclosure の中でただ 1 つしか開くことができないという制約を持っています（排他的なアコーディオン）。つまり、ある Disclosure が開いているときに、他の Disclosure を開いた場合には、開いている Disclosure は閉じられるという挙動を実装する必要があります。

単純な Disclosure の場合には [`<details>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/details) 要素を利用することで JavaScript を用いずとも実装できます。しかし、排他的なアコーディオンを実装する場合には、他の Disclosure が開いているかどうかの状態を保持する必要があるため、JavaScript を用いた実装が必要でした。

ですが、[HTML Living Standard に追加された](https://github.com/whatwg/html/pull/9400) `name` 属性を利用して `<details>` 要素をグループ化することによって、JavaScript を用いずとも排他的なアコーディオンを実装できるようになりました。

## `<details>` 要素の `name` 属性を利用した排他的アコーディオンの実装

それでは実際に `<details>` 要素の `name` 属性を利用して排他的なアコーディオンを実装してみましょう。ラジオボタンと同じように、グループ化したい `<details>` 要素に同じ `name` 属性を設定します。HTML Living Standard によれば、`<details>` 要素をグループ化する場合には `<section>` 要素のような包含要素でまとめることが推奨されています。

```html
<section>
  <details name="accordion">
    <summary>Accordion 1</summary>
    <p>Content 1</p>
  </details>
  <details name="accordion">
    <summary>Accordion 2</summary>
    <p>Content 2</p>
  </details>
  <details name="accordion">
    <summary>Accordion 3</summary>
    <p>Content 3</p>
  </details>
</section>
```

上記のコードは Chrome Canary で動作を確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6nsPODBygjMhZkRAlYQhH6/45ee058fb4c2da008d7cceb1a456ca26/_____2023-10-08_15.37.36.mov" controls></video>

## JavaScript から `open` 属性を設定した場合

グループ化された `<details>` 要素の中で、JavaScript から `open` 属性を設定した場合には、他の `<details>` 要素の `open` 属性は自動的に `false` に設定されます。以下の例を見てみましょう。初期状態では 1 つ目の `<details>` 要素に `open` 属性が設定されて開かれています。

```html
<section>
  <details name="accordion" open id="accordion1">
    <summary>Accordion 1</summary>
    <p>Content 1</p>
  </details>
  <details name="accordion" id="accordion2">
    <summary>Accordion 2</summary>
    <p>Content 2</p>
  </details>
  <details name="accordion" id="accordion3">
    <summary>Accordion 3</summary>
    <p>Content 3</p>
  </details>
</section>

<button>Open Accordion 2</button>
```

次のスクリプトは、ボタンをクリックした時、2 つ目の `<details>` 要素に `open` 属性を設定します。

```js
const button = document.querySelector("button");
const accordion2 = document.querySelector("#accordion2");

button.addEventListener("click", () => {
  accordion2.setAttribute("open", "");
});
```

このコードを実行すると `<details>` 要素を直接操作した時と同様に、2 つ目の `<details>` 要素を開いたことによって、1 つ目の `<details>` 要素が閉じられることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3qc0Xh0ALBnDKyqgRHgvkJ/736967262d7dd41e3f747ee43aeec4fe/_____2023-10-08_15.53.12.mov" controls></video>

## 同じ `<details>` 要素のグループに複数の `open` 属性を設定した場合

HTML Living Standard によると、同じ `<details>` 要素のグループに複数の `open` 属性を設定してはならないと規定されています。

> A document must not contain more than one details element in the same details name group that has the open attribute present.

https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element

実際に Chrome Canary で試してみると、2 つ目と 3 つ目の `open` 属性は無視され、1 つ目の `<details>` 要素のみが開かれます。

```html
<section>
  <details name="accordion" open id="accordion1">
    <summary>Accordion 1</summary>
    <p>Content 1</p>
  </details>
  <details name="accordion" open id="accordion2">
    <summary>Accordion 2</summary>
    <p>Content 2</p>
  </details>
  <details name="accordion" open id="accordion3">
    <summary>Accordion 3</summary>
    <p>Content 3</p>
  </details>
</section>
```

## 参考 

- [Accordion | OpenUI](https://open-ui.org/components/accordion.research/)
- [4.11.1 The details
element(WHATWG)](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-details-element)
