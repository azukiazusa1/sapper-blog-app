---
id: wESOmKIMXMQ2XgL3SDWZO
title: "AI SDK の MCP Apps 対応でインタラクティブな UI を返す"
slug: "ai-sdk-mcp-apps"
about: "AI SDK の v7 では MCP Apps 対応が追加されました。AI モデルはツールを呼び出す際に `ui://` リソースが紐付けられていれば、アプリケーション側でその UI をサンドボックス化された環境でレンダリングすることができます。この記事では AI SDK の MCP Apps 対応を試してみた内容を紹介します。"
createdAt: "2026-07-04T19:59+09:00"
updatedAt: "2026-07-04T19:59+09:00"
tags: ["MCP Apps", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2dSHMhB5vk2wA8MrAI90Xp/6b233698025f3c7fe7eb2498986b5ecb/ninja_23810-768x768.png"
  title: "忍者のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "MCP Apps でツールの結果をインタラクティブな UI としてレンダリングさせるために、MCP サーバー側で行う必要がある設定はどれですか?"
      answers:
        - text: "ツールの inputSchema に UI リソースの URI を含める"
          correct: false
          explanation: "inputSchema はツールの入力パラメータを定義するものです。UI リソースとの紐付けには使いません。"
        - text: "ツールの _meta.ui.resourceUri に ui:// で始まるリソースの URI を指定する"
          correct: true
          explanation: "記事で説明されている通り、_meta.ui.resourceUri でツールと ui:// リソースを紐付けることで、MCP Apps 対応ホストがツールの結果をサンドボックス化された iframe 内でレンダリングできるようになります。"
        - text: "ツールの戻り値の content に HTML 文字列を直接含める"
          correct: false
          explanation: "HTML は ui:// リソースとして registerResource で登録し、ツールとは _meta.ui.resourceUri で紐付けます。ツールの content に HTML を直接返す方式ではありません。"
        - text: "registerResource の第 1 引数の名前をツール名と一致させる"
          correct: false
          explanation: "リソースの名前とツール名を一致させる必要はありません。紐付けはあくまで _meta.ui.resourceUri に指定する URI で行います。"
    - question: "ツールの _meta.ui.visibility を [\"app\"] のみに設定した場合の挙動として、記事で説明されているものはどれですか?"
      answers:
        - text: "MCP サーバーの tools/list のレスポンスからそのツールが除外される"
          correct: false
          explanation: "visibility はサーバーが宣言するヒントであり、どの値でも tools/list はすべてのツールを返します。絞り込みは splitMCPAppTools などを使ってクライアント側で行うと記事で説明されています。"
        - text: "ユーザーの明示的な承認がない限りツールを呼び出せなくなる"
          correct: false
          explanation: "visibility はユーザー承認の仕組みではありません。記事では、実際にツールの呼び出しを制限するのはホスト側のブリッジにおける許可リストだと説明されています。"
        - text: "モデルからは呼び出せず、iframe 内の JavaScript からのみ呼び出せるツールになる"
          correct: true
          explanation: "記事の通り、visibility を [\"app\"] のみに設定すると、モデルに渡すツール一覧から除外され、MCP Apps の UI 内の JavaScript からのみ呼び出すツールとして扱われます。"
        - text: "ツールの実行結果が structuredContent を含まなくなる"
          correct: false
          explanation: "visibility とツールの戻り値の形式は無関係です。記事の refreshDashboardData も structuredContent を返しています。"
    - question: "サンドボックスプロキシが postMessage の受信時に event.source === window.parent をチェックする目的として、記事で説明されているものはどれですか?"
      answers:
        - text: "メッセージの到着順序を保証するため"
          correct: false
          explanation: "event.source は送信元のウィンドウを判定するためのもので、順序の保証とは関係ありません。"
        - text: "JSON-RPC 2.0 のバージョンを検証するため"
          correct: false
          explanation: "JSON-RPC のバージョン確認は jsonrpc プロパティが '2.0' かどうかのチェックで行われており、event.source とは別の検証です。"
        - text: "postMessage の処理回数を減らしてパフォーマンスを改善するため"
          correct: false
          explanation: "このチェックはパフォーマンスのためではなく、セキュリティ上の攻撃を防ぐためのものです。"
        - text: "信頼できない iframe が sandbox-resource-ready を偽装し、allow-same-origin 付きで自分自身を再生成させる攻撃を防ぐため"
          correct: true
          explanation: "記事の通り、このチェックがないと悪意ある iframe が偽の通知を送りつけて createAppFrame を呼ばせ、allow-same-origin 付きの iframe として再生成される攻撃が成立してしまいます。"
published: true
---
Vercel が提供する AI SDK の v7 では、[MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) 対応が追加されました。MCP Apps は Model Context Protocol (MCP) のツールがプレーンテキストの代わりにインタラクティブな UI を返せるようにするための拡張機能です。AI モデルは通常通りツールを呼び出す際に `ui://` リソースが紐付けられていれば、アプリケーション側でその UI をサンドボックス化された環境でレンダリングすることができます。これにより、ユーザーはグラフ形式でデータを確認したり、レストランの一覧をカード形式で表示したうえで、予約ボタンを押すといった操作が可能になります。

MCP Apps に対応するアプリケーション側ではサンドボックス化のために独自の iframe の通信やセキュリティ上の制約を考慮する必要がありますが、AI SDK では MCP Apps 対応のための便利な API が提供されており、アプリケーション側での実装を比較的容易に行うことができます。この記事では AI SDK の MCP Apps 対応を試してみた内容を紹介します。

## MCP Apps 対応の AI SDK を使ってみる

AI SDK では MCP Apps を構築するために以下の 2 つのヘルパーを提供しています。

- [`@ai-sdk/mcp`](https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-apps): MCP ホストが MCP Apps のサポートを宣言したり、モデルから見えるツールとアプリから見えるツールを分離したり、`ui://` リソースを読み取ったりする
- [`experimental_MCPAppRenderer`](https://ai-sdk.dev/docs/reference/ai-sdk-ui/mcp-app-renderer#experimental_mcpapprenderer): React アプリケーション側で MCP Apps の UI をレンダリングするためのコンポーネント。サンドボックス化された iframe 内で UI をレンダリングしたり、iframe とホストアプリケーション間の通信を行う

まずは AI SDK を使用して LLM が生成したレスポンスを UI でレンダリングするという基盤を構築します。Next.js アプリケーションを作成し、AI SDK 関連と MCP SDK をインストールします。

```bash
npx create-next-app@latest my-ai-sdk-app
cd my-ai-sdk-app
npm install ai @ai-sdk/react @ai-sdk/openai @ai-sdk/mcp zod @modelcontextprotocol/sdk
```

`@ai-sdk/openai` は OpenAI の API を使用するためのパッケージです。必要に応じて使用する LLM プロバイダーに応じたパッケージをインストールしてください。次に、OpenAI の API キーを環境変数として設定します。

```bash:.env
OPENAI_API_KEY=your_openai_api_key
```

プロジェクトの全体の構成は以下のようになり、主要な 6 つのコンポーネントから構成されます。
```
src/
├── lib/mcp-client.ts              # MCPサーバーへの接続ヘルパー
└── app/
    ├── page.tsx                   # チャットUI（MCPAppRendererでiframe描画）
    └── api/
        ├── chat/route.ts          # streamTextにツールを渡すチャットAPI
        └── mcp/
            ├── server/route.ts    # MCPサーバー本体（ツール + ui://リソース）
            ├── sandbox/route.ts   # 二重iframeのサンドボックスプロキシ
            └── host/route.ts      # iframe→サーバーのブリッジ
```            

### MCP サーバーの構築

まずはツールと `ui://` リソースを持つ MCP サーバーを実装します。この箇所は AI SDK 特有の部分はなく、通常の MCP Apps の構築と同じです。

`/api/mcp/server` に MCP サーバーを実装するため、`app/api/mcp/server/route.ts` を作成します。ここではダッシュボードを表示するツールと、ダッシュボードのデータを更新する App 専用のツールを実装します。App 専用のツールはモデルからは見えず、iframe 内の JavaScript からのみ呼び出すことができます。

```ts:app/api/mcp/server/route.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
// MCP_APP_MIME_TYPE は "text/html;profile=mcp-app" という MIME タイプを表す定数。
// MIME タイプは MCP Apps の仕様で決まっており、MCP Apps のリソースを配信する際にこの MIME タイプを返す必要がある。
import { MCP_APP_MIME_TYPE } from "@ai-sdk/mcp";

// MCP のリソースを示す URI。MCP Apps の仕様では、ui:// で始まる URI で表される。
const DASHBOARD_RESOURCE_URI = "ui://ai-sdk-mcp-apps-example/dashboard";

function createDashboardHtml() {
  // MCP Apps のサンドボックスでレンダリングする HTML の例。ReactやVueなどのフレームワークを使ってビルド後のHTMLを返してもよい。
  // 後ほど実装例を紹介するのでここでは skip
  return `<!doctype html>
  </html>`;
}

// MCP サーバーを作成する関数
// リソースとツールを登録する。
function createServer() {
  const server = new McpServer(
    { name: "AI SDK MCP Apps Example Server", version: "1.0.0" },
    { capabilities: { resources: {}, tools: {} } },
  );

  // 1. ui:// リソースを登録する。
  server.registerResource(
    "dashboard-app",
    DASHBOARD_RESOURCE_URI,
    {
      description: "MCP Appsホストが描画するインタラクティブなダッシュボード。",
      mimeType: MCP_APP_MIME_TYPE,
    },
    async () => ({
      contents: [
        {
          uri: DASHBOARD_RESOURCE_URI,
          mimeType: MCP_APP_MIME_TYPE,
          text: createDashboardHtml(),
        },
      ],
    }),
  );

  // 2. ダッシュボードを表示するツール。
  //    _meta.ui.resourceUri でツールと ui:// リソースを紐付けることにより、
  //    MCP Apps に対応しているホストはツールの結果をサンドボックス化された iframe 内でレンダリングすることができる。
  server.registerTool(
    "showDashboard",
    {
      title: "ダッシュボードを表示",
      description:
        "指定したトピックのインタラクティブなダッシュボードを表示する。",
      inputSchema: {
        topic: z
          .string()
          .describe("表示するダッシュボードのトピック（例: usage, weather）"),
      },
      _meta: {
        ui: {
          resourceUri: DASHBOARD_RESOURCE_URI,
          // visibility: ["model", "app"] とすることで、モデルからもアプリからも見えるツールになる。
          visibility: ["model", "app"],
        },
      },
    },
    async ({ topic }) => ({
      content: [
        {
          type: "text" as const,
          text: `"${topic}" のダッシュボードを表示しました。`,
        },
      ],
      // ツールが返した値はリソースの UI から参照することができる。ここでは例としてダッシュボードのカード情報を返す。
      structuredContent: {
        topic,
        cards: [
          { label: "リクエスト数", value: 128 },
          { label: "レイテンシ", value: "42ms" },
          { label: "状態", value: "正常" },
        ],
      },
      _meta: { ui: { resourceUri: DASHBOARD_RESOURCE_URI } },
    }),
  );

  // 3. App専用ツール。visibility: ["app"] なのでモデルからこのツールを呼び出すことはできない。
  //    iframe内のJavaScriptからだけ呼び出せる。
  server.registerTool(
    "refreshDashboardData",
    {
      title: "ダッシュボードデータを更新",
      description:
        "ダッシュボードの表示データを更新する。モデル向けではなくApp専用。",
      inputSchema: { reason: z.string().optional() },
      _meta: {
        ui: { resourceUri: DASHBOARD_RESOURCE_URI, visibility: ["app"] },
      },
    },
    async ({ reason }) => ({
      content: [
        {
          type: "text" as const,
          text: `ダッシュボードのデータを更新しました${reason ? `（理由: ${reason}）` : ""}。`,
        },
      ],
      structuredContent: {
        refreshedAt: new Date().toISOString(),
        cards: [
          { label: "リクエスト数", value: 143 },
          { label: "レイテンシ", value: "39ms" },
          { label: "状態", value: "正常" },
        ],
      },
    }),
  );
  return server;
}

// Next.js の API ルートで MCP サーバーを公開する
async function requestHandler(req: Request) {
  if (req.method === "GET" || req.method === "DELETE") {
    return Response.json(
      {
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      },
      { status: 405 },
    );
  }

  const server = createServer();
  // WebStandardStreamableHTTPServerTransport は Web 標準の Request/Response を使って MCP サーバーと通信するトランスポート。
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  return transport.handleRequest(req);
}

// GET, POST, DELETE の各メソッドで同じ requestHandler を使用する。
export {
  requestHandler as DELETE,
  requestHandler as GET,
  requestHandler as POST,
};
```

MCP の TypeScript SDK を使用して MCP サーバーを構築していきます。`createServer` 関数内の `new McpServer(...)` で MCP サーバーを作成し、リソースとツールを登録しています。リソースの登録は `registerResource` メソッドで行います。1 つ目の引数にはリソースの名前を、2 つ目の引数にはリソースの URI を指定します。MCP Apps の仕様では、リソースの URI は `ui://` で始まる必要があります。URI は後からツールと紐づけるために使用するため、変数 `DASHBOARD_RESOURCE_URI` に格納しておきます。3 つ目の引数にはリソースのメタ情報を指定します。MIME タイプに何を指定すべきかは MCP Apps の仕様で決まっており、`MCP_APP_MIME_TYPE` という定数が用意されているのでそれを使用します。この MIME タイプは `"text/html;profile=mcp-app"` という値です。4 つ目の引数にはリソースの内容を返す関数を指定します。ここでは `createDashboardHtml` 関数で HTML を生成して返しています。HTML の詳細は後ほど説明します。

```ts
server.registerResource(
  "dashboard-app",
  DASHBOARD_RESOURCE_URI,
  {
    description: "MCP Appsホストが描画するインタラクティブなダッシュボード。",
    mimeType: MCP_APP_MIME_TYPE,
  },
  async () => ({
    contents: [
      {
        uri: DASHBOARD_RESOURCE_URI,
        mimeType: MCP_APP_MIME_TYPE,
        text: createDashboardHtml(),
      },
    ],
  }),
);
```

ツールの登録は `registerTool` メソッドで行います。ポイントは `._meta.ui.resourceUri` で先ほど登録したリソースの URI を指定することです。これにより、MCP Apps に対応しているホストはツールの結果をサンドボックス化された iframe 内でレンダリングすることができます。MCP Apps に対応していないホストの場合は、通常通りツールの結果をプレーンテキストとして返します。`_meta.ui.visibility` でツールの可視性を指定することができます。`"model"` は LLM から呼び出せるツールであることを意味し、これは通常のツールと同じです。`"app"` は MCP Apps でレンダリングされた UI 内の JavaScript から呼び出せるツールであることを意味します。`_meta.ui.visibility` を省略した場合のデフォルトは `["model", "app"]` です。

MCP Apps では UI のインタラクティブな操作を実現するために、ユーザーがボタンを押したり、フォームに入力したりすることで、iframe 内の JavaScript から MCP サーバーのツールを呼び出すことができます。この例では、ダッシュボードのデータを更新するための App 専用ツール `refreshDashboardData` を実装しています。`refreshDashboardData` のようなツールは UI 上から呼び出されることに意義があるツールであり、このようなツールが LLM から見えてしまうとツールの一覧でコンテキストが肥大化してしまったり、`showDashboard` と `refreshDashboardData` どちらを呼び出せばいいのか LLM が迷ってしまう可能性があります。そのため、`refreshDashboardData` の `_meta.ui.visibility` は `"app"` のみに設定しているのです。なお、visibility はあくまでサーバーが宣言するヒントであり、どの値を指定しても `tools/list` はすべてのツールをクライアントに返します（絞り込みはクライアント側で行います）。そのため visibility 自体はアクセス制御にはならず、実際にツールの呼び出しを制限するのは後述するホスト側のブリッジにおける許可リストです。

```ts
server.registerTool(
  "showDashboard",
  {
    title: "ダッシュボードを表示",
    description:
      "指定したトピックのインタラクティブなダッシュボードを表示する。",
    inputSchema: {
      topic: z
        .string()
        .describe("表示するダッシュボードのトピック（例: usage, weather）"),
    },
    _meta: {
      ui: {
        resourceUri: DASHBOARD_RESOURCE_URI,
        // visibility: ["model", "app"] とすることで、モデルからもアプリからも見えるツールになる。
        visibility: ["model", "app"],
      },
    },
  },
  async ({ topic }) => ({
    content: [
      {
        type: "text" as const,
        text: `"${topic}" のダッシュボードを表示しました。`,
      },
    ],
    // ツールが返した値はリソースの UI から参照することができる。ここでは例としてダッシュボードのカード情報を返す。
    structuredContent: {
      topic,
      cards: [
        { label: "リクエスト数", value: 128 },
        { label: "レイテンシ", value: "42ms" },
        { label: "状態", value: "正常" },
      ],
    },
    _meta: { ui: { resourceUri: DASHBOARD_RESOURCE_URI } },
  }),
);

server.registerTool(
  "refreshDashboardData",
  {
    title: "ダッシュボードデータを更新",
    description:
      "ダッシュボードの表示データを更新する。モデル向けではなくApp専用。",
    inputSchema: { reason: z.string().optional() },
    _meta: {
      ui: { resourceUri: DASHBOARD_RESOURCE_URI, visibility: ["app"] },
    },
  },
  async ({ reason }) => ({
    content: [
      {
        type: "text" as const,
        text: `ダッシュボードのデータを更新しました${reason ? `（理由: ${reason}）` : ""}。`,
      },
    ],
    structuredContent: {
      refreshedAt: new Date().toISOString(),
      cards: [
        { label: "リクエスト数", value: 143 },
        { label: "レイテンシ", value: "39ms" },
        { label: "状態", value: "正常" },
      ],
    },
  }),
);
```

最後に Next.js の API ルートで MCP サーバーを公開します。`WebStandardStreamableHTTPServerTransport` は Web 標準の Request/Response を使って MCP サーバーと通信するトランスポートです。

```ts
// Next.js の API ルートで MCP サーバーを公開する
async function requestHandler(req: Request) {
  if (req.method === "GET" || req.method === "DELETE") {
    return Response.json(
      {
        jsonrpc: "2.0",
        error: { code: -32000, message: "Method not allowed." },
        id: null,
      },
      { status: 405 },
    );
  }

  const server = createServer();
  // WebStandardStreamableHTTPServerTransport は Web 標準の Request/Response を使って MCP サーバーと通信するトランスポート。
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);
  return transport.handleRequest(req);
}

// GET, POST, DELETE の各メソッドで同じ requestHandler を使用する。
export {
  requestHandler as DELETE,
  requestHandler as GET,
  requestHandler as POST,
};
```

#### MCP Apps の HTML を作成する

`createDashboardHtml` 関数では、MCP Apps のサンドボックスでレンダリングする HTML を返す必要があります。ここでは HTML を直接書いていますが、実際には React や Vue などのフレームワークを使ってビルド後の HTML を返すといった手段を取るのが一般的でしょう。

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
        body { margin: 0; padding: 16px; font-family: system-ui, sans-serif; }
        .card { border: 1px solid #d4d4d4; border-radius: 12px; padding: 16px; background: #fafafa; }
        .grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 16px 0; }
        .metric { border: 1px solid #d4d4d4; border-radius: 8px; padding: 10px; background: #fff; }
        .label { color: #525252; font-size: 12px; }
        .value { margin-top: 4px; font-size: 18px; font-weight: 600; }
        button { border: 1px solid #d4d4d4; border-radius: 8px; padding: 8px 12px; background: #fff; cursor: pointer; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1 style="margin:0;font-size:20px;">ダッシュボード</h1>
      <div class="grid" id="cards">
        <!-- 値はツールの結果から上書きされる -->
        <div class="metric"><div class="label">リクエスト数</div><div class="value">—</div></div>
        <div class="metric"><div class="label">レイテンシ</div><div class="value">—</div></div>
        <div class="metric"><div class="label">状態</div><div class="value">—</div></div>
      </div>
      <button id="refresh">更新する</button>
      <p style="color:#525252;font-size:12px;" id="status">ホストに接続中...</p>
    </main>

    <!-- スクリプト部分は後述 -->
    <script>
    </script>
  </body>
</html>
```

MCP Apps では HTML のフラグメントを返すのではなく、HTML ドキュメント全体を返す必要があります。`iframe` のレンダリングでは `srcdoc` 属性を使用するため、スタイルは `style` タグ内に、スクリプトは `script` タグ内にインラインで記述します。後述するデフォルトの CSP では読み込み元が `'self'` とインラインに制限されるため、基本的にはインラインで記述することになります。なお、リソースの `_meta.ui.csp` で許可するオリジンを指定すれば、外部のスクリプトやリソースを読み込むことも可能です。

ダッシュボードはカード形式で「リクエスト数」「レイテンシ」「状態」を表示するようにしています。UI からはリソースに紐づけられたツール（`showDashboard`）の結果を参照することができるため、ツールの結果を受け取ったらカードの値を更新するようにします。また、ボタンを押すと `refreshDashboardData` を呼び出してダッシュボードのデータを更新するようにします。

スクリプト部分の実装も見ていきましょう。はじめにホストと通信するヘルパー関数 `sendRequest` と `sendNotification` を定義します。MCP Apps では JSON-RPC 2.0 の仕様に従って iframe の [`postMessage`](https://developer.mozilla.org/ja/docs/Web/API/Window/postMessage) 関数を使用してホストと通信します。`sendRequest` は `id` を指定して、レスポンスがあることを期待するリクエストを送信する関数です。`sendNotification` は `id` を指定せず、レスポンスが返ってこない通知を送信する関数です。

```js
const cards = document.getElementById("cards");
const status = document.getElementById("status");
let nextId = 1;
const pendingRequests = new Map();

// iframeとホスト(親ウィンドウ)は postMessage で JSON-RPC 風のやり取りをする。
function sendRequest(method, params) {
  const id = nextId++;
  pendingRequests.set(id, method);
  window.parent.postMessage({ jsonrpc: "2.0", id, method, params }, "*");
}
function sendNotification(method, params) {
  window.parent.postMessage({ jsonrpc: "2.0", method, params }, "*");
}
```

初期化処理ではハンドシェイクのために `ui/initialize` リクエストを送信します。このメソッドは UI がどのような機能をサポートしているかをホストに通知します。

```js
sendRequest("ui/initialize", {
  protocolVersion: "2026-01-26",
  appCapabilities: { availableDisplayModes: ["inline", "fullscreen"] },
  appInfo: { name: "ai-sdk-mcp-apps-example", version: "1.0.0" },
});
```

メッセージの受信は `window.addEventListener("message", ...)` で行います。`postMessage` でのやり取りでは複数のリクエストが同時に進行し得るうえ、レスポンスと通知が同じチャンネルに流れてくるため、`id` を使った `Map` でどのリクエストに対するレスポンスかを対応付ける必要があったのです。

```js
window.addEventListener("message", (event) => {
  const message = event.data;
  // JSON-RPC 2.0 の仕様に従っているかを確認する
  if (!message || message.jsonrpc !== "2.0") return;

  // 自分が送ったリクエストへの応答
  if (message.id != null && pendingRequests.has(message.id)) {
    const method = pendingRequests.get(message.id);
    pendingRequests.delete(message.id);
    if (method === "ui/initialize") {
      status.textContent = "ホストに接続しました。";
      sendNotification("ui/notifications/initialized");
    } else if (method === "tools/call") {
      status.textContent = "ツールで更新しました。";
      renderCards(message.result);
    }
    return;
  }

  // ホストから一方的にプッシュされる通知
  // ツール呼び出しの結果（`structuredContent`）が返ってくる
  if (message.method === "ui/notifications/tool-result") {
    renderCards(message.params);
  }
});
```

`message.id` がある場合は自分が送ったリクエストへの応答です。`message.id` を使って `pendingRequests` からどのリクエストへの応答かを判定します。その後 `message.method` を使ってどのリクエストへの応答かを判定します。`ui/initialize` はホストとの接続が確立したことを意味し、ハンドシェイク処理の完了のため `ui/notifications/initialized` を返す必要があります。`ui/initialize` の結果としてホストからは、テーマ（ライトモードかダークモード）などの情報を含む `hostContext` や、ホストがどの機能に対応しているかを表す `hostCapabilities` が返ってくるのですが、ここでは利用を省略しています。`tools/call` はツールを呼び出した結果が返ってきたことを意味します。ツールの結果は `message.result` に格納されており、`renderCards` 関数でカードの値を更新します。

ホストから一方的にプッシュされる通知には `"ui/notifications/tool-result"` があります。このメソッドはツールの呼び出しの結果が含まれているので、この値を使用して `renderCards` 関数でカードの値を更新します。

`renderCards` 関数では、ツールの結果の `structuredContent` を参照してカードの値を更新します。

```js
function renderCards(result) {
  const nextCards = result && result.structuredContent && result.structuredContent.cards;
  if (!Array.isArray(nextCards)) return;

  cards.textContent = ""; // 既存のカードを全部消す
  for (const card of nextCards) {
    const metric = document.createElement("div");
    metric.className = "metric";
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = String(card.label);
    const value = document.createElement("div");
    value.className = "value";
    value.textContent = String(card.value);
    metric.append(label, value);
    cards.append(metric);
  }
}
```

`refresh` ボタンのクリックイベントでは、`refreshDashboardData` ツールを呼び出すために `tools/call` リクエストを送信します。

```js
  document.getElementById("refresh").addEventListener("click", () => {
    sendRequest("tools/call", {
      name: "refreshDashboardData",
      arguments: { reason: "ユーザーがiframe内で更新ボタンを押した" },
    });
  });
```

### サンドボックスを構築する

MCP Apps が返す HTML は信頼できないコンテンツであるため、そのままチャット画面に埋め込むことはできません。MCP Apps の仕様では二重の iframe を使用してサンドボックス化を行うことが MUST とされています。ここではチャット画面であるホストの配下に、サンドボックスプロキシの iframe と、MCP サーバーから返ってくる HTML をレンダリングするアプリの iframe の 2 つを入れ子にすることでサンドボックス化を行います。

![](https://images.ctfassets.net/in6v9lxmm5c8/2wmPfh7wXm9nY8K9I67KbH/a19d9a4170577377254e1920ef0cc434/image.png)

`src/app/api/mcp/sandbox/route.ts` にサンドボックス用の HTML を返す API を実装します。Next.js の API ルートで GET リクエストを受け取ったら `Response` で HTML を返すようにします。この HTML は `iframe` の `src` 属性で指定される想定です。

:::warning
MCP Apps の仕様ではホストとサンドボックスの iframe は別のオリジンである必要（MUST）が明記されています。ここでは実装を単純化するために同一オリジンで実装していますが、実際のアプリケーションでは別オリジンで iframe を配信する必要があります。オリジンはスキーム・ホスト・ポートの組であるため、別ドメインのほか別ポートで配信する形でも構いません。
:::

```ts:app/api/mcp/sandbox/route.ts
const sandboxProxyHtml = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body, iframe {
        width: 100%;
        height: 100%;
        margin: 0;
        border: 0;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script>
      let appFrame;

      function isJsonRpc(value) {
        return value && value.jsonrpc === '2.0';
      }

      function injectCSP(html, csp) {
        if (!csp) return html;
        const meta = '<meta http-equiv="Content-Security-Policy" content="' +
          csp.replaceAll('"', '&quot;') + '">';
        return html.includes('<head>')
          ? html.replace('<head>', '<head>' + meta)
          : meta + html;
      }

      function createAppFrame(params) {
        appFrame?.remove();
        appFrame = document.createElement('iframe');
        appFrame.sandbox = params.sandbox || 'allow-scripts allow-forms';
        if (params.allow) {
          appFrame.allow = params.allow;
        }
        appFrame.srcdoc = injectCSP(params.html, params.csp);
        document.body.appendChild(appFrame);
      }

      window.addEventListener('message', event => {
        const data = event.data;

        // ui/notifications/sandbox-resource-ready を受け取ったら createAppFrame を実行して
        // MCP Apps の HTML をレンダリングする iframe を作成する。
        if (
          isJsonRpc(data) &&
          data.method === 'ui/notifications/sandbox-resource-ready' &&
          event.source === window.parent
        ) {
          createAppFrame(data.params || {});
          return;
        }

        if (isJsonRpc(data) && appFrame && event.source === window.parent) {
          appFrame.contentWindow.postMessage(data, '*');
        } else if (isJsonRpc(data) && event.source === appFrame?.contentWindow) {
          window.parent.postMessage(data, '*');
        }
      });

      window.parent.postMessage({
        jsonrpc: '2.0',
        method: 'ui/notifications/sandbox-proxy-ready'
      }, '*');
    </script>
  </body>
</html>`;

export function GET() {
  return new Response(sandboxProxyHtml, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
```

サンドボックスの詳しい実装も見ていきましょう。HTML の大部分は CSS で iframe を全画面表示するためのスタイルと、iframe のサンドボックス化を行うためのスクリプトで構成されています。ハンドシェイク処理では JSON-RPC 2.0 の仕様に従って、`ui/notifications/sandbox-proxy-ready` 通知をホストに送信します。ホストとのやり取りは `postMessage` 関数を使用しています。

```js
window.parent.postMessage({
  jsonrpc: '2.0',
  method: 'ui/notifications/sandbox-proxy-ready'
}, '*');
```

ホストは `ui/notifications/sandbox-proxy-ready` を受信したら、`ui/notifications/sandbox-resource-ready` 通知をサンドボックスに送信します。サンドボックスはこの通知を受信したら、`createAppFrame` 関数で MCP Apps の HTML をレンダリングする iframe を作成します。

```js
// 簡単にするために、JSON-RPC 2.0 の仕様に従っているかを判定する関数
function isJsonRpc(value) {
  return value && value.jsonrpc === '2.0';
}

// sandbox-resource-readyを受け取ったら createAppFrame を実行
if (
  isJsonRpc(data) &&
  data.method === 'ui/notifications/sandbox-resource-ready' &&
  event.source === window.parent
) {
  createAppFrame(data.params || {});
  return;
}
```

ここでは `event.source === window.parent` でメッセージの送信元が親ウィンドウ（ホスト）であることを確認しています。このチェックがなければ信頼できない iframe が、自分から見た親であるサンドボックスプロキシに向かって `window.parent.postMessage({method: 'ui/notifications/sandbox-resource-ready', params: {sandbox: 'allow-scripts allow-same-origin', html: '...'}}, '*')` のようなメッセージを送りつけ、`createAppFrame` を呼ばせて自分自身を `allow-same-origin` 付きで再生成させる、という攻撃が成立してしまいます。

`createAppFrame` 関数は、`sandbox` 属性と `srcdoc` 属性を指定して iframe を作成します。この iframe の `sandbox` 属性と `allow` 属性はホストが `ui/notifications/sandbox-resource-ready` 通知で指定した値を使用します。実際には AI SDK 内部のデフォルト値である `'allow-scripts allow-forms'`（内部定数 `MCP_APP_DEFAULT_INNER_SANDBOX`）が指定されることがほとんどでしょう。`allow` 属性はカメラ・マイク・位置情報などの Permissions Policy を制御するものです。

```js
function createAppFrame(params) {
  appFrame?.remove();
  appFrame = document.createElement('iframe');
  appFrame.sandbox = params.sandbox || 'allow-scripts allow-forms';
  if (params.allow) {
    appFrame.allow = params.allow;
  }
  appFrame.srcdoc = injectCSP(params.html, params.csp);
  document.body.appendChild(appFrame);
}
```

`srcdoc` 属性には MCP Apps の HTML を指定します。MCP Apps の HTML は `ui/notifications/sandbox-resource-ready` 通知の `params.html` に格納されているので、それを使用します。`injectCSP` 関数は Content Security Policy を `<meta>` タグとして HTML に埋め込むための関数です。CSP の元になるのは `ui://` リソースの `_meta.ui.csp` で、これは CSP 文字列そのものではなく `{ connectDomains: [...], resourceDomains: [...] }` という許可オリジンのリストを持つオブジェクトです。ホストがこのオブジェクトから CSP 文字列を組み立てて、`sandbox-resource-ready` 通知の `params.csp` として渡します。CSP が指定されていない場合、仕様で定義されている以下のデフォルトの CSP が適用されます。

```js
const RESTRICTIVE_DEFAULT_CSP = "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' data:; connect-src 'none';";

function injectCSP(html, csp) {
  const cspValue = csp || RESTRICTIVE_DEFAULT_CSP;
  const meta = '<meta http-equiv="Content-Security-Policy" content="' +
    cspValue.replaceAll('"', '&quot;') + '">';
  return html.includes('<head>')
    ? html.replace('<head>', '<head>' + meta)
    : meta + html;
}
```

最後に `window.addEventListener('message', event => { ... })` でホストと MCP Apps の iframe との間のメッセージを中継します。`sandbox-proxy-ready`, `sandbox-resource-ready` のメッセージのみ特別扱いし、それ以外のメッセージは `event.source` を使って送信元を判定し、そのまま中継します。

```js
window.addEventListener('message', event => {
  const data = event.data;

  // sandbox-resource-ready を受け取ったら createAppFrame を実行する処理
  // ...

  if (isJsonRpc(data) && appFrame && event.source === window.parent) {
    appFrame.contentWindow.postMessage(data, '*');
  } else if (isJsonRpc(data) && event.source === appFrame?.contentWindow) {
    window.parent.postMessage(data, '*');
  }
}
```

### MCP Client の作成

作成した MCP サーバーの URL を指定して MCP Client を作成します。MCP Client はチャット API と iframe とホストのブリッジの 2 箇所から呼び出されるため、`src/lib/mcp-client.ts` に共通の MCP Client を作成します。

```ts:src/lib/mcp-client.ts
import { createMCPClient, mcpAppClientCapabilities } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export function createLocalMCPAppsClient(origin: string) {
  return createMCPClient({
    transport: new StreamableHTTPClientTransport(
      new URL("/api/mcp/server", origin),
    ),
    clientName: "ai-sdk-mcp-apps-example",
    capabilities: mcpAppClientCapabilities,
  });
}
```

`StreamableHTTPClientTransport` のコンストラクタに MCP サーバーの URL を指定することで、MCP Client は MCP サーバーと通信できるようになります。ここでのポイントは、`capabilities` に `mcpAppClientCapabilities` を指定することです。中身は `{ extensions: { "io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] } } }` という値で、MCP Client が MCP Apps に対応していることを示しています。

### AI SDK を使用したチャット API の実装

`src/app/api/chat/route.ts` にチャット API を実装します。ここでは、LLM からのレスポンスをストリーミングで返すために `streamText` を使用するところは通常の AI SDK によるチャット API の実装と同じです。

```ts:app/api/chat/route.ts
import { openai } from "@ai-sdk/openai";
import { splitMCPAppTools } from "@ai-sdk/mcp";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai";
import { createLocalMCPAppsClient } from "@/lib/mcp-client";

export const maxDuration = 30;

export async function POST(req: Request) {
  const requestUrl = new URL(req.url);
  const { messages }: { messages: UIMessage[] } = await req.json();

  const client = await createLocalMCPAppsClient(requestUrl.origin);

  try {
    // MCPサーバーからツール一覧を取得し、モデルに見せてよいものだけを絞り込む。
    // visibility: ["app"] のツールはここで除外される
    const { modelVisible } = splitMCPAppTools(await client.listTools());
    const tools = client.toolsFromDefinitions(modelVisible);

    const result = streamText({
      model: openai("gpt-5-nano"),
      system: "あなたは親切で簡潔な日本語アシスタントです。",
      tools,
      stopWhen: isStepCount(5),
      messages: await convertToModelMessages(messages),
      onEnd: async () => {
        await client.close();
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream }),
    });
  } catch (error) {
    await client.close();
    throw error;
  }
}
```

先ほど作成した MCP Client を使用して MCP サーバーからツール一覧を取得しています。ポイントは `splitMCPAppTools` を使用して、モデルに見せてよいツールだけを絞り込むことです。これにより、`visibility: ["app"]` のツールは `streamText` に渡されるツール一覧から除外されます。

また、`stopWhen: isStepCount(5)` を指定している点もポイントです。デフォルトでは 1 ステップで生成が停止するため、ツールを呼び出した後にモデルが続きのテキストを生成しません。`stopWhen` を指定することで、ツール呼び出しの結果を踏まえた応答テキストまで生成されるようになります。なお、AI SDK v7 では `streamText` の `onFinish` コールバックは非推奨となり、`onEnd` に置き換えられています。

### iframe とホストのブリッジ

iframe の JavaScript からの MCP サーバーのツールの呼び出しやリソースの読み取り（`tools/call` や `resources/read`）は、セキュリティ上の理由から iframe から直接 MCP サーバーにリクエストを送信することはできません。iframe からのリクエストはホストに中継してもらう必要があります。ここではエンドポイント `app/api/mcp/host/route.ts` にホストのブリッジを実装します。AI SDK のヘルパー関数をいくつか使用して、安全にツールの呼び出しを中継できるようにしています。

```ts:app/api/mcp/host/route.ts
import { readMCPAppResource, splitMCPAppTools } from "@ai-sdk/mcp";
import { isJSONObject, type JSONObject } from "@ai-sdk/provider";
import { safeParseJSON } from "@ai-sdk/provider-utils";
import { createLocalMCPAppsClient } from "@/lib/mcp-client";

export async function POST(req: Request) {
  const requestUrl = new URL(req.url);
  const bodyResult = await safeParseJSON({ text: await req.text() });

  if (!bodyResult.success) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body = isJSONObject(bodyResult.value) ? bodyResult.value : undefined;
  const method = body?.method;
  const params = isJSONObject(body?.params) ? body.params : undefined;

  if (typeof method !== "string") {
    return Response.json({ error: "Missing method" }, { status: 400 });
  }

  const client = await createLocalMCPAppsClient(requestUrl.origin);

  try {
    switch (method) {
      // ui:// リソース(HTML本体)の取得。
      case "mcp-apps/read-resource": {
        if (typeof params?.uri !== "string") {
          return Response.json({ error: "Missing uri" }, { status: 400 });
        }
        return Response.json(
          await readMCPAppResource({ client, uri: params.uri }),
        );
      }

      case "resources/read": {
        if (typeof params?.uri !== "string") {
          return Response.json({ error: "Missing uri" }, { status: 400 });
        }
        return Response.json(await client.readResource({ uri: params.uri }));
      }

      // iframe内のJavaScriptからの「ツールを呼びたい」というリクエスト。
      // App向けに公開されたツール(visibility: ["app"]) だけを許可し、それ以外は拒否する。
      case "tools/call": {
        if (typeof params?.name !== "string") {
          return Response.json({ error: "Missing tool name" }, { status: 400 });
        }

        const { appVisible } = splitMCPAppTools(await client.listTools());
        const isAllowed = appVisible.tools.some(
          (tool) => tool.name === params.name,
        );

        if (!isAllowed) {
          return Response.json(
            { error: "Tool is not app-visible" },
            { status: 403 },
          );
        }

        const toolArguments: JSONObject = isJSONObject(params.arguments)
          ? params.arguments
          : {};

        return Response.json(
          await client.callTool({
            name: params.name,
            arguments: toolArguments,
          }),
        );
      }

      default:
        return Response.json({ error: "Unsupported method" }, { status: 400 });
    }
  } finally {
    await client.close();
  }
}
```

はじめにリクエストボディの JSON をパースして、`method` と `params` を取得します。ここでは `req.json()` を使用せずに `req.text()` で文字列を取得してから `safeParseJSON` を使用して JSON をパースするという手順を踏んでいます。

```ts
const bodyResult = await safeParseJSON({ text: await req.text() });

if (!bodyResult.success) {
  return Response.json({ error: "Invalid JSON" }, { status: 400 });
}
```

`safeParseJSON` は JSON のパースに失敗した場合に例外を投げずに Result 型を返すヘルパー関数です。

```ts
type ParseResult<T> =
  | { success: true; value: T; rawValue: unknown }
  | { success: false; error: JSONParseError | TypeValidationError; rawValue: unknown };
```

さらに `isJSONObject` を使用して、パースした値が JSON オブジェクトであるかを判定したうえで、`method` が存在し文字列であるかどうかを検証しています。

```ts
const body = isJSONObject(bodyResult.value) ? bodyResult.value : undefined;
const method = body?.method;
const params = isJSONObject(body?.params) ? body.params : undefined;

if (typeof method !== "string") {
  return Response.json({ error: "Missing method" }, { status: 400 });
}
```

検証が完了したら、`method` に応じて処理を分岐します。はじめに先ほど作成した MCP Client を使用して MCP サーバーに接続しておきます。

```ts
const client = await createLocalMCPAppsClient(requestUrl.origin);
```

`mcp-apps/read-resource` はツールに紐付けられた `ui://` リソースを取得するためのメソッドです。リソースは URI で指定されます。なお、`tools/call` や `resources/read` は MCP の仕様に由来するメソッド名ですが、`mcp-apps/read-resource` とこのブリッジ API 自体はこのアプリケーションが独自に定義した内部 API であり、MCP Apps の仕様で定められたものではありません。リソースの読み取りは AI SDK の `readMCPAppResource` を使用して行います。`readMCPAppResource` は `ui://` で始まっているか、MIME タイプが `text/html;profile=mcp-app` かを検証し、デコードして `{ uri, mimeType, html, meta }` という統一された形に正規化してくれます。

```ts
try {
  switch (method) {
    // ui:// リソース(HTML本体)の取得
    case "mcp-apps/read-resource": {
      if (typeof params?.uri !== "string") {
        return Response.json({ error: "Missing uri" }, { status: 400 });
      }
      return Response.json(
        await readMCPAppResource({ client, uri: params.uri }),
      );
    }
```

`resources/read` は通常のリソースの読み取りです。`readMCPAppResource` とは異なり、`ui://` リソースかどうかの検証は行われません。

```ts
case "resources/read": {
  if (typeof params?.uri !== "string") {
    return Response.json({ error: "Missing uri" }, { status: 400 });
  }
  return Response.json(await client.readResource({ uri: params.uri }));
}
```

ツールの呼び出しである `tools/call` は、iframe 内の JavaScript からの「ツールを呼びたい」というリクエストです。ここでは MCP サーバーに登録されているツールのうち、`visibility: ["app"]` のツールだけを許可し、それ以外は拒否するようにしています。この処理がセキュリティ上重要な境界です。チャット API の場合と同様に `splitMCPAppTools` を使用して、App 向けに公開されたツールだけを絞り込んでいます。

```ts
case "tools/call": {
  if (typeof params?.name !== "string") {
    return Response.json({ error: "Missing tool name" }, { status: 400 });
  }

  const { appVisible } = splitMCPAppTools(await client.listTools());
  const isAllowed = appVisible.tools.some(
    (tool) => tool.name === params.name,
  );

  if (!isAllowed) {
    return Response.json(
      { error: "Tool is not app-visible" },
      { status: 403 },
    );
  }

  const toolArguments: JSONObject = isJSONObject(params.arguments)
    ? params.arguments
    : {};

  return Response.json(
    await client.callTool({
      name: params.name,
      arguments: toolArguments,
    }),
  );
}
```

### React アプリケーションで MCP Apps をレンダリングする

最後にフロントエンドのチャット UI を実装します。チャット API とのやり取りは AI SDK の `useChat` を使用して実装します。ユーザーの入力を `useState` で管理し、送信ボタンが押されたら `sendMessage` を呼び出してチャット API にリクエストを送信します。レスポンスはストリーミングで返ってくるため、`messages` の配列に順次追加されていきます。

```tsx:app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";  
import { DefaultChatTransport, isToolUIPart } from "ai";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-1 flex-col px-4 py-8">
        <div className="flex-1 space-y-4 overflow-y-auto pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.role === "user"
                  ? "ml-auto max-w-[80%] rounded-2xl bg-blue-600 px-4 py-2 text-white"
                  : "mr-auto w-full space-y-2"
              }
            >
              {/* text のレスポンスの場合は通常通りレスポンスをレンダリングする */}
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <span
                      key={i}
                      className={
                        message.role === "assistant"
                          ? "block max-w-[80%] rounded-2xl bg-zinc-200 px-4 py-2 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                          : undefined
                      }
                    >
                      {part.text}
                    </span>
                  );
                }
                // ツール呼び出しのレスポンスは MCP Apps のレンダリング用のパーツとして返ってくるので、MCPAppRenderer でレンダリングする
                // <MCPAppTool> の実装は後ほど
                if (isToolUIPart(part)) {
                  return <MCPAppTool key={part.toolCallId} part={part} />;
                }
                return null;
              })}
            </div>
          ))}
          {isLoading && (
            <p className="mr-auto text-sm text-zinc-500 dark:text-zinc-400">
              考え中…
            </p>
          )}
          {error && (
            <p className="mr-auto max-w-[80%] rounded-2xl bg-red-100 px-4 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
              エラーが発生しました: {error.message}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-full border border-zinc-300 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            value={input}
            placeholder="メッセージを入力..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="rounded-full bg-blue-600 px-5 py-2 font-medium text-white disabled:opacity-50"
            disabled={isLoading || !input.trim()}
          >
            送信
          </button>
        </form>
      </main>
    </div>
  );
}
```

AI のレスポンスである `messages[].parts[].type` によって、通常のテキストレスポンスか、ツール呼び出しのレスポンスかを判定しています。ツール呼び出しのレスポンスは MCP Apps のレンダリング用のパーツとして返ってくるので、`MCPAppRenderer` でレンダリングします。

`MCPAppRenderer` を内部で使用する `MCPAppTool` コンポーネントの実装は以下の通りです。`MCPAppRenderer` は通常のツール呼び出しの場合は何もレンダリングせず、リソース `ui://` で始まる MCP Apps のリソースを返す場合にのみそのリソースをロードし、サンドボックスブリッジを作成してレンダリングします。ツールの入力や呼び出し結果を iframe 内に通知したり、iframe 内のツール呼び出しをハンドラを通じて転送する役割を担っています。

```tsx:app/page.tsx
"use client";

import {
  experimental_MCPAppRenderer as MCPAppRenderer,
  useChat,
  type MCPAppBridgeHandlers,
  type MCPAppMetadata,
  type MCPAppRendererProps,
  type MCPAppResource,
  type MCPAppSandboxConfig,
} from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart } from "ai";
import { useState } from "react";

const mcpAppSandbox = {
  // サンドボックスの iframe の URL。`src/mcp/sandbox/route.ts` で実装した API を指定する。
  url: "/api/mcp/sandbox",
  className: "block h-80 w-full overflow-hidden rounded-lg border",
} satisfies MCPAppSandboxConfig;

// ブリッジを fetch で呼び出すヘルパー関数
function callMCPAppHost(method: string, params: unknown) {
  return fetch("/api/mcp/host", {
    method: "POST",
    body: JSON.stringify({ method, params }),
  }).then((r) => r.json());
}

const mcpAppHandlers: MCPAppBridgeHandlers = {
  // ツールの呼び出しを許可リストにすることで、意図しないツールの呼び出しを防ぐ
  allowedTools: ["refreshDashboardData"],
  // iframe 内のツール呼び出しがあった場合、ブリッジに転送する
  callTool: (params) => callMCPAppHost("tools/call", params),
  readResource: (params) => callMCPAppHost("resources/read", params),
  // iframe 内のリンククリックがあった場合の処理
  openLink: ({ url }) => { window.open(url, "_blank", "noopener,noreferrer"); return {}; },
};

function MCPAppTool({ part }: { part: MCPAppRendererProps["part"] }) {
  return (
    <MCPAppRenderer
      part={part}
      loadResource={(app) => callMCPAppHost("mcp-apps/read-resource", { uri: app.resourceUri })}
      handlers={mcpAppHandlers}
      sandbox={mcpAppSandbox}
      fallback={<div>MCP Appを読み込み中...</div>}
    />
  );
}
```

`<MCPAppRenderer>` は `loadResource` でリソースをロードする関数を受け取ります。ここでは、`/api/mcp/host` にリクエストを送信して MCP サーバーの `readResource` を呼び出すようにしています。`handlers` にはブリッジのハンドラを指定します。ここでは、ツールの呼び出しやリソースの読み込み、リンククリックの処理を実装しています。`sandbox` にはサンドボックスの設定を指定します。サンドボックスの指定は必ず URL で指定する必要があります。ここでは先ほど作成した API ルート `/api/mcp/sandbox` を指定しています。

ここまでの実装が完了したら、実際にチャット UI からメッセージを送信して、MCP Apps のダッシュボードが表示されることを確認してみましょう。「ダッシュボードを見せてください」といったメッセージを送信すると、MCP サーバーの `showDashboard` ツールが呼び出され、ダッシュボードが表示されます。更新ボタンを押すと、`refreshDashboardData` ツールが呼び出され、ダッシュボードのデータが更新されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5HjQt78Gy0d8lq0blbk7Gn/8abc3563766507e1e925402e4fedc755/image.png)

## まとめ

- AI SDK v7 では MCP Apps 対応が追加され、`@ai-sdk/mcp` と `experimental_MCPAppRenderer` という 2 つのヘルパーを使うことで、ツールの結果をインタラクティブな UI としてレンダリングできるようになった
- MCP サーバー側では、`ui://` リソースを登録し、ツールの `_meta.ui.resourceUri` でリソースと紐付けることで、ホスト側にインタラクティブな UI をレンダリングさせることができる
- `_meta.ui.visibility` を `"app"` に設定することで、モデルからは呼び出せず iframe 内の JavaScript からのみ呼び出せる App 専用ツールを定義でき、モデルに渡すツール一覧の肥大化を防げる
- MCP Apps の仕様では信頼できない HTML をそのまま埋め込まないよう、ホストの配下にサンドボックスプロキシとアプリの 2 段の iframe を入れ子にするサンドボックス化が必須とされており、`postMessage` の送信元を `event.source` で検証することがセキュリティ上重要
- iframe 内の JavaScript から MCP サーバーへ直接リクエストすることはできないため、ホスト側にブリッジ API を用意し、App 向けに公開されたツールのみを許可する形で中継する必要がある
- AI SDK が提供するヘルパー（`splitMCPAppTools`、`readMCPAppResource`、`MCPAppRenderer` など）を使うことで、これらの実装をゼロから作るよりも比較的少ない手間で MCP Apps に対応したアプリケーションを構築できた

## 参考

- [AI SDK Core: MCP Apps](https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-apps)
- [AI SDK 7](https://vercel.com/blog/ai-sdk-7)
- [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview)
- [ai/examples/ai-e2e-next/app/chat/mcp-apps at main · vercel/ai](https://github.com/vercel/ai/tree/main/examples/ai-e2e-next/app/chat/mcp-apps)
