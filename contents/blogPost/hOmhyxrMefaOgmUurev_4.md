---
id: hOmhyxrMefaOgmUurev_4
title: "AI コーディングエージェントの管理を行う Vibe Kanban を試してみた"
slug: "coding-agent-management-vibe-kanban"
about: "Vibe Kanban は、AI コーディングエージェントの管理を支援するためのツールです。カンバン方式の UI でタスク管理を行い、各タスクに対して AI エージェントを割り当てて人間がその進捗を管理できます。この記事では Vibe Kanban を使用して AI コーディングエージェントの管理を実際に試してみます。"
createdAt: "2025-08-30T14:19+09:00"
updatedAt: "2025-08-30T14:19+09:00"
tags: ["AI", "Vibe Kanban", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7oJ91RzbWDraexjtAyRmYf/a9c465f920c49f37f855601f914196c5/wooden-arrow-sign_19261-768x768.png"
  title: "木の矢印の看板のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Vibe Kanban の主な特徴として正しくないものはどれですか？"
      answers:
        - text: "Codex, Claude Code, Gemini CLI といった主要な AI コーディングエージェントをサポート"
          correct: false
          explanation: null
        - text: "複数のタスクを並列で実行可能"
          correct: false
          explanation: null
        - text: "MCP サーバーの設定を一元管理"
          correct: false
          explanation: null
        - text: "AI エージェントが生成したコードを自動的にプロダクション環境にデプロイ"
          correct: true
          explanation: ""
    - question: "Vibe Kanban でタスクを作成後、AI エージェントが作業を行うブランチの管理に使用される Git の機能は何ですか？"
      answers:
        - text: "Git Worktree"
          correct: true
          explanation: "Git Worktree は 1 つのリポジトリで複数のブランチを同時にチェックアウトできる Git の機能です。Vibe Kanban は各タスクに対して Git Worktree を使用して AI エージェントが作業を行うブランチを管理します。"
        - text: "Git Submodule"
          correct: false
          explanation: null
        - text: "Git Branch"
          correct: false
          explanation: null
        - text: "Git Stash"
          correct: false
          explanation: null

published: true
---

AI コーディングエージェントが登場して以来、開発者の仕事はコードの生成からコードのレビューや設計、AI エージェントの管理へとシフトしつつあります。AI コーディングエージェントは大量のコードを高速に生成できる一方で、生成されたコードが正しいか、セキュリティ上の問題がないか、プロジェクトのスタイルガイドに準拠しているかを確認する必要があります。また、AI エージェントに適切なプロンプトを与え、タスクを分割して効率的に作業を進めるための管理も重要です。

Vibe Kanban は、AI コーディングエージェントの管理を支援するためのツールです。Vibe Kanban は名前の通りカンバン方式の UI でタスクを管理します。従来のプロジェクト管理ツールと異なる点は、各タスクに対して AI エージェントを割り当てて人間がその進捗を管理できることです。Vibe Kanban は以下のような特徴を持っています。

- Codex, Claude Code, Gemini CLI といった主要な AI コーディングエージェントをサポートしており、簡単にエージェントを切り替えて使用できる
- 複数のタスクを並列で実行できる
- コーディングエージェントが取り組んでいるタスクのステータスを Web UI で確認できる
- MCP サーバーの設定を一元管理できる

この記事では Vibe Kanban を使用して AI コーディングエージェントの管理を実際に試してみます。

## インストール

Vibe Kanban は npm を使用してインストール・実行できます。以下のコマンドで Vibe Kanban を利用可能なポートで起動します。

```sh
npx vibe-kanban
```

コマンドを実行すると、Vibe Kanban が起動し、ブラウザでアクセスできるようになります。ポート番号は実行するたびに変化しますが、環境変数 `PORT` を設定することで固定できます。

```sh
PORT=3000 npx vibe-kanban
```

ブラウザで `http://localhost:3000` にアクセスすると、Vibe Kanban の UI が表示されます。初めは安全上の警告文がダイアログで表示されます。チェックボックスにチェックを入れて「I Accept the Risks and Want to Proceed」ボタンをクリックしましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/35owvt5FakVywMaq4bCDPd/3f46364bda36ef071f7c2b881d89503f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_14.32.38.png)

