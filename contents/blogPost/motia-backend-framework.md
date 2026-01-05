---
id: 8sb1a3WU8ruuwkGKkYf-N
title: "1 つの Step で完結するバックエンドフレームワーク Motia を試してみた"
slug: "motia-backend-framework"
about: "Motia はバックエンド開発をシンプルにすることを目指したコードファーストのバックエンドフレームワークです。この記事では Motia を使用して簡単な TODO REST API を構築する方法を紹介します。"
createdAt: "2026-01-05T19:23+09:00"
updatedAt: "2026-01-05T19:23+09:00"
tags: ["motia", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/58Ag5lam6rB2NBzOMGJTPD/cc50e60fec9d48a728dcaa9529b3f3e2/cute_bird_tsuru_11780.png"
  title: "かわいい鶴のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Motia の Step を構成する 4 つの要素として正しくないものはどれですか？"
      answers:
        - text: "Trigger"
          correct: false
          explanation: null
        - text: "Subscribe"
          correct: false
          explanation: null
        - text: "Handler"
          correct: false
          explanation: null
        - text: "Resolver"
          correct: true
          explanation: "Motia の Step を構成する 4 つの要素は Trigger, Subscribe, Handler, Emit です。Resolver は Step の構成要素ではありません。"
published: true
---
[Motia](https://motia.dev/) はバックエンド開発をシンプルにすることを目指したフレームワークです。Motia はコアプリミティブな概念である Step で設計されており、REST API, バックグラウンドジョブ, マルチステップワークフロー, AI エージェントの構築など、さまざまなバックエンド機能を 1 つのフレームワークで一貫した方法で実装できます。

Motia の目的は複雑になりすぎたバックエンドの開発をシンプルにし、開発者体験を向上させることです。現代のバックエンド開発では REST API のためのフレームワーク、SQS のようなジョブキューを通じたバックグラウンドジョブ、更にはバッチ処理など、多くの異なるツールやフレームワークを組み合わせて構築されています。そして異なるシステム間でデータの受け渡しや状態を管理するためのオーケストレーションやオブザーバビリティの確保も必要になります。

このような課題に対して Motia は多言語対応でネイティブに非同期のイベント駆動型バックエンドをバックエンド開発の未来と据えています。しかし、イベント駆動のバックエンドを 1 つのモノリシックなフレームワークに単純に統合するだけでは依然として複雑さが残ります。真の課題は統合ではなく、開発者にとって使いやすくそして存在することすら意識させないほど洗練されたプリミティブを提供することです。

そこで Motia は言語やランタイムに依存しないプリミティブである Step を導入しました。Step は DOM を抽象化レイヤーとして機能する React のコンポーネントにインスピレーションを得て設計されており、以下の 4 つの要素で構成されています。

- Trigger: Step を起動するためのイベントソース。API, イベントバス, スケジューラーなど
- Subscribe: 入力データを受け入れる部分
- Handler: Step のビジネスロジックを実装する部分
- Emit: データを出力するか、他の Step を起動する部分

この記事では Motia を使用して簡単なバックエンドを構築する方法を紹介します。

## Motia のセットアップ

ここでは Motia を使用して簡単な TODO REST API を構築してみましょう。以下のコマンドを実行します。

```bash
npx motia@latest create
```

対話形式でプロジェクトの構築が進みます。テンプレートとして TypeScript, JavaScript, Python から選択できます。ここでは TypeScript を選択しました。

```bash
🚀 Welcome to Motia Project Creator!
? What template do you want to use? (Use arrow keys) (Use arrow keys)
  Tutorial (TypeScript only)
  Tutorial (Python only)
  Starter (All languages; TS/JS + Python)
❯ Starter (TypeScript only)
  Starter (JavaScript only)
  Starter (Python only)
```

プロジェクトの構築が完了したら、以下のコマンドで開発サーバーを起動します。

```bash
cd my-motia-app
npm run dev
```

http://localhost:3000 にアクセスするとワークフローの管理やデバッグを行うための Motia ダッシュボードが表示されます。初めは `hello-world-flow` というワークフローが定義されています。`Hello API` ステップがトリガーとなり、`ProcessGreeting` ステップがハンドラーとして動作する簡単なワークフローが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/124MSfV7NK8E71AGkMlNo4/1da964b3e54eeab5f1f6f1eff1361ff5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_20.32.51.png)

「Endpoint」タブをクリックすると、`hello-world-flow` ワークフローのエンドポイント URL が表示されます。この URL を選択して「Send」ボタンをクリックすると、ワークフローが実行され、`ProcessGreeting` ステップが呼び出されます。プラグインとして提供されている `observabilityPlugin` や `logsPlugin` により、ワークフローのトレースやログが記録され、ダッシュボード上で確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2KXRC8czWsJKNZ1AtdfLfn/67e632f3ff703986fdd7c16b0f8ec2f2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_20.36.04.png)

## TODO REST API の実装

次に、簡単な TODO REST API を実装してみましょう。この API は以下のエンドポイントを提供します。

- `GET /todos`: TODO リストの取得
- `GET /todos/:id`: 指定した ID の TODO の取得
- `POST /todos`: TODO の追加
- `PUT /todos/:id`: TODO の更新
- `DELETE /todos/:id`: TODO の削除

まずは `src/todos/store.ts` ファイルを作成し、TODO アイテムを管理するためのシンプルなインメモリストアを実装します。ここは Motia 固有の部分ではない通常の TypeScript コードです。

```typescript:src/todos/store.ts
import { randomUUID } from "node:crypto";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTodoInput {
  title: string;
}

interface UpdateTodoInput {
  title?: string;
  completed?: boolean;
}

class TodoStore {
  private todos: Map<string, Todo> = new Map();
  addTodo(input: CreateTodoInput): Todo {
    const now = new Date();
    const todo: Todo = {
      id: randomUUID(),
      title: input.title,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    this.todos.set(todo.id, todo);
    return todo;
  }

  getTodos(): Todo[] {
    return Array.from(this.todos.values());
  }
  getTodoById(id: string): Todo | undefined {
    return this.todos.get(id);
  }
  updateTodo(id: string, input: UpdateTodoInput): Todo | null {
    const todo = this.todos.get(id);
    if (!todo) {
      return null;
    }

    const updated: Todo = {
      ...todo,
      ...input,
      updatedAt: new Date(),
    };

    this.todos.set(id, updated);
    return updated;
  }

  /**
   * Delete a TODO item
   */
  deleteTodo(id: string): boolean {
    return this.todos.delete(id);
  }
}

export const todoStore = new TodoStore();
```

### `CreateTodoAPI` Step の実装

まずは `POST /todos` エンドポイントを実装してみましょう。`src/todos/create-todo.step.ts` ファイルを作成し、以下のコードを追加します。

```typescript:src/todos/create-todo.step.ts
import type { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { todoStore } from "./store";

const createTodoRequestSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
  }),
});

// config はいつ実行されるかを設定する
// ここでは POST /todos へのリクエストを受け取ったときに実行されるように設定している
export const config: ApiRouteConfig = {
  name: "CreateTodoAPI",
  type: "api",
  path: "/todos",
  method: "POST",
  description:
    "Receives a request to create a new TODO item and emits an event for processing",
  flows: ["todo-creation-flow"],
  emits: [],
  responseSchema: {
    201: z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  },
};

// ハンドラ関数は実際のリクエスト処理を行う
export const handler: Handlers["CreateTodoAPI"] = async (
  req,
  { logger }
) => {
  // エラーハンドリングは省略
  const data = createTodoRequestSchema.parse(req);
  const todo = todoStore.addTodo(data);

  logger.info("New TODO item created", { todoId: todo.id });

  return {
    status: 201,
    body: todo,
  };
};
```

Motia は API エンドポイントを定義するためのシンプルな方法を提供します。`config` オブジェクトでエンドポイントのパス、HTTP メソッド、説明、レスポンススキーマなどを定義し、Step のトリガーとして機能させます。`handler` 関数では、リクエストを処理し、TODO アイテムを作成してレスポンスを返します。`config` と `handler` をエクスポートすることで、Motia はこれらを自動的に認識し、適切にルーティングします。

`npm run dev` コマンドで開発サーバーを実行すると `motia-workbench.json` ファイルが自動で更新され `todo-creation-flow` ワークフローが作成されます。

```json:motia-workbench.json
[
  {
    "id": "todo-creation-flow",
    "config": {
      "src/todos/create-todo.step.ts": {
        "x": 0,
        "y": 0
      }
    }
  }
]
```

ダッシュボードにアクセスすると `CreateTodoAPI` ステップが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/JLx5GYtefcE5jcYOmSdYU/d20a72ee447d07be1b059eb47276582a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_21.12.51.png)

