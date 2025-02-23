---
id: dnnvByyHTkDPdWU2qR7Hz
title: "ブラウザで非同期イベントストリームを処理する Observable API"
slug: "observable-api-for-handling-asynchronous-event-streams-in-the-browser"
about: "Observable API は非同期イベントストリームを処理するための API です。 EventTarget に .when() メソッドを追加し addEventListener() よりも宣言敵で優れたイベントハンドリングを提供します。"
createdAt: "2025-02-22T18:39+09:00"
updatedAt: "2025-02-22T18:39+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4BJ7c0e1SP9gcFruYJCtw9/47d5bb8747dc57d033d6a846ad296140/bird_aobazuku_13858-768x689.png"
  title: "アオバズクのイラスト"
selfAssessment:
  quizzes:
    - question: "EventTarget インターフェイスにおいて、Observable API で非同期イベントストリームを処理するためのメソッドはどれか？"
      answers:
        - text: "element.on('click')"
          correct: false
          explanation: null
        - text: "fromEvent(element, 'click')"
          correct: false
          explanation: null
        - text: "element.subscribe('click')"
          correct: false
          explanation: null
        - text: "element.when('click')"
          correct: true
          explanation: null

published: true
---

!> Observable API は 2025 年 2 月現在 Chrome v135 以降でのみ利用可能です。

