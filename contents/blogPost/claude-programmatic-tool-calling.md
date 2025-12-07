---
id: 27Iop4ETuIGYGs8sycjPC
title: "Claude のプログラミングによるツール呼び出し"
slug: "claude-programmatic-tool-calling"
about: "MCP ツールの呼び出しはコンテキスト汚染や推論のオーバーヘッドなどの課題があります。Claude のプログラムによるツール呼び出し機能を利用することで、これらの課題を解決する方法について解説します。"
createdAt: "2025-12-07T11:42+09:00"
updatedAt: "2025-12-07T11:42+09:00"
tags: ["AI", "claude", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4wVvC7bUw0FnrmDgBHwMhC/4841e2bfcbea1b0c226d30a80b5cac37/washoku_nimono_7877-768x576.png"
  title: "煮物のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "プログラムによるツール呼び出しを利用する際、ツールの実行環境として使用されるコンテナの有効期限はおよそどのくらいですか？"
      answers:
        - text: "約 1 分間"
          correct: false
          explanation: null
        - text: "約 4.5 分間"
          correct: true
          explanation: "コンテナの使用期限はおよそ 4.5 分間です。`expires_at` フィールドにコンテナの有効期限が示されています。"
        - text: "約 10 分間"
          correct: false
          explanation: null
        - text: "約 30 分間"
          correct: false
          explanation: null
    - question: "Claude のプログラムによるツール呼び出し機能で Claude が使用するプログラミング言語は何ですか？"
      answers:
        - text: "JavaScript"
          correct: false
          explanation: null
        - text: "Python"
          correct: true
          explanation: "Claude はプログラム実行環境として Python を使用します。ツール呼び出しのロジックを Python コードで記述します。"
        - text: "Ruby"
          correct: false
          explanation: null
        - text: "Java"
          correct: false
          explanation: null
published: true
---
[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) は LLM が外部ツールと連携するために今や欠かせない仕組みとなっています。しかし MCP の登場から 1 年が経過した現在、いくつかの課題が明らかになっています。Anthropic 社のエンジニアリングチームによると、MCP のツール呼び出しでは以下の 2 つの問題点が指摘されています。

- ツール呼び出し中間結果によるコンテキスト汚染: ツールを実行した結果はすべて LLM のコンテキストウィンドウに追加される。例えば検索ツールを呼び出したとき、実際に必要な情報は上位の数件だけであるにもかかわらず、ツールが返した検索結果がすべてコンテキストに追加されてしまう。これにより、LLM のコンテキストウィンドウが不要な情報で溢れ、重要な情報が埋もれてしまう可能性がある。
- 推論のオーバーヘッドと手作業による合成: ツール呼び出しのたびに LLM は新たな推論をする必要があり、これが全体の応答時間を増加させる。例えば「商品情報を検索するツール」→「ショッピングカートに追加するツール」→「注文を確定するツール」という一連の操作をする場合、各ステップで LLM は各要素をどのように組み合わせるか、次に何をすべきかを判断するために複数回の推論をする必要がある。さらに、LLM が各ステップでの出力を合成して最終的な応答を生成するための作業も追加で必要となる。

この問題を解決するためのアプローチの 1 つとしてプログラムによるツール呼び出し（Programmatic Tool Calling）機能が Claude に導入されました。これは Claude がプログラム実行環境（Python）上でツールを呼び出すことができるようにするものです。これにより Claude はツールを 1 つずつ呼び出して都度中間結果をコンテキストウィンドウに追加するのではなく、必要なツールをすべてプログラム内で呼び出し、その結果を組み合わせて最終的な応答を生成することが可能になります。

また LLM はツール呼び出しのインターフェイスよりもプログラムのコード作成に長けていると考えられています。Python で条件分岐やループを駆使したロジックを実装することにより、ツールを複数回呼び出して結果を組み合わせるよりもより信頼性の高い応答を生成できる可能性があります。

この記事では TypeScript SDK を用いて Claude のプログラムによるツール呼び出し機能を利用する方法について解説します。

## プログラムによるツール呼び出しの例

それでは、実際に検索ツールを使用した例を見てみましょう。まずは適当な TypeScript プロジェクトを作成し、Anthropic SDK をインストールします。

```bash
npm install @anthropic-ai/sdk
```

Claude の API キーを環境変数 `ANTHROPIC_API_KEY` に設定します。

```bash
export ANTHROPIC_API_KEY="your_api_key_here"
```

Anthropic SDK を使用して、Claude のプログラムによるツール呼び出しをするコードは以下のようになります。

```typescript {8, 12-15, 29}
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.beta.messages.create({
  // claude-sonnet-4-5 or claude-opus-4-5 が必要
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  messages: [
    { role: "user", content: "最新の TypeScript の新機能を教えてください。" },
  ],
  max_tokens: 2048,
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution",
    },
    {
      name: "search_web",
      description: "Web search tool for finding information online.",
      input_schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to execute.",
          },
        },
        required: ["query"],
      },
      allowed_callers: ["code_execution_20250825"],
    },
  ],
});

console.log(JSON.stringify(response, null, 2));
```

プログラムによるツール呼び出し機能は現時点でベータ版の提供であるため、`betas` オプションに `advanced-tool-use-2025-11-20` を指定する必要があります。また、`claude-sonnet-4-5` または `claude-opus-4-5` モデルを使用する必要があります。

`type: "code_execution_20250825"` のツールがプログラム実行環境を提供するツールです。`allowed_callers` オプションに `code_execution_20250825` を指定することで、このツールはプログラムによるツール呼び出しのみで使用できるようになります。`allowed_callers` オプションの指定方法には以下の 3 つの方法があります。

- `["direct"]`: Claude が直接ツールを呼び出すことを許可する（デフォルト）
- `["code_execution_20250825"]`: プログラム実行環境からのみツールを呼び出すことを許可する
- `["direct", "code_execution_20250825"]`: Claude が直接ツールを呼び出すことと、プログラム実行環境からツールを呼び出すことの両方を許可する

:::tip
ツールの実行について Claude に明確なガイドラインを与えるため、両方を許可するのではなく `['direct']` または `['code_execution_20250825']` のいずれかを指定することが推奨されます。
:::

実際にコードを実行してみましょう。以下のようなレスポンスが得られるはずです。

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "最新のTypeScriptの新機能について調べます。"
    },
    {
      "type": "server_tool_use",
      "id": "srvtoolu_xxx",
      "name": "code_execution",
      "input": {
        "code": "\nimport asyncio\n\nasync def main():\n    result = await search_web({\"query\": \"TypeScript latest new features 2024 2025\"})\n    print(result)\n\nasyncio.run(main())\n"
      },
      "caller": {
        "type": "direct"
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_xxx",
      "name": "search_web",
      "input": {
        "query": "TypeScript latest new features 2024 2025"
      },
      "caller": {
        "type": "code_execution_20250825",
        "tool_id": "srvtoolu_xxx"
      }
    }
  ],
  "container": {
    "id": "container_xxx",
    "expires_at": "2025-12-07T03:58:43.595121Z"
  },
  "stop_reason": "tool_use",
  "stop_sequence": null
}
```

最初に Claude は「最新の TypeScript の新機能について調べます。」と応答し、このタスクを達成するためにツールの呼び出しを試みます。プログラムによるツール呼び出しツールである `code_execution` が呼び出され、引数には検索ツールを呼び出す Python コードが含まれています。また `caller.type` が `direct` であることから、Claude が直接ツールを呼び出していることがわかります。

```json
{
  "type": "server_tool_use",
  "id": "srvtoolu_xxx",
  "name": "code_execution",
  "input": {
    "code": "\nimport asyncio\n\nasync def main():\n    result = await search_web({\"query\": \"TypeScript latest new features 2024 2025\"})\n    print(result)\n\nasyncio.run(main())\n"
  },
  "caller": {
    "type": "direct"
  }
}
```

次のステップでは、`search_web` ツールが呼び出され、検索クエリとして「TypeScript latest new features 2024 2025」が指定されています。`caller.type` が `code_execution_20250825` であることから、プログラム実行環境からツールが呼び出されていることがわかります。

```json
{
  "type": "tool_use",
  "id": "toolu_xxx",
  "name": "search_web",
  "input": {
    "query": "TypeScript latest new features 2024 2025"
  },
  "caller": {
    "type": "code_execution_20250825",
    "tool_id": "srvtoolu_xxx"
  }
}
```

ツールを実行するコンテナ環境の情報もレスポンスに含まれています。コンテナは既存のコンテナを再利用しない限り、セッションごとに新しいコンテナが作成されます。`expires_at` フィールドにはコンテナの有効期限が示されています。コンテナの使用期限はおよそ 4.5 分間です。

```json
{
  "container": {
    "id": "container_xxx",
    "expires_at": "2025-12-07T03:58:43.595121Z"
  }
}
```

ツール使用の要求が行われると API リクエストが中断するため、`stop_reason` フィールドには `tool_use` が設定されます。実際のワークフローではこの後ツールのレスポンスを含めて再度 API リクエストを行い、最終的な応答を取得します。

```typescript
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const response = await client.beta.messages.create({...});

