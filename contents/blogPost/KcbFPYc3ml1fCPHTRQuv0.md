---
id: KcbFPYc3ml1fCPHTRQuv0
title: "react-devtools-cdt-mcp で AI エージェントが React のコンポーネントツリーを調べられるようにする"
slug: "react-devtools-cdt-mcp"
about: "Chrome DevTools MCP で AI エージェントはブラウザを操作できますが、DOM からはどのコンポーネントが描画したのか、なぜ遅いのかがわかりません。react-devtools-cdt-mcp はページで import すると、コンポーネントツリーやレンダリング時間を調べるツールを Chrome DevTools MCP に登録する実験的なライブラリです。仕組みとセットアップ、各ツールの出力、Claude Code による調査を試します。"
createdAt: "2026-10-23T21:55+09:00"
updatedAt: "2026-10-23T21:55+09:00"
tags: ["React", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2B2KC4Q7Y5kzxK1REMM8Hf/8888d2e4ed224cd98233d77afca7d7bf/saturn_dosei_illust_4633-768x595.png"
  title: "土星のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "react-devtools-cdt-mcp を AI エージェントから使うときの構成として正しいものはどれですか？"
      answers:
        - text: "react-devtools-cdt-mcp を MCP サーバーとして MCP クライアントの設定に追加する"
          correct: false
          explanation: "react-devtools-cdt-mcp は MCP サーバーではなく、ページの中で動くブラウザ向けのライブラリです。MCP クライアントの設定には追加しません。"
        - text: "ページで react-devtools-cdt-mcp/register を import し、Chrome DevTools MCP を --categoryExperimentalThirdParty=true 付きで起動する"
          correct: true
          explanation: "ページ側でツールを登録し、サードパーティ開発者ツールを有効にした Chrome DevTools MCP がそのツールを見つけて公開します。"
        - text: "React DevTools の拡張機能を Chrome にインストールし、Chrome DevTools MCP からその拡張機能に接続する"
          correct: false
          explanation: "React DevTools と同じグローバルなフックを使いますが、拡張機能は必要ありません。ツールはページ内のライブラリが登録します。"
        - text: "Chrome DevTools MCP の performance_start_trace に React 用のオプションを渡す"
          correct: false
          explanation: "React のツールは performance_start_trace とは別に、execute_3p_developer_tool から呼び出す独立したツールとして登録されます。"
published: true
---

!> `react-devtools-cdt-mcp` は実験的なライブラリです。Chrome DevTools MCP の実験的なサードパーティ開発者ツール API の上に作られており、ツールの名前や出力はリリースごとに変わる可能性があります。

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) を使うと、AI エージェントがブラウザでページを開き、クリックや入力をして、アクセシビリティツリーのスナップショットやコンソールログを取得できます。しかし React アプリのデバッグでは、DOM から得られる情報だけでは足りない場面があります。スナップショットに現れるのはボタンや `<li>` 要素だけで、それを描画したのがどのコンポーネントかはわかりません。入力が重いときにどのコンポーネントの再レンダリングが時間を使っているのかという情報も、Chrome DevTools MCP のパフォーマンストレースの出力から、エージェントがコンポーネント単位で得るのは難しいです。

