---
id: OgO0FVnoDXqiLPnGUEQ0R
title: "AI エージェントの連携を標準化する A2A プロトコルを試してみる"
slug: "ai-a2a-protocol"
about: "AI エージェント同士の連携を標準化するために Agent2Agent プロトコル（A2A）を発表しました。A2A プロトコルは基盤となるフレームワークやベンダーに依存せず、エージェント同士が安全な方法で相互に通信できるように設計されています。この記事ではサンプルコードを通じて A2A プロトコルを使用した AI エージェントの連携を体験してみます。"
createdAt: "2025-04-12T07:50+09:00"
updatedAt: "2025-04-12T07:50+09:00"
tags: ["AI", "A2A"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5JNMmLs2jO5p8IXs4ZwPuT/d810685bf58e2c6a3a81cdad670ebb65/mixnuts_13370-768x640.png"
  title: "ミックスナッツのイラスト"
selfAssessment:
  quizzes:

published: true
---

AI エージェントとはユーザーに代わって目標達成のために自律的に選択してタスクを遂行する AI 技術のことです。従来のチャット型の AI ツールは 1 つのタスクを完了するたびに再度ユーザーの指示を待つ必要がありました。AI エージェントは実行したタスクのフィードバックを元に次のタスクを選択し、ユーザーにの介入を最小限に抑えることができます。

AI エージェントが効果的に目的を達成するためには多様なエージェントがエコシステム内で連携することが必要です。例えば AI エージェントに旅行の計画を立ててもらう場合を考えてみましょう。以下のようなタスクが考えられます。

- 旅行先の天気予報を調べて日程を決める
- 宿泊先の予約
- 交通機関の予約

よく晴れた日に旅行に行くことができるように、旅行先の天気予報を調べて日程を決める必要があるでしょう。AI は最新の情報を知識として持っていないので、天気予報を調べるために外部の API を呼び出す必要があります。宿泊先や交通機関の予約も同様です。AI エージェントはホテルの空き情報や料金の比較を行ったり、宿泊料金を支払うためにそれぞれ外部のエージェントに問い合わせる必要があるでｄしょう。

Google はこのような AI エージェント同士の連携を標準化するために Agent2Agent プロトコル（A2A）を発表しました。A2A プロトコルは基盤となるフレームワークやベンダーに依存せず、エージェント同士が安全な方法で相互に通信できるように設計されています。

LLM と外部のツールと連携するプロトコルとして、すでに [Model Context Protocol（MCP](https://modelcontextprotocol.io/introduction) が存在します。MCP はエージェントとツールやデータの間の接続を標準化する一方、A2A は異なる問題に焦点を当てています。A2A はツールではなくエージェント同士の通信を標準化します。つまり、MCP と A2A は競合するものではなく、補完し合う関係にあります。

この記事ではサンプルコードを通じて A2A プロトコルを実際に体験してみます。すべてのコードは以下のレポジトリに公開しています。

https://github.com/azukiazusa1/a2a-example

## プロジェクトのセットアップ

この記事では TypeScript を使用して A2A プロトコルを試してみます。`npm init -y` でプロジェクトを作成しましょう。

```bash
npm init -y
```

`package.json` の `type` を `module` に変更しておきます。

```json
{
  "type": "module"
}
```

続いて必要なパッケージをインストールします。

```bash
npm install ai @ai-sdk/google zod hono @hono/node-server
npm install --save-dev @types/node tsx typescript
```

AI モデルを呼び出すための SDK として [Vercel AI SDK](https://sdk.vercel.ai/) を使用します。AI モデルとして Google が提供する Gemini を使用するので対応するパッケージである `@ai-sdk/google` をインストールしています。またサーバーを構築するために `hono` をインストールしています。

LLM を利用するには API キーが必要です。今回は Google Gemini を使用するため、[Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja) で API キーを取得します。選択するモデルによっては料金が発生する場合があるため、ご注意ください。取得した API キーは環境変数 `GOOGLE_GENERATIVE_AI_API_KEY` に設定しておきます。

```bash
export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

## A2A サーバーの実装

A2A プロトコルは標準的な HTTP 上に構築されています。A2A プロトコルでは以下の 3 つのアクターが存在します。

- ユーザー：目的を達成するためにエージェントに指示を出す人間
- クライアント：ユーザーに代わってエージェントにアクションを要求する
- リモートエージェント（サーバー）：クライアントからのリクエストを受け取り、アクションを実行する

リモートエージェントは HTTP サーバーを立ち上げ [AgentCard](https://google.github.io/A2A/#/documentation?id=agent-card) を JSON 形式で公開します。AgentCard にはエージェントが提供する機能や認証メカニズムを記述します。クライアントは AgentCard を取得して、エージェントの機能を確認し、タスクを完了するために最適なエージェントを選択し通信を行います。AgentCard は `https://<URL>/.well-known/agent.json` という URL にホストすることが推奨されています。

### AgentCard の実装

AgentCard は以下のインタフェースを持ちます。これは `src/schema.ts` に実装しておきましょう。

```ts:src/schema.ts
// An AgentCard conveys key information:
// - Overall details (version, name, description, uses)
// - Skills: A set of capabilities the agent can perform
// - Default modalities/content types supported by the agent.
// - Authentication requirements
export interface AgentCard {
  // Human readable name of the agent.
  // (e.g. "Recipe Agent")
  name: string;
  // A human-readable description of the agent. Used to assist users and
  // other agents in understanding what the agent can do.
  // (e.g. "Agent that helps users with recipes and cooking.")
  description: string;
  // A URL to the address the agent is hosted at.
  url: string;
  // The service provider of the agent
  provider?: {
    organization: string;
    url: string;
  };
  // The version of the agent - format is up to the provider. (e.g. "1.0.0")
  version: string;
  // A URL to documentation for the agent.
  documentationUrl?: string;
  // Optional capabilities supported by the agent.
  capabilities: {
    streaming?: boolean; // true if the agent supports SSE
    pushNotifications?: boolean; // true if the agent can notify updates to client
    stateTransitionHistory?: boolean; //true if the agent exposes status change history for tasks
  };
  // Authentication requirements for the agent.
  // Intended to match OpenAPI authentication structure.
  authentication: {
    schemes: string[]; // e.g. Basic, Bearer
    credentials?: string; //credentials a client should use for private cards
  };
  // The set of interaction modes that the agent
  // supports across all skills. This can be overridden per-skill.
  defaultInputModes: string[]; // supported mime types for input
  defaultOutputModes: string[]; // supported mime types for output
  // Skills are a unit of capability that an agent can perform.
  skills: {
    id: string; // unique identifier for the agent's skill
    name: string; //human readable name of the skill
    // description of the skill - will be used by the client or a human
    // as a hint to understand what the skill does.
    description: string;
    // Set of tagwords describing classes of capabilities for this specific
    // skill (e.g. "cooking", "customer support", "billing")
    tags: string[];
    // The set of example scenarios that the skill can perform.
    // Will be used by the client as a hint to understand how the skill can be
    // used. (e.g. "I need a recipe for bread")
    examples?: string[]; // example prompts for tasks
    // The set of interaction modes that the skill supports
    // (if different than the default)
    inputModes?: string[]; // supported mime types for input
    outputModes?: string[]; // supported mime types for output
  }[];
}
```

AgentCard のインタフェースを満たした JSON を作成しましょう。ここではサイコロを振ったランダムな値を返すエージェントを作成します。以下のように `src/server/agentCard.ts` を作成します。

```ts:src/server/agentCard.ts
import { AgentCard } from "../schema.js";

export const agentCard: AgentCard = {
  name: "Dice Agent",
  description: "サイコロを振るエージェント",
  url: "http://localhost:3000",
  provider: {
    organization: "azukiazusa",
    url: "https://azukiazusa.dev",
  },
  version: "1.0.0",
  capabilities: {
    streaming: false,
    pushNotifications: false,
    stateTransitionHistory: false,
  },
  authentication: {
    schemes: [],
  },
  defaultInputModes: ["text/plain"],
  defaultOutputModes: ["text/plain"],
  skills: [
    {
      id: "dice-roll",
      name: "サイコロを振る",
      description:
        "サイコロを振ってランダムな値を返すエージェントです。サイコロの目は1から6までの整数です。",
      tags: ["dice", "random"],
      examples: [
        "サイコロを振ってください。",
        "1から6までの整数を返してください。",
      ],
      inputModes: ["text/plain"],
      outputModes: ["text/plain"],
    },
  ],
};
```
  
`src/server/index.ts` に Hono を使って `.well-known/agent.json` に AgentCard をホストするサーバーを実装します。

```ts:src/server/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { agentCard } from "./agentCard.js";

const app = new Hono();
``;

app.get("/.well-known/agent.json", (c) => {
  return c.json(agentCard);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
```

`package.json` にサーバーを起動するためのスクリプトを追加します。

```json
{
  "scripts": {
    "server": "tsx src/server/index.ts"
  }
}
```

`npm run server` でサーバーを起動します。

```bash
npm run server
```

http://localhost:3000/.well-known/agent.json にアクセスして AgentCard が取得できることを確認しましょう。

```bash
curl http://localhost:3000/.well-known/agent.json
```

### Task オブジェクト

クライアントとリモートエージェント間の通信はエージェント間が協力しエンドユーザーのリクエストを処理するタスクの完了を目的としています。Task オブジェクトはクライアントとリモートエージェントが協力してタスクを完了するために必要な情報を持つステートフルなオブジェクトです。タスクはリモートエージェントによって即座に完了する場合もあれば、長時間実行される場合もあります。長時間実行されるタスクの場合はクライアントはリモートエージェントにポーリングしてタスクの最新のステータスを確認します。

タスクはクライアントによって作成され、リモートエージェントはタスクのステータスを返します。タスクが完了した場合にはリモートエージェントは結果をアーティファクトとして返します。エージェントはクライアントからの要求に応じて以下のような作業を行います。

- 即座に結果を返す
- タスクを後にスケジューリングする
- 要求を拒否する
- タスクを他のエージェントに委任する
- クライアントにより詳細な情報を問い合わせる

またリモートエージェントが 1 度結果を返した後でも、クライアントは同じコンテキスト内で変更を要求できます。

Task オブジェクトは以下のようなインタフェースを持ちます。`src/schema.ts` に実装します。

```ts:src/schema.ts
export interface Task {
  id: string; // unique identifier for the task
  sessionId: string; // client-generated id for the session holding the task.
  status: TaskStatus; // current status of the task
  history?: Message[];
  artifacts?: Artifact[]; // collection of artifacts created by the agent.
  metadata?: Record<string, any>; // extension metadata
}
// TaskState and accompanying message.
export interface TaskStatus {
  state: TaskState;
  message?: Message; //additional status updates for client
  timestamp?: string; // ISO datetime value
}
// Sent by the client to the agent to create, continue, or restart a task.
export interface TaskSendParams {
  id: string;
  sessionId?: string; //server creates a new sessionId for new tasks if not set
  message: Message;
  historyLength?: number; //number of recent messages to be retrieved
  // where the server should send notifications when disconnected.
  pushNotification?: PushNotificationConfig;
  metadata?: Record<string, any>; // extension metadata
}
type TaskState =
  | "submitted"
  | "working"
  | "input-required"
  | "completed"
  | "canceled"
  | "failed"
  | "unknown";

interface PushNotificationConfig {
  url: string;
  token?: string; // token unique to this task/session
  authentication?: {
    schemes: string[];
    credentials?: string;
  };
}

export interface Message {
  role: "user" | "agent";
  parts: Part[];
  metadata?: Record<string, any>;
}

interface TextPart {
  type: "text";
  text: string;
}
interface FilePart {
  type: "file";
  file: {
    name?: string;
    mimeType?: string;
    // oneof {
    bytes?: string; //base64 encoded content
    uri?: string;
    //}
  };
}
interface DataPart {
  type: "data";
  data: Record<string, any>;
}
export type Part = (TextPart | FilePart | DataPart) & {
  metadata: Record<string, any>;
};
```

タスクの最終結果としてアーティファクトが生成されます。アーティファクト 1 つのタスクで複数生成される場合もあります。例えば Web サイトを生成するタスクの場合、HTML ファイルと画像ファイルがそれぞれアーティファクトとして生成されます。

```ts:src/schema.ts
export interface Artifact {
  name?: string;
  description?: string;
  parts: Part[];
  metadata?: Record<string, any>;
  index: number;
  append?: boolean;
  lastChunk?: boolean;
}
```

クライアントからの要求の処理中にエラーが発生した場合には、サーバーは以下の形式でエラーを返します。エラーコードは [JSON-RPC 2.0](https://www.jsonrpc.org/specification) の仕様に従います。

```ts:src/schema.ts
export interface ErrorMessage {
  code: number;
  message: string;
  data?: any;
}
```

クライアントからのリクエストは JSON-RPC 2.0 形式で送信されます。クライアントから新しいタスクを作成する場合は `tasks/send` メソッドを使用します。以下のような JSON 形式でリクエストを送信します。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tasks/send",
  "params": {
    id: "de38c76d-d54c-436c-8b9f-4c2703648d64",
    sessionId: "a3e5f7b6-3e4b-4f5a-8b9f-4c2703648d64",
    message: {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "サイコロを振ってください。"
        }
      ]
    },
    metadata: {}
  }
}

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tasks/send",
  "params": {
    id: "de38c76d-d54c-436c-8b9f-4c2703648d64",
    "message": {
      "role": "user",
      "parts": [
        {
          "type": "text",
          "text": "サイコロを振ってください。"
        }
      ]
    },
  },
  "metadata": {}
}
```

このタスクに対するレスポンスとして、以下のような JSON が返されます。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "id": "de38c76d-d54c-436c-8b9f-4c2703648d64",
    "sessionId": "a3e5f7b6-3e4b-4f5a-8b9f-4c2703648d64",
    "status": {
      "state": "completed",
    },
    "artifacts": [
      {
        "name": "dice",
        "description": "サイコロの目",
        "parts": [
          {
            "type": "text",
            "text": "1"
          }
        ],
        "metadata": {},
        "index": 0,
      }
    ]
  }
}
```

