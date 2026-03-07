---
id: VTiIv3S58XSIoE7yzFhNo
title: "Skill Create スキルを使用したスキルの作成と改善"
slug: "skill-create-skill-creation-and-improvement"
about: "オープンスタンダードである Agent Skills に従い Claude Code にドメインの専門知識や組織のナレッジを提供するスキルが最近注目を集めていますが、スキルの作成にはいくつかのハードルがあります。Anthropic は skill-creator と呼ばれるスキルの作成と改善のプロセス、パフォーマンス測定を支援するツールを提供しています。この記事では skill-creator を使用してスキルを作成・改善を行うプロセスを実際に体験してみます"
createdAt: "2026-03-07T11:08+09:00"
updatedAt: "2026-03-07T11:08+09:00"
tags: ["agent skill", "skill-creator", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2zjJyzLOtRXdLMHJUvrJ2f/755f49ac07b162cb246ece7cdf9d5df6/onsen-manjyu_16831-768x610.png"
  title: "温泉まんじゅうのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`SKILL.md` の `description` フィールドの文字数制限はいくつですか？"
      answers:
        - text: "64文字"
          correct: false
          explanation: null
        - text: "128文字"
          correct: false
          explanation: null
        - text: "256文字"
          correct: false
          explanation: null
        - text: "1024文字"
          correct: true
          explanation: "`description` フィールドはスキルを呼び出すかどうかの判断に利用されるため、常にシステムプロンプトに含まれます。コンテキストを圧迫しないように 1024 文字の制限があります。"
    - question: "`skill-creator` のサブエージェントのうち、スキルの改善前後のパフォーマンスを比較する役割を持つのはどれですか？"
      answers:
        - text: "analyzer.md"
          correct: false
          explanation: "analyzer.mdはスキルの改善点を分析するエージェントです。"
        - text: "grader.md"
          correct: false
          explanation: "grader.mdはスキルのパフォーマンスを採点するエージェントです。"
        - text: "comparator.md"
          correct: true
          explanation: "comparator.mdはスキルの改善前後でのパフォーマンスを比較するために使用されます。"
        - text: "evaluator.md"
          correct: false
          explanation: "evaluator.mdというエージェントは存在しません。"
published: true
---
オープンスタンダードである [Agent Skills](https://agentskills.io/home) に従い Claude Code にドメインの専門知識や組織のナレッジを提供するスキルが最近注目を集めています。Opus 4.6 が登場したことでモデルの性能が飛躍的に向上し、プロジェクト全体のワークフローを任せられるレベルに達したことや、非エンジニア領域にも Claude Code の活用が広まっていることも背景にあるでしょう。専門的な知識を持つ人がスキルを作成し、モデルの能力を引き出すことで、より高度なタスクを自動化できるようになります。従来の組織でも特定の業務の属人化という課題がありましたが、スキルを活用してナレッジを共有することにより、組織全体の生産性を向上させることが期待できます。

しかし、スキルの作成にはいくつかのハードルがあります。スキルの作成者となるのは専門知識を持つ人であることが多いですが、必ずしもエンジニアリングの知識があるとは限りません。またエンジニアがスキルを作成する場合でも、スキルの評価をどう行うかという問題があります。従来のソフトウェア開発のテストと異なり、スキルの評価は定量的な指標を用いることが難しいため、主観的な評価に頼らざるを得ないことが多いです。さらに、スキルの改善も継続的に行う必要がありますが、どのように改善すれば良いかという指針が明確でないことも課題となっています。実際に勉強会でもスキルや AI エージェントの評価をどうするかという会話をよく耳にします。

このような課題を解決するために、Anthropic は [skill-creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) と呼ばれるプラグインを提供しています。`skill-creator` はスキルの作成と改善のプロセス、パフォーマンス測定を支援するツールです。スキルをゼロから作成したり、既存のスキルを編集・最適化したり、評価してスキルのパフォーマンスを測定したりする際に利用できます。

この記事では `skill-creator` を使用してスキルを作成・改善し、どのように `skill-creator` を活用してスキルのパフォーマンスを測定するかについて解説します。

## `skill-creator` の解剖

`skill-creator` 自身も Agent Skill の[ベストプラクティス](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)に従って作成されているため、このスキルを分析すること自体もスキル作成の学習に役立ちます。`skill-creator` のディレクトリ構成は以下のようになっています。

```sh
.
├── agents
│   ├── analyzer.md
│   ├── comparator.md
│   └── grader.md
├── assets
│   └── eval_review.html
├── eval-viewer
│   ├── generate_review.py
│   └── viewer.html
├── LICENSE.txt
├── references
│   └── schemas.md
├── scripts
│   ├── __init__.py
│   ├── aggregate_benchmark.py
│   ├── generate_report.py
│   ├── improve_description.py
│   ├── package_skill.py
│   ├── quick_validate.py
│   ├── run_eval.py
│   ├── run_loop.py
│   └── utils.py
└── SKILL.md
```

スキルの核となるのが `SKILL.md` です。Claude はタスクを実行する際に以下の 3 段階に渡ってシステムプロンプトに内容を読み込みます。

1. `SKILL.md` の `name`, `description` フィールド: スキルの説明が書かれている部分で、スキルを呼び出すかどうかの判断に利用される。常にシステムプロンプトに含まれるため、コンテキストを圧迫しないようにそれぞれ 64 文字, 1024 文字の制限がある
2. `SKILL.md` 本文: スキルが呼び出された場合にシステムプロンプトに含まれる部分で、スキルの実行手順や注意事項などが書かれている。最適なパフォーマンスを発揮するために 500 行以下に収めることが推奨されている
3. 追加のリソース（`references/`, `assets/`, `scripts/` など）: スキルの実行に必要な追加情報で、必要に応じて読み込まれる

`skill-creator` スキルの `description` フィールドには以下のように書かれているため、スキルを作成したり評価するような指示を与えると、Claude はこのスキルを呼び出すことになるでしょう。スキルを呼び出すかどうかの判断は `Use when users ...` の部分が重要です。

```txt
Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy.
```

`SKILL.md` にはスキルを実行する際のワークフローが書かれています。スキルのベストプラクティスでは複雑な操作は、明確で順序のあるステップに分割することが推奨されています。

大まかな流れとしては以下のようになっています。ユーザーがスキルの作成や改善に際して随時介入できるように設計されていることがわかります。またフィードバックループパターンを実装することにより、品質の向上が期待できます。

1. ユーザーの意図を把握するために、インタビューやリサーチをする
2. `SKILL.md` を執筆する
3. スキルを評価するためのテストケースを作成する
4. エージェントを並列で起動してテストケースを実行する。エージェントの評価の完了の待機中にユーザーに評価基準を説明する
5. すべてのエージェントの評価が完了したら、定量的な評価結果を集約してレポートを生成する
6. ビューワーを起動してブラウザ上でユーザーが評価結果を確認できるようにする
7. ユーザーのフィードバックをもとにスキルを改善する。このプロセスは問題が解決されるまで繰り返される
8. description の最適化（スキルが適切にトリガーされるか改善するループ）

追加のリソースは `SKILL.md` 内でどのように使用されるべきか定義されています。たとえば `generate_review.py` スクリプトを使用して定量的な評価を作成するように指示されていることがわかります。スクリプトを使用することにより、決定的（=同じ入力に対して同じ出力が得られる）な処理を実行できるという利点があります。

```markdown
- Help the user evaluate the results both qualitatively and quantitatively
  - While the runs happen in the background, draft some quantitative evals if there aren't any (if there are some, you can either use as is or modify if you feel something needs to change about them). Then explain them to the user (or if they already existed, explain the ones that already exist)
  - Use the `eval-viewer/generate_review.py` script to show the user the results for them to look at, and also let them look at the quantitative metrics
```

また専門的な処理はサブエージェントに適宜委譲されるようになっています。スキルの改善点を分析するための `analyzer.md` エージェント、スキルの改善前後でのパフォーマンスを比較するための `comparator.md` エージェント、スキルのパフォーマンスを採点するための `grader.md` エージェントなどが用意されています。分析や採点という専門的な処理をサブエージェントに任せることで、メインのセッションがコンテキストを圧迫せずに済むようになっています。

ドメインの専門知識は `/references` ディレクトリにまとめられています。`schemas.md` にはスキルの評価に使用される JSON スキーマが定義されており、これにより出力がブレがちな AI エージェントの出力をある程度構造化して安定させることができます。

`skill-creator` の具体的なワークフローは既存のスキルの改善を例にして、次のセクションで解説します。

## `skill-creator` プラグインをインストールする

`skill-creator` プラグインは `claude-plugins-official` マーケットプレイスから提供されています。Claude Code を起動して `/plugin` コマンドを入力し、検索バーに「skill-creator」と入力します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4M7p0H6TlC9hiZEYbpBHFp/dbd3cae3e2729d55be6286be46f891a7/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_11.55.10.png)

`skill-creator` プラグインを見つけたら、Enter キーを押してインストールします。インストールが完了すると、`/skill-creator` コマンドが使用可能になります。インストールしたスキルを反映するためには `/reload-plugins` コマンドを実行するか、Claude Code を再起動する必要があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7uVy35W0r8Du0iuCtQe6dQ/c18b1a3480b30b4624479ce36479d9d3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_12.06.39.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/3hLmThy1lGSNf9VEVcxAkY/914c2f6b88f1bd19f447ddeaf62a6db4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_12.07.19.png)

