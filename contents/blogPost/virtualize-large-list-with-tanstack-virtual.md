---
id: xBG7fcNYCNU21SaDINQZs
title: "TanStack Virtual で大量の要素を仮想化して描画する"
slug: "virtualize-large-list-with-tanstack-virtual"
about: "大量の要素を一度に DOM へ追加すると、初期描画や更新のコストが増加します。TanStack Virtual はスクロール位置に応じて必要な要素だけを描画するヘッドレスな仮想化ライブラリです。この記事では React 向けの @tanstack/react-virtual を使い、リストを仮想化して描画する方法を紹介します。"
createdAt: "2026-08-18T21:25+09:00"
updatedAt: "2026-08-20T21:39+09:00"
tags: ["React", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6Ge0fX1rDucVd3S2FtZLdE/c0ed8842fb70f094789c15055d0180c6/yellow-rumped-flycatcher_23947-768x689.png"
  title: "マミジロキビタキのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "仮想リストの内側の要素に getTotalSize() の戻り値を高さとして指定する目的は何ですか？"
      answers:
        - text: "表示中の各項目を同じ高さにそろえるため"
          correct: false
          explanation: "各項目の高さは virtualItem.size や measureElement の測定結果で扱います。getTotalSize() は個々の項目を同じ高さにするための値ではありません。"
        - text: "描画していない項目を含む全体のスクロール距離を確保するため"
          correct: true
          explanation: "getTotalSize() は全項目を並べたと仮定した合計サイズを返します。内側の要素へ指定することで、DOM にない項目を含むスクロール距離を確保します。"
        - text: "スクロール要素の表示領域をウィンドウの高さに合わせるため"
          correct: false
          explanation: "表示領域の高さはスクロール要素側で 480px のように指定します。getTotalSize() は表示領域ではなくリスト全体の推定サイズです。"
        - text: "DOM に常に 10,000 個の項目を保持するため"
          correct: false
          explanation: "TanStack Virtual は必要な項目だけを DOM に配置します。getTotalSize() は全項目を DOM に追加せず、全体の距離だけを表現します。"
    - question: "overscan の値を増やした場合のトレードオフとして正しいものはどれですか？"
      answers:
        - text: "表示範囲の前後を先に描画できるが、DOM 要素数と描画コストも増える"
          correct: true
          explanation: "overscan は可視範囲の前後へ追加で描画する項目数です。空白が見える可能性を減らせる一方、追加の描画コストが発生します。"
        - text: "全項目の高さを正確に測定できるが、スクロール距離が短くなる"
          correct: false
          explanation: "overscan は測定精度や全体のスクロール距離を決める値ではありません。追加で描画する範囲を指定します。"
        - text: "DOM 要素数を減らせるが、高速スクロール時に空白が見えやすくなる"
          correct: false
          explanation: "値を増やすと追加で描画する項目も増えます。DOM 要素数を減らす方向の設定ではありません。"
        - text: "ページ内検索の対象を全 10,000 件へ広げられるが、初期描画が遅くなる"
          correct: false
          explanation: "overscan を増やしても通常は全項目が DOM に存在するわけではないため、ページ内検索の対象を全件へ広げる機能にはなりません。"
published: true
---
Web アプリケーションで大量のログやメッセージを一覧表示するとき、すべての要素を一度に表示すると操作に応答しなくなったりブラウザのタブがクラッシュしたりするおそれもあります。画面内に表示される項目が数件だけであっても、ブラウザは画面外にある要素を含めて DOM を作成し、スタイル計算やレイアウトを行い、描画コストが増加するからです。また単にリストの件数が多いと言うだけではなく、以下のような条件が重なると DOM の大きさがパフォーマンスに影響します。

- 1 項目を構成する DOM の深さや子要素が多く、ページ全体の DOM が大きい
- クラスや属性の変更によって、多数の要素でスタイルの再計算が必要になる
- 広い範囲へ一致する CSS セレクターや、照合コストの高い複雑なセレクターを使っている
- ホバーやアニメーションで、レイアウトや再描画を伴うプロパティを変更している
- 多数の DOM 要素を検索・更新する処理を繰り返している

[web.dev の DOM サイズに関する解説](https://web.dev/articles/dom-size-and-interactivity)では、大きな DOM は初期描画だけでなく、操作後のスタイル計算やレイアウトにも影響すると説明されています。また、[スタイル計算の解説](https://web.dev/articles/reduce-the-scope-and-complexity-of-style-calculations)にあるとおり、要素のクラスや属性を変更したときのコストは、影響する要素数とセレクターの複雑さに左右されます。

[MDN のレンダリングウォーターフォール](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)では、`width` や `border-width` など要素の寸法に関係するプロパティを変更すると、スタイル計算に加えてレイアウトと描画が必要になると説明されています。一方、`transform` や `opacity` の変更は、条件が整えばレイアウトと再描画を省略し、すでに描画されたレイヤーの位置や透明度を合成処理だけで更新できます。そのため、要素の寸法や配置を変えるプロパティと比べて、アニメーション中の負荷を抑えやすいという特徴があります。

大量のデータを分割して表示できるなら、まずはページングを検討するのがよいでしょう。ページングは 1 ページあたりの取得件数と DOM 要素数を抑えられ、実装も比較的単純です。現在のページを URL で共有しやすく、利用者が一覧内の位置を把握しやすい利点もあります。

一方ログ、タイムライン、チャットのように、ページの境界を意識せず連続して閲覧したい UI もあります。前後の項目を見比べるたびにページを切り替えると文脈が途切れる場合のように、ページングでは満たしにくい要件があるときに検討できる解決策がリストの仮想化です。

仮想化では、現在のスクロール位置で必要な項目だけを DOM に描画し、画面外の項目を描画対象から外すことで DOM の要素数を抑えます。ページングより実装やアクセシビリティへの配慮が複雑になるため、単に件数が多いという理由だけで採用せず、連続したスクロール体験が必要かどうかを判断基準にします。

[TanStack Virtual](https://tanstack.com/virtual/latest) は、この仮想化を実装するためのヘッドレスなライブラリです。React、Vue、Svelte などのアダプターが提供されています。コンポーネントやスタイルは提供せず、仮想化に必要な計算を担当するため、既存の UI コンポーネントやスタイルをそのまま使えます。

この記事では React と `@tanstack/react-virtual` を使い、リストを仮想化して描画する方法を紹介します。

## 大量の要素をそのまま描画する場合の問題

React で配列を一覧表示するだけであれば、`map()` ですべての項目を JSX に変換できます。比較用のデモでは、各項目にアバターやボタンなどを含む `MessageCard` を用意しました。`PlainList` は TanStack Virtual を使わず、10,000 件をすべて `<li>` 要素として描画します。

```tsx
function PlainList() {
  return (
    <div className="scroll-container">
      <ul role="list" aria-label="メッセージ一覧" className="plain-list">
        {messages.map((message, index) => (
          <li key={message.id} data-index={index} className="plain-message">
            <MessageCard index={index} />
          </li>
        ))}
      </ul>
    </div>
  );
}
```

この実装では、スクロール領域に一度に見える項目が数件であっても 10,000 個の `<li>` が DOM に存在します。さらに 1 件の `MessageCard` が約 20 個の要素を持つため、ページ全体では約 21 万個の DOM 要素になります。実際の UI でも、画像、ボタン、アイコン、メタデータなどが追加されるほど、作成・更新する要素は増えます。実際に動作するデモでは、初期描画に 1 秒以上かかったり、ホバーしてスタイルが適用される瞬間にブラウザが一時的に応答しなくなったりすることがあります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2NT5OYxQgtrHScp9PfmSNO/3f23bbafea5fc3c71fdb299384f87793/fa68e621-df24-4b84-80bf-6b13faade654.mov" controls></video>

LCP（Largest Contentful Paint）や INP（Interaction to Next Paint）などの指標を見ると、ひどいスコアが出ていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/2XoMSIRCBE7JC3UF4jZrDG/b85bf780a6019fa4a383d552053a6d0b/image.png)

仮想化は、スクロール領域の近くにある項目だけを DOM に配置することでこの問題へ対処します。画面外へ移動した項目は DOM から取り除き、新たに画面へ入る項目を追加します。この方法は DOM の要素数を抑えられるという利点がありますが、スクロール位置の計算や DOM の追加・削除の処理が必要になるため、単純にすべての項目を描画するよりも実装は複雑になります。TanStack Virtual のような仮想化ライブラリは、このような複雑な処理を抽象化し、スクロール位置に応じて必要な項目だけを描画する仕組みを提供します。

## 固定高さの仮想リストを実装する

Vite の React + TypeScript プロジェクトを作成し、`@tanstack/react-virtual` パッケージをインストールします。React 向けの `useVirtualizer` フックを提供します。

```bash
npm install @tanstack/react-virtual
```

はじめに、各項目の高さを 50px と仮定した最小の仮想リストを実装します。

```tsx:src/App.tsx
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const messages = Array.from({ length: 10_000 }, (_, index) => ({
  id: index + 1,
  body: `メッセージ ${index + 1}`,
}));

export function App() {
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length, // 仮想化する項目数
    getScrollElement: () => scrollElementRef.current, // スクロールコンテナの DOM 要素を返す
    estimateSize: () => 50, // 各項目の高さを 50px と仮定
  });

  return (
    <div
      ref={scrollElementRef}
      style={{ height: 480, overflow: "auto" }}
    >
      <ul
        style={{
          // 50px × 10,000 件 = 500,000px が設定され、
          // スクロール距離が確保される
          height: virtualizer.getTotalSize(),
          position: "relative",
          margin: 0,
          padding: 0,
          listStyle: "none",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <li
            key={virtualItem.key}
            style={{
              height: virtualItem.size,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              // 例えばインデックス 500 の場合、start は 25,000px になるため、
              // translateY(25,000px) で配置されるので、ちょうどスクロールした位置に表示される
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {messages[virtualItem.index].body}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

[`useVirtualizer` の必須オプション](https://tanstack.com/virtual/latest/docs/api/virtualizer#required-options) は `count`、`getScrollElement`、`estimateSize` の 3 つです。

- `count` は仮想化する項目の総数
- `getScrollElement` はスクロールコンテナの DOM 要素を返す関数
- `estimateSize` はインデックスを受け取り、その項目の幅または高さを返す関数

この例では 10,000 件すべてを 50px と見積もるため、`getTotalSize()` は次の値を返します。

```text
10,000 件 × 50px = 500,000px
```

この `500,000px` を `<ul>` の高さに指定することで、実際には描画していない項目を含むスクロール距離を確保します。

スクロールしてインデックス 500 の項目が表示範囲へ入った場合、その `VirtualItem` は次のような値を持ちます。これは、先頭にある 500 件分の高さが `500 × 50px = 25,000px` になるためです。

```ts
{
  index: 500,
  start: 25_000,
  size: 50,
  end: 25_050,
}
```

`getVirtualItems()` は、インデックス 500 の前後にある表示範囲付近の `VirtualItem` だけを返します。これらを通常のレイアウトフローで並べると、DOM にない約 500 件分の領域が詰められ、インデックス 500 の項目も `<ul>` の先頭付近に配置されてしまいます。そこで、各要素を絶対配置したうえで `VirtualItem.start` を `translateY()` に指定し、`<ul>` の先頭から本来の距離まで移動させます。

`top` に `VirtualItem.start` を指定しても配置できますが、`transform` の変更は、条件が整えばレイアウトと再描画を省略して合成処理だけで更新できるため、スクロールに伴う位置の更新コストを抑えやすいという特徴があります。

実際に試してみると、LCP と INP ともにスコアが大きく改善していることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7lcuTZgvDy9DV2EP9dNU4O/62e7774a5b58393af2dfc3fbc25fb94c/image.png)

## 可変高さの要素を `measureElement` で測定する

実際のメッセージは本文の長さによって高さが異なります。すべての項目を 50px と見積もったままでは、長い本文が重なったり、計算したスクロール位置と実際の位置がずれたりします。

可変高さの項目では、`estimateSize` を初期値として使い、描画後の要素を `measureElement` で測定します。以下のコードでは、長さの異なる 10,000 件のメッセージを作成します。

```tsx
type Message = {
  id: number;
  author: string;
  body: string;
};

const phrases = [
  "新しい変更内容を確認しました。",
  "次のリリースに向けてテストケースを追加しています。",
  "再現手順と期待する結果をドキュメントにまとめました。",
  "レビューで指摘された境界条件もあわせて検証する予定です。",
];

const messages: Message[] = Array.from({ length: 10_000 }, (_, index) => ({
  id: index + 1,
  author: `ユーザー ${(index % 12) + 1}`,
  body: Array.from(
    { length: (index % phrases.length) + 1 },
    (_, phraseIndex) => phrases[(index + phraseIndex) % phrases.length],
  ).join(" "),
}));
```

Virtualizer の `estimateSize` を、もっとも長い本文のメッセージでも収まる値へ変更します。

```tsx
const scrollElementRef = useRef<HTMLDivElement>(null);

const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => scrollElementRef.current,
  estimateSize: () => 220,
});
```

公式の [`estimateSize` の説明](https://tanstack.com/virtual/latest/docs/api/virtualizer#estimatesize) では、動的に要素を測定する場合、無理のない範囲で想定される最大サイズを見積もることが推奨されています。実際の高さとの差が小さいほど、測定後に合計サイズやスクロール位置を補正する量を抑えられます。

このサンプルの項目の高さを実際に測定すると、本文の長さに応じて 160px から 213px の幅がありました。そこで、もっとも高い項目でも収まる値として 220px を指定しています。

続いて、描画する `<li>` に `data-index` と `ref={virtualizer.measureElement}` を指定します。

```tsx
<ul
  className="message-list"
  style={{ height: virtualizer.getTotalSize() }}
