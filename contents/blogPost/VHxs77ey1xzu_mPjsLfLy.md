---
id: VHxs77ey1xzu_mPjsLfLy
title: "`:playing` や `:muted` で video 要素の状態に応じたスタイルを適用する"
slug: "style-video-with-media-state-pseudo-classes"
about: "video 要素の再生やミュート状態に応じて見た目を変えるには、JavaScript でイベントを監視して CSS クラスを同期する方法が使われてきました。メディア状態擬似クラスを使うと、ブラウザが管理する再生、一時停止、シーク、バッファリング、ミュートなどの状態を CSS から直接選択できます。この記事では 7 つの擬似クラスの条件と、:has() を組み合わせて動画プレイヤーの表示を切り替える方法を紹介します。"
createdAt: "2026-09-01T20:00+09:00"
updatedAt: "2026-09-01T20:00+09:00"
tags: ["CSS", "HTML"]
thumbnail:
  title: "リュウグウノツカイのイラスト"
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5wVZWwTOMdxu4k3IASoptL/62956f32b247f1b009c8c3b68232b3e4/ryugunotsukai_17496-768x542.png"
audio: null
selfAssessment:
  quizzes:
    - question: "動画がデータ不足でバッファリングしているとき、擬似クラスの一致状態として記事の説明に合うものはどれですか？"
      answers:
        - text: "`:buffering` だけに一致し、`:playing` には一致しない"
          correct: false
          explanation: "バッファリング中も原因が解消すれば自動で再開する状態なので、`:playing` にも一致します。"
        - text: "`:playing` と `:buffering` の両方に一致する"
          correct: true
          explanation: "記事では、`:buffering` と `:stalled` は `:playing` と同時に一致すると説明しています。"
        - text: "`:paused` と `:buffering` の両方に一致する"
          correct: false
          explanation: "バッファリングは明示的な一時停止ではありません。再生を継続する意図があるため `:playing` に一致します。"
        - text: "`:seeking` と `:stalled` の両方に必ず一致する"
          correct: false
          explanation: "シークや読み込みの停滞は別の条件です。バッファリング中に必ず一致するわけではありません。"
    - question: "記事で説明されている `:muted` 擬似クラスの挙動として正しいものはどれですか？"
      answers:
        - text: "`video.volume = 0` を設定するだけで必ず一致する"
          correct: false
          explanation: "`volume` を 0 にしただけでは、メディア要素の muted 状態は変わりません。"
        - text: "動画が一時停止している間だけ一致する"
          correct: false
          explanation: "一時停止を表すのは `:paused` です。`:muted` は音声が強制的に無音となる状態を表します。"
        - text: "`muted` 属性や `video.muted = true` によって消音されているときに一致する"
          correct: true
          explanation: "記事では、HTML Standard の muted 状態に従って `:muted` が一致すると説明しています。"
        - text: "ページから音量を変更できない環境でのみ一致する"
          correct: false
          explanation: "ページから音量を変更できない状態を表すのは `:volume-locked` です。"

published: true
---

b> media-pseudos

`<video>` 要素の再生状態に応じて、動画プレイヤーの見た目を変えたい場合があります。例えば YouTube では再生中かどうかで再生ボタンの表示を切り替えたり、ミュート状態では音声のアイコンを変えたりしています。従来は `play`、`pause`、`volumechange` などのイベントを監視し、CSS から参照するクラスを JavaScript で付け替える方法が使われてきました。

```js
const video = document.querySelector("video");

video.addEventListener("play", () => {
  video.classList.add("is-playing");
  video.classList.remove("is-paused");
});

video.addEventListener("pause", () => {
  video.classList.add("is-paused");
  video.classList.remove("is-playing");
});

video.addEventListener("volumechange", () => {
  video.classList.toggle("is-muted", video.muted);
});
```

