---
id: ZTxaQPA52akp_Oxje0ajQ
title: "AI エディター Cursor を試してみる"
slug: "try-ai-editor-cursor"
about: "AI エディター Cursor は GitHub Copilot と同様にコードの補完やチャットによるコードの生成をサポートしてくれます。Cursor は VS Code をフォークして作られており、既存の VS Code の拡張機能やキーバインドをそのまま利用することも特徴の 1 つです。"
createdAt: "2025-01-11T12:04+09:00"
updatedAt: "2025-01-11T12:04+09:00"
tags: ["AI"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4fVhQUkjvXOQPwwVPBOYAq/58dec4a6e58deb5dbf4e62d07e5bdc24/yatai_oden_11993-768x591.png"
  title: "yatai oden 11993-768x591"
audio: null
selfAssessment:
  quizzes:
    - question: "AI エディター Cursor はどのエディタをフォークして作られているますか？"
      answers:
        - text: "VS Code"
          correct: true
          explanation: null
        - text: "Emacs"
          correct: false
          explanation: null
        - text: "Sublime Text"
          correct: false
          explanation: null
        - text: "Vim"
          correct: false
          explanation: null
published: true
---
生成 AI の台頭はプログラミングの世界に大きな変革をもたらしました。我々開発者は AI の助けを借りながらまるでペアプログラミングをしているかのようにコードを書くことができます。私自身も普段から GitHub Copilot を使ってコードを書いています。コードを書いている最中に AI がコードを補完してくれる体験は、素早いフィードバックを得られるため非常に効率的です。

コードを選択してテストコードやドキュメントを生成したり、コードのリファクタリングを行うような対話的なやり取りも AI がサポートしてくれます。このような対話的なやり取りでは AI が生成したコードを元に人間がコードを修正する、というように今までのプログラミングの作業では求められなかった全く新しいスキルが必要です。

GitHub Copilot はコードを書く際に利用される生成 AI の中でも最も有名なものの 1 つですが、昨今では新たな AI エディターも登場しています。その 1 つが AI エディター Cursor です。Cursor は GitHub Copilot と同様にコードの補完やチャットによるコードの生成をサポートしてくれます。Cursor は VS Code をフォークして作られており、既存の VS Code の拡張機能やキーバインドをそのまま利用することも特徴の 1 つです。

https://www.cursor.com/

この記事では実際に Cursor を使って Web アプリケーションを作ってみる体験を共有します。

## Cursor のインストール

Cursor は以下の URL からインストールできます。

https://www.cursor.com/

「DOWNLOAD FOR MAC」ボタンをクリックするとインストーラーがダウンロードされます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7kBVzwFe7vdcT6Btl31nP5/b06a4893086ffa83807444a8a7bd1d97/__________2025-01-11_12.22.30.png)

Keyboard は「Default（VS Code）」を、Language For AI は「日本語」を選択しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/5c9PPwhh6TrNb96OTarhhY/afffa6ce59b803898d2cd22e2d3840fe/__________2025-01-11_12.24.56.png)

エディタのセットアップが完了すると、ログインが求められます。AI 機能を利用するためには、Cursor のアカウントが必要なようです。

![](https://images.ctfassets.net/in6v9lxmm5c8/6V5uSGp1QnZGZi6wGfbBKb/b3d0b47ab125fac08e90f8400586d465/__________2025-01-11_12.28.53.png)

Sign UP をクリックするとログイン画面が表示されます。手順に従ってアカウントを作成すると、AI エディター Cursor を利用できます。Cursor を利用するプランとして以下の 3 つのプランが用意されています。

- Hobby（無料）
- Pro（月額 20 ドル）
- Business（月額 50 ドル/ユーザー）

https://docs.cursor.com/get-started/usage

2 週間の無料トライアルが提供されているので、今回は Hobby プランのままで進めていきます。

## プロジェクトを作成する

セットアップが完了したら、早速アプリケーションを作成していきましょう。今回は React でカレンダーアプリケーションを作成していきます。

まずは開発するプロジェクトを作成するために、チャットで Cursor に指示します。`⌘ + L` を押すとサイドバーにチャットが表示されます。いくつかの AI モデルが選択できるようですが、今回はデフォルトの「claude-3.5-sonnet」を選択しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/4QtwxEkbwBHqcZQ3omLpLl/9c86ef7509525e4ebece2bb651cdee4d/__________2025-01-11_13.35.54.png)

プロンプトは以下のように入力しました。

```txt
React TypeScript Tailwind CSS を使用したカレンダーアプリを作成したいです。必要なプロジェクトのセットアップをお願いします。
```

