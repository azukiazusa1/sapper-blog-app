---
id: W0Mn026m0wJ_FAnrkxf7T
title: "命令的な方法で支援技術に通知する `ariaNotify()` メソッド"
slug: "aria-notify-method"
about: "`ariaNotify()` メソッドは、支援技術を使用しているユーザーに対して、動的なコンテンツの更新を通知するための命令的な方法を提供する Web API です。従来の WAI-ARIA の仕様では宣言的な属性を使用して支援技術に情報を伝える方法が一般的でしたが、`ariaNotify()` メソッドは JavaScript を使用して、特定のタイミングで支援技術に通知を送ることができるという点が特徴です。"
createdAt: "2026-04-21T20:04+09:00"
updatedAt: "2026-04-21T20:04+09:00"
tags: ["Web API", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1z5Uwhp5WNxRofatcykwXT/70e20696e3e65d27879cc64d6552f9d8/egg-tart_23461-768x591.png"
  title: "エッグタルトのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "記事によると、`ariaNotify()` メソッドが戻り値を返さない「書き込み専用」API として意図的に設計されている理由はどれですか?"
      answers:
        - text: "複数回呼び出したときに通知が競合するのを防ぐため"
          correct: false
          explanation: "複数回呼び出しの挙動については「最新の通知のみが読み上げられる可能性が高い」と説明されていますが、戻り値を持たない理由としては挙げられていません。"
        - text: "支援技術がインストールされているかを検出するフィンガープリントとして悪用されるのを防ぐため"
          correct: true
          explanation: "記事で明言されている通り、戻り値から通知が行われたかどうかを取得できない設計は、フィンガープリントとしての悪用を防ぐための判断です。"
        - text: "ブラウザの JavaScript エンジンのパフォーマンス低下を避けるため"
          correct: false
          explanation: "パフォーマンスへの配慮は記事中で設計理由として挙げられていません。"
        - text: "古いバージョンの支援技術との後方互換性を保つため"
          correct: false
          explanation: "後方互換性を理由として挙げている記述は記事にはありません。"
    - question: "記事の説明に従うと、`document.ariaNotify(message, { priority: \"normal\" })` は、従来の `aria-live` 属性のどの値とほぼ同等の意味になりますか?"
      answers:
        - text: "`aria-live=\"assertive\"`"
          correct: false
          explanation: "`aria-live=\"assertive\"` とほぼ同等なのは `priority: \"high\"` です。`\"normal\"` と取り違えないよう注意が必要です。"
        - text: "`aria-live=\"off\"`"
          correct: false
          explanation: "`aria-live=\"off\"` は通知を行わない設定であり、`priority: \"normal\"` の説明とは一致しません。"
        - text: "`aria-live=\"polite\"`"
          correct: true
          explanation: "記事では `priority: \"normal\"` が `aria-live=\"polite\"` に、`priority: \"high\"` が `aria-live=\"assertive\"` にほぼ対応すると説明されています。"
        - text: "`aria-atomic=\"true\"`"
          correct: false
          explanation: "`aria-atomic` は通知領域内の変更を丸ごと読み上げるかどうかを指定する別の属性で、`priority` と同等ではありません。"
    - question: "`ariaNotify()` で送られた通知を支援技術が読み上げる際の言語決定について、記事ではどのように説明されていますか?"
      answers:
        - text: "通知メッセージのテキスト内容から自動的に言語が判定される"
          correct: false
          explanation: "テキストからの自動判定については記事では触れられていません。"
        - text: "`<html>` 要素の `lang` 属性を参照し、設定されていなければブラウザの言語設定を参照する"
          correct: true
          explanation: "記事で明記されている通り、まず `<html>` 要素の `lang` 属性が参照され、ない場合はユーザーのブラウザの言語設定にフォールバックします。"
        - text: "`ariaNotify()` の第 2 引数に `lang` オプションを渡して明示的に指定する必要がある"
          correct: false
          explanation: "記事で紹介されている第 2 引数のオプションは `priority` であり、`lang` オプションの存在は説明されていません。"
        - text: "常にオペレーティングシステムの言語設定が優先される"
          correct: false
          explanation: "OS の言語設定が最優先されるとは記事で述べられておらず、実際には `<html>` の `lang` 属性が優先されます。"
    - question: "記事の説明によると、`ariaNotify()` を短時間に複数回呼び出した場合、一般的にどのような挙動になると述べられていますか?"
      answers:
        - text: "呼び出されたすべての通知が必ず順番にキューイングされて読み上げられる"
          correct: false
          explanation: "順番に読み上げる支援技術もあると紹介されていますが、それは仕様として保証されているものではないと記事で注意されています。"
        - text: "最新の通知のみが読み上げられる可能性が高く、1 回の呼び出しにまとめる方が確実"
          correct: true
          explanation: "記事の通り、通常は最新の通知のみが読み上げられるため、複数回呼び出すよりも 1 回にまとめる方が確実に伝わるとされています。"
        - text: "2 回目以降の呼び出しは例外を投げ、通知は送信されない"
          correct: false
          explanation: "連続呼び出しで例外が発生するという記述は記事にありません。"
        - text: "最初に呼ばれた通知のみが読み上げられ、以降は無視される"
          correct: false
          explanation: "最初の通知が優先されるのではなく、「最新の通知のみが読み上げられる可能性が高い」と記事では説明されています。"
published: true
---
`ariaNotify()` メソッドは、支援技術を使用しているユーザーに対して、動的なコンテンツの更新を通知するための命令的な方法を提供する Web API です。従来の WAI-ARIA の仕様では `aria-label="xxx"` や `aria-checked="true"` のように宣言的な属性を使用して支援技術に情報を伝える方法が一般的でしたが、`ariaNotify()` メソッドは JavaScript を使用して、特定のタイミングで支援技術に通知を送ることができるという点が特徴です。

`ariaNotify()` メソッドは、以下のようなシナリオで使用されることが想定されています。

- チャットアプリで新しいメッセージが届いたときに通知する（特に、AI チャットのように生成が完了してから通知したい場合）
- ビデオ会議アプリで、参加者が入室したときや退出したときに通知する
- カートに商品を追加したとき、視覚に障害がないユーザーはカートのアイコンの変化で気づけるが、支援技術を使用しているユーザーには通知が必要
- 書式変更（Ctrl+B で太字にするなど）のように DOM の変更に紐づかないイベント
- SPA（Single Page Application）で画面遷移したとき、新しいページの内容を支援技術に通知する

従来は上記のようなユースケースで、開発者は `aria-live` 属性を持つ要素を DOM に追加して、支援技術に通知を送る方法が一般的でした。商品をカートに追加する例であれば、以下のようなコードが考えられます。

```html
<!-- aria-live="polite" は支援技術に対して、内容が更新されたときにユーザーに通知するよう指示する属性 -->
<!-- ユーザーの操作に割り込んで通知する必要がある場合は別途 aria-live="assertive" 要素を用意する -->
<div
  id="live-region"
  role="status"
  aria-live="polite"
  aria-atomic="true"
  class="visually-hidden"
></div>

<button id="add-btn">カートに追加</button>

<style>
  /* visually-hidden は視覚的に非表示にするためのクラス */
  /* display: none; は支援技術からも要素が見えなくなってしまうため、position: absolute; などで画面外に配置する方法が一般的 */
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
</style>

<script>
  const liveRegion = document.getElementById("live-region");

  function announce(message) {
    // 同じ文字列を続けて入れても再読み上げされない問題への対策で
    // 一度クリアしてから setTimeout で入れ直すハック
    liveRegion.textContent = "";
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  document.getElementById("add-btn").addEventListener("click", () => {
    // ...カートに追加する処理...
    announce("商品をカートに追加しました。3点。");
  });
</script>
```

上記のコードでは、`aria-live="polite"` を持つ要素を用意して、JavaScript の `announce` 関数で内容を更新することで、支援技術に通知を送っています。しかし、この方法はいくつかの問題がありました。

- 視覚的に非表示な要素を用意する必要や、ハックに頼った実装が必要であるなど、実装の複雑さが増す
- DOM を更新してもその変更が支援技術に正しく伝わらない場合があった。たとえば、サイト全体で共通の live region を DOM の末尾に配置してシングルトン的に運用していると、モーダルダイアログを開いた状態では通知が届かないことがある。また live region の実装自体がブラウザやスクリーンリーダーで一貫しておらず、同じコードでも環境によって挙動が変わるという問題もある（詳細は [Improving Notification Handling with AriaNotify](https://www.w3.org/2025/Talks/aria-notify-breakouts-2025.pdf) を参照）
- `polite` と `assertive` の通知のタイミングは支援技術の実装に依存しており、意図したタイミングで通知が行われないことがあった

`ariaNotify()` メソッドは、これらの問題を解決するために設計されました。JavaScript を使用して、特定のタイミングで支援技術に通知を送ることができるため、より柔軟で確実な方法で動的なコンテンツの更新を伝えることができます。

この記事では、`ariaNotify()` メソッドの使い方について、実装例や注意点を交えて解説していきます。

## `ariaNotify()` メソッドの使い方

`ariaNotify()` メソッドは `Element.prototype` に定義されているため、任意の要素から呼び出すことができます。`Document` も `ParentNode` として同じインターフェイスを共有するため、以下のように `document` から呼び出すのが最も簡単です。

```javascript
document.ariaNotify("いぶきさんが入室しました。");
```

このコードを実行すると、支援技術を使用しているユーザーに対して「いぶきさんが入室しました。」という通知が送られます。`ariaNotify()` メソッドは意図的に書き込み専用の API として設計されており、戻り値から通知が行われたかどうかを取得できません。これはフィンガープリントとして悪用されるのを防ぐための設計判断です。

支援技術によっては複数回の `ariaNotify()` が行われたとき、順番に読み上げるものもありますが、保証されている仕様ではありません。通常は最新の通知のみが読み上げられるため、複数回呼び出すよりも 1 回呼び出す方が確実に通知が伝わります。

```javascript
// 連続して呼び出すと、最後の通知のみが読み上げられる可能性が高い
document.ariaNotify("商品をカートに追加しました");
document.ariaNotify("3点。");

// 1 回の呼び出しでまとめる方が確実
document.ariaNotify("商品をカートに追加しました。3点。");
```

:::warning
過剰に `ariaNotify()` を呼び出すと、支援技術を使用しているユーザーにとって煩わしい体験になる可能性があるため注意してください。
:::

### 通知の優先度を指定する

第 2 引数のオプションで、通知の優先度を指定できます。`priority: "high"` と `priority: "normal"`（デフォルト）の 2 種類があり、それぞれ `aria-live="assertive"` と `aria-live="polite"` とほぼ同等の意味になります。

```javascript
// 優先度を指定して通知する例
document.ariaNotify("エラーが発生したため、データが保存できませんでした。", {
  priority: "high",
});
```

:::warning
`priority: "high"` を使用すると、ユーザーの操作を中断して通知が読み上げられる可能性があるため、重要な情報を伝える場合にのみ使用してください。ユーザーが頻繁に操作を中断されると、支援技術を使用しているユーザーにとってストレスになる可能性があります。
:::

### 言語の選択

支援技術が `ariaNotify()` で送られた通知を読み上げる際は、`<html>` 要素の `lang` 属性を参照します（読み上げ時のアクセントや発音などに影響します）。もし `lang` 属性がない場合は、ユーザーのブラウザの言語設定を参照します。したがって、特定の言語で通知を読み上げたい場合は、適切に `lang` 属性を設定しておく必要があります。

```html
<!-- 日本語で通知を読み上げたい場合 -->
<html lang="ja">
  ...
</html>

<script>
  // 日本語のアクセントで読み上げられる
  document.ariaNotify("商品をカートに追加しました。3点。");
</script>
```

## カートに商品を追加する例

`ariaNotify()` メソッドを使用した具体的な例を見てみましょう。冒頭で説明した、商品をカートに追加する例を `ariaNotify()` を使って実装してみます。`aria-live` を使用した従来の方法と比較して、コードがシンプルになっていることがわかります。

```html
<button id="add-btn">カートに追加</button>

<script>
  document.getElementById("add-btn").addEventListener("click", () => {
    // ...カートに追加する処理...
    document.ariaNotify("商品をカートに追加しました。3点。");
  });
</script>
```

macOS の VoiceOver を使用して試してみたところ、以下のように「カートに追加」ボタンをクリックしたタイミングで「商品をカートに追加しました。3 点。」と読み上げられることが確認できました（Chrome Canary 149 で動作を確認）。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/62IQHgq9ENFdPQHbphcHsH/f6f1475158cafbcae81b083bc272afd4/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-23_21.12.17.mov"></video>

## まとめ

- `ariaNotify()` メソッドは、支援技術を使用しているユーザーに対して、動的なコンテンツの更新を通知するための命令的な方法を提供する Web API
- 従来は `aria-live` 属性を持つ要素を DOM に追加して通知を送る方法が一般的だったが、この方法は実装の複雑さや通知のタイミングの不確実性などの問題があった
- `ariaNotify()` メソッドは、JavaScript を使用して特定のタイミングで支援技術に通知を送ることができるため、よりシンプルなコードで通知を伝えることができる
- 通知の優先度を指定できるが、過剰に使用するとユーザーにとって煩わしい体験になる可能性があるため注意が必要

## 参考

- [Accessible Rich Internet Applications (WAI-ARIA) 1.3](https://w3c.github.io/aria/#ARIANotifyMixin)
- [Element: ariaNotify() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element/ariaNotify)
- [WICG/accessible-notifications: ARIA Accessible Notifications](https://github.com/WICG/accessible-notifications)
- [Improving Notification Handling with AriaNotify](https://www.w3.org/2025/Talks/aria-notify-breakouts-2025.pdf)
- [Understanding Success Criterion 4.1.3: Status Messages | WAI | W3C](https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html)
- [aria-live - ARIA | MDN](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)
- [ARIA Notifyについて - Speaker Deck](https://speakerdeck.com/ryokatsuse/aria-notifynituite)
