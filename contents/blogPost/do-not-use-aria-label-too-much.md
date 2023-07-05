---
id: ET62BoafEwJtyQKSp9wgo
title: "aria-label を使いすぎない"
slug: "do-not-use-aria-label-too-much"
about: "aria-label 属性はコンテンツに対してアクセシブルな名前を与えるために使用します。aria-label 属性を使用する代表例として、中身がアイコンのボタンがあげられます。aria-label 属性は手軽に使えますが、できる限り一般的な形式でテキストを提供することが望ましいです。"
createdAt: "2023-06-25T13:17+09:00"
updatedAt: "2023-06-25T13:17+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2dIAKpm7Y9ogvW4OkIYzZ6/1ca0942de03dde369d3c7d5647ef9146/hakubishin_masked-musang_18420.png"
  title: "ハクビシン"
published: true
---
`aria-labe` 属性はコンテンツに対してアクセシブルな名前を与えるために使用します。`aria-label` 属性を使用する代表例として、中身がアイコンのボタンがあげられます。`<button>` 要素はデフォルトではコンテンツの中身がアクセシブルな名前として使われます。しかし、アイコン要素は通常テキストを持たないため、アクセシブルな名前を持たないことになります。アクセシブルな名前を持たない要素は、単にボタンであることしかスクリーンリーダーを利用するユーザに伝わらないので、クリックしたときに何が起こるのが予測できません。

```html
<button>
  <svg aria-hidden="true">...</svg>
</button>
```

このような場合には、`aria-label` 属性を用いてアクセシブルな名前を与えることができます。

```html
<button aria-label="いいね">
  <svg aria-hidden="true">...</svg>
</button>
```

`aria-label` 属性によりアクセシブルな名前を与えることで、スクリーンリーダーを利用するユーザーと目に見える人（以下、晴眼者）にとって同じようにボタンの役割が理解できるようになります。アクセシブルな名前を与える目的として、`aria-label` 属性はお手軽ですので、`aria-label` 属性を使いすぎてしまうことがあります。

ですが、`aria-label` 属性を使用してアクセシブルな名前を与える（正しくは上書き）目的は、**晴眼者とスクリーンリーダーを利用するユーザーにとって同じ情報を与える**ということを忘れないでください。`aria-label` 属性はスクリーンリーダーを利用するユーザーにのみ意味があります。晴眼者にとっては、`aria-label` 属性の内容を知ることはないでしょう。この違いにより、晴眼者とスクリーンリーダーを利用するユーザーの間で情報に差異が生まれてしまいます。

原則として、アクセシブルな名前は目に見えるテキストと共に与えられるべきです。`aria-label` よりも目に見えているテキストを参照する `aria-labelledby` 属性を使用すること優先するべきです。さらに言うと、`aria-*` プロパティを使用するよりも `<label>` 要素を使用したり、`<button>` 要素の中にテキストを入れるなど、HTML の標準の機能を使用することを優先するべきです。

`aria-label` 属性は表示領域の制約などでどうしてもテキストを配置できない場合のみ使用するべきです。いくつかの例を見ていきましょう。

## `aria-label` 属性でより詳細な情報を与えている

リンクのテキストに対してより良い情報を与えるために `aria-label` 属性が使われることがしばしばあります。例えば、以下のようなリンクがあるとします。

```html
くわしくは<a href="https://react.dev">こちら</a>をご覧ください。
```

このリンクのテキストは「こちら」ですが、このリンクがどのようなコンテンツに遷移するのかはわかりません。「こちら」のようなリンクテキストは周囲の文脈によっては意味がわかるようになっていることが多いです。スクリーンリーダーにはリンクのみを一覧で読み上げる機能があります。このような場合には、周囲の文脈の情報が失われるので、リンクテキストだけではリンクの意味がわからなくなってしまいます。

リンクテキストのみでリンク先の内容を予測できるようにすることが好ましいです。この状況を改善するために、`aria-label` 属性を使用してリンクのテキストにアクセシブルな名前を与えることができます。

```html
くわしくは<a href="https://react.dev" aria-label="React 公式ドキュメント">こちら</a>をご覧ください。
```

