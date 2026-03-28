---
description: "記事のクイズを作成する。記事を書いた後や公開前に、読者の理解度を確認するためのクイズを自動生成する。/q [スラッグ] の形式で呼び出す。"
argument-hint: "[article-slug]"
allowed-tools: Bash(git *), Bash(npm *), Read, Glob, Grep, WebFetch
---

blogPost/$ARGUMENTS.md の内容を元にクイズを3問作成し、ファイルの YAML フロントマター `selfAssessment` に追加する。

## クイズ作成の方針

### 問題の質

記事を読んで理解したかどうかを測る問題を作る。単なる用語やAPI名の暗記問題ではなく、以下のような観点を含める：

- **概念理解**: 「なぜその技術・手法が必要なのか」「どういう問題を解決するのか」
- **実践的判断**: 「この場面ではどのアプローチが適切か」「何に注意すべきか」
- **比較・区別**: 「AとBの違いは何か」「従来の方法と比べた利点は何か」

API名やコマンド名を問う問題は3問中1問までに留める。

### 選択肢の作り方

- 選択肢は4つ
- 正解の位置は問題ごとにばらけさせる（1問目が選択肢1なら、2問目は選択肢3にするなど）
- 不正解の選択肢は「もっともらしい誤り」にする。明らかにおかしい選択肢は避ける
- **全選択肢に explanation を記載する**（null にしない）。正解には「なぜ正しいか」、不正解には「なぜ間違いか」を簡潔に書く

### 記事のカバレッジ

記事の主要なポイントから満遍なく出題する。記事の冒頭だけ、特定のセクションだけに偏らないようにする。

## 出力形式

```yaml
selfAssessment:
  quizzes:
    - question: "クイズの問題文"
      answers:
        - text: "選択肢1"
          correct: false
          explanation: "不正解の理由"
        - text: "選択肢2"
          correct: true
          explanation: "正解の理由"
        - text: "選択肢3"
          correct: false
          explanation: "不正解の理由"
        - text: "選択肢4"
          correct: false
          explanation: "不正解の理由"
```
