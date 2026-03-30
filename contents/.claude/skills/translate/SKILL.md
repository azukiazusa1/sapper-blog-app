---
description: "記事を英語に翻訳する。記事スラッグを引数に渡すと、日本語の記事を英語に翻訳して contents/blogPost/en/ に出力する。/translate [スラッグ] の形式で呼び出す。"
argument-hint: "[article-slug]"
allowed-tools: Bash(git *), Bash(mkdir *), Read, Write, Glob, Grep
---

`blogPost/$ARGUMENTS.md` の日本語記事を英語に翻訳し、`blogPost/en/$ARGUMENTS.md` に出力する。

## 手順

1. `blogPost/$ARGUMENTS.md` を読む
2. `blogPost/en/` ディレクトリがなければ作成する
3. 下記の翻訳ルールに従い、記事全体を英語に翻訳する
4. `blogPost/en/$ARGUMENTS.md` に翻訳結果を書き出す
5. 翻訳結果のサマリーを出力する

## 翻訳ルール

### frontmatter

- `title`: 英語に翻訳する
- `slug`: **変更しない**（日本語版と全く同じ値を維持。Contentful で同じエントリを参照するために必須）
- `id`: **変更しない**（日本語版と全く同じ値を維持。Contentful でエントリを特定するために必須）
- `about`: 英語に翻訳する
- `tags`: 英語の一般的なタグに翻訳する（例: "型安全" → "type-safety"）
- `selfAssessment`: クイズの `question`, `text`, `explanation` を英語に翻訳する
- `published`: **変更しない**（日本語版と同じ値を維持）
- その他のフィールド（`createdAt`, `updatedAt`, `thumbnail`, `audio`）: そのまま維持

### 本文

- 技術用語（API名、ライブラリ名、コマンド名、コード内の識別子）はそのまま維持する
- コードブロックの中身は翻訳しない。ただしコメントが日本語の場合は英語に翻訳する
- マークダウンの構造（見出しレベル、リスト、リンク、画像）はそのまま維持する
- 日本語特有の表現は自然な英語に意訳する。逐語訳は避ける
- 技術ブログとしてのトーンを維持する。カジュアルすぎず、堅すぎない文体にする
- 原文の段落構成・セクション構成は維持する

### 品質基準

- ネイティブの英語話者が違和感なく読める自然な英語にする
- 技術的な正確性を最優先する。不明な技術用語は原文のまま残す
- 原文の意図・ニュアンスを正確に伝える
