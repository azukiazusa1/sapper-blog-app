---
id: 1yBTTmMT3SNtOaL8FywbmX
title: "【TypeScript】Zod でスキーマ宣言とバリデーションを実施する"
slug: "schema-declaration-and-validation-in-zod"
about: "[Zod](https://github.com/colinhacks/zod) は TypeScript first でスキーマ宣言とバリデーションを実施するためのライブラリです。  一度バリデータを宣言すれば、Zod が自動的に TypeScript の型を推論してくれるという特徴があります。このおかげで重複した型宣言を排除できます。  また、Zod はエコシステムも多く存在しており、OpenApi、Nest.js、Prisma、react-hook-form などと組み合わせて使うことができます。"
createdAt: "2022-07-03T00:00+09:00"
updatedAt: "2022-07-03T00:00+09:00"
tags: ["TypeScript"]
published: true
---
[Zod](https://github.com/colinhacks/zod) は TypeScript first でスキーマ宣言とバリデーションを実施するためのライブラリです。

一度バリデータを宣言すれば、Zod が自動的に TypeScript の型を推論してくれるという特徴があります。このおかげで重複した型宣言を排除できます。

また、Zod はエコシステムも多く存在しており、OpenApi、Nest.js、Prisma、react-hook-form などと組み合わせて使うことができます。

https://github.com/colinhacks/zod#ecosystem

## 簡単な使い方

まずは１番簡単な使い方から見ていきましょう。Zod は TypeScript 4.1 以上が必要です。また、`strict` モードを有効にする必要があります。

```json
// tsconfig.json
{
  // ...
  "compilerOptions": {
    // ...
    "strict": true
  }
}
```

以下のコマンドで Zod をインストールします。

```
npm install zod       # npm
yarn add zod          # yarn
pnpm add zod          # pnpm
```

１番簡単な `string` 型のスキーマを定義します。

```ts
import { z, ZodError } from 'zod' // ①

const usernameSchema = z.string() // ②
type Username = z.infer<typeof usernameSchema> // ③
// type Username = string

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest

  it('should work', () => {
    expect(usernameSchema.parse('john')).toBe('john') // ④
  })

  it('should fail', () => {
    expect(() => usernameSchema.parse(1)).toThrow(ZodError) // ⑤
  })
}
```

① `zod` モジュールから `z` をインポートします。`z` はスキーマを定義するための関数を持っています。

② `z.string()` 関数でスキーマを宣言します。`z.string()` は名前のとおり `string` 型のスキーマを作成します。

③ `z.infer` の型引数に宣言したスキーマを渡すことでスキーマから TypeScript の型を生成することができます。`usernameSchema` は `string` 型のスキーマなので `string` 型に推論されます。

④ 定義したスキーマの使い方をテストしています。`usernameSchema.parse()` 関数を使うことで値を検証できます。ここでは　`'john'` という `string` 型の値を渡しているのでバリデーションをパスしてそのまま値が返されます。

⑤ 続いて `usernameSchema.parse()` 関数に `1` を渡しています。`usernameSchema` には `string` 型が期待されていますが、実際には `number` 型が渡されているため `ZodError` が例外として投げられます。

また、`usernameSchema.scheme()` で返される値の型は `string` 型となるので `unkown` 型を安全に使用することができます。

```ts
const toUpper = (value: unknown): stirng => {
  try {
    // 
    const username = usernameSchema.parse(value) 
    // const username: string
    return username.toUpperCase()
  } catch (e) {
    if (e instanceof ZodError) {
      console.log(e.message)
    }
    throw e
  }
}
```

## 詳細なバリデーション

それぞれのプリミティブ型に合わせて、もう少し詳細なバリデーションを定義することができます。例えば `z.string().max()` や `z.string().min()` は文字列の長さを検証したり、`z.number.positive()` は `0` より大きい値であることを検証します。

また、`{ message: '...' }` オプションを引数に渡すことで、エラーメッセージをカスタマイズすることができます。

```ts
import { z, ZodError } from 'zod'

const usernameSchema = z.string()
  .min(3, { message: 'Username must be at least 3 characters' })
  .max(20, { message: 'Username must be at most 20 characters' })

const ageSchema = z.number()
  .nonnegative({ message: 'Age must be non-negative' })

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest

  test('invalid username', () => {
    expect(() => usernameSchema.parse('hi')).toThrow('Username must be at least 3 characters')
    expect(() => usernameSchema.parse('a'.repeat(21))).throws('Username must be at most 20 characters')
  })
  test('valid username', () => {
    expect(usernameSchema.parse('hello')).toEqual('hello')
  })

  test('invalid age', () => {
    expect(() => ageSchema.parse(-1)).toThrow('Age must be non-negative')
  })
  test('valid age', () => {
    expect(ageSchema.parse(1)).toEqual(1)
  })
}
```

## API のレスポンスの値を検証する

もう少し実践的な例を見ていきましょう。普段 `fetch API` や `axios` など HTTP クライアントを使用するときは API が返すレスポンスを信頼して型を付けることが多いかと思います。ただし、実際にスキーマどおりのレスポンスが返却されるかどうかはランタイムになってみないとわかりません。期待されたスキーマのレスポンスが返って来ないことを考えるとゾッとしますよね・[^1]

API のレスポンスのスキーマを `Zod` で作成し検証も実行できるようにしてみましょう。`z.object` でオブジェクト型のスキーマを宣言できます。

```ts
import { z, ZodError } from 'zod'

const TodoSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  completed: z.boolean(),
})
type Todo = z.infer<typeof TodoSchema>
// type Todo = {
//   id: number;
//   userId: number;
//   title: string;
//   completed: boolean;
// }

const TodoResponseSchema = z.array(TodoSchema)
type TodoResponse = z.infer<typeof TodoResponseSchema>
// type TodoResponse = {
//   id: number;
//   userId: number;
//   title: string;
//   completed: boolean;
// }[]

const fetchTodos = async (): Promise<TodoResponse> => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos')
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
    }
    const json = await response.json()
    // const json: any

    const todos = TodoResponseSchema.parse(json)
    // const todos: {
    //   id: number;
    //   userId: number;
    //   title: string;
    //   completed: boolean;
    // }[]

    return todos
  } catch (e) {
    if (e instanceof ZodError) {
      // handlel validation error
    }
    throw e
  }
}
```

`fetch` のレスポンスにバリデーションを実施した上で型を付けることができるので、`res.json() as TodoResponse` のように API を信頼して型を付けるよりはるかに安全に使用することができます。

また TypeScript の型を Zod のスキーマから生成できるので、重複したコードを書いたりバリデーションをと型情報の整合性が取れないといったことが発生することがありません。

[^1]: Zod だけにね

