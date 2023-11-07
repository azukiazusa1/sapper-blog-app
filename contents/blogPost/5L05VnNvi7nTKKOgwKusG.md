---
id: 5L05VnNvi7nTKKOgwKusG
title: "パッケージマネージャーを npm に移行するときには `npm install --package-lock-only` コマンドを使うとよい"
slug: "use-the-npm-install-package-lock-only-command-when-migrating-package-managers-to-npm"
about: "既存のプロジェクトで npm に移行する際に `npm install --package-lock-only` を使うことで、依存パッケージのバージョンを変更することなく lock ファイルを移行できます。"
createdAt: "2023-11-07T19:40+09:00"
updatedAt: "2023-11-07T19:40+09:00"
tags: ["npm"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7LZpgl7jmdtB93nBs7HB98/49ead821e5e3b8c7468e4d6b05b28631/myouga_17117.png"
  title: "みょうがのイラスト"
published: true
---

既存のプロジェクトでパッケージマネージャーを移行する時に問題になるのが lock ファイルの互換性です。現在 JavaScript の主要なパッケージマネージャーには npm, yarn, pnpm がありますが、それぞれが独自の lock ファイルを持っています。

そのため、例えば yarn から npm に移行する場合、lock ファイルを削除して `npm install` すると、依存パッケージのバージョンが変わってしまう可能性があります。

yarn と pnpm にはそれぞれ [yarn import](https://chore-update--yarnpkg.netlify.app/ja/docs/cli/import) と [pnpm import](https://pnpm.io/cli/import) というコマンドがあり、これを使うと lock ファイルを移行できます。

npm においては同等のコマンドとして [--package-lock-only](https://docs.npmjs.com/cli/v10/commands/npm-install#package-lock-only) オプションが用意されています。このオプションは `npm install` 時に lock ファイルを更新するだけで、依存パッケージのインストールは行いません。つまり、現在の `node_modules` の状態に応じて `pakcage-lock.json` を生成してくれるのです。

```sh
npm install --package-lock-only
```

これにより、既存のプロジェクトで npm に移行する際にも、依存パッケージのバージョンを変更することなく lock ファイルを移行できます。
