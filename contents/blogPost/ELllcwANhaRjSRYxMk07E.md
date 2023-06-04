---
id: ELllcwANhaRjSRYxMk07E
title: Vue.js でジェネリックコンポーネントを使う
slug: vue-generic-component
about: "Vue.js 3.3 から `<script setup>` 構文を使用してコンポーネントを記述する際に、型引数を指定することができるようになりました。TypeScript で関数に型引数を指定するのと同じように、コンポーネントの props の型を指定することができます。"
createdAt: "2023-06-04T14:16+09:00"
updatedAt: "2023-06-04T14:16+09:00"
tags: ["Vue.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6VNUyPtmK0OyhUZ47iAu2R/e6e54f19bf6f82a50199f8e8434a8c22/___Pngtree___shine_jewelry_white_diamond_5318738.png"
  title: "white diamond"
published: true
---

Vue.js 3.3 から `<script setup>` 構文を使用してコンポーネントを記述する際に、型引数を指定することができるようになりました。TypeScript で関数に型引数を指定するのと同じように、コンポーネントの props の型を指定することができます。

すでに React においては、コンポーネントに型引数を指定してジェネリックコンポーネントとして扱うことができましたが、Vue.js でも同様のことができるようになりました。

## 基本的な構文

`<script>` タグに `generic` 属性を指定することで、型引数を指定できます。

```vue:components/MyComponent.vue
<script setup lang="ts" generic="T">
import { defineProps } from 'vue'

const props = defineProps<{
  value: T
}>()
</script>
```

通常の型引数と同様に、`extends` キーワードを使用して、型引数に制約をつけることもできます。以下の例において型引数 `T` を持つ `value` Props は `string` 型か `number` 型である必要があります。

```vue:components/MyComponent.vue
<script setup lang="ts" generic="T extends string | number">
const props = defineProps<{
  value: T;
}>();
</script>
```

`,` で区切って複数の型引数を指定することもできます。

```vue:components/MyComponent.vue
<script setup lang="ts" generic="T extends string | number, U">
const props = defineProps<{
  value: T;
  value2: U;
}>();
</script>
```

## ジェネリックコンポーネントの使用例

`<script setup>` 構文を使用して、ジェネリックコンポーネントを使用する例を紹介します。ここでは `<SelectBox>` コンポーネントを作ってみましょう。セレクトボックスをコンポーネントと定義するとき、`value` Props が受け入れる型は選択肢が持つ型に制限したくなるでしょう。例えば選択肢として `"red", "blue", "green"` がある場合、型引数を使用しない場合次のようになるでしょう。

```vue:components/ColroSelectBox.vue
<script setup lang="ts">
type Color = "red" | "green" | "blue";

const { items, value } = defineProps<{
  items: Color[];
  value: Color;
}>();

const emit = defineEmits<{
  (e: "change", value: Color): void;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("change", target.value as Color);
};
</script>

<template>
  <select :value="value" @change="handleChange">
    <option
      v-for="item in items"
      :key="item"
      :value="item"
      :selected="item === value"
      @change="() => emit('change', item)"
    >
      {{ item }}
    </option>
  </select>
</template>
```

`defineProps` でコンポーネントの Props を定義する際に、選択肢を表す `items` と値を表す `value` 型に同じ `Color` 型を指定しています。また同様に `defineEmits` でイベントを定義する際にも、`value` 型に `Color` 型を指定してセレクトボックスの選択肢に持つ型のみを受け入れるようにしています。

このコンポーネントを使用する際と、`value` Props にカーソルを合わせたときに "red", "green", "blue" のいずれかの文字列が候補として表示されるようになります。また、`"red", "green", "blue"` 以外の文字列を指定すると型エラーが発生するようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6NyAQ6R2yI7zh5cLxBUZml/caa32cc363088d831e2669b283e9c061/____________________________2023-06-04_14.44.03.png)

コンポーネントの Props が受け入れる型を制限することで恩恵を受けることができますが、このコンポーネントは汎用的に使用できないという欠点があります。別の種類の選択肢をもつセレクトボックスを作成するたびに、`Color` 型だけを変更した似た処理を複数のコンポーネントで実装しなければいけません。

そこで型引数を使用したジェネリックコンポーネントを作成することで、様々な選択肢を受け入れる汎用的なコンポーネントを作成できます。`<script>` タグに `generic` 属性を指定して型引数を指定し、`Color` 型を型引数 `T` に置き換えてみましょう。

```vue:components/SelectBox.vue
<script setup lang="ts" generic="T extends string | number">
const { value, items } = defineProps<{
  items: T[];
  value: T;
}>();

const emit = defineEmits<{
  change: [value: T];
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("change", target.value as T);
};
</script>

<template>
  <select :value="value" @change="handleChange">
    <option
      v-for="item in items"
      :key="item"
      :value="item"
      :selected="item === value"
      @change="() => emit('change', item)"
    >
      {{ item }}
    </option>
  </select>
</template>
```

この `<SelectBox>` コンポーネントは先程の `<ColorSelectBox>` コンポーネント同じように、`value` Props が受け取る型を `items` の型に制限できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4gzcvgBMlvQuzTr5SYkwpL/fdcc1401e5a9b59afc2090370da7a4d9/____________________________2023-06-04_14.54.17.png)

## まとめ

- `<script>` タグに `generic` 属性を指定することで、コンポーネントの型引数を指定できるようになった
- 型引数を使用することで、汎用的なコンポーネントを作成できるようになる

## 参考

- [Announcing Vue 3.3](https://blog.vuejs.org/posts/vue-3-3)