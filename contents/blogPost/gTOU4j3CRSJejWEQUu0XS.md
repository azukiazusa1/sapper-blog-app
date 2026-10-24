---
id: gTOU4j3CRSJejWEQUu0XS
title: "AI SDK の MCP Events 対応で MCP サーバーからのイベントを Webhook で受け取る"
slug: "ai-sdk-mcp-events"
about: "MCP のクライアントがサーバー側の変化を知るには、ポーリングするか接続を張り続ける必要がありました。MCP Events はサーバーが購読者へイベントを通知するための実験的な拡張で、poll、push、webhook の 3 つの配信モードを定義しています。この記事では MCP Events の概要を説明したうえで、AI SDK の webhook モードの対応を使ってイベントの購読から受信、購読の更新と解除までを試します。"
createdAt: "2026-10-24T21:50+09:00"
updatedAt: "2026-10-24T21:50+09:00"
tags: ["MCP", "AI SDK"]
thumnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/K4CKh0jgHGQH8eXXqADmU/3fa90cffef6dc212bd1efcc0c7f754e4/fish_aji_osashimi_15754-768x591.png"
  title: "アジのお刺身のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "記事のサンプルで、Webhook の受信エンドポイントに express.json() ではなく express.raw() を使っている理由はどれですか?"
      answers:
        - text: "署名の検証には受信したままのバイト列が必要で、JSON としてパースしてから文字列に戻すと一致しなくなるため"
          correct: true
          explanation: "記事の通り、Standard Webhooks の署名は受信した本文のバイト列に対して計算されるため、パースし直した文字列では署名検証に失敗します。"
        - text: "MCP Events のイベントは JSON ではなくバイナリ形式で送られるため"
          correct: false
          explanation: "イベントや制御メッセージは content-type: application/json の JSON として POST されます。"
        - text: "express.json() では mcp_event_subscription クエリパラメータが削除されるため"
          correct: false
          explanation: "ボディパーサーはクエリパラメータに影響しません。サンプルでは req.originalUrl を使ってクエリパラメータごとハンドラーへ渡しています。"
        - text: "express.raw() を使うと challenge への応答が自動で返されるため"
          correct: false
          explanation: "challenge への応答は experimental_createMCPEventWebhook で作ったハンドラーが行います。express.raw() は本文を Buffer のまま受け取るだけです。"

published: true
---

Model Context Protocol (MCP) のツールは、クライアントがサーバーに処理を依頼するための仕組みです。反対に、サーバー側で何かが起きたことをクライアントが知るには、定期的にツールを呼び出して確認するか、接続を張り続けて通知を待つしかありませんでした。Slack に新しいメッセージが届いた、PagerDuty でインシデントが起きた、といった出来事にエージェントが反応するには、この仕組みでは不十分です。

この問題を解決するために、MCP の Triggers & Events Working Group が MCP Events という拡張を提案しています。Vercel の AI SDK（`@ai-sdk/mcp`）は、2026 年 10 月に MCP Events の webhook モードへ実験的に対応しました。

この記事では、MCP Events の概要と、AI SDK を使ってイベントの購読、Webhook での受信、購読の更新と解除までを試します。

:::warning
MCP Events は 2026 年 10 月 23 日時点で正式な仕様ではありません。設計ドラフトを SEP（Specification Enhancement Proposal）にした [SEP-3415](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415) はレビュー中です。AI SDK の API も `experimental_` が付いた実験的な API であり、今後変更される可能性があります。
:::

## MCP Events とは

[MCP Events](https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md) は、MCP クライアントが上流システムで起きた出来事を購読し、出来事が起きたときにサーバーから通知を受け取るための拡張です。設計ドラフトは、ユーザーがその場にいなくてもエージェントがイベントに反応できることを目的に掲げています。

サーバーは `events/list` で提供するイベントの種類を公開します。各イベントは次の情報を持ちます。

- `name`: `incident.created` のようなイベント名
- `inputSchema`: 購読時に渡す引数の JSON Schema。ツールの `inputSchema` と同じ形にそろえられている
- `payloadSchema`: 届くイベントの `data` の JSON Schema
- `delivery`: 対応する配信モードの配列

