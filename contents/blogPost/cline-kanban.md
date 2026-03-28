---
id: o9W5QctRVW29UWUEOPFSU
title: "Cline Kanban で複数のコーディングエージェントを一括管理する"
slug: "cline-kanban"
about: "Cline Kanban は人間が数十個のエージェントを運用するうえで正気を保つためにはどうすればいいか、という問いに対する 1 つの答えとして、Cline が開発したツールです。Cline Kanban はカンバン方式のビューを提供します。各カードは稼働中のエージェントを表しており、どのエージェントが実行中で、どのエージェントが作業がブロックされているのか、どのエージェントが完了しているのかを一目で把握できるようになっています。"
createdAt: "2026-03-28T17:18+09:00"
updatedAt: "2026-03-28T17:18+09:00"
tags: ["cline", "kanban", "AI", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/37nInp8ktkbRZRDVNy5FDO/80c150cb75246808619ba73ef00f26d2/image.png"
  title: "焼き鮭定食のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Cline Kanban が解決しようとしている主な課題はどれですか？"
      answers:
        - text: "コーディングエージェントの実行速度が遅いため、タスクの完了に時間がかかること"
          correct: false
          explanation: "Cline Kanban はエージェントの速度ではなく、人間側の管理コストを問題として取り上げています。"
        - text: "複数のエージェントを並列実行する際に、人間がボトルネックとなり認知的負荷が高まること"
          correct: true
          explanation: "記事冒頭で述べられているように、複数ターミナルの行き来による承認漏れや、コンテキストスイッチングによる脳疲労が問題です。Cline Kanban はこれをカンバンビューで可視化することで解決します。"
        - text: "コーディングエージェントが Cline 以外のツールと連携できないこと"
          correct: false
          explanation: "Cline Kanban は Claude Code や Codex など複数エージェントに対応しており、これは解決済みの点として紹介されています。"
        - text: "Git のブランチ管理が複雑になり、コンフリクトが頻発すること"
          correct: false
          explanation: "ブランチのコンフリクトは記事で言及されておらず、Cline Kanban が解決しようとしている課題ではありません。"
    - question: "Cline Kanban でコーディングエージェントにタスクを渡す際の推奨プラクティスとして正しいものはどれですか？"
      answers:
        - text: "1つの大きなタスクにまとめてエージェントに渡すと、エージェントが全体像を把握しやすくなる"
          correct: false
          explanation: "記事では反対のアプローチを推奨しており、大きなタスクをそのまま渡すことは避けるよう述べています。"
        - text: "タスクはできるだけ抽象的に記述し、エージェントが自由に判断できる余地を残す"
          correct: false
          explanation: "記事では「データベース」のような曖昧な表現を避け、使用技術やテーブル名など要件を明確に伝えることを推奨しています。"
        - text: "小さく明確なタスクに分割し、使用技術や要件をできるだけ具体的に記述する"
          correct: true
          explanation: "「1日の支出を記録する機能を実装する」ではなく「SQLite と Prisma を使用して〜テーブルを作成する」のように、タスクを細分化し具体的に記述することが推奨されています。"
        - text: "Plan モードを必ず有効にしてから全タスクを一括で開始する"
          correct: false
          explanation: "Plan モードはオプション機能であり、必須ではありません。また全タスクの一括開始が推奨されているという記述もありません。"
    - question: "Cline Kanban でタスクを実行した際、「Review」カラムにタスクが移動する条件として正しいものをすべて含むのはどれですか？"
      answers:
        - text: "タスクが正常に完了したとき、または依存タスクが未完了でブロックされているとき"
          correct: false
          explanation: "依存タスクが未完了の場合はタスクが実行されず「Backlog」のままです。「Review」への移動条件とは異なります。"
        - text: "タスクが正常に完了したとき、またはユーザーの承認を求めてブロックされているとき"
          correct: true
          explanation: "記事に明記されているように、完了タスクは「Commit」「Open PR」などのアクションが表示された状態で「Review」に移動し、承認待ちタスクも「Review」に移動します。この2つが「Review」カラムに移動する条件です。"
        - text: "ユーザーが手動でカードを「Review」カラムにドラッグしたとき"
          correct: false
          explanation: "記事では手動ドラッグによる移動については触れておらず、自動的なカラム移動の仕組みが説明されています。"
        - text: "タスクのコミットが完了し、main ブランチへのマージが終わったとき"
          correct: false
          explanation: "コミット完了後は「Review」カラムへ移動しますが、それはコミット作業中に一度「In Progress」へ戻った後の話です。またマージはコミット後に行われるため、これは「Review」移動の条件ではありません。"
published: true
---
2026 年に入ってからコーディングエージェントを使った開発はもはやキャズムを超え、一般的な開発プロセスの一部として定着しつつあります。Git worktree を活用した複数のコーディングエージェントの並列実行も珍しいものではなくなってきました。そんな中、人間がボトルネックになっているという事実に誰もが気づき始めています。複数のターミナルウィンドウを行き来する中で、1 つのエージェントがユーザーの承認を待ち続けて作業がブロックされつづけていたり、1 時間前にタスクが完了していた事実に気づかずに放置してしまっていたという経験をした人も多いのではないでしょうか。

また、複数のエージェントを同時に走らせる上での認知的な負荷の増大も問題になっています。コーディング作業があまりに早く終わってしまうため、エンジニアは今までにない量の作業を監督しなければならなくなっています。コンテキストスイッチングのコストも馬鹿にはなりません。人間は本来マルチタスクが得意なわけではありません。タスクの切り替え時には気づかないうちにそのコストを払っており、それが蓄積することにより脳の疲労が増大していきます。1 日の仕事を終えた後に、今までは感じなかったような疲労感を感じるようになったという人もいるのではないでしょうか。

Cline Kanban は人間が数十個のエージェントを運用するうえで正気を保つためにはどうすればいいか、という問いに対する 1 つの答えとして、Cline が開発したツールです。Cline Kanban はカンバン方式のビューを提供します。各カードは稼働中のエージェントを表しており、どのエージェントが実行中で、どのエージェントが作業がブロックされているのか、どのエージェントが完了しているのかを一目で把握できるようになっています。並行作業に伴う認知的な負荷があることは変わらないものの、ターミナルを行き来してエージェントの状態を確認する必要がなくなり、頭の中でエージェントの管理をするためのワーキングメモリの負荷も減るため、心理的な負荷は大幅に減るはずです。

Cline Kanban は Cline だけでなく、Claude Code や Codex などの他のコーディングエージェントとも連携して動作します。これは Cline が当初モデルに依存しないツールとして設計されたという理念に基づいています。

この記事では実際に Cline Kanban を使用して複数のコーディングエージェントを並列実行する方法を紹介します。ここでは試しに家計簿アプリを作るためのタスクを複数のエージェントに分割して実行してみましょう。

## Cline Kanban のセットアップ

Cline Kanban は `kanban` という CLI ツールとして提供されています。以下のコマンドでインストールしてください。

```bash
npm install -g kanban
```

インストールが完了したら `kanban` コマンドが使用できるようになっているはずです。

```bash
$ kanban -v
0.1.50
```

`kanban` コマンドを実行すると、ローカルで Kanban サーバーが立ち上がり、ブラウザで Kanban ボードが開きます。

```bash
$ kanban
Cline Kanban running at http://127.0.0.1:3484/<project-name>
Press Ctrl+C to stop.
```

使用するコーディングエージェントを選択するダイアログが表示されるので、使用したいエージェントを選択してください。ここでは Claude Code を選択しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7HPWWDqhLun6VDud12L4bV/568dc82e974784161a698f5e2a9b35b5/image.png)

