---
id: FtCLkB8AuGwt2IOp48j-d
title: "Claude Code で MCP Tasks と Elicitation を試す"
slug: "claude-mcp-tasks-elicitations"
about: "Claude は MCP の Tasks と Elicitation に対応し始めました。Tasks は時間のかかるツール呼び出しをタスク ID とポーリングに分ける拡張で、Elicitation は処理の途中でユーザーに入力を求める仕組みです。この記事では 2 つの機能の基本を説明し、TypeScript SDK で実装した MCP サーバーを Claude Code CLI から呼び出した結果を紹介します。"
createdAt: "2026-10-27T12:06+09:00"
updatedAt: "2026-10-27T12:06+09:00"
tags: ["MCP", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2VwjvauatYY14MZvXRCSLb/a21545a3d71c6343ef6da0d13fb6948b/vegetable_potato_illsut_635-768x653.png"
  title: "じゃがいものイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Elicitation の form モードで要求してはならない（MUST NOT）と仕様で定められている情報はどれですか？"
      answers:
        - text: "ユーザー名やメールアドレス"
          correct: false
          explanation: "連絡先やプロフィールの情報は一律に禁止されてはいません。form モードで尋ねるかどうかはサーバーの判断に任されています。"
        - text: "列挙型から選ぶ選択肢"
          correct: false
          explanation: "列挙型は form モードの `requestedSchema` で使える型の 1 つです。"
        - text: "日付や URI の形式の文字列"
          correct: false
          explanation: "文字列には `date` や `uri` などの `format` を指定できます。"
        - text: "パスワードや API キー、支払い情報"
          correct: true
          explanation: "機密情報は form モードで要求してはならず、クライアントを通らない URL モードで扱います。"
    - question: "MCP TypeScript SDK v2.3 のサーバーで、`tasks/update` に含まれるユーザーの応答を読み取る方法はどれですか？"
      answers:
        - text: "`ctx.mcpReq.inputResponses` から読む"
          correct: true
          explanation: "SDK は `params.inputResponses` を取り出して `ctx.mcpReq.inputResponses` に渡します。"
        - text: "`params.inputResponses` をスキーマに含めて読む"
          correct: false
          explanation: "スキーマに含めると `expected record, received undefined` のバリデーションエラーになりました。"
        - text: "`requestState` をデコードして読む"
          correct: false
          explanation: "`requestState` は MRTR でサーバーが状態を引き継ぐための値で、ユーザーの応答そのものではありません。"
        - text: "SDK が自動で実装した `tasks/update` のハンドラーの戻り値から読む"
          correct: false
          explanation: "SDK のサーバーは Tasks 拡張を実装していないため、`tasks/update` は `setRequestHandler` で自前で実装します。"
published: true
---

MCP（Model Context Protocol）のツール呼び出しは、クライアントがリクエストを送り、サーバーが結果を返すまで待つという同期的なやり取りが基本です。数秒で終わる処理ならこれで十分ですが、数分かかる調査や CI の実行のような処理では、接続を開いたまま待ち続けることになります。また、ツールを実行している途中で「本当に返金してよいか」「どのリポジトリを対象にするか」といった判断をユーザーに求めたい場面もあります。

MCP にはこの 2 つの問題に対応する仕組みとして、時間のかかる処理を扱う Tasks と、処理の途中でユーザーに入力を求める Elicitation があります。2026 年 10 月 23 日、Anthropic は [Claude で MCP Tasks と Elicitations をサポートする](https://x.com/ClaudeDevs/status/2113698001889927608) ことを発表しました。現時点では Claude Code CLI で利用でき、ほかの Claude の製品にも順次展開される予定です。

この記事では Tasks と Elicitation の基本から説明し、2 つの機能を使う MCP サーバーを TypeScript SDK で実装して、Claude Code CLI から呼び出したときの挙動を確認します。

:::warning
2026 年 10 月 25 日時点で、Claude Code の MCP Tasks は public beta です。Claude Code v2.1.304 以降の CLI が必要で、VS Code 拡張とデスクトップアプリでは利用できません。
:::

## MCP Tasks とは

[MCP Tasks](https://modelcontextprotocol.io/extensions/tasks/overview) は、サーバーがツール呼び出しに対して最終的な結果の代わりに「タスクのハンドル」を返し、クライアントが後からポーリングして結果を受け取るための拡張です。拡張の識別子は `io.modelcontextprotocol/tasks` で、仕様は [ext-tasks リポジトリ](https://github.com/modelcontextprotocol/ext-tasks) で管理されています。

ツール呼び出しの結果を待つ間、接続を開いたままにする方法でも長い処理は扱えますが、公式ドキュメントでは、Tasks を使う理由として次の点を挙げています。

- 多くのクライアントや中継サーバーはリクエストにタイムアウトを設けているため、数秒を超えて接続を保持するのは現実的ではない
- タスク ID は永続的なハンドルなので、クライアントが切断・再起動しても同じ ID でポーリングを再開できる
- タスクは `working` や `input_required` といった状態と `statusMessage` を持つため、クライアントは進捗を表示できる
- タスクの途中でユーザーの入力が必要になった場合も、追加の接続なしにやり取りできる

### Tasks の流れ

Tasks を使うツール呼び出しは、次の流れで進みます。

1. クライアントはリクエストの `_meta` で Tasks 拡張への対応を宣言する
2. サーバーは処理に時間がかかると判断したら、`resultType: "task"` の結果（`CreateTaskResult`）を返す
3. クライアントは `tasks/get` でタスクの状態を問い合わせる
4. タスクが `input_required` になったら、クライアントは `tasks/update` でユーザーの入力を送る
5. タスクが `completed` になったら、`tasks/get` の応答に含まれる `result` を受け取る

2026-07-28 仕様では `initialize` によるハンドシェイクが廃止され、クライアントは毎回のリクエストの `_meta` で自身の機能（capabilities）を宣言します。Tasks 拡張への対応も、`extensions` フィールドで宣言します。

```json
{
  "_meta": {
    "io.modelcontextprotocol/clientCapabilities": {
      "extensions": {
        "io.modelcontextprotocol/tasks": {}
      }
    }
  }
}
```

この宣言があるリクエストに対して、サーバーは通常の `CallToolResult` か `CreateTaskResult` のどちらを返すかをリクエストごとに決めます。`CreateTaskResult` は次のような形です。

```json
{
  "resultType": "task",
  "taskId": "build-7f3a9c2e",
  "status": "working",
  "statusMessage": "Compiling, 40 of 212 files done",
  "createdAt": "2026-10-22T14:03:07Z",
  "lastUpdatedAt": "2026-10-22T14:03:07Z",
  "ttlMs": null,
  "pollIntervalMs": 5000
}
```

`pollIntervalMs` はサーバーが推奨するポーリング間隔、`ttlMs` はタスクの作成時点から数えてタスクを保持する期間（ミリ秒）で、`null` は無期限を表します。仕様では、サーバーはタスクを作成し終えてから、つまり `tasks/get` でそのタスクを取得できる状態になってから `CreateTaskResult` を返さなければなりません。

タスクの状態は次の 5 つです。

| 状態             | 意味                                                         |
| ---------------- | ------------------------------------------------------------ |
| `working`        | 処理中                                                       |
| `input_required` | クライアントからの入力が必要。`inputRequests` に要求が入る   |
| `completed`      | 完了。`result` に本来のツール呼び出しの結果が入る            |
| `failed`         | 実行中に JSON-RPC エラーが発生した。`error` に詳細が入る     |
| `cancelled`      | キャンセルされた                                             |

`failed` は JSON-RPC のエラーだけを表す状態です。ツールが `isError: true` の結果を返した場合は、プロトコルとしては正常に完了しているので、タスクは `completed` になり、`result` にそのエラーの結果が入ります。

`completed`、`failed`、`cancelled` は終了状態で、一度この状態になったタスクは変化しません。クライアントは `tasks/cancel` でキャンセルを要求できますが、キャンセルは協調的なものです。サーバーは要求を受け付けたことだけを返し、処理を止めるかどうかはサーバーが決めます。

## Elicitation とは

[Elicitation](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation) は、サーバーがリクエストを処理している途中で、クライアントを通じてユーザーに追加の情報を求める仕組みです。2025-06-18 仕様で追加されました。

Elicitation には 2 つのモードがあります。

- form モード: サーバーが JSON Schema で入力項目を指定し、クライアントがフォームを表示して構造化されたデータを集める。データはクライアントを通ってサーバーに届く
- URL モード: サーバーが URL を指定し、ユーザーはブラウザでその URL を開いて操作する。URL 以外のデータはクライアントを通らない

form モードの `requestedSchema` は、プリミティブな型のプロパティだけを持つフラットなオブジェクトに制限されています。使えるのは文字列（`email`、`uri`、`date`、`date-time` の `format` を指定できる）、数値、真偽値、列挙型（単一選択・複数選択）です。ネストしたオブジェクトは意図的にサポートされていません。クライアントがフォームを組み立てやすくするためです。

ユーザーの応答は `action` で 3 種類に区別されます。

| `action`  | 意味                                                          |
| --------- | ------------------------------------------------------------- |
| `accept`  | ユーザーが明示的に承認して送信した。form モードでは `content` に入力値が入る |
| `decline` | ユーザーが明示的に拒否した                                    |
| `cancel`  | ユーザーが選択せずにダイアログを閉じた（Esc キーなど）        |

仕様では、サーバーはパスワード、API キー、アクセストークン、支払い情報のような機密情報を form モードで要求してはならない（MUST NOT）と定めています。これらは URL モードで扱います。URL モードを追加した [SEP-1036](https://modelcontextprotocol.io/seps/1036-url-mode-elicitation-for-secure-out-of-band-intera) は、MCP サーバーがサードパーティーの API に OAuth で認可を得る場面を主な動機に挙げています。MCP クライアントがトークンを取得してサーバーに渡すと、セキュリティのベストプラクティスで禁止されているトークンパススルーになってしまいます。URL モードなら、ユーザーはブラウザでサードパーティーに直接認可を与え、トークンはクライアントを通らずにサーバーへ届きます。

### 2026-07-28 仕様での Elicitation の扱い

2025-11-25 までの仕様では、サーバーはツールの実行中にクライアントへ `elicitation/create` リクエストを送っていました。サーバーからクライアントへリクエストを送るには、確立済みのセッションと双方向の通信路が必要です。

2026-07-28 仕様ではセッションが廃止されたため、`elicitation/create` は次の 2 つの方法でクライアントに届けられます。

- multi round-trip requests（MRTR）: サーバーは `tools/call` に `resultType: "input_required"` の結果を返して処理をいったん終える。クライアントはユーザーの応答を `inputResponses` に入れ、新しい ID で同じ `tools/call` を送り直す
- Tasks の `input_required`: タスクの状態を `input_required` にして、`tasks/get` の応答の `inputRequests` に `elicitation/create` を入れる。クライアントはユーザーの応答を `tasks/update` で送る

どちらの方法でも、`inputRequests` はキーと `{ method, params }` の組のマップです。タスクの `tasks/get` の応答は次のような形になります。

```json
{
  "resultType": "complete",
  "taskId": "6c2ffda1-fa4a-4620-96d8-d3ddf603770d",
  "status": "input_required",
  "statusMessage": "Waiting for the user to choose the report audience",
  "inputRequests": {
    "audience": {
      "method": "elicitation/create",
      "params": {
        "mode": "form",
        "message": "「MCP Tasks」の調査が終わりました。レポートの公開範囲を選んでください。",
        "requestedSchema": {
          "type": "object",
          "properties": {
            "audience": {
              "type": "string",
              "title": "公開範囲",
              "oneOf": [
                { "const": "team", "title": "チーム内" },
                { "const": "company", "title": "社内全体" }
              ]
            }
          },
          "required": ["audience"]
        }
      }
    }
  }
}
```

クライアントは同じキーで応答を返します。

```json
{
  "method": "tasks/update",
  "params": {
    "taskId": "6c2ffda1-fa4a-4620-96d8-d3ddf603770d",
    "inputResponses": {
      "audience": { "action": "accept", "content": { "audience": "team" } }
    }
  }
}
```

MRTR は数秒で終わるやり取りの中で入力を求めるのに向き、Tasks の `input_required` は長い処理の途中で入力を求めるのに向いています。

## Tasks と Elicitation を使う MCP サーバーを実装する

ここからは、2 つのツールを持つ MCP サーバーを実装します。

- `deep_research`: タスクを返す調査ツール。途中で Elicitation を使ってレポートの公開範囲をユーザーに確認し、確認後にレポートを完成させる
- `share_report`: タスクを使わず、MRTR で共有の確認を求めるツール

実装には MCP TypeScript SDK v2 の `@modelcontextprotocol/server` を使います。ただし、2026 年 10 月 25 日時点で SDK のサーバー側は Tasks 拡張を実装していません（[typescript-sdk#2189](https://github.com/modelcontextprotocol/typescript-sdk/issues/2189)）。そのため、`tasks/get` などのメソッドは SDK のカスタムメソッドとして自前で実装します。Elicitation の要求は SDK の `inputRequired` で組み立てます。

プロジェクトを作成して、必要なパッケージをインストールします。

```bash
npm init -y
npm pkg set type=module
npm install @modelcontextprotocol/server@2.3.1 @modelcontextprotocol/node@2.1.1 zod
```

### タスクの状態を保持する

`createMcpHandler` は HTTP リクエストごとに `McpServer` のインスタンスを作り直します。タスクは複数のリクエストをまたいで参照されるため、モジュールスコープの `Map` に保存します。実際のサービスでは、複数のサーバーインスタンスから参照できるデータベースなどに保存する必要があります。また、このサンプルは終了したタスクを削除しませんが、実際のサービスでは `ttlMs` を設定して、期限を過ぎたタスクを削除します。

以降のコードブロックには、そのブロックで使う import 文だけを抜き出して載せています。`server.ts` にまとめるときは、ファイルの先頭で 1 つにまとめてください。

```ts:server.ts
import { ProtocolError, ProtocolErrorCode } from "@modelcontextprotocol/server";

const TASKS_EXTENSION = "io.modelcontextprotocol/tasks";
const PORT = Number(process.env.PORT ?? 3000);
// 調査とレポート作成の各フェーズにかかる時間
const PHASE_MS = Number(process.env.PHASE_MS ?? 20_000);

type TaskStatus =
  | "working"
  | "input_required"
  | "completed"
  | "failed"
  | "cancelled";

type TaskRecord = {
  taskId: string;
  status: TaskStatus;
  statusMessage?: string;
  createdAt: string;
  lastUpdatedAt: string;
  topic: string;
  inputRequests?: Record<string, unknown>;
  result?: unknown;
};

// サーバーインスタンスはリクエストごとに作り直されるため、タスクはモジュールスコープに保存する
const tasks = new Map<string, TaskRecord>();

// 未知のタスク ID には -32602 (Invalid params) を返す
function findTask(taskId: string) {
  const task = tasks.get(taskId);
  if (!task) {
    throw new ProtocolError(
      ProtocolErrorCode.InvalidParams,
      `Unknown task: ${taskId}`,
    );
  }
  return task;
}

function update(task: TaskRecord, patch: Partial<TaskRecord>) {
  Object.assign(task, patch, { lastUpdatedAt: new Date().toISOString() });
}

function toWire(task: TaskRecord) {
  return {
    taskId: task.taskId,
    status: task.status,
    statusMessage: task.statusMessage,
    createdAt: task.createdAt,
    lastUpdatedAt: task.lastUpdatedAt,
    ttlMs: null,
    pollIntervalMs: 2000,
    ...(task.status === "input_required" && {
      inputRequests: task.inputRequests,
    }),
    ...(task.status === "completed" && { result: task.result }),
  };
}
```

`toWire` は、タスクを `CreateTaskResult` と `tasks/get` の応答の形に変換します。`input_required` のときは `inputRequests` を、`completed` のときは `result` を含めます。未知のタスク ID には `-32602` を返します。

タスク ID には `randomUUID()` を使います。新しい Tasks 拡張には `tasks/list` がないので、タスク ID を知っていることがタスクにアクセスできる条件の 1 つになります。仕様は、第三者が推測できない十分なエントロピーでタスク ID を生成することと、タスクへのリクエストごとに認証・認可を確認することを求めています。

### 調査の進行を模擬する

調査の処理は `setTimeout` で模擬します。`runResearch` は `PHASE_MS` が経過するとタスクを `input_required` にし、`inputRequests` に公開範囲を尋ねる Elicitation を入れます。

```ts:server.ts
import { inputRequired } from "@modelcontextprotocol/server";

// 調査を進め、途中で一度ユーザーに公開範囲を確認してからレポートを完成させる
function runResearch(task: TaskRecord) {
  setTimeout(() => {
    if (task.status !== "working") return;
    update(task, {
      status: "input_required",
      statusMessage: "Waiting for the user to choose the report audience",
      inputRequests: {
        audience: inputRequired.elicit({
          message: `「${task.topic}」の調査が終わりました。レポートの公開範囲を選んでください。`,
          requestedSchema: {
            type: "object",
            properties: {
              audience: {
                type: "string",
                title: "公開範囲",
                oneOf: [
                  { const: "team", title: "チーム内" },
                  { const: "company", title: "社内全体" },
                ],
              },
            },
            required: ["audience"],
          },
        }),
      },
    });
  }, PHASE_MS);
}

function finishResearch(task: TaskRecord, audience: string) {
  update(task, {
    status: "working",
    statusMessage: `Writing the report for ${audience}`,
    inputRequests: undefined,
  });
  setTimeout(() => {
    if (task.status !== "working") return;
    update(task, {
      status: "completed",
      statusMessage: "Report is ready",
      result: {
        content: [
          {
            type: "text",
            text: `「${task.topic}」のレポート（公開範囲: ${audience}）: 3 件の資料を要約しました。`,
          },
        ],
      },
    });
  }, PHASE_MS);
}
```

`inputRequired.elicit()` は、`{ method: "elicitation/create", params: { mode: "form", ... } }` という形の入力要求を組み立てる SDK のヘルパーです。選択肢の表示名は、JSON Schema の `oneOf` に `const` と `title` の組を並べて指定します。2025-06-18 仕様で使われていた `enum` と `enumNames` の組は、2026-07-28 仕様のスキーマでは `LegacyTitledEnumSchema` として残っていますが、将来のバージョンで削除される予定です。

### タスクを返すツールを登録する

`deep_research` ツールは、クライアントが必要な機能に対応していることを確認してから、タスクを作成して `CreateTaskResult` を返します。サーバー自身も `registerCapabilities` で拡張への対応を宣言し、`server/discover` の応答に含めます。

```ts:server.ts
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/server";
import type {
  CallToolResult,
  ClientCapabilities,
} from "@modelcontextprotocol/server";
import * as z from "zod/v4";

// form と url のどちらも持たない elicitation: {} は form モードへの対応とみなす
function supportsFormElicitation(capabilities?: ClientCapabilities) {
  const elicitation = capabilities?.elicitation;
  if (!elicitation) return false;
  return elicitation.form !== undefined || elicitation.url === undefined;
}

function buildServer() {
  const server = new McpServer({ name: "research-server", version: "1.0.0" });

  server.server.registerCapabilities({
    extensions: { [TASKS_EXTENSION]: {} },
  });

  server.registerTool(
    "deep_research",
    {
      description:
        "Research a topic and write a report. Takes several minutes.",
      inputSchema: z.object({ topic: z.string() }),
    },
    async ({ topic }) => {
      // タスクを返してよいのは、クライアントがリクエストで Tasks 拡張を宣言したときだけ。
      // タスクの途中で公開範囲を尋ねるので、Elicitation の form モードへの対応も必要
      const clientCapabilities = server.server.getClientCapabilities();
      const missing: string[] = [];
      if (!clientCapabilities?.extensions?.[TASKS_EXTENSION]) {
        missing.push(TASKS_EXTENSION);
      }
      if (!supportsFormElicitation(clientCapabilities)) {
        missing.push("elicitation.form");
      }
      if (missing.length > 0) {
        // 仕様では -32021 (Missing Required Client Capability) を返すが、
        // SDK v2.3 の registerTool はハンドラーが投げたエラーを isError のツール結果に変換する
        return {
          content: [
            {
              type: "text",
              text: `Missing required client capabilities: ${missing.join(", ")}`,
            },
          ],
          isError: true,
        };
      }

      const now = new Date().toISOString();
      const task: TaskRecord = {
        taskId: randomUUID(),
        status: "working",
        statusMessage: "Collecting sources",
        createdAt: now,
        lastUpdatedAt: now,
        topic,
      };
      tasks.set(task.taskId, task);
      runResearch(task);

      // SDK v2.3 は Tasks 拡張を実装していないため、CreateTaskResult の型を持たない
      return {
        resultType: "task",
        ...toWire(task),
      } as unknown as CallToolResult;
    },
  );

  // 以降のコードブロックの share_report ツールと tasks/* メソッドもここで登録する

  return server;
}
```

Tasks 拡張を宣言していないクライアントにタスクを返してはいけません。Claude Code のドキュメントでも、宣言のないリクエストにタスクを返すと `Unsupported result type 'task' for tools/call` というエラーになると説明されています。

Elicitation の form モードへの対応も確認しているのは、クライアントが宣言していない種類の要求を `inputRequests` に入れてはならない（MUST NOT）と仕様で定められているためです。後述する MRTR の `inputRequired()` では SDK がこの確認を自動で行いますが、タスクの `inputRequests` は自前で組み立てるので、サーバー側で確認する必要があります。

### `tasks/get`、`tasks/update`、`tasks/cancel` を実装する

続いて、`buildServer` の中で 3 つのメソッドを `setRequestHandler` で登録します。`setRequestHandler` にメソッド名と zod のスキーマを渡すと、仕様に定義されていないカスタムメソッドも処理できます。

```ts:server.ts
import { acceptedContent } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

  const taskParams = z.object({ taskId: z.string() }).loose();

  server.server.setRequestHandler(
    "tasks/get",
    { params: taskParams },
    async ({ taskId }) => toWire(findTask(taskId)),
  );

  server.server.setRequestHandler(
    "tasks/update",
    { params: taskParams },
    async ({ taskId }, ctx) => {
      const task = findTask(taskId);
      if (task.status !== "input_required") return {};
      // 未知のキーへの応答は無視する。audience への応答が届くまでは input_required のまま待つ
      if (!ctx.mcpReq.inputResponses?.["audience"]) return {};

      // SDK は params.inputResponses を取り出して ctx.mcpReq.inputResponses に渡す
      const answer = acceptedContent<{ audience: string }>(
        ctx.mcpReq.inputResponses,
        "audience",
      );
      if (answer) {
        finishResearch(task, answer.audience);
      } else {
        // decline と cancel はどちらもユーザーが承認しなかったとみなしてタスクを終える
        update(task, {
          status: "cancelled",
          statusMessage: "The user did not choose an audience",
          inputRequests: undefined,
        });
      }
      return {};
    },
  );

  server.server.setRequestHandler(
    "tasks/cancel",
    { params: taskParams },
    async ({ taskId }) => {
      const task = findTask(taskId);
      if (task.status === "working" || task.status === "input_required") {
        update(task, {
          status: "cancelled",
          statusMessage: "Cancelled by the client",
          inputRequests: undefined,
        });
      }
      return {};
    },
  );
```

`acceptedContent` は、指定したキーの応答の `action` が `accept` のときだけ `content` を返す SDK のヘルパーです。`decline` と `cancel` のときは `undefined` を返すので、このサンプルではタスクを `cancelled` にしています。

### タスクを使わずに Elicitation を使う

`share_report` ツールは、タスクを使わない MRTR の Elicitation の例です。1 回目の呼び出しでは `inputResponses` が空なので `inputRequired()` を返し、クライアントが応答を付けて送り直した 2 回目の呼び出しで結果を返します。

```ts:server.ts
import { acceptedContent, inputRequired } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

  // タスクを使わない Elicitation。ツールの結果として inputRequired を返し、クライアントの再送を待つ
  server.registerTool(
    "share_report",
    {
      description: "Share a finished report with the given channel.",
      inputSchema: z.object({ channel: z.string() }),
    },
    async ({ channel }, ctx) => {
      const confirm = ctx.mcpReq.inputResponses?.["confirm"];
      if (!confirm) {
        return inputRequired({
          inputRequests: {
            confirm: inputRequired.elicit({
              message: `レポートを ${channel} に共有しますか？`,
              requestedSchema: {
                type: "object",
                properties: {
                  notify: {
                    type: "boolean",
                    title: "メンバーに通知する",
                    default: false,
                  },
                },
              },
            }),
          },
        });
      }
      const answer = acceptedContent<{ notify?: boolean }>(
        ctx.mcpReq.inputResponses,
        "confirm",
      );
      if (!answer) {
        return { content: [{ type: "text", text: "共有を取りやめました。" }] };
      }
      return {
        content: [
          {
            type: "text",
            text: `${channel} に共有しました（通知: ${answer.notify ? "あり" : "なし"}）。`,
          },
        ],
      };
    },
  );
```

1 回目と 2 回目の呼び出しは独立したリクエストなので、サーバーはその間に状態を保持しません。複数回の入力をまたいで値を引き継ぎたい場合は `requestState` を使います。`requestState` はクライアントを経由して戻ってくるため、認可や業務ロジックに影響する値を入れるなら HMAC などで改ざんを検出する必要があります。

### HTTP サーバーを起動する

最後に `buildServer` を `createMcpHandler` に渡して、Node.js の HTTP サーバーで公開します。`legacy: "reject"` は、2025 年までの仕様に基づくリクエストを受け付けない設定です。

```ts:server.ts
import { createServer } from "node:http";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler } from "@modelcontextprotocol/server";

const handler = toNodeHandler(
  createMcpHandler(buildServer, { legacy: "reject" }),
);

createServer((req, res) => {
  if (req.url !== "/mcp") {
    res.writeHead(404).end();
    return;
  }
  // 2026-07-28 の Streamable HTTP ではメソッド名がヘッダーにも載るので、本文を読まずにログを出せる
  console.error(
    new Date().toISOString(),
    req.headers["mcp-method"],
    req.headers["mcp-name"] ?? "",
  );
  void handler(req, res);
}).listen(PORT, "127.0.0.1", () => {
  console.error(`listening on http://127.0.0.1:${PORT}/mcp`);
});
```

2026-07-28 の Streamable HTTP では、リクエストの `Mcp-Method` ヘッダーにメソッド名が入ります。`Mcp-Name` ヘッダーには、`tools/call` ならツール名が、`tasks/get` などのタスクのメソッドならタスク ID が入ります。ロードバランサーがリクエストの本文を読まずにルーティングするための仕組みです。

以下のコマンドでサーバーを起動します。

```bash
node server.ts
```

## Claude Code から呼び出す

プロジェクトのルートに `.mcp.json` を作成して、MCP サーバーを登録します。

```json:.mcp.json
{
  "mcpServers": {
    "research": {
      "type": "http",
      "url": "http://127.0.0.1:3000/mcp"
    }
  }
}
```

Claude Code の CLI を起動して、`deep_research` ツールを呼び出すように依頼します。`--mcp-config` で `.mcp.json` を読み込み、`--strict-mcp-config` でほかの設定にある MCP サーバーを読み込まないようにしています。

```bash
claude --strict-mcp-config --mcp-config .mcp.json
```

以下のようなプロンプトを入力すると、サーバーがタスクを返して処理を始めます。

```text
research の deep_research ツールで「MCP Tasks」について調べてください
```

Claude はツールを呼び出すと、タスクの完了を待たずに「調査を始めました。」と返答してターンを終えました。入力欄の下には `1 MCP task` と表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1w7VodWDSY8f4B9BYqd7tp/b375e507cd72e005b659c3eac00bba59/claude-mcp-tasks-elicitations-1.png)

サーバーのログには、`tools/call` の直後から `tasks/get` が 2 秒ごとに記録されていました。Claude Code がタスクが完了したかどうかを確認するためにポーリングしていることがわかります。

```text
2026-10-25T03:02:35.930Z tools/call deep_research
2026-10-25T03:02:35.974Z tasks/get 736bc765-bd68-4d43-bf8a-31accb8486e9
2026-10-25T03:02:37.998Z tasks/get 736bc765-bd68-4d43-bf8a-31accb8486e9
2026-10-25T03:02:40.016Z tasks/get 736bc765-bd68-4d43-bf8a-31accb8486e9
```

`/tasks` コマンドを実行すると、サーバーが返した `statusMessage` とポーリング間隔を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3mbRrgUpXczboufYPSp93/1aa71aa50b3f77cc0d6fb95681911ffa/claude-mcp-tasks-elicitations-2.png)

`/tasks` でタスクを選んで x キーを押すと、Claude Code はサーバーに `tasks/cancel` を送ります。Esc キーではタスクは止まりません。

### タスクの途中で Elicitation のダイアログが表示される

タスクが `input_required` になると、Claude Code は `inputRequests` の `elicitation/create` をダイアログとして表示しました。`oneOf` の `title` として指定した「チーム内」と「社内全体」が選択肢の表示名になっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/3arU9ihsXy5n0aiz6ZtQI3/0ae6a1246df9b49ee44dc59e7fa2dffc/claude-mcp-tasks-elicitations-3.png)

ダイアログが表示されている間、`tasks/get` のポーリングは止まっていました。「チーム内」を選んで Accept すると、サーバーに `tasks/update` が届き、ポーリングが再開しました。

```text
2026-10-25T03:03:20.883Z tasks/update 736bc765-bd68-4d43-bf8a-31accb8486e9
2026-10-25T03:03:37.335Z tasks/get 736bc765-bd68-4d43-bf8a-31accb8486e9
```

タスクが `completed` になると、`MCP task 736bc765-bd68-4d43-bf8a-31accb8486e9 (research/deep_research) completed.` と表示されました。Claude はレポートの内容を元にユーザーに返答しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7ygPXsLAVxNVGlZHWTYhn7/d46edd78746a77bf85d2b60676cc8e20/claude-mcp-tasks-elicitations-4.png)

### MRTR の Elicitation

`share_report` ツールの呼び出しを依頼すると、ツール呼び出しの表示に `Fulfilling input required by 'tools/call' (round 1)` と表示され、共有の確認ダイアログが開きました。Accept すると、サーバーのログに 2 回目の `tools/call` が記録され、Claude は共有した結果を返答しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7lPJUA2NTxtlZyV7OPGHIp/e438c344d130ffe1c876649ad8cd468e/claude-mcp-tasks-elicitations-5.png)

タスクの場合と異なり、Claude はダイアログに応答するまでツールの結果を待ち続けます。なお、Claude Code ではタスクを使わないツール呼び出しでも、2 分を超えて実行が続くとバックグラウンドに移ります。ただし、Elicitation のダイアログを表示している間はバックグラウンドに移りません。

## まとめ

- MCP Tasks は、サーバーがツール呼び出しにタスクのハンドルを返し、クライアントが `tasks/get` で状態をポーリングする拡張で、識別子は `io.modelcontextprotocol/tasks`
- Elicitation は処理の途中でユーザーに入力を求める仕組みで、構造化データを集める form モードと、機密情報をクライアントに通さない URL モードがある
- 2026-07-28 仕様では、Elicitation の要求は MRTR の `InputRequiredResult` か、タスクの `input_required` 状態の `inputRequests` でクライアントに届く
- Claude Code の CLI で検証した結果、タスクの状態は `tasks/get` でポーリングされ、`input_required` になるとダイアログが表示され、ユーザーの応答は `tasks/update` でサーバーに送られることが確認できた
- MRTR の Elicitation は、タスクを使わずにツール呼び出しの結果として `inputRequired()` を返すことで実現できる

## 参考

- [Connect Claude Code to tools via MCP - Claude Code Docs](https://code.claude.com/docs/en/mcp)
- [Tasks - Model Context Protocol](https://modelcontextprotocol.io/extensions/tasks/overview)
- [modelcontextprotocol/ext-tasks](https://github.com/modelcontextprotocol/ext-tasks)
- [SEP-2663: Tasks Extension](https://modelcontextprotocol.io/seps/2663-tasks-extension)
- [Elicitation - Model Context Protocol (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/client/elicitation)
- [Multi Round-Trip Requests - Model Context Protocol (2026-07-28)](https://modelcontextprotocol.io/specification/2026-07-28/basic/patterns/mrtr)
- [SEP-1036: URL Mode Elicitation for secure out-of-band interactions](https://modelcontextprotocol.io/seps/1036-url-mode-elicitation-for-secure-out-of-band-intera)
- [Implement SEP-2663: Tasks Extension · modelcontextprotocol/typescript-sdk#2189](https://github.com/modelcontextprotocol/typescript-sdk/issues/2189)
