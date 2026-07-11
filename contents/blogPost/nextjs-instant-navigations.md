---
id: SG-euyVn8xDeNnVr8670e
title: "Next.js の Instant Navigations を試してみた"
slug: "nextjs-instant-navigations"
about: "Next.js 16.3 Preview では、Instant Navigations という新機能が導入されました。画面遷移で即時表示できない箇所を開発時に検出し、修正を促すための機能です。この記事では Instant Navigations を実際に試してみた様子を紹介します。"
createdAt: "2026-07-11T09:46+09:00"
updatedAt: "2026-07-11T09:46+09:00"
tags: ["nextjs"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1qfNXsMO7MsfFmOd8Xjx8q/72b3ad8edf7d0357dfa03ecbb37ce26f/fried-shrimp_14566-768x630.png"
  title: "エビフライのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Instant Navigations はどのような機能だと記事で説明されていますか?"
      answers:
        - text: "画面遷移中にプログレスバーを自動で表示する機能"
          correct: false
          explanation: "プログレスバーは NProgress などのライブラリで従来行われていた対処として紹介されており、Instant Navigations の機能ではありません。"
        - text: "即時表示できない画面遷移を開発時に検出し、修正を促す機能"
          correct: true
          explanation: "記事で述べられている通り、Instant Navigations 自体は新たな機能を追加するのではなく、即時表示できない箇所を開発時に検出して修正を促すための機能です。"
        - text: "すべてのページを自動的にキャッシュして画面遷移を高速化する機能"
          correct: false
          explanation: "キャッシュは 'use cache' ディレクティブで明示的に有効にするものであり、自動的にすべてのページがキャッシュされるわけではありません。"
        - text: "サーバーを経由せずにページを描画する新しいレンダリング方式"
          correct: false
          explanation: "Instant Navigations はサーバー駆動のモデルを維持したまま SPA のような体感速度を実現する仕組みであり、サーバーを経由しなくなるわけではありません。"
    - question: "Instant Navigations を使用するために next.config.ts へ追加する必要がある設定はどれですか?"
      answers:
        - text: "instant: true"
          correct: false
          explanation: "instant はページやレイアウトファイルで export するルートセグメント設定であり、next.config.ts の設定ではありません。"
        - text: "navigationInspector: true"
          correct: false
          explanation: "Navigation Inspector は DevTools の機能であり、next.config.ts での設定は不要です。cacheComponents が有効な場合に使用できます。"
        - text: "cacheComponents: true"
          correct: true
          explanation: "記事で説明されている通り、Instant Navigations を有効にするには next.config.ts に cacheComponents: true を追加する必要があります。"
        - text: "partialPrefetching: true"
          correct: false
          explanation: "partialPrefetching は部分的な prefetch を有効にするための設定であり、Instant Navigations 自体の有効化に必要なのは cacheComponents: true です。"
    - question: "遷移先の画面が即時表示できない（サーバーからの応答を待つ）ことを明示して警告を解消する方法として、記事で説明されているものはどれですか?"
      answers:
        - text: "ページまたはレイアウトファイルで export const instant = false を指定する"
          correct: true
          explanation: "記事で説明されている通り、instant = false を指定するとそのルートではサーバーからの応答を待つことを明示でき、開発やビルド時の警告が表示されなくなります。"
        - text: "データ取得部分を <Suspense> でラップする"
          correct: false
          explanation: "<Suspense> はフォールバック UI を表示して即時遷移を実現する方法であり、待機を明示する方法ではありません。"
        - text: "コンポーネントに 'use cache' ディレクティブを追加する"
          correct: false
          explanation: "'use cache' はキャッシュ済みの UI を即座に描画するための方法であり、待機を明示する方法ではありません。"
        - text: "loading.tsx ファイルを削除する"
          correct: false
          explanation: "loading.tsx の削除は記事で警告の解消方法として挙げられていません。"
published: true
---
Next.js 16.3 Preview では、Instant Navigations という新機能が導入されました。サーバーでデータを取得する画面へ遷移する場合、サーバーからのレスポンスを待ってから次の画面が描画されることがあります。これはユーザーの体験として、リンクをクリックしても何も起こらないように感じさせてしまう問題があります。ナビゲーションが進行中であることを示すため [NProgress](https://github.com/rstacruz/nprogress) などのライブラリを使用してプログレスバーを表示させていたという方も多いのではないでしょうか。

従来の App Router でも、`loading.tsx` や `<Suspense>` のフォールバックが提供されていたり、コンポーネントのキャッシュが有効となっていれば、クリック直後にローディング UI を表示できます。Instant Navigations 自体はこのような新たな機能を追加するのではなく、即時表示できない箇所を開発時に検出し、修正を促すための機能です。

例として以下のようなコードで従来のナビゲーション動作を試してみましょう。ランダムな数字を 3 秒待機してから表示する画面を用意します。

```tsx:app/number/page.tsx
const getRandomNumber = async () => {
  // 3 秒待機してからランダムな数字を返す
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return Math.floor(Math.random() * 100);
};

export default async function NumberPage() {
  const number = await getRandomNumber();
  return (
    <div>
      <h1>{number}</h1>
    </div>
  );
}
```

`/number` 画面へのリンクをクリックしてもしばらく何も起こらず、3 秒後にランダムな数字が表示されるという挙動が確認できるかと思います。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5hMkINjej3bfDsy5kH8Xvk/8e5ec981e9c953563f566aa050eef442/b475909b-a55b-4959-8e7a-dd93daffcf51.mov" controls></video>

画面遷移時にすべてのデータが揃っている必要はなく、まずは画面の骨組みを描画し、必要なデータが揃い次第コンテンツを埋め込むように誘導するというのが Instant Navigations の設計の肝です。動的なデータ取得に対して、以下のいずれかを推奨しています。

- `<Suspense>` を使用して到着したデータからストリーミングでコンテンツを描画する
- `'use cache'` を使用してキャッシュ済みの UI を即座に描画する
- `export const instant = false` を使用して、遷移先の画面が即時表示できないことを明示する

この記事では Instant Navigations を実際に試してみた様子を紹介します。

## Instant Navigations を有効にする

Instant Navigations を使用するには Next.js 16.3 Preview が必要です。`@preview` を指定して Next.js プロジェクトを作成します。

```bash
npx create-next-app@preview
```

Instant Navigations を有効にするためには、`next.config.ts` に [`cacheComponents: true`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) を追加する必要があります。

```ts:next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

`cacheComponents: true` オプションは Next.js の Cache Components モードを有効にする設定です。これにより、`'use cache'` ディレクティブを指定したコンポーネント・関数の出力をキャッシュできます。`cacheComponents` オプションを有効にした状態で先程の `/number` 画面へのリンクをクリックすると、画面遷移の完了後に Next.js のデベロッパーツールに以下のような警告が表示されるようになります。この開発時に遅いページ遷移を検出する仕組みは Instant Insights と呼ばれており、これが Instant Navigations の改善点の 1 つです。

![](https://images.ctfassets.net/in6v9lxmm5c8/GfRfqXZ6QmU9uY9UHeuki/a94bbf1efe9388b9091924600b40a7d0/image.png)

これは Next.js がプリレンダリング中にキャッシュされていないデータを検出したことを示す警告です。`app/number/page.tsx` の `await new Promise((resolve) => setTimeout(resolve, 3000));` の箇所がハイライトされて表示され、コードのどの箇所がキャッシュされていないデータ取得になっているのかがわかるようになっています。

[Blocking prerender dynamic | Next.js](https://nextjs.org/docs/messages/blocking-prerender-dynamic)

同様の警告は `next build` でビルドしたときも表示され、ビルドが失敗します。

```sh
$ npm run build

> instant-navigations-test@0.1.0 build
> next build

▲ Next.js 16.3.0-preview.5 (Turbopack)
- Cache Components enabled

Error: Route "/number": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
    https://nextjs.org/docs/messages/blocking-prerender-dynamic#wrap-in-or-move-into-suspense
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
    https://nextjs.org/docs/messages/blocking-prerender-dynamic#cache-the-component-or-data
  - [block] Set `export const instant = false` to silence this warning and allow a blocking route
    https://nextjs.org/docs/messages/blocking-prerender-dynamic#allow-blocking-route
    at div (<anonymous>)
    at body (<anonymous>)
    at html (<anonymous>)
To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running `next dev`, then open "/number" in your browser to investigate the error.
  - Rerun the production build with `next build --debug-prerender` to generate better stack traces.
Error occurred prerendering page "/number". Read more: https://nextjs.org/docs/messages/prerender-error
Export encountered an error on /number/page: /number, exiting the build.
⨯ Next.js build worker exited with code: 1 and signal: null
```

この警告を解消するための方法として、以下の 3 つが提案されています。エージェントに修正させるためのプロンプトもコピーできるようになっている点が面白いですね。

- データ取得を `<Suspense>` でラップする
- `'use cache'` でコンポーネントやデータをキャッシュする
- `export const instant = false` で、そのルートを待機してよいことを明示する

それぞれの方法について詳しく見ていきましょう。

## データ取得を `<Suspense>` でラップする

[`<Suspense>`](https://ja.react.dev/reference/react/Suspense) は、非同期処理中のコンポーネントの描画を一時的に保留し、代わりにフォールバック UI を表示することができます。`<Suspense>` は静的なコンテンツ（ヘッダーやレイアウト）と動的なコンテンツ（データ取得が必要な部分）を組み合わせてページを構築するのに適しています。特にダッシュボードのような画面では、`<Suspense>` を複数使い分けることによって、データの取得が特に遅いコンテンツに合わせる必要がなく、到着したデータから順次描画するといったことが可能になります。

`app/number/page.tsx` のコードを以下のように修正して、データ取得部分を `<Suspense>` でラップしてみましょう。

```tsx:app/number/page.tsx
import { Suspense } from "react";

export default function NumberPage() {
  return (
    <div>
      <h1>ランダムな数字</h1>
      <Suspense
        fallback={<span>...</span>}
      >
        <RandomNumber />
      </Suspense>
    </div>
  );
}

const getRandomNumber = async () => {
  // 3 秒待機してからランダムな数字を返す
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return Math.floor(Math.random() * 100);
};

async function RandomNumber() {
  const number = await getRandomNumber();
  return <span>{number}</span>;
}
```

静的なコンテンツとして `<h1>` 要素のタイトルを追加しています。`<Suspense>` はページ全体をラップするのではなく、データ取得が必要な最小限の部分だけをラップするようにしましょう。`<Suspense>` の `fallback` には、データ取得中に表示するフォールバック UI を指定します。ここでは「...」というテキストを表示するようにしています。

実際に `/number` 画面へのリンクをクリックすると即座に画面遷移が完了し、フォールバック UI が表示されます。3 秒後にランダムな数字が表示されることが確認できるかと思います。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2vW6AIO721LDztDHgbZRNf/fd18659f3a44a34836d6ca2903226176/8ea98986-5499-4f2a-8220-e140b232fb37.mov" controls></video>

## `'use cache'` でコンポーネントやデータをキャッシュする

続いて [Cache Components](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) を使用して、コンポーネントやデータをキャッシュする方法を試してみましょう。`'use cache'` ディレクティブを使用することで、コンポーネントや関数単位でキャッシュを有効にすることができます。それ以外の場所では常にデータは動的に取得されます。

UI のキャッシュはブログ記事のように短期間で更新されることが少ないコンテンツに適しています。アクセスするたびランダムな数字を返す UI というのは本来キャッシュに適していませんが、キャッシュが有効になっているか（毎回同じ数字を返すかどうか）を検証するためには適しています。

`app/number/page.tsx` のコードの `<Suspense>` を使用した部分を以下のように修正しましょう。`RandomNumber` コンポーネントの先頭に `'use cache'` ディレクティブを追加することで、コンポーネント単位でキャッシュが有効になります。

```tsx:app/number/page.tsx {17}
export default function NumberPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">ランダムな数字</h1>
      <RandomNumber />
    </div>
  );
}