>
  {virtualizer.getVirtualItems().map((virtualItem) => {
    return (
      <li
        key={virtualItem.key}
        data-index={virtualItem.index}
        ref={virtualizer.measureElement}
        className="message"
        style={{ transform: `translateY(${virtualItem.start}px)` }}
      >
        <MessageCard index={virtualItem.index} />
      </li>
    );
  })}
</ul>
```

`measureElement` は React の ref コールバックとして呼ばれ、描画された要素のサイズを Virtualizer へ伝えます。要素にはインデックスを特定するための `data-index` も必要です。`data-index` は可変高さの要素を測定値と対応付けるための属性で、`getTotalSize()` と後続項目の `start` に反映されます。

:::warning
項目どうしの間隔は `margin` で指定できません。`measureElement` が測定する `getBoundingClientRect()` の値には `margin` が含まれないため、Virtualizer が把握する高さが実際の占有領域より小さくなり、項目が重なって表示されます。余白は `padding` で作るか、[`gap`](https://tanstack.com/virtual/latest/docs/api/virtualizer#gap) オプションで指定してください。
:::

## `getItemKey` でデータ変更後も同じ項目を識別する

[`getItemKey`](https://tanstack.com/virtual/latest/docs/api/virtualizer#getitemkey) は、項目のキー（`id` など）を返す関数です。`getItemKey` の既定値は配列のインデックスです。項目の追加、削除、並べ替えがない静的なリストであれば、既定値でも問題にならない場合があります。

他方でメッセージの削除がある場合を考えてみましょう。例えばインデックス 0 のメッセージを削除すると、それまでインデックス 1 だったメッセージがインデックス 0 になります。このようにメッセージのキーが途中で変化してしまうと、Virtualizer が保持する測定値や React が再利用する DOM 要素を、削除前とは異なるメッセージへ対応付けるおそれがあります。そこで安定するキーを返す `getItemKey` を指定することで、削除や並べ替えがあっても同じメッセージを識別できます。

次の例では、並び順が変わっても同じメッセージを識別できる `message.id` をキーとして返します。

```tsx
const [messages, setMessages] = useState(initialMessages);

