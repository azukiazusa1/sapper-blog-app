---
id: 6Ob7zISH3jk9ghaAhHqwo3
title: "Q: TypeScript を使っているのに関数の引数のオブジェクトや配列に `readonly` を付与しないのは犯罪ですか？ #Shorts"
slug: "q-typescript-readonly-shorts"
about: "質問来てた👉  Q: TypeScript を使っているのに関数の引数のオブジェクトや配列に `readonly` を付与しないのは犯罪ですか？  結論：犯罪になる場合がある。 まず、配列の引数に `readonly` を付与しておけば以下の利点を得られます。  - うっかり関数の内部で引数の値を変更してしまうコードを書いてしまったときにコンパイルエラーが得られる - 関数の利用者が安心して関数を呼び出せる"
createdAt: "2021-10-03T00:00+09:00"
updatedAt: "2021-10-03T00:00+09:00"
tags: ["TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6zTzB66mCu7Oi65BeJO0Nh/c9a64c4494dde084026cbfa28fa0d044/__________________________3_.png"
  title: "typescript"
published: true
---
質問来てた👉。

Q: TypeScript を使っているのに関数の引数のオブジェクトや配列に `readonly` を付与しないのは犯罪ですか？

結論：犯罪になる場合がある。

まず、配列の引数に `readonly` を付与しておけば以下の利点を得られます。

- うっかり関数の内部で引数の値を変更してしまうコードを書いてしまったときにコンパイルエラーが得られる
- 関数の利用者が安心して関数を呼び出せる

```typescript
const getTop3 = (users: readonly User[]) => {
    const sortedUsers = users.sort((a, b) => b.score - a.score) // Property 'sort' does not exist on type 'readonly User[]'.
    return sortedUsers.slice(0, 3)
}
```

特に、関数の利用者視点では引数として渡したオブジェクトが変更されないことが保証されているので安心して利用できるという点が大きいでしょう。

逆に言えば `readonly` ではない配列やオブジェクトを利用する場合はコピーを生成してから関数を利用する間に関数の実装を確認しなければいけないなど関数の利用者に負担を強いることになってしまします。

そのため関数の引数のオブジェクトや配列二￥に `readonly` を付与しないのは副作用のある関数を定義してしまった罪 22 条によって犯罪となります。

ほかにも知りたいことがあったらコメント欄で教えて👇。

## readonly とは

JavaScript では変数を宣言するときに `const` を用いるとその変数に対して再代入をできなくなります。一般的にソースコードを読む際には値が変わらないことが保証されていると読み手の負荷が下がるので基本的に `const` で変数を宣言することが推奨されています。

しかし `const` で変数を宣言しても次のようにオブジェクトのプロパティを書き換えたり、配列の要素を増減させることはできてしまいます。

```typescript
const user = {
    id: 1,
    name: 'alice'
}

user.id = 10

console.log(user)
// {
//   "id": 10,
//   "name": "alice"
// } 

const colors = ['red', 'green', 'blue']

colors.push('yellow')

console.log(colors) // ["red", "green", "blue", "yellow"] 
```

TypeScript においてオブジェクトやを完全に読み取り専用にしたい場合にはインターフェイス上のプロパティに対して `readonly` を付与することできます。 `readonly` が付与されたプロパティの値を変更しようとするコンパイルエラーを得られます。

```typescript
interface User {
    readonly id: number
    readonly name: string
}

const user: User = {
    id: 1,
    name: 'alice'
}

user.id = 10 // Cannot assign to 'id' because it is a read-only property.
```

配列の場合も同様に `readonly` を付与することで値の上書きだけでなく `push` や `sort` といった破壊的なメソッドの呼び出しについてもコンパイルエラーを得ることができます。

```typescript
const colors: readonly string[] = ['red', 'green', 'blue']

colors.push('yellow')
```

## 関数の引数にオブジェクトや配列を渡すことの危うさ

ところで JavaScript において関数の引数にオブジェクトや配列を渡すときには 1 つの危険が発生する可能性があります。関数の引数として渡されたオブジェクトや関数を変更すると呼び出し元も変更されてしまいます。

```typescript
interface User {
    id: number
    name: string
}

const user: User = { id: 1, name: 'alice' }

const someDangerousFunc = (argUser: User) => {
    argUser.id = 99999999
}

someDangerousFunc(user)

console.log(user)
// {
//   "id": 99999999,
//   "name": "alice"
// } 
```

基本的には引数のオブジェクトや配列の中身を変更しないように気をつければいいわけなのですが、 JavaScript の配列のメソッドは破壊的なものと非破壊的なものと一見区別がつかないのでその気がなくともうっかり変更してしまう可能性があります。

例えば `array#sort` はメソッド名から配列の並べ替えを行うメソッドですがその名前からは元の配列を変更するかしないのかわかりません。

```typescript
interface User {
    id: number
    name: string
    score: number
}

const users: User[] = [
    {
        id: 1,
        name: 'Aice',
        score: 88
    },
    {
        id: 2,
        name: 'Bob',
        score: 56
    },
    {
        id: 3,
        name: 'Carol',
        score: 91
    },
    {
        id: 4,
        name: 'Dave',
        score: 79
    },
    {
        id: 5,
        name: 'Eve',
        score: 63
    },
]

const getTop3 = (argsUsers: User[]) => {
    const sortedUsers = argsUsers.sort((a, b) => b.score - a.score)
    return sortedUsers.slice(0, 3)
}

getTop3(users)

console.log(users)

[LOG]: [{
  "id": 3,
  "name": "Carol",
  "score": 91
}, {
  "id": 1,
  "name": "Aice",
  "score": 88
}, {
  "id": 4,
  "name": "Dave",
  "score": 79
}, {
  "id": 5,
  "name": "Eve",
  "score": 63
}, {
  "id": 2,
  "name": "Bob",
  "score": 56
}] 
```

見てのとおり実際に `array#sort` は元の配列を変更するメソッドなので引数に渡して元の変数の配列に思わぬ変更を与えてしまいます。

## readonly で身を守る

上記の危険を回避するために、配列の引数の型を `User[]` から `readonly User[]` に変更しましょう。前述のとおり `readonly` を付与した配列に対して破壊的なメソッドを呼び出すとコンパイルエラーが得られます。

`User[]` 型は `readonly User[]` 型のサブタイプなので問題なく代入をできます。

```typescript
const users: User[] = [/** 省略 **/]

const getTop3 = (users: readonly User[]) => {
    const sortedUsers = users.sort((a, b) => b.score - a.score) // Property 'sort' does not exist on type 'readonly User[]'.
    return sortedUsers.slice(0, 3)
}

getTop3(users)
```

上記コンパイルエラーを解決するには配列のコピーを作成してから `sort` メソッドを呼び出すと良いでしょう。

```typescript
const getTop3 = (users: readonly User[]) => {
    const sortedUsers = [...users].sort((a, b) => b.score - a.score)
    return sortedUsers.slice(0, 3)
}
```

ちなみに上記実装にはまだ抜け穴が残っています。 `User` オブジェクトが `readonly` になっていないのでまだ変更可能になってしまっています。

```typescript
const getTop3 = (users: readonly User[]) => {
    users[1].score = 99999999 // Bobの点数をこっそり書き換える
    const sortedUsers = [...users].sort((a, b) => b.score - a.score)
    return sortedUsers.slice(0, 3)
}
```

抜け穴を塞ぐためには `User` インターフェイスのプロパティをすべて `readonly` にした新たなインターフェイスを用意して引数の型として利用しましょう。

```typescript
interface User {
    id: number
    name: string
    score: number
}

interface ReadonlyUser {
    readonly id: number
    readonly name: string
    readonly score: number
}

const users: User[] = [/** 省略 **/]

const getTop3 = (users: readonly ReadonlyUser[]) => {
    users[1].score = 99999999 // Cannot assign to 'score' because it is a read-only property.
    const sortedUsers = [...users].sort((a, b) => b.score - a.score)
    return sortedUsers.slice(0, 3)
}
```

実際にはわざわざ同じようなプロパティを持つインターフェイスを二重に定義するのは面倒なので組み込み型である `Readonly<T>` を使いましょう。

```typescript
const getTop3 = (users: readonly Readonly<User>[]) => {
    users[1].score = 99999999 // Cannot assign to 'score' because it is a read-only property.
    const sortedUsers = [...users].sort((a, b) => b.score - a.score)
    return sortedUsers.slice(0, 3)
}
```
