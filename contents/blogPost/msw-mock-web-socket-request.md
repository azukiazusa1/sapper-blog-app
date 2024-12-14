---
id: pJmkOAegZNrc0aUQYodoQ
title: "MSW で Web Socket のリクエストをモックする"
slug: "msw-mock-web-socket-request"
about: "Mock Service Worker (MSW) の v2.6.0 から Web Socket のリクエストをモックすることができるようになりました。Web Socket のサポートのリクエストは 2020 年から存在しており、多くの議論の末 4 年の歳月を経てリリースされた機能となります。この記事では、MSW で Web Socket のリクエストをモックする方法を紹介します。"
createdAt: "2024-12-14T10:52+09:00"
updatedAt: "2024-12-14T10:52+09:00"
tags: ["msw", "Web Socket"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/Qyc4NqFS6F7FnfaiHhdOE/876e96176aa4d9de5304f283ea5fd4d3/sweet_anmitsu_9823-768x640.png"
  title: "あんみつのイラスト"
selfAssessment:
  quizzes:
    - question: "Web Socket のモックを行うために、クライアントが接続するエンドポイントを指定する関数は何か？"
      answers:
        - text: "ws.connect()"
          correct: false
          explanation: null
        - text: "ws.link()"
          correct: true
          explanation: null
        - text: "ws.on()"
          correct: false
          explanation: null
        - text: "ws.url()"
          correct: false
          explanation: null
    - question: "Web Socket のクローズコード、クローズ理由を指定して接続を閉じる方法として正しいものはどれか？"
      answers:
        - text: "client.close(1000, 'client request')"
          correct: true
          explanation: null
        - text: "client.close({ code: 1000, reason: 'client request' })"
          correct: false
          explanation: null
        - text: "client.close('client request', 1000)"
          correct: false
          explanation: null
        - text: "client.close(1000, { reason: 'client request' })"
          correct: false
          explanation: null
published: true
---
Mock Service Worker (MSW) の v2.6.0 から Web Socket のリクエストをモックできるようになりました。Web Socket のサポートのリクエストは 2020 年から存在しており、多くの議論の末 4 年の歳月を経てリリースされた機能となります。

この記事では、MSW で Web Socket のリクエストをモックする方法を紹介します。

## Web Socket のリクエストをモックする

まずは Web Socket を使ったアプリケーションを作成しましょう。以下のコードは Web Socket を使ってリアルタイムでメッセージを送受信するアプリケーションです。

```tsx:Chat.tsx
import React, { useState, useEffect, useRef } from "react";

export const Chat: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // websocket サーバーの接続を確立する
    ws.current = new WebSocket("ws://localhost:8080");

    // メッセージを受信したときの処理
    ws.current.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    return () => {
      // コンポーネントがアンマウントされたときに websocket サーバーとの接続を閉じる
      ws.current?.close();
    };
  }, []);

  const sendMessage = () => {
    if (!ws.current) {
      return;
    }
    // フォームがサブミットされたときにメッセージを送信する
    ws.current.send(message);
    setMessage("");
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage();
      }}
    >
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button>Send</button>
    </form>
  );
};
```

簡単にコードを説明します。`useEffect` フックでコンポーネントがマウントされたときに [WebSocket](https://developer.mozilla.org/ja/docs/Web/API/WebSocket) インスタンスを作成し、サーバーへの接続を確立します。

`ws.onmessage` はサーバーからメッセージを受信したときに呼び出されるコールバック関数です。受信したメッセージは `messages` 配列に追加され、UI 上のリストに表示されます。

フォームがサブミットされた場合には `sendMessage` 関数が呼び出され、`ws.send` メソッドによりサーバーへメッセージが送信されます。ここで送信されたメッセージはサーバーから全てのクライアントにブロードキャストされ、`ws.onmessage` で受信されます。

このチャットアプリケーションを動かせるようにするために、MSW を使って Web Socket のリクエストをモックしましょう。まずは MSW をインストールします。

```bash
npm install msw
```

続いて、MSW のリクエストハンドラーを作成します。はじめに `ws.link()` 関数を使って MSW がモックする Web Socket サーバーのエンドポイントを指定します。

```ts:handlers.ts
import { ws } from "msw";

const chat = ws.link("ws://localhost:8080");
```

次に、`chat` に対してリクエストハンドラーを設定します。`addEventListener` メソッドを使って、`connection` イベントを監視しログを出力します。

```ts:handlers.ts
export const handlers = [
  chat.addEventListener("connection", () => {
    console.log("A new client connected", "👻");
  }),
];
```

続いて `browser.ts` でリクエストハンドラーを登録します。

```ts:browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

アプリケーションのエントリーポイントで `worker.start()` を呼び出してモックサーバーが起動されるようにします。

```ts:main.tsx {1, 6-7}
import { worker } from './browser.ts'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Chat } from './Chat'

// アプリケーションで実運用する場合には、開発環境のみで `worker.start()` が呼び出されるようにする
worker.start()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Chat />
  </StrictMode>,
)
```

最後に `msw init` コマンドを実行して MSW が利用する Service Worker を登録します。

```bash
npx msw init public
```

!> Web Socket のリクエストのモックでは Service Worker を利用しないため、このコマンドはスキップすることも可能です。Service Worker は HTTP や GraphQL などのリクエストをモックする際に利用されます。

これで Web Socket のリクエストをモックする準備が整いました。アプリケーションを起動し、ブラウザでアクセスすると、コンソールに `A new client connected 👻` というログが出力されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/82SaCUswuVKFWhckDYRwi/a5ed68a681f973a3f6c7863a8fb7d549/__________2024-12-14_11.34.24.png)

フォームを使ってメッセージを送信すると、メッセージが送信されたことを示す「⬆」とともにログが出力されることを確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4vYmFIuPjFw47ABYkJiDaU/f2a942e82d3cea8ee40d1e78aaee8dc4/__________2024-12-14_11.47.06.png)

-> Web Socket のモックは `WebSocket` クラスにパッチを適用することで行われているため、HTTP や GraphQL のモックと異なり DevTools の Network タブにはリクエストが表示されません。そのため MSW ではブラウザ内のモックされた WebSocket 接続と元の WebSocket 接続の両方に対してカスタムログを出力しています。

### クライアントイベントをモックする

ここまでで Web Socket の接続をモックできることを確認しました。続いてクライアントのイベントをモックして、実際にメッセージの送受信を行っているように見えるように処理を実装します。

クライアントのイベントをモックするためには `connection` イベントの引数の `client` オブジェクトを使用します。`client.addEventListener` メソッドで `message` イベントを監視することで、クライアントからのメッセージを受信できます。

#### クライアントにメッセージを送信する

`client.send` メソッドを使って受信したメッセージをそのままクライアントに送信しています。

```ts:handlers.ts {6-10}
import { ws } from "msw";

