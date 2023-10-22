---
id: ViyUdsOJJYPswWQ6tmlfA
title: "JavaScript なしでインタラクションを追加する Invokers"
slug: "invokers-to-add-interactions-without-javascript"
about: "Invokers は JavaScript なしでインタラクションを追加するための提案です。`<button>` 要素に `invoketarget` 属性を指定することで、値として指定した id を持つ `<dialog>` などの要素の開閉状態を切り替えることが可能となります。"
createdAt: "2023-10-22T10:37+09:00"
updatedAt: "2023-10-22T10:37+09:00"
tags: [HTML]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3zkGp3ZkX4p7ExPUT1ZvhJ/513dd954ebf55d5a8cad38b534bacd39/susuki_suzumushi_11223.png"
  title: "鈴虫とすすきのイラスト"
published: true
---

!> `invoketarget`、`interesttarget` 属性は 2023 年 10 月 22 日現在実装されていません。

`<button>` 要素に　`invoketarget` 属性を指定することにより、JavaScript を削減し、より宣言的な方法で UI にインタラクションを追加できます。下記の例では `invoketarget` 属性に `<dialog>` の id を指定することで、`<button>` 要素をクリックしたときに `<dialog>` 要素を開くことができます。

```html
<button invoketarget="dialog">Open Dialog</button>

<dialog id="dialog">Content</dialog>
```

`interesttarget` 属性は、インタラクティブな要素に対してホバー、フォーカスをした際にツールチップを表示する提案です。インタラクティブな要素は `<button>`　に限らず、以下の要素が対象となります。

- `<a>`
- `<area>`
- `<input>`
- `<select>`
- `<textarea>`
- `<button>`
- `<summary>`

```html
<button interesttarget="my-popover">Open Popover</button>

<div id="my-popover" popover="hint">Hello world</div>
```

## 背景

はるか昔のことですが、人々は DOM にインタラクションを追加するためにインラインの JavaScript を使用していました。

```html
<button onclick="openDialog()">Open Dialog</button>
```

しかし、インラインの JavaScript はセキュリティ上の懸念や保守性の問題により次第に支持されなくなりました。この問題を解決するために、イベントリスナーを登録する `addEventListener` メソッドが使われるようになります。

```html
<button id="button">Open Dialog</button>

<script>
  document.getElementById("button").addEventListener("click", function () {
    // ...
  });
</script>
```

イベントリスナーを登録する方法はセキュリティ上の問題を解決するとともに、「関心の分離」の原則に従うことができます。しかし、イベントリスナーを登録コードは定型的なコードが増え、しばしば冗長になりがちです。また、イベントリスナーのコードだけ見ても一見どの要素に対してどのようなインタラクションが追加されているのかがわかりにくいという「手続き型のコード」となってしまうことがあります。

近年の React, Vue, Svelte などのフレームワークでは、イベントリスナーを登録する代わりに、`onClick` などのイベントハンドラーをプロパティとして指定することで、より宣言的な方法でインタラクションを追加することができます。

```jsx
const App = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Dialog</button>
      {isOpen && <Dialog />}
    </>
  );
};
```

このように宣言的な方法でインタラクションを追加するコードを記述することにより、開発者体験の向上や、コードの保守性の向上が期待できることに我々開発者は気がついたのです。

