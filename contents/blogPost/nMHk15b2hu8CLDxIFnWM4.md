---
id: nMHk15b2hu8CLDxIFnWM4
title: "自然言語で CI/CD パイプラインを定義する Agentic Workflows"
slug: "natural-language-ci-cd-with-agentic-workflows"
about: "Agentic Workflows は自然言語で CI/CD パイプラインを定義できるツールとして GitHub Next が開発しています。自然言語で定義されたワークフローは GitHub CLI の拡張機能として提供される gh aw コマンドでコンパイルして実行できます。これは継続体なAI（Continuous AI）を実現するためのツールです。"
createdAt: "2025-09-13T11:26+09:00"
updatedAt: "2025-09-13T11:26+09:00"
tags: ["GitHub Actions", "ai", "CI/CD"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7nSEeZr4RFMX6N4ftTgh0T/22af67e044646aa986857fb541b94f34/bitter-melon_22598.png"
  title: "ゴーヤのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Agentic Workflows のワークフローファイルはどのような形式で作成しますか？"
      answers:
        - text: ".md ファイルとして .github/workflows ディレクトリに配置"
          correct: true
          explanation: "ワークフローファイルの拡張子は .md として .github/workflows ディレクトリに配置します。マークダウンファイルのままではワークフローを実行できないため、gh aw compile コマンドでコンパイルする必要があります。"
        - text: ".yml ファイルとして .github/workflows ディレクトリに配置"
          correct: false
          explanation: ".yml ファイルは従来のGitHub Actionsの形式です。Agentic Workflowsでは自然言語で記述するため .md ファイルを使用します。"
        - text: ".json ファイルとして .github/agentic ディレクトリに配置"
          correct: false
          explanation: null
        - text: ".txt ファイルとして .workflows ディレクトリに配置"
          correct: false
          explanation: null
    - question: "Agentic Workflows で使用できるAIエンジンは何ですか？"
      answers:
        - text: "Claude と OpenAI"
          correct: true
          explanation: "記事では Claude もしくは OpenAI の API キーが必要であり、engine プロパティで 'claude' または 'openai' を指定できると説明されています。デフォルトは Claude です。"
        - text: "Claude のみ"
          correct: false
          explanation: "Claude だけでなく OpenAI も使用可能です。"
        - text: "OpenAI のみ"
          correct: false
          explanation: "OpenAI だけでなく Claude も使用可能です。実際、デフォルトは Claude となっています。"
        - text: "Gemini と Claude"
          correct: false
          explanation: null
    - question: "ワークフローをコンパイルするために使用するコマンドは何ですか？"
      answers:
        - text: "gh aw compile"
          correct: true
          explanation: "ワークフローファイルは変更するたびに gh aw compile コマンドでコンパイルする必要があります。コンパイルに成功すると .lock.yml ファイルが生成されます。"
        - text: "gh aw build"
          correct: false
          explanation: "ビルドではなくコンパイルという用語が使われており、コマンドは gh aw compile です。"
        - text: "gh aw generate"
          correct: false
          explanation: null
        - text: "gh workflow compile"
          correct: false
          explanation: null

published: true
---

:::warning
Agentic Workflows は 2025 年 9 月現在研究目的のデモンストレーションとして提供されており、大幅に機能が変更される可能性があります。本番環境での使用は推奨されません。また自己責任で使用してください。
:::

Agentic Workflows は自然言語で CI/CD パイプラインを定義できるツールとして [GitHub Next](https://githubnext.com/) が開発しています。Agentic Workflows は「あらゆるプラットフォームにおけるあらゆるソフトウェアコラボレーションをサポートする自動化された AI」を指す「継続的 AI（Continuous AI）」を実現します。継続的 AI はドキュメントの作成・コードの改善・Issue のトリアージといった自動化可能で繰り返し行われるタスクを支援することを目指しています。GitHub はこの継続的 AI を研究している段階であり、Agentic Workflows はその一環として開発されているツールです。

自然言語で定義されたワークフローは GitHub CLI の拡張機能として提供される `gh aw` コマンドでコンパイルして実行できます。つまり自然言語を信頼できる情報源として扱い、ワークフローの実行可能なステップがコードとして生成されるわけです。また Agentic Workflows は従来の GitHub Actions のコンセプトと馴染のある設計となっているため、GitHub Actions に慣れ親しんだ開発者にとっても理解しやすいものとなっています。基本的には GitHub のエコシステム中で完結できます。

Agentic Workflows では以下のユースケースが期待されています。

- Issue のトリアージやラベル付け
- 継続的な QA
- 継続的なドキュメントの生成と更新
- アクセシビリティのレビューと改善
- 継続的なテストカバレッジの改善

Agentic Workflows を活用したサンプルは以下のレポジトリで公開されています。

https://github.com/githubnext/agentics

この記事では Agentic Workflows の基本的な使い方を解説します。

## Agentic Workflows を使う

Agentic Workflows を使用する前提条件として、GitHub CLI（`gh` コマンド）がインストールされている必要があります。GitHub CLI のインストール方法については [GitHub CLI レポジトリ](https://github.com/cli/cli#installation) を参照してください。

```sh
gh --version
gh version 2.73.0 (2025-05-19)
https://github.com/cli/cli/releases/tag/v2.73.0
```

Agentic Workflows は GitHub CLI の拡張機能として提供されており、以下のコマンドでインストールできます。

```sh
gh extension install githubnext/gh-aw
```

インストールが完了したら、`gh aw` コマンドが使用できるようになります。

```sh
gh aw version
ℹ gh aw version dev
ℹ GitHub Agentic Workflows CLI from GitHub Next
```

Agentic Workflows を使用するためには Claude もしくは OpenAI の API キーが必要です。ここでは Claude を使用する例を示します。Claude の API キーは [Anthropic のダッシュボード](https://console.anthropic.com/settings/keys) から取得できます。

API キーを取得したら以下のコマンドでレポジトリのシークレットに設定します。

```sh
gh secret set ANTHROPIC_API_KEY -a actions --body "<your-anthropic-api-key>"
```

### ワークフローを作成する

ワークフローファイルは以下の 2 つのセクションで構成されます。

- メタデータセクション: YAML Front Matter 形式でワークフローのトリガーや権限、使用するツールなどを指定する
- ワークフローセクション: 自然言語でワークフローの内容を記述する

ワークフローファイルの拡張子は `.md` として `.github/workflows` ディレクトリに配置します。マークダウンファイルのままではワークフローを実行できないため、後述する `gh aw compile` コマンドでコンパイルして `.lock.yml` ファイルを生成する必要があります。

以下の例はコードのテスト、リンティング、フォーマットを実行し、エラーがあれば修正してプルリクエストに反映するワークフローです。

```markdown:.github/workflows/test.md
---
# ワークフローが実行されるトリガー
on:
  workflow_dispatch:
  pull_request:
    branches:
      - main

# ワークフローの権限
permissions: read-all

# AI エンジンのネットワークアクセス設定
network: defaults

# AI エンジン（デフォルトは Claude）
engine: claude

# ワークフローのエージェント部分に書き込み権限を与えずに、Issue の作成やコメントの追加、プルリクエストのブランチへのプッシュを可能にする設定
safe-outputs:
  push-to-pr-branch:
  create-issue:
    title-prefix: "${{ github.workflow }}"
  add-issue-comment:

# AI エンジンが使用できるツール
tools:
  web-fetch:
  web-search:
  bash: [":*"]
---

# Workflow for Running Code Tests, Linting, and Formatting

Your job is to run tests, linting, and formatting on code submitted to pull requests, make necessary fixes, and reflect the changes to the pull request.
Please execute the task following these steps:

1. Run test, lint, and format commands
2. Check the output and fix any errors
3. Reflect changes to the pull request
4. Repeat steps 1-3 until all tests pass and there are no lint or formatting errors
```

YAML Front Matter セクションでは通常の GitHub Actions のワークフローで使用可能なプロパティに加えて以下のエージェント固有のプロパティが使用できます。

- `engine`: 使用する AI エンジンを指定する。`claude` または `openai` を指定でき、デフォルトは `claude`。オプションで最大ターン数を指定できる
- `network`: AI エンジンのネットワークアクセスを制御する。デフォルトでは一般的な開発ドメインとパッケージマネージャーのドメインへのアクセスが許可される。
- `tools`: AI エンジンが使用できるツールや MCP サーバーを指定する。`web-fetch`、`web-search`、`bash` が使用可能
- `cache`: ワークフローのキャッシュ設定
- `safe-outputs`: ワークフローのエージェント部分に書き込み権限を与えずに、Issue の作成やコメントの追加、プルリクエストのブランチへのプッシュを可能にする設定

この例における設定を見てみましょう。`on` セクションではワークフローのトリガーを指定しています。ここでは手動トリガーと `main` ブランチへのプルリクエストが作成されたときにワークフローが実行されるように設定しています。

`permissions` セクションではワークフローの権限を指定しています。`read-all` を指定することで、リポジトリ内のすべてのリソースに対して読み取り権限が付与されます。基本的にここでは書き込み権限を与えずに、`safe-outputs` セクションで必要な権限を個別に付与することが推奨されます。

`safe-outputs` セクションでは Issue の作成やコメントの追加、プルリクエストのブランチへのプッシュを可能にする設定をしています。ここで指定したアクションはワークフローのエージェント部分が実行するステップの後に実行されるため、エージェントが直接リポジトリに書き込み権限を持つことはありません。

![](https://images.ctfassets.net/in6v9lxmm5c8/3XJFLViwvrmvThEZkz5h2X/398f014b55e5249e242ac8d15395afeb/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-13_13.21.09.png)

`tools` セクションでは `web-fetch`、`web-search`、`bash` ツールを使用できるように設定しています。`bash` ツールは `bash:<permission>` という形式で指定し、`:*` とすることですべてのコマンドの実行が許可されます。

マークダウンのワークフローセクションでは自然言語でワークフローの内容を記述します。この例ではコードのテスト、リンティング、フォーマットを実行し、エラーがあれば修正してプルリクエストに反映するように指示しています。先頭の `# Workflow for ...` はワークフローのタイトルとして扱われます。

:::info
2025 年 9 月現在では、日本語のワークフローはサポートされていないようです。英語でワークフローを記述してください。
:::

また `@include` ディレクティブを使用して外部ファイルをインクルードできます。

```markdown
@include relative/path/to/file.md
```

### ワークフローを compile する

ワークフローファイルは変更するたびに `gh aw compile` コマンドでコンパイルする必要があります。コマンドの引数にワークフローファイルのパスを指定します。ワークフローのメタデータセクションにエラーがある場合（存在しないプロパティが指定されているなど）はコンパイルに失敗します。

```sh
gh aw compile test
```

コンパイルに成功すると `.github/workflows/test.lock.yml` ファイルが生成されます。このファイルは自然言語を元に生成されたワークフローの実行可能なステップが YAML 形式で記述されたものです。`.lock.yml` と元の `.md` ファイルの両方をコミットしてプッシュする必要があります。基本的に `.lock.yml` ファイルは手動で編集せず、`.md` ファイルを信頼できる情報源として扱います。`--watch` オプションを指定すると、`.md` ファイルの変更を監視して自動的にコンパイルします。

<details>
<summary>`.lock.yml` ファイルの内容</summary>

```yaml:.github/workflows/test.lock.yml
---
on:
  workflow_dispatch:
  pull_request:
    branches:
      - main

permissions: read-all

network: defaults

safe-outputs:
  push-to-pr-branch:
  create-issue:
    title-prefix: "${{ github.workflow }}"
  add-issue-comment:

tools:
  web-fetch:
  web-search:
  bash: [":*"]
---

# Workflow for Running Code Tests, Linting, and Formatting

Your job is to run tests, linting, and formatting on code submitted to pull requests, make necessary fixes, and reflect the changes to the pull request.
Please execute the task following these steps:

1. Run test, lint, and format commands
2. Check the output and fix any errors
3. Reflect changes to the pull request
4. Repeat steps 1-3 until all tests pass and there are no lint or formatting errors
```

</details>

### ワークフローを実行する

コンパイルしたワークフローは `on: workflow_dispatch` トリガーが設定されていれば `gh aw run` コマンドで実行できます。コマンドの引数にワークフローファイルのパスを指定します。

```sh
gh aw run test

ℹ Running 1 workflow(s)...
Successfully triggered workflow: test.lock.yml

🔗 View workflow run: https://github.com/azukiazusa1/workflow-test/actions/runs/17691127878
✓ Successfully triggered 1 workflow(s)
```

今回作成したワークフローはプルリクエストが作成されたときにも自動的に実行されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6mwLk9rmG3sbUSHDR0Sl2f/449453e97bda4618915d1dff1d1cec53/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-13_13.29.10.png)

ワークフローの実行ログを確認すると、エージェントが Lint コマンドを実行し、エラーを検出していることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6yWZyj6v3Dm2YKKR1LZjyT/09784dc9afd081a2c9b1f49446b1eb28/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-13_13.31.44.png)

エラーの内容を理解したうえで、コードの修正を試みています。`any` 型を使用している箇所を `number` 型に修正していますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/3B7kydfTvfFuvuuZdG1KYp/4666e3246534da0af61879e68d033f95/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-13_13.33.12.png)

しかし、その後のワークフローに正しく結果が渡されていないようで、`push_to_pr_branch` ステップでは変更が検出されず、プルリクエストに反映されていません。この場合でも CI のステータスは成功となってしまうので、0 か 1 かの明確な結果を出力するワークフローは従来の GitHub Actions のワークフローで実装したほうが良いでしょう。[Agentic Workflows の examples レポジトリ](https://github.com/githubnext/agentics) では PR の CI 結果を参照に修正を試みるワークフローが公開されており、テストの実行と修正するワークフローは分離されていることがわかります。

https://github.com/githubnext/agentics/blob/main/workflows/pr-fix.md?plain=1

## まとめ

- Agentic Workflows は自然言語で CI/CD パイプラインを定義できるツールとして GitHub Next が開発している。継続的 AI を実現するためのツールとして活用し、ソフトウェア開発における繰り返し行われるタスクを自動化することを目指している
- ワークフローファイルは .md ファイルとして YAML Front Matter セクションと自然言語のワークフローセクションで構成される
- ワークフローファイルは .github/workflows ディレクトリに配置し、gh aw compile コマンドでコンパイルして .lock.yml ファイルを生成する
- ワークフローは gh aw run コマンドで実行できる

## 参考

- [GitHub Next | Agentic Workflows](https://githubnext.com/projects/agentic-workflows/)
- [githubnext/gh-aw: Safe Natural Language Agentic Workflows](https://github.com/githubnext/gh-aw?tab=readme-ov-file)
- [githubnext/agentics: Samples for GitHub Agentic Workflows](https://github.com/githubnext/agentics)
- [GitHub Next | Agentic Workflows](https://githubnext.com/projects/agentic-workflows/)
