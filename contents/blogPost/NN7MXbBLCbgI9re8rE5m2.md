---
id: NN7MXbBLCbgI9re8rE5m2
title: "MCP の Structured tool output を試してみる"
slug: "mcp-structured-output"
about: "MCP の 2025-06-18 バージョンでは Structured tool output がサポートされました。ツールの定義で `outputSchema` を出力のスキーマを定義し、`structuredContent` フィールドに構造化された出力を返すことができます。この記事では MCP の TypeScript SDK を使用して Structured tool output を試してみます。"
createdAt: "2025-06-28T14:47+09:00"
updatedAt: "2025-06-28T14:47+09:00"
tags: ["MCP", "TypeScript", "Zod"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3432BmKwnX5ApyXcIwZm6e/94f0817b5325bccd8b8c7e93d499f7e3/kakigoori_21151.png"
  title: "かき氷のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Structured tool output を使用する際に、ツールの出力スキーマを定義するために使用するフィールドは何ですか？"
      answers:
        - text: "outputSchema"
          correct: true
          explanation: "outputSchema フィールドを使用してツールの出力のスキーマを定義します。"
        - text: "responseSchema"
          correct: false
          explanation: "正しいフィールド名は outputSchema です。"
        - text: "resultSchema"
          correct: false
          explanation: "正しいフィールド名は outputSchema です。"
        - text: "structureSchema"
          correct: false
          explanation: "正しいフィールド名は outputSchema です。"
    - question: "構造化された出力はどのフィールドに格納されますか？"
      answers:
        - text: "structuredContent"
          correct: true
          explanation: "構造化された出力は structuredContent フィールドに JSON 形式で格納されます。"
        - text: "structuredData"
          correct: false
          explanation: "正しいフィールド名は structuredContent です。"
        - text: "outputData"
          correct: false
          explanation: "正しいフィールド名は structuredContent です。"
        - text: "content"
          correct: false
          explanation: "content フィールドは従来の文字列形式の出力用です。構造化された出力は structuredContent に格納されます。"
          explanation: "正しいパッケージ名は @modelcontextprotocol/inspector です。"

published: true
---

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) ではサーバーが LLM が呼び出すことができるツールを公開できます。ツールは LLM が外部のシステムと対話をすることを可能にします。例えばユーザーが LLM に対して旅行の計画を依頼した場合には、予約可能なホテルのリストを取得して正確な情報を提供したり、ユーザーのカレンダーに予定を追加したりできます。

MCP ツールを定義する際には `inputSchema` フィールドにより JSON Schema を使用してツールの入力を定義することで、LLM が適切にツールを呼び出すことができます。以下の例は天気予報を取得するツールの定義です。`inputSchema` フィールドを参照すると `location` を指定する必要があることがわかります。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_weather",
        "description": "Get current weather information for a location",
        "inputSchema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name or zip code"
            }
          },
          "required": ["location"]
        }
      }
    ],
    "nextCursor": "next-page-cursor"
  }
}
```

しかし、ツールの出力は通常、単純な文字列で返されます。典型的なツールの出力は以下のようになります。

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Current weather in New York:\nTemperature: 72°F\nConditions: Partly cloudy"
      }
    ],
    "isError": false
  }
}
```

ツールの出力は常にテキストとして返されるため、このツールがどのようなデータを返すのか予測できません。このことはツールを呼び出す LLM に適切なコンテキストを提供することを妨げるのみならず、ツールの利用を検討している開発者にとっても不都合でした。

また、複雑なデータ構造を返す必要があるツールでは文字列化した JSON を返すといったハックも行われており、構造化された出力を扱うことは多くの MCP ツールの開発者にとっても望まれている機能でした。

