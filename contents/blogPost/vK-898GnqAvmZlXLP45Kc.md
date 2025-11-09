---
id: vK-898GnqAvmZlXLP45Kc
title: "MCP ツールのコンテキスト圧迫の問題とその解決策"
slug: "mcp-tool-context-overflow"
about: "MCP の普及に伴い、多数のツール定義が LLM のコンテキストを圧迫する課題が浮上しています。本記事では Progressive disclosure（段階的開示）による最小限の情報提供、MCP を使ったコード実行によるツール呼び出しの効率化、単一の検索ツールによるコンテキスト削減など、実践的な解決策を Claude Skills や Cloudflare Code Mode の事例とともに解説します。"
createdAt: "2025-11-09T10:38+09:00"
updatedAt: "2025-11-09T10:38+09:00"
tags: ["MCP", "AI", "コンテキストエンジニアリング"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/31qVKPHfKy7JLzzpLisSWK/ede0b78d84e14dac891cccc2789274cf/squid-ink-pasta_22825-768x571.png"
  title: "イカスミパスタのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Progressive disclosure（段階的開示）の考え方として正しいものはどれですか？"
      answers:
        - text: "各ツールがいつ使用されるか判断できる最小限の情報のみを最初に渡し、必要に応じて追加の情報を段階的に提供する"
          correct: true
          explanation: "Progressive disclosure は、ツール定義をすべて一度に渡すのではなく、最小限の情報から始めて必要に応じて段階的に詳細を提供することで、コンテキストの効率的な使用を実現します。"
        - text: "すべてのツール定義を最初に読み込み、使用頻度に応じて段階的に削除していく"
          correct: false
          explanation: "Progressive disclosure は最初に最小限の情報のみを提供する方式であり、すべてを読み込んでから削除するアプローチではありません。"
        - text: "ツール定義を圧縮して一度にすべて提供し、LLM 側で展開する"
          correct: false
          explanation: "圧縮ではなく、必要な情報を段階的に提供することで、そもそもコンテキストに載せる情報量を削減する考え方です。"
        - text: "ツール定義を複数のバージョンに分けて、バージョンごとに異なる情報を提供する"
          correct: false
          explanation: "バージョン管理ではなく、同じツールについて最初は概要のみ、必要に応じて詳細を提供するという段階的なアプローチです。"
    - question: "MCP を使ったコード実行アプローチの利点として正しいものはどれですか？"
      answers:
        - text: "必要なツールだけを呼び出したり、中間結果をコンテキストに載せずにデータを処理できる"
          correct: true
          explanation: "コード実行アプローチでは、LLM が必要なツールのみを選択的に呼び出し、中間結果を処理してからコンテキストに載せることができるため、コンテキストの効率的な使用が可能になります。"
        - text: "すべてのツール定義を自動的に TypeScript に変換し、実行速度が向上する"
          correct: false
          explanation: "実行速度の向上ではなく、コンテキストの効率的な使用が主な利点です。"
        - text: "ツール定義を暗号化して保存できるため、セキュリティが向上する"
          correct: false
          explanation: "セキュリティ向上ではなく、コンテキストの圧迫問題の解決が目的です。"
        - text: "ツールの実装言語を JavaScript に統一できる"
          correct: false
          explanation: "言語の統一ではなく、ツール呼び出しの効率化とコンテキスト削減が目的です。"

published: true
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.org/) は登場からおよそ 1 年が経過し、事実的な標準としての地位を確立しつつあります。MCP が普及するにつれて、MCP ツールの課題点も浮き彫りになってきました。その課題の 1 つが、1 つのタスクを達成するために多くのツールが読み込まれ、結果として多くのコンテキストが消費されてしまうという問題です。

