---
id: 58jOkly34za7bReJ0iDMw
title: "宣言的にカメラ・マイク権限を要求する `<usermedia>` 要素"
slug: "usermedia-html-element"
about: "Chrome 151 で `<usermedia>` 要素が使えるようになりました。従来の `getUserMedia()` の問題を解決するために提案された新しい HTML 要素です。この記事では、仕様の概要と、実際に動かしてみた様子を紹介します。"
createdAt: "2026-08-16T16:40+09:00"
updatedAt: "2026-08-16T16:40+09:00"
tags: ["HTML", "WebRTC"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/57ZRQJeVGx4QvLkQn2N3qP/a7bc11c1da4c0deeffcb0fc48c347523/antique_camera_8236-768x626.png"
  title: "アンティークカメラのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`<usermedia>` の疑似クラスとして使用でき、権限が許可されている場合にマッチするものはどれですか?"
      answers:
        - text: ":granted"
          correct: true
          explanation: "`:granted` 疑似クラスは権限が許可されている場合にマッチします。"
        - text: ":ok"
          correct: false
          explanation: "`:ok` は `<usermedia>` の疑似クラスではありません。"
        - text: ":allowed"
          correct: false
          explanation: "`:allowed` は `<usermedia>` の疑似クラスではありません。"
        - text: ":permission"
          correct: false
          explanation: "`:permission` は `<usermedia>` の疑似クラスではありません。"

published: true
---
!> `<usermedia>` 要素は 2026 年 8 月時点で Chrome 151 以降でのみ利用できます。また、標準化作業中の機能であり、今後仕様が変更される可能性があります。

ビデオ会議や音声入力のように、カメラとマイクを使う Web アプリケーションを使用する際以下のようなビデオや音声の権限プロンプトを目にしたことがあるでしょう。もし許可なしにカメラやマイクをブラウザに使われてしまうと、盗聴や盗撮の危険があるため、必ずユーザーの許可を得る必要があるのです。

![](https://images.ctfassets.net/in6v9lxmm5c8/5tVpvY2SegZhbhB2WzCRsB/19c61d5806246b84243390049d1e0f3b/image.png)

このとき困るのは、ユーザーが間違えて「許可しない」を選んでしまったあとです。次回以降何度 `getUserMedia()` を呼んでも `NotAllowedError` が発生し、プロンプトは出ずに即座に失敗します。サイト側からは、ユーザーにブラウザの設定画面を開いてもらうよう案内する以外に打つ手がありません。「間違えて権限ブロックしてしまったのでブラウザ再起動してきます...」といったやり取りを 1 度は経験したことがある人も多いでしょう。[Explainer](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md) では、この状況を permission hole と呼んでいます。

![](https://images.ctfassets.net/in6v9lxmm5c8/nHt4faJAA3bAOmv6FN237/e282b9e9e57e3037273b84a97381d4c6/image.png)

これは、権限を JavaScript から要求するものとして設計したことによる構造的な問題です。ユーザーの「通話に参加」ボタンを押して権限の要求を呼び出したのか、それともスクリプトが勝手に呼び出したのかをブラウザは知ることができません。もしユーザーが権限をブロックした後もプロンプトを出し続ければ、悪意のあるサイトがスクリプトで何度も呼び出して永遠にプロンプトを出し続けられるような攻撃が可能になってしまいます。そこで、ブラウザは一度でもブロックされたサイトに対しては、スクリプトからの要求を抑制するようになりました。

その一方で、本当に権限を与えたかったにも関わらず間違えてブロックしてしまったユーザーの回復手段が失われてしまったのです。

Chrome 151 で使えるようになった [`<usermedia>`](https://developer.chrome.com/blog/usermedia-html-element) 要素は、この問題を解決するために提案されたものです。HTML 要素を使用して宣言的な方法でユーザーの権限を要求することにより、一度アクセスを拒否したユーザーに対して自然な回復手段を提供します。

この記事では、`<usermedia>` の概要について紹介し、実際に動かしてみた様子を紹介します。

## 従来の `getUserMedia()` による権限要求のおさらい

まずはじめに、従来の `getUserMedia()` による権限要求のコード例を見てみましょう。下記のコードでは、ユーザーが「通話に参加」ボタン（`#join`）を押したときに `navigator.mediaDevices.getUserMedia()` を呼び出してカメラとマイクの権限を要求しています。権限の取得に成功した場合は、取得した `MediaStream` を `<video>` 要素にセットしてプレビューを表示します。

```js
const joinButton = document.querySelector("#join");
const preview = document.querySelector("#preview");

joinButton.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    preview.srcObject = stream;
  } catch (error) {
    // NotAllowedError のとき、ここから権限を取り戻す手段がない
    // ユーザーにブラウザの設定画面を開いてもらうよう案内するしかない
    showManualInstructions();
  }
});
```

<iframe height="300" style="width: 100%;" scrolling="no" title="getUserMedia によるカメラとマイクの取得例" src="https://codepen.io/azukiazusa1/embed/azpreer?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allow="camera; microphone">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/azpreer">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

ユーザーがボタンを押したときに権限プロンプトが出て、許可すればプレビューが表示されます。しかし、ユーザーが過去にブロックを選んでいた場合、この `getUserMedia()` は `NotAllowedError` で即座に失敗します。権限プロンプトすら出ないため、サイト側からはユーザーにブラウザの設定画面を開いてもらうよう案内するしかありません。

## `<usermedia>` 要素とは

`getUserMedia()` の呼び出しの問題点は、JavaScript から呼び出すため、ブラウザがユーザーの意図を知ることができない点にあります。ページ内のどのボタンをユーザーが押したのかをブラウザが知っていれば、権限プロンプトを出すかどうかの判断が可能です。

そこで、宣言的な方法で権限要求を行うために、`<usermedia>` 要素が提案されました。`<usermedia>` 要素は以下のようにブラウザが描画するボタンとして表示されます。内部のテキストはローカライズされユーザーの言語に応じて変化します。

![](https://images.ctfassets.net/in6v9lxmm5c8/1JiKJhlbddO5ETqW6ZCnVD/88936b8fddec3309afd5920a8e2be8b7/image.png)

ユーザーが `<usermedia>` 要素をクリックすると、ブラウザは必要に応じて権限プロンプトを表示します。成功すれば `stream` イベントを発火して `stream` プロパティに `MediaStream` をセットします。この `MediaStream` を `<video>` 要素にセットすれば、プレビューが表示されます。

```html
<usermedia id="capture"></usermedia>
<video id="preview" autoplay playsinline muted></video>
```

```js
const capture = document.getElementById("capture");
const preview = document.getElementById("preview");

// ユーザーがボタンをクリックして権限要求に成功した場合、ストリームが得られる
capture.addEventListener("stream", () => {
  preview.srcObject = capture.stream;
});

// エラーが発生した場合
capture.addEventListener("error", () => {
  console.error(capture.error);
});

// ユーザーが権限プロンプトを閉じた場合
capture.addEventListener("cancel", () => {
  console.log("Permission prompt was dismissed by the user.");
});
```

以下のように「マイクとカメラの使用」ボタンをクリックすると、権限プロンプトが表示され、許可すればプレビューが表示されることが確認できます。また、一度権限プロンプトを閉じた後でも、再度ボタンをクリックすれば権限プロンプトが表示されるという挙動も確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4LoyKEA3bFAj5oE29xSog8/7dbbbbfef049abd6c0263e14cbfc17f2/image.png)

:::note
この要素は [PEPC（Page Embedded Permission Control）](https://github.com/WICG/PEPC) として提案されていた `<permission type="camera">` の後継にあたります。汎用の `<permission>` を能力ごとの要素に分割する方針に変わり、先に `<geolocation>` が、続いて `<usermedia>` が実装されました。
:::

ユーザーのインタラクションの前に `.setConstraints()` を呼び出すことで、解像度やフレームレートなど、`getUserMedia()` と同様の制約を指定できます。

```js
capture.setConstraints({
  video: { width: { ideal: 1280 }, height: { ideal: 720 } },
  audio: { echoCancellation: true },
});
```

ただし、`getUserMedia()` に渡す制約と完全に同じではありません。現在の仕様案では、`exact`・`min`・`max` などの必須制約や `advanced` 制約は、制約に一致するデバイスが見つからない場合にユーザーへ何も示されないまま失敗することを避けるため、ユーザーエージェントによって取り除かれます。

また、`<usermedia>` 要素は `getUserMedia()` と同様にセキュアコンテキストでのみ動作します。HTTPS で配信されたページまたは `localhost` などのローカル環境で使用する必要があります。セキュアコンテキストでない場合は、要素のフォールバックコンテンツが表示されます。

## スクリプトからの `click()` では発火しない

`<usermedia>` の要点は、ブラウザが「ユーザーが本当に望んだ要求か」を判断できることです。これを宣言的なボタンをクリックさせることにより実現しているのですが、少し勘のいい人なら JavaScript からボタンを強制的にクリックさせることはできるのではないかと考えるでしょう。しかし、このような穴は当然見過ごされるはずもなく、スクリプトからのクリックでは権限要求は発火しないように設計されています。

次のコード例で実際に試してみましょう。

```js
const capture = document.getElementById("capture");
// 500ms 後にスクリプトからクリックを呼び出す
setTimeout(() => {
  capture.click();
}, 500);

capture.addEventListener("stream", () => {
  console.log("stream イベント。capture.stream =", capture.stream);
});
capture.addEventListener("error", () => {
  console.error("error イベント。error =", capture.error);
});
```

このコードを実行すると、`InvalidStateError` が発生し、`stream` イベントは発火せず、`error` イベントが発火します。

```
InvalidStateError: The permission element activation must be triggered by a user gesture.
```

## ブラウザが信頼する UI であるための制約

ブラウザが要素を「信頼できるボタン」として扱う以上、ページ側がその見た目を自由に変えられては困ります。ユーザーに見えないボタンや、別の意味に見えるボタンを踏ませることができてしまうためです。そこで `<usermedia>` にはスタイルの制約が設けられています。

Chrome の解説によれば、スタイルには次のような制限があります。

- 文字色と背景色のコントラスト比は 3:1 以上
- `opacity` は 1 でなければならない
- 幅、高さ、フォントサイズに上限と下限がある
- 負のマージンや `outline-offset` は使えない
- `transform` は 2D の平行移動と等比の拡大縮小に限られる

実際に試してみましょう。以下のコードでは `<usermedia>` 要素に `font-size: 4px` を指定してボタンを小さく表示しています。

```html
<usermedia style="font-size: 4px;" id="capture"></usermedia>
```

![](https://images.ctfassets.net/in6v9lxmm5c8/GTGOn39EO4RooQFafhAGq/46fc7120580f3ed38ce459c2922706e3/image.png)

この状態でボタンをクリックすると、`InvalidStateError` が発生し、`error` イベントが発火します。エラーメッセージからスタイルの制約により失敗していることがわかります。

```
InvalidStateError: The permission element is disabled due to: invalid style.
```

一方で、透明化や画面外への移動を防ぐため、以下の `opacity` や `transform` のスタイル指定は適用されません。

```html
<usermedia style="opacity: 0; transform: translateX(-1000px);" id="capture"></usermedia>
```

![](https://images.ctfassets.net/in6v9lxmm5c8/28HeUjkAnMp9nDsY8i1nMr/35e544c1bc10e7f31db896b9f379810d/image.png)

## 要素を操作できる状態になるまで待つ

`<usermedia>` 要素は、DOM に挿入された直後やレイアウトが変化している最中には活性化できない場合があります。ユーザーがクリックする直前に要素を挿入したり移動したりして、別の UI に見せかけるクリックジャッキングを防ぐためです。

マウス操作に合わせて `<usermedia>` 要素を動的に埋め込む例を見てみましょう。

```js
const mount = document.getElementById("mount");

mount.addEventListener(
  "pointerenter", () => {
    const capture = document.createElement("usermedia");
    capture.id = "capture";
    mount.appendChild(capture);
  },
  { once: true }
);
```

表示された要素を素早くクリックしたところ、次の `InvalidStateError` が発生しました。

```
InvalidStateError: The permission element is disabled due to: being recently attached to layout tree, intersection occluded or distorted, intersection with viewport changed.
```

エラーメッセージには複数の理由が含まれる場合があります。この例では、要素がレイアウトツリーに追加された直後であることに加え、ビューポートとの交差状態が変化したことなどが理由として示されています。ページに `<usermedia>` 要素が表示されてから少し待ってからクリックする必要があるということですね。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4V0OD1aCMJokvAxjbBIVsM/c3d7e10807cec16a899f61b4a51d71a4/d7246f11-48bf-438b-9089-b5bc61bdb9ce.mov" controls></video>

### 要素がクリップされている

`<usermedia>` 要素の一部が `overflow: hidden` などでクリップされている場合も活性化できません。次の例では、親要素の幅を `<usermedia>` 要素より小さくして、右側を隠しています。

```html
<div class="clip-container">
  <usermedia id="capture"></usermedia>
</div>

<style>
  .clip-container {
    width: 95px;
    height: 48px;
    overflow: hidden;
  }

  #capture {
    width: 220px;
  }
</style>
```

ボタンの見えている部分をクリックしたところ、次の `InvalidStateError` が発生しました。

```
InvalidStateError: The permission element is disabled due to: intersection out of viewport or clipped.
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2xlQuu8QHkGvUFxI8g4v4A/aacda4891c8c92022e2b6bdd216464cf/image.png)

### 要素が別の要素に覆われている

`<usermedia>` 要素が別の要素に覆われている場合も、クリックジャッキングの可能性があるため活性化が拒否されます。次の例では、`pointer-events: none` を指定した半透明の要素を一部に重ねています。クリックイベント自体は `<usermedia>` 要素へ届きますが、表示の一部が隠れているため権限要求は実行されません。

```html
<div class="capture-container">
  <usermedia id="capture"></usermedia>
  <div class="cover"></div>
</div>

<style>
  .capture-container {
    position: relative;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 90px;
    height: 20px;
    background: rgb(0 0 0 / 70%);
    pointer-events: none;
  }
</style>
```

この状態で、覆われていない部分をクリックしたところ、次の `InvalidStateError` が発生しました。

```
InvalidStateError: The permission element is disabled due to: intersection occluded or distorted.
```

要素の一部だけが隠れている場合や、覆っている要素が `pointer-events: none` でクリックを妨げない場合でも拒否される点に注意してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/2W4kkf2lbkbOvsySHcHxd5/8bc2a1ca37d54e55b193de3e15a464be/image.png)

なお、これらの具体的な判定条件やエラーメッセージは Chrome の実装に依存します。[Media Capture and Streams Extensions の仕様](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements)では、ユーザーエージェントは少なくとも信頼されていないイベントを拒否し、さらにイベントを信頼できるか判断するための実装依存の手順を実行することが推奨されています。

## 指定できるスタイルと擬似クラス

`<usermedia>` の見た目は、制約の範囲内であれば自由に変えられます。なお、内部テキストの内容は変更できません。

`<usermedia>` 要素は、`<button>` 要素と同じように擬似クラスを指定できます。`:hover`、`:active` などの擬似クラスを指定して、ホバー時や押下時の見た目を変えることができます。特別な擬似クラスとして `:granted` が用意されています。`:granted` は権限が許可され、ストリームが取得された状態のときに有効になります。

```css
usermedia {
  /* padding を効かせるには width / height が auto である必要がある */
  width: auto;
  height: auto;
  padding: 0.6em 1.4em;

  background-color: #1a56db;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid #1a56db;
  border-radius: 999px;
  cursor: pointer;
}

usermedia:hover {
  background-color: #1e429f;
  border-color: #1e429f;
}

usermedia:active {
  background-color: #233876;
  border-color: #233876;
}

/* 許可済みなら塗りつぶしをやめ、白地に青枠にする */
usermedia:granted {
  background-color: #ffffff;
  color: #1a56db;
  border-color: #1a56db;
}
```

色を変える際は、どの状態でもコントラスト比 3 以上を保つ必要がある点に注意してください。ホバー時だけ色を薄くする、といった指定で比率が 3 を下回ると、その状態で要素が無効になります。以下のようにスタイルが適用された状態のボタンを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/f8i5kL2VwcbNxesDEu950/9879e26b69daf93be3d25a3771eb6d61/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/26PfffVC5i7ziqxotgPlgS/50034e5a0ba7573d9370f450b2c12329/image.png)

## フォールバック

現時点で対応しているブラウザは Chrome 151 以降のみです。もし本番で使う場合は、未対応ブラウザでは従来どおり自前のボタンから `getUserMedia()` を呼ぶようにフォールバックする必要があります。

未対応ブラウザは `<usermedia>` を未知の HTML 要素として扱い、子要素を通常どおり表示します。そこで、次のようにフォールバック用のボタンを子要素として配置します。対応ブラウザでは、ブラウザが描画する UI が代わりに表示されます。

```html
<usermedia id="capture">
  <button id="fallback-button" type="button">
    カメラとマイクを使用
  </button>
</usermedia>
<video id="preview" autoplay playsinline muted></video>
```

```js
const preview = document.getElementById("preview");

if ("HTMLUserMediaElement" in window) {
  const capture = document.getElementById("capture");
  capture.setConstraints({
    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: { echoCancellation: true },
  });
  capture.addEventListener("stream", () => {
    preview.srcObject = capture.stream;
  });
  capture.addEventListener("error", () => {
    showManualInstructions(capture.error);
  });
} else {
  // 未対応ブラウザでは従来どおり自前のボタンから getUserMedia() を呼ぶ
  document.getElementById("fallback-button").addEventListener("click", async () => {
    try {
      preview.srcObject = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch (error) {
      showManualInstructions(error);
    }
  });
}
```

## まとめ

- 従来の `getUserMedia()` では、一度ブロックされるとサイト側から権限を再設定できなかった。この問題を解決するために宣言的な方法で権限要求を行う `<usermedia>` が提案された
- `<usermedia>` 要素をクリックすると、ブラウザは必要に応じて権限プロンプトを表示し、成功すれば `stream` イベントを発火して `MediaStream` を取得できる
- スクリプトから `click()` を呼んでもストリームは取得できず、`InvalidStateError` になる。要素そのものへのユーザー操作が必要である
- ブラウザが信頼する UI であるためのスタイル制約があり、透明化や画面外への移動を防ぐために値の補正または活性化の拒否が行われる。コントラスト比やサイズなどの制約に違反した場合や、要素がクリップされたり別の要素に覆われたりした場合は `InvalidStateError` になる
- 擬似クラス `:granted` が用意されており、権限が許可され、ストリームが取得された状態のときに有効になる

## 参考

- [The `<usermedia>` HTML element - Chrome for Developers](https://developer.chrome.com/blog/usermedia-html-element)
- [Media Capture and Streams Extensions - The usermedia HTML element](https://w3c.github.io/mediacapture-extensions/#the-usermedia-html-element)
- [Media Capture Elements Explainer](https://github.com/w3c/mediacapture-extensions/blob/main/media-capture-elements-explainer.md)
- [Add Media Capture Elements (`<usermedia>`, `<camera>`, `<microphone>`) and Explainer #168](https://github.com/w3c/mediacapture-extensions/pull/168)
- [Discussion thread for an `<usermedia>` element · WICG/PEPC #62](https://github.com/WICG/PEPC/issues/62)
- [`<usermedia>` element（初期の Explainer） · WICG/PEPC](https://github.com/WICG/PEPC/blob/main/usermedia_element.md)
