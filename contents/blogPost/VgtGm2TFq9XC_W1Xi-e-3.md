---
id: VgtGm2TFq9XC_W1Xi-e-3
title: "Vercel で Feature Flags を制御する"
slug: "vercel-feature-flags"
about: "今日のアプリケーション開発において、Feature Flags（機能フラグ）は欠かせないツールとなっています。Vercel Flags を使用することで、Vercel 上でホストされているアプリケーションに Feature Flags を簡単に導入することができます。この記事では、Vercel Flags を使用して Vercel 上でホストされているアプリケーションに Feature Flags を導入する方法を試してみます。"
createdAt: "2026-06-24T19:37+09:00"
updatedAt: "2026-06-24T19:37+09:00"
tags: ["Vercel", "Feature Flags", "Next.js"]
thumbnail:
  url: "ハイビスカス付きのトロピカルジュースのイラスト"
  title: "https://images.ctfassets.net/in6v9lxmm5c8/19go4RnlygrUW9dzto1xQA/beea9aaffea99561c547e5b4d800d5ea/tropical-juice_illust_3388-768x798.png"
audio: null
selfAssessment:
  quizzes:
    - question: "Flags Explorer（Vercel Toolbar）によるフラグの自動登録機能を使うために、Next.js アプリケーションに追加する必要があるものは何ですか?"
      answers:
        - text: "`middleware.ts` にフラグ検証用のミドルウェアを追加する"
          correct: false
          explanation: "記事ではミドルウェアではなく、フラグ検出エンドポイントの作成が必要と説明されています。"
        - text: "`next.config.ts` に環境変数 `FLAGS_SECRET` を直接ハードコードする"
          correct: false
          explanation: "`FLAGS_SECRET` はフラグ作成時に自動でプロジェクトの環境変数に追加されるもので、設定ファイルへのハードコードは記事で案内されていません。"
        - text: "`.well-known/vercel/flags` というフラグ検出エンドポイントを追加する"
          correct: true
          explanation: "記事の通り、`app/.well-known/vercel/flags/route.ts` を作成し、`createFlagsDiscoveryEndpoint` でエンドポイントを定義する必要があります。"
        - text: "ダッシュボードからフラグを手動で1つずつ再作成する"
          correct: false
          explanation: "自動登録機能はコードからフラグをドラフト状態で登録する仕組みであり、手動再作成は不要です。"

    - question: "特定のユーザーにのみフラグを有効化する際に定義する `identify` 関数の役割として、記事で説明されているのはどれですか?"
      answers:
        - text: "フラグの状態を取得する際に、ユーザーなどエンティティの情報を Vercel Flags に送信する"
          correct: true
          explanation: "記事の通り、`identify` 関数はフラグ評価時にエンティティ情報を Vercel Flags へ渡し、条件に応じた出し分けを可能にします。"
        - text: "ダッシュボード上でセグメントやフィルタールールを自動生成する"
          correct: false
          explanation: "セグメントやフィルタールールはダッシュボード上で手動で作成するものであり、`identify` 関数が生成するわけではありません。"
        - text: "未ログインユーザーをログインページへリダイレクトする"
          correct: false
          explanation: "`identify` は認証情報からエンティティ属性を返す関数で、リダイレクト処理は担いません。"
        - text: "同じリクエスト内での重複呼び出しをキャッシュする"
          correct: false
          explanation: "重複呼び出しのキャッシュは `dedupe` 関数の役割であり、`identify` 自体の役割ではありません。"

published: true
---

今日のアプリケーション開発において、Feature Flags（機能フラグ）は欠かせないツールとなっています。Feature Flags とは、コードベースに新しい機能を追加しながらも、その機能を特定のユーザーや環境でのみ有効にすることができる仕組みです。コードでは以下のような条件分岐で使用されることが一般的です。

```tsx
if (isFeatureEnabled('new-feature')) {
  return <NewFeatureComponent />;
} else {
  return <OldFeatureComponent />;
}
```

Feature Flags を使用することで以下のようなメリットがあります。

