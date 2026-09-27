---
id: 14NQ12eIdGyraxTAkSsxy
title: "iframe の高さをコンテンツに合わせる CSS の frame-sizing"
slug: "responsive-iframes"
about: "外部サービスのコメント欄やフォームを iframe で埋め込むと、内容の高さと枠の高さが合わず、スクロールや余白が生じることがあります。frame-sizing を使うと、埋め込み側の許可のもとで内容に応じた高さを使えます。"
createdAt: "2026-09-27T09:38+09:00"
updatedAt: "2026-09-27T09:38+09:00"
tags: ["CSS", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2VBZsus3vRkqB5ps7bf5Uu/2c7e55b256156ba338b0c7b3680d4d92/shell_makigai_illust_627-768x762.png"
  title: "青い巻貝のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "frame-sizing: content-height で内容に合わせた高さを使うために必要な設定はどれですか？"
      answers:
        - text: "親の iframe に width: 100% だけを指定する"
          correct: false
          explanation: "width: 100% は横幅の指定です。内容の高さをサイズ決定に使う設定ではありません。"
        - text: "親の CSS と子の meta 要素でサイズの共有を設定する"
          correct: true
          explanation: "親の frame-sizing と、子の responsive-embedded-sizing による許可の両方が必要です。"
        - text: "子の文書にだけ height: auto を指定する"
          correct: false
          explanation: "子の CSS だけでは親ページにある iframe の高さを内容に合わせられません。"
        - text: "親の iframe に aspect-ratio を指定する"
          correct: false
          explanation: "aspect-ratio は縦横比を指定します。コメントの増減に応じて内容の高さを測る指定ではありません。"
    - question: "読み込み後にコメントを追加した際、サイズ情報を更新する操作はどれですか？"
      answers:
        - text: "親ページで window.requestResize() を呼ぶ"
          correct: false
          explanation: "requestResize() は埋め込まれた文書で呼びます。iframe の外で呼ぶと仕様上 NotAllowedError になります。"
        - text: "子の文書に meta 要素を追加し直す"
          correct: false
          explanation: "サイズ共有への参加は初期解析時に決まります。読み込み後の meta 要素の追加で有効にする使い方はできません。"
        - text: "親の frame-sizing を auto に変更する"
          correct: false
          explanation: "auto は従来のサイズ決定を維持する値であり、内容の高さを再計算する指定ではありません。"
        - text: "子で DOM を変更した後に window.requestResize() を呼ぶ"
          correct: true
          explanation: "内容の変更を DOM に反映した後、子からサイズ情報の更新を求めます。高さの数値を渡す必要はありません。"
published: true
---
b> frame-sizing

ブログに外部サービスのコメント欄を組み込むとき、サービスが提供する画面を `<iframe>` で埋め込む方法があります。コメントの保存やログインなどをサービスに任せつつ、ブログの中でコメントを読んだり投稿したりするためです。

iframe で埋め込むときに困るのが、内容と枠の高さが自動では一致しないためあらかじめ固定の高さを指定する必要があることです。最初は数件のコメントが収まっていても、投稿が増えると枠の中にスクロールバーが表示されます。あらかじめ高さを大きくすると、今度はコメントが少ないときに余白が残ります。画面幅が狭くなって文章の折り返しが増えた場合にも、内容に必要な高さは変わります。

この課題に対応するのが、[CSS Box Sizing Module Level 4 の `frame-sizing` プロパティ](https://drafts.csswg.org/css-sizing-4/#responsive-iframes)です。埋め込まれる文書がサイズの共有を許可すると、iframe の内容に基づいて枠の高さを決められます。この記事では、コメント欄を例に基本的な設定と動的な更新方法を紹介します。

!> 2026 年 9 月 27 日時点で、Chrome はバージョン 154 からの対応を案内しています。Firefox と Safari は未対応です。

## iframe の高さを調整する従来の方法

通常の `div` 要素は、高さを指定しなければ中の文章や画像に合わせて高さが決まります。しかし、iframe は別の文書を表示するための枠であるため、埋め込まれる文書の内容に合わせて高さが決まりません。

高さを指定しない場合、iframe はデフォルトの 150px の高さになります。たとえば `height: 100%` を指定したとしても、親の高さに合わせるだけで、埋め込まれた文書の内容の高さにはなりません。CSS だけで iframe の高さを調整するには、固定値を指定必要があります。コメント欄の内容が 300px の高さで収まるとあらかじめ分かっている場合は `height: 300px` を指定すればよいのですが、コメントの数が動的に変わる場合は、決め打ちの高さでは対応できません。

従来は、埋め込まれる文書で内容の高さを測り、その値を親ページに伝える実装が必要でした。特にオリジンが異なる場合、親ページから子の DOM を直接読み取れないため、ウィンドウ間でメッセージを送る [`postMessage()`](https://html.spec.whatwg.org/multipage/web-messaging.html#dom-window-postmessage-options) などを使います。

1. 子の文書で内容の高さを測る
2. `postMessage()` で親ページへ高さを送る
3. 親ページが受信元を確認し、iframe の `height` を書き換える
4. コメントの追加などで高さが変わるたびに繰り返す

子の文書では、コメント欄全体を囲む要素の高さを監視し、変化したときに親へ通知します。

```js
const content = document.querySelector("#content");
let previousHeight;

// ResizeObserver で要素の高さの変化を監視する
const observer = new ResizeObserver(() => {
  const height = Math.ceil(content.getBoundingClientRect().height);
  if (height === previousHeight) return;
  previousHeight = height;

  // 親ページに高さを通知する
  window.parent.postMessage(
    { type: "comments:resize", height },
    "https://blog.example",
  );
});
observer.observe(content, { box: "border-box" });
```

親ページでは、`message` イベントを受け取り、送信元とデータの形式を確認してから iframe の高さを更新します。

```js
const iframe = document.querySelector("#comments-frame");
const commentsOrigin = "https://comments.example";

window.addEventListener("message", (event) => {
  if (event.origin !== commentsOrigin) return;
  if (event.source !== iframe.contentWindow) return;

  const data = event.data;
  if (
    data === null ||
    typeof data !== "object" ||
    data.type !== "comments:resize" ||
    !Number.isFinite(data.height) ||
    data.height < 0
  ) {
    return;
  }

  iframe.style.height = `${data.height}px`;
});
```

`event.origin` で送信元のオリジンを、`event.source` で対象の iframe から届いたメッセージかを確認します。送信元だけでなく、受け取ったデータの形式も確認することは [HTML の仕様](https://html.spec.whatwg.org/multipage/web-messaging.html#authors)でも求められています。

このようなスクリプトを書かずに内容の高さを反映したい、という要望は [CSS Working Group の Issue #1771](https://github.com/w3c/csswg-drafts/issues/1771) でも議論されてきました。`frame-sizing` は CSS で iframe のサイズ決定を制御する仕組みとして、埋め込まれる文書の許可のもとで内容の高さを使えるようにするものです。

## 親ページと埋め込まれる文書で設定する

レスポンシブな iframe を利用するには、親ページと埋め込まれる文書の両方で設定します。この記事では、親ページを `https://blog.example`、コメント欄を `https://comments.example` とします。

まず親ページで、iframe に `frame-sizing: content-height` を指定します。

```css {6}
.comments-frame {
  display: block;
  width: 100%;
  height: auto;
  border: 0;
  frame-sizing: content-height;
}
```

`content-height` は、埋め込まれた内容の高さを iframe の自然な高さとして使用する値です。横幅はこれまでどおり `width` で決めます。

続いて、コメント欄の HTML の `<head>` に次の `<meta>` 要素を記述します。

```html
<meta
  name="responsive-embedded-sizing"
  content="allow-origins=https://blog.example"
>
```

これは、`https://blog.example` に対して内容のサイズを共有してよい、という埋め込み側の設定です。この値には埋め込みを行う親ページのオリジンを指定します。

公開ウィジェットなどで、すべてのオリジンへのサイズの共有を許可する場合は `allow-origins=*` と書けます。複数のオリジンを許可する場合は空白で区切ります。

```html
<meta
  name="responsive-embedded-sizing"
  content="allow-origins=https://blog.example https://news.example"
>
```

!> `<meta name="responsive-embedded-sizing">` 要素は、HTML の初期解析中に `<body>` 要素が開かれる前に現れる必要があります。サイズの共有を許可するかどうかは初期解析時に確定し、その後は変更されません。そのため、JavaScript で読み込み後に `<meta>` 要素を追加しても、サイズの共有は有効になりません。

実際に試してみると、`iframe` の高さが文書のコンテンツに応じて `359px` に設定されていることが確認できます。

![iframe の高さが内容に合わせて 359px になっていることを DevTools で確認している画面](https://images.ctfassets.net/in6v9lxmm5c8/11ybcv6ZVQsBXhDQZa0Uh5/1b8d54b84536f22af005d9f98ee6e842/responsive-iframes-1.png)

### frame-sizing の値

`frame-sizing` には次の値があります。

| 値 | 内容から決める寸法 |
| --- | --- |
| `auto` | 内容のサイズを利用しない |
| `content-height` | 高さ |
| `content-width` | 幅 |
| `content-block-size` | ブロック方向のサイズ |
| `content-inline-size` | インライン方向のサイズ |

通常の横書きでは、ブロック方向は縦方向、インライン方向は横方向です。論理方向を使う値は、埋め込まれた文書ではなく、親ページにある iframe 要素の書字方向に従います。

### なぜ双方のオプトインが必要なのか

なぜ親ページと埋め込まれる文書の両方で設定する必要があるのでしょうか。理由は、iframe の内容のサイズが情報漏えいの経路になり得るためです。たとえば、ログインしているときだけ長い一覧が表示されるページでは、その高さがログイン状態を推測する手がかりになるかもしれません。

[2021 年の設計案](https://github.com/w3c/csswg-drafts/issues/1771#issuecomment-805117925)では、子の文書のサイズが情報漏えいの経路になり得ることに加え、子が予期せず枠のサイズを変えると親ページにも影響することが指摘されています。両方が明示的に利用を選ぶ仕組みは、この問題と既存ページの互換性に対応するためです。

## コメントの追加後に高さを更新する

iframe の高さに使われる内容のサイズは、次の 2 つのタイミングで計算されます。

1. 埋め込まれた文書で `DOMContentLoaded` イベントが発生した後の、最初のレイアウト時
2. 埋め込まれた文書の `window` で `load` イベントが発生したとき

それ以降に埋め込まれた文書の内容が変わっても、iframe の高さは自動では更新されません。`load` イベントの後に遅延読み込みされる画像や、後から適用される Web フォントによって高さが変わる場合も同様です。コメントの追加やパネルの展開などで内容が変わったときは、埋め込まれている文書から [`window.requestResize()`](https://drafts.csswg.org/css-sizing-4/#window-requestresize) を呼び出す必要があります。

以下の例では、フォームの送信時にコメントを追加してから `requestResize()` を呼び出しています。

```js {15-22}
const form = document.querySelector("form");
const input = document.querySelector("textarea");
const comments = document.querySelector("#comments");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const item = document.createElement("li");
  item.textContent = text;
  comments.append(item);
  form.reset();

  if ("requestResize" in window) {
    try {
      window.requestResize();
    } catch (error) {
      // iframe の外で開かれた場合や、meta 要素でオプトインしていない場合は NotAllowedError になる
      if (error.name !== "NotAllowedError") throw error;
    }
  }
});
```

重要なのは、`comments.append(item)` によって DOM を変更した後に `window.requestResize()` を呼んでいる点です。サイズの数値を引数で渡す必要はありません。内容のサイズはブラウザが計算し、親ページの iframe のサイズ決定に反映します。

`requestResize()` は、次のいずれかに該当する場合に `NotAllowedError` の `DOMException` を投げます。

- iframe などに埋め込まれておらず、トップレベルで開かれている
- 埋め込み先の要素が `<iframe>` ではない
- 文書が `<meta name="responsive-embedded-sizing">` でサイズの共有を許可していない

コメントを追加したときに、自動で iframe の高さが変わることを確認してください。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/14cNigLog9aIVcuYIUOEg2/c0d1579e39bcdcb31d0785c1bf232a51/responsive-iframes-2.mp4 898x576)

### 常に自動更新しない理由

なぜ CSS だけで iframe の高さを自動更新しないのでしょうか。理由は、埋め込まれた文書の内容が iframe の表示領域に依存する場合があるためです。枠の高さが変わると、埋め込まれた文書の表示領域も変わります。その表示領域に依存する CSS があると、内容の高さも変わり、再び枠の高さが変わるという循環が起こり得ます。

仕様では、この循環を防ぐために埋め込まれた文書の初期包含ブロック（ICB）のサイズを固定します。ICB はルート要素のレイアウトや `vh` などのビューポート単位の基準となる領域です。サイズの共有を許可した文書は、最初のレイアウト時の ICB のサイズを記録し、以降のレイアウトでもその値を使い続けます。そのため、iframe の高さが変わっても、埋め込まれた文書の `100vh` のような指定は最初の値のままです。この仕組みにより、「内容が ICB より少し大きくなる → iframe が広がる → ICB も広がって内容がさらに大きくなる」という連鎖が起こりにくくなります。

[仕様の説明](https://drafts.csswg.org/css-sizing-4/#iframe-frame-sizing)や [2026 年 1 月の議論](https://github.com/w3c/csswg-drafts/issues/1771#issuecomment-3720090820)では、このようなレイアウトの循環が問題として扱われています。読み込み後の変更について明示的に再計算を求める設計には、更新が連鎖するのを避ける意図があります。

## まとめ

- 外部サービスのコメント欄などを iframe で埋め込むと、内容の増減と固定した枠の高さが合わず、スクロールや余白が生じることがあった
- `frame-sizing: content-height` は、埋め込まれた内容の高さを iframe のサイズ決定に使う。親ページの CSS と子の文書の `<meta name="responsive-embedded-sizing">` の両方が必要
- 読み込み後に内容を変更した場合は、子の文書から `window.requestResize()` を呼び出してサイズ情報を更新する

## 参考

- [CSS Box Sizing Module Level 4 — Responsively-sized iframes](https://drafts.csswg.org/css-sizing-4/#responsive-iframes)
- [Responsive iframes in Chrome 154](https://developer.chrome.com/blog/responsive-iframes)
- [Responsively-sized iframes Explainer](https://github.com/w3c/csswg-drafts/blob/main/css-sizing-4/responsive-iframes-explainer.md)
- [Auto-resize iframes based on content — CSSWG Issue #1771](https://github.com/w3c/csswg-drafts/issues/1771)
- [Web Platform Tests — Responsive iframe sizing](https://github.com/web-platform-tests/wpt/tree/master/css/css-sizing/responsive-iframe)
- [Web Platform DX — frame-sizing](https://github.com/web-platform-dx/web-features/blob/main/features/frame-sizing.yml)
