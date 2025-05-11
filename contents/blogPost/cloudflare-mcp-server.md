---
id: EwQpOxdfXXBqFU1CSTHHJ
title: "Cloudflare で MCP サーバーを構築する"
slug: "cloudflare-mcp-server"
about: "Model Context Protocol (MCP) の 2025-03-26 の仕様では新たに Streamable HTTP が追加され、リモート MCP サーバーへの注目が集まっています。この記事では `agents` フレームワークを使用して Cloudflare 上に MCP サーバーを構築する方法を紹介します。"
createdAt: "2025-05-11T12:08+09:00"
updatedAt: "2025-05-11T12:08+09:00"
tags: ["Cloudflare", "MCP", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4xJzE4PJ8vhaRFYNGGM177/4660ef668ed98c0ce47766edebac8a02/game_dice_illust_2691-768x576.png"
  title: "サイコロのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/1AvyWl7zsb911rb1NEtAiz/d868b21c2510d1099ebf9c28555748c9/Cloudflare%E3%81%A7MCP%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E6%A7%8B%E7%AF%89.wav"
selfAssessment:
  quizzes:
    - question: "MCPAgent クラスを継承したクラスで MCP サーバーのツールの定義を行うメソッドはどれですか？"
      answers:
        - text: "constructor"
          correct: false
          explanation: null
        - text: "start"
          correct: false
          explanation: null
        - text: "run"
          correct: false
          explanation: null
        - text: "init"
          correct: true
          explanation: null
published: true
---
[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) の 2025-03-26 の仕様では新たに Streamable HTTP が追加され、リモート MCP サーバーへの注目が集まっています。従来の MCP サーバーは stdio を使用してローカルで実行されることが一般的であったため、デスクトップアプリケーションや CLI ツールのみで利用されるなど、利用シーンが限られていました。

Streamable HTTP を使用することで、リモートの MCP サーバーを Web アプリケーションから利用されることが期待されます。Claude の Web 版ではリモート MCP サーバー経由で MCP サーバーにアクセスできるようになったことが発表されています。

https://www.anthropic.com/news/integrations

この記事では Cloudflare 上に MCP サーバーを構築する方法を紹介します。完成したコードは以下のリポジトリで確認できます。

https://github.com/azukiazusa1/my-mcp

## Cloudflare プロジェクトを作成する

まずは以下のコマンドを実行して Cloudflare プロジェクトを作成します。

```bash
npm create cloudflare@latest my-mcp-server
```

対話形式でプロジェクトの設定を行います。SSE での応答を行うために `Worker + Durable Objects` を選択します。

```bash
╭ Create an application with Cloudflare Step 1 of 3
│
├ In which directory do you want to create your application?
│ dir ./my-mcp-server
│
├ What would you like to start with?
│ category Hello World example
│
├ Which template would you like to use?
│ type Worker + Durable Objects
│
├ Which language do you want to use?
│ lang TypeScript
│
├ Copying template files
│ files copied to project directory
│
├ Updating name in `package.json`
│ updated `package.json`
│
┴ Installing dependencies  
```

続いて以下のパッケージをインストールします。

- `agents`: Cloudflare 上で AI エージェントを構築するためのフレームワーク
- `@modelcontextprotocol/sdk`: MCP の仕様を TypeScript で実装した SDK
- `zod`: バリデーションライブラリ。ツールのインターフェイスを定義するために使用する

```bash
npm install agents @modelcontextprotocol/sdk zod
```

## MCP ツールを実装する

MCP サーバーが提供するツールを実装します。ここではサイコロをランダムに振った値を返す `dice_roll` ツールを実装します。サイコロの面を指定するための `sides` 引数を受け取ります。

`MCPAgent` クラスを継承した `MyMcp` クラスを作成し、`init` メソッド内でツールを定義します。`src/MyMcp.ts` ファイルを作成し、以下のコードを追加します。

```ts:MyMcp.ts
import { McpAgent } from 'agents/mcp';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export class MyMCP extends McpAgent {
	server = new McpServer({
		name: 'MyMCP Server',
		version: '0.1.0',
	});

	async init() {
		this.server.tool(
			// ツールの名前
			'dice_roll',
			// ツールの説明
			'サイコロを降った結果を返します',
			// ツールの引数のスキーマ
			{ sides: z.number().min(1).max(100).default(6).describe('サイコロの面の数') },
			// ツールの実行関数
			async ({ sides }) => {
				// サイコロを振る
				const result = Math.floor(Math.random() * sides) + 1;
				// 結果を返す
				return {
					content: [{ type: 'text', text: result.toString() }],
				};
			}
		);
	}
}
```

エントリーポイントである `src/index.ts` ファイルを編集します。Cloudflare Workers では `fetch` 関数を使用してリクエストを受け取ります。

```ts:index.ts
import { MyMCP } from './MyMcp.js';

// Durable Objects のエクスポート
export { MyMCP };

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		// /sse エンドポイントの場合は SSE で応答する
		if (url.pathname === '/sse' || url.pathname === '/sse/message') {
			// @ts-ignore
			return MyMCP.serveSSE('/sse').fetch(request, env, ctx);
		}

		// /mcp エンドポイントの場合は Streamable HTTP で応答する
		if (url.pathname === '/mcp') {
			// @ts-ignore
			return MyMCP.serve('/mcp').fetch(request, env, ctx);
		}

		return new Response('Not found', { status: 404 });
	},
};
```

`MyMCP` クラスの `serve()` メソッドを使用すると MCP サーバーを Streamable HTTP で起動できます。後方互換性のために SSE での応答もサポートする必要があります。`/sse` エンドポイントでは SSE での応答を行い、`/mcp` エンドポイントでは Streamable HTTP での応答を行います。

最後に Durable Objects を使用するために `wrangler.jsonc` を編集します。`McpAgent` クラスを使用する場合には、`MCP_OBJECT` という名前を指定する必要があります。

```jsonc:wrangler.jsonc
{
  "migrations": [
		{
			"new_sqlite_classes": [
				"MyMCP"
			],
			"tag": "v1"
		}
	],
	"durable_objects": {
		"bindings": [
			{
				"class_name": "MyMCP",
				"name": "MCP_OBJECT"
			}
		]
	},
}
```

## ローカルで実行する

以下のコマンドでローカルでサーバーを実行します。

```bash
npm run dev
```

?> `Uncaught Error: No such module "node:async_hooks".` というエラーが発生する場合は `wrangler.jsonc` に `"compatibility_flags": ["nodejs_compat"],` を追加してください。

正しく MCP サーバーを構築できているか確認するために [MCP Inspector](https://github.com/modelcontextprotocol/inspector) を使用しましょう。これは GUI ベースで MCP サーバーのデバッグを行うためのツールです。

```bash
npx @modelcontextprotocol/inspector
```

http://127.0.0.1:6274 にアクセスして MCP Inspector を開きます。「Transport Type」で「Streamable HTTP」を選択し、URL 欄に ` http://localhost:8787/mcp` を入力して「Connect」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/3oTi1vl2Dm9aBy5ry2y9BX/b3a1d99fd8d4544b9338247c67c3da95/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_14.46.29.png)

「List Tools」ボタンをクリックすると、実装した `dice_roll` ツールが表示されます。「Run Tool」ボタンをクリックすると、ツールを実行できます。結果が表示されていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/6KOlgmRuIE40smYXc9EE6N/f0df667c8d92948fd02619811191c76f/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_14.56.47.png)

同様に `/sse` エンドポイントでも動作することを確認します。「Transport Type」を「SSE」に変更し、URL 欄に ` http://localhost:8787/sse` を入力して「Connect」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2DSzQEAiSvBx3gSPFhW63B/bd529a4de85ffcd913e872f4d58ee875/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_14.58.21.png)

