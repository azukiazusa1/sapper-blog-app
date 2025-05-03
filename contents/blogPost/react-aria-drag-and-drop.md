---
id: FxmM81OuweAF9ZfioNvoP
title: "アクセシビリティが考慮された React Aria のドラッグアンドドロップ"
slug: "react-aria-drag-and-drop"
about: "React Aria は Adobe により提供されている React 用のコンポーネントライブラリであり、アクセシビリティを最優先した設計となっています。本記事では、React Aria により提供されているドラッグアンドドロップ機能を紹介します。"
createdAt: "2024-09-07T15:17+09:00"
updatedAt: "2024-09-07T15:17+09:00"
tags: ["React", "React Aria", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4WPP9O7GXJbqVpaWtSN4Dd/203b49d4ae179c72abdef5cac0d48ced/tsukimi-udon_16432.png"
  title: "月見うどんのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "React Aria により提供されているドラッグアンドドロップ機能を実装するためのフックではないものはどれですか？"
      answers:
        - text: "useDrag"
          correct: false
          explanation: null
        - text: "useDrop"
          correct: false
          explanation: null
        - text: "useDragAndDrop"
          correct: false
          explanation: null
        - text: "useDroppable"
          correct: true
          explanation: null
published: true
---
ドラッグアンドドロップは、ユーザーが UI の要素をドラッグして別の場所に移動する操作です。Web アプリケーションにおいて、ドラッグアンドドロップはユーザーが直感的に操作できるため、多くの場面で利用されています。例えばタスク管理アプリケーションにおいて、タスクをドラッグして進行状況を変更したり、ファイル管理アプリケーションにおいてファイルをドラッグしてフォルダを移動する機能などがあります。

従来のドラッグアンドドロップ機能はマウス以外での操作が考慮されていない実装が多く、キーボードやスクリーンリーダーを利用するユーザーにとっては機能を利用することが難しくなっていました。また、[ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) にもドラッグアンドドロップに関するガイドラインの記述が存在しないため、キーボードやスクリーンリーダーを利用するユーザーに対して代替手段を提供したとしても、その実装方法については開発者の裁量に委ねられ Web アプリケーション間での実装の差異が生じてしまいまうという課題も存在します。

[React Aria](https://react-spectrum.adobe.com/react-aria/) は Adobe により提供されている React 用のコンポーネントライブラリであり、アクセシビリティを最優先した設計となっています。上記のとおりにアクセシビリティ上の課題を抱えるドラッグアンドドロップ機能についても、キーボードやスクリーンリーダーを利用するユーザーに対してもサポートすることを目指しています。

React Aria により作成された [ドラッグアンドドロップの RFC](https://github.com/adobe/react-spectrum/blob/main/rfcs/2020-v3-dnd.md) に基づき各コンポーネントやフックが提供されています。実際に React Aria により提供されているドラッグアンドドロップ機能を備えたコンポーネントを見ていきましょう。

## `useDrag` と `useDrop`

`useDrag` と `useDrop` は、それぞれドラッグ可能な要素とデータを受け入れるドロップゾーン要素を作成するためのフックです。これらのフックを使用することで、キーボードやスクリーンリーダー向けの操作をサポートしたドラッグアンドドロップ機能を実装できます。

まずは、`useDrag` を使用してドラッグ可能な要素を作成する例を見てみましょう。

```tsx:Draggable.tsx
import { useDrag } from "react-aria";

export const Draggable = () => {
  const { isDragging, dragProps } = useDrag({
    getItems: () => [{ "text/plain": "Hello, world!" }],
  });

  return (
    <button {...dragProps} type="button">
      className={isDragging ? "dragging" : ""}
      {isDragging ? "Dragging" : "Drag me"}
    </button>
  );
};
```

`useDrag` フックは、`getItems` という関数を引数に取ります。この関数は、どのようなデータがドロップされたときに渡されるかを定義します。上記の例では、`"Hello, world!"` というテキストデータがドロップされたときにドロップゾーンに渡されます。

`useDrag` は `isDragging` と `dragProps` という 2 つのプロパティを返します。`isDragging` は、現在ドラッグ中かどうかを表す真偽値です。`dragProps` は、ドラッグ可能な要素に適用するプロパティを含むオブジェクトです。この例では、`button` 要素に `dragProps` を適用しています。`dragProps` を渡すことにより、対象の要素がドラッグアンドドロップ操作をサポートするようになります。

なおキーボードとスクリーンリーダーによる操作を可能にするためには、`dragProps` を渡す要素がフォーカス可能であり、ARIA ロールを持つ必要があります。

次に、`useDrop` を使用してドロップゾーンを作成します。

```tsx:DropTarget.tsx
import { useDrop } from "react-aria";
import { useState, useRef } from "react";

export const DropTarget = () => {
  const [dropped, setDropped] = useState<string | null>(null);
  const ref = useRef<HTMLButtonElement | null>(null);
  const { dropProps, isDropTarget } = useDrop({
    ref,
    async onDrop(e) {
      const items = await Promise.all(
        e.items
          .filter((item) => item.kind === "text")
          .map((item) => item.getText("text/plain"))
      );
      setDropped(items.join("\n"));
    },
  });

  return (
    <button
      {...dropProps}
      type="button"
      ref={ref}
      className={`drop-zone ${
        isDropTarget ? "target" : dropped ? "dropped" : ""
      }`}
    >
      {dropped || "Drop here"}
    </button>
  );
};
```

`useDrop` フックは、`ref` と `onDrop` という 2 つのプロパティを引数に取ります。`ref` は、ドロップゾーンとなる要素を参照するための `useRef` フックで作成したオブジェクトを渡します。`onDrop` は、ドロップされたデータを処理するための関数です。この関数はドロップが完了したタイミングで呼びされ、`useDrag` の `getItems` で定義したデータが引数として渡されます。`item.kind` が `"text"` の場合は `getText()` メソッドを使用してテキストデータを取得できます。

ここでは取得したテキストデータを `dropped` という状態に保存し、この状態にデータが渡された場合には `Drop here` という文字列の代わりに表示するようにしています。

`useDrop` は `dropProps` と `isDropTarget` という 2 つのプロパティを返します。`dropProps` は、ドロップゾーンに適用するプロパティを含むオブジェクトです。`dragProps` と同様に、キーボードやスクリーンリーダーによる操作を可能にするためには、`dropProps` を渡す要素がフォーカス可能であり、ARIA ロールを持つ必要があります。`isDropTarget` は、現在ドロップゾーンにデータがドラッグ中かどうかを表す真偽値です。

なお、`useDrop` フックを使用する代わりに `<DropZone>` コンポーネントを使用することもできます。`<DropZone>` コンポーネントは内部で `useDrop` フックを使用しており、`onDrop` Props に渡した関数がドロップされたデータを処理するために使用されます。

```tsx:DropZone.tsx
<DropZone onDrop={(e) => {
  const items = await Promise.all(
    e.items
      .filter((item) => item.kind === "text")
      .map((item) => item.getText("text/plain"))
  );
  setDropped(items.join("\n"));
}}>
  Drop here
</DropZone>
```

実際にマウス操作によるドラッグアンドドロップ操作が可能であることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/3U94yNzuwiIbngtcHj5nvD/7df1896661b1b375ec4fc0cd69f5b2b6/_____2024-09-07_16.16.53.mov" controls></video>

キーボード操作についても確認してみましょう。ドラッグ可能な要素にフォーカスがあるときに、`Enter` キーを押すことでドラッグ操作を開始できます。続いて `Tab` キーを押すことでドロップゾーンにフォーカスを移動します。ドロップゾーンにフォーカスがあるときに `Enter` キーを押すことでドロップ操作を完了できます。またドラッグ操作中に `Escape` キーを押すことでドラッグ操作をキャンセルできます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/1I5GrIyGFPD9q8tv8ofA5z/0289674d58be28c6922108cd9416f634/_____2024-09-07_16.36.47.mov" controls></video>

最後にスクリーンリーダーを使用した操作を見てみます。ここでは macOS に標準搭載されている VoiceOver を使用しています。ドラッグ可能な要素にフォーカスがあるときは「Enter キーを押してドラッグを開始してください」と読み上げられます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Dz7dh7IjZjbTkaWvPmbG8/efdbe66928675d1f8ca5d6ffaff57139/__________2024-09-07_16.39.40.png)

Enter キーもしくは Space キーをクリックしドラッグ操作を開始したタイミングで live region によって「ドラッグを開始しました。ドロップのターゲットに異動し、クリックまたは Enter キー押してドロップします」と読み上げられました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7zxzHtwEE2FQlLD0dIlFUZ/12291fd738e64f5042b3de13258ba321/__________2024-09-07_16.44.08.png)

ドロップターゲットにフォーカスを移動すると「Enter キーを押してドロップします。Esc キーを押してドラッグをキャンセルします」と読み上げられます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4EiwL66bLVPnsE2GnKsVGR/d0ad94fbc1f81a2358387669edb5f9fc/__________2024-09-07_16.41.48.png)

