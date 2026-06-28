---
id: 7O6u4RaFImVGF4LDzrsah
title: "AI エージェントフレームワーク Flue を試してみた"
slug: "ai-agent-framework-flue"
about: "Flue は AI エージェントを構築するための TypeScript フレームワークです。ハーネス駆動のアーキテクチャを採用しており、エージェントの構築に必要な機能を包括的に提供しています。この記事では SRE エージェントを構築する例を通じて Flue の機能に触れていきます。"
createdAt: "2026-06-27T17:54+09:00"
updatedAt: "2026-06-27T17:54+09:00"
tags: ["AI", "Flue"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7A3SEMXcbKO0gpbL9n1Fqm/5b7496814f0ec7f31906995d3e4edd76/aji_hiraki_15667-768x591.png"
  title: "アジの開きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Flue が採用しているアーキテクチャとして、記事で説明されているものはどれですか?"
      answers:
        - text: "ハーネス駆動のアーキテクチャ"
          correct: true
          explanation: "記事では、Flue は Claude Code などのコーディングエージェントが採用しているハーネス駆動のアーキテクチャを採用していると説明されています。"
        - text: "MVC による画面遷移中心のアーキテクチャ"
          correct: false
          explanation: "MVC は記事で Flue のアーキテクチャとして説明されていません。Flue は AI エージェント構築のためのハーネス駆動アーキテクチャとして紹介されています。"
        - text: "静的サイト生成に特化したアーキテクチャ"
          correct: false
          explanation: "記事では静的サイト生成ではなく、AI エージェント、ワークフロー、ツール、スキルなどを扱うフレームワークとして Flue を説明しています。"
        - text: "データベースのスキーマ駆動アーキテクチャ"
          correct: false
          explanation: "記事ではデータベーススキーマを中心にした設計としては説明されていません。Flue の基盤として Pi などのハーネスに触れています。"
    - question: "ログ調査をサブエージェントに委譲する理由として、記事で説明されているものはどれですか?"
      answers:
        - text: "ログ専門のエージェントだけが Slack に返信できるようにするため"
          correct: false
          explanation: "Slack への返信は Slack 返信ツールで扱う内容です。ログ調査をサブエージェントに分ける理由としては説明されていません。"
        - text: "メインエージェントのコンテキストに大量の生ログを入れず、要約だけを受け取るため"
          correct: true
          explanation: "記事では、ログ専門のサブエージェントがログを読み、要点だけをメインエージェントに返すことで、メインエージェントのコンテキスト汚染を防げると説明しています。"
        - text: "Flue ではメインエージェントがツールを一切使えないため"
          correct: false
          explanation: "記事中の SRE エージェントは get-service-status などのツールを利用しています。サブエージェントはツール利用を完全に代替するものではありません。"
        - text: "ワークフローを実行するには必ずサブエージェントが必要なため"
          correct: false
          explanation: "記事では、ワークフローは defineWorkflow で構造化された処理として定義しています。サブエージェントが必須とは説明されていません。"
    - question: "チャンネル・スキル・ツール・サブエージェントのうち、記事で規約に従った場所へ配置すると説明されているものはどれですか?"
      answers:
        - text: "チャンネル"
          correct: true
          explanation: "記事では、チャンネルは src/channels ディレクトリに配置する必要があると説明されています。一方でツールとスキルは任意の場所に配置でき、サブエージェントも例として src/subagents に置いているだけです。"
        - text: "スキル"
          correct: false
          explanation: "記事では、スキル自体は任意の場所に配置できると説明されています。src/skills/payments-runbook/SKILL.md はこの記事で使っている配置例です。"
        - text: "サブエージェント"
          correct: false
          explanation: "記事では、サブエージェントを src/subagents/log-analyst.ts に作成していますが、規約に従った配置が必要だとは説明していません。"
        - text: "ツール"
          correct: false
          explanation: "記事では、ツール自体は好きな場所に配置できると説明されています。src/tools はこの記事での実装例です。"
published: true
---
[Flue](https://flueframework.com/) は AI エージェントを構築するための TypeScript フレームワークです。Flue は Claude Code をはじめとするコーディングエージェントが採用しているハーネス駆動のアーキテクチャを採用しており、あらゆる AI モデルをエージェントとして利用することができます。ハーネスアーキテクチャを構成する基盤として [OpenCrew](https://www.opencrewai.com/) においても採用されている [Pi](https://pi.dev) が利用されています。Pi は「minimal terminal coding harness」と説明されており、ターミナル上でのコーディングエージェントの実行に必要な最小限の機能を提供するハーネスです。Flue は Pi をベースにしており、より高度なエージェントの構築や管理を可能にしています。

Flue は、エージェントの構築に必要な機能を包括的に提供しています。

- エージェント: 全体を通じてコンテキストを保持し、自律的にタスクを実行する AI モデル
- ワークフロー: エージェントがタスクを実行するための構造化されたプロセス
- instructions: エージェントがタスクを実行するための指示やルール
- ツール: エージェントがタスクを実行するために利用できる外部の機能やサービス
- スキル: エージェントが特定のタスクを実行するための専門知識で、必要な場合のみロードされる
- サブエージェント: メインのエージェントからタスクを委任され、専門的な処理を行うエージェント
- MCP サーバー: オープンな MCP（Model Context Protocol）サーバーで、エージェントが外部のサービスやツールと通信するためのインターフェースを提供
- サンドボックス: エージェントが安全にコードを実行できる隔離された環境
- オブサーバビリティ: エージェントの動作を監視し、ログやメトリクスを収集するための機能
- チャンネル: HTTP リクエストを通じて Slack, Discord, Teams などの外部サービスと通信するためのインターフェース

また AI エージェントの構築においては耐久性のある実行が重要です。AI エージェントの実行は長時間にわたることがあり、途中でエラーが発生した場合でも再実行やリカバリが可能であることが求められます。Flue は、セッションの履歴やコンテキストをストレージに保存することで、エージェントの実行を途中から再開することが可能です。例えば Cloudflare Workers 上で Flue を実行する場合、セッションの履歴やコンテキストを Durable Object に保存します。

この記事では、Flue を利用して AI エージェントを構築する方法について紹介します。

## Flue プロジェクトを作成する

Flue プロジェクトを作成して、最も基本的なエージェントを構築してみましょう。あらかじめ Node.js 22.19.0 以上がインストールされていることを確認してください。また任意の AI プロバイダーの API キーを取得しておく必要があります。ここでは OpenAI の API キーを利用することを想定しています。https://platform.openai.com/api-keys から API キーを取得してください。

Flue は AI ファーストのフレームワークであり、コーディングエージェントと連携して使用されるように設計されています。そのため Flue プロジェクトのセットアップ自体も[ガイドライン](https://flueframework.com/start.md)をコンテキストとして与えたうえで、Claude Code や Codex などのコーディングエージェントに行わせることが推奨されています。ですが、ここでは学習目的のため、Flue プロジェクトのセットアップを手動で行っていきます。

新しいディレクトリに Node.js プロジェクトを作成し、`@flue/runtime` と `@flue/cli` をインストールします。その後、`flue init` コマンドを実行して Flue プロジェクトを初期化します。

```bash
mkdir flue-agent-example
cd flue-agent-example
npm init -y
npm install @flue/runtime@latest
npm install @flue/cli@latest --save-dev
npx flue init --target node # or cloudflare
```

`npx flue init` コマンドを実行すると、`flue.config.ts` ファイルが作成されます。

```ts:flue.config.ts
import { defineConfig } from '@flue/cli/config';

export default defineConfig({
	target: 'node',
});
```

環境変数 `OPENAI_API_KEY` に OpenAI の API キーを設定します。この個所は使用している AI プロバイダーに応じて適宜変更してください。`.env` ファイルを作成し、以下のように記述します。

```bash:.env
OPENAI_API_KEY=your_openai_api_key
```

最初のエージェントを作成します。Flue はプロジェクトのソースコードからエントリーポイントを検出するようになっており、いくつかのコンポーネントは規約に従って配置する必要があります。エージェントは `src/agents` ディレクトリに配置する必要があります。`src/agents` ディレクトリを作成し、`my-first-agent.ts` ファイルを作成します。ファイル名がエージェントの名前として使用されます。

```typescript:src/agents/my-first-agent.ts
import { defineAgent, type AgentRouteHandler } from '@flue/runtime';

export const description = "最初のエージェントです。ユーザーの質問に博多弁で答えます。";

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(() => ({
	model: "openai/gpt-5.4-nano",
	instructions: "あなたは優秀なアシスタントです。博多弁でユーザーの質問に答えてください。",
}))
```

変数 `description` にはエージェントの説明を記述します。名前付き export することで自動で Flue により収集されます。`route` はエージェントのルートハンドラーで、名前付き export することで HTTP 経由でエージェントが公開されます。`POST /agents/my-first-agent/:id` でエージェントを呼び出し、`GET /agents/my-first-agent/:id` でイベントストリーミングを受信することができます。ルーティングは [Hono](https://hono.dev/) を使用しており、`route` では Hono のミドルウェアを使用することができます。ここでは、`next()` を呼び出すことで、次のミドルウェアに処理を委譲しています。

エージェントは `defineAgent` 関数を使用して定義し、`default export` で定義する必要があります。`model` には使用する AI モデルを指定します。ここでは OpenAI プロバイダーのモデルとして `openai/gpt-5.4-nano` を指定しています。使用可能なモデルは https://pi.dev/models を参照してください。`instructions` にはエージェントがタスクを実行するための指示やルールを指定します。ここでは、ユーザーの質問に博多弁で答えるように指示しています。

以下のコマンドで `my-first-agent` エージェントを実行します。

```bash
npx flue run my-first-agent --input '{ "message": "こんにちは" }'
```

ターミナル上にエージェントの出力と、消費したトークン数などの情報が JSON 形式で表示されます。`instructions` で指定した通り、エージェントは博多弁でユーザーの質問に答えてくれていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/5JakMtOHfLRiLHMSkbo9Id/22c75933cd2398e0a7a7a07da4b17272/image.png)

## SRE エージェントを構築する

ここからは実践的な AI エージェントの構築を通じて、Flue の機能に触れていきましょう。ここでは、SRE（Site Reliability Engineering）エージェントを構築してみます。SRE エージェントは、システムの監視や障害対応、システムの復旧作業を自律的に行うことができるエージェントです。SRE エージェントは、システムの状態を監視し、異常が検知された場合には自動的に対応策を実行することができます。ツールを使用して、システムの状態やログを取得したり、Runbook をスキルとして参照して特定の手順に沿った対応を行うといった機能を作っていきます。

初めに SRE エージェントがどのように振る舞うかのシステムプロンプト（`instructions`）を定義します。SRE エージェントは、システムの状態を監視し、異常が検知された場合には自動的に対応策を実行することができます。以下のように `instructions` を定義します。`my-first-agent` の場合は `instructions` は文字列で直接渡していましたが、本格的なエージェントとなりますと、`instructions` 自体が長大なテキストとなることが多く、またその変更履歴も個別で管理したくなることが多いため、`instructions` は独立したマークダウンファイルとして管理するのが望ましいです。ここでは、`src/agents/sre-agent.md` に `instructions` を定義します。

```md:src/agents/sre-agent.md
# Sentinel — SRE オンコール支援エージェント

あなたは SRE チームのオンコール業務を支援するアシスタント「Sentinel」です。
障害発生時に、状況を素早く調査し、原因の仮説を立て、復旧アクションを提案します。

## 行動原則

1. **調査（読み取り）は積極的に行う。** ログ・メトリクス・デプロイ履歴の確認など、
   システムの状態を「見るだけ」の操作は、確認を取らずに自分から実行してよい。
2. **変更（書き込み）は必ず人に確認する。** デプロイ・ロールバック・スケールなど、
   本番に影響する操作は、勝手に実行せず必ずオンコール担当の承認を得る。
3. **推測で動かない。** 原因が確定していないのに変更操作を提案しない。
   まず根拠（ログ・メトリクス・差分）を集め、仮説とその確度を明示する。
4. **簡潔に報告する。** 「何が起きているか」「考えられる原因」「次の一手」を
   この順で短くまとめる。確証が持てない点は正直に「不明」と伝える。

## 調査の進め方（専門エージェントへの委譲）

障害対応の現場では、原因が特定できるまで複数のコンポーネントにまたがって、
ログ・メトリクスなどのシグナルを横断的に調査する。あなたはこれを専門エージェントに委譲する。

- **ログの調査** → `log-analyst` に委譲する。
- **メトリクス（ヘルス/エラー率/レイテンシ/アラート）の調査** → `metrics-analyst` に委譲する。
- 各専門エージェントは担当シグナルの**要約だけ**を返す。原因の断定はしない。

委譲する理由は、生ログや大量の指標であなた自身のコンテキストを汚さず、
**要約だけを受け取る**ため。各エージェントへの依頼メッセージには、対象サービス名など必要な文脈を必ず含める。

そのうえで **最終判断はあなたが行う**。返ってきた要約を、デプロイ履歴（`get-deploy-history`）など
他の事実と突き合わせ、原因の仮説と確度を組み立て、復旧アクションを提案する。

## 応答フォーマット

障害調査の報告は、原則として次の3点で構成する。

- **現状**: いま観測されている事実（アラート・症状）
- **原因の仮説**: 確度（高/中/低）とその根拠
- **推奨アクション**: 次にやるべきこと（変更操作なら承認が必要な旨も添える）
```

ここでは、SRE エージェントの行動原則や調査の進め方、応答フォーマットを定義しています。`src/agents/sre-agent.ts` では `.md` ファイルを import するために `with { type: 'markdown' }` を指定します。これは [import 属性](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/import/with) と呼ばれる構文です。`type: 'markdown'` を指定することで、ランタイムに Markdown ファイルとして読み込むように指示しています。

```typescript:src/agents/sre-agent.ts
import { defineAgent, type AgentRouteHandler } from '@flue/runtime';
import instructions from './sre-agent.md' with { type: 'markdown' };

export const description = "SRE エージェントです。システムの監視や障害対応、システムの復旧作業を自律的に行います。";

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(() => ({
  model: "openai/gpt-5.4-nano",
  instructions,
}))
```

試しに `sre-agent` エージェントを実行して、`instructions` で指定した通りに振る舞うか確認してみましょう。

```bash
npx flue run sre-agent --input '{ "message": "サービスAのエラー率が急上昇しています。原因を調査してください。" }'
```

まだツールを定義していないので失敗していますが、指示通りにログやメトリクスの調査を行おうとしていることが確認できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/3spVYc0q77J8qZLNRnys0r/ad6e17b942730ff0b81ba43331802b63/image.png)

### ログやメトリクスを調査するツールを定義する

SRE エージェントがログを調査したり、メトリクスを調査するためのツールを定義します。ツールはエージェントがタスクを実行するために利用できる外部の機能やサービスです。実際のアプリケーションでは外部のサービスの API を呼び出してログやメトリクスを取得することになりますが、ここではモックのツールを定義して、SRE エージェントがツールを利用できることを確認します。

ツール自体は好きな場所に配置できます。`src/tools` ディレクトリを作成し、`get-deploy-history.ts`, `get-logs.ts` と `get-service-status.ts` ファイルを作成します。`get-logs.ts` はログを調査するためのツールです。ここでは、モックとして固定のログを返すようにしています。

```typescript:src/tools/get-logs.ts
import { defineTool, type JsonValue } from "@flue/runtime";
import * as v from "valibot";

import { listServices, queryLogs } from "../lib/mock-data.ts";

export const getLogsTool = defineTool({
  name: "get-logs",
  description:
    "指定したサービスの直近のログを取得する。level で error/warn/info に絞り込める。読み取り専用で副作用はない。",
  input: v.object({
    service: v.pipe(v.string(), v.description("サービス名。例: payments-api")),
    level: v.optional(v.picklist(["error", "warn", "info"])),
    limit: v.optional(v.pipe(v.number(), v.description("取得する最大件数"))),
  }),
  async run({ input, signal }): Promise<JsonValue> {
    const { service, level, limit = 20 } = input;
    const entries = queryLogs(service, level, limit);
    if (!entries) {
      return {
        error: `unknown service: ${service}`,
        knownServices: listServices(),
      };
    }
    return { service, count: entries.length, entries };
  },
});
```

以降のツールは、以下のモックデータを参照する前提で実装します。実システムには接続せず、あらかじめ埋め込んだ障害シナリオを返すようにしています。

<details>
<summary><code>src/lib/mock-data.ts</code></summary>

```ts:src/lib/mock-data.ts
export type ServiceName = "payments-api" | "auth-api" | "checkout-web";

export type ServiceStatus = {
  service: ServiceName;
  health: "healthy" | "degraded" | "down";
  errorRatePct: number;
  p95LatencyMs: number;
  activeAlerts: string[];
};

const services: Record<ServiceName, ServiceStatus> = {
  "payments-api": {
    service: "payments-api",
    health: "degraded",
    errorRatePct: 18.4,
    p95LatencyMs: 2400,
    activeAlerts: [
      "HighErrorRate: payments-api 5xx > 15% (5m)",
      "DBConnectionPoolNearLimit: payments-api 20/20",
    ],
  },
  "auth-api": {
    service: "auth-api",
    health: "healthy",
    errorRatePct: 0.2,
    p95LatencyMs: 120,
    activeAlerts: [],
  },
  "checkout-web": {
    service: "checkout-web",
    health: "healthy",
    errorRatePct: 0.4,
    p95LatencyMs: 310,
    activeAlerts: [],
  },
};

export type Deploy = {
  id: string;
  service: ServiceName;
  ref: string;
  message: string;
  deployedBy: string;
  deployedAt: string; // 相対表記（モックなので固定）
  status: "succeeded" | "failed";
};

const deploys: Record<ServiceName, Deploy[]> = {
  "payments-api": [
    {
      id: "dpl_8842",
      service: "payments-api",
      ref: "a1b2c3d",
      message: "perf: DB コネクションプールを遅延初期化に変更",
      deployedBy: "mio",
      deployedAt: "12分前",
      status: "succeeded",
    },
    {
      id: "dpl_8830",
      service: "payments-api",
      ref: "f9e8d7c",
      message: "chore: 依存ライブラリを更新",
      deployedBy: "ken",
      deployedAt: "3時間前",
      status: "succeeded",
    },
  ],
  "auth-api": [
    {
      id: "dpl_8801",
      service: "auth-api",
      ref: "c4d5e6f",
      message: "fix: トークン有効期限の計算を修正",
      deployedBy: "ken",
      deployedAt: "昨日",
      status: "succeeded",
    },
  ],
  "checkout-web": [],
};

export type LogEntry = {
  ts: string;
  level: "error" | "warn" | "info";
  service: ServiceName;
  message: string;
};

const logs: Record<ServiceName, LogEntry[]> = {
  "payments-api": [
    {
      ts: "12:03:11",
      level: "error",
      service: "payments-api",
      message: "timeout acquiring connection from pool after 5000ms",
    },
    {
      ts: "12:03:09",
      level: "error",
      service: "payments-api",
      message:
        "FATAL: remaining connection slots are reserved; pool exhausted (active=20/20)",
    },
    {
      ts: "12:02:55",
      level: "warn",
      service: "payments-api",
      message: "DB pool usage high: 19/20 connections in use",
    },
    {
      ts: "11:51:30",
      level: "info",
      service: "payments-api",
      message: "deploy a1b2c3d applied: lazy pool init enabled",
    },
    {
      ts: "11:50:02",
      level: "info",
      service: "payments-api",
      message: "healthcheck ok",
    },
  ],
  "auth-api": [
    {
      ts: "12:03:00",
      level: "info",
      service: "auth-api",
      message: "healthcheck ok",
    },
  ],
  "checkout-web": [
    {
      ts: "12:03:00",
      level: "info",
      service: "checkout-web",
      message: "healthcheck ok",
    },
  ],
};

export function listServices(): ServiceName[] {
  return Object.keys(services) as ServiceName[];
}

function isKnownService(service: string): service is ServiceName {
  return service in services;
}

export function getServiceStatus(service: string): ServiceStatus | null {
  return isKnownService(service) ? services[service] : null;
}

export function getDeployHistory(service: string): Deploy[] | null {
  return isKnownService(service) ? deploys[service] : null;
}

export function queryLogs(
  service: string,
  level?: LogEntry["level"],
  limit = 20,
): LogEntry[] | null {
  if (!isKnownService(service)) return null;
  const entries = level
    ? logs[service].filter((l) => l.level === level)
    : logs[service];
  return entries.slice(0, limit);
}
```

</details>

ツールの定義は `defineTool` 関数で行います。`name` は AI がツールを呼び出す際に使用される名前であり必須属性です。`description` は AI がツールを呼び出すかどうかの判断に使用されるので重要です。`input` はツールの引数として受け取る入力のスキーマであり、[valibot](https://valibot.dev/) を使用して定義します。`run` 関数がツールを呼び出した時に実行されます。`input` は `valibot` スキーマに基づいて型安全に使用できます。`signal` は [AbortController](https://developer.mozilla.org/ja/docs/Web/API/AbortController) の `signal` で、処理を中断するために使用できます。

定義したツールは `defineAgent()` に渡すオブジェクトの `tools` プロパティに渡すことでエージェントが使用できるようになります。

```ts:src/agents/sre-agent.ts
import { defineAgent, type AgentRouteHandler } from "@flue/runtime";
import instructions from "./sre-agent.md" with { type: "markdown" };
import { getLogsTool } from "../tools/get-logs.ts";
import { getServiceStatusTool } from "../tools/get-service-status.ts";

export const description =
  "SRE エージェントです。システムの監視や障害対応、システムの復旧作業を自律的に行います。";

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(() => ({
  model: "openai/gpt-5.4-nano",
  instructions,
  tools: [getLogsTool, getServiceStatusTool],
}));
```

ツールが実際にエージェントから呼び出されるか確認してみましょう。「payments-api で 5xx アラートが出ている。調べて」といったメッセージを送信します。

```bash
npx flue run sre-agent --input '{ "message": "payments-api で 5xx アラートが出ている。調べて" }'
```

`get-logs` と `get-service-status` ツールがそれぞれ呼び出され、ツールの結果を元に SRE エージェントが原因の仮説を立て、推奨アクションを提案していることが確認できます。

### Runbook をスキルとして定義する

本番稼働しているシステムの障害対応では、障害の種類ごとに手順書（Runbook）が用意されていることが多いです。Runbook は同じ障害が発生した際に、同じ手順で対応できるようにするためのものです。この Runbook をエージェントにコンテキストとして読み込ませることで、障害の種類ごとに適切な対応を提案できるようになることが期待できます。

エージェントにコンテキストを渡す方法として第一に、`instructions` Runbook の内容を直接記述する方法が考えられます。しかし Runbook は障害の種類ごとに複数存在することが多く、手順自体も長くなりがちなのでコンテキストを圧迫する原因となりえます。またデータベースの障害を調査している際に、Web フロントエンドの障害の Runbook がコンテキストに含まれていると、エージェントが誤った情報を参照してしまう恐れがあります。これらの問題は `instructions` が常に読み込まれるシステムプロンプトであることに起因しています。

Runbook のように、障害の種類ごとに複数存在するコンテキストをエージェントに読み込ませるためには、スキルとして定義する方法が有効です。スキルは [Agent Skills](https://agentskills.io/home) の仕様に準拠しており、エージェントが必要だと判断した場合のみコンテキストに読み込まれます。セッションの開始時にはスキルの description のみがエージェントのコンテキストに読み込まれ、エージェントがスキルを使用する必要があると判断した場合にのみ、スキル全体を読み込みます。このように必要に応じてコンテキストに読み込む動作は progressive disclosure と呼ばれています。

スキル自体は任意の場所に配置できます。Agent Skills の仕様ではスキルの内容は `SKILL.md` という名前の Markdown ファイルに記述し、関連するファイルはスクリプトを同ディレクトリ内に配置します。ここでは、`payments-runbook` という名前のスキルを `src/skills/payments-runbook/SKILL.md` に作成します。

```md:src/skills/payments-runbook/SKILL.md
---
name: payments-runbook
description: payments-api で 5xx 急増・レイテンシ悪化・DB コネクションプール枯渇（pool exhausted / connection slots reserved）が起きたときの調査と復旧の手順（runbook）。
---

# Runbook: payments-api コネクションプール枯渇

payments-api で 5xx の急増や `pool exhausted` 系のログが観測されたときに従う手順。

## 1. 切り分け（読み取りのみ）

次を確認し、事実を集める。

1. メトリクスは `metrics-analyst` に委譲し、health・エラー率・レイテンシ・発火中アラートの要約を得る。
2. ログは `log-analyst` に委譲し、エラーログの要約を得る。要約に
   `pool exhausted` / `connection slots are reserved` / `timeout acquiring connection`
   が含まれていればコネクションプール枯渇を疑う。
3. `get-deploy-history("payments-api")` で直近デプロイを確認（これはあなた自身が行う）。
   **症状の発生時刻と直近デプロイの時刻が近ければ、そのデプロイを第一容疑とする。**

## 2. 原因の判定

- 直近デプロイがプール設定・DB アクセス周りを変更しており、かつ症状がデプロイ直後に始まっている
  → **そのデプロイによるリグレッションの可能性が高い（確度：高）**。
- デプロイと無関係にトラフィック増だけでプールが枯渇している場合は、スケールやプールサイズ調整を検討（本 runbook の範囲外。エスカレーションする）。

## 3. 復旧アクション（変更＝要承認）

第一容疑が直近デプロイの場合、**最優先はロールバック**。

- `rollback-service` で、その1つ前の正常なリビジョンへ戻す。
  デプロイ履歴で「直近の1つ前の `succeeded` なリビジョン」を `toRef` に指定する。
- これは変更操作なので、必ずオンコール担当の承認を得てから実行する（自動では実行しない）。

ロールバックで回復しない、または原因がデプロイでないと判断した場合は、人間にエスカレーションする。

## 4. 報告

復旧操作の後は、現状・実施したアクション・残課題を簡潔に共有する。
```

作成したスキルは `defineAgent` に渡すオブジェクトの `skills` プロパティでエージェントに読み込ませます。スキルは単なるマークダウンファイルではないので、import 属性 `type: 'skill'` を指定して読み込む必要があります。

```ts:src/agents/sre-agent.ts
import { defineAgent, type AgentRouteHandler } from "@flue/runtime";
import instructions from "./sre-agent.md" with { type: "markdown" };
import { getLogsTool } from "../tools/get-logs.ts";
import { getServiceStatusTool } from "../tools/get-service-status.ts";
import paymentsRunbook from "../skills/payments-runbook/SKILL.md" with { type: "skill" };

export const description =
  "SRE エージェントです。システムの監視や障害対応、システムの復旧作業を自律的に行います。";

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(() => ({
  model: "openai/gpt-5.4-nano",
  instructions,
  tools: [getLogsTool, getServiceStatusTool],
  skills: [paymentsRunbook],
}));
```

「payments-api で 5xx が増えてるので Runbook の内容に基づいて進めて」といったメッセージを送信すると、SRE エージェントは `payments-runbook` スキルを読み込み、Runbook の内容に基づいて調査や復旧アクションの提案を行うことができます。

```bash
npx flue run sre-agent --input '{ "message": "payments-api で 5xx が増えてるので Runbook の内容に基づいて進めて" }'
```

`activate_skill` ツールを使用して payments-runbook スキルを読み込んでいる様子が確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1hGBKSoBEBGNyyjVJfVm8F/6669b2517e7221784e668a0d28fb7503/image.png)

### サブエージェントにタスクを委譲して効率的に障害を調査する

障害対応の現場では、原因が特定できるまで複数のコンポーネントやテレメトリにまたがる複雑な調査をすることが多いです。例えば `payments-api` で 5xx エラーが増えている場合、`payments-api` 自体の問題なのか、はたまたデータベースの問題なのか、あるいは両者の相互作用による問題なのかを切り分ける必要があります。またメトリクス・ログ・トレースなど、複数のテレメトリを組み合わせて調査する必要もあります。

このように複数の領域を横断して調査する場合、サブエージェントを定義して、調査の領域ごとにエージェントを分ける方法が有効です。なぜなら 1 つのエージェントのみに調査を任せると、API サーバーのログ・データベースのメトリクスを同時に調査するようなケースで、エージェントが両方の情報を混同してしまう恐れがあるからです。またログの情報はそれだけで多くの行数になりますから、コンテキストを圧迫してしまう恐れもあります。サブエージェントを定義して、ログの調査はログ専門のエージェントに任せるようにすれば、ログの情報をコンテキストに読み込むのはログ専門のエージェントだけになります。ログ専門のエージェントはログの情報をもとにログに特化して分析し、結論だけをメインのエージェントに返すため、メインエージェントのコンテキストは生のログの情報に汚染されることを防げます。

また複雑な判断を必要としない簡単な作業であれば、コストの安い小さなモデルを使用してサブエージェントを構築するといった工夫もできます。サブエージェントを並列して実行させれば、より迅速に調査を進めることも期待できます。

サブエージェントは `defineAgentProfile` 関数を使用して定義します。サブエージェントはメインのエージェントと同じく、モデル, `instructions` や `tools` を定義することができます。ログの調査を行うサブエージェント `log-analyst` を定義してみましょう。`src/subagents/log-analyst.ts` ファイルを作成し、以下のように定義します。`description` は親エージェントがサブエージェントを呼び出すかどうかの判断に使用されるので、サブエージェントの役割を簡潔に記述することが重要です。

```ts:src/subagents/log-analyst.ts
import { defineAgentProfile } from "@flue/runtime";
import { getLogsTool } from "../tools/get-logs.ts";

export const logAnalyst = defineAgentProfile({
  name: "log-analyst",
  description: "ログ専門の調査サブエージェントです。`get-logs` を使って指定サービスのログを読み、異常の要点だけを簡潔に要約して返します。",
  model: "openai/gpt-5.4-nano",
  instructions:
    "あなたはログ専門の調査サブエージェントです。`get-logs` を使って指定サービスのログを読み、異常の要点だけを簡潔に要約して返します。",
  tools: [getLogsTool],
});
```

`logAnalyst` サブエージェントをメインの SRE エージェントに組み込みます。`src/agents/sre-agent.ts` ファイルの `defineAgent` の `subagents` プロパティにサブエージェントを渡すことで、メインの SRE エージェントからサブエージェントを呼び出せるようになります。もともと SRE エージェントに渡していた `getLogsTool` は `tools` の配列から削除します。なぜなら SRE エージェントはログの調査をサブエージェントに委譲するため、SRE エージェント自身がログの調査を行う必要がなくなるからです。

```ts:src/agents/sre-agent.ts
import { defineAgent, type AgentRouteHandler } from "@flue/runtime";
import instructions from "./sre-agent.md" with { type: "markdown" };
import { getServiceStatusTool } from "../tools/get-service-status.ts";
import paymentsRunbook from "../skills/payments-runbook/SKILL.md" with { type: "skill" };
import { logAnalyst } from "../subagents/log-analyst.ts";

export const description =
  "SRE エージェントです。システムの監視や障害対応、システムの復旧作業を自律的に行います。";

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(({ id }) => ({
  model: "openai/gpt-5.4-nano",
  instructions,
  tools: [getServiceStatusTool],
  skills: [paymentsRunbook],
  subagents: [logAnalyst],
}));
```

あらためて「payments-api で 5xx が増えてるので Runbook の内容に基づいて進めて」といったメッセージを送信すると、SRE エージェントは `log-analyst` サブエージェントを呼び出す様子が確認できます。`subagents` が渡されたエージェントは `task` ツールを使用してサブエージェントのセッションを開始します。

```bash
npx flue run sre-agent --input '{ "message": "payments-api で 5xx が増えてるので Runbook の内容に基づいて進めて" }'
```

### ワークフローで構造化された処理を行う

ワークフローとは 1 つのタスクを複数のステップに分解し、ステップごとに処理を行う構造化された処理のことです。ドキュメントの変換やレビュー、CI 処理など有限で検査可能な処理はワークフローとして構造化することができます。反対にリアルタイムの障害対応のように複数の会話ステップが必要な処理はワークフローとして定義するのではなく、エージェントの会話の中で逐次的に処理を行うことが望ましいです。

例としてインシデントからポストモーテムを作成するワークフローを定義してみましょう。このワークフローは以下の 3 つのステップで構成されます。

1. 入力のインシデント情報＋関連ログをファイルに書き出す
2. セッションがツールで状況を追加調査し、`postmortem.md` を生成
3. 生成された Markdown を読み返して構造化結果として返す

成果物は `postmortem.md` という Markdown ファイルとして出力されるため、検査可能な処理と言えます。ワークフローは規約で `src/workflows/` ディレクトリに配置する必要があります。またファイル名がそのままワークフロー名となるため、`postmortem.ts` というファイル名で作成します。ワークフローは `defineWorkflow` 関数を使用して定義します。

```ts:src/workflows/postmortem.ts
import { defineAgent, defineWorkflow } from "@flue/runtime";
import { local } from "@flue/runtime/node";
import * as v from "valibot";

import { getLogsTool } from "../tools/get-logs.ts";
import { getServiceStatusTool } from "../tools/get-service-status.ts";
import { getDeployHistoryTool } from "../tools/get-deploy-history.ts";

export default defineWorkflow({
  agent: defineAgent(() => ({
    model: "openai/gpt-5.4-nano",
    // 既定の仮想サンドボックス(インメモリ)ではなく、ホストの実ファイルに書き出す。
    // cwd 配下に incident.md / postmortem.md が作成される
    sandbox: local(),
    cwd: "postmortems",
    tools: [getServiceStatusTool, getLogsTool, getDeployHistoryTool],
  })),

  // 入力: どのサービスで何が起きたか
  input: v.object({
    service: v.pipe(
      v.string(),
      v.description("対象サービス名。例: payments-api"),
    ),
    incident: v.pipe(
      v.string(),
      v.description("インシデントの概要。発生時刻・症状など分かっている範囲で"),
    ),
  }),

  // 出力: 生成したポストモーテム本文と、抽出した構造化サマリ
  output: v.object({
    markdown: v.pipe(
      v.string(),
      v.description("生成されたポストモーテム本文(Markdown)"),
    ),
    rootCause: v.pipe(v.string(), v.description("推定された根本原因")),
    actionItems: v.array(v.string()),
  }),

  async run({ harness, input }) {
    // 1. 入力をファイルに書き出す。
    //    中間ファイルが残るので、実行履歴を後から検査できる。
    await harness.fs.writeFile(
      "incident.md",
      `# Incident: ${input.service}\n\n${input.incident}\n`,
    );

    // 2. セッションを開始し、ツールで状況を調査しつつ、ポストモーテムを生成する。
    const session = await harness.session();
    await session.prompt(
      [
        "incident.md を読んでください。",
        `その上で ${input.service} の現在のステータス・直近のエラーログ・デプロイ履歴を`,
        "ツールで調査し、以下の構成で postmortem.md を書いてください:",
        "## 概要 / ## 影響 / ## タイムライン / ## 根本原因 / ## 再発防止策",
      ].join("\n"),
    );

    // 3. 生成物を読み返しつつ、構造化サマリを抽出する。
    const markdown = await harness.fs.readFile("postmortem.md");
    const summary = await session.prompt(
      "いま書いた postmortem.md の内容から、根本原因と再発防止のアクション項目を抽出してください。",
      {
        result: v.object({
          rootCause: v.string(),
          actionItems: v.array(v.string()),
        }),
      },
    );

    return {
      markdown,
      rootCause: summary.data.rootCause,
      actionItems: summary.data.actionItems,
    };
  },
});
```

ワークフローはまず入力スキーマと出力スキーマを定義します。入力スキーマはワークフローを呼び出す際に必要な情報であり、出力スキーマはワークフローの実行結果として返される情報です。それぞれ `valibot` を使用して定義します。ワークフローの処理は `run` 関数で定義します。`harness` はワークフローの実行環境を表すオブジェクトで、ファイルシステムやセッションなどの機能を提供します。

エージェントを呼び出してセッションを開始する前に `harness.fs.writeFile` で入力のインシデント情報を `incident.md` というファイルに書き出します。このファイルは後からエージェントに読み込ませるために使用します。次に `harness.session()` でセッションを開始し、`session.prompt` でエージェントにプロンプトを送信します。ここでは、インシデント情報を読み込んだ上で、ツールを使用して状況を調査し、ポストモーテムを生成するように指示しています。最後に `harness.fs.readFile` で生成された `postmortem.md` を読み込み、再度 `session.prompt` で構造化サマリを抽出するように指示しています。

また、エージェントのデフォルトのサンドボックス設定では [`just-bash`](https://justbash.dev/) が使用されるのですが、このままだと出力された `postmortem.md` を読み込むことができません。ここではサンドボックスの設定を `local()` に変更することで、ホストの実ファイルに書き出すようにしています。`cwd` プロパティでワークフローの作業ディレクトリを指定することで、`postmortems/incident.md` と `postmortems/postmortem.md` が作成されます。

:::warning
`local()` サンドボックスはホストのファイルシステムにアクセスするため、セキュリティ上のリスクがあります。ワークフローを実行する際には、信頼できるエージェントのみを使用するようにしてください。
:::

実際にワークフローを実行してみましょう。`npx flue run postmortem` コマンドを使用して、対象サービスとインシデントの概要を入力として渡します。

```bash
npx flue run postmortem \
  --input '{"service":"payments-api","incident":"02:14 に 5xx が急増し、決済が断続的に失敗。直後にアラートが発火。"}'