## 既存のスキルを改善する

早速、`skill-creator` を使用してスキルを改善してみましょう。ちょうど手元に記事の誤字脱字がないかをチェックするスキル `article-review` があるので、これを改善してみます。

<details>
<summary>`article-review` スキルの `SKILL.md` の内容</summary>

````markdown
---
description: "引数で指定した記事のレビューを行います。"
argument-hint: "[article-slug]"
allowed-tools: Bash(git *), Bash(npm *), Read, Glob, Grep, WebFetch
---

あなたはプロの編集者です。技術記事を読んで、誤字脱字、文法的な誤り、不自然な表現を指摘してください。

## 出力形式

```
【誤字脱字・表記ミス】
- 該当箇所：「〇〇〇」
  修正案：「×××」
  理由：[具体的な理由]

【文法的誤り】
- 該当箇所：「〇〇〇」
  修正案：「×××」
  理由：[具体的な理由]

【改善提案】
- より読みやすくするための提案があれば記載
```

### 注意事項

- 文体や表現の好みではなく、明確な誤りのみを指摘してください
- 修正案は必ず提示してください
- 記事の良い点にふれる必要はありません。指摘事項のみを出力してください

## コンテキスト

- 筆者の文章のスタイルは @writing-style.md を参照
````

</details>

スキルを呼び出すかどうかの判断は Claude に任されているため、スキルの作成や改善を指示したとしても 100% 呼び出されるわけではありません。確実に `skill-creator` を呼び出してスキルを改善したい場合は、スラッシュコマンド `/skill-creator` を直接入力して呼び出すこともできます。`/skill-creator article-review スキルを改善してください` といったプロンプトを入力してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5eL7IbvzRmpjxedIVtRi8K/7c7e1d29c9ba32e692ffb6dfc038949b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_12.12.16.png)

