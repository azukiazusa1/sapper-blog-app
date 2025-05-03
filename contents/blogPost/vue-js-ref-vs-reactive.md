---
id: 1rmjmVYbeYQrPSwSNTdJBF
title: "【Vue.js】ref vs reactive"
slug: "vue-js-ref-vs-reactive"
about: "さて、そんな Compositon API ですがリアクティブなデータを定義する際に `reactive` と `ref` の2つの方法が用意されています。 `reactive` と `ref` どちらを使用するのがよいのか公式からも推奨する方法がありませんので、どちらを使用するべきか迷ってしまうところです。  `reactive` と `ref` のそれぞれのメリット・デメリットを確認してみましょう。"
createdAt: "2022-01-02T00:00+09:00"
updatedAt: "2022-01-02T00:00+09:00"
tags: ["Vue.js", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/KlxddWUk3mnLDCFG4qxu2/f36940cc38418e433c2b6be88032e44c/articles_2FuOVZsTkluuNqWfpBJSFq_2Fthumbnail_7D.png"
  title: "Vue.js"
audio: null
selfAssessment: null
published: true
---
Vue.js の Composition API が登場してから 1 年とちょっとが経過しており、すでに使いこなしているほうもいらっしゃるのではないでしょう？

私自身お仕事で Composition API を使用しており、従来の Options API と比較して UI とロジックの分解がよりやりやすくなったように思えます。リアクティブなデータをコンポーネントの外で定義できるようになったことで、1 つのコンポーネントにまとめて書かざるをえなかったを**論理的な関心事**に分けてそれぞれ別のファイルで定義できます。

書き心地としては React のカスタムフックに近い感じとなっています。

個人的には React がクラスコンポーネントから関数コンポーネント + Hook へ移行したように、Vue.js においても Composition API へ移行する流れが来るのではないかと思います。

さて、そんな Compositon API ですがリアクティブなデータを定義する際に `reactive` と `ref` の 2 つの方法が用意されています。 `reactive` と `ref` どちらを使用するのがよいのか公式からも推奨する方法がありませんので、どちらを使用するべきか迷ってしまうところです。

`reactive` と `ref` のそれぞれのメリット・デメリットを確認してみましょう。

## reactive

`reactive` メソッドはオブジェクトを引数に受け取り、リアクティブにしたコピーを返します。

```vue
<script setup lang="ts">
import { reactive, computed } from 'vue'

const state = reactive({
  count: 0
})

const increment = () => {
  state.count++
}
</script>

<template>
  <p>{{ state.count }}</p>
  <button @click="increment">+</button>
</template>
```

### メリット

#### Options API の `Data` の定義と似ている

`reactive` はオブジェクトによって定義しますが、この方法は Options　API における `Data` の定義の仕方とよく似ているので従来の方法に慣れている人にとっては `ref` と比べてとっつきにくいかと思われます。

```vue
<script>
export default defineComponent({
  data() {
    return {
      count: 0
    }    
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
</script>
```

#### まとまったデータを定義するのに向いている

例えば、ユーザーのデータにおける `firstName`,`lastName` のように関連性のあるデータ群を定義する際には `ref` を使って個別に定義するよりも個別の関連性がわかりやすくなります。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';

const user = reactive({
  firstName: 'Jhon',
  lastName: 'Smith',
  age: 21,
});

const fullName = computed(() => `${user.firstName} ${user.lastName}`);

const firstName = ref('Jhon');
const lastName = ref('Smith');
const age = ref(21);

const fullName = computed(() => `${firstName.value} ${lastName.value}`);
</script>
```

### デメリット

#### 通常のオブジェクトと区別がつきづらい

`reactive` メソッドの返り値の型は元のオブジェクトのままです。（`ref` がアンラップされるという違いはありますが）

つまるところ、変数の型情報を見ただけではそれが通常のオブジェクトなのか、リアクティブな値なのか判別できません。

![スクリーンショット 2021-12-30 19.38.33](//images.ctfassets.net/in6v9lxmm5c8/17Jp4FUeW4Z7JSGmA6FveS/434fbd104ec53ea3c7c7c07ca2c7051d/____________________________2021-12-30_19.38.33.png)

リアクティブなデータを `ref` で定義した場合になら `Ref<number>` のように推論されるので、型情報を見るだけでリアクティブなデータだと認識できます。

```ts
const count = ref(0) // Ref<number>
```

#### 分割代入

`reactive` の大きなデメリットの 1 つとして**分割代入するとリアクティブ性が失われる**点が挙げられます。例として、以下のように分割代入して `count` を表示しようとすると予想に反して描画は変更されません。

```vue
<script setup lang="ts">
import { reactive } from "vue";

const state = reactive({
  count: 0,
});

let { count } = state;

const increment = () => {
  count++;
};
</script>

<template>
  <p>{{ count }}</p>
  <button @click="increment">+</button>
</template>
```

![count](//images.ctfassets.net/in6v9lxmm5c8/1ybpwqgsQxaiK74frENunP/dd1ce1f587a945fa03268c9f9a5bd961/count.gif)

分割代入を利用したい場合には `toRefs` を使って `ref` に変換した値として使う必要があります。

```vue
<script setup lang="ts">
import { reactive, toRefs } from "vue";

const state = reactive({
  count: 0,
});

let { count } = toRefs(state);

const increment = () => {
  count.value++;
};
</script>

<template>
  <p>{{ count }}</p>
  <button @click="increment">+</button>
</template>
```

個人的には、この分割代入できないという仕様は結構痛手のように思えます。前述のとおりに `reactive` で宣言したデータは通常のオブジェクトと区別がつかないので分割代入をしてよいのかどうかを宣言元まで見にいかなくてはいけないのは手間がかかります。コード中で `reactive` を使っている場合には、通常のオブジェクトを使用する際にも注意を払わなくてはいけません。

また誤って `reactive` で宣言したデータを分割代入してしまった場合においても特に警告などが表示されるわけでもないので値がリアクティブとならない不具合の原因を探る際に少し不都合なように思えます。

`toRefs` を使う方法も `toRefs` 自体が主要な API ではないのと、結局 `ref` に変換されるのであれば元から `ref` で定義しておけばよいのでは？という気持ちもあります。

## Ref

`ref` はプリミティブな値（`string`,`number` など）を引数にとりリアクティブなデータを定義します。`ref` メソッドの返り値の型は `Ref<T>`（`T` は引数に渡した値の型）というオブジェクトになります。

`ref` で定義した値にアクセスするためには　`value` というプロパティにアクセスする必要があるという特徴があります。`<template>` 内で使うときには `.value` を省略できます。

これは Vue.js においてリアクティブ性は [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) オブジェクトにより実現されているのでプリミティブなままリアクティブにできないという事情があります。（Vue 2 なら [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)）

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0)

const increment = () => {
  count.value++
}
</script>

<template>
  <p>{{ count }}</p>
  <button @click="increment">+</button>
</template>
```

### メリット

#### リアクティブなデータか判別しやすい

`reactive` のデメリットにおいて説明したとおり `ref()` の返り値は `Ref<T>` なのでただのプリミティブなデータではなくプリミティブなデータであることが判別しやすいです。

```ts
const count = ref(0) // Ref<number>
```

### デメリット

#### 常に `.value` でアクセスする必要がある

`ref` で定義した値は常に `.value` でアクセスする必要があるという一風変わった方法が必要です。（`<template>` 内部では `.value` を省略できるという点も混乱を招く要因の 1 つになりそうです）

これは特に TypeScript ではなく JavaScript を使用している場合に顕著になります。

例えば `boolean` の値を扱っているときにうっかり `.value` をつけ忘れてしまった場合に少し困ったことになりうるでしょうか。

```ts
import { ref } from "vue";

const isShow = ref(false);

if (isShow) {
  // 常に実行されてしまう！！
}
```

## Composables 関数として公開するときは常に Ref 型とする

Composables とは Composition API を利用してステートフルなロジックを再利用可能な関数として定義するものです。例えば `dayjs` などの日付ライブラリは日付のフォーマットのような再利用可能な関数を提供しますが、これは**ステートレスなロジック**です。対して**ステートフルなロジック**とは時間の経過によって変化する状態の管理を含みます。

例として Compositiomn API を利用して API コールを再利用可能にした `useFetch` 関数を見てみましょう。

```ts
import { Ref, ref, unref, watchEffect } from 'vue'

const useFetch = <T>(url: string | Ref<string>) => {
  const unrefUrl = unref(url)
  const data = ref<T | null>(null)
  const loading = ref(true)
  const error = ref<unknown | null>(null)

  const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(unrefUrl)
      data.value = await res.json()
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  watchEffect(() => {
    fetchData()
  })

  return {
    data,
    loading,
    error,
  }
}

export default useFetch
```

`useFetch` は `URL` を引数に受け取りレスポンスデータ、ローディング可否、エラー可否の 3 つのデータを返します。返されるデータはそれぞれの `ref` で定義されているためリアクティブとなっており、時間が経過して API コールが完了するにつれて返却されるデータの状態は変化します。

また引数の URL をリアクティブなデータとして渡した場合、引数の URL が変更されるたびに（例えば、クエリパラメータが変更されるたびに）`watchEffect` によって API が再コールされるようになります。

また Composables 関数は `composables` ディレクトリに配置して `use` + キャメルケースの関数名とすることが慣例です。

これは、コンポーネント内では次のように使用します。

```vue
<script setup lang="ts">
import useFetch from "./useFetch";

interface User {
  firstName: string;
  lastName: string;
  age: number;
}
const { data, loading, error } = useFetch<User>("/api/users");
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error!</div>
  <div v-else>
    <p>{{ data?.firstName }} {{ data?.lastName }}</p>
  </div>
</template>
```

さて、そんな Composables 関数ですが関数内部の状態保持として `reactive`,`ref` どちらを使用したとしても、返り値は必ず `reactive` ではなく `Ref` 型で返すことが推奨されています。

> Returning a reactive object from a composable will cause such destructures to lose the reactivity connection to the state inside the composable.
> 
> If you prefer to use returned state from composables as object properties, you can wrap the returned object with reactive() so that the refs are unwrapped. For example:

https://staging.vuejs.org/guide/reusability/composables.html#return-values

```ts
const useFetch = <T>(url: string | Ref<string>) => {

  const state = reactive({
    data: null,
    loading: true,
    error: null,
  })

  // bad practice...
  return state
  // better
  return toRefs(state)

  // or...
  const data = ref<T | null>(null)
  const loading = ref(true)
  const error = ref<unknown | null>(null)

  return {
    data,
    loading,
    error,
  }
}
```

これは、コンポーネント内で Composables 関数を利用するときにリアクティブ性を失わないようにするためです。前述のとおり `reactive` は分割代入をするとリアクティブ性が失われてしまいます。

```ts
const { data, loading, error } = useFetch('/api/users')
```

## 個人的にな見解

さて、`reactive` と `ref` どちらを使用すればよいかの話に戻りましょう。私の個人的な意見としては**コンポーネント内では常に `ref` を使する*のが良いと思います。

理由としてはやはり `reactive` において分割代入をするとリアクティブ性が失われるという挙動によるとことが大きいです。結局 `toRefs` で `Ref` に変換する必要があるのならば元からリアクティブなデータは `ref` で定義すると決めておいたほうがデータのアクセス方法も統一されるのでわかりやすいでしょう。（`computed` も同様に `.value` でデータにアクセスします）

`ref` において常に `.value` をつけなければいけないというわかりづらさはありますがこれは `TypeScript` を使用していれば大きな問題にはならないと考えました。（また VSCode の拡張である [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) を使用すれば `.value` を補完してくれます。）

![ref-value1](//images.ctfassets.net/in6v9lxmm5c8/6ET7Oxr7Gw0ElaZKbnuJeo/b62ca13c5677b1551b1565c4eb77eba3/ref-value1.gif)
例外としては、Composables 関数内で状態を定義する際にはカプセル化されているため、必ず `toRefs()` を使用して返すことを条件に `reactive` を使用してもよいかもしれません。
