# Contents

- `/blogPost`: ブログ記事の一覧。
- `/slides`: スライドの一覧。`/<イベント名>/<スライド名>.md` で保存する。[marp](https://marpit.marp.app/) のスライド記法を使用している。

## スライドをローカルで表示

```bash
npm run dev
```

## スライドを PDF にエクスポート

```bash
npm run build:pdf -- slides/<スライドのパス>.md
```