まずは現在の `SKILL.md` の内容を確認し、改善点を洗い出してくれます。ここでは以下の 4 点が指摘されています。

1. 記事ファイルの場所が不明 - q スキルと違い、`blogPost/$ARGUMENTS.md` の形式が書かれていない
2. textlint MCP が未活用 - `mcp__textlint__lintFile` が利用可能なのに使っていない
3. allowed-tools に textlint が含まれていない
4. description が不十分 - トリガー条件が曖昧

![](https://images.ctfassets.net/in6v9lxmm5c8/5vTH9QuKovURwH26iNK04h/e4db956b079f744164f6bbb219240e9e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_12.15.20.png)

指摘事項を元に `SKILL.md` の改善案を提示してくれます。改善後の `SKILL.md` は以下のようになりました。

````diff
   ---
  -description: "引数で指定した記事のレビューを行います。"
  +description: "引数で指定した記事のレビューを行います。記事スラッグを引数に渡すと、textlint による自動校正と誤字脱字・文法的な誤りの指摘を行います。/article-review [スラッグ] の形式で呼び出してください。記事を書いた後のチェック、公開前の校正、文章の品質確認にも使用してください。"
   argument-hint: "[article-slug]"
  -allowed-tools: Bash(git *), Bash(npm *), Read, Glob, Grep, WebFetch
  +allowed-tools: Bash(git *), Bash(npm *), Read, Glob, Grep, mcp__textlint__lintFile
   ---

  -あなたはプロの編集者です。技術記事を読んで、誤字脱字、文法的な誤り、不自然な表現を指摘してください。
  +あなたはプロの編集者です。`blogPost/$ARGUMENTS.md` の技術記事をレビューし、改善すべき点を指摘してください。

  +## 手順
  +
  +1. `blogPost/$ARGUMENTS.md` を読む
  +2. `mcp__textlint__lintFile` で自動校正を実行する（ファイルパスは絶対パスで指定）
  +3. `writing-style.md` を参照して筆者の文体スタイルを確認する
  +4. 下記の出力形式でレビュー結果をまとめる
  +
   ## 出力形式

  -```
  +### textlint の指摘
  +
  +textlint が検出した問題を列挙してください。問題がなければ「指摘なし」と記載してください。
  +各指摘には行番号と修正案を含めてください。
  +
  +### 手動レビュー
  +
   【誤字脱字・表記ミス】
   - 該当箇所：「〇〇〇」
     修正案：「×××」

     理由：[具体的な理由]

   【改善提案】
  -- より読みやすくするための提案があれば記載
  -```
  +- より読みやすくするための提案があれば記載（任意）

  -### 注意事項
  +## 注意事項

   - 文体や表現の好みではなく、明確な誤りのみを指摘してください
   - 修正案は必ず提示してください
   - 記事の良い点にふれる必要はありません。指摘事項のみを出力してください
  +- `writing-style.md` に記載された筆者固有のスタイル（例：「ですます調」「一人称は私」など）は誤りとして指摘しないでください

   ## コンテキスト

  -- 筆者の文章のスタイルは @writing-style.md を参照
  +- 記事のパス: `blogPost/$ARGUMENTS.md`
  +- 筆者の文章スタイルの詳細: `writing-style.md` を参照
````

## スキルの評価を行う

`SKILL.md` の更新が完了したら、スキルの評価も依頼してみましょう。`/skill-creator 新旧のスキルを比較して、どちらがより正確に記事の誤字脱字を指摘できているか評価してください` といったプロンプトを入力してみます。`skill-creator` の `SKILL.md` に記載されている以下の評価手順に従って、評価が実行されます。

```markdown
## Running and evaluating test cases

This section is one continuous sequence — don't stop partway through. Do NOT use `/skill-test` or any other testing skill.

Put results in `<skill-name>-workspace/` as a sibling to the skill directory. Within the workspace, organize results by iteration (`iteration-1/`, `iteration-2/`, etc.) and within that, each test case gets a directory (`eval-0/`, `eval-1/`, etc.). Don't create all of this upfront — just create directories as you go.

...
```

まずは `/sapper-blog-app/contents/.claude/skills/article-review-workspace/evals` と `/tmp/article-review-old-skill/article-review` ディレクトリが作成され、テストケースが定義されます。`.claude/skills/article-review-workspace/evals/evals.json` にはテストケースの定義が JSON 形式で保存されます。

<details>
<summary>テストケースの定義ファイル evals.json の内容</summary>

```json
{
  "skill_name": "article-review",
  "evals": [
    {
      "id": 1,
      "prompt": "/article-review VTiIv3S58XSIoE7yzFhNo",
      "expected_output": "誤字脱字・文法的な誤りが行番号付きで列挙され、修正案が提示される。textlint による自動校正結果も含まれる（新スキルのみ）",
      "files": [
        "/Users/asai/sapper-blog-app/contents/blogPost/VTiIv3S58XSIoE7yzFhNo.md"
      ],
      "assertions": [
        {
          "id": "has-correction-with-line-or-quote",
          "text": "該当箇所の引用（「〇〇〇」形式）が含まれている"
        },
        {
          "id": "has-fix-suggestion",
          "text": "修正案が提示されている（「修正案：」のラベルが存在する）"
        },
        {
          "id": "has-reason",
          "text": "理由が説明されている（「理由：」のラベルが存在する）"
        },
        {
          "id": "has-textlint-section",
          "text": "textlint の指摘セクションが含まれている（新スキルのみ期待）"
        },
        {
          "id": "catches-joshi-error",
          "text": "21行目の助詞ミス（「スキルを作成には」→「スキルの作成には」）を指摘している"
        },
        {
          "id": "catches-typo-shitei",
          "text": "「指定事項」→「指摘事項」の誤字を指摘している"
        }
      ]
    },
    {
      "id": 2,
      "prompt": "/article-review claude-code-hooks-run-formatter",
      "expected_output": "記事の誤字脱字・文法的誤りが列挙され、修正案が提示される",
      "files": [
        "/Users/asai/sapper-blog-app/contents/blogPost/claude-code-hooks-run-formatter.md"
      ],
      "assertions": [
        {
          "id": "has-correction-with-line-or-quote",
          "text": "該当箇所の引用（「〇〇〇」形式）が含まれている"
        },
        {
          "id": "has-fix-suggestion",
          "text": "修正案が提示されている"
        },
        {
          "id": "no-style-complaints",
          "text": "筆者スタイル（ですます調、一人称「私」）を誤りとして指摘していない"
        },
        {
          "id": "has-textlint-section",
          "text": "textlint の指摘セクションが含まれている（新スキルのみ期待）"
        }
      ]
    },
    {
      "id": 3,
      "prompt": "/article-review css-anchor-positioning",
      "expected_output": "記事の誤字脱字・文法的誤りが列挙され、修正案が提示される",
      "files": [
        "/Users/asai/sapper-blog-app/contents/blogPost/css-anchor-positioning.md"
      ],
      "assertions": [
        {
          "id": "has-correction-with-line-or-quote",
          "text": "該当箇所の引用（「〇〇〇」形式）が含まれている"
        },
        {
          "id": "has-fix-suggestion",
          "text": "修正案が提示されている"
        },
        {
          "id": "no-style-complaints",
          "text": "筆者スタイルを誤りとして指摘していない"
        },
        {
          "id": "has-textlint-section",
          "text": "textlint の指摘セクションが含まれている（新スキルのみ期待）"
        }
      ]
    }
  ]
}
```

</details>

その後エージェントを起動して新旧スキルの両方でテストケースが実行されます。新しくスキルを作成する場合にはスキルあり・なしで比較されます。3 つのテストケース x 新旧のスキルで合計 6 つのエージェントが並列で起動されており、エージェントの評価の実行中に採点基準を説明してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/3QDJ9kkpYb0Dvx64KJ7o75/c0c41dc1fae6dfc69eced9cdb7ae403a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_12.56.36.png)

