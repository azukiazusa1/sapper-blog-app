---
id: VBBEkzzKHXtsQdJXiaVP6
title: "Tailwind CSS v4 で導入される CSS First Configurations"
slug: "tailwind-css-v4-css-first-configurations"
about: "Tailwind CSS v4 における最も大きな変更点の 1 つは、CSS First Configurations です。今まで `tailwind.config.js` で設定していたテーマなどの設定を CSS ファイル内で行うことができるようになります。"
createdAt: "2024-11-30T11:21+09:00"
updatedAt: "2024-11-30T11:21+09:00"
tags: ["Tailwind CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4zcDwLDoER7WJWPvpUSMuH/cb8db9b06837cd1dc5fa80cbdd429c0e/winter_snow-covered-road_15542-768x630.png"
  title: "雪道のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "CSS First Configurations において、カラーテーマ `primary` を定義するための記述として正しいものはどれか？"
      answers:
        - text: "@theme.color: { primary: '#2979ff' }"
          correct: false
          explanation: null
        - text: "@theme { @color { primary: '#2979ff' } }"
          correct: false
          explanation: null
        - text: "@color { primary: '#2979ff' }"
          correct: false
          explanation: null
        - text: "@theme { --color-primary: '#2979ff' }"
          correct: true
          explanation: null
published: true
---
Tailwind CSS v4 における最も大きな変更点の 1 つは、CSS First Configurations です。今まで `tailwind.config.js` で設定していたテーマなどの設定を CSS ファイル内で行うことができるようになります。

例えば以下のような `tailwind.config.js` があるとします。

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#ff0000",
      },
    },
  },
};
```

これを新しく、CSS の変数として定義できるようになるのです。テーマの定義は新しい `@theme` ディレクティブを使って行います。

```css:app.css
@import "tailwindcss";

@theme {
  --color-primary: #2979ff;
  --color-secondary: #fb8c00;
}
```

CSS ファイルで設定した変数は以下のように Tailwind CSS のクラスに適用できます。

```html
<div class="bg-primary text-secondary">Hello, Tailwind CSS!</div>
```

## なぜ CSS First Configurations が導入されたのか

Tailwind CSS v4.0 の主な目標は、フレームワークを CSS ネイティブにし、JavaScript ライブラリのように感じさせないようにすることであると述べられています。実際に Tailwind CSS を Vite で使用する際には多くの設定が簡素化されていて、CSS としての設定に注力できるようになっていることがわかります。

すべてのテーマが CSS 変数として出力されるようになったことにより、その他のライブラリとの統合がしやすくなったという利点があります。すべてのテーマは `:root` 要素に出力されます。

```css
:root {
  --color-red-50: oklch(0.971 0.013 17.38);
  --color-red-100: oklch(0.936 0.032 17.717);
  --color-red-200: oklch(0.885 0.062 18.334);
  --color-red-300: oklch(0.808 0.114 19.571);
  --color-red-400: oklch(0.704 0.191 22.216);
  /* ... */
}
```

今までは `tailwind.config.js` で設定していたテーマを別の場所で参照したいような場合には、JavaScript を通じてアクセスする必要がありました。v4 では CSS 変数を通じて簡単にアクセスできるようになります。

```tsx
.my-element {
  color: var(--color-red-500);
}
```

Framer Motion などのライブラリを使用する際に、CSS 変数を使用することでアニメーションの設定を簡単に行うことができます。

```tsx
import { motion } from "framer-motion";

