---
id: EbGSyzJScr37bHvJ83lrz
title: "Claude の Advisor tool を活用して性能とコストのバランスを最適化する"
slug: "claude-advisor-tool"
about: "Claude に新たに追加された advisor tool を使用すると、通常のタスクは軽量モデルに任せつつ、必要に応じて高性能モデルに相談することで、性能とコストのバランスを最適化できます。この記事では Claude Code 内で advisor tool を活用する方法について紹介します。"
createdAt: "2026-04-11T17:15+09:00"
updatedAt: "2026-04-11T17:15+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/45xu52pFThgYkbxW478soh/dde9493d0435fb29831338bbf2dfef4b/smoke-salmon_15757-768x591.png"
  title: "スモークサーモンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude の Advisor tool が解決しようとしている課題として、最も適切なものはどれですか？"
      answers:
        - text: "高性能モデルだけを常時使って、すべてのタスクを最短時間で終わらせること"
          correct: false
          explanation: "Advisor tool の目的は高性能モデルの常時利用ではなく、必要な場面だけ相談してコストと性能のバランスを取ることです。"
        - text: "通常は軽量モデルで進めつつ、難所だけ高性能モデルに相談してコストを抑えること"
          correct: true
          explanation: "記事で説明されている中心的な価値は、通常作業を軽量モデルに任せ、複雑な問題に限って高性能モデルを呼び出すことです。"
        - text: "複数の高性能モデルを並列実行して、軽量モデルを使わずに済ませること"
          correct: false
          explanation: "Advisor tool は高性能モデルの並列実行を主眼にした仕組みではなく、軽量モデルを基本に据える設計です。"
        - text: "会話履歴を破棄して毎回新規セッションで推論し、誤答を減らすこと"
          correct: false
          explanation: "記事では会話履歴を活用して advisor に相談すると説明されており、履歴の破棄は主題ではありません。"
    - question: "`advisor` ツールの引数について、記事の説明として正しいものはどれですか？"
      answers:
        - text: "モデル名を引数で指定する"
          correct: false
          explanation: "記事では `/advisor` 実行後にモデルを選択すると説明されており、ツールの引数としてモデル名を渡すとは書かれていません。"
        - text: "ファイルパスを引数に渡すと、そのファイルだけが advisor に共有される"
          correct: false
          explanation: "記事にはファイルパスを引数に取る説明はなく、共有対象は会話履歴全体だと説明されています。"
        - text: "引数はなく、呼び出すだけで会話履歴全体が自動的に転送される"
          correct: true
          explanation: "記事では `advisor` ツール自体には引数がなく、呼び出すだけで会話履歴全体が自動的に転送されると説明されています。"
        - text: "JSON 形式の相談内容を引数に詰めて渡す"
          correct: false
          explanation: "記事では JSON 形式の引数を組み立てる手順は説明されておらず、単に呼び出すだけだと説明されています。"

published: true
---

コーディングエージェントを使用した開発はもはや珍しいものではなくなってきましたが、それに伴うコストの話も欠かすことはできません。性能の高い AI モデルは、より複雑なタスクをこなすことができますが、その分コストも高くなります。簡単なタスクには Haiku や Sonnet といった軽量モデルを使用し、複雑なタスクには Opus といった高性能モデルを使用するという使い方が理想的ですが、どのタスクをどのモデルに割り当てるかを設計すること自体が複雑な課題となります。

Claude に新たに追加された [Advisor tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool) は、性能とコストのバランスに関する課題を解決します。これは通常のタスクの実行は Haiku や Sonnet といった軽量モデルに任せつつ、実行者が解決できないような複雑な問題に直面したときに、Opus といった高性能モデルに「相談」して解決策を得ることができる機能です。Opus は実行者から相談を受け取ると、共有コンテキストにアクセスしたうえで計画・修正・停止シグナルを返すことができます。これは大規模なエージェントのオーケストレーションにおいてサブエージェントにタスクを委任するという発想を逆転させたものです。高性能モデルはそれが必要な場合のみに呼び出されるため、コストを抑えつつも性能を最大限に活用できます。

Claude Code においても v2.1.101 以降で `/advisor` コマンドが利用可能になっています。このコマンドを使用することで Claude Code 内で Advisor tool を活用できます。この記事では Claude Code における Advisor tool をどのように活用できるかについて紹介します。

## Claude Code での Advisor tool を試してみる

Claude Code 内で Advisor tool を試すには、`/advisor` コマンドを使用します。このコマンドを実行すると、どのモデルを advisor として使用するか選択肢が表示されます。ここでは Opus を選択しましょう。通常のタスク実行には Sonnet を使用しつつ、必要に応じて Opus に相談する形になります。

![](https://images.ctfassets.net/in6v9lxmm5c8/PA1imzWLCDBjx9ogS52ZM/50387efebb71bea8dd585dff57499a5e/image.png)

advisor を選択すると、Claude Code は `advisor` ツールを使用できるようになります。Claude Code 自身に `advisor` ツールについての説明を求めたところ、以下のような使用上のルールが定められているとのことでした。

> 1. 実質的な作業の前に呼ぶ — ファイルを読む程度の「調査」は先にやってOK。書く・編集する・答えを宣言する前が最適
> 2. 完了前に成果物を保存する — advisor の呼び出し中にセッションが終わっても成果物が残るように
> 3. アドバイスを真剣に受け取る — アドバイスに従ったが実証的に失敗した場合、または手元の証拠と矛盾する場合は、再度 advisor を呼んで矛盾を解消する
> 4. 長いタスクでは複数回呼ぶ — アプローチ確定前に1回、完了宣言前に1回が目安

`advisor` ツールを有効にした状態で、通常通りタスクを実行してみましょう。ここでは `Card.svelte` コンポーネントに 3 つの責務が混在しているので、これをリファクタリングして単一責務の原則に従うように改善するというタスクを実行してみます。

```txt
Card.svelte には 3 つの独立した onMount に以下が詰め込まれています
- コードブロックコピーボタン挿入
- 画像モーダル処理
- baseline-status 読み込み

Card.svelte に責務が混在する問題を修正してください。
```

このタスクを実行すると、実装計画を立てるために Opus に相談している様子がわかります。ここで `advisor` ツールが呼び出されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/1X3q32rnRC8to3UqP1LKCL/c82d867017d3462ebc4b998c09b0ed83/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-04-11_18.06.47.png)

