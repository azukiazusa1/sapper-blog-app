---
id: 3RtRu2WqCpp66VlJRnsc2K
title: "Vitest と呼ばれるテスティングフレームワークがめちゃくちゃ早いらしいな"
slug: "testingframework-vitest"
about: "Vitest は Vite ベースの JavaScript のテスティングフレームワークです。"
createdAt: "2021-12-26T00:00+09:00"
updatedAt: "2021-12-26T00:00+09:00"
tags: ["JavaScript", "Vite", "Vitest"]
published: true
---
?> Vitest は現在(2021/12/27時点)開発中であり stable ではあり、本番環境での使用は推奨されません。

Vitest は [Vite](https://vitejs.dev/) ベースの JavaScript のテスティングフレームワークです。

https://vitest.dev/

Vite の強みとして周囲のエコシステムがあるのですが、ユニットテストを記述するときには Vite のエコシステムを活用することができませんでした。 多くの場合 [Jest](https://jestjs.io/) などのようなテスティングフレームワークが使用されるのですが、その場合 Vite の設定と Jest の設定をそれぞれに記述しなければいけなかったり開発者にとって煩わしいものでした。

Vitest の目標は Vite プロジェクトにおける最適なテストランナーとして、また Vite を使用していないプロジェクトでも代替手段としての地位を獲得することです。

Vite を搭載しているため非常に高速にテストを実行できることが大きな特徴の一つです。また Vitest は Jest の API とも互換性があるためほとんどのプロジェクトにおいて代替として使用することができます。

## Vitest を始める

### プレイグラウンド

手っ取り早く Vitest を始めるに以下のプレイグラウンドを使用できます。

https://stackblitz.com/edit/node-vnxgfy?file=test%2Fbasic.test.ts&view=editor

### インストール

Vitest を使用するには以下の環境が必要です。

- Vite v2.7
- Node v14

まずは [Viteのドキュメント](https://ja.vitejs.dev/guide/#%E6%9C%80%E5%88%9D%E3%81%AE-vite-%E3%83%97%E3%83%AD%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%82%92%E7%94%9F%E6%88%90%E3%81%99%E3%82%8B) の通りに Vite のプロジェクトを作成しましょう。

```sh
npm init vite@latest my-vitest-app --template vue-ts
```

プロジェクトの作成が完了したらプロジェクトのルートディレクトリに移動して Vitest をインストールしましょう。

```sh
npm install -D vitest
```

`package.json` にテストスクリプトを登録しましょう。

```json
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest -w",
    "coverage": "vitest --coverage"
  },
```

### 設定ファイル

Vitest の特徴の1つとして Vite と使用する場合新たな設定ファイルが不要なことが挙げられます。Vitest は `vite.config.ts` を見にいきます。

詳細な設定は以下を参照ください。

https://vitest.dev/config/

### 初めてのテストを書く

それでは実際に Vitest を使ってテストを書いてみましょう。

まずはテスト対象の関数を記述します。

- src/add.ts

```ts
const add = (num1: number, num2: number): number => {
  return num1 * num2;
}

export default add;
```

以下のようにテストを記述できます。基本的なところは Jest と同じように書くことができます。ただし `describe`,`expect`,`it`,`beforeEach` のような Jest ではグローバル関数環境に配置されている関数も `vitest` から import する必要があります。

```ts
import { describe, it, expect } from 'vitest'
import add from '../add'

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1, 2)).toBe(3)
  })
})
```

テストを実行してみます。

```sh
npm run test:watch

> my-vitest-app@0.0.0 test:watch ~/my-vitest-app
> vitest -w

 WATCH  ~/my-vitest-app

 ❯ src/test/add.spec.ts (1)
   ❯ add (1)
     × should add two numbers

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/test/add.spec.ts > add > should add two numbers
AssertionError: expected 2 to equal 3
 ❯ Proxy.<anonymous> node_modules/vitest/dist/vi-67e478ef.js:505:17
 ❯ Proxy.methodWrapper node_modules/chai/lib/chai/utils/addMethod.js:57:25
 ❯ src/test/add.spec.ts:6:22
      4| describe('add', () => {
      5|   it('should add two numbers', () => {
      6|     expect(add(1, 2)).toBe(3)
       |                      ^
      7|   })
      8| })

  - Expected   3
  + Received   2

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

Test Files  1 failed (1)
     Tests  1 failed (1)
      Time  2.35s (in thread 6ms, 42608.54%)

 FAIL  Tests failed. Watching for file changes...
press any key to exit...
```

テストが失敗して `3` であるべきところが `2` が返却されていることがわかりますね。テスト対象のコードを確認してみると、足し算 `+` とするべき箇所を誤って掛け算 `*` としてしまっているのでここを修正しましょう。

```diff ts
 const add = (num1: number, num2: number): number => {
-   return num1 * num2; 
+   return num1 + num2;
 }

 export default add;
```

watch モードで実行しているのでファイルを保存したら一瞬でテストが再実行(3ms)されました。今度は正しく成功していますね。

```sh
Re-running tests... [ src/add.ts ]

 √ src/test/add.spec.ts (1)

Test Files  1 passed (1)
     Tests  1 passed (1)
      Time  3ms

 PASS  Waiting for file changes...
```

### グローバル関数を使ってしてテストを書く

Jest のようにテストに使う関数をグローバル環境として使いたい場合にはオプションから設定できます。`vite.config.ts` ファイルに `global: true` を追加します。

- vite.config.ts

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    global: true,
  },
})
```

TypeScriptを使用している場合には `tsconfig.json` に Vitest の型を追加します。

- tsconfig.json

```json
{
  "compilerOptions": {
    "types": ["vitest/global"]
  }
}
```

### モック

モックを使用するには `vi` オブジェクトを import します。基本的な使い方は Jest のモックと同じです。

- src/fetchUsers.ts

```ts
import axios from 'axios';

