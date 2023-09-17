---
id: v7n8YzKSNEy4yMUdqqEU3
title: "Bun の Web フレームワーク ElysiaJS のチュートリアル"
slug: "elysiajs-tutorial"
about: "ElysiaJS は Bun の Web フレームワークです。高いパフォーマンスと、シンプルな API や厳格な型チェックにより生産性に優れているという特徴があります。また柔軟性が高く、多くのプラグインを組み合わせて利用できます。この記事では、ElysiaJS を使って簡単なタスク管理アプリの Web API を作成してみます。"
createdAt: "2023-09-16T11:34+09:00"
updatedAt: "2023-09-16T11:34+09:00"
tags: ["Bun", "ElysiaJS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2LyfyConbfbykrRZF8W8al/8a8abc4ea16753244a684f931745b015/white_pink_sakura_6763.png"
  title: "白と薄いピンク色の桜のイラスト"
published: true
---
ElysiaJS は Bun の Web フレームワークです。高いパフォーマンスと、シンプルな API や厳格な型チェックにより生産性に優れているという特徴があります。また柔軟性が高く、多くのプラグインを組み合わせて利用できます。

https://elysiajs.com/

この記事では、ElysiaJS を使って簡単なタスク管理アプリの Web API を作成してみます。

## プロジェクトの作成

ElysiaJS は Bun で動作するために作られたフレームワークです。まずは Bun をインストールしましょう。

```sh
curl https://bun.sh/install | bash
```

`bun create` コマンドを実行して EliysiaJS のプロジェクトを作成します。

```sh
bun create elysia eliysiajs-task-api
```

`eliysiajs-task-api` に移動して `src/index.ts` ファイルを開くと、以下のようなコードが生成されています。

```ts:src/index.ts
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
```

以下のコマンドで、アプリケーションを起動してみましょう。

```sh
bun run dev
```

http://localhost:3000 にアクセスすると、`Hello Elysia` と表示されていることが確認できます。

```sh
curl http://localhost:3000
Hello Elysia
```

## タスク一覧の取得

それでは、タスク管理アプリの API を作成していきましょう。まずは、タスク一覧を取得するための API を作成します。物事を簡単に進めるために、DB などはまだ使わずにハードコーディングされたタスク一覧を返します。

ElysiaJS は Express や Fastify とよく似ているルーティング API を提供しています。 `new Eliysia(){:js}` でインスタンスとして作成した `app` に対して、`get` や `post` といった、HTTP メソッドに合わせたメソッドを呼び出すことで、ルーティングを定義できます。`get` メソッドの第一引数には、ルーティングのパスを指定します。第二引数には、ルーティングにマッチした際に実行される `Handler{:js}` 関数を指定します。

例として GET メソッドで `/tasks` にアクセスした際に、タスク一覧を返す API を作成してみましょう。ルーティングの定義例にならい、`src/index.ts` を以下のように変更します。

```ts:src/index.ts {3-15}
import { Elysia } from "elysia";

const tasks = [
  { id: "1", name: "Buy milk", status: "done" },
  { id: "2", name: "Buy eggs", status: "done" },
  { id: "3", name: "Buy bread", status: "pending" },
];

const app = new Elysia()
  .get("/tasks", () => {

  return {
    tasks,
  };
})

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

`Handler{:js}` 関数の戻り値は ElysiaJS によって [Response](https://developer.mozilla.org/ja/docs/Web/API/Response) オブジェクトにマッピングされます。上記のコード例のように `Handler{:js}` がオブジェクトを返した場合、以下のようなコードに変換されます。

```ts
new Response(JSON.stringify({ tasks }), {
  headers: { "Content-Type": "application/json" },
});
```

ElysiaJS の特徴として、メソッドチェーンによる方法を推奨している点があげられます。これは、`.state(){:js}` などで新たに Context に注入された型情報を、後続のメソッドに伝えるためです。メソッドチェーンを使用しない場合には、型情報が失われてしまいます。

```ts
const app = new Elysia();

app.state("build", 1);

// build 型は存在しない
app.get("/", ({ store: { build } }) => build);
```

実際に API をコールして結果を確認してみましょう。GUI の API クライアントとして [HTTPie](https://httpie.io/) を利用します。上部の入力欄に `http://localhost:3000/tasks` と入力して、`Send` ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/60seV7UEba4nQtKOYafxON/84bd8f58eb3494b6ff06363ff3a921a4/__________2023-09-16_12.17.13.png)

確かに `application/json` でタスク一覧が返ってきていることが確認できます。

## タスクの作成

続いてタスクを作成するための API を作成します。`/tasks` に POST リクエストが送信された場合に、リクエストボディの内容で新しいタスクを作成します。`Handler{:js}` 関数の引数として `Context{:js}` オブジェクトを受け取ります。`Context{:js}` オブジェクトには、リクエストボディやクエリパラメータ、パスパラメータなどの情報が含まれています。

`body` パラメータを利用して、リクエストボディの内容を取得します。

```ts:src/index.ts
app.post("/tasks", ({ body }) => {
  console.log(body);

  return {
    message: "Task created",
  };
});
```

作成したエンドポイントに対して、リクエストを送信してみましょう。以下の JSON をリクエストボディとして送信します。

```json
{
  "name": "Go to the gym",
  "status": "pending"
}
```

HTTPie を使ってリクエストを送信する場合には、入力欄の左側にあるセレクトボックスで `POST` を選択し、`http://localhost:3000/tasks` と入力します。また、左側のパネルで `Body` を選択してから、形式を `Text` に変更します。リクエストボディを入力してから、`Send` ボタンをクリックしましょう。

`{ "message": "Task created" }` というレスポンスが返ってきていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2WrOBEsp0j2agpielNvvgb/2ef6d8a633e8b20344a9d368ab6ec91a/__________2023-09-16_13.20.23.png)