クライアントは `name` と `arguments` の組で購読し、`{ eventId, name, timestamp, data, cursor }` という形のイベントを受け取ります。

### 3 つの配信モード

MCP Events は配信モードを 3 つ定義しています。サーバーはイベントごとに対応するモードを宣言します。

| モード  | メソッド           | 仕組み                                                                                 |
| ------- | ------------------ | -------------------------------------------------------------------------------------- |
| poll    | `events/poll`      | クライアントがカーソルを渡して定期的に問い合わせる。サーバーは `nextPollMs` で次の問い合わせ間隔を指示する |
| push    | `events/stream`    | 長時間開いたままのリクエストを通して、サーバーが `notifications/events/event` を送る      |
| webhook | `events/subscribe` | クライアントがコールバック URL を登録し、サーバーがイベントを署名付きで POST する         |

クライアントは最後に受け取ったカーソルを保存しておき、再接続や購読の更新時に渡すと、サーバーはその位置から配信を再開します。

### webhook モードの流れ

AI SDK が対応しているのは webhook モードだけなので、webhook モードの流れを詳しく見ておきます。

1. クライアントは `events/subscribe` でイベント名、引数、コールバック URL、署名用のシークレットを送る
2. 認証された主体とコールバック URL の組がまだ検証されていなければ、サーバーは `{"type":"verification","challenge":"..."}` を POST する。受信側は `challenge` をそのまま返して、配信を受け取る意思を示す
3. 検証に成功すると、サーバーは購読 ID、`refreshBefore`（購読の期限）、`cursor`、`truncated` を返す
4. イベントが起きるたびに、サーバーはコールバック URL へ署名付きのリクエストを POST する
5. クライアントは `refreshBefore` より前に同じ内容で `events/subscribe` を再送して購読を延長する。不要になったら `events/unsubscribe` で解除する。延長しなければ購読は期限切れで消える

コールバック URL には、イベント本体のほかに 2 種類の制御メッセージも届きます。`{"type":"gap"}` は、一部のイベントがリプレイできず失われたことを示します。`{"type":"terminated"}` は、権限の取り消しなどでサーバーが購読を終了したことを示します。

## AI SDK で MCP Events を購読する