「Endpoint」タブから `POST /todos` エンドポイントを選択して TODO アイテムが作成できることを確認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/7uQVbDcjp3TYoYOoftu3EI/c8f65e80eff916de47c5037336516eaf/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_21.18.38.png)

### Emit でバックグラウンドジョブを起動する

新しい TODO アイテムが作成された後に、バックグラウンドで何らかの処理を実行したい場合があります。例えば、新しい TODO アイテムが追加されたことをプロジェクトをサブスクライブしているメンバーにメールで通知する場合などです。そのような場合、Motia の Emit 機能を使用して、TODO 作成後に非同期のバックグラウンドジョブを起動できます。バックグラウンドジョブを使用すると API レスポンスをブロックすることなく、時間のかかる処理を実行できます。Motia では以下の 2 種類のバックグラウンドジョブをサポートしています。

- イベントステップ: API リクエストからのイベントによってトリガーされる
- Cron ステップ: スケジューラーによって定期的にトリガーされる

例えば、TODO 作成後に `todo-created` イベントを発行し、そのイベントをリッスンする `SendTodoCreationEmail` ステップを実装してみましょう。まずは `src/todos/create-todo.step.ts` ファイルを編集し、TODO 作成後に `todo-created` イベントを発行するようにします。

```typescript:src/todos/create-todo.step.ts {19, 33, 40-45}
import type { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { todoStore } from "./store";

const createTodoRequestSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(255),
  }),
});

export const config: ApiRouteConfig = {
  name: "CreateTodoAPI",
  type: "api",
  path: "/todos",
  method: "POST",
  description:
    "Receives a request to create a new TODO item and emits an event for processing",
  flows: ["todo-creation-flow"],
  emits: ["todo-created"],
  responseSchema: {
    201: z.object({
      id: z.string(),
      title: z.string(),
      completed: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
  },
};

export const handler: Handlers["CreateTodoAPI"] = async (
  req,
  { emit, logger }
) => {
  const data = createTodoRequestSchema.parse(req);
  const todo = todoStore.addTodo(data);

  logger.info("New TODO item created", { todoId: todo.id });

  await emit({
    topic: "todo-created",
    data: {
      id: todo.id,
      title: todo.title,
    },
  });

  logger.info("Emitted 'todo-created' event", { todoId: todo.id });

  return {
    status: 201,
    body: todo,
  };
};
```

