---
id: op9mxT5nw8CL8qBjjIQDi
title: "A2A プロトコルの JavaScript SDK を試してみる"
slug: "a2a-protocol-js-sdk"
about: "A2A プロトコルはエージェント間の通信を標準化するためのプロトコルです。JavaScript SDK を使って A2A サーバーとクライアントを実装し、エージェント間通信を試してみます。"
createdAt: "2025-06-15T11:01+09:00"
updatedAt: "2025-06-15T11:01+09:00"
tags: ["A2A", "Typescript", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1i2cYBTxAfHbT3ZnZN2FiU/5816a12dc35cbe3385f0d7d61adffe60/cute_oumugai_10615-768x640.png"
  title: "かわいいオウムガイのイラスト"
audio: null
selfAssessment:
  quizzes:    
    - question: "AgentExecutor クラスで実装が必要な2つのメソッドは何ですか？"
      answers:
        - text: "start と stop"
          correct: false
          explanation: null
        - text: "init と destroy"
          correct: false
          explanation: null
        - text: "execute と cancelTask"
          correct: true
          explanation: "AgentExecutor クラスでは、`execute`（エージェントが受け取ったタスクを実行するメソッド）と `cancelTask`（エージェントが実行中のタスクをキャンセルするメカニズムを提供するメソッド）の2つのメソッドを実装する必要があります。"
        - text: "send と receive"
          correct: false
          explanation: null
    
    - question: "タスクのライフサイクルで最初の状態は何ですか？"
      answers:
        - text: "working"
          correct: false
          explanation: null
        - text: "submitted"
          correct: true
          explanation: null
          explanation: "新しいタスクの場合、TaskStatus が `submitted` の状態で初期化されます。この状態は、タスクが受け付けられたが、まだ処理が開始されていないことを示します。"
        - text: "pending"
          correct: false
          explanation: null
        - text: "initialized"
          correct: false
          explanation: null
    
    - question: "A2A クライアントでストリーミング応答を受け取るために使用するメソッドは何ですか？"
      answers:
        - text: "sendMessage"
          correct: false
          explanation: null
        - text: "sendMessageStream"
          correct: true
          explanation: "`sendMessageStream` メソッドを使用することで、ストリーミングで応答を受け取ることができます。このメソッドは AsyncGenerator を返すため、`for await...of` 構文を使用して非同期にイベントを処理できます。"
        - text: "getMessageStream"
          correct: false
          explanation: null
        - text: "streamMessage"
          correct: false
          explanation: null

published: true
---

[A2A プロトコル](https://google-a2a.github.io/A2A/latest/)は、エージェント間の通信を標準化するためのプロトコルです。多様なフレームワークやベンダー間での相互運用性を促進することを目的としています。

A2A の仕様に基づいて実装された JavaScript SDK が新たに公開されました。この記事では A2A プロトコルの JavaScript SDK を使って、エージェント間通信を試してみます。

## プロジェクトのセットアップ

まず、プロジェクトをセットアップします。Node.js と npm がインストールされていることを前提としています。

```bash
mkdir a2a-example
cd a2a-example
npm init -y
```

次に、必要なパッケージをインストールします。

```bash
npm install @a2a-js/sdk express ai @ai-sdk/openai
npm install --save-dev typescript @types/node tsx
```

`@a2a-js/sdk` が今回メインとなる A2A プロトコルの SDK です。`express` は簡単なサーバーを立てるために使用します。LLM モデルを使用するために [Vercel AI SDK](https://ai-sdk.dev/docs/introduction#ai-sdk) を使用します。この例では OpenAI のモデルを使用しますが、AI SDK はモデルを抽象化しているため、他のモデルにも簡単に切り替えることができます。

OpenAI の API を使用するため、環境変数 `OPENAI_API_KEY` を設定しておく必要があります。[OpenAI のダッシュボード](https://platform.openai.com/api-keys)から API キーを取得し、以下のように設定します。

```bash
export OPENAI_API_KEY=your_openai_api_key
```


ES モジュールを使用するために、`package.json` に以下の設定を追加します。

```json
{
  "type": "module"
}
```

## エージェントカードの実装

A2A サーバーは必ず[エージェントカード](https://google-a2a.github.io/A2A/latest/specification/#5-agent-discovery-the-agent-card)を提供する必要があります。

エージェントカードは、エージェントの機能を記述する JSON ドキュメントです。サーバーが提供するエージェントのスキルや認証メカニズムを定義します。A2A クライアントはこのエージェントカードを参照しタスクを完了するために適切なエージェントを選択します。エージェントカードは `https://{server_domain}/.well-known/agent.json` という URL でホストされることが推奨されています。

エージェントカードは `@a2a-js/sdk` の `AgentCard` 型を使用して定義できます。以下はサイコロを振るエージェントのカードの例です。`src/server/agentCard.ts` に実装します。

```ts:src/server/agentCard.ts
import type { AgentCard } from "@a2a-js/sdk";

export const agentCard: AgentCard = {
  name: "Dice Agent",
  description: "サイコロを振るエージェント",
  // A2A サーバーを実行しているホストの URL
  url: "http://localhost:41241",
  provider: {
    organization: "Dice Organization",
    url: "https://example.com/dice-org",
  },
  version: "0.1.0",
  capabilities: {
    // ストリーミングをサポートしているかどうか
    streaming: true,
    // push 通知をサポートしているかどうか
    pushNotifications: false,
    // agent が履歴を保持しているかどうか
    stateTransitionHistory: true,
  },
  security: undefined,
  securitySchemes: undefined,
  defaultInputModes: ["text/plain"],
  defaultOutputModes: ["text/plain"],
  // エージェントが持つ専門的なスキルの定義
  skills: [
    {
      id: "rollDice",
      name: "rollDice",
      description: "サイコロを振った結果を返す",
      // プロンプトの例
      examples: [
        "ランダムな数字を生成してください",
        "カタンをプレイするので、サイコロを振ってください",
        "麻雀で親を決めるためにサイコロを振ってください",
      ],
      tags: ["dice", "random", "game"],
      inputModes: ["text/plain"],
      outputModes: ["text/plain"],
    },
  ],
};
```

このエージェントカードは後ほどサーバーで handler を作成する時に使用します。

## `AgentExecutor` クラスの実装

次に、A2A サーバーのメインとなる `AgentExecutor` を継承したクラスを実装します。A2A プロトコルでは `JSONRPCResponse` 型のボディを持つ HTTP POST リクエストでやり取りを行います。`AgentExecutor` は受け取った HTTP リクエストを処理し、`eventBus.publish` メソッドを使用してクライアントにレスポンスを返却します。

このクラスでは以下の 2 つのメソッドを実装する必要があります。

- `execute`: エージェントが受け取ったタスクを実行するメソッド
- `cancelTask`: エージェントが実行中のタスクをキャンセルのメカニズムを提供するメソッド

以下はサイコロを振るエージェントの実装例です。`src/server/DiceAgentExecutor.ts` に実装します。

```ts:src/server/DiceAgentExecutor.ts
import {
  AgentExecutor,
  ExecutionEventBus,
  Message,
  RequestContext,
  Task,
  TaskStatusUpdateEvent,
} from "@a2a-js/sdk";
import { openai } from "@ai-sdk/openai";
import { generateText, tool, CoreMessage } from "ai";
import { randomUUID } from "node:crypto";
import z from "zod";

export class DiceAgentExecutor implements AgentExecutor {
  private cancelledTasks = new Set<string>();

  public cancelTask = async (
    taskId: string,
    eventBus: ExecutionEventBus
  ): Promise<void> => {
    this.cancelledTasks.add(taskId);
  };

  // `message/send` もしくは `message/stream` イベントを受け取ったときに呼び出される
  async execute(
    requestContext: RequestContext,
    eventBus: ExecutionEventBus
  ): Promise<void> {
    // `message/send` イベントでエージェントのやり取りが開始される
    // パラメーターは `RequestContext` から取得
    const userMessage = requestContext.userMessage;
    const existingTask = requestContext.task;

    // タスクとコンテキストの ID を取得
    const taskId = requestContext.taskId;
    const contextId = requestContext.contextId;

    console.log(
      `[DiceAgentExecutor] Processing message ${userMessage.messageId} for task ${taskId} (context: ${contextId})`
    );

    // 新しいタスクの場合、TaskStatus が "submitted" の状態で初期化
    // "submitted" ステータスは、タスクが受け付けられたが、まだ処理が開始されていないことを示す
    if (!existingTask) {
      const initialTask: Task = {
        kind: "task",
        id: taskId,
        contextId: contextId,
        status: {
          state: "submitted",
          timestamp: new Date().toISOString(),
        },
        history: [userMessage], // 現在のユーザーメッセージから履歴を開始
        metadata: userMessage.metadata, // メッセージのメタデータがあれば継承
      };
      // eventBus.publish メソッドでクライアントにライフサイクルイベントを配信する
      eventBus.publish(initialTask);
    }

    // タスクの状態を "working" に更新
    // エージェントが処理を開始したことを示す
    const workingStatusUpdate: TaskStatusUpdateEvent = {
      kind: "status-update",
      taskId: taskId,
      contextId: contextId,
      status: {
        state: "working",
        message: {
          kind: "message",
          role: "agent",
          messageId: randomUUID(),
          parts: [
            { kind: "text", text: "Processing your question, hang tight!" },
          ],
          taskId: taskId,
          contextId: contextId,
        },
        timestamp: new Date().toISOString(),
      },
      final: false, // 処理がまだ完了してないことを示す
    };
    eventBus.publish(workingStatusUpdate);

    // A2A プロトコルの Message 型を Vercel AI SDK の CoreMessage 型に変換
    const messages = a2aMessageToVercelMessages(userMessage);

    // メッセージが空であればなにかがおかしいので、タスクが失敗したことを通知
    if (messages.length === 0) {
      console.warn(
        `[DiceAgentExecutor] No valid text messages found in history for task ${taskId}.`
      );
      const failureUpdate: TaskStatusUpdateEvent = {
        kind: "status-update",
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "failed",
          message: {
            kind: "message",
            role: "agent",
            messageId: randomUUID(),
            parts: [{ kind: "text", text: "No message found to process." }],
            taskId: taskId,
            contextId: contextId,
          },
          timestamp: new Date().toISOString(),
        },
        final: true, // 失敗したタスクはこれ以上処理が行われないため、最終状態
      };
      eventBus.publish(failureUpdate);
      return;
    }

    try {
      // AI エージェントを実行
      const response = await diceRoller(messages);

      // キャンセル要求のチェック
      // タスクがキャンセルされている場合は、処理を中止
      if (this.cancelledTasks.has(taskId)) {
        console.log(
          `[DiceAgentExecutor] Request cancelled for task: ${taskId}`
        );

        const cancelledUpdate: TaskStatusUpdateEvent = {
          kind: "status-update",
          taskId: taskId,
          contextId: contextId,
          status: {
            state: "canceled",
            timestamp: new Date().toISOString(),
          },
          final: true, // キャンセルは最終状態
        };
        eventBus.publish(cancelledUpdate);
        return;
      }

      // LLM からの応答を取得
      const responseText = response.text;
      console.info(`[DiceAgentExecutor] Prompt response: ${responseText}`);

      // 応答を A2A プロトコルの Message 型に変換
      const agentMessage: Message = {
        kind: "message",
        role: "agent",
        messageId: randomUUID(),
        parts: [{ kind: "text", text: responseText }], // テキストコンテンツを確保
        taskId: taskId,
        contextId: contextId,
      };

      // タスクが正常に完了したことを通知
      // status を "completed" に更新
      const finalUpdate: TaskStatusUpdateEvent = {
        kind: "status-update",
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "completed",
          message: agentMessage,
          timestamp: new Date().toISOString(),
        },
        final: true, // 最終状態
      };
      eventBus.publish(finalUpdate);

      console.log(`[DiceAgentExecutor] Task ${taskId} finished`);
    } catch (error: any) {
      // エラーハンドリング - AI 処理中に発生した例外をキャッチ
      console.error(
        `[DiceAgentExecutor] Error processing task ${taskId}:`,
        error
      );
      const errorUpdate: TaskStatusUpdateEvent = {
        kind: "status-update",
        taskId: taskId,
        contextId: contextId,
        status: {
          state: "failed",
          message: {
            kind: "message",
            role: "agent",
            messageId: randomUUID(),
            parts: [{ kind: "text", text: `Agent error: ${error.message}` }],
            taskId: taskId,
            contextId: contextId,
          },
          timestamp: new Date().toISOString(),
        },
        final: true,
      };
      eventBus.publish(errorUpdate);
    }
  }
}

// A2A プロトコルの Message 型を Vercel AI SDK の CoreMessage 型に変換する関数
const a2aMessageToVercelMessages = (a2aMessage: Message): CoreMessage[] => {
  // parts 配列からテキストコンテンツを抽出
  const textContent = a2aMessage.parts
    .filter((part) => part.kind === "text")
    .map((part) => (part as any).text)
    .join(" ");

  // A2A のロールを Vercel AI のロールにマッピング
  const role =
    a2aMessage.role === "agent" ? ("assistant" as const) : ("user" as const);

  return [
    {
      role,
      content: textContent,
    },
  ];
};

const diceRoller = (messages: CoreMessage[]) => {
  return generateText({
    model: openai("gpt-4.1-nano"),
    messages,
    tools: {
      dice: tool({
        description: "サイコロを振ってランダムな数を生成します",
        parameters: z.object({
          sides: z.number().optional().default(6).describe("サイコロの面の数"),
          rolls: z.number().optional().default(1).describe("振る回数"),
        }),
        execute: async ({ sides, rolls }) => {
          const results = Array.from(
            { length: rolls },
            () => Math.floor(Math.random() * sides) + 1
          );
          return results;
        },
      }),
    },
    maxSteps: 5,
  });
};
```

`DiceAgentExecutor` クラスは private プロパティとして `cancelledTasks` を持ちます。これは `cancelTask` が呼ばれた場合に更新され、`execute` メソッド内でタスクがキャンセルされているかどうかを確認するために使用されます。`cancelTask` メソッドは [task/cancel](https://google-a2a.github.io/A2A/latest/specification/#74-taskscancel) イベントを受け取ったときに呼び出されます。

`execute` メソッドは、A2A プロトコルの [message/send](https://google-a2a.github.io/A2A/latest/specification/#71-messagesend) もしくは [message/stream](https://google-a2a.github.io/A2A/latest/specification/#72-messagestream) イベントを受け取ったときに呼び出されます。クライアントから `message/send` イベントが送信されることによりエージェントのやり取りが開始されます。

クライアントからのパラメーターは `requestContext` オブジェクトから取得できます。`requestContext` にすでにタスクが存在しない場合は、タスクを新規に作成し、`eventBus.publish` メソッドを使用して `"submitted"` ステータスのタスクをクライアントに送信します。`"submitted"` ステータスは、タスクが受け付けられたが、まだ処理が開始されていないことを示します。

次に、タスクの状態を `"working"` に更新しエージェント処理が開始されたことを示すメッセージをクライアントに送信します。その後、A2A プロトコルの `Message` 型を Vercel AI SDK の `CoreMessage` 型に変換し、AI エージェントを実行します。

AI エージェントの実行には、Vercel AI SDK の `generateText` メソッドを使用します。サイコロを振るためのツールを定義し、`sides` と `rolls` のパラメーターを受け取ります。ツールはランダムな数値を生成し、結果を返します。

AI エージェントの応答の生成途中にタスクがキャンセルされた場合、`cancelledTasks` にタスク ID が追加されているはずなのでこの値をチェックします。キャンセルされている場合は、処理を中止し、タスクの状態を `"canceled"` に更新してクライアントに通知します。

AI エージェントの応答を受け取ったら、再度 A2A プロトコルの `Message` 型に変換し、タスクが正常に完了したことを示す `"completed"` ステータスのメッセージをクライアントに送信します。

タスクを実行している最中にエラーが発生した場合にはタスクの状態を `"failed"` に更新し、エラーメッセージをクライアントに送信します。

## サーバーの実装

最後に Express と A2A SDK を統合してサーバーを実装します。以下のコードを `src/server/index.ts` に追加します。

```ts:src/server/index.ts
import {
  TaskStore,
  InMemoryTaskStore,
  AgentExecutor,
  DefaultRequestHandler,
  A2AExpressApp,
} from "@a2a-js/sdk";
import { DiceAgentExecutor } from "./diceAgentExecutor";
import { agentCard } from "./agentCard";
import express from "express";

// TaskStore を作成
const taskStore: TaskStore = new InMemoryTaskStore();

const agentExecutor: AgentExecutor = new DiceAgentExecutor();

const requestHandler = new DefaultRequestHandler(
  agentCard,
  taskStore,
  agentExecutor
);

// A2AExpressApp を使用して Express アプリケーションをセットアップ
const appBuilder = new A2AExpressApp(requestHandler);
const expressApp = appBuilder.setupRoutes(express());

const PORT = process.env.PORT || 41241;
expressApp.listen(PORT, () => {
  console.log(`A2A server is running on http://localhost:${PORT}`);
});
```

`DefaultRequestHandler` は A2A プロトコルのリクエストを処理するためのハンドラーです。`taskStore` とここまでで実装した `agentCard` と `DiceAgentExecutor` を渡して初期化します。

`taskStore` はタスクの状態を管理するためのストアです。[tasks/get](https://google-a2a.github.io/A2A/latest/specification/#73-tasksget) などのリクエスト処理するためにタスクを永続化する必要があります。ここでは簡単なメモリ内のストア `InMemoryTaskStore` を使用していますが、実際のアプリケーションではデータベースなどを使用してタスクを永続化する必要があるでしょう。

`A2AExpressApp` を使用して Express アプリケーションをセットアップし、A2A プロトコルのルーティングを設定します。最後にサーバーを起動します。
```bash
npx tsx src/server/index.ts
```

サーバーが起動すると、`http://localhost:41241/.well-known/agent.json` でエージェントカードを確認できます。

```bash
curl http://localhost:41241/.well-known/agent.json
```

## A2A クライアントからメッセージを送信する

A2A クライアントを作成してメッセージを送信し、サーバーのエージェントを呼び出してみましょう。`A2AClient` クラスを使用し JSON-RPC 2.0 仕様に従ってリクエストの送受信を行います。

サーバの URL を指定してクライアントを初期化します。

```ts:src/client/index.ts
import { A2AClient } from "@a2a-js/sdk";

const serverUrl = "http://localhost:41241";
const client = new A2AClient(serverUrl);
```

`client.sendMessage` メソッドを使用してメッセージを送信します。`sendMessage` メソッドの返り値の `result.kind` によって異なるレスポンスが返ってくるので、`result.kind` をチェックして適切に処理します。

```ts:src/client/index.ts
import { A2AClient } from "@a2a-js/sdk";
import { randomUUID } from "node:crypto";

const serverUrl = "http://localhost:41241";
const client = new A2AClient(serverUrl);

async function main() {
  try {
    const response = await client.sendMessage({
      message: {
        messageId: randomUUID(),
        kind: "message",
        role: "user",
        parts: [{ kind: "text", text: "サイコロを振ってください" }],
      },
    });

    // response は SendMessageResponse 型であり、
    // JSONRPCErrorResponse | SendMessageSuccessResponse のいずれか
    // JSONRPCErrorResponse の場合はエラー error プロパティが存在するので、これで判定
    if ("error" in response) {
      console.error("Error sending message:", response.error.message);
      return;
    }

    if (response.result.kind === "message") {
      console.log("Agent response:");
      response.result.parts.forEach((part) => {
        if (part.kind === "text") {
          console.log(part.text);
          console.log("\n");
        }
      });
    } else if (response.result.kind === "task") {
      console.log("Task created with ID:", response.result.id);
      console.log("Task status:", response.result.status);

      if (response.result.status.state === "completed") {
        console.log("Task message:");
        response.result.status.message?.parts.forEach((part) => {
          if (part.kind === "text") {
            console.log(part.text);
            console.log("\n");
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
```
このコードを実行すると、サーバーにメッセージが送信され、サイコロを振るエージェントが応答を返します。応答の内容はコンソールに表示されます。

```bash
npx tsx src/client/index.ts

ENDPOINT http://localhost:41241
Task created with ID: c333cbc3-0493-4be3-a12e-0c0f73ae27d1
Task status: {
  state: 'completed',
  message: {
    kind: 'message',
    role: 'agent',
    messageId: 'eccf7ef5-cbf2-4cef-959c-6bc68b8fb164',
    parts: [ [Object] ],
    taskId: 'c333cbc3-0493-4be3-a12e-0c0f73ae27d1',
    contextId: '572e87e3-efea-46ac-a172-d1ae5aa9849d'
  },
  timestamp: '2025-06-15T06:26:36.369Z'
}
Task message:
サイコロの結果は1です。
```

### ストリーミングで応答を受け取る

A2A の JavaScript SDK はストリーミング応答をサポートしています。`sendMessage` メソッドの代わりに `sendMessageStream` メソッドを使用することで、ストリーミングで応答を受け取ることができます。`sendMessageStream` メソッドは [AsyncGenerator](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/AsyncGenerator) を返すため、`for await...of` 構文を使用して非同期にイベントを処理できます。

```ts:src/client/index.ts
import { A2AClient } from "@a2a-js/sdk";
import { randomUUID } from "node:crypto";

const serverUrl = "http://localhost:41241";
const client = new A2AClient(serverUrl);

async function main() {
  try {
    const stream = client.sendMessageStream({
      message: {
        messageId: randomUUID(),
        kind: "message",
        role: "user",
        parts: [{ kind: "text", text: "サイコロを振ってください" }],
      },
    });

    for await (const event of stream) {
      if (event.kind === "task") {
        console.log("Task created with ID:", event.id);
        console.log("Task status:", event.status);
      } else if (event.kind === "status-update") {
        console.log("Task status update:", event.status.state);
        
        if (event.status.state === "completed") {
          console.log("Task completed! Final message:");
          event.status.message?.parts.forEach((part) => {
            if (part.kind === "text") {
              console.log(part.text);
              console.log("\n");
            }
          });
          break;
        } else if (event.status.state === "failed") {
          console.error("Task failed");
          break;
        }
      } else if (event.kind === "artifact-update") {
        console.log("Artifact update received");
      } else if (event.kind === "message") {
        console.log("Direct message from agent:");
        event.parts.forEach((part) => {
          if (part.kind === "text") {
            console.log(part.text);
            console.log("\n");
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to send message stream:", error);
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
});
```

このコードを実行すると、サーバーからの応答がストリーミングで受信されます。タスクの状態やエージェントからのメッセージがリアルタイムでコンソールに表示されます。

```bash
npx tsx src/client/index.ts
ENDPOINT http://localhost:41241
Task created with ID: 8f8b366f-985a-4d65-bab8-9686f97be4f1
Task status: { state: 'submitted', timestamp: '2025-06-15T06:37:10.196Z' }
Task status update: working
Task status update: completed
Task completed! Final message:
サイコロの結果は6でした。
```

## まとめ

- A2A プロトコルはエージェント間の通信を標準化するためのプロトコルであり、相互運用性を促進する。JavaScript SDK を使用することで、エージェント間通信を簡単に実装できる。
- エージェントカードはエージェントの機能を記述する JSON ドキュメントであり、A2A サーバーは必ず提供する必要がある。
- `AgentExecutor` クラスを継承してエージェントの実装を行い、タスクの実行やキャンセルメカニズムを提供する。
  - `cancelTask` は `tasks/cancel` イベントを受け取ったときに呼び出され、タスクのキャンセルを処理する。
  - `execute` メソッドは `message/send` または `message/stream` イベントを受け取ったときに呼び出され、タスクの実行を行う。
  - タスクのライフサイクルが変化するたびに `task.status` を更新し、`eventBus.publish` メソッドを使用してクライアントに通知する。
- A2A クライアントは `A2AClient` クラスを使用してメッセージを送信し、サーバーからの応答を受け取る。ストリーミング応答もサポートされている。

## 参考

- [Agent2Agent Protocol (A2A)](https://google-a2a.github.io/A2A/latest/)
- [google-a2a/a2a-js](https://github.com/google-a2a/a2a-js)