Observable API は非同期イベントストリームを処理するための API です。[EventTarget](https://developer.mozilla.org/ja/docs/Web/API/EventTarget) に `.when()` メソッドを追加し `addEventListener()` よりも宣言的で優れたイベントハンドリングを提供します。

`.when()` メソッドが呼び出された際に [Observable](https://github.com/WICG/observable?tab=readme-ov-file#the-observable-api) インスタンスを返します。Observable インスタンスは [rxjs の observable](https://rxjs.dev/guide/observable) とよく似ています。`.subscribe()` メソッドが呼び出されると、Observable はイベントストリームを開始し、`next` ハンドラが呼び出されるたびにコールバック関数が呼び出されます。

Observable API を使用することにより、宣言的な方法でイベントのフィルタリング・結合・変換を行うことができ、従来の `addEventListener()` で行うようなコールバック地獄を回避することが期待されています。この記事では Observable API を使った例をいくつか見ていきます。

## DOM イベントの処理

ボタンがクリックされた際のイベント処理を Observable API で行う例を見ていきしょう。`.when()` メソッドの引数にはイベント名を指定します。

```js
const button = document.getElementById("button");
 
button.when("click").subscribe({
  next: () => alert("clicked via Observable API")
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/qEBNRXQ?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qEBNRXQ">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ボタンがクリックされたときに `alert()` を呼び出す簡単な例です。これだけでは Observable API の利点があまり感じられないかもしれません。複数のイベントを組み合わせたときの例も見てみましょう。

## `.takeUntil()` メソッドを使用してイベントストリームを終了する

以下の例は終了ボタンがクリックされるまで、ボタンがクリックされた回数をカウントする例です。`.takeUntil()` メソッドを使用して特定のイベントが発生した際にイベントの監視を終了するために `.takeUntil()` メソッドを使用しています。終了ボタンがクリックされるまでは `reduce()` メソッドが呼び出され、ボタンがクリックされるたびにカウントが増えていきます。

```js
const countButton = document.getElementById("count-button");
const endButton = document.getElementById("end-button");

// reduce() が終了した場合 Promise が返される
const endCount = await countButton.when("click")
  .takeUntil(endButton.when("click"))
  .reduce((count, e) => {
    e.target.textContent = count;
    return count + 1;
}, 0)

console.log(endCount);
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3SsQwlZdmBoK0fJFzoU6BW/999d2f0452e80c286f1e8d27dede28ae/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-02-23_12.12.07.mov" controls></video>

## イベントストリームのフィルタリングと変換

続いてイベントストリームをフィルタリングする例です。コンテナ要素内でクリックイベントを監視し、特定のクラスを持つ要素がクリックされた場合のみにフィルタリングします。その後に `map()` メソッドを使用してクリックされた座標に変換してから処理を行います。

```js
const container = document.getElementById("container");

container.when("click")
  .filter(e => e.target.classList.contains("clickable"))
  .map(e => ({ x: e.clientX, y: e.clientY }))
  .subscribe({
    next: ({ x, y }) => console.log(`clicked at (${x}, ${y})`)
  });
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/S6Sa6oFj6OHih5mFwJY9m/ec24e563250a32afbe861209f46ed637/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-02-23_12.24.59.mov" controls></video>

## Web Socket の処理

Web Socket のイベントストリームを処理する例です。WebSocket インスタンスを作成し、`.when()` メソッドを使用して `message` イベントを監視します。`message` イベントは接続が切断されるかエラーが発生するまで監視するように `takeUntil()` メソッドで指定しています。

`map()` メソッドを使用して受信したデータを JSON に変換し、`filter()` メソッドで `data.type` が `message` の場合のみ `messageList` にデータを追加するようにしています。

イベントストリームが終了した場合には `finally()` メソッドが呼び出されます。`finally()` メソッド内では接続が切断されたことを通知するメッセージサーバーに送信しています。

```js
const ws = new WebSocket("ws://localhost:8080");
const messageList = [];

ws.when("message")
  .takeUntil(ws.when("close"))
  .takeUntil(ws.when("error"))
  .map(e => JSON.parse(e.data))
  .filter(data => data.type === "message")
  .subscribe({
    next: data => messageList.push(data)
  })
  .finally(() => {
    ws.send(JSON.stringify({ type: "disconnect", userId: "..." }));
  });
```

## Observable コンストラクタを使用して任意のイベントストリームを作成する

`new Observable()` コンストラクタを使用して Observable インスタンスを作成すれば、任意のイベントストリームを処理できます。`Observable` コンストラクタの引数は `subscriber` オブジェクトを受け取るコールバック関数を指定します。コールバック関数は `subscribe()` メソッドが呼び出されるたびに呼び出されます。

`subscriber.next()` メソッドを使用することで任意の数のイベントを通知することができます。`subscriber.complete()` メソッドを呼び出すことでイベントストリームを終了します。`subscriber.error()` メソッドを呼び出すことでエラーを通知することができます。

以下の例では 1 秒ごとにカウントアップするイベントストリームを作成しています。

```js
const observable = new Observable((subscriber) => {
  let count = 0;
  const id = setInterval(() => {
    // count が 10 以上になったら .complete() を呼び出してイベントストリームを終了
    if (count > 10) {
      subscriber.complete();
      return;
    }

    // 10% の確率でエラーを発生
    if (Math.random() < 0.1) {
      subscriber.error(new Error("Something went wrong!"));
      return;
    }
    // 1 秒ごとに count を通知
    subscriber.next(count++);
  }, 1000);
});

observable.subscribe({
  next: (value) => console.log(`Count: ${value}`),
  error: (error) => console.error(error),
  complete: () => console.log("Complete!"),
});
```

## イテレーターを Observable に変換する

`Observable.from()` メソッドを使用してイテラブルオブジェクトから Observable インスタンスを作成することもできます。

```js
const observable = Observable.from([1, 2, 3, 4, 5])

observable.map(value => value * 2)
  .subscribe({
    next: (value) => console.log(value),
    complete: () => console.log("Complete!"),
  });

// Output:
// 2
// 4
// 6
// 8
// 10
// Complete!
```

## AbortController と signal を使用してイベントをキャンセルする

`.subscribe()` や `.forEach()`, `first()` などのメソッドには `signal` オブジェクトを渡すことができます。`signal` オブジェクトを使用することで、イベントストリームをキャンセルすることができます。以下の例では `AbortController` によりイベントストリームがキャンセルされるまでタイマーを実行します。

```js
const abortController = new AbortController();
const signal = abortController.signal;

const start = document.getElementById("start");
const stop = document.getElementById("stop");

const timer = document.getElementById("timer");

start
  .when("click")
  .flatMap(
    () =>
      new Observable((subscriber) => {
        setInterval(() => {
          subscriber.next(new Date());
        }, 1000);
      }),
  )
  .map((date) => date.toLocaleTimeString())
  .subscribe(
    {
      next: (value) => (timer.textContent = value),
    },
    { signal },
  );

stop.when("click").subscribe({
  next: () => abortController.abort(),
});
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6jFqNiLLANybBJ2V9tU8cV/df3cdea69272f4ce78bf3833bf26f599/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-02-23_14.49.13.mov" controls></video>

## 入力したテキストの値を元に API にリクエストを送信する

入力したテキストの値を元に API にリクエストを送信し検索結果を表示する例です。`.switchMap()` メソッドは新しいストリームにマップして切り返す際に、暗黙的にサブスクリプションを解除します。`.forEach()` に渡した `signal` オブジェクトにアクセスできるように `.switchMap()` のコールバック関数は `Observable` コンストラクタを使用しています。

```js
const input = document.querySelector("input");
const abortController = new AbortController();
const signal = abortController.signal;

input
  .when("input")
  .switchMap(
    (e) =>
      new Observable(async (subscriber) => {
        const url = `https://api.github.com/search/repositories?q=${e.target.value}`;
        const res = await fetch(url, { signal: subscriber.signal });
        if (!res.ok) {
          subscriber.error(new Error(`HTTP error! status: ${res.status}`));
          return;
        }
        return subscriber.next(res);
      }),
  )
  .switchMap((response) => response.json())
  // 先頭の 10 件のみ表示
  .map((data) => data.items.slice(0, 10))
  .forEach(
    (items) => {
      // 検索結果を表示する
      // ...  
    },
    { signal },
  )
  // ストリームで発生したエラーをキャッチ
  .catch((e) => console.error(e));
