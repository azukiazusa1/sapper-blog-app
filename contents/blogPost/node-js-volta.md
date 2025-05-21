---
id: 6duFGtubCCQEqTmPEonmDL
title: "Node.js のバージョン管理には Volta がよい"
slug: "node-js-volta"
about: "皆さん Node.js のバージョン管理ツールには何を使っておりますでしょうか？上記の中でも私がオススメするのは [volta](https://volta.sh/) です。volta は 1.0 がリリースされたのが2020年12月と比較的新しいツールです。"
createdAt: "2022-04-17T00:00+09:00"
updatedAt: "2022-04-17T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4z6cPW6RU0f0O22jxIVINl/7c4bc80d99a5ad11e02d1cc83b42a2b5/articles_2FmDVbWFeXeln9BJXqBa76_2F027ab8d7dc7cdb4ab9c09c0a057af2e7.png"
  title: "Node.js"
audio: null
selfAssessment: null
published: true
---
皆さん Node.js のバージョン管理ツールには何を使っておりますでしょうか？私が知る限りにおいてもこれだけの選択肢が存在します。

- nodist
- n
- nodebrew
- nodeenv
- nvm
- volta

上記の中でも私がオススメするのは [volta](https://volta.sh/) です。volta は 1.0 がリリースされたのが 2020 年 12 月と比較的新しいツールです。

volta には以下のような特徴があります。

- 早いインストール：Rust で作成されているツールだけあって素早く異なるバージョンの Node.js をインストールできます
- プロジェクトのバージョンの固定：volta により Node.js とパッケージマネージャー（npm, yarn）のバージョンをプロジェクトで固定し、ディレクトリを移動するたびにシームレスにバージョンを変更できます。

## インストール

volta をインストールする間にすでに他のバージョン管理ツールを使用している場合には始めにアンインストールしておきましょう。例として、私は nodebrew を使用していたので以下コマンドでアンインストールします。

```sh
$ brew uninstall nodebrew
```

続いて以下コマンドで volta をインストールします。

```sh
$ curl https://get.volta.sh | bash
```

私が上記コマンドを実施した際には証明書エラーが発生してしまったので変わりに以下の手順を実施しました。

https://github.com/volta-cli/volta/issues/1035#issuecomment-948904947

1. `-k` オプションを付与して `curl` コマンドを実行してスクリプトをローカルに落とす

```sh
$ curl -k https://get.volta.sh > volta.sh
```

2. `volta.sh` ファイルの `get_latest_relase` 関数を `-k` オプションを付与するように修正する

```diff
  get_latest_release() {
-   curl -- slient "https://volta.sh/latest-version"
+   curl -k  --silent "https://volta.sh/latest-version"
  }
```

3. `volta.sh` ファイルを実行する

```sh
$ chmod +x volta.sh
$ ./volta.sh
```

`volta` コマンドが使用可能か確認してみましょう。

```sh
$ volta -v
1.0.6
```

## 特定のバージョンの Node.js をインストールする

それでは volta を使用してみましょう。以下のコマンドでは `14.15.5` バージョンの Node.js をインストールします。

```sh
$ volta install node@14.15.5
success: installed and set node@14.15.5 (with npm@6.14.11) as default
$ node -v
v14.15.5
```

次のようにメジャーバージョンの最新をインストールすることもできます。

```sh
$ volta install node@16
success: installed and set node@16.14.2 (with npm@8.5.0) as default
$ node -v
v16.14.2
```

## プロジェクトの Node.js のバージョンを固定する

`volta pin` コマンドを使用すればそのプロジェクトで使用する Node.js のバージョンの指定してディレクトリを移動した際に自動で指定のバージョンをインストールします。これにより、チームで使用するツールを標準化できます。

例えば、以下のようなディレクトリの構成となっていいるとします。

```sh
$ tree
.
├── project-a
│   └── package.json
├── project-b
│   └── package.json
└── project-c
    └── package.json
```

`project-a` ディレクトリに移動して `volta pin` コマンドにより使用するバージョンとパッケージマネージャーをこていすることができます。

```sh
$ volta pin node@12
$ volta pin yarn@1
```

`package.json` には次のように追記されます。

```sh
  "volta": {
    "node": "12.22.12",
    "yarn": "1.22.18"
  }
```

続いて `project-b`、`project-c` でも同様の手順でバージョンを固定します。そうすると、ディレクトリを移動するたびに Node.js のバージョンが変更されるようになります。

```sh
$ cd project-a
$ node -v
v12.22.12
$ cd ../project-b
$ node -v
v14.19.1
$ cd ../project-c
$ node -v
v16.14.2
```

欠点としては、プロジェクトの開発者全員が volta を使用していなければいけないところです。例えば `node-version` というファイルであれば複数の Node.js バージョン管理ツールに対応しています。
