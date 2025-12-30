---
id: nE0Q9vOHY10e2ANbfsQGd
title: "Claude Code のツール検索ツールを有効にして MCP のトークン使用量を削減する"
slug: "enable-claude-code-tool-search-to-reduce-mcp-token-usage"
about: "Claude Code のツール検索ツールを有効にすることで、MCP ツールの定義を事前にコンテキストウィンドウに読み込まず、必要に応じて動的にツールを検索・呼び出しできます。これにより、多数の MCP ツールをインストールしている場合でもトークン使用量を大幅に削減できる可能性があります。この記事では Claude Code のツール検索ツールの概要と使用方法を紹介します。"
createdAt: "2025-12-30T14:32+09:00"
updatedAt: "2025-12-30T14:32+09:00"
tags: ["claude-code", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3e6uvd4NOdnb4DZMm4eEOG/1fe143e6637dc03d16845f4e29a7f3e4/ramen-without-toppings_22851-768x630.png"
  title: "具無しラーメンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code でツール検索ツールを有効にするために設定する環境変数はどれですか？"
      answers:
        - text: "ENABLE_TOOL_SEARCH=true"
          correct: true
          explanation: "ENABLE_TOOL_SEARCH=true を設定して Claude Code を起動することで、ツール検索ツールが有効化されます。"
        - text: "TOOL_SEARCH_ENABLED=true"
          correct: false
          explanation: "正しい環境変数名は ENABLE_TOOL_SEARCH です。"
        - text: "MCP_TOOL_SEARCH=true"
          correct: false
          explanation: null
        - text: "CLAUDE_TOOL_SEARCH=true"
          correct: false
          explanation: null
    - question: "MCPSearch ツールの Keyword Search モードで返される関連ツールの最大件数はいくつですか？"
      answers:
        - text: "3 件"
          correct: false
          explanation: null
        - text: "5 件"
          correct: true
          explanation: "Keyword Search モードでは、キーワードに基づいて最大 5 件の関連ツールが返されます。"
        - text: "10 件"
          correct: false
          explanation: null
        - text: "無制限"
          correct: false
          explanation: null
published: true
---
Claude の[ツール検索ツール](https://platform.claude.com/docs/ja/agents-and-tools/tool-use/tool-search-tool) は Claude がすべてのツール定義を事前にコンテキストウィンドウに読み込むのではなく、必要に応じてツールを検索・呼び出すことができる機能です。これにより、不必要なツール定義がコンテキストウィンドウに含まれてコンテキストを圧迫する問題を回避できます。

2025 年 12 月現在、環境変数 `ENABLE_TOOL_SEARCH=true` を有効にすることで実験的に Claude Code でツール検索ツールが利用可能になっています。これにより MCP ツールの定義が事前にコンテキストウィンドウに含まれなくなるため、MCP ツールを多数インストールしている場合でもトークン使用量を大幅に削減できる可能性があります。

この記事では Claude Code のツール検索ツールについて紹介します。

## ツール検索ツールを有効にする

LLM が効果的にタスクを遂行するためには必要な情報のみを選択してコンテキストとして提供することが重要であることが知られています。LLM の入力トークンが増加するにつれて LLM のパフォーマンスが低下すると指摘されており、タスクの達成のために不必要な情報をコンテキストに含めることは [コンテキストの腐敗 Context rot](https://research.trychroma.com/context-rot) と呼ばれる問題の一因となります。

Claude Code では [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) を使用して外部システムと接続しより高度なタスクを実行できます。MCP ツールは Claude Code に対してさまざまな機能を提供しますが、MCP ツールの定義は通常コンテキストウィンドウに事前に読み込まれます。そのため、多数の MCP ツールをインストールしている場合、タスクの遂行に不要なツール定義がコンテキストウィンドウを圧迫し、トークン使用量が増加する可能性があります。

例えば `playwright`, `next-devtools`, `serena` の 3 つの MCP ツールをインストールしている場合、これらのツール定義は合計で約 39,000 トークンに達し、コンテキストウィンドウ全体の約 20% を占めています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6XZ0ho4YqgHawEunmuAAfk/403a06c467df8da2f5e4c388ceb084c6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-30_14.59.05.png)

このような問題を解決するために `/mcp` コマンドを実行して手動で MCP サーバーの有効・無効を切り替える必要がありました。

ツール検索ツールを有効にすると、Claude Code はすべての MCP ツール定義を事前にコンテキストウィンドウに読み込まなくなります。代わりにタスクの遂行に必要なツールを動的に検索・呼び出しを行います。環境変数 `ENABLE_TOOL_SEARCH=true` を設定して Claude Code を起動することでツール検索ツールが有効化されます。

```bash
ENABLE_TOOL_SEARCH=true claude
```

`/context` コマンドを実行してコンテキストウィンドウの内容を確認すると、MCP ツールの定義が含まれていないことがわかります。MCP Tools セクションには変わらずに MCP ツールが一覧表示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/2G6lGeKssz7JZdvhX5g75q/139564fddc7f017401fe60ab1d033a37/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-30_15.03.38.png)

MCP ツールが必要なタスクを Claude に指示してみましょう。PlayWright ツールを使用して特定の URL のスクリーンショットを取得するタスクを依頼してみます。

```txt
「プロジェクト管理ボード」のページにアクセスして、そのスクリーンショットを取得してください。
```

Claude は `MCPSearch(...)` ツールを使用してツールの検索を開始しました。`"chrome tabs"` というキーワードでツールを検索し、PlayWright ツールを見つけ出しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6fx4whPCktFanUkyIgV3Vk/9b5da66e7833700f3c09357322389d0f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-30_15.07.03.png)

`MCPSearch` ツールには以下の 2 つのクエリモードが用意されています。

1. Direct Selection（`select:<tool_name>`: ツール名を直接指定してツールを選択する（例: `query: "select:mcp__playwright__browser_navigate"`）
2. Keyword Search: どのツールを使用すべきかを判断できない場合にキーワードでツールを検索する（例: `query: "screenshot"`）。最大 5 件の関連ツールが返される

その後は通常通り `playwright - Manage tabs` ツールを使用して Chrome のタブを開きました。更に特定の URL にナビゲートするために追加のツールを検索しています。

最終的に使用された MCP ツールは `/context` コマンドで確認できます。MCP Tools セクションの Loaded セクションに 4 つのツールが表示されています。使用された MCP ツールのトークン量は約 2,800 トークンに抑えられていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1RUoqOiHSx7eZpMGOarqXA/e61de93a1cd995e5fe06ca3f26081074/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-12-30_15.17.35.png)

## まとめ

- Claude Code のツール検索ツールを有効にすることで、MCP ツールの定義が事前にコンテキストウィンドウに含まれなくなり、必要に応じて動的にツールを検索・呼び出しできるようになる
- `ENABLE_TOOL_SEARCH=true` 環境変数を設定して Claude Code を起動することでツール検索ツールが有効化される
- Claude は `MCPSearch(...)` ツールを使用して必要な MCP ツールを検索・呼び出しできる
- ツールを検索するためのクエリモードには、ツール名を直接指定する Direct Selection とキーワードで検索する Keyword Search の 2 種類がある

## 参考

- [Support Tool Search and Programmatic Tool Use betas for reduced token consumption · Issue #12836 · anthropics/claude-code](https://github.com/anthropics/claude-code/issues/12836)
- [Tool Search Tool - Claude Platform](https://platform.claude.com/docs/ja/agents-and-tools/tool-use/tool-search-tool)
