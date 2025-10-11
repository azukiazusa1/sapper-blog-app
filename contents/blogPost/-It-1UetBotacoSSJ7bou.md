---
id: -It-1UetBotacoSSJ7bou
title: "ChatGPT 内でアプリを直接操作する Apps SDK に自作のアプリを接続する"
slug: "chatgpt-apps-sdk"
about: "Apps in ChatGPT は ChatGPT のチャット内で会話の流れに応じて外部のアプリを呼び出し、インタラクティブな操作を可能にする機能です。アプリごとに独自の UI コンポーネントを提供し、ユーザーはチャット画面からシームレスな体験でアプリを操作できます。この記事では Apps SDK を使用して、実際に ChatGPT 内で動作するシンプルなアプリを作成する手順を紹介します。"
createdAt: "2025-10-11T11:31+09:00"
updatedAt: "2025-10-11T11:31+09:00"
tags: ["ChatGPT", "MCP", "Apps SDK"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/34Gbimwdqs2CdCy2Znwg3a/1d75e490f22721332e1e486b62f8de4f/kakinoki_11232-768x768.png"
  title: "柿の木のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "UI コンポーネントを提供する Resource の Mime Type として正しいものはどれですか?"
      answers:
        - text: "text/html+skybridge"
          correct: true
          explanation: ""
        - text: "application/html"
          correct: false
          explanation: ""
        - text: "text/html+component"
          correct: false
          explanation: ""
        - text: "text/html+widget"
          correct: false
          explanation: ""
    - question: "ChatGPT の iframe 内で利用可能な window.openai オブジェクトのメソッドとして正しくないものはどれですか?"
      answers:
        - text: "callFunction()"
          correct: true
          explanation: "callFunction() というメソッドは存在しません。MCP サーバーのツールを呼び出すには callTool() メソッドを使用します。"
        - text: "callTool()"
          correct: false
          explanation: "callTool() は MCP サーバー上のツールを呼び出すための正しいメソッドです。"
        - text: "sendFollowUpMessage()"
          correct: false
          explanation: "sendFollowUpMessage() は ChatGPT の会話に追加のメッセージを送信するための正しいメソッドです。"
        - text: "setWidgetState()"
          correct: false
          explanation: "setWidgetState() はウィジェットの状態を永続化するための正しいメソッドです。"
    - question: "ツールと UI コンポーネント（Resource）を紐付けるために使用する _meta プロパティのキーは何ですか?"
      answers:
        - text: "openai/outputTemplate"
          correct: true
          explanation: "_meta['openai/outputTemplate'] に UI コンポーネントの URI を指定することで、ツールとリソースを紐付けます。"
        - text: "openai/resourceTemplate"
          correct: false
          explanation: "openai/resourceTemplate というキーは存在しません。"
        - text: "openai/uiComponent"
          correct: false
          explanation: "openai/uiComponent というキーは存在しません。"
        - text: "openai/widgetUri"
          correct: false
          explanation: "openai/widgetUri というキーは存在しません。"

published: true
---

Apps in ChatGPT は ChatGPT のチャット内で会話の流れに応じて外部のアプリを呼び出し、インタラクティブな操作を可能にする機能です。アプリごとに独自の UI コンポーネントを提供し、ユーザーはチャット画面からシームレスな体験でアプリを操作できます。

例えば「Booking.com, 箱根の旅行を提案して」といったプロンプトを入力すると、ChatGPT は Booking.com のアプリを呼び出して箱根のホテルの一覧をカスタム UI コンポーネントとして表示し、ユーザーはその中からホテルを選択して予約を進めることができます。これは新しいフロントエンド開発のパラダイムとも言えるもので、LLM がユーザーの意図を理解して適切なアプリを呼び出し、ユーザーはそのアプリの UI を通じて操作するという流れが自然に実現されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Bk27X49pirbRIk3UAmyC4/5b1859f5e32b92b30facc7efed58d64e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_11.48.30.png)

