---
id: rvmzssttE27yEZEabLFq-
title: "YAML ファイルで AI エージェントを構築する cagent"
slug: "yaml-file-defined-ai-agent-cagent"
about: "cagent は Docker 社が開発した AI エージェントフレームワークです。YAML ファイルでエージェントの振る舞い・役割・使用するツールを宣言的に定義でき、コードを 1 行も書かずにエージェントを構築できます。この記事では cagent の概要とインストール方法、YAML ファイルの書き方、実際にエージェントを動作させるまでの手順を解説します。"
createdAt: "2025-09-23T10:05+09:00"
updatedAt: "2025-09-23T10:05+09:00"
tags: ["AI", "cagent", "Docker"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/45YapKvzyp7K7WWIYICMpC/095603b5cd2dea2bc98a1666a65f3340/ika_squid_illust_1669-768x768.png"
  title: "かわいいイカのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "cagent でエージェントを定義するために使用するファイル形式は何ですか？"
      answers:
        - text: "YAML"
          correct: true
          explanation: "cagent では YAML ファイルでエージェントの振る舞い・役割・使用するツールを宣言的に定義します。"
        - text: "JSON"
          correct: false
          explanation: null
        - text: "XML"
          correct: false
          explanation: null
        - text: "TOML"
          correct: false
          explanation: null
    - question: "cagent でエージェントチームを対話的に作成するために使用するコマンドは何ですか？"
      answers:
        - text: "cagent new"
          correct: true
          explanation: null
        - text: "cagent create"
          correct: false
          explanation: null
        - text: "cagent init"
          correct: false
          explanation: null
        - text: "cagent generate"
          correct: false
          explanation: null
published: true
---
[cagent](https://github.com/docker/cagent) は Docker 社が開発した AI エージェントのフレームワークです。コードを 1 行も書かずに YAML ファイルでエージェントの振る舞い・役割・使用するツールを定義できる点が特徴です。Kubernetes のようにエージェントがどのように動作するかを宣言的に定義できるため、エージェントの構築と管理が容易になるように設計されています。1 つの YAML ファイルで複数のエージェントの動作を定義できるため、エージェントの共有や再利用・バージョン管理も容易となるでしょう。

この記事では cagent の概要とインストール方法、YAML ファイルの書き方、実際にエージェントを動作させるまでの手順を解説します。

## cagent のインストール

cagent は [Releases](https://github.com/docker/cagent/releases) ページから OS ごとにビルドされたバイナリをダウンロードしてインストールできます。ここでは macOS を例にインストール手順を解説します。ダウンロードしたバイナリに実行権限を付与してパスの通ったディレクトリに配置します。

```bash
chmod +x ~/Downloads/cagent-darwin-amd64
sudo mv ~/Downloads/cagent-darwin-amd64 /usr/local/bin/cagent
```

以下のコマンドで `cagent` コマンドが実行できることを確認します。

```bash
cagent version
```

以下のようにバージョン情報が表示されればインストールは成功です。

```bash
For any feedback, please visit: https://docker.qualtrics.com/jfe/form/SV_cNsCIg92nQemlfw

cagent version v1.5.0
Build time: 2025-09-22T13:42:22Z
Commit: 0bc99d078bb64ccfe36efa92b44b7aabdd423c0e
```

続いて使用する LLM モデルに応じた API キーを環境変数に設定します。使用するモデルに応じて以下のいずれかの環境変数を設定してください。

```bash
# If using the Docker AI Gateway, set this environment variable or use
# the `--models-gateway <url_to_docker_ai_gateway>` CLI flag

export CAGENT_MODELS_GATEWAY=<url_to_docker_ai_gateway>

# Alternatively, set keys for remote inference services.
# These are not needed if you are using Docker AI Gateway.

export OPENAI_API_KEY=<your_api_key_here>    # For OpenAI models
export ANTHROPIC_API_KEY=<your_api_key_here> # For Anthropic models
export GOOGLE_API_KEY=<your_api_key_here>    # For Gemini models
```

## 初めての cagent エージェント

それでは実際に YAML ファイルを作成してエージェントを動作させてみましょう。以下の内容で `my_agent.yaml` というファイルを作成します。

```yaml:my_agent.yaml
agents:
  root:
    model: openai/gpt-5-nano
    description: "A helpful assistant"
    instruction: |
      あなたは有能なアシスタントです。ユーザーの質問に対して関西弁で答えてください。
```

以下のコマンドでエージェントを起動します。

```bash
cagent run my_agent.yaml
```

コマンドを起動すると、ターミナル上でチャットインターフェースが起動します。質問を入力してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5zFicl7iQ7qRGoro8GYnmW/5aeb99999b8196b897dc66e32cbed370/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_10.40.40.png)

以下のように関西弁で回答が返ってくれば成功です。

![](https://images.ctfassets.net/in6v9lxmm5c8/3TCOpoJOn9xYvyXxvhhPta/0f43dcc63f28d4bb9bffe3b95b2d3e24/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_10.54.15.png)

### ツールの使用

高度なエージェントを構築するには、外部ツールの使用が不可欠です。cagent では以下の 2 つの方法でツールを使用できます。

- 組み込みツール: cagent に組み込まれたツールで特別な設定なしに使用可能。ファイルシステム操作, thinking, todo, memory など
- MCP ツール: [Model Context Protocol (MCP)](https://modelcontextprotocol.org/) に準拠したツール。`stdio`, `http`, `sse` 3 つのトランスポートをサポート。[Docker MCP Gateway](https://docs.docker.com/ai/mcp-gateway/) 経由でコンテナ化された MCP ツールを使用できる他、任意のコマンドを実行して MCP ツールを起動できる

以下の例では以下の 2 つのツールを使用します。

- `todo`: タスク管理ツール
- `docker:duckduckgo`: Docker MCP Gateway 経由で使用する DuckDuckGo 検索ツール

DuckDuckGo ツールを使用するには Docker Desktop の「MCP Toolkit」で DuckDuckGo サーバーを有効にしておく必要があります。「Catalog」タブで「DuckDuckGo」を選択して「Add Server」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/67m3gfjMacCekMwFpHyQ41/a06717742eef5ed95d06f2ba8eb25f50/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_11.43.23.png)

正常に追加されると「My Servers」タブに表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7yAW1pCcnpRERjLiXvtLyK/b342f1051cb18f006db9114e3f24957f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_11.44.33.png)

ツールは `toolsets` セクションで定義します。

```yaml:my_agent_with_tools.yaml
agents:
  root:
    model: openai/gpt-5-nano
    description: "A helpful assistant"
    instruction: |
      あなたは有能なアシスタントです。ユーザーの質問に対して関西弁で答えてください。
    toolsets:
      # 組み込み TODO ツール
      - type: todo
      # Docker MCP Gateway 経由で使用する DuckDuckGo 検索ツール
      - type: mcp
        command: docker
        args: ["mcp", "gateway", "run", "--servers=duckduckgo"]
```

「明日の天気を調べて」というユーザーの質問に対して、TODO ツールを使用して何をすべきかを考えていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6Tl5kLBB9MB8dTiRxzdP9o/736edacba57138bf484367bb9c1e6b26/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_11.32.00.png)

組み込みではないツールを使用する際にはユーザーによる確認が求められます。Web 検索することを許可しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/3DPqN5STI286JKQA8nKfve/fb19595ce637d03cab55fb009f7d134a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_11.46.25.png)

