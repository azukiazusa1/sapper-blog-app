---
title: "Nuxt3 の新しい機能いろいろ"
about: "現在 Nuxt.js は バージョン3がパブリックベータ版として提供されています。 Nuxt.js が 2 → 3 に移行するにあたってたくさんの新機能が追加されました。"
createdAt: "2021-12-12T00:00+09:00"
updatedAt: "2021-12-12T00:00+09:00"
tags: ["Nuxt.js", "Vue.js"]
published: true
---
現在 Nuxt.js は バージョン3がパブリックベータ版として提供されています。 Nuxt.js が 2 → 3 に移行するにあたってたくさんの新機能が追加されました。

- パフォーマンスの向上
- Nitro engine
- Composition API
- Vite
- Vue 3
- Webpack 5
- Nuxt CLI
- TypeScript のネイティブサポート
- ESM サポート
- Nuxt devtool(まだ)
- and more...

上記以外にも新たに追加された機能はどれも興味深いものばかりで今すぐにも使いたいものが揃っています。Nuxt3 で追加された新機能を体験してみましょう！

## インストール

Nuxt3 からは `create-nuxt-app` の代わりに新しく `Nuxt CLI` を使用してプロジェクトを作成します。

```sh
npx nuxi init nuxt3-app
```

生成されたフォルダを確認すると初めから TypeScript になっていることがわかります✨
フォルダの構成は Nuxt2 の頃のようにすべて予め用意されているわけではなく随分控えめになっています。

```
.
├── .gitignore
├── README.md
├── app.vue
├── nuxt.config.ts
├── package-lock.json
├── package.json
└── tsconfig.json
```

`npm` か `yarn` でパッケージをインストールします。

```sh
cd nuxt3-app
npm install 
```

インストールが完了したら以下コマンドで起動して http://localhost:3000 にアクセスしてみましょう。起動はめちゃくちゃ早いです。

```sh
npm run dev
```

![スクリーンショット 2021-12-12 15.15.42](//images.ctfassets.net/in6v9lxmm5c8/7178aiuRSCbnQwTvtHuCw/fb6b42bc0995c986ab415cd2d7fbfce9/____________________________2021-12-12_15.15.42.png)

### Volar

Vue3 からは VSCode の拡張子として `Vetur` の代わりに `Volar` を使うことが推奨されています。下記をインストールしておきましょう。（`Vetur` がすでにインストールされているのなら無効化する必要があります）（Vue2 のプロジェクトと Vue3 のプロジェクトを移動するのがめんどくさいね！）

https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar

### TypeScript の Strict type checks を有効にする

初めから TypeScript を用意してくれているのは嬉しいのですが、なぜだか `Strict type checks` （厳格モード)が有効になっていないです。例えば、以下のようなコードは `Strict type checks` が有効になっていれば `noImplicitAny` によりエラーを検出してくれるはずなのですが、現状の設定ではそうはなってくれません。

```vue
<script setup lang="ts">
const fn = (args) => {
  console.log(args);
};
</script>
```

通常の TypeScript プロジェクトでは `tsconfig.json` で TypeScript の設定を変更するのですが自動生成された `tsconfig.json` を見てみると以下のようになっています。

```json
{
  // https://v3.nuxtjs.org/concepts/typescript
  "extends": "./.nuxt/tsconfig.json"
}
```

ただ単純に `.nuxt/tsconfig.json` の設定内容を引き継いでいるだけのファイルとなっています。どうやら `.nuxt/tsconfig.json` は TypeScript のおすすめの設定を記載してくれているようです。

この設定を変更するには `nuxt.config.ts` ファイルを修正する必要があります。

```ts
import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  typescript: {
    strict: true
  }
})
```

`nuxt.config.ts` を編集してので開発サーバーを再起動する必要があります。

```sh
npm run dev
```

これでエディタ上では `noImplicitAny` のエラーが表示されている・・・のですが、残念ながら開発サーバーを起動したときには型チェックを行ってくれません。

型チェックは `npx nuxi typecheck` コマンドで手動で実行する必要があります。

```sh
npx nuxi typecheck
Nuxt CLI v3.0.0-27319101.3e82f0f                                                                    15:52:09
npx: 93個のパッケージを29.52秒でインストールしました。
pages/index.vue:2:13 - error TS7006: Parameter 'args' implicitly has an 'any' type.

2 const fn = (args) => {
              ~~~~

Found 1 error.

 ERROR  Command failed with exit code 2: npx -p vue-tsc -p typescript vue-tsc --noEmit              15:53:05

  at makeError (node_modules/nuxi/dist/chunks/index3.mjs:1096:11)
  at handlePromise (node_modules/nuxi/dist/chunks/index3.mjs:1660:26)
  at processTicksAndRejections (internal/process/task_queues.js:95:5)
  at async Object.invoke (node_modules/nuxi/dist/chunks/typecheck.mjs:42:7)
  at async _main (node_modules/nuxi/dist/chunks/index.mjs:382:7)
```

