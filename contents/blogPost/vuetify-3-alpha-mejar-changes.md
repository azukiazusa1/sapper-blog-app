---
id: 7iV9EA9pt8XuugJTV8anSZ
title: "Vuetify 3 Alpha の主な変更点"
slug: "vuetify-3-alpha-mejar-changes"
about: "[Vuetify](https://vuetifyjs.com/) は Vue.js で多く使われている UI コンポーネントです。現在のバージョンは Vue 3 には対応していません。  現在 Vue 3 に対応する Alpha 版の Vuetify 3 が公開されています。開発スケジュールは以下のとおりになっています。"
createdAt: "2021-12-19T00:00+09:00"
updatedAt: "2021-12-19T00:00+09:00"
tags: ["Vuetify", "Vue.js"]
published: true
---
[Vuetify](https://vuetifyjs.com/) は Vue.js で多く使われている UI コンポーネントです。現在のバージョンは Vue 3 には対応していません。

現在 Vue 3 に対応する Alpha 版の Vuetify 3 が公開されています。開発スケジュールは以下のとおりになっています。

> リリース目標: 2022年2月
> アルファ: 2021年 3月
> ベータ: 2021年12月

https://next.vuetifyjs.com/ja/introduction/roadmap/#section-958b767a4e2d

まだ Alpha 版で安定しないバージョンではありますが Vuetify 3 でどのような機能が追加されるんか見ていきましょう。

## インストール

### vue-cli

vue-cli 4.0 を利用してプロジェクトを作成します。

```sh
vue create my-app
```

`Vue 3` を選択します。

```sh
? Please pick a preset: 
  Default ([Vue 2] babel, eslint) 
❯ Default (Vue 3) ([Vue 3] babel, eslint) 
  Manually select features 
```

Vuetify をプロジェクトに追加します。

```sh
cd my-vue-app/
vue add vuetify
```

`Vuetify 3 Preview (Vuetify 3)` を選択します。

```sh
? Choose a preset: (Use arrow keys)
  Configure (advanced)
  Default (recommended)
  Vite Preview (Vuetify 3 + Vite)
  Prototype (rapid development)
> Vuetify 3 Preview (Vuetify 3)
```

### Vite

`Vuetify 3` は `Vite` でも使用することでできます。まずは `Vite` のドキュメントにある手順のとおりにプロジェクトを作成します。

https://ja.vitejs.dev/guide/#%E6%9C%80%E5%88%9D%E3%81%AE-vite-%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E7%94%9F%E6%88%90%E3%81%99%E3%82%8B

```sh
# npm 6.x
npm init vite@latest my-vue-app --template vue

# npm 7+ は追加で 2 つのダッシュが必要:
npm init vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue

# pnpm
pnpm create vite my-vue-app -- --template vue
```

Vuetify をプロジェクトに追加します。

```sh
cd my-vue-app/
vue add vuetify
```

`Vite Preview (Vuetify 3 + Vite)` を選択します。

```sh
? Choose a preset: (Use arrow keys)
  Configure (advanced)
  Default (recommended)
  Vite Preview (Vuetify 3 + Vite)
  Prototype (rapid development)
> Vuetify 3 Preview (Vuetify 3)
```

### Vuetify の初期化

`Vuetify 2` までは `new Vuetify()` のように Vuetify インスタンスを生成していましたが `Vuetify 3` からは `Vue 3` の `createApp` のように `createVuetify` をインポートして Vuetify インスタンスを生成します。
（ `Vue 3` と同じく tree shaking を効かせるためかと思います）

- Vuetify 2

```ts
// src/main.ts
import Vue from 'vue'
import Vuetify from 'vuetify'

const vuetify = new Vuetify({})
Vue.use(vuetify)

new Vue({
  vuetify,
}).$mount('#app')
```

- Vuetify 3

```ts
// src/main.ts
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'

const vuetify = createVuetify({})

createApp(App)
  .use(vuetify)
  .mount('#app')
```

## デフォルト Prop

Vuetify のインスタンスを生成する際にオプションとしてあるコンポーネントに対してデフォルトの Props を設定することができるようになりました。

例えば、以下のようにボタンに対するデフォルトの props を設定できます。

```js
// src/plugins/vuetify.js
import { createVuetify } from "vuetify";

export default createVuetify({
  defaults: {
    VBtn: {
      flat: true,
      disabled: true,
    },
  },
});
```

以下のように props を指定しないで `<v-btn>` を配置しても、デフォルト Prop が適用されています。

```vue
<template>
  <v-app class="app">
    <div class="flex ma-2">
      <v-btn>Button</v-btn>
    </div>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 16.03.58](//images.ctfassets.net/in6v9lxmm5c8/7awUN8H7ZOqTl90F0xMg5i/f1bec5d4d76ae558cd0cac8e750215c7/____________________________2021-12-19_16.03.58.png)

Props は以下の優先度で適用されます。

1. コンポーネントに直接渡された Props
2. `defaults` で設定した Props
3. Vuetify のデフォルトの Props

#### Defaults providers

`<v-defaults-provider>` コンポーネントを利用すると Default providers 配下のコンポーネントにのみ上書きして `defaults` の設定を適用することができます。

```vue
<template>
  <v-app class="app">
    <div class="flex ma-2">
      <v-btn>Button</v-btn>
      <v-defaults-provider :defaults="defaults">
        <v-btn>Button inside providers </v-btn>
      </v-defaults-provider>
    </div>
  </v-app>
</template>

<script setup>
const defaults = {
  VBtn: {
    color: "secondary",
    disabled: false,
  },
};
</script>
```

![スクリーンショット 2021-12-19 16.14.53](//images.ctfassets.net/in6v9lxmm5c8/6sNZjvz7jY434wrv7w0wPg/a04ca62f989165e53bbb3ba27b977717/____________________________2021-12-19_16.14.53.png)

## テーマ

### カスタムテーマ

Vuetify の提供する `ligth` と `dark` のテーマに加えてカスタムのテーマを設定できるようになりました。（それに伴い theme の `isDark` プロパティは削除されました）

使用するテーマは `defaultTheme` プロパティで設定できます。

```ts
// src/plugins/vuetify.ts
import { createVuetify, ThemeDefinition } from "vuetify";

const myCustomTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#FF7043',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme
    }
  }
});
```

### テーマの変更

ユーザーが動的にアプリケーションのテーマを切り替えることができるようにするためには `<v-app>` に `theme` props を渡すことで切り替えることができます。

```vue
<template>
  <v-app :theme="theme">
    <v-container class="px-0" fluid>
      <v-radio-group v-model="theme">
        <v-radio color="primary" label="Light Theme" value="light" />
        <v-radio color="primary" label="Dark Theme" value="dark" />
        <v-radio color="primary" label="My Custom Theme" value="myCustomTheme" />
      </v-radio-group>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref } from "vue";

