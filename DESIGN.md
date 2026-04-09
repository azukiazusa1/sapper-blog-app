# Design System — 和エディトリアル (Wa-Editorial)

azukiazusa.dev のデザインシステムドキュメント。

## 1. Design Philosophy

**和エディトリアル**とは、日本のエディトリアルデザインの感性と技術出版物の明快さを融合させた設計方針です。

5つの原則:

1. **間（Ma）** — 十分な余白。視覚的ノイズを排除する
2. **フラット＆正直** — グラデーションで奥行きを偽装しない。背景は色そのもので語る
3. **タイポグラフィ駆動** — 文字が主役。装飾ではなく書体で個性を出す
4. **抑制されたカラー** — 単一アクセントを控えめに使う。背景塗りではなくボーダー線として表現する
5. **鋭利なジオメトリー** — pill（丸薬形）を排除。角丸は 2〜8px に統一する

---

## 2. Color Tokens

CSS カスタムプロパティは `app/src/app.css` の `@theme {}` ブロックで定義されています。

### Accent Colors

```css
--color-accent: oklch(52% 0.086 182); /* primary teal — light mode */
--color-accent-light: oklch(78% 0.133 182); /* brighter teal — dark mode */
```

同一 Hue (182°) の明度バリアントとして定義。`color-mix` も `in oklch` で計算。

アクセントカラーは `style="color: var(--color-accent)"` または `style="background-color: var(--color-accent)"` で使用します。
Tailwind クラスには対応していないため、インラインスタイルを使用してください。

### Semantic Color Scale

| Role                      | Light                                | Dark                                          |
| ------------------------- | ------------------------------------ | --------------------------------------------- |
| **Page background**       | `bg-stone-50`                        | `dark:bg-stone-950`                           |
| **Surface (card/panel)**  | `bg-white`                           | `dark:bg-stone-900`                           |
| **Surface elevated**      | `bg-stone-100`                       | `dark:bg-stone-800`                           |
| **Text primary**          | `text-stone-900`                     | `dark:text-stone-100`                         |
| **Text secondary**        | `text-stone-600`                     | `dark:text-stone-400`                         |
| **Text muted / metadata** | `text-stone-400`                     | `dark:text-stone-500`                         |
| **Border**                | `border-stone-200`                   | `dark:border-stone-800`                       |
| **Border subtle**         | `border-stone-100`                   | `dark:border-stone-900`                       |
| **Accent text**           | `style="color: var(--color-accent)"` | (same var — use accent-light in dark via CSS) |

### Hover States

- Surface hover: `hover:bg-stone-100` / `dark:hover:bg-stone-800`
- Link hover: `hover:underline`

### カラーパレットの制約

`@theme` で未使用のカラーパレットを `initial` に設定し、ユーティリティクラス自体が生成されないようにしている。

**有効なパレット:**

| パレット                                                                  | 用途                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------ |
| `stone`                                                                   | グレー系の唯一のパレット。テキスト・背景・ボーダー全般 |
| `red`, `yellow`, `green`, `blue`, `amber`                                 | Alert コンポーネント（error, warning, tip, note）      |
| `orange`, `cyan`, `emerald`, `indigo`, `violet`, `purple`, `pink`, `rose` | Recap ページ、コードハイライト                         |

**無効化済みのパレット:** `slate`, `gray`, `zinc`, `neutral`, `lime`, `teal`, `sky`, `fuchsia`

これらは `@theme` で `initial` 設定済み + ESLint `no-restricted-syntax` ルールで動的クラスも検出される。使おうとしてもクラスが生成されず、lint でもエラーになる。

---

## 3. Typography

フォントは `app/src/app.html` で Google Fonts から読み込み、`app/src/app.css` の `@theme {}` で変数定義されています。

### Font Families

