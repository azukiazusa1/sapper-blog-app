---
id: 2oGt0MYxBhCU7SrCDlOA11
title: "【Vue.js】Mixinを使うのはもうやめよう"
slug: "vue-js-mixin"
about: "禁止まで言ってしまうとなんだか強い言葉のように聞こえてしまいますが、mixinは基本的にあまり良いアプローチとは考えられません。  実際に、Reactにも過去にはMixinが存在していましたが現在は廃止されています。"
createdAt: "2021-09-05T00:00+09:00"
updatedAt: "2021-09-05T00:00+09:00"
tags: ["Vue.js"]
published: true
---
# mixin禁止

禁止まで言ってしまうとなんだか強い言葉のように聞こえてしまいますが、mixinは基本的にあまり良いアプローチとは考えられません。

実際に、Reactにも過去にはMixinが存在していましたが現在は廃止されています。

https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html

主なmixinの問題のある点として以下の点が挙げられます。

- 名前の競合
- 暗黙的挙動のため認知不可が高い
- コンポーネントとmixinで互いに依存が生まれる
- (Options APIの場合には)TypeScriptの恩恵を受けられない

## 名前の競合

ここで問題ですが、mixinA・mixinB・mixinを利用するコンポーネントの3つにそれぞれ同じ名前のメソッドが定義されている場合、そのメソッドを呼出したときの挙動はどのようになるでしょうか？

```ts
// mixins/mixinA.ts
export const mixinA = {
  methods: {
    hoge() {
      console.log("mixinA");
    },
  },
};
```

```ts
// mixins/mixinB.ts
export const mixinB = {
  methods: {
    hoge() {
      console.log("mixinB");
    },
  },
};
```

```ts
import { mixinA } from "@/mixins/mixinA";
import { mixinB } from "@/mixins/mixinB";
import Vue from "vue";

export default Vue.extend({
  mixins: [mixinA, mixinB],
  created() {
    this.hoge();
  },
  methods: {
    hoge() {
      console.log('component')
    }
  }
});
```

正解はコンポーネントのmixinのみが呼ばれるのですが、自信を持って回答できた方は少ないかと思います。
コンポーネントに定義された名前が最も優先され、mixin同士では後から読み込んだmixin（この例だとmixinB)が優先されます。

mixinにおける名前が競合しても誰も教えてくれないので、名前が競合した時の動作を知らないと、思わぬ事故に繋がりかねないです。

mixinのメソッドは`○○able`のように命名規則ルールとして決めるといった方法もありますが、あくまでルールの話なので完全に回避できるわけではありません。

mixinを使用しているコンポーネントを実装しているときには**常にmixinと名前が競合していないか考慮しながら**コードを書かなければいけません。

これは、mixinのコードを書いているときも同様です。mixinのコードを変更するときには、mixinが使われているコンポーネントをすべて知らべて名前が競合していないか確かめる必要があります。

## 暗黙的挙動のため認知不可が高い

mixinが使われているコンポーネントのソースを読むのは辛いってお話です。

mixinを使っている場合には`this`に対してメソッドやらプロパティが暗黙的に生えていきます。

コードを読むときは順に処理を追っていくと思うのですが、その途中でコンポーネントに定義されていないメソッドが出てきた「あれ・・・？」となるわけです。

しばらく考えてようやくmixinによって定義されたメソッドだと気づくわけなのですが、これまた複数のmixinを読み込んでいるコンポーネントに出会ったらどちらのmixinに定義されているのか探しに行かなければならないです。

## コンポーネントとmixinで互いに依存が生まれる

処理を共通化するためにmixinに機能を切り出したはずなのに、気づかないうちにコンポーネントとmixin間で依存関係が生まれてしまします。

例えば、日付をフォーマットするためのmixinを考えます。

```ts
// mixins/dateUtils
export const dateUtils = {
  computed: {
    formatedDate() {
      const date = new Date(this.date);
      return date.toLocaleDateString();
    },
  },
};
```

```vue
<template>
  <div>{{ formatedDate }}</div>
</template>

<script lang="ts">
import { dateUtils } from "@/mixins/dateUtils";
import Vue from "vue";

export default Vue.extend({
  mixins: [dateUtils],
  data() {
    return {
      date: "2021-09-05T09:01:00.093Z",
    };
  },
});
</script>
```

このようなmixinは、コンポーネント側に特定のdataやメソッドが定義されていることが前提として課されています。
上記例では、`dateUtils` mixinを使用する場合は、dataプロパティに`date`が必ず定義されている必要があります。

このような状況ではコンポーネントとmixin側どちらを変更しても壊れてしまします。

## (Options APIの場合には)TypeScriptの恩恵を受けられない

この辺りはクラスコンポーネントを使えば解決できる問題なので、あまりモチベーションとしては大きくないですが、TypeScriptとは基本相容れないです。

```ts
import { mixinA } from "@/mixins/mixinA";
import Vue from "vue";

export default Vue.extend({
  mixins: [mixinA],
  created() {
    // Property 'hoge' does not exist on type 'CombinedVueInstance<Vue, unknown, unknown, unknown, Readonly<Record<never, any>>>'
    this.hoge();
  },
});
```

## 再利用可能な機能は純粋なJavaScriptで行う

それじゃあmixinを使わないで処理の共通化するにはどうするの、というと純粋なJavaScriptとして実装します。

先程の日付をフォーマットする処理をリファクタリングしてみます。

```ts
// helpers/dateHelpers
export const dateHelper = {
  formatedDate(date: string | Date) {
    const d = new Date(date);
    return d.toLocaleDateString();
  },
};
```

```vue
<template>
  <div>{{ formatedDate }}</div>
</template>

<script lang="ts">
import Vue from "vue";
import { dateHelper } from "@/helpers/dateHelper";

export default Vue.extend({
  data() {
    return {
      date: "2021-09-05T09:01:00.093Z",
    };
  },
  computed: {
    formatedDate(): string {
      return dateHelper.format(this.date);
    },
  },
});
</script>
```

これだけでmixinの抱える問題のもろもろをすべて解決できます。
ライフサイクルフックをmixinで記述しているような場合でも、ライフサイクルフックの内部のロジックだけを抜き出して各コンポーネントでライフサイクルフックを呼び出すようにします。

また、`this`の値をメソッドの中で使っていたのを引数から受け取るように変えたのでユニットテストも書きやすくなっています。

フレームワークに依存しないで処理を書けるようになっているので、一石三鳥といったところでしょうか？

私にはどうしてもmixinを使わなければ実装できないような処理が思いつかなかったので、なにかあれば教えてください。

