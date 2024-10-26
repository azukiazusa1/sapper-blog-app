---
id: 1mzAckUNwjuath_zoBS4F
title: "JavaScript でスタイルシートを構築する CSSStyleSheet"
slug: "cssstylesheet-to-build-stylesheets-in-javascript"
about: "CSSStyleSheet インターフェースは、JavaScript でスタイルシートを構築し、操作するための API です。CSSStyleSheet() コンストラクターで新しいスタイルシートを作成し、.replaceSync() メソッドでスタイルを適用できます。"
createdAt: "2024-10-26T11:59+09:00"
updatedAt: "2024-10-26T11:59+09:00"
tags: ["JavaScript", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/31Rh2eKOuOJQhiTAbpiUW4/905cac62d1c7739d6259f018ff4099a4/meteorite_inseki_illust_4635-768x691.png"
  title: "隕石のイラスト"
selfAssessment:
  quizzes:
    - question: "CSSStyleSheet インターフェースでスタイルシートの指定した位置に新しいルールを追加するメソッドはどれか？"
      answers:
        - text: ".insertRule()"
          correct: true
          explanation: null
        - text: ".unshiftRule()"
          correct: false
          explanation: null
        - text: ".replaceSync()"
          correct: false
          explanation: null
        - text: ".pushRule()"
          correct: false
          explanation: null
published: true
---
`CSSStyleSheet` インターフェースは、JavaScript でスタイルシートを構築し、操作するための API です。`CSSStyleSheet()` コンストラクターで新しいスタイルシートを作成し、`.replaceSync()` メソッドでスタイルを適用できます。

スタイルが適用された `CSSStyleSheet` オブジェクトは、`document.adoptedStyleSheets` プロパティに代入することで、ページ全体に適用されます。

```js
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync("body { background-color: lightblue; }");
document.adoptedStyleSheets = [styleSheet];
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/ExqoyGB?default-tab=css%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ExqoyGB">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

よくある使い方として、Shadow DOM でカプセル化されたスタイルを適用するために使用されます。`ShadowRoot.adoptedStyleSheets` プロパティに代入することで、Shadow DOM に適用されます。

```js
const host = document.querySelector("#host");
const shadowRoot = host.attachShadow({ mode: "open" });

const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync("h1 { color: red; }");

shadowRoot.adoptedStyleSheets = [styleSheet];
```

## スタイルを変更する

`CSSStyleSheet` オブジェクトは以下の 4 つのメソッドを提供していおり、スタイルを挿入、削除、置換を行うことができます。

- `.insertRule()`: スタイルシートの指定した位置新しいルールを追加する
- `.deleteRule()`: スタイルシートの指定した位置からルールを削除する
- `.replace()`: スタイルシートの内容を非同期に置換し、Promise を返す
- `.replaceSync()`: スタイルシートの内容を同期的に置換する

現在適用されているスタイルを取得するには、`styleSheet.cssRules` プロパティを使用します。`styleSheet.cssRules` は `CSSRuleList` という順序付きの `CSSRule` のリストを返します。

```js
const styleSheet = new CSSStyleSheet();
styleSheet.replaceSync(
  "body { background-color: lightblue; } h1 { color: red; }",
);

console.log(styleSheet.cssRules); // => CSSRuleList {0: CSSStyleRule, 1: CSSStyleRule, length: 2}

styleSheet.insertRule("h2 { color: blue; }", 1); // 1 番目の位置に h2 のスタイルを追加
styleSheet.deleteRule(0); // 0 番目の位置のスタイルを削除

// for...of で CSSRuleList をイテレートできる
for (const rule of styleSheet.cssRules) {
  console.log(rule.cssText); // => h2 { color: blue; }, h1 { color: red; }
}
```

## スタイルシートの `@media` を指定する

`CSSStyleSheet()` コンストラクターのオプションとして、[メディア特性](https://developer.mozilla.org/ja/docs/Web/CSS/@media#%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E7%89%B9%E6%80%A7) を指定できます。以下の例は、`prefers-color-scheme` メディアクエリを指定して、ダークモード時に背景色を変更するスタイルシートを作成しています。

```js
const styleSheet = new CSSStyleSheet({
  media: "(prefers-color-scheme: dark)",
});
styleSheet.replaceSync("body { background-color: black; color: white; }");

console.log(styleSheet.media); // => MediaList {0: '(prefers-color-scheme: dark)', length: 1, mediaText: '(prefers-color-scheme: dark)'}
```

## まとめ

- `CSSStyleSheet` インターフェースは、JavaScript でスタイルシートを構築し、操作するための API
- `CSSStyleSheet()` コンストラクターで新しいスタイルシートを作成し、`.replaceSync()` メソッドでスタイルを適用
- `document.adoptedStyleSheets` プロパティに代入することで、ページ全体に適用
- スタイルを変更するためのメソッドとして、`.insertRule()`、`.deleteRule()`、`.replace()`、`.replaceSync()` が提供されている
- `styleSheet.cssRules` プロパティで現在適用されているスタイルのリストを取得
- `CSSStyleSheet()` コンストラクターのオプションとして、[メディア特性](https://developer.mozilla.org/ja/docs/Web/CSS/@media#%E3%83%A1%E3%83%87%E3%82%A3%E3%82%A2%E7%89%B9%E6%80%A7) を指定できる

## 参考

- [6.1.2. The CSSStyleSheet Interface](https://drafts.csswg.org/cssom/#the-cssstylesheet-interface)
- [CSSStyleSheet: CSSStyleSheet() コンストラクター - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/CSSStyleSheet/CSSStyleSheet)
- [CSSStyleSheet - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/CSSStyleSheet)
