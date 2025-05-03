---
id: e7ZWfFoSm1di7UIDUya1e
title: "React Aria でアクセシブルなコンポーネントを作成する"
slug: "react-aria-accessible-component"
about: "React Aria は Adobe が提供する React 用のコンポーネントライブラリです。スタイルを持たずに UI の機能やロジックのみを提供するいわゆるヘッドレス UI ライブラリであり、特に React Aria はアクセシビリティを最優先した設計となっているのが特徴です。ヘッドレス UI ライブラリを用いて UI コンポーネントを実装することで、開発者はビジネスロジックやデザインに集中することができます。"
createdAt: "2024-08-25T15:34+09:00"
updatedAt: "2024-08-25T15:34+09:00"
tags: ["React", "React Aria", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5z1eT7C07mG8RBqG4W9fz5/0eac5c590cdb31a4395101081a526cb0/softcream_maccha_illust_3682.png"
  title: "抹茶のソフトクリームのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "<Menu> コンポーネントにデフォルトで付与されるクラス名は何ですか？"
      answers:
        - text: ".react-aria-Menu"
          correct: true
          explanation: "クラス名は `react-aria-ComponentName` という命名規則に従って付与されます。"
        - text: ".ra-Menu"
          correct: false
          explanation: null
        - text: ".Menu"
          correct: false
          explanation: null
        - text: ".aria-Menu"
          correct: false
          explanation: null
published: true
---
[React Aria](https://react-spectrum.adobe.com/react-aria/) は Adobe が提供する React 用のコンポーネントライブラリです。スタイルを持たずに UI の機能やロジックのみを提供するいわゆるヘッドレス UI ライブラリであり、特に React Aria はアクセシビリティを最優先した設計となっているのが特徴です。ブログの連載記事で、アクセシブルなボタンコンポーネントの作成方法について深く掘り下げられていることから、その力の入れようが伺えます。

https://react-spectrum.adobe.com/blog/building-a-button-part-1.html

React Aria のようなヘッドレス UI ライブラリは従来の UI ライブラリとは異なり、スタイルを持たないためプロダクトのデザインに合わせたカスタマイズがしやすいといったメリットがあります。読者の中には UI ライブラリを使用していつの間にかスタイルを上書きする `!important` だらけになってしまったという経験がある方もいるかもしれません。

ヘッドレス UI ライブラリを用いて UI コンポーネントを実装することで、アクセシビリティサポートのための複雑な実装の詳細や、細かな UI の挙動の実装をライブラリに任せて、開発者はビジネスロジックやデザインに集中できます。タブやスイッチコントロールのような UI は今日の Web アプリケーションでは当たり前に見かけるものですが、このような UI は HTML のネイティブな要素として提供されていません。アクセシビリティに考慮してこのような UI を実装するために開発者に多くの要求がされています。適切な実装を行うために必要な機能は [ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) にまとめられています。このような UI の再実装は多くの企業で行われていて、共通の課題となっています。

React Aria のコンポーネントは[コンポジションを中心に設計](https://react-spectrum.adobe.com/react-aria/advanced.html#contexts)されており、小さなコンポーネントを組み合わせて再利用可能なコンポーネントとして利用できるため柔軟なカスタマイズが可能です。また、React Aria は再利用可能なコンポーネントとしてラップして使用されることが想定されていて、ドキュメントではどのようにコンポーネントをラップするかについても詳細に解説されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/5eDqYzkfmUHh03jFxcit3/0f77530c1d8f55c5fab24c7030bf93dd/__________2024-08-24_16.17.31.png)

https://react-spectrum.adobe.com/react-aria/ListBox.html#reusable-wrappers

## React Aria を使ってみる

それでは実際に React Aria を使ってアクセシブルなコンポーネントを作成してみましょう。以下コマンドでインストールします。

```sh
npm install react-aria-components
```

まずはメニューコンポーネントを作成してみましょう。冒頭でも伸びた通り、React Aria はコンポジションを中心に設計されているため、複数のコンポーネントを組み合わせてメニューコンポーネントを作成します。基本的には各コンポーネントに対応したドキュメントが提供されているため、それを参考にしてコンポーネントを組み合わせていくと良いでしょう。メニューコンポーネントのドキュメントは以下の通りです。

https://react-spectrum.adobe.com/react-aria/Menu.html

ドキュメントの例を参考にコンポーネントを作成すると、以下のようになります。

```tsx:Menu.tsx
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";

export const MyMenu = () => {
  return (
    <MenuTrigger>
      <Button aria-label="Menu">☰</Button>
      <Popover>
        <Menu>
          <MenuItem onAction={() => alert("open")}>Open</MenuItem>
          <MenuItem onAction={() => alert("rename")}>Rename…</MenuItem>
          <MenuItem onAction={() => alert("duplicate")}>Duplicate</MenuItem>
          <MenuItem onAction={() => alert("share")}>Share…</MenuItem>
          <MenuItem onAction={() => alert("delete")}>Delete…</MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
```

メニューコンポーネントは ARIA Authoring Practices Guide (APG) の[メニューパターン](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) に準拠しているため、アクセシビリティに配慮した実装がされています。例としてメニューパターンでは、矢印キーを入力した際にメニューの項目を移動できることが求められています。またメニューを表示する際に、表示領域が足りない場合に自動で上下左右を反転して表示するなど、普段 UI を実装していると見落としがちな挙動もしっかりと実装されています。

ユーザーはボタンのクリック・タッチ・キーボード操作でメニューを開くことができます。実際に試してみると、スタイルは何も指定していないためデフォルトのスタイルが適用されていますが、確かに適切なメニューの機能を満たしているコンポーネントが作成できていることがわかります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3nBxyHa1Xnr6WiskvbIafe/7669904f8782cf7d2678a783a3f346bf/_____2024-08-24_17.02.08.mov" controls></video>

## コンポーネントのスタイリング

React Aria ではバニラ CSS・Tailwind CSS・CSS in JS など特定のスタイリングの手段に依存せずに使用できます。クラス名を用いてスタイルを指定し、`data-` 属性もしくはレンダープロップパターンを用いて状態に応じたスタイルを適用するといのが基本的なパターンです。

具体的にメニューコンポーネントにスタイルを適用する例を見ていきましょう。各コンポーネントごとにそれぞれ対応するクラス名が提供されています。例えば `<Menu>` コンポーネントには `.react-aria-Menu` といった感じです。すべてのコンポーネントは `react-aria-ComponentName` という命名規則に従ってクラス名が付与されます。

クラス名を元にスタイルを指定すると、以下のようになります。

```css
.react-aria-Button {
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
}

.react-aria-Menu {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  outline: none;
}

.react-aria-MenuItem {
  padding: 8px 16px;
  cursor: pointer;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/3ABFguSi67SLDSnTtcoGlH/82ef7ac065079375736dded352385dc7/__________2024-08-24_18.07.46.png)

コンポーネントに `className` Props を渡すことで、クラス名を上書きすることも可能です。例えば CSS Modules を使用している場合は以下のように独自のクラス名を指定できます。

```tsx
import styles from "./Menu.module.css";

export const MyMenu = () => {
  return (
    <MenuTrigger>
      <Button className={styles.button} aria-label="Menu">
        ☰
      </Button>
      <Popover>
        <Menu className={styles.menu}>
          <MenuItem className={styles.menuItem} onAction={() => alert("open")}>
            Open
          </MenuItem>
          <MenuItem
            className={styles.menuItem}
            onAction={() => alert("rename")}
          >
            Rename…
          </MenuItem>
          <MenuItem
            className={styles.menuItem}
            onAction={() => alert("duplicate")}
          >
            Duplicate
          </MenuItem>
          <MenuItem className={styles.menuItem} onAction={() => alert("share")}>
            Share…
          </MenuItem>
          <MenuItem
            className={styles.menuItem}
            onAction={() => alert("delete")}
          >
            Delete…
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
};
```

### 状態に応じたスタイルの適用

UI コンポーネントを様々な状態を持つことがあります。例えばボタンコンポーネントはホバー・アクティブ・フォーカス状態を取りうり、ユーザーがそれぞれの状態を識別しやすいように、状態ごとにスタイルを変更する必要があるでしょう。

React Aria では `data-` 属性を用いるか、レンダープロップパターンを用いて状態に応じたスタイルを適用できます。メニューコンポーネントにおいて、フォーカスされている項目に対してスタイルを適用する例を見ていきましょう。

`<MenuItem>` コンポーネントは現在フォーカスされている状態の場合、`data-focused` 属性が付与されます。これを元にスタイルを指定できます。

```css
.react-aria-MenuItem {
  padding: 8px 16px;
  cursor: pointer;
  outline: none;

  &[data-focused] {
    background-color: #0070f3;
    color: white;
  }
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/69PNXpYNuD1kxxCMc9E89t/cae38924844611d0e366e333e4c56b1f/__________2024-08-24_18.41.09.png)

Tailwind CSS を使用している場合は `data-[state]:className` の形式でスタイルを指定できます。

```tsx
<MenuItem
  className="p-2 data-[focused]:bg-blue-500 data-[focused]:text-white"
  onAction={() => alert("open")}
>
  Open
</MenuItem>
```

また、`tailwindcss-react-aria-components` パッケージを使用することで、data 属性に対応したクラスを短く記述でき、エディタによる補完も利用できるようになります。

```tsx
<MenuItem
  className="focused:bg-blue-500 focused:text-white p-2"
  onAction={() => alert("open")}
>
  Open
</MenuItem>
```

`data` 属性の代わりにレンダープロップパターンを使用することもできます。このパターンでは `children` が React コンポーネントを返す関数となっており、関数の引数に状態が渡されるため、状態に応じた上限分岐でスタイルを適用できます。

```tsx
<MenuItem onAction={() => alert("open")}>
  {({ isFocused }) => (
    <>
      <div>Open</div>
      {isFocused && <div>✔️</div>}
    </>
  )}
</MenuItem>
```

`className` Props に関数を渡すこともできます。

```tsx
<MenuItem
  onAction={() => alert("open")}
  className={({ isFocused }) =>
    `p-2 ${isFocused ? "bg-blue-500 text-white" : ""}`
  }
>
  Open
</MenuItem>
```

### アニメーション

React Aria のコンポーネントは [@keyframe](https://developer.mozilla.org/ja/docs/Web/CSS/@keyframes) によるアニメーションをサポートしているほか、[Framer Motion](https://www.framer.com/motion/) などの JavaScript ベースのアニメーションライブラリと組み合わせて使用することもできます。

`<Popover>` や `<Modal>` のようなコンポーネントは、`data-entering`、`data-exiting` 状態で開始・終了時のアニメーションを適用できます。

```css
.react-aria-Popover[data-entering] {
  animation: slide 0.3s ease-in-out;
}

.react-aria-Popover[data-exiting] {
  animation: slide 0.3s reverse ease-in-out;
}

@keyframes slide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3CRtcY0zu77qbQetZdxbSI/e00cc3740ba42556166128f73d3bcb08/_____2024-08-24_19.09.58.mov" controls></video>

## まとめ

- React Aria はアクセシビリティを最優先した設計となっているヘッドレス UI ライブラリ
- コンポーネントはコンポジションを中心に設計されており、小さなコンポーネントを組み合わせて再利用可能なコンポーネントとして利用できる
- コンポーネントに対応するクラス名が提供されているため、スタイルを指定できる。また、`className` Props を渡すことでクラス名を上書きすることも可能
- `data-` 属性やレンダープロップパターンを用いて状態に応じたスタイルを適用することができる

## 参考

- [React Aria](https://react-spectrum.adobe.com/react-aria/)
- [拡張性に優れた React Aria のコンポーネント設計](https://zenn.dev/cybozu_frontend/articles/react-aria-component-design)
