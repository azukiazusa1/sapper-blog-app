---
id: 5MU4yGlnQJYqkAeXib7W20
title: "Q：v-for の key に 配列のインデックスを使うのは犯罪ですか？#Shorts"
slug: "v-for-key-as-index"
about: "結論：  - `v-for` ディレクティブに渡す配列要素が決して変わらないことがわかっているのであれば使っても良い。 - `id` 属性を持っているのであれば常に `id` 属性を `key` に使用するべき。"
createdAt: "2022-02-20T00:00+09:00"
updatedAt: "2022-02-20T00:00+09:00"
tags: ["Vue.js"]
published: true
---
質問来てた👉。

Q：`v-for` の `key` に配列のインデックスを使うのは犯罪ですか？

結論。

- `v-for` ディレクティブに渡す配列要素が決して変わらないことがわかっているのであれば使っても良い。
- `id` 属性を持っているのであれば常に `id` 属性を `key` に使用するべき。

---

`v-for` ディレクティブはご存じのとおり配列要素をリストレンダリングするために使用されます。

これは Vue.js のスタイルガイドでは必須項目とされています。（これは React や Svelet も同様ですね）

```html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

https://jp.vuejs.org/v2/style-guide/#%E3%82%AD%E3%83%BC%E4%BB%98%E3%81%8D-v-for-%E5%BF%85%E9%A0%88

この `key` 属性は Vue がノードの新しいリストと古い要素を比較する際に VNode を識別するために使用されます。ノードの新しいリストと古い要素を比較する必要があるのは状態の変更などによりコンポーネントの再描画が発生した場合です。

https://v3.ja.vuejs.org/api/special-attributes.html#key

`key` 属性がない場合には再描画を最適化するためにできる限り同じ種類の要素を再利用しようとします。再描画が発生する前後において同一の要素であることを Vue が知る手段がないためです。この時に問題になるのは例えばリストレンダリングの要素を削除する際に、削除してほしくない DOM を削除してしまう可能性があることです。例として `<input>` を描画しているような場合には再描画後においてもフォーカスを維持したいと思うことでしょうが、元々フォーカスしていた要素を Vue が知るよしはないため予期せぬ挙動となります。

ところで `key` 属性は共通の親を持つ子の中で必ず一意となる必要があります。これは Vue がリストのなかで要素を識別するために `key` 属性を使用しているため、であり重複する `key` があった場合には変更の対象となる要素を見誤り予期せぬ変更が生じる可能性が生じます。

ここで問題になるのは配列の要素が id 属性のような確実に一意となる属性を持っていない場合です。そのような場合によく用いられる手段として配列のインデックスを一意となる属性とみなして `key` として使用する方法です。

確かに、まともな配列ならインデックスは必ず各要素ごとに一意となるはずです。そのため一見配列のインデックスを `key` として使用することになんら問題はないように思えますが、この判断は意図しない挙動を呼び起こす可能性があります。

## インデックスを key に利用すると危険な例

インデックスを key に利用する危険な例として以下を用意しました。
`items` リストを `v-for` でレンダリングしており特に一意になる属性を持っていないのでは配列のインデックスを `key` として使用しています。

「Add Todo」ボタンをクリックすることでリストの要素を先頭に追加できます。

```vue
<script lang="ts" setup>
import { ref } from "vue";

const items = ref([
  {
    title: "buy milk",
  },
  {
    title: "go to office",
  },
]);

const newTitle = ref("");

const addItem = () => {
  items.value.unshift({ title: newTitle.value });
  newTitle.value = "";
};
</script>

<template>
  <div style="display: flex; flex-direction: column; width: 50%">
    <div>
      <button @click="addItem" style="margin-right: 5px">Add Todo</button>
      <input type="text" v-model="newTitle" />
    </div>

    <div v-for="(item, index) in items" :key="index" style="margin-top: 10px">
      <label style="margin-right: 5px">{{ item.title }}</label>
      <input type="text" style="padding: 10px" />
    </div>
  </div>
