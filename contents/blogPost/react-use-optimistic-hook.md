---
id: U8JwFwCD5pgAN-k1FwoBJ
title: "楽観的更新を行うための React の useOptimistic フック"
slug: "react-use-optimistic-hook"
about: "React v19 では楽観的更新を行うための `useOptimistic` フックが導入される予定です。楽観的更新とは、ユーザーの操作に対して非同期処理の完了を待たずに UI を更新する手法のことです。楽観的更新によりユーザーの操作に対して即座にフィードバックを提供できるため、UX の向上につながります。"
createdAt: "2024-05-12T13:43+09:00"
updatedAt: "2024-05-12T13:43+09:00"
tags: ["React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4qmIo0fNFrCSmWKYPGDg2F/437a4accde9eeb74d24a38b4d01b95db/zarigani_11347-768x591.png"
  title: "ザリガニのイラスト"
selfAssessment:
  quizzes:
    - question: "useOptimistic に関する説明として正しいものはどれか？"
      answers:
        - text: "useOptimistic フックは必ず formAction の関数内で状態を更新する必要がある"
          correct: false
          explanation: "useOptimistic フックは状態の更新を `startTransition` でラップして行うことも可能です"
        - text: "useOptimistic フックの 2 つ目の引数の関数は省略することができる"
          correct: true
          explanation: "useOptimistic フックの 2 つ目の引数の関数は省略した場合、新しい状態をそのまま返す関数がデフォルトで使用されます"
        - text: "非同期処理が完了すると、楽観的な state は自動的に現在の state に置き換えられる"
          correct: false
          explanation: "非同期処理が完了した後に setState() を呼び出す、refetch するなどの方法で状態を更新する必要があります"
        - text: "useOptimistic フックの返り値のタプルの 3 番目の要素は非同期処理が実行中かどうかを示す真偽値である"
          correct: false
          explanation: "useOptimistic フックの返り値のタプルは 2 つの要素からなり、現在の state と楽観的な state を返します"
published: true
---
React v19 では楽観的更新を行うための `useOptimistic` フックが導入される予定です。楽観的更新とは、ユーザーの操作に対して非同期処理の完了を待たずに UI を更新する手法のことです。楽観的更新によりユーザーの操作に対して即座にフィードバックを提供できるため、UX の向上につながります。

楽観的更新を使用している例として、X（旧 Twitter）のいいねボタンがあります。いいねボタンをクリックすると、即座にボタンの色が変わり、いいねの数が +1 されます。このタイミングではいいね処理が最終的に成功するかどうかわからないので、この UI の更新はあくまで仮のものです。この処理の背後でサーバーとの通信が行われており、通信が完了したタイミングで最終的な UI が確定されます。元のポストが削除されたなどの理由でいいねが失敗する場合もあるでしょう。このような場合には、ボタンの色を元に戻し、エラーメッセージを表示するなどの処理が行われます。

`useOptimistic` フックは引数として現在の state と楽観的な state を返す関数を受け取ります。フックの返り値として引数として渡した state と楽観的更新を行う際に呼び出す関数が返されます。返り値の state は引数として渡した state のコピーをそのまま返しますが、非同期処理が進行している間だけ異なる state を返すことができます。

```jsx
import { useOptimistic } from "react";
import { likePost } from "./api";

function LikeButton({ likes, isLiked }) {
  const [optimisticState, addOptimistic] = useOptimistic(
    { likes, isLiked },
    // 現在の状態と新しい状態を引数に取る
    (currentState, newState) => {
      // 非同期処理の間に表示する状態を返す
      return newState;
    },
  );
}
```

## `useOptimistic` フックの使用例 - いいねボタンの実装

それでは具体的なコード例を見てみましょ。以下のコードは、いいねボタンをクリックした際にいいねの数を +1 するコンポーネントです。`useOptimistic` フックを使用して、いいねボタンをクリックした際に即座にいいねの数を +1 する処理を実装しています。

```jsx:LikedButton.tsx
import { startTransition, useOptimistic, useState } from "react";
import { likePost } from "./api";

export function LikeButton() {
  const [likes, setIsLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [optimisticState, addOptimistic] = useOptimistic(
    { likes, isLiked },
    (currentState, newState) => {
      return newState;
    }
  );

  const handleClick = () => {
    startTransition(async () => {
      // 楽観的更新を行う
      addOptimistic({
        likes: optimisticState.isLiked
          ? optimisticState.likes - 1
          : optimisticState.likes + 1,
        isLiked: !optimisticState.isLiked,
      });
      // APIリクエストを送信する
      const result = await likePost();
      // APIリクエストが成功した場合のみ真の状態を更新する
      if (result.success) {
        setIsLikes(optimisticState.likes + (optimisticState.isLiked ? -1 : 1));
        setIsLiked(!optimisticState.isLiked);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      style={{
        backgroundColor: optimisticState.isLiked ? "blue" : "black",
      }}
    >
      {optimisticState.likes} 👍
    </button>
  );
}
```

`useState()` で `likes` と `isLiked` の state を管理し、`useOptimistic()` フックの引数として渡しています。いいねボタンがクリックされた場合には、最初に `addOptimistic()` 関数を呼び出して楽観的な更新を行います。ここから `likePost()` 関数の処理が完了するまでの間は `useState()` で定義した状態の代わりに、`addOptimistic()`　に渡した値が表示されます。そして、`likePost()` 関数が完了した後は `useState()` で定義した状態再びが表示されます。

`likePost()` の処理が完了した後も更新された状態を表示するために、`likePost()` の結果が成功した場合には `useState()` で定義した状態を更新します。もし `likePost()` 関数が失敗した場合には状態の更新を行わないので、UI 上は元の状態にフォールバックされたように見えます。

`useOptimistic` フックを使用する場合には [startTransition](https://ja.react.dev/reference/react/startTransition) でラップする、もしくは [Form Action](https://ja.react.dev/reference/react-dom/components/form#usage) の関数内で状態を更新する必要があります。

`startTransition` は UI をブロックせずに状態を更新するための関数です。`startTransition` はコールバック関数を受け取り、その関数内で状態の更新を行います。このコールバック関数内で行われた状態の更新は優先度の低い状態の更新とみなされます。優先度の低い状態の更新は一旦中止されて、後回しにされる可能性があります。

!> このコード例では `startTransition` にわたすコールバック関数は `async` 関数となっていますが、 React v18 までの `startTransition` の型定義上では `Promise` を返す関数は許可されていません。Canary リリース版の型定義では `Promise` を返す関数を渡せるようになります　https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/canary.d.ts#L87 。

実際にコードを実行してみると、いいねボタンをクリックした際に即座にいいねの数が +1 され、ボタンの色が変わることが確認できます。また、リクエストに失敗した際にはボタンの色が元に戻ることも確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/RM6dzd75drBenDeH9h3T4/bdc4e2cee660d582d2be102015b9595b/_____2024-05-12_15.46.09.mov" controls></video>

なお、`useOptimistic` フックの 2 つ目の引数の関数は省略することも可能です。省略した場合には、新しい状態をそのまま返す関数がデフォルトで使用されます。つまり、以下のコードは上記のコードと同じ動作をします。

```jsx
const [optimisticState, addOptimistic] = useOptimistic({ likes, isLiked });
```

## formAction での状態更新

続いて `formAction` での状態更新の例を見てみましょう。フォームの `action` プロパティに関数を渡すことで、フォームが送信された際にその関数が呼びされれます。この関数の引数には [formData](https://developer.mozilla.org/ja/docs/Web/API/FormData) オブジェクトが渡され、フォームのデータを取得できます。

チャットアプリケーションの例を見てみましょう。以下のコードは、チャットメッセージを送信するフォームを実装したコンポーネントです。フォームが送信された際には、フォームのデータを取得してメッセージを送信し、送信したメッセージを即座に表示します。

```jsx:ChatForm.tsx
import { useState, useRef, useOptimistic } from "react";
import { sendMessage } from "./api";

export function ChatForm() {
  const [messages, setMessages] = useState<string[]>([
    "Hello!",
    "How are you?",
  ]);
  const [optimisticState, addOptimistic] = useOptimistic(
    messages,
    (currentState, newState: string) => {
      return [...currentState, newState];
    }
  );
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const formAction = async (formData: FormData) => {
    // フォームデータを取得
    const message = formData.get("message") as string;
    // フォームをリセット
    formRef.current?.reset();

    // 楽観的更新を行う
    addOptimistic(message);

    // APIリクエストを送信する
    const result = await sendMessage(message);

    if (result.success) {
      setMessages([...messages, message]);
      setError(null);
    } else {
      setError("Failed to send message");
    }
  };

  return (
    <form action={formAction} ref={formRef}>
      <ul>
        {optimisticState.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
      <input name="message" />
      <button type="submit">Send</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
```

`formAction` 関数内で楽観的更新を行う場合には `startTransition` でラップする必要はありません。実際にコードを実行してみると、フォームが送信された際に即座にメッセージが表示されることが確認できます。リクエストに失敗した際にはエラーメッセージが表示され、一度表示されたメッセージが取り消されます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1N9iAQzMdAhqJLFsT6m7K2/eaf61d67e397f81aa20c2ae800eba4d8/_____2024-05-12_16.06.39.mov" controls></video>

## まとめ

- `useOptimistic` フックは楽観的な更新を行うためのフック
- `useOptimistic` フックは引数として現在の state と楽観的な state を返す関数を受け取る。非同期処理が進行している間だけ異なる state を返すことができる
- 状態を更新する関数を `startTransition` でラップする、もしくは `formAction` の関数内で状態を更新する必要がある

## 参考

- [useOptimistic – React](<https://ja.react.dev/reference/react/useOptimistic#noun-labs-1201738-(2)>)
