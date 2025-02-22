---
id: 5Ku40YrklopgdbGoQO2YT7
title: "JavaScript テストフレームワークのJestのモックがすごくすごい"
slug: "jest-mock"
about: "Jestは、JavaScriptのシンプルなテスティングフレームワークです。ゼロコンフィグを謳っており、細かい設定なしに動作させることが可能です。  Jestの中でも特に強力な機能がモッキングです。Jestのモックを利用すれば、外部ライブラリであろうとモジュール外のオブジェクトを簡単にモック化することができます。  実際に、テストコードの例を見ていきましょう。"
createdAt: "2020-12-16T00:00+09:00"
updatedAt: "2020-12-16T00:00+09:00"
tags: ["", "Jest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5mjRp0X25FDsK1P9n4okz2/59e4bdf8f9773263fc5ab0c75ff5b443/jest.png"
  title: "jest"
selfAssessment: null
published: true
---
Jest は、JavaScript のシンプルなテスティングフレームワークです。ゼロコンフィグを謳っており、細かい設定なしに動作させることが可能です。

Jest の中でも特に強力な機能がモッキングです。Jest のモックを利用すれば、外部ライブラリであろうとモジュール外のオブジェクトを簡単にモック化できます。

実際に、テストコードの例を見ていきましょう。

# 副作用のあるコード

副作用のあるコードをテストするときは常にやっかいです。副作用のあるコードとは例えばデータベースにデータを保存したり、ファイルシステムに書き込んだり、Web API を呼び出したりなど、**コードを実行することで外部に影響を与える**コードのことです。
以下の例の副作用のあるコードを用意しました。

```js
import axios from 'axios'

export const getUserName = async (id) => {
  const { data } = await axios.get(`/user/${id}`)
  return data.user.name
}
```

id から架空の API にライブラリである axios を利用してユーザーの名前を取得する簡単なコードです。外部の API からデータを取得しているので、副作用のあるコードです。

さて、このようなコードはなぜテストがしにくいのでしょうか。それは、コードのロジックとは別にテストが失敗する可能性があるからです。

例えば、テストをする際にこの API のサービスが落ちていた場合、コードの正しさに関係なく駆らなずテストは失敗してしまいます。また API の多くにはレート制限があるでしょう。何度もテストを実行しているうちに、レート制限に達してしまいテストが失敗してしまうという状況に陥りかねません。

このような状況に対して、よく使われる手法として、**依存性の注入**パターンがあります。ざっくりと説明すると、副作用のあるクラスをクラス内や関数内で生成する代わりに、コンストラクターや関数の引数から渡してあげる手法です。上記の例でいうと、次のように置き換えられます。

```js
export const getUserName = async (axiosInterface, id) => {
  const { data } = await axiosInterface.get(`/user/${id}`)
  return data.user.name
}
```

テスト時には、実際の axios のオブジェクトを渡す割に同じインターフェースを持ったモックデータを返すオブジェクトを渡します。

ところが、Jest の強力なモックを利用すればこのようなパターンを利用せずともオブジェクトをモックに置き換えることが可能です。

# Jestのテストコード

以下が Jest を用いて作成したテストコードです。

```js
import axios from 'axios'
import { getUserName } from '../src/fetchUser.js'

let mockError = false // ①

jest.mock('axios', () => ({ // ②
  get: jest.fn((id) => { // ③
    if (mockError) {
      throw new Error('mock error')
    }

    const response = {
      data: {
        user: {
          name: 'test'
        }
      }
    }
    return Promise.resolve(response) // ④
  })
}))

describe('src/fetchUser.js', () => {
  describe('正常系', () => {
    test('API通信を行い、取得したユーザーの名前を返す', async () => {
      const userName = await getUserName(1)
      expect(userName).toEqual('test')

      expect(axios.get).toHaveBeenCalledWith('/user/1') // ⑤
    })
  })

  describe('異常系', () => {

    beforeEach(() => {
      mockError = true
    })

    test('エラーが発生したときは例外をスローする', async () => {
      await expect(getUserName(1)).rejects.toThrow()　// ⑥
    })
  })
})
```

① 名前が mock から始まる変数は、スコープの外側の変数でも参照できます。`mockError` 変数を `true` に設定することで、エラー時の動作をシミュレートします。

② jest.mock()の第一引数に渡されたモジュールを、テスト実行時に置き換えます。第二引数で置き換えた後のオブジェクトを定義しています。

③ jest.fn()によって、モック関数として定義しています。モック関数はスパイとも呼ばれ、モック関数がどのような引数で呼び出されたのか、何回呼び出されたのかをテストできます。

④ ここでモックデータを返しています。

⑤ axios.get()が正しい引数で呼び出されているかテストしています。

⑥　例外がスローされているかどうか確認します。

それでは、テストを実行してみましょう。

```sh
yarn test fetchUser
yarn run v1.22.0
$ jest fetchUser
 PASS  test/fetchUser.spec.js
  src/fetchUser.js
    正常系
      ✓ API通信を行い、取得したユーザーの名前を返す (15ms)
    異常系
      ✓ エラーが発生したときは例外をスローする (3ms)

      at Object.<anonymous> (test/fetchUser.spec.js:29:15)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.488s, estimated 2s
Ran all test suites matching /fetchUser/i.
✨  Done in 3.86s.
```

無事、想定通りの結果でテストが終了しています。

# おわりに

Jest の強力なモック機能を見てきました。今回紹介したのは本の一部分にしかすぎません。例えば、モックの実装を `__mocks__` フォルダに配置してテストファイル全体で使用することも可能です。ぜひより深く調べてみてください。

[Jest](https://jestjs.io/docs/ja/getting-started)
