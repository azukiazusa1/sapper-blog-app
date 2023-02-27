---
id: 3fSOYlPU95IS65fgD7gIFq
title: "【TypeScript】type-challenges 中級編"
slug: "typescript-type-challenges"
about: "[type-challengs](https://github.com/type-challenges/type-challenges) の medium レベルをやります。"
createdAt: "2021-10-24T00:00+09:00"
updatedAt: "2021-10-24T00:00+09:00"
tags: ["TypeScript"]
published: true
---
[type-challengs](https://github.com/type-challenges/type-challenges) の medium レベルをやります。

# Get Return Type

> Implement the built-in `ReturnType<T>` generic without using it.
> 
> For example
> 
> ```ts
> const fn = (v: boolean) => {
>   if (v)
>     return 1
>   else
>     return 2
> }
> 
> type a = MyReturnType<typeof fn> // should be "1 | 2"
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/2-medium-return-type/README.md

## ヒント

- [infer](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types)

## 解説

やるべきことは `(...args: any[]) => any` という型から `=> any` の部分の具体的な型を取得することです。このように実際に条件が評価されるタイミングになってからその具体的な型を取得するには `infer` キーワードを使用します。

## 回答例

```typescript
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never
```

# Omit

> Implement the built-in `Omit<T, K>` generic without using it.
> 
> Constructs a type by picking all properties from `T` and then removing `K`
> 
> For example
> 
> ```ts
> interface Todo {
>   title: string
>   description: string
>   completed: boolean
> }
> 
> type TodoPreview = MyOmit<Todo, 'description' | 'title'>
> 
> const todo: TodoPreview = {
>   completed: false,
> }
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/3-medium-omit/README.md

## ヒント

この課題をパスするためには、以下の型を知る必要があります。

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Key Remapping in Mapped Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types)

## 解説

やりたいことは `Pick` と同じで `Mapped Types` を使って新しいオブジェクトを作成すればよいわけですが、第 2 引数で渡されたキーを除外しなければいけないので、単純な `Mapped Type` を使うだけでは回答できません。

とりあえず現時点でわかるところだけを埋めておきましょう。

```typescript
type MyOmit<T, K extends keyof T> = any
```

ここでやりたいことは `keyof T` を反復したうえで反復時の型 `P` が `P extends K` を満たさないときだけオブジェクトのプロパティに追加することです。

条件分岐が出てきたのでなんとなく `Conditional Types` を使えばよいことは想像できますが、どうすれば反復処理の中で条件分岐を使うことができるのでしょうか？

`Mapped Types` 元のプロパティから新しいプロパティを生成したり、あるプロパティを除外するためには `as` 句を使用します。

`as` 句は 2 通りの使い方があります。1 つ目は以下の例のとおり `template literal types` を用いてプロパティ名をリネームできます。

```ts
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;

type LazyPerson = {
    getName: () => string;
    getAge: () => number;
    getLocation: () => string;
}
```

2 つ目の使い方として、`as` 句の中で `never` を返した場合にはそのプロパティを除外できます。今回の課題の場合には `as` 句の中で `P` が `K` に対して拡張可能であるか検査しそうであるなら `never` を返せばよいわけです。

## 回答例

```typescript
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P]
}
```

# Readonly 2

