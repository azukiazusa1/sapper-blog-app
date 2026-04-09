---
id: DNPrWAJE70Dokw6oF5dPS
title: "大規模にエージェントを構築する Claude Managed Agents を試してみた"
slug: "claude-managed-agents"
about: "Claude Managed Agents は Claude を自律的なエージェントとして動作させるためのハーネスとインフラストラクチャーを提供します。長時間かかるタスクや非同期のタスクを実行するために使用するのが想定されています。この記事では実際に Claude Managed Agents を試してみた内容を紹介します。"
createdAt: "2026-04-09T19:03+09:00"
updatedAt: "2026-04-09T19:03+09:00"
tags: ["claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6g3zNuqfqDdQzRP2hUNOLB/bdfd663d721484aedb24af8836a61ce4/standard_bicycle_12094-768x591.png"
  title: "自転車のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Managed Agents を使用する主な利点として最も適切なものはどれか？"
      answers:
        - text: "Claude 以外の AI モデル（GPT, Gemini など）もエージェントとして利用できる"
          correct: false
          explanation: "Managed Agents は Claude 専用に開発されたサービスであり、他の AI モデルには対応していません。"
        - text: "エージェントの実行に必要なサンドボックス環境やストレージなどのインフラ構築が不要になる"
          correct: true
          explanation: "Managed Agents はエージェントを動かすためのインフラストラクチャー（サンドボックス環境・ストレージ・モニタリング・アクセス権限など）を提供するため、開発者はユーザーに価値を提供する本質的な開発に集中できます。"
        - text: "エージェントのレスポンス速度が通常の Claude API より高速になる"
          correct: false
          explanation: "Managed Agents の利点はインフラ構築の省力化であり、レスポンス速度の高速化は主な利点として挙げられていません。"
        - text: "無料で無制限にエージェントを実行できる"
          correct: false
          explanation: "Managed Agents は従量課金制のサービスであり、通常の API 使用量に加えてアクティブな実行時間あたりの料金が加算されます。"
    - question: "Managed Agents においてセッションの役割として正しいものはどれか？"
      answers:
        - text: "エージェントが使用するモデルやシステムプロンプトを定義する"
          correct: false
          explanation: "モデルやシステムプロンプトの定義はエージェントの役割です。セッションはエージェントと環境を組み合わせてタスクを実行します。"
        - text: "ネットワークアクセスやプレインストールパッケージを設定する"
          correct: false
          explanation: "ネットワークアクセスやパッケージの設定は環境の役割です。"
        - text: "ユーザーの指示やエージェントの応答をイベントとして記録する"
          correct: false
          explanation: "これはイベントの役割です。セッション自体はエージェントと環境を組み合わせたタスク実行のインスタンスです。"
        - text: "エージェントと環境を組み合わせてタスクを実行し、会話履歴を保持する"
          correct: true
          explanation: "セッションはエージェントと環境を参照し、会話履歴を保持するインスタンスです。ユーザーがメッセージを送信することでエージェントがタスクを実行し始めます。"
    - question: "GitHub MCP サーバーをエージェントから利用するために必要な手順として正しいものはどれか？"
      answers:
        - text: "エージェントの YAML 設定に GitHub のアクセストークンを直接記述する"
          correct: false
          explanation: "認証情報を YAML に直接記述するのではなく、Vault を使用して安全に保管する必要があります。"
        - text: "エージェントの mcp_servers に URL を定義するだけで認証なしにアクセスできる"
          correct: false
          explanation: "GitHub MCP サーバーは OAuth 認証が必要なため、mcp_servers の定義だけではアクセスできません。"
        - text: "Vault に認証情報を保管し、セッション開始時にリソースとしてリポジトリを指定する"
          correct: true
          explanation: "GitHub MCP サーバーの利用には Vault への認証情報の保管が必要です。さらにセッション開始時にリソースとして GitHub リポジトリを指定し、Fine-grained token で認証します。"
        - text: "環境のネットワーク設定を unrestricted モードにすれば自動的に認証される"
          correct: false
          explanation: "ネットワーク設定の unrestricted モードはネットワークアクセスの許可に関するもので、GitHub の認証とは無関係です。"
published: true
---

クラウドホスト型エージェントを大規模に構築・展開するためのサービスである Claude Managed Agents がパブリックベータとしてリリースされました。Claude Managed Agents は Claude を自律的なエージェントとして動作させるための[ハーネス](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)とインフラストラクチャーを提供します。長時間かかるタスクや非同期のタスクを実行するために使用するのが想定されています。

自律的に動作するエージェントを動かす環境を作ろうとすると、安全なサンドボックス環境・エージェントの状態を保存するためのストレージ・エージェントの状態を監視するためのモニタリングツール・アクセス権限など、様々な開発工数がかかります。Managed Agents を使用することで、これらのインフラストラクチャーを構築する必要がなくなり、ユーザーに価値を提供するという本質的な開発に集中できます。Managed Agents は AI モデルとして Claude 専用に開発されており、Claude の能力を最大限に引き出すための最適化が施されています。

この記事では実際に Claude Managed Agents を試してみた内容を紹介します。この記事を読むと、Claude Managed Agents の基本概念を把握し、Claude Console でセッションを開始して、GitHub リポジトリに接続したエージェントに実務的なタスクを依頼する流れをひととおり追えるようになります。

:::info
Claude Managed Agents は従量課金制のサービスです。通常の Claude API のトークン使用量に加えて、セッションが `running` 状態だった時間に対して 1 セッション時間あたり 0.08 ドルが加算されます。`idle` や `terminated` の時間は課金対象に含まれません。料金の詳細は[ドキュメント](https://platform.claude.com/docs/en/about-claude/pricing#claude-managed-agents-pricing)を参照してください。
:::

## Claude Managed Agents を始める

まずは Claude Managed Agents の基本的な操作感をつかむために、Claude Console 上でエージェントの作成からセッションの開始までを順番に試してみます。

Claude Managed Agents は Claude Console もしくは SDK を使用して API 経由で利用できます。`/v1/agents` エンドポイントでエージェントを作成し、`/v1/sessions` エンドポイントでセッションを開始するといった形です。Claude Console を使用する場合、エージェントの作成からセッションの開始までの一連の流れを UI 上で対話形式で進めることができます。

ここでは Claude Console を使用して利用する方法を紹介します。[Claude Managed Agents のクイックスタートガイド](https://platform.claude.com/workspaces/default/agent-quickstart) にアクセスすると、Claude Managed Agents を始めるためのガイドが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1byEy2tY5vJM30IYSf0UIu/b5a3135315c8ccd223f4ee80fb8b92da/image.png)

Managed Agents は以下の 4 つの概念を中心に構成されています。

1. エージェント: モデル, システムプロンプト, ツール, MCP サーバー, スキルを設定してエージェントを作成する
2. 環境: エージェントがタスクを実行するための環境を作成する。クラウドコンテナにプレインストールされたパッケージ（Python, Node.js, Go など）やネットワークアクセスを設定する
3. セッション: エージェントと環境を組み合わせてタスクを実行するインスタンス。会話履歴を保持する
4. イベント: ユーザーの指示やエージェントの応答など、セッション内のやり取りを表す単位

クイックスタートガイドではまずはじめにエージェントを選択する画面が表示されています。エージェントは、あらかじめ用意されたテンプレートから選択もできますし、ゼロから自分で作成もできます。テンプレートには、タスク管理エージェントやコード生成エージェントなど、様々なユースケースに対応したものが用意されています。例えば Incident Commander テンプレートを選択してみると、以下のような YAML 形式の設定が表示されます。

```yaml
name: Incident commander
description: Triages a Sentry alert, opens a Linear incident ticket, and runs the Slack war room.
model: claude-opus-4-6
system: |-
  You are an on-call incident commander. When handed a Sentry issue ID or an error fingerprint:

  1. Pull the full event payload, stack trace, release tag, and affected-user count from Sentry.
  2. Grep the repo for the top frame's file path and surrounding commits (last 72h).
  3. Open a Linear incident ticket with severity, suspected blast radius, and your rollback recommendation.
  4. Post a threaded status to the incident Slack channel: what broke, who's looking, ETA for next update.
  5. Every 15 minutes, re-check Sentry event volume and update the thread until the user closes the incident.

  Be decisive. If you're >70% confident it's a specific deploy, say so and recommend the revert.
mcp_servers:
  - name: sentry
    type: url
    url: https://mcp.sentry.dev/mcp
  - name: linear
    type: url
    url: https://mcp.linear.app/mcp
  - name: slack
    type: url
    url: https://mcp.slack.com/mcp
  - name: github
    type: url
    url: https://api.githubcopilot.com/mcp/
tools:
  - type: agent_toolset_20260401
  - type: mcp_toolset
    mcp_server_name: sentry
    default_config:
      permission_policy:
        type: always_allow
  - type: mcp_toolset
    mcp_server_name: linear
    default_config:
      permission_policy:
        type: always_allow
  - type: mcp_toolset
    mcp_server_name: slack
    default_config:
      permission_policy:
        type: always_allow
  - type: mcp_toolset
    mcp_server_name: github
    default_config:
      permission_policy:
        type: always_allow
metadata:
  template: incident-commander
```

この設定では、Sentry のアラートをトリアージして Linear にインシデントチケットを開き、Slack でウォールームを実行するエージェントが定義されています。エージェントは `claude-opus-4-6` モデルを使用し、システムプロンプトにはエージェントの役割とタスクの手順が記載されています。`mcp_servers` や `tools` でエージェントが利用可能なツールが定義されていることが確認できます。

ここでは `Blank agent` テンプレートを選択して、汎用的なエージェントを作成してみましょう。YAML もしくは JSON の設定画面が表示されるので、内容を確認して「Use this template」をクリックします。これでエージェントが作成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7eux98Ujc9adbQZyfukI7V/b552b669a4adec0e77f07aef6a0d147d/image.png)

エージェントは `/v1/agents` エンドポイントに POST リクエストを送ることで作成されます。コンソールには実行ログが表示されています。エージェントが作成されたら「Next: Configure environment」をクリックして環境の設定に進みましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/7pBRvt2P930Hx8JVupWHUg/751c6389e85f7daa688cd36433b767ca/image.png)

エージェントと対話形式で環境の設定が進められていきます。質問では環境がオープンなインターネットにアクセスできるか、それとも特定のホストのみにアクセスできるようにするかが聞かれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/38RnwzpQcBTsiGrkqGs5zG/1c84301a57a9ff95ab6bb46390b205ad/image.png)

