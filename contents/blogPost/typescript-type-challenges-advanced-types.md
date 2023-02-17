---
title: "【TypeScript】type-challenges で学ぶ高度な型"
about: "type-challengesを知っていますか？  これは TypeScript の型についての問題集で、問題文の条件を満たす独自のユーティリティ型を作るチャレンジです。いわゆる「型パズル」ってやつですね。  問題の回答はPlayground上で行えるので実際に手を動かしながら問題を解くことができます。型パズルを通じてTypeScript の高度な型について学んでいきましょう。"
createdAt: "2021-10-17T00:00+09:00"
updatedAt: "2021-10-17T00:00+09:00"
tags: ["TypeScript"]
published: true
---
[type-challenges](https://github.com/type-challenges/type-challenges) を知っていますか？

これは TypeScript の型についての問題集で、問題文の条件を満たす独自のユーティリティ型を作るチャレンジです。いわゆる「型パズル」ってやつですね。

問題の回答は [Playground](https://www.typescriptlang.org/play) 上で行えるので実際に手を動かしながら問題を解くことができます。

https://github.com/type-challenges/type-challenges にアクセスすると README.md に難易度別に問題が並んでいるので好きな問題を選択することができます。

![スクリーンショット 2021-10-17 21.54.19](//images.contentful.com/in6v9lxmm5c8/3qAVi9TcPTIHc7YH7APBaP/f504dfb93add3ac6e0490ed4aee26fd9/____________________________2021-10-17_21.54.19.png)

問題を選択したら詳細ページへ遷移します。`Take the Challenge` をクリックすると回答画面へ遷移し問題を解くことができます。

`Check out Solutions` をクリックすると他の人の回答を確認することができます。

![スクリーンショット 2021-10-17 21.55.33](//images.contentful.com/in6v9lxmm5c8/4ZVDUu6zuLcRhnViUJSeO2/49f562013a6cfc75f2da1103ba2a5842/____________________________2021-10-17_21.55.33.png)

回答画面は以下のような感じです。赤線が出てるエラーが発生しないように `Your code Here` の部分を修正します。

![スクリーンショット 2021-10-17 21.59.51](//images.contentful.com/in6v9lxmm5c8/XJp02uCRgAU3gGrMmAwOX/55d6f916d669a8548fbfc757bbad1111/__________2021-10-17_21.59.51.png)

ちなみにこの問題の回答は `type HelloWorld = string` とすれば十分です。回答が正しいかどうかはエラーが出ていないことで確認しましょう。

それでは実際に easy レベルから問題を解いていきます。型パズルを通じてTypeScript の高度な型について学んでいきましょう。

[カワイイボク](https://dic.nicovideo.jp/a/%E8%BC%BF%E6%B0%B4%E5%B9%B8%E5%AD%90)にかかればこれくらい余裕ですけどねー！

# Pick

> Implement the built-in Pick<T, K> generic without using it.
Constructs a type by picking the set of properties K from T
For example
>
> ```typescript
> interface Todo {
>   title: string
>   description: string
>   completed: boolean
> }
> 
> type TodoPreview = MyPick<Todo, 'title' | 'completed'>
> 
> const todo: TodoPreview = {
>     title: 'Clean room',
>     completed: false,
> }
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/4-easy-pick/README.md

## ヒント

この課題をパスするためには、以下の型を知る必要があります。

- [keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## 解説

### keyof

keyof はあるオブジェクトからそのキーを `string` または `number` のユニオンとして取得します。
例えば、例題にある `Todo` インターフェイスに `keyof` を適用すると以下の結果が得られます。

```typescript
type K = keyof Todo // 'title' | 'description' | 'completed'
```

回答例ではジェネリクスの2つ目の引数は `K extends keyof T` であり、つまり `MyPick` の2つ目の型引数は1つ目の型引数のキーのみを受け取るよう制約を設けています。

### Mapped Types

Mapped Types の基本形は ` { [P in K]: T }`であり、それぞれの型変数は以下の通りです。

- P パラメーター型
- K 制約型
- T 付与される型

まず `[P in K]` という部分はオブジェクトの取りうるキーを反復処理します。`in` というキーワードは`for...in` で使われている `in` と同じような意味であると考えるとわかりやすいと思います。

このとき `K` は `string` or `number` or `symbol` のユニオン型であり、そのユニオンの取りうる数だけオブジェクトのキーが生成されます。

回答例で `K` として使われている型変数はジェネリクスの1つ目の型引数のキーのユニオンとなっているのでした。このユニオンで指定した数だけキーが反復処理されるので `Pick` の2つ目の型引数で指定キーだけからなるオブジェクトを生成するという目的を達成できていることがわかるかと思います。

`T` はそのままオブジェクトのプロパティとして付与される型を表現しています。以下の例を確認してみましょう。

```typescript
type Foo<T, K extends string> = {
  [P in K]: T
}

type Bar = Foo<string, 'a' | 'b' | 'c'> 

// type Bar = {
//    a: string;
//    b: string;
//    c: string;
// }
```

`Pick` は元のキーが保有していた値の型を割り当てる必要があるのですが、その型情報はどこから取得すればよいのでしょうか？

今回の回答例では `T` の部分は単純な型変数ではなく、`T[P]` のようにまるでオブジェクトのプロパティにアクセスするような形の型を使用しています。この型を見てみましょう。

#### Indexed Access Types

`Indexed Access Types` を使うと通常の JavaScript でオブジェクトのプロパティにアクセスするように、オブジェクトの特定の型を取得できます。

```typescript
type Person = { age: number; name: string; alive: boolean };
type Age = Person["age"]; // number
```

この課題の回答例では `T[P]` という形でアクセスされていますが、 `P` は2つ目の形引数 `K` の取りうる型を反復処理したものですので、これによりそれぞれのキーに対応する適切な型を指定することができます。

`for...in` でオブジェクトの個々のプロパティの要素にアクセスする処理を考えてみると、理解しやすいのではないでしょうか？

```javascript
const todo = {
  title: 'my-title',
  description: 'lorem ipsum',
  completed: false
}
for ( const k in todo) {
  console.log(`key: ${k} value: ${todo[k]}`)
}
```

```sh
# console
key: title value: my-title
key: description value: lorem ipsum
key: completed value: false
```

## 回答例

```typescript
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P] 
}
```

# Readonly

> Implement the built-in  `Readonly<T>`  generic without using it.
> 
> Constructs a type with all properties of T set to readonly, meaning
> the properties of the constructed type cannot be reassigned.
> 
> For example
> 
> ```typescript 
> interface Todo {   title: string   description: string }
> 
> const todo: MyReadonly<Todo> = {   title: "Hey",   description: "foobar" }
> 
> todo.title = "Hello" // Error: cannot reassign a readonly property
> todo.description = "barFoo" // Error: cannot reassign a readonly property 
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/7-easy-readonly/README.md

## 解説

Pick では私達は以下の使い方を学びました。そのことを覚えていれば、簡単に回答できるはずです。

- [keyof](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

Mapped Types により、型引数で受け取ったすべてのプロパティを反復処理し `readonly` 修飾子を付与するだけです。

## 回答例

```typescript
type MyReadonly<T> = { 
  readonly [K in keyof T]: T[K] 
}
```

# Tuple to Object

> Give an array, transform into an object type and the key/value must in the given array.
> For example

> ```ts
> const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
> 
> const result: TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/11-easy-tuple-to-object/README.md

## 解説

Pick, Readonly と同じように以下を利用します。

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

`Mapped Types` を使用して反復処理をするのはお決まりのパターンです。ただし、今回は渡される型引数がオブジェクトではなくタプルなので `K` に `keyof T`のパターンは使用できません。

代わりに Indexed Access Types を利用して `T[number]` という型制約を利用します。配列に対して `T[number]` とアクセスすると配列から型を取得できます。

```ts
const array = ['apple', 'banana', 'strawberry'] as const

type Arr = typeof array // ['apple', 'banana', 'strawberry']

type Fruits = Arr[number] // "apple" | "banana" | "strawberry"
```

得られた配列の取りうる値をキーとして反復処理を行えばのぞみのオブジェクトを生成することができます。

## 回答例

```ts
type TupleToObject<T extends readonly string[]> = {
  [P in T[number]]: P
}
```

# First of Array

> Implement a generic `First<T>` that takes an Array `T` and returns it's first element's type.
> 
> For example
> 
> ```ts
> type arr1 = ['a', 'b', 'c']
> type arr2 = [3, 2, 1]
> 
> type head1 = First<arr1> // expected to be 'a'
> type head2 = First<arr2> // expected to be 3
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/14-easy-first/README.md#first-of-array--

## ヒント

この課題をパスするためには以下の機能を知る必要があります。

- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 解説

今までの課題で `Indexed Access Type` に十分に触れてきたので、配列の先頭の型にアクセスするにはなにをすべきかもうお分かりでしょう。

JavaScript で配列の先頭にアクセスするためには `Arr[0]` と添字に `0` を用いればよいのでした。型システム上でもそれは変わりありません。

```ts
type First<T extends any[]> = T[0]
```

しかし、現状の実装では型引数として空の配列を渡された時に対応できません。空の配列は `0` というプロパティを持っていないからですね。

このケースに対応するため配列が空かどうかチェックし空の配列なら `never` を返し、そうでないなら配列の先頭の型を返すという条件分岐が必要です。型システム上で条件分岐を実装するには `Conditional Types` を使用します。空の配列かどうかの条件部には `T extends []`  と記述します。

## 回答例

```ts
type First<T extends any[]> = T extends [] ? never : T[0]
```

# Length of Tuple

> For given a tuple, you need create a generic `Length`, pick the length of the tuple
> 
> For example
> 
> ```ts
> type tesla = ['tesla', 'model 3', 'model X', 'model Y']
> type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
> 
> type teslaLength = Length<tesla>  // expected 4
> type spaceXLength = Length<spaceX> // expected 5
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/18-easy-tuple-length/README.md

## ヒント

この課題をパスするためには以下の機能を知る必要があります。

- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## 解説

`Indexed Access Types` のことをすでに知っているのであれば、この課題は驚くほど簡単です。普段配列の要素の数を取得するために `Array.length` プロパティにアクセスしています。同じように、型変数に対して `length` プロパティにアクセスすれば タプルの要素数を取得することができます。

```typescript
type Length<T extends any> = T['length']
```

しかし、これだけだと `T` が本当に `length` プロパティを持っているかどうかわからないので、以下のようなエラーが出力されてしまします。

```typescript
Type '"length"' cannot be used to index type 'T'.
```

`T` が`length` プロパティを持っていることを伝えるために `extends { length: number }` のように制約を持たせることも可能ですが、この指定方法ですとタプルだけでなく `string` のような型も引数として渡せてしますので、適切ではありません。これを踏まえた回答例は以下になります。 

## 回答例

```typescript
type Length<T extends readonly any[]> = T['length']
```

# if 

> Implement a utils `If` which accepts condition `C`, a truthy return type `T`, and a falsy return type `F`. `C` is expected to be either `true` or `false` while `T` and `F` can be any type.
> 
> For example:
> 
> ```ts
> type A = If<true, 'a', 'b'>  // expected to be 'a'
> type B = If<false, 'a', 'b'> // expected to be 'b'
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/268-easy-if/README.md

## ヒント

この課題をパスするためには、以下の機能を知る必要があります。

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 解説

型引数 `C`,`T`,`F` を受け取り `C` が `true` なら `T`を、`C` が `false` なら `F` を返す `If` 型を作成します。

まず、問題文から `C` は `true` もしくは `false` である必要があるのでまずはここから埋めてしまいましょう。

```ts
type If<C extends boolean, T, F> = any
```

型システム上で `if` のような条件分岐を実装するためには **Conditional Types** と呼ばれる機能を使います。構文は以下の通りで、三項演算子と同様の演算子なので直感的に理解しやすいと思います。

```typescript
SomeType extends OtherType ? TrueType : FalseType;
```

条件部は `SomeType`  が `OtherType` を拡張しているかを定義します。条件を満たす場合には `TrueType` を返し、そうでないなら `FalseTyep` を返します。上記の構文を課題の例に当てはめると以下の回答例になります。

## 回答例

```typescript
type If<C extends boolean, T, F> = C extends true ? T : F
```

# Exclude

> mplement the built-in Exclude<T, U>
> > Exclude from T those types that are assignable to U

https://github.com/type-challenges/type-challenges/blob/master/questions/43-easy-exclude/README.md

## ヒント

この課題をパスするためには以下の機能を知る必要があります。

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 解説

[Exclude<T, U>](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion) は `U` に割り当て可能な型を`T` から除外する型です。 Union Types から特定の型を取り除く際に使われます。

```ts
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"

type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

この課題を解くにあたり重要になるポイントは `Conditional Types` が**分配法則(Distributive)** に従うと
いう点です。`Conditional Types` の条件部において `T extends U` の `T` が ユニオン型である場合 `T` に対して反復処理を行い各要素に条件を適用します。

```ts
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>; // string[] | number[]
```

https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types

そのため、回答例としては `T` の各要素を反復し  `T` が `U` を拡張可能であれば `never` を返しそうでないなら `T` を返すようにすればよいです。

## 回答例

```ts
type MyExclude<T, U> = T extends U ? never : T
```

# Awaited

> If we have a type which is wrapped type like Promise. How we can get a type which is inside the wrapped type? For example if we have `Promise<ExampleType>` how to get ExampleType?

https://github.com/type-challenges/type-challenges/blob/master/questions/189-easy-awaited/README.md

## ヒント
この課題をパスするためには以下の機能を知る必要があります。

- [infer](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)

## 解説

この課題でやるべきは `Promise<T>` から `T` を取り出すことです。このようにある型から内側の型を取り出すことを Unwrap と呼びます。

はじめのステップとして `Promise<string>` から `string` を取り出す例を考えてみましょう。これは型引数 `T` が `Promise<string>` を拡張可能である場合 `string` を返すような記述すればよいです。

```ts
type Awaited<T extends Promise<any>> = T extends Promise<string> ? string : never
```

他にも `number` や `boolean` の例も出してみましょう。

```ts
type Awaited<T extends Promise<any>> = T extends Promise<number> ? number : never
type Awaited<T extends Promise<any>> = T extends Promise<boolean> ? boolean : never
```

この型を特定の型だけでなく一般性を持たせるためには `T` が `Promise<U>` を拡張可能であるならば `U` を返すという記述をすればよさそうです。しかし、`U` という型変数はどこから取得すればよいのでしょうか？ `Promise<any>` という型を受け取ったうえで、実際に条件が評価されるタイミングになったらその具体的な型を代入したいということをしたいのです。

このような場合には `infer` キーワードが使えます。`infer` は `conditional type` のみで使用することができます。`infer` は「推論」を意味する単語であり、その型になにかわかった時点で型変数にその値を代入します。

## 回答例

```typescript
type Awaited<T extends Promise<any>> = T extends Promise<infer U> ? U : never
```

# Parameters

> Implement the built-in Parameters<T> generic without using it.

https://github.com/type-challenges/type-challenges/blob/master/questions/3312-easy-parameters/README.md

## ヒント

この課題をパスするためには以下の機能を知る必要があります。

- [infer](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)

## 解説

[Parameters](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype) はある関数型 `T` 引数の型をタプルとして取得する組み込み型です。

```typescript
const foo = (arg1: string, arg2: number): void => {}
const bar = (arg1: boolean, arg2: {a: 'A'}): void => {}
const baz = (): void => {}

type T0 = Parameters<typeof foo> // [string, number]
type T1 = Parameters<typeof bar> // [boolean, {a: 'A'}]
type T2 = Parameters<typeof baz> // []
```

やるべきことは `(...args: any[]) => any` という型から `(...args: any[])` の部分の具体的な型を取得することです。このように実際に条件が評価されるタイミングになってからその具体的な型を取得するには `infer` キーワードを使用します。

## 回答例

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer U) => any ? U : never
```

# Concat

> Implement the JavaScript `Array.concat` function in the type system. A type takes the two arguments. The output should be a new array that includes inputs in ltr order
> 
> For example
> 
> ```ts
> type Result = Concat<[1], [2]> // expected to be [1, 2]
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/533-easy-concat/README.md#concat--

## ヒント

この課題をパスするためには、以下の機能を知る必要があります。

- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## 解説

[Array.concat](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) と同じことを型システムとして実装します。

ところで、皆さんは普段配列の連結はどのような方法で行っていますか？ `Array.concat` を使う以外の方法として以下のように [スプレット構文](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Spread_syntax) をよく使うと思います。

```typescript
const arr1 = [1,2,3]
const arr2 = [4,5,6]

const result = [...arr1, ...arr2] // [1, 2, 3, 4, 5, 6] 
```

実は上記の例と同じことが型システムでも可能です。つまりタプル型のなかで `...T` と書くことができるのです。 これが **Variadic Tuple Types** と呼ばれる機能です。

型システムの中でスプレット構文が使えるとあれば、すでに答えは見えてきているのではないでしょうか？

`...T` の書き方ができる型システムは `extends any[]` という条件を満たす必要があります。このことを踏まえた回答例は以下の通りです。

## 回答例

```typescript
type Concat<T extends any[], U extends any[]> = [...T, ...U]
```

# Push

> Implement the generic version of ```Array.push```
> 
> For example
> 
> ```typescript
> type Result = Push<[1, 2], '3'> // [1, 2, '3']
> ```

## ヒント

この課題をパスするためには、以下の機能を知る必要があります。

- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## 解説

Concat と同じ考え方で解くことができます。

JavaScript で `Array.push` を使わずに配列の末尾に要素を追加するときはどのようにしていますか？

## 回答例

```ts
type Push<T extends any[], U> = [...T, U] 
```

# Unshift

> Implement the type version of ```Array.unshift```
> 
> For example
> 
> ```typescript
> type Result = Unshift<[1, 2], 0> // [0, 1, 2,]
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/3060-easy-unshift/README.md

## ヒント

この課題をパスするためには、以下の機能を知る必要があります。

- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## 解説

単純に Push と逆のことをやればよいですね。

## 回答例

```ts
type Unshift<T extends any[], U> = [U, ...T]
```
# 完走した感想

easy レベルといいながら普通に難しくないですか・・・？ちなみに easy レベルにはもう一つ [Includes](https://github.com/type-challenges/type-challenges/blob/master/questions/898-easy-includes/README.md) という問題があるのですが明らかに難易度詐称なのでこの記事には載せていません（

実際にはこの辺りの知識はライブラリ作成者が使用するような型なので解けなくても特に困るようなことはないです（

実際手を動かしながら考えることでより知識が定着することができたのが良い点でした。