> Implement a generic `MyReadonly2<T, K>` which takes two type argument `T` and `K`.
> 
> `K` specify the set of properties of `T` that should set to Readonly. When `K` is not provided, it should make all properties > readonly just like the normal `Readonly<T>`.
> 
> For example
> 
> ```ts
> interface Todo {
>   title: string
>   description: string
>   completed: boolean
> }
> 
> const todo: MyReadonly2<Todo, 'title' | 'description'> = {
>   title: "Hey",
>   description: "foobar",
>   completed: false,
> }
> 
> todo.title = "Hello" // Error: cannot reassign a readonly property
> todo.description = "barFoo" // Error: cannot reassign a readonly property
> todo.completed = true // OK
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/8-medium-readonly-2/README.md

## ヒント

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Intersection Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types)

## 解説

まずは、途中までは [Readonly](https://github.com/type-challenges/type-challenges/blob/master/questions/7-easy-readonly/README.md) と同じなのでそこまで書いてしまいましょう。

```typescript
type MyReadonly2<T, K> = {
  readonly [P in keyof T]: T[P]
}
```

通常の `Readonly` と異なる点は第 2 引数で受け取る型のみを `readonly` とする点です。 `Mapped Types` の反復処理させる集合を `K` に変更しましょう。また `K` は `T` のプロパティ型のみを受け取るように制約を設けます。

```ts
type MyReadonly2<T, K extends keyof T> = {
  readonly [P in keyof K]: T[P]
}
```

一方で第 2 引数で指定されなかった型はどのように表現するのか考えてみましょう。 `readonly` を付与しない、ということはなにもしないでそのまま返せばよいのです。

```typescript
type MyReadonly2<T, K> = T
```

これで `K` で指定されたプロパティと指定されなかったプロパティどちらも表すことができました。最終的にこれらの型を結合して返したいのですから、交差型（Intersection Types）を使いましょう。交差型は同じプロパティ名を持つとき後ろの型が優先されるので順番が重要です。

```ts
type MyReadonly2<T, K extends keyof T> = T & {
  readonly [P in K]: T[P]
}
```

しかし、この形ではまだ漏れがあります。 `K` が渡されなかった場合にはすべてのプロパティを `readonly` にする必要がありますがその要件を満たせていません。

このエラーを解消するために `K` に対してデフォルト引数を渡します。これは [JavaScriptのデフォルト引数](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Functions/Default_parameters)と同様の構文です。デフォルト値として `T` のプロパティの取りうるすべての値を渡せばすべてのプロパティに対して反復処理が行われるため要件を満たすことができます。

## 回答例

```typescript
type MyReadonly2<T, K extends keyof T = keyof T> = T & {
  readonly [P in K]: T[P]
}
```

# Deep Readonly

> Implement a generic DeepReadonly<T> which make every parameter of an object - and its sub-objects recursively - readonly.
> 
> You can assume that we are only dealing with Objects in this challenge. Arrays, Functions, Classes and so on are no need to take into consideration. However, you can still challenge your self by covering different cases as many as possbile.
> 
> For example
> 
> ```ts
> type X = { 
>   x: { 
>     a: 1
>     b: 'hi'
>   }
>   y: 'hey'
> }
> 
> type Expected = { 
>   readonly x: { 
>     readonly a: 1
>     readonly b: 'hi'
>   }
>   readonly y: 'hey' 
> }
> 
> const todo: DeepReadonly<X> // should be same as `Expected`
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/9-medium-deep-readonly/README.md

## ヒント

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)

## 解説

途中までは [Readonly](https://github.com/type-challenges/type-challenges/blob/master/questions/7-easy-readonly/README.md) と同じです。

```typescript
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P]
}
```

ここで `DeepReadonly` にするための条件を見直してみましょう。この課題ではすべてのパラメーターとそのサブオブジェクトを再帰的に `readonly` とする必要があると書いてあります。つまり `T[P]` がオブジェクトならさらにサブオブジェクトまで `readonly` とし、それ以外ならそのまま `T[P]` を返せばよいわけです。「`T[P]` がオブジェクトなら〜」という条件が出てきましたので、ここは `Conditional Types` の出番です。

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? /** T[P]がオブジェクトだったときの処理 */ : T[P]
}
```

`T[P]` がオブジェクトかどうかの判定のために組み込み型である [Record<Keys, Type>](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type)を使用しています。`Record<Keys, Type>` はプロパティが `Keys` 型あり、値が `Type` 型であるオブジェクト型を生成します。

最後に `T[P]` がオブジェクトだったときの処理を埋めましょう。問題文がヒントとなっているように `conditional types` おいては再帰的な型を定義できます。

## 回答例

```ts
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown> ? DeepReadonly<T[P]> : T[P]
}
```

# Tuple to Union

> Implement a generic `TupleToUnion<T>` which covers the values of a tuple to its values union.
> 
> For example
> 
> ```ts
> type Arr = ['1', '2', '3']
> 
> const a: TupleToUnion<Arr> // expected to be '1' | '2' | '3'
> ```

## ヒント

- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## 解説

配列型に `number` でアクセスすると配列の要素の型を取得できます。

```ts
const array = ['apple', 'banana', 'strawberry'] as const