```

実際に `postmortems/incident.md` と `postmortems/postmortem.md` が作成され、ワークフローの実行結果として構造化サマリが返されることが確認できます。

```sh
$ tree postmortems

postmortems
├── incident.md
└── postmortem.md

1 directory, 2 files
```

### Slack から SRE エージェントを呼び出す

AI エージェントはローカルのターミナルで実行できるだけでは、その利便性は限定的です。実際の運用で AI エージェントを活用するためにはチャットインターフェースから呼び出せることが不可欠でしょう。自前のチャットインターフェースを構築してそれ自体をサービスとして売り出したりとか、あるいは Slack や Discord などの既存のチャットサービスに統合して利用することが考えられます。Flue はチャットサービスと連携するためのチャンネルを提供しています。チャンネルは HTTP リクエストを通じて Slack, Discord, Teams などの外部サービスと通信するためのインターフェースです。

ここでは Slack チャンネルを使用して、Slack から SRE エージェントを呼び出す方法を紹介します。Slack チャンネルを使用するためには、まず Slack アプリを作成し、Bot Token を取得する必要があります。Slack アプリの作成方法や Bot Token の取得方法については、[Slack API ドキュメント](https://api.slack.com/) を参照してください。

コーディングエージェントに Slack チャンネルを追加してもらうための、CLI コマンドが用意されています。`flue add channel slack` コマンドを `--print` オプションを指定することで、Slack チャンネルを設定する手順が標準出力に表示されます。表示された内容をコーディングエージェントに渡すことで、Slack チャンネルの設定をコーディングエージェントに行わせることができます。

```bash
npx flue add channel slack --print | codex
```

ここでは学習目的のため、手動で Slack チャンネルを設定していきます。まず Slack アプリの Bot Token と Signing Secret を取得して環境変数として設定します。

```bash:.env
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token
SLACK_SIGNING_SECRET=your-slack-signing-secret
```

Slack チャンネルを作成するための `@flue/slack` と、公式の Slack SDK である `@slack/web-api` をインストールします。

```bash
npm install @flue/slack @slack/web-api
```

`src/channels/slack.ts` ファイルを作成し、Slack チャンネルを定義します。チャンネルは `src/channels` ディレクトリに配置する必要があります。これにより `/channels/slack/events`, `/channels/slack/interactions`, `/channels/slack/commands` などのエンドポイントが自動で作成されます。

```ts:src/channels/slack.ts
import { dispatch } from '@flue/runtime';
import { createSlackChannel } from '@flue/slack';
import sreAgent from '../agents/sre-agent.ts';

