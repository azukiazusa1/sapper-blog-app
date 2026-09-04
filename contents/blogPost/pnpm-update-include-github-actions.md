---
id: AVasiBknZlj_ckQazeOZ7
title: "pnpm update で GitHub Actions もまとめて更新する"
slug: "pnpm-update-include-github-actions"
about: "GitHub Actions で使用する Action をコミット SHA に固定すると安全性が高まる一方、更新作業が煩雑になります。pnpm 11.16.0 で追加された `pnpm update --include-github-actions` を使うと、パッケージと Action の更新を同じコマンドで管理できます。この記事では基本的な使い方を確認します。"
createdAt: "2026-09-04T22:05+09:00"
updatedAt: "2026-09-04T22:05+09:00"
tags: ["pnpm", "GitHub Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/13Ynb8hJLzFJTCbYUL3hpn/1e81365ce5acc437c2c33b443251002a/sanma_yakizakana_7383-768x547.png"
  title: "サンマの塩焼きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`pnpm update --include-github-actions` が Action を更新した後の記述として正しいものはどれですか？"
      answers:
        - text: "リリースタグだけを新しいタグへ置き換える"
          correct: false
          explanation: "pnpm はリリースタグだけを記述するのではなく、完全なコミット SHA に置き換えます。"
        - text: "完全なコミット SHA に固定し、リリースタグをコメントとして残す"
          correct: true
          explanation: "完全なコミット SHA が `uses` に設定され、対応するリリースタグが行末のコメントとして残ります。"
        - text: "ブランチ名に固定し、コミット SHA をコメントとして残す"
          correct: false
          explanation: "更新先にブランチ名は使用されません。コミット SHA が参照本体となり、リリースタグがコメントになります。"
        - text: "Action のバージョンを `pnpm-lock.yaml` だけに記録する"
          correct: false
          explanation: "Action の参照はワークフローの `uses` に直接書き込まれます。`pnpm-lock.yaml` だけで管理されるわけではありません。"
    - question: "v4 系の Action を最新メジャーバージョンへ更新したい場合、記事で使用しているコマンドはどれですか？"
      answers:
        - text: "`pnpm update --include-github-actions`"
          correct: false
          explanation: "このコマンドだけでは現在のメジャーバージョン内の最新版が選ばれます。"
        - text: "`pnpm update --latest`"
          correct: false
          explanation: "既定では `--latest` だけでは GitHub Actions は対象になりません。"
        - text: "`pnpm update --latest --include-github-actions`"
          correct: true
          explanation: "`--include-github-actions` で Action を対象に加え、`--latest` でメジャーバージョンを越えた更新を許可します。"
        - text: "`pnpm outdated --include-github-actions`"
          correct: false
          explanation: "`pnpm outdated` は更新候補を表示しますが、ワークフローを書き換えません。"
published: true
---
GitHub Actions のワークフローでは、以下のように `uses` キーで Action のバージョンを指定します。セキュリティ上の理由から、タグではなく完全なコミット SHA に固定することが推奨されています。

```yaml:.github/workflows/ci.yml
steps:
  - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
  - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
```

Action のリリース後にバグ修正やセキュリティ修正が行われた場合、ワークフローに記述したバージョンも更新する必要があります。`package.json` や `pnpm-lock.yaml` のように 1 か所にまとめて依存関係を管理できれば便利ですが、GitHub Actions のワークフローは YAML ファイルに直接書き込まれるため、更新作業が煩雑になりがちです。

pnpm 11.16.0 で追加された [`--include-github-actions`](https://pnpm.io/cli/update#--include-github-actions) オプションを使うと、パッケージと GitHub Actions の依存関係を同じコマンドで更新できます。更新後の Action は完全なコミット SHA に固定され、対応するリリースタグがコメントとして残ります。

この記事では `pnpm update --include-github-actions` の基本的な使い方を確認します。

## `--include-github-actions` を使ってみる

次のワークフローを例に動作を確認します。検証時点の最新版より古い `actions/checkout@v4.0.0` と `actions/setup-node@v4.0.0` を指定しています。

```yaml:.github/workflows/ci.yml
name: CI

on:
  push:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4.0.0
      - uses: actions/setup-node@v4.0.0
        with:
          node-version: 24
      - run: npm test
```

オプションを付けずに `pnpm update` を実行しても、ワークフローは変更されません。

```bash
pnpm update
```

GitHub Actions も更新対象に含めるには、`--include-github-actions` を指定します。

```bash
pnpm update --include-github-actions
```

コマンドを実行すると、ワークフローは以下のように変更されました。

```diff:.github/workflows/ci.yml
     steps:
-      - uses: actions/checkout@v4.0.0
-      - uses: actions/setup-node@v4.0.0
+      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4.4.0
+      - uses: actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4.4.0
         with:
           node-version: 24
```

`uses` のタグが 40 文字のコミット SHA に置き換わり、コメントでリリースタグが追加されたことがわかります。pnpm は参照先リポジトリに対して `git ls-remote` を実行してタグとコミットの対応を取得し、安定版のリリースを更新先として選びます。

!> ref を取得できない Action は警告とともにスキップされます。private リポジトリの Action がこれに該当します。またブランチを参照している Action（`actions/checkout@main`）、ローカル Action（`./.github/actions/foo`）、Docker イメージ（`docker://alpine:3.18`）は更新の対象外です検査されるのは `.github/workflows` 配下のワークフローのみで、複合 Action の `action.yml` に書かれた `uses` は更新されません。

### メジャーバージョンを更新するには `--latest` を指定する

通常の `pnpm update` が `package.json` のバージョン範囲に従うのと同様に、`--include-github-actions` だけでは Action のメジャーバージョンを更新しません。検証時点では v7 系が公開されていましたが、v4 系の最新版である v4.4.0 が選ばれました。

メジャーバージョンも含めた最新の安定版へ更新する場合は、`--latest` を併用します。

```bash
pnpm update --latest --include-github-actions
```

実行した結果、以下のバージョンへ更新されました。

```diff:.github/workflows/ci.yml
     steps:
-      - uses: actions/checkout@v4.0.0
-      - uses: actions/setup-node@v4.0.0
+      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
+      - uses: actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7.0.0
         with:
           node-version: 24
```

メジャーバージョンの更新には破壊的変更が含まれる可能性があるため、更新後はワークフローの動作確認を行いましょう。

## 更新候補だけを確認する

ファイルを変更する前に候補を確認したい場合は、[`pnpm outdated`](https://pnpm.io/cli/outdated) にも `--include-github-actions` を指定できます。

```bash
pnpm outdated --include-github-actions
```

ワークフローに対して実行すると、次の結果が表示されました。

```text
┌────────────────────────────────────┬──────────────────────┬────────┐
│ Package                            │ Current              │ Latest │
├────────────────────────────────────┼──────────────────────┼────────┤
│ actions/checkout (github action)   │ 4.0.0 (wanted 4.4.0) │ 7.0.1  │
├────────────────────────────────────┼──────────────────────┼────────┤
│ actions/setup-node (github action) │ 4.0.0 (wanted 4.4.0) │ 7.0.0  │
└────────────────────────────────────┴──────────────────────┴────────┘
```

`Current` 列には現在使用しているリリースと、括弧内に現在のメジャーバージョン内で更新できるリリース（`wanted`）が表示されます。`Latest` はメジャーバージョンを問わない最新の安定版です。この表示を確認することで、通常更新と `--latest` のどちらを使うか判断できます。

## 設定ファイルで常に有効にする

毎回オプションを指定せず、GitHub Actions を常に確認したい場合は `pnpm-workspace.yaml` の [`update.githubActions`](https://pnpm.io/settings/dependency-resolution#updategithubactions) を `true` に設定します。

```yaml:pnpm-workspace.yaml
update:
  githubActions: true
```

この設定を追加すると、通常の `pnpm update` と `pnpm outdated` でも GitHub Actions が対象になります。

Action が GitHub Enterprise Server に置かれている場合は、pnpm 11.17.0 以降で `update.githubActionsServer` にサーバーの URL を指定できます。

```yaml:pnpm-workspace.yaml
update:
  githubActions: true
  githubActionsServer: "https://github.example.com"
```

環境変数 `GITHUB_SERVER_URL` が設定されている場合も、その値が使用されます。どちらもない場合の接続先は `https://github.com` です。

## まとめ

- `pnpm update --include-github-actions` は、パッケージに加えてワークフローが参照する GitHub Actions を更新する
- 更新後の Action はコミット SHA に固定され、対応するリリースタグがコメントとして残る
- `--include-github-actions` だけでは現在のメジャーバージョン内で更新され、`--latest` を併用すると最新メジャーバージョンまで更新される
- `pnpm outdated --include-github-actions` を使うと、ファイルを変更せずに、現在のバージョン・現在のメジャーバージョン内で更新できるバージョン・最新のバージョンを比較できる
- `update.githubActions: true` を設定すると、`pnpm update` と `pnpm outdated` で常に GitHub Actions を確認できる

## 参考

- [pnpm update](https://pnpm.io/cli/update)
- [pnpm outdated](https://pnpm.io/cli/outdated)
- [Updating GitHub Actions - pnpm](https://pnpm.io/cli/update#updating-github-actions)
- [pnpm 11.16](https://github.com/pnpm/pnpm/releases/tag/v11.16.0)
- [pnpm 11.17](https://github.com/pnpm/pnpm/releases/tag/v11.17.0)
- [GitHub Actions - Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