アプリケーションを起動しているターミナルには、リクエストボディの内容が出力されていることが確認できます。

```sh
🦊 Elysia is running at localhost:3000
{
  name: "Go to the gym",
  status: "pending"
}
```

### ボディリクエストに対するバリデーション

`Context` オブジェクトの `body` パラメータはデフォルトでは `unknown` 型ですので、このまま扱うには少々不便です。ElysiaJS では [@sinclair/typebox](https://github.com/sinclairzx81/typebox) による型スキーマ機能を提供しています。以下のように、ルートメソッドの第 3 引数でスキーマを定義することで、ルート単位でリクエストボディのバリデーションを行うことができます。

```ts:src/index.ts {1,9-16}
import { Elysia, t } from "elysia";

app.post("/tasks", ({ body }) => {
  console.log(body);

  return {
    message: "Task created",
  };
}, {
  body: t.Object({
    name: t.String(),
    status: t.Union([t.Literal("done"), t.Literal("pending"), t.Literal("in-progress")]),
  })
});
```

スキーマを定義することで、`body` パラメータの型が `unknown` 型ではなくスキーマで定義された型に推論されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3VlOKLDXXuX2NvU4u3lZLR/8c925a683ed0d3014505c611381d03c7/__________2023-09-16_13.34.31.png)

`name` パラメータを省略するなど、スキーマに定義されていない値をリクエストボディに含めた場合には、`400 Bad Request` が返されます。

```sh
Invalid body, 'name': Expected string

Expected: {
  "name": "",
  "status": "done"
}

Found: {
  "status": "pending"
}
```

`body` のスキーマを定義できたので、リクエストボディを保存する処理を実装してみましょう。`tasks` 配列に新しいタスクを追加して、新たに作成したタスクを返します。

```ts:src/index.ts {2-12}
app.post("/tasks", ({ body }) => {
  const newTask = {
    id: tasks.length + 1,
    name: body.name,
    status: body.status,
  }

  tasks.push(newTask);

  return {
    task: newTask,
  };
}, {
  body: t.Object({
    name: t.String(),
    status: t.Union([t.Literal("done"), t.Literal("pending"), t.Literal("in-progress")]),
  })
});
```

タスクを作成した後に、`GET /tasks` でタスク一覧を取得してみましょう。追加したタスクが含まれていることが確認できます。

```json
{
  "tasks": [
    {
      "id": "1",
      "name": "Buy milk",
      "status": "done"
    },
    {
      "id": "2",
      "name": "Buy eggs",
      "status": "done"
    },
    {
      "id": "3",
      "name": "Buy bread",
      "status": "pending"
    },
    {
      "id": "4",
      "name": "Go to Gym",
      "status": "pending"
    }
  ]
}
```

### Task モデルの作成

先程はルートレベルでスキーマを作成して利用していましたが、このままではスキーマの再利用ができません。ElysiaJS では `.model` メソッドでスキーマを 1 つの場所で定義して、後から文字列で参照が可能です。`src/tasks/task.model.ts` を作成して、以下のようにスキーマを定義します。

```ts:src/tasks/task.model.ts
import { Elysia, t } from "elysia";
import { Static } from "@sinclair/typebox";

const status = t.Union([t.Literal("done"), t.Literal("pending"), t.Literal("in-progress")])

const task = t.Object({
  id: t.String(),
  name: t.String(),
  status,
})

// Static は型スキーマから TypeScript の型を生成するヘルパー関数
export type Task = Static<typeof task>

const taskDto = t.Object({
  name: t.String(),
  status,
})

export type TaskDto = Static<typeof taskDto>

const app = new Elysia();
export const taskModel = app.model({
  "task.task": task,
  "task.tasks": t.Array(task),
  "task.taskDto": taskDto,
})
```

`taskModel` には、`task.task` という名前で `task` スキーマが登録されています。同じ名前のスキーマを複数回登録すると ElysiaJS は例外を投げるため、`.` 区切りでプレフィックスを付けることが推奨されています。ここで生成したモデルは `src/index.ts` から `app.use(){:js}` の引数として渡すことで、スキーマを参照できるようになります。

スキーマは `body` だけでなく、`response` に対しても定義できます。`response` のスキーマを定義することで、誤ったレスポンスを返すことを防ぐことができます。

```ts:src/index.ts {11, 17, 33-34}
import { Elysia } from "elysia";
import { Task, taskModel } from "./tasks/task.model";

const tasks: Task[] = [
  { id: "1", name: "Buy milk", status: "done" },
  { id: "2", name: "Buy eggs", status: "done" },
  { id: "3", name: "Buy bread", status: "pending" },
];

const app = new Elysia()
  .use(taskModel)
  .get("/tasks", () => {
      return {
        tasks,
      };
    }, {
      response: "task.tasks",
    }
  )
  .post("/tasks", ({ body }) => {
      const newTask: Task = {
        id: tasks.length + 1,
        name: body.name,
        status: body.status,
      };

      tasks.push(newTask);

      return {
        task: newTask,
      };
    }, {
      body: "task.taskDto",
      response: "task.task",
    }
  );
```