最終的に Web から取得した情報をもとに回答が返ってきます。

![](https://images.ctfassets.net/in6v9lxmm5c8/IEHdncBxe3LrpydPFSI9z/748baee6c3091bf2bc5634e25698da0a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_11.49.49.png)

## エージェントチームの作成

より複雑で高度なタスクを実行するために、複数のエージェントが協力して作業するエージェントチームを作成できます。`root` セクションで定義されたエージェントは複数のサブエージェントにタスクを委任し、最終的に結果を統合してユーザーに提供します。サブエージェントを使用したタスクの分割はエージェントごとに専門性を持たせたり、コンテキストを分割することで余分な情報を排除するため、より精度の高い回答が期待できます。

サブエージェントを構築する際に手動で YAML ファイルを編集できますが、cagent にはエージェントチームを自動的に生成する `cagent new` コマンドが用意されています。`cagent new` コマンドを使用することで対話的にエージェントチームを構築できます。

`cagent new` コマンドの実行には LLM モデルの API キーが必要です。環境変数 `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY` のいずれかを設定してからコマンドを実行してください。

```bash
export OPENAI_API_KEY=<your_api_key_here>
```

環境変数が設定されていれば対応する LLM モデルが自動的に選択されます。`--model` オプションで使用するモデルを明示的に指定できます。`cagent new` コマンドを実行すると、エージェントチームの目的を尋ねられます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3BkenGvCf8891DuZWlwHVt/0b90ba2ad34a595be12dc4a3ad6616eb/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_12.06.50.png)

ここではユーザーの指定したトピックについて記事を書くエージェントチームを作成してみましょう。

```markdown
ユーザーの指定したトピックについて記事を書くエージェントチームを作成してください。

- ウェブを検索して正確な情報を収集してください
- 収集した情報をもとに記事のアウトラインを作成してください
- アウトラインをもとに記事を書いてください
- 記事の内容を批判的にレビューしてください
- 作成した記事は `article/YYYY-MM-DD-topic.md` というファイル名で保存してください
```

コマンドを実行すると `topic_article_writer.yaml` という YAML ファイルが作成されます。このファイルには以下の 4 つのサブエージェントが含まれています。

- `topic_researcher`: トピックの調査と信頼できる情報源の収集を担当。
- `outline_writer`: 調査結果をもとに記事のアウトラインを作成。
- `content_writer`: アウトラインをもとに記事の本文を執筆。
- `editor`: ドラフトの編集・校正・仕上げを担当。

