---v
id: Hh__7xFnHjA7R3FMann03
title: "Claude Code のプランモードがより正確な計画を立てられるようになっていた"
slug: "claude-code-plan-mode-improved"
about: "Claude Code のプランモードはリリース当初から定期的に改善が加えられており、より正確な計画を立てられるようになっています。この記事では最近の改善点について紹介します。"
createdAt: "2025-11-30T14:39+09:00"
updatedAt: "2025-11-30T14:39+09:00"
tags: ["AI","claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6KaNkSkaBnYY0GBC1w7WeT/9f1a98fe66c2ad448a3ee10b8009349b/iekei-ramen_22854-768x689.png"
  title: "家系ラーメンのイラスト"
audio: null
selfAssessment:
  quizzes: 
  - question: "Claude Code のプランモードの主な改善点は次のうちどれですか？"                          
      answers:                                                                                          
      - text: "新しい UI デザインが導入された。"                                                        
        correct: false                                                                                
        explanation: null                                                                             
      - text: "プランの計画にサブエージェントを使用するようになった。"                                
        correct: true                                                                                 
        explanation: ""
      - text: "オフラインでの作業が可能になった。"                                                    
        correct: false                                                                               
        explanation: null                                                                             
      - text: "対応プログラミング言語が増えた。"                                                     
        correct: false                                                                               
        explanation: null 

published: true
---

[Claude Code v2.0.51](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md#2051) のリリースノートでは「Plan Mode now builds more precise plans and executes more thoroughly（プランモードがより正確な計画を立て、より徹底的に実行するようになりました）」と記載されています。リリースノートでは 1 行だけの説明で具体的な改善内容がわからないのですが、実際に Claude Code のプランモードは定期的に新しい機能が追加されており、プランモードが生まれた当初と比べて大きく進化していることがわかります。

この記事では、Claude Code のプランモードの改善点について紹介します。

## プランの計画にサブエージェントを使用

プランモードを起動すると、[サブエージェント](https://code.claude.com/docs/en/sub-agents)を使用してプランを計画するようになっています。サブエージェントとは特定の種類のタスクを処理するために呼び出される特殊な AI アシスタントです。サブエージェントは Claude Code のメインエージェントによって管理され、タスクを委任されます。サブエージェントを使用することでメインエージェントのコンテキストを節約し、より専門的なタスクを処理できるようになります。

以前から組み込みのサブエージェントである「[探索サブエージェント](https://code.claude.com/docs/en/sub-agents#explore-subagent)」が日常的に使用されており、readonly モードでファイルシステムを探索して関連するファイルを見つけたり、コードベースの構造を分析したりするために使用されていました。探索サブエージェントは探索のために実行したコマンド（`ls` や `find` など）の出力がメインエージェントのコンテキストを汚染しないように分離されているため、メインエージェントが直接ファイルシステムを探索するよりも効率的に動作します。

v2.0.28 からプランモード時には組み込みのサブエージェントである「[プランサブエージェント](https://code.claude.com/docs/en/sub-agents#plan-subagent)」が使用されるようになりました。プランサブエージェントの目的はファイルを検索し、コード構造を分析し、コンテキストを収集することです。探索サブエージェントは軽量で低コストな `haiku` モデルを使用しているのに対し、プランサブエージェントはより強力な `Sonnet` モデルを使用しているという違いがあります。

プランサブエージェントが使用されていることは、ログが「`Plan(xxx)`」という形式で表示されることで確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Y2To58AOx5b5Patp6ADzV/fdfe8f68ad1d88936dfd61a196ec807a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-30_15.06.24.png)

`ctrl + o` を押してログの表示を切り替えると、プランサブエージェントに渡されるプロンプトの内容を確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/42fNTRqryQvDCoO0yeGPcq/fed079b4cc401fc3c3d95fdba3c3851e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-30_15.09.46.png)

## 不明な点をユーザーに確認する

v2.0.21 からはプランモードの途中で不明な点がある場合にユーザーに確認する機能が追加されました。ユーザーから提供されたプロンプトだけでは不十分な場合、Claude Code はプランの実行を続行する前にユーザーに質問します。質問はラジオボタンまたはチェックボックスで回答できる形式で表示され、ユーザーは選択肢から回答を選ぶほか、自由記述で回答することもできます。

例えば以下の例では「タスク編集・削除機能の実装」という指示に対して、「タスク編集ダイアログで、どのフィールドを編集可能にしますか？」という質問が表示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/1ABOVFtHpBbZXdp1S7Hjj5/4b44df8aa1784d3455d2243c991c90ec/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-30_15.01.27.png)

この質問でユーザーの要求をより正確に把握したり、ユーザー自身が見落としていたような要件を明らかにできます。

![](https://images.ctfassets.net/in6v9lxmm5c8/59gGyaZ5vWtTlleGfLwjAc/b823d94166badb8f5cdb3cee22dc2cf4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-11-30_15.05.48.png)

## 計画をファイルに保存するように

v2.0.34 からはプランモードの計画を `~/.claude/plans/xxx.md` に保存するようになりました。以前までのプランモードでは実装の計画の概要をユーザーに提供しそれを承認してもらうだけでしたが、計画をファイルに保存するようになってからは実装のステップ・具体的なコード例・技術的な判断・テスト戦略・受け入れ基準を含めた仕様書のような体裁を持つようになりました。

実際に「タスク編集・削除機能の実装」という指示でプランモードを実行すると、以下のような計画が生成されました。

~~~md:~/.claude/plans/misty-hugging-stonebraker.md
# タスク編集・削除機能の実装プラン

## 概要

Kanban ボードアプリケーションにタスクの編集と削除機能を追加します。ドラッグ&ドロップ機能を損なわず、既存のコードパターンに従った実装を行います。

## ユーザー要件

1. **編集機能:**

   - タスクカード上に編集アイコンボタンを配置
   - 編集ダイアログで全フィールド（タイトル、説明、優先度、期限）を編集可能
   - 完了状態のトグル機能を追加

2. **削除機能:**

   - タスクカード上に削除アイコンボタンを配置
   - シンプルな確認ダイアログ（「このタスクを削除しますか？」形式）

3. **UX 考慮事項:**
   - ドラッグ&ドロップ機能を妨げない
   - アイコンはホバー時に表示（目立ちすぎない）
   - Lucide React アイコンを使用

---

## 実装ステップ

### ステップ 1: 必要な UI コンポーネントのインストール

**実行コマンド:**

```bash
npx shadcn@latest add alert-dialog
npx shadcn@latest add checkbox
```

**目的:**

- `alert-dialog`: 削除確認用（Yes/No ダイアログに最適）
- `checkbox`: 完了状態トグル用

---

### ステップ 2: サーバーアクションの追加

**ファイル:** `/Users/xxx/sandbox/kanban-app/app/actions/task.ts`

**追加する 2 つの関数:**

#### 2.1 updateTask 関数

タスクの更新処理。既存の`createTask`関数のパターンに従う。

**実装のポイント:**

- FormData からフィールドを抽出（title, description, priority, dueDate, isCompleted）
- タスク更新前に boardId を取得（revalidatePath 用）
- Prisma でタスクを更新
- `revalidatePath`でキャッシュを再検証

```typescript
export async function updateTask(taskId: string, formData: FormData);
```

#### 2.2 deleteTask 関数

タスクの削除処理。

**実装のポイント:**

- 削除前に boardId を取得（削除後は取得不可）
- Prisma でタスクを削除
- `revalidatePath`でキャッシュを再検証

```typescript
export async function deleteTask(taskId: string);
```

---

### ステップ 3: TaskEditDialog コンポーネントの作成

**新規ファイル:** `/Users/xxx/sandbox/kanban-app/components/task-edit-dialog.tsx`

**参考:** `TaskCreationDialog`コンポーネントをベースにする

**主な特徴:**

- 全フィールドを既存の値で事前入力
  - `defaultValue={task.xxx}` for Input/Textarea
  - `useState(task.xxx)` for Select/Calendar/Checkbox
- 新規フィールド: `isCompleted`チェックボックス
- ボタンテキスト: 「更新」
- ダイアログタイトル: 「タスクを編集」
- カスタムトリガーを`trigger` prop で受け取る

**UI パターン:**

```typescript
interface TaskEditDialogProps {
  task: Task;
  trigger: React.ReactNode;
}
```

---

### ステップ 4: TaskDeleteDialog コンポーネントの作成

**新規ファイル:** `/Users/xxx/sandbox/kanban-app/components/task-delete-dialog.tsx`

**主な特徴:**

- AlertDialog を使用（シンプルな確認用）
- タスクタイトルを確認メッセージに表示
- 日本語テキスト: 「タスクを削除しますか？」「『{タイトル}』を削除します。この操作は取り消せません。」
- カスタムトリガーを`trigger` prop で受け取る

**UI パターン:**

```typescript
interface TaskDeleteDialogProps {
  taskId: string;
  taskTitle: string;
  trigger: React.ReactNode;
}
```

---

### ステップ 5: DraggableTask コンポーネントの修正

**ファイル:** `/Users/xxx/sandbox/kanban-app/components/draggable-task.tsx`

**重要な課題:** アイコンボタンがドラッグ操作を妨げないようにする

**解決策:**

1. ルート div から`{...listeners}`を削除
2. ドラッグ可能なエリア（タイトル、説明、フッター）にのみ`{...listeners}`を適用
3. アイコンボタンに`onClick={(e) => e.stopPropagation()}`を追加
4. ホバー時のみアイコン表示（`group`クラスと`group-hover:opacity-100`を使用）

**主な変更点:**

```tsx
// ルートdivに`group`クラスを追加
<div className="group bg-background ...">

// タイトルエリアをドラッグ可能に
<div {...listeners} className="flex-1 cursor-grab active:cursor-grabbing">
  <h4>{task.title}</h4>
</div>

// アイコンボタンコンテナ
<div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
  <TaskEditDialog
    task={task}
    trigger={
      <Button className="opacity-0 group-hover:opacity-100">
        <Pencil className="h-3 w-3" />
      </Button>
    }
  />
  <TaskDeleteDialog
    taskId={task.id}
    taskTitle={task.title}
    trigger={
      <Button className="opacity-0 group-hover:opacity-100">
        <Trash2 className="h-3 w-3" />
      </Button>
    }
  />
</div>

// 説明エリアもドラッグ可能
<div {...listeners} className="cursor-grab">
  <p>{task.description}</p>
</div>

// フッター（優先度・期限）もドラッグ可能
<div {...listeners} className="cursor-grab">
  {/* 優先度・期限 */}
</div>
```

**動作:**

- タイトルエリア: ドラッグ可能
- 説明エリア: ドラッグ可能
- フッター: ドラッグ可能
- 編集/削除ボタン: ドラッグ不可（stopPropagation）
- ボタンはカードホバー時のみ表示

---

## 技術的な設計判断

### 1. ドラッグ&ドロップの干渉防止

**課題:** アイコンクリックがドラッグを開始しないようにする

**解決策:**

- @dnd-kit/core の PointerSensor は既に 3px の移動距離制約が設定済み（`drag-drop-board.tsx:116-120`）
- `{...listeners}`をルートから削除し、特定エリアのみに適用
- `e.stopPropagation()`でクリックイベントを伝播させない
- `cursor-grab`をドラッグ可能エリアのみに適用

### 2. 楽観的更新の非採用

**判断:** 編集・削除には楽観的更新を実装しない

**理由:**

- 編集・削除はドラッグより頻度が低い
- `revalidatePath`による通常のサーバー更新で十分な UX
- `TaskCreationDialog`も楽観的更新を使用していない（一貫性）
- 実装がシンプル
- 必要に応じて後で追加可能

### 3. フォーム状態の事前入力

**課題:** 編集ダイアログに現在の値を表示

**解決策:**

- Input/Textarea: `defaultValue={task.xxx}` (非制御コンポーネント)
- Select/Calendar/Checkbox: `useState(task.xxx)` (制御コンポーネント)
- null 値の処理: `task.dueDate ? new Date(task.dueDate) : undefined`

### 4. アイコンの視覚的デザイン

**目標:** 控えめだが操作可能

**実装:**

- CSS: `opacity-0 group-hover:opacity-100 transition-opacity`
- サイズ: ボタン `h-6 w-6`、アイコン `h-3 w-3`
- 配置: ヘッダー内に Flex レイアウト
- 削除アイコン: `text-destructive`カラーバリアント

---

## ファイル構成サマリー

### 新規作成するファイル (2)

1. `/Users/xxx/sandbox/kanban-app/components/task-edit-dialog.tsx`
2. `/Users/xxx/sandbox/kanban-app/components/task-delete-dialog.tsx`

### 修正するファイル (2)

1. `/Users/xxx/sandbox/kanban-app/app/actions/task.ts` - 2 つの関数を追加
2. `/Users/xxx/sandbox/kanban-app/components/draggable-task.tsx` - リストラクチャとアイコン追加

### 生成されるファイル (2)

1. `/Users/xxx/sandbox/kanban-app/components/ui/alert-dialog.tsx` - shadcn CLI 経由
2. `/Users/xxx/sandbox/kanban-app/components/ui/checkbox.tsx` - shadcn CLI 経由

### 変更不要 (1)

1. `/Users/xxx/sandbox/kanban-app/prisma/schema.prisma` - 必要なフィールドは全て存在

---

## 実装における重要な考慮事項

### ドラッグリスナーの配置

現在の`draggable-task.tsx:40-41`では、ルート div に`{...attributes}`と`{...listeners}`が両方適用されています:

```tsx
{...attributes}
{...listeners}
```

**修正後:**

- `{...attributes}`はルート div に維持（必須）
- `{...listeners}`はドラッグ可能エリアにのみ移動

これにより、ボタンクリック時にドラッグが開始されることを防ぎます。

### PointerSensor の既存設定

`drag-drop-board.tsx:115-120`で既に 3px の移動距離制約が設定されています:

```tsx
useSensor(PointerSensor, {
  activationConstraint: {
    distance: 3, // 3px movement required to start drag
  },
});
```

この設定により、小さなクリック動作がドラッグとして解釈されにくくなっています。

---

## テストチェックリスト

### 編集機能

- [ ] タスクホバー時に編集アイコンが表示される
- [ ] 編集アイコンクリックでダイアログが開く（ドラッグが開始されない）
- [ ] 全フィールドが現在の値で事前入力されている
- [ ] タイトルを修正できる
- [ ] 説明を修正できる（クリアも含む）
- [ ] 優先度を変更できる
- [ ] 期限を変更できる
- [ ] 完了チェックボックスをトグルできる
- [ ] 保存ボタンでタスクが更新され、ダイアログが閉じる
- [ ] キャンセルボタンで変更せず閉じる
- [ ] タイトルエリアからタスクをドラッグできる
- [ ] 説明エリアからタスクをドラッグできる
- [ ] フッターエリアからタスクをドラッグできる

### 削除機能

- [ ] タスクホバー時に削除アイコンが表示される
- [ ] 削除アイコンクリックで確認ダイアログが開く（ドラッグが開始されない）
- [ ] 確認ダイアログに正しいタスクタイトルが表示される
- [ ] キャンセルで削除せず閉じる
- [ ] 確認でボードからタスクが削除される
- [ ] カラム内の最後のタスクを削除しても正常に動作する

### エッジケース

- [ ] 説明なしのタスクを編集
- [ ] 期限なしのタスクを編集
- [ ] 完了済みタスクを編集（チェックボックスが事前チェック済み）
- [ ] 期限切れタスクを編集
- [ ] 別のタスクをドラッグ中にタスクを削除
- [ ] 連続した編集・削除操作

---

## 成功基準

1. ✅ タスクカードホバー時に編集アイコンが表示される
2. ✅ 編集ダイアログが全フィールドを事前入力して開く
3. ✅ 完了状態を含む全タスクプロパティを修正できる
4. ✅ タスクカードホバー時に削除アイコンが表示される
5. ✅ 削除確認がタスクタイトルを日本語で表示する
6. ✅ アイコンクリックがドラッグ&ドロップを開始しない
7. ✅ タイトル、説明、フッターエリアからドラッグできる
8. ✅ UI が shadcn/ui「new-york」スタイルに従う
9. ✅ 全テキストが日本語
10. ✅ サーバーアクションが既存の revalidatePath パターンに従う

---

## 予想実装時間

- ステップ 1（UI コンポーネントインストール）: 5 分
- ステップ 2（サーバーアクション追加）: 30 分
- ステップ 3（TaskEditDialog 作成）: 45 分
- ステップ 4（TaskDeleteDialog 作成）: 20 分
- ステップ 5（DraggableTask 修正）: 45 分
- テスト: 30 分

**合計: 2-3 時間**
~~~

公式には明言されていないものの、これは [Kiro](https://kiro.dev/) を発端とする仕様駆動開発 (Specification-Driven Development, SDD) の考え方に近いものと言えるでしょう。Kiro は Claude を使用してソフトウェアの仕様書を生成し、その仕様書に基づいてコードを生成します。Claude Code のプランモードも同様に、実装の計画を詳細な仕様書として生成し、その仕様書に基づいてコードを生成するようになっています。

一方でプランモードで提示される計画が以前までのバージョンと比較して非常に長くなっていて読みづらくなっているといたり、レートリミットに達しやすくなっているといった問題もあります。これらの問題は今後のバージョンで改善されていくことが期待されます。

## まとめ

- Claude Code のプランモードはプランサブエージェントを使用して計画を立てるようになり、より正確な計画が可能になった
- プランモードは不明な点をユーザーに確認する機能が追加され、ユーザーの要求をより正確に把握できるようになった
- プランモードの計画はファイルに保存され、仕様書のような体裁を持つようになった

## 参考

- [Subagents - Claude Code Docs](https://code.claude.com/docs/en/sub-agents#plan-subagent)
- [claude-code/CHANGELOG.md at main · anthropics/claude-code](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)