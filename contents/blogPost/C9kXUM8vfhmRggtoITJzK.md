---
id: C9kXUM8vfhmRggtoITJzK
title: "Hermes Agent と Slack で設計し、Linear のチケットから Draft PR まで作成するワークフローの素振りをした"
slug: "hermes-agent-slack-workflow"
about: "Hermes Agent と Slack を連携して要件を整理し、Linear のチケット作成から Coding Worker による実装・検証・Draft PR 作成までを自動化するワークフローを紹介します。"
createdAt: "2026-07-25T19:00+09:00"
updatedAt: "2026-07-25T19:00+09:00"
tags: ["Hermes Agent", "AI", "Slack"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2GiWyPCDVBvp06djkfevFH/4cd8c119f575091b9faf2376bc98b39b/northern-lapwing_23864.png"
  title: "タゲリのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Slack 上の要件を Linear の実装チケットに変換するまでの順序として、記事で採用しているものはどれですか?"
      answers:
        - text: "to-spec → grill-with-docs → to-tickets"
          correct: false
          explanation: "最初に要件や用語、制約を対話で整理する必要があるため、to-spec より先に grill-with-docs を実行します。"
        - text: "grill-with-docs → to-spec → to-tickets"
          correct: true
          explanation: "記事では、対話で設計を詰め、合意内容を仕様書にまとめてから、実装可能なチケットに分割する順序を採用しています。"
        - text: "to-tickets → grill-with-docs → to-spec"
          correct: false
          explanation: "to-tickets は承認済みの仕様書を分割する工程であり、設計を詰める工程より先には実行しません。"
        - text: "grill-with-docs → to-tickets → to-spec"
          correct: false
          explanation: "チケットへ分割する前に、to-spec で合意内容を実装仕様書として整理します。"

    - question: "Slack のスレッド内から Hermes Agent のスキルを呼び出すとき、記事ではどの形式を使用していますか?"
      answers:
        - text: "@grill-with-docs"
          correct: false
          explanation: "@ はチャンネルで Hermes Agent をメンションするときに使いますが、スキルの呼び出し形式ではありません。"
        - text: "#grill-with-docs"
          correct: false
          explanation: "記事では # をスキル呼び出しの接頭辞として使用していません。"
        - text: "/grill-with-docs"
          correct: false
          explanation: "ターミナルでは / を使用できますが、Slack 上では Slack のコマンドとして解釈されるため、記事では別の接頭辞を使います。"
        - text: "!grill-with-docs"
          correct: true
          explanation: "記事では、Slack 上で / がコマンドとして解釈されることを避けるため、先頭に ! を付けてスキルを呼び出しています。"

    - question: "Planner Hermes の設定における SOUL.md と AGENTS.md の役割分担として正しいものはどれですか?"
      answers:
        - text: "SOUL.md に人格や話し方を、AGENTS.md にリポジトリ固有の規約やワークフローを記載する"
          correct: true
          explanation: "記事では、エージェントの人格やコミュニケーションスタイルを SOUL.md に、プロジェクト固有の手順を AGENTS.md に記載しています。"
        - text: "SOUL.md に Linear の認証情報を、AGENTS.md に Slack のトークンを記載する"
          correct: false
          explanation: "認証情報は SOUL.md や AGENTS.md の役割ではなく、Slack のトークンなどは .env に保存されます。"
        - text: "SOUL.md に Cron ジョブを、AGENTS.md に AI モデルの API キーを記載する"
          correct: false
          explanation: "Cron ジョブと API キーをこの2つの Markdown ファイルに分けて保存する構成は、記事では採用していません。"
        - text: "SOUL.md にテストコードを、AGENTS.md にアプリケーションコードを記載する"
          correct: false
          explanation: "どちらもソースコードを保存するためのファイルではなく、エージェントへの指示を記載するファイルです。"

published: true
---

AI エージェントがコードを書くのが当たり前になってきた昨今、ローカルの CLI でやり取りをしてコードを生成するフローは今までになかった困りごとを生んでいます。長期間エージェントを動かすことが前提になってきているのですが、手元の PC を閉じるとエージェントが止まってしまいます。また複数のエージェントを並行して動かすために、ローカル PC のリソースを占有してしまうこともあります。加えて手元に PC がないような状況では、エージェントに指示を出すこともできません。コードをほとんど書かなくなった今、指示を出すだけならスマートフォンなどのモバイル端末からでも十分であり、どこでもエージェントに指示を出せる環境が望まれます。

このような状況を踏まえて、リモートで動く AI エージェントという選択肢が注目を集めているように感じます。リモートで動くエージェントは、手元の PC のリソースを占有せず、スマートフォンなどのモバイル端末からでも指示を出すことができます。また、長期間エージェントを動かすことも可能です。さらに課題管理ツールから勝手に Issue を取ってきて実装に着手したり、PR が作成されたら自動でレビューするといった、人間の指示を起点としない自律的な動作も可能です。

この記事では、リモートで動く AI エージェントの一例として Hermes Agent を使用して、Slack でやりとりして設計書を作成し、チケットを登録するワークフローの構築を試みた様子を紹介します。

[Hermes Agent](https://hermes-agent.nousresearch.com/) は Nous Research が開発するオープンソースの AI エージェントです。CLI だけでなく Slack や Discord、Telegram など複数のチャットプラットフォームから指示を出すことができ、過去の経験からスキルを自動生成するなど使いながら改善するという自己学習の仕組みを備えているのが特徴です。

## ワークフローの概要

今回構築するワークフローは、以下のような流れを想定しています。

1. ユーザーが Slack 上で「商品の検索機能を作成したい」といった要件を入力する
2. Hermes Agent が要件を元に [grill-with-docs](https://www.aihero.dev/skills-grill-with-docs) を使用してユーザーにインタビューを行い設計を詰める
3. 作成した設計書が十分ならば、[to-spec](https://www.aihero.dev/skills-to-spec) と [to-tickets](https://www.aihero.dev/skills-to-tickets) を使用して、設計書をチケットに変換し、課題管理ツール Linear に登録する
4. 作成した設計書はリポジトリに永続的な成果物としても残す
5. チケットの登録を起点に、Hermes Agent が自律的にコードを書き、PR を作成する

このワークフローを実現するために、以下の 2 つのエージェントを用意します。

- Slack 上で設計する「Planner Hermes」
- チケット単位で起動する使い捨ての「Coding Worker」

![](https://images.ctfassets.net/in6v9lxmm5c8/4nCnwdih4aduIFKs5JoSz/522d05f3ea7e48921539f19c7ffd8c12/Hermes_Planning_to_Ticket-2026-07-24-134019.png)

### 前提条件

この記事では、作業対象のコードが GitHub リポジトリとして作成され、ローカルにクローンされていることを前提とします。また Coding Worker が変更を commit・push して Draft PR を作成するために、[GitHub CLI](https://cli.github.com/) の `gh` コマンドをインストールし、対象リポジトリへアクセスできるアカウントで認証しておく必要があります。

```sh
gh auth status
git remote -v
```

## Planner Hermes

はじめに、Slack 上で設計を行う「Planner Hermes」を作成しましょう。いきなりリモートで動かすのではなく、まずはローカルで Hermes Agent を起動して、Slack 上でやりとりを行うことを想定します。

### Hermes Agent のセットアップ

以下のコマンドでローカルに Hermes Agent をインストールしましょう。

```bash
# macOS / Linux
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
# Windows
iex (irm https://hermes-agent.nousresearch.com/install.ps1) 
```

インストールが完了したら、`hermes` コマンドが使えるようになっていることを確認してください。

```bash
hermes --version
Hermes Agent v0.19.0 (2026.7.20) · upstream 8fc27820
```

`hermes setup` コマンドを実行して、Hermes Agent の初期設定を行います。はじめは AI モデルのプロバイダーを設定します。ここでは OpenAI API を選択しました。OpenAI API のキーを使用するか、Codex CLI のサブスクリプションを使用するかを選択できます。

```bash
Select provider:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (○) Nous Portal (Everything your agent needs, 300+ models with bundled tool use)
   (○) Fireworks AI (OpenAI-compatible direct model API)
   (○) OpenRouter (Pay-per-use API aggregator)
   (○) Mixture of Agents (named presets; aggregator acts after reference models)
   (○) NovitaAI (Cloud: Model API, Agent Sandbox, GPU Cloud)
   (○) LM Studio (Local desktop app with built-in model server)
   (○) Anthropic (Claude models via API key or Claude Code)
 → (●) OpenAI ▸ (Codex CLI or direct OpenAI API)  ← currently active
   (○) Qwen ▸ (Qwen Cloud / DashScope, Coding Plan & Qwen CLI OAuth)
   (○) xAI Grok ▸ (Direct API or SuperGrok / Premium+ OAuth)
```

「Select terminal backend」ではどの環境で Hermes Agent を動かすかを選択します。ここでは「local（このマシンで直接実行）」を選択しました。

:::warning
Hermes Agent をローカルで動かす場合、意図せず重要なフィルを削除してしまったり、ホスト環境の認証情報を取得し外部に送信してしまうリスクがあります。本番相当の環境で Agent を動かす場合は、Docker や Modal、Daytona などのサンドボックス環境で実行することを推奨します。
:::

```bash
Select terminal backend:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (○) Local - run directly on this machine (default)
   (○) Docker - isolated container with configurable resources
   (○) Modal - serverless cloud sandbox
   (○) SSH - run on a remote machine
   (○) Daytona - persistent cloud development environment
 → (●) Keep current (local)
```

続いて「Select platforms to configure」では、Slack 上でやりとりを行うために「Slack」を選択します。

```bash
Select platforms to configure:
  ↑↓ navigate  SPACE toggle  ENTER confirm  ESC cancel

 → [ ] 💬 Mattermost  (not configured)
   [ ] 📡 Signal  (not configured)
   [ ] 💬 Weixin / WeChat  (not configured)
   [ ] 💬 BlueBubbles (iMessage)  (not configured)
   [ ] 🐧 QQ Bot  (not configured)
   [ ] 💎 Yuanbao  (not configured)
   [ ] 🐳 DingTalk  (not configured)
   [ ] 🎮 Discord  (not configured)
   [ ] 📧 Email  (not configured)
   [ ] 🪽 Feishu / Lark  (not configured)
   [ ] 💬 Google Chat  (not configured)
   [ ] 🏠 Home Assistant  (not configured)
   [ ] 💬 IRC  (not configured)
   [ ] 💚 LINE  (not configured)
   [ ] 🔐 Matrix  (not configured)
   [ ] 🔔 ntfy  (not configured)
   [ ] 📱 iMessage via Photon  (not configured)
   [ ] 🔔 Raft  (not configured)
   [ ] 🔒 SimpleX Chat  (not configured)
   [ ] 💼 Slack  (not configured)
   [ ] 📱 SMS (Twilio)  (not configured)
   [ ] 💼 Microsoft Teams  (not configured)
   [ ] ✈️ Telegram  (not configured)
   [ ] 💼 WeCom (Enterprise WeChat)  (not configured)
   [ ] 💼 WeCom Callback (self-built apps)  (not configured)
   [ ] 💬 WhatsApp  (not configured)
```

「Select an option」では「Configure CLI」を選択します。後続の操作で、Hermes Agent が使用可能な CLI ツールを設定します。

```sh
Select an option:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

 → (●) Configure 🖥️  CLI  (19/25 enabled)
   (○) Reconfigure an existing tool's provider or API key
   (○) Done
```

CLI ツールは最低限必要なものに絞り込み、以下の 4 つを選択しました。

- Web Search & Scraping: Web 検索、URL の記事や公式ドキュメントの取得
- File Operations: ファイルの読取・検索・作成・編集
- Skills: skill の一覧表示、読込み、インストール、管理
- Clarifying Questions: 選択肢や確認質問をユーザーに提示する

```sh
Tools for 🖥️  CLI
  ↑↓ navigate  SPACE toggle  ENTER confirm  ESC cancel

   [✓] 🔍 Web Search & Scraping  (web_search, web_extract)
   [ ] 🌐 Browser Automation  (navigate, click, type, scroll)
   [ ] 💻 Terminal & Processes  (terminal, process)
 → [✓] 📁 File Operations  (read, write, patch, search)
   [ ] ⚡ Code Execution  (execute_code)
   [ ] 👁️  Vision / Image Analysis  (vision_analyze)
   [ ] 🎬 Video Analysis  (video_analyze (requires video-capable model))
   [ ] 🎨 Image Generation  (image_generate)
   [ ] 🎬 Video Generation  (video_generate (text/image/reference))
   [ ] 🐦 X (Twitter) Search  (x_search (requires xAI OAuth or XAI_API_KEY))
   [ ] 🔊 Text-to-Speech  (text_to_speech)
   [✓] 📚 Skills  (list, view, manage)
   [ ] 📋 Task Planning  (todo)
   [ ] 💾 Memory  (persistent memory across sessions)
   [ ] 🧩 Context Engine  (runtime tools from the active context engine)
   [ ] 🔎 Session Search  (search past conversations)
   [✓] ❓ Clarifying Questions  (clarify)
   [ ] 👥 Task Delegation  (delegate_task)
   [ ] ⏰ Cron Jobs  (create/list/update/pause/resume/run, with optional attached skills)
   [ ] 🏠 Home Assistant  (smart home device control)  [no API key]
   [ ] 🎵 Spotify  (playback, search, playlists, library)
   [ ] 🤖 Yuanbao  (group info, member queries, DM)
   [ ] 🖱️  Computer Use (macOS/Windows/Linux)  (background desktop control via cua-driver)
```

### スキルのインストール

Hermes Agent と設計のやり取りを行うために以下の 3 つのスキルをインストールします。これらはいずれも Matt Pocock 氏により作成されたスキルであり、徹底的に質問攻めにされて設計を詰めるというフローがエンジニアから高い評価を受けています。

- grill-with-docs: 設計を一問ずつ掘り下げ、ユーザーと合意するまで質問を繰り返すスキル。プロジェクト固有の用語や設計判断を整理し `CONTEXT.md` や `docs/adr/` に記録する
- to-spec: grill-with-docs で合意した会話、CONTEXT.md、ADR を、1 つの実装仕様書にまとめる
- to-tickets: Spec を、別々のエージェントが実装できる小さなチケットへ分割

`to-spec` と `to-tickets` を課題管理ツールと連携して使用するためには、対象となる課題管理ツールと、チーム・ステータス・ラベルなどの運用ルールがあらかじめ設定されている必要があります。この記事では、後述する「Linear との連携」で Linear MCP を設定し、必要な情報を取得・更新できる状態にしてからチケットを登録します。

Hermes Agent にスキルをインストールするためには `hermes skills install` コマンドを使用します。また `grill-with-docs` は `grilling` と `domain-modeling` スキルに依存するため、これらも追加でインストールします。

```sh
for skill in grilling domain-modeling grill-with-docs to-spec to-tickets; do
  hermes skills install "skills-sh/mattpocock/skills/$skill"
done
```

:::warning
第三者が作成したスキルはプロンプトインジェクションや、悪意のあるスクリプトを実行される恐れがあります。スキルのインストール前に中身をよく確認してください。
:::

インストールしたスキルは `~/.hermes/skills/` 配下に保存されます。`hermes skills list` コマンドでインストール済みのスキルを確認できます。

```sh
hermes skills list | rg 'grilling|domain-modeling|grill-with-docs|to-spec|to-tickets'

│ domain-modeling               │                      │ skills.sh │ community │ enabled │
│ grill-with-docs               │                      │ skills.sh │ community │ enabled │
│ grilling                      │                      │ skills.sh │ community │ enabled │
│ to-spec                       │                      │ skills.sh │ community │ enabled │
│ to-tickets                    │                      │ skills.sh │ community │ enabled │
```

スキルが正常にインストールされていることを確認できたら、Hermes Agent を起動して試してみましょう。`hermes` コマンドで対話型のターミナルが起動します。

```sh
hermes
```

「/grill-with-docs TODO アプリを作りたい」といったプロンプトを入力すると、Hermes Agent が grill-with-docs スキルを使用して、設計のための質問を順番に投げかけてきます。ユーザーはそれに答えることで、設計を詰めていくことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/50X1ScyX5IFEU2SBqbso1U/89535b271927b70239788c5b0324f8aa/image.png)

### Slack との連携

続いて、Hermes Agent を Slack と連携させます。あらかじめ Slack App を作成し、Bot Token と App Token を取得しておく必要があります。Slack App を作成するために Hermes Agent にはマニフェストを作成するコマンドが用意されています。Slack App はマニフェストを使用して作成することで、必要な権限やイベントを一括で設定できます。

```sh
$ hermes slack manifest --agent-view --write

Slack manifest written to: /Users/asai/.hermes/slack-manifest.json

Next steps:
  1. Open https://api.slack.com/apps and pick your Hermes app
     (or create a new one: Create New App → From an app manifest).
  2. Features → App Manifest → paste the contents of
     /Users/asai/.hermes/slack-manifest.json
  3. Save; Slack will prompt to reinstall the app if scopes or
     slash commands changed.
  4. Make sure Socket Mode is enabled and you have a bot token
     (xoxb-...) and app token (xapp-...) configured via
     `hermes setup`.
```

スクラッチで Slaack App を作成する方法も紹介します。https://api.slack.com/apps にアクセスして「新しいアプリを作成」をクリックして Slack App を作成します。App Token は Slack App 管理画面の左メニューから Socket Mode を開き、Socket Mode を有効化することで取得できます。Bot Token は OAuth & Permissions → スコープから Bot Token Scopes に必要な権限を追加し、「Install to Workspace」をクリックすることで取得できます。必要なスコープは以下の通りです。

```txt
chat:write
app_mentions:read
channels:history
channels:read
groups:history
groups:read
im:history
im:read
im:write
mpim:history
mpim:read
users:read
files:read
files:write
```

次は Hermes へ届ける Slack イベントを設定します。`Event Subscriptions` を開き、`Enable Events` を有効にします。その後、`Subscribe to Bot Events` で必要なイベントを追加します。「Save Changes」をクリックするのを忘れないようにしてください。必要なイベントは以下の通りです。

```txt
message.im
message.mpim
message.channels
message.groups
app_mention
```

最後に Slack から Hermes Agent に DM イベントを送信するための設定を行います。`App Home` を開き、`Show Tabs` から `Messages Tab` を有効にします。`Allow users to send Slash commands and messages from the messages tab` にチェックを入れてください。

詳しい Slack App の作成方法やトークンの取得方法については、[Slack API ドキュメント](https://api.slack.com/) や [][Hermes Agent の Slack 連携ガイド](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/slack)を参照してください。

Hermes Agent では [Gateway](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/) と呼ばれる仕組みを使用して、Discord, Slack, Telegram などのチャットツールと連携することができます。Gateway では各チャットプラットフォームのアダプタがメッセージを受信し、チャットセッションごとのストアをルーティングしてから AI モデルに渡すという仕組みになっています。

Gateway の設定は `hermes gateway setup` コマンドを使用すると便利です。対話形式で設定を進めることができます。

```sh
hermes gateway setup
```

コマンドを実行したらプラットフォームの一覧が表示されるので、Slack を選択します。その後 Slack Bot Token と App Token、会話を許可するユーザーの ID 一覧、ホームチャンネルを入力します。会話を許可するユーザーは Slack のユーザーは 1 人以上指定する必要があります。複数人指定する場合は、カンマ区切りで入力します。ユーザー ID は Slack のユーザーのプロフィールの三点リーダーから「メンバー ID をコピー」を選択すると取得できます。ホームチャンネルは Hermes Agent が cron ジョブや定期的な通知を送信するためのチャンネルです。これは設定しなくても構いません。

設定した内容は `~/.hermes/.env` に保存されます。

```txt:~/.hermes/.env
# Required
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_APP_TOKEN=xapp-your-app-token-here
SLACK_ALLOWED_USERS=U01ABC2DEF3

# Optional
SLACK_HOME_CHANNEL=C01234567890
SLACK_HOME_CHANNEL_NAME=general
```

Slack の設定が完了したら、`hermes gateway` コマンドを実行してフォアグラウンドで Gateway を起動します。必要な権限が不足しているような場合は、以下のようなエラーログが出力されます。

```txt
API failed. (url: https://slack.com/api/users.conversations, status: 200)
The server responded with: {'ok': False, 'error': 'missing_scope', 'needed': 'groups:read', 'provided': 'chat:write,app_mentions:read,im:write,files:write,channels:history,channels:read,groups:history,im:history,im:read,mpim:history,mpim:read,files:read,users:read'}
```

問題がなければ、Slack 上で Hermes Agent に DM を送信したり、チャンネルでメンションを送信することで、Hermes Agent が応答することを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2DLnLzU3fSn7oDljBeU0ZF/824f90d4208bc6e61ad8669bb34fa297/image.png)

`!grill-with-docs` を先頭につけてメッセージを送信し、スキルを発動できるかどうかも確認してみましょう。Slack 上では `/` が Slack のコマンドとして解釈されてしまうため、`!` を先頭につける必要があります。

一連の Slack との連携が完了したら、Gateway をバックグラウンドで起動するように設定します。`hermes gateway install` コマンドを実行すると、Gateway を Linux の user service や macOS の Launchd service として登録することができます。Launchd service とは、macOS の起動時に自動的に起動するサービスのことです。

```sh
hermes gateway install
```

登録後は `hermes gateway start` コマンドで Gateway を起動することができます。`hermes gateway status` コマンドで Gateway の状態を確認することもできます。停止は `hermes gateway stop` コマンドで行います。

```sh
$ hermes gateway status
Launchd plist: /Users/xxx/Library/LaunchAgents/ai.hermes.gateway.plist
✓ Service definition matches the current Hermes install
✓ Gateway is supervised by launchd (PID 90008)
  Auto-start at login and auto-restart on crash are available.
```

特定のディレクトリから Gateway を起動する場合は、`hermes config set terminal.cwd <path>` コマンドでディレクトリを指定することができます。

```sh
hermes config set terminal.cwd ~/hermes-agent-workflow
```

Slack 上からもバックグラウンドで実行している状態で Hermes Agent が応答することを確認してみましょう。最後に使用可能な Slack ツールの一覧を確認し、不必要なツールが有効になっていないかを確認します。`hermes tools` コマンドを実行してから `Configure Slack` を選択すると、Slack 上で使用可能なツールの一覧が表示されます。

```sh
$ hermes tools

Select an option:
  ↑↓ navigate  ENTER/SPACE select  ESC cancel

   (●) Configure 🖥️  CLI  (6/25 enabled)
 → (○) Configure 💼 Slack  (17/25 enabled)
   (○) Configure all platforms (global)
   (○) Reconfigure an existing tool's provider or API key
   (○) Done
```

CLI ツールと同じく、以下の 4 つのツールのみを有効にしておくことをおすすめします。

- Web Search & Scraping
- File Operations
- Skills
- Clarifying Questions

`hermes gateway restart` コマンドを実行して、ツールの設定を反映させます。

```sh
$ hermes gateway restart

→ Stopping gateway (PID 90008) — draining in-flight runs (up to 180s)...
✓ Service restarted
```

### Planner Hermes の人格や手順を定義する

`SOUL.md` ファイルを編集すると、Hermes Agent の人格や役割をカスタマイズすることができます。`SOUL.md` ファイルはシステムプロンプトの前に読み込まれ、エージェントが誰であるのかを定義します。`SOUL.md` ファイルにはエージェントのトーンやコミュニケーションスタイル、インタラクションのスタイルなどエージェントの人格に関する情報を記載します。リポジトリ固有の規約やアーキテクチャといった情報は `AGENTS.md` に記載することが推奨されています。

一言で表すと、それがどの場所でも適用すべきであれば `SOUL.md` に、リポジトリ固有 であれば　`AGENTS.md` に記載するという役割分担です。

`~/.hermes/SOUL.md` を以下のように編集し、設計者としてどのような手順で設計を進めるかを定義します。

```markdown:~/.hermes/SOUL.md
あなたは Hermes Planner です。

日本語で、簡潔かつ明確に会話してください。
曖昧な要求では、決めるべき論点を整理し、推奨案を添えて一度に1つずつ質問してください。
確認できる事実と推測を区別し、不確実な点は率直に伝えてください。
ユーザーの意図を正確に捉え、設計上のトレードオフと未解決事項を分かりやすく示してください。

ユーザーの明示的な承認なしに、外部サービスの状態を変更したり、取り消しにくい操作を行ったりしないでください。

## 役割

Plannerは、曖昧な要求を合意済みの仕様と実装チケットへ整理します。
プロダクトコードの実装、テスト実行、プルリクエスト作成は行いません。

## 設計ワークフロー

必ず次の順番で進めます。

1. `grill-with-docs`
   - 要件、用語、制約、設計判断を対話で確定する
   - 一度に質問する判断は1つだけにする
   - 合意に至るまで次へ進まない

2. `to-spec`
   - 合意内容を実装仕様書へ整理する
   - 作成・更新内容を要約し、ユーザーの明示的な承認後に実行する

3. `to-tickets`
   - 承認済みの仕様書を、実装可能な小さなチケットへ分割する
   - 各チケットに目的、完了条件、依存関係、対象外を含める
   - Linearへ作成するチケット一覧を示し、明示承認後にだけ作成する

工程の省略、順序変更、自動実行は禁止です。
各工程の完了後は、成果物、未解決事項、次に必要な承認を短く報告して停止します。

## ファイル操作

読み取りはリポジトリ全体で許可します。
作成・更新できるのは、次の設計成果物だけです。

- `CONTEXT.md`
- `docs/adr/`
- `docs/specs/`

これらを変更する前に、変更内容を要約して明示的な承認を得ます。
```

続いて、リポジトリのルートに `AGENTS.md` を作成し、このリポジトリで使用する Linear チームやステータス、ラベルなどの運用ルールを定義します。

```markdown:AGENTS.md
# Project Context

このリポジトリは、React + TypeScript + Vite で作成された個人用の Web Todo アプリです。

## Linear

利用するLinearチームは `Azukiazusa-test` です。

- 親仕様Issue: `Backlog`
- 実装チケット: `Todo`
- 実装中: `In Progress`
- マージ済み: `Done`

既存ラベルだけを使います。

- 新機能: `Feature`
- 改善: `Improvement`
- 不具合修正: `Bug`

ラベル、ステータス、チーム、プロジェクトを新規作成・削除・変更してはいけません。
認証情報やトークンをリポジトリに保存してはいけません。
```

Gateway を再起動して変更が反映されることを確認しましょう。

```sh
hermes gateway restart
```

### Linear との連携

Planner エージェントと Slack 上で設計のやり取りを行うところまで完成しました。次は、設計書をチケットに変換して課題管理ツール [Linear](https://linear.app/) に登録するところまでを実装します。Hermes Agent が Linear と連携するためには Linear MCP と接続します。以下のコマンドを実行して、Linear MCP の設定を行います。

```sh
hermes mcp install linear
```

コマンドを実行すると、OAuth 認証のフローが開始されます。ブラウザで Linear の認証画面が表示されるので「Approve」をクリックして、Hermes Agent に Linear へのアクセスを許可します。

![](https://images.ctfassets.net/in6v9lxmm5c8/yTh6IcTWaWlhMTUhuHJtj/996d92ad3a5400f7033c3f662a815083/95f394d4-194a-435e-a32b-fbaa35c4660b.png)

Linear MCP のインストールが完了したら、以下のコマンドで Planner エージェントが使用可能な Linear ツールを最小限に絞り込みます。

```sh
hermes mcp configure linear
```

以下のツールだけを有効にしておくことをおすすめします。

```txt
list_teams
get_team
list_issue_statuses
get_issue_status
list_issue_labels
list_issues
get_issue
save_issue
```

`hermes gateway restart` で Gateway を再起動して、Linear との連携が有効になっていることを確認します。「Linear で閲覧できるチーム一覧を、チーム名と ID だけで表示してください」といったプロンプトを Slack 上で送信し、Linear のチーム一覧が返ってくることを確認しましょう。確かにチーム一覧が返ってきていることから、Linear との連携が有効になっていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2OWLpXqthp3P9wsaule1W2/628a35f06e1d54a0826c49ae35bfbf5f/fbfe5ad1-80ea-44c5-922c-26ad0502bd18.png)

「個人用の Web Todo アプリを作りたいです。」といった指示を Slack 上で送信し、`grill-with-docs` → `to-spec` → `to-tickets` の順番で設計書を作成し、Linear にチケットが登録されることを確認しましょう。まずはユーザーと合意した内容を元に spec を作成していることがわかります。この内容で問題なければ承認し、`docs/specs/` や `CONTEXT.md` に設計書が作成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2cYevQ8RDkMQMAdlKuOgCE/c92c91346c013f0c64617dfc59ccba53/image.png)

最後の手順として `to-tickets` 用の分割案が提示されます。チケットの分割案を確認し、承認すると Linear にチケットが登録されます。チケットは Blocked by による依存関係も設定されており、チケットの順序が守られるようになっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/3pyIXXH8XstU70NDxZU1fn/7b3e3b244ca08dc796d210885ae3978b/image.png)

## Coding Worker エージェント

Linear にチケットが登録されたら、Coding Worker エージェントが自律的にコードを書き、PR を作成するところまでを実装します。Coding Worker エージェントは TODO チケットの中から依存関係や仕様を読み実装可能かを判断し、実装可能なチケットがあればコードを書きセルフチェックを行ったうえで PR を作成し Slack に通知します。

Planner とは独立したエージェントを作成するためにプロファイルを作成します。プロファイルを作成することで、`SOUL.md` や有効なツールやスキル、認証情報などを独立して管理することができます。Coding Worker エージェント用のプロファイルを作成するために、`hermes profile create` コマンドを実行します。プロファイル名は `worker` としました。

:::warning
プロファイルは設定ファイル、認証情報、メモリ、セッションなどを分離する仕組みであり、ファイルシステムへのアクセスを完全に隔離するサンドボックスではありません。`local` バックエンドで動かす場合、エージェントは実行ユーザーがアクセスできるほかのディレクトリも操作できる可能性があります。必要に応じて専用の OS ユーザーや Docker などを使用し、エージェントがアクセスできる範囲を制限してください。
:::

```sh
hermes profile create worker --description "Linearの確定済み実装チケットを1件ずつ実装し、テストしてDraft PRを作成するWorker"
```

`~/.hermes/profiles/worker` ディレクトリが作成され、ここに `worker` プロファイル用の設定ファイルが作成されます。`worker setup` コマンドで Planner エージェントと同じように初期設定を行います。AI モデルのプロバイダーの選択や API キーの設定などもプロファイルごとに独立して行うことができます。例えば設計のような複雑なタスクは性能の高いモデルを使用し、コードの生成は比較的コストの低いモデルを使用する、といった使い分けも可能です。

```sh
worker setup
```

使用を許可する CLI ツールは以下の 3 つに絞り込みます。

```sh
[✓] 💻 Terminal & Processes
[✓] 📁 File Operations
[✓] 📚 Skills
```

Planner エージェントとの違いは、Terminal & Processes ツールを有効にしている点です。これはコードを作成するために `git` コマンドやテストの実行などを行う必要があるためです。一方でエージェントは自律的にコードを書くためユーザーに質問する Clarifying Questions ツールは不要です。

`~/.hermes/profiles/worker/SOUL.md` を以下のように編集し、コードを書くエージェントとして振る舞ってもらいます。

```markdown:~/.hermes/profiles/worker/SOUL.md
あなたは Hermes Worker です。

日本語で、簡潔かつ明確に報告してください。
あなたの役割は、Linearで確定済みの実装チケットを1件だけ実装し、検証し、Draft Pull Requestを作成することです。

設計、要件定義、仕様書作成、チケット分割、ラベルやステータスの新規作成は行いません。
チケットが曖昧、依存チケットが未完了、または仕様とコードに矛盾がある場合は、変更を行わず、Slackで停止理由と確認事項を報告してください。

実装前にチケット、親仕様、既存コードを確認してください。
実装後は、関連するテスト、lint、型チェックを実行してください。
検証に失敗した状態では、PRを作成してはいけません。

PRは必ずDraftとして作成してください。
Linearのステータスは、実装開始時のみ `In Progress`、PR作成後も `In Progress` のままにしてください。
`Done` への変更は、人間がPRをマージした後にだけ行います。

## 自動実行ルール

自動実行では、同時に1件しか着手してはいけません。
親Issue `AZU-13` の子チケットに `In Progress` が1件でもある場合、新たなチケットを取得してはいけません。

`Todo` から選べるのは、依存先がすべて `Done` であるチケットだけです。
候補が複数ある場合は、識別子が小さいものを1件だけ選びます。

実装前に、作業ツリーがクリーンであり、`main` が `origin/main` と同期していることを確認してください。満たさない場合は、変更せずSlackに報告して停止します。

着手時にのみ対象チケットを `In Progress` にします。
テスト、lint、型チェックがすべて成功した場合だけ、変更をcommit・pushし、Draft PRを作成します。
作成後、対象LinearチケットへPR URLと検証結果をコメントします。

失敗時はPRを作成せず、対象チケットを `In Progress` のままにして、失敗内容をコメントします。
自動で `Done` に変更、PRのReady化、マージ、削除、既存チケットの編集をしてはいけません。
```

### Slack と Linear の連携

Worker エージェントも PR の作成が完了したときに Slack に通知を送信するため、Slack との連携を行います。Planner エージェントとは別の Slack App を作成し、Bot Token と App Token を取得します。

Worker エージェント側で Slack の設定を行うために、`worker gateway setup` コマンドを実行します。

```sh
worker gateway setup
```

Planner エージェントの場合は Slack のホームチャンネルの指定は不要でしたが、Worker の場合エージェント起点で Slack に通知を送信するため、どのチャンネルに通知をするか指定するためにホームチャンネルの指定が必要です。任意のチャンネルの ID を控えておいてください。`~/.hermes/profiles/worker/.env` の `SLACK_HOME_CHANNEL` でも設定できます。

```txt:~/.hermes/profiles/worker/.env
SLACK_HOME_CHANNEL=<ここにコピーしたChannel_ID>
```

`worker gateway start` コマンドで Gateway を起動し、Slack 上で Worker エージェントが応答することを確認します。Worker エージェントが動作するディレクトリも指定しておきましょう。

```sh
worker config set terminal.cwd ~/hermes-agent-workflow
```

Linear のチケットを取得し、チケットの状態を更新できるようにするために Worker エージェント側でも Linear MCP の設定を行います。`worker mcp install linear` コマンドを実行し、OAuth 認証のフローを完了させます。Planner エージェントとはプロファイルが分離されているため、別に認証を行う必要があります。

```sh
worker mcp install linear
```

Worker エージェントが必要な、対象チーム・状態・チケットの確認と、自分が取得したチケットのステータス／PR URL 更新の操作のみを許可するように設定します。

```txt
list_teams
list_issue_statuses
list_issues
get_issue
save_issue
save_comment
```

### Linear のチケットを取得してコードを書き、PR を作成する

Linear にチケットが登録されたら、Worker エージェントがチケットを取得できるようにしましょう。人間の指示がなくとも自律的に動作してくれるように設定します。チケットの登録を契機に Worker エージェントを起動するために以下の 2 つの方法が考えられます。

- [Linear Webhook](https://linear.app/developers/webhooks) を使用して、チケットの登録を検知し Worker エージェントを起動する
- Hermes Agent の Cron ジョブを使用して、定期的に Linear のチケットを取得し Worker エージェントを起動する

ここでは Cron ジョブを使用して、定期的に Linear のチケットを取得する方法を紹介します。Worker エージェントのプロファイルで Cron ジョブを作成します。Cron ジョブは `worker cron create` コマンドで作成できます。1 つ目の引数にジョブの実行間隔、2 つ目の引数にジョブの内容を指定します。ジョブの内容は、Worker エージェントが実行する一連の手順を記載します。`--deliver slack` により、先ほど設定した Worker 通知チャンネルへ結果が届きます。また組み込みのスキルである `github-pr-workflow` を使用するように指定しています。`--skill` オプションで指定したスキルはその内容がコンテキストとして追加されます。

```sh
worker cron create "every 5m" "Azukiazusa-test に In Progress が1件でもあれば、何も変更せず [SILENT] で終了する。次に Todo の子チケットから、依存先がすべて Done のものだけを探し、識別子が最小の1件だけを選ぶ。候補がなければ、何も変更せず [SILENT] で終了する。対象を選んだら、親仕様とチケット全文を確認し、作業ツリーがクリーンで main が origin/main と同期している場合だけ開始する。新しい作業ブランチを作成し、対象チケットを In Progress に更新して実装する。関連テスト、lint、型チェックを実行し、すべて成功した場合だけ commit、push、Draft PR を作成する。対象LinearチケットにPR URLと検証結果をコメントする。失敗時はPRを作らず、In Progress のまま失敗内容をコメントする。Doneへの変更、PRのReady化、マージ、削除、対象外チケットの変更は禁止する。" \
  --name "AZU Worker" \
  --deliver slack \
  --skill github-pr-workflow \
  --workdir /absolute/path/to/hermes-agent-workflow
```

`--workdir` オプションには、Coding Worker が操作する GitHub リポジトリの絶対パスを指定します。Cron ジョブは指定したディレクトリを作業ディレクトリとして使用し、そこにある `AGENTS.md` を読み込んだうえでファイル操作やコマンドの実行を行います。

作成した Cron ジョブの一覧は `worker cron list` コマンドで確認できます。しばらく待機して Job が実行されることを確認しましょう。ジョブの実行ログは `~/.hermes/profiles/worker/cron/output/<jobId>/` 配下に保存されます。チケットの状態が In Progress に変更され、Draft PR が作成されている様子が確認できました。PR の作成を起点にレビューエージェントを起動しても面白そうですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/4rgJPj8pj6JTei9zRVJCfe/ac1174990c5153b4c483c592700adc71/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/7ibSoIx20tMDSwdclYDh13/bf4eef5dabb1d3c924ba908dafcbba83/image.png)

Slack 上でも Worker エージェントが Draft PR を作成したことが通知されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5Y3XRI7C8JqyvwGUApT1iZ/395931bd252d126b48273cf737678f45/image.png)

## Planner エージェントをリモートで動かす

ここまでは動作確認のために Planner エージェントを手元のマシンで動かしていましたが、このままだと PC を閉じた時に Hermes Agent が停止してしまいます。Hermes Agent をリモートで動かすために、クラウド上の仮想マシンや VPS を用意し、そこに Hermes Agent をインストールして動作させることができます。Hermes Agent はバックグラウンドで動作するため、常時稼働させることが可能です。

ここでは VPS サービスとして [ConoHa VPS](https://vps.conoha.jp/) を使用して、Hermes Agent をリモートで動かしてみます。。あらかじめ ConoHa VPS のアカウントを作成しておきましょう。Ubuntu 22.04 LTS の仮想マシンを作成します。検証目的であれば、最小構成の 1GB メモリ、1vCPU のプランで十分でしょう。料金プランは時間課金制にしておくと最低限に抑えれると思います。仮想マシンの作成が完了したら、グローバル IP アドレスを控えておきましょう。

手元のマシンから　SSH で接続して Hermes Agent をインストールし、手元で行ったことと同じ手順で Slack との連携や Linear との連携を行います。

SSH で接続するために、VPS の IP アドレスと SSH キーを用意します。SSH キーは、ローカルマシンで `ssh-keygen` コマンドを実行して作成できます。作成した公開鍵を ConoHa VPS の管理画面から登録し、VPS に接続できるようにします。

```sh
ssh root@<VPSのIPアドレス>
```

その後セキュリティのために一般ユーザーを作成し、root ユーザーでのログインを禁止することをおすすめします。Hermes Agent をインストールするために適宜必要な依存関係をインストールします。Ubuntu 22.04 LTS の場合、以下のコマンドで必要なパッケージをインストールできます。

```sh
sudo apt update && apt upgrade -y
sudo apt install -y curl git build-essential
```

後は基本的にはローカルマシンで行った Hermes Agent のインストール手順と同じように Slack との連携や Linear との連携を行います。ただし、VPS 上で Hermes Agent を動作させる場合、ローカルマシンで行った手順といくつか異なる点があります。

- Docker を使用して Hermes Agent を動作させる: VPS の OS と Hermes Agent の依存関係を分離するために、Docker を使用して Hermes Agent をコンテナとして動作させる https://hermes-agent.nousresearch.com/docs/user-guide/docker/
- Linear の OAuth 認証を行う際に、VPS 上でブラウザを開くことができないためリダイレクトURLを貼り付ける か SSH トンネルを使用してローカルマシンのブラウザで認証を行う https://hermes-agent.nousresearch.com/docs/guides/oauth-over-ssh

## まとめ

- Hermes Agent と Slack を連携させ、`grill-with-docs` → `to-spec` → `to-tickets` のスキルを使うことで、Slack 上での対話から設計書とチケットまでを一貫して作成できた
- 設計を担う「Planner Hermes」とコーディングを担う「Coding Worker」をプロファイルとして分離することで、役割ごとに使用できるツールや権限を最小限に絞り込めた
- Linear MCP と Cron ジョブを組み合わせることで、チケットの登録を起点に Worker エージェントが自律的に実装・検証・Draft PR 作成までを行う仕組みを構築できた
- VPS 上に Hermes Agent をデプロイすることで、手元の PC を閉じても Planner エージェントを継続的に稼働させられることを確認した

## 参考

- [Hermes Agent | Nous Research](https://hermes-agent.nousresearch.com/)
- [CLIを使わない開発を考える](https://docs.google.com/presentation/d/1uA5t7mC099Rxghm6XrXcOvlio4EpfzQHb0AYRmQ-vyI/edit?slide=id.p#slide=id.p)
- [Built Our Own Background Agent at LayerX #aidevex_findy - Speaker Deck](https://speakerdeck.com/layerx/built-our-own-background-agent-at-layerx-number-aidevex-findy)
- [Why We Built Our Own Background Agent — Ramp Builders Blog](https://builders.ramp.com/post/why-we-built-our-background-agent)
- [Slack developer docs | Slack Developer Docs](https://docs.slack.dev/)
- [Linear Docs](https://linear.app/docs)
- [grill-with-docs: Align Before You Build](https://www.aihero.dev/grill-with-docs)
