---
id: 4nQbFvBqIwCqSUmpb3wThQ
title: "Vue2のプロジェクトをVue3へマイグレーションsする"
slug: "vue2-vue3"
about: "Vue 3が正式リリースされてから約1年が経過しました。  Vuetifyのリリース目標である2021年Q3も近づく中でそろそろVue3へのアップデートを検討されている方もいらっしゃることでしょうか？  この記事ではVue 2からVue 3への移行手順を記述していきます。"
createdAt: "2021-09-12T00:00+09:00"
updatedAt: "2021-09-12T00:00+09:00"
tags: ["Vue.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/KlxddWUk3mnLDCFG4qxu2/f36940cc38418e433c2b6be88032e44c/articles_2FuOVZsTkluuNqWfpBJSFq_2Fthumbnail_7D.png"
  title: "Vue.js"
published: true
---
Vue 3 が正式リリースされてから約 1 年が経過しました。

Vuetify のリリース目標である 2021 年 Q3 も近づく中でそろそろ Vue3 へのアップデートを検討されているほうもいらっしゃることでしょうか？

この記事では Vue 2 から Vue 3 への移行手順を記述します。

参考用のプロジェクトとして以下レポジトリを用意しました。

https://github.com/azukiazusa1/vue3-migrate-test

Vue 2 からの移行を体験してみたい場合には、`vue-todo-app` のタグにチェックアウトしてください。

# 移行ビルドを使用する

Vue 2 から Vue 3 へ移行するためのツールとして、公式から[@vue/compat](https://www.npmjs.com/package/@vue/compat)が提供されています。

`@vue/compat` を使用すると、Vue 2 モードで動作するため、Vue 3 で削除や非推奨になった API も一部の例外を除いてそのまま使用できます。Vue3 で削除で非推奨になった機能は実行時に警告が出力されるようになります。この動作は、コンポーネントごと有効と無効を設定することもできます。

移行ビルドは将来のマイナーバージョン（2021 年の年末移行）で終了する予定なので、それまでに標準ビルドへの切り替えを目指す必要があります。

またアプリケーションの規模が大きく複雑な場合には移行ビルドを使用しても移行困難な場合があります。バージョン 2.7 のリリース（2021 年第 3 四半期後半に予定）で Composiiton API やその他の Vue 3 の機能が利用できる予定ですので、Vue 3 へ移行をしない選択肢もあるでしょう。

## 注意事項

現在次のような制限事項が存在しているため、マイグレーションツールを適用できない可能性があります。

- [Vuetify](https://vuetifyjs.com/en/)・[Quasar](https://quasar.dev/)・[ElemenntUI](https://element.eleme.io/#/en-US)などのコンポーネントライブラリに依存している場合。Vue 3 と互換性のあるバージョンがリリースされることを待つ必要があるでしょう。
- IE11 サポート。Vue 3 は IE11 にサポートを中止しているので、IE11 のサポートの必要がある場合には Vue 3 への移行できないでしょう。
- Nuxt.js。Nuxt 3 のリリースを待ちましょう。

## アップグレードの実施

それでは実施に Vue 2 のアプリケーションを Vue 2 へ移行する手順を実施してみましょう。

### 非推奨スロット構文の削除

移行手順を実施する前の手順として、2.6.0 で非推奨となった[スロット構文](https://jp.vuejs.org/v2/guide/components-slots.html#%E9%9D%9E%E6%8E%A8%E5%A5%A8%E3%81%AE%E6%A7%8B%E6%96%87)を削除する必要があります。

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/513bee9967ec9af2633af3697632181704cf01ff)

- src/components/TodoForm.vue

```diff
<app-button>
-  <template slot="text">更新する</template>
+  <template v-slot:text>更新する</template>
</app-button>
```

### ツールのインストール

必要に応じてツールをアップグレードします。
参考用のプロジェクトでは `vue-cli` を使用しているので、`vue upgrage` で最新の `@vue/cli-service` アップグレードします。

```sh
$ vue upgrage
```

今回はすでに最新の `vue-cli` を使用していたので差分は特にありません。

続いて以下のバージョンのパッケージをインストールします。

- `vue` => 3.1
- `@vue/compat` => 3.1（`vue` と同じバージョン）
- `vue-template-compiler` => `@vue/compiler-sfc@3.1.0` に置き換える

```sh
$ npm i vue@3.1 @vue/compat@3.1
```

```sh
$ npm i -D @vue/compiler-sfc@3.1.0
```

```sh
$ npm uninstall vue-template-compiler -D
```

!> `vue-compiler-sfc` の 3.2.x を使用していると `Uncaught TypeError: Object(...) is not a function` のようなエラーが発生するので注意します。ここのコミット時点では失敗して 1 時間くらい溶かしました。

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/5e95cd31f65a6f76d564fdef49b5d2e6ff5146a9)

### ビルド設定の修正

ビルド設定で、`vue` を `@vue/compat` にエイリアスし、Vue のコンパイラオプションで compat モードを有効にします。

`vue-cliP でのサンプルは以下のとおりです。

- vue.config.js

```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.resolve.alias.set('vue', '@vue/compat')

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        return {
          ...options,
          compilerOptions: {
            compatConfig: {
              MODE: 2
            }
          }
        }
      })
  }
}
```

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/2e10bcc16ca27d4696d4b13b59bc0d2ac1492e8d)

### コンパイルエラーの修正

ここまでの手順を進めたうえで、たくさんのコンパイルエラーに遭遇しています。
それらを 1 つずつ修正していきましょう。

#### eslintの修正

`eslint-plugin-vue` の 7.x をインストールし、`'plugin:vue/vue3-recommended'` に設定を置き換えます。

```sh
$ npm i eslint-plugin-vue@7 -D
```

- .eslintrc.js

```diff
extends: [
-  "plugin:vue/essential",
+  "plugin:vue/vue3-recommended",
  "eslint:recommended",
  "@vue/typescript/recommended",
  "@vue/prettier",
  "@vue/prettier/@typescript-eslint",
],
```

lint を実行してみましょう。いくつかの修正不可能なエラーが出力されますが、後ほど修正します。

```sh
$ npm run lint
```

lint によって自動で修正された項目もあります。
`.sync` 修飾子が削除され、`v-model` に置き換えられた項目ですね。

[コンポーネントでの v-model の使用方法が作り直され、 v-bind.sync が置き換えられました](https://v3.ja.vuejs.org/guide/migration/v-model.html#%E6%A6%82%E8%A6%81)

- src/components/EditTodo.vue

```diff
<todo-form
  @submit="onSubmit"