const getRandomNumber = async () => {
  // 3 秒待機してからランダムな数字を返す
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return Math.floor(Math.random() * 100);
};

async function RandomNumber() {
  "use cache";
  const number = await getRandomNumber();
  return <span className="text-9xl font-bold tabular-nums">{number}</span>;
}
```

ここでは、サーバー側のキャッシュとブラウザ側の prefetch を分けて考える必要があります。`RandomNumber` はリクエスト固有の値（`cookies()` や `headers()` など）を参照しないため、`'use cache'` を指定するとプリレンダリング時に実行され、その出力が App Shell に含まれます。

リンクが画面内に入ると、Next.js は App Shell とシリアライズされた RSC Payload をブラウザへ prefetch し、Router Cache に保存します。つまり prefetch 自体が `RandomNumber` のサーバー側キャッシュを作成するのではなく、すでに生成された UI をクリック前にブラウザへ配送する役割を担います。`/number` 画面への遷移で即座に数字を表示できるのはこのためです。毎回同じ数字が表示されていることから、UI の出力が再利用されていることも確認できます。

!> リンクの prefetch は本番モード（`next build` + `next start`）でのみ行われます。開発サーバーでは prefetch は発生しませんが、`'use cache'` によりサーバー側でキャッシュ済みの UI が即座に返されるため、同様に素早い画面遷移を確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4NM7XsIlz2oTtwJi7Jlavh/98b52846e0f98485abe81e9563cd62d0/49e20db1-c8b0-4723-9590-d5164dde373e.mov" controls></video>

<details>

<summary>補足: 部分的な prefetch</summary>

Next.js では、リンクが画面内に入った時点でルートの prefetch が開始され、ブラウザの Router Cache に保存されます。リンクの prefetch は SPA のような瞬時のナビゲーションを実現するために重要な役割を果たしている一方で、ビューポートに入ったリンクの prefetch がすべてのリンクに対して行われると、不要なリソースの取得が発生する可能性があります。とくにページ内に多くのリンクがある場合には、スクロールするたびに Developer Tools の Network タブに大量のリクエストが表示される、という状況を目撃したことがある方もいるでしょう。たとえ複数リンクが同じ画面を指していたとしても、prefetch はすべてのリンクに対して行われてしまいます。

このような状況を見直すため、部分的な prefetch が導入されました。部分的な prefetch ではリンクごとに prefetch が行われるのではなく、ルートごとに再利用可能な shell が prefetch されるようになりました。これにより、同じルートを指す複数のリンクが存在する場合でも、最初のリンクが prefetch された後は、2 回目以降のリンクでは prefetch が行われなくなります。これは SPA がルートごとにコードを分割する概念に近い挙動です。

部分的な prefetch を有効にするためには `next.config.ts` に `partialPrefetching: true` を追加する必要があります。なお、将来の Next.js のバージョンでは `cacheComponents` を有効にしている場合はデフォルトで `partialPrefetching` が有効になる予定です。

```ts:next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
```

シェルに加えてより多くのコンテンツを prefetch したい場合は、`<Link>` コンポーネントの `prefetch` 属性を `true` に設定します。この場合もルート全体が prefetch されるのではなく、静的な部分と `'use cache'` でキャッシュされた部分までが prefetch の対象になります。

```tsx
<Link href="/number" prefetch={true}>
  ランダムな数字