`app.use(){:js}` で登録したモデルにアクセスするためには、必ずメソッドチェーンの形式でルートを呼び出さなければいけないことに注意してください。

## sqlite3 を使ったデータベースの操作

ここまではタスクを保存するために、メモリ上の配列を利用していました。しかし、メモリ上に保存されたデータはアプリケーションを再起動すると消えてしまいます。データを永続化するために、sqlite3 を使ったデータベースの操作を実装してみましょう。

Bun ではビルドインのモジュールで [sqlite3 のドライバー](https://bun.sh/docs/api/sqlite)を提供しています。型による安全性は提供されていないものの、簡単な CRUD 操作を実装するには十分でしょう。

まずは、データベースのテーブルを作成するために、`src/db/create-tables.ts` を作成します。

```ts:src/db/create-tables.ts
import { Database } from "bun:sqlite";

// { create: true } は DB が存在しない場合に作成するオプション
const db = new Database("db.sqlite", { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL
  )
`);

db.close();
```

DB を作成するスクリプトを `package.json` の `scripts` フィールドに追加します。

```json:package.json
{
  "scripts": {
    "create-table": "bun src/db/create-table.ts"
  }
}
```

以下のコマンドで DB を作成します。

```sh
bun run create-tables
```

正常にテーブルの作成に成功した場合には、`db.sqlite` というファイルが作成されていることが確認できます。

### Task Repository の作成

`src/tasks/task.repository.ts` を作成して、以下のようにデータベースの操作を実装します。

```ts:src/tasks/task.repository.ts
import { Database } from "bun:sqlite";
import { Task, TaskDto } from "./task.model";

const db = new Database("db.sqlite");

const getAllQuery = db.prepare("SELECT * FROM tasks");
const getTaskByIdQuery = db.prepare("SELECT * FROM tasks WHERE id = ?");
const insertQuery = db.prepare("INSERT INTO tasks (id, name, status) VALUES (?, ?, ?)");

export const TaskRepository = {
  /**
   * すべてのタスクを取得する
   */
  getAll() {
    return getAllQuery.all() as Task[];
  },

  /**
   * タスクを作成する
   */
  create(taskDto: TaskDto) {
    const id = crypto.randomUUID();
    insertQuery.run(id, taskDto.name, taskDto.status);
    const record = getTaskByIdQuery.get(id);

    if (!record) {
      throw new Error("Task not found");
    }

    return record as Task;
  }
}
```

### Task Repository を Context に登録する

作成した Task Repository をそのまま利用しても良いのですが、データベースを操作するクラスはテストの容易性や関心の分離などの目的のために [Dependency Injection（DI）](https://ja.wikipedia.org/wiki/%E4%BE%9D%E5%AD%98%E6%80%A7%E3%81%AE%E6%B3%A8%E5%85%A5) パターンがよく利用されます。ElysiaJS では、[State や Decorate](https://elysiajs.com/concept/state-decorate.html) を利用して、DI 近いことを実現できます。

`state` や `decorate` を利用した DI を実装する前に、メインのアプリケーションのインスタンスと、それぞれのルートを定義するインスタンスを分離しておきましょう。`src/tasks/index.ts` ファイルを作成して、今まで `src/index.ts` に記述していたルート定義を移動します。ここでは ElysiaJS のインスタンスとして `taskRoute` を export します。

```ts:src/tasks/index.ts {10}
import { Elysia } from "elysia";
import { Task, taskModel } from "./task.model";

const tasks: Task[] = [
  { id: 1, name: "Buy milk", status: "done" },
  { id: 2, name: "Buy eggs", status: "done" },
  { id: 3, name: "Buy bread", status: "pending" },
];

export const taskRoute = new Elysia()
  .use(taskModel)
  .get("/tasks", () => {
      return {
        tasks,
      };
    }, {
      response: "task.tasks",
    }
  )
  .post("/tasks", ({ body }) => {
      const newTask: Task = {
        id: tasks.length + 1,
        name: body.name,
        status: body.status,
      };

      tasks.push(newTask);

      return {
        task: newTask,
      };
    }, {
      body: "task.taskDto",
      response: "task.task",
    }
  );
```

`src/index.ts` では、`taskRoute` をインポートして、`app.use(){:js}` でルートを登録するシンプルな実装になります。

```ts:src/index.ts {2, 5}
import { Elysia } from "elysia";
import { taskRoute } from "./tasks";

const app = new Elysia()
  .use(taskRoute)

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

メインアプリケーションのインスタンスにより `.decorate(){:js}` で登録したオブジェクトには、サブモジュールはアクセスできません。型情報がサブモジュールに伝わらないためです。

サブモジュールから `state` や `decorate` で登録したオブジェクトにアクセスするため、`state` や `decorate` のみを含んだプラグインを作成し、サブモジュールごとにプラグインを適用します。`src/setup.ts` を作成して、以下のように `.decorate(){:js}` で `TaskRepository` を登録します。

```ts:src/setup.ts
import Elysia from "elysia";
import { TaskRepository } from "./tasks/task.repository";

export const setup = new Elysia({ name: "setup" })
  .decorate({
    taskRepository: TaskRepository,
  })
```

