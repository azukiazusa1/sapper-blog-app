---
id: pma4VRGdlMPNXn1N_Wtnn
title: "Boneyard で正確なスケルトンローダーを生成する"
slug: "skeleton-loader-boneyard"
about: "スケルトンローダーは、コンテンツが読み込まれる前に表示されるプレースホルダーで、ユーザーに対して読み込み中であることを視覚的に示すためのものです。Boneyard はスケルトンローダーの手動の計測と更新の手間を解消するためのフレームワークです。この記事では、Boneyard を使用してスケルトンローダーを簡単に実装する方法について説明します。"
createdAt: "2026-04-04T14:19+09:00"
updatedAt: "2026-04-04T14:19+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3YJGQefGSEYpWVSKrbtvid/e59f92783e295d74888f094965ca6ccd/fruit_grape_muscat_illust_120-768x778.png"
  title: "マスカットのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "スケルトンローダーがローディングスピナーより優れている点として、記事で挙げられているものはどれですか？"
      answers:
        - text: "実装がシンプルで、追加のライブラリが不要である"
          correct: false
          explanation: "実装のシンプルさはスケルトンローダーの利点として挙げられていません。むしろ手動実装は手間がかかると述べられています。"
        - text: "レイアウトシフトを防止し、コンテンツの構造をユーザーが予測できる"
          correct: true
          explanation: "記事冒頭で、スケルトンローダーはより具体的なレイアウトを提供するためレイアウトシフトを防止したり、コンテンツの構造をユーザーが予測できると説明されています。"
        - text: "データ取得が完了するまでのネットワーク待機時間を短縮できる"
          correct: false
          explanation: "スケルトンローダーはネットワーク速度には影響しません。視覚的なフィードバックを改善するものです。"
        - text: "スケルトンを表示している間、バックグラウンドでコンテンツをプリフェッチできる"
          correct: false
          explanation: "プリフェッチ機能はスケルトンローダーとは別の概念であり、記事では言及されていません。"
    - question: "Boneyard でスケルトンローダーを生成する際、API からのデータ取得に時間がかかって正しく生成されない場合の対処法として正しいものはどれですか？"
      answers:
        - text: "`loading` プロパティに十分な待機時間をミリ秒で指定する"
          correct: false
          explanation: "`loading` プロパティはスケルトンを表示するかどうかを制御するものであり、待機時間を指定する用途ではありません。"
        - text: "`<Skeleton>` コンポーネントの `minHeight` プロパティで最小の高さを指定する"
          correct: false
          explanation: "`minHeight` はコンテンツが空のときにスケルトンが非表示になる問題を回避するためのプロパティです。データ取得の待機とは関係ありません。"
        - text: "`--wait` オプションで待機時間を指定するか、`fixture` プロパティで固定データを渡す"
          correct: true
          explanation: "記事で説明されているとおり、`--wait` オプションで待機時間を指定するか、`fixture` プロパティでスケルトン生成に使う固定データを指定することで、正確なスケルトンローダーを生成できます。"
        - text: "開発サーバーを再起動してから `npx boneyard-js build` を再実行する"
          correct: false
          explanation: "開発サーバーの再起動は根本的な解決策にはなりません。データ取得に時間がかかること自体への対処が必要です。"
    - question: "Boneyard の CLI でスケルトンローダーを生成した後、アプリケーションで使用可能にするために必要な手順はどれですか？"
      answers:
        - text: "生成された各 `.bones.json` ファイルを個別にインポートする"
          correct: false
          explanation: "個別にインポートする必要はありません。`registry.js` をインポートするだけで、生成されたすべてのスケルトンローダーを一括で登録できます。"
        - text: "生成された `src/bones/registry.js` をアプリケーションのエントリーポイントでインポートする"
          correct: true
          explanation: "記事で説明されているとおり、`app/layout.tsx` や `src/App.tsx` などのエントリーポイントで `src/bones/registry.js` をインポートすることで、生成されたスケルトンローダーを使用できます。"
        - text: "Boneyard の設定ファイルにスケルトン名を列挙して登録する"
          correct: false
          explanation: "そのような設定ファイルへの手動登録は必要ありません。CLI が自動的に `registry.js` を生成します。"
        - text: "`<Skeleton>` コンポーネントの `src` プロパティに JSON ファイルのパスを指定する"
          correct: false
          explanation: "`<Skeleton>` コンポーネントに `src` プロパティはありません。`registry.js` のインポートによって自動的にスケルトンが紐付けられます。"
published: true
---
スケルトンローダーは、コンテンツが読み込まれる前に表示されるプレースホルダーで、ユーザーに対して読み込み中であることを視覚的に示すためのものです。単純なローディングスピナーと比較すると、スケルトンローダーはより具体的なレイアウトを提供するためレイアウトシフトを防止したり、コンテンツの構造をユーザーが予測できるといった利点があります。

