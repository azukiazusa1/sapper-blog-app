---
id: 5fdiBn4vzYhfz5PuezqA7x
title: "フォーカストラップとは?  〜アクセシブルなモーダル〜"
slug: "fucus-trap-accessible-modal"
about: "フォーカストラップ(またはループ)とは、ウェブページをキーボードで操作する際にフォーカスをとある領域からはみ出さないようにすることです。フォーカス可能な要素を抽出してその中をループすることで実現ができます。  登場シーンとしてはモーダルで使われることが多いです。実際に例を交えて確認してみましょう。"
createdAt: "2021-11-28T00:00+09:00"
updatedAt: "2021-11-28T00:00+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2fnYK4McTOVwoOcE9bd6fk/134ffadfac1e4fd50ce0e1c58b41d298/modal2.gif"
  title: "modal2"
audio: null
selfAssessment: null
published: true
---
## フォーカストラップとは？

フォーカストラップ（またはループ）とは、ウェブページをキーボードで操作する際にフォーカスをとある領域からはみ出さないようにすることです。フォーカス可能な要素を抽出してその中をループすることで実現ができます。

登場シーンとしてはモーダルで使われることが多いです。実際に例を交えて確認してみましょう。

### フォーカスが不適切なモーダル

初めに以下をご覧ください。見た目上は全く問題のないただのモーダルです。

