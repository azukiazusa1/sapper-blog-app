---
id: 3TjZO2BYCyyjIxB4sROLYd
title: "Vue.js Composition APIでTODOアプリ作成"
slug: "vue-js-composition-api-todo-app"
about: "Vue3 Composition APIを使って、ハンズオン形式でTODOアプリを作成していきます。"
createdAt: "2020-12-13T00:00+09:00"
updatedAt: "2020-12-13T00:00+09:00"
tags: ["JavaScript", "TypeScript", "Vue.js"]
published: true
---
Vue3 Composition APIを使って、ハンズオン形式でTODOアプリを作成していきます。

前提として、Node.jsが必要ですので下記URLからダウンロードをしておいてください。

[ダウンロード](https://nodejs.org/ja/download/)

また、すべてのコードは以下から参照できます。
https://github.com/azukiazusa1/vue3-todo-app

# Vue CLI のインストール

Vue.jsの開発環境の構築には、Vue CLIを使います。これは、Vue Command Line Interfaceの略で、対話式で開発環境のセットアップを行ってくれる公式のコマンドラインツールです。
下記コマンドからインストールします。

```sh
npm install -g @vue/cli
```

# Vue プロジェクトの作成

インストールが完了したら、早速プロジェクトを作成します。

```sh
vue create vue3-todo-app
```

`vue3-todo-app`の箇所には、自分に好きなプロジェクト名を入力してください。
次のような選択肢が表示されるので、`Manually select features`を選択します。

```sh
? Please pick a preset: 
  Default ([Vue 2] babel, eslint) 
  Default (Vue 3 Preview) ([Vue 3] babel, eslint) 
❯ Manually select features 
```

続く選択肢は次のように回答しました。

```sh
? Check the features needed for your project: 
 ◉ Choose Vue version
 ◉ Babel
 ◉ TypeScript
 ◯ Progressive Web App (PWA) Support
❯◉ Router
 ◯ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
 ◯ E2E Testing
 ? Choose a version of Vue.js that you want to start the project with 
  2.x 
❯ 3.x (Preview) 
? Use class-style component syntax? No
? Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? Yes
? Use history mode for router? (Requires proper server setup for index fallback in production) Yes
? Pick a linter / formatter config: 
  ESLint with error prevention only 
  ESLint + Airbnb config 
❯ ESLint + Standard config 
  ESLint + Prettier 
  TSLint (deprecated) 
? Pick additional lint features: 
 ◉ Lint on save
❯◉ Lint and fix on commit
? Where do you prefer placing config for Babel, ESLint, etc.? 
  In dedicated config files 
❯ In package.json 
? Save this as a preset for future projects? No
```

しばらくすると、インストールが完了して下記のように表示されます。

```sh
🎉  Successfully created project vue3-todo-app.
👉  Get started with the following commands:

 $ cd vue3-todo-app
 $ npm run serve
```

表示されているコマンドを実行してみてください。[localhost:8080](http://localhost:80800)にアクセスして、以下の画面が表示されたらOKです。

```sh
cd vue3-todo-app
npm run serve
```

![スクリーンショット 20201213 21.03.31.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FnimHzkUkY85E4LWkC8eJ%2Fbd86024d1709c846d75c4da79956a420.png?alt=media&token=c6332364-fb52-443d-9bc9-fc7f8f13c2bc)

# 不要なコンポーネントの削除

プロジェクトを作成した際にはじめから存在するHelloWorld.vueなどのコンポーネントは使わないので削除してしまいます。

```sh
rm src/components/HelloWorld.vue 
rm src/views/Home.vue
rm src/views/About.vue
```

App.vueも、以下のように空っぽにします。

```html:src/App/vue
<template>
  <router-view><router-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
})
</script>

```

`src/router/index.ts`も同様にします。

```ts:src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

# ストアを作成する

それではコーディングを始めていきましょう。まずは、状態管理をするためのストアを作成します。これは、現在ストレージに保存されているTODOの一覧を保存して取得する、TODOを作成、削除、更新などの処理を行うモジュールです。

`src/store/todo`フォルダを作成します。

```sh
mkdir sre/store/todo
```

## TODOの型定義を作成

まずはTODOの型定義から作成します。`src/store/todo/types.ts`を作成してそこで型を管理します。

```sh
touch src/store/todo/types.ts
```

型を次のように作成します。このTODOが、今回のアプリで作成するものになります。

```ts:src/store/todo/types.ts
import { DeepReadonly } from 'vue'

export type Status = 'waiting' | 'working' | 'completed' | 'pending'

export interface Todo {
  id: number
  title: string
  description: string
  status: Status
  createdAt: Date
  updatedAt: Date
}

export interface TodoState {
  todos: Todo[]
}

export type Params = Pick<Todo, 'title' | 'description' | 'status'>

export interface TodoStore {
  state: DeepReadonly<TodoState>
  getTodo: (id: number) => void
  addTodo: (todo: Params) => void
  updateTodo: (id: number, todo: Todo) => void
  deleteTodo: (id: number) => void
}

```

TodoStoreインターフェースはこの後作成するストアの型となります。抽象的なインターフェースを定義しておくことによって、ストアをコンポーネントに注入した際に実装を取り替えやすくなります。
`DeepReadonly`は、Composition APIの`readonly`を適応した際のインターフェースです。stateは直接操作させずに、メソッドを利用して変更させることを意図しています。

## ストアの実装

型が決まりましたので、ストアを作り始めましょう。
`src/store/todo/index.ts`ファイルを作成します。

```sh
touch src/store/todo/index.ts
```

実装は次の通りです。

```ts:src/store/todo/index.ts
import { InjectionKey, reactive, readonly } from 'vue'
import { Todo, TodoState, TodoStore } from '@/store/todo/types'

// ①
const mockTodo: Todo[] = [
  {
    id: 1,
    title: 'todo1',
    description: '1つ目',
    status: 'waiting',
    createdAt: new Date('2020-12-01'),
    updatedAt: new Date('2020-12-01'),
  },
  {
    id: 2,
    title: 'todo2',
    description: '2つ目',
    status: 'waiting',
    createdAt: new Date('2020-12-02'),
    updatedAt: new Date('2020-12-02'),
  },
  {
    id: 3,
    title: 'todo3',
    description: '3つ目',
    status: 'working',
    createdAt: new Date('2020-12-03'),
    updatedAt: new Date('2020-12-04'),
  },
]

// ②
const state = reactive<TodoState>({
  todos: mockTodo,
})

// ③
intitializeTodo(todo: Params) {
    const date = new Date()
    return {
      id: date.getTime(),
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: date,
      updatedAt: date,
    } as Todo
  }

// ④
const getTodo = (id: number) => {
  const todo = state.todos.find((todo) => todo.id === id)
  if (!todo) {
    throw new Error(`cannot find todo by id:${id}`)
  }
  return todo
}

// ⑤
const addTodo = (todo: Params) => {
  state.todos.push(intitializeTodo(todo))
}

// ⑥
const updateTodo = (id: number, todo: Todo) => {
  const index = state.todos.findIndex((todo) => todo.id === id)
  if (index === -1) {
    throw new Error(`cannot find todo by id:${id}`)
  }
  state.todos[index] = todo
}

// ⑦
const deleteTodo = (id: number) => {
  state.todos = state.todos.filter((todo) => todo.id !== id)
}

const todoStore: TodoStore = {
  state: readonly(state),
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
}

export default todoStore

// ⑧
export const key: InjectionKey<TodoStore> = Symbol('todo')
```

①まだ永続化の処理を実装していないので、とりあえずモックとしてデータを用意しています。これは後ほど削除して本来の実装と取り替えます。

②`reactive`は、リアクティブなデータを宣言します。宣言をした時点では、まだ`readonly`にはせず、このストア内のメソッドにのみ状態の変更を許可します。

③initializeTodoは、新たに作成されたTODOの初期化処理を行います。これも後ほど本来の実装と取り替えます。

④getTodoは、idを指定して一致するTODOを取得します。

⑤addTodoは、新たにTODOを作成します。

⑥updateTodoは、idを指定して一致するTODOを更新します。

⑦deleteTodoは、idを指定して一致TODOを削除します。

⑧ストアをprovide/injectするために必要なキーを宣言します。InjectionKeyをジェネリクスで型指定をすると、provide/injectionをした際に型検査が効くようになります。

## ストアprovideする

作成したストアをグローバルに利用できるように、ルートコンポーネントにprovideします。
App.vueに次のように追記します。

```diff:src/App.vue
<template>
  <router-view><router-view>
</template>

<script lang="ts">
-- import { defineComponent } from 'vue'
++ import { defineComponent, provide } from 'vue'
++ import TodoStore, { todoKey } from '@/store/todo'

export default defineComponent({
  name: 'App',
++  setup() {
++     provide(todoKey, TodoStore)
++  },
})
</script>
```

先程作成したストアをグローバルモジュールから、キーとストアをインポートします。`setup()`関数内で、`provide()`メソッドを呼び出します。このメソッドは第一引数にストアのキーを、第2引数に注入したいバリューを受け取ります。
`provide()`したコンポーネント以下のコンポーネントにおいて、`inject()`で適切なキーを用いて呼び出せば、注入したバリューが呼び出せるようになります。

# TODO一覧の実装

それでは、とりあえずストアは準備ができたのでようやく画面を実装していきましょう。まずは一覧画面からです。`src/views/todos.vue`を作成します。

```sh
touch src/views/todos.vue
```

## ルーティングに追加
ルーティングに追加しましょう。`src/router/index.ts`を修正します。

```diff:src/views/todos.vue
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
++ import Todos from '@/views/todos.vue'

const routes: Array<RouteRecordRaw> = [
++  {
++    path: '/',
++    name: 'Todos',
++    component: Todos,
++  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

ここまでうまくいっているか確認してみます。`src/views/todos.vue`を以下のように編集します。

```html
<template>TODO一覧です。</template>
```

[localhost:8080](http://localhost:8080)にアクセスしてください。次のように表示されているはずです。

![スクリーンショット 20201213 23.14.29.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FnimHzkUkY85E4LWkC8eJ%2F1dccff75b44bb31f79e2dbdfadd1225d.png?alt=media&token=a87ac6a6-343d-4048-a704-519081c97049)

## ストアのTODO一覧を表示させる

## ストアをインジェクトする

ここからTODOアプリっぽい見た目にしていきます。先ほど作成したストアの内容を表示させてみましょう。まずはprovideしたストアをこのコンポーネントから使用できるようにします。

```html:src/views/todo.vue
<template>TODO一覧です。</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { todoKey } from '@/store/todo'

export default defineComponent({
  setup() {
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    return {
      todoStore,
    }
  },
})
</script>
```

provideしたときと同じキーを用いて`setup()`関数内でinjectします。
取り出した値の型はStore(InjectionKeyのジェネリクスで指定した型) | undefinedですから、型ガードを用いて確認する必要があります。（誤ったキーを渡した場合や、自身より上の階層でprovideされていなかった場合にundefinedが返されます。）

また、`setup`関数内で定義した変数や関数をテンプレート内で利用できるようにするためには、オブジェクトの形式でreturnする必要があります。

### v-forでTODO一覧を表示

これで問題なくストアが利用できるはずです。テンプレート内からストアの値を参照してみます。v-forを使うと、テンプレート内で配列の要素を描画することができます。

```html:src/views/todo.vue
<template>
  <h2>TODO一覧</h2>
  <ul>
    <li v-for="todo in todoStore.state.todos" :key="todo.id">
      {{ todo.title }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { todoKey } from '@/store/todo'

export default defineComponent({
  setup() {
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    return {
      todoStore,
    }
  },
})
</script>
```

次のように描画されるはずです。確認してみましょう。

![スクリーンショット 20201213 23.25.25.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FnimHzkUkY85E4LWkC8eJ%2F0437a85c2435802166cd8d14505436a7.png?alt=media&token=bf25a4eb-22fb-41b1-b032-88c08a6496f5)

確かに、ストア内で定義していたTODO一覧が表示されています。

# TODOを作成する

TODOを作成するためのページを作っていきます。
`src/views/AddTodo.vue`ファイルを作成します。

```sh
touch src/views/AddTodo.vue
```

ルーティングに追加します。`src/router/index.ts`を修正します。

```diff:src/views/AddTodo.vue
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Todos from '@/views/todos.vue'
++ import AddTodo from '@/views/AddTodo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Todos',
    component: Todos,
  },
++   {
++    path: '/new',
++    name: 'AddTodo',
++    component: AddTodo,
++  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

トップページから新規作成ページへ遷移できるようにしておきましょう。
リンクに使うコンポーネントは`router-link`です。`to`に遷移先を指定します。

```diff::src/views/todo.vue
<template>
  <h2>TODO一覧</h2>
  <ul>
    <li v-for="todo in todoStore.state.todos" :key="todo.id">
      {{ todo.title }}
    </li>
  </ul>
++  <router-link to="/new">新規作成</router-link>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { todoKey } from '@/store/todo'

export default defineComponent({
  setup() {
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    return {
      todoStore,
    }
  },
})
</script>
```

## TODO作成ページの実装

実装は以下のようになりました。

```html:src/views/AddTodo.vue
<template>
  <h2>TODOを作成する</h2>
  <form @submit.prevent="onSubmit"> // ①
    <div>
      <label for="title">タイトル</label>
      <input type="text" id="title" v-model="data.title" /> // ②
    </div>
    <div>
      <label for="description">説明</label>
      <textarea id="description" v-model="data.description" /> // ②
    </div>
    <div>
      <label for="status">ステータス</label>
      <select id="status" v-model="data.status"> // ②
        <option value="waiting">waiting</option>
        <option value="working">working</option>
        <option value="completed">completed</option>
        <option value="pending">pending</option>
      </select>
    </div>
    <button @click="onSubmit">作成する</button> // ①
  </form>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Params } from '@/store/todo/types'
import { todoKey } from '@/store/todo'

export default defineComponent({
  setup() {
    const todoStore = inject(todoKey) // ③
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    const router = useRouter() // ④

    const data = reactive<Params>({ // ⑤
      title: '',
      description: '',
      status: 'waiting',
    })

    const onSubmit = () => { // ⑥
      const { title, description, status } = data
      todoStore.addTodo({
        title,
        description,
        status,
      })
      router.push('/')
    }

    return {
      data,
      onSubmit,
    }
  },
})
</script>
```

① フォームがサブミットされたとき、`onSubmit`イベントを呼び出します。`onSubmit`イベントは、コンポーネントの`setup`関数内で定義されています。

② 各入力フォームに、`v-model`で入力された値とコンポーネント上のリアクティブな値をバインディングさせます。フォームへの入力は即座に反映されます。

③ TODO一覧ページと同様に、ストアをinjectします。ここでのストアの利用用途は新たにTODOを新規作成することにとどまるので、**setup関数内で定義されているものの、returnされていないことに注意してください。**コンポーネントは、テンプレートが関心のあるものだけを返すようにします。

④　routerオブジェクトを利用するために、`useRouter()`をインポートして呼び出しています。以前までのVue.jsでは、routerオブジェクトを使うために`this.$router`のように呼び出していました。Composition APIではもはや`this`へアクセスすることはできないので、代わりに`useRouter()`関数を呼び出して使用します。

⑤ このコンポーネント内でのみ利用するリアクティブに値を定義します。これらの値はフォーム入力の値とバインディングされます。

⑥ onSubmit関数で、フォームがサブミットされた際の処理を記述します。ここでは、ストアの`addTodo()`関数を呼び出しTODOを新規作成しています。それが完了したら、`router.push()`を呼び出しTODO一覧ページへ遷移させています。

## 動作確認

それでは実際に試してみます。
適当にフォームに値を入力します。

![スクリーンショット 20201214 23.46.07.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fekd6f7zz3p8eftiFYZef%2Faadcfb6fe8ef34ea6cda549749a2b8fb.png?alt=media&token=8bd96658-1da9-4120-9547-ba0b4b5a0ed3)

作成するボタンを押してみてください。TODO一覧ページへ遷移し、今しがた作成したTODOが追加されているのが確認できるはずです。

![スクリーンショット 20201214 23.47.18.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fekd6f7zz3p8eftiFYZef%2F31d7efc233329a975485229fe288a306.png?alt=media&token=bda52a0c-41eb-42cc-ac77-a761d391d7e8)

# TODO一覧を詳しく実装する

TODOを新たに作成できるところまで進めました。次に更新・削除処理の実装をしていきたおところですがその前にTODO一覧ページを改良してそこから詳細ページへの遷移、削除をできるようにしましょう。

## TodoItemコンポーネントの作成

TODO一覧ページを実装するにあたって、TODOの情報を表示する構成要素をコンポーネントとして切り出して作成しましょう。Vue.jsはこのように表示する構成要素を部品として細かく分割していくのが特徴です。コンポーネントによって一つの画面を小さく分割していくことによって、各コンポーネントがひとつの表示の責務に集中できたり、再利用のしやすい構成になります。

`src/components`フォルダ内に、`TodoItem.vue`ファイルを作成します。

```sh
touch src/components/TodoItem.vue
```

次のように実装しました。

```html:src/components/TodoItem.vue
<template>
  <div class="card">
    <div>
      <span class="title" @click="clickTitle">{{ todo.title }}</span>
      <span class="status" :class="todo.status">{{ todo.status }}</span> // ①
    </div>
    <div class="body">作成日：{{ formatDate }}</div>
    <hr />
    <div class="action">
      <button @click="clickDelete">削除</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Todo } from '@/store/todo/types'
import { computed, defineComponent, PropType } from 'vue'

export default defineComponent({
  props: { // ②
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  emits: ['clickDelete', 'clickTitle'], // ③
  setup(props, { emit }) { // ④
    const clickDelete = () => {
      emit('clickDelete', props.todo.id)
    }

    const clickTitle = () => {
      emit('clickTitle', props.todo.id)
    }

    const formatDate = computed(() => { // ⑤
      return `${props.todo.createdAt.getFullYear()}/${
        props.todo.createdAt.getMonth() + 1
      }/${props.todo.createdAt.getDate()}`
    })

    return {
      clickDelete,
      clickTitle,
      formatDate,
    }
  },
})
</script>

<style scoped>
.card {
  margin-bottom: 20px;
  border: 1px solid;
  box-shadow: 2px 2px 4px gray;
  width: 250px;
}

.title {
  font-weight: 400;
  font-size: 25px;
  padding: 5px;
}

.status {
  padding: 3px;
}

.waiting {
  background-color: #e53935;
}

.working {
  background-color: #80cbc4;
}

.completed {
  background-color: #42a5f5;
}

.pending {
  background-color: #ffee58;
}

.body {
  margin: 5px;
}

.action {
  margin: 5px;
}
</style>
```

① 動的にクラスをバインディングしています。例えば、`todo.status`の値が`wating`だった場合には、次のように描画されます。

```html
<div class="status wating">
```

② propsは、親コンポーネントから子コンポーネントに渡されるデータです。あるコンポーネントから、このTodoItemコンポーネントが利用されるとき、次のようにTODOオブジェクトを渡します。

```html
<todo-item :todo="todo" />
```

親から渡されたデータは、読み取り専用です。子コンポーネントから親のデータを直接書き換えることはできません。
さらに、propsにオプションで型なので制約を追加することができます。
propsの型に指定できるのは、JavaScriptで使用できる`String`や`Number`、`Object`などで、TypeScriptで使用できる型と一致しない点に注意してください。
`Object`という型情報を指定されても余り意味はないので、`PropType`を使ってジェネリクスで詳細な型情報をさらに指定することができます。
`required`が`true`に指定されていると、このコンポーネントを使用する際にpropsとしてデータが渡されたなかったとき警告を発します。（コンパイルエラーにはなりません）
`required`を指定する代わりに、`default`でpropsが渡されなかったときのデフォルトの値を設定することができます。

③ 逆に子コンポーネントから親コンポーネントへデータを受け渡すのがemitです。emitは、親コンポーネントから以下のように受け取ります。

```html
<todo-item @clickDelete="clickDelete" />
```

以前までは、emitは指定することなく使えましたが、Vue3からはemitする可能性があるものを明示的に列挙するようになりました。

④ setup関数の第一引数からpropsが、第二引数のcontextオブジェクトからemitが受け取れます。

⑤ 日付をフォーマットする関数としてをcomputed関数として定義しています。
computed関数は、中で利用されているリアクティブな値が更新されたときのみ、計算結果が再評価されます。

次のような見た目になりました。

![スクリーンショット 20201216 0.29.26.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FtKzA4bPWlHNwEf0yObgr%2F9106517738effd5008517b583d303870.png?alt=media&token=0ab863c1-f88d-4dd3-96b8-35ee244df2b5)

これでも十分なのですが、少しリファクタリングをしましょう。

`setup()`メソッド内にある`formatDate`関数に注目してください。機能自体は、「日付をフォーマットして返す」という一点に集中していますが、`props.todo.createdAt`という外部の値に依存しており扱いにくくなっています。使い回しがしにくいですし、テストもしづらくなっています。この関数をもっと汎用的に、引数としてリアクティブな`Date`オブジェクトを受け取りフォーマットして返すようにしましょう。

`props.todo.createdAt`を引数として渡せるように、`computed()`を更に関数で包み込みます。

```ts:src/components/TodoItem.vue
import { computed, defineComponent, isRef, PropType, Ref, ref } from 'vue'

   const useFormatDate = (date: Date | Ref<Date>) => {
      const dateRef = isRef(date) ? date : ref(date) // ①
      return computed(() => {
        return `${dateRef.value.getFullYear()}/${ // ②
          dateRef.value.getMonth() + 1
        }/${dateRef.value.getDate()}`
      })
    }

    const formatDate = useFormatDate(props.todo.createdAt) // ③
```

① `useFormatDate`関数は、リアクティブな要素とそうでない要素どちらも受け取ります。受け取った要素がリアクティブかどうかは`isRef()`関数で判断します。リアクティブな様相でなかった場合、`ref()`関数でリアクティブ化してから使用します。

② 今まで使っていた`reactive()`はオブジェクトをリアクティブ化するのに対し、`ref()`は値をオブジェクト化します。`ref()`でリアクティブ化した値にアクセスするためには`refValue.value`のようにアクセスします。

③ `useFormatDate`関数に引数として`props.todo.createdAt`を渡したものは、今までの`formatDate`関数と変わらず利用できます。

これで外部に値への依存はなくなりました。フォーマットする対象は外部から注入することになります。さて、ここまで機能を分割してあげればこのロジック単体を`setup()`関数内から切り出してモジュールとして定義させてあげることができます。そうすれば、どこからでもこの関数を呼び出して使用することができます。

`src/composables`フォルダを作成し、その中に`use-formate-date.ts`ファイルを作成しましょう。
このように切り出された関数は`composables`フォルダに配置し、ファイル名は`use-`を付けつのが慣習のようです。

```sh
mkdir src/composables
touch src/composables/use-formate-date.ts
```

先程の関数をそのまま移植しましょう。

```ts:src/composables/use-formate-date.ts
// src/composables/use-formate-date.ts
import { Ref, isRef, ref, computed } from 'vue'

export const useFormatDate = (date: Date | Ref<Date>) => {
  const dateRef = isRef(date) ? date : ref(date)
  return computed(() => {
    return `${dateRef.value.getFullYear()}/${
      dateRef.value.getMonth() + 1
    }/${dateRef.value.getDate()}`
  })
}
```

```ts:src/components/TodoItem.vue
import { Todo } from '@/store/todo/types'
import { defineComponent, PropType } from 'vue'
import { useFormatDate } from '@/composables/use-formate-date'
export default defineComponent({
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true,
    },
  },
  emits: ['clickDelete', 'clickTitle'],
  setup(props, { emit }) {
    const clickDelete = () => {
      emit('clickDelete', props.todo.id)
    }

    const clickTitle = () => {
      emit('clickTitle', props.todo.id)
    }

    const formatDate = useFormatDate(props.todo.createdAt)

    return {
      clickDelete,
      clickTitle,
      formatDate,
    }
  },
})
```

# Todo一覧をTodoItemコンポーネントを利用するように修正する

それでは実装のほうに戻っていきましょう。作成したTodoItemコンポーネントを使うようにTodo一覧を修正します。

```html:src/views/todos.vue
<template>
  <h2>TODO一覧</h2>
  <ul>
    <todo-item
      v-for="todo in todoStore.state.todos"
      :key="todo.id"
      :todo="todo" // ①
      @click-title="clickTitle" // ②
      @click-delete="clickDelete"
    >
    </todo-item>
  </ul>
  <router-link to="/new">新規作成</router-link>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import TodoItem from '@/components/TodoItem.vue'
import { todoKey } from '@/store/todo'

export default defineComponent({
  components: {
    TodoItem,
  },
  setup() {
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    const router = useRouter()

    const clickDelete = (id: number) => { // ③
      todoStore.deleteTodo(id)
    }

    const clickTitle = (id: number) => { // ④
      router.push(`/edit/${id}`)
    }

    return {
      todoStore,
      clickDelete,
      clickTitle,
    }
  },
})
</script>
```

① propsとして、親コンポーネントから子コンポーネントにデータを渡しています。

② 子コンポーネントからemitされたイベントをハンドリングします。キャメルケース(titleClick)はケパブケース(title-click)に変換する必要があることに注意してください。

③ 子コンポーネントのemitの引数として渡された値`props.todo.item`はイベント引数として受け取ることができます。`clickDelete`関数では引数として受け取ったidをそのままtodoStoreの`deleteTodo()`メソッドに渡しています。

④ `clickTitle`関数は、引数として渡されたidをもとに編集ページへと遷移します。

TODOの削除は、そのためのページを必要とせず一覧上で完結するので実はこれだけで実装は完了です。実際に削除ボタンをクリックしてみて試してみてください。

![deletetodo.gif](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FsYZghIsnICBCU2shzIqF%2F6cd98e75d2ca82d0752ddbf721ce2cb9.gif?alt=media&token=6ea0d690-8394-44b7-8e54-06d245bf4501)

# 編集ページの作成

タイトルをクリックしたときに遷移するようになりましたが、まだ編集画面を作っていないので真っ白な画面へ遷移されます。
`EditTodo.vue`ファイルを作成しましょう。

```sh
touch src/views/EditTodo.vue
```

さらに、ルーティングに追加します。

```diff:src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Todos from '@/views/todos.vue'
import AddTodo from '@/views/AddTodo.vue'
++  import EditTodo from '@/views/EditTodo.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Todos',
    component: Todos,
  },
  {
    path: '/new',
    name: 'AddTodo',
    component: AddTodo,
  },
++  {
++    path: '/edit/:id',
++    name: 'EtidTodo',
++    component: EditTodo,
++  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

コロン`:`を用いてルートを動的にマッチングさせることができます。例えば、`/edit/1`・`/edit/3`のようなルートにマッチングします。
これらの値は`route`オブジェクトの`params`から取得できます。

EditTodo.vueの実装は以下の通りです。

```html:src/views/EditTodo.vue
<template>
  <h2>TODOを編集する</h2>
  <div v-if="error"> // ①
    ID：{{ $route.params.id }}のTODOが見つかりませんでした。
  </div>
  <form v-else @submit.prevent="onSubmit">
    <div>
      <label for="title">タイトル</label>
      <input type="text" id="title" v-model="data.title" />
    </div>
    <div>
      <label for="description">説明</label>
      <textarea id="description" v-model="data.description" />
    </div>
    <div>
      <label for="status">ステータス</label>
      <select id="status" v-model="data.status">
        <option value="waiting">waiting</option>
        <option value="working">working</option>
        <option value="completed">completed</option>
        <option value="pending">pending</option>
      </select>
    </div>
    <button @click="onSubmit">更新する</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, inject, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Params } from '@/store/todo/types'
import { todoKey } from '@/store/todo'

export default defineComponent({
  setup() {
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    const router = useRouter()
    const route = useRoute() // ②

    const id = Number(route.params.id) // ②
    try {
      const todo = todoStore.getTodo(id) // ③

      const data = reactive<Params>({ // ④
        title: todo.title,
        description: todo.description,
        status: todo.status,
      })

      const onSubmit = () => {
        const { title, description, status } = data
        todoStore.updateTodo(id, { // ⑤
          ...todo,
          title,
          description,
          status,
        })
        router.push('/')
      }

      return {
        error: false,
        data,
        onSubmit,
      }
    } catch (e) {
      console.error(e)
      return {
        error: true,
      }
    }
  },
})
</script>
```

① idからTODOが見つからない可能性があるので、そのような場合には更新画面ではなくその旨を伝えるようにします。

② `setup()`メソッド内で`$route`オブジェクトにアクセスするために、`useRoute()`関数を呼び出しています。`route.params.id`から更新対象のTODOのidを取得します。

③　idからストアのTODOを取得します。

④ フォームの初期値にはストアから取得したTODOの値を代入します。

⑤ フォームのサブミットときに、todoStoreの`updateTodo`を呼び出して更新します。

それでは実際に試してみましょう。一覧からidが1のTODOのタイトルをクリックして編集画面へ遷移します。タイトルを編集してみましょう。

![スクリーンショット 20201220 0.35.15.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FsYZghIsnICBCU2shzIqF%2F13096d22899fd3c3e8242c223f7f27cb.png?alt=media&token=c250922b-d7c1-405e-b650-d5c78ba56a35)

更新するをクリックしましょう。一覧画面へ遷移して、タイトルが更新されているのが確認できます。

![スクリーンショット 20201220 0.36.04.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FsYZghIsnICBCU2shzIqF%2Fdb64c71ce37cac57087ee16f4c41097e.png?alt=media&token=32ecd303-f11d-4eb7-bcad-6a6b9e9a3dd2)

TODOに対して基本的なCRUD操作を実装しましたが、ブラウザをリロードするだけで追加や更新したTODOが元に戻ってしまいます。これでは、「ブラウザをリロードしないこと」というTODOを追加しなければなりません。

それでは使い勝手はわるいので、ストアを永続化して保存されるようにしましょう。

# データ永続化を操作するためのモジュールを作成する

永続化処理については、ストア内に直接記述するのではなく、専用のインターフェースを作成してそこを通して操作するようにします。永続化処理を抽象化することによって将来の変更に強くなります。また、コードもテストしやすいものになるでしょう。
もしあなたがレポジトリパターンを採用したことがあるのなら、理解しやすいのではないでしょうか。

`src/clients/TodoClient`ディレクトリを作成して、さらにその中に`index.ts`ファイルと`types.ts`ファイルを作成します。

```sh
mkdir src/clients/TodoClient
toucn src/clients/TodoClient/index.ts
toucn src/clients/TodoClient/types.ts
```

## インターフェースを作成

`src/clients/TodoClient/types.ts`にインターフェースを定義します。

```ts:src/clients/TodoClient/types.ts
import { Todo, Params } from '@/store/todo/types'

export interface TodoClientInterface {
  getAll(): Promise<Todo[]>

  get(id: number): Promise<Todo>

  create(params: Params): Promise<Todo>

  update(id: number, todo: Todo): Promise<Todo>

  delete(id: number): Promise<void>
}
```

## 実装の作成

インターフェースを実装したクラスを`src/clients/TodoClient/index.ts`に作成します。レポジトリの実装としては本来APIを介してバックエンドに保存するのが一般的だと思われますが、今回は簡単なアプリケーションですので[localStorage](https://developer.mozilla.org/ja/docs/Web/API/Window/localStorage)に保存する処理として実装したいと思います。

```ts:src/clients/TodoClient/index.ts
import { Todo } from '@/store/todo/types'
import { TodoClientInterface } from './types'

export class TodoClient implements TodoClientInterface {
  getAll() {
    return Promise.resolve(
      Object.keys(localStorage)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => {
          const todo = JSON.parse(localStorage.getItem(key) as string) as Todo
          todo.createdAt = new Date(todo.createdAt)
          todo.updatedAt = new Date(todo.updatedAt)
          return todo
        })
    )
  }

  get(id: number) {
    const item = localStorage.getItem(String(id))
    if (item === null) {
      return Promise.reject(new Error(`id: ${id} is not found`))
    }

    return Promise.resolve(JSON.parse(item) as Todo)
  }

  create(params: Params) {
    const todo = this.intitializeTodo(params)
    localStorage.setItem(String(todo.id), JSON.stringify(todo))
    return Promise.resolve(todo)
  }

  update(id: number, todo: Todo) {
    localStorage.removeItem(String(id))
    todo.updatedAt = new Date()
    localStorage.setItem(String(id), JSON.stringify(todo))
    return Promise.resolve(todo)
  }

  delete(id: number) {
    localStorage.removeItem(String(id))
    return Promise.resolve()
  }

  intitializeTodo(todo: Params) {
    const date = new Date()
    return {
      id: date.getTime(),
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: date,
      updatedAt: date,
    } as Todo
  }
}
```

ローカルストレージには文字列しか保存できないので、オブジェクトを保存する際には`JSON.stringify`でオブジェクトの一度文字列に変換します。ローカルストレージに保存した値を取得する際には`JSON.parse`で文字列をオブジェクトに変換します。
また、ローカルストレージ自体は非同期に実行する処理ではないですが、インターフェースを満たすために、`Promise`を返すようにしています。

## ファクトリーの作成

永続化処理のモジュールは、ファクトリーを介して取得します。ファクトリーを介して取得することによって、モックの処理に置き換えやすくなります。

`src/clients/RepositoryFactory.ts`を作成します。

```ts:src/clients/RepositoryFactory.ts
import { TodoClient } from '@/clients/TodoClient'
import { TodoClientInterface } from './TodoClient/types'

export const TODOS = 'todos'

export interface Repositories {
  [TODOS]: TodoClientInterface
}

export default {
  [TODOS]: new TodoClient(),
} as Repositories

```

# ストアからレポジトリを利用する

それでは、ストアの実装にレポジトリを組み込んでいきます。
レポジトリに詳細な実装は隠蔽しているので、ストアはデータの単純な操作に集中できます。また、レポジトリは抽象的な操作のみを提供しているので永続化処理をAPIに置き換えたとしてストアの実装は変更する必要がありません。

```ts:src/store/index.ts
import { InjectionKey, reactive, readonly } from 'vue'
import { Todo, Params, TodoState, TodoStore } from '@/store/todo/types'
import Repository, { TODOS } from '@/clients/RepositoryFactory'
const TodoRepository = Repository[TODOS]

const state = reactive<TodoState>({
  todos: [],
})

const fetchTodos = async () => {
  state.todos = await TodoRepository.getAll()
}

const fetchTodo = async (id: number) => {
  const todo = await TodoRepository.get(id)
  state.todos.push(todo)
}

const getTodo = (id: number) => {
  const todo = state.todos.find((todo) => todo.id === id)
  if (!todo) {
    throw new Error(`cannot find todo by id:${id}`)
  }
  return todo
}

const addTodo = async (todo: Params) => {
  const result = await TodoRepository.create(todo)
  state.todos.push(result)
}

const updateTodo = async (id: number, todo: Todo) => {
  const result = await TodoRepository.update(id, todo)
  const index = state.todos.findIndex((todo) => todo.id === id)
  if (index === -1) {
    throw new Error(`cannot find todo by id:${id}`)
  }
  state.todos[index] = result
}

const deleteTodo = (id: number) => {
  TodoRepository.delete(id)
  state.todos = state.todos.filter((todo) => todo.id !== id)
}

const todoStore: TodoStore = {
  state: readonly(state),
  fetchTodos,
  fetchTodo,
  getTodo,
  addTodo,
  updateTodo,
  deleteTodo,
}

export default todoStore

export const todoKey: InjectionKey<TodoStore> = Symbol('todoKey')
```

レポジトリからすべてのTODOを取得する`fetchTodos`と、idからTODOを取得する`fetchTodo`も追加しました。ストアのインターフェースも更新しておきましょう。

```diff:src/store/types.ts
import { DeepReadonly } from 'vue'

export type Status = 'waiting' | 'working' | 'completed' | 'pending'

export interface Todo {
  id: number
  title: string
  description: string
  status: Status
  createdAt: Date
  updatedAt: Date
}

export type Params = Pick<Todo, 'title' | 'description' | 'status'>

export interface TodoState {
  todos: Todo[]
}

export interface TodoStore {
  state: DeepReadonly<TodoState>
++  fetchTodos: () => void
++  fetchTodo: (id: number) => void
  getTodo: (id: number) => Todo
  addTodo: (todo: Partial<Todo>) => void
  updateTodo: (id: number, todo: Todo) => void
  deleteTodo: (id: number) => void
}
```

TODOをレポジトリに保存して取得する処理までやりました。
早速、`fetchTodos()`をTODO一覧ページで呼び出して表示させたいと思います。`fetchTodos()`はPromiseを返す非同期処理ですので、`async/await`を用いて呼び出したいところです。まず思いつくのは次のように書けるでしょう。

```ts:src/views/todos.vue
  async setup() { // setup関数をasync関数に変更
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }

    const router = useRouter()
    const clickDelete = (id: number) => {
      todoStore.deleteTodo(id)
    }
    const clickTitle = (id: number) => {
      router.push(`/edit/${id}`)
    }

    await todoStore.fetchTodos() // 非同期処理なのでawaitで呼び出す

    return {
      todoStore,
      clickDelete,
      clickTitle,
    }
```

しかし、これはうまくいきません。表示されるのは真っ白な画面です。

![スクリーンショット 20201223 22.27.33.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fiiu2rHNufMnDeTIPbl66%2Faad9f945bcb8a6dcd67fec4b78958ae3.png?alt=media&token=4e54ffda-f9ea-4036-bd9a-4aff8649a443)

実は`setup`関数は、Promiseを返すことができません。(`async/await`はPromiseを返す関数です)このような`setup()`関数がPromiseを返す非同期コンポーネントを扱うには、`Suspense`と呼ばれる特別なコンポーネントを利用する必要があります。

# Suspenseコンポーネントを扱う

## 非同期処理を行う箇所をコンポーネントに切り分ける

まずは、非同期処理を行う部分だけを切り出したコンポーネントを作成します。このアプリケーションの例では、TODO一覧を描画する箇所が非同期処理を行っています。具体的には

```html
<ul>
    <todo-item
      v-for="todo in todoStore.state.todos"
      :key="todo.id"
      :todo="todo"
      @click-title="clickTitle"
      @click-delete="clickDelete"
    >
    </todo-item>
  </ul>
```

の箇所ですね。`<h2>TODO一覧</h2>`のような箇所は非同期処理に関係なく表示されるのでそのままにしておきます。

`src/components/AsyncTodos.vue`を作成しましょう。

```sh
touch src/components/AsyncTodos.vue
```

以下のように切り出しました。

```html:src/components/AsyncTodos.vue
<template>
  <ul>
    <todo-item
      v-for="todo in todoStore.state.todos"
      :key="todo.id"
      :todo="todo"
      @click-title="clickTitle"
      @click-delete="clickDelete"
    >
    </todo-item>
  </ul>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { useRouter } from 'vue-router'
import TodoItem from '@/components/TodoItem.vue'
import { todoKey } from '@/store/todo'

export default defineComponent({
  components: {
    TodoItem,
  },
  async setup() {
    const todoStore = inject(todoKey)
    if (!todoStore) {
      throw new Error('todoStore is not provided')
    }
    const router = useRouter()
    const clickDelete = (id: number) => {
      todoStore.deleteTodo(id)
    }
    const clickTitle = (id: number) => {
      router.push(`/edit/${id}`)
    }

    await todoStore.fetchTodos()

    return {
      todoStore,
      clickDelete,
      clickTitle,
    }
  },
})
</script>
```

ロジック自体には変更はありません。一点注意点として`await`の処理は`inject`や`useRouter`の後で呼び出す必要があるところです。(さもなくば、[Vue warn]: inject() can only be used inside setup() or functional components. というWaringが出力されます)

## 親コンポーネントからSuspenseでラップする

次に、先程作成した非同期コンポーネントを利用する側の親コンポーネントの処理を書いていきます。次のように、`<Suspense>`で非同期コンポーネントをラップします。

```html:src/views/todos.vue
<template>
  <h2>TODO一覧</h2>
  <Suspense>
    <AsyncTodos />
  </Suspense>
  <router-link to="/new">新規作成</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AsyncTodos from '@/components/AsyncTodos.vue'

export default defineComponent({
  components: {
    AsyncTodos,
  },
})
</script>
```

これで、表示ができるようになるはずです。

![スクリーンショット 20201223 22.45.41.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fiiu2rHNufMnDeTIPbl66%2F2d7c0e0ae946584c1d3299fde8d3feda.png?alt=media&token=00012620-1de6-4564-aec6-705c6a757052)

## ローディング時の処理を追加する

`Suspense`の役割はこれだけではありません。実際の非同期処理では解決するまで時間がかかりその間はローディング中であることを表す描画をするはずです。`<Suspense`>コンポーネントの`fallback`スロットを利用すれば、そのような実装を簡単に処理することができます。

```html:src/views/todos.vue
<template>
  <h2>TODO一覧</h2>
  <Suspense>
    <template #default>
      <AsyncTodos />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <router-link to="/new">新規作成</router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AsyncTodos from '@/components/AsyncTodos.vue'

export default defineComponent({
  components: {
    AsyncTodos,
  },
})
</script>
```

実際にはローカルストレージから取得する処理はすぐに終わってしますので、`fallback`スロットが表示されることを確認したい場合には`todoClient`の処理を少し修正してあえて3秒送らせて取得させてみましょう。

```diff:src/todoClient/index.ts
import { Todo } from '@/store/todo/types'
import { TodoClientInterface } from './types'

export class TodoClient implements TodoClientInterface {
-- getAll()
++  async getAll() {
++    await new Promise((resolve) => setTimeout(resolve, 3000))
    return Promise.resolve(
      Object.keys(localStorage)
        .filter((key) => !isNaN(Number(key)))
        .map((key) => {
          const todo = JSON.parse(localStorage.getItem(key) as string) as Todo
          todo.createdAt = new Date(todo.createdAt)
          todo.updatedAt = new Date(todo.updatedAt)
          return todo
        })
    )
  }
```

Promiseが解決するまでの間、Loading...と描画されます。

![suspensevue.gif](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fiiu2rHNufMnDeTIPbl66%2Fd0d0dfcf86fa4abefc8395458647dd24.gif?alt=media&token=afac9cad-f4d2-483f-a7d4-d1202ca99df2)

## エラーを処理する

非同期処理といえば、ローディングと並んでエラーハンドリングもつきものです。これは`onErrorCaptured`ライフサイクルフックで完結に処理することができます。
`onErrorCaputerd`は、子コンポーネントでエラーが発生した際にそれを捕捉します。

```html:src/views/todos.vue
<template>
  <h2>TODO一覧</h2>
  <div v-if="error">
    {{ error.message }}
  </div>
  <Suspense v-else>
    <template #default>
      <AsyncTodos />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
  <router-link to="/new">新規作成</router-link>
</template>

<script lang="ts">
import { defineComponent, ref, onErrorCaptured } from 'vue'
import AsyncTodos from '@/components/AsyncTodos.vue'

export default defineComponent({
  components: {
    AsyncTodos,
  },
  setup() {
    const error = ref<unknown>(null)

    onErrorCaptured((e) => {
      error.value = e
      return true
    })

    return {
      error,
    }
  },
})
</script>
```

あえて`fetchTodos()`でエラー発生させてみましょう。

![suspenseerorr.gif](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fiiu2rHNufMnDeTIPbl66%2Feaefbe3927bd1c1e5473336830d72bd7.gif?alt=media&token=b47bc7a9-99fd-441a-ba9e-7643b75a64c8)

# レポジトリをモックに置き換える

最後に、レポジトリの実装をモックに置き換えた状態で起動させてみたいと思います。実際の現場でもバックエンドとフロントエンドで別れて開発を行っておりバックエンドの実装が完了するまではモックモードで動かしたいという欲求があるでしょう。

まずは、モックモードで起動するコマンドを`package.json`に追加します。

```diff:package.json
{
  "name": "vue3-todo-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
++    "mock": "NODE_ENV=mock vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
```

Vue CLIは`vue-cli-service serve`コマンドを呼び出した時デフォルトでは`NODE_ENV`はdevelopmentに設定されますが、ここではmockに置き換えています。
すでに起動している場合には一旦Control + cでストップさせてから、モックモードで起動するようにします。

```sh
npm run mock
```

## モックレポジトリの作成

ローカルストレージの代わりにモックを利用するモックレポジトリを作成しましょう。ここで、通常のレポジトリと同じく`TodoClientInterface`を実装することがポイントです。同じインターフェースを実装しているので、使用側は具体的な実装の違いに関わらず利用することができます。
`src/clients/TodoClient/mock.ts`を作成します。

```sh
touch src/clients/TodoClient/mock.ts
```

実装は以下の通りです。

```ts:src/clients/TodoClient/mock.ts
import { Todo, Params } from '@/store/todo/types'
import { TodoClientInterface } from './types'

const mockTodo: Todo[] = [
  {
    id: 1,
    title: 'todo1',
    description: '1つ目',
    status: 'waiting',
    createdAt: new Date('2020-12-01'),
    updatedAt: new Date('2020-12-01'),
  },
  {
    id: 2,
    title: 'todo2',
    description: '2つ目',
    status: 'waiting',
    createdAt: new Date('2020-12-02'),
    updatedAt: new Date('2020-12-02'),
  },
  {
    id: 3,
    title: 'todo3',
    description: '3つ目',
    status: 'working',
    createdAt: new Date('2020-12-03'),
    updatedAt: new Date('2020-12-04'),
  },
]

export class MockTodoClient implements TodoClientInterface {
  async getAll() {
    return Promise.resolve(mockTodo)
  }

  get(id: number) {
    const todo = mockTodo.find((todo) => todo.id === id)
    if (todo === undefined) {
      return Promise.reject(new Error(`id: ${id} is not found`))
    }

    return Promise.resolve(todo)
  }

  create(params: Params) {
    const todo = this.intitializeTodo(params)
    return Promise.resolve(todo)
  }

  update(id: number, todo: Todo) {
    todo.updatedAt = new Date()
    return Promise.resolve(todo)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(id: number) {
    return Promise.resolve()
  }

  intitializeTodo(todo: Params) {
    const date = new Date()
    return {
      id: date.getTime(),
      title: todo.title,
      description: todo.description,
      status: todo.status,
      createdAt: date,
      updatedAt: date,
    } as Todo
  }
}
```

## ファクトリーを修正する

ファクトリーの処理を修正して、実行環境によってインポートするレポジトリを変更します。

```ts:src/clients/RepositoryFactory.ts
import { TodoClientInterface } from './TodoClient/types'
import { TodoClient } from '@/clients/TodoClient'
import { MockTodoClient } from '@/clients/TodoClient/mock'

export const TODOS = 'todos'

export interface Repositories {
  [TODOS]: TodoClientInterface
}

export default {
  [TODOS]:
    process.env.NODE_ENV === 'mock' ? new MockTodoClient() : new TodoClient(),
} as Repositories
```

モックレポジトリが使われていることがわかります。

![スクリーンショット 20201224 0.11.50.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fiiu2rHNufMnDeTIPbl66%2F7b1c1a8494c222d58a511b508b407d01.png?alt=media&token=1d74cb15-3f8d-46bc-9458-1efb68c3252a)

レポジトリパターンを採用したおかげで、このように簡単に置き換えることが可能でした。

以上で終了となります。お疲れ様でした！
