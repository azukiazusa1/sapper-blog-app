---
id: AK4HfbINsHySv4VMyr79N
title: "Hermes Agent と Grok の統合を試してみた"
slug: "hermes-agent-grok-integration"
about: "Hermes Agent は v0.14.0 で xAI の Grok モデルとの統合できるようになりました。Grok モデルは X（旧 Twitter）の投稿を検索できる `x_search` ツールを使えることが特徴で、リアルタイムでトレンドを把握したり、最新の情報を取得できることが強みとなっています。この記事では Hermes Agent と Grok の統合を試してみた様子を紹介します。"
createdAt: "2026-05-18T19:10+09:00"
updatedAt: "2026-05-18T19:10+09:00"
tags: ["hermes-agent", "Grok"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/NxiM8may9dWy0pwGBJDh4/1ce347657e363d7eb40705629f676431/image.png"
  title: "抹茶クリームとあずきのパフェのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "OAuth 経由で Grok にログインしたとき、同じトークンで自動的に利用可能になるツールとして、記事で挙げられていないものはどれですか?"
      answers:
        - text: "x_search（X の投稿を検索するツール）"
          correct: false
          explanation: "x_search は OAuth ログイン時に同じトークンで利用可能になる 4 つのツールの 1 つとして記事に明記されています。"
        - text: "image_generate（テキストから画像を生成するツール）"
          correct: false
          explanation: "image_generate も OAuth ログイン時に同じトークンで利用可能になる 4 つのツールに含まれていると記事で説明されています。"
        - text: "code_execute（コードを実行するツール）"
          correct: true
          explanation: "記事で挙げられている 4 つのツールは x_search、text_to_speech、image_generate、video_generate であり、code_execute は含まれていません。"
        - text: "text_to_speech（テキストを音声に変換するツール）"
          correct: false
          explanation: "text_to_speech も OAuth ログイン時に同じトークンで利用可能になる 4 つのツールに含まれていると記事で説明されています。"
published: true
---
[Hermes Agent](https://hermes-agent.nousresearch.com/) は Nous Research が開発している AI エージェントです。学習したことを記憶し、稼働時間が長くなるほど能力が高まる自律型エージェントとして設計されています。CLI, Slack, Discord など様々なプラットフォームからアクセスできるようになっており、特定の AI モデルに依存しない設計になっています。

v0.14.0 では xAI の Grok モデルとの本格的な統合が発表されました。Grok モデルは X（旧 Twitter）の投稿を検索できる `x_search` ツールを使える点が特徴で、リアルタイムでトレンドを把握したり、最新の情報を取得できることが強みとなっています。今回発表された Hermes Agent と Grok の統合は API キーを使用せずに OAuth 認証を使用して SuperGrok サブスクリプションから Grok を利用できるという点が特徴です。つまり、既に SuperGrok が利用可能な X アカウントを持っていれば、追加の課金なしで AI エージェントから X の投稿を検索して活用できるようになります。

:::info
SuperGrok サブスクリプションには加入せず、[X プレミアム](https://help.x.com/ja/using-x/x-premium)のベーシック（月額 980 円）に加入しているアカウントでも Grok を利用できました。
:::

この記事では Hermes Agent と Grok の統合を試してみた様子を紹介します。

## Hermes Agent のインストール

はじめに Hermes Agent をインストールします。以下のコマンドを実行してインストールできます。

```bash
# macOS/Linux
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
# Windows (PowerShell)
irm https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.ps1 | iex
```

インストールが完了したら `hermes` コマンドが利用できるようになっていることを確認しましょう。

```bash
$ hermes --version
Hermes Agent v0.14.0 (2026.5.16)
```

## Grok との連携のセットアップ

`hermes model` コマンドを実行すると、利用可能なプロバイダーの一覧が表示されます。Grok を利用するには「xAI Grok OAuth (SuperGrok Subscription)」を選択します。

```bash
hermes model
```

![](https://images.ctfassets.net/in6v9lxmm5c8/7moDulC83kvSQtX8jjAiK4/9647c42fa5046adcf93f0ad3a8c5a4b0/image.png)

選択するとブラウザが開いて X の OAuth 認証フローが開始されます。まずは accounts.x.ai で X アカウントにログインします。

![](https://images.ctfassets.net/in6v9lxmm5c8/uZE74Vt7qGbulOJjwev2M/4757d73c9929c0cf4b8cc4878be731d3/image.png)

ログイン後、「Grok Build を承認」する画面が表示されるので「許可」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/30RoBw6BwuSwBo0jh8Z1ro/0dac2f582b3b24799328be8160ed6e8e/image.png)

認証に成功すると、トークンが `~/.hermes/auth.json` に保存され、Hermes Agent から Grok を利用できるようになり、モデルを選択する画面が表示されます。ここでは `grok-4.3` を選択しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5Ge7xbNS9VcDejLIjnd5LV/fdf0db143b5ce639eefb63f41bea56d4/image.png)

もしくは CLI から直接モデルを設定できます。

```bash
hermes config set model.default grok-4.3
hermes config set model.provider xai-oauth
```

OAuth 経由でログインすると、以下の 4 つのツールも自動的に同じトークンを使用して利用できるようになります。

- `x_search`: X の投稿を検索するツール
- `text_to_speech`: テキストを音声に変換するツール
- `image_generate`: テキストから画像を生成するツール
- `video_generate`: テキストから動画を生成するツール

`x_search` と `video_generate` ツールはデフォルトで無効になっています。エージェントを起動する前に `hermes tools` コマンドを実行して、これらのツールをあらかじめ有効にしておく必要があります。

```bash
hermes tools
```

「Select an option:」と表示されたら「Configure 🖥️ CLI」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6GHybInDFlLeJovxKI5d8T/00271831fc8871105516704d6dba4db0/image.png)

「Configure 🖥️ CLI」を選択すると、利用可能なツールの一覧が表示されます。`🐦 X (Twitter) Search  (x_search (requires xAI OAuth or XAI_API_KEY))` を選択しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/1IlhWQ4qEutl4UzxyXog7c/5302fdd0454bca27f62cf4b2bd5f34b8/image.png)

## Grok を使ってポストを検索してみる

Hermes Agent を起動して、Grok を使ってみましょう。以下のコマンドでエージェントを起動します。

```bash
hermes
```

ターミナルに対話式のインターフェースが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2QiN4xl9fkEVE0aMeRDvmj/46ff83c1a7c7e2a0b9e41d37d41092cd/image.png)

