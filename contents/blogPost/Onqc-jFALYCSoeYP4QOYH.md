---
id: Onqc-jFALYCSoeYP4QOYH
title: "await は Promise 以外のオブジェクトでも値を取り出せる"
slug: "await-is-not-only-for-promise"
about: "await キーワードは `then()` という名前のメソッドを持つオブジェクトに対して使用できます。このようなオブジェクトを thenable object と呼びます。await キーワードが Promise オブジェクトではなく thenable オブジェクトを対象としているのは、ライブラリの相互運用のためです。"
createdAt: "2023-08-20T17:41+09:00"
updatedAt: "2023-08-20T17:41+09:00"
tags: ["JavaScript", "Promise"]
thumbnail:
  url: "金魚すくいのイラスト"
  title: "https://images.ctfassets.net/in6v9lxmm5c8/2okG3Yt0KXmAOz1xECemkd/4705c28d4b1a453ad56a5fe628f371c0/kingyo-sukui_18384.png"
published: true
---

`await` キーワードを使用することで、Promise が fulfilled または rejected 状態になるまで実行を中断できます。これにより、Promise を用いた非同期処理をあたかも同期処理のように記述できます。

```js
const getUser = async (id) => {
  const json = await fetch(`/users/${id}`);
  const user = await json.json();
  return user;
};
```

この `await` キーワードを使用して処理を待機してから値を取り出すことができるのは、実は Promise オブジェクトに限りません。正確には、`then()` という名前のメソッドを持つオブジェクト（このことを、thenable object といいます）ならば、`await` キーワードを使用して値を取り出すことができます。Promise オブジェクトもまた `then()` という名前のメソッドを持つので thenable object の中に含まれています。ただし、すべての thenable object が Promise オブジェクトであるわけではありません。

ここで具体的な例を見てみましょう。`Thenable` というクラスを定義して、`then` という名前のメソッドを持たせます。`then` メソッドでは第 1 引数で正常に処理が完了した場合の呼ばれるコールバック関数が（`onFulfilled`）、第 2 引数で処理が失敗した場合の呼ばれるコールバック関数が（`onRejected`）を受け取るように実装します。この仕様は Promise の前進となった [Promises/A+](https://promisesaplus.com/) という仕様に準拠しています。

```js
class Thenable {
  then(onFulfilled, onRejected) {
    onFulfilled(42);
  }
}
```

この `Thenable` クラスのインスタンスを `await` キーワードを使用して値を取り出すことができます。下記の例では、期待通り `Thenable` オブジェクトが持つ `then` メソッドが返す `42` という値がコンソールに出力されます。

```js
const func = async () => {
  const thenable = new Thenable();
  const result = await thenable;
  console.log(result);
};

func(); // => 42
```

## thenable オブジェクトの実践例

`await` キーワードが Promise オブジェクトではなく thenable オブジェクトに対して作用するのはなぜでしょうか？それは世の中のライブラリには、Promise と同等の機能を備えるいわゆる Promise-Like な機能を提供するものが存在するからです。例として、[jQuery](https://jquery.com/) の `$.ajax()` 関数や [mongoose](https://mongoosejs.com/) の `Model#findOne()` などが挙げられます。

このようにライブラリが独自の Promise-Like な機能を実装している理由として、Promise はライブラリの実装として導入されたものが徐々に標準化されていったという経緯があります。このような Promise-Like なオブジェクトは `then()` メソッドを通じて相互運用できるようになりました。

例を見てみましょう。jQuery の `$.ajax()` 関数は戻り値として `JQuery.jqXHR<T>` 型を返します。`JQuery.jqXHR<T>` 型は Promise の仕様に準拠した `then()` メソッドを持ちます。そのため、内部の実装に依らず `await` キーワードを使用して非同期処理を記述できます。

```js
import $ from "jquery";

const getUser = async (id) => {
  const result = await $.ajax(
    `https://jsonplaceholder.typicode.com/users/${id}`,
  );
  console.log(result);
};

getUser(1); // => { id: 1, name: 'Leanne Graham', ... }
```

Promise オブジェクトではなく `then()` という名前のメソッドを備えているか？という判定を行うことで、Promise の標準に準拠していないライブラリも相互運用できるというメリットがあります。

このように、JavaScript においては `then()` という名前のメソッドは特別な意味を持ちます。そのため、`then()` という名前のメソッドを実装するのは避けておくのが無難です。例えば、以下のようにコールバック関数を受け取らない `then()` メソッドを持つオブジェクトに対して `await` キーワードを使用した場合、永遠に後続の処理にたどり着きません。

```js
class Thenable {
  then() {
    return 42;
  }
}

const func = async () => {
  const thenable = new Thenable();
  console.log("before await");
  const result = await thenable;
  console.log("after await");
};

func();
// => before await
```

## まとめ

- `await` キーワードは `then()` という名前のメソッドを持つオブジェクトに対して使用できる
- `then()` という名前のメソッドを持つオブジェクトを thenable object と呼ぶ
- `await` キーワードの対象を Promise オブジェクトではなく thenable object とすることで、Promise の標準に準拠していないライブラリも相互運用できる

## 参考

- [JavaScriptの非同期処理をじっくり理解する (2) Promise](https://zenn.dev/qnighy/articles/0aa6ec47248d80)