type Arr = typeof array // ['apple', 'banana', 'strawberry']

type Fruits = Arr[number] // "apple" | "banana" | "strawberry"
```

# Last of Array 

> > TypeScript 4.0 is recommended in this challenge
> 
> Implement a generic `Last<T>` that takes an Array `T` and returns it's last element's type.
> 
> For example
> 
> ```ts
> type arr1 = ['a', 'b', 'c']
> type arr2 = [3, 2, 1]
> 
> type tail1 = Last<arr1> // expected to be 'c'
> type tail2 = Last<arr2> // expected to be 1
> ```

## ヒント

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

## 解説

配列から最後の要素を取り出す方法をいくつか考えてみましょう。真っ先に思いつくのが `arr[arr.length - 1]` のように「配列の長さ - 1 の添字でアクセスする」という方法ですが、型システム上で四則演算はできません。

```ts
type Last<T extends any[]> = T[T['length'] - 1] // ']' expected.
```

その他の方法を考えてみましょう。単純に配列の先頭の要素から 1 つずつ取得していって最後に残った要素は配列の最後の要素になります。これを型システム上で表現するには `Variadic Tuple Types` を使います。JavaScript では構文エラーになる書き方なので、ちょっと気が付きにくいかもしれないですね。

```ts
[...any, L]
```
この形から `L` を取得できればよさそうです。最後の要素の型を推測するためには `infer` が使えます。

## 回答例

```ts
type Last<T extends any[]> = T extends [...any, ...infer L] ? L : never
```

# Pop 

> > TypeScript 4.0 is recommended in this challenge
> 
> Implement a generic `Pop<T>` that takes an Array `T` and returns an Array without it's last element.
> 
> For example
> 
> ```ts
> type arr1 = ['a', 'b', 'c', 'd']
> type arr2 = [3, 2, 1]
> 
> type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
> type re2 = Pop<arr2> // expected to be [3, 2]
> ```
> 
> **Extra**: Similarly, can you implement `Shift`, `Push` and `Unshift` as well?

https://github.com/type-challenges/type-challenges/blob/master/questions/16-medium-pop/README.md

## ヒント

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

## 解説

`Last of Array` では配列の最後の要素だけを取得しました。`Pop` は配列の最後の要素だけを取り除きます。

## 回答例

```ts
type Pop<T extends any[]> = T extends [...infer P, any] ? P : never
```

# Promise.all

> Type the function `PromiseAll` that accepts an array of PromiseLike objects, the returning value should be `Promise<T>` where `T` is the resolved result array.
> 
> ```ts
> const promise1 = Promise.resolve(3);
> const promise2 = 42;
> const promise3 = new Promise<string>((resolve, reject) => {
>   setTimeout(resolve, 100, 'foo');
> });
> 
> // expected to be `Promise<[number, number, string]>`
> const p = Promise.all([promise1, promise2, promise3] as const)
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/20-medium-promise-all/README.md

## ヒント

- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)

## 解説

`PromiseAll` はある配列の型を受け取りそれを `Promise` でラップしたものを返します。
はじめのステップとしてまずはそこから記述しましょう。

```ts
declare function PromiseAll<T extends any[]>(values: [...T]): Promise<T>
```

この段階で `argument of type 'readonly [1, 2, 3]' is not assignable to parameter of type '[1, 2, 3]'.`  というエラーが表示されています。引数の型に `readonly` 修飾子を付与して修正しましょう。

```ts
declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<T>
```

この時点で 1 つ目のテストケースは成功しますが、残りはエラーとなっています。これは `Promise.all` は渡された型の配列に `Promise` でラップされている型が含まれている場合それをアンラップする必要があるためです。1 つ目のテストケースには `Promise` が含まれていないので成功しているわけです。