`/tools` コマンドを入力して利用可能なツールの一覧を確認してみましょう。X の投稿を検索するための `x_search` ツールが一覧に表示されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3KJr5zwSZyvEHUrW76FaoY/c1d310d63c393fdc0435fa868be1d261/image.png)

`x_search` ツールを使って、最新の情報を検索してみましょう。例えば「最近バズってるユニクロのリュックってなんだっけ？」とプロンプトを入力してみます。

```txt
最近バズってるユニクロのリュックってなんだっけ？
```

🐦️の絵文字が表示されて、`x_search` ツールで「ユニクロ リュック」や「ユニクロ リュック 新作 OR バズ OR 神 OR 最高」というキーワードで検索中であることがわかります。最終的にバズってるのはユニクロの「ユーティリティバックパック」であることを教えてくれました。このような緩い質問の仕方で情報を取得できるのが Grok の特徴ですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/7hlPMsSfoOe8wC5YDCPXlW/d017e9d5f73d8c44eb7b351773564954/image.png)

さらに具体的にどのポストから情報を得たのかも聞いてみましょう。

```txt
どのポストからその情報を得たの？
```

具体的に参照したポストの URL をいくつか教えてくれました。実際に URL をブラウザで開いてみると、確かにユニクロのユーティリティバックパックがバズっていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/2Z6Nq0O4BdBUkrIvgyahik/1e9090d499b41f77df7d15cd07678b7b/image.png)

