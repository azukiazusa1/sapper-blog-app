---
id: eKMboFmEYtwJkBs_X7_dU
title: "Vercel AI SDK を使って Next.js アプリに AI 機能を追加する"
slug: "vercel-ai-sdk-nextjs"
about: "Vercel AI SDK は TypeScript 向けの AI 機能を活用するプロダクトを構築するためのツールです。AI SDK は AI モデルのプロバイダー間における API の違いを抽象化することで、開発者はアプリケーションの開発に集中できるようになります。この記事では Vercel AI SDK の使い方を確認し、最終的に Next.js で構築した Web アプリケーションに AI 機能を追加する方法を紹介します。"
createdAt: "2025-03-16T20:29+09:00"
updatedAt: "2025-03-16T20:29+09:00"
tags: ["Next.js", "AI", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1b8vONvIjaZxs8R2oyGQSe/ece7af15f4324f145ab2ed8e977879aa/fruitsand_strawberry_13168-768x620.png"
  title: "いちごのフルーツサンドのイラスト"
selfAssessment:
  quizzes:
    - question: "Vercel AI SDK においてストリームでテキストを生成する関数は次のうちどれか？"
      answers:
        - text: "ai.create()"
          correct: false
          explanation: ""
        - text: "ai.stream()"
          correct: false
          explanation: ""
        - text: "ai.streamText()"
          correct: true
          explanation: ""
        - text: "ai.generateText({ stream: true })"
          correct: false
          explanation: ""

published: true
---

[Vercel SDK](https://sdk.vercel.ai/) は TypeScript 向けの AI 機能を活用するプロダクトを構築するためのツールです。AI SDK は AI モデルのプロバイダー間における API の違いを抽象化することで、開発者はアプリケーションの開発に集中できるようになります。AI モデルのプロバイダーを意識する必要がなくなるため、AI モデルを簡単に切り替えたり、ベンダーロックインを避けることができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/TzqieB0qL0DCOGHXBM18K/5d81915ab058b5ab2ce282fc74854cdc/ai-sdk-diagram-dark.png)

出典: https://sdk.vercel.ai/docs/foundations/providers-and-models 。

この記事では Vercel AI SDK の使い方を確認し、最終的に Next.js で構築した Web アプリケーションに AI 機能を追加する方法を紹介します。

## Vercel AI SDK でテキストを生成する

はじめに Node.js で実行する簡単なテキスト生成を行うアプリケーションを作成してみましょう。

AI SDK を使い始めるために、事前準備として使用した AI モデルのプロバイダーの API キーを取得する必要があります。サポートされているプロバイダーの一例として、以下の選択肢があります。

- [OpenAI](https://sdk.vercel.ai/providers/ai-sdk-providers/openai)
- [Anthropic](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic)
- [Google Generative AI](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai)
- [Ollama](https://sdk.vercel.ai/providers/community-providers/ollama)（セルフホスト）

その他のプロバイダーについては [Vercel AI SDK のドキュメント](https://sdk.vercel.ai/docs/foundations/providers-and-models#ai-sdk-providers) を参照してください。この記事では [Anthropic](https://www.anthropic.com/) が提供する Claude を使用します。まずは [Anthropic のコンソール](https://console.anthropic.com/settings/keys) から API キーを作成しておきましょう。

### Node.js アプリケーションの作成

Node.js アプリケーションを作成するために、まずはプロジェクトのディレクトリを作成します。

```bash
mkdir vercel-ai-sdk-example
cd vercel-ai-sdk-example
```

次に、Node.js のプロジェクトを初期化します。

```bash
npm init -y
```

トップレベル `await` を使用できるようにするために `package.json` に `type: "module"` を追加しておきましょう。ついでにアプリケーションを実行するスクリプトも追加しておきます。

```json:package.json
{
  "type": "module",
  "scripts": {
    "start": "tsx src/index.js"
  }
}
```

必要なパッケージをインストールします。Vercel AI SDK のコアパッケージと、プロバイダーが必要です。ここでは Anthropic を使用するため、`@ai-sdk/anthropic` を使用します。

```bash
npm install ai @ai-sdk/anthropic dotenv zod
npm install -D @types/node tsx typescript
```

その他に必要なパッケージとして、`dotenv` と `zod` をインストールします。`dotenv` は環境変数を `.env` ファイルから読み込むためのパッケージです。`zod` は型安全なスキーマを LLM に渡すために使用します。

`.env` ファイルを作成し、Anthropic の API キーを設定します。環境変数のデフォルトの名前はプロバイダーによって異なります。Anthropic の場合は `ANTHROPIC_API_KEY` です。

```text:.env
ANTHROPIC_API_KEY=<YOUR_API_KEY>
```

### テキストを生成する

実際に AI にテキストを生成してもらう簡単なアプリケーションを作成してみましょう。`src/index.ts` ファイルを作成し、以下のコードを追加します。

```ts:src/index.ts
import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import dotenv from "dotenv";

// .env file を読み込む
dotenv.config();

const { text } = await generateText({
  model: anthropic("claude-3-7-sonnet-20250219"),
  system:
    "あなたは旅行プランナーです。旅行者の要望に応じて、最適な旅行プランを提案してください。",
  prompt:
    "日帰り旅行の計画を立ててください。出発地は東京で、目的地は箱根です。観光スポットや食事のおすすめも含めてください。",
});

console.log(text);
```

このコードでは claude-3-7-sonnet-20250219 モデルを使用して、旅行プランナーとしての AI に日帰り旅行の計画を立ててもらっています。

テキストを生成するために、`generateText` 関数を使用します。この関数は Web ページを要約させたり、メールの下書きを作成するといった非対話型のタスクを実行する目的に適しています。

以下のコマンドでアプリケーションを実行します。

```bash
npx tsx src/index.ts
```

実行すると、以下のような出力が得られました。

<details>
  <summary>実行結果</summary>

```text
# 東京発・箱根日帰り旅行プラン

## 基本情報
- **出発地**: 東京
- **目的地**: 箱根
- **所要時間**: 日帰り
- **移動手段**: 小田急ロマンスカー（新宿駅から箱根湯本駅まで約85分）

## タイムスケジュール

### 朝
**7:30** 新宿駅集合  
**8:00** 小田急ロマンスカー出発  
**9:30頃** 箱根湯本駅到着  
**9:40** 箱根登山バスで強羅方面へ移動

### 午前
**10:30** 箱根彫刻の森美術館  
- 自然と芸術が融合した野外美術館
- ピカソやヘンリー・ムーアなど世界的芸術家の作品を鑑賞
- 広大な庭園内を散策しながら約1時間半楽しめます

### お昼
**12:30** 昼食：強羅エリアでの食事  
**おすすめ店舗**:
- 「箱根 強羅 白檀」：地元食材を使った和食会席
- 「強羅 天翠」：箱根の景色を眺めながら楽しめる日本料理

### 午後
**14:00** 箱根ロープウェイで大涌谷へ  
**14:30** 大涌谷観光
- 名物の黒たまご（食べると寿命が7年延びるという言い伝え）
- 迫力ある噴煙地帯の散策

**16:00** 箱根海賊船で芦ノ湖クルーズ  
**16:45** 箱根神社参拝
- 芦ノ湖のほとりにある由緒ある神社
- 平和の鳥居が有名

### 夕方〜夜
**18:00** 箱根湯本駅周辺で夕食  
**おすすめ店舗**:
- 「天山」：創業100年以上の老舗そば店
- 「箱根湯本 ホテルおかだ」の日帰り温泉と食事プラン

**19:30** 箱根湯本駅発のロマンスカーで東京へ  
**21:00頃** 新宿駅到着

## 旅のポイント

1. **移動について**
   - 箱根フリーパスの購入がおすすめ（小田急線往復+箱根エリア内の交通機関乗り放題）
   - 休日は混雑するため、早朝出発がベスト

2. **持ち物**
   - 歩きやすい靴（坂道や階段が多い）
   - 季節に応じた服装（山間部は東京より気温が低い）
   - タオル（手軽に温泉を楽しむ場合）

3. **季節のおすすめ**
   - 春：箱根彫刻の森美術館の桜
   - 夏：涼しい高原の気候を楽しむ
   - 秋：紅葉（特に11月中旬〜下旬）
   - 冬：晴れた日の富士山の眺め

ご質問や調整したい点がございましたら、お気軽にお申し付けください！
```
</details>

### ストリームでテキストを生成する

モデルやプロンプトによって異なりますが、LLM が回答を生成するために最大 1 分程度の時間がかかる場合があります。ユーザーにとっては回答が生成されるまでの遅延が許容できない場合があります。テキストをストリーミングして生成することによって、生成が完了した部分から順次表示することができるため、ユーザーはリアルタイムで回答を受け取ることができます。

ストリーミングを使用する場合は、`generateText` の代わりに `streamText` を使用します。以下のようにコードを変更してみましょう。

```ts:src/index.ts
import { streamText } from "ai";

const result = streamText({
  model: anthropic("claude-3-7-sonnet-20250219"),
  system:
    "あなたは旅行プランナーです。旅行者の要望に応じて、最適な旅行プランを提案してください。",
  prompt:
    "日帰り旅行の計画を立ててください。出発地は東京で、目的地は箱根です。観光スポットや食事のおすすめも含めてください。",
});

// ストリーミングされたテキストを受け取る
for await (const chunk of result.textStream) {
  console.log(chunk);
}
```

### ツールを使用して回答を生成する

LLM は多くの情報をあらかじめ学習しているものの、AI が苦手とするタスク（数学など）や外部の情報を必要とするタスク（最新の天気予報など）を正しく回答することができません。ツールは LLM が呼び出すことができるアクションです。LLM は回答を生成するために外部の情報が必要だと判断した場合、ツールを呼び出しその結果ををコンテキストとして使用できます。

例えば旅行の計画を立てる場合には天気の情報が欠かせません。せっかくならばよく晴れた日に旅行をして景色を楽しみたいものです。LLM に「快晴の日に箱根を観光したい」と尋ねたとき、天気情報を取得するツールが使用可能である場合 LLM は「箱根」を引数に天気情報を取得するツールを呼び出します。天気情報を取得する API が 4/4 が快晴であることを返した場合、LLM は「4/4 に箱根を観光するのが良いでしょう」といった回答を生成することでしょう。

ツールを使用する場合には `tools` オプションを指定します。以下のようにコードを変更してみましょう。

```ts:src/index.ts {10-31}
import { anthropic } from "@ai-sdk/anthropic";
import { generateText, tool } from "ai";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const result = await generateText({
  model: anthropic("claude-3-7-sonnet-20250219"),
  tools: {
    // ツールの名前をキーに指定する
    weather: tool({
      // ツールの説明
      description: "指定した都市の天気を取得します。",
      // ツールの実行に必要な引数のスキーマを指定する
      parameters: z.object({
        location: z.string().describe("天気を取得したい都市名"),
        date: z.string().describe("天気を取得したい日付"),
      }),
      // ツールを呼び出したときに実行される非同期関数
      execute: async ({ location, date }) => {
        // ここではダミーの結果を返す
        return {
          location,
          date,
          temperature: Math.floor(Math.random() * 30) + 1,
          condition: Math.random() > 0.7 ? "晴れ" : "曇り",
        };
      },
    }),
  },
  system:
    "あなたは旅行プランナーです。旅行者の要望に応じて、最適な旅行プランを提案してください。",
  prompt:
    "日帰り旅行の計画を立ててください。出発地は東京で、目的地は箱根です。\n" +
    "観光の予定は必ず晴れた日にしてください。\n" +
    "希望の日付は 2025 年 4 月 1 日から 2025 年 4 月 3 日の間です。\n" +
    "天気予報を確認して、旅行プランを提案してください。\n",
});

console.log(result.text);
console.log(result.toolCalls);
```

このコードでは `weather` という名前のツールを定義しています。ツールは以下の 3 つの要素から構成されます。

- `description`: ツールの説明。LLM がツールを呼び出すかどうかを判断するために使用されるため、回答の品質を向上させるために重要
- `parameters`: ツールを呼び出すために必要な引数のスキーマ。JSON Schema あるいは Zod を使用して型安全に定義できる。`.describe` メソッドを使用して、引数の説明を追加すると、LLM がツールを呼び出す場合のヒントを与えることができる
- `execute`: ツールを呼び出したときに実行される非同期関数。引数の型は `parameters` で定義したスキーマに従う。戻り値の型は `any` であるため、必要に応じて型を定義することができる

コードを実行すると、以下のような出力が得られました。

```sh
箱根への日帰り旅行プランをご希望ですね。2025年4月1日から20日の間で晴れの日を選んで計画を立てたいとのことです。まずは、その期間の箱根の天気予報を確認してみましょう。
[
  {
    type: 'tool-call',
    toolCallId: 'toolu_01XN9qgUkcFJcpAfaLB3EcFk',
    toolName: 'weather',
    args: { location: '箱根', date: '2025-04-01' }
  }
]
```

AI SDK は箱根の天気予報を確認するためにツールの呼び出しを要求し生成を一時停止しました。ツールの呼び出しに使用する引数は `result.toolCalls` に格納されています。この後の回答を生成するためには、プログラムでツールの呼び出しを実行し、結果を AI SDK に渡す必要があります。

マルチステップ呼び出しを有効にすると AI SDK はそれ以上のツールの呼び出しがなくなるか、ツールステップの最大数に達するまでの間自動でツールの結果を渡して続きの回答を生成します。マルチステップ呼び出しを有効にするには、`generateText` 関数に `maxSteps` オプションを指定します。

```ts:src/index.ts {3}
const result = await generateText({
  model: anthropic("claude-3-7-sonnet-20250219"),
  maxSteps: 5,
  tools: {
    weather: tool({
      description: "指定した都市の天気を取得します。",
      parameters: z.object({
        location: z.string().describe("天気を取得したい都市名"),
        date: z.string().describe("天気を取得したい日付"),
      }),
      execute: async ({ location, date }) => {
        // ここではダミーの結果を返す

        return {
          location,
          date,
          temperature: Math.floor(Math.random() * 30) + 1,
          condition: Math.random() > 0.7 ? "晴れ" : "曇り",
        };
      },
    }),
  },
  system:
    "あなたは旅行プランナーです。旅行者の要望に応じて、最適な旅行プランを提案してください。",
  prompt:
    "日帰り旅行の計画を立ててください。出発地は東京で、目的地は箱根です。\n" +
    "観光の予定は必ず晴れた日にしてください。\n" +
    "希望の日付は 2025 年 4 月 1 日から 2025 年 4 月 3 日の間です。\n" +
    "天気予報を確認して、旅行プランを提案してください。\n",
});
```

結果の `steps` プロパティには各ステップのテキスト、ツールの呼び出し、およびツールの結果が格納されています。

```ts:src/index.ts
result.steps.forEach((step, i) => {
  console.log("Step:", i + 1);

  console.log("Text:", step.text);
  console.log("ToolResults:", step.toolResults);
});

console.log(result.text);
```

`onStepFinish` オプションを使用すると、各ステップの結果をコールバック関数として受け取ることができます。

```ts:src/index.ts
const result = await generateText({
  model: anthropic("claude-3-7-sonnet-20250219"),
  maxSteps: 5,
  onStepFinish: ({ text, toolResults }) => {
    console.log("Step finished:");
    console.log("Text:", text);
    console.log("ToolResults:", toolResults);
  },
  // ...
});
```

実際に試してみると `2025-04-01`, `2025-04-02`, `2025-04-03` の 3 回のツールの呼び出しが行われました。その中でも `2025-04-01` の結果が「晴れ」で気温も最適だったため、AI は 2025 年 4 月 1 日の観光プランを提案してくれました。

<details>
  <summary>実行結果</summary>

```text
Step finished:
Text: 箱根への日帰り旅行プランを作成するために、まず2025年4月1日から3日までの天気予報を確認してみましょう。最適な晴れの日を選んで旅行プランを立てます。
ToolResults: [
  {
    type: 'tool-result',
    toolCallId: 'toolu_01VA92xZuxWm6zE9R3VFrjMt',
    toolName: 'weather',
    args: { location: '箱根', date: '2025-04-01' },
    result: {
      location: '箱根',
      date: '2025-04-01',
      temperature: 11,
      condition: '晴れ'
    }
  }
]
Step finished:
Text: 
ToolResults: [
  {
    type: 'tool-result',
    toolCallId: 'toolu_01QQCbjDJ9F3J4vWmUBc1nxa',
    toolName: 'weather',
    args: { location: '箱根', date: '2025-04-02' },
    result: {
      location: '箱根',
      date: '2025-04-02',
      temperature: 17,
      condition: '曇り'
    }
  }
]
Step finished:
Text: 
ToolResults: [
  {
    type: 'tool-result',
    toolCallId: 'toolu_012ZCjVpCuVGwRDLusiuuQCZ',
    toolName: 'weather',
    args: { location: '箱根', date: '2025-04-03' },
    result: {
      location: '箱根',
      date: '2025-04-03',
      temperature: 6,
      condition: '晴れ'
    }
  }
]
Step finished:
Text: 天気予報を確認したところ、2025年4月1日と4月3日が晴れの予報となっています。4月1日は気温11℃、4月3日は気温6℃です。ご希望通り晴れの日に旅行できるよう、4月1日のプランをご提案します（4月3日は少し肌寒いため）。

# 東京から箱根への日帰り旅行プラン（2025年4月1日）

## 基本情報
- **日付**: 2025年4月1日（火）
- **天気**: 晴れ（気温11℃）
- **服装**: 春の箱根は朝晩冷え込むことがあるため、軽いジャケットやカーディガンなど羽織れるものをご用意ください。

## 旅程

### 朝（出発）
- **7:00** 東京駅集合
- **7:20** 東京駅発 小田急ロマンスカー「はこね」号に乗車
- **9:00** 箱根湯本駅到着

### 午前
- **9:15-10:30** 箱根湯本から箱根登山バスで大涌谷へ移動、大涌谷観光
  - 黒たまご（食べると寿命が7年延びるといわれています）を試食
  - 火山活動による噴煙と美しい景色を楽しむ
- **10:45-12:00** 箱根ロープウェイで芦ノ湖方面へ移動
  - 空中からの富士山と箱根の絶景を楽しめます

### 昼食
- **12:00-13:30** 芦ノ湖畔のレストランで昼食
  - 箱根名物の「湖畔の見える和食レストラン」などがおすすめ
  - 晴れた日は湖と富士山を眺めながらのランチが最高です

### 午後
- **13:45-15:00** 箱根神社参拝
  - 芦ノ湖に面した由緒ある神社
  - 平和の鳥居は写真スポットとして人気
- **15:15-16:30** 箱根関所跡・箱根関所資料館見学
  - 江戸時代の関所を再現した史跡
  - 晴れた日は屋外展示も楽しめます

### 夕方（帰路）
- **17:00** 箱根湯本駅発 小田急ロマンスカーで東京へ
- **18:40** 東京駅到着

## 移動手段
- **往路**: 東京駅→小田急ロマンスカー→箱根湯本駅
- **箱根エリア内**: 箱根フリーパスを購入すると便利（箱根登山バス、ロープウェイ、海賊船などが乗り放題）
- **復路**: 箱根湯本駅→小田急ロマンスカー→東京駅

## おすすめポイント
- 晴れた日は富士山の眺めが素晴らしく、写真撮影に最適です
- 4月初旬は桜の時期と重なることもあり、箱根の自然と桜を同時に楽しめる可能性があります
- 大涌谷から芦ノ湖へのロープウェイは、晴れた日の景色が特に美しいです

ご希望に沿った晴れの日の箱根日帰り旅行プランをご提案しました。何か調整が必要でしたら、お知らせください。
```
</details>

## Next.js アプリケーションに AI 機能を追加する

ここまでは Vercel AI SDK の簡単なツールの簡単な使い方を紹介しました。次は アプリケーション上に AI 機能を組み込んで使えるようにしてみましょう。ここでは Next.js を使用してシンプルなチャットボットを作成します。

### Next.js アプリケーションの作成

まずは `create-next-app` を使用して Next.js アプリケーションを作成します。App Router の使用を求められたら「Yes」を選択してください。

```bash
npx create-next-app@latest
```

続いて必要なパッケージをインストールします。Node.js アプリケーションと同様に Vercel AI SDK のコアパッケージとプロバイダーをインストールします。さらに追加で `@ai-sdk/react` をインストールします。これはチャット UI を簡単に構築する `uesChat` フックを提供します。

```bash
npm install ai @ai-sdk/anthropic @ai-sdk/react zod
```

`.env.local` ファイルを作成し、Anthropic の API キーを設定します。API キーの名前はプロバイダーによって異なります。Anthropic の場合は `ANTHROPIC_API_KEY` です。

```text:.env.local
ANTHROPIC_API_KEY=<YOUR_API_KEY>
```

### ルートハンドラーを作成する

Next.js の [ルートハンドラー](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) を使用してチャットの回答を生成する API エンドポイントを作成します。`app/api/chat/route.ts` ファイルを作成し、以下のコードを追加します。

```ts:app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

// 30 秒間のストリーミングを許可する
export const maxDuration = 30;

// POST メソッドを使用してリクエストを処理する
export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-3'),
    messages,
  });

  // HTTP ストリームレスポンスを作成する
  return result.toDataStreamResponse();
}
```

`POST` リクエストハンドラーを作成し、POST メソッドを受け付けてリクエストを処理します。`messages` はチャットの履歴を表す配列です。会話の履歴をコンテキストとして回答を生成します。`streamText` を使用してストリーミングされたテキストを生成します。`toDataStreamResponse()` メソッドは結果を `Response` オブジェクトに変換します。これにより、ストリーミングされたテキストをクライアントに送信することができます。

このルートハンドラーは `/api/chat` にアクセスすることで利用できます。

### チャット UI を作成する

続いてフロントエンド部分を実装していきましょう。`@ai-sdk/react` パッケージの `useChat` フックを使用すると複雑なチャット UI を簡単に構築することができます。`app/page.tsx` ファイルを作成し、以下のコードを追加します。

```tsx:app/page.tsx
"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, reload } =
    useChat();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="space-y-4 mb-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 rounded-lg ${
              message.role === "user"
                ? "bg-blue-100 ml-8 border-blue-200 border"
                : "bg-gray-100 mr-8 border-gray-200 border"
            }`}
          >
            <div className="font-semibold mb-1 text-sm text-gray-600">
              {message.role === "user" ? "You" : "Claude"}
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">{message.content}</div>
            {message.role === "assistant" && (
              <button
                className="mt-2 text-sm text-blue-600 hover:underline"
                onClick={() => reload()}
              >
                Regenerate response
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

`useChat` フックはメッセージの履歴を表す `messages` プロパティを提供します。`UIMessage` オブジェクトには `role` と `content` プロパティが含まれています。`role` はメッセージの発信者がユーザーか AI かを示します。`content` はメッセージの内容です。`role` によってメッセージのスタイルを変更することで、ユーザーと AI からの返答を区別しています。

`input` と `handleInputChange` はユーザーが現在フォームに入力している値を管理します。フォームがサブミットされた場合には自動で値がクリアされます。

`handleSubmit` はフォームが送信されたときに呼び出される関数です。デフォルトでは `/api/chat` に POST リクエストを送信します。`reload()` 関数を呼び出すと現在の回答を再生成します。

ここまでの実装が完了したら、アプリケーションを起動します。

```bash
npm run dev
```

http://localhost:3000 にアクセスして、チャットを試してみましょう。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2xiCXbq10OkZVErz6fSwQf/06dbe5656b8b96c9961a8bb0a5e26e30/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-16_13.40.27.mov" controls></video>

### ツールを使用する

Node.js アプリケーションでやったときと同じように、AI SDK にツールを追加してみましょう。`app/api/chat/route.ts` ファイルを以下のように変更します。今回はサイコロを振ってランダムな数を返すツールを追加します。

```ts:app/api/chat/route.ts {3, 12-28}
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic("claude-3-7-sonnet-20250219"),
    messages,
    tools: {
      dice: tool({
        description: "サイコロを振ってランダムな数を生成します",
        parameters: z.object({
          sides: z.number().optional().default(6).describe("サイコロの面の数"),
          rolls: z.number().optional().default(1).describe("振る回数"),
        }),
        execute: async ({ sides, rolls }) => {
          const results = Array.from(
            { length: rolls },
            () => Math.floor(Math.random() * sides) + 1
          );
          return results;
        },
      }),
    },
    maxSteps: 5,
  });

  return result.toDataStreamResponse();
}
```

完全な回答を生成するために `maxSteps: 5` を指定していることに注意してください。これにより、AI SDK は自動でツールの結果を渡して続きの回答を生成します。`maxSteps` のデフォルトは 0 となっており、その場合にはツールの呼び出しを要求したところで生成が停止してしまいます。

フロントエンド側の実装は特に変更する必要がありません。チャット UI でサイコロを振らせてみましょう。完全なランダムで値が生成されるため、「Regenerate response」ボタンを押すたびに異なる結果が得られます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6zHdYOF3kw6CEoJs8JAIEt/0a21db9b9f682ee221efc4f6f8690041/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-03-16_13.56.27.mov" controls></video>

## まとめ

- Vercel AI SDK は AI モデルのプロバイダー間における API の違いを抽象化した TypeScript ライブラリ
- コア SDK とプロバイダー SDK を組み合わせることで、さまざまな AI モデルを簡単に使用できる
- `generateText` を使用してプロンプトに基づいたテキストを生成する
- `streamText` を使用してストリーミングされたテキストを生成する
- `tool` を使用して LLM が外部の情報を取得するためのツールを定義する
- `useChat` フックを使用すると React アプリケーションに簡単にチャット UI を組み込むことができる

## 参考

- [AI SDK](https://sdk.vercel.ai/)