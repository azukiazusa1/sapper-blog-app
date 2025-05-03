---
id: 2XqLY2qwZEQOpkhRjzOzUr
title: "Web フロントエンドの実装において本来の機能を損なってはいけない"
slug: "do-not-compromise-html-functionality-in-your-web-front-end-implementation"
about: "データの取得・ルーティング・フォームの値の管理に至るまで JavaScript で制御するようになった結果、本来備わっていた機能を損なう形で実装されるような間違いが起きるケースも発生してしまいました。見た目上操作に不都合がないのですが、修飾キーが有効でなかったりと、とある要素が当然に持っているべき機能が失われていることがよくあります。"
createdAt: "2022-12-25T00:00+09:00"
updatedAt: "2022-12-25T00:00+09:00"
tags: ["HTML", "アクセシビリティ", "React"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/twgcVOWA9HjJC68kQLWeM/76bbd55bc8d4f55e1d7963bc19954fe9/_Pngtree_creative_christmas_snowman_8618319.png"
  title: "雪だるま"
audio: null
selfAssessment: null
published: true
---
昨今の Web フロントエンドの開発においては、React や Vue.js などを利用した SPA を採用することが多くなりました。従来の MPA と比較して、リンククリック時やフォーム送信時にページリロードを挟まないので、高速な画面遷移を実現できるため、快適な操作を実現できます。

一方データの取得・ルーティング・フォームの値の管理に至るまで JavaScript で制御するようになった結果、本来備わっていた機能を損なう形で実装されるような間違いが起きるケースも発生してしまいました。見た目上操作に不都合がないのですが、修飾キーが有効でなかったりと、とある要素が当然に持っているべき機能が失われていることがよくあります。

普段よく見かける要素が本来持っている機能を損なっている場合、ユーザーは期待を裏切られたような体験を感じてしまいます。例えば青文字に下線が引かれている文字を見かけたとき、私たちは普段の経験からそれをリンクだと認識します。クリックしても何も起こらなかったらひどく違和感を感じることでしょう。

他にも、ゴミ箱のアイコンを見かけたら、実行する際に確認ダイアログが表示されたり、実行後に取り消せることを期待するはずです。なぜなら、その他のアプリケーションでは当然にそのような動作をすることを体験しているためです。

このように見た目や要素の役割上期待される振る舞いというものが存在するのです。ユーザーにとってはどのような方法で実装されているか関係ないことなので、本来持っている機能を損なわないように正しく実装する必要があります。

## プログラムによる画面遷移は可能な限り避ける

ルーティングライブラリには JavaScript による画面遷移をする関数が提供されています。例えば 
React Router においては [useNavigate](https://reactrouter.com/en/main/hooks/use-navigate) フックを利用することでプログラムによる画面遷移を実現できます。以下のようにボタンをクリックした際に `navigate` 関数を呼び出すように実装すれば、一見 `<a>` タグと同様の挙動が再現されているように見えます。

```jsx
import { useNavigate } from "react-router-dom"

const Nav = () => {
  const navigate = useNavigate()

  return (
    <nav>
      <button onClick={() => navigate("/about")}>About</button>
      <button onClick={() => navigate("/blogs")}>Blogs</button>
    </nav>
  )
}
```

確かにクリックしたときに画面遷移するという機能は `<a>` タグと同様ですが、その裏で失われた振る舞いがいくつか存在します。ぱっと思いつく限り、リンクはクリックしたときに遷移するだけでなく、以下の機能が存在しています。

- `Ctrl` キーを入力しながらクリックすると新しいタブでリンクを開く
- 右クリックすることで、どのようにリンクを開くか選択できる
- リンクをドラッグ&ドロップしてタブを開く
- リンクが訪済かどうかの情報

もし上記例のようなコンポーネントをリンクとして利用するつもりがあるならば、リンクが本来持つ機能を漏れなく実装する責任があります。リンクの機能を漏れなく実装するのは大変手間がかかりますし、将来機能が追加される場合追従する必要があるでしょう。

もっとも好ましい方法はクリックしたときにプログラムで画面遷移させるのはやめて `<a>` タグを使用するように変更することです。大抵のルーティングでは `<Link>` コンポーネントの内部は `<a>` タグで実装されているはずです。

```tsx:Nav.tsx
import { useNavigate } from "react-router-dom"

const Nav = () => {
  const navigate = useNavigate()

  return (
    <nav>
      <Link to="/about">About</Link>
      <Link to="/blogs">Blogs</Link>
    </nav>
  )
}
```

## `<form>` 要素を使用する

旧来のサーバーレンダリングアプリケーションではサーバーにデータを送信する方法は `<form>` 要素を使用してサブミットすることでした。SPA の場合には JavaScript を用いてフォームの入力値を管理し「送信」ボタンがクリックされたときに API をコールという形式がよく見受けられます。この形式の場合には、必ずしも入力フォームを `<form>` 要素で囲む必要はありません。

```tsx:Login.tsx
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <div>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default Login;

```

`<form>` を使っているかどうかに関わらず見た目上は変化はありません。サーバーにデータを送信するという目的も達成されています。しかし、`<form>` 要素を使用している場合と比較して以下のような機能が失われています。

- `Enter` キーによるサブミット
- フォームの検証
- `form` ロール

`<input>` 要素のフォーカスがある状態で `Enter` キーを入力するとフォームをサブミットできることは知っているほうも多いでしょう。この機能は [4.10.21.2 Implicit submission](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#implicit-submission) という仕様によるものです。`Enter` キーを入力してもサブミットされないフォームはだいぶ不親切ですし、アプリケーションが壊れていると思われるかも知れません。

`<form>` 要素を使用していない場合には検証も行われなくなります。例えば `<input type="email" />` 要素を使用している場合、ブラウザにより Email の形式かどうかのチェックが行われますが、`<form>` 外の要素についてはその限りではありません。

![スクリーンショット 2022-12-25 15.05.18](//images.ctfassets.net/in6v9lxmm5c8/4EXmoWiXJZ0svb7QTCX9wK/99983a3cd1528a4a77891f72b5cd0790/____________________________2022-12-25_15.05.18.png)

とはいえ、HTML のフォームバリデーションはスタイルを変更できないなどの事情があるためあまり積極的に使われていません。代わりに JavaScript を用いてバリデーションを実施することが多いでしょう。そのため `<form>` を使いたくなる動機としては少し小さいでしょうか。

`<form>` 要素は `aria-label` や `aria-labelledby` などでアクセシブルな名前を持っている場合のみ [form role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/form_role) が与えらるという仕様があります。`form` ロールは支援技術を使用しているユーザーはフォームを Web ページ上の 1 つの理領域として認識できます。`role="form"` 属性でも `form` ロールを宣言できますが、よほど特別な事情がない限り `<form>` タグを使用するべきです。

基本的には `<form>` 要素を使用することによる不都合が存在するわけでもないですし、常に入力フォームは `<form>` 要素を使用するのがよいでしょう。

```jsx:Form.tsx
  return (
    <form aria-label="Login" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
```

## ラジオグループには同じ `name` 属性を指定する

フォームによるサブミットでサーバーにデータを送信する場合には、どの値がどの項目のものか識別するため、入力フォームに `name` 属性を設定することがほぼ必須でした。前節でも述べたとおり、SPA では JavaScript でフォームの入力値を管理することが多いので、`name` 属性を使用せずともどの項目に対する値なのかを識別できます。

ラジオボタンにおける関連するオプションの組み合わせは一般にラジオグループと呼ばれて、ラジオグループ内ではいずれか 1 つしか同時に選択できません。ラジオグループを定義するためには、それぞれのラジオボタンに同じ `name` 属性を設定します。今日では、JavaScript で適切に状態管理が行えていれば、グループの中でいずれか 1 つしか同時に選択できないことを `name` 属性を使わずとも表現できます。

```tsx:RadioGroup.tsx
import { useState } from "react";

const RadioGroup = () => {
  const [color, setColor] = useState<"red" | "blue" | "yellow" | "pink">("red");
  const colorOptions = ["red", "blue", "yellow", "pink"] as const;

  const [size, setSize] = useState<"small" | "medium" | "large">("small");
  const sizeOptions = ["small", "medium", "large"] as const;

  return (
    <form>
      <div style={{ marginBottom: 8 }}>
        Colors
        {colorOptions.map((option) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={color === option}
              onChange={() => setColor(option)}
            />
            {option}
          </label>
        ))}
      </div>

      <div>
        Sizes
        {sizeOptions.map((option) => (
          <label key={option}>
            <input
              type="radio"
              value={option}
              checked={size === option}
              onChange={() => setSize(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </form>
  );
};

export default RadioGroup;
```

このフォームでは「Colors」と「Sizes」をそれぞれグループとしてラジオボタンで選択できるようにしています。Colors のグループの中でその他ほオプションを選択したら現在選択されているオプションが非選択状態になるため、`name` 属性がなくともラジオグループの機能が満たされているように思えます。

しかしながら、この実装では正しいラジオボタンの機能を備えているとはいえません。どのラジオボタンにも `name` 属性を設定していないので、すべてのラジオボタンが同じグループとして扱われてしまっています。

ラジオボタンは同じグループ内であれば `↑``↓` キーまたは `←``→` キーを入力することで、前後のラジオボタンにフォーカスを移動してチェックする機能が備わっています。またラジオグループ間は `tab` キー、`tab + Shift` キーで前後に移動できます。上記のコンポーネントでは 1 つのラジオグループと認識されてしまているため、`←``→` キーを入力したとき「Colors」の選択肢と「Sizez」の選択肢が行き来できるようになってしまっております。当然グループ間の `Tab` キーによる移動もできません。

<iframe height="300" style="width: 100%;" scrolling="no" title="radiogroup" src="https://codepen.io/azukiazusa1/embed/rNrOjyw?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/rNrOjyw">
  Untitled</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

さらに、支援技術を使用している場合「ラジオボタン 1/7」のように誤った選択肢の全数として読み上げられてしまいます。

![スクリーンショット 2022-12-25 16.23.07](//images.ctfassets.net/in6v9lxmm5c8/2RnUt24D4OuTwi2JFtzMf4/b6816fbc9d791910677b7b3509d5eb1a/____________________________2022-12-25_16.23.07.png)

ラジオボタンを正しくグループ化する方法は、同じグループのラジオボタンに対して同一の `name` 属性を設定することが唯一の方法です。以下のように「Colros」には `name="color"` を「Sizes」には `name="size"` を設定することで正しくグループ分けできます。

```tsx:RadioGroup.tsx
  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        Colors
        {colorOptions.map((option) => (
          <label key={option}>
            <input
              name="color"
              type="radio"
              value={option}
              checked={color === option}
              onChange={() => setColor(option)}
            />
            {option}
          </label>
        ))}
      </div>

      <div>
        Sizes
        {sizeOptions.map((option) => (
          <label key={option}>
            <input
              name="size"
              type="radio"
              value={option}
              checked={size === option}
              onChange={() => setSize(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
```

## 画面遷移したときに切り替えたことを伝える

SPA における画面遷移は従来の MPA での画面遷移と異なり、アクセシビリティ上注意が必要となる箇所です。MPA では `<a>` タグで画面遷移する際にページリロードが発生するため、スクリーンリーダーなどの支援技術がページタイトルを読み上げユーザーがページが変更されたことを理解できます。しかしながら SPA における画面遷移（クライアントサイドルーティング）はページリロードが発生しないので、スクリーンリーダーは次の画面のタイトルを読み上げずユーザーはページの変更を理解できません。

それだけでなく、カーソル位置が前画面でリンクがクリックされた箇所のように不自然な位置に移動してしまいます。MAP ではページ遷移が発生した場合フォーカスはページの先頭に移動しているはずです。

このように SPA における画面遷移では MPA の画面遷移と比較して失われている機能があることがわかります。

SPA における画面遷移において MPA の挙動を再現するためには [ARIA ライブリージョン](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) によりページの更新を伝える、フォーカスをページの先頭に JavaScript で移動させるなどの工夫が必要です。

### ARIA ライブリージョンとは

ARIA ライブリージョンとは JavaScript により動的に変更されたページの要素を支援技術を使用しているユーザーに通知する機能です。例えば、フォームのバリデーションのエラーメッセージは通常バリデーションに違反したテキストが入力されたタイミングで JavaScript で動的に表示されます。この変更は視覚的には明らかですが、支援技術を利用しているユーザーには伝わりません。

ARIA ライブリージョンは `aria-live` 属性により明示されます。`aria-live` は `off`,`polite`,`assertive` の 3 つの値から指定できます。デフォルトは `aria-live="off"` であり、何も通知しません。

通常なにか動的な変更を通知したい場合には `aria-live="polite"` が使われます。これはユーザーがアイドル状態になったときに読み上げを行います。

`aria-live="assertive"` はスクリーンリーダーが割り込みで変更を読み上げます。この挙動は混乱のもとになりうるので控えめに使用するべきです。

### 画面遷移時の実装

それでは実際に画面遷移時に ARIA ライブリージョンによる通知とフォーカス管理をする実装見てみましょう。ARIA ライブリージョンの実装は NextJS の [Route Announcements](https://nextjs.org/docs/accessibility#route-announcements) の実装を参考にします。Route Announcements は SPA による画面遷移が発生したとき、`document.title` > `<h1>` > `URL pathname` の順番で要素を探してその名前を ARIA ライブリージョンにより通知します。

https://github.com/vercel/next.js/blob/canary/packages/next/src/client/route-announcer.tsx

React Router で同様の実装をしてみましょう。まずはページ遷移をフックする必要があります。これは [useLocation](https://reactrouter.com/en/main/hooks/use-location) が返却する [location](https://reactrouter.com/en/main/utils/location) オブジェクトを監視することで実現できます。

```tsx:app.tsx
import { useEffect } from "react";
import {useLocation } from "react-router-dom";

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    // ...
  );
};
```

まずは Next.js の実装と同じように `<RouteAnnouncer />` 要素を作成します。この要素は視覚的には表示されないようにしつつ、アクセシビリティツリーからは削除されないようにする必要があります。`display:none` のようなスタイルは視覚的に表示されくなるものの、アクセシビリティツリーからも削除されてしまうので、結果的にスクリーンリーダーからも読み上げられなくなってしまいます。また要素が変化したときに読み上げてほしいので前述した ARIA ライブリージョン要素として `aria-live="assertive"` を指定しています。

```tsx:RouteAnnouncer.tsx
const RouteAnnouncer = () => {
  return (
    <div
      aria-live="assertive"
      style={{
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
    ></div>
  );
};
```

後は画面遷移があるたびに `<div>` 要素内のテキストを更新してスクリーンリーダーに読み上げられるようにします。簡単のため、`<title>` 要素のみを探して取得し、その内部のテキストを設定しています。

```tsx:RouteAnnouncer.tsx
const RouteAnnouncer = () => {
  const [routeAnnouncement, setRouteAnnouncement] = useState("");
  const location = useLocation();

  useEffect(() => {
    const title = document.title;
    setRouteAnnouncement(title);
  }, [location]);

  return (
    <div
      aria-live="assertive"
      style={{
        border: 0,
        clip: "rect(0 0 0 0)",
        height: "1px",
        margin: "-1px",
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        width: "1px",
        whiteSpace: "nowrap",
        wordWrap: "normal",
      }}
    >
      {routeAnnouncement}
    </div>
  );
};
```

この要素は `<App>` コンポーネントなどに配置しておくと、画面遷移があるたびに `<title>` のテキストが読み上げられることがわかります。またこのような実装を利用する際には個々のページでユニークな `<title>` を設定することが大切です。タイトルを読み上げたとしても前の画面と変わらない値であるならば画面遷移したことが伝わりにくいです。

最後にフォーカス管理も実装しましょう。これは画面遷移が行われた際に、従来の MAP のように `body` 要素に JavaScript を用いてフォーカスを移動させてあげればよいでしょう。

```tsx:App.tsx
export const Root = () => {
  const location = useLocation();

  useEffect(() => {
    const body = document.querySelector("body");

    if (body) {
      body.focus();
    }
  }, [location]);

  return (
    // ...
  );
};
```

## 参考

- [ページ内リンクの実装から考える、a要素のclickイベントとその振る舞い - シフトブレイン／スタンダードデザインユニット](https://standard.shiftbrain.com/blog/default-action-for-click-event-of-a-element)
- [Recommendations for Single Page Applications - Orange digital accessibility guidelines](https://a11y-guidelines.orange.com/en/articles/single-page-app/)
- [SPA(Next.js)のスクリーンリーダーによる画面遷移で工夫したこと](https://zenn.dev/ubie_dev/articles/499d3ecff708c0)
- [Accessibility • Docs • SvelteKit](https://kit.svelte.jp/docs/accessibility#route-announcements)
- [What we learned from user testing of accessible client-side routing techniques with Fable Tech Labs | Gatsby](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/)
