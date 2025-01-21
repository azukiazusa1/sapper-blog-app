---
id: OWbgQlZgLFyRPhUOn-pal
title: "ダイアログの Light dismiss を有効にする `<dialog closedby>` 属性"
slug: "dialog-closedby-attribute-for-light-dismiss"
about: "`<dialog closedby>` 属性はダイアログの外側をクリックした際にダイアログを閉じる Light dismiss 機能を実現するための属性です。closeby 属性は `any`, `closerequest`, `none` の 3 つの値を受け付けます。"
createdAt: "2025-01-21T18:04+09:00"
updatedAt: "2025-01-21T18:04+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/z41m0XjV0V1eJDTKKEbsd/9f215d6470af68a95abbbd417594d834/yakiimo_16655-768x729.png"
  title: "焼き芋のイラスト"
selfAssessment:
  quizzes:
    - question: "`<dialog>` 要素の Light dismiss 機能を実現するための属性はどれか？"
      answers:
        - text: "lightdismiss"
          correct: false
          explanation: null
        - text: "closetrigger"
          correct: false
          explanation: null
        - text: "closedby"
          correct: true
          explanation: null
        - text: "autoclose"
          correct: false
          explanation: null

published: true
---

!> `<dialog>` の `closedby` 属性は 2024 年 1 月現在 Chrome Beta v133 でのみサポートされています。

[Light dismiss](https://html.spec.whatwg.org/multipage/popover.html#popover-light-dismiss) とは開いているポップオーバーを簡単に解除できることを指します。具体的にはポップオーバーの外側をクリックするとポップオーバーが閉じるといった挙動です。このような挙動は HTML に仕様に概念として登場する以前にも一般的に採用されていたパターンでした。

このように外側をクリックしてクリックして簡単に閉じられる機能は、ポップオーバーに限らずダイアログやモーダルウィンドウなどでも一般的に採用されています。しかし、HTML の標準要素としてダイアログを表現する [`<dialog>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/dialog) 要素にはこのような Light dismiss 機能がありませんでした。そのため開発者は JavaScript を使ってダイアログの外側をクリックした際にダイアログを閉じる処理を実装したり、`<dialog>` 要素に `popover` 属性を追加するなどの補法で Light dismiss 機能を実現していました。

新しく HTML 仕様に追加された `closedby` 属性は、ダイアログの Light dismiss 機能を実現するための属性です。この記事では `closedby` 属性の使い方について解説します。

## `closedby` 属性の概要

`closedby` 属性は以下の 3 つの値を受け付けます。

- `any`：[Close request](https://html.spec.whatwg.org/#close-request) もしくはダイアログの外側をクリックした際にダイアログを閉じる
- `closerequest`：[Close request](https://html.spec.whatwg.org/#close-request) が発生した際にダイアログを閉じる
- `none`：ユーザーの操作によってダイアログを閉じることができない

-> Close request とはデバイスに固有の方法でユーザーがユーザーエージェントに閉じることを要求することを指します。例えばデスクトップブラウザでは `esc` キーを押すことで、Android デバイスではバックボタンを押すことで Close request が発生します。Close request はダイアログ、ポップオーバー、フルスクリーンモードなどの UI コンポーネントに対して共通の挙動です。

`closedby` 属性が指定されていないもしくは無効な値が指定された場合、値は `auto` として扱われます。`auto` は今までのダイアログと同じ挙動を示します。つまり、`.showModal()` メソッドによりダイアログが開かれた場合には Close Request によりダイアログが閉じられます（ダイアログの外側をクリックしても閉じられません）。それ以外の方法（`<dialog>` 要素の `open` 属性を変更する、`.show()` メソッドを呼び出すなど）でダイアログが開かれた場合には `none` を指定した場合と同様にダイアログを閉じることができません。

実際に `closedby=any` を指定したダイアログの例を以下に示します。

```html
<button id="open-dialog">ダイアログを開く</button>
<dialog closedby="any">
  <p>ダイアログの内容</p>
</dialog>

<script>
  const openButton = document.getElementById("open-dialog");
  const dialog = document.querySelector("dialog");

  openButton.addEventListener("click", () => {
    dialog.show();
  });
</script>
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/azukiazusa1/embed/ByBOxzL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ByBOxzL">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Chrome Beta v133 でダイアログの外側をクリックした場合や `ESC` キーを押した場合にダイアログが閉じる様子を確認できました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6SpDIvGEBVfm4P2TrQiH3T/31ab48e8b9674356c899c6fd2757a2b9/_____2025-01-21_18.50.39.mov" controls></video>

## まとめ

- `<dialog>` 要素に `closedby` 属性を指定することでダイアログの Light dismiss 機能を実現できる
- `closedby` 属性は `any`, `closerequest`, `none` の 3 つの値を受け付ける
  - `any`：Close request もしくはダイアログの外側をクリックした際にダイアログを閉じる
  - `closerequest`：Close request が発生した際にダイアログを閉じる
  - `none`：ユーザーの操作によってダイアログを閉じることができない
- `closedby` 属性が指定されていない場合、もしくは無効な値が指定された場合は `auto` として扱われる

## 参考

- [HTML Standard](https://html.spec.whatwg.org/#attr-dialog-closedby)
- [Add light dismiss functionality to `<dialog>` · Issue #9373 · whatwg/html](https://github.com/whatwg/html/issues/9373)
