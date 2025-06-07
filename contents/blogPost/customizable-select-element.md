---
id: ENKjjKWhiMbhImIEI0u9o
title: "スタイルをカスタマイズ可能な新しい `<select>` 要素"
slug: "customizable-select-element"
about: "従来の `<select>` 要素は CSS を利用したスタイルを適用することができないため、多くの開発者にとって課題となっていました。この問題を解決するために新しい既存の `<select>` 要素をカスタマイズする手段が提案されました。この疑似要素を利用することで、開発者は `<select>` 要素のスタイルをカスタマイズをオプトインできるようになります。"
createdAt: "2024-09-21T11:59+09:00"
updatedAt: "2024-09-21T11:59+09:00"
tags: ["HTML", "CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1gSl8JnUUlLEqKFeUBFgVP/9d02b79e906461a34bab8ce1cc5f4102/sanma-shichirin_20705-768x729.png"
  title: "サンマと七輪のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "カスタマイズ可能な `<select>` 要素を利用するためにはどのような CSS を指定する必要があるか？"
      answers:
        - text: "appearance: base-select;"
          correct: true
          explanation: null
        - text: "appearance: custom-select;"
          correct: false
          explanation: null
        - text: "display: select;"
          correct: false
          explanation: null
        - text: "display: custom;"
          correct: false
          explanation: null
published: true
---
!> 2024/09/21 現在、カスタマイズ可能な `<select>` 要素は Chrome Canary の v130 以降で Experimental Web Platform Features フラグを有効にすることで利用可能です。

従来の `<select>` 要素は CSS を利用したスタイルを適用できないため、多くの開発者にとって課題となっていました。この課題を解決するために JavaScript を用いて独自のセレクトボックスを実装することが一般的ですが、この方法はアクセシビリティやパフォーマンスの問題を引き起こすことがありました。

この問題を解決するために新しい既存の `<select>` 要素をカスタマイズする手段が提案されました。`<select>` 要素と `::picker(select)` 疑似要素に対して `appearance:base-select` を指定することで、開発者は `<select>` 要素のスタイルをカスタマイズをオプトインできるようになります。

-> カスタマイズ可能な `<select>` 要素は以前は `<selectlist>` 要素として提案されていました https://azukiazusa.dev/blog/selectlist-element-for-a-more-customizable-select-box/ 。新しい要素を作成せずに既存の `<select>` 要素を拡張する理由は次のコメントで述べられています。https://github.com/whatwg/html/issues/9799#issuecomment-1789202391 https://github.com/whatwg/html/issues/9799#issuecomment-1926411811

## `<select>` 要素のカスタマイズを有効にする

カスタマイズ可能な `<select>` 要素を利用するためには、以下の CSS コードで新しい機能をオプトインする必要があります。

```css
select,
::picker(select) // オプションのポップアップを表す疑似要素
{
  appearance: base-select;
}
```

`appearance: base-select;` を指定することで、ブラウザや OS のデフォルトのスタイルを無効化し、共通のスタイルが適用されるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/71Rg1C48BsVmIgjNEYNZKV/da6db610a402192a67df5196df754a8a/__________2024-09-21_12.21.22.png)

`appearance: base-select;` を指定された状態では、ポップアップの文字色や背景色などを自由に変更できます。

```css
select,
::picker(select) {
  appearance: base-select;

  background-color: lightgray;
  color: red;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/2eIDgqY5gJ2kpkdiK5GJc7/e892e8488bf91233a9b99a7b49961e7d/__________2024-09-21_12.50.03.png)

カスタマイズ可能な状態になると、`<select>` 要素は以下の部品に分割され、それぞれの部品に対してスタイルを適用できます。

- `<button>`：ポップオーバーを開くボタン
- `<selectedoption>`：選択されたオプションのテキストを含む要素。ユーザーがオプションを選択するたびに、この要素のテキストが更新される
- `<option>::before`：オプションの前に挿入される要素。デフォルトでは現在チェックされているオプションを示すチェックマークが表示される
- `<option>:checked`：選択されたオプション
- `<option>`：ポップオーバーのオプション
- `::picker(select)`：ポップオーバー要素

`<button>` 要素はスロット要素として機能しており、`<select>` の最初の子要素として挿入された `<button>` 要素は自動でポップアップを開くボタンとして機能します。`<button>` 要素は省略することも可能です。

```html
<select>
  <button>
    <selectedoption></selectedoption>
  </button>
  <option>Apple</option>
  <option>Banana</option>
  <option>Cherry</option>
