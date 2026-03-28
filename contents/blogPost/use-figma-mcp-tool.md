---
id: 7Z9PCPrKKCY4twoRTWt9k
title: "Figma のキャンバスを AI エージェントから操作してデザインしよう"
slug: "use-figma-mcp-tool"
about: "2026 年 3 月末、Figma の MCP サーバーに Figma のキャンバスを直接操作できる `use_figma` ツールが追加されました。`use_figma` ツールは Figma Plugin API を通じて Figma ファイル上で JavaScript を直接実行する汎用ツールとして設計されている点が特徴です。この記事では、実際に `use_figma` ツールを使用して Figma のキャンバスを操作する方法を試してみます。"
createdAt: "2026-03-28T12:45+09:00"
updatedAt: "2026-03-28T12:45+09:00"
tags: ["figma", "MCP", "AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2uEs8vYobgC6UJXJXA5jaa/eb7334dc7c99fdaca0b6e4c99cb491ba/okinawa-rail_22982-768x689.png"
  title: "ヤンバルクイナのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`use_figma` ツールが以前の `generate_figma_design` ツールと比べて優れている点は何ですか？"
      answers:
        - text: "Web アプリ上のデザインを高精度にキャプチャして Figma ファイルへ変換できる"
          correct: false
          explanation: "これは `generate_figma_design` ツールがすでに持っていた機能です。`use_figma` の優位性ではありません。"
        - text: "Figma Plugin API を通じて JavaScript を直接実行できるため、Variant・コンポーネント・Auto Layout などの構造も生成できる"
          correct: true
          explanation: "`use_figma` は Figma Plugin API 経由で JavaScript を直接実行できる汎用ツールです。以前の `generate_figma_design` は見た目の再現はできても Variant や Component などの構造が生成されず、デザインシステムへの組み込みが困難でした。"
        - text: "デザインのスクリーンショットを自動的に撮影して品質チェックできる"
          correct: false
          explanation: "スクリーンショット撮影は `get_screenshot` ツールが担当しており、`use_figma` の特徴ではありません。"
        - text: "Claude Code を使用しなくても Figma 上でコードを実行できる"
          correct: false
          explanation: "この記事では Claude Code をコーディングエージェントとして使用することを前提としています。"
    - question: "`figma-generate-library` スキルが長いワークフローでも途中から再開できるようにしている仕組みはどれですか？"
      answers:
        - text: "Figma ファイルの変数コレクションに進捗情報を埋め込む"
          correct: false
          explanation: "変数コレクションはデザイントークンを格納するものです。進捗管理には使用されません。"
        - text: "Claude Code の会話履歴をエクスポートして保存する"
          correct: false
          explanation: "記事にそのような仕組みは説明されていません。会話コンテキストが失われることへの対策として別の手段が用いられています。"
        - text: "作業を進めるたびに `/tmp/dsb-state-{RUN_ID}.json` ファイルに現在の状態を保存する"
          correct: true
          explanation: "記事では `figma-generate-library` スキルが作業ごとに `/tmp/dsb-state-{RUN_ID}.json` に状態を保存すると説明されています。長いワークフローでも途中で会話コンテキストが失われないようにするための工夫です。"
        - text: "Figma のオートセーブ機能に依存して操作履歴を保持する"
          correct: false
          explanation: "Figma のオートセーブはデザインファイルのUI状態を保存するものであり、スキルの実行進捗とは無関係です。"
published: true
---
2026 年 3 月末、Figma の MCP サーバーに Figma のキャンバスを直接操作できる `use_figma` ツールが追加されました。以前から `generate_figma_design` ツールを使用して Web アプリ上のデザインをキャプチャして Figma のファイルに変換できましたが、見た目の再現はできるものの Variant や Component などの構造は生成されないため、そのままデザインシステムに組み込むのは難しいものでした。

https://azukiazusa.dev/blog/claude-code-to-figma/

`use_figma` ツールは [Figma Plugin API](https://developers.figma.com/docs/plugins/) を通じて Figma ファイル上で JavaScript を直接実行する汎用ツールとして設計されている点が特徴です。そのため単にデザインファイルを作成するだけでなく、デザイントークンの定義・コンポーネントやバリアントの作成・Auto Layout の設定など、Figma 上で可能なあらゆる操作を行えます。`use_figma` ツール自身はプリミティブな操作を提供するツールとなっているため、スキルを通じて具体的なワークフローを実行する使用方法が想定されています。例えば公式の figma プラグインをインストールすると、以下のようなスキルを使用できるようになります。もちろん独自のスキルを作成して、`use_figma` ツールを活用したワークフローを構築することもできます。

- `figma-generate-library` — コードベースから Figma のデザインシステム（変数・トークン・コンポーネントライブラリ）を構築する
- `figma-generate-design` — コードやデザインシステムから Figma 上に UI デザインを生成する

その他 [Figma コミュニティ](https://www.figma.com/community/skills) でも `use_figma` ツールを活用したスキルが公開されており、今後も増えていくことが予想されます。

この記事では、実際に `use_figma` ツールを使用して Figma のキャンバスを操作する方法を試してみます。

:::warning
`use_figma` ツールは現時点ではベータ版であり無料で使用できますが、将来的には使用量に応じた有料機能となる予定です。
:::

## Figma MCP のインストール

コーディングエージェントとして Claude Code を使用することを前提として進めていきます。まずは Figma MCP を Claude Code にインストールします。Figma プラグインをインストールすれば MCP サーバーも自動的にインストールされます。以下のコマンドを実行してください。

```sh
claude plugin install figma@claude-plugins-official
```

プラグインのインストールに成功したら Claude Code を起動します。`/mcp` コマンドを実行して Figma MCP サーバーが追加されていることを確認してください。初めてインストールした場合には「needs Authentication」と表示されているはずですので、`plugin:figma:figma` を選択して認証を完了させてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/4SuphEccs2liU20XEgZSbc/648484b58ac8b8bf138f41223967e6c5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-27_20.02.36.png)

認証が成功すると、「✔ connected」と表示され、MCP サーバーの詳細情報を見ることができるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/58MeTZH53TWZiX0JHgKXOO/7a8bbb8aa825bc76f012a7fc1f9b3a54/image.png)

## `figma-generate-library` スキルを使用してデザインシステムを構築する

それでは、`figma-generate-library` スキルを使用して、Figma 上にデザインシステムを構築してみましょう。あらかじめいくつかのデザイントークンと Storybook 上のコンポーネントを用意しておきます。

```css:src/tokens/tokens.css
:root {
  /* Gray */
  --color-gray-0:   #ffffff;
  --color-gray-50:  #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
  /* そのほかの定義... */
}
```

```tsx:src/components/Button/Button.tsx
import styles from "./Button.module.css";

export interface ButtonProps {
  /**
   * ボタンの見た目のスタイル。
   * - `primary`: メインアクション（フォーム送信、確定）に使用
   * - `secondary`: サブアクション（キャンセル、戻る）に使用
   * - `danger`: 破壊的操作（削除、リセット）に使用
   */
  variant?: "primary" | "secondary" | "danger";
  /**
   * ボタンのサイズ。
   * - `sm`: コンパクトな UI やツールバー向け
   * - `md`: 通常のボタン（デフォルト）
   * - `lg`: 目立たせたい CTA ボタン向け
   */
  size?: "sm" | "md" | "lg";
  /** ボタンを無効化する。クリックイベントが発火しなくなる */
  disabled?: boolean;
  /** ボタンのラベルテキスト */
  children: React.ReactNode;
  /** クリック時のコールバック */
  onClick?: () => void;
}

/**
 * インタラクティブなアクションを起動するための基本ボタンコンポーネント。
 *
 * リンク遷移には `<a>` タグや React Router の `<Link>` を使うこと。
 * このコンポーネントは副作用を伴うアクション専用。
 */
export function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  /** 実装は省略 */
}
```

Claude Code を起動して `/figma-generate-library` コマンドを実行します。このスキルは以下のようなワークフローで実行されます。

1. 分析フェーズ: コードベースを分析してデザイントークンとコンポーネントの仕様を抽出する。Figma 上のファイルを調査して、既存の変数やコンポーネントを把握して、コードとのマッピングを行う
2. トークンの作成: Figma 上に変数を作成する。プリミティブな変数とセマンティックなトークンの両方を作成し、コードベースのトークンと対応させる
3. ページの骨格を作る: デザインシステム用のページを作成し、トークンやコンポーネントを整理するためのセクションを作る
4. コンポーネントの作成: Storybook 上のコンポーネントを Figma 上に再現する。Variant や Auto Layout なども適切に設定する。コンポーネントを作成するために都度スクリーンショットを撮って確認する

### Phase 1: 分析フェーズ

はじめはコードベースの分析から始まります。レポジトリのスタイリング方法や定義されているトークン、コンポーネントとそのバリアントの仕様が正確に抽出されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6HAGjBHal7NpKlKlZt6fMn/d06770bb6a3519c37a60c83dd07ba409/image.png)