```css
/* 本文: OS のデフォルト sans-serif に委ねる。
   ディスレクシア対応フォント等ユーザー設定を尊重するため、
   個別フォント名の列挙は行わない。 */
--font-sans: sans-serif;

/* 見出し・タイトル: Google Fonts からロード。
   フォールバックに system-ui を含めない（日本語環境で游ゴシック UI が適用されるため）。 */
--font-display: "Bricolage Grotesque", sans-serif;

/* コード・メタ情報: Google Fonts からロード */
--font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

**フォント解決の優先順位（本文）:**

`sans-serif` 総称フォントにより、各 OS のデフォルトサンセリフフォントが適用されます。

| OS                          | 解決フォント                                     |
| --------------------------- | ------------------------------------------------ |
| macOS / iOS                 | ヒラギノ角ゴ ProN                                |
| Windows 11/10（2025年以降） | Noto Sans JP                                     |
| Android                     | Noto Sans CJK JP（メーカー削除されていない場合） |

> **注意:** `system-ui` は Windows 環境で游ゴシック UI 書体が適用されるため、日本語環境では使用禁止です。海外製 UI フレームワークやリセット CSS で `system-ui` が設定されている場合は `sans-serif` に置き換えてください。

### Usage Guidelines

| Context                | Font                | Tailwind / Style                               |
| ---------------------- | ------------------- | ---------------------------------------------- |
| ページ本文             | OS システムフォント | (default `font-sans`)                          |
| 見出し・タイトル（大） | Bricolage Grotesque | `style="font-family: var(--font-display)"`     |
| サイトタイトル         | JetBrains Mono      | `font-mono`                                    |
| 日付・タグ・メタ情報   | JetBrains Mono      | `font-mono`                                    |
| コードブロック         | JetBrains Mono      | `font-mono`                                    |
| セクションラベル       | JetBrains Mono      | `font-mono text-sm uppercase tracking-[0.2em]` |

### Editorial Section Heading

セクションの見出しは大きな太字ではなく、エディトリアルなラベルスタイルを使用します。

```html
<h2
  class="mb-8 border-b border-stone-200 pb-3 font-mono text-base font-medium
           uppercase tracking-[0.2em] text-stone-500
           dark:border-stone-700 dark:text-stone-400"
>
  Section Label
</h2>
```

### Article Title

```html
<h1
  class="text-3xl font-bold leading-tight"
  style="font-family: var(--font-display)"
>
  Article Title
</h1>
```

### Japanese Typography — 余白と可読性

`app.css` の `@layer base` でグローバルに、`#contents` セレクタで記事本文に適用されています。

#### グローバル設定（`@layer base`）

| CSS プロパティ          | 値            | 適用先                | 効果                                                                                                                     |
| ----------------------- | ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `overflow-wrap`         | `anywhere`    | `:root`               | 収まらない場合に折り返す                                                                                                 |
| `line-break`            | `strict`      | `:root`               | 禁則処理を厳格に適用                                                                                                     |
| `text-autospace`        | `normal`      | `:root`               | 日本語と英数字間にスペースを自動挿入。`pre`, `time`, `input`, `textarea`, `[contenteditable]` には `no-autospace` を指定 |
| `text-spacing-trim`     | `trim-start`  | `:root`               | 行頭の約物スペースを除去。`pre` には `space-all` を指定                                                                  |
| `font-kerning`          | `none`        | `:lang(ja)`           | 日本語本文はベタ組みが原則のためカーニング無効                                                                           |
| `font-kerning`          | `normal`      | 見出し・caption       | 見出しはカーニング有効                                                                                                   |
| `font-feature-settings` | `"palt"`      | 見出し（`:lang(ja)`） | 見出しの約物をプロポーショナル字詰め。**本文には適用しない**（ベタ組み原則）                                             |
| `word-break`            | `auto-phrase` | 見出し（`:lang(ja)`） | 文節単位で改行（Chrome 119+）。**本文には適用しない**（段落の可読性が悪化するため）                                      |
| `text-wrap`             | `balance`     | 見出し                | 複数行の見出しの行長をバランス調整                                                                                       |

#### 記事本文（`#contents`）

| CSS プロパティ   | 値                                       | 効果                                                        |
| ---------------- | ---------------------------------------- | ----------------------------------------------------------- |
| `font-size`      | `1rem`（mobile）/ `1.0625rem`（desktop） | `rem` 指定によりブラウザの文字拡大機能・`text-scale` に対応 |
| `line-height`    | `1.9`（mobile）/ `2.0`（desktop）        | 和文に必要な広い行間。英文の一般的な 1.5–1.6 より大きく設定 |
| `letter-spacing` | `0.01em`（desktop）                      | 微細な字間調整。詰めすぎず、緩めすぎない                    |

#### 設計判断の要約

- **本文はベタ組み**: `font-feature-settings: "palt"` や `word-break: auto-phrase` は見出しのみに適用。本文に適用すると段落内で妙な空行が生まれ可読性が悪化する
- **`rem` 優先**: テキストサイズ・段落マージン・行間は `rem` で指定し、ブラウザの文字拡大機能と `<meta name="text-scale" />` に対応。装飾的なボーダー幅など文字拡大に連動すべきでない値のみ `px` を使用
- **メディアクエリのブレイクポイント**: `calc(768 / 16 * 1em)` のように `em` ベースで指定し、文字拡大時のレイアウト崩れを防止
- **`overflow: clip` 優先**: `line-clamp` 等で `overflow: hidden` ではなく `overflow-y: clip` を使用。`hanging-punctuation` との組み合わせ問題、`position: sticky` や Scroll-driven Animation の阻害を防止

