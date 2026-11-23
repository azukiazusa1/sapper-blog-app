---
id: HBHxrz4OOoxjFMURaG4Ok
title: "@custom-media でメディアクエリのプリセットを定義する"
slug: "custom-media-presets"
about: "同じメディアクエリを複数の CSS ファイルに書くと、ブレークポイントを変えるときにすべての箇所を書き換える必要があります。@custom-media はメディアクエリに --md のような名前を付ける at-rule で、入力方式やブレークポイントをプリセットとして 1 か所で管理できます。この記事では、@custom-media の構文と仕様上の挙動について説明します。"
createdAt: "2026-11-04T17:17+09:00"
updatedAt: "2026-11-04T17:17+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7Moq95YA6MNzBWOQ8GMSIc/2ab602e0a51d3408b11199f33273a3a5/food_takotaki_illust_3428.png"
  title: "たこ焼きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "@custom-media --modern (color), (hover); と定義したとき、@media (--modern) and (width > 1024px) と同じ意味になる条件はどれですか？"
      answers:
        - text: "(color), (hover) and (width > 1024px)"
          correct: false
          explanation: "定義を文字列として置き換えた解釈です。この解釈では (color) だけで一致してしまいます。仕様では名前を 1 つの条件として論理的に評価します。"
        - text: "(color) and (hover) and (width > 1024px)"
          correct: false
          explanation: "カンマで区切ったリストは「いずれかが一致する」という意味なので、(color) と (hover) の両方を求める and にはなりません。"
        - text: "((color) or (hover)) and (width > 1024px)"
          correct: true
          explanation: "@custom-media の名前は論理的に評価され、リストは or としてまとめて扱われます。仕様にも同じ例が載っています。"
        - text: "(color) or (hover) or (width > 1024px)"
          correct: false
          explanation: "and で組み合わせているので、幅の条件は必ず満たす必要があります。いずれか 1 つが一致すればよい条件にはなりません。"
    - question: "定義していない名前 --undefined を参照する @media not (--undefined) はどのように評価されますか？"
      answers:
        - text: "未定義の名前は false として扱われるため、not によって一致する"
          correct: false
          explanation: "@custom-media --off false; を定義した not (--off) の挙動です。未定義の名前は false ではなく unknown として扱われます。"
        - text: "未定義の名前は unknown として扱われ、not を付けても unknown のままなので一致しない"
          correct: true
          explanation: "仕様の注記にあるとおり、未定義のメディア特性は false と区別されます。not unknown は unknown のままなので、ルールは適用されません。"
        - text: "未定義の名前は true として扱われるため、not によって一致しない"
          correct: false
          explanation: "未定義の名前が true として扱われることはありません。unknown として扱われるため、not を付けても一致しません。"
        - text: "スタイルシート全体が構文エラーになり、すべてのルールが無効になる"
          correct: false
          explanation: "未定義の名前を参照しても、その条件が unknown になるだけで、ほかのルールには影響しません。"
published: true
---
b> custom-media-queries

レスポンシブなサイトでは、メディアクエリのブレークポイントを統一して使うことが多いです。例えばスマホは 48rem 未満、タブレットは 48rem 以上、PC は 64rem 以上のようなルールが決められているといった場合です。`(width >= 48rem)` というブレークポイントを各コンポーネントの CSS に直接書いていると、ブレークポイントのルールを変えるときにすべての箇所を探して書き換えなければなりません。1 か所でも書き換えを忘れると、特定の幅でだけレイアウトが崩れるという見つけにくいバグになります。

この問題には、これまで Sass などのプリプロセッサが使われてきました。次の例では、ブレークポイントの値を Sass の変数に入れ、メディアクエリを mixin にまとめています。

```scss
$bp-md: 48rem;

@mixin md {
  @media (width >= $bp-md) {
    @content;
  }
}

.cards {
  display: grid;

  @include md {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

`@include md` と書いた箇所は、ビルド時に `@media (width >= 48rem)` へ展開されます。ブレークポイントの値は 1 か所で変更できますが、Sass 独自の構文を使う必要があるという欠点があります。

[`@custom-media`](https://drafts.csswg.org/mediaqueries-5/#custom-mq) は、メディアクエリに `--md` のような名前を付ける仕組みを CSS 自体に用意する at-rule です。名前を付けたメディアクエリを 1 つのファイルにまとめておけば、プロジェクト全体で使い回すプリセットとして扱えます。

この記事では、`@custom-media` の構文と仕様上の挙動について説明します。

!> 2026 年 11 月 4 日現在、`@custom-media` を実装しているブラウザは Firefox だけで、`about:config` で `layout.css.custom-media.enabled` を `true` にした場合にのみ動作します。Chrome と Safari は対応していません。仕様の Media Queries Level 5 は Working Draft であり、定義の順序の扱いなど、まだ決まっていない点があります。

## メディアクエリではカスタムプロパティを使えない

ブレークポイントを 1 か所で管理したいとき、カスタムプロパティを使う方法が最初に思い浮かびます。しかし、メディアクエリの中では `var()` を使えません。[CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/#using-variables) は、`var()` を要素のプロパティの値の中でだけ使えると定めており、プロパティ名やセレクターのように、プロパティの値以外の場所では使えないためです。

実際に、ブレークポイントをカスタムプロパティで共有しようとした次のメディアクエリは、画面の幅が `48rem` 以上でも一致しません。

```css
:root {
  --bp-md: 48rem;
}