// 安定するキーとして id を返す
const getItemKey = useCallback(
  (index: number) => messages[index].id,
  [messages],
);

const virtualizer = useVirtualizer({
  count: messages.length,
  getScrollElement: () => scrollElementRef.current,
  estimateSize: () => 220,
  getItemKey,
});
```

## `overscan` でスクロール時の表示を調整する

`overscan` は可視範囲の前後へ追加で描画する項目数です。[API ドキュメント](https://tanstack.com/virtual/latest/docs/api/virtualizer#overscan) によるとデフォルト値は `1` です。値を増やすと、高速にスクロールしたときに次の項目が描画されるまで空白が見える可能性を減らせます。

```diff
const virtualizer = useVirtualizer({
  // ...
+  overscan: 5,
});
```

一方、`overscan` を増やすほど画面外に作成する DOM 要素も増えます。適切な値は項目の描画コスト、スクロール領域の大きさ、利用する端末によって変わります。大きな値を指定すれば常に滑らかになるわけではありません。まず小さな値から始め、実際のコンテンツと対象端末で確認してください。

## アクセシビリティと利用上の注意点

仮想リストでは集合の一部しか DOM に存在しません。そのため支援技術を利用するユーザーでは、おおよそ何件の項目が存在するのか、現在の項目が集合内の何番目かを正しく把握できない場合があります。支援技術が読み上げる総数や位置は、DOM に存在する項目の数や順序に基づいているためです。

仮想化したリストをアクセシブルにするため、集合の総数と現在の位置を支援技術へ伝える ARIA 属性を追加します。

- [`aria-setsize`](https://www.w3.org/TR/wai-aria/#aria-setsize) は、集合全体の要素数を示す属性。総数が判明している場合は実際の要素数を、判明していない場合は `-1` を指定する
- [`aria-posinset`](https://www.w3.org/TR/wai-aria/#aria-posinset) は、集合の中での要素の位置を示す属性。1 以上かつ、総数が判明している場合は `aria-setsize` 以下の整数値を指定する

```diff
 <ul
   className="message-list"
   style={{ height: virtualizer.getTotalSize() }}
 >
   {virtualizer.getVirtualItems().map((virtualItem) => (
     <li
       key={virtualItem.key}
       data-index={virtualItem.index}
       ref={virtualizer.measureElement}
+      aria-posinset={virtualItem.index + 1}
+      aria-setsize={messages.length}
       className="message"
       style={{ transform: `translateY(${virtualItem.start}px)` }}
     >
       {/* メッセージの内容 */}
     </li>
   ))}
 </ul>