export const channel = createSlackChannel({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  async events({ payload }) {
    if (payload.type !== 'event_callback') return;
    if (payload.event.type !== 'app_mention') return;

    const event = payload.event;
    await dispatch(sreAgent, {
      id: channel.conversationKey({
        teamId: payload.team_id,
        channelId: event.channel,
        threadTs: event.thread_ts ?? event.ts,
      }),
      input: {
        type: 'slack.app_mention',
        eventId: payload.event_id,
        text: event.text,
      },
    });
  },
});
```

この例では Slack でアプリがメンションされた場合（`app_mention` イベント）にのみ反応するようにしています。`dispatch` 関数を使用して、SRE エージェントにイベントを送信しています。`conversationKey` 関数を使用して、Slack のチーム ID、チャンネル ID、スレッドのタイムスタンプを組み合わせて一意の会話キーを生成しています。メンションのテキストは `input` オブジェクトの `text` プロパティに渡されます。

ただしこのままでは Slack のメッセージを受信するだけで、SRE エージェントが処理した結果を Slack に返信することができません。Slack に返信するためには、Slack に返信するツールを定義する必要があります。`src/tools/reply-in-threads.ts` ファイルを作成し、スレッドに返信するツール `replyInThread` を定義します。

```ts:src/tools/reply-in-threads.ts
import { defineTool } from "@flue/runtime";
import { WebClient } from "@slack/web-api";
import * as v from "valibot";

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

