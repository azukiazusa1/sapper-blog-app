---
id: s8kyXCBQOdqFCYdw84wFi
title: "アニメーションの無効設定は prefers-reduced-motion に任せるか、アプリケーションの設定で制御するか"
slug: "prefers-reduced-motion-or-application-settings"
about: "prefers-reduced-motion とは、ユーザーの環境設定によって余計な動きを抑制することを要求したことを検出するメディアクエリです。この設定は各 OS ごとに設定できます。ユーザーがアニメーションを無効にできることは、アクセシビリティの観点で重要です。prefers-reduced-motion によりアニメーションを無効にするのでも十分ですが、アプリケーションの設定として持たせるべきだと考えています。"
createdAt: "2023-08-06T14:25+09:00"
updatedAt: "2023-08-06T14:25+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4JFFKRkk8Ksbur77uGalUb/1f119a80793935e755da0fd408319565/uchiage-hanabi_illust_3306.png"
  title: "打ち上げ花火のイラスト"
audio: null
selfAssessment: null
published: true
---
## prefers-reduced-motion とは

prefers-reduced-motion とは、ユーザーの環境設定によって余計な動きを抑制することを要求したことを検出するメディアクエリです。この設定は各 OS ごとに以下のように設定できます。

- Windows 10：設定 > 簡単操作 > ディスプレイ > アニメーションを表示する
- macOS：システム設定 > アクセシビリティ > 表示 > 動きの抑制
- iOS：設定 > 一般 > アクセシビリティ > 視覚効果を減らす
- Android 9 以上：設定 > ユーザー補助 > アニメーションの削除

余計な動きを抑制することは、W3C が勧告している WCAG (Web Content Accessibility Guidelines)のアニメーションに関する達成基準にも含まれています。

> アニメーションが、機能又は伝達されている情報に必要不可欠でない限り、インタラクションによって引き起こされるモーションアニメーションを無効にできる