使用するコーディングエージェントとエディタを設定します。ここではコーディングエージェントに Claude Code を使用し、エディタには VS Code を選択します。この設定は後から変更できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1O455nkWFU3svV3INz9wSh/19eeb393b40a844f7f278ccaa711bf76/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_14.38.11.png)

続いて GitHub アカウントに接続するための認証をします。GitHub アカウントに接続することで、Vibe Kanban からリポジトリにアクセスしてプルリクエストを作成したり、コードをコミットしたりできます。この設定はスキップできます。GitHub に認証をする形式の他に、GitHub Personal Access Token を使用する形式もサポートされており、後から設定画面で設定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3AkRLhWTDrajhGsc9rDizf/f8fb59b426a68c11856563aacd5711a2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_17.56.58.png)

最後にフィードバックデータの収集に関する設定をすると、Vibe Kanban の初期設定は完了です。

## プロジェクトを選択する

初めに Vibe Kanban で管理するプロジェクトを選択します。右上の「+ Create Project」ボタンをクリックして新しいプロジェクトを作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/63ySnuANo4XEk2axoLmDBz/a4371b9c3d9899728eab68c42767977e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.02.51.png)

既存のディレクトリからプロジェクトを選択するか、新しいディレクトリを作成してプロジェクトを開始します。ここでは既存のディレクトリを選択します。プロジェクト名は管理しやすい名前を付けましょう。オプショナルとしてセットアップコマンドや開発サーバーを起動するコマンドを指定できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6MmBWIOZu3KZn3UBu67GXm/190d6a04377edac772f12feead858c9b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.08.28.png)

「Kanban App」という名前のプロジェクトが作成されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/2Wg74xPChQ6ZUtHkFTA2t7/7d2e5059b75d7dd1c4afe6880a2d1a7c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.12.32.png)

## タスクを作成して AI コーディングエージェントに作業を依頼する

プロジェクトを選択すると、タスクの一覧が表示されます。初めはタスクがないので、「Create Task」ボタンをクリックして新しいタスクを作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/67pisxahyqILJTGQaxrfor/b23a460ab3d596800cc24442749bd638/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.15.39.png)

ここではカンバンアプリケーションに以下の機能を追加するタスクを作成しましょう。

- ダークモードを切り替える機能
- ユニットテストを追加する
- ボード画面にトップに戻るボタンを追加する

タスクにはタイトル・説明文・画像を追加できます。タスクを作成する時にあらかじめ用意されたテンプレートを使用できます。デフォルトでは「Add Unit Tests」「Bug Analysis」「Code Refactoring」の 3 つのテンプレートが用意されており、グローバル設定から追加・編集も可能です。

ここではダークモードを切り替える機能のタスクを作成すると以下のように作成しました。

