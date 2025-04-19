---
id: 2CkS8AfHTegw2O_TjL9v6
title: "MCP サーバーの Streamable HTTP transport を試してみる"
slug: "mcp-server-streamable-http-transport"
about: "MCP では stdio と Streamable HTTP の 2 つの transport が定義されています。TypeScript SDK では v1.10.0 から Streamable HTTP transport がリリースされました。この記事では MCP サーバーを構築し、Streamable HTTP transport を試してみます。"
createdAt: "2025-04-19T09:29+09:00"
updatedAt: "2025-04-19T09:29+09:00"
tags: ["AI", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2CYinTWmO54Yx2PYPWZ3q/7b71d6f8e2a9b26191405f7acc027857/desert_chocolate-sundae_16898.png"
  title: "チョコレートサンデーのイラスト"
selfAssessment:
  quizzes:
    - question: "ステートフルなサーバーを実装する場合に、セッション ID を管理するために使用される HTTP ヘッダーは何ですか？"
      answers:
      - text: "Session-Id"
        correct: false
        explanation: ""
      - text: "X-Session-Id"
        correct: false
        explanation: ""
      - text: "Mcp-Session-Id"
        correct: true
        explanation: ""
      - text: "Authorization"
        correct: false
        explanation: ""

published: true
---

MCP（Model Context Protocol）では [JSON-RPC](https://www.jsonrpc.org/specification) を使用してメッセージをエンコードしています。クライアントとサーバー間のトランスポート方式として以下の 2 つが定義されています。

- stdio: 標準入出力を介した通信（主にローカル実行向け）
- Streamable HTTP: HTTP ストリーミングを介した通信（リモートサーバー向け）

現在（2025年4月時点）では、多くの MCP クライアントとサーバー間の通信には stdio が使用されています。これは 2024-11-05 バージョンの仕様では認証仕様が十分に定まっておらず、リモートサーバーで実行する際のセキュリティ上の懸念があったためです。そのため、MCP サーバーを利用するユーザーは自身で npm などで配布されたパッケージをインストールして実行する必要があり、非常に煩雑でした。

## Streamable HTTP トランスポートの概要

2025-03-26 バージョンの仕様では OAuth 2.1 に基づく認証仕様の追加や HTTP ストリーミングを介した通信などの仕様が新たに追加されました。MCP における認証の実装は optional となっていますが、HTTP ベースのトランスポートを使用する実装では MCP の仕様に準拠した認証を実装することが推奨（should）されています。

Streamable HTTP トランスポートは、旧仕様（2024-11-05 バージョン）に存在していた HTTP + SSE トランスポートを置き換える新しい方式です。この新しいトランスポートには、次のような利点があります。

- ステートレスなサーバーを実装できる
- SSE は必須ではなく、プレーンな HTTP サーバーを実装できる。そのため、既存のインフラストラクチャを利用できる
- 旧仕様との下位互換性を考慮した実装となっている
- 旧仕様では SSE エンドポイントと HTTP POST エンドポイントの 2 つを実装する必要があったが、Streamable HTTP トランスポートでは 1 つのエンドポイント（`/mcp`）で済む

MCP サーバーを構築するための TypeScript SDK は v1.10.0 から Streamable HTTP トランスポートをサポートしています。この記事では、TypeScript SDK を使用して MCP サーバーを構築し、Streamable HTTP トランスポートを実際に試してみます。

## MCP サーバーの構築

まずは TypeScript を使用した HTTP サーバーを構築しましょう。この記事ではフレームワークとして [Express](https://expressjs.com/) を使用します。

まずは TypeScript プロジェクトを作成します。

```bash
mkdir mcp-server
cd mcp-server
npm init -y
```

必要なパッケージをインストールします。

```bash
npm install @modelcontextprotocol/sdk zod express
npm install --save-dev typescript tsx @types/node @types/express
``` 

## ステートレスなサーバーの実装

Streamable HTTP トランスポートでは、会話の状態を保持する必要がない場合はステートレスなサーバーを実装できます。まずはシンプルなステートレスなサーバーから実装してみましょう。

`src/index.ts` を以下のように作成します。

```ts:src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";

const app = express();
app.use(express.json());

const transport: StreamableHTTPServerTransport =
  new StreamableHTTPServerTransport({
    // ステートレスなサーバーの場合、undefined を指定する
    sessionIdGenerator: undefined,
  });

const mcpServer = new McpServer({ name: "my-server", version: "0.0.1" });

// シンプルにサイコロを振った結果を返すツール
mcpServer.tool(
  // ツールの名前
  "dice",
  // ツールの説明
  "サイコロを振った結果を返します",
  // ツールの引数のスキーマ
  { sides: z.number().min(1).default(6).describe("サイコロの面の数") },
  // ツールが実行されたときの処理
  async (input) => {
    const sides = input.sides ?? 6;
    const result = Math.floor(Math.random() * sides) + 1;
    return {
      content: [
        {
          type: "text",
          text: result.toString(),
        },
      ],
    };
  }
);

const setupServer = async () => {
  await mcpServer.connect(transport);
};

// POST リクエストで受け付ける
app.post("/mcp", async (req, res) => {
  console.log("Received MCP request:", req.body);
  try {
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          // JSON-RPC 2.0のエラーコードを指定
          // http://www.jsonrpc.org/specification#error_object
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// GET リクエストは SSE エンドポイントとの互換性のために実装する必要がある
// SSE エンドポイントを実装しない場合は、405 Method Not Allowed を返す
app.get("/mcp", async (req, res) => {
  console.log("Received GET MCP request");
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});

// DELETE リクエストはステートフルなサーバーの場合に実装する必要がある
app.delete("/mcp", async (req, res) => {
  console.log("Received DELETE MCP request");
  res.writeHead(405).end(
    JSON.stringify({
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: "Method not allowed.",
      },
      id: null,
    })
  );
});


setupServer()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000/mcp");
    });
  })
  .catch((err) => {
    console.error("Error setting up server:", err);
    process.exit(1);
  });

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    console.log(`Closing transport`);
    await transport.close();
  } catch (error) {
    console.error(`Error closing transport:`, error);
  }

  await mcpServer.close();
  console.log("Server shutdown complete");
  process.exit(0);
});
```

このコードでは、`/mcp` エンドポイントでPOSTリクエストを受け付け、MCP SDKの `transport.handleRequest` メソッドを使用してリクエストを処理しています。サーバーはシンプルなサイコロを振るツールを提供します。

以下のコマンドでサーバーを起動します。

```bash
npx tsx src/index.ts
```

## クライアントの実装

サーバーの動作を確認するためには対となる MCP クライアントが必要です。この記事の執筆段階では Streamable HTTP トランスポートをサポートしているクライアントは存在しないので、TypeScript SDK を使用して MCP クライアントを実装します。このクライアントではターミナルの標準入出力を使用して `list-tools` が入力されればサーバーが提供しているツールの一覧を表示し、`call-tool` が入力されればサーバーのサイコロを振るツールを実行します。

まずは MCP クライアントを作成するための TypeScript プロジェクトを作成します。

```bash
mkdir mcp-client
cd mcp-client
npm init -y
```

必要なパッケージをインストールします。

```bash
npm install @modelcontextprotocol/sdk
npm install --save-dev typescript tsx @types/node
```

`src/index.ts` ファイルを作成し、基本的なMCPクライアントを実装します。

```ts:src/index.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createInterface } from "readline/promises";

// Streamable HTTP トランスポートを使用して MCP サーバーに接続
const transport = new StreamableHTTPClientTransport(
  new URL("http://localhost:3000/mcp"),
  {
    sessionId: undefined,
  }
);

const client = new Client({
  name: "example-client",
  version: "0.0.1",
});

client.onerror = (error) => {
  console.error("Client error:", error);
};

// 標準入力を受け取るインターフェイス
const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  try {
    // サーバーに接続するリクエストを送信
    await client.connect(transport);

    while (true) {
      console.log("avaible commands:");
      console.log("1. list-tools");
      console.log("2. call-tool");
      console.log("3. exit");
      console.log("------------------------------");

      const answer = await readline.question("Enter your input: ");

      switch (answer) {
        case "list-tools":
          await listTools();
          break;
        case "call-tool":
          await callTool();
          break;
        case "exit":
          await disconnect();
          console.log("Disconnected from server.");
          return;

        default:
          console.log("You entered:", answer);
          break;
      }
    }
}

async function disconnect() {
  await transport.close();
  await client.close();
  readline.close();
  console.log("Disconnected from server.");
  process.exit(0);
}

main()
  .catch((error) => {
    console.error("Error:", error);
    disconnect();
  });
```

このコードでは、標準入力からコマンドを受け付けてサーバーに接続します。`list-tools` コマンドを入力した場合に呼び出す `listTools` メソッドを実装します。

```ts:src/index.ts
import {
  ListToolsRequest,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";

async function listTools() {
  const req: ListToolsRequest = {
    method: "tools/list",
    params: {},
  };

  const res = await client.request(req, ListToolsResultSchema);

  if (res.tools.length === 0) {
    console.log("No tools available.");
  } else {
    for (const tool of res.tools) {
      console.log(`Tool Name: ${tool.name}`);
      console.log(`Tool Description: ${tool.description}`);
      console.log("------------------------------");
    }
  }
}
```

Streamable HTTP トランスポートを使用する場合、`client.request` メソッドを使用して MCP サーバーへリクエストを送信します。サーバーにどのような要求を送信するかは、`@modelcontextprotocol/sdk/types.js` に定義されたリクエストのスキーマを使用します。ツールの一覧を取得する場合には `method` に `tools/list` を指定します。

次に、サーバーのサイコロを振るツールを実行するための `callTool` メソッドを実装します。

```ts:src/index.ts
async function callTool() {
  const sides = await readline.question(
    "Enter the number of sides on the dice: "
  );
  const sidesNumber = Number(sides);
  if (isNaN(sidesNumber) || sidesNumber <= 0) {
    console.error("Invalid input. Please enter a positive number.");
    return;
  }
  const req: CallToolRequest = {
    method: "tools/call",
    params: {
      name: "dice",
      arguments: { sides: sidesNumber },
    },
  };

  try {
    const res = await client.request(req, CallToolResultSchema);
    console.log("Tool response:");

    res.content.forEach((item) => {
      if (item.type === "text") {
        console.log(item.text);
      } else {
        console.log(item.type + "content", item);
      }
    });
    console.log("------------------------------");
  } catch (error) {
    console.error("Error calling tool:", error);
  }
}
```

これでクライアントの実装は完了です。以下のコマンドでクライアントを起動します：

```bash
npx tsx src/index.ts
```

`list-tools` と入力すると、サーバーが提供しているツールの一覧が表示されます。

```bash
Enter your input: list-tools
Tool Name: dice
Tool Description: サイコロを振った結果を返します
------------------------------
```

また、`call-tool` コマンドでサイコロを振るツールを実行できます：

```bash
Enter your input: call-tool
Enter the number of sides on the dice: 8
Tool response:
6
------------------------------
```

## ステートフルなサーバーの実装

続いて、ステートフルなサーバーを実装してみましょう。ステートフルなサーバーでは、[Session Management](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#session-management) の仕様に従ってセッション状態を管理します。

- クライアントから初期化リクエストを受け取ると、サーバーは新たにセッション ID を生成する
- セッション ID は UUID や JWT などの暗号的に安全でグローバルに一意な識別子である必要がある
- サーバーはレスポンスヘッダーに `Mcp-Session-Id` を含めてクライアントに返す
- クライアントは後続のすべてのリクエストヘッダーに `Mcp-Session-Id` を含める必要がある
- 初期化以外のリクエストで `Mcp-Session-Id` ヘッダーが欠けている場合、サーバーは 400 Bad Request を返す

まずはサーバーの実装を変更して、セッション管理を追加します。

```ts:src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import express from "express";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "node:crypto";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";

// セッション ID ごとに transport を作成する
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

const mcpServer = new McpServer({ name: "my-server", version: "0.0.1" });

// ...

app.post("/mcp", async (req, res) => {
  try {
    // セッション ID がヘッダーに存在するか確認
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    // セッション ID が存在する場合はその transport を再利用
    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (
      // セッション ID が存在しないかつ、初期化リクエストの場合は新しい transport を作成
      isInitializeRequest(req.body) &&
      !sessionId
    ) {
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore,
        onsessioninitialized: (sessionId) => {
          console.log(`Session initialized with ID: ${sessionId}`);
          transports[sessionId] = transport;
        },
      });

      // トランスポートが閉じられたとき、transports から削除
      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(`Transport closed for session ID: ${sid}`);
          delete transports[sid];
        }
      };

      await mcpServer.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: null,
      });
      return;
    }

    // すでにセッション ID が存在する場合は、その transport を使用してリクエストを処理
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// DELETE リクエストを受け取った場合、セッションを閉じる
app.delete("/mcp", async (req, res) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res
      .status(400)
      .send(
        "Invalid or missing session ID. Please provide a valid session ID."
      );
    return;
  }

  console.log(`Closing session for ID: ${sessionId}`);

  try {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("Error closing transport:", error);
    if (!res.headersSent) {
      res.status(500).send("Error closing transport");
    }
  }
});

app.listen(3000, () => {
  console.log("Stateful server is running on http://localhost:3000/mcp");
});

// graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  try {
    // すべてのトランスポートを閉じる
    for (const sessionId in transports) {
      const transport = transports[sessionId];
      if (transport) {
        await transport.close();
        console.log(`Transport closed for session ID: ${sessionId}`);
      }
    }
  } catch (error) {
    console.error(`Error closing transport:`, error);
  }

  await mcpServer.close();
  console.log("Server shutdown complete");
  process.exit(0);
});
```

クライアントの実装も変更しましょう。変数 `sessionId` を追加して、これを `transport` を初期化する際に使用します。`client.connect()` が完了した後は `transport.sessionId` にサーバーから返されたセッション ID が格納されているのでこれを変数 `sessionId` に格納します。リクエストヘッダーに `Mcp-Session-Id` を追加する処理は SDK が自動的に行ってくれます。

更にセッションを閉じるための `terminateSession` メソッドを追加します。`transport.terminateSession()` メソッドを呼び出すことで、DELETE リクエストをサーバーに送信します。

```ts:src/index.ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  CallToolRequest,
  CallToolResultSchema,
  ListToolsRequest,
  ListToolsResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createInterface } from "readline/promises";

// セッション ID と transport を保持する変数
let sessionId: string | undefined;
let transport: StreamableHTTPClientTransport | undefined;

const client = new Client({
  name: "example-stateful-client",
  version: "0.0.1",
});

// ...

async function main() {
  transport = new StreamableHTTPClientTransport(
    new URL("http://localhost:3000/mcp"),
    {
      sessionId,
    }
  );
  // 初期化リクエストを送信
  await client.connect(transport);
  // サーバーで生成されたセッション ID を取得
  console.log("Session ID:", transport.sessionId);
  sessionId = transport.sessionId;

  while (true) {
    console.log("available commands:");
    console.log("1. list-tools");
    console.log("2. call-tool");
    console.log("3. exit");
    console.log("4. terminate-session");
    console.log("------------------------------");

    const answer = await readline.question("Enter your input: ");

    switch (answer) {
      case "list-tools":
        await listTools();
        break;
      case "call-tool":
        await callTool();
        break;
      // terminate-session コマンドを追加
      case "terminate-session":
        await terminateSession();
        break;
      case "exit":
        await disconnect();
        console.log("Disconnected from server.");
        return;

      default:
        console.log("You entered:", answer);
        break;
    }
  }
}

// セッションを終了するメソッド
async function terminateSession() {
  if (!transport) {
    console.log("No active transport to terminate.");
    return;
  }
  await transport.terminateSession();
  console.log("Session terminated.");

  // sessionId が正しく消えているか確認
  if (!transport.sessionId) {
    console.log("Session ID:", transport.sessionId);
    sessionId = undefined;
  } else {
    // server が DELETE リクエストをサポートしていない
    console.log("Session ID not available. Unable to terminate session.");
  }
}
```

`terminate-session` コマンドを実行してみると、以降のリクエストはすべて 400 Bad Request が返されることが確認できます。実際のアプリケーションの場合では、セッションを一度閉じてから新たにセッションを開始する処理が必要になるでしょう。

```bash
Enter your input: terminate-session
Session terminated.
------------------------------
Enter your input: list-tools
Client error: Error: Error POSTing to endpoint (HTTP 400): {"jsonrpc":"2.0","error":{"code":-32000,"message":"Bad Request: No valid session ID provided"},"id":null}
```

## まとめ

- MCP の仕様の 2024-11-05 バージョンでは HTTP + SSE トランスポートを使用していたが、2025-03-26 バージョンでは Streamable HTTP トランスポートに置き換えられた
- Streamable HTTP トランスポートを使用することで、ステートレスなサーバーを実装できる
- TypeScript SDK v1.10.0 から Streamable HTTP トランスポートがリリースされた
- サーバーの実装では `/mcp` エンドポイントで POST リクエストを受け付け、`transport.handleRequest` メソッドを使用してリクエストを処理する
- ステートフルなサーバーを実装する場合は、セッション ID を使用して transport を管理する

## 参考

- [Transports - Model Context Protocol](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http)
- [modelcontextprotocol/typescript-sdk: The official Typescript SDK for Model Context Protocol servers and clients](https://github.com/modelcontextprotocol/typescript-sdk?tab=readme-ov-file#streamable-http)
- [MCP TypeScript SDK Examples](https://github.com/modelcontextprotocol/typescript-sdk/tree/main/src/examples)
- [\[RFC\] Replace HTTP+SSE with new "Streamable HTTP" transport by jspahrsummers · Pull Request #206 · modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/206)
- [新しいMCP仕様(2025-03-26)での変更点:認証・SSEサポート任意化](https://times.serizawa.me/p/mcp-changelog-2025-03-26)