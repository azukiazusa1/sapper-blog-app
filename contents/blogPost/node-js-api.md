---
id: 6p4XDj1xlXK7HQVFWYZ2Lf
title: "Node.js の標準 API にテストランナーが追加された"
slug: "node-js-api"
about: "JavaScript のテストランナーといえば、Jest　がデファクトスタンダードと言えるでしょう。最近は Vitest と呼ばれる新たなテストランナーも登場していますが、しばらくは Jest が使われ続けられることでしょう。  そんな中、Node.js 18 から標準 API としてテストランナーが組み込まれました。まだ実験的な機能ではありますが、サードパーティのライブラリを使用せずに扱えることもあって注目を集めています。"
createdAt: "2022-05-08T00:00+09:00"
updatedAt: "2022-05-08T00:00+09:00"
tags: ["Node.js"]
thumbnail:
  url: "https:undefined"
  title: ""
audio: null
selfAssessment: null
published: true
---
!> この機能は現在（2022/05/08）実験的な機能です。

JavaScript のテストランナーといえば、[Jest](https://jestjs.io/) がデファクトスタンダードと言えるでしょう。All In One の機能を持っており、React、Vue などのプロジェクトを作成した際にデフォルトで組み込まれていることもあって広く使われています。最近は [Vitest](https://vitest.dev/) と呼ばれる新たなテストランナーも登場していますが、しばらくは Jest が使われ続けられることでしょう。

そんな中、Node.js 18 から標準 API としてテストランナーが組み込まれました。まだ実験的な機能ではありますが、サードパーティのライブラリを使用せずに扱えることもあって注目を集めています。

https://nodejs.org/en/blog/announcements/v18-release-announce/#test-runner-module-experimental

## 基本的な使い方

Node.js のテストランナーの基本的な使い方を見ていきましょう。もっとも簡単なコード例は以下のとおりです。

```js
import test from "node:test"; // ①
import assert from "node:assert";

const add = (a, b) => a * b;

test("add", (t) => { // ②
  t.test("adds 1 + 2 to equal 3", () => { // ③
    assert.strictEqual(add(1, 2), 3); // ④
  });
});
```

①で `node:test` モジュールからテストランナーをインポートします。Node.js のコアモジュールなので `node:` プレフィックスが付与されていますが、その他のコアモジュールのように `node:` を外してインポートすると動作が変わることに注意してください。例えば、`fs` モジュールは `import fs from node:fs`、`import fs from fs` どちらでも動作は変わりません。しかしながら、`import test from test` と書くとユーザーランドの `test` モジュールを探索します。

続いて②の行で `test` 関数を呼び出してテストの内容を記述します。これは Jest の `describe` に相当するものなのでわかりやすいでしょう。1 つ異なる点として、関数の引数として [TestContext](https://nodejs.org/dist/latest-v18.x/docs/api/test.html#class-testcontext) オブジェクトを受け取ります。この引数 `t` はサブテスト内でテストを記述する際に使用されます。③ではこの引数 `t` を利用して `t.test` とテストを記述しています。`t.test` 関数はトップレベルで使用している `test` 関数と同一のものです。

最後に④では [assert](https://nodejs.org/api/assert.html) モジュールを使用してアサーションを実行します。[strictEqual](https://nodejs.org/api/assert.html#assertstrictequalactual-expected-message)は 2 つの引数が厳密に等しいか検査します。

テストを実行するには `--test` フラグを付与して実行します。

```sh
$ node --test index.mjs
```

どうやらテストが失敗しているようですので、以下のように出力されました。

```sh
$ node --test index.mjs
TAP version 13
not ok 1 - /work/node-test/index.mjs
  ---
  duration_ms: 0.120620079
  failureType: 'subtestsFailed'
  exitCode: 1
  stdout: |-
    TAP version 13
        not ok 1 - adds 1 + 2 to equal 3
          ---
          duration_ms: 0.004594414
          failureType: 'testCodeFailure'
          error: |-
            Expected values to be strictly equal:

            2 !== 3

          code: 'ERR_ASSERTION'
          stack: |-
            TestContext.<anonymous> (file:///Users/asaiippei/work/node-test/index.mjs:8:12)
            Test.runInAsyncScope (node:async_hooks:202:9)
            Test.run (node:internal/test_runner/test:340:20)
            Test.start (node:internal/test_runner/test:292:17)
            TestContext.test (node:internal/test_runner/test:63:20)
            TestContext.<anonymous> (file:///Users/asaiippei/work/node-test/index.mjs:7:5)
            Test.runInAsyncScope (node:async_hooks:202:9)
            Test.run (node:internal/test_runner/test:340:20)
            Test.start (node:internal/test_runner/test:292:17)
            Test.test (node:internal/test_runner/harness:126:18)
          ...
        1..1
    not ok 1 - add
      ---
      duration_ms: 0.010138586
      failureType: 'subtestsFailed'
      error: '1 subtest failed'
      code: 'ERR_TEST_FAILURE'
      ...
    1..1
    # tests 1
    # pass 0
    # fail 1
    # skipped 0
    # todo 0
    # duration_ms 0.093816419

  stderr: |-
    (node:79982) ExperimentalWarning: The test runner is an experimental feature. This feature could change at any time
    (Use `node --trace-warnings ...` to show where the warning was created)

  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# pass 0
# fail 1
# skipped 0
# todo 0
# duration_ms 0.179024336
test:node-test asaiippei$ node --test index.mjs
TAP version 13
not ok 1 - /Users/asaiippei/work/node-test/index.mjs
  ---
  duration_ms: 0.096359842
  failureType: 'subtestsFailed'
  exitCode: 1
  stdout: |-
    TAP version 13
        not ok 1 - adds 1 + 2 to equal 3
          ---
          duration_ms: 0.001862723
          failureType: 'testCodeFailure'
          error: |-
            Expected values to be strictly equal:

            2 !== 3

          code: 'ERR_ASSERTION'
          stack: |-
            TestContext.<anonymous> (file:///Users/asaiippei/work/node-test/index.mjs:8:12)
            Test.runInAsyncScope (node:async_hooks:202:9)
            Test.run (node:internal/test_runner/test:340:20)
            Test.start (node:internal/test_runner/test:292:17)
            TestContext.test (node:internal/test_runner/test:63:20)
            TestContext.<anonymous> (file:///Users/asaiippei/work/node-test/index.mjs:7:5)
            Test.runInAsyncScope (node:async_hooks:202:9)
            Test.run (node:internal/test_runner/test:340:20)
            Test.start (node:internal/test_runner/test:292:17)
            Test.test (node:internal/test_runner/harness:126:18)
          ...
        1..1
    not ok 1 - add
      ---
      duration_ms: 0.003572907
      failureType: 'subtestsFailed'
      error: '1 subtest failed'
      code: 'ERR_TEST_FAILURE'
      ...
    1..1
    # tests 1
    # pass 0
    # fail 1
    # skipped 0
    # todo 0
    # duration_ms 0.075152248

  stderr: |-
    (node:79992) ExperimentalWarning: The test runner is an experimental feature. This feature could change at any time
    (Use `node --trace-warnings ...` to show where the warning was created)

  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# pass 0
# fail 1
# skipped 0
# todo 0
# duration_ms 0.184647765
```

期待結果は `3` ですが実際には `2` が返されていると報告されています。`add` 関数の実装が間違っているのでこれを修正しましょう。

```diff
- const add = (a, b) => a * b;
+ const add = (a, b) => a + b;
```

再度テストを実行してみます。

```sh
$ node --test index.mjs
TAP version 13
ok 1 - /work/node-test/index.mjs
  ---
  duration_ms: 0.110990585
  ...
1..1
# tests 1
# pass 1
# fail 0
# skipped 0
# todo 0
# duration_ms 0.306012913
```

すべてのテストがパスしていることが確認できました。この例では特定のファイル `index.mjs` を指定してテストを実行しましたが、コマンドの引数を指定しなかった場合には以下の命名規則に従うことでそのファイルを対象にテストを実行します。

- `test` ディレクトリ配下に存在する `.js`、`.cjs`、`.mjs` ファイルはすべてテストファイルとして扱われ再帰的に実行される
- その他のディレクトリにおいて以下にマッチする `.js`、`.cjs`、`.mjs`　ファイル
  - `^test$` - 例：`test.js`, `test.cjs`, `test.mjs`
  - `^test-.+` - 'test-' で始まるファイル名。例： `test-example.js`、`test-another-example.mjs`
  - `.+[\.\-\_]test$` - `.test`、`-test`、`_test` で終わるファイル名。例： 

また `node_modules` 配下のファイルはテストの対象となりません。

## 複数のサブテストの注意点

テストブロックに以下のように複数のサブテストを配置するとテストが失敗していまいます。

```js
import test from "node:test";
import assert from "node:assert";

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

test("math tests", (t) => {
  t.test("adds 1 + 2 to equal 3", () => {
    assert.strictEqual(add(1, 2), 3);
  });

  t.test("substracts 1 - 2 to equal -1", () => {
    assert.strictEqual(subtract(1, 2), -1);
  });

  t.test("multiplys 1 * 2 to equal 2", () => {
    assert.strictEqual(multiply(1, 2), 2);
  });

  t.test("divide 1 / 2 to equal 0.5", () => {
    assert.strictEqual(divide(1, 2), 0.5);
  });
});
```

```sh
$ node --test 
TAP version 13
not ok 1 - /work/node-test/index.test.mjs
  ---
  duration_ms: 0.079692407
  failureType: 'subtestsFailed'
  exitCode: 1
  stdout: |-
    TAP version 13
        ok 1 - substracts 1 - 2 to equal -1
          ---
          duration_ms: 0.000273135
          ...
        not ok 2 - multiplys 1 * 2 to equal 2
          ---
          duration_ms: 0.000352485
          failureType: 'cancelledByParent'
          error: 'test did not finish before its parent and was cancelled'
          code: 'ERR_TEST_FAILURE'
          ...
        not ok 3 - divide 1 / 2 to equal 0.5
          ---
          duration_ms: 0.000080198
          failureType: 'cancelledByParent'
          error: 'test did not finish before its parent and was cancelled'
          code: 'ERR_TEST_FAILURE'
          ...
        1..3
    not ok 1 - math tests
      ---
      duration_ms: 0.002949251
      failureType: 'subtestsFailed'
      error: '2 subtests failed'
      code: 'ERR_TEST_FAILURE'
      ...
    ok 2 - adds 1 + 2 to equal 3
      ---
      duration_ms: 0.000177918
      ...
    1..2
    # tests 2
    # pass 1
    # fail 1
    # skipped 0
    # todo 0
    # duration_ms 0.056472885

  stderr: |-
    (node:80739) ExperimentalWarning: The test runner is an experimental feature. This feature could change at any time
    (Use `node --trace-warnings ...` to show where the warning was created)

  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..1
# tests 1
# pass 0
# fail 1
# skipped 0
# todo 0
# duration_ms 0.136012341
```

失敗した理由には `cancelledByParent` となっており「test did not finish before its parent and was cancelled」つまり「テストは親より先に終了せず、キャンセルされた」とエラーメッセージが出力されています。

これはデフォルトでは親のテストは子のテストの終了を待たずに終了してしまうためです。親のテストが終了すると子のテストはキャンセルされ失敗扱いとなります。この挙動を回避する他には子テストを `await` する必要があります。

```js
test("math tests", async (t) => {
  await t.test("adds 1 + 2 to equal 3", () => {
    assert.strictEqual(add(1, 2), 3);
  });

  await t.test("substracts 1 - 2 to equal -1", () => {
    assert.strictEqual(subtract(1, 2), -1);
  });

  await t.test("multiplys 1 * 2 to equal 2", () => {
    assert.strictEqual(multiply(1, 2), 2);
  });

  await t.test("divide 1 / 2 to equal 0.5", () => {
    assert.strictEqual(divide(1, 2), 0.5);
  });
});
```

## テストのスキップ

`skip`、`todo` オプションにより特定のテストの実行をスキップできます。

```js
import test from "node:test";
import assert from "node:assert";

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// test 関数の第2引数に { skip: true } を指定すると、このブロックのテストがスキップされます。
test("adds 1 + 2 to equal 3", { skip: true }, () => {
  assert.strictEqual(add(1, 2), 4);
});

// `true` を指定する代わりにメッセージを渡すことができます。
test("substracts 1 - 2 to equal -1", { skip: "skip test!" }, () => {
  assert.strictEqual(subtract(1, 2), -1);
});

test("multiply", (t) => {
  // TestContext によりテストをスキップすることもできます。
  t.skip("skip by TextContext");
  t.test("multiplies 1 * 2 to equal 2", () => {
    assert.strictEqual(multiply(1, 2), 2);
  });
});

test("divide", (t) => {
  // todo も同じようにテストをスキップします。
  t.todo("not implemented");
});
```

## 特定のテストのみを実行

`only` オプションを設定したうえで `--test-only` オプションを付与して実行することで特定のテストのみを実行できます。

```js
import test from "node:test";
import assert from "node:assert";

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

// test 関数で `only` オプションを指定します
test("adds 1 + 2 to equal 3", { only: true }, () => {
  assert.strictEqual(add(1, 2), 3);
});

test("substracts 1 - 2 to equal -1", () => {
  assert.strictEqual(subtract(1, 2), 999);
});

test("multiplys 1 * 2 to equal 2", () => {
  assert.strictEqual(multiply(1, 2), 999);
});

test("divide 1 / 2 to equal 0.5", (t) => {
  // `TextContext` の `runOnly` により指定することもできます
  test("divide 1 / 2 to equal 0.5", (t) => {
  t.runOnly(true);
  assert.strictEqual(divide(1, 2), 0.5);

  // `false` を指定すると次から実行されなくなります。
  t.runOnly(false);
  assert.strictEqual(divide(1, 0), 999);
});
```

```sh
$ node --test-only --test
TAP version 13
ok 1 - /work/node-test/index.test.mjs
  ---
  duration_ms: 0.148089037
  ...
1..1
# tests 1
# pass 1
# fail 0
# skipped 0
# todo 0
# duration_ms 0.45669191
```

## 感想

Node.js 標準のテストランナーはまだ実験的な機能であり、機能も十分とはいえないので Jest から乗り換えるのは時期尚早と言えるでしょう。とはいえサードパーティのパッケージを必要とせずテストを実行できるというのは魅力的ですので、将来に期待したいですね。
