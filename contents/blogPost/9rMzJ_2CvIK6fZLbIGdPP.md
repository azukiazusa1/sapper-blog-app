---
id: 9rMzJ_2CvIK6fZLbIGdPP
title: "@json-render/chat で AI が組み立てたカードを Slack に投稿する"
slug: "json-render-chat-slack"
about: "LLM にテーブルやグラフを含むチャットのメッセージを作らせる方法の 1 つに、メッセージの形ごとにツールを用意する方法があります。@json-render/chat は、カタログから AI に部品を選ばせた Spec を Chat SDK のカードに変換し、Slack では Block Kit として投稿します。この記事では Slack ボットを実装し、テーブルやグラフを含むリッチなメッセージが投稿されるまでの流れを紹介します。"
createdAt: "2026-11-08T14:38+09:00"
updatedAt: "2026-11-08T14:38+09:00"
tags: ["Generative UI", "json-render", "Slack"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/K9Q1deXcwDjLZdbskeEbO/6ba7b1045d81b99d1fcf81afd1629e50/aburiebi-nigiri-sushi_21410.png"
  title: "炙りエビマヨ寿司のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "@json-render/chat が Spec を変換した結果として出力するものはどれですか？"
      answers:
        - text: "Slack の Block Kit の JSON"
          correct: false
          explanation: "@json-render/chat は Block Kit を直接出力しません。Block Kit への変換は Chat SDK の Slack アダプターが行います。"
        - text: "React コンポーネントのツリー"
          correct: false
          explanation: "React コンポーネントに変換するのは @json-render/react です。@json-render/chat はチャットのメッセージ向けのレンダラーです。"
        - text: "Chat SDK の CardElement"
          correct: true
          explanation: "toCard() はプラットフォームに依存しない Chat SDK の CardElement を返し、各アダプターが Slack では Block Kit、Teams では Adaptive Cards に変換します。"
        - text: "Microsoft Teams の Adaptive Cards の JSON"
          correct: false
          explanation: "Adaptive Cards への変換は Chat SDK の Teams アダプターの役割です。@json-render/chat の出力はプラットフォームに依存しません。"

    - question: "limits を渡さずに、テーブルを 2 つ含むカードを Slack に投稿すると何が起きますか？"
      answers:
        - text: "2 つ目のテーブルがコードブロックの ASCII テーブルに置き換えられる"
          correct: true
          explanation: "Chat SDK の Slack アダプターは、1 メッセージにつき 1 つを超えるテーブルをエラーにせず ASCII テーブルへ置き換えます。そのためボットのコードからは置き換えに気づけません。"
        - text: "toCard() が CardSpecError を投げる"
          correct: false
          explanation: "CardSpecError で拒否されるのは limits に tables を渡した場合です。limits を渡さなければ toCard() はテーブルの数を検証しません。"
        - text: "streamCard() がモデルに Spec を自動で作り直させる"
          correct: false
          explanation: "streamCard() は Spec を自動で作り直させません。limits を渡して CardSpecError を受け取り、issues をモデルに返して再生成させる処理は自分で書く必要があります。"
        - text: "2 つ目のテーブルが削除され、1 つ目のテーブルだけが表示される"
          correct: false
          explanation: "2 つ目のテーブルは削除されず、データを保ったまま ASCII テーブルとして表示されます。"

published: true
---

Slack のボットでテーブルやグラフを含むメッセージを送るには、Slack のメッセージをブロックの組み合わせで表す [Block Kit](https://docs.slack.dev/block-kit/) の JSON を組み立てる必要があります。LLM にこの処理を任せる方法の 1 つは、「テーブルを投稿するツール」「グラフを投稿するツール」のように、メッセージの形ごとにツールを用意することです。この方法では、ツールが想定していない組み合わせを 1 通のメッセージにできません。例えばテーブルとグラフを同時に表示したい場合は、それぞれのツールが別々のメッセージとして投稿する必要があります。

[json-render](https://json-render.dev) は、あらかじめ定義したコンポーネントのカタログから AI に部品を選ばせ、UI の構造を表す JSON（Spec）を生成させるフレームワークです。カタログの考え方は [事前に定義した UI を AI に生成させる json-render を試してみた](/blog/json-render) で紹介しました。2026 年 11 月 4 日に公開された `@json-render/chat` は、この Spec を Slack や Microsoft Teams のメッセージとして投稿するためのパッケージです。モデルは部品を組み合わせた 1 つの Spec を生成するので、形ごとにツールを用意しなくても、テーブルとグラフとボタンを 1 通のメッセージにまとめられます。

この記事では `@json-render/chat` を使って、メンションされると売上データをカードにまとめて返す Slack ボットを実装し、テーブルやグラフを含むリッチなメッセージが投稿されるまでの流れを紹介します。

## @json-render/chat の概要

`@json-render/chat` は Slack の Block Kit を直接出力するのではなく、Vercel の [Chat SDK](https://chat-sdk.dev) が定義する `CardElement` というプラットフォームに依存しないカードの表現を出力します。Chat SDK は Slack、Teams、Discord、Google Chat などのアダプターを持ち、各アダプターがカードをそのプラットフォームの形式に変換します。例えば Slack では Block Kit、Teams では Adaptive Cards になります。

`@json-render/chat` が提供するのは次の 3 つです。

- `schema` と `standardComponentDefinitions`: チャット向けのカタログを定義するためのスキーマと、標準のコンポーネント定義
- `toCard(spec)`: 完成した Spec を検証して `CardElement` に変換する関数
- `streamCard(thread, textStream)`: モデルの出力をストリーミングで受け取り、メッセージを投稿してから編集し続ける関数

標準のコンポーネントは、ルートになる `Card` のほか、`Section`、`Text`、`Fields` と `Field`、`Table`、`Chart`、`Divider`、`Image`、`Actions` と `Button`・`LinkButton` です。それぞれ Chat SDK の同名のカード要素に変換されます。

`@json-render/chat` を使えば、メッセージの形ごとにツールを用意しなくても、モデルが組み立てた 1 つの Spec でテーブルやグラフを 1 通のメッセージにまとめられます。さらに変換先は Chat SDK のカードなので、同じ Spec を Slack にも Teams にも投稿できます。

## Slack アプリを作成する

ボットは [Socket Mode](https://docs.slack.dev/apis/events-api/using-socket-mode) で Slack に接続します。Socket Mode ではボットのほうから WebSocket で Slack に接続するため、ローカルで開発する場合に便利です。

[api.slack.com/apps](https://api.slack.com/apps) で「Create New App」→「From a manifest」を選び、ワークスペースを選択してから、次のマニフェストを YAML で貼り付けます。

```yaml:slack-manifest.yaml
display_information:
  name: shop-bot
  description: json-render と Chat SDK でカードを投稿するボット
features:
  bot_user:
    display_name: shop-bot
    always_online: true
oauth_config:
  scopes:
    bot:
      - app_mentions:read
      - channels:history
      - chat:write
      - users:read
settings:
  event_subscriptions:
    bot_events:
      - app_mention
  interactivity:
    is_enabled: true
  org_deploy_enabled: false
  socket_mode_enabled: true
  token_rotation_enabled: false
```

`app_mention` はボットへのメンションを、`interactivity` はカードのボタン操作を受け取るための設定です。どちらも Socket Mode では Request URL を指定しません。

アプリを作成したら、次の 2 つのトークンを取得します。

1. 「Basic Information」の「App-Level Tokens」で「Generate Token and Scopes」を選び、`connections:write` スコープを付けたトークン（`xapp-` で始まる）を作成する
2. 「Install App」でワークスペースにインストールし、「Bot User OAuth Token」（`xoxb-` で始まる）をコピーする

最後に、ボットを使うチャンネルで `/invite @shop-bot` を実行して招待します。

## プロジェクトを準備する

必要なパッケージをインストールします。`chat` が Chat SDK 本体、`@chat-adapter/slack` が Slack のアダプター、`@chat-adapter/state-memory` はスレッドの状態をメモリに保存するアダプターです。モデルの呼び出しには [AI SDK](https://ai-sdk.dev) を使います。

```bash
npm install @json-render/core@0.22.0 @json-render/chat@0.22.0 chat@4.44.0 @chat-adapter/slack@4.44.0 @chat-adapter/state-memory@4.44.0 ai@7.0.162 zod@4.6.7
npm install -D tsx@4.23.13 typescript@5.9.3 @types/node@22.20.4
```

`.env` にトークンと [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) の API キーを設定します。AI SDK は `"openai/gpt-4.1"` のような文字列でモデルを指定すると、`AI_GATEWAY_API_KEY` を使って AI Gateway 経由でモデルを呼び出します。AI Gateway を使わない場合は、`@ai-sdk/openai` などのプロバイダーパッケージでモデルを指定してください。`@chat-adapter/slack` は `SLACK_BOT_TOKEN` と `SLACK_APP_TOKEN` を環境変数から読み込みます。

```txt:.env
AI_GATEWAY_API_KEY=...
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
```

## データを集計するツールを用意する

ボットが回答する題材として、架空の EC ショップの商品と、直近 7 日間の売上個数を用意します。

```ts:src/data.ts
// 架空の EC ショップのデータ。実際のボットではデータベースや API から取得する
export const products = [
  { id: "p-001", name: "ドリップコーヒーセット", category: "コーヒー", price: 2480, stock: 42 },
  { id: "p-002", name: "カフェオレベース", category: "コーヒー", price: 1280, stock: 8 },
  { id: "p-003", name: "ほうじ茶ティーバッグ", category: "お茶", price: 980, stock: 120 },
  { id: "p-004", name: "抹茶パウダー", category: "お茶", price: 1980, stock: 3 },
  { id: "p-005", name: "ステンレスタンブラー", category: "雑貨", price: 3200, stock: 25 },
];

// 直近 7 日間の商品ごとの売上個数
export const dailySales = [
  { date: "11/01", units: { "p-001": 12, "p-002": 5, "p-003": 20, "p-004": 4, "p-005": 2 } },
  { date: "11/02", units: { "p-001": 15, "p-002": 7, "p-003": 18, "p-004": 6, "p-005": 3 } },
  { date: "11/03", units: { "p-001": 9, "p-002": 4, "p-003": 22, "p-004": 5, "p-005": 1 } },
  { date: "11/04", units: { "p-001": 11, "p-002": 6, "p-003": 19, "p-004": 8, "p-005": 4 } },
  { date: "11/05", units: { "p-001": 14, "p-002": 9, "p-003": 25, "p-004": 7, "p-005": 2 } },
  { date: "11/06", units: { "p-001": 18, "p-002": 8, "p-003": 21, "p-004": 9, "p-005": 5 } },
  { date: "11/07", units: { "p-001": 20, "p-002": 10, "p-003": 24, "p-004": 11, "p-005": 6 } },
];

// ツールで集計してから渡す
export function getWeeklySales() {
  const byProduct = products.map((product) => {
    const daily = dailySales.map((day) => ({
      date: day.date,
      units: day.units[product.id as keyof typeof day.units],
    }));
    const units = daily.reduce((sum, day) => sum + day.units, 0);
    return { ...product, units, revenue: units * product.price, daily };
  });
  return {
    period: "2026/11/01〜11/07",
    totalUnits: byProduct.reduce((sum, p) => sum + p.units, 0),
    totalRevenue: byProduct.reduce((sum, p) => sum + p.revenue, 0),
    byProduct,
  };
}
```

## カタログを定義する

この記事では `standardComponentDefinitions` を元にカタログを定義します。`standardComponentDefinitions` は、`@json-render/chat` が用意している標準コンポーネント（`Card`、`Table`、`Chart`、`Button` など）の定義をまとめたオブジェクトです。`Button` だけは定義を上書きし、モデルが生成できる `id` を制限します。

```ts:src/catalog.ts
import { defineCatalog } from "@json-render/core";
import { schema, standardComponentDefinitions } from "@json-render/chat";
import { z } from "zod";
import { products } from "./data.ts";

// Slack は同じ Actions ブロック内で action_id の重複を許さないため、商品ごとに id を分ける
export const productActionIds = products.map(
  (product) => `show-product:${product.id}`,
) as [string, ...string[]];

export const components = {
  ...standardComponentDefinitions,
  Button: {
    ...standardComponentDefinitions.Button,
    props: z.object({
      // モデルが作れる id を、ボットが onAction で処理できるものだけに絞る
      id: z.enum(productActionIds),
      label: z.string(),
      style: z.enum(["default", "primary", "danger"]).nullish(),
    }),
    description:
      "商品の詳細を表示するボタン。id は show-product:<商品 ID> の形式で、存在する商品だけを指定できる。",
  },
};

export const catalog = defineCatalog(schema, { components });

// Slack の上限。超えた要素はエラーにならず ASCII のテーブルへ置き換えられるため、Spec ごと拒否する
export const slackLimits = {
  tables: 1,
  charts: 2,
  chartTitle: 50,
  chartLabel: 20,
};
```

`Button` の `id` は、Chat SDK でボタンが押されたときに呼ばれる `onAction` ハンドラーの識別子になります。標準の定義では任意の文字列なので、モデルがボットの知らない `id` を生成すると、押しても何も起きないボタンになってしまいます。`z.enum()` で `id` を絞ると、`catalog.prompt()` が生成するシステムプロンプトにも次のように候補が列挙されます。

```txt
- Button: { id: "show-product:p-001" | "show-product:p-002" | "show-product:p-003" | "show-product:p-004" | "show-product:p-005", label: string, style?: "default" | "primary" | "danger" } - 商品の詳細を表示するボタン。...
```

候補にない `id` が出力された場合は、後述する `toCard()` の検証で拒否されます。

## カードをストリーミングで投稿する

モデルを呼び出してカードを投稿する処理を書きます。メンションを受け取ってからカードが投稿されるまでに、次のような関数が呼ばれます。

```txt
onNewMention
  → postGeneratedCard(thread, prompt)
      → generate(prompt): モデルを呼び出し、出力された JSONL のテキストを順に返す
      → streamCard(thread, テキスト, オプション): テキストから Spec を組み立て、カードとして投稿・編集する
```

まず `src/generate.ts` に、システムプロンプト、ツール、`generate()` を定義します。

```ts:src/generate.ts
import {
  CardSpecError,
  streamCard,
  toCard,
  type CardMessage,
  type CardTarget,
} from "@json-render/chat";
import { stepCountIs, streamText, tool } from "ai";
import type { Thread } from "chat";
import { z } from "zod";
import { catalog, components, slackLimits } from "./catalog.ts";
import { getWeeklySales, products } from "./data.ts";

const MODEL = "openai/gpt-4.1";

const system = catalog.prompt({
  customRules: [
    "The message is posted by a bot into a team chat. Keep it scannable: a short title, one sentence of context, then the data.",
    "Always call the tools to get data. Never invent numbers. Write all text in Japanese.",
    "When the card mentions specific products, end it with an Actions row of up to 3 show-product buttons for the most notable ones.",
  ],
});

const tools = {
  getProducts: tool({
    description: "商品の一覧（ID、名前、カテゴリ、価格、在庫数）を取得する",
    inputSchema: z.object({}),
    execute: async () => products,
  }),
  getWeeklySales: tool({
    description:
      "直近 7 日間の売上を取得する。全体の合計、商品ごとの合計と日別の個数を含む",
    inputSchema: z.object({}),
    execute: async () => getWeeklySales(),
  }),
};

async function* generate(prompt: string) {
  const result = streamText({
    model: MODEL,
    system,
    prompt,
    tools,
    // ツールを呼び出した後に Spec を出力させるため、複数ステップを許可する
    stopWhen: stepCountIs(5),
  });
  for await (const part of result.stream) {
    if (part.type === "text-delta") yield part.text;
    // textStream はステップ間に改行を入れないため、JSONL の行が前のステップのテキストと連結されないようにする
    if (part.type === "finish-step") yield "\n";
    if (part.type === "error") throw part.error;
  }
}
```

`catalog.prompt()` が生成するプロンプトに従い、モデルは [RFC 6902](https://www.rfc-editor.org/rfc/rfc6902) の JSON Patch を 1 行に 1 つずつ並べた JSONL を出力し、`/root` から順に要素を追加していきます。`customRules` には、ツールからデータを取得すること、日本語で書くこと、商品ボタンを付けることを追加しています。

`generate()` では `result.stream` の結果をループし、`text-delta` の場合はテキストを返し、`finish-step` の場合は改行を返します。`finish-step` は 1 ステップ（モデルの 1 回の応答）が終わったことを示すので、次のステップの JSONL が前のステップのテキストと連結されないように改行を入れます。

続いて、`generate()` の出力を `streamCard()` に渡す `postGeneratedCard()` を `src/generate.ts` に追加します。

```ts:src/generate.ts
export async function postGeneratedCard(
  thread: Thread<unknown>,
  prompt: string,
) {
  await streamCard(thread, generate(prompt), { components });
}
```

`streamCard()` は 3 つの引数を受け取ります。

- 第 1 引数: カードを投稿するスレッド。メンションを受け取った Chat SDK の `Thread` をそのまま渡す
- 第 2 引数: モデルが出力したテキスト。文字列の非同期イテレーターであればよく、`generate()` の戻り値や AI SDK の `textStream` を渡せる
- 第 3 引数: オプション。ここでは `components` に `Button` を上書きしたコンポーネント定義を渡している。省略すると標準の定義で検証する

ボットの本体では、Chat SDK の `Chat` に Slack アダプターを登録し、`bot.onNewMention` でメンションを受け取ったらカードを生成します。

```ts:src/index.ts
import { createSlackAdapter } from "@chat-adapter/slack";
import { createMemoryState } from "@chat-adapter/state-memory";
import { Chat } from "chat";
import { productActionIds } from "./catalog.ts";
import { postGeneratedCard } from "./generate.ts";

const bot = new Chat({
  userName: "shop-bot",
  adapters: {
    // SLACK_BOT_TOKEN と SLACK_APP_TOKEN を環境変数から読み込む
    slack: createSlackAdapter({ mode: "socket" }),
  },
  state: createMemoryState(),
});

bot.onNewMention(async (thread, message) => {
  await postGeneratedCard(thread, message.text);
});

bot.onAction(productActionIds, async (event) => {
  if (!event.thread) return;
  const productId = event.actionId.replace("show-product:", "");
  await postGeneratedCard(
    event.thread,
    `商品 ${productId} の詳細と、直近 7 日間の売上の推移を見せて`,
  );
});

await bot.initialize();
console.log("shop-bot is running");
```

`createSlackAdapter({ mode: "socket" })` で Socket Mode を有効にすると、`bot.initialize()` の中で WebSocket の接続が始まります。`createMemoryState()` はスレッドの状態をプロセスのメモリに保存するため、再起動すると消えてしまいます。本番環境では Redis などの[状態アダプター](https://chat-sdk.dev/docs/state-adapters)を使い、サーバーレス環境でも状態を保持できるようにしてください。

`bot.onAction()` は Slack のボタンが押されたときに呼ばれるハンドラーです。`productActionIds` に列挙した `id` のボタンが押された場合に呼ばれ、押されたボタンの `actionId` から商品 ID を取り出して、商品詳細を表示するカードを生成します。

`.env` を読み込んでボットを起動します。

```bash
node --env-file=.env --import tsx src/index.ts
```

`Slack socket mode connected` と `shop-bot is running` が表示されたら、チャンネルで `@shop-bot 先週の売上を見せて` とメンションします。

`streamCard()` はルートの `Card` が届いた時点でメッセージを投稿し、その後は要素が届くと、デフォルトで 500 ms の間隔でメッセージを編集します。完成したカードは次のようになりました。

![「先週の売上を見せて」へのカード。合計の Fields と商品別のテーブルが表示されている](https://images.ctfassets.net/in6v9lxmm5c8/5M00zAfXpCPUMKdJaBK4tG/3e2e3b292950927b83173625cfe3d991/json-render-chat-slack-1.png)

![日別販売数の棒グラフと、商品の詳細を表示するボタン](https://images.ctfassets.net/in6v9lxmm5c8/1WKzZ8y16dgYRbqCza1QS0/66d7b1c687d22f41fad8702fc907e8a2/json-render-chat-slack-2.png)

テーブルは Slack の [data table ブロック](https://docs.slack.dev/reference/block-kit/blocks/data-table-block/)、グラフは [data visualization ブロック](https://docs.slack.dev/reference/block-kit/blocks/data-visualization-block/)として表示されています。どちらも Chat SDK の Slack アダプターが `Table` と `Chart` から変換したものです。

## Slack の上限を超えた Spec を作り直させる

Slack の 1 つのメッセージに含められるテーブルやグラフには上限があります。Chat SDK の Slack アダプターでは、次の条件に当てはまる要素を、Slack に送る前にコードブロックの ASCII テーブルへ置き換えています。

- 2 つ目以降のテーブル
- 101 行以上、21 列以上、または全セルの合計が 10,000 文字を超えるテーブル
- 3 つ目以降のグラフ
- タイトルが 50 文字を超える、ラベルが 20 文字を超える、系列またはカテゴリの数が多すぎるなど、Slack が受け付けないグラフ

「`@shop-bot` 商品ごとの売上合計のテーブルと、カテゴリごとの売上合計のテーブルを、別々のテーブルで見せて」とメンションしてテーブルを 2 つ含む回答を生成させると、2 つ目のテーブルが ASCII テーブルに置き換えられていることがわかります。

![2 つ目のテーブルは Slack アダプターによって ASCII のテーブルに置き換えられる](https://images.ctfassets.net/in6v9lxmm5c8/6Sj3z3NFJT0fIZBPXbJ8rb/cf23fbe6b809fc0103bd71509b6847fb/json-render-chat-slack-3.png)

`toCard()` と `streamCard()` に `limits` を渡すと、置き換える代わりに Spec を拒否できます。上限を超えると `CardSpecError` が投げられ、`issues` プロパティに問題が 1 つずつ文字列で入ります。テーブルを 2 つ含む Spec では、次の `issues` になりました。

```txt
[ 'at most 1 Table per message' ]
```

`issues` は人が読める形式になっており、[ドキュメント](https://json-render.dev/docs/api/chat#validation-and-limits)は、`issues` をモデルに送り返して Spec を修正させることを想定しています。`limits` 以外でも、props がスキーマに合わない場合や、子を持てないコンポーネントに `children` がある場合も、同じ `CardSpecError` になります。

上限を超えたメッセージを生成し直させるようにするために、`postGeneratedCard()` を次のように書き換えます。`streamCard()` に `limits` を渡し、`CardSpecError` が発生したら `issues` をプロンプトに加えてもう一度生成し、同じメッセージを編集します。

```ts:src/generate.ts
const MAX_ATTEMPTS = 2;

function withIssues(prompt: string, issues: string[]) {
  if (issues.length === 0) return prompt;
  return [
    prompt,
    "",
    "The previous card was rejected for these reasons. Fix every issue and output the whole card again:",
    ...issues.map((issue) => `- ${issue}`),
  ].join("\n");
}

export async function postGeneratedCard(
  thread: Thread<unknown>,
  prompt: string,
) {
  // CardSpecError は投稿済みのメッセージを持たず、thread をそのまま渡すと再試行のたびに新しく投稿されるため、post の戻り値を保持する
  let posted: CardMessage | undefined;
  // 2 回目以降の生成では、新しく投稿せずに同じメッセージを編集する
  const target: CardTarget = {
    post: async (card) => {
      if (!posted) return (posted = await thread.post(card));
      await posted.edit(card);
      return posted;
    },
  };

  let issues: string[] = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      await streamCard(target, generate(withIssues(prompt, issues)), {
        components,
        limits: slackLimits,
      });
      return;
    } catch (error) {
      if (!(error instanceof CardSpecError)) throw error;
      console.warn(`CardSpecError (attempt ${attempt}):`, error.issues);
      // 指摘をモデルに返して、次の生成で直させる
      issues = error.issues;
    }
  }

  // 直らなかった場合は、タイトルだけのカードに置き換える
  await target.post(
    toCard({
      root: "card",
      elements: {
        card: {
          type: "Card",
          props: { title: "カードを生成できませんでした" },
          children: [],
        },
      },
    }),
  );
}
```

`@shop-bot 商品ごとの売上合計のテーブルと、カテゴリごとの売上合計のテーブルを、別々のテーブルで見せて` とメンションすると、次の順でメッセージが変化しました。

1. 生成中はテーブルが 2 つあるカードが表示され、2 つ目は ASCII テーブルになる
2. 生成が終わると `CardSpecError` が投げられる。この時点ではメッセージは変わらず、ASCII テーブルを含むカードが残る
3. 2 回目の生成が始まり、ルートの `Card` が届くと、同じメッセージがタイトルだけのカードで上書きされる
4. 生成が進むと、テーブルが 1 つにまとめられたカードになる

![](https://images.ctfassets.net/in6v9lxmm5c8/5PsUmaU0FdELQhmuovZ9Vx/e4ee206453a69fc7009d50f4023828f7/json-render-chat-slack-5.png)

## ボタンの操作を受け取る

`src/index.ts` の `bot.onAction()` は、カードのボタンが押されたときに呼ばれます。第 1 引数に `id` の配列を渡すと、そのいずれかに完全一致するボタンが押されたときにハンドラーが呼ばれます。ここではカタログの enum と同じ `productActionIds` を渡しているため、モデルが生成できるボタンと、ボットが処理できるボタンが一致します。

```ts
bot.onAction(productActionIds, async (event) => {
  if (!event.thread) return;
  const productId = event.actionId.replace("show-product:", "");
  await postGeneratedCard(
    event.thread,
    `商品 ${productId} の詳細と、直近 7 日間の売上の推移を見せて`,
  );
});
```

`event.actionId` には押されたボタンの `id` が入ります。`event.thread` はカードがあるスレッドで、ホームタブのボタンなど、スレッドに属さない操作では `null` になります。ハンドラーでは商品 ID を取り出し、その商品の詳細を求めるプロンプトで新しいカードを生成しています。

「ほうじ茶ティーバッグ」のボタンを押すと、`event.actionId` に `show-product:p-003` が入り、同じスレッドに詳細のカードが投稿されました。

![商品ボタンを押すと、onAction でその商品の詳細カードが生成される](https://images.ctfassets.net/in6v9lxmm5c8/kqDr3fnGId7OaDN5VXpRj/9a19e6175c2622458476b4193918dd31/json-render-chat-slack-4.png)

## まとめ

- `@json-render/chat` は、カタログから部品を選ばせた Spec を Chat SDK の `CardElement` に変換し、Slack では Chat SDK のアダプターが Block Kit として投稿する
- `streamCard()` はルートの `Card` が届いた時点でメッセージを投稿し、要素が届くとデフォルトで 500 ms の間隔でメッセージを編集する
- Slack アダプターは上限を超えたテーブルやグラフをエラーにせず ASCII テーブルに置き換えるため、`limits` を渡して `CardSpecError` で拒否させる

## 参考

- [@json-render/chat | json-render](https://json-render.dev/docs/api/chat)
- [feat(chat): add Chat SDK renderer · Pull Request #451 · vercel-labs/json-render](https://github.com/vercel-labs/json-render/pull/451)
- [Chat SDK](https://chat-sdk.dev)
- [@chat-adapter/slack README](https://github.com/vercel/chat/tree/main/packages/adapter-slack)
- [Block Elements | Slack Developer Docs](https://docs.slack.dev/reference/block-kit/block-elements)
