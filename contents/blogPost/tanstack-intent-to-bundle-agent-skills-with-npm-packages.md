---
id: W0Ek9hkic5HJFN09PGVfA
title: "npm パッケージに Agent Skills を同梱する TanStack intent"
slug: "tanstack-intent-to-bundle-agent-skills-with-npm-packages"
about: "ライブラリのメンテナが Agent Skills を生成・検証して npm パッケージに同梱することを支援するツールである `@tanstack/intent` を使用して、ライブラリの使用者側と、メンテナ側の両方の観点から Agent Skills を利用する方法を紹介します。"
createdAt: "2026-03-15T11:13+09:00"
updatedAt: "2026-03-15T11:13+09:00"
tags: ["TanStack", "agent skills"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7fcUqtJtOjBaacYfIVjdlh/adc1fe9664b3e243ac00e8880ed3e2b5/sweets_cheesecake_illust_3630-768x494.png"
  title: "チーズケーキのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "ライブラリの使用者がインストール済みの依存関係からスキルのマッピングをエージェント設定ファイルに書き込むために使うコマンドはどれですか？"
      answers:
        - text: "`npx @tanstack/intent@latest install`"
          correct: true
          explanation: "`install` コマンドはインストール済みの依存関係からスキルを検出し、エージェント設定ファイルにマッピングを書き込むためのプロンプトを出力します。"
        - text: "`npx @tanstack/intent@latest scaffold`"
          correct: false
          explanation: "`scaffold` はライブラリのメンテナがスキルを生成するためのプロンプトを出力するコマンドです。"
        - text: "`npx @tanstack/intent@latest list`"
          correct: false
          explanation: "`list` コマンドを実行すると、インストール済みの依存関係から Agent Skills を検出し、スキルの名前や説明、バージョンなどを表示します。"
        - text: "`npx @tanstack/intent@latest stale`"
          correct: false
          explanation: "`stale` は参照しているスキルが最新かどうか確認するコマンドです。"
published: true
---
コーディングエージェントがコードを生成する際に、学習データの量と質の多さが生成するコードの品質に大きく影響を与えると言われています。例えば TypeScript や Python は GitHub 上のオープンソースコードの多くを占めているため、LLM の訓練データに含まれる割合が高くなり、結果として言語のイディオムやプラクティスを深く理解しているため、生成されるコードの品質も高くなる傾向があります。

npm や PyPI などのパッケージマネージャーに公開されているコードについても同じことが言えます。例えば React のような人気のあるライブラリは、LLM の訓練データに大量に含まれているため、特別な指示を与えなくとも React のプラクティスに従ったコードを生成する可能性が高くなります。その一方、LLM のカットオフ以降に公開された新興のライブラリではコーディングエージェントが誤った使い方をしてしまうリスクが高くなります。

この問題の対策として有効なのは、コンテキストにコードの使用方法を明示的に提供することです。[AGENTS.md（CLAUDE.md）](https://agents.md/) や [Agent Skills](https://agentskills.io/home) のようなコーディングエージェントにコンテキストを渡す標準的な方法を使用してライブラリのドキュメントを提供するという方法がよく知られています。またライブラリの提供者側もライブラリのドキュメントをエージェントに渡す方法を模索しており、例えば Next.js では [Next.js のスキル](https://github.com/vercel-labs/next-skills) を GitHub 上で公開していたり、[node_modules にドキュメントを同梱](https://nextjs.org/docs/app/guides/ai-agents) し、コードを書く前にエージェントがドキュメントを参照できるようにする方法を提供しています。[React Remotion](https://www.remotion.dev/) や [Motia](https://www.motia.dev/docs) といった新しめのライブラリでは、プロジェクトを作成するとあらかじめ Agent Skills が同梱されているというケースも出てきています。

ライブラリの提供者が Agent Skills を公開・同梱する手法は最近注目されていますが、スキルの更新や管理の方法に課題があります。GitHub 上で公開されたスキルは手動でコピペしたり [Vercel の Skills CLI](https://vercel.com/changelog/introducing-skills-the-open-agent-skills-ecosystem) を使用して手元のプロジェクトに反映させますが、スキルの更新を追跡する方法が確立されていません。またスキルを手動で更新する必要があるとなれば次第に更新が滞ってしまう可能性もあります。互換性のないライブラリのバージョン更新があった後にスキルのドキュメントが陳腐化していれば、気が付かないうちにエージェントが少しずつ誤ったコードを生成してしまうリスクもあります。エージェントが生成したコードの評価が難しいこともあり、エージェントが書くコードの品質が低下したとしてもスキルの更新忘れであるということに気が付かない可能性もあります。

`@tanstack/intent` はライブラリのメンテナが Agent Skills を生成・検証して npm パッケージに同梱することを支援するツールです。スキルの更新が滞るという問題に対して npm パッケージに同梱するという方法を採用することにより、`npm update` でライブラリのバージョンが更新されればスキルも同時に更新されるという形でスキルの更新を促すことができます。

この記事では `@tanstack/intent` を使用してライブラリの使用者側と、メンテナ側の両方の観点から Agent Skills を利用する方法を紹介します。

:::warning
Agent Skills には、セキュリティ上のリスクが伴う可能性があります。たとえば、プロンプトに悪意ある指示を紛れ込ませてユーザーの機密情報を窃取する「プロンプトインジェクション」や、任意のスクリプトを実行できる仕組みが悪用されるといったリスクが挙げられます。第三者が提供する Agent Skills をインストールする際は、スキルの内容を事前に十分確認することを推奨します。
:::

## ライブラリの使用者側のワークフロー

`@tanstack/intent` を使用して Agent Skills が提供されているライブラリでは、`node_modules` にスキルが同梱されています。ライブラリの使用者はインストール済みの依存関係からスキルを検出し、エージェントの設定とスキルのマッピングを行います。その後ライブラリのバージョン更新に合わせてスキルが同期されるようになります。

Agent Skills が同梱されている npm パッケージは [Agent Skills Registry](https://tanstack.com/intent/registry?tab=packages&sort=downloads&page=0&view=grid) で確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3gxUv7vatE0EgptMcWu4dZ/8d104be13e212bb3511bb197a694d15f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_12.18.07.png)

ここでは `@tanstack/db` というデータベースクライアントライブラリを例に、Agent Skills を利用する方法を紹介します。React のプロジェクトに `@tanstack/db` をインストールしておきましょう。

```bash
npm install @tanstack/db
```

`node_modules/@tanstack/db/` を確認してみると、確かに `skills/` ディレクトリが存在し、Agent Skills が同梱されていることがわかりますね。

```bash
node_modules/@tanstack/db
├── dist
│   ├── ...
├── package.json
├── README.md
├── skills
│   ├── db-core
│   │   ├── collection-setup
│   │   │   ├── references
│   │   │   │   ├── electric-adapter.md
│   │   │   │   ├── local-adapters.md
│   │   │   │   ├── powersync-adapter.md
│   │   │   │   ├── query-adapter.md
│   │   │   │   ├── rxdb-adapter.md
│   │   │   │   ├── schema-patterns.md
│   │   │   │   └── trailbase-adapter.md
│   │   │   └── SKILL.md
│   │   ├── custom-adapter
│   │   │   └── SKILL.md
│   │   ├── live-queries
│   │   │   ├── references
│   │   │   │   └── operators.md
│   │   │   └── SKILL.md
│   │   ├── mutations-optimistic
│   │   │   ├── references
│   │   │   │   └── transaction-api.md
│   │   │   └── SKILL.md
│   │   └── SKILL.md
│   └── meta-framework
│       └── SKILL.md
└── src
    ├── ...
```

実際に人間の目で `node_modules` ディレクトリを確認してスキルを見つけるのは大変なので、`@tanstack/intent` には同梱されているスキルを検出するための CLI ツールが提供されています。以下のコマンドを実行してみましょう。

```bash
npx @tanstack/intent@latest list
```

:::tip
執筆時点（2026 年 3 月）では `@tanstack/intent@0.0.19` に出力が表示されないバグがあるため、ここでは `@0.0.14` を使用して検証しています。
:::

このコマンドを実行すると、インストールされている依存関係の中から Agent Skills を検出し、スキルの名前や説明、スキルが提供されているライブラリのバージョンなどの情報が表示されます。

```bash
1 intent-enabled packages, 6 skills (npm)

PACKAGE       VERSION  SKILLS  REQUIRES
─────────────────────────────────────────
@tanstack/db  0.5.33   6       –

Skills:

  @tanstack/db
    db-core                 [core]        TanStack DB core concepts: ...
```

`node_modules` に同梱されているスキルを検出したら、エージェントの設定とスキルのマッピングを行います。以下のコマンドを実行すると、AI エージェントにスキルをセットアップするためのプロンプトが標準出力に表示されます。このプロンプトをパイプで Claude Code などのコーディングエージェントに渡して使用します（後述）。

```bash
npx @tanstack/intent@latest install
```

出力されるプロンプトは以下のタスクをエージェントに指示する内容になっています。

1. 既存マッピングの確認: プロジェクトのエージェント設定ファイル（CLAUDE.md、AGENTS.md、.cursorrules、.github/copilot-instructions.md）にスキルマッピングのブロックが存在するか確認する。存在する場合は現在のマッピングをユーザーに表示し、更新内容を尋ねる
2. 利用可能なスキルの発見: `intent list` コマンドを実行して、利用可能なスキルの名前、説明、パスを出力する
3. リポジトリのスキャン: プロジェクトの構造やパターンを把握するために、package.json を読み、ディレクトリレイアウトを調査し、繰り返されるパターンをメモする。これに基づいて、3〜5 のスキルとタスクのマッピングを提案し、ユーザーに他に一般的に AI コーディングエージェントを使用するタスクがあるか尋ねる
4. マッピングブロックの書き込み: 完全なマッピングセットが揃ったら、エージェント設定ファイル（CLAUDE.md を優先して、存在しない場合は新規作成）にスキルマッピングのブロックを正確に書き込む。

<details>
<summary>出力されるプロンプト</summary>

```text
You are an AI assistant helping a developer set up skill-to-task mappings for their project.

Follow these steps in order:

1. CHECK FOR EXISTING MAPPINGS
   Search the project's agent config files (CLAUDE.md, AGENTS.md, .cursorrules,
   .github/copilot-instructions.md) for a block delimited by:
     <!-- intent-skills:start -->
     <!-- intent-skills:end -->
   - If found: show the user the current mappings and ask "What would you like to update?"
     Then skip to step 4 with their requested changes.
   - If not found: continue to step 2.

2. DISCOVER AVAILABLE SKILLS
   Run: intent list
   This outputs each skill's name, description, and full path — grouped by package.

3. SCAN THE REPOSITORY
   Build a picture of the project's structure and patterns:
   - Read package.json for library dependencies
   - Survey the directory layout (src/, app/, routes/, components/, api/, etc.)
   - Note recurring patterns (routing, data fetching, auth, UI components, etc.)

   Based on this, propose 3–5 skill-to-task mappings. For each one explain:
   - The task or code area (in plain language the user would recognise)
   - Which skill applies and why

   Then ask: "What other tasks do you commonly use AI coding agents for?
   I'll create mappings for those too."

4. WRITE THE MAPPINGS BLOCK
   Once you have the full set of mappings, write or update the agent config file
   (prefer CLAUDE.md; create it if none exists) with this exact block:

<!-- intent-skills:start -->
# Skill mappings — when working in these areas, load the linked skill file into context.
skills:
  - task: "describe the task or code area here"
    load: "node_modules/package-name/skills/skill-name/SKILL.md"
<!-- intent-skills:end -->

   Rules:
   - Use the user's own words for task descriptions
   - Include the exact path from `intent list` output so agents can load it directly
   - Keep entries concise — this block is read on every agent task
   - Preserve all content outside the block tags unchanged
```

</details>

実際にインストールコマンドを実行する場合には、パイプラインで Claude Code や Codex にプロンプトを渡すとよいでしょう。

```bash
npx @tanstack/intent@latest install | claude
```

Claude code にプロンプトを渡すと、プロジェクトの内容に従ってスキルとタスクのマッピングを提案してくれます。「`localStorage` を使用してデータを永続化する TODO アプリをこれから作成する」という追加情報を与えたうえで、実際に `CLAUDE.md` にスキルのマッピングを追加してもらいましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/23UF2CWwPPDBnmQ9raC8fE/858ce5e549f987d0f932099b60661120/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_13.02.07.png)

実際に `CLAUDE.md` にスキルのマッピングが追加されていることがわかりますね。

```markdown
<!-- intent-skills:start -->

# Skill mappings — when working in these areas, load the linked skill file into context.

skills:

- task: "localStorage を使った TODO コレクションのセットアップ（localStorageCollectionOptions、スキーマ定義、getKey）"
  load: "node_modules/@tanstack/db/skills/db-core/collection-setup/SKILL.md"

- task: "TODO の一覧表示・フィルタリング・検索など、ライブクエリの実装"
  load: "node_modules/@tanstack/db/skills/db-core/live-queries/SKILL.md"

- task: "TODO の追加・編集・削除（楽観的ミューテーション、insert/update/delete）"
  load: "node_modules/@tanstack/db/skills/db-core/mutations-optimistic/SKILL.md"

- task: "TanStack DB の全般的な概念・使い方がわからないとき"
load: "node_modules/@tanstack/db/skills/db-core/SKILL.md"
<!-- intent-skills:end -->
```

これでエージェントがコードを生成する際に、`@tanstack/db` のスキルを参照するか試してみましょう。以下のようなプロンプトを与えて TODO アプリのコードを生成してみましょう。

```text
ユーザーが TODO を追加・編集・削除できる React アプリを作成してください。

- TODO データは @tanstack/db を使用して localStorage に永続化してください
- TODO データのフィルタリング機能も実装してください
```

確かに `node_modules/@tanstack/db/skills` からスキルを参照していることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/1rL4lpB62SBNdBwEVONNVK/53080e56ab2ff557ff4dd49d5338a30c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_13.06.14.png)

`CLAUDE.md` のスキルのマッピングでは `node_modules` のスキルを参照するように指示されているため、npm パッケージのバージョンを更新すればユーザーが特に作業しなくともスキルも更新されるようになります。スキルが古いソースコードを参照していないかどうか以下のコマンドで確認できます。

```bash
npx @tanstack/intent@latest stale
```

## ライブラリのメンテナ側のワークフロー

続いてライブラリのメンテナが npm パッケージに `@tanstack/intent` を使用して Agent Skills を同梱する方法を見てみましょう。`isOdd` と `isEven` という関数を提供する小さなライブラリを作成してワークフローを見てみましょう。

```src/index.ts
/**
 * Returns true if n is an odd integer, false otherwise.
 * Returns false for NaN, Infinity, -Infinity, and non-integer values.
 */
export function isOdd(n: number): boolean {
  if (!Number.isFinite(n)) return false;
  if (!Number.isInteger(n)) return false;
  return Math.abs(n % 2) === 1;
}

/**
 * Returns true if n is an even integer, false otherwise.
 * Returns false for NaN, Infinity, -Infinity, and non-integer values.
 */
export function isEven(n: number): boolean {
  if (!Number.isFinite(n)) return false;
  if (!Number.isInteger(n)) return false;
  return n % 2 === 0;
}
```

### Agent Skills の生成

`scaffold` コマンドを実行すると、エージェントがスキルを生成するためのプロンプトが出力されます。

```bash
npx @tanstack/intent@latest scaffold
```

出力されるプロンプトは以下のタスクをエージェントに指示する内容になっています。

1. 事前準備: `package.json` からライブラリ名・リポジトリ URL・ドキュメント URL を読み取る
2. ライブラリの内容の理解: プロンプト全体のソースコードを読んだり、メンテナにインタビュー（ライブラリの目的, 一般的な使用方法, よくある誤った使用方法, 暗黙知）を行い、ライブラリの全体のドメインマップを作成する。成果物は `domain_map.yaml` と `skill_spec.md` で必ずメンテナのレビューを求めること
3. スキルツリーの生成: スキルツリーは、ライブラリに対して生成する SKILL.md ファイルの完全な一覧と構造を定義したマニフェストで、コーディングエージェントがどのスキルがどのタスクに対応しているかを理解するために使用される。成果物は `skill_tree.yaml` で必ずメンテナのレビューを求めること
4. スキルの生成: スキルを生成する。成果物は個々の `SKILL.md` ファイル。
   - 単一リポジトリの場合: `skills/<domain>/<skill>/SKILL.md`
   - モノレポの場合: `packages/<pkg>/skills/<domain>/<skill>/SKILL.md`
5. 生成されたスキルの検証: `npx @tanstack/intent validate` を実行して、生成されたスキルが正しい形式であることを確認する
6. スキルの同梱: 生成されたスキルを npm パッケージに同梱するために、`package.json` に `files` フィールドを追加して `skills/` ディレクトリを含めるようにする

<details>
<summary>出力されるプロンプト</summary>

```text
You are helping a library maintainer scaffold Intent skills.

Run the three meta skills below **one at a time, in order**. For each step:
1. Load the SKILL.md file specified
2. Follow its instructions completely
3. Present outputs to the maintainer for review
4. Do NOT proceed to the next step until the maintainer confirms

## Before you start

Gather this context yourself (do not ask the maintainer — agents should never
ask for information they can discover):
1. Read package.json for library name, repository URL, and homepage/docs URL
2. Detect if this is a monorepo (look for workspaces field, packages/ directory, lerna.json)
3. Use skills/ as the default skills root
4. For monorepos:
   - Domain map artifacts go at the REPO ROOT: _artifacts/
   - Skills go INSIDE EACH PACKAGE: packages/<pkg>/skills/
   - Identify which packages are client-facing (usually client SDKs and primary framework adapters)

---

## Step 1 — Domain Discovery

Load and follow: /Users/xxx/.npm/_npx/49ccc4810cfff6df/node_modules/@tanstack/intent/meta/domain-discovery/SKILL.md

This produces: domain_map.yaml and skill_spec.md in the artifacts directory.
Domain discovery covers the WHOLE library (one domain map even for monorepos).

**STOP. Review outputs with the maintainer before continuing.**

---

## Step 2 — Tree Generator

Load and follow: /Users/xxx/.npm/_npx/49ccc4810cfff6df/node_modules/@tanstack/intent/meta/tree-generator/SKILL.md

This produces: skill_tree.yaml in the artifacts directory.
For monorepos, each skill entry should include a `package` field.

**STOP. Review outputs with the maintainer before continuing.**

---

## Step 3 — Generate Skills

Load and follow: /Users/xxx/.npm/_npx/49ccc4810cfff6df/node_modules/@tanstack/intent/meta/generate-skill/SKILL.md

This produces: individual SKILL.md files.
- Single-repo: skills/<domain>/<skill>/SKILL.md
- Monorepo: packages/<pkg>/skills/<domain>/<skill>/SKILL.md

---

## After all skills are generated

1. Run `npx @tanstack/intent validate` in each package directory
2. Commit skills/ and artifacts
3. For each publishable package, run: `npx @tanstack/intent add-library-bin`
4. For each publishable package, run: `npx @tanstack/intent edit-package-json`
5. Ensure each package has `@tanstack/intent` as a devDependency
6. Create a `skill:<skill-name>` label on the GitHub repo for each skill (use `gh label create`)
7. Add a README note: "If you use an AI agent, run `npx @tanstack/intent@latest install`"
```

</details>

パイプラインで Claude Code や Codex にプロンプトを渡してスキルを生成してもらいましょう。

```bash
npx @tanstack/intent@latest scaffold | claude
```

はじめにライブラリの内容を理解するためのスキャンが行われました。小規模なライブラリであることをよく理解していますね。またステップが終わるたびに成果物を確認するように促してくれています。

![](https://images.ctfassets.net/in6v9lxmm5c8/3YAXAZbllIR9VGkRrq2NDC/e2f02b759e7c52b6168c16e257311000/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_13.42.00.png)

次のステップではスキルを作成するためにインタビューが行われ、ライブラリがどのような目的で使用されることが多いか、どのようなタスクが発生しやすいかなどを質問されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2uo6nbViG0hEm5ahjsOyxF/51fd31bd2d503744dac96472fd65408c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_13.44.14.png)

最終的には `isOdd/isEven` の基本的な使用方法を説明する `parity-check` スキルと、Zod と組み合わせて使用する `parity-with-zod` スキルの 2 つのスキルが提案されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7ho8FWa0QSSujNUwNrIbPG/511b0750e56165d87cb8c46ca2ec49c5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_13.50.38.png)

続けてスキルツリーである `skill_tree.yaml` と、個々のスキルである `parity-check/SKILL.md` と `parity-with-zod/SKILL.md` が生成されていきます。最終的な成果物は以下のようになりました。

```bash
skills
├── _artifacts
│   ├── domain_map.yaml
│   ├── skill_spec.md
│   └── skill_tree.yaml
├── parity-check
│   └── SKILL.md
└── parity-with-zod
    └── SKILL.md
```

スキルの作成が完了したら、`npx @tanstack/intent validate` を実行してスキルが正しい形式であることを確認します。ここではパッケージのパスと `name` フィールドが一致してないというエラーが報告され、修正されている様子が確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4VxmlNxzZ6wjlxAxMrBwzF/a0b76557222d70d42585f7ccb789f75a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-15_14.05.43.png)

