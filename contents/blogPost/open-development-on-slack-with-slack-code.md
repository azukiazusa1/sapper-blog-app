---
id: TAty7kpIl7GVMmwB6UWPS
title: "Slack 上でオープンな開発を行う Slack Code を試してみた"
slug: "open-development-on-slack-with-slack-code"
about: "Slack Code は Slack 上でオープンな開発を行う手段を提供する機能です。コードチャンネルと呼ばれる特別なチャンネルを作成し、チーム全体でコーディングエージェントとやり取りを行うことができます。この記事では Slack Code を実際に試してみた感想を紹介します。"
createdAt: "2026-08-22T10:35+09:00"
updatedAt: "2026-08-22T10:35+09:00"
tags: ["Slack", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3QejWtvpZ4ob6yptrQneDG/3d5aa3363f4de978d1ad86c8a156c8da/bird_cute_komadori_10920-768x640.png"
  title: "コマドリのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Slack の HTML プレビュー機能について、記事で述べられている制約はどれですか？"
      answers:
        - text: "Canvas 形式に変換してからでないと表示できない"
          correct: false
          explanation: "記事では Canvas について、Devin のツールがまだ対応していないため利用できなかったと別の文脈で触れられています。HTML プレビューの前提条件ではありません。"
        - text: "Enterprise プランでのみ利用できる"
          correct: false
          explanation: "プランによる制限は Claude Tag に関する記述であり、HTML プレビューについては述べられていません。"
        - text: "静的なコンテンツに限られる"
          correct: true
          explanation: "記事の通り、静的なコンテンツに限られるものの、プロトタイプを共有してフィードバックを得る用途には使えそうだと述べられています。"
        - text: "サイドバーの「成果物」タブからしか開けない"
          correct: false
          explanation: "記事では HTML ファイルを共有してもらうとその場で成果物を動かせると述べられており、開く場所の制限には触れられていません。"
published: true
---
今日のソフトウェア開発では、Claude Code、Codex、Devin といったコーディングエージェントを使用して迅速かつ容易に開発することが当たり前になっています。一方でこれらのエージェントは個人の環境のターミナルで動作するため、そのやり取りは個人の環境に閉じてしまい、チームでの開発においては情報共有が難しいという課題があります。

例えばコーディングエージェントとのやり取りの中ではなぜその設計を選んだのか、もしくはなぜ選ばなかったのかといった豊富なコンテキストが存在するものの、レビューに出す際にはそのコンテキストはほとんど失われてしまうため、レビュー担当者はその設計の意図を理解するのに苦労することがあります。また、個人がより効果的な方法でエージェントとやり取りする知見を持っていたとしても、その知見をチームで共有できる機会はほとんどありませんでした。

いくつかのチームはこの課題を解決するために Slack や Discord のようなオープンな場所でコーディングエージェントを使用することを試みてきました。Slack 上でエージェントにメンションを送りセッションを開始するという方法は私自身も何度か試したことがあります。Slack 上でセッションを開始できるという手軽さがあり、かつ今何をやっているかがチーム全体に可視化されるという利点はあります。しかし、スレッドのやり取りがノイズになりやすい、コードの差分が Slack 上では見えづらい、成果物をチームでレビューする手段がないといった課題もありました。

Slack Code はオープンな Slack 上で開発する手段を提供します。従来の DM やスレッド上でのやり取りの代わりにコードチャンネルと呼ばれる特別なチャンネルを作成し、そのチャンネル上でコーディングエージェントとやり取りします。コードチャンネルではエージェントと 1 対 1 のやり取りをするのではなく、チーム全体でエージェントとやり取りできます。またコードや Canvas、HTML ビューといった Slack 上の特別なビューを使用することで、コードの差分や成果物をチームでレビューできます。エージェントの作業状態はサイドバーから確認できます。

この記事では Slack Code を実際に試してみた感想を紹介します。

## エージェントを Slack にインストールする

Slack Code を使用するにはサポート対象の AI アプリやエージェントを Slack にインストールする必要があります。Slack Code は現在以下のエージェントをサポートしているようです。

- [Claude](https://slack.com/marketplace/A08SF47R6P4-claude)（Enterprise または Team プランでのみ利用可能な [Claude Tag](https://www.anthropic.com/news/introducing-claude-tag) が必要でした）
- [Devin](https://slack.com/marketplace/A06A3TU8H39-devin)
- [GitHub Copilot](https://slack.com/marketplace/A01BP7R4KNY-github)
- [Vercel](https://slack.com/marketplace/A024HTHQZ47-vercel)

この記事では Devin を使用して Slack Code を試してみます。上記のリンクから「Slack に追加」ボタンをクリックし、Slack ワークスペースにインストールします。

![Devin を Slack ワークスペースにインストールする画面](https://images.ctfassets.net/in6v9lxmm5c8/6y98a10rTnnMPnl86WD4a5/4bddfd4a06563572122ebf26ef7f05a1/image.png)

## コードチャンネルを作成する

それでは実際にコードチャンネルを作成してエージェントとのやり取りを試してみましょう。コードチャンネルの作成方法として「エージェントにメンションして特定のリクエストを送ると自動で作成される」と説明されていたのですが、何度か試してみてもエージェントによりコードチャンネルが作成されることはなかったので、手動でコードチャンネルを作成してみました。

手動で作成するにはサイドバーの「エージェントとツール」を選択し、一番上にある「+」ボタンをクリックします。

![サイドバーの「エージェントとツール」セクションと、その一番上に表示された「+」ボタン](https://images.ctfassets.net/in6v9lxmm5c8/6Lp6tOqLhETCkPstnLc1Ce/c366151c8ab489451c34bc5528426ada/image.png)

コードチャンネルを作成するためのモーダルが表示されるので、エージェントとワークスペース、プロンプトを入力して「作成」ボタンをクリックします。

![エージェント・ワークスペース・プロンプトの入力欄が並んだコードチャンネル作成モーダル](https://images.ctfassets.net/in6v9lxmm5c8/01IfvHx0u0kRpmu9IuMYgB/fd833dbcd2633e451617c665fede5d7a/image.png)

チャンネルが作成されると同時に Devin とのセッションが開始されました。サイドバーでは「コードチャンネル」のセクションに作成したチャンネルが表示され、Devin が作業中の場合はローディングアイコンが表示されます。チャンネル名はプロンプトの内容から自動で生成されるようです。チャンネルの作成時に入力したプロンプトはチャンネルの最初のメッセージとして投稿されます。

![サイドバーの「コードチャンネル」セクションに作成したチャンネルが表示され、最初のメッセージとしてプロンプトが投稿された様子](https://images.ctfassets.net/in6v9lxmm5c8/2rW6WGjDDVE46McIjNUhn9/f6824fd4e55c53fc44b6e5e6839cf6d9/image.png)

まずはじめに設計方針をマークダウンファイルとして添付してくれました。セッションで作成されたファイルなどは「成果物」のタブとして追加されるようです（Slack の Canvas 機能を使用して共有してくれることを期待しましたが、Devin のツールではまだ対応していないようです）。

![Devin が添付した設計方針のマークダウンファイルと、それが並ぶ「成果物」タブ](https://images.ctfassets.net/in6v9lxmm5c8/2GFmKmRSGZM7j8EgsQDTc0/49de5acbfeeb90dddb47541524a660af/image.png)

設計ファイルを一瞥してそのまま実装に進んでもらいます。実装が完了して PR が作成されると、コードの差分が共有されました。Slack 上からコードを確認でき、コメントもその場で付けてフィードバックできるようです。

![作成された PR のコードの差分が Slack 上に表示された様子](https://images.ctfassets.net/in6v9lxmm5c8/7DMmecdu8ZVw422LZdmClW/2080d499786d009bb13cc6a0cf0d253a/image.png)

行コメントを送信したら、選択した行の周辺とコメントが入力欄に追加されました。この状態で新たなやり取りを開始するようですね。GitHub 上での PR のやり取りと比べると、コメントが永続化されないため、後から見返すことができないのは少し不便に感じました。

![行コメントを送信し、選択した行の周辺とコメントが入力欄に追加された様子](https://images.ctfassets.net/in6v9lxmm5c8/3O5uUNEcCBh0mr7U74EM9C/0bf115f3a83a8aa0193f72238c34565c/image.png)

「成果物を HTML プレビューとして見られるようにして」といったリクエストを送り HTML ファイルを共有してもらうと、Slack の HTML プレビュー機能を利用してその場で成果物を動かしてみることができます。静的なコンテンツに限られますが、例えばプロトタイプとして HTML を作成してもらい、チームメンバーのフィードバックを得るという使い方もできそうです。

![Slack の HTML プレビュー機能で成果物をその場で表示した様子](https://images.ctfassets.net/in6v9lxmm5c8/2u5diPbrLhrN2qzkeU9Pvj/fedfced59b29bc7dd634e480e92dc0c3/image.png)

最終的に完了したセッションはサイドバーから「×」ボタンをクリックして非表示にするか、チャンネルをアーカイブできます。

## まとめ

- Slack Code は Slack 上でオープンに開発する手段を提供する機能で、コードチャンネルと呼ばれる特別なチャンネルを作成し、チーム全体でコーディングエージェントとやり取りできる
- Claude、Devin、GitHub Copilot、Vercel といったエージェントをサポートしている
- コードチャンネルではコードや Canvas、HTML ビューといった Slack 上の特別なビューを使用することで、コードの差分や成果物をチームでレビューできる
- エージェントの作業状態はサイドバーから確認できる

## 参考

- [Agentic coding is now multiplayer: Introducing Slack Code](https://x.com/SlackHQ/status/2090415566351659267)
- [Slack コードを使ってチームとして AI で構築する | Slack](https://slack.com/intl/ja-jp/help/articles/54310833022355-Slack-%E3%82%B3%E3%83%BC%E3%83%89%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%A6%E3%83%81%E3%83%BC%E3%83%A0%E3%81%A8%E3%81%97%E3%81%A6-AI-%E3%81%A7%E6%A7%8B%E7%AF%89%E3%81%99%E3%82%8B)
- [Turning conversation into knowledge: how Slack builds human-agent teams | Claude by Anthropic](https://claude.com/blog/turning-conversation-into-knowledge-how-slack-builds-human-agent-teams)
