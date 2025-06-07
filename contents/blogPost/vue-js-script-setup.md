---
id: 1gm1qoxbVwQfKlSQsNkX4n
title: "【Vue.js】script setup 構文がすごくすごい"
slug: "vue-js-script-setup"
about: "Vue.js 3.x から script setup 構文が使えるようになりました。これは単一ファイルコンポーネント(SFC)内で Composition API を使用している際に使える糖衣構文です。下記のようなメリットを得ることができ、公式からも使用が推奨されています。"
createdAt: "2021-09-26T00:00+09:00"
updatedAt: "2021-09-26T00:00+09:00"
tags: ["Vue.js", "TypeScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4LlOrDdEXyxqi7wjIKAhgp/7bc2ba8009965c9fa02bf49493a13226/vite.svg"
  title: "vite"
audio: null
selfAssessment: null
published: true
---
# `<script setup`> 構文とは

Vue.js 3.2 から `<script setup>` 構文が使えるようになりました。これは単一ファイルコンポーネント（SFC）内で Composition API を使用している際に使える糖衣構文です。下記のようなメリットを得ることができ、公式からも使用が推奨されています。

- ポイラープレートが減りより簡潔になる
- props と emit を定義する際に純粋な TypeScript の構文が使える
- ランタイムのパフォーマンスが向上する
- IDE のパフォーマンスが向上する

## 基本的な構文

`<script setup>` 構文をざっくりと説明すると、従来の Composition API における `setup()` 関数内部を `<script>` 直下に直接記述できるという構文です。

単一ファイルコンポーネントの `<script>` タグに `setup` 属性を付与することでこの糖衣構文を使用できます。

`<script setup>` 構文によってどれほど記述が簡潔になったかを従来の Options API と Composition API の書き方と比較してみましょう。

- Options API

```vue
<template>
  <div>
    <h1>{{ count }}</h1>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
</script>
```

簡単なカウンターアプリですが、おおむねこのような感じになるでしょう。
これを Composition API に置き換えたものが以下となります。

- Composition API

```vue
<template>
  <h1>{{ count }}</h1>
  <button @click="increment">Increment</button>
  <button @click="decrement">Decrement</button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const count = ref(0);

    const increment = () => {
      count.value++;
    };

    const decrement = () => {
      count.value--;
    };
    return {
      count,
      increment,
      decrement,
    };
  },
});
</script>
```

最後にお待ちかねの `<script setup>` 構文です。

- `<script setup>`

```vue
<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);

const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};
</script>

<template>
  <h1>{{ count }}</h1>
  <button @click="increment">Increment</button>
  <button @click="decrement">Decrement</button>
</template>
```

~~これ Svelete じゃん!?~~ 公式のサンプルコードを見ても、`<template>` → `<script`> の順番だったのが `<script>` → `<template`> の順番になっています。

Vue.js 特有の構文が少なくなって、純粋なの JavaScript の構文のように記述できているのが気持ちよいですね。

Composition API との比較をすると以下の点が異なっていることがわかります。

- `export default` で Vue.js のオブジェクトを export する必要がなくなった
- `setup()` 関数内で定義した変数や関数を `return` しないと `<template>` 内で使用できなかったが、 `<script setup>` 内で宣言した場合すべて使用可能となる

他にも従来の書き方といくつか異なる点があるので見ていきましょう。

## VSCode 拡張機能

VSCode における `.vue` ファイルの拡張機能として[Vetur](https://vuejs.github.io/vetur/)がよく使われていたかと思われますが、 `<script setup>` 構文には対応していません。

代わりに、[Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)を使うことが推奨されています。

https://twitter.com/vuejs/status/1429195877365780486

## コンポーネント

今まで `components` に import したコンポーネントの一覧を登録しなければいけなかったのですが、import するだけで直接使えるようになりました。

```vue
<script lang="ts" setup>
import TheHeader from "./components/TheHeader.vue";
import TheFooter from "./components/TheFooter.vue";
</script>

<template>
  <TheHeader />
  <main>main</main>
  <TheFooter />
</template>
```

コンポーネントにはケパブケース `<the-header`> も使えますが、公式ではパスカルケース `<TheHeader>` を推奨しているようです。

> The kebab-case equivalent <my-component> also works in the template - however PascalCase component tags are strongly recommended for consistency. It also helps differentiating from native custom elements.

https://v3.vuejs.org/api/sfc-script-setup.html#using-components

ついでに auto import もいい感じになってます。

![setup-component](//images.contentful.com/in6v9lxmm5c8/3QLXKorBfsHjRkpRxhWwBo/6b4e167f8cc9deca780fcb1e93b684ff/setup-component.gif)

### Namespeced Components

React っぽいことができます。

- Forms/Input.vue

```vue
<template>
  <input type="text" />
</template>
```

- Forms/Checkbox.vue

```vue
<template>
  <input type="checkbox" />
</template>
```

- Forms/index.ts

```ts
export { default as Input } from "./Input.vue";
export { default as Checkbox } from "./Checkbox.vue";
```

- App.vue

```vue
<script lang="ts" setup>
import * as Form from "./components/Forms";
</script>

<template>
  <Form.Input />
  <Form.Checkbox />
</template>
```

しかしこれだとコンポーネントが `any` 型になってしまうので正しいやり方なのかどうかは不明です。

![スクリーンショット 2021-09-21 21.26.07](//images.contentful.com/in6v9lxmm5c8/6DscWVuhhZxBMXcnbvUaZJ/48c4d4528d8f57e371c071e1c661ad9e/____________________________2021-09-21_21.26.07.png)

## Props と emit

個人的に一番嬉しかった点です。`props` と `emit` を純粋な TypeScript で定義できるようになりました。

### Props

```vue
<script setup lang="ts">
import { computed } from "@vue/reactivity";

interface Props {
  value: string;
  label?: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  disabled?: boolean;
}

const props = defineProps<Props>();

const disabledClass = computed(() => {
  props.disabled ? "bg-gray-200" : "";
});
</script>
<template>
  <label>
    {{ label }}
    <input
      :class="disabledClass"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </label>
</template>
```

props は `defineProps()` で定義されます。 `defindProps` と後述する `defineEmits` ・ `widhDefaults` は `<script setup`> 内で使用できるコンパイラマクロであり、どこかから import する必要はありません。

TypeScript を使用している場合には、　`defineProps()` は型引数を受け取ることができ、渡した型定義は従来のプロパティのバリデーションの代わりに使用できます。

`string` ・ `boolean` などのはそのまま従来の `type` で `String` や `Boolean` のように定義していたところに対応します。

プロパティをオプショナルにした場合には従来の　`required: false` と同じであり、オプショナルでない場合には `required: true` と同じです。

ここの型定義はコンポーネントを利用するときもタイプヒントが効いています。

![スクリーンショット 2021-09-21 21.26.07](//images.ctfassets.net/in6v9lxmm5c8/6DscWVuhhZxBMXcnbvUaZJ/48c4d4528d8f57e371c071e1c661ad9e/____________________________2021-09-21_21.26.07.png)

props のデフォルト値を定義する場合には、 `withDefaults` を使用します。

```ts
const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  placeholder: "",
  disabled: false,
});
```

## emit

emit も props と同様に、TypeScript により型定義をすることが可能です。

```vue
 <script setup lang="ts">
interface Emits {
  (e: "input", value: string): void;
  (e: "update:value", value: string): void;
}

const emit = defineEmits<Emits>();

const handleInput = ({ target }: { target: HTMLInputElement }) => {
  emit("input", target.value);
  emit("update:value", target.value);
};
</script>

<template>
  <label>
    {{ label }}
    <input
      :class="disabledClass"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="handleInput"
    />
  </label>
</template>
```

もちろんしっかりと型が効いています。

![スクリーンショット 2021-09-21 21.28.04](//images.contentful.com/in6v9lxmm5c8/9hG0SGO53A8CtgOWUlF2E/ec426ebbc51da0bae473faee9e06021f/____________________________2021-09-21_21.42.13.png)

![スクリーンショット 2021-09-21 21.41.06](//images.contentful.com/in6v9lxmm5c8/54dunEa2wQWjvecj4yNO83/2afee7cc1c82b13cbdc2d9dbdc6774a0/____________________________2021-09-21_21.41.06.png)

## useSlots と useAttrs

Composition API では、 `setup()`　関数の第 2 引数から `$slots` と `$attrs` を取得していましたが、 `<script setup>` では代わりに `useSlots()` と `useAttrs()` を使用します。

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

## 通常の `<script>` と使う

`<script setup>` と通常の `<script>` は 1 つの単一ファイルコンポーネントに同時に定義できます。
これは以下の用途で使用されます。

- `inferitAttrs` オプションなど `<script setup>` では設定できないオプションを定義するとき
- 副作用のある操作を**一度だけ**実行したいとき（`<script setup>` はコンポーネントが作成されるたびに実行されます）

```vue
<script setup lang="ts">
interface Props {
  value: string;
  label?: string;
  type?: "text" | "password" | "email" | "number";
  placeholder?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  type: "text",
  placeholder: "",
  disabled: false,
});
</script>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  inheritAttrs: false,
});
</script>

<template>
  <label>
    {{ label }}
    <input
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />
  </label>
</template>
```

## トップレベル await

`<script setup>` の中ではトップレベル await が使えます。

- AsyncUserList.vue

```vue
<script setup lang="ts">
import { ref } from "@vue/reactivity";

interface User {
  id: number;
  username: string;
}

const result = await fetch("https://jsonplaceholder.typicode.com/users");
const json = await result.json();

const users = ref<User[]>(json);
</script>

<template>
  <ul>
    <li v-for="user in users" :key="user.id">
      {{ user.username }}
    </li>
  </ul>
</template>
```

注意点として、 `await` を使用した時点でそのコンポーネントは **Promiseを返す非同期コンポーネント**として扱われます。

つまりは、必ず `<Suspense>` と組み合わせ使う必要があるということです。

詳しくは以下を参照してください。

https://v3.ja.vuejs.org/guide/migration/suspense.html#%E4%BB%96%E3%81%AE%E3%82%B3%E3%83%B3%E3%83%9B%E3%82%9A%E3%83%BC%E3%83%8D%E3%83%B3%E3%83%88%E3%81%A8%E3%81%AE%E7%B5%84%E3%81%BF%E5%90%88%E3%82%8F%E3%81%9B

- App.vue

```vue
<script lang="ts" setup>
import AsyncUserList from "./components/AsyncUserList.vue";
</script>

<template>
  <Suspense>
    <AsyncUserList />
  </Suspense>
</template>
```

紹介しておいてなんですが `<Suspense>` 自体が実験的な機能であるので、トップレベル await の使用は控えたほうがよいでしょう。
