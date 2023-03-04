---
id: tnt5xuakE3GKZEP4eTQ1G
title: "Firebase③ Cloud Storage"
slug: "firebase-cloud-storage"
about: "Firebase3週目の記事です。 今回は、主に画像などのデータを保存するストレージ機能を提供するCloud Storageを取り扱います。 Vue.jsを利用したブログにサムネイル画像を設定する機能をもとに説明していきます。"
createdAt: "2020-05-03T00:00+09:00"
updatedAt: "2020-05-03T00:00+09:00"
tags: ["Vue.js", "firebase", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/57MXX73Nx2rUnUI730EykA/8d13236943bb46948155f92f2325369e/firebase.png"
  title: "firebase"
published: true
---
# はじめに
[前回の記事](https://app-blog-1ef41.web.app/article/a51lPE293EOY2F6iaXjM)に引き続き、Cloud Storage を利用して、ブログにサムネイル画像を設定できるようにします。

完成イメージはこのようになります。

![](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2Fa51lPE293EOY2F6iaXjM%2Fe30d4d855cf5553bed1264930d7a12b0.png?alt=media&token=7ff157a1-10d0-4184-98c8-9f494e30329c)

![スクリーンショット 20200426 21.26.59.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FZHJPsdDMYIOUOfS0w6p6%2F38a6552ffd95c7b8432136a2faaaf30d.png?alt=media&token=981674ee-2a2d-4009-96c7-d7670bc00841)

# 前提条件
`Vue C
LI` を用いた開発環境構築を行い、単一ファイルコンポーネントを用いています。また UI ライブラリとして `Vuetify` を使用しています。

また Cloud Storage のパスの構成は次のようになっています。

```
articles - articleId - files
```

# 記事に使われている画像の一覧を取得する

それでは早速コーディングをしていきましょう。

Cloud Storage に関する機能は、`src/plugins/storage.js` から `import` するのでした。

```js
import firebase from '@/plugins/firebase'

export const storage = firebase.storage()
```
スクリプト部分は次のようになっています。

```js
import { storage } from '@/plugins/storage'

export default {
  name: 'thumbnail-setting-dialog',
  props: {
    article: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      thumbnail: this.article.thumbnail,
      loading: true,
      error: false,
      dialog: false,
      images: [],
      selectedImage: '',
      fileLoading: 0,
    }
  },
  async created() {
    try {
      const storageRef = await storage.ref(`articles/${this.article.id}`)
      const res = await storageRef.listAll()
      res.items.forEach(itemRef => {
        itemRef.getDownloadURL().then(url => {
          this.images.push(url)
        })
      })
    } catch(e) {
      this.error = true
      console.log(e)
    } finally {
      this.loading = false
    }
  },
```

ファイルを取得する機能は、`created` メソッドで発動します。`created` メソッドは Vue.js のライフサイクルの 1 つです。インスタンスが生成されたときにフックされるため、API の通信など一番初めに処理を実行したいときに呼び出します。

## ストレージの参照を作成する
まずはじめに、ファイルへアクセスするための参照を作成します。Cloud Storage は、普段使い慣れているファイルシステムと同じように、階層構造になっています。
`storage.ref()` メソッドを使用して、現在の記事の参照まで移動しましょう。
そのために、次のように参照を作成しました。前提条件のファイル構成を参考にしてください。

```js
storage.ref(`articles/${this.article.id}`)
```

`this.article.id` は `props` で親から受け取ったデータになります。予想通り、現在編集している記事の ID が入っているので、これで正しく参照を作成できます。

# ディレクトリのファイル一覧を取得する

参照を作成できたので、ディレクトリの中に存在するすべてのファイルを取得しましょう。
`listAll()` メソッドで取得できます。

```js
const res = await storageRef.listAll()
```

取得に成功したファイル一覧は、`forEach` を利用して処理します。
個々のファイルの情報からは、ファイルをアップロードしたときと同じように `getDownloadURL()` メソッドから画像の URL を取得できます。

取得した URL は `data` プロパティの `images` 配列に格納しておきます。

```js
res.items.forEach(itemRef => {
   itemRef.getDownloadURL().then(url => {
      this.images.push(url)
    })
  })
```

## 取得した画像一覧を表示する
ここまでの処理の中でエラーがなければ、記事に使用されている画像の URL の一覧が取得できたはずです。
このままではなにも表示されないので、画像を表示する HTML 部分を実装しましょう。
全体像は次のようになっています。

```html
<v-row>
  <v-col cols=12>
    <v-card>
      <.div v-if="loading">
        画像データの取得中...
        <v-progress-circular indeterminate color="red"></v-progress-circular>
      </div>
      <.div v-else-if="images.length === 0">
        この記事に画像は使われていません。
      </div>
      <v-container fluid v-else>
        <v-row>
          <v-col
            v-for="(image, index) in images"
            :key="index"
            :index="index"
            class="d-flex child-flex"
            cols="4"
          >
            <v-card flat tile class="d-flex">
              <v-img
                :id="index"
                :src="image"
                aspect-ratio="1"
                :class="{ selected: isSelected(index) }"
                @click="onClick"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-col>
</v-row>
```

一番はじめの `v-if` ディレクティブにより、ローディング中にはプログレスサークルが表示されます。
もし、1 つも画像が記事内で使用されていないのであれば、その旨を表示してあげるのが丁寧でしょう。

```html
<.div v-if="loading">
  画像データの取得中...
  <v-progress-circular indeterminate color="red"></v-progress-circular>
</div>
<.div v-else-if="images.length === 0">
    この記事に画像は使われていません。
</div>
```

画像が表示できるのなら、`v-for` ディレクティブによりすべての画像を表示させましょう。
その際に、`Vuetify` のグリッドシステムを利用します。
`v-container` の中は 12 個のカラムに分割されるので、`v-col` の `cols` に 4 を指定すれば、4 + 4 + 4 ということで、画像が 3 つづつに分割されます。

```html
<v-container fluid v-else>
  <v-row>
    <v-col
      v-for="(image, index) in images"
      :key="index"
      :index="index"
      class="d-flex child-flex"
      cols="4"
    >
      <v-card flat tile class="d-flex">
        <v-img
          :id="index"
          :src="image"
          aspect-ratio="1"
          :class="{ selected: isSelected(index) }"
          @click="onClick"
        >
          <template v-slot:placeholder>
            <v-row
              class="fill-height ma-0"
              align="center"
              justify="center"
            >
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-card>
    </v-col>
  </v-row>
</v-container>
````

グリッドシステムによる画像の配置は[公式ドキュメント](https://vuetifyjs.com/ja/components/images/#grid)を参考にしました。

画像 URL を `v-img` の `src` プロップスに渡せば画像を表示してくれます。
`v-img` コンポーネントは優れもので、特に気にせずとも画像を遅延読み込みしてくれます。

## 選択された画像をサムネイルに設定する
画像一覧が表示されたので、画像が選択されたらサムネイルに設定されるようにしましょう。
`v-img` に `@click` イベントハンドラを用いてクリックイベントを購読しましょう。

```js
onClick(e) {
  this.selectedImage = +e.target.parentElement.id
  this.thumbnail = this.images[e.target.parentElement.id]
},
```

`v-img` には配列のインデックスを ID として付与しているので、イベント引数から取得します。（`v-img` コンポーネントを利用している都合上、画像自体に ID が不要されていないので、その親要素から取得しています）

`e.terget.parantElement.id` の前についている奇妙な `+` 記号は、文字列を数値へ変換するためのものです。
算術演算子の単項プラスはオペランドを評価する際に数値へ変換するので、値を数値へ変換する際に利用されます。
[算術演算子 - JavaScript | MDN](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus)

後はインデックスから配列の中の選択された画像の URL を取得できるので、これを `thumbnail` に設定すれば OK です。

## 選択された画像を強調する
最後に、画像一覧から画像が選択された場合わかりやすいように黄色い枠で囲むようにしてみましょう。こういう感じです。

![スクリーンショット 20200426 23.34.47.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FZHJPsdDMYIOUOfS0w6p6%2Fd48587ee834c66fe23d968b10dfe0d60.png?alt=media&token=750f0ee0-2355-48b6-b004-375cfabcbcec)

![スクリーンショット 20200426 23.35.54.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FZHJPsdDMYIOUOfS0w6p6%2F0b894196b2526f215db2c96d2a921ec9.png?alt=media&token=4f411d57-fff0-46a5-b4da-398a99875cc0)

### ボーダースタイルを定義する
画像を枠で囲むには、`border` スタイルを適用します。次のような CSS を書きます。

```css
<style scoped>
.selected {
  border: medium solid #FFEB3B
}
</style>
```

このスタイルを、現在選択されている画像に適用すればいいわけです。

そのための機能が Vue.js には用意されています。[クラスとスタイルのバインディング](https://jp.vuejs.org/v2/guide/class-and-style.html)。

`:class`(`v-bind:class`)の省略構文にオブジェクトを渡すと、クラスを動的に切り替えることができます。今回の例をもう一度上げましょう。

```html
<v-img
    :id="index"
    :src="image"
    aspect-ratio="1"
    :class="{ selected: isSelected(index) }"
    @click="onClick"
>
```

オブジェクトのキーには適用させたいクラス名を渡し、プロパティデータには真偽値を渡します。つまり、`isSelected(index)` が `true` を返した場合には、`selected` クラスが適用されさきほど定義されたスタイルが適用されます。

`isSelected` は算出プロパティとして定義されています。

```js
computed: {
   isSelected() {
     return index => this.selectedImage === index
  },
},
```

算出プロパティで引数を受け取るために、関数を return しています。
`this.selectedImage` には画像がクリックされたときにクリックされた画像の `index` が入っているのでした。

算出プロパティは依存する値（今回は `this.selectedImage`）が変更されるたびに新たな値を返すので、他の画像がクリックされるたび返す値が変わることになります。

これで、選択された画像にスタイルを適用させて強調させることができました。
この例で見たとおり、クラスバインディングは算出プロパティと組み合わせることで強力な効果を発揮します。

# おわりに
あれ、なんだか Cloud Storage の説明をしていたはずなのに Vue.js の説明のほうが多かった気がします🤔。

来週はついに、FireStore を取り上げる予定です。かなり長くなりそうなので一週じゃ終わらない気がしますが。