人間の開発者は [React DevTools](https://react.dev/learn/react-developer-tools) のコンポーネントタブやプロファイラでこれらを確認します。[`react-devtools-cdt-mcp`](https://react.dev/reference/dev-tools/react-devtools-cdt-mcp) は、同じ情報を AI エージェントへ渡すためのライブラリです。アプリのエントリーファイルで import すると、コンポーネントツリーやレンダリング時間を調べる 12 個のツールが Chrome DevTools MCP に登録されます。

この記事では `react-devtools-cdt-mcp` の仕組みとセットアップを説明したうえで、Claude Code に「入力が重い原因を調べて」と依頼し、エージェントが React のプロファイリングツールを使って原因を特定する様子を見ます。

## react-devtools-cdt-mcp の仕組み

`react-devtools-cdt-mcp` 自身は名前に反して MCP サーバーではありません。デバッグするページの中で動くブラウザ向けのライブラリで、Chrome DevTools MCP がページを開いたときに、ページの中で登録されたツールを見つけて公開します。

ページの中のライブラリがエージェントにツールを提供できるのは、Chrome DevTools MCP の[サードパーティ開発者ツール](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md)という仕組みによるものです。Chrome DevTools MCP はページを開いたときや選択中のページが変わったときに、`window` に対して `devtoolstooldiscovery` イベントを発行します。ページ側はこのイベントを受け取り、`event.respondWith()` でツールの一覧を返します。

```js
window.addEventListener("devtoolstooldiscovery", (event) => {
  event.respondWith({
    name: "My Library Tools",
    description: "Tools for inspecting internal library state",
    tools: [
      {
        name: "getInternalState",
        description: "Returns the current internal state of the framework.",
        inputSchema: {
          type: "object",
          properties: { componentId: { type: "string" } },
        },
        execute: async (input) => myFramework.getState(input.componentId),
      },
    ],
  });
});
```

各ツールは名前、説明、JSON Schema で書いた入力の定義、ページ内で実行される `execute` 関数を持ちます。エージェントは Chrome DevTools MCP の次の 2 つのツールを通じて、ページが登録したツールを使います。

- `list_3p_developer_tools`: ページが登録したツールの一覧を返す
- `execute_3p_developer_tool`: ツール名と JSON 文字列のパラメーターを受け取り、ページ内のツールを実行する

[Chrome の公式ブログ](https://developer.chrome.com/blog/devtools-for-agents-3p-tools)によると、この仕組みの目的は、DOM には現れないフレームワーク内部の状態をエージェントへ渡すことです。最終的に描画された DOM は DevTools から直接見えますが、アプリケーションの本当の状態はコンポーネントの階層やシグナルといったフレームワークの内部にある、というのがその理由です。Angular チームもシグナルの依存関係や DI のグラフを調べるツールを実装しています。

`react-devtools-cdt-mcp` は、この仕組みに React 用のツールを登録するライブラリです。このパッケージ自身はツールのロジックを持っておらず、React DevTools のロジックを切り出した `react-devtools-facade` パッケージのツールを、Chrome DevTools MCP の形式に変換して登録しています。

## セットアップ

Vite と React で作った商品一覧アプリに `react-devtools-cdt-mcp` を導入します。まずパッケージを開発用の依存関係としてインストールします。

```bash
npm install --save-dev react-devtools-cdt-mcp@0.1.0
```

エントリーファイルの先頭で `react-devtools-cdt-mcp/register` を import します。`react-devtools-cdt-mcp/register` は `react-dom/client` より前に置く必要があります。

```jsx:src/main.jsx
import "react-devtools-cdt-mcp/register";

import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
```

!> `react-devtools-cdt-mcp` のツールはコンポーネントの props や Hooks の値を外部に公開するため、本番のバンドルには含めないでください。

次に Chrome DevTools MCP を `--categoryExperimentalThirdParty=true` フラグ付きで起動するよう設定します。サードパーティ開発者ツールは実験的な機能のため、このフラグがないと `list_3p_developer_tools` と `execute_3p_developer_tool` が公開されません。Claude Code では次のコマンドで追加します。

```bash
claude mcp add chrome-devtools -- npx chrome-devtools-mcp@latest --categoryExperimentalThirdParty=true
```

他の MCP クライアントでは、設定ファイルの `args` にフラグを追加します。

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--categoryExperimentalThirdParty=true"
      ]
    }
  }
}
```

開発サーバーを起動したページを Chrome DevTools MCP の `navigate_page` で開くと、レスポンスの末尾に React のツールの一覧が追加されます。

```txt
## Third-party developer tools
react: Inspect and profile the running React app. Components are addressed by stable uids (e.g. "r5") from react_get_component_tree; pass a uid to the other tools.
Available tools:
name="react_get_component_tree", description="Snapshot of the React component tree as {nodes}, ...
name="react_get_component_by_uid", description="Detailed info for one component by uid: ...
...
```

`react` という名前のツールグループに、次の 12 個のツールが登録されています。

| ツール                               | 内容                                                   |
| ------------------------------------ | ------------------------------------------------------ |
| `react_get_component_tree`           | コンポーネントツリーのスナップショットを返す           |
| `react_find_components`              | 名前の部分一致でコンポーネントを検索する               |
| `react_get_component_by_uid`         | コンポーネントの props と Hooks を返す                 |
| `react_get_component_by_dom_element` | DOM 要素に対応する React のホストコンポーネントを返す  |
| `react_get_parent_stack`             | ツリー上の親を返す                                     |
| `react_get_owner_stack`              | JSX でそのコンポーネントを作成したコンポーネントを返す |
| `react_get_owner_stack_trace`        | オーナーの連なりをスタックトレース形式の文字列で返す   |
| `react_get_component_source`         | コンポーネントが定義されている位置を返す               |
| `react_start_profiling`              | レンダリング時間の記録を開始する                       |
| `react_stop_profiling`               | レンダリング時間の記録を停止する                       |
| `react_get_trace_overview`           | 記録したコミットごとの概要を返す                       |
| `react_get_commit_report`            | 1 つのコミットで描画されたコンポーネントと時間を返す   |

## コンポーネントを調べる

各ツールが何を返すのかを、MCP クライアントから直接呼び出して確認します。題材は、カートと絞り込み入力付きの商品一覧を表示するアプリです。

```jsx:src/App.jsx
import { useState } from "react";

