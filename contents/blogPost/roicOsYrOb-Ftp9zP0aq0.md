---
id: roicOsYrOb-Ftp9zP0aq0
title: "AWS の エージェント IDE Kiro を使ってみた"
slug: "kiro-agent-ide"
about: "Kiro は AWS が開発した IDE 内蔵型の AI コーディングエージェントです。Kiro の特徴は単なるバイブコーディングにとどまらず、スペックを使用して仕様駆動開発でアプリケーションを開発できることです。この記事では Kiro を使ったアプリケーション開発の流れを紹介します。"
createdAt: "2025-07-15T20:19+09:00"
updatedAt: "2025-07-15T20:19+09:00"
tags: ["AI", "Kiro"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3JuOUfpXVbn1j372IiAX07/f8e15d457bc8e5dec2c5ae943454b093/halloween-lanthanum-ghost_20763-768x729.png"
  title: "ランタンを持ったおばけのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Kiro のスペック機能で生成される3つのファイルは何ですか？"
      answers:
        - text: "requirements.md、design.md、tasks.md"
          correct: true
          explanation: "Kiro は要件（EARS表記法によるユーザーストーリー）、設計（アーキテクチャと実装方針）、タスク（実行手順）の3つのファイルを生成します。"
        - text: "planning.md、implementation.md、testing.md"
          correct: false
          explanation: ""
        - text: "analysis.md、design.md、coding.md"
          correct: false
          explanation: ""
        - text: "specification.md、development.md、deployment.md"
          correct: false
          explanation: ""

    - question: "Kiro で使用できるAIモデルはどれですか？"
      answers:
        - text: "Claude Sonnet 4.0 と Claude Sonnet 3.7"
          correct: true
          explanation: ""
        - text: "GPT-4 と GPT-3.5"
          correct: false
          explanation: ""
        - text: "Llama 3"
          correct: false
          explanation: ""
        - text: "Gemini Pro と Gemini Flash"
          correct: false
          explanation: ""

published: true
---

[Kiro](https://kiro.dev/) は AWS が開発した IDE 内蔵型の AI コーディングエージェントです。Kiro の特徴は単なるバイブコーディングにとどまらず、[スペック](https://kiro.dev/docs/specs/index)を使用して仕様駆動開発でアプリケーションを開発できることです。要件や設計を文書化し、プロダクションレベルのアプリケーションを継続的に開発することを念頭に置いて設計されています。

ユーザーは自然言語でアプリケーションのアイディアを伝えることで、Kiro は以下の 3 つのフェーズを経てアプリケーションのスペックを生成します。

1. 要件: EARS 表記法を使用して、受け入れ基準を含むユーザーストーリーを定義する
2. 設計: アプリケーションのアーキテクチャと実装方針を定義する
3. タスク: 実行のための具体的なタスクを定義する

この記事では Kiro を使ったアプリケーション開発の流れを紹介します。

:::warning
Kiro は 2025 年 7 月 15 日現在パブリックプレビュー版として提供されています。この記事で紹介する内容は将来のバージョンで変更される可能性があります。
:::

## Kiro のインストール

Kiro をインストールするには https://kiro.dev/ にアクセスして、Kiro のデスクトップアプリケーションをダウンロードします。お使いの OS に応じて、Windows、macOS、Linux のいずれかのバージョンを選択してダウンロードしてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/fWMPwIQhyNBXIwrIV0XgC/52b4290352ced3e2aec65ea0a5235e43/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_20.40.15.png)

Kiro をはじめて起動するとソーシャルログインもしくは AWS アカウントでのログインを求められます。お好みの方法でログインしてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/1PL6yxDMwusJmbgW6Lvrn0/c42fae2d5cc35a690f87f5d1a073c502/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_20.42.03.png)

ログインが完了したら VS Code の設定や拡張機能をインポートするかどうかを尋ねられます。元々 VS Code を使用している場合は、設定や拡張機能をインポートすることをお勧めします。以前と同じ環境で Kiro を使用できるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7bib8jK56y0g7CJRCQ7AP5/cf1a688f7b1652f65e6a47c31f04a4a7/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_20.44.01.png)