</select>
```

また `<select>` のカスタマイズを有効にすると、HTML パーサーの動作も変更されます。現在の HTML パーサーは `<select>` 要素の子孫に `<option>` もしくは `<optgroup>` 要素以外の要素が存在する場合、その要素をすべて削除します。`<select>` 要素がカスタマイズ可能な状態な場合には、`<select>` 要素の子孫にすべての要素が許可されるようになります。

## カスタマイズ可能な `<select>` 要素の例

### リッチなオプションの表示

カスタマイズ可能な `<select>` 要素を利用した例をいくつか紹介します。`<option>` 要素に対して任意の要素を挿入できるため、例えば `<img>` 要素を挿入してアイコンを表示できます。

```html
<select>
  <option><img src=".apples.png" alt="" /> Apple</option>
  <option><img src=".bananas.png" alt="" /> Banana</option>
  <option><img src=".cherries.png" alt="" /> Cherry</option>
</select>
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5GvgrTirODrSpq4w668v2h/a989e919a28a486085253a7049a1cab8/__________2024-09-21_12.58.58.png)

### ポップアップを開くボタンのカスタマイズ

`<selectedoption>` 要素を利用することで、現在選択中のオプションのテキストを表示できるため、ポップアップを開くボタンを自由にカスタマイズできます。

以下の例では、現在選択されているオプションの絵文字部分のみを表示するようにしています。これは `.description` クラスを持つ要素を非表示にすることで実現しています。

```html
<select>
  <button>
    <selectedoption></selectedoption>
  </button>
  <option>🐙 <span class="description">octopus</span></option>
  <option>🦑 <span class="description">squid</span></option>
  <option>🦐 <span class="description">shrimp</span></option>
</select>

<style>
  select,
  ::picker(select) {
    appearance: base-select;
  }

  selectedoption .description {
    display: none;
  }
</style>
```

