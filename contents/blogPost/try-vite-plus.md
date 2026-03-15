---
id: LQ6_CO4Cy8vVytInc2QE0
title: "新時代のフロントエンドツールチェイン Vite+ を試してみた"
slug: "try-vite-plus"
about: "Vite+ は Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown といった人気のツールを統合し、開発, テスト, ビルド, リント, フォーマットなどのフロントエンド開発に必要な機能を1つのツールチェインで提供する新しいフロントエンドツールチェインです。この記事では実際に Vite+ をインストールして、プロジェクトのセットアップから開発、テスト、ビルドまでの一連の流れを試してみました。"
createdAt: "2026-03-13T19:43+09:00"
updatedAt: "2026-03-13T19:43+09:00"
tags: ["Vite+"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7B9npWIfg7zDu4KcDK3DVB/d95214f8c8440da235139245f461b48d/power-stone-image_23103-768x768.png"
  title: "パワーストーンのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`vp test` コマンドの説明として正しいものはどれですか？"
      answers:
        - text: "設定は `vite.config.js` ファイルの `test` フィールドで行う"
          correct: true
          explanation: null
        - text: "デフォルトで watch モードで実行される"
          correct: false
          explanation: "Vitest はデフォルトで watch モードで実行されますが、`vp test` はデフォルトでは watch モードで実行されません。"
        - text: "`--watch` フラグを付けることで watch モードで実行できる"
          correct: false
          explanation: "watch モードを使用する場合は `--watch` フラグではなく、`vp test watch` サブコマンドを使用します。"
        - text: "Jest を使用してテストを実行する"
          correct: false
          explanation: "`vp test` は Jest ではなく Vitest を使用してテストを実行します。"
    - question: "vp env pin コマンドでローカルプロジェクトの Node.js のバージョンを管理するために作成されるファイルはどれですか？"
      answers:
        - text: ".node-version"
          correct: true
          explanation: null
        - text: ".nvmrc"
          correct: false
          explanation: null
        - text: ".vp-node-version"
          correct: false
          explanation: null
        - text: "package.json の `engines.node` フィールド"
          correct: false
          explanation: null
published: true
---
近年の Web 開発のプロセスはますます複雑化しています。フロントエンドの構築のためには、モジュールバンドラー, トランスパイラー, リンター, テストランナーなど、多くのツールが必要になりますが、設定ファイルも複雑になりがちです。Webpack の設定のために専門の職人が必要になるという話もよく聞きましたね。現代でも `.eslintrc`, `.prettierrc`, `jest.config.js`, `tsconfig.json` など、プロジェクトのルートディレクトリには多くの設定ファイルが存在することが一般的です。このような Web 開発のプロセスを簡略化することを目的に [Vite+](https://viteplus.dev/) が [VoidZero](https://voidzero.dev/) 社によって開発されました。

Vite+ は Vite（開発サーバー）, Vitest（テストランナー）, Oxlint（高速リンター）, Oxfmt（高速フォーマッター）, Rolldown（Rust 製バンドラー）, tsdown（TypeScript ライブラリビルダー）といった人気のツールを統合し、開発, テスト, ビルド, リント, フォーマットなどのフロントエンド開発に必要な機能を 1 つのツールチェインで提供します。また新しいタスクランナーである Vite Task を採用しており、Node.js のランタイムやパッケージマネージャーも Vite+ が管理することで、プロジェクトごとに異なる環境を簡単に切り替えることができます。

この記事では実際に Vite+ をインストールして、プロジェクトのセットアップから開発、テスト、ビルドまでの一連の流れを試してみました。

## Vite+ のインストールとプロジェクトのセットアップ

Vite+ はグローバルなコマンドラインツール `vp` を提供しています。以下のコマンドを実行して `vp` をインストールします。

```bash
# macOS/Linux
curl -fsSL https://vite.plus | bash
# Windows (PowerShell)
irm https://vite.plus/ps1 | iex
```

`vp` コマンドは Node.js のバージョン管理も行っています。対話形式で Node.js のバージョン管理を `vp` に任せるかどうかを聞かれるので、ここでは「Y」を選択してみます。

```bash
$ curl -fsSL https://vite.plus | bash
Setting up VITE+...

Would you want Vite+ to manage Node.js versions?
Press Enter to accept (Y/n):
```

インストールが完了したら `source ~/.zshrc` を実行してシェルの設定をリロードします。これで `vp` コマンドが使えるようになります。

```bash
$ vp --version
VITE+ - The Unified Toolchain for the Web

vp v0.1.11

Local vite-plus:
  vite-plus  Not found

Tools:
  vite             Not found
  rolldown         Not found
  vitest           Not found
  oxfmt            Not found
  oxlint           Not found
  oxlint-tsgolint  Not found
  tsdown           Not found
```

早速 Vite+ を使ってプロジェクトをセットアップしてみましょう。`vp create` コマンドを実行すると、プロジェクトのセットアップが対話形式で進められます。3 つのテンプレートが用意されているので、ここでは「Vite+ Application」を選択してみます。

```bash
$ vp create
VITE+ - The Unified Toolchain for the Web

    Vite+ Monorepo: Create a new Vite+ monorepo project
  › Vite+ Application: Create vite applications
    Vite+ Library: Create vite libraries
```

プロジェクト名や使用しているコーディングエージェントの選択など、いくつかの質問に答えるとプロジェクトのセットアップが完了します。

![](https://images.ctfassets.net/in6v9lxmm5c8/22wX9wosPDQYRQy854TyL9/1bed9429c13a0c7f344598aad1fee488/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-13_20.08.55.png)

依存関係のインストールは `vp install` コマンドで行います。このコマンドはプロジェクトでどのパッケージマネージャー（npm, pnpm, yarn）を使用しているかを自動的に検出し、適切なコマンドを実行してくれます。パッケージマネージャーの検出は以下の順序で行われます。

1. `package.json` の `packageManager` フィールドを確認
2. `pnpm-workspace.yaml` ファイルの存在を確認
3. `pnpm-lock.yaml` ファイルの存在を確認
4. `yarn.lock` もしくは `.yarnrc.yml` ファイルの存在を確認
5. `package-lock.json` ファイルの存在を確認
6. `.pnpmfile.cjs` もしくは `pnpmfile.cjs` ファイルの存在を確認
7. `yarn.config.cjs` ファイルの存在を確認
8. どのファイルも見つからない場合は pnpm にフォールバック

Vite+ Application テンプレートでは `package.json` の `packageManager` フィールドに `npm` が指定されているため、`vp install` コマンドを実行すると npm を使用して依存関係がインストールされます。

```json:package.json
{
  "packageManager": "npm@11.11.1"
}
```

```bash
vp install
```

インストールが完了したら、`vp dev` コマンドで開発サーバーを起動してみましょう。Vite+ では `dev`, `build`, `test`, `lint`, `format` といった一般的なタスクがあらかじめ定義されています。`vp dev` コマンドは Vite の開発サーバーを起動するタスクです。

```bash
vp dev
```

http://localhost:5173 にアクセスすると、Vite+ Application テンプレートのデモページが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/33NcsltB9TADguYoyRs7sn/8d3c135e978534a1b57dd4175359d6f9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-13_20.21.18.png)

## Node.js のバージョン管理

`vp env` コマンドでグローバルおよびプロジェクト単位で Node.js のバージョンを管理できます。デフォルトでは `~/.vite-plus/js_runtime/node` ディレクトリに Node.js のバージョンがインストールされます。デフォルトではマネージドモードとなっており、`node`, `npm` コマンドや関連する shims コマンドを実行すると Vite+ によって解決され、現在のプロジェクトに適したバージョンの Node.js が使用されます。この動作は `vp env on` で有効化され、`vp env off` で無効化されます。

`vp env pin` コマンドでプロジェクトで使用する Node.js のバージョンを指定できます。以下のコマンドを実行するとプロジェクトのルートディレクトリに `.node-version` ファイルが作成され、22.22.1 の Node.js がインストールされます。

```bash
vp env pin 22
```

既に `.node-version` ファイルが存在する場合は、以下のコマンドで指定したバージョンに更新できます。

```bash
vp env install
```

`vp env current` コマンドで現在使用されている Node.js のバージョンを確認できます。

```bash
$ vp env current

VITE+ - The Unified Toolchain for the Web

Environment:
  Version       22.22.1
  Source        .node-version
  Source Path   /Users/xxx/sandbox/proceed-defense/.node-version
  Project Root  /Users/xxx/sandbox/proceed-defense

Tool Paths:
  node  /Users/xxx/.vite-plus/js_runtime/node/22.22.1/bin/node
  npm   /Users/xxx/.vite-plus/js_runtime/node/22.22.1/bin/npm
  npx   /Users/xxx/.vite-plus/js_runtime/node/22.22.1/bin/npx
```

## フォーマット・リンティング・型チェック

`vp check` コマンドで `oxfmt` によるコードのフォーマット、`oxlint` によるコードのリンティング、`tsgolint`（TypeScript の型チェックに特化した Oxlint の拡張）による型チェックをまとめて実行できます。これらのタスクを単一のコマンドに統合することで、別々のコマンドで実行するよりも高速になります。

```bash
$ vp check
VITE+ - The Unified Toolchain for the Web

pass: All 9 files are correctly formatted (233ms, 8 threads)
pass: Found no warnings, lint errors, or type errors in 3 files (896ms, 8 threads)
```

リントの設定は `vite.config.ts` の `lint` フィールドで、フォーマットの設定は `vite.config.ts` の `fmt` フィールドでそれぞれ行います。詳細な設定項目は [oxlint のドキュメント](https://oxc.rs/docs/guide/usage/linter/config.html) と [oxfmt のドキュメント](https://oxc.rs/docs/guide/usage/formatter/config.html) を参照してください。

```ts:vite.config.ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    options: { typeAware: true, typeCheck: true },
    rules: {
      "no-alert": "error",
    },
  },
  fmt: {
    printWidth: 120,
  },
});
```

`lint` フィールドの `options` で `typeCheck` を `true` に設定すると、型チェック `tsgolint` による型チェックもリントの一部として実行されるようになります。型チェックを別のコマンドで定義する必要がないので、この項目を有効にすることが推奨されます。

## テストの実行

`vp test` コマンドで Vitest を使用してテストを実行できます。Vitest と異なり `test` コマンドはデフォルトで `watch` モードで実行されない点に注意してください。`watch` モードでテストを実行したい場合は、`test watch` コマンドを使用します。

```bash
vp test
# watch モードでテストを実行する場合
vp test watch
```

テストの設定は `vite.config.ts` の `test` フィールドで行います。詳細な設定項目は [Vitest のドキュメント](https://vitest.dev/config/) を参照してください。

```ts:vite.config.ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    maxWorkers: 4,
  },
});
```

## タスク定義

`vp run` コマンドは `package.json` の `scripts` フィールドに定義されたスクリプトもしくは `vite.config.ts` の `run.tasks` フィールドに定義されたタスクを実行します。タスクのキャッシュや依存関係、ワークスペースを考慮した実行機能が組み込まれています。

`vite.config.ts` の `run.tasks` フィールドにタスクを定義することで、キャッシュや依存関係の指定など、`package.json` の `scripts` フィールドに定義するよりも柔軟にタスクを定義できます。なお、`package.json` の `scripts` フィールドに定義されたスクリプト名と同じ名前のタスクを指定できません。`package.json` の `scripts` フィールドに定義されたスクリプトはデフォルトでキャッシュされず、`vite.config.ts` の `run.tasks` フィールドに定義されたタスクはデフォルトでキャッシュされるという違いもあります。

```ts:vite.config.ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  run: {
    tasks: {
      build: {
        command: "./build.sh",
        // `build` タスクを実行する前に `lint` タスクを実行するように指定
        dependsOn: ["lint"],
        // キャッシュに影響を与える環境変数を指定
        // キャッシュはデフォルトで有効
        env: ["NODE_ENV"],
      },
      deploy: {
        command: "./deploy.sh",
        dependsOn: ["build"],
        cache: false,
      },
    },
  },
});
```

完全なタスク定義の例は [Vite+ のドキュメント](https://viteplus.dev/config/run) を参照してください。

`vpx` コマンドは `npx` や `pnpx` と同様に、npm パッケージをインストールせずに実行できるコマンドです。

```bash
$ vpx cowsay "Hello, Vite+!"

 ______________
< Hello, Vite+ >
 --------------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## ビルド

`vp build` コマンドは Vite 8 と Rolldown を使用してプロジェクトをビルドします。

```bash
vp build
```

ビルドの設定は `vite.config.ts` で行います。詳細な設定項目は [Vite のドキュメント](https://vite.dev/config/) を参照してください。

```ts:vite.config.ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    outDir: "dist",
  },
});
```

本番ビルド後に `vp preview` コマンドを実行すると、ビルドされたファイルをローカルサーバーでプレビューできます。

```bash
vp preview
```

`vp pack` コマンドは `tsdown` を使用してライブラリとしてプロジェクトをビルドします。`tsdown` は TypeScript プロジェクトをビルドするためのツールで、型定義ファイルの生成や CommonJS と ES Modules の両方の形式での出力など、ライブラリ開発に必要な機能を提供します。

```bash
vp pack
```

設定は `vite.config.ts` の `pack` フィールドで行います。詳細な設定項目は [tsdown のドキュメント](https://tsdown.dev/options/config-file) を参照してください。

```ts:vite.config.ts
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    dts: true,
    formats: ["cjs", "esm"],
    sourceMap: true,
  },
});
```

## 既存のプロジェクトへの導入

既に Vite を使用しているプロジェクトを Vite+ に移行するために `vp migrate` コマンドが提供されています。`vp migrate` コマンドを実行するためには `Vite 8` 以降と `Vitest 4.1` 以降が必要であることに注意してください。

```bash
vp migrate
```

## まとめ

- Vite+ は Vite, Vitest, Oxlint, Oxfmt, Rolldown, tsdown といった人気のツールを統合し、開発, テスト, ビルド, リント, フォーマットなどのフロントエンド開発に必要な機能を 1 つのツールチェインで提供する新しいフロントエンドツールチェイン
- Node.js のランタイムやパッケージマネージャーも Vite+ が管理することで、プロジェクトごとに異なる環境を簡単に切り替えることができる
- `vp` コマンドを使用してプロジェクトのセットアップから開発、テスト、ビルドまでの一連の流れを簡単に実行できる

## 参考

- [Announcing Vite+ Alpha | VoidZero](https://voidzero.dev/posts/announcing-vite-plus-alpha)
- [Vite+ | The Unified Toolchain for the Web](https://viteplus.dev/)
- [voidzero-dev/vite-plus: Vite+ is the unified toolchain and entry point for web development. It manages your runtime, package manager, and frontend toolchain in one place.](https://github.com/voidzero-dev/vite-plus)
- [voidzero-dev/vite-task](https://github.com/voidzero-dev/vite-task)