- 本番環境へのデプロイと機能のリリースを分離できるため、ビジネスの要件に応じて柔軟に機能をリリースできる。例えば 0 時に新機能をリリースしたい場合、Feature Flags を使用すればコードは事前にデプロイしておいて、0 時になったらフラグをオンにするだけでリリースできるため、不安定なデプロイによるリスクを減らせる。
- 特定のユーザーだけに新機能をリリースして、ユーザーテストやフィードバック収集を行うことができる。新機能に障害があったとしても、影響を受けるユーザーを限定でき、即座にフラグをオフにすることで問題を緩和できる。
- 機能が未完成の状態でもコードベースにマージしておくことができるため、[トランクベース開発](https://trunkbaseddevelopment.com/)のワークフローを促進できる。

一方で、Feature Flags を使用する際には運用上の注意点もあります。フラグによる出し分け自体はコードベースに条件分岐を増やすことになるため、フラグの数が増えすぎるとコードの複雑性が増し、バグの温床になりかねません。また、フラグの状態を適切に管理しないと、不要なフラグが残り続けてコードベースを汚染することになります。本番のアプリケーションに導入するには、フラグの状態を管理するためのダッシュボードや、フラグの有効化・無効化を即座に反映できる仕組みがかかせません。Feature Flags 機能を提供する SaaS プロバイダーもいくつか存在します。

そんな中 Vercel も [Vercel Flags](https://vercel.com/docs/flags/vercel-flags) ダッシュボードをリリースし、Vercel 上でホストされているアプリケーションに対して Feature Flags を提供するようになりました。Vercel 上でホストされているアプリケーションは、外部の Feature Flags サービスを使用することなく、Vercel のダッシュボードからフラグの状態を管理できるというメリットがあります。デプロイメントとフラグの管理が同じプラットフォーム上で完結するため、運用の手間も減らせます。

アプリケーションのコードからは [Flags sdk](https://flags-sdk.dev/) を使用することで簡単に Vercel のダッシュボードに接続してフラグの状態を取得することができます。コード上で定義したフラグは Vercel のダッシュボードに自動的に反映されるため、手動で利用しているフラグの管理を行う必要がありません。

この記事では、Vercel Flags を使用して Vercel 上でホストされているアプリケーションに Feature Flags を導入する方法を試してみます。

## Vercel Flags を使用して Feature Flags を導入する

Next.js アプリケーションを例に、Vercel Flags を使用して Feature Flags を導入してみましょう。`vercel` CLI をインストールしていない場合は、以下のコマンドでインストールしてください。

```bash
npm install -g vercel
vercel login
```

あらかじめ Next.js アプリケーションを Vercel 上にホストしておきます。

```bash
# Next.js アプリケーションを作成
npx create-next-app@latest flag-test-app
# Vercel にデプロイ
cd flag-test-app
vercel deploy
```

続いて、Vercel のダッシュボードから Feature Flags を作成します。Vercel のダッシュボードにアクセスし、対象のプロジェクトを選択してサイドバーの「Flags」メニューをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2wRz72uudNeiOeBOBGrb86/06af38fb58c0e158c67dd3f131c3534a/image.png)

Flags メニューから早速新しいフラグを作成してみましょう。フラグの名前を `new-dashboard` として「Create Flag」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/1mFOkJYF1TXGHgZJYdPUc3/1943866580ab31029d732043bfd1b765/image.png)

Description は任意で入力できます。フラグの値は Boolean, String, Number, JSON のいずれかを選択できます。ここでは Boolean を選択して「Create Flag」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/2lo2xeUsfoz0lfTDuRlDv0/1b37cdd4bc1dd21b0839c65ead13c173/image.png)

フラグを作成したら、そのフラグの詳細画面に遷移して、フラグの状態を管理することができます。環境ごとに on/off を切り替えることができることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/6a3jtH5LAZSaH7x2ZGXpQU/b207effeefb59588264459697685d234/image.png)

フラグが作成されると、SDK が Vercel Flags に接続するために必要な環境変数 `FLAGS_SECRET` が自動的にプロジェクトの環境変数に追加されます。ローカルで開発する際には、以下のコマンドで環境変数をローカルにダウンロードしておくと便利です。

```bash
vercel env pull
```

## アプリケーションコードからフラグの状態を取得する

アプリケーションからフラグの状態を取得するために必要な SDK をインストールします。フラグの状態を取得する方法には以下の 3 つの選択肢があります。

