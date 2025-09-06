---
id: 4MA3G_dMJi0ID9hexxAEv
title: "Claude Code でカスタムサブエージェントを作成する"
slug: "create-custom-sub-agent-in-claude-code"
about: "Claude Code では特定の種類のタスクを処理するために呼び出されるカスタムサブエージェントを作成できます。カスタムサブエージェントを使用することでメインの会話セッションとは別に独立したコンテキストウィンドウを持つことができ、コンテキストの汚染を防ぐことができます。この記事では、Claude Code でカスタムサブエージェントを作成する方法とその利点について解説します。"
createdAt: "2025-07-26T12:17+09:00"
updatedAt: "2025-07-26T12:17+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3oPIOF58bJNhQifItARnIf/79f7046623ff1aeaeb0dcd86a4f4171f/food_takoyaki_7482-768x576.png"
  title: "たこ焼きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Code でサブエージェントを使用する主な利点として適切でないものはどれですか？"
      answers:
        - text: "コンテキストの分割により、特定のタスクに集中できる"
          correct: false
          explanation: null
        - text: "特定のドメインに特化したシステムプロンプトを設定できる"
          correct: false
          explanation: null
        - text: "メインセッションのコンテキストを汚染せずにタスクを実行できる"
          correct: false
          explanation: null
        - text: "常にメインセッションより高速にタスクを完了できる"
          correct: true
          explanation: "サブエージェントは白紙の状態から始まるため、コンテキストの収集が必要であるため遅延が発生する可能性があります。"
    - question: "個人単位でサブエージェントを作成した場合、ファイルはどこに保存されますか？"
      answers:
        - text: ".claude/agents ディレクトリ"
          correct: false
          explanation: "これはプロジェクト単位の場合の保存場所です。"
        - text: "~/.claude/agents ディレクトリ"
          correct: true
          explanation: "個人単位のサブエージェントはホームディレクトリ下の ~/.claude/agents に保存されます。"
        - text: "/usr/local/claude/agents ディレクトリ"
          correct: false
          explanation: null
        - text: "./agents ディレクトリ"
          correct: false
          explanation: null
published: true
---
Claude Code では特定の種類のタスクを処理するために呼び出されるカスタムサブエージェントを作成できます。例えばバックエンド領域に特化したエージェント、コードレビューを専門に行うエージェント、デバッグを行うエージェントといった具合です。

カスタムサブエージェントでは特有のシステムプロンプトやツール、独立したコンテキストウィンドウを持ち、Claude Code はサブエージェントにタスクを委任することでより効率的な問題解決を可能にします。

この記事では Claude Code でカスタムサブエージェントを作成する方法とその利点について解説します。

## なぜサブエージェントを使うのか？

特定のタスクに特化したサブエージェントをわざわざ作成するのはなぜでしょうか？大きく分けて 4 つの理由があります。

- コンテキストの分割
- 専門性の向上
- 再利用性
- 権限の分離

### コンテキストの分割

基本的な考え方は、我々人類が専門分野ごとに仕事を分業するのとよく似ています。例えばマイクロサービスアーキテクチャのような巨大なコードベースを一人の開発者がすべてを把握するのはほぼ不可能と言ってよいでしょう。そこでシステムアーキテクチャを分割して、各部分を専門の開発者が担当するように分業化します。フロントエンドに特化した開発者はバックエンド技術の詳細を知らなくてよくなるため、その分フロントエンド領域に集中して開発することができます。

このことは AI エージェントにも当てはまります。なぜならば LLM は限られたコンテキストウィンドウしか持たないため、あまりにも多くの情報を一度に処理できないからです。

Claude Code を使用していて 1 つのセッションが長くなりすぎた時、はじめの方にしていた指示がコンテキストウィンドウから漏れてしまった結果、期待から外れたコードを生成してしまった経験があるのではないでしょうか？タスクが大きく複雑になるにつれ、必要なステップ数が増え、LLM が目的を見失ったりする可能性が高くなります。