### Task の実装

それではクライアントからのリクエストを受け取ってタスクを処理するサーバーを実装していきましょう。`src/server/task.ts` にリクエストハンドラを実装していきます。

まずリクエストが JSON-RPC 形式であることを確認します。

```ts:src/server/task.ts
import { Hono } from "hono";
import { ErrorMessage } from "../schema";

const taskApp = new Hono();

taskApp.post("/", async (c) => {
  const body = await c.req.json();
  if (!isValidJsonRpcRequest(body)) {
    const errorResponse: ErrorMessage = {
      code: -32600,
      message: "Invalid Request",
    };
    return c.json(errorResponse, 400);
  }
});

function isValidJsonRpcRequest(body: any) {
  return (
    typeof body === "object" &&
    body !== null &&
    body.jsonrpc === "2.0" &&
    typeof body.method === "string" &&
    (body.id === null ||
      typeof body.id === "string" ||
      typeof body.id === "number") &&
    (body.params === undefined ||
      typeof body.params === "object" ||
      Array.isArray(body.params))
  );
}

export { taskApp };
```

`body.method` を確認しクライアントからのリクエストの種類を判別します。ここでは以下の 2 つのメソッドを実装します。

- `tasks/send`：クライアントからのリクエストを受け取り、タスクを処理する
- `tasks/get`：タスクで生成されたアーティファクトを取得する