- [Flags SDK](https://flags-sdk.dev/): フレームワークネイティブな SDK で Next.js や SvelteKit などのフレームワークに最適化されている。アダプターを通じて様々な SaaS プロバイダーのフラグも管理できる。Vercel Flags を使用する場合は `@flags-sdk/vercel` アダプターを使用する。
- [OpenFeature](https://openfeature.dev/): CNCF のプロジェクトで、ベンダーに依存しない Feature Flags の標準 API を提供する。必要なコード量は増えるが、Vercel Flags 以外のプロバイダーに切り替える場合もコードの変更を最小限に抑えられる。
- `@vercel/flags-core`: Flags SDK の内部で使用されているコアライブラリを直接使用する方法

ここでは、Next.js アプリケーションに最適化された Flags SDK を使用してみましょう。以下のコマンドでインストールします。

```bash
npm install flags @flags-sdk/vercel
```

`flags.ts` というファイルをプロジェクトルートに作成して、ここに Feature Flags の一覧を定義するコードを書いていきます。フラグのキーは Vercel のダッシュボードで作成したフラグのキーと同じにする必要があります。

```tsx:flags.ts
import { flag } from 'flags/next';
import { vercelAdapter } from '@flags-sdk/vercel';
 
export const newDashboardFlag = flag<boolean>({
  key: "new-dashboard",
  adapter: vercelAdapter(),
});
```

`vercelAdapter()` を使用することで環境変数 `FLAGS_SECRET` が自動的に読み込まれ、Vercel Flags に接続することができます。フラグの状態はサーバーサイドで取得されるため、クライアントサイドではフラグの状態を直接取得することはできません。サーバーコンポーネントから、新旧ダッシュボードのどちらを表示するかを切り替えるコードを書いてみましょう。`await newDashboardFlag()` でフラグの状態を取得することができます。

```tsx:app/page.tsx
import { newDashboardFlag } from "../flags";

export default async function Home() {
  const isNewDashboardEnabled = await newDashboardFlag();

  return (
    <div>
      {isNewDashboardEnabled ? <h1>New Dashboard</h1> : <h1>Old Dashboard</h1>}
    </div>
  );
}
```

手元の環境でアプリケーションを起動して確認してみましょう。

```bash
npm run dev
```

初期状態では Development 環境のフラグは on になっているため、New Dashboard が表示されるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/4PCgtI8OhmewKELcVJS722/77307a68e0c650e3c68fe08bec33f10b/image.png)

ダッシュボードのフラグの状態を off に切り替えてみましょう。フラグの変更を実施しようとすると、フラグの変更の差分が表示され、フラグを変更する理由を記述するまでフラグの変更を行えないようになっていて便利ですね。変更履歴も自動的に記録されるため、誰がいつフラグを変更したのかを追跡することができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6e5iS8vhaCQ9AvGlMeUSLC/37a9661b72a8854bd36e4a82e9ffb6f2/image.png)

手元の環境でアプリケーションをリロードしてみると、Old Dashboard が表示されることが確認できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6TVUM2vJaZSsXEBlJ66s8X/f4f60af22b38cc8893348c34c5adb8ff/image.png)

## フラグの自動登録