</Link>
```

</details>

## ルートの待機を明示する

すべてのページが瞬時に遷移することに適しているわけではありません。そのような場合はページまたはレイアウトファイルで `export const instant = false` を指定することで、そのルートではサーバーからの応答を待つことを明示できます。これにより、開発やビルド時の警告が表示されなくなります。

```tsx:app/number/page.tsx {1}
export const instant = false;

export default function NumberPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">ランダムな数字</h1>
      <RandomNumber />
    </div>
  );
}

const getRandomNumber = async () => {
  // 3 秒待機してからランダムな数字を返す
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return Math.floor(Math.random() * 100);
};

async function RandomNumber() {
  const number = await getRandomNumber();
  return <span className="text-9xl font-bold tabular-nums">{number}</span>;
}
```

リンクをクリックしてから 3 秒後に画面遷移が完了するという状況は以前と変わらないですが、警告が表示されなくなっていることが確認できるかと思います。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4OhVsNw792JyQO1OAO2Lxr/e0eb02b061008cfd33f0e595c028c4cb/faa42f37-ebb2-490c-8c2e-9b1e08a04397.mov" controls></video>

開発中は警告を表示したいが、ビルド時には影響を与えたくないという場合には、以下のように `level: 'warning'` を指定できます。

```ts
export const instant = {
  level: 'warning',
}
```

## Next.js の DevTools の Navigation Inspector でページの読み込みを可視化する

Next.js 16.3 Preview では、DevTools の Navigation Inspector を使用すると、ページの読み込みを途中で中断し、適切なフォールバックが表示されるかどうかを確認できます。Navigation Inspector は、`cacheComponents` が有効になっている場合にのみ使用できます。画面左下にある「Next.js」アイコンをクリックして DevTools を開き、Navigation Inspector メニューを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6OQ5QOSiGJMYigpVeIIszV/1e32f47a0d81cacac277b84f87ca540e/image.png)

「Pause on navigations」のスイッチをオンにすると、「Waiting for navigation...」という表示が出現してナビゲーションを待機する状態になります。

![](https://images.ctfassets.net/in6v9lxmm5c8/zIQMyjFFSiymZy2pwouO9/3903a86463a740b9b28663fd85c86106/image.png)

`/number` 画面に遷移するリンクをクリックすると、「Debugger paused」という表示に変化します。この状態では `<Suspense>` のフォールバック UI が表示されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/10NuWBcgYFRkH46kfZgZpZ/ada74ea9cf4881f2c1a14c9becbfdeea/image.png)

「Resume」ボタンをクリックすると、ナビゲーションが再開されフォールバック UI が消え、ランダムな数字が表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5O1apDjTv2r3jlv6m1zQzH/c45c35af25efd50a5bc9cef07a5f292c/image.png)

## Playwright による Instant Navigations の検証

Next.js の DevTools の Navigation Inspector による検証は開発中に期待したフォールバックが表示されているか、データの取得の完了後に期待したデータが表示されるかといったページの構造を確認するのに適していますが、コードベースが大きくなるにつれてすべてのページの挙動を手動で確認するのは困難になります。データの取得前後で正しいデータが取得されているかどうか確認するために、`@next/playwright` パッケージで `instant` ヘルパー関数が追加されました。

まずは以下のパッケージをインストールします。

```bash
npm install -D @next/playwright@preview @playwright/test
```

テストの設定ファイルである `playwright.config.ts` を作成します。ここでは `next dev` を使用して開発サーバーを起動し、テストを実行するように設定しています。

```ts:playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import path from "path";