![スクリーンショット 2021-11-28 12.10.25](//images.contentful.com/in6v9lxmm5c8/2yTGuzWGjeoObFCg13i89e/3fb8cc1278b37d767b6d3fdcfcbf0452/____________________________2021-11-28_12.10.25.png)

しかし、このモーダルをキーボードで操作しようとすると問題が明らかになります。submit ボタンの次のフォーカスが当たる箇所が本来操作可能でない背景のナビゲーションリンクへ移動してしまいます。これは明らかに不適切な挙動です。

![modal3](//images.contentful.com/in6v9lxmm5c8/4RaRmzWuNMuRJvU8HUiPnR/bd178909ebfc63e31ab542cb4c429819/modal3.gif)

この挙動を改善するためにフォーカスの移動はモーダル要素の中でループするように修正します。つまりは submit ボタンにフォーカスが当たっているときに Tab キーが押された場合にはモーダルの初めの要素のフォーカスが移動するようにするわけです。

![modal2](//images.contentful.com/in6v9lxmm5c8/2fnYK4McTOVwoOcE9bd6fk/134ffadfac1e4fd50ce0e1c58b41d298/modal2.gif)
## フォーカストラップを実装する

それでは実際にフォーカストラップを実装してみましょう。初めのコードは何も変哲もない普通のモーダルです。（以下からコピペしてきました）

https://www.w3schools.com/howto/howto_css_modals.asp

- index.html

```html
<!DOCTYPE html>
<html>

<head>
  <link rel="stylesheet" href="style.css">
  <title>Dialog</title>
</head>

<body>
  <nav>
    <ul>
      <li>
        <a href="index.html">Home</a>
      </li>
      <li>
        <a href="about.html">About</a>
      </li>
      <li>
        <a href="contact.html">Contact</a>
      </li>
      <li>
        <a href="blog.html">Blog</a>
      </li>
    </ul>
  </nav>

  <!-- Trigger/Open The Modal -->
  <button id="myBtn">Open Modal</button>

  <!-- The Modal -->
  <div id="myModal" class="modal" role="dialog">

    <!-- Modal content -->
    <div class="modal-content">
      <form action="" class="form">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Your name..">
        <label for="email">Email</label>
        <input type="text" id="email" name="email" placeholder="Your email..">
        <label for="subject">Subject</label>
        <input type="text" id="subject" name="subject" placeholder="Subject..">
        <label for="message">Message</label>
        <textarea id="message" name="message" placeholder="Write something.."></textarea>
        <div class="modal-action">
          <button type="button" id="close">Cancel</button>
          <button type="submit" class="submit">Submit</button>
        </div>
      </form>
    </div>
    <script src="dialog.js"></script>
  </div>
</body>

</html>
```

- style.css

```css
/* The Modal (background) */
.modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content/Box */
.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* 15% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Could be more or less, depending on screen size */
}

.modal-action {
  margin-top: 8px;
}

.form {
  display: flex;
  flex-direction: column;
}

.form input {
  padding: 4px;
  margin: 4px;
}

.form label {
  display: block;
  margin: 4px;
}
```

- dialog.js

```js
// Get the modal
const modal = document.getElementById("myModal");

// Get the button that opens the modal
const btn = document.getElementById("myBtn");

const close = document.getElementById("close");

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
close.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
```

続いて `dialog.js` ファイルに次のコードを追加します。（このコードはコメントも含めてすべて [GitHub Copilot](https://copilot.github.com/) が書いてくれました！）

```js
// Get the modal
const modal = document.getElementById("myModal");

// some code here...

/**
 * フォーカス可能な要素の一覧
 */
const focusableElementsSelector =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, [tabindex="0"], [contenteditable]';

modal.addEventListener("keydown", function (event) {
  // タブキーが押された時
  if (event.key === "Tab") {
    event.preventDefault();
    // モーダル要素内のフォーカス可能な要素の一覧を取得
    const focusableElements = Array.from(
      modal.querySelectorAll(focusableElementsSelector)
    );
    // 現在のフォーカス位置を取得
    const focusedItemIndex = focusableElements.indexOf(document.activeElement);

    // shiftキーと同時に押されてた場合
    if (event.shiftKey) {
      if (focusedItemIndex === 0) {
        // 現在のフォーカスが最初の要素の場合、最後の要素にフォーカスを移動
        focusableElements[focusableElements.length - 1].focus();
      } else {
        // 現在のフォーカスが最初の要素以外の場合、前の要素にフォーカスを移動
        focusableElements[focusedItemIndex - 1].focus();
      }
    } else {
      if (focusedItemIndex === focusableElements.length - 1) {
        // 現在のフォーカスが最後の要素の場合、最初の要素にフォーカスを移動
        focusableElements[0].focus();
      } else {
        // 現在のフォーカスが最後の要素以外の場合、次の要素にフォーカスを移動
        focusableElements[focusedItemIndex + 1].focus();
      }
    }
  }

  // ESCキーが押された時
  if (event.key === "Escape") {
    event.preventDefault();
    modal.style.display = "none";
  }
});
```

順を追って説明します。モーダル要素内でフォーカスの移動をループさせるためにはもともとの Tab キーでの移動は行わないようにして JavaScript で独自に制御する必要があります。そのために `modal` 要素の `keydown` イベントを購読します。 `keydown` イベントはキーが押されたときに発生します。押されたキーが Tab キーだった場合にはデフォルトのイベントを拒否して独自のフォーカスイベントを実行します。

まずはじめに `modal.querySelectorAll` でモーダル内のフォーカス可能な要素をすべて取得します。 `querySelectorAll` で取得した要素は「配列っぽい配列ではない要素」なので操作しやすいように `Array.from` で配列に変換してやります。

続いて現在フォーカスしている要素の index を取得します。 `document.activeElement` は現在フォーカス中の要素を返します。

ここからは Tab キーが押されたときに同時に Shift キーが押されていたかどうかで条件分岐します。Tab キーと Shift キーが同時に押された場合にはフォーカスを戻る必要があるからです。

フォーカスを戻す場合には現在フォーカス中の要素がモーダル内の最初の要素だった場合ループさせるためモーダル内の最後の要素に移動させます。その他の場合には単純に 1 つ前の要素にフォーカスを移動します。

フォーカスを進めるときには現在フォーカスしている要素がモーダル内の最後の要素の場合にはる 0 府させるためモーダルの最初の要素に移動させます。その他の場合には単純に 1 つ後の要素にフォーカスを移動します。

後はおまけとしてモーダル内で Esc キーを押したときにモーダルが閉じるようにしておきます。

## ライブラリ

毎回フォーカストラップのコードを書くのは退屈なので React や Vue 向けのフォーカストラップのライブラリが公開されています。以下を使用しましょう。

- [react-focus-lock](https://github.com/theKashey/react-focus-lock)
- [focus-trap-vue](https://github.com/posva/focus-trap-vue)

基本的な使用方法はどちらもライブラリの提供するコンポーネントで要素を囲むだけです。

```js
import ReactFocusLock from "react-focus";

const Modal = ({ children }) => {
  return (
    <div className="modal" role="dialog">
      <ReactFocusLock>{children}</ReactFocusLock>
    </div>
  );
};

export default Modal;
```

また例えば Vuetify や MUI などの UI フレームワークが提供するダイアログを使っている場合には大抵の場合すでにフォーカストラップは実装済です。ですので、実際にフォーカストラップを意識して実装する場面はそう多くはないでしょう。それでも、アクセシブルなモーダルを作成するために行われている工夫を知っておくのはよいことでしょう。