最後に、ドラッグ操作が完了したタイミングで「ドロップ完了しました」と読み上げられました。

![](https://images.ctfassets.net/in6v9lxmm5c8/wh1LZZhS5PUJ2nVpJi9Wc/19670797513d3c08ed10128217096c0f/__________2024-09-07_16.49.11.png)

このようにスクリーンリーダーを使用している場合にはどのような操作を行うことができるのか適切に読み上げられていることが確認できます。

## `GridList`

`<ListBox>`, `<Table>`, `<GridList>` のようなデータのコレクションコンポーネントにおいてもドラッグアンドドロップ機能が提供されています。これらのコンポーネントは [useDraggableCollection](https://react-spectrum.adobe.com/react-aria/useDraggableCollection.html) フックと [useDroppableCollection](https://react-spectrum.adobe.com/react-aria/useDroppableCollection.html) フックを使用して実装されています。

ここでは `<GridList>` コンポーネント能を見てみましょう。`<GridList>` は行の項目を選択できるインタラクティブなリストです。ARIA Authoring Practices Guide の [Grid](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) パターンに準拠しており、キーボード操作やスクリーンリーダーによる操作をサポートしています。

`<GridList>` コンポーネントはドラッグアンドドロップにより以下の操作をサポートしています。

- リスト全体もしくはリスト内の項目にデータをドロップする
- 項目をドラッグして並び替える
- 既存の項目の間に新しい項目を挿入する

### ドラッグアンドドロップによる並び替え

以下の例では、`<GridList>` コンポーネントを使用してドラッグアンドドロップによる並び替えを実装しています。

```tsx:GridList.tsx
import {
  GridList,
  GridListItem,
  Button,
  useDragAndDrop,
} from "react-aria-components";

import { useListData } from "react-stately";

export const MyGridList = () => {
  const list = useListData({
    initialItems: [
      { id: 1, name: "Charizard" },
      { id: 2, name: "Blastoise" },
      { id: 3, name: "Venusaur" },
      { id: 4, name: "Pikachu" },
      { id: 5, name: "Adobe Connect" },
    ],
  });

  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (keys) =>
      [...keys].map((key) => ({ "text/plain": list.getItem(key).name })),
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },
  });
  return (
    <GridList
      aria-label="Favorite pokemon"
      items={list.items}
      dragAndDropHooks={dragAndDropHooks}
    >
      {(item) => (
        <GridListItem textValue={item.name}>
          <Button slot="drag" className="drag">
            ☰
          </Button>
          {item.name}
        </GridListItem>
      )}
    </GridList>
  );
};
```

リストの状態管理のために [react-stately](https://react-spectrum.adobe.com/react-stately/index.html) の `useListData` フックを使用しています。`useListData` フックを使用することで、要素の並び替えといった状態管理の詳細を気にすることなく、リストのデータを管理できます。

グリッドに対するドラッグアンドドロップ操作を有効にするためには、`<GridList>` コンポーネントに `dragAndDropHooks` Props を渡します。`dragAndDropHooks` にわたすオブジェクトは、`useDragAndDrop` フックから取得した `dragAndDropHooks` です。`useDragAndDrop` フックの引数には、`getItems` と `onReorder` という 2 つのプロパティを持つオブジェクトを渡します。`getItems` は、ドラッグアンドドロップ操作によって移動されるデータを定義します。`onReorder` は、ドラッグアンドドロップ操作による並び替えが完了したときに呼び出される関数です。ここで実際にリストのデータの並び替えを行っています。

ドラッグ可能なグリッドの項目には必ずフォーカス可能なドラッグハンドルを提供する必要があります。ドラッグハンドルにより、キーボードやスクリーンリーダーを利用しているユーザーがドラッグアンドドロップ操作を開始できるようになります。ここでは `Button` コンポーネントに `slot="drag"` を指定することで、ドラッグハンドルとして機能するようになります。

以下のように、グリッドの項目をドラッグして並び替えることができることが確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6zsFSQRN7r6sBI8sQSbQ69/607fdf800a245540ba50e25496d5c218/_____2024-09-07_20.01.07.mov" controls></video>

キーボード操作ではドラッグハンドルにフォーカスがあるときに `Enter` キーを押すことでドラッグ操作を開始できます。また、`ArrowUp` キーと `ArrowDown` キーを押すことで項目の移動が可能です。ドラッグアンドドロップ操作中のスタイルは `.react-aria-DropIndicator` クラスを使用してカスタマイズできます。ドロップ対象の要素には `data-drop-target` 属性が追加されるため、この要素を対象にスタイルを適用することで、現在のドロップ位置を示すインジケータを表示できます。

```css
.react-aria-DropIndicator {
  &[data-drop-target] {
    outline: 1px solid lightblue;
  }
}
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7565UhvDdEaWi4u6hwahnZ/7c7a6319d4fa83b4b8532a5dc1ecc155/_____2024-09-07_20.15.31.mov" controls></video>

ユーザーのポインタの下に表示されるドラッグのプレビューは、`useDragAndDrop` フックの `renderDragPreview` プロパティを使用してカスタマイズできます。

```tsx
const { dragAndDropHooks } = useDragAndDrop({
  renderDragPreview: (items) => {
    return (
      <div className="drag-preview">
        {items[0]["text/plain"]}
        {items.length > 1 && <span> 他 {items.length - 1} 件</span>}
      </div>
    );
  },
});
```

### グリッド間のドラッグアンドドロップ

続いて複数のグリッド間でドラッグアンドドロップにより項目を移動する例を見てみましょう。タスクリストで `ToDo`、`In Progress`、`Done` の 3 つのグリッドを持つアプリケーションを想定しています。

```tsx:GridListMulti.tsx
import { useId } from "react";
import {
  GridList,
  GridListItem,
  Button,
  useDragAndDrop,
  isTextDropItem,
} from "react-aria-components";

import { useListData } from "react-stately";

type Item = {
  id: number;
  name: string;
};

type GridListProps = {
  initialItems: Item[];
  title: string;
};

const MyGridList = ({ initialItems, title }: GridListProps) => {
  const list = useListData({
    initialItems,
  });

  const { dragAndDropHooks } = useDragAndDrop({
    getItems(keys) {
      return [...keys].map((key) => {
        const item = list.getItem(key);
        return {
          "custom-app-type": JSON.stringify(item),
          "text/plain": item.name,
        };
      });
    },
    // カスタム要素がドロップされるのを許可する
    acceptedDragTypes: ["custom-app-type"],
    // アイテムがコピーされるのではなく、常に移動されるようにする
    getDropOperation: () => "move",

    // 項目が他のリストからドロップされたときの処理
    async onInsert(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) =>
            JSON.parse(await item.getText("custom-app-type"))
          )
      );
      if (e.target.dropPosition === "before") {
        list.insertBefore(e.target.key, ...processedItems);
      } else if (e.target.dropPosition === "after") {
        list.insertAfter(e.target.key, ...processedItems);
      }
    },

    // グリッドの項目が空のリストにドロップされたときの処理
    async onRootDrop(e) {
      const processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) =>
            JSON.parse(await item.getText("custom-app-type"))
          )
      );
      list.append(...processedItems);
    },

    // 同じリスト内での項目の移動
    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },

    // 他のリストに項目がドロップされたとき、元のリストから削除する
    onDragEnd(e) {
      if (e.dropOperation === "move" && !e.isInternal) {
        list.remove(...e.keys);
      }
    },
  });

  const titleId = useId();

  return (
    <div>
      <h2 id={titleId}>{title}</h2>
      <GridList
        aria-labelledby={titleId}
        selectionMode="multiple"
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
        className="grid-list"
      >
        {(item) => (
          <GridListItem textValue={item.name}>
            <Button slot="drag" className="drag">
              ☰
            </Button>
            {item.name}
          </GridListItem>
        )}
      </GridList>
    </div>
  );
};

