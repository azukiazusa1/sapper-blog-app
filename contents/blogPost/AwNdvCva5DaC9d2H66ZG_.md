---
id: AwNdvCva5DaC9d2H66ZG_
title: "Mastra の A2A プロトコルサポート"
slug: "mastra-a2a-protocol-support"
about: "Mastra は A2A プロトコルをサポートしています。Mastra サーバーを構築することで A2A プロトコルに準拠したサーバーが立ち上がります。この記事では Mastra を使用して A2A プロトコルに準拠したサーバーを構築し、Mastra のクライアント SDK を使用して A2A プロトコルの仕様に従い通信を行う方法を紹介します。"
createdAt: "2025-05-24T11:39+09:00"
updatedAt: "2025-05-24T11:39+09:00"
tags: ["Mastra", "A2A", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4UUJjtRh1vDl7XK9qh6kaW/a8a76c6b7c7f2b34fc8fd77168a6b98e/food_cheese-hamburger_6974.png"
  title: "チーズバーガーのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/vUmLcHgTeybMu6uE2WsQN/905fd9630bf951dcb4fa032f5262292a/Mastra%C3%A3__%C3%A3__%C3%A3__A2A%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A5__%C3%A8__.wav"
selfAssessment:
  quizzes:
    - question: "Mastra のクライアント SDK で A2A のストリーミング通信を行うメソッドは何ですか？"
      answers:
        - text: "sendAndSubscribe"
          correct: true
          explanation: "sendAndSubscribe メソッドを使用することで、SSE (Server-Sent Events) を利用してタスクの更新をリアルタイムで受信できます。"
        - text: "sendMessage"
          correct: false
          explanation: "sendMessage は同期的な通信で、ストリーミングには対応していません。"
        - text: "streamMessage"
          correct: false
          explanation: "streamMessage というメソッドは存在しません。正しくは sendAndSubscribe です。"
        - text: "sendMessage({ stream: true })"
          correct: false
          explanation: ""

published: true
---

[A2A](https://google.github.io/A2A/#/documentation) プロトコルは AI エージェント間の連携を実現するために設計されたオープンな標準です。異なるチームや組織が開発した AI エージェントが相互に通信し、協力してタスクを実行することを可能にします。

[Mastra](https://mastra.ai/) は TypeScript で AI エージェントを構築するためのフレームワークであり、A2A プロトコルをサポートしています。Mastra のサーバーを構築することで自動的に A2A プロトコルに準拠したサーバーが立ち上がります。Mastra のクライアント SDK を使用することで、A2A プロトコルに準拠したサーバーと通信できます。これにより、A2A プロトコルの仕様に準拠したサーバーに対してエージェントの情報やタスクを要求できます。

この記事では Mastra を使用して A2A プロトコルに準拠したサーバーを構築し、Mastra のクライアント SDK を使用して A2A プロトコルの仕様に従い通信を行う方法を紹介します。

## A2A サーバー

Mastra のプロジェクトを作成し、A2A に準拠したサーバーを立ち上げます。A2A プロトコルに対応するために特別な設定は必要ありません。以下のコマンドを実行して Mastra のプロジェクトを作成します。

```bash
npx create-mastra@latest 
```

対話形式でプロジェクトの設定を行います。

```bash
What do you want to name your project? my-mastra-app
Choose components to install:
  ◯ Agents (recommended)
  ◯ Tools
  ◯ Workflows
Select default provider:
  ◯ OpenAI (recommended)
  ◯ Anthropic
  ◯ Groq
Would you like to include example code? No / Yes
Turn your IDE into a Mastra expert? (Installs MCP server)
  ◯ Skip for now
  ◯ Cursor
  ◯ Windsurf
```

選択した LLM プロバイダーに応じて必要な API キーを取得する必要があります。例えば `Anthropic` を選択した場合には環境変数 `ANTHROPIC_API_KEY` を設定します。

```bash:env
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

簡単なエージェントを作成しましょう。まずはエージェントが使用するツールを作成します。`src/mastra/tools/weather-tool.ts` を作成し、以下のコードを追加します。

```ts:src/tools/weather-tool.ts
import { createTool } from "@mastra/core";
import { z } from "zod";

export const weatherTool = createTool({
  id: "get-weather",
  description: "Get the current weather for a given location.",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for."),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("The current temperature in Celsius."),
    condition: z
      .string()
      .describe("The current weather condition (e.g., sunny, rainy)."),
    location: z
      .string()
      .describe("The location for which the weather is reported."),
  }),
  execute: async ({ context }) => {
    // ダミーのデータを返す
    const weatherData = {
      location: context.location,
      temperature: 25,
      condition: "Sunny",
    };
    return weatherData;
  },
});
```

この例では地点を指定して天気を取得する `weatherTool` というツールを作成しています。
ツールは `createTool` 関数を使用して定義します。`description` はツールの説明であり、エージェントがどのタイミングでツールを呼び出すべきかの判断に使用されるため、ツールが何をするのかを簡潔に記述することでエージェントの精度を向上させることができます。

`inputSchema` と `outputSchema` はそれぞれツールの入力と出力のスキーマを定義します。スキーマは [zod](https://zod.dev/) を使用して定義します。このスキーマの情報もまたエージェントがツールを正しく呼び出すために必要な情報です。できる限り `.describe` を使用してスキーマの各フィールドの説明を追加することをお勧めします。

`execute` はツールが実行されたときに呼び出される関数であり、ここではダミーのデータを返すようにしています。

次に `weatherTool` を使用するエージェントを作成します。天気の情報を参考にして旅行の計画を立てるエージェントを作成します。`src/mastra/agents/travelAgent.ts` を作成し、以下のコードを追加します。

```ts:src/agents/travelAgent.ts
import { anthropic } from "@ai-sdk/anthropic";
import { Agent } from "@mastra/core/agent";
import { weatherTool } from "../tools/weather-tool";

export const travelAgent = new Agent({
  name: "travel-agent",
  instructions: `ユーザーの旅行の計画を手伝うエージェントです。
  旅行の計画を立てるために、ユーザーの希望や条件を聞き出し、最適な旅行プランを提案します。
  必ず旅行先の天気を確認したうえで、天候に応じた旅行プランを提案してください。`,
  model: anthropic("claude-4-sonnet-20250514"),
  tools: {
    weatherTool,
  },
});
```

`src/mastra/index.ts` が Mastra のエントリーポイントです。ここでエージェントを登録します。

```ts:src/index.ts
import { Mastra } from "@mastra/core";
import { travelAgent } from "./agents/travelAgent";

export const mastra = new Mastra({
  agents: { travelAgent },
});
```

以下のコマンドを実行してサーバーを起動します。

```bash
npm run dev
```

http://localhost:4111 にアクセスすると Mastra のダッシュボードが表示されます。Agents タブを選択すると作成した `travel-agent` が表示されていることが確認できます。


![https://images.ctfassets.net/in6v9lxmm5c8/6vgOkXpIQPfEHbsUTqveWX/f63d28217d73173facccdba5ebdcad59/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-24_13.52.31.png]

## A2A クライアント

続いて A2A クライアントを作成します。A2A クライアントはユーザーに代わって A2A サーバーと通信し、エージェントの情報を取得したり、タスクを依頼したりする役割を果たします。クライアントは A2A プロトコルを使用して通信を開始します。

Mastra の Client SDK である `@mastra/client-js` を使用して A2A クライアントを作成します。まずは新しいプロジェクトを作成します。

```bash
mkdir mastra-client-example
cd mastra-client-example
npm init -y
```

必要なパッケージをインストールします。

```bash
npm install @mastra/client-js
npm install --save-dev typescript tsx
```

`package.json` の `"type"` フィールドを `"module"` に設定して ES モジュールとして動作するようにします。コードを実行するための `scripts` セクションも追加します。

```json:package.json
{
  "type": "module",
  "scripts": {
    "dev": "tsx src/index.ts"
  }
}
```

## AgentCard を取得する

まずは [AgentCard](https://google.github.io/A2A/specification/#5-agent-discovery-the-agent-card) を取得する例を見てみましょう。AgentCard はサーバーが提供しているエージェントのスキルなどの情報を記述した JSON 形式のデータです。クライアントは AgentCard の情報を元に適切なエージェントを選択し、タスクを依頼します。

?> A2A の仕様では `AgentCard` は `/.well-known/agent.json` というパスで提供されることが推奨されていますが、Mastra では `./well-known/{agentId}/agent.json` というパスで提供されているようです。

`src/index.ts` を作成し、以下のコードを追加します。

```ts:src/index.ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111",
});

