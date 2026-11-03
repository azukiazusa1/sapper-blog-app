---
name: create-slide
description: 登壇やイベントの発表内容を壁打ちで固め、Marp の azukiazusa テーマで発表者ノート付きのスライド下書きを作成し、表示を検証する。ユーザーが発表、登壇、LT、カンファレンス、勉強会のスライドを作りたい、発表内容を整理したい、既存のスライドを直したいと依頼したときに使用する。
---

# 発表スライドを作成する

発表内容を合意してから、`contents/slides/<slug>/` に Marp のスライド下書きを作成する。

## 必須リソース

作業開始時に [`../../../contents/slide-rule.md`](../../../contents/slide-rule.md) を読む。デザインの判断はこのルールに従う。

スライドのクラスを確認するときは [`../../../contents/slides/themes/azukiazusa.css`](../../../contents/slides/themes/azukiazusa.css) を読む。

## 手順

### 1. 発表内容を合意する

質問を 1 つずつ行い、推奨案を添える。リポジトリや一次情報で確認できることは質問せず、先に調べる。次の順に決める。

1. 中心メッセージ: 聴衆が持ち帰る一言
2. 説明の流れ: 中心メッセージに至る主張のつながり
3. 根拠: 自分の検証、デモ、第三者の数値のどれを使うか
4. 時間配分: 発表時間と各パートの分数
5. タイトル、イベント名、日付

ユーザーの言葉で語られた流れを優先する。主張のつながりに飛躍があれば、反論を添えて指摘する。

用語の定義が導入の例と矛盾しないかも確認する。

### 2. 素材を調べる

- `contents/blogPost/` と `contents/slides/` の過去の記事とスライドを確認する
- 最新情報と数値は一次情報で確認する
- 確認できなかった内容は二次情報と明記するか、`memo.md` の残作業に書く
- 数値は条件を記録する。自分で測れる値は測る

### 3. 下書きを作成する

`contents/slides/<slug>/slide.md` と `memo.md` を作成する。

```yaml
---
marp: true
theme: azukiazusa
size: 16:9
description: 発表タイトル - サブタイトル
---
```

- テーマの CSS をスライドに複製しない。そのスライド固有の CSS だけを `style` に書く
- 全スライドに `<!-- -->` で発表者ノートを書く
- 不足している情報は `{{SCREENSHOT_NAME}}` の形式で仮置きし、`.placeholder` で表示する
- 自己紹介は過去のスライドから流用する
- `memo.md` に合意内容、時間配分、プレースホルダー一覧、発表までの確認事項を書く

### 4. レイアウトを選ぶ

| 用途 | クラス |
| --- | --- |
| タイトル、章の区切り | `.hero` と `.eyebrow`、`.huge`、`.lead` |
| 1 文の主張 | `.statement` |
| 2 項目の比較 | `.compare` と `.side`。弱める側に `.weak` |
| 処理の流れ | `.flow` と `.card`、`.arrow` |
| 仮置き | `.placeholder`、動画は `.placeholder.video` |
| 出典、条件 | `.small.muted` |

強調色は `*語*` または `.accent` で、1 枚につき 1 か所まで使う。優劣のない比較には使わない。

動画は `--html` の HTML 出力でのみ再生できる。`poster` に静止画を指定し、PDF でも内容が伝わるようにする。

```html
<video src="images/demo.mp4" poster="images/demo.png" controls muted></video>
```

### 5. 表示を検証する

`.claude/launch.json` の `slides` を起動し、`http://localhost:<port>/<slug>/slide.md` を開く。ページ内で [`scripts/check-slides.js`](scripts/check-slides.js) を実行し、はみ出し、横に長いコード、強調色の使いすぎを修正する。

新しいレイアウトは、目視でも確認する。

`slide-rule.md` の自己レビューも行う。

### 6. 報告する

次を明記する。

- 目視したスライドと、スクリプトだけで確認したスライド
- 残っているプレースホルダー
- 二次情報のままの内容
- 質疑で想定される反論
- 通し練習をしていないこと

ユーザーの依頼なしにコミットしない。

## テーマを変更する

共通のデザインは `contents/slides/themes/azukiazusa.css` だけで変更する。過去のスライドのうち、`theme: azukiazusa` を指定したものにも反映される点に注意する。
