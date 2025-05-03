---
id: mGobId7YHnqg2wh6QzEDc
title: "Server Actions のフォームバリデーションにおいて useFormState でエラーメッセージを表示する"
slug: "use-form-state-to-display-error-messages-in-server-actions-forms"
about: "Next.js の Server Actions でフォームを作成する際に、どのような方法でバリデーションを行い、エラーメッセージを表示する際にどのような手段が考えられるでしょうか。プログレッシブエンハンスメントの恩恵を受けるために、サーバーサイドでバリデーションを行いその結果を表示する方法が効果的です。`useFormStatus` フックはこの一連の動作を行うために使用します。"
createdAt: "2023-10-31T19:16+09:00"
updatedAt: "2023-10-31T19:16+09:00"
tags: ["Next.js", "React", "Server Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/YErqIySvXsd4mGGI3aFbR/90972f0bba3c38b98865035cf614bb06/halloween_ghost_illust_1172.png"
  title: "ハロウィンのおばけのイラスト"
audio: null
selfAssessment: null
published: true
---
Next.js の [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions) でフォームを作成する際に、どのような方法でバリデーションを行い、エラーメッセージを表示する際にどのような手段が考えられるでしょうか。

最もシンプルな方法は `required` 属性や `input type="email"` などの HTML のバリデーションを利用することです。HTML のバリデーションは追加の実装を行わずともエラーメッセージを表示したり、フォームの送信をブロックできるため、基本的なバリデーションには十分です。またフォームの検証状態が支援技術に伝えられるため、アクセシビリティの観点からも有効です。

もう少し複雑な条件でバリデーションを行ったり UI をカスタマイズしたエラーメッセージを表示したい場合には、クライアント側でフォームの状態を管理してバリデーションを行うことが一般的でした。非制御コンポーネントにおいてフォームの値を管理するのは少々煩雑ですので、[React Hook Form](https://react-hook-form.com/) のようなフォームの状態の管理を行うライブラリを利用することが多いです。

ところが、Server Actions によるフォームを作成する場合にはクライアント側でフォームの状態を管理しバリデーションを行う手法はそれほど効果的ではありません。なぜなら、Server Actions の特徴の 1 つである [Progressive Enhancement (プログレッシブエンハンスメント)](https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement) 機能の恩恵を受けることができないからです。

プログレッシブエンハンスメントとは、JavaScript が有効な環境では JavaScript によるリッチなユーザ体験を提供し、JavaScript が無効な環境では JavaScript に依存しない機能を提供するという考え方です。Server Actions によるフォームは JavaScript が無効な環境においては HTML のフォームとして機能するため、インタラクティブな機能を常に提供できます。

プログレッシブエンハンスメントにより JavaScript のハイドレーションが完了する前にフォームの操作が可能となるため、特にモバイル環境のようなネットワークの状態が不安定な環境においてユーザ体験の向上につながります。

クライアント側で状態管理を行う場合には当然 JavaScript が有効である必要があるため、JavaScript が無効な環境においてユーザーは適切なバリデーションのフィードバックを得られないことになってしまいます。

Server Actions によるフォームにおいては、サーバーサイドでバリデーションを行い、エラーメッセージを返す手法を取ることが効果的です。この一連の動作を行うために [useFormState](https://react.dev/reference/react-dom/hooks/useFormState) と呼ばれるフックを利用します。

この手法を取ることで JavaScript が無効な環境においても、ユーザーは適切なバリデーションのフィードバックを得ることができます。

## useFormState とは

`useFormState` `<form>` の `action` 属性に渡す関数（フォームアクション）の結果に基づいて状態を更新できるようにするフックです。
第 1 引数にフォームアクションを、第 2 引数には状態の初期値を渡します。フックの戻り値はタプルであり、第 1 要素現在の状態を、第 2 要素にはフォームアクションを返します。

```jsx
const [state, dispatch] = useFormState(action, initialState);
```

### 基本的な使い方

`useFormState` フックは [reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer) のように動作します。フォームアクションには現在の状態が渡され、フォームアクションの結果を返すことで状態を更新します。

例として `useFormState` フックを用いてカウンターを実装してみましょう。`useFormState` フックはクライアントコンポーネントのみで動作するため、`"use client"` ディレクティブをファイルの先頭に追加します。

```tsx:app/Form.tsx
"use client";
import { countAction } from "@/app/lib/actions";
import { useFormState } from "react-dom";

export default function Form() {
  const initialState = { count: 0 };
  const [state, dispatch] = useFormState(countAction, initialState);

  return (
    <form action={dispatch}>
      <div>{state.count}</div>
      <button type="submit" name="action" value="increment">
        Increment
      </button>
      <button type="submit" name="action" value="decrement">
        Decrement
      </button>
    </form>
  );
}
```

Increment ボタンが押された場合には `action` のキーに対して `"increment"` が、Decrement ボタンが押された場合には `action` のキーに対して `"decrement"` が送信されます。

フォームの送信した値を受け取る `countAction` も作成しましょう。この関数はサーバー上でのみ実行されるようにするため、`"use server"` ディレクティブをファイルの先頭に追加します。

また、通常のフォームアクションの引数は `FormData` オブジェクトですが、`useFormState` フックのフォームアクションの引数は第 1 引数に現在の状態を表すオブジェクト、第 2 引数に `FormData` オブジェクトが渡されます。

```ts:app/lib/actions.ts
"use server";

type State = {
  count: number;
};

export const countAction = async (state: State, formData: FormData) => {
  const action = formData.get("action");
  switch (action) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
};
```

どのサブミットボタンが押されたかによって、現在の状態を更新する処理を行っています。`useReducer` でよく見る形と似ていますね。

実際に試してみましょう。JavaScript を無効にした状態であっても、問題なくフォームが動作していることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3z0kwFAJiB91XlNbAL9kp8/3f68cc0fca42d9dc8f9cd1a9eec3c4f3/_____2023-10-31_20.25.29.mov" controls></video>

## useFormState でエラーメッセージを表示する

それでは、`useFormState` フックを利用してサーバーサイドでバリデーションを行い、エラーメッセージを表示するフォームを作成してみましょう。

`useFormState` に渡す状態は各フィールドのエラーメッセージを `errors` と、フォーム全体のエラーメッセージを `message`、そして前回のフォームの入力値を `values` というキーで格納したオブジェクトとします。

JavaScript が無効な環境の場合、フォームをサブミットした後に前回の入力状態がリセットされていまうので、前回の入力値を状態として保持しておくとよいでしょう。

```ts
type State = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  values?: {
    name?: string;
    email?: string;
  };
  message: string | null;
};
```

コンポーネントでは、現在の状態に応じてエラーメッセージを表示するようにします。`useFormState` フックの戻り値の第 1 要素には現在の状態が格納されているため、これを利用します。

```tsx:app/Form.tsx
"use client";
import { useFormState } from "react-dom";
import { createUser } from "@/app/lib/actions";

export default function Form() {
  const initialState = {
    errors: {},
    message: null,
  };
  const [state, dispatch] = useFormState(createUser, initialState);

  return (
    <form action={dispatch} aria-aria-labelledby="form-title">
      <h1 className="text-2xl mb-2" id="form-title">
        Create User
      </h1>

      {/* エラーメッセージがあれば表示する */}
      {state.message && (
        // aria-live="polite" は、動的に変化する要素をスクリーンリーダーに読み上げさせるための属性
        // これにより、エラーメッセージが表示されたときにスクリーンリーダーが読み上げる
        <div className="text-red-600 text-sm" aria-live="polite">
          {state.message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          // defaultValue で、前回のフォームの入力値があればそれを表示する
          defaultValue={state?.values?.name || ""}
          className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          // aria-describedby で入力フィールドとエラーメッセージを関連付ける
          aria-describedby="name-error"
        />
      </div>

      {state?.errors?.name &&
        state.errors.name.map((error) => (
          <div
            className="text-red-600 text-sm"
            id="name-error"
            aria-live="polite"
          >
            {error}
          </div>
        ))}

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state?.values?.email || ""}
          className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
          aria-describedby="email-error"
        />
      </div>

      {state?.errors?.email &&
        state.errors.email.map((error) => (
          <div
            className="text-red-600 text-sm"
            id="email-error"
            aria-live="polite"
          >
            {error}
          </div>
        ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2"
        >
          Create
        </button>
      </div>
    </form>
  );
}
```

続いてフォームアクション側の実装も行いましょう。ここでは、バリデーションのために [zod](https://github.com/colinhacks/zod) を使用しています、zod は TypeScript で書かれたスキーマ定義をもとにバリデーションを行うライブラリです。ユーザースキーマを定義して、対応するエラーメッセージを返すようにします。

```ts:app/lib/actions.ts
import { z } from "zod";

const UserSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Please enter a name.",
    })
    .min(3, { message: "Name must be at least 3 characters." }),
  email: z
    .string({
      invalid_type_error: "Please enter an email address.",
    })
    .email({ message: "Please enter a valid email address." }),
});
```

`createUser` 関数ではまず `UserSchema.safeParse()` メソッドにより、ユーザースキーマに従ってバリデーションを行います。`.safeParse()` メソッドは `.parse()` メソッドと異なりバリデーションに失敗した場合でも例外が発生せず、エラーメッセージを含むオブジェクトを返します。

```ts:app/lib/actions.ts
"use server";
type State = {
  errors?: {
    name?: string[];
    email?: string[];
  };
  message: string | null;
};

export const createUser = async (
  prevState: State,
  formData: FormData
): Promise<State> => {
  // ユーザースキーマによるバリデーション
  const validatedFields = UserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  // バリデーションに失敗した場合はエラーメッセージを次の状態として返す
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create User",
    };
  }

  const { name, email } = validatedFields.data;

  try {
    // ユーザーを作成する処理
    console.log({ name, email });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create User",
    };
  }

  // フォームの送信後には、リダイレクトを行い、キャッシュを無効化する
  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
};
```

これでフォームのバリデーションが完了しました。実際に試してみましょう。JavaScript を無効にした状態であっても、適切なエラーメッセージが表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5WahELavq8PVmVMVglogPO/10dbf5db2acf317c3ca8e61fac22ef6a/__________2023-10-31_21.02.35.png)

## まとめ

- Server Actions によるフォームにおいては、プログレッシブエンハンスメントの恩恵を受けるために、サーバーサイドでバリデーションを行い、その戻り値をもとにエラーメッセージを表示する手法が効果的である
- `useFormState` フックはフォームアクションの結果に基づいて状態を更新できるようにするフックである
- `useFormState` フックを利用することで、JavaScript が無効な環境においても適切なバリデーションのフィードバックを得ることができる

## 参考

- [Learn Next.js: Improving Accessibility | Next.js](https://nextjs.org/learn/dashboard-app/improving-accessibility)
- [useFormState - React](https://react.dev/reference/react-dom/hooks/useFormState)
- [form – React](https://react.dev/reference/react-dom/components/form)