-  :title.sync="title"
-  :description.sync="description"
-  :status.sync="status"
+  v-model:title="title"
+  v-model:description="description"
+  v-model:status="status
/>
```

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/3699e209d3c2060c2f73e0dc446baed688fe310c)

#### vue-routerのアップグレード

`vue-router` を使用している場合には、v4 へアップグレードします。

```sh
npm i vue-router@4
```

`vue-router` をアップグレードしたことによっていろいろコンパイルエラーが発生しているの修正していきましょう。

##### new VueRouter => createRouter

`VueRouter` はクラスではなくなったので、`new VueRouter()` の代わりに `createRouter` を使用します。

- src/router/index.ts

```diff
- import VueRouter, { RouteConfig } from "vue-router";
+ import { createRouter } from "vue-router";

// 省略

- const router = new VueRouter({
+ const router = createRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
```

#### mode: history => history: createWebHistory()

`mode` オプションは削除され、`history` に置き換わります。`mode` に `history` を指定していた場合には、`createWebHistory()` を指定します。
また `base` オプションは、`createWebHistory()` の引数として受け取るようになります。

- src/router/index.ts

```diff
- import { createRouter } from "vue-router";
+ import { createRouter, createWebHistory } from "vue-router";

// 省略

const router = createRouter({
-  mode: "history",
-  base: process.env.BASE_URL,
+  history: createWebHistory(process.env.BASE_URL),
  routes,
});
```

##### RouteConfig => RouteRecordRaw

これはそのまま TypeScript のタイプの名前の変更です。

- src/router/index.ts

```diff
- import { createRouter, createWebHistory } from "vue-router";
+ import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

Vue.use(VueRouter);

- const routes: Array<RouteConfig> = [
+ const routes: Array<RouteRecordRaw> = [
```

##### Vue.use(VueRouter)の削除

`Vue.use(VueRouter)` は不要なので削除します。（後ほど正しい router の登録方法に置き換えます）

- src/router/index.ts

```diff
- import Vue from "vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

- Vue.use(VueRouter);
```

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/30265d1485c44703e41bdf5cf89809ed361f302b)

#### vuexのアップグレード

`vuex` も同様に v4 へアップグレードします。

```sh
$ npm i vuex@4
```

`vue-router` に比べて差分は少ないので 1 つにまとめてしまいます。
`new Vuex.Store` の代わりに `createStore` を使用するのと、`Vue.use(Vuex)` を削除します。

- src/store/index.ts

```diff
- import Vue from "vue";
- import Vuex from "vuex";
+ import { createStore } from "vuex";
import todos from "@/store/todos/index";

- Vue.use(Vuex);

export default createStore({
  modules: {
    todos,
  },
});
```

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/f2df7750e2553511e9bfd047ede15d60a71240f2)

#### `Vue` グローバルAPIの修正

Vue 3 の大きな変更点の 1 つとして、`Vue` グローバルインスタンスが廃止になった点があります。

例えば、`new Vue({})` は `createApp` に、`Vue.use()` は `app.use()` に置き換わります。（`app` は `createApp` によって生成されたインスタンスです）

また `Vue.config.productionTip` は廃止になっています。

##### `main.ts` の修正

まずは `main.ts` を修正します。

- src/main.ts 修正前

```ts
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

- src/main.ts 修正後

```ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App)

app.use(router)
app.use(store)

app.mount("#app")
```

型エラーが発生するので `shims-vue.d.ts` もついでに修正しておきます。

- 修正前

```ts
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
```

- 修正後

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}
```

##### Vue.extendの削除

`Options API` で TypeScript を使っていた場合、`Vue.extend` を使ってコンポーネントの型推論を提供していました、これも削除されています。
代わりに `defineComponent` を使用します。

コンポーネントすべて置き換える必要があるのでかなり面倒ですね。.。

```ts
- import Vue from "vue";
+ import { defineComponent } from "vue";

- export default Vue.extend({
+ export default defineComponent({
```

##### $storeの型定義

`this.$store` の型定義が失われているので、`vuex.d.ts` ファイルを作成して `this.$store` に型定義を与えます。

```ts
import { Store } from "vuex";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
  }
}
```

#### `$listeners` の削除

`$listeners` オブジェクトは Vue 3 で削除され、単に `$attrs` オブジェクトの一部になりました。

- src/components/AppInput.vue

```vue
<template>
  <label>
    {{ label }}
    <input id="input" v-bind="$attrs" />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: "",
    },
  },
});
</script>
```

#### フィルターの削除

Vue 3 ではフィルター構文が削除されました。
代わりに単純なメソッドか算出プロパティに置き換えます。

- src/components/TodoItem.vue 変更前

```vue
<template>
  <div class="card">
    <div>
      <span class="title">
        <router-link :to="`todos/${todo.id}`">{{ todo.title }}</router-link>
      </span>
      <span class="status" :class="todo.status">{{ todo.status }}</span>
    </div>
    <div class="body">作成日：{{ todo.createdAt | formatDate }}</div>
    <hr />
    <div class="action">
      <button @click="clickDelete">削除</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Todo } from "@/repositories/TodoRepository/types";

