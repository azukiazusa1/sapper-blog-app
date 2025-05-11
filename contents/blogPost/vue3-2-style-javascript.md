---
id: 1LJPP3iVeEd2I1PwxWDdCM
title: "【Vue3.2】styleタグ内でJavaScript変数をバインドできる"
slug: "vue3-2-style-javascript"
about: "Vue.js3.2からは、JavaScriptの変数をCSS変数としてバインドできるようになりました。  つまりは、CSSの値を動的に設定できるということです。  ものは試しのやってみましょう。"
createdAt: "2021-09-19T00:00+09:00"
updatedAt: "2021-09-19T00:00+09:00"
tags: ["", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/KlxddWUk3mnLDCFG4qxu2/f36940cc38418e433c2b6be88032e44c/articles_2FuOVZsTkluuNqWfpBJSFq_2Fthumbnail_7D.png"
  title: "Vue.js"
audio: null
selfAssessment: null
published: true
---
Vue.js3.2 からは、JavaScript の変数を CSS 変数としてバインドできるようになりました。

つまりは、CSS の値を動的に設定できるということです。

ものは試しのやってみましょう。

```vue
<script setup lang="ts">
import { ref } from "@vue/reactivity";
const color = ref("#000000");
</script>

<template>
  <h1 class="title">タイトル</h1>
  <input type="color" v-model="color" />
</template>

<style>
.title {
  color: v-bind(color);
}
</style>
```

`<script>` タグ内で宣言した `color` という変数を `<style>` タグ内で `v-bind(color);` として使用しています。

生成された CSS を見てみると、以下のような感じになっています。

![スクリーンショット 2021-09-19 22.41.48](//images.contentful.com/in6v9lxmm5c8/3m4rIIOwj1HDzFkxVt5GUS/2d8df58ddea780714b7fbafd15355b4d/____________________________2021-09-19_22.41.48.png)

1. `--7ba5bd90-color` のようにハッシュ化された CSS 変数がインラインスタイルとして定義されます。
2. `<style>` タグでバインドした JavaScippt 変数は上記のハッシュ化された CSS 変数が適用されます。

もちろん、JavaScript で宣言したリアクティブな変数の値が変更されるたびに CSS 変数の値も変化されます。

![css-bind](//images.contentful.com/in6v9lxmm5c8/5zACPhuaBBkRFwAf1Si9q8/a9c25531c0e612ddfe26be426719d76c/css-bind.gif)

ここまでが基本的な機能の説明です。他にもいろいろ試してみましょう。

## JavaScript式の展開

VSCode にはなにか怒られるけれど、`<template>` での `v-bind` と同じく三項演算子など JavaScript の式を評価させることができます。

JavaScipt の式を評価させる場合にはクォートで加工必要があるようです。

```vue
<script setup lang="ts">
import { ref } from "@vue/reactivity";

const theme = ref<"dark" | "light">("dark");

const toggleTheme = () => {
  if (theme.value === "dark") {
    theme.value = "light";
  } else {
    theme.value = "dark";
  }
};
</script>

<template>
  <div class="container">
    <h1 class="title">タイトル</h1>
    <button @click="toggleTheme">テーマ変更</button>
  </div>
</template>

<style scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-color: v-bind('theme === "dark" ? "#000": "#fff"');
  color: v-bind('theme === "dark" ? "#fff": "#000"');
}
</style>

```

![css-bind](//images.contentful.com/in6v9lxmm5c8/64QanuWjtALtgvjI1D5kf7/2922c022f1e206b9ace447eb505a596f/css-bind-operator.gif)

## 配列やオブジェクトを渡す

`v-bind` に配列を渡すとカンマ区切りで展開されます。単純に `array#toString` が呼ばれているようです。

```css
.title {
  color: v-bind([ "red", "green", "blue" ]);
}
```

```css
style attribute {
    --7ba5bd90-colors: red,green,blue;
}
```

オブジェクトも同様です。

```vue
<script setup lang="ts">
import { ref } from "@vue/reactivity";

const themes = ref({
  light: {
    textColor: "#fff",
  },
  dark: {
    textColor: "#000",
  },
});
</script>

<style scoped>
.title {
  color: v-bind(themes);
}
</style>
```

```css
style attribute {
    --7ba5bd90-themes: [object Object];
}
```

## v-bindが使える場所

`<style>` タグ内ならどこでも `v-bind` が使えるわけではないっぽい。

```css
<style scoped>
// Unknown word
.container {
  v-bind(container)
}
</style>
```

```css
<style scoped>
// Unknown word
v-bind(container)
</style>
```

## 関数呼び出し

JavaScript の式を評価できるので、こちらも当然できますね。

```vue
<script setup lang="ts">
const textColor = () => {
  return Math.random() < 0.5 ? "red" : "blue";
};
</script>

<template>
  <div class="container">
    <h1 class="title">タイトル</h1>
  </div>
</template>

<style scoped>
.title {
  color: v-bind("textColor()");
}
</style>
```

関数宣言でも有効です。

```vue
<script setup lang="ts">
function textColor() {
  return Math.random() < 0.5 ? "red" : "blue";
}
</script>

<template>
  <div class="container">
    <h1 class="title">タイトル</h1>
  </div>
</template>

<style scoped>
.title {
  color: v-bind("textColor()");
}
</style>
```

## CSSのコメントで囲った文字列をバインドする

CSS のコメントで囲った箇所はしっかり消えていますね。

```vue
<script setup lang="ts">
const color = `/* red */blue`;
</script>

<template>
  <div class="container">
    <h1 class="title">タイトル</h1>
  </div>
</template>

<style scoped>
.title {
  color: v-bind(color);
}
</style>
```

```css
element.style {
    --7ba5bd90-color: blue;
}
```

## v-bindでCSS変数の参照

これはできないです。

```vue
<script setup lang="ts">
const color = "--main-bg-color";
</script>

<template>
  <div>
    <h1 class="color">タイトル</h1>
    <button class="color" @click="onclick">Button</button>
  </div>
</template>

<style>
:root {
  --main-bg-color: brown;
}
</style>

<style scoped>
.color {
  color: var(v-bind(color));
}
</style>
```

これはできます。

```vue
<script setup lang="ts">
const color = "var(--main-bg-color)";
</script>

<template>
  <div>
    <h1 class="color">タイトル</h1>
    <button class="color" @click="onclick">Button</button>
  </div>
</template>

<style>
:root {
  --main-bg-color: brown;
}
</style>

<style scoped>
.color {
  color: v-bind(color);
}
</style>
```

## バインドしたCSSクラスを使用している要素のstyleを動的nullに変更すると・・・?

つまりこういうこと。

```vue
<script setup lang="ts">
import { ref } from "vue";

const style = ref<any>({ fontSize: "40px" });
const onclick = () => {
  style.value = null;
};

const color = "red";
</script>

<template>
  <h1 class="color" :style="style">タイトル</h1>
  <button class="color" @click="onclick">Button</button>
</template>

<style scoped>
.color {
  color: v-bind(color);
}
</style>
```

正しい動作なのかよくわからないですが、`style` をバインドしていた場合その値を `null` にするとインラインスタイルに展開されていた CSS 変数も消えてしましまいます。

![style-binding](//images.contentful.com/in6v9lxmm5c8/7k9GqQRi1P8nAwHwU2xtMo/d6a2f49fa2cdfe06d131d06946d6d5e2/style-binding.gif)

ちなみに、`<template>` にルート要素がある場合その要素に対して CSS 変数が展開されるので、ルート要素の style を `null` にするとすべての CSS 変数が消えてしまいます。

```vue
<script setup lang="ts">
import { ref } from "vue";

const style = ref<any>({ fontSize: "20px" });
const onclick = () => {
  style.value = null;
};

const color = "red";
</script>

<template>
  <div :style="style">
    <h1 class="color">タイトル</h1>
    <button class="color" @click="onclick">Button</button>
  </div>
</template>

<style scoped>
.color {
  color: v-bind(color);
}
</style>
```

![root-style-binding](//images.contentful.com/in6v9lxmm5c8/2L8HuUhWjjlnJFmeMhpnQ/7db21b4d1d53dcb246e2beb3d6930ef8/root-style-binding.gif)