デフォルトではユーザの承認を一切必要としない `bypass permissions flag`（設定ファイル上は `agentAutonomousModeEnabled`）が有効になっているため、セキュリティ上の懸念事項があれば適宜無効化してください。画面右上の設定ボタンから変更できるほか、`~/.cline/kanban/config.json` で直接設定することもできます。

```json:~/.cline/kanban/config.json
{
  "selectedAgentId": "claude",
  "agentAutonomousModeEnabled": false
}
```

## タスクを追加する

プロジェクトの初期状態では「Backlog」「In Progress」「Review」「Trash」という 4 つのカラムが用意されています。タスクを追加するには「Backlog」カラムの「Add Task」ボタンをクリックしてください。ショートカットキー `c` を使用してもタスクを追加できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2VBi13cyUDU8066eyNAFMo/456ed733827b783017678b0b69c63ec9/image.png)

タスクを追加するモーダルが表示されます。タスクの概要を入力して「Create」もしくは「Start Task」ボタンをクリックしてください。コーディングエージェントにタスクを依頼する一般的なプラクティスとして、小さく明確なタスクに分割することが推奨されます。例えばいきなり「1 日の支出を記録する機能を実装する」というタスクを追加するのではなく、「データベースをセットアップする」という粒度の大きさが適切でしょう。また「データベース」というのも曖昧さがあるため「SQLite と Prisma を使用して〜」「categories テーブルと transactions テーブルを作成する」というように、できるだけ要件を明確に伝えることも重要です。普段プロジェクトで使用しているチケットのテンプレートがあれば、それに沿った形式でタスクを追加するのも良いでしょう。

