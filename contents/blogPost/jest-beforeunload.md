---
id: 5IKf4XU2ELx5O4JlSl9SH9
title: "Jest で beforeunload イベントをテストする"
slug: "jest-beforeunload"
about: "beforeunload イベントをテストする方法を紹介します"
createdAt: "2022-09-25T00:00+09:00"
updatedAt: "2022-09-25T00:00+09:00"
tags: ["Jest"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1heYpRmzwajvNTwZ04dXNT/696cb14cdc33a40d080857e416adf5c9/____________________________2022-09-25_12.47.28.png"
  title: "スクリーンショット 2022-09-25 12.47.28"
selfAssessment: null
published: true
---
[beforeunload](https://developer.mozilla.org/ja/docs/Web/API/Window/beforeunload_event) イベントはウインドウがアンロードされる直前に発生します。アンロードとはブラウザのダブを閉じたり、リロードしたときなどが含まれます。イベントハンドラーで `preventDefault()` を呼び出すことにより、以下のような確認ダイアログを表示できます。ユーザーが「キャンセル」をクリックするとページ遷移をキャンセルし、そうでない場合ンはブラウザは新しいページへ遷移します。

![スクリーンショット 2022-09-25 12.47.28](//images.ctfassets.net/in6v9lxmm5c8/3MRL4RPGLnUaaihBqqF5QG/cd3a916d11d0add4790094541c6fefd9/____________________________2022-09-25_12.47.28.png)

`beforeunload` イベントのよくある使い道として、ユーザーがフォームを入力している最中に誤ってブラウザを閉じてしまい、入力内容が消失することを防ぐために使用されます。下記のフォームになにか入力してから更新を試してください。

<iframe src="https://stackblitz.com/edit/react-ts-ef2qbb?embed=1&file=Form.tsx" height="500" width="100%"></iframe>

この例ではフォームが変更された場合（=`isDirty` が `true`）のみ `beforeunload` イベントの `preventDefault()` を呼び出してユーザーがページ遷移するのを防ごうとしています。この仕様をテストしたのですが、どのようにユーザーがアンロードしたことをシミュレーションすればよいのでしょうか？

`beforeunload` イベントのようにユーザーの挙動をシミュレーターするのが難しいイベントは [window.dispatchEvent()](https://developer.mozilla.org/ja/docs/Web/API/EventTarget/dispatchEvent) を使用するとよいでしょう。 `window.dispatchEvent()` [Event](https://developer.mozilla.org/ja/docs/Web/API/Event) オブジェクトを引数に受け取り特定のイベントを実行できます。

ここでは `new Event("beforeunload")` で `beforeunload` イベントを作成して引数に渡すことで呼び出すことができます。

```ts
window.dispatchEvent(new Event('beforeunlaod'));
```

さらに確認ダイアログが表示されるかどうかは `preventDefault()` が呼び出されているかどうかで確認できるので、モック関数を仕込んで渡すこで検査できます。

```ts
// beforeunloadEvent を作成する
const beforeUnloadEvent = new Event("beforeunload");
beforeUnloadEvent.preventDefault = jest.fn();

// フォームになにか入力して確認ダイアログが表示される条件を満たす
render(<Form initialValues={{ name: "" }} />);
const input = screen.getByLabelText("Name");
userEvent.type(input, "John Doe");

// beforeunload イベントをプログラム的に発行する
window.dispatchEvent(beforeUnloadEvent);
// 確認ダイアログを表示するため preventDefault が呼ばれるはず
expect(beforeUnloadEvent.preventDefault).toHaveBeenCalled();
```

全体のコードは次のようになります。

<iframe src="https://stackblitz.com/edit/react-ts-ef2qbb?embed=1&file=Form.spec.tsx" height="500" width="100%"></iframe>
