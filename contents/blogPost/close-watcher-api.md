---
id: 2a7jut6E_xTcfUYKzus5O
title: "UI を閉じる動作を処理する CloseWatcher API"
slug: "close-watcher-api"
about: "CloseWatcher API は UI を閉じる動作を処理するための API です。キーボードの `Esc` キー、Android の戻るボタンなどのデバイス固有のメカニズムによって閉じるイベントを提供します。"
createdAt: "2024-09-28T15:08+09:00"
updatedAt: "2024-09-28T15:08+09:00"
tags: ["JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3zdNYy46zgKqtSKzqQj5wW/9655002afba9045d3d2331f235084da3/wagashi_yatsuhashi_11036-768x542.png"
  title: "wagashi yatsuhashi 11036-768x542"
selfAssessment:
  quizzes:
    - question: "CloseWatcher のインスタンスで close request を購読するためのプロパティはどれか？"
      answers:
        - text: "onclose"
          correct: true
          explanation: null
        - text: "onrequestclose"
          correct: false
          explanation: null
        - text: "oncancel"
          correct: false
          explanation: null
        - text: "ondestroy"
          correct: false
          explanation: null
published: true
---
!> `CloseWatcher` API は 2024 年 9 月 28 日現在 Chrome, Edge v126 以降でのみ利用可能です。

ダイアログやポップアップ、ピッカー、通知などの UI はユーザーによって閉じられることが想定されています。このような UI は閉じるボタンによって閉じられる他に、デバイス固有のメカニズムによっても閉じられることが期待されています。例えば、キーボードでは `Esc` キーを押すことで、Android では戻るボタンを押すことで UI を閉じることができます。

ブラウザの標準の要素を使用している場合、これらのメカニズムは自動的に提供されます。しかし、開発者が独自の UI を作成する場合、これらのメカニズムを実装する必要があり、困難な作業です。`CloseWatcher` API は、これらのメカニズムを提供するための API です。ユーザーにより閉じるアクションが要求された場合、`close` イベントが発生するので、開発者はこのイベントを監視することで UI を閉じる処理を実装できます。

## 閉じる動作を処理する

ここでは独自の UI コンポーネントを作成し、`CloseWatcher` API を使用して閉じる動作を処理する方法を紹介します。通知のバナーを作成し、ユーザーは閉じるボタンをクリックするか、`Esc` キーを押すことで通知を閉じることができるようにします。

```js
const notification = document.getElementById("notification");
const closeButton = document.getElementById("close");

const watcher = new CloseWatcher();

watcher.onclose = () => {
  notification.remove();
};

closeButton.addEventListener("click", () => {
  watcher.requestClose();
});
```

はじめに `new CloseWatcher()` で `CloseWatcher` インスタンスを作成します。`CloseWatcher` のインスタンスアクティブなページ 1 つにつき 1 つのみ作成できます。新たに `CloseWatcher` インスタンスを作成する場合は、`watcher.destroy()` メソッドで既存のインスタンスを破棄する必要があります。

`watcher` の `onclose` プロパティで [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request) を受け取った際の処理を定義します。ここでは、`notification.remove()` で通知 UI を削除しています。

`watcher.requestClose()` を呼び出すことで、close request を発生させることができます。ここでは閉じるボタンがクリックされた際に `watcher.requestClose()` を呼び出すことで、通知 UI が閉じられるようにしています。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/LYwVaNW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/LYwVaNW">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## close request をキャンセルする

`oncancel` プロパティを使用することで close request を要求された場合にキャンセルできます。例えば、ダイアログのフォームに入力された内容が保存されていない場合、ユーザーがダイアログを閉じる際に本当に閉じるか確認するようなケースで使用できます。

```js
const dialog = document.getElementById("my-dialog");
const closeButton = document.getElementById("close");

const watcher = new CloseWatcher();

watcher.onclose = () => {
  dialog.remove();
};

closeButton.addEventListener("click", () => {
  watcher.requestClose();
});

watcher.oncancel = (e) => {
  if (e.cancelable) {
    e.preventDefault();

    if (confirm("Are you sure you want to close?")) {
      watcher.close();
    }
  }
};
```

`watcher.oncancel` プロパティは close request が要求された場合に呼び出されるコールバック関数を定義します。`e.cancelable` が `true` の場合、`e.preventDefault()` を呼び出すことで閉じる動作を無効にします。その後、`confirm()` を使用してユーザーに確認を求め、ユーザーが OK をクリックした場合に `watcher.close()` を呼び出すことでダイアログを閉じます。`watcher.close()` は `watcher.closeRequest()` と異なり、直ちに `onclose` プロパティで定義された処理を実行します。

~> 不正利用を防止するために、`oncancel` イベントはページが `history-action activation` を有している場合のみ有効になります。`history-action activation` は close request があった際に失われます。つまり、1 度 `oncancel` イベントで close request をキャンセルした場合、次回の close request では `oncancel` イベントは発生せず必ず `onclose` イベントが発生します。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/eYqNXgp?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/eYqNXgp">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `CloseWatcher` API は UI を閉じる動作を処理するための API。キーボードの `Esc` キー、Android の戻るボタンなどのデバイス固有のメカニズムによって閉じるイベントを提供する
- `new CloseWatcher()` で `CloseWatcher` インスタンスを作成し、`watcher.onclose` で閉じる動作を処理する
- `watcher.requestClose()` で close request を発生させることができ、`watcher.oncancel` で close request をキャンセルすることができる
- `oncancel` イベントはページが `history-action activation` を有している場合のみ有効になる

## 参考

- [6.10.3 The CloseWatcher interface](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)
- [CloseWatcher - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/CloseWatcher)