```

![](https://videos.ctfassets.net/in6v9lxmm5c8/1uAiLmvBhP8AWF1r5amKin/9dd0744317eb84ef40d9db6efa503ea1/%E7%94%BB%E9%9D%A2%E5%8F%8E%E9%8C%B2_2025-02-23_14.36.30.mov)

## 懸念事項

`.first()` や `.last()` などの Promise を返すメソッドを使用する際の懸念事項が指摘されています。それはマイクロタスクのスケジューリングとイベントループの統合に関するものです。以下のコードでは `.first()` メソッドの後に `e.preventDefault()` が呼び出されていますが、Promise が解決された後（マイクロタスクキューが取り出された後）に呼び出されるためもはやイベントをキャンセルすることができません。

```js
button.when("click")
  .first()
  .then(e => {
    // イベントをキャンセルすることができない
    e.preventDefault();
  });
```

このようなケースでは常に `first()` を呼び出す前に `e.preventDefault()` を呼び出す必要があります。

```js
button.when("click")
  .map(e => {
    e.preventDefault();
    return e;
  })
  .first()
  .then(e => {
    // ...
  });
```

もしくは `first()` メソッドの構造を変更し、Promise が解決される前にイベントをキャンセルするようにすることも案として挙げられています。

```js
button.when("click")
  .first(e => {
    e.preventDefault();
    return e;
  })
  .then(e => {
    // ...
  });
```

この懸念事項についてはすでに Observable エコシステムで存在しているというものであるという意見もあります。そして開発者がこのような問題に遭遇することは少ないと考えられており、この動作を Web プラットフォームにこのまま組み込んだとしても危険ではないという主張です。
## 参考

- [WICG/observable: Observable API proposal](https://github.com/WICG/observable?tab=readme-ov-file#the-observable-api)
- [Observable](https://wicg.github.io/observable/#core-infrastructure)
- [Improving ergonomics of events with Observable · Issue #544 · whatwg/dom](https://github.com/whatwg/dom/issues/544#issuecomment-351457179)
- [Observable API · Issue #902 · w3ctag/design-reviews](https://github.com/w3ctag/design-reviews/issues/902)