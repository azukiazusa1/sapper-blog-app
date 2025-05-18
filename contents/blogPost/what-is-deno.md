---
id: 4mp2mdjvbhK1WWbSwwDffE
title: "Denoとはなにか - 実際に使ってみる"
slug: "what-is-deno"
about: "Denoは、Node.jsの製作者であるRyan Dahlによって作られた、新しいJS/TSランタイムです。簡単に説明すると、Node.jsのイケてなかったところを改良したものがDenoになります。"
createdAt: "2020-05-17T00:00+09:00"
updatedAt: "2020-05-17T00:00+09:00"
tags: ["", "", "Node.js"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6fPJ5Ah5oHsWbvScuggrCh/899629af347facfc74e95006dae6b617/deno.png"
  title: "Deno"
audio: null
selfAssessment: null
published: true
---
# はじめに
`Deno` というものが面白そうだったので、これを書きたいと思います。

# Denoとはなにか
![deno.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FF2z5J7aePghFMh2hqfVK%2Fc5f6e76283924635826976de979b2243.png?alt=media&token=9dd400da-b863-4435-b486-58bc8fc259e3)

↑かわいい。

[Deno(ディーノ)](https://deno.land/)という名前について、聞いたことがありますでしょうか。私も最近まで知りませんでしたが、実は v1.0 がリリースされたのが 2020/5/13 とごく最近のことです。開発自体は 2 年前から行われておりましたが、結構新しめの技術です。
その証拠（?）に[Denoでググる](https://www.google.com/search?q=deno&sxsrf=ALeKk0123LZ8I95_5DE5Mjms6B7ZSrcAPw:1589727721603&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiBw4qhlbvpAhWO-mEKHchCDxYQ_AUoBHoECBUQBg&biw=1440&bih=717)と担々麺ばっかりでてきます。（2019/5/18 現在）

![スクリーンショット 20200518 0.02.53.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FF2z5J7aePghFMh2hqfVK%2F0d8f32bffa9a2ca42846152a503a9f6d.png?alt=media&token=6a3ce549-6d1c-4a39-9bf5-5edce64982b1)

## 結局Denoってなんなの？
`Deno` は、`Node.js` の製作者である Ryan Dahl によって作られた、新しい JS/TS ランタイムです。すっごい雑に説明すると、`Node.js` のイケてなかったところを改良したものが `Deno` になります。`Deno` って文字を並べ替えると `Node` になりますね。

```js
const deno = 'node'.split('').sort().join('')
```

## Denoがつくられた背景
`Deno` は JSConf EU 2018 での Ryan Dahl による講演「Node.js に関する 10 の反省点」において発表されました。

[10 Things I Regret About Node.js - Ryan Dahl - JSConf EU](https://www.youtube.com/watch?v=M3BM9TB-8yA&t=1319s)
[Node.js における設計ミス By Ryan Dahl](https://yosuke-furukawa.hatenablog.com/entry/2018/06/07/080335)

Ryan Dahl は講演の中で、自身が開発した `Node.js` における 10 個の後悔している点について言及しました。それらの設計ミスに基づいて開発されたのが、`Deno` です。

# 実際にDenoを使ってみる🦕
なにはともあれ、実際に `Deno` を使ってみて `Node.js` との違いについて見ていきましょう。

## インストール
まずは[インストール](https://deno.land/#installation)をします。私は Mac を使っているので、`Homebrew` を使用してインストールしました。

```sh
$ brew install deno
```

以下のコマンドで正しくインストールされたか確認してみましょう。

```sh
$ deno -V
deno 1.0.0
```

## Denoを実行する
`Deno` を簡単に実行してみるために、公式のサンプルコードを利用してみます。

```sh
$ deno run https://deno.land/std/examples/welcome.ts
Download https://deno.land/std/examples/welcome.ts
Warning Implicitly using master branch https://deno.land/std/examples/welcome.ts
Compile https://deno.land/std/examples/welcome.ts
Welcome to Deno 🦕
```

恐竜さんが出てきました。可愛いですね🦕。

2 回目以降の動作は、初回と変わってきます。

```sh
$ deno run https://deno.land/std/examples/welcome.ts
Welcome to Deno 🦕
```

`Download` や `Compile` などの行がなくなっていますね。
今回のように、リモートの URL を実行した場合にはローカルにキャッシュされ 2 回目以降は素早く実行できます。
これは後ほど出てくる `import` でパッケージを読み込むときと同じです。

### 変更点1　TypeScriptをそのままサポート
さきほど実行したプログラム自体はとても簡単なものでしたが、早速 `Node.js` との変更点が含まれています。
さきほど実行したプログラム `https://deno.land/std/examples/welcome.ts` の拡張子を見ると、`TypeScript` のコードであることがわかります。
従来では `TypeScript` を実行するには、`npm` でインストールして、ルート配下に `tsconfig.json` を設置して、コンパイルして。といった作業が必要でした。
しかし、`Deno` ならそのような設定はすべて必要ありません。デフォルトで `TypeScript` をサポートしているので、そのまま実行できます。

## サンプルコードを見てみる
簡単なプログラムだけではつまらないので、次はローカルにサーバーを立ててみます。以下のコードは公式サイトからのコピペで持ってきました。
8000 ポートでサーバーを立てて、Hello World と表示させます。

```js:server.js
import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
const s = serve({ port: 8000 });
console.log("http://localhost:8000/");
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
```

次に、下記のコードが `Node.js` で書いた同じようなコードです。

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.end('Hello World');
});

server.listen(8000)
```

この 2 つのコードを比べていきましょう。

### 変更点2 npmがない

と、先にコードの方を提出しましたが、その前にやることがありましたね。
まずは `npm init` で `package.json` を作ってそれから。.。えっ `Deno` では必要ないって？

そうなんです、`Deno` はインストールさえ済ませれば先に見たようにそのままコードを実行できます。
驚くなかれ、そもそも `Deno` には**npmがありません**。
`npm` がないということは当然 `node_modules` や `package.json` なんてものも存在しません。

`node_modules` ってかなり巨大なファイルでしたし、こいつがなくなるだけでフォルダ構成が結構スッキリしてくるんじゃないでしょうか。
`node_modules` と `package.json` の採用は、`Node.js` の設計ミスとしても上げられていた点です。

では、`npm` を使用しないとなれば、どのようにして外部モジュールを使用するのでしょうか。
その答えは、サンプルコードにもあるように、`import` に URL を渡します。

```js
import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
```

これは、`Deno` で外部モジュールを使用する唯一の方法です。もう `npm install` は必要としません。
ダウンロードは実行時に行われ、結果はキャッシュされます。

### 変更点3 requireがなくなった

関連して、今まで `Node.js` で利用されてきた `require` が廃止されました。

Node.js

```js
const http = require('http');
```

Deno

```js

import { serve } from "https://deno.land/std@0.50.0/http/server.ts";
```

[CommonJS](https://ja.wikipedia.org/wiki/CommonJS)の代わりに `ES Module`(`import` と `export`)をデフォルトのモジュールとシステムとして使用します。

### 変更点4 トップレベルのawait

あ！サンプルコードのこの部分、間違ってますよ！ほら！

```js
for await (const req of s) {
  req.respond({ body: "Hello World\n" });
}
```

`await` は `async` 関数の中でしか動作できないんですよー、ほら `VSCode` だって怒ってる。

![スクリーンショット 20200518 1.40.50.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FF2z5J7aePghFMh2hqfVK%2Fb9f9d424a89a2b8ec279e2ee04aca1b0.png?alt=media&token=2d87f1d9-ba5c-4961-95e2-14893eb07993)

..。え、これができるようになった？

そうです、もう `await` 使いたさにわざわざ `async` 関数で囲む必要はありません。やったね。

このトップレベル await に関しては Deno での特徴ではなく、ECMAScript の仕様と言うほうが正しいですね。

https://github.com/tc39/proposal-top-level-await

（@YoshiTheChinchilla さんご指摘ありがとうございます！）

## 実行してみる
コードベースでの変更点はここまでにして、実際にコードを実行してローカルサーバーを立ち上げてみましょう。
`deno run` で実行できます。

```sh
$ deno run server.js
Download https://deno.land/std@0.50.0/http/server.ts
Compile https://deno.land/std@0.50.0/http/server.ts
Download https://deno.land/std@0.50.0/encoding/utf8.ts
Download https://deno.land/std@0.50.0/io/bufio.ts
Download https://deno.land/std@0.50.0/testing/asserts.ts
Download https://deno.land/std@0.50.0/async/mod.ts
Download https://deno.land/std@0.50.0/http/_io.ts
Download https://deno.land/std@0.50.0/io/util.ts
Download https://deno.land/std@0.50.0/path/mod.ts
Download https://deno.land/std@0.50.0/path/win32.ts
Download https://deno.land/std@0.50.0/path/posix.ts
Download https://deno.land/std@0.50.0/path/common.ts
Download https://deno.land/std@0.50.0/path/separator.ts
Download https://deno.land/std@0.50.0/path/interface.ts
Download https://deno.land/std@0.50.0/path/glob.ts
Download https://deno.land/std@0.50.0/path/_constants.ts
Download https://deno.land/std@0.50.0/path/_util.ts
Download https://deno.land/std@0.50.0/fmt/colors.ts
Download https://deno.land/std@0.50.0/testing/diff.ts
Download https://deno.land/std@0.50.0/path/_globrex.ts
Download https://deno.land/std@0.50.0/async/deferred.ts
Download https://deno.land/std@0.50.0/async/delay.ts
Download https://deno.land/std@0.50.0/async/mux_async_iterator.ts
Download https://deno.land/std@0.50.0/textproto/mod.ts
Download https://deno.land/std@0.50.0/http/http_status.ts
Download https://deno.land/std@0.50.0/bytes/mod.ts
error: Uncaught PermissionDenied: network access to "0.0.0.0:8000", run again with the --allow-net flag
    at unwrapResponse ($deno$/ops/dispatch_json.ts:43:11)
    at Object.sendSync ($deno$/ops/dispatch_json.ts:72:10)
    at Object.listen ($deno$/ops/net.ts:51:10)
    at listen ($deno$/net.ts:152:22)
    at serve (https://deno.land/std@0.50.0/http/server.ts:261:20)
    at file:///Users/asaiippei/deno-test/server.js:2:11
```

外部モジュールをインストールするとことまでは良かったのですが、エラーが発生してしまいました。

### 変更点5 セキュリティルールの変更

なぜエラーが発生したのでしょうか。
実は、`Deno` デフォルトでセキュアであり、明示的に有効にしない限り、ファイル、ネットワーク、環境変数などにアクセスできません。

ネットワークを許可するには `--allow-net` フラグを付与して実行する必要があります。
もう一度やってみましょう。

```sh
$ deno run --allow-net  server.js
http://localhost:8000/
```

無事成功しましたね。
`http://localhost:8000/` にアクセスすると次のように表示されているはずです！
![スクリーンショット 20200518 1.56.19.png](https://firebasestorage.googleapis.com/v0/b/app-blog-1ef41.appspot.com/o/articles%2FF2z5J7aePghFMh2hqfVK%2F30318c8d890e66997ffe751265148cca.png?alt=media&token=8c70892b-43c0-4f8c-9af8-3c53f4df4a40)

### 変更点5 Web APIの実装によるブラウザとの互換性の向上
[Web API](https://developer.mozilla.org/ja/docs/Learn/JavaScript/Client-side_web_APIs)は Web ブラウザに組み込まれている機能です。ブラウザやコンピュータの環境の情報を取得し、これを使って役に立つややこしいことを行えるようにするものです。
代表的なものでいえば、`DOM`,`Canvas API`,`Storage`,`fetch API` などがあります。

これらの API は日常的に使用していて、JavaScript を覚えたての頃は JavaScript 標準のモノだと思いこんでしまうほどですが、`Node.js` ではこれらを使用できません。理由は簡単で、これらの API はブラウザ（Google Chrome, Firefox）で利用できるものであり、`Node.js` はブラウザではないからです。

#### Node.jsの場合

例えば、次のように `Node.js` で `Fetch API` を利用しようとすると失敗します。

```js
fetch('https://pokeapi.co/api/v2/pokemon/')
  .then(res => res.json())
  .then(data => console.log(data) )
```

```bash
$ node node-fetch.js
node-fetch.js:2
fetch('https://pokeapi.co/api/v2/pokemon/1')
^

ReferenceError: fetch is not defined
    at Object.<anonymous> (/Users/asaiippei/deno-test/node-fetch.js:2:1)
    at Module._compile (internal/modules/cjs/loader.js:955:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:991:10)
    at Module.load (internal/modules/cjs/loader.js:811:32)
    at Function.Module._load (internal/modules/cjs/loader.js:723:14)
    at Function.Module.runMain (internal/modules/cjs/loader.js:1043:10)
    at internal/main/run_main_module.js:17:11
```

`fetch` が定義されていないと怒られていますね。
これを解決するには、外部モジュールである `node-fetch` をインストールする必要があります。

```bash
npm i node-fetch
```

```js
// これを追加
const fetch = require('node-fetch')

fetch('https://pokeapi.co/api/v2/pokemon/')
  .then(res => res.json())
  .then(data => console.log(data) )
```

```bash
$ node node-fetch.js

{
  count: 964,
  next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
    { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
    { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon/7/' },
```

#### Denoの場合
`Deno` の場合には、標準で `Fetch API` がサポートされているため、インストールすることなく使用できます。

```js:fetch.js
const res = await fetch('https://pokeapi.co/api/v2/pokemon/1')
const json = res.json()
const data = await json
console.log(data)
```

おっと、実行するときには `--allow-net` フラグを渡すことを忘れないでください！

```bash
$ deno run --allow-net fetch.js

{
 count: 964,
 next: "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20",
 previous: null,
 results: [
    { name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" },
    { name: "ivysaur", url: "https://pokeapi.co/api/v2/pokemon/2/" },
    { name: "venusaur", url: "https://pokeapi.co/api/v2/pokemon/3/" },
    { name: "charmander", url: "https://pokeapi.co/api/v2/pokemon/4/" },
    { name: "charmeleon", url: "https://pokeapi.co/api/v2/pokemon/5/" },
    { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
    { name: "squirtle", url: "https://pokeapi.co/api/v2/pokemon/7/" },
```

`fetch API` の他にも幅広い Web API を実装していることにより、ブラウザとの互換性を向上させました。

### Denoによるテスト
`Deno` にはテストランナーも含まれています。

`Deno.test` を呼ぶことでテストをできます。

```js:test.js
Deno.test("hello world", () => {
  const x = 1 + 2;
  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});
```

 [標準テストモジュール](https://deno.land/std/testing)から、アサーションを使用できます。

```js:test.js
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("hello world", () => {
  const x = 2 + 2;
  assertEquals(x, 3);
});
```

テストを実行するときは、`Deno test` です。

```bash
$ deno test test.js
Download https://deno.land/std/testing/asserts.ts
Warning Implicitly using master branch https://deno.land/std/testing/asserts.ts
Compile https://deno.land/std/testing/asserts.ts
Download https://deno.land/std/fmt/colors.ts
Download https://deno.land/std/testing/diff.ts
Warning Implicitly using master branch https://deno.land/std/testing/diff.ts
Warning Implicitly using master branch https://deno.land/std/fmt/colors.ts
Compile file:///Users/deno-test/.deno.test.ts

running 1 tests
test hello world ... FAILED (5ms)

failures:

hello world
AssertionError: Values are not equal:

    [Diff] Actual / Expected

-   4
+   3

    at assertEquals (https://deno.land/std/testing/asserts.ts:167:9)
    at test.js:5:3
    at asyncOpSanitizer ($deno$/testing.ts:36:11)
    at Object.resourceSanitizer [as fn] ($deno$/testing.ts:70:11)
    at TestApi.[Symbol.asyncIterator] ($deno$/testing.ts:264:22)
    at TestApi.next (<anonymous>)
    at Object.runTests ($deno$/testing.ts:346:20)

failures:

        hello world

test result: FAILED. 0 passed; 1 failed; 0 ignored; 0 measured; 0 filtered out (5ms)
```

初回なのでダウンロードとコンパイルが入りますね。
テストも失敗しているので修正しておきましょう。

```js:test.js
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("hello world", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});
```

2 回目以降のテストはすぐに実行できます。

```js
$ deno test test.js
running 1 tests
test hello world ... ok (6ms)

test result: ok. 1 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out (8ms)
```

これで OK ですね。

# おわりに
新しい JavaScript のランタイムである `Deno` についてざっくりと触れてみました。
いつの日か、`Node.js` に取って代わる日が来るのでしょうか、とても気になりますね。