[MCP の 2025-06-18 バージョンの仕様](https://modelcontextprotocol.io/specification/2025-06-18/changelog) では Structured tool output がサポートされました。これにより、ツールの出力を構造化された形式で返すことができるようになります。この記事では MCP の TypeScript SDK を使用して Structured tool output を試してみます。

## ツールを定義する

サーバー側でツールを定義します。まず Node.js のプロジェクトを作成し、必要なパッケージをインストールします。

```bash
mkdir mcp-weather-tool
cd mcp-weather-tool
npm init -y

npm install @modelcontextprotocol/sdk zod
npm install --save-dev typescript tsx @types/node
```

`@modelcontextprotocol/sdk` パッケージが MCP の TypeScript SDK です。`zod` ツールの入力と出力のスキーマを定義するために使用します。

まずは `new McpServer()` を使用して MCP サーバーを作成します。ツールの定義は `server.registerTool()` メソッドを使用して行います。以下のコードは天気予報を取得するツールを定義しています。

```typescript:src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";

const server = new McpServer({
  name: "WeatherToolServer",
  version: "0.0.0",
});

const weatherInputSchema = {
  location: z.string().describe("City name or zip code"),
};

const weatherOutputSchema = {
  location: z.string().describe("Location name"),
  temperature: z.string().describe("Current temperature"),
  conditions: z.string().describe("Current weather conditions"),
};

server.registerTool(
  // ツール名
  "getWeather",
  {
    title: "Get Weather",
    description: "Get the current weather for a specified location.",
    inputSchema: weatherInputSchema,
    outputSchema: weatherOutputSchema,
  },
  // ツールが呼び出されたときの処理
  async ({ location }) => {
    // TODO...
  }
);

// サーバーを stdio で起動
const run = async () => {
  const transport = new StdioServerTransport();
  console.error("Starting server...");
  await server.connect(transport);
};

run().catch(console.error);
```

`registerTool()` メソッドの第 2 引数でツールのメタデータを定義します。`outputSchema` が 2025-06-18 バージョンの MCP で追加されたフィールドです。`zod` を使用してツールの出力のスキーマを定義しています。

`outputSchema` が定義されている場合、サーバーは必ずこのスキーマに従い構造化された結果を返す必要があります。クライアントはこのスキーマを使用してツールの出力を検証すべきです。

それではツールが呼び出されたときの処理を実装します。以下のコードはダミーの天気予報データを返すようにしています。

```typescript:src/server.ts
server.registerTool(
  // ツール名
  "getWeather",
  {
    title: "Get Weather",
    description: "Get the current weather for a specified location.",
    inputSchema: weatherInputSchema,
    outputSchema: weatherOutputSchema,
  },
  // ツールが呼び出されたときの処理
  async ({ location }) => {
    // ダミーの天気予報データ
    const weatherData = {
      location: location,
      temperature: "72°F",
      conditions: "Partly cloudy",
    } satisfies z.infer<z.ZodObject<typeof weatherOutputSchema>>;

    // API の呼び出しが失敗した場合をシミュレート
    if (location === "error-location") {
      return {
        content: [
          {
            type: "text",
            text: "An error occurred while fetching the weather data.",
          },
        ],
        isError: true,
      };
    }

    return {
      structuredContent: weatherData,
      content: [
        {
          type: "text",
          // 後方互換性のため、文字列化した JSON も返す
          text: JSON.stringify(weatherData),
        },
      ],
      isError: false,
    };
  }
);
```

構造化された出力は `structuredContent` フィールドに JSON 形式で格納されます。後方互換性のため、構造化された出力と機能的に同等なコンテンツを構造化されていない形式で返すべきだと規定されています。文字列化した JSON を TextContent として返すのが一般的な方法です。

## ツールをテストする

MCP サーバーのテストには [@modelcontextprotocol/inspector](https://www.npmjs.com/package/@modelcontextprotocol/inspector) を使用するのが便利です。Web ブラウザ上でツールの定義を確認したり、実際にツールを呼び出してデバッグできます。

以下のコマンドで MCP Inspector を MCP サーバーと連携させて起動します。

```bash
npx @modelcontextprotocol/inspector npx tsx src/server.ts
```

`http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=xxx` という形式で URL が表示されるので、ブラウザで開きます。左側のフォームに以下の内容が入力されているはずです。

- Transport Type: `stdio`
- Command: `npx`
- Arguments: `tsx src/server.ts`

![](https://images.ctfassets.net/in6v9lxmm5c8/O1e6z37K5URdkjAIcJfiG/21c6beeb047437bb7ccdc96714bbc317/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-28_16.41.23.png)

フォームに正しい内容が入力されていることを確認したら、`Connect` ボタンをクリックします。接続が成功した後に「Tools」→「List Tools」を選択すると、先ほど定義した `getWeather` ツールが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7b69wo4a7Fs2enBlx72Vk6/0aea056fdc35a9593e956daf9fcbe615/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-28_16.44.04.png)

ツールの詳細を確認するには、ツール名をクリックします。先ほど定義した `inputSchema` と `outputSchema` が表示されます。Zod のスキーマが JSON Schema に変換されて表示されていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/3OErUeHpKZrBBF8loYXCGm/9533e9b9b274b1792dde0937f7c08681/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-28_16.45.15.png)

ツールを呼び出すをテストするには、`inputSchema` の入力フォームに値を入力して「Run Tool」ボタンをクリックします。Structured Content がスキーマ通りに返されていること、構造化されていない形式でも同等の内容が返されていることが検証されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6ediEI59yQGmyLsVGIfImE/f068957ff01a3755f333e8e039535d00/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-28_16.49.42.png)