## app.vue

自動生成されたフォルダには存在しないことから分かる通り `pages` ディレクトリは必須ではなくなりました。

`pages` ディレクトリを使用しない場合には Nuxt はビルド時に `vue-router` を依存関係に含めなくなるためバンドルファイルを削減することができます。

`pages` ディレクトリを使用しない場合にはトップページの表示には `app.vue` ファイルが使われます。

`app.vue` と `pages` ディレクトリを同時に使用する場合 `app.vue` で `<NuxtPages>` コンポーネントを配置することによってそこに現在のページを表示することができます。

- app.vue

```vue
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

`app.vue` ファイルを削除すれば今まで通り `pages` ディレクトリのみで使用できます。

## Meta タグ 

### Meta components

Nuxt2 までは各ページの `<title>` タグや `<meta>` タグを設定するために head メソッドを利用してました。

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script>
  export default {
    data() {
      return {
        title: 'Hello World!'
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: 'My custom description'
          }
        ]
      }
    }
  }
</script>
```

Nuxt3 では Next.js の `pages/_document.js` のように以下のコンポーネントを提供しているため宣言的な方法で `<title>` タグを設定することができます。

- `<Title>` 
- `<Base>`
- `<Script>`
- `<Style>`
- `<Meta>`
- `<Link>`
- `<Body>`
- `<HTml>`
- `<Head>`

上記のコンポーネントは通常の html タグと区別するため全て大文字で開始する必要があることに注意してください。これらはコンポーネントは以下のように使用できます。

```vue
<script setup lang="ts">
const title = "Hello Nuxt3!!";
</script>

<template>
  <Html lang="ja">
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="`This is ${title} page`" />
    </Head>
  </Html>

  <h1>{{ title }}</h1>
</template>
```

期待通りに `<head>` タグが設定されていることがわかります。