特定のアカウントを指定した検索もできます。[@azukiazusa9](https://x.com/azukiazusa9) の投稿のうち、最近バズっている投稿を検索してみましょう。

```txt
[@azukiazusa9] 最近バズってる投稿はどれ？
```

`from:azukiazusa9 min_faves:50 since:2026-04-01` といったクエリを使って検索をしてくれました。`#fec_nagoya` の登壇資料共有の投稿がバズっているようですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/2qZQueNecnyqxHSevLEPS1/6658258ace38c721b4bb6c7e1f15761e/image.png)

## Grok を使った画像生成

Grok を使用した画像生成も試してみましょう。Hermes Agent の `image_generate` ツールを使用すると、テキストから画像を生成できます。デフォルトのプロバイダーには [FAL.ai](https://fal.ai/) が使用されているため、`hermes tools` コマンドでバックエンドに `xAI Grok Imagine (image)` を選択して切り替える必要があります。

```bash
hermes tools
```

「Select an option:」と表示されたら「Reconfigure an existing tool's provider or API key」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/0NnOgbClmBxwcV9ksA4cE/a3dab10c8347f69169bb87ccc829e878/image.png)

ツールの一覧が表示されたら「🖼️ Image Generation (image_generate)」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3bRFCqeNORTRc8LKtiOFDH/f99fd326bfc221ef50aa83c601051ca7/image.png)

プロバイダーの一覧が表示されたら「xAI Grok Imagine (image)」を選択します。Grok に OAuth でログインしていれば、API キーの入力は求められません。モデルは `grok-imagine-image` か `grok-imagine-image-quality` が選択できます。後者のモデルはクオリティが高い画像が生成される代わりに、生成にかかる時間も長くなります。

![](https://images.ctfassets.net/in6v9lxmm5c8/72FKtwcEJ45wBP1IHThsRp/0e0cedb932135299340b7d4a6c74f1ea/image.png)

設定が完了したら Hermes Agent を再度起動して、「夕焼けの富士山を浮世絵風で生成して」といったプロンプトを入力してみましょう。

```txt
夕焼けの富士山を浮世絵風で生成して
```

Grok Imagine をバックエンドに画像生成が行われ、数秒後に画像が生成されました。生成された画像は URL（`imgen.x.ai`）として表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Aq2BnmkMyP51wmPTBA2vJ/037e7a4628c639e7c4b0263a58d2744c/image.png)

URL をブラウザで開いてみると、見事な富士山が浮世絵風に生成されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3bQM7XRN2jB16vTsbQK280/d2d13c20f83f4eb7cf6ac5e488ee8a20/xai-tmp-imgen-2448e689-50e8-48aa-9557-a9b754602ce1.jpeg)

## まとめ

- Hermes Agent と Grok の統合により、API キーなしで OAuth 認証を使用して SuperGrok サブスクリプションから Grok を利用できるようになった
- `x_search` ツールを使うことで、X（旧 Twitter）の投稿を検索できる
- Grok を利用することで、AI エージェントがリアルタイムでトレンドを把握したり、最新の情報を取得したりできるようになる
- `image_generate` ツールのプロバイダーを Grok Imagine に切り替えることで、Grok を使用した画像生成も可能

## 参考

- [Hermes Agent — The Agent That Grows With You | Nous Research](https://hermes-agent.nousresearch.com/)
- [Connect Grok to Hermes Agent | xAI](https://x.ai/news/grok-hermes)
- [xAI Grok OAuth (SuperGrok Subscription) | Hermes Agent](https://hermes-agent.nousresearch.com/docs/guides/xai-grok-oauth)
- [X (Twitter) Search | Hermes Agent](https://hermes-agent.nousresearch.com/docs/user-guide/features/x-search)
