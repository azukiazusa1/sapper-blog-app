---
id: 23IYL21xo8P5VJYr2oHk5R
title: "CSS 擬似クラス「:focus-within」"
slug: "css-pseudo-class-focus-within"
about: ":focus-within は CSS の擬似クラスであり、その要素または子孫要素にフォーカスがある場合に一致します。"
createdAt: "2022-09-18T00:00+09:00"
updatedAt: "2022-09-18T00:00+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/5ArE2K72ratyY0GPq8q5NM/22893b1244a22afea5dcb583358c9ded/julia-koi-K87TvPSCCgI-unsplash.jpg"
  title: "julia-koi-K87TvPSCCgI-unsplash"
audio: null
selfAssessment: null
published: true
---
[:focus-within](https://developer.mozilla.org/ja/docs/Web/CSS/:focus-within) は CSS の擬似クラスであり、その要素または子孫要素にフォーカスがある場合に一致します。

要素にフォーカスである場合に一致する擬似クラスである [:focus](https://developer.mozilla.org/ja/docs/Web/CSS/:focus) とよく似ていますが、`:focus` はフォーカスを持つ要素のみに適用される点で異なります。

よくある例としては、フォームの入力欄のいずれかの要素に対してフォーカスが当たったときに、フォーム全体を目立たせることができます。

```html
<button type="button">フォームの外</button>

<form>
  <div>
    <label for="name">名前</label>
    <input type="text" id="name" />
  </div>
  <div>
    <label for="email">email</label>
    <input type="email" id="email" />
    </div>
</form>
<button type="button">フォームの外</button>
```

```css
form {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  gap: 8px;
}

form:focus-within {
  background-color: yellow;
}

button {
  margin-top: 8px;
  margin-bottom: 8px;
}
```

下記の Codepen で実際の動作を確かめて見てください。

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/bGwNMVq?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/bGwNMVq">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
