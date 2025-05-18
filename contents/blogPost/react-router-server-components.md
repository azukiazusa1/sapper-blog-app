---
id: dM1LUa_O-gENLtqAVu0fG
title: "React Router の Server Components 対応"
slug: "react-router-server-components"
about: "React Router はプレビュー版として Server Components に対応しました。これにより loader や actions を使用してデータを返す際にコンポーネント渡したり、Server Components ファーストのサーバーコンポーネントルートを作成できるようになりました。この記事では React Router の Server Components 対応を実際に試してみます。"
createdAt: "2025-05-18T09:46+09:00"
updatedAt: "2025-05-18T09:46+09:00"
tags: ["React", "React Router"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6tPOtWF64W2F9qBnFOCSzN/c2b3617b9b6cb4dc0940c16caaae1522/wagashi_taiyaki_hokuhoku_illust_3540-768x657.png"
  title: "たい焼きのイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/3kP2SwQf4JaKofnFeAG7ST/e3a4ef50127566f4a16b78d542a74a95/React_Router%E3%81%AEServer_Components%E5%AF%BE%E5%BF%9C.wav"
selfAssessment:
  quizzes:
    - question: "ルートモジュールにおいてサーバーコンポーネントをルート要素として使用する方法は次のうちどれか"
      answers:
        - text: "コンポーネントをデフォルトエクスポートする"
          correct: false
          explanation: null
        - text: "ファイルの先頭で use server ディレクティブを宣言する"
          correct: false
          explanation: null
        - text: "ServerComponent という名前のコンポーネントをエクスポートする"
          correct: true
          explanation: null
        - text: "export isServerComponent = true のようなフラグをエクスポートする"
          correct: false
          explanation: null
published: true
---
!> React Router の Server Components 対応はプレビュー版で提供されています。今後変更される可能性がありますので、注意してください。

React Router はプレビュー版として [Server Components](https://react.dev/reference/rsc/server-components) に対応しました。これにより以下のような機能が追加されました。

- [loader](https://reactrouter.com/start/framework/data-loading) や [actions](https://reactrouter.com/start/framework/actions) を使用してデータを返す際にコンポーネント渡せるようになる
- Server Components ファーストのサーバーコンポーネントルート
- `"use server"` ディレクティブを使用した[サーバー関数](https://ja.react.dev/reference/rsc/server-functions)のサポート

この記事では React Router の Server Components 対応を実際に試してみます。

## React Router プロジェクトの作成

まずは React Router のサーバーコンポーネント対応はプレビュー版で提供されている機能です。これを使用するために https://github.com/jacob-ebey/experimental-parcel-react-router-starter リポジトリをクローンします。現在 Vite ではサーバーコンポーネントをサポートしていないため、Parcel が使用されています。

```bash
git clone https://github.com/jacob-ebey/experimental-parcel-react-router-starter.git
```

依存関係をインストールして、開発サーバーを起動します。

```bash
cd experimental-parcel-react-router-starter
pnpm install
pnpm dev
```

http://localhost:3000 にアクセスすると、React Router のサンプルアプリケーションが表示されます。

## `loader` と `action` の使用

`loader` 関数からサーバーコンポーネントを使用する方法を見てみましょう。既存の API と組み合わせてサーバーコンポーネントを使用できるので、従来の React Router の API を使用している場合でも簡単に移行できる点が特徴と言えるでしょう。

TODO リストを API から取得して表示する例を作成してみましょう。`app/routes/todo.tsx` ファイルを作成します。

```tsx:app/routes/todo.tsx
import type { Route } from "./+types/todo"; // この型定義は自動生成される
type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.title}</span>
          <span>{todo.completed ? "✔️" : "❌"}</span>
        </li>
      ))}
    </ul>
  );
}

// loader 関数は React Router によってサーバー側で自動で呼び出される
// クライアントのバンドルに含まれることはない
export async function loader() {
  const json = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = (await json.json()) as Todo[];

  return {
    todoCount: todos.length,
    // loader 関数の戻り値として React コンポーネントを返す
    // これはサーバーコンポーネントとして扱われる
    content: <TodoList todos={todos} />,
  };
}

// loader 関数が返した値は TodoPage コンポーネントの props として渡される
export default function TodoPage({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>Todo List</h1>
      <p>Todo Count: {loaderData.todoCount}</p>
      {/* loader 関数から返されたサーバーコンポーネントを表示 */}
      {loaderData.content}
    </div>
  );
}
```

ルーティングファイルにおいて `loader` という名前の関数を名前付きエクスポートすることで、初期ページの読み込み時やクライアントナビゲーション時にサーバー側で呼び出されます。この関数はクライアントのバンドルに含まれることはないので、サーバー専用の API を呼び出すことができます。

`loader` 関数の戻り値は `export default` でエクスポートしたコンポーネントの props として渡されます。ここで返す値に React コンポーネントを指定できるようになった点が新しい機能です。これはサーバーコンポーネントとして扱われクライアント側に送信されます。そのため `useState` や `useEffect` などのクライアントコンポーネントのみで使用できるフックなどは使用できません。

作成したファイルは `app/routes.ts` でルーティングに追加する必要があります。`route()` 関数を使用して、パス名と import パスを指定します。

```tsx:app/routes.ts {5}
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("todo", "routes/todo.tsx"),
] satisfies RouteConfig;
```

それでは http://localhost:3000/todo にアクセスして確認してみましょう。API から取得した TODO リストが表示されるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/O9V4yrrKENvdGbB9pQ1mX/f7dd79f0c5c5a25d607e7b71c9e0a706/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-18_11.38.20.png)

## サーバーコンポーネントファーストのルート

現在の React Router のルートモジュールから `default` エクスポートされているコンポーネントはクライアントコンポーネントと考えることができます。このコンポーネントはすべてがバンドルされてブラウザに送信されますし、`useState` や `useEffect` などのクライアントコンポーネント専用のフックを使用することができます。

`loader` 関数が返すサーバーコンポーネントを描画するだけでは React がサーバーコンポーネントで目指す完全なアーキテクチャとは言えません。結局のところ、クライアントコンポーネントがルート要素として描画されてしまうからです。

サーバーコンポーネントをルート要素として描画するためには、`default` エクスポートの代わりに `ServerComponent` という名前のコンポーネントをエクスポートします。先ほど作成した TODO リストの例をサーバーコンポーネントファーストのルートに変更してみましょう。

```tsx:app/routes/todo.tsx
type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.title}</span>
          <span>{todo.completed ? "✔️" : "❌"}</span>
        </li>
      ))}
    </ul>
  );
}

export async function ServerComponent() {
  const json = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = (await json.json()) as Todo[];
  return (
    <div>
      <h1>Todo List</h1>
      <TodoList todos={todos} />
    </div>
  );
}
```

http://localhost:3000/todo にアクセスすると、変わらず TODO リストが表示されていることが確認できます。`ServerComponent` 内で `useState` や `useEffect` を呼び出すとサーバーエラーが発生することから、確かにサーバーコンポーネントとして扱われていることがわかります。

サーバーコンポーネントの子孫コンポーネントもすべてサーバーコンポーネントとして扱われます。そのためサーバーコンポーネントをルート要素としたルーティングモジュールで `useState` や `useEffect` を使用したい場合には `"use client"` ディレクティブを使用してクライアントコンポーネントとして扱う必要があります。

```tsx:app/routes/Counter.tsx
"use client";
import { useState, useEffect } from "react";
export function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Count: {count}</div>;
}
```

```tsx:app/routes/todo.tsx
import { Counter } from "./Counter";

export async function ServerComponent() {
  const json = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos = (await json.json()) as Todo[];
  return (
    <div>
      <h1>Todo List</h1>
      <Counter />
      <TodoList todos={todos} />
    </div>
  );
}
```

なお、`ServerComponent` は引き続き `loader` 関数と組み合わせて使用することが可能です。`loader` 関数はサーバーコンポーネントのストリーミングレンダリングが開始される前に呼び出されます。そのためリダイレクトを行ったり、適切なヘッダーやステータスコードを送信する目的で使用できます。

```tsx:app/routes/todo.tsx
import { redirect, data } from "react-router";
import type { Route } from "./+types/todo";

export async function loader({request}: Route.LoaderArgs) {
  const cookie = request.headers.get("cookie");
  const user = await getUser(cookie);
  if (!user) {
    // ログインしていない場合はリダイレクトする
    return redirect("/login");
  }

  const isAuthorized = await checkAuthorization(user);
  if (!isAuthorized) {
    // 認可されていない場合はエラーページを表示する
    throw data("Unauthorized", {
      status: 403,
    });
  }

  return {}
}

export async function ServerComponent() {
 // ...
}
```

## サーバー関数

React の[サーバー関数](https://ja.react.dev/reference/rsc/server-functions)もサポートされています。サーバー関数を定義するためには、[use server](https://ja.react.dev/reference/rsc/use-server) ディレクティブを使用します。

新しい TODO リストを追加するフォームを作成してみましょう。まずはダミーの TODO リストを取得・作成する関数を作成しましょう。`app/routes/db.ts` に以下のコードを追加します。

```ts:app/routes/db.ts
"use server";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const db: Todo[] = [
  {
    id: 1,
    title: "卵を買う",
    completed: false,
  },
  {
    id: 2,
    title: "牛乳を買う",
    completed: true,
  },
];

export async function fetchTodos() {
  return Promise.resolve(db);
}

async function insertTodo(todo: Todo) {
  return new Promise((resolve) => {
    setTimeout(() => {
      db.push(todo);
      resolve(todo);
    }, 1000);
  });
}

// ファイルの先頭で "use server" を指定することで、サーバー関数として扱われる
export async function createTodo(formData: FormData) {
  const title = formData.get("title") as string;
  const newTodo: Todo = {
    id: db.length + 1,
    title,
    completed: false,
  };
  await insertTodo(newTodo);
}
```

`createTodo` 関数はサーバー関数として `<form>` 要素の `action` 属性に指定されます。モジュールの先頭で `"use server"` ディレクティブを指定しているため、この関数はサーバーサイドで実行されます。

`app/routes/todo.tsx` ファイルを編集して TODO を追加するフォームを作成しましょう。

```tsx:app/routes/todo.tsx
import { Todo, fetchTodos, createTodo } from "./db";

function TodoList({ todos }: { todos: Todo[] }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <span>{todo.title}</span>
          <span>{todo.completed ? "✔️" : "❌"}</span>
        </li>
      ))}
    </ul>
  );
}

export async function ServerComponent() {
  const todos = await fetchTodos();

  return (
    <div>
      <h1>Todo List</h1>
      <form action={createTodo}>
        <input type="text" name="title" />
        <button type="submit">追加</button>
      </form>
      <TodoList todos={todos} />
    </div>
  );
}
```

フォームを送信すると React によりフォームがリセットされ、`createTodo` 関数が呼び出されます。サーバー関数が呼び出され後、React Router はルートを再検証し新しいデータで UI の再レンダリングを行います。煩わしいキャッシュの無効化やデータの再取得などは意識する必要がありません。

フォームを送信すると、新しくリストが追加されることが確認できます。

![](https://videos.ctfassets.net/in6v9lxmm5c8/3Zl45At5AcmkLYdYVXywVe/19f46ce94ab573124327323f41e0f02b/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-05-18_13.46.19.mov)

## まとめ

- React Router はプレビュー版として Server Components に対応した
- `loader` や `actions` を使用してデータを返す際にコンポーネント渡せるようになった
- ルートモジュールにおいて `ServerComponent` という名前のコンポーネントをエクスポートすることでサーバーコンポーネントをルート要素として使用できる
- `"use server"` ディレクティブを使用したサーバー関数もサポートされている

## 参考

- [React Router RSC Preview | Remix](https://remix.run/blog/rsc-preview)
- [jacob-ebey/experimental-parcel-react-router-starter](https://github.com/jacob-ebey/experimental-parcel-react-router-starter)
