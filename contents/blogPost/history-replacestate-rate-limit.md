---
id: k3aBI0wLByTGbkPz66X4e
title: "`history.replaceState()` にはブラウザによって呼び出し回数制限がある"
slug: "history-replacestate-rate-limit"
about: "`history.replaceState()` は、ブラウザの履歴を変更するための API です。使用例としてユーザーのアクションによる UI の状態の変更に合わせて、URL のクエリパラメータを変更することが挙げられます。この API はブラウザにより呼び出し回数に制限が設けられており、使い方を誤ると予期せぬ挙動が発生するおそれがあります。"
createdAt: "2023-10-01T13:11+09:00"
updatedAt: "2023-10-01T13:11+09:00"
tags: [""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1qt8GP6Vy9x7afq87NiRsp/52b7c3a7ac5976e5b3bf66368db39957/sukiyaki_16090.png"
  title: "すき焼き鍋のイラスト"
selfAssessment: null
published: true
---
[history.replaceState()](https://developer.mozilla.org/ja/docs/Web/API/History/replaceState) は、ブラウザの履歴を変更するための API です。使用例としてユーザーのアクションによる UI の状態の変更に合わせて、URL のクエリパラメータを変更することが挙げられます。例えば、検索フォームに入力したキーワードをクエリパラメータに設定することで、検索結果をブックマークしたり、URL を共有したりできるようになります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/J14e0ba32tZ4hrhu75gFG/edd6c54d1bc5687b92b81bae3b676f56/_____2023-10-01_13.25.32.mov" controls></video>

## `history.replaceState()` にはブラウザによって制限がある

`history.replaceState()` は、ブラウザによって制限があることをご存知でしょうか？一定の時間内に `history.replaceState()` 呼び出すことができる回数に制限があるのです。試しに以下のコードを実行してみてください。

```html
<div id="hoge"></div>

<script>
  window.addEventListener("load", function () {
    var query = location.search.replace("?q=", "");
    document.querySelector("#hoge").textContent = query;
  });

  for (var i = 0; i <= 10000; i++) {
    history.replaceState(null, null, `?q=${i}`);
  }
</script>
```

Google Chrome で上記のコードを実行すると、以下のような警告が発生します。

```sh
Throttling navigation to prevent the browser from hanging. See https://crbug.com/1038223. Command line switch --disable-ipc-flooding-protection can be used to bypass the protection
```

ブラウザのハングアップを防ぐために、ナビゲーションをスロットリングしているという警告です。実際にクエリパラメータにはループの最後の値である `10000` ではなく、`199` であることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1h4TgehlyIGLoVKJuUgCO5/3ddc39a2913eaafff3e2fd9bb769f672/__________2023-10-01_13.51.25.png)

現実のアプリケーションにおいても、ブラウザによりスロットリングが実行されることにより、意図しない挙動を起こす可能性があります。例えば、検索フォームに高速にキーワードが入力された場合、フォームに入力された検索キーワードとクエリパラメータが一致しないおそれがあります。

### ブラウザによる制限の違い

`history.replaceState()` の呼び出しの制限はブラウザによって異なります。正確な値ではないものの、Google Chrome、Firefox、Edge ではおおむね 50ms ごとにスロットリングして処理を行えば、ブラウザによる制限を回避できるようです。ただし、Safari ではより厳しい制限があるようです。30s に 100 回の呼び出しに制限されています。

```sh
SecurityError: Attempt to use history.replaceState() more than 100 times per 30 seconds
```

## 解決策

`history.replaceState()` の呼び出しの制限を回避するためには `lodash.throttle` などのスロットリング関数を利用することが考えられます。

```js
<script type="module">
  import { throttle } from "https://cdn.skypack.dev/lodash";
  const throttled = throttle((url) => {
    history.pushState(null, null, url);
  }, 100); // この値は適当

  window.addEventListener("load", function () {
    setTimeout(() => {
      var query = location.search.replace("?q=", "");
      console.log(query);
      document.querySelector("#hoge").textContent = query;
    }, 100); // history.replaceState() の呼び出しが遅れるので、ここでも setTimeout でちょっと待つ必要がある
  });

  const loopCount = 10000;
  for (var i = 0; i <= loopCount; i++) {
    throttled(`?q=${i}`);
  }
</script>
```

## まとめ

- `history.replaceState()` は、ブラウザの履歴を変更するための API
- ブラウザによって `history.replaceState()` の呼び出し回数に制限がある
- `lodash.throttle` などのスロットリング関数を利用することで、ブラウザによる制限を回避できる

## 参考

- [Storing React state in the URL with Next.js | François Best](https://francoisbest.com/posts/2023/storing-react-state-in-the-url-with-nextjs)
