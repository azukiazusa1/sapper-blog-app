---
id: oe2ZQ3nmyDvCf7EtDeVxc
title: "Claude Code の設定をプラグインで共有する"
slug: "claude-code-plugins"
about: "Claude Code は強力なコーディング支援ツールですが、効果的に活用するためには適切な設定が必要です。プラグインを使用することで、スラッシュコマンド、サブエージェント、MCP サーバー、フックなどの設定をパッケージ化し、他のユーザーと簡単に共有できます。この記事では、Claude Code のプラグインの作成方法と利用方法について解説します。"
createdAt: "2025-10-10T19:32+09:00"
updatedAt: "2025-10-10T19:32+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/Uuys9NLsN2Xle30mHUd23/33d8310b4563b93435e62081ef5a7973/sudachi_22613-768x610.png"
  title: "すだちのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code のプラグインを配布・管理するための仕組みは何と呼ばれていますか?"
      answers:
        - text: "マーケットプレイス"
          correct: true
          explanation: "プラグインはマーケットプレイスを通じて配布や管理が行われます。マーケットプレイスは利用可能なプラグインの一覧をリストした JSON ファイルです。"
        - text: "プラグインストア"
          correct: false
          explanation: null
        - text: "リポジトリマネージャー"
          correct: false
          explanation: null
        - text: "パッケージレジストリ"
          correct: false
          explanation: null
    - question: "プラグインマニフェストファイルの正しいパスはどれですか?"
      answers:
        - text: ".claude-plugin/plugin.json"
          correct: true
          explanation: "プラグインのマニフェストは `.claude-plugin/plugin.json` に作成します。これはプラグインの名前、バージョン、説明などのメタデータを定義する JSON ファイルです。"
        - text: "package.json"
          correct: false
          explanation: null
        - text: ".claude/plugin.json"
          correct: false
          explanation: null
        - text: "manifest.json"
          explanation: null
    - question: "プラグインに含めることができる設定として、記事で紹介されていないものはどれですか?"
      answers:
        - text: "環境変数の設定"
          correct: true
          explanation: "記事ではスラッシュコマンド、サブエージェント、MCP サーバー、フックの4つが紹介されていますが、環境変数の設定については言及されていません。"
        - text: "スラッシュコマンド"
          correct: false
          explanation: "スラッシュコマンドはプラグインに含めることができる設定の1つです。よく使う操作を素早くアクセスできるようにします。"
        - text: "MCP サーバー"
          correct: false
          explanation: "MCP サーバーはプラグインに含めることができる設定の1つです。外部ツールと連携するために使用されます。"
        - text: "フック"
          correct: false
          explanation: "フックはプラグインに含めることができる設定の1つです。特定のイベントに応じて自動的に実行されます。"
    - question: "プラグインをインストールするコマンドの正しい形式はどれですか?"
      answers:
        - text: "/plugin install my-plugin@my-marketplace"
          correct: true
          explanation: "プラグインは `/plugin install <プラグイン名>@<マーケットプレイス名>` の形式でインストールします。"
        - text: "/plugin install @my-marketplace/my-plugin"
          correct: false
          explanation: null
        - text: "/install-plugin my-plugin@my-marketplace"
          correct: false
          explanation: null
        - text: "/install my-plugin@my-marketplace"
          correct: false
          explanation: null

published: true
---