結果として、必要なコマンドやファイルが指示されました。`create-react-app` はちょっと古いですがここは Vite に置き換えてコマンドを実行すれば問題ないように思います。

![](https://images.ctfassets.net/in6v9lxmm5c8/2l6XfTybA5qHacaB2uQMxy/19c02fea069110a68e54f837eb8cefac/__________2025-01-11_13.38.42.png)

チャットの他に「Composer」というタブもあるようなのでこちらも試してみましょう。チャットはコードの内容を質問するようにコードの検索と理解をサポートしてくれるの対して、Composer は新しいコードを生成したりコードを直接編集するという違いがあります。

Composer では「Normal」と「Agent」の 2 つのモードが選択できるようです。Agent ではプロンプトで指示された内容を完了するまでターミナルコマンドの実行やファイルの作成・変更といった操作を行ってくれるようです。Agent は最大 25 回までの呼び出しを行うことができます。チャットで指示したプロンプトを少し変更して Composer に指示してみます。

```txt
React・TypeScript・Tailwind CSS・Vite を使用したカレンダーアプリを作成したいです。必要なプロジェクトのセットアップをお願いします。適切な ESLint・Prettier の設定もお願いします。
```

Vite を使ってプロジェクトを作成するコマンドが生成され、「Generating...」という状態で停止しています。ターミナルコマンドの実行自体は開発者自身がおこなう必要があるようです。「Run Command」ボタンをクリックしてみましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/3L8KEINklM7IyWgAWHJFkX/e9819f18bb9acd9480a84d1e511e539a/__________2025-01-11_13.52.26.png)

続いて依存関係のインストールするコマンドが表示され生成されたので、再びコマンドを実行します。その後 `taiwind.config.js` の編集・`eslintrc.json` と `.prettierrc` の作成が生成されました。ファイルの編集や生成に関してはターミナルコマンドの実行とは異なり、AI が自動で行ってくれました。また、ファイルの生成や編集の完了後には Linter によるコード検証も行ってくれるようです。

「Accept All」ボタンをクリックするとファイルの変更が適用されます。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

<details>
<summary>実際に生成された回答</summary>

はい、React + TypeScript + Tailwind CSS + Vite を使用したカレンダーアプリのセットアップをお手伝いさせていただきます。
まず、Vite を使用して新しいプロジェクトを作成します。

```sh
npm create vite@latest . -- --template react-ts
```

次に、必要な依存関係をインストールします。

```sh
npm install && npm install -D tailwindcss postcss autoprefixer eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks prettier eslint-config-prettier eslint-plugin-prettier
```

Tailwind CSS の設定を初期化します：

```sh
npx tailwindcss init -p
```

Tailwind CSS の設定ファイルを更新します：

