---
id: iOIakqb_QXPTBWsw9macH
title: "Vitest のモックを using で自動的に復元する"
slug: "vitest-using-mock"
about: "Vitest で作成したスパイを復元し忘れると、別のテストへモックの状態が漏れるおそれがあります。Vitest 3.2.0 以降では `vi.spyOn()` の戻り値を `using` で宣言すると、スコープを抜けるときに元の実装を自動的に復元できます。この記事では `using` による自動復元の仕組みを紹介します。"
createdAt: "2026-08-23T15:55+09:00"
updatedAt: "2026-08-23T15:55+09:00"
tags: ["Vitest", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1pE2cdhmrrjTHCr3ukvqap/acc5334983d977d765969aa27e51b952/yakitori_liver_16126-768x591.png"
  title: "焼き鳥のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`vi.spyOn()` の戻り値を `const` ではなく `using` で宣言した場合、記事で説明されている挙動はどれですか？"
      answers:
        - text: "ブロックを抜けても spy が維持される"
          correct: false
          explanation: "spy が維持されるのは `const` 宣言の場合です。`using` 宣言ではスコープを抜けると自動的に `mockRestore()` が呼ばれ、元の実装に戻ります。"
        - text: "宣言したスコープを抜けるときに `mockRestore()` が自動的に呼ばれる"
          correct: true
          explanation: "記事の通り、`using` で宣言されたスパイは破棄処理として `mockRestore()` が呼ばれ、スコープを抜けた時点で元の実装に戻ります。"
        - text: "この変数に再代入できなくなる"
          correct: false
          explanation: "変数に再代入できないのは `const` 宣言も同様です"
        - text: "この変数が使われていないことが検知できる"
          correct: false
          explanation: "`using` 宣言は変数の使用有無を検知するものではなく、破棄処理を自動で呼ぶための仕組みです。"
    - question: "記事の説明によると、`using` へ代入できるオブジェクトが満たすべき条件はどれですか？"
      answers:
        - text: "`Symbol.iterator` をキーとするメソッドを持っていること"
          correct: false
          explanation: "`Symbol.iterator` は反復処理のためのシンボルで、Explicit Resource Management とは関係ありません。"
        - text: "`dispose` という名前の通常のメソッドを持っていること"
          correct: false
          explanation: "文字列のキー `dispose` ではなく、well-known symbol である `Symbol.dispose` をキーにする必要があると記事では説明されています。"
        - text: "`Disposable` クラスを継承していること"
          correct: false
          explanation: "特定のクラスを継承する必要はありません。記事の例でも、単なるオブジェクトリテラルが `using` に代入できることが示されています。"
        - text: "`Symbol.dispose` をキーとするメソッドを持っていること"
          correct: true
          explanation: "記事の通りです。Vitest 3.2.0 ではモック関数にこの `Symbol.dispose` が実装され、その中で `mockRestore()` が呼ばれるようになっています。"
published: true
---
Vitest によるテストで外部 API や現在時刻などに依存する処理を扱うとき、`vi.spyOn()` を使ってオブジェクトのメソッドを一時的にモックすることがあります。スパイは対象のメソッドを書き換えるため、テストの終了後に元の実装へ戻さなければいけません。復元を忘れると、別のテストがモックされた実装を呼び出してしまい、テストの実行順序によって結果が変わる原因になります。

```ts
describe("テストスイート A", () => {
  test("テスト A1", () => {
    const logSpy = vi.spyOn(logger, "log").mockReturnValue("mocked message");
     // ...テストの中身
     // 必ず mockRestore() を呼び出す必要がある!
     logSpy.mockRestore();
  });
});
```

しかし、テストブロックのたびに毎回 `mockRestore()` を呼び出すのは少々面倒です。また、アサーションの失敗や予期しない例外により `mockRestore()` より前で処理が終了すると、復元処理は実行されないという問題もあります。

Vitest 3.2.0 以降では、`vi.spyOn()` の戻り値を JavaScript の [`using` 宣言](https://github.com/tc39/proposal-explicit-resource-management)に代入できます。`using` で宣言されたスパイは、スコープを抜けるときに自動的に `mockRestore()` が呼ばれます。これにより、テストブロックの中で復元処理を忘れる心配がなくなります。

```ts
describe("テストスイート A", () => {
  test("テスト A1", () => {
    using logSpy = vi.spyOn(logger, "log").mockReturnValue("mocked message");
    // ...テストの中身
    // スコープを抜けると自動的に mockRestore() が呼ばれる
  });
});
```

この記事では、`using` を使って Vitest のスパイを自動的に復元する方法を紹介します。

## モックを元の実装へ戻す

はじめに、`vi.spyOn()` で作成したスパイを手動で復元する方法を確認しましょう。スパイの対象として、メッセージを整形する `logger.log()` メソッドを用意します。

```ts:logger.ts
export const logger = {
  log(message: string) {
    return `[info] ${message}`;
  },
};
```

以下のテストでは `logger.log()` をスパイし、戻り値を `"mocked message"` に変更しています。テストの最後に `mockRestore()` を呼び出すことで、`logger.log()` を元の実装へ戻します。

```ts:logger.test.ts
import { expect, test, vi } from "vitest";
import { logger } from "./logger";

test("ログを出力する", () => {
  const logSpy = vi
    .spyOn(logger, "log")
    .mockReturnValue("mocked message");

  expect(logger.log("hello")).toBe("mocked message");
  expect(logSpy).toHaveBeenCalledOnce();

  logSpy.mockRestore();
});
```

このコードはテストが最後まで成功すれば正しく復元されます。しかし、アサーションの失敗や予期しない例外により `mockRestore()` より前で処理が終了すると、復元処理は実行されません。

スパイを確実に復元する方法として、[`vi.restoreAllMocks()`](https://vitest.dev/api/vi#vi-restoreallmocks) を `afterEach()` から呼び出す方法があります。

```ts
import { afterEach, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
});
```

しかし `afterEach()` ブロックはテストブロックから離れた場所に定義されることが多く、「このテストで作ったスパイがどこで復元されるのか」という対応関係が少々わかりにくくなるという欠点もあります。

また、Vitest の設定で [`restoreMocks: true`](https://vitest.dev/config/#restoremocks) を指定すると、各テストの開始前にスパイを復元できます。これらはテストスイート全体で一律に復元したい場合に適しています。ただし、安易にグローバル設定を書き換えられないような事情もあるでしょう。テストごとに復元の有無を制御したい場合は、`using` 宣言を使う方法が便利です。

## `using` 宣言でスパイを自動的に復元する

`using` 宣言を使うと `mockRestore()` をブロックの終了時に自動的に呼び出せます。`vi.spyOn()` の戻り値を `const` ではなく `using` で宣言してみましょう。

```ts:logger.test.ts {5-7}
import { expect, test, vi } from "vitest";
import { logger } from "./logger";

test("ログを出力する", () => {
  using logSpy = vi
    .spyOn(logger, "log")
    .mockReturnValue("mocked message");

  expect(logger.log("hello")).toBe("mocked message");
  expect(logSpy).toHaveBeenCalledOnce();
});
```

テスト関数のスコープを抜けると、`logSpy` の破棄処理として `mockRestore()` が自動的に呼ばれます。`afterEach()` で復元する方法と違い、スパイの復元が必要なテストブロックの近くに宣言されるため、対応関係がわかりやすくなっていますね。

`using` は [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) と呼ばれる JavaScript の新しい構文です。仕様策定は完了しており ES2027 に入る予定です。ファイルハンドルやストリームのように明示的な後片付けが必要なリソースを、変数のスコープと結び付けて管理するために提案されました。

`using` へ代入できるオブジェクトは、`Symbol.dispose` をキーとするメソッドを持つ必要があります。

```ts
const resource = {
  [Symbol.dispose]() {
    console.log("リソースを破棄しました");
  },
};
```

`using value = resource` を含むブロックの処理が終わると、`resource[Symbol.dispose]()` が呼び出されます。`try` / `finally` と同じように、ブロック内で例外が発生しても破棄処理は実行されます。

```ts
{
  using value = resource;

  //...ブロックの処理
  // ブロックを抜けるときに resource[Symbol.dispose]() が呼ばれる
}
```

Vitest 3.2.0 では、`vi.spyOn()` や `vi.fn()` が返すモック関数に `Symbol.dispose` が実装され、`[Symbol.dispose]()` は `mockRestore()` を呼び出すようになっています。これにより、`using` で宣言されたスパイは、スコープを抜けるときに自動的に復元されるのです。

:::warning
`using` は比較的新しい構文です。型チェックには TypeScript 5.2、実行には Node.js 24.0 以降が必要です。
:::

## まとめ

- Vitest 3.2.0 以降では、`vi.spyOn()` の戻り値を `using` で宣言するとスコープ終了時に `mockRestore()` が自動的に呼ばれる
- `using` の破棄処理は正常終了だけでなく、例外や早期リターンによってスコープを抜ける場合にも実行される

## 参考

- [Auto-Cleanup with using | Vitest](https://main.vitest.dev/guide/recipes/explicit-resources)
- [Vitest 3.2 is out! | Vitest](https://vitest.dev/blog/vitest-3-2.html)
- [Vi | Vitest](https://vitest.dev/api/vi)
- [TypeScript 5.2 | TypeScript](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html)
- [ECMAScript Explicit Resource Management | TC39](https://github.com/tc39/proposal-explicit-resource-management)
- [Finished Proposals | TC39](https://github.com/tc39/proposals/blob/main/finished-proposals.md)
- [Node.js 24.0.0 | Node.js](https://nodejs.org/en/blog/release/v24.0.0)
