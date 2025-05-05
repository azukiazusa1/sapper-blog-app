---
id: xyMHHkW4Pd4GOcNQivNmQ
title: "ESLint を MCP サーバーとして実行する"
slug: "eslint-mcp-server"
about: "ESLint v9.26.0 から MCP サーバーとして実行できるようになりました。この機能により LLM（大規模言語モデル）は ESLint のルールを使用してコードを修正することができるようになります。"
createdAt: "2025-05-05T10:45+09:00"
updatedAt: "2025-05-05T10:45+09:00"
tags: ["ESLint", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/iFj0JvsOfryxagRodV47B/cabc99f44c13d3b87258af2b049caafd/nasu_tempura_14648-768x768.png"
  title: "ナスの天ぷらのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/6wZK9ZiygLf4vywEhr1Hb6/821ac8742e3e3117329791bdcb09d2a5/ESLint_MCP_%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E6%B4%BB%E7%94%A8%E3%82%AC%E3%82%A4%E3%83%89.wav"
selfAssessment:
  quizzes:
	  - question: "ESLint の MCP サーバーが提供しているツールとして正しいものはどれですか？"
			answers:
				- text: "lint-files"
					correct: true
					explanation: "lint-files ツールはファイルのパスを引数に取り、ESLint を実行して結果を返します。"
				- text: "fix-issues"
					correct: false
					explanation: ""
				- text: "explain-lint-issues"
					correct: false
					explanation: ""
				- text: "lint-and-fix-files"
					correct: false
					explanation: ""

published: true
---

ESLint v9.26.0 から、ESLint を[MCP（Model Context Protocol]([feat: Add MCP server by nzakas · Pull Request #19592 · eslint/eslint](https://github.com/eslint/eslint/pull/19592/files)) サーバーとして実行できるようになりました。この機能により LLM（大規模言語モデル）は ESLint のルールを使用してコードを修正できるようになります。

## ESLint を MCP サーバーとして実行する

MCP サーバーとして ESLint を実行するには、`--mcp` オプションを使用します。

```bash
npx eslint --mcp
```

このコマンドを実行すると stdio transport を使用して MCP サーバーが起動します。

```bash
ESLint MCP server is running. cwd: /path/to/your/project
```

ESLint の MCP サーバーがどのようなツールを提供しているのか [MCP Inspector](https://github.com/modelcontextprotocol/inspector) を使用して確認してみましょう。これは GUI ベースで MCP サーバーのデバッグを行うためのツールです。`npx @modelcontextprotocol/inspector` コマンドの後に MCP サーバーを起動するコマンドを渡して対象の MCP サーバーをデバッグします。

```bash
npx @modelcontextprotocol/inspector npx eslint --mcp
```

http://127.0.0.1:6274 にアクセスして MCP Inspector を開きます。「Transport Type」から「stdio」を選択し、「Command」欄に `npx`、「Arguments」欄に `eslint --mcp` が入力されていることが確認できたら「Connect」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/18TMR7lghoY5BBw2BJJzXr/db555efd005b9d8e4fc382110f65ee11/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-05_11.10.33.png)

「Tools」タブを選択して「List Tools」ボタンをクリックすると、ESLint の MCP サーバーが提供しているツールの一覧が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5dk6rDSc787sCZcEQBhgiM/e6e8b92ae13ed887d0d8cd83f5f00e1c/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-05_11.12.51.png)

ESLint の MCP サーバーは以下のツールを提供していることが確認できました。

- `lint-files`：Lint files using ESLint. You must provide a list of absolute file paths to the files you want to lint. The absolute file paths should be in the correct format for your operating system (e.g., forward slashes on Unix-like systems, backslashes on Windows).

## コーディングエージェントから ESLint MCP サーバーを使用する

コーディングエージェントである Cline から ESLint の MCP サーバーを使用して、コードを生成する際に ESLint のルールに従うように指示してみましょう。「MCP Servers」から「Installed」タブを選択し、「Configure MCP Server」ボタンをクリックします。


MCP サーバーの設定ファイルが JSON 形式で表示されるので、以下のように `eslint` を追加します。

```json
{
	"mcpServers": {
		"eslint": {
			"command": "npx",
			"args": ["eslint", "--mcp"],
			"env": {}
		}
	}
}
```

設定が正しく追加されていれば一覧に「eslint」が表示されます。

「プロジェクトの ESLint エラーを修正してください」というプロンプトを入力してみましょう。Cline は ESLint を実行するために MCP で提供されたツールを使用することを要求します。ツール `lint-files` をプロジェクトのファイルの一覧を引数に渡して実行しようとしています。

![](https://images.ctfassets.net/in6v9lxmm5c8/666Vcqoiay4NFjrjDZ30uj/79fe147669e25fa6d9afdb59c32233ba/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-05_11.39.45.png)

MCP サーバーからは以下のようなレスポンスが返ってきます。

```txt
Here are the results of running ESLint on the provided files: 

{"filePath":"/sapper-blog-app/packages/content-management/src/api.spec.ts","messages":\[],"suppressedMessages":\[{"ruleId":"@typescript-eslint/no-explicit-any","severity":2,"message":"Unexpected any. Specify a different type.","line":619,"column":49,"nodeType":"TSAnyKeyword","messageId":"unexpectedAny","endLine":619,"endColumn":52,"suggestions":\[{"messageId":"suggestUnknown","fix":{"range":\[15585,15588],"text":"unknown"},"desc":"Use \`unknown\` instead, this will force you to explicitly, and safely assert the type is correct."},{"messageId":"suggestNever","fix":{"range":\[15585,15588],"text":"never"},"desc":"Use \`never\` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."}],"suppressions":\[{"kind":"directive","justification":""}]},{"ruleId":"@typescript-eslint/no-explicit-any","severity":2,"message":"Unexpected any. Specify a different type.","line":678,"column":48,"nodeType":"TSAnyKeyword","messageId":"unexpectedAny","endLine":678,"endColumn":51,"suggestions":\[{"messageId":"suggestUnknown","fix":{"range":\[17129,17132],"text":"unknown"},"desc":"Use \`unknown\` instead, this will force you to explicitly, and safely assert the type is correct."},{"messageId":"suggestNever","fix":{"range":\[17129,17132],"text":"never"},"desc":"Use \`never\` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."}],"suppressions":\[{"kind":"directive","justification":""}]},{"ruleId":"@typescript-eslint/no-explicit-any","severity":2,"message":"Unexpected any. Specify a different type.","line":688,"column":49,"nodeType":"TSAnyKeyword","messageId":"unexpectedAny","endLine":688,"endColumn":52,"suggestions":\[{"messageId":"suggestUnknown","fix":{"range":\[17545,17548],"text":"unknown"},"desc":"Use \`unknown\` instead, this will force you to explicitly, and safely assert the type is correct."},{"messageId":"suggestNever","fix":{"range":\[17545,17548],"text":"never"},"desc":"Use \`never\` instead, this is useful when instantiating generic type parameters that you don't need to know the type of."}],"suppressions":\[{"kind":"directive","justification":""}]}],"errorCount":0,"fatalErrorCount":0,"warningCount":0,"fixableErrorCount":0,"fixableWarningCount":0,"usedDeprecatedRules":\[]} 

{"filePath":"/sapper-blog-app/packages/content-management/src/api.ts","messages":\[],"suppressedMessages":\[],"errorCount":0,"fatalErrorCount":0,"warningCount":0,"fixableErrorCount":0,"fixableWarningCount":0,"usedDeprecatedRules":\[]}

{"filePath":"/sapper-blog-app/packages/content-management/src/datetime.spec.ts","messages":\[],"suppressedMessages":\[],"errorCount":0,"fatalErrorCount":0,"warningCount":0,"fixableErrorCount":0,"fixableWarningCount":0,"usedDeprecatedRules":\[]}
```

ファイルパスごとに ESLint を実行した結果が JSON 形式で返ってきます。Cline はこの結果を元に ESLint のエラーを修正するためのコードを生成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6oqB8fqAYUVuogubYwt0Uq/a8cc2e8b381094ebbc8be5a063cc41a3/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-05_11.45.12.png)

## まとめ

- ESLint v9.26.0 から ESLint を MCP サーバーとして実行できるようになった
- ESLint の MCP サーバーは `lint-files` ツールを提供している。`lint-files` ツールはファイルのパスを引数に取り、ESLint を実行して結果を返す
- Cline などのコーディングエージェントは ESLint の MCP サーバーを使用してコードを修正することができる

## 参考

- [MCP Server Setup - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/mcp)
- [ESLint v9.26.0 released - ESLint - Pluggable JavaScript Linter](https://eslint.org/blog/2025/05/eslint-v9.26.0-released/)
- [feat: Add MCP server by nzakas · Pull Request #19592 · eslint/eslint](https://github.com/eslint/eslint/pull/19592)
