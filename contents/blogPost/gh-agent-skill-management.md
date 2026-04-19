---
id: 1Lvu1Oqc24-u8gboqYMTw
title: "gh コマンドでエージェントスキルをインストール・管理できるようになった"
slug: "gh-agent-skill-management"
about: "GitHub CLI に `gh skill` コマンドが追加され、GitHub 上のエージェントスキルを簡単にインストール・検索・管理できるようになりました。この記事では `gh skill` コマンドの使い方について紹介します。"
createdAt: "2026-04-19T10:52+09:00"
updatedAt: "2026-04-19T10:52+09:00"
tags: ["github-cli", "agent skills"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/48zQwRU5Eko8dyRpo74U9z/4ad91b858ba118fe04362510de88a736/wakasagi_tempura_15710-768x591.png"
  title: "ワカサギの天ぷらのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`npx skills` がすでに存在していたにもかかわらず、`gh skill` コマンドが追加されたことに意義があるとされる理由として、最も適切なものはどれでしょうか？"
      answers:
        - text: "Agent Skills 仕様を拡張し、`npx skills` では扱えなかった新しいメタデータを表現できるようになったため。"
          correct: false
          explanation: "両者はどちらも Agent Skills 仕様に準拠しており、仕様自体を拡張しているわけではありません。記事でも両者に互換性があると述べられています。"
        - text: "サードパーティーツールに依存せず、タグやリリースといった GitHub プリミティブを活用してサプライチェーン攻撃のリスクを軽減できるため。"
          correct: true
          explanation: "記事では、ネイティブな GitHub CLI でスキル管理が完結することに加え、GitHub プリミティブを活用してサプライチェーン攻撃リスクを軽減できる点が特徴として挙げられています。"
        - text: "Node.js 環境が不要になり、エージェント本体のインストールを自動化できるようになるため。"
          correct: false
          explanation: "`gh skill` は Node.js 環境を不要にすることが目的ではなく、エージェント本体のインストールを担うものでもありません。"
        - text: "スキルのインストール速度が `npx skills` より大幅に向上するため。"
          correct: false
          explanation: "記事では速度についての言及はなく、`gh skill` の意義として強調されているのは速度ではありません。"
    - question: "サプライチェーン攻撃のリスクをできるだけ軽減しつつスキルをインストールしたいとき、最も安全な方法はどれでしょうか？"
      answers:
        - text: "常に最新のメインブランチから `gh skill install owner/repo skill-name` でインストールする。"
          correct: false
          explanation: "最新を追従すると、不正なコミットが混入した際にそのまま取り込んでしまうリスクがあります。"
        - text: "`gh skill install owner/repo skill-name@v1.0.0` のようにタグを指定してインストールする。"
          correct: false
          explanation: "タグは Immutable Release が設定されていない限り後から付け替えられる可能性があるため、タグ固定だけでは万全ではありません。"
        - text: "コミットハッシュを指定して `gh skill install owner/repo skill-name@<commit-sha>` でインストールし、必要に応じて `--pin` で更新を止める。"
          correct: true
          explanation: "記事ではタグが変更される可能性に触れ、コミットハッシュ指定の方がより安全であると説明されています。加えて `--pin` を使えば `gh skill update` での自動更新も防げます。"
        - text: "`gh skill preview` でファイル一覧を眺めるだけにとどめ、`gh skill install` は使わない。"
          correct: false
          explanation: "`preview` は内容確認のための機能で、インストール自体を行いません。安全性確保のために `install` を避けるのは本来の用途ではありません。"
published: true
---
コーディングエージェント時代に[エージェントスキル](https://agentskills.io/home)をチームで共有することの重要性は広く認識されてきました。個人の試行錯誤で生まれたプラクティスをチーム全体で共有し再利用することは、開発速度の向上や品質の安定化に大きく寄与します。またエージェントスキルという文書化を伴う形で暗黙知の形式知化が促進されることも、チームのナレッジマネジメントの観点から重要です。

スキルを共有・配布するための方法としては Vercel が提供する [npx skills](https://github.com/vercel-labs/skills) が広く使われていました。これは GitHub 上で公開されているスキルを `npx skills add owner/repo` コマンド 1 つでインストールできるというもので、コーディングエージェントごとの差異を吸収してくれることもあり非常に便利なツールでした。

そんななか、[GitHub CLI](https://cli.github.com/) の v2.90.0 から `gh skill` コマンドが追加され、GitHub 上のエージェントスキルを簡単にインストール・検索・管理できるようになりました。サードパーティーツールに頼らずに、ネイティブな GitHub CLI でスキル管理が完結するようになったことに意義があります。特に `gh skill` コマンドで GitHub プリミティブ（タグやリリース）を活用してサプライチェーン攻撃に対するリスクを軽減できる点が特徴の 1 つです。

Vercel の `npx skills` と GitHub CLI の `gh skill` はどちらも [Agent Skills 仕様](https://agentskills.io/specification) に準拠しているため、両者の間でスキルの互換性があります。すでに `npx skills` を使用してスキルを配布している場合でも、`gh skill` に移行することは比較的容易でしょう。

この記事では `gh skill` コマンドの使い方について紹介します。

## `gh skill` コマンドの使い方

`gh skill` コマンドを使用するためには、まず GitHub CLI を v2.90.0 以降にアップデートする必要があります。`gh` コマンドのバージョンを確認しておきましょう。

```bash
$ brew upgrade gh
$ gh --version

gh version 2.90.0 (2026-04-16)
https://github.com/cli/cli/releases/tag/v2.90.0
```

`gh skill` コマンドは以下のサブコマンドを提供しています。

| サブコマンド       | 説明                                                                            |
| ------------------ | ------------------------------------------------------------------------------- |
| `gh skill install` | GitHub レポジトリ上のスキルをインストールする                                   |
| `gh skill preview` | GitHub レポジトリ上のスキルの内容をプレビューする                               |
| `gh skill publish` | スキル仕様に従いバリデーションを行った上で、GitHub レポジトリにスキルを公開する |
| `gh skill search`  | GitHub 上のスキルを検索する                                                     |
| `gh skill update`  | インストールされているスキルを最新バージョンに更新する                          |

## スキルをインストールする

### スキルを検索する

それでは `gh skill` コマンドを使ってスキルをインストールしてみましょう。GitHub 上で公開されているスキルを探すには `gh skill search` コマンドが使用できます。もしくは [skills.sh](https://skills.sh/) のようなスキルカタログサイトを参照しても良いでしょう。ここでは例として React に関するスキルを検索してみます。

```bash
gh skill search react
```

上記のコマンドを実行すると、GitHub Code Search API を通じて公開リポジトリ全体から、スキル名や説明に "react" というキーワードを含む `SKILL.md` が検索されます。検索結果からそのままチェックを入れてインストールできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Ol6AKrPnqqhUCsJb7Eu5S/49bdf9368783538f77f79c62a3548f87/image.png)

### スキルの内容を確認する

ここでは https://github.com/vercel-labs/next-skills で公開されている `next-best-practices` スキルをインストールしてみましょう。ところで第三者が公開しているスキルをインストールする際には、セキュリティの観点からそのスキルの内容をあらかじめ確認しておくことが重要です。スキルの内容が AI の動作を意図しない方向に誘導するような指示を含んでいるプロンプトインジェクションのリスクや、付随するスクリプトがマルウェアであるリスクなどが考えられるためです。

そこで `gh skill preview` コマンドを使用すれば、インストール前にスキルの内容を安全に確認できます。

```bash
# next-best-practices スキルの内容を確認する
gh skill preview vercel-labs/next-skills next-best-practices
# スキル名を選択せずにすべてのスキル一覧から開始することも可能
gh skill preview vercel-labs/next-skills
```

以下のようにスキルが提供するファイルの一覧が表示され、Enter キーで選択するとその内容を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1QqT1IQduFs5gJ8b6011hl/dd767c94371dc9b9501f81b08f406768/image.png)

### スキルをインストールする

スキルの内容が問題ないことを確認できたら、`gh skill install` コマンドでインストールします。

```bash
gh skill install vercel-labs/next-skills next-best-practices
```

上記のコマンドを実行すると、GitHub 上の `vercel-labs/next-skills` レポジトリに公開されている `next-best-practices` スキルがインストールされます。スキルのバージョンを指定したい場合は、`@` に続けてタグやコミットハッシュを指定できます。サプライチェーン攻撃のリスクを軽減するためには、特定のバージョンを指定してインストールすることが推奨されます。

ただし GitHub 上のタグは [Immutable Release](https://docs.github.com/ja/code-security/concepts/supply-chain-security/immutable-releases) が設定されていない限り後から変更される可能性があるため、コミットハッシュを指定する方がより安全でしょう。このあたりのセキュリティ上のプラクティスは GitHub Actions などでのサプライチェーン攻撃対策と通じるものがありますね。ここで `@<ref>` はインストール時に取得するタグやコミットハッシュを指定するための記法で、`--pin` はインストール後に `gh skill update` コマンドで更新されないよう固定するためのオプションです。

```bash
# コミットハッシュを指定してインストール
gh skill install vercel-labs/next-skills next-best-practices@038954e07bfc313e97fa5f6ff7caf87226e4a782
# pin オプションを使用して、後から更新されないようにする
gh skill install vercel-labs/next-skills next-best-practices --pin 038954e07bfc313e97fa5f6ff7caf87226e4a782
```

コマンドを実行すると、対話形式でインストールが進行します。

1. どの AI エージェントにスキルをインストールするか

- GitHub Copilot
- Claude Code
- Cursor
- Codex
- Gemini CLI
- Antigravity

2. スキルのスコープ（プロジェクト or ユーザー）

スコープはチームで共有したい場合はプロジェクトスコープ、個人ツールとして使いたい場合はユーザースコープを選択すると良いでしょう。特にチーム開発ではプロジェクトスコープを選択することで、リポジトリにスキルを紐づけて管理できるようになるため便利です。

スキルのインストールが完了すると、選択した AI エージェントに応じたディレクトリにスキルが保存されます。ここでは Claude Code を選択したので、`.claude/skills/next-best-practices` ディレクトリにスキルがインストールされました。

```bash
$ tree .claude/skills/next-best-practices
.claude/skills/next-best-practices
├── SKILL.md
├── async-patterns.md
├── bundling.md
├── data-patterns.md
├── debug-tricks.md
├── directives.md
├── error-handling.md
├── file-conventions.md
├── font.md
├── functions.md
├── hydration-error.md
├── image.md
├── metadata.md
├── parallel-routes.md
├── route-handlers.md
├── rsc-boundaries.md
├── runtime-selection.md
├── scripts.md
├── self-hosting.md
└── suspense-boundaries.md

1 directory, 20 files
```

`gh skill` コマンドでインストールしたスキルには、`SKILL.md` ファイルにどの GitHub レポジトリからインストールしたか、どのバージョンをインストールしたかなどのメタデータが追記されます。このメタデータを参照して `gh skill update` コマンドでスキルの更新を管理できます。

| フィールド        | 役割                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `github-repo`     | インストール元の GitHub レポジトリ URL                                                        |
| `github-path`     | レポジトリ内のスキルディレクトリのパス                                                        |
| `github-ref`      | インストール時に参照したタグやコミットハッシュ                                                |
| `github-pinned`   | `--pin` 指定時に固定されたリビジョン。これが設定されていると `gh skill update` で更新されない |
| `github-tree-sha` | スキルディレクトリの内容を表すハッシュ。実際のファイル差分で更新を検知する際に利用される      |

特に `github-tree-sha` はタグやコミットハッシュが変わっていなくても、実際のファイル内容が変更されたかどうかを検出できるため、「バージョン番号は変わっていないが中身が差し替えられていた」というケースを見逃さずに済みます。

```markdown:.claude/skills/next-best-practices/SKILL.md
---
description: Next.js best practices - file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font optimization, bundling
metadata:
  github-path: skills/next-best-practices
  github-pinned: 038954e07bfc313e97fa5f6ff7caf87226e4a782
  github-ref: 038954e07bfc313e97fa5f6ff7caf87226e4a782
  github-repo: https://github.com/vercel-labs/next-skills
  github-tree-sha: ad17eb27952b39a6ab0061bd50e8a2213b63a3ec
name: next-best-practices
user-invocable: false
---

# Next.js Best Practices

Apply these rules when writing or reviewing Next.js code.

<!-- 省略 -->
```

## スキルのアップデート

スキルを最新に保つ仕組みを整えておくこともスキル管理の重要なポイントです。例えばライブラリの破壊的な変更があったのにも関わらずそのライブラリに関するスキルが更新されていないといったことがあると、エージェントが古いプラクティスに基づいて行動してしまうことになります。

`gh skill` コマンドでインストールしたスキルは、`gh skill update` コマンドで最新バージョンに更新できます。

コマンドを実行すると手元にインストールされているスキルの一覧に対して、更新可能なスキルがあるかどうか確認が行われます。GitHub レポジトリで管理されていないスキル（`metadata.github-repo` が存在しないスキル）についても、取り込み元の GitHub レポジトリを尋ねる仕様となっています。

```bash
$ gh skill update

! .system/skill-creator has no GitHub metadata
? Repository for .system/skill-creator (owner/repo):
```

スキルの内容に更新があった場合には、前後のコミットハッシュが表示され、更新するかどうかの確認が行われます。前述の通り、`--pin` オプションを使用してインストールしたスキルは確認がスキップされます。

```bash
? Repository for .system/skill-creator (owner/repo):
  Skipping .system/skill-creator
⊘ next-best-practices is pinned to 038954e07bfc313e97fa5f6ff7caf87226e4a782 (skipped)

2 update(s) available:
  • integrate-context-matic (github/awesome-copilot) 7095ef41 > 86cfeb1c [main]
  • next-best-practices (vercel-labs/next-skills) 0b069c12 > ad17eb27 [main]

? Update 2 skill(s)? (Y/n)
```

特定のスキルだけを更新したい場合は、スキル名を指定できます。

```bash
gh skill update next-best-practices
```

`--dry-run` オプションを使用すれば、実際には更新せずにどのスキルが更新可能かを確認できます。

```bash
gh skill update --dry-run
```

## スキルの公開

スキルを GitHub 上で公開するために必ずしも `gh skill publish` コマンドを使用する必要はありません。単にスキル仕様に従ったコンテンツを GitHub レポジトリに配置すれば、`gh skill install` コマンドでインストールできるようになるためです。しかし `gh skill publish` コマンドを使用すれば、以下のことを自動的に行ってくれるためサプライチェーン攻撃を防止する観点からは推奨されます。

- スキル仕様に従ったバリデーションの実行
- タグの保護やシークレットスキャンニングといったレポジトリ設定のチェック

実際にゼロからレポジトリを作成してスキルを公開する手順を試してみましょう。あらかじめ公開レポジトリを作成しておいてください。

```bash
gh repo create my-skill-repo --public
```

続いてレポジトリ上にスキルを追加します。`gh skill` コマンドでは以下の場所に配置されているファイルがスキルとして認識されます。

- `skills/*/SKILL.md`
- `skills/{scope}/*/SKILL.md`
- `*/SKILL.md` (root-level)
- `plugins/{scope}/skills/*/SKILL.md`

技術記事をレビューする `tech-review` スキルを作成してみましょう。スキル名とディレクトリの名前は同じである必要があるため、`skills/tech-review/SKILL.md` というパスに `SKILL.md` ファイルを配置します。

```markdown
---
name: tech-review
description: ソフトウェアエンジニア向けの技術書・原稿をレビューし、構成・技術的正確性・読者体験の観点から改善提案を行うスキル。ユーザーが技術書の原稿、章のドラフト、チュートリアル記事、技術ドキュメントのレビューを依頼したときに使う。「原稿をレビューして」「この章を見てほしい」「技術書を書いている」「コードサンプルをチェックして」「構成についてアドバイスがほしい」といった依頼で発動する。技術書の執筆支援、編集フィードバック、構成改善、コードレビュー（書籍内のコード）、読者レベルの調整など、技術書制作に関わるあらゆるレビュー作業に対応する。
---

# 技術書原稿レビュースキル

...
```

`gh skill publish` コマンドを実行する前に `--dry-run` オプションを使用して、スキルの内容に問題がないかどうか確認してみましょう。Agent Skills 仕様に準拠していない場合には、エラーが表示されます。例えば以下のような観点がチェックされます。

- `name` フィールド仕様に準拠しているか（小文字の英数字とハイフンのみ、先頭と末尾は英数字、3 文字以上）
- スキル名とディレクトリ名が一致しているか
- `name` と `description` フィールドが存在するか
- `allowed-tools` フィールドが存在する場合、文字列になっているか（配列は不可）
- `metadata.github-*` フィールドが含まれていないかどうか（これらは `gh skill install` によって付与されるインストールメタデータであり、公開時には除外されるべきため）

試しに `description` フィールドを削除した状態で `gh skill publish --dry-run` コマンドを実行してみましょう。以下のようなエラーが表示されるはずです。

```bash
$  gh skill publish --dry-run
X tech-review: missing required field: description
! tech-review: recommended field missing: license
! no active tag protection rulesets found. Consider protecting tags to ensure immutable releases (Settings > Rules > Rulesets)

1 error(s), 2 warning(s)
validation failed with 1 error(s)
```

`description` フィールドが存在しないというエラーが表示されました。エラーが存在する限り `--dry-run` オプションを外して実行したとしても、スキルは公開できません。その他にも以下の 2 つの警告も表示されています。レポジトリの安全性や信頼性を高めるためには、これらの警告も解消しておくことが推奨されます。

- `license` フィールドが存在しない
- タグの保護ルールが設定されていない

`description` フィールドを追加して再度 `gh skill publish --dry-run` コマンドを実行してみましょう。今度はエラーがなく、「Ready to publish!」というメッセージが表示されるはずです。

```bash
$ gh skill publish --dry-run
! tech-review: recommended field missing: license
! no active tag protection rulesets found. Consider protecting tags to ensure immutable releases (Settings > Rules > Rulesets)

2 warning(s)

Ready to publish! Repository: azukiazusa1/my-skill-repo

Dry run complete. Use without --dry-run to publish.
```

エラーが解消されたのでスキルを公開しましょう。まずはリモートレポジトリに変更をプッシュします。

```bash
git add skills/tech-review/SKILL.md
git commit -m "Add tech-review skill"
git push origin main
```

リモートレポジトリに変更をプッシュした時点で既に `gh skill install` コマンドでインストールできるようになっていますが、`gh skill publish` コマンドを実行することで、タグの付与やリリースの作成など、スキルの公開に必要な一連の作業を自動化できます。`--dry-run` オプションを外して `gh skill publish` コマンドを実行してみましょう。対話形式でスキルの公開が進行します。

1. レポジトリのトピックに `agent-skills` が存在しない場合は、トピックを追加するかどうか
2. タグのストラテジー（Semver かカスタムか）
3. タグのバージョン（`v1.0.0`）
4. Immutable Release（タグの付け替えを禁止する機能）を有効化するかどうか
5. リリースノートを自動生成するかどうか

```bash
$ gh skill publish

Publishing to azukiazusa1/my-skill-repo...

? Add "agent-skills" topic to azukiazusa1/my-skill-repo? (required for discoverability) Yes
✓ Added "agent-skills" topic
? Tagging strategy: Semver (recommended): v1.0.0
? Version tag [v1.0.0]: v1.0.0
? Enable immutable releases? (prevents tampering with published releases) Yes
? Create release v1.0.0 with auto-generated notes? Yes
✓ Published v1.0.0
✓ Install with: gh skill install azukiazusa1/my-skill-repo
✓ Pin with:     gh skill install azukiazusa1/my-skill-repo <skill> --pin v1.0.0
```

確かに GitHub 上の `azukiazusa1/my-skill-repo` レポジトリに `v1.0.0` というタグとリリースが作成されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5RhyBWekckZmOkdjWkGoYe/b8cb399907f1532ddf7d400eed75da4e/image.png)

実際に公開したスキルがインストールできるかどうかも確認してみましょう。

```bash
gh skill install azukiazusa1/my-skill-repo tech-review
```

## まとめ

- `gh skill` コマンドを使用すれば、GitHub 上のエージェントスキルを簡単にインストール・検索・管理できるようになる
- コミットハッシュやタグを利用してスキルをピン留めできるため、サプライチェーン攻撃のリスクを軽減できる
- `gh skill search <keyword>` コマンドで GitHub 上のスキルを検索できる
- `gh skill install <owner/repo> <skill>` コマンドで GitHub 上のスキルをインストールできる
- `gh skill preview <owner/repo> <skill>` コマンドでインストール前にスキルの内容を確認できる
- `gh skill update` コマンドでインストールされているスキルに更新があるかどうか確認し、最新バージョンに更新できる
- `gh skill publish` コマンドでスキルの公開に必要な一連の作業を自動化できる

## 参考

- [Manage agent skills with GitHub CLI - GitHub Changelog](https://github.blog/changelog/2026-04-16-manage-agent-skills-with-github-cli/)
- [GitHub CLI | Take GitHub to the command line](https://cli.github.com/manual/gh_skill)
- [Release GitHub CLI 2.90.0 · cli/cli](https://github.com/cli/cli/releases/tag/v2.90.0)
- [Overview - Agent Skills](https://agentskills.io/home)