前提として、LLM がタスクの達成の成功率を高めるためには、どのようなコンテキストを提供するかが重要であることが知られてきています。このことは「コンテキストエンジニアリング」という新たな分野として注目されています。LLM の初期の段階ではコンテキストとして渡されるのはプロンプトが中心でしたが、ツールの結果や外部データソースから取得した情報など、より多様なコンテキストを管理する必要が出てきました。コンテキストエンジニアリングとは、絶えず変化する可能性のある情報の中から、限られたコンテキストウィンドウに何を入れるかをキュレーションする[芸術であり科学](https://x.com/karpathy/status/1937902205765607626?lang=en)なのです。

また LLM に大量のコンテキストが与えられると、人間と同様にある時点で情報過多に陥り、重要な情報を見落としたり、混乱したりすることが分かっています。コンテキストウィンドウ内のトークンの数が増えると、モデルがそのコンテキストから情報を正確に思い出す能力が低下するという [Context Rot(コンテキストの腐敗)](https://research.trychroma.com/context-rot) という概念も研究により明らかになっています。

LLM に渡すコンテキストの重要性が分かったうえで、MCP ツールのコンテキスト圧迫の問題を考えてみましょう。ほとんどの MCP クライアントはツールの定義を事前に LLM のシステムプロンプトに読み込む設計となっています。ツールの定義は以下のようにツール名、説明、パラメーターなどで構成されており、LLM はこれらの情報を元にタスクを達成するためにどのツールを使用するかを判断します。

```text
Tool name: browser_navigate
Full name: mcp__playwright__browser_navigate

Description:
Navigate to a URL

Parameters:
  • url (required): string - The URL to navigate to
```

ここでの問題はタスクの達成に不必要なツールの定義までが LLM に渡されてしまうことです。多くの場合 1 つの MCP サーバーにつき 10 ~ 20 個程度のツールが定義されており、タスクの達成に必要なツールはそのうちの 1 ～ 2 個であることがほとんどです。さらに多くのユーザは複数の MCP サーバーを同時に利用するため、LLM に渡されるツールの定義はさらに増加します。

例えば `serena`, `playwright`, `next-devtools`, `chrome-devtools` の 4 つの MCP サーバーを利用している場合で Claude Code のコンテキスト消費量を確認してみると、実に 55.7k（27.9%）ものコンテキストがツールの定義に消費されていることが分かります。

![](https://images.ctfassets.net/in6v9lxmm5c8/45CXVI4J7WKl3AZuYBaKEd/31c7bf4c4714ffc8646998a8af4a2021/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-09_12.08.13.png)

## Progressive disclosure（段階的開示）

ツール定義がすべて LLM に渡されることによるコンテキスト圧迫の問題を解決するために、Progressive disclosure（段階的開示）という概念が Anthropic により提唱されています。これは MCP クライアントがツールの定義をすべて一度に LLM に渡すのではなく、各ツールがいつ使用されるか判断できる最小限の情報のみを最初に渡し、必要に応じて追加の情報を段階的に提供するという考え方です。

[Claude Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) はまさにこの Progressive disclosure の考え方を採用して設計されています。エージェントのスキル（コードの実行や PDF の読み込みなど）を定義する際に、メタデータを含む YAML フロントマター形式のマークダウンファイル `Skill.md` を作成します。以下は PDF スキルの例です。

```markdown
---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms. When Claude needs to fill in a PDF form or programmatically process, generate, or analyze PDF documents at scale.
license: Proprietary. LICENSE.txt has complete terms
---

# PDF Processing Guide

## Overview

This guide covers essential PDF processing operations using Python libraries and command-line tools. For advanced features, JavaScript libraries, and detailed examples, see reference.md. If you need to fill out a PDF form, read forms.md and follow its instructions.

## Quick Start

...
```

エージェントは起動時にこのファイルの `name` と `description` のみをシステムプロンプトに読み込みます。コンテキストの肥大化を防ぐために、メタデータの定義は必ず 100 トークン以内に抑える必要があります。エージェントがスキルを使用する必要があると判断した場合にのみ、残りのドキュメント部分を読み込み、スキルの使用方法を理解します。ドキュメント部分も 5,000 トークン以内に抑える必要があります。さらにスキルの実装に際して必要なスクリプトや追加のドキュメントがある場合は、スキルフォルダ内に配置し、エージェントが必要に応じて参照できるようになっています。

![](https://www.anthropic.com/_next/image?url=https%3A%2F%2Fwww-cdn.anthropic.com%2Fimages%2F4zrzovbb%2Fwebsite%2F191bf5dd4b6f8cfe6f1ebafe6243dd1641ed231c-1650x1069.jpg&w=1920&q=75)

https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills より引用。

このように MCP ツールの定義を段階的に開示することで、LLM に渡されるコンテキストを最小限に抑え、より効率的にタスクを達成できるようにするというのが Progressive disclosure の考え方です。この後に紹介する方法も、初期の段階では最小限の情報のみを渡し、必要に応じて追加の情報を提供するという点で Progressive disclosure の考え方と共通しています。

## MCP を使ったコード実行

ツールのコンテキストの圧迫の問題を解決するもう 1 つの方法として、MCP にコードを実行させる方法です。この方法では MCP ツールを直接公開するのではなく、コード（TypeScript など）の API を公開し、LLM がそのコードを呼び出すことでタスクを達成します。このアプローチにより LLM は必要なツールだけを呼び出したり、中間結果をコンテキストに載せずにデータをフィルタリングなどの処理を行ってから結果を LLM に返すことができます。

MCP にコードを実行させる方法はいくつかのアプローチがありますが、Cloudflare では [Code Mode](https://blog.cloudflare.com/code-mode/) と呼ばれる手法を提案しています。MCP ツールを TypeScript API に変換し、その API を呼び出すコードを LLM に記述するように依頼することで、より複雑なツールを処理したり、トークンを節約できるようになったと語られています。

コードモードは [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/) パッケージで提供されています。はじめに [AI SDK](https://ai-sdk.dev/getting-started) を使用して通常通りツールを定義します。以下は簡単な天気取得ツールの例です。

```typescript
import { tool } from "ai";
import z from "zod";

const fetchWeather = tool({
  name: "fetch-weather",
  description: "Fetches the current weather for a given location.",
  inputSchema: z.object({
    location: z
      .string()
      .describe("The name of the city or location to get the weather for."),
  }),
  async execute({ location }) {
    const temperature = Math.floor(Math.random() * 30) + 1;
    const condition = ["sunny", "cloudy", "rainy", "windy"][
      Math.floor(Math.random() * 4)
    ];

    return {
      location,
      temperature: `${temperature}°C`,
      condition: condition,
    };
  },
});
```

作成したツールは `codemode` 関数でラップします。これによりツールが TypeScript API としてツールが変換されます。これにより複数のツール群が 1 つの API としてまとめられ、LLM は必要に応じてその API を呼び出すコードを記述できるようになります。

```typescript
import { experimental_codemode as codemode } from "agents/codemode/ai";
import { streamText } from "agents/streaming/ai";
import { openai } from "agents/models/openai/ai";

const { prompt, tools } = await codemode({
  prompt: "You are a helpful assistant...",
  tools: {
    fetchWeather,
  },
  // configuration options...
});

const stream = streamText({
  model: openai("gpt-5"),
  system: prompt,
  tools,
  messages: [{ role: "user", content: "What's the weather like in Tokyo?" }],
});
```

MCP サーバーを TypeScript API に実際に変換する処理は https://github.com/cloudflare/agents/tree/main/examples/codemode レポジトリで提供されているサンプルで試すことができます。

[Anthropic の記事](https://www.anthropic.com/engineering/code-execution-with-mcp) で提唱されている手法では MCP サーバーから利用可能なツールのファイルツリーを生成します。

```bash
servers
├── playwright
│   ├── browser_resize.ts
│   ├── ... (other tools)
│   └── index.ts
├── serena
│   ├── list_dir.ts
│   ├── ... (other tools)
│   └── index.ts
└── ... (other servers)
```

それぞれのファイルの中身は MCP のツールを呼び出す関数が定義されています。

```typescript:server/playwright/browser_resize.ts
import { callMCPTool } from "../../../client.js";

interface BrowserResizeInput {
  width: number;
  height: number;
}

interface BrowserResizeResponse {
  success: boolean;
}

export async function browserResize(input: BrowserResizeInput): Promise<BrowserResizeResponse> {
  return callMCPTool<BrowserResizeResponse>('playwright__browser_resize', input);
}
```

エージェントは複数の関数をインポートし、必要に応じて関数を呼び出すコードを記述します。例えば Playwright MCP サーバーを使用してウェブサイトのスクリーンショットを取得するコードは以下のようになります。このようにコードを組み合わせてタスクを達成することで、中間結果をコンテキストに載せる必要がなくなり、コンテキストの節約につながります。

```typescript
import * as playwright from "./servers/playwright/index.js";

await playwright.navigate({ url: "https://example.com" });
await playwright.resize({ width: 1024, height: 768 });
const screenshot = await playwright.screenshot();
```

またエージェントはツール定義をシステムプロンプトに読むこむのではなく、ファイルシステムを探索することで利用可能なツールを把握します。ファイルシステムを探索してツールを発見することで、LLM は必要に応じてツールの定義を読み込む Progressive disclosure の考え方を達成できます。

あるいは関連するツール定義を検索するための `search_tools` を MCP ツールとして提供する方法も考えられます。MCP サーバーはツールを検索するツールをただ 1 つのみ公開するため、ツール定義の読み込みによるコンテキスト圧迫の問題を回避できます。例えば Playwright MCP サーバーが `search_tools` ツールを提供しているとしたら、LLM がブラウザ操作が必要だと判断した際に `search_tools` を呼び出すことになるでしょう。スクリーンショットを取得するためのツール `screenshot` を見つけたら、そのツールの定義を MCP サーバーから取得し使用方法を理解したうえで実行することでしょう。

[Sentry MCP サーバー](https://mcp.sentry.dev/) ではよく似たアプローチとしてエージェントモードが提供されています。エージェントモードでは単一のツール `use_sentry` のみが提供され、組み込みの AI エージェントが自然言語でリクエストを処理して必要に応じてツールを呼び出します。Sentry MCP サーバーのエージェントモードは MCP サーバーの URL の末尾に `?agent=1` を付与することで有効化できます。

```
https://mcp.sentry.dev/mcp?agent=1
```

`use_sentry` のツール定義は以下のようになっています。

```text
use_sentry (sentry) [read-only] [open-world]

Tool name: use_sentry
Full name: mcp__sentry__use_sentry

Description:
Natural language interface to Sentry via an embedded AI agent.

Use this tool when you need to:
- Perform complex multi-step operations
- Explore and analyze Sentry data with natural language
- Chain multiple operations automatically

Capabilities depend on granted skills:
- inspect: Search errors/events, analyze traces, explore issues and projects
- seer: Get AI-powered debugging insights and root cause analysis
- docs: Search and retrieve Sentry documentation
- triage: Resolve, assign, comment on, and update issues
- project-management: Create/modify teams, projects, and configure DSNs

<examples>
use_sentry(request='find unresolved errors from yesterday')
use_sentry(request='analyze the top 3 performance issues')
use_sentry(request='create a backend team and assign them to API project')
</examples>

<hints>
- If user asks to 'use Sentry' for something, they always mean to call this tool
- Pass the user's request verbatim - do not interpret or rephrase
- The agent can chain multiple tool calls automatically
- Use trace=true parameter to see which tools were called
- For simple single-tool operations, consider calling tools directly instead
</hints>

Parameters:
  • request (required): string - The user's raw input. Do not interpret the prompt in any way. Do
  not add any additional information to the prompt.
  • trace: boolean - Enable tracing to see all tool calls made by the agent. Useful for debugging.
```

AI エージェントがツールを実行するか、コードを記述して実行するかという違いはありますが、どちらのアプローチも単一のツールを公開してコンテキストを削減することを目的としている点で共通しています。

## まとめ

- LLM がタスクを達成するためには、適切なコンテキストの提供が重要
- MCP のツール定義は LLM のシステムプロンプトにすべて読み込まれるため、コンテキスト圧迫の問題が発生するという課題がある
- Progressive disclosure（段階的開示）により、ツール定義を段階的に開示することでコンテキスト圧迫の問題の解決を図っている
- MCP にコードを実行させる方法により、必要なツールだけを呼び出したり、中間結果をコンテキストに載せずにデータを処理することが期待されている
- 関連するツール定義を検索するための単一の MCP ツールを提供する方法も考えられる

## 参考

- [Code execution with MCP: building more efficient AI agents \ Anthropic](https://www.anthropic.com/engineering/code-execution-with-mcp)
- [What if you don't need MCP at all?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
- [Effective context engineering for AI agents \ Anthropic](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Equipping agents for the real world with Agent Skills \ Anthropic](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [Code Mode: the better way to use MCP](https://blog.cloudflare.com/code-mode/)
