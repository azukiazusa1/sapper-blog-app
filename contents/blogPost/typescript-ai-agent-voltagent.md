---
id: l62zRIjQ0e5pAiSTkDh9g
title: "TypeScript で AI エージェントを構築する VoltAgent"
slug: "typescript-ai-agent-voltagent"
about: "VoltAgent は TypeScript で AI を活用したアプリケーションを構築するためのツールキットです。VoltAgent Console を使用すると、エージェントの状態をリアルタイムで確認したり、エージェントのワークフローを可視化できる点が特徴です。"
createdAt: "2025-05-18T18:18+09:00"
updatedAt: "2025-05-18T18:18+09:00"
tags: ["VoltAgent", "AI", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5ZmRG2M1gFydxRXn6EonE/9dd992c3429f9e2f7599e6c11a42ab2e/bird_cute_raichou_10916.png"
  title: "ライチョウのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/15XovXOH30V3s08HMbBhr5/8b03dd89d47040a84504ffb08f67ef83/VoltAgent%C3%A5__%C3%A9__%C3%A3__%C3%A5__%C3%A7__.wav"
selfAssessment:
  quizzes:
    - question: "VoltAgentでツールを定義するために使用する関数は何ですか？"
      answers:
        - text: "createTool"
          correct: true
          explanation: null
        - text: "makeTool"
          correct: false
          explanation: null
        - text: "defineTool"
          correct: false
          explanation: null
        - text: "newTool"
          correct: false
          explanation: null
    - question: "VoltAgentがデフォルトで使用するメモリ管理ストレージは何ですか？"
      answers:
        - text: "InMemoryStorage"
          correct: false
          explanation: null
        - text: "PostgresStorage"
          correct: false
          explanation: null
        - text: "LibSQLStorage"
          correct: true
          explanation: null
        - text: "SupabaseStorage"
          correct: false
          explanation: null
    - question: "VoltAgentで複数のツールをグループ化するために使用する関数は何ですか？"
      answers:
        - text: "groupTools"
          correct: false
          explanation: null
        - text: "createToolkit"
          correct: true
          explanation: null
        - text: "bundleTools"
          correct: false
          explanation: null
        - text: "combineTools"
          correct: false
          explanation: null
published: true
---
VoltAgent は TypeScript で AI を活用したアプリケーションを構築するためのツールキットです。構築した AI エージェントの監視やデバッグを行うためのツールとして [VoltAgent Console](https://console.voltagent.dev/) が提供されている点も特徴です。このツールを使用すると、エージェントの状態をリアルタイムで確認したり、エージェントのワークフローを可視化したりできます。

この記事では、VoltAgent の基本的な使い方を紹介します。

## プロジェクトのセットアップ

まずはプロジェクトをセットアップします。以下のコマンドを実行して VoltAgent をインストールします。

```bash
npm create voltagent-app@latest my-agent-app
```

AI エージェントを構築するためには各 LLM バックエンドが提供する API キーが必要です。VoltAgent は LLM の呼び出しのためにプロバイダーという仕組みを導入しています。プロバイダーを使用することで、LLM バックエンドごとの API 呼び出しの実装を隠蔽し、統一的なインターフェースで LLM を利用できます。デフォルトで `@voltagent/vercel-ai` パッケージをプロバイダーとして使用しています。これは Vercel が提供する [AI SDK](https://vercel.com/docs/ai-sdk) を通じて LLM バックエンドに接続します。

Vercel AI SDK は OpenAI や Anthropic、Google Generative AI などの多くの LLM をサポートしています。使用可能な LLM の一覧は [Providers and Models](https://ai-sdk.dev/docs/foundations/providers-and-models) で確認できます。

今回は Google Gemini を使用するため、[Google AI Studio](https://aistudio.google.com/app/apikey?hl=ja) で API キーを取得します。選択するモデルによっては料金が発生する場合があるため、ご注意ください。

取得した API キーは、プロジェクトルートに `.env` ファイルを作成し、以下のように環境変数として設定します。

```txt:.env
GOOGLE_GENERATIVE_AI_API_KEY=your_api_key
```

`src/index.ts` を開き、`Agent` クラスに渡している `model` を `google` に変更します。

```ts:src/index.ts {4, 10}
import { VoltAgent, Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";

import { google } from "@ai-sdk/google";

const agent = new Agent({
  name: "my-agent-app",
  instructions: "A helpful assistant that answers questions without using tools",
  llm: new VercelAIProvider(),
  model: google("gemini-2.5-pro-exp-03-25"),
  tools: [],
});

new VoltAgent({
  agents: {
    agent,
  },
}); 
```

パッケージをインストールして、アプリケーションを起動します。

```bash
npm install
npm run dev
```

http://localhost:3141 にアクセスするとアプリケーションが正常に起動していることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6mWYrYQyYGtlDzbWTNQSuS/9069604bfebdbb3943c3021aa28db095/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-18_18.43.30.png)

[VoltAgent Console](https://console.voltagent.dev/agent/my-agent-app) へのリンクが表示されているのでアクセスしてみましょう。VoltAgent は http://localhost:3141 に接続して AI エージェントの情報を取得しています。これにより、ローカルで開発中のエージェントの状態をリアルタイムでデバッグ、監視できます。

エージェントのワークフローがノードとエッジで表現されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/5IufrO2vn14MkyDtkaOb45/c639383f1e201cf209b09eb919b977cd/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-18_18.50.11.png)

各ノードをクリックすると詳細情報を確認できます。`my-agent-app` というノードの目のアイコンをクリックすると、使用されている LLM モデルの情報などが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3dX8AJdgIb9w5lE7giGdX9/daae8f2db24a4d062dd8a3fd596b851d/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-18_20.07.23.png)

「Test workflow」もしくは「my-agent-app」のノードの再生ボタンをクリックすると、エージェントのワークフローを実行できます。これにより、エージェントがどのように動作するかを確認できます。このワークフローではチャットボットとしての機能を持つエージェントが実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6MXrzOEFVChuFSnWq6oar/12cf4d0a28c9cf967874f766892e7feb/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-18_20.27.12.png)

## `Agent` クラスの概要

`Agent` クラスは VoltAgent の基本的な構成要素です。このクラスは中心的なオーケストレーターとして機能し、エージェントの動作を制御します。`Agent` クラスは以下のプロパティを持っています。

必須のプロパティとしてエージェントの名前・説明・プロパイダー・モデルを指定して `Agent` を作成します。

```ts
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { google } from "@ai-sdk/google";

const agent = new Agent({
  name: "my-agent-app",
  instructions: "A helpful assistant that answers questions without using tools",
  // プロパイダーは AI モデルの実装の差異を隠蔽するためのもの
  // VercelAIProvider は Vercel が提供する AI SDK を使用するためのプロパイダー
  llm: new VercelAIProvider(),
  // 使用する具体的な AI モデルを指定する
  model: google("gemini-2.5-pro-exp-03-25"),
});
```

先程までの例では `VoltAgent` クラスを使用してサーバーと AI エージェントの機能をマッピングしていました。これだけで簡単なチャットボットを作成できます。

```ts
import { VoltAgent } from "@voltagent/core";

const agent = new Agent({... });

new VoltAgent({
  agents: {
    agent,
  },
});
```

`Agent` クラスがどのような機能を持っているか確認するために、`VoltAgent` クラスを使用せずに `Agent` クラスを直接使用してチャット機能を実装してみましょう。テキスト生成を行うためには `generateText` もしくは `streamText` メソッドを使用します。これらのメソッドはレスポンスをストリーミングで返すかどうかの違いがあります。`generateText` はすべてのテキストの生成が完了するまで Promise を待機する必要がありますが、`streamText` は生成されたテキストをチャンクごとに受け取ることができます。

```ts:src/index.ts
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";

import { google } from "@ai-sdk/google";

const agent = new Agent({
  name: "my-agent-app",
  instructions:
    "A helpful assistant that answers questions without using tools",
  llm: new VercelAIProvider(),
  model: google("gemini-2.0-flash-exp"),
});
const response = await agent.generateText(
  "こんにちは、あなたの名前は何ですか？"
);
console.log(response.text);

// ストリーミングでテキストを生成する
const stream = await agent.streamText("ストリーミングとは何ですか？");
for await (const chunk of stream.textStream) {
  console.log(chunk);
}
```

`VoltAgent` クラスは使用していないので、サーバーを起動することはなく、コンソールに出力されるテキストを確認できます。以下のような出力が得られました。

```sh
ストリーミングとは、インターネットなどのネットワークを通じて、動画や音楽などのデータをダウンロードしながら同時に再生する方式
のことです。

従来のダウンロード方式では、データをすべてダウンロードしてから再生を開始する必要がありましたが、
ストリーミングでは、データを受信するのと並行して再生を開始できるため、待機時間を大幅に短縮できます。

ストリーミングは、動画配信サービス
（YouTube、Netflixなど）や音楽配信サービス（Spotify、Apple Musicなど）で広く利用されています。
```

`markdown` オプションを `true` に設定すると、Markdown 構文でテキストを生成するようにシステムプロンプトが変更されます。

```ts:src/index.ts {7}
const agent = new Agent({
  name: "my-agent-app",
  instructions:
    "A helpful assistant that answers questions without using tools",
  llm: new VercelAIProvider(),
  model: google("gemini-2.0-flash-exp"),
  markdown: true,
});
```

## ツールの呼び出し

ツールは AI エージェントの機能を拡張するために使用される外部の操作機能です。LLM が苦手とする領域を補完するために、ツールを使用して特定のタスクを実行させることができます。

例えば LLM の持つ知識はある時点でトレーニングされたものに制限されます。このことは知識カットオフと呼ばれ、LLM が最新の情報を持っていないことを意味します。そのため明日の天気を LLM に尋ねたとき、正確な情報を得ることはできません。そこで、天気予報の API を使用して最新の天気方法を取得した結果を返すようなツールを作成できます。

LLM は回答を生成する際にツールの使用が必要だと判断した場合、ツールの呼び出しを要求します。ツールの呼び出しを要求された場合、プログラムから API を呼び出し結果を取得し、その結果を LLM に渡して再度呼び出します。LLM はツールの結果を参照して回答を生成します。

VoltAgent でツールを定義するためには `createTool` 関数を使用できます。ツールには以下のプロパティを指定します。

- `name`: ツールの名前。LLM がツールを呼び出すかどうかを判断するために使用される
- `description`: ツールの説明。LLM がツールをいつ使用するかを判断するために使用される
- `parameters`: ツールを呼び出す際に必要なパラメータを定義するためのスキーマ。[Zod](https://zod.dev/) を使用してスキーマを定義する
- `execute`: ツールが呼び出されたときに実行される関数

```ts:src/index.ts {14}
import { createTool } from "@voltagent/core";
import { z } from "zod";

const weatherTool = createTool({
  name: "get_weather",
  description: "Get the current weather",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async (params) => {
    const { location } = params;
    // ダミーの天気情報を返す
    return {
      location,
      temperature: 25,
      condition: "Sunny",
    };
  },
});
```

ツールを作成したら、`Agent` クラスの `tools` プロパティに追加します。

```ts:src/index.ts
import { Agent, createTool } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const weatherTool = createTool({...});

const agent = new Agent({
  name: "my-agent-app",
  instructions:
    "天気の予報ができるエージェント",
  llm: new VercelAIProvider(),
  model: google("gemini-2.0-flash-exp"),
  tools: [weatherTool],
});
const response = await agent.generateText("今日の東京の天気は？");
console.log(response.text);
```

コードを実行すると、以下のような出力が得られます。

```sh
今日の東京の天気は晴れで、気温は25度です。
```

VoltAgent を確認すると、接続されているツールの情報が表示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/4ennoCPHLcTnn8caEvxIVs/a7b7a9e57486a40191057aa35207fdc4/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-20_6.40.30.png)

### ToolKit によるツールのグループ化

多くの AI エージェントでは複数のツールが連携して動作します。例えば現在の地点の天気予報を取得するシナリオを考えてみましょう。この場合、ユーザーの現在地を取得するためのツールと、天気予報を取得するためのツールが必要です。これらのツールは常に連携して動作する必要があるでしょう。

VoltAgent では `createToolkit` を使用してグループ化されたツールである `ToolKit` を作成できます。`ToolKit` は複数のツールをまとめて管理するためのクラスです。`ToolKit` を使用することでグループ化された単位で `instructions`（指示）を設定できます。

```ts:src/index.ts
const weatherTool = createTool({
  name: "get_weather",
  description: "Get the current weather",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async (params) => {
    const { location } = params;
    // ダミーの天気情報を返す
    return {
      location,
      temperature: 25,
      condition: "Sunny",
    };
  },
});
const getLatLang = createTool({
  name: "get_lat_lang",
  description: "Get the current location（latitude and longitude）",
  parameters: z.object({}),
  execute: async (params) => {
    // ダミーの位置情報を返す
    return {
      latitude: 35.6895,
      longitude: 139.6917,
    };
  },
});
const getLocation = createTool({
  name: "get_location",
  description: "Get the current location by latitude and longitude",
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute: async (params) => {
    const { latitude, longitude } = params;
    // ダミーの位置情報を返す
    return {
      location: `Tokyo, Japan`,
    };
  },
});

const getCurrentWeather = createToolkit({
  name: "weather_toolkit",
  description: "Get the current weather",
  tools: [weatherTool, getLocation, getLatLang],
  instructions:
    "use get_lat_lang to get the current location, then use get_location to get the location name, and finally use get_weather to get the weather.",
  addInstructions: true,
});

const agent = new Agent({
  name: "my-agent-app",
  instructions: "現在地の天気を取得するエージェント",
  llm: new VercelAIProvider(),
  model: google("gemini-2.0-flash-exp"),
  tools: [getCurrentWeather],
});
```

以下のように 3 つのツールを使用して結果を取得する例が得られました。

```sh
現在地の天気を取得します。現在地を取得するために、get_lat_langを使用します。
現在地は緯度35.6895、経度139.6917です。get_locationを使用して位置名を取得します。
現在地は東京都です。get_weatherを使用して天気を取得します。
東京都の天気は晴れで、気温は25度です。
```


## Model Context Protocol（MCP）

VoltAgent は [Model Context Protocol](https://modelcontextprotocol.io/introduction) をサポートしています。MCP はアプリケーションが LLM にコンテキストを提供する方法を標準化するオープンなプロトコルです。MCP を使用することで標準化された方法でツールやデータソースを LLM に接続できます。すでに多くの企業によって MCP ツールが提供されており、例えば Google Calendar や Slack、Sentry などツールと LLM を統合できます。LLM を介して Google Calendar の予定を取得したり、Slack にメッセージを送信したりするなどの操作が可能になります。

ここではブラウザの操作ツールである [Playwright MCP](https://github.com/microsoft/playwright-mcp) を使用して、ブラウザを操作するエージェントを作成してみましょう。まずは Playwright MCP を使用してローカルで SSE transport を使用したサーバーを起動します。

```bash
npx @playwright/mcp@latest --port 8931
```

VoltAgent で MCP ツールを使用するためには `MCPConfiguration` クラスを使用して MCP の設定を行います。`servers` プロパティに key-value 形式で MCP ツールの名前と接続先を指定します。

```ts:src/index.ts
import { MCPConfiguration } from "@voltagent/core";

const mcpConfig = new MCPConfiguration({
  servers: {
    browser: {
      type: "http",
      url: "http://localhost:8931",
    }
  }
})
```

次に `mcpConfig` からツールを取得して `Agent` に渡します。ツールを取得するメソッドとして以下の 2 つがあります。

- `getTools`: すべてのツールを `Tool` の配列として取得する
- `getToolsets`: すべてのツールをグループ化した `ToolKit` として取得する

```ts:src/index.ts
import { Agent, MCPConfiguration } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { google } from "@ai-sdk/google";

const mcpConfig = new MCPConfiguration({...});

const tools = await mcpConfig.getTools();

const agent = new Agent({
  name: "my-agent-app",
  instructions: "ブラウザを操作して情報を収集するエージェントです。",
  llm: new VercelAIProvider(),
  model: google("gemini-2.5-flash-exp"),
  tools: tools,
});

const response = await agent.generateText("azukiazusa.dev の人気記事を教えてください。");
console.log(response.text);
```

このコードを実行すると、ブラウザが起動し、指定した URL にアクセスして情報を収集します。

```sh
azukiazusa.devの人気記事を調べるために、サイトを訪問してみます。

サイトにアクセスしたところ、「人気記事」セクションを見つけました。azukiazusa.devの人気記事は以下の通りです：

React Router の Server Components 対応

Cloudflare で MCP サーバーを構築する

Docker の MCP Toolkit を試してみる
```

## サブエージェント

サブエージェントはスーパーバイザーエージェントの元で特定のタスクを実行する専門的なエージェントです。各サブエージェントはそれぞれの専門分野に集中し、スーパーバイザーはその調整を受けるといった複雑なワークフローを構築できます。サブエージェントを使用することで複雑な問題をより小さく管理しやすい部分に分割し、システム全体の開発と保守を容易にします。

実践的な例として、AI ライターを考えてみましょう。AI ライターは記事の執筆を行うエージェントで、以下のようなサブエージェントを持つことが考えられるでしょう。

- 情報収集エージェント: 特定のトピックに関する情報をブラウザから収集する
- コンテンツ生成エージェント: 収集した情報を元に記事を生成する
- 編集エージェント: 生成された記事を校正し、必要に応じて修正する
- 翻訳エージェント: 記事を他の言語に翻訳する

まずは情報収集エージェントを作成しましょう。先程使用した Playwright MCP を使用して、ブラウザを操作して情報を収集するエージェントを作成します。

```ts:src/agents/information-collector.ts
import { Agent, MCPConfiguration } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { anthropic } from "@ai-sdk/anthropic";

const mcpConfig = new MCPConfiguration({
  servers: {
    browser: {
      type: "http",
      url: "http://localhost:8931/sse",
    },
  },
});

const tools = await mcpConfig.getTools();

export const informationCollectorAgent = new Agent({
  name: "information-collector",
  instructions: "ブラウザを操作して情報を収集するエージェントです。",
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
  tools: tools,
});
```

次にコンテンツ生成エージェント・編集エージェント・翻訳エージェントをそれぞれ作成します。特にツールなどは指定せずに、`instructions` でそれぞれのエージェントの役割を指定します。

```ts:src/agents/content-generator.ts
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { anthropic } from "@ai-sdk/anthropic";

export const contentGenerationAgent = new Agent({
  name: "content-generation-agent",
  instructions: `
    あなたは収集された情報を元に記事を生成するエージェントです。

    ## 役割と責任
    - 提供された情報を分析し、構造化された記事を作成する
    - 読者にとって魅力的で価値のあるコンテンツを生成する
    - 事実に基づいた正確な情報を提供する
    - 指定されたトピック、トーン、フォーマットに従う
    - 適切な見出し、段落、箇条書きを使用して読みやすさを確保する

    ## 記事生成のガイドライン
    1. 提供された情報を徹底的に分析する
    2. 明確で魅力的なタイトルを作成する
    3. 導入部で読者の関心を引く
    4. 論理的な構造で情報を整理する
    5. 適切な見出しと小見出しを使用する
    6. 事実と意見を明確に区別する
    7. 必要に応じて例や説明を追加する
    8. 強力な結論で締めくくる
    9. SEOに最適化されたキーワードを含める

    ## 出力形式
    - タイトル: 記事の主題を反映した魅力的なタイトル
    - 本文: 構造化された記事の本文
    - 要約: 記事の主要ポイントを簡潔にまとめた要約
    - キーワード: 記事に関連するキーワードのリスト
  `,
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
});
```

```ts:src/agents/editor.ts
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { anthropic } from "@ai-sdk/anthropic";

export const editingAgent = new Agent({
  name: "editing-agent",
  instructions: `
    あなたは生成された記事を校正し、必要に応じて修正するエージェントです。

    ## 役割と責任
    - 文法、スペル、句読点のエラーを修正する
    - 文章の流れと構造を改善する
    - 一貫性のある文体とトーンを確保する
    - 冗長な表現や繰り返しを削除する
    - 明確さと簡潔さを向上させる
    - 事実の正確さを確認する
    - 適切な見出しと段落の使用を確認する
    - 読みやすさを向上させるための提案をする

    ## 編集のガイドライン
    1. 文法とスペルのエラーを特定して修正する
    2. 文章構造と流れを評価し、必要に応じて改善する
    3. 一貫性のない文体やトーンを特定し、統一する
    4. 冗長な表現や不必要な繰り返しを削除する
    5. 複雑な文を簡潔で明確な文に分割する
    6. 事実の正確さを確認し、必要に応じて修正する
    7. 見出しと段落の使用が適切かどうかを評価する
    8. 読みやすさを向上させるための具体的な提案をする

    ## 出力形式
    - 修正された記事: 校正と編集が完了した記事の全文
    - 変更点のサマリー: 行った主な変更点の概要
    - 改善のための提案: 今後の記事作成のための提案
  `,
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
});
```

```ts:src/agents/translator.ts
import { Agent } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { anthropic } from "@ai-sdk/anthropic";
export const translationAgent = new Agent({
  name: "translation-agent",
  instructions: `
    あなたは記事を以下の言語に翻訳するエージェントです。

    ## 翻訳対象言語
    - 日本語
    - 英語

    ## 役割と責任
    - 記事を指定された言語に正確に翻訳する
    - 原文の意味とニュアンスを保持する
    - 文化的な文脈を考慮して適切に翻訳する
    - 専門用語を正確に翻訳する
    - 自然で流暢な翻訳を提供する
    - 翻訳後も記事の構造と形式を維持する
    - 必要に応じて文化的な注釈を追加する

    ## 翻訳のガイドライン
    1. 原文を徹底的に理解する
    2. 文脈を考慮して適切な単語と表現を選択する
    3. 文化的な参照や慣用句を適切に翻訳する
    4. 専門用語の正確な翻訳を確保する
    5. 翻訳後も文章の流れと構造を維持する
    6. 自然で読みやすい翻訳を提供する
    7. 必要に応じて文化的な注釈を追加する
    8. 翻訳の一貫性を確保する

    ## 出力形式
    - 翻訳された記事: 指定された言語に翻訳された記事の全文
    - 翻訳の注釈: 特定の翻訳の選択に関する説明（必要な場合）
    - 文化的な注釈: 文化的な参照や背景に関する説明（必要な場合）
  `,
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
});
```

作成したこれらのエージェントはスーパーバイザーエージェントの `subAgents` プロパティに追加します。`subAgents` プロパティは `Agent` クラスの配列を受け取ります。

```ts:src/index.ts
import { VoltAgent, Agent, MCPConfiguration } from "@voltagent/core";
import { VercelAIProvider } from "@voltagent/vercel-ai";
import { anthropic } from "@ai-sdk/anthropic";
import { contentGenerationAgent } from "./agents/content-generator.js";
import { editingAgent } from "./agents/editor.js";
import { informationCollectorAgent } from "./agents/information-collector.js";
import { translationAgent } from "./agents/translator.js";

const agent = new Agent({
  name: "Supervisor Agent",
  instructions:
    "あなたの役割は、他のエージェントを監督し、全体のプロセスを管理することです。最終的な目的はユーザーが期待する記事を生成することです。",
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
  subAgents: [
    informationCollectorAgent,
    contentGenerationAgent,
    editingAgent,
    translationAgent,
  ],
});

new VoltAgent({
  agents: {
    agent,
  },
});
```

`subAgents` プロパティを指定して `Agent` を作成すると、いくつかの処理が自動で行われます。

- スーパーバイザーエージェントのシステムプロンプトが変更され、サブエージェントを効果的に管理するための指示が追加される
- スーパーバイザーエージェントが使用できるツールに `delegate_task` が追加される。このツールにより、LLM はタスクをどのように委任するかを決定できる
- スーパーバイザーとサブエージェントの親子関係が `AgentRegistry` に登録される

作成したエージェントを実際に試してみましょう。「React v19 の新機能について記事を書いてください」といったリクエストをすると、スーパーバイザーエージェントがサブエージェントにタスクを委任します（私が試したときには `messages` が含まれていないという理由でエラーが発生しました）。

```sh
React の use フックについての記事を作成するために、まず情報を収集し、その後記事を生成していきます。...
```

VoltAgent の UI でログを確認すると `content-generation-agent` への input でスーパーバイザーエージェントからのメッセージが渡されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4i647va5rUojG88IboaEIY/2e47c8b91936c1915b026f8184bdcf5a/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-20_8.34.38.png)

## メモリ

LLM は通常ユーザーとの会話の記憶を持つことはありません。チャットベースのインターフェイスでは一見過去の会話を記憶しているように見えますが、実際には会話履歴をすべてプロンプトに渡していることで実現しています。別の会話を始めると今までのユーザーの情報は失われてしまいます。

より一貫性のあるパーソナライズされた会話を実現するためには、過去の会話を外部のストレージに保存し、必要に応じてそれを参照する必要があります。

VoltAgent ではデフォルトでメモリを管理するようになっています。特にメモリに関する設定を行わない場合には `LibSQLStorage` が使用されます。`LibSQLStorage` は SQLite を使用してメモリを管理します。会話の履歴は `.voltagent/memory.db` に保存されます。

VoltAgent ではメモリを管理するためのストレージとして以下のものが用意されています。

- `LibSQLStorage`: SQLite を使用したストレージ。デフォルトで使用される
- `@voltagent/supabase`: [Supabase](https://supabase.com/)（PostgreSQL）を使用したストレージ
- `InMemoryStorage`: メモリ上にデータを保存するストレージ。開発やテスト用
- カスタムストレージ: `Memory` インターフェイスを満たしたカスタムストレージを作成することで、任意のストレージを使用することができる

できるメモリを無効にしたい場合には `memory` プロパティを `false` に設定します。

```ts:src/index.ts
import { Agent } from "@voltagent/core";

const agent = new Agent({
  name: "my-agent-app",
  instructions: "あなたは私のアシスタントです。",
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
  memory: false,
});
```

### 会話履歴の管理

メモリを使用して異なるチャットセッション間で会話履歴を管理する場合には `userId` と `conversationId` を指定する必要があります。これにより、異なるユーザーや会話に対して異なる履歴を管理できます。

これらの識別子は `generateText` や `streamText` メソッドの引数として渡すことができます。

```ts:src/index.ts
import { Agent } from "@voltagent/core";

const agent = new Agent({
  name: "my-agent-app",
  instructions: "あなたは私のアシスタントです。",
  llm: new VercelAIProvider(),
  model: anthropic("claude-3-7-sonnet-20250219"),
});

const response = await agent.generateText("こんにちは〜", {
  userId: "user-1",
  conversationId: "conversation-1",
});
```

VoltConsole 上では歯車のアイコンをクリックして `userId` と `conversationId` を指定できます。

これらのパラメーターを指定して「私の名前を覚えていますか？」と質問すると、VoltAgent は別のチャットセッションの情報を参照して応答していることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/ojKjeLou5oOZlRwHaKBrj/aba2dd1ff6b9905b260f719c07338074/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-21_19.04.48.png)

## オブザーバビリティ

オブザーバビリティとは、システムの状態やパフォーマンスを監視し、理解するための概念です。

複雑な AI エージェントを構築するにあたり、オブザーバビリティは重要な要素です。どのコンポーネントで問題が発生しているのか素早く特定したり、エージェント間でどのようなやり取りが行われているのかを把握したりできます。VoltAgent では VoltConsole を使用して、web UI 上でエージェントの実行フローをトレースし各エージェントの入力と出力を確認できます。

VoltConsole でトレースを有効にするにはいくつかの設定が必要です。まずは VoltConsole 上でプロジェクトを作成します。画面上部に「Production tracing not configured for this agent」というメッセージが表示されているので、「Configure」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2cFHOiHHH5CKoUpvsEUh4h/618d76c7c74fc41f239f797a67a241fe/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-21_8.40.52.png)

トレーシングをセットアップする画面が表示されるので、「Team」と「Project」を選択します。「+」をクリックして新しいプロジェクトを作成することもできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6HXXCNEpJxd1qtpZVTazl5/379b4361edf5e942b1f1a183c19996cf/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-21_8.41.35.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/4iQP0bXgr27fQtmCIV5FIb/721bc6598d8bb268583f7293fbc1a172/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-21_8.42.54.png)

プロジェクトの作成が完了すると、`VoltAgent` と統合するために必要な `publickKey` と `secretKey` を追加するためのコードが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4FIjEvs2scBa2PsAdk1O1e/3f807fef4920c3c3ebe0f3b3df4ae26a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-21_8.43.13.png)

このコードをコピーして、`VoltAgent` を初期化する際に渡します。

```ts:src/index.ts {7-11}
import { VoltAgent, VoltAgentExporter } from "@voltagent/core";

new VoltAgent({
  agents: {
    agent,
  },
  telemetryExporter: new VoltAgentExporter({
    publicKey: "pk_f3c844d89092e73d62349edff452c70d",
    secretKey: "xxx",
    baseUrl: "https://server.voltagent.dev",
  }),
});
```

正しくトレーシングの設定が行われていると、「Production tracing not configured for this agent」というメッセージが表示されなくなります。以下のように AI エージェントがどのように動作しているのか追跡できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4XBoXx02DCLkOUjJFN0Mwo/1c41e7ef0d9177b4da5ca03841e2ac06/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-05-21_9.14.45.mov" controls></video>

`telemetryExporter` には `VoltAgentExporter` 以外にも OpenTelmetry を使用したエクスポータを指定できます。

```ts:src/index.ts
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-base";

new VoltAgent({
  agents: {
    agent,
  },
  telemetryExporter: new ConsoleSpanExporter(),
});
```

## まとめ

VoltAgent は TypeScript で AI エージェントを構築するための強力なツールキットです。スーパーバイザーエージェントやサブエージェントを組み合わせた複雑なワークフローの構築、メモリ管理、オブザーバビリティなど、AI アプリケーション開発に必要な機能が揃っています。VoltAgent Console を使えば、エージェントの状態やワークフローをリアルタイムで可視化でき、効率的なデバッグが可能です。Model Context Protocol（MCP）対応により、様々な外部ツールとの統合も容易になっています。


## 参考

- [VoltAgent](https://voltagent.dev/docs/)
- [voltagent/examples at main · VoltAgent/voltagent](https://github.com/VoltAgent/voltagent/tree/main/examples)
