---
id: 63HSy1rYYvz67eNKwiTpv2
title: "SvelteKit で環境変数を使う`"
slug: "using-environment-variables-with-sveltekit"
about: "SvelteKit プロジェクトは Vite を使用しているので、`import.meta.env` から環境変数を参照できます。単に環境変数を参照するだけならば十分です。ですが SvelteKit により提供されている環境変数の仕組みを使用すると、型安全に環境変数を参照できる、公開してはいけない値をクライアントから参照できなくなるなどのメリットを得られます。"
createdAt: "2023-03-05T00:00+09:00"
updatedAt: "2023-03-05T00:00+09:00"
tags: ["SvelteKit", "", "Vite"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7hhDeizKRjjvdi0FvzzElM/ecedf5a058ccfa563f17fbce948985f3/_Pngtree_vector_mountains_841767.png"
  title: "mountains"
selfAssessment: null
published: true
---
SvelteKit プロジェクトは Vite を使用しているので、`import.meta.env` から環境変数を参照できます。単に環境変数を参照するだけならば十分です。ですが SvelteKit により提供されている環境変数の仕組みを使用すると、型安全に環境変数を参照できる、公開してはいけない値をクライアントから参照できなくなるなどのメリットを得られます。

SvelteKit では以下の 4 つのモジュールから環境変数を参照できます。

- [$env/dynamic/private](https://kit.svelte.jp/docs/modules#$env-dynamic-private)
- [$env/dynamic/public](https://kit.svelte.jp/docs/modules#$env-dynamic-public)
- [$env/static/private](https://kit.svelte.jp/docs/modules#$env-static-private)
- [$env/static/public](https://kit.svelte.jp/docs/modules#$env-static-public)

## 型安全な環境変数

SvelteKit では環境変数を `$env/{dynamic|static}/{private|public}` から参照できます。このモジュールは SvelteKit により自動で型定義が生成されるため、型安全に環境変数を参照できます。

例えば、以下のような `.env` ファイルを作成します。

```bash
API_KEY=1234567890
PUBLIC_API_KEY=0987654321
```

`vite dev` または `vite build` を実行すると、`$env` モジュールの型定義が生成されます。

```ts:.svelte-kit/ambient.d.ts
declare module '$env/static/private' {
	export const API_KEY: string;
  // ...
}

declare module '$env/dynamic/private' {
	export const env: {
		API_KEY: string;
    // ...
  }
}

declare module '$env/static/public' {
  export const PUBLIC_API_KEY: string;
  // ...
}

declare module '$env/dynamic/public' {
  export const env: {
    PUBLIC_API_KEY: string;
    // ...
  }
}
```

この型定義により `$env` モジュールから `import` することで、型安全に環境変数を参照できます。

```ts:src/routes/+page.server.ts
import { API_KEY } from '$env/static/private';

API_KEY; // string
```

環境変数名を typo するといったミスもコンパイルエラーとなるので防ぐことができます。

```ts:src/routes/+page.server.ts
import { AP_KEY } from '$env/static/private';
// '"$env/static/private"' has no exported member named 'AP_KEY'. Did you mean 'API_KEY'?ts(2724)
```

例えば環境変数の設定漏れなどにより、実行時に環境変数が存在しない場合には例外が発生します。そのため、`process.env` のように型が `string | undefined` とならずに `string` 型として参照できるのです。

```ts:src/routes/+page.server.ts
import { API_KEY } from '$env/static/private';
// "API_KEY" is not exported by "$env/static/private", imported by "src/routes/+page.server.ts".
```

もし `vite dev` または `vite build` を実行しても `Cannot find module '$env/static/public' or its corresponding type declarations.ts(2307)` とエラーが表示される場合には `tsconfig.json` の `include` に `.svelte-kit/ambient.d.ts` を追加してください。

```json:tsconfig.json
{
  "include": [".svelte-kit/ambient.d.ts"]
}
```

## .env ファイル

`dev` または `preview` の場合には `.env` ファイルから環境変数を読み取ります。`.env` ファイルの形式や読み込みの優先度は Vite の環境変数の仕組みに従います。

```
.env                # 全ての場合に読み込まれる
.env.local          # 全ての場合に読み込まれ、gitには無視される
.env.[mode]         # 指定されたモードでのみ読み込まれる
.env.[mode].local   # 指定されたモードでのみ読み込まれ、gitには無視される
```

> env 読み込みの優先度
> 特定のモードの env ファイル（例: .env.production）は、汎用の env ファイル（例: .env）よりも優先されます。
> また、Vite の実行時に既に存在している環境変数は最も優先度が高く、.env ファイルによって上書きされることはありません。例えば、VITE_SOME_KEY=123 vite build を実行する場合。
> .env は Vite 起動時に読み込まれます。変更した後はサーバを再起動してください。

https://ja.vitejs.dev/guide/env-and-mode.html#env-files

`.env` ファイルがプロジェクトのルート以外の場所にある場合には、`svelte.config.js` の `kit.env.dir` で指定します。

```js:svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    env: {
      dir: '../',
    },
  },
}
```

## `$env` モジュール

SvelteKit の `$env` モジュールは「動的/静的」かつ「公開/非公開」の 4 つのモジュールから構成されています。

| | 動的 | 静的 |
| --- | --- | --- |
| 公開 | `$env/dynamic/public` | `$env/static/public` |
| 非公開 | `$env/dynamic/private` | `$env/static/private` |

### dynamic/static

dynamic と static の違いは、ビルド時に値が静的に注入されるかどうかです。`dynamic` は `env` というオブジェクトを export し、その中に環境変数が格納されます。そのため、以下のように動的に値を取得できます。

```ts:src/routes/+page.server.ts
import { env } from '$env/dynamic/private'

const envName = "API_KEY"

env[envName] // 1234567890
```

`static` はビルド時に値が注入されるため、動的に値を取得することはできません。ですが、静的に値を注入されるためデッドコードの排除などの最適化が可能です。そのため、基本的には `static` を使用することを推奨します。

```ts:src/routes/+page.server.ts
import { API_KEY } from '$env/static/private'

API_KEY // 1234567890
```

### public/private

`public` はクライアント側に公開できる値のみが含まれています。そのため、この `public` モジュールはどんな場所からでも import できます。

クライアントに公開できる値かどうかは、環境変数の先頭に `PUBLIC_` がついているかどうかで判断されます。この値は `svelte.config.js` の `kit.env.publicPrefix` で変更できます。先頭に `PUBLIC_` がついていない環境変数は一切モジュールに含まれません。

```svelte:src/routes/+page.svelte
<script lang="ts">
  import { PUBLIC_API_KEY } from '$env/static/public'
</script>
```

`private` はクライアント側に公開してはいけない機密データを含みます。`PUBLIC_` がついていないすべての環境変数がこのモジュールから import できます。

`private` モジュールはサーバー側で実行されるモジュールでのみ import が可能です。クライアント側で import しようとすると以下のようなエラーが発生します。

```svelte:src/routes/+page.svelte
<scirpt lang="ts">
  import { API_KEY } from '$env/static/private'
  // Cannot import $env/static/private into client-side code
</scirpt>
```

サーバー側でのみ実行されるモジュールは [Server-only modules](https://kit.svelte.jp/docs/server-only-modules) と呼ばれています。Server-only modules とされるモジュールは以下の 2 つの条件のうちどちらかを満たす必要があります。

- ファイル名に `.server` が含まれている (例: `+page.server.ts`)
- モジュールが `src/lib/server` に置かれている (例: `src/lib/server/secret.ts`)

Server-only modules もまたクライアント側から import することはできません。

```svelte:src/routes/+page.svelte
<scirpt lang="ts">
  // $lib は src/lib のエイリアス
  import { secrets } from '$lib/server/private'
  // Cannot import $lib/server/secrets.ts into client-side code
</scirpt>
```

## まとめ

- SvelteKit では型安全に環境変数を参照できる
- 機密データが含まれる環境変数がクライアント側に公開されることを防ぐことができる
