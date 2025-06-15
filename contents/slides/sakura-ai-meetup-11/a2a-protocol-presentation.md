---
marp: true
theme: default
class: invert
style: |
  section {
    font-size: 28px;
    background-color: #1a1a1a;
    color: #ffffff;
  }
  h1 {
    font-size: 48px;
    color: #00d4ff;
  }
  h2 {
    font-size: 40px;
    color: #00d4ff;
    position: absolute;
    top: 60px;
    left: 40px;
    right: 40px;
    margin: 0;
    margin-bottom: 20px;
  }
  h3 {
    font-size: 32px;
    color: #00d4ff;
  }
  code {
    background-color: #2d2d2d;
    color: #ffffff;
    font-size: 24px;
  }
  pre {
    background-color: #2d2d2d;
    color: #ffffff;
    font-size: 20px;
  }
  ul li {
    font-size: 28px;
    margin-bottom: 10px;
  }
---

# A2A プロトコルを試してみる

TypeScript による実装と体験

<!--
こんにちは。本日はお忙しい中お時間をいただき、ありがとうございます。
私は azukiazusa と申します。今日は「A2A プロトコルを試してみる」というテーマで、TypeScript を使った実装と体験についてお話しさせていただきます。
20分という限られた時間ですが、A2A プロトコルの概要から実際の実装、そして便利なフレームワークまでご紹介いたします。
-->

---

# 自己紹介

- azukiazusa
- https://azukiazusa.dev
- FE（フロントエンド|ファイアーエムブレム）が好き

![bg right:40% w:300px](./images/azukiazusa.png)

<!-- はじめに簡単に自己紹介です。普段 azukiazusa という名前で活動していています。azukiazusa.dev というブログを運営して、このブログSvelte で作っていて、Svelte 歴は 4 年ほどになります。好きなものはフロントエンドとファイアーエムブレムです。 -->

---

## Agent2Agent（A2A）プロトコルとは

AI エージェント間の連携を標準化するプロトコル

- Google が開発・発表
- 異なるベンダーのエージェント同士が連携
- 標準的な HTTP 上に構築

<!--
まず、A2A プロトコルとは何かについてご説明いたします。
Agent2Agent プロトコル、略して A2A は、AI エージェント間の連携を標準化するために設計されたプロトコルです。
これは Google が開発・発表したもので、異なるベンダーや組織が開発した AI エージェント同士が、統一された方法で通信できるようにするものです。
重要なのは、標準的な HTTP の上に構築されているということです。これにより、既存の Web 技術の上で実装できるという利点があります。
-->

---

## なぜ A2A が必要か？

AI エージェントが効果的に目的を達成するために

- 旅行計画の例：
  - 天気予報を調べる
  - 宿泊先を予約する
  - 交通機関を予約する

<!--
では、なぜ A2A プロトコルが必要なのでしょうか。
AI エージェントが効果的に目的を達成するためには、多様なエージェントがエコシステム内で連携することが重要です。
例えば、旅行の計画を立てる場合を考えてみてください。
天気予報を調べて最適な日程を決める、宿泊先を検索・比較して予約する、交通機関の空き状況を確認して予約するなど、
それぞれ異なる専門性を持ったエージェントが協力することで、より良い結果を得ることができます。
現在のように各エージェントが独立して動作するだけでは、このような複雑な連携は困難です。
-->

---

## 既存プロトコルとの関係

- **MCP**: エージェントとツールの接続
- **A2A**: エージェント同士の通信

競合ではなく**補完**関係

<!--
AI エージェントの通信プロトコルといえば、既に Model Context Protocol、MCP が存在しています。
ここで重要なのは、A2A と MCP は競合するものではなく、むしろ補完し合う関係だということです。
MCP はエージェントとツールやデータソースの間の接続を標準化するのに対し、
A2A はエージェント同士の通信を標準化します。
つまり、MCP でエージェントが外部ツールを使えるようになり、A2A で複数のエージェントが連携できるようになるという形で、
両方を組み合わせることでより強力なマルチエージェントシステムを構築できるのです。
-->

---

## A2A の 3 つのアクター

1. **ユーザー**: 指示を出す人間
2. **A2A クライアント**: ユーザーに代わってリクエストを開始
3. **A2A サーバー**: タスクを処理しレスポンスを提供

<!--
A2A プロトコルでは、3つのアクターが登場します。
まず「ユーザー」。これは目的を達成するためにエージェントに指示を出す人間です。
次に「クライアント」。これはユーザーに代わってエージェントにアクションを要求する役割を担います。
そして「リモートエージェント」。これはサーバー側でクライアントからのリクエストを受け取り、実際にアクションを実行します。
この構造により、ユーザーは直接複数のエージェントを管理する必要がなく、
クライアントが仲介役となって適切なエージェントに処理を依頼することができます。
-->

---

## AgentCard

エージェントの機能を記述するメタデータ

- エージェントの名前・説明
- 提供するスキル
- 認証メカニズム
- `/.well-known/agent.json` でホスト

