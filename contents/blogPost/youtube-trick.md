---
title: "Youtube すごい裏ワザ！！！"
about: "Tab キーでページを操作した時のみ表示される「ナビゲーションをスキップ」は一般にスキップリンクと呼ばれるものであり、ウェブアクセシビリティのガイドライン (W3C 勧告) である WCAG 2.0にあるブロックスキップと呼ばれる達成基準を達成する方法として上げられています。"
createdAt: "2021-11-14T00:00+09:00"
updatedAt: "2021-11-14T00:00+09:00"
tags: ["アクセシビリティ"]
published: true
---
既出だったらごめんなさい

これは、ぼくが、友だちに教えてもらった裏技です
初めに Youtube のトップ画面をパソコンで開いてください
スマートフォンではだめです

画面を開いたら Tab キーを3回だけ押してください それ以上押してしまうと失敗します（失敗したら、もう一度画面を開き直してください）

ぼくは Google Chrome でやりましたが、Firefox だと2回だと友だちが言ってました

上記が成功したら、「ナビゲーションをスキップ」というボタンが表示されています

![スクリーンショット 2021-11-14 12.49.32](//images.contentful.com/in6v9lxmm5c8/1Rrq4dYjjLnClW3LUAFbCE/203a9b8bde93b1b61252b0ed4fb9df99/____________________________2021-11-14_12.49.32.png)

そうしたら、Space キーか Enterキー を押してください。マウスで直接クリックすると失敗します←重要！

成功したら、メインコンテンツにフォーカスが移動しています

**結果**
ナビゲーションをスキップできる！

## ナビゲーションをスキップとは？

Tab キーでページを操作した時のみ表示される「ナビゲーションをスキップ」は一般に[スキップリンク](https://weba11y.jp/glossary/sa/skip-link/)と呼ばれるものであり、ウェブアクセシビリティのガイドライン (W3C 勧告) である WCAG 2.0にある[ブロックスキップ](https://waic.jp/docs/UNDERSTANDING-WCAG20/navigation-mechanisms-skip.html)と呼ばれる達成基準を達成する方法として上げられています。

> 2.4.1 ブロックスキップ: 複数のウェブページ上で繰り返されているコンテンツのブロックをスキップするメカニズムが利用できる。 (レベル A)

これは、スクリーンリーダーを利用しているユーザーのために提供されてきたものであり [Techniques for WCAG 2.0](https://www.w3.org/TR/WCAG20-SCRIPT-TECHS/) では画面を見てキーボードだけで操作しているユーザーによっても有用なメカニズムの一つとして上げられました。

なお、今日のスクリーンリーダーは見出し要素間の移動や WAI-ARIA ランドマーク間の移動ができるようになっており、適切に見出しや WAI=ARIA ランドマークがマークアップされていれば、スキップリンクは無くとも概ね問題ないと言えます。

## キーボードのみでウェブページを操作する

Webbbアクセシビリティの課題では**キーボードだけでウェブページを操作できること**が求められています。

つまり、キーボード操作のみで要素を選択し、ボタンをクリック、フォーム入力等の操作ができる必要があります。基本的には、**正しいHTMLのマークアップ**ができていればブラウザがキーボードショートカットをサポートしているので、コードを書くときになにか特別な設定をする必要があったりするわけではありません。(正しいHTMLのマークアップができていないことが多いのですが・・・)

例えば、Google Chrome では以下の通りにキーボードショートカットを提供しています。

[Chrome のキーボード ショートカット | ウェブページのショートカット](https://support.google.com/chrome/answer/157179?hl=ja#zippy=%2C%E3%82%BF%E3%83%96%E3%81%A8%E3%82%A6%E3%82%A3%E3%83%B3%E3%83%89%E3%82%A6%E3%81%AE%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%2C%E3%83%9E%E3%82%A6%E3%82%B9%E3%81%AE%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88%2C%E3%82%A6%E3%82%A7%E3%83%96%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%AE%E3%82%B7%E3%83%A7%E3%83%BC%E3%83%88%E3%82%AB%E3%83%83%E3%83%88)

基本的に要素を間を移動するには Tab キーを使用します。`tab` で次の項目を移動し `shift+tab` で1つ前の要素を戻ることができます。ボタンクリック等の操作は Enter キーを使用します。

Tab キーを使い要素が選択され操作できるような状態になっているときは視覚的にそのことを確認できるようにする必要があります。これは CSS の `:focus` 疑似クラスで制御することができます。

### 実際にキーボードのみで操作する

実際にキーボードのみでウェブページを操作可能なのか試してみます。Amazonでログインするまでをやってみましょう。

まずページを開いたら「こんにちは、ログイン」と書かれている要素まで Tab キーを押して移動します。

![amazon](//images.contentful.com/in6v9lxmm5c8/2jOd8z26KLjftGolljXwmb/eccaf72a0f0d0ce1f58684adf42277fe/amazon.gif)

「こんにちは、ログイン」にフォーカスが当たっている状態になったら Enter キーを押します。そうするとポップアップが出現し、「ログイン」ボタンにフォーカスが当たっている状態になっていますので Enter キーを押すとログイン画面へ遷移できます。

ログインを開いたらすでにメールアドレス入力欄にフォーカスが当たっているので通常通りメールアドレスを入力できます。メールアドレスの入力が完了したら Tab キーを一度押し「次に進む」ボタンへフォーカスを移動しましょう。正しいメールアドレスを入力したなら次はパスワード入力画面へ遷移できるはずです。

![amazon2](//images.contentful.com/in6v9lxmm5c8/6o3SHul6rZ6WiVY0AJY3sr/ac4bd8ff26141a8833424127d958a09f/amazon2.gif)

### 長すぎたナビゲーション

同様に Youtube のトップ画面から好みの動画まで辿りつけつるかを試してみましょう。

![youtube](//images.contentful.com/in6v9lxmm5c8/1qQnPTzevVMKgfKM0rTPYg/c18098dfd9c4f50bac276a59976ba4cf/youtube.gif)

な、長い・・・

このようにメインコンテンツまで辿り着くまでには毎回すべてのナビゲーションの要素を通過しなければなりません。大抵のユーザーにとって興味があるのはメインコンテンツ内の要素なのですが、このようなナビゲーションはほぼすべてのページに設置されているので毎回気の遠くなるような操作を繰り返さなければいけません。

このようなシチュエーションにスキップリンクは便利です。キーボードで操作してもすぐにメインコンテンツまでたどり着けます。

(Youtube の例が良くないのか、実際に動画まで辿り着くまでカテゴリ一覧の要素を通過しなければいけません・・・)

![youtube2](//images.contentful.com/in6v9lxmm5c8/2lYPThG5t1z2JWA6L6oPqP/fb4a5bfe3da6bd401c28258a35a7d8fe/youtube2.gif)

## スキップリンクを実装する

それでは、実際にスキップリンクを実装してみましょう。下記のなんの変哲もないサンプルを利用します。

```html
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fixed top navbar example · Bootstrap v5.1</title>

  <!-- Bootstrap core CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    crossorigin="anonymous"></script>

  <!-- Custom styles for this template -->
  <link href="https://getbootstrap.com/docs/5.1/examples/navbar-fixed/navbar-top-fixed.css" rel="stylesheet">
</head>

<body>

  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Fixed navbar</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Blog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>

  <main id="main" class="container">
    <div class="bg-light p-5 rounded">
      <h1>Navbar example</h1>
      <button id="main" class="btn btn-lg btn-primary">Click here!</button>
    </div>
  </main>
</body>

</html>
```

![スクリーンショット 2021-11-14 20.30.10](//images.contentful.com/in6v9lxmm5c8/6wVNLEA6eV4uzSdtov95GY/df322533fcca4b6274bf05627e6847f0/____________________________2021-11-14_20.30.10.png)

このウェブページにナビゲーションをスキップしてすぐにメインコンテンツ内のボタンを押せるよう、以下の要件でスキップリンクを作成します。

- 通常は非表示となっており Tab キーを押すまで表示されない
- ナビゲーションバーには十分なスペースがないので、ナビゲーションバーの上部に浮かせた状態で表示する
- スキップリンクにフォーカスが当たっている状態で Enter キーを押すと、メインコンテンツにフォーカスを移す
- フォーカスが外れたら再び非表示にする

### スキップリンクを設置する

まずはスキップリンクを単純に設置しましょう。ナビゲーションの一番最初に次のように設置します。ページの一番最初にある要素には一番最初にフォーカスが当たります。

```diff
 <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
   <div class="container-fluid">
+    <button type="button" id="skip-button" class="btn btn-light">スキップ</button>
     <a class="navbar-brand" href="#">Fixed navbar</a>
     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
       aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
       <span class="navbar-toggler-icon"></span>
     </button>
```

### CSS でスタイルを調整する

このままだとスキップリンクが常に表示されてしまうので CSS でスタイルを調整します。

スキップリンクは浮かせて表示させるので、 `z-index` を高めに設定しておきましょう。

```css
#skip-button {
  z-index: 50;
}
```

次に通じウハ要素を非表示にして、フォーカスが当たっときのみ要素が表示されるようにしましょう。このような場合にモーダルの表示非表示のように通常時は `display: none` を設定しておき フォーカスが当たった時(擬似クラス `:focus` が適用されているとき) `display: block` を設定する方法が最初に思いつきますが、これはうまくいきません。`display: none` が適用されている要素は Tab キーでフォーカスを当てることができません。

```css
#skip-button {
  display: none;
  z-index: 50;
}

#skip-button:focus {
  display: block;
}
```

![example1](//images.contentful.com/in6v9lxmm5c8/27wRW0dC3UAts51vM2V2js/fb0ca7e1f8cd7364a9db282a6cc54da8/example1.gif)

代わりに、次のように `display` は変更しないまま、通常時は画面外へ追い払ってやりましょう。フォーカスが当たった時に元に戻します。

```css
#skip-button {
  position: absolute;
  top: -1000px;
  left: -1000px;
  z-index: 50;
}

#skip-button:focus {
  top: auto;
  left: auto;
}
```

見た目はいい感じになりました。

![example2](//images.contentful.com/in6v9lxmm5c8/1GYhdUIyowdQ2QaORU4q5e/dc3b842c14db3446bc49b92381b6a521/example2.gif)

### JavaScript で Enter キーが押された時メインコンテンツにフォーカスが移るようにする

見た目はいい感じにできたので Enter キーを押した時メインコンテンツへフォーカスが移るようにするしましょう。

まず スキップリンク要素を取得して `onKeyDown` イベントを購読します。押されたキーが Enter キーだった場合にのみ処理が行われるようにします。

```js
const skipButton = document.getElementById('skip-button')

skipButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    // メインコンテンツへフォーカスする
  }
})
```

メインコンテンツへフォーカスが当たるようにするには、メインコンテンツ要素を取得して [focus()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) メソッドを呼び出せばよいです。

```js
const skipButton = document.getElementById('skip-button')
const main = document.getElementById('main')

skipButton.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    main.focus()
  }
})
```

これでうまくいくはずです、それでは試してみましょう。

![example3](//images.contentful.com/in6v9lxmm5c8/2HMPGXbKK9jlosz2qwIKqJ/74d91b56d492ab584a427b83a9c51724/example3.gif)

最終家のコードは以下のようになります。

```html
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Fixed top navbar example · Bootstrap v5.1</title>

  <!-- Bootstrap core CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"
    crossorigin="anonymous"></script>

  <!-- Custom styles for this template -->
  <link href="https://getbootstrap.com/docs/5.1/examples/navbar-fixed/navbar-top-fixed.css" rel="stylesheet">

  <style>
    #skip-button {
      position: absolute;
      top: -1000px;
      left: -1000px;
      z-index: 50;
    }

    #skip-button:focus {
      top: auto;
      left: auto;
    }
  </style>
</head>

<body>

  <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div class="container-fluid">
      <button type="button" class="btn btn-light" id="skip-button">スキップ</button>
      <a class="navbar-brand" href="#">Fixed navbar</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
        aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Blog</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Contact</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
          <button class="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>

  <main class="container">
    <div class="bg-light p-5 rounded">
      <h1>Navbar example</h1>
      <button id="main" class="btn btn-lg btn-primary">Click here!</button>
    </div>
  </main>
</body>

<script>
  const skipButton = document.getElementById('skip-button')
  const main = document.getElementById('main')

  skipButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      main.focus()
    }
  })
</script>

</html>
````

## 参考

- [スキップリンク](https://weba11y.jp/glossary/sa/skip-link/)
- [ブロックスキップを考える](https://accessible-usable.net/2018/03/entry_180302.html)

