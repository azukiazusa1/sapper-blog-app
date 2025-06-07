---
id: Tb2WwN_htmwzah7H0Nm5f
title: "フロントエンドアプリケーションがエージェントに接続する方法を標準化する AG-UI"
slug: "how-to-standardize-frontend-apps-connecting-to-agents" 
about: "AG-UI はフロントエンドアプリケーションがエージェントに接続する方法を標準化するプロトコルです。この記事では AG-UI を使用してフロントエンドアプリケーションがエージェントに接続する方法を紹介します。"
createdAt: "2025-06-07T09:45+09:00"
updatedAt: "2025-06-07T09:45+09:00"
tags: ["AG-UI", "AI", "Typescript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1mFDNQ7A4cOZs9azMMwRow/a5d24db289891f25f6c9661172c7d2e5/icecream_strawberry_illust_989.png"
  title: "ストロベリーアイスクリームのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "AG-UI エージェントを実装する際に継承するクラスはどれですか？"
      answers:
        - text: "BaseAgent"
          correct: false
          explanation: ""
        - text: "AbstractAgent"
          correct: true
          explanation: ""
        - text: "Agent"
          correct: false
          explanation: ""
        - text: "CoreAgent"
          correct: false
          explanation: ""
    - question: "エージェントの実行が開始されたことを通知するイベントタイプはどれですか？"
      answers:
        - text: "AGENT_STARTED"
          correct: false
          explanation: ""
        - text: "RUN_STARTED"
          correct: true
          explanation: ""
        - text: "EXECUTION_STARTED"
          correct: false
          explanation: ""
        - text: "PROCESS_STARTED"
          correct: false
          explanation: ""

published: true
---

[AG-UI](https://docs.ag-ui.com/) は、フロントエンドアプリケーションがエージェントに接続する方法を標準化するためのプロトコルです。AG-UI はイベント駆動のアーキテクチャを基盤としており、チャット UI を構築するために必要なリアルタイムインタラクション・ストリーミング・human-in-the-loop（AI システムに人間の介入を組み込むこと）などの機能を提供します。

AG-UI プロトコルは現在以下のエージェントフレームワークでサポートされており、フレームワークの選択に関係なく、フロントエンドアプリケーションは同じ方法でエージェントと通信できます。

- [LangGraph](https://www.langchain.com/langgraph)
- [CrewAI](https://www.crewai.com/)
- [Mastra](https://mastra.ai/)
- [AG2](https://ag2.ai/)

この記事では、AG-UI を使用してフロントエンドアプリケーションがエージェントに接続する方法を紹介します。

## AG-UI 互換サーバーを構築する

まずは AG-UI プロトコルと互換性のあるサーバーを構築しましょう。Node.js を使用して新しいプロジェクトを作成し、必要なパッケージをインストールします。

```bash
mkdir ag-ui-server
cd ag-ui-server
npm init -y
npm install express @ag-ui/core @ag-ui/encoder rxjs ai
npm install -D typescript tsx @types/node @types/express
```

サーバーを実行するコマンドを `package.json` に追加します。

```json:package.json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

### AG-UI リクエストを解析する

まずは、AG-UI リクエストを解析して返すだけのエンドポイントを作成します。`src/index.ts` ファイルを作成し、以下のコードを追加します。

```typescript:src/index.ts
import express from "express";
import { RunAgentInputSchema, RunAgentInput } from "@ag-ui/core";

const app = express();
app.use(express.json());

app.post("/awp", async (req, res) => {
  try {
    // Zod スキーマでリクエストボディを検証
    const input: RunAgentInput = RunAgentInputSchema.parse(req.body);
    res.json({
      message: `threadId: ${input.threadId}`,
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
```

このコードでは、`/awp` エンドポイントを作成し、AG-UI のリクエストを受け取って解析します。リクエストボディは [Zod](https://zod.dev/) スキーマである `RunAgentInputSchema` を使用して検証されます。検証に成功すると、リクエストの `threadId` を含む JSON レスポンスを返します。リクエストが不正な場合は、422 ステータスコードとエラーメッセージを返します。

`RunAgentInput` 型は AG-UI プロトコルの中核コンポーネントである [Agents](https://docs.ag-ui.com/concepts/agents) に渡される入力を表します。

```ts
type RunAgentInput = {
  /** 会話のスレッド ID */
  threadId: string
  /** エージェントの実行 ID */
  runId: string
  /** 
   * エージェントが持つ状態
   * https://docs.ag-ui.com/concepts/state
   */
  state: any
  /** ユーザーと AI の対話の履歴 */
  messages: Message[]
  /**
   * エージェントが利用可能なツールのリスト
   * https://docs.ag-ui.com/concepts/tools
   */
  tools: Tool[]
  /** エージェントに提供されるコンテキスト */
  context: Context[]
  /** エージェントに渡される追加のプロパティ */
  forwardedProps: any
}
```

`curl` コマンドを使用してサーバーにリクエストを送信し、正しく動作することを確認してみましょう。

```bash
curl -X POST http://localhost:8080/awp \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "12345",
    "runId": "67890",
    "state": {},
    "messages": [{
      "id": "1",
      "role": "user",
      "content": "Hello, agent!"
    }],
    "tools": [],
    "context": [],
    "forwardedProps": {}
  }'
```

成功すると以下のようなレスポンスが返ってきます。

```json
{
  "message": "threadId: 12345"
}
```

### AG-UI エージェントを実装する

続いて HTTP リクエストで受け取った `RunAgentInput` リクエストを AG-UI エージェントに渡してレスポンスを生成する箇所を実装します。まずは AG-UI エージェントを作成します。以下のコードを `src/agent.ts` ファイルに追加します。

```typescript:src/agent.ts
import { AbstractAgent } from "@ag-ui/client";
import { RunAgentInput, BaseEvent } from "@ag-ui/core";
import { Observable } from "rxjs";

class MyAgent extends AbstractAgent {
  protected run(input: RunAgentInput): Observable<BaseEvent> {
    // ここにエージェントのロジックを実装
  }
}
```

AG-UI のすべてのエージェントは `AbstractAgent` クラスを継承して実装します。`run` メソッド内でエージェントのロジックを実装します。`run` メソッドは `RunAgentInput` 型の引数を受け取り、rxjs の `Observable` を返します。

ここでは [Vercel AI SDK](https://vercel.com/docs/ai-sdk) を使用して AI モデルを呼び出す簡単なエージェントを実装します。実装にあたっては https://github.com/ag-ui-protocol/ag-ui/blob/main/typescript-sdk/integrations/vercel-ai-sdk/src/index.ts を参考にしています。

```typescript:src/agent.ts
import {
  AbstractAgent,
  EventType,
  BaseEvent,
  Message,
  AssistantMessage,
  RunAgentInput,
  TextMessageContentEvent,
  MessagesSnapshotEvent,
  RunFinishedEvent,
  RunStartedEvent,
  ToolCallArgsEvent,
  ToolCallEndEvent,
  ToolCallStartEvent,
  ToolCall,
  ToolMessage,
  RunErrorEvent,
  TextMessageStartEvent,
  TextMessageEndEvent,
} from "@ag-ui/client";
import { Observable } from "rxjs";
import {
  CoreMessage,
  processDataStream,
  streamText,
  tool as createVercelAISDKTool,
  ToolSet,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { randomUUID } from "crypto";
import { z } from "zod";

export class MyAgent extends AbstractAgent {
  constructor(config = {}) {
    super(config);
  }
  protected run(input: RunAgentInput): Observable<BaseEvent> {
    const finalMessages: Message[] = input.messages;

    // rxjs の Observable を使用して、非同期処理を行う
    return new Observable<BaseEvent>((subscriber) => {
      subscriber.next({
        // AG-UI で定義されているイベントタイプを使用して、イベントを発行する
        // RUN_STARTED イベントを発行して、エージェントの実行が開始されたことを通知する
        type: EventType.RUN_STARTED,
        threadId: input.threadId,
        runId: input.runId,
      } as RunStartedEvent);

      const response = streamText({
        // Anthropic の Claude 3.5 Haiku モデルを呼び出す
        // Vercel AI SDK は AI モデルを自由に切り替えられるように設計されている
        model: anthropic("claude-3-5-haiku-latest"),
        // HTTP リクエストで受け取った受け取ったメッセージとツールを Vercel AI SDK の形式に変換してから設定する
        messages: convertMessagesToVercelAISDKMessages(input.messages),
        tools: convertToolToVerlAISDKTools(input.tools),
        maxSteps: 5,
      });

      const messageId = randomUUID();
      // メッセージが開始されたことを通知する
      const startEvent: TextMessageStartEvent = {
        type: EventType.TEXT_MESSAGE_START,
        messageId,
        role: "assistant",
      };

      subscriber.next(startEvent);

      let assistantMessage: AssistantMessage = {
        id: messageId,
        role: "assistant",
        content: "",
        toolCalls: [],
      };
      finalMessages.push(assistantMessage);

      // processDataStream はストリーミングレスポンスを処理するための AI SDK の関数
      processDataStream({
        stream: response.toDataStreamResponse().body!,
        // テキストのチャンクが到着したときに呼び出されるコールバック関数
        onTextPart: (text) => {
          assistantMessage.content += text;
          subscriber.next({
            // ストリーミングテキストのコンテンツのチャンクを表す
            type: EventType.TEXT_MESSAGE_CONTENT,
            messageId,
            // delta はメッセージのチャンク
            delta: text,
          } as TextMessageContentEvent);
        },
        // メッセージの応答が完了したときに呼び出されるコールバック関数
        onFinishMessagePart: () => {
          // AI モデルの応答が完了したときに発行される
          const event: TextMessageEndEvent = {
            type: EventType.TEXT_MESSAGE_END,
            messageId,
          };
          subscriber.next(event);

          // エージェントの実行が完了したことを通知する
          subscriber.next({
            type: EventType.RUN_FINISHED,
            threadId: input.threadId,
            runId: input.runId,
          } as RunFinishedEvent);

          subscriber.complete();
        },
        // ツールの呼び出しが要求されたときに呼び出されるコールバック関数
        onToolCallPart(streamPart) {
          let toolCall: ToolCall = {
            id: streamPart.toolCallId,
            type: "function",
            function: {
              name: streamPart.toolName,
              arguments: JSON.stringify(streamPart.args),
            },
          };
          assistantMessage.toolCalls!.push(toolCall);

          // ツールの呼び出しが開始されたことを通知するイベントを発行する
          const startEvent: ToolCallStartEvent = {
            type: EventType.TOOL_CALL_START,
            parentMessageId: messageId,
            toolCallId: streamPart.toolCallId,
            toolCallName: streamPart.toolName,
          };
          subscriber.next(startEvent);

          // ツール呼び出しの引数データのチャンクを表す
          const argsEvent: ToolCallArgsEvent = {
            type: EventType.TOOL_CALL_ARGS,
            toolCallId: streamPart.toolCallId,
            delta: JSON.stringify(streamPart.args),
          };
          subscriber.next(argsEvent);

          // ツールの呼び出しが終了したことを通知するイベントを発行する
          const endEvent: ToolCallEndEvent = {
            type: EventType.TOOL_CALL_END,
            toolCallId: streamPart.toolCallId,
          };
          subscriber.next(endEvent);
        },
        // ツールの結果が返されたときに呼び出されるコールバック関数
        onToolResultPart(streamPart) {
          const toolMessage: ToolMessage = {
            role: "tool",
            id: randomUUID(),
            toolCallId: streamPart.toolCallId,
            content: JSON.stringify(streamPart.result),
          };
          finalMessages.push(toolMessage);
        },
        // ストリーミング中にエラーが発生した場合に呼び出されるコールバック関数
        onErrorPart(streamPart) {
          const runErrorEvent: RunErrorEvent = {
            type: EventType.RUN_ERROR,
            message: "An error occurred during the run",
          };
          subscriber.error(runErrorEvent);
        },
      }).catch((error) => {
        console.error("catch error", error);
        const runErrorEvent: RunErrorEvent = {
          type: EventType.RUN_ERROR,
          message: error.message,
          code: error.code,
        };
        // Handle error
        subscriber.error(runErrorEvent);
      });

      return () => {};
    });
  }
}
```

<details>
<summary>`convertMessagesToVercelAISDKMessages` と `convertJsonSchemaToZodSchema` の実装</summary>

```typescript
function convertMessagesToVercelAISDKMessages(
  messages: Message[]
): CoreMessage[] {
  const result: CoreMessage[] = [];

  for (const message of messages) {
    if (message.role === "assistant") {
      const parts: any[] = message.content
        ? [{ type: "text", text: message.content }]
        : [];
      for (const toolCall of message.toolCalls ?? []) {
        parts.push({
          type: "tool-call",
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          args: JSON.parse(toolCall.function.arguments),
        });
      }
      result.push({
        role: "assistant",
        content: parts,
      });
    } else if (message.role === "user") {
      result.push({
        role: "user",
        content: message.content || "",
      });
    } else if (message.role === "tool") {
      let toolName = "unknown";
      for (const msg of messages) {
        if (msg.role === "assistant") {
          for (const toolCall of msg.toolCalls ?? []) {
            if (toolCall.id === message.toolCallId) {
              toolName = toolCall.function.name;
              break;
            }
          }
        }
      }
      result.push({
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: message.toolCallId,
            toolName: toolName,
            result: message.content,
          },
        ],
      });
    }
  }

  return result;
}

function convertJsonSchemaToZodSchema(
  jsonSchema: any,
  required: boolean
): z.ZodSchema {
  if (jsonSchema.type === "object") {
    const spec: { [key: string]: z.ZodSchema } = {};

    if (!jsonSchema.properties || !Object.keys(jsonSchema.properties).length) {
      return !required ? z.object(spec).optional() : z.object(spec);
    }

    for (const [key, value] of Object.entries(jsonSchema.properties)) {
      spec[key] = convertJsonSchemaToZodSchema(
        value,
        jsonSchema.required ? jsonSchema.required.includes(key) : false
      );
    }
    let schema = z.object(spec).describe(jsonSchema.description);
    return required ? schema : schema.optional();
  } else if (jsonSchema.type === "string") {
    let schema = z.string().describe(jsonSchema.description);
    return required ? schema : schema.optional();
  } else if (jsonSchema.type === "number") {
    let schema = z.number().describe(jsonSchema.description);
    return required ? schema : schema.optional();
  } else if (jsonSchema.type === "boolean") {
    let schema = z.boolean().describe(jsonSchema.description);
    return required ? schema : schema.optional();
  } else if (jsonSchema.type === "array") {
    let itemSchema = convertJsonSchemaToZodSchema(jsonSchema.items, true);
    let schema = z.array(itemSchema).describe(jsonSchema.description);
    return required ? schema : schema.optional();
  }
  throw new Error("Invalid JSON schema");
}

function convertToolToVerlAISDKTools(
  tools: RunAgentInput["tools"]
): ToolSet {
  return tools.reduce(
    (acc: ToolSet, tool: RunAgentInput["tools"][number]) => ({
      ...acc,
      [tool.name]: createVercelAISDKTool({
        description: tool.description,
        parameters: convertJsonSchemaToZodSchema(tool.parameters, true),
      }),
    }),
    {}
  );
}
```
</details>

メインの処理となるのは `run` メソッドです。このメソッド内では `Observable` を使用[ストリーミングイベント](https://docs.ag-ui.com/concepts/events)を発行します。発行されるイベントはすべて `BaseEvent` 型を継承しており、AG-UI プロトコルで定義されたイベントタイプを使用します。

エージェントが処理を開始すると、最初に `RUN_STARTED` イベントを発行します。このイベントでは一意の `runId` により識別される新しいコンテキストが開始されたことを示します。このイベントはフロントエンドが進捗状況インジケーターやローディングスピナーを初期化するために使用されます。

次に、`streamText` 関数を使用して AI モデルを呼び出します。この関数は Vercel AI SDK の一部であり、AI モデルからのストリーミングレスポンスを処理するために使用されます。ここでは Anthropic の Claude 3.5 Haiku モデルを使用していますが、他のモデルも使用可能です。`RunAgentInput` の `messages` と `tools` を Vercel AI SDK の形式に変換してから、AI モデルに渡します。

AI モデルとの対話が開始されると、最初に `TEXT_MESSAGE_START` イベントが発行されます。このイベントは新しいメッセージの開始を示し、`messageId` により後続の `TextMessageContentEvent`・`TextMessageEnd` イベントと関連付けられます。このイベントによりフロントエンドは受信メッセージの UI を準備します。例えば読込中を示すスピナーを表示するなどの処理が可能です。

`streamText` 関数はストリーミングレスポンスは `processDataStream` 関数を使用して処理されます。`processDataStream` はストリーミングレスポンスの各チャンクに対してコールバック関数を呼び出します。

テキストのチャンクが到着すると、`onTextPart` コールバックが呼び出されます。テキストのチャンクを受け取ったら `TextMessageContentEvent` イベントを発行します。このイベントの `delta` プロパティには受信したテキストのチャンクが含まれます。フロントエンドはこのイベントをストリーミングで受け取ることで、メッセージの内容をリアルタイムで更新できます。

`onFinishMessagePart` コールバックは AI モデルの応答が完了したときに呼び出されます。このコールバックでは `TEXT_MESSAGE_END` イベントと `RUN_FINISHED` イベントを発行します。`TEXT_MESSAGE_END` イベントはストリーミングテキストの終了を示し、フロントエンドはローディングスピナーを非表示にしたり、返信 input を有効にするなどの処理を行います。

`RUN_FINISHED` イベントはエージェントの実行が正常完了したことを示します。このイベントをフロントエンドが受信した場合、エージェントの完了を待機していたすべての UI 状態を終了させる必要があります。このイベントが発行された場合これ以上の処理が行われないことを示します。

`onToolCallPart` コールバックは AI モデルがツールを呼び出したときに呼び出されます。このコールバックでは以下の 3 つのイベントを発行します。

- `TOOL_CALL_START`: ツールの呼び出しが開始されたことを示す。フロントエンドはツールの呼び出しが開始されたことをユーザーに通知するためにこのイベントを使用できる
- `TOOL_CALL_ARGS`: ツールの引数が利用可能になった状態で発行される。このイベントの `delta` プロパティにはツールの引数が含まれる。フロントエンドはどのようにツールが呼び出されるのかユーザーに示すことができる。
- `TOOL_CALL_END`: ツールの呼び出しが終了したことを示します。フロントエンドではツールの呼び出しが完了し、ツールの実行が進行中であることを示すために使用する

`onErrorPart` と `try/catch` ブロックは、ストリーミング中に発生したエラーを処理します。エージェントの実行中にエラーが発生した場合、`RUN_ERROR` イベントを発行します。フロントエンドで適切なエラーメッセージを表示するために使用されます。`RUN_ERROR` イベントが発行された場合、これ以上の処理は行われないことを示します。

最後に Anthropic の API を呼び出せるように環境変数 `ANTHROPIC_API_KEY` を設定しておきましょう。

```bash:.env
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### AG-UI エージェントと接続する

それではサーバーの `/awp` エンドポイントに AG-UI エージェントを接続してみましょう。AG UI では SSE（Server-Sent Events）を使用したストリーミングイベントをサポートしています。

```typescript:src/index.ts
app.post("/awp", async (req, res) => {
  try {
    const input: RunAgentInput = RunAgentInputSchema.parse(req.body);

    console.log("Received input:", input);

    // レスポンスヘッダーを設定
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const agent = new MyAgent();

    // AG-UI エージェントを実行し、ストリーミングイベントを返す
    // NOTE: `agent.run` は protected メソッドであるため本来は直接呼び出すはずではない
    // public メソッドである runAgent を呼び出すべきであるように思われるが、
    // ドキュメントの型定義と実装が一致しておらず Promise<void> を返すため、ここでは代わりに `run` メソッドを直接呼び出す
    const stream = agent.run(input);

    // ストリーミングイベントをクライアントに送信
    stream.subscribe({
      next(event) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      },
      error(err) {
        console.error("Error in agent run:", err);
        res.write(
          `data: ${JSON.stringify({ type: "error", message: err.message })}\n\n`
        );
        res.end();
      },
      complete() {
        res.end();
      },
    });
  } catch (error) {
    res.status(422).json({ error: error.message });
  }
});
```

`curl` コマンドを使用してサーバーにリクエストを送信し、ストリーミングイベントを受信できることを確認します。

```bash
curl -X POST http://localhost:8080/awp \
  -H "Content-Type: application/json" \
  -d '{
    "threadId": "12345",
    "runId": "67890",
    "state": {},
    "messages": [{
      "id": "1",
      "role": "user",
      "content": "箱根の温泉について教えてください"
    }],
    "tools": [],
    "context": [],
    "forwardedProps": {}
  }'
```

一例として以下のようなレスポンスが返ってきました。

```bash
data: {"type":"RUN_STARTED","threadId":"12345","runId":"67890"}

data: {"type":"TEXT_MESSAGE_START","messageId":"3f99a0c3-471b-413d-937d-fd971ae3fb6a","role":"assistant"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"3f99a0c3-471b-413d-937d-fd971ae3fb6a","delta":"箱根の"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"3f99a0c3-471b-413d-937d-fd971ae3fb6a","delta":"温泉は、"}

# 省略

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"3f99a0c3-471b-413d-937d-fd971ae3fb6a","delta":"気の温泉"}

data: {"type":"TEXT_MESSAGE_CONTENT","messageId":"3f99a0c3-471b-413d-937d-fd971ae3fb6a","delta":"地です。"}

data: {"type":"TEXT_MESSAGE_END","messageId":"3f99a0c3-471b-413d-937d-fd971ae3fb6a"}

data: {"type":"RUN_FINISHED","threadId":"12345","runId":"67890"}
```

## AG-UI フロントエンド

フロントエンド側の処理を Next.js で実装してみましょう。まずは Next.js プロジェクトを作成します。

```bash
npx create-next-app@latest ag-ui-frontend
```

続いて必要なパッケージをインストールします。

```bash
npm install @ag-ui/client @copilotkit/react-core @copilotkit/react-ui @copilotkit/runtime
```

[CopilotKit](https://docs.copilotkit.ai/) は AG-UI プロトコルサポートしており、チャット UI を簡単に構築できるコンポーネントを提供しています。

まずはじめにフロントエンドの CopilotKit と AG-UI のバックエンドを接続するためのブリッジを作成する必要があります。これは CopilotKit のリクエストを AG-UI の `/awp` エンドポイントに転送する役割を果たします。以下のコードを `src/app/api/awp/copilotkit.ts` ファイルに追加します。

```typescript:src/app/api/awp/copilotkit.ts
import { HttpAgent } from "@ag-ui/client";
import {
  CopilotRuntime,
  ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

// HTTP Agent は HTTP 経由でリモートのエージェントと通信するためのクライアント
const myAgent = new HttpAgent({
  url: "http://localhost:8080/awp", // AG-UI サーバーのエンドポイント
});

const runtime = new CopilotRuntime({
  agents: {
    myAgent, // エージェントを登録
  },
});

/**
 * POST リクエストを処理するエンドポイント
 */
export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime, 
    serviceAdapter: new ExperimentalEmptyAdapter(),
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
```

続いて `layout.tsx` ファイルで CopilotKit のプロバイダーを設定します。以下のコードを `src/app/layout.tsx` ファイルに追加します。

```typescript:src/app/layout.tsx
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CopilotKit runtimeUrl="http://localhost:3000/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  );
}
```

`src/app/page.tsx` ファイルを以下のように編集して、チャット UI を表示します。

```typescript:src/app/page.tsx
import React from "react";
import { CopilotChat } from "@copilotkit/react-ui";

function Chat() {
  return (
    <div className="h-lvh w-full flex items-center justify-center">
      <CopilotChat 
        className="w-full max-w-3xl flex flex-col h-full py-6" 
        agent="myAgent"
      />
    </div>
  );
}

export default Chat;
```

http://localhost:3000/ にアクセスすると、チャット UI が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3AMrLPLgiOCIdmrLniydxE/4a42e3c93cd12af2880edb407db4b72f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-07_14.13.15.png)

ユーザーがメッセージを送信すると、CopilotKit が AG-UI サーバーの `/awp` エンドポイントにリクエストを送信し、ストリーミングでエージェントの応答を受信していることを確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6q3SktNVnJZ0Dc9hPFo1i9/bd362bb64cd4a1b83476c63402fdfadb/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-06-07_15.21.02.mov" controls></video>

## まとめ

- AG-UI はフロントエンドアプリケーションがエージェントに接続する方法を標準化するプロトコルである
- AG-UI プロトコルはイベント駆動のアーキテクチャを基盤としており、リアルタイムインタラクション・ストリーミング・human-in-the-loop（AI システムに人間の介入を組み込むこと）などの機能を提供する
- `RunAgentInputSchema` を使用して AG-UI リクエストを検証する
- AG-UI エージェントは `AbstractAgent` クラスを継承して実装し、`run` メソッド内でエージェントのロジックを実装する
  - `run` メソッドは `RunAgentInput` 型の引数を受け取り、rxjs の `Observable` を返す
  - AG-UI エージェントはストリーミングイベントを発行し、フロントエンドはこれらのイベントを受信してリアルタイムで UI を更新する
- CopilotKit を使用して AG-UI エージェントと接続するためのブリッジを作成し、チャット UI を構築する
- CopilotKit の `CopilotChat` コンポーネントを使用してチャット UI を表示する

## 参考

- [Introduction - Agent User Interaction Protocol](https://docs.ag-ui.com/introduction)
- [Overview - Agent User Interaction Protocol](https://docs.ag-ui.com/sdk/js/client/overview)
- [Introducing AG-UI: The Protocol Where Agents Meet Users](https://webflow.copilotkit.ai/blog/introducing-ag-ui-the-protocol-where-agents-meet-users)
- [How to add a Frontend to any AG2 Agent using AG-UI Protocol](https://webflow.copilotkit.ai/blog/how-to-add-a-frontend-to-any-ag2-agent-using-ag-ui-protocol)
- [ag-ui/typescript-sdk at main · ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui/tree/main/typescript-sdk)