#### 未実装・検討中

| CSS プロパティ                    | 状況                                        | 備考                                                                                                              |
| --------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `hanging-punctuation`             | Safari のみ（Chrome は将来対応予定）        | 行頭・行末の約物を字面外に追い出し、テキストエッジを光学的に揃える。インライン軸に `padding` とセットで指定が必要 |
| `text-box-trim` / `text-box-edge` | Firefox 未サポート                          | ハーフレディング除去。`line-height: 1` の代替手段としても有用。プログレッシブ・エンハンスメントで導入検討         |
| `text-wrap: pretty`               | Safari の日本語バグあり                     | 日本語段落への適用は Safari のバグ修正後に検討。英語段落には適用可能                                              |
| `text-indent: hanging 1em`        | Safari・Firefox サポート済、Chrome 146 予定 | 注釈の「※」逆方向字下げに有用。プログレッシブ・エンハンスメントで導入検討                                         |

---

## 4. Shape & Radius

| Element                                                     | Class          |
| ----------------------------------------------------------- | -------------- |
| Cards / panels                                              | `rounded-lg`   |
| Buttons / tags / badges / inputs                            | `rounded`      |
| Avatar images                                               | `rounded-full` |
| 装飾的ドット（Timeline ノード、タイピングインジケーター等） | `rounded-full` |
| Dialog / modal                                              | `rounded-lg`   |

### 設計意図

角丸は 2〜8px（`rounded` 〜 `rounded-lg`）に統一する。`rounded-full` はアバターや小さな装飾的ドットなど、正円であることに意味がある要素のみに使用する。pill 形状（ボタンやタグを丸薬形にする）には使用しない。`rounded-2xl` 以上の大きな角丸も同様に使用しない。

---

## 5. Spacing & Layout

- ページコンテナ: `container mx-auto px-4`
- 最大幅: `max-w-7xl`（ホーム）/ `max-w-6xl`（記事）/ `max-w-5xl`（メタ）
- カード間隔: `gap-6` 〜 `gap-8`
- セクション間隔: `my-16`
- カード内余白: `p-5` 〜 `p-8`

---

## 6. Shadows & Depth

**深度は影ではなくボーダーで表現する** のが基本方針。カードやパネルの区切りにはボーダーを使い、shadow で浮き上がりを演出しない。

shadow は「物理的に浮いている UI 要素」にのみ使用する:

- **FAB（Floating Action Button）** — 画面上に浮遊する要素として shadow で存在を示す
- **Modal / Dialog** — オーバーレイコンテンツ
- **Dropdown** — 展開メニュー

通常のカード・パネルに `shadow` + `hover:shadow-xl` のような装飾的 shadow は使用しない。

---

## 7. Effects & Animation

### 設計意図

アニメーションとエフェクトは**機能的な目的**がある場合にのみ使用する。「目を引くため」「リッチに見せるため」の装飾的エフェクトは使用しない。

**使用しないエフェクト:**

- **Glassmorphism** — `backdrop-blur` をカードやヘッダーの背景に使わない。モーダルのオーバーレイなど機能的用途のみ許可
- **グラデーション背景・テキスト** — フラットな単色を使う
- **ホバーリフト・スケール** — カードの hover 時に `translate-y` で浮かせたり、画像を `scale` で拡大しない
- **装飾的パルス** — ユーザーの注意喚起など機能的理由がない `pulse` は使わない

**使用するエフェクト:**

- `transition-colors` — hover 時の色変化
- `transition` — ナビゲーション / モーダル開閉
- View Transitions API — ページ遷移（SvelteKit）
- `backdrop-blur` — 画像ズームモーダルのオーバーレイ（機能的用途）

---

## 8. Accent Color Usage

アクセントカラー `oklch(52% 0.086 182)` は**線・テキスト**として使い、背景塗りは最小限に抑えます。

