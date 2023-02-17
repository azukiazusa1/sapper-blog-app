---
title: "Node.js に fetch がやってきた"
about: "Node.js で fetch が使えるようになる"
createdAt: "2022-02-06T00:00+09:00"
updatedAt: "2022-02-06T00:00+09:00"
tags: ["Node.js"]
published: true
---
ブラウザで実行される JavaScript とサーバーサイドで実行される Node.js では提供される API に違いがあります。

例えば DOM を操作する目的で使用する [Document.querySelector()](https://developer.mozilla.org/ja/docs/Web/API/Document/querySelector) は Node.js に存在しないですし、反対にファイルを操作する目的で使用される [fs](https://nodejs.org/api/fs.html) モジュールはブラウザには存在しない API です。

リソースを取得するためのリクエストを実施する [Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API) も同様にブラウザにのみ存在する API でした。

`Document.querySelector()` のようなそもそも DOM の存在しないサーバーの API として提供されていないのわかりやすいですが、いかにも普遍的に使用できそうな `Fetch()` が Node.js の API に存在しないというのは初心者にとってはわかりづらく（確かに `fetch()` はブラウザの提供する API ではなく JavaScript 自体に内包されているグローバル関数に思えてもおかしくはない） stack overflow でも Node.js に `fetch()` が存在しないという質問が多くの票を集めています。

[ReferenceError: fetch is not defined](https://stackoverflow.com/questions/48433783/referenceerror-fetch-is-not-defined)

実用面で見ても現在の実行環境がブラウザかサーバーかを気にせずに実行できる HTTP クライアントが存在していないため [axios](https://github.com/axios/axios) などのサードパーティライブラリをブラウザとサーバーで共通で使用したり、[node-fetch](https://github.com/node-fetch/node-fetch) などのライブラリを利用して Node.js 上で `fetch()` を利用できるようにする必要がありました。

そのような状況の中、ついに Node.js の標準ライブラリとして Fetch API が取り込まることとなりました。内部的には [undici.fetch](https://github.com/nodejs/undici) が使用されており [WHATWG fetch](https://github.com/whatwg/fetch) と互換性があります。

https://github.com/nodejs/node/pull/41749

## fetch() の使いかた

Fetch API を利用するには Node.js のバージョンが 17.5.0 以上であることが必要です。現時点(2022/2/07)ではまだリリースされてないのでまだ使えません🤷‍♂️

また、互換性を保つために Fetch API を利用するには `--experimental-fetch` フラグを付与して実行する必要があります。

```sh
node fetch.js --experimental-fetch
```

Node.js v18 移行では `--experimental-fetch` を付与せずに Fetch API が使用できるようになります。

基本的な使用方法はブラウザの Fetch API と同様に使えます。

```js
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  const data = await response.json();
  return data;
}

fetchUsers().then(data => console.log(data));
```

`fetch()` と同じく以下のインターフェイスも Node.js で利用できるようになります。

- [Headers](https://developer.mozilla.org/en-US/docs/Web/API/Headers)
- [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)

## 終わりに

「ついに Node.js でも `fetch()` が使えるようになったんだ！これでいつでもどこでも `fetch()` が使えるね！」

![banzai kids boy1](//images.ctfassets.net/in6v9lxmm5c8/2ifFc8N2HSP36VufbatYOP/cbebe58495ce8a3ea2fb947f2623a3e5/banzai_kids_boy1.png)

![スクリーンショット 2022-02-06 20.25.49](//images.ctfassets.net/in6v9lxmm5c8/2qAMo4phbaNmmC5cglWY0l/88a4bea57cc0427ed3afbd3e453d6fcc/____________________________2022-02-06_20.25.49.png)
