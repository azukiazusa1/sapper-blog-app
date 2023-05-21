---
id: 6pvamyeWFI9DyyCJsMeWA
title: "list-style: none スタイルを指定した ul 要素には list ロールを指定すべき"
slug: "list-style:-none-styled-ul-element-should-have-a-list-role"
about: WAI-ARIA における role 属性を使用する際のプラクティスとして、暗黙のロールを明示しないというものがあります。しかし、`<ul>` 要素は暗黙のロールとして `list` ロールを持っていますが、明示的に `list` ロールを宣言するべきです。
createdAt: "2023-05-21T14:13+09:00"
updatedAt: "2023-05-21T14:13+09:00"
tags: ["アクセシビリティ", "WAI-ARIA", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7unyOllrNTdGl3x37kAQBc/b6e01150e83eb40a69eae4a1604249cd/nekocatPAR584702405_TP_V4.jpg"
  title: "パソコンの前で寝てる猫"
published: true
---

WAI-ARIA における role 属性を使用する際のプラクティスとして、**暗黙のロールを明示しない**というものがあります。暗黙のロールとは、HTML の各要素に暗黙的に（明示せずとも）規定されているロールのことです。HTML の各要素には何かしらの WAI-ARIA で規定されたロールが対応しています。例えば、`<button>` 要素なら `button` ロール、`<nav>` 要素なら `navigation` ロールといった感じです。

暗黙的に持っているロールをあえて `role` 属性で明示することは、冗長なので避けるべきだとされています。

```html
<!-- bad -->
<button role="button">ボタン</button>

<!-- good -->
<button>ボタン</button>
```

!> ただし、古いスクリーンリーダーをサポートする目的で暗黙のロールを明示することもあります。HTML と ARIA のマッピングが対応していないことがあるためです。

## `<ul>` 要素の例外

しかし、上記のプラクティスにも例外が存在します。`<ul>` 要素は暗黙のロールとして `list` ロールを持っていますが、明示的に `list` ロールを宣言するべきです。

```html
<!-- bad -->
<ul>
  <li>りんご</li>
  <li>みかん</li>
  <li>バナナ</li>
</ul>

<!-- good -->
<ul role="list">
  <li>りんご</li>
  <li>みかん</li>
  <li>バナナ</li>
</ul>
```

理由は、Safari のみ `list-style: none` スタイルを指定した `<ul>` 要素には `list` ロールが自動的に付与されないためです。このため、`list-style: none` スタイルを指定した `<ul>` 要素には `list` ロールを明示的に指定する必要があります。一般的に、HTML の要素だけを見ても特定のスタイルが適用されているかどうかは判断が難しいので、現在 `list-style: none` スタイルが適用されているかに関わらず、`list` ロールを明示的に指定することを推奨します。

## VoiceOver でのテスト

実際に VoiceOver を使用して、`list-style: none` スタイルを指定した `<ul>` 要素には `list` ロールが自動的に付与されないことを確認してみます。

```html
<style>
  ul {
    list-style: none;
  }
</style>

<ul>
  <li>りんご</li>
  <li>みかん</li>
  <li>バナナ</li>
</ul>
```

まずは Google Chrome で `list-style: none` スタイルを指定した `<ul>` 要素を開きます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6YR2Ixw89uJV5fdeoKv8tX/9ce175d300368f773ae61233420e0068/_____________2023-05-21_14.41.47.mov" controls></video>

「リスト 3 項目」と読み上げられた後、次の要素に移動すると「りんご 1/3」「みかん 2/3」「バナナ 3/3」とリストのアイテムとして認識されていることがわかります。

続いて、Safari で `list-style: none` スタイルを指定した `<ul>` 要素を開きます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1akbryd5stkT6udtbCpJH2/dcbb546fa65a425e1e539be3be653ff2/_____________2023-05-21_14.47.06.mov" controls></video>

りんご、みかんの要素に移動しても単に文字列が読み上げられるだけで、リストのセマンティクスが失われていることが確認できました。

`<ul>` 要素に `role="list"` を指定すると、Safari でもリストのセマンティクスが保たれることが確認できます。

```html
<style>
  ul {
    list-style: none;
  }
</style>

<ul role="list">
  <li>りんご</li>
  <li>みかん</li>
  <li>バナナ</li>
</ul>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7qOf2ExJrUcjuLGkKo48hd/02bfab454e4e9799ff2b103fc3d44ac4/_____________2023-05-21_14.51.52.mov" controls></video>

## Safari における list-style: none の 例外の例外

Safari において、`list-style: none` スタイルを指定した `<ul>` 要素には `list` ロールが削除されるルールについて例外が存在します。`list-style: none` スタイルが適用されていたとしても、`<ul>` 要素が特定の要素のコンテキストに存在する場合、`list` ロールが適用されます。

例えば、`<ul>` 要素が `<nav>` 要素の子要素である場合、`list` ロールが適用されます。

```html
<style>
  ul {
    list-style: none;
  }
</style>

<nav>
  <ul>
    <li>りんご</li>
    <li>みかん</li>
    <li>バナナ</li>
  </ul>
</nav>
```

## まとめ

- 一般的には暗黙のロールを明示するべきではない
- しかし、`<ul>` 要素には `list` ロールを明示するべき
  - Safari において、`list-style: none` スタイルを指定した `<ul>` 要素には `list` ロールが自動的に付与されないため
- ただし、`<ul>` 要素が `<nav>` 要素の子要素である場合は例外的に `list-style: none` スタイルが適用されていても `list` ロールが暗黙的に付与される

## 参考

- [list-style - アクセシビリティの考慮](https://developer.mozilla.org/ja/docs/Web/CSS/list-style#%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B7%E3%83%93%E3%83%AA%E3%83%86%E3%82%A3%E3%81%AE%E8%80%83%E6%85%AE)
- ["Fixing" Lists](https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html)
- [WAI-ARIAを学ぶときに整理しておきたいこと](https://zenn.dev/yusukehirao/articles/e3512a58df58fd)