この `setup` プラグインは `TaskRepository` が必要なサブモジュールごとに `use(){:js}` を使って適用します。

```ts:src/tasks/index.ts {3, 7}
import { Elysia } from "elysia";
import { taskModel } from "./task.model";
import { setup } from "../setup";

export const taskRoute = new Elysia()
  .use(taskModel)
  .use(setup)
```

`.decorate(){:js}` で登録したオブジェクトは、`Handler` 関数の引数である `Context` からアクセスできます。`taskRepository` を利用して、データベースにタスクを保存する処理を実装してみましょう。

```ts:src/tasks/index.ts {4-5, 13-14}
export const taskRoute = new Elysia()
  .use(taskModel)
  .use(setup)
  .get("/tasks", ({ taskRepository }) => {
    const tasks = taskRepository.getAll();
    return {
      tasks,
    };
  }, {
    response: "task.tasks",
  })
  .post("/tasks", ({ body, taskRepository }) => {
    const newTask = taskRepository.create(body);

    return {
      task: newTask,
    };
  }, {
    body: "task.taskDto",
    response: "task.task",
  });
```

いくつかタスクを作成してから、タスク一覧で取得できるか確認してみましょう。

## 認証機能

ユーザーが自分が作成したタスクのみを取得・更新できるように、認証機能を実装しましょう。ElysiaJS により提供されている [JWT Plugin](https://elysiajs.com/plugins/jwt.html) を利用して、JWT トークンを使った認証機能を実装します。

### ユーザーを登録する

認証機能を実装する前に、まずはユーザーを登録してデータベースに保存する処理が必要です。以下の 3 つの作業を行います。

- ユーザーのスキーマを定義する
- AuthRepository でユーザーの登録・ログインを行うデータベースの操作を実装する
- データベースのテーブル定義を変更して、ユーザーテーブルを追加する

#### ユーザーのスキーマを定義する

まずはユーザーのスキーマを定義します。`src/auth/auth.model.ts` を作成して、以下のコードを記述します。

```ts:src/auth/auth.model.ts
import { Elysia, t } from "elysia";

const user = t.Object({
  id: t.String(),
  username: t.String(),
  password: t.String(),
})

export type User = Static<typeof user>

const userDto = t.Object({
  username: t.String(),
  password: t.String(),
})

export type UserDto = Static<typeof userDto>

const app = new Elysia();
export const authModel = app.model({
  "auth.user": user,
  "auth.userDto": userDto,
})
```

#### AuthRepository でユーザーの登録・ログインを行うデータベースの操作を実装する

`src/auth/auth.repository.ts` を作成して、以下のようにユーザーの登録やログインを行う処理を実装します。

```ts:src/auth/auth.repository.ts
import { Database } from "bun:sqlite";
import { User, UserDto } from "./auth.model";

const db = new Database("db.sqlite");

const getUserByIdQuery = db.prepare("SELECT * FROM users WHERE id = ?");
const getUserByUsernameQuery = db.prepare("SELECT * FROM users WHERE username = ?");
const insertQuery = db.prepare("INSERT INTO users (id, username, password) VALUES (?, ?, ?)");

type Result = {
  success: true,
  user: User,
} | {
  success: false,
  message: string,
}

export const AuthRepository = {
  /**
   * ユーザーを登録する
   */
  async create(userDto: UserDto): Promise<Result> {
    // 既に同じユーザー名のユーザーが存在する場合にはエラーを返す
    const existingUser = getUserByUsernameQuery.get(userDto.username);
    if (existingUser) {
      return {
        success: false,
        message: "User already exists",
      }
    }
    const id = crypto.randomUUID();
    // パスワードをハッシュ化
    const hashedPassword = await Bun.password.hash(userDto.password);
    insertQuery.run(id, userDto.username, hashedPassword);
    const record = getUserByIdQuery.get(id);

    if (!record) {
      return {
        success: false,
        message: "Unable to create user"
      }
    }

    return {
      success: true,
      user: record as User,
    }
  },

  /**
   * ユーザーログイン
   */
  async login(userDto: UserDto): Promise<Result> {
    // ユーザー名からユーザーを取得
    const record = getUserByUsernameQuery.get(userDto.username) as User | null;

    // 存在しないユーザー名の場合にはエラーを返す
    if (!record) {
      return {
        success: false,
        message: "User not found",
      }
    }

    // パスワードを検証
    const isValid = await Bun.password.verify(userDto.password, record.password);

    // パスワードが一致しない場合にはエラーを返す
    if (!isValid) {
      return {
        success: false,
        message: "User not found",
      }
    }

    return {
      success: true,
      user: record,
    }
  }
}
```

パスワードをハッシュ化する処理は、Bun のビルドイン関数として `Bun.password.hash(){:js}` が提供されています。パスワードを検証するためには、`Bun.password.verify(){:js}` 関数を利用します。

作成した `AuthRepository` は `src/setup.ts` 内で `decorate` として登録します。

```ts:src/setup.ts {3, 9-11}
import Elysia from "elysia";
import { TaskRepository } from "./tasks/task.repository";
import { AuthRepository } from "./auth/auth.repository";

export const setup = new Elysia({ name: "setup" })
  .decorate({
    taskRepository: TaskRepository,
  })
  .decorate({
    authRepository: AuthRepository,
  })
```

#### データベースのテーブル定義を変更して、ユーザーテーブルを追加する

最後にデータベースのテーブル定義を変更します。`src/db/create-table.ts` で `users` テーブルを作成し、`tasks` テーブルに `user_id` カラムを追加するように変更します。

```ts:src/db/create-table.ts {14-22}
import { Database } from "bun:sqlite";

// { create: true } は DB が存在しない場合に作成するオプション
const db = new Database("db.sqlite", { create: true });

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  );

  ALTER TABLE tasks ADD COLUMN user_id TEXT;
`);