ネットワークのモードとしては `unrestricted` と `limited` の 2 種類が用意されています。`unrestricted` モードでは環境は一部のブロックリストを除き、すべてのネットワークアクセスが許可されます。`limited` モードではデフォルトでネットワークアクセスがブロックされ、`allowed_hosts` に指定されたホストへのアクセスのみが許可されます。その他 `allow_mcp_servers`, `allow_package_managers` オプションも用意されており、`true` に設定するとそれぞれ MCP サーバーや公開パッケージマネージャー（PyPI, npm など）へのアクセスが許可されます。

ネットワークアクセスを許可する形でエージェントの質問に返答すると、`/v1/environments` エンドポイントに POST リクエストが送られて環境が作成されます。環境が作成されたら「Next: Start session」をクリックしてセッションを開始しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/1jSZ9iAyssiY2qn7aSIKkF/35e5c54b30be08ee562d8271ae4a78a5/image.png)

`/v1/sessions` エンドポイントに POST リクエストを送ることでセッションが開始されます。セッションとは環境内で実行されているエージェントのインスタンスのことです。セッションはエージェントと環境を参照し、会話履歴を保持します。セッションを開始したタイミングではまだタスクは実行されていません。セッションを開始した後に、ユーザーがメッセージを送信することでエージェントがタスクを実行し始めます。

