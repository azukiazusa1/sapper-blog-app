---
id: Hi-ycHAuOeaC2kB-aAz6B
title: "TypeScript で網羅性をチェックする"
slug: "exhaustive-checks-in-typescript"
about: "パターンマッチを備えている言語では、コンパイル時に網羅性が検査され、網羅的でない場合にはコンパイルエラーとなります。例えば Rust では match 式は網羅性を検査します。列挙型が取りうる値をすべて網羅していない場合にはコンパイルエラーとなります。TypeScript にはパターンマッチがないため、網羅性の検査は行われません。ですが、TypeScript では `never` 型を利用することで網羅性の検査を行うことができます。"
createdAt: "2023-03-11T14:37+09:00"
updatedAt: "2023-03-11T14:37+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5J9CZJmXmgGyZGgWhHTRg7/94c94bbfbbfd9a56715a2df5c36a7d62/_Pngtree_japanese_temple_2751470.png"
  title: "—Pngtree—japanese temple_2751470.png"
selfAssessment: null
published: true
---
パターンマッチを備えている言語では、コンパイル時に網羅性が検査され、網羅的でない場合にはコンパイルエラーとなります。例えば Rust では match 式は網羅性を検査します。列挙型が取りうる値をすべて網羅していない場合にはコンパイルエラーとなります。

```rust:srv/main.rs
enum Color {
    Red,
    Blue,
    Green,
}

fn main() {
    let color = Color::Red;
    match color {
        Color::Red => println!("red"),
        Color::Blue => println!("blue"),
    }
}
```

上記のコード例では `Color:Green` の場合のケースが抜けているため、コンパイルエラーとなります。

```bash
error[E0004]: non-exhaustive patterns: `Color::Green` not covered
 --> src/main.rs:9:11
  |
9 |     match color {
  |           ^^^^^ pattern `Color::Green` not covered
  |
```

このようにコンパイル時に潜在的なバグを検出できるので、大変有益です。例えば `enum` に新たな値を追加する際などは、`enum` を使用しているすべての箇所に新たな値を追加する必要があるでしょう。このような場合にはケースの追加漏れが発生しやすい作業ですが、コンパイラが検出してくれるので、安心して作業を進めることができます。

TypeScript にはパターンマッチがないため、網羅性の検査は行われません。ですが、TypeScript では `never` 型を利用することで網羅性の検査を行うことができます。

## `never` 型を使用した網羅性の検査

TypeScript の `never` 型は決して起こり得ない値を表現する型です。`never` 型はデータフロー解析を行う際に出現します。例えば、以下の例を見てください。

```typescript
const fn = (x: string | number) => {
  x // string | number
  if (typeof x === "string") {
    x // string
  } else if (typeof x === "number") {
    x // number
  } else {
    x // never
  }
}
```

関数 `fn` は `string` または `number` を引数に取ります。関数内では `typeof` 演算子を使用して `x` の型を判定しています。

`typeof x === "string"` という条件式が `true` となる場合、条件ブロック内に存在する値は `string` 型以外にはなり得ません。TypeScript は制御フロー解析により、このことを理解しているため `x` の型は `string` と判断されます。`typeof x === "number"` という条件式が `true` となる場合も同様です。ここでは `x` の型が `number` と判断されます。

さて、最後の `else` 句のブロック内では `x` の型はどうなるのでしょうか？`x` の取りうる型は `string` か `number` です。しかし、前の条件式により `string` である可能性と `number` である可能性は否定されています。

つまり、この `else` 句に到達することは決してありえないのです。このような場合、`x` の型は `never` となります。


決して到達し得ないブロックでは `never` 型になることを利用して、網羅性の検査を行うことができます。以下の例を見てください。`Color` 型は `Red`,`Blue`,`Green` のユニオン型です。

```typescript
type Color = "Red" | "Blue" | "Green"

const printColor = (color: Color) => {
  switch (color) {
    case "Red":
      return "red"
    case "Blue":
      return "blue"
    case "Green":
      return "green"
    default:
      const _exhaustiveCheck: never = color
      throw new Error("unreachable:" + _exhaustiveCheck)
  }
}
```

上記の例では `Red`,`Bule`,`Green` すべての `case` を網羅し `return` しています。そのため、`default` 句に到達することはありません。つまり、`default` 句に到達した場合は `never` 型になるはずですので、`never` 型の変数に代入できるはずです。

このように絶対に到達し得ないブロック内で `never` 型であること検査することでコンパイラ時に網羅性の検査を行えます。試しに、`Color` 型に `Yellow` を追加してみましょう。

```typescript
type Color = "Red" | "Blue" | "Green" | "Yellow"

const printColor = (color: Color) => {
  switch (color) {
    case "Red":
      return "red"
    case "Blue":
      return "blue"
    case "Green":
      return "green"
    default:
      // Type 'string' is not assignable to type 'never'.
      const _exhaustiveCheck: never = color // 
      throw new Error("unreachable:" + _exhaustiveCheck)
  }
}
```

`Yellow` を `Color` 型に追加したことで `Type 'string' is not assignable to type 'never'.` というエラーが発生しました。`Yellow` の `case` を追加していないため、`default` 句に `Yellow` 型が到達する可能性がありうるようになったためです。

`Yellow` 型は `never` 型に代入できないため、コンパイルエラーとなります。これにより、コンパイラ時に網羅性の検査が行われていることがわかります。

この例では `never` 型の変数に代入することで網羅性の検査を行っていますが、他にもいくつかのパターンがあります。

- `never` 型の変数に代入する
- `never` 型の引数を受け取る関数を呼び出す
- `never` 型を受け取るカスタムエラーを投げる
- `satisfies` 演算子で `never` 型を検査する

### `never` 型の引数を受け取る関数を呼び出す

```typescript
type Color = "Red" | "Blue" | "Green" | "Yellow"

const assertNever = (x: never): never => {
  throw new Error("unreachable:" + x)
}

const printColor = (color: Color) => {
  switch (color) {
    case "Red":
      return "red"
    case "Blue":
      return "blue"
    case "Green":
      return "green"
    default:
      // Argument of type 'string' is not assignable to parameter of type 'never'
      return assertNever(color)
  }
}
```

### `never` 型を受け取るカスタムエラーを投げる

```typescript
type Color = "Red" | "Blue" | "Green" | "Yellow"

class CustomError extends Error {
  constructor(x: never) {
    super()
    this.name = "CustomError"
    this.message = "unreachable:" + x
  }
}

const printColor = (color: Color) => {
  switch (color) {
    case "Red":
      return "red"
    case "Blue":
      return "blue"
    case "Green":
      return "green"
    default:
      // Argument of type 'string' is not assignable to parameter of type 'never'
      throw new CustomError(color)
  }
}
```

### `satisfies` 演算子で `never` 型を検査する

```typescript
type Color = "Red" | "Blue" | "Green" | "Yellow"

const printColor = (color: Color) => {
  switch (color) {
    case "Red":
      return "red"
    case "Blue":
      return "blue"
    case "Green":
      return "green"
    default:
      // Type 'string' does not satisfy the expected type 'never'
      throw new Error(color satisfies never)
  }
}
```

## まとめ

- 決して到達し得ないブロック内で `never` 型であること検査することでコンパイラ時に網羅性の検査を行える