評価基準の説明も `skill-creator` の `SKILL.md` に記載されている以下の内容に従っています。

```markdown
Don't just wait for the runs to finish — you can use this time productively. Draft quantitative assertions for each test case and explain them to the user. If assertions already exist in evals/evals.json, review them and explain what they check.
```

各エージェントの評価が完了するたびに、`.claude/skills/article-review-workspace/iteration-1/eval-1-skill-creator-article/old_skill/outputs/review.md` のようなパスで評価結果が保存されます。

```markdown:.claude/skills/article-review-workspace/iteration-1/eval-1-skill-creator-article/old_skill/outputs/review.md
# 記事レビュー結果（旧スキル）
対象ファイル: `blogPost/VTiIv3S58XSIoE7yzFhNo.md`

**【誤字脱字・表記ミス】**
- 該当箇所：「指定事項を元に `SKILL.md` の改善案を提示してくれます。」（104行目）
  修正案：「指摘事項を元に `SKILL.md` の改善案を提示してくれます。」
  理由：文脈上「改善点として指摘された事項」を指しており、「指定事項」（指定した事柄）ではなく「指摘事項」（指摘された事柄）が正しい。直前段落で「以下の4点が指摘されています」と書かれていることからも明らか。

  ...
```

また消費したトークン数や実行時間などのメタデータもサブエージェントから報告されます。この結果は `timing.json` ファイルとして保存され、後ほど評価に利用されます。