export function replyInThread(ref: { channelId: string; threadTs: string }) {
  return defineTool({
    name: "reply-in-slack-thread",
    description: "このエージェントに紐づく Slack スレッドに返信する。",
    input: v.object({ text: v.pipe(v.string(), v.minLength(1)) }),
    async run({ input }) {
      const result = await client.chat.postMessage({
        channel: ref.channelId,
        thread_ts: ref.threadTs,
        text: input.text,
      });
      return {
        ...(result.channel === undefined ? {} : { channel: result.channel }),
        ...(result.ts === undefined ? {} : { ts: result.ts }),
      };
    },
  });
}
```

作成したツールは `sre-agent` エージェントに読み込ませます。このとき、`channel.parseConversationKey(id)` を使用して、Slack のチャンネル ID とスレッドのタイムスタンプを復元し、`replyInThread` ツールに渡します。

```ts:src/agents/sre-agent.ts
import { defineAgent, type AgentRouteHandler } from "@flue/runtime";
import instructions from "./sre-agent.md" with { type: "markdown" };
import { getLogsTool } from "../tools/get-logs.ts";
import { getServiceStatusTool } from "../tools/get-service-status.ts";
import { replyInThread } from "../tools/reply-in-threads.ts";
import paymentsRunbook from "../skills/payments-runbook/SKILL.md" with { type: "skill" };
import { channel } from "../channels/slack.ts";

