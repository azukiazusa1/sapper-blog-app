---
id: ejURkr0nA-QjuHZeSL0i-
title: "標準の Web API で URL のパターンマッチングを処理する URLPattern"
slug: "urlpattern-web-api"
about: "Web アプリケーションにおけるルーティングは重要な要素です。URL Pattern API は URL のパターンマッチングを標準化するための Web API であり、ブラウザやサーバーサイド環境で一貫した方法で URL パターンを処理できます。この記事では、URLPattern API の基本的な使い方とパターン構文について解説します。"
createdAt: "2025-11-13T21:33+09:00"
updatedAt: "2025-11-13T21:33+09:00"
tags: ["Web API", "URLPattern"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10XfYfmllC32jzxDDaca2Y/9be5f21041bd28bc2417fd1ba5c56b20/niku-udon_16433.png"
  title: "肉うどんのイラスト"

audio: null
selfAssessment:
  quizzes:
    - question: '次のコードで `/users/123` にマッチし、`{ id: "123" }` を抽出する URLPattern の定義はどれですか？'
      answers:
        - text: "new URLPattern({ pathname: '/users/{id}' })"
          correct: false
          explanation: "`{id}` はグループ区切り文字であり、結果にキャプチャされません。したがって `id` パラメーターは抽出されません。"
        - text: "new URLPattern({ pathname: '/users/:id' })"
          correct: true
          explanation: "`:id` は名前付きグループで、任意の文字列にマッチします。したがって `/users/123` にマッチします。"
        - text: 'new URLPattern({ pathname: "/users/[id]" })'
          correct: false
          explanation: "`[id]` は URLPattern の構文では使用されません。"
        - text: "new URLPattern({ pathname: '/users/[:id]' })"
          explanation: "`[:id]` は URLPattern の構文では使用されません。
          correct: false
    - question: "URLPattern のインスタンスでパスにマッチしたかどうか真偽値をで取得するにはどのメソッドを使用しますか？"
      answers:
        - text: "match() メソッド"
          correct: false
          explanation: "`match()` メソッドは存在しません。"
        - text: "test() メソッド"
          correct: true
          explanation: "`test()` メソッドはマッチした場合に `true`、マッチしなかった場合に `false` を返します。"
        - text: "exec() メソッド"
          correct: false
          explanation: "`exec()` メソッドはマッチした場合に詳細な情報を含むオブジェクトを返し、マッチしなかった場合は `null` を返します。"
        - text: "check() メソッド"
          correct: false
          explanation: "`check()` メソッドは存在しません。"
    - question: "URLPattern で大文字・小文字を区別しないマッチングを行うにはどうすればよいですか？"
      answers:
        - text: "URLPattern コンストラクタのオプションで ignoreCase を true に設定する"
          correct: true
          explanation: "`ignoreCase` オプションを `true` に設定すると、大文字・小文字を区別しないマッチングが可能になります。"
        - text: "パターン内で正規表現を使用する"
          correct: false
          explanation: ""
        - text: "URLPattern は常に大文字・小文字を区別しない"
          correct: false
          explanation: "デフォルトでは大文字・小文字を区別します。"
        - text: "URLPattern コンストラクタのオプションで caseSensitive を false に設定する"
          correct: false
          explanation: "`caseSensitive` というオプションは存在しません。"

published: false
---

Web アプリケーションにおいてルーティングは重要な要素です。URL はアプリケーションの状態を表現し、ユーザーが特定のリソースにアクセスするための手段となります。`id` や `slug` のような一意な識別子を URL に含めることによる動的なコンテキストの提供は、一般的な手法として広く採用されています。

動的なルーティングを実現するために標準的な手法は存在していませんが、[Express](https://expressjs.com/) や [Hono](https://hono.dev/), [Next.js](https://nextjs.org/) のような多くの Web フレームワークは [path-to-regexp](https://github.com/pillarjs/path-to-regexp) に基づいた構文を採用しています。フレームワークごとに多少の方言はあるものの、基本的な考え方は共通しています。

- 名前付きグループ（`/users/:id`）: `id` パラメータにマッチした部分を抽出
- ワイルドカード（`posts/*`）: `posts/` 以下の任意のパスにマッチ
- オプショナルセグメント（`/archive/:year/:month?`）: `month` パラメータは省略可能
- 正規表現（`/product/:id(\\d+)`）: `id` パラメータは数字にマッチ

この構文は多くの開発者にとって馴染み深いものであり、フレームワークを変更しても学習コストが低いという利点があります。しかし、これらの構文は標準化されておらず、フレームワーク間で微妙な違いが存在するため、異なる環境での一貫性を欠くことがあります。

上記のような構文を標準化する目的で WHATWG によって提案されたのが [URL Pattern API](https://developer.mozilla.org/ja/docs/Web/API/URL_Pattern_API) です。この標準は URL のパターンマッチングを扱うための API を定義しており、ブラウザやサーバーサイド環境で一貫した方法で URL パターンを処理できるようにします。単に構文を標準化するだけでなく、余分なライブラリを導入せずにネイティブに URL パターンマッチングを行える点が大きな利点です。

b> urlpattern

この記事では、URL Pattern API の基本的な使い方について説明します。

## URLPattern の基本構文

`URLPattern` の構文は基本的に [path-to-regexp](https://github.com/pillarjs/path-to-regexp) から採用されているため、多くの開発者にとって馴染み深いものとなっています。`URLPattern` コンストラクタに `pathname` オプションを渡すことで、URL のパス部分に対するパターンを定義できます。

```javascript
const pattern = new URLPattern({ pathname: "/users/:id" });
```

すべてのパラメーターを明示的に指定すると、以下のようになります。

```javascript
const pattern = new URLPattern({
  protocol: "https",
  username: "",
  password: "",
  hostname: "example.com",
  port: "",
  pathname: "/users/:id",
  search: "*", // 未指定と同義
  hash: "*", // 未指定と同義
});
```

オブジェクトを渡す代わりに、文字列として URL パターンを指定することもできます。なお、文字列で指定する場合には `:` のような曖昧な文字列に注意してください。この文字列はプロトコルの区切り文字 `://` とパターンの一部（例: `/:id`）の両方に使用されますが、`URLPattern` API では常にパターンの一部として解釈されます。プロトコルのサフィックスとして `:` を使用したい場合は `about://blank` のようにエスケープする必要があります。

```javascript
const pattern = new URLPattern("/users/:id", "https://example.com");
```

### パターンマッチングの実行

作成した `URLPattern` オブジェクトを使用して、URL がパターンにマッチするかどうかを確認には以下の 2 つの方法があります。2 つの方法の違いは返される値の型のみであり、どちらも使用されるアルゴリズムは同じです。

- `test()` メソッド: マッチした場合に `true`、マッチしなかった場合に `false` を返します。
- `exec()` メソッド: マッチした場合に詳細な情報を含むオブジェクトを返し、マッチしなかった場合は `null` を返します。

以下は `test()` メソッドの使用例です。`/users/:id` パターンに対して、`/users/123` はマッチし、`/posts/123` はマッチしないことが確認できます。

```javascript
const pattern = new URLPattern({ pathname: "/users/:id" });

console.log(pattern.test({ pathname: "/users/123" })); // true
console.log(pattern.test({ pathname: "/posts/123" })); // false
```

`exec()` メソッドを使用すると、マッチした場合にパラメーターの値を含む詳細な情報を取得できます。以下の例では、`/users/123` にマッチした際に `id` パラメーターの値が `123` であることが確認できます。マッチしなかった場合は `null` が返されます。

```javascript
const pattern = new URLPattern({ pathname: "/users/:id" });

const result = pattern.exec({ pathname: "/users/123" });
console.log(result.pathname.groups); // { id: "123" }
const noMatch = pattern.exec({ pathname: "/posts/123" });
console.log(noMatch); // null
```

## パターンの構文

`URLPattern` のパターン構文は [path-to-regexp](https://github.com/pillarjs/path-to-regexp) に基づいています。いくつかの構文を確認しましょう。

### 固定文字列

固定文字列はそのままの文字列にマッチします。

```javascript
const pattern = new URLPattern({ pathname: "/about" });
console.log(pattern.test({ pathname: "/about" })); // true
console.log(pattern.test({ pathname: "/contact" })); // false
console.log(pattern.test({ pathname: "/about/us" })); // false
```

### 正規表現

正規表現を使用して、より柔軟なパターンマッチングが可能です。以下の例では、`id` パラメーターが数字にマッチするように指定しています。

```javascript
const pattern = new URLPattern({ pathname: "/users/:id(\\d+)" });
console.log(pattern.test({ pathname: "/users/123" })); // true
console.log(pattern.test({ pathname: "/users/abc" })); // false
console.log(pattern.test({ pathname: "/posts/123" })); // false
```

正規表現を使用する場合は必ずしも名前付きグループを使用する必要はありません（無名グループ）。以下の例では、数字にマッチする部分を抽出しています。

```javascript
const pattern = new URLPattern({ pathname: "/items/(\\d+)" });
const result = pattern.exec({ pathname: "/items/456" });
console.log(result.pathname.groups); // { "0": "456" }
```

### グループ修飾子

グループ修飾子を使用して、パターンの繰り返しやオプショナル性を指定できます。以下の 3 つの修飾子が利用可能です。

- `?`: 直前のセグメントが 0 回または 1 回出現することを示す（オプショナルセグメント）
- `*`: 直前のセグメントが 0 回以上出現することを示す（ワイルドカード）
- `+`: 直前のセグメントが 1 回以上出現することを示す

以下の例では `month` パラメーターがオプショナルであることを示しています。`/month` セグメントが存在してもしなくてもマッチします。

```javascript
const pattern = new URLPattern({ pathname: "/archive/:year/:month?" });

console.log(pattern.test({ pathname: "/archive/2023" })); // true
console.log(pattern.test({ pathname: "/archive/2023/11" })); // true
console.log(pattern.test({ pathname: "/archive/2023/11/extra" })); // false
```

`*` 修飾子を使用すると、任意の数のセグメントにマッチできます。以下の例では、`posts/` 以下の任意のパスにマッチします。

```javascript
const pattern = new URLPattern({ pathname: "/posts/:slug*" });

console.log(pattern.test({ pathname: "/posts/123" })); // true
console.log(pattern.test({ pathname: "/posts/2023/11/my-post" })); // true
console.log(pattern.test({ pathname: "/posts/" })); // true
console.log(pattern.test({ pathname: "/users/123" })); // false

const result = pattern.exec({ pathname: "/posts/2023/11/my-post" });
console.log(result.pathname.groups); // { slug: "2023/11/my-post" }
```

`+` 修飾子を使用すると、少なくとも 1 回の出現が必要であることを示せます。以下の例では、`tag` パラメーターが少なくとも 1 つ以上存在する必要があります。

```javascript
const pattern = new URLPattern({ pathname: "/articles/:tag+" });

console.log(pattern.test({ pathname: "/articles/tech" })); // true
console.log(pattern.test({ pathname: "/articles/tech/javascript" })); // true
console.log(pattern.test({ pathname: "/articles/" })); // false
```

### ワイルドカード

ワイルドカードは `*` を使用して、任意の文字列にマッチさせることができます。ワイルドカードは貪欲にマッチし、可能な限り多くの文字列をキャプチャします。

```javascript
const pattern = new URLPattern({ pathname: "/files/*" });
console.log(pattern.test({ pathname: "/files/document.pdf" })); // true
console.log(pattern.test({ pathname: "/files/images/photo.jpg" })); // true
console.log(pattern.test({ pathname: "/files/" })); // true
console.log(pattern.test({ pathname: "/users/123" })); // false
```

ワイルドカードは中間セグメントにも使用できます。

```javascript
const pattern = new URLPattern({ pathname: "/blog/*/comments" });
console.log(pattern.test({ pathname: "/blog/my-first-post/comments" })); // true
console.log(pattern.test({ pathname: "/blog/2023/11/my-post/comments" })); // true
console.log(pattern.test({ pathname: "/blog/comments" })); // false
```

### グループ区切り文字

グループ区切り文字は `{}` で囲まれた部分を示します。グループ区切り文字は結果にキャプチャされませんが、パターンの一部として機能します。例えば `book{s}?` は `book` または `books` にマッチしますが、結果には `s` は含まれません。

```javascript
const pattern = new URLPattern({ pathname: "/book{s}?" });
console.log(pattern.test({ pathname: "/book" })); // true
console.log(pattern.test({ pathname: "/books" })); // true
console.log(pattern.test({ pathname: "/bookss" })); // false

const result = pattern.exec({ pathname: "/books" });
console.log(result.pathname.groups); // {}
```

## 検索・ハッシュ部分のパターンマッチング

`URLPattern` は URL の検索部分（クエリパラメーター）やハッシュ部分にもパターンマッチングを適用できます。検索部分とハッシュ部分のパターンは `search` および `hash` プロパティで指定します。

```javascript
const pattern = new URLPattern({
  pathname: "/search",
  search: "?q=:query&lang=:lang?",
});

console.log(
  pattern.test({ pathname: "/search", search: "?q=javascript&lang=en" }),
); // true
const result = pattern.exec({
  pathname: "/search",
  search: "?q=javascript&lang=en",
});
console.log(result.search.groups); // { query: "javascript", lang: "en" }
```

```javascript
const pattern = new URLPattern({
  pathname: "/page",
  hash: "#section=:section",
});

console.log(pattern.test({ pathname: "/page", hash: "#section=2" })); // true
const result = pattern.exec({ pathname: "/page", hash: "#section=2" });
console.log(result.hash.groups); // { section: "2" }
```

## パターンの正規化

URL がパターンにマッチするかどうかを評価する際、`URLPattern` は自動で URL を正規化します。これには以下のような処理が含まれます。

- `pathname` プロパティにおける Unicode 文字のパーセンテージエンコーディング
- `hostname` プロパティにおける Punycode エンコーディング
- デフォルトポートの削除（例: `http` の場合はポート 80、`https` の場合はポート 443）
- `/foo/./bar` のようなパスは `/foo/bar` に正規化

例えば `/ユーザー/123` というパスは、Unicode 文字がパーセンテージエンコーディングされた `/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC/123` として正規化され、どちらの形式でもパターンにマッチします。

```javascript
const pattern = new URLPattern({ pathname: "/ユーザー/:id" });
console.log(pattern.test({ pathname: "/ユーザー/123" })); // true
console.log(
  pattern.test({ pathname: "/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC/123" }),
); // true
```

## パターンの大文字・小文字の区別

デフォルトでは URLPattern は大文字・小文字を区別します。例えば `/users/:id` パターンは `/Users/123` にはマッチしません。

```javascript
const pattern = new URLPattern({ pathname: "/users/:id" });
console.log(pattern.test({ pathname: "/users/123" })); // true
console.log(pattern.test({ pathname: "/Users/123" })); // false
```

`URLPattern` コンストラクタのオプションで `ignoreCase` を `true` に設定すると、大文字・小文字を区別しないマッチングが可能になります。

```javascript
const pattern = new URLPattern(
  { pathname: "/users/:id" },
  { ignoreCase: true },
);
console.log(pattern.test({ pathname: "/users/123" })); // true
console.log(pattern.test({ pathname: "/Users/123" })); // true
```

## まとめ

- URLPattern API は URL のパターンマッチングを標準化するための Web API
- `URLPattern` コンストラクタを使用して URL パターンを定義し、`test()` および `exec()` メソッドでマッチングを実行できる
- [path-to-regexp](https://github.com/pillarjs/path-to-regexp) に基づいた構文を採用しており、名前付きグループ、正規表現、グループ修飾子、ワイルドカードなどが利用できる
- 検索部分やハッシュ部分にもパターンマッチングを適用できる
- URL の正規化が自動で行われ、大文字・小文字の区別もオプションで設定できる

## 参考

- [URL Pattern Standard](https://urlpattern.spec.whatwg.org/#urlpattern)
- [whatwg/urlpattern: URL Pattern Standard](https://github.com/whatwg/urlpattern)
- [URL パターン API - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/URL_Pattern_API)
- [URLPattern は、ウェブ プラットフォームにルーティングをもたらします  |  Web Platform  |  Chrome for Developers](https://developer.chrome.com/docs/web-platform/urlpattern?hl=ja)
