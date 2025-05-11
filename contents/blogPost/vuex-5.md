---
id: 3fFqhHW97Bhoup0vUTo3RV
title: "Vuex 5 でどのように変わるのか。"
slug: "vuex-5"
about: " 現在リリースされている最新のバージョンは Vuex 4 です。 これは Vuex 3 と互換性のあるバージョンで Vue 3 で使用するためのものであり、 Vuex 3 と同じ API となっています。  Vuex 5 は Vue 3 において　Composition API による Reactivity API が登場したことにより Reactivitty API によってどのように Vuex をどうさせるか再考されたバージョンとなっています。"
createdAt: "2021-09-26T00:00+09:00"
updatedAt: "2021-09-26T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/KlxddWUk3mnLDCFG4qxu2/f36940cc38418e433c2b6be88032e44c/articles_2FuOVZsTkluuNqWfpBJSFq_2Fthumbnail_7D.png"
  title: "Vue.js"
audio: null
selfAssessment: null
published: true
---
x> この記事の内容は RFC 段階のものであり、将来によって機能が変更になる可能性があります。

## はじめに

現在リリースされている最新のバージョンは Vuex 4 です。
これは Vuex 3 と互換性のあるバージョンで Vue 3 で使用するためのものであり、 Vuex 3 と同じ API となっています。

そのために現状 Vuex の問題点としてよくあげられている TypeScript サポートの問題点を解決できていません。

Vuex 5 は Vue 3 において　Composition API による Reactivity API が登場したことにより Reactivitty API によってどのように Vuex をどうさせるか再考されたバージョンとなっています。

Vuex 5 は以下の点にフォーカスしています。

- グローバルな状態を定義する
- コードの分割
- SSR サポート
- Vue Devtools のサポート
- 拡張性

「グローバルな状態を定義する」「コードの分割」という点に関しては Vuex を利用せずとも Composition API を利用することである程度簡単に達成できるかとは思います。特に Vuex が目指してのはその他の項目のサポートであり、また基本的な状態管理の機能公式のプラグインとして提供することで我々開発者がコアな機能の開発に集中できることです。

## Vuex 5 の新機能

Vuex 5 の新機能として以下が上げられます。

- Options API と　Composition API の両方をサポートする
- 完璧な TypeScript サポート
- ミューテーションの廃止
- ネストされたモジュールの廃止
- 自動的なコードの分割

### ミューテーションの廃止

一番インパクトの大きい変更点はミューテーションの廃止でしょうか？確かに今まで Vuex こコードを書いてきた中においてもミューテーションは単なるセッターとしてのボイラープレートであることが多かったので、妥当な変更なのかもしれません。この変更により、ステートの変更はアクションによのみ変更されるようになります。

