---
id: 3xfuFbX8qkyTYaQQa3hdAQ
title: "【React】state のリフトダウンパターン"
slug: "react-state"
about: "React において不要な再レンダリングを避けるためのいくつかのパターンを紹介します"
createdAt: "2022-10-02T00:00+09:00"
updatedAt: "2022-10-02T00:00+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2c9EyCXfherkq4ICwfDHaM/13bcad3dd62573b050eb8ad25dce4275/1200px-React-icon.svg.png"
  title: "React"
selfAssessment: null
published: true
---
React のパフォーマンスについて語るとき、コンポーネントの再レンダリングは外せない話題となるでしょう。React は以下の条件のときに再レンダリングが発生します。

- コンポーネントの state が更新された
- 親のコンポーネントが再レンダリングされた

例えば典型的なカウンターアプリのように、ボタンをクリックしたとき `count` state を更新する場合には必要な再レンダリングといえます。状態が更新されても再レンダリングされなければ、表示されるカウント数は一向に「0」のままですから。

```tsx
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
};
```

パフォーマンス上で問題になるのは不必要な再レンダリングが実行されている場合です。ユーザーが入力フィールドになにか入力をおこなっているとき、入力フィールドのみが再レンダリングされていればユーザーは変更に気がつくことができます。しかし、ユーザーが入力を行うたびにページ全体が再レンダリングされているような場合には、不要な再レンダリングされていると考えられるでしょう。

通常 React は非常に高速に動作するので、不要な再レンダリングが発生すること自体は大きな問題となりません。しかしながら、再レンダリングが頻繁に発生したり、非常に遅いコンポーネントが再レンダリングされたりすると、入力フィールドへの入力などのインタラクションにおいて遅延を感じるようになります。

## 非常に遅いコンポーネント

実際に非常に遅いコンポーネントが不必要に再レンダリングされてしまう例を試してみましょう。`<SuperSlowComponent>` は `while` ループで約 200ms の同期的な遅延を仕込んでいます。実際に下記のサンドボックスで入力フォームに入力すると遅延があることを確認できます。

<iframe src="https://codesandbox.io/embed/serene-dewdney-g3rnqg?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="serene-dewdney-g3rnqg"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

この問題は入力フォームに入力して `setName` が呼ばれ state が更新されるたびに `<SuperSlowComponent>` が再レンダリングされるため発生しています。まさに不要な再レンダリングによって引き起こされた問題と言えます。この問題を解決する方法をいくつか見ていきたいと思います。

## state リフトダウンパターン

はじめに state のリフトダウンパターンと呼ばれる解決策です。これは 1 つのコンポーネントの中で特定の部分のみが state に依存している場合に適しています。state に依存している部分を state と一生に別のコンポーネントに切り出すことで、その他の部分は state が更新されても再レンダリングされないようになります。状態は子コンポーネントが持つようになるためです。

![スクリーンショット 2022-10-02 14.02.54](//images.ctfassets.net/in6v9lxmm5c8/3qxokJ1y1ymckHjHNxsGnh/6a5c05ffe93f3bb44fb5c8905cf88d8e/____________________________2022-10-02_14.02.54.png)

![スクリーンショット 2022-10-02 14.04.46](//images.ctfassets.net/in6v9lxmm5c8/6fE0xfUxxhQoli2IDGSdxY/b5958e77e13f76c4863b32d76b05986b/____________________________2022-10-02_14.04.46.png)

ここでは `useState` と `<input />` の部分を `<Form />` コンポーネントとして切り出すことでその部分のみ state が更新されたとき再レンダリングされるようにできます。実際に以下のデモで試してみてください。`<SuperSlowComponent />` が再レンダリングされないため入力時の遅延を感じなくなるはずです。

<iframe src="https://codesandbox.io/embed/modest-gianmarco-ll3b9g?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="modest-gianmarco-ll3b9g"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## リフトアップパターン

上記の解決策は有効ですが、多くの場合入力フォームに入力した state は他のコンポーネントと共有して使いたいことでしょう。リフトダウンパターンは state を共有できないのでこのような場合には適していません。

リフトダウンパターンとは反対に state に依存する部分をリフトアップ（＝親コンポーネント）とするパターンでも不要な再レンダリングを防ぐことができます。多少強引な例ですが、入力フォームに「hide」と入力されている場合のみ `<SuperSlowComponent />` を表示しない例を考えてます。単純に考えると公式のドキュメントでも推奨されているとおり、[state のリフトアップ](https://ja.reactjs.org/docs/lifting-state-up.html) を行い state を共有することになるでしょう。

<iframe src="https://codesandbox.io/embed/agitated-poincare-qve67s?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="agitated-poincare-qve67s"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

しかしこの方法ですとまたもやユーザーが入力フォールドへ入力するたびに、非常に遅いコンポーネントが再レンダリングされてしまいます。いったん `useState` は `<App />` で呼び出さす `<Form />` コンポーネントで管理するように戻しておきましょう。

リフトアップパターンでは、状態に依存している部分をより小さなコンポーネントに切り出しカプセル化する点はリフトダウンパターンと同様です。リフトダウンパターンとの違いは、非常に遅いコンポーネントを `children` として切り出したコンポーネントに渡すところです。`children` は単なる Prop ですので、状態の変化を受けないため、再レンダリングされません。

<iframe src="https://codesandbox.io/embed/loving-kalam-p55qq8?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="loving-kalam-p55qq8"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

リフトアップパターンの亜種として、 `children` としてコンポーネントを渡す代わりにコンポーネントを Props として渡すパターンもあります。

<iframe src="https://codesandbox.io/embed/romantic-moon-2s40lz?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="romantic-moon-2s40lz"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## メモ化パターン

最後にコンポーネントを `React.memo` でラップしてメモ化するパターンです。パフォーマンス最適化の文脈でメモ化という用語を聞いたことがある人も多いでしょう。

`React.memo` は親コンポーネントの再レンダリング時に渡された Props と前回の Props の値を比較し、同じ値であればコンポーネントの再レンダリングを行わずにメモ化したコンポーネントを再利用します。下記のデモでは `name` state が変更さ `<App />` コンポーネントが再レンダリングされても `<SuperSlowComponent />` コンポーネントに渡した Props が変化しないため `<SuperSlowComponent />` の再レンダリングが実行されません。

<iframe src="https://codesandbox.io/embed/quirky-dew-egm39t?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="quirky-dew-egm39t"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## 参考

- [React re-renders guide: everything, all at once](https://www.developerway.com/posts/react-re-renders-guide)
- [Before You memo()](https://overreacted.io/before-you-memo/)
