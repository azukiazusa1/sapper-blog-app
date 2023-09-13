---
id: Q2mOpVeqjNwCWrbc49tdf
title: "Bun の Plugins で CSS ファイルを直接 import する"
slug: "import-css-file-directly-in-bun-plugin"
about: "Bun の Plugins API を使用することで、任意の拡張子のファイルのサポートを追加できます。例えば Bun の公式の動画では、Plugins API を使用して Rust ファイル（.rs）を直接 import できる仕組みも作れることが紹介されています。"
createdAt: "2023-09-13T21:11+09:00"
updatedAt: "2023-09-13T21:11+09:00"
tags: ["Bun"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/GZtUH0YNwJDZcr4s3abGT/a1998e60dbb178a36306821891c4db04/seiro_meat-bun_15091.png"
  title: "蒸したてホクホクの肉まんのイラスト"
published: false
---

Bun のランタイムとバンドラの両方を拡張できる [Plugins API](https://bun.sh/docs/runtime/plugins) を提供しています。この Plugin を使用することで、任意の拡張子のファイルのサポートを追加できます。例えば Bun の公式の動画では、Plugins API を使用して Rust ファイル（`.rs`）を直接 import できる仕組みも作れることが紹介されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/7zIcBfwtRDDJ03FNA6DhCQ/37d3984571323181635ece7abaca0f84/image.png)

https://www.youtube.com/watch?v=BsnCpESUEqM&t=229s

## 使い方

Plugins API は JavaScript のオブジェクトとして定義されます。このオブジェクトは以下のプロパティを持ちます。

- `name`：Plugin の名前
- `setup`：ローダー処理を行う関数

例えば、`.yaml` ファイルを import するための Plugin を作成するには、以下のように定義します。

```ts:plugins/yaml.ts
import { plugin } from "bun";

plugin({
  name: "YAML",
  async setup(build) {
    const { load } = await import("js-yaml");
    const { readFileSync } = await import("fs");

    // when a .yaml file is imported...
    build.onLoad({ filter: /.(yaml|yml)$/ }, (args) => {

      // read and parse the file
      const text = readFileSync(args.path, "utf8");
      const exports = load(text) as Record<string, any>;

      // and returns it as a module
      return {
        exports,
        loader: "object", // special loader for JS objects
      };
    });
  },
});
```

https://bun.sh/docs/runtime/plugins#loaders

`setup` 関数が返すオブジェクトの `loader` プロパティは以下の値を指定できます。

- `js`：JavaScript ファイルへトランスパイルする
- `jsx`：jsx を変換してからトランスパイルする
- `ts`：TypeScript を変換してからトランスパイルする
- `tsx`：tsx を変換してからトランスパイルする
- `toml`：toml ファイルを JavaScript オブジェクトに変換する
- `json`：json ファイルを JavaScript オブジェクトに変換する
- `napi`：ネイティブ Node.js アドオンをインポートする
- `wasm`：WebAssembly モジュールをインポートする
- `object`：JavaScript のオブジェクトを同等の ES モジュールに変換するプラグイン向けの特別なローダー

設定された Plugin は他のコードが実行されるよりも先に読み込まれる必要があります。これを実現するためには、`bunfig.toml`（Bun の設定ファイル）の `preload` オプションを使用します。

```toml
preload = ["./plugins/yaml.ts"]
```

テストが実行される前に Plugin を読み込みたい場合には、`[test]` セクションに `preload` オプションを設定します。

```toml
[test]
preload = ["./plugins/yaml.ts"]
```

## CSS ファイルを直接 import する

それでは例として、Plugins API を使用して CSS ファイルを直接 import できるようにしてみましょう。npm によりいくつか Plugin のパッケージが公開されているので、それを使ってみましょう。[bun-plugin-csv](https://www.npmjs.com/package/bun-plugin-csv) パッケージを使ってみます。

```sh
bun install bun-plugin-csv
```

Plugin を設定する `plugins/csv.ts` ファイルを作成します。

```ts:plugins/csv.ts
import csvPlugin from "bun-plugin-csv";
import { plugin } from "bun";

plugin(csvPlugin());
```

サードパーティの Plugin は慣例として、`BunPlugin` オブジェクトを返すファクトリ関数として実装されています。そのため、`csvPlugin()` という関数を呼び出して Plugin を設定します。

続いて `bunfig.toml` に Plugin を読み込むように設定します。

```toml
preload = ["./plugins/csv.ts"]
```

`.csv` ファイルに型定義を追加します。

```ts:csv.d.ts
/// <reference types="bun-plugin-csv/client" />
```

適当な CSV ファイルを作成しておきましょう。

```csv:sample.csv
name,age
Alice,18
Bob,20
```

`index.ts` で CSV ファイルを import してみます。

```ts:index.ts
import users from "./users.csv"

for (let user of users) {
    console.log(user);
}
```

`bun index.ts` コマンドで実行してみると、確かに CSV ファイルが JavaScript のオブジェクトとして import できていることが確認できます。

```sh
bun index.ts
{
  name: "Alice",
  age: "18"
}
{
  name: "Bob",
  age: "20"
}
```

## まとめ

- Plugins API を使用することで、任意の拡張子のファイルのサポートを追加できる
- Plugins API は `name` と `setup` の 2 つのプロパティを持ち、`setup` はローダー処理を行う関数を指定する
- Plugin が他のコードが実行されるよりも先に読み込まれるようにするには、`bunfig.toml` の `preload` オプションを使用する
- サードパーティの Plugin は慣例として、`BunPlugin` オブジェクトを返すファクトリ関数として実装されている