```json:.claude/skills/article-review-workspace/iteration-1/eval-1-skill-creator-article/old_skill/timing.json
{
  "total_tokens": 18734,
  "duration_ms": 43589,
  "total_duration_seconds": 43.6
}
```

すべてのエージェントの評価が完了したら、次は結果のグレーディングを行います。グレーディングは `skill-creator` で定義されたサブエージェントである `agents/grader.md` が担当します。それぞれの評価の基準に対して成功か失敗かの 2 値で採点します。採点結果には必ず明確な根拠が求められます。

```markdown:skill-creator/agents/grader.md
## Role

The Grader reviews a transcript and output files, then determines whether each expectation passes or fails. Provide clear evidence for each judgment.

You have two jobs: grade the outputs, and critique the evals themselves. A passing grade on a weak assertion is worse than useless — it creates false confidence. When you notice an assertion that's trivially satisfied, or an important outcome that no assertion checks, say so.
```

グレーディングの結果は `grading.json` として保存されます。各フィールドには `text`, `passed`, `evidence` が含まれます。`text` には評価基準の内容が、`passed` には評価基準を満たしているかどうかの真偽値が、`evidence` には評価基準を満たしていると判断した根拠が記載されます。

```json:.claude/skills/article-review-workspace/iteration-1/eval-1-skill-creator-article/old_skill/grading.json
{
  "eval_id": 1,
  "config": "new_skill",
  "expectations": [
    {
      "text": "該当箇所の引用（「〇〇〇」形式）が含まれている",
      "passed": true,
      "evidence": "「スキルを作成には」「指定事項を元に」など複数の引用形式が含まれている"
    },
    {
      "text": "修正案が提示されている",
      "passed": true,
      "evidence": "各指摘に修正案が記載されている"
    },
    {
      "text": "理由が説明されている",
      "passed": true,
      "evidence": "各指摘に理由が記載されている"
    },
    {
      "text": "textlint の指摘セクションが含まれている",
      "passed": true,
      "evidence": "「## textlint の指摘」セクションに4件の自動検出結果が含まれている"
    },
    {
      "text": "21行目の助詞ミス（「スキルを作成には」→「スキルの作成には」）を指摘している",
      "passed": true,
      "evidence": "「スキルを作成には」（21行目）→「スキルの作成には」として指摘されている"
    },
    {
      "text": "「指定事項」→「指摘事項」の誤字を指摘している",
      "passed": true,
      "evidence": "「指定事項を元に」（104行目）→「指摘事項を元に」として指摘されている"
    }
  ]
}
```

