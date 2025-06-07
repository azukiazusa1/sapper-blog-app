---
id: 1N8xAP9te1MOoqkldLcYnw
title: "【JavaScript】Objectがプリミティブに変換されるとき"
slug: "javascript-object"
about: "JavaScriptがプリミティブな値に変換されるとき、string型に変換されようとするか、number型に変換されようとするかで挙動が変化する"
createdAt: "2021-06-27T00:00+09:00"
updatedAt: "2021-06-27T00:00+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7aQAosNLTF1lP6MiXWayqO/c6afbeeb9ed62e05e7491c884438807b/javascript.png"
  title: "JavaScript"
audio: null
selfAssessment: null
published: true
---
JavaScript がプリミティブな値に変換されるとき、次のようなルールが適用される。

## string型に変換されるとき

文字列とオブジェクトを `+` 演算子で連結されるときなど、`toString()` メソッドが呼び出される。

```js
const user =  {
  name: 'alice',
  age: 16
}

// もともとのtoString()メソッドは有用な情報を出力しない
console.log('username:' + user) // 'username:[object Object]'

// toStringメソッドをオーバーライドする
user.toString = function() {
  return this.name
}

console.log('username:' + user) // 'username:alice'
```

## number型に変換されるとき

`>`・`<` などの比較演算子にオブジェクトが用いられるときはじめに `valueOf()` メソッドが呼ばれる。`valueOf` メソッドが使えない場合には、代わりに `toString()` メソッドが呼び出される。

```js
const user =  {
  name: 'alice',
  age: 16
}

// valueOf()メソッドはオブジェクトをそのまま返す。プリミティブな値ではないので使えない
// 結果、toString()メソッドが呼ばれ'[object Object]'が数値変換されNaNとなる
console.log(10 < user) // false

// valueOf()メソッドのをオーバーライドする
user.valueOf = function() {
  return this.age
}

console.log(10 < user) // true
```

# 例1）配列 → 数値の変換

配列から数値への変換はときに奇妙である。
空の配列をは 0 に変換されるが、配列が 1 つだけの数字の要素を保つ場合にはその数に変換される。

```js
console.log(Number([])) // 0
console.log(Number([10])) // 10
console.log(Number([10, 20, 30])) // NaN
console.log(Number(['a'])) // NaN
```

これは次のように評価された結果である。

1. `prefer-number algorithm` が使われた結果、配列の `valueOf()` メソッドがまず呼ばれることになる。
2. 配列の `valueOf()` はプリミティブな値を返さない（配列をそのまま返す）ので、次に `toString()` メソッドが呼ばれる
3. 空の配列に `toString()` をした結果は空文字 `""` が返されるので 0 と評価される。配列が 1 つの要素だけを持っている場合には、その要素を返すため結果その値に評価される。（配列が複数の要素を持っている場合には、カンマ `,` 区切りの値が返される `"10,20,30"` この値を数値に変換すると得られるのは `NaN` だ）

# 例2）Dateオブジェクトの変換

## toString()

Date オブジェクトの `toString()` メソッドは日付を表すメソッドを返す。

```js
const date1 = new Date('2021-01-01')

console.log(`${date1}`) // 'Fri Jan 01 2021 09:00:00 GMT+0900 (日本標準時)'
```

## valueOf()

Date オブジェクトの `valueOf()` メソッドは協定世界時 (UTC) 1970 年 1 月 1 日 00:00:00 から指定された日時までの間のミリ秒単位の数値を返すので、そのまま比較することが可能。

```js
const date1 = new Date('2021-01-01')
const date2 = new Date('2021-01-02')

// 1609459200000 < 1609545600000
console.log(date1 < date2) // true
```

## 参考
https://stackoverflow.com/questions/62717437/behavior-of-greater-than-and-another-inequality-comparison-operators-on-arra
