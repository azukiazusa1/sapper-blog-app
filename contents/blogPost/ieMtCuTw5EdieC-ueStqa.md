---
id: ieMtCuTw5EdieC-ueStqa
title: "ChatGPT デスクトップの Codex から WebMCP 対応 TODO アプリを操作する"
slug: "chatgpt-desktop-codex-webmcp-todo-app"
about: "ChatGPT デスクトップの内蔵ブラウザが、Web サイトの機能を AI エージェント向けのツールとして公開する WebMCP に対応しました。この記事では WebMCP に対応した TODO アプリを実装し、Codex が呼び出した Site tools の引数や結果を実行履歴から確認します。"
createdAt: "2026-08-27T20:09+09:00"
updatedAt: "2026-08-27T20:09+09:00"
tags: ["ChatGPT", "WebMCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7qcc425wz9wdLaedC8UXex/2f4448230eb3bbf78b35b3ef0b8bbff7/strawberry-tart_21661-768x630.png"
  title: "いちごのタルトのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "現行の WebMCP で、ページから AI エージェント向けのツールを登録するために呼び出すメソッドはどれですか?"
      answers:
        - text: "document.modelContext.registerTool()"
          correct: true
          explanation: "記事のサンプルでは document.modelContext.registerTool() にツールの定義を渡して登録しています。戻り値は Promise なので await します。"
        - text: "navigator.modelContext.registerTool()"
          correct: false
          explanation: "登録メソッドが生えているのは navigator ではなく document.modelContext です。"
        - text: "window.mcp.provideContext()"
          correct: false
          explanation: "そのような API は存在しません。ツールは document.modelContext.registerTool() で 1 件ずつ登録します。"
        - text: "document.registerTool()"
          correct: false
          explanation: "document 直下ではなく document.modelContext のメソッドとして呼び出します。"
    - question: "記事の検証時点で、ChatGPT デスクトップの Site tools を利用できるモデルはどれですか?"
      answers:
        - text: "GPT-5.6 Luna のみ"
          correct: false
          explanation: "GPT-5.6 Luna では WebMCP が無効になっています。"
        - text: "GPT-5.6 Sol または GPT-5.6 Terra"
          correct: true
          explanation: "記事では Site tools の利用条件として GPT-5.6 Sol または GPT-5.6 Terra を挙げています。"
        - text: "GPT-5.6 Terra または GPT-5.6 Luna"
          correct: false
          explanation: "GPT-5.6 Terra は対応しますが、GPT-5.6 Luna は対応しません。"
        - text: "モデルに関係なくすべて利用できる"
          correct: false
          explanation: "利用可否にはモデルの条件があり、段階的なロールアウトにも依存します。"

published: true
---

b> document-modelcontext

AI エージェントが Web ページを操作するとき、画面上のボタンや入力欄を探してクリックする方法では安定性に欠け、トークンの消費も大きくなります。Web サイト側が「何を実行できるか」と「どのような引数が必要か」を構造化されたツールとして公開できれば、エージェントは画面を推測して操作する必要がありません。

[WebMCP](https://webmachinelearning.github.io/webmcp/) は、Web アプリケーションの機能を AI エージェントが呼び出せるツールとして公開するための JavaScript API です。AI エージェントは WebMCP で公開されたツールを呼び出すことにより、直接 Web アプリケーションのロジックを実行できます。

2026 年 8 月 25 日、ChatGPT デスクトップの内蔵ブラウザが [Site tools（WebMCP）](https://learn.chatgpt.com/docs/changelog#codex-2026-08-25-browser) に対応しました。ChatGPT Work と Codex は、内蔵ブラウザで開いている Web サイトが提供するツールを発見して呼び出せます。

この記事では、ChatGPT デスクトップの Codex から TODO の追加・完了・削除を依頼し、どのように WebMCP のツールが呼び出されているかを確認します。

:::warning
WebMCP は W3C Web Machine Learning Community Group が策定している提案仕様です。2026 年 8 月 27 日時点では W3C 標準でも W3C Standards Track 上の仕様でもなく、API は今後変更される可能性があります。
:::

## WebMCP の仕組み

WebMCP で公開するツールは、名前、タイトル、自然言語による説明、JSON Schema 形式の入力スキーマ、処理を実行するコールバック関数を持ちます。読み取り専用かどうかといった補足情報は `annotations` で添えられます。

今回使用する TODO アプリでは、次のように `document.modelContext.registerTool()` でツールを登録します。ここでは新しい TODO を追加する `add_todo` の例です。

```js:app.js
// フォーム送信時にも呼ばれる、UI と共通のアプリケーションロジック。
// TODO を追加して localStorage と画面に反映し、追加した TODO オブジェクトを返す。
function addTodo(title) {
  // ...バリデーションと状態更新...
}

await document.modelContext.registerTool({
  name: "add_todo",
  title: "TODO を追加",
  description: "新しい未完了の TODO を 1 件追加します。",
  inputSchema: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "追加する TODO のタイトル",
        minLength: 1,
        maxLength: 200,
      },
    },
    required: ["title"],
    additionalProperties: false,
  },
  execute: async ({ title }) => {
    const todo = addTodo(title);
    return { message: `「${todo.title}」を追加しました。`, todo };
  },
});
```

`name`・`description` はエージェントがツールを選ぶ手がかりになり、`inputSchema` は受け取る引数を JSON Schema で定義します。`execute` はツールが呼び出されたときに実行され、ここでは UI と共通の `addTodo()` を呼び出したうえで、エージェントに返す結果オブジェクトを組み立てています。

状態を変更しないツールには `annotations.readOnlyHint` を付けられます。TODO の一覧を返す `list_todos` は次のように登録します。

```js:app.js
await document.modelContext.registerTool({
  name: "list_todos",
  title: "TODO の一覧を取得",
  description: "現在の TODO 一覧を ID、タイトル、完了状態とともに取得します。",
  inputSchema: { type: "object", properties: {}, additionalProperties: false },
  annotations: { readOnlyHint: true },
  execute: async () => ({ count: todos.length, todos }),
});
```

ただし、`readOnlyHint` はあくまでヒントであり、その動作を保証するものではありません。悪意がある Web ページは、読み取り専用と宣言していても状態を変更する処理を実行する可能性があります。

実際に Web ページに登録されているツールの一覧は、Chrome DevTools の Application パネルの WebMCP から確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6z2ksFEyq6nK4NCkf14Kvi/545330a2636ca8ca7734868b1c1b3df6/image.png)

ツールを選択して「ツールを実行」を引数を入力して実行することでツールのデバッグも可能です。

![](https://images.ctfassets.net/in6v9lxmm5c8/3vZu2R6dhT5bIBQLGoS3QO/a4373ebb50d281a6bfac6b05a6a3a173/image.png)

WebMCP のツールは現在開いているページに結びつくため、エージェントはユーザーと同じ画面、ページの状態、ログインセッションを使って操作します。これにより人間と AI が同じ画面を見ながら共同で作業を行うことが可能になります。また、既存のログインセッションを使うため、AI が操作を行うために新たな認証の仕組みを導入する必要がないという点もメリットの 1 つと言えるでしょう。

この記事で使用する TODO アプリの全コードは次のとおりです。TODO は `localStorage` に保存し、`list_todos`・`add_todo`・`complete_todo`・`delete_todo` の 4 つのツールを登録します。

<details>
<summary>TODO アプリの全コード（<code>index.html</code> / <code>app.js</code>）</summary>

```html:index.html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebMCP TODO</title>
    <link rel="stylesheet" href="./styles.css" />
    <script type="module" src="./app.js"></script>
  </head>
  <body>
    <main>
      <h1>TODO</h1>

      <form id="todo-form">
        <label for="todo-title">新しい TODO</label>
        <div class="todo-input">
          <input id="todo-title" name="title" maxlength="200" required />
          <button type="submit">追加</button>
        </div>
      </form>

      <p id="empty-message">TODO はありません。</p>
      <ul id="todo-list" aria-label="TODO リスト"></ul>
    </main>
  </body>
</html>
```

```js:app.js
const STORAGE_KEY = "webmcp-todos";

const form = document.querySelector("#todo-form");
const titleInput = document.querySelector("#todo-title");
const todoList = document.querySelector("#todo-list");
const emptyMessage = document.querySelector("#empty-message");

let todos = loadTodos();

function loadTodos() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  renderTodos();
}

function addTodo(title) {
  if (typeof title !== "string") {
    throw new TypeError("TODO のタイトルは文字列で指定してください。");
  }

  const normalizedTitle = title.trim();
  if (!normalizedTitle) {
    throw new Error("TODO のタイトルを入力してください。");
  }
  if (normalizedTitle.length > 200) {
    throw new Error("TODO のタイトルは 200 文字以内で入力してください。");
  }

  const todo = {
    id: crypto.randomUUID(),
    title: normalizedTitle,
    completed: false,
  };
  todos.push(todo);
  saveTodos();
  return todo;
}

function updateTodo(id, completed) {
  const todo = todos.find((item) => item.id === id);
  if (!todo) {
    throw new Error(`ID が ${id} の TODO は見つかりません。`);
  }

  todo.completed = completed;
  saveTodos();
  return todo;
}

function deleteTodo(id) {
  const index = todos.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new Error(`ID が ${id} の TODO は見つかりません。`);
  }

  const [deletedTodo] = todos.splice(index, 1);
  saveTodos();
  return deletedTodo;
}

function renderTodos() {
  todoList.replaceChildren();
  emptyMessage.hidden = todos.length > 0;

  for (const todo of todos) {
    const item = document.createElement("li");
    item.dataset.completed = String(todo.completed);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `${todo.title}を完了にする`);
    checkbox.addEventListener("change", () => {
      updateTodo(todo.id, checkbox.checked);
    });

    const title = document.createElement("span");
    title.textContent = todo.title;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "削除";
    deleteButton.setAttribute("aria-label", `${todo.title}を削除する`);
    deleteButton.addEventListener("click", () => {
      deleteTodo(todo.id);
    });

    item.append(checkbox, title, deleteButton);
    todoList.append(item);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(titleInput.value);
  form.reset();
  titleInput.focus();
});

async function registerWebMCPTools() {
  if (typeof document.modelContext?.registerTool !== "function") {
    console.info("このブラウザでは WebMCP を利用できません。");
    return;
  }

  const tools = [
    {
      name: "list_todos",
      title: "TODO の一覧を取得",
      description:
        "現在の TODO 一覧を ID、タイトル、完了状態とともに取得します。更新や削除の対象 ID が不明な場合は、先にこのツールを呼び出してください。",
      inputSchema: {
        type: "object",
        properties: {},
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      execute: async () => ({ count: todos.length, todos }),
    },
    {
      name: "add_todo",
      title: "TODO を追加",
      description: "新しい未完了の TODO を 1 件追加します。",
      inputSchema: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "追加する TODO のタイトル",
            minLength: 1,
            maxLength: 200,
          },
        },
        required: ["title"],
        additionalProperties: false,
      },
      execute: async ({ title }) => {
        const todo = addTodo(title);
        return { message: `「${todo.title}」を追加しました。`, todo };
      },
    },
    {
      name: "complete_todo",
      title: "TODO を完了",
      description:
        "指定した ID の TODO を完了状態に変更します。ID が不明な場合は list_todos を先に呼び出してください。",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "完了にする TODO の ID",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
      execute: async ({ id }) => {
        const todo = updateTodo(id, true);
        return { message: `「${todo.title}」を完了にしました。`, todo };
      },
    },
    {
      name: "delete_todo",
      title: "TODO を削除",
      description:
        "指定した ID の TODO をブラウザのローカルデータから削除します。ID が不明な場合は list_todos を先に呼び出してください。",
      inputSchema: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "削除する TODO の ID",
          },
        },
        required: ["id"],
        additionalProperties: false,
      },
      execute: async ({ id }) => {
        const todo = deleteTodo(id);
        return { message: `「${todo.title}」を削除しました。`, todo };
      },
    },
  ];

  for (const tool of tools) {
    await document.modelContext.registerTool(tool);
  }
}

renderTodos();
registerWebMCPTools().catch((error) => {
  console.error("WebMCP ツールの登録に失敗しました。", error);
});
```

</details>

## ChatGPT デスクトップの Site tools

ChatGPT では WebMCP の規格を実装したものを [Site tools](https://learn.chatgpt.com/docs/webmcp) と呼びます。ChatGPT デスクトップの内蔵ブラウザで WebMCP 対応ページを開くと、エージェントは利用可能な操作を検出して呼び出すことができます。

:::warning
現時点で WebMCP を使用するには GPT-5.6 Sol または GPT-5.6 Terra が必要です。GPT-5.6 Luna では WebMCP が無効になっています。
:::

ChatGPT デスクトップを最新バージョンに更新し、設定画面を開いて「ブラウザ」→「サイトツールを有効にする」がオンになっていることを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/3BtpQsGUoFVbjXLureq6tt/0c5212f9b415b3de9931c7500d2243f6/image.png)

内蔵ブラウザのアドレスバーにあるサイトツールのアイコンをクリックすると、ページが公開しているツールを確認できます。ツールが呼び出された後は、「最近使用したツール」から最近の呼び出しも確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7wwkvMuWqGA38KlgxOAwkw/042e788355f79f9844f798a1bfe08ca5/image.png)

## Codex から TODO アプリを操作する

それでは実際に、Codex から TODO アプリを操作してみましょう。

### TODO を追加する

まず、内蔵ブラウザで TODO アプリのページを開き、以下のように依頼しました。

```txt
http://localhost:4173/ を開いて TODO に牛乳を買う、請求書を送るを追加して
```

まずは ChatGPT デスクトップ内蔵ツールの `webmcp_list_tools` を呼び出して、ページが公開しているツールの一覧を取得しているようです。

![](https://images.ctfassets.net/in6v9lxmm5c8/6ExKdb5JfIiI4dj64WzhHN/ec9c86a54e34ebd65c5c8fe943ae5674/image.png)

```json
{
  "tools": [
    {
      "name": "list_todos",
      "registration_id": "3364449875-2897562999-3575514943-438539620",
      "title": "TODO の一覧を取得",
      "description": "現在の TODO 一覧を ID、タイトル、完了状態とともに取得します。更新や削除の対象 ID が不明な場合は、先にこのツールを呼び出してください。",
      "input_schema": {
        "type": "object",
        "properties": {},
        "additionalProperties": false
      },
      "annotations": {
        "readOnlyHint": true
      },
      "origin": "http://localhost:4173",
      "pageUrl": "http://localhost:4173/"
    },
    {
      "name": "add_todo",
      "registration_id": "1414652002-805789020-2859544873-1366956443",
      "title": "TODO を追加",
      "description": "新しい未完了の TODO を 1 件追加します。",
      "input_schema": {
        "type": "object",
        "properties": {
          "title": {
            "type": "string",
            "description": "追加する TODO のタイトル",
            "minLength": 1,
            "maxLength": 200
          }
        },
        "required": [
          "title"
        ],
        "additionalProperties": false
      },
      "origin": "http://localhost:4173",
      "pageUrl": "http://localhost:4173/"
    },
    {
      "name": "complete_todo",
      "registration_id": "2157087165-3452018612-3738018915-3103997134",
      "title": "TODO を完了",
      "description": "指定した ID の TODO を完了状態に変更します。ID が不明な場合は list_todos を先に呼び出してください。",
      "input_schema": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "完了にする TODO の ID"
          }
        },
        "required": [
          "id"
        ],
        "additionalProperties": false
      },
      "origin": "http://localhost:4173",
      "pageUrl": "http://localhost:4173/"
    },
    {
      "name": "delete_todo",
      "registration_id": "2282909197-3701202854-3300925970-3712548734",
      "title": "TODO を削除",
      "description": "指定した ID の TODO をブラウザのローカルデータから削除します。ID が不明な場合は list_todos を先に呼び出してください。",
      "input_schema": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "削除する TODO の ID"
          }
        },
        "required": [
          "id"
        ],
        "additionalProperties": false
      },
      "origin": "http://localhost:4173",
      "pageUrl": "http://localhost:4173/"
    }
  ]
}
```

ツールの一覧から `add_todo` を選び実行してる様子も確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3zNG6sFJJdKvcLPt1gbfzP/1ada936a1fe662a97d01b400e3daeefe/image.png)

```json
[
  {
    "tool": "add_todo",
    "input": { "title": "牛乳を買う" },
    "output": {
      "message": "「牛乳を買う」を追加しました。",
      "todo": {
        "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4",
        "title": "牛乳を買う",
        "completed": false
      }
    }
  },
  {
    "tool": "add_todo",
    "input": { "title": "請求書を送る" },
    "output": {
      "message": "「請求書を送る」を追加しました。",
      "todo": {
        "id": "4882d4fa-2847-4807-8bb0-d350c377b69f",
        "title": "請求書を送る",
        "completed": false
      }
    }
  }
]
```

内蔵ブラウザで開いている TODO リストにも 2 件が追加されていることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1nuAjMmvGPGUzWsyGHphjR/8a9b5f02a35c6d4e71dde4a1b359c4b5/image.png)

### 一覧から対象を選んで完了する

続いて、TODO を完了にする依頼をしました。

```txt
買い物の TODO を完了にして
```

Codex はまず読み取り専用の `list_todos` を呼び出しました。戻り値に含まれるタイトルから「牛乳を買う」を買い物の TODO と判断し、その UUID を `complete_todo` へ渡しています。

```json
[
  {
    "tool": "list_todos",
    "input": {},
    "output": {
      "count": 2,
      "todos": [
        {
          "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4",
          "title": "牛乳を買う",
          "completed": false
        },
        {
          "id": "4882d4fa-2847-4807-8bb0-d350c377b69f",
          "title": "請求書を送る",
          "completed": false
        }
      ]
    }
  },
  {
    "tool": "complete_todo",
    "input": { "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4" },
    "output": {
      "message": "「牛乳を買う」を完了にしました。",
      "todo": {
        "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4",
        "title": "牛乳を買う",
        "completed": true
      }
    }
  }
]
```

### 削除の直前には確認が求められた

最後に以下のように TODO の削除を依頼しました。

```txt
完了済みの TODO を削除して
```

Codex は削除対象を決めた後、`delete_todo` を呼び出す前に「牛乳を買う」というローカルデータを削除してよいか、会話上で確認を求めてきました。

![](https://images.ctfassets.net/in6v9lxmm5c8/12S2IAeYB8hfcV5FXguCzM/106b4c98a650af5cab838952a1d923b0/image.png)

これは ChatGPT の安全性レビューと確認ポリシーによるものです。ChatGPT の公式ドキュメントでは、内蔵ブラウザが各ツールを呼び出す前に安全性レビューへ通し、削除・購入・メッセージ送信・権限変更などには通常の確認ポリシーが適用されると説明されています。

:::warning
これらのチェックはリスクを軽減するものであり、ウェブサイトやその出力の信頼性を保証するものではありません。ツールの説明や `readonly` アノテーションは必ずしも正しいとは限らないことに注意してください。
:::

承認後、Codex は `list_todos` で最新の状態を再取得してから `delete_todo` を呼び出しました。

```json
[
  {
    "tool": "list_todos",
    "input": {},
    "output": {
      "count": 2,
      "todos": [
        {
          "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4",
          "title": "牛乳を買う",
          "completed": true
        },
        {
          "id": "4882d4fa-2847-4807-8bb0-d350c377b69f",
          "title": "請求書を送る",
          "completed": false
        }
      ]
    }
  },
  {
    "tool": "delete_todo",
    "input": { "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4" },
    "output": {
      "message": "「牛乳を買う」を削除しました。",
      "todo": {
        "id": "f8e7ed69-a298-4c77-96a9-d4254e1158a4",
        "title": "牛乳を買う",
        "completed": true
      }
    }
  }
]
```

## まとめ

- ChatGPT デスクトップの Codex は、内蔵ブラウザで開いたページの WebMCP ツールを Site tools として発見・実行できる
- 現行の WebMCP では `document.modelContext.registerTool()` を使い、既存の UI と同じアプリケーションロジックをツールから呼び出す
- Codex はツールの一覧から目的に合うものを選び、引数を入力して呼び出した
- 削除では対象が確定した実行直前に確認が求められた

## 参考

- [Site tools - OpenAI Docs](https://learn.chatgpt.com/docs/webmcp)
- [ChatGPT & Codex changelog - OpenAI Docs](https://learn.chatgpt.com/docs/changelog#codex-2026-08-25-browser)
- [WebMCP Draft Community Group Report](https://webmachinelearning.github.io/webmcp/)
- [WebMCP ツールをデバッグする  |  Chrome DevTools  |  Chrome for Developers](https://developer.chrome.com/docs/devtools/application/webmcp?hl=ja)
- [webmachinelearning/webmcp](https://github.com/webmachinelearning/webmcp)
- [Imperative API - Chrome for Developers](https://developer.chrome.com/docs/ai/webmcp/imperative-api)