Figma ファイルの URL を求められるので、新規ファイルを作成してその URL を入力しました。Figma ファイル上の変数・コンポーネント・スタイルの詳細を検査するために `use_figma` ツールを使用している様子もわかります。`use_figma` ツールの引数には Figma のファイルを特定する `fileKey` と、実行する JavaScript コードを渡します。

```javascript
// Phase 0b: Figmaファイルの完全検査
const pages = figma.root.children.map((p, i) => ({
  index: i,
  name: p.name,
  id: p.id,
  childCount: p.children.length,
}));
const collections = await figma.variables.getLocalVariableCollectionsAsync();

// 変数やコンポーネントの情報を抽出して、コードベースのトークンやコンポーネントとマッピングするための処理が続く...
```

その他 `search_design_system` や `get_metadata` などのツールも使用して、Figma ファイルの情報を取得していきます。分析が完了すると、ユーザーに計画を提示して確認を求めます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5FFiaQpGmCflQQtHNZH7Qc/2d469b218ad09299d8da8c1034b65f3c/image.png)

### Phase 2: トークンの作成

提示された計画で問題なさそうであれば、承認して次の作業に進んでもらいましょう。`use_figma` ツールに `figma.variables.createVariableCollection(...)` のようなコードを渡して Figma 上に変数が作成されていきます。また `figma-generate-library` スキルでは作業を進めるたびに `/tmp/dsb-state-{RUN_ID}.json` というファイルに現在の状態を保存するようになっています。これは長いワークフローでも途中で会話コンテキストが失われないようにするための工夫です。

