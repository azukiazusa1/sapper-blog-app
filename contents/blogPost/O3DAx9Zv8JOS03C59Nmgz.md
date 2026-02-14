---
id: O3DAx9Zv8JOS03C59Nmgz
title: "AI エージェントのセッションを Git 互換のデータベースに保存する Entire CLI"
slug: "entire-for-saving-ai-agent-sessions-as-git-compatible-database"
about: "Entire CLI は AI エージェントのセッションを Git 互換のデータベースとして保存するためのツールです。Git レポジトリで Entire を有効にすると、AI エージェントのセッションをチェックポイントとして保存できるようになります。チェックポイントではユーザーのプロンプトや AI エージェントの応答、ツールの使用履歴、AI がコードを書いた割合などを確認できます。"
createdAt: "2026-02-14T11:38+09:00"
updatedAt: "2026-02-14T11:38+09:00"
tags: ["Entire", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/578z7xFjfTs7yUYPiX6WfA/1359eb084c6bb9ed59ff822ba314fa03/molecular-structure_23083.png"
  title: "分子構造のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Entire CLI で Git レポジトリを有効にするコマンドはどれか？"
      answers:
        - text: "entire init"
          correct: false
          explanation: null
        - text: "entire setup"
          correct: false
          explanation: null
        - text: "entire enable"
          correct: true
          explanation: "`entire enable` コマンドを実行することで、Git レポジトリで Entire を有効にできます。"
        - text: "entire start"
          correct: false
          explanation: null
    - question: "チェックポイントの詳細を確認するために使用するコマンドはどれか？"
      answers:
        - text: "entire explain"
          correct: true
          explanation: "`entire explain` コマンドでチェックポイントの一覧や詳細を確認できます。`--checkpoint` や `--commit` フラグで特定のチェックポイントを指定できます。"
        - text: "entire show"
          correct: false
          explanation: null
        - text: "entire inspect"
          correct: false
          explanation: null
        - text: "entire log"
          correct: false
          explanation: null

published: true
---

今日の開発者の役割は大きく変わりつつあります。Claude Code, Codex, Cursor といった AI コーディングアシスタントの登場により、開発者はコードを書くことだけでなく、AI エージェントを効果的に活用してプロジェクトを管理し、問題を解決することが求められるようになっており、まるでマネージャーのような役割も担うようになっています。

このような状況の中で GitHub の元 CEO である [Thomas Dohmke](https://x.com/ashtom) 氏は次のように主張しています。開発者の仕事の進め方が大きく変わる一方で、依然として人間同士のコラボレーションを前提としたソフトウェア開発ライフサイクルに依存しており、そのことが大きな亀裂を生んでいるとのことです。

Issue は人間による計画と追跡のために設計されており、構造化されマシンリーダブルな形式の作業単位として設計されていません。Git レポジトリは AI 時代の開発者が構築するすべてのバージョン管理に対応できるほど拡張されておらず、プルリクエストは大規模なモノレポではスケールしません。つまりはソフトウェアエコシステム全体がそもそも AI 自体を前提とした設計となっていないため、このことがボトルネックとなっているということです。

この問題を解決し、人間と AI エージェントが共に協力してソフトウェアを構築できるよう開発プラットフォームを構築することが [Entire](https://entire.io/) の目的です。Entire は以下の 3 つの主要なコンポーネントから構成されます。

1. コード, 意図, 制約, 推論を単一のバージョン管理システムに統合する Git 互換のデータベース
2. コンテキストグラフを通じてマルチエージェント協調を可能にする普遍的なセマンティック推論レイヤー
3. エージェントと人間の協働のためにソフトウェア開発ライフサイクルを再発明する AI ネイティブのユーザーインターフェース

Entire の最初のリリースは AI エージェントのコンテキストを追跡するための CLI ツールです。AI エージェントのセッションは短命であり、ターミナルを閉じてしまえばすべてのコンテキストが失われてしまうため、AI がどのような理由でどのようなコードを生成したのかが失われてしまいました。Git は変更内容を保存するものの、変更理由は一切保存されないのです。数日前に行われた設計の意思決定が失われてしまえば、AI は再度同じ調査を行ったり、同じ推論を繰り返すことにより余分なトークンを消費してしまうことになります。AI エージェント同士が連携をする場合にはコンテキストの共有が不可欠なのです。

Entire CLI はコンテキスト（ユーザーのプロンプト、AI エージェントの応答、ツールの使用履歴など）を永続化します。チェックポイントと呼ばれる新しいプリミティブにより、AI エージェントのセッションを Git のファーストクラスのバージョン管理データとして自動的にキャプチャします。これによりコードベースがどのように進化していったのか追跡できるようになるのです。

この記事では Entire CLI を実際に使用して、どのように AI エージェントのセッションを Git コミットとして保存するのかを紹介します。

## Entire CLI のインストール

Entire CLI は以下のコマンドでインストールできます。

```bash
curl -fsSL https://entire.io/install.sh | bash
```

インストールが完了したら、`entire` コマンドが使用できるようになります。

```bash
entire version

Entire CLI 0.4.4 (2f0ad9ab)
Go version: go1.25.6
OS/Arch: darwin/arm64
```

## Git レポジトリで Entire を有効にする

Git レポジトリで Entire を有効にするには、以下のコマンドを実行します。

```bash
entire enable
```

このコマンドを実行するとレポジトリに以下のファイルとブランチが作成されます。

- `.entire/` ディレクトリ: Entire の設定ファイルやセッションのコンテキストを保存するためのディレクトリ
- `.claude/` ディレクトリ: Claude Code 向けの hooks と設定ファイルを保存するためのディレクトリ
- `entire/checkpoints/v1` ブランチ: AI エージェントのセッションをチェックポイントとして保存するためのブランチ

Claude Code がインストールされている場合、Claude Code 向けの [hooks](https://code.claude.com/docs/en/hooks) と `.entire` ディレクトリが作成されます。現時点は Claude Code と Gemini CLI がサポートされています。

`.claude/settings.json` ファイルでは以下のように hooks が設定されています。

```json:.claude/settings.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code post-task"
          }
        ]
      },
      {
        "matcher": "TodoWrite",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code post-todo"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Task",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code pre-task"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code session-end"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code session-start"
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code stop"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "entire hooks claude-code user-prompt-submit"
          }
        ]
      }
    ]
  },
  "permissions": {
    "deny": [
      "Read(./.entire/metadata/**)"
    ]
  }
}
```

この設定により、Claude Code の Tool, Session, User Prompt の各イベントに対して Entire CLI のコマンドがフックされるようになります。`entire hooks` コマンドは内部的に使用されるもので、ユーザーが直接呼び出すことは想定されていません。`entire hooks` コマンドはフックイベントの種類に応じて適切な処理を実行し、AI エージェントのセッションを Git コミットとして保存するためのチェックポイントを作成します。

`.entire` ディレクトリには Entire の設定ファイルが保存されます。

```json:.entire/settings.json
{
  "strategy": "manual-commit",
  "enabled": true,
  "telemetry": true // 匿名のテレメトリデータの収集を有効にするかどうか
}
```

`strategy` フィールドは Entire がチェックポイントを作成するタイミングを制御します。`manual-commit` は自動的にセッションデータをキャプチャしますが、永続的なチェックポイントを作成するのはユーザーが明示的に Git コミットを行ったときのみであることを意味します。ほとんどのユーザーにとってこのオプションが推奨されています。`auto-commit` オプションは AI エージェントの応答後に自動でコミットを行いチェックポイントを作成します。手動でコミットを行う必要がないため便利ですが、小さなコミットが大量に作成される可能性があるため、後からコミット履歴を整理する必要があるかもしれません。

## AI エージェントのセッションを Git コミットとして保存する

Entire を有効にした後は、通常通り AI エージェントを使用してプロジェクトに取り組むことができます。以下のように Claude Code を使用してタスク管理アプリケーションを構築してみましょう。

```bash
claude "Next.js でタスク管理アプリケーションを構築してください。ユーザーはタスクを追加、編集、削除できます。タスクの状態は完了と未完了の 2 つです。タスクの状態は localStorage に保存してください。"
```

Claude Code のセッションが完了したら `.entire` ディレクトリ内に `metadata` ディレクトリが作成され、その中にセッションのコンテキストが保存されています。`metadata` ディレクトリの中にはセッションごとにサブディレクトリが作成され、その中にセッションのコンテキストを保存するためのファイルが格納されます。

```sh
.entire/metadata
  └── xxxx-xxxx-xxxx-xxxx-xxxx
    ├── context.md
    ├── full.jsonl
    ├── prompt.txt
    └── summary.txt
```

Git コミットを行うと、セッションのコンテキストがチェックポイントとして保存されます。`git commit` コマンドを実行すると、コミットと Claude Code のセッションを関連付けるかどうかを尋ねられます。

```bash
git add .
git commit -m "Implement task management application"

You have an active Claude Code session.
Last Prompt: Base directory for this skill: /Users/xxx/.claude/plugins/cache/claude-code-...
Link this commit to Claude Code session context? [Y/n]
```

`Y` を選択すると、コミットとセッションが関連付けられ、セッションのコンテキストがチェックポイントとして保存されます。`entire/checkpoints/v1` ブランチにはチェックポイント ID の最初の 2 文字で分割されたすべてのチェックポイントとセッションデータが含まれます。

```sh
.
├── 7f
│   └── 77d5ec7703
│       ├── 0
│       │   ├── content_hash.txt
│       │   ├── context.md
│       │   ├── full.jsonl
│       │   ├── metadata.json
│       │   └── prompt.txt
│       └── metadata.json
├── d6
│   └── 3130bee00b
│       ├── 0
│       │   ├── content_hash.txt
│       │   ├── context.md
│       │   ├── full.jsonl
│       │   ├── metadata.json
│       │   └── prompt.txt
│       └── metadata.json
```

チェックポイントを確認すると、各セッションのトークンの使用状況を追跡できます。また AI エージェントがコードを生成した後にユーザーが手動でコードを編集した場合はコミットのうちエージェントとユーザーの割合を計算して表示されます。

`entire explain` コマンドを使用して、チェックポイントの一覧を表示できます。

```bash
Branch: main
Checkpoints: 2

[d63130bee00b] "タスクにはタイトルの他に説明を追加でき..."
  02-14 13:18 (56cdcff) Add Task description field

[7f77d5ec7703] "Next.js でタスク管理アプリケーションを構\xe7..."
  02-14 13:11 (e3e6582) Implement task management application
```

`--checkpoint` でチェックポイント ID を指定するか、`--commit` でコミット ID を指定して、特定のチェックポイントの詳細を確認できます。

```bash
entire explain --checkpoint d63130bee00b

Checkpoint: d63130bee00b
Session: 73eb8925-db83-45b9-9306-d526b4d939fc
Created: 2026-02-14 04:18:12
Author: azukiazusa1
Tokens: 1172604

Commits: (1)
  56cdcff 2026-02-14 Add Task description field

Intent: タスクにはタイトルの他に説明を追加できるようにして<E3><81>...
Outcome: (not generated)

Files: (1)
  - app/page.tsx

Transcript (checkpoint scope):
[User] タスクにはタイトルの他に説明を追加できるようにしてください。

[Assistant] タスクに説明フィールドを追加します。タスクカードをクリックして展開すると説明が表示されるようにします。

[Tool] Edit: /Users/asai/sandbox/entire-example/app/page.tsx

[Tool] Edit: /Users/asai/sandbox/entire-example/app/page.tsx
```

`--generate` フラグを使用すると AI によりチェックポイントの要約を生成できます。このオプションを使用する場合 Claude Code がインストールされている必要があります。

```bash
entire explain --checkpoint d63130bee00b --generate

Intent: User wanted to add a description field to tasks in addition to the existing title field.
Outcome: Successfully added description functionality with expandable/collapsible task cards. Description field added to task cr
eation form, edit mode, and localStorage persistence. Tasks with descriptions show an expand icon (▼) and can be clicked to togg
le visibility.

Learnings:
  Repository:
    - Project is a Next.js task management application located at /Users/xxx/sandbox/entire-example
    - Application uses localStorage for data persistence
    - All task management logic is contained in app/page.tsx
  Code:
    - app/page.tsx: Task data structure extended to include description field alongside title
    - app/page.tsx: Implemented expand/collapse state management for individual tasks to show/hide descriptions
    - app/page.tsx: Added textarea input for description entry in both create and edit modes
  Workflow:
    - Made 18 sequential edits to a single file to implement the feature incrementally
    - Verified compilation success by reading build output from temporary task file

Files: (1)
  - app/page.tsx
```

`entire resume <branch>` コマンドで特定のブランチからセッションを再開したり、`entire rewind` コマンドでセッションを過去のチェックポイントに巻き戻すこともできます。

```bash
entire rewind

┃ Select a checkpoint to restore
┃ Your working directory will be restored to this checkpoint's state
┃ > 56cdcff (2026-02-14 13:18) Add Task description field
┃   e3e6582 (2026-02-14 13:11) Implement task management application
┃   Cancel

↑ up • ↓ down • / filter • enter submit
```

## entire.io で AI エージェントのセッションを確認する

[entire.io](https://entire.io/) のダッシュボードでは、AI エージェントのセッションをより優れた UI で確認できます。はじめに「Sign in」ボタンをクリックして GitHub アカウントでサインインします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2sHTaJ9QYQ5jPqgYC4Z4bb/e44b76e1de36498ee55530d5c3326c80/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-14_13.45.19.png)

サインイン後 GitHub App [Entire](https://github.com/apps/entire) をインストールするように求められるため、レポジトリを選択してインストールします。

![](https://images.ctfassets.net/in6v9lxmm5c8/bq9AAorceUvuI91mX4ehB/4f4805f37e9eea2644bd9aaaa65d2654/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-14_13.59.04.png)

トップページではダッシュボードが表示され、直近のアクティビティを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5hdPtXMC8bloptSxT3QmiC/7cbe97d9485d5a4eb484b22550397e39/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-14_14.02.50.png)

サイドバーから「Repositories」を選択して、レポジトリの一覧を表示します。レポジトリをクリックすると、そのレポジトリのセッションの一覧を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4BzqHoLz40spnRuYytTsww/f6397e94029ebb8e724bbd7e916a3364/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-14_14.04.49.png)

セッションの詳細を確認すると、ユーザーが入力したプロンプトや AI エージェントの応答、ツールの使用履歴、AI がコードを書いた割合などを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2WzAt88QYkE6rPni6JHDRn/6b2a2946ee0dd77d0b692edfc84963ed/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-14_14.05.55.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/33xtauvDLTWlaJHUBRuK21/8fbccfce68dbd211096f41c0feea4752/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-14_14.07.24.png)

## まとめ

- Entire は AI エージェントのセッションを Git コミットとして保存するためのツールである
- Entire CLI を使用して Git レポジトリで Entire を有効にすると、AI エージェントのセッションをチェックポイントとして保存できるようになる
- `manual-commit` 戦略を使用すると、ユーザーが Git コミットを行ったときにセッションのコンテキストが保存される
- チェックポイントは `entire/checkpoints/v1` ブランチに保存され、セッションのコンテキストやトークン使用状況などを確認できる
- `entire explain` コマンドを使用してチェックポイントの詳細を確認できる
- [entire.io](https://entire.io/) のダッシュボードで AI エージェントのセッションをより優れた UI で確認できる。ダッシュボードではユーザーのプロンプトや AI エージェントの応答、ツールの使用履歴、AI がコードを書いた割合などを確認できる

## 参考

- [Entire](https://entire.io/)
- [Hello Entire World](https://entire.io/blog/hello-entire-world)
- [Introduction - Entire](https://docs.entire.io/introduction)