サブエージェントではメインの会話セッションとは別に独立したコンテキストウィンドウを持つため、特定のタスクを遂行するために指示されたプロンプトの内容を忘れることなくタスクを開始できます。そしてサブエージェントを効果的に活用するためには、[小さく単一責任のエージェント](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-10-small-focused-agents.md)として構築すべきです。エージェントが取り組むタスクを小さく集中させることで、コンテキストウィンドウを管理しやすくなり、エージェントが目的を見失うリスクを減らすことができます。

メインの会話セッションのコンテキストを「汚染」することなくタスクに取り組めるという利点もあります。例えば調査タスクを行う場合には、数多くのファイルやディレクトリを横断して調査する必要があります。その調査の過程で得られた情報はたとえ不要なものであっても、すべてがコンテキストに含まれてしまいます。サブエージェント側では多くのコンテキストを消費したとしても、メインの会話セッションには影響を与えずに要約した情報のみをメインの会話セッションに返すことができます。

なお、Claude Code ではデフォルトで `Task` ツールを使用して調査する場合にはサブエージェントを起動するアーキテクチャになっています。 

### 専門性の向上

サブエージェントは特定のタスクに特化したシステムプロンプトを持つことができます。システムプロンプトを特定のドメインに詳細に調整できるため、タスクの成功率を向上させることが期待できます。

### 再利用性

サブエージェントはプロジェクトもしくは個人単位のスコープで作成できます。例えばチームメンバーが作成したサブエージェントをプロジェクト全体で共有したり、個人で作成したサブエージェントを他のプロジェクトでも再利用できます。

### 権限の分離

サブエージェントごとに異なるツール、MCP サーバーの権限を設定できます。例えばバックエンドのサブエージェントにはデータベースへのアクセス権限を与える一方で、フロントエンドのサブエージェントにはそのような権限を与えないといったことが可能です。最小の権限の原則に従って、サブエージェントごとに必要な権限のみを与えることで、セキュリティを向上させることができます。

## カスタムサブエージェントを作成する

それでは実際に Claude Code でカスタムサブエージェントを作成してみましょう。Claude Code のバージョンが v1.0.60 以降であることを確認してください。

```bash
claude --version
1.0.61 (Claude Code)
```

サブエージェントを作成するには Claude Code を起動した後に `/agents` コマンドを入力します。

```bash
claude /agents
```

`/agents` コマンドを入力すると、サブエージェントの一覧が表示されます。まだサブエージェントを何も作成していないので、「No agents found」というメッセージが表示されます。新しいサブエージェントを作成するために `Create new agent` ボタンを選択しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/2TIb3QLm7WXMr4s7ouqKUX/db2829da84ea8a11c593ca1301c93e03/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.18.42.png)

始めにプロジェクト単位か個人単位のスコープを選択します。プロジェクト単位では `.claude/agents` ディレクトリに、個人単位では `~/.claude/agents` ディレクトリにサブエージェントが作成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1MSjb4Aae2C0hYa4j8tC4E/9a2e33eed311d68c844b9b663cba32e4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.21.03.png)

続いてどのような方法でサブエージェントを作成するかを選択します。`Generate with Claude` を選択するとユーザーが入力したプロンプトを元に Claude がサブエージェントの description と system prompt を生成します。`Manual configuration` を選択すると自分で description と system prompt を入力します。ここでは `Generate with Claude` を選択してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/513VAPq9tKW367t0ketX6W/cda2b956255792c185b42619d23e370d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.24.39.png)

プロンプトを入力する画面が表示されます。ここではプルリクエストを作成するエージェントを作成するプロンプトを入力してみましょう。