// agent の ID を指定する
// agent の ID は Mastra({ agents: { ... }}) のキー名と同じ
const a2a = client.getA2A("travelAgent");

// /.well-known/{agentId}/agent.json にアクセスして AgentCard を取得する
const agentCard = await a2a.getCard();

console.log("Agent Card:");
console.log(JSON.stringify(agentCard, null, 2));
```

`MastraClient` を使用して Mastra サーバーとやり取りを行うクライアントを作成します。`baseUrl` には先ほど起動した Mastra サーバーの URL を指定します。

`getA2A` メソッドを使用して `A2A` クラスのインスタンスを取得します。このインスタンスを使用して A2A プロトコルに準拠した通信を行います。`getA2A` メソッドの引数にはエージェントの ID を指定します。先ほど作成した `travelAgent` の ID を指定します。

`getCard` メソッドを使用して AgentCard を取得します。このコードを実行すると以下のような出力が得られます。

```bash
{
  name: 'travel-agent',
  description: 'ユーザーの旅行の計画を手伝うエージェントです。\n' +
    '  旅行の計画を立てるために、ユーザーの希望や条件を聞き出し、最適な旅行プランを提案します。\n' +
    '  必ず旅行先の天気を確認したうえで、天候に応じた旅行プランを提案してください。',
  url: '/a2a/travelAgent',
  provider: { organization: 'Mastra', url: 'https://mastra.ai' },
  version: '1.0',
  capabilities: {
    streaming: true,
    pushNotifications: false,
    stateTransitionHistory: false
  },
  defaultInputModes: [ 'text' ],
  defaultOutputModes: [ 'text' ],
  skills: [
    {
      id: 'weatherTool',
      name: 'weatherTool',
      description: 'Get the current weather for a given location.',
      tags: [Array]
    }
  ]
}
```

## メッセージを送信する

A2A プロトコルではクライアントがサーバーにメッセージを送信することで通信が開始されます。サーバーはクライアントからメッセージを受け取るタスクを生成して応答します。

まずは同期的にメッセージを送信する例を見てみましょう。`sendMessage` メソッドを使用してメッセージを送信します。このメソッドは [`message/send`](https://google.github.io/A2A/specification/#71-messagesend) RPC メソッドに対応しています。メッセージを送信する場合にはクライアントは一意の ID を生成して指定する必要があります。

```ts:src/index.ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111",
});

