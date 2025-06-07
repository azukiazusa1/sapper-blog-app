---
id: udQs6zWYdK72-gaHNmoQO
title: "URL が有効かどうかを判定する `URL.canParse()` メソッド"
slug: "url-canparse-method"
about: "`URL.canParse()` メソッドは与えられた URL 文字列が有効であるかどうかを判定します。URL 文字列が有効であれば `true` を、無効であれば `false` を返します。これは URL コンストラクターを用いた `try...catch` 文による判定よりも簡潔に記述できます。"
createdAt: "2023-10-15T14:28+09:00"
updatedAt: "2023-10-15T14:28+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1Zh64r38ManhvKedHbQ2Kc/787597ddad6cc18640cd8c3fd5b0477f/wakame-soup_19332.png"
  title: "wakame-soup 19332"
audio: null
selfAssessment: null
published: true
---
b> url-canparse

JavaScript において URL が有効かどうか判定するために、[URL コンストラクター](https://developer.mozilla.org/ja/docs/Web/API/URL/URL) を使用する方法がよく知られています。

URL コンストラクターは与えられた URL 文字列が有効でなければ例外をスローします。このため、例外がスローされない場合は URL 文字列が有効であることが保証されます。

```js
function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

しかしながらこの方法は少々冗長です。より簡潔な方法として、`URL.canParse()` メソッドが提供されています。

```js
function isValidURL(url) {
  return URL.canParse(url);
}
```

## `URL.canParse()` メソッドの仕様

`URL.canParse()` メソッドは与えられた URL 文字列が有効であるかどうかを判定します。URL 文字列が有効であれば `true` を、無効であれば `false` を返します。

```js
URL.canParse("https://example.com"); // true
URL.canParse("https://example.com/"); // true
URL.canParse("https://example.com/?foo=bar"); // true
URL.canParse("https://example.com/#foo"); // true
URL.canParse("hoge"); // false

URL.canParse(new URL("https://example.com")); // URL オブジェクトも受け付ける

// 相対 URL の場合、第 2 引数に基底 URL を指定する必要がある
URL.canParse("/foo", "https://example.com"); // true
```

URL が有効かどうかの判定方法は、URL コンストラクターと同様です。URL 文字列が有効であれば `true` を、無効であれば `false` を返します。
