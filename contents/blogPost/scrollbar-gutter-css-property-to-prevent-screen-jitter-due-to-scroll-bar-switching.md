---
id: OfjIw8fLz5wuPjA7MSRns
title: "scrollbar-gutter CSS プロパティでスクロールバーの切り替わりによる画面のガタツキを解消する"
slug: "scrollbar-gutter-css-property-to-prevent-screen-jitter-due-to-scroll-bar-switching"
about: "子要素が親要素のボックスからはみ出した時、overflow プロパティの値が auto または scroll の場合にスクロールバーが表示されます。スクロールバーがクラシックスクロールバーの場合、スクロールバーの表示・非表示によりボックスの幅が変わるため、画面がガタつくことがあります。scrollbar-gutter プロパティを使うとスクロールバー用のスペースをあらかじめ確保でき、画面のガタツキを解消できます。"
createdAt: "2024-06-01T15:30+09:00"
updatedAt: "2024-06-01T15:30+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5AsM3B5qBh0qMWxvcDTZHQ/4d03e02e5dc069db16af3cfff092a288/flower_ajisai_8974-768x662.png"
  title: "紫陽花のイラスト"
selfAssessment:
  quizzes:
    - question: "スクロールバー自体が幅を持つ種類はなんと呼ばれるか？"
      answers:
        - text: "オーバーレイスクロールバー"
          correct: false
          explanation: "オーバーレイスクロールバーはスクロールバー自体が幅を持たず、スクロール領域に重なって表示されます。"
        - text: "クラシックスクロールバー"
          correct: true
          explanation: null
        - text: "トラディショナルスクロールバー"
          correct: false
          explanation: null
        - text: "モダンスクロールバー"
          correct: false
          explanation: null
    - question: "scrollbar-gutter プロパティにおいて、ボックスの両側に対称的なスペースを確保する方法はどれか？"
      answers:
        - text: "scrollbar-gutter: stable"
          correct: false
          explanation: "ボックスの右側にのみスクロールバー用のスペースが確保されます。"
        - text: "scrollbar-gutter: stable both-edges"
          correct: true
          explanation: null
        - text: "scrollbar-gutter: both"
          correct: false
          explanation: null
        - text: "scrollbar-gutter: stable left-right"
          correct: false
          explanation: null
published: true
---
子要素が親要素のボックスからはみ出した時、`overflow` プロパティの値が `auto` または `scroll` の場合にスクロールバーが表示されます。スクロールバーがどのように表示されるかは OS やブラウザの設定により異なりますが、大きく分けて以下のような挙動があります。

- オーバーレイスクロールバー：スクロールバー自体が幅を持たず、スクロール領域に重なって表示される
- クラシックスクロールバー：スクロールバーが幅を持ち、スクロール領域を狭めて表示される

例として MacOS の場合では、デフォルトでオーバーレイスクロールバーが採用されています。システム環境設定で「外観 > スクロールバーを表示」を「常に表示」に設定することでクラシックスクロールバーに変更できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1NuVUyEcqSfkRZoP9RV0yZ/3beefb375d0f0cafac3c944d79953036/__________2024-06-01_17.12.03.png)

クラシックスクロールバーの場合、スクロールバーの有無によりボックスの幅が変わるため、スクロールバーの表示・非表示が切り替わるたびに画面がガタつくことがあります。

以下の例では、「追加」ボタンを押すたびにリストが追加され、ボックスの height を超えたタイミングでスクロールバーが表示されテキストがずれていることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5bFstaxxB1uvUyndG3RFWe/4568b024186e43ffd2cd5eb8004f0d94/_____2024-06-01_16.50.11.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/eYavWbW?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/eYavWbW">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## scrollbar-gutter プロパティでガタツキを解消する

`scrollbar-gutter` プロパティを使うとスクロールバー用のスペースをあらかじめ確保できます。つまり、スクロールバーが表示・非表示に切り替わってもボックスの幅が変わらなくなるのです。先程の例に `scrollbar-gutter` プロパティを追加してみましょう。`scrollbar-gutter` プロパティの値に `stable` を指定することで、子要素が親要素のボックスをはみ出ない場合でもスクロールバー用のスペースを確保します。

!> `scrollbar-gutter: stable` を指定されたときにあらかじめスペースが確保されるのは、クラシックスクロールバーの場合のみです。

```css
.box {
  scrollbar-gutter: stable;
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4Yk7tqutrC60Rv1vOF3HiV/a220a7d65f2b4b231e4c936710db799a/_____2024-06-01_17.00.40.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/RwmpVmO?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/RwmpVmO">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`scrollbar-gutter: stable` を指定した場合、ボックスの右側にのみスクロールバー用のスペースが確保されるため、コンテンツが左側に偏って配置されているように見えてしまいます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2sJCtllOxbG120dPwivdAR/ff6185debffe00f37fec5d7a1b4d9a1f/__________2024-06-01_17.04.48.png)

このような場合、`scrollbar-gutter` プロパティに `stable both-edges` を指定することで、ボックスの両側に対称的なスペースを確保できます。

```css
.box {
  scrollbar-gutter: stable both-edges;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4i0TYF7GxfBPlPzg0MFJd4/958bd8cb45eb96dc8a7b32cc316cfcc8/__________2024-06-01_17.07.22.png)

### オーバーレイスクロールバーの場合

`scrollbar-gutter: stable` であらかじめスクロールバー用のスペースを確保されるのは、クラシックスクロールバーの場合のみです。オーバーレイスクロールバーの場合には `scrollbar-gutter` を指定していない時と同じ挙動になります。オーバーレイスクロールバーの場合はスクロールバーがスクロール領域に重なって表示されるため、スクロールバー用のスペースを確保する必要がないためです。

MacOS のスクロールバーの表示の設定を「マウスまたはトラックパッドに基づいて自動的に表示」に切り替えると、`scrollbar-gutter: stable` を指定したとしてもスクロールバー用のスペースが確保されないことが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4hNWKCiWbC0Y8Z9parAhM3/e7e669b384551690f8e457bc9f276eb7/__________2024-06-01_17.10.37.png)

## まとめ

- スクロールバーの種類にはスクロールバー自体が幅を持たず、スクロール領域に重なって表示されるオーバーレイスクロールバーと、スクロールバーが幅を持ち、スクロール領域を狭めて表示されるクラシックスクロールバーがある
- クラシックスクロールバーの場合、スクロールバーの表示・非表示によりボックスの幅が変わるため、画面がガタつくことがある
- `scrollbar-gutter: stable` を指定するとスクロールバー用のスペースをあらかじめ確保でき、スクロールバーの表示・非表示による画面のガタツキを解消できる
- `scrollbar-gutter: stable both-edges` を指定するとボックスの両側に対称的なスペースを確保できる
- `scrollbar-gutter: stable` であらかじめスペースが確保されるのは、クラシックスクロールバーの場合のみで、オーバーレイスクロールバーの場合はスペースが確保されない

## 参考

- [scrollbar-gutter - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)
- [HTML制作で気をつけたいスクロールバーの挙動 - ガタつきをCSSのscrollbar-gutterで防ぐ方法など - ICS MEDIA](https://ics.media/entry/230206/)