確かに `aria-label` 属性を使用することで、スクリーンリーダーを利用するユーザーにとってはリンクの意味がわかるようになります。しかし、晴眼者にとっては依然としてリンク先の内容を予測するのが難しいかもしれません。例えばブラウザのサイズを 200%に拡大して利用しているユーザーは前後の文脈を拾い上げることが難しくなります。

より良い解決策は、`aria-label` 属性を使用してリンクテキストにアクセシブルな名前を与えるのではなく、リンクテキスト自体を変更することです。

```html
くわしくは<a href="https://react.dev">React 公式ドキュメント</a>をご覧ください。
```

## `aria-label` 属性でランドマークロールやウィンドウロールに名前を与えている

`role="dialog"` を持つ要素はアクセシブルな名前を持つことが求められています。通常 1 つのウェブサイトには複数の種類のダイアログが存在することでしょう。現在ユーザーがどのダイアログを操作しているか伝えるために、アクセシブルな名前が役に立ちます。

`aria-label` 属性を使用することで、次のようにダイアログにアクセシブルな名前を与えることができます。

```html
<dialog aria-label="ログイン">
  <form>
    <label for="email">メールアドレス</label>
    <input type="email" id="email" />
    <label for="password">パスワード</label>
    <input type="password" id="password" />
    <button type="submit">ログイン</button>
  </form>
</dialog>
```

これでダイアログにアクセシブルな名前が与えられましたが、ログインダイアログであることが伝わるのはスクリーンリーダーを利用するユーザーだけです。晴眼者にとっては何を行うダイアログなのか一見してわかりません。このような場合には、ダイアログのタイトルとして「ログイン」というテキストを表示した上で、`aria-labelledby` 属性を使用してダイアログのタイトルと同じテキストを参照することで、スクリーンリーダーを利用するユーザーと晴眼者に同じ情報を与えることができます。`aria-labelledby` 属性は `id` 属性を参照するため、`id` 属性を持つ要素を用意する必要があります。

```html
<dialog aria-labelledby="title">
  <h2 id="title">ログイン</h2>
  <form>
    <label for="email">メールアドレス</label>
    <input type="email" id="email" />
    <label for="password">パスワード</label>
    <input type="password" id="password" />
    <button type="submit">ログイン</button>
  </form>
</dialog>
```

`aria-labelledby` 属性を使用して可視のテキストを紐付けるもう 1 つのメリットとして、将来の変更に対応しやすくなるという点があります。例えば、ダイアログのタイトルを変更したいとします。この場合、`aria-labelledby` 属性を使用している場合は、`id` 属性を持つ要素のテキストを変更するだけで済みます。一方で、`aria-label` 属性を使用している場合は、`aria-label` 属性の内容を変更する必要があります。`aria-label` 属性を使用している場合、ダイアログのタイトルを変更するときに `aria-label` の内容の変更を忘れてしまうと、ダイアログのタイトルとアクセシブルな名前の内容が異なってしまいます。

