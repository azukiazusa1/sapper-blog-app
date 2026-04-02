---
id: nzFlJ1pMORXNDjlRy93Qy
title: "codex-plugin-cc: A Plugin for Calling Codex from Claude Code"
slug: "claude-code-codex-plugin"
about: "The Codex plugin makes it easy to call Codex from Claude Code for code reviews and task delegation. This article explains how to use the plugin and how it works internally."
createdAt: "2026-03-31T19:00+09:00"
updatedAt: "2026-03-31T19:00+09:00"
tags: ["claude-code", "codex"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1UnLUyBA7xUhdwzcC9DcD1/fdb3f3d082c7f4c7f3e8bdb4c699e2df/shrimp-mayonnaise_gunkan-sushi_21447-768x670.png"
  title: "エビマヨ軍艦のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Before running the plugin installation command, which step is required when installing the Codex plugin into Claude Code?"
      answers:
        - text: "Set the Codex API key in Claude Code environment variables"
          correct: false
          explanation: "The article explains that authentication is done with `codex login`, not by setting an API key in environment variables. Environment-variable API key setup is not part of the procedure."
        - text: "Manually add the Codex plugin path to the Claude Code config file"
          correct: false
          explanation: "No manual config-file editing is required. Adding the marketplace and running `/plugin install` is sufficient."
        - text: "Directly install the plugin with the `/plugin install` command"
          correct: false
          explanation: "Before installing the plugin, you first need to add the marketplace that distributes it with `/plugin marketplace add`."
        - text: "Add the marketplace that distributes the plugin with `/plugin marketplace add`"
          correct: true
          explanation: "The article explains that you need to add the marketplace before installing the plugin. For the Codex plugin, run `/plugin marketplace add openai/codex-plugin-cc`."
    - question: "What is the correct shared internal execution mechanism behind Codex plugin commands such as `/codex:review` and `/codex:setup`?"
      answers:
        - text: "Each command has its own dedicated script file and directly invokes Codex CLI"
          correct: false
          explanation: "The commands do not each have a separate script. Instead, they all invoke the shared `codex-companion.mjs` script with different arguments."
        - text: "Each command sends requests directly to Codex endpoints exposed as an MCP server"
          correct: false
          explanation: "The article says MCP exposure was considered but not adopted, and that an App Server based on JSON-RPC 2.0 was implemented instead."
        - text: "Each command definition invokes `codex-companion.mjs` with arguments, and the script branches based on those arguments"
          correct: true
          explanation: "The article explains that `/codex:review` passes the `review` argument, `/codex:setup` passes `setup`, and so on, all through the shared `codex-companion.mjs` script."
        - text: "Each command uses Claude Code's Agent tool to run Codex prompts directly"
          correct: false
          explanation: "The commands are processed by running `codex-companion.mjs` via Bash, not through the Agent tool."
published: true
---
Using [Claude Code](https://code.claude.com/docs/en/overview) to implement code through planning and generation, and then having [Codex](https://developers.openai.com/codex/cli) review it, is becoming an increasingly common workflow. In my observation, its main strength is that it lets you combine the strengths of different models. Claude Code is good at designing overall system structure, and because it can handle a large context window, it is well suited to planning from an abstract goal and generating working code. Codex, on the other hand, is often regarded as strong at surfacing subtle holes and edge cases thanks to its ability to spend time on deeper reasoning. Combining Claude Code's creativity with Codex's critical thinking can make it more likely that you end up with higher-quality implementations.

Another reason this workflow seems to be gaining traction is that Claude Code's rate limits have become stricter than before. By combining multiple models, you can spread rate-limit pressure across them and keep the workflow moving more reliably than when using Claude Code alone.

Until recently, developers needed to build their own custom workflow to connect Claude Code and Codex, but OpenAI has now released an official [Codex plugin](https://github.com/openai/codex-plugin-cc). With the Codex plugin, you can easily call Codex from Claude Code for code reviews or task delegation.

In this article, I'll explain how to use the Codex plugin and how it calls Codex under the hood.

## Steps for Using the Codex Plugin

Naturally, to use the Codex plugin you need an environment where both Claude Code and Codex are available. You can install them with the following commands.

```bash
# Install Claude Code
curl -fsSL https://claude.ai/install.sh | bash
# Install Codex CLI
npm install -g @openai/codex
```

After installing Codex CLI, log in ahead of time.

```bash
codex login
```

To install a plugin in Claude Code, you first need to add the marketplace that distributes that plugin. Here, we'll add the `openai/codex-plugin-cc` marketplace. Start Claude Code and run the following command.

```bash
/plugin marketplace add openai/codex-plugin-cc
```

After adding the marketplace, install the `codex` plugin.

```bash
/plugin install codex@openai-codex
```

Once installation is complete, either restart Claude Code or reload plugins with the following command.

```bash
/reload-plugins
```

If the plugin was installed correctly, typing `/codex` should show command suggestions such as `/codex:setup` and `/codex:review`.

![](https://images.ctfassets.net/in6v9lxmm5c8/5y1aH0KSovNTH00H5rZl32/e0b00646eb353ec15d101b90d125d230/image.png)

When you run `/codex:setup`, Claude Code checks whether `codex` is available. If everything is fine, you'll see a message saying something like "Codex is already set up."

![](https://images.ctfassets.net/in6v9lxmm5c8/7pnUCUA5NDTeUSRD15ohq4/61648fc64a9d7c4987651c96eea174fe/image.png)

If you uninstall the `codex` command and then run `/codex:setup`, Claude Code will ask whether you want to install Codex CLI now. If you choose "Install Codex," it will run the Codex CLI setup for you.

![](https://images.ctfassets.net/in6v9lxmm5c8/jHq832s2MMrpj8OQXvQsc/fc4d3f8ad24bcbba4210c71b5406d5af/image.png)

## Commands Available in the Codex Plugin

The Codex plugin provides the following commands.

- `/codex:setup`: Sets up Codex CLI. Adding the `--enable-review-gate` option enables Hooks so Codex automatically reviews code whenever Claude Code stops.
- `/codex:review`: Has Codex review code based on the local git state.
- `/codex:adversarial-review`: Has Codex critically examine the implementation approach or design.
- `/codex:rescue`: Delegates investigation, fixes, or follow-up work to Codex.
- `/codex:status`: Checks the status of background Codex jobs and shows the latest job.
- `/codex:result`: Displays the final response from Codex.
- `/codex:cancel`: Cancels a background Codex job.

## Implement with Claude Code and Have Codex Review It

Let's try the workflow of implementing code with Claude Code and then asking Codex to review it. As a simple example, let's have Claude Code implement an API endpoint. First, give Claude Code the following prompt and let it generate the implementation.

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

Claude Code generated a Next.js API route using Zod and Prisma to match the existing codebase. At first glance, nothing looks seriously wrong, but there may still be subtle holes and edge cases hiding in it.

<details>
<summary>Generated code example</summary>

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

Now run the `/codex:review` command and have Codex review the code. When you do, you'll be given a choice between running it in the background or foreground. Here, choose the background option.

![](https://images.ctfassets.net/in6v9lxmm5c8/7ns5gHpu0kXTiKccXtne4h/6893f2d9b1a62bf8db24228b0749541a/image.png)

You can check the progress of the Codex job with `/codex:status`.

![](https://images.ctfassets.net/in6v9lxmm5c8/3GB5G4lyN9g3q8ccULmHOM/18c3d2218e0b6228344d08ab23e3fa99/image.png)

Once the review is complete, Codex shows the review results. In this case, it pointed out two issues: "[P1]Date filters should be parsed in local time rather than UTC" and "[P2]Requests should be rejected when `transaction.type` and `category.type` do not match." Because it identifies concrete spots where bugs or inconsistencies can occur, it's very easy to understand what should be fixed and where.

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

For comparison, I cleared the context and also asked Claude Code itself to review the code. Both Claude Code and Codex pointed out the timezone issue and the need to validate `type`. In this example, Claude Code tends to point out finer-grained details, while Codex feels more focused on the most important issues.

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

## How the Codex Plugin Works

Let's briefly look at how the Codex plugin works internally. Its directory structure looks like this.

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

In practice, what users touch directly are the command definition files under the `commands` directory. This directory contains definitions for commands such as `/codex:setup` and `/codex:review` that I introduced earlier. The other skills, agents, and prompts are invoked internally to execute those commands. For example, the `codex-cli-runtime` skill is an internal helper for calling the Codex runtime from Claude Code, and it is used by the `codex-rescue` agent. The `codex-rescue` agent itself is invoked internally by the `/codex:rescue` command.

Let's look at what is inside each command. What they all have in common is that the actual work is run through `scripts/codex-companion.mjs`. For example, if you open the `/codex:review` command definition file `commands/review.md`, after the command description you'll see the following.

````md:commands/review.md
---
description: Run a Codex code review against local git state
argument-hint: '[--wait|--background] [--base <ref>] [--scope auto|working-tree|branch]'
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash(node:*), Bash(git:*), AskUserQuestion
---

Run a Codex review through the shared built-in reviewer.

<!-- Omitted -->

Foreground flow:
- Run:
```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/codex-companion.mjs" review "$ARGUMENTS"
```

- Return the command stdout verbatim, exactly as-is.
- Do not paraphrase, summarize, or add commentary before or after it.
- Do not fix any issues mentioned in the review output.

````

When `codex:review` runs, it invokes `scripts/codex-companion.mjs` with the `review` argument. In the same way, `/codex:setup` invokes it with `setup`, and `/codex:status` invokes it with `status`. In other words, the actual behavior is implemented inside `scripts/codex-companion.mjs`, branching based on the argument.

`codex-companion.mjs` is implemented as the script that connects Claude Code and Codex. Let's follow the flow when it is called with the `review` argument. First, the `main` function reads the arguments, and if `review` is included, it calls `handleReview`.

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

`handleReview` calls `handleReviewCommand` with `reviewName: "Review"` and `validateRequest: validateNativeReviewRequest`. The `handleReviewCommand` function is also called for the `adversarial-review` command, just with different arguments.

```js:scripts/codex-companion.mjs
async function handleReview(argv) {
  return handleReviewCommand(argv, {
    reviewName: "Review",
    validateRequest: validateNativeReviewRequest
  });
}
```

After processing arguments such as `--scope` and `--background`, `handleReviewCommand` decides what the review target should be. The target changes depending on options like `--base` and `--scope`. For example, with `--scope branch`, the review target becomes the diff between the current branch and the base branch. In practice, `/codex:review` takes care of calling the script with the right subcommand and options, so users usually don't need to think much about how to invoke it.

Once the review target is decided, `createCompanionJob` is called to create a review job. Here, a job is the unit used to manage Codex execution. Managing it as a job makes it possible to check progress with `/codex:status` or cancel it with `/codex:cancel` when needed.

The actual execution of the command happens in `executeReviewRun`.

```js:scripts/codex-companion.mjs
async function handleReviewCommand(argv, config) {
  // Process arguments
  const { options, positionals } = parseCommandInput(argv, {
    valueOptions: ["base", "scope", "model", "cwd"],
    booleanOptions: ["json", "background", "wait"],
    aliasMap: {
      m: "model"
    }
  });

  // Determine the review target
  const cwd = resolveCommandCwd(options);
  const workspaceRoot = resolveCommandWorkspace(options);
  const focusText = positionals.join(" ").trim();
  const target = resolveReviewTarget(cwd, {
    base: options.base,
    scope: options.scope
  });

  // Create the job
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

  // Run the review job
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

Inside `executeReviewRun`, if `reviewName` is `Review`, it calls `runAppServerReview`. This function actually calls the Codex App Server to run the review. `runAppServerReview` is implemented in `scripts/lib/codex.mjs`, where the logic for interacting with the Codex App Server lives.

```js:scripts/codex-companion.mjs
async function executeReviewRun(request) {
  /// Omitted

  if (reviewName === "Review") {
    const reviewTarget = validateNativeReviewRequest(target, focusText);
    const result = await runAppServerReview(request.cwd, {
      target: reviewTarget,
      model: request.model,
      onProgress: request.onProgress
    });

    // Return the result after execution completes...
```

Once execution finishes, the response from the Codex App Server is returned to the user as-is. This is not limited to the review command. Many commands in the plugin are implemented by connecting to the Codex App Server. In other words, the existence of the Codex App Server is what allows Codex to integrate flexibly with external services and perform a variety of tasks.

### What Is the Codex App Server?

The Codex App Server is the interface Codex uses to power clients. It supports bidirectional communication over JSON-RPC 2.0. Clients communicate with the App Server either over stdio or WebSocket. The public documentation also recommends using the App Server for deep product integrations, while using the SDK for CI and automation.

Codex CLI was originally designed as a TUI application accessed through the terminal, but that is inconvenient when interacting with external clients such as the VS Code Codex extension or the Claude Code Codex plugin discussed here. An MCP-server approach was initially considered as an IDE-friendly option, but it seems the team concluded that it would be difficult to preserve MCP semantics in a way that was meaningful for VS Code. As a result, a simpler JSON-RPC 2.0-based App Server was implemented instead. It is now the standard protocol used as the Codex harness.

The App Server runs as a resident process that hosts Codex's core threads, and clients send JSON-RPC messages to start threads and turns. The basic flow is to initialize the connection with `initialize` and `initialized`, then create a thread with `thread/start`, and finally send the actual request with `turn/start`. Because the protocol is bidirectional, the server can send notifications such as `turn/started` back to the client, and if the agent needs approval, it can request confirmation from the user and wait for the client's response before continuing.

You can start Codex as an App Server with the following command.

```bash
codex app-server
```

In the `codex` plugin, `scripts/lib/app-server.mjs` defines a `SpawnedCodexAppServerClient` class, which implements a client that launches the App Server by calling `codex app-server`.

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

The client sends requests to the App Server in JSON-RPC 2.0 format to start processing. In the Claude Code Codex plugin, review functionality is implemented by sending a review-specific request on top of the generic thread and turn management flow. For example, a review starts by sending an RPC method named `method: "review/start"` to the App Server.

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

When the server receives a new request, it creates a thread. A thread is the unit of conversation in Codex, used to manage the response to a request and the series of interactions related to it. As progress is made, notifications such as `thread/started` and `turn/started` are sent to the client.

The following is an example of the response returned immediately after a review starts. At this stage the review is still in progress, so `turn.status` is `inProgress`.

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

That is the high-level picture of how the Codex App Server works. Today, the Codex App Server is used by a variety of clients, including the VS Code extension, Codex Web, and Codex CLI. Because the server side was implemented as a standard protocol, it becomes relatively straightforward to implement clients different from the original one, such as the Codex plugin introduced in this article. For a more detailed explanation of the App Server flow, see [Unlocking the Codex Harness: How We Built App Server](https://openai.com/ja-JP/index/unlocking-the-codex-harness/).

## Summary

- An official plugin has been released for connecting Claude Code and Codex.
- With the Codex plugin, you can easily call Codex from Claude Code for code review or task delegation.
- Internally, the Codex plugin is implemented by calling the Codex App Server. The Codex App Server is the interface Codex uses to power clients, and it supports bidirectional communication over JSON-RPC 2.0.
- By using the Codex App Server, Codex can integrate flexibly with external services and carry out many kinds of tasks.

## References

- [openai/codex-plugin-cc: Use Codex from Claude Code to review code or delegate tasks.](https://github.com/openai/codex-plugin-cc)
- [App Server – Codex | OpenAI Developers](https://developers.openai.com/codex/app-server)
- [Codex ハーネスの解放：App Server を構築した方法 | OpenAI](https://openai.com/ja-JP/index/unlocking-the-codex-harness/)