```text
GitHub のリポジトリにプルリクエストを作成するエージェントを作成してください。プルリクエストのテンプレートは必ず `.github/pull_request_template.md` に保存されているものを使用してください。プルリクエストのタイトルは `feat: xxx` や `fix: xxx` のように、変更内容を簡潔に表現するプレフィックスを付けてください。

プルリクエストを作成する際には以下の手順に従ってください。

1. 変更内容を確認する
2. 新しいブランチを作成する
3. 変更をコミットする
4. プルリクエストを作成する
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4HCjPux9wkuDqOXBrlgUMX/ee2f42dc7d7b09089819ed38ecf94a14/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.28.50.png)

Claude の応答をしばらく待った後、使用可能なツールを選択する画面が表示されます。デフォルトの設定では親セッションで使用しているツールが引き継がれる設定となっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/185wKe55py8VrIFDOv9URE/693beb0161ae648ac1684832e24b63dd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.32.20.png)

最後にサブエージェントに割り当てる色を選択します。サブエージェントの色はメインの会話セッションでサブエージェントを呼び出した際に表示され、どのサブエージェントを呼び出したのか視覚的に識別するために便利です。

![](https://images.ctfassets.net/in6v9lxmm5c8/wMf9DZLJ2b8sswn4etSGh/3b7e652bc7ef662d15f8086f4fc2e664/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.33.22.png)

作成されるサブエージェントのファイルのプレビューが表示されます。問題がなければ Enter キーを押してサブエージェントの作成を完了します。

![](https://images.ctfassets.net/in6v9lxmm5c8/1DPGviFpvwtyCZyRPq6V2K/a15b924ed4a9ae7c7bef6e7767b6b799/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_14.36.36.png)

ここでは以下のようなファイルが作成されました。YAML フロントマター形式のマークダウンファイルとなっており、`description` ではどのようなタイミングでサブエージェントを呼び出すのかが記述されています。本文ではサブエージェントのシステムプロンプトが記述されています。

```md:~/.claude/agents/github-pr-agent.md
---
name: github-pr-creator
description: Use this agent when you need to create a GitHub pull request following proper workflow conventions. Examples: <example>Context: User has made code changes and wants to create a PR. user: 'I've finished implementing the new user authentication feature. Can you create a pull request for this?' assistant: 'I'll use the github-pr-creator agent to create a properly formatted pull request with the correct template and conventional commit format.' <commentary>The user has completed a feature and needs a PR created following the project's conventions.</commentary></example> <example>Context: User has fixed a bug and needs to submit it via PR. user: 'I fixed the login validation bug. Please create a PR for this fix.' assistant: 'Let me use the github-pr-creator agent to create a pull request with the proper fix prefix and template.' <commentary>Bug fix completed, needs PR creation with conventional naming.</commentary></example>
color: orange
---

You are a GitHub Pull Request Specialist, an expert in Git workflow management and GitHub collaboration practices. You excel at creating well-structured pull requests that follow conventional commit standards and organizational templates.

Your primary responsibility is to create GitHub pull requests following a specific workflow:

1. **Change Review**: First, analyze the current changes in the working directory using `git status` and `git diff` to understand what modifications have been made. Identify the type of changes (feature, fix, refactor, etc.) and their scope.

2. **Branch Creation**: Create a new branch with a descriptive name that reflects the changes. Use conventional naming like `feature/description`, `fix/description`, or `refactor/description`. Ensure the branch name is concise but informative.

3. **Commit Changes**: Stage and commit all changes with a clear, conventional commit message. Use prefixes like `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, etc. followed by a concise description of what was changed.
4. **Pull Request Creation**: Create the pull request using the template from `.github/pull_request_template.md`. The PR title must follow the same conventional format as the commit message (e.g., `feat: add user authentication`, `fix: resolve login validation issue`).

**Critical Requirements**:
- Always use the PR template from `.github/pull_request_template.md` - read this file and populate it appropriately
- PR titles must use conventional prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, etc.
- Ensure branch names are descriptive and follow naming conventions
- Commit messages should be clear and follow conventional commit format
- Fill out the PR template completely with relevant information about the changes

**Error Handling**:
- If `.github/pull_request_template.md` doesn't exist, inform the user and ask how to proceed
- If there are no changes to commit, explain this to the user
- If branch creation fails due to conflicts, provide clear guidance
- Always verify Git repository status before proceeding

**Quality Assurance**:
- Double-check that all changes are properly staged before committing
- Verify the PR template is correctly populated
- Ensure the PR title accurately reflects the changes made
- Confirm the branch is pushed to the remote repository

You should be proactive in explaining each step as you perform it, and always confirm successful completion of the pull request creation process.
```