export const MultiGridList = () => {
  return (
    <div className="multi-grid-list">
      <div>
        <MyGridList
          title="Todo"
          initialItems={[
            {
              id: 1,
              name: "buy milk",
            },
            {
              id: 2,
              name: "learn react",
            },
            {
              id: 3,
              name: "learn react-dnd",
            },
          ]}
        />
      </div>
      <div>
        <MyGridList
          title="In Progress"
          initialItems={[
            {
              id: 4,
              name: "learn opentelemetry",
            },
          ]}
        />
      </div>
      <div>
        <MyGridList title="Done" initialItems={[]} />
      </div>
    </div>
  );
};
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5lf8f4FjnEOiWBWphX2L7l/917b04dc3b9f6b509a39a48ca802173b/_____2024-09-07_21.37.36.mov" controls></video>

## まとめ

- ドラッグアンドドロップはユーザーが UI の要素をドラッグして別の場所に移動する操作であり、多くの場面で利用されているが、キーボードやスクリーンリーダーを利用するユーザーに対しては機能を利用することが難しかった
- React Aria はアクセシビリティを最優先した設計となっており、ドラッグアンドドロップ機能においてもキーボードやスクリーンリーダーを利用するユーザーに対してサポートすることを目指している
- `useDrag` と `useDrop` フックを使用することで、ドラッグ可能な要素とドロップゾーンを作成することができる
- `<ListBox>`, `<Table>`, `<GridList>` などのデータのコレクションコンポーネンできる<できる<できる<トにおいてもドラッグアンドドロップ機能が提供されている
- `<GridList>` コンポーネントを使用してドラッグアンドドロップによる並び替えやグリッド間のドラッグアンドドロップを実装することができる

## 参考

- [Drag and Drop – React Aria](https://react-spectrum.adobe.com/react-aria/dnd.html)
- [Taming the dragon: Accessible drag and drop – React Spectrum Blog](https://react-spectrum.adobe.com/blog/drag-and-drop.html)
