---
id: 3n1WbmUGqodJpX5yJ1ACsQ
title: "【Svelte + TypeScript + tailwindcss】本検索サイト チュートリアル"
slug: "svelte-typescript-tailwindcss-book-search-app-tutorial"
about: "この記事でははSvelte + TypeScript + tailwindcssで本検索サイトを作成します。 Svelteを使ってアプリケーションを作成1から作成することができます。 以下のことが学べます。  - Svelteの基礎文法 - Svelteのルーティング - Svelteのストア  HTML・CSS・JavaScriptの基礎的な理解がある人が対象です。"
createdAt: "2021-02-07T00:00+09:00"
updatedAt: "2021-02-07T00:00+09:00"
tags: ["Svelte", "JavaScript", "tailwindcss", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/10yOrB3tXKM12ZJbJdJlw5/e7d9e7de67e916bb0a59695d9882f061/1200px-Svelte_Logo.svg.png"
  title: "Svelte"
selfAssessment: null
published: true
---
# はじめに

この記事では Svelte + TypeScript + tailwindcss で本検索サイトを作成します。

成果物は以下のようなアプリケーションです。

本の検索ページ。

![svelte-book.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/4342d3a4-f513-d44b-a9a6-4f02d646f572.gif)

本の詳細ページ。

![スクリーンショット 2021-02-07 19.11.10.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/adc3acde-c092-5e18-4ac5-9fa01680a4ec.png)

Svelte を使ってアプリケーションを作成 1 から作成できます。
以下のことが学べます。

- Svelte の基礎文法
- Svelte のルーティング
- Svelte のストア

HTML・CSS・JavaScript の基礎的な理解がある人が対象です。

また完成したソースコードはこちらから参照できます。

https://github.com/azukiazusa1/svelte-book-review-app

# 0 Node.jsのインストール

環境構築には Node.js のインストールが必要です。
もし Node.js がインストールされていない場合には、こちらからインストールを済ませていおいてください。

https://nodejs.org/ja/download/

# Svelteプロジェクトの準備

まずは Svelte プロジェクトを作成しましょう。
本書では CSS フレームワークとして tailwingcss を利用しますが、はじめから組み込まれているテンプレートが存在するのでこちらを利用します。

https://github.com/sarioglu/svelte-tailwindcss-template

```sh
npx degit sarioglu/svelte-tailwindcss-template svelte-book-review-app
cd svelte-book-review-app
```

TypeScript に変換します。

```sh
node scripts/setupTypeScript.js
```

依存関係をインストールします。

```sh
npm install
```

2021/02/06 の時点でこのままですとエラーになる箇所が存在するので修正を行います。

`rollup.config.js` の以下の部分を削除してください。

```diff
import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
- import sveltePreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ postcss: true }),
-			preprocess: sveltePreprocess(),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
```

ここまで完了したら、アプリケーションを起動してみましょう！

```sh
npm run dev
```

http://localhost:5000 をブラウザで開いてください！次の画面が表示されているはずです。
![スクリーンショット 2021-02-06 14.29.31.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/cf280a39-4066-66a8-bc70-c8c24577191f.png)

# おすすめのvscode拡張

https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode

https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss

# Svelteの基礎の確認

最初に自動生成されたコードを確認してみましょう。
Svelte のコンポーネントは `.svelte` という拡張子が使われています。
`App.svelte` ファイルを開きます。

```html:App.svelte
<script lang="ts">
	import Tailwindcss from './Tailwindcss.svelte';

	export let name: string;
</script>

<Tailwindcss />
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

ざっくりとした説明として、`<script>` タグ内で宣言された変数はテンプレート内で{}で囲って参照できます。このとき、変数の値は常にリアクティブであり、変数の値が変更されるたびに HTML での描画が更新されます。

ここで 1 つ奇妙なのが、たしかに name という変数は宣言されているもののそこに値は代入されていないことです。なぜ WORLD と表示されているのでしょうか？

実は、export されている変数は props として外から値を渡すことができます。実際に App.svelte を生成している main.ts のコードを見てみましょう。

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

確かに、props として name: 'world'が渡されています。`main.ts` は `<body>` 要素に対して App.svelte をマウントするコードです。

ここまで理解したところで、試しに name の値を変更してみましょう。
画面の表示も変更された値に切り替わるはずです。

```ts:main.ts
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'svelte'
	}
});

export default app;
```

![スクリーンショット 2021-02-06 14.51.40.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/0ce5d366-f3fd-17ee-1a7d-448b7feea5e8.png)

# ヘッダーコンポーネントの作成

それでは、一番最初のコンポーネントを作成しましょう。
`src` フォルダ配下に `components` ディレクトリを作成して `Header.svelte` ファイルを作成します。

```html:Header.svelte
<header class="top-0 lef-0 w-full z-40 bg-gray-900 shadow fixed border-b border-gray-200">
  <div class="container mx-auto px-6 h-16 flex justify-between items-center">
    <span class="font-semibold text-xl text-white tracking-tight">
      ブックレビュー App
    </span>
  </div>
</header>
```

App.svelte からヘッダーコンポーネントを利用します。
作成した svelte ファイルを `import` して HTML タグのように利用します。

```html:App.svelte
<script lang="ts">
  import Tailwindcss from './Tailwindcss.svelte';
  import Header from './components/Header.svelte'

	export let name: string;
</script>

<Tailwindcss />
<Header />
<main class="pt-16">
  <div class="container mx-auto px-6 my-4">
    <h1>Hello {name}!</h1>
    <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
  </div>