「Start in plan mode」にチェックを入れれば、タスクを実行する前にまずはタスクの実行計画を提示してもらう Plan モードでタスクを開始できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/iso8yy0Bog39V7WHGhV76/8df556ea25465a498957ed94c68dc869/image.png)

全部で 11 個のチケットを追加してみました。タスクを追加しただけの状態では、エージェントはまだタスクを実行していません。

![](https://images.ctfassets.net/in6v9lxmm5c8/2Y5cT2lHi5gUhOBddlaZC2/da2bebc89e22ed001100babebf1a9f6e/image.png)

追加したタスクはローカルの `~/.cline/kanban/workspaces/<project-name>/boards.json` に JSON ファイルとして保存されます。

```json:~/.cline/kanban/workspaces/<project-name>/boards.json
{
  "columns": [
    {
      "id": "backlog",
      "title": "Backlog",
      "cards": [
        {
          "id": "91ebd",
          "prompt": "# フィルタ・検索機能\n\n",
          "startInPlanMode": false,
          "autoReviewEnabled": false,
          "autoReviewMode": "commit",
          "baseRef": "main",
          "createdAt": 1774672842329,
          "updatedAt": 1774673005471
        }
      ]
    },
    { "id": "in-progress", "title": "In Progress", "cards": [] },
    { "id": "review", "title": "Review", "cards": [] },
    { "id": "trash", "title": "Trash", "cards": [] }
  ],
  "dependencies": []
}
```

タスクの依存関係を設定してみましょう。⌘ を押しながらタスクカードをドラッグ＆ドロップすることで、タスクの依存関係を設定できます。データベースのセットアップは他のタスクの前に完了している必要があるため、他のタスクがデータベースのセットアップに依存するように設定してみました。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/1kFPdI4HlljfpNgwVloRzb/1b09e193ebafe0a4a11039d6b36c0018/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-03-28_13.47.46.mov"></video>

もしくは左サイドバーにある「Kanban Agent」に指示を出すことでタスクの追加や依存関係を指示できます。以下のようなプロンプトで指示してみました。

```txt
以下の順序で依存関係をリンクしてください。
「A → B」は「Aが完了したらBを開始できる」という意味です。

- DBスキーマ設計 → カテゴリ CRUD API
- DBスキーマ設計 → 取引 CRUD API
- カテゴリ CRUD API → カテゴリ管理 UI
- 取引 CRUD API → 取引入力フォーム UI
- カテゴリ管理 UI → 取引一覧・編集・削除 UI
- 取引入力フォーム UI → 取引一覧・編集・削除 UI
- 取引一覧・編集・削除 UI → カテゴリ別円グラフ
- 取引一覧・編集・削除 UI → 月別推移グラフ
- カテゴリ別円グラフ → ダッシュボード統合
- 月別推移グラフ → ダッシュボード統合
- ダッシュボード統合 → フィルタ・検索機能
- フィルタ・検索機能 → UI仕上げ・レスポンシブ対応
```

Kanban Agent は内部的に `kanban task list` コマンドでタスクの一覧を取得してタスク ID を確認した後、`kanban task link --task-id 64699 --linked-task-id 94b13` のようなコマンドで依存関係を設定していきます。これらのコマンドはユーザーがターミナルから直接実行することもできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5gwDUIaIfEtGvE1bnHmNmk/4f12127e547e11edf340b0075f3b6f99/image.png)

