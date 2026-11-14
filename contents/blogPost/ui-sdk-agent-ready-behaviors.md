---
id: Me_6Zi_0VtbiMA0mMayRb
title: "エージェントが作り、エージェントが使う Vercel の UI SDK"
slug: "ui-sdk-agent-ready-behaviors"
about: "UI SDK は Vercel Labs が公開した、キーボード操作やフォーカス、ARIA などの振る舞いをフレームワーク非依存で提供するヘッドレス UI ライブラリです。AI エージェントをコンポーネントの作り手と UI の使い手の両方として扱う点が、既存のヘッドレス UI と異なります。この記事では Claude Code に UI SDK でトランスファーリストを作らせ、エージェントブリッジから操作するまでを確認します。"
createdAt: "2026-11-13T20:27+09:00"
updatedAt: "2026-11-13T20:27+09:00"
tags: ["AI", "UI SDK", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/67M8FG9uCTsGTdCvxSRE6T/230e25fc7b96c4980b42e16cccb70478/walnut_24068-768x610.png"
  title: "くるみのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "UI SDK で definePrimitive を使って定義する primitive には、何がまとめられていますか？"
      answers:
        - text: "コンポーネントのスタイル、テーマ、アニメーション"
          correct: false
          explanation: "UI SDK のパーツはスタイルを持たず、状態を data-* 属性と CSS 変数として公開するだけです。見た目は利用者が決めます。"
        - text: "1 つのコンポーネントの状態（state）、操作（api）、パーツ（slots）"
          correct: true
          explanation: "記事の通り、primitive は 1 つのコンポーネントの状態、操作、DOM 要素の単位であるパーツをまとめた定義です。behavior は api の中で生成してパーツに接続します。"
        - text: "React、Vue などフレームワークごとのコンポーネントの実装"
          correct: false
          explanation: "primitive はフレームワークに依存しません。フレームワークのコンポーネントは、アダプターの createParts に primitive を渡して得ます。"
        - text: "エージェントブリッジの snapshot、query、act の 3 つのメソッド"
          correct: false
          explanation: "これらは createAgent で作るエージェントブリッジのメソッドです。primitive 側では agent キーでエージェントに公開する操作を宣言するだけです。"
    - question: "エージェントブリッジのメソッドのうち、手順を受け取り、各コンポーネントの API を呼び出して UI を操作するものはどれですか？"
      answers:
        - text: "snapshot"
          correct: false
          explanation: "snapshot はページ上のコンポーネントと、その状態、呼び出せる操作を一覧するメソッドで、UI は変更しません。"
        - text: "query"
          correct: false
          explanation: "query はラベルやテキストから、コンポーネントや Select の選択肢などを探すメソッドです。"
        - text: "registerTools"
          correct: false
          explanation: "registerTools はブリッジを WebMCP のツールとしてブラウザ内蔵のエージェントに公開する関数で、ブリッジのメソッドではありません。"
        - text: "act"
          correct: true
          explanation: "記事の通り、act に steps を渡すと、ブリッジがコンポーネントの API を呼び出します。1 回の呼び出しで複数の手順を実行できます。"
published: true
---
[Radix Primitives](https://www.radix-ui.com/primitives) や [React Aria](https://react-aria.adobe.com/) のようなヘッドレス UI ライブラリは、スタイルを持たない代わりに、キーボード操作、フォーカス管理、ARIA 属性といった振る舞いを提供してきました。開発者はメニューやダイアログの複雑なアクセシビリティを自分で実装せずに済み、見た目だけを自分のデザインシステムに合わせられます。

ただし、この恩恵を受けられるのは、ライブラリが提供しているコンポーネントを使う場合に限られます。例えばカンバンボードや特定の業務に合わせたピッカーは、一般的なヘッドレス UI ライブラリには含まれていません。コーディングエージェントが台頭したことにより、ライブラリにないコンポーネントをエージェントが直接作るようになりました。エージェントはこうしたコンポーネントを短時間で生成しますが、完成したコンポーネントに組み込まれた振る舞いをそのまま流用できないため、フォーカスの移動先や矢印キーの扱い、スクリーンリーダーへの読み上げを毎回一から書くことになり、細かな誤りが混ざりがちです。

また、完成した UI を人間ではなくエージェントが操作する場面が増えました。エージェントは DOM のアクセシビリティツリーを読み、コンポーネントの意味を理解しますが、DOM ツリーからはこのコンポーネントで何ができるかはわかりません。そのため、エージェントは人間と同じクリックやキー入力を再現して UI を操作することになります。このことは、人間向けの UI ではエージェントが扱いにくいことを意味します。

例えば、独自に実装したセレクトボックスで都道府県を選ぶ場面を考えてみましょう。エージェントはセレクトボックスをクリックし、選択肢の一覧が開くのを待ち、アクセシビリティツリーを読み直して選択肢を見つけてから、目的の選択肢をクリックします。操作のたびにツールを呼び出してページを読み直すため、値を 1 つ選ぶだけで何往復もかかり、その分の時間とトークンを消費します。

一方、セレクトボックス自身が「選べる選択肢の一覧」と「値を設定する操作」をエージェントに公開していれば、エージェントは選択肢を指定して 1 回の呼び出しで値を設定できます。人間向けの入力を再現させるのではなく、コンポーネントの意味の単位で直接操作できるようにすることが、エージェントにとって扱いやすい UI の条件になります。

2026 年 11 月 12 日に Vercel Labs がベータ版として公開した [UI SDK](https://ui-sdk.dev) は、この 2 つの変化を前提に設計されたヘッドレス UI ライブラリです。

この記事では、UI SDK の構成と既存のヘッドレス UI との違いを整理したうえで、Claude Code に UI SDK でトランスファーリストを作らせ、そのコンポーネントをエージェントが操作するまでを確認します。

:::warning
UI SDK は 2026 年 11 月 13 日時点でベータ版（`@ui-sdk/core@0.1.0-beta.1`）です。API、ドキュメント、挙動は正式リリースまでに変わる可能性があります。
:::

## UI SDK の特徴

UI SDK は自身を「コンポーネントライブラリではなく、その下の層」と位置付けています。リポジトリの [AGENTS.md](https://github.com/vercel-labs/ui/blob/main/AGENTS.md) は次のように説明しています。

> It isn't a component library. It's the layer underneath one: …

この下の層に相当するのが behavior です。behavior は「矢印キーでフォーカスを移動する」「文字を入力すると該当する選択肢へ移動する」「ボタンの隣にポップアップを開き、閉じたらフォーカスを戻す」のような、UI が行う 1 つの仕事を担う関数で、それぞれ `createRovingFocus`、`createTypeahead`、`createPopup` という名前で `@ui-sdk/core` から提供されます。50 を超える behavior があり、組み合わせることで複雑なコンポーネントを作れます。

UI SDK は同じ behavior を使って作った Select や Date Picker など 50 以上のコンポーネントも提供していますが、ライブラリにないコンポーネントを behavior から組み立てることを前提にしている点が特徴です。UI SDK が既存のライブラリと異なるのは、AI エージェントを次の 2 つの立場で設計に組み込んでいる点です。

- コンポーネントの作り手: ライブラリにないコンポーネントを、エージェントが behavior から組み立てる
- UI の使い手: 完成した画面のコンポーネントを、エージェントが状態とアクションの単位で読み書きする

## behavior と primitive

UI SDK でコンポーネントを作るときは、`definePrimitive` で primitive を定義します。primitive は 1 つのコンポーネントの状態（`state`）、操作（`api`）、DOM 要素の単位であるパーツ（`slots`）をまとめた定義です。behavior は `api` の中で生成し、パーツの属性やイベントへ接続します。

primitive はフレームワークに依存しません。各フレームワークのアダプターが提供する `createParts` に渡すと、React なら `Root` や `Input` のようなコンポーネントが得られます。パーツはスタイルを持たず、状態を `data-*` 属性と CSS 変数として公開します。

UI SDK の README は、primitive を人間が手で書くことよりも、エージェントが書くことを前提にしていると説明しています。

> Don't worry, you don't need to learn how to write this. Your agents will.

## エージェントにトランスファーリストを作らせる

UI SDK を使用してトランスファーリストを作ってみましょう。トランスファーリストは左右 2 つのリストの間で項目を移動するコンポーネントで、矢印キーでの移動、複数選択、移動後のフォーカスの行き先、スクリーンリーダーへの読み上げといった振る舞いを適切に実装する必要があります。

### 準備

Vite の React テンプレートで作ったプロジェクトに、UI SDK のコアと React アダプターをインストールします。React アダプターは React 19 以降が必要です。

```bash
npm install @ui-sdk/react@0.1.0-beta.1 @ui-sdk/core@0.1.0-beta.1
```

UI SDK は公式のスキル `ui-sdk` を配布しています。[skills](https://github.com/vercel-labs/skills) CLI でプロジェクトに追加します。

```bash
npx skills add vercel-labs/ui --skill ui-sdk
```

同じスキルは `node_modules/@ui-sdk/core/skills/ui-sdk/SKILL.md` にも同梱されています。

### プロンプト

[公式ドキュメント](https://ui-sdk.dev/docs/agents/build-with-an-agent)は、作りたいコンポーネントで人がどのような操作をできるべきかを、具体的に伝えるよう勧めています。それに従って、次のプロンプトを書きました。

```text
ui-sdk スキルを使って、React でトランスファーリストを作ってください。

左に「未割り当て」、右に「割り当て済み」の 2 つのリストがあり、プロジェクトのメンバーを左右に移動できるコンポーネントです。

- 各リストには Tab で 1 回だけフォーカスが入り、上下の矢印キーで項目間を移動する
- Space で項目を選択・選択解除でき、複数の項目を選択できる
- 2 つのリストの間にある「割り当てる」「外す」ボタンで、選択中の項目を反対側のリストへ移動する
- 移動後もフォーカスを見失わないようにする。移動元のリストに項目が残っていれば、そのリストにフォーカスを戻す
- 移動した件数をスクリーンリーダーに読み上げる
- 割り当て済みの値は親コンポーネントが持ち、変更を受け取れるようにする
- エージェントが createAgent を通じてメンバーを割り当てたり外したりできるようにする

固定の 6 人のメンバーと、1 つの例のページから始めてください。スタイルは最小限で構いません。

キーボード操作、フォーカス、ARIA をテストし、typecheck と関連するテストを実行してください。開発サーバーは起動しないでください。最後に、実行したコマンドと結果、確認できなかったことを報告してください。
```

このプロンプトで Claude Code に作業してもらいます。実行ログを見ると、エージェントはスキルの指示どおり、`llms.txt`、`core.md` の該当するセクション、型定義を読んでから実装に入っていました。作成されたファイルは次のとおりです。

- `src/transfer-list/primitive.ts`: トランスファーリストの primitive
- `src/transfer-list/transfer-list.tsx`: React 用のラッパー
- `src/transfer-list/transfer-list.test.tsx`: Vitest のテスト
- `src/agent.ts`: `createAgent()` でブリッジを作るモジュール
- `src/App.tsx`、`src/members.ts`: 動作例のページ

### 生成された primitive を読む

`src/transfer-list/primitive.ts` の中心は、`definePrimitive` の呼び出し 1 つです。まず全体の構成を見てみましょう。

```ts:src/transfer-list/primitive.ts
import {
  announce,
  createChange,
  createFocusRecovery,
  createRovingFocus,
  createSelection,
  definePrimitive,
  type ChangeDetails,
} from "@ui-sdk/core";

// 型（TransferListOptions、TransferListState など）と補助関数は省略

const transferList = definePrimitive({
  // コンポーネントの名前。スナップショットの component にもこの名前が入る
  name: "transfer-list",
  // コンポーネントが受け取るオプションと、その種類
  options: {
    items: "value",
    value: "list",
    defaultValue: "list",
    onValueChange: "callback",
  },
  // 親が value、defaultValue、onValueChange で制御できる状態
  controlled: ["value"],
  // 状態の初期値
  state: (options: TransferListOptions): TransferListState => ({
    items: options.items ?? [],
    value: options.value ?? options.defaultValue ?? [],
    selected: [],
    focusedAvailable: null,
    focusedAssigned: null,
  }),
  // オプションが変わるたびに、制御されている値を状態へ反映する（省略）
  sync: (options) => ({ /* ... */ }),
  // コンポーネントの操作。behavior はここで生成する
  api: (context) => { /* ... */ },
  // DOM 要素の単位であるパーツ
  slots: (slot) => { /* ... */ },
  // エージェントに公開する操作
  agent: { actions: ["assign", "unassign"], items: (api) => api.items() },
});
```

`options`、`state`、`api`、`slots` が、前の節で説明した primitive の構成要素にあたります。ここからは、`api`、`slots`、`agent` の中身を順に見ていきます。

#### api: behavior を組み合わせる

`api` では、次の behavior と関数を組み合わせていました。いずれも `@ui-sdk/core` から提供される関数です。

- `createSelection`: 複数選択の状態を管理する
- `createRovingFocus`: リストごとに Tab で止まる位置を 1 つにし、矢印キーで項目間のフォーカスを移動する
- `createFocusRecovery`: フォーカスしていた項目が消えたとき、代わりの要素へフォーカスを移す
- `announce`: スクリーンリーダーに読み上げる文をライブリージョンに入れる
- `createChange`: 値の変更を `onValueChange` に通知し、親がキャンセルできるようにする

`api` の全体は次のとおりです。

```ts:src/transfer-list/primitive.ts
api: (context) => {
  const { store } = context;
  const change = createChange(context);
  const selection = createSelection(context, {
    key: "selected",
    multiple: () => true,
    // set、order は省略
  });

  // 左右のリストごとに、フォーカスの移動と回復の behavior を作る
  const block = (side: Side) => ({
    roving: createRovingFocus<TransferListState, OptionProps>(context, {
      slot: optionSlot[side], // "availableOption" か "assignedOption"
      key: focusKey[side], // "focusedAvailable" か "focusedAssigned"
    }),
    recovery: createFocusRecovery<OptionProps>({
      fallback: (lost) => {
        // 消えた項目に最も近い、同じリストの項目を返す（省略）
      },
    }),
  });
  const blocks = {
    available: block("available"),
    assigned: block("assigned"),
  };

  const move = (to: Side, requested: string[] | undefined, event?: Event) => {
    // 後述
  };

  return {
    selection,
    blocks,
    assign: (ids?: string[], event?: Event) => move("assigned", ids, event),
    unassign: (ids?: string[], event?: Event) => move("available", ids, event),
    items: () =>
      store.get().items.map((item) => ({ value: item.id, label: item.label })),
  };
},
```

左右のリストはどちらも同じ振る舞いを持つため、`block` という関数で同じ behavior を 2 つ作っています。`createRovingFocus` の `slot` には、フォーカスを移動させるパーツの名前を渡しています。`key` は、どの項目にフォーカスがあるかを保存する状態のキーです。

`api` が返すオブジェクトが、コンポーネントの操作になります。`blocks` と `selection` は後述の `slots` から、`assign`、`unassign`、`items` は `agent` キーから参照されます。

`assign` と `unassign` が呼ぶ `move` 関数の後半では、`change` 関数を呼び、親が変更をキャンセルしなかった場合にだけ、件数を読み上げてフォーカスを移動します。

```ts:src/transfer-list/primitive.ts
const move = (to: Side, requested: string[] | undefined, event?: Event) => {
  // 移動元のリスト（from）、移動する項目の id（ids）、
  // 移動後の割り当て済みの値（value）を求める（省略）

  if (
    !change("value", value, {
      reason: to === "assigned" ? "assign" : "unassign",
      event,
    })
  ) {
    return false;
  }

  store.set({ selected: state.selected.filter((id) => !moved.has(id)) });
  announce(
    to === "assigned"
      ? `${ids.length} 人を割り当てました`
      : `${ids.length} 人を外しました`,
  );

  // 移動元のリストに残った項目のうち、移動した項目に最も近いもの
  const stay = nearest(
    state.items.map((item) => item.id),
    (id) => pool.includes(id) && !moved.has(id),
    ids[0],
  );
  const target = stay
    ? { side: from, key: stay }
    : { side: to, key: ids[0] };
  blocks[target.side].roving.focus(target.key);
  return true;
};
```

`change` の第 3 引数の `reason` は、変更の理由を表す文字列です。親は `onValueChange(value, details)` の `details.reason` で理由を、`details.source` で変更の出どころ（キーボード、マウス、エージェントなど）を受け取ります。移動元のリストに項目が残っていればそのうち最も近い項目へ、残っていなければ移動先のリストへフォーカスを移します。

#### slots: パーツを定義する

`slots` は、`slot` 関数でパーツを定義して返します。各項目のパーツでは、`attrs` が状態から ARIA 属性を計算し、`bind` が要素と behavior を接続します。

```ts:src/transfer-list/primitive.ts
slots: (slot) => {
  const option = (side: Side) =>
    slot<OptionProps>({
      role: "option",
      focus: "roving",
      props: { value: "string" },
      attrs: (state, part) => ({
        tabindex: part.api.blocks[side].roving.tabIndex(state, part),
        "aria-selected": String(state.selected.includes(part.key)),
        "data-selected": state.selected.includes(part.key) ? "" : undefined,
      }),
      // press、on.keydown、bind は省略
    });
  // リスト（listbox）と移動ボタン（button）のパーツも同じように定義する（省略）

  return {
    root: slot({ role: "group" }),
    available: list(),
    availableOption: option("available"),
    assigned: list(),
    assignedOption: option("assigned"),
    assign: mover("assigned"),
    unassign: mover("available"),
  };
},
```

`attrs` の `part.api` から、`api` が返した `blocks` を参照しています。返したオブジェクトのキー（`root`、`availableOption` など）が、そのままパーツの名前になります。

#### agent: エージェントに公開する操作

`definePrimitive` の最後の `agent` キーは、エージェントに公開する API を宣言する部分です。`actions` にはエージェントが呼び出せる操作の名前を、`items` にはエージェントが取得できる項目の一覧を返す関数を指定します。

```ts:src/transfer-list/primitive.ts
agent: { actions: ["assign", "unassign"], items: (api) => api.items() },
```

`actions` の `assign` と `unassign` は、`api` が返した同名のメソッドです。`items` の引数の `api` も、`api` が返したオブジェクトです。エージェントがどのように操作するかは、後の節で説明します。

#### React のラッパー

React のラッパーでは、`createParts` に primitive と各パーツの要素名を渡しています。

```tsx:src/transfer-list/transfer-list.tsx
import { createParts } from "@ui-sdk/react/primitive";
import { transferList } from "./primitive";

const parts = createParts(transferList, {
  root: "div",
  available: "ul",
  availableOption: "li",
  assigned: "ul",
  assignedOption: "li",
  assign: "button",
  unassign: "button",
});
```

`parts.Root`、`parts.Available`、`parts.AvailableOption` などのコンポーネントが得られます。同じファイルの `TransferList` コンポーネントは、これらのパーツに見出しとメンバーの一覧を配置します。

```tsx:src/transfer-list/transfer-list.tsx
import { useId } from "react";
import {
  listOf,
  type TransferItem,
  type TransferListOptions,
} from "./primitive";

type TransferListProps = {
  label: string;
  items: TransferItem[];
  value: string[];
  onValueChange: NonNullable<TransferListOptions["onValueChange"]>;
};

function TransferList({
  label,
  items,
  value,
  onValueChange,
}: TransferListProps) {
  const id = useId();
  const state = {
    items,
    value,
    selected: [],
    focusedAvailable: null,
    focusedAssigned: null,
  };
  // listOf は primitive.ts の関数で、value に含まれるかどうかで項目を左右に振り分ける
  const available = listOf(state, "available");
  const assigned = listOf(state, "assigned");

  return (
    <parts.Root
      aria-label={label}
      items={items}
      value={value}
      onValueChange={onValueChange}
    >
      <div>
        <h3 id={`${id}-available`}>未割り当て</h3>
        <parts.Available aria-labelledby={`${id}-available`}>
          {available.map((item) => (
            <parts.AvailableOption key={item.id} value={item.id}>
              {item.label}
            </parts.AvailableOption>
          ))}
        </parts.Available>
        {available.length === 0 && <p>メンバーはいません</p>}
      </div>
      <div>
        <parts.Assign>割り当てる</parts.Assign>
        <parts.Unassign>外す</parts.Unassign>
      </div>
      <div>
        <h3 id={`${id}-assigned`}>割り当て済み</h3>
        <parts.Assigned aria-labelledby={`${id}-assigned`}>
          {assigned.map((item) => (
            <parts.AssignedOption key={item.id} value={item.id}>
              {item.label}
            </parts.AssignedOption>
          ))}
        </parts.Assigned>
        {assigned.length === 0 && <p>メンバーはいません</p>}
      </div>
    </parts.Root>
  );
}

export { TransferList, type TransferListProps };
```

`items`、`value`、`onValueChange` は `parts.Root` に渡すと primitive のオプションになり、`aria-label` などの HTML 属性はそのまま要素に適用されます。各項目のパーツには `key` と `value` に同じ id を渡しており、primitive はこの `value` を `part.key` として、選択状態や ARIA 属性の計算に使います。キーボード操作、選択、ARIA 属性はパーツ側が持つため、ラッパーはマークアップを並べるだけで済んでいます。

最終的に `App.tsx` では `TransferList` コンポーネントを次のように使っています。

```tsx:src/App.tsx
import { useState } from "react";
import { members } from "./members";
import { TransferList } from "./transfer-list/transfer-list";

function App() {
  const [assigned, setAssigned] = useState<string[]>(["aiko"]);

  return (
    <main>
      <h1>プロジェクトメンバー</h1>
      <TransferList
        label="プロジェクトメンバーの割り当て"
        items={members}
        value={assigned}
        onValueChange={setAssigned}
      />
      <p>
        割り当て済み:{" "}
        {members
          .filter((member) => assigned.includes(member.id))
          .map((member) => member.label)
          .join("、") || "なし"}
      </p>
    </main>
  );
}

export default App;
```

### ブラウザで操作する

開発サーバーを起動すると、次のトランスファーリストが表示されます。左右の「未割り当て」と「割り当て済み」リストにメンバーの一覧が並んでおり、2 つのリストの間に「割り当てる」と「外す」のボタンがあります。

![左に未割り当てのメンバー 5 人のリスト、右に割り当て済みのメンバー 1 人のリスト、その間に「割り当てる」と「外す」のボタンが並んだトランスファーリスト](https://images.ctfassets.net/in6v9lxmm5c8/4QSZGsPVQNtFgK9IdkgPAM/49e35d5921dcd14af6977394575b1eda/ui-sdk-agent-ready-behaviors-1.jpg)

このトランスファーリストでは、キーボードで次の操作ができます。

- Tab で各リストにフォーカスが入る。リスト内の項目間は上下の矢印キーで移動する
- Space で項目を選択・選択解除する。複数の項目を選択でき、選択した項目は `aria-selected="true"` になる
- 「割り当てる」「外す」ボタンで、選択中の項目を反対側のリストへ移動する
- 移動後、移動元のリストに項目が残っていれば、その中で最も近い項目にフォーカスが移る。残っていなければ、移動先のリストにフォーカスが移る
- 移動した件数が、`aria-live="polite"` のライブリージョンを通じてスクリーンリーダーに読み上げられる

実際に、以下のとおりにリストを移動できていることが確認できました。

![2 人を右のリストへ移動した後、左のリストに残った項目にフォーカスリングが表示されているトランスファーリスト](https://images.ctfassets.net/in6v9lxmm5c8/19BUfMjRJcEIvS1of5S8HJ/ab1054a6e8850447f00985cbc1f71cbf/ui-sdk-agent-ready-behaviors-2.jpg)

## エージェントが UI を操作する

ここからは、完成した画面をエージェントに操作させてみます。UI SDK はエージェントが操作しやすい UI を提供するために、エージェントブリッジという仕組みを用意しています。エージェントブリッジは、ページ上にある UI SDK のコンポーネントと AI エージェントのあいだを仲介するオブジェクトで、`createAgent` で作成します。ブリッジは次の 3 つのメソッドを持ち、それぞれをそのままエージェントのツールとして使えます。

- `snapshot`: ページ上のコンポーネントと、その状態、呼び出せる操作を一覧する
- `query`: ラベルやテキストから、コンポーネントや Select の選択肢などを探す
- `act`: 手順を受け取り、各コンポーネントの API を呼び出して操作する

ブリッジはコンポーネントが公開している API を直接呼び出します。これにより、エージェントはスクリーンショットを読んだり、クリックやキー入力を再現せずに UI を操作できるようになります。

作成したブリッジは、`agentTools` が提供するツール定義と組み合わせて自前のエージェントに渡したり、`registerTools` で WebMCP のツールとしてブラウザ内蔵のエージェントに公開したりできます。この記事では、ブラウザのコンソールからブリッジを呼び出して動作を確認します。

### スナップショットを読む

ブリッジは生成されたコンポーネントを内部のレジストリから見つけるため、ページを描画する前に作成する必要があります。`src/agent.ts` でブリッジを作成し、コンソールから試せるよう `Object.assign()` で `window` にも公開します。

```ts:src/agent.ts
import { createAgent } from "@ui-sdk/react/agent";

const agent = createAgent();

Object.assign(window, { agent });

export { agent };
```

`main.tsx` では、アプリを描画する前にこのモジュールを読み込みます。`import "./agent"` をファイルの先頭に置き、ほかのどのモジュールよりも先にブリッジが作られるようにします。

```tsx:src/main.tsx
import "./agent";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

ブラウザのコンソールで `window.agent.snapshot()` を呼ぶと、次の結果が返りました。

```jsonc
[
  {
    "ref": "c1",
    "component": "transfer-list",
    "actions": ["assign", "unassign"],
    "label": "プロジェクトメンバーの割り当て",
    "value": ["aiko", "chika", "emi"],
    "items": [
      { "value": "aiko", "label": "相沢 愛子" },
      { "value": "bunta", "label": "馬場 文太" },
      // 省略...
    ]
  }
]
```

`actions` には、primitive の `agent` キーで宣言した `assign` と `unassign` が並んでいます。`label` はコンポーネントのアクセシブルな名前で、ラッパーが Root に渡した `aria-label` から計算されています。`items` は `agent` キーの `items` 関数が返した値です。

### アクションを実行する

`agent.act()` に手順（`steps`）を渡すと、ブリッジがコンポーネントの API を呼び出します。`ref` にはスナップショットの `ref` かラベルを指定でき、1 回の呼び出しで複数の手順を実行できます。

```ts
await window.agent.act({
  steps: [
    { ref: "プロジェクトメンバーの割り当て", action: "assign", args: [["古川 文夫"]] },
    { ref: "プロジェクトメンバーの割り当て", action: "unassign", args: [["emi"]] },
  ],
});
```

実行すると、次の結果が返りました。

```jsonc
{
  "ok": true,
  "steps": [
    {
      "step": 0,
      "ref": "c1",
      "changes": [
        {
          "component": "transfer-list",
          "label": "プロジェクトメンバーの割り当て",
          "key": "value",
          "value": ["aiko", "chika", "emi", "fumio"]
        }
      ]
    },
    // 2 つ目の手順（unassign）の結果は省略
  ],
  "appeared": [],
  "values": {
    "c1 プロジェクトメンバーの割り当て": ["aiko", "chika", "fumio"]
  }
}
```

`steps` には手順ごとに変化した値が、`values` にはすべての手順を実行した後の値が入っています。エージェントは画面を読み直さなくても、この結果から操作が反映されたことを確認できます。画面上の 2 つのリストにも変更が反映されました。

`agent` キーで宣言していない操作を指定すると、ブリッジは実行を拒否し、使える操作を返します。

```ts
await window.agent.act({
  steps: [{ ref: "プロジェクトメンバーの割り当て", action: "setValue", args: [["bunta"]] }],
});
// { ok: false, error: { step: 0, message: "transfer-list c1 takes no setValue now. It takes: assign, unassign." }, ... }
```

エラーメッセージに使える操作が含まれているため、エージェントはこの結果を読んで手順を直せます。エラーメッセージも、人間の開発者ではなくエージェントが読むことを想定した書き方になっています。

### 権限で操作を制限する

エージェントの操作には、アプリ側で制限を設けられます。1 つ目は `createAgent` の `allow` コールバックで、各手順の実行前に呼ばれます。次のブリッジは `unassign` だけを拒否します。

```ts:src/agent.ts
import { createAgent } from "@ui-sdk/react/agent";

const agent = createAgent({
  allow: ({ component, action }) =>
    !(component === "transfer-list" && action === "unassign"),
});
```

このブリッジで `unassign` を実行すると `ok: false` と `The app refused unassign on c1.` が返り、値は変わりませんでした。`allow` は `Promise<boolean>` も返せるため、例えば確認ダイアログで人間の判断を待つこともできます。

2 つ目は値の変更コールバックです。エージェントの変更は人間の変更と同じ `onValueChange` を通り、`details.source` が `"agent"` になります。`details.source` の値を `if` で判定して `details.cancel()` を呼ぶと、エージェントの操作を拒否できます。

[Permissions のドキュメント](https://ui-sdk.dev/docs/agents/connect-an-agent/permissions)によると、このほかに HTML 属性で次の制御もできます。

- `data-agent-confirm="<説明文>"`: その要素と子孫への操作を、`allow` の判定にかかわらず人間の承認が必要な操作として扱う。`allow` がなければ操作は失敗し、エージェントには人間に操作を頼むよう伝えるメッセージが返る。`allow` があれば、説明文を `step.confirm` で受け取れるので、アプリ側で確認 UI を表示して人間の答えを返す。説明文はスナップショットにも含まれるため、エージェントは実行前に承認が必要だと知ることができる
- `data-agent-hidden`: その範囲のコンポーネントをエージェントから隠す
- `data-agent-secret`: 値を `"[redacted]"` に置き換えて返す。パスワード、カード番号、ワンタイムコードの入力欄は、属性がなくても自動的に隠される

## まとめ

- UI SDK は、キーボード操作、フォーカス、選択、ポップアップなどの振る舞いを behavior として提供するヘッドレス UI で、React、Vue、Svelte、Solid、Web Components に対応する
- UI SDK は、エージェントを「コンポーネントの作り手」と「UI の使い手」の両方として設計に組み込んでいる点が既存のヘッドレス UI と異なる
- コンポーネントは `definePrimitive` で状態、API、パーツをまとめて定義し、`createParts` で各フレームワークのコンポーネントにする
- `createAgent` の `snapshot` はコンポーネントの作者が `agent` キーで宣言した操作を返し、`act` はその操作を呼び出す
- エージェントの操作は `allow` で事前に拒否でき、`onValueChange` の `details.source === "agent"` で変更ごとに拒否できる

## 参考

- [UI SDK](https://ui-sdk.dev)
- [vercel-labs/ui](https://github.com/vercel-labs/ui)
