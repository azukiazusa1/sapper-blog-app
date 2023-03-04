---
id: 5GQ7QBbcMR9aA3pr1Qvb5i
title: "Sanitizer API で HTML を安全に使用する"
slug: "sanitizer-api-html"
about: "ユーザーが入力した情報をそのまま表示するとクロスサイトスクリプティング（XSS）脆弱性につながる問題があることはよく知られています文字列の無害化はこのようにライブラリの実装に頼っている状況でしたが、WING により Sanitizer API という仕様が策定されました。Sanitizer API により外部ライブラリの依存無しで XSS の対策が可能となります。"
createdAt: "2022-09-04T00:00+09:00"
updatedAt: "2022-09-04T00:00+09:00"
tags: ["SanitizerAPI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5vAcBQlytpjsH06swnWX6X/8f48de8d9e5ed2d796f3374f3c5fcc66/raphael-wild-TfzrBcO4XBY-unsplash.jpg"
  title: "raphael-wild-TfzrBcO4XBY-unsplash"
published: true
---
ユーザーが入力した情報をそのまま表示するとクロスサイトスクリプティング（XSS）脆弱性につながる問題があることはよく知られています。例えば [Element.innerHTML](https://developer.mozilla.org/ja/docs/Web/API/Element/innerHTML) を使用して HTML 要素を追加する場合潜在的なセキュリティリスクが生じます。以下のコードを実行するとスクリプトが実行されアラートが表示されます。

```js
const el = document.getElementById("app");
el.innerHTML = `<img src='x' onerror='alert("xss!")'>`;
```
https://codesandbox.io/embed/eloquent-wildflower-q7144r?fontsize=14&hidenavigation=1&theme=dark

このため、`innerHTML` を使用する際には文字列を必ず [DomPurify](https://github.com/cure53/DOMPurify) や [sanitize-html](https://github.com/apostrophecms/sanitize-html) などのライブラリを使用して無害化（サニタイズ）してから追加する必要があります。`DomPurify` により `onerror` 属性が取り除かれていることが確認できます。

```js
import DOMPurify from "dompurify";
const el = document.getElementById("app");
const dirty = `<img src='x' onerror='alert("xss!")'>`;
const clean = DOMPurify.sanitize(dirty); // <img src="x">
console.log(clean);

el.innerHTML = clean;
```

https://codesandbox.io/embed/proud-platform-75qzsr?fontsize=14&hidenavigation=1&theme=dark

文字列の無害化はこのようにライブラリの実装に頼っている状況でしたが、WING により [Sanitizer API](https://wicg.github.io/sanitizer-api/#sanitizer-api) という仕様が策定されました。Sanitizer API により外部ライブラリの依存無しで XSS の対策が可能となります。現在は [Chrome 105](https://developer.chrome.com/blog/new-in-chrome-105/) に実験的に実装されていますが、将来的にブラウザの実装が進めばバンドルサイズを削減できることでしょう。

## Sanitizer API の使い方

`DomPurify` や `sanitize-html` などのライブラリと `Sanitizer API` の違いとして、結果をどのように返すかという点が挙げられます。`DomPurify` は結果としてサニタイズされた文字列を返しますが、`Sanitizer API` は DOM 要素を返却します。これは処理パフォーマンスや脆弱性、HTML のコンテキストを考慮した結果です。例えば、`<td>` 要素は `<table>` 要素の配下に存在することが期待されますが、単純に文字列を返す実装ではこのことは考慮されません。

それでは実際の使用方法を見てみましょう。`Sanitizer API` 以下の 2 通りの使用方法があります。

- [setHTML](https://developer.mozilla.org/ja/docs/Web/API/Element/setHTML) の引数として渡す
- [sanitizeFor](https://developer.mozilla.org/en-US/docs/Web/API/Sanitizer/sanitizeFor) メソッドでサニタイズした結果を受け取る

### `setHTML` の引数として渡す

`setHTML` は `Sanitizer API` と同様に Chrome 105 から実験的に追加された機能です。HTML の文字列を解釈してこの要素をサブツリーとして DOM に挿入する点は `innerHTML` と同じですが、サニタイズ処理がされる点がことなります。

サニタイズ処理では安全でない、あるいは不要な要素、属性、コメントを削除します。サニタイズの設定は `Sanitizer()` コンストラクタのオプションを使用してカスタマイズでいます。コンストラクタオプションを指定しない場合、規定のサニタイズを使用します。

下記の例では、`onerror` 属性が削除され DOM に追加されます。

```js
const el = document.getElementById("app");

const sanitizer = new Sanitizer();

const dirty = `<img src='x' onerror='alert("xss!")'>`;
el.setHTML(dirty, { sanitizer });
```

https://codesandbox.io/embed/quirky-meadow-frwtg1?fontsize=14&hidenavigation=1&theme=dark

`Sanitizer()` コンストラクタに引数を渡さない場合には、以下のように `sanitizer` オプション無しで `setHTML` を使用するのと同義になります。

```js
el.setHTML(dirty);
```

また解釈処理において現在の要素のコンテキストで無効な HTML 文字列の要素を削除します。`<td>` は `<table>` 要素の配下に存在する必要があるので、`setHTML` で挿入した場合には `<td>` が取り除かれています。

```js
const el = document.getElementById("app"); // これは<div>要素

const sanitizer = new Sanitizer();

el.setHTML("<td>oops!</td>", { sanitizer });
```

https://codesandbox.io/embed/jolly-kowalevski-9rys14?fontsize=14&hidenavigation=1&theme=dark

### sanitizeForメソッドでサニタイズした結果を受け取る

無害化した HTML をまだ DOM に挿入したくない場合には、`Sanitizer API` の `sanitizeFor` メソッドを使用してサニタイズされた `HTMLElement` 要素を得られます。

このメソッドは第 1 引数に HTML 要素のタグ名、第 2 引数に HTML 文字列を受け取りタグ名に対応した HTML 要素を返却します。

```js
const sanitizer = new Sanitizer();
const dirty = `<img src='x' onerror='alert("xss!")'>`;
const clean = sanitizer.sanitizeFor('div', dirty) // HTMLDivElement

console.log(clean.innerHTML) // <img src='x'>
```

### サニタイズの設定

サニタイズの設定は `Sanitizer()` コンストラクタでオプションを渡すことで行います。

#### allowElements
サニタイザーが削除してはならない要素を示す文字列の配列。この配列に含まれないすべての要素が削除されます。

#### blockElements
サニタイザーが削除する必要があるが、それらの子要素を維持する要素を示す文字列の配列。

#### dropElements
サニタイザーが削除すべき要素（ネストされた要素を含む）を示す文字列の配列。

#### allowAttributes
各キーが属性名であり、値が許可されたタグ名の配列であるオブジェクト。一致する属性は削除されません。配列に含まれない属性は、すべて削除されます。

#### dropAttributes
各キーが属性名で、値が削除されるタグ名の配列であるオブジェクト。一致する属性は削除されます。

#### allowCustomElements
false（デフォルト）に設定されたブール値は、カスタム要素とその子要素を削除します。true に設定すると、カスタム要素は組み込みとカスタムの設定チェックの対象となります（そして、それらのチェックに基づいて保持または削除されます）。

#### allowComments
ブール値を false（デフォルト）に設定すると、HTML コメントが削除されます。コメントを残すには true を指定します。

例えば、`allowElements` に `["b"]` を指定舌倍、`<b>` タグはそのまま残りますが `<i>` タグが取り除かれていることがわかります。

```js
const el = document.getElementById("app");
const sanitizer = new Sanitizer({ allowElements: ["b"] });
el.setHTML("<b>1</b><i>2</i>", { sanitizer });
```

https://codesandbox.io/embed/billowing-snowflake-cm7f01?fontsize=14&hidenavigation=1&theme=dark