</main>
```

このとき、もともと存在していた `<style>` タグは不要なので消してしまいましょう。
`public/global.css` も同様に削除します。

```sh
rm public/global.css
```

ここまでの変更で、次のような画面になっています。
![スクリーンショット 2021-02-06 15.39.40.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/2cc4a747-e0a7-bf05-57ad-ec12d27165f3.png)

# svelte-spa-routerのインストール

このアプリケーションでは複数ページを扱う予定ですので、Vue Router や React Router のようなルーティングライブラリを導入します。

今回は svelte-spa-router を利用します。
https://github.com/ItalyPaleAle/svelte-spa-router

svelte-spa-router は、ハッシュを用いてルーティングを管理します。
例えば `/books/123` へルーティングをさせたい場合にはhttp://localhost:5000/#/books/123 という URL にマッチすることになります。

下記コマンドでインストールしましょう。

```sh
npm install svelte-spa-router
```

# ルーティングの定義の作成

どのコンポーネントをどのルーティングに結びつけるのかの対応を作成します。
`src` フォルダ配下に `router/index.ts` を作成します。

```ts:router/index.ts
import SearchBook from '../pages/SearchBook.svelte'

export const routes = {
  '/': SearchBook,
}
```

`/` というパスにアクセスした場合に、`SearchBook` コンポーネントにマッチするように定義します。

`/pages/SearchBook.svelte` も作成しておきましょう。

```html:pages/SearchBook.svelte
<div>
  本を探す
</div>
```

# Router Viewの作成

ルートを定義したら、定義したルートを描画するようにしましょう。
`App.svelte` を修正します。

```html:App.svelte
<script lang="ts">
  import Tailwindcss from './Tailwindcss.svelte';
  import Header from './components/Header.svelte'
  import Router from 'svelte-spa-router'
  import { routes } from './router'
</script>

<Tailwindcss />
<Header />
<main class="pt-16">
  <div class="container mx-auto px-6 my-4">
    <Router {routes} />
  </div>
</main>
```

`Router` コンポーネントに、さきほど作成したルート定義を `routes`prop として渡します。

Svelte では、props と渡す変数名が一致するとき省略記法を利用できます。
つまり、次のように記述は同一です。

```html
<Router routes="{routes}" /> <Router {routes} />
```

ここまで進めたら、SearchBook コンポーネントの内容が表示されているはずです。

![スクリーンショット 2021-02-06 16.19.25.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/42429273-735e-ee85-e20a-3e186a6f152d.png)

# Book Repositoryの作成

それでは、機能を実装していきましょう。
まずは本の一覧を検索するページからです。

本のデータは Google Books API を利用して取得します。
通常の利用では API KEY などは必要ありません。
https://developers.google.com/books

Web API を利用するにあたって、本書では RepositoryFactory パターンを採用します。

API との通信を行う Axios のようなライブラリと後述するストアから直接利用すると以下のような問題が生じます。

- 単体テストがやりづらい
- モックに処理を置き換えづらい
- ストアが肥大化する
- 再利用しづらい
- エンドポイントなどが変わったときに変更箇所が多くなる

そこで、API との通信を Repository によって抽象化することでこれらの問題の解決を図ります。
RepositoryFactory パターンについてはこちらの記事が詳しいです。

https://medium.com/backenders-club/consuming-apis-using-the-repository-pattern-in-vue-js-e64671b27b09

## httpClientの作成

まずは Axios をラップする単純なモジュールを作成します。

はじめに Axios をインストールします。

```sh
npm install axios
```

`repositories` フォルダを作成して、その中に `httpClient.ts` ファイルを作成します。
`httpClient.ts` では axios の baseURL や headers などを設定して作成されたインスタンスを返します。

```ts:repositories/httpClient.ts
import axios from 'axios'

const httpClient = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1/volumes'
})

export { httpClient }
```

## Book Repositoryの作成

個別のモデルごとに Repository を作成します。
`repositories/book` ディレクトリを作成して、以下の 3 ファイルを作成します。

- types.ts
- BookRepository.ts
- index.ts

### types.ts

`types.ts` では対応するモデルに関する型定義や Repository のインターフェースを提供します。
Repository 自体のインターフェースを公開することで環境によってモック Repository に置き換える際にも実装の詳細を抽象化できます。

```ts:repositories/book/types.ts
/**
 * Google Books APIのレスポンス
 */
export interface Result {
  items: BookItem[];
  kind: string;
  totalItems: number;
}

/**
 * 本の情報
 */
export interface BookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    publisher?: string;
    imageLinks?: {
      smallThumbnail: string;
      thumbnail: string;
    };
    pageCount: number;
    previewLink?: string;
  };
  saleInfo?: {
    listPrice: {
      amount: number;
    };
  };
}

/**
 * query parameters
 */
export interface Params {
  q: string;
  startIndex?: number;
}

export interface BookRepositoryInterface {
  get(params: Params): Promise<Result>;
  find(id: string): Promise<BookItem>;
}
```

### BookRepository.ts

`BookRepository.ts` に実装の詳細を記述します。
`BookRepositoryInterface` を継承するようにします。

```ts:repositories/book/BookRepository.ts
import type { BookItem, BookRepositoryInterface, Params, Result } from './types'
import { httpClient } from '../httpClient'

export class BookRepository implements BookRepositoryInterface {
  async get(params: Params) {
    const { data } = await httpClient.get<Result>('/', { params })
    return data
  }