![](https://images.ctfassets.net/in6v9lxmm5c8/5YGVCvxjiZq0oBqXczIoLX/8871bbbf8d8f75ea11e2eb831153bbee/__________2024-09-21_13.05.18.png)

### 選択されたオプションのチェックマーク

デフォルトでは、選択されたオプションの前にチェックマークが表示されます。このチェックマークは `option:checked::before` 疑似要素を利用して実装されているため、この疑似要素を非表示にすることでチェックマークを非表示にできます。

```css
option::before {
  display: none;
}
```

![](https://images.ctfassets.net/in6v9lxmm5c8/LEHZZ7dXyPijhKqBC1tfb/bf0fc37941825b40a00e3b7f2167aa12/__________2024-09-21_14.35.19.png)

ただし、ユーザーが選択済みのオプションを識別できるようにするために、チェックマークを非表示にした場合には代替スタイルを適用することが望ましいでしょう。詮索されているオプションにスタイルを適用するためには `:checked` 疑似クラスを利用します。

```css
option:checked {
  color: green;
}
```

### ポップアップのアニメーション

`::picker(select)` 要素に対してアニメーションを適用することで、ポップアップの表示をカスタマイズすることも可能です。疑似要素クラス `:open` を利用することで、ポップアップが開いたときのスタイルを、`:close` を利用することでポップアップが閉じたときのスタイルをそれぞれ指定できるので、トランジションを適用してアニメーションを実装できます。

```html
<select>
  <button>
    <selectedoption></selectedoption>
  </button>
  <option>🐙 <span class="description">octopus</span></option>
  <option>🦑 <span class="description">squid</span></option>
  <option>🦐 <span class="description">shrimp</span></option>
</select>

<style>
  select,
  ::picker(select) {
    appearance: base-select;
  }
  ::picker(select) {
    opacity: 0;
    transform: translateY(-0.5em);
    transition:
      opacity 0.5s,
      transform 0.3s;
  }

  select:open::picker(select) {
    opacity: 1;
    transform: translateY(0);
  }
</style>
```

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/77HlDdmPeftVEq9glc1eAA/5f3403461b38a00a42cdb0339e691002/_____2024-09-21_13.22.37.mov" controls></video>

### スプリットボタン

スプリットボタンとは、ボタンの一部をクリックするとポップアップが表示されるような UI パターンのことです。例えば GitHub の PR のマージボタンがスプリットボタンの一例です。ボタン部分をクリックすると即座にマージが実行されますが、ボタンの右側の三角形をクリックするとマージのオプションを選択するポップアップが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1OHOU64yiL4ppjjwASILns/743afd0eb37f42bee211822d3801b58f/__________2024-09-21_13.25.41.png)

追加のボタンと `selectedoptionelement` 属性を利用することで、スプリットボタンを実装できます。`selectedoptionelement` 属性は、`id` 属性を利用して `<select>` の外部に存在する `<selectedoption>` を紐づけます。紐づけられた `<selectedoption>` は、`<select>` 要素の選択されたオプションのテキストを表示するために利用されます。

```html
<div class="split-button">
  <button class="action-button">
    <selectedoption id="primary-button"></selectedoption>
  </button>
  <select selectedoptionelement="primary-button">
    <button>▼</button>
    <option>
      Create a merge commit
      <div class="description">
        All commits from this branch will be added to the base branch via a
        merge commit.
      </div>
    </option>
    <option>
      Squash and merge
      <div class="description">
        The 1 commit from this branch will be added to the base branch.
      </div>
    </option>
    <option>
      Rebase and merge
      <div class="description">
        The 1 commit from this branch will be rebased and added to the base
        branch.
      </div>
    </option>
  </select>
</div>

<style>
  select,
  ::picker(select) {
    appearance: base-select;
  }

  selectedoption .description {
    display: none;
  }

  .split-button {
    display: grid;
    grid-template-columns: 1fr auto;
  }

  .action-button {
    padding: 0.5em 1em;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #f8f8f8;
    color: #333;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  select:open::picker(select) {
    background-color: #fff;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0 0 4px 4px;
  }

  select button {
    padding: 0.5em;
    background-color: #f8f8f8;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 4px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    &:hover {
      background-color: #f0f0f0;
    }
  }

  select option {
    padding: 0.5em;
  }

  select option .description {
    font-size: 0.8em;
    color: #666;
    margin-left: 1.8em;
  }

  select option:checked {
    background-color: #f8f8f8;
  }

  select option:hover {
    background-color: #f0f0f0;
  }
</style>
```

![](https://images.ctfassets.net/in6v9lxmm5c8/6LYdt9FaYHN59HL5Hd3LaF/4c9e479718d9d9d1af81410fdd8baf90/__________2024-09-21_13.55.02.png)

## まとめ

- カスタマイズ可能な `<select>` 要素を利用するためには、`appearance: base-select;` を指定する
- カスタマイズ可能な `<select>` 要素を利用すると、`<select>` 要素の部品ごとにスタイルを適用できたり、子要素に任意の要素を挿入できる
- `<selectedoption>` 要素は選択されたオプションのテキストを表示するために利用される
- `:checked` 疑似クラスを利用することで、選択されたオプションにスタイルを適用できる
- `open` 疑似クラスを利用することで、ポップアップが開いたときのスタイルを指定できる
- `selectedoptionelement` 属性を利用することで、`<select>` 要素の外部に存在する `<selectedoption>` を紐づけることができる

## 参考

- [Request for developer feedback: customizable select  |  Blog  | Chrome for Developers](https://developer.chrome.com/blog/rfc-customizable-select)
- [Customizable Select Element (Explainer) | OpenUI](https://open-ui.org/components/customizableselect/)
