---
id: tqUUbFPym6ctpt_Nj49OM
title: "Web アプリケーションをツール化する WebMCP"
slug: "webmcp-for-web-applications"
about: "WebMCP は Web 開発者が Web アプリケーションの機能をツールとして公開できるようにする JavaScript インターフェイスです。これにより AI エージェントが Web アプリケーションの機能を直接呼び出して操作できるようになります。"
createdAt: "2026-02-11T10:44+09:00"
updatedAt: "2026-02-11T10:44+09:00"
tags: ["WebMCP", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/65TrechUrWFd1G3NMcRPsl/6c70bdf868b60edcfc72230addc8f76a/image.png"
  title: "ライチョウのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "WebMCP で MCP ツールをブラウザに登録する命令的な方法として正しいものはどれか？"
      answers:
        - text: "window.navigator.modelContext.createTool() メソッドを使用する"
          correct: false
          explanation: null
        - text: "window.navigator.modelContext.provideContext() メソッドを使用する"
          correct: true
          explanation: "命令的な方法では window.navigator.modelContext オブジェクトの provideContext メソッドを使用して MCP ツールを登録します。"
        - text: "document.registerMCPTool() メソッドを使用する"
          correct: false
          explanation: null
        - text: "window.navigator.addTool() メソッドを使用する"
          correct: false
          explanation: null
    - question: "フォームの要素に toolparamdescription 属性が設定されていない場合、引数の説明として使用されるものはどれか？"
      answers:
        - text: "<label> 要素の内容もしくは aria-description 属性の値"
          correct: true
          explanation: "toolparamdescription 属性が設定されていない場合は <label> 要素の内容もしくは aria-description 属性の値が説明として使用されます。"
        - text: "name 属性の値"
          correct: false
          explanation: "name 属性の値は toolparamtitle が設定されていない場合のタイトルとして使用されます。説明ではありません。"
        - text: "placeholder 属性の値"
          correct: false
          explanation: null
        - text: "title 属性の値"
          correct: false
          explanation: null
    - question: "toolautosubmit 属性を使用してフォームが AI エージェントによって自動送信された場合、SubmitEvent のどのプロパティが true に設定されるか？"
      answers:
        - text: "agentInvoked"
          correct: true
          explanation: "toolautosubmit 属性を使用しツールが呼び出された時にフォームが自動でサブミットされている場合、SubmitEvent の agentInvoked プロパティが true に設定されます。"
        - text: "autoSubmitted"
          correct: false
          explanation: null
        - text: "isTrusted"
          correct: false
          explanation: null
        - text: "toolActivated"
          correct: false
          explanation: null
published: true
---
WebMCP は Web 開発者が Web アプリケーションの機能をツールとして公開できるようにする JavaScript インターフェイスです。これは AI エージェントや支援技術から呼び出せる自然言語による説明と構造化スキーマを備えた JavaScript 関数です。WebMCP を使用する Web アプリケーションは [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) サーバーとみなすことができます。これにより従来の AI エージェントがウェブページのスクリーンショットを解析して情報を取得するのではなく、Web アプリケーションが提供するツールを直接呼び出して操作できるようになるため、より正確で効率的なインタラクションが可能になります。

## WebMCP を実装する

WebMCP を実装するための JavaScript API を利用するためには Chrome 146 以降が必要です。[Chrome Canary](https://www.google.com/intl/ja/chrome/canary/) のような最新の Chrome ビルドを使用してください。さらに `chrome://flags#webmcp-for-testing` フラグを有効にする必要があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3stJ6p1OWmJ5NDVBSdzeMG/e57aaa97587505ba7f6ce722d76bf44d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-11_11.02.19.png)

MCP ツールをテストするためには Chrome 拡張機能として提供されている [Model Context Tool Inspector](https://chromewebstore.google.com/detail/model-context-tool-inspec/gbpdfapgefenggkahomfgkhfehlcenpd?pli=1) をインストールします。この拡張機能は Web ページに登録された MCP ツールを一覧表示し、ツールの入力スキーマに基づいて引数を指定して手動でツールを呼び出すことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/18CLDElOG5ep068CmwOJuG/4a9427e78dc7ebce2a62af1c9f1cc809/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-11_11.41.57.png)

WebMCP では開発者が WebMCP API のメソッドを使用して MCP ツールをブラウザに登録します。AI エージェントがツールを呼び出せるようにするために、自然言語の説明と JSON スキーマを提供します。Web アプリケーションに接続された AI エージェントがツールの呼び出しを要求すると、ツールに登録した JavaScript コールバック関数が呼び出されエージェントに結果が返されます。シンプルなアプリケーションではページ内のスクリプトで処理を完結できますが、より複雑なアプリケーションでは計算負荷の高い処理を [Web Worker](https://developer.mozilla.org/ja/docs/Web/API/Web_Workers_API/Using_web_workers) にオフロードして非同期で結果を返すことも可能です。

MCP ツールをブラウザに登録する方法は命令的な方法と宣言的な方法の 2 種類があります。

### 命令的な方法

命令的な方法では `window.navigator.modelContext` オブジェクトの `provideContext` メソッドを使用します。

```javascript
window.navigator.modelContext.provideContext({
  tools: [
    {
      name: "add-todo",
      description: "Add a new todo item to the list",
      inputSchema: {
        type: "object",
        properties: {
          text: { type: "string", description: "The text of the todo item" },
        },
        required: ["text"],
      },
      execute: async ({ text }) => {
        console.log(`Adding todo: ${text}`);
        addTask(text);
        return { content: [{ type: "text", text: `Added todo: ${text}` }] };
      },
    },
  ],
});
```

上記の例では `add-todo` という名前の MCP ツールを登録しています。このツールは `text` プロパティを持つオブジェクトを引数として受け取り、`execute` コールバック関数内で新しいタスクを追加する処理を実行します。ツール名は一意である必要があります。Model Context Tool Inspector を使用して登録されたツールを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3T4ePjHIwWDHksBslM3iIM/27c8b53403010de6d27e9b11dcef3425/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-11_11.57.24.png)

Gemini API キーを登録し、「映画館に行く予定を追加」といったプロンプトを入力すると、AI エージェントが `add-todo` ツールを呼び出してタスクを追加する様子を確認できます。AI エージェントを介さずに直接ツールを呼び出すことも可能です。

![](https://videos.ctfassets.net/in6v9lxmm5c8/1UaYniQa0kjWgKmGl3Wn3v/fda6487648564961aeccad63b0891795/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-11_12.50.37.mov)

`provideContext` メソッドは複数回呼び出すことができ、新しく呼び出すたびに既存のツールはクリアされます。この挙動は UI が頻繁に更新されるシングルページアプリケーションに適しています。既存のツールを保持しつつ新しいツールを追加・削除したい場合には `registerTool` と `unregisterTool` メソッドを使用します。

```javascript
// ツールの登録
window.navigator.modelContext.registerTool({
  name: "add-todo",
  description: "Add a new todo item to the list",
  inputSchema: {
    type: "object",
    properties: {
      text: { type: "string", description: "The text of the todo item" },
    },
    required: ["text"],
  },
  execute: async ({ text }) => {
    console.log(`Adding todo: ${text}`);
    addTask(text);
    return { content: [{ type: "text", text: `Added todo: ${text}` }] };
  },
});

// ツールの登録解除
window.navigator.modelContext.unregisterTool("add-todo");
```

### 宣言的な方法

宣言的な方法は HTML 属性を追加することでフォームを自動で WebMCP ツールとして登録する方法です。`<form>` 要素に `toolname` と `tooldescription` 属性を追加します。フォーム内の各入力要素はツールの引数として自動的にマッピングされ、入力要素の `name` 属性が引数名として使用されます。`required` 属性が指定されている入力要素は必須引数としてマークされるように、フォームのバリデーション属性も自動的にスキーマに反映されます。

またオプショナルな属性として、フォームの各入力要素に `toolparamtitle` と `toolparamdescription` 属性を指定して引数のタイトルと説明を追加できます。`toolparamtitle` 属性が設定されていない場合は `name` 属性の値がタイトルとして使用されます。`toolparamdescription` 属性が設定されていない場合は `<label>` 要素の内容もしくは `aria-description` 属性の値が説明として使用されます。

```html
<form
  toolname="add-todo-item"
  tooldescription="Add a new todo item to the list"
>
  <input
    name="text"
    type="text"
    toolparamtitle="Todo Text"
    toolparamdescription="The text of the todo item"
    required
  />
  <button type="submit">Add Todo</button>
</form>
```

このフォームは以下のように WebMCP ツールとして登録されます。

```json
[
  {
    "name": "add-todo-item",
    "description": "Add a new todo item to the list",
    "inputSchema": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "title": "Todo Text",
          "description": "The text of the todo item"
        }
      },
      "required": ["text"]
    }
  }
]
```

AI エージェントがツールを呼び出すと、ブラウザは関連するフォームにフォーカスし、そのフィールドに入力内容を反映します。デフォルトではフォームは送信されず、ユーザーが手動で送信する必要があります。`toolautosubmit` 属性が設定されている場合、フォームは自動的に送信されます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7uxXtkHJKeMjNbNMZQnLak/e97224a9a3f9aad83ec44a708ffe7ee2/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-11_12.21.43.mov"></video>

`toolautosubmit` 属性を使用しツールが呼び出された時にフォームが自動でサブミットされている場合、[SubmitEvent](https://developer.mozilla.org/ja/docs/Web/API/SubmitEvent) の `agentInvoked` プロパティが `true` に設定されます。これにより開発者はフォームが AI エージェントによって送信されたかどうかを判別できます。さらに `SubmitEvent` には `respondWith` メソッドが追加されており、AI エージェントにフォームの結果を返すために使用できます。

```javascript
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const text = formData.get("text").trim();

  addTask(text);
  taskInput.value = "";

  if (e.agentInvoked) {
    e.respondWith(Promise.resolve(`Added todo: ${text}`));
  }
  return;
});
```

### ツール関連のイベント

AI エージェントがツールを呼び出したときには `toolactivated` イベントが、ツールの実行がキャンセルされた（ユーザーがツールの使用を拒否した or フォームの `reset` ボタンが押された）ときには `toolcancel` イベントが発生します。

```javascript
window.addEventListener("toolactivated", ({ toolName }) => {
  console.log(`the tool "${toolName}" execution was activated.`);
});

window.addEventListener("toolcancel", ({ toolName }) => {
  console.log(`the tool "${toolName}" execution was cancelled.`);
});
```

### ツールが呼び出された場合の CSS 疑似クラス

AI エージェントがツールを呼び出したとき、以下の CSS 疑似クラスを使用してビジュアルフィードバックを提供できます。

- `:tool-form-active`: ツールが呼び出されたときに、対応する `toolname` 属性を持つフォーム要素に適用されます。
- `:tool-submit-active`: ツールが呼び出されたときにフォームの送信ボタンに適用されます。

```css
form:tool-form-active {
  border: 2px solid red;
  background-color: pink;
}

button:tool-submit-active {
  background-color: green;
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2sOOvH9pD5C2JWBApCPd3B/46bdf8e92a2b5697c6ae2a5779f22658/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-11_12.48.20.mov"></video>

## 参考

- [WebMCP](https://webmachinelearning.github.io/webmcp/)
- [webmachinelearning/webmcp: 🤖 WebMCP](https://github.com/webmachinelearning/webmcp)
- [webmcp/docs/proposal.md at main · webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp/blob/main/docs/proposal.md)
- [WebMCP Early Preview - Google ドキュメント](https://docs.google.com/document/d/1rtU1fRPS0bMqd9abMG_hc6K9OAI6soUy3Kh00toAgyk/edit?tab=t.0)
- [WebMCP - Chrome Platform Status](https://chromestatus.com/feature/5117755740913664)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools)