const theme = ref("light");
</script>
```

![vuetyfy-change-theme](//images.ctfassets.net/in6v9lxmm5c8/OfvmLVPevrzSlht0fzHEk/e8fb2e762bed1451db3a3740c0c839f1/vuetyfy-change-theme.gif)

### Theme providres

`<v-theme-provider>` コンポーネントは配下のコンポーネントのみにテーマを適用することができます。

デフォルトでは `<v-theme-provider>` 内では背景色は元のテーマのままとなります。背景色にもテーマを適用させるには、`with-background` props を渡します。

```vue
<template>
  <v-app>
    <v-theme-provider theme="dark">
      <div class="pa-10">
        <v-card title="Title" subtitle="Subtitle"></v-card>
      </div>
    </v-theme-provider>
    <v-theme-provider theme="light">
      <div class="pa-10">
        <v-card title="Title" subtitle="Subtitle"></v-card>
      </div>
    </v-theme-provider>
    <v-theme-provider theme="dark" with-background>
      <div class="pa-10">
        <v-card title="Title" subtitle="Subtitle"></v-card>
      </div>
    </v-theme-provider>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 16.59.50](//images.ctfassets.net/in6v9lxmm5c8/6cAFwjhi9FloNgwtv1ev7K/5d54917b7c18f88448ac9c063e0d941c/____________________________2021-12-19_16.59.50.png)

### コンポーネント単位のテーマ

`Vuetify 2` ではコンポーネント単位でダークテーマを適用させたい場合には `dark` props を渡して設定していました。

- Vuetify 2

```vue
<template>
  <v-app>
    <v-container>
      <v-card dark>
        <v-card-title>card title</v-card-title>
      </v-card>
    </v-container>
  </v-app>
</template>
```

`Vuetify 3` では前述のとおり `light` と `dark` 以外のテーマも設定できるので代わりに `theme` props で設定します。

```vue
<template>
  <v-app>
    <v-container>
      <v-card theme="dark">
        <v-card-title>card title</v-card-title>
      </v-card>
    </v-container>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 18.51.01](//images.ctfassets.net/in6v9lxmm5c8/4Bti28ykX9PVj6e6s8Kovb/e3e9845df75eb35c1efc3e50939797d1/____________________________2021-12-19_18.51.01.png)

## ブレークポイント

`Vuetify 2` では JavaScript から現在のブレークポイントにアクセスするために `this.$vuetify.breakpoints` からアクセスすることができました。例えば現在の画面サイズが `sm` 以下の場合にのみ実行したい場合には以下のようにします。

- Vuetify 2

```ts
<template>
  <v-app>
    <h1>{{screenName}}</h1>
  </v-app>
</template>

export default {
  computed: {
    screenName() {
      if (this.$vuetify.breakpoints.smAndDown) {
        return 'mobile'
      } else {
        return 'desktop'
      }
    }
  }
}
```

`Vuetify 3` では `useDisplay()` 関数により現在のブレークポイントを取得できます。`useDisplay()` の返り値は `ref` でラップされているのでリアクティブ変数です。

- Vuetify 3

```vue
<template>
  <v-app>
    <h1>{{ screenName }}</h1>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";
const display = useDisplay();

const screenName = computed(() => {
  if (display.smAndDown.value) {
    return "mobile";
  } else {
    return "desktop";
  }
});
</script>
```

### プラットフォーム

`useDisplay()` から新たにユーザーエージェントの情報を取得できるようになりました。

```
  platform: {
    android: boolean
    ios: boolean
    cordova: boolean
    electron: boolean
    chrome: boolean
    edge: boolean
    firefox: boolean
    opera: boolean
    win: boolean
    mac: boolean
    linux: boolean
    touch: boolean
    ssr: boolean
  }
 ```

 ```vue
 <script setup>
import { useDisplay } from "vuetify";
const display = useDisplay()

if (display.platform.value.chrome) {
  console.log('I am chrome')
} else if (display.platform.value.firefox) {
  console.log('I am firefox')
} else if (display.platform.value.edge) {
  console.log('I am edge')
}
</script>
```

## カード

新しいコンポーネントがいっぱい増えています。が、詳細は不明です。

- v-card-avatar
- v-card-header
- v-card-header-text
- v-card-img
- v-card-media

## イメージ

`<v-img>` の `contain` props は削除されデフォルトで `contain` が挙動となるようになりました。`Vuetify 2` までの挙動を維持するために新たに `cover` props が追加されました。

つまり、以下の2つのコードは同等のものとなります。

- Vuetify 2

```vue
<template>
  <v-img src="/images/sample.png" contain />
</template>
```

- Vuetify 3

```vue
<template>
  <v-img src="/images/sample.png" />
</template>
```

`Vuetify 2` では画像の表示するため `<div>` タグに `background-image` を指定していましたが `Vuetify 3` からは `<img>` タグを使用するようになりました。

## ボタン

### サイズ

以下のサイズを決定する props は削除され、代わりに `size` プロパティで指定するようになりました。

- `x-small`
- `small`
- `large`
- `x-large`

- Vuetify 2

```vue
<template>
  <v-app class="app">
    <div class="flex flex-colmun">
      <v-btn color="primary" class="mx-2" x-small>Extra Small Button</v-btn>
      <v-btn color="primary" class="mx-2" small>Small Button</v-btn>
      <v-btn color="primary" class="mx-2">Default Button</v-btn>
      <v-btn color="primary" class="mx-2" large>Large Button</v-btn>
      <v-btn color="primary" class="mx-2" x-large>Extra Large Button</v-btn>
    </div>
  </v-app>
</template>
```
- Vuetify 3

```vue
<template>
  <v-app class="app">
    <div class="flex flex-colmun">
      <v-btn color="primary" class="mx-2" size="x-small">Extra Small Button</v-btn>
      <v-btn color="primary" class="mx-2" size="small">Small Button</v-btn>
      <v-btn color="primary" class="mx-2" size="default">Default Button</v-btn>
      <v-btn color="primary" class="mx-2" size="large">Large Button</v-btn>
      <v-btn color="primary" class="mx-2" size="x-large"
        >Extra Large Button</v-btn
      >
    </div>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 16.05.13](//images.ctfassets.net/in6v9lxmm5c8/40UYA3CXSR3wtMaSWUsSss/50d48b8f85cebfdd1c3d88b73e3d78fd/____________________________2021-12-19_16.05.13.png)

## variant
以下の props は廃止され代わりに `variant` で指定するようになりました。

- `text`
- `outlined`
- `plain`

`variant` には以下を設定できます。

- 'contained'
- 'outlined' 
- 'plain'
- 'text'
- 'contained-text'

- Vuetify 2

```vue
<template>
  <v-app>
    <v-container>
      <v-btn color="primary" text>text button</v-btn>
      <v-btn color="primary" outlined>outlined button</v-btn>
      <v-btn color="primary" plain>outlined button</v-btn>
    </v-container>
  </v-app>
</template>
```

- Vuetify 3

```vue
<template>
  <v-app>
    <v-container>
      <v-btn color="primary" variant="outlined">outlined button</v-btn>
      <v-btn color="primary" variant="text">text button</v-btn>
      <v-btn color="primary" variant="plain">plain button</v-btn>
      <v-btn color="primary" variant="contained">contained button</v-btn>
      <v-btn color="primary" variant="contained-text">contained-text button</v-btn>
    </v-container>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 17.55.23](//images.ctfassets.net/in6v9lxmm5c8/4vOUVa7Dini1EIEvJVSb69/e2dd5f29de212cb3f2225be8290f49be/____________________________2021-12-19_17.55.23.png)

`depressed` は廃止され代わりに `flat` となりました。
`stacked` プロパティが追加されました。（詳細は不明）

```vue
<template>
  <v-app>
    <v-container>
      <v-btn color="primary" stacked>stacked button</v-btn>
      <v-btn color="primary" flat>flat button</v-btn>
    </v-container>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 17.57.22](//images.ctfassets.net/in6v9lxmm5c8/s9fafMZurx6FUwAijadio/60b9d5801da1e2826ed84ebead7f95d3/____________________________2021-12-19_17.57.22.png)

## No SSR

`<v-no-ssr>` コンポーネント配下はサーバーサイドでは実行されなくなります。

## 共通 Props?

いろんなコンポーネントに `position` props を渡せるようになったようです。

- interface

```ts
export interface PositionProps {
  absolute?: boolean
  bottom?: boolean | number | string
  fixed?: boolean
  left?: boolean | number | string
  position?: Position
  right?: boolean | number | string
  top?: boolean | number | string
}
```

```vue
<template>
  <v-app>
    <v-container>
      <v-btn absolute top="100">button</v-btn>
      <v-card
        absolute
        top="0"
        left="200"
        title="title"
        subtitle="subtitle"
      ></v-card>
    </v-container>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 18.41.58](//images.ctfassets.net/in6v9lxmm5c8/6MVe9Tpb7jcATvIXaPtIr4/d88b7fa10d34232dfedf03b0bf523f30/____________________________2021-12-19_18.41.58.png)[

`position` 以外にも以下の props はコンポーネントの共通の props と定義されているっぽい？

- `density`
- `height`
- `maxHeight`
- `maxWidth`
- `minHeight`
- `minWidth`
- `width`
- `theme`
- `tag`
- `elevation`
- `border`
- `rounded`

## v-intersect

`v-intersect` ディレクティブの引数の順番が変わり `isIntersecting`　が初めの引数になりました。

## v-kbd 

[kbd](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd)をラップしたコンポーネント？

```vue
  <template>
  <v-app>
    <v-container>
      <v-kbd>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum, magnam
        repudiandae. Porro dolorum quo nesciunt laboriosam minus voluptate,
        reiciendis quibusdam necessitatibus debitis rerum cum inventore.
        Necessitatibus nostrum quo minima quia?
      </v-kbd>
    </v-container>
  </v-app>
</template>
```

![スクリーンショット 2021-12-19 19.13.08](//images.ctfassets.net/in6v9lxmm5c8/7akePmW3jtXOHSv2LJRR3p/cee00a695b54f1c5401ab1cbf54ab3e6/____________________________2021-12-19_19.13.08.png)
