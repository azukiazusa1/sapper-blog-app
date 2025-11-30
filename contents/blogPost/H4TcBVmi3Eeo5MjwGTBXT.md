---
id: H4TcBVmi3Eeo5MjwGTBXT
title: "Claude のツール検索ツールを試してみた"
slug: "trying-claude-tool-finder"
about: "MCP では多くのツール定義が LLM のコンテキストを圧迫する問題があります。Claude のツール検索ツールを使用すると、必要に応じて関連するツールのみを LLM に提供でき、コンテキスト圧迫を軽減できます。この記事では Claude の TypeScript クライアントを使用して、ツール検索ツールを実際に使用した例を紹介します。"
createdAt: "2025-11-30T15:11+09:00"
updatedAt: "2025-11-30T15:11+09:00"
tags: ["AI", "Claude", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/34a3JBTrFBQNdB0dwmHCHX/49be25dffbc91e384355db7944a81c7a/bike_american_15903-768x591.png"
  title: "アメリカンバイクのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ツール検索ツールには 2 つのタイプがあります。正しい組み合わせはどれですか？"
      answers:
        - text: "正規表現ベースと BM25 ベース"
          correct: true
          explanation: "tool_search_tool_regex_20251119（正規表現）と tool_search_tool_bm25_20251119（BM25 自然言語検索アルゴリズム）の 2 種類が提供されています。"
        - text: "正規表現ベースと機械学習ベース"
          correct: false
          explanation: null
        - text: "キーワードベースと BM25 ベース"
          correct: false
          explanation: null
        - text: "正規表現ベースと埋め込みベース"
          correct: false
          explanation: null
    - question: "MCP サーバーのツールを遅延読み込みとして登録する際に使用する type の値は何ですか？"
      answers:
        - text: "mcp_server"
          correct: false
          explanation: null
        - text: "mcp_tool"
          correct: false
          explanation: null
        - text: "mcp_toolset"
          correct: true
          explanation: "MCP ツールセットを指定するには type: mcp_toolset を使用し、default_config.defer_loading: true で遅延読み込みを有効にします。"
        - text: "defer_loading_toolset"
          correct: false
          explanation: null
    - question: "ツール検索ツールを使用すべきではない状況はどれですか？"
      answers:
        - text: "すべてのツールが頻繁に使用される場合"
          correct: true
          explanation: "ツールが少ない場合や、すべてのツールが頻繁に使用される場合は、ツール検索のステップが追加されるトレードオフに対しての利点が小さいため、ツール検索ツールを使用しない方が良いでしょう。"
        - text: "ツールの数が多すぎる場合"
          correct: false
          explanation: null
        - text: "ツールの選択の精度に問題がある場合"
          correct: false
          explanation: null
        - text: "複数の MCP サーバーを同時に利用する場合"
          correct: false
          explanation: null
published: true
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) の問題点の 1 つとしてツールの定義が LLM のコンテキストを圧迫することが挙げられます。ほとんどの MCP クライアントはツールの定義を LLM のシステムプロンプトにすべて渡す設計となっています。これは LLM に事前に利用可能なツールを認識させるために必要な手法です。しかし、タスクの実行に不要なツールの定義まで渡されてしまうため、LLM のコンテキストが無駄に消費されてしまいます。

多くの場合 1 つの MCP サーバーにつき 10 ~ 20 個程度のツールが登録されており、またユーザーは複数の MCP サーバーを同時に利用することもあるため 1 度にシステムプロンプトに渡されるツールの数は 100 個を超えることもあります。ツールの定義だけで 50,000 以上のトークンが消費されることもありました。

