---
id: MPEh7n0SXWiZkKf-vKUGo
title: "AI エージェント向けのパッケージマネージャー apm"
slug: "apm-package-manager"
about: "apm は Microsoft が開発した AI エージェント向けパッケージマネージャーです。npm や pip のように依存関係を解決しながら、エージェントのスキルや MCP をパッケージ化して管理・共有できます。この記事では apm の基本的な使い方を紹介します。"
createdAt: "2026-04-16T19:55+09:00"
updatedAt: "2026-04-16T19:55+09:00"
tags: ["apm", "agent skills", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6bcoL9NTLsCTlwPjpgFNkO/370d0d80c6b6e6f33aee9d4b24796868/wild-plants_itadori_21652.png"
  title: "イタドリのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "apm でパッケージを作成する際、インストラクションの .instructions.md ファイルに記述する applyTo フィールドの役割は何ですか？"
      answers:
        - text: "インストラクションの適用対象となるエージェントの種類を指定する"
          correct: false
          explanation: "applyTo はエージェントの種類ではなく、ファイルやディレクトリのパスパターンを指定するフィールドです。"
        - text: "インストラクションを適用する依存パッケージの名前を指定する"
          correct: false
          explanation: "applyTo は依存パッケージではなく、インストラクションが適用されるファイルのパスを指定します。"
        - text: "インストラクションが適用されるファイルパスのパターンを指定する"
          correct: true
          explanation: "applyTo にはファイルやディレクトリのパスパターン（例: articles/*.md）を指定します。Claude Code にインストールされた場合は rules の paths フィールドに変換されます。"
        - text: "インストラクションの優先度を数値で指定する"
          correct: false
          explanation: "applyTo は優先度ではなく、適用対象のファイルパスパターンを指定するフィールドです。"
published: true
---
AI コーディングエージェントを効果的に動作させるためにはコンテキストが肝要です。開発者はプロンプトエンジニアリング, ツールの設計, スキル, MCP といった様々な要素を組み合わせて、エージェントが適切な情報にアクセスできるようにする必要があります。しかし現状では個々の開発者が手元でこれらの要素を管理しており、チームでの共有や再利用が難しいという課題があります。

apm (Agent Package Manager) は Microsoft が開発している、AI エージェント向けのパッケージマネージャーです。npm や pip と同様の仕組みで依存関係を解決しながら、エージェントのプロンプトやツール、スキル、MCP をマニフェストとしてパッケージ化して管理・共有できる仕組みを提供します。マニフェストは GitHub などの Git リポジトリでホストされインストールできます。これにより、エージェントの構成要素をチーム内で簡単に共有・再利用できるようになることが期待されます。

スキルや MCP の共有はすでに[プラグイン](https://code.claude.com/docs/ja/plugins-reference)を通じてある程度実現されていますが、apm は 1 つのコマンドでツールを横断して依存関係を解決しながら複数のスキルや MCP をまとめて管理できたり、ロックファイルによって同一の依存関係セットを再現できるなど、より高度な管理機能を提供します。apm は以下のプリミティブをサポートしています。

- エージェント: 特定のタスクに特化したサブエージェントの構成要素を定義したもの
- インストラクション: エージェントに対するルールやガイドラインを定義したもの
- スキル: [Agent Skills](https://agentskills.io/home) の仕様に準拠した、あるタスクを実行させる具体的な指示
- フック: エージェントの実行フローの特定のタイミングで呼び出されるスクリプト
- プロンプト: エージェントに対するコンテキストやガイダンスを提供するテンプレート
- プラグイン: 事前にパッケージ化されたスキルや MCP をエージェントに組み込むための仕組み

この記事では apm の基本的な使い方について紹介します。

## apm のインストール

はじめに以下のコマンドで `apm` コマンドをインストールします。

```bash
# macOS/Linux
curl -sSL https://aka.ms/apm-unix | sh
# Windows (PowerShell)
irm https://aka.ms/apm-windows | iex
```

インストールが完了したら、以下のコマンドで apm が正しくインストールされたか確認できます。

```bash
$ apm --version

Agent Package Manager (APM) CLI version 0.8.11 (81082e2)
```

## パッケージをインストールする

apm を使用してエージェントのパッケージをインストールするには、`apm install` コマンドを使用します。試しに最も基本的な構成である [microsoft/apm-sample-package](https://github.com/microsoft/apm-sample-package) をインストールしてみましょう。

```bash
apm install microsoft/apm-sample-package
```

`#` に続けてタグ名を指定することで、特定のバージョンをインストールできます。

```bash
apm install microsoft/apm-sample-package#v1.0.0
```

`apm install` コマンドを実行すると以下のような流れでパッケージがインストールされます。

1. `apm.yml` というマニフェストファイルが作成され、インストールしたパッケージが `dependencies` セクションに追加される
2. パッケージを `apm_modules` ディレクトリにダウンロードする
3. 依存関係を解決し、AI が使用しているディレクトリ（`.claude/` や `.github/`）にスキルや MCP を展開する
4. ロックファイル `apm.lock.yaml` を生成する

始めに `apm.yml` というマニフェストファイルが作成されます。ここにはパッケージのメタデータや依存関係が記述されます。`dependencies` セクションにインストールしたパッケージが配列形式で追加されていることがわかります。

```yaml:apm.yml
name: apm-test
version: 1.0.0
description: APM project for apm-test
author: azukiazusa1
dependencies:
  apm:
  - microsoft/apm-sample-package
  mcp: []
scripts: {}
```

依存関係の解決が完了すると、`apm.lock.yaml` というロックファイルが生成されます。ここにはプロジェクト内のすべての依存関係の正確な解決状態を記録します。`package-lock.json` と同じく、同じロックファイルが与えられた場合は同じ依存関係のセットが再現されることが保証されます。

```yaml:apm.lock.yaml
lockfile_version: '1'
generated_at: '2026-04-16T11:10:34.684248+00:00'
apm_version: 0.8.11
dependencies:
- repo_url: microsoft/apm-sample-package
  host: github.com
  resolved_commit: fb2851683be0e0e7711421d518bd8dba23b0b1f6
  package_type: apm_package
  deployed_files:
  - .github/agents/design-reviewer.agent.md
  - .github/instructions/design-standards.instructions.md
  - .github/prompts/accessibility-audit.prompt.md
  - .github/prompts/design-review.prompt.md
  - .github/skills/style-checker
  content_hash: sha256:744cca54cc8ff7ca90aa1dd621c2f98c6291cd793815afe8518001cc94b8aba9
- repo_url: github/awesome-copilot
  host: github.com
  resolved_commit: 9d117370f901e2244316dfd8cf5362435705b658
  virtual_path: skills/review-and-refactor
  is_virtual: true
  depth: 2
  resolved_by: microsoft/apm-sample-package
  package_type: claude_skill
  deployed_files:
  - .github/skills/review-and-refactor
  content_hash: sha256:9236d06a1500089ddb46975b866e9a63478e502afe7095b1980c618678a7c7fe
```

依存パッケージは `apm_modules` ディレクトリにダウンロードされます。ここにはインストールされたパッケージのソースコードが格納されます。

```sh
apm_modules
├── github
│   └── awesome-copilot
│       └── skills
│           └── review-and-refactor
│               └── SKILL.md
└── microsoft
    └── apm-sample-package
        ├── apm.yml
        ├── CODE_OF_CONDUCT.md
        ├── CONTRIBUTING.md
        ├── LICENSE
        ├── README.md
        └── SECURITY.md

7 directories, 7 files
```

インストールしたパッケージは自動で AI が使用しているディレクトリ（`.claude/` や `.github/`）に展開されます。ここでは `.github/` ディレクトリにエージェント, スキル, プロンプトが展開されており、GitHub Copilot を使用していればそのままエージェントがスキルやプロンプトを利用できるようになります。

```sh
.github
├── agents
│   └── design-reviewer.agent.md
├── instructions
│   └── design-standards.instructions.md
├── prompts
│   ├── accessibility-audit.prompt.md
│   └── design-review.prompt.md
└── skills
    ├── review-and-refactor
    │   └── SKILL.md
    └── style-checker
        └── SKILL.md

7 directories, 6 files
```

Claude Code や Codex といった異なるコーディングエージェントを使用している場合には、異なるディレクトリに展開する必要があるでしょう。`apm install` コマンドを実行した際に `.claude` や `.codex` といったディレクトリが存在している場合は、自動で対象のディレクトリに展開されます。もしくは `--target` オプションを使用して明示的に展開先を指定できます。

```bash
apm install microsoft/apm-sample-package --target claude
```

`--target claude` と指定することで、`.claude` ディレクトリに展開されます。AI エージェントごとの差異を吸収して適切な場所に展開してくれていることがわかります。

```sh
.claude
├── agents
│   └── design-reviewer.md
├── commands
│   ├── accessibility-audit.md
│   └── design-review.md
├── rules
│   └── design-standards.md
└── skills
    ├── review-and-refactor
    │   └── SKILL.md
    └── style-checker
        └── SKILL.md

7 directories, 6 files
```

## パッケージスクリプト

`apm.yml` には `scripts` セクションもあり、ここにコマンドを定義しておくと `npm run` と同様の感覚でコマンドを実行できます。例えば以下のように `style-check` コマンドを定義してみましょう。このコマンドは Claude Code から `style-checker` スキルを呼び出すためのコマンドです。

```yaml:apm.yml
scripts:
  style-check: 'claude "/style-checker"'
```

`scripts` セクションで定義したコマンドは `apm run` コマンドで実行できます。なお、`apm run` は現時点では実験的な機能です。

```bash
apm run style-check
```

## パッケージを作成する

ここではゼロからパッケージを作成し、GitHub リポジトリに公開するまでの流れを簡単に紹介します。はじめに `apm init` コマンドで新しいパッケージを作成します。

```bash
apm init writing-assistant
```

コマンドを実行すると対話形式でパッケージの名前や説明を入力するように求められます。すべての質問に答えると、`apm.yml` というマニフェストファイルが生成されます。

```yaml:apm.yml
name: writing-assistant
version: 1.0.0
description: APM project for writing-assistant
author: azukiazusa1
dependencies:
  apm: []
  mcp: []
scripts: {}
```

パッケージに追加するインストラクションやスキルといった構成要素は `.apm` ディレクトリに配置します。プリミティブごとに以下のディレクトリ構成を推奨します。

```sh
.apm
├── agents
│   └── *.agent.md
├── instructions
│   └── *.instructions.md
├── prompts
│   └── *.prompt.md
├── skills
│   └── <skill-name>
│       └── SKILL.md
└── hooks
    ├── *.json
    └── scripts
        └── *.sh, *.py ...
```

### インストラクション

インストラクションはエージェントに対するルールやガイドラインを定義したもので、`.apm/instructions` ディレクトリに配置します。このファイルにはコーディングスタイルや慣例、ガイドラインといった、エージェントが従うべきルールを記述します。ここでは例として技術記事を執筆するためのインストラクションを定義してみましょう。

`.instructions.md` ファイルには以下の 2 つのメタデータを YAML フロントマターで記述します。

- `description`: インストラクションの説明を記述する。インストラクションの内容を簡潔に説明する文章を記述する
- `applyTo`: インストラクションを適用するファイルやディレクトリを指定する

````markdown:.apm/instructions/technical-article.instructions.md
---
description: "技術記事を執筆するためのインストラクション。技術記事を書く際のスタイルや構成のガイドラインを定義する。"
applyTo: "articles/*.md"
---

### 記事構成

1. **導入** — 「この記事では〜」で始め、扱うテーマ・背景・目的を簡潔に述べる
2. **本文** — `##` / `###` の見出しで論理的に展開する。各セクションで特定の技術要素や手順を解説する
3. **まとめ** — 箇条書きで要点を再確認する。`## まとめ` という見出しを使う
4. **参考文献** — `## 参考` という見出しの下に、参照した公式ドキュメントや記事を列挙する

### 文体・トーン

- **敬体（ですます調）** を基本とする
- 一人称は「私」を使用する
- 客観的な解説が主。自身の感想・所感には「〜と思います」「〜と感じました」を使う
- 対象読者は Web 開発に関心のあるエンジニア。基礎知識はある程度前提とするが、新概念は丁寧に解説する
- 論理的な流れを明確にするため「しかし」「また」「例えば」「そのため」「続いて」などの接続詞を活用する

### Markdown 記法

**コードブロック**

言語識別子を必ず付ける。ファイル名を示す場合は `:ファイル名` を続ける。

```ts:src/index.ts
// コード
```

```

差分を示す場合は `diff` を使う。

```

```diff
- 削除行
+ 追加行
```

**コールアウト（注意・補足）**

```
:::info
補足情報
:::

:::tip
Tips・推奨事項
:::

:::warning
警告・注意事項
:::
```
````

### スキル

スキルはあるタスクを実行させる具体的な指示を定義したもので、`.apm/skills` ディレクトリに配置します。スキルは [Agent Skills](https://agentskills.io/home) の仕様に準拠した名前をもつ必要があります。

- 1～64 文字
- 小文字の英数字とハイフンのみ
- 連続するハイフン（`--`）は使用できない
- ハイフンで開始/終了できない

またスキルにはエージェントへの指示を記述した `SKILL.md` ファイルの他に、スキルの実行に必要なファイルやスクリプトを同じディレクトリに配置できます。追加したリソースは AI エージェントが参照可能な `apm_modules/` ディレクトリに展開されます。

ここでは技術記事をレビューするスキル `tech-article-reviewer` を定義してみましょう。`name` と `description` は必須属性です。Agent Skills の仕様に則り、`name` は 64 文字以内、`description` は 1024 文字以内である必要があります。

````markdown:.apm/skills/tech-article-reviewer/SKILL.md
---
name: tech-review
description: ソフトウェアエンジニア向けの技術書・原稿をレビューし、構成・技術的正確性・読者体験の観点から改善提案を行うスキル。ユーザーが技術書の原稿、章のドラフト、チュートリアル記事、技術ドキュメントのレビューを依頼したときに使う。「原稿をレビューして」「この章を見てほしい」「技術書を書いている」「コードサンプルをチェックして」「構成についてアドバイスがほしい」といった依頼で発動する。技術書の執筆支援、編集フィードバック、構成改善、コードレビュー（書籍内のコード）、読者レベルの調整など、技術書制作に関わるあらゆるレビュー作業に対応する。
---

# 技術書原稿レビュースキル

ソフトウェアエンジニア向けの技術書・チュートリアル・技術記事の原稿を、プロの編集者の視点でレビューし、具体的な改善提案を行う。

## レビューの全体フロー

原稿を受け取ったら、以下の順序でレビューを進める。

### 1. 初期分析（まず把握すること）

原稿を読む前に、以下を確認または推定する：

- **想定読者**: 初心者 / 中級者 / 上級者 のどのレベルか
- **書籍の種類**: 入門書 / リファレンス / クックブック / チュートリアル / 実践ガイド
- **対象技術**: 言語、フレームワーク、ツールなど
- **原稿の段階**: 初稿 / 第2稿 / 最終稿に近いか

ユーザーがこれらを明示していない場合は、原稿の内容から推定し、「〇〇向けの中級者向けチュートリアルとしてレビューしますが、認識は合っていますか？」のように確認する。

### 2. マクロレビュー（構成・全体像）

最初に大きな視点から見る。細かい文法やtypoは後回し。

**構成の論理性を確認する観点：**

- 章・節の並びに論理的な流れがあるか。「なぜこの順番なのか」を読者が自然に理解できるか
- 前の章で学んだ概念が後の章で活用される「積み上げ構造」になっているか
- 突然難しい概念が登場していないか（難易度の急激なジャンプ）
- 各章の分量バランスは適切か（極端に長い/短い章がないか）

**スコープの適切さ：**

- 書籍のタイトルや目的に対して、内容が広すぎたり狭すぎたりしていないか
- 「この本を読んだ後、読者は何ができるようになるか」が明確か

### 3. ミクロレビュー（各章・各節の品質）

#### 技術的正確性

これが最も重要。技術書の信頼性に直結する。

- コードサンプルに文法エラーや論理エラーがないか
- APIやライブラリのバージョンが明示されているか、廃止された機能を使っていないか
- 技術的な説明に誤りや不正確な記述がないか
- セキュリティ上のアンチパターンをベストプラクティスとして紹介していないか

コードが実際に動作するかどうかを可能な範囲で検証する。コンテナ環境で実行可能なコードであれば、実際に動かしてみる。

#### 読者体験

- 新しい概念の導入時に「なぜこれが必要か」のモチベーションが先に示されているか
- 専門用語の初出時に定義や説明があるか
- 抽象的な説明の後に具体例が続いているか
- 「ここまでのまとめ」や「次に学ぶこと」のような道標があるか

#### コードサンプルの品質

技術書のコードは「動く」だけでは不十分。読者が学ぶためのものなので：

- 変数名・関数名が意図を表現しているか（`x`, `tmp` のような意味のない名前を避ける）
- 段階的に複雑になっていく構成か（最初はシンプルに、徐々に機能追加）
- コメントが「何をしているか」ではなく「なぜそうしているか」を説明しているか
- エラーハンドリングが含まれているか（本番コードの習慣を身につけてもらう）
- コピー&ペーストして動くか（import文の欠落、未定義変数がないか）

### 4. 一貫性チェック

書籍全体の統一感を確認する：

- **用語の統一**: 同じ概念に異なる用語を使っていないか（例：「関数」と「メソッド」の混同、「デプロイ」と「配備」の混在）
- **コードスタイルの統一**: インデント、命名規則、言語バージョンが章をまたいで一貫しているか
- **文体の統一**: 敬体/常体、「です・ます」/「だ・である」が混ざっていないか
- **図表の書式**: キャプション、番号付け、参照方法が統一されているか

### 5. レビューレポートの出力

レビュー結果は以下の構造で出力する：

```
# 原稿レビューレポート

## 概要
- 対象: [原稿タイトル/章番号]
- 想定読者: [レベル]
- 全体評価: [ひとことの総合評価]

## 良い点
[原稿の強みを具体的に挙げる。改善点だけでなく、うまくいっている部分を伝えることで著者のモチベーションを保つ]

## 重要な改善提案（優先度: 高）
[技術的な誤り、構成上の大きな問題など、出版前に必ず直すべき点]

## 改善提案（優先度: 中）
[読者体験の向上、説明の明確化など、直すとより良くなる点]

## 細かい指摘（優先度: 低）
[typo、表現の微調整、好みレベルの提案]

## コードレビュー
[コードサンプルごとの具体的なフィードバック。修正案のコードも示す]

## 次のステップ
[著者が次に取り組むべきアクション]
```

## レビューの姿勢

- **著者を尊重する**: 原稿は著者の専門知識と努力の結晶。批判ではなく、建設的なフィードバックを心がける
- **読者の代弁者になる**: 「この説明を初めて読む人はどう感じるか」を常に考える
- **具体的に提案する**: 「わかりにくい」ではなく「〇〇の例を追加すると理解しやすくなる」のように代替案を示す
- **優先順位をつける**: すべてを同じ重要度で指摘すると著者が圧倒される。重大な問題から伝える
````

### 依存パッケージの追加

依存パッケージを追加しておけば、そのパッケージもプロジェクト固有のコンテンツ `.apm/` と同梱されインストールされるようになります。例として最新のドキュメント情報を取得する [Context7](https://context7.com/) MCP サーバーを依存関係として追加してみましょう。現時点では MCP サーバーを直接インストールできないため、`apm.yml` の `dependencies` セクションに直接追加する必要があります。

```yaml:apm.yml
dependencies:
  mcp:
  - io.github.upstash/context7
```

その後 `apm install` コマンドを実行して Context7 MCP サーバーをインストールします。Context7 の API キーの入力が求められますが、ここではスキップして構いません。

```bash
apm install
```

インストールが完了すると、`.vscode/mcp.json` ファイルが作成され、Context7 MCP サーバーの情報が記述されていることがわかります。

```json:.vscode/mcp.json
{
  "servers": {
    "io.github.upstash/context7": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ],
      "env": {
        "CONTEXT7_API_KEY": "${input:context7-api-key}"
      }
    }
  },
  "inputs": [
    {
      "type": "promptString",
      "id": "context7-api-key",
      "description": "API key for authentication",
      "password": true
    }
  ]
}
```

### パッケージの公開

パッケージを公開するには、GitHub などの Git リポジトリに `apm.yml` と構成要素を配置してコミット・プッシュするだけです。

```sh
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<username>/writing-assistant
git push -u origin main
```

公開したパッケージは `apm install <username>/<repository>` コマンドでインストールできるようになります。

```bash
apm install azukiazusa1/writing-assistant --target claude
```

インストールに成功すると、`.claude` ディレクトリにインストラクションやスキルが、`.vscode/mcp.json` に MCP サーバーの情報が展開されていることがわかります。MCP の設定は `.claude` ディレクトリには展開されないようです。

```sh
.
├── .claude
│   ├── rules
│   │   └── technical-article.md
│   └── skills
│       └── tech-reviewer
│           └── SKILL.md
├── .gitignore
├── .vscode
│   └── mcp.json
├── apm.yml
└── apm.lock.yaml
```

`instructions` ディレクトリに技術記事の執筆に関するインストラクションは Claude Code の仕様に則ってルールとして展開されていることがわかります。また `applyTo` フィールドも適切に `paths` に変換されていることがわかります。

```yaml:.claude/rules/technical-article.md
---
paths:
- "articles/*.md"
---

### 記事構成

...
```

## まとめ

- AI エージェントの構成要素をパッケージ化して管理・共有できる apm というパッケージマネージャーが Microsoft から提供されている
- パッケージの構成要素はエージェント、インストラクション、スキル、プロンプト、フック、プラグインの 6 種類
- `apm install` コマンドで GitHub などのリポジトリにホストされたパッケージをインストールできる
- インストールしたパッケージは AI エージェントが使用しているディレクトリ（`.claude/` や `.github/`）に自動で展開される。`--target` オプションで明示的に展開先を指定することも可能
- `apm init` コマンドで新しいパッケージを作成できる。構成要素は `.apm/` ディレクトリに配置する
- パッケージを公開するには GitHub などの Git リポジトリに `apm.yml` と構成要素を配置してコミット・プッシュするだけでよい

## 参考

- [microsoft/apm: Agent Package Manager](https://github.com/microsoft/apm)
- [APM – Agent Package Manager | Agent Package Manager](https://microsoft.github.io/apm/)