セッションが開始されると、右側にメッセージを送信するための入力フォームが表示されるので、何かメッセージを送信してエージェントに指示を出してみましょう。プレイスホルダーとして「Search the web for the latest news about Claude AI and summarize the top 3 stories.」と表示されているので、これをそのまま入力して送信してみます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5lKKRoFBUT9qSsZvFWVdB5/b81dfb90ec3b8a4cf932471e3de2d89c/image.png)

メッセージの送信自体は `/v1/sessions/:session_id/events` エンドポイントへの POST リクエストで行われます。一方で、イベントのストリームは `/v1/sessions/:session_id/stream` から受信します。Console 上ではこれらが一連の操作として表示されるためひと続きに見えますが、API レベルでは送信と受信でエンドポイントが分かれています。ストリームには Web Search ツールの呼び出しやエージェントのレスポンスが順次流れてきます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3hQkJtyXBoRCRIVBhAUpqd/b81047aeb9cabe23dd94cc85664a045b/image.png)

最初にメッセージを送信した後、エージェントがタスクを実行してレスポンスを返すまでの一連の流れは、イベントのやりとりとして記録されていきます。イベントには、ユーザーがセッションを開始したりセッションを制御するために送信する「ユーザーイベント」と、セッションの状態の変化やエージェントの進行状況を監視するための「エージェントイベント」「セッションイベント」「スパンイベント」に分類されます。

