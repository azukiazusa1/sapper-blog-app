---
id: sFCY3FhT_OTSlTZpFV1J
title: "ストリーミングされるチャット UI の回答をスクリーンリーダーに伝える手法の調査"
slug: "accessible-streaming-chat-ui"
about: "生成 AI のチャット UI では、回答が少しずつ画面に表示されます。このような更新をそのままライブリージョンに入れると、スクリーンリーダーが生成途中の回答を細切れに読み上げることがあります。ChatGPT と Claude、チャット UI ライブラリの実装を調査し、回答本文と状態通知を分離したサンプルを実装します。"
createdAt: "2026-08-11T10:42+09:00"
updatedAt: "2026-08-11T10:42+09:00"
tags: ["アクセシビリティ", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/690k8v3n0hHk9XhusHAYoC/0a23f8cfdbe244e286053550bb867ee3/bird-osprey_23912-768x748.png"
  title: "ミサゴのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ライブリージョンに `aria-atomic=\"true\"` を指定すると、どのような通知になりますか?"
      answers:
        - text: "変更のうち、要素の追加・テキストの変更など、どの種類を通知対象にするかを絞り込む"
          correct: false
          explanation: "これは `aria-relevant` の説明です。`aria-atomic` は通知の種類ではなく、通知する範囲を指定します。"
        - text: "領域の一部だけが変更された場合でも、領域全体を 1 つの単位として通知する"
          correct: true
          explanation: "記事の通りです。検索結果の件数が 1 件から 2 件に変わったとき、`aria-atomic=\"true\"` があれば「検索結果は 2 件です」と全体が読み上げられます。"
        - text: "要素の更新がまだ完了していないことを伝え、完了するまで通知を保留させる"
          correct: false
          explanation: "これは `aria-busy` の説明です。`aria-busy` は更新の完了状態を示す属性で、通知の範囲とは関係ありません。"
        - text: "現在読み上げ中の内容に割り込んで、即座に通知する"
          correct: false
          explanation: "割り込んで通知するのは `aria-live=\"assertive\"` です。記事では、重要な警告など限られた場面でのみ使うべきだと説明されています。"
    - question: "サンプルの `announce()` 関数が `textContent` をいったん空にしてから、少し遅らせてメッセージを設定しているのはなぜですか?"
      answers:
        - text: "`role=\"status\"` の要素は DOM に挿入した直後だと通知されないため"
          correct: false
          explanation: "動的に挿入した `role=\"status\"` が通知されないことがあるのは事実ですが、記事ではその対策として要素を最初から DOM に配置しています。空文字を挟む理由とは別です。"
        - text: "直前とまったく同じ文言を代入すると変更として検出されず、読み上げられないことがあるため"
          correct: true
          explanation: "記事の通りです。スクリーンリーダーはライブリージョンの変更を検出して読み上げるため、一度空文字にしてから設定し直すことで変更として扱われるようにしています。"
        - text: "`aria-atomic=\"true\"` を指定した要素は、一度空にしないと領域全体が読み上げられないため"
          correct: false
          explanation: "`aria-atomic=\"true\"` は変更時に領域全体を 1 つの単位として通知する属性で、事前に空にする必要はありません。"
        - text: "`polite` の通知は、読み上げに割り込まないよう必ず 100 ミリ秒遅らせる必要があるため"
          correct: false
          explanation: "`polite` は読み上げを遮らないタイミングで通知される仕組みで、遅延を自分で入れる必要はありません。記事でも 100 ミリ秒は変更を検出させるための工夫として説明されています。"
published: true
---
生成 AI の登場以降、テキスト入力で AI と対話するチャット UI は身近な存在になりました。従来のチャットではメッセージが完成した状態で追加されることが一般的でしたが、LLM（大規模言語モデル）の回答は数秒から数十秒かけて少しずつ画面に表示されます。

画面を見ているユーザーは文字が増えていく様子から、回答の生成が始まったことや、まだ生成中であることに気づけます。一方、スクリーンリーダーは DOM が更新されたという理由だけで、常にその内容を読み上げるわけではありません。何も対応しなければ回答が始まったことに気づくことができず、完了したことも伝わりません。

スクリーンリーダーなどの支援技術に動的にコンテンツが追加されたことを通知するには、[ARIA ライブリージョン](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Guides/Live_regions)を使用するのが一般的です。しかし、実装の方法を誤ると、生成途中の文章が細切れに何度も読み上げられてしまうという問題が発生する恐れがあります。下記の動画では新しいチャンクが追加されるたびにスクリーンリーダーが冒頭の数文字を繰り返し、「ウェウェウェウェ...」と読み上げが止まらなくなっています。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/52VhYuarp0pOwGI9uJOL7C/44ca28d47b9927349124a83313425b45/8057bdae-e934-4ec9-92ae-732ba6d8cf53.mov" controls></video>

この記事ではストリーミングされる回答をスクリーンリーダーへどのように通知するかという観点で既存のサービスやライブラリの実装を調査したうえで、実際にプラクティスを踏まえたサンプルを実装します。

ここでのプラクティスは**ストリーミングされる回答本文そのものは自動通知の対象にせず、「回答を生成しています」「回答が完了しました」といった短い状態メッセージだけを、本文とは別の要素から通知する**というのが基本的な方針です。回答本文と状態通知を分離することで、生成途中のテキストが細切れに読み上げられることを防ぎながら、回答が始まったことと終わったことを伝えられます。

なお、この記事に記載しているスクリーンリーダーの読み上げ結果は、以下の環境で確認したものです。

- macOS 26.5.1
- Google Chrome 151.0.7922.77
- macOS に付属する VoiceOver

## ARIA ライブリージョンとは

チャット UI のように、ユーザーが操作していない間に画面の内容が変化する場合、内容が変化したことを何らかの方法でユーザーに伝える必要があります。スクリーンリーダーへ動的な変更を通知する仕組みとして、ARIA ライブリージョンがあります。まずは ARIA ライブリージョンの基本的な使い方を確認しましょう。

まずは基本の `aria-live` 属性です。`aria-live` 属性を指定した要素の内容が変化すると、ブラウザはアクセシビリティ API を通じて支援技術へ変更を伝えます。

```html
<!-- JavaScript で動的にコンテンツを更新される想定 -->
<div aria-live="polite"></div>
```

`aria-live` では、主に以下の値を使用します。

- `polite`：ユーザーが現在聞いている読み上げを遮らないタイミングで通知する
- `assertive`：現在の読み上げへ割り込んで通知する
- `off`：要素にフォーカスがある場合などを除き、通常は変更を自動通知しない

頻繁な割り込みは操作を妨げるため、通常の状態通知には `polite` を使用します。`assertive` は即座に伝える必要がある重要な警告など、限られた場面で使用するべきです。

ARIA の一部のロールには、暗黙の `aria-live` が定義されています。たとえば [`status` ロール](https://www.w3.org/TR/wai-aria-1.2/#status) は `aria-live="polite"` と `aria-atomic="true"`、[`log` ロール](https://www.w3.org/TR/wai-aria-1.2/#log) は `aria-live="polite"` を暗黙に持ちます。

`aria-atomic="true"` は、ライブリージョンの一部だけが変更された場合にも、その領域全体を 1 つの単位として通知することを示します。たとえば検索結果の件数が 1 件から 2 件に変化した場合、`aria-atomic="true"` が指定されていれば「検索結果は 2 件です」と全体を読み上げます。`aria-atomic="true"` を設定しない場合、単に「2」とだけ読み上げられ、ユーザーは何が 2 なのかを理解できません。

```html
<div role="status" aria-atomic="true">
  検索結果は <span id="result-count">1</span> 件です
</div>

<button id="search">検索</button>

<script>
  const count = document.querySelector("#result-count");
  const search = document.querySelector("#search");

  search.addEventListener("click", () => {
    count.textContent = "2";
  });
</script>
```

## `role="log"` はチャット履歴のためのロール

`log` ロールは、古い情報が消えず、新しい情報が意味のある順序で末尾へ追加される領域を表します。チャット履歴、エラーログ、ゲームログなどが代表例です。

W3C の WCAG Techniques でも、[`role="log"` を使う例としてチャットの会話履歴](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA23)が示されています。つまり、チャット履歴へ `role="log"` を指定すること自体は標準的な方法です。

```html
<div role="log" aria-label="チャット履歴">
  <!-- 新しいメッセージが末尾へ追加される -->
</div>
```

LLM が登場する以前のチャット UI であれば、ユーザーが送信したメッセージは、完成した状態で DOM へ追加されることが一般的でした。`role="log"` を指定するだけで、スクリーンリーダーは新しいメッセージが追加されたことを 1 度だけ通知できます。しかし、LLM が登場してからは、回答が少しずつ生成されるため、ユーザーが送信したメッセージに対する回答用の要素を追加した後、その内部のテキストを何度も変更します。暗黙に `aria-live="polite"` となる `role="log"` の内部で更新を繰り返すと、支援技術が生成途中のテキストまで変更のたびに通知する恐れがあります。

つまり、LLM の登場以降のチャット UI では、`role="log"` を指定するだけでは不十分で、ストリーミングされる回答の通知方法を慎重に設計する必要があるのです。ここからは、実際のサービスやライブラリがどのように実装しているかを確認します。

## ChatGPT の HTML 構造

まずは ChatGPT が会話の生成中にどのような DOM を構築しているのか見ていきましょう。

ChatGPT では会話全体を特定の `role` でラップしていません。ユーザーと ChatGPT の各ターンは `<section>` 要素で表現され、視覚的に隠された `<h4>` で送信者が示されていました。画面上では吹き出しの位置でユーザーのメッセージか AI の回答か判断できますが、スクリーンリーダーは見た目の違いを認識できないため、視覚的に隠されたテキストで送信者が読み上げられるようにしているのだと思われます。

```html
<section data-turn="user">
  <h4 class="sr-only">あなた:</h4>
  <!-- ユーザーのメッセージ -->
</section>

<section data-turn="assistant">
  <h4 class="sr-only">ChatGPT:</h4>
  <!-- ChatGPT の回答 -->
</section>
```

:::note
`sr-only` は画面上では表示せず、スクリーンリーダーからは読み取れる状態にするための CSS クラスです。`display: none` や `hidden` を使用するとアクセシビリティツリーからも削除されるため、1px の領域に切り詰める方法などが使われます。
:::

ChatGPT の回答本文には、`aria-live` や `aria-busy` は指定されていませんでした。つまり、動的に更新される回答本文はスクリーンリーダーへ自動通知されない構成です。回答とは別に、視覚的に隠された `role="status" aria-live="polite" aria-atomic="true"` の要素が配置されています。この要素は、生成中は「考え中」、生成が終わると「回答が完了しました」といったテキストへ更新され、回答の状態を通知します。

```html
<div role="status" aria-live="polite" aria-atomic="true" class="sr-only"></div>

<script>
  const status = document.querySelector('[role="status"]');

  // 回答の生成が始まったとき
  status.textContent = "考え中";

  // 回答の生成が完了したとき
  status.textContent = "回答が完了しました";
</script>
```

実際にスクリーンリーダーで確認すると、フォームをサブミットした後は「考え中」と読み上げられ、生成が完了すると「回答が完了しました」と読み上げられることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6pikr3spDt8RcsmFSBKmon/c9c495b81ee64d44fba1707105fe97fc/94613c83-ad1e-469f-bb38-38d153c1884b.mov" controls></video>

このように ChatGPT では本文自体を通知の対象にせずに、短いテキストで状態を通知する構成になっていました。スクリーンリーダーのユーザーは、回答が完了したことを知った後、任意のタイミングで回答本文を読み進められます。

## Claude の HTML 構造

Claude の会話履歴は [ARIA `feed` パターン](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)を採用していました。`feed` は、ユーザーがスクロールして過去のメッセージを確認できるような、意味のある順序で追加されるコンテンツの集合を表します。

```html
<div role="feed" aria-label="Chat messages">
  <div
    role="article"
    aria-posinset="1"
    aria-setsize="2"
    aria-label="Message 1 of 2"
  >
    <!-- メッセージ -->
  </div>
</div>
```

各メッセージは `role="article"` で、`aria-posinset` と `aria-setsize` により履歴中の位置と総数を表現します。

- `aria-posinset`：その要素が集合の中で何番目にあるかを示す。上記の例では 1 番目のメッセージ
- `aria-setsize`：集合全体にいくつの要素があるかを示す。上記の例では全部で 2 件のメッセージ

DOM 上に存在する要素の数から位置や総数を判断できない場合に、これらの属性で明示します。チャット履歴のように古いメッセージを遅延読み込みする UI では、DOM に一部のメッセージしか存在しないことがあるため、「全 20 件中の 15 件目」のような情報を支援技術へ正しく伝えられます。

生成中の回答には `aria-label="Currently streaming message"` が指定され、生成完了後は `aria-label="Message 2 of 2"` のような名前に変化していました。

Claude も ChatGPT と同様に、各メッセージの先頭へ `sr-only` の見出しを配置して送信者を明示しています。ユーザーのメッセージには「You said」、Claude の回答には「Claude responded」というテキストが使われていました。

```html
<div role="article" aria-label="Message 1 of 2">
  <h2 class="sr-only">You said: 今日は何の日？</h2>
  <!-- ユーザーのメッセージ -->
</div>

<div role="article" aria-label="Message 2 of 2">
  <h2 class="sr-only">Claude responded: 8月11日は山の日です</h2>
  <!-- Claude の回答 -->
</div>
```

画面上ではメッセージの位置や見た目から送信者を区別できますが、その視覚的な違いはスクリーンリーダーには伝わりません。見出しとして送信者を明示することで、誰の発言かを確認できるだけでなく、見出しジャンプを使ってメッセージ間を移動できます。

`feed` は単にスクロールできる一覧へ指定するロールではありません。Claude では「上下矢印キーでメッセージ間を移動できる」というスクリーンリーダー向けの説明があり、各 `article` もフォーカス可能です。`feed` を採用する場合は、このようなフォーカス移動やコンテンツ読み込みの規約まで実装する必要があります。

Claude もストリーミングされる回答本文をライブリージョンにはしていません。別の `role="status"` から、生成開始時に「Claude is responding」、完了時に「Claude finished the response」と通知します。フォーカスは回答完了後も入力欄に残っていました。

ChatGPT と Claude では履歴の構造が異なりますが、以下の 3 点は共通しています。

- ストリーミングされる回答本文を、そのままライブリージョンとして通知しない
- 回答本文とは別の `role="status"` から、短い状態を通知する
- `sr-only` の見出しでユーザーと AI の送信者を区別できるようにする

## チャット UI ライブラリの実装

続いて、チャット UI を構築するためのフロントエンドライブラリがどのような実装になっているのか調査しました。確認したライブラリは以下の 4 つです。

- assistant-ui
- Vercel AI Elements
- CopilotKit
- shadcn/ui Chat Components

実装を確認したうえで、それぞれ VoiceOver と Chrome でスクリーンリーダーの読み上げを検証しました。

### assistant-ui

assistant-ui の[標準 Thread コンポーネント](https://github.com/assistant-ui/assistant-ui/blob/8bba3aaadcae042b4750436e6aa62bbba4815dde/packages/ui/src/components/assistant-ui/thread.tsx)は、履歴と各メッセージを基本的に `<div>` としてレンダリングします。標準テンプレートの回答本文には `role="log"` や `aria-live` は指定されていません。

生成中のドットインジケーターには `aria-label="Assistant is working"` が設定されていますが、この要素自体はライブリージョンではありません。一方、別途提供されている[TypingIndicator コンポーネント](https://github.com/assistant-ui/assistant-ui/blob/8bba3aaadcae042b4750436e6aa62bbba4815dde/packages/ui/src/components/elements/typing-indicator.tsx)は `role="status"` と `aria-label="Assistant is typing"` を使用しています。

つまり、回答が生成中であることはスクリーンリーダーへ通知されますが、回答が完了したことを通知する手段はありません。そのため、スクリーンリーダーのユーザーは回答の生成が終わったことに気づけないという問題があります。

### Vercel AI Elements

Vercel AI Elements の[Conversation コンポーネント](https://github.com/vercel/ai-elements/blob/0c1f5e8c75273f0e95c8faa031544a8aa2bb1a5b/packages/elements/src/conversation.tsx)には `role="log"` が指定されています。そのため、利用者が明示的に `aria-live` を追加しなくても、会話履歴は暗黙に `polite` なライブリージョンになります。

その結果、回答本文がストリーミングされると、スクリーンリーダーは生成途中の文章を細切れに読み上げる可能性があります。

### CopilotKit

CopilotKit は、現行の[v1 Messages コンポーネント](https://github.com/CopilotKit/CopilotKit/blob/bee39139bdaf5184b3590506edc66b8e68738e06/packages/react-ui/src/components/chat/Messages.tsx)と[v2 CopilotChatMessageView](https://github.com/CopilotKit/CopilotKit/blob/bee39139bdaf5184b3590506edc66b8e68738e06/packages/react-core/src/v2/components/chat/CopilotChatMessageView.tsx)を確認しました。

どちらもメッセージ一覧は通常の `<div>` で構成されています。回答のストリーミングに対する `role="log"`、`aria-live`、`role="status"` は確認できませんでした。

スクリーンリーダーへ回答の開始・完了を通知する仕組みは、アプリケーション側で追加する必要があります。

### shadcn/ui Chat Components

shadcn/ui は、2026 年 6 月に[公式の Chat Components](https://ui.shadcn.com/docs/changelog/2026-06-chat-components)を公開しました。

中心となる[MessageScrollerContent](https://github.com/shadcn-ui/ui/blob/d14b6e69a91f0fc99e31a7adb26a48d661df9911/packages/react/src/message-scroller/components.tsx#L221)は、デフォルトで `role="log"` と `aria-relevant="additions"` を設定します。`aria-relevant` は、ライブリージョン内のどの種類の変更を通知対象とするかを指定する属性です。指定できる値は以下のとおりです。

- `additions`：ライブリージョン内に要素ノードが追加された変更を対象とする
- `text`：テキストコンテンツやテキストノードが追加された変更を対象とする
- `removals`：テキストや要素ノードが削除された変更を対象とする
- `all`：`additions removals text` と同じ

`aria-relevant` を指定しない場合の既定値は `additions text` です。つまり、要素ノードの追加とテキストの変更の両方が通知の対象になります。

shadcn/ui があえて `additions` だけを指定しているのは、既定値から `text` を除外するためです。これにより、新しいメッセージ要素が追加されたときは通知の対象になりますが、既存の要素の中身をストリーミングで書き換える変更は対象から外れます。まさにストリーミング回答が細切れに読み上げられる問題を避けるための指定です。

ただし aria-relevant の解釈は支援技術によって異なります。[Accessibility Support](https://a11ysupport.io/tests/tech__aria__aria-relevant) の検証結果によると、既定値である additions text はいずれのスクリーンリーダーでもサポートされている一方、additions 単体の指定は NVDA ではサポートされておらず、VoiceOver と JAWS でも部分的なサポートにとどまります。

また[ストリーミングのサンプル](https://github.com/shadcn-ui/ui/blob/d14b6e69a91f0fc99e31a7adb26a48d661df9911/apps/v4/examples/base/message-scroller-streaming.tsx#L144)では、回答中に `MessageScrollerContent` へ `aria-busy="true"` を指定しています。

`aria-busy` は、要素に対する更新がまだ完了していないことを示します。仕様では、支援技術は `aria-busy="true"` の間の変更を保留し、`false` になった後にまとめて処理できます。ただし、[WAI-ARIA の仕様](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)では支援技術が更新の通知を保留してよいという “MAY” の要件であり、スクリーンリーダーとブラウザの組み合わせで同じ読み上げになるとは限りません。

VoiceOver と Chrome で検証したところ、回答の生成中は読み上げが保留され、生成が完了した後にはじめてまとめて読み上げられることを確認できました。細切れに読み上げるという問題自体は回避できていますが、生成が完了した後に長文をまとめて読み上げられるため、ユーザーの操作を妨げる可能性があります。あまりに過剰な通知はユーザーにとって好ましくありません。[Understanding Success Criterion 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages) も合わせて参照してください。

### ライブラリ調査のまとめ

4 つのライブラリの調査結果を表にまとめると以下のようになります。

| ライブラリ | 履歴のロール | 生成中の通知 | 完了の通知 | 追加で必要な対応 |
| --- | --- | --- | --- | --- |
| assistant-ui | なし（`<div>`） | `role="status"`（TypingIndicator） | なし | 完了を通知する仕組みの追加 |
| Vercel AI Elements | `role="log"` | 回答本文が暗黙に通知される | なし | 履歴の `aria-live="off"` 化と状態通知の分離 |
| CopilotKit | なし（`<div>`） | なし | なし | 開始・完了の通知をすべて追加 |
| shadcn/ui Chat Components | `role="log"` + `aria-relevant="additions"` | `aria-busy="true"` で保留 | 完了後に本文をまとめて読み上げ | 状態通知への置き換えと支援技術ごとの検証 |

このように、ライブラリごとに対応はあまり統一されていません。共通して言えるのは、どのライブラリを選んでも、回答の開始と完了を短いテキストで通知する仕組みはアプリケーション側で用意する必要があるということです。実際にスクリーンリーダーで検証することも重要です。支援技術ごとに挙動が異なる場合があるためです。

## トークンごとに読み上げられた実際の Issue

ストリーミング回答をライブリージョン内で更新した結果、実際に問題となった事例があります。OpenClaw では、`role="log"` と `aria-live="polite"` を持つチャット履歴の中で回答をストリーミングしていました。その結果、NVDA と Firefox の組み合わせで、[回答がトークンやチャンクごとに読み上げられる Issue](https://github.com/openclaw/openclaw/issues/65538)が報告されています。読み上げを停止しても次の更新で再開され、回答中は UI を使用することが難しい状態でした。

この Issue では、生成中だけ `aria-live="off"` へ切り替える方法や、`aria-busy` で更新を保留する方法が提案されました。しかし、実際の支援技術による検証が不足していたことや、スクリーンリーダー間の互換性が不明なことから、提案された PR はそのままでは採用されませんでした。

現在の OpenClaw は、履歴を [`role="log" aria-live="off"`](https://github.com/openclaw/openclaw/blob/c7b7fe4c328b/ui/src/pages/chat/components/chat-thread.ts#L1927) とし、別の視覚的に隠された [`role="status" aria-live="polite" aria-atomic="true"`](https://github.com/openclaw/openclaw/blob/c7b7fe4c328b/ui/src/pages/chat/components/chat-thread.ts#L1962) から完成した回答について通知する構成です。この構成では、回答本文自体はスクリーンリーダーへ通知されず、「回答が完了しました」のような短いテキストだけが通知されます。

この事例からも、ストリーミングされる本文と、自動的に読み上げる内容を分けて設計することの重要性が分かります。

## アクセシビリティを考慮したチャット UI の実装例

ここまで調査した内容を踏まえて、アクセシビリティ上、チャット UI に必要な要件を整理しましょう。主に以下の 3 点が重要です。

- 回答本文はスクリーンリーダーへ自動通知されない
- 回答の開始・完了・停止・エラーはスクリーンリーダーへ通知される
- 視覚的な表現に頼らず、メッセージの送信者がスクリーンリーダーからも分かるようにする

これらの要件を満たしたサンプルのチャット UI を実装してみましょう。まず、チャット履歴のコンテナには `role="log"` を指定したうえで、`aria-live="off"` を指定します。

```html
<div
  id="messages"
  role="log"
  aria-live="off"
  aria-label="チャット履歴"
  tabindex="0"
>
  <!-- ストリーミングされるメッセージ -->
</div>
```

`aria-live="off"` を指定すると `role="log"` の暗黙のライブリージョンが無効になるため、ストリーミングされる回答本文が自動で読み上げられることはなくなります。

それなら `role="log"` を指定する意味はないのではという疑問が浮かぶでしょう。しかし `aria-live` が無効になっても、ロールとアクセシブルネームはアクセシビリティツリーに残ります。実際に Chrome のアクセシビリティツリーを確認すると、`aria-live="off"` を指定した状態でも「チャット履歴」という名前を持つ `log` として公開されていました。

つまり、自動通知を止めることと、その領域が何であるかを表すことは別の話です。`role="log"` は、この領域が「古い情報が消えず、新しい情報が順に追加されていく履歴である」という意味を支援技術へ伝えるために残しています。

`tabindex="0"` を指定しているのは、履歴の領域がスクロール可能だからです。スクロールできる領域にフォーカスを置けないと、マウスを使わないキーボードユーザーが過去のメッセージまでスクロールできません。`aria-label` を指定してあるため、フォーカスしたときに「チャット履歴」と読み上げられます。

ただし、これだけではスクリーンリーダーを利用するユーザーが回答の開始や完了に気づけません。

そこで、履歴とは別に空の `role="status"` を用意します。回答の開始・完了・停止・エラーのタイミングで、ここのテキストを更新することで、スクリーンリーダーへ通知します。`role="status"` を持つ要素を動的に DOM へ挿入した場合、その内容は通知されないことがあるため、最初から DOM に配置しておく必要があります。

```html
<div
  id="chat-status"
  class="sr-only"
  role="status"
  aria-live="polite"
  aria-atomic="true"
></div>
```

`role="status"` は暗黙に `aria-live="polite"` と `aria-atomic="true"` を持つため、属性を省略しても同じ意味になりますが、ここではわかりやすさのために明示しています。

このコンテンツは画面上には表示せず、スクリーンリーダーからのみ読み上げられるようにします。先述のとおり `display: none` や `hidden` はアクセシビリティツリーからも削除されてしまうため、ここでは `.sr-only` クラスを定義して視覚的に非表示にします。

```css
.sr-only {
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
```

回答のライフサイクルに合わせて、`status` のテキストだけを更新します。

```javascript
function announce(message) {
  const status = document.querySelector("#chat-status");

  status.textContent = "";
  setTimeout(() => {
    status.textContent = message;
  }, 100);
}

announce("回答を生成しています");

// ストリーミング中は回答本文だけを更新する

announce("回答が完了しました");
```

`textContent` をいったん空にしてから、`setTimeout` で少し遅らせて設定している点に注意してください。スクリーンリーダーはライブリージョンの変更を検出して読み上げるため、直前とまったく同じ文言を代入しても変更とみなされず、読み上げられないことがあります。一度空文字にしてから設定し直すことで、同じ文言を再通知する場合に、変更として検出されやすくするための実装上の工夫です。ただし、通知結果はブラウザと支援技術の組み合わせに依存します。

同じ `status` から、停止とエラーも `polite` に通知します。

```javascript
announce("回答の生成を停止しました");
announce("回答を生成できませんでした。もう一度お試しください");
```

生成エラーは通常、現在の操作へ即座に割り込む必要がある緊急事態ではないため、`role="alert"` や `aria-live="assertive"` は使用していません。

### メッセージの送信者を見た目だけで表現しない

チャット UI は、ユーザーのメッセージを右側、AI の回答を左側へ配置したり、吹き出しの色を変えたりして送信者を表現します。しかし、位置や色の違いだけではスクリーンリーダーへ送信者が伝わりません。

サンプルでは、各メッセージを `<article>` とし、`sr-only` の見出しで送信者を示しています。

```html
<article aria-labelledby="message-2-author">
  <h2 id="message-2-author" class="sr-only">AI の回答</h2>
  <div>回答本文</div>
</article>
```

これにより履歴を後から読み進めたときにも、誰の発言なのかを確認できます。

### 送信後も入力欄にフォーカスを残す

回答が始まったときや完了したときに、回答へ強制的にフォーカスを移動してはいけません。ユーザーが入力中の内容や、現在読んでいる場所を失う可能性があるためです。[`status` ロールの仕様](https://www.w3.org/TR/wai-aria-1.2/#status)でも、状態が変化したという理由で `status` へフォーカスを移動しないよう求めています。

サンプルでは、送信後もフォーカスを入力欄に残します。生成中に表示される「停止」ボタンは通常の `<button>` であるため、必要なユーザーは `Tab` キーで移動して操作できます。「停止」ボタンを押した場合も、ボタンが消えた時点でフォーカスを入力欄へ戻すため、続けて質問を入力できます。

## VoiceOver と Chrome で確認する

実際に VoiceOver と Chrome でサンプルを確認した結果、以下のような挙動になることが確認できます。

1. フォームのサブミット後「回答を生成しています」と 1 回通知される
2. ストリーミング中の回答本文は自動的に読み上げられない
3. 完了時に「回答が完了しました」と 1 回通知される
4. 送信後と完了後のフォーカスは入力欄に残る
5. 履歴を読み進めると「あなたのメッセージ」「AI の回答」という見出しを確認できる

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5pxk9zdR9SudNGkylPM4Tq/c239781b83af31a01b27d1a69a8aec08/539a1882-7210-4429-8cf2-084e1e8b7dcc.mov" controls></video>

実際のコードは以下の Codepen で確認できます。

<iframe height="300" style="width: 100%;" scrolling="no" title="状態通知を分離したストリーミングチャット UI のデモ" src="https://codepen.io/azukiazusa1/embed/YPNMZRG?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/YPNMZRG">
  状態通知を分離したストリーミングチャット UI</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `role="log"` はチャット履歴を表す標準的なロールであり、暗黙に `aria-live="polite"` を持つ
- LLM の回答を `role="log"` の中で直接ストリーミングすると、生成途中のテキストまで細切れに通知される可能性がある
- ChatGPT と Claude は、ストリーミングされる回答本文とは別の `role="status"` から生成状態を通知している
- チャット UI ライブラリの対応は統一されていない。どのライブラリを選んでも、回答の開始と完了を短いテキストで通知する仕組みはアプリケーション側で用意する必要がある
- サンプルでは履歴を `role="log" aria-live="off"` とし、別の `role="status"` から生成開始、完了、停止、エラーを短く通知した
- `aria-busy` だけに通知制御を依存せず、対象とするスクリーンリーダーとブラウザで検証する

## 参考

- [WAI-ARIA 1.2: log role](https://www.w3.org/TR/wai-aria-1.2/#log)
- [WAI-ARIA 1.2: status role](https://www.w3.org/TR/wai-aria-1.2/#status)
- [WAI-ARIA 1.2: aria-busy](https://www.w3.org/TR/wai-aria-1.2/#aria-busy)
- [ARIA23: Using role=log to identify sequential information updates](https://www.w3.org/WAI/WCAG22/Techniques/aria/ARIA23)
- [Understanding Success Criterion 4.1.3: Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages)
- [Feed Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)
- [OpenClaw: Screen readers announce every token during streaming](https://github.com/openclaw/openclaw/issues/65538)
- [assistant-ui](https://github.com/assistant-ui/assistant-ui)
- [Vercel AI Elements](https://github.com/vercel/ai-elements)
- [CopilotKit](https://github.com/CopilotKit/CopilotKit)
- [shadcn/ui Chat Components](https://ui.shadcn.com/docs/changelog/2026-06-chat-components)
