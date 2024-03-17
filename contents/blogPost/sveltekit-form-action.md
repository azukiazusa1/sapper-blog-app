---
id: -tSK1afPVjWwdn969FHoA
title: "SvelteKit のフォーム操作"
slug: "sveltekit-form-action"
about: "SvelteKit のフォームは Web 標準の機能のみで完結しています。つまり、クライアントサイドでは JavaScript を一切使用せずにサーバーにデータを送信できるのです。さらに、JavaScript を利用できる環境であるならばリッチなユーザー体験を追加できます。例えば、フォームを送信した後ページ全体の再読み込みを行わずに、フォームの送信結果を表示することができたり、バリデーションメッセージを即座に表示できたりします。"
createdAt: "2023-04-30T13:59+09:00"
updatedAt: "2023-04-30T13:59+09:00"
tags: ["Svelte", "SvelteKit"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10yOrB3tXKM12ZJbJdJlw5/e7d9e7de67e916bb0a59695d9882f061/1200px-Svelte_Logo.svg.png"
  title: "Svelte"
selfAssessment: null
published: true
---
SvelteKit のフォームは Web 標準の機能のみで完結しています。つまり、クライアントサイドでは JavaScript を一切使用せずにサーバーにデータを送信できるのです。

さらに、JavaScript を利用できる環境であるならばリッチなユーザー体験を追加できます。例えば、フォームを送信した後ページ全体の再読み込みを行わずに、フォームの送信結果を表示できたり、バリデーションメッセージを即座に表示できたりします。

このように古いブラウザや機能の限られた端末のユーザーをサポートしつつ　、モダンなブラウザのユーザーにはリッチなユーザー体験を提供することは[プログレッシブエンハンスメント](https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement)と呼ばれています。
SveltKit のフォームは簡単にプログレッシブエンハンスメントを実現できるように設計されています。

## シンプルなフォーム

まずははじめに一番シンプルなフォームを作成してみましょう。`routes` ディレクトリ配下の `+page.svelte` という名前のファイルはクライアントのページを担当します。例えば、`src/routes/todo/add/+page.svelte` というファイルは `/todo/add` という URL に対応するページをレンダリングします。

```svelte:src/routes/todo/add/+page.svelte
<h1>Add Todo</h1>

<form method="post">
	<label for="title">Title</label>
	<input type="text" id="title" name="title" placeholder="Title" />

	<label for="description">Description</label>
	<textarea id="description" name="description" placeholder="Description" />

	<button type="submit">Add</button>
</form>
```

中身は純粋な HTML のみで構成されたフォームです。Svelte に慣れていない方にとっても見慣れたフォームではないでしょうか。

`method="post"` という属性が付与されているので、このフォームは POST メソッドでデータを送信します。`<input>` や `<textarea>` には `name` 属性が付与されています。これはフォームのデータを送信する際に、どのようなキーでデータを送信するかを指定するためのものです。

![](https://images.ctfassets.net/in6v9lxmm5c8/Wk0sBPRs0ctC1UziPPeQX/0efc6c13b445d6aef7010b2ff906b69c/__________2023-04-30_14.20.12.png)

## actions でサーバー側の処理を記述する

続いてフォームが送信された時に処理を行うサーバー側の実装を行います。サーバー側の処理を記述する場合には `+page.server.ts` という名前のファイルを作成します。先程作成した `+page.svelte` と同じディレクトリに `+page.server.ts` を作成すると、`+page.svelte` と同じ URL に対応するサーバー側の処理を記述できます。

フォームの送信結果をサーバー側で受け取る場合には `actions` という名前のオブジェクトを export します。実際の処理は `default` という名前の関数内に記述します。この `default` とはフォームに名前が付与されていない場合に呼び出される関数の名前です。`default` 以外の名前のプロパティとすることで、フォームに名前を付与でき、同じ　URL に対して複数のフォームを作成できます。

```ts:src/routes/todo/add/+page.server.ts
import { fail, type Actions } from '@sveltejs/kit';

/** DB に保存するときの遅延を擬似的に再現 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/*+ 偽の DB に保存する関数 */
const createTodo = async (todo: { title: string; description: string }) => {
	console.log('createTodo', todo);
	await sleep(1500);
	return { id: crypto.randomUUID(), done: false, ...todo };
};

export const actions = {
	default: async ({ request }) => {
		// リクエストからフォームデータを取得
		const data = await request.formData();

		const title = data.get('title');
		const description = data.get('description');

		// 簡易的なバリデーション
		if (!title) {
			// fail は SvelteKit のヘルパー関数
			// 失敗を表すレスポンスを返す
			return fail(400, {
				errors: {
					title: 'required'
				},
				title: title?.toString() ?? '',
				description: description?.toString() ?? ''
			});
		}

    await createTodo({
      title: title.toString(),
      description: description?.toString() ?? ''
    });

    // 成功を表すレスポンスを返す
    return {
      success: true
    };
	}
} satisfies Actions;
```

ここでは擬似的に作成した Todo を DB に保存する処理を実行しています。`actions` オブジェクトのそれぞれのプロパティは [RequestEvent](https://kit.svelte.jp/docs/types#public-types-requestevent) オブジェクトを引数に受け取ります。プロパティの 1 つとして [Request](https://developer.mozilla.org/ja/docs/Web/API/Request) オブジェクトを受け取るので、`await request.formData()` とすることでフォームのデータを取得できます。

`data.get('title')` でフォームの `name` 属性が `title` である要素の値を取得できます。

```ts
export const actions = {
	default: async ({ request }) => {
		// リクエストからフォームデータを取得
		const data = await request.formData();

		const title = data.get('title');
		const description = data.get('description');
```

もし `title` が未入力であった場合、バリデーションエラーを返すようにしています。SvelteKit の [fail](https://kit.svelte.jp/docs/modules#sveltejs-kit-fail) 関数を呼び出すことで、リクエストを失敗したことを表すレスポンスを返します。このとき、入力された値をそのまま返すことで、フォームの値を保持したままエラーを表示できます。

```ts
if (!title) {
  return fail(400, {
    errors: {
      title: 'required'
    },
    title: title?.toString() ?? '',
    description: description?.toString() ?? ''
  });
}
```

フォームの値が正しく保存できた場合には、`{ success: true }` というレスポンスを返しています。

```ts
await createTodo({
  title: title.toString(),
  description: description?.toString() ?? ''
});

// 成功を表すレスポンスを返す
return {
  success: true
};
```

このとき返すオブジェクトは JSON としてシリアライズ可能である必要があります。

## actios の返すレスポンスを処理する

`actions` の `default` 関数内で返されたオブジェクトは、`+page.svelte` 内で `form` という名前の変数を export することで受け取ることができます。このとき、`form` の型定義は `./$types` という SvelteKit が作成する特別なファイルから import します。

`./$types` の型はサーバー側の処理を記述したときの開発サーバーを起動しているか、`svelte-kit sync` を実行した際に生成されます。

```ts:src/routes/todo/add/+page.svelte
<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>
```

この `form` 変数の値を使用して、以下の処理を追加します。

- フォームの送信に成功した場合には、`Todo added!` というメッセージを表示する
- フォームの送信に失敗した場合には、`Title is required` というメッセージを表示する
- フォームの送信に成功した場合には、前回のフォームの値を保持する

```diff:src/routes/todo/add/+page.svelte
+ {#if form?.success}
+ 	<p style:color="green">Todo added!</p>
+ {/if}

  <h1>Add Todo</h1>

  <form method="post">
  	<label for="title">Title</label>
-   <input type="text" id="title" name="title" placeholder="Title" />
+ 	<input type="text" id="title" name="title" placeholder="Title" value={form?.title ?? ''} />
+ 	<p style:color="red">
+ 		{#if form?.errors?.title === 'required'}
+ 			Title is required
+ 		{/if}
+ 	</p>

  	<label for="description">Description</label>
-  <textarea id="description" name="description" placeholder="Description" />
+ 	<textarea
+ 		id="description"
+ 		name="description"
+ 		placeholder="Description"
+ 		value={form?.description ?? ''}
+ 	/>

  	<button type="submit">Add</button>
  </form>
```

次のように、エラーメッセージや成功メッセージが表示されることを確認できます。

![フォームの送信に成功し、Todo added! というメッセージが表示されている](https://images.ctfassets.net/in6v9lxmm5c8/4GmIGUNPBIJIZ2lqA6BSkV/032323c513146c5d300ff91e1362fb81/__________2023-04-30_15.03.07.png)

![フォームの送信に失敗し、Title is required というメッセージが表示されている](https://images.ctfassets.net/in6v9lxmm5c8/2366ogogWe9j6RKtAGtbbG/512c0b0f3f057ac07908d98917e6cbbd/__________2023-04-30_15.02.53.png)

## プログレッシブエンハンスメントを実装する

今まで実装したフォームはクライアントサイドの JavaScript を一切使用せずに実装してきました。ブラウザの JavaScript を無効にした状態で試してみると、実際に変わりなく動作することが確認できます。

冒頭でも説明したとおり、プログレッシブエンハンスメントとして JavaScript を使用できる環境ではリッチなユーザー体験を追加できます。フォームにプログレッシブエンハンスメントを追加する方法は簡単です。`<form>` に `use:enhanec` アクションを追加することです。

```diff:src/routes/todo/add/+page.svelte
  <script lang="ts">
+ 	import { enhance } from '$app/forms';
  	import type { ActionData } from './$types';

  	export let form: ActionData;
  </script>

  {#if form?.success}
  	<p style:color="green">Todo added!</p>
  {/if}

  <h1>Add Todo</h1>

- <form method="post">
+  <form method="post" use:enhance>
  	<label for="title">Title</label>
  	<input type="text" id="title" name="title" placeholder="Title" value={form?.title ?? ''} />
```

この `use:` は Svelte の [アクション](https://svelte.jp/docs#template-syntax-element-directives-use-action) と呼ばれるディレクティブです。
`use:` ディレクティブには関数を渡し、要素が作成された時に関数が呼び出されます。`destory` メソッドを持つオブジェクトを返すと、要素がアンマウントされるときに `destory` メソッドが呼び出されます。`update` メソッドを持つオブジェクトを返すと、要素が更新されるときに `update` メソッドが呼び出されます。

```svelte
<script>
	function foo(node) {
		// the node has been mounted in the DOM

		return {
			destroy() {
				// the node has been removed from the DOM
			},
      update(bar) {
				// the value of `bar` has changed
			},
		};
	}
</script>

<div use:foo></div>
```

ここで `<form>` に渡している `enhance` 関数は SvelteKit の [$app/forms](https://kit.svelte.jp/docs/modules#$app-forms) モジュールからインポートしています。`use:enhance` を使用している場合、フォームを送信してページを再読み込みする代わりに、`fetch` 関数を用いてフォームデータを送信するようになります。このとき、ブラウザネイティブの動作が JavaScript でエミュレートされます。

- actions が送信元のページと同じ場所にある場合に限り、成功レスポンスまたは不正なレスポンスにおじて `form` プロパティ、`$page.form`、`$page.status` の値が更新される
- 成功レスポンスの場合 `<form>` をリセットし、[invalidateAll](https://kit.svelte.jp/docs/modules#$app-navigation-invalidateall) でデータを最新化する
- actios の中で [redirect](https://kit.svelte.jp/docs/modules#sveltejs-kit-redirect) を呼び出した場合、[goto](https://kit.svelte.jp/docs/modules#$app-navigation-goto) でナビゲーションする
- エラーが発生した場合、最も近くの `+error.svelte` をレンダリングする
- 適切な要素に[フォーカスをリセット](https://kit.svelte.jp/docs/accessibility#focus-management)する

### エンハンスメントのカスタマイズ

`use:enhance` に引数を渡すことで、エンハンスメントの動作をカスタマイズできます。引数には [SubmitFunction](https://kit.svelte.jp/docs/types#public-types-submitfunction) 関数を受け取ります。この関数は form が送信される前に呼び出され、フォームの送信が完了したらコールバック関数を呼び出します。

エンハンスメントのカスタマイズにより、例えばロード中の UI を表示したりなどの処理を行えます。   

```diff:src/routes/todo/add/+page.svelte
  <script lang="ts">
  	import { enhance } from '$app/forms';
  	import type { ActionData } from './$types';

  	export let form: ActionData;

+ 	let loading = false;
  </script>

  {#if form?.success}
  	<p style:color="green">Todo added!</p>
  {/if}

+ {#if loading}
+ 	<p>Loading...</p>
+ {/if}

  <h1>Add Todo</h1>

  <form
  	method="post"
-   use:enhance
+ 	use:enhance={({ form, data, action, cancel, submitter }) => {
+ 		loading = true;
+
+ 		return async ({ result, update }) => {
+       await update();
+ 			loading = false;
+ 		};
  	}}
  >
```

## 名前付きフォーム

`actions` オブジェクトのプロパティとして単一の `default` プロパティを返す代わりに、複数の名前付き action を定義できます。

例えば、Todo の一覧ページで Todo の完了と削除をどちらも行えるフォームを考えてみましょう。この場合、`actions` オブジェクトに `complete` と `delete` の 2 つのプロパティを追加します。

パスパラメーターとして　`id` を受け取るため、`src/routes/todo/[id]` というディレクトリに `+page.server.ts` ファイルを配置します。

```ts:src/routes/todo/[id]+page.server.svelte
import { type Actions, type Load, fail } from '@sveltejs/kit';

/**
 * ロード関数はレンダリング前にデータを取得する関数
 * 通常は DB からデータを取得するはず
 */
export const load: Load = () => {
	return {
		todos: [
			{
				id: '1',
				title: 'title1',
				description: 'description1',
				done: false
			},
			{
				id: '2',
				title: 'title2',
				description: 'description2',
				done: false
			},
			{
				id: '3',
				title: 'title3',
				description: 'description3'
			}
		]
	};
};

export const actions = {
	/** Todo を完了する action */
	complete: async ({ params }) => {
		const { id } = params;

		if (!id) {
			return fail(400, {
				errors: {
					id: 'required'
				}
			});
		}

		// DB を更新する処理...

		return {
			update: true
		};
	},
	delete: async ({ params }) => {
		const { id } = params;

		if (!id) {
			return fail(400, {
				errors: {
					id: 'required'
				}
			});
		}

		// DB を更新する処理...

		return {
			delete: true
		};
	}
} satisfies Actions;
```

それぞれのアクションでは `params` から id を受け取り、更新と削除を実行します。

`+page.svelte` 側ではサブミットボタンの `formaction` 属性によってどのアクションを呼び出すか指定しています。名前付きアクションを呼び出すにはクエリパラメーターに `/` をプレフィックスにしたアクション名です。`complete` アクションを呼び出すなら `formaction="?/complete` のようにします。

一覧ページはフォームの処理を行う `/tood/id/` というパスと異なる `/todo` というパスであるため、フォームアクション名を指定したクエリパラメータの他にフォームの指定先のパスを指定する必要があります。`formaction` の実際の値は `/todo/{todo.id}?/complete` のようになります。

```svelte:src/routes/todo/+page.svelte
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Todo</h1>

<form method="post" use:enhance>
	<ul>
		{#each data.todos as todo}
			<li>
				<span>{todo.title}</span>
				<span>{todo.done ? '✅' : '❌'}</span>
				<button
					type="submit"
					formaction="/todo/{todo.id}?/complete"
					data-id={todo.id}
					value={todo.id}
				>
					{todo.done ? 'Mark as incomplete' : 'Mark as complete'}
				</button>
				<button type="submit" formaction="/todo/{todo.id}?/delete" data-id={todo.id}>
					Delete
				</button>
			</li>
		{/each}
	</ul>
</form>
```

なお、名前付きアクションを使用している場合には `default` action を定義できません。

## スナップショット

通常、フォームの値を入力した後にページを更新したりブラウザバックしたりすると、フォームの値が消えてしまいます。誤ってページから離脱してしまった場合、はじめからフォームの値を入力しなおす必要があるのはユーザー体験上好ましくないでしょう。

SvelteKit では DOM の状態をスナップショットとして保存でき、ユーザーが戻ってきた時に復元できます。スナップショットを利用するためには、`capture` メソッドと `restore` メソッドを持つ `snapshot` オブジェクトを `+page.svelte` 上で export します。

ユーザーがページから離脱する際には `capture` メソッドが呼ばれます。このメソッドの戻り値がスナップショットとして保存されます。ユーザーがページに戻ってきた際には `restore` メソッドが呼ばれ、引数として `capture` メソッドで返した値が渡されます。

```svelte:src/routes/todo/add/+page.svelte
<script lang="ts">
	import type { ActionData, Snapshot } from './$types';

	export let form: ActionData;

	let title = '';
	let description = '';

	export const snapshot = {
		capture: () => ({
			title,
			description
		}),
		restore: (data) => {
			title = data.title;
			description = data.description;
		}
	} satisfies Snapshot;
</script>

	<label for="title">Title</label>
	<input
		type="text"
		id="title"
		name="title"
		placeholder="Title"
		value={form?.title ?? title}
		on:change={(e) => {
			if (e.target instanceof HTMLInputElement) {
				title = e.target.value;
			}
		}}
	/>

  	<label for="description">Description</label>
	<textarea
		id="description"
		name="description"
		placeholder="Description"
		value={form?.description ?? description}
		on:change={(e) => {
			if (e.target instanceof HTMLTextAreaElement) {
				description = e.target.value;
			}
		}}
	/>
```

データは `sessionStorage` に保存されます。そのため、JSON としてシリアライズ可能である必要があります。

## まとめ

- SvelteKit のフォームは Web 標準の機能のみで実装できる
- `use:enhance` ディレクティブを使うことでリッチなユーザー体験を提供できる
