---
id: 1xom1VlYPAOIJEmC876Ed
title: "Vercel AI SDK で MCP クライアントをツールとして利用する"
slug: "vercel-ai-sdk-mcp-client"
about: "MCP（Model Context Protocol）は LLM に追加のコンテキストを提供するための標準化されたプロトコルです。Vercel AI SDK は v4.2 から MCP をサポートしており、MCP クライアントをツールとして利用できます。この記事では Vercel AI SDK を使って MCP ツールを使用する方法を紹介します。"
createdAt: "2025-03-30T10:22+09:00"
updatedAt: "2025-03-30T10:22+09:00"
tags: ["AI", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1tQJuTWklgBmxogx9RdjXi/2be6a25c36a87f03835c05c28ce449fa/fish_cute_scribble-angel_10336-768x601.png"
  title: "かわいいスクリブルドエンゼルのイラスト"
selfAssessment:
  quizzes:
    - question: "MCP クライアントを初期化するために使用された関数は何か"
      answers:
        - text: "experimental_initializeMCPClient"
          correct: false
          explanation: null
        - text: "experimental_createMCPClient"
          correct: true
          explanation: null
        - text: "experimental_setupMCPClient"
          correct: false
          explanation: null
        - text: "experimental_initMCPClient"
          correct: false
          explanation: null
    - question: "MCP クライアントを初期化する際に指定するトランスポート方式のうち、指定できないものはどれか"
      answers:
        - text: "sse"
          correct: false
          explanation: null
        - text: "stdio"
          correct: false
          explanation: null
        - text: "websocket"
          correct: true
          explanation: null
        - text: "custom transport"
          correct: false
          explanation: null
published: true
---
[MCP（Model Context Protocol）](https://modelcontextprotocol.io/introduction)は、LLM（大規模言語モデル）に追加のコンテキストや機能を提供するための標準化されたプロトコルであり、AI アプリケーション開発において注目を集めています。MCP を利用することで、LLM は外部ツールやデータソースと連携し、より高度なタスクを実行できるようになります。

MCP サーバーの例としては、以下のようなものが提供されています。

- [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github)：ファイル操作やプルリクエストの作成を行う
- [Slack](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)：Slack のメッセージを取得・送信する
- [Sentry](https://github.com/modelcontextprotocol/servers/tree/main/src/sentry)： Sentry の Issue を取得する

例えば GitHub の MCP サーバーを Cline のような AI コーディングエージェントと連携させると、「リポジトリの Issue 一覧を取得し、特定の Issue を選択してコードを修正し、プルリクエストを作成する」といった一連の操作を自然言語で指示できます。LLM は MCP サーバーを通じて GitHub API を呼び出し、実際にプルリクエストを作成します。

MCP の利点は、LLM のモデル実装の詳細に依存せず、標準化された方法で外部機能（コンテキスト）を提供できる点にあります。これにより、異なる LLM や AI アプリケーション間でのツールの再利用性が高まります。

MCP サーバーを利用するには、対となる MCP クライアントが必要です。MCP クライアントは、AI アプリケーション（ホスト）と MCP サーバー間の通信を仲介します。ホストからの要求を受け、サーバーとの接続を確立し、ツールの利用リクエストなどを送信します。先の例では、AI コーディングエージェント Cline が MCP クライアントの役割を担っていました。

[Vercel AI SDK](https://sdk.vercel.ai/docs/introduction) は、バージョン 4.2 から MCP をネイティブサポートしました。これにより、Vercel AI SDK を利用する開発者は、MCP クライアント機能を簡単にアプリケーションに組み込み、MCP サーバーが提供するツールを活用できます。

この記事では、Vercel AI SDK を使用して MCP ツールを利用する具体的な手順を紹介します。

## プロジェクトのセットアップ

まずは、Vercel AI SDK を利用する基本的なプロジェクトをセットアップします。ここでは例として、Next.js を用いたシンプルなチャットアプリケーションを作成します。以下のコマンドで Next.js プロジェクトを新規作成します。

```bash
npx create-next-app@latest
```

次に、チャット機能と MCP 連携に必要な依存関係をインストールします。

- `ai`: Vercel AI SDK のコア機能を提供します。
- `@ai-sdk/react`: React 環境で `useChat` フックなど、チャットインターフェース構築を容易にするユーティリティを提供します。
- `@ai-sdk/google`: Google の LLM (Gemini など) を利用するためのインテグレーションを提供します。使用する LLM に応じて、例えば OpenAI なら `@ai-sdk/openai` をインストールします。
- `zod`: 型安全なデータバリデーションライブラリです。Vercel AI SDK では、ツールの入力・出力スキーマ定義に利用できます。

```bash
npm i ai @ai-sdk/react @ai-sdk/google zod
```

LLM を利用するには API キーが必要です。今回は Google Gemini を使用するため、[Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja) で API キーを取得します。選択するモデルによっては料金が発生する場合があるため、ご注意ください。

取得した API キーは、プロジェクトルートに `.env` ファイルを作成し、以下のように環境変数として設定します。

```txt:.env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

### ルートハンドラーの作成

次に、フロントエンドからのリクエストを処理し、LLM と通信する API ルートハンドラーを作成します。Next.js の App Router を使用し、`app/api/chat/route.ts` ファイルを作成します。

```ts:app/api/chat/route.ts
import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export async function POST(req: Request) {
  // リクエストボディからメッセージ履歴を取得
  const { messages } = await req.json();

  // Vercel AI SDK の streamText 関数を使用して LLM とのストリーミング通信を開始
  const result = streamText({
    model: google("gemini-2.5-pro-exp-03-25"), // 注: モデル名は利用可能な最新のものに適宜変更してください
    messages, // ユーザーからのメッセージと過去の会話履歴
  });

  // ストリーミング応答をクライアントに返す
  return result.toDataStreamResponse();
}
```

このコードでは、クライアントから送信されたメッセージ履歴 (`messages`) を受け取り、`streamText` 関数に渡して LLM (ここでは Google Gemini 2.5) との通信を開始します。`streamText` は、LLM からの応答をチャンクごとに受け取り、クライアントにストリーミング形式で送信するためのオブジェクトを返します。`toDataStreamResponse` メソッドは、このオブジェクトを Next.js が扱えるレスポンス形式に変換します。

Vercel AI SDK の `model` プロパティにより、使用する LLM モデルを簡単に切り替えられる点が特徴です。

### チャット UI の作成

次に、ユーザーがメッセージを入力し、AI との対話を表示するフロントエンド UI を作成します。`app/page.tsx` を以下のように編集します。

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

`@ai-sdk/react` パッケージが提供する `useChat` フックを利用することで、メッセージ履歴の管理、入力ハンドリング、API リクエストの送信といった、チャット UI に必要な状態管理やロジックを簡略化できます。`handleSubmit` 関数は、フォーム送信時に自動的に `/api/chat` (デフォルト) エンドポイントへ POST リクエストを送信し、ストリーミング応答を処理します。このエンドポイントは、先ほど作成した API ルートハンドラーに対応しています。

ここまでの実装で、基本的なチャットアプリケーションが完成しました。以下のコマンドで開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセスし、チャット UI が表示されることを確認してください。メッセージを入力して送信すると、設定した LLM からの応答がストリーミング表示されます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/40KFadF7mBJF6UdvzrgRV8/fe9765b5bfa4195f8d67f5c424843dd6/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-30_11.16.08.mov" controls></video>

## MCP クライアントの作成

ここからが本題です。作成したチャットアプリケーションに MCP クライアント機能を追加し、外部ツール連携を実装します。

今回は MCP サーバーの例として、Microsoft が提供する [playwright-mcp](https://github.com/microsoft/playwright-mcp) を使用します。これは、Web ブラウザ自動化ツールである Playwright を操作するためのツールを提供する MCP サーバーです。これを利用することで、LLM に Web ページの情報を取得させたり、フォームを操作させたりすることが可能になります。

Vercel AI SDK を使って MCP サーバーと通信するには、まず MCP クライアントを初期化する必要があります。クライアント初期化時には、サーバーとの接続方法（トランスポート）を指定します。以下の 3 つの方法が提供されています。

- SSE (Server-Sent Events): HTTP ストリーミングを用いてサーバーと通信する。ネットワーク経由での接続に適している。
- stdio: 標準入出力ストリームを用いてサーバーと通信する。ローカルマシン上で CLI ツールとしてサーバーを実行する場合などに適している。
- カスタムトランスポート: 提供されているインターフェースを実装することで、独自の通信方法を定義できる

今回は、ローカルで起動した Playwright MCP サーバーと SSE で通信します。まず、以下のコマンドを実行して Playwright MCP サーバーを起動します。`http://localhost:8931` でリクエストを待ち受けます。

```bash
npx @playwright/mcp@latest --port 8931 --headless 
```

次に、Vercel AI SDK の `experimental_createMCPClient` 関数を使用して MCP クライアントを初期化します。SSE を利用するため、`transport` オプションに `type: "sse"` とサーバーのエンドポイント URL を指定します。

```ts:app/api/chat/route.ts
// experimental_ 接頭辞は、この関数がまだ実験的な段階にあり、
// 将来のバージョンでインターフェースが変更される可能性があることを示している
import { experimental_createMCPClient as createMCPClient } from "ai";

const mcpClient = await createMCPClient({
  transport: {
    type: "sse",
    url: "http://localhost:8931/sse"
  },
});
```

### MCP ツールを使用する

MCP クライアント (`mcpClient`) の準備ができたら、次は MCP サーバーが提供するツールを LLM から利用できるようにします。

`mcpClient.tools()` メソッドは、接続先の MCP サーバーが公開しているツール情報を取得し、Vercel AI SDK が扱える形式に変換するアダプターとして機能します。このメソッドが返すツール定義を `streamText` 関数の `tools` プロパティに渡すことで、LLM は対話の中でこれらのツールを呼び出すことが可能になります。

Vercel AI SDK で MCP ツールを利用するには、主に 2 つのアプローチがあります。

- Schema Discovery: MCP サーバーが提供するツールのスキーマを自動的に取得してツールを作成する。実装が簡単で、MCP サーバーの変更を自動で同期できる。一方で TypeScript の型安全性が得られない、使用したいツールを選択できないというデメリットがある
- Schema Definition: Zod を使用してツールのスキーマを手動で定義する。型安全性が得られ、明示的に使用するツールを選択できる。一方で MCP サーバーの変更を手動で同期する必要があり保守すべきコードが増えるというデメリットがある

今回は、実装が簡単な Schema Discovery を使用します。`app/api/chat/route.ts` を以下のように修正し、`mcpClient.tools()` の結果を `streamText` に渡します。

```ts:app/api/chat/route.ts {15-16, 21-25}
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

  // Schema Discovery を使用して MCP サーバーからツール定義を取得
  const tools = await mcpClient.tools();

  const result = streamText({
    model: google("gemini-2.5-pro-exp-03-25"),
    messages,
    tools, // 取得したツール定義を LLM に渡す
    onFinish: () => {
      // ストリーミング応答が完了したら、必ず MCP クライアントの接続を閉じる
      mcpClient.close();
    },
  });

  return result.toDataStreamResponse();
}
```

MCP クライアントは初期化した後に都度接続を閉じる必要がある点に注意してください。今回の例のようにストリーミングでレスポンスを帰返却する場合には LLM レスポンスが終了したタイミングで接続を閉じるようにします。`onFinish` コールバックを使用して LLM レスポンスが終了したタイミングで `mcpClient.close()` を呼び出しています。

これで、MCP ツールを利用する準備が整いました。アプリケーションを再起動し、チャット UI から Playwright MCP サーバーのツールを呼び出すような指示を試してみましょう。例えば、「azukiazusa.dev で人気の記事を教えて下さい」と送信すると、LLM は Playwright ツールを使って指定された Web サイトにアクセスし、情報を取得しようと試みます。その結果に基づいて、応答が生成されるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/7wM0wo0woimdXHoGV7gxw1/58f8cf8486c47d6802ab63e0ae615946/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-30_12.08.29.png)

## まとめ

- MCP（Model Context Protocol）は LLM に追加のコンテキストを提供するための標準化されたプロトコル
- Vercel AI SDK は v4.2 から MCP をサポートしており、MCP クライアントをツールとして利用できる
- Vercel AI SDK は `experimental_createMCPClient` 関数 (実験的機能) を通じて MCP クライアントを初期化できる。
- 接続方法として SSE, stdio, カスタムトランスポートが選択可能。
- MCP クライアントは利用後に `close()` メソッドで明示的に接続を閉じる必要がある。
- `mcpClient.tools()` で MCP サーバーからツール定義を取得し、`streamText` の `tools` オプションに渡すことで LLM からツールを利用できる。
- ツール定義の方法には、動的に取得する Schema Discovery と、静的に定義する Schema Definition の 2 つのアプローチがある。

## 参考

- [MCP Tools](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling#mcp-tools)
- [playwright-mcp](https://github.com/microsoft/playwright-mcp)
