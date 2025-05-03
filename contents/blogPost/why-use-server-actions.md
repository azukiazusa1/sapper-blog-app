---
id: st7nBKJWNEkNdAMRlvYOj
title: "なぜ Server Actions を使うのか"
slug: "why-use-server-actions"
about: "Next.js 14 の Server Actions の stable リリースに発表は大きな反響を呼びました。特に `<button>` の `formAction` 属性内で直接 SQL クエリを実行するコードは多くの人に衝撃を与えていました。Server Actions の是非について語る時、導入の背景にユーザー体験の向上があるという観点を忘れてはいけません。また、セキュリティ上の観点についてどのように考えるべきでしょうか？"
createdAt: "2023-11-12T14:10+09:00"
updatedAt: "2023-11-12T14:10+09:00"
tags: ["Next.js", "Server Actions"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6oHTYTyG6RM7lw4zKnsQE8/c17eb5c6d66837ffa57e49974a675fac/bird_hirenjaku_13695-768x640.png"
  title: "かわいいヒレンジャクのイラスト"
audio: null
selfAssessment: null
published: true
---
[Next.js 14](https://nextjs.org/blog/next-14) の Server Actions の stable リリースに発表は大きな反響を呼びました。

特に `<button>` の `formAction` 属性内で直接 SQL クエリを実行するコードは多くの人に衝撃を与えていました。`"use server;"` の部分を PHP やバイナリに置き換えると行った多くのミームも生まれました。

```jsx
function Bookmark({ slug }) {
  return (
    <button
      formAction={async () => {
        "use server";
        await sql`INSERT INTO Bookmarks (slug) VALUES (${slug})`;
      }}
    >
      <BookmarkIcon>
    </button>
  )
}
```

X 上での反応を見ると、このクライントから直接 SQL クエリを実行するコードは見た目の印象からか、あまり好ましくないという意見が多かったようにも見られました。確かにこの部分だけ切り取ってみると、「関心の分離」という観点に違反しているように見えますし、セキュリティ上の問題があるように見えるのももっともです。

Server Actions は一見すると、従来までのサーバーサイドとクライアントサイドの分離という流れに逆行している「バッドプラクティス」のように思えます。なぜ Next.js は Server Actions という機能を取り入れたのでしょうか？

その理由について、API Route により作成されたサーバーサイドのエンドポイントに API コールを行う実装と比較して考えてみたいと思います。

## Server Actions 導入の目的はユーザー体験の向上のため

Server Actions により従来の実装と比較してコード量が削減し、クライアントサイドでデータを更新するための煩雑な hooks が不要になるなど、開発体験の向上という利点が確かに認められます。（同時に関心の分離に対する違反といった、設計上の観点からの批判も当てはまります）。

ですが、Server Actions の導入の目的の 1 つにユーザー体験の向上という観点があるということを忘れてはいけません。開発者の体験の向上（もしくはコードの設計）という観点だけにフォーカスして Server Actions のコードの良し悪しを判断するのは、重要なファクターを 1 つ見落として議論を進めているようなものです。

ユーザー体験の観点から Server Actions を眺めると、以下のような点があげられます。

- プログレッシブエンハンスメント
- ページの再レンダリングの回数を減らすなど、パフォーマンスを向上させる
- App Router のキャッシュ機能との統合

### プログレッシブエンハンスメント

[プログレッシブエンハンスメント](https://developer.mozilla.org/ja/docs/Glossary/Progressive_Enhancement) とは可能な限り多くのユーザーに不可欠なコンテンツと機能のベースラインを提供することを中心とした設計哲学であり、必要なすべてのコードを実行できる最新のブラウザーのユーザーに限り、最高の体験を提供します。

ここでは JavaScript が無効になっている環境においてもユーザーがインタラクティブな操作をできることを意味します。その上で JavaScript が有効になっている環境では、フォームのサブミット後のフルページリロードを取り除いたり、バリデーション結果を即座に返却するなどよりリッチなユーザー体験を提供します。

Server Actions においてはクライアントサイドで `<form>` 要素を用いることでプログレッシブエンハンスメントを実現しています。`<form>` 要素は御存知の通り、HTML の機能だけを用いてサーバーにデータをサブミットできます。従来の API Route による実装では、クライアントサイドで JavaScript を用いて API コールを行う必要がありました。そのため、JavaScript が無効になっている環境ではフォームのサブミットそのものができないという問題がありました。

```jsx
// API Route による実装
function Form() {
  const [tweet, setTweet] = useState("");

  // JavaScript による API コール
  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch("/api/tweet", {
      method: "POST",
      body: JSON.stringify({ tweet }),
    });
  };

  return (
    // JavaScript の　onSubmit により API コールを行うので、
    // JavaScript が無効になっている環境ではフォームのサブミットができない
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={(event) => setTweet(event.target.value)}
      />
      <button type="submit">Tweet</button>
    </form>
  );
}
```

```jsx
// Server Actions による実装
import { postTweet } from "../actions/tweet";

function Form() {
  return (
    // JavaScript が無効の場合は通常の HTML のフォームとして振る舞う
    <form action={postTweet}>
      <input type="text" />
      <button type="submit">Tweet</button>
    </form>
  );
}
```

ところで JavaScript が無効な環境においてもユーザーがインタラクティブな操作が実現できるという点は、果たして本当に重要なのでしょうか？セキュリティ上の理由からブラウザの JavaScript を無効にすることが推奨されていた 2000 年代前半の時代にはいざ知らず、現代ではあえて JavaScript を無効にしてブラウザを利用しているユーザーはほとんどいないのではないでしょうか？

プログレッシブエンハンスメントによる利点は、ハイドレーションが完了する前にユーザーがインタラクティブな操作をできるという点にあります。これはページが表示されてから実際にユーザーが操作可能になるまでの時間として Web Vitals の [FID](https://web.dev/fid/) または [INP](https://web.dev/articles/inp)
という指標で計測されます。

特にネットワークの遅延が大きい環境では、ハイドレーションが完了するまでの時間も長くなるため、よりプログレッシブエンハンスメントによる利点が顕著になります。

### ページの再レンダリングの回数を減らすなど、パフォーマンスを向上させる

Server Actions ではデータの変更、ページの再レンダリング、またはリダイレクトは 1 回のネットワーク ラウンドトリップで実行できます。ネットワーク帯域が低い環境では特に有利に働くでしょう。

例えば従来の実装方式でフォームのサブミット後にリダイレクトを行う場合には、フォームのサブミットによる API コール → サーバーサイドから結果が返却される → クライアントサイドでリダイレクトを行うという工程が必要でした。

```jsx
import { useRouter } from "next/router";

function Form() {
  const [tweet, setTweet] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetch("/api/tweet", {
      method: "POST",
      body: JSON.stringify({ tweet }),
    });
    // フォームのサブミットが完了後、ホーム画面にリダイレクトする
    router.push("/home");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={tweet}
        onChange={(event) => setTweet(event.target.value)}
      />
      <button type="submit" disabled={isSubmitting}>
        Tweet
      </button>
    </form>
  );
}
```

Server Actions では `redirect()` 関数によりサーバーサイドでリダイレクトを行えるためより効率的です。

```jsx
async function postTweet(formData) {
  "use server";
  const tweet = formData.get("tweet");
  await saveTweet(tweet);
  redirect("/home");
}

function Form() {
  return (
    <form action={postTweet}>
      <input type="text" />
      <button type="submit">Tweet</button>
    </form>
  );
}
```

### App Router のキャッシュ機能との統合

Server Actions は App Router のキャッシュ機能と深く統合しています。`revalidatePath()` もしくは `revalidateTag()` 関数により、App Router によりキャッシュされたデータをパージできます。この関数はサーバーサイドでのみ呼び出すことができるため、データの更新ともにキャッシュをパージする場合には Server Actions を使用することが不可欠となっています。

```jsx
async function postTweet(formData) {
  "use server";
  const tweet = formData.get("tweet");
  await saveTweet(tweet);
  // データの更新と同時にキャッシュをパージする
  revalidatePath("/home");
  redirect("/home");
}
```

他にも `useOptimistic()`、`useFormState()`、`useFormStatus()` といった hooks も Server Actions と統合されています。これからも Server Actions を前提とした関数や hooks が増えていくことが予想できるため、このことも 1 つの考慮事項となります。

## セキュリティ上の懸念

Server Actions によりサーバーサイドとクライアントサイドの境界が曖昧になることで、セキュリティ上の懸念が生じることは大いに想定できるでしょう。例えばユーザーのパスワードなど機密情報はサーバーサイドのみに保持する必要がありますが、誤ってクライアントコンポーネントに Props として渡してしまうと行った事故が想定できるでしょう。

Next.js ではサーバーサイドのみで実行されるべきコードが誤ってクライアント側に漏れ出すことがないようにするために、いくつかの機能を備えています。

- `import "server-only;`
- React Taint API

サーバーサイドのみで実行されてほしいモジュールに対しては、以下のコードの記述をすることで、クライアントサイドからモジュールをインポートすることを防ぐことができます。

```js
import "server-only";
```

`import "server-only";` を記述したモジュールは、クライアントサイドでインポートしようとするとビルドエラーが発生します。

```sh
This module cannot be imported from a Client Component module. It should only be used from a Server Component.
```

クライアントサイドに渡してはいけない機密情報を含むオブジェクトを作成する場合には、React Taint API を用いることで事前に防ぐことができます。具体的には以下の 2 つの API です。

- [experimental_taintObjectReference](https://react.dev/reference/react/experimental_taintObjectReference)：オブジェクト単位でクライアントサイドに渡してはいけないことを明示する
- [experimental_taintUniqueValue](https://react.dev/reference/react/experimental_taintUniqueValue)：一意な値の単位でクライアントサイドに渡してはいけないことを明示する

`taintObjectReference` 関数の第 1 引数にはデータがクライアントコンポーネントに渡った際のエラーメッセージを、第 2 引数にはクライアントコンポーネントに渡されるべきではないオブジェクトを渡します。

```js
import { experimental_taintObjectReference as taintObjectReference } from "react";

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  taintObjectReference(
    "Do not pass the entire user object to the client. " +
      "Instead, pick off the specific properties you need for this use case.",
    user,
  );
  return user;
}
```

上記のようなデータの漏洩を未然に防ぐための API が提供されているとはいえ、当然誤った使い方をしてしまう危険性は依然として残っているでしょう。Server Actions（もしくは Server Components）の登場により、フロントエンドの開発におけるセキュリティ上の危険性が高まったという意見は、確かに的を得ていると思います。

この点について、組織とプロジェクトの規模に応じて適切なデータ処理モデルを選択するべきだと述べられています。[How to Think About Security in Next.js](https://nextjs.org/blog/security-nextjs-server-components-actions) という記事では、以下の 3 つのデータ処理モデルがあげられています。

- [HTTP API](https://nextjs.org/blog/security-nextjs-server-components-actions#http-apis) (既存の大規模プロジェクト/組織に推奨)
- [データ アクセス レイヤー](https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer)(新規プロジェクトに推奨)
- [コンポーネントレベルのデータアクセス](https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer)(プロトタイピングと学習に推奨)

既存の大規模なプロジェクトでは HTTP API によるモデルが推奨されています。これは、サーバーサイドとクライアントサイドの境界を明確にしたモデルであると考えることができます。Server Components におけるデータの取得・更新の実行は、REST API や GraphQL などの　API エンドポイントを呼び出すにとどめます。

このアプローチでは、セキュリティを専門とする既存のバックエンドチームが引き続き API のエンドポイントを作成するため、既存のプラクティスをそのまま適用できます。

新しいプロジェクトにおいては、JavaScript コードベースとしてデータアクセスレイヤーを設けることを推奨しています。データにアクセスする箇所（サーバーサイドのコード）を 1 つのモジュールにまとめることで、一貫したデータアクセスが保証されます。データアクセスレイヤーを実装する場合には、従来のセキュリティ上の観点が適用されます。

Server Components や Server Actions からは、データアクセスレイヤーのコードを呼び出すことのみを許可し、安全にデータを転送するための DTO（Data Transfer Object）を用いることを推奨しています。

データのアクセスをデータアクセスレイヤーにまとめることで、セキュリティの監査を 1 つのモジュールに焦点をあてることができ、問題を発見しやすくなります。

コンポーネントレベルのデータアクセスはプロトタイピング目的でのみ用いられるべきです。（冒頭の `Bookmark` コンポーネントの例がそうでした）。コンポーネントから直接 SQL を呼び出すようなコードは迅速な開発とイテレーションを可能にするためプロトタイピング目的では適していますが、全員がそのリスクについて認識している必要があります。

### CSRF

フォーム周りのセキュリティといえば、CSRF（クロスサイトリクエストフォージェリ）をまず思い浮かべる方も多いのではないでしょうか？実際に Server Actions ではネイティブの `<form>` 要素を使用していますから、CSRF 攻撃にさらされる可能性があります。

多くのフレームワークでは CSRF トークンを用いることで CSRF を対策していますが、Next.js では CSRF トークンを用いた対策は実装されておりません。その理由は、現代のブラウザは Same-Site クッキーがデフォルトであるため、これだけでほとんどの CSRF 攻撃を防ぐことができると考えられているためです。

さらに追加の保護として、`Origin` ヘッダーと `Host` ヘッダーの比較による検証も行われます。もしこれらの値が一致しない場合には、アクションは拒否されることになります。

なんらかの理由でクッキーの Same-Site 属性を None に設定する必要があったり、ヘッダーをサポートしていない古いブラウザを対象としている場合には、開発者自身により CSRF トークンを実装する必要があることに注意してください。

## まとめ

- Server Actions の目的は開発者体験の向上だけでなく、ユーザー体験の向上という側面がある
- Server Actions はプログレッシブエンハンスメントを実現するための機能である
- Server Actions は App Router のキャッシュ機能と深く統合していて、今後も Server Actions を前提とした関数や hooks が増えていくことが予想される
- サーバーサイドとクライアントサイドの境界が曖昧になることによるセキュリティ上の懸念は確かに存在する。組織とプロジェクトの規模に応じて適切なデータ処理モデルを選択するべきだと述べられている

## 参考

- [Next.js 14](https://nextjs.org/blog/next-14)
- [How to Think About Security in Next.js](https://nextjs.org/blog/security-nextjs-server-components-actions)
