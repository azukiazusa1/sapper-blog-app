---
id: K8oPg5obTRRhRrc6rmoKY
title: "OpenAI Agents の TypeScript SDK"
slug: "openai-agents-sdk-typescript"
about: "OpenAI Agents SDK は AI エージェントを構築するためのパッケージです。軽量で使いやすく、抽象化を最小限に抑えているのが特徴です。この記事では、OpenAI Agents SDK の TypeScript バージョンの使用例を紹介します。"
createdAt: "2025-06-08T09:18+09:00"
updatedAt: "2025-06-08T09:18+09:00"
tags: ["OpenAI", "AI", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2QXAglNLh4H28vk5spkCH5/3870b244224e372a6e3ddb3899202409/22801990.png"
  title: "22801990"
audio: null
selfAssessment:
  quizzes:
    - question: "ガードレールの関数の戻り値で、エージェントの実行を中断するために使用するプロパティはどれか？"
      answers:
        - text: "tripwireTriggered"
          correct: true
          explanation: null
        - text: "outputInfo"
          correct: false
          explanation: "outputInfoはガードレールの出力に関する情報であり、実行の中断には使用されません。"
        - text: "isValid"
          correct: false
          explanation: "isValidは存在しません。"
        - text: "guardrailStatus"
          correct: false
          explanation: "guardrailStatusは存在しません。"
    - question: "Human-in-the-Loop (HITL) 機能でツールの実行を承認するために使用するメソッドはどれですか？"
      answers:
        - text: "result.state.accept()"
          correct: false
          explanation: null
        - text: "result.state.approve"
          correct: true
          explanation: null
        - text: "result.state.confirm()"
          correct: false
          explanation: null
        - text: "result.state.allow()"
          correct: false
          explanation: null
published: true
---
OpenAI Agents SDK は AI エージェントを構築するためのパッケージです。軽量で使いやすく、抽象化を最小限に抑えているのが特徴です。以前実験的に公開されていた [Swarm](https://github.com/openai/swarm/tree/main) を本番環境向けにアップグレードされたものです。Agents SDK には以下のプリミティブな機能が含まれています。

- エージェント：instructions とツールを持つ LLM。特定のタスクを完了するまでループを実行する
- ハンドオフ：エージェントが特定のタスクを他のエージェントに委任する
- ガードレール：エージェントへの入力を検証する
- ツール：エージェントが使用する関数を Zod スキーマで定義する
- トレース：ワークフローを視覚化し、デバッグ・監視をできるトレース機能に加えて、OpenAI の評価・ファインチューニング・蒸留ツールを使用できる
- リアルタイムエージェント：音声会話を行う Voice Agents を使用してリアルタイムでエージェントと対話する

この記事では、OpenAI Agents SDK の TypeScript バージョンの使用例を紹介します。

## インストール

まずは TypeScript のプロジェクトを作成し必要なパッケージをインストールします。以下のコマンドを実行してください。

```bash
mkdir openai-agents-ts-example
cd openai-agents-ts-example
npm init -y
npm install typescript tsx @types/node
```

ES モジュールを使用するために `package.json` に以下の設定を追加します。

```json
{
  "type": "module"
}
```

OpenAI Agents SDK と Zod をインストールします。

```bash
npm install @openai/agents zod
```

OpenAI の API キーを環境変数 `OPENAI_API_KEY` に設定する必要があります。

```bash
export OPENAI_API_KEY=<your_openai_api_key>
```

## エージェントを実行する

はじめに最もシンプルなエージェントを作成して実行してみましょう。以下のコードを `src/index.ts` ファイルに保存します。

```ts:src/index.ts
import { Agent, run } from "@openai/agents";

const agent = new Agent({
  name: "Senryu Agent",
  instructions: "常に川柳の形式で回答を生成します。",
  model: "o4-nano",
  tools: [], 
});

const result = await run(agent, "日本で一番高い山は？");

console.log(result.finalOutput);
```

`Agent` クラスを使用してエージェントを定義します。エージェントには以下のプロパティを設定します。

- `name`: エージェントの名前。人間が識別しやすいように設定する
- `instructions`: エージェントの指示。システムプロンプトとして機能し、エージェントの動作を定義する。
- `model`: 使用する LLM モデル。基本的に OpenAI のモデルしか指定できないが、`@openai/agents-extensions` 拡張機能と [Vercel AI SDK](https://ai-sdk.dev/docs/introduction) を使用することで、任意の LLM モデルを使用できる。
- `tools`: エージェントが使用するツールのリスト。今回はツールを使用しないため空の配列を指定する。

エージェント自体は何も実行しません。エージェントを実行するには `Runner` クラスもしくは `run` 関数を使用します。`Runner` クラスはトレースやモデルの設定を行うことができます。シンプルにエージェントを実行するだけであれば `run` 関数を使用するのが簡単です。

以下のコマンドでエージェントを実行します。

```bash
npx tsx src/index.ts
```

実行結果は以下のようになります。

```bash
富士山高く
日本の頂き
美しさ
```

### ストリーミングで回答を受け取る

回答をストリーミングで受け取りたい場合には `run` 関数の第三引数に `stream: true` を指定します。`stream.toTextStream()` メソッドを使用すると、ストリーミングされたテキストを逐次受け取ることができます。`compatibleWithNodeStreams: true` オプションを指定すると、Node.js のストリーム API と互換性のあるストリームを返すので、`process.stdout` に直接パイプすることもできます。

```ts:src/index.ts
const stream = await run(agent, "日本で一番高い山は？", { stream: true });

stream.toTextStream({
  compatibleWithNodeStreams: true,
}).pipe(process.stdout);
```

### 出力の形式を指定する

`Agent` クラスの `outputType` プロパティを指定すると指定したオブジェクトの形式で出力を受け取ることができます。出力の形式は Zod スキーマで定義できます。以下の例では川柳の上五・中七・下五に分割されたオブジェクトを出力として受け取ります。

```ts:src/index.ts
import { Agent, run } from "@openai/agents";
import { z } from "zod";

const senryuSchema = z.object({
  upper: z
    .string()
    .min(5, "上五は5文字以上である必要があります")
    .describe("上五"),
  middle: z
    .string()
    .min(7, "中七は7文字以上である必要があります")
    .describe("中七"),
  lower: z
    .string()
    .min(5, "下五は5文字以上である必要があります")
    .describe("下五"),
});

const agent = new Agent({
  name: "Senryu Agent",
  instructions: "常に川柳の形式で回答を生成します。",
  model: "gpt-4.1-nano",
  tools: [],
  outputType: senryuSchema,
});
```

実行結果は以下のようになります。

```bash
{ upper: '富士山ぞ確か', middle: '高くそびえ立ち', lower: '日本の頂き' }
```

### history を使用してチャットのような対話を行う

`run` 関数の第二引数には `string` 型の入力だけでなく、`AgentInputItem` 型の配列を指定できます。`run` 関数の結果には `history` プロパティが含まれ、エージェントとの対話の履歴を取得できます。この履歴をループの中で使用することで、チャットのような対話を行うことができます。

```ts:src/index.ts
import { Agent, AgentInputItem, run, user } from "@openai/agents";
import { createInterface } from "readline/promises";

const agent = new Agent({
  name: "Chat Agent",
  instructions: "あなたは関西弁で話すチャットボットです。",
  model: "gpt-4.1-nano",
});

let chatHistory: AgentInputItem[] = [];

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (true) {
  const input = await rl.question("User: ");
  if (input.toLowerCase() === "exit") {
    break;
  }

  chatHistory.push(user(input));

  const result = await run(agent, chatHistory);
  chatHistory = result.history;

  console.log(`Bot: ${result.finalOutput}`);
}
```

## ツールを使用する

ツールはエージェントが動作するうえで重要な要素です。ツールを使用することで、エージェントは外部のデータや機能にアクセスし、より複雑なタスクを実行できます。例えば Web を検索するツールを使用することで、エージェントは最新の情報を取得したうえでより正確な回答を生成できます。

OpenAI Agents SDK では以下の 3 つのカテゴリのツールが提供されています。

- ホスト型ツール：OpenAI のサーバー上でモデルと一緒に実行されるツール。ウェブ検索やコードの実行、画像の生成などが可能
- 関数ツール：TypeScript の関数をツールとして定義する。Zod スキーマ（もしくは JSON Schema）で入力パラメーターを定義する
- エージェントをツールとして使用する：エージェント自体を呼び出し可能なツールとして定義する

### ホスト型ツール

ホスト型ツールは OpenAI のサーバー上で実行されるツールです。組み込みのツールとして以下のものが提供されています。

- `web_search`: ウェブ検索を行うツール。指定したクエリに対してウェブ上の情報を検索し、結果を返す
- `file_search`: OpenAI のサーバでホストされているベクターストアを検索する
- `computer`: GUI 操作を自動化するツール
- `code_interpreter`: サンドボックス環境でコードを実行するツール
- `image_generation`: 指定したプロンプトに基づいて画像を生成する

例として `web_search` ツールを使用してウェブ検索を行うエージェントを作成してみましょう。ホスト型ツールは `@openai/agents` パッケージからインポートできます。

```ts:src/index.ts
import { Agent, run, webSearchTool } from "@openai/agents";

const agent = new Agent({
  name: "Travel Agent",
  instructions:
    "あなたは旅行エージェントです。旅行に関する質問に答えてください。必ず最新の情報を提供するために、ウェブ検索を行ってください。",
  model: "gpt-4.1-mini", // gpt-4.1-nano では web_search ツールが使用できない
  tools: [webSearchTool()],
});

const result = await run(agent, "箱根旅行でおすすめの宿は？");

console.log(result.finalOutput);
```

実行結果は以下のようになります。確かに Web 検索を行い、宿泊施設のリンクやレビューを含む情報を提供していることがわかります。

```bash
箱根は美しい自然と豊かな温泉地で知られ、多くの魅力的な宿泊施設があります。以下に、箱根旅行でおすすめの宿をいくつかご紹介します。

**[箱根・芦ノ湖 はなをり](https://hanaori.jp/ashinoko/?utm_source=openai)**  
**閉じています · Hotel · 4.0 (20 件のレビュー)**  
_元箱根桃源台160, 箱根町, 神奈川県, 250-0522_  
芦ノ湖の湖畔に位置するリゾートホテルで、全室から湖の絶景を望めます。源泉かけ流しの温泉や、地元の食材を活かした料理が楽しめます。

**[天成園](https://www.tenseien.co.jp?utm_source=openai)**  
**閉じています · Hotel · 4.3 (114 件のレビュー)**  
_湯本682, 箱根町, 神奈川県, 250-0311_  
箱根湯本駅から徒歩圏内にある大型旅館で、広々とした大浴場や露天風呂が魅力。バイキング形式の食事も人気です。

**[Ten-yu, Hakone Kowakien (箱根小涌園 天悠)](http://www.ten-yu.com?utm_source=openai)**  
**閉じています · Hotel · 4.0 (47 件のレビュー)**  
_二ノ平1297, 箱根町, 神奈川県, 250-0407_  
全室に露天風呂が付いた高級旅館で、プライベート感を大切にした空間が特徴。和食のコース料理が評判です。

各宿の詳細や予約状況については、公式ウェブサイトや宿泊予約サイトでご確認ください。旅行の目的やお好みに合わせて、最適な宿をお選びください。 
```

OpenAI のダッシュボードでログを確認すると、確かに `web_search` ツールが呼び出され、ウェブ検索が行われたことがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5604OdYeO6HsGVr7qotox6/41c8e7a862dfc630a4b084e87d2f63dd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-08_12.53.15.png)

ここでは `instructions` で「必ず最新の情報を提供するために、ウェブ検索を行ってください」とツールを使用するように指示していますが、ツールを使用するかどうかはエージェントの判断に委ねられています。ツールの使用を強制する場合には `Agent` クラスの `modelSettings` プロパティに `toolChoice: 'required'` を設定します。なお、どのツールを使用するかまでは指定できない点に注意してください。

```ts:src/index.ts {7}
const agent = new Agent({
  name: "Travel Agent",
  instructions:
    "あなたは旅行エージェントです。旅行に関する質問に答えてください。必ず最新の情報を提供するために、ウェブ検索を行ってください。",
  model: "gpt-4.1-mini",
  tools: [webSearchTool()],
  modelSettings: { toolChoice: "required" },
});
```

### 関数ツール

関数ツールは TypeScript の関数をツールとして定義できます。Zod（もしくは JSON Schema）を使用して関数の入力パラメーターを定義します。以下の例では、指定した数値の平方根を計算するツールを定義しています。

```ts:src/index.ts
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const sqrtTool = tool({
  name: "sqrt",
  description: "指定した数値の平方根を計算します。",
  parameters: z.object({
    number: z.number().describe("平方根を計算する数値"),
  }),
  execute: async ({ number }) => {
    if (number < 0) {
      return {
        error: "平方根を計算する数値は0以上である必要があります。",
      };
    }
    return { result: Math.sqrt(number) };
  },
});

const agent = new Agent({
  name: "Math Agent",
  instructions: "数学の問題を解決するためにツールを使用します。",
  model: "gpt-4.1-nano",
  tools: [sqrtTool],
});

const result = await run(agent, "16の平方根は？");
console.log(result.finalOutput);
```

コードを実行すると、以下のように平方根の計算結果が返されます。

```bash
16の平方根は4です。
```

OpenAI のダッシュボードでログを確認すると、`sqrt` ツールが `{"number": 16 }` という入力で呼び出され、`{"result": 4}` という出力が返されたことがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/2j5Y6R2OYFfVOXDY37izcV/2d33cb2c36041f39f2aeeb7bf98c638f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-08_13.15.00.png)

### エージェントをツールとして使用する

`agent.asTool()` メソッドを使用すると、エージェント自体を呼び出し可能なツールとして定義できます。以下の例では川柳エージェントをツールとして定義し、他のエージェントから呼び出して使用しています。

```ts:src/index.ts
import { Agent, run, tool } from "@openai/agents";

const senryuAgent = new Agent({
  name: "Senryu Agent",
  instructions:
    "ユーザーから受け取った入力を川柳の形式に変換するエージェントです。",
  model: "gpt-4.1-nano",
  tools: [],
});

const senryuTool = senryuAgent.asTool({
  toolName: "senryu",
  toolDescription: "ユーザーからの入力を川柳の形式に変換します。",
});

const chatAgent = new Agent({
  name: "Chat Agent",
  instructions: "ユーザーからの質問に回答します。",
  model: "gpt-4.1-nano",
  tools: [senryuTool],
});

const result = await run(
  chatAgent,
  "コーディングエージェントの登場でエンジニアの仕事はどう変わると思う？川柳の形式で答えてください。"
);

console.log(result.finalOutput);
```

## ガードレール

ガードレールはエージェントと並行して実行されユーザー入力やエージェントの出力を検証するための機能です。ガードレールを使用することで、エージェントが不適切な出力を生成した場合に警告を表示したり、エージェントの動作を制限できます。

ガードレールは TypeScript の関数として定義します。エージェントに渡されるものと同じ入力を `input` として受け取ります。ガードレール関数は `GuardrailFunctionOutput` 型のオブジェクトを返す必要があります。このオブジェクトには以下のプロパティが含まれます。

- `tripwireTriggered`: この値が `true` の場合、エージェントの実行が中断される
- `outputInfo`: ガードレールの出力に関するオプショナルな情報

ガードレール関数は `Agent` クラスの `inputGuardrails` プロパティに配列として指定します。以下の例では、ユーザーが旅行に関する質問をすることを期待し、それ以外の質問が来た場合にはエラーをスローするガードレールを定義しています。

```ts:src/index.ts
import {
  Agent,
  run,
  InputGuardrailTripwireTriggered,
  InputGuardrail,
} from "@openai/agents";

const guardrail: InputGuardrail = {
  name: "Input Guardrail",
  execute: async ({ input }) => {
    const inputString = typeof input === "string" ? input : "";
    const isTravelQuestion =
      inputString.toLowerCase().includes("旅行") ||
      inputString.toLowerCase().includes("旅");
    return {
      tripwireTriggered: !isTravelQuestion,
      outputInfo: isTravelQuestion
        ? "旅行に関する質問です。"
        : "旅行に関する質問ではありません。",
    };
  },
};

const agent = new Agent({
  name: "Travel Agent",
  instructions: "旅行に関する質問に答えてください。",
  model: "gpt-4.1-nano",
  tools: [],
  inputGuardrails: [guardrail],
});

try {
  const result = await run(agent, "日本で一番高い山は？");
  console.log(result.finalOutput);
} catch (error) {
  if (error instanceof InputGuardrailTripwireTriggered) {
    console.error("旅行に関する質問をしてください。");
  } else {
    console.error("エージェントの実行中にエラーが発生しました:", error);
  }
}
```

`Agent` クラスの `outputGuardrails` プロパティを使用すると、エージェントの出力を検証するガードレールを定義することもできます。以下の例では、エージェントの出力が川柳の形式であることを検証するガードレールを定義しています。川柳であること検証するために、LLM モデルを使用しています。

```ts:src/index.ts
import {
  Agent,
  run,
  OutputGuardrailTripwireTriggered,
  OutputGuardrail,
} from "@openai/agents";
import { z } from "zod";

const senryuAgent = new Agent({
  name: "Senryu Agent",
  instructions:
    "ユーザーから受け取った入力が川柳の形式であることを検証するエージェントです。",
  model: "gpt-4.1-nano",
  outputType: z.object({
    isSenryu: z.boolean().describe("入力が川柳の形式であるかどうか"),
    message: z.string().describe("検証結果のメッセージ"),
  }),
});

const senryuGuardrail: OutputGuardrail = {
  name: "Senryu Guardrail",
  execute: async ({ agentOutput }) => {
    const result = await run(senryuAgent, agentOutput);
    return {
      tripwireTriggered: !result.finalOutput?.isSenryu,
      outputInfo:
        result.finalOutput?.message || "川柳の形式でない可能性があります。",
    };
  },
};

const chatAgent = new Agent({
  name: "Chat Agent",
  instructions: "ユーザーからの質問に回答します。",
  model: "gpt-4.1-nano",
  tools: [],
  outputGuardrails: [senryuGuardrail],
});
try {
  const result = await run(
    chatAgent,
    "日本で一番高い山は？川柳の形式で答えてください。"
  );
  console.log(result.finalOutput);
} catch (error) {
  if (error instanceof OutputGuardrailTripwireTriggered) {
    console.error("川柳の形式で回答してください。");
  } else {
    console.error("エージェントの実行中にエラーが発生しました:", error);
  }
}
```

## Human-in-the-Loop (HITL)

Human-in-the-Loop (HITL) は、人間の介入に基づいてエージェントの実行を一時停止・再開する機能です。例えばユーザーのクレジットカードに紐づいて自動で支払いを行うツールを使用するエージェントを作成した場合、実際に支払いが行われる前にユーザーの承認を求めることによってお金の払いすぎを防ぐことができるでしょう。

ツールの実行時に承認を求める際には `tool()` 関数の `needsApproval` に `true` を指定するか、`boolean` を返す関数を指定します。

エージェントがツールを実行しようとした場合、`result.interruptions` の配列に要素が追加されます。この状態では `result.finalOutput` は `undefined` になっています。ユーザーに `result.interruptions` の内容を表示して、承認を求める UI を実装する必要があります。

ツールの実行を承認するには `result.state.approve` を、拒否するには `result.state.reject` を呼び出します。その後更新した `state` を再び `run` 関数に渡すことで、エージェントの実行を再開できます。`state` はローカルファイルなどに保存しておくことも可能です。

```ts:src/index.ts
import { Agent, run, RunResult, RunState, tool } from "@openai/agents";
import { z } from "zod";
import readline from "readline/promises";
import fs from "fs/promises";

async function confirm(question: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(`${question} (y/n): `);
  const normalizedAnswer = answer.toLowerCase();
  rl.close();
  return normalizedAnswer === "y" || normalizedAnswer === "yes";
}

const paymentTool = tool({
  name: "payment",
  description: "指定した金額をクレジットカードで支払います。",
  parameters: z.object({
    amount: z.number().describe("支払う金額"),
  }),
  needsApproval: true, // ツールの実行前に承認を求める
  execute: ({ amount }) => {
    console.log(`支払いを実行します: ${amount} 円`);
    return { success: true };
  },
});

const travelAgent = new Agent({
  name: "Travel Agent",
  instructions:
    "ユーザーの旅行のプランを提案し、必要に応じて宿泊や交通の支払いを行います。",
  tools: [paymentTool],
  model: "gpt-4.1-nano",
});

let result: RunResult<unknown, Agent<unknown, any>> = await run(
  travelAgent,
  `以下のプランで旅行を行うので、必要な支払いを行ってください。
【1日目】
- 午前：出発（関東近郊を想定）→ 箱根湯本駅到着
- 午後：箱根湯本周辺散策（温泉街、土産物店など）
- 夜：宿泊（温泉付きの旅館やホテルでゆったり）

【2日目】
- 午前：箱根観光（箱根彫刻の森美術館や大涌谷、芦ノ湖遊覧船など）
- 午後：箱根湯本駅発 → 帰路

■予算内訳イメージ（1人分）
- 交通費（往復）：約8,000〜10,000円（新宿〜箱根湯本 小田急ロマンスカー利用の場合）
- 宿泊費（1泊）：約20,000〜25,000円（温泉旅館）
- 食事代：8,000円
- 観光入場料や遊覧船代：3,000円
  `
);

let hasInterruptions = result.interruptions.length > 0;
while (hasInterruptions) {
  // ローカルファイルに状態を保存
  await fs.writeFile(
    "result.json",
    JSON.stringify(result.state, null, 2),
    "utf-8"
  );

  // 保存された状態を読み込む
  const storedState = await fs.readFile("result.json", "utf-8");
  const state = await RunState.fromString(travelAgent, storedState);
  for (const interruption of result.interruptions) {
    // テーミナルでの承認を求める
    const userApproved = await confirm(
      `Agent ${interruption.agent.name} would like to use the tool ${interruption.rawItem.name} with "${interruption.rawItem.arguments}". Do you approve?`
    );

    if (userApproved) {
      // ツールの実行を承認
      state.approve(interruption);
    } else {
      // ツールの実行を拒否
      state.reject(interruption);
    }
  }

  // 承認後の状態で再実行
  result = await run(travelAgent, state);
  hasInterruptions = result.interruptions.length > 0;
}

console.log("最終的な出力:", result.finalOutput);
```

実行結果は以下のようになります。

```bash
Agent Travel Agent would like to use the tool payment with "{"amount":25000}". Do you approve? (y/n): y
Agent Travel Agent would like to use the tool payment with "{"amount":8000}". Do you approve? (y/n): y
支払いを実行します: 25000 円
支払いを実行します: 8000 円
最終的な出力: 交通費として8,000円と宿泊費として25,000円を支払いました。その他の費用（食事代8,000円や観光料3,000円）は既に予算に含まれているため、必要に応じて現地での支払いとなります。旅行の準備は整いました。良い旅をお楽しみください！
```

ダッシュボードのトレースを確認すると、ツールの実行が承認されたか拒否されたかが記録されていることがわかります。

![]()

## 複数のエージェントと協業する

ハンドオフ機能を使用すると、エージェントが特定のタスクを他のエージェントに委任できます。これはエージェントごとに特定の専門知識を持っている場合に有効です。例えばブログ記事を執筆する場合、プログラミングに関する情報であれば `Engineering Agent` に、旅行の情報であれば `Travel Agent` に委任できます。

エージェントが他のエージェントにタスクを委任するには、`Agent` クラスの `handoffs` プロパティの配列に委任先のエージェントを指定します。以下の例では、`Writer Agent` が `Engineering Agent` と `Travel Agent` にタスクを委任しています。`handoff()` 関数を使用することで、ハンドオフの機能を微調整することもできます。

また、`@openai/agents-core/extension` パッケージの `RECOMMENDED_PROMPT_PREFIX` 定数を `instructions` に追加することで、エージェントが他のエージェントにタスクを委任することを推奨するプロンプトを追加できます。

```ts:src/index.ts
import { Agent, run, webSearchTool, handoff } from "@openai/agents";
import { RECOMMENDED_PROMPT_PREFIX } from "@openai/agents-core/extensions";
import { z } from "zod";

const engineeringAgent = new Agent({
  name: "Engineering Agent",
  instructions:
    "あなたはプログラミングの専門家です。与えられたタスクに対して最適なコードを提供します。",
  model: "gpt-4.1-mini",
  tools: [webSearchTool()],
});

const travelAgent = new Agent({
  name: "Travel Agent",
  instructions:
    "あなたは旅行の専門家です。旅行に関する質問に答え、最適なプランを提案します。",
  model: "gpt-4.1-mini",
  tools: [webSearchTool()],
});

const writerAgent = new Agent({
  name: "Writer Agent",
  instructions: `${RECOMMENDED_PROMPT_PREFIX} あなたはブログ記事を書くエージェントです。指定されたトピックに関する情報を収集し、記事を執筆します。`,
  model: "gpt-4.1-mini",
  handoffs: [
    handoff(engineeringAgent, {
      // onHandoff は、タスクを委任する際に呼び出される関数
      onHandoff: async () =>
        console.log(`Engineering Agent にタスクを委任します`),
      // エージェントにタスクを委任する際の入力形式を定義する
      inputType: z.object({
        topic: z.string().describe("記事のトピック"),
      }),
    }),
    // agent クラスをそのまま渡すこともできる
    travelAgent,
  ],
});

const result = await run(
  writerAgent,
  "React の Suspense を使ったコード例をブログ記事にしてください。"
);
console.log("最終的な出力:", result.finalOutput);
```

OpenAI のダッシュボードでトレースを確認すると、どのエージェントにタスクが委任されたかがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7KoCKLE9uQ4I26RRZ4oRYl/3ba8c071bd29df241b7b25c1473635e8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-08_15.50.32.png)

## まとめ

- OpenAI Agents SDK は AI エージェントを構築するための軽量で使いやすいパッケージ
- TypeScript でエージェントを定義し、ツールを使用して外部データや機能にアクセスできる
  - ツールにはホスト型ツール、関数ツール、エージェントをツールとして使用する方法がある
- エージェントは他のエージェントにタスクを委任でき、協業して複雑なタスクを実行できる
- ガードレールを使用してエージェントの入力や出力を検証し、不適切な動作を防ぐことができる
- Human-in-the-Loop (HITL) 機能を使用して、エージェントの実行を人間が承認することができる
- できるエージェントの実行をトレースして、デバッグや監視を行うことができる

## 参考

- [openai/openai-agents-js: A lightweight, powerful framework for multi-agent workflows and voice agents](https://github.com/openai/openai-agents-js)
- [OpenAI Agents SDK for TypeScript | OpenAI Agents SDK](https://openai.github.io/openai-agents-js/)
