---
id: Fm922yg2Bb6LTBghhGChY
title: "エージェントスキル集 pstack の開発原則と使い方"
slug: "pstack-agent-skills"
about: "AI が生成したコードを安心して任せるには、実装前の理解と実装後の検証が欠かせません。pstack は調査・設計・実装・レビューを組み合わせるエージェントスキル集です。この記事では pstack の開発原則と使い方を紹介します。"
createdAt: "2026-10-18T15:00+09:00"
updatedAt: "2026-10-18T22:30+09:00"
tags: ["AI", "agent skills", "Claude Code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3gxhnXlxBP1Qoru9upLO7L/90d75c784119a10424b1ff49c6fd352d/potato-chips_15269-768x689.png"
  title: "ポテトチップスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "pstack でタスクを始めるとき、poteto-mode はどのような役割を果たしますか?"
      answers:
        - text: "依頼内容をそのままサブエージェントに渡し、結果だけを返す"
          correct: false
          explanation: "poteto-mode は依頼を丸投げするのではなく、依頼の種類に応じた作業手順を選び、その手順に沿って必要なスキルを呼び出します。"
        - text: "依頼に応じてプレイブックを選び、手順の中で必要なスキルを呼び出す"
          correct: true
          explanation: "記事の通り、poteto-mode は不具合修正や機能追加などタスクの種類ごとに用意されたプレイブックを選び、その手順の中で必要なスキルを呼び出します。"
        - text: "利用可能なモデルを確認し、ロールごとのモデルと推論の予算を決める"
          correct: false
          explanation: "これは setup-pstack の役割として記事で説明されています。"
        - text: "/bug-fix などのプレイブック用コマンドを一覧表示し、ユーザーに選ばせる"
          correct: false
          explanation: "記事では、プレイブックは poteto-mode の中に含まれる手順書であり、/bug-fix のように直接呼び出すコマンドはないと説明されています。"

    - question: "Prove It Works の原則に照らすと、不具合修正の根拠として不十分とされるのはどれですか?"
      answers:
        - text: "最初に失敗した操作をもう一度試し、期待どおりになったことを確認する"
          correct: false
          explanation: "これは記事で推奨されている確認方法です。最初に再現した操作で修正を確かめることが重要とされています。"
        - text: "再実行できる検証スクリプトを残し、その出力を確認する"
          correct: false
          explanation: "記事では、再実行できる検証スクリプトを残すことも重視していると説明されています。"
        - text: "テストが元の不具合を捉えていることを確認したうえで、テストの成功を確かめる"
          correct: false
          explanation: "テストが元の不具合を捉えていることは、記事で重要な点として挙げられています。"
        - text: "修正前に実行しても成功するテストが、修正後も成功している"
          correct: true
          explanation: "記事の通り、修正前でも成功するテストは元の不具合を捉えていないため、修正の根拠として不十分です。"

    - question: "Claude Code で setup-pstack を実行したとき、モデルの設定はどこに保存されると記事で説明されていますか?"
      answers:
        - text: "リポジトリ直下の .claude/settings.json"
          correct: false
          explanation: "記事では、設定はリポジトリではなくユーザーのホームディレクトリ配下に保存されると説明されています。"
        - text: "~/.claude/rules/pstack-models.md"
          correct: true
          explanation: "記事の通り、モデルの設定は ~/.claude/rules/pstack-models.md に保存され、変更する場合は再度 setup-pstack を実行します。"
        - text: "poteto-mode の playbooks ディレクトリ"
          correct: false
          explanation: "playbooks はタスクの種類ごとの作業手順を置く場所であり、モデルの設定の保存先ではありません。"
        - text: "~/.claude/skills/setup-pstack/SKILL.md"
          correct: false
          explanation: "SKILL.md は setup-pstack の手順そのものであり、選んだモデルの設定はここには書き込まれません。"
published: true
---

AI が生成したコードを安心して任せるには、実装前の理解と実装後の検証が欠かせません。[pstack](https://github.com/cursor/plugins/tree/main/pstack) は、poteto 氏によるエージェントスキル集です。作者は生成するコードの量よりも品質を重視し、少ないコードで目的を達成することを目標として説明しています。この記事では、pstack の開発原則と使い方を紹介します。

## pstack はどのように開発を進めるのか

pstack は `/poteto-mode` からタスクを開始します。`poteto-mode` はユーザーの依頼に応じてプレイブックを選びます。プレイブックとは、不具合修正や機能追加など、タスクの種類ごとに用意された作業手順です。その手順の中で、必要なスキルを呼び出す構成になっています。[公式の利用ガイド](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/README.md)では、細かな操作を逐一指定するよりも、目標と完了を確認する方法を伝える使い方が説明されています。

たとえば不具合修正の依頼であれば、[Bug fix プレイブック](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/bug-fix.md)がエージェントにより選択されます。Bug fix プレイブックは、おおむね次の順に進めるよう指示しています。

1. 不具合を実際に再現する
2. 仮説を立て、実行時の証拠から原因を絞る
3. 修正を設計し、実装を委譲する
4. 最初に再現した操作で修正を確認する

## pstack の開発原則

pstack は、poteto 氏が Meta、Netflix、Cursor で数百万行規模のコードに携わってきた経験を元に、高品質なコードを生成するための原則をまとめています。pstack は、より少なく、より高品質なコードを書くのに役立ちます。原則は `principle-*` という名前のスキルとして定義されており、`how` や `architect` などのスキルがその原則を実際の作業手順に落とし込みます。ここでは、主な原則とそれに関係するスキルを紹介します。

### 実装する前に既存の仕組みを理解する

[`how`](https://github.com/cursor/plugins/blob/main/pstack/skills/how/SKILL.md) は、既存のコードがどう動くかを調べ、構造や実行の流れを説明するスキルです。単に関連するファイルを列挙するのではなく、変更するシステムの理解を目的としています。

たとえばキャッシュの不具合であれば、データの保存場所と読み込みのタイミングを調べます。さらに、誰が値を保持し、失敗した結果が次の呼び出しにどう影響するかを追います。この理解がなければ、キャッシュの管理方法を直すべき問題に対して、呼び出し側へ再試行の条件分岐を足してしまうおそれがあります。

調査を独立した工程として設けることで、最初に見つけた症状だけで修正箇所を決めず、原因を理解してから変更を加えるよう促しています。

### データの形と境界を先に決める

[`Model the Domain`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-model-the-domain/SKILL.md) は、業務上のルールや状態をデータ構造で表す原則です。たとえば、複数の真偽値を別々に管理するより、取り得る状態を整理した状態機械で表す方法が挙げられています。一方で、抽象化を無理に導入せず、すでに明確なコードでは単純な形を保つことも求めています。

この原則を設計の手順に落とし込んだスキルが [`architect`](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md) です。型、関数のシグネチャ、モジュールの境界を先に描き、複数の構造的に異なる案を比較してから実装へ進みます。`architect` は、デフォルトでは案をまとめた後に実装へ進みます。人間が途中で確認したい場合は以下のように、明示的にチェックポイントを指定します。

```text
/architect キャッシュの設計を見直してください。実装する前に、チェックポイントとして公開する関数と状態の持ち方を見せてください。
```

### 必要な変更を小さく保つ

[`Laziness Protocol`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-laziness-protocol/SKILL.md) は、重複した判断をまとめ、問題を解決する最小限の差分を選ぶ原則です。コードを追加する前に、既存の構造を単純にできないかを考えます。

短いコードなら常によいという意味ではありません。たとえば不具合修正と無関係な抽象化を加えると、レビューで確認する範囲が広がります。必要な変更に絞れば、何が原因で、どの変更がそれを解消するのかという対応関係を追いやすくなります。

### 完了を実際の動作で証明する

[`Prove It Works`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md) は、コンパイルの成功やエージェントの自己申告だけで完了と判断せず、実際の成果物を確認する原則です。再実行できる検証スクリプトを残すことも重視しています。

不具合修正であれば、最初に失敗した操作をもう一度試し、期待どおりになったか確認します。テストの成功に加えて、そのテストが元の不具合を捉えているかが重要です。修正前でも成功するテストだけでは、修正の根拠として不十分です。

### 複数モデルの指摘を人任せにしない

[`interrogate`](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md) は、複数モデルによるレビューを統合するスキルです。モデルごとの指摘を集めるだけでなく、対応すべき問題、検討すべき提案、記録に留める指摘、却下する指摘へ分類します。指摘を自動的にコードへ適用する手順ではありません。

複数モデルが同じ問題を指摘したことは判断材料になりますが、それだけで正しさが確定するわけではありません。最終的には、対象のコードと要求に照らして指摘を評価します。

## Claude Code で使い始める

pstack は、Cursor もしくは Claude Code で使えます。ここでは Claude Code での導入手順を紹介します。

### プラグインを追加する

[公式 README](https://github.com/cursor/plugins/blob/main/pstack/README.md)では、Claude Code で次のコマンドを使って導入する手順が案内されています。

```text
/plugin marketplace add cursor/plugins
/plugin install pstack@cursor-plugins
```

### モデルと推論の予算を設定する

続いて、初期設定として次のスキルを実行します。

```text
/setup-pstack
```

[`setup-pstack`](https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md) は、利用可能なモデルを確認し、ロールごとのモデルと推論の予算を選ぶ手順です。実際に試してみると判断が必要なロールには Opus を、それ以外の実装・調査には現在のセッションで使用されているモデルをそのまま引き継ぐように案内されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3HqYi5lELYCv7m9TJuboWV/edc53af480383776df76834a5a3b702e/pstack-agent-skills-1.png)

モデルの設定は `~/.claude/rules/pstack-models.md` に保存されます。設定を変更する場合は、再度 `setup-pstack` を実行します。

また pstack の使用方法に行き詰まった場合や、どのスキルが適切かわからない場合は `/poteto-help` スキルで質問できます。たとえば以下のように pstack の使い方のポイントを質問できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/642blyut9MUQLuno6QmFQZ/955b9ea32338a09e8d07cbda42cd1f18/pstack-agent-skills-2.png)

## 実際に試してみる

準備ができたら、`/` メニューから `poteto-mode` を選び、依頼を入力します。プレイブックは `poteto-mode` の中に含まれる手順書であり、`/bug-fix` のように直接呼び出すコマンドはありません。`poteto-mode` が依頼に応じて適切なプレイブックを選びます。`/poteto-mode` を使用する場合は、修正方法そのものは指定せず、目標とそれを検証する方法を伝えるのがポイントです。

たとえばタグ一覧画面において 500 エラーが発生する問題があったので、次のように依頼してみました。

```text
/pstack:poteto-mode https://azukiazusa.dev/tags が本番で 500 を返す。まず再現して、原因を突き止めてから直して。curl では再現せず、ブラウザで直接アクセスすると再現する。完了の条件は /tags がローカルのプレビュービルドで 200 を返し、タグ一覧が表示されること。証拠として修正前後の実際のレスポンス（ステータスとエラーログ）を見せて。本番は CF_ENV=production で実リポジトリ、開発ではモックになる点に注意。
```

`bug-fix` プレイブックを読み込んで、まずは再現の手順を確認し、次に原因を特定するための証拠を集め、最後に修正を設計して実装する手順で進められていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/2IPTAZcc7etNQmyIy3sIo2/c98e61a4a0b1efefb8432a0e4450a70c/pstack-agent-skills-3.png)

原因は slug が空文字列のとき、`key` が重複しハイドレーションに失敗することでした。サーバーのレスポンス自体は 200 であり、ハイドレーションの失敗によってブラウザ上で 500 のエラーページが表示されていたため、curl では再現しなかったのです。コードを修正して一時的に凌ぐこともできますが、根本的には slug が空文字列になることを防ぐべきです。エージェントは [Fix Root Causes](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-fix-root-causes/SKILL.md) の原則に基づき、コードを修正するという解決に飛びつかず、slug が空文字列に設定されているタグを修正する手段を提案してくれました。合わせて記事の作成時にタグを生成する実装にバグがあることも指摘し、根本原因から修正するという方針を示してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/29Tq2aE8BnVNB9UMh7mRq9/c71356d9c47e95cd53e304e8ecfbdfa4/pstack-agent-skills-4.png)