AI SDK では、[vercel/ai#22155](https://github.com/vercel/ai/pull/22155) で MCP Events の webhook モードへの対応が追加されました。Pull Request の説明では、OpenAI が [ChatGPT で MCP Events に対応した](https://developers.openai.com/plugins/build/mcp-events) ことが背景として挙げられています。

AI SDK の MCP Events 対応は、次の 3 つで構成されます。

- `client.experimental_events`: `createMCPClient` で作成したクライアントから、`list()`、`subscribe()`、`refresh()`、`unsubscribe()` を呼び出す
- `experimental_createMCPEventWebhook`: challenge に応答して署名を検証し、検証済みのイベントをコールバックに渡す Webhook ハンドラーを作る
- `Experimental_MCPEventStore`: 購読 ID、コールバック URL、シークレット、カーソルを保存するストア。MCP クライアントと Webhook ハンドラーが同じストアを共有する

ストアは MCP の仕様にはない、AI SDK 独自の概念です。クライアントが生成したシークレットを Webhook ハンドラーが読み取って署名を検証するために、両者で共有する保存先が必要になります。

### サンプルの構成

ここからは、`comment.created` イベントを提供する MCP サーバーと、AI SDK でイベントを購読するクライアントを作成します。2026 年 10 月 23 日時点で MCP Events に対応した公開 MCP サーバーは見つからなかったため、サーバーも自作します。サーバーは [AI SDK の公式サンプル](https://github.com/vercel/ai/tree/main/examples/mcp/src/events) を参考にしています。

プロジェクトを作成して依存関係をインストールします。

```bash
mkdir ai-sdk-mcp-events && cd ai-sdk-mcp-events
npm init -y
npm pkg set type=module
npm install @ai-sdk/mcp@2.0.80 @modelcontextprotocol/server@2.3.1 @modelcontextprotocol/node@2.1.1 express@5.3.0 zod@4.6.7
npm install -D tsx @types/express @types/node
```

作成するファイルは次の 3 つです。

```
src/
├── server.ts  # comment.created を webhook で配信する MCP サーバー
├── store.ts   # AI SDK の購読ストア
└── client.ts  # 購読と Webhook の受信を行うアプリケーション
```

### MCP サーバーを実装する

まずは MCP Events に対応した MCP サーバーを作ります。TypeScript SDK の `setRequestHandler` を使い、`events/*` をカスタムのリクエストハンドラーとして登録します。

```ts:src/server.ts
import {
  McpServer,
  createMcpHandler,
  ProtocolError,
  type ServerCapabilities,
} from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import {
  createHash,
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import express from "express";
import * as z from "zod/v4";

const token = process.env.MCP_EVENTS_TOKEN ?? "local-events-demo";
const RECEIVER_ORIGIN = "http://127.0.0.1:3003";
const MAX_TTL_MS = 60_000;
// Standard Webhooks の署名用シークレットに付く接頭辞
const SECRET_PREFIX = "whsec" + "_";

type Subscription = {
  id: string;
  documentId: string;
  url: string;
  secret: string;
  expiresAt: number;
};
const subscriptions = new Map<string, Subscription>();

const argumentsSchema = z.object({ document_id: z.string() }).strict();
const eventDefinition = {
  name: "comment.created",
  description: "ドキュメントに新しいコメントが投稿されたときに発生します",
  delivery: ["webhook"],
  inputSchema: z.toJSONSchema(argumentsSchema),
  payloadSchema: {
    type: "object",
    properties: {
      document_id: { type: "string" },
      text: { type: "string" },
    },
    required: ["document_id", "text"],
  },
};

// Standard Webhooks の署名を付けて POST する
async function deliver(
  subscription: Subscription,
  webhookId: string,
  body: unknown,
) {
  // デモのため、ループバックの受信先以外には送らない (本来は配信時の SSRF 対策が必要)
  const url = new URL(subscription.url);
  if (url.origin !== RECEIVER_ORIGIN) {
    throw new Error(`This demo only delivers to ${RECEIVER_ORIGIN}`);
  }
  const payload = JSON.stringify(body);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = createHmac(
    "sha256",
    Buffer.from(subscription.secret.slice(SECRET_PREFIX.length), "base64"),
  )
    .update(`${webhookId}.${timestamp}.${payload}`)
    .digest("base64");
  return fetch(url, {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
    headers: {
      "content-type": "application/json",
      "webhook-id": webhookId,
      "webhook-timestamp": timestamp,
      "webhook-signature": `v1,${signature}`,
      "X-MCP-Subscription-Id": subscription.id,
    },
    body: payload,
  });
}

function createServer() {
  // MCP Server が MCP Events をサポートしていることを示すため、capabilities に events を空で追加する
  const capabilities: ServerCapabilities & { events: Record<string, never> } =
    { events: {} };
  const server = new McpServer(
    { name: "mcp-events-sample", version: "1.0.0" },
    { capabilities },
  );

  // events/list では、comment.created イベントの定義を返す
  server.server.setRequestHandler(
    "events/list",
    { params: z.object({}) },
    async () => ({ events: [eventDefinition] }),
  );

  // events/subscribe では、購読を登録して challenge を送る
  server.server.setRequestHandler(
    "events/subscribe",
    {
      params: z.object({
        name: z.literal("comment.created"),
        arguments: argumentsSchema,
        delivery: z.object({
          mode: z.literal("webhook"),
          url: z.url(),
          secret: z
            .string()
            .regex(new RegExp(`^${SECRET_PREFIX}[A-Za-z0-9+/]+={0,2}$`)),
        }),
        cursor: z.string().nullish(),
        ttlMs: z.number().int().positive().nullish(),
      }),
    },
    async (input) => {
      const secretBytes = Buffer.from(
        input.delivery.secret.slice(SECRET_PREFIX.length),
        "base64",
      );
      if (secretBytes.length < 24 || secretBytes.length > 64) {
        throw new ProtocolError(-32602, "Invalid signing secret");
      }

      // (principal, url, name, arguments) から決定的に ID を導出する
      const id = `sub_${createHash("sha256")
        .update(
          JSON.stringify([
            token,
            input.delivery.url,
            input.name,
            input.arguments,
          ]),
        )
        .digest("hex")
        .slice(0, 24)}`;
      const subscription: Subscription = {
        id,
        documentId: input.arguments.document_id,
        url: input.delivery.url,
        secret: input.delivery.secret,
        // クライアントの希望 (ttlMs) を上限 60 秒に切り詰めて付与する
        expiresAt:
          Date.now() + Math.min(input.ttlMs ?? MAX_TTL_MS, MAX_TTL_MS),
      };

      // 未検証の受信先には、配信を始める前に challenge を送って意思を確認する
      if (!subscriptions.has(id)) {
        const challenge = randomUUID();
        const response = await deliver(
          subscription,
          `msg_verification_${randomUUID()}`,
          { type: "verification", challenge },
        );
        const verificationFailed = () =>
          new ProtocolError(-32027, "Callback verification failed", {
            reason: "challenge_failed",
          });
        // 失敗時のレスポンスは本文が JSON とは限らないため、先にステータスを確認する
        if (!response.ok) throw verificationFailed();
        const echoed = Buffer.from(
          z.object({ challenge: z.string() }).parse(await response.json())
            .challenge,
        );
        const expected = Buffer.from(challenge);
        if (
          echoed.length !== expected.length ||
          !timingSafeEqual(echoed, expected)
        ) {
          throw verificationFailed();
        }
        console.log("[server] challenge verified:", id);
      }

      subscriptions.set(id, subscription);
      console.log(
        "[server] subscription active until",
        new Date(subscription.expiresAt).toISOString(),
      );
      return {
        id,
        refreshBefore: new Date(subscription.expiresAt).toISOString(),
        cursor: null, // このサーバーはリプレイに対応しない
        truncated: false,
      };
    },
  );

  // events/unsubscribe では、購読を解除する
  server.server.setRequestHandler(
    "events/unsubscribe",
    {
      params: z.object({
        name: z.literal("comment.created"),
        arguments: argumentsSchema,
        delivery: z.object({ mode: z.literal("webhook"), url: z.string() }),
      }),
    },
    async (input) => {
      const subscription = [...subscriptions.values()].find(
        (s) =>
          s.url === input.delivery.url &&
          s.documentId === input.arguments.document_id,
      );
      if (!subscription) {
        throw new ProtocolError(-32023, "Subscription not found", {
          kind: "subscription",
        });
      }
      subscriptions.delete(subscription.id);
      console.log("[server] unsubscribed:", subscription.id);
      return {};
    },
  );

  return server;
}

// イベントの発生をエミュレートする関数
async function publishComment(documentId: string, text: string) {
  const event = {
    eventId: `evt_${randomUUID()}`,
    name: "comment.created",
    timestamp: new Date().toISOString(),
    data: { document_id: documentId, text },
    cursor: null,
  };
  for (const subscription of subscriptions.values()) {
    if (
      subscription.expiresAt <= Date.now() ||
      subscription.documentId !== documentId
    )
      continue;
    const response = await deliver(subscription, event.eventId, event);
    console.log("[server] delivered", event.eventId, "->", response.status);
  }
}

const handler = toNodeHandler(createMcpHandler(createServer));
const app = express();

app.all("/mcp", async (req, res) => {
  if (req.get("authorization") !== `Bearer ${token}`) {
    res.status(401).end();
    return;
  }
  await handler(req, res);
});

// このエンドポイントが呼ばれると、comment.created イベントが発生したことを模して購読者へ配信する
app.post("/admin/comments", express.json(), async (req, res) => {
  await publishComment(req.body.document_id, req.body.text);
  res.status(202).end();
});

app.listen(3002, "127.0.0.1", () => {
  console.log("[server] MCP server: http://127.0.0.1:3002/mcp");
});
```

押さえておきたい点は次のとおりです。

- `capabilities` に `events` を宣言している。AI SDK の `list()` は、サーバーの capabilities に `events` がないと `Server does not support events` というエラーを投げる
- `events/subscribe` では、初めての購読先に challenge を POST し、同じ値が返ってきた場合だけ購読を受け付ける
- 購読 ID はトークン、コールバック URL、イベント名、引数から決定的に導出する。設計ドラフトでは、認証された主体、コールバック URL、イベント名、引数の 4 つがすべて同じ購読を「同じ購読」とみなす。同じ 4 つの値で `events/subscribe` を再送すると、新しい購読は作られず、既存の購読の期限が延長される

:::warning
このサーバーはデモのため、ループバックアドレスへの HTTP 配信だけを許可しています。設計ドラフトでは、コールバック URL を HTTPS に限ることに加えて、SSRF（Server-Side Request Forgery）を防ぐために配信のたびに解決先の IP アドレスを検証すること、リダイレクトを追わないことを求めています。
:::

### 購読ストアを実装する

クライアントが生成したシークレットをハンドラーが読み出して署名を検証できるよう、両者が共有する保存先としてストアが必要になります。ストアは `Experimental_MCPEventStore` インターフェースを実装します。

`Experimental_MCPEventStore` は `get`、`getById`、`set`、`update`、`delete` の 5 つのメソッドを持つインターフェースです。ここではクライアントと Webhook ハンドラーが同じプロセスで動くため、`Map` を使ったメモリ上のストアにします。

```ts:src/store.ts
import type {
  Experimental_MCPEventStore as MCPEventStore,
  Experimental_MCPEventSubscription as MCPEventSubscription,
} from "@ai-sdk/mcp";

// 本番では共有された永続ストレージを使う
export class InMemoryEventStore implements MCPEventStore {
  private records = new Map<string, MCPEventSubscription>();

  async get(key: string) {
    return this.records.get(key);
  }

  async getById(id: string) {
    return [...this.records.values()].find((record) => record.id === id);
  }

  async set(subscription: MCPEventSubscription) {
    this.records.set(subscription.key, subscription);
  }

  async update(key: string, patch: Partial<MCPEventSubscription>) {
    const current = this.records.get(key);
    if (!current) throw new Error(`Unknown subscription: ${key}`);
    this.records.set(key, { ...current, ...patch });
  }

  async delete(key: string) {
    this.records.delete(key);
  }
}
```

保存される `MCPEventSubscription` には、署名用のシークレットが含まれます。このレコードは公開されないように注意してください。

### Webhook ハンドラーを作成して購読する

最後にクライアント側のコードを実装しましょう。購読の登録、Webhook での受信、購読の更新と解除までを行います。

```ts:src/client.ts
import {
  createMCPClient,
  experimental_createMCPEventWebhook,
} from "@ai-sdk/mcp";
import express from "express";
import { InMemoryEventStore } from "./store.ts";

const MCP_URL = "http://127.0.0.1:3002/mcp";
const CALLBACK_URL = "http://127.0.0.1:3003/mcp-events";

const eventStore = new InMemoryEventStore();
const createClient = () =>
  createMCPClient({
    transport: {
      type: "http",
      url: MCP_URL,
      headers: { Authorization: "Bearer local-events-demo" },
    },
    experimental_events: { store: eventStore },
  });

// 1. Webhook ハンドラーを作成する
let resolveReceived: () => void;
const received = new Promise<void>((resolve) => (resolveReceived = resolve));

const webhook = experimental_createMCPEventWebhook({
  store: eventStore,
  async onEvent({ subscription, event }) {
    console.log(
      "[client] onEvent:",
      subscription.id,
      event.eventId,
      event.data,
    );
    resolveReceived();
  },
  async onGap({ subscription, gap }) {
    console.log("[client] onGap:", subscription.id, gap.cursor);
  },
  async onTerminated({ subscription, termination }) {
    console.log("[client] onTerminated:", subscription.id, termination.error);
  },
});

// 2. 購読より先に受信エンドポイントを公開する
const app = express();
app.post(
  "/mcp-events",
  // 署名検証には受信したままのバイト列が必要なので JSON としてパースしない
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const response = await webhook(
      new Request(`http://127.0.0.1:3003${req.originalUrl}`, {
        method: "POST",
        headers: req.headers as Record<string, string>,
        body: new Uint8Array(req.body),
      }),
    );
    console.log(
      "[client] webhook",
      req.originalUrl,
      req.body.includes('"challenge"') ? "challenge" : "event",
      "->",
      response.status,
    );
    res.status(response.status);
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.send(Buffer.from(await response.arrayBuffer()));
  },
);
const receiver = app.listen(3003, "127.0.0.1");