このように `aria-labelledby` 属性を使用してタイトルと同じテキストを参照する方法は、ダイアログに限らず `role="search"` や `role="nav"` など [ランドマークロール](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles#3._landmark_roles) を持つ要素に対しても効果的です。

## `<input>` 要素に `aria-label` 属性を使用している

`<input>` 要素に `aria-label` 属性を使用することで、`<input>` 要素にアクセシブルな名前を与えることができます。例えば、以下のような検索フォームがあるとします。

```html
<form>
  <i class="icon icon--search"></i>
  <input type="search" aria-label="ツイートを検索" />
</form>
```

検索フォームには明示的なテキストを与えずに単にテキストフィールドのみが表示されているのをよく見かけるでしょう。虫眼鏡のアイコンは検索フォームであることを示すことが広く知れ渡っているためでしょう。スクリーンリーダーを利用しているユーザーにとっては虫眼鏡のアイコンは意味がないので、`aria-label` でアクセシブルな名前を与えることは意に沿った方法です。

ここでも、本当に可視化されるテキストが必要ないのか一度考えてみるとよいでしょう。`aria-label` では「ツイートを検索」というテキストが与えられていますが、晴眼者にとって「何」を検索するためのフォームなのか伝わらないおそれがあります。可視化されるテキストを与えることで、晴眼者にとっても同じ情報が伝わるようになります。

可視化されたテキストをアクセシブルな名前として使用する方法で先程は `aria-labelledby` 属性を使用しましたが、HTML 標準の方法でアクセシブルな名前を与えることができるのであれば、そちらを優先するのが原則です。`<input>` 要素は `<label>` 要素を使うことでアクセシブルな名前を与えることができます。

```html
<form>
  <label for="search">ツイートを検索</label>
  <i class="icon icon--search"></i>
  <input type="search" id="search" />
</form>
```

`<input>` 要素以外にも、以下の方法で `aria-*` 属性を使用せずともアクセシブルな名前を与えることができます。まずは以下の方法を使うことを一番に検討するべきです。

| HTML 要素 | アクセシブルな名前を与える方法 |
| --- | --- |
| `<button>` 要素 | `<button>` 要素の中にテキストを入れる |
| `href` 属性を持つ `<a>` 要素 | `<a>` 要素の中にテキストを入れる |
| `<img>` 要素 | `alt` 属性 |
| `<input>` 要素 | `<label>` 要素 |
| `<select>` 要素 | `<label>` 要素 |
| `<textarea>` 要素 | `<label>` 要素 |
| `<table>` 要素 | `<caption>` 要素 |
| `<figure>` 要素 | `<figcaption>` 要素 |
| `<fieldset>` 要素 | `<legend>` 要素 |

## テキストは `aria-label` よりも有益

テキストは `aria-label` と比べて単に目に見えるだけでなく、いくつかの点で有益です。

- `aria-label` のテキストは検索できない
- `aria-label` のテキストはコピーできない
- いくつかのブラウザでは `aria-label` は翻訳されない

### `aria-label` のテキストは検索できない

`aria-label` で与えたアクセシブルな名前はブラウザの検索機能で検索できません。これはスクリーンリーダーの利用者に混乱を招く恐れがあります。なぜなら、スクリーンリーダーの利用者は通常のテキストを `aria-label` のテキストの違いを意識しないからです。

### `aria-label` のテキストはコピーできない

コピー & ペースト（通称コピペ）」最も革新的な発明の 1 つであり、普段の生活で欠かすことができないでしょう。それにもかからわず、`aria-label` で与えたテキストはコピーできません。テキストをコピーできないことがもたらす悪影響はあなたがよく知っていることでしょう。

### いくつかのブラウザでは `aria-label` は翻訳されない

多くのブラウザには自動翻訳機能が備わっており、これを利用している人も多いでしょう。[Google Chrome と Edge は aria-label テキストの翻訳をサポート](https://adrianroselli.com/2019/11/aria-label-does-not-translate.html#Browsers) しているものの、Firefox や Safari は `aria-label` のテキストを翻訳しません。確実にテキストを翻訳して伝えたい場合には、通常のテキストを使用することが望ましいでしょう。

## まとめ

- `aria-label` 属性を使用する前に、テキストが可視化される `aria-labelledby` 属性を使用や HTML の標準の機能を使用することを検討する
- `aria-label` 属性を使用する場合は、スクリーンリーダーを利用するユーザーにのみ情報が伝わることを意識する。スクリーンリーダーを利用するユーザーに与えたい情報は、おそらくすべてのユーザーにとっても有用な情報である
- 晴眼者とスクリーンリーダーを利用するユーザーにとって同じ情報を与えることを意識する

## 参考

- [aria-label is a code smell](https://ericwbailey.website/published/aria-label-is-a-code-smell/)
- [How to NOT use aria-label](https://auroratide.com/posts/how-to-not-use-aria-label)
- [aria-label - Accessibility - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)
- [aria-label Does Not Translate](https://adrianroselli.com/2019/11/aria-label-does-not-translate.html)
- [Labelling elements using aria-label and aria-labelledby](https://www.accessibility-developer-guide.com/examples/sensible-aria-usage/label-labelledby/#text-not-searchable)