最初の設定が完了すると、Kiro のメイン画面が表示されます。「Open a project」ボタンをクリックして新しいプロジェクトを作成しましょう。ディレクトリを選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2LaGJF4iwl1brScLxmYUsR/783f0fc164f3180fda07bc2e7cd139df/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.01.20.png)

## スペックでアプリケーションの要件を定義する

それでは Kiro を使ってアプリケーションの開発を始めましょう。AI モデルは「Claude Sonnet 4.0」もしくは「Claude Sonnet3.7」を選択できます。基本的にはより性能が高い Claude Sonnet 4.0 を選択しておくと間違いないでしょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/5G9XStxzzeoZRnQ0hSnq2L/c8e275b3d244434bf2e60a06a111bced/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.05.17.png)

Kiro とのチャットを会話するにあたって「Vibe」もしくは「Spec」のどちらかを選択できます。Vibe は従来のコーディングエージェントを使った開発に近いものです。とにかく素早く実装を進めたかったり、やるべきタスクがすでに明確である場合に適しています。

Spec は始めにアプリケーションの要件を定義してから実装を進める方法です。アプリケーションの要件が明確でなく AI と相談しながら決定したい場合や、構造化された設計をしたい場合に適しています。

Autopilot のスイッチは Kiro を[自動操縦モード](https://kiro.dev/docs/chat/autopilot/)で動かすかどうかを選択します。自動操縦モードでは各ステップごとにユーザーからの承認を求めることなく自律的に開発を進めます。自動操縦モードは開発の効率を上げることができますが、ユーザーの予期せぬコマンドを実行してしまう可能性もあるため、慎重に使用する必要があるでしょう。

ここでは Spec を選択してアプリケーションの要件を定義していきます。「React と TailwindCSS を使って ToDo アプリケーションを作成したい」と Kiro に伝えます。

![](https://images.ctfassets.net/in6v9lxmm5c8/4BpcgmShWLyZOLV8NHs7jF/5019603247b4b211e892da7d9b537e6d/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.15.44.png)

始めに仕様書として `requirements.md` ファイルが生成されます。この仕様書は EARS 表記法を使用しており、アプリケーションの受け入れ条件を含むユーザーストーリーが定義されています。提示された仕様書を確認し、必要に応じてチャットで修正を加えます。作成された仕様書が問題なければ次のステップに進みます。

![](https://images.ctfassets.net/in6v9lxmm5c8/JJwDn6W2QtMuJnm2VitXB/bef6ce1e151399bc131c2602563e90ac/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.19.12.png)

<details>

<summary>`requirements.md` の内容</summary>

```markdown:requirements.md
# Requirements Document

## Introduction

React と TailwindCSS を使用したモダンな ToDo アプリケーションを開発します。ユーザーがタスクを効率的に管理できるシンプルで直感的なインターフェースを提供し、基本的な CRUD 操作（作成、読み取り、更新、削除）をサポートします。

## Requirements

### Requirement 1

**User Story:** ユーザーとして、新しいタスクを追加したいので、やるべきことを記録できる

#### Acceptance Criteria

1. WHEN ユーザーがタスク入力フィールドにテキストを入力し追加ボタンをクリック THEN システムは新しいタスクをリストに追加する SHALL
2. WHEN ユーザーが空のタスクを追加しようとする THEN システムはエラーメッセージを表示し追加を拒否する SHALL
3. WHEN タスクが正常に追加される THEN システムは入力フィールドをクリアする SHALL

### Requirement 2

**User Story:** ユーザーとして、タスクリストを表示したいので、現在のタスクを確認できる

#### Acceptance Criteria

1. WHEN ユーザーがアプリケーションを開く THEN システムは全てのタスクをリスト形式で表示する SHALL
2. WHEN タスクリストが空の場合 THEN システムは「タスクがありません」というメッセージを表示する SHALL
3. WHEN 各タスクが表示される THEN システムはタスクテキスト、完了状態、編集・削除ボタンを含む SHALL

### Requirement 3

**User Story:** ユーザーとして、タスクを完了済みにマークしたいので、進捗を管理できる

#### Acceptance Criteria

1. WHEN ユーザーがタスクのチェックボックスをクリック THEN システムはタスクの完了状態を切り替える SHALL
2. WHEN タスクが完了済みになる THEN システムはタスクテキストに取り消し線を表示する SHALL
3. WHEN 完了済みタスクのチェックボックスをクリック THEN システムはタスクを未完了状態に戻す SHALL

### Requirement 4

**User Story:** ユーザーとして、タスクを編集したいので、内容を修正できる

#### Acceptance Criteria

1. WHEN ユーザーがタスクの編集ボタンをクリック THEN システムはタスクテキストを編集可能な入力フィールドに変更する SHALL
2. WHEN ユーザーが編集を完了し保存ボタンをクリック THEN システムは変更を保存しタスクを通常表示に戻す SHALL
3. WHEN ユーザーが編集をキャンセル THEN システムは変更を破棄し元のタスクテキストを表示する SHALL

### Requirement 5

**User Story:** ユーザーとして、不要なタスクを削除したいので、リストを整理できる

#### Acceptance Criteria

1. WHEN ユーザーがタスクの削除ボタンをクリック THEN システムはタスクをリストから削除する SHALL
2. WHEN タスクが削除される THEN システムは削除されたタスクを即座にUIから除去する SHALL

### Requirement 6

**User Story:** ユーザーとして、タスクをフィルタリングしたいので、特定の状態のタスクのみを表示できる

#### Acceptance Criteria

1. WHEN ユーザーが「全て」フィルターを選択 THEN システムは全てのタスクを表示する SHALL
2. WHEN ユーザーが「未完了」フィルターを選択 THEN システムは未完了のタスクのみを表示する SHALL
3. WHEN ユーザーが「完了済み」フィルターを選択 THEN システムは完了済みのタスクのみを表示する SHALL

### Requirement 7

**User Story:** ユーザーとして、レスポンシブなデザインを使いたいので、様々なデバイスで快適に使用できる

#### Acceptance Criteria

1. WHEN ユーザーがモバイルデバイスでアクセス THEN システムはモバイル向けに最適化されたレイアウトを表示する SHALL
2. WHEN ユーザーがタブレットでアクセス THEN システムはタブレット向けに最適化されたレイアウトを表示する SHALL
3. WHEN ユーザーがデスクトップでアクセス THEN システムはデスクトップ向けに最適化されたレイアウトを表示する SHALL
```

</detail>

要件が定義されたら、次はアプリケーションの設計をします。設計ではアプリケーションのアーキテクチャや実装方針を定義し、`design.md` ファイルが生成されます。設計書にはどのような技術スタックを採用するか、ディレクトリ構成、主要なコンポーネントの設計などが含まれます。設計書を確認し、必要に応じてチャットで修正を加えます。

![](https://images.ctfassets.net/in6v9lxmm5c8/RISo0M77zFRq5FLPCIlGk/aad2ae96dc4cedfefc8c821671015d4c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.30.26.png)

<details>

<summary>`design.md` の内容</summary>

~~~markdown:design.md
# Design Document

## Overview

React と TailwindCSS を使用したモダンな ToDo アプリケーションの設計書です。シンプルで直感的なユーザーインターフェースを提供し、レスポンシブデザインに対応します。アプリケーションは単一ページアプリケーション（SPA）として構築され、ローカルストレージを使用してデータを永続化します。

## Architecture

### Frontend Architecture
- **Framework**: React 18+ (関数コンポーネント + Hooks)
- **Styling**: TailwindCSS 3+
- **State Management**: React useState (ローカルステート)
- **Data Persistence**: localStorage API
- **Build Tool**: Vite (推奨) または Create React App

### Component Hierarchy
```
App
├── Header
├── TodoForm
├── FilterButtons
├── TodoList
│   └── TodoItem (複数)
└── Footer (オプション)
```

## Components and Interfaces

### App Component
- **責任**: アプリケーション全体の状態管理とレイアウト
- **State**: 
  - `todos`: Todo項目の配列
  - `filter`: 現在のフィルター状態 ('all' | 'active' | 'completed')
- **Methods**:
  - `addTodo(text: string): void`
  - `toggleTodo(id: string): void`
  - `editTodo(id: string, text: string): void`
  - `deleteTodo(id: string): void`
  - `setFilter(filter: FilterType): void`

### TodoForm Component
- **責任**: 新しいタスクの入力と追加
- **Props**: 
  - `onAddTodo: (text: string) => void`
- **State**: 
  - `inputValue: string`
- **Features**: 
  - バリデーション（空文字チェック）
  - Enterキーでの送信対応

### TodoList Component
- **責任**: フィルタリングされたタスクリストの表示
- **Props**: 
  - `todos: Todo[]`
  - `filter: FilterType`
  - `onToggleTodo: (id: string) => void`
  - `onEditTodo: (id: string, text: string) => void`
  - `onDeleteTodo: (id: string) => void`

### TodoItem Component
- **責任**: 個別のタスク項目の表示と操作
- **Props**: 
  - `todo: Todo`
  - `onToggle: () => void`
  - `onEdit: (text: string) => void`
  - `onDelete: () => void`
- **State**: 
  - `isEditing: boolean`
  - `editText: string`

### FilterButtons Component
- **責任**: フィルター選択UI
- **Props**: 
  - `currentFilter: FilterType`
  - `onFilterChange: (filter: FilterType) => void`

## Data Models

### Todo Interface
```typescript
interface Todo {
  id: string;          // UUID または timestamp
  text: string;        // タスクの内容
  completed: boolean;  // 完了状態
  createdAt: Date;     // 作成日時
  updatedAt: Date;     // 更新日時
}
```

### FilterType
```typescript
type FilterType = 'all' | 'active' | 'completed';
```

### LocalStorage Schema
```typescript
interface TodoAppData {
  todos: Todo[];
  lastUpdated: string; // ISO date string
}
```

## Error Handling

### Input Validation
- 空文字列の入力を防ぐ
- 最大文字数制限（例：500文字）
- 特殊文字のサニタイゼーション

### LocalStorage Error Handling
- ストレージ容量不足の処理
- JSON パースエラーの処理
- ブラウザサポートチェック

### User Feedback
- 成功・エラーメッセージの表示
- ローディング状態の表示
- 操作確認ダイアログ（削除時）

## Testing Strategy

### Unit Testing
- **Framework**: Vitest + React Testing Library
- **Coverage**: 
  - 各コンポーネントの基本機能
  - ユーティリティ関数
  - カスタムフック

### Integration Testing
- コンポーネント間の連携
- LocalStorage との連携
- フィルタリング機能

### Code Quality Tools
- **Linter**: oxlint
- **Formatter**: Prettier (oxlintと併用)

## UI/UX Design

### TailwindCSS Design System
- **Color Palette**: 
  - Primary: blue-500, blue-600
  - Success: green-500
  - Danger: red-500
  - Gray scale: gray-100 to gray-900

### Layout Structure
- **Container**: max-width with responsive padding
- **Card Design**: shadow, rounded corners, white background
- **Typography**: clear hierarchy with appropriate font sizes

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- Color contrast compliance (WCAG 2.1 AA)
- Focus indicators

## Performance Considerations

### Optimization Strategies
- React.memo for TodoItem components
- useCallback for event handlers
- Debounced localStorage updates
- Lazy loading for large todo lists

### Bundle Size
- Tree shaking for unused TailwindCSS classes
- Code splitting (if needed for future features)
- Optimized build configuration
~~~
</detail>

最後にタスクの実行手順を定義する `tasks.md` ファイルが生成されます。タスクはアプリケーションの実装に必要な具体的なステップを示します。

![](https://images.ctfassets.net/in6v9lxmm5c8/AutsDOqUHnovuhp5LoNnZ/4ba40fed2a28d04720bea995fdb53e9e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.34.11.png)

<details>

<summary>`tasks.md` の内容</summary>

```markdown:tasks.md
# Implementation Plan

- [ ] 1. プロジェクトのセットアップと基本構造の作成
  - Vite を使用して React + TypeScript プロジェクトを初期化
  - TailwindCSS、Vitest、oxlint の設定とインストール
  - 基本的なディレクトリ構造とファイルの作成
  - _Requirements: 全体的な基盤_

- [ ] 2. データモデルとユーティリティ関数の実装
  - Todo インターフェースと FilterType の型定義を作成
  - localStorage との連携ユーティリティ関数を実装
  - UUID生成やデータバリデーション関数を作成
  - _Requirements: 1.1, 2.1, 2.2_

- [ ] 3. 基本的なApp コンポーネントの実装
  - App コンポーネントの基本構造と状態管理を実装
  - todos 配列と filter 状態の管理
  - localStorage からの初期データ読み込み機能
  - _Requirements: 2.1, 2.2_

- [ ] 4. TodoForm コンポーネントの実装
  - 新しいタスク入力フォームの作成
  - バリデーション機能（空文字チェック）の実装
  - Enterキー送信とフォームリセット機能
  - _Requirements: 1.1, 1.2, 1.3_

- [ ] 5. TodoItem コンポーネントの実装
  - 個別タスク項目の表示コンポーネント作成
  - チェックボックスによる完了状態切り替え機能
  - 編集モードの実装（インライン編集）
  - 削除ボタンの実装
  - _Requirements: 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 5.1, 5.2_

- [ ] 6. TodoList コンポーネントの実装
  - タスクリストの表示コンポーネント作成
  - フィルタリング機能の実装
  - 空リスト時のメッセージ表示
  - _Requirements: 2.1, 2.2, 6.1, 6.2, 6.3_

- [ ] 7. FilterButtons コンポーネントの実装
  - フィルター選択ボタンの作成
  - アクティブフィルターの視覚的表示
  - フィルター切り替え機能
  - _Requirements: 6.1, 6.2, 6.3_

- [ ] 8. TailwindCSS を使用したスタイリングの実装
  - レスポンシブデザインの適用
  - モバイル、タブレット、デスクトップ対応
  - アクセシビリティを考慮したスタイリング
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 9. localStorage 連携機能の完成
  - データの永続化機能を全コンポーネントに統合
  - エラーハンドリングの実装
  - データの自動保存機能
  - _Requirements: 全ての要件に関連_

- [ ] 10. コンポーネントの単体テストの作成
  - Vitest + React Testing Library を使用したテスト作成
  - 各コンポーネントの基本機能テスト
  - ユーザーインタラクションのテスト
  - _Requirements: 全ての要件の検証_

- [ ] 11. 統合テストとエラーハンドリングの実装
  - コンポーネント間の連携テスト
  - localStorage エラーハンドリングのテスト
  - バリデーション機能のテスト
  - _Requirements: 1.2, エラーハンドリング全般_

- [ ] 12. 最終的な統合とポリッシュ
  - 全機能の統合テスト
  - パフォーマンス最適化（React.memo、useCallback）
  - アクセシビリティの最終チェック
  - oxlint による最終的なコード品質チェック
  - _Requirements: 全ての要件の最終検証_
```

</detail>

設計・計画フェーズが完了したら実装フェーズに移行します。実装を開始するためには `tasks.md` ファイルに記載されたタスク項目の横に表示される「Start Task」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/1edXtFcKsoDKNJAmFVGUSb/61d9ea1357cd085aa9d7e2a629b1a01c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.38.53.png)

コマンドの実行などのタイミングで適宜承認を求められるので、問題ないことを確認して「Run」をクリックします。「Trust」をクリックすると関連するコマンドは今後承認なしで実行されるようになります。Trust に追加したコマンドは `kiroAgent.trustedCommands` の設定から確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3dBByCne8YkdYnpaC24zCK/fdfab3b52be192f3ee2a71c9eebc7b58/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.40.12.png)

## フックの設定

続いてフックを設定します。フックは特定のイベントが発生したときに自動的に実行されるアクションを定義します。例えばファイルが作成・削除されたようなイベントです。フックを使用することで定型的なタスクを毎回指示する必要がなくなり、コードベースの一貫性を保つことができます。

ここでは TypeScript ファイルが保存されたときに自動的にフォーマットを実行するフックを設定しましょう。左サイドバーの Kiro アイコン（👻 みたいなやつ）をクリックして「AGENT HOOKS」の右側にある「+」をクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/5GoyzjELnI508AALEo8AzH/9f2743ea54ce11c6ab04d6148c59977a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.49.04.png)

フックの設定は自然言語で記述します。ここでは「TypeScript ファイルが保存されたときに自動的にフォーマットを実行する」と Kiro に伝えます。

```text
When a TypeScript file(*.ts, *.tsx) is saved, run the command "npx oxlint --fix" to format the code.
```

フォームをサブミットすると入力したプロンプトに基づいてフックが生成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5djMUPEIsHhw5MX35pkMMb/76166687c407117adb1357b56b11eae9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_21.53.21.png)

生成されたフックは `.kiro/hooks` ディレクトリに JSON として保存されます。

```json:hooks/oxlint-format-hook.kiro.hook
{
  "enabled": true,
  "name": "Oxlint Auto Format",
  "description": "Automatically runs oxlint --fix to format TypeScript files when they are saved",
  "version": "1",
  "when": {
    "type": "fileEdited",
    "patterns": [
      "**/*.ts",
      "**/*.tsx"
    ]
  },
  "then": {
    "type": "askAgent",
    "prompt": "A TypeScript file has been saved. Please run the command \"npx oxlint --fix\" to format the code automatically."
  }
}
```

## プロジェクトの長期記憶

Kiro ではプロジェクトの長期記憶を管理するために「Steering」機能を使用します。Steering を使用することで、プロジェクトの目的や設計パターン, 開発スタイルなどを文書化します。これにより、Kiro はプロジェクトのコンテキストを理解し、コードの一貫性を保つことができます。またこのような文章はプロジェクトに新しく参加した開発者にとっても有用な情報となるでしょう。

Kiro は以下の 3 つの基礎文書を自動で生成します。

- `product.md`: 製品の目的・ターゲットユーザー・主要機能・ビジネス目標を定義する
- `tech.md`: 選択したフレームワークやライブラリ、開発ツールと言った技術スタックを定義する
- `structure.md`: プロジェクトのディレクトリ構造や命名規則・アーキテクチャ上の決定事項を定義する

また上記の基礎的な文書に加えて、プロジェクトに特有の文書を追加することも可能です。例えば「セキュリティポリシー」や「開発ガイドライン」などです。

基礎文書を作成するためには左サイドバーの Kiro アイコンをクリックして「Steering」のセクションを開きます。「Generate Steering Docs」ボタンをクリックして新しい文書を作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6P7vmyBbMfZl8BBQ9ChWqa/3243e7203c1cd807082de57abde6e795/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-07-15_22.27.42.png)

