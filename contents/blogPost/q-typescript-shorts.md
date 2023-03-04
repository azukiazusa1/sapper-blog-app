---
id: GljjCNWnOW8sEgql7rCD6
title: "Q：TypeScript の関数の返り値の型を明示的に書かないのは犯罪ですか？#Shorts"
slug: "q-typescript-shorts"
about: "TypeScript において関数の返り値の型は推論させることは可能ですが、これはコードベース全体に意図しない型の変更による影響が広がる可能性があります。"
createdAt: "2022-02-13T00:00+09:00"
updatedAt: "2022-02-13T00:00+09:00"
tags: ["TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6zTzB66mCu7Oi65BeJO0Nh/c9a64c4494dde084026cbfa28fa0d044/__________________________3_.png"
  title: "typescript"
published: true
---
質問来てた👉。

Q：TypeScript の関数の返り値の型を明示的に書かないのは犯罪ですか？

結論：犯罪にはならないが可能な限り返り値の型を書いておいたほうがいい。

```ts
const subtraction = (a: number, b: number): number => {
  return a - b
}
```

TypeScript において関数の返り値の型は推論させることは可能ですが、これはコードベース全体に意図しない型の変更による影響が広がる可能性があります。

---

## TypeScript の型推論

TypeScript は世の中の静的型付け言語と同じく型推論を備えています。型推論により私たちプログラマーは明示的に型を明示的に書かなくてもコンパイラが型を推測して理解してくれます。

```ts
let foo = 1

// number 型に推論されている
foo
// ^? let foo number

// number に推論されているので string 型を代入できないことをコンパイラが理解している
foo = 'string' // Type 'string' is not assignable to type 'number'.
```

上記の例のように、人間の目から見ても明らかに `number` 型が代入されていることがわかるような場合にはわざわざ `let foo: number = 1` のように型注釈をつけることは冗長ですので基本的には型推論に任せて書かれます。

特に `string`, `number`, `boolean` のようなプリミティブな値を `const` を用いて宣言するような場合にはプログラマーがでしゃばらず型推論に任せるのがよりよいです。`const` で変数が宣言された場合にはコンパイラは変数の値が決して変更されないことを知っているため、`string` のようなプリミティブ型ではなくより狭い型であるリテラル型として推論してくれるためです。

`const` で変数を宣言する際に代入される型のスーパタイプを型注釈としてつけることは可能なのですがそのようにあえてより広い型を宣言する必要もないでしょう。

```ts
// 型推論い任せる
const color1 = 'red'
// 型注釈を書く
const color2: string = = 'blue'

color1
// ^? const color1: red
color2
// ^? const color2: string
```

さて、この記事の本題である関数の返り値の型の話に戻りましょう。関数型の推論についてです。

基本的な事項としては関数の引数の型は推論ができず型注釈を書かない場合にはコンパイルエラーとなり[^1]、関数の返り値の型については推論可能なため省略をできます。

[^1]: `noImplicitAny` を有効にしている場合

以下の例では `+` 演算子の両オペランドが `number` 型であることがわかっているので返り値の方は `number` 型に推論されます。

```ts
const add = (a: number, b: number) => {
    return a + b
}

add
// ^? const add: (a: number, b: number): number
```

また関数が具体的な値を返すような場合には `const` によって変数を宣言した場合と同じようにリテラル型として推論されます。以下の例では関数が `'black'` または `'white'` という値しか返さないことがコンパイラにはわかっているので `'dark' | 'white'` というユニオン型に推論されます。

```ts
const backgroundColor = (isDarkMode: boolean) => {
    if (isDarkMode) {
        return 'black'
    } else {
        return 'white'
    }
}

backgroundColor
// ^? const backgroundColor: (isDarkMode: boolean) => 'black' | 'white'
```

今までの例を眺めてみると関数の返り値の型もまた `const` 変数を宣言するときのように私たちよりも賢いコンパイラに任せてしまったほうよいようにも感じます。しかしながら関数の返り値の型の場合には以下の 2 つの理由から型注釈を付与するのがよいと考えます。

- 関数の返り値の型は一見判断しづらい
- 型注釈がある場合代入可能か検査される

## 関数の返り値の型は一見判断しづらい

例えば　`const ONE = 1` は `1` というリテラル型またはそのスーパタイプである `number` 型であるという事実は明らかです。一方で、関数の返り値の型を確認するたには関数内部の実装を確認する必要があり、関数内部の複雑性に比例して認知負荷が高まります。

このように関数の利用者が関数の実装の内部に立ち入らなければいけないのはモジュール化の観点から好ましくはありません。ここで、関数の返り値の型に対して型注釈が付与されているならば一瞥するだけで関数の入力と出力の型を確認できます。

```ts
// 関数の利用者は srting 型の userId を渡せば User 型が返されることがわかる
const fetchUser = (userId: string): User => {
    // complex tasks...
}
```

## 型注釈がある場合代入可能か検査される

実際、1 つ目の理由だけであるなら VSCode などのエディタを使用していればそこまで大きなデメリットにはならないでしょう。2 つ目の理由として関数の作成者の立場から**関数のインターフェイスを守らせる**という目的で型注釈をつけるべきだと考えます。

TypeScript において変数の型に型注釈がある場合にはコンパイラによってその変数に代入可能か検査されます。任意の型 `T` に型が代入できる条件は型 `T` そのものであるかまたはそのサブタイプである必要があります。（これを共変性と呼びます）具体的には型 `number` に対してそのサブタイプである `16` や `20` は代入可能ですが `string` 型を代入することはできません。反対に型 `16` に対してそのスーパータイプである `number` は代入することはできません。

![スクリーンショット 2022-02-13 10.54.03](//images.ctfassets.net/in6v9lxmm5c8/7xrns3DLYwYDwHxAVS0JDN/9aed002036e6ecd26ef78e064660cf77/____________________________2022-02-13_10.54.03.png)

型検査が実施される際にはまず右辺の方が推論されます。以下の例の `num2` では右辺の型がまず `16` 型に推論されます。左辺の型は `number` 型に注釈されていますが先の説明で述べたとおりに `16` 型は `number` 型のサブタイプであるのでこれは代入可能であると判定するわけです。

```ts
let num: number = 0

const num1: number = num // ok
const num2: number = 16 // ok
const num3: number = 20 // ok
const num4: number = 'i am string' // Type 'string' is not assignable to type 'number'.

const num5: 16 = num // Type 'number' is not assignable to type '16'.
```

### 関数の返り値の型注釈があればコンパイルエラーを1箇所に防げる

型注釈のよる型検査は関数の返り値の型に注釈をつけた際にも実施されます。以下の例では `number` 型に注釈を付けているのにも関わらず `string` 型を返しているためコンパイルエラーとなります。

```ts
const fn = (a: number): number => {
    return '1' // Type 'string' is not assignable to type 'number'.
}
```

これはすなわち**あらかじめ定められていた関数のインターフェイスを破ろうしたときの防御札**として利用できます。

例えば以下の関数 `substraction` は `number` 型の引数を 2 つ受け取り `number` 型を返すというインターフェイスを公開しており、この関数の利用者は必ず `number` 型が返されることを期待して利用しています。

```ts
export const subtraction = (a: number, b: number) => {
    return a - b
}

subtraction
// ^? const subtraction: (a: number, b: number): number

const result = subtraction(4, 2)

result.toFixed()
```

その後 `substraction` 関数に修正が入り計算結果が 0 未満であった場合には `null` を返すように修正しました。[^2]

[^2]: 型のインターフェイス以前に実装自体が変わってしまっているじゃないかというツッコミはとりあえずスルーして

```diff
 export const subtraction = (a: number, b: number) => {
-    return a - b
+    const result = a - b
+    if (result > 0) {
+        return result
+    } else {
+        return null
+    }
- }

subtraction
// ^? const subtraction: (a: number, b: number): number | null
```

この修正を実施したことにより関数の返り値の型が `number` から `number | null` に思わぬ形で変更となってしまいました。この変更により影響を受けてしますのは**関数の宣言した箇所ではなく関数を利用している箇所です。**

```ts
const result = subtraction(4, 2)

result.toFixed() // Object is possibly 'null'.(2
```

上記例のように関数の宣言した箇所と利用している箇所が近い場所にあるならば影響もさほど大きくないのでしょうが、実際汎用的な関数は複数のファイルをまたいで利用されることはめずらしくはありません。100 箇所で関数が利用されていた場合には 100 箇所のファイルを修正しなければいけません。

この例で問題となったのは関数の実装を修正した箇所において返り値の型を変更してしまったことに気づくことができなかったことです。今回の例ではシンプルな実装ですが、もう少し複雑な関数の実装を修正使用とするとこのような事例はめずらしくはないでしょう。

ここで関数の返り値の型注釈を付与することにより返り値の型が適切かどうか関数を宣言した箇所においてコンパイルエラーを報告させることができます。

```ts
export const subtraction = (a: number, b: number) : number => {
    const result = a - b
    if (result > 0) {
        return result
    } else {
        return null // Type 'null' is not assignable to type 'number'.
    }
}
```

## 型注釈を書かないほうが好ましいパターン

関数の返り値の型注釈を付与することの利点を述べてまいりましたが、必ずしもすべての関数に対して型注釈を付与するべきではなく、むしろ型注釈を付与することが冗長となってしまうケースも存在します。

このような例外が存在するケース式の型が文脈により決定されるケースです。これは [Contextual Typing
](https://www.typescriptlang.org/docs/handbook/type-inference.html#contextual-typing) と呼ばれます。

具体例を見ていきましょう。例えば [Array#sort](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) は引数にコールバック関数を受け取ることができますがその関数の引数・返り値の型は Array#sort によってすでに決定されています。

```ts
Array<T>.sort(compareFn?: ((a: T, b: T) => number) | undefined): T[]
```

ここでは　Array#sort の第一引数に渡される型は `compareFn` 型に合致する必要があるという情報が存在しています。そのため `Contextual Typing` により型注釈がなくとも関数の引数と返り値の型を推論できます。

```ts
const array = [1, 2, 3]

array.sort((a, b) => a - b) // 型注釈は不要
array.sort((a, b) => 'test') // 推論結果に対して代入不可の場合にはコンパイルエラー
// Argument of type '(a: number, b: number) => string' is not assignable to parameter of type '(a: number, b: number) => number'.
//  Type 'string' is not assignable to type 'number'.

array.sort((a: number, b: number): number => a - b) // あえて型注釈を書いても良いが冗長
```

これは以下のように代入しようとする変数に関数型の注釈を付与したときも同様です。

```ts
type Fn = (a: number, b: number) => number

const add: Fn = (a, b) => a + b
```

## おまけ

- もしプロジェクトのルールとして関数の返り値の型注釈を強制したい場合には eslint ルールの [explicit-function-return-type](https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/packages/eslint-plugin/docs/rules/explicit-function-return-type.md) を有効にしましょう。
- Google の TypeScript のスタイルガイドでは関数の返り値の型注釈の 2 つの利点を上げているものの、その判断はコードの作成者に委ねられるようです

> Whether to include return type annotations for functions and methods is up to the code author. Reviewers may ask for annotations to clarify complex return types that are hard to understand. Projects may have a local policy to always require return types, but this is not a general TypeScript style requirement.
> 
> There are two benefits to explicitly typing out the implicit return values of functions and methods:
> 
> - More precise documentation to benefit readers of the code.
> - Surface potential type errors faster in the future if there are code changes that change the return type of the function.

https://google.github.io/styleguide/tsguide.html#return-types

## まとめ

- 型注釈がある場合その型に代入可能か検査される
- 型注釈による検査によって関数のインターフェイスを維持させる

ほかにも知りたいことがあったらコメント欄で教えて👇。