const chat = ws.link("ws://localhost:8080");

export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    client.addEventListener("message", (event) => {
      console.log("Received message 👻", event.data);
      client.send(event.data);
    });
  }),
];
```

実際にアプリケーションでメッセージを送信してみると、送信したメッセージがそのまま受信されることを確認できます。モックサーバーから受信したメッセージは「⬇」とともにログに出力されます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5AQBskltDUCDBKU9IobyWq/b49f150b358de487fef8b359aeb2627c/_____2024-12-14_12.21.28.mov" controls></video>

#### メッセージをブロードキャストする

`chat.broadcast` メソッドを使って、クライアントから受信したメッセージを全てのクライアントにブロードキャストできます。

```ts:handlers.ts {8}
import { ws } from "msw";

const chat = ws.link("ws://localhost:8080");

export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    client.addEventListener("message", (event) => {
      client.broadcast(event.data);
    });
  }),
];
```

これにより別のクライアントが送信したメッセージも受信できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4yiqV0F91aghAspYE03bQu/2d10526bace5ab86b403b6a503f6eece/_____2024-12-14_12.31.28.mov" controls></video>

`.broadcastExcept` メソッドを使って、特定のクライアントにメッセージを送信しないようにすることも可能です。

```ts:handlers.ts {6-10}
export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    client.addEventListener("message", (event) => {
      // 送信元のクライアントにはメッセージを送信しない
      client.broadcastExcept(client, event.data);
    });
  }),
];
```

#### 接続を閉じる

`client.close` メソッドを使ってクライアントとの接続を閉じることができます。例として「`/close`」というメッセージを受信した場合に接続を閉じるようにしてみましょう。`close()` の 1 番目の引数には[クローズコード](https://developer.mozilla.org/ja/docs/Web/API/CloseEvent/code)、2 番目の引数にはクローズした理由を指定できます。

```ts:handlers.ts {8-11}
import { ws } from "msw";

const chat = ws.link("ws://localhost:8080");

export const handlers = [
  chat.addEventListener("connection", ({ client }) => {
    client.addEventListener("message", (event) => {
      if (event.data === "/close")  {
        client.close(1000, "client request");
        return
      }
      chat.broadcast(event.data);
    });
  }),
];
```

クライアント側のコードを修正して、クライアント側の要求により接続が閉じられた場合にメッセージが閉じられたことを示すメッセージを表示するようにしましょう。`ws.onclose` イベントを監視して、接続が閉じられたときの処理を記述します。

```tsx:Chat.tsx {7, 15-22, 36}
import React, { useState, useEffect, useRef } from "react";