[Claude Code](https://docs.claude.com/ja/docs/agents-and-tools/claude-code/overview) を使用してコーディングを行う上では、以下の設定を活用することでより効果的に作業を進めることが期待できます。

- スラッシュコマンド: よく使う操作をスラッシュコマンドとして登録し、素早くアクセスできるようにする
- サブエージェント: 特定のタスクに特化したサブエージェントを作成し、複雑なタスクを分割して処理する
- MCP サーバー: 外部ツールと連携するための MCP サーバーを設定し、Claude Code の機能を拡張する
- フック: 特定のイベントに応じて自動的に実行されるフックを設定し、Claude Code の動作をカスタマイズする

例えば私自身、以下のような設定で Claude Code を使用しており、今では欠かせないツールとなっています。

- `/article-review`: スラッシュコマンドで記事のレビューを依頼。誤字脱字や文法の誤りを重点的にチェックするようにプロンプトを調整している
- [serena MCP サーバー](https://github.com/oraios/serena/tree/main): LSP（Language Server Protocol）を利用してシンボルベースでコードを検索・編集できるようにするツール
- コード編集時のフック: コードを編集するたびに `prettier` コマンドを実行してコードフォーマットを自動的に整える

ユーザーが設定した設定を組織内やコミュニティ内で共有できるようにすれば、特定のプロジェクトに最適化された設定を簡単に利用できるようになったり、強力な設定を広く共有・改善できるようになったりするなど、Claude Code の利用体験を大幅に向上させることが期待できます。

プラグインは Claude Code の設定を共有するための仕組みとして作成されました。プラグインは Claude Code の設定をパッケージ化し、他のユーザーが簡単にインストールして利用できるようにします。この記事では、Claude Code のプラグインの作成方法、他者が作成したプラグインのインストール方法などを紹介します。

## 最初のプラグインの作成

プラグインは[マーケットプレイス](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)を通じて配布や管理が行われる仕組みとなっています。マーケットプレイスは利用可能なプラグインの一覧をリストした JSON ファイルです。コミュニティで配布する場合には GitHub リポジトリでマーケットプレイスがホストされることが想定されています。

ローカル環境でマーケットプレイスを作成し、プラグインを追加してみましょう。まずはマーケットプレイスのディレクトリを作成します。

```bash
mkdir my-marketplace
```

続いてプラグインのディレクトリを作成します。

```bash
mkdir -p my-marketplace/my-plugin
```

プラグインのマニフェストを `.claude-plugin/plugin.json` に作成します。これはプラグインの名前、バージョン、説明などのメタデータを定義する JSON ファイルです。

```json:my-marketplace/.claude-plugin/plugin.json
{
  "name": "my-plugin",
  "description": "A simple plugin that adds a hello command",
  "version": "0.0.1",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

プラグインとして提供する設定としてスラッシュコマンドを追加してみましょう。以下の例では `/hello` というスラッシュコマンドを追加しています。スラッシュコマンドは `/commands` ディレクトリ配下にマークダウンファイルとして作成します。ファイル名は `<コマンド名>.md` とします。

```markdown:my-marketplace/my-plugin/commands/hello.md
---
description: "ユーザーに愉快な挨拶を返す"
---

# hello コマンド

ユーザーに関西弁で愉快な挨拶をしてください。
```

マーケットプレイスマニフェストを `.claude-plugin/marketplace.json` に作成します。これはマーケットプレイスの情報や提供するプラグインの一覧を定義する JSON ファイルです。`plugins.source` にはプラグインのディレクトリへの相対パスを指定します。

```json:my-marketplace/.claude-plugin/marketplace.json
{
  "name": "my-marketplace",
  "metadata": {
    "description": "test marketplace",
    "version": "0.0.1"
  },
  "owner": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "source": "./my-plugin",
      "description": "A simple plugin that adds a hello command"
    }
  ]
}
```

最終的なディレクトリの構成は以下のようになります。

```bash
└── my-marketplace
    ├── .claude-plugin
    │   ├── marketplace.json
    │   └── plugin.json
    └── my-plugin
        └── commands
            └── hello.md
```

`claude plugin validate` コマンドを実行してプラグインが正しい形式であることを確認します。例えば `marketplace.json` ファイルに必須のフィールドが欠けている場合、以下のようなエラーメッセージが表示されます。

```bash
claude plugin validate ./my-marketplace
Validating marketplace manifest: /claude-code-plugin-test/my-marketplace/.claude-plugin/marketplace.json

✘ Found 3 errors:

  ❯ name: Required
  ❯ owner: Required
  ❯ plugins: Required

