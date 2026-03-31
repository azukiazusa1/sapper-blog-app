---
id: nzFlJ1pMORXNDjlRy93Qy
title: "Claude Code から Codex を呼び出すためのプラグイン codex-plugin-cc"
slug: "claude-code-codex-plugin"
about: "Codex プラグインを使用すると、Claude Code から Codex を呼び出してコードレビューをしたり、タスクを委任するといったことが簡単にできるようになります。この記事では、Codex プラグインの使用方法と、どのような方法で Codex を呼び出しているのかといった内部の仕組みについて紹介します。"
createdAt: "2026-03-31T19:00+09:00"
updatedAt: "2026-03-31T19:00+09:00"
tags: ["claude-code", "codex"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1UnLUyBA7xUhdwzcC9DcD1/fdb3f3d082c7f4c7f3e8bdb4c699e2df/shrimp-mayonnaise_gunkan-sushi_21447-768x670.png"
  title: "エビマヨ軍艦のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code に Codex プラグインをインストールする際、プラグインのインストールコマンドを実行する前に必要な手順はどれか？"
      answers:
        - text: "Codex の API キーを Claude Code の環境変数に設定する"
          correct: false
          explanation: "記事では API キーの設定ではなく、codex login による認証が必要と説明されています。環境変数への API キー設定は手順に含まれていません。"
        - text: "Claude Code の設定ファイルに Codex プラグインのパスを手動で追加する"
          correct: false
          explanation: "設定ファイルの手動編集は不要です。マーケットプレイスの追加と /plugin install コマンドで完結します。"
        - text: "/plugin install コマンドでプラグインを直接インストールする"
          correct: false
          explanation: "プラグインをインストールする前に、そのプラグインを配布するマーケットプレイスを /plugin marketplace add で追加しておく必要があります。"
        - text: "プラグインを配布するマーケットプレイスを /plugin marketplace add で追加する"
          correct: true
          explanation: "記事では、プラグインのインストール前にマーケットプレイスの追加が必要であると説明されています。Codex プラグインの場合は /plugin marketplace add openai/codex-plugin-cc を実行します。"
    - question: "Codex プラグインの各コマンド（/codex:review, /codex:setup など）に共通する内部的な実行の仕組みとして正しいものはどれか？"
      answers:
        - text: "各コマンドがそれぞれ独立したスクリプトファイルを持ち、直接 Codex CLI を呼び出している"
          correct: false
          explanation: "各コマンドは独立したスクリプトを持つのではなく、共通の codex-companion.mjs を引数を変えて呼び出す構造になっています。"
        - text: "各コマンドは MCP サーバーとして公開された Codex のエンドポイントに直接リクエストを送っている"
          correct: false
          explanation: "記事では MCP サーバーとしての公開は検討されたものの採用されず、JSON RPC 2.0 ベースの App Server が実装されたと説明されています。"
        - text: "各コマンドの定義ファイルから codex-companion.mjs が引数付きで呼び出され、引数に応じて処理が分岐する"
          correct: true
          explanation: "記事では /codex:review は review 引数、/codex:setup は setup 引数のように、共通の codex-companion.mjs を呼び出し、内部で引数に応じて分岐する構造が説明されています。"
        - text: "各コマンドは Claude Code の Agent ツールを使って Codex のプロンプトを直接実行している"
          correct: false
          explanation: "コマンドは Agent ツール経由ではなく、Bash で codex-companion.mjs を実行する形で処理されています。"

published: true
---

[Claude Code](https://code.claude.com/docs/en/overview) でコードを実装（計画・生成）させてから、[Codex](https://developers.openai.com/codex/cli) にレビューさせるというワークフローが流行りつつあります。筆者の観測では、このワークフローの強みはモデルの強みを補完できる点にあります。Claude Code は設計力が高くシステム全体の構造を考えるのが得意であり、巨大なコンテキストウィンドウを扱えるため、抽象的なゴールから計画を立てたうえで動くコードを生成させるのに適しています。一方で Codex は深い推論を時間をかけて行う論理的思考力の高さから、細かい穴やエッジケースを洗い出すのが上手であると評価されています。Claude Code の創造性と Codex の批判的思考力を組み合わせることで、より質の高いコードを実装できる可能性が高まります。

Claude Code のレートリミットが以前より厳しくなったという点も流行の背景にあると考えられます。複数のモデルを組み合わせればその分レートリミットを分散できるため、Claude Code 単体で使用するよりも安定してワークフローを回せるようになります。

今までは Claude Code と Codex を連携させるために開発者が独自のワークフローを構築する必要がありましたが、OpenAI 公式により[Codex プラグイン](https://github.com/openai/codex-plugin-cc)がリリースされました。Codex プラグインを使用すると、Claude Code から Codex を呼び出してコードレビューをしたり、タスクを委任するといったことが簡単にできるようになります。

この記事では、Codex プラグインの使用方法と、どのような方法で Codex を呼び出しているのかといった内部の仕組みについて紹介します。

## Codex プラグインを使用するための手順

当然と言えば当然ですが、Codex プラグイン を使用するためには Claude Code と Codex の両方を使用できる環境が必要です。それぞれ以下のコマンドでインストールできます。

```bash
# Claude Code のインストール
curl -fsSL https://claude.ai/install.sh | bash
# Codex CLI のインストール
npm install -g @openai/codex
```

Codex CLI をインストールしたらあらかじめログインしておいてください。

```bash
codex login
```

Claude Code のプラグインをインストールするためには、対象のプラグインを配布するマーケットプレイスをあらかじめ Claude Code に追加しておく必要があります。ここでは `openai/codex-plugin-cc` マーケットプレイスを追加します。Claude Code を起動して、以下のコマンドを実行してください。

```bash
/plugin marketplace add openai/codex-plugin-cc
```

マーケットプレイスを追加したら、次に `codex` プラグインをインストールします。

```bash
/plugin install codex@openai-codex
```

プラグインのインストールが完了したら、Claude Code を再起動するか以下のコマンドを実行してプラグインをリロードしてください。

```bash
/reload-plugins
```

正常にプラグインがインストールされていれば、`/codex` と入力したときに `/codex:setup` や `/codex:review` といったコマンドが候補に表示されるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5y1aH0KSovNTH00H5rZl32/e0b00646eb353ec15d101b90d125d230/image.png)

`/codex:setup` コマンドを実行すると、`codex` が利用可能な状態かどうかのチェックが行われます。問題がなければ「Codex はすでにセットアップ済です」といったメッセージが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7pnUCUA5NDTeUSRD15ohq4/61648fc64a9d7c4987651c96eea174fe/image.png)

試しに `codex` コマンドをアンインストールしてから `/codex:setup` を実行してみると、Codex CLI のインストールを今実行するかどうかの確認が表示されます。ここで「Install Codex」を選択すると、Codex CLI のセットアップを実行してくれます。

![](https://images.ctfassets.net/in6v9lxmm5c8/jHq832s2MMrpj8OQXvQsc/fc4d3f8ad24bcbba4210c71b5406d5af/image.png)

## Codex プラグインの使用可能なコマンド

Codex プラグインには以下のコマンドが用意されています。

- `/codex:setup`: Codex CLI のセットアップを行うコマンド。`--enable-review-gate` オプションをつけると Claude Code が停止するたびに自動で Codex にコードレビューをさせる Hooks を有効にする
- `/codex:review`: ローカルの git 状態をもとに Codex にコードレビューをさせる
- `/codex:adversarial-review`: 実装アプローチや設計に対して批判的に検証を行わせる
- `/codex:rescue`: 調査や修正、フォローアップ作業を Codex に委任する
- `/codex:status`: バックグラウンドで実行している Codex の状態や最新の Codex のジョブを確認する
- `/codex:result`: Codex の最終応答を確認する
- `/codex:cancel`: バックグラウンドで実行している Codex のジョブをキャンセルする

## Claude Code で実装して Codex にレビューしてもらう

実際に Claude Code でコードを実装してから Codex にレビューしてもらうワークフローを試してみましょう。例として簡単な API エンドポイントを実装してもらいましょう。まずは Claude Code に以下のプロンプトを与えて、コードを実装してもらいます。

```txt
取引（収入・支出）の一覧取得・作成・更新・削除を行う API エンドポイントを実装する。一覧取得にはソート・ページネーション・フィルタ機能を含む。

- GET /api/transactions 取引一覧取得
- POST /api/transactions 取引新規作成
- PUT /api/transactions/[id] 取引更新
- DELETE /api/transactions/[id] 取引削除

レスポンス例:

{
  "data": [
    {
      "id": 1,
      "categoryId": 1,
      "type": "expense",
      "amount": 1500,
      "description": "ランチ",
      "date": "2026-03-28",
      "createdAt": "2026-03-28T00:00:00.000Z",
      "updatedAt": "2026-03-28T00:00:00.000Z",
      "category": {
        "id": 1,
        "name": "食費",
        "color": "#FF6384"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

既存のコードベースに合わせて、Zod と Prisma を使用した Next.js API ルートのコードが生成されました。ぱっと見では特に大きな問題はなさそうですが、細かい穴やエッジケースが潜んでいる可能性があります。

<details>
<summary>実装されたコード例</summary>

```ts
import { type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const transactionSchema = z.object({
  categoryId: z.number().int().positive(),
  type: z.enum(["income", "expense"]),
  amount: z.number().int().positive(),
  description: z.string().max(255).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const VALID_SORT_FIELDS = ["date", "amount", "createdAt"] as const;
type SortField = (typeof VALID_SORT_FIELDS)[number];

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(params.get("limit") ?? "20", 10) || 20),
    );

    const sortByRaw = params.get("sortBy") ?? "date";
    const sortBy: SortField = (VALID_SORT_FIELDS as readonly string[]).includes(
      sortByRaw,
    )
      ? (sortByRaw as SortField)
      : "date";
    const sortOrderRaw = params.get("sortOrder") ?? "desc";
    const sortOrder = sortOrderRaw === "asc" ? "asc" : "desc";

    const type = params.get("type") ?? undefined;
    const categoryIdRaw = params.get("categoryId");
    const categoryId = categoryIdRaw ? parseInt(categoryIdRaw, 10) : undefined;
    const startDate = params.get("startDate") ?? undefined;
    const endDate = params.get("endDate") ?? undefined;

    const where = {
      ...(type ? { type } : {}),
      ...(categoryId && !isNaN(categoryId) ? { categoryId } : {}),
      ...(startDate || endDate
        ? {
            date: {
              ...(startDate ? { gte: new Date(startDate) } : {}),
              ...(endDate ? { lte: new Date(`${endDate}T23:59:59.999Z`) } : {}),
            },
          }
        : {}),
    };

    const [total, transactions] = await Promise.all([
      prisma.transaction.count({ where }),
      prisma.transaction.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, color: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return Response.json({
      data: transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = transactionSchema.safeParse(body);
    if (!result.success) {
      return Response.json(
        { error: "Validation error", issues: result.error.issues },
        { status: 400 },
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: result.data.categoryId },
    });
    if (!category) {
      return Response.json({ error: "Category not found" }, { status: 404 });
    }

    const { date, ...rest } = result.data;
    const transaction = await prisma.transaction.create({
      data: { ...rest, date: new Date(date) },
      include: {
        category: { select: { id: true, name: true, color: true } },
      },
    });
    return Response.json(transaction, { status: 201 });
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

</details>

そこで `/codex:review` コマンドを実行して Codex にコードレビューをしてもらいましょう。コマンドを実行すると、バックグラウンドで実行するかフォアグラウンドで実行するかの選択肢が表示されます。ここではバックグラウンドで実行するオプションを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7ns5gHpu0kXTiKccXtne4h/6893f2d9b1a62bf8db24228b0749541a/image.png)

`/codex:status` コマンドを実行すると、Codex のジョブの進捗を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3GB5G4lyN9g3q8ccULmHOM/18c3d2218e0b6228344d08ab23e3fa99/image.png)

レビューが完了すると、Codex のレビュー結果が表示されます。ここでは「[P1] 日付フィルタを UTC ではなくローカル時刻でパースすべき」と「[P2] transaction.type と category.type が不一致の場合は拒否すべき」という 2 点の指摘がされました。バグや不整合が起こりうるポイントを具体的に指摘してくれているため、コードのどこをどのように修正すればいいのかが非常にわかりやすいです。

```txt
⏺ Codex Review

Target: working tree diff

取引エンドポイントに、少なくとも1つのユーザー影響のある正確性バグと、不整合データを書き込める問題が見つかりました。

---
[P1] 日付フィルタを UTC ではなくローカル時刻でパースすべき — route.ts:47-48

new Date("YYYY-MM-DD") を使うと UTC 基準の範囲境界になります。Asia/Tokyo などの非 UTC 環境では、シードデータのレコードがローカル深夜 = 2026-02-28T15:00:00.000Zとして保存されるため、?startDate=2026-03-01&endDate=2026-03-01のような同日クエリがそのレコードを取りこぼします。同日・月境界フィルタで不正な結果が返ります。

[P2] transaction.type と category.type が不一致の場合は拒否すべき — route.ts:92-97

作成・更新ハンドラはカテゴリの存在確認のみで、{ type: "expense", categoryId: <収入カテゴリ> }のようなペイロードも通過してしまいます。Category はすでに type を持っているため、書き込み前に両者が一致することを検証すべきです。
```

比較のためにコンテキストをクリアしてから Claude Code 自身にもレビューをしてもらいました。タイムゾーンの問題と `type` を検証すべきという指摘は Claude Code と Codex の両方から出てきました。この例では、Claude Code ではより細かい点まで指摘されているのに対して、Codex では特に重要なポイントに絞って指摘されている印象です。

`````txt
## レビュー結果

トランザクション CRUD API（`app/api/transactions/`）の新規追加です。全体的に良くまとめられていますが、いくつか指摘があります。

### 良い点
- **Zod によるバリデーション**が適切に使われている
- **ページネーション**が `GET` にきちんと実装されている（上限 100 のガード付き）
- **ソートのホワイトリスト**で任意カラム指定を防いでいる
- `Promise.all` で count と findMany を並列化している
- `params` を `Promise<{ id: string }>` として `await` しており、Next.js の新しいルートパラメータ規約に準拠している
- カテゴリの存在確認を POST/PUT で行っている

### 指摘事項

**1. バリデーションスキーマの重複** (`route.ts:5-11`, `[id]/route.ts:5-11`)
`transactionSchema` が両ファイルで全く同じ定義。共通の場所（例: `lib/validations/transaction.ts`）に切り出すと保守性が上がります。

**2. `type` フィルターの値が未検証** (`route.ts:35`)
```ts
const type = params.get("type") ?? undefined;
````

`type` クエリパラメータがそのまま `where` に渡されている。`"income" | "expense"` 以外の値が来ても Prisma がフィルターするので実害は少ないですが、意図しない値での空結果を防ぐなら検証を入れたほうが親切です。

**3. `endDate` のタイムゾーン混在** (`route.ts:48`)

```ts
...(endDate ? { lte: new Date(`${endDate}T23:59:59.999Z`) } : {}),
```

`startDate` は `new Date(startDate)` でローカルタイム解釈、`endDate` は `T23:59:59.999Z` で UTC 末尾を指定しています。日付の解釈が不統一なので、どちらかに揃えるべきです。例えば両方 UTC に揃えるなら:

```ts
...(startDate ? { gte: new Date(`${startDate}T00:00:00.000Z`) } : {}),
...(endDate ? { lte: new Date(`${endDate}T23:59:59.999Z`) } : {}),
```

**4. DELETE が削除済みオブジェクトを返している** (`[id]/route.ts:75-76`)

```ts
const transaction = await prisma.transaction.delete({ where: { id } });
return Response.json(transaction);
```

カテゴリ API の実装と合わせるなら `204 No Content` で返すのが RESTful な慣習としては一般的です。現状でも動作上問題はありませんが、API の一貫性として検討してください。

**5. PUT が全フィールド必須（PATCH 的な部分更新ができない）**
`transactionSchema` が全フィールド必須のため、PUT は完全置換のみ。意図的であれば問題ありませんが、将来 PATCH を追加する予定がなければドキュメント等で明記しておくと良いでしょう。

### まとめ

致命的な問題はなく、実用的に十分な品質です。最も実害がありそうなのは **#3 の日付タイムゾーン不統一** で、フィルター結果がずれる可能性があります。修正が必要なものがあれば対応します。

`````

## Codex プラグインはどのように動いているのか

Codex プラグインがどのように動いているのか、簡単に内部構造を見てみましょう。プラグインのディレクトリ構造は以下のようになっています。

```sh
openai-codex/plugins/codex
├── agents
│   └── codex-rescue.md
├── commands
│   ├── adversarial-review.md
│   ├── cancel.md
│   ├── rescue.md
│   ├── result.md
│   ├── review.md
│   ├── setup.md
│   └── status.md
├── hooks
│   └── hooks.json
├── prompts
│   ├── adversarial-review.md
│   └── stop-review-gate.md
├── schemas
│   └── review-output.schema.json
├── scripts
│   ├── app-server-broker.mjs
│   ├── codex-companion.mjs
│   ├── lib
│   │   ├── ...
│   ├── session-lifecycle-hook.mjs
│   └── stop-review-gate-hook.mjs
└── skills
    ├── codex-cli-runtime
    │   └── SKILL.md
    ├── codex-result-handling
    │   └── SKILL.md
    └── gpt-5-4-prompting
        ├── references
        │   ├── codex-prompt-antipatterns.md
        │   ├── codex-prompt-recipes.md
        │   └── prompt-blocks.md
        └── SKILL.md
```

基本的にユーザーが直接触るのは `commands` ディレクトリ以下のコマンド定義ファイルです。`commands` ディレクトリには先程紹介した `/codex:setup` や `/codex:review` といったコマンドの定義ファイルが置いてあります。その他のスキルやエージェント、プロンプト、コマンドを実行するために内部的に呼び出されるものです。例えば `codex-cli-runtime` スキルはCodexランタイムをClaude Codeから呼び出す内部ヘルパーで、`codex-rescue` エージェントから呼び出されるようになっています。`codex-rescue` 自身も `/codex:rescue` コマンドから内部的に呼び出されるエージェントです。

それぞれのコマンドの中身も見てみましょう。どのコマンドにも共通しているのは、実際の処理が `scripts/codex-companion.mjs` で実行されていることです。例えば `/codex:review` コマンドの定義ファイル `commands/review.md` を見ると、コマンドの説明の後に以下のような記述があります。

````md:commands/review.md
---
description: Run a Codex code review against local git state
argument-hint: '[--wait|--background] [--base <ref>] [--scope auto|working-tree|branch]'
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(node:*), Bash(git:*), AskUserQuestion
---

Run a Codex review through the shared built-in reviewer.

<!-- 省略... -->

Foreground flow:
- Run:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/codex-companion.mjs" review "$ARGUMENTS"
```

- Return the command stdout verbatim, exactly as-is.
- Do not paraphrase, summarize, or add commentary before or after it.
- Do not fix any issues mentioned in the review output.

````

`codex:review` コマンドが実行されると、`scripts/codex-companion.mjs` を `review` 引数をつけて呼び出すようになっています。同じように `/codex:setup` コマンドは `setup` 引数をつけて、`/codex:status` コマンドは `scripts/codex-companion.mjs` を `status` 引数をつけて呼び出すようになっています。実際の処理は `scripts/codex-companion.mjs` 内で引数に応じて分岐して実装されているというわけです。

`codex-companion.mjs` は Claude Code と Codex をつなぐ役割を果たすスクリプトとして実装されています。`review` 引数がついて呼び出された場合の処理の流れを追ってみましょう。はじめに `main` 関数で引数が取得され、引数に `review` が含まれている場合は `handleReview` 関数が呼び出されます。

```js:scripts/codex-companion.mjs
async function main() {
  const [subcommand, ...argv] = process.argv.slice(2);
  if (!subcommand || subcommand === "help" || subcommand === "--help") {
    printUsage();
    return;
  }

  switch (subcommand) {
    case "setup":
      handleSetup(argv);
      break;
    case "review":
      await handleReview(argv);
      break;
    case "adversarial-review":
      await handleReviewCommand(argv, {
        reviewName: "Adversarial Review"
      });
      break;
```

`handleReview` 関数は `handleReviewCommand` を `reviewName: "Review"` と `validateRequest: validateNativeReviewRequest` 付きで呼びます。`handleReviewCommand` 関数は `adversarial-review` コマンドの時も別の引数で呼び出されていますね。

```js:scripts/codex-companion.mjs
async function handleReview(argv) {
  return handleReviewCommand(argv, {
    reviewName: "Review",
    validateRequest: validateNativeReviewRequest
  });
}
```

`handleReviewCommand` 関数は `--scope`, `--background` といった引数を処理した後、レビュー対象を決定します。レビュー対象は `--base` や `--scope` といった引数によって変わりますが、例えば `--scope branch` の場合は現在のブランチとベースブランチの差分がレビュー対象になります。基本的にサブコマンドも含めて `/codex:review` コマンドがスクリプトを呼び出してくれるので、ユーザーが特にどのようなオプションで呼び出すかは意識する必要はありません。

レビュー対象を決定したら `createCompanionJob` 関数が呼び出されレビュージョブが作成されます。ここでのジョブとは Codex の実行を管理する単位のことです。ジョブとして管理することで、レビューの進捗を `/codex:status` コマンドで確認したり、必要に応じて `/codex:cancel` コマンドでキャンセルしたりできるようになるわけですね。

実際のコマンドの実行は `executeReviewRun` 関数で行われます。

```js:scripts/codex-companion.mjs
async function handleReviewCommand(argv, config) {
  // 引数の処理
  const { options, positionals } = parseCommandInput(argv, {
    valueOptions: ["base", "scope", "model", "cwd"],
    booleanOptions: ["json", "background", "wait"],
    aliasMap: {
      m: "model"
    }
  });

  // レビュー対象の決定
  const cwd = resolveCommandCwd(options);
  const workspaceRoot = resolveCommandWorkspace(options);
  const focusText = positionals.join(" ").trim();
  const target = resolveReviewTarget(cwd, {
    base: options.base,
    scope: options.scope
  });

  // ジョブの作成
  config.validateRequest?.(target, focusText);
  const metadata = buildReviewJobMetadata(config.reviewName, target);
  const job = createCompanionJob({
    prefix: "review",
    kind: metadata.kind,
    title: metadata.title,
    workspaceRoot,
    jobClass: "review",
    summary: metadata.summary
  });

  // レビュージョブの実行
  await runForegroundCommand(
    job,
    (progress) =>
      executeReviewRun({
        cwd,
        base: options.base,
        scope: options.scope,
        model: options.model,
        focusText,
        reviewName: config.reviewName,
        onProgress: progress
      }),
    { json: options.json }
  );
}
```

`executeReviewRun` 関数内では `reviewName` が `Review` の場合は `runAppServerReview` 関数が呼び出されるようになっています。`runAppServerReview` 関数は実際に Codex の App Server を呼び出してレビューを実行する関数です。`runAppServerReview` 関数は `scripts/lib/codex.mjs` 内に実装されており、Codex の App Server を呼び出すためのロジックが実装されています。

```js:scripts/codex-companion.mjs
async function executeReviewRun(request) {
  /// 省略

  if (reviewName === "Review") {
    const reviewTarget = validateNativeReviewRequest(target, focusText);
    const result = await runAppServerReview(request.cwd, {
      target: reviewTarget,
      model: request.model,
      onProgress: request.onProgress
    });

    // 実行が完了したら結果を返す...
```

レビューの実行が完了すると、Codex の App Server からの応答がそのままユーザーに返されるようになっています。レビューコマンドに限らず、多くのコマンドは Codex の App Server に接続する形で実装されているという特徴があります。つまり Codex の App Server があるからこそ、Codex は柔軟に外部サービスと連携して様々なタスクを実行できるようになっているわけですね。

### Codex の App Server とは

Codex の App Server は Codex がクライアントを動作させるために使用するインタフェースです。JSON-RPC 2.0 を使用した双方向の通信をサポートしています。App Server は stdio もしくは WebSocket 経由でクライアントと通信します。公開ドキュメントでも、深い製品統合には App Server を、CI や自動化には SDK を使うよう案内されています。

Codex CLI はもともとターミナル経由でアクセスされる TUI アプリケーションとして設計されていましたが、VS Code の Codex 拡張機能や今回紹介している Claude Code の Codex プラグインのように、外部サービスから呼び出されるクライアントとやり取りする際には不便です。IDE フレンドリーな方法としてはじめは Codex を MCP サーバーとして公開することが検討されていましたが、VS Code にとって意味のある形で MCP のセマンティックを維持することが困難だと判断され、よりシンプルな JSON-RPC 2.0 ベースの App Server が実装されることになったようです。現在では Codex ハーネスとして動作する標準プロトコルとなっています。

App Server は Codex のコアスレッドをホストする常駐のプロセスとして動作しており、クライアントは JSON-RPC メッセージを送ってスレッドやターンを開始します。基本的な流れは `initialize` と `initialized` で接続を初期化し、その後に `thread/start` でスレッドを作成し、`turn/start` で実際の依頼を送るというものです。双方向性を持っているため、サーバーからクライアントに `turn/started` のような通知を送ったり、エージェントが承認を必要とする場合にユーザーへの確認を要求してクライアントの応答を待機したりといったことも可能になっています。

以下のコマンドを実行すると、Codex を App Server として起動できます。

```bash
codex app-server
```

`codex` プラグインでは `scripts/lib/app-server.mjs` 内で `SpawnedCodexAppServerClient` クラスが定義されており、`codex app-server` コマンドを呼び出す形で App Server を起動するクライアントが実装されています。

```js:scripts/lib/app-server.mjs
class SpawnedCodexAppServerClient extends AppServerClientBase {
  async initialize() {
    this.proc = spawn("codex", ["app-server"], {
      cwd: this.cwd,
      env: this.options.env,
      stdio: ["pipe", "pipe", "pipe"]
    });
  }
}
```

クライアントは JSON-RPC 2.0 形式で App Server にリクエストを送信して処理が開始されます。Claude Code の Codex プラグインでは、この汎用的なスレッド・ターン管理の仕組みに加えて、レビュー専用のリクエストを送ることでレビュー機能を実現しています。例えばレビューの開始は `method: "review/start"` という RPC メソッドを App Server に送る形で行われます。

```json
{
  "method": "review/start",
  "id": 40,
  "params": {
    "threadId": "thr_123",
    "delivery": "inline",
    "target": {
      "type": "commit",
      "sha": "1234567deadbeef",
      "title": "Polish tui colors"
    }
  }
}
```

クライアントから新しいリクエストを受け取ったら、スレッドを作成します。スレッドは Codex の会話の単位で、リクエストに対する応答や、リクエストに関連する一連のやり取りを管理するためのものです。進捗に応じて `thread/started` と `turn/started` といった通知がクライアントに送られます。

以下はレビュー開始直後に返る応答の一例です。この段階ではレビュー処理が継続中であるため、`turn.status` は `inProgress` になっています。

```json
{
  "id": 40,
  "result": {
    "turn": {
      "id": "turn_900",
      "status": "inProgress",
      "items": [
        {
          "type": "userMessage",
          "id": "turn_900",
          "content": [
            {
              "type": "text",
              "text": "Review commit 1234567: Polish tui colors"
            }
          ]
        }
      ],
      "error": null
    },
    "reviewThreadId": "thr_123"
  }
}
```

これが Codex の App Server がどのように動いているのかの概要になります。Codex の App Server は現在 VS Code の拡張機能や Codex Web、Codex CLI など様々なクライアントから呼び出されています。サーバー部分も標準プロトコルとして実装したことにより、この記事で紹介した Codex プラグインのように異なるクライアントの呼び出しも比較的簡単に実装できるようになっていることがわかりますね。App Server のより詳細なフローについては[Codex ハーネスの解放：App Server を構築した方法](https://openai.com/ja-JP/index/unlocking-the-codex-harness/)の記事で解説されています。

## まとめ

- Claude Code と Codex を連携させるための公式プラグインがリリースされた
- Codex プラグインを使用すると、Claude Code から Codex を呼び出してコードレビューをしたり、タスクを委任するといったことが簡単にできるようになる
- Codex プラグインは内部的には Codex の App Server を呼び出す形で実装されている。Codex の App Server は Codex がクライアントを動作させるためのインタフェースで、JSON-RPC 2.0 を使用した双方向の通信をサポートしている
- Codex の App Server を使用することで、Codex は柔軟に外部サービスと連携して様々なタスクを実行できるようになっている

## 参考

- [openai/codex-plugin-cc: Use Codex from Claude Code to review code or delegate tasks.](https://github.com/openai/codex-plugin-cc)
- [App Server – Codex | OpenAI Developers](https://developers.openai.com/codex/app-server)
- [Codex ハーネスの解放：App Server を構築した方法 | OpenAI](https://openai.com/ja-JP/index/unlocking-the-codex-harness/)
