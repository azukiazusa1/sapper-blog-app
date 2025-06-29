---
id: 3tEaD4hYa6KiLr9GFJi8IS
title: "TailwindCSSでダークモード"
slug: "tailwindcss-dark-mode"
about: "昨今のアプリケーションでは、ダークモードを提供しているのがもはや当たり前になってきました。 OSのレベルでダークモードを設定することができ、ダークモードが提供されていないサイトは眩しく感じしてしまって敬遠してしまうなんて経験はあるのではないでしょうか？  そんな一般化されたダークモードの提供をTailwind CSSで実装します。"
createdAt: "2021-02-21T00:00+09:00"
updatedAt: "2021-02-21T00:00+09:00"
tags: ["CSS", "tailwindcss"]
thumbnail:
  url: "https:undefined"
  title: ""
audio: null
selfAssessment: null
published: true
---
昨今のアプリケーションでは、ダークモードを提供しているのがもはや当たり前になってきました。
OS のレベルでダークモードを設定でき、ダークモードが提供されていないサイトは眩しく感じしてしまって敬遠してしまうなんて経験はあるのではないでしょうか？

そんな一般化されたダークモードの提供を Tailwind CSS で実装します。

# tailwind.config.jsの設定の変更

Tailwind CSS でタークモードを有効化するためには、`tailwind.config.js` ファイルを修正します。
`darkMode` の値に `media` または `class` を設定します。

```js
module.exports = {
  purge: ['./public/**/*.html'],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
  darkMode: // 'media' or 'class'
}
```

## media

`media` を指定した場合には、OS の設定に基づいてダークモードを適用するかどうか決定します。

```js
module.exports = {
  darkMode: 'media',
  // ...
}
```

OS のダークモードの設定値は[prefers-color-scheme](https://developer.mozilla.org/ja/docs/Web/CSS/@media/prefers-color-scheme)によって取得されます。

`media` を指定した場合には、手動でダークモードとライトモードを切り替えることができません。
そのため、次に説明する `class` を指定することが一般的でしょう。

## class

ユーザーによって手動できダークモードに切り替えられるようにするためには、`class` を指定します。

```js
module.exports = {
  darkMode: 'class',
  // ...
}
```

`class` が指定された場合には、自身の祖先要素に対して `dark` というクラスが付与されている場合に限り、ダークモードが適用されます。
実際には、`<html>` タグに対して `dark` クラスを不要することになるでしょう。

```html
<html class="dark">
  <body>
     <!-- ... -->
  </body>
</html>
```

公式サイトに JavaScript によってダークモードを切り替える方法が記載されているので抜粋します。

```js
// On page load or when changing themes, best to add inline in `head` to avoid FOUC
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}

// Whenever the user explicitly chooses light mode
localStorage.theme = 'light'

// Whenever the user explicitly chooses dark mode
localStorage.theme = 'dark'

// Whenever the user explicitly chooses to respect the OS preference
localStorage.removeItem('theme')
```
[https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually)

 はじめに、ローカルストレージの `theme` の値を確認します。
 その値が `dark` であった場合には、`<html>` タグに `dark` クラスを付与します。

 ローカルストレージに値が存在しない場合には、`window.matchMedia('(prefers-color-scheme: dark)').matches` によって OS のダークモードの設定を確認します。

 [window.matchMedia](https://developer.mozilla.org/ja/docs/Web/API/Window/matchMedia)は、指定されたメディアクエリのパースされた値を返します。
 `window.matchMedia('(prefers-color-scheme: dark)').matches` は、OS の設定がダークモードのときには `true` を返します。

ボタンクリックなどによってダークモードを切り替える場合には、次のような例で良いでしょう。

```html
<button onclick="toggleDarkMode()">テーマ切り替え</button>

<script>
  function toggleDarkMode() {
    // htmlタグにdarkクラスが含まれているかどうか
    if (document.documentElement.contains('dark') {
        // darkクラスが含まれているならライトモードに変更
        document.documentElement.remove('dark')
        localStorage.theme = 'light'
    } else {
        // darkクラスが含まれていないならダークモードに変更
      document.documentElement.add('dark')
      localStorage.theme = 'dark'
    }
  }
</script>
```

# ダークモード時のスタイルの指定

ダークモード時に適用されるスタイルの指定の仕方を見ていきましょう。
至って単純で、ダークモード適用時に上書きしたいスタイルに対して `dark:` のプレフィックスを指定するだけです。

```html
<body class="min-h-screen bg-gray-100 dark:bg-gray-800 dark:text-gray-50">
  <h1 class="text-2xl">Hello World!</h1>
</body>
```

それぞれ次のようにスタイルが適用されます。

- ライトモード

![light-theme](//images.ctfassets.net/in6v9lxmm5c8/5EOzwR5Ix10tZnlrDhBi0m/a0bf29637918ccba12fe3d0bb02b7720/____________________________2021-02-21_21.03.26.png)

- ダークモード

![dark-theme](//images.ctfassets.net/in6v9lxmm5c8/ZIqIXXQn2cIKQsrLkEEdB/1435da48b667472823d0f072715ed393/____________________________2021-02-21_21.03.49.png)

# 終わりに

以上のように、Tailwind CSS では簡単にダークモードを提供できます。
またユーティリティクラスの使いやすさはそのままダークモードのスタイルの指定にも適用できるので、細かい調整もしやすく嬉しい限りです。