</template>
```

このデモを試してみるとすぐにインデックスを `key` に使用したときに危険な理由が明らかになります。現在描画されているリストのうちの 1 つに何かしら入力を行ってから「Add Todo」ボタンをクリックすると予期せぬ挙動が発生します。

![index-key](//images.ctfassets.net/in6v9lxmm5c8/7MHSj7fhdDHOowsGNdj9rS/9d0b2e7ff41cb8f1d27cc5c84efe1eda/index-key.gif)

私は確かに「buy milk」の項目に対して「hoge」という内容 `<input>` に入力しましたがその後「foo」という項目をボタンをクリックして追加すると「buy milk」に入力していた内容が「foo」に移ってしまいました。

## 配列のインデックスは変化する

どうして上記のような現象が発生してしまったのでしょうか？

答えはごく単純で配列の要素が増減したり並べ替えたりすると**配列のインデックスは変化する**からです。初めは「buy milk」=> 0,「go to office」=> 1 とインデックスが割り当てられていました。

![スクリーンショット 2022-02-20 8.49.10](//images.ctfassets.net/in6v9lxmm5c8/6h3WwYQ6BAjKZ0s6xcYEYq/2e766172e9aa5e614b85a4e47683b915/____________________________2022-02-20_8.49.10.png)

その後ボタンをクリックすると「foo」=> 0 という要素が追加されます。配列の先頭に割り当てられるのでインデックスは 0 が割り当てられます。さて、この 0 というインデックスはもともと「buy milk」に割り当てられていたインデックスです。前述のとおり Vue は `key` 属性により再描画前後の要素が同一であるかどうかを判定します。

古い「buy milk」要素と新しい「foo」要素には同一の 0 という `key` が割り当てられているため Vue はこの 2 つの要素を同一の要素であると判定します。そのためもともと「buy milk」に入力していた内容が「foo」に移ってしまったのです。

![スクリーンショット 2022-02-20 9.01.18](//images.ctfassets.net/in6v9lxmm5c8/1IoAZtDBYvgu8RP0AZzI5F/54a6ddb26f3e4953907078a23625755a/____________________________2022-02-20_9.01.18.png)

## key には id を使うべし

今回の問題はリストの中の `v-for` ディレクティブが途中で変化してしまうことが原因でした。このように配列の要素が増減したり並び順が変化する可能性がある場合には永続的に一意となる属性を割り当てるべきです。

例えば [nanoid](https://github.com/ai/nanoid/) のようなライブラリは一意となる属性を作成する用途に適しています。

```diff
  <script lang="ts" setup>
  import { ref } from "vue";
+ import { nanoid } from 'nanoid'  
  const items = ref([
    {
      title: "buy milk",
+     id: nanoid() 
    },
    {
      title: "go to office",
+     id: nanoid() 
    },
  ]);

  const newTitle = ref("");

  const addItem = () => {
-   items.value.unshift({ title: newTitle.value });
+   items.value.unshift({ title: newTitle.value, id: nanoid() })
    newTitle.value = "";
  };
  </script>

  <template>
    <div style="display: flex; flex-direction: column; width: 50%">
      <div>
        <button @click="addItem" style="margin-right: 5px">Add Todo</button>
        <input type="text" v-model="newTitle" />
      </div>

-     <div v-for="(item, index) in items" :key="index" style="margin-top: 10px">
+     <div v-for="(item, index) in items" :key="item.id" style="margin-top: 10px">
        <label style="margin-right: 5px">{{ item.title }}</label>
        <input type="text" style="padding: 10px" />
      </div>
    </div>
  </template>
 ```

 これを試してみると確かに「buy milk」に対して正しい入力値が残り続けることがわかります。

 ![id-key](//images.ctfassets.net/in6v9lxmm5c8/2qNJ4X3xX2bjzyoM6GGNhb/8c006c8290c2f19e19f737272884c031/id-key.gif)

## 参考

https://zenn.dev/luvmini511/articles/f7b22d93e9c182
https://qiita.com/FumioNonaka/items/d1d9c9335116426a8316
https://github.com/vuejs/vue/issues/6235#issuecomment-402720536
https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318

ほかにも知りたいことがあったらコメント欄で教えて👇。

