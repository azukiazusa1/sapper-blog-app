---
id: 2mOyWZrSjwUfV1deUg0Ro1
title: "Nuxt Sentryでユーザーフィードバックを受け取る"
slug: "nuxt-sentry-user-feedback"
about: "Sentryでは、エラーが発生した際に簡単にユーザーフォードバックを求めるダイアログを表示することができます。  Nuxt.jsでは、エラーが発生した際には`layouts/error.vue`へ遷移させることでエラーページを表示するので、このエラーコンポーネントにダイアログを表示させる処理を書いていきます。"
createdAt: "2021-06-06T00:00+09:00"
updatedAt: "2021-06-06T00:00+09:00"
tags: ["Vue.js", "Nuxt.js", "Sentry"]
published: true
---
Sentry では、エラーが発生した際に簡単にユーザーフォードバックを求めるダイアログを表示できます。

Nuxt.js では、エラーが発生した際には `layouts/error.vue` へ遷移させることでエラーページを表示するので、このエラーコンポーネントにダイアログを表示させる処理を書いていきます。

# ライブラリをインストール

`nuxt/sentry` というモジュールがあるので基本はこれを使用しますが、おそらく？ユーザーフィードバックを求めるダイアログを表示させるメソッドは存在しないので、そのために、`@sentry/vue` もインストールします。

https://sentry.nuxtjs.org/

```sh
$ yarn add nuxt/sentry @sentry/vue
```

# nuxt.config.jsを修正

Sentry の初期設定は `nuxt.config.js` に記述します。

```js
modules: [ '@nuxtjs/sentry' ],
sentry: {
    dsn: process.env.SENTRY_DSN || '',
    disabled: process.env.NODE_ENV !== 'production',
    sourceMapStyle: 'hidden-source-map',
    config: {
      release: process.env.GIT_SHA
    }
  },
```

Sentry のイベントの送信先である dsn は `.env` ファイルの定義であります。
`disabled` の条件によって、本番環境以外においては Sentry は動作しなくなります。
`sourceMapStyle` は `hidden-source-map` に設定するとソースマップが非表示になります。
通常デフォルトで非表示となっていることが望ましいですが、後方互換性のためにデフォルトの設定では表示させるようにしているようです。
`config.relase` を `process.env.GIT_SHA` に設定すると、Git のコミットハッシュによってリリース回数を数えることができます。

設定するとその他のモジュールと同じように `this.$sentry` でアクセスできるようになります。

# エラーコンポーネント

エラーコンポーネントを修正します。

```js
import * as Sentry from '@sentry/vue'

export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      eventId: ''
    }
  },
  created() {
    this.eventId = this.$sentry.captureException(this.error)
  },
  methods: {
    showReportDialog() {
      Sentry.showReportDialog({
        eventId: this.eventId,
        dsn: process.env.SENTRY_DSN,
        user: {
          name: this.user ? this.user.username : '',
          email: this.user ? this.user.email : ''
        }
      })
    }
  },
  computed() {
    user() {
      // 省略
    }
  }
}
```

`created` メソッドで、Sentry によりエラーを送信します。
`this.$sentry.captureException` は返り値として `eventId` を返しますが、これはダイアログを表示させるために必須オプションですので `data` プロパティとして保持しておきます。

前述したとおり、`nuxt/sentry` モジュールにはダイアログを表示させる機能がないため、'@sentry/vue'をインポートして使用します。
再度 sentry DSN を設定しなければいけないので注意してください。

`eventId` と `dsn` は必須オプションです。
`user.name`・`user.email` を設定するとダイアログのフォームに初期値として登録されるので入力の手間が省けて便利です。

後はボタン押下のなどのイベントによってこのメソッドを呼び出すようにすればよいでしょう。

実際に表示されるダイアログは以下のようになります。

![user-feedback-dialog](//images.ctfassets.net/in6v9lxmm5c8/qJAUsKulGbtXKS3nG5hjv/f4ab39443ee1fab519d0ea5381984520/____________________________2021-06-06_22.59.59.png)

ダイアログの文言もオプションを渡すことで自由に変更できます。
設定可能なすべてのオプションは以下を参照してください。

https://docs.sentry.io/platforms/javascript/enriching-events/user-feedback/#customizing-the-widget

ユーザーフィードバックが送信された場合、Sentry から確認できます。

![user-feed-back](//images.ctfassets.net/in6v9lxmm5c8/2zAcU1MC0cGzUBGoy6NHEL/341a03b969716fcb59c6dbd633c34b6f/____________________________2021-06-06_23.03.38.png)

