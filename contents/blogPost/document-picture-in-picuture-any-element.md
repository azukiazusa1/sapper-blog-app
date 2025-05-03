---
id: _ibmir7nkzoWhK7Z8aq2d
title: "Document Picture in Picture で任意の要素を Picture in Picture する"
slug: "document-picture-in-picuture-any-element"
about: "Document Picture-in-Picture は、`<video>` 要素に限らず任意の要素を PiP できるようにする提案です。これにより、動画以外の要素を PiP できるようになります。主なユースケースとして、カスタムのメディア・コントロールを使用したり、プレイリストとともに動画を PiP することが挙げられます。"
createdAt: "2023-07-16T14:38+09:00"
updatedAt: "2023-07-16T14:38+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/516xpMCy886VKyeH8rqNNS/801ec7599d233d7f6e0aeb32442c7c3b/cute_frog_melody_11441.png"
  title: "雨の中歌っているかわいいカエルのイラスト"
audio: null
selfAssessment: null
published: true
---
Picture-in-Picture（PiP）とは、動画を別ウィンドウで表示する機能です。PiP により別ウィンドウに表示される動画は常に最前面に表示されるため、例えば動画を見ながら他の作業をするのに便利です。PiP は現在 `<video>` 要素のみに有効です。そのためメディア・コントロール（再生・停止）や字幕を使用する場合には `<video>` 要素により提供されているものを使用しなければいけないという制約があります。

Document Picture-in-Picture は、`<video>` 要素に限らず任意の要素を PiP できるようにする提案です。これにより、動画以外の要素を PiP できるようになります。主なユースケースとして、カスタムのメディア・コントロールを使用したり、プレイリストとともに動画を PiP することが挙げられます。

他にも Google Meet の Picture-in-Picuture ではビデオだけでなく Picture-in-Picture のウィンドウで挙手やミーティングチャットが利用できるようになっています。