この方法は確かに動作しますが、状態の同期を自前で管理する必要があり、コードが複雑になります。さらにバッファリングやシークなどの状態を扱う場合は、より多くのイベントとクラスを管理する必要があります。

CSS Selectors Level 4 で定義される[メディア状態擬似クラス](https://drafts.csswg.org/selectors/#resource-pseudos)を使うと、ブラウザが管理する状態へ CSS から直接アクセスできます。これにより、JavaScript でイベントを監視してクラスを付け替える必要がなくなり、状態に応じたスタイルを簡潔に記述できます。

```css
video:playing {
  outline-color: green;
}

video:paused {
  outline-color: gray;
}

video:muted {
  opacity: 0.8;
}
```

この記事では 7 つのメディア状態擬似クラスの条件を確認し、`:has()` と組み合わせて動画プレイヤーの表示を切り替える例を紹介します。

## メディア状態擬似クラスとは

メディア状態擬似クラスは、再生可能な要素の現在の状態に一致する擬似クラスです。HTML では主に `<video>` と `<audio>` が対象です。

仕様では、再生、読み込み、音声という 3 種類に分けて 7 つの擬似クラスが定義されています。

| 分類         | 擬似クラス       | 一致する状態                                                                 |
| ------------ | ---------------- | ---------------------------------------------------------------------------- |
| 再生状態     | `:playing`       | 再生する意図があり、一時的に止まっていても原因が解消すれば自動で再開する状態 |
| 再生状態     | `:paused`        | 明示的な一時停止、初回再生前、再生終了後など、`:playing` ではない状態        |
| 再生状態     | `:seeking`       | 再生位置を変更している状態。`:playing` / `:paused` とは独立している          |
| 読み込み状態 | `:buffering`     | `:playing` でありながら、再生を続けるデータが足りず取得を待っている状態      |
| 読み込み状態 | `:stalled`       | `:buffering` に一致し、かつ一定時間データを受信できていない状態              |
| 音声状態     | `:muted`         | 音声が強制的に無音となる状態                                                 |
| 音声状態     | `:volume-locked` | ブラウザやユーザーにより、ページから音量を変更できない状態                   |

これらの擬似クラスは、独自メディアコントロールの外観をスクリプトなしで状態に追従させる目的で追加されました。CSSWG の[最初の提案](https://github.com/w3c/csswg-drafts/issues/3821)では、ミュート、読み込みの停滞、シークを表す独自コントロールのために、ブラウザ判定やスクリプトのロジックが必要なことが課題として挙げられています。

`:volume-locked` は別の用途から提案されました。環境によっては `HTMLMediaElement.volume` を変更しても、実際にユーザーが聞く音量に反映されません。この状態がわかれば、操作しても効果のない音量コントロールを隠すといった UI の改善が可能です。

## `:playing` と読み込み状態は同時に一致する

7 つの擬似クラスは、互いに排他的な状態を表す列挙型ではありません。特に注意したいのが `:playing`、`:buffering`、`:stalled` の関係です。

[Selectors Level 4](https://drafts.csswg.org/selectors/#video-state) では、バッファリングや読み込みの停滞により一時的に映像が止まっていても、原因が解消したときに自動で再開するなら `:playing` に一致すると定義されています。そのため、次の組み合わせが同時に一致します。

```css
/* 通常の再生中に一致する */
video:playing {
  outline-color: green;
}

/* バッファリング中は :playing と :buffering の両方に一致する */
video:buffering {
  outline-color: orange;
}

/* 読み込みの停滞中は :playing と :buffering と :stalled のすべてに一致する。
   :stalled は :buffering のサブセットなので、必ず :buffering より後ろに書く */
video:stalled {
  outline-color: red;
}
```

映像が画面上で動いているかではなく、ユーザーやページが再生を継続する意図を持っているかを `:playing` と `:paused` が表していると考えると理解しやすいでしょう。[HTML Standard](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes) では、`HTMLMediaElement.paused` が `false` なら `:playing`、`true` なら `:paused` に一致すると具体的に定義されています。

`:buffering` と `:stalled` の違いは、データの取得状況です。`:stalled` ⊆ `:buffering` ⊆ `:playing` という入れ子の関係になっています。`video:buffering` は、再生を続けるためのデータが足りず、取得を待っている状態に一致します。`:stalled` は、`:buffering` に一致し、かつ一定時間データを受信できていない状態に一致します。

:::warning
`:buffering` と `:stalled` は、`:playing` に一致する状態の中で、より範囲の狭い条件です。CSS の詳細度は同じなので、`:stalled` を先に書くと、`:buffering` のスタイルに上書きされてしまいます。範囲の狭いほうを後ろに置いてください。
:::

:::note
`:stalled` 擬似クラスと `stalled` イベントは条件が異なります。擬似クラスは、再生に必要なデータが足りず、読み込みも停滞しているプレイヤー UI を表すためのものです。一方、`stalled` イベントは再生状態にかかわらず、ネットワークからのデータ受信が停滞したときに発火します。この違いは [WHATWG Issue #12145](https://github.com/whatwg/html/issues/12145) を受けて仕様へ明記されました。
:::

## `:muted` と `:volume-locked` の違い

`:muted` は、単に `volume` が `0` であることを表す擬似クラスではありません。[HTML Standard の muted の定義](https://html.spec.whatwg.org/multipage/media.html#muted)に従い、`muted` 属性や `HTMLMediaElement.muted` が有効な場合など、メディア要素が強制的に無音となる状態に一致します。

```html
<video src="movie.mp4" muted></video>
```

```js
video.muted = true;
```

これらの場合は `video:muted` に一致します。一方、次のように再生音量を最小にしただけでは、`muted` 状態ではないため `:muted` に一致しません。

```js
video.volume = 0;
```

`:volume-locked` は、音量がゼロかどうかではなく、ページから設定した再生音量が有効かを表します。HTML Standard では `volume locked` の値は実装依存です。例えばユーザーや OS が音量を上書きしており、ページから `video.volume` を変更しても実際の音量に反映されない環境で一致します。

具体例は iPhone 上の Safari です。Apple の「[Safari HTML5 Audio and Video Guide](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW10)」では、iOS の音量はユーザーの物理操作で管理され、JavaScript から `volume` を設定できないと説明されています。現在の WebKit の実装でも、[小画面の iOS 端末ではメディア要素の `volume locked` を初期状態で有効](https://github.com/WebKit/WebKit/blob/00f03c1f906ff25f9536f528e81477c861c0325c/Source/WebCore/html/HTMLMediaElement.cpp#L503-L510)にしています。`currentUserInterfaceIdiomIsSmallScreen()` で判定しているため、iPad は対象外です。つまり、iPhone ではページ内に音量スライダーを実装しても、その値で端末の出力音量を調整できません。

この擬似クラスを使うと、iPhone では効果のない音量コントロールを隠し、端末の音量ボタンを使うよう案内できます。ただし、`volume locked` をどの環境で有効にするかはブラウザの実装に委ねられているため、開発者が JavaScript から任意にこの状態を設定することはできません。

## `video` 要素の状態に応じてスタイルを変える

まずは、擬似クラスが一致する `<video>` 要素自身をスタイルしてみましょう。次の CSS は一時停止中、再生中、データ待ちで枠線の色を変更します。

```css
video {
  outline: 4px solid transparent;
  outline-offset: 4px;
}

video:paused {
  outline-color: gray;
}

video:playing {
  outline-color: green;
}

video:seeking {
  outline-color: blue;
}

video:buffering {
  outline-color: orange;
}

video:stalled {
  outline-color: red;
}
```

メディア状態擬似クラスが直接一致するのは `<video>` 要素です。しかし、実際には動画そのものの見た目ではなく、周囲の再生ボタンや音声コントロールの表示を切り替えたい場合が多いでしょう。再生ボタンなどは `<video>` の子要素にできないため、周囲の要素を変更するには [`:has()`](https://drafts.csswg.org/selectors/#relational) を組み合わせます。

以下の HTML では、動画と状態ラベル、2 つの操作ボタンを `.player` で囲んでいます。シーク中の表示を確認できるよう、`<video>` には `controls` を付けてブラウザ標準のシークバーを出しています。

```html
<div class="player">
  <video src="movie.mp4" preload="auto" controls></video>

  <div class="states">
    <span class="when-paused">一時停止中</span>
    <span class="when-playing">再生中</span>
    <span class="when-seeking">シーク中</span>
    <span class="when-muted">ミュート中</span>
  </div>

  <button id="play-toggle" type="button">
    <span class="when-paused">再生</span>
    <span class="when-playing">一時停止</span>
  </button>

  <button id="mute-toggle" type="button">
    <span class="when-audible">ミュート</span>
    <span class="when-muted">ミュート解除</span>
  </button>
</div>
```

これらの要素は初期状態ですべて非表示にしておき、いま一致している状態のものだけを表示します。

```css
/* 状態に対応する要素は、まずすべて非表示にしておく */
.when-paused,
.when-playing,
.when-seeking,
.when-audible,
.when-muted {
  display: none;
}

/* .player の子孫のうち、いま一致している状態のものだけを表示する */
.player:has(video:paused) .when-paused,
.player:has(video:playing) .when-playing,
.player:has(video:seeking) .when-seeking,
.player:has(video:not(:muted)) .when-audible,
.player:has(video:muted) .when-muted {
  display: inline;
}
```

実際に試してみると、動画の状態に応じて確かに表示が切り替わることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2SA0VyW54IqAwoCaNljqUd/1747a342f698a20bb0395109860d5270/42851bde-fa40-4cf7-ac41-983998b8038d.mov" controls></video>

## まとめ

- メディア状態擬似クラスを使うと、`<video>` や `<audio>` の状態を CSS から直接選択できる
- `:playing`、`:paused`、`:seeking`、`:buffering`、`:stalled`、`:muted`、`:volume-locked` の 7 つが定義されている
- `:stalled` ⊆ `:buffering` ⊆ `:playing` という入れ子の関係にあり、7 つの状態は互いに排他的ではない
- `:seeking` は再生状態とは別の軸で、`:playing` とも `:paused` とも同時に一致する
- `:muted` は強制的な消音状態に一致し、単に `volume = 0` を設定した状態とは異なる
- `:volume-locked` はページ内の音量調整が機能しない状態に一致し、具体例として iPhone 上の Safari がある
- `:has()` を組み合わせると、動画の状態に応じて周囲の状態ラベルや操作ボタンを変更できる

## 参考

- [Selectors Level 4 - Resource State Pseudo-classes](https://drafts.csswg.org/selectors/#resource-pseudos)
- [HTML Standard - Pseudo-classes](https://html.spec.whatwg.org/multipage/semantics-other.html#pseudo-classes)
- [HTML Standard - Media elements](https://html.spec.whatwg.org/multipage/media.html)
- [CSSWG Issue #3821: additional resource state pseudo-classes for media elements](https://github.com/w3c/csswg-drafts/issues/3821)
- [CSSWG Issue #3933: effective media volume is mutable pseudo-class for media elements](https://github.com/w3c/csswg-drafts/issues/3933)
- [Safari HTML5 Audio and Video Guide - Volume Control in JavaScript](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html#//apple_ref/doc/uid/TP40009523-CH5-SW10)
- [WebKit - HTMLMediaElement.cpp `defaultVolumeLocked()`](https://github.com/WebKit/WebKit/blob/00f03c1f906ff25f9536f528e81477c861c0325c/Source/WebCore/html/HTMLMediaElement.cpp#L503-L510)
- [Chrome 152 Beta](https://developer.chrome.com/blog/chrome-152-beta)
