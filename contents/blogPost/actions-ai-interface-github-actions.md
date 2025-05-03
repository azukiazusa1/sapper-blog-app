---
id: 0xPiM-ww2MjSWRN61J9_4
title: "actions/ai-inference を使って GitHub Actions のワークフローから AI モデルを呼び出す"
slug: "actions-ai-interface-github-actions"
about: "actions/ai-interface あｈ GitHub Actions のワークフローから AI モデルを呼び出すための公式のアクションです。これを使用することで CI/CD のワークフローから AI モデルを簡単に利用できるようになります。この記事ではプルリクエスト上で AI に記事のレビューをしてもらうという実践的な使用例を紹介します。"
createdAt: "2025-05-03T08:27+09:00"
updatedAt: "2025-05-03T08:27+09:00"
tags: ["GitHub Actions", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5aIWIQTvb5SMYQOBPEKY1p/401ad9fd250ea488c81753f8b8ec11f7/onsen_rotenburo_15110-768x689.png"
  title: "露天風呂のイラスト"
audio: "https://downloads.ctfassets.net/in6v9lxmm5c8/3znZaOwFC7BjOQC9ZCuat6/057eae4899bc9acf8b7bed4d65337a32/GitHub_Actions%E3%81%A7AI%E6%B4%BB%E7%94%A8.wav"
selfAssessment:
  quizzes:
    - question: "actions/ai-interface アクションを使用するために必要な権限は何ですか？"
      answers:
        - text: "models: read"
          correct: true
          explanation: null
        - text: "contents: read"
          correct: false
          explanation: null
        - text: "ai: read"
          correct: false
          explanation: null
        - text: "pull-requests: write"
          correct: false
          explanation: null
published: true
---
[actions/ai-inference](https://github.com/actions/ai-inference) は GitHub Actions のワークフローから [GitHub Models](https://docs.github.com/ja/github-models) を呼び出すための公式のアクションです。これを使用することで CI/CD のワークフローから AI モデルを簡単に利用できるようになります。

## 使用例

まずは簡単な使用例を見てみましょう。`.github/workflows/ai-inference.yml` に以下のようなワークフローを追加します。

```yaml:.github/workflows/ai-inference.yml
name: 'AI inference'
# 手動でワークフローをトリガーするための設定
on: 
  workflow_dispatch:
  # ワークフローの入力としてプロンプトを受け取る
  # これは GitHub Actions の UI から入力できる
    inputs:
      prompt:
        description: 'Prompt for the AI model'
        required: true

jobs:
  inference:
    # GitHub Models を読み取るための権限を付与
    permissions:
      models: read
    runs-on: ubuntu-latest
    steps:
      - name: Test Local Action
        id: inference
        # actions/ai-inference アクションを使用して AI モデルを呼び出す
        uses: actions/ai-inference@v1
        with:
          # プロンプトには GitHub Actions の入力を指定
          prompt: "${{ github.event.inputs.prompt }}"
          # GitHub Models で使用可能な AI モデルを指定
          # デフォルトは gpt-4o
          model: "gpt-4o"

      - name: Print Output
        id: output
        # AI モデルの出力を表示
        run: echo "${{ steps.inference.outputs.response }}"
```

このワークフローは `on: workflow_dispatch` によって GitHub Actions の UI から手動でトリガーできます。`inputs` を使用することにより手動実行する際にユーザー入力を受け取ることができます。ここで受け取った入力は AI モデルのプロンプトとして使用されます。

`inference` ジョブでは `actions/ai-inference` アクションを使用して AI モデルを呼び出します。このアクションを使用するためには、`permissions` で `models: read` の権限を付与する必要があります。これは GitHub Models を読み取るための権限です。`prompt` には AI モデルに渡すプロンプトを指定します。ここでは `${{ github.event.inputs.prompt }}` を指定することで、手動実行時に入力されたプロンプトを使用しています。`model` には使用する AI モデルを指定します。デフォルトでは `gpt-4o` が指定されていますが、他のモデルも使用可能です。使用可能なモデルの一覧は [GitHub Models - Catalog](https://github.com/marketplace?type=models) を参照してください。

`steps.inference.outputs.response` には AI モデルの出力が格納されます。これを `echo` コマンドで表示しています。

実際にこのワークフローを実行してみましょう。GitHub のレポジトリの Actions タブに移動し、`AI inference` ワークフローを選択します。右上の `Run workflow` ボタンをクリックすると、プロンプトを入力するためのダイアログが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/CpFySWAOO3WLK1afEk62o/461d1faa2ccb90ced1a85451deeb9b62/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-03_8.52.53.png)

ダイアログにはプロンプトを入力するためのテキストボックスが表示されます。ここにプロンプトを入力して `Run workflow` ボタンをクリックすると、ワークフローが実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Gd5fUZGFgxI0TBdvhHced/5facfdeb69bfefa3e5479b026708779b/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-03_8.55.26.png)

ワークフローの実行結果を確認すると、「こんにちは！😊 今日はどんなお手伝いをしましょうか？」と出力されていることが確認できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7lDypmQ7ZgrZGfGUaDZquv/2c0ef28c9972458df0075b55951e9917/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-03_9.00.49.png)