しかし、スケルトンローダーを実装するのは意外と手間がかかります。レイアウトシフトを防止するためには、実際のコンテンツと同じレイアウトを持つスケルトンローダーを作成する必要があるのですが、実際の DOM の高さを手動で計測してスケルトンローダーの高さを設定するという作業が発生します。実際の UI を変更するたびにスケルトンも更新する必要があるため、メンテナンスコストも高くなります。

Boneyard はスケルトンローダーの手動の計測と更新の手間を解消するためのフレームワークです。Boneyard を使用すると、実際のコンテンツをラップするだけで、ピクセル単位で正確なスケルトンローダーを自動的に生成できます。Boneyard は、実際のコンテンツのレイアウトを監視し、必要に応じてスケルトンローダーを更新するため、UI の変更に対しても柔軟に対応できます。

この記事では、Boneyard を使用してスケルトンローダーを簡単に実装する方法について説明します。

## Boneyard の使用方法

まずは、Boneyard をプロジェクトにインストールします。

```bash
npm install boneyard-js
```

Boneyard を使用してスケルトンローダーを表示するためには、データ取得しているコンポーネントを `Skeleton` コンポーネントでラップします。`<Skeleton>` コンポーネントの `loading` プロパティが `true` のときにスケルトンローダーが表示され、`false` になると実際のコンテンツに切り替わります。

```tsx:src/components/Activity.tsx
import { Skeleton } from 'boneyard-js/react'
import { activityData, type Activity } from '../data/dashboard'
// デモ用の遅延付きデータ取得フック
import { useDelayedQuery } from '../hooks/useDelayedQuery'

export function ActivityPanel() {
  const query = useDelayedQuery(['activity'], activityData, 1800)

  return (
    <article className="card panel-card">
      <SectionTitle />
      <Skeleton
        name="activity"
        loading={query.status !== 'success'}
      >
        {query.data && <ActivityContent data={query.data} />}
      </Skeleton>
    </article>
  )
}
```

`<Skeleton>` コンポーネントでラップしただけでは、スケルトンローダーは表示されません。スケルトンローダーを表示するためには、Boneyard の CLI を使用して、実際のコンテンツからスケルトンローダーを生成する必要があります。

CLI を実行する前に、以下の点に注意してください。

- `<Skeleton>` コンポーネントの `name` プロパティには一意な名前を指定する必要があります。この値が、CLI で生成される `json` ファイルの名前になります。
- コマンドの実行前に、プロジェクトの開発サーバーを起動しておく必要があります。

```bash
npx boneyard-js build
```

このコマンドを実行すると、プロジェクトの開発サーバーの URL を特定し、Playwright を使用して実際のコンテンツをレンダリングし、スケルトンローダーを生成します。Playwright がインストールされていない場合は、自動的にインストールされます。

API からデータを取得していて実際のコンテンツのレンダリングに時間がかかる場合、正しくスケルトンローダーが生成されない可能性があります。その場合 `--wait` オプションで待機時間を指定するか、`<Skeleton>` コンポーネントの `fixture` プロパティでスケルトンローダーの生成に使用する固定のデータを指定できます。

```tsx
<Skeleton
  name="activity"
  loading={query.status !== "success"}
  fixture={
    <ActivityContent
      data={[
        {
          id: 1,
          title: "New user registered",
          timestamp: "2026-04-04T12:00:00Z",
        },
        {
          id: 2,
          title: "Server restarted",
          timestamp: "2026-04-04T11:30:00Z",
        },
      ]}
    />
  }
>
  {query.data && <ActivityContent data={query.data} />}
</Skeleton>
```

スケルトンローダーはデフォルトで 375, 768, 1280px の 3 つの画面幅で生成され、`src/bones` ディレクトリに `json` ファイルとして保存されます。ブレークポイントは `--breakpoints` オプションで変更できます。

```sh
src/bones
├── activity.bones.json
├── metric-churn.bones.json
├── metric-mrr.bones.json
├── metric-uptime.bones.json
├── registry.js
└── team.bones.json
```

生成された JSON ファイルはブレークポイントごとに異なるスケルトンローダーのレイアウトを定義しています。

```json:src/bones/metric-mrr.bones.json
{
  "breakpoints": {
    "375": {
      "name": "metric-mrr",
      "viewportWidth": 309,
      "width": 309,
      "height": 136,
      "bones": [
        {
          "x": 0,
          "y": 32,
          "w": 43.5882,
          "h": 34,
          "r": 8
        },
        {
          "x": 43.5882,
          "y": 39,
          "w": 23.7611,
          "h": 33,
          "r": 999
        },
        {
          "x": 0,
          "y": 88,
          "w": 100,
          "h": 48,
          "r": 8
        }
      ]
    },
    "768": {
      ...
    },
    "1280": {
      ...
    }
  }
}
```

最後にアプリケーションのエントリーポイント（`app/layout.tsx` や `src/App.tsx` など）で `src/bones/registry.js` をインポートすることで、生成されたスケルトンローダーを使用できるようになります。`registry.js` は CLI によって自動生成される副作用インポート用のファイルで、各 `.bones.json` ファイルを読み込み `registerBones` 関数でスケルトン定義を一括登録します。

