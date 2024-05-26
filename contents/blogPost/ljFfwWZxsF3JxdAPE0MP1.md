---
id: ljFfwWZxsF3JxdAPE0MP1
title: "SvelteKit チュートリアル - 記事投稿サイトを作ってみよう"
slug: "sveltekit-tutorial-create-a-blog-site"
about: "SvelteKit は Svelte と Vite で構築たフレームワークです。SvelteKit は Web アプリケーションを開発するために必要な機能を提供します。この記事では、SvelteKit を使用して記事投稿サイトを作成するチュートリアルを紹介します。記事投稿サイトは、記事の一覧表示、記事の詳細表示、記事の投稿、記事の削除の機能を持つシンプルな Web アプリケーションです。"
createdAt: "2024-05-26T14:28+09:00"
updatedAt: "2024-05-26T14:28+09:00"
tags: ["Svelte", "SvelteKit"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7mdm4EnhrzOR58aNNAkpJd/d0e06570e684bf7f3337fd8fb323ad1b/fuusha_6155-768x748.png"
  title: "青空と風車のイラスト"
selfAssessment:
  quizzes:
    - question: "SvelteKit のルーティングにおいて、ページを定義するファイル名はどれか？"
      answers:
        - text: "index.svelte"
          correct: false
          explanation: ""
        - text: "+page.svelte"
          correct: true
          explanation: ""
        - text: "+layout.svelte"
          correct: false
          explanation: ""
        - text: "page.ts"
          correct: false
          explanation: ""
    - question: "+layout.svelte ファイルで子要素を表す children を受け取る方法はどれか？"
      answers:
        - text: "const { children } = $props();"
          correct: true
          explanation: ""
        - text: "const { children } = $slots();"
          correct: false
          explanation: ""
        - text: "import { children } from '$app/layout';"
          correct: false
          explanation: ""
        - text: "const { children } = $layout();"
          correct: false
          explanation: ""

published: true
---

[SvelteKit](https://kit.svelte.jp/) は、Svelte と Vite で構築されたフレームワークです。SvelteKit と Svelte の関係は、Next.js と React、Nuxt.js と Vue.js の関係に似ています。SvelteKit は Web アプリケーションを開発するために必要な以下の機能を提供します。

- ルーティング
- 柔軟なレンダリング方式（SSR, prerendering, ISR...）
- ビルド最適化
- 様々なプラットフォームへのデプロイをサポートするアダプター
- プリフェッチ
- 画像最適化

この記事では、SvelteKit を使用して記事投稿サイト「SvelteDiary」を作成するチュートリアルを紹介します。記事投稿サイトは、記事の一覧表示、記事の詳細表示、記事の投稿、記事の編集、記事の削除の機能を持つシンプルな Web アプリケーションです。

最終的なコードは以下のリポジトリで確認できます。

https://github.com/azukiazusa1/sveltekit-tutorial

## プロジェクトを作成する

まずは SvelteKit のプロジェクトを作成します。以下のコマンドを実行しましょう。

```bash
npm create svelte@latest
```

対話形式でプロジェクトの設定を行います。ここでは以下の設定を選択します。

```bash
  Welcome to SvelteKit!
│
◇  Where should we create your project?
│  sveltekit-tutorial
│
◇  Which Svelte app template?
│  Skeleton project
│
◇  Add type checking with TypeScript?
│  Yes, using TypeScript syntax
│
◆  Select additional options (use arrow keys/space bar)
│  ◼ Add ESLint for code linting
│  ◼ Add Prettier for code formatting
│  ◻ Add Playwright for browser testing
│  ◻ Add Vitest for unit testing
│  ◼ Try the Svelte 5 preview (unstable!)
└
```

?> この記事では 2024 年 5 月時点では不安定バージョンである Svelte 5 を使用しています。Svelte 5 を使用した場合の API はまだドキュメントには記載されておらず、変更される可能性があります。

プロジェクトが作成されたら、作成したプロジェクトに移動して以下のコマンドを実行し開発サーバーを起動します。

```bash
cd sveltekit-tutorial
npm install
npm run dev
```

http://localhost:5173 にアクセスすると、SvelteKit のデフォルトのページが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6TwXdYnwGmN3gUqG9MHtpM/d4f3606fc982405c687c6c49023ad963/__________2024-05-25_14.52.54.png)

SvelteKit はファイベースのルーティングを採用しています。ルーティングのパスと `src/routes` ディレクトリ内のファイルが対応しており、`+page.svelte` ファイルがアプリケーションのページとて表示されます。つまり、`src/routes/+page.svelte` が `/` に対応し、`src/routes/+about.svelte` が `/about` に対応します。

http://localhost:5173 で表示されている画面に対応するファイルは `src/routes/+page.svelte` です。試しにこのファイルを編集して、表示される内容を変更してみましょう。

```svelte:src/routes/+page.svelte
<h1>Svelte Diary</h1>
```

HMR（Hot Module Replacement）により、ファイルを保存すると自動的にブラウザがリロードされ、変更が反映されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1RmrO1g7fcjTpP8ACFdRcK/d48a149e720d68e8a89bb42063a19a77/__________2024-05-25_15.03.08.png)

## Tailwind CSS を導入する

今回はスタイリングのために [Tailwind CSS](https://tailwindcss.com/) を使用します。Tailwind CSS は、Utility-first CSS フレームワークであり、`mr-2` や `bg-blue-500` などのユーティリティクラスを組み合わせてスタイリングを行います。

次のコマンドを実行して、Tailwind CSS をインストールします。

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

`tailwind.cofing.js` ファイルが作成されるので、以下のように設定します。

```js:tailwind.config.js {3}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {}
  },
  plugins: []
};
```

`src/app.css` ファイルを作成し、Tailwind CSS を読み込みます。

```css:src/app.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`src/app.css` はすべてのページで読み込まれる CSS ファイルです。SvelteKit ではすべてのページで表示されるべき要素を描画するために、特別なファイル `+layout.svelte` を使用します。`+layout.svelte` は `src/routes` ディレクトリ内に作成します。

```svelte:src/routes/+layout.svelte
<script lang="ts">
  const { children } = $props();
  import "../app.css";
</script>

{@render children()}
```

`$props()` はコンポーネントの Props を取得する関数です。`children` は予約された Props で、子コンポーネントを描画するために使用します。この `children` Props には各ページのコンポーネントが渡されます。`children` は `Snippet` という型であり、これは `{@render}` を使って描画できます。

ともあれ `app.css` を読み込んだことで、すべてのページで Tailwind CSS が適用されるようになりました。試しに `src/routes/+page.svelte` を以下のように編集してみましょう。

```svelte:src/routes/+page.svelte
<h1 class="text-red-500 text-4xl font-bold text-center mt-10">Svelte Diary</h1>
```

再度 `npm run dev` を実行して、ブラウザで表示を確認してみましょう。文字が赤色になっていることが確認できるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/C3Jd0E4wDFur42J0Xaw6b/925c3b29582f7a5892ce0a9ec42f91e4/__________2024-05-25_15.24.40.png)

## トップページを作成する

はじめにアプリケーションのトップページを作成していきましょう。まずはすべてのページで共通して表示されるナビゲーションバーとフッターを作成します。`src/routes/+layout.svelte` を以下のように編集します。

```svelte:src/routes/+layout.svelte
<script lang="ts">
	const { children } = $props();
	import '../app.css';
</script>

<div class="bg-gray-200 min-h-screen flex flex-col">
	<header class="sticky top-0 z-50 bg-white shadow-md h-16">
		<nav class="container mx-auto flex justify-between items-center py-4">
			<a href="/" class="text-xl font-bold">Svelte Diary</a>
			<ul class="flex gap-4">
				<li>
					<a href="/articles" class="text-gray-800">記事の一覧</a>
				</li>
				<li>
					<a href="/articles/new" class="text-gray-800">記事の投稿</a>
				</li>
			</ul>
		</nav>
	</header>
	<main class="container mx-auto mt-4 flex-grow">
		{@render children()}
	</main>
	<footer class="bg-gray-800 text-white text-center py-4 h-16">
		<p>&copy; 2024 Svelte Diary</p>
	</footer>
</div>
```

ナビゲーションバーでは記事の一覧画面と記事の投稿画面へのリンクを表示しています。なお SvelteKit では SPA 遷移を行うために特別なコンポーネントは使用せずに、単に `a` タグを使用できます。

続いてトップページを作成しましょう。`src/routes/+page.svelte` を編集します。

```svelte:src/routes/+page.svelte
<script lang="ts">
	// ページのレンダリング方式を指定
	// prerender: true は、事前レンダリングを有効にする
	export const prerender = true;
</script>

<!-- メタタグを設定 -->
<svelte:head>
	<title>Svelte Diary</title>
	<meta
		name="description"
		content="Svelte Diary は、ユーザーが日々の思いや出来事をシンプルで使いやすいインターフェースで記録し、共有するための記事投稿サービスです。"
	/>
</svelte:head>

<div class="py-12 px-12 mt-8 text-center bg-white max-w-screen-xl mx-auto">
	<h1 class="mb-4 text-6xl font-extrabold tracking-tight leading-none text-gray-90">
		Svelte Diary
	</h1>
	<p class="mb-8 text-lg font-normal text-gray-500 px-48">
		Svelte Diary
		は、ユーザーが日々の思いや出来事をシンプルで使いやすいインターフェースで記録し、共有するための記事投稿サービスです。直感的なデザインとスムーズな操作性により、ユーザーは簡単に自分の日常を記録し、思い出を保存することができます。
	</p>
	<div class="flex flex-row justify-center sm:space-y-0 sm:space-x-4">
		<a
			href="/articles"
			class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100"
		>
			記事を読む
		</a>
		<a
			href="/articles/new"
			class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300"
		>
			記事を投稿
		</a>
	</div>
</div>
```

SvelteKit はデフォルトではサーバーサイドレンダリングを行い、クライアントに HTML を返します。その後クライアント側で再レンダリングを行いハイドレーションを実行することで、インタラクティブを有効にしています。ですが、一般的なアプリケーションではすべてのページでサーバーサイドレンダリングを行うことが望ましいとは限りません。

例えば、記事の一覧画面では毎回データベースから記事を取得して表示する必要があるため、サーバーサイドでレンダリングを行う必要があるでしょう。一方で、トップページのような静的なコンテンツは事前レンダリングを行い、静的な HTML ファイルとして配信することで
パフォーマンスを向上させることができます。

SvelteKit ではページごとにレンダリング方式を指定できます。ここでは `export const prerender = true;` とすることで、トップページの事前レンダリングを有効にしています。

このアプリケーションではトップページのみを事前レンダリングとして指定していますが、大半のページで事前レンダリングを行う場合には、`+layout.svelte` に `export const prerender = true;` を指定することで、すべてのページで事前レンダリングを有効にできます。その場合、サーバーサイドレンダリングを行いたいページでは `export const prerender = false;` で事前レンダリングを無効にすることになります。

ページのメタタグは `<svelte:head>` タグ内に記述します。`<svelte:head>` 要素を使うと `document.head` 内に要素を挿入できます。

```svelte:src/routes/+page.svelte
<svelte:head>
  <title>Svelte Diary</title>
  <meta
    name="description"
    content="Svelte Diary は、ユーザーが日々の思いや出来事をシンプルで使いやすいインターフェースで記録し、共有するための記事投稿サービスです。"
  />
</svelte:head>
```

ここまでの実装で、トップページが完成しました。ブラウザで表示を確認してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/4OFbg0YASjMO4Ndg0xlrd4/17845b5492c5c7497618b7018917a0ff/__________2024-05-25_16.44.22.png)

## データベースのセットアップ

次の画面を作成する前に、ユーザーが投稿した記事を保存できるようにするためにデータベースをセットアップします。ここでは PostgreSQL を使用します。Docker を使用して PostgreSQL を起動するので、Docker がインストールされていることを確認してください。

```bash
docker --version
Docker version 24.0.5
```

### PostgreSQL の起動

`docker-compose.yml` ファイルを作成し、以下の内容を記述します。

```yml:docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:14
    container_name: postgres
    ports:
      - 5432:5432
    volumes:
      - db-store:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_DB=${POSTGRES_DB}
volumes:
  db-store:
```

`POSTGRES_PASSWORD`、`POSTGRES_USER`、`POSTGRES_DB` は環境変数として設定します。`.env` ファイルを作成し、以下の内容を記述します。

```bash:.env
POSTGRES_PASSWORD=password
POSTGRES_USER=postgres
POSTGRES_DB=svelte_diary
```

以下のコマンドで PostgreSQL を起動します。

```bash
docker compose up -d
```

### Prisma のセットアップ

続いてアプリケーションから PostgreSQL に接続するためのライブラリである [Prisma](https://www.prisma.io/) をインストールします。Prisma は TypeScript で型安全なクエリを記述できる ORM ライブラリです。以下のコマンドで Prisma をインストールします。

```bash
npm install @prisma/client
npm install prisma tsx --save-dev
npx prisma init
```

`npx prisma init` コマンドを実行すると、`prisma` ディレクトリが作成され、`schema.prisma` ファイルが作成されます。また `.env` ファイルに `DATABASE_URL` が追加されているので、以下のように書き換えます。

```bash:.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/svelte_diary?schema=public"
```

続いてテーブルを作成するためのスキーマを `schema.prisma` ファイルに記述します。

```prisma:prisma/schema.prisma
model Article {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  createdAt DateTime @default(now())
}
```

`Article` モデルは記事を表すモデルで、`id`、`title`、`content`、`createdAt` のフィールドを持ちます。`id` は記事の一意な ID で、`title` は記事のタイトル、`content` は記事の本文、`createdAt` は記事の作成日時を表します。

`schema.prisma` ファイルの編集が完了したら、以下のコマンドでマイグレーションを実行します。

```bash
npx prisma migrate dev --name init
```

マイグレーションに成功すると、`prisma` ディレクトリ内に `migrations` ディレクトリが作成されます。`YYYYMMDDHHMMSS-init` という名前のディレクトリが作成され、その中に `migration.sql` ファイルが作成されます。このファイルにはデータベースのスキーマ変更を行う SQL 文が記述されています。

```sql:prisma/migrations/YYYYMMDDHHMMSS-init/migration.sql
-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);
```

### テストデータの追加

これでデータベースのセットアップが完了しました。最後にテスト用のデータを追加する script を作成します。`scripts` ディレクトリを作成し、`seed.ts` ファイルを作成します。

```ts:prisma/scripts/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.article.create({
    data: {
      title: '今日の散歩',
      content: '朝、気持ちの良い風が吹いていたので、近くの公園に散歩に行きました。色とりどりの花々が咲き誇り、小さな鳥たちが忙しく飛び交っていました。自然の中でリフレッシュできる時間は本当に素晴らしいです。',
    },
  });

  await prisma.article.create({
    data: {
      title: '今日のランチ',
      content: '昼食は、近くのカフェでサンドイッチとコーヒーをいただきました。サンドイッチはハムとチーズがたっぷり挟まれており、コーヒーは香り高くて美味しかったです。美味しい食事をいただくと、気持ちもリフレッシュされますね。',
    },
  });

  await prisma.article.create({
    data: {
      title: '夜は読書を楽しむ',
      content: '夜、家に帰ってからは、最近読み始めた小説を読み進めました。物語の展開が気になって、ついつい夜更かししてしまいました。読書は、日常の中で自分だけの時間を楽しむことができるので、とても大切な時間です。',
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

`prisma.article.create` メソッドを使用して記事を追加しています。`finally` ブロックで `prisma.$disconnect()` メソッドを使用して確実にデータベースとの接続が切断されるようにしています。

`package.json` ファイルにテストデータを追加するスクリプトを実行する `seed` コマンドを追加します。

```json:package.json
{
  "scripts": {
    "seed": "tsx scripts/seed.ts"
  }
}
```

`seed` コマンドを実行してテストデータを追加しましょう。

```bash
npm run seed
```

データが正しく追加されたか確認するために、Prisma Studio を起動します。Prisma Studio はデータベースの内容を確認するための GUI ツールです。

```bash
npx prisma studio
```

http://localhost:5555 にアクセスすると、Prisma Studio が起動します。`Article` テーブルを選択して、追加した記事が表示されていることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2xGlzIkwBJ7GGZOw7JxOuE/3caa88a22548565f94c255a69cc4624f/__________2024-05-25_17.14.16.png)

## 記事の一覧表示

次に記事の一覧表示画面を作成します。まずは `src/routes/articles/+pages.svelte` を作成して `/articles` にアクセスしたときに表示されるページを作成します。

```svelte:src/routes/articles/+pages.svelte
<h1 class="text-3xl font-bold mt-4">記事一覧</h1>
```

http://localhost:5173/articles にアクセスし、`記事一覧` と表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3LgoZPqb8wog35h39FhPMv/25b657e50b97c79d7e6517fcaa9ad395/__________2024-05-25_17.51.14.png)

### 記事の一覧を取得する

次に、データベースから記事の一覧を取得して表示するための関数を追加します。Prisma を通じてデータベースを操作するためには、`PrismaClient` を初期化する必要があります。`src/lib/server/prisma.ts` ファイルを作成し、以下の内容を記述します。

```ts:src/lib/server/prisma.ts
import { dev } from '$app/environment';
import { PrismaClient } from '@prisma/client';

declare const global: {
	prisma: PrismaClient;
};

let prisma: PrismaClient;

if (dev) {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
} else {
	prisma = new PrismaClient();
}

export default prisma;
```

SvelteKit により提供されている `$app/environment` モジュールを使用して、開発環境かどうかを判定しています。開発サーバーとして実行されている場合には、HMR によりモジュールが再読み込みされ複数回クライアントがデータベースに接続されることを防ぐために、`global` オブジェクトを使用して PrismaClient のインスタンスを共有しています。

なお `src/lib/server` ディレクトリ配下に配置されたファイルは [Server-only Modules](https://kit.svelte.jp/docs/server-only-modules) として扱われます。Server-only Modules としてマークされたファイルは、クライアント側で import しようとした場合エラーが発生します。

```sh
[vite] Internal server error: Cannot import $lib/server/prisma.ts into client-side code
```

これにより、サーバー側でのみ扱うべき機密情報が誤ってクライアント側に漏洩することを防ぐことができます。

同様に記事の一覧を取得する関数を `src/lib/server/articles.ts` ファイルに追加しましょう。

```ts:src/lib/server/articles.ts
import prisma from './prisma';
import type { Article } from '@prisma/client';

// db クライアントを隠蔽するために re-export する
export type { Article };

export async function getArticles(): Promise<{ articles: readonly Article[] }> {
	const articles = await prisma.article.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});
	return { articles };
}
```

`prisma.article.findMany` メソッドを使用して、データベースからすべての記事を取得しています。`orderBy` オプションを使用して、`createdAt` フィールドを降順でソートします。これで DB から記事を取得するための準備が整いました。

### 記事一覧を表示する

`/articles` にアクセスしたときに記事一覧をデータベースから取得して表示するようにしましょう。データベースにアクセスする処理は必ずサーバーサイドで実行する必要があります。`+page.svelte` ファイルはクライアント側で実行されるため、ここでは `getArticles` 関数を呼び出すことができません。

SvelteKit においてサーバー側でコンポーネントが描画される前にデータを取得するために、対応するページコンポーネントの隣に `page.server.ts` ファイルを作成します。`page.server.ts` ファイルにおいて `load` 関数をエクスポートすることで、サーバーサイドでデータを取得し、クライアントに渡すことができます。

`src/routes/articles/+page.server.ts` ファイルを作成し、以下の内容を記述します。

```ts:src/routes/articles/+page.server.ts
import { getArticles } from '$lib/server/articles';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const { articles } = await getArticles();
	return { articles };
};
```

`load()` 関数には `PageServerLoad` 型を指定しています。この `PageServerLoad` 型は SvelteKit により自動で生成される型であり、`load()` 関数を実装を変更するたびに、返却したオブジェクトに適した型が生成されます。SvelteKit はこの自動的な型生成により、サーバーとクライアント間のデータの受け渡しの型安全性を保証します。

次に `+page.svelte` ファイルを編集して、`load()` 関数から返されるデータを受け取るようにしましょう。

```svelte:src/routes/articles/+page.svelte
<script lang="ts">
	const { data } = $props();
</script>

<h1 class="text-3xl font-bold mt-4">記事一覧</h1>

<ul class="mt-4">
	{#each data.articles as article (article.id)}
		<li>
			{article.title}
		</li>
	{/each}
</ul>
```

`load()` 関数から返されるデータは `data` Props としてコンポーネントに渡されます。渡されたデータは `Article` 型の配列であり、`#each` ディレクティブを使用して記事の一覧をリストとして表示しています。`#each` ディレクティブはリストの反復処理を行うために使用され、`{#each data.articles as article}` で `data.articles` 配列の各要素を `article` として取り出しています。また `#each{}` の最後の `()` では　`article.id` を一意な key として指定しています。

http://localhost:5173/articles にアクセスし、データベースから取得した記事の一覧が表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6OMxj3uEHA27ZZx91zyJeg/d17a03c5f0b37d35f1aefe7c69b40593/__________2024-05-25_19.44.58.png)

### カードコンポーネントを作成する

記事のタイトルをただ表示するだけでは殺風景ですので、カードコンポーネントを作成してスタイリングを行いましょう。`src/routes/articles/Card.svelte` ファイルを作成します。

SvelteKit では `routes/` ディレクトリ配下にあるファイルは `+page.svelte` のみがページコンポーネントとして扱われルーティングの対象となります。そのため、`Card.svelte` のようなファイルを `routes/` ディレクトリ配下に自由に配置できます。このように、ある特定の場所でのみで使用するコンポーネントをまとめた場所に配置することは「コロケーション」と呼ばれ、コードのメンテナンス性を向上させるための手法の 1 つです。

```svelte:src/routes/articles/Card.svelte
<script lang="ts">
	type Props = {
		id: number;
		title: string;
		createdAt: Date;
	};
	const { id, title, createdAt }: Props = $props();
</script>

<div
	class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300 ease-in-out flex"
>
	<div>
		<a href="/articles/{id}" class="hover:underline">
			<h2 class="text-lg font-bold">{title}</h2>
		</a>
		<time class="text-sm text-gray-500" datetime={createdAt.toISOString()}>
			{createdAt.toLocaleDateString()}
		</time>
	</div>
</div>
```

`$props()` 関数を使用して記事のデータを受け取ります。オブジェクトに対して型注釈を付けることで、Props の型を明示的に指定できます。記事のタイトルにはリンクを設定して記事の詳細画面へ遷移できるようにしています。

`+page.svelte` ファイルを編集して、カードコンポーネントを使用して記事の一覧を表示するようにしましょう。

```svelte:src/routes/articles/+page.svelte {2, 11}
<script lang="ts">
	import Card from './Card.svelte';

	const { data } = $props();
</script>

<h1 class="text-3xl font-bold mt-4">記事一覧</h1>

<ul class="mt-4 grid grid-cols-1 gap-4">
	{#each data.articles as article (article.id)}
		<Card id={article.id} title={article.title} createdAt={article.createdAt} />
	{/each}
</ul>
```

ここまでの実装を確認してみましょう。http://localhost:5173/articles にアクセスすると、カード UI で記事の一覧が表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7qVHucYQDfAnrLqQH2e3h6/a1dab537a39c08e5b15cd76b0228a39c/__________2024-05-25_20.03.49.png)

## 記事の詳細画面

次に記事の詳細表示画面を作成します。`/articles/:id` にアクセスしたときに、指定された ID の記事をデータベースから取得して表示します。例として `/articles/1` にアクセスしたときには、ID が 1 の記事の詳細が表示されます。

SvelteKit でダイナミックなルートを扱うためには、`src/routes/articles/[id]/+page.svelte` のようにディレクトリ名を `[]` で囲みます。`[]` で囲った部分は動的なルートパラメータであることを示します。

まずは `src/routes/articles/[id]/+page.svelte` ファイルを作成しましょう。

```svelte:src/routes/articles/[id]/+page.svelte
<h1 class="text-3xl font-bold mt-4">記事詳細</h1>
```

http://localhost:5173/articles/1 にアクセスし、`記事詳細` と表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/466bwYi6V1rb9FgKs2x1tl/e60e77b7001db25e7b845bfa93e934f0/__________2024-05-25_20.40.44.png)

### 記事の詳細を取得する

まずは指定された ID の記事をデータベースから取得するための関数を追加します。`src/lib/server/articles.ts` ファイルに以下の関数を追加しましょう。

```ts:src/lib/server/articles.ts
export async function getArticleById(id: number): Promise<Article | null> {
	const article = await prisma.article.findUnique({
		where: {
			id
		}
	});
	return article;
}
```

`where` 句の条件に `id` を指定して、指定された ID の記事が取得できるようにしています。記事が見つからない場合には `null` を返すようにしています。

`src/routes/articles/[id]/+page.server.ts` ファイルを作成し、サーバーサイドでデータを取得するための `load` 関数を追加します。

```ts:src/routes/articles/[id]/+page.server.ts
import { getArticleById } from '$lib/server/articles';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const article = await getArticleById(Number(params.id));

	if (article === null) {
		error(404, {
			message: `Article with id ${params.id} not found`
		});
	}

	return { article };
};
```

パスパラメータは `load` 関数の引数の `params` から取得できます。これによりパスパラメータの ID を使用して `getArticleById` 関数を呼び出し、指定された ID の記事を取得しています。記事が見つからない場合には、`error` 関数を使用して 404 エラーを返します。`error` は `never` 型を返す関数であるため、`if` の後のブロックでは `article` 変数の型が `Article` であることが保証されています。

それでは、`+page.svelte` ファイルを編集して、取得した記事のデータを表示するようにしましょう。`load()` 関数で返した値は `$props()` で受け取るのでした。

```svelte:src/routes/articles/[id]/+page.svelte
<script lang="ts">
	const { data } = $props();
</script>

<svelte:head>
	<title>{data.article.title}</title>
	<meta name="description" content={data.article.content} />
</svelte:head>

<div class="mx-auto my-5 max-w-5xl">
	<a href="/articles" class="flex items-center text-opacity-80 hover:underline"> ← 記事一覧に戻る</a>
</div>

<article class="p-4 mx-auto max-w-3xl">
	<div class="text-center">
		<h1 class="mt-4 text-2xl font-bold md:text-4xl">
			{data.article.title}
		</h1>
		<time class="text-sm text-gray-500 block mt-2" datetime={data.article.createdAt.toISOString()}>
			{data.article.createdAt.toLocaleDateString()}
		</time>
	</div>
	<div class="bg-white py-4 px-8 mt-8 shadow-md rounded-lg">
		{data.article.content}
	</div>
</article>
```

http://localhost:5173/articles/1 にアクセスし、指定された ID の記事の詳細が表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6MzfwZp1q3JzEcCEv4Ce8W/c7093804067e8c76b6e894e088aadfc4/__________2024-05-25_21.05.54.png)

### エラーページの作成

`+page.server.ts` ファイルでは記事が見つからないときに 404 エラーを返していました。`error` 関数が実行された場合、デフォルトでは SvelteKit で用意されているエラー画面が表示されます。例として http://localhost:5173/articles/42 のように存在しない記事の ID を指定してアクセスしてみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/1hkjXVCGxeA07htSlIuozq/fb0046b6a14f789358483ef4e8322182/__________2024-05-25_21.10.15.png)

デフォルトのエラー画面では、`error` 関数に渡したステータスコードと `message` プロパティの内容が表示されています。このエラーページをカスタマイズするためには、`src/routes` ディレクトリ配下に `+error.svelte` ファイルを作成します。`+error.svelte` ファイルはルートごと追加できます。あるルートでエラーが発生した場合、そのルートに最も近い祖先の `+error.svelte` ファイルが使用されます。

ここでは `src/routes/+error.svelte` ファイルを作成し、一般的な 404 エラーページを作成します。

```svelte:src/routes/$error.svelte
<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="mt-4 flex flex-col items-center">
	<h1 class="text-6xl font-bold italic tracking-wide">
		{#if $page.status === 404}
			404 Not Found
		{:else}
			500 Internal Server Error
		{/if}
	</h1>
	<p
		class="mb-6 mt-4 max-w-2xl font-light leading-relaxed text-gray-500 md:text-lg lg:mb-8 lg:text-xl"
	>
		{#if $page.status === 404}
			お探しのページが見つかりませんでした。
		{:else}
			予期せぬエラーが発生しました。
		{/if}
	</p>
	<div class="mt-16">
		<a href="/" class="flex items-center text-opacity-80 hover:underline">トップに戻る</a>
	</div>
</div>
```

発生したエラーの情報は `page` ストアを通じてアクセスできます。[Svelte のストア](https://svelte.jp/docs/svelte-store) の値を参照するための糖衣構文として、変数名の先頭に `$` を付ける構文があります。この構文は以下のように `.subscribe()` メソッドを呼び出すことと同じ意味を持ちます。

```ts
import { page } from "$app/stores";

let $page;
const unsubscribe = page.subscribe((value) => {
  page = value;
});
```

`$page.status` は現在のページのステータスコードを取得します。`{#if}` 条件分岐によって、ステータスコードが 404 の場合には `404 Not Found`、それ以外の場合には `500 Internal Server Error` と表示します。

```svelte
{#if $page.status === 404}
  404 Not Found
{:else}
  500 Internal Server Error
{/if}
```

http://localhost:5173/articles/42 にアクセスし、カスタムの 404 エラーページが表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/58pLWc5MLZVwlNNOriAFqp/3c28a6ae615745af88ede4a0e2334a14/__________2024-05-25_21.30.48.png)

## 記事の投稿

次に記事の投稿画面を作成します。`/articles/new` にアクセスしたときに、新しい記事を投稿するためのフォームを表示します。`src/routes/articles/new/+page.svelte` ファイルを作成しましょう。

```svelte:src/routes/articles/new/+page.svelte
<svelte:head>
  <title>新規記事投稿</title>
</svelte:head>

<form method="POST">
	<div class="grid gap-6 mt-6">
		<div>
			<label for="title" class="block mb-2 text-sm font-medium text-gray-900">タイトル</label>
			<input
				id="title"
        name="title"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				required
			/>
		</div>
		<div>
			<label for="content" class="block mb-2 text-sm font-medium text-gray-900">本文</label>
			<textarea
				id="content"
				name="content"
				rows="10"
				class="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        required
			></textarea>
		</div>
		<div>
			<button
				type="submit"
				class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300"
			>
				投稿する
			</button>
		</div>
	</div>
</form>

<style>
	/* field-sizing は TailwindCSS でサポートしていないスタイルなので、ここで定義している　*/
	textarea {
		min-height: 4lh;
		field-sizing: content;
	}
</style>
```

SvelteKit のフォームは JavaScript を使わずに、HTML の標準的なフォーム要素を使用して作成できます。ここでは `<form>` 要素を用いたフォームを作成しています。

http://localhost:5173/articles/new にアクセスし、フォームが表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/681Hlq1oUM29vbolo77yCK/33bfc3b7935976f10329537a18a46429/__________2024-05-26_10.24.12.png)

### フォームの送信処理

フォームからポストされたデータを処理するサーバーサイドの処理を実装します。`+page.server.ts` ファイルで `actions` オブジェクトをエクスポートし、`default` プロパティにフォームの送信処理を記述します。

```ts:+page.server.ts
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		// フォームの処理を書く
	}
};
```

フォームデータを受け取り、DB に保存する処理を追加しましょう。まずは `lib/server/articles.ts` ファイルに記事を作成する関数を追加します。

```ts:src/lib/server/articles.ts
export async function createArticle(data: Pick<Article, 'title' | 'content'>): Promise<Article> {
	const article = await prisma.article.create({
		data
	});
	return article;
}
```

次に `src/routes/articles/new/+page.server.ts` ファイルにフォームデータを受け取り、`createArticle` 関数を呼び出して記事を作成する処理を追加します。action は引数として [RequestEvent](https://kit.svelte.jp/docs/types#public-types-requestevent) 型のオブジェクトを受け取ります。`request.formData()` を呼び出すことで、[formData](https://developer.mozilla.org/ja/docs/Web/API/FormData) オブジェクトとしてポストされたデータを取得できます。

DB へのデータの保存に成功した場合には `redirect()` 関数を呼び出して記事の一覧ページへリダイレクトします。

```ts:src/routes/articles/new/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createArticle } from '$lib/server/articles';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
    // .get() の値は <input> の name 属性の値に対応している
		const title = formData.get('title') as string;
		const content = formData.get('content') as string;

		await createArticle({ title, content });

		redirect(303, '/articles');
	}
};
```

これでフォームからデータを送信する処理が実装できました。フォームに適当なタイトルと本文を入力して投稿してみましょう。投稿が成功すると記事一覧ページにリダイレクトされ、投稿した記事が一覧に表示されます。

### フォームデータのバリデーション

フォームデータを受け取る際に `as string` で型アサーションを行っています。しかし、`formData.get()` は `null` を返す可能性があるため良い実装ではありません。必須の項目が入力されていなかったり、不正なデータが送信された場合にはエラーメッセージを表示するように修正しましょう。

バリデーションを行うライブラリとして　[Zod](https://zod.dev/) を導入します。Zod は TypeScript で書かれたスキーマ定義を使用して、データのバリデーションを行うライブラリです。

```bash
npm install zod
```

`src/lib/server/articles.ts` ファイルに Zod を使用したスキーマを定義しましょう。

```ts:src/lib/server/articles.ts
import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(1).max(20),
  content: z.string().min(1).max(1000)
});
```

このスキーマでは、`title` プロパティは 1 文字以上 20 文字以下、`content` プロパティは 1 文字以上 1000 文字以下であることを定義しています。

続いて `src/routes/articles/new/+page.server.ts` ファイルの action 関数内で `articleSchema` を利用してバリデーション処理を行うように修正します。

```ts:src/routes/articles/new/+page.server.ts {8-22}
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { articleSchema, createArticle } from '$lib/server/articles';

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const validatedFields = articleSchema.safeParse({
			title: formData.get('title'),
			content: formData.get('content')
		});

		// バリデーションに失敗した場合
		if (!validatedFields.success) {
			return fail(400, {
				errors: validatedFields.error.formErrors,
				fields: {
					title: formData.get('title') as string | undefined,
					content: formData.get('content') as string | undefined
				}
			});
		}

		await createArticle({
			title: validatedFields.data.title,
			content: validatedFields.data.content
		});

		redirect(303, '/articles');
	}
};
```

`articleSchema.safeParse()` メソッドを使用してフォームデータがスキーマに適合しているかを検証します。バリデーションに失敗した場合には `.safeParse()` の戻り値の `success` プロパティが `false` となり、`error.formErrors` プロパティにエラーメッセージが格納されます。その場合には SvelteKit の `fail()` 関数を使用して 400 エラーを返します。`fail()` 関数の第 2 引数にはエラーメッセージと前回のフォームの値を渡します。エラーメッセージはクライアント側で表示するために使用されます。

バリデーションに成功した場合には、`validatedFields.data` からデータを取り出して記事を作成します。型アサーションを使用するよりも安全にデータを取り出すことができるようになりました。

続いてバリデーションエラーが発生した場合に、クライアント側でエラーメッセージを表示するように修正します。action から返された値は `form` Props としてコンポーネントに渡されます。`form` Props は SvelteKit により自動で型が生成されており、`fail()` 関数に渡したオブジェクトの型に合わせて推論されます。

```svelte:src/routes/articles/new/+page.svelte
<script lang="ts">
	const { form } = $props();
</script>
```

`form` の `fieldErrors` プロパティには各フィールドのエラーメッセージが格納されています。フォームの各フィールドの下にエラーメッセージを表示するようにしましょう。また、前回入力したフォームの値を保持するために、`fields` プロパティを使用してフォームの初期値を設定します。

```svelte:src/routes/articles/new/+page.svelte {1-3, 14-16, 18-20, 30-32, 34-38}
<script lang="ts">
	const { form } = $props();
</script>

<form method="POST">
	<div class="grid gap-6 mt-6">
		<div>
			<label for="title" class="block mb-2 text-sm font-medium text-gray-900">タイトル</label>
			<input
				id="title"
				name="title"
				class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				required
				value={form?.fields.title}
				aria-invalid={form?.errors.fieldErrors?.title ? 'true' : undefined}
				aria-describedby={form?.errors.fieldErrors?.title ? 'title-error' : undefined}
			/>
			{#if form?.errors.fieldErrors?.title}
				<p id="title-error" class="text-red-600 text-sm mt-1">{form.errors.fieldErrors.title}</p>
			{/if}
		</div>
		<div>
			<label for="content" class="block mb-2 text-sm font-medium text-gray-900">本文</label>
			<textarea
				id="content"
				name="content"
				rows="10"
				class="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
				required
				value={form?.fields.content}
				aria-invalid={form?.errors.fieldErrors?.content ? 'true' : undefined}
				aria-describedby={form?.errors.fieldErrors?.content ? 'content-error' : undefined}
			></textarea>
			{#if form?.errors.fieldErrors?.content}
				<p id="content-error" class="text-red-600 text-sm mt-1">
					{form.errors.fieldErrors.content}
				</p>
			{/if}
		</div>
		<div>
			<button
				type="submit"
				class="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300"
			>
				投稿する
			</button>
		</div>
	</div>
</form>
```

これでフォームのバリデーションエラーが発生した場合にエラーメッセージが表示されるようになりました。タイトルに 20 文字以上の文字列を入力して投稿してみましょう。エラーメッセージが表示されることを確認します。

![](https://images.ctfassets.net/in6v9lxmm5c8/1kS0BLtyZCm4yqHxcqLO3t/48a8b2a75b76c1bc87d70b3a08144e12/__________2024-05-26_11.27.14.png)

### プログレッシブエンハンスメントなフォーム

現在のフォームは HTML の標準機能のみを利用して作成されています。このことは、JavaScript が無効になっている環境でもフォームが正常に動作することを意味し、良い習慣と言えるでしょう。

ただし JavaScript の `fetch` API を使用して送信するフォームと比較すると、1 度ポストリクエストを送信してページがフルリロードされる都合上、ユーザーにとっては使い勝手が悪いと感じるかもしれません。SvelteKit はこのような問題を解決するために、JavaScript が有効な環境な場合のみ、よりよいユーザー体験を提供する `use:enhance` アクションを提供しています。

使い方は簡単で、`<form>` 属性に `use:enhance` を追加するだけです。

```svelte:src/routes/articles/new/+page.svelte {2, 6-8}
<script lang="ts">
	import { enhance } from '$app/forms';
	const { form } = $props();
</script>

<form method="POST" use:enhance>
  { /* ... */ }
</form>
```

`enhance` を引数無しで呼び出すと、ブラウザネイティブの動作をページのフルリロードを除きエミュレートします。引数にコールバック関数を受け取り、フォームがサブミットされる直前の動作をカスタマイズすることが可能です。

### フォームの文字列をカウントする

ユーザーの利便性を向上させるために、本文の文字数をカウントする機能を追加しましょう。本文のフォームに入力された値を表す `content` という状態を新たに定義し、`textarea` になにか入力するたびに `content` を更新します。

Svelte v5 以降ではリアクティブな状態を定義するために `$state()` 関数を使うことが推奨されます。`$state()` の引数には初期値を渡せるので、`content` の初期値は `form?.fields.content` としておきます

```svelte:src/routes/articles/new/+page.svelte
<script lang="ts">
	import { enhance } from '$app/forms';
	const { form } = $props();

	let content = $state(form?.fields.content ?? '');
  const maxCount = 1000;
```

さらに、ある状態から派生した状態は `$derived()` 関数を使って定義できます。`$derived()` 関数を使って本文のフォームに入力された値から、文字数をカウントする `count` という状態を定義します。

```svelte:src/routes/articles/new/+page.svelte {6-8}
<script lang="ts">
  let content = $state(form?.fields.content ?? '');

  const count = $derived(content.length);
  const maxCount = 1000;
</script>
```

ところで、文字数をカウントするために `.length` プロパティを使用することはあまり好ましくないことが知られています。例えば、「🍎」のような絵文字や「𩸽」のようにサロゲートペアで表現される文字は見た目上 1 文字に見えますが、`.length` プロパティを使うと期待とは異なる結果が返されます。

```js
"🍎".length; // 2
"𩸽".length; // 2
```

JavaScript で正しく日本語の文字数をカウントしたい場合には、[Intl.Segmenter](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) を使う方法があります。Intl.Segmenter はロケールに応じたテキストのセグメンテーションを行うための API です。Intl.Segmenter がサロゲートペアも考慮されているため、より正確な文字列のカウントが行えます。

```js
const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
[...segmenter.segment("🍎")].length; // 1
[...segmenter.segment("𩸽")].length; // 1
```

`$derived()` 関数内の実装を Intl.Segmenter を使って書き換えてみたいところですが、`$derived()` は単純な式のみを引数に取るため、複数行にまたがるような処理を書くことができません。このような場合には、`$derived.by()` 関数を使って派生状態を定義できます。

```svelte:src/routes/articles/new/+page.svelte {6-0}
<script lang="ts">
  import { enhance } from '$app/forms';
  const { form } = $props();

  let content = $state(form?.fields.content ?? '');
  const count = $derived.by(() => {
    const segmenter = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return [...segmenter.segment(content)].length;
  });
  const maxCount = 1000;
</script>
```

状態の定義が完了したら、`textarea` に入力されるたびに `content` が更新されるようにしましょう。Svelte では `bind:value` ディレクティブを使って、`textarea` の値を双方向バインディングできます。

```svelte:src/routes/articles/new/+page.svelte {7}
<textarea
  id="content"
  name="content"
  rows="10"
  class="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  required
  bind:value={content}
  aria-invalid={form?.errors.fieldErrors?.content ? 'true' : undefined}
  aria-describedby={form?.errors.fieldErrors?.content ? 'content-error' : undefined}
></textarea>
```

最後に、文字数のカウントを表示するようにしましょう。

```svelte:src/routes/articles/new/+page.svelte {14-16}
<div>
  <label for="content" class="block mb-2 text-sm font-medium text-gray-900">本文</label>
  <textarea
    id="content"
    name="content"
    rows="10"
    class="border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    required
    bind:value={content}
    aria-invalid={form?.errors.fieldErrors?.content ? 'true' : undefined}
    aria-describedby={form?.errors.fieldErrors?.content ? 'content-error' : undefined}
  ></textarea>

  <p class="text-sm text-gray-500 mt-1" class:text-red-600={count > maxCount}>
	  {count}/{maxCount}
	</p>

  {#if form?.errors.fieldErrors?.content}
    <p id="content-error" class="text-red-600 text-sm mt-1">
      {form.errors.fieldErrors.content}
    </p>
  {/if}
</div>
```

`class:text-red-600={count > maxCount}` は Svelte で動的にクラスを適用するための構文です。`text-red-600` クラスは `{count > maxCount}` という条件が `true` のときに適用されます。

フォームに文字を入力するたびに、文字数がカウントされることを確認しましょう。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7tjpnw4STAoR7vl2dgA8oD/e499a62d69005414e5736e7c2681c477/_____2024-05-26_14.44.11.mov" controls></video>

## 記事の削除

記事の一覧画面で削除ボタンをクリックしたときに、モーダルで確認メッセージを表示し、OK ボタンをクリックすると記事を削除する機能を実装します。まずは `src/routes/articles/deleteModal.svelte` ファイルを作成し、モーダルのコンポーネントを作成します。

```svelte:src/routes/articles/deleteModal.svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  type Props = {
    id: number;
  };
	const { id }: Props = $props();
  // <dialog> 要素の ref を取得する
	let modalRef = $state<HTMLDialogElement | null>(null);

	const openModal = () => {
		modalRef?.showModal();
	};
</script>

<button type="button" class="bg-red-500 text-white px-4 py-2 rounded-lg" onclick={openModal}>
  削除
</button>

<dialog
	bind:this={modalRef}
	class="p-4 w-96 backdrop:backdrop-blur-sm backdrop:bg-black/40 bg-white rounded-lg"
	aria-labelledby="modal-title"
>
	<form use:enhance>
		<h2 id="modal-title" class="text-xl font-bold">記事の削除</h2>
		<p>本当に削除しますか？</p>
		<div class="mt-4 flex justify-end">
			<button class="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg" formmethod="dialog">
				キャンセル
			</button>
			<button
				class="bg-red-500 text-white px-4 py-2 rounded-lg ml-2"
				formmethod="post"
				formaction="/articles/{id}/delete"
			>
				OK
			</button>
		</div>
	</form>
</dialog>
```

モーダルは HTML 標準の [dialog](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog) 要素を使用して作成しています。`<dialog>` 要素は `HTMLDialogElement` インターフェイスの `showModal()` メソッドを呼び出すことで表示されます。`bind:this` で `<dialog>` 要素の参照をあらかじめ取得しておき、削除ボタンがクリックされたときに `showModal()` メソッドを呼び出すようにしています。

CSS の `::backdrop` 擬似クラスを使うことでモーダルが表示されたときの背景のスタイルを変更できます。TailwindCSS において擬似クラスを適用する場合には `backdrop:bg-black/40` のように `backdrop:` をプレフィックスとして指定します。

ダイアログの中身はフォームとなっており、キャンセルボタンの `formmethod` には `formmethod="dialog"` を指定しています。これにより、キャンセルボタンをクリックするとダイアログが閉じるようになります。OK ボタンをクリックすると、`formaction` に指定した URL に POST リクエストが送信されるようになっています。記事の作成画面のように、後ほど `+page.server.ts` ファイルでリクエストを処理するようにします。

記事一覧画面に削除ボタンを追加し、モーダルを表示するようにします。カードコンポーネントを修正しましょう。

```svelte:src/routes/articles/Card.svelte {2,23-25}
<script lang="ts">
	import DeleteModal from './DeleteModal.svelte';

	type Props = {
		id: number;
		title: string;
		createdAt: Date;
	};
	const { id, title, createdAt }: Props = $props();
</script>

<div
	class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-300 ease-in-out flex justify-between"
>
	<div>
		<a href="/articles/{id}" class="hover:underline">
			<h2 class="text-lg font-bold">{title}</h2>
		</a>
		<time class="text-sm text-gray-500" datetime={createdAt.toISOString()}>
			{createdAt.toLocaleDateString()}
		</time>
	</div>
	<div>
		<DeleteModal {id} />
	</div>
</div>
```

削除ボタンをクリックするとモーダルが表示されることを確認しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/1GjmQef1K65nVGMnCNNioq/eab58eb3f92ebe8d14f5011c287b7354/__________2024-05-26_15.15.44.png)

### 記事の削除処理

サーバーサイドでポストリクエストを処理し、記事を削除する処理を実装しましょう。まずはいつものように `lib/server/articles.ts` ファイルに DB から記事を削除する関数を追加します。

```ts:src/lib/server/articles.ts
export async function deleteArticle(id: number): Promise<void> {
	await prisma.article.delete({
		where: {
			id
		}
	});
}
```

リクエストを処理する `src/routes/articles/[id]/delete/+page.server.ts` ファイルを作成し、削除処理を実装します。

```ts:src/routes/articles/{id}/delete/+page.server.ts
import { deleteArticle } from '$lib/server/articles';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ params }) => {
		const id = params.id;

		await deleteArticle(Number(id));

		return redirect(303, '/articles');
	}
};
```

これで削除ボタンをクリックすると、記事が削除されるようになりました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/Russwu8QKpt41IMNGEys2/3096b8acc40a0ced05121f553c8724a0/_____2024-05-26_15.32.27.mov" controls></video>

## まとめ

このチュートリアルでは、SvelteKit でブログアプリケーションを作成し、以下の事項について学びました。

- ファイルベースシステムのルーティング
- サーバーサイドでのデータの取得
- フォームの作成と送信処理
- `$props` によるコンポーネント間のデータの受け渡し
- `$state` による状態の管理

ここでは、SvelteKit の基本的な機能を使ってブログアプリケーションを作成しましたが、SvelteKit には他にも多くの機能が用意されています。例として、SvelteKit の機能を活用して以下のような機能を追加してみると良いでしょう。

- 記事の一覧画面に form action を追加し、検索機能を実装する
- [スナップショット](https://kit.svelte.jp/docs/snapshots) により、ユーザーがフォームに入力した内容を保持する
- `+server.ts` ファイルで [API ルート](https://kit.svelte.jp/docs/routing#server) を作成し、RSS フィードを提供する
- [Vercel Adapter](https://kit.svelte.jp/docs/adapter-vercel) を使って記事の詳細画面に ISR オプションを設定する