![スクリーンショット 2021-12-12 16.28.09](//images.ctfassets.net/in6v9lxmm5c8/4ZIHBdgCxUQcL1ITZxu43f/70d4e2f9393d5c77d1561f3c47b73020/____________________________2021-12-12_16.28.09.png)

### useMeta

Meta components の他に `setup` 関数の中では `useMeta` 関数を使うこともできます。

```ts
<script setup lang="ts">
const title = "Hello Nuxt3!!";

useMeta({
  meta: [{ name: "description", content: `This is ${title} page` }],
});
</script>

<template>
  <h1>{{ title }}</h1>
</template>
```

## Server directory

### API Routes

Nuxt2 においては [serverMiddleware](https://nuxtjs.org/docs/configuration-glossary/configuration-servermiddleware/) を利用して外部サーバーを利用せずにちょっとした API サーバーを作成することができました。

Nuxt3 の [API Routes](https://v3.nuxtjs.org/docs/directory-structure/server) を使用すれば Next.js の API Routes のような API サーバーを作成することができます。

API Route は `~/server/api` 配下に作成する必要があります。
`~/server/api` 配下に配置した各ファイルは `req`,`res` を受け取る関数をデフォルトエクスポートする必要があります。

以下のように最も簡単な echo サーバーを作成してみましょう。

- server/api/hello.ts

```ts
export default (req, res) => 'Hello Nuxt3 from server!'
```

`~server/api` ディレクトリ配下のファイルは `pages` ディレクトリと同じようにファイルシステムベースのルーティングとなっています。 http://localhost:3000/api/hello にアクセスしてみてください。

![スクリーンショット 2021-12-12 16.37.54](//images.ctfassets.net/in6v9lxmm5c8/4CMLSH9bk6WmQs89UrvDX4/4734de15eebadc40cf0cf9e3d2265127/____________________________2021-12-12_16.37.54.png)

もう少し楽しい例も見てみましょう。[JSON Placeholder](https://jsonplaceholder.typicode.com/) というテスト用の API からデータを取得しそれを返却する API サーバーを作成します。

まずは `server/api/users.ts` ファイルを作成して `req`,`res` に適切な型をつけてあげます。

```ts
import type { IncomingMessage, ServerResponse } from 'http'

export default (req: IncomingMessage, res: ServerResponse) => {

}
```

Nuxt 上ではどこでも `$fetch` メソッドを使用できます。これは [ohmyfetch](https://github.com/unjs/ohmyfetch) を使用しておりサーバー上かブラウザ上を区別せずに `fetch` メソッドを利用することができます。

```ts
import type { IncomingMessage, ServerResponse } from 'http'

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}
export interface Geo {
  lat: string;
  lng: string;
}
export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export default async (req: IncomingMessage, res: ServerResponse) => {
  const result: User[] = await $fetch('https://jsonplaceholder.typicode.com/users')

  return result
}
```

http://localhost:3000/api/users にアクセスするとデータが問題なく取得できていることがわかります。

![スクリーンショット 2021-12-12 16.58.10](//images.ctfassets.net/in6v9lxmm5c8/7IHqosuJPTxwpvQeuMvMzS/fdac948e76fe304f83c046bab56454ca/____________________________2021-12-12_16.58.10.png)

### Server middleware

`~/server/middleware` 配下に作成したファイルはサーバーミドルウェアとして扱うことができます。サーバーミドルウェアは全てのリクエストに対して実行されます。例えば、ミドルウェア上で認証処理を実行したりログを採取する目的で使用できます。

API ルートと同様に `req`,`res` を受け取る関数をデフォルトエクスポートします。

- server/middleware/logging.ts

```ts
import type { IncomingMessage, ServerResponse } from 'http'

export default async (req: IncomingMessage, res: ServerResponse) => {
  console.log(req.headers)
}
```

## useFetch/useAsyncData

Nuxt3 ではサーバーからデータを取得する処理として `useFetch`,`useLazyFetch`,`useAsyncData`,`useLazyAsyncData` が使えます。

`Lazy` という名前がついている関数の違いはデータ取得ときに画面描画をブロックするかどうかです。`useFetch`,`useAsyncData` はデータの取得が完了するまでページ遷移を完了させないですが、`useLazyFetch`,`useLazyAsyncData` はデータの取得状況と関係なくページ遷移を完了させます。

`useFetch` は `$fetch` の利用に特化した `useAsyncData` のラッパー関数です。

つまりは、以下の2つは行は同等の処理を実行します。

```ts
const { data } = await useAsyncData('count', () => $fetch('/api/users'))
const { data } = await useFetch('/api/users'))
```

`useFetch` の返り値の `data` は `ref()` に包まれたデータとして返却されるのでリアクティブな値として使用できます。
`useFetch` を使えば以下のように簡単にデータ取得処理を記述することができます。`API Routes` で作成したユーザー一覧を取得します。

```ts
<script setup lang="ts">
const { data: users } = await useFetch("/api/users/1");
</script>

<template>
  <h1>ユーザー覧</h1>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.username }}
    </li>
  </ul>
</template>
```

ちなみに `server/api` で作成した API からデータを取得する場合には `useFetch` の返り値に自動的に型がつきます。なにこれすごい。

![スクリーンショット 2021-12-12 18.11.30](//images.ctfassets.net/in6v9lxmm5c8/79UtnDyK90j8LFY8EMulo0/abb5e3afce37ff460be757f8dca5df50/____________________________2021-12-12_18.11.30.png)

### Pick

`useFetch`,`useAsyncData` はオプションを指定することでもっとすごいこともできます。
まずは `pick` オプションです。レスポンスがオブジェクトの場合に限り、配列でプロパティ名を指定し GraphQL のように取得するデータを絞り込むことができます。（配列でデータを取得するときにも指定できたら嬉しかった、、、）

```vue
<script setup lang="ts">
const { data: user } = await useFetch("/api/users", {
  pick: ["id", "name", "email", "phone"],
});
</script>

<template>
  <h1>{{ user.name }}</h1>
  <ul>
    <li>Email: {{ user.email }}</li>
    <li>Phone: {{ user.phone }}</li>
  </ul>
</template>
```

### transform

取得したデータを変換関数を受け取ります。以下の例では全てのユーザーの `username` を大文字に変換する処理を実行します。

```vue
<script setup lang="ts">
const { data: users } = await useFetch("/api/users", {
  transform: (res) => {
    return res.map((user) => ({
      ...user,
      username: user.username.toUpperCase(),
    }));
  },
});
</script>

<template>
  <h1>ユーザー覧</h1>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.username }}
    </li>
  </ul>
</template>
```

## useState

どこかで聞いたことがあるような関数名ですが `useState` は SSR に適した状態管理を行います。

Vue3 での Composition API ではコンポーネント外にリアクティブなデータを定義して状態を管理できることが特徴の一つでした。これにより `vuex` などの状態管理ライブラリに頼らずとも簡単な状態管理を記述することができました。

以下の例では `useCounter` を呼び出すことで `count` の状態をコンポーネント間で共有することができます。

- composables/useCounter.ts

```ts
const count = ref(0)

const useCounter = () => {
  const increment = () => count.value++

  const decrement = () => count.value--

  return {
    count: readonly(count),
    increment,
    decrement
  }
}

export default useCounter
```

これはコンポーネント内では次のように呼び出して使用します。

```vue
<script setup lang="ts">
import useCounter from "~~/composables/useCounter";

const { count, increment, decrement } = useCounter();
</script>

<template>
  <h1>{{ count }}</h1>
  <button @click="increment">+</button>
  <button @click="decrement">-</button>
</template>
```

このコードは通常の Vue3 アプリケーションで使用する分には問題ありませんが **Nuxt などの SSR を提供するフレームワークで使用すると問題になります。**

コンポーネント外 `ref()` でリアクティブなデータ定義した場合その状態はアプリケーションに訪れる全てのユーザー間で共有されてしまうため、メモリリークにつながる恐れがあります。

Nuxt では `setup` 関数外では `ref()` を使用してはいけません。

上記のように Nuxt では `ref()` を使用して状態管理をすることができないのでその代わりに使用するのが `useState` ということです。

`useState` は引数として一意となるキーと初期値を返す関数を受け取ります。`useState` の返す値は `Ref` で包まれているので `ref()` で定義したときと同じ用意使えます。

```ts
const useCounter = () => {
  const count = useState('count', () => 0)

  const increment = () => count.value++

  const decrement = () => count.value--

  return {
    count: readonly(count),
    increment,
    decrement
  }
}

export default useCounter
```

`ref()` を使用するときには状態を共有するために `useCounter` 関数の外で定義していましたが `useState` では `uesCounter` 関数内で定義してもその状態を共有することができます。

## Composables directory

Vue3 Composition API ではカスタムフックを慣例的に `composables` ディレクトリ配下に配置しますが Nuxt3 では `composables` ディレクトリは特別な意味を持っています。

`composables` ディレクトリ配下で名前付エクスポートまたはデフォルトエクスポートした関数は コンポーネント内で `import` せずに使うことができます。

- composables/useFoo.ts

```ts
export const useHoge = () => {
  return 'hogehoge'
}

export default () => {
  return 'foobar'
}
```

- pages/index.vue

```vue
<script setup lang="ts">
const hoge = useHoge();
const foo = useFoo();
</script>

<template>
  <h1>{{ hoge }}{{ foo }}</h1>
</template>
```

## Plugins directory

`plugins` ディレクトリに配置したファイルは `nuxt.config.ts` に登録する必要がなく使うことができるようになりました。
また ファイル名に `.client` を付与するとブラウザのみ、 `.server` を付与すると サーバーのみで実行されます。

- plugins/hello.server.ts

```ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  console.log('hello')
})
```

- plugins/world.client.ts

```ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  console.log('world')
})
```

`Plugins directory` は全てのリクエストの前に実行されるので Nuxt2 の `Middleware` の代わりとして使うことができます。(`Middleware` は廃止されました)

また `nuxtApp.hook()` はコールバックに渡した関数を以下の指定した Nuxt ライフサイクルで実行することができます。

- app:beforeMounnt
- app:created
- app:mounted
- app:rendered
- meta:register
- page:start
- page:finish

```ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.hook('app:mounted', () => console.log('App mounted!'))
})
```

### provide

プラグイン内部では `provide` というプロパティを持つオブジェクトを `return` することで Nuxt アプリケーション全体に `provide` したヘルパーを提供することができます。

- plugins/http.ts

```ts
import { defineNuxtPlugin } from '#app'
import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 5000
})

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      http: instance
    }
  }
})
```

`provide` したヘルパーは `useNuxtApp` の返り値として使うことができます。

```ts
<script setup lang="ts">
const { $http } = useNuxtApp()

const { data } = await $http.get('/users')
</script>
```

さらにすごいことに `provide` したヘルパーは自動的に型がつけられています。

![スクリーンショット 2021-12-12 20.25.01](//images.ctfassets.net/in6v9lxmm5c8/hOrncUxuHuOwZmPtxlwjO/9449fcdbeec0ccc624e31e9d89878165/____________________________2021-12-12_20.25.01.png)

## 感想

1年前に Nuxt で作成したアプリケーションが古代遺物になってしまった...
TypeScript 入れるのに複雑な設定しなくていいし `useFetch` で型が付くのとか結構すごくて TypeScript と相性が悪いのはもはや過去の話となりましたね。

Next.js にあった機能もいろいろ入ってきてる感じですね。

一つ思ったのは auto-import だったり Nuxt のコア機能は明示的に `import` しないで使える関数が多いと感じましたね。こういう暗黙的な挙動はあまり好きではないのですが、やっぱみんな楽できるのがよいのでしょうか。