```yaml:topic_article_writer.yaml
version: "2"

models:
  openai:
    provider: openai
    model: gpt-5-mini
    max_tokens: 64000

agents:
  root:
    model: openai
    description: "ユーザー指定のトピックについての記事を作成するエージェントチームの入口。トピックの調査、アウトライン作成、ドラフト執筆、編集、最終納品を統括し、サブエージェントへタスクを委任します。"
    instruction: |
      ユーザーから渡されたトピックをもとに、記事作成の全プロセスを設計・実行します。まず調査を行い、信頼できる情報源を抽出した研究ブリーフを作成します。その後、研究ブリーフとトピックに基づくアウトラインを生成し、ドラフトを執筆します。最後に編集・校正を行い、納品可能な記事を提供します。必要に応じてサブエージェントへタスクを分解して委任します。
    toolsets: []
    sub_agents:
      - topic_researcher
      - outline_writer
      - content_writer
      - editor
    add_date: true
    add_environment_info: false

  topic_researcher:
    model: openai
    description: "トピックの調査と信頼できる情報源の収集を担当。"
    instruction: |
      受け取ったトピックを元に背景、最新動向、信頼できる出典をリスト化した研究ブリーフを作成します。出典はURLと概要を含め、引用形式のプレースホルダを用意します。
    toolsets: []

  outline_writer:
    model: openai
    description: "記事のアウトラインを作成。導入・本論・結論・セクション構成を設計します。"
    instruction: |
      topic_researcher からの研究ブリーフとユーザー指定トピックを基に、SEOを意識したセクション構成のアウトラインを作成します。各セクションの要点とキーワードを明記します。
    toolsets: []

  content_writer:
    model: openai
    description: "実際の本文ドラフトを執筆します。"
    instruction: |
      outline_writer のアウトラインと topic_researcher の研究ブリーフを統合して、読みやすく説得力のある記事を日本語で執筆します。導入・本論・結論・参考リンクのドラフトを含みます。トーンは中立的・教育的。
    toolsets: []

  editor:
    model: openai
    description: "ドラフトの編集・校正・仕上げを担当。"
    instruction: |
      content_writer のドラフトを校正・改善します。語彙、文体、SEO、誤情報の確認を行い、公開向けの最終版を作成します。変更点の要約と最終納品物を提示します。
    toolsets: []
```

`root` のエージェントでは `sub_agents` セクションで使用可能なサブエージェントを配列で指定します。各サブエージェントは `agents` セクションで定義され、`description` と `instruction` でそれぞれの役割と振る舞いを指定します。この時点では `toolsets` セクションが空になっているので、必要に応じて必要なツールを追加する必要があるでしょう。

`cagent run` コマンドでエージェントチームを起動してみましょう。

```bash
cagent run topic_article_writer.yaml
```

ユーザーの「React の useEffect のベストプラクティスについて」という要求に対して、`root` エージェントが `topic_researcher` サブエージェントにタスクを委任していることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3BEP6O3v3b2Z8jKOvaXpKA/0ca776a2c85336a48e035fe7ac6a64e2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-23_12.16.27.png)

## エージェントの共有

作成したエージェントは Docker Hub 上で公開し、他のユーザーと共有できます。`cagent push` コマンドを使用してエージェントを公開します。以下のコマンドでは `topic_article_writer.yaml` ファイルを `azukiazusa/topic_article_writer:0.0.1` という名前で Docker Hub に公開します。コマンドの実行前に `docker login` コマンドで Docker Hub にログインしておく必要があります。

```bash
cagent push topic_article_writer.yaml azukiazusa/topic_article_writer:0.0.1
```

`cagent push` コマンドを実行すると Docker イメージがビルドされ、Docker Hub にプッシュされます。以下の URL で公開したエージェントを確認できます。

https://hub.docker.com/repository/docker/azukiazusa/topic_article_writer/general

他のユーザーは `cagent pull` コマンドでエージェントを取得できます。

```bash
cagent pull azukiazusa/topic_article_writer:0.0.1
```

`cagent pull` コマンドに成功すると、`azukiazusa_topic_article_writer:0.0.1.yaml` というファイルが作成されます。このファイルは先程作成した `topic_article_writer.yaml` と同じ内容です。

## まとめ

- cagent は YAML ファイルでエージェントの振る舞いを定義できる AI エージェントフレームワーク
- YAML 形式でエージェントの役割、使用する LLM モデル、外部ツールを宣言的に定義できる
- ツールは組み込みツールと MCP ツールを使用できる
- `cagent run` コマンドでエージェントを起動し、ターミナル上でチャットインターフェースを使用できる
- `cagent new` コマンドでエージェントチームを対話的に作成できる
- `cagent push` コマンドでエージェントを Docker Hub に公開し、`cagent pull` コマンドで Docker Hub からエージェントを YAML ファイルとして取得できる

## 参考

- [docker/cagent: Agent Builder and Runtime by Docker Engineering](https://github.com/docker/cagent)
- [cagent | Docker Docs](https://docs.docker.com/ai/cagent/)
- [cagentを使用したAIエージェントとワークフローの構築と配布 | Docker](https://www.docker.com/ja-jp/blog/cagent-build-and-distribute-ai-agents-and-workflows/)