export const MyComponent = () => (
  <motion.div
    initial={{ y: "var(--spacing-8)" }}
    animate={{ y: 0 }}
    exit={{ y: "var(--spacing-8)" }}
  >
    {children}
  </motion.div>
);
```

## tailwind.config.js との違い

CSS First Configurations では `tailwind.config.js` で設定していたテーマなどの設定を CSS ファイル内で行うようになります。今まで `tailwind.config.js` で設定していたテーマなどの設定がどのように変更されるのかを見ていきましょう。

## namespace

従来の `tailwind.config.js` では `theme` オブジェクトのプロパティとしてプリミティブな値を設定していました。設定例としては以下のようなものがあります。

```js:tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    colors: {
      'blue': '#1fb6ff',
      'purple': '#7e5bef',
      'pink': '#ff49db',
      'orange': '#ff7849',
      'green': '#13ce66',
      'yellow': '#ffc82c',
      'gray-dark': '#273444',
      'gray': '#8492a6',
      'gray-light': '#d3dce6',
    },
    fontFamily: {
      sans: ['Graphik', 'sans-serif'],
      serif: ['Merriweather', 'serif'],
    },
  }
};
```

例えば `theme.colors` で設定した `blue` や `purple` などの色は `backgroundColor`, `borderColor`, `textColor` などの色に関するプロパティに適用され、`bg-blue`, `border-purple`, `text-pink` などのクラス名で使用できます。上記の設定で出てきた基本的なプリミティブな値はコアプラグインとして提供されています。Tailwind CSS はプラグインをカスタマイズすることで、自身のデザインシステムに合わせたテーマを使用できるように設計されています。

CSS First Configurations では、`theme` オブジェクトの各プロパティが [namespace](https://tailwindcss.com/docs/theme#theme-variable-namespaces) に対応しています。`namspace` は CSS 変数の先頭に付与される `--font` や `--color` などのプレフィックスです。

例として上記の `tailwind.config.js` を CSS First Configurations で書き換えると以下のようになります。`colors` に対して `--color` のプレフィックスといったように `namespace` が付与されています。

```css:app.css
@import "tailwindcss";

@theme {
  /* screens */
  --breakpoint-sm: 480px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 976px;
  --breakpoint-xl: 1440px;

  /* colors */
  --color-blue: '#1fb6ff';
  --color-purple: '#7e5bef';
  --color-pink: '#ff49db';
  --color-orange: '#ff7849';
  --color-green: '#13ce66';
  --color-yellow: '#ffc82c';
  --color-gray-dark: '#273444';
  --color-gray: '#8492a6';
  --color-gray-light: '#d3dce6';

  /* fontFamily */
  --font-sans: 'Graphik', 'sans-serif';
  --font-serif: 'Merriweather', 'serif';
}
```

定義されている namespace の一覧は [namespace reference](https://tailwindcss.com/docs/v4-beta#namespace-reference) で確認できます。多くの場合あらかじめ定義されている namespace で十分ですが、より細かい設定を行いたい場合は自分で namespace を定義することもできます。

### テーマの拡張

`tailwind.config.js` で `extend` オブジェクトを使用すると既存のテーマを拡張できました。

```js:tailwind.config.js
module.exports = {
  theme: {
     extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },
};
```

CSS First Configurations では、単に CSS 変数を定義することで上書きが可能です。

```css:app.css
@import "tailwindcss";

@theme {
  --spacing-128: 32rem;
  --spacing-144: 36rem;
  --border-radius-4xl: 2rem;
}
```

`--{namespace}-*` を使用すると、既存のテーマを一括で上書きできます。

```css:app.css
@import "tailwindcss";

@theme {
  --color-*: initial;

  --color-primary: #2979ff;
  --color-secondary: #fb8c00;
}
```

上記の例では、`--color-*` で定義されている全ての色を初期化し、`--color-primary` と `--color-secondary` のみを定義しています。これにより、デフォルトで存在していた `--bg-blue-100` や `--text-gray-800` などの色はすべて使用できなくなり、`--color-primary` と `--color-secondary` のみが使用可能になります。

以下のようにすべての設定を一括で上書きすることもできます。

```css:app.css
@import "tailwindcss";

@theme {
  --*: initial;
}
```

`--*: initial` を使用する代わりに、明示的にデフォルトのテーマを import しないようにすることもできます。

```css:app.css
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);

@theme {
  /* ... */
}