`config` オブジェクトの `emits` プロパティに `todo-created` イベントを追加し、この API エンドポイントがこのイベントを発行することを示しています。`handler` 関数内で `emit` ヘルパーを使用して `todo-created` イベントを発行しています。`emit` 関数でイベントを発行した後はバックグラウンドジョブの実行を待たずに、すぐにレスポンスが返されます。

続いて `emit` された `todo-created` イベントをリッスンするバックグラウンドジョブを実装します。`src/todos/send-todo-creation-email.step.ts` ファイルを作成し、以下のコードを追加します。

```typescript:src/todos/send-todo-creation-email.step.ts
import { EventConfig, Handlers } from "motia";

export const config: EventConfig = {
  type: "event",
  name: "SendTodoCreationEmail",
  description:
    "Background job that sends an email notification when a new TODO item is created",
  subscribes: ["todo-created"],
  emits: [],
  flows: ["todo-creation-flow"],
};

export const handler: Handlers["SendTodoCreationEmail"] = async (
  input,
  { logger }
) => {
  const { id, title } = input;

  // 時間がかかる処理をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // メール送信ロジックをここに実装する
  logger.info(
    `Sending email notification for new TODO item: [ID: ${id}, Title: ${title}]`
  );
};
```

`config` オブジェクトは `type: "event"` を指定し `EventConfig` 型としてエクスポートします。`subscribes` プロパティに `todo-created` イベントを指定し、このステップがこのイベントをリッスンすることを示しています。`handler` 関数内で、受け取ったイベントデータを使用してメール送信ロジックを実装します。

