---
id: O8J3DEesBE7y7RHO_uNBr
title: "新しいパッケージマネージャーの vlt を使ってみる"
slug: "new-package-manager-vlt"
about: "vlt は npm と互換性のあるパッケージマネージャーです。`npm` と同じように、パッケージのインストールや script の実行ができます。また、npm registry 互換のサーバーレジストリである vsr も同時に提供されています。"
createdAt: "2024-11-16T15:36+09:00"
updatedAt: "2024-11-16T15:36+09:00"
tags: ["vlt", "npm"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1pYX3UnQy0YnkykTD2aZX5/97fffca89b2e1a9532a1e21c2f3f9ae8/kuri-gohan_20701-768x689.png"
  title: "栗ご飯のイラスト"
selfAssessment:
  quizzes:
    - question: "vlt install コマンドを実行した際に生成される lock ファイルの名前は次のうちどれか？"
      answers:
        - text: "package-lock.json"
          correct: false
          explanation: null
        - text: "vlk-lock.json"
          correct: true
          explanation: null
        - text: "vlt.json"
          correct: false
          explanation: null
        - text: "vlt.lock"
          correct: false
          explanation: null
    - question: "vlt でパッケージをローカルにインストールせずに実行するためのコマンドは次のうちどれか？"
      answers:
        - text: "vlt exec <pkg>"
          correct: false
          explanation: null
        - text: "vlt run <pkg>"
          correct: false
          explanation: null
        - text: "vlx <pkg>"
          correct: true
          explanation: null
        - text: "vlt <pkg>"
          correct: false
          explanation: null
published: true
---
vlt は npm と互換性のあるパッケージマネージャーです。`npm` と同じように、パッケージのインストールや script の実行ができます。また、npm registry 互換のサーバーレジストリである vsr も同時に提供されています。

https://www.vlt.sh/

vlt と vsr が開発されたモチベーションとして、npm の registry に問題があり、これを解決するためであると述べられています。詳細は以下のブログを確認してください。

https://blog.vlt.sh/blog/the-massive-hole-in-the-npm-ecosystem

この記事ではクライアント側の vlt について紹介します。vlt は npm vsr を使用せずに npm registry からパッケージをインストールできます。

## vlt をインストールする

以下のコマンドを実行することで、`vlt` をインストールできます。現在 `vlt` は Node.js の v20 と v22 でサポートされています。

```bash
npm install -g vlt
```

以下のコマンドで正常にインストールされたか確認してみましょう。

```bash
vlt --version
0.0.0-0.1730830331789
```

## vlt でパッケージをインストールする

`vlt` は npm と同じように、`install` コマンドを使ってパッケージをインストールできます。デフォルトでは public npm registry からパッケージをインストールするため、npm で公開されているパッケージをそのまま利用できます。

パッケージをインストールする前にプロジェクトルートに `package.json` ファイルが存在している必要があります。

```bash
echo "{}" > package.json
```

`package.json` ファイルが作成されたら、以下のコマンドで lodash パッケージをインストールしてみましょう。

```bash
vlt install lodash
```

インストールが完了すると、`package.json` ファイルの `dependencies` フィールドに lodash が追加され、`vlk-lock.json` ファイルが作成されます。

```json
{
  "dependencies": {
    "lodash": "^4.17.21"
  }
}
```

`--save-dev` もしくは `-D` オプションを付けることで、`devDependencies` フィールドにパッケージを追加することもできます。

```bash
vlt install --save-dev @types/lodash
```

## vlt でスクリプトを実行する

それではインストールした `lodash` パッケージを使ったスクリプトを実行してみましょう。`mains.js` ファイルを作成し、以下のコードを記述します。

```javascript
const { sum } = require("lodash");

const array = [1, 2, 3, 4, 5];

console.log(sum(array));
```

続いて `package.json` ファイルに `scripts` フィールドを追加し、`start` スクリプトを定義します。

```json
{
  "scripts": {
    "start": "node main.js"
  }
}
```

`vlt run <script>` コマンドを使って `package.json` ファイルに定義されたスクリプトを実行できます。

```bash
vlt run start
```

スクリプトを実行すると、コンソールに以下のような出力が表示されるはずです。

```bash
15
{
  command: 'node main.js',
  args: [],
  cwd: '/vlt-example',
  stdout: null,
  stderr: null,
  status: 0,
  signal: null,
  pre: undefined
}
{
  "command": "node main.js",
  "args": [],
  "cwd": "/vlt-example",
  "stdout": null,
  "stderr": null,
  "status": 0,
  "signal": null
}
```

## ローカルにインストールされていないパッケージを利用する

`vlx` コマンドを使うと、`npx` と同じようにローカルにインストールされていないパッケージを利用できます。

```bash
vlx serve
```

## パッケージの依存関係を表示する

`vlt query` コマンドを使用すると、様々な方式でパッケージの依存関係を表示できます。デフォルトでは human-readable な形式で表示されます。

```bash
 vlt query
file·.
├─┬ react@18.3.1
│ └─┬ loose-envify@1.4.0
│   └── js-tokens@4.0.0
├── lodash@4.17.21
├─┬ express@4.21.1
│ ├── vary@1.1.2
│ ├── utils-merge@1.0.1
│ ├─┬ type-is@1.6.18
│ │ ├─┬ mime-types@2.1.35
│ │ │ └── mime-db@1.52.0
│ │ └── media-typer@0.3.0
│ ├── statuses@2.0.1
```

サブコマンドを使用することで、特定のパッケージのみを表示することも可能です。例えば以下のコマンドでは、`react` パッケージの依存関係のみを表示します。

```bash
vlt query '#react'
file·.
└── react@18.3.1
```

以下のコマンドは `cookie` という名前から始まるパッケージをクエリします。

```bash
vlt query '[name^="cookie"]'
file·.
└─┬ express@4.21.1
  ├── cookie-signature@1.0.6
  └── cookie@0.7.1
```

`build` コマンドが依存するプロジェクトの依存関係をすべて表示することもできます。

```bash
vlt query ':project > *:attr(scripts, [build])'
```

### 結果のフォーマットを変更する

`--view` オプションを使用することで、結果のフォーマットを変更できます。`human`、`json`、`mermaid`、`gui` のいずれかを指定でき、デフォルトは `human` です。

`mermaid` オプションで実行すると、以下のように [Mermaid](https://mermaid.js.org/) の形式で出力されます。

```bash
vlt query --view=mermaid
flowchart TD
file%C2%B7.("root:file·.")
file%C2%B7.("root:file·.") -->|"react#64;^18.3.1 (prod)"| %C2%B7%C2%B7react%4018.3.1("npm:react#64;18.3.1")
%C2%B7%C2%B7react%4018.3.1("npm:react#64;18.3.1")
%C2%B7%C2%B7react%4018.3.1("npm:react#64;18.3.1") -->|"loose-envify#64;^1.1.0 (prod)"| %C2%B7%C2%B7loose-envify%401.4.0("npm:loose-envify#64;1.4.0")
```

この出力を [Mermaid Live Editor](https://mermaid-js.github.io/mermaid-live-editor/) に貼り付けることで、依存関係をグラフィカルに表示できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/59WfmSGbyoVFi3uS8TfQWz/11feafba86661e1fd82484ae8f315c62/__________2024-11-16_17.43.01.png)

`gui` オプションを使用すると、http://localhost:7017 を起動して、ブラウザで結果を表示できます。

```bash
vlt query ':project > :is(*[name="express"])' --view=gui
```

![](https://images.ctfassets.net/in6v9lxmm5c8/66vsn183CRyfNoluPV7UAD/9a7576f1f9fd5e482466641529ed1be0/__________2024-11-16_17.46.37.png)

## vlt の config を設定する

`vlt` のコマンドを実行する際にはいくつかの設定を指定できます。例えば `--no-color` オプションを使うことで、カラー出力を無効にできます。

```bash
vlt run start --no-color
```

このような設定はプロダクトのルートに `vlt.json` ファイルが存在する場合、その値を参照します。

`vlt config set` コマンドにより、`vlt.json` ファイルに設定を書き込むことができます。

```bash
vlt config set no-color=true
```

コマンドを実行すると、`vlt.json` ファイルが作成され、以下のような内容が書き込まれます。

```json
{
  "color": false
}
```

`vlt.json` ファイルに設定を書き込むことで、`vlt` のコマンドを実行する際に設定を指定する必要がなくなります。

## まとめ

## 参考

- [vlt Docs | docs | vlt](https://docs.vlt.sh/)
- [Introducing the vlt Package Manager & Serverless Registry](https://blog.vlt.sh/blog/introducing-vlt-and-vsr)
