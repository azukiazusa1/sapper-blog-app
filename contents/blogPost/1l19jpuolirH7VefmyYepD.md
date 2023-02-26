---
id: 1l19jpuolirH7VefmyYepD
title: "React は javascript スキームを使った XSS を防ぐことができない"
slug: "react-javascript-xss"
about: null
createdAt: null
updatedAt: null
tags: []
published: false
---

多くのフロントエンドのフレームワークはデフォルトで XSS 対策をしてくれます。例えば、React,Vue.js,Angular といったフレームワークは自動的にエスケープ処理を行ってくれます。

ただし、フレームワークの使用方法を間違えると XSS を引き起こすことがあります。例えば React の `dangerouslySetInnerHTML` というプロパティを使うと、HTML をエスケープ処理をせずにそのまま埋め込むため、XSS を引き起こすことができます。

以下のコードを実行すると、`alert("XSS")` が実行されてしまいます。

```jsx
const html = '<script>alert("XSS")</script>';

const App = () => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
```

このように、フレームワークを使用していても完全に XSS 脆弱性を防ぐことはできません。。フロントエンドのセキュリティの正しい知識を身につけた上で、フレームワークの使い方によっては脆弱性を引き起こす可能性がある箇所では、開発者自身によって適切に対処する必要があります。

