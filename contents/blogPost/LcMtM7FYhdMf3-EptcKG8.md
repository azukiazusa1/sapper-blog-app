---
id: LcMtM7FYhdMf3-EptcKG8
title: "仕様駆動開発を支える Spec Kit を試してみた"
slug: "spec-driven-development-with-spec-kit"
about: "仕様駆動開発（Specification-Driven Development, SDD）は、AI コーディングエージェントを活用した新しいソフトウェア開発スタイルです。GitHub が提供する Spec Kit は、仕様駆動開発を支援するためのツールキットであり、AI との対話を通じて正確な受け入れ基準の定義とコード生成を支援します。この記事では Spec Kit を使用して仕様駆動開発を試してみます。"
createdAt: "2025-09-07T10:58+09:00"
updatedAt: "2025-09-07T10:58+09:00"
tags: ["AI", "仕様駆動開発", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6TgAQf327eF11RxsgHZnzo/c0e80b4829887d16014082e098e4afa8/salmon_ikura_donburi_7549.png"
  title: "サーモンとイクラ丼のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Spec Kit で提供される3つの主要なカスタムスラッシュコマンドはどれですか？"
      answers:
        - text: "/specify、/plan、/tasks"
          correct: true
          explanation: ""
        - text: "/create、/build、/test"
          correct: false
          explanation: null
        - text: "/init、/setup、/deploy"
          correct: false
          explanation: null
        - text: "/start、/develop、/finish"
          correct: false
          explanation: null
    - question: "仕様書作成時に「[NEEDS CLARIFICATION]」マーカーが挿入される目的は何ですか？"
      answers:
        - text: "エラーを示すため"
          correct: false
          explanation: null
        - text: "完了したタスクを示すため"
          correct: false
          explanation: null
        - text: "不明瞭な点があることを示し、反復的な改善を促すため"
          correct: true
          explanation: "マーカーは仕様書の不明瞭な箇所を特定し、Claude Code との対話による改善を促します"
        - text: "重要な部分を強調するため"
          correct: false
          explanation: null
    - question: "仕様駆動開発を実践する際のメリットとして正しくないものはどれですか？"
      answers:
        - text: "AIに正確に要件を伝えることができる"
          correct: false
          explanation: "明確な仕様により、AIとのコミュニケーションが向上します"
        - text: "仕様書を信頼できる情報源として運用できる"
          correct: false
          explanation: "仕様書が唯一の真実となり、信頼性が向上します"
        - text: "期待に沿ったコードが生成される可能性が高まる"
          correct: false
          explanation: "明確な仕様により、より正確なコード生成が可能になります"
        - text: "コードの記述量が大幅に減る"
          correct: true
          explanation: "仕様駆動開発は開発プロセスの改善であり、必ずしもコード量の削減を保証するものではありません"

published: true
---

[Kiro](https://kiro.dev/) と呼ばれる AI IDE の登場は、仕様駆動開発と呼ばれる AI コーディングエージェントを活用した新しい開発スタイルの可能性を示しました。仕様駆動開発とは、まず AI と対話しながら要件定義・システム設計を行い、その後作成した設計書をもとに AI にコード生成を行わせる開発スタイルです。

ユーザーの要求をまず明確な仕様として定義することで、ユーザーが頭の中で思い浮かべていた要件を言語化し AI に正確に伝えることができるため、期待に沿ったコードが生成される可能性を高めることができます。

仕様駆動開発では仕様書を信頼できる情報源として運用できるという利点もあります。従来のソフトウェア開発のプロセスでは、要件や設計の変更が頻繁に発生し、ドキュメントが最新の状態に保たれないことが多々ありました。そのため動くコードこそが唯一の真実であり、仕様であるという認識が一般的でした。仕様書はあくまでコードの理解を補助するための参考資料に過ぎず、かつ古い情報に基づいていることが多かったのです。

仕様駆動開発はこの関係を逆転させます。仕様書が唯一の真実であり、コードはその仕様を実装したものであるという考え方です。仕様書がコードを生成するための明確な定義となるのです。仕様駆動開発の世界では、開発者は自然言語を用いて仕様書をメンテナンスすることで機能の追加や変更を行います。コードは仕様の変更に伴い付随的に生成されるものとなります。

GitHub が提供する [Spec Kit](https://github.com/github/spec-kit) は、仕様駆動開発を支援するためのツールキットです。AI との反復的な対話を通じて正確な受け入れ基準の定義を支援し、その受け入れ基準に基づいてコードを生成するためのワークフローを提供します。また仕様駆動開発の実践は最初期に要件定義書や設計書を作成するだけでなく、ソフトウェアのライフサイクル全体にわたる継続的な活動です。チームによるレビューや仕様書のバージョン管理、マージといったチームプロセスも同様にサポートします。

この記事では Spec Kit を実際に使用して仕様駆動開発を試してみます。

## Spec Kit のインストール

Spec Kit のインストールには [uv](https://docs.astral.sh/uv/) が必要です。uv をインストールするには以下のコマンドを実行します。

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
```

以下のコマンドで Spec Kit を使用してプロジェクトを初期化します。

```sh
uvx --from git+https://github.com/github/spec-kit.git specify init <PROJECT_NAME>
```

始めにどのコーディングエージェントを使用するかを選択します。以下の 3 つの選択肢があります。

- copilot: GitHub Copilot
- claude: Claude Code
- gemini: Gemini CLI

ここでは Claude Code を選択しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/6JmxKQFoF6QJPBAki3vt3W/e03d91818d77f4e1248ad983e2d0d3fd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-07_12.57.56.png)

以下のディレクトリ構成でプロジェクトが初期化されます。

```sh
.
├── .claude
│   └── commands
│       ├── plan.md
│       ├── specify.md
│       └── tasks.md
├── memory
│   ├── constitution_update_checklist.md
│   └── constitution.md
├── scripts
│   ├── check-task-prerequisites.sh
│   ├── common.sh
│   ├── create-new-feature.sh
│   ├── get-feature-paths.sh
│   ├── setup-plan.sh
│   └── update-agent-context.sh
└── templates
    ├── agent-file-template.md
    ├── plan-template.md
    ├── spec-template.md
    └── tasks-template.md
```

`.claude/commands` ディレクトリにはプロジェクト単位で有効な Claude Code の[カスタムスラッシュコマンド](https://docs.anthropic.com/ja/docs/claude-code/slash-commands#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%82%B9%E3%83%A9%E3%83%83%E3%82%B7%E3%83%A5%E3%82%B3%E3%83%9E%E3%83%B3%E3%83%89)が定義されています。Spec kit では以下の 3 つのコマンドが用意されています。このコマンドを使用して AI と対話しながら仕様書を作成します。

1. `/specify`: 仕様書を作成する
2. `/plan`: 実装計画を作成する
3. `/tasks`: 実行可能なタスクの一覧を作成する

コマンドの詳細な指示は各コマンドの Markdown ファイルに記載されています。それぞれのコマンドのプロンプトでは `/scripts` ディレクトリにあるシェルスクリプトを実行して仕様書の作成やタスクの前提条件をチェックしたり、`/templates` や `/memory` ディレクトリにあるテンプレートや憲章ファイルを参照するように指示されています。

## 1. 仕様書の作成

最初のステップは `/specify` コマンドを使用して仕様書を作成することです。Claude Code を起動してコマンドを実行します。`/specify` コマンドの引数に開発する機能の具体的な要件を指定します。

```sh
/specify 新しい TODO 管理アプリケーション「TaskFlow」を作成する。プロジェクトの背景は...
```

:::tip
何を構築しようとしているのか、そしてなぜ構築しようとしているのかを、できるだけ明確に記述してください。また、この時点では技術的な詳細は含めないでください。
:::

以下の例では TODO アプリケーションを作成するための要件を指定しています。

~~~markdown
新しい TODO 管理アプリケーション「TaskFlow」を作成する。

### 1. プロジェクトの背景と目的

**なぜ構築するのか：**
- **個人の生産性向上**: 日々のタスクを効率的に管理し、重要なことを忘れないようにする
- **認知的負荷の軽減**: 頭の中で覚えておく必要をなくし、創造的な作業に集中できるようにする
- **達成感の可視化**: 完了したタスクを記録し、進捗を実感できるようにする
- **優先順位の明確化**: 複数のタスクから最も重要なものを識別し、効果的な時間配分を支援する

### 2. 何を構築するのか

**コア機能要件：**

#### 基本的なタスク管理
- タスクの作成、編集、削除機能
- タスクのタイトルと詳細説明の記入
- タスクの完了/未完了状態の切り替え
- タスクの作成日時と更新日時の自動記録

#### 組織化機能
- カテゴリーまたはプロジェクトによるタスクのグループ化
- タグ付けによる柔軟な分類
- 期限日の設定と期限切れタスクの強調表示
- 優先度レベル（高・中・低）の設定

#### 検索とフィルタリング
- キーワードによるタスク検索
- ステータス（完了/未完了）によるフィルター
- カテゴリー、タグ、優先度によるフィルター
- 期限（今日、今週、期限切れ）によるフィルター

#### ユーザビリティ機能
- 一括選択と一括操作（削除、完了マーク）
- キーボードショートカット対応
- レスポンシブデザイン（PC、タブレット、スマートフォン対応）

### 3. 技術的要件

**データ管理：**
- ローカルストレージでのデータ保存

**アクセシビリティ：**
- WCAG 2.1 AA準拠

### 4. ユーザーペルソナ

**主要ターゲット：**
- **ビジネスプロフェッショナル**: 複数のプロジェクトを並行管理
- **学生**: 課題と試験の期限管理
- **フリーランサー**: クライアントワークとプライベートタスクの両立
- **一般ユーザー**: 日常の買い物リストや家事の管理

### 5. 成功指標

- ユーザーの70%が週3回以上アプリを使用
- タスク完了率が導入前と比較して30%向上
- ユーザー満足度スコア4.0以上（5段階評価）
- 平均セッション時間5分以内での主要タスク完了
~~~

仕様を作成するための TODO リストが生成されました。始めに `create-new-feature.sh` スクリプトを実行し、新しい機能開発のための環境セットアップを行います。

1. 機能の要件からブランチ名を生成して新しい Git ブランチを作成
2. 機能のナンバリングを行い機能番号を決定
3. `specs/番号-機能名/` フォルダを作成
4. `spec-template.md` テンプレートをコピーして `specs/番号-機能名/spec.md` を作成

ここでは `001-todo-taskflow-1` ブランチを作成し、`specs/001-todo-taskflow-1/spec.md` に仕様書が保存されました。

~~~markdown:specs/001-todo-taskflow-1/spec.md
# Feature Specification: TaskFlow TODO Management Application

**Feature Branch**: `001-todo-taskflow-1`  
**Created**: 2025-09-07  
**Status**: Draft  
**Input**: User description: "新しい TODO 管理アプリケーション「TaskFlow」を作成する。

### 1. プロジェクトの背景と目的

**なぜ構築するのか：**
- **個人の生産性向上**: 日々のタスクを効率的に管理し、重要なことを忘れないようにする
- **認知的負荷の軽減**: 頭の中で覚えておく必要をなくし、創造的な作業に集中できるようにする
- **達成感の可視化**: 完了したタスクを記録し、進捗を実感できるようにする
- **優先順位の明確化**: 複数のタスクから最も重要なものを識別し、効果的な時間配分を支援する

### 2. 何を構築するのか

**コア機能要件：**

#### 基本的なタスク管理
- タスクの作成、編集、削除機能
- タスクのタイトルと詳細説明の記入
- タスクの完了/未完了状態の切り替え
- タスクの作成日時と更新日時の自動記録

#### 組織化機能
- カテゴリーまたはプロジェクトによるタスクのグループ化
- タグ付けによる柔軟な分類
- 期限日の設定と期限切れタスクの強調表示
- 優先度レベル（高・中・低）の設定

#### 検索とフィルタリング
- キーワードによるタスク検索
- ステータス（完了/未完了）によるフィルター
- カテゴリー、タグ、優先度によるフィルター
- 期限（今日、今週、期限切れ）によるフィルター

#### ユーザビリティ機能
- 一括選択と一括操作（削除、完了マーク）
- キーボードショートカット対応
- レスポンシブデザイン（PC、タブレット、スマートフォン対応）

### 3. 技術的要件

**データ管理：**
- ローカルストレージでのデータ保存

**アクセシビリティ：**
- WCAG 2.1 AA準拠

### 4. ユーザーペルソナ

**主要ターゲット：**
- **ビジネスプロフェッショナル**: 複数のプロジェクトを並行管理
- **学生**: 課題と試験の期限管理
- **フリーランサー**: クライアントワークとプライベートタスクの両立
- **一般ユーザー**: 日常の買い物リストや家事の管理

### 5. 成功指標

- ユーザーの70%が週3回以上アプリを使用
- タスク完了率が導入前と比較して30%向上
- ユーザー満足度スコア4.0以上（5段階評価）
- 平均セッション時間5分以内での主要タスク完了"

## Execution Flow (main)
```
1. Parse user description from Input
   → Parsed: Comprehensive TODO app with productivity focus ✓
2. Extract key concepts from description
   → Actors: Business professionals, students, freelancers, general users
   → Actions: Create, edit, delete, organize, search, filter tasks
   → Data: Tasks, categories, tags, priorities, due dates
   → Constraints: Local storage only, WCAG 2.1 AA compliance
3. For each unclear aspect:
   → [NEEDS CLARIFICATION: Keyboard shortcuts - which specific shortcuts are required?]
   → [NEEDS CLARIFICATION: Bulk operations - what is the maximum number of tasks that can be selected at once?]
4. Fill User Scenarios & Testing section ✓
5. Generate Functional Requirements ✓
6. Identify Key Entities ✓
7. Run Review Checklist
   → WARN "Spec has uncertainties" - 2 clarification items marked
8. Return: SUCCESS (spec ready for planning with minor clarifications)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
A user opens TaskFlow to manage their daily work and personal tasks. They create new tasks with titles and descriptions, organize them by categories and priorities, set due dates, and mark completed tasks as done. They can quickly find specific tasks using search and filters, and perform bulk operations to efficiently manage multiple tasks at once.

### Acceptance Scenarios
1. **Given** a user has no existing tasks, **When** they create a new task with title "Complete project report" and due date "2025-09-10", **Then** the task appears in their task list with the specified details and status "not completed"

2. **Given** a user has multiple tasks in different categories, **When** they apply a filter for "Work" category, **Then** only tasks in the Work category are displayed

3. **Given** a user has completed several tasks, **When** they view their task list, **Then** completed tasks are visually distinguished from incomplete tasks

4. **Given** a user has tasks with various priorities, **When** they sort by priority, **Then** high priority tasks appear before medium and low priority tasks

5. **Given** a user has overdue tasks, **When** they view their task list, **Then** overdue tasks are highlighted or marked distinctly

### Edge Cases
- What happens when a user tries to create a task with no title?
- How does the system handle tasks with due dates in the past?
- What occurs when local storage is full and cannot store new tasks?
- How does the system behave when a user tries to delete all tasks at once?
- What happens when search returns no results?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: System MUST allow users to create tasks with title and optional description
- **FR-002**: System MUST allow users to edit existing task titles and descriptions
- **FR-003**: System MUST allow users to delete tasks individually or in bulk
- **FR-004**: System MUST track and display task completion status (completed/not completed)
- **FR-005**: System MUST automatically record creation and last modified timestamps for each task
- **FR-006**: System MUST allow users to assign categories to tasks for organization
- **FR-007**: System MUST allow users to add multiple tags to tasks for flexible classification
- **FR-008**: System MUST allow users to set due dates for tasks
- **FR-009**: System MUST highlight or mark tasks that are past their due date
- **FR-010**: System MUST allow users to assign priority levels (high, medium, low) to tasks
- **FR-011**: System MUST provide keyword search functionality across task titles and descriptions
- **FR-012**: System MUST allow filtering tasks by completion status
- **FR-013**: System MUST allow filtering tasks by category, tags, and priority level
- **FR-014**: System MUST allow filtering tasks by due date ranges (today, this week, overdue)
- **FR-015**: System MUST support bulk selection of tasks for mass operations
- **FR-016**: System MUST support keyboard navigation and shortcuts for task operations [NEEDS CLARIFICATION: which specific shortcuts are required?]
- **FR-017**: System MUST display properly on desktop computers, tablets, and mobile phones
- **FR-018**: System MUST persist all task data using local browser storage
- **FR-019**: System MUST meet WCAG 2.1 AA accessibility standards
- **FR-020**: System MUST limit bulk operations to prevent performance issues [NEEDS CLARIFICATION: what is the maximum number of tasks that can be selected at once?]

### Key Entities
- **Task**: Represents a single item to be completed, with title, description, completion status, creation date, modification date, due date, priority, category, and tags
- **Category**: Represents a grouping mechanism for related tasks (e.g., "Work", "Personal", "Shopping")
- **Tag**: Represents flexible labels that can be applied to tasks for cross-category organization
- **Priority Level**: Enumerated value representing task importance (High, Medium, Low)

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain (2 items need clarification)
- [x] Requirements are testable and unambiguous  
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed (pending clarification resolution)

---
~~~

最初の 1 度の思考で要件を完全に満たした仕様書を作成することは困難です。Claude Code と対話しながら仕様書を反復的に改善していきます。この作業は同じセッション内で行う必要があります。

仕様書の内容に不明瞭な点がある場合は `[NEEDS CLARIFICATION]` マーカーが自動的に挿入されます。マーカーが挿入された箇所を中心に Claude Code と対話しながら仕様書を改善します。

例として、キーボードショートカットの具体的な内容や一括操作で選択可能なタスクの最大数など、仕様書に不明瞭な点がありました。これらの点について Claude Code と対話しながら仕様書を改善します。

```sh
キーボードショートカットは具体的に以下のようにしてください。
- 新しいタスクの作成: Ctrl+N (Windows) / Cmd+N (Mac)
- タスクの保存: Ctrl+S (Windows) / Cmd+S (Mac)
- 編集のキャンセル: Esc
- タスクの完了/未完了切り替え: Ctrl+D (Windows) / Cmd+D (Mac)
- タスクの削除: Ctrl+Del (Windows) / Cmd+Del (Mac)
```

```sh
一括操作で選択可能なタスクの最大数は 50 件としてください。
```

最後に Claude Code にレビューと受け入れチェックリストの検証を依頼します。要件を満たしている項目にはチェックを入れ、そうでない項目にはチェックを入れないようにしてください。依頼には以下のプロンプトが使用できます。

```sh
レビューと承認チェックリストを読み、機能仕様が基準を満たしている場合はチェックリストの各項目にチェックを入れてください。満たしていない場合は空欄のままにしておいてください。
```

レビューの結果、「LocalStorage」を使用することが技術的な詳細に該当するため、チェックが外れました。

```markdown
⏺ ✅ レビューチェックリスト完了

  📋 チェック結果

  Content Quality:
  - ❌ No implementation details - 実装詳細が含まれています
    - Line 46: "ローカルストレージでのデータ保存"
    - Line 143: "System MUST persist all task data using local browser storage"
  - ✅ Focused on user value and business needs
  - ✅ Written for non-technical stakeholders
  - ✅ All mandatory sections completed

  Requirement Completeness:
  - ✅ No [NEEDS CLARIFICATION] markers remain
  - ✅ Requirements are testable and unambiguous
  - ✅ Success criteria are measurable
  - ✅ Scope is clearly bounded
  - ✅ Dependencies and assumptions identified

  🔧 修正が必要な項目

  実装詳細（ローカルストレージ）を削除し、データ永続化の要件をより抽象的に記述する必要があります。
```

この要件を削除するように Claude Code に依頼します。

```sh
データ永続化の要件をより抽象的に記述し、実装詳細（ローカルストレージ）を削除してください。デバイス間でデータを同期する必要はありません。
```

最終的にすべてのチェック項目にチェックが入り、仕様書が完成しました。続いて実装計画フェースに移ります。


## 2. 実装計画の作成

仕様書の作成が完了したら、次に `/plan` コマンドを使用して実装計画を作成します。`/plan` コマンドでは具体的にどのような技術スタックで実装するのかを指定します。

```sh
/plan 以下の技術スタックで実装計画を作成してください。
- Next.js（App Router）
- TypeScript
- Tailwind CSS
- LocalStorage
```

`setup-plan.sh` スクリプトを実行して実装計画のための環境セットアップを行います。実行計画の作成フェーズではいくつかの実装詳細ファイルが `/specs/番号-機能名/` ディレクトリに作成されます。今回は以下の成果物が生成されました。

```
フェーズ 0 - 調査：

/specs/001-todo-taskflow-1/research.md - 技術スタック分析とアーキテクチャの決定

フェーズ 1 - 設計：

/specs/001-todo-taskflow-1/data-model.md - 検証ルール付きの完全なTypeScriptデータモデル
/specs/001-todo-taskflow-1/contracts/task-service.ts - タスク管理サービスインターフェース
/specs/001-todo-taskflow-1/contracts/storage-service.ts - LocalStorage永続化インターフェース
/specs/001-todo-taskflow-1/contracts/ui-hooks.ts - UIコンポーネント用Reactフックインターフェース
/specs/001-todo-taskflow-1/quickstart.md - 包括的テストおよび検証ガイド

フェーズ 2 - タスク計画：

plan.mdに記録された実装戦略
```

`research.md` ファイルを確認し、指示した技術スタックが適切に仕様に反映されていることを確認しましょう。問題がある場合は特定のバージョンを指定するなど。Claude Code と対話しながら修正します。

```sh
- Tailwind CSS のバージョンは 4.0 以降を使用し、CSS ファイルで設定管理を行う CSS First Configurations を採用してください。
- テスティングフレームワークは Jest ではなく Vitest を使用してください。
```

実装計画の最後に見落としていた点がないか Claude Code に再度確認を依頼します。以下のようなプロンプトが使用できます。これにより実装計画を洗練させることができます。

```sh
今度は実装計画と実装詳細ファイルを監査してもらいたいと思います。
これらを読み通して、読むことで明らかになる、あなたが行う必要のあるタスクの順序があるかどうかを判断する視点で確認してください。ここに十分な情報があるかどうか分からないからです。例えば、コア実装を見ると、コア実装や改良の各ステップを進める際に、情報を見つけることができる実装詳細の適切な場所を参照できると有用でしょう。
```

結果としていくつかの改善点が見つかりました。例えば、Tailwind CSS のテーマが指定されていない、ページの構造が明確でない、などです。これらの点を Claude Code と対話しながら改善します。

```sh
ページ構造を明確にするために、以下のページを追加してください。
- / (ホームページ): アプリの概要とナビゲーション
- /tasks (タスク一覧ページ): すべてのタスクのリスト
- /tasks/[id] (タスク詳細ページ): 個々のタスクの詳細
```

最終的に作成された実行計画は以下のリンクから確認できます。

https://github.com/azukiazusa1/todo-app-by-spec-kit/specs/001-todo-taskflow-1

## 3. タスクの作成

実装計画が完成したら、`/tasks` コマンドを使用して実行可能なタスクの一覧を作成します。

```sh
/tasks
```

コマンドを実行すると `check-task-prerequisites.sh` スクリプトが実行され、タスクを実行するための前提条件が満たされているかどうかがチェックされます。`plan.md` ファイルは必須条件です。その他 `research.md` や `data-model.md` などの実装詳細ファイルも調査します。

前提条件を満たしている場合、タスクの一覧が `/specs/番号-機能名/tasks.md` ファイルに生成されます。以下は生成されたタスクの一部です。`[P]` マークは並行して実行可能なタスクを示します。

```markdown:specs/001-todo-taskflow-1/tasks.md
# Tasks: TaskFlow TODO Management Application

**Input**: Design documents from `/Users/xxx/sandbox/spec-driven-todo-app/specs/001-todo-taskflow-1/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, page-structure.md, quickstart.md

...

## Phase 3.1: Setup
- [ ] **T001** Create Next.js 14+ project with App Router and TypeScript at repository root
- [ ] **T002** Install and configure dependencies: Tailwind CSS 4.0+, uuid, @types/uuid, Vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- [ ] **T003** [P] Configure Tailwind CSS 4.0 with CSS First Configurations in `app/globals.css`
- [ ] **T004** [P] Configure Vitest testing environment with `vitest.config.ts` and `test-setup.ts`
- [ ] **T005** [P] Set up basic Next.js App Router structure: `app/layout.tsx`, `app/page.tsx`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Parallel Execution)
- [ ] **T006** [P] Contract test for TaskService interface in `tests/contract/task-service.test.ts`
- [ ] **T007** [P] Contract test for StorageService interface in `tests/contract/storage-service.test.ts` 
- [ ] **T008** [P] Contract test for UI hooks interfaces in `tests/contract/ui-hooks.test.ts`
```

すべてのタスクの内容は以下のリンクから確認できます。

https://github.com/azukiazusa1/todo-app-by-spec-kit/specs/001-todo-taskflow-1/tasks.md

## 4. タスクの実行

タスクの一覧が作成されたら、あとはタスクを順番に実行していくだけです。各タスクには一意な識別子が付与されているため、特定のタスクを指定して実行することもできます。

```sh

> タスクを実行してください

⏺ タスクの実行を開始します。まず最初の設定フェーズ（T001-T0
  05）から始めます。

⏺ Update Todos
  ⎿  ☐ T001: Create Next.js 14+ project with App Router and
       TypeScript
     ☐ T002: Install and configure dependencies
     ☐ T003: Configure Tailwind CSS 4.0 with CSS First
       Configurations
     ☐ T004: Configure Vitest testing environment
     ☐ T005: Set up basic Next.js App Router structure
```

## まとめ

- 仕様駆動開発は AI との対話を通じて仕様書を作成し、その仕様に基づいてコードを生成する新しい開発スタイル
- 仕様駆動開発により AI に正確に要件を伝えることができ、期待に沿ったコードが生成される可能性が高まる、また仕様書を唯一の真実として運用できるという利点がある
- GitHub が提供するSpec Kit は仕様駆動開発を支援するためのツールキットであり、仕様書の作成、実装計画の策定、タスクの生成といったワークフローを提供する
- `uvx --from git+https://github.com/username/repo.git specify init <PROJECT_NAME>` コマンドで Spec Kit プロジェクトを初期化できる
- `/specify` コマンドで仕様書を作成し、Claude Code と対話しながら反復的に改善する
- `/plan` コマンドで実装計画を作成し、技術スタックやアーキテクチャを指定する
- `/tasks` コマンドで実行可能なタスクの一覧を作成し、タスクを順番に実行していく

## 参考

- [github/spec-kit: 💫 Toolkit to help you get started with Spec-Driven Development](https://github.com/github/spec-kit?tab=readme-ov-file)
- [Specification-Driven Development (SDD)](https://github.com/github/spec-kit/blob/main/spec-driven.md)
- [Spec-driven development with AI: Get started with a new open source toolkit - The GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)