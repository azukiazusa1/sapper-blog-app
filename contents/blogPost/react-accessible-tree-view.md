---
id: SrUvcHX3rKUZMeJ2EAiRE
title: "React でアクセシブルな Tree View を実装する"
slug: "react-accessible-tree-view"
about: "Tree View は階層構造を効率よく操作できる一方、ARIA ロールを付けるだけではアクセシブルになりません。WAI-ARIA APG を参考に、roving tabindex、矢印キー、選択、文字検索を備えた単一選択の Tree View を React で実装する方法を紹介します"
createdAt: "2026-08-18T14:16+09:00"
updatedAt: "2026-08-18T14:16+09:00"
tags: ["React", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/JrxXIoS5OaDdfASrHYPpN/91d7b1ebe5c146c174f03d0aa83474d2/cityscape_tokyo-skytree_6521-768x768.png"
  title: "街並みとスカイツリーのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "roving `tabindex` を使う Tree View のフォーカス管理として正しいものはどれですか?"
      answers:
        - text: "表示中のすべての項目を `tabindex=\"0\"` にする"
          correct: false
          explanation: "すべてをタブ順に含めると、Tree View を抜けるまで何度も Tab キーを押す必要があります。"
        - text: "現在の項目だけを `tabindex=\"0\"`、ほかを `-1` にし、移動時に `focus()` を呼ぶ"
          correct: true
          explanation: "現在の項目だけをページのタブ順に含め、内部では矢印キーと `focus()` で移動します。"
        - text: "すべての項目を `tabindex=\"-1\"` にし、Tree View 自体だけにフォーカスする"
          correct: false
          explanation: "この記事の実装では、DOM フォーカスを現在の `treeitem` に置きます。"
        - text: "選択中の項目だけを常に `tabindex=\"0\"` にする"
          correct: false
          explanation: "フォーカスと選択は別の状態です。フォーカス中の項目を `tabindex=\"0\"` にします。"
    - question: "開いている親ノードにフォーカスがあるとき、右矢印キーを押すとどうなりますか?"
      answers:
        - text: "親ノードを閉じる"
          correct: false
          explanation: "開いている親ノードを閉じる操作には左矢印キーを使います。"
        - text: "次に表示されている兄弟ノードへ移動する"
          correct: false
          explanation: "次に表示されているノードへの移動には下矢印キーを使います。"
        - text: "最初の子ノードへ移動する"
          correct: true
          explanation: "右矢印キーは、閉じた親ではノードを開き、すでに開いている親では最初の子へ移動します。"
        - text: "そのノードを選択する"
          correct: false
          explanation: "この記事の実装では、選択には Enter または Space キーを使います。"
    - question: "この記事の実装で、矢印キーによるフォーカス移動と選択を分けている理由はどれですか?"
      answers:
        - text: "矢印キーを押すたびに `aria-expanded` を削除するため"
          correct: false
          explanation: "`aria-expanded` は親ノードの開閉状態を表し、選択状態とは別です。"
        - text: "内容を変更せずにツリーを探索できるようにするため"
          correct: true
          explanation: "矢印キーはフォーカスだけを移し、Enter または Space で選択するため、探索だけで選択の副作用が起きません。"
        - text: "フォーカスされたノードを Accessibility Tree から隠すため"
          correct: false
          explanation: "フォーカス中のノードを隠すことはありません。フォーカスと選択を別々の状態として公開します。"
        - text: "Tab キーで各ノードを順番に移動できるようにするため"
          correct: false
          explanation: "Tree View 内の移動には矢印キーを使い、Tab キーでは Tree View 全体へ出入りします。"
published: true
---
Tree View は、ファイルシステムや商品カテゴリのような階層構造を表示するための UI です。親ノードを展開すると子ノードが現れ、折りたたむと再び隠れます。見た目だけであれば、入れ子にした `<ul>` と開閉処理で簡単に作れそうに見えます。

![入れ子のリストで階層構造を表現したファイルツリーの表示例](https://images.ctfassets.net/in6v9lxmm5c8/3KwilyudLU5nx50JiBRWMh/896772ed0f0c9468f361178159732497/image.png)

しかし、見た目だけをツリー構造にしても支援技術を使うユーザーはそのことを理解できず、適切な操作が妨げられる要因となってしまいます。ウェブアクセシビリティの観点では、WAI-ARIA 仕様に沿ってロールや `aria-` 属性で UI の意味と状態を伝えたうえで、APG のパターンを参考にキーボード操作を実装する必要があります。例えば `button` ロールを付けた要素は、Enter または Space キーで押せることをユーザーに約束する、といった具合です。

この記事では [WAI-ARIA Authoring Practices Guide（APG）の Tree View パターン](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)を参考に、以下の機能を持つ単一選択の Tree View を React と TypeScript で実装します。

- `tree`、`treeitem`、`group` ロールによる階層構造
- `aria-expanded` による開閉状態
- `aria-selected` による選択状態
- roving `tabindex` によるフォーカス管理
- 上下左右、Home、End キーによる移動
- Enter または Space キーによる選択
- 文字入力による項目の検索
- マウス操作とキーボード操作で一貫したフォーカス管理

:::warning
APG のパターンやサンプルは、本番環境であらゆるブラウザと支援技術の組み合わせに対応することを保証するものではありません。対象とする環境で必ずテストしてください。
:::

## No ARIA is better than Bad ARIA という原則

[APG の Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)には「No ARIA is better than Bad ARIA」という原則が示されています。これは不正確な ARIA を付けるくらいなら、付けないほうがましという意味です。

たとえば `role="button"` を指定しても、ブラウザは Enter や Space キーの処理を追加しません。これは開発者の責任により実装する必要があるのです。これは「ロールとは約束である」という原則で示されています。支援技術によりボタンと読み上げられているのにも関わらず、Enter や Space キーで押せない場合、ユーザーの期待を裏切ることになってしまいます。

同様に `role="tree"` を指定する場合は、APG の Tree View パターンに示されたキーボード操作を実装する必要があります。さもなければ、ユーザーは期待通りに操作できず、混乱してしまいます。

つまり、見た目が階層的であるという理由だけで `tree` ロールを付けるべきではありません。例えば情報を上から順に読めればよい場合は、通常の入れ子リストを使用するのが良いでしょう。

:::warning
Tree View はウェブアプリケーションよりもネイティブアプリケーションに似たナビゲーションを使用します。このため、Tree View を作成する前に、本当に必要かどうかを検討してください。
:::

通常の `<ul>` と `<li>` はブラウザがリストとして扱います。Tree View の要件を実装できない場合、不完全な `tree` ロールを追加するよりも、ネイティブなリストのセマンティクスを維持するほうが安全です。

## Tree View の構造と状態を設計する

はじめに、支援技術へ伝える構造を確認しましょう。

```html
<ul role="tree" aria-label="プロジェクトファイル">
  <li role="treeitem" aria-expanded="true" aria-selected="false">
    src
    <ul role="group">
      <li role="treeitem" aria-selected="false">App.tsx</li>
      <li role="treeitem" aria-selected="false">main.tsx</li>
    </ul>
  </li>
  <li role="treeitem" aria-selected="false">package.json</li>
</ul>
```

ルートの `<ul>` には `role="tree"` を指定し、`aria-label` または `aria-labelledby` で目的がわかる名前を付けます。各ノードには `role="treeitem"`、子ノードのまとまりには `role="group"` を指定します。`group` は親の `treeitem` の中に配置します。

`group` ロールは、関連する要素のまとまりを表します。Tree View ではこの `treeitem` に属する子項目をまとめるために使います。ファイルシステムの例で言えばディレクトリの中にあるファイルの集合を表す場合がわかりやすいですね。

### 親ノードだけに `aria-expanded` を指定する

子を持つ親ノードには、開いていれば `aria-expanded="true"`、閉じていれば `aria-expanded="false"` を指定します。子を持たない末端ノードには、この属性を指定しません。

```tsx
aria-expanded={hasChildren ? isExpanded : undefined}
```

末端ノードに `aria-expanded="false"` を付けると、現在は閉じているものの展開可能なノードであると誤って伝わってしまうので注意してください。開閉可能でないノードには、`aria-expanded` を付けないことが正しい実装です。

### 階層と位置を明示する

`treeitem` と `group` が正しく入れ子になっていれば、ブラウザは DOM の親子関係から以下の値を計算し、支援技術へ公開します。そのため、すべてのノードが DOM に存在する Tree View では、通常これらの属性を省略できます。

- `aria-level`：Tree View 内の階層。ルートノードは `1`
- `aria-posinset`：同じ親を持つノードの中での位置。`1` から始まる
- `aria-setsize`：同じ親を持つノードの総数

一方、[APG の computed properties サンプル](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/)では、ブラウザと支援技術の組み合わせによって値が正しく計算・報告されない可能性が説明されています。正しい値を管理できる場合は、互換性への配慮として明示しておくと安全です。今回の実装では 3 つの属性を明示します。

ただし、DOM や実際のデータと異なる値を指定すると、支援技術へ誤った情報を伝えてしまいます。値を正しく管理できない場合は、不正確な属性を追加せず、ブラウザの計算に任せるほうが安全です。

仮想スクロールや遅延読み込みにより一部のノードだけを DOM に置く場合は、実際のデータ全体における位置と総数を指定する必要があります。

### フォーカスと選択を分ける

Tree View では、フォーカスと選択は異なる状態です。

- フォーカス：現在キーボード操作の対象となる項目
- 選択：ファイルを開くなど、アプリケーションが処理の対象として選んだ項目

[APG のキーボードインターフェイスのガイド](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_vs_selection)では、DOM フォーカスは `document.activeElement`、選択は `aria-selected="true"` で表されると説明されています。

今回の実装では、矢印キーはフォーカスだけを移動します。Enter または Space キーを押したときに選択を変更します。フォーカス移動だけでファイルが開かれるような副作用が発生しないため、ユーザーは内容を変更せずにツリーを探索できます。

## roving `tabindex` でフォーカスを管理する

すべての `treeitem` を `tabindex="0"` にすると、Tree View を抜けるまで項目の数だけ Tab キーを押さなければなりません。複合ウィジェットでは、ページのタブ順に含める項目を 1 つだけにします。これは [roving `tabindex`](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex) と呼ばれる手法です。同様の手法はタブパネルやメニューでも使われています。

roving `tabindex` は、以下の手順でフォーカスを管理します。

1. 現在の項目だけを `tabindex="0"` にする
2. ほかの項目を `tabindex="-1"` にする
3. 移動先へ `HTMLElement.focus()` で DOM フォーカスを移す
4. 移動先を `tabindex="0"` に更新する

`tabindex="-1"` の要素は Tab キーの移動先にはなりませんが、JavaScript の `focus()` ではフォーカスできます。

実装では、各 `treeitem` の DOM 要素を `Map` に保存します。

```tsx:src/TreeView.tsx
const [focusedId, setFocusedId] = useState(items[0]?.id ?? "");
const itemRefs = useRef(new Map<string, HTMLLIElement>());

function focusNode(id: string) {
  itemRefs.current.get(id)?.focus();
}
```

レンダリング時には、`focusedId` と一致する項目だけをタブ順に含めます。

```tsx:src/TreeView.tsx
<li
  ref={(element) => {
    if (element) itemRefs.current.set(node.id, element);
    else itemRefs.current.delete(node.id);
  }}
  role="treeitem"
  tabIndex={focusedId === node.id ? 0 : -1}
  data-tree-id={node.id}
  onFocus={(event) => {
    if (event.target === event.currentTarget) {
      setFocusedId(node.id);
    }
  }}
>
```

## 表示中のノードだけを移動対象にする

上下キーが移動する対象は、データ内のすべてのノードではありません。現在画面に表示されているノードです。閉じた親ノードの子孫は移動先に含めません。

木構造のまま「次のノード」や「前のノード」を探すと、親子と兄弟をまたぐ条件分岐が複雑になります。そこで、展開状態に応じて表示中のノードを深さ優先で並べた配列を作ります。

```tsx:src/TreeView.tsx
type VisibleNode = {
  node: TreeNode;
  parentId: string | null;
};

function flattenVisibleNodes(
  nodes: TreeNode[],
  expandedIds: Set<string>,
  parentId: string | null = null,
): VisibleNode[] {
  const result: VisibleNode[] = [];

  for (const node of nodes) {
    result.push({ node, parentId });
    if (node.children?.length && expandedIds.has(node.id)) {
      result.push(...flattenVisibleNodes(node.children, expandedIds, node.id));
    }
  }

  return result;
}
```

`parentId` は、左矢印キーで親へ移動するときに使用します。コンポーネント内では `useMemo()` を使い、データまたは展開状態が変わったときに再計算します。

```tsx:src/TreeView.tsx
const visibleNodes = useMemo(
  () => flattenVisibleNodes(items, expandedIds),
  [items, expandedIds],
);
```

## APG に沿ったキーボード操作を実装する

縦方向の Tree View では、APG で以下の主要なキー操作が示されています。

| キー | 動作 |
| --- | --- |
| ↓ | 開閉状態を変えず、次に表示されているノードへ移動 |
| ↑ | 開閉状態を変えず、前に表示されているノードへ移動 |
| → | 閉じた親なら開く。開いた親なら最初の子へ移動 |
| ← | 開いた親なら閉じる。閉じた親または末端ノードなら親へ移動 |
| Home | 最初に表示されているノードへ移動 |
| End | 最後に表示されているノードへ移動 |
| Enter / Space | フォーカス中のノードを選択 |
| 文字入力 | 入力文字列から始まる次のノードへ移動 |

文字検索はすべての Tree View で推奨されており、とくにルートノードが 7 個を超える場合に重要です。APG のパターン本体は Enter を既定アクションとして示していますが、[ファイル選択の公式サンプル](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1b/)は Enter と Space の両方でノードを選択します。今回もこの操作に合わせます。

このほかに APG では、フォーカス中のノードと同じ階層の兄弟をすべて展開する `*` キーが optional として示されています。今回の実装では扱いません。

キーイベントはルートの `tree` でまとめて受け取ります。現在の `treeitem` を特定し、`visibleNodes` 上の位置から移動先を決めます。

```tsx:src/TreeView.tsx
function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
  // ブラウザや支援技術のショートカットを妨げない。
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  const target = (event.target as HTMLElement).closest<HTMLElement>(
    '[role="treeitem"]',
  );
  const id = target?.dataset.treeId;
  if (!id) return;

  const index = visibleNodes.findIndex(({ node }) => node.id === id);
  const current = visibleNodes[index];
  if (!current) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      if (visibleNodes[index + 1]) {
        focusNode(visibleNodes[index + 1].node.id);
      }
      return;
    case "ArrowUp":
      event.preventDefault();
      if (visibleNodes[index - 1]) {
        focusNode(visibleNodes[index - 1].node.id);
      }
      return;
    case "ArrowRight":
      event.preventDefault();
      if (!current.node.children?.length) return;
      if (!expandedIds.has(current.node.id)) {
        toggle(current.node);
      } else {
        focusNode(current.node.children[0].id);
      }
      return;
    case "ArrowLeft":
      event.preventDefault();
      if (
        current.node.children?.length &&
        expandedIds.has(current.node.id)
      ) {
        toggle(current.node);
      } else if (current.parentId) {
        focusNode(current.parentId);
      }
      return;
    case "Home":
      event.preventDefault();
      if (visibleNodes[0]) focusNode(visibleNodes[0].node.id);
      return;
    case "End":
      event.preventDefault();
      if (visibleNodes.at(-1)) focusNode(visibleNodes.at(-1)!.node.id);
      return;
    case "Enter":
    case " ":
      event.preventDefault();
      selectNode(current.node);
      return;
  }
}
```

上下キーや Home、End キーでは、ブラウザのスクロールを防ぐため `preventDefault()` を呼びます。ただし、Alt、Ctrl、Meta キーとの組み合わせはブラウザや支援技術のショートカットとして使われる可能性があるため、Tree View では処理しません。右キーで閉じた親を開く場合はフォーカスを動かしません。すでに開いている場合だけ最初の子へ移動します。左キーも同様に、開いた親ではその場で閉じ、末端ノードまたは閉じた親では親へ移動します。

### 文字入力による検索を追加する

文字検索では、現在のノードの次から検索し、末尾まで一致しなければ先頭へ戻ります。短時間に入力された複数文字は 1 つの検索文字列として扱います。

```tsx:src/TreeView.tsx
const searchText = useRef("");
const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

function handleTypeAhead(key: string, currentIndex: number) {
  clearTimeout(searchTimer.current);
  searchText.current += key.toLocaleLowerCase("ja-JP");

  const candidates = [
    ...visibleNodes.slice(currentIndex + 1),
    ...visibleNodes.slice(0, currentIndex + 1),
  ];
  const match = candidates.find(({ node }) =>
    node.label.toLocaleLowerCase("ja-JP").startsWith(searchText.current),
  );

  if (match) focusNode(match.node.id);
  searchTimer.current = setTimeout(() => {
    searchText.current = "";
  }, 500);
}
```

修飾キーとの組み合わせを検索文字として扱わないよう、`default` 節で条件を確認します。

```tsx:src/TreeView.tsx
if (
  event.key.length === 1 &&
  !event.altKey &&
  !event.ctrlKey &&
  !event.metaKey
) {
  handleTypeAhead(event.key, index);
}
```

検索対象にも `visibleNodes` を使うため、閉じたノードの子孫へフォーカスが移ることはありません。

## 再帰コンポーネントで ARIA 属性を出力する

Tree View が受け取るデータと Props は以下の形にします。すべてのノードの `id` は Tree View 内で一意である必要があります。

```tsx:src/TreeView.tsx
export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

type TreeViewProps = {
  items: TreeNode[];
  label: string;
  defaultExpandedIds?: string[];
  onSelect?: (node: TreeNode) => void;
};
```

各 `treeitem` には `aria-labelledby` でラベルを結び付けるため、あらかじめ一意な ID の材料を用意します。`useId()` で Tree View ごとの接頭辞を作り、全ノードへ通し番号を振っておきます。

```tsx:src/TreeView.tsx
function collectNodeIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) => [
    node.id,
    ...(node.children ? collectNodeIds(node.children) : []),
  ]);
}
```

```tsx:src/TreeView.tsx
const reactId = useId();
// 折りたたみでノードが DOM から消えても番号が変わらないよう、
// 展開状態ではなくデータ全体から採番する
const nodeIndexes = useMemo(
  () => new Map(collectNodeIds(items).map((id, index) => [id, index])),
  [items],
);
```

ノードを再帰的に描画し、現在の深さと兄弟内の位置を ARIA 属性へ渡します。

```tsx:src/TreeView.tsx
function renderNodes(nodes: TreeNode[], level: number) {
  return nodes.map((node, index) => {
    const hasChildren = Boolean(node.children?.length);
    const isExpanded = hasChildren && expandedIds.has(node.id);
    const labelId = `${reactId}-tree-label-${nodeIndexes.get(node.id)}`;

    return (
      <li
        key={node.id}
        ref={(element) => {
          if (element) itemRefs.current.set(node.id, element);
          else itemRefs.current.delete(node.id);
        }}
        role="treeitem"
        aria-labelledby={labelId}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={selectedId === node.id}
        aria-level={level}
        aria-posinset={index + 1}
        aria-setsize={nodes.length}
        tabIndex={focusedId === node.id ? 0 : -1}
        data-tree-id={node.id}
        onFocus={(event) => {
          // React の focus イベントはバブルするため、祖先の treeitem では更新しない。
          if (event.target === event.currentTarget) {
            setFocusedId(node.id);
          }
        }}
      >
        <div className="tree-row">
          <span className="tree-expander" aria-hidden="true">
            {hasChildren ? (isExpanded ? "▾" : "▸") : null}
          </span>
          <span id={labelId}>{node.label}</span>
        </div>
        {isExpanded && node.children ? (
          <ul role="group">{renderNodes(node.children, level + 1)}</ul>
        ) : null}
      </li>
    );
  });
}
```

`aria-labelledby` を各 `treeitem` に指定し、子孫のラベルまで親ノードの名前へ含まれないようにしています。ID には先ほどの接頭辞と通し番号を使うため、同じページに Tree View を複数置いてもラベルの ID が衝突しません。

展開アイコンは装飾として `aria-hidden="true"` にします。キーボードでは `treeitem` にフォーカスしたまま左右キーで開閉するため、アイコンを独立したタブストップにはしません。ポインター操作用の開閉処理では、対象の `treeitem` へフォーカスを移してから展開状態を更新します。

## フォーカスと選択を視覚的に区別する

フォーカスと選択は異なる状態なので、CSS で見た目を区別する必要があります。

```css:src/styles.css
[role="treeitem"][aria-selected="true"] > .tree-row {
  background: #dbeafe;
}

[role="treeitem"]:focus > .tree-row {
  outline: 2px solid #1d4ed8;
  outline-offset: -2px;
}
```

選択状態は背景色、フォーカスはアウトラインで表します。色だけに依存せず形も変えるため、両者を判別しやすくなります。

Windows の強制カラーモードでは、システムカラーへ切り替えます。

```css:src/styles.css
@media (forced-colors: active) {
  [role="treeitem"][aria-selected="true"] > .tree-row {
    forced-color-adjust: none;
    color: HighlightText;
    background: Highlight;
  }

  [role="treeitem"]:focus > .tree-row {
    outline-color: CanvasText;
  }
}
```

## 完成した Tree View の実装

これで一通りの機能が揃いました。次のように使えます。

```tsx:src/App.tsx
const items: TreeNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "app", label: "App.tsx" },
      { id: "main", label: "main.tsx" },
    ],
  },
  { id: "package-json", label: "package.json" },
];

export function App() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  return (
    <TreeView
      items={items}
      label="プロジェクトファイル"
      defaultExpandedIds={["src"]}
      onSelect={setSelectedNode}
    />
  );
}
```

ここまで実装した `TreeView` コンポーネントの全体は以下のとおりです。

<details>
<summary><code>src/TreeView.tsx</code> の完全な実装</summary>

```tsx:src/TreeView.tsx
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

export type TreeNode = {
  id: string;
  label: string;
  children?: TreeNode[];
};

type TreeViewProps = {
  items: TreeNode[];
  label: string;
  defaultExpandedIds?: string[];
  onSelect?: (node: TreeNode) => void;
};

type VisibleNode = {
  node: TreeNode;
  parentId: string | null;
};

function flattenVisibleNodes(
  nodes: TreeNode[],
  expandedIds: Set<string>,
  parentId: string | null = null,
): VisibleNode[] {
  const result: VisibleNode[] = [];

  for (const node of nodes) {
    result.push({ node, parentId });
    if (node.children?.length && expandedIds.has(node.id)) {
      result.push(...flattenVisibleNodes(node.children, expandedIds, node.id));
    }
  }

  return result;
}

function collectNodeIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((node) => [
    node.id,
    ...(node.children ? collectNodeIds(node.children) : []),
  ]);
}

export function TreeView({
  items,
  label,
  defaultExpandedIds = [],
  onSelect,
}: TreeViewProps) {
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(defaultExpandedIds),
  );
  const [focusedId, setFocusedId] = useState(items[0]?.id ?? "");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const searchText = useRef("");
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const reactId = useId();

  const visibleNodes = useMemo(
    () => flattenVisibleNodes(items, expandedIds),
    [items, expandedIds],
  );
  const nodeIndexes = useMemo(
    () => new Map(collectNodeIds(items).map((id, index) => [id, index])),
    [items],
  );

  useEffect(() => {
    return () => clearTimeout(searchTimer.current);
  }, []);

  function toggle(node: TreeNode) {
    if (!node.children?.length) return;

    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
  }

  function focusNode(id: string) {
    itemRefs.current.get(id)?.focus();
  }

  function selectNode(node: TreeNode) {
    setSelectedId(node.id);
    onSelect?.(node);
  }

  function handleTypeAhead(key: string, currentIndex: number) {
    clearTimeout(searchTimer.current);
    searchText.current += key.toLocaleLowerCase("ja-JP");

    const candidates = [
      ...visibleNodes.slice(currentIndex + 1),
      ...visibleNodes.slice(0, currentIndex + 1),
    ];
    const match = candidates.find(({ node }) =>
      node.label.toLocaleLowerCase("ja-JP").startsWith(searchText.current),
    );

    if (match) focusNode(match.node.id);
    searchTimer.current = setTimeout(() => {
      searchText.current = "";
    }, 500);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    // ブラウザや支援技術のショートカットを妨げない。
    if (event.altKey || event.ctrlKey || event.metaKey) return;

    const target = (event.target as HTMLElement).closest<HTMLElement>(
      '[role="treeitem"]',
    );
    const id = target?.dataset.treeId;
    if (!id) return;

    const index = visibleNodes.findIndex(({ node }) => node.id === id);
    const current = visibleNodes[index];
    if (!current) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (visibleNodes[index + 1]) {
          focusNode(visibleNodes[index + 1].node.id);
        }
        return;
      case "ArrowUp":
        event.preventDefault();
        if (visibleNodes[index - 1]) {
          focusNode(visibleNodes[index - 1].node.id);
        }
        return;
      case "ArrowRight":
        event.preventDefault();
        if (!current.node.children?.length) return;
        if (!expandedIds.has(current.node.id)) {
          toggle(current.node);
        } else {
          focusNode(current.node.children[0].id);
        }
        return;
      case "ArrowLeft":
        event.preventDefault();
        if (
          current.node.children?.length &&
          expandedIds.has(current.node.id)
        ) {
          toggle(current.node);
        } else if (current.parentId) {
          focusNode(current.parentId);
        }
        return;
      case "Home":
        event.preventDefault();
        if (visibleNodes[0]) focusNode(visibleNodes[0].node.id);
        return;
      case "End":
        event.preventDefault();
        if (visibleNodes.at(-1)) focusNode(visibleNodes.at(-1)!.node.id);
        return;
      case "Enter":
      case " ":
        event.preventDefault();
        selectNode(current.node);
        return;
      default:
        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey
        ) {
          handleTypeAhead(event.key, index);
        }
    }
  }

  function renderNodes(nodes: TreeNode[], level: number) {
    return nodes.map((node, index) => {
      const hasChildren = Boolean(node.children?.length);
      const isExpanded = hasChildren && expandedIds.has(node.id);
      const labelId = `${reactId}-tree-label-${nodeIndexes.get(node.id)}`;

      return (
        <li
          key={node.id}
          ref={(element) => {
            if (element) itemRefs.current.set(node.id, element);
            else itemRefs.current.delete(node.id);
          }}
          role="treeitem"
          aria-labelledby={labelId}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={selectedId === node.id}
          aria-level={level}
          aria-posinset={index + 1}
          aria-setsize={nodes.length}
          tabIndex={focusedId === node.id ? 0 : -1}
          data-tree-id={node.id}
          onFocus={(event) => {
            // React の focus イベントはバブルするため、祖先の treeitem では更新しない。
            if (event.target === event.currentTarget) {
              setFocusedId(node.id);
            }
          }}
        >
          <div
            className="tree-row"
            onClick={() => {
              focusNode(node.id);
              selectNode(node);
            }}
          >
            {hasChildren ? (
              <span
                className="tree-expander"
                aria-hidden="true"
                onClick={(event: MouseEvent) => {
                  event.stopPropagation();
                  focusNode(node.id);
                  toggle(node);
                }}
              >
                {isExpanded ? "▾" : "▸"}
              </span>
            ) : (
              <span className="tree-expander" aria-hidden="true" />
            )}
            <span id={labelId}>{node.label}</span>
          </div>
          {isExpanded && node.children ? (
            <ul role="group">{renderNodes(node.children, level + 1)}</ul>
          ) : null}
        </li>
      );
    });
  }

  return (
    <ul className="tree" role="tree" aria-label={label} onKeyDown={handleKeyDown}>
      {renderNodes(items, 1)}
    </ul>
  );
}
```

</details>


## VoiceOver の手動確認

実装した `TreeView` コンポーネントを実際に macOS の VoiceOver で操作して確認してみましょう。`TreeView` に移動すると「プロジェクトファイル、ひょう、何も選択されていません」と `aria-label` で指定したアクセシブルな名前とロールが読み上げられます。VoiceOver では Tree View の階層を「ひょう」と読み上げるようです。

![VoiceOver が「プロジェクトファイル、ひょう、何も選択されていません」と読み上げているスクリーンショット](https://images.ctfassets.net/in6v9lxmm5c8/66H7hUcUMgrjG6i4lBgUEW/61bbe12c4d0a326c2d53b0d6c44b90e7/image.png)

何かしらのアイテムを選択している場合には、「行 2 / 5、選択中」のようにどの位置のアイテムが選択されているかも読み上げられます。

![VoiceOver が「行 2 / 5、選択中」と読み上げているスクリーンショット](https://images.ctfassets.net/in6v9lxmm5c8/4tfVJ37pivt6e0J3XNyioC/b39dd6c72837a417f6e2d3b978d53d16/image.png)

子要素を持つ親ノードを選択すると「public、字間広く、アウトライン行（2 / 3）」のように、展開状態と階層が読み上げられます（VoiceOver では `aria-expanded=true` の場合に「字間広く」`aria-expanded=false` の場合に「下位項目が折りたたまれました」と読み上げます）。

![VoiceOver が「public、字間広く、アウトライン行（2 / 3）」と読み上げているスクリーンショット](https://images.ctfassets.net/in6v9lxmm5c8/3KPeyM9iVZ9j9Tu5hz4oTm/4fb8bed4ff390397ce3e75b45839dd65/image.png)

ツリー上で待機していると、操作方法も読み上げられます。これが適切なキーボード操作を実装する理由の 1 つですね。

![VoiceOver が Tree View の操作方法を読み上げているスクリーンショット](https://images.ctfassets.net/in6v9lxmm5c8/3jqFE6EnYYgxJFTA9AlZTy/a5dcfa7020519f2c0eba9737e77696ff/image.png)

キーボード操作も試してみましょう。上下キーでフォーカスを移動し、左右キーで開閉や親子移動ができます。Enter または Space キーで選択状態を切り替えられます。文字検索も試してみましょう。`p` を押すと「package.json」へ、`a` を押すと「App.tsx」へフォーカスが移動します。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/8XifmB3v1aHenjTQecxa5/c049ef3f1a4b82178bd023b7366e3f53/7473b3cf-e9f4-4d6a-a6dd-e26848750e0c.mov" controls></video>

## 自作せずコンポーネントライブラリを利用する

ここまで Tree View の操作モデルを理解するために一から実装しましたが、見ての通り APG の Tree View パターンに沿ったキーボード操作やフォーカス管理は複雑です。自作の保守が難しい場合は、アクセシビリティを考慮したコンポーネントライブラリを利用する方法があります。

たとえば [React Aria](https://react-aria.adobe.com/) は、固定の見た目を持たない React コンポーネントと Hooks を提供するライブラリです。固有の見た目を持たないので、アプリケーションのデザインシステムに合わせて自由にスタイルを適用できます。また React Aria はアクセシビリティの観点でも高い評価を受けています。

[React Aria の Tree](https://react-aria.adobe.com/Tree) は、キーボードによる移動と選択、静的・動的なコレクション、制御・非制御の展開状態や選択状態に対応しています。`TreeItem` の `textValue` は文字検索にも使用されます。公式ドキュメントでは `react-aria-components` を土台にした `Tree` と `TreeItem` の実装例が提供されており、CSS または Tailwind CSS のサンプルをプロジェクトへ取り込んでカスタマイズできます。

Adobe のデザインシステムと完成したスタイルを採用できる場合は、[React Spectrum の TreeView](https://react-spectrum.adobe.com/TreeView) も選択肢です。

## まとめ

- Tree View は見た目が階層的であるだけではなく、キーボード操作やフォーカス管理などの操作モデルを備えた複合ウィジェットである
- Tree View の構造と状態を設計し、親ノードだけに `aria-expanded` を指定する
- 階層と位置を明示する場合は、`aria-level`、`aria-posinset`、`aria-setsize` を正しく管理する
- フォーカスと選択は異なる状態であり、CSS で視覚的に区別する
- roving `tabindex` でフォーカスを管理する
- キーボード操作では、上下キーでフォーカス移動、左右キーで開閉や親子移動、Enter または Space キーで選択状態を切り替える。表示中のノードだけを移動対象にする
- コンポーネントの自作が難しい場合は、React Aria ようなアクセシビリティに配慮したコンポーネントライブラリを利用する

## 参考

- [Tree View Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)
- [Read Me First | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/)
- [Developing a Keyboard Interface | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/)
- [File Directory Treeview Example Using Computed Properties | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1a/)
- [File Directory Treeview Example Using Declared Properties | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-1b/)
- [Accessible Rich Internet Applications（WAI-ARIA）1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [Tree | React Aria](https://react-aria.adobe.com/Tree)
- [Quality | React Aria](https://react-aria.adobe.com/quality)
- [TreeView | React Spectrum](https://react-spectrum.adobe.com/TreeView)