Kiro がプロジェクトの概要を調査し、基礎文書を生成します。生成された文書は `.kiro/steering` ディレクトリに保存されます。

<details>
<summary>生成された文書の例</summary>

```markdown:product.md
# Product Overview

A modern Todo application built with React and TailwindCSS that provides efficient task management with an intuitive interface.

## Core Features
- Create, read, update, and delete tasks (CRUD operations)
- Mark tasks as complete/incomplete with visual feedback
- Filter tasks by status (all, active, completed)
- Inline editing of task text
- Responsive design for mobile, tablet, and desktop
- Data persistence using localStorage

## User Experience Goals
- Simple and intuitive interface
- Immediate visual feedback for all actions
- Accessible design following WCAG 2.1 AA standards
- Smooth interactions across all device types

## Technical Approach
- Single Page Application (SPA) architecture
- Local state management with React hooks
- Client-side data persistence
- Component-based architecture for maintainability
```

~~~markdown:tech.md
# Technology Stack

## Core Technologies
- **React 18+**: Function components with hooks for state management
- **TypeScript**: For type safety and better developer experience
- **TailwindCSS 3+**: Utility-first CSS framework for styling
- **Vite**: Build tool and development server (preferred over Create React App)

## Development Tools
- **oxlint**: Primary linter for code quality
- **Prettier**: Code formatter (used alongside oxlint)
- **Vitest**: Testing framework
- **React Testing Library**: Component testing utilities