正しく `flows` と `subscribes` が設定されていれば、Motia ダッシュボード上で `SendTodoCreationEmail` ステップが `todo-created` イベントに接続されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/23vUSvJD7Cm7kJVovY6yTh/835656f9c04770aaaa05bf43f702a182/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_21.46.12.png)

`POST /todos` エンドポイントにリクエストを送信すると、トレースから `SendTodoCreationEmail` ステップが非同期に実行されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2VKp2Zybw3sshEZwFoheF5/4b81072df24510357d3a83f9b753ac97/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_21.51.38.png)

### AI コーディングツールを使って開発する

残りの TODO REST API エンドポイントは AI コーディングツールを使用して実装してみましょう。Motia は新しいプロジェクトを作成したときに初めから AI コーディングツール向けの設定が組み込まれています。

- `CLAUDE.md`, `AGENTS.md`: Motia プロジェクトで AI コーディングアシスタントが作業する際のガイド。実装の詳細パターンは `.cursor/rules/` フォルダ内にある
- `.claude/agents/motia-developer.md`: Claude Code のサブエージェントの設定で、Motia 開発タスクに特化したプロンプトが含まれている

一般に新しい言語やフレームワークは LLM の学習データに含まれておらず、AI コーディングツールが正確にコードを生成するのは難しい場合があります。Motia は Motia 固有の知識を AI コーディングツールに提供するためのガイドとエージェント設定を提供しているため、ユーザーが特に工夫せずとも Motia プロジェクトで AI コーディングアシスタントを活用できるようになっています。

Claude Code を使用して `GET /todos` エンドポイントを実装してみましょう。プロンプトでは明示的に `motia-developer` サブエージェントを使用するように指定します。

```text
motia-developer サブエージェントを使用して、GET /todos エンドポイントを実装してください。すべての TODO アイテムを返す API エンドポイントを作成します。レスポンスは JSON 形式で、各 TODO アイテムには id, title, completed, createdAt, updatedAt フィールドが含まれます。TODO アイテムは src/todos/store.ts の todoStore から取得してください。
```

`motia-developer` サブエージェントを使用して実装している様子が確認できます。実際に生成されたコードを見ても、Motia のルールに従って正しく実装されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/NCsVFrILxybFODbNwSa8p/11d5e43bb3d112d1c58422121d84ce04/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-01-05_22.07.03.png)

生成されたコードは以下の通りです。

```typescript:src/todos/get-todos.step.ts
import type { ApiRouteConfig, Handlers } from "motia";
import { z } from "zod";
import { todoStore } from "./store.js";

export const config: ApiRouteConfig = {
  name: "GetTodosAPI",
  type: "api",
  path: "/todos",
  method: "GET",
  description: "Returns all TODO items from the store",
  flows: ["todo-management"],
  emits: [],
  responseSchema: {
    200: z.array(
      z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string(),
      }),
    ),
  },
};

export const handler: Handlers["GetTodosAPI"] = async (req, { logger }) => {
  logger.info("Fetching all TODO items");

  const todos = todoStore.getTodos();

  logger.info("Retrieved TODO items", { count: todos.length });

  return {
    status: 200,
    body: todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    })),
  };
};
```

Motia のルールに従って、API エンドポイントの設定やレスポンススキーマが正しく定義されています。更新・削除エンドポイントも同様に AI コーディングツールを使用して実装できます。

フレームワークのバージョンがアップデートされた場合や、新しいベストプラクティスが導入された場合、現在定義されている `.cursor/rules/` 内の内容が古くなってしまう場合があります。その場合には以下のコマンドを実行してルールを最新の状態に更新できます。

```bash
npx motia rules pull
```

### テストを実行する

AI コーディング時代には AI にフィードバックを提供するためのテストコードはますます重要になります。Motia では `@motiadev/test` パッケージを使用することで API エンドポイントやイベントの発行をトリガーしてテストを実行できます。TODO を作成する API エンドポイントのテストを作成してみましょう。

まずはテスト用の依存関係をインストールします。

```bash
npm install --save-dev @motiadev/test vitest
```

```json:package.json
"scripts": {
  "test": "vitest"
},
```

`src/todos/create-todo.step.test.ts` ファイルを作成し、以下のコードを追加します。