すべてのサブエージェントのグレーディングが完了したら、ベンチマークを集計します。集計は `skill-creator` の `scripts/aggregate_benchmark.py` で定義されたスクリプトを使用して行います。集計の結果は `benchmark.json` と `benchmark.md` として保存されます。結果として各評価基準に対する新旧スキルの合格率、実行時間、消費トークン数などが出力されます。

```json:.claude/skills/article-review-workspace/iteration-1/benchmark.json
{
  "metadata": {
    "skill_name": "article-review",
    "skill_path": "<path/to/skill>",
    "executor_model": "<model-name>",
    "analyzer_model": "<model-name>",
    "timestamp": "2026-03-07T04:39:02Z",
    "evals_run": [
      1,
      2,
      3
    ],
    "runs_per_configuration": 3
  },
  "runs": [
    {
      "eval_id": 1,
      "configuration": "new_skill",
      "run_number": 1,
      "result": {
        "pass_rate": 1.0,
        "passed": 6,
        "failed": 0,
        "total": 6,
        "time_seconds": 49.5,
        "tokens": 20401,
        "tool_calls": 0,
        "errors": 0
      },
      "expectations": [
        {
          "text": "\u8a72\u5f53\u7b87\u6240\u306e\u5f15\u7528\uff08\u300c\u3007\u3007\u3007\u300d\u5f62\u5f0f\uff09\u304c\u542b\u307e\u308c\u3066\u3044\u308b",
          "passed": true,
          "evidence": "\u8907\u6570\u306e\u5f15\u7528\u5f62\u5f0f\u304c\u542b\u307e\u308c\u3066\u3044\u308b"
        },
        ...
      ]
    }
  ],
  "run_summary": {
    "new_skill": {
      "pass_rate": {
        "mean": 1.0,
        "stddev": 0.0,
        "min": 1.0,
        "max": 1.0
      },
      "time_seconds": {
        "mean": 45.5333,
        "stddev": 3.5162,
        "min": 42.8,
        "max": 49.5
      },
      "tokens": {
        "mean": 17875.3333,
        "stddev": 2246.7591,
        "min": 16099,
        "max": 20401
      }
    },
    "old_skill": {
      ...
    }
  }
}
```

