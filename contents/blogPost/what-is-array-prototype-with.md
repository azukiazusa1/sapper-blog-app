---
id: PgSsnmpQ-gUQh6ev5kSgs
title: "Array.prototype.with() とは"
slug: "what-is-array-prototype-with"
about: "`Array.prototype.with()` は、非破壊的に配列の要素を置き換えるためのメソッドです。非破壊的とは、元の配列を変更せずに新しい配列を返すということです。`arr` に対して `with()` を実行しても、`arr` は変更されず、新しい配列のコピーが返されます。"
createdAt: "2023-04-23T12:00+09:00"
updatedAt: "2023-04-23T12:00+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6TG3Mp9lUott5GTkVLpVdH/15d41aaca34fe13d1696774a4532d2ab/___Pngtree___vector_fox_585540.png"
  title: "fox"
audio: null
selfAssessment: null
published: true
---
`Array.prototype.with()` は、非破壊的に配列の要素を置き換えるためのメソッドです。非破壊的とは、元の配列を変更せずに新しい配列を返すということです。下記の例のように、`arr` に対して `with()` を実行しても、`arr` は変更されず、新しい配列のコピーが返されます。

```js
const arr = [1, 2, 3]
// index が 1 の要素を 4 に置き換える
const newArr = arr.with(1, 4)

console.log(arr) // [1, 2, 3]
console.log(newArr) // [1, 4, 3]
```

`Array.prototype.with()` は Change Array by copy と呼ばれるプロポーザルで提案されたメソッドの 1 つです。Change Array by copy は配列のメソッドに非破壊のメソッドを追加するものです。他にも `Array.prototype.srot()` の非破壊版である `Array.prototype.toSorted()` などが提案されています。

https://github.com/tc39/proposal-change-array-by-copy

このプロポーザルは [ECMAScript 2023](https://tc39.es/ecma262/2023/) に取り込まれています。既に Node.js 20.0.0 で実装されていて使用できます。最新の実装状況は [Can I use](https://caniuse.com/mdn-javascript_builtins_array_with) で確認できます。


## 使い方

`Array.prototype.with()` は、第 1 引数に置き換える要素のインデックス、第 2 引数に置き換える値を受け取ります。

```js
arr.with(index, value)
```

概要でも説明したとおり、`with()` は非破壊的なメソッドであり、元の配列を変更せずに新しい配列を返します。次のようにメソッドチェインのような使い方もできます。

```js
const arr1 = ['a', 'b', 'c']
const arr2 = arr.with(0, 'A').with(1, 'B').with(2, 'C')

console.log(arr1) // ['a', 'b', 'c']
console.log(arr2) // ['A', 'B', 'C']
```

## 相対的なインデックス

`Array.prototype.with()` は、[Array.prototype.at()](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/at) のように第 1 引数に相対的なインデックスを指定することもできます。相対的なインデックスとは、配列の末尾からのインデックスのことです。例えば、`-1` は配列の末尾の要素を指します。

```js
const arr = ['apple', 'banana', 'orange']
const newArr = arr.with(-1, 'grape')

console.log(arr) // ['apple', 'banana', 'orange']
console.log(newArr) // ['apple', 'banana', 'grape']
```

## 例外

第 1 引数の配列のインデックスが範囲外の場合、`RangeError` が発生します。

```js
const arr = [1, 2, 3]

arr.with(3, 3)
// Uncaught RangeError: Invalid index : 3
```

## TypedArray

`Array.prototype.with()` `TypedArray` のサブクラスでも使用できます。

```js
const arr = new Uint8Array([1, 2, 3])
const newArr = arr.with(1, 4)

console.log(arr) // Uint8Array(3) [1, 2, 3]
console.log(newArr) // Uint8Array(3) [1, 4, 3]
```

## 参考

- [Array.prototype.with() - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)
- [ECMAScript Language Specification# sec-array.prototype.with](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.with)