interface User {
  id: number;
  name: string;
}

const fetchUsers = async () => {
  const { data } = await axios.get<User[]>('/api/users');
  return data.map(user => user.name)
}

export default fetchUsers;
```

```ts
import { describe, it, expect, vi } from "vitest";
import fetchUsers from "../fetchUsers";
import axios from "axios";

vi.mock("axios", () => ({
  get: vi.fn(() => Promise.resolve({
    data: [
      { id: 1, name: "John" },
      { id: 2, name: 'Jane' }
    ]
  }))
}))

describe('fetchUsers', () => {

  it('should fetch users', async () => {
    const users = await fetchUsers();
    expect(axios.get).toHaveBeenCalledWith('/api/users');
    expect(users).toEqual(['John', 'Jane']);
  });
})
```

（ axios をモックすると原因不明のエラーで失敗します...）

https://github.com/vitest-dev/vitest/issues/284

### 日付のモック

Vitest では Jest とは異なり [mockdate](https://www.npmjs.com/package/mockdate) が初めから入っています。そのため `vi` オブジェクトから簡単に日付をモックできます。

- src/getCurrentDayOfWeeks.ts

```ts
const dayOfWeeks = {
  0: '日曜日',
  1: '月曜日',
  2: '火曜日',
  3: '水曜日',
  4: '木曜日',
  5: '金曜日',
  6: '土曜日'
} as const

type Day = keyof typeof dayOfWeeks;

const getCurrentDayOfWeek = () => {
  const date = new Date();
  const day = date.getDay() as Day;
  return dayOfWeeks[day];
}

export default getCurrentDayOfWeek;
```

日付をモックするには `vi.mockCurrentDate()` を設定したい日付を引数に呼び出します。

（[ドキュメント](https://vitest.dev/guide/mocking-date.html)には `setSystemDate` って書かれているけど違うっぽい？）

- src/test/getCurrentDayOfWeek.spec.ts

```ts
import { describe, it, expect, vi, afterEach } from "vitest";
import getCurrentDayOfWeek from "../getCurrentDayOfWeek";

describe('getCurrentDayOfWeek', () => {

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return "土曜日"', () => {
    vi.mockCurrentDate(new Date('2021-12-24'));
    expect(getCurrentDayOfWeek()).toBe("金曜日");
  })
})
```

## 感想

少ないテストケースでしか試していないですが、高速なテスティングフレームワークを謳っていることだけあって watch モードでは特に早く感じますね。
設定ファイルも今まで webpack 用のパスエイリアスと Jest 用のパスエイリアスをそれぞれ記述しなければいけなかったのが不要になるのは嬉しいですね。

