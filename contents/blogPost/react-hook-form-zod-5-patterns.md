---
id: 1gInemylx3oblhAYMWOT06
title: "React Hook Form で Zod を使う時の 5 つパターン"
slug: "react-hook-form-zod-5-patterns"
about: "React Hook Form で Zod を使用する時によくあるバリデーションのパターンを 5 つ紹介します"
createdAt: "2023-02-12T00:00+09:00"
updatedAt: "2023-02-12T00:00+09:00"
tags: ["TypeScript", "Zod"]
published: true
---
## 非同期バリデーション

email の重複チェックを行う場合には API に問い合わせる必要があるので、非同期でバリデーションをすることになるかと思います。

[refine()](https://zod.dev/?id=refine) メソッドはカスタムバリデーションロジックを提供するためのメソッドです。`refine` メソッドの第 1 引数には `boolean` を返すバリデーター関数を受け取ります、このバリデーター関数は Promise を返すことができるため、手軽に非同期のバリデーションを実施できます。

```ts:validation.ts
import { z } from "zod";
import { isUniqueEmail } from "./api";

export const UserSchema = z.object({
  name: z.string(),
  email: z.string().email().refine(isUniqueEmail, {
    message: "Email is already taken",
  }),
});

export type UserSchemaType = z.infer<typeof UserSchema>;
```

```ts:api.ts
const emails = ["test1@example.com", "test2@example.com", "test3@example.com"];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const cache = new Map<string, boolean>();

export const isUniqueEmail = async (email: string) => {
  if (!email) return true

  if (cache.has(email)) {
    return cache.get(email);
  }

  await delay(1000);
  const isUnique = !emails.includes(email);
  cache.set(email, isUnique);
  return isUnique;
};
```

以下のようにフォームを組み立てることができます。メールアドレスの重複チェックの API をコールしているときにローディングインディケーターを表示する場合には、`formState.isValidating` の値を参照します。`formState.isValidating` はバリデーションを実行中の場合 `true` になります。

```tsx:Form.tsx
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserSchema } from "./validation";

export const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValidating },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const onSubmit: SubmitHandler<User> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="email">Email</label>
      <input
        {...register("email")}
        id="email"
        type="email"
        aria-invalid={errors.email ? "true" : "false"}
        aria-describedby="valid-email duplicate-email"
      />
      {isValidating && <p>Loading</p>}
      {errors.email?.type === "invalid_string" && (
        <p role="alert" id="valid-email">
          メールアドレスの形式が正しくありません
        </p>
      )}
      {errors.email?.type === "custom" && (
        <p role="alert" id="duplicate-email">
          メールアドレスが重複しています
        </p>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};
```

`refine()` をメソッドを使用した場合のエラータイプは `"custom"` となります。`errors.email?.type` が `custom` の場合にはメールアドレスが重複したメッセージを表示するようにしています。

## フォームの他のフィールドを参照する

「確認用のパスワードが入力したパスワードと一致しているか」のようなフォームの他のフィールドの値を参照してバリデーションの実施したいケースがよくあるかと思います。カスタムのバリデーションロジックを使用したい場合には `refine` メソッドを使うのが良さそうです。しかし、メールアドレスの場合のようにオブジェクトのプロパティに対して `refine()` メソッドを使用するとバリデータ関数の引数で自身の値しか取得できません。

```ts:validation.ts
import { z } from 'zod'

export const PasswordSchema = z.object({
  password: z.string().min(8),
  passwordConfirmation: z.string().refine(val => {
    // val === string
  })
})
```

フォームの他の値を使用したカスタムのバリデーションロジックを使用したい場合には、`z.object()` に対して `refine()` メソッドを使います。この場合、`refind()` メソッドのバリデータ関数の引数ですべてのフィールドの値を取得できます。

```ts:validation.ts
import { z } from "zod";

export const PasswordSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirmation: z.string(),
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      path: ["passwordConfirmation"],
    }
  );

export type Password = z.infer<typeof PasswordSchema>;
```

`refind()` メソッドの第 2 引数で `path: ["passwordConfirmation"]` を指定しています。パスを指定することで、どのフィールドに対するエラーが発生したのか情報を付与できます。`path` を指定しない場合 `useForm` の `formState.errors` では以下のように空の文字列がキーとして返されます。

```json
{
    "": {
        "message": "Invalid input",
        "type": "custom"
    }
}
```

## 数値を入力する

フォームに入力された値を数値として扱いたいケースは頻出するでしょう。フォームにバインディングされる値は常に String 型として扱われるため入力された値を数値と扱うためにはどこかで Number 型に変換する必要があります。

この時、React Hook Form 側で数値に変換するパターンと、Zod 側で数値に変換するパターンの 2 通りが考えられます。

### React Hook Form 側で数値に変換する

まずは React Hook Form 側で数値に変換するパターンを見てみましょう。Zod 側では数値として扱いたいフィールドを `z.number()` で定義します。

```tsx:validation.tsx
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  age: z.number().positive().int(),
});

export type User = z.infer<typeof UserSchema>;
```

フォーム側で `age` を数値に変換するため、`register` オプションの `valueAsNumber` を `true` に設定します。このオプションを指定することで、入力された値をバリデーションが実施される前に数値に変換してくれます。内部的には `Number()` で変換しているようです。 

```ts
{...register("age", { valueAsNumber: true })}
```

フォームの全体は次のようになります。

```tsx:Form.tsx
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, UserSchema } from "./validation";

export const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(UserSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      age: undefined,
    },
  });
  const onSubmit: SubmitHandler<User> = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="age">Age</label>
      <input
        {...register("age", { valueAsNumber: true })}
        id="age"
        aria-invalid={errors.age ? "true" : "false"}
        aria-describedby="valid-age positive-age"
      />

      {errors.age?.type === "invalid_type" && (
        <p role="alert" id="valid-age">
          年齢は整数で入力してください。
        </p>
      )}

      {errors.age?.type === "too_small" && (
        <p role="alert" id="positive-age">
          年齢は正の数で入力してください。
        </p>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};
```

`valueAsNumber` は `Number()` で数値に変換されるので空文字（`""`）が入力された場合には `0` として扱わます。この挙動を回避して空文字（`""`）を `NaN` として扱いたい場合には、`setValueAs` で独自の変換ロジックを渡すことができます。

```html
<input
  {...register("age", {
    setValueAs: (value) => {
      if (value.trim() === "") {
        return NaN;
      }
      return Number(value);
    },
  })}
/>
```

### Zod 側で変換する

次に Zod 側で変換するパターンです。[coerce()](https://zod.dev/?id=coercion-for-primitives) メソッドを使用することで任意のプリミティブ型に変換できます。（`coerce` は強制するという意味の単語です）`coerce()` メソッドを使用するとそれぞれのプリミティブに対応するコンストラクタ関数で変換されます。

```ts
z.coerce.string(); // String(input)
z.coerce.number(); // Number(input)
z.coerce.boolean(); // Boolean(input)
z.coerce.bigint(); // BigInt(input)
z.coerce.date(); // new Date(input)
```

```tsx:validation.ts
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  age: z.coerce.number().positive().int(),
});

export type User = z.infer<typeof UserSchema>;
```

独自の変換ロジックを使用したい場合には、[preprocess()](https://zod.dev/?id=preprocess) メソッドを使用します。

```tsx:validation.tsx
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  age: z.preprocess((value) => {
    if (typeof value !== "string") {
      return Number(value);
    }
    if (value.trim() === "") {
      return NaN;
    }
    return Number(value);
  }, z.number().positive().int()),
});

export type User = z.infer<typeof UserSchema>;
```

## チェックボックスの必須チェック

例えば、利用規約への同意を必須に場合には、チェックボックスにチェックがされていない場合バリデーションエラーとしたいはずです。チェックボックスの入力値に対するスキーマは `z.boolean()` で定義できます。チェックされていない状態が `false` でチェックされている状態が `true` です。

```tsx:validation.tsx
import { z } from "zod";

export const CheckboxSchema = z.object({
  terms: z.boolean(),
});

export type Checkbox = z.infer<typeof CheckboxSchema>;
```

しかし、`z.boolean()` に対して `true` であることを強制するバリデーションメソッドは存在しません。

`true` 値であることを強制したい場合には [literal()](https://zod.dev/?id=literals) メソッドを使用します。このメソッドは TypeScript の [Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types) に相当するものです。

```tsx:validation.tsx
import { z } from "zod";

export const CheckboxSchema = z.object({
  terms: z.literal(true),
});

export type Checkbox = z.infer<typeof CheckboxSchema>;
```

この時、推論される TypeScript の型も同様にリテラル型となります。

```ts
type Checkbox = {
  terms: true
}
```

これでチェックボックスにチェックをしなかったとき（= `terms` が `false` の時）、以下のようなエラーが返されるようになります。

```json
{
    "terms": {
        "message": "Invalid literal value, expected true",
        "type": "invalid_literal",
        "ref": {
            "type": "checkbox",
            "name": "terms"
        }
    }
}
```

## 条件によってバリデーションを実施する

フォームの他のフィールドの値によって、バリデーションを実施するかどうか決定する場合があると思います。例えば、通常会員として登録する場合クレジットカード情報を入力する必要はないけれど、プレミアム会員として登録する場合にはクレジット情報が必須となるような場合が考えられます。

### リテラル値で分岐する場合

フォームの他のフィールドの値によって、バリデーションを実施するかどうか決定する場合があると思います。例えば、通常会員として登録する場合クレジットカード情報を入力する必要はないけれど、プレミアム会員として登録する場合にはクレジット情報が必須となるような場合が考えられます。

チェックボックスの ON/OFF やラジオボタンの選択値のようなリテラルの値で分岐したい場合には [z.discriminatedUnion](https://zod.dev/?id=discriminated-unions) を使用するのがおすすめです。これは TypeScript のユニオン型に相当し、タグ付きユニオンのような使い方ができます。

`z.discriminatedUnion` の第 1 引数にはバリデーションにどちらのスキーマを使用するか判別するためのキーを指定します。これにより、[z.union](https://zod.dev/?id=unions) を使用するよりも高速に評価をでき、パース処理がより高速になります。

```ts:validation.ts
import { z } from "zod";

export const RegistrationSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("normal"),
    name: z.string().min(3),
    cardNumber: z.string().optional(),
  }),
  z.object({
    type: z.literal("premium"),
    name: z.string().min(3),
    cardNumber: z.string().min(16),
  }),
]);

export type Registration = z.infer<typeof RegistrationSchema>;
```

推論される TypeScript の型もユニオン型になっています。

```ts
type Registration = {
    cardNumber?: string | undefined;
    type: "normal";
    name: string;
} | {
    type: "premium";
    name: string;
    cardNumber: string;
}
```

フォームは以下のように実装できます。

```tsx:Form.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RegistrationSchema, Registration } from "./validation";
export const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Registration>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: "",
      type: "normal",
      cardNumber: "",
    },
  });
  const onSubmit = (data: Registration) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input {...register("name")} id="name" aria-describedby="invalid-name" />
      {errors.name && (
        <p id="invalid-name" role="alert">
          名前を入力してください。
        </p>
      )}
      <div role="radiogroup" aria-label="会員種別">
        <label htmlFor="normal">通常会員</label>
        <input
          {...register("type")}
          id="normal"
          value="normal"
          type="radio"
          name="type"
        />

        <label htmlFor="premium">プレミアム会員</label>
        <input
          {...register("type")}
          id="premium"
          value="premium"
          type="radio"
          name="type"
        />
      </div>
      <label htmlFor="card">カード番号</label>
      <input
        {...register("cardNumber")}
        id="card"
        aria-describedby="invalid-card-number"
      />
      {errors.cardNumber && (
        <p id="invalid-card-number" role="alert">
          カード番号を入力してください。
        </p>
      )}
      <button type="submit">登録</button>
    </form>
  );
};
```

### 条件により分岐する場合

単純にリテラル値ではなく、条件によってバリデーションルールが変化する場合には残念ながら `z.discriminatedUnion()` を使うことはできません。例えば、年齢が 18 歳未満の場合には保護者の同意が必須であるフォームを考えてみましょう。18 歳未満であることはリテラル値でひょうげうんすることができません。`refine()` メソッド内で条件分岐によりバリデーションするかどうか決定する必要があるでしょう。

```tsx
import { z } from "zod";

export const RegistrationSchema = z
  .object({
    name: z.string().min(3),
    age: z.coerce.number().positive().int(),
    agree: z.boolean().optional(),
  })
  .refine(({ age, agree }) => age >= 18 || agree, {
    path: ["agree"],
    message: "You must be 18 or older to agree",
  });

export type Registration = z.infer<typeof RegistrationSchema>;
```

`refine()` メソッドは複数定義できるので、例えば保護者の同意に加えて保護者の名前、続柄のように複数の項目を必須にしたい場合でも対応できます。

```ts:validation.tsx
import { z } from "zod";

export const RegistrationSchema = z
  .object({
    name: z.string().min(3),
    age: z.coerce.number().positive().int(),
    agree: z.boolean().optional(),
    guardianName: z.string().optional(),
    relationship: z.string().optional(),
  })
  .refine(({ age, agree }) => age >= 18 || agree, {
    path: ["agree"],
    message: "You must be 18 or older to agree",
  })
  .refine(({ age, guardianName }) => age >= 18 || guardianName, {
    path: ["guardianName"],
  })
  .refine(({ age, relationship }) => age >= 18 || relationship, {
    path: ["relationship"],
  });
export type Registration = z.infer<typeof RegistrationSchema>;
```

フォームは次のように定義できます。

```tsx:Form.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Registration, RegistrationSchema } from "./validation";

export const Form: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Registration>({
    resolver: zodResolver(RegistrationSchema),
    defaultValues: {
      name: "",
      age: undefined,
      agree: undefined,
      guardianName: "",
      relationship: "",
    },
  });

  const onSubmit = (data: Registration) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">Name</label>
      <input {...register("name")} id="name" aria-describedby="invalid-name" />
      {errors.name && (
        <p id="invalid-name" role="alert">
          名前を入力してください。
        </p>
      )}
      <label htmlFor="age">Age</label>
      <input {...register("age")} id="age" aria-describedby="invalid-age" />
      {errors.age && (
        <p id="invalid-age" role="alert">
          年齢を入力してください。
        </p>
      )}
      <label htmlFor="agree">保護者の同意</label>
      <input
        {...register("agree")}
        id="agree"
        type="checkbox"
        aria-describedby="invalid-agree"
      />
      {errors.agree && (
        <p id="invalid-agree" role="alert">
          保護者の同意が必要です。
        </p>
      )}
      <label htmlFor="guardianName">保護者の名前</label>
      <input
        {...register("guardianName")}
        id="guardianName"
        aria-describedby="invalid-guardian-name"
      />
      {errors.guardianName && (
        <p id="invalid-guardian-name" role="alert">
          保護者の名前を入力してください。
        </p>
      )}
      <label htmlFor="relationship">保護者との関係</label>
      <input
        {...register("relationship")}
        id="relationship"
        aria-describedby="invalid-relationship"
      />
      {errors.relationship && (
        <p id="invalid-relationship" role="alert">
          保護者との関係を入力してください。
        </p>
      )}
      <button type="submit">登録</button>
    </form>
  );
};
```

`refine()` メソッドによるバリデーションは柔軟に定義できますが、推論される方は常にオプショナルとなるので `discriminatedUnion()` を使用する場合と比べると型の恩恵が減ってしまいます。またバリデーションロジックも複雑になりがちです。

まずは `discriminatedUnion()` を使用することを考えて、それでも対応できないような場合にのみ `refine()` を使うことを考えるのがよいでしょう。

## 参考

- [React Hook Form + Zodでcheckboxのvalidationをする](https://zenn.dev/cozynooks/articles/3b37cda72a7149)
- [react-hook-form と Zod で条件分岐のあるフォームを構築する方法6選 - Qiita](https://qiita.com/kalbeekatz/items/09df07f78420ab6b6e57)

