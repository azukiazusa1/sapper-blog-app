---
id: gBt2vbAi0Fj3WC5fl6uQQ
title: "MoonBit の宣言 UI ライブラリ Luna を使ってみる"
slug: "moonbit-declarative-ui-library-luna-ui"
about: "Luna は MoonBit と JavaScript を使用して Web アプリケーションのユーザーインターフェースを構築するための宣言型 UI ライブラリです。この記事では、Luna UI と MoonBit を使用してシンプルなカウンターアプリケーションを作成する方法を紹介します。"
createdAt: "2026-02-01T14:57+09:00"
updatedAt: "2026-02-01T14:57+09:00"
tags: ["moonbit", "luna", "signals"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5UhRNC33x50wdltLpyBqlL/d8d0ca0983881507a5ca5aa32b43c9b6/usagi-wagashi_green-tea_12196-768x591.png"
  title: "うさぎの和菓子とお茶のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Luna UI で Signal の値に基づいて動的にテキストを更新するために使用する関数はどれですか？"
      answers:
        - text: "@dom.text()"
          correct: false
          explanation: "@dom.text() は静的なテキストを表示するための関数で、Signal の変更を追跡しません。"
        - text: "@dom.text_dyn()"
          correct: true
          explanation: "text_dyn は関数を引数として受け取り、Signal の値が変更されると自動的に再評価されてテキストが更新されます。"
        - text: "@dom.dynamic_text()"
          correct: false
          explanation: "そのような関数は存在しません。"
        - text: "@signals.text()"
          correct: false
          explanation: ""
    - question: "MoonBit で `|>` 演算子の役割は何ですか？"
      answers:
        - text: "左辺の値を右辺の関数の最初の引数として渡すパイプライン演算子"
          correct: true
          explanation: "`|>` 演算子はパイプライン演算子で、データの流れを直感的に表現でき、関数適用のネストを減らせます。例えば `el |> @dom.DomElement::from_dom` は `@dom.DomElement::from_dom(el)` と同等です。"
        - text: "ビット演算の OR 演算子"
          correct: false
          explanation: "ビット演算ではなく、関数のパイプライン演算子です。"
        - text: "型注釈のための演算子"
          correct: false
          explanation: ""
        - text: "条件分岐のための演算子"
          correct: false
          explanation: ""

published: false
---

[Luna](https://luna.mizchi.workers.dev/) は、MoonBit と JavaScript を使用して Web アプリケーションのユーザーインターフェースを構築するための宣言型 UI ライブラリです。Luna はクラウドおよびエッジコンピューティング向けに設計された言語である [MoonBit](https://www.moonbitlang.com/) で書かれているのが特徴です。その他の JavaScript フレームワークと比較してバンドルサイズが小さく抑えるように設計されています。また Web Components First を謳っており、ネイティブなブラウザ標準を重視しています。

Luna のエコシステムは以下の 3 つの主要なパッケージで構成されています。

| パッケージ名                                        | 説明                            | 言語                             |
| --------------------------------------------------- | ------------------------------- | -------------------------------- |
| [Sol SSG](https://luna.mizchi.workers.dev/sol/ssg/) | 静的サイトジェネレーター        | Markdown + Islands               |
| [Sol](https://luna.mizchi.workers.dev/sol/)         | フルスタック Web フレームワーク | MoonBit                          |
| [Luna UI](https://luna.mizchi.workers.dev/luna/)    | 宣言型 UI ライブラリ            | MoonBit or JavaScript/TypeScript |

この記事では、Luna UI と MoonBit を使用してシンプルな Web アプリケーションを作成する方法を紹介します。

## Luna UI プロジェクトを作成する

まず、Luna UI プロジェクトを作成します。以下のコマンドを実行して、プロジェクトの雛形を生成します。`--mbt` オプションを指定することで、MoonBit を使用したプロジェクトが作成されます。

```bash
npx @luna_ui/luna new myapp --mbt
```

次に、作成したプロジェクトのディレクトリに移動して依存関係をインストールします。2026 年 2 月時点では `mizchi/signals` パッケージを追加でインストールする必要がありました。

```bash
cd myapp
moon update
moon add mizchi/signals
npm install
```

プロジェクトの構造は以下のようになります。

```bash
.
├── _build
├── index.html
├── main.ts
├── moon.mod.json
├── package.json
├── src
│   ├── lib.mbt
│   └── moon.pkg.json
├── target -> _build
├── tsconfig.json
└── vite.config.ts
```

簡単にプロジェクトの各ファイルの役割について見ていきましょう。`moon.mod.json` は MoonBit プロジェクトのモジュールを定義するファイルです。パッケージのメタデータや依存関係が含まれています。 `moon add` コマンドを使用して `deps` フィールドに追加します。プロジェクトを作成した段階では [`mizchi/luna`](https://mooncakes.io/docs/mizchi/luna) と [`mizchi/js`](https://mooncakes.io/docs/mizchi/js) が含まれています。

```json:moon.mod.json
{
  "name": "internal/myapp",
  "version": "0.0.1",
  "deps": {
    "mizchi/luna": "0.1.3",
    "mizchi/js": "0.10.6",
    "mizchi/signals": "0.6.1"
  },
  "source": "src",
  "preferred-target": "js"
}
```

エントリーポイントは `src/lib.mbt` です。ここではコードの内容に深くは触れませんが、Luna UI を使用してシンプルなカウンターアプリケーションが実装されています。

```mbt:src/lib.mbt
// Luna Counter App

///|
fn main {
  let count = @signals.signal(0)
  let doubled = @signals.memo(fn() { count.get() * 2 })
  let doc = @js_dom.document()
  match doc.getElementById("app") {
    Some(el) => {
      let app = @dom.div([
        @dom.h1([@dom.text("Luna Counter (MoonBit)")]),
        @dom.p([@dom.text_dyn(fn() { "Count: " + count.get().to_string() })]),
        @dom.p([@dom.text_dyn(fn() { "Doubled: " + doubled().to_string() })]),
        @dom.div(class="buttons", [
          @dom.button(
            on=@dom.events().click(_ => count.update(fn(n) { n + 1 })),
            [@dom.text("+1")],
          ),
          @dom.button(
            on=@dom.events().click(_ => count.update(fn(n) { n - 1 })),
            [@dom.text("-1")],
          ),
          @dom.button(on=@dom.events().click(_ => count.set(0)), [
            @dom.text("Reset"),
          ]),
        ]),
      ])
      @dom.render(el |> @dom.DomElement::from_dom, app)
    }
    None => ()
  }
}
```

`src/moon.pkg.json` を配置することでこのディレクトリが MoonBit パッケージとして認識されます。

```json:src/moon.pkg.json
{
  "is-main": true,
  "supported-targets": ["js"],
  "import": [
    "mizchi/signals",
    {
      "path": "mizchi/luna/dom",
      "alias": "dom"
    },
    {
      "path": "mizchi/js/browser/dom",
      "alias": "js_dom"
    }
  ],
  "link": {
    "js": {
      "format": "esm"
    }
  }
}
```

`is-main` フィールドはこのパッケージが実行可能であることを示します。`fn main` 関数がエントリーポイントとして使用されます。`import` フィールドでは、Luna UI と MoonBit の標準ライブラリから必要なモジュールをインポートしています。`alias` として設定した名前が `@dom` や `@js_dom` としてコード内で使用されます。`link` フィールドでは、JavaScript ターゲット向けの出力形式を指定しています。

`moon build` コマンドを実行すると、`_build` ディレクトリにビルド成果物が生成されます。ビルド成果物は [`vite-plugin-moonbit`](https://github.com/mizchi/vite-plugin-moonbit) を使用して Vite プロジェクトに統合されます。`vite.config.ts` ファイルでは、Vite の設定が行われています。`watch: true` オプションを指定することで `.mbt` ファイルの変更を監視し、自動的に再ビルドされます。

```ts:vite.config.ts
import { defineConfig } from "vite";
import { moonbit } from "vite-plugin-moonbit";

export default defineConfig({
  plugins: [
    moonbit({
      watch: true,
      showLogs: true,
    }),
  ],
});
```

`main.ts` ファイルは、ビルドされた MoonBit コードをインポートしています。

```ts:main.ts
// Import MoonBit module via mbt: prefix
import "mbt:internal/myapp";
```

`mbt:internal/myapp` のパスは `tsconfig.json` の `paths` フィールドで定義されています。ビルド成果物のパスを指定していることがわかりますね。

```json:tsconfig.json {11-15}
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "noEmit": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "paths": {
      "mbt:internal/myapp": [
        "./target/js/release/build/app/app.js"
      ]
    }
  },
  "include": [
    "*.ts"
  ]
}
```

`main.ts` は `index.html` から参照されており、ブラウザでアプリケーションを起動するためのエントリーポイントとなります。

```html:index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>myapp</title>
  </head>
  <body>
    <h1>myapp</h1>
    <div id="app"></div>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

`npm run dev` コマンドを実行して開発サーバーを起動し、ブラウザで `http://localhost:3000` にアクセスすると、Luna UI を使用したカウンターアプリケーションが表示されます。このように MoonBit をビルドして JavaScript コードを生成 → `main.ts` でインポート → `index.html` で参照、という流れで Luna UI アプリケーションを構築できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4vTZm1tundgpaZo00rFz7z/371ad4ec47d2af45556a85ea31610781/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-01_15.51.18.png)

## カウンターアプリケーションの内部の仕組み

カウンターアプリケーションがどのように動作しているのか、コードを順に追っていきましょう。はじめに `@js_dom.document()` を使用してブラウザのドキュメントオブジェクトを取得しています。`@js_dom` は `mizchi/js/browser/dom` モジュールのエイリアスで、ブラウザの DOM 操作を行うための関数が提供されています。`@js_dom.document()` は Web API の `window.document` に対応しています。

`doc.getElementById("app")` を使用して、HTML 内の `id="app"` の要素を取得しています。結果は `Option` 型で返され、要素が存在する場合は `Some(el)`、存在しない場合は `None` となります。`match` 式を使用して結果を分岐しています。`id="app"` の要素が存在する場合、Luna UI のコンポーネントを作成してレンダリングします。

```mbt:src/lib.mbt
///|
fn main {
  let doc = @js_dom.document()
  match doc.getElementById("app") {
    Some(el) => {
      // コンポーネントの作成とレンダリング...
    }
    None => ()
  }
}
```

コンポーネントの作成には `@dom` 名前空間の関数を使用しています。例えば、`@dom.div` は `<div>` 要素を作成し、`@dom.h1` は `<h1>` 要素を作成します。これらの関数は子要素の配列を引数として受け取ります。現在は関数 DSL スタイルで要素をネストして HTML 構造を表現していますが、[jsx サポートのプロポーザル](https://github.com/moonbitlang/moonbit-evolution/issues/19)も進行中であり、将来は React のような記法も利用できるようになる予定です。

以下のコードは `<div><h1>Hello, Luna UI!</h1></div>` を作成する例です。

```mbt:src/lib.mbt {12-20}
let app = @dom.div([@dom.h1([@dom.text("Hello, Luna UI!")])])
```

アプリケーションをレンダリングするには、`@dom.render` 関数を使用します。最初の引数にコンポーネントをレンダリングするコンテナ要素を、2 番目の引数にレンダリングする DOM Nodeを指定します。親要素は `el |> @dom.DomElement::from_dom` を使用して `@js_dom.Element` 型を `@dom.DomElement` 型に変換しています。

:::info
`|>` 演算子はパイプライン演算子で、左辺の値を右辺の関数の最初の引数として渡します。`el |> @dom.DomElement::from_dom` は `@dom.DomElement::from_dom(el)` と同等です。パイプライン演算子はデータの流れを直感的に表現できたり、関数適用のネストを減らせる利点があります。
:::

```mbt:src/lib.mbt {7}
///|
fn main {
  let doc = @js_dom.document()
  match doc.getElementById("app") {
    Some(el) => {
      let app = @dom.div([@dom.h1([@dom.text("Hello, Luna UI!")])])
      @dom.render(el |> @dom.DomElement::from_dom, app)
    }
    None => ()
  }
}
```

ここまでのコードで「Hello, Luna UI!」と表示されるだけの静的なコンポーネントが作成できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/2xiMWyCs3TeVr5JTmPcwmy/e2f3c0442e86b568a08335646ac6f719/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-01_16.30.54.png)

コンポーネントは別の関数に分割して定義することもできます。以下の例では `counter` 関数を定義し、その中でコンポーネントを作成しています。`main` 関数は単に `counter()` を呼び出して結果をレンダリングするだけになりました。今後はこの `counter` 関数内で状態管理やイベント処理を追加していきます。

```mbt:src/lib.mbt {1-4, 11}
///|
fn counter() -> @dom.DomNode {
  @dom.div([@dom.h1([@dom.text("Hello, Luna UI!")])])
}

///|
fn main {
  let doc = @js_dom.document()
  match doc.getElementById("app") {
    Some(el) => {
      let app = counter()
      @dom.render(el |> @dom.DomElement::from_dom, app)
    }
    None => ()
  }
}
```

### Signals を使用したリアクティブな状態管理

状態管理のコードを見ていきましょう。Luna UI では [Signals](https://mooncakes.io/docs/mizchi/signals) ライブラリを使用してリアクティブな状態管理を行います。Signal は [alien-signals](https://github.com/stackblitz/alien-signals) や [Solid.js](https://www.solidjs.com/) の影響を受けており、依存関係を自動で追跡し、Signal の値が変更されたときそれに依存するすべての計算と effect が再実行されます。

まず、`@signals.signal(0)` を使用して `count` という Signal を作成しています。初期値は `0` です。Signal はリアクティブな状態を表現するための基本的な単位です。

```mbt
let count = @signals.signal(0)
```

Signal の現在の値を取得するには `count.get()` を使用します。以下のコードでは `Count: 0` というテキストを表示しています。

```mbt:src/lib.mbt {3-4}
///|
fn counter() -> @dom.DomNode {
  let count = @signals.signal(0)
  @dom.div([@dom.h1([@dom.text("Count: " + count.get().to_string())])])
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/575ugVcxJrCpVVwbMjkFQd/49d1f0cafdd3ebed54172eb8554342f3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-01_16.55.29.png)

Signal の値を更新するには `count.set(newValue)` または `count.update(fn(oldValue) { ... })` を使用します。`set` は新しい値を直接設定し、`update` は現在の値を引数として受け取り新しい値を計算する関数を渡します。

```mbt
let count = @signals.signal(0)
count.set(5) // count の値を 5 に設定
count.update(fn(n) { n + 1 }) // count の値をインクリメント
```

ボタンをクリックしたときに `count` の値を更新するには、`@dom.button` の `on` プロパティにクリックイベントハンドラ `@dom.events().click(...)` を設定します。以下のコードでは、`+1` ボタンがクリックされたときに `count` の値をインクリメント、`-1` ボタンがクリックされたときにデクリメントしています。

```mbt:src/lib.mbt {5-13}
///|
fn counter() -> @dom.DomNode {
  let count = @signals.signal(0)
  @dom.div([
    @dom.h1([@dom.text("Count: " + count.get().to_string())]),
    @dom.div(class="buttons", [
      @dom.button(on=@dom.events().click(_ => count.update(fn(n) { n + 1 })), [
        @dom.text("+1"),
      ]),
      @dom.button(on=@dom.events().click(_ => count.update(fn(n) { n - 1 })), [
        @dom.text("-1"),
      ]),
    ]),
  ])
}
```

しかし、このコードには問題があります。`count` の値が更新されても、表示されるテキストは自動的に更新されません。これは、Luna UI のコンポーネントが初回レンダリング時にのみ評価され、その後の Signal の変更を追跡しないためです。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1kehCW8e8EZs88giPjK7Ml/5c1c2b8917c838692061f1bdd6b7459d/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-01_17.00.48.mov" controls></video>

Signal の値に基づいて動的にテキストを更新するには、`@dom.text_dyn(fn() { ... })` を使用します。`text_dyn` は関数を引数として受け取り、その関数が返す値をテキストノードとして表示します。テキストノードは再レンダリングされるたびに遅延評価されるため、Signal の値が変更されると変更が反映されます。

```mbt:src/lib.mbt {5}
///|
fn counter() -> @dom.DomNode {
  let count = @signals.signal(0)
  @dom.div([
    @dom.h1([@dom.text_dyn(fn() { "Count: " + count.get().to_string() })]),
    @dom.div(class="buttons", [
      @dom.button(on=@dom.events().click(_ => count.update(fn(n) { n + 1 })), [
        @dom.text("+1"),
      ]),
      @dom.button(on=@dom.events().click(_ => count.update(fn(n) { n - 1 })), [
        @dom.text("-1"),
      ]),
    ]),
  ])
}
```

これで、ボタンをクリックして `count` の値を更新すると、表示されるテキストも自動的に更新されるようになりました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1zjYQzAS6I0afWGg5anzdk/476554e6df5f7142f3ddb4521f5340ce/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-01_17.03.57.mov" controls></video>

### effect で Signal の変更を監視する

`@signals.effect()` はコールバック関数を受け取り、その中で参照される Signal の変更を監視します。Signal の値が変更されると、effect 内の関数が再実行されます。これにより、Signal の変更に応じて副作用を発生させることができます。Signal の追跡は自動的に行われるため、明示的に依存関係を指定する必要はありません。

以下のコードでは、`count` の値が変更されるたびにコンソールに現在の値をログ出力しています。

```mbt:src/lib.mbt {4-6}
///|
fn counter() -> @dom.DomNode {
  let count = @signals.signal(0)
  let dispose = @signals.effect(fn() {
    @js_console.log(@js_core.any(count.get().to_string()))
  })
  @dom.div([
    @dom.h1([@dom.text_dyn(fn() { "Count: " + count.get().to_string() })]),
    @dom.div(class="buttons", [
      @dom.button(on=@dom.events().click(_ => count.update(fn(n) { n + 1 })), [
        @dom.text("+1"),
      ]),
      @dom.button(on=@dom.events().click(_ => count.update(fn(n) { n - 1 })), [
        @dom.text("-1"),
      ]),
    ]),
  ])
}
```

`console.log()` を呼び出すために `mizchi/js/web/console` と `mizchi/js/core` モジュールをインポートする必要があります。`@js_console.log()` は `mizchi/js/core/Any` 型の引数を受け取るため、`@js_core.any()` を使用して `String` 型を `Any` 型に変換しています。

```json:src/moon.pkg.json {15-22}
{
  "is-main": true,
  "supported-targets": ["js"],
  "import": [
    "mizchi/signals",
    {
      "path": "mizchi/luna/dom",
      "alias": "dom"
    },
    {
      "path": "mizchi/js/browser/dom",
      "alias": "js_dom"
    },
    {
      "path": "mizchi/js/web/console",
      "alias": "js_console"
    },
    {
      "path": "mizchi/js/core",
      "alias": "js_core"
    }
  ],
  "link": {
    "js": {
      "format": "esm"
    }
  }
}
```

ボタンをクリックするたびに `count` の値が更新され、コンソールに現在の値が出力されるようになりました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7pr1pghQKJPNx9Jec5Z9Gp/803809dd16f7cc49c3cbd21aa6f1c04b/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-02-01_17.24.45.mov" controls></video>

### Luna CSS で CSS を生成する

`mizchi/luna/x/css` モジュールを使用すると、以下の 2 つのアプローチで CSS を生成できます。

1. MoonBit Runtime: SSR 時にクラス名を生成する
2. 静的抽出: ビルド時に `.mbt` ファイルから CSS ファイルを生成する

どちらの方法でも DJB2 ハッシュアルゴリズムを使用して一貫したクラス名が生成されるため、スタイルの競合を防止できます。

`mizchi/luna/x/css` モジュールをインポートし、`@css` を使用できるようにしましょう。`src/moon.pkg.json` ファイルの `import` フィールドに追加します。

```json:src/moon.pkg.json {23-26}
{
  "is-main": true,
  "supported-targets": ["js"],
  "import": [
    "mizchi/signals",
    {
      "path": "mizchi/luna/dom",
      "alias": "dom"
    },
    {
      "path": "mizchi/js/browser/dom",
      "alias": "js_dom"
    },
    {
      "path": "mizchi/js/web/console",
      "alias": "js_console"
    },
    {
      "path": "mizchi/js/core",
      "alias": "js_core"
    },
    {
      "path": "mizchi/luna/x/css",
      "alias": "css"
    }
  ],
  "link": {
    "js": {
      "format": "esm"
    }
  }
}
```

CSS スタイルを定義するために `@css.styles()` を使用します。CSS のプロパティと値をタプルとして指定し、配列で複数のスタイルをまとめます。以下のコードでは、`.button` クラスに対して背景色、文字色、パディング、ボーダー、カーソルスタイルを定義しています。`@css.hover` のように擬似クラスもサポートされています。

作成したクラスは `@dom.button` の `class` プロパティに設定して使用します。

```mbt:src/lib.mbt {7-13, 20, 25}
///|
fn counter() -> @dom.DomNode {
  let count = @signals.signal(0)
  let dispose = @signals.effect(fn() {
    @js_console.log(@js_core.any(count.get().to_string()))
  })
  let button_style = @css.styles([
    ("background-color", "blue"),
    ("color", "white"),
    ("padding", "8px 16px"),
    ("border", "none"),
    ("cursor", "pointer"),
  ])
  let button_hover = @css.hover("background-color", "darkblue")
  @dom.div([
    @dom.h1([@dom.text_dyn(fn() { "Count: " + count.get().to_string() })]),
    @dom.div(class="buttons", [
      @dom.button(
        on=@dom.events().click(_ => count.update(fn(n) { n + 1 })),
        class=button_style + " " + button_hover,
        [@dom.text("+1")],
      ),
      @dom.button(
        on=@dom.events().click(_ => count.update(fn(n) { n - 1 })),
        class=button_style + " " + button_hover,
        [@dom.text("-1")],
      ),
    ]),
  ])
}
```

この時点ではまだ CSS は生成されていません。まずは `@luna_ui/luna` npm パッケージをインストールし、`vite.config.ts` ファイルで Luna CSS プラグインを有効化します。

```bash
npm install @luna_ui/luna -D
```

```ts:vite.config.ts {3, 11-14}
import { defineConfig } from "vite";
import { moonbit } from "vite-plugin-moonbit";
import { lunaCss } from "@luna_ui/luna/vite-plugin";

export default defineConfig({
  plugins: [
    moonbit({
      watch: true,
      showLogs: true,
    }),
    lunaCss({
      src: ["src"],
      verbose: true,
    }),
  ],
});
```

続いて `main.ts` ファイルでビルドされた Luna CSS のスタイルシートをインポートします。

```ts:main.ts {3}
// Import MoonBit module via mbt: prefix
import "mbt:internal/myapp";
import "virtual:luna.css";
```

最後に `luna css extract` コマンドを実行して、`src` ディレクトリ内の `.mbt` ファイルから CSS ファイルを生成します。

```bash
npx luna css extract src -o _build/styles.css
```

以下のような CSS ファイルが生成されます。

```css
._4753n {
  background-color: blue;
}
._2l2qn {
  color: white;
}
._5wakl {
  padding: 8px 16px;
}
._62ajx {
  border: none;
}
._6p3a6 {
  cursor: pointer;
}
._2s4fh:hover {
  background-color: darkblue;
}
```

確かにボタンにスタイルが適用されていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/1JthlRAhW7bacb0XI9ZrzQ/532bc41ccd1d9bfedf2c16ef9884bc04/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-01_17.50.16.png)

### コンポーネントライブラリ

Luna UI には [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) に基づいたアクセシブルなコンポーネントライブラリが用意されています。

スピンボタンコンポーネントを使用するために ` "mizchi/luna/x/components/styled/spinbutton"` と `mizchi/luna/dom/client` モジュールをインポートしましょう。`src/moon.pkg.json` ファイルの `import` フィールドに追加します。

```json:src/moon.pkg.json {27-31}
{
  "is-main": true,
  "supported-targets": ["js"],
  "import": [
    "mizchi/signals",
    {
      "path": "mizchi/luna/dom",
      "alias": "dom"
    },
    {
      "path": "mizchi/js/browser/dom",
      "alias": "js_dom"
    },
    {
      "path": "mizchi/js/web/console",
      "alias": "js_console"
    },
    {
      "path": "mizchi/js/core",
      "alias": "js_core"
    },
    {
      "path": "mizchi/luna/x/css",
      "alias": "css"
    },
    {
      "path": "mizchi/luna/dom/client",
      "alias": "dom_client"
    },
    "mizchi/luna/x/components/styled/spinbutton"
  ],
  "link": {
    "js": {
      "format": "esm"
    }
  }
}
```

既存の Button 要素を `spinbutton` コンポーネントに置き換えます。`spinbutton` コンポーネントは [Spinbutton Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/) に基づいており、現在の値を表示するテキストフィールド、増加ボタン、減少ボタンの3つのコンポーネントで構成されます。

`@spinbutton.spinbutton()` 関数は `@mizchi/luna/core.Node[@js_core.Any, String]` 型を返すので、`@dom_client.render_vnode_to_dom` で `@js_dom.Node` 型に変換してからさらに `@dom.dom_node()` で `@dom.DomNode` 型に変換しています。

```mbt:src/lib.mbt {9-11}
///|
fn counter() -> @dom.DomNode {
  let count = @signals.signal(0.0)
  let dispose = @signals.effect(fn() {
    @js_console.log(@js_core.any(count.get().to_string()))
  })
  @dom.div([
    @dom.h1([@dom.text_dyn(fn() { "Count: " + count.get().to_string() })]),
    @spinbutton.spinbutton(count, min=0.0, max=10.0, step=1.0, label="Counter")
    |> @dom_client.render_vnode_to_dom
    |> @dom.dom_node,
  ])
}
```

これでスピンボタンコンポーネントが表示され、増加・減少ボタンをクリックすると `count` の値が更新されるようになりました。BEM 命名規則に基づいたクラス名がコンポーネントの各要素に割り当てられているため、このクラスを使用してスタイルをカスタマイズすることも可能です。`.spinbutton` や `.spinbutton__button` などのクラス名が割り当てられています。

![](https://images.ctfassets.net/in6v9lxmm5c8/5thEYEpv1bSgTc7xWZAUlg/204556066ec78df574514e4fa74f0b6d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-01_18.41.48.png)

## まとめ

- Luna UI は MoonBit または JavaScript/TypeScript 向けの宣言型 UI ライブラリ
- Signals を使用してリアクティブな状態管理を実現
- `@dom.div` や `@dom.button` などの関数を使用してコンポーネントを作成
- `@signals.signal()` で Signal を作成し、`get()` で値を取得、`set()` や `update()` で値を更新
- Signal の変更に応じて動的にテキストを更新するには `@dom.text_dyn(fn() { ... })` を使用
- `@signals.effect()` で Signal の変更を監視し、副作用を発生
- `mizchi/luna/x/css` モジュールで CSS を生成し、スタイルを適用
- Luna UI のコンポーネントライブラリを使用してアクセシブルな UI コンポーネントを構築

## 参考

- [Luna UI](https://luna.mizchi.workers.dev/)
- [mizchi/luna](https://mooncakes.io/docs/mizchi/luna)
- [mizchi/js](https://mooncakes.io/docs/mizchi/js)
- [mizchi/signals](https://mooncakes.io/docs/mizchi/signals)
- [Luna UI - JS/Moonbit のための宣言的UI. 軽量、高速、そして WebComponents First](https://zenn.dev/mizchi/articles/moonbit-luna-ui#%E6%88%90%E6%9E%9C%E7%89%A9)
