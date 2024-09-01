---
id: yzD_QIJ9rJbnmWEPUfLgq
title: "フィーチャーフラグの標準規格 OpenFeature の React SDK を試してみる"
slug: "openfeature-react-sdk"
about: "OpenFeature はフィーチャーフラグのオープンな規格です。特定のベンダーに依存しない API や SDK が提供されています。フィーチャーフラグの API の標準化により、ベンダーロックインを回避し、フィーチャーフラグのツールを自由に選択できるようになります。この記事では OpenFeature の React SDK を使ってフィーチャーフラグを評価する方法を紹介します。"
createdAt: "2024-08-31T16:56+09:00"
updatedAt: "2024-08-31T16:56+09:00"
tags: ["OpenFeature", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7gUvQ0TLoUwDnc4MlLHGJj/ed3f4216df5665019a9b6eab54ee7a7f/kakigoori-hata_illust_3368.png"
  title: "かき氷旗のイラスト"
selfAssessment:
  quizzes:
    - question: "OpenFeature の React SDK でフィーチャーフラグが評価された値を取得するためのフックはどれですか？"
      answers:
        - text: "useFeatureFlag"
          correct: false
          explanation: ""
        - text: "useFlag"
          correct: true
          explanation: ""
        - text: "useFeature"
          correct: false
          explanation: ""
        - text: "useOpenFeature"
          correct: false
          explanation: ""

published: true
---

OpenFeature はフィーチャーフラグのオープンな規格です。特定のベンダーに依存しない API や SDK が提供されています。

https://openfeature.dev/

## フィーチャーフラグとは

フィーチャーフラグとは、新機能のリリースや既存の機能の変更を簡単に行うための手法です。コード内にフラグを埋め込むことで、機能の ON/OFF を容易に切り替えることができます。例えば React 製のアプリケーションで新しい画面を追加する場合、以下のようにフィーチャーフラグを使って出し分けを行うことができます。

```tsx
export const App = () => {
  const { isEnabled } = useFeatureFlag("newScreen");

  return <div>{isEnabled ? <NewScreen /> : <OldScreen />}</div>;
};
```

フィーチャーフラグを使用することで、以下のようなメリットがあります。

- 開発中に細かい単位で PR をメインブランチにマージできる（[トランクベース開発](https://trunkbaseddevelopment.com/)）
- 新機能の公開に際して、デプロイ作業を行わずに、フラグを切り替えるだけでよい
- 特定のユーザーのみに新機能を公開することができる
- 新機能に不具合があった場合でも、できる新即座に切り戻しが可能

一方でフィーチャーフラグを導入することで、その分管理コストも増えることになります。機能の追加のたびにフィーチャーフラグを追加すると、そのたびにフラグの数が増えていくため、どのフラグがどこで使われているのかを把握することが難しくなります。また、単純にコードの中で条件分岐が 1 つ増えることになりますので、コードの複雑性も増していきます。

## なぜフィーチャーフラグの標準化を目指すのか

はじめのうちはフィーチャーフラグの管理のために内製のツールを使っていても問題ないかもしれません。しかし、フィーチャーフラグの数が増えてくると、その管理コストが増えていき、フィーチャーフラグのツールの実装自体に多大な時間を費やすことになります。

このようなタイミングで、サードパーティ製のフィーチャーフラグのツールを導入することが考えられます。現在フィーチャーフラグを実現するために多数のサービスが存在しています。

- [LaunchDarkly](https://launchdarkly.com/)
- [Split](https://www.split.io/)
- [ConfigCat](https://configcat.com/)
- [Optimizely](https://www.optimizely.com/)
- [Unleash](https://unleash.github.io/)
- [AWS AppConfig](https://docs.aws.amazon.com/ja_jp/appconfig/latest/userguide/what-is-appconfig.html)

これらのサービスはそれぞれ独自の API や SDK を提供しています。フィーチャーフラグの仕様の標準化を目指すことで、ベンダーロックインを回避し、フィーチャーフラグのツールを自由に選択できるようになることが OpenFeature の目的です。

![](https://images.ctfassets.net/in6v9lxmm5c8/lQ6PUDEeiJ7ypXjrOjsi9/7de04d05f39fa327fd97dbdddc604a82/of-architecture-a49b167df4037d936bd6623907d84de1.png)

https://openfeature.dev/docs/reference/intro/#what-is-openfeature より引用。

これを実現するために、OpenFeature の SDK は抽象化された概念を提供しています。

- Evaluation API：フィーチャーフラグを評価する
- Evaluation Context：Web アプリケーションのクライアント IP のように、動的な評価に使われるデータのコンテキスト
- Providers：Evaluation API とフラグ管理サービスの間の変換レイヤー
- Hooks：フィーチャーフラグの評価ライフサイクルで任意の動作を実行するためのフック
- Events：プロバイダーもしくはフラグ管理サービスの状態の変化を購読する

## React SDK を試してみる

OpenFeature では言語ごとに SDK を提供しています。この記事では React SDK を試してみます。

以下のコマンドでインストールします。

```sh
npm install --save @openfeature/react-sdk
```

React SDK は `OpenFeatureProvider` という [React コンテキストのプロバイダー](https://react.dev/reference/react/createContext#provider) により、フィーチャーフラグの評価のスコープを定義します。`flagConfig` オブジェクトでフラグの設定を定義し、これを `InMemoryProvider` に渡して [Provider](https://openfeature.dev/specification/sections/providers) を設定します。この Provider により OpenFeature の API に変換されるため、サードパーティ製のフィーチャーフラグのツールを使う場合でも、同じ方法でフラグの評価を行うことができます。

```tsx
import {
  EvaluationContext,
  OpenFeatureProvider,
  useFlag,
  OpenFeature,
  InMemoryProvider,
} from "@openfeature/react-sdk";
import { Dashboard } from "./Dashboard";

type FlagConfiguration = ConstructorParameters<typeof InMemoryProvider>[0];

const flagConfig: FlagConfiguration = {
  // フラグの機能をキーとして設定
  "ai-assistant": {
    // 機能フラグが有効化どうか
    disabled: false,
    // フラグが取りうる値をマッピングする
    variants: {
      on: true,
      off: false,
    },
    // デフォルト値
    defaultVariant: "on",
  },
};

OpenFeature.setProvider(new InMemoryProvider(flagConfig));

function App() {
  return (
    <OpenFeatureProvider>
      <Dashboard />
    </OpenFeatureProvider>
  );
}

export default App;
```

`flagConfig` オブジェクトは機能名をキーとして、フラグの設定を定義します。`InMemoryProvider` はメモリ上にフラグの設定を保持するプロバイダーで、テスト用途などで利用されます。実際の環境では、ベンダーにより提供された Provider を使うことになるでしょう。

どのベンダーから Provider が提供されているかについては、[Ecosystem | OpenFeature](https://openfeature.dev/ecosystem) を参照してください。例えば ConfigCat から Web 向けの Provider が提供されています。

https://github.com/open-feature/js-sdk-contrib/tree/main/libs/providers/config-cat-web

`<OpenFeatureProvider>` のスコープ内では `useFlag` フックを使ってフラグの評価を行います。`useFlag` の第 1 引数に機能名、第 2 引数にデフォルト値を渡すことで、フラグの評価結果を取得できます。

```tsx:Dashboard.tsx
import { useFlag } from "@openfeature/react-sdk";

export const Dashboard = () => {
  const flag = useFlag("ai-assistant", false);

  return (
    <div>
      <h1>ダッシュボード</h1>
      {flag.value && <button>AI で生成</button>}
    </div>
  );
};
```

### コンテキストにより動的にフラグを評価する

フィーチャーフラグを用いて、特定のユーザーのみに新機能を公開したいことがあります。例えば、社内のユーザーのみに新機能を公開して本番環境で安全にテストを行ったり、AB テストを行いたい場合などです。

特定のユーザー ID の場合にフラグを `on` に設定する例を見てみましょう。Provider に渡す `flagConfig` オブジェクトのプロパティに `contextEvaluator` を追加します。このプロパティはコンテキストを引数に受け取る関数を指定して、`variants` プロパティの値を返します。

```tsx {9-14}
const flagConfig: FlagConfiguration = {
  "ai-assistant": {
    disabled: false,
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
    contextEvaluator(ctx) {
      if (ctx.userId === "123") {
        return "on";
      } else {
        return "off";
      }
    },
  },
};
```

`userId` が `"123"` の場合には AI アシスタント機能が有効化され、それ以外の場合には無効化されるようになります。`OpenFeature.setProvider` で Provider を設定する際に、コンテキストのデフォルト値を渡します。

```tsx
OpenFeature.setProvider(new InMemoryProvider(flagConfig, { userId: "999" }));
```

コンテキストの初期値には `"999"` を設定していますので、`useFlag` フックを使うと、`off` が返される機能が表示されないことが確認できます。

コンテキストの値は動的に変更できます。例えば、ユーザーがログインし直したときには別のユーザー ID をコンテキストの値として設定したしはずです。`OpenFeature.setContext()` メソッドを呼び出すことで、Provider に新しいコンテキストを渡すことができます。

```tsx
function App() {
  const handleChange = (e) => {
    OpenFeature.setContext({ userId: e.target.value });
  };

  return (
    <OpenFeatureProvider>
      <Dashboard />
      <select onChange={handleChange}>
        <option value="999">ユーザー 1</option>
        <option value="123">ユーザー 2</option>
      </select>
    </OpenFeatureProvider>
  );
}
```

セレクタボックスの値を変更するとコンテキストの値が変更され、コンポーネントが再レンダリングされます。`userId` が `"123"` の「ユーザー 2」を選択すると、AI アシスタント機能のボタンが表示されることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4pN1MGE6q8SWMEklufJQ0d/efc26a1413474652ccd71fba5f419799/_____2024-09-01_20.17.00.mov" controls></video>

### テスト

テスト向けの用途として、`<OpenFeatureProvider>` コンポーネントが用意されています。`<OpenFeatureProvider>` に値を渡すことで、簡単に `useFlag` の値を設定できます。

`<Dashboard>` コンポーネントをテストする例を見てみましょう。`<OpenFeatureProvider>`　でコンポーネントラップして、ON と OFF の状態をそれぞれテストします。

```tsx:Dashboard.test.tsx
import { render, screen } from "@testing-library/react";
import { OpenFeatureProvider } from "@openfeature/react-sdk";

import { Dashboard } from "./Dashboard";

describe("Dashboard", () => {
  it("ai-assistant が ON の場合にボタンが表示される", () => {
    render(
      <OpenFeatureProvider flagValueMap={{ "ai-assistant": true }}>
        <Dashboard />
      </OpenFeatureProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("ai-assistant が OFF の場合にボタンが表示されない", () => {
    render(
      <OpenFeatureProvider flagValueMap={{ "ai-assistant": false }}>
        <Dashboard />
      </OpenFeatureProvider>
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

フラグが評価されるまでの遅延を再現したい場合、`delayMs` を設定できます。下記の例では、1000ms の遅延を設定しています。

```tsx
<OpenFeatureProvider flagValueMap={{ "ai-assistant": false }} delayMs={1000}>
  <Dashboard />
</OpenFeatureProvider>
```

## ConfigCat との連携

個々まではテスト用途に `InMemoryProvider` を使っていましたが、実際に [ConfigCat](https://configcat.com/) と連携する例を見てみましょう。まずは ConfigCat から提供されている Provider をインストールします。

```sh
npm install @openfeature/config-cat-web-provider
```

ConfigCat に Sign Up して、「ADD FEATURE FLAG」ボタンをクリックして新しいフラグを作成します。フラグのキーは `ai-assistant` とします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2TkCTA6MeQuEnSNg9ok8mt/1a17196a20641edf876c424288b73f58/__________2024-09-01_19.50.57.png)

そして、「VIEW SDK KEY」ボタンをクリックして、 `SDK Key` をコピーします。

React のコードに戻り、`ConfigCatWebProvider.create()` を呼び出して Provider を作成します。`create()` メソッドの引数には先程コピーした `SDK Key` を渡します。

```tsx
import { ConfigCatWebProvider } from "@openfeature/config-cat-web-provider";

const provider = ConfigCatWebProvider.create("<sdk_key>");
OpenFeature.setProvider(provider);
```

ConfigCat の管理画面で `ai-assistant` フラグを ON に設定し、「SAVE & PUBLISH」ボタンをクリックします。これで、`ai-assistant` フラグが ON になり、`<Dashboard>` コンポーネントでボタンが表示されるようになります。アプリケーションのコードはほとんど変更することなく Provider を切り替えることができました。

## まとめ

- OpenFeature はフィーチャーフラグの標準化を目指すプロジェクト
- フィーチャーフラグの API の標準化により、ベンダーロックインを回避し、フィーチャーフラグのツールを自由に選択できるようになる
- React 向けの SDK が提供されており、抽象化された概念を提供している
- テスト用途には `InMemoryProvider` を使うことができる
- ConfigCat により提供されている `ConfigCatWebProvider` を使うことで、ConfigCat と連携することができる

## 参考

- [OpenFeature](https://openfeature.dev/)
- [OpenFeature - Windymeltの公開メモ帳](https://scrapbox.io/windymelt/OpenFeature)
- [Feature Flag Deep Dive - Speaker Deck](https://speakerdeck.com/biwashi/feature-flag-deep-dive)
- [フィーチャーフラグを管理するためのOpenFeature | フューチャー技術ブログ](https://future-architect.github.io/articles/20230621a/)