```js:src/bones/registry.js
"use client"
// Auto-generated by `npx boneyard-js build` — do not edit
import { registerBones } from 'boneyard-js/react'

import _metric_mrr from './metric-mrr.bones.json'
import _activity from './activity.bones.json'
// ...

registerBones({
  "metric-mrr": _metric_mrr,
  "activity": _activity,
  // ...
})
```

エントリーポイントでこのファイルをインポートするだけで、すべてのスケルトンが登録されます。

```tsx:src/App.tsx
import "../bones/registry";
```

この状態でコードを実行すると、データが読み込まれる前に自動的に生成されたスケルトンローダーが表示されるようになります。確かにレイアウトシフトが最小限に抑えられていることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/39Z0N3XwvO1OVIn1rbO1v8/9db9089e22f35a42f93ea051081c8b89/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2026-04-04_15.54.38.mov" controls></video>

:::note
実際に試してみたところ、スケルトンローダーを表示するために表示領域を確保しないため、`data` が `undefined` で子コンポーネントが何も表示されないとき、ラッパー要素の高さが 0 になり、スケルトンローダーも表示されないという問題が発生しました。`<Skeleton>` コンポーネントの `minHeight` プロパティで最小の高さを指定することで、この問題を回避できます。
:::

## Boneyard の仕組み

Boneyard ではスケルトンローダーを構成する個々の矩形ブロックを bone と呼びます。テキスト行、アバター画像、ボタンなどがそれぞれ 1 つの bone に対応し、位置（`x`, `y`）、サイズ（`w`, `h`）、角丸（`r`）の情報を持ちます。これらの bone を組み合わせることで、スケルトンローダー全体のレイアウトが形成されます。

`npx boneyard-js build` を実行すると、内部では以下のような処理が行われています。

まず Playwright でアプリケーションのページを開き、`<Skeleton>` でラップされた要素を起点に DOM ツリーを再帰的に走査します。`display: none` や `visibility: hidden`、`opacity: 0` の要素はスキップされます。

走査の過程で、各要素が「リーフ（末端）」かどうかを判定します。子要素を持たない要素のほか、メディア要素（`img`, `svg`, `video`, `canvas`）、フォーム要素（`input`, `button` など）、特定のブロック要素（`p`, `h1`〜`h6`, `li`, `tr`）はリーフとして扱われます。

リーフ要素に対しては `getBoundingClientRect()` でバウンディングボックスを取得し、ルート要素からの相対位置を記録します。横方向の位置と幅はルート幅に対するパーセンテージ、縦方向はピクセル値で記録されるため、レスポンシブなレイアウトにも対応できます。`border-radius` も自動的に検出され、円形やピル型の要素は適切な角丸が設定されます。

リーフではないコンテナ要素であっても、背景色や背景画像、角丸ボーダーを持つ場合はコンテナ用の bone として出力されます。これにより「カード背景の上にテキストの bone が重なる」という階層的なスケルトンが表現されます。

つまり Boneyard は、ヒューリスティクスやレイアウトエンジンの再現に頼らず、ブラウザ上で実際にレンダリングされた DOM のピクセル座標をそのまま読み取ることで、正確なスケルトンを生成しています。

生成された JSON ファイルと `<Skeleton>` コンポーネントは `name` プロパティを介して紐付けられます。例えば `<Skeleton name="activity">` と指定すると、`activity.bones.json` が対応するスケルトン定義となります。`registry.js` の `registerBones` 関数がこの名前をキーとして各 JSON ファイルをマッピングしているため、`<Skeleton>` コンポーネントは `loading` が `true` のときに対応する bone データを参照してスケルトンを描画できます。

実際のコードは https://github.com/0xGF/boneyard/blob/main/packages/boneyard/src/extract.ts や https://github.com/0xGF/boneyard/blob/main/packages/boneyard/src/react.tsx を参照してください。

## まとめ

- Boneyard は、実際のコンテンツをラップするだけでピクセル単位で正確なスケルトンローダーを自動生成するフレームワーク
- `<Skeleton>` コンポーネントで対象のコンポーネントをラップし、`npx boneyard-js build` を実行するとスケルトンローダーの定義ファイルが生成される
- データ取得に時間がかかる場合は `--wait` オプションや `fixture` プロパティを活用することで、正確なスケルトンローダーを生成できる
- 生成されたスケルトンローダーは、エントリーポイントで `registry.js` をインポートするだけで使用できるようになる
- Boneyard はブラウザ上で実際にレンダリングされた DOM のピクセル座標を読み取ることで、正確なスケルトンを生成している

## 参考

- [boneyard - skeleton screens for your UI](https://boneyard.vercel.app/features)
- [0xGF/boneyard: Auto generated skeleton loading framework](https://github.com/0xGF/boneyard)