export const description =
  "SRE エージェントです。システムの監視や障害対応、システムの復旧作業を自律的に行います。";

export const route: AgentRouteHandler = async (_c, next) => next();

export default defineAgent(({ id }) => ({
  model: "openai/gpt-5.4-nano",
  instructions,
  tools: [
    getLogsTool,
    getServiceStatusTool,
    replyInThread(channel.parseConversationKey(id)),
  ],
  skills: [paymentsRunbook],
}));
```

チャンネルを定義したら、Flue プロジェクトを起動します。

```bash
npx flue dev
```

http://localhost:3583 で開発サーバーが起動して、エージェントとして `sre-agent` が、チャンネルとして Slack が登録されていることが出力されます。ローカルの開発サーバーで Slack チャンネルを使用するためには、ngrok などのツールを使用してローカルサーバーをインターネットに公開する必要があります。ngrok を使用してローカルサーバーを公開し、Slack アプリのイベントサブスクリプションの Request URL に `https://<your-ngrok-subdomain>.ngrok.io/channels/slack/events` を設定します。ngrok のサブドメインは、コマンドの実行結果に表示される URL を使用してください。

```bash
ngrok http 3583
```

その後「Subscribe to bot events」で `app_mention` イベントを追加し、Slack アプリをワークスペースにインストールします。これで Slack から SRE エージェントを呼び出すことができるようになります。「@sre-agent payments-api で 5xx が増えてるので Runbook の内容に基づいて進めて」といったメッセージを送信すると、SRE エージェントが Runbook の内容に基づいて調査や復旧アクションの提案を行い、結果をスレッドに返信します。

