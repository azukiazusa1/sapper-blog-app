---
id: BC6OoivwIVxijGdhJVcyE
title: "Tailwind CSS のダークモードで System, Light, Dark を切り替える"
slug: "tailwind-css-dark-mode-system-light-dark"
about: "ダークモードの設定では、OS の設定と同期させるか、ライトモードまたはダークモードに手動で切り替えるかの 3 つの選択肢が用意されていることがあります。手動でライトモードとダークモードを切り替える場合に比べて、OS の設定を自動で反映できるメリットがあります。"
createdAt: "2023-04-16T10:49+09:00"
updatedAt: "2023-04-16T10:49+09:00"
tags: ["tailwindcss", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/EUS3y9frdMdKA1y2rKDOx/e9502a9256e63fd899d6bdeb849589f6/_Pngtree_halo_moon_5336581.png"
  title: "—Pngtree—halo moon_5336581.png"
published: true
---
ダークモードを設定できるサイトやアプリケーションでは、大きくわけて 3 つの方法が考えられます。

- OS の設定に合わせてダークモードに切り替える
- ユーザーが手動でライトモードまたはダークモードに切り替える
- ユーザーが手動でライトモード、ダークモード、OS の設定に合わせるかを切り替える

OS の設定に合わせてダークモードに切り替える場合には、`prefers-color-scheme` という CSS メディアクエリを使用します。このメディアクエリは、ユーザーの OS の設定がダークモードになっている場合にのみスタイルが適用されます。ユーザーが明示的に設定を切り替えられない不便さはありますが、実装が簡単です。

ユーザーが手動でライトモードまたはダークモードに切り替える場合には、大抵の場合トグルボタンやスイッチの ON/OFF で切り替えられるようになっています。

![Vue の公式サイトのヘッダーのスクリーンショット。ダークモードを切り替えるスイッチが ON になっている。](https://images.ctfassets.net/in6v9lxmm5c8/j0amyv8MN01Q3sQBb8pwJ/1433c15a37ff700b6c6d385ee9183a3e/__________2023-04-16_11.09.26.png)

この場合には、初期設定では OS の設定に合わせてダークモードに切り替えるようにしておき、ユーザーが手動で切り替えた場合には LocalStorage などに保存しておき、次回からはその設定を読み込むようにします。

ダークモードの設定では、OS の設定と同期させるか、ライトモードまたはダークモードに手動で切り替えるかの 3 つの選択肢が用意されていることがあります。例えば、[Tailwind CSS の公式サイト](https://tailwindcss.com/)では、`System` と `Light` と `Dark` の 3 つを切り替えることができます。

![Tailwind CSS の公式サイトのヘッダーのスクリーンショット。Light, Dark, System のドロップダウンメニューが表示されていて、System が選択されている。](https://images.ctfassets.net/in6v9lxmm5c8/4cktg9VGoZN7mXgeSZAVil/eca4cfb254f16f64d710466687be0179/__________2023-04-16_10.54.50.png)

手動でライトモードとダークモードを切り替える場合に比べて、`System` はどのようなメリットが有るのでしょうか？それは OS の設定を変更した時に自動で反映してくれることにあるでしょう。

例えば、Mac OS のダークモードの設定では時間帯によって自動で切り替わるように設定できます。このような場合には、ユーザーが手動でライトモードとダークモードを切り替えるよりも、OS の設定に合わせて自動で切り替わる方が便利です。

それでは、Tailwind CSS のダークモードで `System` と `Light` と `Dark` の 3 値を切り替える方法を見ていきましょう。

## Tailwind CSS の設定

Tailwind CSS でタークモードはデフォルトでは OS の設定に合わせて切り替わるようになっています。今回は手動でライトモードとダークモードを切り替えるように設定を変更していきます。その場合には `class` ストラテジーを使用することになります。`class` ストラテジーでは HTML の祖先に `dark` クラスが付与されている場合にのみダークモードのスタイルが適用されます。

`class` ストラテジーを使用する場合には `tailwind.config.js` の `darkMode` に `class` を指定します。

```js:tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  // ...
}
```

## ダークモードの初期設定

`class` ストラテジーを使用する場合には、ページが読み込まれた際にダークモードで表示するかどうかを決定して、`dark` クラスを付与する必要があります。`dark` クラスは HTML のルート要素である `<html>` に付与することになるでしょう。

ダークモードで表示するかの決定は、以下のプロセスによって行われます。

1. LocalStorage に `theme` が保存されていないまたは、`theme` が `system` の場合 OS の設定に合わせてダークモードで表示するかどうかを決定する
2. LocalStorage に `theme` が保存されていて、`theme` が `dark` の場合はダークモードで表示す
3. それ以外の場合にはライトモードで表示する

```js
// LocalStorage に theme が保存されていない or theme が system の場合
if (!('theme' in localStorage) || localStorage.theme === 'system') {
  // OS の設定を読み取る
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // OS の設定がダークモードの場合、<html> に dark クラスを付与する
    document.documentElement.classList.add('dark')
  }
  // LocalStorage に設定を保存する
  localStorage.setItem('theme', 'system')
} else if (localStorage.theme === 'dark') {　// LocalStorage に theme が保存されていて、theme が dark の場合
  document.documentElement.classList.add('dark')
} else { // それ以外の場合
  document.documentElement.classList.remove('dark')
}
```

!> このスクリプトは CSS が読み込まれる前に実行される必要があります。さもなければ、ダークモードで表示する前に一瞬ライトモードで表示されてちらつく感じがします。一般的な React のアプリケーションでは `index.html` の `<head>` タグ内の `<style>` タグの前に `<script>` タグを配置することで、CSS が読み込まれる前に実行されるようになります。

OS のダークモードの設定を読み取るには [window.matchMedia](https://developer.mozilla.org/ja/docs/Web/API/Window/matchMedia) を使用します。`window.matchMedia` は[メディアクエリー](https://developer.mozilla.org/ja/docs/Web/CSS/Media_Queries)を引数に受け取り、[MediaQueryList](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList) オブジェクトを返します。

`MediaQueryList` オブジェクトは `matches` プロパティを持っており、メディアクエリに合致するかどうかを表す `boolean` 値を返します。また、`change` イベントを監視することにより、メディアクエリの状態が変化した際にコールバック関数を実行できます。

`window.matchMedia("(prefers-color-scheme: dark)").matches` が `true` を返す場合には OS の設定がダークモードであることを意味します。

## OS の設定が変更された際に自動で反映する

ダークモードの設定として `System` が選択されている場合には、OS の設定が変更された際に自動でダークモードの設定が反映される必要があるでしょう。これは前述した `MediaQueryList` オブジェクトの `change` イベントを監視することにより実現できます。

`window.matchMedia('(prefers-color-scheme: dark)')` が返す値に `add.addEventListener('change', callback)` を呼び出すことで、OS の設定が変更された際に `callback` 関数が実行されるようになります。

```js
// OS の設定が変更された際に実行されるコールバック関数
const mediaQueryLlistener = (e: MediaQueryListEvent) => {
  if (localStorage.theme === 'system') {
    if (e.matches) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', mediaQueryLlistener)
```

コールバック関数内では LocalStorage の値が `System` の場合のみ処理を実行します。明示的にライトモード、ダークモードを選択している場合には、OS の設定が変更されても反映されないようにするためです。

コールバック関数は引数で [MediaQueryListEvent](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryListEvent) を受け取ります。`MediaQueryListEvent` オブジェクトは `matches` プロパティを持っており、メディアクエリに合致するかどうかを表す `boolean` 値を返します。

この値が `true` の場合には OS の設定がダークモードに変更されたことを意味しますから、`<html>` に `dark` クラスを付与します。`false` の場合には反対に `<html>` から `dark` クラスを削除します。

これで、実際に OS の設定を変更するたびにダークモードの設定が自動で反映されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7MNVciSgkaZG22hprBk8YC/dd7024cb1bfe2ee3d2015ddeb14720dd/os-dark-mode.gif)

## ダークモードの切り替え

ダークモードの切り替えは LocalStorage の `theme` の値をの変更と `<html>` タグの `dark` クラスのトグルで実現できます。`System`、`Light`、`Dark` の 3 値を選択して変更しますから、セレクトボックスで切り替えることが考えられます。

React で実装すると、以下のような例になるでしょう。

```tsx
type Theme = 'system' | 'light' | 'dark'

const ThemeSwitcher: React.FC = () => {
  // LocalStorage に保存されている値を初期値として設定する
  const [theme, setTheme] = useState<Theme>(localStorage.theme || 'system')

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as Theme
    setTheme(value)
    localStorage.setItem('theme', value)
    if (value === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (value === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // System が選択された場合は OS の設定を見て切り替える
      document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  }

  return (
    <select value={theme} onChange={handleChange}>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  )
}
```
