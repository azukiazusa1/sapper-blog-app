---
id: 5LuDAaXF8dvP7ge4Ew0biR
title: "君は return と await return の違いを理解して使っているか"
slug: "return-await-return"
about: "`Promise` を返す非同期関数を扱う時 `Promise` をそのまま返す書き方と `Promise` を `await` してから返す二通りの方法があります。これらは一見同じように動作するように見えますが異なる点が存在します。"
createdAt: "2022-04-03T00:00+09:00"
updatedAt: "2022-04-03T00:00+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7aQAosNLTF1lP6MiXWayqO/c6afbeeb9ed62e05e7491c884438807b/javascript.png"
  title: "JavaScript"
published: true
---
`Promise` を返す非同期関数を扱うとき `Promise` をそのまま返す書き方と `Promise` を `await` してから返す二通りの方法があります。

```js
const fetchUsers1 = async () => {
  return axios.get('/users')
}

// または

const fetchUsers2 = async () => {
  return await axios.get('/users')
}
```

上記のコード例は一見するとどちらも同じように動作するように思えますが、以下のような違いがあります。

- 例外がキャッチされる場所
- スタックトレースの出力
- マイクロタスクのタイミング

## 例外がキャッチされる場所

初めに考えられるもっとも顕著な例として `try/catch` ブロックと共に使用されている場合です。端的に説明すると `return` の場合には関数の呼び出し元で例外がキャッチされますが `await return` の場合には関数の内部で例外がキャッチされます。

以下の例で確認してみましょう。`alwaysRejectPromise` 関数は常に `Promise` を拒否します。

```js
const func1 = async () => {
  try {
    return alwaysRejectPromise()
  } catch (e) {
    console.log('func1 の中で catch');
  }
}

const func2 = async () => {
  try {
    return await alwaysRejectPromise()
  } catch (e) {
    console.log('func2 の中で catch');
  }
}

func1().catch(e => console.log('func1 の呼び出し元で catch'));
func2().catch(e => console.log('func2 の呼び出し元で catch'));
```

実行結果は以下のとおりです。

```sh
func2 の中で catch
func1 の呼び出し元で catch
```

期待通り、`Promise` を単に `return` している `func1` の場合には関数の呼び出し元の `catch` 句で例外が捕捉され、`await return` している `func2` の場合には `func2` の内部の `catch` 句で例外が捕捉されています。

どうしてこのような違いが生じるのでしょうか？[await](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/await) 演算子は `Promise` が決定される（履行または拒否されるまで）まで待機することがポイントです。

つまりは `await return` の場合には `Promise` が完了するまで関数内で待機するため `Promise` が拒否されたときにはまだ処理が関数内に残っています。そのため関数内の `catch` 句で例外が捕捉されます。

一方で `return` の場合には関数内で `Promise` が完了するまで待機されません。そのため `Promise` が拒否されたときにはすでに関数内での処理は終了してしまっています。ですから関数内の `catch` 句ではなく呼び出し元の `catch` 句で例外が捕捉されるのです。

## スタックトレースの出力

2 つ目の違いとしてはスタックトレースの出力の違いがあげられます。これはさきほどの例外がキャッチされる場所と同じ原理です。実施のコード例で確認してみましょう。始めに `return` の例です。

```js
async function foo() {
  return bar();
}

async function bar() {
  await Promise.resolve();
  throw new Error("something went wrong");
}

foo().catch((error) => console.log(error.stack));
```

スタックトレースは次のように出力されます。

```sh
Error: something went wrong
    at bar (index.js:7:9)
```

これを関数 `foo()` 内で `return await` を使用するように修正します。

```diff
  async function foo() {
-   return bar();
+   return await bar();
  }

  async function bar() {
    await Promise.resolve();
    throw new Error("something went wrong");
  }

  foo().catch((error) => console.log(error.stack));
```

スタックトレースの詳細は以前のバージョンに比べてより詳細なものになります。

```js
Error: something went wrong
    at bar (index.js:7:9)
    at async foo (index.js:2:10)
```

## マイクロタスクのタイミング

単純に述べると `return await` は冗長です。次のコードは関数内部で `Promise` が完了するのを待機した後、関数の呼び出し元でもう一度 `Promise` が完了するのを待つ必要があります。

```js
const foo = async () => {
  return await Promise.resolve(42);
};

const main = async () => {
  await foo();
  console.log('function foo finished');
};

main();
```

このことがどのように問題となるか理解するには JavaScript におけるマイクロタスクの概念を理解する必要があります。

### マイクロタスクとは？

マイクロタスクは簡潔に述べると非同期処理の待ち行列（キュー）の一種です。例えば `Promise` や `Mutation Observer API` において使用されています。マイクロタスクは先入れ先出しのキューとなっており、`Promise` が呼ばれたタイミングではマイクロタスクキューにタスクを登録します。その後マイクロタスクが実行できるタイミングになったらマイクロタスクキューから順番にタスクを呼び出して実行します。

マイクロタスクが実行できるタイミングは 1 回のイベントループが終了するタイミングです。イベントループが収集したすべてのタスクが完了した後に保留されていたマイクロタスクの実行を始めます。端的に換言すると、すべての同期処理が完了した後になってはじめて非同期処理（マイクロタスク）が実行されるということです。以下の例で確認してみましょう。

```js
console.log(1); // ①
console.log(2); // ②

Promise.resolve().then(() => console.log(3)); // ③

for (let i = 0; i < 1000000000; i++) {} // ④

console.log(4); // ⑤
```

