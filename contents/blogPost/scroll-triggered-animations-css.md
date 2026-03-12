---
id: TqT-M5rh3PIorzgihnRhp
title: "CSS によるスクロールトリガーアニメーション"
slug: "scroll-triggered-animations-css"
about: "要素が画面内に入った時にアニメーションを開始するスクロールトリガーアニメーションは、これまでは JavaScript を使用して `Intersection Observer API` を利用する方法が一般的でした。JavaScript を使わずに CSS だけで実装を完結できるようになる `animation-trigger` という新しい CSS プロパティが登場しました。"
createdAt: "2026-03-12T19:30+09:00"
updatedAt: "2026-03-12T19:30+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4opWTBQRbM9YHSa8TRbC7T/871cf55658e6ada3389fd4a28cc34c38/drum_19501-768x591.png"
  title: "ドラムのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "CSS の `animation-trigger` プロパティでアニメーションとトリガーを紐づける際、トリガーが発火したときにアニメーションを正の再生速度で再生する値はどれですか？"
      answers:
        - text: "play-forwards"
          correct: true
          explanation: "`play-forwards` はトリガーが発火したときに正の再生速度でアニメーションを再生します。"
        - text: "play-backwards"
          correct: false
          explanation: "`play-backwards` はトリガーが解除されたときにアニメーションを逆再生（負の再生速度）します。"
        - text: "play-once"
          correct: false
          explanation: "`play-once` はアニメーションを 1 回だけ再生して終了後に停止します。"
        - text: "replay"
          correct: false
          explanation: "`replay` はアニメーションの進行状況を 0 にリセットしてから再生します。"
    - question: "スクロールトリガーアニメーションのトリガーを定義するために使用する CSS プロパティの組み合わせとして正しいものはどれですか？"
      answers:
        - text: "`animation-name` と `animation-trigger`"
          correct: false
          explanation: "`animation-name` はアニメーション名を指定するプロパティで、`animation-trigger` はトリガーとアニメーションを紐づけるプロパティです。トリガー自体の定義には使いません。"
        - text: "`trigger-scope` と `timeline-trigger-source`"
          correct: false
          explanation: "`trigger-scope` はトリガーのスコープを限定するためのプロパティであり、トリガーの定義そのものには使いません。"
        - text: "`timeline-trigger-name` と `timeline-trigger-source`"
          correct: true
          explanation: "トリガーの名前を `timeline-trigger-name` で、トリガーの条件を `timeline-trigger-source` で定義します。"
        - text: "`animation-timeline` と `animation-trigger`"
          correct: false
          explanation: "トリガーの定義には `timeline-trigger-name` と `timeline-trigger-source` を使います。"
published: true
---
要素が画面内に入った時にアニメーションを開始するスクロールトリガーアニメーションは、ユーザーの注目を集める効果的な方法です。例えば、ユーザーがページをスクロールしてカード要素が画面内に入った時に、カードがフェードインするようなアニメーションを実装できます。これまでは JavaScript を使用して `Intersection Observer API` を利用する方法が一般的でした。

```javascript
const cards = document.querySelectorAll(".card");
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // 要素が画面内に入ったときに entry.isIntersecting が true になる
    if (entry.isIntersecting) {
      // アニメーションを開始するためのクラスを追加
      entry.target.classList.add("animate");
    } else {
      // 要素が画面外に出たときにクラスを削除（必要に応じて）
      entry.target.classList.remove("animate");
    }
  });
});

// 各要素を監視する
cards.forEach((card) => observer.observe(card));
```

このようなアニメーションは今日の Web サイトで一般的に使用されているアプローチですが、CSS だけで実装を完結できず、ある程度の JavaScript を書く必要があるという課題がありました。この問題を解決するために `animation-trigger` という新しい CSS プロパティが策定されました。通常の CSS アニメーションは適切な値がセットされている場合にページの読み込み時に開始されますが、`animation-trigger` プロパティを使用することで、要素が特定の条件を満たすまでアニメーションの開始を遅延したり、トリガーによって一時停止・再開・リセットすることが可能になります。これにより、スクロールトリガーアニメーションを CSS だけで宣言的な方法で実装できるようになります。

この記事では、`animation-trigger` プロパティを使用してどのようにスクロールトリガーアニメーションを実装できるのかを解説します。`animation-trigger` は Chrome v146 以降で利用可能です。

## animation-trigger プロパティを使用したスクロールトリガーアニメーションの実装

スクロールトリガーアニメーションを実装するために、トリガーを定義します。トリガーを定義するためには `timeline-trigger-name` と `timeline-trigger-source` プロパティを使用します。

```css
.card {
  timeline-trigger-name: --t;
  timeline-trigger-source: view();
}
```