const a2a = client.getA2A("travelAgent");

const id = crypto.randomUUID();
const response = await a2a.sendMessage({
  id,
  message: {
    role: "user",
    parts: [
      { type: "text", text: "一泊二日の箱根旅行のプランを提案してください。" },
    ],
  },
});
```

サーバー側はリクエストを受け取るとタスクを作成して応答します。`sendMessage` の戻り値には `task` オブジェクトが含まれており、以下のような情報が含まれています。

```ts
{
  id: '81503036-d1bc-4147-bee7-02452fac7b40',
  status: {
    state: 'completed',
    timestamp: '2025-05-24T05:33:24.014Z',
    message: [Object]
  },
  artifacts: []
}
```

同期的なメッセージ送信では、`task.status.state` が `completed` になるまで待機します。取りうるタスクの状態は https://google.github.io/A2A/specification/#71-messagesend で確認できます。

`tasks.status.message` を確認するとサーバーのエージェントが生成した応答が含まれています。

```ts:src/index.ts
const response = await a2a.sendMessage({
  id,
  message: {
    role: "user",
    parts: [
      { type: "text", text: "一泊二日の箱根旅行のプランを提案してください。" },
    ],
  },
});

for (const part of response.task.status.message?.parts || []) {
  if (part.type === "text") {
    console.log(part.text);
  }
}
```

このコードを実行すると以下のような出力が得られます。

```bash
箱根の現在の天気は晴れで気温25度と、とても良い天候ですね！この天気を活かした一泊二日の箱根旅行プランをご提案いたします。

## 🌸 箱根一泊二日旅行プラン

### **1日目**
**午前**
- **10:00** 新宿駅から小田急ロマンスカーで箱根湯本駅へ（約85分）
- **11:30** 箱根湯本駅到着、荷物を宿泊施設に預ける
- **12:00** 箱根湯本温泉街散策・お土産ショッピング
...
```

`sendMessage` メソッドではタスクの実行時間が長い場合には `task.status.state` が `working` の状態で応答が返ってきます。その場合にはクライアントはポーリングしてタスクの状態が `completed` になるまで待機する必要があります。タスクの状態をポーリングするためには [`tasks/get`](https://google.github.io/A2A/specification/#73-tasksget) メソッドを使用します。このメソッドは以前に開始されたタスクの状態を取得します。

Mastra のクライアント SDK では `getTask` メソッドを使用してタスクの状態を取得します。

```ts:src/index.ts
const id = crypto.randomUUID();

const response = await a2a.sendMessage({
  id,
  message: {
    role: "user",
    parts: [
      { type: "text", text: "一泊二日の箱根旅行のプランを提案してください。" },
    ],
  },
});

let task = response.task;