上記例のように `dangerouslySetInnerHTML` 使用して HTML をそのまま埋め込む場合には、[DOMPurify](https://github.com/cure53/DOMPurify) などのライブラリを使ってサニタイズ行う必要があるでしょう。

```jsx
import DOMPurify from "dompurify";

const html = '<script>alert("XSS")</script>';
const clean = DOMPurify.sanitize(html);

const App = () => {
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};
```

React を使用していた場合に引き起こす可能性がある XSS 脆弱性の例として、javascript スキームを使った XSS があります。この記事では、javascript スキームを使った XSS についての説明とその対策について紹介します。

## javascript スキームを使った XSS とは

javascript スキームを使った XSS とは `<a>` タグの `href` 属性に任意のスキームを設定できることを利用した XSS 脆弱性です。

`<a>` タグの `href` 属性に指定する URL は HTTP ベースの URL に限定されません。以下に上げるようなブラウザが対応するあらゆるスキームを指定することができます。

- `tel:`：電話番号
- `mailto:`：メールアドレス
- `file:`：ローカルファイル
- `javascript:`：javascript を実行する

`javascript:` スキームを使うと `:` 移行の文字列を JavaScript として実行されます。例えば、以下のコードにおいて `<a>` タグをクリックすると `alert("XSS")` が実行されます。

```html
<a href="javascript:alert('XSS')">ここをクリック！</a>
```

![ここをクリックをクリックした後に、ブラウザのアラートダイアログが表示されている](https://images.ctfassets.net/in6v9lxmm5c8/2LtYbOjH1nuOkmiBp6QQYf/a9ad88cf0bc12fe0bb7a8702dab4353f/link-xss.gif)

javascript スキームを使用した XSS 脆弱性を React でも再現することができます。

以下のコードで `<a>` タグの `href` 属性に `todo.url` を渡しているところがポイントです。この値はユーザーが入力した任意の文字列です。この場合、ユーザーが `javascript:alert("XSS")` javascript スキームを用いた文字列が入力された場合に XSS が発生します。

```tsx:App.tsx
import React, { useState } from "react";

type Todo = {
  id: number;
  title: string;
  url: string;
};
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTodos([...todos, { id: todos.length + 1, title, url }]);
          setTitle("");
          setUrl("");
        }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>：
            <a href={todo.url}>{todo.url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

![javascript:alert('XSS') という文字列をフォームに入力してサブミットした後に、表示されたリンクをクリックするとブラウザのアラートダイアログが表示されている様子](https://images.ctfassets.net/in6v9lxmm5c8/1VWH3TeayusifVf4OeGWPu/a746360fe55f99fa69f0789e5e50405f/react-xss.gif)

React 本体でも javascript スキームを使用した XSS 脆弱性が存在することを認識しており、v16.9 からはデベロッパーツールに警告が表示されるようになりました。将来的には、React 本体で対策が行われる可能性があります。

![React 本体の v16.9 から追加された javascript スキームを使用した XSS 脆弱性の警告](https://images.ctfassets.net/in6v9lxmm5c8/3PjpN5jUZPP4iUfV1OTlpz/c9f163ae1c1a03814db7c1097960bc54/____________________________2023-02-26_16.43.54.png)

## javascript スキームを使った XSS の対策

それでは、javascript スキームを使用した XSS 脆弱性をどのように対策するのかを見てみましょう。以下の 3 つの方法があります。

1. http/https スキームのみを許可する
2. Content Security Policy (CSP)  を使用する

### http/https スキームのみを許可する

`<a>` タグの `href` 属性には http/https スキームの URL しか指定できないようにすることで、javascript スキームを使用した XSS 脆弱性を防ぐことができます。

以下のコードでは、`<a>` タグの `href` 属性に `todo.url` を渡す前に関数で URL をチェックしています。`todo.url` が http/https スキームの URL であればそのまま渡し、そうでなければ `undefined` を渡すようにしています。

```tsx:App.tsx
function App() {
  const checkUrlScheme = (url: string): string | undefined => {
    if (url.match(/^https?:\/\//)) {
      return url;
    } else {
      return undefined;
    }
  };

  return (
    <div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <span>{todo.title}</span>：
            <a href={checkUrlScheme(todo.url)}>{todo.url}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

これにより、`javascript:` スキームを使用した文字列を入力しても、`<a>` タグの `href` 属性には `undefined` が渡されるため、リンクがクリックされても何も起こりません。

http/https スキームの URL 以外を入力した場合は、通常のリンクとして機能します。

このように、動的な値を `<a>` タグの `href` 属性に渡す場合は、必ず値が問題ないかチェックを行う必要があります。

### Content Security Policy (CSP)  を使用する

Content Security Policy (CSP)  は、サーバーからブラウザに対して、どのようなリソースを読み込むことができるかを指定することができる仕組みです。CSP を使用することで、XSS や CSS インジェクションなどの脆弱性を軽減することができます。

CSP を有効にするためには [Content-Security-Policy](https://developer.mozilla.org/ja/docs/Web/HTTP/Headers/Content-Security-Policy) ヘッダーをレスポンシブに含ませるか、`<meta>` タグを使用して指定します。

以下の例は `Content-Security-Policy` ヘッダーを使用しています。

```
Content-Security-Policy: default-src 'self'; script-src 'self'
```

CSP では `default-src` や `script-src`、`style-src` のような「ディレクティブ」を用いてどのリソースの読み込みを制限するかを指定します。`default-src` は、デフォルトでどのようなリソースの読み込みを許可するかを指定します。`script-src` は、`<script>` タグで読み込む JavaScript の読み込みを許可するかを指定します。`style-src` は、`<style>` タグで読み込む CSS の読み込みを許可するかを指定します。`default-src` は特に指定のないリソースに対するフォールバックです。

簡単に以下の例を見てみましょう。インラインスタイルを用いて CSS を適用しています。

```html
<p style="color: red">Hello World</p>
```

![赤文字で Hello World と表示されている]([./images/inline-style.png](https://images.ctfassets.net/in6v9lxmm5c8/2exV1UWri1vyeEj1GtYxYs/e8d39b1ab3fe04e4ec97c4fff9d48438/____________________________2023-02-26_17.08.42.png))

ここで `style-src` ディレクトリを用いて、インラインスタイルの読み込みをを許可しないように設定してみましょう。簡易的に `<meta>` タグを使用して設定してみます。

```html
<head>
  <meta
    http-equiv="Content-Security-Policy"
    content="style-src 'self'"
  />
</head>
<body>
  <p style="color: red">Hello World</p>
</body>
```

以下のように、インラインスタイルの読み込みが許可されていないため、スタイルが適用されていないことがわかります。デベロッパーツールのコンソールには CSP によりインラインスタイルの読み込みがブロックされたことが表示されます。

![黒文字で Hello World と表示されている。デベロッパーツールにはインラインスタイルの読み込みがブロックされたことが表示される]([./images/csp.png](https://images.ctfassets.net/in6v9lxmm5c8/3PjpN5jUZPP4iUfV1OTlpz/c9f163ae1c1a03814db7c1097960bc54/____________________________2023-02-26_16.43.54.png))

CSP を使用しながらインラインスタイルを使用したい場合は、以下のように `unsafe-inline` を指定します。しかし、インラインスタイルを許可することは CSP が提供する最大のセキュリティ上の利点を損なうため、どうしても必要な場合を除いては使用しないようにしましょう。

```html
<meta
 http-equiv="Content-Security-Policy"
 content="style-src 'self' 'unsafe-inline'"
/>
```

セキュリティを維持しながらインラインスタイルを使用したい場合は、`nonce` を指定する方法があります。`nonce` は、サーバー側でランダムな文字列を指定することで、その文字列を含むインラインスタイルのみを許可することができます。以下の例では、`nonce` に `123456` を指定しています。（あくまで例示目的の値であり、実際にはサーバー側でリクエストごとに推測困難なランダムな文字列を生成する必要があります。）

```
Content-Security-Policy: style-src 'nonce-123456'
```

以下のように `<style>` に `nonce` を指定することで使用することができます。

```html
<style nonce="123456">
  p {
    color: red;
  }
</style>
```

CSP について話を進めるとそれだけで 1 つの記事ができてしまうので、このあたりで一旦切り上げることにします。より詳しく知りたい場合には [コンテンツセキュリティポリシー (CSP) - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP) を参照してください。

javascript スキームを使用した XSS　脆弱性の話に戻りましょう。CSP で `script-src` ディレクティブを指定するとインラインのスクリプトの実行を防ぐことができます。

先程の React のコードの `index.html` に `<meta>` タグで CSP を設定してみましょう。

```html:index.html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'" />
```

今度は http/https であるかチェックを実施しないように変更してみます。

```html:App.js
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>
      <span>{todo.title}</span>：
      <a href={todo.url}>{todo.url}</a>
    </li>
  ))}
</ul>
```  

狙い通り、スクリプトがブロックされていることがわかりました。デベロッパーツールには CSP によりスクリプトの実行がブロックされたことが表示されます。

![javascript:alert('XSS')と書かれたリンクをクリックしても何も発生しない様子](https://images.ctfassets.net/in6v9lxmm5c8/e6Wy5wiuN9iW9GUeX7lSl/71f1fba4cc204f5bc890e8b9fca70620/react-csp.gif)

## まとめ

- React では `href` に `javascript:` スキームを使用すると XSS 脆弱性が発生する
- 以下の方法で XSS 脆弱性を防ぐことができる
  - `href` 属性に動的な値を設定する場合は、URL のチェックを行う
  - CSP を使用してインラインスクリプトの実行をブロックする

## 参考

- [フロントエンド開発のためのセキュリティ入門 知らなかったでは済まされない脆弱性対策の必須知識（平野 昌士 はせがわ ようすけ 後藤 つぐみ）｜翔泳社の本](https://www.shoeisha.co.jp/book/detail/9784798169477)
- [コンテンツセキュリティポリシー (CSP) - HTTP | MDN](https://developer.mozilla.org/ja/docs/Web/HTTP/CSP)