```ts:src/server/task.ts
taskApp.post("/", async (c) => {
  const body = await c.req.json();
  // ...

  switch (body.method) {
    case "tasks/send":
      return handleSendTask(c, body);
    case "tasks/get":
      return handleGetTask(c, body);
    // その他に tasks/cancel や tasks/sendSubscribe などのメソッドもあるが、ここでは省略する
    case "tasks/cancel":
      // ...
    case "tasks/sendSubscribe":
      // ...
    default:
      const errorResponse: ErrorMessage = {
        code: -32601,
        message: "Method not found",
      };
      return c.json(errorResponse, 404);
  }
});
```

それぞれの要求を処理するハンドラを実装していきましょう。まずは `handleSendTask` から実装します。タスクはステートフルなオブジェクトであるため、タスクの状態を管理する必要があります。ここでは簡単のためにメモリ上にタスクの状態を保持しますが、実際にはデータベースやファイルシステムなどに保存することが推奨されます。

`getOrCreateTask` 関数はクライアントからリクエストされた `taskId` を元にタスクの状態を取得します。タスクがすでに存在する場合はそのタスクを返し、存在しない場合は新しいタスクを作成します。

```ts:src/server/task.ts
import { Artifact, ErrorMessage, Task, TaskSendParams, TaskStatus, Message } from "../schema";
import { randomUUID } from "node:crypto";

// タスクの状態を表すインターフェース
interface TaskAndHistory {
  task: Task;
  history: Message[];
}
// タスクの状態をメモリ上に保持する
const taskStore = new Map<string, TaskAndHistory>();

// タスクストアからタスクを取得する
// タスクが存在しない場合は新しいタスクを作成する
function getOrCreateTask(
  taskId: string,
  initialMessage: Message
): TaskAndHistory {
  // タスクストアからタスクを取得する
  let data = taskStore.get(taskId);
  if (!data) {
    const newTask: Task = {
      id: taskId,
      sessionId: randomUUID(),
      status: {
        // タスクの初期状態は submitted
        state: "submitted",
        timestamp: new Date().toISOString(),
        // 最初のメッセージは history に追加する
        message: undefined,
      },
      history: [],
      artifacts: [],
    };
    data = { task: newTask, history: [initialMessage] };
    taskStore.set(taskId, data);
  } else {
    // すでに存在するタスクなら history に追加する
    data = {
      ...data,
      history: [...data.history, initialMessage],
    };

    // すでに完了済みのタスクの場合はエラーを返す
    const completedStates = ["completed", "canceled", "failed"];
    if (completedStates.includes(data.task.status.state)) {
      const errorResponse: ErrorMessage = {
        code: -32603,
        message: "Task already completed",
      };
      throw new Error(JSON.stringify(errorResponse));
    }
  }
  return data;
}

async function handleSendTask(c: Context, body: any) {
  const params: TaskSendParams = body.params;
  // params の検証
  if (!params || !params.id || !params.message) {
    const errorResponse: ErrorMessage = {
      code: -32602,
      message: "Invalid params",
    };
    return c.json(errorResponse, 400);
  }

  const getOrCreateTaskResult = getOrCreateTask(params.id, params.message);

  // ...
}
```

