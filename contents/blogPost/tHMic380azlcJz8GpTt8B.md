---
id: tHMic380azlcJz8GpTt8B
title: "フォームのアクセシビリティを考える"
slug: form-accessibility
about: "今日の Web におけるフォームはユーザーが情報を入力して対話するための重要な要素です。支援技術を利用しているユーザーがフォームの入力を妨げられることは当然避けるべきでしょう。また障害の有無に関わらず、ユーザーに迷いを与えたり、入力ミスを誘発するようなフォームはユーザーがタスクを完了せずに途中で離脱してしまう可能性が高まり、ビジネスの観点からも望ましくありません。この記事ではフォームのアクセシビリティについて考え、実際のフォームの実装においてどのような点に注意すべきかを紹介します。"
createdAt: "2024-03-10T14:06+09:00"
updatedAt: "2024-03-10T14:06+09:00"
tags: ["アクセシビリティ", "HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1gzQpdC9qiNXwyJeE7HaNr/36f59aef5a33e66fb7e197f92b2fabbc/school-sotsuygyou-shousho_illust_3123.png"
  title: "卒業証書のイラスト"
published: true
---

今日の Web におけるフォームはユーザーが情報を入力して対話するための重要な要素です。スクリーンリーダーといった支援技術を利用しているユーザーがフォームの入力を妨げられることは当然避けるべきでしょう。また障害の有無に関わらず、ユーザーに迷いを与えたり、入力ミスを誘発するようなフォームはユーザーがタスクを完了せずに途中で離脱してしまう可能性が高まり、ビジネスの観点からも望ましくありません。

この記事ではフォームのアクセシビリティについて考え、実際のフォームの実装においてどのような点に注意すべきかを紹介します。以下の項目について解説します。

- 明確なラベルを提供する
- フォームの入力エラーの内容をユーザーに伝える
- フォームをグループ化する
- セマンティックなマークアップを使用する

## 明確なラベルを提供する

フォームの各入力フィールドには、その入力フィールドが何を表しているのかを明確に伝えるラベルを提供する必要があります。ラベルを提供するためにもっとも適した方法は、`<label>` 要素を使用して入力フィールドとラベルを関連付けることです。ラベルを関連付ける方法は以下の 2 つがあります。

1. `<label>` 要素の `for` 属性を使用して、`id` 属性を持つ入力フィールドと関連付ける
2. `<label>` 要素を入力フィールドの内部に配置する

```html
<!-- 1. `for` 属性を使用して関連付ける -->
<label for="name">名前</label>
<input type="text" id="name" name="name" />

<!-- 2. `<label>` 要素を入力フィールドの内部に配置する -->
<label>
  名前
  <input type="text" name="name" />
</label>
```

フォームとラベルを関連付けることで、フォームはアクセシブルな名前を持ちます。アクセシブルな名前とは、主にスクリーンリーダーにより読み上げられるテキストを表します。この例では `<input>` に対する `<label>` 要素の中身のテキストである「名前」がアクセシブルな名前となります。アクセシブルな名前は他にも、`<img>` 要素に対する `alt` 属性や、`<button>` 要素に対する内部のテキストなどがあります。

ある要素に対してどのようなアクセシブルな名前が使われているかどうかは、開発者ツールの Accessibility パネルまたは [Full Accessibility Tree](https://developer.chrome.com/blog/full-accessibility-tree?hl=ja) で確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2WhiBnkpmcISAb66qOxpVT/fc9eea0252578a5045a4402d95703086/__________2024-03-10_14.33.16.png)

フォームにアクセシブルな名前を提供することは、スクリーンリーダーを利用しているユーザーが入力フィールドに対して何を入力すべきかを理解するために重要です。アクセシブルな名前が提供されていないフォームをスクリーンリーダーで読み上げている例を見てみましょう。すべての入力フィールドが「テキストを編集、カラ」と読み上げられているため、それぞれの入力フィールドに入力すべき内容を識別できません。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/5BIfvPXQjxUkH1GU4Otnn3/f0e81b7ce072ef41a05c7212f4f7c458/_____2024-03-10_14.54.44.mov" controls></video>

`<label>` と `<input>` が関連付けられており、アクセシブルな名前が提供されているフォームの例を見てみましょう。スクリーンリーダーはそれぞれの入力フィールドに対して「名前、テキストを編集」のように読み上げます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/27A0tqjX8CqKYr5AqBLmf5/4a572fcdd6c29134266935ae5007bc5d/_____2024-03-10_14.59.13.mov" controls></video>

また `<label>` 要素を使用して入力フィールドとラベルを関連付けるとラベルをクリックしたときにも入力フィールドがフォーカスされるようになります。これはコントロールのクリック可能な領域を拡大することになり、運動能力に制限のあるユーザーにとっても有益です。

`aria-label` 属性など `<label>` 以外の方法でもアクセシブルな名前をできますし、アクセシブルな名前が提供されていなかったとしてもスクリーンリーダーによってはプレイスホルダーや `title` 属性の値が読み上げられることもあるため、スクリーンリーダーに名前を読み上げさせるためには必ずしも `<label>` 要素を使用する必要はありません。

しかし、視覚的なテキストを表示する、クリック可能な領域を拡大するといったメリットが `<label>` 要素を使用することで得られるため、可能な限り `<label>` 要素を使用するべきです。

### 視覚的なラベルを提供できない場合

表示領域の都合などにより、視覚的なラベルを提供できない場合があります。例えばヘッダーの検索フォームのように、検索アイコンのみを表示し、その横に入力フィールドを配置するような場合です。このような場合には、`aria-label` 属性を使用してアクセシブルな名前を提供できます。

```html
<svg>...</svg> <input type="search" aria-label="サイト内を検索" />
```

`aria-label` 属性は使用する前によく検討する必要があります。`<label>` 属性を使用することでクリック可能な領域が拡大することは先に述べたとおりです。

視覚的に画面に表示されているラベルを提供することは、晴眼者（画面を実際に見て操作するユーザー）とスクリーンリーダーを利用しているユーザーのコミュニケーションを円滑にするために重要です。例えば、晴眼者のユーザーが「虫眼鏡のアイコンに近くにある入力フォームに入力してください」という発言をした場合、スクリーンリーダーを利用しているユーザーにはうまく伝わらないかもしれません。

また、虫眼鏡のアイコンは検索フォームであることは広く知れ渡っているものの、Web を使い始めたばかりのユーザーにとっては明確ではないかもしれません。明確なテキストとしてラベルが提供されていることで、ユーザーがフォームの目的をより理解しやすくなります。

`aria-label` 属性は修正漏れが発生しやすいというデメリットも存在します。`aria-label` が画面上に表示されないため、視覚的なテストでは見落とされやすいためです。

### プレイスホルダーをフォームのラベルとして使わない

フォームのラベルとしてプレイスホルダーを使用することは避けるべきです。プレイスホルダーは何か文字を入力したときに消えてしまいます。消えるプレイスホルダーはユーザーの短期記憶に負荷をかけます。現実の世界ではユーザーは複数のタスクを同時に行っていることが多く、フォームに何か入力している途中で別のタブを開いたり、何かを考えたりすることがあります。いざフォームの入力に戻ったときにプレイスホルダーが消えていると、何を入力すべきかをすでに忘れてしまっていることでしょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/7cgqDfpuROUykvU9qzgWsI/c5a9b20214e1eb4d3c146ccccb93baf0/__________2024-03-10_16.03.04.png)

プレイスホルダーは入力例などのヒントのためによく使われていますが、プレイスホルダー自体の問題点に対しても注意を払う必要があるでしょう。デフォルトのプレイスホルダーのスタイルは薄い灰色で表示されますが、これはほとんどの背景色に対して低いコントラスト比です。視覚障害のあるユーザーであったり、屋外にいるなど明るさを調整することが難しい環境でフォームを利用するユーザーにとっては、プレイスホルダーのテキストが読みづらいことがあります。

また、プレイスホルダーが自動入力された値であるとユーザーの誤解を招く恐れもあります。

### 入力フォームの詳細な説明を関連付ける

`aria-describedby` 属性を使用して、入力フィールドに対して詳細な説明を提供できます。例えば、入力フィールドに対して入力する値の形式や、入力する値に対する制約などを説明するために使用できます。

```html
<label for="password">パスワード</label>
<input
  type="password"
  id="password"
  name="password"
  aria-describedby="password-description"
/>
<p id="password-description">
  8文字以上で、大文字と小文字を含む必要があります。
</p>
```

`aria-describedby` 属性の値は、関連付ける要素の `id` 属性の値を指定します。この例では、`<input>` 要素に対して `id` 属性の値が `password-description` である `<p>` 要素を関連付けています。

## フォームの入力エラーの内容をユーザーに伝える

入力フォームには何かしらの入力規則が存在することでしょう。入力規則に反する値はシステムによって受け付けられないため、ユーザーに適切なフィードバックを返すことが重要です。良くないフォームの例として、フォームの枠線が赤くなるだけでエラーメッセージが表示されないフォームがあります。何かフォームの入力に問題があることは伝わるかもしれませんが、ユーザーは具体的に何が問題なのかを理解できません。このようなフィードバックはユーザーに強いストレスを与える可能性があります。

また、このような色に依存した情報を提供することは、色覚異常のあるユーザーにとっても問題です。色覚異常のあるユーザーは、赤い枠線が表示されていることに気づかないかもしれません。

![](https://images.ctfassets.net/in6v9lxmm5c8/tRoAMAo2hPDqz1DTGw7JW/6dc9b239f8b75ce55fa1acd208e597f5/__________2024-03-10_16.30.58.png)

ユーザーに確実なフィードバックを返す方法は、HTML 標準の制約検証を使用することです。以下の方法は HTML の機能のみを利用してユーザーにフォームの入力エラーを伝えます。

- `<input>` の `type` 属性：`<input type="url">` や `<input type="email">` はそれぞれ URL やメールアドレスの形式に従っているかどうかを検証する
- 検証関連の属性
  - `required`：入力が必須であることを示す
  - `min`、`max`：数値の最小値、最大値を指定する
  - `pattern`：正規表現を使用して入力値の形式を検証する
  - `minLength`、`maxLength`：文字列の最小長、最大長を指定する
  - `step`：数値や日付の増分を指定する

HTML 標準の制約検証に違反した項目がある場合、サブミットボタンをクリックしたときにフォームが送信されず、ブラウザによりエラーメッセージが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7lw0tuBZBCpjMR9ltdDLv7/19b5c884e63c0434758cc3dd9166ad76/__________2024-03-10_16.42.27.png)

!> `maxLength` 属性はエラーメッセージを表示するのではなく単に指定された文字数以上、入力できなくなるという挙動であることに注意してください。ユーザーにとっては突然キーボードの入力が受けつけされなくなってしまったように感じるかもしれません。

HTML 標準の制約検証を利用するメリットとして、スクリーンリーダー等の支援技術を利用しているユーザーに対しての対応も実現できるという点があげられます。サブミットボタンをクリックした場合には、入力に違反している項目にフォーカスが移動し、エラーメッセージが読み上げられます。そのため、スクリーンリーダーを利用していたとしてもどの入力フォームに問題があるかを即座に理解できます。

また、例えば `required` 属性を使用している場合は「必須」と読み上げられる、フォームに違反している項目は「無効なデータ」と読み上げられるなど、フォームに関する適切な情報が提供されます。

### 独自のエラーフィードバックを提供する

HTML 標準の制約検証はアクセシビリティ上有益ですが、以下のような課題も存在します。

- エラーメッセージのスタイルを変更できない（ブラウザの実装によってスタイルが異なる）
- フィードバックを返すタイミングを制御できない
- メールアドレスの重複チェックなど、ブラウザの制約検証では実現できない検証がある

そのため現実には JavaScript を使用して独自のエラーフィードバックを提供することが多いでしょう。独自のエラーフィードバックを提供する際には以下の点に注意する必要があります。

- 入力フォームの `aria-invalid` 属性を使用して、エラーのある入力フォームをマークアップする
- 入力フォームの近くで具体的なフィードバックを提供し、`aria-describedby` 属性を使用して入力フォームと関連付ける
- エラーメッセージを表示する際には、ARIA ライブリージョンを使用してエラーメッセージが表示されたことをスクリーンリーダーに通知する

#### 入力フォームの `aria-invalid` 属性を使用して、エラーのある入力フォームをマークアップする

`aria-invalid` 属性は、入力フォームの値が無効であることを示すために使用します。フォームの検証に違反している場合には `aria-invalid` 属性の値を `true` に設定します。`aria-invalid` 属性を設定することにより、スクリーンリーダーを利用しているユーザーは現在の入力フォームに問題があることを知ることができます。

`aria-invalid` によるフィードバックはスクリーンリーダーを利用しているユーザーに対してのみ伝わる方法です。通常は視覚的なフィードバックも提供することが望ましいでしょう。

#### 入力フォームの近くで具体的なフィードバックを提供し、`aria-describedby` 属性を使用して入力フォームと関連付ける

ユーザーがどの項目に対して問題があるか離開できるように、入力フォームの近くで具体的なフィードバックを提供することが望ましいです。さらに、フォームのサブミット後にエラーメッセージを表示するのであれば、該当するフォームまでスクロール、またはフォーカスを移動するとよいでしょう。

またエラーメッセージ `aria-describedby` 属性を使用して入力フォームと関連付けるべきでしょう。

#### エラーメッセージを表示する際には、ARIA ライブリージョンを使用してエラーメッセージが表示されたことをスクリーンリーダーに通知する

[ARIA ライブリージョン](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/ARIA_Live_Regions) とは、ページを更新することなく動的に変更されたコンテンツをスクリーンリーダーを通じてユーザーに通知するための仕組みです。フォームの入力中やフォーカスを外したタイミングでフィードバックを返すのであれば、そのタイミングで変更を通知しなければフィードバックが気づかれないおそれがあります。

ライブリージョンは `aria-live` 属性を使用して宣言されます。`aria-live` 属性の値は以下の 3 つがあります。

- `off`：変更を通知しない
- `polite`：ユーザーの操作を妨げない範囲で変更を通知する
- `assertive`：即座に変更を通知する

通常は `aria-live="polite"` を使用するべきです。`polite` はユーザーがアイドル状態になったタイミングでスクリーンリーダーが通知を行います。`assertive` はスクリーンリーダーが現在読み上げている内容に割り込み通知を行います。そのため、`assertive` で頻繁に通知を行うとユーザーを混乱させたり煩わせる原因となります。

また以下の `role` は規定でライブリージョンのように振る舞います。

- `alert`：`aria-live="assertive"`
- `status`：`aria-live="polite"`
- `log`：`aria-live="polite"`
- `marquee`：`aria-live="off"`
- `timer`：`aria-live="off"`
- `progressbar`：`aria-live="off"`

ここまでの内容の実装例を React で示します。以下の例では入力フォームのフォーカスが外れたタイミングでメールアドレスの形式を検証し、エラーメッセージを表示します。

```tsx
import React, { useState, useId } from "react";

export const EmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleBlur = () => {
    if (!email.includes("@")) {
      setError("メールアドレスの形式が正しくありません");
    } else {
      setError("");
    }
  };

  const emailId = useId();
  const errorId = useId();

  return (
    <>
      <label htmlFor={emailId}>メールアドレス</label>
      <input
        type="email"
        id={emailId}
        name="email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={error ? "true" : "false"}
      />
      {error && (
        <div id={errorId} role="alert" aria-live="polite">
          {error}
        </div>
      )}
    </>
  );
};
```

## フォームをグループ化する

ラジオボタンやチェックボックスなどの入力フィールドは関連する項目同士をグループ化することで、コントロールを識別しやすくなります。ラジオボタンをグループ化するポイントは以下の 2 つです。

- 同じグループ内のラジオボタンは同じ名前を持つ
- `fieldset` 要素をまたは `role="radiogroup"` 属性を使用してグループ化する

ラジオボタンは同じ `name` 属性の値を持つ要素同士でグループ化され、グループ内で複数の値を選択できなくなります。JavaScript でラジオボタンの選択状態を管理しているような場合にはプログラムでグループ内で同時に 1 つの値しか選択できないように制御できるので、`name` 属性は忘れられがちです。

しかし、`name` 属性によるグループ化は値の排他的な選択だけでなく、キーボード操作やスクリーンリーダーにおいても重要です。`name` 属性によりグループ化されたラジオボタンは上下左右の矢印キーで項目間を移動できます。`name` 属性によるグループ化を忘れてしまうと、ユーザーは期待する操作を行うことができません。

スクリーンリーダーはラジオボタンの全体のグループの個数と、現在の項目の順序を「2/3」のように読み上げます。`name` 属性によるグループ化を行うことで、スクリーンリーダーを利用しているユーザーはグループの全体の個数を理解できます。

`fieldset` 要素を使用してラジオボタンをグループ化することで、視覚的にもグループ化されたことがわかりやすくなります。`fieldset` 要素は `legend` 要素を使用してグループのタイトルを提供できます。`legend` 要素はグループのタイトルを提供するために使用されますが、スクリーンリーダーを利用しているユーザーにはグループのタイトルが読み上げられます。

以下の例では、ラジオボタンのそれぞれの項目が「りんご、ラジオボタン、1/3、好きな果物、グループ」のように読み上げられます。

```html
<form>
  <fieldset>
    <legend>好きな果物</legend>
    <input type="radio" id="apple" name="fruit" value="apple" />
    <label for="apple">りんご</label>
    <input type="radio" id="orange" name="fruit" value="orange" />
    <label for="orange">みかん</label>
    <input type="radio" id="banana" name="fruit" value="banana" />
    <label for="banana">バナナ</label>
  </fieldset>
</form>
```

`<fieldset>` は入力フィールドのグループ化に有効な選択肢であるものの、`<legend>` 属性は `<fieldset>` 属性の直接の子要素でなければならないなど、使い勝手の悪い点もあります。`<fieldset>` と `<legend>` はスタイルを変更することが難しいため、デザインに合わせてスタイルを変更することが難しいです。

`role="radiogroup"` 属性を使用してラジオボタンをグループ化することもできます。`radiogroup` ロールは `aria-label` または `aria-lebelledby` 属性を使用してグループのアクセシブルな名前を提供する必要があります。通常は視覚的なタイトルと一致するように `aria-labelledby` 属性を使用することが望ましいでしょう。

```html
<form>
  <div role="radiogroup" aria-labelledby="fruit-group">
    <div id="fruit-group">好きな果物</div>
    <input type="radio" id="apple" name="fruit" value="apple" />
    <label for="apple">りんご</label>
    <input type="radio" id="orange" name="fruit" value="orange" />
    <label for="orange">みかん</label>
    <input type="radio" id="banana" name="fruit" value="banana" />
    <label for="banana">バナナ</label>
  </div>
</form>
```

## セマンティックなマークアップを使用する

ラジオボタンやチェックボックス、セレクトボックスといった入力フィールドはブラウザにより提供されるスタイルを大きくカスタマイズできません。そのため、サイトに合わせたスタイルを適用するためにはカスタムコントロールを作成することがよくあるでしょう。

カスタムコントロールを作成する際には、適切なロールやキーボード操作が必要です。例えば、ラジオボタンカスタマイズするために `<input type="radio">` 要素を `display: none` で非表示にしてしまうと、キーボード操作が損なわれたり、スクリーンリーダーを利用するユーザーがラジオボタンであると認識できなくなってしまいます。

元の入力フォームを非表示にしたい場合には、`.visually-hidden` もしくは `.sr-only` と呼ばれるパターンの CSS クラスを使用することが一般的です。これは、視覚的には非表示になりますが、スクリーンリーダーを利用しているユーザーには読み上げられるようになります。

```css
position: absolute;
width: 1px;
height: 1px;
padding: 0;
margin: -1px;
overflow: hidden;
clip: rect(0, 0, 0, 0);
white-space: nowrap;
border-width: 0;
```

コンボボックスのように標準のフォームコントロールでは実現できないお複雑なカスタムコントロールを作成する場合もあるでしょう。その場合には `role` 属性を使用して適切なロールを提供する、`aria-` 属性を使用して適切な状態を伝える、`role` に対応するキーボード操作を提供するなどの実装が必要です。

実装のヒントとして、ARIA Authoring Practices Guide (APG) の [patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) を参考にすると良いでしょう。[combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox.html) や [switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch.html) など、様々なカスタムコントロールの実装例とポイントが提供されています。

なお、カスタムコントロールの実装は複雑になりがちである上に、車輪の再発明になりがちです。すでに実装されているライブラリのコンポーネントを使用することをおすすめします。最近ではヘッドレスコンポーネントと呼ばれる、コンポーネントの機能のみを提供してスタイルは自由にカスタマイズできるライブラリが増えています。例えば React においては以下のようなライブラリがあげられます。

- [Radix UI](https://radix-ui.com/)
- [Headless UI](https://headlessui.dev/)
- [React Aria Component](https://react-spectrum.adobe.com/react-aria/getting-started.html)

## まとめ

- フォームには適切なラベルを提供する。`<label>` 要素はクリック可能な領域を拡大し、視覚的なテキストを表示するため、この要素を使用することが望ましい
- フォームのラベルとして、または説明をプレイスホルダーを使用することは避ける
- 入力フォームの詳細な説明を提供するために `aria-describedby` 属性を使用する
- フォームの入力エラーの内容をユーザーに伝えるために、HTML 標準の制約検証を使用する
- 独自のエラーフィードバックを提供する際には、以下の点に注意する
  - 入力フォームの `aria-invalid` 属性を使用して、エラーのある入力フォームをマークアップする
  - 入力フォームの近くで具体的なフィードバックを提供し、`aria-describedby` 属性を使用して入力フォームと関連付ける
  - エラーメッセージを表示する際には、ARIA ライブリージョンを使用してエラーメッセージが表示されたことをスクリーンリーダーに通知する
- ラジオボタンやチェックボックスといった入力フィールドは関連する項目同士をグループ化する
- カスタムコントロールを作成する際には、適切なロールやキーボード操作が必要。カスタムコントロールの実装は複雑になりがちであるため、すでに実装されているライブラリのコンポーネントを使用することをおすすめする

## 参考

- [Forms Tutorial | Web Accessibility Initiative (WAI) | W3C](https://www.w3.org/WAI/tutorials/forms/)
- [名前｜ウェブアクセシビリティ実践的用語集](https://zenn.dev/yusukehirao/books/1ec099b9717588/viewer/c263b8)
- [フォーム・コントロールのラベル付けの必要性 freeeアクセシビリティー・ガイドライン Ver.202403.0-RELEASE+4.3.7](https://a11y-guidelines.freee.co.jp/explanations/form-labeling.html#exp-form-labeling)
- [そのaria-labelは本当に必要ですか？ | アクセシビリティBlog |ミツエーリンクス](https://www.mitsue.co.jp/knowledge/blog/a11y/202305/31_0827.html)
- [入力フォームのプレースホルダーを使ってはいけない –U-Site](https://u-site.jp/alertbox/form-design-placeholders)