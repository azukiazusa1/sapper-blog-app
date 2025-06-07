---
id: BwRZiUHJT-ph9cHHK4mGu
title: "Error インスタンスかどうか判定する Error.isError() メソッド"
slug: "error-is-error"
about: "Error.isError() メソッドは、オブジェクトが Error インスタンスかどうかを判定するためのメソッドです。今までも instanceof 演算子を使用して判定することができましたが、偽陽性と偽陰性が発生する可能性があります。Error.isError() メソッドは Array.isArray() と同じく内部スロットを使用して判定するため、より堅牢に判定することができます。"
createdAt: "2025-05-11T10:37+09:00"
updatedAt: "2025-05-11T10:37+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5pzlja5MDQb7ktby4HjGAX/8fcc2e7705289f3d1f1bb862d6076da9/drink_melon-cream-soda_16900.png"
  title: "クリームメロンソーダのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/7ENBhKWBiHKDs0jd1PBbeU/1dc2da62eff4b166d1c509d0f2d12751/Error_isError___%E3%81%AE%E6%B4%BB%E7%94%A8.wav"
selfAssessment:
  quizzes:
    - question: "`instanceof` 演算子を使用して `Error` インスタンスを判定する際の問題点は何ですか？"
      answers:
        - text: "偽陽性と偽陰性が発生する可能性がある"
          correct: true
          explanation: "Error インスタンスでない場合でも、__proto__ プロパティを上書きしてしまうと `instanceof` 演算子は `true` を返してしまいます。"
        - text: "パフォーマンスが悪い"
          correct: false
          explanation: null
        - text: "TypeScript では型ガードとして機能しない"
          correct: false
          explanation: null
        - text: "ブラウザの互換性の問題がある"
          correct: false
          explanation: null
published: true
---
`Error.isError()` メソッドは、オブジェクトが `Error` インスタンスかどうかを判定するためのメソッドです。渡された値が `Error` インスタンスであれば `true` を、そうでなければ `false` を返します。

```ts
const error = new Error("An error occurred");
console.log(Error.isError(error)); // true
console.log(Error.isError({})); // false
console.log(Error.isError(3)); // false
console.log(Error.isError(null)); // false
```

b> is-error

## Error.isError() メソッドの使い方

`Error.isError()` メソッドの使い道として真っ先に思いつくのは、`try-catch` 構文でキャッチしたエラーが `Error` インスタンスかどうかを判定することです。TypeScript では `catch` 節でキャッチしたエラーの型は `unknown` 型になります。これは JavaScript はどのような型の値でも例外としてスローできるためです。

適切なエラー処理を行うためには、キャッチしたエラーが `Error` インスタンスであるかどうかを判定する必要があります。`Error.isError()` メソッドを使用することで、簡単に判定できます。

```ts
try {
  // 何らかの処理
} catch (error) {
  if (Error.isError(error)) {
    console.error(error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

とはいえ、この用途であれば `Error.isError()` メソッドを使用しなくても、`instanceof` 演算子を使用して判定することもできます。

```ts
try {
  // 何らかの処理
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unknown error:", error);
  }
}
```

しかし、`instanceof` 演算子を使用した判定では偽陽性と偽陰性が発生する可能性があります。たとえば、以下のように `__proto__` プロパティを無理やり上書きしてしまえば、本物の `Error` インスタンスでない場合でも `instanceof` 演算子は `true` を返してしまいます。

```ts
const error = new Error("An error occurred");
const fakeError = {
  message: "Fake error",
  __proto__: Error.prototype,
};

console.log(error instanceof Error); // true
console.log(fakeError instanceof Error); // true
```

`Error.isError()` メソッドを使用するとプロトタイプチェーン内で `Error` であったとしても `Error` インスタンスでない場合は `false` を返します。これにより、偽陽性を防ぐことができます。

```ts
const error = new Error("An error occurred");
const fakeError = {
  message: "Fake error",
  __proto__: Error.prototype,
};
console.log(Error.isError(error)); // true
console.log(Error.isError(fakeError)); // false
```

この挙動は `Array.isArray()` と同じ仕組みによって実現されています。`Array.isArray()` や `Error.isError()` メソッドは偽装不可能な内部スロット（[`[[Internal Slot]]`](https://262.ecma-international.org/6.0/index.html#sec-object-internal-methods-and-internal-slots)）を直接チェックして真偽値を返します。このような内部スロットの有無の確認は「ブランドチェック」と呼ばれています。

### cross-realm 環境での使用

`Error.isError()` メソッドは `cross-realm` 環境で偽陽性を防ぐために使用できます。たとえば、`iframe` や `Web Worker` などの異なる実行環境で `Error` インスタンスを作成した場合、`instanceof` 演算子は常に `false` を返します。

`Error.isError()` メソッドを使用することで、異なる実行環境で作成された `Error` インスタンスでも正しく判定できます。

```ts
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);
const iframeError = iframe.contentWindow?.Error;
const error = new iframeError("An error occurred");

console.log(error instanceof Error); // false
console.log(error instanceof iframeError); // true
console.log(Error.isError(error)); // true
```

## まとめ

- `Error.isError()` メソッドは、オブジェクトが `Error` インスタンスかどうかを判定するためのメソッド
- `instanceof` 演算子を使用した Error インスタンスの判定では偽陽性と偽陰性が発生する可能性がある
- `Error.isError()` メソッドは `Array.isArray()` と同じく内部スロットを使用して判定するため、偽陽性や偽陰性を防ぐことができる
- cross-realm 環境で作成された `Error` インスタンスでも正しく判定できる

## 参考

- [tc39/proposal-is-error: ECMAScript Proposal, specs, and reference implementation for Error.isError](https://github.com/tc39/proposal-is-error)
- [Error.isError() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/isError)
- [本当にそれはエラーなのか？](https://docs.google.com/presentation/d/1WxxeCzsjgZS_vjInk_NO-NLYCJEj-DblswDEHeBXhjE/edit?slide=id.p#slide=id.p)