`advisor` ツールには引数がなく、単に呼び出すだけです。`advisor` ツールを呼び出すと会話履歴全体が自動的に転送されるため、Opus はこれまでのやりとりを踏まえた上で、実装計画に対してフィードバックを返してくれます。実行者である Sonnet がこのタスクを依頼された段階では、以下のように思考していたようです（日本語に翻訳しています）。

> 構造を理解しました。既存のactionsディレクトリはありません。2つの複雑なonMountブロックに対してSvelteアクションを作成します：

> 1. `app/src/lib/actions/codeBlockCopy.ts` — コードブロックのコピーボタン用Svelteアクション
> 2. `app/src/lib/actions/imageModal.ts` — 画像クリックで拡大表示するモーダル用Svelteアクション
>    `baseline-status` のインポートは単純な1行なので、`Card.svelte` にそのまま残します。
>    Svelteアクションについて：
>
> - 第1引数として適用先のノードを受け取る
> - クリーンアップ用の `{ destroy() }` オブジェクトをオプションで返す
> - コードブロックアクションは指定ノード内の `pre` 要素をクエリする
> - 画像モーダルアクションは指定ノード内の `img` 要素をクエリする
>   現在のコードをより詳しく確認すると：
> - コードブロック：`document.querySelectorAll("pre")` — グローバルにクエリ
> - 画像：`document.querySelectorAll("#contents img")` — `#contents` 内をクエリ
>   また、`$paraglide/messages` からの `m` インポートはコードブロックのコピーアクションで使用されています。対応方法は2つあります：
>
> 1. アクションファイル内で `m` を直接インポートする
> 2. アクションへのパラメータとして渡す
>    アクションをシンプルに保つため、直接インポートする方針にします。

Opus はこれまでの会話履歴を踏まえた上で、実装計画に対して以下のようなフィードバックを返してくれます。Opus の回答は `advisor_tool_result` ブロックとして実行者に返されます。Opus の思考プロセスは結果を返す間に破棄されるため、結果だけが返される形になります。

> 計画は妥当です。実装時に押さえるべき3点：
>
> **`$paraglide/messages` を `.ts` アクションファイルで使う場合** — `.svelte` コンポーネント外でこのインポートが解決されるか確認が必要。SvelteKitのエイリアスやViteプラグインの問題で解決されない場合は、`m` をアクション内でインポートする代わりに、アクションの第2引数として `{ copyLabel: string, copiedLabel: string }` を渡す方が安全。パラメータ化を推奨。
>
> **クエリはdocumentではなくnodeにスコープする** — 現在のコードは `document.querySelectorAll("pre")` や `document.querySelectorAll("#contents img")` でグローバルにクエリしている。アクション内では代わりに `node.querySelectorAll(...)` を使うこと。これがリファクタリングの本質であり、誤ってグローバルクエリを残さないよう注意。
>
> **`codeBlockCopy` のクリーンアップ** — 現在のコードは `insertAdjacentElement` で `pre` の兄弟要素としてボタンやポップアップを挿入している。`destroy` 関数ではイベントリスナーだけでなく、挿入した要素も削除する必要がある。そうしないとHMRやSvelteKitのナビゲーション時に古いコピーボタンが残留する可能性がある。セットアップ時に配列で追跡し、`destroy` 時に削除すること。
>
> `baseline-status` の1行は `Card.svelte` にインラインのまま残す — 1行の `onMount` を切り出しても冗長なだけ。

Sonnet が思考していた時には見落としていた以下の 3 つのリスクを Opus が指摘してくれています。

- `.ts` ファイルでの `$paraglide` エイリアス解決の不確実性 → パラメータ渡しに変更
- `document` グローバルクエリ → `node.querySelector` に変更
- `destroy` での DOM 要素削除漏れ → `inserted` 配列で追跡して削除

## まとめ

- Claude の Advisor tool を活用することで、性能とコストのバランスを最適化できる。これは通常のタスクは軽量モデルに任せつつ、必要に応じて高性能モデルに相談するという使い方ができる設計です
- Claude Code 内で `/advisor` コマンドを使用することで、`advisor` ツールを有効にする。これにより、実行者がタスクを実行する際に、必要に応じて高性能モデルに相談してフィードバックを得ることができるようになる
- Claude Code において Advisor tool を活用する際のルールとしては、実質的な作業の前に呼ぶこと、完了前に成果物を保存すること、アドバイスを真剣に受け取ること、長いタスクでは複数回呼ぶことが挙げられる
- `advisor` ツール自体には引数はなく、呼び出すだけで会話履歴全体が自動的に転送されるため、Opus はこれまでのやりとりを踏まえた上で、実装計画に対してフィードバックを返してくれる

## 参考

- [The advisor tool: Give Sonnet an intelligence boost with Opus | Claude](https://claude.com/blog/the-advisor-tool)
- [Advisor tool - Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)
