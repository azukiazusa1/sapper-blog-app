---
id: ujdcN2mj_dq-BsI-10apl
title: "Playwright CLI で AI エージェントに視覚的なフィードバックを与える"
slug: "playwright-cli-ai-agent-visual-feedback"
about: "Playwright CLI v0.1.9 で追加されたアノテーション機能は AI エージェントに視覚的なフィードバックを与えるために便利な機能です。アノテーション機能を利用すると、ブラウザの要素を選択して、その要素に対するコメントを残すことができます。AI エージェントはこのアノテーションが残された要素を簡単に特定できるため、どのコードを修正すればよいのかを判断しやすくなります。"
createdAt: "2026-05-03T11:21+09:00"
updatedAt: "2026-05-03T11:21+09:00"
tags: ["playwright", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/ud2v4jmPh9FBFLlJiG3oi/504d81605de7050f0b0a3ea40bd8048b/bird_uguisu_11328-768x640.png"
  title: "ウグイスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "記事で説明されている Playwright CLI v0.1.9 のアノテーション機能を利用するコマンドはどれですか?"
      answers:
        - text: "playwright-cli annotate"
          correct: false
          explanation: null
        - text: "playwright-cli screenshot --annotate"
          correct: false
          explanation: null
        - text: "playwright-cli show --annotate"
          correct: true
          explanation: null
        - text: "playwright-cli open --annotate"
          correct: false
          explanation: null
published: true
---
AI エージェントを使用してフロントエンドを開発する際、どのように視覚的なフィードバックを提供するかはよくある課題です。AI エージェントは自身が書いたコードに対してテストや Lint から得られるフィードバックをもとに改善するというサイクルを繰り返すことによってコードの品質を向上させることができます。しかし、フロントエンドの開発では、例えば CSS が実際にどのように適用されているか、あるいは JavaScript がどのように動作しているかといった視覚的なフィードバックが必要になります。一方で、AI 自身はブラウザを操作する手段を持ちません。そのため Playwright や Chrome DevTools Protocol といったブラウザ自動化ツールを利用して、AI エージェントがコードの変更に対して視覚的なフィードバックを得る方法が考えられます。最近ではコーディングエージェントのデスクトップアプリからブラウザを操作できるといった機能も提供されています。

とはいえすべての視覚的なフィードバックを自動化できるわけではなく、人間が実際に操作してフィードバックを与えることも大切です。マウスやスワイプ操作をする人間の操作方法と要素を直接選択してクリックする AI の操作方法は異なりますし、現時点での AI エージェントではアニメーションの体験を評価することが難しいです。実際に Web アプリケーションを操作するのは人間ですから、AI エージェントがコードを変更した後に人間が実際に操作してフィードバックを与えるというサイクルも重要になります。

Playwright CLI v0.1.9 で追加されたアノテーション機能は AI エージェントに視覚的なフィードバックを与えるために便利な機能です。アノテーション機能を利用すると、ブラウザの要素を選択して、その要素に対するコメントを残すことができます。AI エージェントはこのアノテーションが残された要素を簡単に特定できるため、どのコードを修正すればよいのかを判断しやすくなります。

この記事では Playwright CLI のアノテーション機能を利用して AI エージェントに視覚的なフィードバックを与える方法について試してみます。

## Playwright CLI をインストールする

まずは AI エージェントが Playwright CLI を利用できるようにするために、Playwright CLI をインストールします。Playwright CLI は npm からインストールできます。

```bash
npm install -g @playwright/cli
```

インストールが完了したら `playwright-cli` コマンドが利用できるようになります。`playwright-cli open` は指定した URL を開き、その情報を標準出力に出力するコマンドです。スナップショットファイルにはページのアクセシビリティツリーが含まれています。

````bash
$ playwright-cli open https://azukiazusa.dev

### Browser `default` opened with pid 17985.
### Ran Playwright code
```js
await page.goto('https://azukiazusa.dev');
```

### Page

- Page URL: https://azukiazusa.dev/
- Page Title: azukiazusaのテックブログ2
- Console: 1 errors, 1 warnings

### Snapshot

- [Snapshot](.playwright-cli/page-2026-05-03T02-44-16-750Z.yml)

### Events

- New console entries: .playwright-cli/console-2026-05-03T02-44-15-178Z.log#L1-L22

````

さらにコーディングエージェントが Playwright CLI を正しく利用できるように、Skill をインストールできます。

```bash
playwright-cli install --skills
```

Claude Code を使用しているプロジェクトでは、以下のコマンドを実行すると `.claude/skills/playwright-cli` に Playwright CLI の Skill がインストールされます。このスキルには Playwright CLI のコマンドの使用方法と、リファレンスガイドが含まれています。

```bash
.claude/skills/playwright-cli
├── SKILL.md
└── references
    ├── element-attributes.md
    ├── playwright-tests.md
    ├── request-mocking.md
    ├── running-code.md
    ├── session-management.md
    ├── spec-driven-testing.md
    ├── storage-state.md
    ├── test-generation.md
    ├── tracing.md
    └── video-recording.md

2 directories, 11 files
```

## コーディングエージェントに UI レビューを依頼する

それでは実際にコーディングエージェントに UI レビューを依頼するフローを試してみましょう。まずは Claude Code に通常通りコードの変更を依頼したうえで、コーディングが完了したら Playwright CLI を利用してブラウザで変更を確認するように指示します。例としてユーザー設定画面を追加するタスクを考えてみましょう。

```txt
`/settings` ページを追加して、ユーザー設定を変更できるようにしてください。ユーザー設定には以下の項目を含めてください。

- ユーザー名
- メールアドレスの通知のオンオフ
- テーマの選択（ライトモード、ダークモード、システム設定に合わせる）

コードの変更が完了したら、Playwright CLI を利用してブラウザで変更を確認してください。特にテーマの選択が正しく動作しているかを確認してください。
```

Claude Code のセッションを確認すると、確かに Playwright CLI を利用してブラウザで変更を確認していることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Nn9w8XFFmboKHr8GuO4lC/2e3b38a4e93a717a9867e7d6d713047d/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/47jcoAbpdqbiqEomj9lyo7/2f1d12cfd93f20d62005b95059a53ac8/image.png)

