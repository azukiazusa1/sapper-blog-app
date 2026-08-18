---
name: codepen-share
description: ローカルで検証済みのブラウザ向け HTML、CSS、JavaScript を CodePen Prefill launcher に変換し、承認後に未保存の Pen を開く。フロントエンドのデモを CodePen で共有して、記事へ埋め込む準備をして、と依頼されたときに使用する。Node.js、サーバー、CLI、ビルド、複数プロセスが必要な例には使用しない。
---

# 検証済みサンプルを CodePen で共有する

CodePen を検証環境ではなく共有先として扱い、保存や公開範囲の決定をユーザーへ残す。

## 適合性を確認する

[`references/codepen-prefill.md`](references/codepen-prefill.md) を読み、次をすべて満たす場合だけ進める。

- ブラウザの HTML、CSS、JavaScript だけで動作する
- 中心的な挙動をローカルで検証済みである
- Node.js、サーバー、CLI、ビルド、複数プロセスを必要としない
- API キー、トークン、Authorization ヘッダー、非公開 URL、個人情報、本番認証情報を含まない

ローカル検証が不明な場合は、根拠を確認するか検証工程へ戻す。CodePen 上で動いたことを記事の主張の根拠にしない。

## パネル用ファイルを準備する

使用するパネルだけを分離する。

- HTML: `body` 配下の要素だけ。doctype、`html`、`head`、`body`、`script`、`style` を含めない
- CSS: CSS だけ。`style` タグを含めない
- JavaScript: JavaScript だけ。`script` タグを含めない

共有のために検証済みの挙動を変えたり、不要な装飾を加えたりしない。

## launcher を生成する

```bash
python3 .claude/skills/codepen-share/scripts/create-codepen-prefill.py \
  --title "デモのタイトル" \
  --description "記事用の検証済みサンプル" \
  --html examples/<slug>/codepen.html \
  --css examples/<slug>/codepen.css \
  --js examples/<slug>/codepen.js \
  --output examples/<slug>/open-in-codepen.html
```

使用するパネルだけを渡す。既存の出力を置き換える必要がある場合だけ、対象を確認して `--force` を使う。launcher はローカルの HTML フォームであり、作成しただけではコードを外部へ転送しない。

## 外部転送前に承認を得る

launcher を開く、またはフォームを送信する前に、次をユーザーへ示す。

- Pen のタイトルと説明
- 転送する正確なファイル一覧
- 機密情報が含まれないこと
- コードはローカルで検証し、CodePen を検証環境にしていないこと
- 開く Pen は未保存であること

明示的な承認を得てから launcher を開き、フォームを送信する。入力済みの未保存 Pen が開いたら終了する。`Save` を押さず、公開範囲を選ばず、iframe を記事へ自動挿入しない。保存、公開範囲、共有 URL はユーザーが決定する。

記事へ位置を示す必要がある場合は、結果を説明した直後にコメントを置く。

```html
<!-- CodePen: ここに「<デモ名>」の iframe を挿入する -->
```

## 完了を報告する

launcher の場所、転送したパネル、ローカル検証の根拠、未保存であることを報告する。launcher を開けない場合はパスを渡し、フォームを送信すると未保存 Pen が開くことを説明する。