/* var() はメディアクエリの中では解決されない */
@media (width >= var(--bp-md)) {
  p {
    color: green;
  }
}
```

そのため、CSS だけではブレークポイントを共有できず、導入で紹介した Sass のようにビルド時に値を展開する方法が使われてきました。

## `@custom-media` の基本構文

`@custom-media` の構文は次のとおりです。名前のあとに、メディアクエリのリストか `true`、`false` のいずれかを書きます。

```css
@custom-media <extension-name> [ <media-query-list> | true | false ];
```

`<extension-name>` はカスタムプロパティと同じく `--` で始まる名前です。次の例では、`(width >= 48rem)` に `--md` という名前を付けています。

```css
@custom-media --md (width >= 48rem);

@media (--md) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

`@media (--md)` のように、定義した名前を括弧で囲んでメディア特性の位置に書くと、`--md` に対応するメディアクエリが一致するときにルールが適用されます。名前は `(--md)` のような真偽値の形でだけ使えます。`(--md: 1)` や `(--md > 1)` のように値と比較する書き方は構文エラーです。

通常のメディア特性と同じく、`and`、`or`、`not` で組み合わせられます。

```css
@media (--md) and (--mouse) {
  /* 幅が 48rem 以上で、マウスで操作しているとき */
}

@media not (--md) {
  /* 幅が 48rem 未満のとき */
}
```

`@custom-media` の定義の中で、別の `@custom-media` の名前を参照できます。ただし、名前が自分自身を直接または間接的に参照する循環は禁止されており、循環に含まれる名前はすべて未定義として扱われます。

## 仕様上の挙動

この節では、`@custom-media` を使ううえで知っておきたい挙動を説明します。

### 文字列の置換ではなく論理的に評価される

`@custom-media` の名前は、定義したメディアクエリの文字列に置き換えられるのではなく、1 つの条件として評価されます。仕様には次の例が載っています。

```css
/* --modern は色を表示できるか、ホバーできる端末を表す */
@custom-media --modern (color), (hover);

@media (--modern) and (width > 1024px) {
  .a {
    color: green;
  }
}
```

カンマで区切ったメディアクエリのリストは「いずれかが一致する」という意味です。そのため、`(--modern) and (width > 1024px)` は `((color) or (hover)) and (width > 1024px)` と同じ意味になります。

### `true` と `false` で定義を切り替える

メディアクエリの代わりに `true` か `false` を書くと、その名前は常に一致するか、常に一致しない条件になります。

```css
@custom-media --md true;
```

プリセットの定義を一時的に `true` や `false` へ書き換えると、画面の幅や端末を変えずに、その条件が一致したときのスタイルを確認できるといった使い方ができます。

### 未定義の名前は `false` とは異なる

