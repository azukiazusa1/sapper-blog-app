---
id: MwDKTTEpRkqjAUJmIfwkA
title: "Claude Code でカスタムスラッシュコマンドを作成する"
slug: "claude-code-custom-slash-command"
about: "Claude Code では `/` で始まる文字列がスラッシュコマンドとして定義されておりあらかじめ割り当てられた操作を実行できます。スラッシュコマンドはユーザーが独自に定義することもできます。この記事では、Claude Code でカスタムスラッシュコマンドを作成する方法について説明します。"
createdAt: "2025-06-22T08:10+09:00"
updatedAt: "2025-06-22T08:10+09:00"
tags: ["AI", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2dlS4hYK4u0rDx3snenCHT/b6fe043d8582c9b4b8a60c59609a56bf/claude_code_thumbnail.svg"
  title: "ターミナルでスラッシュコマンドを入力している様子"
audio: null
selfAssessment:
  quizzes:
    - question: "Claude Codeでカスタムスラッシュコマンドを作成する際、マークダウンファイルをどこに配置すればプロジェクト単位でコマンドを定義できますか？"
      answers:
        - text: "`.claude/commands`"
          correct: true
          explanation: "プロジェクト単位でカスタムスラッシュコマンドを定義する場合は、プロジェクトのルートディレクトリに `.claude/commands` ディレクトリを作成し、その中にマークダウンファイルを配置します。"
        - text: "`~/.claude/commands`"
          correct: false
          explanation: "これはユーザー単位でコマンドを定義する場合の配置場所です。"
        - text: "`.claude/slash-commands`"
          correct: false
          explanation: null
        - text: "`./claude`"
          correct: false
          explanation: null
    - question: "カスタムスラッシュコマンドのマークダウンファイル内で、コマンドの引数を参照するために使用するキーワードは何ですか？"
      answers:
        - text: "$ARGUMENTS"
          correct: true
          explanation: "`$ARGUMENTS` はコマンドの引数を参照するためのキーワードで、コマンド実行時にユーザーが入力した引数がここに置き換えられます。"
        - text: "$PARAMS"
          correct: false
          explanation: null
        - text: "$INPUT"
          correct: false
          explanation: null
        - text: "$ARGS"
          correct: false
          explanation: null
    - question: "マークダウンファイル内で `!` で始まる行はどのような目的で使用されますか？"
      answers:
        - text: "スラッシュコマンドを実行する前にBashコマンドを実行し、出力結果をスラッシュコマンドのコンテキストとして使用する"
          correct: true
          explanation: "`!` で始まる行はスラッシュコマンド実行前にBashコマンドを実行し、その出力結果をコンテキストとして使用できます。"
        - text: "コメントを記述するため"
          correct: false
          explanation: null
        - text: "重要な注意事項をマークするため"
          correct: false
          explanation: null
        - text: "ファイルのパスを指定するため"
          correct: false
          explanation: "ファイルのパスを指定するには `@` を使用します。"
published: true
---
Claude Code では `/` で始まる文字列が組み込みのスラッシュコマンドとして定義されています。スラッシュコマンドを使用することであらかじめ割り当てられた操作を実行できます。よく使われるスラッシュコマンドには以下のようなものがあります。

- `/add-dir`: 現在のディレクトリに加えて、新しいワーキングディレクトリを追加する
- `/clear`: 会話履歴をクリアして、コンテキストウィンドウをリセットする
- `/init`: 現在のプロジェクトの構成を調査して、`CLAUDE.md` ファイルを生成する
- `/release-notes`: Claude Code のリリースノートを表示する
- `/help`: ヘルプと利用可能なスラッシュコマンドのリストを表示する

利用可能なすべてのスラッシュコマンドのリストは、`/help` コマンドを入力することで確認できます。（[Anthropicのドキュメント](https://docs.anthropic.com/en/docs/claude-code/slash-commands)にも記載されていますが、Claude Code の更新は頻繁に行われているため最新の情報が反映されていない場合があります）。

このスラッシュコマンドは、ユーザーが独自に定義することもできます。この記事では、Claude Code でカスタムスラッシュコマンドを作成する方法について説明します。

## カスタムスラッシュコマンドの作成

カスタムスラッシュコマンドでは頻繁に使用するプロンプトをマークダウンファイルとして定義します。マークダウンファイルの名前から `.md` を除いた部分がスラッシュコマンドの名前になります。例えば、`/my-command` というスラッシュコマンドを作成する場合は、`my-command.md` というファイルを作成します。

カスタムスラッシュコマンドはプロジェクト単位もしくはユーザー単位で定義できます。

- プロジェクト単位: プロジェクトのルートディレクトリに `.claude/commands` ディレクトリを作成し、その中にマークダウンファイルを配置する
- ユーザー単位: `~/.claude/commands` ディレクトリを作成し、その中にマークダウンファイルを配置する

試しに `/article-review` というスラッシュコマンドを作成してみましょう。このコマンドは、記事のレビューを行うためのプロンプトを定義します。

~~~.claude/commands/article-review.md
---
allowed_tools: Bash(git:*), Bash(npm:*), Read(*.md), Fetch(*)
description: "引数で指定した記事のレビューを行います。"
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

- 文書校正を行うコマンド: !`npx textlint blogPost/$ARGUMENTS.md`
- 筆者の文章のスタイルは @writing-style.md を参照

---
記事本文

@blogPost/$ARGUMENTS.md
~~~

カスタムスラッシュコマンドのファイルはマークダウン形式で記述します。ファイルの先頭には YAML フロントマターでコマンドのメタデータを定義できます。

- `allowed_tools`: このコマンドで使用できるツールを指定します
- `description`: コマンドの説明

またマークダウンファイル内ではいくつかの特別なキーワードを使用できます。

- `$ARGUMENTS`: コマンドの引数を参照するためのキーワード。コマンド実行時にユーザーが入力した引数がここに置き換えられます。
- `!` で始まる行: スラッシュコマンドを実行する前に Bash コマンドを実行する。出力結果はスラッシュコマンドのコンテキストとして使用される
- `@` で始まるファイル名: 指定されたファイルのパスを参照し、その内容をスラッシュコマンドのコンテキストとして使用する

カスタムスラッシュコマンドが正しく定義されている場合、Claude Code のチャットウィンドウで `/` を入力すると、定義したスラッシュコマンドが候補として表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4ot4s70JXrwYZrtXNRCyaM/3630ed5281cd7aaeecee365a40fae332/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-22_9.07.18.png)

カスタムコマンドを実行すると、引数で指定したファイルを読み込み、定義したプロンプトに基づいて処理が実行されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7vJCHfcSnwZeWVnQZSgwE6/8e9b9c798ce0778ac30c9cb73f550427/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-22_9.21.43.png)

## まとめ

- Claude Code では `/` で始まる文字列がスラッシュコマンドとして定義されている
- カスタムスラッシュコマンドはプロジェクト単位もしくはユーザー単位で定義できる
  - プロジェクト単位の場合は `.claude/commands` ディレクトリにマークダウンファイルを配置する
  - ユーザー単位の場合は `~/.claude/commands` ディレクトリにマークダウンファイルを配置する
- マークダウンのファイル名から `.md` を除いた部分がスラッシュコマンドの名前になる
- スラッシュコマンドはマークダウンファイルとして定義し、YAML フロントマターで `allowed_tools` や `description` を指定できる
- スラッシュコマンド内では `$ARGUMENTS` を使用して引数を参照できる
- `!` で始まる行はスラッシュコマンド実行前に Bash コマンドを実行し、出力結果をコンテキストとして使用できる
- `@` で始まるファイル名は指定されたファイルの内容をコンテキストとして使用できる

## 参考

- [Slash commands - Anthropic](https://docs.anthropic.com/en/docs/claude-code/slash-commands)
- [【Claude Code】カスタムSlash Commandの作り方とコマンド例を紹介する](https://zenn.dev/oikon/articles/cb11b84f891228)
