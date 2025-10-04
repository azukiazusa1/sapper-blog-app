---
id: 2-J8tWG21cFIKXYDid_za
title: "MCP のツールアノテーションでユーザーにヒントを提供する"
slug: "mcp-tool-annotations"
about: "MCP ではツールアノテーションを使用して、ユーザーにツールの動作に関するヒントを提供できます。例えば `readOnlyHint` を設定することで、ツールがデータを変更しないことを示すことができます。この記事では TypeScript SDK を使用して MCP サーバーでツールアノテーションを設定し、Claude Code クライアントでどのように表示されるかを確認します。"
createdAt: "2025-10-04T10:18+09:00"
updatedAt: "2025-10-04T10:18+09:00"
tags: ["MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/NSSdlTaqft8Kfi8immigH/0b6890620cd0c5338264359e4cd77757/sabamisoni-teishoku_20545-768x542.png"
  title: "さばの味噌煮のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`readOnlyHint` を `true` に設定すべきツールはどれですか？"
      answers:
        - text: "TODO 項目を追加するツール"
          correct: false
          explanation: "TODO 項目を追加するツールはデータを変更するため、`readOnlyHint` を `true` に設定すべきではありません。"
        - text: "TODO 項目の一覧を取得するツール"
          correct: true
          explanation: "TODO 項目を読み取るだけのツールはデータを変更しないため、`readOnlyHint` を `true` に設定することが適切です。"
        - text: "TODO 項目を削除するツール"
          correct: false
          explanation: "TODO 項目を削除するツールはデータを変更するため、`readOnlyHint` を `true` に設定すべきではありません。"
        - text: "TODO 項目を更新するツール"
          correct: false
          explanation: "TODO 項目を更新するツールはデータを変更するため、`readOnlyHint` を `true` に設定すべきではありません。"
    - question: "`idempotentHint` を `true` に設定するのはどのような場合ですか？"
      answers:
        - text: "ツールが同じ入力に対して何度呼び出しても同じ副作用が生じる場合"
          correct: true
          explanation: "`idempotentHint` はツールの動作が冪等であることを示します。つまり、同じ入力に対して何度呼び出しても同じ副作用が生じる場合です。"
        - text: "ツールが破壊的な変更を行う可能性がある場合"
          correct: false
          explanation: "これは `destructiveHint` に関する説明です。"
        - text: "ツールが外部のエンティティと相互作用する可能性がある場合"
          correct: false
          explanation: "これは `openWorldHint` に関する説明です。"
        - text: "ツールがセンシティブなデータを扱う場合"
          correct: false
          explanation: "これはツールアノテーションの対象外です。センシティブなデータの扱いはアノテーションではなく、適切な権限管理やセキュリティ対策で対応すべき事項です。"
published: true
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.org/) は、LLM が外部のツールと対話するための標準的な方法を提供します。MCP では LLM が利用できるツールを MCP サーバーが提供し、LLM はそのツールを呼び出してタスクを実行します。

MCP を利用すると外部で保存された情報を参照してより正確な回答を生成したり、カレンダーに予定を追加するといったタスクを実行したりすることが可能になります。しかし MCP のツールの実行はユーザーの操作なしに思わぬ動作を引き起こす可能性があるため、基本的に LLM がツールを呼び出す際にはユーザーの許可を求める動作になっています。

MCP ではツールの利用に関するユーザー体験を向上させるために、ツールがアノテーションを提供できる仕組みが導入されています。ツールアノテーションはユーザーがツールの動作を理解するのを助け、ツールの利用に関する意思決定を支援します。ツールのアノテーションには以下のようなものがあります。

- `title`: 人間が読めるツールの名前
- `readOnlyHint`: `true` の場合、ツールはデータを変更しないことを示す
- `destructiveHint`: `true` の場合、ツールは破壊的な変更を行う可能性があることを示す（`readOnlyHint` が `false` の場合にのみ意味を持つ）
- `idempotentHint`: `true` の場合、ツールは冪等であることを示す。つまり、同じ入力に対して何度呼び出しても同じ副作用が生じる（`readOnlyHint` が `false` の場合にのみ意味を持つ）
- `openWorldHint`: `true` の場合、ツールは外部のエンティティと相互作用する可能性があることを示す。例えば Web 検索ツールは `openWorldHint` を `true` に設定することが推奨されるが、メモリツールは `false` に設定される

ただし、これらのアノテーションはあくまでヒントであり、MCP サーバーがツールの動作を保証するものではありません。例えば `readOnlyHint` が `true` に設定されていても、ツールが実際にはデータを変更する可能性があります。そのためセキュリティ上の判断として利用するべきではありません。

この記事では実際に、MCP サーバーでツールアノテーションを設定し、クライアントでどのように表示されるかを確認します。

## ツールアノテーションを設定する

MCP サーバーの [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) を使用して簡単な MCP サーバーを作成し、ツールアノテーションを設定します。メモリ上で TODO リストを管理する MCP サーバーを作成してみましょう。

まずは必要なパッケージをインストールします。

```bash
npm install @modelcontextprotocol/sdk zod
npm install -D @types/node typescript
```

