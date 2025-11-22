---
id: Wv8XRyDA7akzGsEdWBKgy
title: "MCP におけるインタラクティブな UI を標準化する拡張機能 MCP Apps の提案"
slug: "mcp-standard-ui-extension"
about: "MCP Apps は MCP の拡張機能として、AI エージェントがインタラクティブな UI コンポーネントを返すための標準化された方法を提供します。この記事では MCP Apps の概要と実装方法について解説します。"
createdAt: "2025-11-22T15:09+09:00"
updatedAt: "2025-11-22T15:09+09:00"
tags: ["MCP", "MCP Apps"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2L19vT7qxpRS3QWbhqjbW3/1f8cbccd422b1d8b8bf441695fc072e5/takeout-coffee_illust_3657.png"
  title: "takeout-coffee illust 3657"
audio: null
selfAssessment:
  quizzes:
    - question: "MCP Apps で UI リソースを宣言する際に使用する URI スキームは何ですか？"
      answers:
        - text: "mcp://"
          correct: false
          explanation: null
        - text: "http://"
          correct: false
          explanation: "http:// は一般的な Web リソースの URI スキームであり、MCP Apps の UI リソース宣言には使用しません。"
        - text: "app://"
          correct: false
          explanation: null
        - text: "ui://"
          correct: true
          explanation: "MCP Apps では `ui://` URI スキームを使用して UI リソースを宣言します。例えば `ui://charts/bar-chart` のように使用します。"
    - question: "MCP Apps で UI リソースをツールと関連付けるために使用するメタデータフィールドは何ですか？"
      answers:
        - text: "ui/resourceUri"
          correct: true
          explanation: "ツールのメタデータに `ui/resourceUri` フィールドを追加することで、UI リソースとツールを関連付けます。"
        - text: "ui/resource"
          correct: false
          explanation: "正しいフィールド名は `ui/resourceUri` です。"
        - text: "resourceUri"
          correct: false
          explanation: null
        - text: "ui/componentUri"
          correct: false
          explanation: null
    - question: "MCP Apps で UI コンポーネントのコンテンツタイプとして初期サポートされている MIME タイプは何ですか？"
      answers:
        - text: "text/html"
          correct: false
          explanation: "MCP Apps 固有の MIME タイプとして `text/html+mcp` が使用されます。"
        - text: "app/html"
          correct: false
          explanation: null
        - text: "text/html+mcp"
          correct: true
          explanation: "MCP Apps の初期仕様では HTML コンテンツ（`text/html+mcp`）のみに焦点を当てており、将来には他のコンテンツタイプもサポートできるように設計されています。"
        - text: "text/html+skybridge"
          correct: false
          explanation: "text/html+skybridge は ChatGPT の Apps SDK で使用される MIME タイプであり、MCP Apps では使用されません。"
published: true
---
ChatGPT の [Apps SDK](https://developers.openai.com/apps-sdk/) や [MCP-UI](https://mcpui.dev/) のように AI エージェントがチャット形式の対話だけでなく、インタラクティブな UI を通じてユーザーとやり取りできる仕組みが注目されています。AI エージェントが UI を返すことで、会話の流れの中で以下のような体験を提供できます。

- 「おすすめのランニングシューズを探して」と尋ねると、複数のシューズの画像と価格が表示され、ユーザーは気に入ったものをクリックしてカートに追加できる
- ホテルの予約を依頼すると、利用可能な部屋のリストが表示され、ユーザーは日付や人数を選択して予約手続きを進められる
- 希望にあった賃貸物件を探す際に、地図上に物件の位置が表示され、ユーザーは地図を操作して周辺環境を確認できる
- ユーザーが提示した図形を元に Figma 上でデザイン案を生成し、ユーザーは生成されたデザインを直接編集できる

![](https://images.ctfassets.net/kftzwdyauwt9/2vKwAh34bawGmCw0ozfjg/191c1d3488fb6f331f935830008ce021/Booking_16x9__3_.png?w=1920&q=90&fm=webp)

https://openai.com/ja-JP/index/introducing-apps-in-chatgpt/ より引用。

Apps SDK や MCP-UI はそれぞれ [Model Context Protocol (MCP)](https://modelcontextprotocol.dev/) を基盤としており、MCP の仕組みを拡張して任意の HTML, CSS, JavaScript を含む UI コンポーネントをエージェントが返せるようにしています。しかし、それぞれが独自に MCP を拡張しているため、異なるプラットフォーム間で互換性がなく、同じ UI コンポーネントを複数のエージェントで共有することが困難です。

そこで、MCP 自体にインタラクティブな UI コンポーネントを標準化して扱うための拡張機能 [MCP Apps](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/draft/apps.mdx) が提案されました。MCP Apps は `ui://` URI スキームを使用して UI [リソース](https://modelcontextprotocol.io/specification/2025-06-18/server/resources)を宣言し、メタデータを介して[ツール](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)と関連付けます。これにより MCP の標準的なクライアントとサーバー間の双方向通信を通じて、インタラクティブな UI コンポーネントを配信できるようになります。またセキュリティ上の理由から、MCP Apps ではサンドボックス化された iframe 内で UI コンポーネントを実行することが機能として定義されています。

この記事では、MCP Apps の概要について紹介し、[early access SDK](https://github.com/modelcontextprotocol/ext-apps) を使用して MCP Apps を実装する方法について解説します。

## MCP Apps の概要

MCP Apps は MCP の拡張機能として、エージェントがインタラクティブな UI コンポーネントを返すための標準化された方法を提供します。MCP Apps の主な特徴は以下の通りです。

- `ui://` URI スキームを使用して UI リソースを宣言
- メタデータを介してツールと関連付け
- JSON-RPC を使用したホストと UI コンポーネント間の双方向通信
- サンドボックス化された iframe 内で UI コンポーネントを実行

この仕様では HTML コンテンツ（`text/html+mcp`）のみに焦点を当てており、将来には他のコンテンツタイプもサポートできるように拡張性を考慮して設計されています。また MCP Apps はあくまで MCP の拡張機能であるため、MCP の既存機能に影響を与えることはありません。

### UI リソースの宣言

UI リソースは以下のような形式で宣言されます。

```json
{
  // 必ず ui:// スキームを使用する
  "uri": "ui://charts/bar-chart",
  // 人間が理解しやすい名前
  "name": "Bar Chart",
  // 初期の段階では text/html+mcp のみサポート
  // 将来の拡張のために mimeType フィールドを設けている
  "mimeType": "text/html+mcp",
  // UI リソースの説明（任意）
  "description": "A bar chart component for displaying data",
  // UI リソースのメタデータ
  "_meta": {
    "ui": {
      // Content Security Policy (CSP) の設定（任意）
      "csp": {
        // iframe 内で外部ドメインへの接続を許可
        "connect_domains": [],
        // 静的リソースの読み込みを許可
        "resource_domains": []
      }
    },
    // API キーの許可リストやクロスオリジン分離のためのドメインを指定
    "domain": "https://example.com",
    // UI コンポーネントがボーダーを表示するかどうか
    "prefersBorder": true
  }
}
```

UI リソースのコンテンツは `text` もしくは `blob`（base64 エンコード）として提供します。またコンテンツは有効な HTML5 ドキュメントである必要があります。以下は UI リソースのコンテンツ例です。

```json
{
  "contents": [
    {
      "uri": "ui://charts/bar-chart",
      "text": "<!DOCTYPE html><html>...</html>",
      "mimeType": "text/html+mcp"
    }
  ]
}
```

### ツールとの関連付け

UI リソースはツールと関連付けることによりホストに返却されます。ツールにリソースを関連付けるためには、ツールのメタデータに `ui/resourceUri` フィールドを追加します。以下はツールのメタデータ例です。

```json
{
  "name": "Get Weather Chart",
  "description": "Fetches weather data and displays it in a chart",
  "_meta": {
    "ui/resourceUri": "ui://charts/bar-chart"
  }
}
```

メタデータに `ui/resourceUri` フィールドが含まれており、かつホストが MCP Apps をサポートしている場合、ホストは指定された UI リソースを使用して結果をレンダリングします。ホストは UI リソースを取得するために `resources/read` リクエストを送信します。

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/read",
  "params": {
    "uri": "ui://charts/bar-chart"
  }
}
```

### ホストと iframe 間の双方向通信

MCP Apps ではホストと UI コンポーネント間の双方向通信のために JSON-RPC を使用します。UI コンポーネントは `window.parent.postMessage` を使用してホストにメッセージを送信し、ホストは `iframe.contentWindow.postMessage` を使用して UI コンポーネントにメッセージを送信します。概念的には Iframe は MCP クライアントとして動作し、ホストは MCP サーバーとして動作します。

```javascript
// UI コンポーネントからホストへのメッセージ送信
window.parent.postMessage(
  {
    jsonrpc: "2.0",
    method: "ui/initialize",
    params: {
      /* 初期化パラメータ */
    },
    id: 1,
  },
  "*",
);

window.addEventListener("message", (event) => {
  const message = event.data;
  // ホストからのメッセージを処理
  switch (message.method) {
    case "ui/initialize":
      // 初期化処理
      break;
    case "tools/call":
      // MCP ツールの呼び出しを処理
      break;
    // その他のメッセージ処理
  }
});
```

UI iframe は以下の MCP プロトコルメッセージのサブセットをサポートします。

- `tools/call`: ホストが MCP ツールを呼び出すためのリクエスト
- `resources/read`: リソースコンテンツを読み取るためのリクエスト
- `notifications/message`: ホストへのメッセージをロギングする
- `ui/initialize` → `ui/notifications/initialized`: MCP のようなハンドシェイク処理
- `ping`: ヘルスチェック

UI が `ui/initialize` リクエストをホストに送信すると、ホストは以下のように UI 固有の情報を含めたレスポンスを返します。

```typescript
interface HostContext {
  // UI から呼び出すことができるツールの情報
  toolInfo?: {
    id?: RequestId;
    tool: Tool;
  };
  // カラーテーマの設定
  theme?: "light" | "dark" | "system";
  // UI が現在どのように表示されているか
  displayMode?: "inline" | "fullscreen" | "pip" | "carousel";
  // ホストがサポートする表示モードの一覧
  availableDisplayModes?: string[];
  // UI の表示に関する追加情報
  viewport?: {
    width: number;
    height: number;
    maxHeight?: number;
    maxWidth?: number;
  };
  // ユーザーの言語設定 e.g. "ja-JP", "en-US"
  locale?: string;
  // ユーザーのタイムゾーン設定 e.g. "Asia/Tokyo", "America/New_York"
  timeZone?: string;
  userAgent?: string;
  // レスポンシブデザインのためのデバイス情報
  platform?: "web" | "desktop" | "mobile";
  // タッチなどのデバイス機能をサポートしているかどうか
  deviceCapabilities?: {
    touch?: boolean;
    hover?: boolean;
  };
  // セーフエリアのインセット情報（モバイルデバイス向け）
  safeAreaInsets?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
```

以下のような MCP Apps 固有のメッセージも定義されています。

- `ui/open-link`: ホストに外部リンクを開くよう指示
- `ui/message`: ホストのチャット UI にメッセージを表示
- `ui/notifications/tool-input`: iframe の初期化リクエストが完了したら、ホストはツールの引数とともにこの通知を送信
- `ui/notifications/tool-input-partial`: ツールの引数が部分的に更新された場合にホストが送信
- `ui/tool-result`: ツールの実行結果を iframe に送信。ホストはツールの実行が完了したタイミングで UI に結果を送信する
- `ui/tool-cancelled`: ツールの実行がキャンセルされた場合にホストが送信
- `ui/resource-teardown`: ホストが UI リソースを破棄される前に通知する
- `ui/size-change`: 表示サイズが変更された場合に UI がホストに通知
- `ui/host-context-change`: ホストコンテキストが変更された場合にホストが UI に通知
- `ui/sandbox-ready`: ホストが iframe のサンドボックス環境が準備できたことを通知
- `ui/sandbox-resource-ready`: ホストが iframe のサンドボックス環境でリソースが利用可能になったことを通知

## MCP Apps を使ってみる

MCP Apps を構築するための SDK（`@modelcontextprotocol/ext-apps`）を使用して MCP Apps を実際に実装してみましょう。`@modelcontextprotocol/ext-apps` パッケージはまだ `npm` に公開されていないため、GitHub から直接インストールします。

```bash
npm install git+https://github.com/modelcontextprotocol/ext-apps.git
```

その他 MCP サーバーと UI リソースを実装するために必要なパッケージもインストールします。

```bash
npm install @modelcontextprotocol/sdk react react-dom express cors zod@3
npm install -D typescript ts-node @types/node @types/express @types/react @types/react-dom @vitejs/plugin-react vite vite-plugin-singlefile tsx
```

この例では React と Vite を使用して UI コンポーネントを実装します。UI コンポーネントをビルドするために `vite.config.ts` ファイルを作成します。

```ts:vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "path";

const entry = process.env.VITE_ENTRY || "ui-react";

export default defineConfig({
  // viteSingleFile プラグインを使用して単一ファイルにバンドル
  plugins: [react(), viteSingleFile()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, `${entry}.html`),
    },
    outDir: `dist`,
    emptyOutDir: false,
  },
});
```

UI コンポーネントのエントリーポイントとなる `ui-react.html` ファイルを作成します。

```html:ui-react.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MCP UI Client (React)</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/ui-react.tsx"></script>
</body>
</html>
```

`tsconfig.json` ファイルを作成します。

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

ビルドスクリプトを `package.json` に追加します。

```json:package.json
{
  "scripts": {
    "dev": "vite",
    "build": "rm -rf dist && VITE_ENTRY=ui-react vite build",
    "preview": "vite preview",
    "server": "tsx server.ts",
    "start": "npm run build && npm run server"
  },
}
```

### UI コンポーネントの実装

`src/ui-react.tsx` ファイルを作成し、MCP Apps SDK を使用して UI コンポーネントを実装しましょう。UI の初期化処理は `useApp` フックを使用して行います。

```tsx:src/ui-react.tsx
import { useState } from "react";
import {
  useApp,
  McpUiSizeChangeNotificationSchema,
  McpUiToolResultNotificationSchema,
} from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function UiReact() {
  const [toolResults, setToolResults] = useState<CallToolResult[]>([]);
  const { app, isConnected, error } = useApp({
    appInfo: {
      name: "ui-react",
      version: "0.1.0",
    },
    capabilities: {},
    onAppCreated: (app) => {
      app.setNotificationHandler(
        McpUiToolResultNotificationSchema,
        async (notification) => {
          setToolResults((prev) => [...prev, notification.params]);
        }
      );
      app.setNotificationHandler(
        McpUiSizeChangeNotificationSchema,
        async (notification) => {
          document.body.style.width = `${notification.params.width}px`;
          document.body.style.height = `${notification.params.height}px`;
        }
      );
    },
  });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!isConnected) {
    return <div>Connecting to host application...</div>;
  }

  return (
    <div>
      <h1>UI React App</h1>

      {toolResults.map((result, index) => (
        <div
          key={index}
          style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
        >
          <h2>Tool Result {index + 1}</h2>
          {result.structuredContent ? (
            <pre>{JSON.stringify(result.structuredContent, null, 2)}</pre>
          ) : (
            <p>No structured content</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

ここでは `onAppCreated` コールバック内で `ui/tool-result` と `ui/size-change` 通知のハンドラを登録しています。`ui/tool-result` 通知が受信されると、ツールの実行結果が状態に追加され、`ui/size-change` 通知が受信されると、UI の表示サイズが更新されます。そのほか、UI の接続状態やエラー情報も取得できます。

MCP ホストとやり取りする場合には `useApp` フックから返される `app` オブジェクトを使用することになります。`app` オブジェクトを介して、MCP ツールの呼び出しや外部リンクのオープンの要求などが可能です。

```tsx:src/ui-react.tsx
export function UiReact() {
  const [messages, setMessages] = useState<string[]>([]);
  const { app, isConnected, error } = useApp({ /* ... */ });

  const handleGetWeatherTool = useCallback(async () => {
    if (!app) return;
    try {
      const result = await app.callServerTool({
        name: "get-weather",
        arguments: { location: "New York" },
      });
      setMessages((prev) => [
        ...prev,
        `Weather tool result: ${JSON.stringify(result)}`,
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, `Error calling weather tool: ${error}`]);
    }
  }, [app]);

  const handleOpenLink = useCallback(async () => {
    if (!app) return;
    try {
      const result = await app.sendOpenLink({
        url: "https://www.example.com",
      });
      setMessages((prev) => [
        ...prev,
        `Open link result: ${JSON.stringify(result)}`,
      ]);
    } catch (error) {
      setMessages((prev) => [...prev, `Error opening link: ${error}`]);
    }
  }, [app]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // ...省略...

  return (
    <div>
      <h1>UI React App</h1>
      <button onClick={handleGetWeatherTool}>Get Weather</button>
      <button onClick={handleOpenLink}>Open Example.com</button>

      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>

    { /* ...省略... */ }
  );
}
```

最後に React の `createRoot` を使用して `UiReact` コンポーネントをレンダリングします。

```tsx:src/ui-react.tsx
import { createRoot } from "react-dom/client";

window.addEventListener("load", () => {
  const root = document.getElementById("root");
  if (!root) {
    throw new Error("Root element not found");
  }

  createRoot(root).render(<UiReact />);
});
```

`npm run build` コマンドを実行して UI コンポーネントをビルドします。ビルドが成功すると、`dist` ディレクトリに `ui-react.html` ファイルが生成されます。

```bash
$ npm run build

> mcp-apps-example@1.0.0 build
> rm -rf dist && VITE_ENTRY=ui-react vite build

vite v7.2.4 building client environment for production...
✓ 33 modules transformed.
[plugin vite:singlefile]

[plugin vite:singlefile] Inlining: ui-react-qBT9I1qt.js
dist/ui-react.html  287.03 kB │ gzip: 82.72 kB
✓ built in 496ms
```

### MCP サーバーの実装

`server.ts` ファイルを作成し、MCP サーバーを実装します。基本的な構造は従来の MCP サーバーの実装と同様ですが、UI リソースの登録とツールのメタデータに `ui/resourceUri` フィールドを追加する点が異なります。初めに `dist` ディレクトリから UI リソースのコンテンツを読み込む `loadHtml` 関数を用意しておきましょう。

```ts:server.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load both UI HTML files from dist/
const distDir = path.join(__dirname, "dist");
const loadHtml = async (name: string) => {
  const htmlPath = path.join(distDir, `${name}.html`);
  return fs.readFile(htmlPath, "utf-8");
};
```

MCP サーバーのセットアップを行います。`server.registerResource` メソッドを使用して UI リソースを登録します。

```ts:server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";

const server = new McpServer({
  name: "example-server",
  version: "0.1.0",
});

server.registerResource(
  // リソース名
  "ui-react",
  // リソースのURI
  "ui://example/ui-react",
  {
    // 人間が読むためのタイトル
    title: "UI React Example",
    // MIMEタイプは必ず text/html+mcp
    mimeType: "text/html+mcp",
  },
  // UI リソースの内容を返す関数
  async (): Promise<ReadResourceResult> => {
    const contentUiReact = await loadHtml("ui-react");
    return {
      contents: [
        {
          uri: "ui://example/ui-react",
          text: contentUiReact,
          mimeType: "text/html+mcp",
        },
      ],
    };
  }
);
```

次に、`server.registerTool` メソッドを使用して UI リソースを使用するツールを登録します。ツールのメタデータに `ui/resourceUri` フィールドを追加して、関連付けを行います。

```ts:server.ts
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

server.registerTool(
  "create-react-ui",
  {
    title: "Create React UI",
    description: "Returns a React-based UI",
    inputSchema: {},
    outputSchema: {
      message: z.string().describe("Message to display"),
    },
    // registerResourceで登録したUIリソースを返す
    _meta: {
      "ui/resourceUri": "ui://example/ui-react",
    },
  },
  // ツールの処理内容を実装する関数
  async (): Promise<CallToolResult> => {
    const message = "This is a React-based UI!";
    return {
      content: [{ type: "text", text: JSON.stringify({ message }) }],
      structuredContent: { message },
    };
  },
);
```

最後に Express サーバーをセットアップして MCP サーバーの仕様に従いリクエストを処理します。

```ts:server.ts
import express, { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import cors from "cors";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { InMemoryEventStore } from "@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    exposedHeaders: ["Mcp-Session-Id"],
  })
);

// Map to store transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

const mcpPostHandler = async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;

  try {
    let transport: StreamableHTTPServerTransport;
    if (sessionId && transports[sessionId]) {
      transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore,
        onsessioninitialized: (sessionId) => {
          console.log(`Session initialized: ${sessionId}`);
          transports[sessionId] = transport;
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports[sid]) {
          console.log(`Session closed: ${sid}`);
          delete transports[sid];
        }
      };

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    } else {
      res.status(400).json({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Bad Request: No valid session ID" },
        id: null,
      });
      return;
    }

    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
};

app.post("/mcp", mcpPostHandler);

app.get("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
});

app.delete("/mcp", async (req: Request, res: Response) => {
  const sessionId = req.headers["mcp-session-id"] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send("Invalid or missing session ID");
    return;
  }
  try {
    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error("Error handling session termination:", error);
    if (!res.headersSent) {
      res.status(500).send("Error processing session termination");
    }
  }
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.listen(PORT, () => {
  console.log(`MCP Server listening on http://localhost:${PORT}/mcp`);
});
```

`npm run server` コマンドを実行して MCP サーバーを起動します。

```bash
$ npm run start

> mcp-apps-example@1.0.0 server
> tsx server.ts

MCP Server listening on http://localhost:3000/mcp
```

`@modelcontextprotocol/inspector` を使用して MCP サーバーの実装をテストします。

```bash
npx @modelcontextprotocol/inspector
```

リソースタブで `ui://example/ui-react` リソースが登録されていることを、ツールタブで `create-react-ui` ツールが登録されていることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3hp8ZE71j3hk3ZQUAR1Fug/7a3a1d0bf7bd3a56c38f8a9b7d2e1e24/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-22_18.26.54.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/522nWJp9cpiT2AvbG5aA0i/e72c3e370bdefd4bf978c1f13866a677/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-22_18.27.15.png)

2025-11-22 時点では MCP Apps をサポートするホスト実装はまだ存在しないため UI コンポーネントを実際に表示できませんが MCP-UI では[暫定的な実装](https://github.com/MCP-UI-Org/mcp-ui/pull/147)が行われているようです。

## まとめ

- ChatGPT の Apps SDK や MCP-UI のように、AI エージェントがインタラクティブな UI を返す仕組みが注目されている
- MCP Apps は MCP の拡張機能として、`ui://` URI スキームを使用した UI リソースの宣言とツールとの関連付けを標準化する
- JSON-RPC を使用したホストと iframe 間の双方向通信により、UI コンポーネントがツールの呼び出しや外部リンクのオープンなどを行える
- `@modelcontextprotocol/ext-apps` SDK を使用することで、React などのフレームワークを用いた UI コンポーネントの実装が可能
- 2025-11-22 時点では MCP Apps をサポートするホスト実装はまだ存在しないが、今後の普及が期待される

## 参考

- [SEP-1865: MCP Apps - Interactive User Interfaces for MCP by idosal · Pull Request #1865 · modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865)
- [\[RFC\] UI Component Integration in MCP Responses · Issue #35 · modelcontextprotocol-community/working-groups](https://github.com/modelcontextprotocol-community/working-groups/issues/35)
- [MCP Apps: Extending servers with interactive user interfaces | mcp blog](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/)
- [modelcontextprotocol/ext-apps: Official repo for SDK of upcoming Apps / UI extension](https://github.com/modelcontextprotocol/ext-apps)