export default defineComponent({
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  filters: {
    formatDate(date: Date): string {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },
  },
  methods: {
    clickDelete() {
      this.$emit("delete", this.todo.id);
    },
  },
});
</script>
```

- src/components/TodoItem.vue 変更後

```vue
<template>
  <div class="card">
    <div>
      <span class="title">
        <router-link :to="`todos/${todo.id}`">{{ todo.title }}</router-link>
      </span>
      <span class="status" :class="todo.status">{{ todo.status }}</span>
    </div>
    <div class="body">作成日：{{ formatDate }}</div>
    <hr />
    <div class="action">
      <button @click="clickDelete">削除</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Todo } from "@/repositories/TodoRepository/types";

export default defineComponent({
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  computed: {
    formatDate(): string {
      const { createdAt } = this.todo;
      return `${createdAt.getFullYear()}/${
        createdAt.getMonth() + 1
      }/${createdAt.getDate()}`;
    },
  },
  methods: {
    clickDelete() {
      this.$emit("delete", this.todo.id);
    },
  },
});
</script>
```

#### [<template v-forの使用](https://v3.ja.vuejs.org/guide/migration/key-attribute.html#template-v-for-%E3%81%AE%E4%BD%BF%E7%94%A8)

`VueCompilerError: <template v-for> key should be placed on the <template> tag.`

Vue 2 では `<template>` タグに `key` を含めることができなかったため、それぞれの子要素に `key` を配置していました。Vue 3 では `<template>` タグに `key` を含めることができるようになったのでこれを修正します。

- src/pages/TodoList.vue

```diff
- <template v-for="(todo, index) in todos">
-   <span :key="`index-${todo.id}`">{{ index + 1 }}</span>
-   <todo-item :todo="todo" :key="`item-${todo.id}`" @delete="deleteTodo" />
+ <template v-for="(todo, index) in todos" :key="todo.id">
+   <span>{{ index + 1 }}</span>
+   <todo-item :todo="todo" @delete="deleteTodo" />
```

ここまでの手順で問題なくアプリケーションが動作してるかと思います🎉。

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/a6375bc3da683f365e4cdb78e20053df15d539c9)

### 個々の警告の修正

`@vue/compat` によってアプリケーションは動作していますが、完全に Vue 3 へ移行するためには warning レベルのエラーも修正する必要があります。

![スクリーンショット 2021-09-12 14.18.22](//images.contentful.com/in6v9lxmm5c8/4w6yp8WBDpUk7UQmT8zyF5/14a6c54420d1c971749c0e15a80e05ee/____________________________2021-09-12_14.18.22.png)

試しに 2 つ目の `deprecation COMPONENT_V_MODEL` を修正しましょう。
これは、カスタムコンポーネントで `v-model` を使用する際にプロパティとイベント名が変更になったものです。

- プロパティ： value -> modelValue
- イベント： input -> update:modelValue

以下のように修正しました。

- src/components/AppInput.vue

```vue
<template>
  <label>
    {{ label }}
    <input
      :value="modelValue"
      @input="(e) => $emit('update:modelValue', e.target.value)"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
});
</script>
```

すると、新たな警告が出力されます。

![スクリーンショット 2021-09-12 14.26.05](//images.contentful.com/in6v9lxmm5c8/3U3P7boN3xmsDY22crK1g6/f9c263375a916562c5e6058378d26e21/____________________________2021-09-12_14.26.05.png)

現在 Vue 2 のモードで動作させているものの Vue 3 の構文を使用しているために発生しているエラーです。
これを取り除くために `compatConfig` のオプションを修正します。

- src/components/AppInput.vue

```diff
import { defineComponent } from "vue";
export default defineComponent({
+  compatConfig: {
+   COMPONENT_V_MODEL: false,
+  },
  props: {
    modelValue: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
  },
});
```

`compatConfig` に `COMPONENT_V_MODEL: false` を追加しました。上記のように、コンポーネントごとに Vue 3 の動作をオプトインすることが可能です。

コンポーネント単位ではなく、グローバル設定で変更することも可能です。

```js
import { configureCompat } from 'vue'

// 特定の機能のために compat を無効にする
configureCompat({
  FEATURE_ID_A: false,
  FEATURE_ID_B: false
})
```

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commit/fef75ab94f402573f728811f3e90eed2278295d1)

### 完全な移行

すべての警告を削除できたら、移行ツールを取り除くことができます！

```sh
$ npm uninstall @vue/compat
```

- vue.config.js

```js
// vue.config.js
module.exports = {};
```

[コミットログ](https://github.com/azukiazusa1/vue3-migrate-test/commits?author=azukiazusa1)

# 参考

- [Vue 3の変更点](https://v3.ja.vuejs.org/guide/migration/introduction.html#%E6%A6%82%E8%A6%81)
- [Vue Router 移行ガイド](https://next.router.vuejs.org/guide/migration/index.html)
- [Vuex 移行ガイド](https://next.vuex.vuejs.org/guide/migrating-to-4-0-from-3-x.html) 
