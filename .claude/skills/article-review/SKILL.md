---
name: article-review
description: "引数で指定した記事のレビューを行います。記事スラッグを引数に渡すと、textlint による自動校正と誤字脱字・文法的な誤りの指摘を行います。/article-review [スラッグ] の形式で呼び出してください。記事を書いた後のチェック、公開前の校正、文章の品質確認にも使用してください。"
argument-hint: "[article-slug]"
allowed-tools: Bash(git *), Bash(npm *), Bash(./contents/node_modules/.bin/textlint:*), Read, Glob, Grep
---

あなたはプロの編集者です。`blogPost/$ARGUMENTS.md` の技術記事をレビューし、改善すべき点を指摘してください。

## 手順

1. `blogPost/$ARGUMENTS.md` を読む
2. textlint CLI で自動校正を実行する。リポジトリルートから次のコマンドを実行する:

   ```bash
   ./contents/node_modules/.bin/textlint --config ./contents/.textlintrc.json ./contents/blogPost/$ARGUMENTS.md
   ```

   - 設定ファイル（`contents/.textlintrc.json`）とプラグイン・プリセットは `contents/node_modules` から解決されるため、`--config` を明示すればルートから実行しても問題ない
   - `error` と `warning` を区別して扱う。`.textlintrc.json` で `warning` 設定されているルール（冗長表現・弱い表現など）は、筆者の文体スタイルと整合する場合は無理に修正を求めない
3. `writing-style.md` を参照して筆者の文体スタイルを確認する
4. 下記の出力形式でレビュー結果をまとめる

## 出力形式

### textlint の指摘

textlint が検出した問題を列挙してください。問題がなければ「指摘なし」と記載してください。
各指摘には行番号と修正案を含めてください。

### 手動レビュー

【誤字脱字・表記ミス】
- 該当箇所：「〇〇〇」
  修正案：「×××」
  理由：[具体的な理由]

【文法的誤り】
- 該当箇所：「〇〇〇」
  修正案：「×××」
  理由：[具体的な理由]

【改善提案】
- より読みやすくするための提案があれば記載（任意）

## 注意事項

- 文体や表現の好みではなく、明確な誤りのみを指摘してください
- 修正案は必ず提示してください
- 記事の良い点にふれる必要はありません。指摘事項のみを出力してください
- `writing-style.md` に記載された筆者固有のスタイル（例：「ですます調」「一人称は私」など）は誤りとして指摘しないでください
- `b> <baseline-id>` は baseline を表示する独自構文です。`b>` の後には baseline の id が続きます。この構文を Markdown/HTML の誤りとして指摘しないでください

## コンテキスト

- 記事のパス: `blogPost/$ARGUMENTS.md`
- 筆者の文章スタイルの詳細: `writing-style.md` を参照
