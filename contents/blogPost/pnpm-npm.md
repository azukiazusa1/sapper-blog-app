---
id: 21m6Mbo9Gc0VggBtwFJ1iz
title: "pnpm は npm と何が違うのか"
slug: "pnpm-npm"
about: "pnpm は npm、yarn と並ぶ JavaScript のパッケージマネージャーです。pnpm と言う名前は「performant npm」に由来します。"
createdAt: "2022-07-24T00:00+09:00"
updatedAt: "2022-07-24T00:00+09:00"
tags: ["pnpm"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3SMzFbXXLHrhxkFBSv9fQf/1aed4069c1a0706129bf5d64d9a57163/pnpm-standard-79c9dbb2e99b8525ae55174580061e1b.svg"
  title: "pnpm"
audio: null
selfAssessment: null
published: true
---
pnpm は [npm](https://www.npmjs.com/)、[yarn](https://yarnpkg.com/) と並ぶ JavaScript のパッケージマネージャーです。pnpm と言う名前は「performant npm」に由来します。

https://pnpm.io/ja/

npm と互換性を持ち、以下のような特徴があります。

- 他のツールと比較して最大 2 倍高速
- ディスク容量を効率化
- 厳格なパッケージ管理で、`package.json` に記載のあるものにしかアクセスできない

## pnpm を始める

pnpm は以下のコマンドからインストールできます。

```sh
# macOS or Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -
# Windows (PowerShell) 
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

または、npm を使用してインストールできます。

```sh
npm install -g pnpm
```

pnpm のインストールが完了したら、試しに [express](https://www.npmjs.com/package/express) をインストールしてみましょう。パッケージをインストールするには `pnpm install <パッケージ名>` コマンドを実行します。

```sh
pnpm install express
Packages: +57
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: ~/Library/pnpm/store/v3
  Virtual store is at:             node_modules/.pnpm
Progress: resolved 61, reused 0, downloaded 57, added 57, done

dependencies:
+ express 4.18.1
```

### ディスク容量が節約された node_modules

「Packages are hard linked from the content-addressable store to the virtual store.」と表示されているとおり、パッケージの実態ファイルはすべてグローバルに管理される Content-addressable store（コンテンツ探索可能なストア）に配置されます。MacOS では `~/Library/pnpm/store/v3` がデフォルトの配置場所となります。`node_modules` に存在するすべてのパッケージに含まれるファイルはコンテンツストアへのハードリンクです。

すべてのパッケージについて `node_moduels` にハードリンクを作成したら、入れ子になった依存関係のグラフ構造を反映するシンボリックリンクを作成します。

実際に、`node_modules` ディレクトリは以下のようになっています。

```
node_modules/
└── .pnpm/
    └── body-parser@1.20.0
      └── node_modules
          ├── body-parser
          │   ├── index.js
          │   └── package.json
          ├── bytes -> ../../bytes@3.1.2/node_modules/bytes
          ├── content-type -> ../../content-type@1.0.4/node_modules/content-
          └── unpipe -> ../../unpipe@1.0.0/node_modules/unpipe
    └── express@4.18.1
      └── node_modules
          ├── body-parser -> ../../body-parser@1.20.0/node_modules/body-parser
          └── express/
├── express -> .pnpm/express@4.18.1/node_modules/express
└── .modules.yaml
```

このように、npm や yarn と異なりパッケージはすべてコンテンツ探索可能なストアに格納されるので、異なるプロジェクト間で同じバージョンのパッケージがある場合共有できます。そのため、ディスク容量を節約と、インストールの高層化が実現できます。

### 厳格なパッケージ管理

普段使用されている npm と異なり、`node_moduels` 配下が奇妙な構造になっていることに気づいたでしょうか？pnpm は npm や yarn が採用しているフラットな `node_moduels` の構造を採用していません。参考に、npm の生成する `node_moduels` は以下のようになります。

```
node_modules/
├── body-parser
│   ├── index.js
│   └── package.json
├── express
│   ├── index.js
│   └── package.json
```

上記のように、npm の生成する `node_modules` は直下にすべてのパッケージを配置しています。一方で、pnpm の場合には `node_modules` 直下に配置されているのは `express` のシンボリックリンクのみです。なぜなら、`package.json` の `dependencies` には `express` しか記載していないからです。つまり、アプリケーションコードから直接アクセスできるパッケージは `express` だけということになります。

このことは、pnpm が厳格であることを表しています。

pnpm の厳格さを証明するために、実験をしてみましょう。まずは npm で `express` をインストールしたプロジェクトで以下のようなコードを作成します。

```js:npm-repo/index.mjs
import bodyParser from "body-parser";
import assert from "node:assert/strict";

assert.ok(bodyParser);
```

`body-parser` は直接インストールしたパッケージでないにも関わらず、`import` に成功して問題なくこのコードを実行できます。このように、フラットな構造の `node_modules` の場合には当該パッケージを直接インストールしていなくても、`express` が依存しているパッケージであればアクセスすることが可能です。

しかし、この挙動は次のような場合に問題になる可能性があります。

- `express` のパッチバージョンアップで `body-parser` がメジャーバージョンアップされた
  - 例えば、現在使用している `body-parser` のバージョンが 1.x でそのことを前提としてコードが書かれており、`body-parser` のバージョン 2.x が公開されたとします。しばらくの間は問題にならないのですが、`experss` のパッチバージョンアップで `express` が `body-parser` の 2.x を使用するように修正されたとしましょう。パッチバージョンアップなので、`express` 自体には破壊的変更はないはずですが、次回以降の `npm install` で `body-parser` の 2.0 が `node_modules` に配置されるようになります。これにより、何もしていないのも関わらず、`body-parser` に依存しているコードが壊れていまう可能性があります。
- `express` のパッチバージョンアップで `body-parser` に依存しなくなった
  - 前述の例と同じように、`experss` がもはや `body-parser` に依存しなくなると `node_modules` に `body-parser` が配置されることはありません。この場合もまた `body-parser` に依存するコードは壊れてしまいます。

上記のような問題を防ぐ唯一の方法は、`body-parser` もまた明示的にインストールして使用することです。

一方 pnpm の場合はどうでしょう。さきほどと全く同じコードを実行しています。

```js:pnpm-repo/index.mjs
import bodyParser from "body-parser";
import assert from "node:assert/strict";

assert.ok(bodyParser);
```

結果として、モジュールが存在しないというエラーが表示されます。なぜなら、`body-parser` は `package.json` の `dependencies` に記載されていないため `node_modules` 直下には配置されておらず、`node_modules/.pnpm` 配下に存在するためです。

```
$ node index.mjs 
node:internal/errors:465
    ErrorCaptureStackTrace(err);
    ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'body-parser' imported from /work/pnpm-test/pnpm-repo/index.mjs
    at new NodeError (node:internal/errors:372:5)
    at packageResolve (node:internal/modules/esm/resolve:954:9)
    at moduleResolve (node:internal/modules/esm/resolve:1003:20)
    at defaultResolve (node:internal/modules/esm/resolve:1218:11)
    at ESMLoader.resolve (node:internal/modules/esm/loader:580:30)
    at ESMLoader.getModuleJob (node:internal/modules/esm/loader:294:18)
    at ModuleWrap.<anonymous> (node:internal/modules/esm/module_job:80:40)
    at link (node:internal/modules/esm/module_job:78:36) {
  code: 'ERR_MODULE_NOT_FOUND'
}
```

これを解決するには `body-parser` をインストールすればよいのです。

```sh
pnpm install body-parser
```

## パフォーマンス

`npm`、`yarn`、`Yarn PnP` と比較した pnpm のベンチマークが存在します。この結果を見る限り、確かに pnpm は非常に高速にパッケージをインストールできることがわかります。

![スクリーンショット 2022-07-24 17.22.10 1](//images.ctfassets.net/in6v9lxmm5c8/KUlLE11E4uK2hq2BbD8BG/a802fff990e4e8324f1234b632d5f35b/____________________________2022-07-24_17.22.10_1.png)

https://pnpm.io/benchmarks

また Yarn が公開しているベンチマークも確認できます。こちらも同様に pnpm が良い結果を残しています。

![スクリーンショット 2022-07-24 17.25.42](//images.ctfassets.net/in6v9lxmm5c8/2x2bjDHwP3rAnRwzEKOsO0/da986bb780ee2e9a0e80a2c68dffe6cf/____________________________2022-07-24_17.25.42.png)

https://p.datadoghq.eu/sb/d2wdprp9uki7gfks-c562c42f4dfd0ade4885690fa719c818?tpl_var_npm=%2A&tpl_var_pnpm=%2A&tpl_var_yarn-classic=%2A&tpl_var_yarn-modern=%2A&tpl_var_yarn-nm=%2A&tpl_var_yarn-pnpm=no&from_ts=1658478221525&to_ts=1658651021525&live=true

## 感想

pnpm はその他のパッケージマネージャーと `node_modules` の構造が大きく異なるのが特徴ですね。パッケージマネージャーにより厳格な管理ができるのが興味深いポイントです。