```typescript:src/todos/create-todo.step.test.ts
import { createMotiaTester } from "@motiadev/test";
import { describe, it, expect, afterAll } from "vitest";

describe("CreateTodo", () => {
  // アプリのテストバージョンを作成
  const tester = createMotiaTester();

  afterAll(async () => {
    await tester.close();
  });

  it("should create a new todo item", async () => {
    // /todos エンドポイントにPOSTリクエストを送信
    const response = await tester.post("/todos", {
      body: { title: "New Todo Item" },
    });

    // レスポンスを検証
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data).toHaveProperty("id");
    expect(data.title).toBe("New Todo Item");
    expect(data.completed).toBe(false);
  });

  it("should emit 'todo-created' event upon creation", async () => {
    // todo-created イベントを監視
    const watcher = await tester.watch("todoCreated");

    await tester.post("/todos", {
      body: { title: "Another Todo Item" },
    });

    // イベントが発火するのを待つ
    await tester.waitEvents();

    // 発火したイベントを検証
    const events = watcher.getCapturedEvents();
    expect(events).toHaveLength(1);
    expect(events[0].data).toMatchObject({
      id: expect.any(String),
      title: "Another Todo Item",
    });
  });
});
```

`createMotiaTester` 関数を使用して Motia アプリケーションのテストバージョンを作成します。`tester` オブジェクトは `.get`, `.post` メソッドで API エンドポイントにリクエストを送信したり、`.emit` メソッドでイベントの発火をトリガーしたりして Step をトリガーできます。

`tester.watch` メソッド使用すると特定のイベントを監視でき、発火したイベントを検証できます。

:::warning
2026 年 1 月時点で `createMotiaTester` 関数の実行時に `jest is not defined` エラーが発生しました。これは `jest` でテストを実行しても同様の問題が発生します。
:::

アプリケーションを起動せずに `handler` 関数を直接テストすることもできます。`createMockContext` 関数を使用してモックコンテキストを作成し、`handler` 関数に渡すことができます。例えば `SendTodoCreationEmail` ステップのテストは以下のように実装できます。

```typescript:src/todos/send-todo-creation-email.step.test.ts
import { createMockContext } from "@motiadev/test";
import { handler } from "./send-todo-creation-email.step";
import { describe, it, expect } from "vitest";

describe("CreateTodoAPI Handler", () => {
  it("should create a new todo item", async () => {
    const input = {
      id: "test-todo-id",
      title: "Unit Test Todo Item",
    };

    const mockContext = createMockContext();

    await handler(input, mockContext);

    expect(mockContext.logger.info).toHaveBeenCalledWith(
      `Sending email notification for new TODO item: [ID: ${input.id}, Title: ${input.title}]`
    );
  });
});
```

## まとめ

- Motia はバックエンド開発をシンプルにすることを目指したコードファーストのバックエンドフレームワーク。Step というプリミティブを中心に設計されており、REST API, バックグラウンドジョブ, ワークフロー, AI エージェントなど、さまざまなバックエンド機能を一貫した方法で実装できる
- `config` オブジェクトでエンドポイントのパス、HTTP メソッド、説明、レスポンススキーマなどを定義し、API エンドポイントをトリガーとして機能させる。`handler` 関数でリクエストを処理し、レスポンスを返す
- `emit` 機能を使用して、API リクエストから非同期のバックグラウンドジョブを起動できる。バックグラウンドジョブはイベントステップと Cron ステップの 2 種類をサポート
- `config` オブジェクトで `type: "event"` を指定し、`subscribes` プロパティにリッスンするイベントを指定することでバックグラウンドジョブを実装できる
- Motia は AI コーディングツール向けのガイドとエージェント設定を提供しており、AI コーディングアシスタントが Motia プロジェクトで効果的にコードを生成できるようになっている
- `@motiadev/test` パッケージを使用して API エンドポイントやイベントの発行をトリガーしてテストを実行できる。アプリケーションを起動せずに `handler` 関数を直接テストすることも可能

## 参考

- [Motia - Code-First Backend Framework for APIs & AI Agents](https://motia.dev/)
- [Welcome Docs](https://www.motia.dev/docs)
- [MotiaDev/build-your-first-app: Build your First Motia App repository](https://github.com/MotiaDev/build-your-first-app)
