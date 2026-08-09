---
id: jU8eLDWt3-kRqvV1-r20z
title: "`aria-actions` 属性で要素に関連する操作を支援技術へ伝える"
slug: "aria-actions-attribute"
about: "`aria-actions` 属性は、ある要素に対して実行できる操作を提供する別のインタラクティブ要素を関連付けるための WAI-ARIA のプロパティです。この記事では、メール一覧の各項目と「既読にする」「スターを付ける」「削除する」ボタンを関連付ける例を使い、`aria-actions` が解決する問題と使い方を紹介します。"
createdAt: "2026-08-09T15:00+09:00"
updatedAt: "2026-08-09T15:00+09:00"
tags: ["アクセシビリティ", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7pFI6TdLQvho2K66w7RbWX/e5d1129d9979b94a9242ded45b4ab81e/sashimi_ika_15581-768x591.png"
  title: "イカのお刺身のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`aria-actions` 属性が支援技術へ伝える情報として正しいものはどれですか？"
      answers:
        - text: "要素をクリックしたときに実行する JavaScript 関数"
          correct: false
          explanation: "`aria-actions` は JavaScript 関数を指定する属性ではありません。クリックイベントなどの処理は別途実装する必要があります。"
        - text: "現在の要素と、その要素に関連する操作を提供する別の要素との関係"
          correct: true
          explanation: "`aria-actions` は、参照元の要素と副次的な操作を提供するインタラクティブ要素との関係を支援技術へ伝えます。"
        - text: "複合ウィジェット内で次にフォーカスする要素の順序"
          correct: false
          explanation: "フォーカス順序を定義する属性ではありません。複合ウィジェットのフォーカス管理は別途実装します。"
        - text: "操作を実行した後に表示するステータスメッセージ"
          correct: false
          explanation: "操作結果の通知内容を指定する属性ではありません。記事では、操作結果の管理も実装側の責任と説明されています。"
    - question: "複数の操作ボタンを `aria-actions` で関連付けるには、属性値をどのように指定しますか？"
      answers:
        - text: "ボタンのアクセシブルな名前をカンマで区切って指定する"
          correct: false
          explanation: "属性値にはアクセシブルな名前ではなく、参照先要素の `id` を指定します。"
        - text: "ボタンの CSS セレクターをカンマで区切って指定する"
          correct: false
          explanation: "`aria-actions` は CSS セレクターを受け取る属性ではありません。"
        - text: "ボタンの DOM 上の順番を数値の配列として指定する"
          correct: false
          explanation: "DOM 上の位置を数値で指定する仕組みではありません。参照先は `id` によって特定します。"
        - text: "ボタンの `id` を空白で区切って指定する"
          correct: true
          explanation: "`aria-actions` の値は ID 参照リストであり、複数の参照先の `id` を空白区切りで指定します。"
    - question: "`aria-actions` から参照される操作要素が満たす必要のある要件はどれですか？"
      answers:
        - text: "アクセシブルな名前を持ち、`click` イベントに応答し、キーボードから利用できる"
          correct: true
          explanation: "記事では、アクセシブルな名前、`click` イベントへの応答、直接のキーボード移動またはショートカットが必要と説明されています。"
        - text: "参照元の要素の子孫として配置し、マウス操作だけで利用できる"
          correct: false
          explanation: "参照先は参照元の子孫である必要がなく、キーボードからも利用できなければなりません。"
        - text: "画面上では非表示にし、支援技術からのみ利用できるようにする"
          correct: false
          explanation: "記事では、参照元にフォーカスがあるときに関連する操作を表示し、実行可能にすることが推奨されています。"
        - text: "`keyup` または `touchend` イベントだけで動作するようにする"
          correct: false
          explanation: "特定の入力方法に限定せず、支援技術が呼び出せる `click` イベントに応答する必要があります。"
published: true
---

!> 2026 年 8 月現在、`aria-actions` 属性は WAI-ARIA 1.3 への追加が提案されている段階であり、仕様は確定していません。Firefox はすでに実装済みで、Chrome 151 では Windows、macOS、Linux で利用でき、Safari はフラグを有効にすることで試せます。ただしブラウザと支援技術の組み合わせによっては動作しない可能性があります。実際のプロダクトで使用する場合は、通常のキーボード操作をフォールバックとして提供したうえで、対象とする環境で検証してください。

`aria-actions` 属性は、タブの「閉じる」ボタンやメールの「削除」ボタンのような、項目に付随する副次的な操作を、支援技術を利用するユーザーが発見して実行できるようにするために提案されました。

Web アプリケーションでは、一覧の項目が主な操作とは別の操作を持つ UI がよく使われます。例えばメールアプリでは、メールを選択すると本文が開きます。それとは別に、各メールに対して「既読にする」「スターを付ける」「削除する」といった操作を行えます。これらの操作は、メールの件名や差出人と同じ行にアイコンとして表示されることが多く、マウスカーソルを重ねるとボタンが表示されるという UI パターンを目にした経験があるのではないでしょうか。

![](https://images.ctfassets.net/in6v9lxmm5c8/1IOaZf0Bg1XaREJf8fvewW/3d8bc099628dca2cb9eeb1995dbfc11e/image.png)

画面を見ながら操作するユーザーは、メールと同じ行に並んだアイコンや、メールにマウスカーソルを重ねたときに表示されるボタンから、どのような操作ができるのかを把握できます。ボタンの位置や見た目から、その操作がどのメールに対するものなのかも判断できます。

一方スクリーンリーダーを利用するユーザーは、アクセシビリティツリーを通じて UI を理解します。メール項目にフォーカスすると差出人や件名、選択状態は読み上げられますが、DOM 上で離れた場所に操作ボタンがあっても、その存在やメールとの関係は伝わりません。ボタンまで移動して初めて操作があることに気づいたとしても、それがどのメールに対する操作なのか判断できない可能性があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/42JhQFTFr3nlLCzVwV9RmK/246c17a76647560ce8dbbf51b9f17994/image.png)

つまり、視覚的にはボタンの配置によって表現されている関係が、アクセシビリティツリーには存在していないことが問題です。

同じような例として、タブの「閉じる」、ファイル一覧の「共有」や「お気に入り」、オンライン会議の参加者一覧にある「ミュート」などが挙げられます。このような操作は、項目を選択するという主な操作と区別して「副次的な操作」と呼ばれます。

![](https://images.ctfassets.net/in6v9lxmm5c8/rqAqYlT92GKNTjJXmehIw/162296765a83296a30d552a323a0061a/image.png)

2021 年 3 月に W3C の ARIA リポジトリへ投稿された [Secondary actions on items in composite widget roles](https://github.com/w3c/aria/issues/1440) では、この UI パターンを既存の ARIA で表現する難しさが報告されました。この Issue の中でいくつかの解決策が議論されましたが、どれも問題を抱えていました。

例えば、操作ボタンを `role="option"` や `role="tab"` の内側に配置する方法があります。これであれば DOM の構造から支援技術は、ボタンがどの項目に関連するのかを判断できます。

```html
<div role="listbox" aria-label="受信トレイ">
  <div role="option" tabindex="0" aria-selected="true">
    <span>明日のミーティングについて</span>
    <button aria-label="既読にする">...</button>
    <button aria-label="スターを付ける">...</button>
    <button aria-label="削除する">...</button>
  </div>
</div>
```

しかし、リストに使われる `role="option"` やタブに使われる `role="tab"` は[子孫をプレゼンテーショナルとして扱うロール](https://www.w3.org/WAI/ARIA/apg/practices/hiding-semantics/#roles-that-automatically-hide-semantics-by-making-their-descendants-presentational:~:text=%3C/div%3E-,Roles%20That%20Automatically%20Hide%20Semantics%20by%20Making%20Their%20Descendants%20Presentational,-There%20are%20some)です。例えば `tab` の内側に見出しを配置しても、見出し要素は `role="presentation"` として扱われ、支援技術からは見出しとして認識されないのです。

```html
<div role="tablist">
  <div role="tab" aria-selected="true">
    <h2>タブ 1</h2>
  </div>
  <!-- 以下と同等の扱い -->
  <div role="tab">
    <h2 role="presentation">タブ 1</h2>
  </div>
</div>
```

フォーカス可能な `<button>` では、Presentational Roles Conflict Resolution により、ユーザーエージェントは継承された `role="presentation"` を無視してボタンをアクセシビリティツリーに公開します。しかし、インタラクティブな要素を複合ウィジェットの項目に入れ子にすると、矢印キーと Tab キーによるフォーカス管理が複雑になります。

副次的な操作をコンテキストメニューに複製する方法も使われていました。しかし Issue の報告では、コンテキストメニューは十分に発見されず、視覚的に表示されているボタンへキーボードで直接移動できることをユーザーが期待していたと説明されています。

つまり、既存の ARIA には「このボタンを操作すると、現在の項目に対する処理が実行される」という関係を表す方法がありませんでした。この問題を解決し、項目と副次的な操作を提供する要素を関連付けるために `aria-actions` が提案されたのです。この記事では `aria-actions` の使い方について、メール一覧の例を使って紹介します。

## `aria-actions` 属性とは

`aria-actions` 属性には、関連する操作を提供する要素の `id` を指定します。値の型は ID 参照リストなので、複数の要素を空白で区切って指定できます。`aria-labelledby` や `aria-describedby` と同じような指定方法ですね。

複合ウィジェットの項目専用の属性ではありません。`caption`、`code`、`generic`、`paragraph`、`strong`、`time` などのテキストレベルのロールを除いた、ほぼすべての要素で使用できます。ダイアログの「閉じる」ボタンや、テーブルの行に対する操作を関連付けることもできます。

```html
<div role="listbox" aria-label="受信トレイ">
  <div
    id="message-1"
    role="option"
    tabindex="0"
    aria-selected="true"
    aria-actions="toggle-read toggle-star delete-message"
  >
    明日のミーティングについて
  </div>
</div>

<button id="toggle-read">既読にする</button>
<button id="toggle-star">スターを付ける</button>
<button id="delete-message">削除する</button>
```

この例では、`role="option"` のメール項目と 3 つのボタンを関連付けています。ボタンはメール項目の子孫である必要はなく、DOM 上で離れた場所に配置されていても、`id` を参照することで関係を表せます。Chrome DevTools の Accessibility パネルでは、メール項目の `actions` プロパティに 3 つのボタンが参照されていることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3ctzqcU90OZJ7EfKxz4NVv/bb6075162ac67a4cb993e2370ecbef71/image.png)

`aria-actions` の役割はあくまで関係を支援技術へ伝えることです。この属性を指定しても、クリックイベントやキーボード操作が自動的に実装されるわけではありません。対応する支援技術は、メール項目にフォーカスがある状態で、利用可能な操作を提示して呼び出せます。操作を呼び出した後のフォーカスの扱いは仕様で議論中であるため、特定の挙動に依存しないようにしてください。macOS の VoiceOver で試してみましょう。メール項目にフォーカスすると、アクションメニューが利用可能であることが VoiceOver によって通知されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4jyC6NTCSMlSmwQHuRNntI/a26c4be39521e15ab55699298cd68e0a/image.png)

`Ctrl + Option + Command + Space` でアクションメニューを開くと、関連する操作の一覧として「既読にする」「スターを付ける」「削除する」と表示されます。操作を選択すると、参照先のボタンがクリックされたのと同じ処理が実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6JklqXzVg3TO9W0bC3Hi3E/940e08d021aa7cd624978f2568d69a64/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/1Jv5VNdOHrqm3OBJhbWrZt/94d975a3f7742481938141bc2b2847f2/image.png)

以下のデモから実際に操作を試すことができます。Firefox または Chrome 151 以降で実行してください。

<iframe height="300" style="width: 100%;" scrolling="no" title="aria-actions-example" src="https://codepen.io/azukiazusa1/embed/yygwxEG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/yygwxEG">
  aria-actions-example</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>


## 参照先の要素が満たす要件

`aria-actions` の[仕様案](https://pr-preview.s3.amazonaws.com/w3c/aria/pull/1805.html#aria-actions)では、`aria-actions` から参照される要素について以下の要件が定められています。

- アクセシブルな名前を持つこと（MUST）
- `click` イベントによって動作すること（MUST。支援技術が操作するときに、参照先の要素に対するクリックとして処理を呼び出せるようにするため）
- キーボードで直接移動できるか、参照元にフォーカスがあるときに使用できるキーボードショートカットを提供すること（MUST）
- 参照元に DOM フォーカスがあるとき、関連する操作を表示して実行可能にすること（SHOULD。ホバーしたときに表示されるのではなく、フォーカスしているときもボタンが利用できることが求められている）

MUST の要件が満たされていない場合、ユーザーエージェントは `aria-actions` をアクセシビリティ API に公開してはいけないとされています。属性の値が正しいだけでは不十分で、参照先の操作自体をアクセシブルに実装する必要があります。

### キーボードの要件について

3 つ目のキーボードの要件は、[フォーカスの管理](https://pr-preview.s3.amazonaws.com/w3c/aria/pull/1805.html#managingfocus)の節でより具体的に定められています。参照先の要素は以下のいずれかを満たす必要があります。

- Tab キーの順序に含まれている
- 複合ウィジェットのフォーカス管理を通じて到達できる
- 参照元にフォーカスがあるときの代替手段が文書化されている

つまり `<button>` を置けば必ず要件を満たすというわけではありません。`listbox` や `tablist` のような複合ウィジェットはウィジェット全体で 1 つのタブストップとして扱われるため、内側に `tabindex="0"` の `<button>` を置くと、ローミング tabindex による本来のフォーカス管理が壊れてしまいます。

:::note
ローミング tabindex は、複合ウィジェット全体を 1 つのタブストップとして扱うためのフォーカス管理の手法です。子要素のうち `tabindex="0"` を持つものを常に 1 つだけにして、残りは `tabindex="-1"` とし、矢印キーの操作に合わせて `tabindex="0"` を移動させます。詳しくは [Keyboard Interface - ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex) を参照してください。
:::

ARIA Authoring Practices Guide のタブのサンプルでは、操作ボタンに `tabindex="-1"` を指定したうえで、タブと同じフォーカス管理の対象に含めることでこの要件を満たしています。

```html
<div class="tab-wrapper">
  <button
    id="tab-1"
    role="tab"
    aria-selected="true"
    aria-controls="tabpanel-1"
    aria-actions="tab-1-action"
  >
    Nurse shark
  </button>
  <!-- tab の子孫ではなく兄弟として配置し、矢印キーによるフォーカス管理に含める -->
  <button id="tab-1-action" tabindex="-1" aria-label="Actions for Nurse shark tab">
    ...
  </button>
</div>
```

## JavaScript から参照先を取得する

DOM API から参照先を取得する `ariaActionsElements` プロパティも利用できます。開発者ツールのコンソールで以下のコードを実行すると、3 つのボタンが返されます。

```javascript
document
  .querySelector("#message-1")
  .ariaActionsElements.map((element) => element.id);
// ["toggle-read", "toggle-star", "delete-message"]
```

## 現時点ではフォールバックが必要

`aria-actions` は[WAI-ARIA 1.3 への追加を提案する Pull Request](https://github.com/w3c/aria/pull/1805)で議論されており、2026 年 8 月時点の WAI-ARIA 1.3 Working Draft にはまだ含まれていません。ブラウザの実装が先行している状態です。[ARIA Authoring Practices Guide のサンプル](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-actions/)にも、将来の仕様を検討するための実験的な内容であり、本番環境で使用しないよう注意書きがあります。

現時点で試す場合には、以下の点が重要です。

- 操作ボタンを視覚的にも表示する
- ボタンを Tab キーか複合ウィジェットのフォーカス管理のどちらかで到達できるようにする
- 複合ウィジェット本来のキーボード操作を実装する
- 操作結果とフォーカスを適切に管理する
- ブラウザと支援技術の両方を組み合わせてテストする

`aria-actions` は既存の操作を置き換えるものではなく、操作対象と操作要素の関係を支援技術へ追加で伝えるプログレッシブエンハンスメントとして扱うのがよいでしょう。

## まとめ

- `aria-actions` は、現在の要素に関連する操作を提供する別のインタラクティブ要素を ID 参照リストで関連付けるプロパティ
- 複合ウィジェットの項目に操作ボタンを入れ子にせず、項目と副次的な操作の関係を支援技術へ伝えられる
- 対応する支援技術は、参照元にフォーカスがある状態で操作の一覧を提示し、参照先の操作を呼び出せる
- 参照先にはアクセシブルな名前、`click` イベントへの応答、キーボードから到達できることが必要。複合ウィジェット内では `tabindex="-1"` としてフォーカス管理に組み込む
- Firefox と Chrome 151 は実装済みだが仕様は提案段階なので、通常のキーボード操作をフォールバックとして残す

## 参考

- [`aria-actions` property - WAI-ARIA 1.3 proposal](https://pr-preview.s3.amazonaws.com/w3c/aria/pull/1805.html#aria-actions)
- [Experimental Example of Tabs with Action Buttons - ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-actions/)
- [Secondary actions on items in composite widget roles - w3c/aria#1440](https://github.com/w3c/aria/issues/1440)
- [aria-actions: handling focus when actions are synthetically triggered · Issue #2691 · w3c/aria](https://github.com/w3c/aria/issues/2691)
- [Intent to Ship: aria-actions - blink-dev](https://groups.google.com/a/chromium.org/g/blink-dev/c/DNE6dB1AS0Y)
- [aria-actions - mozilla/standards-positions#1422](https://github.com/mozilla/standards-positions/issues/1422)
- [aria-actions - WebKit/standards-positions#686](https://github.com/WebKit/standards-positions/issues/686)
- [[aria-actions] Expose to macOS via accessibilityCustomActions - Chromium](https://chromium.googlesource.com/chromium/src/+/fe51168362888521d066c079c65b6857d934573e%5E%21/)
