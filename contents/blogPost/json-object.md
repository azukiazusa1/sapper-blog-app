---
id: EHpHcxE8D2ltdD673W10f
title: "JSONオブジェクトのあれこれ"
slug: "json-object"
about: "`JSON`オブジェクトはJavaScriptにおいて、JSONをパースしたり値をJSONに変換するためにもっぱら使われます。  普段使っている`JSON.stringify()`や`JSON.parse()`にはオプショナルな引数を渡すことによってその振る舞いを変更することができます。"
createdAt: "2021-07-04T00:00+09:00"
updatedAt: "2021-07-04T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7aQAosNLTF1lP6MiXWayqO/c6afbeeb9ed62e05e7491c884438807b/javascript.png"
  title: "JavaScript"
audio: null
selfAssessment: null
published: true
---
`JSON` オブジェクトは JavaScript において、JSON をパースしたり値を JSON に変換するためにもっぱら使われます。

普段使っている `JSON.stringify()` や `JSON.parse()` にはオプショナルな引数を渡すことによってその振る舞いを変更できます。

# JSON.stringify()で整形して出力する

`JSON.stringify()` の 2 つ目の引数は、出力するプロパティを `string` か `number` の配列で渡す。
`null` を渡した場合にはすべてのプロパティを出力する。

3 つ目の引数は空白文字の数を示す、`string` か `number` 型。
`number` 型の場合 1 〜 10 の範囲で受け取る。
0 以下の数が渡された場合には空白文字は出力しない。
11 以上の数が渡された場合には単に 10 となる。

`string` 型が渡された場合にはその文字が空白文字として扱われる。

```js
const user = { name: "Alice", age: 18, id: 1 }

console.log(JSON.stringify(user, ['name', 'age'], 2))
```

```js
'{
  "name": "Alice",
  "age": 18
}'
```

# `JSON.parse()` で返却時に値を変換する

`JSON.parse()` に 2 つ目の引数が渡された場合、値は返却される間に変換されることになる。
この引数には関数が渡され、引数には JSON の解析後のオブジェクトの `key` と `value` が渡される。

この関数で値が `return` されなかった場合、そのプロパティはオブジェクトから削除されることになる。そのため、一部の値を変換しない場合には値をそのまま返却する必要がある。

JavaScript の `Set` オブジェクトは JSON に変換する際に通常配列に変換され復元した際にその性質が失われてしますが、以下の例では `JSON.parse()` に 2 つ目の引数を渡すことで値を変換し復元した際に `Set` オブジェクトとなるようにしている。

```js
const set = new Set([1, 2, 3])

const value = JSON.stringify({ set: [...set] })

const parse = JSON.parse(value, ((key, value) => {
  if (key === 'set') {
    return new Set(value)
  }

  return value
}))

console.log(parse)
````

```js
{
  set: Set(3) {
    1,
    2,
    3,
    __proto__: {...}
  }
}
```