続いて `handleSendTask` の中でタスクを処理します。そのためサイコロを降ることができる AI エージェントを実装します。LLM はランダムな値を生成する機能を持っていないんため、tool を使用してランダムな値を生成した結果を LLM に渡します。

サイコロを降るためのツールは以下のように実装します。

```ts:src/server/task.ts
import { tool } from "ai";
import { z } from "zod";

const dice = tool({
  // ツールの説明。この説明を元に LLM がツールを選択する。
  description: "入力された面数のサイコロを振ります。",
  // ツールを呼び出す際に必要なパラメータを定義
  parameters: z.object({
    dice: z.number().min(1).describe("サイコロの面数").optional().default(6),
  }),
  // ツールが LLM によって呼び出されたときに実行される関数
  execute: async ({ dice = 6 }) => {
    return Math.floor(Math.random() * dice) + 1;
  },
});
```

AI SDK の `generateText()` メソッドを使用して LLM にリクエストを送信する際に `tools` オプションを指定して作成した `dice` ツールを渡します。LLM は `dice` ツールを呼び出してサイコロの目を生成します。LLM の会話の履歴は `result.steps` で取得できるので、それを元にタスクの状態を更新します。

```ts:src/server/task.ts
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

async function handleSendTask(c: Context, body: any) {
  
  const getOrCreateTaskResult = getOrCreateTask(params.id, params.message);

  // タスクの状態を "working" に更新する
  taskStore.set(params.id, {
    ...getOrCreateTaskResult,
    task: {
      ...getOrCreateTaskResult.task,
      status: {
        state: "working",
        timestamp: new Date().toISOString(),
      },
    },
  });

  // LLM にリクエストを送信する
  const result = await generateText({
    model: google("gemini-2.5-pro-exp-03-25"),
    tools: {
      dice,
    },
    maxSteps: 5,
    // AI エージェントへのリクエストはリクエストパラメータに入っている
    messages: params.message.parts.map((part) => ({
      role: params.message.role === "user" ? "user" : "system",
      content: part.type === "text" ? part.text : "",
    })),
  });

  // アーティファクトを生成する
  const artifact: Artifact = {
    name: "dice",
    description: "サイコロの目",
    parts: [
      {
        type: "text",
        text: result.text,
        metadata: {},
      },
    ],
    metadata: {},
    index: 0,
  };

  // 会話の履歴を取得する
  const steps = result.steps.map((step) => step.text);
  const history = result.steps.map((step) => ({
    role: "agent",
    parts: [
      {
        type: "text",
        text: step.text,
        metadata: {},
      },
    ],
    metadata: {},
  })) as Message[];

  // タスクの状態を "completed" に更新し、タスクの履歴に追加する
  taskStore.set(params.id, {
    ...getOrCreateTaskResult,
    task: {
      ...getOrCreateTaskResult.task,
      status: {
        state: "completed",
        message: {
          role: "agent",
          parts: [
            {
              type: "text",
              text: result.text,
              metadata: {},
            },
          ],
        },
        timestamp: new Date().toISOString(),
      },
      artifacts: [artifact],
      history: [...getOrCreateTaskResult.history, ...history],
    },
  });

  // レスポンスを返す
  const response = {
    jsonrpc: "2.0",
    id: body.id,
    result: {
      id: body.id,
      sessionId: getOrCreateTaskResult.task.sessionId,
      status: "completed",
      artifacts: [artifact],
    },
  };
  return c.json(response);
}
```