## Data & State Management
- **React useState**: Local component state management
- **localStorage API**: Client-side data persistence
- **Custom hooks**: For reusable stateful logic

## Common Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Browser Support
- Modern browsers with ES6+ support
- localStorage API support required
- Responsive design for mobile, tablet, desktop
~~~

~~~markdown:structure.md
# Project Structure

## Root Directory Layout
```
/
├── src/                    # Source code
├── public/                 # Static assets
├── .kiro/                  # Kiro configuration and specs
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # TailwindCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Source Code Organization
```
src/
├── components/             # React components
│   ├── App.tsx            # Main application component
│   ├── TodoForm.tsx       # Task input form
│   ├── TodoList.tsx       # Task list container
│   ├── TodoItem.tsx       # Individual task item
│   ├── FilterButtons.tsx  # Filter selection UI
│   └── Header.tsx         # Application header
├── types/                 # TypeScript type definitions
│   └── todo.ts           # Todo and FilterType interfaces
├── utils/                 # Utility functions
│   ├── localStorage.ts   # localStorage operations
│   └── validation.ts     # Input validation helpers
├── hooks/                 # Custom React hooks
│   └── useTodos.ts       # Todo state management hook
├── styles/               # Global styles
│   └── index.css         # TailwindCSS imports and globals
├── main.tsx              # Application entry point
└── App.css               # Component-specific styles (if needed)
```

## Component Architecture
- **Hierarchical structure**: App → TodoForm/FilterButtons/TodoList → TodoItem
- **Single responsibility**: Each component handles one specific concern
- **Props-based communication**: Data flows down, events bubble up
- **Reusable components**: TodoItem designed for list rendering

## File Naming Conventions
- **Components**: PascalCase with .tsx extension (e.g., TodoItem.tsx)
- **Utilities**: camelCase with .ts extension (e.g., localStorage.ts)
- **Types**: camelCase with .ts extension (e.g., todo.ts)
- **Hooks**: camelCase starting with 'use' (e.g., useTodos.ts)

## Import Organization
1. React and external libraries
2. Internal components
3. Types and interfaces
4. Utilities and helpers
5. Styles (if any)

## Testing Structure
```
src/
├── __tests__/            # Test files
│   ├── components/       # Component tests
│   ├── utils/           # Utility function tests
│   └── hooks/           # Custom hook tests
└── test-utils.ts        # Testing utilities and setup
```
~~~
</detail>

## 参考

- [Kiro: The AI IDE for prototype to production](https://kiro.dev/index)
- [Kiro のご紹介 – プロトタイプからプロダクションまで、あなたと共に働く新しい Agentic IDE | Amazon Web Services ブログ](https://aws.amazon.com/jp/blogs/news/introducing-kiro/)
