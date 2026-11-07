---
id: -EbSLH9el56yjKmYc44Nf
title: "Capability Elements をアイコンだけで表示する `displaymode=\"icon-only\"`"
slug: "capability-elements-icon-only"
about: "Chrome は `<camera>`・`<microphone>`・`<geolocation>` をテキストなしのアイコンボタンとして描画する `displaymode=\"icon-only\"` 属性を実装しています。この記事では、`displaymode=\"icon-only\"` の使い方について紹介します。"
createdAt: "2026-11-07T19:24+09:00"
updatedAt: "2026-11-07T19:24+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/M3IFAg1x3VbDSPHHXDe0g/ccffb9b798b2eb90c9258b65e8f21fbb/food_sasa-dango_10772-768x630.png"
  title: "笹団子のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Chrome の実装で `displaymode=\"icon-only\"` を付けてもアイコン表示にならない要素はどれですか?"
      answers:
        - text: "`<camera>`"
          correct: false
          explanation: null
        - text: "`<geolocation>`"
          correct: false
          explanation: null
        - text: "`<usermedia>`"
          correct: true
          explanation: null
        - text: "`<microphone>`"
          correct: false
          explanation: null
published: true
---
!> `displaymode="icon-only"` は 2026 年 11 月 6 日時点で Chrome の実験的な機能です。試すには `--enable-blink-features=CapabilityElementIconOnlyMode` を付けて Chrome を起動する必要があります。仕様にはまだ含まれておらず、属性名が変わる可能性があります。

`<camera>`・`<microphone>`・`<geolocation>` のように、ブラウザが描画するボタンで権限を要求する HTML 要素は Capability Elements と呼ばれています。ブラウザがボタンの見た目と文言を管理するため、JavaScript から `getUserMedia()` を呼び出すよりも安全に権限を要求できます。また、誤って必要な権限をブロックしてしまったとしても、再度ボタンを押すだけでよいので手軽に権限の再要求ができます。

ただし、これらの要素はアイコンとローカライズされたテキストを並べた横長のボタンとして描画され、テキストを消せません。地図の隅に置く「現在地」ボタンや、ビデオ会議の画面下部に並ぶカメラ・マイクの切り替えボタンは、アイコンだけで表示するのが一般的です。テキストが必須の Capability Elements は、こうした狭い領域に収まらないという問題がありました。

![](https://images.ctfassets.net/in6v9lxmm5c8/4zJ09jcgoBlTXLOQT1Npje/779d26d3fce27ef36c9c9c42c3047187/capability-elements-icon-only-1.png)

Chrome はこの問題に対して、要素をアイコンだけで表示する `displaymode="icon-only"` 属性を実装しています。この記事では、`displaymode="icon-only"` の使い方について紹介します。

## Capability Elements のおさらい

Capability Elements は、JavaScript から `getUserMedia()` や `navigator.geolocation.getCurrentPosition()` を呼ぶ代わりに、ページへ埋め込んだ要素をユーザーがクリックすることで権限を要求する仕組みです。Chrome では次の要素が使えます。

| 要素            | 取得するもの                      |
| --------------- | --------------------------------- |
| `<geolocation>` | 位置情報（`GeolocationPosition`） |
| `<usermedia>`   | カメラとマイクの `MediaStream`    |
| `<camera>`      | カメラの `MediaStreamTrack`       |
| `<microphone>`  | マイクの `MediaStreamTrack`       |

ブラウザが信頼できるボタンであり続けるため、Capability Elements には文字色と背景色のコントラスト比、フォントサイズ、幅と高さの範囲、`opacity` などのスタイル制約があります。スクリプトからの `click()` では権限要求が発火しない点や、制約に違反したときの挙動は [宣言的にカメラ・マイク権限を要求する `<usermedia>` 要素](https://azukiazusa.dev/blog/usermedia-html-element) で紹介しています。

ボタンの文言はブラウザが決め、ページ側からは変更できません。たとえば日本語環境の Chrome では、`<camera>` は「カメラの使用」、`<geolocation>` は「位置情報の使用」と表示されます。[PEPC の Explainer](https://github.com/WICG/PEPC/blob/main/explainer.md) は、ページが文言を決められると「Click here to proceed」のような誤解を招く文言を使えてしまうため、ブラウザが文言を設定すると説明しています。

## `displaymode="icon-only"` の使い方

アイコン表示にするには、要素に `displaymode="icon-only"` 属性を付けます。

```html
<camera displaymode="icon-only"></camera>
<microphone displaymode="icon-only"></microphone>
<geolocation displaymode="icon-only"></geolocation>
```

Chrome Canary 159 の日本語環境で確認すると、以下のようになりました。

![](https://images.ctfassets.net/in6v9lxmm5c8/meloO6iSEtaUBhf9cmGSq/5f3740c8317c0e5882ae22763e7354a1/capability-elements-icon-only-2.png)

`<camera>`・`<microphone>`・`<geolocation>` はテキストが消え、アイコンだけの正方形のボタンになりました。ただし、`<usermedia>` だけはテキスト付きのままで、アイコン表示にはなりませんでした。

:::info
`displaymode="icon-only"` でアイコン表示に切り替えたとしても、アクセシブルな名前は元の文言のまま残ります。
:::

2026 年 11 月時点の Chrome には `displaymode` 属性に対応する DOM プロパティが存在しないため、JavaScript から切り替える場合は `setAttribute()` を使います。

```js
const geolocation = document.querySelector("geolocation");
geolocation.setAttribute("displaymode", "icon-only");
```

## まとめ

- Capability Elements はデフォルトでアイコンとブラウザが決めたテキストを並べたボタンとして描画され、テキストを消せないため、地図やビデオ会議のツールバーのような狭い領域に置きにくかった
- Chrome は `displaymode="icon-only"` 属性で `<camera>`・`<microphone>`・`<geolocation>` をアイコンだけのボタンとして描画する機能を実装している

## 参考

- [Capability Elements Icon-only mode - Chrome Platform Status](https://chromestatus.com/feature/5107682460696576)
- [Chrome 157 Release Notes - Chrome Platform Status](https://chromestatus.com/release-notes/157)
- [Media Capture and Streams Extensions - Media capture HTML elements](https://w3c.github.io/mediacapture-extensions/#media-capture-html-elements)
- [Permission Elements - WICG](https://wicg.github.io/PEPC/permission-elements.html)
- [PEPC Explainer · WICG/PEPC](https://github.com/WICG/PEPC/blob/main/explainer.md)