定義されていない名前を参照した場合、その条件は「不明（unknown）」として扱われます。[Media Queries Level 5 の注記](https://drafts.csswg.org/mediaqueries-5/#custom-mq)では、エラー処理において、未定義のメディア特性と `false` に評価されるメディア特性は異なると説明されています。詳細は [Media Queries Level 4 の 3.2. Error Handling](https://drafts.csswg.org/mediaqueries-4/#error-handling) で定められています。この違いは `not` と組み合わせたときに現れます。

```css
@custom-media --off false;

/* 一致する: not false は true */
@media not (--off) {
}

/* 一致しない: not unknown は unknown のまま */
@media not (--undefined) {
}
```

### 同じ名前を再定義すると最後の定義が使われる

同じ名前の `@custom-media` が複数ある場合、仕様では最後の定義だけが使われます。

```css
@custom-media --md (width >= 48rem);
@custom-media --md (width >= 50rem); /* こちらが使われる */
```

### 参照より後に書いた定義の扱いは決まっていない

仕様の議論が続いているのが、`@media (--late)` のように名前を参照したあとで `@custom-media --late` を定義した場合の扱いです。

```css
@media (--late) {
  .a {
    color: green;
  }
}

@custom-media --late true;
```

CSS Working Group（CSSWG）は 2025 年 8 月に、[Issue #12536](https://github.com/w3c/csswg-drafts/issues/12536) で「`@custom-media` は使う前に宣言しなければならない」と決議しました。`@custom-media` は `@media` の中に書くこともでき、`@media (--a)` の中で `--a` を定義するような循環が起こり得ます。スタイルシートを先頭から読みながら、その時点で見つかっている定義を使えば、このような循環を複数回の走査なしで解決できます。

しかし、CSS では `@font-face` のように、参照より後に書いた定義も有効になるのが普通です。宣言順に依存するルールは CSS の他の部分と異なるモデルを作者に覚えさせることになるため、2026 年 1 月の [Issue #13041](https://github.com/w3c/csswg-drafts/issues/13041) でこの決議は撤回されました。代わりに、すべての定義を先に集めてから名前の衝突を解決する方式で「最後の定義が勝つ」挙動に近づける方針が決まっています。2026 年 7 月には、この方式でも評価する順序によって結果が変わる例が報告されており、詳細はまだ決まっていません。

## PostCSS で展開する

[`postcss-custom-media`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media) は、`@custom-media` の名前を定義したメディアクエリに展開する PostCSS のプラグインです。現時点で広くサポートされていない `@custom-media` を使う方法として適していると言えるでしょう。必要なパッケージをインストールします。

```bash
npm install -D postcss postcss-cli postcss-custom-media @csstools/postcss-global-data
```

[`@csstools/postcss-global-data`](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-global-data) に `presets.css` を渡すと、出力に定義を含めずに、変換に必要な情報だけを提供できます。

```js:postcss.config.mjs
import postcssGlobalData from "@csstools/postcss-global-data";
import postcssCustomMedia from "postcss-custom-media";

export default {
  plugins: [
    // postcss-custom-media より前に置く
    postcssGlobalData({ files: ["./presets.css"] }),
    postcssCustomMedia(),
  ],
};
```

`presets.css` は以下のように、入力方式・ブレークポイント・ユーザー設定のプリセットをまとめて定義します。

```css:presets.css
/* 入力方式 */
@custom-media --mouse (hover: hover) and (pointer: fine);
@custom-media --touch (hover: none) and (pointer: coarse);

/* ブレークポイント */
@custom-media --md (width >= 48rem);
@custom-media --lg (width >= 64rem);

/* ユーザー設定 */
@custom-media --motion-ok (prefers-reduced-motion: no-preference);
@custom-media --high-contrast (prefers-contrast: more), (forced-colors: active);
```

`app.css` で `@media (--md)` のように参照します。

```css:app.css
.cards {
  display: grid;
  gap: 1rem;
}

@media (--md) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (--lg) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  background-color: rebeccapurple;
  color: white;
}

@media (--touch) {
  .button {
    min-block-size: 48px;
  }
}

@media (--mouse) {
  .button:hover {
    background-color: indigo;
  }
}

@media (--motion-ok) {
  .button {
    transition: background-color 0.2s;
  }
}

@media (--high-contrast) {
  .button {
    border-color: currentColor;
  }
}
```

`postcss-cli` で `app.css` を変換します。`postcss` コマンドは、カレントディレクトリにある `postcss.config.mjs` を自動的に読み込みます。

```bash
npx postcss app.css -o dist/app.css
```

出力された `dist/app.css` では、`@media (--md)` などが定義したメディアクエリに置き換わります。次のコードは出力の一部です。

```css:dist/app.css
@media (width >= 48rem) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (hover: none) and (pointer: coarse) {
  .button {
    min-block-size: 48px;
  }
}

@media (prefers-contrast: more),(forced-colors: active) {
  .button {
    border-color: currentColor;
  }
}
```

[`postcss-preset-env`](https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env) を使っている場合は、デフォルトの設定で `postcss-custom-media` が有効になっています。

## まとめ

- `@custom-media` はメディアクエリに `--md` のような名前を付ける at-rule で、`@media (--md)` のように真偽値の形でだけ参照できる
- `var()` はプロパティの値の中でだけ使えるため、メディアクエリのブレークポイントをカスタムプロパティで共有できない
- `@custom-media` の名前は文字列の置換ではなく 1 つの条件として評価され、リストを定義した名前を `and` と組み合わせても意味が変わらない
- `true` と `false` で定義を切り替えられ、未定義の名前は `false` ではなく unknown として扱われるため `not` を付けても一致しない
- 同じ名前を再定義すると最後の定義が使われる。参照より後に書いた定義の扱いは、2025 年 8 月の「使う前に宣言する」決議が 2026 年 1 月に撤回され、CSSWG で議論が続いている
- 入力方式、ブレークポイント、ユーザー設定のプリセットを 1 つのファイルにまとめておけば、条件を変えるときに書き換える箇所が 1 か所で済む
- 2026 年 11 月時点で `@custom-media` を実装しているのはフラグを有効にした Firefox だけなので、今使うなら `postcss-custom-media` と `@csstools/postcss-global-data` で通常の `@media` に展開する

## 参考

- [Media Queries Level 5 - 10. Custom Media Queries](https://drafts.csswg.org/mediaqueries-5/#custom-mq)
- [Media Queries Level 4 - 2.5. Media Features](https://drafts.csswg.org/mediaqueries-4/#mq-features)
- [CSS Custom Properties for Cascading Variables Module Level 1](https://www.w3.org/TR/css-variables-1/)
- [@custom-media - MDN Web Docs](https://developer.mozilla.org/docs/Web/CSS/Reference/At-rules/@custom-media)
- [postcss-custom-media](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-custom-media)
- [Useful @custom-media Presets](https://blog.master.dev/useful-custom-media-presets/)
