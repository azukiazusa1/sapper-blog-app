---
id: wHXQOIvOE3iyj_JfReo6t
title: "ブラウザから MCP サーバーに接続する use-mcp React フック"
slug: "use-mcp-react-hook"
about: "use-mcp はリモートの MCP サーバーに接続するための React フックです。ツールの呼び出しや認証を簡単に行うことができます。この記事では、use-mcp を使用して MCP サーバーに接続し、ツールを呼び出す方法と、OAuth 認証の実装方法について解説します。"
createdAt: "2025-06-21T13:31+09:00"
updatedAt: "2025-06-21T13:31+09:00"
tags: ["MCP", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/64rVauxa86lu68SiqFJ4Mu/a9d82a4728d3f6419737459fb89d6215/bird_suzume_9916.png"
  title: "bird suzume 9916"
audio: null
selfAssessment:
  quizzes:
    - question: "useMcp フックが返す state の値として正しくないものはどれですか？"
      answers:
        - text: "discovering"
          correct: false
          explanation: null
        - text: "authenticating"
          correct: false
          explanation: null
        - text: "initialized"
          correct: true
          explanation: "initialized は state の値に含まれていません。正しくは discovering, authenticating, connecting, loading, ready, failed です。"
        - text: "ready"
          correct: false
          explanation: null
published: true
---
`use-mcp` はリモートの[Model Context Protocol (MCP)](https://modelcontextprotocol.org/) サーバーに接続するための React フックです。このフックを使用すると AI システムへの認証やツールの呼び出しを簡単に行うことができます。

https://github.com/modelcontextprotocol/use-mcp

## React コンポーネントから MCP サーバーに接続する

use-mcp フックを使用したコンポーネントの例を試してみましょう。2025-06-18 バージョンの MCP の仕様ではクライアントとサーバーのトランスポートの方法として [stdio](https://modelcontextprotocol.io/docs/concepts/transports#standard-input%2Foutput-stdio) と [Streamable HTTP](https://modelcontextprotocol.io/docs/concepts/transports#streamable-http) が定義されていますが、use-mcp では `Streamable HTTP` による接続をサポートしています。HTTP もしくは SSE（Server-Sent Events）を使用して MCP サーバーに接続します。

MCP サーバーとして [Git MCP](https://gitmcp.io/) を使用します。これは GitHub の任意のレポジトリを MCP サーバーとして利用できるツールです。public なレポジトリであれば認証無しで接続できます。URL はレポジトリの URL の github.com の部分を gitmcp.io に置き換えたものを指定します。例えば https://gitmcp.io/azukiazusa1/sapper-blog-app のような形式です。

React アプリケーションを作成し、以下のコマンドで `use-mcp` をインストールします。

```bash
npm install use-mcp
```

`useMcp` フックに接続先の URL を指定して呼び出します。以下のコードを追加しましょう。

```tsx:src/App.tsx
import { useState } from "react";
import { useMcp, type Tool } from "use-mcp/react";

function App() {
  const { state, tools, error } = useMcp({
    url: "https://gitmcp.io/azukiazusa1/sapper-blog-app",
    clientName: "my-mcp-client",
  });

  if (state === "loading" || state === "connecting") {
    return <div>Loading...</div>;
  }
  if (state === "failed") {
    return <div>Error loading MCP: {error}</div>;
  }

  return (
    <div>
      <h1>Git MCP Server</h1>

      <ul>
        {tools.map((tool) => (
          <li key={tool.name}>
            <button onClick={() => {}}>{tool.name}</button>
            <p>{tool.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

フックの戻り値の `state` には MCP サーバーとの接続が成功したかどうかの状態が含まれ、以下の値を取ります。

- `discovering`
- `authenticating`
- `connecting`
- `loading`
- `ready`
- `failed`

この状態を使用して接続状態をレンダリングしています。MCP サーバーで利用可能なツールの一覧は `tools` プロパティに含まれているので、リストとして表示しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/76eC7upQo0pZU8Guw0Dymh/cbe1b63d98841125508c9f296d636e59/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-21_14.35.12.png)

ツールの呼び出しを追加してみましょう。ツールを呼び出すには `callTool` メソッドにツール名と引数を渡します。ツールが要求する引数の型は `tools` プロパティの各ツールの `inputSchema` に定義されているので、このスキーマを参照し引数の入力フォームを表示します。

```tsx:src/App.tsx {5-7, 9}
import { useState } from "react";
import { useMcp, type Tool } from "use-mcp/react";

function App() {
  const [toolCallResult, setToolCallResult] = useState(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { state, tools, callTool, error } = useMcp({
    url: "https://gitmcp.io/azukiazusa1/sapper-blog-app",
    clientName: "my-mcp-client",
  });

  if (state === "loading") {
    return <div>Loading...</div>;
  }
  if (state === "failed") {
    return <div>Error loading MCP: {error}</div>;
  }

  function onClickTool(tool: Tool) {
    setSelectedTool(tool);
    setFormData({});
    setToolCallResult(null);
  }

  function renderInputField(name: string, schema: any) {
    const value = formData[name] || "";

    const handleChange = (newValue: any) => {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    if (schema.type === "string") {
      if (schema.enum) {
        return (
          <select value={value} onChange={(e) => handleChange(e.target.value)}>
            <option value="">Select...</option>
            {schema.enum.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={schema.description}
        />
      );
    }

    if (schema.type === "number") {
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => handleChange(Number(e.target.value))}
          placeholder={schema.description}
        />
      );
    }

    // boolean, array など他の型は省略
  }

  async function handleSubmit() {
    if (!selectedTool) return;

    try {
      const result = await callTool(selectedTool.name, formData);
      setToolCallResult(result);
    } catch (error) {
      setToolCallResult({ error: error.message });
    }
  }

  return (
    <div>
      <h1>Git MCP Server</h1>

      {!selectedTool ? (
        <ul>
          {tools.map((tool) => (
            <li key={tool.name}>
              <button onClick={() => onClickTool(tool)}>{tool.name}</button>
              <p>{tool.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <h2>{selectedTool.name}</h2>
          <p>{selectedTool.description}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {selectedTool.inputSchema?.properties &&
              Object.entries(selectedTool.inputSchema.properties).map(
                ([name, schema]: [string, any]) => (
                  <div key={name} style={{ marginBottom: "10px" }}>
                    <label>
                      {name}
                      {selectedTool.inputSchema.required?.includes(name) &&
                        " *"}
                      :
                    </label>
                    <div>{renderInputField(name, schema)}</div>
                    {schema.description && (
                      <small style={{ color: "#666" }}>
                        {schema.description}
                      </small>
                    )}
                  </div>
                )
              )}

            <button type="submit">Execute Tool</button>
            <button type="button" onClick={() => setSelectedTool(null)}>
              Back
            </button>
          </form>
        </div>
      )}

      {toolCallResult && (
        <div>
          <h2>Tool Call Result</h2>
          <pre>{JSON.stringify(toolCallResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
```

このコードでは、ツールを選択するとそのツールの入力フォームが表示され、必要な引数を入力してツールを実行できます。ツールの実行結果は `toolCallResult` に保存され、画面に表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7LW33Lz2X2nPrqNe0HUk07/027868db3fe17d512b0937a1b67ec2d5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-21_14.49.59.png)

## OAuth 認証

多くの MCP サーバーではツールの呼び出しを行うために認証が必要です。[MCP サーバーの認証の仕様](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization)では MCP サーバーは OAuth 2.1 を実装する必要があると定義されています。

use-mcp では OAuth 認証のフロー全体をサポートしています。ユーザーをログインページにリダイレクトし、認証後にコールバック URL にリダイレクトされることで認証トークンを取得しストレージに保存します。

ここでは [Cloudflare Workers Bindings MCP Server](https://github.com/cloudflare/mcp-server-cloudflare/tree/main/apps/workers-bindings) を例にコード例を示します。これは Cloudflare の OAuth が組み込まれた MCP サーバーで、Cloudflare Workers のリソースを操作するツールを提供しています。

先程の `App.tsx` ファイルの `useMcp` フックに渡した URL を `https://bindings.mcp.cloudflare.com/sse` に変更しておきましょう。

```tsx:src/App.tsx {5}
import { useMcp, type Tool } from "use-mcp/react";

function App() {
  const { state, tools, callTool, error } = useMcp({
    url: "https://bindings.mcp.cloudflare.com/sse",
    clientName: "my-mcp-client",
  });
  // ...
}
```

React アプリケーションでコールバック URL が必要となるため、何らかのルーティングライブラリを使用して `/oauth/callback` のパスを処理する必要があります。ここでは `react-router-dom` を使用しましょう。

```bash
npm install react-router-dom
```

認証を行うためのコンポーネントを追加します。以下のコードを `src/OAuthCallback.tsx` として保存します。ここでは `onMcpAuthorization` 関数を `useEffect` フックで呼び出しています。

```tsx:src/OAuthCallback.tsx
import { useEffect } from "react";
import { onMcpAuthorization } from "use-mcp";

export function OAuthCallback() {
  useEffect(() => {
    onMcpAuthorization();
  }, [])

  return (
    <div>
      <h1>Authenticating...</h1>
      <p>This window should close automatically.</p>
    </div>
  )
}
```

`Routes` コンポーネントを作成し、`App` コンポーネントと `OAuthCallback` コンポーネントをルーティングします。

```tsx:src/Routes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import { OAuthCallback } from "./OAuthCallback";
export function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
    </Router>
  );
}
```

`src/main.tsx` を以下のように更新して、`AppRoutes` をレンダリングします。

```tsx:src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRoutes } from "./Routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>
);
```

これで認証処理が実装されました。アプリケーションを起動し http://localhost:5173 にアクセスすると、Cloudflare の OAuth 認証ページのポップアップが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1wckXj8MifILoXriu0gaks/9e88a754de95e170b342f462852e0a4e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-21_15.28.52.png)

ポップアップの「Allow」ボタンをクリックして認証を許可すると、アプリケーションにリダイレクトされ、認証が完了します。これで MCP サーバーに接続し、ツールを呼び出すことができるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/4wMSMuh1GRwyjWi8SIv7dy/01c744e775e2453c78980cc235bf9c69/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-21_15.38.40.png)

認証トークンはブラウザの `localStorage` に保存され、次回アプリケーションを起動したときに自動的に認証が行われます。ストレージをクリアする場合には `useMcp` フックの `clearStorage` メソッドを呼び出すことでトークンを削除できます。

```tsx:src/App.tsx
import { useMcp, type Tool } from "use-mcp/react";
function App() {
  const { state, tools, callTool, error, clearStorage } = useMcp({
    url: "https://bindings.mcp.cloudflare.com/sse",
    clientName: "my-mcp-client",
  });

  // ...

  return (
    <div>
      <h1>Git MCP Server</h1>

      <button onClick={clearStorage}>Log Out</button>

      {/* ... */}
    </div>
  );
}
```

## まとめ

- `use-mcp` は MCP サーバーに接続するための React フックで、ツールの呼び出しや認証を簡単に行うことができる。
- `useMcp` フックを使用して MCP サーバーに接続し、ツールの一覧を取得できる。
- ツールの呼び出しには `callTool` メソッドを使用する。必要な引数は `tools` プロパティの各ツールの `inputSchema` に定義されている。
- OAuth 認証をサポートしており、認証フローを簡単に実装できる。`/oauth/callback` のパスを設定し、`onMcpAuthorization` 関数を使用して認証を行う。
- 認証後はブラウザの `localStorage` にトークンが保存され、次回の起動時に自動的に認証が行われる。
- `clearStorage` メソッドを使用して認証トークンを削除し、ログアウトすることができる。

## 参考

- [modelcontextprotocol/use-mcp](https://github.com/modelcontextprotocol/use-mcp)
- [Connect any React application to an MCP server in three lines of code](https://blog.cloudflare.com/connect-any-react-application-to-an-mcp-server-in-three-lines-of-code/)
- [Introduction - Model Context Protocol](https://modelcontextprotocol.io/introduction)