| Usage                    | Implementation                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| リンクテキスト           | `style="color: var(--color-accent)"`                                                                        |
| アクティブ状態のボーダー | `style="border-color: var(--color-accent)"`                                                                 |
| TOC active ハイライト    | `border-l-color: var(--color-accent)` + 薄い背景 `color-mix(in oklch, var(--color-accent) 8%, transparent)` |
| ラベル・モノスペースメタ | `style="color: var(--color-accent)"`                                                                        |
| Primary ボタン背景       | `style="background-color: var(--color-accent)"` (唯一の塗り用途)                                            |

---

## 9. Component Patterns

### Card / Panel

```html
<div
  class="rounded-lg border border-stone-200 bg-white
            p-6 dark:border-stone-800 dark:bg-stone-900"
></div>
```

### Primary Button

```html
<a
  class="inline-flex items-center rounded px-4 py-2 text-white transition-colors hover:opacity-80"
  style="background-color: var(--color-accent)"
>
  Label
</a>
```

### Secondary Button

```html
<a
  class="inline-flex items-center rounded border border-stone-300 px-4 py-2
          text-stone-900 transition-colors hover:bg-stone-100
          dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-800"
>
  Label
</a>
```

### Inline Tag

```html
<span
  class="inline-flex items-center rounded bg-stone-100 px-2 py-0.5
             font-mono text-xs text-stone-700
             dark:bg-stone-800 dark:text-stone-300"
>
  #tag
</span>
```

### Pagination Active Page

```html
<!-- active -->
<div class="... bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900">
  <!-- inactive -->
  <div class="... border border-stone-200 bg-white hover:bg-stone-100"></div>
</div>
```

---

## 10. Accessibility

### 設計意図

アクセシビリティはデザインの後付けではなく、**見た目の一貫性を保ったまま操作可能性を保証するための制約**として扱う。とくに azukiazusa.dev は文章を読む体験が中心のため、装飾よりも可読性・発見可能性・キーボード操作を優先する。

### Interactive States

- hover だけで状態差を表現しない。`focus-visible`、`active`、`aria-current`、`disabled` にも視覚的差分を用意する
- キーボードフォーカスは `outline: none` で消さない。非表示にする場合は同等以上に明確な focus ring / border change を必須とする
- focus 表現は hover より強くする。hover が背景色変化のみなら、focus-visible は ring または border を追加する
- 現在地を示すナビゲーション要素は `aria-current="page"` を付与し、色だけでなく線・背景・ウェイトのいずれかを併用して表現する
- disabled は opacity を下げるだけで済ませず、hover / focus を無効化し、操作不能であることが分かる見た目にする

### 操作対象のサイズ

- ボタン、アイコンボタン、タブ、ページネーションなどのクリック可能領域は **44 × 44 CSS px 以上**を目安にする
- 小さなアイコン単体を押させず、padding を含めた操作領域で確保する
- インラインリンクは本文の読書リズムを壊さない範囲で十分な下線・色差を持たせ、 hover に依存しない識別性を確保する

### ラベルとセマンティクス

- アイコンのみのボタンには `aria-label` を必須とする
- フォーム部品は placeholder をラベルの代替にしない
- ダイアログ、ナビゲーション、目次などランドマーク性のある要素には適切なラベルを付与する
- 状態を持つコントロールは `aria-expanded`, `aria-controls`, `aria-current` など対応する属性を見た目と同期させる

### Color & Contrast

- 本文・UI テキストは WCAG AA を満たすコントラストを前提に配色する
- アクセントカラーは補助的に使い、低コントラストな細字テキストを量産しない
- 状態変化を色だけで伝えない。選択中・エラー・現在地には border、underline、icon、文言のいずれかを併用する

### Motion & Reduced Motion

- 非必須アニメーションは `prefers-reduced-motion` で無効化する
- 点滅、常時ループ、視線を強く奪う移動は避ける。必要な場合も短時間・低頻度に抑える
- `transition-all` は原則使用しない。`transition-colors`, `transition-opacity`, `transition-transform` など対象を限定する

### Scroll / Overlay

- モーダルやサイドメニューを開いたときは背面スクロールを止める
- sticky header があるページ内リンクでは `scroll-margin-top` を設定し、見出しがヘッダーの裏に隠れないようにする
- `overflow: hidden` は必要最小限に留める。sticky 要素、フォーカスリング、スクロール駆動表現への影響を確認する

### コードレビューで確認すべき観点

- hover だけでなく `focus-visible` 時にも操作対象が明確に見えるか
- アイコンボタンにアクセシブルネームがあるか
- 現在地・選択中の状態が色だけに依存していないか
- ダイアログ表示時にフォーカス移動と背景スクロール抑止が成立しているか
- reduced motion 環境で非必須アニメーションが無効化されるか

---

