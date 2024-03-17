---
id: y3YylqX9JfHoeNUvBfvbV
title: "TailwindCSS のダークモードでページ読み込み時に一瞬ライトモードで表示されてしまうときの対応法"
slug: "what-to-do-when-tailwindcss-is-momentarily-displayed-in-light-mode-in-dark-mode"
about: "ユーザーの OS の設定や LocalStorage の値をもとにダークモードかどうか判定する場合、コンテンツが読み込まれる前にスクリプトの実行が完了している必要があります。"
createdAt: "2022-12-11T00:00+09:00"
updatedAt: "2022-12-11T00:00+09:00"
tags: ["tailwindcss", "ダークモード"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1fU89aRBH4MAakN0HQtUK9/703645f396295d93d07322857ad125ed/_Pngtree_crescent_moon_and_star_8390658.png"
  title: "moon and star"
selfAssessment: null
published: true
---
## TL;DR

`<head>` タグ内にインラインでダークモードか判定するスクリプトを記述するようにしましょう。

```html:index.html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <script>
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }

      localStorage.theme = 'light'

      localStorage.theme = 'dark'

      localStorage.removeItem('theme')
    </script>
```

## 一瞬ライトモードで表示されてしまう現象

一瞬ライトモードで表示されてしまう現象とは、以下のような状態です。

![light-display](//images.ctfassets.net/in6v9lxmm5c8/5Hk1j0oQOkgBXAQPirjxkk/988588a27a13d59c60706d8fc7b946e5/light-display.gif)

原因としては、スクリプトでダークモードの判定を行うより先に初回レンダリングが実行されてしまうためです。これはダークモードの判定を行うスクリプトを `useEffect` や `onMount` のようなフック内で記述していると起こります。

```html:+layout.svelte
<script lang="ts">
  onMount(() => {
    const html = document.documentElement
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      darkMode = true
      html.classList.add('dark')
    } else {
      darkMode = false
      html.classList.remove('dark')
    }
  })
</script>
````

ダークモードかどうかの判定は基本的にユーザーの OS の設定や LocalStorage に保存してある値を利用するので、ユーザーごとに異なります。そのため、ダークモードでプレレンダリングしておくなどの手段を取ることができません。

## 解決方法

単純な解決方法としては、最初のレンダリングが開始されるより前にスクリプトでダークモードの判定が終わっていればよいわけです。`<script>` タグは通常上から順番に読み込まれ実行されるため、`<body>` タグより前にスクリプトが存在すれば大丈夫です。スクリプトの完了を待つ必要があるので、このとき `defer` や `async` 属性をつけることはできません。

例えば SvelteKit の場合には `<svelte:head>` 要素を使うことで `<head>` タグ内の記述が可能であるので、これを使うと良いでしょう。

```html:+layout.svelte
<svelte:head>
  <script>
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  </script>
</svelte:head>
```