![](https://images.ctfassets.net/in6v9lxmm5c8/4V84Q3rBqNTgeHMRtJtnnl/c1e13455f03a1dfc4ebd8ea8fac2490f/image.png)

Figma のファイル上で「バリアブル」を確認すると、確かにコードベースのトークンに対応する変数が作成されていることがわかります。同様に「スタイル」のセクションを確認すると、テキストスタイルやエフェクトスタイルも作成されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6WVsCZaH9kYmEI93cRIjam/c9baf32cafdde280790910aa0f77748a/image.png)

### Phase 3: ページの骨格を作る

バリアブルの生成が完了したら、次はページの骨格が作られていきます。「Cover」「Getting Started」「Foundation」「Badge」「Button」といったページが作成されていますね。中身はまだ空ですが、これからコンポーネントが作成されていくことになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/47Toe7pFq4VLs3S2zIHCGZ/80e880fc67d2baddb4c42ba7d2363544/image.png)

Foundation ページが完成したら、`get_screenshot` ツールを使用してスクリーンショットを撮って正しくページが作成できているかを確認します。実際に作成された Foundation ページは以下のように「Color Primitives」と「Spacing Scale」から構成されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/29SjFk1QTUm4Jq0yt8ouyK/8352a91da786cf7441f15cb03580b5b8/image.png)

### Phase 4: コンポーネントの作成

続いて `use_figma` ツールを使用してコンポーネントを作成していきます。Button コンポーネントの場合は `variant(primary/secondary/danger) × size(sm/md/lg) × state(default/disabled)` の組み合わせで 18 種類のバリアントを作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7esjuFDtgk773yOyFkeX9o/a8c8ab539b6d89ce7a278220abf9f58b/image.png)

ただし一度で完璧にデザインを生成できているわけではなさそうで、例えばアラートコンポーネントはフレームのサイズが小さくてコンテンツが見切れて表示されてしまったりしています。問題がある場合は適宜フィードバックを送って修正してもらう必要がありそうです。