```js:tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

次に、ESLint の設定ファイルを作成します：

```json:.eslintrc.json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["react", "@typescript-eslint", "prettier"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "prettier/prettier": "error"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

Prettier の設定ファイルを作成します：

```json:.prettierrc
{
  "semi": true,
  "tabWidth": 2,
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "jsxSingleQuote": true,
  "bracketSpacing": true
}
```

メインの CSS ファイルに Tailwind のディレクティブを追加します：

```diff:src/index.css
+ @tailwind base;
+ @tailwind components;
+ @tailwind utilities;

 :root {
   font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
   line-height: 1.5;
```

最後に、package.json にスクリプトを追加します：

```json:diff
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
-   "preview": "vite preview"
+   "preview": "vite preview",
+   "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md,json}'"
  },
  "dependencies": {
    "react": "^18.3.1",
```

セットアップが完了しました！以下のコマンドで開発サーバーを起動できます：

```sh
npm run dev
```

プロジェクトのセットアップが完了しました！以下の機能が利用可能です：
- npm run dev - 開発サーバーの起動
- npm run build - プロダクションビルドの作成
- npm run lint - ESLint によるコード検証
- npm run format - Prettier によるコードフォーマット
プロジェクトには以下の設定が含まれています：
- TypeScript
- React
- Tailwind CSS
- ESLint（TypeScript、React 対応）
- Prettier

これでカレンダーアプリの開発を始めることができます。何か質問がありましたら、お気軽にお申し付けください！

</details>

<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->

## `<Calender>` コンポーネントを作成する

プロジェクトのセットアップを行ったときと同じような手順で、`<Calender>` コンポーネントを作成していきましょう。Composer に以下のようなプロンプトを入力しました。

```txt
以下の要件を満たす `<Calender>` コンポーネントを作成したいです。

- 月ごとのカレンダーを表示する
- カレンダーの前後の月に移動するボタンを表示する
- カレンダーの日付をクリックするとその日付が選択される
- 選択された日付では予定の追加・編集・削除ができる
- 予定の追加・編集・削除はモーダルで行う
- 予定には以下の情報を表示する
  - 予定のタイトル
  - 予定の開始時間
  - 予定の終了時間
  - 予定の場所
  - 予定のメモ
- 予定はローカルストレージに保存される
- 予定がある日付には帯が表示される
- デザインは Tailwind CSS を使用する
```

プロンプトをサブミットすると以下のファイルが作成されました。

- `src/components/Calender.tsx`
- `src/components/EventModal.tsx`
- `src/hooks/useEvent.ts`
- `src/hooks/useCalender.ts`
- `src/types/event.ts`

細かいコードの内容は省略しますが、実際に生成されたコードを実行してみるとほとんどの機能が期待通りに動作していることが確認できました。

![](https://images.ctfassets.net/in6v9lxmm5c8/V8Bk8r4uFxIyffCEcwqBX/a1ef2f54029502fdf77bd13cbbf9bff2/__________2025-01-11_15.06.53.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/37lyt99AWREqKA3JBY5vH6/d00bbbeab5f3a8a88c3b73a65edb4bcc/__________2025-01-11_15.07.08.png)

生成されたコードにいくつか気に入らない点があったので、リファクタリングをお願いしたいと思います。生成されたコードは `components/`/・`/hooks`・`/types` のように技術ごとにディレクトリが別れた構造になっていました。これを機能ごとにディレクトリを分けるようにリファクタリングをお願いしました。

```txt
ディレクトリ構造は `components/`/・`/hooks`・`/types` のように技術ごと分けられていますが、機能ごとにディレクトリを分けるようにリファクタリングをお願いします。
```

プロンプトをサブミットすると、期待通りにディレクトリを作成するコマンドが生成されました。

```sh
はい、機能ごとのディレクトリ構造にリファクタリングしていきましょう。カレンダー機能に関連するファイルを features/calendar ディレクトリにまとめます。
まず、新しいディレクトリ構造を作成します：

mkdir -p src/features/calendar/components src/features/calendar/hooks src/features/calendar/types
```

その後ファイルの移動はすべて AI が自動で行ってくれました。最後に古いファイルを削除してリファクタリングが完了しました。コードベース全体のコンテキストを理解して正しく実行されているようですね。最終的なディレクトリ構造は以下のようになりました。

```shsrc/
  ├── features/
  │   └── calendar/
  │       ├── components/
  │       │   ├── Calendar.tsx
  │       │   └── EventModal.tsx
  │       ├── hooks/
  │       │   ├── useCalendar.ts
  │       │   └── useEvents.ts
  │       └── types/
  │           └── Event.ts
  └── App.tsx
```

## よりスマートなコードの補完

AI にすべてのコードを生成させるのはここまでにして、ここからはペアプログラミングのように AI と協力してコードを書いていきます。GitHub Copilot と同じように Tab キーによるコードの補完が可能です。このコード補完は GitHub Copilot のものと比べてより良い体験を得られるように感じました。

具体例を見てみましょう。AI が生成したコードでは前の月に戻るボタンと次の月に進むボタンの中身のテキストが「←」と「→」になっていました。これを `aria-label` を使って「前の月へ」・「次の月へ」というテキストに変更したいと思います。

```tsx
<div>
  <button
    onClick={goToPreviousMonth}
    className="rounded-l bg-gray-100 px-4 py-2 hover:bg-gray-200"
  >
    ←
  </button>
  <button
    onClick={goToNextMonth}
    className="rounded-r bg-gray-100 px-4 py-2 hover:bg-gray-200"
  >
    →
  </button>
</div>
```

`aria-label` まで入力した時点で候補のテキストが表示されるところまでは GitHub Copilot と同じです。Cursor では Tab キーをクリックしたとき、次にコードが変更されるであろう箇所に自動でカーソルが移動してコードの補完が行われます。次の月へ移動するボタンまでカーソルが移動しているので、そのまま「次の月へ」と入力できました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/2e0loLqHY0nPbZ1qJHvV8O/571e59e989ab99b3a8798b674711eca2/_____2025-01-11_15.57.49.mov" controls></video>

Tab キーを入力するだけで次々とコードを補完してくれるので、面倒なカーソルの移動をする必要がなくなりました。

他にも自動で誤りを修正して補完を表示してくれる機能もあります。例えば React コンポーネントを作成する際に `className` と間違えて `class` と入力してしまった場合、`class` を `className` に修正したうえでコードの補完を提案してくれます。

![](https://images.ctfassets.net/in6v9lxmm5c8/248oXpylK0m7YGUXltqF3a/3c4da1e8d8dacb659e8474232f519bdc/__________2025-01-11_16.03.17.png)

さらにコードの文中であったとしても補完をしてくれる点も GitHub Copilot ではなかった機能です。例えば以下のコードで `isCurrentMonth` が `false` の場合にはボタンをクリックしても何も起こらないようにしたいと思います。

```tsx:Calendar.tsx {6}
{days.map(({ date, isCurrentMonth }, index) => {
  const dateEvents = getEventsByDate(date);
  return (
    <div
      key={index}
      onClick={() => handleDateClick(date)}
      className={`min-h-[100px] p-2 border ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} ${
        selectedDate?.toDateString() === date.toDateString()
          ? 'border-blue-500'
          : 'border-gray-200'
      } hover:border-blue-300 cursor-pointer`}
    >
      <div className={`text-right ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
        {date.getDate()}
      </div>
```

素直にコードを修正するのであれば、`onClick={() => isCurrentMonth && handleDateClick(date)}` のように `handleDateClick` の前に `isCurrentMonth` の条件分岐を追加することになります。しかし、GitHub Copilot を使用している場合には `handleDataClick` の前に `i` と入力してもうまい具合に補完をしてくれません。

このような場合には一旦改行を挟んでからコード補完が効くようにする、といったテクニックをよく使っていました。

Cursor ではカーソルの位置に関係なくコードの補完が行われます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7hRM8ZNCVA1HYYL8z2pmY9/ee201ce844daa5b2e6f74d7a3d1eaafa/__________2025-01-11_16.16.28.png)

## インラインチャット

インラインでのチャット機能も試してみます。コードを範囲選択したうえで　`⌘ + K` を押すとインラインでコードの修正を指示できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6GazJYzDlvwDtEniU4rEFE/3ebd9491dfa8a54e4d21b49ff89710ce/__________2025-01-11_16.26.25.png)

ラベルと入力が紐づけられるように修正を指示しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/26c2Qo3rfAEvfl74A3Xylf/443610a187047290a0c6923d90d1fc2e/__________2025-01-11_16.24.48.png)

行単位でコードの変更を受け入れる場合には `⌘ + Y` を、変更を破棄する場合には `⌘ + N` ショートカットキーを使用します。ここまでのコードの変更はすべてショートカットキーで行えるのでほとんどマウスを操作する必要はありませんでした。

![](https://images.ctfassets.net/in6v9lxmm5c8/2stnYepfN4w7eHpgZuFWMt/c2b5be118c0fe73b335a1f89f73c8336/__________2025-01-11_16.30.45.png)

さらに変更受け入れると、カーソルの位置を問わずに似たような変更を行うべき点を自動で Tab キーによる補完で提案してくれます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2EqAmDw57C7A2OuxxgFeqX/ccf1ea157ef12d938512ab4033ba1bde/__________2025-01-11_16.25.30.png)

## シンボルを使用してチャットを開始する

Cursor でチャットを行う場合、デフォルトでは現在開いているファイルがコンテキストとして含まれます。また Composer では現在の作業に基づいたコンテキストが選択されます。特定のファイルやディレクトリ、ドキュメントをコンテキストに含めたい場合には `@` シンボルを使用します。

プロンプトの入力欄で `@` をタイプするとコンテストの候補が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3mgAmd9vA4k2qrfnxVuYHE/e9ede04331dc64b748b3d8c57a544ba4/__________2025-01-11_16.47.21.png)

Files を選択するとファイルの一覧が表示されるので、選択したいファイルを選択します。ここでは `EventModal.tsx` を選択しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/3AzK9CAz8WPR7rFzLJ4YWv/7a74be30c91a9df8b142a1e53e0e845a/__________2025-01-11_16.48.35.png)

`EventModal.tsx` のテストコードを生成するように指示を与えてみましょう。以下のプロンプトを入力しました。

```txt
Vitest を使ってテストコードを生成してください。
```

このプロンプトをサブミットすると、`EventModal.test.tsx` が生成され、必要なパッケージをインストールするように指示されました。確かにコンテキストに応じて必要なテストコードを生成してくれています。

またテストコマンドを実際に実行したうえで、テストが失敗したことに対して自動で修正まで行ってくれました。エージェントタイプの AI の強みが出ている点といえますね。

<!-- textlint-disable ja-technical-writing/ja-no-mixed-period -->

<details>
<summary>実際に生成された回答</summary>

EventModal コンポーネントのテストを実装していきます。まず、テストファイルを作成します：

```tsx:EventModal.test.tsx
mport { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventModal } from './EventModal';

describe('EventModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnDelete = vi.fn();
  const mockDate = new Date('2024-03-20');

  const mockEvent = {
    id: '1',
```

必要なパッケージをインストールします：

```sh
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

次に、テスト設定ファイルを作成します：

```ts:setupTests.ts
import '@testing-library/jest-dom';
```

Vitest の設定を更新します：

```diff:vite.config.ts
+ /// <reference types="vitest" />
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

-  //  https://vite.dev/config/
+  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
+   test: {
+     globals: true,
+     environment: 'jsdom',
+     setupFiles: './src/setupTests.ts',
    },
  })
```

jsdom の環境をインストールします：

```sh
npm install -D jsdom
```

package.json にテストスクリプトを追加します：

```diff:package.json
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
-   "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md,json}'"
+   "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md,json}'",
+   "test": "vitest",
+   "test:coverage": "vitest run --coverage"
  },
  "dependencies": {
    "react": "^18.3.1",
```

最後に、Vitest をインストールします：

```sh
npm install -D vitest
```

これで、EventModal コンポーネントのテストを実行できる環境が整いました。テストを実行するには以下のコマンドを使用します：

```sh
npm test

     87|
     88|     fireEvent.change(screen.getByLabelText('タイトル'), { target: { value: '新しいイベント' } });
     89|     fireEvent.change(screen.getByLabelText('開始時間'), { target: { value: '11:00' } });
       |                             ^
     90|     fireEvent.change(screen.getByLabelText('終了時間'), { target: { value: '12:00' } });
     91|     fireEvent.change(screen.getByLabelText('場所'), { target: { value: '会議室B' } });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯

 Test Files  1 failed (1)
      Tests  3 failed | 4 passed (7)
   Start at  16:52:40
   Duration  840ms (transform 42ms, setup 87ms, collect 73ms, tests 65ms, environment 283ms, prepare 178ms)

 FAIL  Tests failed. Watching for file changes...
       press h to show help, press q to quit
```

テストが失敗しているのは、開始時間の input に id が設定されていないためです。EventModal コンポーネントを修正します：

```diff:EventModal.tsx
              開始時間
            </label>
            <input
+             id='startTime'
              type='time'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
```

これでテストが通るはずです。もう一度テストを実行してみましょう：

```sh
npm test
```

実装したテストは以下の項目をカバーしています：

1. 新規作成モードでの表示確認

- タイトル、フォーム要素、ボタンなどが正しく表示されること
- 削除ボタンが表示されないこと

2. 編集モードでの表示確認

- 既存のイベントデータが正しく表示されること
- 削除ボタンが表示されること

3. フォーム操作の確認

- 各入力フィールドの値が正しく更新されること
- 保存時に正しいデータが送信されること

4. ボタン操作の確認

- キャンセルボタンで閉じること
- 削除ボタンで削除処理が実行されること

5. モーダルの表示制御

- isOpen が false の時に何も表示されないこと

これらのテストにより、EventModal コンポーネントの主要な機能が正しく動作することを確認できます。
次に、Calendar コンポーネントのテストを実装しますか？
</details>

<!-- textlint-enable ja-technical-writing/ja-no-mixed-period -->

## まとめ

Cursor を使用して実際にアプリケーションを開発する流れを体験してみました。コード補完の部分は間違いなく GitHub Copilot よりも良い体験を得られたと感じています。実際に触ってみないとわからない部分もあると思うので、ぜひ試してみてほしいです。使いがっては VS Code とほとんど変わらないので、エディタの移行もあまり難しくないと思います。

エージェントを使用したコード生成も非常に強力だと感じました。コマンドの実行結果による誤りから、自動でファイル修正まで行ってくれたのまさにエージェントの強みが出た例だと思います。AI によりコードを生成するプロダクトは数多くありますが、Cursor はエディタに直接埋め込まれているため、より正確にコンテキストを理解したり、ウィンドウを切り替えることなくコードの生成や修正が行える点が強みだと感じました。

何度も言われていることかと思いますが、AI が生成したコードを鵜呑みにしないことは重要です。実際に実際に私がエージェントに生成させたコードには不適切な部分も多く含まれていました。今後 AI を利用したコードの生成が進んでいくのであれば、開発者が AI が生成したコードをレビューし、十分に理解したうえで修正を加えていくというスキルが求められるようになるかもしれません。

## 参考

- [Get Started / Migrate from VS Code – Cursor](https://docs.cursor.com/get-started/migrate-from-vscode)