export const Chat: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // websocket サーバーの接続を確立する
    ws.current = new WebSocket("ws://localhost:8080");

    // ...

    // 接続が閉じられたときの処理
    ws.current.onclose = (e) => {
      // クライアントの要求により接続が閉じられた場合
      if (e.code === 1000 && e.reason === "client request") {
        setIsClosed(true);
      }
      // その他の理由で接続が閉じられた場合再接続を試みるべきだがここでは省略
    };

    // ...
  }, []);

  // ...

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage();
      }}
    >
      {isClosed && <p style={{ color: "red" }}>Connection closed</p>}
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button>Send</button>
    </form>
  );
};
```

実際に `/close` というメッセージを送信すると、クライアント側に「Connection closed」というメッセージが表示されることを確認できます。その後は接続が閉じられているため、メッセージの送受信ができなくなります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4AxPO9sVrw6mLn8mr1WnaU/e8bb75f76685bee816787fe925fd2742/_____2024-12-14_12.54.59.mov" controls></video>

### サーバーイベントを確立する

`connection` イベントのコールバック引数の `server` オブジェクトを使うと、`ws.link()` で指定したエンドポイントに対して接続を確立できます。`sever.connect()` メソッドを呼び出す場合には、本物の Web Socket サーバーが起動している必要があります。

```ts:handlers.ts {6, 8}
import { ws } from "msw";

const chat = ws.link("ws://localhost:8080");

export const handlers = [
  chat.addEventListener("connection", ({ client, server }) => {

    server.connect();

    // ...
  }),
];
```

サーバーへ接続が確立されている場合には、すべてのクライアントの送信メッセージがサーバーに送信されます。この動作を防ぐ場合には `event.preventDefault()` を呼び出すことで、クライアントからのメッセージをブロックできます。

その後 `server.send()` メソッドを使用してデータを変更したからサーバーにメッセージを送信できます。

```ts:handlers.ts {5-10}
export const handlers = [
  chat.addEventListener("connection", ({ client, server }) => {
    server.connect();

    client.addEventListener("message", (event) => {
      // サーバーにメッセージが送信されることを防ぐ
      event.preventDefault();

      // データを変更してからサーバーにメッセージを送信
      server.send(event.data + "mocked");

      // ...
    });
  }),
];
```

実際のサーバーからのメッセージを受信するためには `message` イベントを監視します。

```ts:handlers.ts {7-9r}
export const handlers = [
  chat.addEventListener("connection", ({ client, server }) => {
    server.connect();

    // ...

    server.addEventListener("message", (event) => {
      console.log("Received message from server 👻", event.data);
    });
  }),
];
```

デフォルトではすべてのサーバーからのメッセージはクライアントに転送されます。これを防ぐためには `event.preventDefault()` を呼び出します。

```ts:handlers.ts {7-13}
export const handlers = [
  chat.addEventListener("connection", ({ client, server }) => {
    server.connect();

    // ...

    server.addEventListener("message", (event) => {
      // クライアントにメッセージが送信されることを防ぐ
      event.preventDefault();

      // メッセージを変更してからクライアントに送信
      client.send(event.data + "mocked");
    });
  }),
];
```

サーバーへの接続を閉じるためには `server.close()` メソッドを呼び出します。

```ts:handlers.ts {10}
export const handlers = [
  chat.addEventListener("connection", ({ client, server }) => {
    server.connect();

    // ...

    client.addEventListener("message", (event) => {
      if (event.data === "/close") {
        client.close(1000, "client request");
        server.close();
        return;
      }
      server.send(event.data + "mocked");
    });
  }),
];
```

### socket.io バインディング

ハンドラーのコードは標準の WebSocket インターフェースを使って実装されています。ですが、実際の Web Socket サーバーの開発では [socket.io](https://socket.io/) などのライブラリを使用して抽象化されたインターフェイスを使っていることも多いでしょう。

このような場合にバインディングを使用できます。バインディングを使用すると生の WebSocket インターフェースを使っているハンドラーラップしてサードパーティライブラリと同じインターフェイスを使用してモックを作成できます。

`@mswjs/socket.io-binding` パッケージは socket.io のバインディングを提供します。まずはパッケージをインストールします。

```bash
npm install @mswjs/socket.io-binding -D
```

`toSocketIo` 関数を呼び出すことで、socket.io と同じ API を持つハンドラーを作成できます。

```ts:handlers.ts
import { ws } from "msw";
import { toSocketIo } from "@mswjs/socket.io-binding";

const chat = ws.link("ws://localhost:8080");

export const handlers = [
  chat.addEventListener("connection", (connection) => {
    const io = toSocketIo(connection.client);

    io.client.on("message", (message) => {
      io.client.emit("message", message);
    });
  }),
];
```

## まとめ

- MSW v2.6.0 から Web Socket のリクエストをモックできるようになった
- Web Socket のリクエストをモックするには `ws.link()` 関数を使ってエンドポイントを指定し、リクエストハンドラーを設定する
- `connection` イベントを監視することで Web Socket の接続をモックできる
- `client` オブジェクトを使ってクライアントのイベントをモックし、メッセージの送受信を行う
- `server` オブジェクトを使って実際の Web Socket サーバーとの接続を確立し、サーバーからのメッセージを送受信できる
- `@mswjs/socket.io-binding` パッケージを使うことで socket.io と同じ API を持つハンドラーを作成できる

## 参考

- [Handling WebSocket events - Mock Service Worker](https://mswjs.io/docs/basics/handling-websocket-events)
- [Enter WebSockets - Mock Service Worker](https://mswjs.io/blog/enter-websockets)
- [WebSocket Support Beta · mswjs/msw · Discussion #2010](https://github.com/mswjs/msw/discussions/2010)
