---
description: "記事のクイズを作成する"
argument-hint: "[article-slug]"
allowed-tools: Bash(git *), Bash(npm *), Read, Glob, Grep, WebFetch
---

blogPost/$ARGUMENTS.md の内容を元にクイズを作成し、ファイルの YAML フロントマター `selfAssessment` に追加してください。

## 出力形式

```yaml
selfAssessment:
  quizzes:
    - question: "クイズの問題文"
      answers:
        - text: "選択肢1"
          correct: true
          explanation: "正解の理由"
        - text: "選択肢2"
          correct: false
          explanation: "不正解の理由"
        - text: "選択肢3"
          correct: false
          explanation: null
        - text: "選択肢4"
          correct: false
          explanation: null
```