  async find(id: string) {
    const { data } = await httpClient.get<BookItem>(`/${id}`)
    return data
  }
}
```

### index.ts

`index.ts` で作成したモジュールを 1 つにまとめてエクポートします。

```ts:repositories/book/index.ts
export * from './types'
export * from './BookRepository'
```

## Repository Factoryの作成

作成した Repository はすべて Repository　Factory からインポートして利用するようにします。
`repositories` フォルダ配下に `RepositoryFactory.ts` を作成します。

```ts:repositories/RepositoryFactory.ts
import { BookRepository, BookRepositoryInterface } from './book'

export const BOOK = Symbol('book')

export interface Repositories {
  [BOOK]: BookRepositoryInterface;
}

export default {
  [BOOK]: new BookRepository()
} as Repositories
```

Book Repository を利用するときには、以下のように使います。

```ts
import RepositoryFactory { BOOK } from '../repositories/RepositoryFactory.ts'

const BookRepository = RepositoryFactory[BOOK]

const book = async BookRespotirosy.get(id)
```

Repository Factory を介して Repository を生成することによって、環境によって実装を取り替えやすくなります。
例えば、test 環境でモックデータを返す Repository を使用する場合には、次のように記述できます。

```ts:repositories/RepositoryFactory.ts
import { BookRepository, BookRepositoryInterface, MockBookRepository } from './book'

export const BOOK = Symbol('book')

export interface Repositories {
  [BOOK]: BookRepositoryInterface;
}

const isMock = process.env.NODE_ENV === 'test'

export default {
  [BOOK]: isMock ? new MockBookRepository() new BookRepository()
} as Repositories
```

本記事では MockRepository は作成しないので、元の状態ままで構いません。

# SearchBar コンポーネント

少々回り道をしましたが、画面の実装を進めていきましょう。

SearchBar コンポーネントを作成します。

```html:components/SearchBar.svelte
<div class="shadow flex">
  <input class="w-full rounded p-2" type="text" placeholder="Search...">
  <button class="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  </button>
</div>
```

```html:pages/SearchBook.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'
</script>

<form>
  <SearchBar />
</from>
```

![スクリーンショット 2021-02-06 18.46.00.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/b205246a-a327-e6e4-3ec8-37e769e19686.png)

## 値のバインディング

見た目はこれでよさそうなので、親子間で値を受け渡しできるようにロジックを実装します。
まずは props として SearchBar コンポーネントが値を受け取れるようにしましょう。

props は export する変数として定義するのでした。

```diff:SearchBar.svelte
<script lang="ts">
+  export let value = '' // propsが渡されなかった時の初期値を定義できます。
</script>

<div class="shadow flex">
-  <input class="w-full rounded p-2" type="text" placeholder="Search...">
+  <input {value} class="w-full rounded p-2" type="text" placeholder="Search...">
  <button class="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  </button>
</div>
```

親コンポーネントから適当な値を渡してみましょう。

```html:SearchBool.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'

  let q = 'JavaScript'
</script>

<form>
  <SearchBar value={q} />
</form>

<div class="text-center mt-4">
  { q }
</div>
```

props として渡した値が初期値として表示されています。

![スクリーンショット 2021-02-06 18.49.35.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/f02204cf-ed04-cc6c-9554-1b421d367ee6.png)

親から子に値を渡すことに成功したので、次は子コンポーネントで入力が行われたときに親に値を渡せるようにしましょう。

`<input>` の入力をバインドさせる - Vue.js における v-model に相当するもの - には `bind:value` ディレクティブを使用します。

```diff:SearchBar.svelte
<script lang="ts">
  export let value = ''
</script>

<div class="shadow flex">
-  <input {value} class="w-full rounded p-2" type="text" placeholder="Search...">
+  <input bind:value class="w-full rounded p-2" type="text" placeholder="Search...">
  <button class="bg-white w-auto flex justify-end items-center text-blue-500 p-2 hover:text-blue-400">
    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6">
      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
    </svg>
  </button>
</div>
```

`bind:value` は `bind:value={value}` のショートハンドです。

子コンポーネントで発生したイベントは親コンポーネントへフォワーディングさせることができます。
親コンポーネントで `bind:value` イベントを受け取ります。

```diff:SearchBook.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'

  let q = 'JavaScript'
</script>

<form>
-  <SearchBar value={q} />
+  <SearchBar bind:value={q} />
</form>

<div class="text-center mt-4">
  { q }
</div>
```

これで、入力した値をバインディングさせることができました。

![svelte-binding.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/f0ed5f29-4565-fa8a-39e8-2af5744bc312.gif)

# 本一覧を取得する

続いて入力した値に応じて Web API から本一覧を取得してみましょう。

まずは submit イベントを購読しましょう。

```diff:SearchBool.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'

  let q = 'JavaScript'

+  const handleSubmit = () => {
+    console.log('handleSubmit')
+    console.log(q)
+  }
</script>

- <form>
+ <form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>

<div class="text-center mt-4">
  { q }
