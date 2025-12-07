---
id: _n1fGQyrqO4JvDJ2z4l2X
title: "TypeScript 向けの AI フレームワーク TanStack AI を試してみた"
slug: "try-tanstack-ai"
about: "TanStack AI は TanStack チームが開発する TypeScript 向けの軽量な AI フレームワークです。LLM プロバイダーのインターフェイスを抽象化し、ツール呼び出しやチャット機能を提供します。この記事では TanStack AI の概要と基本的な使い方を紹介します。"
createdAt: "2025-12-07T15:26+09:00"
updatedAt: "2025-12-07T15:26+09:00"
tags: ["AI", "TypeScript", "TanStack AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2ZhRqQPci93Okdfvzg8YKE/5ed71c56c7209be807bba1098682d0a3/pasta-tarako_22826-768x571.png"
  title: "たらこクリームパスタのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "TanStack AI でツールのスキーマを定義する方法はどれですか？"
      answers:
        - text: "createTool()"
          correct: false
          explanation: null
        - text: "defineTool()"
          correct: false
          explanation: null
        - text: "toolDefinition()"
          correct: true
          explanation: "TanStack AI では `toolDefinition` 関数を使用してツールを定義します。この関数に name、description、inputSchema、outputSchema などを指定し、その後 `.server()` または `.client()` メソッドで実装を提供します。"
        - text: "tool()"
          correct: false
          explanation: null
    - question: "`useChat` フックでサーバーエンドポイント `/api/chat` と SSE で接続する正しいコード例はどれか"
      answers:
        - text: "connection: fetchServerSentEvents('/api/chat')"
          correct: true
          explanation: "`useChat` フックの `connection` オプションに `fetchServerSentEvents('/api/chat')` を指定することで、Next.js の API エンドポイントと接続できます。"
        - text: "connection: createSSEConnection('/api/chat')"
          correct: false
          explanation: null
        - text: "connection: new EventSource('/api/chat')"
          correct: false
          explanation: null
        - text: "connection: '/api/chat'"
          correct: false
          explanation: null
published: true
---
AI エージェントの開発をする上で LLM の API 呼び出しを抽象化してくれるフレームワークは欠かせないものと言えるでしょう。OpenAI や Anthropic などの主要な LLM プロバイダーはそれぞれ公式 SDK を提供していますが、それぞれ異なるインターフェイスを提供しているため複数の LLM モデルを切り替えながら開発する場合には煩雑さが増してしまいます。

この差異を吸収してくれるフレームワークとして TypeScript なら [AI SDK](https://ai-sdk.dev/)、Python なら [LangChain](https://langchain.com/) がよく知られています。これらの SDK は最低限の機能のみを提供しシンプルな抽象化が行われているため、初めに導入しやすいという利点があります。また AI SDK なら [Mastra](https://mastra.ai/) や [VoltAgent](https://voltagent.dev/)、LangChain なら [LangGraph](https://langgraph.com/) などのより高機能なフレームワークの基盤としても利用されています。

AI SDK や LangChain のようにシンプルな AI フレームワークとして [TanStack AI](https://tanstack.com/ai/latest) が最近リリースされました。TanStack AI は TypeScript/JavaScript 向けの軽量な AI SDK で、TanStack チームが開発しています。この記事では TanStack AI の概要と基本的な使い方を紹介します。

## TanStack AI を使ってみる

初めに最も基本的な AI 呼び出しの例を試してみましょう。必要なパッケージをインストールします。

```bash
npm install @tanstack/ai @tanstack/ai-anthropic
```

`@tanstack/ai` は TanStack AI のコアパッケージです。チャットやツール呼び出しなどの基本的な機能が含まれています。`@tanstack/ai-anthropic` は Anthropic 社の Claude モデルを利用するためのアダプターパッケージです。LLM プロバイダーごとに `@tanstack/ai-openai` や `@tanstack/ai-gemini` などのアダプターパッケージが提供されています。LLM モデルを変更したい場合はアダプターパッケージを差し替えるだけで済むため、コードの変更を最小限に抑えることができます。

`@tanstack/ai-anthropic` を使用する場合には、環境変数 `ANTHROPIC_API_KEY` に Anthropic API キーを設定します。

```bash
export ANTHROPIC_API_KEY="your_api_key_here"
```

TanStack AI を使って Claude に簡単なプロンプトを送信するコードは以下のようになります。

```typescript
import { chat } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";

const stream = chat({
  adapter: anthropic(),
  messages: [{ role: "user", content: "こんにちは、可愛い犬ですね！" }],
  model: "claude-haiku-4-5",
});

for await (const chunk of stream) {
  switch (chunk.type) {
    case "content":
      process.stdout.write(chunk.delta);
      break;
    case "done":
      console.log("\n\n");
      console.log("Response completed. Finish reason:" + chunk.finishReason);
      break;
    case "error":
      console.error("Error:", chunk.error);
      break;
    case "tool_call":
    case "tool_result":
    case "tool-input-available":
    case "approval-requested":
    case "thinking":
      // その他のチャンクタイプは省略...
      break;
  }
}
```

`@tanstack/ai` パッケージの `chat` 関数を使用して LLM にチャットメッセージを送信しています。`chat` 関数は非同期イテレータを返すため、`for await...of` ループでストリーミングレスポンスを受け取れます。各チャンクの `type` プロパティを確認して、コンテンツの追加、完了、エラーなどのイベントに対応しています。

`chunk.type` が `content` の場合、`chunk.delta` に新しいテキストの断片が含まれているため、これを標準出力に書き込んでいます。コードを実行した結果は以下のようにストリーミングで表示されます。

```sh
こんにちは！ありがとうございます😊

ただ、私はAIアシスタントなので、実は犬ではなく、テキストベースの会話相手です。もし可愛い犬の写真や動画について話したいのであれば、喜んでお話しできますよ！

何かお手伝いできることはありますか

？Response completed. Finish reason:stop
```

## ツールの呼び出し

ツールは AI エージェントが外部の API やサービスと連携するための重要な機能です。TanStack AI におけるツールは以下の 3 つの特徴があります。

- サーバーとクライアントの両方で動作可能
- ツールの定義と実装が分離されている
- [Zod](https://zod.dev/) による型安全なスキーマ

ツールの定義と実装が分離されているため、同じツール定義をサーバーとクライアントの両方で共有することができます。例えば「ショッピングカートに商品を追加する」ツールを定義し、サーバーサイドから AI エージェントが呼び出された場合には DB に商品を追加し、クライアントサイドから呼び出された場合にはローカルストレージに商品を追加する、といったことが可能です。

ツールの定義は `@tanstack/ai` パッケージの `toolDefinition` 関数を使用して行います。定義されたツールに対して実装を提供するには `.server()` または `.client()` メソッドを使用します。以下の例では「現在の天気を取得する」ツールを定義し、サーバーサイドで実装しています。

```typescript
import { chat, toolDefinition } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";
import { z } from "zod";

const weatherToolDef = toolDefinition({
  name: "getWeather",
  description: "Get the current weather for a given location.",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for."),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("The current temperature in Celsius."),
    condition: z
      .string()
      .describe("A brief description of the weather condition."),
  }),
});

const getWeatherServer = weatherToolDef.server(async ({ location }) => {
  // ダミーの天気データを返す
  return {
    temperature: 22,
    condition: `Sunny in ${location}`,
  };
});
```

実装したツールは `chat` 関数の `tools` オプションに渡すことで、AI エージェントから呼び出せるようになります。ツールの定義を渡した場合、AI の `tool_call` 要求に対して手動で応答する必要があります。ツールの自動呼び出しを有効にするには、実装済みのツールを `tools` オプションに渡します。

```typescript {12}
import { chat, toolDefinition } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";
import { z } from "zod";

const weatherToolDef = toolDefinition({...});
const getWeatherServer = weatherToolDef.server(...);

const stream = chat({
  adapter: anthropic(),
  messages: [{ role: "user", content: "東京の天気を教えてください。" }],
  model: "claude-haiku-4-5",
  tools: [getWeatherServer],
});

for await (const chunk of stream) {
  switch (chunk.type) {
    case "content":
      process.stdout.write(chunk.delta);
      break;
    case "done":
      console.log("\n\n");
      console.log("Response completed. Finish reason:" + chunk.finishReason);
      break;
    case "error":
      console.error("Error:", chunk.error);
      break;
    case "tool_call":
      console.log("\n\n");
      console.log("Tool Call:");
      console.log("Tool Name:", chunk.toolCall.function.name);
      console.log("Tool Arguments:", chunk.toolCall.function.arguments);
      break;
    case "tool_result":
      console.log("\n\n");
      console.log("Tool Result:", chunk.content);
      break;
    case "tool-input-available":
    case "approval-requested":
    case "thinking":
      // その他のチャンクタイプは省略...
      break;
  }
}
```

コードを実行すると、AI エージェントが天気ツールを呼び出し、その結果を受け取る様子が確認できます。

```sh
東京の天気を確認いたします。

Tool Call:
Tool Name: getWeather
Tool Arguments: on": "東京"}

Response completed. Finish reason:tool_calls

Tool Result: {"temperature":22,"condition":"Sunny in 東京"}
東京の天気は以下の通りです：

- **気温**: 22℃
- **天気**: 晴れ

良い天気のようですので、お出かけに適した日となっていますね。

Response completed. Finish reason:stop
```

### ツールの実行に対する承認

AI がツールを通じてコードやシェルコマンドを実行するなどの危険な操作をする場合、実行前にユーザーの承認を求めることが重要です。TanStack AI でツールの実行前にユーザーに許可を求めるようにするには、`toolDefinition` 関数の `needsApproval` オプションを `true` に設定します。

```typescript {13}
const weatherToolDef = toolDefinition({
  name: "getWeather",
  description: "Get the current weather for a given location.",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for."),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("The current temperature in Celsius."),
    condition: z
      .string()
      .describe("A brief description of the weather condition."),
  }),
  needsApproval: true,
});
```

`needsApproval` を `true` に設定すると、AI エージェントがツールを呼び出す前に `approval-requested` チャンクが送信されます。ユーザーはこのチャンクを受け取った後、ツールの実行を承認または拒否できます。

```typescript
for await (const chunk of stream) {
  switch (chunk.type) {
    // 省略...
    case "approval-requested":
      console.log("\n\n");
      console.log("Approval Requested for Tool:");
      console.log("Tool Name:", chunk.toolCall.function.name);
      console.log("Tool Arguments:", chunk.toolCall.function.arguments);

      // ツールの実行を承認
      break;
    // 省略...
  }
}
```

## Next.js で TanStack AI を使う

ここからはより実践的な例として、Next.js アプリケーションで TanStack AI を使用して簡単な AI チャットボットを作成する方法を紹介します。まずは Next.js プロジェクトを作成し、必要なパッケージをインストールします。

```bash
npx create-next-app@latest tanstack-ai-chatbot
cd tanstack-ai-chatbot
npm install @tanstack/ai @tanstack/ai-anthropic @tanstack/ai-react zod
```

`.env` ファイルを作成し、Anthropic API キーを設定します。

```env
ANTHROPIC_API_KEY="your_api_key_here"
```

### API エンドポイントの作成

Next.js の [Route Handlers](https://nextjs.org/docs/app/getting-started/route-handlers) を使用して、サーバーサイドで TanStack AI を呼び出すエンドポイントを作成します。`app/api/chat/route.ts` ファイルを作成し、以下のコードを追加します。

```typescript:app/api/chat/route.ts {55}
import { chat, toolDefinition, toStreamResponse } from "@tanstack/ai";
import { anthropic } from "@tanstack/ai-anthropic";
import z from "zod";

const weatherToolDef = toolDefinition({
  name: "getWeather",
  description: "Get the current weather for a given location.",
  inputSchema: z.object({
    location: z.string().describe("The location to get the weather for."),
  }),
  outputSchema: z.object({
    temperature: z.number().describe("The current temperature in Celsius."),
    condition: z
      .string()
      .describe("A brief description of the weather condition."),
  }),
});

const getWeatherServer = weatherToolDef.server(async ({ location }) => {
  // ダミーの天気データを返す
  return {
    temperature: 22,
    condition: `Sunny in ${location}`,
  };
});

export async function POST(request: Request) {
  // API キーが設定されているか確認
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "ANTHROPIC_API_KEY not configured",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // クライアントからのリクエストボディの messages と conversationId を取得
  // この後登場する useChat Hook から送信される
  const { messages, conversationId } = await request.json();

  try {
    const stream = chat({
      adapter: anthropic(),
      messages,
      model: "claude-haiku-4-5",
      conversationId,
      tools: [getWeatherServer],
    });

    // HTTP ストリームレスポンスに変換して返す
    return toStreamResponse(stream);
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
```

Next.js の Route Handlers では `POST` 関数をエクスポートして POST リクエストを処理します。リクエストボディからチャットメッセージと会話 ID を取得し、TanStack AI の `chat` 関数を使用して Claude にメッセージを送信しています。`toStreamResponse` 関数を使用して、ストリーミングレスポンスを HTTP レスポンスに変換して返しています。

### クライアントサイドの実装

クライアントサイドでは、`@tanstack/ai-react` パッケージの `useChat` フックを使用してチャットの状態を管理します。`app/Chat.tsx` ファイルを作成し、以下のコードを追加します。

```tsx:app/Chat.tsx
"use client";
import { useState } from "react";
import { useChat, fetchServerSentEvents } from "@tanstack/ai-react";

export function Chat() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, isLoading, reload, stop } = useChat({
    connection: fetchServerSentEvents("/api/chat"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 border rounded-lg">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-200"
            }`}
          >
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.parts.map((part, index) => {
              // 思考中
              if (part.type === "thinking") {
                return (
                  <span key={index} className="italic text-gray-500">
                    🤔 Thinking: {part.content}
                  </span>
                );
              }
              // ツール呼び出し
              if (part.type === "tool-call") {
                return (
                  <span key={index} className="italic text-green-600">
                    🛠️ Calling tool: {part.name} with input{" "}
                    {JSON.stringify(part.input)}
                  </span>
                );
              }
              // ツールの結果
              if (part.type === "tool-result") {
                return (
                  <span key={index} className="italic text-purple-600">
                    🛠️ Tool result: {JSON.stringify(part.content)}
                  </span>
                );
              }
              // 通常のレスポンス
              if (part.type === "text") {
                return <span key={index}>{part.content}</span>;
              }
              return null;
            })}
          </div>
        ))}
        {messages.length > 0 && !isLoading && (
          <button
            onClick={reload}
            className="mb-4 px-4 py-2 bg-gray-300 rounded"
          >
            結果を再生成
          </button>
        )}
        {isLoading && (
          <button onClick={stop} className="mb-4 px-4 py-2 bg-red-300 rounded">
            停止
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l px-4 py-2"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
```

`useChat` フックの `connection` オプションに `fetchServerSentEvents("/api/chat")` を指定することで、先ほど作成した API エンドポイントと接続しています。

API からのレスポンスは `messages` 配列に格納されているためこれを `.map` メソッドで要素ごとにレンダリングしています。各メッセージの `parts` プロパティを確認し、`type` に応じて思考中、ツール呼び出し、ツール結果、通常のテキストレスポンスを表示するようにしています。

`reload` 関数を使用すると、直前のメッセージに対する応答を再生成し、`stop` 関数は現在の応答を停止します。

フォームが送信されると `sendMessage` 関数が呼び出され、入力されたメッセージが Server Sent Events リクエストとして送信されます。ボディリクエストには `messages` 配列と `conversationId` が自動的に含まれます。

作成した `Chat` コンポーネントを `app/page.tsx` にインポートして表示します。

```tsx:app/page.tsx
import { Chat } from "./Chat";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Chat />
      </main>
    </div>
  );
}
```

`npm run dev` コマンドで開発サーバーを起動し、ブラウザで `http://localhost:3000` にアクセスすると、簡単なチャットボットが動作していることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3BF0QrmI67TerbdtNAcran/4fd665bce5e11b0d2f6ba434230b386a/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-12-07_18.42.40.mov" controls></video>

## まとめ

- TanStack AI は TypeScript 向けの軽量な AI SDK で、複数の LLM プロバイダーを抽象化して利用できる
- `chat` 関数を使用してチャットメッセージの送信とストリーミングレスポンスの受信が可能
- TanStack AI ではツールの定義と実装が分離されており、サーバーとクライアントの両方で共有できる。`toolDefinition` 関数でツールを定義し、`.server()` または `.client()` メソッドで実装を提供する
- `toStreamResponse` 関数を使用してストリーミングレスポンスを生成し、Server Sent Events としてクライアントに送信できる
- `@tanstack/ai-react` パッケージの `useChat` フックを使用して、React クライアントサイドでチャットの状態管理とメッセージ送信を行える
- `connection` オプションに `fetchServerSentEvents` を指定することで、Server Sent Events エンドポイントと接続できる

## 参考

- [TanStack/ai: 🤖 SDK that enhances your applications with AI capabilities](https://github.com/TanStack/ai)
- [TanStack AI](https://tanstack.com/ai/latest/docs/getting-started/overview)