[ポップオーバー API](https://developer.mozilla.org/ja/docs/Web/API/Popover_API) は、ポップオーバー要素としたい DOM に対して `popover` 属性を、ポップオーバーの表示をトリガーとしたい DOM に対して `popovertarget` 属性を追加することで、ポップオーバーを表示できます。これには追加の JavaScript は必要ありません。

このように、宣言的な方法で DOM にインタラクションを追加する HTML は標準として既に受け入れられています。`invoketarget` 属性はこの考え方を拡張したものとなります。ポップオーバー API は現在ポップオーバーのみに焦点を当てていますが、`invoketarget` 属性はポップオーバー以外の以下の要素にも適用させることが目的です。

- `<dialog>`
- `<details>`
- `<video>`
- `<input type="file">`

また現在のポップオーバー API では、`popovertarget` をクリックした時のみしかポップオーバー要素を表示できません。現実のアプリケーションでは、インタラクティブな要素をホバー（またはデバイスに応じたインタラクション）した際に表示されるツールチップも存在します。このような実装を行うには、追加の JavaScript が必要でした。ポップオーバー API を拡張してさらに使いやすい方法にすることも検討されています。

## コード例

### ポップオーバー

`invoketarget` 属性はポップオーバー API における `popovertarget` と同じように動作します。つまり、`invoketarget` を指定した要素をクリックした際に、`invoketarget` の値と同じ id を持つ `popover` の表示・非表示を切り替えます。

```html
<button invoketarget="mypopover">ポップオーバーの切り替え</button>
<div id="mypopover" popover>ポップオーバーコンテンツ</div>
```

`invoketarget` を指定した際のデフォルトの挙動はポップオーバーの開閉状態のトグルです。`invokeaction` 属性を指定することで、開くか閉じるかを指定できます。

```html
<button invoketarget="mypopover" invokeaction="showPopover">
  ポップオーバーを開く
</button>
<button invoketarget="mypopover" invokeaction="hidePopover">
  ポップオーバーを閉じる
</button>

<div id="mypopover" popover>ポップオーバーコンテンツ</div>
```

`interesttarget` 属性を指定することで、ツールチップを表示できます。`interesttarget` を指定したようにホバーすることで、`interesttarget` の値と同じ id を持つ `popover` の表示・非表示を切り替えます。

```html
<input type="text" interesttarget="mypopover"></input>
<div id="mypopover" popover="hint">入力のヒント</div>
```

### ダイアログ

`invoketarget` 属性の id に `<dialog>` 要素を指定することで、`<button>` 要素をクリックした際に `<dialog>` 要素の開閉状態を切り替えることができます。

デフォルトではダイアログの開閉状態をトグルします・`invokeaction` 属性を指定することで閉じるか開くかを指定できます。

```html
<button invoketarget="my-dialog">ダイアログを開く</button>

<dialog id="my-dialog">
  <p>コンテンツ</p>
  <div>
    <!-- invokeaction="cancel" はダイアログが `open` な場合に閉じる　-->
    <button
      invoketarget="my-dialog"
      invokeaction="cancel"
    >
      キャンセル
    </button>
      <!-- invokeaction="close" はダイアログが `open` な場合に閉じ、`value` 属性を返す -->
    <button
      invoketarget="my-dialog"
      invokeaction="close"
      value="ok"
    >
      OK
    </button>
</dialog>
```

### ディスクロージャー（details）

`invoketarget` 属性の id に `<details>` 要素を指定することで、`<button>` 要素をクリックした際に `<details>` 要素の開閉状態を切り替えることができます。

```html
<button invoketarget="my-details">ヒントを開く</button>

<details id="my-details">
  <summary>ヒント</summary>
  <p>ヒントコンテンツ</p>
</details>
```

デフォルトでは `<details>` の開閉状態をトグルします。`invokeaction` 属性を指定することで、開くか閉じるかを指定できます。

```html
<button invoketarget="my-details" invokeaction="open">ヒントを開く</button>
<button invoketarget="my-details" invokeaction="close">ヒントを閉じる</button>

<details id="my-details">
  <summary>ヒント</summary>
  <p>ヒントコンテンツ</p>
</details>
```

### ファイル選択

`input[type="file"]` 要素のカスタマイズは現実のアプリケーションで広く行われています。ファイル選択のカスタマイズは実装方法の誤りによりアクセシビリティを損なうおそれがありました。`invoketarget` 属性を使用することで、ファイル選択ダイアログの表示をより簡単に実現できます。

```html
<button invoketarget="my-file">ファイルを選択</button>

<input type="file" id="my-file" />
```

### ビデオ

`<video>` や `<audio>` 要素には多くのインタラクションが存在し、その多くはカスタマイズされています（Youtube の動画を想像してください）。`invoketarget` 属性を使用することで、ビデオの再生・一時停止や、ミュートなどのカスタマイズをより簡単に実現できます。

`invokeaction` を指定しない場合には、ビデオの再生状態のトグルを行います。`invokeaction` を指定することで、再生・一時停止やミュートなどを指定できます。

```html
<button invoketarget="my-video" invokeaction="play">再生</button>
<button invoketarget="my-video" invokeaction="pause">一時停止</button>
<button invoketarget="my-video" invokeaction="mute">ミュート</button>

<video id="my-video" src="video.mp4"></video>
```

### JavaScript によるカスタム要素のインタラクション

`invoketarget` により指定された任意の要素に対して、JavaScript によるインタラクションを追加することもできます。`invoketarget` により指定された要素はイベントハンドラで `invoke` イベントを購読します。

```html
<button invoketarget="my-custom-element">要素の色を変更</button>

<div id="my-custom-element">...</div>

<script>
  document
    .getElementById("my-custom-element")
    .addEventListener("invoke", function (e) {
      // invokeaction が指定されていない場合には、"auto"になる
      if (e.action === "auto" || e.action === "red") {
        // 要素の色をトグルする
        if (e.style.color === "black") {
          this.style.color = "red";
        } else {
          this.style.color = "black";
        }
      } else if (e.action === "blue") {
        if (e.style.color === "black") {
          this.style.color = "blue";
        } else {
          this.style.color = "black";
        }
      }
    });
</script>
```

`interesttarget` によるインタラクションの追加の場合には、`interest` と `loseinterest` イベントを購読します。

```html
<button interesttarget="my-custom-element">要素の色を変更</button>

<div id="my-custom-element">...</div>

<script>
  document
    .getElementById("my-custom-element")
    .addEventListener("interest", function (e) {
      this.style.color = "red";
    });

  document
    .getElementById("my-custom-element")
    .addEventListener("loseinterest", function (e) {
      this.style.color = "black";
    });
</script>
```

## アクセシビリティ

`invoketarget` 属性を指定した場合、暗黙的に `aria-controls` または `aria-details`（現時点では未確定）が追加されます。これにより、支援技術に対してインタラクションをトリガーする要素とインタラクションの対象の要素との関連性を伝えることができます。

インタラクションの対象の要素に `popover` 属性が指定されている、`<dialog>` 要素、または `<details>` 要素の場合にはトリガー要素に自動で `aria-expanded` の値が設定されます。

## まとめ

- Invokers の提案は、ポップオーバー API を拡張したもので、宣言的な方法で JavaScript を使用せずにインタラクションを追加できる
- `invoketarget` 属性は、`<button>` 要素をクリックした際に、`invoketarget` の値と同じ id を持つ要素の表示・非表示を切り替えることができる
- `interesttarget` 属性は、ホバーした際に、`interesttarget` の値と同じ id を持つ要素の表示・非表示を切り替えることができる

## 参考

- [Invokers (Explainer)|OpenUI](https://open-ui.org/components/invokers.explainer/)
