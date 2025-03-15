---
id: vDOCuTH1v7fx6WAr89BAH
title: "TypeScript で MCP サーバーを実装し、Claude Desktop から利用する"
slug: "typescript-mcp-server"
about: "MCP（Model Context Protocol）とはアプリケーションが LLM にコンテキストを提供する方法を標準化するプロトコルです。MCP を使用することで、LLM は外部ツールやサービスからコンテキストを取得するだけでなく、コードの実行やデータの保存など、さまざまなアクションを実行できるようになります。この記事では MCP サーバーを TypeScript で実装する方法を紹介します。"
createdAt: "2025-03-14T19:59+09:00"
updatedAt: "2025-03-14T19:59+09:00"
tags: ["AI", "TypeScript", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/16K7GmPXRkobDJWcBxnSJM/9703dc7f848eb53bdb4a6bf5f1095c41/frozen-food_pizza_21526-768x729.png"
  title: "冷凍食品のピザのイラスト"
selfAssessment:
  quizzes:
    - question: "MCP（Model Context Protocol）の主な目的は何ですか？"
      answers:
        - text: "LLMの学習データを標準化すること"
          correct: false
          explanation: null
        - text: "アプリケーションがLLMにコンテキストを提供する方法を標準化すること"
          correct: true
          explanation: "MCPは、アプリケーションがLLMにコンテキストを提供する方法を標準化するプロトコルです。"
        - text: "AIモデルのトレーニング方法を標準化すること"
          correct: false
          explanation: null
        - text: "複数のLLMモデルを同時に実行する方法を提供すること"
          correct: false
          explanation: null
    - question: "MCPサーバーのツールを実装する際、関数の戻り値として必要なプロパティは？"
      answers:
        - text: "content"
          correct: true
          explanation: "ツールの実行結果は、contentプロパティを持つオブジェクトとして返す必要があります。"
        - text: "result"
          correct: false
          explanation: null
        - text: "output"
          correct: false
          explanation: null
        - text: "response"
          correct: false
          explanation: null      

published: false
---

MCP（Model Context Protocol）とはアプリケーションが LLM にコンテキストを提供する方法を標準化するプロトコルです。多くの LLM ではユーザーに適切な回答を提供するために追加のコンテキスト情報を必要とします。例えば、今日の天気の情報をユーザーから求められたとしても LLM が学習したデータにはその情報は含まれていないため、正しい回答をできません。このような状況では LLM は天気情報を取得する API の呼び出しを要求し、その結果をコンテキストとして提供することで正しい回答を得られる可能性が高まります。

MCP と呼ばれる標準規格を使用することで、外部と連携する複雑なワークフローを構築するのに役立ちます。LLM は MCP を使用して、外部ツールやサービスからコンテキストを取得するだけでなく、コードの実行やデータの保存など、さまざまなアクションを実行できます。これにより、LLM は単なる質問応答システムから、より高度なアプリケーションやサービスの一部として機能することが可能になります。

現時点でも Google や GitHub, Slack などの多くの企業が MCP の仕様に則りコンテキストを提供するサーバーを提供しています。例えば Google Calendar の MCP サーバーを利用すれば、旅行の計画を立てる際に Google Calendar の予定を考慮した計画を立て、その予定を Google Calendar に登録できるようになるかもしれません。

利用可能な MCP サーバーの一覧は [MCP マーケットプレイス](https://cline.bot/mcp-marketplace) や [modelcontextprotocol/servers: Model Context Protocol Servers](https://github.com/modelcontextprotocol/servers/tree/main) で確認できます。

この記事ではホストから MCP サーバーを利用する方法と、MCP サーバーを TypeScript で実装する方法を紹介します。

## ホストから MCP サーバーを利用する

MCP マーケットプレイスで公開されている事前に構築された MCP サーバーを利用してみます。まずは MCP のアーキテクチャについて確認しておきましょう。MCP には以下の 3 つのコンポーネントがあります。ホストは複数のサーバーに接続できるクライアントサーバーアーキテクチャに従います。

- ホスト：接続を開始する LLM アプリケーション（Claude Desktop や Cline など）
- MCP クライアント：ホストアプリケーション内でサーバーとの 1 対 1 の接続を確立する
- MCP サーバー：クライアントにコンテキストやツール、プロンプトを提供する

![https://images.ctfassets.net/in6v9lxmm5c8/4Xlo8FKxcUO4HgKgGKdgft/e0326655d1e4ff3d74b81ac8bcb59850/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_21.06.11.png](https://modelcontextprotocol.io/docs/concepts/architecture)

https://modelcontextprotocol.io/docs/concepts/architecture より。

### Claude Desktop をインストールする

この記事ではホストとして Claude Desktop を使用します。以下の URL から Claude Desktop をインストールできます。お使いの OS に応じたバージョンを選択してください（Linux OS は現在のところサポートされていません）。すでに Claude Desktop をインストールしている場合には、最新バージョンであることを確認してください。

https://claude.ai/download

![](https://images.ctfassets.net/in6v9lxmm5c8/7cwsJWrBu7LiQqyYmuNBmc/55964a857c6d92a237ff329bdeac7219/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_21.14.44.png)

### MCP サーバーを追加する

MCP サーバーを利用するためには、Claude Desktop の設定を編集して MCP サーバーを追加する必要があります。以下の手順で MCP サーバーを追加します。

!> この記事では macOS の Claude Desktop を使用しています。Windows バージョンの場合は手順が異なる場合があります。

1. Claude Desktop を起動し、メニューバーの「Claude」→「Settings...」を選択する
2. 「Settings」ウィンドウが表示されたら、左側のメニューから「Developer」を選択する
3. 「Developer」メニューの「Edit Config」ボタンをクリックする
4. ファイルエクスプローラーが開くので、`claude_desktop_config.json` ファイルを選択してテキストエディタで開く

![](https://images.ctfassets.net/in6v9lxmm5c8/538zak9IYgXCyEUmg4CXJn/7fb4aa83355ff03110dd32b903ce653a/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_21.26.43.png)

MCP サーバーは `mcpServers` キーに追加します。この例では [GitHub](https://github.com/modelcontextprotocol/servers/tree/main/src/github) の MCP サーバーを追加します。GitHub の MCP サーバーはレポジトリにファイルを作成したり、コードや Issue を検索したりできます。利用するには事前にアクセスしたいレポジトリの権限を持つ [Personal Access Token](https://github.com/settings/tokens) を作成しておく必要があります。

以下の JSON を `claude_desktop_config.json` に追加します。`<GitHub Personal Access Token>` の部分は作成した Personal Access Token に置き換えてください。Docker もしくは Node.js どちらかの方法で MCP サーバーを起動できます。ここでは Docker を使用する方法を紹介します。

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "mcp/github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "<YOUR_TOKEN>"
      }
    }
  }
}
```

ファイルの編集が完了したら、Claude Desktop を再起動します。正常に MCP サーバーが起動している場合、Settings ウィンドウの「Developer」メニューに「github」が追加されていることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2x6pwTooAvHtxNLhwArbLO/22d7fbe130e1132734fbb9c2e4ef473b/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_22.02.42.png)

### MCP サーバーを利用する

MCP サーバーを追加したことにより、Claude Desktop がサーバーが公開しているツールを利用できるようになります。チャットウィンドウの🔨アイコンを見ると 17 個のツールが利用可能であると表示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/3HysbFF1GGPT8n1sGkuYLt/656aa01b2a798951f56d94869f7be20c/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_22.08.33.png)

🔨アイコンをクリックするとツールの一覧が表示されます。Issue にコメントをする「add_issue_comment」やブランチを作成する「create_branch」などが表示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/2jgJtWVTz0Q7paAEwSAGbi/46fa951f65821a5f9b8d60fd6456afe0/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_22.09.29.png)

Claude にいくつか質問をしてみましょう。質問内容に応じて Claude は利用可能なツールを分析して、適切なツールを選択して実行します。例えば「sapper-blog-app（このブログのソースコードが含まれているレポジトリです）に古いライブラリがあるか調べてください。存在する場合には Issue を作成してください」と尋ねてみます。Claude は GitHub MCP サーバーのツールである「search_repository」を使用すべきだと判断したようです。許可を求めるポップアップが表示されますので、「Allow Once」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/HXw9Ny6uYbb54CpgTZrHT/1ac029cedf263b80992181c60735fd94/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_22.17.46.png)

sapper-blog-app がモノレポ構造になっていることを理解していて、それぞれのパッケージの `package.json` を `get_file_contents` ツールを使用して取得している様子がわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6fqYVhpEdxPn3xB2ieiUJ1/d8c69dbf5d3ee21600cd5dc64d88544c/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_22.26.13.png)

最終的に `create_issue` ツールを使用して、古いライブラリが存在することを示す [Issue](https://github.com/azukiazusa1/sapper-blog-app/issues/1299) を作成しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/77Z818wYOah14Zoyxd1qyb/af745cf5d884de5680bd7ae9b4a15b88/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-14_22.26.26.png)

## MCP サーバーを TypeScript で実装する

MCP が実際にどのように動作するのかを理解するために、MCP サーバーを TypeScript で実装してみます。今回は簡単な例としてサイコロを降った結果を返す MCP サーバーを実装します。MCP サーバーはホストからの何面のサイコロを振るかというリクエストを受け取り、ランダムにサイコロの目を生成して返すというシンプルなものです。

### MCP サーバーのコンセプト

実装を始める前に、MCP サーバーのコンセプトを理解しておきましょう。MCP サーバーは以下の 3 つの機能を提供できます。

- [リソース](https://modelcontextprotocol.io/docs/concepts/resources)：MCP サーバーがクライアントに提供するデータ。ファイルコンテンツやデータベースのレコード、API のレスポンスなどが含まれる。各リソースは `file:///home/user/documents/report.pdf` や `postgres://database/customers/schema` のような一意の URI で識別される
- [ツール](https://modelcontextprotocol.io/docs/concepts/tools)：外部システムとのインタラクションを可能にするアクション。例えば、ファイルをアップロードしたり、計算を実行した結果を返すなどのアクションが含まれる。
- [プロンプト](https://modelcontextprotocol.io/docs/concepts/prompts)：MCP サーバーは特定のタスクを実行するためのプロンプトを提供する。例えばコードレビューを行うためのプロンプトなど

MCP サーバーは上記の機能を `name`, `description`, `arguments` などのプロパティを持つ JSON オブジェクトとして定義します。MCP クライアントはこれらの情報を見て提供されている機能が何であるかを理解し、タスクを実行するために利用すべきかどうかを判断します。例えばツールの場合には以下のような構造を持ちます。

```json
{
  name: string;          // ツールごとに一意の名前
  description?: string;  // 人間が読める説明
  inputSchema: {         // ツールのパラメータを JSON スキーマで定義
    type: "object",
    properties: { ... }
  }
}
```

今回実装するサイコロを振る MCP サーバーでは上記の 3 つの機能のうち、ツールとして実装するべきでしょう（もしかしたらサイコロの目をログとして保存しておけば、リソースとしても活用できるかもしれません）。ここでは `getDiceRoll` という名前のツールを実装していきます。完成予定の MCP サーバーは以下のような JSON を返すことになるでしょう。

```json
{
  "name": "getDiceRoll",
  "description": "Roll a dice with a specified number of sides and return the result.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "sides": {
        "type": "integer",
        "description": "The number of sides on the dice.",
      }
    }
  }
}
```

### プロジェクトのセットアップ

まずは適当なディレクトリを作成して、`npm init -y` でプロジェクトを初期化します。

```bash
mkdir mcp
cd mcp
npm init -y
```

次に必要なパッケージをインストールします。

```bash
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript vitest
```

`@modelcontextprotocol/sdk` は MCP サーバーを TypeScript で実装するための [SDK](https://github.com/modelcontextprotocol/typescript-sdk) です。`zod` はスキーマバリデーションライブラリで、MCP サーバーのスキーマを定義するために使用します。

`package.json` を以下のように編集し、`build` コマンドを追加します。

```json:package.json {5-8, 10-11, 13-15}
{
  "name": "mcp",
  "version": "1.0.0",
  "main": "src/server.ts",
  "type": "module",
  "bin": {
    "diceRoller": "./build/index.js"
  },
  "scripts": {
    "build": "tsc && chmod 755 build/index.js",
    "test": "vitest"
  },
  "files": [
    "build"
  ]
}
```

最後にプロジェクトのルートに `tsconfig.json` を作成します。

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Node16",
    "moduleResolution": "Node16",
    "outDir": "./build",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

これで MCP サーバーを実装する準備が整いました。

### ツールを作成する

はじめに `src/index.ts` を作成し、MCP サーバーを初期化します。以下のように `McpServer` クラスをインポートし、`name` と `version` を指定してインスタンスを作成します。

```ts:src/index.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export const server = new McpServer({
  name: "DiceRoller",
  version: "0.1.0",
});
```

`server.tool()` メソッドを使用してツールを定義します。

```ts:src/index.ts
import { z } from "zod";
server.tool(
  "getDiceRoll", // ツールの名前
  "Roll a dice with a specified number of sides and return the result.",　 // ツールの説明
  // ツールの引数を定義するスキーマ
  { sides: z.number().min(1).describe("Number of sides on the die") },
  // ツールが呼び出されたときに実行される関数
  async ({ sides }) => {
    const roll = Math.floor(Math.random() * sides) + 1;
    return {
      content: [
        {
          type: "text",
          text: roll.toString(),
        },
      ],
    };
  }
);
```

`server.tool()` メソッドの第 1 引数にはツールの名前を指定します。第 2 引数にはツールの説明と第 3 引数の入力スキーマは省略可能です。

入力スキーマは `zod` を使用して定義します。`zod` は TypeScript の型をスキーマとして利用できるため、型安全にスキーマを定義できます。ここでは `slides` が 1 以上の整数であることを検証するスキーマを定義しています。`.describe()` メソッドでスキーマの説明を追加することで、ホストアプリケーションがツールの利用方法を理解するのに役立ちます。

ツールが呼び出されたときに実行される関数は非同期関数として定義します。引数にはスキーマで定義した値が渡されます。戻り値は `content` プロパティを持つオブジェクトで、ツールの実行結果を返します。

### ツールの呼び出しをテストする

実装したツールを実際にサーバーを起動して呼び出して見る前に、ローカルでテストをしてみましょう。`InMemoryTransport` を使用することでメモリ上でクライアントとサーバーを接続できます。以下のコードを `src/index.test.ts` に追加します。

```ts:src/index.test.ts
import { describe, it, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { server } from "./index.js";

describe("getDiceRoll", () => {
  it("ランダムにサイコロを振った結果を返す", async () => {
    const client = new Client({
      name: "test client",
      version: "0.1.0",
    });

    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    await Promise.all([
      client.connect(clientTransport),
      server.connect(serverTransport),
    ]);

    const result = await client.callTool({
      name: "getDiceRoll",
      arguments: {
        sides: 6,
      },
    });

    expect(result).toEqual({
      content: [
        {
          type: "text",
          text: expect.stringMatching(/^[1-6]$/),
        },
      ],
    });
  });
});
```

`npm run test` でテストを実行しましょう。

```bash
npm run test

 ✓ src/index.test.ts (1 test) 3ms
   ✓ getDiceRoll > ランダムにサイコロを振った結果を返す

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  11:47:24
   Duration  356ms (transform 68ms, setup 0ms, collect 83ms, tests 3ms, environment 0ms, prepare 43ms)
```

テストが成功しました。これでサイコロを振るツールが正常に動作することが確認できました。

### サーバーを起動する

最後にサーバーを起動するために `main()` 関数を定義します。stdio Transport は、標準の入力および出力ストリームを介した通信を可能にします。

```ts:src/index.ts
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // console.log で標準出力すると、サーバーのレスポンスとして解釈されてしまう
  console.error("MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
```

`npm run build` でビルドを実行し、`./build/index.js` を実行できるか確認します。

```bash
npm run build

node ./build/index.js
```

`MCP Server running on stdio` と表示されればサーバーが正常にサーバーが起動しています。サーバーが起動することが確認できたら、タスクを終了っせても大丈夫です。

### MCP サーバーをクライアントから呼び出す

それでは自作した `diceRoller` サーバーを Claude Desktop から呼び出してみましょう。GitHub の MCP サーバーを追加したときと同様に、`claude_desktop_config.json` に以下の JSON を追加します。

```json
{
  "mcpServers": {
    "diceRoller": {
      "command": "node",
      "args": [
        "~/your/path/to/mcp/build/index.js"
      ]
    }
  }
}
```

?> NVM や Volta などの Node.js バージョン管理ツールを使用している場合には `[error] spawn node ENOENT` というエラーが表示されるようです。この場合には `command` の `node` をバージョン管理ツールのフルパスに置き換えることで解決できる可能性があります。`volta` の場合には `/Users/username/.volta/bin/node` です。https://github.com/modelcontextprotocol/servers/issues/64 。

Claude Desktop を再起動し、MCP サーバーが追加されていることを確認します。🔨アイコンをクリックして「getDiceRoll」が追加されているはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/5uIriApD2vl7LreX0O3evU/9bdfe78cf342e4a6541558d22974c974/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-15_12.14.29.png)

サイコロを振るツールを実行してみましょう。「1 ~ 10 のうちランダムな 1 つの数字を返してください」と尋ねてみます。すると「getDiceRoll」ツールが実行が求められました。入力スキーマを理解しており、`{"sides": 10}` という引数で実行を試みていることがわかります。ツールの使用を許可すると、サーバーからは「8」という結果が返ってきました。この結果を元に Claude は「8」を選択したようです。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Ywb8l0C4B1lWKGXTCdar0/6ead5d22d9a853707f026dc0db04d879/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-03-15_12.17.27.png)

## まとめ

- MCP（Model Context Protocol）はアプリケーションが LLM にコンテキストを提供する方法を標準化するプロトコル
- MCP を使用することで、LLM は外部ツールやサービスからコンテキストを取得するだけでなく、コードの実行やデータの保存など、さまざまなアクションを実行できる
- MCP はホスト、クライアント、サーバーの 3 つのコンポーネントから構成される
- MCP サーバーはリソース、ツール、プロンプトを提供する。クライアントはこれらの情報を元にタスクを実行するために利用すべきかどうかを判断する
- Claude Desktop を使用して MCP サーバーを利用するには `claude_desktop_config.json` に `mcpServers` キーを追加する
- ツールは Claude が回答を生成するために必要だと判断した場合に実行される

## 参考

- [Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction)
- [Specification (Draft) – Model Context Protocol Specification](https://spec.modelcontextprotocol.io/specification/draft/)
- [modelcontextprotocol/specification: The specification of the Model Context Protocol](https://github.com/modelcontextprotocol/specification)
- [Deno で RooCode 用にローカルMCPサーバーをさっと作る](https://zenn.dev/mizchi/articles/deno-mcp-server)