const PRODUCTS = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  name: "Product " + (i + 1),
  price: 10 + i,
}));

export default function App() {
  const [query, setQuery] = useState("");
  const visibleProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main>
      <Cart />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter products"
      />
      <ProductList products={visibleProducts} />
    </main>
  );
}

function Cart() {
  const [count, setCount] = useState(0);
  return (
    <header>
      <CartBadge count={count} />
      <button onClick={() => setCount((c) => c + 1)}>Add to cart</button>
    </header>
  );
}

function CartBadge({ count }) {
  return <span className="badge">Cart: {count}</span>;
}

function ProductList({ products }) {
  return (
    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} />
      ))}
    </ul>
  );
}

function ProductRow({ product }) {
  // 重い整形処理の代わりに、1 行あたり約 1ms CPU を占有する
  const start = performance.now();
  while (performance.now() - start < 1) {}
  return (
    <li>
      {product.name} <b>${product.price}</b>
    </li>
  );
}
```

`ProductRow` は 1 行あたり約 1ms CPU を占有します。絞り込み入力に文字を入力するたびに `App` が再レンダリングされ、残った商品の数だけ `ProductRow` も再レンダリングされるため、入力が重くなります。後半でエージェントにこの原因を調査させます。

### 名前で検索して props と Hooks を見る

`react_find_components` は、名前の部分一致でコンポーネントを検索します。`execute_3p_developer_tool` には、ツール名と JSON 文字列のパラメーターを渡します。

```json
{
  "toolName": "react_find_components",
  "params": "{\"name\":\"Cart\"}"
}
```

`Cart` と `CartBadge` の 2 件が見つかりました。

```json
{
  "page": 1,
  "pageSize": 10,
  "totalCount": 2,
  "totalPages": 1,
  "results": [
    {
      "uid": "r0",
      "type": "function",
      "name": "Cart",
      "key": null,
      "firstChild": "r1",
      "nextSibling": null
    },
    {
      "uid": "r2",
      "type": "function",
      "name": "CartBadge",
      "key": null,
      "firstChild": "r3",
      "nextSibling": null
    }
  ]
}
```

`"r0"` のような `uid` は、他のツールでコンポーネントを指定するための識別子です。同じコンポーネントであれば再レンダリングしても変わりませんが、ページをリロードすると振り直されます。`firstChild` と `nextSibling` は、ツリーの子と兄弟を `uid` で表しています。`react_get_component_tree` も同じ形のノードを配列で返します。

`react_get_component_by_uid` に `uid` と `"includeHooks": true` を渡すと、Hooks の値も返ります。

```json
{
  "toolName": "react_get_component_by_uid",
  "params": "{\"uid\":\"r0\",\"includeHooks\":true}"
}
```

```json
{
  "uid": "r0",
  "type": "function",
  "name": "Cart",
  "hooks": [
    {
      "id": 0,
      "name": "State",
      "value": 0,
      "subHooks": []
    }
  ]
}
```

`Cart` の `useState` が `0` を保持していることがわかります。props がある場合は、`children` を除いてシリアライズできる形に変換した値が返ります。

パラメーターが `inputSchema` に合わない場合は、ページ内のツールを呼ぶ前に Chrome DevTools MCP がエラーを返します。例えば `uid` を渡さずに `react_get_component_by_uid` を呼ぶと、次のエラーになりました。

```txt
Error: Invalid parameters for tool react_get_component_by_uid: data should have required property 'uid'
```

### DOM 要素から React のコンポーネントをたどる

エージェントは通常、`take_snapshot` で取得したアクセシビリティツリーをもとにページを操作します。スナップショットの各要素には `uid=1_14` のような ID が振られています。`react_get_component_by_dom_element` を使うと、この ID から対応する React のノードを取得できます。

```txt
## Latest page snapshot
uid=1_0 RootWebArea "react-devtools-cdt-mcp example" url="http://localhost:5173/"
  uid=1_1 main
    uid=1_2 "Cart: "
    uid=1_3 "0"
    uid=1_4 button "Add to cart"
    uid=1_5 textbox "Filter products"
    uid=1_6 "Product 1"
    ...
    uid=1_14 "Product 3"