`.playwright-cli` ディレクトリの中にはアクセシビリティツリー形式のスナップショットが保存されています。

```sh
.playwright-cli
├── console-2026-05-03T03-10-10-422Z.log
├── console-2026-05-03T03-10-27-907Z.log
├── page-2026-05-03T03-10-11-302Z.yml
├── page-2026-05-03T03-10-31-178Z.yml
├── page-2026-05-03T03-10-45-952Z.yml
├── page-2026-05-03T03-11-11-480Z.yml
├── page-2026-05-03T03-11-33-318Z.yml
├── page-2026-05-03T03-11-48-942Z.yml
└── page-2026-05-03T03-12-17-194Z.yml

1 directory, 9 files
```

AI エージェントの実行が完了したら、続いて「UI レビューをしてください」といった指示を与えます。このように指示を与えると、AI エージェントは `playwright-cli screenshot` と `playwright-cli show --annotate` コマンドを実行します。このコマンドを実行すると、Playwright のダッシュボードがブラウザで開き、取得したスクリーンショットが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1o4h0n8aD8yRkYAZFl4yff/fa24f08ce8d7ad8cbb2619e65505f962/image.png)

スクリーンショット上でクリック・ドラッグして要素を選択し、コメントを挿入できます。ここではユーザー名の入力欄のプレイスホルダーの文言を「ユーザー名を入力してください」から「ユーザー名を入力」に変更するようにフィードバックを与えてみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/7TdN01FVh94jPcPuz1X0Q/037d0ae4833ec29f7be8134b5e7a5d5c/image.png)

アノテーションが完了したら、右上のチェックマークをクリックして完了です。AI エージェントにフィードバックが送信されます。アノテーションは `{ x: 336, y: 179, width: 612, height: 95 }: プレイスホルダーは「ユーザー名を入力」に変更してください` という形式で渡されていることがわかります。同時にアノテーションが残されたスクリーンショットとアクセシビリティツリーのスナップショットも渡されます。AI エージェントはこれらの情報を元に、どのコードを修正すればよいのかを判断します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7lFbswzrV4Qbf1XJmGhOzl/b8a8bda0ecadbab41c3eb91f07296a9d/image.png)

## まとめ

- AI エージェントに視覚的なフィードバックを与えるためには、Playwright CLI のアノテーション機能が便利
- AI エージェントはアノテーションが残された要素を特定して、どのコードを修正すればよいのかを判断できる
- 人間が実際に操作してフィードバックを与えることも大切で、AI エージェントがコードを変更した後に人間が実際に操作してフィードバックを与えるというサイクルも重要

## 参考

- [Release v0.1.9 · microsoft/playwright-cli](https://github.com/microsoft/playwright-cli/releases/tag/v0.1.9)
- [Giving UI Reviews to Coding Agents - Playwright CLI - YouTube](https://www.youtube.com/watch?v=2YWPJjOa-2w)
