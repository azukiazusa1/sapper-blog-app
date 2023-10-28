---
id: mDqgraIv52_6qCOt3R5Te
title: "GitLens で特定のコミットを除外する"
slug: "exclude-specific-commits-from-github-history"
about: "GitLens の使用時に、機械的にフォーマットされたコミットがあるとコードの変更履歴を確認する際に邪魔になってしまいます。この記事では、GitLens で特定のコミットを除外する方法を紹介します。"
createdAt: "2023-10-28T10:30+09:00"
updatedAt: "2023-10-28T10:30+09:00"
tags: ["Git", "VSCode"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4HV8SpNNeNwZdXDBcSPbmW/8a66851f3c7748d7bb842ad5f3dad622/halloween_pumpkin_6455.png"
  title: "ハロウィンのかぼちゃのイラスト"
published: true
---
## TL;DR

1. `.git-blame-ignore-revs` という名前のファイルを作成して、除外するコミットのハッシュを記述する

```sh:.git-blame-ignore-revs
# 複数のコミットを指定する場合は改行で区切る
<sha1>
<sha1>
```

2. GitLens のユーザー設定である `gitlens.advanced.blame.customArguments` に `["--ignore-revs-file", ".git-blame-ignore-revs"]` を追加する

```json:.vscode/settings.json
{
  "gitlens.advanced.blame.customArguments": [
    "--ignore-revs-file", ".git-blame-ignore-revs"
  ]
}
```

## GitLens とは

[GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) は、Git の履歴を VSCode 上でより簡単に確認できるようにする拡張機能です。行にカーソルを合わせるだけで `git blame` の結果を表示して、誰がコードを変更したのかを素早く確認できます。

ホバーをすることでコミットの詳細を表示を表示できるので、そこから PR を開いてコードを変更した当時の会話や背景を確認する取った使い方をよく行っています。

![](https://raw.githubusercontent.com/gitkraken/vscode-gitlens/main/images/docs/hovers-current-line.png)

## 特定のコミットを除外したい

GitLens はコードリーディングの際に重宝しますが、VSCode 上で表示されるのは最新のコミットのみです。そのため、Linter や Formatter などのツールでソースコード全体を上書きしたコミットがあると、コードの変更履歴を確認する際に邪魔になってしまいます。

最新のコミットが機械的な変更である場合、そのコミットを除外することでコードの変更履歴をより見やすくすることができます。

## `--ignore-revs-file` オプションで除外するコミットを指定する

git の v2.23 から `git blame` のオプションに `--ignore-rev` オプションが追加されました。このオプションでコミットハッシュを指定することで、そのコミットを `git blame` の結果から除外できます。

```bash
git blame --ignore-revs-file --ignore-rev <sha1>
```

ですが、毎回 `git blame` を実行する際にコミットハッシュを指定するのは面倒です。そこで、`--ignore-revs-file` オプションを使うことで、除外するコミットをファイルに記述しておくことができます。このファイル名は任意ですが、`.git-blame-ignore-revs` という名前を指定することが一般的です。この命名規則に従うことで、GitHun の UI 上でもコミットを除外できるようになるというメリットがあります。

```sh:.git-blame-ignore-revs
# 複数のコミットを指定する場合は改行で区切る
<sha1>
<sha1>
```

```bash
git blame --ignore-revs-file .git-blame-ignore-revs
```

## GitLens で `--ignore-revs-file` オプションを使う

`git blame` コマンドの実行時に `--ignore-revs-file` オプションを使うことで特定のコミットを結果から除外できることがわかりました。GitLens の設定で `git blame` の実行時に `--ignore-revs-file` オプションを使うように設定する必要があります。

`gitlens.advanced.blame.customArguments` の設定により、`git blame` の実行時に任意のオプションを指定できます。

```json:.vscode/settings.json
{
  "gitlens.advanced.blame.customArguments": [
    "--ignore-revs-file", ".git-blame-ignore-revs"
  ]
}
```

これで、GitLens で特定のコミットを除外することができるようになりました。