db.close();
```

再度 `bun run create-tables` を実行して、テーブルの作成に成功したことを確認しましょう。

```sh
bun run create-tables
```

### ユーザー登録 API の作成

`src/auth/index.ts` を作成して、ユーザー登録 API を実装します。

```ts:src/auth/index.ts
import { Elysia } from "elysia";
import { authModel } from "./auth.model";
import { setup } from "../setup";

export const authRoute = new Elysia()
  .use(authModel)
  .use(setup)
  .post("/auth/signup", async ({ body, authRepository, set }) => {
    const result = await authRepository.create(body);

    if (result.success === false) {
      set.status = 400;
      return {
        message: result.message,
      }
    }

    set.status = 201;
    return {
      message: "User created successfully",
    };
  }, {
    body: "auth.userDto",
  })
```

`authRepository.crate(){:js}` を呼び出してユーザーの登録処理を行います。同じユーザー名が既に存在するなど、ユーザーの作成に失敗した場合には `400 Bad Request` を返却します。のステータスコードを設定するためには、`set` オブジェクトを変更します。

作成したユーザー登録 API を有効にするために、`src/index.ts` ファイルを変更して `authRoute` を `app.use(){:js}` で登録します。

```ts:src/index.ts {2, 7}
import { Elysia } from "elysia";
import { taskRoute } from "./tasks";
import { authRoute } from "./auth";

const app = new Elysia()
  .use(taskRoute)
  .use(authRoute)

app.listen(3000);
```

実際にユーザーを登録してみましょう。以下の JSON をリクエストボディとして送信します。

```json
{
  "username": "john",
  "password": "password"
}
```

`{ message: "User created successfully" }` というレスポンスが返ってきていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4RTJZ1MDy0561tLW9I6aqa/3738768e7fd2eec718a2ce143a9371d6/__________2023-09-16_16.24.51.png)

### ログイン API の作成

続いてログイン API を実装します。ログイン時には JWT トークンを発行して、Cookie に保存します。`bun add` コマンドで JWT プラグインと Cookie プラグインをインストールします。

```sh
bun add @elysiajs/jwt @elysiajs/cookie
```

`authRoute` で JWT プラグインと Cookie プラグインを使用するように修正しましょう。

```ts:src/auth/index.ts {4-5, 10-14}
import { Elysia } from "elysia";
import { authModel } from "./auth.model";
import { setup } from "../setup";
import { cookie } from '@elysiajs/cookie'
import { jwt } from '@elysiajs/jwt'