## 11. Layering & z-index

### 設計意図

z-index は「強い数字をその場で足す」のではなく、**責務ごとに層を定義して使い回す**。視覚上の前後関係だけでなく、操作可能性とフォーカス順序の予測可能性を保つことを目的とする。

### Layer Scale

| Layer          | 役割                                                                | 推奨 z-index   |
| -------------- | ------------------------------------------------------------------- | -------------- |
| Base           | 通常の本文、カード、画像、装飾                                      | `auto` / `z-0` |
| Raised         | hover しない補助装飾、カード内の重なり                              | `z-10`         |
| Sticky         | sticky header, floating TOC toggle など常時前面にいるナビゲーション | `z-40`         |
| Overlay        | drawer 背景、modal backdrop、scrim                                  | `z-50`         |
| Dialog / Panel | modal 本体、side menu、本体操作を奪う UI                            | `z-60`         |
| Ephemeral      | toast, tooltip, copy feedback など一時表示                          | `z-70`         |

### Rules

- 新しい `z-[9999]` のような ad-hoc な値を導入しない。上のレイヤースケールに当てはめる
- backdrop は content より 1 層下に置く。overlay と dialog の責務を分離する
- sticky header は本文より前面、modal / drawer より背面に置く
- 一時的な tooltip / popup は対象要素より前面に出すが、dialog を突き抜けない。dialog 内 tooltip は dialog レイヤーの文脈内で完結させる
- z-index の衝突を避けるため、不必要に `position` と `z-index` をセットで増やさない
- stacking context を作る `transform`, `filter`, `opacity`, `isolation`, `contain` の使用時は、子要素の重なり順が変わることを確認する

### 運用指針

- overlay を伴う UI は「backdrop」「content」を別要素で持つ
- fixed / sticky UI を追加する場合、既存の header, side menu, dialog と重なり検証を行う
- デバッグ時は「なぜ前面に出したいか」を先に決め、数値ではなくレイヤー名で説明できる状態にする

### コードレビューで確認すべき観点

- z-index がスケール外の場当たり的な値になっていないか
- overlay より dialog 本体が前面にあり、背面 UI が誤操作可能になっていないか
- sticky header と in-page navigation が干渉していないか
- transform / opacity により意図しない stacking context が作られていないか

---

## 12. Scope Exceptions

以下のページ・ディレクトリは**独立したデザインを持つスタンドアロンページ**であり、このデザインシステムの適用対象外です。

- `app/src/routes/recap/2023/`
- `app/src/routes/recap/2024/`
- `app/src/routes/recap/2025/`

これらのページは年次振り返りの特別コンテンツとして、独自のビジュアルテーマ（グラデーション、カラフルな配色等）を持ちます。また、グローバルの Header / Footer を非表示にして独立したレイアウトで表示されます。

---

## 13. 設計制約の実施方針

DESIGN.md はあくまで**設計意図の記録**であり、制約の実施はツールで行う。ドキュメントに具体的なクラス名を列挙して「禁止」としても、人間はドキュメントを見ずにコードを書くため効果が薄い。

### 実施済みの制約

| 制約                         | 実施手段                                                                                                                                                     | 状況         |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------ |
| 未使用カラーパレットの無効化 | `@theme` で `slate`, `gray`, `zinc`, `neutral`, `lime`, `teal`, `sky`, `fuchsia` を `initial` に設定。ESLint `no-restricted-syntax` ルールで動的クラスも検出 | **実施済み** |

### 未実施の制約（検討中）

| 制約                                         | 実施手段                                         |
| -------------------------------------------- | ------------------------------------------------ |
| グラデーション背景の禁止                     | Stylelint / ESLint カスタムルール                |
| `line-height: 1` の禁止                      | Stylelint                                        |
| `font-size` の `px` 指定禁止（テキスト用途） | Stylelint                                        |
| `overflow: hidden` → `overflow: clip` 優先   | コードレビューで判断（文脈依存のため自動化困難） |

### コードレビューで確認すべき観点

ツールで機械的に弾けない、文脈依存の判断:

- shadow がカード装飾ではなく機能的用途（FAB, modal, dropdown）に限定されているか
- `backdrop-blur` が装飾ではなく機能的用途（モーダルオーバーレイ等）に限定されているか
- `rounded-full` が正円であることに意味がある要素（アバター、ドット）に限定されているか
- 本文に `font-feature-settings: "palt"` や `word-break: auto-phrase` が適用されていないか（見出しのみ）
- フォントスタックに `system-ui` が混入していないか