`handleGetTask` はタスク ID を指定してメモリストアからタスクを取得します。タスクが存在しない場合はエラーを返します。

```ts:src/server/task.ts
async function handleGetTask(c: Context, body: any) {
  const params = body.params;
  if (!params || !params.id) {
    const errorResponse: ErrorMessage = {
      code: -32602,
      message: "Invalid params",
    };
    return c.json(errorResponse, 400);
  }

  const taskAndHistory = taskStore.get(params.id);
  if (!taskAndHistory) {
    const errorResponse: ErrorMessage = {
      code: -32603,
      message: "Task not found",
    };
    return c.json(errorResponse, 404);
  }

  const response = {
    jsonrpc: "2.0",
    id: body.id,
    result: {
      id: taskAndHistory.task.id,
      sessionId: taskAndHistory.task.sessionId,
      status: taskAndHistory.task.status,
      artifacts: taskAndHistory.task.artifacts,
    },
  };
  return c.json(response);
}
```

`src/server/index.ts` にタスクのルーティングを追加します。

```ts:src/server/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { agentCard } from "./agentCard.js";
import { taskApp } from "./task.js";
const app = new Hono();
app.get("/.well-known/agent.json", (c) => {
  return c.json(agentCard);
});
app.route("/", taskApp);

```

