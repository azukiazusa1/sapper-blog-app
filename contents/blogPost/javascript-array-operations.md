---
id: 1vkRlQe3ncwSawxlwLjHZm
title: "すぐに使える！JavaScriptの華麗な配列操作"
slug: "javascript-array-operations"
about: "JavaScriptで配列操作をする際には、まずはJavascriptが持つ配列のメソッドを眺めて見るとよいでしょう。JavaScriptはライブラリに頼らなくとも自前で高度な操作を可能にしてくれます。  組み込みの配列メソッドはたくさんありますが、その中で私がよく使うメソッドを紹介します。"
createdAt: "2020-11-29T00:00+09:00"
updatedAt: "2020-11-29T00:00+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1oOuwue6Ki0IRZkFa6y6Qi/5359bf10fca29a24eaf9260cc78240bc/es2015-001.jpg"
  title: "JavaScript"
published: true
---
# はじめに

コードを書いている中で、配列に対してなにか操作をしたい場面が多いと思います。
そんな時、for 文で配列の文だけループして処理をしたり、`array.forEach()` を用いることがあると思います。

```ts
for (let i = 0; i < array.length; i++) {

// or 
array.forEach(v => {})
```

確かにこのような手段を用いることもできますが。ループの中の処理が複雑になってくると可読性が落ちたり、ループの意図が読み手に伝わらないことがよくあります。

JavaScript で配列操作をする際には、まずは[Javascriptが持つ配列のメソッド](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array)を眺めて見るとよいでしょう。JavaScript はライブラリに頼らなくとも自前で高度な操作を可能にしてくれます。

組み込みの配列メソッドはたくさんありますが、その中で私がよく使うメソッドを紹介します。

- filter
- some
- every
- map
- find
- includes
- flat

# filter

`filter` は、真偽値を返すテスト関数を引数に受け取り、`true` と評価される値を返した要素からなる新しい配列を返します。
以下の例は、20 歳以下のユーザーのみを返します。

```typescript
const users = [
  { id: 1, name: 'John', gender: 'male', age: 28 },
  { id: 2, name: 'Paul', gender: 'male', age: 19 },
  { id: 3, name: 'Yoko', gender: 'female', age: 33 },
  { id: 4, name: 'George', gender: 'male', age: 22 },
  { id: 5, name: 'Ringo', gender: 'male', age: 18 },
]

const youndUsers = users.filter(user => user.age < 20)
console.log(youndUsers)

```

# some

`some` は、真偽値を返すテスト関数を引数に受け取り、どれか 1 つでも `true` を返す値があるかどうかチェックします。`true` を返す値が見つかった時点で配列の走査は打ち切られます。
`some` 関数は返り値として真偽値を返します。

以下の例は少なくとも女性が含まれているグループかどうかチェックしています。

```typescript
const users = [
  { id: 1, name: 'John', gender: 'male', age: 28 },
  { id: 2, name: 'Paul', gender: 'male', age: 19 },
  { id: 3, name: 'Yoko', gender: 'female', age: 33 },
  { id: 4, name: 'George', gender: 'male', age: 22 },
  { id: 5, name: 'Ringo', gender: 'male', age: 18 },
]

if (users.some(user => user.gender === 'female')) {
  console.log('女性が含まれています。')
} else {
  console.log('女性が含まれていません。')
}

// 女性が含まれています。
```

# every

`every` は `some` とよく似ています。`every` はすべての要素がテスト関数に合格するかを調べます。1 つでも `false` を返す要素があった時点で走査は打ち切られます。

```typescript
const users = [
  { id: 1, name: 'John', gender: 'male', age: 28 },
  { id: 2, name: 'Paul', gender: 'male', age: 19 },
  { id: 3, name: 'Yoko', gender: 'female', age: 33 },
  { id: 4, name: 'George', gender: 'male', age: 22 },
  { id: 5, name: 'Ringo', gender: 'male', age: 18 },
]

if (users.every(user => user.gender === 'male')) {
  console.log('すべてのユーザーは男性です。')
} else {
  console.log('女性が含まれています')
}

// 女性が含まれています。
```

# map

`map` はもとの配列の要素を走査して、新たな配列を生成します。
例えば、ユーザーのオブジェクトの配列から名前だけを抜き出した配列を新たに生成します。

```typescript
const users = [
  { id: 1, name: 'John', gender: 'male', age: 28 },
  { id: 2, name: 'Paul', gender: 'male', age: 19 },
  { id: 3, name: 'Yoko', gender: 'female', age: 33 },
  { id: 4, name: 'George', gender: 'male', age: 22 },
  { id: 5, name: 'Ringo', gender: 'male', age: 18 },
]

const userNames = users.map(user => user.name)
console.log(userNames)
// [ "John", "Paul", "Yoko", "George", "Ringo" ]
```

# find

`find` は、テスト関数が `true` を返す**一番最初の要素**を返します。
要素が見つからなかった場合には、`undefined` が返されます。
これは例えば ID をもとに要素を見つけるのに役に立つでしょう。

```typescript
const users = [
  { id: 1, name: 'John', gender: 'male', age: 28 },
  { id: 2, name: 'Paul', gender: 'male', age: 19 },
  { id: 3, name: 'Yoko', gender: 'female', age: 33 },
  { id: 4, name: 'George', gender: 'male', age: 22 },
  { id: 5, name: 'Ringo', gender: 'male', age: 18 },
]

const user = users.find(user => user.id === 2)

// findはundefineを返す可能性があります。
if (user) {
  console.log(user)
} else {
  console.log('ユーザーが見つかりませんでした。')
}

// { id: 2, name: "Paul", gender: "male", age: 19 }
```

# includes

`includes` は、特定の要素が存在するかチェックし真偽値を返します。
このメソッドは珍しくコールバック関数を受け取らず、検索する値を受け取ります。

```typescript
const users = ['Jone', 'Paul', 'Yoko', 'George', 'Ringo']

if (users.includes('Paul')) {
  console.log('Paul is Here!')
}
```

# reduce

`reduce` は配列を集計して 1 つの要素を返します。

`reduce` の構文は次のとおりです。
コールバック関数は前回の値、今回の値、現在の添字、reduce が呼び出された配列を引数として受け取ります。第 2 引数には初期値を渡します。
配列を走査するごとに前回の値に集約されていき、最終的のその値が返り値となります。

例えば、次のようにユーザーの年齢の合計を簡単に集計できます。
```js
arr.reduce(callback( accumulator, currentValue[, index[, array]] ) {
  // return result from executing something for accumulator or currentValue
}[, initialValue]);
```

```typescript
const users = [
  { id: 1, name: 'John', gender: 'male', age: 28 },
  { id: 2, name: 'Paul', gender: 'male', age: 19 },
  { id: 3, name: 'Yoko', gender: 'female', age: 33 },
  { id: 4, name: 'George', gender: 'male', age: 22 },
  { id: 5, name: 'Ringo', gender: 'male', age: 18 },
]

const totalAge = users.reduce((prev, current) => prev + current.age, 0)
console.log(totalAge);
```

# flat

`flat` はネストされた配列構造を、名前のとおり平坦化します。

```typescript
const arr = [1, 2, [3, 4, 5], 6]

const flatten = arr.flat()
console.log(flatten);
// [ 1, 2, 3, 4, 5, 6 ]
```

# おわりに

以上 7 つの JavaScript のメソッドを紹介しました。
これらのメソッドは同じ名前で他言語でも提供されていることもあり、`for` 文は `forEach` で同じ処理を実装するよりも意図がより伝わりやすいと思います。
また紹介例ではすべてワンライナーで実装できているという簡潔さも魅力的です。