```md:.claude/skills/article-review-workspace/iteration-1/benchmark.md
# Skill Benchmark: article-review

**Model**: <model-name>
**Date**: 2026-03-07T04:39:02Z
**Evals**: 1, 2, 3 (3 runs each per configuration)

## Summary

| Metric | New Skill | Old Skill | Delta |
|--------|------------|---------------|-------|
| Pass Rate | 100% ± 0% | 78% ± 5% | +0.22 |
| Time | 45.5s ± 3.5s | 47.7s ± 5.0s | -2.1s |
| Tokens | 17875 ± 2247 | 17003 ± 1653 | +872 |
```

ベンチマーク結果は人間が確認しやすいように HTML 形式のレポートとしても出力され、ビューワーを起動してブラウザ上で確認できます。このように `skill-creator` スキルは人間と対話（Human-in-the-loop）しながらスキルの改善と評価を行えるように設計されていることがわかりますね。ビューワーに「Output」と「Benchmark」のタブがあり、Output タブでは各テストケースの評価結果を、Benchmark タブではベンチマークの集計結果を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3G7zJnqBsvLFzVkCqubE0K/d2d92f946a25cc017c691b2543364ab5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_14.04.11.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/3dsrKruAVyVJWx9cxHqtgD/d0f0390dbd3e6faa6785e61f55bda9ec/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_13.56.59.png)

Claude Code はユーザーからフィードバックが送信されるのを待機する状態になります。評価結果を確認して、改善の余地がある点を見つけたら、フィードバックを送信して改善の指示を与えることができます。特に問題ないと判断した場合は空のフィードバックを送信しましょう。「Submit All Reviews」ボタンをクリックすると、`feedback.json` としてフィードバックの内容が保存されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3jiaUgD04tHFbtZ6NlBzOl/ca2aaa3292fabb4f3cc396de0866770b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_14.06.54.png)

```json:feedback.json
{
  "reviews": [],
  "status": "in_progress"
}
```

フォームの送信が完了したら、Claude Code のセッションに戻り「フィードバックが完了しました」といったプロンプトを入力しましょう。ユーザーからのフィードバックがあれば、問題が解消されるまでイテレーションが続けられます。フィードバックがない場合は、評価のプロセスが完了したと判断され、最終的なレポートが生成されます。`textlint` が統合された結果、旧スキルよりも新スキルの方が誤字脱字の指摘精度が向上している結果が出ていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/iZY87RAhQQ8ic1X4etjeu/d9485187fa4b19f779d314c14170542f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_14.11.35.png)

## description の最適化

最後に `SKILL.md` の `description` フィールドの最適化も続けて行ってもらいましょう。セッションの最後に「次のステップとして descriptio の最適化（スキルが適切にトリガーされるか改善するループ）を実行することもできます。やりますか？」と Claude Code から提案があるので、ここでは「description の最適化もお願いします。」といったプロンプトを入力してみます。

Claude はスキルをトリガーするべきクエリとそうでないクエリをいくつか作成します。`should_trigger` フィールドが true のクエリはスキルを呼び出すべきクエリ、false のクエリは呼び出さないべきクエリを表しています。

```json
[
  {
    "query": "/article-review css-anchor-positioning 記事を書いたので確認してほしい",
    "should_trigger": true
  },
  {
    "query": "新しく書いたブログ記事 build-your-own-coding-ai-agent の誤字チェックをお願い",
    "should_trigger": true
  },
  {
    "query": "記事のタイトルをもっとSEOフレンドリーに変えたい",
    "should_trigger": false
  }
]
```

この評価データが適切かどうかユーザーに評価してもらいます。`assets/eval_review.html` のテンプレートにユーザーが評価しやすいようにクエリとスキルの呼び出しの有無を表示してくれます。