また LLM に大量のコンテキストが与えられると、人間と同様にある時点で情報過多に陥り、重要な情報を見落としたり、混乱したりすることが分かっています。コンテキストウィンドウ内のトークンの数が増えると、モデルがそのコンテキストから情報を正確に思い出す能力が低下するという [Context Rot(コンテキストの腐敗)](https://research.trychroma.com/context-rot)という概念も研究により明らかになっています。

つまり、MCP サーバーを無作為に利用するだけでは、LLM のパフォーマンスが低下する可能性が指摘されているのです。

この問題を解決するためにいくつかのアプローチが考案されています。その 1 つが [Claude のツール検索ツール (Tool Search Tool)](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) です。ツール検索ツールはすべてのツール定義を事前に読むこむのではなく、必要に応じて関連するツールを検索し、そのツールの定義のみを LLM に提供する手法を採用しています。これにより LLM が定義済みのツールにアクセスできるようにしつつ、トークン使用量を削減することが可能になります。

この記事では Claude の TypeScript クライアントを使用して、ツール検索ツールを実際に使用した例を紹介します。

## ツール検索ツールを使用した例

それでは、実際にツール検索ツールを使用した例を見てみましょう。まずは適当な TypeScript プロジェクトを作成し、Anthropic SDK をインストールします。

```bash
npm install @anthropic-ai/sdk
```

Claude Code の API キーを環境変数 `ANTHROPIC_API_KEY` に設定します。

```bash
export ANTHROPIC_API_KEY="your_api_key_here"
```

Anthropic SDK を使用して、ツール検索ツールを利用するコードを以下に示します。天気予報を取得するツールと現在時刻を取得するツールを登録し、ツール検索ツールを使用してユーザーの質問に答えます。

```typescript {8, 12-15, 30, 42}
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.beta.messages.create({
  // claude-sonnet-4-5 or claude-opus-4-5 がツール検索ツールをサポート
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  messages: [{ role: "user", content: "東京の天気を教えてください。" }],
  max_tokens: 2048,
  tools: [
    {
      type: "tool_search_tool_regex_20251119",
      name: "tool_search_tool_regex",
    },
    {
      name: "get_weather",
      description: "Get the weather at a specific location",
      input_schema: {
        type: "object",
        properties: {
          location: { type: "string" },
          unit: {
            type: "string",
            enum: ["celsius", "fahrenheit"],
          },
        },
        required: ["location"],
      },
      defer_loading: true,
    },
    {
      name: "get_current_time",
      description: "Get the current time at a specific location",
      input_schema: {
        type: "object",
        properties: {
          location: { type: "string" },
        },
        required: ["location"],
      },
      defer_loading: true,
    },
  ],
});

console.log(JSON.stringify(response, null, 2));
```

ツール検索ツールは現時点でベータ版の提供であるため、`betas` に `advanced-tool-use-2025-11-20` を指定する必要があります。また、`model` にはツール検索ツールをサポートするモデル (例: `claude-sonnet-4-5` または `claude-opus-4-5`) を指定します。

`tools` の配列の 1 つ目の要素でツール検索ツールを指定しています。ツール検索ツールには以下の 2 つのタイプがあります。

- 正規表現（`tool_search_tool_regex_20251119`）: Claude はツールを検索するために正規表現を使用する
- BM25（`tool_search_tool_bm25_20251119`）: Claude は自然言語検索アルゴリズム [BM25](http://ja.wikipedia.org/wiki/Okapi_BM25) を使用してツールを検索する

ツールの定義には `defer_loading: true` を指定しているのがポイントです。`defer_loading: true` を指定されたツールはシステムプロンプトにツール定義が含まれず、ツール検索ツールで Claude が発見した場合のみに定義が提供されます。`defer_loading` を指定しない（または `false` にする）ツールは従来通りシステムプロンプトに定義が含まれます。プラクティスとして、頻繁に使用される 3 ~ 5 個のツールは遅延読み込みを行わずに通常通り定義を含めることが推奨されています。

コードを実行し API リクエストを実行すると以下のようなレスポンスが得られます。

```json
{
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "server_tool_use",
      "id": "srvtoolu_xxx",
      "name": "tool_search_tool_regex",
      "input": {
        "pattern": "weather|天気|tokyo|東京",
        "limit": 5
      },
      "caller": {
        "type": "direct"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_xxx",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [
          {
            "type": "tool_reference",
            "tool_name": "get_weather"
          }
        ]
      }
    },
    {
      "type": "text",
      "text": "天気情報を取得できるツールが見つかりました。東京の天気を確認いたします。"
    },
    {
      "type": "tool_use",
      "id": "toolu_01FV8i9byYG3Btzf2pMmkXFK",
      "name": "get_weather",
      "input": {
        "location": "東京",
        "unit": "celsius"
      },
      "caller": {
        "type": "direct"
      }
    }
  ],
  "stop_reason": "tool_use",
}
```

`type: server_tool_use` のメッセージでは Claude がユーザーのタスクを実行するためにツール検索ツールを呼び出していることが分かります。`input.pattern` では正規表現で「weather」「天気」「tokyo」「東京」を指定しており、ツール検索ツールはこれらのキーワードにマッチするツールを検索します。`input.limit` では最大 5 件のツールを返すように指定しています。

`type: tool_search_tool_result` のメッセージではツール検索ツールが見つけたツールの一覧が返されています。この例では「get_weather」ツールが見つかっています。最後に `type: tool_use` のメッセージで Claude が「get_weather」ツールを使用して東京の天気情報を取得しようとしていることが分かります。この後の処理は通常のツール使用と同様です。

:::note
ツール検索ツールを有効にすると、検索ステップが追加されるというトレードオフが存在します。10k トークン以上消費するツール定義がある場合や、ツールの選択の精度に問題がある場合にツール検索ツールを有効化することが最も有効な効果が得られることが期待されます。反対に 10 個未満のツールしかない場合や、すべてのツールが頻繁に使用される場合は、ツール検索ツールを使用しない方が良いでしょう。
:::


## MCP サーバーとの連携

ツール検索ツールは MCP サーバーと連携して動作します。以下は MCP サーバーでツールを遅延読み込みとして登録するコード例です。

```typescript {7, 23-34}
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20", "mcp-client-2025-11-20"],
  messages: [{ role: "user", content: "Cloudflare Workers をデプロイする方法" }],
  max_tokens: 2048,
  // MCP サーバーを登録
  mcp_servers: [
    {
      type: "url",
      url: "https://docs.mcp.cloudflare.com/mcp",
      name: "cloudflare-docs",
    },
  ],
  tools: [
    {
      type: "tool_search_tool_regex_20251119",
      name: "tool_search_tool_regex",
    },
    {
      type: "mcp_toolset",
      mcp_server_name: "cloudflare-docs",
      default_config: {
        defer_loading: true,
      },
      configs: {
        "cloudflare-docs_migrate_pages_to_workers_guide": {
          defer_loading: false,
        },
      },
    },
  ],
});

console.log(JSON.stringify(response, null, 2));
```

ツール検索ツールを MCP サーバーと連携するには `betas` の配列に `mcp-client-2025-11-20` を追加します。

MCP ツールを遅延読み込みとして登録するには `type: mcp_toolset` で MCP ツールセットを指定し、`default_config.defer_loading: true` を指定します。これにより MCP サーバーから取得されるすべてのツールが遅延読み込みとして登録されます。特定のツールのみ遅延読み込みを無効化したい場合は `configs` でツール名をキーにして `defer_loading: false` を指定します。

コードを実行すると `cloudflare|workers|deploy` という検索ワードを使用してツール検索ツールが MCP サーバーからツールを検索し、`cloudflare-docs_search_cloudflare_documentation` ツールが見つかっていることがわかりました。

```json
{
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "Cloudflare Workersのデプロイに関連するツールを検索します。"
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_xxx",
      "name": "tool_search_tool_regex",
      "input": {
        "pattern": "cloudflare|workers|deploy",
        "limit": 10
      },
      "caller": {
        "type": "direct"
      }
    },
    {
      "type": "tool_search_tool_result",
      "tool_use_id": "srvtoolu_xxx",
      "content": {
        "type": "tool_search_tool_search_result",
        "tool_references": [
          {
            "type": "tool_reference",
            "tool_name": "cloudflare-docs_search_cloudflare_documentation"
          },
        ]
      }
    },
    {
      "type": "text",
      "text": "Cloudflare Workersのデプロイに関する情報を検索します。"
    },
    {
      "type": "mcp_tool_use",
      "id": "mcptoolu_xxx",
      "name": "search_cloudflare_documentation",
      "input": {
        "query": "Cloudflare Workers デプロイ deploy 方法"
      },
      "server_name": "cloudflare-docs"
    },
  ]
}
```

## まとめ

- MCP はすべてのツール定義を事前に LLM のシステムプロンプトとして渡すため、コンテキストが圧迫される問題がある
- コンテキスト圧迫の解決策の 1 つとして Claude のツール検索ツールがある
- ツール検索ツールは必要に応じて関連するツールを検索し、そのツールの定義のみを LLM に提供する
- ツール検索ツールは正規表現ベースと BM25 ベースの 2 種類
- ツール検索ツールを使用するにはベータヘッダー `advanced-tool-use-2025-11-20` を指定する
- `defer_loading: true` を指定してツールを遅延読み込みとして登録することでツール検索ツールと連携可能。頻繁に使用されるツールは遅延読み込みを無効化することが推奨される
- MCP サーバーと連携してツール検索ツールを使用することも可能。MCP ツールを遅延読み込みとして登録するには `type: mcp_toolset` を使用し、`default_config.defer_loading: true` を指定する

## 参考

- [Introducing advanced tool use on the Claude Developer Platform \ Anthropic](https://www.anthropic.com/engineering/advanced-tool-use)
- [Tool search tool - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool)