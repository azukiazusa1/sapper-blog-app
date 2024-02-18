---
id: 0vUb1c0YrW1KLuxr_Vgdd
title: "type-safe とプログレッシブエンハンスメント、アクセシビリティヘルパーを備えたフォームライブラリ Conform"
slug: "type-safe-and-progressive-enhancement-form-library-conform"
about: "Conform は React 向けのフォームライブラリです。type-safe であること、Web 標準を利用したプログレッシブエンハンスメントや、アクセシビリティヘルパーを特徴としており、Next.js の Server Actions や Remix に対応しています。"
createdAt: "2024-02-18T13:30+09:00"
updatedAt: "2024-02-18T13:30+09:00"
tags: ["Conform", "React", "Next.js", "Zod"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7fEodIOXoEJ3Ti2UiSY6ap/97dcd5566c9305ba07ef17ca47b89a19/convenience-store_oden_illust_1756.png"
  title: "convenience-store oden illust 1756"
published: true
---
Conform は React 向けのフォームライブラリです。type-safe であること、Web 標準を利用したプログレッシブエンハンスメントや、アクセシビリティヘルパーを特徴としており、Next.js の Server Actions や Remix に対応しています。

https://conform.guide/

Conform は以下の特徴を掲げています。

- プログレッシブエンハンスメントファーストな API
- Type-safe なフィールドの型推論
- きめ細かいサブスクリプション
- ビルドインのアクセシビリティヘルパー
- Zod による型変換

## Conform のチュートリアル

早速 Conform を使ってみましょう。Conform は Next.js と Remix の統合に対応しています。ここでは Next.js で Conform を使って簡単なフォームを作成するチュートリアルを紹介します。

### インストール

以下のコマンドで Conform をインストールします。

```bash
npm install @conform-to/react @conform-to/zod --save
```

### スキーマの定義

始めに [Zod](https://zod.dev/) を使ってフォームのスキーマを定義します。Conform は Zod と組み合わえることで型安全なフォームと、バリデーションを実現しています。

```ts:app/contact/schema.ts
import { z } from "zod";

export const schema = z.object({
  email: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string({ required_error: "Email is required" }).email("Email is invalid")
  ),
  content: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z
      .string({ required_error: "Content is required" })
      .min(10, "Content is too short")
      .max(1000, "Content is too long")
  ),
});
```

### Server Action 関数の作成

次に、フォームの送信時に実行される Server Action 関数を作成します。[parseWithZod](https://conform.guide/api/zod/parseWithZod) 関数を使うことでフォームの値を Zod のスキーマに従ってパースを行います。`parseWithZod` 関数にはフォームの値とスキーマを渡すします。

```ts:app/contact/actions.ts
"use server";
import { parseWithZod } from "@conform-to/zod";
import { schema } from "./schema";
import { redirect } from "next/navigation";

export const contact = async (prevState: unknown, formData: FormData) => {
  const submission = parseWithZod(formData, { schema: schema });

  if (submission.status !== "success") {
    return submission.reply();
  }

  return redirect("/contact/success");
};
```

Zod によるバリデーションの結果は `parseWithZod` 関数によって返されるオブジェクトに含まれています。`submission.status` が `"success"` であればバリデーションに成功したことを意味します。バリデーションに失敗した場合は `submission.reply()` メソッドを使ってエラーの情報とフォームに入力された値を返します。

### フォームの作成

最後にフォームを作成します。`useForm` フックを使うことでフォームの状態を管理するための API を提供しています。`useForm` フックを使う場合には `"use client;"` ディレクティブを宣言してクライアントコンポーネントとして扱う必要があります。

[useFormState](https://ja.react.dev/reference/react-dom/hooks/useFormState) フックと組み合わせることで、前回入力したフォームの値を初期値としてフォームに表示できます。

```tsx:app/contact/Form.tsx
"use client";

import {
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { useFormState } from "react-dom";
import { contact } from "./actions";

export function Form() {
  const [lastResult, action] = useFormState(contact, undefined);
  const [form, fields] = useForm({
    lastResult,
  });

  return (
    <form id={form.id} action={action} noValidate>
      <div>
        <label htmlFor={fields.email.id}>Email</label>
        <input {...getInputProps(fields.email, { type: "email" })} />
        <div id={fields.email.errorId}>{fields.email.errors}</div>
      </div>
      <div>
        <label htmlFor={fields.content.id}>Content</label>
        <textarea {...getTextareaProps(fields.content)}></textarea>
        <div id={fields.content.errorId}>{fields.content.errors}</div>
      </div>
      <button type="submit">Send</button>
    </form>
  );
}
```

[getInputProps](https://conform.guide/api/react/getInputProps) や [getTextareaProps](https://conform.guide/api/react/getTextareaProps) といったヘルパー関数を使うことで、アクセシビリティ上必要な属性をフォームのフィールドに自動で追加できます。Email フィールドに `getInputProps()` を渡した結果は以下のようになります。

```tsx
<div>
  <label for=":Rauukq:-email">Email</label>
  <input
    // ラベルに渡した fields.email.id と一致する
    id=":Rauukq:-email"
    // コントロールを form 要素に関連付ける <form> に渡した form.id と一致する
    form=":Rauukq:"
    type="email"
    // zod の schema のキー名に基づいた name 属性
    name="email"
    // エラーがある場合には aria-invalid 属性を true にする
    aria-invalid="true"
    // エラーがある場合には aria-describedby 属性にエラーメッセージの id を渡して関連付ける
    aria-describedby=":Rauukq:-email-error"
  />
  <div id=":Rauukq:-email-error">Email is invalid</div>
</div>
```

`aria-invalid` や `aria-describedby` などのアクセシブルなフォームを実現するために複雑な設定の管理を隠蔽してくれるので、誰でも一定の水準を満たすフォームを作成できる点は魅力的です。

これで Conform を使ったフォームの作成が完了しました。フォームをサブミットした後にエラーメッセージが表示されることを確認してみましょう。また、プログレッシブエンハンスメントにより JavaScript が無効な環境においてもフォームが機能することを確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/75wUOJf3kCQSmZD1jQBQ2u/4a21068df8c8eaef7fa8de938790113e/_____2024-02-18_15.31.17.mov" controls>

### バリデーションのタイミングをコントロールする

デフォルトでバリデーションはフォームがサブミットされた後にサーバーサイドで実行されます。フォームからフォーカスが外れたタイミングなど、より早いタイミングでバリデーションを実行したい場合もあるでしょう。その場合には `useForm` フックの `shouldValidate` と `shouldRevalidate` オプションを使うことでバリデーションのタイミングをコントロールできます。

```tsx:app/contact/Form.tsx {5-6}
export function Form() {
  const [lastResult, action] = useFormState(contact, undefined);
  const [form, fields] = useForm({
    lastResult,
    // ユーザーのフォーカスが離れたいタイミングで初めてバリデーションを実行する
    shouldValidate: "onBlur",
    // ユーザーの入力が変更されたタイミングでバリデーションを再実行する
    shouldRevalidate: "onInput",
  });
```

なお、バリデーションの実行タイミングを `onSubmit` 以外のタイミングに設定した場合でも、`onSubmit` でフォームをサブミットした際にはバリデーションが実行されるためプログレッシブエンハンスメントが損なわれることはありません。

`shouldValidate` と `shouldRevalidate` は**サーバーサイド**でバリデーションが実行されます。つまり、`onInput` でバリデーションが実行される場合には、ユーザーがタイプするたびにサーバーサイドにリクエストを送信して結果を待つことになります。Devtools のネットワークタブを見ると、フォームの入力が変更されるたびにリクエストが送信されていることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4DPwviJLiQDfUzf75zBqBz/c9a1ccf59075d1a4533d4e5bd9996306/_____2024-02-18_16.15.57.mov" controls></video>

### クライアントでバリデーションを実行する

理にかなっています。しかし、今回の例のように簡単なバリデーションであればクライアントサイドでバリデーションを実行することで、より早いフィードバックを返すことができます。また、React + Vite のようにサーバーを持たない SPA として開発している場合には、サーバーサイドでバリデーションを実行することができないため、クライアントでバリデーションを実行する必要があります。

クライアントでバリデーションを実行させるためには、`useForm` フックが返す `form.onSubmit` ハンドラーを `<form>` にわたす必要があります。また、クライアントのバリデーションは `useForm` のオプションである `onValidate` メソッド内で実行されます。このメソッド内で、サーバーサイドの処理と同じように `parseWithZod` 関数を使ってバリデーションを実行します。

```tsx:app/contact/Form.tsx {7-9, 15}
export function Form() {
  const [lastResult, action] = useFormState(contact, undefined);
  const [form, fields] = useForm({
    lastResult,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: schema });
    },
  });

  return (
    <form
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
      noValidate
    >
```

`obSubmit` ハンドラーを使用している場合には、クライアントでバリデーションが満たされない限りフォームがサブミットされることはありまえん。

## まとめ

- Next.js や Remix のような Web 標準に従って構築されたフォームを使うフレームワークと組み合わせて使用することを前提として作られており、プログレッシブエンハンスメントやアクセシビリティの観点で優れたフォームライブラリ
- `getInputProps` や `getTextareaProps` といったヘルパー関数を使うことで、アクセシビリティ上必要な属性をフォームのフィールドに自動で追加できる
- Zod と組み合わせることで、型安全なフォームとバリデーションを実現している
- サーバーサイドでのバリデーションの実行タイミングをコントロールすることができるため、より柔軟なフォームの作成が可能

## 参考

- [Conform](https://conform.guide/)