const response2 = await client.beta.messages.create({
  model: "claude-sonnet-4-5",
  betas: ["advanced-tool-use-2025-11-20"],
  container: response.container?.id, // 最初のレスポンスで作成されたコンテナIDを指定して再利用
  messages: [
    { role: "user", content: "最新の TypeScript の新機能を教えてください。" },
    // 前回のレスポンスを会話履歴に追加して続きから処理を行う
    { role: "assistant", content: [...response.content] },
    // ツールの実行結果を追加
    {
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: response.content.at(-1)?.id,
          content: [
            {
              type: "text",
              text: JSON.stringify({
                results: [
                  {
                    title: "TypeScript 5.7 Release Notes",
                    url: "https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/",
                    snippet:
                      "TypeScript 5.7 introduces path rewriting for relative paths, checks for never-initialized variables, and improvements to the compiler performance.",
                  },
                  // 他の検索結果...
                ],
              }),
            },
          ],
        },
      ],
    },
  ],
  max_tokens: 2048,
  tools: [
    {
      type: "code_execution_20250825",
      name: "code_execution",
    },
    {
      name: "search_web",
      description: "Web search tool for finding information online.",
      input_schema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The search query to execute.",
          },
        },
        required: ["query"],
      },
      allowed_callers: ["code_execution_20250825"],
    },
  ],
});