## クライアント

続いてリモートエージェントにリクエストを送信するクライアントを実装します。クライアントは taskId を生成して JSON-RPC 形式でリモートエージェントに HTTP リクエストを送信します。

`src/client.ts` に `A2AClient` クラスを実装します。

```ts:src/client.ts
export class A2AClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // taskId を生成する関数
  private generateTaskId(): string {
    return crypto.randomUUID();
  }
}
```

まずはリモートエージェントの AgentCard を取得するメソッドを実装します。`.well-known/agent.json` に GET リクエストを送信して AgentCard を取得します。

```ts:src/client.ts
import { AgentCard } from "./schema.js";

export class A2AClient {
  // AgentCard を取得するメソッド
  async agentCard(): Promise<AgentCard> {
    const response = await fetch(`${this.baseUrl}/.well-known/agent.json`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch AgentCard");
    }
    const agentCard: AgentCard = await response.json();
    return agentCard;
  }
}
```

続いて `tasks/send` メソッドを実装します。タスク ID を生成して JSON-RPC 形式でリモートエージェントに POST リクエストを送信します。

```ts:src/client.ts
import { TaskSendParams } from "./schema.js";

export class A2AClient {
  // ...

  // tasks/send メソッドを実装する
  async sendTask(params: TaskSendParams): Promise<any> {
    const taskId = this.generateTaskId();
    const requestBody = {
      jsonrpc: "2.0",
      id: taskId,
      method: "tasks/send",
      params: params,
    };
    const response = await fetch(`${this.baseUrl}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      throw new Error("Failed to send task");
    }
    const responseBody = await response.json();
    return responseBody;
  }
}
```

最後に `tasks/get` メソッドを実装します。タスク ID を指定して JSON-RPC 形式でリモートエージェントに POST リクエストを送信します。

```ts:src/client.ts
import { TaskSendParams, Task } from "./schema.js";

export class A2AClient {
  // ...

