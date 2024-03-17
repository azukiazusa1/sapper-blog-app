---
id: a4uZuFp4AHnHZcgCoLN3H
title: "pnpm でパッケージにパッチを当てる"
slug: "pnpm-patch"
about: "`pnpm patch` コマンドを使うと、依存パッケージのコードを直接書き換えることができます。"
createdAt: "2023-07-01T14:37+09:00"
updatedAt: "2023-07-01T14:37+09:00"
tags: ["pnpm"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4W0CyRHD4pEMDDGjyFl3iz/5f4531162591220d474df7a97f15d8af/flower_mizubashou_16637.png"
  title: "水芭蕉"
selfAssessment: null
published: true
---
[pnpm patch](https://pnpm.io/ja/cli/patch) コマンドを使うと、依存パッケージのコードを直接書き換えることができます。例えば依存パッケージにバグがあった場合、プルリクエストを送って修正を提案する方法が最適ですが、提案した修正がマージされるまでタイムラグがあるでしょう。今すぐにバグを回避したい場合には、一時的に依存パッケージを直接修正する方法を取ることになるでしょう。

ですが `node_modules` ディレクトリ中のソースコードに直接修正を加えると、新たなパッケージを追加する目的などで `npm install` コマンドを実行したタイミングで修正内容が消えてしまいます。また、一般的に `node_modules` ディレクトリは git の管理下に置かれていないため、修正したパッケージをバージョン管理できません。

`pnpm patch` コマンドを使うと修正した内容は `patches` ディレクトリで管理されるため、上記のような問題を回避できます。

## 使い方

例として [is-odd](https://www.npmjs.com/package/is-odd) パッケージの `isOdd` 関数の挙動を変更してみます。引数に文字列の数字（例: `"1"`）を渡した場合に例外を投げるようにします。

まず、`is-odd` パッケージをインストールします。

```sh
pnpm install is-odd
```

続いて `pnpm patch <pkg>` コマンドを実行します。`<pkg>` は修正したいパッケージの名前を指定します。

```sh
pnpm patch is-odd
```

このコマンドを実行すると一時ディレクトリにパッケージが展開されます。私の環境で実行した場合、`/private/var/folders/39/htskyvkd6vg8ck_hc87n9ck40000gn/T/ecaff011e92c1418ee41d41dce2a3f0b/user` というディレクトリに展開されました。

```sh
pnpm patch is-odd
You can now edit the following folder: /private/var/folders/39/htskyvkd6vg8ck_hc87n9ck40000gn/T/ecaff011e92c1418ee41d41dce2a3f0b/user
```

コンソールに表示された一時ディレクトリに移動して、`index.js` ファイルを修正します。

```diff:index.js
  /*!
   * is-odd <https://github.com/jonschlinkert/is-odd>
   *
   * Copyright (c) 2015-2017, Jon Schlinkert.
   * Released under the MIT License.
   */

  'use strict';

  const isNumber = require('is-number');

  module.exports = function isOdd(value) {
+   if (typeof value !== 'number') {
+     throw new TypeError('expected a number');
+   }
    const n = Math.abs(value);
    if (!isNumber(n)) {
      throw new TypeError('expected a number');
    }
    if (!Number.isInteger(n)) {
      throw new Error('expected an integer');
    }
    if (!Number.isSafeInteger(n)) {
      throw new Error('value exceeds maximum safe integer');
    }
    return (n % 2) === 1;
  };
```

修正が完了したら、`pnpm patch-commit <path>` コマンドを実行してパッチファイルを生成します。`<path>` は先程修正した一時ディレクトリのパスを指定します。

```sh
pnpm patch-commit /private/var/folders/39/htskyvkd6vg8ck_hc87n9ck40000gn/T/ecaff011e92c1418ee41d41dce2a3f0b/user
```

コマンドを実行すると `patches` ディレクトリが生成され、`is-odd@3.0.1.patch` というパッチファイルが配置されます。

```patch:is-odd@3.0.1.patch
diff --git a/index.js b/index.js
index 79d1f22a8e7a27efb8841bb83cb682ea1ff3a59c..af66fefe7a0292163d1269c2276bc2a245a5bedc 100644
--- a/index.js
+++ b/index.js
@@ -10,6 +10,9 @@
 const isNumber = require('is-number');
 
 module.exports = function isOdd(value) {
+  if (typeof value !== 'number') {
+    throw new TypeError('expected a number');
+  }
   const n = Math.abs(value);
   if (!isNumber(n)) {
     throw new TypeError('expected a number');
```

また、`packges.json` ファイルでは [patchedDependencies](https://pnpm.io/ja/package_json#pnpmpatcheddependencies) フィールドが追加されていて、パッチファイルのパスが指定されています。このフィールドにより指定したパッケージがパッチファイルを適用すべきことが `pnpm` に伝えられます。

```json:package.json
{
  "dependencies": {
    "is-odd": "^3.0.1"
  },
  "pnpm": {
    "patchedDependencies": {
      "is-odd@3.0.1": "patches/is-odd@3.0.1.patch"
    }
  }
}
```

`pnpm patch-commit` コマンドを実行したあとは `pnpm install` コマンドを実行することなく、即座に修正内容が適用されます。`main.js` ファイルを作成して試してみましょう。

```js:main.js
import isOdd from "is-odd";

console.log(isOdd("1"));
```

このファイルを実行すると、例外が投げられることが確認できます。

```sh
node main.js 
/node_modules/.pnpm/is-odd@3.0.1_4wdwvtmrrmomug63a56tqryyhy/node_modules/is-odd/index.js:14
    throw new TypeError('expected a number');
          ^
TypeError: expected a number
```
