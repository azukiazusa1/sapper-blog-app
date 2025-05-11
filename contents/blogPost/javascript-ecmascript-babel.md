---
id: 6pP5qAC7eMScXMRCGkIvrU
title: "JavaScript ECMAScriptとかBabelとか"
slug: "javascript-ecmascript-babel"
about: "JavaScript ECMAScriptとかBabelとか"
createdAt: "2020-05-01T00:00+09:00"
updatedAt: "2020-05-01T00:00+09:00"
tags: ["", "", "ECMAScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5M2RoZuZzlA5Ggjw2MAC7G/f3a589f1ae9233bd33513c543081ffe7/articles_2FExMf3LZ9RYwcpYcPL9Oy_2Fthumbnail_7D.png"
  title: "babel"
audio: null
selfAssessment: null
published: true
---
# ECMAScrit仕様

**ECMAScript**とは、JavaScript の標準規格です。
その仕様に改訂にあたって版（edition）が更新されていきます。
1997 年に初版（ECMAScritp First Edition）が公開され、1998 年には ES2 が 1999 年には ES3 が公開されました。

ES4 では、クラスやインターフェースなどを含めた新しい概念がいろいろ追加される予定でしたが、これは破棄されました。
そして、2009 年になりようやく ECMAScritp Fifth Edition(ES5)として公開されました。strict モードや getter,setter などが追加されましたが、ES4 で追加予定の多くの機能は実装されず、小規模な改善にとどまりました。

さらに時は流れ、2015 年になり、ECMAScript Sixth Edition(ES6)が公開されました。これは、15 年間で最初の大きな改訂となります。
let、const、クラス、モジュール、アロー関数、分割代入、など多くの新しい機能が追加されました。

そして、ES6 は毎年新しいバージョンをリリースするという当初の構成に合わせて、**ES2015**に解明されます。
現在は、毎年 ECMAScript は改定され、ES2019 が公開されています。

# だれがどのようにESMAScritpの仕様を決めるか
ECMAScripr 仕様の開発と管理は、Ecma International の**TC39**というタスクグループが担当しています。TC39 のメンバーは、MOzilla、Google、Microsoft、Apple といった、Web ブラウザを構築している企業で構成されています。

ECMAScript の仕様に追加される機能は、ステージ 0 からステージ 4 までの 5 つのステージで審議されます。

- ステージ 0（ストローマン）
- ステージ 1（プロポーザル）
- ステージ 2（ドラフト）
- ステージ 3（キャンディート）
- ステージ 4（フィニッシュ）

JavaScript の新しい機能を試してみたと思ったときには、Babel などのツールを使用してステージングを選択して利用できます。

ステージ 3 以降は変更があったとしてもごくわずかであるため使用するのは、安全だと考えられますが。それよりも下のステージは将来機能が変更になったり、撤回される可能性があります。

# Babelとは
JavaScript の仕様の改訂について説明しました。現在は毎年仕様が改訂されていますが、その更新がすぐにブラウザに反映されるわけではありません。
だからといって、新しい機能をブラウザがサポートするのをまっているわけにはいきません。
そこで、新しい構文（ESNext)を、ほぼすべてのブラウザがサポートしている（ES5)に変換する（トランスパイル）しようということになりました。
それをサポートするのが、Babel というツールというわけです。

ちなみに、Babel はかつて ES6 のコードを ES5 にトランスパイルしていたので ES6to5 と呼ばれていました。その後 JavaScript の将来の機能をすべてサポートするようになったことや、ES6 の名前が正式に ES2015 に変更されたことを受けて、プロジェクト名を ES6to5 から Babel に変更することになちました。

# Babelをセットアップする
Babel のインストールには npm が必要です。
Babel を使用する新しいディレクトリを作成して、`npm init` でプロジェクトを初期化します。

```
mkdir my-project
cd my-project
npm init -y
```

すると、ルート配下に `package.json` が作成されます。

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

次に、Babel のコマンドラインインターフェースをインストールします。
今回は Babel7 をインストールします。

```
npm install @babel/core --save-dev
npm install @babel/cli --save-dev
```

しかし、バージョン 6 以降の Babel では、デフォルトでは何も変換されません。
変換を有効にするには、そのためのプリセットをインストールして、そのプリセットを使用することを Babel の構成で指定する必要があります。

Babek の構成には `.babelrc` というファイルを使用します。
これをプロジェクトのルート配下に配置します。

```
touch .babelrc
```

これを次のように編集します。

```json
{
  "presets": ["@babel/preset-env"]
}
```

プリセットには `babel-preset-env` を指定しました。
`babel-preset-env` は、ターゲットのブラウザ、環境に合わせて自動で Babel プラグインを決定してくれるものです。
Babel7 では、以前使用されていて `babel-preset-es2015` などの年号プリセットは非推奨となっています。

次に、`babel-preset-env` をインストールします。

```
npm install @babel/preset-env --save-dev
```

最後に、Babel コマンドを `npm script` としてセットアップします。
npm script とは、`package.json` の `script` に書いてあるやつです。

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

npm script には、シェルコマンドを定義でき、エイリアスのように使うことができます。
Babel でトランスパイルするコマンドを定義しておきましょう。

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "babel src -d dist"
  },
```

`src` フォルダのファイルを、`dist` フォルダに出力する、という感じです。
"test"の行末にセミコロンを追加することを忘れないようにしてください。

実行するときには、`npm run build` とコマンドを打ちます。

これでトランスパイルする準備は完了しました。
プロジェクトに `src` フォルダを追加して、このフォルダに `index.js` ファイルを追加します。

```
mkdir src
touch src/index.js
```

`index.js` の中身で、ES2015 の構文であるアロー関数、const を使用しています。

```js
const plus = (num1, num2) => num1 + num2

console.log(plus(1, 1))
```

これをトランスパイルしてみます。

```
npm run build
```

`dist` フォルダが作成され、その中にトランスパイルされたコードが含まれています。
確かに、ES5 の構文に変換されています。

```js
"use strict";

var plus = function plus(num1, num2) {
  return num1 + num2;
};

console.log(plus(1, 1));
```

また実行結果に違いはありません。

```
node src/index
2
node dist/index
2
```

しかし、Babel だけでは不十分で、モジュール化されたファイルをトランスパイルすることはできません。
モジュール化されたファイルを 1 つのファイルに**バンドル**する必要があります。
JavaScript のモジュールをバンドルするツールとしてよく使われているのが、Webpack や Browserify です。
