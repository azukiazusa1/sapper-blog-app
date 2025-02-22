---
id: fQDfqQV8cZ0kmhwHBtQzb
title: " JavaScriptライブラリ Svelteとは"
slug: "what-is-svelte"
about: "Svelteとは、ReactやVue.jsのような宣言的UIライブラリの一種です。その最大の特徴は、ReactやVue.js・Angularと異なりSvelteはコンパイラであることを謳っているところです。Svelteによってコンパイルされたコードは、すべてVanilla JS  - ネイティブのJavaScript- にで生成されます。 そのため、コンパイル後のファイルサイズも小さくパフォーマンス上での利点が期待されています。"
createdAt: "2021-01-24T00:00+09:00"
updatedAt: "2021-01-24T00:00+09:00"
tags: ["Svelte", "", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10yOrB3tXKM12ZJbJdJlw5/e7d9e7de67e916bb0a59695d9882f061/1200px-Svelte_Logo.svg.png"
  title: "Svelte"
selfAssessment: null
published: true
---
Svelte とは、React や Vue.js・Angular のような宣言的 UI ライブラリの一種です。
その最大の特徴は、React や Vue.js・Angular と異なり Svelte は**コンパイラ**であることを謳っているところです。Svelte によってコンパイルされたコードは、すべて Vanilla JS  - ネイティブの JavaScript- にで生成されます。

そのため、コンパイル後のファイルサイズも小さくパフォーマンス上での利点が期待されています。 実際に React の**35倍**、Vue.js の**50倍**のベンチマークが計測されているようです。

また 2020/07/17 には公式で TypeScript に対応しています。

# プロジェクトを作成する

＊ Node.js がインストールされていることが前提です。

下記コマンドで TypeScript での Svelte プロジェクトを作成します。

```sh
npx degit sveltejs/template svelte-typescript-app
cd svelte-typescript-app
node scripts/setupTypeScript.js
Converted to TypeScript.
```

プロジェクトの作成したら、依存モジュールをインストールして起動してみましょう！
```sh
npm install
npm run dev
```

[localhost:5000](localhost:5000)にアクセスすると、次の画面が表示されているはずです。

![スクリーンショット 20210124 17.03.01.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FX2ytUqIKXThYYQgTuAq3%2F0d4f8f7c2e8f2ee353bbfcbaa8347b15.png?alt=media&token=ebabd5f7-fa22-42d3-9f4e-d94a8eede63b)

もし vscode を利用しているのならば、公式の拡張を導入することをおすすめします。

[Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)

# ファイルの中身を確認する

作成した Svelte プロジェクトがどのような構造になっているのか見ていきましょう。
ディレクトリ構成は次のとおりです。

```sh
├── package-lock.json
├── package.json
├── public
│   ├── build
│   │   ├── bundle.css
│   │   ├── bundle.js
│   │   └── bundle.js.map
│   ├── favicon.png
│   ├── global.css
│   └── index.html
├── rollup.config.js
├── src
│   ├── App.svelte
│   └── main.ts
└── tsconfig.json
```

Svelte もまたコンポーネント指向のライブラリです。最初コンポーネントは `src/App.svelte` です。Svelte のコンポーネントは `.svelte` という拡張子を使います。

```html:App.svelte
<script lang="ts">
	export let name: string;
</script>

<main>
	<h1>Hello {name}!</h1>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
```

1 つのファイルに HTML・JavaScript・CSS がまとまっており、Vue.js の単一ファイルコンポーネントによく似ています。

`<style>` タグは、常に scoped として扱われる - そのコンポーネント内のみに適応される - ことに注意してください。

ブラウザのデバッグツールで見てみると、コンポーネントの `<style>` タグで宣言したスタイルにはランダムな文字列が付与されていることがわかります。

![スクリーンショット 20210124 17.38.30.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FX2ytUqIKXThYYQgTuAq3%2Fa1ada3d72dad432587a387e1b9360c4b.png?alt=media&token=5102a8de-187d-46d9-bb45-80fb117e662d)

ざっくりとした説明として、`<script>` タグ内で宣言された変数はテンプレート内で `{}` で囲って参照できます。このとき、変数の値は常にリアクティブであり、変数の値が変更されるたびに HTML での描画が更新されます。

ここで 1 つ奇妙なのが、たしかに `name` という変数は宣言されているもののそこに値は代入されていないことです。なぜ WORLD と表示されているのでしょうか？

実は、export されている変数は props として外から値を渡すことができます。実際に App.svelte を生成している `src/main.ts` のコードを見てみましょう。

```ts:main.ts
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'world'
	}
});

export default app;
```

確かに、props として `name: 'world'` が渡されています。`src/main.ts` は `<body>` 要素に対して App.svelte をマウントするコードです。

ここまで理解したところで、試しに `name` の値を変更してみましょう。
画面の表示も変更された値に切り替わるはずです。

```ts
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'svelte'
	}
});

export default app;
```

![スクリーンショット 20210124 17.37.37.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FX2ytUqIKXThYYQgTuAq3%2F6a87993a9bf1bb309ab3d4ccb9f6eb9c.png?alt=media&token=1e965e93-447c-4d39-8685-eb5a82ba9dfe)

# カウンターアプリの作成

Svelte のリアクティブ性を確認するために、おなじみのカウンターアプリを作成してみましょう。

まずは、`count` 変数を宣言して単純に表示します。

```html
<script lang="ts">
	let count = 0
</script>

<main>
	<h1>{count}</h1>
</main>
```

## イベントハンドリング

ボタンをクリックした際に、`count` の数を増やしたり減らしたりするようにできるようにします。
ボタンがクリックされたイベントを購読するには、`on:click` 属性を付与します。

属性の値をして渡す関数は、単純に `<script>` ないで JavaScript の関数を宣言します。

```html
<script lang="ts">
	let count = 0
	const increment = () => {
		count++
	}

	const decrement = () => {
		count--
	}
</script>

<main>
	<h1>{count}</h1>
	<button on:click={increment}>+1</button>
	<button on:click={decrement}>-1</button>
</main>

```

![svelte count.gif](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FX2ytUqIKXThYYQgTuAq3%2Fa2c42d6b01af912fff61041dc1125d29.gif?alt=media&token=a1958cb1-7666-45bb-aae0-20178ab165c5)

## リアクティブな値を宣言する

宣言した変数の状態が変化すると即座に DOM が再描画されることがわかりました。
おそらくあなたは Vue.js の computed のように依存された値が変化したときに再描画される値が欲しいことでしょう。

Svelte では `$:` を用いて宣言します。

```html
<script lang="ts">
	let count = 0

	$: doubled = count * 2
	const increment = () => {
		count++
	}

	const decrement = () => {
		count--
	}
</script>

<main>
	<h1>{count} {doubled}</h1>
	<button on:click={increment}>+1</button>
	<button on:click={decrement}>-1</button>
</main>
```

`$:` 用いた奇妙な構文は Svelte 特有のものに見えますが、実はネイティブ JavaScript のれっきとした構文です。（とはいえ実際にこの構文を利用することはほとんどないかと思いますが・・・）

[label](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/label)

`$:` は、ブロックスコープで宣言することも可能です。

```ts
$: {
  console.log(count)
  console.log(doubled)
}
```

# 制御構文 (if,each)

カウンターの数をマイナスにはしたくないので、decrement ボタンは `count` の数が 1 以上のときのみ表示するようにしましょう。

if 文は HTML 内で `{#if condition} {/if}` で囲って使うことができます。

```html
<main>
	<h1>{count} {doubled}</h1>
	<button on:click={increment}>+1</button>
	{#if count > 1}
		<button on:click={decrement}>-1</button>
	{/if}
</main>
```

`{#each }{/each}` ブロックを用いて、繰り返し処理を記述できます。

```html
<script lang="ts">
	const users = [
		{ id: 1, name: 'Alice'},
		{ id: 2, name: 'Bob'},
		{ id: 3, name: 'charlie'},
	]
</script>

<main>
	{#each users as user}
		<div>{user.name}</div>
	{/each}
</main>
```

また各要素の一意な属性として key を与えることができます。

```html

<main>
	{#each users as user (user.id)}
		<div>{user.name}</div>
	{/each}
</main>
```

# おわりに

以上が、Svelte の簡単な構文の紹介でした。触ってみた感想ですが、React や Vue.js など既存の JavaScript フレームワークに慣れている場合には少ない学習コストで理解できると思います。

[公式のチュートリアル](https://svelte.dev/tutorial/basics)も充実しているので、ぜひ一度触ってみてはいかがでしょうか？