イベントタイプを示す文字列は `{domain}.{action}` という形式になっており、以下のようなイベントが存在します。

- `user.message`: ユーザーがセッションにメッセージを送信したときに発生するイベント
- `agent.message`: エージェントからの応答
- `agent.tool_use`: エージェントがツールを使用したときのイベント
- `session.status_idle`: エージェントが現在のタスクを完了し、アイドル状態になったときのイベント
- `span.model_request_start`: モデルへのリクエストが開始されたときのイベント

エージェントのレスポンスの詳細を確認すると、確かにニュースの要約が返ってきていることがわかりますね。これでクイックスタートガイドは完了です。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Qv2duUFerJHS4EWv1CYLe/5ae12a7d530998fa9b55373b1deec17c/image.png)

## GitHub リポジトリに接続してプルリクエストを作成してもらう

基本操作を確認したので、次は GitHub MCP サーバーと GitHub repository リソースを組み合わせて、コード変更からプルリクエスト作成までを任せる例を試します。

Managed Agents の基本的な概念を一通り理解したところで、次は GitHub リポジトリに接続してプルリクエストを作成してもらうという実践的なタスクをやってもらいましょう。まずは GitHub MCP サーバーにアクセスできるエージェントを作成します。左サイドバーの「Agents」からエージェントの一覧ページにアクセスし、「New agent」をクリックしてエージェントの作成を開始します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2RM48MX6edqs3i2qHtaHBC/c399526f480e8c697b3c71af80e64831/image.png)

モーダルで YAML 形式のエージェントの設定を入力していきます。以下のような内容にしてみましょう。

```yaml
name: Coding assistant
description: An agent that can create a pull request in GitHub.
model: claude-sonnet-4-6
system: |-
  You are a coding assistant. You can use the GitHub MCP server to interact with GitHub repositories.
# MCP サーバーの定義。GitHub MCP サーバーの URL を指定する
mcp_servers:
  - name: github
    type: url
    url: https://api.githubcopilot.com/mcp/
tools:
  # bash, read, write, web_search などの基本的なツールセット
  - type: agent_toolset_20260401
  # mcp_servers を定義した場合、type: mcp_toolset を指定して MCP サーバーをツールとして使用できるようにする
  - type: mcp_toolset
    mcp_server_name: github
    default_config:
      permission_policy:
        type: always_allow
```

作成後のエージェントを確認すると、GitHub MCP サーバーがツールとして定義されていて `create_pull_request` などの操作が使用可能になっていることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4RjMt6hXpAoTK4scmEy8yF/cb3bc7c3a8193d83b3fd04e886595ae6/image.png)

ただしこのままでは GitHub MCP サーバーに認証されていないため、エージェントは GitHub MCP サーバーにアクセスできません。私が試したときは OAuth を使うフローに案内され、その認証情報を Vault に保管する形でした。認証情報は `mcp_server_url` にバインドされ、エージェントが MCP サーバーにアクセスする際に使用されます。Vault に認証情報を保管するためには、左サイドバーの「Credential vault」から「New value」をクリックします。

