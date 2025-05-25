---
id: uFUSh0eGRl9ekpa3kEEWQ
title: "Claude Code Action で Claude Code を GitHub に統合しよう"
slug: "claude-code-action-github-integration"
about: "Claude Code Action は Claude Code を GitHub Actions のワークフローに統合するためのアクションです。これを使用することで、GitHub 上でコードの生成やレビューを AI に依頼することができます。"
createdAt: "2025-05-25T09:32+09:00"
updatedAt: "2025-05-25T09:32+09:00"
tags: ["GitHub Actions", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1ceOpkBe22gqLVIqqpD66h/8b4f130190b37374e7e610035efb1e3e/sashimi_tako_15582-768x591.png"
  title: "タコの刺身のイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/N1WD95JGMtfrs1dlRtZeT/f5b60dc744056b7a2f5f35e00b5c5a28/Claude_Code%C3%A3__GitHub_Actions%C3%A3__%C3%A7%C2%B5_%C3%A5__.wav"
selfAssessment:
  quizzes:
    - question: "Claude Code 上で Claude Code Action をセットアップするために必要なコマンドは何ですか？"
      answers:
        - text: "/install-github-app"
          correct: true
          explanation: null
        - text: "/setup-github-app"
          correct: false
          explanation: null
        - text: "/configure-github-app"
          correct: false
          explanation: null
        - text: "/add-github-app"
          correct: false
          explanation: null
          correct: false
published: true
---

[Claude Code Action](https://github.com/anthropics/claude-code-action) は [Claude Code](https://www.anthropic.com/claude-code) を GitHub Actions のワークフローに統合するためのアクションです。これを使用することで、GitHub 上でコードの生成やレビューを AI に依頼できます。

## Claude Code Action のセットアップ

Calude Code Action のセットアップは非常に簡単です。ターミナル上で Claude Code を使用してコマンドを実行するだけです。前提として Claude Code をインストールしておく必要があります。

```bash
npm install -g @anthropic-ai/claude-code
```

`claude` コマンドを実行してインタラクティブなセッションを開始します。

```bash
claude
```

`/install-github-app` コマンドを実行すると必要な GitHub アプリとシークレットの設定が行われます。Claude Code Action を使用したいリポジトリのルートディレクトリで実行しましょう。

!> `/install-github-app` コマンドを実行するためには [gh](https://docs.github.com/ja/github-cli/github-cli/about-github-cli) コマンドが必要です。事前にインストールしておき、`gh auth login` でログインしておいてください。


実際にコマンドを実行してみると、現在のリポジトリに GitHub アプリをインストールするか、他のリポジトリにインストールするかを選択できます。ここでは現在のリポジトリにインストールすることを選びます。

![](https://images.ctfassets.net/in6v9lxmm5c8/46cTHwOsh6QtXhQTciYuGx/e7a2bfd3485e5a604ae724ce673fbe6f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.15.02.png)

リポジトリを選択すると GitHub アプリ「Claude」のインストールする画面が表示されます。必要な権限を確認し、「Install」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/1vxqHro2V3I5fyiwB1x1P2/51b8a7004461dcc98235ef3a8a3f985e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.12.36.png)

GitHub アプリのインストールが完了したらターミナルに戻って Enter キーをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/anay9dRtBfd3a9jhJXS7T/77b8cbe97bb289b125be4daf33e8d42f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.15.02.png)

現在 Claude Code で使用している API キーをそのまま使用するか、別の API キーを作成するかを選択できます。ここではそのまま使用することを選びます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3ElD7vsERqboiVJz3drUB2/9e890327889aaa10e14a095b95cf1487/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.15.18.png)

GitHub 上の UI で「Settings」→「Secrets and variables」→「Actions」を確認すると `ANTHROPIC_API_KEY` というシークレットが追加されていることが確認できます。

最後に Claude Code Action を導入するブルリクエストが作成され、ブラウザが開きます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5O2MnJqD29S6pJPndga4Me/11baa45d8031d6a3ec247acf3fa26bd6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.16.31.png)

プルリクエストでは `.github/workflows/claude.yml` というワークフローファイルが追加されています。

```yaml:.github/workflows/claude.yml
name: Claude Code

# Issue やプルリクエストのコメント、プルリクエストのレビュー、Issue のオープンやアサイン時にワークフローを実行する
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  issues:
    types: [opened, assigned]
  pull_request_review:
    types: [submitted]

jobs:
  claude:
    # Issue やプルリクエストのコメントに @claude が含まれる場合にワークフローが実行される
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read
      issues: read
      id-token: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
```

このワークフローは Issue やプルリクエストのコメント、プルリクエストのレビュー、Issue のオープンやアサイン時に実行されます。さらに `if` 条件によって、コメントやレビューの本文に `@claude` が含まれる場合にのみジョブが実行されるようになっています。

このプルリクエストをマージすると、GitHub Actions のワークフローが有効になります。

## Claude Code Action を試してみる

