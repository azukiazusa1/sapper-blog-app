---
id: 5KDAbZLdfrR9Jr7utYth5
title: "フォームの Enter 送信で isComposing と keyCode === 229 を併用する理由"
slug: "ime-enter-submit"
about: "IME の変換確定に使う Enter キーで、書きかけのメッセージが送信されることがあります。isComposing と非推奨の keyCode === 229 を併用して、変換中の Enter を送信処理から除外する理由を解説します。"
createdAt: "2026-09-06T13:46+09:00"
updatedAt: "2026-09-06T13:46+09:00"
tags: ["JavaScript", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1Bh5R0SvJgw6wywbUpdbZO/4d88a4955b8a8a889aabd64d8ea0be09/omisoshiru_7382-768x698.png"
  title: "味噌汁のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "IME 変換中の判定のために非推奨の API keyCode を併用する理由は何ですか？"
      answers:
        - text: "ブラウザの実装によっては isComposing が false になることがあるため"
          correct: true
          explanation: "Safari などの一部ブラウザでは、IME の変換確定 Enter が isComposing: false で通知されることがあります。"
        - text: "keyCode は IME の種類を判別するために必要だから"
          correct: false
          explanation: "keyCode は IME の種類を判別する目的では使われません。"
        - text: "isComposing は最新の API でありまだ対応していないブラウザがあるため"
          correct: false
          explanation: "isComposing は広くサポートされています。"
        - text: "keyCode は Enter キーの押下を検知するために必要だから"
          correct: false
          explanation: "Enter キーの押下は event.key で検知できます。"
    - question: "単一行の入力欄を持つ通常のフォームで Enter キーによる送信を実装するとき、まず検討すべき方法はどれですか？"
      answers:
        - text: "form 要素と送信ボタンを配置し、暗黙的送信と submit イベントを利用する"
          correct: true
          explanation: "変換確定の Enter を送信として扱うかどうかの判断をブラウザに任せられるため、アプリケーション側で IME の状態を管理する必要がなくなります。"
        - text: "input 要素の keydown で Enter キーを検知して送信する"
          correct: false
          explanation: "独自のキーイベント処理は、変換確定の Enter を送信と誤認する原因になります。"
        - text: "compositionend イベントが発生したときに送信処理を実行する"
          correct: false
          explanation: "compositionend は変換が確定したことを表すイベントであり、送信したいという意図とは対応しません。"
        - text: "keydown ではなく keyup で Enter キーを検知して送信する"
          correct: false
          explanation: "keyup に変えても、そのキー入力が変換確定によるものかどうかを判別できるわけではありません。"
published: true
---
チャット UI などで Enter キーを押したらメッセージを送信する機能を実装するとき、IME を利用するユーザーへの配慮が必要です。日本語や中国語などの入力では、文字を組み立てるために変換候補を選んでから Enter キーで確定します。単純に `event.key === "Enter"` だけで送信すると、ユーザーは文字を確定したつもりなのに、書きかけのメッセージが送られてしまいます。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/2PwLZE8dzwixEuoNf1cpSy/07cc88ad3df13884ccbb665917df1bec/ime-enter-submit-3.mp4 482x176)

変換を確定するつもりで押した Enter キーによって、書きかけのメッセージがそのまま送信されてしまっています。

この問題への対策として、次のようなコードを見かけることがあります。

```js
input.addEventListener("keydown", (event) => {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key === "Enter") {
    // 送信処理...
  }
});
```

`isComposing` は、IME で文字を組み立てている間に発生するイベントかどうかを判定するプロパティです。`keyCode === 229` は、IME が処理したキー入力で使われてきた値です。どちらも変換中の Enter キーを送信処理から除外するために使われます。

`isComposing` だけで IME の変換中かどうかを表せるのに、なぜ `keyCode` も確認するのでしょうか。さらに言えば `keyCode` は非推奨の API です。この記事では、フォームやチャットの Enter 送信を題材に、2 つの判定を組み合わせる理由と実装時の注意点を説明します。

## Enter キーは送信だけでなく変換確定にも使われる

IME（Input Method Editor）は、キー入力を組み合わせて日本語などの文字を入力する仕組みです。たとえば「にほんご」と入力し、「日本語」という候補を選び、Enter キーで確定します。

