---
id: 1tsgSfKnoe2z3OM5zomet2
title: "青春JSDocはTypeScript先輩の夢を見ない"
slug: "jsdoc-typescript"
about: "時には、TypeScriptという概念が存在しない退屈な世界で開発を行わなけらばならない状況はあるでしょう。私はもはやキーボードでタイピングすることすらままなりません。  そんなJavaScriptしか利用できない状況で代替手段となるのが、JSDocです。JSDocのアノテーションによって型を付与することによって最低限の支援を受けることができます。"
createdAt: "2021-08-15T00:00+09:00"
updatedAt: "2021-08-15T00:00+09:00"
tags: ["JavaScript", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6zTzB66mCu7Oi65BeJO0Nh/c9a64c4494dde084026cbfa28fa0d044/__________________________3_.png"
  title: "typescript"
selfAssessment: null
published: true
---
普段から TypeScript で開発されているほうならば、TypeScript の恩恵を十分に堪能されていることと思います。

特に私は VS Code のインテリセンスには頼りっぱなしでこれがなければまともにコーディングができない体になってしまいました。

しかし時には、TypeScript という概念が存在しない退屈な世界で開発を行わなけらばならない状況はあるでしょう。私はもはやキーボードでタイピングすることすらままなりません。

そんな JavaScript しか利用できない状況で代替手段となるのが、JSDoc です。JSDoc のアノテーションによって型を付与することによって最低限の支援を受けることができます。

# @Type

`@Type` タグを使用すると、TypeScript で型をつけるときと同じように型を宣言できます。

```js
/** @type {number}  年齢*/
let age;
```

マウスオーバーをすると JSDoc に記載した情報を表示してくれますし、もちろんインテリセンスもしっかりと効いてくれます。

## 基本的な型

TypeScript に用意されている基本的な型はほとんどサポートされています。

```js
/** @type {string} */
let string

/** @type {number} */
let number

/** @type {boolean} */
let boolean

/** @type {string[]} */
let array

/** @type {[number, number]} */
let tuple

/** @type {null} */
let __null__

/** @type {undefined} */
let __undefined__

/** @type {any} */
let any

/** @type {(num1: number, num2: number) => number)} */
const fn = (num1, num2) => {
  return num1 + num2
}

/** @type {{ name: string, age: number}} */
let obj
```

## Union型

Union 型も定義できます。その場合、型ガードによって絞り込みをすることもできます。

```js

/** @type {string|number} */
let strOrNum

if (typeof strOrNum === 'string') {
  strOrNum // string
} else if (typeof strOrNum === 'number') {
  strOrNum // number
} 
```

```js
/** @type {'red'|'green'} */
let color
```

## インデックスシグネチャ

インデックスシグネチャ（`{ [x: string]: number }`）ど等しいの型も定義できます。

```js
/**
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

stringToNumber['a'] = 'h'
```

## キャスト

丸括弧で囲まれた式の前に@type タグを追加することで、型を他の型にキャストできます。

```js
/**
 * @type {number | string}
 */
 let numberOrString = Math.random() < 0.5 ? "hello" : 100;
 let typeAssertedNumber = /** @type {number} */ (numberOrString);
```

## インポート型

他ファイルの型宣言から、インポートして使うことができます。これは TypeScript 固有のもので、JSDoc の標準ではありません。

```ts
// User.ts
export interface User {
  name: string
  age: number
}
```

```js
// index.js
/** @type { import("./User").User;} */
let user
```

もちろんライブラリの型定義をインポートすることもできます。

```js
/** @type {import('axios').AxiosInstance} */
let instance
```

# @paramと@returns

`@type` と同じ構文で、関数の引数（`@param`）と返り値（`@returns`）に型をつけることができます。

```js
/**
 * 
 * @param {number} a パラメータ1
 * @param {number} b パラメータ2
 * @param {number} [c] 任意のパラメータ
 * @param {number} [d=1] デフォルト値をもつパラメータ 
 * @returns {number} 返り値
 */
const calc = (a, b, c, d = 1`) => {
  return a + b + c + d
}
```

# 型を定義する

## @typedef

Object 型は複雑になりやすく、再利用するときに同じような記述をするのは冗長です。

TypeScript で `interface` や `type` を定義するのと同じように、`@typedef` タグで型を定義できます。

```js
/**
 * @typedef User
 * @property {string} name ユーザー名
 * @property {number} age ユーザーの年齢
 * 
 */

/**
 * @type {User}
 */
let user1

/**
 * @type {User}
 */
let user2
```

## @param

`@param` を使うと、一度限りの方を指定できます。プロパティはネストした表現をします。

```js
/**
 * 
 * @param {Object} user 
 * @param {string} user.name 
 * @param {number} user.age 
 */
const fn = ({ name, age }) => {
  console.log({ name, age })
}
```

## @callback

`@callback` は、オブジェクトではなく関数の型を定義します。

```js
/**
 * @callback Calc
 * @param {number} num1
 * @param {number} num2
 * @returns {number}
 */

/** @type {Calc} */
const add = (num1, num2) => {
  return num1 + num2
}

/** @type {Calc} */
const sub = (num1, num2) => {
  return num1 - num2
} 
```

# ジェネリクス

`@template` を使うと、ジェネリクスを表現できます。

```js
/**
 * @template T
 * @param {T} x
 * @return {T}
 */
const test = (x) => {
  return x;
}

const a = test("string");
const b = test(123);
const c = test({});
```

しかしながら、ジェネリクスを使えるのは関数のみで、クラスや型宣言にはサポートされていません。

# @ts-check

JSDoc によって型を手に入れ快適な生活を送ることができましたが、1 つだけ重大な問題点が存在します。

JSDoc によって得られたものはしょせん型ヒントによる推測にすぎず、実際はただの JavaScript ファイルであることを忘れてはいけません。

以下のように、JSDoc で宣言した型以外を代入してもなにも警告をしてくれません。

```js
/** @type {number} */
let num;

num = 1
num = '10'
num = [1, 2, 3]

num.toFixed() // TypeError: num.toFixed is not a function
```

JavaScript ファイルにおいて警告を有効にしたい場合には、最初の行に `@ts-check` を使用します。

```js
// @ts-check
/** @type {number} */
let num;

num = 1
num = '10' // Type 'string' is not assignable to type 'number'.
num = [1, 2, 3] // type 'number[]' is not assignable to type 'number'
```

もし多くのファイルに対して `@ts-check` を適用させたい場合には、代わりに `tsconfig.json` を配置するようにしましょう。

## クラスのアクセス修飾子

JSDoc によって、`public`・`private`・`protected`・`readonly` のようなアクセス修飾子を付与できます。

```js
// @ts-check
class User {
  /**
   * 
   * @param {string} name 
   * @param {number} age 
   */
  constructor(name, age) {
    /** @readonly */
    this.id = 1

    /** @public */
    this.name = name

    /** @private */
    this.age = age
  }
}

const user = new User('user1', 24)

user.name // ok
user.age // Property 'age' is private and only accessible within class 'User'.
user.id = 2 // Cannot assign to 'id' because it is a read-only property.
```

# 参考

- [TypeScriptを活用したJSプロジェクト](https://www.typescriptlang.org/ja/docs/handbook/intro-to-js-ts.html)
- [JSDocリファレンス](https://www.typescriptlang.org/ja/docs/handbook/jsdoc-supported-types.html)
