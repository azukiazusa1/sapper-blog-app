---
id: 1hY0XPJuC1XEwPK25stMBV
title: "Jest setTimeout()のようなでタイマー関数をテストする"
slug: "jest-timer-test"
about: "JavaScriptには、setTimeout()のような時間に関する便利な機能が用意されています。しかし、これらの関数はユニットテストを記述する際に厄介です。Jestのタイマーモックはこのような場合に利用できる便利な機能です。"
createdAt: "2021-08-01T00:00+09:00"
updatedAt: "2021-08-01T00:00+09:00"
tags: ["Jest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5mjRp0X25FDsK1P9n4okz2/59e4bdf8f9773263fc5ab0c75ff5b443/jest.png"
  title: "jest"
selfAssessment: null
published: true
---
 JavaScript には、以下のような時間に関する関数が用意されています。

 - `setTimeout`
 - `setInterval`
 - `clearTimeout`
 - `clearInterval`

例えば、`setTimeout` は第 1 引数で渡したコールバック関数を第 2 引数で渡したミリ秒後に実行します。

標準で用意されている非常に便利な関数群ですが、ユニットテストを記述するときには少々困りものです。`setTimeout` のコールバック関数に渡した処理が正しく呼び出されているかどうか調べたいようない場合には、`setTimeout` のコールバックが呼び出されるまで待機する処理を挟む必要があります。

`setTimeout` に渡したミリ秒の値が大きい場合はタイムアウトを起こす可能性がありますし、何よりテストのたびに長時間待つには耐えられません。

以上の問題を解決するために、Jest にはタイマー関数をモックする便利な機能が備わっています。

- `jest.useFakeTimers()`
- `jest.useRealTimers()`
- `jest.runAllTimers()`
- `jest.advanceTimersByTime()`
- `jest.runOnlyPendingTimers()`
- `jest.clearAllTimers()`
- `jest.runAllImmediates()`
- `jest.getTimerCount()`

## 偽のタイマーを有効にする

まずは、モックタイマーを試す例として以下の関数をテスト対象としてます。

```ts
import { echo } from "./echo"

export const echoAfterMinutes = (word: string, minutes: number) => {
  setTimeout(() => {
    echo(word)
  }, minutes * 60 * 1000)
}
```

`echo` 関数に渡したワードと何分後に呼び出すかを決める引数を受け取るシンプルな関数です。

テストコードは以下のとおりです。

```ts
import { echoAfterMinutes } from '../echoAfterMinutes'

jest.useFakeTimers();

describe('echoAfterMinutes', () => {
  beforeEach(() => {
    const spy = jest.spyOn(global, 'setTimeout');
    spy.mockClear()
    mockEcho.mockClear()
  });

  it('引数で指定した時間(分)後に指定したワードでechoを呼び出す', () => {
    echoAfterMinutes('test', 5);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000);
  })
})
```

`jest.useFakeTimers()` を呼び出していることに注目してください。この関数を呼び出すことによって偽のタイマーを有効化しています。

偽のタイマーが有効になっているときには、いかなるタイマーがストップします。
そのため、以下のように `setTimeout` のコールバック関数のなかでモック関数が正しく呼び出されているかどうかのテストは失敗します。

```ts
import { echo } from '../echo'
import { echoAfterMinutes } from '../echoAfterMinutes'

jest.mock('../echo')

const mockEcho = echo as jest.Mock
jest.useFakeTimers();

describe('echoAfterMinutes', () => {
  beforeEach(() => {
    const spy = jest.spyOn(global, 'setTimeout');
    spy.mockClear()
    mockEcho.mockClear()
  });

  it('引数で指定した時間(分)後に指定したワードでechoを呼び出す', () => {
    echoAfterMinutes('test', 5);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1);

    expect(mockEcho).toHaveBeenCalledWith('test')
  })
})
```

```sh
 FAIL  src/__tests__/echoAfterMinutes.spec.ts
  echoAfterMinutes
    ✕ 引数で指定した時間(分)後に指定したワードでechoを呼び出す (7 ms)

  ● echoAfterMinutes › 引数で指定した時間(分)後に指定したワードでechoを呼び出す

    expect(jest.fn()).toHaveBeenCalledWith(...expected)

    Expected: "test"

    Number of calls: 0

      18 |     expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1);
      19 |
    > 20 |     expect(mockEcho).toHaveBeenCalledWith('test')
         |                      ^
      21 |   })
      22 | })

      at Object.<anonymous> (src/__tests__/echoAfterMinutes.spec.ts:20:22)

```

## すべてのモックタイマーを実行する

上記の問題を解決するために、`jest.runAllTimers()` を呼び出しすべての偽のタイマーを即時に実行するようにします。

```ts
  it('引数で指定した時間(分)後に指定したワードでechoを呼び出す', () => {
    echoAfterMinutes('test', 5);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1);

    // タイマーが実行されるまでは呼び出されないはず
    expect(mockEcho).not.toHaveBeenCalled()

    // ここでタイマーを実行する
    jest.runAllTimers()

    // タイマー実行後にはecho関数が呼ばれる
    expect(mockEcho).toHaveBeenCalledWith('test')
  })
```

## 指定した時間だけタイマーをすすめる

`jest.advanceTimersByTime(msToRun)` を使うと、タイマーを即座に実行するのではなく、指定したミリ秒分だけタイマーをすすめることができます。

```ts
it('3分経過するまでは呼ばれない', () => {
    echoAfterMinutes('test', 3);

    // 1分すすめる
    jest.advanceTimersByTime(60 * 1000)
    expect(mockEcho).not.toHaveBeenCalled()

    // また1分すすめる
    jest.advanceTimersByTime(60 * 1000)
    expect(mockEcho).not.toHaveBeenCalled()

    // ここで3分経過したのでecho関数が呼ばれるはず！
    jest.advanceTimersByTime(60 * 1000)
    expect(mockEcho).toHaveBeenCalled()
  })
  ```

## 待機中のタイマーのみを実行する

`jest.runAllTimers()` ではすべてのタイマーを一度に実行します。

そのため、例えば以下のように `setTimeout` が再帰的に実行されるとき、すべてのタイマーを呼び出してしまうと無限ループが発生してしまいます。

```ts
export const recursionEchoAfterMinutes = (word: string, minutes: number) => {
  setTimeout(() => {
    echo(word)
    recursionEchoAfterMinutes(word, minutes - 1)
  }, minutes * 60 * 1000)
}
```

```ts
  test('setTimeoutが再帰しているとき', () => {
    recursionEchoAfterMinutes('test', 5);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000);

    expect(mockEcho).not.toHaveBeenCalled()

    jest.runAllTimers() // Aborting after running 100000 timers, assuming an infinite loop!

    expect(mockEcho).toHaveBeenCalledWith('test')
  })
```

このような場合には `jest.runAllTimers()` の代わりに `jest.runOnlyPendingTimers()` を使用します。

`jest.runOnlyPendingTimers()` は現時点で保留中のタイマーのみを実行するので、一度に 1 回ずつタイマーを進めることができます。

```ts
  test('setTimeoutがネストしているとき', () => {
    recursionEchoAfterMinutes('test', 5);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 300000);
    expect(mockEcho).not.toHaveBeenCalled()

    // 1つだけタイマーを進める
    jest.runOnlyPendingTimers()

    expect(mockEcho).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 240000)

    // もう一度一つだけタイマーを進める
    jest.runOnlyPendingTimers()

    expect(mockEcho).toHaveBeenCalledTimes(2)
    expect(setTimeout).toHaveBeenCalledTimes(3)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 180000)
  })
```

## タイマーを通常の動作に復元する

`jest.useFakeTimers()` で偽のタイマーを有効化した場合には、**呼び出した場所に関係なく、すべてのテストに影響を与えます。**（例え `it()` ブロックの中で呼び出したとしてです）

タイマーを通常の動作に復元したい場合には `jest.useRealTimers()` を呼び出します。`jest.useRealTimers()` もまたすべてのテストに影響を与えます。

## その他のモックタイマー

### `jest.clearAllTimers()`

保留中のすべてのタイマーをクリアします。

この関数が呼び出された後には、すべてのタイマーは削除されるので今後実行されることはありません。

### `jest.runAllImmediates()`

`setImmediate()` によってキューイングされたすべてのタスクを処理します。

### `jest.advanceTimersToNextTimer(steps)`

`jest.runOnlyPendingTimers()` のように働きますが、引数によって 1 度に複数のタイマーを進めることができます。

```ts
recursionEchoAfterMinutes('test', 5);

// 2つタイマーを進める
jest.advanceTimersToNextTimer(2)

expect(mockEcho).toHaveBeenCalledTimes(2)
expect(setTimeout).toHaveBeenCalledTimes(3)
expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 180000)
```

### `jest.getTimerCount()`

現在待機中のタイマーの数を返します。

```ts
recursionEchoAfterMinutes('test', 5);

expect(jest.getTimerCount()).toEqual(1)
```

# 参考

- [タイマーモック・Jest](https://jestjs.io/ja/docs/timer-mocks)
- [Jestオブジェクト・Jest](https://jestjs.io/ja/docs/jest-object#%E3%83%A2%E3%83%83%E3%82%AF%E3%82%BF%E3%82%A4%E3%83%9E%E3%83%BC)