Vuex はもともと [Flux](https://facebook.github.io/flux/docs/overview/) などから影響を受けて誕生したましたが、 Flux のアーキテクチャからは脱却するようです。

### ネストされたモジュールの廃止

Vuex では namespace を切ってモジュールごとに管理でき、またネストされたモジュールを定義することも可能でした。

しかし、ネストされたモジュールは TypeScript によって型定義をするのが困難であるため Vuex 5 ではネストされたモジュールは廃止されます。

ネストされたモジュールに相当する機能を利用したい場合には後述する `Store Composition` と呼ばれるパターンを使用します。

### 自動的なコードの分割

後のチュートリアルでもでてきますが Vuex 5 では Vuex インスタンスを作成する際にモジュールを一括で登録するのではなく、コンポーネントごとにストアを登録するようになります。

これにより使用されていないストアをバンドルファイルから取り除くことができるなど webpack などの Tree Shaking においてメリットが得られます。

## Vuex 5 のチュートリアル

Vuex 5 の基本的な使用方法を見ていきましょう。 Vuex 5 におけるストアの定義方法と使用方法は Options API による方法と Composition API による方法の 2 つに大別されます。

### Options API

#### ストアの定義

まずは Options API によるストアの定義方法です。 `defineStore()` という関数を利用してストアを定義します。

```typescript
import { defineStore } from 'vuex'

const useTodo = defineStore()
```

`defineStore()` の返り値がストアとなるのですが、 Composition API に合わせて `useXXX` と命名することが推奨されています。

##### key プロパティの定義

まず初めに `key` と呼ばれるプロパティを定義する必要があります。これはストアを特定するために使用されるため、ストア全体で一意の名前にする必要があります。従来の `namespace` に近いものでしょう。

```typescript
import { defineStore } from 'vuex'

const useTodo = defineStore({
  key: 'todo'
})

export default useTodo
```

##### state の定義

次に `state` を定義しましょう。これは従来の Vuex のステートと同じく現在の状態を保持します。変更点としてはコンポーネントの `data` プロパティのようにオブジェクトを返す関数として定義する必要があります。

```typescript
import { defineStore } from 'vuex'

const useTodo = defineStore({
  key: 'todo',

  state() {
    return {
      todos: []
    }
  }
})

export default useTodo
```

##### getters の定義

こちらも従来の Vuex のゲッターと同様です。変更点として従来のゲッターはメソッドの引数として　`state` を受け取りその値を返していたのに対して Vuex 5 では `this` を通して `state` にアクセスするようになっています。

```typescript
import { defineStore } from 'vuex'

const useTodo = defineStore({
  key: 'todo',

  state() {
    return {
      todos: []
    }
  },

  getters: {
    completedTodos() {
      return this.todos.filter(todo => todo.comleted)
    }
  }
})

export default useTodo
```

##### actions の定義

最後にアクションです。ミューテーションが廃止されたのでアクションから直接 `state` を変更します。ゲッターと同様に `this` を通じて `state` へアクセスします。

```typescript
import { defineStore } from 'vuex'

const useTodo = defineStore({
  key: 'todo',

  state() {
    return {
      todos: []
    }
  },

  getters: {
    completedTodos() {
      return this.todos.filter(todo => todo.comleted)
    }
  },

  actions: {
    async fetchTodos() {
      const result = await fetch(`/api/todos`)
      this.todos = await result.json()
    }
  }
})

export default useTodo
```

#### ストアの使用

ストアを定義しただけではまだ使用できないので、定義したストアを使用できるようにする必要があります。

ストアを利用するためにはまず `createVuex()` 関数により Vuex のインスタンスを生成します。その後 Vuex のインスタンスにさきほど定義したストアを登録します。

```typescript
import { createVuex } from 'vuex'
import useTodo from './todo'

const vuex = createVuex()

cosnt todo = vuex.store(useTodo)
```

ストアを登録した後は以下のように使用できます。

```typescript
todo.todos // state へのアクセス

todo.completedTodos // getters へのアクセス

await todo.fetchTodos() // action の呼び出し
```

従来のゲッターやアクションの呼び出しと比べて純粋な JavaScript のオブジェクトとして呼び出すことができます。そのため、 TypeScript による型に守れてた呼び出しが可能です。

#### コンポーネント内でストアを使用する

続いてコンポーネント内でストアを使用する方法です。従来の方法と同じように `app.use()` で Vuex インスタンスを登録します。

```typescript
import { createApp } from 'vue'
import App from '.App.vue'
import { createStore } from 'vuex'

const app = createApp(App)

app.use(store)

app.mount('#app')
```

Vue アプリケーションに Vuex を登録するときにはまだ定義したストアを登録をしません。ストアの登録はコンポーネント内で行います。

```typescript
import { defineComponent } from 'vue'
import useTodo from './todo'

export default defineComponent({
  computed: {
    todo() {
      return this.$vuex.store(useTodo)
    }
  }
})
```

また `mapStores` ヘルパー関数を使用すれば簡単にストアを登録することもできます。

```typescript
import { defineComponent } from 'vue'
improt { mapStores } from 'vuex'
import useTodo from './todo'

export default defineComponent({
  computed: {
    ...mapStores({
      todo: useTodo
    })
  }
})
```

#### Composition API 

続いて Composition API によるストアの定義方法です。こちらは従来のストアの定義方法とは大きく異なり、 `composition API` を利用したストアの定義となっています。これはコンポーネントの `setup` 内のロジックをそのまま抽出したようなイメージですね。

```typescript
import { ref, computed } from 'vue'
import { defindStore } from 'vuex'

const useTodo = defineStore('todo', () => {
  const todos = ref([])

  const completedTodos = computed(() => todo.value.filter(todo => todo.completed))

  const fetchTodo = () => {
    const result = await fetch(`api/todos`)
    todos.value = await result.json()
  }

  return {
    todos,
    computedTodos,
    fetchTodo
  }
})

export default useTodo
```

`defineStore()` 関数は第一引数に `key` を、第二引数にコールバック関数を受け取ります。コールバック関数の内部は Composition API の `setup` 関数とまったく同じです。

#### コンポーネント内で使用

コンポーネント内での使用は簡単で Vue アプリケーションに登録する必要はありません。 `setup` 関数内で `useTodo` を呼び出すだけで使用できます。

```typescript
import { defineComponent } from 'vue'
import useTodo from './todo'

export default defineComponent({
  setup() {
    const todo = useTodo()

    return {
      todo
    }
  }
})
```

これは Cpmposition API によって定義された Composable 関数使用するときと全く同じように使用できます。

## Store Composition

Vuex 5 ではモジュールと呼ばれる概念がありません。Vuex のストア内で他のストアを利用する手段として `store Composition` パターンが紹介されています。これは従来のネストされたモジュールであったり `rootState` や `rootGetters` の代わりに使用されるものです。

### Options API 

まずは Options API による方法です。 `use` プロパティによって他のストアを定義することでそのストアを利用できます。

下記の例では `todo` ストア内で `auth` ストアを利用しています。

```typescript
// auth.ts
import { defindStore } from 'vuex'

const useAuth = defineStore({
  key: 'auth',

  state() {
    return { 
      user: null
    }
  },

  action() {
    async fetchUser() {
      const result = fetch(`/api/me`)
      this.state = await result.json()
    }
  }
})

export default useAuth
```

```typescript
// todo.ts
import { defineStore } from 'vuex'
import useAuth from './auth'

const useTodo = defineStore({
  key: 'todo',

  use() {
    return {
      auth: useAuth
    }
  },

  state() {
    return {
      todos: []
    }
  },

  getters: {
    completedTodos() {
      return this.todos.filter(todo => todo.comleted)
    },
    params() {
      if (!this.auth.user) return ''
      const params = new URLSearchParams({ user_id: this.auth.user.id })
      return `?${params}`
    }
  },

  actions: {
    async fetchTodos() {
      const result = await fetch(`/api/todos${this.params}`)
      this.todos = await result.json()
    }
  }
})

export default useTodo
```

`use` プロパティで定義したストアは `this` からアクセスできます。後はコンポーネントなどでストアにアクセスするのと変わりありません。

#### Composition API 

Composition API による他のストアの使用はさらにシンプルになっています。他の場所でストアを使用するときとまったく変わりなく使用できます。

```typescript
// todo.ts
import { ref, computed } from 'vue'
import { defindStore } from 'vuex'
import useAuth from './auth'

const useTodo = defineStore('todo', () => {
  const auth = useAuth()

  const todos = ref([])

  const completedTodos = computed(() => todo.value.filter(todo => todo.completed))

  const params = computed(() => {
    if (!auth.user) return ''
    const params = new URLSearchParams({ user_id: auth.user.id })
    return `?${params}`
  })

  const fetchTodo = () => {
    const result = await fetch(`api/todos${params.value}`)
    todos.value = await result.json()
  }

  return {
    todos,
    computedTodos,
    fetchTodo
  }
})

export default useTodo
```

##### Component外でストア使用する場合

上記で定義したストアには 1 点注意点があります。 `defineStore` で定義したストアを `useAuth()` の形で使用していますが、内部的にはこれは [provide/inject](https://v3.ja.vuejs.org/guide/component-provide-inject.html) によって定義されています。

`provide/inject` はコンポーネント内でしか使用できないため、上記で定義したストアはコンポーネント外で使用できなくなってしまいます。

```ts
  const auth = useAuth() // Can't use `inject` here bacause the `useAuth` is called outside of Vue
```

この問題を解決するために `defineStore` のコールバック関数の引数から `use` 関数を受け取り代わりにこれを利用するように修正します。

```diff
 // todo.ts
 import { ref, computed } from 'vue'
 import { defindStore } from 'vuex'
 import useAuth from './auth'

- const useTodo = defineStore('todo', () => {
-  const auth = useAuth()
+ const useTodo = defineStore('todo', ({ use }) => {
+  const auth = use(useAuth)

   const todos = ref([])

   const completedTodos = computed(() => todo.value.filter(todo => todo.completed))

   const params = computed(() => {
     if (!auth.user) return ''
     const params = new URLSearchParams({ user_id: auth.user.id })
     return `?${params}`
   })

   const fetchTodo = () => {
     const result = await fetch(`api/todos${params.value}`)
     todos.value = await result.json()
   }

   return {
     todos,
     computedTodos,
     fetchTodo
   }
 })

 export default useTodo
```

しかし、この構文は少し奇妙でありコンポーネントの `setup` 関数との互換性がなくなってしまいます。

そのため Vuex インスタンスをシングルトンそしてグローバルに登録する構文が提案されているようです。

## 感想

Vuex 5 から従来の Vuex から大きく変えてきましたね。
状態管理のために特別な書き方を要求されるのではなく、コンポーネント内のロジックをそのまま切り出しただけのようなシンプルなものになりました。

Composition API の論理的な関心事に分割するという思想にもマッチしているので Composition API を覚えてしまえばそのまま使用できるのは良い点だと思います。

ただし、従来の Vuex からのマイグレーションはかなり大変そうですね。

Vuex の TypeScript サポートもようやく来たって感じですね。若干他のフレームワークに比べて出遅れてる感は否めないですが今後の動向にも期待しましょう。

## 参考

https://github.com/kiaking/rfcs/blob/vuex-5/active-rfcs/0000-vuex-5.md
https://www.youtube.com/watch?v=WmgQH4pOhUc
