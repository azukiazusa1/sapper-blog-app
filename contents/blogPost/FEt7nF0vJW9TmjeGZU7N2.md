---
id: FEt7nF0vJW9TmjeGZU7N2
title: "Deno で Desktop アプリを作れるようになっていた"
slug: "deno-desktop-app"
about: "Deno v2.9.0 以降で `deno desktop` コマンドが使えるようになりました。`deno desktop` コマンドは単一の TypeScript ファイルから Next.js プロジェクトまで、デスクトップアプリに変換できます。この記事では Deno でデスクトップアプリを作る方法について紹介します。"
createdAt: "2026-06-26T19:53+09:00"
updatedAt: "2026-06-26T19:53+09:00"
tags: ["deno"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/50yV6nEKq4irm2pzjUODHF/084884e81784f30b38ca007585748cab/cute_tyrannosaurus_8183-768x564.png"
  title: "かわいいティラノサウルスのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "deno desktop コマンドが利用できるようになった Deno のバージョンとして、記事で説明されているのはどれですか?"
      answers:
        - text: "Deno v1.9.0 以降"
          correct: false
          explanation: "記事で挙げられているバージョンとは異なります。v1 系ではなく v2 系で導入されました。"
        - text: "Deno v2.9.0 以降"
          correct: true
          explanation: "記事の冒頭およびまとめで述べられている通り、deno desktop は Deno v2.9.0 以降で利用できるようになりました。"
        - text: "Deno v2.0.0 以降"
          correct: false
          explanation: "v2.0.0 は記事で挙げられているバージョンではありません。導入は v2.9.0 です。"
        - text: "Deno v3.9.0 以降"
          correct: false
          explanation: "記事で v3 系には言及されていません。導入バージョンは v2.9.0 です。"
    - question: "WebView 内の HTML から Deno 側の関数を呼び出す仕組みについて、記事の説明に合うものはどれですか?"
      answers:
        - text: "win.bind(\"notify\", ...) で登録し、HTML 側から bindings.notify(...) で呼び出す"
          correct: true
          explanation: "記事の通り、win.bind でバインディングを登録すると、WebView 内の HTML から bindings.notify(...) の形で同一プロセス内の関数を呼び出せます。"
        - text: "win.serve(\"notify\", ...) で登録し、HTML 側から fetch で呼び出す"
          correct: false
          explanation: "関数の登録は win.bind であり、win.serve というメソッドは記事に登場しません。"
        - text: "IPC チャンネルを開いて postMessage 経由でやり取りする"
          correct: false
          explanation: "記事では IPC を使わずプロセス内で呼び出すと説明されています。postMessage 方式ではありません。"
        - text: "Deno.serve() のルーティングに関数を登録して呼び出す"
          correct: false
          explanation: "Deno.serve() は HTML を返す HTTP サーバーの役割で、関数バインディングの登録には win.bind を使います。"

published: true
---

Deno v2.9.0 以降で `deno desktop` コマンドが使えるようになりました。`deno desktop` コマンドは単一の TypeScript ファイルから Next.js プロジェクトまで、デスクトップアプリに変換できます。今までも Web 技術を使用してデスクトップアプリを作るためのフレームワークとして、[Electron](https://www.electronjs.org/) や [Tauri](https://tauri.app/), [Electrobun](https://blackboard.sh/framework/) などがありましたが、それぞれにトレードオフがありました。Electron は Node.js を使用しているため、Node.js のエコシステムを活用できる一方で、アプリのサイズが大きくなりがちです。Tauri はフロントエンドに Web 技術を使える一方で、バックエンドのロジックを Rust で書く必要があるため、Node.js（npm）のサーバーサイドのエコシステムをそのまま活用できません。

`deno desktop` コマンドはデフォルトで軽量で、Node.js との互換性を備えているのが特徴です。デフォルトでは WebView バックエンドを使用しているため、バイナリサイズを小さく抑えつつ、Node.js のエコシステムを活用できます。一方で WebView バックエンドの場合 OS ごとに異なる WebView を使用するため、見た目の違いが出てしまうことがあります。バンドルサイズは増えてしまうものの、Chromium バックエンドを使用することで、OS 間で見た目の違いが出ないようにできます。

IPC (Inter-Process Communication) の代わりにプロセス内バインディングを使用している点も特徴です。Electron や Tauri では、IPC を使用してフロントエンドとバックエンドの間で通信します。IPC はプロセス間通信のため、通信のたびにシリアライズとデシリアライズが必要となり、パフォーマンスに影響を与えることがあります。`deno desktop` コマンドでは、ランタイムとフロントエンドが同じプロセス内で動作するため、シリアライズとデシリアライズのオーバーヘッドがなく、パフォーマンスが向上します。また 1 つのマシンで Windows, macOS, Linux 向けにビルドできるクロスプラットフォーム対応も備えています。

この記事では Deno でデスクトップアプリを作る方法について紹介します。

## はじめての Deno デスクトップアプリ

最も簡単な Deno デスクトップアプリを作ってみましょう。`Deno.serve()` 関数を使用して単純な HTML ページを表示するアプリを作成します。

```ts:main.ts
Deno.serve(() =>
  new Response("<h1>Hello, desktop</h1>", {
    headers: { "content-type": "text/html" },
  })
);
```

Deno のデスクトップアプリでは、`Deno.serve()` 関数を使用してローカル HTTP 経由で HTML を返し、WebView で表示できます。HTTP リクエストを通じて HTML, CSS, JavaScript を返すため 1 ラウンドトリップの通信が必要となりますが、Web アプリと同じコード（`fetch`, `websocket`, `cookie` など）を使用できるという利点からこの方法が採用されています。Deno のランタイムはバイナリが開始されると、ローカルの未使用のポートを自動的に選択して、`http://127.0.0.1:<port>` でリッスンします。リスナーの準備ができると、WebView が自動的に開き、`Deno.serve()` で返された HTML が表示されます。サーバーが外部に公開されることはありません。

`deno desktop` コマンドを使用して、上記の TypeScript ファイルをデスクトップアプリに変換します。

```bash
deno desktop main.ts
```

:::note
プロジェクトルートに `deno.json` ファイルが存在しない場合、見つかるまで親ディレクトリを遡るような挙動をして、最終的にコンパイルに失敗してしまいました。設定はほぼ不要ですが、なにかしら `deno.json` ファイルを作成しておくとよいでしょう。
:::

コンパイルに成功すると、macOS では `deno-desktop-test.app`（`deno-desktop-test` はディレクトリ名）というアプリケーションが作成されます。ダブルクリックでアプリケーションを起動すると、`Hello, desktop` と表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/48FqlRAnCzi8LUty6MhRih/f4fc2ff1a46188773acd0b0c52578cb6/image.png)

`--hmr` オプションを付与することで、アプリケーションを起動したまま、コードの変更を反映させることができます。

```bash
deno desktop --hmr main.ts
```

## Next.js プロジェクトをデスクトップアプリに変換する

`deno desktop` コマンドの引数にディレクトリを指定するとフレームワークが自動で検出され、適切なエントリポイントが選択され、ビルド出力がバイナリに変換されます。フレームワークを使用するためにコードの変更や特別な設定は不要です。Next.js, Astro, Fresh, Remix, Nuxt, SvelteKit, SolidStart, TanStack Start, Vite など主要なフレームワークがサポートされています。

ここでは Next.js を使用して Todo アプリを作成し、デスクトップアプリに変換してみます。まずは Deno で Next.js プロジェクトを作成します。

```bash
deno run -A npm:create-next-app@latest
```

Next.js には CommonJS モジュールに依存したパッケージがいくつかあるため、互換性を持たせるため `deno.json` ファイルに以下を追記する必要があります。

```json:deno.json
{
  "unstable": [
    "detect-cjs",
    "node-globals",
    "unsafe-proto",
    "sloppy-imports"
  ]
}
```

続いて依存関係をインストールします。

```bash
deno install --allow-scripts
```

最も単純な Todo アプリを作成しました。データは `localStorage` に保存されます。

<details>

<summary>app/page.tsx</summary>

```tsx:app/page.tsx
"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

const STORAGE_KEY = "todos";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  // 初回マウント時に localStorage から復元
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // todos が変わるたびに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTodo = (id: number) => {
    const confirmed = confirm("本当に削除しますか？");
    if (!confirmed) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-md px-6 py-16">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Todo
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTodo();
          }}
          className="mb-6 flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="やることを入力…"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button
            type="submit"
            className="rounded-lg bg-foreground px-4 py-2 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            追加
          </button>
        </form>

        <ul className="flex flex-col gap-2">
          {todos.length === 0 && (
            <li className="py-4 text-center text-zinc-500 dark:text-zinc-400">
              タスクはありません
            </li>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                className="h-4 w-4 cursor-pointer"
              />
              <span
                className={`flex-1 text-black dark:text-zinc-50 ${
                  todo.done
                    ? "text-zinc-400 line-through dark:text-zinc-600"
                    : ""
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm text-zinc-400 transition-colors hover:text-red-500"
                aria-label="削除"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
```

</details>

`deno desktop` コマンドを実行する前に、それぞれのフレームワークのビルドコマンドを実行する必要があります。Next.js の場合は以下のコマンドでビルドします。

:::note
Next.js の場合は環境変数 `__NEXT_PRIVATE_CPU_PROFILE` にアクセスするため、`--allow-env` オプションと `--allow-sys` オプションを付与する必要がありました。
:::

```bash
# .next ディレクトリが作成される
npx next build 
deno desktop --allow-env --allow-sys .
```

成果物として `deno-desktop-next.app`（macOS の場合）が作成されました。早速アプリケーションを起動してみましょう。`deno-desktop-next.app` をダブルクリックすると、Todo アプリが表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/Rh9D0mUKym7ZIS76euPes/ff8cb06a87e2d6b68e7ab898549d8605/image.png)

## メニュー

デスクトップアプリのメニューにはアプリケーションメニュー（macOS の場合はメニューバー、Windows の場合はウィンドウ上部のメニュー）とコンテキストメニュー（右クリックで表示されるメニュー）があります。どちらも `Deno.MenuItem` 型を使用しています。

```ts
type MenuItem =
  // クリック可能なメニューアイテム。
  | {
    item: {
      label: string;
      id?: string; // クリック時に返される id
      accelerator?: string; // e.g. "CmdOrCtrl+S", "F11"
      enabled: boolean;
    };
  }
  // ネストされたサブメニュー
  | {
    submenu: {
      label: string;
      items: MenuItem[];
    };
  }
  // 区切り線
  | "separator"
  // OS ごとに異なる役割を持つメニューアイテム。macOS の場合は「サービス」や「ウィンドウ」、Windows の場合は「閉じる」など。
  | { role: { role: string } };

```

アプリケーションメニューは `new Deno.BrowserWindow({ title: "My App" });` で作成したウィンドウの `setApplicationMenu()` メソッドで設定できます。最初の `new Deno.BrowserWindow()` は起動時に開く初期ウィンドウを表し、2 つ目以降のインスタンスは新しいウィンドウを作成します。`setApplicationMenu()` メソッドの引数には `Deno.MenuItem[]` 型の配列を渡せます。以下では、File メニューに New, Open, Save の 3 つのメニューを追加しています。

メニューがクリックされた時のイベントは `menuclick` イベントで受け取ることができます。

```ts:main.ts
const win = new Deno.BrowserWindow({ title: "My App" });

win.setApplicationMenu([
  {
    // macOS の場合最上位のメニューはアプリケーション名が表示され、ラベル名は置き換えられる
    // quit などの標準的な role はここに配置すべき
    submenu: {
      label: "My App",
      items: [
        { role: { role: "about" } },
        {
          item: {
            label: "ラベル名がメニュー項目として表示されます",
            id: "custom-menu-item",
            enabled: true,
          },
        },
        { role: { role: "quit" } },
      ],
    },
  },
  {
    submenu: {
      label: "File",
      items: [
        {
          item: {
            label: "New",
            id: "new",
            accelerator: "CmdOrCtrl+N",
            enabled: true,
          },
        },
        {
          item: {
            label: "Open…",
            id: "open",
            // accelerator はショートカットキーを設定することができる。
            accelerator: "CmdOrCtrl+O",
            enabled: true,
          },
        },
        "separator",
        {
          item: {
            label: "Save",
            id: "save",
            accelerator: "CmdOrCtrl+S",
            enabled: true,
          },
        },
      ],
    },
  },
  {
    submenu: {
      label: "Edit",
      items: [
        { role: { role: "undo" } },
        { role: { role: "redo" } },
        "separator",
        { role: { role: "cut" } },
        { role: { role: "copy" } },
        { role: { role: "paste" } },
      ],
    },
  },
]);

win.addEventListener("menuclick", (e) => {
  switch (e.detail.id) {
    case "new":
      console.log("New menu item clicked");
      break;
    case "open":
      console.log("Open menu item clicked");
      break;
    case "save":
      console.log("Save menu item clicked");
      break;
    default:
      console.log("Unknown menu item clicked");
      break;
  }
});
```

アプリケーションを起動して確認してみましょう。`console.log` の出力を確認するには `--inspect` オプションを付与して起動する必要があります。

```bash
deno desktop --inspect main.ts
```

設定したメニューが表示されていることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/aRwaP2RettxvRvgrBrqIy/2e5f08647ab91641b3ed97b1f60b2df2/image.png)

コンテキストメニューは `win.showContextMenu()` メソッドで表示できます。一般的にコンテキストメニューは右クリックで表示されるため、ウィンドウの `mousedown` イベントで右クリックを検知して表示できます。

```ts:main.ts
const contextMenu: Deno.MenuItem[] = [
  {
    item: {
      label: "Copy",
      id: "copy",
      accelerator: "CmdOrCtrl+C",
      enabled: true,
    },
  },
  {
    item: {
      label: "Paste",
      id: "paste",
      accelerator: "CmdOrCtrl+V",
      enabled: true,
    },
  },
];

win.addEventListener("mousedown", (e) => {
  // e.button は 0 が左クリック、1 が中クリック、2 が右クリックを表す
  if (e.button === 2) {
    // クリックした位置にコンテキストメニューを表示する
    win.showContextMenu(e.clientX, e.clientY, contextMenu);
  }
});

// contextmenu がクリックされた時のイベント
win.addEventListener("contextmenuclick", (e) => {
  if (e.detail.id === "copy") { /* ... */ }
  if (e.detail.id === "paste") { /* ... */ }
});
```

コンテキストメニューは右クリックで表示されることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/Rq0yCCuFeNTliEFuQF6sM/3ad7c5a24e1a1abd2428f7543a1dfd87/image.png)

## 通知

通知はブラウザ標準の Notification API を使用して表示できます。以下ではボタンをクリックすると通知が表示され、通知をクリックするとアプリがフォーカスされるようにしています。Web アプリと同じように、通知が許可されているかどうかの状態を確認できます。

```ts:main.ts
// 画面（webview に表示する HTML）
const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><title>通知デモ</title>
  </head>
  <body>
    <button id="notify">通知を表示</button>
    <script>
      document.getElementById("notify").addEventListener("click", async () => {
        // webview → Deno 側の関数を呼ぶ
        await bindings.notify("こんにちは");
      });
    </script>
  </body>
</html>`;

// 起動時のウィンドウを取得
const win = new Deno.BrowserWindow();

// webview から bindings.notify(...) で呼べる Deno 側の関数を登録
win.bind("notify", async (title) => {
  // title は BrowserWindowValue 型。
  const t = String(title ?? "");

  // 通知の権限を確認。許可されていなければリクエストする
  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
  }

  // New Notification() で通知を表示。クリック時にウィンドウを前面に出す
  const n = new Notification(t);
  n.addEventListener("click", () => win.focus());
});

Deno.serve(
  () => new Response(html, { headers: { "content-type": "text/html" } }),
);
```

WebView 内の HTML から Deno 側の関数を呼び出すためにバインディングを使用しています。`win.bind("notify", ...)` でバインディングを登録すると、WebView 内の HTML から `bindings.notify(...)` で呼び出すことができます。バインディングは IPC を使用せず、同じプロセス内で呼び出されます。これにより、プロセス間の通信が不要になります。

Deno 側で登録した `notify` 関数は Notification API を使用して通知を表示します。ユーザーが通知を許可しているかどうかをまず `Notification.permission` で確認し、許可されていなければ `Notification.requestPermission()` で通知の権限をリクエストします。通知の呼び出しは `new Notification()` で行い、通知がクリックされた時にアプリをフォーカスするために `win.focus()` を呼び出しています。

:::info
macOS の場合デスクトップアプリケーションの通知を許可するには、アプリケーションの安定したバンドル ID が必要です。デフォルトではアドホック署名が使用され、ビルドのたびに ID が変わりうるため安定しませんが、一時的な ID で通知のテストを行う用途では問題ありません。一方でアプリを配布する場合は安定したバンドル ID を設定する必要があります。`--hmr` でホットリロードで起動している場合は、キャッシュされたアドホック署名が再利用されます。
:::

実際にアプリケーションを起動して、通知が表示されることを確認してみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/2dmd1FfodgkffPdwDQqW4w/dd83a04d932e34e8ccbcd29401380cbc/image.png)

## まとめ

- Deno v2.9.0 以降で `deno desktop` コマンドが使用できるようになった
- `deno desktop` コマンドは単一の TypeScript ファイルから Next.js プロジェクトまで、デスクトップアプリに変換できる
- デフォルトでは WebView バックエンドを使用しているため、バイナリサイズを小さく抑えつつ、Node.js のエコシステムを活用できる
- IPC の代わりにプロセス内バインディングを使用しているため、シリアライズとデシリアライズのオーバーヘッドがなく、パフォーマンスが向上する
- 1 つのマシンで Windows, macOS, Linux 向けにビルドできるクロスプラットフォーム対応も備えている
- デスクトップアプリのメニューにはアプリケーションメニューとコンテキストメニューがあり、どちらも `Deno.MenuItem` 型を使用して作成できる
- 通知はブラウザ標準の Notification API を使用して表示する

## 参考

- [Desktop apps | Deno Docs](https://docs.deno.com/runtime/desktop/)
- [Build a Next.js App | Deno Docs](https://docs.deno.com/examples/next_tutorial/)
