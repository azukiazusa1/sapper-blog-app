---
id: WjtL4diZ8roXcSrrkPNfh
title: "Element-scoped View Transitions で要素ごとに View Transition を実行する"
slug: "element-scoped-view-transitions"
about: "`document.startViewTransition()` の遷移はドキュメント全体で 1 つしか実行できず、ページ全体の上に描画されます。`element.startViewTransition()` を使うと、遷移を特定の要素に限定して、複数の遷移を同時に実行できます。この記事では、2 つのリストを同時にアニメーションさせる例を通じて基本的な使い方を紹介します。"
createdAt: "2026-10-10T14:58+09:00"
updatedAt: "2026-10-10T14:58+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/WhViYCVyHnmkyy3MGoIiu/3d6f76fc0c5689f647115007e44b9dbc/bread_cream-cornet_13474-768x768.png"
  title: "クリームコロネのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "element.startViewTransition() を呼び出したとき、::view-transition 疑似要素ツリーはどこに作られますか？"
      answers:
        - text: "startViewTransition() を呼び出した要素（スコープ）"
          correct: true
          explanation: "疑似要素ツリーは html 要素ではなくスコープの要素に作られます。そのため #list2::view-transition-group(*.item) のように、スコープを指定して特定の遷移だけにスタイルを当てられます。"
        - text: "常にドキュメントのルートである html 要素"
          correct: false
          explanation: "html 要素に作られるのは document.startViewTransition() の場合です。"
        - text: "view-transition-name を持つ各要素"
          correct: false
          explanation: "view-transition-name を持つ要素はスナップショットを取得される対象であり、疑似要素ツリーの起点ではありません。"
        - text: "トップレイヤーに追加される専用の要素"
          correct: false
          explanation: "専用の要素が追加されるわけではありません。疑似要素ツリーはスコープの要素に作られます。"
    - question: "view-transition-scope: all を指定した要素について正しい説明はどれですか？"
      answers:
        - text: "その要素の子孫で開始した遷移がすべて無効になる"
          correct: false
          explanation: "子孫の遷移を無効にするプロパティではありません。view-transition-name が見つかる範囲を限定するものです。"
        - text: "要素の外側で開始した遷移から、その要素と子孫の view-transition-name が見えなくなる"
          correct: true
          explanation: "view-transition-scope: all は view-transition-name を探す範囲を要素のサブツリーに限定します。遷移中のスコープには自動で適用されるため、同じ名前を別のスコープで使い回せます。"
        - text: "その要素に contain: layout が自動で適用される"
          correct: false
          explanation: "レイアウト封じ込めは遷移中のスコープに適用されるものですが、view-transition-scope の効果ではありません。"
        - text: "その要素の中の view-transition-name がドキュメント全体で一意になる"
          correct: false
          explanation: "逆に、名前の衝突を防ぐために探索範囲を閉じ込めるものです。ドキュメント全体で一意にする機能ではありません。"
published: true
---
b> view-transitions-element-scoped

