---
id: 1Z6QRbCstQQjmVr08c8N4l
title: "おまえら禁じられたインデックスアクセスを平気で使ってんじゃねえか！わかってんのか？『ランタイムエラー』が生まれたのは人間がコンパイラオプションに甘えたせいだろうがよ！"
slug: "typescript-no-unchecked-indexed-access"
about: "TypeScript 4.1 から noUncheckedIndexedAccess オプションが追加されました。このオプションは上記のような配列のアクセスやオブジェクトのプロパティのアクセスをより厳密にします。  具体的には、配列に対するインデックスアクセスやインデックスシグネチャを通じたプロパティのアクセスは常に `undefined` とのユニオン型となります。"
createdAt: "2022-06-26T00:00+09:00"
updatedAt: "2022-06-26T00:00+09:00"
tags: ["TypeScript"]
published: true
---
まずは次のコードを見てください。一見コンパイルエラーも発生していないので安全なコードに見えます。

```ts
/**
 * 配列の先頭の要素を取り出す
 */
function head<T>(arr: T[]): T {
  return arr[0]
}

/**
 * 大文字に変換する
 */
function upperCase(str: string): string {
  return str.toUpperCase()
}

const fruits: string = ['apple', 'banana', 'lemomn']

const fruit = head(fruits)
// fruit: string

console.log(upperCase(fruit)) // APPLE
```

https://www.typescriptlang.org/play?#code/PQKhCgAIUxZRMdCVB2DICUVC0GYwgZGAJfQSQyDXlQKIZAvxUE0GKEYcAMwFcA7AYwBcBLAezsgAsBTAQwAmAHgAqAPgAUfAE7SAXJBEBtALoBKBSMgBvKJGk8mNaZxnSlABhXgAvuHCgI0SIHJNQOGmgdW1A1gyBITUDbxiSA0QzklLSMrByQNAAO0TzSAMJ8AM48EslM8pAZ0ix0AOYa2Zl5+Tp6BkYmxdIAdExsAKqx8UmpEmq29gwcGZBU0jQsTMmQALyQSgDkfLEANjxTADSQUwBGfHSbfMurCwC2bPt0U9bgPXR9A0NM49z8AhLXw8mdwMD9g8MKOaXdvWwFrU5mx8hIYnFEik0s8mGo1JB3pAAIIABVRABkAKJAA

しかし、このコードには 1 つ罠が存在します。`head` 関数に空の配列を渡してみてください。

```ts
/**
 * 配列の先頭の要素を取り出す
 */
function head<T>(arr: T[]): T {
  return arr[0]
}

/**
 * 大文字に変換する
 */
function upperCase(str: string): string {
  return str.toUpperCase()
}

const fruits: string[] = []

const fruit = head(fruits)
// fruit: string

console.log(upperCase(fruit)) // [ERR]: Cannot read properties of undefined (reading 'toUpperCase') 
```

https://www.typescriptlang.org/play?#code/PQKhCgAIUxZRMdCVB2DICUVC0GYwgZGAJfQSQyDXlQKIZAvxUE0GKEYcAMwFcA7AYwBcBLAezsgAsBTAQwAmAHgAqAPgAUfAE7SAXJBEBtALoBKBSMgBvKJGk8mNaZxnSlABhXgAvuHCgI0SIHJNQOGmgdW1A1gyBITUDbxiSA0QzklLSMrByQNAAO0TzSAMJ8AM48EslM8pAZ0ix0AOYa2Zl5+Tp6BkYmxdIAdExsAKqx8UmpEmq29gwcGZBU0jQsTMkKOaWqkAC8kKrdvUz9g8PT3PwCEgNDI53AwEvbYyUF83TJbAA2PLUXbPkSMXGJKWlbw2pqkHuzAKIASn8VAoknQ6GxFgZBJBotI2E9WDxkpA2FQonQBDwqHkeAJIBJIQJSpAAOQNZpPNo8YmfIA