始めはコードの順番にならって①、②の処理が実行されます。その後③の処理ではマイクロタスクキューにタスクが登録されこの時点ではまだ実行されません。その後興味深いのは④の処理でありここでは大量の `for` ループで処理をブロッキングしています（ここでは大雑把に 3000ms かかると仮定しましょう）。③の処理の実行は実際には 1ms で完了するのですが、マイクロタスクキューに登録されたタスクは現在のイベントループのすべてのタスクの完了を待たなければいけません。3000ms が経過した後にようやく⑤の処理が実行されその後にマイクロタスクの実行が開始されるので最後に `3` が出力されます。

![microtask1](//images.ctfassets.net/in6v9lxmm5c8/78yNfOUqFFjCcP1M3KZjal/4fdd007fecb159f527fccf9df07a2920/microtask1.gif)

### マイクロタスクの可視化

マイクロタスクは前述のとおり各イベントループの終了時に実行されます。次に行う実験の前にマイクロタスクの周期を表示する関数を作成します。

```js
const tick = () => {
  let i = 1;
  const exec = async () => {
    await Promise.resolve();
    console.log(i++);
    if (i < 5) {
      exec();
    }
  };
  exec();
};
```

`tick()` 関数を実行すると下記のように 1 マイクロタスク毎にログを出力します。

```sh
1
2
3
4
5
```

ここで `return await` の話に戻りましょう。冒頭のコードと同時に `tick()` 関数を呼び出してどのマイクロタスクのタイミングで `foo` 関数の処理が完了したのかを確認してみましょう。

```js
const foo = async () => {
  return Promise.resolve(42);
};

const tick = () => {
  // ...
};

const main = async () => {
  await foo();
  console.log('function foo finished');
};

main();
tick();
```

結果は次のとおりです。

```js
1
2
function foo finished
3
4
```

`function foo finished` が `2` の後に表示されていることから 2 回目のマイクロタスクのタイミングで関数 `foo()` が実行されていることがわかります。

次に `foo()` 関数を `return await` しないように修正します。

```js
const foo = () => {
  return Promise.resolve(42);
};

const tick = () => {
  // ...
};

const main = async () => {
  await foo();
  console.log("function foo finished");
};

tick();
main();
```

結果は次のとおりです。

```js
1
function foo finished
2
3
4
```

今度は `function foo finished` が `1` の後に実行されています。つまり、`return await` と比べて `return` する場合には 1 つは早いマイクロタスクで `foo()` の処理が完了するということになります。

これが、`return await` が冗長ということの意味です。`return await` をすることによって余分なマイクロタスクが発生してしまうのです。

1 点興味深い仕様として `async` 関数で `return await` しなかった場合には `return await` した場合よりも 1 つ後のマイクロタスクで実行されます。

```js
const foo = async () => {
  return Promise.resolve(42);
};

const tick = () => {
  // ...
};

const main = async () => {
  await foo();
  console.log("function foo finished");
};

tick();
main();
```

```sh
1
2
3
function foo finished
4
```

これは `async` 関数が値を返す際には暗黙的の本来の戻り値を用いて `Promise.resolve` されることに関係します。

つまり以下に上げる 2 つのコードは同じ意味になります。

```js
async function foo() {
   return 1
}
```

```js
function foo() {
   return Promise.resolve(1)
}
```

さらに `async` 関数において `Promise` を `return` した場合には「`return` に使われた `Promise` に対する `then` の実行」を待つのに 1 マイクロタスク「`then` で登録されたコールバックの実行」に 1 マイクロタスクを余分に消費します。

`return await` の場合には完了済の `Promise` を返すので `await` する際に 1 マイクロタスクを消費しますが、その後 async` 関数において `Promise` を `return` した場合のマイクロタスクの消費を実行しないので 1 マイクロタスク早くなるわけです。

結果としては次のようになります。

|      | マイクロタスク     |
| ---------- | ---------- |
| return       | 1       |
| return（async 関数）       | 3       |
| return await（async 関数）     | 2       |

ただし、1 つ遅いマイクロタスクで実行されるということは非同期処理感の優先順位にまつわる話であり、必ずしもパフォーマンス上の問題に直結するわけではないことに注意してください。

## まとめ

`return` と `return await` の違いについて述べてきました。基本的には関数内部で `try/caatch` をする必要がない場合にわざわざ `await` を書くのは無駄な処理となります。

幸いなことに無駄な `return await` を禁止する ESlint ルールが存在するので興味を持ったかたはこのルールを適用させてみるとよいでしょう。

https://eslint.org/docs/rules/no-return-await

ただし、`try/catch` を関数内部で使用しない場合でも `return await` をしない場合にはスタックトレース上不利になることは留意してください。

## 参考

- [Difference between `return await promise` and `return promise`](https://stackoverflow.com/questions/38708550/difference-between-return-await-promise-and-return-promise)
- [Why no-return-await vs const x = await?](https://stackoverflow.com/questions/44806135/why-no-return-await-vs-const-x-await)
- [await vs return vs return await](https://jakearchibald.com/2017/await-vs-return-vs-return-await/)
- ['return await promise' vs 'return promise' in JavaScript](https://dmitripavlutin.com/return-await-promise-javascript/)
- [徹底解説！　return promiseとreturn await promiseの違い](https://zenn.dev/uhyo/articles/return-await-promise)
- [JavaScriptの非同期処理をじっくり理解する (3) async/await](https://zenn.dev/qnighy/articles/3a999fdecc3e81)