## デプロイする

ローカルで動作することが確認できたら、Cloudflare にデプロイしましょう。以下のコマンドを実行します。

```bash
npm run deploy
```

ブラウザが起動し Cloudflare へのログインが求められます。ログインが完了するとターミナル上でデプロイが実行されます。

```bash
npm run deploy

> my-mcp-server@0.0.0 deploy
> wrangler deploy


 ⛅️ wrangler 4.14.4
-------------------

Attempting to login via OAuth...
Opening a link in your default browser: https://dash.cloudflare.com/oauth2/auth...
Successfully logged in.
Total Upload: 477.30 KiB / gzip: 89.85 KiB
Worker Startup Time: 23 ms
Your Worker has access to the following bindings:
- Durable Objects:
  - MCP_OBJECT: MyMCP
Uploaded my-mcp-server (2.04 sec)
Deployed my-mcp-server triggers (0.91 sec)
  https://my-mcp-server.azukiazusa.workers.dev
```

デプロイが完了すると、URL が表示されます。MCP Inspector を使用して、デプロイした MCP サーバーに接続してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/75PAJQRaSmclXTDN81GTqR/9292f580667f5e11ba0ab67fed0a67db/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_15.04.21.png)

[Workers AI LLM Playground](https://playground.ai.cloudflare.com/) を使用して LLM とリモート MCP サーバーの連携を試すことができます。「MCP Server」の URL 欄に `https://${your-subdomain}.workers.dev/sse` を入力します（Streamable HTTP はまだサポートされていません）。

「100 面のサイコロを振ってください」といったプロンプトを入力すると、`dice_roll` ツールが実行され、結果が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/NB3z9H3ShAoAMRS3iggdM/843adc6bd0e905a346690ca7788956f9/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-11_15.19.52.png)

## まとめ

- `agents` パッケージを使用すると Cloudflare 上で簡単に MCP サーバーを構築できる
- `McpAgent` クラスを継承したクラスを作成し、`init` メソッド内でツールを定義する
- Durable Objects を使用する場合は `wrangler.jsonc` に `MCP_OBJECT` を指定する
- `McpAgent.serve()` メソッドを使用すると MCP サーバーを Streamable HTTP で起動できる
- `McpAgent.serveSSE()` メソッドを使用すると MCP サーバーを SSE で起動できる
- MCP Inspector を使用すると MCP サーバーのデバッグができる

## 参考

- [Model Context Protocol (MCP) · Cloudflare Agents docs](https://developers.cloudflare.com/agents/model-context-protocol/)
- [ai/demos/remote-mcp-authless at main · cloudflare/ai](https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless)
- [Bringing streamable HTTP transport and Python language support to MCP servers](https://blog.cloudflare.com/streamable-http-mcp-servers-python/)
