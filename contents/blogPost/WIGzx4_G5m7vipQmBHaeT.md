---
id: WIGzx4_G5m7vipQmBHaeT
title: Bun でクロスプラットフォームなシェルスクリプト
slug: bun-cross-platform-shell-script
about: "Bun の `$` を使うと、クロスプラットフォームなシェルスクリプト（Bun Shell）を書くことができます。Bun Shell は macOS (zsh)、Linux (bash)、および Windows (cmd) と OS の違いを気にせずにシェルスクリプトを書ける、JavaScript オブジェクトとのやりとりが可能であることが特徴です。"
createdAt: "2024-01-20T20:01+09:00"
updatedAt: "2024-01-20T20:01+09:00"
tags: ["Bun"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7nGrrwXuzklaglfdnuIFL0/fdc6513019150e05ddd8a9ff2a20f708/ozouni_shouyu_15837.png"
  title: "お雑煮のイラスト"
published: true
---

[Bun v1.0.24](https://bun.sh/blog/bun-v1.0.24) で、クロスプラットフォームなシェルスクリプトを書くための機能（Bun Shell）が追加されました。

!> Bun Shell は現在開発中の機能です。

`bun` モジュールから `$` を import して、タグ付きテンプレートリテラルとして使うことでシェルとして実行できる文字列を生成できます。

```ts
import { $ } from "bun";

await $`ls`;
```

上記のコードを実行すると、以下のような標準出力が得られます。

```sh
$ bun run index.ts
bun.lockb
node_modules
README.md
package.json
tsconfig.json
index.ts
```

Bun Shell は macOS (zsh)、Linux (bash)、および Windows (cmd) と OS の違いを気にせずにシェルスクリプトを書くことができます。

## 出力を取得する

シェルの出力をテキストとして取得するには `.text()` メソッドを使います。この場合標準出力には何も出力されません。

```ts
import { $ } from "bun";

const text = await $`ls`.text();

// ファイルの数を数える
const count = text.split("\n").length;
console.log(count); // => 7
```

`lines()` メソッドを使うと、出力を行ごとに分割したイテレータを取得できます。

```ts
import { $ } from "bun";

for await (const line of $`cat ./index.ts ./package.json`.lines()) {
  console.log(line);
}
```

`json()` メソッドを使うと、出力を JSON としてパースした結果を取得できます。

```ts
import { $ } from "bun";

const json = await $`cat ./package.json`.json();

console.log(json.devDependencies); // => {"@types/bun": "latest"}
```

`blob()` メソッドを使うと、出力を Blob オブジェクトとして取得できます。

```ts
import { $ } from "bun";

const blob = await $`cat ./package.json`.blob();

console.log(blob); // => Blob { size: 123, type: "text/plain" }
```

stdout, stderr, 終了コードを取得するには `.quite()` メソッドを使います。

```ts
import { $ } from "bun";

const { stdout, stderr, exitCode } = await $`echo "Hello, world!"`;

console.log(stdout); // => Hello, world!
console.error(stderr); // => Buffer
console.log(exitCode); // => 0
```

## リダイレクト

Bun Shell では `>`, `<`, `|` を使用したリダイレクトをサポートしており、JavaScript オブジェクトとのやりとりが可能です。

`>` は標準出力を JavaScript オブジェクトにリダイレクトします。

```ts
import { $ } from "bun";

const buffer = Buffer.alloc(1024);

await $`echo "Hello, world!" > ${buffer}`;

console.log(buffer.toString()); // => Hello, world!\n
```

リダイレクト先に `Bun.file()` を使うと、ファイルに書き込まれます。

```ts
import { file, $ } from "bun";

await $`echo "Hello, world!" > ${file("./hello.txt")}`;
```

```txt:hello.txt
Hello, world!

```

`<` は JavaScript オブジェクトを標準入力にリダイレクトします。`<` では Buffer オブジェクトの他に `Response` オブジェクトを受け取ることもできます。

```ts
import { $ } from "bun";

const response = await fetch("https://example.com");

await $`cat < ${response}`; // => <!doctype html>...
```

`|` オペレーターで JavaScript オブジェクトをパイプできます。

```ts
import { $ } from "bun";

const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

await $`cat < ${response} | jq .title`; // => delectus aut autem
```

## 環境変数

bash と同じように環境変数を設定できます。

```ts
import { $ } from "bun";

await $`FOO=foo bun -e 'console.log(process.env.FOO)'`; // foo
```

`env()` メソッドを使って環境変数を設定することもできます。

```ts
import { $ } from "bun";

// グローバルで環境変数が設定される
$.env({ FOO: "foo" });

await $`echo $FOO`; // foo

// ローカルで環境変数が設定される
await $`echo $FOO`.env({ FOO: "bar" }); // foo
```

## セキュリティ

Bun Shell はデフォルトですべても文字列をエスケープします。これにより、シェルスクリプトのインジェクション攻撃を防ぐことができます。

```ts
import { $ } from "bun";

const name = `'; rm -rf /; echo '`;

await $`echo ${name}`; // => ; rm -rf /; echo
```

エスケープを無効にしたい場合には、`$.escape()` を使います。

```ts
import { $ } from "bun";

const name = "bun";

await $`echo ${$.escape(name)}`; // => bun
```

## 単純なシェルスクリプト

`.bun.sh` で終わるファイルを `bun` コマンドに渡すと、シェルスクリプトとして実行できます。

```sh:hello.bun.sh
echo "Hello, world!"
```

```sh
$ bun run hello.bun.sh
Hello, world!
```

## 参考

- [$ Shell](https://bun.sh/docs/runtime/shell)
- [The Bun Shell | Bun Blog](https://bun.sh/blog/the-bun-shell)