`timeline-trigger-name` プロパティはトリガーの名前を定義します。ここで定義した名前は後ほど `animation-trigger` プロパティで参照されます。`timeline-trigger-source` プロパティはトリガーの条件を定義します。ここでは [`view()`](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Properties/animation-timeline/view) 関数を使用して、要素がビューポート内に入ったときにトリガーが発火するように定義しています。以下のように `timeline-trigger-activation-range` プロパティで範囲を指定できます。

```css
.card {
  timeline-trigger-name: --t;
  timeline-trigger-source: view();
  timeline-trigger-activation-range: contain 15% contain 85% / entry 100% exit
    0%;
}
```

`/` の前はトリガーが発火する（要素が入ってくる）方向の範囲、後はトリガーが解除される（要素が出ていく）方向の範囲を表します。

`timeline-trigger` プロパティで一括して定義できます。

```css
.card {
  timeline-trigger: --t view() contain 15% contain 85% / entry 100% exit 0%;
}
```

トリガーを定義したら、あとは `animation-trigger` プロパティでアニメーションとトリガーを紐づけるだけです。

```css
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.card {
  animation-name: fade-in;
  animation-duration: 1s;
  /* トリガー --t が発火したときにアニメーションを開始する */
  animation-trigger: --t play-forwards play-backwards;
  /* 名前 --t のスコープをこの要素内とその子孫要素のみに限定する */
  trigger-scope: --t;
}
```

`play-forwards` はトリガーが発火したときにアニメーションを開始することを意味し、`play-backwards` はトリガーが解除されたときにアニメーションを逆再生することを意味します。他にも以下のような値が利用できます。

| 値               | 説明                                                |
| ---------------- | --------------------------------------------------- |
| `none`           | 何も実行しない                                      |
| `play`           | アニメーションを再生する                            |
| `play-once`      | アニメーションを 1 回だけ再生する（終了後は停止）   |
| `play-forwards`  | 正の再生速度でアニメーションを再生する              |
| `play-backwards` | 負の再生速度でアニメーションを再生する              |
| `pause`          | アニメーションを一時停止する                        |
| `reset`          | アニメーションの進行状況を 0 にリセットする         |
| `replay`         | アニメーションの進行状況を 0 にリセットして再生する |

デフォルトでは `animation-trigger` プロパティで定義した名前はグローバルのスコープに属し、複数の名前が定義された場合は後から定義された名前が優先されます。しかしこの挙動は思わぬバグの原因になる可能性があります。この問題を回避するために
`trigger-scope` プロパティでスコープを明示的に定義できます。

上記の例では `trigger-scope: --t;` とすることで、`--t` という名前のトリガーはこの要素内とその子孫要素のみに適用されるようになります。`trigger-scope` プロパティは [anchor-scope](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-scope) プロパティと同じ設計理念に基づいています。

以下のデモでは、スクロールトリガーアニメーションを実装するための CSS コードの例を示しています。Chrome v146 以降で実行してみてください。

<iframe height="300" style="width: 100%;" scrolling="no" title="スクロールトリガーアニメーションのデモ" src="https://codepen.io/azukiazusa1/embed/emdgNRG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/emdgNRG">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- 要素が画面内に入った時にアニメーションを開始するスクロールトリガーアニメーションは、今日の Web サイトで一般的に使用されているアプローチだが、これまでは JavaScript を使用して `Intersection Observer API` を利用する方法が一般的だった
- `animation-trigger` という新しい CSS プロパティを使用することで、要素が特定の条件を満たすまでアニメーションの開始を遅延したり、トリガーによって一時停止・再開・リセットすることが可能になり、スクロールトリガーアニメーションを CSS だけで宣言的な方法で実装できるようになる
- `timeline-trigger-name` と `timeline-trigger-source` プロパティを使用してトリガーを定義し、`animation-trigger` プロパティでアニメーションとトリガーを紐づけることでスクロールトリガーアニメーションを実装できる
- `trigger-scope` プロパティを使用してトリガーのスコープをその要素内とその子孫要素のみに限定することができる
- `animation-trigger` プロパティは Chrome v146 以降で利用可能

## 参考

- [CSS スクロール トリガー アニメーションがまもなく登場します  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/scroll-triggered-animations?hl=ja)
- [\[css-animations-2\] Add animation-trigger for triggering animations when an element is in a timeline's range · Issue #8942 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/8942)
- [Animation Triggers](https://drafts.csswg.org/animation-triggers-1/)
- [explainers-by-googlers/scroll-triggered-animations: Explainer for Scroll-Triggered Animations](https://github.com/explainers-by-googlers/scroll-triggered-animations/tree/main)
- [\[css-animations-2\]\[web-animations-2\] How should AnimationTrigger work? · Issue #12119 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/12119)
- [CSS Animations Module Level 2](https://drafts.csswg.org/css-animations-2/)