## タスクを実行する

依存関係の設定が完了したら、いよいよタスクを実行してみましょう。タスクカードの「▶️」ボタンをクリックするか「Backlog」カラムの「▶️」ボタンをクリックすれば、タスクの実行が開始されます。それぞれのタスクは Git worktree 上で実行されるため、タスクごとに異なるブランチで作業が進んでいきます。

依存関係が設定されている場合は、依存しているタスクが全て完了するまでタスクは実行されません。実装中のタスクは「In Progress」カラムに移動し、「Review」カラムにはユーザーの承認を求めてブロックされているタスクと、タスクが完了してレビュー待ちとなっているタスクの 2 種類が表示されます。タスクのカードには今エージェントがどんなコマンドを実行しているのかといった情報がリアルタイムで表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/MtgPVSZ1Wtv3llcV1kRnE/cdf21148d9774f47ef9d5fe346e4096f/image.png)

カードをクリックすると、エージェントの会話履歴を表示する TUI やコードの変更内容を確認できます。コードの差分では PR のように行ごとにコメントを残すこともできます。コメントを submit すれば、エージェントに対するフィードバックとして反映されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5Vk9CVh9Ygey1JFnsUaLFm/0c76536a1eb62809b45f17e1685f04f0/image.png)

完了したタスクは「In Progress」カラムから「Review」カラムに移動します。ユーザーの承認を求めてブロックされているタスクとは異なり、「Commit」「Open PR」などのアクションが表示されるようになります。タスクの内容を確認して問題なければ「Commit」ボタンをクリックして変更をコミットしてみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/uAx2dVLbQATdGWQvJn6XW/9434fbefd6d125d7d4b7b83a14a12e9d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-28_14.26.01.png)

「Commit」ボタンをクリックすると、再度「In Progress」カラムにタスクが移動し、エージェントによるコミット作業が開始されます。コミットが完了したら「Review」カラムに移動し、main ブランチに変更が反映されます。これで問題なければカードのゴミ箱アイコンをクリックして「Trash」カラムに移動してタスクを完了させましょう。「Trash」カラムは完了済みタスクのアーカイブ先として機能しており、カラムに移動すると同時に、そのタスクで使用していた Git worktree が自動的にクリーンアップされます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5UdKHsqsV3KtXZnEWHWlYQ/0c21f19aa0870180886c071b9fcef26a/image.png)

ブロッキングとなっていたタスクが完了すると、依存しているタスクが自動的に実行されるようになります。API の実装タスクが完了したので、UI の実装タスクが実行されるようになりました。

## まとめ

- Cline Kanban は複数のコーディングエージェントを並列実行するためのカンバン方式のビューを提供するツール
- Cline だけでなく、Claude Code や Codex などの他のコーディングエージェントとも連携して動作する
- kanban コマンドでローカルに Kanban サーバーを立ち上げることで使用できる
- Web UI 上からタスクの追加や依存関係の設定、タスクの実行やレビューなどができる。手動でタスクの追加や依存関係の設定をする以外にも、Kanban Agent に指示を出すことでエージェントに任せることもできる
- タスクを開始すると、タスクカードが「In Progress」カラムに移動し、Git worktree 上でタスクが実行される。ユーザーの承認を求めてブロックされると「Review」カラムに移動する。タスクのカードにはエージェントが今どんなコマンドを実行しているのかといった情報がリアルタイムで表示される
- タスクの実行が完了したら、コードの差分を確認してコミットするかどうかを選択できる。コミットされた変更は main ブランチにマージされる

## 参考

- [cline/kanban: Launch a local web app and run CLI agents in parallel](https://github.com/cline/kanban)
- [Cline Kanban - Cline](https://docs.cline.bot/kanban/overview)
- [Announcing Cline Kanban: a CLI-agnostic app for multi-agent orchestration.](https://cline.ghost.io/announcing-kanban/)