console.log(JSON.stringify(response2, null, 2));
```

このコードを実行すると Claude はコードの実行結果をレスポンスとして返します。ツールの実行がさらに必要な場合は同様の手順で再度 API リクエストを行い、最終的な応答が生成されるまでこれを繰り返します。

```json
{
  "model": "claude-sonnet-4-5-20250929",
  "id": "msg_xxx",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "code_execution_tool_result",
      "tool_use_id": "srvtoolu_xxx",
      "content": {
        "type": "code_execution_result",
        "stdout": "{\"results\":[{\"title\":\"TypeScript 5.7 Release Notes\",\"url\":\"https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/\",\"snippet\":\"TypeScript 5.7 introduces path rewriting for relative paths, checks for never-initialized variables, and improvements to the compiler performance.\"},{\"title\":\"What's New in TypeScript\",\"url\":\"https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-7.html\",\"snippet\":\"New features include: path rewriting for --module node16 and --module nodenext, control flow narrowing improvements, and stricter checks.\"},{\"title\":\"TypeScript 5.6 Features\",\"url\":\"https://github.com/microsoft/TypeScript/releases/tag/v5.6.0\",\"snippet\":\"TypeScript 5.6 added disallowed nullish and truthy checks, iterator helper methods support, and region-prioritized diagnostics.\"}]}\n",
        "stderr": "",
        "return_code": 0,
        "content": []
      }
    }
  ]
}
```

## プログラムによるツール呼び出しのプラクティス

今回のような単純なウェブ検索の例ではあまりメリットを感じないでしょう。実際にシンプルな単一のツール呼び出しの場合は余分なオーバーヘッドが発生するのでプログラムによるツール呼び出しは推奨されません。プログラムによるツール呼び出しは以下のような場合に特に有用です。

- 集計や要約のみが必要な大規模データセットの処理
- 3 つ以上の依存ツール呼び出しを含むマルチステップのワークフロー
- ツール結果のフィルタリング・ソート・変換が必要な場合
- 中間結果が全く不要な場合
- 多数の項目にわたる並列処理

ツールの結果は JSON や XML のように構造化された形式で返すことが推奨されます。プログラミングによる解析処理をより信頼性高く実行できるようになるためです。またツールの説明では、ツールが返すデータの形式についても明確に説明することが重要です。

## まとめ

- MCP ツールの呼び出しはコンテキスト汚染や推論のオーバーヘッドなどの課題がある
- プログラムによるツール呼び出しはこれらの課題を解決するための有効なアプローチである
- Claude は Python プログラム実行環境上でツールを呼び出すことができる。これにより中間結果をコンテキストに追加せずに複数のツールを組み合わせた処理が可能になる
- プログラムによるツール呼び出しは複数のツールを組み合わせた複雑なワークフローに特に有用である

## 参考

- [Introducing advanced tool use on the Claude Developer Platform \ Anthropic](https://www.anthropic.com/engineering/advanced-tool-use)
- [Programmatic tool calling - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling)
- [Code execution tool - Claude Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)