相変わらずコンパイルエラーは発生していませんね。TypeScript でコンパイルエラーの発生していないコードは基本的に安全と考えられるはずです。しかしながら、このコードを実行すると以下のランタイムエラーは発生してしまいます。

```
[ERR]: Cannot read properties of undefined (reading 'toUpperCase') 
```

`strict` オプションを有効にしているうえに、`any` や `as` のような危険な機能を使用していないのにも関わらず、なぜコンパイル時にエラーを検出できなかったのでしょうか？

## TypeScript はインデックスアクセスに危険性がある

理由は TypeScript のインデックスアクセスには危険性があるためです。前述のコード中の `head` 関数は `arr[0]` のように配列の要素にインデックスでアクセスしています。

JavaScript において配列の要素を参照する際には `配列[インデックス]` でアクセスできます。指定したインデックスが存在する場合問題なくその要素を取得できますが、存在しないインデックスに対してアクセスした場合 `undefined` が返されます。

```js
const arr = ['a', 'b', 'c']

const a = arr[0] // a
const b = arr[1] // b
const lol = arr[99] // undefined
```

しかしながら、TypeScript は型システム上この動作を完全に再現していません。範囲外のインデックスに対してアクセスした場合でも、`string` 型と推論されます。

```ts
const arr = ['a', 'b', 'c']

const a = arr[0] 
// const a: string
const b = arr[1]
// const b: string
const lol = arr[99]
// const lol: string
```

この動作は[インデックスシグネチャ](https://typescript-jp.gitbook.io/deep-dive/type-system/index-signatures) を使用した場合も同様です。存在しないプロパティでアクセスしてしまった場合でも `undefined` である可能性がないものとして扱われてしまいます。

```ts
type Messages = {
  [key: string]: string
}

const messages: Messages = {
  hello: 'world!',
  ping: 'pong',
}

const hello = messages.hello
// const hello: string

const lol = messages.lol
// const log: stirng
```

`messages` オブジェクに `lol` プロパティは存在しないので `undefined` が返されるはずですが、型システム上は `string` 型に推論されています。

## noUncheckedIndexedAccess オプションで安全性を手に入れる

このような TypeScript の危険性を改善してほしいという要望は多く寄せられていました。そこで TypeScript 4.1 から [noUncheckedIndexedAccess](https://devblogs.microsoft.com/typescript/announcing-typescript-4-1/#checked-indexed-accesses-nouncheckedindexedaccess) オプションが追加されました。このオプションは上記のような配列のアクセスやオブジェクトのプロパティのアクセスをより厳密にします。

具体的には、配列に対するインデックスアクセスやインデックスシグネチャを通じたプロパティのアクセスは常に `undefined` とのユニオン型となります。

冒頭であげた例を `noUncheckedIndexedAccess` を有効にして再度試してみましょう。TS Playground では上部のタブの `TS Config` からコンパイラオプションを設定できます。

![スクリーンショット 2022-06-26 20.39.10](//images.ctfassets.net/in6v9lxmm5c8/CNvV4wGUjENrEdLFaH6rV/4f1e932d23aec5b5e8b09e2a73e1ee67/____________________________2022-06-26_20.39.10.png)

```ts
/**
 * 配列の先頭の要素を取り出す
 */
function head<T>(arr: T[]): T {
  // Type 'T | undefined' is not assignable to type 'T'.
  // 'T' could be instantiated with an arbitrary type which could be unrelated to 'T | undefined'.
  return arr[0] 
}

/**
 * 大文字に変換する
 */
function upperCase(str: string): string {
  return str.toUpperCase()
}

const fruits: string[] = []

const fruit = head(fruits)

console.log(upperCase(fruit))
```

https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true#code/PQKhCgAIUxZRMdCVB2DICUVC0GYwgZGAJfQSQyDXlQKIZAvxUE0GKEYcAMwFcA7AYwBcBLAezsgAsBTAQwAmAHgAqAPgAUfAE7SAXJBEBtALoBKBSMgBvKJGDBFATwAOPSAHItAH0j0BPKizo8BFyCwDOkOmyaQ+T08WAHM6PgAjABtzJjZIJlNzKwsAOj0DSxF3BjYaKIFICPNnTyY+OlY+JldIAHcWJi4AzhkIxukZIwSk+q4WBmbc-MLiuzppHijq2risyFt7R2dXNL1JphppVtklAAYVSHAAX3BwUAhoSEByTUBw00B1bUBrBkBITUBt4xJAaIZySlpGVg47CYzNIAMKBHgSMrySBQ5whDQwpjSOE6dY8TbbRHSVJxACqQJ4oPBEjUJzOuToZUgVGkNEangUsLoIVUkAAvJBVOSOFSaXT-BzeIIJHz6aTwBTPGwYqkomwQhIaASiZ4IaKmGo1EA

`head` 関数内でコンパイルエラーが発生していることがわかります。`arr[0]` は `undefined` を返す可能性があるので返り値の型である `T` に割り当てできないと述べています。

コンパイルエラーを回避するためには `head` 関数の返り値の型を `T | undefined` に変更して、`upperCase` 関数に渡す前 `undefined` でないことをチェックする必要があります。

```ts
/**
 * 配列の先頭の要素を取り出す
 */
function head<T>(arr: T[]): T | undefined {
  return arr[0] 
}

/**
 * 大文字に変換する
 */
function upperCase(str: string): string {
  return str.toUpperCase()
}

const fruits: string[] = []

const fruit = head(fruits)
// const fruit: string | undefined

if (fruit) {
  console.log(upperCase(fruit))
}
```

https://www.typescriptlang.org/play?noUncheckedIndexedAccess=true#code/PQKhCgAIUxZRMdCVB2DICUVC0GYwgZGAJfQSQyDXlQKIZAvxUE0GKEYcAMwFcA7AYwBcBLAezsgAsBTAQwAmAHgAqAPgAUfAE7SAXJBEBtALoBKBSMgAfSPQE8qLOjwGQA3lEjSeTGtM4zpSgAwrI4AL7hwoCNEhAck1AcNNAdW1AawZASE1AbeMSQGiGckpaRlYOPQAHdJ5pAGE+AGceCXymeUgS6WMAcw1y0uqLKxs7BzrpADomNgBVTOy8wok1Lx8GDhLIKmkaFiZ8hQrq1UgAXkhVUfGmSenZ1e5+AQkpmbnh4GBIMboJk9mF+roqnT06AyMTAR8WKkhj3aYakakCu4zYABseO1wWwqhIaH1cgUindAcNvEA

インデックスシグネチャを通じたプロパティアクセスも同様です。下記の例ではプロパティアクセス時に `string | undefind` 型になります。

```ts
type Messages = {
  [key: string]: string
}

const messages: Messages = {
  hello: 'world!',
  ping: 'pong',
}

const hello = messages.hello
// const hello: string | undefined

const lol = messages.lol
// const log: stirng | undefined
```

## おわりに

`noUncheckedIndexedAccess` オプションは非常に厳しいコンパイラオプションであるため、デフォルトでは有効となっていません。とはいえ、TypeScript の新規開発を行う機会がある場合にはこのオプションを有効にすることをおすすめします。

毎回 `undefined` でないことを確認する手間は増えますが、安全性を得られることを考えると安い代償でしょう。あるいは、`for...of` を使うなどなるべくインデックスアクセスに頼らないコードを意識してみるとよいでしょう。

`noUncheckedIndexedAccess` オプションを途中から有効にするのはなかなか手間がかかります。実際に手元のプロパティでためしに `noUncheckedIndexedAccess` オプションを有効にしてみるとよいでしょう。きっと大量のコンパイルエラーが報告されるはずです😉。

