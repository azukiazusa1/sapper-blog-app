---
id: m9T_-P3Qa4ZVCCKeS0foU
title: "GIF アニメーションの使用を控える"
slug: "avoid-using-gif-animation"
about: "技術記事を書く際に、GIF アニメーションを使用することがあるかと思います。しかし、GIF アニメーションを使用することはアクセシビリティ上問題となります。この記事では、GIF アニメーションを使用することを避けるべき理由を説明します。"
createdAt: "2023-05-28T14:34+09:00"
updatedAt: "2023-05-28T14:34+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3A2zM9GF85BLVk3J3xTzNl/824927968b2063d4f7178ff0967ea6c7/___Pngtree___international_day_of_yoga_with_5387176.png"
  title: "international day of yog"
audio: null
selfAssessment: null
published: true
---
技術記事を書く際に、GIF アニメーションを使用することがあるかと思います。例えばフロントエンドのコードが実際にどのように動作するか説明する際には静止画では伝わりにくので、一連の動作を GIF アニメーションで説明することがあります。私自身も、このブログではよく GIF アニメーションを使用しています。

しかし、GIF アニメーションを使用することは以下の 2 つの理由から避けるべきです。

- GIF アニメーションは自動で再生され、かつ停止できない
- `<video>` 要素を使用するのと比較して、ページの読み込み速度が遅くなるおそれがある

直近のブログ記事を書く際には、もっぱら GIF アニメーションを使用することを避けて `<video>` 要素を使用するようにしています。この記事では、GIF アニメーションを使用することを避けるべき理由を説明します。

## GIF アニメーションは自動で再生され、かつ停止することができない

GIF アニメーションを使用する際の最大の問題点は、ユーザーのコントロールが不可能だという点です。このことはアクセシビリティ上問題となります。これは [Web Content Accessibility Guidelines (WCAG) 2.1](https://waic.jp/translations/WCAG21/#pause-stop-hide) に関連する問題です。以下の事項を満たさない場合、ユーザーがページ全体を利用できないおそれがあります。

> 動きのある、点滅している、スクロールする、又は自動更新する情報は、次のすべての事項を満たしている
> - 動き、点滅、スクロール: 動きのある、点滅している、又はスクロールしている情報が、(1) 自動的に開始し、(2) 5 秒よりも長く継続し、かつ、(3) その他のコンテンツと並行して提示される場合、利用者がそれらを一時停止、停止、又は非表示にすることのできるメカニズムがある。ただし、その動き、点滅、又はスクロールが必要不可欠な動作の一部である場合は除く。
> - 自動更新: 自動更新する情報が、(1) 自動的に開始し、 (2) その他のコンテンツと並行して提示される場合、利用者がそれを一時停止、停止、もしくは非表示にする、又はその更新頻度を調整することのできるメカニズムがある。ただし、その自動更新が必要不可欠な動作の一部である場合は除く。

この達成基準の意図は、ユーザーがページを利用している間にその他のことに注意をそらせないようにすることです。

注意欠陥障害を持つグループは、点滅するコンテンツに気を取られ、ウェブページの他の部分に集中することが困難になります。私自身も、再生され続けられている GIF アニメーションが目に入っていると集中力が削がれてしまうので、画面をスクロールして GIF アニメーションが目に入れないようにしている経験がよくあります。

動きや点滅のあるコンテンツは、ユーザーがそれらを一時停止、停止、又は非表示にすることのできるメカニズムを提供する必要があります。GIF アニメーションは常に自動で再生され、かつ停止できないため、この達成基準を満たしていません。達成基準を満たすためには、アニメーションに「一時停止」と「再開」のボタンがあることが求められています。

### `<video>` 要素を使用する

もしウェブページの中でアニメーションを用いたいのであれば、[video](https://developer.mozilla.org/ja/docs/Web/HTML/Element/video) 要素を使用することを推奨します。`<video>` 要素は、`controls` 属性を指定することで、ユーザーが動画の再生や一時停止、音量の調整などを行うことができるようになります。

```html
<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5IiBd2nO3BVY8ttqzSn5hZ/6fbac2a4f408bced66a777efe6f1ead4/flower.webm" 
  controls 
  width="400"
>
</video>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5IiBd2nO3BVY8ttqzSn5hZ/6fbac2a4f408bced66a777efe6f1ead4/flower.webm" controls width="400"></video>

`<video>` タグを使用する際には `autoplay` 属性の指定は可能な限り避けるべきです。`autoplay` 属性を指定すると、ユーザーがページを開いたときに自動的に動画が再生されます。このことはユーザーにとって不快な体験となる恐れがあります。

どうしても動画の自動再生が必要なのであれば、オプトインとするべきです。

## `<video>` 要素を使用するのと比較して、ページの読み込み速度が遅くなるおそれがある

GIF アニメーションを使用するかわりに `<video>` 要素を使用することで、ページの読み込み速度を向上させる可能性があることが述べられています。これは、GIF 形式の画像から mp4 や webm 形式の動画に変換することで、ファイルサイズを削減できるためです。

次の記事では 3.7MB の GIF 変換するだけで大きくファイルサイズが削減できたことが述べられています。

| ファイル形式 | ファイルサイズ |
| --- | --- |
| GIF | 3.7MB |
| MP4 | 551KB |
| WebM | 341KB |

[Replace animated GIFs with video for faster page loads - Compare the difference](https://web.dev/replace-gifs-with-videos/#compare-the-difference)

例えば Twitter や Facebook ではユーザーが GIF アニメーションでアップロードしたとしても、表示するときには自動変換して `<video>` にするという処理を行っています。

## まとめ

アクセシビリティやページ読み込み速度の改善の観点から、GIF アニメーションの使用は控えて `<video>` 要素を使用するべきです。また GIF アニメーションに限らず、動きや点滅のあるコンテンツは、ユーザーがそれらを一時停止、停止、又は非表示にすることのできる機能を提供する必要があります。

## 参考

- [2.2.2 動く、自動更新するコンテンツに配慮する - Ameba Accessibility Guidelines](https://a11y-guidelines.ameba.design/2/2/2/)
- [達成基準 2.2.2: 一時停止、停止、非表示を理解する](https://waic.jp/translations/WCAG21/Understanding/pause-stop-hide.html)
- [Replace animated GIFs with video for faster page loads](https://web.dev/replace-gifs-with-videos/)