---

## 今回の実装：サイコロエージェント

TypeScript で A2A 準拠のサーバーを構築

- **機能**: サイコロを振る
- **技術**: Hono + Vercel AI SDK
- **モデル**: Google Gemini

<!--
それでは実際に A2A プロトコルを体験してみましょう。
今回は TypeScript を使って、サイコロを振る機能を持つエージェントを実装します。
シンプルな機能ですが、A2A プロトコルの全体的な流れを理解するには十分です。
技術スタックとしては、Web サーバーに Hono、AI 機能に Vercel AI SDK、そして LLM として Google Gemini を使用します。
これらはすべて TypeScript で開発できるので、フロントエンドエンジニアの方にも馴染みやすいかと思います。
-->

---

## プロジェクトセットアップ

```bash
npm init -y
npm install ai @ai-sdk/google zod hono @hono/node-server
npm install --save-dev @types/node tsx typescript
```

**環境変数**
```bash
export GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

---

## AgentCard の実装

```typescript
export const agentCard: AgentCard = {
  name: "Dice Agent",
  description: "サイコロを振るエージェント",
  url: "https://localhost:3000",
  version: "1.0.0",
  defaultInputModes: ["text"],
  defaultOutputModes: ["text"],
  skills: [{
    id: "dice-roll",
    name: "サイコロを振る",
    description: "1から6までの整数を返す",
    tags: ["dice", "random"]
  }]
};
```

---

## サーバー実装

```typescript
app.get("/.well-known/agent.json", (c) => {
  return c.json(agentCard);
});

app.route("/", taskApp);
```

AgentCard を公開し、タスク処理を開始

---

## Task オブジェクト

クライアントとサーバー間の通信を管理

- **ステートフル**: 状態を保持
- **履歴管理**: 会話履歴を記録
- **アーティファクト**: 最終結果を保存

---

## Task の状態遷移

- `submitted`: 提出済み
- `working`: 処理中
- `input-required`: 入力待ち
- `completed`: 完了
- `failed`: 失敗
- `canceled`: キャンセル
- `rejected`: 拒否
- `auth-required`: 認証必要

---

## JSON-RPC 形式の通信

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tasks/send",
  "params": {
    "id": "uuid",
    "message": {
      "role": "user",
      "parts": [{"type": "text", "text": "サイコロを振って"}]
    }
  }
}
```

---

## サイコロツールの実装

```typescript
const dice = tool({
  description: "入力された面数のサイコロを振ります",
  parameters: z.object({
    dice: z.number().min(1).default(6)
  }),
  execute: async ({ dice = 6 }) => {
    return Math.floor(Math.random() * dice) + 1;
  }
});
```

---

## AI エージェントの実装

```typescript
const result = await generateText({
  model: google("gemini-2.5-pro-exp-03-25"),
  tools: { dice },
  maxSteps: 5,
  messages: [/* ユーザーメッセージ */]
});
```

LLM がツールを呼び出してサイコロを振る

---

## クライアント実装

```typescript
export class A2AClient {
  async sendTask(params: TaskSendParams): Promise<any> {
    const response = await fetch(`${this.baseUrl}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "tasks/send",
        params
      })
    });
    return response.json();
  }
}
```

---

## CLI ツールの作成

```typescript
const agentCard = await client.agentCard();
const tools: ToolSet = {};

for (const skill of agentCard.skills) {
  tools[skill.id] = tool({
    description: skill.description,
    execute: async ({ input }) => {
      return await client.sendTask({
        message: { role: "user", parts: [{ type: "text", text: input }] }
      });
    }
  });
}
```

---

## 実行結果

```bash
あなた: サイコロを振って
AI: サイコロを振った結果は 4 でした！

もう一度振りますか？
```

リモートエージェントと正常に通信完了

---

## JavaScript SDK

https://github.com/google-a2a/a2a-js

```bash
npm install @a2a-js/sdk
```
<!--
A2A プロトコルのクライアント SDK も提供されています。
これを使うことで、A2A 準拠のエージェントと簡単に通信できます。
-->

---

## AgentExecutor クラスを継承する

```typescript
import { AgentExecutor } from "@a2a-js/sdk";

export class DiceAgent extends AgentExecutor {
  private cancelledTasks = new Set<string>();

  public cancelTask = async (
      taskId: string,
      eventBus: ExecutionEventBus,
  ): Promise<void> => {
      this.cancelledTasks.add(taskId);
  };

  async execute(
    requestContext: RequestContext,
    eventBus: ExecutionEventBus
  ): Promise<void> {
    // タスクの実行ロジック
  }
}
```

<!--
JavaScript SDK では `AgentExecutor` クラスを継承して独自のエージェントを実装できます。
開発者は `execute` メソッドと `cancelTask` メソッドを実装することが求められます。
`cancelTask` 引数で渡された task をキャンセルするメカニズムを提供します。
-->

---
## `execute` メソッドの実装


---

## サーバーを起動

```typescript
const taskStore: TaskStore = new InMemoryTaskStore();
const agentExecutor: AgentExecutor = new MyAgentExecutor();

