---
id: 20j7YgNX5HCR9OY5hAgqyE
title: "【TypeScript】型アノテーションと型アサーションの違い"
slug: "typescript-type-annotation-vs-type-assetion"
about: "型アノテーションと型アサーションによる変数宣言は、一見同じ結果ををもたらすように見えます。しかし、型アサーションには明確な欠点が存在します。"
createdAt: "2021-07-24T00:00+09:00"
updatedAt: "2021-07-24T00:00+09:00"
tags: ["TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6zTzB66mCu7Oi65BeJO0Nh/c9a64c4494dde084026cbfa28fa0d044/__________________________3_.png"
  title: "typescript"
selfAssessment: null
published: true
---
型アノテーションと型アサーションによる変数宣言は、一見同じ結果をもたらすように見えます。

```ts
interface User {
    id: number
    username: string
}

// 型アノテーション
const alice: User = { id: 1, username: 'alice' } // Type is User

// 型アサーション
const bob = { id: 1, username: 'bob' } as User // Type is User
```

しかし両者のもたらす効果は異なり、型アサーションを使用する方法は明確な欠点が存在します。

# 型アサーションのもたらす欠点

第一に知ってほしいのは、型アサーションは**型を上書きする**ということです。

つまりは、TypeScript のコンパイラの警告を無視してプログラマの任意の型を与えることができます。これは、あなたがその型に関して TypeScript のコンパイラよりも詳しい場合には有効に働きますが、大抵の場合にはそうすべき理由はありません。

次のように、型アサーションを使用した場合にはその型に必要なプロパティを満たしていない場合にもエラーを報告しません。

```ts
interface User {
    id: number
    username: string
}

const alice: User = {} // Type '{}' is missing the following properties from type 'User': id, username
const bob = {} as User // Type is User
```

これは余分なプロパティを持っている際にも同様です。

```ts
interface User {
    id: number
    username: string
}

const alice: User = {
    id: 1,
    username: 'alice',
    password: 'passowrd'
}
// Type '{ id: number; username: string; password: string; }' is not assignable to type 'User'.
  Object literal may only specify known properties, and 'password' does not exist in type 'User'.

const bob = {
    id: 2,
    username: 'bob',
    password: 'passowrd'
} as User
```