```

`element` パラメーターに、スナップショットの ID を `{ "uid": "1_14" }` の形で渡してみます。

```json
{
  "toolName": "react_get_component_by_dom_element",
  "params": "{\"element\":{\"uid\":\"1_14\"}}"
}
```

```json
{
  "uid": "r7",
  "type": "host",
  "name": "li"
}
```

結果は `<li>` 要素を表すホストコンポーネントです。スナップショットの ID を DOM 要素の参照に変換するのは Chrome DevTools MCP の役割で、React 側のツールはその参照を受け取る形にしています。どの関数コンポーネントが描画したのかを知るには、取得した `uid` を次の 2 つのツールに渡します。

`react_get_parent_stack` は、ツリー上でどこにマウントされているかを、直近の親からルートの順に返します。

```json
[
  { "uid": "r28", "name": "ProductRow", "type": "function" },
  { "uid": "r13", "name": "ul", "type": "host" },
  { "uid": "r12", "name": "ProductList", "type": "function" },
  { "uid": "r6", "name": "main", "type": "host" },
  { "uid": "r5", "name": "App", "type": "function" },
  { "uid": "r4", "name": "createRoot()", "type": "root" }
]
```

`react_get_owner_stack` は、JSX でその要素を作成したコンポーネント（オーナー）を、直近のオーナーから順に返します。

```json
[
  { "uid": "r28", "name": "ProductRow", "type": "function" },
  { "uid": "r12", "name": "ProductList", "type": "function" },
  { "uid": "r5", "name": "App", "type": "function" }
]
```

`react_get_parent_stack` には `<ul>` や `<main>` などのホストコンポーネントとルートも含まれます。一方 `react_get_owner_stack` では、JSX を書いた関数コンポーネントだけが返ります。`children` として受け取った要素を描画するコンポーネントでは、親とオーナーが一致しません。今回の例ではどちらの結果からも、画面上の「Product 3」が `App` → `ProductList` → `ProductRow` の順に作られたことがわかります。

### 定義の位置を調べる

`react_get_component_source` は、コンポーネントの定義の位置を返します。

```json
{
  "source": {
    "name": "Cart",
    "fileName": "http://localhost:5173/src/App.jsx",
    "line": 44,
    "column": 28
  }
}
```

`fileName` はファイルパスではなく、開発サーバーが配信した URL です。`line` と `column` も元のソースではなく、Vite が変換して配信したコードの位置を指していました。エージェントがソースを編集するには、URL をプロジェクト内のパスへ、行番号をソースマップで元のソースの位置へ読み替える必要があります。

## レンダリングをプロファイルする

`react_start_profiling` と `react_stop_profiling` で囲んだ間のコミットについて、レンダリング時間が記録されます。記録には `traceName` で名前を付けます。

```json
{
  "toolName": "react_start_profiling",
  "params": "{\"traceName\":\"filter\"}"
}
```

記録を開始した状態で、Chrome DevTools MCP の `fill` ツールを使い、絞り込み入力に `1` を入力します。その後 `react_stop_profiling` を呼ぶと、記録したコミット数が返ります。

```json
{
  "status": "stopped",
  "traceName": "filter",
  "commits": 1
}
```

`react_get_trace_overview` は、コミットごとの概要を返します。時間の単位はミリ秒です。

```json
[
  {
    "commit": 0,
    "committedAt": 269,
    "renderDuration": 130.19999980926514,
    "layoutDuration": 0,
    "passiveDuration": 0,
    "componentsChanged": 367
  }
]
```

1 回の入力で 367 個のコンポーネントが描画され、レンダリングに約 130ms かかりました。`react_get_commit_report` にコミットの番号を渡すと、そのコミットで描画されたコンポーネントが `actualDuration`（子を含む時間）の長い順に並びます。

```jsonc
{
  "committedAt": 269,
  "priority": "Sync",
  "renderDuration": 130.19999980926514,
  "layoutDuration": 0,
  "passiveDuration": 0,
  "components": [
    {
      "uid": "r5",
      "name": "App",
      "type": "function",
      "actualDuration": 130.19999980926514,
      "selfDuration": 1.2000000476837158
    },
    // ...（main などのホストコンポーネントは省略）
    {
      "uid": "r12",
      "name": "ProductList",
      "type": "function",
      "actualDuration": 128.69999980926514,
      "selfDuration": 2.799999952316284
    },
    // ...（ul は省略）
    {
      "uid": "r176",
      "name": "ProductRow",
      "type": "function",
      "actualDuration": 1.5,
      "selfDuration": 1.3000001907348633
    }
    // ...（残りの ProductRow は省略）
  ]
}
```

`App` の `actualDuration` は約 130ms ですが、`selfDuration`（自身だけの時間）は約 1.2ms です。時間のほとんどは子の `ProductList` 以下で使われている、ということがこの結果から読み取れます。

## エージェントにデバッグを任せる

ここまではツールを直接呼び出して確認してきましたが、実際はエージェント自身にツールの呼び出しを任せるはずです。Claude Code に次のプロンプトを渡してどのように調査するかを見てみます。

```txt
http://localhost:5173 で動いている React アプリで、商品の絞り込み入力に文字を入力すると動作が重くなります。原因を調べてください。コードは修正しないでください。
```

Claude Code はまず `src/App.jsx` を読み、続いて Chrome DevTools MCP のツールを次の順に呼び出しました。

1. `navigate_page` で `http://localhost:5173` を開く
2. `execute_3p_developer_tool` で `react_start_profiling` を呼ぶ
3. `take_snapshot` で絞り込み入力の ID（`1_5`）を調べる
4. `type_text` で `1` を入力する
5. `react_stop_profiling`、`react_get_trace_overview`、`react_get_commit_report` の順に呼ぶ