[Googleが「Google Meet」のピクチャーインピクチャー機能を強化](https://forest.watch.impress.co.jp/docs/news/1507533.html)

## 使い方

まずは最も簡単な使い方を見てみましょう。2023 年 7 月 16 日現在、Document Picture-in-Picture は Google Chrome の origin trial で提供されています。ローカル環境で実験したい場合には、`chrome://flags/#document-picture-in-picture-api` を有効にすることで Document Picture-in-Picture を使用できます。

![Google Chrome の設定画面 Document-Picuture-in-Picture が Enabled になっている](https://images.ctfassets.net/in6v9lxmm5c8/4VMy4RXc16Nlm8ER5jDGx9/3c8d2a887600b84b8615f86e1bfc6e7b/____________________________2023-07-16_15.00.53.png)

以下のようなコードで任意の要素を PiP できます。

```html

<button id="pip-button">
  PiP
</button>

<div id="content">
  この要素が PiP されます。
</div>

<script>
  const pipButton = document.getElementById('pip-button')
  pipButton.addEventListener('click', async () => {
    const content = document.getElementById('content')

    // Picture-in-Picture Window を開く
    const pipWindow = await documentPictureInPicture.requestWindow();

    // 任意の要素を Picture-in-Picture Window に追加する
    pipWindow.document.body.append(content);
  });
</script>
```

`documentPictureInPicture.requestWindow()` を呼び出すことで Picture-in-Picture のウインドウを開きます。`documentPictureInPicture.requestWindow()` はボタンクリックなどユーザーの操作以外の方法で呼び出された場合は reject されます。

Picture-in-Picture のウインドウを開いただけではまだ何も表示されていません。`pipWindow.document.body.append(content)` で任意の要素追加することで、Picture-in-Picture のウインドウに任意の要素を表示できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/43zTIXUk0Y0eqhBv5aG39I/80bf50a00fe62220751e5a67497a2bc9/_____________2023-07-16_15.20.12.mov" controls></video>

### `documentPictureInPicture.requestWindow()`

`documentPictureInPicture.requestWindow()` には以下のオプションを指定できます。

- `width`：Picture-in-Picture のウインドウの幅の初期値
- `height`：Picture-in-Picture のウインドウの高さの初期値

!> 古いバージョンの仕様では `copyStyleSheets` というオプションがありましたが、現在は削除されています。[Remove copyStyleSheets](https://github.com/WICG/document-picture-in-picture/pull/79)

```js

### `documentPictureInPicture.onenter`

`documentPictureInPicture.onenter` は Picture-in-Picture の ウインドウ が開かれたときに呼び出されるコールバック関数です。

```js
documentPictureInPicture.onenter = () => {
  console.log('Picture-in-Picture の ウインドウ が開かれました。')
}
```

### Picture-in-Picture が閉じられたときに要素をもとに戻す

Picture-in-Picture のウィンドウが閉じられたとき、Picture-in-Picture のウィンドウに `append` された要素が自動的にもとの場所に戻りません。そのため、Picture-in-Picture のウィンドウが閉じられたイベントを購読して、`append` した要素をもとの場所に戻す必要があります。

`"pagehide"` イベントを購読することで、Picture-in-Picture のウィンドウが閉じられたときにコールバック関数を呼び出すことができます。

```html
<button id="pip-button">
  PiP
</button>

<div id="container">
  <div id="content">
    この要素が PiP されます。
  </div>  
</div>

<script>
  const pipButton = document.getElementById('pip-button')
  pipButton.addEventListener('click', async () => {
    const content = document.getElementById('content')

    const pipWindow = await documentPictureInPicture.requestWindow();
    pipWindow.document.body.append(content);

    // Picture-in-Picture のウィンドウが閉じられたときに呼び出されるコールバック関数
    pipWindow.addEventListener("pagehide", (event) => {
      console.log("PiP window closed.")
      const container = document.getElementById("container");
      // Picture-in-Picture のウィンドウ内の要素を取得する
      const pipContent = event.target.getElementById("content");
      // Picture-in-Picture のウィンドウ内の要素をもとの場所に戻す
      container.append(pipContent);
    });
  });
</script>
```

## 使用例（カスタムの再生ボタン）

```html
<button id="pip-button">
  PiP
</button>

<div id="container">
  <video 
    id="player"
    controls
    src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"
    width="640"
    height="360"
  >
  </div>  
</div>

<script>
  const pipButton = document.getElementById('pip-button')
  // ユーザーがボタンクリックしたときに Picture-in-Picture のウィンドウ を開く
  pipButton.addEventListener('click', async () => {
    // Picture-in-Picture させたい要素を取得
    const player = document.getElementById('player')
    // Picture-in-Picture ではメディア・コントロールを使用しないため、コントロールを非表示にする
    player.controls = false;

    // Picture-in-Picture Window を開く
    // ウィンドウを開くときに width と heigth のサイズを合わせる
    const pipWindow = await documentPictureInPicture.requestWindow({
      width: player.width,
      height: player.height,
    });
    // Picture-in-Picture のウィンドウ に要素を追加する
    pipWindow.document.body.append(player);

    // Picture-in-Picture のウィンドウ 内の video 要素を取得する
    const video = pipWindow.document.querySelector("video");
    // 再生ボタンを作成する
    const playButton = pipWindow.document.createElement("button");
    playButton.textContent = "Play";

    // 再生ボタンをクリックしたときに再生・停止を切り替える
    playButton.addEventListener("click", () => {
      if (video.paused) {
        video.play();
        playButton.textContent = "Pause";
      } else {
        video.pause();
        playButton.textContent = "Play";
      }
    });
    // 再生ボタンを Picture-in-Picture のウィンドウ に追加する
    pipWindow.document.body.append(playButton);

    // Picture-in-Picture のウィンドウ内ののスタイルを設定する
    const style = pipWindow.document.createElement("style");
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
      }
      video {
        width: 100%;
        height: 100%;
      }
      button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
    pipWindow.document.head.append(style);

    // Picture-in-Picture のウィンドウが閉じられたときに呼び出されるコールバック関数
    pipWindow.addEventListener("pagehide", (event) => {
      const container = document.getElementById("container");
      const player = event.target.getElementById("player");
      // 元のウィンドではコントロールを表示する
      player.controls = true;
      container.append(player);
    });
  });
</script>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2tMk2ZQrwMJyzpJ6kHQSyG/be603c42e56089efe43062b17394f06c/_____________2023-07-16_16.33.01.mov" controls></video>

## 参考

- [Picture-in-Picture for any Element, not just video - Chrome Developers](https://developer.chrome.com/docs/web-platform/document-picture-in-picture/)
- [document-pip-explainer/explainer.md at main · steimelchrome/document-pip-explainer · GitHub](https://github.com/steimelchrome/document-pip-explainer/blob/main/explainer.md)
