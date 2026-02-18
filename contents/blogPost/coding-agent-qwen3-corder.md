---
id: cZKohlC_ur_zaa_Md1r-t
title: "コーディングのための LLM モデル Qwen3-Coder を試してみた"
slug: "coding-agent-qwen3-corder"
about: "Alibaba が開発した Qwen3-Coder を使用したコーディングエージェント Qwen Code を試してみた記事です。OpenRouter 経由での認証設定、コードベースの調査、リファクタリング、テストコード生成などの実際の使用例を紹介しています。"
createdAt: "2025-08-03T09:49+09:00"
updatedAt: "2025-08-03T09:49+09:00"
tags: ["Qwen3-Coder", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2Pn0WGcxt60BbpkizqQgnW/172f3e047d93f962628d24106218b351/bread_danish_13640-768x660.png"
  title: "フルーツのデニッシュのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Qwen3-Coder を CLI ツールとして使用するためのパッケージ名は何ですか？"
      answers:
        - text: "@qwen-code/qwen-code"
          correct: true
          explanation: null
        - text: "@qwen/qwen3-coder"
          correct: false
          explanation: null
        - text: "qwen-cli"
          correct: false
          explanation: null
        - text: "qwen3-coder-cli"
          correct: false
          explanation: null
    - question: "Qwen Code でセッションのトークンリミットを超過した場合の対処法として正しくないものはどれですか？"
      answers:
        - text: "/clear コマンドで新しいセッションを開始する"
          correct: false
          explanation: "これは有効な対処法です。"
        - text: "/compress コマンドでトークンを圧縮する"
          correct: false
          explanation: "これは有効な対処法です。"
        - text: ".qwen/settings.json の sessionTokenLimit を増やす"
          correct: false
          explanation: "これは有効な対処法です。"
        - text: "/reset コマンドでモデルをリセットする"
          correct: true
          explanation: "/reset コマンドは存在しません。"
published: true
---
[Qwen3-Coder](https://github.com/QwenLM/Qwen3-Coder) は、Alibaba が開発した Qwen3 系列の LLM モデルです。Agentic Coding（エージェントを活用したコーディング⁠）や Agentic Browser-Use（エージェントを通したブラウザ操作⁠）⁠⁠の分野で特筆した成果を上げており、Claude Sonnet 4 に匹敵する性能を持つと言及されています。また 256k トークンの長いコンテキストを持つことができ、長大なドキュメントの処理や複雑なコードベースの理解に優れています。

最新のモデルは Qwen3-Coder-30B-A3B-Instruct で Hugging Face で Apache 2.0 ライセンスのもとで公開されています。

https://huggingface.co/Qwen/Qwen3-Coder-480B-A35B-Instruct

また Claude Code のような CLI 型のツールである [Qwen Code](https://github.com/QwenLM/qwen-code) も提供されています。Qwen Code は [Gemini CLI](https://github.com/google-gemini/gemini-cli) をベースとして作られており、Qwen3-Coder モデルに特化して利用可能です。

この記事では Qwen Code を使用したコーディングエージェントを試してみます。

## Qwen Code のインストール

Qwen Code は npm パッケージとして提供されており、以下のコマンドでインストールできます。

```bash
npm install -g @qwen-code/qwen-code@latest
```

インストールが完了したら、以下のコマンドで Qwen Code を起動できます。

```bash
qwen
```

![](https://images.ctfassets.net/in6v9lxmm5c8/4KZQIjhnN6g5NApwrdZ3Wh/b6fb8d2ebfe2ebbb8e4b2d27e8483572/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_10.11.39.png)

始めに認証方式を選択するように求められます。ここでは OpenAI を選択し、[OpenRouter](https://openrouter.ai/) 経由で認証します。https://openrouter.ai/settings/keys から API キーを取得して入力します。

- API Key: `<your-api-key>`
- Model: `qwen/qwen3-coder:free`
- Base URL: `https://openrouter.ai/api/v1`

![](https://images.ctfassets.net/in6v9lxmm5c8/20LoYzedpSYbsgTrIsyvxU/5e2878085d005f7a0d4ecf7fc5113b69/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_10.18.18.png)

もしくは環境変数を設定できます。

```bash
export OPENAI_API_KEY="your_api_key"
export OPENAI_BASE_URL="https://openrouter.ai/api/v1"
export OPENAI_MODEL="qwen/qwen3-coder:free"
```

:::note
`qwen/qwen3-coder:free` モデルでは中国国外のユーザーの場合 1 日あたり 1,000 回の無料 API コールが可能です。
:::

API キーが正しく設定されていれば、Qwen Code を使用してコーディングエージェントを試すことができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3E0D7QnuB7JCufIznIiqm6/71b951ca1ad89a5894fc93fb98cfdbd6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_10.27.03.png)

## Qwen Code を試してみる

早速 Qwen Code を使ってコーディングエージェントを試してみます。まずはコードベースのアーキテクチャを調査する指示を与えてみましょう。

```txt
アプリケーションのコードベースを調査して、主要なコンポーネントとアーキテクチャを説明してください。
```

`ReadFolder` や `ReadFile` ツールを使用してコードベースの調査をしている様子が確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2JcV5dHDtebKruy74z2Sdn/621c47a6bf11cb65b64fd33221b91a97/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_10.29.40.png)

最終的にコードのアーキテクチャと主要コンポーネントの説明が得られました。

```markdown
✦ このSapperブログアプリケーションは、モダンなWeb技術スタックを活用した静的サイトジェネレータです。以下に主要なコンポーネントと
  アーキテクチャを説明します。

  アーキテクチャ概要

   - モノレポ構成: Turborepoとnpm workspacesを使用したモノレポ構成で、app(メインアプリケーション)、contents(記事データ)、packag
     es(共通ライブラリ)に分かれています。
   - SvelteKit:
     フレームワークとしてSvelteKitを使用し、SSG(静的サイト生成)とSPA(シングルページアプリケーション)の機能を兼ね備えています。
   - Contentful CMS: 記事データはContentfulというヘッドレスCMSで管理されており、GraphQL API経由でデータを取得します。
   - Tailwind CSS: スタイリングにはUtility-firstなCSSフレームワークであるTailwind CSSを使用しています。

  主要コンポーネント

  1. ルーティングとページ (/app/src/routes)
   - ホームページ (`+page.svelte`): 最新記事、ショート記事、人気記事、登壇資料などを表示します。
   - ブログ一覧ページ (`/blog/+page.svelte`): 記事一覧とページネーション機能を提供します。
   - ブログ記事ページ (`/blog/[slug]/+page.svelte`):
     個別のブログ記事を表示し、OGP画像生成、シェアボタン、関連記事表示などの機能があります。
   - レイアウト (`+layout.svelte`): 全ページ共通のヘッダー、フッター、テーマ設定(NProgress、ダークモード)を管理します。

  2. UIコンポーネント (/app/src/components)
   - Card (`Card.svelte`): ブログ記事の詳細表示コンポーネントで、Markdownのレンダリング、目次、コードブロックのコピー機能、画像
     の拡大表示などを行います。
   - PostList/PostCard: 記事一覧と個別記事カードのコンポーネントです。
   - Header/Footer: ナビゲーションバーとフッターです。
   - その他のUI要素: タグ、タイム、画像、リンク、ページネーションなど、再利用可能なUIコンポーネント群です。

  3. データ取得とリポジトリ (/app/src/repositories)
   - Repositoryパターン: Contentful APIへのアクセスを抽象化するためのRepositoryパターンを採用しています。
   - PostRepository: 記事データの取得、検索、詳細表示などを行う主要なリポジトリです。
   - GraphQLクライアント (`client.ts`): @urql/coreを使用してContentfulのGraphQL APIと通信します。

  4. Markdown処理 (/app/src/lib/server/markdownToHtml.ts)
   - Unified.js ecosystem: MarkdownのパースとHTMLへの変換にUnified.jsエコシステムを使用しています。
   - プラグイン: remark/rehypeプラグインを使用して、リンクカード、動画埋め込み、アラート、コードブロックのハイライト、目次生成
     などの機能を実現しています。

  5. ビルドとデプロイ
   - Vite: ビルドツールとしてViteを使用しています。
   - Cloudflare Pages: Cloudflare Pagesへのデプロイに対応したアダプターが設定されています。
   - OGP画像生成: 各記事ページにOGP画像を生成するための隠しリンクが設置されています。

  このアプリケーションは、モダンなフロントエンド技術とヘッドレスCMSを組み合わせた、高機能でパフォーマンスの良いブログサイトを実
  現しています。
```

メモリファイルとして `QWEN.md` を使用しているようですので、`QWEN.md` ファイルを作成して内容を保存しておきましょう。

次に、特定の機能を実装するためのコードを生成してもらいましょう。指示を出す前に `/clear` コマンドでコンテキストをクリアしておきます。

```bash
/clear
```

以下のプロンプトを入力してリファクタリングを依頼します。

```txt
rss.xmlとllms.txtエンドポイントで似たようなデータ取得・変換ロジックが重複があるので、共通の関数にリファクタリングしてください。
```

まずは `FindFiles` や `SearchText` ツールを使用してエンドポイントが定義されているファイルを検索し、コードを調査しています。ファイルが見つかると、`ReadFile` ツールを使用して現在の実装を確認しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/jhupyWsxdxJSd3lcmT7Ss/0004548c9b9585f1fc593b48cbaebbb2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_11.02.24.png)

はじめに共通化されたロジックを提案してきました。`WriteFile` ツールの実行の許可を求めてきますので、許可します。「Modify with external editor」を選択すると VSCode で差分を確認することもできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1ng5qkG8QZjgMeXLst0B57/b9913dd10e8541611f50a62f45ae7295/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_11.31.37.png)

続いて `Edit` ツールを使用して `src/routes/api/rss.xml.ts` と `src/routes/api/llms.txt.ts` のコードを編集しています。

実装が完了したらビルドとテストを実行して実装に問題がないか確認しています。シェルコマンドの実行時にはユーザーの許可を求めてきます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3R2XRWl62xirmGKUvFSiqB/b919f427ee7dd974a296899b5b6914df/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_11.40.25.png)

最終的に今回どのような変更をしたかを説明してきました。

![](https://images.ctfassets.net/in6v9lxmm5c8/xkRL03Ym9A8hMJw1AQrpp/c094956738915595306b5fbd7db10d3d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_11.47.23.png)

追加で作成してコードに対してテストコードを生成してもらいましょう。

```txt
今回実装したコードに対してテストコードを追加してください。GraphQL のモックには msw を使用してください。
```

しばらくやり取りをしていると、セッションのトークンリミットを超過しているというエラーが発生し中断してしまいました。デフォルトでは 1 度のセッションにつき 32,000 トークンの制限があるようです。msw の正しい使用方法を教えるためにドキュメントのマークダウンをそのまま貼り付けたり、テストが何回か失敗してやり直していたりしていたものの、通常のやり取りの範疇で制限が来てしまうという感じですね。

![](https://images.ctfassets.net/in6v9lxmm5c8/33CDKu8URupw6eXZqVdp5t/0991b16a830ddfd7473ea05cfbcc61c9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-08-03_12.22.25.png)

セッションを超過した場合には以下の解決策が提示されます。

- `/clear` コマンドを実行して新しいセッションを開始する
- `.qwen/settings.json` ファイルの `sessionTokenLimit` を増やす
- `/compress` コマンドを実行してセッションのトークンを圧縮する

今回はそのままセッションの続きを行ってほしいので `/compress` コマンドを実行してセッションのトークンを圧縮します。トークンの圧縮は多少時間がかかります。

```bash
/compress
```

`/compress` コマンドを実行してからしばらくやり取りをしていたのですが、その後なぜか空の内容でコードの編集を提案したり、同じ内容の応答を繰り返したりなどモデルの出力が不安定になってしまいました。Claude Code の auto compact でも同じようにコンテキストを圧縮した後性能が不安定になる事象を確認しているので、リミットを超過した後は新しいセッションを開始した方が良いでしょう。

GraphQL のモックで 2 回目のリクエストでも同じ内容のレスポンスが返されてしまうという問題で苦戦したようでした。原因としては GraphQL　のリクエストがキャッシュされていたことだったのですが、問題をうまく特定できず、何度も同じやり取りを繰り返していました（試しに Claude Code + Serena で問題の解決を試みたところ、すぐにキャッシュが原因だと特定してくれました）。

## まとめ

- Qwen3-Coder は Alibaba が開発した LLM モデルで、Agentic Coding や Agentic Browser-Use の分野で特筆した成果を上げている
- Qwen Code は Qwen3-Coder モデルに特化した CLI 型のツールで、コーディングエージェントとして利用できる
- 以下の環境変数を設定することで OpenRouter 経由で Qwen3-Coder モデルを利用できる
  - `OPENAI_API_KEY`: `<your-api-key>`
  - `OPENAI_BASE_URL`: `https://openrouter.ai/api/v1`
  - `OPENAI_MODEL`: `qwen/qwen3-coder:free`
- Qwen Code を使用してコードベースの調査やリファクタリング、テストコードの生成などをした
- セッションのトークンリミットはデフォルトで 32,000 トークンに設定されている。超過した場合 `/clear` コマンドで新しいセッションを開始するか、`/compress` コマンドでトークンを圧縮できる
- `.qwen/settings.json` ファイルの `sessionTokenLimit` を増やすことでセッションのトークンリミットを変更できる

## 参考

- [Qwen](https://qwen.readthedocs.io/en/latest/)
- [Qwen3-Coder: Agentic Coding in the World | Qwen](https://qwenlm.github.io/blog/qwen3-coder/)
- [QwenLM/qwen-code: qwen-code is a coding agent that lives in digital world.](https://github.com/QwenLM/qwen-code?tab=readme-ov-file)
