---
id: KFlOQO_hMXRqSKBA9dL8Q
title: "AI とインタラクティブな UI のやり取りを実現する MCP Apps"
slug: "ai-interactive-ui-with-mcp-apps"
about: "MCP Apps は MCP にインタラクティブな UI コンポーネントを返す方法を標準化した拡張機能です。この記事では MCP Apps を使用してインタラクティブな UI コンポーネントをエージェントが返す方法について試してみます。"
createdAt: "2026-01-27T20:05+09:00"
updatedAt: "2026-01-27T20:05+09:00"
tags: ["MCP Apps", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/FXZatDhwNoNH2hSLkjOp2/9d92d9646b05fc38f7cd780a7d34d162/giant-salamander_22989-768x542.png"
  title: "オオサンショウウオのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "MCP Apps において、UI コンポーネントをリソースとして定義する際に使用する URI スキームは何ですか？"
      answers:
        - text: "ui://"
          correct: true
          explanation: "MCP Apps では UI コンポーネントのリソース URI として ui:// スキームを使用します。"
        - text: "mcp://"
          correct: false
          explanation: ""
        - text: "app://"
          correct: false
          explanation: ""
        - text: "resource://"
          correct: false
          explanation: ""
    - question: "MCP Apps において、ツールが UI コンポーネントを返すことを示すために使用するメタ情報のフィールド名は何ですか？"
      answers:
        - text: "_meta.app.resourceUri"
          correct: false
          explanation: ""
        - text: "_meta.ui.resourceUri"
          correct: true
          explanation: "ツールのメタ情報の _meta.ui.resourceUri フィールドに UI コンポーネントのリソース URI を指定することで、ホストが UI コンポーネントをレンダリングできるようになります。"
        - text: "_meta.ui.component"
          correct: false
          explanation: ""
        - text: "_meta.resource.uri"
          correct: false
          explanation: ""
    - question: "MCP Apps のクライアント側で、UI コンポーネントからサーバーのツールを呼び出すために使用するメソッドは何ですか？"
      answers:
        - text: "app.callServerTool"
          correct: true
          explanation: "app.callServerTool メソッドを使用して、UI コンポーネントからサーバー側のツールを呼び出すことができます。"
        - text: "app.callTool"
          correct: false
          explanation: ""
        - text: "app.invokeTool"
          correct: false
          explanation: ""
        - text: "app.executeTool"
          correct: false
          explanation: ""

published: true
---

AI エージェントとチャット形式の対話ではなく、インタラクティブな UI を通じてやり取りすることが求められるケースがあります。例えば、グラフやチャートとして視覚的に表示したり、購入したい商品の一覧をカード形式で表示したうえで、ユーザーがクリックして購入を完了できるようにしたりするといったケースが考えられます。このようなインタラクティブな UI のやり取りを可能にした [Apps in ChatGPT](https://developers.openai.com/apps-sdk/) や [MCP-UI](https://mcpui.dev/)は大きな注目を集めました。

Apps SDK や MCP-UI はそれぞれ[[Model Context Protocol (MCP)](https://modelcontextprotocol.io/)]を基盤としており、MCP の仕組みを拡張して任意の HTML, CSS, JavaScript を含む UI コンポーネントをエージェントが返せるようにしています。しかし、それぞれが独自に MCP を拡張しているため、異なるプラットフォーム間で互換性がなく、同じ UI コンポーネントを複数のエージェントで共有することが困難です。

以前より MCP がインタラクティブな UI コンポーネントを返す方法を標準化した [Mcp Apps の提案](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/draft/apps.mdx)が進められていましたが、このたび MCP Apps の仕様が正式に MCP の拡張機能としてリリースされました。MCP Apps を使用するとツールが返した UI コンポーネントをホストがサンドボックス化された iframe 内でレンダリングし、ユーザーが UI コンポーネントと対話できるようになります。

現時点では Claude, [Goose](https://block.github.io/goose/docs/tutorials/building-mcp-apps/), [VSCode Insiders](https://code.visualstudio.com/insiders/) などが MCP Apps をサポートしており、ChatGPT も近く対応する予定です。

この記事では MCP Apps を使用してインタラクティブな UI コンポーネントをエージェントが返す方法について試してみます。

## MCP Apps プロジェクトを作成する

典型的な MCP Apps プロジェクトを作成し、どのように MCP Apps が動作するかを確認してみましょう。ツールを提供し UI コンポーネントを返すサーバー側の実装と、UI コンポーネントをビルドするクライアント側の実装の両方が必要です。

まずは必要なパッケージをインストールします。

```bash
npm install @modelcontextprotocol/ext-apps @modelcontextprotocol/sdk
npm install -D typescript vite vite-plugin-singlefile express cors @types/express @types/cors tsx
```

肝となるのが [@modelcontextprotocol/ext-apps](https://www.npmjs.com/package/@modelcontextprotocol/ext-apps) パッケージです。このパッケージには MCP Apps の仕様に準拠したツールとクライアントの両方を実装するための SDK が含まれています。その他のパッケージは通常 MCP サーバーを実装するために使用するものです。

`package.json`, `tsconfig.json`, `vite.config.ts` などの設定ファイルをそれぞれ作成します。

```json:package.json
{
  "type": "module",
  "scripts": {
    "build": "vite build",
    "serve": "npx tsx src/server.ts"
  }
}
```

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["*.ts", "src/**/*.ts"]
}
```

```ts:vite.config.ts
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: "mcp-app.html",
    },
  },
});
```

## サーバーの実装

次に MCP ツールを実装します。MCP ツールは通常の MCP のフローと同じようにホストの要求がある場合に応答を返しますが、応答の一部として UI コンポーネントを含めることができます。ホストは UI コンポーネントが応答に含まれていることをメタ情報で検出し、UI コンポーネントをレンダリングします。サーバー側の実装では以下の 3 つの処理が必要です。

1. [リソース](https://modelcontextprotocol.io/specification/2025-06-18/server/resources) として UI コンポーネントを定義する。URI は `ui://` スキームを使用する
2. カウント数を返すツールのメタ情報（`_meta.ui.resourceUri`）で UI コンポーネントのリソース URI を指定する
3. カウント数をインクリメントするツールを実装する

ここでは MCP Apps の例として、簡単なカウンター UI コンポーネントを返すツールを実装します。サーバー側で現カウント数を保持し、ツールが呼び出された場合は現在のカウント数をボタンとして返します。ユーザーがボタンをクリックするとカウント数が増加し、更新されたカウント数が保存されます。

まずは通常の MCP サーバーの実装と同じように `new MCPServer({...})` で MCP サーバーのインスタンスを作成し、Express を使用して HTTP サーバーを立ち上げます。`src/server.ts` に以下のコードを記述します。

```ts:src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express from "express";

const server = new McpServer({
  name: "My MCP App Server",
  version: "0.0.1",
});

const expressApp = express();
expressApp.use(cors());
expressApp.use(express.json());

expressApp.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

expressApp.listen(3001, (err) => {
  if (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
  console.log("Server listening on http://localhost:3001/mcp");
});
```

`registerAppResource` 関数を使用して UI コンポーネントのリソースを登録します。UI コンポーネントは HTML, CSS, JavaScript を含む単一の HTML ファイルとして提供される必要があります。ここでは `dist/mcp-app.html` にビルドされた UI コンポーネントを登録します。`dist/mcp-app.html` は後ほどクライアント側の実装で作成します。

```ts:src/server.ts
import {
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import fs from "node:fs/promises";
import path from "node:path";

const server = new McpServer({
  name: "My MCP App Server",
  version: "0.0.1",
});

// リソースの URI は ui:// スキームを使用する
const resourceUri = "ui://my-counter-app";

registerAppResource(
  server,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    const html = await fs.readFile(
      path.join(import.meta.dirname, "../dist", "mcp-app.html"),
      "utf-8",
    );
    return {
      contents: [
        { uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html },
      ],
    };
  },
);
```

カウント数を返すツールを登録します。サーバーで保持した現在のカウント数を返すという部分は通常の MCP ツールと同じように実装しますが、`_meta.ui.resourceUri` に UI コンポーネントのリソース URI を指定する点が異なります。UI コンポーネントはあくまでメタ情報として返すため、MCP Apps に対応していないクライアントには単に無視され、通常のテキスト応答として扱われます。

```ts:src/server.ts
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";

const server = new McpServer({
  name: "My MCP App Server",
  version: "0.0.1",
});

// メモリ上にカウント数を保持する
let count = 0;

registerAppTool(
  server,
  "get-current-count",
  {
    title: "Get Current Count",
    description: "Returns the current count",
    inputSchema: {},
    _meta: {
      ui: {
        resourceUri: "ui://my-counter-app",
      },
    },
  },
  async (input) => {
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  },
)
```

カウント数をインクリメントするツールも登録します。通常の MCP ツールのように AI エージェントから呼び出されるほか、UI コンポーネントからも `tools/call` MCP プロトコルを使用して呼び出すことができます。このツールでは UI コンポーネントを返す必要がないため、`registerAppTool` を使用せずに `server.registerTool` を使用してツールを登録します。

```ts:src/server.ts
server.registerTool(
  "increment-count",
  {
    title: "Increment Count",
    description: "Increments the current count by 1",
    inputSchema: {},
  },
  async (input) => {
    count += 1;
    return {
      content: [{ type: "text", text: count.toString() }],
    };
  },
);
```

## クライアントの実装

クライアント側では UI コンポーネントをビルドします。MCP Apps では UI コンポーネントは単一の HTML ファイルとして提供される必要があるため、Vite のプラグインである [vite-plugin-singlefile](https://www.npmjs.com/package/vite-plugin-singlefile) を使用して HTML, CSS, JavaScript を 1 つのファイルにまとめます。なおここでは特にフレームワークは使用せず、純粋な TypeScript と DOM API を使用して実装していますが、MCP Apps では React 向けの SDK も提供されています。

`mcp-app.html` に以下のコードを記述します。

```html:mcp-app.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Get Current Count</title>
  <link rel="stylesheet" href="./src/mcp-app.css" />
</head>
<body>
  <button id="count-button">Loading...</button>
  <script type="module" src="./src/mcp-app.ts"></script>
</body>
</html>
```

スタイルシートファイル `src/mcp-app.css` を作成します。

```css:src/mcp-app.css
body {
  margin: 0;
  padding: 16px;
}

#count-button {
  padding: 12px 24px;
  background: var(--color-background-primary, light-dark(#3b82f6, #2563eb));
  color: var(--color-text-secondary, light-dark(#ffffff, #f3f4f6));
  border: 1px solid var(--color-border-primary, light-dark(#2563eb, #3b82f6));
  border-radius: var(--border-radius-medium, 8px);
  font-size: var(--font-text-md-size, 16px);
  box-shadow: var(--shadow-medium, 0 4px 6px rgba(0, 0, 0, 0.1));
  cursor: pointer;
}
```

MCP Apps ではホスト環境と視覚的な一貫性を保つために、標準化された CSS カスタムプロパティ（CSS 変数）をサポートしています。ホストはホストコンテキストを通じてスタイル変数を提供でき、UI コンポーネントはこれらの変数を使用してホストの外観に合わせてスタイリングを行うことができます。

仕様では以下のカテゴリの CSS 変数が定義されています。

```css/** CSS variable keys available to Views for theming. */
type McpUiStyleVariableKey =
  // Background colors
  | "--color-background-primary"
  | "--color-background-secondary"
  | "--color-background-tertiary"
  | "--color-background-inverse"
  | "--color-background-ghost"
  | "--color-background-info"
  | "--color-background-danger"
  | "--color-background-success"
  | "--color-background-warning"
  | "--color-background-disabled"
  // Text colors
  | "--color-text-primary"
  | "--color-text-secondary"
  | "--color-text-tertiary"
  | "--color-text-inverse"
  | "--color-text-info"
  | "--color-text-danger"
  | "--color-text-success"
  | "--color-text-warning"
  | "--color-text-disabled"
  | "--color-text-ghost"
  // Border colors
  | "--color-border-primary"
  | "--color-border-secondary"
  | "--color-border-tertiary"
  | "--color-border-inverse"
  | "--color-border-ghost"
  | "--color-border-info"
  | "--color-border-danger"
  | "--color-border-success"
  | "--color-border-warning"
  | "--color-border-disabled"
  // Ring colors
  | "--color-ring-primary"
  | "--color-ring-secondary"
  | "--color-ring-inverse"
  | "--color-ring-info"
  | "--color-ring-danger"
  | "--color-ring-success"
  | "--color-ring-warning"
  // Typography - Family
  | "--font-sans"
  | "--font-mono"
  // Typography - Weight
  | "--font-weight-normal"
  | "--font-weight-medium"
  | "--font-weight-semibold"
  | "--font-weight-bold"
  // Typography - Text Size
  | "--font-text-xs-size"
  | "--font-text-sm-size"
  | "--font-text-md-size"
  | "--font-text-lg-size"
  // Typography - Heading Size
  | "--font-heading-xs-size"
  | "--font-heading-sm-size"
  | "--font-heading-md-size"
  | "--font-heading-lg-size"
  | "--font-heading-xl-size"
  | "--font-heading-2xl-size"
  | "--font-heading-3xl-size"
  // Typography - Text Line Height
  | "--font-text-xs-line-height"
  | "--font-text-sm-line-height"
  | "--font-text-md-line-height"
  | "--font-text-lg-line-height"
  // Typography - Heading Line Height
  | "--font-heading-xs-line-height"
  | "--font-heading-sm-line-height"
  | "--font-heading-md-line-height"
  | "--font-heading-lg-line-height"
  | "--font-heading-xl-line-height"
  | "--font-heading-2xl-line-height"
  | "--font-heading-3xl-line-height"
  // Border radius
  | "--border-radius-xs"
  | "--border-radius-sm"
  | "--border-radius-md"
  | "--border-radius-lg"
  | "--border-radius-xl"
  | "--border-radius-full"
  // Border width
  | "--border-width-regular"
  // Shadows
  | "--shadow-hairline"
  | "--shadow-sm"
  | "--shadow-md"
  | "--shadow-lg";
```

スタイルの提供はオプショナルであるため、UI コンポーネント側でフォールバック値を設定しておく必要があります。上記の例では `var()` 関数の第二引数としてフォールバック値を指定しています（例：`var(--color-background-primary, light-dark(#ffffff, #1a1a1a))`）。色の値には CSS の `light-dark()` 関数を使用することで、ライトモードとダークモードの両方に対応できます。

ホストとの通信をするスクリプト部分である `src/mcp-app.ts` を実装します。このスクリプトでは以下の処理を行います。以下ようなホストとの通信はすべて [postMessage](https://developer.mozilla.org/ja/docs/Web/API/Window/postMessage) API を介して行われますが、`@modelcontextprotocol/ext-apps` パッケージがラップして提供する `App` クラスを使用することで簡単に実装できます。

- MCP クライアントを初期化し、ホストと接続する
- ホストコンテキストを通じてスタイル変数を取得し、UI コンポーネントに適用する
- ツールのレスポンスに含まれる現在のカウント数を取得し、ボタンに表示する
- ユーザーがボタンをクリックした場合に `increment-count` ツールを呼び出し、更新されたカウント数を取得してボタンに表示する

初めに `app.connect()` を呼び出してホストと接続します。

```ts:src/mcp-app.ts
import { App } from "@modelcontextprotocol/ext-apps";

const app = new App({ name: "Get Current Count App", version: "0.0.1" });

app.connect()
```

ホストコンテキストを通じてスタイル変数を取得し、UI コンポーネントに適用します。`app.onhostcontextchanged` イベントをリッスンしてホストが提供するスタイル変数を取得できます。取得したスタイル変数は `document.documentElement.style.setProperty` 関数を使用して CSS カスタムプロパティとして設定します。

```ts:src/mcp-app.ts
const context = app.getHostContext();
for (const [key, value] of Object.entries(context?.styles?.variables || {})) {
  document.documentElement.style.setProperty(key, value || "");
}
```

ツールの結果を取得するために `app.ontoolresult` イベントをリッスンします。このイベントはホストがツールの結果をアプリにプッシュしたときに発生します。ここでは `get-current-count` ツールの結果を受け取り、ボタンに現在のカウント数を表示します。

```ts:src/mcp-app.ts
const button = document.getElementById("count-button") as HTMLButtonElement;

app.ontoolresult = (response) => {
  const count = response.content?.find((c) => c.type === "text")?.text;
  if (count) {
    button.textContent = `Count: ${count}`;
  }
};
```

ボタンがクリックされた場合に `increment-count` ツールを呼び出します。ツールの呼び出しは `app.callServerTool` 関数を使用して行います。ツールの結果を受け取ったら、同様にボタンに更新されたカウント数を表示します。

```ts:src/mcp-app.ts
button.addEventListener("click", async () => {
  const response = await app.callServerTool({
    name: "increment-count",
    arguments: {},
  });
  const count = response.content?.find((c) => c.type === "text")?.text;
  if (count) {
    button.textContent = `Count: ${count}`;
  }
});
```

## MCP サーバーの実装を確認する

実装が完了したら UI コンポーネントをビルドし、サーバーを起動します。

```bash
npm run build
npm run serve
```

MCP サーバーの実装が正しいかどうかは　[MCP Inspector](https://modelcontextprotocol.io/tools/inspector) を使用して確認できます。

```bash
npx @modelcontextprotocol/inspector
```

http://localhost:6277 にアクセスし、「Transport Type」で「Streamable HTTP」を選択し、「URL」に `http://localhost:3001/mcp` を指定して「Connect」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/nbB7GoV8fg4GlpPE4Wayy/89c7dd372e8fb9a95face2a63de9edd3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-27_21.19.46.png)

サーバーに接続できたら「Resources」タブを確認してみましょう。「List Resource」→「ui://my-counter-app」を選択するとビルドされた HTML がリソースとして登録されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3caJWCQtn87MHkDy08mUNS/bcb346e5fa4c6ba27a1749af6e2325ce/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-27_21.24.40.png)

次に「Tools」タブを確認してみましょう。「List Tool」→「get-current-count」を選択すると、ツールのメタ情報に UI コンポーネントのリソース URI が指定されていることが確認できます。ツールが正しく呼び出されるかどうかも確認しておきましょう。`increment-count` ツールを呼び出すたびに `get-current-count` ツールの結果が更新されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7m9MomBYoynbI0QeeV6XHy/f93991ee879dc3b5266209767d6084ff/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-27_21.27.10.png)

## ホストで UI コンポーネントをレンダリングする

MCP Apps に対応したホストで UI コンポーネントが正しくレンダリングされるかどうかを確認してみましょう。ここでは Claude を使用して確認します。

:::info
現時点では Pro プラン以上のサブスクリプションが必要です。
:::

ローカルで起動した MCP サーバーをインターネットに公開する必要があるため、`cloudflared` を使用してトンネルを作成します。

```bash
npx cloudflared tunnel --url http://localhost:3001
```

Claude の [Connectors](https://claude.ai/settings/connectors) 画面を開き、「Add Custom Connector」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4pbJYU5ICILaEQ6qjruB1t/a8df476265b1d89033c4f55f3eb8afaa/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-27_21.32.02.png)

表示されたダイアログで「MCP Server URL」に `https://<your-subdomain>.trycloudflare.com/mcp` のように `cloudflared` で公開した URL を指定し、「Add」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/spn7H44Az5GGOMt6zi1se/655be419c674a21c2bb40109cb84ce38/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-27_21.33.32.png)

Claude に戻り、新しいチャットを開始します。追加した Connector のトグルスイッチがオンになっていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/2TSnGrQfPPO33GKuOTBtRx/b90316f60c83d7961f44be0de22b9463/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-27_21.35.07.png)

プロンプトとして「現在のカウント数を教えて」と入力して送信します。MCP Apps に対応したホストであれば、ツールの応答に含まれる UI コンポーネントがレンダリングされ、ボタンとして表示されます。ボタンをクリックするとカウント数がインクリメントされ、更新されたカウント数が表示されます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7jeVN60alsltvQ1zsfkuYN/fb9bbf225d3aac700c0390667b56fd46/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-01-27_22.25.03.mov" controls></video>

## まとめ

- MCP Apps は MCP にインタラクティブな UI コンポーネントを返す方法を標準化した拡張機能である
- MCP Apps を使用するとツールが返した UI コンポーネントをホストがサンドボックス化された iframe 内でレンダリングし、ユーザーが UI コンポーネントと対話できるようになる
- MCP サーバーでは UI コンポーネントをリソースとして登録し、ツールのメタ情報で UI コンポーネントのリソース URI を指定する
- クライアント側ではホストのツールの結果を受け取り、UI コンポーネントをレンダリングする。`tools/call` MCP プロトコルを使用してサーバーのツールを呼び出すこともできる

## 参考

- [MCP Apps - Model Context Protocol](https://modelcontextprotocol.io/docs/extensions/apps)
- [Quickstart | @modelcontextprotocol/ext-apps - v1.0.1](https://modelcontextprotocol.github.io/ext-apps/api/documents/Quickstart.html)
- [modelcontextprotocol/ext-apps: Official repo for spec & SDK of MCP Apps protocol - standard for UIs embedded AI chatbots, served by MCP servers](https://github.com/modelcontextprotocol/ext-apps)
- [MCP Apps - Bringing UI Capabilities To MCP Clients | Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/)
- [SEP-1865: MCP Apps: Interactive User Interfaces for MCP](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx#theming)
