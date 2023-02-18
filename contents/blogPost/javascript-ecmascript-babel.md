---
id: 6pP5qAC7eMScXMRCGkIvrU
title: "JavaScript ECMAScriptとかBabelとか"
slug: "javascript-ecmascript-babel"
about: "JavaScript ECMAScriptとかBabelとか"
createdAt: "2020-05-01T00:00+09:00"
updatedAt: "2020-05-01T00:00+09:00"
tags: ["JavaScript", "Babel", "ECMAScript"]
published: true
---
入門JavaScriptプログラミング
# ECMAScrit仕様

**ECMAScript**とは、JavaScriptの標準規格です。
その仕様に改訂にあたって版(edition)が更新されていきます。
1997年に初版(ECMAScritp First Edition)が公開され、1998年にはES2が1999年にはES3が公開されました。

ES4では、クラスやインターフェースなどを含めた新しい概念がいろいろ追加される予定でしたが、これは破棄されました。
そして、2009年になりようやくECMAScritp Fifth Edition(ES5)として公開されました。strictモードやgetter,setterなどが追加されましたが、ES4で追加予定の多くの機能は実装されず、小規模な改善にとどまりました。

さらに時は流れ、2015年になり、ECMAScript Sixth Edition(ES6)が公開されました。これは、15年間で最初の大きな改訂となります。
let、const、クラス、モジュール、アロー関数、分割代入、などなど多くの新しい機能が追加されました。

そして、ES6は毎年新しいバージョンをリリースするという当初の構成に合わせて、**ES2015**に解明されます。
現在は、毎年ECMAScriptは改定され、ES2019が公開されています。

# だれがどのようにESMAScritpの仕様を決めるか
ECMAScripr仕様の開発と管理は、Ecma Internationalの**TC39**というタスクグループが担当しています。TC39のメンバーは、MOzilla、Google、Microsoft、Appleといった、Webブラウザを構築している企業で構成されています。

ECMAScriptの仕様に追加される機能は、ステージ0からステージ4までの5つのステージで審議されます。

- ステージ０(ストローマン)
- ステージ1(プロポーザル)
- ステージ2(ドラフト)
- ステージ3(キャンディート)
- ステージ4(フィニッシュ)

JavaScriptの新しい機能を試してみたと思ったときには、Babelなどのツールを使用してステージングを選択して利用することができます。

ステージ3以降は変更があったとしてもごくわずかであるため使用するのは、安全だと考えられますが。それよりも下のステージは将来機能が変更になったり、撤回される可能性があります。

# Babelとは
JavaScriptの仕様の改訂について説明しました。現在は毎年仕様が改訂されていますが、その更新がすぐにブラウザに反映されるわけではありません。
だからといって、新しい機能をブラウザがサポートするのをまっているわけにはいきません。
そこで、新しい構文(ESNext)を、ほぼすべてのブラウザがサポートしている(ES5)に変換する(トランスパイル)しようということになりました。
それをサポートするのが、Babelというツールというわけです。

ちなみに、BabelはかつてES6のコードをES5にトランスパイルしていたのでES6to5と呼ばれていました。その後JavaScriptの将来の機能を全てサポートするようになったことや、ES6の名前が正式にES2015に変更されたことを受けて、プロジェクト名をES6to5からBabelに変更することになちました。

# Babelをセットアップする
Babelのインストールにはnpmが必要です。
Babelを使用する新しいディレクトリを作成して、`npm init`でプロジェクトを初期化します。

```
mkdir my-project
cd my-project
npm init -y
```

すると、ルート配下に`package.json`が作成されます。

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

次に、Babelのコマンドラインインターフェースをインストールします。
今回はBabel7をインストールします。

```
npm install @babel/core --save-dev
npm install @babel/cli --save-dev
```

しかし、バージョン6以降のBabelでは、デフォルトでは何も変換されません。
変換を有効にするには、そのためのプリセットをインストールして、そのプリセットを使用することをBabelの構成で指定する必要があります。

Babekの構成には`.babelrc`というファイルを使用します。
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

プリセットには`babel-preset-env`を指定しました。
`babel-preset-env`は、ターゲットのブラウザ、環境に合わせて自動でBabelプラグインを決定してくれるものです。
Babel7では、以前使用されていて`babel-preset-es2015`などの年号プリセットは非推奨となっています。

次に、`babel-preset-env`をインストールします。

```
npm install @babel/preset-env --save-dev
```

最後に、Babelコマンドを`npm script`としてセットアップします。
npm scriptとは、`package.json`の`script`に書いてあるやつです。

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

npm scriptには、シェルコマンドを定義することができ、エイリアスのように使うことができます。
Babelでトランスパイルするコマンドを定義しておきましょう。

```json
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "babel src -d dist"
  },
```

`src`フォルダのファイルを、`dist`フォルダに出力する、という感じです。
"test"の行末にセミコロンを追加することを忘れないようにしてください。

実行するときには、`npm run build`とコマンドを打ちます。

これでトランスパイルする準備は完了しました。
プロジェクトに`src`フォルダを追加して、このフォルダに`index.js`ファイルを追加します。

```
mkdir src
touch src/index.js
```

`index.js`の中身で、ES2015の構文であるアロー関数、constを使用しています。

```js
const plus = (num1, num2) => num1 + num2

console.log(plus(1, 1))
```

これをトランスパイルしてみます。

```
npm run build
```

`dist`フォルダが作成され、その中にトランスパイルされたコードが含まれています。
確かに、ES5の構文に変換されています。

```js
"use strict";

var plus = function plus(num1, num2) {
  return num1 + num2;
};

console.log(plus(1, 1));
```

また、実行結果に違いはありません。

```
node src/index
2
node dist/index
2
```

しかし、Babelだけでは不十分で、モジュール化されたファイルをトランスパイルすることはできません。
モジュール化されたファイルを1つのファイルに**バンドル**する必要があります。
JavaScriptのモジュールをバンドルするツールとしてよく使われているのが、WebpackやBrowserifyです。

