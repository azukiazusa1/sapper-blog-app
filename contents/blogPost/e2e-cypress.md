---
id: 1OCivpOf7cRbjOu3IcLFZC
title: "e2eテスティングフレームワークCypress"
slug: "e2e-cypress"
about: "Cypressは、JavaScript製のE2Eテスティングフレームワークです。 実行速度が早い、HTTPリクエストの実行を待つなどテストが壊れにくい仕組みが整っています"
createdAt: "2021-04-11T00:00+09:00"
updatedAt: "2021-04-11T00:00+09:00"
tags: ["cypress", "TypeScript"]
published: true
---
# Cypressとは

Cypressは、JavaScript製のE2Eテスティングフレームワークです。
実行速度が早い、HTTPリクエストの実行を待つなどテストが壊れにくい仕組みが整っています。

# Seleniumとの違い

Seleniumは、HTTPリクエストでブラウザのドライバーにJSONファイルを送信しテストを実行します。
テストの結果はHTTPブラウザのドライバーからHTTPリクエストで受け取ります。
![Screenshot-2018-10-19-21.33.55](//images.ctfassets.net/in6v9lxmm5c8/3lPZme0wZCW7bhJbUa3Bgc/8a88072a586b0eacace71e3190d30951/Screenshot-2018-10-19-21.33.55.png)

つまりは、ブラウザの外からネットワークを利用して操作することになります。

対して、Cypressはブラウザの内部から直接実行する。そのため、Seleniumに比べて実行速度が早くなる。ブラウザのローディングアイコンを監視してその間操作をストップさせたり、デベロッパーツールで行うようにDOMを修正することができます。
また、ネットワークのリクエストレスポンスモッキングできるのも大きな特徴の一つです。

一方で、CypressはやIEなどのブラウザをサポートしていない欠点があります。
Cypressのサポートブラウザは以下のとおり。

- chrome
- chromium
- edge
- electron
- firefox

CypressはElectornを使用することを推奨しています。より高速に動作するためです。

また、要素を取得するさいにSeleniumと違いCSS セレクタしか使うことができません。

# Cypressのインストール

CypressのインストールにはNode.jsを使用します。

```sh
npm install --save-dev cypress
```

インストールが完了すると、プロジェクトルートに`cypress.json`と`cypress`フォルダが生成されています。

```sh
cypress
├── fixtures
│   └── example.json
├── integration
│   └── test1.js
├── plugins
│   └── index.js
├── support
│   ├── commands.js
│   └── index.js
```

テストファイルは`integration`フォルダ配下に配置します。

## コマンド

`package.json`に、cypressのコマンドを定義しておきます。

```json
{
  "name": "cypress-e2e",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "open": "cypress open",
    "e2e": "cypress run",
    "e2e:chrome": "cypress run --browser chrome",
    "e2e:firefox": "cypress run --browser firefox"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "cypress": "^7.0.1"
  }
}
```

`cypress open`は、Cypressのダッシュボードを起動するためのコマンドです。ダッシュボードからはGUI上でブラウザを確認しながらテストを実行することができます。

`cypress run`コマンドでヘッドレスでテストを実行することができます。`--browser`オプションを付与することで実行するブラウザを指定することができます。
テストを実行することで自動的にスクリーンショットと.mp4ファイルが生成されます。

## cypress.json

`cypress.json`ファイルでは、デフォルトのオプションをオーバーライドすることができます。
利用可能なすべてのオプションは以下を参照してください。

https://docs.cypress.io/guides/references/configuration#Options

例えば、以下のように記述すると.mp4ファイルとスクリーンショットの出力をしないように設定できます。

- cypress.json

```json
{
  "screenshotOnRunFailure": false,
  "video": false
}
``` 

# テストを書く

今回はVue.jsでささっとカウンターアプリを作ってcypressでテストを書いてみます。
コードは下記にあります。

https://github.com/azukiazusa1/vue-cypress

開発サーバーを起動させておきましょう。

```sh
$ npm install
$ npm run dev
```

Cypressのダッシュボードを起動します。

```sh
$ npm open
```

自動で生成されるテストのサンプルは不要なので削除しておきましょう。

```sh
$ rm -rf cypress/integration/examples
```

`cypress.json`を編集します。`baseUrl`を設定すると、`cy.visit()`などのメソッドを利用する際にプレフィックスとして利用されます。
また、`.js`ファイルの代わりに`.ts`ファイルを使用するので修正しておきます。

```json
{
  "baseUrl": "http://localhost:3000",
  "pluginsFile": "cypress/plugins/index.ts",
  "supportFile": "cypress/support/index.ts"
}

```

## 初めてのテスト

テストファイルは`cypress/integration`配下に配置します。
`counter.spec.ts`という名前でファイルを作成します。

```ts
import { expect } from "chai"

describe('Counter', () => {
  it('first test', () => {
    expect(1 + 1).to.equals(3)
  })
})
```

Cypressにはテストに必要なライブラリ一式がはじめから組み込まれています。
[Mocha](http://mochajs.org/)と[Chai](http://chaijs.com/)がライブラリとして含まれているのでその構文を使用できます。
内容は見ての通り必ず失敗するテストです。

Cypressのダッシュボードからファイル名をクリックするとテストを実行できます。

![スクリーンショット 2021-04-11 22.49.47](//images.ctfassets.net/in6v9lxmm5c8/5QgmEupTDgSx41qOqkAJsd/c70c5ce036a41b2519bea24e452c7e9f/____________________________2021-04-11_22.49.47.png)

テストが失敗していることが確認できます。

![スクリーンショット 2021-04-11 23.04.20](//images.ctfassets.net/in6v9lxmm5c8/8B3jrjFF9omkXVBLPriUo/dc1a8969399da6593a9b86cfad7bcd90/____________________________2021-04-11_23.04.20.png)

テストを修正しましょう。テストコードを修正すると自動でテストが実行されます。

![スクリーンショット 2021-04-11 23.05.53](//images.ctfassets.net/in6v9lxmm5c8/WC1BZWMO2437J2bn5u0GR/c7f3cf573f47c144a5ca16d951dce10e/____________________________2021-04-11_23.05.53.png)

やりました！テストは成功しています。

## 要素を取得してテストする

ここからCypressっぽいテストを記述しています。
テスト対象のソースコードはいかになります。

- App.vue

```vue
<template>
  <h1 data-cy="count">{{ count }}</h1>
  <div>
    <button data-cy="increment" @click="increment">increment</button>
    <button data-cy="decrement" @click="decrement">decremtnt</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const count = ref(0)
    const increment = () => {
      count.value++
    }

    const decrement = () => {
      count.value--
    }

    return {
      count,
      increment,
      decrement
    }
  }
})
</script>
```

`cy.visit()`メソッドでテスト対象のWebページを訪問します。
はじめに`cypress.json`で`baseUrl`を設定しているので`/`を指定します。

```ts

describe('Counter', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('first test', () => {
    expect(1 + 1).to.equals(2)
  })
})
```

ダッシュボード上に指定したページが表示されています。

![スクリーンショット 2021-04-11 23.18.21](//images.ctfassets.net/in6v9lxmm5c8/1jS9UCBmobTMF7Og2lnxac/b279491ba8f81ef6b8716ffc56baefc2/____________________________2021-04-11_23.18.21.png)

Webページ上の要素を取得するには、`cy.get()`メソッドの使用します。
`cy.get()`メソッドにはCSSセレクタのみを指定することができます。
ここでは[Cypressのベストプラクティス](https://docs.cypress.io/guides/references/best-practices#How-It-Works)に従って`data`属性で要素を取得することにします。

取得した要素に特定のテキストが含まれているかどうかは`.contains()`メソッドを使います。
はじめはあえて失敗するコードを書きます。

```ts
describe('Counter', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('カウントの初期値は0', () => {
    cy.get('[data-cy=count]').contains('1')
  })
})
```

指定した要素の中に'1'が見つからないと怒られてしまいました。正しい実装に修正しましょう。

![スクリーンショット 2021-04-11 23.33.38](//images.ctfassets.net/in6v9lxmm5c8/7lKl6tPywIQmyY5TYGrSm/a1bf5222b7a861329a88effb974d3662/____________________________2021-04-11_23.33.38.png)

```ts
describe('Counter', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('カウントの初期値は0', () => {
-    cy.get('[data-cy=count]').contains('1')
+    cy.get('[data-cy-count]').contains('0')
  })
})
```

これでテストが通ります。

![スクリーンショット 2021-04-11 23.36.20](//images.ctfassets.net/in6v9lxmm5c8/4Xkgn3lQwMYy9yIwfW9LqK/2f2bb40ec2b5c577789c78fba20c4e96/____________________________2021-04-11_23.36.20.png)

## 要素をクリックする

それではさらにテストを書いていきます。
お察しのとおり「increment」というボタンを押すとカウンターの値が1増えて「decrement」というボタンを押すとカウンターの値が1減るという実装です。
仕様を満たしているか確認しましょう。

要素をクリックするには、`cy.get()`で取得した後に`click()`を呼び出します。

```ts

describe('Counter', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('カウントの初期値は0', () => {
    cy.get('[data-cy=count]').contains('0')
  })

  it('incrementボタンを押すとカウンタの値が1増える', () => {
    cy.get('[data-cy=increment]').click()
    cy.get('[data-cy=count]').contains('1')
  })

  it('decrementボタンを押すとカウンタの値が1減る', () => {
    cy.get('[data-cy=decrement]').click()
    cy.get('[data-cy=count]').contains('-1')
  })
})
```

テストはすべて成功しています。

![スクリーンショット 2021-04-11 23.41.33](//images.ctfassets.net/in6v9lxmm5c8/52cDmB876DHkvJbGlFDqpf/ae77a143c90ca0960091ef62b1cb388f/____________________________2021-04-11_23.41.33.png)

## テストコードをリファクタリングする

テストは成功しましたが、テストコードからは不吉な匂いが感じられます。
カウンタの値を確認するための`cy.get('[data-cy=count]').contains()`という共通の処理がが複数に渡って登場しているためです。

嬉しいことに、Cypressには[Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)という機能があります。これは、Cypressのメソッドの自作できるというものです。なんども現れるような共通処理はCustom Commandsとして定義しておくとよいでしょう。

Custom Commandsは`cypress/cupport/command.ts`に記述します。(デフォルトでは`cypress/support/command.js`と`cypress/support/command.ts`が配置されているのでそれぞれ`.ts`ファイルにリネームします。)

- cypress/support/command.ts

```ts
Cypress.Commands.add('countShoud', (count: string) => {
  cy.get('[data-cy=count]').contains(count)
})
```

Custom Commandsを作成した場合、そのことをTypeScriptに知らせる必要があります。`cypress/support/index.d.ts`ファイルを作成します。

- cupress/support/index.d.ts

```ts
declare namespace Cypress {
  interface Chainable {
     countShoud(count: string): void
  }
}
```

それでは作成したコマンドを使用するようにテストコードを修正しましょう。
TypeScriptのエラーを避けるためにファイルの先頭に`reference path`コメントを追加しています。

- counter.spec.ts

```diff
+ /// <reference path="../support/index.d.ts" />
describe('Counter', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('カウントの初期値は0', () => {
-    cy.get('[data-cy=count]').contains('0')
+    cy.countShoud('0')
  })

  it('incrementボタンを押すとカウンタの値が1増える', () => {
    cy.get('[data-cy=increment]').click()
-    cy.get('[data-cy=count]').contains('1')
+    cy.countShoud('1')
  })

  it('decrementボタンを押すとカウンタの値が1減る', () => {
    cy.get('[data-cy=decrement]').click()
-    cy.get('[data-cy=count]').contains('-1')    
+    cy.countShoud('-1')
  })
})
```

テストは依然として成功しています。

![スクリーンショット 2021-04-11 23.41.33](//images.ctfassets.net/in6v9lxmm5c8/52cDmB876DHkvJbGlFDqpf/ae77a143c90ca0960091ef62b1cb388f/____________________________2021-04-11_23.41.33.png)