Flags Explorer を使用することで、[Vercel Toolbar](https://vercel.com/docs/vercel-toolbar)からアプリケーションのフラグを上書きしたり、アプリケーションのコードと同期してフラグを自動で追加したり、アプリケーションで使用されていないフラグをダッシュボード上で確認したりすることができます。手動でフラグを管理している場合には使われなくなったフラグがコード上にいつまでも残ってしまうことがありましたので、コードとダッシュボードの状態を同期できるのは便利ですね。

Vercel Toolbar はデフォルトでプレビュー環境でも利用できるようになっていますが、ローカルの開発環境でも使えるようにしておくと便利です。以下のコマンドで `@vercel/toolbar` パッケージをインストールします。

```bash
npm install @vercel/toolbar --save-dev
```

続いて `vercel link` コマンドを実行して、ローカルのプロジェクトと Vercel 上のプロジェクトをリンクします。

```bash
vercel link
```

Next.js プロジェクトの場合は `next.config.ts` に以下のように設定を追加します。

```ts:next.config.ts
import type { NextConfig } from 'next';
import createWithVercelToolbar from '@vercel/toolbar/plugins/next';
 
const nextConfig: NextConfig = {
  // Config options here
};
 
const withVercelToolbar = createWithVercelToolbar();
export default withVercelToolbar(nextConfig);
```

最後に以下のコードを `app/layout.tsx` に追加して、Vercel Toolbar をアプリケーションに組み込みます。

```tsx:app/layout.tsx
import { VercelToolbar } from '@vercel/toolbar/next';
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const shouldInjectToolbar = process.env.NODE_ENV === 'development';
  return (
    <html lang="en">
      <body>
        {children}
        {shouldInjectToolbar && <VercelToolbar />}
      </body>
    </html>
  );
}
```

続いてフラグの自動登録機能を利用するためには、フラグ検出エンドポイント（`.well-known/vercel/flags`）をアプリケーションに追加する必要があります。Vercel Flags ではこのエンドポイントに認証リクエストを送信することで、アプリケーションコードで定義されているフラグの一覧を取得し、ダッシュボードに登録することができます。

Next.js では、`app/.well-known/vercel/flags/route.ts` というファイルを作成して、以下のコードを書きます。

```tsx:app/.well-known/vercel/flags/route.ts
import { createFlagsDiscoveryEndpoint } from "flags/next";
import { getProviderData } from "@flags-sdk/vercel";
import * as flags from "../../../../flags";

export const GET = createFlagsDiscoveryEndpoint(() => getProviderData(flags));
```

試しに、`flags.ts` から `newDashboardFlag` を削除して、あらたなフラグ `betaFeatureFlag` を追加してみましょう。コードから検知されるフラグは Vercel Flags に反映されるときドラフト状態で追加されます。ドラフト状態で反映されているフラグは取得することができないため、デフォルト値をコード上で指定しておきます。

```diff:flags.ts
  import { flag } from 'flags/next';
  import { vercelAdapter } from '@flags-sdk/vercel';
  
- export const newDashboardFlag = flag<boolean>({
-   key: "new-dashboard",
-   adapter: vercelAdapter(),
- });
+  
+ export const betaFeatureFlag = flag<boolean>({
+   key: "beta-feature",
+   adapter: vercelAdapter(),
+   defaultValue: false,
+ });
```

```diff:app/page.tsx
- import { newDashboardFlag } from "../flags";
+ import { betaFeatureFlag } from "../flags";

  export default async function Home() {
-   const isNewDashboardEnabled = await newDashboardFlag();
+   const isBetaFeatureEnabled = await betaFeatureFlag();

    return (
      <div>
-       {isNewDashboardEnabled ? <h1>New Dashboard</h1> : <h1>Old Dashboard</h1>}
+       {isBetaFeatureEnabled ? <p>Beta feature is enabled!</p> : <p>Beta feature is disabled.</p>}
      </div>
    );
  }
```

開発環境でアプリケーションを起動して、Vercel Toolbar の「Flags Explorer」からフラグの状態を確認してみましょう。`beta-feature` フラグがドラフト状態で追加されていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/2EtrFzg1OP8XeG9bMDigW6/7c26d9b9ec2d0c247c38db2ccd239f54/image.png)

このフラグの状態を変更して、アプリケーションをリロードすると、ローカル開発環境でフラグの状態に応じて表示が切り替わることが確認できます。


続いて `vercel --prod` コマンドでアプリケーションを本番環境にデプロイしてみましょう。

```bash
vercel --prod
```

アプリケーションのデプロイ後、新たに追加した `beta-feature` フラグはダッシュボードの「Drafts」セクションにドラフト状態で追加されていることがわかります。ここから「Create...」をクリックしてフラグを作成することもできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5fFg7oWlu2YQdQL16LDvE5/0cc2e64b18069d774d529fbd94f34282/image.png)

コード上から参照されなくなっているフラグ `new-dashboard` がダッシュボード上で「Unreferenced」と表示されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5AaQosQgIteBr9093rNYfO/7b5721e2cd058f4086daab284d6d57ad/image.png)

## 特定のユーザーにのみフラグを有効化する

Feature Flags を使用して特定のユーザー、テナントにのみ新しい機能を公開したいケースは多くあります。例えば社内のユーザーのみ新しい機能を公開し、問題がないことを確認してから全ユーザーに公開する、といったケースです。Vercel Flags では、エンティティと呼ばれる概念を使用して、特定の条件を満たす場合のみフラグを有効化することができます。エンティティはユーザー, テナント, デバイス, リクエストなどアプリケーションが認識できる任意のオブジェクトです。ダッシュボード上でエンティティを定義することにより、フラグの有効化条件を柔軟に設定することができます。

まず初めに Vercel のダッシュボード上でエンティティを作成してみましょう。ここでは、社内ユーザーのメールアドレスをエンティティとして定義してみます。「Flags」→「Entities」からエンティティを作成することができます。あらかじめ `User` と `Team` というエンティティが用意されているので、この `User` エンティティを使うことにしましょう。「Add Attribute」をクリックして、`isInternal` という属性を `boolean` 型で追加します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7LZuaIppsz7GR7R9ssMO4K/f8cc821974e48ea6aed55ad76034c84a/image.png)