結果として「入力するたびに、絞り込み後の ProductRow がすべて再レンダーされる」ことが原因であると特定していました。その際、キーを入力するたびにおよそ 125ms かかるという具体的な数字も示していました。

![](https://images.ctfassets.net/in6v9lxmm5c8/id2r9GQFDhjD3peSmAO85/cca3ae1e0f51d20c55460dc123cf3bbb/react-devtools-cdt-mcp-1.png)

エージェントは改善の方向として `ProductRow` を `memo` でラップすることや `useDeferredValue` を使うことを提案しました。

React のツールを使わない場合、エージェントはブラウザのパフォーマンストレースのコールスタックとソースを照らし合わせて、時間を使っている関数を探すことになると考えられます。React のツールは描画されたコンポーネントと時間を直接返すため、その照らし合わせの手間を省けていることがわかります。

## まとめ

- `react-devtools-cdt-mcp` は MCP サーバーではなくページ内で動くライブラリで、Chrome DevTools MCP のサードパーティ開発者ツールの仕組みを使って React のツールを登録する
- Chrome DevTools MCP は `devtoolstooldiscovery` イベントでページのツールを見つけ、エージェントは `execute_3p_developer_tool` でそのツールを呼び出す
- 使うには Chrome DevTools MCP を `--categoryExperimentalThirdParty=true` 付きで起動し、エントリーファイルの先頭、`react-dom` より前で `react-devtools-cdt-mcp/register` を import する
- `react_get_component_by_dom_element` はスナップショットの要素 ID を受け取り、`react_get_parent_stack` と `react_get_owner_stack` でその要素を描画したコンポーネントまでたどれる
- `react_get_commit_report` はコミットで描画されたコンポーネントと `actualDuration`、`selfDuration` を返すため、エージェントは再レンダリングのボトルネックをコンポーネント単位で特定できる

## 参考

- [react-devtools-cdt-mcp – React](https://react.dev/reference/dev-tools/react-devtools-cdt-mcp)
- [[react-devtools-cdt-mcp] chrome-devtools-mcp integration · react/react#36600](https://github.com/react/react/pull/36600)
- [[react-devtools-cdt-mcp] add DOM element component lookup · react/react#36822](https://github.com/react/react/pull/36822)
- [[react-devtools] add parent stack tool · react/react#36825](https://github.com/react/react/pull/36825)
- [Developer Guide: Building third-party developer tools - ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md)
- [Unlock runtime insights: Introducing third-party developer tools for Chrome DevTools for agents | Chrome for Developers](https://developer.chrome.com/blog/devtools-for-agents-3p-tools)