実際に Claude Code Action がどのように動作するか試してみましょう。まずは通常の開発のワークフローと同じように機能を追加するための Issue を作成します。「マークダウン記法として `<video>` タグをサポートする」という内容の [Issue](https://github.com/azukiazusa1/sapper-blog-app/issues/1339) を作成しました。

`@claude` でメンションして「課題の説明に基づいてこの機能を実装してください」とコメントを追加します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Qqu2oUZMbbVfIBZQK6Mjp/3a9fafdf165d33c5e054a3db9b32856d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.41.54.png)

GitHub Actions のワークフローが実行され、タスクリストが生成されて Claude によってコメントが追加されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/1GdrBLvGZOmIJB5LOjTPbu/8db6fe780cca1439200fc9dea67a5cb7/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_13.44.11.png)

ワークフローのログを確認すると、Claude の思考過程が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5VvNbgqRAMUfNT9DBptKE3/8be4f1d281e600bea38ef7ccdd875f96/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_14.05.24.png)

しばらく待つとタスクが完了し、Claude が作成したブランチに commit が追加されました。「Create PR ➔」のリンクが Issue のコメントに追加されているので、クリックしてプルリクエストを作成します。

CI が諸々失敗していたので、@claude に CI の修正を依頼するコメントを追加しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/q5bh7BYTNoQsI7jahAqEl/7fb48b1d348b2ff79ea2e3939bb409d5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_14.14.34.png)

許可されている Bash コマンド以外は実行できないとのことだったので、残りの修正は人間が行うことにしました。今回の例では Claude がプルリクエストを作成した段階で CI が失敗してしまっているという残念な結果でしたが、これは Claude Code の設定を正しく行うことで改善できる可能性があります。

使用可能なコマンドは `anthropics/claude-code-action` の `with.allowed_tools` オプションで指定できるようです。このあたりはプロジェクトの要件に応じて調整が必要でしょう。

```yaml:.github/workflows/claude.yml
      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          allowed_tools: [
            "bash",
            "git",
            "gh"
          ]
```

またプロジェクトのルートディレクトリに `CLAUDE.md` ファイルを作成してコードのスタイルやプロジェクトの構造、コマンドの実行方法などを記述することもうまく Claude を働かせるために有効なプラクティスとして推奨されています。`CLAUDE.md` ファイルは `claude` コマンドで `/init` を実行すると自動的に生成してくれます。

最後にプルリクエストのレビューを依頼するために「@claude このプルリクエストをレビューしてください」とコメントを追加しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5aIwvIijzvh4JN8G2HrJKL/addc787fda3a20ac150e49dbfc87c35a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-05-25_14.40.15.png)

ここまでが Claude Code Action を使用した基本的な使い方です。参考までにこのタスクを完了するまでのコスト `claude-opus-4-20250514` を使用して約 $4 でした。

## 特定のタイミングでタスクを依頼する

`.github/workflows/claude.yml` ファイルのでは Issue やプルリクエストのコメントに `@claude` を含む場合にワークフローが実行されるようになっています。通常の GitHub Actions のように Pull Request の作成やワークフローが dispatch されたときのように Claude を呼び出すような設定も可能です。

例としてプルリクエストの作成時に `/contents/blogPost` ディレクトリにある記事のレビューを依頼するワークフローを作成してみましょう。

```yaml:.github/workflows/review-with-claude.yml
name: Review with Claude
# 新しいプルリクエストが作成されたときと更新された時にワークフローを実行
on:
  pull_request:
    types: [opened, synchronize]
    paths:
      # 記事を保存しているディレクトリが変更されたときのみワークフローを実行する
      - contents/blogPost/**/*.md
jobs: 
  article-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Claude Code
        id: claude
        uses: anthropics/claude-code-action@beta
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # レビューを依頼するプロンプトを指定
          prompt: |
            あなたは優秀な編集者です。PRの内容を確認し、以下の点についてレビューしてください。
            - 誤字脱字や文法の誤り
            - 内容の不明瞭な箇所
            - 記事の構成や流れ
```

以下のようにプルリクエストを作成したタイミングでワークフローが実行され、記事をレビューした結果がコメントとして投稿されます。

![]()

## まとめ

- Claude Code Action を使用すると、GitHub Actions のワークフローで Claude Code を簡単に利用できる
- Claude Code で `/install-github-app` コマンドを実行することで GitHub アプリのインストールとシークレットの設定が行える
- プルリクエストのコメントやレビューで `@claude` をメンションすることで AI にタスクを依頼できる
- 通常の GitHub Actions のように特定のイベントでワークフローを実行することも可能
- プロジェクトのルートディレクトリに `CLAUDE.md` ファイルを作成してコードのスタイルやプロジェクトの構造を記述することで Claude の理解を助けることができる
- `anthropics/claude-code-action` の `with.allowed_tools` オプションで使用可能なコマンドを制限できる

## 参考

- [GitHub Actions - Anthropic](https://docs.anthropic.com/ja/docs/claude-code/github-actions)
- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action)