export const authRoute = new Elysia()
  .use(authModel)
  .use(setup)
  .use(cookie())
  .use(jwt({
    // 本番環境では秘密鍵を環境変数から取得するなど、安全な方法で管理してください
    secret: "super-secret-key",
  }))
  .post("/auth/signup", async ({ body, authRepository, set }) => {
```

ユーザーがログインするためのルートを `/auth/signin` に作成します。

```ts:src/auth/index.ts
export const authRoute = new Elysia()
  .use(authModel)
  .use(setup)
  .use(jwt({
    secret: "super-secret-key",
  }))
  .post("/auth/signin", async ({ jwt, body, authRepository, set, setCookie }) => {
    // ユーザーのログイン処理
    const result = await authRepository.login(body);

    // ログインに失敗したら、400 Bad Request を返却
    if (result.success === false) {
      set.status = 400;
      return {
        message: result.message,
      }
    }

    // ログインに成功したら、JWT トークンを発行
    const token = await jwt.sign({
      id: result.user.id,
      username: result.user.username,
    });

    // JWT トークンを Cookie に保存
    setCookie("token", token, {
      httpOnly: true,
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return {
      message: "User logged in successfully",
    };
  }, {
    body: "auth.userDto",
    response: t.Object({
      message: t.String(),
    }),
  });
```

`authRepository.login(){:js}` を呼び出して、ユーザーのログイン処理を行います。ログインに失敗した場合には `400 Bad Request` を返却します。ユーザーが存在する場合には、JWT トークンを発行し `setCookie(){:js}` メソッドでクッキーを登録します。先程作成したユーザーでログイン API を実行してみましょう。

```json
{
  "username": "john",
  "password": "password"
}
```

`{ message: "User logged in successfully" }` というレスポンスが返ってきていることが確認できます。また、レスポンスヘッダーを確認すると、`Set-Cookie` に JWT トークンが含まれていることが確認できます。この Cookie は後ほど利用します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3IPCqx2BBUBT95dP2tdNkF/40b81e22236f28c1b3821eed6cc7a055/__________2023-09-16_17.53.32.png)

### `isAuthenticated` プラグインの作成

ユーザーがログインしているかどうかを判定するためのプラグインを作成します。`src/auth/isAuthenticated.ts` を作成して、以下のように `isAuthenticated` プラグインを定義します。

```ts:src/auth/isAuthenticated.ts
import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import { Elysia } from "elysia";
import { setup } from "../setup";

export const isAuthenticated = new Elysia()
  .use(setup)
  .use(cookie())
  .use(jwt({
    secret: "super-secret-key",
  }))
  .derive(async ({ cookie, jwt, authRepository }) => {
    // Cookie が存在するか
    if (!cookie?.token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }
    // JWT トークンを検証
    const token = await jwt.verify(cookie.token);
    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // ユーザーが存在するか
    const user = authRepository.getUserById(token.id);
    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    // すべての検証をパスしたならば、ユーザー
    return {
      success: true,
      message: "Authorized",
      user,
    };
  });
```

このプラグインは以下の 3 つの検証を行い、ユーザーがログインしているかどうかを判定します。

- Cookie が存在し、JWT トークンが含まれているか
- JWT トークンを検証
- ユーザーが存在するか

`.derive(){:js}` メソッドは、`state` や `decorate` のように `Context` をカスタマイズするためのメソッドです。`.derive(){:js}` で返却した値は後続のルートで `Context` に追加され利用できます。

### タスクの一覧・作成 API の修正

まずはユーザーに紐づいたタスクを取得・作成できるように `TaskRepository` を修正しましょう。`getAll(){:js}` メソッドの引数に `userId` を追加して、取得条件に `user_id` を追加します。また、`SELECT` 句では `user_id` を取得しないように修正します。

```ts:src/tasks/task.repository.ts {3-4, 12}
const db = new Database("db.sqlite");

const getAllQuery = db.prepare("SELECT id, name, status FROM tasks WHERE user_id = ?");
const getTaskByIdQuery = db.prepare("SELECT id, name, status FROM tasks WHERE id = ?");
const insertQuery = db.prepare("INSERT INTO tasks (id, name, status) VALUES (?, ?, ?)");

export const TaskRepository = {
  /**
   * すべてのタスクを取得する
   */
  getAll(userId: string) {
    return getAllQuery.all(userId) as Task[];
  },
```

`create(){:js}` メソッドの引数に `userId` を追加して、タスクの作成時に `user_id` を保存します。

```ts:src/tasks/task.repository.ts {5, 11-21}
const db = new Database("db.sqlite");

const getAllQuery = db.prepare("SELECT id, name, status FROM tasks WHERE user_id = ?");
const getTaskByIdQuery = db.prepare("SELECT * FROM tasks WHERE id = ?");
const insertQuery = db.prepare("INSERT INTO tasks (id, name, status, user_id) VALUES (?, ?, ? ?)");

export const TaskRepository = {
  /**
   * タスクを作成する
   */
  create(taskDto: TaskDto, userId: string) {
    const id = crypto.randomUUID();
    insertQuery.run(id, taskDto.name, taskDto.status, userId);
    const record = getTaskByIdQuery.get(id);

    if (!record) {
      throw new Error("Task not found");
    }

    return record as Task;
  }
}
```

これで `UserRepository` の修正は完了です。一旦型エラーが発生する状況になりますが、後ほど修正します。

`taskRoute` において先程作成した `isAuthenticated` プラグインを利用して、ユーザーがログインしているかどうかを判定し、`Context` で `user` オブジェクトを利用できるようにします。

```ts:src/tasks/index.ts {4, 9}
import { Elysia } from "elysia";
import { taskModel } from "./task.model";
import { setup } from "../setup";
import { isAuthenticated } from "../auth/isAuthenticated";

export const taskRoute = new Elysia()
  .use(taskModel)
  .use(setup)
  .use(isAuthenticated)
  .get("/tasks", ({ taskRepository }) => {
```

`isAuthenticated` プラグインが `user` オブジェクトを返さない場合には、`401 Unauthorized` を返却します。この処理は `/tasks` のすべてのルートに対して実装することになります。

複数のルートに対して同じ処理を実装する場合には、`app.guard(){:js}` メソッドを利用できます。`app.guard(){:js}` メソッド内で `beforeHandle` 関数を定義することによって、各ルートの `Handler` 関数が実行される前のフックを定義できます。

```ts:src/tasks/index.ts {5-14}
export const taskRoute = new Elysia()
  .use(taskModel)
  .use(setup)
  .use(isAuthenticated)
  .guard({
    beforeHandle: [({ user, set }) => {
      if (!user) {
        set.status = 401;
        return {
          message: "Unauthorized",
        }
      }
    }]
  })
  .get("/tasks", ({ taskRepository }) => {
```

それでは、タスクの取得と作成のルートを修正しましょう。`isAuthenticated` プラグインにより、`user` オブジェクトが `Context` に追加されているため、`Handler` 関数の引数から `user` オブジェクトを取得できます。取得した `user` オブジェクトの `user.id` を `TaskRepository` の `.getAll(){:js}` と `.create(){:js}` メソッドに渡します。

```ts:src/tasks/index.ts {15-16, 24-25}
export const taskRoute = new Elysia()
  .use(taskModel)
  .use(setup)
  .use(isAuthenticated)
  .guard({
    beforeHandle: [({ user, set }) => {
      if (!user) {
        set.status = 401;
        return {
          message: "Unauthorized",
        }
      }
    }]
  })
  .get("/tasks", ({ taskRepository, user }) => {
    const tasks = taskRepository.getAll(user!.id);
    return {
      tasks,
    };
    }, {
      response: "task.tasks",
    }
  )
  .post("/tasks", ({ body, taskRepository, user }) => {
    const newTask = taskRepository.create(body, user!.id);

    return {
      task: newTask,
    };
  }, {
      body: "task.taskDto",
      response: "task.task",
    }
  );
```

これでタスクの一覧・作成 API の修正は完了です。実際にタスクを作成してみましょう。Cookie に JWT トークンが含まれていない場合には、`401 Unauthorized` が返却されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5WxIZubWocHe8VfwvWMXr3/039eebff55597a93a1cb0d5b9b486aae/__________2023-09-16_18.05.37.png)

先程ログイン API をコールした際に取得した Cookie を `Cookie` ヘッダーに含めてリクエストを送信します。HTTPie を使用している場合には、`Headers` を選択した後に、`name` に `Cookie`、`value` に取得した Cookie を入力します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7072j1bm6lGZJTiNUGa9Ok/aa6745da9753d50d5215998c9d32e70e/__________2023-09-16_18.08.19.png)

同様にヘッダーに Cookie をセットした状態で、タスクの一覧を取得してみましょう。ユーザーに紐づいたタスクの一覧が取得できることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4GChuVbhj5fEpOhkUS6YJm/f2ea572c2eadb89582b2ebaabffd0691/__________2023-09-16_18.10.33.png)

別のユーザーを作成してログインした後に、Cookie の値を入れ替えて再度タスクの一覧を取得してみてください。他のユーザーが作成したタスクは取得できないことが確認できます。

## テスト

最後に、作成した API のテストを実装します。Bun には [bun:test](https://bun.sh/docs/cli/test) モジュールがビルドインで提供されていますので、追加のライブラリのインストールを必要せずにテストを実行できます。`bun:test` は [Jest](https://jestjs.io/ja/) に似た API を提供しています。

`package.json` の `scripts` にテストを実行するコマンドを追加しましょう。

```json:package.json {3-4}
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch",
    "dev": "bun run --watch src/index.ts",
    "create-table": "bun src/db/create-table.ts"
  },
}
```

テストではデータベースを使用するので、お互いのテストでデータベースの状態が影響しないように、テストごとにデータベースを初期化するメソッドを用意しておきます。`db/test-utils.ts` ファイルを作成して、すべてのテーブルのデータを削除する `cleanUpDatabase(){:js}` 関数を実装します。

```ts:db/test-utils.ts
import { Database } from "bun:sqlite";

const db = new Database("db.sqlite");

export const cleanUpDatabase = () => {
  db.exec(`
    DELETE FROM tasks;
  `);
  db.exec(`
    DELETE FROM users;
  `);
};
```

もう 1 つ、ユーザーを生成するファクトリー関数も作成しておきましょう。

```ts:db/test-utils.ts
export const createUser = async ({
  username = "test-user",
  password = "password",
}) => {
  const hashedPassword = await Bun.password.hash(password);
  db.exec(`
    INSERT INTO users (id, username, password) VALUES (?, ?, ?);
  `, [crypto.randomUUID(), username, hashedPassword]);
}
```

### 認証機能のテスト

`tests/e2e/auth.test.ts` を作成して、認証機能のテストを実装しましょう。

```ts:tests/e2e.test.ts
import { afterAll, beforeAll, describe, it, expect } from "bun:test";
import { app } from "../../src";
import { cleanUpDatabase } from "../../src/db/test-utils";

describe("auth", () => {
  // テストの前後でデータベースを初期化
  beforeAll(() => {
    cleanUpDatabase();
  })

  // ユーザーの作成 API のテスト
  it("should create a user", async () => {
    // Elysia インスタンスの .handle() メソッドを利用して、API を呼び出す
    // .handle() メソッドは Request オブジェクトを受け取り、Response オブジェクトを返却する
    const response = await app
      .handle(new Request("http://localhost/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))

    const body = await response.json();

    expect(response.status).toEqual(201);
    expect(body).toEqual({
      message: "User created successfully",
    });
  });

  // 同名のユーザーを作成できないことを確認するテスト
  it("should not create a user with the same username", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))

    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: "User already exists",
    });
  });

  afterAll(() => {
    cleanUpDatabase();
  })
});
```

`beforeAll(){:js}` と `afterAll(){:js}` フックを利用して、テストの前後でデータベースを初期化します。Elysia インスタンスの `.handle(){:js}` メソッドは `Request` オブジェクトを受け取り、`Response` オブジェクトを返却します。これにより、HTTP リクエストをシミュレートできます。この `.handle(){:js}` メソッドを利用して、API の呼び出しをテストしています。

Elysia インスタンスである `app` を `src/index.ts` から import するために、`src/index.ts` の `app` を `export` するように修正します。

```ts:src/index.ts {5}
import { Elysia } from "elysia";
import { taskRoute } from "./tasks";
import { authRoute } from "./auth";

export const app = new Elysia()
  .use(taskRoute)
  .use(authRoute);

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

ここで、`src/index.ts` から `app` を import したことで 1 つ問題が生じます。`src/index.ts` ファイルを import したことによる副作用で、`app.listen(3000){:js}` が実行されてしまい、サーバーが起動してしまうのです。

この問題を解決するために、[Bun.main](https://bun.sh/docs/api/utils#bun-main) 変数を利用します。`Bun.main` 変数はエントリーポイントとなっているファイルの絶対パスを保持しています。`import.meta.path` 変数と比較することで、ファイルが直接実行されているか、他のファイルから import されているかを判定できます。ファイルが直接実行されている場合のみ `app.listen(3000){:js}` を実行するように修正します。

```ts:src/index.ts {5-11}
export const app = new Elysia()
  .use(taskRoute)
  .use(authRoute);

if (import.meta.path === Bun.main) {
  app.listen(3000);

  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
}
```

`bun run test` コマンドを実行して、テストが実行されることを確認します。

```sh
bun run test
bun run test
$ bun test
bun test v1.0.1 (31aec4eb)

tests/e2e/auth.test.ts:
✓ auth > should create a user [76.37ms]
✓ auth > should not create a user with the same username [0.25ms]

tests/e2e/tasks.test.ts:

 2 pass
 0 fail
 4 expect() calls
Ran 2 tests across 2 files. [141.00ms]
```

すべてのテストがパスしたことが確認できました。同様に、ログイン API のテストを実装しましょう。

```ts:tests/e2e/auth.test.ts
describe("auth", () => {
  it("should login a user", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      message: "User logged in successfully",
    });
    // ログインに成功した場合、Cookie に JWT トークンが含まれていることを確認
    expect(response.headers.get("set-cookie")).toMatch(/token=.+;/);
  });

  it("should not login a user with wrong password", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "wrong-password",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: "User not found",
    });
  });

  it("should not login a user with wrong username", async () => {
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "wrong-username",
          password: "password",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(400);
    expect(body).toEqual({
      message: "User not found",
    });
  });
});
```

### タスク管理機能のテスト

最後に、タスクの一覧・作成 API のテストを実装します。これらの API をコールする際には、Cookie に JWT トークンを含める必要があるので、`beforeAll(){:js}` フックでログイン API を呼び出して JWT トークンを取得します。

```ts:tests/e2e/tasks.test.ts
import { afterAll, beforeAll, describe, it, expect } from "bun:test";
import { app } from "../../src";
import { cleanUpDatabase, createUser } from "../../src/db/test-utils";

describe("tasks", () => {
  // ログイン API をコールした際に取得した Cookie を保持する変数
  let cookie: string;

  beforeAll(async () => {
    cleanUpDatabase();
    // あらかじめダミーのユーザーを作成しておく
    await createUser({
      username: "alice",
      password: "password",
    });
    // ダミーユーザーでログイン API をコールして JWT トークンを取得
    const response = await app
      .handle(new Request("http://localhost/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "alice",
          password: "password",
        })
      }))
    // ヘッダーに含まれる Cookie を取得
    cookie = response.headers.get("set-cookie")!;
  })

  // クッキーがヘッダーに含まれていない場合には、
  // 401 Unauthorized が返却されることを確認
  it("should not create a task without a cookie", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Buy milk",
          status: "in-progress",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(401);
    expect(body).toEqual({
      message: "Unauthorized",
    });
  });

  // ボディリクエストのバリデーションのテスト
  it("should create a task", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Cookie にログイン API で取得したクッキーを含める
          Cookie: cookie
        },
        body: JSON.stringify({
          name: "Buy milk",
          status: "in-progress",
        })
      }))
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      task: {
        id: expect.any(String),
        name: "Buy milk",
        status: "in-progress",
      }
    });
  });

  it("should validate task dto", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie
        },
        body: JSON.stringify({
          name: "Buy milk",
          status: "invalid-status",
        })
      }))
    const body = await response.text();

    expect(response.status).toEqual(400);
    expect(body).toEqual("Invalid body, 'status': Expected value of union\n\nExpected: {\n  \"name\": \"\",\n  \"status\": \"done\"\n}\n\nFound: {\n  \"name\": \"Buy milk\",\n  \"status\": \"invalid-status\"\n}");
  });

  it("should not get tasks without a cookie", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }))
    const body = await response.json();

    expect(response.status).toEqual(401);
    expect(body).toEqual({
      message: "Unauthorized",
    });
  });

  it("should get tasks", async () => {
    const response = await app
      .handle(new Request("http://localhost/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie
        },
      }))
    const body = await response.json();

    expect(response.status).toEqual(200);
    expect(body).toEqual({
      tasks: [
        {
          id: expect.any(String),
          name: "Buy milk",
          status: "in-progress"
        }
      ]
    });
  });
});
```

テストの実装が完了したら、`bun run test` コマンドを実行して、テストがパスすることを確認します。

```sh
$ bun test
bun test v1.0.1 (31aec4eb)

tests/e2e/auth.test.ts:
✓ auth > should create a user [84.16ms]
✓ auth > should not create a user with the same username [0.23ms]

tests/e2e/tasks.test.ts:
✓ tasks > should not create a task without a cookie [0.44ms]
✓ tasks > should create a task [1.52ms]
✓ tasks > should validate task dto [1.73ms]
✓ tasks > should not get tasks without a cookie [0.14ms]
✓ tasks > should get tasks [0.26ms]

 7 pass
 0 fail
 14 expect() calls
Ran 7 tests across 2 files. [279.00ms]
```

## まとめ

お疲れ様でした。これで、ElysiaJS を使ってタスク管理アプリを作成するチュートリアルは終了です。このチュートリアルでは、ElysiaJS の基本的な使い方を学びました。

ElysiaJS のシンプルな API と型チェックによる快適な開発を体験できたかと思います。この記事で紹介したコードは以下のレポジトリで公開しています。ぜひ、ご参考にしてください。

https://github.com/azukiazusa1/elysiajs-taks-api