✘ Validation failed
✘ Manifest is invalid
```

### マーケットプレイスとプラグインのインストール

Claude Code を起動し `/plugin`（もしくは `/plugins`）コマンドを実行してマーケットプレイスを追加します。

```bash
/plugin marketplace add ./my-marketplace
```

マーケットプレイスの追加に成功すると、「✓ Successfully added marketplace:」というメッセージが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5mBTZHqThcqPIDjyv07aYZ/951064135a2a4d3e352c350b4f7abbbc/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.18.59.png)

マーケットプレイスを追加した後、以下のコマンドを実行してプラグインをインストールします。

```bash
/plugin install my-plugin@my-marketplace
```

コマンドを実行するとプラグインの説明が表示され、インストールするかどうかを確認されます。「Install now」クリックするとプラグインがインストールされます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3cy3foKtvSVOlPCxHeuJLO/dcb3caab9380d7fd9d2b939d5e5659fd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.19.34.png)

プラグインのインストールに成功した後、`/hello` を入力すると候補に `my-plugin:hello` が表示されるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/57QDBV4N2LplDsXV3PZTb6/2d80b06f2f234e746274aeda363768dd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.26.51.png)

コマンドを実行すると、プラグインで定義した通りに関西弁で愉快な挨拶が返されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3qWRJdmKIGbPjA4gaKi9Go/1eac59174ec92860fc67c398792bba68/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.28.01.png)

インストールしたプラグインは `/plugin` コマンド→「Manage & uninstall plugins」→「my-marketplace」→「my-plugin」から確認できます。ここではプラグインの有効・無効の切り替えやアンインストール、更新ができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6PrIB7llBji6ZV4jMyb1Ns/565dbf96e8663d7ef35bfee37004afac/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.31.40.png)

## マーケットプレイスを探してプラグインをインストールする

コミュニティによって開発されたマーケットプレイスを探してプラグインをインストールしてみましょう。Anthropic のブログでは以下のようなマーケットプレイスが紹介されています。

- [davila7/claude-code-templates: CLI tool for configuring and monitoring Claude Code](https://github.com/davila7/claude-code-templates)
- [wshobson/agents: A collection of production-ready subagents for Claude Code](https://github.com/wshobson/agents)

https://www.aitmpl.com/plugin にアクセスするとインタラクティブな Web UI でプラグインを探すことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/eD4KmU51FYzFjQn0ua6qI/a74ea7a59a81c0aca96af378e997317c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.40.54.png)

マーケットプレイスは以下のように GitHub の URL を指定して追加できます。

```bash
/plugin marketplace add https://github.com/davila7/claude-code-templates
```

マーケットプレイスを追加したら Claude Code 上でマーケットプレイスが利用可能なプラグインの一覧を確認できます。`/plugin` コマンドを実行し、「1. Browse & install plugins」→「claude-code-templates」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3EB3BvUFCHvw5DBpsiFvvP/f92500e136c63cc8d4f1cf7d36369d6d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.44.35.png)

試しに `documentation-generator` プラグインをインストールしてみましょう。プラグインを選択し Enter キーを押すとプラグインが提供するコマンドや MCP サーバーの一覧が表示されます。問題なければ「Install now」ボタンをクリックしてインストールします。

![](https://images.ctfassets.net/in6v9lxmm5c8/68mVnF4uWb2lF0acNVkq9e/ca48020fe69af1f5751700c097b80fde/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.46.19.png)

Claude Code を再起動するとプラグインが提供するコマンドや MCP サーバーを利用できるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/4D44MIrS0JBGU2OMCoVdvd/1abc71af651f7ffcd2aa57061bb01d71/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-10-10_20.48.42.png)

## まとめ

- Claude Code の設定をプラグインとしてパッケージ化し、他のユーザーと共有できる
- プラグインはマーケットプレイスを通じて配布・管理される
- プラグインにはスラッシュコマンド、サブエージェント、MCP サーバー、フックなどの設定を含めることができる
- プラグインの作成にはプラグインマニフェストとマーケットプレイスマニフェストを作成する必要がある
- プラグインはローカルのマーケットプレイスや GitHub などでホストされたマーケットプレイスからインストールできる
- インストールしたプラグインは `/plugin` コマンドから管理できる

## 参考

- [Customize Claude Code with plugins \ Anthropic](https://www.anthropic.com/news/claude-code-plugins)
- [Plugins reference - Claude Docs](https://docs.claude.com/en/docs/claude-code/plugin-reference)
- [Plugins - Claude Docs](https://docs.claude.com/en/docs/claude-code/plugin)
- [Plugin marketplaces - Claude Docs](https://docs.claude.com/en/docs/claude-code/plugin-marketplaces)