私が試したときは、エージェントの設定から「Guided Edit」をクリックしてエージェントと対話形式で認証の問題を解決しました。「github mcp サーバーの認証を完了するには？」という質問に対して「GitHub の MCP サーバーへの認証は Vault（ボールト）を通じて行います。」という回答が返され、そのまま Vault に認証情報を保管するためのフローを実行してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6L8dHHz22uQWse81w3hky2/683846ea1e236e7e3f4f7ee2ae182e06/image.png)

次にセッションを作成します。セッションを開始する際にオプションでリソースを指定できます。リソースには「GitHub repository」や「File」などがあり、セッション開始時にエージェントがアクセスできるリソースを指定できます。ここで指定する GitHub repository リソースは、先ほど Vault に保存した GitHub MCP サーバーの認証とは別に、リポジトリをクローンするための認証情報を受け取ります。エージェントには先程作成した「Coding assistant」エージェントを指定し、リソースには「GitHub repository」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3dFCwihQAfJwzBhwJKd9is/c38a1b8ab3c3d5b2f96f67a8379b1bc6/image.png)

リソースのオプションを入力するフォームが表示されるので、GitHub のリポジトリの URL と Authentication Token を入力します。Authentication Token は GitHub で Developer Settings → Fine-grained tokens から作成できます。Token を作成する際には以下の権限を付与する必要があります。

- Contents: Read and write
- Pull requests: Read and write
- Repository metadata: Read

![](https://images.ctfassets.net/in6v9lxmm5c8/2ajhBJD9UVnVdxuhZu9S9q/85243560ec1e175196403a8d76c65cab/image.png)

セッションを作成したらエージェントに指示を出してみましょう。ここでは試しに「記事の詳細画面の関連記事の見出しのフォントサイズを 1rem に変更し、その変更をプルリクエストとして作成して」という指示を出してみます。

エージェントがコードベースを分析して、変更すべきファイルを特定し、`Edit` ツールを使用してコードを変更している様子が確認できます。タスクが完了したらエージェントは Idle 状態に遷移します。今回は実際に対象ファイルの修正案を作成し、プルリクエスト作成に必要な操作まで進められることを確認できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/8GvqYb56cxHEj1VItxqXp/f5ed72a410e697b353b3d923487ac5b8/image.png)

## まとめ

- Claude Managed Agents はクラウドホスト型エージェントを大規模に構築・展開するためのサービス
- Managed Agents を使用することで、安全なサンドボックス環境・エージェントの状態を保存するためのストレージ・エージェントの状態を監視するためのモニタリングツール・アクセス権限など、エージェントを動かすためのインフラストラクチャーを構築する必要がなくなり、ユーザーに価値を提供するという本質的な開発に集中できる
- Managed Agents はエージェント, 環境, セッション, イベントの 4 つの概念を中心に構成されている
- エージェントの作成からセッションの開始までの一連の流れを UI 上で対話形式で進めることができる
- Vault を使用して認証情報をあらかじめ保管しておくことで、GitHub MCP サーバーなどの外部サービスにアクセスするための認証情報をエージェントが利用できるようになる
- セッションの開始時にリソースを指定でき、ファイルや GitHub リポジトリなどのリソースにアクセスできる
- 向いている用途として、長時間かかる作業や非同期に進めたい作業、複数の外部ツールをまたぐタスクが挙げられる
- 一方で、細かい制御が必要な軽量な処理や、単発のモデル呼び出しで十分な用途では Messages API を直接使うほうがシンプルな場合もある

## 参考

- [Claude Managed Agents overview - Claude API Docs](https://platform.claude.com/docs/en/managed-agents/overview)
- [Sessions - Claude API Reference](https://platform.claude.com/docs/en/api/typescript/beta/sessions)
- [Scaling Managed Agents: Decoupling the brain from the hands \ Anthropic](https://www.anthropic.com/engineering/managed-agents)
- [Claude Managed Agents: get to production 10x faster | Claude](https://claude.com/blog/claude-managed-agents)
