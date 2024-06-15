---
id: 0jLl4eVZ34noi4ravGpDw
title: "SVG アイコンの表示に mask-image CSS プロパティを使用する"
slug: "use-mask-image-css-property-to-display-svg-icons"
about: "mask-image プロパティは CSS でマスキングを行うためのプロパティであり、SVG アイコンを表示する際に有用です。mask-image プロパティを使用することで、外部の SVG ファイルを読み込みつつ、アイコンの色を CSS で指定することが可能になります。"
createdAt: "2024-06-15T15:35+09:00"
updatedAt: "2024-06-15T15:35+09:00"
tags: [CSS]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6NdEsvayuQPax4e0d0BZmX/8774448df77f80818d57427f517f7a47/fruit_cat-melon_illust_4532-768x603.png"
  title: "マスクメロンのイラスト"
selfAssessment:
  quizzes:
    - question: "SVG 画像を表示する際に img 要素を使う際のデメリットとして正しいものはどれか？"
      answers:
        - text: "アイコンの色を変更することが難しい"
          correct: true
          explanation: "img 要素を使う場合、CSS でアイコンの色を変更することができないため、アイコンの色を変更する場合には別の画像を用意する必要があります。"
        - text: "HTML ファイルのサイズが肥大化する"
          correct: false
          explanation: "インライン SVG を使用する場合のデメリットです。"
        - text: "アイコンの管理が煩雑になる"
          correct: false
          explanation: "外部ファイルとして　SVG を読み込む場合には、ディレクトリ構造で管理が可能であるため煩雑になるとはいいにくいでしょう。"
    - question: "mask-repeat プロパティのデフォルト値はどれか？"
      answers:
        - text: "no-repeat"
          correct: false
          explanation: ""
        - text: "repeat"
          correct: true
          explanation: ""
        - text: "repeat-x"
          correct: false
          explanation: ""
        - text: "repeat-y"
          correct: false
          explanation: ""
published: true
---

HTML でロゴやアイコンを表示する時、SVG はよく使われるフォーマットです。SVG はベクター形式で記述されるため、拡大・縮小しても画質が劣化しないという特徴があります。SVG を HTML で表示する場合、以下のような方法が使われていました。

- `<img>` 要素の `src` 属性に SVG ファイルのパスを指定する
- `<svg>` 要素を直接記述する
- svg スプライトを使用する

それぞれの方法にはメリット・デメリットが存在します。`<img>` 要素を使用する場合には単に画像として扱われるため、アイコンの色を変えたりなどのスタイルが難しく、また JavaScript による操作も制限されます。

`<svg>` 要素を直接記述する場合には、`fill=currentColor` 属性を指定することで CSS により色を変更できたり、JavaScript による操作も可能ですが、アイコンが多くなるにつれて HTML のファイルサイズが肥大化する問題があります。また HTML に直接記述するため HTML が複雑になりがちです。

svg スプライトは 1 つの SVG ファイルに複数のアイコンを記述し、`<use>` 要素で参照する方法です。必要なアイコンは 1 箇所にまとめられるため、HTML ファイルの煩雑化を防ぎつつ、アイコンの色変更など SVG 自体が持つ恩恵を享受できることがメリットです。SVG スプライトを作成するためのビルドプロセスが複雑になることがデメリットです。

## mask-image プロパティを使って SVG アイコンを表示する

2023 年にすべてのモダンブラウザでサポートされるようになった[^1]`mask-image` プロパティは新しく　SVG アイコンを表示するための方法として注目されています。`mask-image` プロパティ CSS でマスキング（マスキングは要素の一部を消去せずに非表示にする仕組み）を行うためのプロパティの 1 つです。`mask-image` プロパティはマスクレイヤーとして使用される画像を指定します。

```html
<button aria-label="star">
  <div class="icon"></div>
</button>

<style>
  .icon {
    width: 24px;
    height: 24px;
    mask-image: url("./star.svg");
    background-color: aqua;
  }
</style>
```

上記の例では、`mask-image` プロパティに `url("./star.svg")` で外部の SVG ファイルを指定しています。アイコンの色を指定するために `background-color` プロパティを使用しています。以下のようにアイコンが表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5HpQcvih8OLPFUG6cmHGRi/7ac25876d87da64fb8a49243fa88dc4a/__________2024-06-15_16.27.11.png)

`mask-image` プロパティを使用することで、外部ファイルの SVG アイコンを読み込みつつ、アイコンの色を CSS で指定するということが可能になります。これは `<img>` 要素で読み込む方法とインライン SVG を使用する方法のメリットを組み合わせたような手法と言えるでしょう。

以下のように、ボタンにホバーした時にアイコンの色が変わるようにすることも可能です。

```css
button {
  &:hover,
  &:focus {
    .icon {
      background-color: pink;
    }
  }
}

.icon {
  width: 24px;
  height: 24px;
  mask-image: url("./star.svg");
  background-color: aqua;
  transition: background-color 0.3s;
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/YAJQuyMUeFgIFMC1Fixd3/af4e69542f55ba795c00dd10a13e1431/_____2024-06-15_16.37.22.mov" controls></video>

CSS マスキングに関するプロパティは他にも以下のようなものがあります。

- `mask-position`：マスク画像の位置を指定する
- `mask-repeat`：マスク画像の繰り返し方法を指定する。デフォルトでは `repeat`
- `mask-size`：マスク画像のサイズを指定する
- `mask-clip`：マスク画像が影響される領域を指定する。デフォルトは `border-box`
- `mask-composite`：マスク画像の合成方法を指定する。デフォルトは `add` で現在のマスクレイヤーがそのため、の下にあるマスクレイヤーの上に配置される
- `mask-mode`：マスク画像をアルファもしくは輝度のどちらで扱うかを設定する。デフォルトは `alpha`
- `mask-origin`：マスク画像の原点を指定する。デフォルトは `border-box`

`mask-image` プロパティの値として外部ファイルを指定する代わりに、`<svg>` 要素を直接記述することもできます。

```css
.icon {
  width: 24px;
  height: 24px;
  mask-image: url("data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg">...</svg>");
  background-color: aqua;
}
```

`background` に `linear-gradient` を指定することでグラデーションのアニメーションを適用することも可能です。

```css
.icon {
  width: 24px;
  height: 24px;
  mask-image: url("./star.svg");
  background: linear-gradient(90deg, #2dd4bf, #3b82f6);
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5K9FPLrndJhAfWvsTT0arS/2e76cc8f7db81c135dbdbb4e5f4271c6/__________2024-06-15_16.44.13.png)

## まとめ

- 従来は SVG アイコンを表示するために以下の方法が使われていた
  - `<img>` 要素の `src` 属性に SVG ファイルのパスを指定する
  - `<svg>` 要素を直接記述する
  - svg スプライトを使用する
- `mask-image` プロパティを使用することで、外部ファイルの SVG アイコンを読み込みつつ、アイコンの色を CSS で指定することが可能になる

## 参考

- [mask-image - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/mask-image#%E3%83%96%E3%83%A9%E3%82%A6%E3%82%B6%E3%83%BC%E3%81%AE%E4%BA%92%E6%8F%9B%E6%80%A7)
- [CSS Masking](https://ishadeed.com/article/css-masking/)[^1]: [ベースライン
  2023 年  |  Blog  |  web.dev](https://web.dev/blog/baseline2023?hl=ja)
- [「mask-image」でSVGアイコンの色をCSSで変えよう！　～mask-imageの便利な使い方紹介を添えて～](https://zenn.dev/kagan/articles/cf3332462262f1)
