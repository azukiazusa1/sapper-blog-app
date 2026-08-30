---
id: 5Bg7v78qD4H823jdEqV-o
title: "Zod の z.compile() でバリデーションを高速化する"
slug: "zod-compile-validation"
about: "Zod 4.5 で、スキーマを実行時に最適化された JavaScript へ変換する z.compile() が追加されました。コンパイル済みスキーマは通常のスキーマと同じ API を保ちながら、複雑なデータの検証を高速化します。この記事では基本的な使い方と仕組みを紹介します。"
createdAt: "2026-08-30T11:18+09:00"
updatedAt: "2026-08-30T12:16+09:00"
tags: ["TypeScript", "Zod"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3LVmxpUE20tYnv3ZG2yBal/06160d874db638a31c5df26cd1b47867/jewelry_12191-768x768.png"
  title: "宝石のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "コンパイル済みスキーマへ無効な入力を渡した場合、記事で説明されている処理はどれですか?"
      answers:
        - text: "生成された関数が詳細な ZodError を直接組み立てる"
          correct: false
          explanation: "生成された関数は詳細なエラーを組み立てません。無効な入力を検出すると内部の INVALID を返します。"
        - text: "検証を中断し、エラー情報を持たない false を返す"
          correct: false
          explanation: "コンパイル済みスキーマも通常の parse() や safeParse() と同じ API とエラーを保ちます。真偽値だけを返す機能ではありません。"
        - text: "通常のパーサーへフォールバックして詳細なエラーを生成する"
          correct: true
          explanation: "記事の通り、生成された関数が無効な入力を検出すると、Zod は通常のパーサーでもう 1 度解析して従来と同じ詳細なエラーを生成します。"
        - text: "スキーマを再コンパイルしてから同じ入力を検証する"
          correct: false
          explanation: "無効な入力のたびにスキーマを再コンパイルするわけではありません。既存の通常パーサーへ処理を戻します。"
    - question: "import \"zod/compile\" による自動コンパイルの挙動として正しいものはどれですか?"
      answers:
        - text: "インポートより前に作成済みのスキーマも含め、読み込み時に一括でコンパイルする"
          correct: false
          explanation: "対象になるのはインポート後に作成されたスキーマです。また、読み込み時ではなく最初の検証時に遅延コンパイルされます。"
        - text: "スキーマを利用するたびに新しい検証関数を生成する"
          correct: false
          explanation: "生成は最初の検証時に行われます。parse() の呼び出しごとに再コンパイルする仕組みではありません。"
        - text: "アプリケーションのビルド時に検証用の JavaScript ファイルを出力する"
          correct: false
          explanation: "コンパイルはアプリケーションのプロセス内で行われ、別の JavaScript ファイルは生成しません。"
        - text: "インポート後に作成されたスキーマを、最初の検証時に遅延コンパイルする"
          correct: true
          explanation: "記事の通り、zod/compile より後に作成されたスキーマは、最初に parse() または safeParse() が呼ばれたときにコンパイルされます。"
    - question: "動的な文字列からのコード生成が禁止される環境で z.compile() を呼び出した場合、記事で確認された結果はどれですか?"
      answers:
        - text: "通常のパーサーへフォールバックし、検証は成功する"
          correct: true
          explanation: "Node.js でコード生成を禁止した検証では、コンパイルできなくても通常のパーサーへ戻り、入力を検証できました。"
        - text: "CSP の設定が自動的に unsafe-eval を許可する"
          correct: false
          explanation: "Zod が CSP を変更することはありません。コード生成が拒否された場合は通常のパーサーへフォールバックします。"
        - text: "すべての Zod スキーマが利用できなくなる"
          correct: false
          explanation: "コンパイルによる最適化は利用できませんが、通常のパーサーによる検証は継続できます。"
        - text: "ビルド時コンパイルへ自動的に切り替わる"
          correct: false
          explanation: "z.compile() はビルド時に別の方式へ切り替える機能ではありません。プロセス内のコード生成が拒否されると通常のパーサーへ戻ります。"

published: true
---

Web API のリクエストや外部ファイルから受け取ったデータを Zod で検証する場合、通常はスキーマの構造をたどりながら入力を解析します。この処理は扱いやすく詳細なエラーを得られる一方で、同じ複雑なスキーマを何度も使う処理では実行時間が無視できなくなる可能性があります。

Zod 4.5 では、スキーマから検証に特化した JavaScript の関数を生成する [`z.compile()`](https://zod.dev/compile) が追加されました。コンパイル済みスキーマは通常のスキーマと同じ API、型、エラーを保ちながら、有効な入力を高速に処理します。

この記事では `z.compile()` の基本的な使い方と高速になる仕組みを確認し、実測した性能、`import "zod/compile"` による自動コンパイル、CSP やバンドルサイズといった注意点を紹介します。

## Zod の実行時検証にかかるオーバーヘッド

Zod はスキーマを JavaScript のオブジェクトとして保持しています。たとえば、以下の `ProductSchema` はオブジェクト、文字列、数値、整数という複数のスキーマから構成されています。

```ts
const ProductSchema = z.object({
  name: z.string(),
  quantity: z.number().int().positive(),
});

ProductSchema.parse({ name: "Apple", quantity: 3 });
```

`parse()` が呼び出されると、Zod は入力がオブジェクトか確認し、`name` と `quantity` をそれぞれの子スキーマへ渡します。`quantity` では数値であることに加えて、整数か、0 より大きいかというチェックも実行されます。

通常のパーサーの考え方を単純化すると、以下のようにスキーマツリーをたどる処理として表せます。このコードは説明用の疑似コードです。

```ts
function parseObject(
  shape: Record<string, Schema>,
  input: Record<string, unknown>,
) {
  const output: Record<string, unknown> = {};
  const issues: Issue[] = [];

  for (const key of Object.keys(shape)) {
    const result = parseNode(shape[key], input[key]);

    if (result.issues.length > 0) {
      issues.push(
        ...result.issues.map((issue) => ({
          ...issue,
          path: [key, ...issue.path],
        })),
      );
    } else {
      output[key] = result.value;
    }
  }

  return { value: output, issues };
}
```

`parseNode()` は渡されたスキーマの種類に対応する処理を呼び出します。子スキーマは `{ value, issues }` のような検証状態を返し、親のオブジェクトスキーマは Issue のパスへプロパティ名を加えながら結果を集約します。Zod の実際の実装でも、各スキーマは内部の `run` 関数を持ち、入力値と Issue の配列を含む Payload を受け渡します。

さらに、`z.object()` は入力オブジェクトをそのまま返すわけではありません。デフォルトではスキーマに定義されていないキーを取り除き、検証済みの値から新しい出力オブジェクトを組み立てます。そのため正常系でも、型の判定だけでなく出力の構築が必要です。

オブジェクトの中に配列や別のオブジェクトがある場合、この処理は入れ子になります。後ほど使用する注文スキーマでは、外側の注文、注文者、商品の配列、配列内の各商品、その商品の各プロパティという順番でスキーマをたどります。10 個の商品に 4 個ずつプロパティがあれば、商品部分だけでも 40 個の値を検証し、それぞれの結果を親へ戻す必要があります。

`typeof input.name === "string"` という型判定自体は単純であるものの、この判定へ到達するまでと、判定結果を親スキーマへ返すためにも汎用的な処理が必要になるのです。スキーマが複雑になり、同じ検証を繰り返すほど、このコストが積み重なります。

一方、あるスキーマが完成した後は、検証するプロパティと型は変わりません。スキーマの構造を事前に読み取り、その構造だけに最適化した関数を 1 度生成すれば、検証のたびに汎用的な処理を繰り返す必要がなくなります。これが `z.compile()` の基本的な考え方です。

## `z.compile()` でスキーマをコンパイルする

まず Zod 4.5.0 をインストールします。

```bash
npm install zod@4.5.0
```

例として、注文データを検証するスキーマを定義します。注文者、商品の配列、注文状態を含む、入れ子になったオブジェクトです。

```ts
import * as z from "zod";

const OrderSchema = z.object({
  id: z.uuid(),
  customer: z.object({
    name: z.string(),
    email: z.email(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive(),
    }),
  ),
  status: z.enum(["pending", "paid", "shipped"]),
});
```

`z.compile()` にスキーマを渡すと、コンパイル済みのコピーが返ります。元の `OrderSchema` は変更されません。

```ts
const CompiledOrderSchema = z.compile(OrderSchema);

const order = CompiledOrderSchema.parse(input);
```

`CompiledOrderSchema` も通常の Zod スキーマです。`parse()` や `safeParse()` といった同じメソッドを呼び出せます。入力型と出力型も変わりません。そのため、呼び出し側のコードを変更せず、性能が重要なスキーマだけを置き換えられます。

コンパイルできないスキーマを誤って指定していないか確認したい場合は、`strict` オプションを使用できます。

```ts
const CompiledOrderSchema = z.compile(OrderSchema, { strict: true });
```

通常の `z.compile()` はコンパイルできない場合に元のスキーマを返し、通常のパーサーを使い続けます。`strict: true` を指定すると、コンパイルできない理由に応じて `ZodCompileAsyncError` または `ZodCompileUnsupportedError` が投げられます。コンパイルできないスキーマを誤って渡していないか検出したい場合に利用できます。

たとえば、非同期の Refinement を含むスキーマはコンパイルできません。次のコードで `FallbackUserSchema` はコンパイル済みのコピーではなく、渡した `AsyncUserSchema` そのものになります。

```ts
const AsyncUserSchema = z
  .object({ username: z.string() })
  .refine(async ({ username }) => {
    return await isUsernameAvailable(username);
  });

// コンパイル不可のため、AsyncUserSchema がそのまま返る
const FallbackUserSchema = z.compile(AsyncUserSchema);
```

同じスキーマを `strict: true` でコンパイルすると、元のスキーマへ戻る代わりに `ZodCompileAsyncError` が投げられます。

```ts
z.compile(AsyncUserSchema, { strict: true });
// ZodCompileAsyncError: z.compile: async .refine() predicates are not supported
```

:::info
`strict: true` が例外を投げるのは、`z.compile()` に渡したスキーマ自体がコンパイルできない場合です。オブジェクトのプロパティなど入れ子の位置にコンパイルできないスキーマがある場合、Zod はその部分だけ通常のパーサーへ戻して残りをコンパイルするため、例外は投げられません。
:::

Zod 4.5.0 の公式ドキュメントでは、次の機能を含むスキーマもコンパイルできない、または高速化の対象にならないとされています。

- 非同期の Refinement、Transform、Check
- `z.xor()`
- 再帰的なスキーマ
- `z.coerce.*`
- 独自の `when` を持つ Check
- コールバックを渡した `.catch()`

### 最終的なスキーマをコンパイルする

コンパイル済みスキーマに `.extend()`、`.refine()`、`.optional()` などを呼び出すと、新しく派生したスキーマは未コンパイルになります。Zod のスキーマ操作は元のスキーマを変更せず、新しいスキーマを返すためです。

```ts
// refine() が返すスキーマはコンパイルされていない
const CompiledFirst = z.compile(OrderSchema).refine(
  (order) => order.items.length > 0,
);

// スキーマを完成させてからコンパイルする
const CompiledLast = z.compile(
  OrderSchema.refine((order) => order.items.length > 0),
);
```

`z.compile()` はスキーマをすべて組み立てた後に呼び出す必要があります。

## 生成された JavaScript で高速になる仕組み

Zod の[公式ドキュメント](https://zod.dev/compile#how-it-works)では、`z.compile()` はスキーマ全体を 1 度走査し、平坦でループの少ない JavaScript のコードを生成すると説明されています。生成されたコードは `new Function()` によって実行可能な関数になります。

たとえば、`x` と `y` を持つオブジェクトの検証は、以下のような関数に変換されます。

```js
const isPoint = new Function(
  "input",
  `
    if (typeof input !== "object" || input === null) return false;
    if (typeof input.x !== "number") return false;
    if (typeof input.y !== "number") return false;
    return true;
  `,
);
```

生成された関数では、対象のスキーマに必要な `typeof` とプロパティ参照が順番に並びます。汎用的なパーサーを介してノードごとの種類を判定する必要がなく、JavaScript エンジンも特定の処理に最適化しやすくなります。

公式はこの仕組みを AOT（Ahead-of-Time）コンパイルと呼んでいます。ここでの「Ahead（事前）」とは、スキーマを検証する前にコードを生成するという意味です。ビルド時に別のファイルを生成するわけではなく、コンパイルはアプリケーションのプロセス内で実行されます。

### 入力がスキーマに一致しない場合は通常のパーサーへ戻る

生成された関数の役割は、有効な入力を高速に処理することです。入力がスキーマに一致しない場合、生成された関数は内部の `INVALID` という値を返し、Zod は通常のパーサーでもう 1 度入力を解析します。

コンパイル済みスキーマの `parse()` を 1 回呼び出すと、その内部では概念的に次の処理が行われます。このコードは Zod の実装を単純化した擬似コードです。

```ts
function compiledParse(input: unknown) {
  // 1. 生成された高速な関数で検証する
  const output = generatedParser(input);

  // 2. INVALID ではない = 有効な入力の場合は、生成された関数の結果を返す
  if (output !== INVALID) {
    return output;
  }

  // 3. 不一致の場合だけ、元の通常パーサーで再検証する
  return originalParse(input);
}
```

有効な入力では `generatedParser()` の結果がそのまま返るため、検証処理は高速な経路だけで完了します。無効な入力では、まず `generatedParser()` が不一致を検出し、続いて `originalParse()` が同じ入力を検証して詳細な Issue を生成します。つまり、`parse()` の呼び出しは 1 回ですが、無効な入力に対する検証処理は内部的に 2 段階で実行されます。

通常のパーサーへ戻ることで、コンパイル版にエラー生成の仕組みを重複して実装せず、従来と同じパス、エラーコード、メッセージを返せます。この設計は有効な入力では高速化を実現しつつ、無効な入力でも従来の挙動を維持するというトレードオフです。

無効な入力に対しては、2 段階の検証によって処理時間もわずかに増えます。前掲の注文スキーマに無効なデータを渡して計測したところ、通常版の 2961 ns に対してコンパイル版は 3084 ns でした。無効な入力の割合が高い処理では、コンパイルによる恩恵は小さくなります。

:::warning
副作用のある Refinement や Transform は、無効な入力のときに 2 回実行されるため注意してください。
:::

## 性能とコンパイルコストを測定する

同じ注文データを 500,000 回検証し、通常版とコンパイル版の処理時間を比較しました。計測前にはそれぞれ 20,000 回実行して JavaScript エンジンをウォームアップしています。

```ts
import { performance } from "node:perf_hooks";

const ITERATIONS = 500_000;
const WARMUP_ITERATIONS = 20_000;

function measureParse(schema: z.ZodType, iterations: number): number {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    schema.parse(validOrder);
  }

  return performance.now() - start;
}

const CompiledOrderSchema = z.compile(OrderSchema, { strict: true });

measureParse(OrderSchema, WARMUP_ITERATIONS);
measureParse(CompiledOrderSchema, WARMUP_ITERATIONS);

const uncompiledMs = measureParse(OrderSchema, ITERATIONS);
const compiledMs = measureParse(CompiledOrderSchema, ITERATIONS);
```

同じコマンドを 5 回実行した中央値は次のとおりです。

| スキーマ     | 1 回あたりの時間 | 通常版比の速度 |
| ------------ | ----------------: | -------------: |
| 通常版       |            970 ns |              - |
| コンパイル版 |            209 ns |     4.64 倍高速 |

今回の環境とスキーマでは、コンパイル版が約 4.64 倍高速でした。[Zod 4.5.0 のリリースノート](https://github.com/colinhacks/zod/releases/tag/v4.5.0)では、オブジェクト、配列、Union などで約 3〜7 倍、複雑なスキーマほど大きな改善が報告されています。ただし、コンパイル自体にもスキーマを走査して関数を生成するコストがあるため、例えば 1 回しか使わないスキーマまで無条件にコンパイルするのは、性能上のメリットが少ない可能性があります。

## `import "zod/compile"` で自動コンパイルする

多数のスキーマをアプリケーション全体でコンパイルする場合は、エントリーポイントの先頭で `zod/compile` をインポートできます。

```ts
import "zod/compile";
import * as z from "zod";

const schema = z.object({ name: z.string() });

// 最初の parse() で遅延コンパイルされる
schema.parse({ name: "Alice" });
```

このインポートより後に作成されたスキーマは、最初に `parse()` または `safeParse()` が呼ばれたときにコンパイルされます。使われなかったスキーマはコンパイルされません。

モジュールの評価順によっては、`zod/compile` より先に別のモジュールでスキーマが作られる可能性があります。Node.js では起動オプションとして指定することで、アプリケーションのモジュールより先に読み込めます。

```bash
# ES Modules
node --import zod/compile app.js

# CommonJS
node --require zod/compile app.cjs
```

## `z.compile()` を利用するときの注意点

### CSP で動的なコード生成が禁止される場合

`z.compile()` は内部で `new Function()` を使用します。CSP の `script-src` で `unsafe-eval` が許可されていないブラウザや、動的な文字列からのコード生成を禁止するランタイムでは、生成した関数を実行できません。

明示的に `z.compile()` を呼び出すと、Zod はスキーマから検証コードを生成し、そのコードを直接 `new Function()` へ渡します。処理を単純化すると次のようになります。

```ts
function compile(schema, options) {
  const code = generateValidationCode(schema);

  try {
    // ここで CSP によって new Function() が拒否されると例外が投げられる
    const factory = new Function(
      "INVALID",
      `return (input) => { ${code} }`,
    );
    const parser = factory(INVALID);

    return createCompiledCopy(schema, parser);
  } catch (error) {
    if (options?.strict) {
      throw error;
    }

    return schema;
  }
}
```

通常の `z.compile()` では、CSP によって `new Function()` が拒否されると例外を捕捉し、渡されたスキーマをそのまま返します。そのため、コンパイルによる高速化は行われませんが、通常のパーサーによる検証は継続できます。`strict: true` を指定した場合はフォールバックせず、エラーが投げられます。

`import "zod/compile"` による自動コンパイルでは、コンパイラーを呼び出す前に `jitless` の設定を確認します。

```ts
function autoCompile(schema) {
  if (globalConfig.jitless) {
    return schema;
  }

  return compile(schema);
}
```

`jitless: true` の場合は `compile()` を呼び出さないため、`new Function()` を試すこと自体がありません。コード生成できないことが事前に分かっている環境では、スキーマを作成する前に設定します。

```ts
import * as z from "zod";
import "zod/compile";

z.config({ jitless: true });

const schema = z.object({ name: z.string() });
```

この設定により、`import "zod/compile"` による自動コンパイルが無効になります。CSP 違反を検出してから戻るのではなく、最初から通常のパーサーを使うため、不要な `securitypolicyviolation` イベントや CSP レポートの発生も避けられます。

なお、Zod の作者である Colin McDonnell 氏は、[X の投稿](https://x.com/colinhacks/status/2093734950914896040)で、将来のリリースではコンパイルが Zod のデフォルトになる可能性があると述べています。

### ブラウザではバンドルサイズが増える

コンパイラーはスキーマからコードを生成するための処理を含みます。[公式のブログ](https://zod.dev/blog/introducing-z-compile#tradeoffs)によると、`z.compile()` を呼び出すか `zod/compile` をインポートすると、Zod のコンパイラーによってバンドルが約 7 KB gzip（minify 後で約 28 KB）増えると報告されています。

サーバーで複数回スキーマが検証される場合は、バンドルサイズより継続的なスループットの改善が重要になる場合があります。一方、ブラウザ、短時間で終了する CLI、コールドスタートが重要な環境では、追加のコードとコンパイル時間が性能改善を上回る可能性があります。

## まとめ

- `z.compile()` は完成した Zod スキーマから有効な入力を高速に処理する JavaScript 関数を生成し、同じ API、型、詳細なエラーを持つスキーマのコピーを返す
- 無効な入力では通常のパーサーへフォールバックする
- `import "zod/compile"` をアプリケーションのエントリーポイントで読み込むと、後から作成されたスキーマを最初の検証時に自動コンパイルできる
- CSP で動的なコード生成が禁止される場合は、通常のパーサーへフォールバックするか、`jitless` を設定して自動コンパイルを無効化する
- コンパイル済みスキーマはバンドルサイズを増やすため、ブラウザや短時間で終了する CLI では注意が必要

## 参考

- [Release v4.5.0 · colinhacks/zod](https://github.com/colinhacks/zod/releases/tag/v4.5.0)
- [AOT compilation | Zod](https://zod.dev/compile)
- [Introducing z.compile() | Zod](https://zod.dev/blog/introducing-z-compile)
- [将来のリリースでコンパイルがデフォルトになる可能性についての投稿](https://x.com/colinhacks/status/2093734950914896040)
- [feat(v4): make z.compile() fall back instead of throwing by colinhacks · Pull Request #6479 · colinhacks/zod](https://github.com/colinhacks/zod/pull/6479)
- [perf(v4): close the fastpass bindings into the compiled parser by colinhacks · Pull Request #6464 · colinhacks/zod](https://github.com/colinhacks/zod/pull/6464)
