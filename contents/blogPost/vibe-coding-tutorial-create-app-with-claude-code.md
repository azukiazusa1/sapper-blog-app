---
id: rw1D9fBJr09PYRLRuhToU
title: "バイブコーディングチュートリアル：Claude Code でカンバンアプリケーションを作成しよう"
slug: "vibe-coding-tutorial-create-app-with-claude-code"
about: "バイブコーディングとは、AI エージェントを活用して直感的にアプリケーションを開発する新しいコーディングスタイルです。このチュートリアルでは、Claude Code を使って Next.js でカンバンボードアプリケーションを作成します。"
createdAt: "2025-06-12T19:55+09:00"
updatedAt: "2025-06-12T19:55+09:00"
tags: ["vibe-coding", "claude-code", "nextjs", "Prisma"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7x7hKIilc9di84JbmfGIRn/97f1ae7221672c861628836ff78e97e2/night_hotaru_11497.png"
  title: "星空とホタルのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "バイブコーディング（Vibe Coding）の特徴として最も適切なものはどれですか？"
      answers:
        - text: "プログラマーが詳細なコードを書いてAIが確認する"
          correct: false
          explanation: "バイブコーディングでは、プログラマーはほとんどコードを書きません。"
        - text: "AIエージェントが主体となってアプリケーション開発を進める"
          correct: true
          explanation: "バイブコーディングでは、プログラマーは直感的なアイディアを自然言語で伝え、AIエージェントが主体となって開発を進めます。"
        - text: "従来のプログラミングと同じように毎回同じ結果が得られるように AI を調整する"
          correct: false
          explanation: "バイブコーディングではAIの出力にランダム要素があり、同じプロンプトでも毎回異なる結果が得られる可能性があります。"
        - text: "コードの品質よりもスピードを重視する"
          correct: false
          explanation: null
    - question: "Claude CodeのPlan モードにを有効にするための操作はどれですか？"
      answers:
        - text: "claude --plan コマンドで起動する"
          correct: false
          explanation: "`--plan` オプションは存在しません。"
        - text: "Shift + Tabキーを2回押す"
          correct: true
          explanation: null
        - text: "プロンプトに「よく考えて」というキーワードを含める"
          correct: false
          explanation: "「よく考えて」は拡張思考モードをトリガーするキーワードであり、Plan モードではありません。"
        - text: "`/plan` コマンドを実行する"
          correct: false
          explanation: "`/plan` コマンドは存在しません。"
published: true
---
気がつけばコーディングの分野で AI エージェントを活用することが一般的になりつつあります。特に「バイブコーディング（Vibe Coding）」と呼ばれる新しいタイプのコーディングスタイルは一種のバズワードになっています。Vibe とは元々音楽シーンで使われていた言葉で「雰囲気・フィーリング・ノリ」といった意味を持ちます。プログラマーは技術的な詳細にとらわれるのではなく、自らの直感的なアイディアを AI エージェントに自然言語で伝えることで、AI エージェントが主体になってアプリケーションの開発を進めていきます。このスタイルではプログラマーはほとんどコードを書くことはありません。

このチュートリアルでは、Claude Code を使ってバイブコーディングの基本的な流れを体験してみましょう。Claude Code は Anthropic が開発したエージェント型コーディングツールです。ターミナル上で動作するものの、VS Code のような IDE と統合して使うこともできるため使いやすいインターフェースで操作できます。月 $20 の Pro プランに加入することで月額固定で利用可能なことも人気を集めている理由の 1 つです。

従来のプログラミングチュートリアルは提示されるコードをそのままなぞって実行することで学習を進められ、基本的には想定される成果物と同じものが完成します。しかし、バイブコーディングでは AI エージェントが主体となってアプリケーションを開発するため、最終的な成果物は必ずしも想定通りになるとは限りません。AI の出力にはランダム要素があり、全く同じプロンプトを与えても毎回同じ結果が得られるわけではないからです。もしかしたらこの記事では触れられていないような未知のエラーが発生してしまうかもしれません。この不確実性もまた、バイブコーディングの魅力と言えるのではないでしょうか？

それではバイブコーディングの冒険に出かけましょう！この記事では Next.js でカンバンボードアプリケーションを作成します。このアプリケーションは以下の機能を持ちます。

- ボード管理
  - ボードの作成
  - ボード一覧を表示
- カラム管理
  - ボードごとにカラムを作成
  - デフォルトでは「To Do」「In Progress」「Done」の 3 つのカラムが用意される
  - カラムにはタイトルと色を設定可能
  - カラムの順序はドラッグ＆ドロップで変更可能
- タスク管理
  - ボードごとにタスクを作成
  - タスクにはタイトル、説明、期限、優先度を設定可能
- タスクのステータス管理
  - タスクはカラム間でドラッグ＆ドロップで移動可能
  - 同一カラム内でのタスクの順序もドラッグ＆ドロップで変更可能

完成したコードは以下のレポジトリで確認できます。

https://github.com/azukiazusa1/vibe-kanban-app

まずは、Claude Code のセットアップから始めましょう。

## Claude Code のセットアップ

### Anthropic アカウントの作成

Claude Code を使うためには、まず Anthropic のウェブサイトでアカウントを作成する必要があります。https://claude.ai/ にアクセスしてアカウントを作成してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/jQo1jsAhjiZCOHJW80RwY/0a6c90209b1d8f22ad5c87da24e63167/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-12_20.19.05.png)

その後の手順は従量課金制の API キーを使用するか、Pro プラン（月額 $20）もしくは Max プラン（月額 $100 or $200）に加入するかを選択できます。

API キーを使用する場合、料金は先払いする必要があります。逆に先払いした以上の料金が発生することはないので、破産する心配はありません。[Anthropic のコンソール画面](https://console.anthropic.com/dashboard) にアクセスし、「Settings」→「Billing」→「Buy Credits」からクレジットカード情報を入力してクレジットを購入してください。最小の購入金額は $5 です。

!> このチュートリアルを完了させるためには $5 のクレジットで十分です。

![](https://images.ctfassets.net/in6v9lxmm5c8/GsPeAgeUTUQpcTTU2WOjK/acc9cf6802771edaabef3f539e935b17/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-12_20.27.11.png)

API キーはデフォルトで Claude Code 用のものが用意されているので、特に設定を変更する必要はありません。

Pro プランや Max プランに加入する場合は https://claude.ai/upgrade にアクセスし、プランを選択して支払いを行ってください。

![](https://images.ctfassets.net/in6v9lxmm5c8/7cJ0xAYPKIAgbrU0ajmjNq/947b2eb9d241ec69dd03d0c47f58f4cd/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-12_20.33.31.png)

### Claude Code のインストール

Claude Code をインストールするためには Node.js のパッケージマネージャーである npm が必要です。もしまだインストールしていない場合は、[Node.js の公式サイト](https://nodejs.org/)から最新版（LTS）をダウンロードしてインストールしてください。

Node.js のインストールが完了したら、ターミナルを開いて以下のコマンドを実行して Claude Code をインストールします。

```bash
npm install -g @anthropic-ai/claude-code
```

!> オプショナルとして [gh](https://cli.github.com/) コマンドや [rg](https://github.com/BurntSushi/ripgrep?tab=readme-ov-file#installation) コマンドをインストールしておくと Claude Code がより便利に使えるようになります。

インストールが完了したら、以下のコマンドで Claude Code を起動できます。

```bash
claude
```

初回の起動時や `claude "/login"` コマンドを実行した場合には、Anthropic の認証が求められます。ログイン方法として Pro プランや Max プランを使用した方法、もしくは API キーを使用した方法が選べます。

![](https://images.ctfassets.net/in6v9lxmm5c8/56cQ54kIsfczNOVm0bTUsd/80e44d1e45f8e2650370062b009f6baf/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-12_20.46.09.png)

ターミナル上でログイン方法を選択すると、ブラウザが開いて認証が求められます。「Authorize」ボタンをクリックして認証を完了させてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/5tlSqqiiErrCmr4Svjt5yq/78652fe6a26f23eff9cccf2b7d7d11bf/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-12_20.47.21.png)

ログインが成功すると、ターミナルに「Login successful!」と表示されます。これで Claude Code のセットアップは完了です。対話型のインターフェイスが表示されています。試しに「こんにちは、Claude Code！」と入力してみましょう。実際に実行してみると、「こんにちは！Claude Code です。お手伝いできることはありますか？」という返答がありました。

## Next.js プロジェクトを作成する

まずは Next.js のプロジェクトを作成します。バイブコーディングなので早速 Claude Code にプロジェクトを作成する指示を...と言いたいところなのですが、体感としてコーディングエージェントはプロジェクトの初期設定を自動で行うのが苦手な印象があります。そこで、まずは手動で Next.js のプロジェクトを作成してしまいましょう。

以下のコマンドを実行して Next.js のプロジェクトを作成します。

```bash
npx create-next-app@latest kanban-app
```

対話形式でプロジェクトの設定が求められます。以下のように入力してください。

```bash
Would you like to use TypeScript? ... Yes
Would you like to use ESLint? ... Yes
Would you like to use Tailwind CSS? ... Yes
Would you like your code inside a `src/` directory? ... No
Would you like to use App Router? (recommended) ... Yes
Would you like to use Turbopack for `next dev`? ... No
Would you like to customize the import alias (`@/*` by default)? ... No
```

データベースの管理には [Prisma](https://www.prisma.io/) を使用します。Prisma は TypeScript で書かれた ORM で、データベースのスキーマ定義やクエリの作成を簡単に行うことができます。まずは Prisma をプロジェクトに追加します。

```bash
npm install prisma --save-dev
npm install @prisma/client
```

次に、Prisma の初期設定を行います。以下のコマンドを実行して Prisma の設定ファイルを生成します。

```bash
npx prisma init
```
これにより、プロジェクトのルートディレクトリに `prisma` フォルダが作成され、その中に `schema.prisma` ファイルが生成されます。このファイルでデータベースのスキーマを定義します。データベースのスキーマは以下のように定義してください。

```prisma:prisma/schema.prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Board {
  id          String   @id @default(cuid())
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  columns Column[]

  @@map("boards")
}

model Column {
  id       String @id @default(cuid())
  title    String
  position Int
  color    String @default("#94a3b8") // デフォルトは slate-400

  boardId String
  board   Board  @relation(fields: [boardId], references: [id], onDelete: Cascade)

  tasks Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([boardId, position])
  @@index([boardId])
  @@map("columns")
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  position    Int
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  isCompleted Boolean   @default(false)

  columnId String
  column   Column @relation(fields: [columnId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([columnId, position])
  @@index([columnId])
  @@map("tasks")
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```
このスキーマでは、ボード（`Board`）、カラム（`Column`）、タスク（`Task`）の 3 つのモデルを定義しています。ボードは複数のカラムを持ち、カラムは複数のタスクを持つという関係になっています。
次に、データベースの接続情報を設定します。`.env` ファイルを開いて、以下のように `DATABASE_URL` を設定してください。

```plaintext
DATABASE_URL="postgresql://user:password@localhost:5432/kanban-app"
```

ここで、`user` と `password` は実際の PostgreSQL のユーザー名とパスワードに置き換えてください。データベース名は `kanban-app` としていますが、必要に応じて変更してください。

Docker を使用して PostgreSQL をセットアップします。`docker-compose.yml` ファイルをプロジェクトのルートディレクトリに作成し、以下の内容を記述します。

```yaml:docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:latest
    container_name: kanban-app-db
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: kanban-app
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

`docker-compose up -d` コマンドでコンテナを起動します。

```bash
docker compose up -d
```

次に、データベースをマイグレーションしてスキーマを反映させます。以下のコマンドを実行してください。

```bash
npx prisma migrate dev --name init
```

これにより、データベースにテーブルが作成されます。マイグレーションが成功すると、`prisma/migrations` フォルダにマイグレーションファイルが生成されます。

Prisma クライアントを生成します。以下のコマンドを実行してください。

```bash
npx prisma generate
```
これで Prisma クライアントが生成され、データベースにアクセスできるようになります。

最後に UI ライブラリとして [shadcn/ui](https://ui.shadcn.com/) を、ドラッグ＆ドロップ機能には [@dnd-kit/sortable](https://docs.dndkit.com/presets/sortable) をインストールしましょう。

```bash
npx shadcn@latest init
npm install @dnd-kit/sortable
```

これで Next.js のプロジェクトがセットアップできました。バイブコーディングといいつつ意外と手動での設定が多かったですが、ここからはほとんど手を動かさずにアプリケーションを作成していけるはずです。Claude Code にアプリケーションの作成を依頼してみましょう。

## CLAUDE.md ファイルの作成

Claude Code を含めコーディングエージェントは基本的に記憶を持ちません。そのため 1 つのセッションが終了するたびに、毎回プロジェクトのアーキテクチャやデータベースのスキーマ・コーディング規約などを説明することになってしまいます。

このような問題を解決するために Claude Code では `CLAUDE.md` というファイルをメモリとして使用します。Claude Code を起動する際に CLAUDE.md ファイルが自動で読み込まれ、以降のセッションでもそのコンテキストが保持されます。Claude Code はカレントディレクトリに存在する `CLAUDE.md` ファイルをまず探索し、見つからない場合は `/` ディレクトリまで再帰的に探索します。

また `/init` コマンドをプロジェクトのルートディレクトリに実行することで、Claude Code がプロジェクトの構造や依存関係を自動で検出し、`CLAUDE.md` ファイルを生成します。このファイルにはプロジェクトの概要や依存関係、使用するライブラリなどが記述されます。

実際に `CLAUDE.md` ファイルを作成してみましょう。`claude "/init"` コマンドを実行すると、Claude Code がプロジェクト構造の検出を開始します。

```bash
claude "/init"
```

![](https://images.ctfassets.net/in6v9lxmm5c8/ms1JHjTFlDknDjJOKM0fH/d8a2fc77b7e6d686bac60525f0b28a4f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-13_22.16.05.png)

ファイルが生成されると、差分が表示されこの内容で問題がないか確認が求められます。差分はターミナル上で diff として表示されますが、VS Code に統合しているターミナルであれば、VS Code の差分表示機能を使って確認することもできます。

差分を確認して問題がなければ「1. Yes」を入力して Enter キーを押します。「2. Yes, and don't ask again this session (shift+tab)」を入力すると、これ以降のセッションではファイルの作成・編集時に確認が求められなくなります。「3. No, and tell Claude what to do differently (esc)」を Claude Code は変更を破棄し、再度ユーザーの指示を待ちます。

ファイルの内容を確認して問題がなければ「1. Yes」を入力して Enter キーを押しましょう。実際に実行すると、以下のような内容の `CLAUDE.md` ファイルが生成されました。

~~~markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture

This is a modern Kanban board application built with Next.js 15 using the App Router architecture. The stack consists of:

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM 
- **UI Components**: shadcn/ui with "new-york" style variant
- **Drag & Drop**: @dnd-kit/sortable for kanban functionality
- **Icons**: Lucide React

### Database Schema
The Prisma schema defines a hierarchical structure:
- `Board` (root entity with title/description)
- `Column` (belongs to Board, has position and color)
- `Task` (belongs to Column, has priority, due date, completion status)

Tasks have a Priority enum (LOW, MEDIUM, HIGH, URGENT) and support positioning within columns.

### Project Structure
- `app/` - Next.js App Router pages and layouts
- `lib/` - Shared utilities (currently contains Tailwind class merger)
- `prisma/` - Database schema and migrations
- `components.json` - shadcn/ui configuration with path aliases

## Development Commands

````bash
# Start development server
npm run dev

# Build for production  
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Database operations
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema changes to database
npx prisma migrate dev  # Create and apply migrations
npx prisma studio       # Open database browser

# Start PostgreSQL via Docker
docker-compose up -d

# Reset database
docker-compose down -v && docker-compose up -d
```

## Key Configuration

- **Database**: Expects `DATABASE_URL` environment variable pointing to PostgreSQL
- **Paths**: Uses `@/*` alias mapping to project root
- **Tailwind**: Configured for CSS variables with neutral base color
- **TypeScript**: Strict mode enabled with Next.js plugin
~~~

このファイルはプロジェクトの概要やアーキテクチャ、データベースのスキーマ、開発コマンドなどを記述しています。必要に応じて追加の指示を書き加えることもできます。例えば、「常に日本語で応答する」といった Claude Code のシステムプロンプトとして機能するような内容や、「`any` 型の使用を禁止する」といったコーディング規約を記述すると有効に活用できます。

`CLAUDE.md` は「生きたドキュメント」として、プロジェクトの進行に合わせて更新していくことが重要です。Claude Code を使っていく中で毎回同じ失敗を繰り返すようなことがあれば、`CLAUDE.md` にその内容を追記しておくことで、次回以降のセッションで同じ問題に悩まされることを防げます。またこのようなドキュメントはコーディングエージェント自身のみならず、新たにプロジェクトに参加する開発者にとっても有用な情報源となるでしょう。

また指示したい内容がプロジェクト固有のものではなく、個人的なスタイル（例えば「常に関西弁で応答する」など）であれば、`~/.claude/CLAUDE.md` ファイルに記述することもできます。このファイルはすべてのプロジェクトで共通の設定として読み込まれます。

## カンバンボードの作成

まずはボードの作成から始めましょう。いきなりコードの実装を任せるのではなく、Plan モードを使って実装の計画を立てることから始めます。Plan モードではファイルの編集を行わず、タスクをどのような方針で進めるかの計画を提案してくれます。Plan モードはある程度複雑なタスクを実装する際に特に有効です。今回のように参考となるコードベースが存在しない場合や、実装の方針が明確でない場合に特に役立ちます。

Plan モードを有効にするには `claude` コマンドを実行した後に `Shift + Tab` キーを 2 回押します。Plan モードが有効になっていれば、「⏸ plan mode on (shift+tab to cycle)」と表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7tUdkY1a4olubAcCGJVato/c45d60e654a7515347c5dfab6fa8baf7/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_9.37.07.png)

以下のプロンプトを入力して、カンバンボードアプリケーションの実装計画を立ててもらいましょう。プロンプトを作成するコツは、具体的な要件や機能を明確に伝えることです。AI とチャットしてプロンプトを考えてもらうのも効果的です。またタスクが大きくなりすぎないように、機能ごとに分割して依頼することも重要です。1 つのセッションにおける作業が大きくなりすぎると、コンテキストウィンドウが溢れてしまい、AI が過去の情報を忘れてしまう可能性があります。

```plaintext
ボードを作成するためのフォームを以下の要件に基づいて実装してください。

- トップページの "新規ボード作成" ボタンをクリックすると、ボード作成フォームがダイアログで表示される
- タイトル（必須）と説明（任意）の入力フィールド
- Server Actionを使用してボードを作成
- ボードを作成したらデフォルトで「To Do」「In Progress」「Done」の3つのカラムを作成
- 作成後は新しいボードページ（/boards/[boardId]）にリダイレクト
```

Claude Code にプロンプトを入力すると、以下のような実装計画が提案されました。

<details>
<summary>Claude Code の提案内容</summary>

```plaintext
 Ready to code?                                                                                         │
│                                                                                                        │
│ Here is Claude's plan:                                                                                 │
│ ╭────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ Board Creation Form Implementation Plan                                                            │ │
│ │                                                                                                    │ │
│ │ I'll implement a board creation form following the requirements:                                   │ │
│ │                                                                                                    │ │
│ │ 1. Update Home Page (app/page.tsx)                                                                 │ │
│ │                                                                                                    │ │
│ │ - Replace the default Next.js starter content with a Kanban app homepage                           │ │
│ │ - Add a "新規ボード作成" (New Board Creation) button that opens the form dialog                    │ │
│ │                                                                                                    │ │
│ │ 2. Install Required shadcn/ui Components                                                           │ │
│ │                                                                                                    │ │
│ │ - Install Dialog, Button, Input, Label, Textarea components from shadcn/ui                         │ │
│ │ - These will be used for the board creation form UI                                                │ │
│ │                                                                                                    │ │
│ │ 3. Create Board Creation Form Component                                                            │ │
│ │                                                                                                    │ │
│ │ - Create a dialog-based form with:                                                                 │ │
│ │   - Title field (required)                                                                         │ │
│ │   - Description field (optional)                                                                   │ │
│ │   - Form validation                                                                                │ │
│ │   - Server Action integration for board creation                                                   │ │
│ │                                                                                                    │ │
│ │ 4. Create Server Action (app/actions/board.ts)                                                     │ │
│ │                                                                                                    │ │
│ │ - Implement createBoard server action using Prisma                                                 │ │
│ │ - Create board with title and description                                                          │ │
│ │ - Auto-create 3 default columns: "To Do", "In Progress", "Done"                                    │ │
│ │ - Return the created board ID for redirection                                                      │ │
│ │                                                                                                    │ │
│ │ 5. Create Board Page Route (app/boards/[boardId]/page.tsx)                                         │ │
│ │                                                                                                    │ │
│ │ - Create dynamic route for individual board pages                                                  │ │
│ │ - Basic board display (will be enhanced later for full Kanban functionality)                       │ │
│ │                                                                                                    │ │
│ │ 6. Create Prisma Client Instance                                                                   │ │
│ │                                                                                                    │ │
│ │ - Set up Prisma client in lib/prisma.ts for database operations                                    │ │
│ │                                                                                                    │ │
│ │ This implementation will provide a complete board creation flow from homepage → form dialog →      │ │
│ │ server action → board page redirection, with all 3 default columns created automatically.          │ │
│ ╰────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│                                                                                                        │
│ Would you like to proceed?                                                                             │
│                                                                                                        │
│ ❯ 1. Yes                                                                                               │
│   2. No, keep planning                                                                                 │
│                                                                                                        │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────
```
</details>

この提案内容を確認して問題がなければ「1. Yes」を入力して Enter キーを押します。もし提案内容に不満がある場合は「2. No, keep planning」を入力して、再度プロンプトを修正して引き続き Plan モードで実装計画を立てることができます。

この提案内容で問題なさそうですので、「1. Yes」を入力して Enter キーを押しましょう。すると、Claude Code が実装を開始します。Claude Code は TODO リストを作成し実装に必要なタスクを細かく分割して表示してくれるのが特徴です。これにより間違った方向に進んでしまう時に人間が介入しやすくなります。

![](https://images.ctfassets.net/in6v9lxmm5c8/EaCFpe6a1UN54wgfjlViR/df4a668ce6594cd6121a8b8d363c6d20/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_9.57.11.png)

時折コマンドの実行の許可を求められるので、危険なコマンドでないことを確認した上で許可を与えてあげましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/7f2AiwdMilc3dlVelxrJyd/8ca404de20fe0ef719c575de2b28800b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_10.01.17.png)

?> コーディングエージェントにタスクを実行させている最中の多くの時間は待ちの時間ですが、許可を待っている最終は実行が中断してしまうためターミナルの様子を定期的に確認することが必要です。しかし、このような適宜ターミナルの確認を行うポーリングのようなスタイルは待ちの時間にう並行して他の作業を行うことができないため、あまり効率的ではありません。ターミナルの通知を活用すると人間の介入を最小限に抑えることができます。デフォルトの設定では iterm2 上で Claude Code を実行していると通知を受け取ることができます。`preferredNotifChannel` の設定を `terminal_bell` に変更することで、ターミナルのベル音で通知を受け取ることもできます。

!> `npm test` や `npm run lint` など安全であることがあらかじめわかっているコマンドでいちいち許可を求められるのは面倒です。`~/.claude/settings.json` ファイルを作成し、`permissions.allows` の配列で許可するコマンドを指定することで、これらのコマンドに対しては許可を求めることなく実行できるようになります。以下のように設定ファイルを作成してください。

```json:~/.claude/settings.json
{
  "permissions": {
    "allow": [
      "Bash(npm run lint)",
      "Bash(npm run test)",
      "Bash(git:*)" // git コマンドはすべて許可
    ],
    "deny": [
      "Bash(rm -rf *)" // rm -rf コマンドは許可しない
    ]
  }
}
```

しばらく待つと、Claude Code が実装を完了し、完了したタスクを報告してくれます。

```plaintext
⏺ Perfect! I've successfully implemented the board creation form with all the required features:

  ✅ 完了した機能:
  - トップページの更新: "新規ボード作成"ボタンを配置
  - ダイアログフォーム: タイトル（必須）と説明（任意）の入力フィールド
  - Server Action: createBoardでボード作成処理
  - デフォルトカラム: "To Do"、"In Progress"、"Done"の3つのカラムを自動作成
  - リダイレクト: 作成後に/boards/[boardId]ページへ遷移
  - ボードページ: 作成されたボードとカラムを表示

  実装内容:
  1. shadcn/uiコンポーネント: Dialog、Button、Input、Label、Textareaをインストール
  2. Prismaクライアント: データベース接続用のクライアント設定
  3. Server Action: フォームデータを受け取ってボードと3つのデフォルトカラムを作成
  4. ダイアログコンポーネント: フォーム入力とバリデーション機能
  5. ホームページ: Kanbanアプリ用のレイアウトに更新
  6. ボードページ: 動的ルートでボード詳細を表示

  これでトップページから"新規ボード作成"ボタンをクリックすると、ダイアログが開いてボードを作成し、作
  成後は新しいボードページにリダイレクトされる完全な流れが実装できました。
```

参考までに、実装されたコードは以下のようになっています。AI の回答は全く同じプロンプトを与えても毎回同じ結果が得られるわけではないため、異なるコードが生成されることもあるでしょう。

https://github.com/azukiazusa1/vibe-kanban-app/commit/8ba8f5c892e92e52c7ef5280ddbc25e3e7397172

`npm run dev` コマンドで開発サーバーを起動し、ブラウザで `http://localhost:3000` にアクセスして動作を確認してみましょう。
ボードの作成ボタンをクリックすると、ダイアログが表示され、タイトルと説明を入力してボードを作成できます。ボードを作成すると、デフォルトで「To Do」「In Progress」「Done」の 3 つのカラムが作成され、新しいボードページにリダイレクトされます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4oXszzGu3Do7M1FKeiRYEz/b8a115188ebae73f1c4110231e9baada/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-06-14_10.48.01.mov" controls></video>

この過程で問題が発生したり、改善したい点があれば、Claude Code にフィードバックを与えて修正を依頼できます。ここでは「フォームの送信中は button を disabled にして送信中と表示してください」というフィードバックを与えてみました。すると、`useFormStatus` フックを使ってフォームの送信状態を管理し、ボタンを適切に制御するコードを提案してくれました。

!> 人間の介入を最小限に押されたい場合には、Claude Code にテストコードを書かせて実行させることが有効です。lint やテストをセッションの中で実行させるように `CLAUDE.md` に記述しておくと、素早いイテレーションでコードの不具合を発見し修正できます。

トップページに作成したボードの一覧を表示する機能を追加してこのセッションを完了させましょう。以下のプロンプトを入力して、ボード一覧の表示を依頼します。

```plaintext
トップページに作成したボードの一覧を表示する機能を追加してください。
- ボードが存在しない場合は「ボードがありません」と表示
- ボードが存在する場合は、ボードのタイトルと説明を表示
- ボードのタイトルをクリックするとボードページに遷移
- ボードの作成日時を表示
```

ボードの一覧を取得するために誤って `Server Action` を使用するコードを提案されたので、この修正は拒否してコンポーネントで直接データを取得するようにフィードバックを与えました。このように誤った方向に進みそうになっている場合には早めにフィードバックを与えることで手戻りが少なくなります。

![](https://images.ctfassets.net/in6v9lxmm5c8/77E05IDoigJgChtL7VquDx/aac7f7a833e97a68c1a70f3f30eb7f92/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_11.01.40.png)

さらに `Module not found: Can't resolve '@/components/ui/card'` というエラーが発生したため、このエラーメッセージをそのままプロンプトに入力して修正を依頼しました。`shadcn/ui` の `Card` コンポーネントをインストールするコマンドを実行し、無事にエラーが解消されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/1SdpqUfuT7Q8KYTE9hKRrH/df5cf785f2c4e67ea8768d0366f970f3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_11.06.41.png)

ここまでの変更を Claude Code に commit してもらいましょう。Claude Code `git log` の情報を参照して適切なコミットメッセージを生成してくれます。以下のプロンプトを入力して、コミットを依頼します。GitHub レポジトリと連携している場合は、コミット後にプルリクエストを作成することもできます。

```plaintext
ここまでの変更をコミットしてください。
```

以下のようなコミットメッセージが生成され、コミットが実行されました。タスクが終わるたびにコミットを行うことを習慣化したい場合には、`CLAUDE.md` で指示を与えるとよいでしょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/854w70Mzr6RKTNRfIQUDj/f5cd692a2f43fe6c1dfab4ec9dcd1799/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_11.12.51.png)

## ボードにタスクを追加する

続いてボードにタスクを追加する機能を実装していきましょう。Claude Code にタスクを依頼する前に `/clear` コマンドを実行して、セッションのコンテキストをリセットすることをおすすめします。先にも述べたように、1 つのセッションにおける作業が大きくなりすぎると、コンテキストウィンドウが溢れてしまい、`CLAUDE.md` で指示したコーディング規約や過去の実装内容を忘れてしまう可能性があります。

セッションをリセットすることで、AI が新たなコンテキストで作業を開始できるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/66oPdjT3Ac2p9Dj5s6iovU/442e8d0ab96230ed7994e8eb8589502b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_11.27.52.png)

ボードにタスクを追加する機能を実装するためのプロンプトを入力します。先ほどと同じく Plan モードを有効にして、実装計画を立ててもらいましょう。

```plaintext
ボード画面(/boards/[boardId])にタスクを追加する機能を実装してください。

- 各カラムの下部に「+ タスクを追加」ボタンを配置
- ボタンをクリックするとタスク追加フォームがダイアログで表示される
- タスク追加フォームには以下のフィールドを含める
  - タイトル（必須）
  - 説明（任意）
  - 優先度（デフォルトは「中」、選択肢は「低」「中」「高」「緊急」）
  - 期限（任意、日付ピッカー）
- フォーム送信時にServer Actionを使用してタスクを作成
- タスクを作成したら、該当カラムの一番下に追加される
```

以下のような実装計画が提案されました。
<details>
<summary>Claude Code の提案内容</summary>

```plaintext
│ Ready to code?                                                                                         │
│                                                                                                        │
│ Here is Claude's plan:                                                                                 │
│ ╭────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ タスク追加機能実装計画                                                                             │ │
│ │                                                                                                    │ │
│ │ 必要な作業                                                                                         │ │
│ │                                                                                                    │ │
│ │ 1. shadcn/ui コンポーネントの追加                                                                  │ │
│ │                                                                                                    │ │
│ │ - select コンポーネント（優先度選択用）                                                            │ │
│ │ - popover と calendar コンポーネント（日付ピッカー用）                                             │ │
│ │                                                                                                    │ │
│ │ 2. Server Action の作成                                                                            │ │
│ │                                                                                                    │ │
│ │ - app/actions/task.ts ファイルを作成                                                               │ │
│ │ - タスク作成用の createTask 関数を実装（columnId, title, description, priority, dueDate            │ │
│ │ を受け取る）                                                                                       │ │
│ │ - タスクの position は該当カラムの最後に追加するよう設定                                           │ │
│ │                                                                                                    │ │
│ │ 3. タスク追加ダイアログコンポーネントの作成                                                        │ │
│ │                                                                                                    │ │
│ │ - components/task-creation-dialog.tsx を作成                                                       │ │
│ │ - 既存の board-creation-dialog.tsx のパターンに倣って実装                                          │ │
│ │ - フォームフィールド：                                                                             │ │
│ │   - タイトル（必須、Input）                                                                        │ │
│ │   - 説明（任意、Textarea）                                                                         │ │
│ │   - 優先度（Select、デフォルト「中」）                                                             │ │
│ │   - 期限（日付ピッカー、任意）                                                                     │ │
│ │                                                                                                    │ │
│ │ 4. ボードページの更新                                                                              │ │
│ │                                                                                                    │ │
│ │ - app/boards/[boardId]/page.tsx を更新                                                             │ │
│ │ - 各カラムの下部に「+ タスクを追加」ボタンを配置                                                   │ │
│ │ - タスク追加ダイアログコンポーネントを組み込み                                                     │ │
│ │                                                                                                    │ │
│ │ 5. 優先度の日本語表示対応                                                                          │ │
│ │                                                                                                    │ │
│ │ - 優先度の表示を英語から日本語に変換するユーティリティ関数を追加                                   │ │
│ │                                                                                                    │ │
│ │ 技術的な考慮事項                                                                                   │ │
│ │                                                                                                    │ │
│ │ - 既存のコードスタイルとパターンに従う                                                             │ │
│ │ - Server Actions を使用してフォーム送信を処理                                                      │ │
│ │ - 楽観的更新は行わず、サーバーサイドでの処理完了後にページを更新                                   │ │
│ │ - Prisma でのタスク作成時に適切な position 値を設定                                                │ │
│ ╰────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│                                                                                                        │
│ Would you like to proceed?                                                                             │
│                                                                                                        │
│ ❯ 1. Yes                                                                                               │
│   2. No, keep planning                                                                                 │
│                                                                                                        │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
</details>

この提案内容で問題なさそうなので、このまま実行してもらいましょう。変更されたコードは以下のようになっています。

https://github.com/azukiazusa1/vibe-kanban-app/commit/9ed1bd520beab88eb0dc197112657fee115ac575

機能が正しく実装されているか確認してみましょう。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/4RWSq6mny1ZLhFl6riNj3z/018477aa9a9c432f59e2b33e20415ad0/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-06-14_11.57.20.mov" controls></video>

Claude Code にコミットを依頼して、ここまでの変更を Git に保存しましょう。以下のプロンプトを入力します。

```plaintext
ここまでの変更をコミットしてください。
```

## タスクのドラッグ & ドロップ機能

次に、タスクのドラッグ & ドロップ機能を実装していきましょう。これにより、ユーザーはタスクを異なるカラム間で簡単に移動できるようになります。これまでの流れのように、`/clear` コマンドでセッションをリセットしてから、Plan モードを有効にして実装計画を立ててもらいます。

以下のプロンプトを入力して、タスクのドラッグ & ドロップ機能を実装するよう依頼します。
```plaintext
タスクをカラム間でドラッグ&ドロップして移動できる機能を実装してください。

要件：
- @dnd-kit/sortableを使用
- タスクをドラッグして別のカラムにドロップ
- 同じカラム内での並び替えも可能
- ドラッグ中は元の位置にプレースホルダー表示
- ドロップ可能なエリアをハイライト
- 移動後は自動的にデータベースを更新
- エラーが発生した場合は元の位置に戻す
```

以下のような実装計画が提案されました。
<details>
<summary>Claude Code の提案内容</summary>

```plaintext
╭────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Ready to code?                                                                                         │
│                                                                                                        │
│ Here is Claude's plan:                                                                                 │
│ ╭────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ Drag & Drop Implementation Plan                                                                    │ │
│ │                                                                                                    │ │
│ │ Phase 1: Dependencies & Setup                                                                      │ │
│ │                                                                                                    │ │
│ │ 1. Install missing dnd-kit packages:                                                               │ │
│ │   - @dnd-kit/core - Core drag & drop functionality                                                 │ │
│ │   - @dnd-kit/utilities - Utility functions                                                         │ │
│ │                                                                                                    │ │
│ │ Phase 2: Server Actions for Position Updates                                                       │ │
│ │                                                                                                    │ │
│ │ 2. Create new server actions in /app/actions/:                                                     │ │
│ │   - updateTaskPosition() - Handle task moves within same column                                    │ │
│ │   - moveTaskBetweenColumns() - Handle task moves between columns                                   │ │
│ │   - updateColumnPosition() - Handle column reordering (optional)                                   │ │
│ │                                                                                                    │ │
│ │ Phase 3: UI Component Transformation                                                               │ │
│ │                                                                                                    │ │
│ │ 3. Convert board page to client component (/app/boards/[boardId]/page.tsx):                        │ │
│ │   - Add "use client" directive                                                                     │ │
│ │   - Implement DndContext from @dnd-kit/core                                                        │ │
│ │   - Add sensors for mouse/touch/keyboard interaction                                               │ │
│ │ 4. Create draggable components:                                                                    │ │
│ │   - DraggableTask component wrapping existing task cards                                           │ │
│ │   - DroppableColumn component wrapping column containers                                           │ │
│ │   - Add visual feedback for drag states                                                            │ │
│ │                                                                                                    │ │
│ │ Phase 4: Integration & Polish                                                                      │ │
│ │                                                                                                    │ │
│ │ 5. Implement drag handlers:                                                                        │ │
│ │   - handleDragEnd() function to process drops                                                      │ │
│ │   - Optimistic updates for immediate visual feedback                                               │ │
│ │   - Error handling and rollback on server failures                                                 │ │
│ │ 6. Enhanced UX:                                                                                    │ │
│ │   - Drag overlays for better visual feedback                                                       │ │
│ │   - Loading states during position updates                                                         │ │
│ │   - Accessibility improvements (keyboard navigation)                                               │ │
│ │                                                                                                    │ │
│ │ Phase 5: Testing & Refinement                                                                      │ │
│ │                                                                                                    │ │
│ │ 7. Thorough testing:                                                                               │ │
│ │   - Test all drag & drop scenarios                                                                 │ │
│ │   - Verify database consistency                                                                    │ │
│ │   - Cross-browser compatibility                                                                    │ │
│ │                                                                                                    │ │
│ │ This plan leverages the existing solid foundation while adding comprehensive drag & drop           │ │
│ │ functionality that maintains data integrity and provides excellent user experience.                │ │
│ ╰────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│                                                                                                        │
│ Would you like to proceed?                                                                             │
│                                                                                                        │
│ ❯ 1. Yes                                                                                               │
│   2. No, keep planning                                                                                 │
│                                                                                                        │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────╯
```
</details>

ここまできたらもう慣れてきましたね。コードの実装を行ってもらいましょう。

私が実装を依頼した場合には `columnId` と `position` のユニーク制約により失敗する現象が発生し、エラーメッセージを提示して修正を依頼しても同じエラーがまた発生してしまうという問題がありました。そのため、以下のプロンプトで修正を依頼しました。

```plaintext
まだユニーク制約違反に関するエラーが発生します。よく考えて修正してください。
```

「よく考えて」は Claude Code の[拡張思考](https://docs.anthropic.com/ja/docs/build-with-claude/prompt-engineering/extended-thinking-tips)をトリガーするキーワードです。拡張思考モードではトークンを多く消費する代わりに、より深い推論を行いコードを修正します。拡張思考は以下のキーワードがプロンプトに含まれている場合に有効になります。上に行けば行くほど推論の深さが増します。

- 最大予算(31,999 トークン)
  - 熟考
  - 深く考えて
  - しっかり考えて
- 中予算(10,000 トークン)
  - もっと考えて
  - たくさん考えて
  - よく考えて
  - 長考
- 小予算(4,000 トークン)
  - 考えて

最終的に以下のようにドラッグ & ドロップ機能が正しく機能していることが確認できました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7i8w8304W4rJxJ4qnNZZpj/19c52f5c3289c7b5bcecf0a3966a0388/%C3%A7__%C3%A9__%C3%A5__%C3%A9___2025-06-14_13.13.01.mov" controls></video>

作成されたコードは以下のようになっています。

https://github.com/azukiazusa1/vibe-kanban-app/commit/ab8c7b631cab5ae9c51b67071c28fe6f05d01c02

## 並行して Claude Code を使う

カンバンアプリケーションで残り必要な機能は期限切れのタスクを強調して表示する機能とカラムの追加・削除機能です。これらの機能はそれぞれ独立しているため、同時に複数の Claude Code を起動して並行して実装を進めることができます。

チーム開発ではこのようにコンフリクトが発生しないように独立した機能ごとに開発者が手分けをして作業を進めることが一般的です。同じように Claude Code でも複数のタスクを同時並行して進めてみましょう。

複数の Claude Code を同時に起動すること自体は簡単で、ターミナルのタブを分割してそれぞれのタブで `claude` コマンドを実行するだけです。しかし、このままだと同じファイルを同時に編集しようとし始めた時に混乱が生じてしまいます。

Claude Code のドキュメントでは、複数の Claude Code を同時に使用する場合は、Git Worktree を使用することを推奨しています。Git Worktree を使用すると、同じリポジトリ内で複数のブランチを別々のディレクトリにチェックアウトできます。各ワークツリーには分離されたファイルを持つ独自の作業ディレクトリがありますが、同じ Git 履歴を共有します。

以下のコマンドを実行して、Git Worktree を作成します。

```bash
git worktree add -b feature/expired-tasks ./worktrees/expired-tasks main
git worktree add -b feature/add-column ./worktrees/add-column main
```

これにより、`worktrees/expired-tasks` と `worktrees/add-column` ディレクトリにそれぞれのブランチが作成されます。各ディレクトリで独立した Claude Code セッションを起動し、それぞれの機能を実装していきます。

```bash
cd worktrees/expired-tasks
claude
```

```bash
# ターミナルで分割して別のタブで実行
cd worktrees/add-column
claude
```

各 Claude Code セッションで以下のようなプロンプトを入力して、期限切れのタスクを強調表示する機能とカラムの追加・削除機能を実装していきます。実装の確度が高ければ、Plan モードを使わずに直接実装を依頼しても問題ありません。

```plaintext
期限切れのタスクを視覚的に強調表示する機能を実装してください。

要件：
- 期限が過ぎたタスクは赤い境界線で囲む
- 期限表示を赤文字にする
- 期限切れアイコン（⚠️）を表示
- 「3日前に期限切れ」のような相対時間表示
- カラムヘッダーに期限切れタスク数を表示
```

```plaintext
カンバンボードに新しいカラムを追加する機能を実装してください。

要件：
- 最右端に「+ 新しいカラムを追加」ボタンを配置
- クリックでインライン入力フィールドとカラーパレットを表示
- カラム名を入力してEnterで追加
- 空の名前では追加不可
- 追加後は自動的に最右端に配置
```

タスクが完了したら、それぞれのワークツリーのディレクトリに移動して `npm run dev` ことでアプリケーションを起動し、実装した機能が正しく動作するか確認します。ワークツリーごとにプロジェクトのセットアップが必要なことに注意してください。ここでは `.env` ファイルのコピーと依存関係のインストールが必要です。

```bash
cp .env worktrees/expired-tasks/.env
cd worktrees/expired-tasks
npm install
npm run dev
```

完了したワークツリーは通常の手順と同じように main ブランチにマージしていきます。Claude Code にプルリクエストを作成するように依頼しても良いでしょう。その場合は `gh` コマンドを使用して Claude Code がプルリクエストを作成します。

```plaintext
変更をコミットしてプルリクエストを作成してください
```

もしもコンフリクトが発生するような場合には、Claude Code にコンフリクトの解消を依頼すると良いでしょう。

```plaintext
main ブランチをマージしてコンフリクトを解消してください
```

## Claude Code のコストを可視化する

Pro もしくは Max プランを利用している場合、月額の利用料金さえ支払えば、Claude Code の利用は rate limit が来るまで無制限に使用できます。従量課金で利用している場合には `/cost` コマンドを実行することで、これまでの利用コストを確認できるのですが、サブスクリプションプランではコマンドを実行してもコストが表示されません。

もし従量課金制で利用したらどのくらいコストがかかっていたのだろう、と誰しもがきになるところです。`ccusage` という CLI ツールを使うことで、これまでの利用コストを確認できます。

https://github.com/ryoppippi/ccusage

使い方は簡単で、以下のコマンドを実行するだけです。

```bash
npx ccusage@latest
```

結果は以下のようにテーブル形式で表示されます。カンバンアプリケーションの開発にかかったコストは $5 程度でした。

![](https://images.ctfassets.net/in6v9lxmm5c8/7H3tmW7BRwEDy7qxs4sahm/a59b0f5819c1271403819a024cb200f3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-06-14_14.06.34.png)

## まとめ

- バイブコーディングは AI エージェントが主体となって開発を進める新しいコーディングスタイル。プログラマーは直感的なアイディアを自然言語で伝える
- Claude Code は Anthropic が開発したエージェント型コーディングツール。CLI ツールとして提供され、自然言語での指示に基づいてコードを生成・修正する。Pro もしくは Max プランに加入すれば、月額料金で利用できる点が特徴
- Next.js + TypeScript + Prisma を使用したカンバンアプリケーションを例に、Claude Code の使い方を学んだ
- CLAUDE.md はプロジェクトの記憶として機能するファイル。アーキテクチャ、データベーススキーマ、開発コマンドを記述することで、Claude Code がプロジェクトのコンテキストを理解しやすくなる
- Plan モードを有効にすることで、Claude Code が実装計画を立ててからコードを生成する。これにより、より高い精度で要件を満たすコードが得られる
- 「よく考えて」「深く考えて」などのキーワードをプロンプトに含めることで、Claude Code の拡張思考モードを有効にできる。これにより、より深い推論を行い、複雑な問題に対処できる
- Claude Code を並行稼働させる場合には Git Worktree を使用することが推奨される。これにより、同じリポジトリ内で複数のブランチを独立して作業できる

## 参考

- [バイブコーディング - Wikipedia](https://ja.wikipedia.org/wiki/%E3%83%90%E3%82%A4%E3%83%96%E3%82%B3%E3%83%BC%E3%83%87%E3%82%A3%E3%83%B3%E3%82%B0)
- [Claude Code 概要 - Anthropic](https://docs.anthropic.com/ja/docs/claude-code/overview)
- [Claude Code完全攻略Wiki(隠しコマンド編 - think,拡張機能,思考予算)](https://zenn.dev/fbbp/articles/7aa9a46518a609)
- [Claude Code の CLAUDE.mdは設定した方がいい - じゃあ、おうちで学べる](https://syu-m-5151.hatenablog.com/entry/2025/06/06/190847)
