---
id: zwmjrPROpFwJa7mZlLxNG
title: "Go でデスクトップアプリを作る MyGo を試してみた"
slug: "mygo-desktop-app"
about: "MyGo は Go でデスクトップアプリを作るフレームワークです。OS の WebView に Web の画面を表示し、Go のメソッドから生成した TypeScript クライアントでネイティブ機能を呼び出せます。この記事ではテキストをファイルに保存するメモアプリを作り、macOS で起動・保存・ビルドを試します。"
createdAt: "2026-10-05T09:49+09:00"
updatedAt: "2026-10-05T15:00+09:00"
tags: ["Go", "MyGo"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4JDmy7Xa0pEx7L278fs9P/c3a2fa31cb690ac7b10a8f5bc0871c4f/drum_19501-768x591.png"
  title: "ドラム演奏のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Go の Save(ctx context.Context, text string) (string, error) に対して、生成される TypeScript の関数はどれですか？"
      answers:
        - text: "Save(ctx: Context, text: string): string"
          correct: false
          explanation: "context.Context は MyGo が渡し、TypeScript の関数は小文字始まりで Promise を返します。"
        - text: "save(text: string): string"
          correct: false
          explanation: "Go の戻り値は文字列ですが、TypeScript 側の呼び出しは非同期で Promise<string> を返します。"
        - text: "save(text: string): Promise<string>"
          correct: true
          explanation: "context.Context は TypeScript 側の引数に含まれず、保存先の文字列を Promise として受け取ります。"
        - text: "save(text: string): Promise<[string, Error]>"
          correct: false
          explanation: "Go の error は戻り値の配列になりません。エラー時は Promise が reject されます。"
    - question: "メモアプリで mygo.Dialog.Save が空文字列を返すのはどのような場合ですか？"
      answers:
        - text: "保存先のファイルが存在しない場合"
          correct: false
          explanation: "保存先のファイルが存在しなくても、ユーザーが保存ダイアログでキャンセルしなければ空文字列は返りません。"
        - text: "保存先のファイルが読み取り専用の場合"
          correct: false
          explanation: "保存先のファイルが読み取り専用でも、ユーザーが保存ダイアログでキャンセルしなければ空文字列は返りません。"
        - text: "ユーザーが保存ダイアログでキャンセルした場合"
          correct: true
          explanation: "mygo.Dialog.Save は、ユーザーが保存ダイアログでキャンセルした場合に空文字列を返します。"
        - text: "Go の Save メソッドで os.WriteFile が失敗した場合"
          correct: false
          explanation: "os.WriteFile が失敗した場合は、Go の Save メソッドはエラーを返します。空文字列は返りません。"
published: true
---


[MyGo](https://mygo.egoist.dev/) は Go でデスクトップアプリを作るフレームワークです。ウィンドウに表示する画面として Web フロントエンド方式と Native UI 方式の 2 つを用意しています。Web フロントエンド方式では画面には HTML・CSS・JavaScript を使い、ファイルへの書き込みなどの処理を Go で実装できます。Go 側のメソッドを呼び出す TypeScript クライアントが生成されるため、フロントエンドとバックエンドの連携で『迷子』にならずに済みます。

この記事では MyGo の Web フロントエンド方式を使って、入力したテキストをファイルに保存するメモアプリを作成します。プロジェクトの作成から、Go と TypeScript の連携、macOS の保存ダイアログ、ビルドしたアプリの起動までを試してみましょう。

## MyGo の画面と Go のつながり

MyGo はウィンドウに表示する画面として、次の 2 つの方式を用意しています。

- Web フロントエンド：OS の WebView に HTML・CSS・JavaScript を表示する
- Native UI：Go の `ui` パッケージを使って画面を記述し、MyGo が描画する

WebView は、アプリの中に Web ページを表示するための仕組みです。今回は Web フロントエンド方式を使います。Native UI 方式では画面も Go で書くため、TypeScript との連携は不要です。詳しくは [Native UI のドキュメント](https://github.com/egoist/mygo/blob/v0.2.7/docs/ui/README.md)を参照してください。

Web フロントエンド方式では、ブラウザエンジンをアプリに同梱せず、OS ごとの WebView を利用します。

| OS | WebView | 実行環境の主な前提 |
| --- | --- | --- |
| macOS | WKWebView | macOS 12 以降 |
| Windows | WebView2 | Windows 10・11。WebView2 Runtime が必要で、Windows 11 には含まれる |
| Linux | WebKitGTK | GTK 3 と WebKitGTK 4.1 または 4.0 |

[アーキテクチャの説明](https://github.com/egoist/mygo/blob/v0.2.7/docs/architecture.md#goals-and-constraints)では、オーバーヘッドを抑えることと、cgo を不要にすることが設計目標として挙げられています。cgo は Go から C のコードを利用するための仕組みです。MyGo は macOS と Linux では `purego` などを通じてネイティブ API を実行時に呼び出すため、C のコンパイラを使わずに Go のプログラムをビルドできます。Windows では `syscall` と COM を通じて Win32 API と WebView2 を呼び出します。

Web の画面から Go の処理を呼ぶときには、IPC（Inter-Process Communication、プロセス間通信）を利用します。MyGo に Go の値を登録すると、その公開メソッドに対応する TypeScript の関数が生成されます。画面から呼ぶ関数には引数と戻り値の型が付きますが、TypeScript と Go の間で受け渡す引数や戻り値は JSON に変換されます。そのため引数と戻り値には JSON に変換できる型しか使えず、変換できない型を使うと `Bind` が panic します。

今回のメモアプリでは、次のように役割を分けます。

1. HTML の `textarea` でメモを入力する
2. TypeScript から Go の保存メソッドを呼び出す
3. Go で OS の保存ダイアログを開き、選ばれたファイルに書き込む
4. 保存先のパスを TypeScript に返し、画面に結果を表示する

## プロジェクトを作成する

[Getting started](https://github.com/egoist/mygo/blob/v0.2.7/docs/getting-started.md) に沿って、Go と Bun を用意します。Go 1.27 以降が必要です。Bun は Web フロントエンドを使用する場合にのみ必要です。

```sh
go version
bun --version
```

次のコマンドでプロジェクトを作成します。`-name` はウィンドウやアプリの表示名、最後の引数は作成するディレクトリ名です。

```sh
go run github.com/egoist/mygo/cmd/mygo@v0.2.7 init -name "MyGo Memo" mygo-memo
cd mygo-memo
```

標準のテンプレートでは、Go のモジュールと Vite を使った TypeScript のフロントエンドが生成されます。Bun がインストールされていれば、フロントエンドの依存関係もインストールされます。

主に編集するファイルは次のとおりです。

```text
mygo-memo/
├── main.go          # ウィンドウと Go の処理
├── go.mod
├── mygo.config.ts   # アプリ名や起動・ビルドの設定
├── index.html
├── src/
│   ├── main.ts      # 画面のイベント処理
│   ├── style.css
│   └── mygo.ts      # Go から生成されるクライアント
├── package.json
└── vite.config.ts
```

環境のチェックには `mygo doctor` を使用できます。

```sh
bunx --no-install mygo doctor
```

## 最初のウィンドウを開く

まずは生成されたアプリを起動してみましょう。

```sh
bun run dev
```

このコマンドは `mygo dev` を実行し、Vite の開発サーバーと Go のアプリを起動します。

ウィンドウを開く処理は、`main.go` の次の部分です。

```go:main.go
mygo.App.WhenReady(func() {
	mygo.NewWindow(mygo.WindowOptions{
		Title:  "MyGo Memo",
		Width:  640,
		Height: 480,
		URL:    "/",
	})
})
if err := mygo.App.Run(); err != nil {
	log.Fatal(err)
}
```

`App.WhenReady` には、アプリの準備が整ったときに実行する関数を登録します。`App.Run` がイベントループを開始し、`NewWindow` がウィンドウを作成します。

`URL: "/"` がどこを指すかは、開発時とビルド後で異なります。開発時は `mygo.config.ts` の `devUrl` を基準に解決され、今回の設定では `http://localhost:5173/` を読み込みます。ビルド後はアプリに埋め込まれたファイルを読み込みます。[フロントエンドのドキュメント](https://github.com/egoist/mygo/blob/v0.2.7/docs/frontend.md#how-pages-load)に、この切り替えが説明されています。

```ts:mygo.config.ts
import { defineConfig } from "mygo-cli";

export default defineConfig({
  name: "MyGo Memo",
  identifier: "com.example.mygomemo",
  version: "0.1.0",
  devUrl: "http://localhost:5173",
  devCommand: "bun run dev:web",
  buildCommand: "bun run build:web",
  frontendDist: "dist",
  bindings: "src/mygo.ts",
  out: "build",
});
```

`devCommand` は開発サーバーを起動するコマンド、`buildCommand` はフロントエンドをビルドするコマンドです。`frontendDist` にはビルドしたファイルの出力先を指定します。Go のコードを変更すると MyGo がアプリを再ビルドして再起動し、画面側の変更は Vite が反映します。

## Go でメモの保存処理を書く

続いて、Go 側に保存処理を実装します。`main.go` を次の内容に置き換えます。

```go:main.go
package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/egoist/mygo"
)

type Memo struct{}

// 保存ダイアログを開き、テキストを書き込む。キャンセル時は空文字列を返す。
func (Memo) Save(ctx context.Context, text string) (string, error) {
	path, err := mygo.Dialog.Save(mygo.SaveDialogOptions{
		Parent:      mygo.CallerWindow(ctx),
		DefaultPath: "memo.txt",
	})
	if err != nil || path == "" {
		return "", err
	}
	if err := os.WriteFile(path, []byte(text), 0o600); err != nil {
		return "", fmt.Errorf("メモを保存できませんでした: %w", err)
	}
	return path, nil
}

// 既存のアプリの起動とウィンドウの作成
func main() {
	// Memo の公開メソッドを TypeScript から呼べるように登録する
	mygo.Bind(Memo{})
	mygo.App.WhenReady(func() {
		mygo.NewWindow(mygo.WindowOptions{
			Title:  "MyGo Memo",
			Width:  640,
			Height: 480,
			URL:    "/",
		})
	})
	if err := mygo.App.Run(); err != nil {
		log.Fatal(err)
	}
}
```

`Memo` は保存機能をまとめる空の構造体です。`func (Memo) Save(...)` は `Memo` 型のメソッドを定義しています。Go では名前が大文字で始まる `Save` が公開メソッドになります。

`mygo.Bind(Memo{})` で値を登録すると、その公開メソッドをフロントエンドから呼び出せるようになります。登録は `App.Run` より前に行います。

### 保存ダイアログとキャンセル

`mygo.Dialog.Save` は OS の保存ダイアログを開き、選択されたパスを返します。`DefaultPath` は最初に表示するファイル名です。`Parent` に `mygo.CallerWindow(ctx)` を渡すと、呼び出し元のウィンドウにダイアログを紐付けられます。macOS ではウィンドウに付属するシートとして表示されました。

先頭の `context.Context` は MyGo が渡す引数です。ここでは呼び出し元のウィンドウを取得するために使っています。この引数を TypeScript 側から渡す必要はありません。

```go
path, err := mygo.Dialog.Save(mygo.SaveDialogOptions{
	Parent:      mygo.CallerWindow(ctx),
	DefaultPath: "memo.txt",
})
```

保存ダイアログでキャンセルした場合は空文字列が返ります。空のパスに書き込まないよう、`path == ""` ならそのまま戻ります。選択したパスへの書き込みは `os.WriteFile` で行います。

```go
if err != nil || path == "" {
	return "", err
}
if err := os.WriteFile(path, []byte(text), 0o600); err != nil {
	return "", fmt.Errorf("メモを保存できませんでした: %w", err)
}
```

`0o600` は新しく作るファイルのアクセス権で、macOS では所有者だけが読み書きできる設定です。既存ファイルを指定した場合、`os.WriteFile` は内容を上書きします。

### TypeScript のクライアントを確認する

`mygo dev` は Go の変更時に、`src/mygo.ts` を生成し直します。開発アプリを止めている場合は、次のコマンドで生成できます。

```sh
bun run generate
```

今回の `Save` に対して、次のようなコードが生成されました。コメントを省略して示します。

```ts:src/mygo.ts
import { call } from "mygo-runtime";

export const Memo = {
  save(text: string): Promise<string> {
    return call("Memo.Save", text);
  },
} as const;
```

Go の `Save(ctx, text)` が、TypeScript では `save(text)` になっています。メソッド名は先頭が小文字になり、戻り値は非同期処理を表す `Promise<string>` になります。Go 側が `error` を返した場合は Promise が reject されるため、呼び出し側で `try` / `catch` を使って扱えます。

reject されるエラーは `mygo-runtime` の `CallError` です。`CallError` は `Error` を継承したクラスで、`message` には Go のエラーの文字列が、`method` には失敗したメソッド名（今回は `"Memo.Save"`）が入ります。Go 側のエラーかどうかは `isCallError` で判定できます。

```ts
import { isCallError } from "mygo-runtime";

try {
  await Memo.save(text);
} catch (error) {
  if (isCallError(error)) {
    // 例: "メモを保存できませんでした: open /path/to/memo.txt: permission denied"
    console.error(error.method, error.message);
  } else {
    throw error;
  }
}
```

## メモを入力する画面を作る

HTML には入力欄と保存ボタン、処理結果を表示する領域を用意します。`index.html` を次の内容に置き換えましょう。

```html:index.html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyGo Memo</title>
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <main>
      <h1>MyGo Memo</h1>
      <form id="memo-form">
        <label for="memo">メモ</label>
        <textarea id="memo" rows="8"></textarea>
        <button id="save" type="submit">名前を付けて保存</button>
      </form>
      <p id="status" role="status"></p>
    </main>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

次に `src/main.ts` でフォームの送信を処理します。

```ts:src/main.ts
import { Memo } from "./mygo";

const form = document.querySelector<HTMLFormElement>("#memo-form")!;
const memo = document.querySelector<HTMLTextAreaElement>("#memo")!;
const save = document.querySelector<HTMLButtonElement>("#save")!;
const status = document.querySelector<HTMLParagraphElement>("#status")!;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  save.disabled = true;
  status.textContent = "保存先を選んでください。";

  try {
    const path = await Memo.save(memo.value);
    status.textContent = path ? `保存しました: ${path}` : "保存をキャンセルしました。";
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error);
  } finally {
    save.disabled = false;
  }
});
```

フォームが送信された時に Go の保存処理である `Memo.save(memo.value)` を呼び出します。`await` で保存処理が完了するまで待ち、成功・キャンセル・エラーのいずれかに応じて画面に結果を表示します。

最後に `src/style.css` を置き換え、入力欄とボタンを縦に並べます。

```css:src/style.css
:root {
  font-family: system-ui, sans-serif;
  color-scheme: light dark;
}
body { margin: 24px; }
main { max-width: 640px; margin-inline: auto; }
form { display: grid; gap: 12px; }
textarea, button { font: inherit; padding: 8px; }
textarea { resize: vertical; }
button { justify-self: start; }
#status { overflow-wrap: anywhere; }
```

アプリでメモを入力すると、次のような画面になります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1B4YEsxlIYW8pUlimJYLFT/266cfa526d19cd86f74aafd876bf9e8f/mygo-desktop-app-1.png)

「名前を付けて保存」を押すと、Go の処理を経由して macOS の保存ダイアログが開きます。以下ではファイル名と保存先を選べることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6ysGqqpmIXzuAG2JleJo5e/ce28726b7dea0168886bfd205993f8f8/mygo-desktop-app-2.png)

実際に指定したパスに `memo.txt` が作成され、入力した日本語のメモが保存されることが確認できました。

## アプリをビルドする

動作を確認できたら、アプリをビルドしてみましょう。

```sh
bun run build
```

`mygo build` は TypeScript クライアントを生成し、`buildCommand` を実行します。今回のテンプレートでは TypeScript の型検査と Vite のビルドが行われます。その後、フロントエンドのファイルを Go の実行ファイルに埋め込み、macOS のアプリにまとめます。

今回の環境では、次のファイルが生成されました。

```text
build/darwin-arm64/
├── MyGo Memo.app
└── MyGo Memo 0.1.0.dmg
```

開発アプリを終了してから、作成された `.app` を起動します。macOS では次のコマンドでも開けます。

```sh
open "build/darwin-arm64/MyGo Memo.app"
```

ビルドしたアプリは `mygo://localhost/` から埋め込まれた画面を読み込んでいます。

:::note
macOS のビルドは、Developer ID を指定しない場合にはアドホック署名を使用します。今回確認したのは手元の Mac での起動です。他のユーザーへ配布するための Developer ID による署名と公証は別途必要になります。詳細は [Building and distributing](https://github.com/egoist/mygo/blob/v0.2.7/docs/distribution.md) を参照してください。
:::

## まとめ

- MyGo は Go でデスクトップアプリを作るフレームワークで、Web フロントエンドと Native UI の 2 つの方式を用意している
- `mygo.Bind` に登録した Go の公開メソッドから TypeScript クライアントが生成され、フロントエンドから型付きの非同期関数として呼び出せる
- `mygo.Dialog.Save` で保存先を選び、Go の `os.WriteFile` で日本語のメモを保存できた
- `mygo build` でフロントエンドを埋め込んだアプリを生成できる

## 参考

- [MyGo](https://mygo.egoist.dev/)
- [egoist/mygo](https://github.com/egoist/mygo)
- [Getting started](https://github.com/egoist/mygo/blob/v0.2.7/docs/getting-started.md)
- [Calling Go from the frontend](https://github.com/egoist/mygo/blob/v0.2.7/docs/bindings.md)
- [Desktop APIs](https://github.com/egoist/mygo/blob/v0.2.7/docs/native.md)
- [The frontend](https://github.com/egoist/mygo/blob/v0.2.7/docs/frontend.md)
- [Building and distributing](https://github.com/egoist/mygo/blob/v0.2.7/docs/distribution.md)
- [MyGo architecture](https://github.com/egoist/mygo/blob/v0.2.7/docs/architecture.md)
