---
id: bLqFPpwjLTQlrVU-U5BgN
title: "よりカスタマイズ可能なセレクトボックスを実現する `selectlist` 要素"
slug: "selectlist-element-for-a-more-customizable-select-box"
about: "`<selectlist>` 要素は、デザインをカスタマイズできなかった従来の `<select>` 要素の問題を解決するために Open UI グループにより提案されている要素です。`<selectlist>` の構成要素の多くはスロットとして提供されていて、高いカスタマイズ性を備えているのが特徴です。"
createdAt: "2023-10-07T16:46+09:00"
updatedAt: "2023-10-07T16:46+09:00"
tags: ["HTML"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/gY5tjBwUAnQVOYk51hh8Q/e169b20088791c364a1e3221400318a1/matsutake_kinoko_illust_1042.png"
  title: "松茸のイラスト"
audio: null
selfAssessment: null
published: true
---
!> `<selectlist>` 要素は 2023 年 10 月 7 日現在 Chrome Canary の Experimental Web Platform features flag を有効にした場合のみ使用できる実験的な機能です。この記事の内容は将来変更されるおそれがあります。

## `<selectlist>` 要素とは

`<selectlist>` 要素は [Open UI](https://open-ui.org/) グループにより提案されている、よりカスタマイズ可能なセレクトボックスです。従来の `<select>` 要素には開発者がデザインを自由にカスタマイズできないという問題がありました。そのため、`<select>` と `<option>` 要素を使わない独自のセレクトボックスが多くの Web サイトで利用されています。開発者により独自に実装されたセレクトボックスは、パフォーマンス、アクセシビリティ、信頼性の低下を引き起こすおそれがあります。

この問題を解決するために、`<selectlist>` 要素が提案されています。`<selectlist>` 要素は様々な疑似要素を提供することによって、開発者が自由にデザインをカスタマイズできるように設計されています。また、`<selectlist>` 要素は従来の `<selectlist>` と [Combobox Pattern | APG | WAI | W3C](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) にインスパイアされたキーボード操作を提供しており、JavaScript を用いずともアクセシブルな実装が可能です。

## selectlist の構成

`<selectlist>` 要素は以下要素から構成されています。

- `<selectlist>`：ボタンとリストボックスを含むルート要素。
- ボタンスロット：リストボックス開閉するボタン。この要素が開発者により提供されない場合、`<selectlist>` 要素はボタンを自動的に生成します。
  - `<button type="selectlist">`：クリックされたときにリストボックスを開閉するボタン。`type="selectlist"` 属性はブラウザに対してこのボタンがリストボックスを開くためのボタンであることを伝えます。
  - `<selectedoption>`：現在選択されているオプションのテキストを表示する。ユーザーがオプションを選択するたびに、ブラウザによってこの要素のテキストが更新されます。
- `<listbox>`：`<option>` と `<optgroup>` 要素を含むコンテナ要素。この要素が開発者により提供されない場合、`<selectlist>` 要素はリストボックスを自動的に生成します。この要素は CSS の最上位レイヤー（[Top layer](https://developer.mozilla.org/en-US/docs/Glossary/Top_layer)）に配置されます。
  - `<option>`：1 つ以上の選択可能なオプションを表す。
  - `<optgroup>`：`label` 属性により `<option>` 要素をグループ化する。

![](https://images.ctfassets.net/in6v9lxmm5c8/7bVLxEPCEhZy8c4xxaRnBX/463002bfbb64a1b745ea85b73f6f4a87/__________2023-10-07_18.07.44.png)

https://open-ui.org/components/selectlist/#anatomy-of-the-selectlist-element より引用。

このように、`<selectbox>` 要素の構成要素は多くの部分が [Web コンポーネントのスロット](https://developer.mozilla.org/ja/docs/Web/API/Web_components/Using_templates_and_slots#%E3%82%B9%E3%83%AD%E3%83%83%E3%83%88%E3%81%AB%E3%82%88%E3%82%8B%E6%9F%94%E8%BB%9F%E6%80%A7%E3%81%AE%E5%BC%B7%E5%8C%96)によく似ている API として提供されているという特徴があります。これによりデフォルトのマークアップを置き換えパーツを拡張したり順番を並び替えたりするなど、高いカスタマイズ性を備えています。

## selectlist の実装例

それではいくつかの `<selectlist>` 要素を使用した実装例を紹介します。このコードは 2023 年 10 月 7 日現在 Chrome Canary の Experimental Web Platform features flag を有効にした場合のみ動作します。

### シンプルなセレクトボックス

まずは最もシンプルなセレクトボックスです。従来の `<select>` 要素と同様に、`<selectlist>` 要素の配下に `<option>` 要素を配置することでセレクトボックスを作成できます。

```html
<selectlist>
  <option>りんご</option>
  <option>バナナ</option>
  <option>ぶどう</option>
</selectlist>
```

selectlist の構成で紹介した通り、ボタンスロットと `<listbox>`　要素を省略した場合には、`<selectlist>` 要素は自動的にボタンとリストボックスを生成します。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/aFS4XXQ8SPvhVf3RoDe4g/a3d97cdea97a31c2896583e9ee302dbe/_____2023-10-07_18.13.57.mov"></video>

### selectlist のスタイリング

続いて `<selectlist>` 要素に CSS を適用してデザインをカスタマイズしてみましょう。`<selectlist>` 要素は以下の擬似要素または擬似クラスを提供しています。これらを用いることで、`<selectlist>` により自動で生成された要素に対してもスタイリングを適用できます。

- `::button`：ボタンスロットに適用される擬似要素。
- `::listbox`：`<listbox>` 要素に適用される擬似要素。
- `::marker`：ドロップダウンの矢印に適用される擬似要素。
- `::selectedoption`：`<selectedoption>` 要素に適用される擬似要素。
- `:open`：リストボックスが開いているときに `<selectlist>` 要素に適用される擬似クラス。
- `:closed`：リストボックスが閉じているときに `<selectlist>` 要素に適用される擬似クラス。

2023 年 10 月 7 日現在、これらの疑似要素はまだ提供されていないようですので、`<selectlist>` による自動生成される要素のかわりに、独自のマークアップを用いて実装してみましょう。

!> [デモ](https://microsoftedge.github.io/Demos/selectlist/index.html) においては、[::part() 疑似要素](https://developer.mozilla.org/ja/docs/Web/CSS/::part) を用いてスタイリングを行っている実装も見られました。

```html
<selectlist>
  <button type="selectlist">
    <label>好きなフルーツ</label>
    <selectedoption></selectedoption>
  </button>
  <listbox>
    <option>りんご</option>
    <option>バナナ</option>
    <option>ぶどう</option>
  </listbox>
</selectlist>

<style>
  selectlist button {
    display: flex;
    flex-direction: column;
    width: 200px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
  }

  selectlist selectedoption {
    font-size: 24px;
    font-weight: bold;
  }

  selectlist listbox {
    border: dodgerblue 1px solid;
    box-shadow: 12px 12px 2px 1px rgba(0, 0, 255, 0.2);
    margin-top: 4px;
  }

  selectlist option {
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }

  selectlist option:hover {
    background-color: #eee;
  }

  /* 
   * :checked は現在選択されているオプションを表す擬似クラスです。
   * multiple をサポートするために :selected ではなく :checked が使用されている。
   * https://github.com/openui/open-ui/issues/827
   */
  selectlist option:checked {
    background-color: dodgerblue;
    color: #fff;
  }
</style>
```

次のようにスタイルが適用されていることがわかります。

<video controls src="https://videos.ctfassets.net/in6v9lxmm5c8/v3PwctVs6P1lb5SHkWxfc/08ebd8d9893a4d65516ec74c1251ecc3/_____2023-10-07_19.42.57.mov"></video>

### コンボボックス

より高度な実装例として、コンボボックスを作成してみましょう。コンボボックスは、ユーザーが入力したテキストに一致するオプションをリストボックスに表示するセレクトボックスです。

コンボボックスを実装するためにはちょっとした JavaScript の実装も必要です。ですが、`<selectlist>` を使わずにゼロから実装するよりは簡単ですし、キーボード操作といったアクセシビリティを考慮した部分も `<selectlist>` により提供されているので、負担も少ないでしょう。

```html
<selectlist class="combobox">
  <listbox>
    <input type="search" />
    <div class="listbox-options" tabindex="-1">
      <option>apple</option>
      <option>banana</option>
      <option>orange</option>
      <option>pineapple</option>
      <option>strawberry</option>
    </div>
  </listbox>
</selectlist>

<script>
  const combobox = document.querySelector(".combobox");
  const listbox = combobox.querySelector("listbox");
  // すべての選択可能なオプションのリスト
  const options = [...listbox.querySelectorAll("option")].map(
    (option) => option.textContent,
  );
  const optionsContainer = listbox.querySelector(".listbox-options");
  const input = combobox.querySelector("input");

  // リストボックスが開閉したときのイベント
  listbox.addEventListener("toggle", (e) => {
    // リストボックスが開いたとき
    if (e.newState === "open") {
      input.focus();
    }
  });

  input.addEventListener("input", (e) => {
    // 一旦すべてのオプションを削除
    optionsContainer.innerHTML = "";

    // input の値に一致するオプションをフィルタリング
    const value = e.target.value.toLowerCase();
    const filteredOptions = options.filter((option) => option.includes(value));

    // フィルタリングした結果がない場合は、"No results found" を表示
    if (filteredOptions.length === 0) {
      const optionElement = document.createElement("option");
      optionElement.textContent = "No results found";
      optionsContainer.appendChild(optionElement);
    } else {
      // フィルタリングした結果を表示
      filteredOptions.forEach((option) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionsContainer.appendChild(optionElement);
      });
    }
  });
</script>
```

次のように、簡単な JavaScript の実装でコンボボックスを作成できました。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/59p20UjZvfyD42vdUoIDZs/6f38c9a58848af6ea22499c877e1a09f/_____2023-10-07_20.25.17.mov" controls></video>

## まとめ

- `<selectlist>` 要素は `<select>` 要素の、カスタマイズ性の低さを解決するために Open UI グループにより提案されている要素
- `<selectlist>` の多くの要素はスロットとして提供されており、開発者が明示的に実装を提供しない場合には、ブラウザによって自動的に生成される
- `<selectlist>` により提供されている様々な疑似要素を用いることで、開発者が自由にデザインをカスタマイズできる

## 参考

- [Selectlist Element (Explainer) | Open UI](https://open-ui.org/components/selectlist/)
- [Open UI's selectlist demos](https://microsoftedge.github.io/Demos/selectlist/index.html)