試しに構造化された出力をスキーマに従わない形式で返してみましょう。サーバーのコードを以下のように変更します。

```typescript:src/server.ts
server.registerTool(
  // ...
  async ({ location }) => {
    // ダミーの天気予報データ
    const weatherData = {
      location: location,
      temperature: "72°F",
      conditions: "Partly cloudy",
    } satisfies z.infer<z.ZodObject<typeof weatherOutputSchema>>;

    // スキーマに従わない形式で返す
    return {
      structuredContent: {
        ...weatherData,
        extraField: "This field is not in the output schema",
      },
      content: [
        {
          type: "text",
          text: JSON.stringify(weatherData),
        },
      ],
      isError: false,
    };
  }
);
```

サーバーを再起動して、再度ツールを呼び出してみます。`MCP_PROXY_AUTH_TOKEN` の値は毎回異なるので、Inspector の URL を再度開く必要があります。

余分なフィールドが含まれている場合には、MCP Inspector 上で Validation Error が表示されているものの、ツールの呼び出し自体は成功しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/gnEwPKm2g4gOz9hGLj1Sd/f1f53a6f030695d91b33a62e67db6910/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-28_16.58.02.png)

一方で必須のフィールドが欠けている場合には、ツールの呼び出し自体が失敗しエラーコード `-32602` が返されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3lcE9Iaq0iXfdNlozpzzK1/cea7a97a477ffad52277ac208d6ff0a8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-28_17.02.15.png)

## まとめ

- MCP の 2025-06-18 バージョンで Structured tool output がサポートされた。SDK を使用してツールの出力を構造化された形式で返すことができる
- ツールを定義する際には `outputSchema` フィールドを使用してツールの出力のスキーマを定義する
- ツールの出力は `structuredContent` フィールドに JSON 形式で格納され、後方互換性のために文字列化した JSON を TextContent として返すことが推奨されている
- MCP Inspector を使用してツールの定義や呼び出しをテストすることができる

## 参考

- [Tools - Model Context Protocol](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#structured-content)
- [Key Changes - Model Context Protocol](https://modelcontextprotocol.io/specification/2025-06-18/changelog)
- [RFC: add tool `outputSchema` and `DataContent` type to support structured content by lukaswelinder · Pull Request #356 · modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/356)
- [RFC: add `Tool.outputSchema` and `CallToolResult.structuredContent` by bhosmer-ant · Pull Request #371 · modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/371)
- [Bring back the concept of "toolResult" (non-chat result) · Issue #97 · modelcontextprotocol/modelcontextprotocol](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/97)
- [MCP 2025-06-18 で追加された structured tool output を試す](https://zenn.dev/sushichaaaan/articles/fd57bbaa25287c)