const requestHandler = new DefaultRequestHandler(
  coderAgentCard,
  taskStore,
  agentExecutor
);

const appBuilder = new A2AExpressApp(requestHandler);
const expressApp = appBuilder.setupRoutes(express(), '');
expressApp.listen(3000, () => {
  console.log("A2A server is running on https://localhost:3000");
});
```
<!--
A2A プロトコルのサーバーを起動するためのコードです。
このコードでは、`AgentExecutor` クラスを継承して独自のエージェントを実装し、
`DefaultRequestHandler` を使ってリクエストを処理します。
-->

---

## セキュリティ要件

- **HTTPS 必須**: プロダクションでは HTTPS 通信が必須
- **認証**: エンタープライズレベルのセキュリティ対応
- **トークン管理**: out-of-band クレデンシャル管理

---

## Mastra での A2A サポート

TypeScript AI エージェントフレームワーク

- **自動対応**: 特別な設定不要
- **クライアント SDK**: `@mastra/client-js`
- **ストリーミング**: SSE による実時間更新

<!--
ここまで手動で A2A プロトコルを実装してきましたが、
実際のプロダクション環境では、より簡単に実装できるフレームワークを使いたいものです。
そこで Mastra というフレームワークをご紹介します。
Mastra は TypeScript で AI エージェントを構築するためのフレームワークで、
A2A プロトコルを標準でサポートしています。
特別な設定をしなくても、エージェントを作成するだけで自動的に A2A 準拠のサーバーが立ち上がります。
また、クライアント SDK も提供されているので、A2A プロトコルを使った通信も簡単に実装できます。
-->

---

## Mastra とは

TypeScript で AI エージェントを構築するフレームワーク

- エージェント、ツール、ワークフローの統合
- A2A プロトコル自動対応
- 豊富なプロバイダーサポート

---

## Mastra サーバーのセットアップ

```bash
npx create-mastra@latest my-mastra-app
cd my-mastra-app
npm run dev
```

- 自動的に A2A サーバーが起動
- `/.well-known/{agentId}/agent.json` でAgentCard公開
- ダッシュボードで管理

---

## Mastra エージェントの作成

```typescript
export const travelAgent = new Agent({
  name: "travel-agent",
  instructions: "旅行プランを提案するエージェント",
  model: anthropic("claude-4-sonnet-20250514"),
  tools: { weatherTool }
});
```

設定するだけで A2A 準拠エージェントが完成

---

## Mastra の AgentCard 取得

```typescript
const client = new MastraClient({
  baseUrl: "http://localhost:4111"
});

const a2a = client.getA2A("travelAgent");
const agentCard = await a2a.getCard();
```

---

## Mastra でのメッセージ送信

```typescript
const response = await a2a.sendMessage({
  id: crypto.randomUUID(),
  message: {
    role: "user",
    parts: [{ type: "text", text: "箱根旅行プランを提案して" }]
  }
});
```

---

## Mastra の便利な機能

- **タスク管理**: `getTask()` でポーリング
- **キャンセル**: `cancelTask()` で中断
- **ストリーミング**: `sendAndSubscribe()` でリアルタイム
- **型安全**: TypeScript 完全対応

---

## ストリーミング通信

```typescript
const response = await a2a.sendAndSubscribe({
  id: crypto.randomUUID(),
  message: { /* メッセージ */ }
});

const reader = response.body?.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(new TextDecoder().decode(value));
}
```

---


## まとめ

- A2A はエージェント間連携の標準プロトコル
- TypeScript で実装可能（手動・Mastra）
- Mastra により簡単に A2A 対応
- 今後のマルチエージェント時代に必須

<!--
最後にまとめさせていただきます。
A2A プロトコルは、AI エージェント間の連携を標準化する重要なプロトコルです。
今日ご紹介したように、TypeScript を使って手動で実装することも、Mastra のようなフレームワークを使って簡単に実装することも可能です。
特に Mastra を使えば、A2A プロトコルの詳細を知らなくても、簡単に準拠したエージェントを作成できます。
AI エージェントがますます普及している現在、複数のエージェントが連携するマルチエージェントシステムは今後さらに重要になってくると思います。
A2A プロトコルは、そのような未来において必須の技術となるでしょう。
-->

---

## 参考資料

 
- https://google.github.io/A2A/
- https://github.com/google-a2a/a2a-samples/tree/main/samples
- https://github.com/google-a2a/a2a-js
- https://mastra.ai/

---

<!--
以上で発表を終わらせていただきます。
ご清聴いただき、ありがとうございました。
A2A プロトコルについて、少しでもご理解いただけたでしょうか。
もし何かご質問がございましたら、お聞かせください。
また、より詳細な実装については私のブログにも記事を投稿しておりますので、
ぜひそちらもご参考にしていただければと思います。
ありがとうございました。
-->