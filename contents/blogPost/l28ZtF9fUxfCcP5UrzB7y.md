---
id: l28ZtF9fUxfCcP5UrzB7y
title: "Device Posture API と Viewport Segments API で折りたたみ端末の画面に対応する"
slug: "device-posture-viewport-segments"
about: "Safari 27.1 では、iPhone Duo のような折りたたみ端末向けに Device Posture API と Viewport Segments API が機能フラグ付きで実装されました。Device Posture API で端末が折れているかを、Viewport Segments API で折り目によって分かれた画面の位置と大きさを取得できます。この記事では、2 つの API の仕組みと策定の経緯を説明し、折り目を避けるレイアウトの実装例を示します。"
createdAt: "2026-10-26T10:18+09:00"
updatedAt: "2026-10-26T10:18+09:00"
tags: ["CSS", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/wrmn3Tjt5P0X0Jmo2rdqI/4d1a867176d9af2bf590fe044ef11f7a/side_oritatami_smartphone_10419.png"
  title: "折りたたみスマホのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "折りたたみ端末を完全に閉じて外側のディスプレイを使っているとき、Device Posture API が返す姿勢はどれですか？"
      answers:
        - text: "continuous"
          correct: true
          explanation: "continuous は画面が平らな状態を表し、完全に開いた折りたたみ端末だけでなく、完全に閉じた端末も含みます。"
        - text: "folded"
          correct: false
          explanation: "folded は画面が途中まで折れた状態で、本の形やノート PC の形を表します。完全に閉じた状態は含みません。"
        - text: "closed"
          correct: false
          explanation: "Device Posture API の値は continuous と folded の 2 つだけで、closed という値はありません。"
        - text: "姿勢は取得できず null になる"
          correct: false
          explanation: "完全に閉じた状態でも姿勢は取得でき、平らな状態として continuous が返ります。"
    - question: "ノート PC の形に折って画面が上下 2 つのセグメントに分かれたとき、下側のセグメントの高さを取得する指定はどれですか？"
      answers:
        - text: "env(viewport-segment-height 1 0)"
          correct: false
          explanation: "1 つ目の数字は列番号です。1 0 は左右に分かれたときの右側のセグメントを指し、上下に分かれた画面には存在しません。"
        - text: "env(viewport-segment-height 1 1)"
          correct: false
          explanation: "上下に分かれた場合は列が 1 つしかないので、列番号が 1 になるセグメントはありません。"
        - text: "env(viewport-segment-height 0 1)"
          correct: true
          explanation: "env() には列番号と行番号を 0 から数えて指定します。上下に分かれた場合は上が 0 0、下が 0 1 です。"
        - text: "env(viewport-segment-height 0 0)"
          correct: false
          explanation: "0 0 は左上のセグメントで、上下に分かれた場合は上側のセグメントを指します。"
    - question: "折れていない端末で env(viewport-segment-width 0 0, 50vw) を指定した場合、どのような値になりますか？"
      answers:
        - text: "ビューポート全体の幅"
          correct: false
          explanation: "セグメントが 1 つしかないときは、ビューポート全体の幅ではなくフォールバック値が使われます。"
        - text: "フォールバック値の 50vw"
          correct: true
          explanation: "viewport-segment-* の環境変数はセグメントが 2 つ以上あるときにしか定義されないため、第 3 引数のフォールバック値が使われます。"
        - text: "0px"
          correct: false
          explanation: "環境変数が未定義の場合は 0px ではなく、env() の第 3 引数に渡したフォールバック値が使われます。"
        - text: "ビューポートの幅の半分を自動で計算した値"
          correct: false
          explanation: "ブラウザが半分の値を計算するわけではありません。50vw になるのは、フォールバック値として 50vw を指定しているためです。"
    - question: "左右に分かれた画面で、折り目そのものの幅を求める方法として正しいものはどれですか？"
      answers:
        - text: "env(viewport-segment-hinge-width) を参照する"
          correct: false
          explanation: "折り目の幅を表す専用の環境変数はありません。"
        - text: "左のセグメントの幅から右のセグメントの幅を引く"
          correct: false
          explanation: "2 つのセグメントの幅の差は、折り目の幅ではなくセグメント同士の大きさの違いです。"
        - text: "navigator.devicePosture から折り目の角度を取得して計算する"
          correct: false
          explanation: "Device Posture API が返すのは continuous か folded の姿勢だけで、折り目の位置や角度は取得できません。"
        - text: "右のセグメントの左端から左のセグメントの右端を引く"
          correct: true
          explanation: "専用の変数がないため、calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0)) のように 2 つのセグメントの間の距離から計算します。"
    - question: "Device Posture API の前身である Screen Fold API にあった、折り目の角度を取得する機能が削除された理由はどれですか？"
      answers:
        - text: "プライバシー上の理由"
          correct: true
          explanation: "角度は 2021 年 3 月に仕様から削除され、2021 年 10 月の Devices and Sensors Working Group の会議でプライバシー上の理由によるものと説明されています。"
        - text: "多くの端末が角度センサーを搭載していないため"
          correct: false
          explanation: "角度の削除は端末のセンサーの有無によるものではなく、プライバシー上の理由によるものです。"
        - text: "Viewport Segments API に角度の情報を移したため"
          correct: false
          explanation: "Viewport Segments API が提供するのはセグメントの数、位置、大きさで、角度は扱いません。"
        - text: "CSS のメディア特性で角度を表現できなかったため"
          correct: false
          explanation: "CSS の表現上の制約ではなく、プライバシー上の理由で削除されました。"

published: true
---

b> device-posture
b> viewport-segments

iPhone Duo は画面を折りたためる iPhone で、閉じた状態では外側のディスプレイを、開いた状態では内側の大きなディスプレイを使います。[WebKit Features for Safari 27.1](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/) によると、Safari のビューポートの幅は外側のディスプレイを縦に持ったときの 382px から、内側のディスプレイを横に持ったときの 951px まで変わります。

幅の変化は既存のレスポンシブデザインで対応できます。しかし、画面を半分ほど折った状態では、レスポンシブデザインだけでは対応できない問題があります。たとえば画面の中央に置いたボタンや文章が折り目の上に重なってしまうと、ボタンを押しづらかったり、文章が読めなかったりします。ページ側で折り目を避けるには、次の 2 つの情報が必要です。

- 端末が折れているかどうか
- 折り目によって分かれた各領域の位置と大きさ

この 2 つの情報を提供するのが [Device Posture API](https://w3c.github.io/device-posture/) と [Viewport Segments API](https://drafts.csswg.org/css-viewport/#segments) です。この記事では、2 つの API の仕組みと策定の経緯を説明したあと、リストと詳細を左右に分けるレイアウトと、動画と操作パネルを上下に分けるレイアウトを実装します。

!> 2026 年 10 月 26 日現在、Safari 27.1 の Device Posture API と Viewport Segments API は開発者向けのプレビューで、機能フラグを有効にしないと動作しません。Chrome と Edge は [Device Posture API を 132 から](https://chromestatus.com/feature/5185813744975872)、[Viewport Segments API を 138 から](https://chromestatus.com/feature/5170498990243840)サポートしています。Firefox は未対応です。

## 2 つの API が生まれた経緯

2 つの API は、Microsoft が 2019 年に Surface Duo のような 2 画面端末向けに提案した [Foldables の Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md) から始まりました。[当初の Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/38238af/Foldables/explainer.md) では、`spanning` というメディア特性と、折り目の位置を表す `env(fold-*)` という環境変数が提案されていました。この提案は、現在の `horizontal-viewport-segments` / `vertical-viewport-segments` メディア特性と `env(viewport-segment-*)` 環境変数に置き換わっています。

JavaScript の API も何度か形を変えています。最初は `window.getWindowSegments()` というメソッドとして提案され、2021 年 10 月に `window.visualViewport.segments` プロパティへ移りました。その後、CSS Working Group は [Issue #9237](https://github.com/w3c/csswg-drafts/issues/9237) を [2024 年 6 月に議論](https://github.com/w3c/csswg-drafts/issues/9237#issuecomment-2160730855)し、レイアウトビューポートを表す新しいオブジェクトを `window` に作り、そこに `segments` を定義すると決議しました。

Device Posture API は、当初 Screen Fold API という名前で、折り目の角度を取得する機能を持っていました。2021 年 3 月に角度が仕様から削除され、それにあわせて名前も Device Posture API に変わりました。[2021 年 10 月の Devices and Sensors Working Group の会議](https://www.w3.org/2021/10/28-dap-minutes.html)では、角度はプライバシー上の理由から削除されたと説明されています。現在は `continuous` と `folded` の 2 値だけが残っています。

このように、2 つの API は端末のハードウェアを細かく公開するのではなく、レイアウトに必要な最小限の情報だけを公開する方向で整理されてきました。

## Device Posture API で端末の姿勢を知る

Device Posture API は、端末の姿勢を次の 2 値で表します。

| 値           | 状態                                                                                 |
| ------------ | ------------------------------------------------------------------------------------ |
| `continuous` | 画面が平らな状態。通常のスマートフォン、完全に開いた折りたたみ端末、完全に閉じた端末 |
| `folded`     | 画面が途中まで折れた状態。本の形やノート PC の形                                     |

完全に閉じた状態と完全に開いた状態は、どちらも `continuous` になります。外側と内側のどちらのディスプレイを使っているかは、Device Posture API ではなく、通常の `width` のメディアクエリで判断します。

CSS では `device-posture` メディア特性を使い、端末が折れているかどうかを判定できます。

```css
@media (device-posture: folded) {
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

JavaScript では `navigator.devicePosture.type` で現在の姿勢を取得し、`change` イベントで姿勢の変化を検知します。`navigator.devicePosture` はセキュアコンテキスト（HTTPS または `localhost`）でのみ利用できます。

```js
console.log(navigator.devicePosture.type); // "continuous" または "folded"

navigator.devicePosture.addEventListener("change", () => {
  console.log(navigator.devicePosture.type);
});
```

Device Posture API が教えてくれるのは折れているかどうかだけで、折り目の位置や向きはわかりません。それを知るには Viewport Segments API を使います。

## Viewport Segments API で折り目の位置を知る

Viewport Segments API は、ビューポートが折り目やヒンジ（2 枚の画面をつなぐ部分）で分割されたときの、それぞれの領域をセグメントとして公開します。CSS のメディア特性、CSS の環境変数、JavaScript の API の 3 つで構成されます。

### セグメントの数を調べるメディア特性

[`horizontal-viewport-segments`](https://drafts.csswg.org/mediaqueries-5/#mf-horizontal-viewport-segments) は横方向のセグメント数、`vertical-viewport-segments` は縦方向のセグメント数を表します。本の形のように左右に分かれていれば `horizontal-viewport-segments: 2`、ノート PC の形のように上下に分かれていれば `vertical-viewport-segments: 2` に一致します。

```css
/* 左右に 2 つのセグメントがあるとき */
@media (horizontal-viewport-segments: 2) {
}

/* 上下に 2 つのセグメントがあるとき */
@media (vertical-viewport-segments: 2) {
}
```

### セグメントの位置と大きさを表す環境変数

[CSS Environment Variables](https://drafts.csswg.org/css-env-1/#viewport-segments) には、セグメントの位置と大きさを表す 6 つの環境変数が定義されています。

- `viewport-segment-width` / `viewport-segment-height`: セグメントの幅と高さ
- `viewport-segment-top` / `viewport-segment-bottom`: セグメントの上端と下端の位置
- `viewport-segment-left` / `viewport-segment-right`: セグメントの左端と右端の位置

いずれも `env()` の引数に、セグメントの列番号と行番号を 0 から数えて指定します。左右に分かれた場合は左が `0 0`、右が `1 0` です。上下に分かれた場合は上が `0 0`、下が `0 1` です。

![](https://images.ctfassets.net/in6v9lxmm5c8/39pDmjFVyumHd35aARenlW/3d370129a17085d03d1eb5d817db2519/device-posture-viewport-segments-1.png)

```css
.left-pane {
  width: env(viewport-segment-width 0 0, 50vw);
}
```

これらの環境変数は、セグメントが 2 つ以上あるときにしか定義されません。折れていない端末や未対応のブラウザでは、`env()` の第 3 引数に渡したフォールバック値が使われます。

折り目そのものの幅は、専用の変数がないため、2 つのセグメントの間の距離から計算します。左右に分かれた場合は、右のセグメントの左端から左のセグメントの右端を引いた値が折り目の幅になります。

```css
.hinge {
  width: calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0));
}
```

### JavaScript でセグメントを取得する

`window.viewport.segments` は、セグメントごとの `DOMRect` の配列を返します。折り目やヒンジでビューポートが分割されているときは配列の要素が 2 つ、そうでない場合は 1 つになります。姿勢（`device-posture`）とセグメントの数は別の情報なので、2 画面端末のように `continuous` のままセグメントが 2 つになる端末もあります。

```js
for (const segment of window.viewport.segments) {
  console.log(segment.x, segment.y, segment.width, segment.height);
}
```

## 実践例 1: リストと詳細を左右に分ける

メールアプリや商品一覧のように、片側で選んだ項目の詳細を反対側に表示する画面は、本の形に折った状態と相性がよいレイアウトです。ここでは、左のセグメントにリスト、右のセグメントに詳細を表示します。

HTML は、リストと詳細を並べただけです。

```html
<div class="layout">
  <ul class="list">
    <li><button type="button" aria-current="true">メッセージ 1</button></li>
    <li><button type="button">メッセージ 2</button></li>
    <li><button type="button">メッセージ 3</button></li>
  </ul>
  <article class="detail">
    <h1>メッセージ 1</h1>
    <p>メッセージ 1 の本文です。</p>
  </article>
</div>
```

CSS では、まず通常のレスポンシブデザインとして、幅が 640px 以上なら 2 ペインにします。

```css
body {
  margin: 0;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100svh;
}

@media (min-width: 640px) {
  .layout {
    grid-template-columns: 280px 1fr;
  }
}
```

折り目の位置を考慮せずに、単純に 2 列のグリッドにしているため、折り目の上に詳細が重なってしまう場合があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6ylUxJhvTNm5WlN5HWyoj8/e29c40aa75aaa1af498304401cab0823/device-posture-viewport-segments-2.png)

この問題を解決するには、左右 2 つのセグメントがあるときだけ、セグメントの位置に合わせた 3 列のグリッドに切り替えます。

```css
@media (horizontal-viewport-segments: 2) {
  .layout {
    grid-template-columns:
      env(viewport-segment-width 0 0)
      calc(env(viewport-segment-left 1 0) - env(viewport-segment-right 0 0))
      env(viewport-segment-width 1 0);
  }

  .list {
    grid-column: 1;
  }

  .detail {
    grid-column: 3;
  }
}
```

`@media (horizontal-viewport-segments: 2)` に一致するときが、折り目で分かれた 2 つのセグメントがある状態です。`grid-template-columns` の 1 列目は左のセグメントの幅、2 列目は折り目の幅、3 列目は右のセグメントの幅です。リストを 1 列目、詳細を 3 列目に配置し、折り目にあたる 2 列目には要素を置かないことで、折り目の上に重ならないようにしています。

Chrome の DevTools で端末の一覧から「Galaxy Z Fold 5」か「Asus Zenbook Fold」を選び、ツールバーに出る姿勢の切り替え（Continuous / Folded）で Folded を選ぶと折りたたみのシミュレーションができます。1 つ目のスクリーンショットが Continuous、2 つ目のスクリーンショットが Folded です。折り目の位置にリストと詳細が重ならず、折り目をまたがずに表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5haAiGjGHcxF9Qgddu9Ggk/cdcc8dfb8e21100e454d7b1d4bee83a6/device-posture-viewport-segments-3.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/5EUtqRinypb8jm29g4bQ1x/533af204edeca286622fad408e7a9bbb/device-posture-viewport-segments-4.png)

## 実践例 2: 動画と操作パネルを上下に分ける

横に持ってノート PC の形に折ると、上の面は立てた画面、下の面は机に置いたキーボードのような位置になります。上の面で動画を見て、下の面で再生ボタンやシークバーを操作するレイアウトにします。

```html
<div class="player">
  <video src="sample.mp4" playsinline muted loop></video>
  <div class="controls">
    <button type="button" id="toggle">再生</button>
    <input type="range" id="seek" min="0" max="100" value="0" aria-label="再生位置" />
  </div>
</div>
```

上下に分かれている場合は、`vertical-viewport-segments: 2` に一致します。行の高さを `viewport-segment-height` で指定し、折り目の高さは下のセグメントの上端から上のセグメントの下端を引いて求めます。

```css
body {
  margin: 0;
}

.player {
  display: grid;
  grid-template-rows: auto auto;
}

video {
  width: 100%;
  height: 100%;
  background: #000;
}

@media (vertical-viewport-segments: 2) {
  .player {
    height: 100dvh;
    grid-template-rows:
      env(viewport-segment-height 0 0)
      calc(env(viewport-segment-top 0 1) - env(viewport-segment-bottom 0 0))
      env(viewport-segment-height 0 1);
  }

  video {
    grid-row: 1;
    object-fit: contain;
  }

  .controls {
    grid-row: 3;
  }
}
```

動画を 1 行目、操作パネルを 3 行目に配置することで、動画は上の面いっぱいに表示され、操作パネルは手元の面に移ります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7qFrbMuN5CrmUV2Q1cnzf0/33bfabe99c9e96529dfa6960da70aa41/device-posture-viewport-segments-5.png)

## まとめ

- Device Posture API は、端末が途中まで折れている（`folded`）か平ら（`continuous`）かを、CSS の `device-posture` メディア特性と `navigator.devicePosture` で提供する
- 完全に閉じた状態と完全に開いた状態はどちらも `continuous` になるため、使っているディスプレイの大きさは `width` のメディアクエリで判断する
- Viewport Segments API は、折り目で分かれた領域の数を `horizontal-viewport-segments` / `vertical-viewport-segments` で、位置と大きさを `env(viewport-segment-*)` と `window.viewport.segments` で提供する
- 折り目の幅は、隣り合うセグメントの端の位置の差から `calc()` で求める
- 折り目の角度はプライバシー上の理由で仕様から削除され、セグメントの API は `getWindowSegments()`、`visualViewport.segments` を経て `window.viewport.segments` に落ち着いた
- Safari 27.1 では機能フラグを有効にしたときだけ動作する。Chrome と Edge は両方の API に対応している

## 参考

- [WebKit Features for Safari 27.1 | WebKit](https://webkit.org/blog/18486/webkit-features-for-safari-27-1/)
- [Device Posture API](https://w3c.github.io/device-posture/)
- [CSS Viewport Module Level 1 - Segments](https://drafts.csswg.org/css-viewport/#segments)
- [CSS Environment Variables Module Level 1 - Viewport segment variables](https://drafts.csswg.org/css-env-1/#viewport-segments)
- [Media Queries Level 5 - horizontal-viewport-segments](https://drafts.csswg.org/mediaqueries-5/#mf-horizontal-viewport-segments)
- [Foldables Explainer | MicrosoftEdge/MSEdgeExplainers](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Foldables/explainer.md)