それではこのエラーを修正しましょう。配列の要素を 1 つづつ検査し、その要素の型が `Promise` であった場合 [Awaited](https://github.com/type-challenges/type-challenges/blob/master/questions/189-easy-awaited/README.md) でやったように `Promise<T>` から `T` を取り出せばよいわけです。

## 回答例

```ts
declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<{
  [P in keyof T]: T[P] extends Promise<infer R> ? R : T[P]
}>
```

# TypeLookup

https://github.com/type-challenges/type-challenges/blob/master/questions/62-medium-type-lookup/README.md

## ヒント

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 解説

単純に `U` が `{ type: T }` というプロパティを持っているかどうか検査し、そうであるなら `U` を返せばよいです。

## 回答例

```ts
type TypeLookUp<U, T> = U extends { type: T } ? U : never
```

# TrimLeft

> Implement `TrimLeft<T>` which takes an exact string type and returns a new string with the whitespace beginning removed.
> 
> For example
> 
> ```ts
> type trimed = TrimLeft<'  Hello World  '> // expected to be 'Hello World  '
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/106-medium-trimleft/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)

## 解説

やりたいことは、文字列の先頭がスペースかどうか判定してそうであるなら残りの文字で再帰的に `TrimLeft` を呼び出しそうでないなら文字列をそのまま返せばできそうです。

```ts
type TrimLeft<S extends string> = /** 先頭文字スペースか？ */ ? TrimLeft<L> : S
```

問題は先頭文字がスペースか判定し、残りも文字列を取得する条件部をどのように記述するかです。対象の型が配列であったのなら `[any, ...infer L]` のような形で取得できたのでしょうが今回の対象は文字列なのでそうはいきません。

このような文字列を型として操作したい場合には `Template Literal Types` の出番です。

以下のように `infer` と組み合わせて使えば「先頭がスペースある文字列」にマッチさせることができます。

```ts
type TrimLeft<S> = S extends ` ${infer L}` ? TrimLeft<L> : S;
```

しかし、この回答だと最後のテストをパスしません。`\n` や `\t` も取り除く必要があります。

条件部を「先頭文字が ` ` または `\n` または `\t`」のように OR 条件で判定する必要がありそうです。嬉しいことに、 `Template Literal Types` の補完（`${}`）にはユニオン型を使うこともできます。

以下の例のように補完にユニオン型が使われた場合にはユニオンによって取りうるすべての文字列のユニオン型として表現されます。

```ts
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
//  "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

課題に戻りましょう。同様に ` ` ・ `\n`  ・ `\t` のユニオン型を使用すれば先頭文字がいずれかの場合もマッチさせることができます。

## 回答例

```ts
type space = ' ' | '\n' | '\t'
type TrimLeft<S extends string> = S extends `${space}${infer L}` ? TrimLeft<L> : S
```

# Trim

> Implement `Trim<T>` which takes an exact string type and returns a new string with the whitespace from both ends removed.
> 
> For example
> 
> ```ts
> type trimed = Trim<'  Hello World  '> // expected to be 'Hello World'
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/108-medium-trim/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)

## 解説

TrimLeft を拡張して両側からスペースを削除できるようにします。TrimLeft のコードを再掲します。ここから始めましょう。

```ts
type space = ' ' | '\n' | '\t'
type Trim<S extends string> = S extends `${space}${infer L}` ? Trim<L> : S
```

ここでは初めに左側にスペースがあるか再帰的に検査して取り除きます。これ以上左側にスペースが存在しない状態まで進めたら `Conditional Types` の `false` 句へ入ります。そうしたら今度は右側にスペースがあるパターンでまた同じことをおこなえばよいです。回答例のように `Conditional Types` はネストして使用できます。

## 回答例

```ts
type space = ' ' | '\n' | '\t'
type Trim<S extends string> = S extends `${space}${infer R}` ? Trim<R> : S extends `${infer L}${space}` ? Trim<L> : S
```

# Replace

> Implement `Replace<S, From, To>` which replace the string `From` with `To` once in the given string `S`
> 
> For example
> 
> ```ts
> type replaced = Replace<'types are fun!', 'fun', 'awesome'> // expected to be 'types are awesome!'
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/116-medium-replace/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

## 解説

`Replace` を実装するには、まずは `From` でマッチする文字列をサーチする必要があります。

`Template Literal Types` を使えば特定の文字列にマッチさせることは造作もないです。

```ts
type Replace<S extends string, From extends string, To extends string> = S extends `${infer L}${From}${infer R}`
```

あとは文字列にマッチしたなら `From` を `To` にそのまま置き換えるだけでよさそうです。文字列にマッチしなかったら元の文字列をそのまま返します。

```ts
type Replace<S extends string, From extends string, To extends string> = S extends `${infer L}${From}${infer R}`  ? `${L}${To}${R}` : S
```

しかし、まだ 1 つのテストに失敗します。どうやら `From` に空文字 `''` が渡されると具合が悪いようです。ここは早期リターンのように `From` が空文字 `''` だった場合には早々に元の文字列を返してしまいましょう。

## 回答例

```ts
type Replace<S extends string, From extends string, To extends string> = From extends '' 
  ? S
  : S extends `${infer L}${From}${infer R}`  ? `${L}${To}${R}` : S
```

# ReplaceAll

> Implement `ReplaceAll<S, From, To>` which replace the all the substring `From` with `To` in the given string `S`
> 
> For example
> 
> ```ts
> type replaced = ReplaceAll<'t y p e s', ' ', ''> // expected to be 'types'
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/119-medium-replaceall/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)

## 解説

Replacehttps://zenn.dev/link/comments/3aa1315a72a7ba を元に考えてみましょう。`Replace` は 1 度文字列にマッチしたらその場で打ち切っていましたが `ReplaceAll` はすべての対象の文字列を置換する必要があります。

勘のいいほうならもうお分かりかもしれないですが、このような場合は再帰が使えます。

## 回答例

```ts
type ReplaceAll<S extends string, From extends string, To extends string> = From extends '' 
  ? S
  : S extends `${infer L}${From}${infer R}`  ? `${ReplaceAll<L, From, To>}${To}${ReplaceAll<R, From, To>}` : S
```

# Append Argument

> For given function type `Fn`, and any type `A` (any in this context means we don't restrict the type, and I don't have in > mind any type 😉) create a generic type which will take `Fn` as the first argument, `A` as the second, and will produce > function type `G` which will be the same as `Fn` but with appended argument `A` as a last one.
> 
> For example,
> 
> ```typescript
> type Fn = (a: number, b: string) => number
> 
> type Result = AppendArgument<Fn, boolean> 
> // expected be (a: number, b: string, x: boolean) => number
> ```
> 
> > This question is ported from the [original article](https://dev.to/macsikora/advanced-typescript-exercises-question-4-495c) > by [@maciejsikora](https://github.com/maciejsikora)

https://github.com/type-challenges/type-challenges/blob/master/questions/191-medium-append-argument/README.md

## 回答例

```ts
type AppendArgument<Fn, A> = Fn extends (...args: infer Args) => infer R ? (...args: [...Args, A]) => R : never
```

# Length of String

Compute the length of a string literal, which behaves like `String#length`.

https://github.com/type-challenges/type-challenges/blob/master/questions/298-medium-length-of-string/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)

## 解説

[Length of Tuple](https://github.com/type-challenges/type-challenges/blob/master/questions/18-easy-tuple-length/README.md) と似たような課題に見えますが、一筋縄にはいきません。`S['length']` は `number` を返します。

```ts
type LengthOfString<S extends string> = S['length']

LengthOfString<'kumiko'> //  number
```

どうにかして文字数を数える方法はないでしょうか？

考えられる手段として文字列を先頭から 1 つづつ取り出し再帰的に `LengthOfString` を呼び出し再帰が行われた回数を数えることができればよさそうです。

```ts
type LengthOfString<S extends string> = S extends `${infer F}${infer L}` ? LengthOfString<L> : S
```

問題はどのように再帰した回数を数えるかです。 型パラメーターにもう 1 つ `number` 型の形変数を加えてみるのはどうでしょう？初めはデフォルト引数として `0` を渡しておき、再帰として `LengthOfString` を呼び出すときには引数とで渡された値 + 1 して渡すと再帰した回数を数えられそうです。文字列の最後に達して再帰が終了したときには回数をカウントしていた型変数を返します。

```ts
type LengthOfString<S extends string, Count extends number = 0> = S extends `${infer F}${infer L}` 
  ? LengthOfString<L, Count + 1> 
  : Count
```

良い方法に思えたのですが、これではうまくいきません。型システム上では演算をすることはできないので `Count + 1` の部分が不正になります。

他にカウントできる方法はないでしょうか？そういえば `Length of Tuple` では配列の要素の数だけ `T['length']` が値を返すことを知ったのでした。これを使えばうまくいきそうです。つまり、再帰があるたびに配列の要素を 1 つづつ追加していき、文字列の最後に達したなら `T['length']`  を返せばよいのです。

## 回答例

```ts
type LengthOfString<S extends string, T extends readonly any[] = []> = S extends `${infer F}${infer L}` 
  ? LengthOfString<L, [...T, F]> 
  : T['length']
```

# Flatten

> In this challenge, you would need to write a type that takes an array and emitted the flatten array type.
> 
> For example:
> 
> ```ts
> type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/459-medium-flatten/README.md

## ヒント

- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)
- [Variadic Tuple Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html#variadic-tuple-types)

## 解説

配列にすべての要素を検査して配列の要素を平坦化して返します。そのために再帰処理を用いて、配列の要素を順に先頭から取り出していき処理を行います。まずはそこから記述しましょう。配列の先頭の要素と残りの要素を取得するには `[infer F, ...infer L]` と書けばよいです。

```ts
type Flatten<T extends any[]> = T extends [infer F, ...infer L]
  ? [F, ...Flatten<L>]
  : []
```

再帰処理の終了時には空の配列を返します。配列を平坦化するためには、配列のある要素が配列であった場合、その要素が配列でなくなるまで `Flatten` を再帰的に良い出せばよいです。配列の要素が配列かどうかは `F extends any[]` で判定します。

## 回答例

```ts
type Flatten<T extends any[]> = T extends [infer F, ...infer L]
 ? F extends any[] ? [...Flatten<F>, ...Flatten<L>] : [F, ...Flatten<L>]
 : []
```

# Append to object

> Implement a type that adds a new field to the interface. The type takes the three arguments. The output should be an object with the new field
> 
> For example
> 
> ```ts
> type Test = { id: '1' }
> type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/527-medium-append-to-object/README.md

## ヒント

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 解説

オブジェクトにプロパティを追加する方法として真っ先に思いつくのは交差型を使うことでしょうか？

```ts
type AppendToObject<T extends Record<string, unknown>, U extends string, V> = T & { [P in U]: V }
```

しかし、この回答はテストをパスしません。返される型を確認してみると、交差型として返されているいます。この課題では交差型を使わないでプロパティを追加する必要がありそうです。

```ts
type Result = AppendToObject<test1, 'home', boolean>

test1 & {
    home: boolean;
}
```

あるオブジェクト型から新しいオブジェクト型を生成するためには `Mapped Types` を使いましょう。まず第 1 引数のオブジェクト型をそのまま返すには以下のように記述します。

```ts
type AppendToObject<T extends Record<string, unknown>, U extends string, V> = {
  [P in keyof T]: T[P]
}
```

`Mapped Types` はオブジェクト型のプロパティを反復処理して型を生成します。オブジェクト型に新たなプロパティを追加するには反復処理するプロパティに第 2 引数の `U` を追加すればよいでしょう。ユニオン型を使用し `Mapped Types` の取りうるプロパティに追加します。

```ts
type AppendToObject<T extends Record<string, unknown>, U extends string, V> = {
  [P in keyof T | U]: T[P]
}
```

さらに、ここでは反復処理中の `P` が `U` 型だった場合にはオブジェクトの値の型として `V` を渡す必要があります。それ以外の場合なら `T` のオブジェクトのプロパティなのでそのまま `T[P]` を返します。

## 回答例

```ts
type AppendToObject<T extends Record<string, unknown>, U extends string, V> = {
  [P in keyof T | U]: P extends U ? V : T[P]
}
```

# Absolute

> Implement the `Absolute` type. A type that take string, number or bigint. The output should be a positive number string
> 
> For example
> 
> ```ts
> type Test = -100;
> type Result = Absolute<Test>; // expected to be "100"
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/529-medium-absolute/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

## 解説

まずは、符号の有無は考えず型引数の `number` を `string` に変換するところを考えてみましょう。これは `Template Literal Types` を使えば簡単です。

```ts
type Absolute<T extends number | string | bigint> = `${T}`
```

これで `<Absolute<10>, '10'>` や `Absolute<9_999n>, '9999'>` などの `-` 符号のついていないテストケースはパスします。

`-` 符号を取り除くためにはまず `string` に変換した `T` が先頭に `-` がついているある文字列にマッチするかどうかを検査します。`Template Literal Types` を使えば `-${infer R}` という形式で検査をできます。

条件に当てはまった場合には `-` を除いた残りの文字列である `R` を返しそうでないなら `string` に変換した `T` を返します。

## 回答例

```ts
type Absolute<T extends number | string | bigint> = `${T}` extends `-${infer R}` ? R : `${T}`
```

# String to Union

> Implement the String to Union type. Type take string argument. The output should be a union of input letters
> 
> For example
> 
> ```ts
> type Test = '123';
> type Result = StringToUnion<Test>; // expected to be "1" | "2" | "3"
> ```

https://github.com/type-challenges/type-challenges/blob/master/questions/531-medium-string-to-union/README.md

## ヒント

- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [iner](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [Recursive Conditional Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#recursive-conditional-types)

## 解説

文字列を先頭から 1 つづつ取り出して処理します。まずは再帰処理の下地を記述しましょう。

```ts
type StringToUnion<T extends string> = T extends `${infer L}${infer R}`
  ? StringToUnion<R> : /** 文字列を最後まで処理したら最終結果を返す */
```

文字列を最後まで処理したときにユニオン型を返す必要がありますが、どこかで取得した文字を保持する必要があります。Tuple to Union でタプル型はユニオン型に変換できることはわかっているので、タプルとして文字を保持しておけば良さそうです。

型システム上でなにか保持しておきたいときのパターンとして初めに空の配列をデフォルト引数を渡しておいて、再帰処理で呼び出すたびに要素を追加するという方法が使えます。

## 回答例

```ts
type StringToUnion<T extends string, U extends any[] = []> = T extends `${infer L}${infer R}`
  ? StringToUnion<R, [...U, L]> : U[number]
```

# Merge

> Merge two types into a new type. Keys of the second type overrides keys of the first type.

https://github.com/type-challenges/type-challenges/blob/master/questions/599-medium-merge/README.md

## ヒント

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

## 解説

Append to Object と同じ処理を行いましょう。

`F` のプロパティと `S` のプロパティを反復処理します。

```ts
type Merge<F extends Record<string, unknown>, S extends Record<string, unknown>> = {
  [P in keyof F | keyof S]: /** TODO */
};
```

反復処理の中で `P` が `T` のプロパティなら `F[P]` をそうでないなら `S[P]` を返すようにします。

```ts
type Merge<F extends Record<string, unknown>, S extends Record<string, unknown>> = {
  [P in keyof F | keyof S]: P extends keyof F ? F[P] : S[P] // Type 'P' cannot be used to index type 'S'.
};
```

しかしこれではコンパイルが通りません。さらに `P` が `S` のプロパティであるか検査する必要があります。

```ts
type Merge<F extends Record<string, unknown>, S extends Record<string, unknown>> = {
  [P in keyof F | keyof S]: P extends keyof F ? F[P] : P extends keyof S ? S[P] : never
};
```

これでうまくいっているように見えますが、テストケースは失敗します。どこが悪いのか生成された型を確認してみましょう。

```ts
type result = Merge<Foo, Bar>
type result = {
    a: number;
    b: string;
    c: boolean;
}
```

よく見るとプロパティ `b` は `Foo` と `Bar` どちらにも存在します。プロパティが重複する場合には 2 つ目の型のプロパティで上書きする必要があるので　`b` の型は `number` でなければいけません。

2 つ目の型のプロパティで上書きするようにするには、条件部で先に `S` が持つプロパティかどうかを検査する必要があります。

## 回答例

```ts
type Merge<F extends Record<string, unknown>, S extends Record<string, unknown>> = {
  [P in keyof F | keyof S]: P extends keyof S ? S[P] : P extends keyof F ? F[P]: never
};
```

