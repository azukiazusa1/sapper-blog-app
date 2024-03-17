---
id: 6iHWiOe5YUb2juuLbQZJIs
title: "テストコード内では条件分岐を書かないようにする"
slug: "avoid-writing-conditional-branches-in-the–test-code"
about: "誰でも読める愚直なコードであることの 1 つの目安として、テストコードの中に if 文や三項演算子などの条件分岐が入り込んでいていないことが上げられます。if 文が存在するコードはアンチパターンであるといえます。実際に if 文がテストコードの中に入り込んだ例を見てみましょう。"
createdAt: "2023-01-22T00:00+09:00"
updatedAt: "2023-01-22T00:00+09:00"
tags: ["テスト", "Jest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5mxtkQ54D8YRqLc8id5ffZ/539aca91ff16e704f4f45485b5fcec10/_Pngtree_double_burger_2575943.png"
  title: "double burger"
selfAssessment: null
published: true
---
テストコードは誰でも読める愚直なコードであることが求められます。テストコードにはある種のドキュメントのような、コードの仕様を説明する役割が求められているためです。テストの期待結果が変数になっていて、定義元までジャンプしないと値を確認できないだとか、条件分岐やループが入り込んでいて複雑性が上がっている状態ですと、素直に読みやすいとは言えません。

コードの中では重複排除をするためにさまざまなテクニックを駆使することがありますが、これは単にテストコードに適応するべきではありません。テストコードではあえて値をベタ書きするなど、あえてコードを重複させる書き方が必要となるのです。

誰でも読める愚直なコードであることの 1 つの目安として、テストコードの中に if 文や三項演算子などの条件分岐が入り込んでいていないことが上げられます。if 文が存在するコードはアンチパターンといえます。実際に if 文がテストコードの中に入り込んだ例を見てみましょう。

## 例1 ログインコンポーネント

まずはログインコンポーネントテストする例を上げてみましょう。テスト対象のコードは以下のとおりです。正しい email とパスワードを入力してログインに成功した場合「Success」と表示し、ログインに失敗した場合には「Failed」と表示します。

```tsx:Login.tsx
import { useState } from "react";

const login = async (email: string, password: string) => {
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return res.ok;
};

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await login(email, password);
    setResult(res);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {result === false && <p>Failed</p>}
      {result === true && <p>Success</p>}
    </form>
  );
};

export default Login;
```

ログインコンポーネントに対するテストを書いていきます。コードは以下のとおりです。

```tsx:login.spec.tsx
import Login from "./Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  test("ログインに成功した場合には「Success」を、失敗した場合には「Failed」を表示する", async () => {
    // 本来はモックの実装であっても正しい Response 型を返すべきですが、スペースの節約のため簡略化してます
    // @ts-expect-error
    global.fetch = jest.fn((url: string, options: RequestInit) => {
      if (options.method === "POST" && options.body) {
        const { email, password } = JSON.parse(options.body.toString());
        if (email === "test@example.com" && password === "password") {
          return {
            ok: true,
          };
        }
        return {
          ok: false,
        };
      }
    });

    render(<Login />);

    userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );
    userEvent.type(screen.getByLabelText(/password/i), "unmatch");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/failed/i)).toBeInTheDocument();

    userEvent.clear(screen.getByLabelText(/password/i));
    userEvent.type(screen.getByLabelText(/password/i), "password");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/success/i)).toBeInTheDocument();
  });
});
```

はじめに `fetch` をモックするために `global.fetch = jest.fn(() => {})` としてグローバル関数の `fetch` を上書きしています。一度パスワード入力欄に間違ったパスワードとして「unmacth」を入力しています。この状態でフォームをサブミットして「failed」が表示されることを確認します。その後パスワード入力欄に正しいパスワードとして「password」を入力してフォームをサブミットし「Success」とい表示されていることを確認しています。

このテストコード中では `fetch` をモックしている箇所で if 文が登場しています。ここで if 文を使用しているのは正しいパスワードと誤ったパスワードを入力したパターンをテストしたいためです。それぞれのパターンで `fetch` は異なるレスポンスを返す必要があります。

ここで問題となるのは、if 文があることでテストコード自体を間違える恐れがあるところです。たとえば、`email === "test@example.com" && password === "password"` という条件を書くべき箇所を誤って `email === "test@example.com" || password === "password"` と書いてしまった場合「failed」と表示されることを確認するテストは失敗してしまいます。

この時テストが失敗した原因が実際のコードにあるのか、テストコードにあるのかわからなくなってしまいます。これはテストコード自体の質に問題がある状態と言えます。

またテストコード自体の誤りにより本来失敗するべきテストが成功してしまうというケースも考えられます。このようなテストは信頼できない状態となってしまいます。

### テストコードを分割して書き直す

このテストコードから if 文を取り除いてみましょう。テストコード内に if 文が出現している場合、1 つのテストケースで多くのことを検証しすぎているという兆候があります。今回の例で上げたテストでは、1 つのテストケースの中でログインが成功したパターンと失敗したパターンの両方を検証しようとしたために、モックの実装で if 文を使わざるをえなかったと考えられます。

そこで、以下のようにテストケースをログインが成功したパターンと失敗したパターンでそれぞれ分割してみましょう。

```tsx:Login.spec.tsx
import Login from "./Login";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  test("ログインに成功した場合には「Success」を表示する", async () => {
    // @ts-expect-error
    global.fetch = jest.fn((url: string, options: RequestInit) => {
      return Promise.resolve({
        ok: true,
      });
    });

    render(<Login />);

    userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );
    userEvent.type(screen.getByLabelText(/password/i), "password");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/success/i)).toBeInTheDocument();
  });

  test("ログインに失敗した場合には「Failed」を表示する", async () => {
    // @ts-expect-error
    global.fetch = jest.fn((url: string, options: RequestInit) => {
      return Promise.resolve({
        ok: false,
      });
    });

    render(<Login />);

    userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );
    userEvent.type(screen.getByLabelText(/password/i), "password");
    userEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/failed/i)).toBeInTheDocument();
  });
});
```

テストケースを分割したことにより、モックの実装は単純になりました。またテストケース内で何をテストしているのか明確になったので、それぞれ読みやすくなったのではないかと思います。

### 例2 テーブル駆動テスト

もう 1 つの例を見てみましょう。Jest のテーブル駆動テストは境界値テストを書きたい場合など、多くの入力値が存在するテストを書く場合に有効です。例えば、次のように 8 文字以上 32 文字以内のバリデーションを行うコードをテストすることを考えてみましょう。次のコードでは、バリデーションをパスした場合（`{ success: true }`）`data` に入力した値が入っています。

```tsx
type Error = { success: false, data: undefined };

type Success<T> = { success: true; data: T };

type Result<T> = Error | Success<T>;

/**
 * パスワードの入力値の検証を行う
 * - 8文字以上
 * - 32文字以下
 */
export const validPassword = (password: string): Result<string> => {
  if (password.length < 8) {
    return { success: false, data: undefined };
  }
  if (password.length > 32) {
    return { success: false, data: undefined };
  }
  return { success: true, data: password };
};
```

このコードの境界値をテストするために、入力値が 7 文字、8 文字、32 文字、33 文字のそれぞれパターンが必要です。テーブル駆動を使ってテストを書いてみましょう。

```ts:validation.spec.ts
import { validPassword } from "./validation";

describe("validPassword", () => {
  test.each`
    input                                  | success
    ${`1234567`}                           | ${false}
    ${`12345678`}                          | ${true}
    ${`12345678901234567890123456789012`}  | ${true}
    ${`123456789012345678901234567890123`} | ${false}
  `("パスワードの入力値の検証を行う", ({ input, success }) => {
    expect(validPassword(input)).toEqual({
      success,
      data: success ? input : undefined,
    });
  });
});

```

このテストの中でも、三項演算子による条件分岐が出現してしまっています。バリデーションの返却値の `data` の値が正しいかどうか検証したいのですが、この値はバリデーションが成功したかどうかによって変わります。そのため三項演算子を用いて期待される結果が `undefiend` か入力値がそのまま返却されるか検証しているのです。

一見余分なコードを書かない賢いコードのように見えます。しかし、`test.each` のテーブルの箇所だけ見ても期待される結果が読み取れず `expect` の箇所と上下に行き来する必要があるので、コードを読む際の認知不可は少々高まります。

### 期待結果をベタ書きする

それではこのテストコードから条件分岐を取り除いてみましょう。期待結果を条件分岐で算出するのではなく、単純にベタ書きするように修正しましょう。

```ts:validation.spec.ts
import { validPassword } from "./validation";

describe("validPassword", () => {
  test.each`
    input                                  | success  | data
    ${`1234567`}                           | ${false} | ${undefined}
    ${`12345678`}                          | ${true}  | ${`12345678`}
    ${`12345678901234567890123456789012`}  | ${true}  | ${`12345678901234567890123456789012`}
    ${`123456789012345678901234567890123`} | ${false} | ${undefined}
  `("パスワードの入力値の検証を行う", ({ input, success, data }) => {
    expect(validPassword(input)).toEqual({
      success,
      data,
    });
  });
});
```

このように期待結果をベタ書きすると、テーブル部分を見ただけでわかるようになり、以前よりも読みやすくなったのではないでしょうか。またテストコード自体を間違える余地もなくなりましたので、テストコードの質も保たれるようになっています。

## まとめ

- テストコード内に if 文があるのはアンチパターン
- if 文がある場合、テストケースを分割できる可能性がある
- 期待結果は算出せずにベタ書きする

## 参考

- [過度なDRYを行わず、APIドキュメントだと思って書く　脳内メモリを消費させない“リーダブルなテストコード”の書き方 - ログミーTech](https://logmi.jp/tech/articles/327449)
- [第2回　偽陽性と偽陰性 ～自動テストの信頼性をむしばむ現象を理解する～ | gihyo.jp](https://gihyo.jp/dev/serial/01/savanna-letter/0002)
- [単体テストの考え方/使い方 | マイナビブックス](https://book.mynavi.jp/ec/products/detail/id=134252)