// 3. イベントの一覧を取得して購読する
const client = await createClient();
const { events } = await client.experimental_events.list();
console.log(
  "[client] events/list:",
  events.map((e) => ({ name: e.name, delivery: e.delivery })),
);

const subscription = await client.experimental_events.subscribe({
  name: "comment.created",
  arguments: { document_id: "doc_123" },
  delivery: {
    mode: "webhook",
    url: CALLBACK_URL,
    allowInsecureLocalhost: true, // ローカル検証用。本番は HTTPS
  },
  ttlMs: 5 * 60 * 1000,
});
console.log("[client] subscribed:", subscription);

// 4. MCP クライアントを閉じても購読は残る
await client.close();
console.log("[client] MCP client closed");

// 5. イベントを発生させる
await fetch("http://127.0.0.1:3002/admin/comments", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    document_id: "doc_123",
    text: "レビューお願いします",
  }),
});
await received;

// 6. 新しいクライアントで更新と購読解除を行う (ストアに保存した情報を使う)
const client2 = await createClient();
const refreshed = await client2.experimental_events.refresh({
  id: subscription.id,
});
console.log("[client] refreshed refreshBefore:", refreshed.refreshBefore);
await client2.experimental_events.unsubscribe({ id: subscription.id });
console.log(
  "[client] unsubscribed. store:",
  await eventStore.getById(subscription.id),
);
await client2.close();
receiver.close();
```

`experimental_createMCPEventWebhook` は、Web 標準の `Request` を受け取って `Response` を返す関数を作ります。`express.json()` で一度パースしてから文字列に戻すと、受信したバイト列と一致せず署名検証に失敗します。そのため `express.raw()` で受け取っています。

`subscribe()` は `events/subscribe` を送る前に、次の処理を行います。

- `whsec` で始まる Standard Webhooks 形式のシークレットを生成し、ストアに `status: 'pending'` のレコードとして保存する
- コールバック URL に `mcp_event_subscription` というクエリパラメータを付ける

サーバーが challenge を送ってくる時点では、まだ `events/subscribe` のレスポンスが返っていないため、購読 ID は決まっていません。Webhook ハンドラーはこのクエリパラメータを手がかりにストアからシークレットを探し、challenge の署名を検証します。そのため受信側では、クエリパラメータを消さずにハンドラーへ渡す必要があります。

## 実際に動かす

2 つのターミナルを開き、MCP サーバーとクライアントを順に起動します。

```bash
npx tsx src/server.ts
```

```bash
npx tsx src/client.ts
```

クライアント側には次のログが出力されました。

```text
[client] events/list: [ { name: 'comment.created', delivery: [ 'webhook' ] } ]
[client] webhook /mcp-events?mcp_event_subscription=0372055a-2fd8-44e9-b0fb-b061f4d60219 challenge -> 200
[client] subscribed: {
  _meta: {
    'io.modelcontextprotocol/serverInfo': { name: 'mcp-events-sample', version: '1.0.0' }
  },
  resultType: 'complete',
  id: 'sub_2655a0119fa679bb74954405',
  refreshBefore: '2026-10-23T12:51:31.990Z',
  cursor: null,
  truncated: false
}
[client] MCP client closed
[client] onEvent: sub_2655a0119fa679bb74954405 evt_92b2465d-db46-49db-a841-7f8644a85136 { document_id: 'doc_123', text: 'レビューお願いします' }
[client] webhook /mcp-events?mcp_event_subscription=0372055a-2fd8-44e9-b0fb-b061f4d60219 event -> 204
[client] refreshed refreshBefore: 2026-10-23T12:51:32.045Z
[client] unsubscribed. store: undefined
```

サーバー側のログは次のとおりです。

```text
[server] MCP server: http://127.0.0.1:3002/mcp
[server] challenge verified: sub_2655a0119fa679bb74954405
[server] subscription active until 2026-10-23T12:51:31.990Z
[server] delivered evt_92b2465d-db46-49db-a841-7f8644a85136 -> 204
[server] subscription active until 2026-10-23T12:51:32.045Z
[server] unsubscribed: sub_2655a0119fa679bb74954405
```

ログから、次のことが確認できます。

- `subscribe()` のレスポンスより先に challenge が届き、Webhook ハンドラーが 200 で応答している。URL には `mcp_event_subscription` が付いている
- クライアントは 5 分の購読期限を希望したが、サーバーは上限の 60 秒で切り詰めた `refreshBefore` を返している。購読の期限はサーバーの返した値が採用される
- `client.close()` で MCP の接続を閉じたあとでも、イベントは Webhook に届き、`onEvent` が呼ばれている。Webhook ハンドラーは `onEvent` が成功したあと 204 を返している
- 別のクライアントインスタンス（`client2`）からでも、購読 ID だけで `refresh()` と `unsubscribe()` を呼び出せている。コールバック URL、引数、シークレットはストアから読み出されている。購読を解除すると、ストアからもレコードが削除される

2 回目の `events/subscribe` では challenge が送られていません。設計ドラフトでは、検証は認証された主体とコールバック URL の組ごとに一度行えばよく、購読を更新するたびにやり直す必要はありません。このサーバーはこれを簡略化し、同じ購読 ID が登録済みかどうかで検証を省略するかを判定しています。AI SDK は `subscribe()` を呼ぶたびに新しい `mcp_event_subscription` を URL に付けるため、新しく購読し直した場合はコールバック URL が変わり、再び challenge が送られます。

また、このサーバーは gap や terminated の制御メッセージを送らないため、`onGap` と `onTerminated` は今回の実行では呼ばれていません。

## まとめ

- MCP Events は、MCP サーバーが上流システムで起きた出来事を購読者へ通知するための拡張で、2026 年 10 月 23 日時点では SEP-3415 としてレビュー中の実験的な仕様である
- MCP Events は poll、push、webhook の 3 つの配信モードを定義している
- webhook モードでは、クライアントが生成したシークレットで Standard Webhooks 形式の署名を付け、配信を始める前に challenge で受信側の同意を確認する
- AI SDK の `@ai-sdk/mcp` は webhook モードだけに対応しており、`client.experimental_events` で購読し、`experimental_createMCPEventWebhook` で受信する
- MCP クライアントと Webhook ハンドラーは `Experimental_MCPEventStore` を共有し、ストアに保存されたシークレットとクエリパラメータ `mcp_event_subscription` で、購読 ID が決まる前の challenge も検証する
- MCP クライアントを `close()` しても Webhook への配信は止まらないため、`unsubscribe()` で明示的に解除するか期限切れを待つ必要がある

## 参考

- [MCP Events — Design Sketch](https://github.com/modelcontextprotocol/experimental-ext-triggers-events/blob/main/docs/design-sketch-proposal.md)
- [modelcontextprotocol/experimental-ext-triggers-events](https://github.com/modelcontextprotocol/experimental-ext-triggers-events)
- [SEP-3415: Events Extension](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/3415)
- [Standard Webhooks](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md)
- [MCP Events | AI SDK](https://ai-sdk.dev/docs/ai-sdk-core/mcp-events)
- [MCP Events リファレンス | AI SDK](https://ai-sdk.dev/docs/reference/ai-sdk-core/mcp-events)
- [Receive MCP Webhook Events | AI SDK](https://ai-sdk.dev/cookbook/node/mcp-events)
- [feat(mcp): add compatibility for webhook based mcp events · vercel/ai#22155](https://github.com/vercel/ai/pull/22155)
- [vercel/ai examples/mcp/src/events](https://github.com/vercel/ai/tree/main/examples/mcp/src/events)
- [MCP events | OpenAI Developers](https://developers.openai.com/plugins/build/mcp-events)