![](https://images.ctfassets.net/in6v9lxmm5c8/i3In9jKIPQZ1ObgWy5W8L/ee4e493721e1d1b180994027b7ff4d5d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_17.03.24.png)

ユーザーは「Should Trigger」のスイッチのオンオフを切り替えたり、クエリテキストを編集したりして、評価データを修正できます。変更があれば「Export Eval Set」ボタンをクリックして、変更された評価データを Claude に渡します。問題がなければそのまま Claude Code のセッションに戻り続きを実行してもらいましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/3t5vlf2JZ90XH71yXGeLdI/75241abe4ddbf59fb84370e44a6647ab/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_17.07.50.png)

`scripts/run_loop.py` スクリプトを使用して最適化ループが実行されます。「時間がかかる処理なので、バックグラウンドで処理を実行します」と `SKILL.md` の手順に書かれているのが面白いですね。

```md:SKILL.md
### Step 3: Run the optimization loop
Tell the user: "This will take some time — I'll run the optimization loop in the background and check on it periodically."
```

`run_loop.py` スクリプトでは `run_eval.py`（評価）と `improve_description.py`（改善提案）を繰り返し呼び出し、スキルのトリガー精度が最大になる description を探索します。評価では `claude -p` で実際に Claude Code を起動してスキルが呼び出されるかどうかをテストしています。また実行時には `ANTHROPIC_API_KEY` の環境変数が必要で、おおよそ $5 程度のコストがかかりました。

最適化ループが完了したらブラウザで HTML レポートを開き、反復ごとの結果が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/fBs2LTImDhODQINv6Ke6l/a92f9473ef8ec5d55813a55b908281dd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-07_18.15.38.png)

最後に `best_description` の結果を `SKILL.md` の `description` フィールドに反映し作業は完了です。今回は最適化の結果元の description のままが最適であるという結果になりました。

## まとめ

- `skill-creator` スキルはスキルの作成、改善、評価を行うスキルで、ユーザーと対話しながら Human-in-the-loop でスキルの改善と評価を行えるように設計されている
- `SKILL.md` の `description` フィールドはスキルを呼び出すかどうかの判断に利用されるため、スキルの内容を簡潔に説明し、どのような場合にスキルを呼び出すべきかを明確に記載することが重要
- スキルの改善のプロセスは以下のワークフローで実行される
  1. ユーザーの意図を把握するために、インタビューやリサーチをする
  2. `SKILL.md` を執筆する
  3. スキルを評価するためのテストケースを作成する
  4. エージェントを並列で起動してテストケースを実行する。エージェントの評価の完了の待機中にユーザーに評価基準を説明する
  5. すべてのエージェントの評価が完了したら、定量的な評価結果を集約してレポートを生成する
  6. ビューワーを起動してブラウザ上でユーザーが評価結果を確認できるようにする
  7. ユーザーのフィードバックをもとにスキルを改善する。このプロセスは問題が解決されるまで繰り返される
  8. description の最適化（スキルが適切にトリガーされるか改善するループ）
- スキルの評価は以下のワークフローで実行される
  1. テストケースの定義（`evals.json`）
  2. エージェントを起動してテストケースを実行
  3. 採点基準の説明
  4. 各エージェントの評価が完了したら、グレーディングを実行（`grading.json`）
  5. ベンチマークを集計（`benchmark.json`, `benchmark.md`）
  6. ビューワーを起動して評価結果を確認
  7. ユーザーからのフィードバックをもとに改善の指示を与える
- スキルの改善と評価のプロセスは、ユーザーが積極的に関与する Human-in-the-loop なプロセスである。ユーザーは評価結果を確認し、改善の余地がある点を見つけてフィードバックを送信することで、スキルの品質向上に貢献できる
- スキルのトリガー精度を向上させるために、description の最適化も行うことができる。スキルを呼び出すべきクエリとそうでないクエリを評価し、description を改善することで、スキルが適切なクエリで呼び出されるようにする

## 参考

- [skills/skills/skill-creator/SKILL.md at main · anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Improving skill-creator: Test, measure, and refine Agent Skills | Claude](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills)
- [スキルで Claude を拡張する - Claude Code Docs](https://code.claude.com/docs/ja/skills)
- [Overview - Agent Skills](https://agentskills.io/home)
- [skill-creatorから学ぶSkill設計と、Orchestration Skillの作り方 - 逆瀬川ちゃんのブログ](https://nyosegawa.github.io/posts/skill-creator-and-orchestration-skill/)
- [Skill authoring best practices - Claude API Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