const PORT = process.env.PORT || 3000;

const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  timeout: 30 * 1000,
  testDir: path.join(__dirname, "e2e"),
  retries: 2,
  outputDir: "test-results/",
  webServer: {
    command: "npm run dev",
    url: baseURL,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },

  use: {
    baseURL,
    trace: "retry-with-trace",
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
```

`e2e/number-navigation.spec.ts` のような Playwright のテストファイルを作成し、`instant` ヘルパー関数を使用して以下のようにテストを記述できます。なお、ここでは `<Suspense>` を使用したバージョンのコードに戻したうえで、テストを実行するためにランダムな数字ではなく固定値（42）を返すように `getRandomNumber` を修正しています。

```ts:e2e/number-navigation.spec.ts
import { test, expect } from '@playwright/test'
import { instant } from '@next/playwright'
 
test('ランダムな数字が表示される', async ({ page }) => {
  await page.goto('/')

 // instant を使用することで、クリック直後にフォールバック UI が表示されることを検証できる
  await instant(page, async () => {
    await page.click('a[href="/number"]')
    // 静的なコンテンツは即座に表示される
    await expect(page.locator('h1')).toContainText('ランダムな数字')
    // フォールバック UI が表示される
    await expect(page.locator('text=...')).toBeVisible()
  })

  // instant が完了した後は、データが表示される
  await expect(page.locator('text=42')).toBeVisible()
})
```

`instant` ヘルパー関数は非同期関数です。コールバック関数内ではデータ取得が完了する前の静的なコンテンツを検証することができます。データの取得の完了後（3 秒後）には、`instant` 関数の Promise が解決され、データが表示されることを検証できます。

`npx playwright test` を実行すると、テストが実行され、期待した挙動が確認できるかと思います。

```sh
$ npx playwright test

Running 1 test using 1 worker

  ✓  1 [Desktop Chrome] › e2e/number-navigation.spec.ts:4:5 › ランダムな数字が表示される (4.2s)

  1 passed (7.1s)
```


## まとめ

- Instant Navigations は、すべてのデータを待たずに画面の骨組みを先に表示し、SPA のような体感速度を実現する仕組み。遅いページ遷移を開発時に検出できるようになった
- 動的なコンテンツは `<Suspense>` を使用してストリーミングで描画するか、`'use cache'` を使用してキャッシュ済みの UI を即座に描画する
- 待機が適切なルートでは `export const instant = false` を指定できる。これにより、警告を表示せずにサーバーからの応答を待つことができる
- Next.js の DevTools の Navigation Inspector はナビゲーションを途中で止めて、フォールバック UI の表示や、データ取得完了後のコンテンツ表示を検証できる
- Playwright の `instant` ヘルパー関数を使用することで、クリック直後のフォールバック UI の表示や、データ取得完了後のコンテンツ表示を検証できる
- Partial Prefetching はルート単位で再利用可能なシェルを prefetch し、不要なリクエストを減らす

## 参考

- [Next.js 16.3: Instant Navigations | Next.js](https://nextjs.org/blog/next-16-3-instant-navigations)
- [Guides: Instant navigation | Next.js](https://preview.nextjs.org/docs/app/guides/instant-navigation)
- [Guides: Streaming | Next.js](https://preview.nextjs.org/docs/app/guides/streaming)
- [Getting Started: Caching | Next.js](https://preview.nextjs.org/docs/app/getting-started/caching)
- [Directives: use cache | Next.js](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [Route Segment Config: instant | Next.js](https://preview.nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant)