```

### テンプレートファイルの指定

Tailwind CSS では出力される CSS ファイルを最適化するために、ソースとなるファイルに含まれるクラス名を解析して使用されているクラスのみを出力するしくみが備わっています。クラス名の解析をどのファイルに対して行うか指定するために `content` オプションを使用していました。`content` オプションにはファイルのパス名を glob パターンで指定し、一致したファイルのみが解析の対象となります。

```js:tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{jsx,tsx,html}',
  ],
};
```

CSS First Configurations では `source()` 関数を使用してテンプレートファイルを指定します。

```css:app.css
@import "tailwindcss" source('./src/**/*.{jsx,tsx,html}');
```

!> TailwindCSS v4 では `source` を指定せずとも、Tailwind CSS が自動的にテンプレートファイルを見つけてくれます。`source()` 関数は大規模なモノレポのような環境で、特定のディレクトリのみを解析対象としたい場合に使用します。

`/node_modules` 配下のファイルのように、デフォルトで Tailwind CSS によって解析がされないファイルを指定する場合には、`@source` ディレクティブを使用します。

```css:app.css
@import "tailwindcss";
@source "./node_modules/**/my-ui-components/"
```

### ダークモード

Tailwind CSS ではダークモードをサポートしており、`dark:text-white` のようにクラス名に `dark:` プレフィックスを付与することでダークモード用のスタイルを適用できます。デフォルトでは `prefers-color-scheme` メディアクエリの値に基づいてダークモードが切り替わります。

`tailwind.config.js` では `darkMode` オプションを使用すると、どのようにダークモードを切り替えるかを指定できました。`darkMode` オプションには `media` または `selector` を指定できます。

`selector` を指定すると、祖先の HTML 要素に `.dark` クラスが付与されている場合にダークモードが有効になります。

!> `selector` オプションは Tailwind CSS v3.4.1 で追加されたオプションです。v3.4.0 以前における `class` オプションを代替するものです。

```js:tailwind.config.js
module.exports = {
  darkMode: 'selector',
};
```

`selector` は配列形式で渡すことで、セレクタを指定することもできます。

```js:tailwind.config.js
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
};
```

CSS First Configurations で `selector` オプションを使用する場合は以下のように記述できます。

```css:app.css
@import "tailwindcss";
@variant dark (&:where(.dark, [data-theme="dark"]))
```

`@variant` ディレクティブは指定した名前（ここでは `dark`）のバリアントを定義するために使用されます。2 つ目の引数にはバリアントが有効になるセレクタを指定します。

結果として以下のような CSS が生成されます。

```css
.dark\:underline:where(.dark, [data-theme="dark"]) {
  text-decoration: underline;
}
```

### クラス名のプレフィックス

TailwindCSS が生成する生成するクラス名が既存の CSS と衝突することをさけるために、クラス名にプレフィックスを付与できます。`tailwind.config.js` では `prefix` オプションを使用してプレフィックスを指定します。

```js:tailwind.config.js
module.exports = {
  prefix: 'tw-',
};
```

これにより、`bg-blue-500` というクラス名は `tw-bg-blue-500` というクラス名に変更されます。

CSS First Configurations では `prefix()` 関数を使用してプレフィックスを指定します。

```css:app.css
@import "tailwindcss" prefix('tw-');
```

`prefix()` 関数を使用せずに、CSS 変数名にプレフィックスを付与することもできます。

```css:app.css
@import "tailwindcss";

@theme {
  --tw-color-primary: #2979ff;
  --tw-color-secondary: #fb8c00;
}
```

### プラグインの使用

`tailwind.config.js` では `plugins` オプションを使用してプラグインを追加できました。

```js:tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

CSS First Configurations では `@plugin` ディレクティブを使用してプラグインを追加します。

```css:app.css
@import "tailwindcss";
@plugin "tailwindcss/typography";
```

### `!important` のオプション

`tailwind.config.js` では `important` オプションを使用して、生成される CSS に `!important` を付与できました。

```js:tailwind.config.js
module.exports = {
  important: true,
};
```

CSS First Configurations では以下のように記述します。

```css:app.css
@import "tailwindcss" important;
```

## まとめ

- Tailwind CSS v4 では `tailwind.config.js` で設定していたテーマなどの設定を CSS ファイル内行えるようになった
- theme オブジェクトのプロパティが namespace に対応している
- `extend` オブジェクトを使用していたテーマの拡張は、CSS 変数を定義することで行う
- `content` オプションは `source()` 関数に置き換えられた
- ダークモードの設定は `@variant` ディレクティブを使用して行う
- クラス名のプレフィックスは `prefix()` 関数を使用して行う
- プラグインの使用は `@plugin` ディレクティブを使用して行う

## 参考

- [Tailwind CSS v4.0 Beta - Tailwind CSS](https://tailwindcss.com/docs/v4-beta#css-configuration-in-depth)
- [Open-sourcing our progress on Tailwind CSS v4.0 - Tailwind CSS](https://tailwindcss.com/blog/tailwindcss-v4-alpha)