![](https://images.ctfassets.net/in6v9lxmm5c8/4NEz5bsYeJYew8VFWUT98H/f920e845732cf94135cab779de46d361/image.png)

全体的な感想としては、トークンやコンポーネントのバリアントの抽出といった地味に大変な作業を自動化してくれるのは非常にありがたいと感じました。一方で、完全にお任せでやってもらうと細かい部分で意図しないデザインになってしまうこともあるため、適宜自身でデザインを修正する能力は必要そうだなと感じました。

## `figma-generate-design` スキルを使用してデザインを生成する

続いて `figma-generate-design` スキルを使用して、先ほど作成したデザインシステムを使用して Figma 上に UI デザインを生成してみましょう。今回はユーザーの設定画面を作成してもらいましょう。できる限り仕様を詳細に伝えたプロンプトを渡すようにしてみます。

```txt
/figma-generate-design

ユーザープロフィールの設定画面を作成してください。対象の Figma のファイルは https://www.figma.com/file/xxxxxx/ です。以下の要件を満たすようにしてください。
- 画面上部にユーザーのアバターと名前を表示するセクションを配置すること
- フォームには「名前」と「メールアドレス」の入力フィールドを配置すること。入力フィールドは両方ともテキスト入力で、プレースホルダーにはそれぞれ「名前を入力」「メールアドレスを入力」と表示すること
- トグルスイッチを配置して、ユーザーが通知の受け取りをオン/オフできるようにすること。トグルスイッチのラベルは「通知を受け取る」とすること
- フォームの下部に「保存」ボタンを配置する。「保存」ボタンはプライマリスタイルで、フォームの内容が変更されたときにのみ有効になるようにすること
```

`figma-generate-design` スキルのワークフローは以下のようになっています。

1. 画面の理解: コードから構築する場合は関連するソースコードを読み、ページの構造・セクション・使用コンポーネントを把握する。Figma 上のデザインシステムを調査して、Header, Hero, Footer などの主要セクションと UI コンポーネントをリストアップする
2. デザインシステムの探索: Figma ファイルからコンポーネント・変数・スタイルを検索して、使用できるデザインリソースを把握する
3. ページラッパーフレームを作成する
4. ラッパー内にセクションを作成する: 最も重要なステップで、セクションごとに `use_figma` ツールを使用して、Figma 上にセクションを作成していく。デザインシステムのコンポーネント・変数・スタイルをインポートして使用して、ハードコードされた値を避ける。1 セクションが完成するたびにスクリーンショットを撮って確認する
5. ページ全体のスクリーンショットを撮って最終的な確認をする

まずは Figma ファイルの情報を取得して、使用できるコンポーネントやトークンを把握していきます。`get_metadata` ツールや `search_design_system` ツールを使用して、利用可能なコンポーネントやトークンのリストを取得します。プロンプトに渡した要件を満たすために、`button`, `input`, `avatar`, `toggle` といったクエリで検索して、使用できるコンポーネントを探します。

![](https://images.ctfassets.net/in6v9lxmm5c8/359F8ih2d74ZR5G1AokLzj/57163687410549a776c87955bbd3e52e/image.png)

さらにコンポーネントの構造を把握し、カラーと変数を確認してデザインシステムを理解しました。引き続き `use_figma` ツールを使用して、Figma 上にセクションを作成していきます。生成された成果物は以下のように、デザインシステム上のコンポーネントを使用して要件を満たすユーザープロフィール設定画面が完成しました。しかし、セクション間の余白のために Auto Layout を使用せずに spacer というフレームを配置して調整している点が少々気になりますね。ここはフィードバックを送って修正してもらうことにしましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/4M8LvlvUz6kV3y1cJMicPW/f4ebe8891f39a6f3a9e9cb40f14fa67a/image.png)

Auto Layout を使用するようにフィードバックを送った後、セクション間の余白が spacer フレームから Auto Layout による調整に変更されました。これでセクションの構造がより適切になりましたね。モデルの性能によっても異なりますが、やはり完全にお任せでやってもらえるわけではなく、細かい部分で意図しないデザインになってしまうこともあるため、適宜フィードバックを送って修正してもらう必要がありそうです。

![](https://images.ctfassets.net/in6v9lxmm5c8/gJnpcmRqkkm8oBQ5aQlj4/79f41e4e6fa617f7bb2b88e66199ac12/image.png)

作成したデザインはそのまま以下のようなプロンプトでコードベースに反映もできます。

```txt
https://www.figma.com/design/xxxx/design-system?node-id=79-2&t=SsXyQlm5GVPvtQYa-0 の Profile Settings 画面を実装してください。
```

ここでは `get_design_context` で Figma 上のデザインの情報を取得したうえで、Storybook MCP を使用して対応するコンポーネントが存在するか確認し、存在する場合はそのコンポーネントを使用してコードを生成するというアプローチで実装してくれました。生成されたコードは以下のようになっています。コードベース上のコンポーネントやトークンを使用して実装されていることがわかりますね。

```tsx:src/components/ProfileSettings/ProfileSettings.tsx
import { useState } from "react";
import styles from "./ProfileSettings.module.css";
// その他の import は省略...

/**
 * プロフィール設定フォームコンポーネント。
 *
 * ユーザーの名前・メールアドレスの編集と通知設定の切り替えができる。
 * Avatar / Input / Toggle / Button を組み合わせたフォームコンポーネント。
 */
export function ProfileSettings({
  name,
  email,
  avatarSrc,
  onSave,
}: ProfileSettingsProps) {
  const [nameValue, setNameValue] = useState(name);
  const [emailValue, setEmailValue] = useState(email);
  const [notifications, setNotifications] = useState(false);

  const handleSave = () => {
    onSave?.({ name: nameValue, email: emailValue, notifications });
  };

  return (
    <div className={styles.container}>
      {/* ヘッダー */}
      <div className={styles.headerBlock}>
        <h2 className={styles.title}>プロフィール設定</h2>
        <hr className={styles.divider} />
      </div>

      {/* アバターセクション */}
      <div className={styles.avatarSection}>
        <Avatar name={name} src={avatarSrc} size="lg" />
        <div className={styles.nameColumn}>
          <p className={styles.userName}>{name}</p>
          <p className={styles.userEmail}>{email}</p>
        </div>
      </div>

      {/* フォームセクション */}
      <div className={styles.formSection}>
        <Input
          label="名前"
          placeholder="名前を入力"
          value={nameValue}
          onChange={setNameValue}
        />
        <Input
          label="メールアドレス"
          placeholder="メールアドレスを入力"
          type="email"
          value={emailValue}
          onChange={setEmailValue}
        />
      </div>

      {/* 通知トグル */}
      <Toggle
        label="通知を受け取る"
        checked={notifications}
        onChange={setNotifications}
      />

      {/* アクションセクション */}
      <div className={styles.actionSection}>
        <div className={styles.dividerWrap}>
          <hr className={styles.divider} />
        </div>
        <Button variant="primary" onClick={handleSave}>
          保存
        </Button>
      </div>
    </div>
  );
}
```

```css:src/components/ProfileSettings/ProfileSettings.module.css
.container {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--spacing-8);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  overflow: hidden;
  max-width: 480px;
  width: 100%;
}

/* 省略... */
```

## まとめ

- Figma MCP サーバーの `use_figma` ツールを使用すると、Figma のキャンバスを直接操作してデザインを生成できる
- `use_figma` ツールは Figma Plugin API を通じて JavaScript を直接実行する汎用ツールとして設計されているため、デザインファイルの作成だけでなく、デザイントークンの定義・コンポーネントやバリアントの作成・Auto Layout の設定など、Figma 上で可能なあらゆる操作を行える
- `use_figma` ツール自身はプリミティブな操作を提供するツールとなっているため、スキルを通じて具体的なワークフローを実行する使用方法が想定されている。公式の figma プラグインをインストールすると、コードベースから Figma のデザインシステムを構築する `figma-generate-library` スキルや、コードやデザインシステムから Figma 上に UI デザインを生成する `figma-generate-design` スキルなどが使用できるようになる
- `figma-generate-library` スキルを使用すると、コードベースのトークンやコンポーネントの仕様を抽出して Figma 上にデザインシステムを構築できる。トークンの作成やページの骨格作成、コンポーネントの作成などのステップを経て、コードベースのトークンやコンポーネントと対応する Figma 上の変数やコンポーネントが作成される
- `figma-generate-design` スキルを使用すると、プロンプトで指定した要件を満たすように Figma 上に UI デザインを生成できる。画面の理解やデザインシステムの探索、ページラッパーフレームの作成、セクションの作成などのステップを経て、デザインシステム上のコンポーネントを使用して要件を満たすデザインが完成する
- ただし、完全にお任せでやってもらうと細かい部分で意図しないデザインになってしまうこともあるため、適宜フィードバックを送って修正してもらう必要がある

## 参考

- [Agents, Meet the Figma Canvas | Figma Blog](https://www.figma.com/blog/the-figma-canvas-is-now-open-to-agents/)
- [Figma skills for MCP – Figma Learn - Help Center](https://help.figma.com/hc/en-us/articles/39166810751895-Figma-skills-for-MCP#h_01KMFHKFDR8Q78CR8CC9W8J18E)
- [Figma MCP Server](https://developers.figma.com/docs/figma-mcp-server/)
- [Write to canvas](https://developers.figma.com/docs/figma-mcp-server/write-to-canvas/)
- [use_figma](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#use_figma)
- [figma/mcp-server-guide: A guide on how to use the Figma MCP server](https://github.com/figma/mcp-server-guide)
