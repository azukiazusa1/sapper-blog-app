---
id: GCXvRY4r88HMmmz-Xiv5c
title: "静的サイト向けの全文検索エンジンと UI ライブラリの Pagefind"
slug: "static-site-search-engine-and-ui-library-pagefind"
about: "Pagefind は、静的サイト向けの全文検索エンジンと UI ライブラリです。特定のフレームワークに依存しない JavaScript ライブラリとして実装されており、静的サイトジェネレーターで生成された HTML ファイルに対して検索機能を追加できます。"
createdAt: "2024-01-06T15:52+09:00"
updatedAt: "2024-01-06T15:52+09:00"
tags: ["pagefind"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3jSAV3r6jEDp1IvVRFkKIA/99534568163376f6f7e1d27f60173fa8/wine-sommelier_man_18186.png"
  title: "ワインソムリエのイラスト"
published: true
---
Pagefind は、静的サイト向けの全文検索エンジンと UI ライブラリです。Cloud CMS を提供している [CloudCannon](https://cloudcannon.com/) 社により開発されています。

特定のフレームワークに依存しない JavaScript ライブラリとして実装されており、静的サイトジェネレーターで生成された HTML ファイルに対して検索機能を追加できます。追加するコードの量も少なく、簡単に検索機能を実装できます。

https://pagefind.app/

デモとして、このブログに Pagefind を導入してみました。ヘッダーの検索アイコンをクリックすると検索フォームが表示されるので、キーワードを入力して検索してみてください。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4UNoo8hgwIKvcozD7Kal84/251928a5640966e63679b6487b8f6aa6/_____2024-01-06_15.59.18.mov" controls></video>

## 使い方

Pagefind は構築済みの UI ライブラリと、CLI コマンドとしてインデックスを作成するためのツールから構成されています。まずは UI ライブラリの部分から見てみましょう。

### UI ライブラリ

Pagefind の UI ライブラリは、検索フォームと検索結果を表示するためのコンポーネントから構成されています。この UI は以下のコードを追加するだけで簡単に利用できます。

```html
<link href="/pagefind/pagefind-ui.css" rel="stylesheet" />
<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
  window.addEventListener("DOMContentLoaded", (event) => {
    new PagefindUI({ element: "#search" });
  });
</script>
```

`/pagefind/pagefind-ui.css` と `/pagefind/pagefind-ui.js` は、後述する Pagefind の CLI コマンドでインデックスを生成する際に生成されるファイルです。js ファイルを読み込むことで `PagefindUI` クラスがグローバルに定義され、`PagefindUI` クラスのコンストラクタにオプションを渡すことで UI を初期化できます。

<details>
<summary>SvelteKit で js, css ファイルを読み込む</summary>

SvelteKit ではスタティックサイトジェネレーターとしてビルドする際に、すべてのリンクをクローリングして HTML ファイルを生成します。このとき、リンクに存在しないパスが含まれているとビルドに失敗します。

`/pagefind/pagefind-ui.css` と `/pagefind/pagefind-ui.js` は SvelteKit によるビルド後にのみ存在するファイルですので、このファイルを読み込むように記述しているとビルドに失敗してしまいます。

特定のパスの読み込みに失敗してもビルドを継続するには、`svelte.config.js` の `kit.prerender.handleHttpError` オプションにコールバック関数を指定します。

```js:svelte.config.js
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    prerender: {
      handleHttpError: ({ path, referrer, message }) => {
        // ignore deliberate link to shiny 404 page
        if (
          path === "/pagefind/pagefind-ui.css" ||
          path === "/pagefind/pagefind-ui.js"
        ) {
          return;
        }

        // otherwise fail the build
        throw new Error(message);
      },
    },
  },
};

export default config;
```

</details>

コンスタントに渡すオプションは `element` のみが必須です。`element` には検索フォームを表示するための要素をセレクタで指定します。

その他のオプションは以下のリンクを参照してください。

https://pagefind.app/docs/ui/

### インデックスの作成

インデックスの作成は Next.js, Gatsby, Astro, SvelteKit などの静的サイトジェネレーターのビルドの後に実行されます。Pagefind は生成された HTML ファイルを読み込み、その中から検索対象として指定された要素を抽出しインデックスを作成します。

サイトのインデックスを作成するには `npx pagefind` コマンドを実行します。`--site` オプションには静的サイトジェネレーターが出力したディレクトリを指定します。例として SvelteKit + Vercel Adapter を使ってビルドした場合には `.vercel/output/static` となります。

```sh
npx pagefind --site <output directory>
```

コマンドに成功すると `--site` で指定したディレクトリ配下に `pagefind` ディレクトリが作成されます。

## インデックス作成の対象の制御

Pagefind は HTML 属性を用いてインデックスの作成の対象を制御するのが特徴です。デフォルトでは `<body>` 要素の中にあるすべての要素がインデックスの対象となります。

### インデックス対象の指定

`data-pagefind-body` 属性を指定することで、その要素の中にある要素のみがインデックスの対象となります。

```html
<body>
  <main data-pagefind-body>
    <h1>Pagefind</h1>
    <p>Pagefind is a static site search engine and UI library.</p>
  </main>

  <aside>
    <!-- ここはインデックスの対象とならない -->
    <p>Author: Azusa Azuki</p>
  </aside>
</body>
```

`data-pagefind-body` 属性が指定された場合には、そのページに限らずその他のすべてのページで `data-pagefind-body` が指定されていない箇所がインデックスの対象から除外されることに注意してください。インデックスの対象としたいページ全てに対して `data-pagefind-body` 属性を指定する必要があります。

### インデックス対象から除外する要素の指定

`data-pagefind-body` 要素の中にある要素のうち、インデックスの対象から除外したい要素がある場合には、`data-pagefind-ignore` 属性を指定します。

```html
<main data-pagefind-body>
  <h1>Pagefind</h1>
  <p>Pagefind is a static site search engine and UI library.</p>
  <p data-pagefind-ignore>
    Pagefind is a static site search engine and UI library.
  </p>
</main>
```

HTML の特定の属性をインデックスの対象としたい場合には、`data-pagefind-index-attrs` 属性を指定して、値にインデックスの対象としたい属性をカンマ区切りで指定します。例えば、下記の例では画像の `alt` 属性の内容をインデックスの対象としています。

```html
<main data-pagefind-body>
  <h1>
    <img src="/pagefind.png" alt="Pagefind" data-pagefind-index-attrs="alt" />
  </h1>
</main>
```

### CLI コマンドでのインデックスの対象の制御

HTML 属性を指定する方法以外にも、CLI コマンドでインデックスを生成する際に [--glob](https://pagefind.app/docs/config-options/#glob) オプションを指定することで、インデックスの対象とするファイルを正規表現で指定することもできます。

```sh
npx pagefind --site <output directory> --glob "**/blog/*.html"
```

## メタデータの指定

`data-pagefind-meta` HTML 属性を指定することで、検索結果とともに表示されるメタデータを指定できます。デフォルトでは、以下のメタデータを各ページから自動で抽出します。

- `title`：ページに最初にある `<h1>` 要素の内容
- `image`：`<h1>` 要素の直後にある最初の `<img>` 要素の `src` 属性の値
- `image_alt`：`<h1>` 要素の直後にある最初の `<img>` 要素の `alt` 属性の値

例えば、特定の画像要素を常に検索結果として表示したい場合には、`data-pagefind-meta="image[src], image_alt[alt]"` 属性を指定します。

```html
<img
  src="/hero.png"
  alt="Pagefind"
  data-pagefind-meta="image[src], image_alt[alt]"
/>
```

なお、`data-pagefind-meta` 属性は `data-pagefind-body` 属性が指定された要素外の要素に対しても指定できます。

### カスタムメタデータ

`data-pagefind-meta` 属性の値に `key:value` の形式で指定することで、カスタムメタデータを指定できます。例えば、以下のように `date:2021-02-13T00:00:00.000+09:00` という値を指定することで、`date` というキーのメタデータを作成できます。

```html
<main data-pagefind-body>
  <h1>Pagefind</h1>
  <p>Pagefind is a static site search engine and UI library.</p>
  <time data-pagefind-meta="date:2021-02-13T00:00:00.000+09:00"
    >2021/02/13</time
  >
</main>
```

デフォルトで生成される `title`, `image`, `image_alt` 以外のメタデータのペアは、UI 上では検索結果の下に表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/57QEiYjDVssfW7VDrsF40G/3f93111efcd745d7440c5d92876d6ad4/__________2024-01-06_17.04.49.png)

## UI のカスタマイズ

`new PagefindUI()` で初期化される UI はデフォルトでは `/pagefind/pagefind-ui.css` のスタイルが適用されます。この CSS を読み込まずに、クラス名を指定して独自のスタイルを適用できます。しかし、このクラス名は将来変更される可能性があり安定しないため推奨されていません。

Pagefind のデフォルトの UI をカスタマイズするには、CSS 変数を上書きします。デフォルトでは以下の CSS 変数が定義されています。

```css
:root {
  --pagefind-ui-scale: 0.8;
  --pagefind-ui-primary: #393939;
  --pagefind-ui-text: #393939;
  --pagefind-ui-background: #ffffff;
  --pagefind-ui-border: #eeeeee;
  --pagefind-ui-tag: #eeeeee;
  --pagefind-ui-border-width: 2px;
  --pagefind-ui-border-radius: 8px;
  --pagefind-ui-image-border-radius: 8px;
  --pagefind-ui-image-box-ratio: 3 / 2;
  --pagefind-ui-font: system, -apple-system, "BlinkMacSystemFont", ".SFNSText-Regular",
    "San Francisco", "Roboto", "Segoe UI", "Helvetica Neue", "Lucida Grande", "Ubuntu",
    "arial", sans-serif;
}
```

例えば、`--pagefind-ui-primary` を `#e60000` に変更すると、検索フォームのアイコンの色が赤色に変更されます。

```css
:root {
  --pagefind-ui-primary: #e60000;
}
```

## ラベルテキストの変更

Pagefind の UI のラベルに表示されるラベルテキストの言語は、html の `lang` 属性の値によって自動で切り替わります。例えば、`lang="ja"` が指定されている場合には、ラベルテキストは日本語になります。

日本語のデフォルトのラベルテキストは、以下のように定義されています。

```json
{
  "thanks_to": "Tate",
  "comments": "",
  "direction": "ltr",
  "strings": {
    "placeholder": "検索",
    "clear_search": "消す",
    "load_more": "もっと読み込む",
    "search_label": "このサイトを検索",
    "filters_label": "フィルタ",
    "zero_results": "[SEARCH_TERM]の検索に一致する件はありませんでした",
    "many_results": "[SEARCH_TERM]の[COUNT]件の検索結果",
    "one_result": "[SEARCH_TERM]の[COUNT]件の検索結果",
    "alt_search": "[SEARCH_TERM]の検索に一致する件はありませんでした。[DIFFERENT_TERM]の検索結果を表示しています",
    "search_suggestion": "[SEARCH_TERM]の検索に一致する件はありませんでした。次のいずれかの検索を試してください",
    "searching": "[SEARCH_TERM]を検索しています"
  }
}
```

https://github.com/CloudCannon/pagefind/blob/main/pagefind_ui/translations/ja.json

このテキストの内容を変更したい場合には、`new PagefindUI()` で初期化される UI のオプションに `translations` を指定します。`translations` には上記の JSON をオブジェクトとして指定します。例として `placeholder` のテキストを変更する場合には以下のように指定します。

```js
new PagefindUI({
  element: "#search",
  translations: {
    strings: {
      placeholder: "サイト内を検索",
    },
  },
});
```

## まとめ

- Pagefind は静的サイト向けの全文検索エンジンと UI ライブラリ
- 静的サイトジェネレーターのビルド後に CLI コマンドでインデックスを作成する
- Pagefind のデフォルトの UI が提供されていて、簡単に検索機能を実装できる
- HTML の属性を使ってインデックスの作成の対象を制御したり、メタデータを指定できる
- Pagefind の UI は CSS 変数を上書きすることでカスタマイズできる

## 参考

- [Pagefind](https://pagefind.app/)
- [静的サイトに特化した検索ライブラリ Pagefind を試す | grip on minds](https://griponminds.jp/blog/try-pagefind/)