最終的に [`Prove It Works`](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-prove-it-works/SKILL.md) の原則に従い、修正前後のレスポンスを開発サーバーで確認し、修正の根拠としています。

その他のプレイブックも試してみましょう。たとえばリポジトリの設計やコードの構造がどのようになっているのか説明してほしい場合は、次のように依頼します。

```text
/pstack:poteto-mode このリポジトリの設計とコードの構造を説明して。設計の意図や、どのようなルールでコードが書かれているのかも知りたい。完了の条件は、設計の概要と、コードの構造を図で示すこと。
```

[investigation](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/investigation.md) プレイブックを読み込んでユーザーからの指示に回答してくれました。`investigation` プレイブックはコードを変えずに質問に答える作業に使います。成果物は、根拠を示した説明か推奨案です。以下のようにリポジトリの構造や記事が公開されるまでの流れを図で示してくれたり、設計の意図を文章で説明してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6j4tO4VwV20KEzy3cDajhr/390b1fe6b2275295f5b776ac02bf8717/pstack-agent-skills-5.png)

## まとめ

- pstack は調査・設計・実装・検証の進め方を共有するスキル集であり、`poteto-mode` が依頼に応じてプレイブックを選ぶ
- pstack は差分を小さく保ち、実際の成果物を確認して完了を判断することを重視する
- バグを修正するタスクを実際に試すと、根本原因を突き止めるための調査や設計を経て、修正を実装する手順で進められることがわかる
- コードの説明を依頼すると investigation プレイブックが選ばれ、コードを変更せずに根拠を示した説明が返ってくる

## 参考

- [pstack](https://github.com/cursor/plugins/tree/main/pstack)
- [The pstack guide](https://github.com/cursor/plugins/blob/main/pstack/docs/guide/README.md)
- [poteto-mode](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md)
- [setup-pstack](https://github.com/cursor/plugins/blob/main/pstack/skills/setup-pstack/SKILL.md)
- [architect](https://github.com/cursor/plugins/blob/main/pstack/skills/architect/SKILL.md)
- [Bug fix playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/bug-fix.md)
- [Investigation playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/investigation.md)
- [how](https://github.com/cursor/plugins/blob/main/pstack/skills/how/SKILL.md)
- [interrogate](https://github.com/cursor/plugins/blob/main/pstack/skills/interrogate/SKILL.md)
- [Fix Root Causes](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-fix-root-causes/SKILL.md)
