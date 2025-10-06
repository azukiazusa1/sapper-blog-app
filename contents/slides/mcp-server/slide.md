---
marp: true
theme: default
class: invert
style: |
  section {
    font-size: 26px;
    line-height: 1.5;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #533483 100%);
    color: #ffffff;
    place-content: start center;
    position: relative;
  }
  section::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }
  h1 {
    font-size: 52px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin-bottom: 0.8rem;
  }
  h2 {
    font-size: 40px;
    font-weight: 700;
    color: #ffffff;
    padding-left: 16px;
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin-bottom: 1.2rem;
  }
  h3 {
    font-size: 34px;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 0.8rem 0;
    line-height: 1.3;
  }
  code {
    background: linear-gradient(135deg, #1e1e2e, #2a2d3a);
    color: #4dd0e1;
    font-size: 22px;
    border: 1px solid rgba(77, 208, 225, 0.4);
    border-radius: 6px;
    padding: 3px 6px;
    font-family: 'JetBrains Mono', 'SF Mono', Monaco, Inconsolata, 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;
  }
  pre {
    background: linear-gradient(135deg, #1a1a2e, #252850);
    color: #ffffff;
    font-size: 20px;
    line-height: 1.4;
    border: 1px solid rgba(77, 208, 225, 0.3);
    border-radius: 10px;
    padding: 18px;
    margin: 18px 0;
    position: relative;
    overflow: hidden;
  }
  .line {
    line-height: 1.5;
  }
  ul {
    padding-left: 0 !important;
  }

  li {
    font-size: 28px;
    margin-bottom: 16px;
    margin-top: 16px;
    position: relative;
    padding-left: 30px;
    line-height: 1.5;
    list-style: none;
  }
  ul li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: #4dd0e1;
    font-weight: bold;
    font-size: 20px;
    top: 2px;
  }

  .top {
    position: absolute;
    top: 60px;
    left: 40px;
  }

  .box {
    background: linear-gradient(135deg, rgba(30, 30, 46, 0.9) 0%, rgba(42, 45, 58, 0.9) 100%);
    padding: 24px;
    border-radius: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: center;
    border: 1px solid rgba(77, 208, 225, 0.4);
    position: relative;
    overflow: hidden;
    min-width: 260px;
    min-height: 300px;
  }

  .box-title {
    font-weight: 700;
    margin-bottom: 12px;
    font-size: 30px;
    color: #4dd0e1;
    text-align: center;
    line-height: 1.2;
  }

  .flex {
    display: flex;
    gap: 24px;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    align-items: start;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    margin: 24px 0;
    align-items: start;
  }

  .center {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    flex-direction: column;
    position: relative;
    z-index: 2;
  }

  .text-sm {
    font-size: 22px;
    color: #e0e0e0;
    line-height: 1.4;
  }

  .gradient-text {
    background: linear-gradient(135deg, #00d4ff 0%, #64ffda 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
  }

  .icon-large {
    font-size: 48px;
    line-height: 1;
  }

  .arrow-blue {
    font-size: 48px;
    color: #00d4ff;
  }

  .flow-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .text-2xl {
    font-size: 30px;
    line-height: 1.3;
  }

  .highlight {
    background: linear-gradient(135deg, rgba(77, 208, 225, 0.12) 0%, rgba(128, 222, 234, 0.12) 100%);
    border-left: 3px solid #4dd0e1;
    padding: 12px 16px;
    margin: 12px 0;
    border-radius: 6px;
  }
---

<div class="center">

# MCPサーバーの基礎から実践レベルの知識まで

</div>

---

# 自己紹介

- azukiazusa
- https://azukiazusa.dev
- FE(フロントエンド|ファイアーエムブレム)が好き

![bg right:40% w:300px](./images/azukiazusa.png)

---

# アジェンダ

- MCP サーバーの基礎知識について(10分)
- MCP サーバー構築デモ(15分)
- MCP サーバーの実践的な知識について(20分)

---

# MCPとは何か

**Model Context Protocol (MCP)**

アプリケーションが LLM にコンテキストを渡す方法を標準化するためのプロトコル

- Anthropicが開発・発表
- LSP(Language Server Protocol)の発想を参考
- ツールのインターフェースを統一

---

# なぜMCPが必要なのか?

- LLMには知識カットオフがあり、最新の情報や組織内の情報を取得できない
- Web 検索をしたり、社内ドキュメントを参照しその情報をコンテキストに渡す必要がある
- 従来は function calling といった仕組みが使われてきた
  - 天気情報を取得するために天気情報 API を呼び出したり、Slack API を呼び出してメッセージを送信したりする関数を LLM が呼び出す

---

# function calling

- ツールのインターフェースが標準化されていない
- LLMごとに異なる実装が必要
- ツールを配布する手段がない
- 開発者が独自に実装する必要がある

---

# function callingの例

<div class="grid">

<div>

```typescript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  tools: [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "天気を取得",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
            },
          },
        },
      },
    },
  ],
});
```

</div>

<div>

```typescript
const response = await anthropic.messages.create({
  model: "claude-3-5-sonnet",
  tools: [
    {
      name: "get_weather",
      description: "天気を取得",
      input_schema: {
        type: "object",
        properties: {
          location: {
            type: "string",
          },
        },
      },
    },
  ],
});
```

</div>

</div>

→ **ベンダーごとに異なるインターフェース**

---

# MCP が解決したこと

- ツールのインターフェースを標準化し、パッケージマネージャーでの配布も容易になった
- 各プログラミング言語向けの SDK が提供されているため、効率よく MCP サーバーを開発できた
- 企業が自社のデータを LLM に提供する手段として普及が進んだ
- 現在では Anthropic が提供する Claude だけでなく、OpenAI の GPT や Google の Gemini など、主要な LLM が MCP をサポートし事実上の標準となっている

---

# MCPがあるとできること

- Googleカレンダーに予定を追加
- Notionにメモを追加
- Slackにメッセージを送信
- Web検索を実行

---

# MCPの仕組み

![](./images/mcp-architecture-diagram.svg)

---

# MCPのトランスポート

### stdio(標準入出力)

- 標準入力/出力を使用した通信
- ローカル環境で動作

### Streamable HTTP

- HTTP を使用した通信
- Web ブラウザ上で動作するので注目を浴びている

### SSE(非推奨)

- 互換性維持のために残されている

---

# JSON-RPC 2.0

- JSON-RPC 2.0 (https://www.jsonrpc.org/specification)を使用して通信
- JSON-RPC とは、リモートプロシージャコール (RPC) を JSON フォーマットで実装するための軽量なプロトコル

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_weather",
    "arguments": {
      "location": "Tokyo"
    }
  }
}
```

---

# MCPの3つの機能

### リソース

ユーザーや LLM がアクセスできるデータ

### プロンプト

再利用可能なプロンプトテンプレート

### ツール

LLM が呼び出せる外部ツール

→ **この発表ではツールに焦点を当てる**

---

# MCP サーバー構築デモ

TypeScript SDK を使用してサイコロツールを実装

---

# TypeScript SDKのインストール

```bash
npm install @modelcontextprotocol/sdk zod
```

---

# サーバーの基本構造

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "dice-server",
  version: "1.0.0",
});
```

---

# ツールの定義と実装

<div class="grid">

<div>

```typescript
import { z } from "zod";

server.registerTool(
  // ツール名
  "roll_dice",
  {
    title: "Roll Dice", // 人間が読めるツールの名前
    description: "ランダムな数字を生成するサイコロツール", // ツールの説明
    // ツールの入力スキーマ
    inputSchema: {
      sides: z.number().optional().describe("サイコロの面の数(デフォルト: 6)"),
    },
    // ツールの出力スキーマ
    outputSchema: {
      result: z.number(),
    },
  },
  async ({ sides = 6 }) => {
    const result = Math.floor(Math.random() * sides) + 1;

    return {
      content: [{ type: "text", text: JSON.stringify({ result }) }],
      structuredContent: { result },
    };
  },
);
```

</div>

- description はツールがツールを呼び出す判断に影響するため重要
- Zod でスキーマを定義し、LLM に入力と出力の形式を伝える
- 第 3 引数で呼び出した関数の結果が LLM に返される

---

# サーバーの起動(stdio)

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const transport = new StdioServerTransport();
await server.connect(transport);
```

stdio 通信でサーバーを起動

---

# Streamable HTTP の場合

```typescript
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || "3000");
app.listen(port, () => {
  console.log(`MCP Server running on http://localhost:${port}/mcp`);
});
```

→ **Web ベースで動作するため、Claude Code などのブラウザクライアントから利用可能**

---

# MCP Inspectorで動作確認

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

- ブラウザでツールの動作をテスト
- リクエスト・レスポンスの確認
- デバッグに便利

---

# Claude Desktopでの設定

`~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "dice": {
      "command": "node",
      "args": ["/path/to/build/index.js"]
    }
  }
}
```

---

# Claude Desktopで実行

- Claude Desktopを再起動
- チャットで「サイコロを振って」と入力
- ツールが自動的に呼び出される
- 結果が返される

---

<div class="center">

# MCPサーバーの実践的な知識

- 私が実際に本番レベルで MCP サーバーを開発してきた中で得た知見・失敗談を共有

</div>

---

<div class="center">

# Web API の設計知識は捨てる

</div>

<!--
始めに伝えたいいちばん大切なことは、MCP サーバーを設計する際には、従来の Web API の設計知識を捨てる必要があるということです。MCP サーバーは LLM と連携するためのものであり、LLM の特性を理解し、それに合わせた設計が求められます。

 -->

---

# APIのラッパーとして提供すると失敗する

- REST APIはエンドポイントベースの設計
  - 1 つのリソースに対して GET、POST、PUT、DELETE などの操作ごとにエンドポイントが存在
- ツールはユーザーが達成したいタスクベースの設計
- プログラミングでは 1 つのタスクを達成するために複数の API を組み合わせることが一般的
- LLM は複数のツールを組み合わせてタスクを達成することが苦手

---

# 例: カレンダーAPI

### 従来のAPI設計

- `GET /users` - ユーザー取得
- `GET /events` - イベント取得
- `POST /events` - イベント作成

→ この設計に従うと、`get_users`, `get_events`, `create_event` といったツールを作りたくなる

### より効果的なツール設計

- `schedule_meeting` - ミーティングをスケジュール（ツールの実装の中で複数のAPIを呼び出す）

→ **1つのタスクを1つのツールで完結**

---

<div class="grid">

<div>

## 従来のプログラミングの例

```typescript
async function scheduleMeetingWithTanaka() {
  // 1. ユーザーを検索
  const users = await fetch("https://api.example.com/users?name=田中").then(
    (r) => r.json(),
  );
  const tanaka = users.find((u) => u.name.includes("田中"));

  // 2. 田中さんの予定を取得
  const events = await fetch(
    `https://api.example.com/events?userId=${tanaka.id}&date=2025-10-06`,
  ).then((r) => r.json());

  // 3. 空き時間を見つける
  const freeSlots = findFreeSlots(events);

  // 4. ミーティングを作成
  await fetch("https://api.example.com/events", {
    method: "POST",
    body: JSON.stringify({
      title: "定例会議",
      attendees: [tanaka.id],
      startTime: freeSlots[0].start,
      endTime: freeSlots[0].end,
    }),
  });
}
```

</div>

<div>

## MCPサーバーの例

```typescript
// MCP ツール: 1つのツールでタスクを完結
server.registerTool(
  "schedule_meeting",
  {
    title: "Schedule Meeting",
    description: "指定したメンバーとのミーティングをスケジュール",
    inputSchema: {
      attendeeName: z.string().describe("参加者の名前"),
      title: z.string().describe("ミーティングのタイトル"),
      date: z.string().describe("日付(YYYY-MM-DD)"),
      duration: z.number().describe("所要時間(分)"),
    },
    outputSchema: { eventId: z.string(), startTime: z.string() },
  },
  async ({ attendeeName, title, date, duration }) => {
    // ツール内部で全ての処理を実行
    const user = await searchUser(attendeeName);
    const freeSlot = await findFreeSlot(user.id, date, duration);
    const event = await createEvent(title, [user.id], freeSlot);

    return {
      content: [{ type: "text", text: `ミーティングを作成しました` }],
      structuredContent: { eventId: event.id, startTime: freeSlot.start },
    };
  },
);
```

</div>

---

# ツール設計のポイント

- 提供するツールの数が多くなると、LLMがどのツールを使うべきか迷ってしまう
- ユーザーが何を達成したいのか、ユースケースを考えてツールを設計する
  - ユーザーを取得したいのは何のため？
    - 会議のスケジュールのために空き時間を知りたいの真の目的

---

# コンテキストが大きくなりすぎる問題

LLMにはコンテキスト長の制限がある

- Claude Code: デフォルトで 25,000 トークン
- コンテキストが大きいと性能が低下
  - LLM が無関係な情報に注意を奪われる → コンテキスト汚染

---

# 従来のプログラミングとの違い

- 現代の富豪的プログラミングでは1,000件のリストをメモリに載せてフィルタリング・ソートしても問題ない
- LLM ではコンテキスト制限があるため同じアプローチは不可

→ API の応答をそのまま返すのは避ける

---

# 解決策1: ページネーションの導入

```typescript
server.registerTool(
  "search_users",
  {
    inputSchema: {
      query: z.string().describe("検索クエリ"),
      limit: z.number().optional().default(10).describe("取得件数"),
      offset: z.number().optional().default(0).describe("オフセット"),
    },
  },
  async ({ query, limit = 10, offset = 0 }) => {
    const users = await db.users.search(query).limit(limit).offset(offset);
    const total = await db.users.count(query);

    const result = {
      users,
      total,
      hasMore: offset + limit < total,
    };

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
);
```

---

# 解決策2: 必要なフィールドだけ取得

```typescript
server.registerTool(
  "get_user",
  {
    inputSchema: {
      userId: z.string().describe("ユーザーID"),
      fields: z
        .array(z.enum(["name", "email", "avatar", "bio"]))
        .optional()
        .default(["name", "email"])
        .describe("取得するフィールド"),
    },
  },
  async ({ userId, fields = ["name", "email"] }) => {
    const user = await db.users.findById(userId).select(fields);

    return {
      content: [{ type: "text", text: JSON.stringify(user) }],
      structuredContent: user,
    };
  },
);
```

---

# 解決策3: データを要約・整形

```typescript
server.registerTool(
  "get_log_summary",
  {
    inputSchema: {
      responseFormat: z
        .enum(["detailed", "summary"])
        .optional()
        .default("summary"),
    },
  },
  async ({ responseFormat = "summary" }) => {
    const logs = await parseLogs(date);
    const result = responseFormat === "summary" ? summarizeLogs(logs) : logs;
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
      structuredContent: result,
    };
  },
);
```

---

# LLMが誤ったツール呼び出しを行う

ホストメトリック取得ツールで存在しないメトリック名を繰り返し呼び出して失敗し続ける

---

# 解決策1: descriptionのプロンプトエンジニアリング

<div class="grid">

<div>

- ツールの説明は LLM のコンテキストに含まれるので、プロンプトエンジニアリングの知識が活用できる
  - ユーザーがどのような場面でツールを使うべきかを明示する
  - サポートしている値の一覧を含める
  - ツールの使用例を Few-shot で示す

</div>

<div>

<img src="./images/prompt-engineering.jpeg" style="width: 300px;"/>

---

# ツールの description の良い例

```typescript
{
  name: "get_host_metric",
  description: `ホストのメトリックを取得します。

サポートされているメトリック:
- cpu_usage: CPU使用率
- memory_usage: メモリ使用率
- disk_usage: ディスク使用率

以下のユーザーの質問に答えるためにこのツールを使用してください:
- ホストAはスケールアップが必要かどうか調査してください
- ホストBのパフォーマンスをグラフで表示してください
- ホストCのディスク使用率が高いか確認してください

<example>
- ホストAのCPU使用率を取得: get_host_metric("hostA", "cpu_usage")
- ホストBのメモリ使用率を取得: get_host_metric("hostB", "memory_usage")
</example>
  `,
  // ...
}
```

---

# 解決策2: エラー応答を詳細にする

### 悪い例

```json
{
  "code": 404,
  "message": "Not Found"
}
```

LLMにとって意味のない応答

---

## エラー応答をドキュメンテーションする

- なぜツールの呼び出しが失敗したのか、どのように問題を解決できるのかをマークダウン形式で返す
  - エラーコードやスタックトレースを返すのではなく、具体的かつ実用的な情報を提供
- エラー応答もプロンプトエンジニアリングの一種
- 必ずしも JSON 形式で返す必要はない

---

# 良いエラー応答の例

```typescript
server.registerTool("get_host_metric", async ({ host, metric }) => {
  try {
    // ...
  } catch (error) {
    const errorMessage = `## Metric Not Found

Your request failed because the specified metric name is invalid
or not available for this host.

## Error Summary

${error.message}

## Possible Causes

- The metric name contains typos or incorrect format
- The metric may not be available on this host
- The metric collection may not be enabled

## Resolving Metric Issues

- Check for typos in the metric name
- Verify the metric is available on this host type`;

    return {
      content: [{ type: "text", text: errorMessage }],
      isError: true,
    };
  }
});
```

---

# IDより人間が読める名前を使う

### 問題点

LLMは難解な識別子の処理が苦手

- UUID: `usr_1234567890`
- 英数字ID: `abc123xyz`

---

# 推奨されるアプローチ

### 良い例

```typescript
search_user_by_name("Alice");
get_product_by_name("iPhone 15 Pro");
```

### 悪い例

```typescript
get_user_by_id("usr_1234567890");
get_product_by_id("prod_abc123");
```

---

# 人間が読める名前のメリット

- LLMの理解精度が向上
- 幻覚(ハルシネーション)の軽減
- 検索タスクの精度向上

### 実装のポイント

内部的にIDに変換する処理を実装

---

# まとめ: MCP基礎知識

- MCPはツールのインターフェースを標準化
- クライアント・サーバーモデル
- JSON-RPC 2.0で通信
- リソース・プロンプト・ツールの3つの機能

---

# まとめ: 実装のポイント

- TypeScript SDKで簡単に実装可能
- MCP Inspectorでデバッグ
- Claude Desktopで実際に使用

---

# まとめ: 本番レベルの実装

- タスクベースで設計
- コンテキストサイズに注意
- descriptionをプロンプトエンジニアリング
- エラー応答を詳細に
- 人間が読める名前を使用

---

# 参考資料

- Model Context Protocol公式ドキュメント
  https://modelcontextprotocol.io/
- TypeScript SDK
  https://github.com/modelcontextprotocol/typescript-sdk
- Writing Tools for Agents
  https://www.anthropic.com/engineering/writing-tools-for-agents
- The second wave of MCP: Building for LLMs, not developers
  https://vercel.com/blog/the-second-wave-of-mcp-building-for-llms-not-developers
- やさしい MCP 入門
  https://www.shuwasystem.co.jp/book/9784798075730.html

---

<div class="center">

# ご清聴ありがとうございました

</div>
