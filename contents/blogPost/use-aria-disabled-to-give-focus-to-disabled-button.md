---
id: 4tyFV1argIJHolBcOfw8iM
title: "無効にしたボタンにフォーカスさせたいときには aria-disabled を使う"
slug: "use-aria-disabled-to-give-focus-to-disabled-button"
about: "例えばフォームの項目になにか入力されるまで、送信ボタンを無効にしたい状況があるかと思います。このような場合には `<button>` に `disabled` 属性を与えることでフォームの送信を無効にできます。`disabled` 属性はデフォルトでコントロールを無効にする一般的に期待されるすべての機能を提供するため、多くの場合はこの属性を使用するべきです。しかし `disabled` 属性には 1 つ問題点が存在します。それは Tab キーによるフォーカスができなくなるという点です。"
createdAt: "2023-01-15T00:00+09:00"
updatedAt: "2023-01-15T00:00+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5xM7a4bU4UAjoESjJLKnAx/6ca06a421bf61062f54c086118db09d6/_Pngtree_three-dimensional_creative_shiny_hand-painted_champagne_5339039.png"
  title: "シャンパン"
published: true
---
例えばフォームの項目になにか入力されるまで、送信ボタンを無効にしたい状況があるかと思います。このような場合には `<button>` に `disabled` 属性を与えることでフォームの送信を無効にできます。また多くのブラウザの規定のスタイルでは `disabled` 属性が与えられると薄いグレーアウトされた色で表示され、視覚的にも無効化されていることを判別できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/mdjmaJP?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/mdjmaJP">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`disabled` 属性はデフォルトでコントロールを無効にする一般的に期待されるすべての機能を提供するため、多くの場合はこの属性を使用するべきです。しかし `disabled` 属性には 1 つ問題点が存在します。それは Tab キーによるフォーカスができなくなるという点です。

## disabled 属性を使用したときの問題

`disabled` 属性が存在する要素はフォーカス不可となります。このことはキーボードを用いて操作しているユーザー、とりわけ視覚障害者にとってボタンの存在が認知されづらいものとなってしまいます。

Tab キーのよるフォーカスができない要素は存在しないのとほぼ同義だからです。

無効化されたボタンであっても Tab キーによるフォーカスを可能にして認知されるようにしたい場合には、`disabled` 属性の代わりに `aria-disabled` 属性を使うという手段が考えられます。

## aria-disabled 属性を使う

`aria-disabled` 属性を `true` に設定した場合、その要素は意味的に無効であることが示されます。`disabled` 属性と異なり要素の機能が変更されることがないので、Tab キーでフォーカス可能です。

次のように、スクリーンリーダーからもボタンが無効である旨が読み上げられます。（Voice Over では要素が無効である旨を「淡色表示」として読み上げられます）

![aria-disabled 属性により無効であることが示されたボタンにフォーカスしている様子。Voice Over により Submit、ボタン、淡色表示と読み上げられている。](//images.ctfassets.net/in6v9lxmm5c8/5Mdg196kXH9CsGnpYJG0cT/b051419f6c2f87d3a97067fb7e15af17/____________________________2023-01-13_19.30.52.png)

## aria-disabled 属性を使用した場合の注意点

`aria-disabled` 属性は単に意味的にのみ無効であること示している点に注意する必要があります。`aria-disabled` 属性を使用する場合には以下に列挙する機能は提供されないため、開発者自身により実装する必要があります。

- ボタンをクリックしたときの機能が抑制される。サブミットボタンなら Enter キーによりフォームが送信されない。
- フォームに入力できず、無効にしたフォームがサブミットした際の値に含まれない。
- 見た目上無効であることがわかるようなスタイル。

これらの機能は JavaScript もしくは CSS を利用して実装します。CSS でスタイルを変更する際に、`aria-disabled` 属性では [:disabled](https://developer.mozilla.org/ja/docs/Web/CSS/:disabled) 擬似クラスは適用されません。`[aria-disabled="true"]` のようなセレクタを使用するのがよいでしょう。

```css
[aria-disabled="true"] {
  opacity: 0.5;
}
```

サブミットボタンを `disabled` にした際にフォームのサブミットを無効にする機能は以下のように JavaScript で実装します。

```js
const disabled = !name || !email;

const handleSubmit = e => {
  e.preventDefault();
  if (disabled) {
    return;
  }
  alert(name, email);
};
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/PoBjpLJ?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PoBjpLJ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## おわりに

この記事では以下の観点について記載いたしました。
- ボタンを `disabled` にしているとフォーカスできないのでユーザーが存在に気づかない可能性がある。
- `aria-disabled` を使うと意味的にボタンを無効にしつつ、ユーザーがフォーカス可能になる。この場合、機能を無効にする機能を実装する必要がある。

またサブミットボタンの無効を検討にする前に、サブミットボタンを常に有効にするという方法も検討してみてもよいでしょう。ユーザーがサブミットボタンをクリックしたタイミングでフォームがサブミットできない理由を示す旨のメッセージを表示すればよいわけです。

サブミットボタンを常に有効にする方法を取ると、Tab キーでフォーカスできない問題も発生しません。また常時サブミットボタンを無効にしていると、ユーザーはなぜボタンが無効化されているのか理解できず混乱を与える可能性もあります。

## 参考

- [お問い合わせフォームのウェブアクセシビリティ対応の方法 - ICS MEDIA](https://ics.media/entry/201016/)
- [Aria-disabled | Introduction to Accessibility](https://a11y-101.com/development/aria-disabled)
- [サブミット (送信) ボタンをデフォルトで無効化しない | Accessible & Usable](https://accessible-usable.net/2021/10/entry_211014.html)
- [aria-disabled - Accessibility | MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)
