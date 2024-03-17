---
id: 1OhUFZZTmft8nVWO8EWjOG
title: "VuetifyのテーマをCSS変数として使用する"
slug: "vuetify-theme-css-variables"
about: "VuetifyのテーマをCSSの変数として生成して使用します。"
createdAt: "2021-08-22T00:00+09:00"
updatedAt: "2021-08-22T00:00+09:00"
tags: ["Vue.js", "Vuetify"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2syUTBqt1yNSCib7itM2j3/ae8f0d236741f62a03f953532436f0e3/22138497.png"
  title: "vuetify"
selfAssessment: null
published: true
---
# 結論

オプションとして `customProperties:true` を渡します。

```js
import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        main: '#D7F9F1',
        secondary: '#7AA095',
      }
    },
    options: { customProperties: true },
  },
})
```

後は、`--v-{テーマ名}-base` という名前で CSS 変数として利用できます。

```html
<style scoped>
.bg {
  background-color: var(--v-main-base);
}

.text {
  color: var(--v-secondary-base);
}
</style>
```

# Vuetifyのテーマとは

Vuetify では、カラーコードをテーマとして設定できます。
テーマとして設定をしておけば、コード上で `#D7F9F1` のようにカラーコードを直接埋め込む代わりに、`main` のようなわかりやすい名前で使うことができます。

またアプリケーション内で使用可能なカラーをすべてテーマとして定義しておくことで、デザインの一貫性を保つことができます。

デフォルトの標準テーマとして、以下が設定されています。

```js
{
  primary: '#1976D2',
  secondary: '#424242',
  accent: '#82B1FF',
  error: '#FF5252',
  info: '#2196F3',
  success: '#4CAF50',
  warning: '#FFC107',
}
```

これらのテーマ一部を上書きをできますし、新たなテーマ名を設定することもできます。
デフォルトのテーマから変更するには、Vuetify のコンストラクタにオプションとして渡すことでおこなえます。

```js
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        main: '#D7F9F1',
        secondary: '#7AA095',
      },
    },
  },
});
```

# テーマを利用する

設定したテーマは、ほぼすべてのコンポーネントに対して利用できます。

例えば、`v-btn` コンポーネントでは、`color`props に対してテーマ名を渡すことでボタンの色を設定します。

```html
<template>
  <v-btn color="main">ボタン</v-btn>
</template>
```

![スクリーンショット 2021-08-22 21.41.49](//images.contentful.com/in6v9lxmm5c8/4k3O816YhanOHc0zlZl3x9/103a5b52bf5f23f8204d3b8e48fffe14/____________________________2021-08-22_21.41.49.png)

またスクリプトからは `$vuetify` オブジェクトからアクセスできます。

```html
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  created() {
    console.log(this.$vuetify.theme.themes.light.main) // #D7F9F1;
  },
});
</script>
```

# CSSから使用する

それでは、タイトルのとおりに Vuetify のテーマを CSS から使用してみましょう。

theme のオプションに `customProperties:true` を渡すことですべてのテーマが CSS 変数として生成されます。

```diff
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        main: '#D7F9F1',
        secondary: '#7AA095',
      },
    },
+   options: { customProperties: true },
  },
});
```

デバッグツールを開くと、ルート要素に確かに生成されていることがわかります。

![スクリーンショット 2021-08-22 21.52.58](//images.contentful.com/in6v9lxmm5c8/3vDMcRK3fnDpv8WO5DVbIR/d9f37a1d096448c56c7076848d299a3b/____________________________2021-08-22_21.52.58.png)

思ったよりもたくさん生成されていますが、これは Vuetify がテーマに渡したカラーコードに対して `lighten4`・`darken2` のようにテーマの色のバリエーションを自動で生成するためです。

```diff
import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        main: '#D7F9F1',
        secondary: '#7AA095',
      },
    },
-   options: { customProperties: true },
+   options: { customProperties: true, variations: false },
  },
});

```

もしこの機能がおせっかいだと感じるのであれば、`variations: false` を渡すことでバリエーション自動生成を行わないようにできます。

さきほどよりも生成された CSS 変数が確かに減っていることがわかります。

![スクリーンショット 2021-08-22 21.58.26](//images.contentful.com/in6v9lxmm5c8/KoXgXabdgkbhyzxqAPisX/ba9cc25970a3edcf80316248375960da/____________________________2021-08-22_21.58.26.png)

後は、通常の CSS 変数と同じように利用できます。

```html
<template>
  <div class="bg">
    <span class="text">こんにちは！</span>
  </div>
</template>

<style scoped>
.bg {
  background-color: var(--v-main-base);
  min-height: 100vh;
}

.text {
  color: var(--v-secondary-base);
  font-weight: 600;
  font-size: 16px;
}
</style>
```

![スクリーンショット 2021-08-22 22.06.04](//images.contentful.com/in6v9lxmm5c8/3DzSbX387Ck1CXkZtvWLVF/a06a39fc0b37ed270114f12c876b7025/____________________________2021-08-22_22.06.04.png)