[View Transition API](https://developer.mozilla.org/ja/docs/Web/API/View_Transition_API) を使うと、ページ遷移の際のアニメーションを簡単に実装できます。View Transition API はブラウザが自動でスナップショットを取得し、DOM の更新前後の状態を比較してアニメーションを生成します。`document.startViewTransition()` のコールバック関数内で DOM を更新すると、DOM の更新に伴うアニメーションが自動で実行されますが、ドキュメント全体に対して 1 つしか実行できないためいくつかの制約があります。

たとえば、遷移中にページを操作できない、複数の遷移を同時に実行できない、ポップオーバーのように手前に表示したい要素が隠れるといった問題があります。

[Element-scoped View Transitions](https://drafts.csswg.org/css-view-transitions-2/#scoped-vt) は、`element.startViewTransition()` で View Transition を特定の要素のサブツリーに限定する機能です。この記事では、2 つのリストを同時にアニメーションさせる例を通じて基本的な使い方を紹介します。

!> 2026 年 10 月 10 日現在、Element-scoped View Transitions は [Chrome 147](https://developer.chrome.com/blog/element-scoped-view-transitions) で実装済みです。

## ドキュメント全体の View Transition の課題

まずは従来の `document.startViewTransition()` で何が起きるのかを確認しましょう。以下のように 2 つのリストがあり、それぞれのボタンを押すと先頭の項目を末尾へ移動するアニメーションを実行します。

```html
<section>
  <button type="button" data-list="list1">先頭を末尾へ</button>
  <ul id="list1">
    <li>Apple</li>
    <li>Banana</li>
    <li>Cherry</li>
    <li>Durian</li>
  </ul>
</section>
<section>
  <button type="button" data-list="list2">先頭を末尾へ</button>
  <ul id="list2">
    <li>Red</li>
    <li>Green</li>
    <li>Blue</li>
    <li>Yellow</li>
  </ul>
</section>
<button type="button" popovertarget="popover">ポップオーバーを切り替える</button>
<div id="popover" popover="manual">リストの上に表示されるポップオーバー</div>
```

各 `li` 要素には `view-transition-name: match-element` を指定し、要素ごとに別々のスナップショットとして扱われるようにします。`match-element` は要素の同一性をもとにブラウザが名前を自動で割り当てる値です。`view-transition-class` でクラスを付けると、`*.item` のようにまとめてアニメーションを指定できます。

```css
li {
  view-transition-name: match-element;
  view-transition-class: item;
}

::view-transition-group(*.item) {
  animation-duration: 1s;
}
```

ボタンを押したときに `document.startViewTransition()` のコールバック関数内で DOM を更新します。これにより、ページ全体の遷移が開始されます。

```js
function rotate(list) {
  list.append(list.firstElementChild);
}

for (const button of document.querySelectorAll("[data-list]")) {
  button.addEventListener("click", () => {
    const list = document.getElementById(button.dataset.list);
    document.startViewTransition(() => rotate(list));
  });
}
```

ポップオーバーを開いたまま、左のリストのボタンを押すと、次の動画のような挙動になります。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/7qbp9GRM7BQBw7tkXzw7kl/752f7f88b367d0afd96d0870aa68e7a0/33099600-05bc-4d25-91fc-bbedf0b1eaaa.mov)

この動画では、次の 2 つの問題が起きています。

- 左のリストのアニメーション中に右のボタンをクリックしても、右のリストは変化しない
- 左のリストの項目がポップオーバーの上に描画され、ポップオーバーが隠れる

1 点目は、遷移中の疑似要素ツリーがドキュメントのルート（`html` 要素）に作られることが原因です。`::view-transition` 疑似要素はページ全体を覆い、遷移中のクリック対象はすべて `html` 要素になってしまいます。つまり、遷移中はページ全体がクリック操作できない状態になるのです。

![](https://images.ctfassets.net/in6v9lxmm5c8/3itVo00vhRoq9BfRtu7RcW/7768d4ef6d7a325e8d2c28ace2dedc85/element-scoped-view-transitions-1.png)

2 点目も同じ原因です。`::view-transition` 疑似要素はトップレイヤーを含むページ全体の上に描画されます。`view-transition-name` を持たないポップオーバーはページ全体のスナップショットの一部として扱われ、名前を持つ項目のグループはその上に重ねて描画されるため、ポップオーバーが項目の下に隠れてしまうのです。

また、次の動画のように左のリストのアニメーションが途中で打ち切られてしまうという問題もあります。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/hHoWSKLcrzws5txZVK43b/0c0c8422a846e7fc99862e1ca756b3a1/c1fbb67e-dae6-4708-bb0a-6ef83439195d.mov)

これは、ドキュメントで同時に実行できる View Transition が 1 つだけであることが原因です。2 つ目の遷移を開始した時点で 1 つ目の遷移はスキップされるため、アニメーションが途中で打ち切られ、DOM の更新だけが反映されます。

[Explainer](https://github.com/w3c/csswg-drafts/blob/main/css-view-transitions-2/element-scoped-view-transitions.md) では、このようなドキュメント単位の遷移の問題として次の 4 点を挙げています。

- 独立した要素がお互いを意識せずに同時に遷移できない
- スクロールコンテナーのように、クリップや変形を持つ祖先の中で遷移を描画できない
- 更新処理の間、ページ全体の描画が一時停止する
- 遷移に参加していない要素を遷移の手前に描画できない

## `element.startViewTransition()` で遷移を特定の要素に限定する

Element-scoped View Transitions では、`document` の代わりに任意の要素で `startViewTransition()` を呼び出します。先ほどのコードを以下のように変更します。

```diff
 for (const button of document.querySelectorAll("[data-list]")) {
   button.addEventListener("click", () => {
     const list = document.getElementById(button.dataset.list);
-    document.startViewTransition(() => rotate(list));
+    list.startViewTransition(() => rotate(list));
   });
 }
```

`startViewTransition()` を呼び出した要素はスコープ（または遷移ルート）と呼ばれます。スコープを指定すると、ブラウザは次のように動作します。

- スナップショットを取得する要素（`view-transition-name` を持つ要素）をスコープのサブツリーから探す
- 更新処理の実行中に描画を一時停止するのはスコープのサブツリーだけになる
- `::view-transition` 疑似要素ツリーを `html` 要素ではなくスコープの要素に作る

また、スコープの要素自身にも自動で `view-transition-name: root` が適用され、スコープ自体も遷移に参加します。スコープの要素をスナップショットの対象にしたくない場合は、`view-transition-name: none` を指定してオプトアウトできます。

!> 遷移中のスコープには、要素の内側に独立したレイアウトの境界を作る[レイアウト封じ込め](https://drafts.csswg.org/css-contain-2/#layout-containment)が自動適用されます。通常の `display: inline` の `span` など、レイアウト封じ込めが成立しない要素では遷移を開始できません。

引数や戻り値は `document.startViewTransition()` と同じです。`ViewTransition` オブジェクトの `transitionRoot` プロパティは `html` 要素ではなくスコープの要素を返すという違いがあります。

```js
const transition = list.startViewTransition(() => rotate(list));
console.log(transition.transitionRoot); // <ul id="list1">
```

`list.startViewTransition` を使用したバージョンでは、次の動画のように 2 つのリストを同時にアニメーションさせることができます。また、ポップオーバーはリストの上に表示されたままです。

!v(https://videos.ctfassets.net/in6v9lxmm5c8/7pvsiVMBgNXIB535VJq0na/a2fdfcd301c082c4a152503143840686/737600c5-a1d5-4b83-ab5f-3bef0cc943d1.mov)

!> 同時に実行できるのは、スコープが異なる遷移だけです。同じ要素で遷移の実行中に再び `startViewTransition()` を呼び出すと、実行中の遷移はスキップされ、新しい遷移に置き換えられます。例えば左のリストのボタンを素早く 2 回押すと、1 回目のアニメーションは途中で打ち切られます。

Chrome の Developer Tools を見ると、確かに `::view-transition` 疑似要素ツリーはスコープに指定した `ul` 要素の中に作られていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Ryys6NDO96QMCLxlvXi3f/b43b3956a7b0258286f9de2fb11cd767/element-scoped-view-transitions-2.png)

## 名前の衝突を防ぐ `view-transition-scope` プロパティ

`view-transition-name` はドキュメント内で一意である必要があります。同じコンポーネントが 1 ページに複数配置されると、名前が衝突して遷移がスキップされてしまいます。基本的には `match-element` のようにブラウザが自動で名前を割り当てる値を使うことで衝突を避けられますが、ライブラリのコンポーネントのように自分で制御できない場合もあるでしょう。

[`view-transition-scope`](https://drafts.csswg.org/css-view-transitions-2/#view-transition-scope-prop) プロパティは、`view-transition-name` が見つかる範囲を要素のサブツリーに限定します。値は `none`（初期値）と `all` の 2 つです。

```css
.card-list {
  view-transition-scope: all;
}
```

`all` を指定した要素の外側で開始した遷移は、その要素とその子孫の `view-transition-name` を見つけられなくなります。CSS アンカー配置の `anchor-scope` プロパティと同様の考え方です。

スコープを指定した遷移の実行中は、スコープの要素に自動で `view-transition-scope: all` が適用されます。

## まとめ

- `document.startViewTransition()` による遷移中はページ全体を `::view-transition` が覆い、クリック対象はすべて `html` 要素になるため、ページ内の別の要素を操作できないという問題がある
- `document.startViewTransition()` による遷移はドキュメント全体で 1 つしか実行できず、2 つ目の遷移を開始すると 1 つ目は途中で打ち切られる
- `element.startViewTransition()` を呼び出すと、その要素がスコープとなり、スナップショットの取得、描画の一時停止、疑似要素ツリーがスコープ内に限定される
- `view-transition-scope: all` は `view-transition-name` を探す範囲を要素のサブツリーに限定し、遷移中のスコープには自動で適用される

## 参考

- [CSS View Transitions Module Level 2 — Scoped View Transitions](https://drafts.csswg.org/css-view-transitions-2/#scoped-vt)
- [Element-Scoped View Transitions Explainer](https://github.com/w3c/csswg-drafts/blob/main/css-view-transitions-2/element-scoped-view-transitions.md)
- [Run concurrent and nested view transitions with element-scoped view transitions | Chrome for Developers](https://developer.chrome.com/docs/css-ui/view-transitions/element-scoped-view-transitions)
- [Chrome 147 enables concurrent and nested view transitions with element-scoped view transitions | Chrome for Developers](https://developer.chrome.com/blog/element-scoped-view-transitions)
- [[css-view-transitions-2] Element-scoped view transitions · Issue #9890 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/9890)
- [Intent to Prototype: Scoped view transitions](https://groups.google.com/a/chromium.org/g/blink-dev/c/AGligmIYZfM/m/1czQfry5AQAJ)
- [Element: startViewTransition() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/startViewTransition)