スキルの検証が完了したら、`npx @tanstack/intent add-library-bin` と `npx @tanstack/intent edit-package-json` を実行して、スキルを npm パッケージに同梱するための準備をします。

`add-library-bin` は、ライブラリのリポジトリに `bin/intent.mjs` というシムファイルを生成するコマンドです。これによりライブラリをインストールしたユーザーが `npx intent` を実行すると、`@tanstack/intent` CLI が起動するようになります。`edit-package-json` は、`package.json` に `files` フィールドを追加して `skills/` ディレクトリを含めるようにするコマンドです。

```json:package.json
{
  "files": [
    "dist",
    "skills",
    "bin",
    "!skills/_artifacts"
  ],
  "bin": {
    "intent": "./bin/intent.mjs"
  },
  "devDependencies": {
    "@tanstack/intent": "^0.0.14",
    // ...
  }
}
```

続いて `gh` CLI を使用して GitHub 上に `skill:parity-check` と `skill:parity-with-zod` というラベルを作成し、スキルの内容を確認できるようにします。最後に README に「AI エージェントを使用する場合は `npx @tanstack/intent@latest install` を実行してください」という注意書きを追加して、ワークフローの完了です。

Agent Skills Registry へ登録されるようにするためには、`package.json` の `keywords` フィールドに `tanstack-intent` を追加して npm パッケージを公開する必要があります。