## サブエージェントを呼び出す

メインの会話セッションにおいて Claude Code がタスクを実行するためにサブエージェントに委任すべきだと判断した場合にサブエージェントが呼び出されます。Claude Code は以下の観点に基づいてサブエージェントを呼び出すかどうかを判断します。

- ユーザーがリクエストしたタスクの内容
- サブエージェントの `description` フィールドに記載された内容
- 現在のコンテキストと利用可能なツール

もしくはプロンプトでサブエージェントの名前を明示的に指定することでサブエージェントを呼び出すこともできます。

```text
github-pr-creator サブエージェントを使ってプルリクエストを作成してください。
```

実際にサブエージェントが呼び出されているか試してみましょう。何らかのタスクを完了した後に、プルリクエストを作成するようにリクエストしてみてみます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Gk3lcfYuCJJsSDLSPq8EH/66a3beea178f7016986f0b2382901985/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_15.20.06.png)

サブエージェントを作成したときに設定した色でサブエージェント名が表示されていて、サブエージェントにタスクが委任されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/2ww2dnblq1vHC6IiO6rsIy/a40608bbb3b3682478e79d609c654aef/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_15.25.04.png)

:::note
同じプロンプトを入力したとしても、必ずしもサブエージェントが呼び出されるわけではありません。サブエージェントをより積極的に呼び出してほしい場合にはサブエージェントの `description` フィールドに `use PROACTIVELY` や `MUST BE USED` といったフレーズを含めることが推奨されています。
:::

サブエージェントのシステムプロンプトで期待した通り、`.github/pull_request_template.md` ファイルの内容を元にプルリクエストの説明を生成していることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/4c7SwgH5hL9km40qiYJi9P/f9d833c9492a540cf21c19f391a10387/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-26_15.31.08.png)

:::tip
常にサブエージェントにタスクを委任することが効率的と限らないことに注意してください。サブエージェントの呼び出しは常に白紙の状態から始まるため、タスクを実行するために必要なコンテキストの収集から始める必要があるためです。例えばプルリクエストの作成をする場合には、サブエージェントはまず変更内容を確認するために `git status` や `git diff` を実行する必要がありますが、メインの会話セッションではすでに変更内容がコンテキストに含まれているためより早くタスクを完了できる場合があります。
:::

## まとめ

- Claude Code では特定のタスクを処理するためにカスタムサブエージェントを作成できる
- サブエージェントは独立したコンテキストウィンドウを持ち、特定のタスクに特化したシステムプロンプトやツールを使用できる
- サブエージェントはメインの会話セッションのコンテキストを汚染することなく、特定のタスクに集中できるといった利点がある
- サブエージェントはプロジェクト単位もしくは個人単位で作成できる
- サブエージェントは `/agents` コマンドを使用して対話形式で作成できる
- 作成したサブエージェントはプロジェクト単位ならば `.claude/agents` ディレクトリに、個人単位ならば `~/.claude/agents` ディレクトリに YAML フロントマター形式のマークダウンファイルとして保存される
- サブエージェントはメインの会話セッションで現在のコンテキストやサブエージェントの `description` フィールドに基づいて自動的に呼び出される
- サブエージェントの名前を指定して明示的に呼び出すこともできる

## 参考

- [Sub agents - Anthropic](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [How we built our multi-agent research system \ Anthropic](https://www.anthropic.com/engineering/built-multi-agent-research-system)
- [humanlayer/12-factor-agents: What are the principles we can use to build LLM-powered software that is actually good enough to put in the hands of production customers?](https://github.com/humanlayer/12-factor-agents?tab=readme-ov-file)
- [Benchmarking Multi-Agent Architectures](https://blog.langchain.com/benchmarking-multi-agent-architectures/)
- [AI エンジニアの立場からみた、AI コーディング時代の開発の品質向上の取り組みと妄想 - Speaker Deck](https://speakerdeck.com/soh9834/ai-enzinianoli-chang-karamita-ai-kodeingushi-dai-nokai-fa-nopin-zhi-xiang-shang-noqu-rizu-mitowang-xiang)