![](https://images.ctfassets.net/in6v9lxmm5c8/14mAdhUrCR5RrwIu9Or8DA/2646271ced1117e95dccfe7f00ac29d8/image.png)

## まとめ

- Flue はハーネス駆動のアーキテクチャを採用した TypeScript 製の AI エージェントフレームワークであり、エージェント・ワークフロー・instructions・ツール・スキル・サブエージェント・MCP サーバー・サンドボックス・オブサーバビリティ・チャンネルといった構成要素を包括的に提供する
- セッションの履歴やコンテキストをストレージに保存することで耐久性のある実行を実現しており、Cloudflare Workers 上では Durable Object に状態を保存する
- エージェントは `defineAgent` で定義し、ファイル名や配置ディレクトリといった規約に従うことで Flue が自動的に収集する。`instructions` は長大になりがちなため、独立した Markdown ファイルとして管理するのが望ましい
- ツールは `defineTool` で定義し、`tools` プロパティに渡すことでエージェントから利用できる
- Runbook のように障害の種類ごとに複数存在するコンテキストは、スキルとして定義することで progressive disclosure により必要なときだけ読み込める。スキルは `SKILL.md` で作成し、import 属性 `with { type: "skill" }` で import する
- 複数の領域を横断する調査では、サブエージェントにタスクを委譲することでメインエージェントのコンテキスト汚染を防ぎ、効率的に調査を進められる。サブエージェントは `defineAgentProfile` で定義する
- 有限で検査可能な処理はワークフローとして構造化でき、`defineWorkflow` で入力・出力スキーマと処理を定義する
- チャンネルを利用することで、Slack などの既存のチャットサービスからエージェントを呼び出せます。

## 参考

- [Flue — The Open Agent Framework](https://flueframework.com/)
- [withastro/flue: The sandbox agent framework.](https://github.com/withastro/flue)
- [Bringing more agent harnesses and frameworks to Cloudflare, starting with Flue](https://blog.cloudflare.com/agents-platform-flue-sdk/)
- [Pi Coding Agent](https://pi.dev/)
- [作って使うAIエージェント —— Pi Coding Agentで足りない機能を自作しよう](https://blog.lai.so/pi-coding-agent/)
