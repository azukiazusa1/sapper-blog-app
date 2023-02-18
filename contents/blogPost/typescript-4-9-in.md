---
id: 1hoeYWvFpBx8tCIC2GvYma
title: "TypeScript 4.9 で in 演算子による型の絞り込みが改善された"
slug: "typescript-4-9-in"
about: "TypeScript において `in` 演算子を `unknown` 型に対して使用した際の挙動が改善されました。"
createdAt: "2022-11-20T00:00+09:00"
updatedAt: "2022-11-20T00:00+09:00"
tags: ["TypeScript"]
published: true
---
TypeScript は `if` 文などの制御フロー分析することで、自動的に型を絞り込んでくれます。この仕組みは「型ガード」と呼ばれます。

型を絞り込む方法はいくつかありますが、その中でも `in` 演算子を使用した方法が存在します。`in` 演算子は左辺で指定されたプロパティが右辺で指定したオブジェクトに存在する場合に `true` を返します。この性質を利用して TypeScript では検査したプロパティを持つ型のみに絞り込まれます。

```typescript
type User = {
    id: number
    name: string
}

type Admin = {
    id: number
    name: string
    role: string
}

const doSomething = (x: User | Admin) => {
    if ('role' in x) {
        x
        // ^?(parameter) x: Admin
    } else {
        x
        // ^?(parameter) x: User
    }
}
```

関数 `doSomething` の引数には `User` または `Admin` 型が渡されます。`if ('role7 in x)` のように `in` 演算子を用いて条件分岐を行ったとき、、`true` の際のブロックには `role` プロパティを持つ `Admin` 型しか存在し得ないのは明白です。そのため、TypeScript により `Admin` 型に推論されるわけです。

このように `in` 演算子は正しく使用すれば有益なのですが、`unknown` 型に対して `in` 演算子を用いる際に一つの問題が生じていました。以下の例を見てみましょう。

```typescript
type User = {
    id: number
    name: string
}

const isUser = (x: unknown): x is User => {
    if (
        typeof x === 'object' &&
        x !== null &&
        'id' in x &&
        typeof x.id === 'number' && // Property 'id' does not exist on type 'object'.
        'name' in x &&
        typeof x.name === 'string' // Property 'string' does not exist on type 'object'.
    ) {
        return true
    } else {
        return false
    }
}
```

`isUser` 関数はある不明な型が `User` 型かどうか判定するための関数です。例えば API から返却されたオブジェクトを安全に使用したい場合などにこのような関数が使われることがあるでしょう。

ここで問題になっているのは `typeof x.id` で `id` が `number` 型かどうか判定している箇所です。このコードは `&&` 演算子により「`x` がオブジェクト型である」「`x` は `null` ではない」「`x` に `id` プロパティが存在している」ことが保証されているはずです。しかし、「Property 'id' does not exist on type 'object'」 と言われているとおり、`in` 演算子を用いているにも関わらず `id` プロパティが存在しないとエラーを報告しています。

これは `x` の型が `unknown` から `object` に絞られている一方、`in` 演算子はチェック対象のプロパティを実際に定義している型に厳密に絞られるためです。結果的に `x` は `object` 型のままとなってしまいます。この問題を解決するためには `any` 型を使うほかありませんでした。しかし、`any` 型はできる限り使用を避けないものです。

TypeScript 4.9 からはこの挙動が改善されました。`in` 演算子が使われた場合 `Record<"id", unknown>` との交差型となるように改善されました。

```typescript
type User = {
    id: number
    name: string
}

const isUser = (x: unknown): x is User => {
    if (
        typeof x === 'object' &&
        x !== null &&
        'id' in x &&
        typeof x.id === 'number' && //  object & Record<"id", unknown>
        'name' in x &&
        typeof x.name === 'string' // object & Record<"id", unknown> & Record<"name", unknown>
    ) {
        return true
    } else {
        return false
    }
}
```