`package.json` に `build` スクリプトを追加します。

```json:package.json
{
  "scripts": {
    "build": "tsc && chmod 755 build/index.js"
  }
}
```

プロジェクトのルートに `tsconfig.json` を作成します。

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

`src/index.ts` に以下のコードを追加します。このコードでは `add_todo` と `list_todos` という 2 つのツールを定義し、それぞれにツールアノテーションを設定しています。`add_todo` ツールは TODO 項目を追加するためのもので、データを変更するため `readOnlyHint` はデフォルトの `false` のままにしています。一方、`list_todos` ツールは TODO 項目を読み取るだけなので、`readOnlyHint` を `true` に設定しています。そしてそれぞれのツールには `title` も設定しています。

```typescript:src/index.ts {17,36, 42}
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// サーバーインスタンスの作成
export const server = new McpServer({
  name: "todo-mcp-server",
  version: "0.1.0",
});

const todos: string[] = ["buy milk", "walk dog"];

// ツールの定義
server.tool(
  "add_todo",
  {
    title: "Add a new todo item",
    description: "Adds a new todo item to the list",
    inputSchema: { title: z.string().describe("The todo item to add") },
    outputSchema: {
      success: z.boolean().describe("Whether the todo was added successfully"),
    },
  },
  async ({ title }) => {
    todos.push(title);
    return {
      content: [{ type: "text", text: JSON.stringify({ success: true }) }],
      structuredContent: { success: true },
    };
  }
);

server.tool(
  "list_todos",
  {
    title: "List all todo items",
    description: "Returns a list of all todo items",
    inputSchema: {},
    outputSchema: {
      todos: z.array(z.string()).describe("The list of todo items"),
    },
    readOnlyHint: true,
  },
  async () => {
    return {
      content: [{ type: "text", text: JSON.stringify({ todos }) }],
      structuredContent: { todos },
    };
  }
);

async function main() {
  // サーバーの起動
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP server is running...");
}

main();
```

MCP サーバーをビルドします。

```bash
npm run build
```

`build/index.js` ファイルが生成されていれば成功です。

## クライアントでツールアノテーションを確認する

クライアント側でツールアノテーションがどのように表示されるかを確認します。まずは Claude Code をクライアントとして MCP サーバーに接続しましょう。Claude Code で MCP サーバーを登録するには `claude add mcp <name> -- <command>` コマンドを使用します。

```bash
claude add mcp todo -- node /path/to/your/project/build/index.js
```

`claude` コマンドで Claude Code を起動した後、`/mcp` コマンドを実行して現在登録されている MCP サーバーの一覧を表示します。

```bash
/mcp
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4xyv90ubTNb7HrXXklD7LX/1867cde0c079d9c58496c406c175b69a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-04_11.03.43.png)

「1. View Tools」を選択すると TODO MCP サーバーで利用可能なツールの一覧が表示されます。ツール名はアノテーションで指定した `title` が表示されていることがわかります。`readOnlyHint` が `true` に設定されている `list_todos` ツールには「(read-only)」と表示されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/aZTWXiTNhoRjbPCAYdMOy/ec830c6fd5d136fc782f618dce509fbc/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-04_11.05.48.png)

なお、ツールを実行前の許可を求めるダイアログにはツールアノテーションは表示されないようでした。このあたりはクライアントツールの実装に依存しているため、ツールによって異なる可能性があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5TuXrhS6IUcyukvq5LY98P/15fb6b8a8c09a54ce66f186495eeab82/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-04_11.10.14.png)

## まとめ

- MCP のツールアノテーションを使用すると、ユーザーにツールの動作に関するヒントを提供できる
- ツールアノテーションには以下の項目がある
  - `title`: 人間が読めるツールの名前
  - `readOnlyHint`: `true` の場合、ツールはデータを変更しないことを示す
  - `destructiveHint`: `true` の場合、ツールは破壊的な変更を行う可能性があることを示す（`readOnlyHint` が `false` の場合にのみ意味を持つ）
  - `idempotentHint`: `true` の場合、ツールは冪等であることを示す。つまり、同じ入力に対して何度呼び出しても同じ副作用が生じる（`readOnlyHint` が `false` の場合にのみ意味を持つ）
  - `openWorldHint`: `true` の場合、ツールは外部のエンティティと相互作用する可能性があることを示す。例えば Web 検索ツールは `openWorldHint` を `true` に設定することが推奨されるが、メモリツールは `false` に設定される
- これらのアノテーションはあくまでヒントであり、MCP サーバーがツールの動作を保証するものではないため、セキュリティ上の判断として利用するべきではない
- Claude Code ではツール一覧画面で設定したタイトルが表示されたことと、`readOnlyHint` が `true` のツールには「(read-only)」と表示されたことを確認できた
- クライアントツールによってはツールアノテーションを表示しない場合もあるため、ユーザー体験はクライアントツールに依存する

## 参考

- [Tools - Model Context Protocol](https://modelcontextprotocol.io/legacy/concepts/tools#tool-annotations)
- [Schema Reference - Model Context Protocol](https://modelcontextprotocol.io/specification/2025-06-18/schema#toolannotations)
