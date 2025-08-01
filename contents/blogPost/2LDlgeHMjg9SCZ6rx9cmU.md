---
id: 2LDlgeHMjg9SCZ6rx9cmU
title: "SvelteKit の remote functions でコンポーネント内で非同期にデータを取得する"
slug: "sveltekit-remote-functions"
about: "SvelteKit の remote functions を使用することで、コンポーネント内で直接非同期にデータを取得したり、サーバーにデータを書き込むことができます。これにより、コンポーネントごとに必要なデータを個別に取得できるようになり、コードの責任の分離が容易になります。remote functions は SvelteKit v2.27 以降で利用可能です。"
createdAt: "2025-08-01T19:31+09:00"
updatedAt: "2025-08-01T19:31+09:00"
tags: ["svelte", "sveltekit"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/166APKkxoUHddjAduR4olG/d6f493ed712b36e4fcd61bcd021ebbd5/castella_15340-768x660.png"
  title: "カステラのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "remote functions で提供される4つの機能に含まれないものはどれですか？"
      answers:
        - text: "query"
          correct: false
          explanation: "query はサーバーからデータを取得するための関数として提供されています。"
        - text: "form"
          correct: false
          explanation: "form はサーバーにデータを書き込むための関数として提供されています。"
        - text: "load"
          correct: true
          explanation: "load は従来の SvelteKit の機能であり、remote functions の機能ではありません。"
        - text: "prerender"
          correct: false
          explanation: "prerender はビルド時に1度だけ実行される関数として提供されています。"
    - question: "マークアップ内で `await` を使用する際に必須となる要素はどれですか？"
      answers:
        - text: "<svelte:async>"
          correct: false
          explanation: null
        - text: "<svelte:boundary>"
          correct: true
          explanation: "マークアップ内で await を使用するためには必ず <svelte:boundary> 要素で囲む必要があります。"
        - text: "<svelte:component>"
          correct: false
          explanation: null
        - text: "<svelte:fragment>"
          correct: false
          explanation: null
    - question: "`command` 関数の特徴として正しいものはどれですか？"
      answers:
        - text: "JavaScript が無効な環境でも動作する"
          correct: false
          explanation: ""
        - text: "任意のイベントハンドラから呼び出すことができる"
          correct: true
          explanation: "command 関数は `form` 関数と異なり `<form>` 以外の場所からも呼び出すことができます。"
        - text: "副作用を含む処理を行うことが出来る"
          correct: false
          explanation: ""
        - text: "複数回同じ引数で呼び出された場合キャッシュされる"
          correct: false
          explanation: ""

published: true
---

昨今の Web フロントエンド開発においてはサーバーとクライアントが統合されたアーキテクチャが主流となりつつあります。例えば React の Server Components はサーバーサイドもしくはビルド時にコンポーネントを事前にレンダリングし、クライアントに静的な HTML を配信することで、初期表示の高速化や SEO の向上を図ることができます。

Server Components 以前よりも Next.js や SvelteKit などのフレームワークでは、サーバーサイドでのデータ取得や処理を行うための仕組みが提供されていました。例えば Next.js では `getServerSideProps` や `getStaticProps` といった関数を使用して、ページコンポーネントのレンダリング前にサーバーサイドでデータを取得できます。

```tsx
export async function getServerSideProps() {
  const data = await fetchDataFromAPI();
  return {
    props: {
      data,
    },
  };
} 

export default function Page({ data }) {
  return <div>{data}</div>;
}
```

しかしこのアプローチにはいくつかの制約があります。この方法はトップレベルのページコンポーネントに限定されており、コンポーネントツリーの深い階層でデータを取得することが難しいという点です。また、サーバーサイドでのデータ取得が不要な React コンポーネントであっても、常にハイドレーションが行われてしまいます。 

Server Components ではコンポーネント内部で直接非同期にデータを取得する処理を記述できるようになるなど、柔軟なデータ取得が可能になります。これによりコンポーネントごとに必要なデータを個別に取得できるようになりました。

```tsx
export default async function Component() {
  const data = await fetchDataFromAPI();
  return <div>{data}</div>;
}
```

パフォーマンス的な観点だけでなく、コードの責任の分離という観点についても重要です。従来は「サーバー」と「クライアント」という技術のレベルで関数が分離されていましたが、Server Components ではコンポーネントという単位で抽象化され、サーバーサイドの処理とクライアントサイドの処理が同じコンポーネント内で完結するようになります。

さて、SvelteKit ではサーバーサイドの処理を行うための `load` 関数が提供されていました。サーバー側での処理は `+page.server.ts` ファイルで定義され、コンポーネント内では `data` Props としてサーバーサイドの `load` 関数から取得したデータを利用できます。

```ts:+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const { id } = params;
  const data = await fetchDataFromAPI(id);
  return { data };
};
```

```svelte:+page.svelte
<script lang="ts">
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<div>
  <h1>Data: {data}</h1>
</div>
```

この手法は Next.js の `getServerSideProps` と同じような問題点を抱えています。ページの末端のコンポーネントで必要なデータであったとしても、ページルートの `load` 関数で取得しなければならず、コンポーネントの階層が深くなるとデータ受け渡しが煩雑になってしまいます。また一見分離しているように見える `+page.server.ts` と `+page.svelte` ですが暗黙の結合が発生しており、コードのリファクタリングが難しくなります。現在の SvelteKit ではこの暗黙の結合を解消するために、自動で生成される型定義である `$types` を使用するという少々奇妙な方法に頼っています。

データの取得とそれを利用される場所を近づけるという観点から、SvelteKit では `remote functions` という新しいアプローチが導入されました。`remote functions` は `.remote.ts` ファイルで定義され、Svelte コンポーネント内から直接呼び出すことができます。サーバーサイドでは通常の関数として呼び出され、クライアントサイドでは `fetch` API のラッパーとして動作します。

`remote functions` では以下の 4 つの機能が提供されます。

- `query`: サーバーからデータを取得するための関数
- `form`: サーバーにデータを書き込むための関数
- `command`: フォーム以外の方法でサーバーにデータを書き込むための関数。JavaScript が実行される環境でのみ呼び出すことができるため、通常は `form` を使用することが推奨される
- `prerender`: `query` と同様にサーバーからデータを取得するための関数だが、ビルド中に 1 度だけ実行される

この記事では、SvelteKit の `remote functions` の使用方法を紹介します。

## Remote Functions を使う

`remote functions` は SvelteKit v2.27 以降で利用可能です。実験的な機能であるため、予告なく機能が変更される可能性があります。まずは `svelte.config.js` ファイルで `kit.experimental.remoteFunctions` オプションを有効にします。また `Remote functions` をより効果的に使用するために[コンポーネント内の await](https://svelte.dev/docs/svelte/await-expressions) 機能も有効にすることを推奨します。

```js:svelte.config.js
export default {
	kit: {
		experimental: {
			remoteFunctions: true,
		}
	},
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};
```

## Query 関数

`query` 関数はサーバーから動的なデータを取得するための関数です。`query` 関数の第 1 引数では [Zod](https://zod.dev/) や [valibot](https://valibot.dev/) などのスキーマバリデーションライブラリを使用して引数の型を定義できます。第 2 引数の関数内でデータを取得する処理を記述します。

`Remote functions` は必ず `.remote.ts` ファイルで定義する必要があります。また必ずサーバーサイドで実行されるため、[server only module](https://svelte.dev/docs/kit/server-only-modules) にもアクセスできます。

```ts:src/routes/todo/data.remote.ts
import { z } from "zod";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";

type Todo = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export const getTodoById = query(z.string(), async (id) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${id}`
  );

  if (!response.ok) {
    error(404, "Todo not found");
  }
  return response.json() as Promise<Todo>;
});
```

コンポーネント内では `getTodoById` 関数を import して呼び出すことができます。マークアップ内で `await` を使用するためには必ず [`<svelte:boundary>`](https://svelte.dev/docs/svelte/svelte-boundary) 要素で囲む必要があります。

マークアップ内で `await getTodoById(page.params.id ?? "")` を使用することで非同期にデータを取得し、結果を表示できます。`page.params.id` は SvelteKit のルーティング機能を使用して URL パラメータから取得されます。

`pending` スニペットはデータの取得中に表示されるコンテンツを定義し、`failed` スニペットはデータの取得に失敗した場合に表示されるコンテンツを定義します。

```svelte:src/routes/todo/[id]/+page.svelte
<script>
  import { getTodoById } from "../data.remote";
  import { page } from '$app/state';
</script>
<h1>Welcome to SvelteKit</h1>

<svelte:boundary>
	<h2>{(await getTodoById(page.params.id ?? "")).title}</h2>

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}

  {#snippet failed(error)}
    {#if error instanceof Error}
      <p>Error: {error.message}</p>
    {:else}
      <p>Unknown error occurred.</p>
    {/if}
  {/snippet}
</svelte:boundary>
```

マークアップ内で `await` を使用する代わりに `$derive` 宣言内で `getTodoById` 関数を呼び出すこともできます。この場合 `<svelte:boundary>` 要素は上位のコンポーネント（例えば `+layout.svelte`）でラップする必要があります。

```svelte:src/routes/todo/[id]/+page.svelte
<script>
  import { getTodoById } from "../data.remote";
  import { page } from '$app/state';

  let todo = $derived(await getTodoById(page.params.id ?? ""));
</script>
<h1>Welcome to SvelteKit</h1>

<h2>{todo.title}</h2>
```

```svelte:src/routes/+layout.svelte
<script lang="ts">
	let { children } = $props();
</script>

<svelte:boundary>
	{@render children?.()}

	{#snippet pending()}
		<p>loading...</p>
	{/snippet}
</svelte:boundary>

```

実際にブラウザの DevTools の Network タブを確認すると、`http://localhost:5173/_app/remote/6v5n9y/getTodoById?payload=WyIzIl0` にリクエストが送信されてデータが取得されていることがわかります。この fetch リクエストでは以下のようなレスポンスが返却されています。

```json
{
    "type": "result",
    "result": "[{\"userId\":1,\"id\":2,\"title\":3,\"completed\":4},1,3,\"fugiat veniam minus\",false]"
}
```

引数とレスポンスは [devalue](https://github.com/sveltejs/devalue) によってシリアライズされており、循環参照を含むオブジェクトや `Date`, `Map`, `Set` などの特殊なオブジェクトもシリアライズ可能です。

`getTodoById` 関数の `refresh` メソッドを使用することで、データを再取得することもできます。

```svelte
<button onclick={() => getTodoById(page.params.id ?? "").refresh()}>
  Refresh
</button>
```

## Form 関数

`form` 関数はサーバーにデータを書き込むための関数です。引数として `formData` オブジェクトを受け取り、サーバーサイドでデータを処理できます。

```ts:src/routes/todo/data.remote.ts
import { form } from "$app/server";
import { error } from "@sveltejs/kit";

export const createTodo = form(
  async (formData) => {
    const title = formData.get("title");
    if (typeof title !== "string") {
      error(400, "Title is required");
    }

    // ここでデータベースに保存する処理を記述
    console.log("Creating todo with title:", title);

    return { success: true };
  }
);
```

Svelte コンポーネント内では `<form>` 要素にスプレット構文を使用して `createTodo` 関数をバインドできます。これにより、フォームの送信時に `createTodo` 関数が呼び出され、サーバーサイドでデータが処理されます。

```svelte:src/routes/todo/new/+page.svelte
<script>
  import { createTodo } from "../data.remote";
</script>

<h1>Create a new Todo</h1>
<form {...createTodo}>
  <label>
    Title:
    <input type="text" name="title" required />
  </label>
  <button type="submit">Create</button>
</form>

<!-- フォームがサブミットされた後にのみメッセージを表示 -->
{#if createTodo.result?.success}
  <p>Todo created successfully!</p>
{/if}
```

実際にフォームを送信すると `http://localhost:5173/_app/remote/kib9q9/createTodo` に POST リクエストが送信され、以下のようなレスポンスが返却されます。

```json
{"type":"result","result":"[{\"success\":1},true]","refreshes":"[{}]"}
```

また `form` 要素には自動で `method="POST"` と `action` 属性が追加されるため、JavaScript が動作しない環境であっても通常のフォーム送信として動作します。

```html
<form method="POST" action="?/remote=kib9q9%2FcreateTodo">

</form>
```

デフォルトではフォームの送信後にすべての `query`, `load` 関数が自動的に更新され最新のデータを取得できるようになります。しかし、不必要な `query`, `load` 関数も更新されてしまうと非効率です。このような場合には `form` 関数内で直接 `query` 関数の `refresh` メソッドを呼び出すことができます。

```ts:src/routes/todo/data.remote.ts
import { form } from "$app/server";
import { error } from "@sveltejs/kit";

const fetchTodos = query(async () => {
});

const getTodoById = query(z.string(), async (id) => {
});

export const createTodo = form(
  async (formData) => {
    const title = formData.get("title");
    if (typeof title !== "string") {
      error(400, "Title is required");
    }

    // ここでデータベースに保存する処理を記述
    console.log("Creating todo with title:", title);

    // 特定の query 関数のみ更新する
    fetchTodos.refresh();

    return { success: true };
  }
);
```

もしくは `createTodo.enhance` メソッドを使用してフォーム送信時の挙動をカスタマイズすることもできます。クライアント側でフォームの送信時に必要な `query` 関数のみを更新する場合には、`submit().updates(...)` メソッドを使用します。

```svelte:src/routes/todo/new/+page.svelte
<script>
  import { createTodo, fetchTodos } from "../data.remote";
</script> 

<h1>Create a new Todo</h1>
<form {...createTodo.enhance(async ({form, data, submit}) => {
  try {
    await submit().updates(fetchTodos());
    form.reset();

    console.log("Todo created successfully:", data);
  } catch (e) {
    console.error("Failed to create todo:", e);
  }
})}>
  <label>
    Title:
    <input type="text" name="title" required />
  </label>
  <button type="submit">Create</button>
</form>
```

また `query` 関数の `withOverride` メソッドを使用すると、楽観的な更新を行うことができます。これにより、フォームの送信後にすぐに UI を更新し、サーバーからのレスポンスを待たずにユーザーにフィードバックを提供できます。

```svelte:src/routes/todo/new/+page.svelte
await submit().updates(
  fetchTodos.withOverride((todos) => [
    ...todos,
    { id: Math.random(), title, completed: false },
  ])
);
```

## Command 関数

`command` 関数も `form` 関数と同様にサーバーにデータを書き込むための関数です。`form` 関数と異なり `<form>` 以外の場所からも呼び出すことができるという特徴があります。その代わりに JavaScript が無効な環境では呼び出すことができません。そのため通常は `form` 関数を使用することが推奨されます。

`command` 関数は第 1 引数にスキーマを、第 2 引数に処理を記述する関数を受け取ります。

```ts:src/routes/todo/data.remote.ts
import { command } from "$app/server";
import z from "zod";

export const toggleTodo = command(
  z.object({
    id: z.string(),
    completed: z.boolean(),
  }),
  async ({ id, completed }) => {
    // ここでデータベースのトグル処理を記述
    console.log("Toggling todo with id:", id, "to", completed);
    return { success: true };
  }
);
```

Svelte コンポーネント内ではボタンをクリックしたときに `toggleTodo` 関数を呼び出すことができます。

```svelte:src/routes/todo/+page.svelte
<script lang="ts">
  import { fetchTodos, toggleTodo } from "./data.remote";

  let todos = $derived(await fetchTodos());
</script>

<h1>Todo List</h1>

<ul>
  {#each todos as todo}
    <li>
      <a href={`/todos/${todo.id}`}>{todo.title}</a>
      <button onclick={async () => {
        try {
          await toggleTodo({ id: todo.id.toString(), completed: !todo.completed });
        } catch (e) {
          console.error("Failed to toggle todo:", e);
        }
      }}>
        {todo.completed ? '✔️' : '❌'}
      </button>
    </li>
  {/each}
</ul>
```

## Prerender 関数

`prerender` 関数は `query` 関数と同様にサーバーからデータを取得するための関数ですが、ビルド時に 1 度だけ実行されるという特徴があります。頻繁に更新されないデータを取得するために使用されます。

```ts:src/routes/posts/data.remote.ts
import { prerender } from "$app/server";

export const getPosts = prerender(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  return response.json();
});
```

`prerender` 関数を引数ありで呼び出した場合、[SvelteKit の事前レンダリングの仕組み](https://svelte.dev/docs/kit/page-options#prerender)に従い、SvelteKit のクローラーによって検出された値の呼び出しのみがビルド時に実行されます。例えば `/posts/1`, `/posts/2` のようなリンクがアプリケーション内に存在する場合、`getPosts(1)` や `getPosts(2)` のような呼び出しが事前レンダリングされます。事前レンダリングされない値を引数として `prerender` 関数を呼び出すことはできません。

クローラーによって検出されない値を事前レンダリングするためには、`input` オプションを使用して明示的に引数の値を指定する必要があります。

```ts:src/routes/posts/data.remote.ts
export const getPostById = prerender(
  z.string(),
  async (id) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.json() as Promise<Post>;
  },
  {
    inputs: () => ["1", "2", "3"],
  }
);
```

動的な `prerender` 関数の呼び出しを可能にするためには、`dynamic` オプションを `true` に設定します。

```ts:src/routes/posts/data.remote.ts
export const getPostById = prerender(
  z.string(),
  async (id) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return response.json() as Promise<Post>;
  },
  {
    dynamic: true,
    inputs: () => ["1", "2", "3"],
  }
);
```

## まとめ

- SvelteKit でサーバーサイドのデータ取得を行うために以前は `load` 関数が使用されていた。しかし、末端のコンポーネントで必要なデータを取得することが難しく、暗黙の結合が発生しているといった問題があった。
- SvelteKit v2.27 以降では `remote functions` が導入され、`.remote.ts` ファイルで定義された関数を使用してサーバーサイドのデータ取得や処理を行うことができるようになった。
- `query` 関数はサーバーからデータを取得し、コンポーネント内で直接呼び出すことができる。
- 新たに Svelte コンポーネントのテンプレート内や `$derived` 宣言内で `await` を使用して非同期にデータを取得できるようになった。
- `form` は `<form>` 要素を使用してサーバーにデータを書き込むための関数で、JavaScript が無効な環境でも動作する。
- `command` 関数は `<form>` 以外の場所からサーバーにデータを書き込むための関数で、JavaScript が有効な環境でのみ使用される。
- `prerender` 関数はビルド時に 1 度だけ実行される関数で、頻繁に更新されないデータを取得するために使用される。

## 参考

- [Remote functions • Docs • Svelte](https://svelte.dev/docs/kit/remote-functions)
- [Remote Functions · sveltejs/kit · Discussion #13897](https://github.com/sveltejs/kit/discussions/13897)
- [await • Docs • Svelte](https://svelte.dev/docs/svelte/await-expressions)
- [<svelte:boundary> • Docs • Svelte](https://svelte.dev/docs/svelte/svelte-boundary)