ブラウザは、このような文字の組み立てを composition セッションとして扱います。[UI Events 仕様](https://w3c.github.io/uievents/#events-compositionevents)では、次のイベントが定義されています。

- `compositionstart`: 文字の組み立てが始まる
- `compositionupdate`: 組み立て中の文字列が更新される
- `compositionend`: 組み立てが完了、またはキャンセルされる

キーボードイベントの [`KeyboardEvent.isComposing`](https://w3c.github.io/uievents/#dom-keyboardevent-iscomposing) は、そのイベントが `compositionstart` と対応する `compositionend` の間に発生したかどうかを表します。

そのため、独自の Enter 送信ではまず `isComposing` を確認し、文字を組み立てている間は送信処理へ進まないようにします。

```js
input.addEventListener("keydown", (event) => {
  if (event.isComposing) return; // 変換中は送信しない
  if (event.key === "Enter") {
    // 送信処理...
  }
});
```

ただし、ブラウザの実装によっては、IME の変換確定に使う Enter キーが `isComposing: false` で通知されるという問題が報告されています。

## `isComposing` だけでは確定用の Enter を見分けられない環境がある

[仕様が示すイベント順序](https://w3c.github.io/uievents/#events-composition-key-events)では、composition セッションを終了させる `keydown` は `isComposing: true` で通知され、その後に `compositionend` が発生するとされています。つまり、IME が変換を確定する Enter キーは、`isComposing: true` の `keydown` として受け取れるはずです。

一方、[WebKit の不具合報告 #165004](https://bugs.webkit.org/show_bug.cgi?id=165004#c4)には、Safari が確定用の `keydown` より先に `compositionend` を送っていたことが記録されています。この場合、確定用の Enter を受け取った時点でセッションが終わっているため、`isComposing` は `false` になってしまうのです。

![](https://images.ctfassets.net/in6v9lxmm5c8/4sIPTsamo1rFnxadx7lUz0/8322decc9576c6b65ad700ab5401a5e0/ime-enter-submit-1.png)

そのため、Safari では `isComposing` だけでは確定用の Enter を見分けられず、書きかけのメッセージが送信されてしまうことがあったのです。

ここで `isComposing` に頼らず、`compositionstart`・`compositionend` イベントでフラグを更新し、変換中かどうかを自分で管理すればよいのではないかと考えるかもしれません。

```js
let composing = false;

input.addEventListener("compositionstart", () => {
  composing = true;
});

input.addEventListener("compositionend", () => {
  composing = false;
});

input.addEventListener("keydown", (event) => {
  if (composing) return; // 変換中は送信しない
  if (event.key === "Enter") {
    // 送信処理...
  }
});
```

しかし、この方法でも同じ問題が起こります。フラグを `false` にする `compositionend` イベントが確定用の `keydown` より先に発生してしまうため、`keydown` を受け取った時点ではフラグがすでに変更されてしまっているからです。問題の原因はイベントの順序そのものにあるので、composition イベントを自分で管理しても回避できないのです。

## `keyCode === 229` を併用する

`keyCode === 229` は、IME が処理するキー入力で使われてきた値です。[2010 年の W3C の提案資料](https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html)には、IME がキー入力を処理している `keydown` では `229` を返すという計算手順が書かれています。また、Windows の仮想キーコードでは [`VK_PROCESSKEY` が `0xE5`（10 進数で 229）](https://learn.microsoft.com/en-us/windows/win32/inputdev/virtual-key-codes)として定義されています。

ただし、[現在の UI Events 仕様の legacy keyboard events](https://w3c.github.io/uievents/#legacy-key-attributes)では、`keyCode` はシステムや実装に依存する値として扱われています。正式に規定されないまま各ブラウザが独自に実装してきた経緯があり、仕様はその実態を非規範的に記述するにとどめているためです。

Safari の問題でこの値が役立つのは、`isComposing` が `false` になっていても、確定用の `keydown` の `keyCode` が `229` なら独自の送信処理を止められるからです。この回避策は、先ほどの [WebKit の不具合報告](https://bugs.webkit.org/show_bug.cgi?id=165004#c4)でも説明されています。

そのため、以下のように `isComposing` と `keyCode === 229` を併用するコードが推奨されているのです。

```js
if (event.isComposing || event.keyCode === 229) {
  return;
}
```

以下のデモを Safari で実行してみると、`isComposing` と `event.keyCode` の値がそれぞれどのように変化するかを確認できます。

:::info
Safari のイベント順序の問題には、すでに WebKit 側の修正があります。[WebKit Bug #311717](https://bugs.webkit.org/show_bug.cgi?id=311717)。そのため Safari のバージョンによっては既に修正が取り込まれている場合があります。
:::

![](https://images.ctfassets.net/in6v9lxmm5c8/1sia2WnHpA2Y6TWt4YrFb6/bcb1d890054355a62203f88afc82a20d/ime-enter-submit-2.png)

<iframe height="300" style="width: 100%;" scrolling="no" title="IME と Enter キーのイベント" src="https://codepen.io/azukiazusa1/embed/ByWjXmW?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ByWjXmW">
  IME と Enter キーのイベント</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## フォームの暗黙的送信を使えば IME の判定をブラウザに任せられる

ここまでは、`keydown` で Enter キーを検知して送信する場合の対策を説明しました。しかし、通常のフォームであれば、そもそも Enter キーを JavaScript で検知する必要はありません。ブラウザが備える暗黙的送信（implicit submission）を利用できます。

暗黙的送信とは、テキスト入力欄で Enter キーを押すなどの操作によって、送信ボタンを直接クリックしなくてもフォームを送信する仕組みです。[HTML 仕様](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission)では、フォームの中で最初に現れる送信ボタンをデフォルトボタン（default button）と呼び、暗黙的送信に対応するブラウザは、そのボタンが無効化されていなければ `click` イベントを発生させるとされています。送信処理は通常の `submit` イベントで受け取ります。

たとえば、単一行の入力欄と送信ボタンを持つフォームなら、次のように実装できます。`<form>` 要素で入力要素を囲み、`type="submit"` のボタンを配置してフォームとして扱うのがポイントです。

```html
<form id="message-form">
  <label for="message">メッセージ</label>
  <input id="message" name="message" type="text" required />
  <button type="submit">送信</button>
</form>
<p id="result" role="status"></p>

<script>
  const form = document.querySelector("#message-form");
  const result = document.querySelector("#result");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    result.textContent = `送信内容: ${data.get("message")}`;
  });
</script>
```

このコードには、`keydown` のリスナーも `isComposing` や `keyCode` の判定もありません。変換確定の Enter を IME の操作として扱うか、フォームの送信として扱うかはブラウザに任せ、アプリケーションは `submit` イベントが発生したときだけ処理します。独自のキーイベント処理が変換確定を送信と誤認する原因そのものをなくせるのです。

ただし、`textarea` の Enter は通常は改行として扱われます。チャット UI のように「Enter で送信、Shift+Enter で改行」という独自の操作を実装する場合は、暗黙的送信だけでは実現できないため、ここまで説明した IME の判定が必要になります。まずは標準のフォーム操作で要件を満たせるかを検討し、独自の Enter 送信が必要な場合にキーイベントを扱うとよいでしょう。

## まとめ

- Enter キーは IME の変換確定にも使われるため、独自の Enter 送信では文字の組み立て中かどうかを確認する
- `isComposing` は composition セッション中のキーボードイベントかどうかを表し、IME 変換中の判定に使える
- Safari では確定用の `keydown` より先に `compositionend` が発生する問題が報告されており、`isComposing` が `false` になることがある
- 上記の問題を回避するため、`keyCode === 229` も併用して IME が処理するキー入力かどうかを判定する
- 通常のフォームでは暗黙的送信と `submit` イベントを利用することで、独自の Enter 判定や IME の状態管理をブラウザに任せられる

## 参考

- [UI Events — Composition Events](https://w3c.github.io/uievents/#events-compositionevents)
- [UI Events — Legacy keyboard event attributes](https://w3c.github.io/uievents/#legacy-key-attributes)
- [WebKit Bug 165004 — The event order of keydown/keyup events and composition events are wrong on macOS](https://bugs.webkit.org/show_bug.cgi?id=165004)
- [WebKit Bug 311717 — Fix a regression and turn on correct composition event ordering by default](https://bugs.webkit.org/show_bug.cgi?id=311717)
- [modern-web-guidance/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md at v0.0.186 · GoogleChrome/modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance/blob/v0.0.186/skills/modern-web-guidance/guides/forms/ime-safe-enter-submit.md)
- [HTML Standard — Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission)