```markdown
# ダークモードを切り替える機能

ユーザーがダークモードとライトモードを切り替えられるようにする。

- Tailwind CSS のダークモード機能を使用して実装する
- 初期状態ではユーザーのシステム設定に合わせてモードを切り替える
- ヘッダーの右上に切り替えボタンを配置し、クリックするたびにモードが切り替わるようにする
- モードの状態はローカルストレージに保存し、ページを再読み込みしても状態が維持されるようにする
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4lJAEf3HM7yK03kjiUV2ol/fee69b634807b2fd57d1f7e2a4557f9e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.23.21.png)

「Create & Start Task」ボタンをクリックすると、タスクが作成され、AI コーディングエージェントが自動的に作業を開始します。「Create」ボタンをクリックすると単にタスクが作成されるだけで、AI コーディングエージェントは開始されません。作成したタスクは「TO DO」レーンに表示されます。レーンに配置されたタスクはドラッグ＆ドロップで移動できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5E2yBjDMZ8H9fz4inehX4Z/da3c03b4cc179466dde42b87b61d51ec/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_15.32.43.png)


ボード上のタスクをクリックすると、タスクの詳細が表示されます。タスクの詳細画面で「Start」ボタンをクリックすると、AI コーディングエージェントがタスクの作業を開始します。開始したタスクは「In Progress」レーンに移動し、エージェントとのやり取りがチャット形式で表示されます。エージェントの作業は Git Worktree を使用して分離されたブランチで行われます。`.env` ファイルのように git の追跡対象外であるが開発に必要なファイルはプロジェクトの「Copy Files」設定で指定しておくと、エージェントの作業ブランチにコピーされます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2PY06ZO03D60bpTr6q1E8p/f16d429915fa6336123bdd95beb089d6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.30.29.png)

デフォルトではユーザーの許可なしにコマンドやコードを編集する `--dangerously-skip-permissions` オプションが指定された状態でエージェントが起動するので注意してください。安全のために dev container のように隔離された環境でエージェントを実行することをお勧めします。

タスクが完了すると「Review」レーンに移動し音声で通知されます。「Review」レーンのタスクをクリックすると、AI コーディングエージェントが生成したコードの差分が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6nTlbwxPPR3NyvVXr3zF0P/efc0cbd8546c2eef81f75907eadda1ba/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.31.33.png)

完了したタスクに修正を加えたい場合は、チャット画面でエージェントに再度指示を出すこともできます。その場合、タスクは再び「In Progress」レーンに移動します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6xNxCxdiTSyxpMt6nQb28l/7a0d91c013c1ffc3a07ae8c7fcedaafa/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.51.11.png)

右側の三点リーダーをクリックすると、差分をエディタで開く・開発サーバーを起動する・Rebase・プルリクエストを作成する・マージといった操作が行えます。ここでは「Merge」をクリックしてマージを実行しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/6PrFQY7ZDmWxTgD1pKaPGA/5d2e8d70f18ff02c7d6a257088c994eb/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.38.21.png)

Base Branch に差分がマージされ、タスクが「Done」レーンに移動します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6o51UULLWxmvg7T1rAubnF/0ad5f363a57008f92da6e5f1535b05b2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_16.52.46.png)

## Vibe Kanban の MCP サーバー

Vibe Kanban 自体を MCP サーバーとして使用することで、任意の AI エージェントから Vibe Kanban のプロジェクトやタスクを管理できるようになります。試しに Claude Desktop に MCP サーバーを接続してみましょう。以下の設定を追加します。

```json
{
  "mcpServers": {
    "vibe_kanban": {
      "command": "npx",
      "args": ["-y", "vibe-kanban", "--mcp"]
    }
  }
}
```

以下のプロンプトを Claude に入力して、Vibe Kanban のプロジェクトにタスクを追加してもらいましょう。

```plaintext
「Kanban App」プロジェクトに「ボードのタスクを文字列で検索する機能を追加する」タスクを作成してください。機能の要件は以下の通りです。

- ユーザーが入力した文字列に基づいて、ボード上のタスクをフィルタリングする
- フィルタリングはリアルタイムで行われ、ユーザーが入力を変更するたびに結果が更新される
- タスクのタイトルや説明文に対して検索を行う
- 検索結果が0件の場合は「該当するタスクはありません」と表示する
```

「List projects」ツールを使用して「Kanban App」プロジェクトが存在することを確認し、「Create task」ツールを使用してタスクが作成されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5VI0dVnm65thftzHSlzwNz/842e0d77e584e43f98a89e040e2c9400/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-30_17.09.40.png)

## まとめ

- Vibe Kanban は AI コーディングエージェントの管理を支援するためのツールであり、カンバン方式の UI でタスクを管理する
- `npx vibe-kanban` コマンドで簡単に起動でき、ブラウザでアクセスして使用できる
- プロジェクトを既存のディレクトリから選択するか、新しいディレクトリを作成して開始できる
- プロジェクトにタスクを作成し、AI コーディングエージェントに作業を依頼できる
- AI エージェントの進行状況に応じて「TO DO」「In Progress」「Review」「Done」の各レーンにタスクが移動する
- タスクの詳細画面でエージェントとのやり取りが確認できる。修正を依頼したい場合は再度指示を出すことも可能
- GitHub 連携することで、完了したタスクをプルリクエストとして提出でき、マージされた場合はタスクが「Done」レーンに移動する
- Vibe Kanban を MCP サーバーとして使用することで、任意の AI エージェントからプロジェクトやタスクを管理できる

## 参考

- [Vibe Kanban](https://www.vibekanban.com/)