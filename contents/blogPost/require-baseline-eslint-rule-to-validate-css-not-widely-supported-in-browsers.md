---
id: nJqTNXDWkefPe44IwKVEF
title: "ブラウザに広くサポートされていない CSS を検証する require-baseline ESLint ルール"
slug: "require-baseline-eslint-rule-to-validate-css-not-widely-supported-in-browsers"
about: "Baseline はブラウザで利用可能な JavaScript や CSS のサポート状況を明確化するプロジェクトです。ESLint/CSS の require-baseline ルールを使用することで、Baseline でサポートされていない CSS プロパティや値を検出することができます。"
createdAt: "2025-02-22T17:27+09:00"
updatedAt: "2025-02-22T17:27+09:00"
tags: ["CSS", "ESLint", "Baseline"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7d5QDjhTKC9bvIJVOqNWwY/16958dae8788f839969904dd9000d208/various-chocolates_12311.png"
  title: "バレンタインチョコレートのイラスト"
selfAssessment:
  quizzes:
    - question: "Baseline でサポートされていない CSS プロパティや値を検出するための ESLint/CSS ルールは何か？"
      answers:
        - text: "require-baseline"
          correct: true
          explanation: null
        - text: "require-css"
          correct: false
          explanation: null
        - text: "require-support"
          correct: false
          explanation: null
        - text: "require-feature"
          correct: false
          explanation: null
    - question: "Baseline において「Widely Available」に分類されていない CSS プロパティや値を使用する場合に ESLint のエラーを回避する方法として正しいものはどれか？"
      answers:
        - text: "`@supports(...)` ルールのブロック内で使用する"
          correct: true
          explanation: null
        - text: "`@if(...)` ルールのブロック内で使用する"
          correct: false
          explanation: null
        - text: "`<!-- [if !IE]> -->` コメント内で使用する"
          correct: false
          explanation: null
        - text: "-webkit- プレフィックスを付与する"
          correct: false
          explanation: null
published: true
---
ブラウザによる CSS のサポート状況の差異は、Web 開発者にとって頭痛の種です。新しい CSS プロパティや値を使用する際には、それがどのブラウザでサポートされているかを確認する必要があります。[Baseline](https://web.dev/baseline?hl=ja) はそのような問題を解決するためのプロジェクトです。ブラウザで利用可能な JavaScript や CSS のブラウザのサポート状況を明確化することで、Web 開発者が安心して新しい機能を使用できるようになります。

Baseline で「Newly Available」とされている機能は Chrome、Edge、Firefox、Safari などの主要ブラウザでサポートされていることが保証されています。「Widely Available」は、Newly Available になってから 30 ヶ月が経過したものであり、何年も前からブラウザで使われている機能です。「Limited availability」の場合にはいくつかのブラウザでのみサポートされており、Baseline とは言えません。

[ESLint/CSS](https://github.com/eslint/css) の [require-baseline](https://github.com/eslint/css/blob/main/docs/rules/require-baseline.md) ルールを使用すると、Baseline でサポートされていない CSS プロパティや値を検出することができます。このルールを導入することで、誤って対象ブラウザにサポートされていない CSS を使用してしまい、画面崩れが発生してしまうリスクを軽減することが期待できます。

実際にルールの設定を試してみましょう。

## require-baseline ルールの設定

まずは `@eslint/css` パッケージをインストールします。あらかじめ ESLint がプロジェクトに導入されていることを前提とします。

!> `@eslint/css` は ESLint v9.6.0 以上かつ、[Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files) を使用している場合にのみ利用可能です。

```bash
npm install @eslint/css --save-dev
```

`eslint.config.js` に以下の設定を追加します。

```js:eslint.config.js
import css from "@eslint/css";

export default [
	// CSS ファイルを対象に lint を実行
	{
		files: ["**/*.css"],
		language: "css/css",
		...css.configs.recommended,
	},

	// your other configs here
  // ...
];
```

`recommended` には以下のルールが含まれています。

- no-duplicate-imports：重複した `@import` を許可しない
- no-empty-blocks：空のブロックを許可しない
- no-invalid-at-rule：無効な `@` ルールを許可しない
- no-invalid-properties：無効なプロパティを許可しない
- require-baseline：Baseline でサポートされていないプロパティや値を検出する

デフォルトでは CSS の構文を厳密に検査するモードで実行され、解析エラーが報告されます。しかし TailwindCSS や PostCSS のプラグインなどでカスタム構文を使用している場合に解析エラーが報告されるのは好ましくありません。解析エラーを許可する場合には `tolerant` オプションを `true` に設定します。

```js:eslint.config.js
import css from "@eslint/css";

export default [
	{
		files: ["**/*.css"],
		plugins: {
			css,
		},
		language: "css/css",
		languageOptions: {
			tolerant: true,
		},
    ...css.configs.recommended,
	},
];
```

もしくはカスタム構文を設定で追加して解析エラーを回避することもできます。もし TailwindCSS を使用している場合には組み込みの `tailwindSyntax` オブジェクトを使用できます。

```js:eslint.config.js
import css from "@eslint/css";
import { tailwindSyntax } from "@eslint/css/syntax";

export default [
	{
		files: ["**/*.css"],
		plugins: {
			css,
		},
		language: "css/css",
		languageOptions: {
			customSyntax: tailwindSyntax,
		},
    ...css.configs.recommended,
	},
];
```

## require-baseline ルールの確認

`require-baseline` ルールは以下の CSS を検出した際にエラーを報告します。

- 「Widely Available」に分類されておらず、`@supports` ブロックに囲まれていない CSS プロパティもしくは値
- 「Widely Available」に分類されていない `@` ルール
- 「Widely Available」に分類されていない `@media` ルール内の条件
- 「Widely Available」に分類されていない CSS 関数

Baseline のデータは [web-features](https://www.npmjs.com/package/web-features) パッケージにより提供されています。web-features のデータが更新されれば、今までエラーとされていたプロパティや値がサポートされるようになる可能性があります。

2025 年 2 月現在「Limited availability」に分類されている `field-sizing: content;` プロパティを使用してみます。ESLint を実行すると `Property 'field-sizing' is not a widely available baseline feature` というエラーが報告されます。

```css
textarea {
  /* Property 'field-sizing' is not a widely available baseline feature */
  field-sizing: content;
}
```

[@supports](https://developer.mozilla.org/ja/docs/Web/CSS/@supports) ルールを使用して、`field-sizing` プロパティがサポートされているかどうかを確認したうえで使用するのであれば、ルールに違反しません。

```css
@supports (field-sizing: content) {
  textarea {
    /** valid */
    field-sizing: content;
  }
}
```

デフォルトでは「Widely Available」に分類されているプロパティや値のみが利用可能です。「Newly Available」な機能である `scrollbar-width` プロパティを使用するとエラーがほうこくされます。

```css
textarea {
  /* Property 'scrollbar-width' is not a widely available baseline feature */
  scrollbar-width: thin;
}
```

`available` オプションに `newly` を指定することで、「Newly Available」な機能も許可することができます（デフォルトは `widely`）。

```js:eslint.config.js
import css from "@eslint/css";

export default [
  {
    files: ["**/*.css"],
    plugins: {
      css,
    },
    language: "css/css",
    rules: {
      "css/require-baseline": ["error", { available: "newly" }],
    }
  },
];
```

## まとめ

- Baseline はブラウザで利用可能な JavaScript や CSS のサポート状況を明確化するプロジェクト
- ESLint/CSS の require-baseline ルールを使用することで、Baseline でサポートされていない CSS プロパティや値を検出することができる
- Baseline にサポートされていない CSS であっても、`@supports` ルールを使用してサポート状況を確認したうえで使用することでルールに違反しない