  // tasks/get メソッドを実装する
  async getTask(taskId: string): Promise<Task> {
    const requestBody = {
      jsonrpc: "2.0",
      id: taskId,
      method: "tasks/get",
      params: {
        id: taskId,
      },
    };
    const response = await fetch(`${this.baseUrl}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      throw new Error("Failed to get task");
    }
    const responseBody = await response.json();
    return responseBody;
  }
}
```

## CLI ツールを作成する

最後に CLI ツールを作成してリモートエージェントにリクエストを送信してみましょう。まず初めに `agentCard` を取得してエージェントが提供している機能を確認します。この機能の情報を AI SDK に tool として登録します。tool の `execute` メソッドでは `A2AClient` を使ってリモートエージェントにリクエストを送信します。

```ts:src/cli.ts
import { ToolSet, tool } from "ai";
import { A2AClient } from "./client.js";

const client = new A2AClient("http://localhost:3000");

const agentCard = await client.agentCard();
const tools: ToolSet = {};
for (const skill of agentCard.skills) {
  tools[skill.id] = tool({
    description: `
      AI エージェント ${agentCard.name} のスキルです。結果は artifact として返されます。
      スキル名: ${skill.name}
      スキルの説明: ${skill.description}
      例: ${skill.examples?.join(", ")}
    `,
    parameters: z.object({
      input: z
        .string()
        .min(1)
        .describe("AI エージェントにタスクを要求するための入力です。"),
    }),
    execute: async ({ input }) => {
      return await client.sendTask({
        message: {
          role: "user",
          parts: [
            {
              type: "text",
              text: input,
              metadata: {},
            },
          ],
        },
      });
    },
  });
}
```

メインの処理では無限ループ内でユーザーの入力を受け付けます。ユーザーの入力は AI SDK の `streamText()` メソッドに渡して LLM へリクエストを送信します。

```ts:src/cli.ts
import { createInterface } from "node:readline/promises";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  while (true) {
    const input = await rl.question("あなた: ");
    if (input === "exit") {
      break;
    }

    const response = streamText({
      model: google("gemini-2.5-pro-exp-03-25"),
      tools,
      messages: [{ role: "user", content: input }],
      maxSteps: 5,
    });

    rl.write("AI: ");
    for await (const chunk of response.textStream) {
      rl.write(chunk);
    }

    rl.write("\n");
  }
}

main()
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    rl.close();
  });
```

LLM はユーザーからサイコロを降るリクエストを受け取ると、ツールを呼び出す必要があると判断しツールを呼び出す要求を行います。ツールを呼び出すと先程作成したリモートエージェントにリクエストが送信されることになります。

「サイコロを振って」というリクエストを送信すると、サイコロの目を返すエージェントにリクエストを送信し結果を取得することが確認できます。

```bash
あなた: こんにちは
AI: こんにちは！今日はどのようなお手伝いができますか？サイコロを振ったり、何か楽しいことをお手伝いできます。何か特別なリクエストはありますか？
あなた: サイコロを振って
AI: はい、サイコロを振ります！標準的な6面サイコロを振りますね。サイコロを振った結果は 4 でした！

もう一度振りますか？それとも別の目的で使いたいですか？
```

## まとめ

- Agent2Agent（A2A）プロトコルはエージェント間の相互運用性を提供するためのプロトコル。標準的な HTTP ベースの API を使用して、エージェント間でタスクを共有し、協力して処理する
- A2A プロトコルには 3 つのアクターが存在する
  - ユーザー：目的を達成するためにエージェントに指示を出す人間
  - クライアント：ユーザーに代わってエージェントにアクションを要求する
  - リモートエージェント（サーバー）：クライアントからのリクエストを受け取り、アクションを実行する
- AgentCard はエージェントの機能を説明するメタデータで、エージェントの URL や提供するスキル、認証方法などを含む。`.well-known/agent.json` にホストすることが推奨されている

- Task オブジェクトはクライアントとリモートエージェント間の通信を管理するためのステートフルなオブジェクトで、タスクの状態や履歴、アーティファクトを保持する
- クライアントは JSON-RPC 形式でリモートエージェントに Task オブジェクトを送信し通信が行われる
- クライアントから送信されるリクエストには以下のようなメソッドがある
  - `tasks/send`：クライアントからのリクエストを受け取り、タスクを処理する
  - `tasks/get`：タスクで生成されたアーティファクトを取得する
  - `tasks/cancel`：タスクをキャンセルする
  - `tasks/sendSubscribe`：タスクの進捗を通知するためのサブスクリプションを送信する
- 
## 参考

- [Agent2Agent プロトコル（A2A）を発表：エージェントの相互運用性の新時代 | Google Cloud 公式ブログ](https://cloud.google.com/blog/ja/products/ai-machine-learning/a2a-a-new-era-of-agent-interoperability)
- [A2A](https://google.github.io/A2A/#/)
- [google/A2A: An open protocol enabling communication and interoperability between opaque agentic applications.](https://github.com/google/A2A)
- [A2A/samples/js at main · google/A2A](https://github.com/google/A2A/tree/main/samples/js)