if (task.status.state === "working") {
  // タスクの状態が working の場合はポーリングして状態を取得する
  console.log("Waiting for task to complete...");
  while (task.status.state === "working") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    task = await a2a.getTask({ id: task.id });
  }
}

for (const part of task.status.message?.parts || []) {
  if (part.type === "text") {
    console.log(part.text);
  }
}
```

?> 2025 年 5 月 24 日時点では `sendMessage` が正しく動作しない Issue が報告されています。[\[BUG\] A2A getTask returns undefined · Issue #4415 · mastra-ai/mastra](https://github.com/mastra-ai/mastra/issues/4415)

[`tasks/cancel`](https://google.github.io/A2A/specification/#74-taskscancel) メソッドを使用してタスクをキャンセルすることもできます。Mastra のクライアント SDK では `cancelTask` メソッドを使用します。

```ts:src/index.ts
const id = crypto.randomUUID();
const response = await a2a.sendMessage({
  id,
  message: {
    role: "user",
    parts: [
      { type: "text", text: "一泊二日の箱根旅行のプランを提案してください。" },
    ],
  },
});
const task = response.task;
// タスクをキャンセルする
await a2a.cancelTask({ id: task.id });
```

## ストリーミング

A2A の仕様ではエージェントにメッセージを送信しタスクを開始した後、SSE (Server-Sent Events) を使用してタスクの更新をリアルタイムで受信するメソッドが定義されています（[`message/stream`](https://google.github.io/A2A/specification/#711-messagesendparams-object)）。このメソッドを使用する場合には AgentCard の `capabilities.streaming` が `true` である必要があります。

Mastra のクライアント SDK では `sendAndSubscribe` メソッドを使用してストリーミングを行います。

```ts:src/index.ts
import { MastraClient } from "@mastra/client-js";

const client = new MastraClient({
  baseUrl: "http://localhost:4111",
});

const a2a = client.getA2A("travelAgent");

const id = crypto.randomUUID();
const response = await a2a.sendAndSubscribe({
  id,
  message: {
    role: "user",
    parts: [
      { type: "text", text: "一泊二日の箱根旅行のプランを提案してください。" },
    ],
  },
});

// ReadableStream を使用してストリーミングを受信する
const reader = response.body?.getReader();

if (!reader) {
  throw new Error("No reader available");
}

// 無限ループでストリーミングを受信する
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }
  const text = new TextDecoder().decode(value);
  console.log(text);
}
```

`sendAndSubscribe` の戻り値は fetch API の `Response` オブジェクトです。`body` プロパティを使用して `ReadableStream` を取得し、ストリーミングを受信します。

コードを実行するとまずは `state` が `working` の状態で即座に応答が返ってきます。これはタスクはエージェントによってアクティブに処理されていて、クライアントはさらなる更新または終了状態を期待している可能性があることを示しています。AI エージェントによる応答が完了すると `state` が `completed` の状態で応答が返ってきます。

```bash
{"jsonrpc":"2.0","id":"12873278-1479-4142-b94d-16cfdf48c6af","result":{"state":"working","message":{"role":"agent","parts":[{"type":"text","text":"Generating response..."}]}}}

{"jsonrpc":"2.0","id":"12873278-1479-4142-b94d-16cfdf48c6af","result":{"id":"b0a75793-25ab-49f1-bed0-799b3940c29d","status":{"state":"completed","timestamp":"2025-05-24T06:01:41.183Z","message":{"role":"agent","parts":[{"type":"text","text":"箱根の現在の天気は晴れで気温25度と、とても良い天候ですね！この天気を活かした一泊二日の箱根旅行プランをご提案いたします。\n\n ..."}},"artifacts":[]}}}
```

## まとめ

- Mastra は A2A プロトコルをサポートしており、特別な設定なしで A2A サーバーを立ち上げることができる
- Mastra のクライアント SDK を使用して A2A プロトコルに準拠した通信を行うことができる
- `getCard` メソッドを使用して AgentCard を取得できる
- `sendMessage` メソッドを使用してエージェントにメッセージを送信し、タスクを開始できる
- `sendAndSubscribe` メソッドを使用してストリーミングでタスクの更新を受信できる
- タスクの状態をポーリングするためには `getTask` メソッドを使用できる
- タスクをキャンセルするためには `cancelTask` メソッドを使用できる

## 参考

- [Specification - Agent2Agent Protocol (A2A)](https://google.github.io/A2A/specification/#102-security-considerations-summary)
- [A2A Redo by abhiaiyer91 · Pull Request #4033 · mastra-ai/mastra](https://github.com/mastra-ai/mastra/pull/4033)