```

`aria-posinset` には 1 から始まる集合内の位置を指定するため、0 から始まる `virtualItem.index` に 1 を加えます。`aria-setsize` には、DOM に存在しない項目を含む集合全体の件数である `messages.length` を指定します。

これらの属性は、すべての項目が DOM に存在する通常のリストでは不要です。ブラウザが DOM から位置と総数を計算できるためです。仮想リストのように集合の一部だけを DOM に描画する場合に、各 `<li>` へ指定します。

ブラウザは `aria-posinset` と `aria-setsize` の論理的な正しさまで保証しません。古い総数や範囲外の位置を指定すると、支援技術へ誤った情報を伝えるおそれがあります。WAI-ARIA Authoring Practices Guide では「[No ARIA is better than Bad ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/#no-aria-is-better-than-bad-aria)」という原則が示されています。値を正しく維持できない場合は、誤った値を固定して残すより属性を省略し、まずネイティブのリスト構造を保つ方が安全です。

さらに、一部の項目だけを DOM に描画することは、ブラウザが提供する機能やフォーカス管理にも影響します。仮想化スクロールは以下のような問題を引き起こす可能性があります。

- DOM にない項目はブラウザのページ内検索で見つけられない
- 印刷対象も、その時点で DOM に存在する表示範囲付近の項目だけになる可能性がある。
- ブラウザで全選択してコピーしても、DOM にない項目のテキストは選択範囲へ含まれない
- ボタンやリンクなど、フォーカス中の要素を含む項目がスクロールによってアンマウントされると、その要素のフォーカスは失われる。フォーカス中の項目を描画対象に残すか、移動先を描画してからフォーカスを復元する仕組みが必要

## まとめ

- TanStack Virtual はマークアップやスタイルを提供せず、スクロール位置から描画する項目と配置位置を計算するヘッドレスな仮想化ライブラリ
- 大量のデータではまず単純なページングを検討し、ページ境界のない連続した閲覧体験が必要な場合に仮想化を選択する
- `getTotalSize()` で全項目分のスクロール距離を確保し、`getVirtualItems()` が返す項目だけを絶対配置することで DOM の要素数を抑えられる
- 可変高さの項目では `estimateSize` を初期値として使い、`data-index` と `measureElement` で描画後の実寸を Virtualizer へ伝える
- 項目を追加、削除、並べ替えするリストでは、`getItemKey` から安定した ID を返すことで測定値とデータの対応を維持できる
- `overscan` を増やすと表示範囲の前後を先に描画できるが、DOM 要素数と描画コストも増えるため実際のコンテンツで調整する
- 仮想リストでは一部の項目しか DOM に存在しないため、集合内の位置、フォーカス、ページ内検索、印刷、全選択・コピー、支援技術での読み上げを別途考慮する必要がある

## 参考

- [TanStack Virtual Introduction](https://tanstack.com/virtual/latest/docs/introduction)
- [React TanStack Virtual Fixed Example](https://tanstack.com/virtual/latest/docs/framework/react/examples/fixed)
- [TanStack/virtual - GitHub](https://github.com/TanStack/virtual)
- [Avoid an excessive DOM size - web.dev](https://web.dev/articles/dom-size-and-interactivity)
- [Reduce the scope and complexity of style calculations - web.dev](https://web.dev/articles/reduce-the-scope-and-complexity-of-style-calculations)
- [Animation performance and frame rate - MDN](https://developer.mozilla.org/en-US/docs/Web/Performance/Guides/Animation_performance_and_frame_rate)
- [Accessible Rich Internet Applications (WAI-ARIA) 1.2](https://www.w3.org/TR/wai-aria/)