## 記事のレビューを CI で実行する

基本的な使い方を確認したところで、実践的な使用例を試してみましょう。プルリクエスト上で AI に記事のレビューをしてもらうというものです。具体的に以下のようなワークフローを構築します。

1. プルリクエストが作成されたときにワークフローをトリガーする
2. 変更されたファイルを取得する
3. 変更されたファイルの内容を AI モデルにプロンプトとして渡す
4. AI モデルの出力をコメントとしてプルリクエストに投稿する

ファイルの内容は以下のようになります。

```yaml:.github/workflows/review-with-ai.yml
name: 'Review with AI'
on: 
  pull_request:
    paths:
      # 記事を保存しているディレクトリが変更されたときのみワークフローを実行する
      - contents/blogPost/**/*.md

jobs:
  review:
    permissions:
      models: read
      # ファイルをプロンプトとして渡すために必要な権限
      contents: read
      pull-requests: write
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
        with:
          fetch-depth: 0

      # 変更されたファイルを取得する
      - name: Get changed files in the contents folder
        id: changed-files-specific
        uses: tj-actions/changed-files@4cd184a1dd542b79cca1d4d7938e4154a6520ca7 # v46.0.0
        with:
          files: |
            contents/**

      - name: Test Local Action
        id: inference
        uses: actions/ai-inference@f8ee4c952b7dca7b8a4529edd04dc5cc3d49c435 # v1.0.0
        if: steps.changed-files-specific.outputs.all_changed_files != ''
        env:
          ALL_CHANGED_FILES: ${{ steps.changed-files-specific.outputs.all_changed_files }}
        with:
          system-prompt: |
            あなたはプロフェッショナルなテックブログ・レビューアー AIです。
            あなたの役割は、開発者や技術者が書いたブログ記事を技術的正確性・表現の明確さ・構成の論理性・読者への価値提供という観点でレビューし、フィードバックを提供することです。
          # 変更されたファイルの内容をプロンプトとして渡す
          prompt-file: "${{ env.ALL_CHANGED_FILES }}"

      - name: Comment on PR
        id: comment
        if: steps.changed-files-specific.outputs.all_changed_files != ''
        env:
          RESPONSE: ${{ steps.inference.outputs.response }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        # gh CLI を使用してプルリクエストにコメントを投稿する
        run: |
          echo "${{ env.RESPONSE }}" > comment.txt
          gh pr comment ${{ github.event.pull_request.number }} --body-file comment.txt
          echo "Commented on PR #${{ github.event.pull_request.number }} with response: ${{ env.RESPONSE }}"
```

このワークフローは `on: pull_request` によってプルリクエストが作成または編集されたときにトリガーされます。`paths` で指定したパスに変更があった場合のみワークフローが実行されます。ここでは `contents/blogPost/**/*.md` を指定しているため、`contents/blogPost` ディレクトリ以下の `.md` ファイルが変更されたときのみワークフローが実行されます。

`tj-actions/changed-files` アクションを使用して変更されたファイルを取得します。`steps.changed-files-specific.outputs.all_changed_files` には変更されたファイルのパスが格納されます。これを `ALL_CHANGED_FILES` 環境変数に渡します。この値は複数のファイルが変更された場合には空白区切りの文字列になります。ここでは簡単のために 1 つのファイルしか変更されていないことを前提にしています。

`actions/ai-inference` アクションを使用して AI モデルを呼び出します。`prompt-file` を使用するとファイルの内容をプロンプトとして渡すことができます。

`steps.inference.outputs.response` には AI モデルの出力が格納されます。これを `gh pr comment` コマンドでプルリクエストにコメントとして投稿します。`GITHUB_TOKEN` は GitHub Actions が自動的に提供するトークンで、プルリクエストにコメントを投稿するために使用します。

実際にこのワークフローを実行した結果は以下のようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7wHMDSUPt5IwHGehhvizWB/3c41ec56764a6f59d4312a0a89b1b05b/%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88_2025-05-03_10.12.18.png)

## まとめ

- `actions/ai-inference` アクションを使用すると GitHub Actions のワークフローから AI モデルを呼び出すことができる
- `prompt` を使用してプロンプトを指定する
- `model` を使用して使用する AI モデルを指定する。デフォルトでは `gpt-4o` が指定されている
- `permissions` で `models: read` の権限を付与する必要がある
- `prompt-file` を使用してファイルの内容をプロンプトとして渡すことができる

## 参考

- [actions/ai-inference](https://github.com/actions/ai-inference)
- [GitHub Models](https://docs.github.com/ja/github-models)
- [GitHub Models - Catalog](https://docs.github.com/ja/github-models/catalog)
- [GitHub Actions](https://docs.github.com/ja/actions)
