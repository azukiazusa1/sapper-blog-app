---
id: KLioddk5WiDLhjbHfeDQG
title: "HTML の仕様に search 要素が追加された"
slug: "the-search-element-has-been-added-to-the-html-specification"
about: "HTML Standardに新しい`<search>`要素が追加された。これまで、ARIAには`<search>`に相当するHTML要素がなかったため、`<div role=\"search\">`しか代替要素がなかった。新たに`<search>`要素を使用することにより、WAI-ARIA を使用せずともsearchランドマークを定義できるようになった。通常、`<search>`要素は少なくとも1つの入力要素を含んでおり、検索を開始するためのボタンもあることが期待されている。"
createdAt: "2023-03-26T16:50+09:00"
updatedAt: "2023-03-26T16:50+09:00"
tags: ["HTML", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3H5gmDVlhQ8VEceFMR6yWo/d016979782ffed746f6b831e00c7d92a/_Pngtree_find_vector_icon_3725277.png"
  title: "search"
published: false
---
2023 年 3 月 24 日に [HTML Standard](https://html.spec.whatwg.org/multipage/) に `<search>` 要素が追加されました。
`
?> この記事が公開された時点（2023 年 3 月 26 日）で、ブラウザの実装はまだ完了していません。現在の実装状況は [Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/?search=%3Csearch%3E) を参照してください。

## 背景

`<search>` 要素は [ARIA ランドマークロール](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role) の [search ロール](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/search_role) に対応する要素です。つまり、`<search>` は `<div role="search">` を代替する要素となります。

ARIA は 8 つのランドマークロールを定義していますが、唯一 `search` ロールのみ対応する HTML 要素が存在しないという状況でした。`<search>` 要素の追加により、この状況が改善されます。

| ARIA ランドマークロール | 対応する HTML 要素 |
| ---------------------- | ------------------ |
| banner                 | `<header>`         |
| complementary           | `<aside>`          |
| contentinfo            | `<footer>`         |
| form                   | `<form>`           |
| main                   | `<main>`           |
| navigation             | `<nav>`            |
| region                 | `<section>`        |
| search                 | `<search>`         |


## 使い方

`<search>` 要素は暗黙のロールとして `search` ロールを持ちます。ブラウザのアクセシビリティ API により search ランドマークが公開され、スクリーンリーダーなどの支援技術を使用するユーザーが素早く検索フォームに移動できるようになります。

`<header>` 要素や `<footer>` 要素と同じく、なにか特別な機能を持ってはいません。単にランドマークとしての役割を果たすだけの要素です。

以下は `search` ロールを使用した例です。VoiceOver ローターを起動してランドマークを選択するとバナー、検索、本文、フッターが表示されています。ここで検索を選択すると検索フォームに移動できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3iPE1C2Ioa5TsyXWdDIfmS/9247e3430c6bde847cf988536dde81f6/__________2023-03-26_17.20.02.png)

通常、`<search>` 要素は少なくとも 1 つの入力要素を含んでいるはずです。また必須ではないものの、検索を開始するためのボタンも存在することが期待されています。

`<search>` 要素を使用した例として、以下のような検索フォームを作成できます。

```html
<search>
  <form>
    <label for="search">サイト内検索</label>
    <input type="search" id="search" name="search" />
    <button type="submit">検索</button>
  </form>
</search>
```

`<form role="search">` のように `role="search"` を使用しても同じ結果が得られます。ですが、「必要なセマンティクスと動作がすでに組み込まれたネイティブの HTML 要素や属性を使用できる場合は、ネイティブのものを使用する」という WAI-ARIA のルールに従って `<search>` 要素を使用することを推奨しています。

> If you can use a native HTML element [HTML51] or attribute with the semantics and behavior you require already built in, instead of re-purposing an element and adding an ARIA role, state or property to make it accessible, then do so.

https://www.w3.org/TR/using-aria/#rule1

## 仕様

| 項目 | 説明 |
| ------ | ---- |
| コンテンツカテゴリー | フローコンテンツ、知覚可能コンテンツ |
| 許可されている内容 | フローコンテンツ |
| タグの省略 | 不可 |
| 許可されている親要素 | フローコンテンツが許可されている要素 |
| コンテンツ属性 | グローバル属性 |
| 暗黙の ARIA ロール | search |
| 許可されている ARIA ロール | form, group, none, presentation, region。search の許可されているが推奨されない。[^1] |
| DOM インターフェイス | HTMLElement |

[^1]: 暗黙で持つロールを明示的に指定することは推奨されていない。ただし、2023 年 3 月 26 日時点では、ブラウザやスクリーンリーダーに対応していないため、逆に `role="search"` を指定するべき。

## 参考

- [HTML Standard](https://html.spec.whatwg.org/multipage/grouping-content.html#the-search-element)
- [ARIA in HTML](https://w3c.github.io/html-aria/#el-search)
- [Consider creating an HTML search element · Issue #5811 · whatwg/html](https://github.com/whatwg/html/issues/5811)
- [The search element | scottohara.me](https://www.scottohara.me/blog/2023/03/24/search-element.html)
- [ゆうてん🖖 on Twitter: "&lt;search&gt;要素、来ましたね。後で詳細調べよう。" / Twitter](https://twitter.com/cloud10designs/status/1639084339303677953)
