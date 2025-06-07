---
id: L2mS9OWG1OOUjIfqqEjZo
title: "スキーマバリデーションライブラリの標準インターフェース standard-schema"
slug: "schema-validation-library-standard-interface-standard-schema"
about: "スキーマバリデーションライブラリはここ数年で人気を集めています。多くのライブラリが登場する中で、standard-schema はスキーマバリデーションライブラリの標準インターフェースを提供します。これにより、エコシステムツールがユーザー定義の型検証ツールをより簡単に受け入れられるようにすることを目指しています。"
createdAt: "2025-02-15T10:03+09:00"
updatedAt: "2025-02-15T10:03+09:00"
tags: ["TypeScript", "standard-schema", "Zod"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5yEMyHee08BxW88Gl44V3b/08e17d7594b2f7ffb74d20f9a70979a3/Japanese-castle_6153-768x728.png"
  title: "日本のお城のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`StandardSchemaV1` インターフェイスの [~standard].validate() メソッドの結果の成否はどのように判定されるか？"
      answers:
        - text: ".result プロパティが `true` であればバリデーション成功、`false` であればバリデーション失敗"
          correct: false
          explanation: null
        - text: ".issues プロパティが存在しない場合はバリデーション成功、存在する場合はバリデーション失敗"
          correct: true
          explanation: null
        - text: ".error プロパティが存在しない場合はバリデーション成功、存在する場合はバリデーション失敗"
          correct: false
          explanation: null
        - text: "Error オブジェクトがスローされない場合はバリデーション成功、スローされる場合はバリデーション失敗"
          correct: false
          explanation: null
published: true
---
[Zod](https://zod.dev/) や [valibot](https://valibot.dev/), [ArkType](https://arktype.io/) などを代表とするスキーマバリデーションライブラリはここ数年で人気を集めています。これらのライブラリは TypeScript の型システムを活用してスキーマを定義し、それに基づいてバリデーションを行います。バリデーションを行った結果は型安全に扱うことができるのが特徴です。

ユーザー入力のように外部からのデータを安全に扱いたいような場面では、スキーマバリデーションライブラリは非常に有用です。Next.js の Server Actions ではクライアントから直接関数を呼び出せるような API となっています。しかし、実際にはクライアントからは任意のデータをサーバーに送信できるようになっており、引数の型どおりのデータが送信されるとは限りません。そのため Server Actions の関数内ではスキーマバリデーションライブラリを用いてバリデーションを行うプラクティスが推奨されています。

このようにスキーマバリデーションライブラリを使用したバリデーションの重要性はますます高まっています。また Zod は React Hook Form, Hono, OpenAI など幅広いライブラリとのインテグレーションが進んでおり、スキーマバリデーションライブラリとしての地位を確立しています。Zod を後追いする形でより軽量であることを謳う valibot や簡潔な API を提供する ArkType なども登場してきており、スキーマバリデーションライブラリの選択肢も増えています。

このような状況の中、スキーマバリデーションライブラリの標準インターフェースとして standard-schema が提案されました。standard-schema はスキーマバリデーションライブラリの開発者が共通のインターフェースを提供することで、エコシステムツールがユーザー定義の型検証ツールをより簡単に受け入れられるようにすることを目指しています。

https://github.com/standard-schema/standard-schema?tab=readme-ov-file

## standard-schema のインターフェイス

standard-schema のインターフェイスは TypeScript の `StandardSchemaV1` interface として定義されています。スキーマバリデーションライブラリの開発者はこのインターフェイスを実装することで standard-schema に準拠したライブラリを作成できます。

`StandardSchemaV1` は `@standard-schema/spec` パッケージをインストールすることで利用できます。

```bash
npm install @standard-schema/spec
```

`StandardSchemaV1` は以下のように定義されています。

```ts
interface StandardSchemaV1<Input = unknown, Output = Input> {
  /** The Standard Schema properties. */
  readonly "~standard": StandardSchemaV1.Props<Input, Output>;
}
declare namespace StandardSchemaV1 {
  /** The Standard Schema properties interface. */
  export interface Props<Input = unknown, Output = Input> {
    /** The version number of the standard. */
    readonly version: 1;
    /** The vendor name of the schema library. */
    readonly vendor: string;
    /** Validates unknown input values. */
    readonly validate: (
      value: unknown,
    ) => Result<Output> | Promise<Result<Output>>;
    /** Inferred types associated with the schema. */
    readonly types?: Types<Input, Output> | undefined;
  }
  /** The result interface of the validate function. */
  export type Result<Output> = SuccessResult<Output> | FailureResult;
  /** The result interface if validation succeeds. */
  export interface SuccessResult<Output> {
    /** The typed output value. */
    readonly value: Output;
    /** The non-existent issues. */
    readonly issues?: undefined;
  }
  /** The result interface if validation fails. */
  export interface FailureResult {
    /** The issues of failed validation. */
    readonly issues: ReadonlyArray<Issue>;
  }
  /** The issue interface of the failure output. */
  export interface Issue {
    /** The error message of the issue. */
    readonly message: string;
    /** The path of the issue, if any. */
    readonly path?: ReadonlyArray<PropertyKey | PathSegment> | undefined;
  }
  /** The path segment interface of the issue. */
  export interface PathSegment {
    /** The key representing a path segment. */
    readonly key: PropertyKey;
  }
  /** The Standard Schema types interface. */
  export interface Types<Input = unknown, Output = Input> {
    /** The input type of the schema. */
    readonly input: Input;
    /** The output type of the schema. */
    readonly output: Output;
  }
  /** Infers the input type of a Standard Schema. */
  export type InferInput<Schema extends StandardSchemaV1> = NonNullable<
    Schema["~standard"]["types"]
  >["input"];
  /** Infers the output type of a Standard Schema. */
  export type InferOutput<Schema extends StandardSchemaV1> = NonNullable<
    Schema["~standard"]["types"]
  >["output"];
  export {};
}
```

-> `~standard` キーのプレフィックスに `~` が使われているのは既存の API との衝突を避けるためです。`~` は辞書順で最も後ろに位置する文字であるため、VS Code などの補完機能で優先順位が下がるようになっています。

実際に `StandardSchemaV1` を実装するしたバリデーションライブラリを作ってみましょう。`string` 型であることを検証する `isString` 関数を実装します。

```ts
// 追加のバリデーションオプション
// これは StandardSchemaV1 とは無関係で、ライブラリの独自のオプションとして定義している
type Options = {
  minLength?: number;
  maxLength?: number;
};
function isString({
  minLength = undefined,
  maxLength = undefined,
  // StandardSchemaV1 の型引数には検証対象の型を指定する
}: Options = {}): StandardSchemaV1<string> {
  return {
    "~standard": {
      version: 1,
      // ライブラリの名前を指定する
      vendor: "my-vendor",
      // スキーマの検証を行う関数
      // Promise を返すこともできるが、どうしても必要な場合を除き非同期でのバリデーションは避けることが推奨される
      validate: (value: unknown) => {
        if (typeof value !== "string") {
          return {
            // 検証に失敗した場合には issues フィールドを返す
            // バリデーションライブラリを利用する側は issues フィールドが存在する場合はエラーとして扱う
            issues: [{ message: "Value is not a string" }],
          };
        }

        if (minLength !== undefined && value.length < minLength) {
          return {
            issues: [{ message: `Value is too short` }],
          };
        }

        if (maxLength !== undefined && value.length > maxLength) {
          return {
            issues: [{ message: `Value is too long` }],
          };
        }

        // 検証に成功した場合には value フィールドを返す
        return { value };
      },
    },
  };
}

// 使用例
const schema = isString({ minLength: 3, maxLength: 10 });
const result = schema["~standard"].validate("hello");

// issues フィールドが存在する場合はバリデーションエラー
if ("issues" in result) {
  console.error(result.issues);
} else {
  // issues フィールドが存在しない場合はバリデーション成功していて安全に値を取り出せる
  console.log(result.value);
}
```

## standard-schema の利用例

続いて、standard-schema を利用する側のコードを見ていきましょう。パラメータの検証を行いたいバックエンドフレームワークやフォームライブラリが standard-schema を利用することを想定しています。

例えばスキーマを引数に取り、そのスキーマに従って値を検証する関数は以下のように実装できます。

```ts
export async function standardValidate<T extends StandardSchemaV1>(
  schema: T,
  input: unknown,
): Promise<StandardSchemaV1.InferOutput<T>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;

  // `issues` フィールドが存在する場合はエラーとして扱う
  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, null, 2));
  }

  return result.value;
}
```

この関数を利用することで、先程自作した `isString` 関数を含めさまざまなライブラリのスキーマで検証を行うことができます。

```ts
import { z } from "zod";
import * as v from "valibot";
import { type } from "arktype";

const myVendorResult = await standardValidate(isString(), "hello");
const zodResult = await standardValidate(z.string(), "hello");
const valibotResult = await standardValidate(v.string(), "hello");
const arktypeResult = await standardValidate(type("string"), "hello");
```

## まとめ

- standard-schema はスキーマバリデーションライブラリの標準インターフェースを提供することでエコシステムツールの開発を容易にすることを目指している
- `StandardSchemaV1` インターフェースはスキーマバリデーションライブラリの開発者が実装することで standard-schema に準拠したライブラリを作成することができる
- standard-schema を利用する側は `schema["~standard"].validate` メソッドを呼び出すことでスキーマに従ったバリデーションを行うこできる standard とができる。バリデーションの成否は `issues` フィールドの有無で判定する

## 参考

- [standard-schema](https://github.com/standard-schema/standard-schema)
