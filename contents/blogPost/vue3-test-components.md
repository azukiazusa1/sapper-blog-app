---
id: 1dTXbrwRWRZXsA1Cr6XHrE
title: "Vue3 コンポーネントのテスト"
slug: "vue3-test-components"
about: "コンポーネントのテストをするのフレームワークとしてJest、vue-test-utils 2を利用します。Vue2系をターゲットにしているvue-test-utils 1とは一部APIが異なります。"
createdAt: "2021-02-03T00:00+09:00"
updatedAt: "2021-02-03T00:00+09:00"
tags: ["Jest", "Vue.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/KlxddWUk3mnLDCFG4qxu2/f36940cc38418e433c2b6be88032e44c/articles_2FuOVZsTkluuNqWfpBJSFq_2Fthumbnail_7D.png"
  title: "Vue.js"
selfAssessment: null
published: true
---
Component の単体テストは書くべきでしょうか？UI のテストは割りに合わない、ロジックはコンポーネントの外のモジュールに記述している（特に composition API では）などの理由から、コンポーネントに対するテストは書かない選択肢もあるでしょう。

とはいえ、やはりテストが書いてあると変更を加えた際に安心できるものです。コンポーネントのテストをするのフレームワークとして[Jest](https://jestjs.io/ja/)、[vue-test-utils 2](https://github.com/vuejs/vue-test-utils-next/)を利用します。Vue2 系をターゲットにしている[vue-test-utils 1](https://github.com/vuejs/vue-test-utils/)とは一部 API が異なります。

# なにをテストするのか

コンポーネントのテストは、詳細には触れずに入力と出力に着目してテストを行います。例えば、props として渡したデータが適切 DOM に描画されるかなどがテストケースとして挙げられます。

入力、出力はそれぞれ以下の分類があることが考えられます。

- 入力
	- props
	- 算出プロパティ
	- フォーム入力、クリックなどのユーザーイベント
	- store（Vuex など）の非同期アクション
- 出力
	- DOM の描画
	- emit
	- store の状態の変更

# テストを書いてみる

## コンポーネントの実装

それでは実際にテストを書いていきます。
「Google でログイン・Twitter でログインなどのボタンをクリックした際にユーザー認証されてホーム画面へ遷移する」というシナリオを想定しています。下記がコンポーネントの実装です。

```html
# LoginButtons.vue
<template>
  <login-button @click="clickGoogle">Googleでログイン</login-button>
  <login-button @click="clickTwitter">Twitterでログイン</login-button>
</template>

<script>
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import LoginButton from '@/components/molecules/LoginButton.vue'
import { signInWithGoogle, signInWithTwitter } from '@/composables/use-auth'

export default defineComponent({
  components: {
    LoginButton
  },
  setup () {
    const router = useRouter()

    const clickGoogle = async () => {
      const user = await signInWithGoogle()
      if (!user) return

      router.push('/home')
    }

    const clickTwitter = async () => {
      const user = await signInWithTwitter()
      if (!user) return

      router.push('/home')
    }
    return {
      clickGoogle,
      clickTwitter
    }
  }
})
</script>
```

## テストファイルの作成

テストファイルは、`test` フォルダ配下に配置することにします。`test/components/LoginButtons.spec.ts` を作成します。

```ts
import { shallowMount } from '@vue/test-utils'
import LoginButtons from '@/components/organism/LoginButtons.vue'
import LoignButton from '@/components/molecules/LoginButton.vue'
import { signInWithGoogle } from '@/composables/use-auth'
import flushPromises from 'flush-promises'

const mockPush = jest.fn()
jest.mock('vue-router', () => ({
  useRouter: () => {
    return {
      push: mockPush
    }
  }
}))

let mockError: boolean
jest.mock('@/composables/use-auth', () => ({
  signInWithGoogle: jest.fn(() => {
    if (mockError) {
      return Promise.resolve(null)
    }
    const user = {
      uid: 'uid',
      displayName: 'name',
      photoURL: 'photo'
    }
    return Promise.resolve(user)
  })
}))

describe('LoginButtons.vue', () => {
  const wrapper = shallowMount(LoginButtons)
  const button = wrapper.findAllComponents(LoignButton)

  test('Googleでログインボタンを押すと、signInWithGoogleが呼ばれホームページ遷移する', async () => {
    button[0].trigger('click')
    await flushPromises()
    expect(signInWithGoogle).toHaveBeenCalled()

    expect(mockPush).toHaveBeenCalledWith('/home')
  })

  test('Googeleでログインボタンを押した際に、ログインに失敗した場合ページ遷移はしない', async () => {
    mockError = true
    button[0].trigger('click')
    await flushPromises()

    expect(mockPush).toHaveBeenCalledTimes(0)
  })
})
```

ざっとこのようなテストになるはずです。詳しく見ていきましょう。

### 外部モジュールをモック化する

実際に認証をする処理など副作用が発生する関数は、テストしづらくなってしますのですべてモック化します。またモック化をする際に処理を `jest.fn()` に置き換えることでその関数がどのように呼ばれたのかをテストできます。

```ts
const mockPush = jest.fn()
jest.mock('vue-router', () => ({
  useRouter: () => {
    return {
      push: mockPush
    }
  }
}))

let mockError: boolean
jest.mock('@/composables/use-auth', () => ({
  signInWithGoogle: jest.fn(() => {
    if (mockError) {
      return Promise.resolve(null)
    }
    const user = {
      uid: 'uid',
      displayName: 'name',
      photoURL: 'photo'
    }
    return Promise.resolve(user)
  })
}))
```

`jest.mock()` はモック化したいモジュールを第一引数に渡します。`signInWithGoogle` をモック化する際には、`mockError` 変数によって成功時、失敗時をテストできるようにします。

### コンポーネントをレンダリングして要素を取得する

コンポーネントをレンダリングするためには、`mount` または `shallowMount` を使います。`mount` はコンポーネントのすべての要素をレンダリングしますが、`shallowMount` は子コンポーネントをスタブ化してレンダリングします。

`mount`・`shallowMount` はレンダリングしたいコンポーネントを引数に受け取り、[wrapper](https://vue-test-utils.vuejs.org/v2/api/#wrapper-methods)オブジェクトを返します。

レンダリングされた要素を取得するには、wrapper オブジェクトの `find`・`findAll`・`findComponent`・`findAllComponents` を利用します。

`find`・`findAll` は取得したい要素を querySelector で指定します。
`findComponent`・`findAllComponents` はコンポーネントインスタンスにより要素を検索します。
`All` という名前がついているメソッドは、見つかった要素すべてを返します。

```ts
const wrapper = shallowMount(LoginButtons)
const buttons = wrapper.find(LoignButton)
```

#### ボタンクリックを発生させる

取得した要素のイベントを発生させるためには、`trigger` メソッドを利用します。`trigger` メソッドの引数には発生させたいイベント名を指定します。
Google でログインボタンはたしか 1 つ目の要素でしたので、`buttons[0]` で要素を取得しています。

```ts
  test('Googleでログインボタンを押すと、signInWithGoogleが呼ばれホームページ遷移する', async () => {
    mockError = false
    buttons[0].trigger('click')
    await flushPromises()
    expect(signInWithGoogle).toHaveBeenCalled()

    expect(mockPush).toHaveBeenCalledWith('/home')
  })
```

Google でログインボタンをクリックした際に発火する `clickGoogle` 関数は、非同期に実行されます。後続のアサーションまでにプロミスが解決していない場合には、テストが失敗してしまう可能性があります。

そのため、[flush-promises](https://www.npmjs.com/package/flush-promises)を利用して要素をクリックしてからすべてのプロミスをすぐに解決させます。

ここでは、`signInWithGoogle` が呼ばれて、`router.push()` が `/home` という引数で呼ばれていることをテストしています。

# 終わりに

ここでは、クリックイベントの処理という簡単なテストの実行方法のみを取り上げました。props を与える、DOM の変更をテストする、emit の発生をテストするなど他にもさまざまなユースケースが考えられます。そのような要求に対してもわりと簡単にテストを実行できるので、リンクを参考に実施してみてください。

# 参考

[Vue Test Utils（2.0.0-beta.10）](https://vue-test-utils.vuejs.org/v2/guide/introduction.html)
[Vue Testing Handbook](https://lmiller1990.github.io/vue-testing-handbook/v3/)