[達成基準 2.3.3 インタラクションによるアニメーション](https://waic.jp/translations/WCAG21/#animation-from-interactions)

> 動きのある、点滅している、スクロールする、又は自動更新する情報は、次のすべての事項を満たしている
> 動き、点滅、スクロール
> 動きのある、点滅している、又はスクロールしている情報が、(1) 自動的に開始し、(2) 5 秒よりも長く継続し、かつ、(3) その他のコンテンツと並行して提示される場合、利用者がそれらを一時停止、停止、又は非表示にすることのできるメカニズムがある。ただし、その動き、点滅、又はスクロールが必要不可欠な動作の一部である場合は除く。
> 自動更新
> 自動更新する情報が、(1) 自動的に開始し、 (2) その他のコンテンツと並行して提示される場合、利用者がそれを一時停止、停止、もしくは非表示にする、又はその更新頻度を調整することのできるメカニズムがある。ただし、その自動更新が必要不可欠な動作の一部である場合は除く。

[達成基準 2.2.2 一時停止、停止、非表示](https://waic.jp/translations/WCAG21/#pause-stop-hide)

これらの達成基準の意図は、ユーザーが Web ページにアニメーションが表示されないようにすることです。一部のユーザーは、アニメーションコンテンツによって気が散ったり、吐き気を感じたりします。特に前庭障害を持つ人々に対するアニメーションの影響は、非常に深刻になる可能性があります。d 吐き気、片頭痛、回復のために床上安静が必要になる可能性などがあります。

達成基準の中ではアニメーションを何らかの方法で無効にできることが求められており、その方法の 1 つとして prefers-reduced-motion メディアクエリを使用して、利用者にウェブページでアニメーションが表示されないようにする方法があげられています。

[C39: モーションの防止に CSS reduce-motion クエリを使用する](https://waic.jp/translations/WCAG21/Techniques/css/C39)

## prefers-reduced-motion の使い方

prefers-reduced-motion は、以下のように使用します。

```css:style.css
@media (prefers-reduced-motion: reduce) {
  /* アニメーションを無効にする */
}
```

`prefers-reduced-motion` は、以下の 2 つの値を取ります。

- `no-preference`：ユーザーがアニメーションを無効にする設定をしていない場合
- `reduce`：ユーザーがアニメーションを無効にする設定をしている場合

上記の例のメディアクエリでは、ユーザーがアニメーションを無効にする設定をしている場合のみ、アニメーションを無効にする CSS を記述できます。例えば、特定の要素のアニメーションを無効にしたい場合は、以下のように記述します。

```css:style.css
.button {
  /* アニメーションの記述 */
  animation: blink 1.5s infinite;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  border-radius: 0.5rem;
}

@keyframes blink {
  0% {
    background-color: #fff;
    color: #000;
  }
  50% {
    background-color: #000;
    color: #fff;
  }
  100% {
    background-color: #fff;
    color: #000;
  }
}

/** prefers-reduced-motion の値が　reduce の場合 */
@media (prefers-reduced-motion: reduce) {
  .button {
    /* アニメーションを無効にする */
    animation: none;
  }
}
```

以下のように、OS の設定を切り替えるたびに、アニメーションが有効になったり無効になったりすることを確認できます。

?> 下記の動画は激しいアニメーションが含まれています。十分に注意した上で動画を再生してください。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1GTchO6bDSe772AHJY9aDW/c6ec24a92a8b9512d2060c94db043b03/_____________2023-08-06_15.35.37.mov" controls></video>

また、以下のような方法ですべての要素のアニメーションやトランジションを一律で無効にすることもできます。下記の CSS は [modern-css-reset](https://github.com/Andy-set-studio/modern-css-reset/tree/master) で使用されているものです。

```css
/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

また、JavaScript でも `window.matchMedia` を使用して、prefers-reduced-motion の設定を検出できます。

```js
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

if (mediaQuery.matches) {
  // アニメーションを無効にする
}
```

## prefers-reduced-motion に頼らず、アニメーションの無効化をアプリケーションの設定で制御できるようにすべきか

prefers-reduced-motion を使用した実装は、アニメーションを無効にできる設定をユーザーに提供できることから、達成基準を十分に満たしていると言えます。一方で、prefers-reduced-motion でアニメーションを無効にするためは OS 側の設定に頼らなければならないという点で、ユーザーの使い勝手を損なってしまっていないかという懸念があります。

例えば、X（Twitter）、Slack、Discord などのアプリケーションでは、アプリケーションの設定でアニメーションを軽減できるようになっています。X（Twitter）では、設定とプライバシー > アクセシビリティ、表示、言語 > アクセシビリティ > 動きを減らすから prefers-reduced-motion と同等の設定を行えます。

![X（Twitter）のアニメーションの軽減設定](https://images.ctfassets.net/in6v9lxmm5c8/4n7BJAAdlQtFcwU5cspQRk/b750ec6b0a57a44c6b86dbc5b1c5b6ff/____________________________2023-08-06_14.48.43.png)

ダークモードの設定も多くの Web サイトでは OS の設定だけでなく、Web サイトの設定でも切り替えられるようになっているので、アニメーションの軽減設定も同様に Web サイトの設定でも切り替えられることにそれほど違和感はないでしょう。なぜアニメーションの軽減設定をアプリケーション側に持たせるかについては、私は以下のように考えています。

- ユーザーはまずはじめにアプリケーションの設定を確認する
- アプリケーションごとに設定を切り替えられる
- アニメーションの軽減設定を別の目的で ON にしているユーザーがいるかもしれない

### ユーザーはまずはじめにアプリケーションの設定を確認する

あるアプリケーションの挙動を変更したいと思ったとき、私達はまず何から始めるでしょうか？まずはアプリケーションの設定のアイコンを見つけて、設定画面から該当の項目がないか探す人が大半だと思います。

アプリケーションの設定画面は、アプリケーションの挙動を変更するための最も直感的な場所です。

アプリケーションの設定を変更するために OS の設定を開くことは、なかなか考えつかないのではないでしょうか。そもそも OS の設定でアニメーションを軽減できることを知らない人も多いでしょう。

## アプリケーションごとに設定を切り替えられる

ユーザーは必ずしもすべてのアプリケーション上でアニメーションを無効にしたいとは考えないかもしれません。

### アニメーションの軽減設定を別の目的で ON にしているユーザーがいるかもしれない

「iphone 視野効果を減らす」というワードで検索すると、サジェストに「バッテリー」が表示されます。視野効果を減らす設定を ON にすることで、バッテリーの消費を抑えることができるという内容の記事も多くヒットします。どうやら視野効果を減らすの設定を ON にすることで、ホーム画面のアイコンや壁紙が傾きに合わせて動く機能が OFF になることから、バッテリーの消費を抑えることができるようです。

バッテリーの消費を抑えるために視野効果を減らす設定を ON にしているユーザーが必ずしもアプリケーションのアニメーションを無効にしたいとは限らないのではないでしょうか？

確かに、アプリケーションのアニメーションを無効にすることでバッテリーの消費を抑える効果があるかもしれません。しかし、そもそも視野効果を減らす設定を ON にすることでそのような作用が生じることを知らないユーザーも多いかと思います。（ユーザーは、OS のアニメーションのみが無効にされていることを期待しているかもしれません）

例えば X の検索で「アクセシビリティ」と検索すると、「アクセシビリティ > 動きを減らす」を OFF にすることで、誕生日の風船が表示されるようになるというポストが多く見られます。このような例は、バッテリーの消費を抑えるために「視差効果を減らす」設定を ON にしているユーザーが知らずのうちにアニメーションを無効にしている可能性があるということを示しています。

このように `prefers-reduced-motion` を ON にしていても、必ずしもアニメーションを無効にしたいとは限らないユーザーがいることが考えられるため、アプリケーションでは個別にアニメーションの軽減設定を切り替えられるようにしておくべきだと考えています。

### アプリケーションの設定でアニメーションを無効にできるようにする

以上の理由から、アプリケーションの設定でアニメーションを無効にできるようにすべきだと思います。`prefers-reduced-motion` のメディアクエリの値は、アプリケーションの設定の初期値として使用するのが良いでしょう。以下のコード例では、アプリケーションの設定でアニメーションを無効にできるようにしています。

アプリケーションの設定が行われていない場合には、`prefers-reduced-motion` のメディアクエリの値を使用します。ユーザーが設定した内容は、`localStorage` に保存しておき、`localStorage` に保存されている値がある場合には、その値を使用します。アニメーションの無効設定が有効だと判定した場合、ドキュメントルートに `prefers-reduced-motion` クラスを追加します。CSS では、`prefers-reduced-motion` クラスが追加されている場合には、アニメーションを無効にする CSS を記述します。

```js
// アニメーション無効の設定を取得する
// localStorage に保存されている値がある場合には、その値を使用する
// localStorage に保存されている値がない場合には、prefers-reduced-motion のメディアクエリの値を使用する
const prefersReducedMotion = localStorage.getItem("prefersReducedMotion");
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const checkbox = document.querySelector("#prefers-reduced-motion");

if (prefersReducedMotion) {
  if (prefersReducedMotion === "true") {
    // アニメーションを無効にする設定なら、prefers-reduced-motion クラスを追加し、チェックボックスをチェックする
    document.documentElement.classList.add("prefers-reduced-motion");
    checkbox.checked = true;
  } else {
    // アニメーションを有効にする設定なら、prefers-reduced-motion クラスを削除し、チェックボックスをチェックしない
    document.documentElement.classList.remove("prefers-reduced-motion");
    checkbox.checked = false;
  }
} else if (mediaQuery.matches) {
  document.documentElement.classList.add("prefers-reduced-motion");
  checkbox.checked = true;
}

// チェックボックスの状態が変更されたら、localStorage に保存し、prefers-reduced-motion クラスを追加する
const handleChange = (event) => {
  localStorage.setItem("prefersReducedMotion", event.target.checked);
  document.documentElement.classList.toggle("prefers-reduced-motion");
};

checkbox.addEventListener("change", handleChange);
```

```css
/* prefers-reduced-motionクラスがある場合、アニメーションを無効にする */
:root.prefers-reduced-motion *,
*::before,
*::after {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
  scroll-behavior: auto !important;
}
```

## まとめ

- ユーザーがアニメーションを無効にできることは、WCAG の達成基準にも含まれている
- prefers-reduced-motion は、ユーザーの環境設定によって余計な動きを抑制することを要求したことを検出するメディアクエリ
- 以下の理由から、prefers-reduced-motion の値でのみアニメーションを無効にするのではなく、アプリケーションの設定でアニメーションを無効にするべき
  - ユーザーはまずはじめにアプリケーションの設定を確認する
  - アプリケーションごとに設定を切り替えられる
  - アニメーションの軽減設定を別の目的で ON にしているユーザーがいるかもしれない

## 参考

- [ユーザーのプリファレンスに応じて過度なアニメーションを無効にする「prefers-reduced-motion」](https://accessible-usable.net/2021/09/entry_210919.html)
- [Understanding SC 2.3.3:Animation from Interactions (Level AAA)](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html)
