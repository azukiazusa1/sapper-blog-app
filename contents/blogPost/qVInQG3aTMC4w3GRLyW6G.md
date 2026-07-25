---
id: qVInQG3aTMC4w3GRLyW6G
title: "HTML-in-Canvas コンポーネントライブラリ Canvas UI"
slug: "html-in-canvas-component-library-canvasui"
about: "Canvas UI は HTML-in-Canvas API を活用し、液体シミュレーションやシェーダーといったクリエイティブな UI を構築するためのコンポーネントライブラリです。"
createdAt: "2026-07-25T20:00+09:00"
updatedAt: "2026-07-25T20:00+09:00"
tags: ["Web API", "canvas"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1ZO9sgxQcsw5cdIQdqmygG/06211c426a7b149121005f86a55e5c46/coffee-jelly_21116.png"
  title: "コーヒーゼリーのイラスト"
audio: null
selfAssessment:
    - question: "記事で紹介されている Canvas UI のコンポーネントの配布方法と、インストール後の扱いとして正しいものはどれですか?"
      answers:
        - text: "npm パッケージとして配布され、node_modules 内の依存パッケージとして管理する"
          correct: false
          explanation: "記事では shadcn レジストリで配布され、インストール後は自分自身のソースコードとして管理すると説明されています。"
        - text: "CDN から読み込む形式で配布され、バージョンは URL のパスで切り替える"
          correct: false
          explanation: "CDN 経由での配布については記事で触れられていません。"
        - text: "リポジトリを clone してビルドする必要があり、コンポーネント単位での導入はできない"
          correct: false
          explanation: "記事ではコンポーネント単位でインストールを行うと説明されています。"
        - text: "shadcn レジストリで配布され、インストール後は自分自身のソースコードとして管理する"
          correct: true
          explanation: "記事の通りです。自分のソースコードとして扱えるため、カスタマイズや拡張が容易に行えると説明されています。"
    - question: "Droplets コンポーネントに blur を指定すると、どのような表現が加わると記事で説明されていますか?"
      answers:
        - text: "滴が落ちる速度が遅くなり、ゆっくり流れ落ちるようになる"
          correct: false
          explanation: "落下速度に関わるのは記事のコード中にある fallSpeed であり、blur の効果ではありません。"
        - text: "曇った窓のように背景がぼやけ、マウスで擦った場所だけがクリアに見える"
          correct: true
          explanation: "記事の通りです。全体が曇ったような表現になり、擦った部分だけが鮮明になると紹介されています。"
        - text: "キャンバスの四隅が暗くなり、中央に視線が集まるようになる"
          correct: false
          explanation: "縁を暗くするのは記事のコード中にある vignette の役割です。"
        - text: "画面全体に色が重なり、指定した色味に染まったように見える"
          correct: false
          explanation: "コンテンツに色を重ねるのは記事のコード中にある tint と tintStrength です。"

published: true
---

Canvas UI は [HTML-in-Canvas](https://github.com/WICG/html-in-canvas) API を活用し、液体シミュレーションやシェーダーといったクリエイティブな UI を構築するためのコンポーネントライブラリです。HTML-in-Canvas は、`<canvas>` 要素の子として配置した HTML 要素の描画結果を、2D Canvas や WebGL、WebGPU で利用するための実験的な API です。元の HTML は DOM として保たれるため、Canvas 上の表示と DOM の位置を適切に同期することで、ポインターやキーボードによる操作、アクセシビリティツリーへの参加を維持したまま WebGL エフェクトを適用できます。

:::info
HTML-in-Canvas API は、2026 年 7 月時点では Chrome 148〜150 の Origin Trial として提供されている実験的な API です。ローカルで試す場合は Chrome Canary 149 以降で `chrome://flags/#canvas-draw-element` フラグを有効にします。一般のユーザーに提供する場合は、Origin Trial への登録とトークンの設定が必要です。
:::

各コンポーネントは React, Solid, Vue, Svelte など様々なフレームワークに対応しています。コンポーネントは [shadcn/ui](https://ui.shadcn.com/docs/directory) レジストリで配布されており、コンポーネントをインストールした後は自分自身のソースコードとして管理します。そのため、コンポーネントのカスタマイズや拡張が容易に行えます。

HTML-in-Canvas API に対応していないブラウザでは、通常の HTML 表示にフォールバックします。`Droplets` や `Glass` など一部のエフェクトは WebGL オーバーレイとして引き続き動作しますが、HTML の描画結果をテクスチャとして変形する完全な表現には HTML-in-Canvas API が必要です。

この記事では Canvas UI を試してみた様子を紹介します。

## Canvas UI のインストール

React で Canvas UI を利用する例を紹介します。shadcn レジストリ形式で配布されているため、コンポーネント単位でインストールを行います。また、あらかじめ `shadcn init` コマンドを実行しておく必要があります。

```bash
npx shadcn@latest init
```

[Canvas UI のコンポーネント一覧](https://canvasui.dev/components)から興味があるコンポーネントを探してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/6JhJ5nqEQJPS3i0sD453wy/d0fc608915689cf4329342610a29a78e/image.png)

試しに `Droplets` コンポーネントをインストールしてみましょう。このコンポーネントは、液体の滴が落ちるようなアニメーションを表現します。`shadcn` CLI を利用してインストールします。

```bash
npx shadcn@latest add @canvas-ui/droplets-react
```

インストールが完了すると `src/components/canvasui/Droplets.tsx` が作成されます。これをアプリケーションに組み込むことで、Canvas UI のコンポーネントを利用することができます。

```tsx:src/components/canvasui/Droplets.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface DropletsOptions {
  /** How much rain falls, from a light drizzle to a downpour (0 to 1.25). */
  intensity?: number;
  /** Animation speed multiplier. */
  speed?: number;
  /** Size of the droplet pattern. Higher means smaller drops. */
  scale?: number;
  /** Width of the droplets and their trails. */
  dropWidth?: number;
  /** How elongated the falling droplets are. */
  dropLength?: number;
  /** How strongly droplets refract the content behind them. */
  refraction?: number;
  /** Background blur outside the droplets, like a fogged up window. */
  blur?: number;
  /** Darkens the edges of the canvas (0 to 1). */
  vignette?: number;
  /** How fast the running drops slide down. */
  fallSpeed?: number;
  /** Horizontal wiggle of the running drops. */
  wiggle?: number;
  /** Multiplier for the small static droplets. */
  staticDrops?: number;
  /** Wipe drops off the glass with the pointer. */
  interactive?: boolean;
  /** Radius of the cursor wipe, relative to the screen height. */
  interactionRadius?: number;
  /** How strongly the cursor wipes drops off the glass (0 to 1). */
  interactionStrength?: number;
  /** How much the wipe distorts the content behind it. */
  interactionDistortion?: number;
  /** Tint color layered over the content as [r, g, b] in 0-1 range. */
  tint?: [number, number, number];
  /** Strength of the tint (0 to 1). */
  tintStrength?: number;
}

// ...
```

アプリケーション全体を `<Droplets>` コンポーネントでラップすると、画面全体に液体の滴が落ちるようなアニメーションが適用されます。

```tsx:src/App.tsx
import { TodoApp } from "@/components/TodoApp";
import Droplets from "@/components/canvasui/Droplets";

function App() {
  return (
    <Droplets className="flex min-h-svh items-center justify-center bg-background p-6">
      <TodoApp />
    </Droplets>
  );
}

export default App;
```

アニメーションが適用されていても、Todo アプリケーションのインタラクティブな操作はそのまま行えることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/SQOvtHAUkCnZ5aerlQQy2/6280d3c0ce33e053e00f2563026a0aba/6980b5c5-28dd-493f-a209-b174c04dc168.mov" controls></video>

HTML-in-Canvas API をサポートしていないブラウザでは、WebGL オーバーレイとして滴のアニメーションが表示されます。HTML の描画結果をテクスチャとして変形する表現は行えませんが、インタラクティブな操作はそのまま行えます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2Nzoo04LimKZJ0OyuVWUZc/8d09b90abdc4c0b06e0146c97f4dc547/image.png)

Props を調整することで、液体の滴の落ちる速度や量、滴の大きさなどを変更することができます。例えば `blur` を調整すると、曇った窓のように背景がぼやける表現を追加することができます。

```tsx:src/App.tsx {6}
import { TodoApp } from "@/components/TodoApp";
import Droplets from "@/components/canvasui/Droplets";

function App() {
  return (
    <Droplets blur={5} className="flex min-h-svh items-center justify-center bg-background p-6">
      <TodoApp />
    </Droplets>
  );
}

export default App;
```

全体的に曇っているような表現が追加され、マウスで画面を擦った場所の部分だけがクリアに見えるような楽しい表現です。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5rbqNW9nilNmIGPfgiVcEy/8047b8a3d5b09069006dbdc138c4b95a/7077ff29-e4c5-4206-a5f8-13caef42ef15.mov" controls></video>

もう少しコンポーネントを見てみましょう。`HexFloat` コンポーネントは画面を光沢のある六角形タイルに分割し、奥へ傾いたような遠近感と浮遊表現を加えます。カーソルを動かすと、周囲のタイルが平らになり、コンテンツを読み取れる領域が現れます。

```bash
npx shadcn@latest add @canvas-ui/hex-float-react
```

傾いた画面にそのまま文字を入力するのはちょっと不思議な気分です。

![](https://images.ctfassets.net/in6v9lxmm5c8/3LFjQwck72iZ2HFF72R9MM/174ad5a9d877ef7e23b8d054ea5c3119/image.png)

`Glass` コンポーネントはガラスレンズがカーソルを追従するような表現になります。

```bash
npx shadcn@latest add @canvas-ui/glass-react
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5fIX39Tgjkb3YUDH44Yeje/1054bd584e6d0c686574c50d15143a52/image.png)

`Shatter` コンポーネントはカーソルの周囲がガラスの破片のように割れる表現になります。

```bash
npx shadcn@latest add @canvas-ui/shatter-react
```

![](https://images.ctfassets.net/in6v9lxmm5c8/32AHkFwGN3hyYPw6VpYWe3/48edb53748614de5cffe3bdd6a1b179b/image.png)

## まとめ

- Canvas UI は HTML-in-Canvas API を利用して、HTML 要素の描画結果に WebGL エフェクトを適用するコンポーネントライブラリ
- 元の HTML は DOM として保たれ、適切に実装することでインタラクティブな操作やアクセシビリティを維持できるよう設計されている
- HTML-in-Canvas API は Chrome の実験的な機能であり、ローカルで試す場合は対応する Chrome Canary で `chrome://flags/#canvas-draw-element` フラグの有効化が必要
- HTML-in-Canvas API に対応していないブラウザでは通常の HTML 表示にフォールバックし、一部のエフェクトは WebGL オーバーレイとして動作する
- React, Solid, Vue, Svelte など様々なフレームワークに対応している
- コンポーネントは shadcn レジストリ形式で配布されており、`npx shadcn@latest add @canvas-ui/<コンポーネント名>` でインストールできる
- 雨粒が流れる `Droplets`、画面が傾く `HexFloat`、ガラスレンズがカーソルを追従する `Glass`、カーソル周辺が割れる `Shatter` など、Props を調整するだけで多彩な表現を実現できる

## 参考

- [Canvas UI](https://canvasui.dev/)
- [DavidHDev/canvas-ui: A library of creative canvas components. Real HTML with WebGL effects running over it. React, Vue, Svelte, vanilla.](https://github.com/DavidHDev/canvas-ui)
