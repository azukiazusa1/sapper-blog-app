---
id: 1xom1VlYPAOIJEmC876Ed
title: "Vercel AI SDK で MCP クライアントをツールとして利用する"
slug: "vercel-ai-sdk-mcp-client"
about: "MCP（Model Context Protocol）は LLM に追加のコンテキストを提供するための標準化されたプロトコルです。Vercel AI SDK は v4.2 から MCP をサポートしており、MCP クライアントをツールとして利用できます。この記事では Vercel AI SDK を使って MCP ツールを使用する方法を紹介します。"
createdAt: "2025-03-30T10:22+09:00"
updatedAt: "2025-03-30T10:22+09:00"
tags: ["AI", "MCP"]
thumbnail:
  url: ""
  title: ""
selfAssessment:
  quizzes:

published: true
---

[MCP（Model Context Protocol](https://modelcontextprotocol.io/introduction) は LLM に追加のコンテキストを提供する方法を標準化するプロトコルとして大きな注目を集めています。MCP サーバーの例として以下のようなものが提供されています。

- [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github)：ファイル操作やプルリクエストの作成を行う
- [Slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)：Slack のメッセージを取得・送信する
- [Sentry](https://github.com/modelcontextprotocol/servers/tree/main/src/sentry)： Sentry の Issue を取得する

例えば GitHub の MCP サーバーを Cline のような AI コーディングエージェントで使用した場合、「レポジトリの Issue の一覧を取得してその中から 1 つを選択してコードを修正して、プルリクエストを作成して」というような指示を与えることができます。LLM は GitHub の MCP サーバーを通じて実際に現実世界でプルリクエストを作成することができます。

MCP サーバーの中身は GitHub の API をコールしているだけなのですが、MCP というプロトコルを介すことにより LLM のモデルの実装の詳細に依存せずに、LLM に追加のコンテキストを与えることができるようになります。

MCP サーバーを利用するためには対となる MCP クライアントが必要です。MCP クライアントは MCP サーバーとの通信を担当します。クライアントはホストからの要求に応じてサーバーとの通信を確立し、ツールなどの機能を利用するためのリクエストを送信します。先程の例では Cline が MCP クライアントとして機能していました。

[Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) は v4.2 から MCP をサポートするようになりました。AI SDK では MCP クライアントをツールとして利用することができます。この記事では Vercel AI SDK を使って MCP ツールを使用する方法を紹介します。

## プロジェクトのセットアップ

まずは Vercel AI SDK を使用するためのプロジェクトを作成しましょう。ここでは Next.js を使用した簡単なチャットアプリを作成します。Next.js のプロジェクトを作成するためには以下のコマンドを実行します。

```bash
npx create-next-app@latest
```

続いて必要な依存関係をインストールします。ここでは以下の 4 つのパッケージをインストールします。

- `ai`：Vercel AI SDK のコアパッケージ
- `@ai-sdk/react`：React 用でチャットインタフェースを構築する `useChat` フックを提供するパッケージ
- `@ai-sdk/google`：Google が提供する LLM モデル（gemini）を使用するためのパッケージ。このパッケージはどの LLM モデルを使用するかに応じて変更する。例えば OpenAI の LLM モデルを使用する場合は `@ai-sdk/openai` をインストールする
- `zod`：型安全なバリデーションライブラリ。Vercel AI SDK では `zod` を使用してツールのインタフェースを定義できる

```bash
npm i ai @ai-sdk/react @ai-sdk/google zod
```

LLM モデルを使用するためには API キーが必要です。ここでは Google の Gemini を使用することを想定しています。API キーは [Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja) から取得できます。使用するモデルによっては課金が必要な場合がありますので、注意してください。

取得した API キーは `.env` ファイルに保存します。以下のように `GOOGLE_GENERATIVE_AI_API_KEY` という環境変数を定義します。

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

### ルートハンドラーの作成

次にルートハンドラーを作成します。ルートハンドラーは `/api/chat` というパスでリクエストを受け付けます。以下のように `app/api/chat/route.ts` ファイルを作成します。

```ts:app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-pro-exp-03-25"),
    messages,
  });

  return result.toDataStreamResponse();
}
```

ここではユーザーのメッセージと LLM の会話履歴を `messages` として受け取り、LLM モデルに渡しています。`streamText` はストリーミングで LLM の応答を取得するための関数です。`toDataStreamResponse` メソッドを使用してストリーミングレスポンスを返します。`model` プロパティを使用して使用する LLM モデルを指定します。ここでは Google の Gemini 2.5 を使用しています。このように AI SDK はモデルを抽象化して使用できる設計となっているため、`model` プロパティを変更することで簡単に他の LLM モデルに切り替えることができます。

### チャット UI の作成

次にチャット UI を作成します。以下のように `app/page.tsx` ファイルを作成します。

```tsx:app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, status } =
    useChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto gap-4">
      <h1 className="text-2xl font-bold">Chat with Gemini</h1>
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded dark:disabled:bg-gray-700"
          placeholder="Type your message..."
          disabled={status !== "ready"}
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-700"
          disabled={status !== "ready"}
        >
          {status !== "ready" ? "🤔" : "Send"}
        </button>
      </form>
    </div>
  );
}
```

`useChat` フックを使用すると複雑なチャットの状態管理を簡単に実装できます。`handleSubmit` を呼び出すとデフォルトで `/api/chat` エンドポイントに POST リクエストを送信します。これは先程作成したルートハンドラーのパスです。

ここまでの実装が完了したら、以下のコマンドを実行してアプリケーションを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスすると、チャット UI が表示されます。メッセージを入力して送信すると、LLM からの応答が表示されます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/40KFadF7mBJF6UdvzrgRV8/fe9765b5bfa4195f8d67f5c424843dd6/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-30_11.16.08.mov" controls></video>

## MCP クライアントの作成

それでは本題の MCP クライアントを作成していきましょう。MCP サーバーとして [praywright-mcp](https://github.com/microsoft/playwright-mcp) を使用します。これは Playwright を使用してブラウザを操作するツールを提供する MCP サーバーです。

AI SDK から MCP サーバーを利用するためにまずはクライアントを初期化します。クライアントを初期化する際にサーバーと接続する方法として以下の 3 つのが用意されています。

- SSE（Server-Sent Events）: HTTP ストリーミングを使用してサーバーと通信する。ネットワーク越しにサーバーと通信する場合に適している
- stdio: 標準出力を使用してサーバーと通信する。CLI ツールのように同じマシン上で実行する場合に適している
- カスタムトランスポート: インタフェースを使用して独自のトランスポートを実装する

今回は SSE を使用した方法を試してみます。まずはじめに Praywright MCP サーバーをローカルで起動します。以下のコマンドを実行すると http://localhost:8931 でサーバーが起動します。

```bash
npx @playwright/mcp@latest --port 8931 --headless 
```

`experimental_createMCPClient` 関数を使用して MCP クライアントを初期化します。SSE を使用する場合には `type: "sse"` とエンドポイントを指定します。`app/api/route.ts` に以下のコードを追加します。

```ts:app/api/route.ts
import { experimental_createMCPClient as createMCPClient } from "ai";

const mcpClient = await createMCPClient({
  transport: {
    type: "sse",
    url: "http://localhost:8931/sse"
  },
});
```

### MCP ツールを使用する

`mcpClient` の `tools()` メソッドは MCP ツールと AI SDK のアダプターとして機能します。`tools()` メソッドの結果を `streamText` の `tools` プロパティに渡すことで、MCP ツールを使用することができます。

AI SDK ではツールを作成するための以下の 2 つのアプローチが用意されています。

- Schema Discovery: MCP サーバーが提供するツールのスキーマを自動的に取得してツールを作成する。実装が簡単で、MCP サーバーの変更を自動で同期することができる。一方で TypeScript の型安全性が得られない、使用したいツールを選択できないというデメリットがある
- Schema Definition: Zod を使用してツールのスキーマを手動で定義する。型安全性が得られ、明示的に使用するツールを選択できる。一方で MCP サーバーの変更を手動で同期する必要があり保守すべきコードが増えるというデメリットがある

ここでは Schema Discovery を使用してツールを定義します。以下のように `app/api/route.ts` を修正します。

```ts:app/api/route.ts {14, 19, 20-22}
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { experimental_createMCPClient as createMCPClient } from "ai";

export async function POST(req: Request) {
  const mcpClient = await createMCPClient({
    transport: {
      type: "sse",
      url: "http://localhost:8931/sse",
    },
  });

  const { messages } = await req.json();
  const tools = await mcpClient.tools();

  const result = streamText({
    model: google("gemini-2.5-pro-exp-03-25"),
    messages,
    tools,
    onFinish: () => {
      mcpClient.close();
    },
  });

  return result.toDataStreamResponse();
}
```

MCP クライアントは初期化した後に都度接続を閉じる必要がある点に注意してください。今回の例のようにストリーミングでレスポンスを帰返却する場合には LLM レスポンスが終了したタイミングで接続を閉じるようにします。`onFinish` コールバックを使用して LLM レスポンスが終了したタイミングで `mcpClient.close()` を呼び出しています。

ここまでの実装が完了したら、実際に MCP ツールが使用されるか試してみましょう。「azukiazusa.dev で人気の記事を教えて下さい」というメッセージを送信してみると、実際にサイトにアクセスして人気の記事を探してみるという応答が返ってきます。更に結果を求めてみると、実際にサイトの情報を元に回答が生成されることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7wM0wo0woimdXHoGV7gxw1/58f8cf8486c47d6802ab63e0ae615946/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-30_12.08.29.png)

## まとめ

- MCP（Model Context Protocol）は LLM に追加のコンテキストを提供するための標準化されたプロトコル
- Vercel AI SDK は v4.2 から MCP をサポートしており、MCP クライアントをツールとして利用できる
- MCP クライアントは `experimental_createMCPClient` 関数を使用して初期化する
- MCP クライアントを初期化する際にサーバーと接続する方法として SSE、stdio、カスタムトランスポートの 3 つが用意されている
- MCP クライアントは初期化後に `close()` メソッドを使用して接続を閉じる必要がある
- `tools()` メソッドを使用して MCP ツールを取得し、`streamText` の `tools` プロパティに渡すことでツールを使用できる
- `tools()` メソッドは Schema Discovery と Schema Definition の 2 つのアプローチが用意されている
  - Schema Discovery は MCP サーバーが提供するツールのスキーマを自動的に取得してツールを作成する
  - Schema Definition は Zod を使用してツールのスキーマを手動で定義する

## 参考

- [MCP Tools](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#mcp-tools)
- [playwright-mcp](https://github.com/microsoft/playwright-mcp)