</div>
```

DOM イベントは `on:` ディレクティブで受け取ります。
さらに、`on:` ディレクティブにパイプ `|` でイベント修飾子を付け加えることができます。

今回のように `on:submit|preventDefault` と preventDefault 修飾子を付け加えると `event.preventDefault()` を実行する前に呼び出します。

それでは、BookRepository から本一覧を取得しましょう。
以下のような実装になります。

```html:SearchBook.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'
  import type { BookItem, Result } from '../repositories/book';
  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory'
  const BookRepository = RepositoryFactory[BOOK]

  let q = ''
  let empty = false
  let books: BookItem[] = []
  let promise: Promise<void>

  const handleSubmit = () => {
    if (!q.trim()) return
    promise = getBooks()
  }

  const getBooks = async () => {
    books = []
    empty = false
    const result = await BookRepository.get({ q })
    empty = result.totalItems === 0
    books = result.items
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>

<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
    {#each books as book (book.id)}
      <div>{book.volumeInfo.title}</div>
    {/each}
  {/if}
  {#await promise}
    <div>loading...</div>
    {:catch e}
      <span class="text-red-600 text-sm">
        {e.message}
      </span>
  {/await}
</div>
```

いくつか興味深い構文が出現しています。
1 つづつ確認してみましょう。

## {#if ...}

if ブロックは分岐処理を提供します。
`{#if condition}` で始まり、`{/if}` で終了します。
`condition` の値が `true` を返す場合のみブロックの内容を描画します。

if ブロックの間に {:else} や {:else if} を挿入できます。

## {#each ...}

each ブロックは繰り返し処理を提供します。
一番基本的な文法は以下のとおりです。

`{#each expression as name} {/each}`

expression に渡せるのは array like な変数、つまり `length` プロパティを持つオブジェクトに限られます。

配列のインデックスを取得できます。

`{#each expression as name, index} {/each}`

さらに、ループの中で一意の値となるキーを指定できます。
キーが提供されている場合には配列の要素が変更されたときにそれを最後に追加・削除するのではなく、リストを比較するために使用されます。

`{#each expression as name, index, (key)} {/each}`

さらに、each ブロックは {:else} を挿入できます。
{:else} は渡された配列の要素が空の場合に描画されます。

```html
{#each todos as todo}
<p>{todo.text}</p>
{:else}
<p>No tasks today!</p>
{/each}
```

## {#await ...}

await ブロックは、Promise の 3 つの状態（pending・fulfilled・rejected）によって分岐されます。

`{#await expression} {:then name} {:catch error}`

expression には Promise 要素を渡す必要があります。

await ブロックを利用すると、loading・error のような状態変数を持つ必要がなくなるので便利です。

実際に検索結果を取得できるかどうか試してみてください。

![search-book.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/bdb0edf2-dc88-666d-33ce-7acd71dddc51.gif)

# コンポーネントに切り出す

## Spinner.svelte

ローディングアニメーションを Spinner コンポーネントとして作成します。

```html:components/Spinner.svelte
<svg class="animate-spin h-20 w-20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
</svg>
```

いい感じに中央寄せしておきましょう。

```html:pages/SearchBooks.svelte
<script lang="ts">
  // 省略
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>

<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
    {#each books as book (book.id)}
      <div>{book.volumeInfo.title}</div>
    {/each}
  {/if}
  {#await promise}
    <div class="flex justify-center">
      <Spinner />
    </div>
    {:catch e}
      <span class="text-red-600 text-sm">
        {e.message}
      </span>
  {/await}
</div>
```

## BookCardコンポーネント

次に BookCard コンポーネントを作成します。
`components` フォルダに `BookCard.svelte` ファイルを作成します。

```html:components/BookCard.svelte
<script lang="ts">
  import type { BookItem } from '../repositories/book'
  export let book: BookItem

  $: src = book.volumeInfo.imageLinks
    ? book.volumeInfo.imageLinks.smallThumbnail
    : 'http://placehold.jp/eeeeee/cccccc/160x120.png?text=No%20Image'

  $: description = book.volumeInfo.description
    ? `${book.volumeInfo.description.slice(0, 100)}...`
    : ''

</script>

<div class="w-full sm:flex">
  <div class="h-96 sm:h-auto sm:w-48 flex-none bg-cover rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden" style={`background-image: url('${src}')`}>
  </div>
  <div class="border-r border-b border-l border-grey-light sm:border-l-0 sm:border-t sm:border-grey-light bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal w-100 sm:w-9/12 lg:w-7/12">
    <div class="my-4">
      <div class="text-black font-bold text-xl mb-2">{book.volumeInfo.title}</div>
      <p class="text-grey-darker text-sm break-words w-9/12 m-auto">
        {description}
      </p>
    </div>
  </div>
</div>
```

本の情報を表示するので `book` という変数で props を親から受け取ります。

さて、`$:` という見慣れない構文が出現しました。
これはラベルと呼ばれる構文で `$:` ラベルが付与された式や文は、変数の更新のたびに再計算されるようになります。

Vue.js における `comupted` や `watch` などの役割に近い処理をはたしてくれます。

このコンポーネントをループでしようするように修正しましょう。

```html:pages/SearchBook.svelte
<script lang="ts">
  // 省略
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>

<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
    {#each books as book (book.id)}
      <BookCard {book} />
      {/each}
  </div>
  {/if}
  {#await promise}
-    <div>{book.volumeInfo.title}</div>
+    <div class="flex justify-center">
+      <Spinner />
*    </div>
    {:catch e}
      <span class="text-red-600 text-sm">
        {e.message}
      </span>
  {/await}
</div>
```

ここまでの変更で次のような画面になりました！

![スクリーンショット 2021-02-07 13.58.36.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/45959b3d-bccf-95b8-4dc3-f8a2f1325dda.png)

ここまでに実装でどうやら正しく検索処理が働き描画できているようです！

しかしながらすでにお気づきかもしれないですが、取得結果がいくつであろうと得られるのは最初の 10 件だけです。
追加のデータをさらに取得できるようにページネーション処理を実装しましょう。

# ライブラリのインストール

無限スクロールによるページネーションを実装するために、こちらのライブラリをインストールします。

https://github.com/andrelmlins/svelte-infinite-scroll

```sh
npm i svelte-infinite-scroll
```

次のように使います。
`<InfinteScroll>` 要素が検出された際に `loadMore` イベントが発火します。

```diff:pages/SearchBook.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'
  import Spinner from '../components/Spinner.svelte'
  import BookCard from '../components/BookCard.svelte'
  import type { BookItem } from '../repositories/book';
  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory'
+  import InfiniteScroll from "svelte-infinite-scroll"
  const BookRepository = RepositoryFactory[BOOK]

  let q = ''
  let empty = false
  let books: BookItem[] = []
  let promise: Promise<void>

  const handleSubmit = () => {
    if (!q.trim()) return
    promise = getBooks()
  }

  const getBooks = async () => {
    books = []
    empty = false
    const result = await BookRepository.get({ q })
    empty = result.totalItems === 0
    books = result.items
  }

+  const handleLoadMore = () => {
+    console.log('handleLoadMore')
+  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>
<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
    {#each books as book (book.id)}
      <BookCard {book} />
    {/each}
  </div>
+  <InfiniteScroll window on:loadMore={handleLoadMore} />
  {/if}
  {#await promise}
    <div class="flex justify-center">
      <Spinner />
    </div>
    {:catch e}
      <span class="text-red-600 text-sm">
        {e.message}
      </span>
  {/await}
</div>
```

# 次の要素を取得して配列に追加する

`handleLoadMore` 関数が呼び出されることが確認できたら、処理を実装していきましょう。

Google Books API のドキュメントを見ると、ページネーションをするには `startIndex` をパラメータに渡せば良さそうです。

> Pagination
> You can paginate the volumes list by specifying two values in the parameters for the request:

> startIndex - The position in the collection at which to start. The index of the first item is 0.
> maxResults - The maximum number of results to return. The default is 10, and the maximum allowable value is 40.

https://developers.google.com/books/docs/v1/using#pagination_1

`startIndex` は 0 から開始するようです。
`startIndex` 変数を定義して初期値には 0 を設定しておきましょう。

```ts
let startIndex = 0;
```

`handleLoadMore` 関数が呼ばれる度に、`startIndex` の値を `maxResults`（ここでは 10 固定）を加算していけば良さそうですね。

また `getNextPage` 関数を作成してそこで API から取得する処理を実装し、初回取得時と同じように返り値を `promise` 変数に代入してます。

Svelte では配列の値をリアクティブにするには必ず変数を直接置き換えなければならないことに注意してください。
つまり、リアクティブな配列に対して `push()・`splice()`などで操作しても自動更新されません。

```ts
const handleLoadMore = () => {
  startIndex += 10;
  promise = getNextPage();
};

const getNextPage = async () => {
  const result = await BookRepository.get({ q, startIndex });

  // 取得データが既に存在するものを含む可能性があるので、idでフィルタリングしてます。
  const bookIds = books.map((book) => book.id);
  const filteredItems = result.items.filter((item) => {
    return !bookIds.includes(item.id);
  });
  books = [...books, ...filteredItems];
};
```

フォームの submit による初回取得時には `startIndex` の値を 0 に戻さなければいけないことを忘れないようにしてください。

```diff
  const getBooks = async () => {
    books = []
    empty = false
+    startIndex = 0
    const result = await BookRepository.get({ q })
    empty = result.totalItems === 0
    books = result.items
  }
```

これ以上データが存在するかどうか `hasMore` 変数を `$:` ラベルで定義します。
`totalItems` 変数を定義しておき、現在の取得数が `totalItems` 以上なら、これ以上はデータが存在しないということにします。

```diff
+  let totalItems = 0

+  $: hasMore = totalItems > books.length

 const getBooks = async () => {
   books = []
   empty = false
   startIndex = 0
   const result = await BookRepository.get({ q, startIndex })
   empty = result.totalItems === 0
+    totalItems = result.totalItems
   books = result.items
 }

 // 省略

 // <InfiniteScroll>にhasMoreをpropsとして渡す
 <InfiniteScroll window threshold={100} on:loadMore={handleLoadMore} {hasMore} />
```

それでは確認してみましょう！

![infinte-scroll.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/0fb0bcb3-76c1-1665-7091-8ddf8955d1bf.gif)

いったん本を探す画面はこれでよさそうです。

今度はコンポーネント内で扱っていた状態管理をストアで行うように修正しましょう。

Svelte のストアはすべて本体に取り込まれているので、追加のライブラリのインストールは不要です。

# ストアの作成

まずはストアを作成します。

`src` フォルダに `store/book/index.ts` ファイルを作成します。

```ts:store/book/index.ts
import { writable } from 'svelte/store'
import type { BookItem } from '../../repositories/book'

const dummyBooks = [
  {
    id: '1',
    volumeInfo: {
      title: 'title1',
      description: 'lorem ipsm'
    }
  },
  {
    id: '2',
    volumeInfo: {
      title: 'title2',
      description: 'lorem ipsm'
    }
  },
  {
    id: '3',
    volumeInfo: {
      title: 'title3',
      description: 'lorem ipsm'
    }
  },
] as BookItem[]

export const books = writable<BookItem[]>(dummyBooks)
```

`writable` によってストアのオブジェクトを作成します。
ひとまず `writable` で作成したオブジェクトを表示できるかどうか確認するためにダミーデータを渡しています。

# ストアをコンポーネントから使用する

これを次のように使用します。

```html:pages/SearchBooks.svelte
<script lang="ts">
  import BookCard from '../components/BookCard.svelte'
  import { books } from '../store/book'
  import { onDestroy } from 'svelte'
  import type { BookItem } from '../repositories/book'

  let _books: BookItem[]

  const unsubscribe = books.subscribe(value => _books = value)

  onDestroy(unsubscribe)
</script>

<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
  {#each _books as book (book.id)}
    <BookCard {book} />
  {/each}
</div>
```

ストアから `writable` で作成したオブジェクトを、`svelte` から `onDestroy` 関数をインポートします。

`onDestroy` はコンポーネントが破棄されたときに呼ばれるライフサイクルフックです。

さらに、コンポーネント内で使用する変数として `_books` を定義しました。

`writable` オブジェクトに対して `subscribe` メソッドを呼び事でストアのオブジェクトを監視します。ストアのオブジェクトに変更があるたびにコールバックが呼ばれるので、その値をコンポーネント内で定義した `_books` 変数に代入することによってストアのオブジェクトの値を利用します。

`subscribe` メソッドは返り値としてストアのオブジェクトの監視を破棄するメソッドを返します。`onDestory` 関数でコンポーネントが破棄された際に呼び出すことで確実に監視を取りやめるようにします。

# ストアの糖衣構文

ストアを利用するたびに毎回同じような処理を記述するのは退屈です。
喜ばしいことに、Svelte はストアの糖衣構文を用意しています。

以下の構文はさきほどのものと同じ処理を行います。

```html:pages/SearchBook.svelte
<script lang="ts">
  import BookCard from '../components/BookCard.svelte'
  import { books } from '../store/book'

</script>

<div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
  {#each $books as book (book.id)}
    <BookCard {book} />
  {/each}
</div>
```

ストアのオブジェクトにプレフィックスとして `$` を付与することで、同様にリアクティブな値を手に入れることができます！

以下のように、ダミーで用意したデータが表示されています。

![スクリーンショット 2021-02-07 16.14.30.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/f7041842-49f4-be25-c083-27e6697580da.png)

# ストアに値をセットする

ストアの糖衣構文を覚えたならこの後の処理は本当に簡単です！

ひとまずストアのダミーデータは不要なので削除しておきましょう。

```ts:store/book/index.ts
import { writable } from 'svelte/store'
import type { BookItem } from '../../repositories/book'

export const books = writable<BookItem[]>([])
```

`$` プレフィックスをつけたストアの変数は、コンポーネントの変数を扱うのとほとんど同じように使用できます。
つまりは、`books` 変数を `$books` に一括置換するだけでこの章の作業はほどんど終わりです！

```diff:pages/SearchBook.svelte
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'
  import Spinner from '../components/Spinner.svelte'
  import BookCard from '../components/BookCard.svelte'
-  import type { BookItem } from '../repositories/book';
  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory'
  import InfiniteScroll from "svelte-infinite-scroll"
+ import { books } from '../store/book'
  const BookRepository = RepositoryFactory[BOOK]

  let q = ''
  let empty = false
-  let books: BookItem[] = []
  let promise: Promise<void>
  let totalItems = 0
  let startIndex = 0

  $: hasMore = totalItems > $books.length

  const handleSubmit = () => {
    if (!q.trim()) return
    promise = getbooks()
  }

  const getBooks = async () => {
-    books = []
+    $books = []
    empty = false
    startIndex = 0
    const result = await BookRepository.get({ q, startIndex })
    empty = result.totalItems === 0
    totalItems = result.totalItems
-    books = result.itmem
+    $books = result.items
  }

  const handleLoadMore = () => {
    startIndex += 10
    promise = getNextPage()
  }

  const getNextPage = async () => {
    const result = await BookRepository.get({ q, startIndex })

    // 取得データが既に存在するものを含む可能性があるので、フィルタリングしてます。
-    const bookIds = books.map(book => book.id)
+    const bookIds = $books.map(book => book.id)
    const filteredItems = result.items.filter(item => {
      return !bookIds.includes(item.id)
    })
-    $books = [...$books, ...filteredItems]
+    $books = [...$books, ...filteredItems]
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>
<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
-    {#each books as book (book.id}
+    {#each $books as book (book.id)}
      <BookCard {book} />
    {/each}
  </div>
  <InfiniteScroll window threshold={100} on:loadMore={handleLoadMore} {hasMore} />
  {/if}
  {#await promise}
    <div class="flex justify-center">
      <Spinner />
    </div>
    {:catch e}
      <span class="text-red-600 text-sm">
        {e.message}
      </span>
  {/await}
</div>
```

`$` プレフィックスの変数に値を代入している場合には、それへ `writable` オブジェクトに対して `set()` メソッドを呼び出しているのと同じことになります。

前回までの実装を見て、きっと他の JavaScript フレームワークのストアを実装したことがある人ならコンポーネントから直接状態を更新しているを見て不安で仕方がないことでしょう。

この章ではストアを外部から直接更新できなくするようにリファクタリングします。

# ストアを更新不可能にする

ストアを更新できなくする方法は簡単です。`set()`・`update()` のように値を状態を更新するメソッドを外部へ公開しなければよいのです。

ストアを作成する処理を修正します。

```ts:store/books/index.ts
import { writable } from 'svelte/store'
import type { BookItem } from '../../repositories/book'

const useBookStore = () => {
  const { subscribe } = writable<BookItem[]>([])
  return { subscribe }
}

export const books = useBookStore()
```

このように、ストアを作成する際に関数でラップしてラップした関数からは `subscribe` メソッドのみを返すようにしています。

ご覧のように、`set()` メソッドが存在しないためコンポーネントから値を更新できなくなりました。

![スクリーンショット 2021-02-07 16.54.02.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/83861183-eff1-ab02-fbfa-47f8ff23c071.png)

# 更新メソッドを公開する

ストアを更新するメソッドを `useBookStore` 内に定義します。
`useBookStore` 関数内では `set()`・`update` 関数を使うことができます。

更新メソッドのみを return するようにしましょう。

```ts:store/book/index.ts
import { writable } from 'svelte/store'
import type { BookItem } from '../../repositories/book'

const useBookStore = () => {
  const { subscribe, set, update } = writable<BookItem[]>([])
  const reset = () => set([])
  const add = (newBooks: BookItem[]) => update((books: BookItem[]) => {
    return [...books, ...newBooks]
  })
  return {
    subscribe,
    reset,
    add
  }
}

export const books = useBookStore()
```

更新メソッドを利用するように変更しましょう。

```diff:pages/SearchBooks
<script lang="ts">
  import SearchBar from '../components/SearchBar.svelte'
  import Spinner from '../components/Spinner.svelte'
  import BookCard from '../components/BookCard.svelte'
  import RepositoryFactory, { BOOK } from '../repositories/RepositoryFactory'
  import InfiniteScroll from "svelte-infinite-scroll"
  import { books } from '../store/book'
  const BookRepository = RepositoryFactory[BOOK]

  let q = ''
  let empty = false
  let promise: Promise<void>
  let totalItems = 0
  let startIndex = 0

  $: hasMore = totalItems > $books.length

  const handleSubmit = () => {
    if (!q.trim()) return
    promise = getbooks()
  }

  const getbooks = async () => {
-    $books = []
+    books.reset()
    empty = false
    startIndex = 0
    const result = await BookRepository.get({ q, startIndex })
    empty = result.totalItems === 0
    totalItems = result.totalItems
-    $books = retuls.items
+    books.add(result.items)
  }

  const handleLoadMore = () => {
    startIndex += 10
    promise = getNextPage()
  }

  const getNextPage = async () => {
    const result = await BookRepository.get({ q, startIndex })

    // 取得データが既に存在するものを含む可能性があるので、フィルタリングしてます。
    const bookIds = $books.map(book => book.id)
    const filteredItems = result.items.filter(item => {
      return !bookIds.includes(item.id)
    })
-    $books = [...$books, ...filterdItems]
+    books.add(filteredItems)
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchBar bind:value={q} />
</form>
<div class="text-center mt-4">
  {#if empty}
    <div>検索結果が見つかりませんでした。</div>
  {:else}
  <div class="grid grid-cols-1 gap-2 lg:grid-cols-2">
    {#each $books as book (book.id)}
      <BookCard {book} />
    {/each}
  </div>
  <InfiniteScroll window threshold={100} on:loadMore={handleLoadMore} {hasMore} />
  {/if}
  {#await promise}
    <div class="flex justify-center">
      <Spinner />
    </div>
    {:catch e}
      <span class="text-red-600 text-sm">
        {e.message}
      </span>
  {/await}
</div>
```

# ルーティングの追加

最後に、本の詳細ページを実装しましょう。
まずは、詳細ページへのルーティングを追加します。

```diff:routing/index.ts
import SearchBook from '../pages/SearchBook.svelte'
+ import DetailsBook from '../pages/DetailsBook.svelte'

export const routes = {
  '/': SearchBook,
+  '/books/:id': DetailsBook,
}
```

`/books/:id` というパスを追加します。
動的なセグメントは `:` コロンを使って使って表します。この値はコンポーネントから取得できます。

`pages/DetailsBook.svelte` を作成しましょう。

```html:pages/DetailsBook.svelte
<script lang="ts">
  type Params = { id: string }
  export let params: Params
</script>

<div>
  { params.id }
</div>
```

`params` という名前の props を公開することで URL パラメータを受け取ることができます。

http://localhost:5000/#/books/123 にアクセスしてみてください。

![スクリーンショット 2021-02-07 17.29.26.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/4d997392-a774-5f20-6ec0-7a80c7e839aa.png)

# リンクを追加する

本一覧ページから詳細ページへ遷移できるようにリンクを追加しましょう。
`components/BookCard.svelte` を修正します。

```diff:components/BookCard.svelte
<script lang="ts">
  import type { BookItem } from '../repositories/book'
+  import { link } from 'svelte-spa-router'
  export let book: BookItem

  $: src = book.volumeInfo.imageLinks
    ? book.volumeInfo.imageLinks.smallThumbnail
    : 'http://placehold.jp/eeeeee/cccccc/160x120.png?text=No%20Image'

  $: description = book.volumeInfo.description
    ? `${book.volumeInfo.description.slice(0, 100)}...`
    : ''

</script>

<div class="w-full sm:flex">
  <div class="h-96 sm:h-auto sm:w-48 flex-none bg-cover rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden" style={`background-image: url('${src}')`}>
  </div>
  <div class="border-r border-b border-l border-grey-light sm:border-l-0 sm:border-t sm:border-grey-light bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal w-100 sm:w-9/12 lg:w-7/12">
    <div class="my-4">
+      <a href={`/books/${book.id}`} use:link>
+        <div class="text-black font-bold text-xl mb-2">{book.volumeInfo.title}</div>
+      </a>
      <p class="text-grey-darker text-sm break-words w-9/12 m-auto">
        {description}
      </p>
    </div>
  </div>
</div>
```

リンクは `<a>` タグを使用します。`link` を `svelte-spa-router` からインポートして `use:link` 属性を与えることによってハッシュ付きのルートにマッチさせることができます。

例 `/books/${book.id}` => `/#/books/${book.id}`

# IDから本を取得

ルーティングパラメータによって取得した ID を使ってストアから本を取得しましょう。

`derived` というメソッドを使用して、ストアに ID によって本を取得する処理を追加します。
`derived` は `writable` の値から他の値を取得する関数で、Vue.js における `getters` に相当します。

```diff:store/book/index.ts
- import { writable } from 'svelte/store'
+ import { writable, derived } from 'svelte/store'
import type { BookItem } from '../../repositories/book'

const useBookStore = () => {
  const { subscribe, set, update } = writable<BookItem[]>([])
  const reset = () => set([])
  const add = (newBooks: BookItem[]) => update((books: BookItem[]) => {
    return [...books, ...newBooks]
  })

  return {
    subscribe,
    reset,
    add
  }
}

export const books = useBookStore()

+ export const find = (id: string) => {
+  return derived(books, $books => $books.find(book => book.id === id))
+ }
```

`pages/DetailsBook.svelte` を修正しましょう。
ストアに存在しなかった場合には、API から取得してストアに追加するのを待つ必要があります。

そのため、`{#await}` ブロックの `{/then}` の中に `$book` を配置しています。

```html:pages/DetailsBook.svelte
<script lang="ts">
  import Spinner from "../components/Spinner.svelte";
  import type { Readable } from "svelte/store";
  import type { BookItem } from "../repositories/book";
  import RepositoryFactory, { BOOK } from "../repositories/RepositoryFactory";
  import { find, books } from "../store/book";
  const BookRepository = RepositoryFactory[BOOK];

  type Params = { id: string };
  export let params: Params;
  let book: Readable<BookItem>;
  let promise: Promise<void>;

  const findById = async (id: string) => {
    const book = await BookRepository.find(id);
    books.add([book]);
  };

  book = find(params.id);
  if (!$book) {
    promise = findById(params.id);
  }
</script>

<div>
  {#await promise}
    <div class="flex justify-center">
      <Spinner />
    </div>
  {:then}
    {$book.volumeInfo.title}
  {:catch e}
    <span class="text-red-600 text-sm">
      {e.message}
    </span>
  {/await}
</div>
```

# BookInfo コンポーネント

詳細情報を表示する BookInfo コンポーネントを作成しましょう。
ここでは特に新しい要素は出現しません。

```html:components/BookInfo.svelte
<script lang="ts">
  import Row from './Row.svelte'
  import type { BookItem } from "../repositories/book";
  export let book: BookItem

  const formatter = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY'
  })
  $: price = book.saleInfo?.listPrice?.amount
    ? formatter.format(book.saleInfo.listPrice.amount)
    : ''

  $: src = book.volumeInfo.imageLinks
    ? book.volumeInfo.imageLinks.thumbnail
    : 'http://placehold.jp/eeeeee/cccccc/160x120.png?text=No%20Image'

</script>

<div class="grid grid-cols-1 gap-2 md:grid-cols-3">

  <div class="cente">
    <img class="h-72 w-auto mx-auto" {src} alt="thumnail">
  </div>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg col-span-2">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-black font-bold text-xl mb-2">
        {book.volumeInfo.title}
      </h3>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <Row dt="著者">
          {book.volumeInfo.authors?.join(',')}
        </Row>
        <Row dt="概要">
          {book.volumeInfo.description}
        </Row>
        <Row dt="価格">
          {price}
        </Row>
        <Row dt="ページ数">
          {book.volumeInfo.pageCount}
        </Row>
        <Row dt="出版日">
          {book.volumeInfo.publishedDate}
        </Row>
        <Row dt="出版社">
          {book.volumeInfo.publisher}
        </Row>
        <Row dt="プレビュー">
          {#if book.volumeInfo.previewLink}
            <a href={book.volumeInfo.previewLink} class="text-blue-400">
              {book.volumeInfo.previewLink}
            </a>
          {/if}
        </Row>
      </dl>
    </div>
  </div>
</div>
```

さらに、`Row` コンポーネントは次のようになります。

```html:components/Row.svelte
<script lang="ts">
  export let dt: string
</script>

<div class="bg-gray-50 border-b border-gray-200 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
  <dt class="text-sm font-medium text-gray-500">
    {dt}
  </dt>
  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
    <slot />
  </dd>
</div>
```

ここでは、`<slot />` という要素が出てきました。
スロットは、HTML タグの中に子要素を入れるように、コンポーネント中に子要素を入れることができる仕組みです。

`<Row>{book.volumeInfo.description}</Row>` のようにタグの中にある要素が、`<Row>` コンポーネント内の `<slot />` に置換されて描画されます。

これで詳細ページも完成です！
お疲れさまでした！

![スクリーンショット 2021-02-07 19.11.10.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/496565/d39db159-2a24-565d-6278-d73a831bee03.png)