```json:package.json
{
  "keywords": [
    "tanstack-intent",
    // ...
  ]
}
```

### Agent Skills の更新

スキルは一度作成したら終わりではなく、ライブラリの更新に合わせてスキルも更新していく必要があります。以下のコマンドを実行すると、CI パイプラインでスキルの検証と更新の確認をする GitHub Action のテンプレートが生成されます。

```bash
npx @tanstack/intent@latest setup-github-actions
```

生成されるワークフローは以下の 3 つです。

1. `validate-skills`: 生成されたスキルが正しい形式であることを確認するジョブ。`/skills` ディレクトリに変更があったプルリクエストに対して実行される
2. `notify-intent`: ドキュメントやソースコードが変更された場合、`tanstack/intent` レポジトリに Webhook を送信する。これにより intent 側でライブラリのスキルが最新のソースコードと整合しているかチェックが行われ、スキルの更新が必要と判断された場合に次の `check-skills` ワークフローがトリガーされる
3. `check-skills`: 新しいバージョンのライブラリが公開されたときに、古いスキルを自動で検出する。このワークフローによりプルリクエストが自動で作成され、PR の説明にはスキルの更新に必要な変更内容を含むプロンプトが記載される。メンテナはこのプロンプトをコーディングエージェントに渡すことで、スキルの更新作業を効率的に行うことができる

## まとめ

- LLM のカットオフ以降に公開されたライブラリでは、エージェントが誤ったコードを生成するリスクがある。Agent Skills をライブラリに同梱することで品質を改善できるが、スキルの更新・管理が課題となる
- `@tanstack/intent` は Agent Skills を npm パッケージに同梱することで、`npm update` によるライブラリ更新と同時にスキルも更新される仕組みを実現するツールである
- ライブラリの使用者側は、`@tanstack/intent install` コマンドを使用して、エージェントの設定とスキルをマッピングするためのプロンプトを表示できる。スキルが同梱されている npm パッケージは Agent Skills Registry で確認できる
- ライブラリのメンテナ側は、`@tanstack/intent scaffold` コマンドを使用して、エージェントにスキルを生成するためのプロンプトを表示できる。

## 参考

- [Introducing TanStack Intent: Ship Agent Skills with your npm Packages | TanStack Blog](https://tanstack.com/blog/from-docs-to-agents)
- [Overview | TanStack Intent Docs](https://tanstack.com/intent/latest/docs/overview)
- [Agent Skills Registry | TanStack Intent](https://tanstack.com/intent/registry?tab=packages&sort=downloads&page=0&view=grid)
