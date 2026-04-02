---
id: LbwgsjTAG4Wb2l6ll3XdV
title: "difit-review スキルでエージェント自身に変更点をコメントしてもらおう"
slug: "difit-review-agent-comment"
about: "difit はローカルの git 差分を GitHub スタイルのインターフェースで確認できる CLI ツールです。difit-review スキルを使用することでエージェントがコードの変更点にコメントを残した状態で difit を起動できます。この記事では、difit-review スキルを使用してエージェント自身にコードの変更点をコメントしてもらう方法を紹介します。"
createdAt: "2026-04-02T19:20+09:00"
updatedAt: "2026-04-02T19:20+09:00"
tags: ["difit", "agent-skills"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6IxkYer4azMRxPmCi3M43i/08e5110afe8102cbc6958b9cea208194/mushroom_kinoko_illust_1037-768x558.png"
  title: "キノコのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "difit-review スキルを使う主な利点として、記事の説明に最も合っているものはどれですか？"
      answers:
        - text: "リモートに変更をプッシュしなくても、ローカルの差分を見慣れたインターフェースで確認し、エージェントのコメント付きでレビューできること"
          correct: true
          explanation: "記事では、ローカルで完結したまま GitHub スタイルの UI で差分確認とコメント付与ができる点を利点として説明しています。"
        - text: "GitHub に自動で Pull Request を作成し、レビュー依頼まで代行してくれること"
          correct: false
          explanation: "記事で扱っているのはローカルの差分確認であり、Pull Request の自動作成機能については説明されていません。"
        - text: "差分のあるファイルを自動で本番環境へデプロイしてくれること"
          correct: false
          explanation: "difit は差分を確認するためのツールであり、デプロイ機能は記事の対象外です。"
        - text: "コードの差分を自動で修正し、コミットまで完了してくれること"
          correct: false
          explanation: "記事ではコメント付きで差分を確認できる点を紹介しており、自動修正や自動コミットについては述べていません。"
    - question: "第三者が作成した Agent Skills をインストールするときに、記事が特に注意を促している点はどれですか？"
      answers:
        - text: "スキルをインストールすると、difit のローカルビューアーが起動しなくなる可能性があること"
          correct: false
          explanation: "記事の注意点はビューアーの起動可否ではなく、セキュリティリスクに関するものです。"
        - text: "スキルが古い Node.js バージョンでしか動かない可能性があるため、事前にランタイム要件を確認すること"
          correct: false
          explanation: "ランタイム要件の確認は一般論としてありえますが、記事で警告している中心点ではありません。"
        - text: "プロンプトインジェクションや任意スクリプト実行などのセキュリティリスクがあるため、内容を十分に確認すること"
          correct: true
          explanation: "記事中の warning では、機密事項の窃取や任意スクリプト実行のリスクに触れ、スキル内容の確認を推奨しています。"
        - text: "インストール後は既存のスキルがすべて無効化されるため、バックアップを取ること"
          correct: false
          explanation: "そのような挙動は記事では説明されていません。"
    - question: "記事の流れに沿って、実装後にエージェント自身に変更点の説明を残した状態で difit を起動したい場合、どの操作が適切ですか？"
      answers:
        - text: "`npx skills add https://github.com/yoshiko-pg/difit --skill difit-review` を毎回実行してから差分を見る"
          correct: false
          explanation: "これはスキルのインストール手順であり、実装後に毎回実行してレビューを開始するコマンドではありません。"
        - text: "`npx difit staged --comment` を直接実行し、スキルは使わない"
          correct: false
          explanation: "記事の主題はスキル経由で起動してエージェントにコメントを付けてもらう方法であり、この手順は記事の流れと一致しません。"
        - text: "`/difit-review` コマンドを使って、SKILL.md で定義されたルールに従って difit を起動してもらう"
          correct: true
          explanation: "記事では、実装完了後に `/difit-review` を使うことで、`--comment` 付きの difit 起動につなげる流れを紹介しています。"
        - text: "`/difit` コマンドで起動したあと、レビューコメントは手動で別ファイルにまとめる"
          correct: false
          explanation: "記事で紹介しているのは `difit-review` スキルにより、コメントが付いた状態で起動する方法です。"
published: false
---
[difit](https://github.com/yoshiko-pg/difit) は GitHub スタイルのビューワーでローカルの git 差分を確認・レビューできる CLI ツールです。コードを自分で書くよりもレビューすることが多くなった AI エージェント時代に、リモートに変更をプッシュすることなく見慣れたインターフェースでコードの差分を確認できるという点が魅力的です。`npx difit <target>` コマンドで特定のコミットを指定して差分を確認できるほか、`staged` や `working` といったキーワードでステージングエリアやワーキングツリーの差分を確認できます。

```bash
# 特定のコミットの差分を確認
npx difit abcd1234
# ステージングエリアの差分を確認
npx difit staged
# mainブランチとの差分を確認
npx difit @ main
```

コマンドを実行すると http://localhost:4966 で差分を確認できるようになります。行単位でコメントを残し、プロンプトとしてエージェントにフィードバックできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Lro8AcuZSO3X0jbc6f502/61939c20f279afd43037c065287e09a9/image.png)

`difit` は CLI ツールとして提供されていますが、公式から提供されている Skills として利用することでエージェントから呼び出すこともできます。現時点では `difit` に関連するスキルは以下の 2 つが提供されています。

- [difit](https://skills.sh/yoshiko-pg/difit/difit): ユーザーにコードレビューを依頼する
- [difit-review](https://skills.sh/yoshiko-pg/difit/difit-review): エージェントがコメントを残した状態で difit を起動する

スキルの呼び出し方法はエージェントごとに異なります。例えば Claude Code では `/difit-review` のようにスラッシュコマンドで呼び出せますが、Codex ではスキル参照から明示的に呼び出します。この記事では主に Claude Code での実行例を紹介しつつ、Codex での利用例もあわせて紹介します。

スキルから `difit` を起動することにより人間が細かいコマンドの引数の指定方法を覚える必要がなくなるほか、コードレビューの結果やエージェントが書いたコードの説明を残してもらうといった使い方が可能になります。実際に `difit-review` スキルを使用してエージェントによるコードの説明を試してみましょう。

## difit-review スキルをインストール

特定のスキルをインストールするには `npx skills` コマンドが便利です。以下のコマンドで対話形式で利用中のエージェントを選び、`difit-review` スキルをインストールします。

```bash
npx skills add https://github.com/yoshiko-pg/difit --skill difit-review
```

:::warning
Agent Skills はプロンプトにユーザーの機密事項を窃取するプロンプトを含める「プロンプトインジェクション」のリスクや、任意のスクリプトを実行できる仕組みが悪用されるリスクなど、セキュリティ上のリスクを伴う可能性があります。Agent Skills を第三者からインストールする際には、スキルの内容を十分に確認することを推奨します。
:::

スキルのインストールが完了したら、エージェントから `difit-review` スキルを使用できるようになっているか確認してみましょう。例えば Claude Code では `/difit-review` と入力したときに候補として表示されれば、スキルが正しく認識されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/GjgRsj9Ru1Qz21u5efBSE/53ac4761296999ac85e9ef8144a841ec/image.png)

## `difit-review` スキルを使用してエージェントにコードの説明をしてもらう

それでは実際に `difit-review` スキルを使用してエージェントにコードの説明をしてもらった状態で `difit` を起動してもらいましょう。まずは架空の家計簿アプリの UI を実装してもらいます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5Ey772CvvSkyXJ32wNfDMN/ad665eefe45032c9c4dbc9c0740f549f/image.png)

<details>
<summary>プロンプト</summary>

```txt
# 取引入力フォーム UI

## 概要

収入・支出を登録するための入力フォームを実装する。新規作成と編集の両方に使える共通コンポーネントとして設計する。

## ページ構成

- 新規作成: `/transactions/new`（または一覧ページ内のモーダル）

## フォームフィールド

| フィールド | 入力方式 | バリデーション |
|-----------|---------|--------------|
| タイプ | 収入 / 支出 のトグルスイッチ | 必須 |
| 日付 | 日付ピッカー（デフォルト: 今日） | 必須、未来日は警告のみ |
| 金額 | 数値入力（円マーク表示） | 必須、1以上の整数 |
| カテゴリ | セレクトボックス（type に応じてフィルタ） | 必須 |
| メモ | テキストエリア（1行） | 任意、200文字以内 |

## UI の振る舞い

- タイプ（収入/支出）を切り替えると、カテゴリの選択肢が連動して切り替わる
- 金額入力時に3桁カンマ区切りで表示（例: ¥1,500）
- 送信後は一覧ページに遷移（またはモーダルを閉じてリスト更新）
- 送信中はボタンをローディング状態にして二重送信を防止

## 追加の要件

- `/api/transactions` エンドポイントに POST リクエストを送る形で実装する
- Vitest + Testing Library を使用してコンポーネントのテストを実装する
- アクセシビリティに配慮した実装を心がける
- 既存の UI コンポーネントライブラリを活用して実装する
```

</details>

実装が完了したら、Claude Code では `/difit-review` コマンドを使用して `difit` を起動してもらいます。[SKILL.md](https://github.com/yoshiko-pg/difit/blob/main/skills/difit-review/SKILL.md) で定義されているルールの通り、`difit` コマンドを `--comment` オプション付きで起動する点がポイントです。`difit-review` スキル自体は `difit` の起動方法とコメントの受け渡しを定義するもので、どのようなコメントが付くかはエージェントが差分をどう調査したかに依存します。

```bash
/difit-review
```

ここではなぜ `<Select>` コンポーネントをテストでモックしているのか、コードを見ただけでは分かりづらい変更点についてエージェントがコメントを残しています。例えば「テスト環境では複雑な UI コンポーネントの内部実装よりもフォームの振る舞いを検証したいため、`<Select>` を単純なモックに置き換えている」といった補足があれば、差分の意図をすばやく把握できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7c7XcmQNEwwzeind1iZi3q/ccf31b160baf34e253f8bef36056eb5c/image.png)

エージェントにコードレビューを依頼するときも同様に `difit-review` スキルを活用できます。Claude Code の実装を Codex にレビューしてもらいましょう。Codex ではスキル参照を通じて `difit-review` を明示的に呼び出します。

![](https://images.ctfassets.net/in6v9lxmm5c8/23jitRaz97qwX7RqvJ10N7/90979d92c5fdb7660b19fd8da680b10c/image.png)

主要ファイルの差分とその周辺コードを調査したうえで、エージェントが重要な問題や変更意図をコメントとして残した状態で `difit` を起動できます。レビュー結果の品質そのものはエージェントの調査内容に依存しますが、実際のコードレビューの体験をローカルで完結させられるのは便利です。

![](https://images.ctfassets.net/in6v9lxmm5c8/2L5FenvquKmLASAEgxq5va/9c317ea1385c455787c1675eb4653cc5/image.png)

## まとめ

- `difit` はローカルの git 差分を GitHub スタイルのインターフェースで確認できる CLI ツール
- `difit-review` スキルを使用することでエージェントがコードの変更点にコメントを残した状態で `difit` を起動できる
- Claude Code では `/difit-review` のように呼び出すことで、エージェントがコードの変更点にコメントを残した状態で `difit` を起動できる
- エージェントにコードレビューを依頼するときも `difit-review` スキルを活用できる

## 参考

- [difit-review by yoshiko-pg/difit](https://skills.sh/yoshiko-pg/difit/difit-review)
- [difit/skills at main · yoshiko-pg/difit](https://github.com/yoshiko-pg/difit/tree/main/skills)