続いて再利用可能な機能フラグのターゲット設定であるセグメントを作成してみましょう。サイドバーから「Segments」をクリックして、「Create Segment」をクリックするとダイアログが表示されるので、セグメントのスラグを `internal-users`、セグメントの名前を `Internal Users` として作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3RrkIftJAaqLf9aszx3Y5t/4f1782ce34f96ff1b87cdfbe3dd01657/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/1fTMi3bYD0r55CLBg5ZOvb/7064ca0cec775b969402db583727b900/image.png)

続いて作成したセグメントの詳細画面に移動し「Add Filter」をクリックして、先ほど作成した `User` エンティティの `isInternal` 属性が `true` の場合のみフラグを有効化するように設定します。フィルタールールには単なる `boolean` 値の他「メールアドレスの末尾が `@example.com` の場合のみ有効化する」「`role` 属性が `admin` の場合のみ有効化する」など、様々な条件を設定することができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3nbGFr1Hd0rKVrbrYbg434/5fd66dfc7cd24fd0470465b5b840848c/image.png)

続いて `internal-only-feature` というフラグを作成して、先ほど作成した `internal-users` セグメントをターゲットとして設定してみましょう。フラグの詳細画面の on/off 切り替えのセレクトボックスから「Custom Rules」を選択して、条件を設定します。「Add Rules」をクリックして、「Segment is Internal Users」を選択してこの条件を満たすとき条件を `on` に設定します。それ以外の場合は `off` に設定します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6gIgN87EcD9j8vmN0t6zUo/3e2b0b64709c6cebad1cfa8a4d2c201e/image.png)

コードの変更に進みましょう。`flags.ts` に `internalFeatureFlag` を追加します。

```tsx:flags.ts
import { flag, dedupe } from "flags/next";
import { vercelAdapter } from "@flags-sdk/vercel";
import { getDummySession } from "./lib/auth";

type Entities = {
  user?: {
    id: string;
    name: string;
    isInternal: boolean;
  };
};

const identify = dedupe(async (): Promise<Entities> => {
  const session = await getDummySession();
  if (!session?.user) return {};

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      isInternal: session.user.isInternal,
    },
  };
});


export const internalFeatureFlag = flag<boolean, Entities>({
  key: "internal-only-feature",
  adapter: vercelAdapter(),
  defaultValue: false,
  identify,
});
```

ポイントは `identify` 関数を定義して、フラグの状態を取得する際にエンティティの情報を Vercel Flags に送信することです。ここでは、`getDummySession()` という関数でユーザーのセッション情報を取得して、ユーザーが社内ユーザーかどうかを判定しています。実際のアプリケーションでは、認証情報からユーザーの属性を取得して `identify` 関数で返すようにしてください。`dedupe` 関数は Flags SDK が提供するヘルパー関数で、同じリクエスト内で複数回 `identify` 関数が呼ばれた場合に、最初の呼び出しの結果をキャッシュして返すようにするための関数です。

`getDummySession` 関数内の `isInternal` フラグを直接書き換えてみて、社内ユーザーかどうかを切り替えた時に表示される内容が変わることを確認してみましょう。

```tsx:lib/auth.ts
export async function getDummySession() {
  return {
    user: {
      id: "user-1",
      name: "John Doe",
      isInternal: true, // 社内ユーザーの場合は true、社外ユーザーの場合は false に切り替えて確認する
    },
  };
}
```

## まとめ

- Vercel Flags を使用することで、Vercel 上でホストされているアプリケーションに Feature Flags を簡単に導入できる。
- Flags SDK を使用することで、アプリケーションコードから Vercel Flags に接続してフラグの状態を取得することができる。
- Flags Explorer を使用することで、アプリケーションコードとダッシュボードの状態を同期させることができる。アプリケーションコードで定義されたフラグをドラフト状態でダッシュボードに追加したり、コード上で使用されなくなったフラグをダッシュボード上で確認することができる。
- Vercel Toolbar を使用することで、ローカル開発環境でもフラグの状態を確認したり、フラグの状態を上書きしたりすることができる。
- エンティティを使用することで、特定のユーザーやテナントにのみフラグを有効化することができる。エンティティの属性を使用して、フラグの有効化条件を柔軟に設定することができる。

## 参考

- [Vercel Flags](https://vercel.com/docs/flags/vercel-flags)
- [Vercel Flags: Platform-native feature flags - Vercel](https://vercel.com/blog/vercel-flags-platform-native-feature-flags)
- [flags-sdk.dev](https://flags-sdk.dev/)