Apps in ChatGPT では [MCP（Model Context Protocol）](https://modelcontextprotocol.org/) を基盤とした Apps SDK を利用して構築されます。開発者は MCP を拡張することで、アプリケーションのロジックと UI コンポーネントを設計できます。この記事では Apps SDK を使用して、実際に ChatGPT 内で動作するシンプルなアプリを作成する手順を紹介します。

## MCP サーバーを構築する

MCP サーバーは App SDK の中心的なコンポーネントで、LLM が呼び出すツールを公開したり、ChatGPT に表示する UI コンポーネントを定義したりします。MCP サーバーの構築は公式で提供されている SDK を利用すると良いでしょう。ここでは [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) を使用して MCP サーバーを構築する手順を説明します。

### MCP サーバーのプロジェクトを作成する

まずは新しいディレクトリを作成し、Node.js のプロジェクトを初期化します。

```bash
mkdir my-chatgpt-app
cd my-chatgpt-app
npm init -y
```

TypeScript SDK（`@modelcontextprotocol/sdk`）と開発に必要なパッケージをインストールします。HTTP サーバーとして [Hono](https://hono.dev/) フレームワークを使用するために、`hono`、`@hono/mcp`、`@hono/node-server` パッケージもインストールします。

```bash
npm install @modelcontextprotocol/sdk zod hono @hono/mcp @hono/node-server
npm install -D typescript tsx
```

サーバーを起動するためのスクリプトを `package.json` に追加します。

```json:package.json
{
  "scripts": {
    "start": "tsx src/server.ts"
  }
}
```

### MCP サーバーの Resource とツールを定義する

`src/server.ts` ファイルを作成して MCP サーバーの実装を始めます。UI コンポーネントは MCP サーバーの [Resource](https://modelcontextprotocol.io/specification/2025-06-18/server/resources) として定義されます。Resource は、サーバーがクライアントにファイルやデータベーススキーマといったリソースを標準化された方法で提供する仕組みであり、`file://path/to/resource` や `db://my-database` といった一意な URI で識別されます。

ここでは Resource として HTML を提供することになります。Mime Type は `text/html+skybridge` で URI は `ui://xxx` といった形式になります。Resource は `server.registerResource` メソッドで登録します。

```typescript:src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const server = new McpServer({
  name: "todo-app",
  version: "0.1.0",
});

const todos = [
  { id: 1, title: "買い物に行く", completed: false },
  { id: 2, title: "散歩する", completed: true },
];

const html = `
<div>
  <h1>Todo List</h1>
  <ul>
    ${todos
      .map(
        (todo) => `
      <li>
        <input type="checkbox" ${todo.completed ? "checked" : ""} />
        ${todo.title}
      </li>
    `
      )
      .join("")}
  </ul>
</div>
`;

server.registerResource(
  "todo-list-widget",
  "ui://widget/todo-list.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://widget/kanban-board.html",
        mimeType: "text/html+skybridge",
        text: html,
        _meta: {
          // コンポーネントの説明。LLM がコンポーネントを選択する際の参考にする
          "openai/widgetDescription": "Simple Todo List",
        }
      },
    ],
  })
);
```

続いて UI コンポーネントを呼び出すツールを定義します。ツールが UI コンポーネントを呼び出せるようにするために `_meta` プロパティの `openai/outputTemplate` に UI コンポーネントの URI を指定してツールとリソースを紐付けます。

`_meta["openai/toolInvocation/invoking"]` と `_meta["openai/toolInvocation/invoked"]` はツールの呼び出し前と呼び出し後に ChatGPT が表示するメッセージを指定します。

```typescript:src/server.ts
server.registerTool(
  "todo-list",
  {
    title: "Show Todo List",
    annotations: {
      // ツールが状態を変更しないことを示す
      readOnlyHint: true,
    },
    _meta: {
      // Resource の URI を指定してツールとリソースを紐付ける
      "openai/outputTemplate": "ui://widget/todo-list.html",
      "openai/toolInvocation/invoking": "Displaying the list of todos",
      "openai/toolInvocation/invoked": "Displayed the list of todos"
    },
    inputSchema: {}
  },
  async () => {
    return {
      content: [{ type: "text", text: "Displayed the todo list!" }],
      structuredContent: {}
    };
  }
);
```

### MCP を HTTP サーバーとして起動する

最後に MCP サーバーを HTTP サーバーとして起動します。[@hono/mcp](https://www.npmjs.com/package/@hono/mcp) パッケージを使用すると簡単に MCP サーバーを HTTP Streamable Transport として公開できます。

```typescript:src/server.ts
import { StreamableHTTPTransport } from "@hono/mcp";
import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello, MCP Server is available at /mcp");
});

app.all("/mcp", async (c) => {
  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  return transport.handleRequest(c);
});

serve(app);
```

MCP サーバーを起動します。

```bash
npm start
```

http://localhost:3000 でアプリケーションを起動しましたが、ChatGPT にアプリを接続するためには、MCP サーバーが HTTPS でインターネットからアクセス可能である必要があります。ローカル環境で開発している場合は [ngrok](https://ngrok.com/) などのツールを使用して一時的に公開することができます。ngrok のサイトにアクセスしてアカウントを作成し、ngrok CLI をインストールして認証トークンを設定してください。

以下のコマンドでローカルの 3000 番ポートをインターネットに公開します。

```bash
ngrok http 3000
```

ngrok が発行する URL（例: `https://xxxxxx.ngrok-free.app`）を控えておきましょう。

### ChatGPT にアプリを接続する

ChatGPT にアプリを接続するには ChatGPT の[開発者モード](https://platform.openai.com/docs/guides/developer-mode)を有効にする必要があります。開発者モードは Pro、Plus、Business、Enterprise、Education のいずれかのプランで利用可能です。ChatGPT の [Settings → アプリとコネクター](https://chatgpt.com/#settings/Connectors)の下にある「高度な設定」をクリックし、「開発者モード」をオンにします。

![](https://images.ctfassets.net/in6v9lxmm5c8/6E2eKIDxCivsNuWUEQgTUJ/20e8fa1af23c470f83d99494612a87f4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_13.11.39.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/53oulVPttwJoolizt3YJwA/39d35ea2f853d3fd002b7ec52011b496/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_13.12.13.png)

[Settings → アプリとコネクター](https://chatgpt.com/#settings/Connectors)の画面に戻り、上部の「作成する」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/6i8jHFv7aOF0oTTTB2yynU/6a6f5ed039991cd62052a7a0c486a852/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_13.14.20.png)

ツールの登録画面が表示されるので、以下のように入力します。

- 名前: `My Todo App`
- 説明: `A simple todo app`
- MCP サーバー URL: `ngrok` で発行された URL（例: `https://xxxxxx.ngrok-free.app/mcp`）
- 認証方式: `認証なし`

![](https://images.ctfassets.net/in6v9lxmm5c8/433S6uGlmw8rNYQKuhxhMS/1a5a03682fec1c252c351ffb05fed40e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_13.16.54.png)

「作成する」ボタンをクリックするとアプリが登録されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/47XW08coVDGKDBImycgeD3/45cdcce1b37eee12b962d56c2fb88047/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_13.20.20.png)

「My Todo App, TODO の一覧を表示して」といったプロンプトを入力すると、ChatGPT が MCP サーバーに登録されている `todo-list` ツールを呼び出し、先程定義した UI コンポーネントがチャット内に表示されます。この UI コンポーネントは iframe 内にレンダリングされており、ユーザーはチャット画面からチェックボックスを操作することができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/138Oy2HVmSBs4Qu72WVySI/814030cc0ef88e7d639d1a7937b0cab5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_13.23.13.png)

## ユーザーインタラクションを処理する複雑な UI コンポーネントを実装する

上記の例ではシンプルな HTML を Resource として提供しましたが、実際のアプリケーションではチェックボックスをクリックしたときに状態を更新したり、Todo の追加や削除をしたりといったインタラクティブな操作が必要になるでしょう。また ChatGPT のテーマ(ライトモード/ダークモード)に合わせてスタイルを変更したり、レスポンシブデザインに対応したりすることも求められます。

UI コンポーネントがユーザーとのインタラクションを処理するためには、`window.openai` オブジェクトを使用します。`window.openai` オブジェクトは ChatGPT の iframe 内で利用可能なグローバルオブジェクトで、以下のプロパティとメソッドが利用可能です。

### プロパティ

- `theme` - ChatGPT の現在のテーマ設定(ライト/ダークモード等)
- `displayMode` - 表示モード(インライン/フルスクリーン/PiP)
- `maxHeight` - UI コンポーネントの最大高さ
- `safeArea` - セーフエリア情報(デバイスのノッチやホームインジケーターを避けるための領域)
- `userAgent` - ユーザーエージェント情報
- `locale` - ユーザーのロケール設定(言語や地域)
- `toolInput` - ツール呼び出し時の入力データ
- `toolOutput` - ツール実行結果の出力データ
- `toolResponseMetadata` - ツールレスポンスのメタデータ
- `widgetState` - ウィジェットの永続化された状態

### メソッド

- `callTool(name, args)` - MCP サーバー上のツールを呼び出し、完全なレスポンスを返す
- `sendFollowUpMessage({ prompt })` - ChatGPT の会話に追加のメッセージを送信してターンを継続
- `openExternal({ href })` - 外部リンクを開く(Web ページまたはモバイルアプリへリダイレクト)
- `requestDisplayMode({ mode })` - 表示モードの変更をリクエスト(インライン⇔フルスクリーン⇔PiP)
- `setWidgetState(state)` - ウィジェットの状態を永続化

### イベントリスナー

- `openai:set_globals` イベント - グローバル設定が変更されたときに発火する `SetGlobalsEvent`

### React で UI コンポーネントを実装する

ここからは `window.openai` オブジェクトと React を使用して、より複雑な UI コンポーネントを実装する方法を紹介します。コンポーネントを作成するプロジェクトを新しく作成します。ベストプラクティスとして、コンポーネントのコードとサーバーのロジックは分離することが推奨されています。新しいプロジェクトの構造は以下のようになります。

```bash
my-chatgpt-app/
├── server/ # MCP サーバーのコード
│   └── src/
│       └── server.ts # サーバーのエントリポイント
│       └── package.json
│       └── package-lock.json
└── web/ # UI コンポーネントのコード
    ├── dist/ # ビルド成果物を出力するディレクトリ
    ├── src/
    │   └── components/ # React コンポーネント
    │       └── App.tsx # アプリのエントリポイント
    └── package.json
    └── package-lock.json
```

`web` ディレクトリに移動して React プロジェクトを初期化します。

```bash
cd web
npm init -y
npm install react react-dom tailwindcss
npm install -D typescript @types/react @types/react-dom esbuild esbuild-plugin-tailwindcss
```

`tsconfig.json` ファイルを作成して TypeScript の設定を追加します。

```json:tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

`src/index.css` ファイルを作成して Tailwind CSS をインポートします。

```css:src/index.css
@import "tailwindcss";
```

`src/types.ts` ファイルを作成して `window.openai` の型定義を追加します。

```typescript:src/types.ts
export type OpenAiGlobals<
  ToolInput = UnknownObject,
  ToolOutput = UnknownObject,
  ToolResponseMetadata = UnknownObject,
  WidgetState = UnknownObject
> = {
  // visuals
  theme: Theme;

  userAgent: UserAgent;
  locale: string;

  // layout
  maxHeight: number;
  displayMode: DisplayMode;
  safeArea: SafeArea;

  // state
  toolInput: ToolInput;
  toolOutput: ToolOutput | null;
  toolResponseMetadata: ToolResponseMetadata | null;
  widgetState: WidgetState | null;
  setWidgetState: (state: WidgetState) => Promise<void>;
};

// currently copied from types.ts in chatgpt/web-sandbox.
// Will eventually use a public package.
type API = {
  callTool: CallTool;
  sendFollowUpMessage: (args: { prompt: string }) => Promise<void>;
  openExternal(payload: { href: string }): void;

  // Layout controls
  requestDisplayMode: RequestDisplayMode;
};

export type UnknownObject = Record<string, unknown>;

export type Theme = "light" | "dark";

export type SafeAreaInsets = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type SafeArea = {
  insets: SafeAreaInsets;
};

export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export type UserAgent = {
  device: { type: DeviceType };
  capabilities: {
    hover: boolean;
    touch: boolean;
  };
};

/** Display mode */
export type DisplayMode = "pip" | "inline" | "fullscreen";
export type RequestDisplayMode = (args: { mode: DisplayMode }) => Promise<{
  /**
   * The granted display mode. The host may reject the request.
   * For mobile, PiP is always coerced to fullscreen.
   */
  mode: DisplayMode;
}>;

export type CallToolResponse = {
  result: string;
};

/** Calling APIs */
export type CallTool = (
  name: string,
  args: Record<string, unknown>
) => Promise<CallToolResponse>;

/** Extra events */
export const SET_GLOBALS_EVENT_TYPE = "openai:set_globals";
export class SetGlobalsEvent extends CustomEvent<{
  globals: Partial<OpenAiGlobals>;
}> {
  readonly type = SET_GLOBALS_EVENT_TYPE;
}

/**
 * Global oai object injected by the web sandbox for communicating with chatgpt host page.
 */
declare global {
  interface Window {
    openai: API & OpenAiGlobals;
  }

  interface WindowEventMap {
    [SET_GLOBALS_EVENT_TYPE]: SetGlobalsEvent;
  }
}
```

React コンポーネントから `window.openai` オブジェクトを使用するために、`src/useOpenAi.ts` ファイルを作成してカスタムフックを実装します。

```typescript:src/useOpenAi.ts
// ref: https://github.com/openai/openai-apps-sdk-examples/blob/bebecf5cf2205c3ab1949edec54197ae0cc1613e/src/use-openai-global.ts
import { useSyncExternalStore } from "react";
import {
  SET_GLOBALS_EVENT_TYPE,
  SetGlobalsEvent,
  type OpenAiGlobals,
} from "./types";

export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] | null {
  return useSyncExternalStore(
    (onChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      const handleSetGlobal = (event: SetGlobalsEvent) => {
        const value = event.detail.globals[key];
        if (value === undefined) {
          return;
        }

        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal);
      };
    },
    () => window.openai?.[key] ?? null,
    () => window.openai?.[key] ?? null
  );
}
```

TODO リストを表示するコンポーネントと、新しい TODO を追加するフォームをそれぞれ作成します。TODO の状態は MCP サーバーでメモリ上で保存しておき、UI からはツールの呼び出し結果である `window.openai.toolOutput` を情報源として使用します。`window.openai.toolOutput` はツールが呼び出されたときに MCP サーバーから返されるレスポンス（`content`、`structuredContent`）にアクセスできます。

`src/todo-list/TodoList.tsx` ファイルを作成して TODO リストを表示するコンポーネントを実装します。`toolOutput` プロパティに MCP サーバーのツール呼び出し結果が格納されるので、これを使用して TODO リストを表示します。またチェックボックスがクリックされたとき、`window.openai.callTool` メソッドで MCP サーバーの `toggle-todo` ツールを呼び出して状態を更新します。

```tsx:src/components/todo-list/TodoList.tsx
import React from "react";
import { useOpenAiGlobal } from "../useOpenAi";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export const TodoList: React.FC = () => {
  // window.openai.toolOutput を購読
  const toolOutput = useOpenAiGlobal("toolOutput");
  const initialTodos = toolOutput ? toolOutput.result.structuredContent.todos : [];

  const [todos, setTodos] = React.useState<Todo[]>(initialTodos);

  React.useEffect(() => {
    // toolOutput が更新されたときに todos を更新
    // 最初は toolOutput に undefined が入っているので、useEffect で変更を検知して更新する必要がある
    if (toolOutput?.result?.structuredContent?.todos) {
      setTodos(toolOutput.result.structuredContent.todos);
    }
  }, [toolOutput]);

  const toggleTodo = async (id: number) => {
    try {
      // MCP サーバーの toggle-todo ツールを呼び出し
      // ツールはこの後で定義する
      const result = await window.openai.callTool("toggle-todo", { id });

      // サーバーからの結果に基づいて状態を更新
      if (result?.structuredContent?.todo) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? result.structuredContent.todo : todo
          )
        );
      }
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={todo.completed ? "line-through" : ""}>
              {todo.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

Resorce として定義するコンポーネントの単位ごとにアプリケーションのエンドポイントを作成する必要があります。`src/list-todo/index.tsx` ファイルを作成して TODO リストのコンポーネントを `#todo-list-root` にマウントします。

```typescript:src/components/todo-list/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { TodoList } from "./TodoList";
import "../index.css";

const container = document.getElementById("todo-list-root");
if (container) {
  const root = createRoot(container);
  root.render(<TodoList />);
}
```

TODO を作成するフォームも同様の手順で実装します。`src/add-todo-form/AddTodoForm.tsx` ファイルを作成して TODO の追加フォームを実装します。フォームが送信されたときに MCP サーバーの `add-todo` ツールを呼び出して状態を更新します。

```tsx:src/components/add-todo-form/AddTodoForm.tsx
import React, { useState } from "react";

export const AddTodoForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      await window.openai.callTool("add-todo", { title });
      setTitle("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={addTodo} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New todo"
        className="border p-2 mr-2 w-64"
      />
      <button type="submit" className="bg-blue-500 text-white p-2" disabled={loading}>
        {loading ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
};
```

`src/add-todo-form/index.ts` ファイルを作成して TODO 追加フォームのコンポーネントを `#add-todo-form-root` にマウントします。

```typescript:src/components/add-todo-form/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { AddTodoForm } from "./AddTodoForm";
import "../index.css";

const container = document.getElementById("add-todo-form-root");
if (container) {
  const root = createRoot(container);
  root.render(<AddTodoForm />);
}
```

作成したコンポーネントをそれぞれ esbuild でビルドするスクリプトを `build.mjs` ファイルに実装します。

```javascript:build.mjs
import * as esbuild from "esbuild";
import tailwindPlugin from "esbuild-plugin-tailwindcss";

async function build() {
  const commonOptions = {
    bundle: true,
    loader: { ".tsx": "tsx", ".ts": "ts", ".css": "css" },
    jsx: "automatic",
    platform: "browser",
    target: "es2020",
    minify: true,
    sourcemap: true,
    external: ["tailwindcss"],
    plugins: [tailwindPlugin()],
  };

  try {
    // Build add-todo-form
    await esbuild.build({
      ...commonOptions,
      entryPoints: ["src/add-todo-form/index.tsx"],
      outfile: "dist/add-todo-form.js",
    });
    console.log("✓ add-todo-form.js built successfully");

    // Build todo-list
    await esbuild.build({
      ...commonOptions,
      entryPoints: ["src/todo-list/index.tsx"],
      outfile: "dist/todo-list.js",
    });
    console.log("✓ todo-list.js built successfully");

    console.log("\nBuild completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
```

`package.json` にビルド用のスクリプトを追加します。

```json:package.json
{
  "scripts": {
    "build": "node build.mjs"
  }
}
```

`npm run build` コマンドでビルドを実行します。`dist` ディレクトリに js, css ファイルが出力されることを確認してください。ここで出力したファイルは MCP サーバーの Resource として提供します。

```bash
npm run build
```

```bash
dist
├── add-todo-form.css
├── add-todo-form.css.map
├── add-todo-form.js
├── add-todo-form.js.map
├── todo-list.css
├── todo-list.css.map
├── todo-list.js
└── todo-list.js.map
```

### MCP サーバーの実装を更新する

`server/src/server.ts` ファイルを更新して、ビルドしたファイルを Resource として登録します。`readFileSync` でビルドしたファイルを読み込み、HTML のテンプレートに埋め込んで Resource として登録します。

```typescript:server/src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { readFileSync } from "fs";
import { serve } from "@hono/node-server";

const server = new McpServer({
  name: "todo-app",
  version: "0.1.0",
});

const todoListJS = readFileSync(
  "../web/dist/todo-list.js",
  "utf-8"
);
const todoListCSS = readFileSync(
  "../web/dist/todo-list.css",
  "utf-8"
);

const todoListHTML = `
<div id="todo-list-root"></div>
<style>${todoListCSS}</style>
<script>${todoListJS}</script>
`;

server.registerResource(
  "todo-list-widget",
  "ui://widget/todo-list.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://widget/todo-list.html",
        mimeType: "text/html+skybridge",
        text: todoListHTML,
        _meta: {
          "openai/widgetDescription": "Simple Todo List",
        },
      },
    ],
  })
);

const addTodoFormJS = readFileSync(
  "../web/dist/add-todo-form.js",
  "utf-8"
);
const addTodoFormCSS = readFileSync(
  "../web/dist/add-todo-form.css",
  "utf-8"
);

const addTodoFormHTML = `
<div id="add-todo-form-root"></div>
<style>${addTodoFormCSS}</style>
<script>${addTodoFormJS}</script>
`;

server.registerResource(
  "add-todo-form-widget",
  "ui://widget/add-todo-form.html",
  {},
  async () => ({
    contents: [
      {
        uri: "ui://widget/add-todo-form.html",
        mimeType: "text/html+skybridge",
        text: addTodoFormHTML,
        _meta: {
          "openai/widgetDescription": "Form to add a new todo",
        },
      },
    ],
  })
);
```

TODO リストを表示するツールと、TODO を追加するフォームを表示するツールを登録します。TODO リストを表示するツールでは `toolOutput` プロパティで TODO の一覧にアクセスできるように、`structuredContent` に `todos` プロパティを含めたオブジェクトを返すようにします。

```typescript:server/src/server.ts
import { z } from "zod";

server.registerTool(
  "todo-list",
  {
    title: "Show Todo List",
    annotations: {
      readOnlyHint: true,
    },
    _meta: {
      "openai/outputTemplate": "ui://widget/todo-list.html",
      "openai/toolInvocation/invoking": "Displaying the list of todos",
      "openai/toolInvocation/invoked": "Displayed the list of todos",
    },
    inputSchema: {},
    outputSchema: {
      todos: z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          completed: z.boolean(),
        })
      ),
    },
  },
  async () => {
    return {
      content: [{ type: "text", text: JSON.stringify(todos) }],
      structuredContent: { todos },
    };
  }
);

server.registerTool(
  "todo-form",
  {
    title: "Todo Form",
    _meta: {
      "openai/outputTemplate": "ui://widget/add-todo-form.html",
      "openai/toolInvocation/invoking": "Displaying the add todo form",
      "openai/toolInvocation/invoked": "Displayed the add todo form",
    },
    inputSchema: {},
  },
  async () => {
    return {
      content: [{ type: "text", text: "Displayed the add todo form!" }],
      structuredContent: {},
    };
  }
);
```

最後に、TODO の状態を変更するためのツールを登録します。`add-todo` ツールで新しい TODO を追加し、`toggle-todo` ツールで TODO の完了状態を切り替えます。

```typescript:server/src/server.ts
server.registerTool(
  "add-todo",
  {
    title: "Add Todo",
    annotations: {
      readOnlyHint: false,
    },
    inputSchema: {
      title: z.string(),
    },
    outputSchema: {
      id: z.number(),
      title: z.string(),
      completed: z.boolean(),
    },
  },
  async (args) => {
    const { title } = args;
    const newTodo = {
      id: todos.length + 1,
      title,
      completed: false,
    };
    todos.push(newTodo);
    return {
      content: [{ type: "text", text: JSON.stringify(newTodo) }],
      structuredContent: newTodo,
    };
  }
);

server.registerTool(
  "toggle-todo",
  {
    title: "Toggle Todo",
    annotations: {
      readOnlyHint: false,
    },
    inputSchema: z.object({
      id: z.number(),
    }),
    outputSchema: z.object({
      id: z.number(),
      title: z.string(),
      completed: z.boolean(),
    }),
  },
  async (args) => {
    const { id } = args;
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      return {
        content: [{ type: "text", text: JSON.stringify(todo) }],
        structuredContent: todo,
      };
    } else {
      throw new Error("Todo not found");
    }
  }
);
```

作成した MCP サーバーを [@modelcontextprotocol/inspector](https://github.com/modelcontextprotocol/inspector) でテストしておきましょう。まずは MCP サーバーを起動します。

```bash
cd ../server
npm start
```

別のターミナルで Inspector を起動します。

```bash
npx @modelcontextprotocol/inspector
```

Inspector の画面で Transport Type に `Streamable HTTP` を選択し、URL に `http://localhost:3000/mcp` を入力して「Connect」ボタンをクリックします。実装したツールが一覧に表示されることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/NLnWaBoLyZV7D3yA2XeCc/894de797cd8b9c28a76c0f6f1e4b100d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_15.53.03.png)

### アプリケーションの動作確認と ChatGPT への接続

ツールが問題なく動作することを確認したら、再度 `ngrok` でインターネットに公開し、ChatGPT にアプリを接続します。

```bash
ngrok http 3000
```

ChatGPT の [Settings → アプリとコネクター](https://chatgpt.com/#settings/Connectors) の画面で、先程作成したアプリを選択し、「更新する」ボタンをクリックして最新のツール情報を取得します。

![](https://images.ctfassets.net/in6v9lxmm5c8/1cafXS1o4air7H79edgyhR/2212412ea5bff22cf25ffcd9d3d5abb3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_16.17.57.png)

「todo app, TODO の一覧を表示して」といったプロンプトを入力すると、ChatGPT が MCP サーバーの `todo-list` ツールを呼び出し、TODO リストがチャット内に表示されます。チェックボックスをクリックすると MCP サーバーの `toggle-todo` ツールが呼び出され、状態が更新されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/24fPwjMwv2bUx4qgkLS3lX/437e31522f04a31a3c852f26acc6658a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_16.13.00.png)

TODO を追加するフォームも同様に動作します。TODO フォームの input フィールドにタイトルを入力して「Add Todo」ボタンをクリックすると、MCP サーバーの `add-todo` ツールが呼び出され、TODO が追加されます。TODO が追加された後、`todo-list` ツールを再度呼び出して最新の状態を取得してみてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/1mYgRjN6ByRRRSp1S98Fr7/96c7e61668d33370c35ca164eb56b8f6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-11_16.02.26.png)

ここまで作成したアプリケーションのソースコードは以下のリポジトリで公開しています。

https://github.com/azukiazusa1/appis-in-chatgpt-example

## まとめ

- Apps in ChatGPT は、ChatGPT のチャット内で外部アプリを呼び出し、インタラクティブな操作を可能にする機能
- Apps SDK は MCP（Model Context Protocol）を基盤として構築されており、開発者は MCP サーバーを通じてアプリケーションのロジックと UI を定義する
- UI コンポーネントは MCP サーバーの Resource として定義し、Mime Type は `text/html+skybridge`、URI は `ui://xxx` の形式で提供し、HTML を返す
- ツールと UI コンポーネントは `_meta['openai/outputTemplate']` で紐付ける
- ChatGPT の開発者モードを有効にすることで、ChatGPT に自作のアプリを接続してテストすることができる
  - ローカル開発では ngrok などのツールを使用して、HTTPS でインターネットからアクセス可能な環境を構築する
- `window.openai` オブジェクトを使用することで、UI コンポーネント内からツールの呼び出しや状態管理、テーマ設定の取得などが可能になる

## 参考

- [Introducing apps in ChatGPT and the new Apps SDK | OpenAI](https://openai.com/index/introducing-apps-in-chatgpt/)
- [Apps SDK](https://developers.openai.com/apps-sdk)
- [openai/openai-apps-sdk-examples: Example apps for the Apps SDK](https://github.com/openai/openai-apps-sdk-examples?tab=readme-ov-file)
