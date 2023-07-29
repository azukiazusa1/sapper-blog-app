---
id: A6AXu5dXNRaXzjIBzGT9P
title: "グラフのアクセシビリティについて考える"
slug: "graph-accessibility"
about: "`<canvas>` や `<svg>` 要素で描画されたグラフは、スクリーンリーダーを使用するユーザーにとって内容を正しく理解することが難しいです。この記事では、グラフの内容をスクリーンリーダーを使用するユーザーに伝える方法について考えてみます。"
createdAt: "2023-07-29T17:19+09:00"
updatedAt: "2023-07-29T17:19+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2wU8OGC4USfW6p0wP3Nafz/a9c2a6b42034cebaa570cfe963988943/graph_fukugou_illust_3678.png"
  title: "折れ線の複合グラフのイラスト"
published: true
---
[Chart.js](https://github.com/chartjs/Chart.js) や [d3.js](https://github.com/d3/d3) などのライブラリを使用することで、手軽にグラフを作成できます。しかし、これらのライブラリはデフォルトではアクセシビリティに対応する機能を提供していないので、実装者が意識して対応する必要があります。

Chart.js と d3.js はそれぞれ `<canvas>` と `<svg>` を使用してグラフを描画します。`<canvas>` 要素に対してスクリーンリーダーがアクセスできません。そのため、スクリーンリーダーを使用するユーザーにとっては、グラフの内容を理解できません。`<svg>` 要素についても同様にグラフとして認識させるのは難しいでしょう。

この記事では、Chart.js を例にスクリーンリーダーに対応したグラフを作成する方法を考えてみます。

Chart.js を用いてグラフを作成したコードは以下のようになります。

```tsx:Graph.tsx
import { Chart, registerables } from "chart.js";
import React, { useEffect, useRef } from "react";

Chart.register(...registerables);

const labels = [
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];
const datasets = [
  {
    label: "東京",
    data: [
      4.9, 5.2, 10.9, 15.3, 18.8, 23.0, 27.4, 27.5, 24.4, 17.2, 14.5,
      7.5,
    ],
  },
  {
    label: "札幌",
    data: [
      -3.2, -2.2, 2.6, 9.1, 14.9, 16.8, 23.1, 22.7, 19.8, 12.6, 7.1,
      -1.4,
    ],
  },
]

export const Graph: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current === null) {
      return;
    }

    const chart = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: "2022年の日平均気温の月平均値（℃）",
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div
      style={{
        width: 800,
        height: 600,
      }}
    >
      <canvas ref={chartRef} />
    </div>
  );
};
```

## `<canvas>` 要素を `role="img"` としてグラフの概要を代替テキストとして指定する

始めに最もシンプルな方法から考えてみましょう。`<canvas>` に `role="img"` を付与することで、スクリーンリーダーが `<canvas>` を画像として認識するようになります。画像として認識された `<canvas>` に対して `aria-label` で代替テキストをとしてグラフの概要指定することで、スクリーンリーダーがグラフのとして理解できるようになります。

```tsx:Graph.tsx
<canvas
  ref={chartRef}
  role="img"
  aria-label="2022年の日平均気温の月平均値（℃）のグラフ"
/>
```

VoiceOver で確認すると、「2022 年の日平均気温の月平均値（℃）のグラフ、イメージ」と読み上げられるようになりました。

![VoiceOver でグラフが読み上げられる様子](https://images.ctfassets.net/in6v9lxmm5c8/22xR9TH1p6k1TN8dXEmMYb/9bcfa2e834e66e40fa5ba9f3a04e596a/____________________________2023-07-29_18.20.42.png)

## グラフのデータを代替テキストとして指定する

グラフの概要を代替テキストとして指定することで、スクリーンリーダーにより何も読み上げられない状況よりも良い状況になりました。しかし、グラフの概要を読み上げるだけでは、グラフの内容を理解できません。グラフを閲覧するユーザーにとっては、グラフがどのようなデータを提供しているかに興味があるはずです。

次は代替テキストとしてグラフのデータを指定してみましょう。グラフのデータは `datasets` に格納されているので、これを文字列に変換して指定します。

```tsx:Graph.tsx
/**
 * 東京の平均気温は、1月は4.9℃、2月は5.2℃、... のような文字列を作る
 */
const datasetsText = datasets.reduce((acc, dataset) => {
  return `${acc} ${dataset.label}の平均気温は、${dataset.data.reduce(
    (acc, data, index) => {
      return `${acc} ${labels[index]}は${data}℃、`;
    },
    ""
  )}です。`;
}, "");
```

このテキストは `aria-label` として指定してもよいのですが、代替テキストの読み上げが長くなりすぎてしまうという問題があります。`aria-label` に指定するテキストは `<img>` に指定する `alt` 属性と同様に簡潔であるべきです。より詳細な情報を提供する場合には `aria-describedby` を使用するのが良いでしょう。`aria-describedby` に指定した要素の内容は `description` としてアクセシビリティツリーから公開されます。VoiceOver の場合には `description` の内容は `aria-label` などで指定した「アクセシブルな名前」が読み上げられてから一拍置いて読み上げられます。そのため、スクリーンリーダーを利用するユーザーは「アクセシブルな名前」で概要を理解したあとに、より詳細な情報を読み上げるかどうかを判断できます。

`aria-describedby` は `id` で要素を指定して、要素の内容を `description` として公開します。そのためテキストを表示するための要素を追加して `id` を指定する必要があります。

```tsx:Graph.tsx
<canvas
  ref={chartRef}
  role="img"
  aria-label="2022年の日平均気温の月平均値（℃）のグラフ"
  aria-describedby="chart-description"
>

<p id="chart-description">
  {datasetsText}
</p>
```

基本的には青眼のユーザーに対しても同一の情報を提供するために、`aria-describedby` で公開する要素は視覚的にも表示されるのが好ましいです。しかし、スペースの都合などで詳細なテキストを表示するのが難しい場合もあるでしょう。このようにスクリーンリーダーにのみ情報を公開したい要素に対しては、下記のような `.sr-only` のようなクラスを用意しておくと便利です。`display: none;` などのスタイルで非表示にした場合、スクリーンリーダーからも読み上げられなくなってしまいます。

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

`aria-describedby` 詳細なグラフのデータをテキストして指定した結果、以下のように読み上げられるようになりました。

![グラフをスクリーンリーダーで読み上げられている様子。「東京の平均気温は、 1月は4.9℃、 2月は5.2℃、 3月は10.9℃、 4月は15.3℃、 5月は18.8℃、 6月は23℃、 7月は27.4℃、 8月は27.5℃、 9月は24.4℃、 10月は」と VoiceOver のダイアログに表示されている。](https://images.ctfassets.net/in6v9lxmm5c8/1rFi0iKMPT4rZV2II4v2zS/cc1918475c28861001e22bcc30a471e4/____________________________2023-07-29_18.52.52.png)

## グラフのデータをテーブルとして表示する

グラフのデータを `aria-describedby` で公開することで、グラフの内容を理解できるようになりました。ですが、グラフのデータは平坦なテキストとなったことで、認知負荷が高くなってしまっています。例えば、「札幌の 8 月の平均気温」が知りたい場合でも、テキストを最初から最後までひととおり読み上げる必要があります。また、グラフにどのくらいの量のデータが含まれているかも把握できません。

解決策として、テキストを構造化した形式で提供することが考えられます。`<table>` 要素を使用してグラフのデータを表示することで、グラフのデータを構造化した形式で提供できます。

```tsx:Graph.tsx
<canvas
  ref={chartRef}
  role="img"
  aria-label="2022年の日平均気温の月平均値（℃）のグラフ"
/>
<table>
  <caption>
      2022年の日平均気温の月平均値（℃）
  </caption>
  <thead>
      <tr>
      {labels.map((label) => (
          <th key={label}>{label}</th>
      ))}
      </tr>
  </thead>
  <tbody>
      {datasets.map((dataset) => (
      <tr key={dataset.label}>
          <th scope="row">{dataset.label}</th>
          {dataset.data.map((data) => (
          <td key={data}>{data}</td>
          ))}
      </tr>
      ))}
  </tbody>
</table>
```

上記の `<table>` を実装する際には、以下の 3 つの工夫をしています。

- `<caption>` でテーブルの概要を指定する
- `<th>` 要素で見出しを指定する
- `<th scope="col">` で列の見出しを指定する

### `<caption>` でテーブルの概要を指定する

`<caption>` 要素はテーブルの説明を提供するために使用します。青眼のユーザーにとってももちろん便利なのですが、スクリーンリーダーにとってテーブルの詳細なデータを読み取るかどうか決定するために頼りになるため、特に重要です。特に 1 つのページ内に複数のテーブルが存在する場合には、テーブル同士を区別するための重要な情報となります。

VoiceOver でテーブルにフォーカスを当てると、テーブルの概要として `<caption>` の内容と、テーブルの行数と列数が読み上げられます。

![スクリーンリーダーでテーブルにフォーカスが当たっている様子。VoiceOver のダイアログには「2022年の平均気温の月平均値（℃）、ひょう、13列、3行」と表示されている](https://images.ctfassets.net/in6v9lxmm5c8/6ycmTaBQ5cWOT2l99W7FPi/ca56e8c95c6767ee5fe32215065e6bbd/____________________________2023-07-29_20.22.43.png)

注意点として、`<caption>` は必ず `<table>` の最初の子要素として配置する必要があります。

### `<th>` 要素で見出しを指定する

`<th>` 要素はテーブルの見出してして使用されます。テーブルの見出しはスクリーンリーダーにとって特に重要です。テーブルの見出しがない場合、テーブルのセルを読み上げる際に、単にセルの値だけを読み上げるのでどの列のデータを読み上げているのかがわかりにくくなってしまいます。

`<th>` 要素によってテーブルの見出しが設定されている場合、スクリーンリーダーはテーブルのセルの内容を読み上げる際に、セルの値と、セルに対応する見出しを関連付けて読み上げるようになります。

![スクリーンリーダーでテーブルのセルにフォーカスが当たっている様子。VoiceOver のダイアログには「4月 10.9、列 4/13」と表示されている](https://images.ctfassets.net/in6v9lxmm5c8/3pprCJ1qmzyp6VoE0jeT25/a550cbb90262bc75ab1e2a34d16131c4/____________________________2023-07-29_20.23.44.png)

### `<th scope="row">` で行の見出しとしてを指定する

テーブルの構造によっては、行の見出しと列の見出しが必要になる場合があります。グラフのデータをテーブルとして表示する場合にはまさに当てはまるでしょう。今回のグラフの場合には、列の見出しとして月を、列の見出しとして地域が必要になります。

<table>
  <thead>
    <tr>
      <th>1月<th>
      <th>2月<th>
      <th>3月<th>
    </tr>
  </thead>
  <tbody>
    <tr>
    <th scope="row">東京<th>
    <td>4.9<td>
    <td>5.2<td>
    <td>10.9<td>
    </tr>
    <tr>
    <th scope="row">札幌<th>
    <td>-3.2<td>
    <td>-2.2<td>
    <td>2.6<td>
    </tr>  
  </tbody>
</table>

`<th>` 要素に `scope` 属性が指定されていない場合、ブラウザは自動的に列に対応する見出しか行に対応する見出しかを判断します。場合によっては正しく見出しが関連付けられない恐れがあるので、`scope` 属性を指定して明示的に見出しの関連付けを行うようにしています。`scope` 属性は以下の　 4 つの値を指定できます。

- `row`：行の見出しとして指定する
- `col`：列の見出しとして指定する
- `rowgroup`：行グループの見出しとして指定する
- `colgroup`：列グループの見出しとして指定する

### その他の考慮事項

その他テーブルを使用する利点として、スクリーンリーダーを使用している場合テーブルは上下左右のカーソルキーで移動できるので、情報を得たいデータに対して素早く移動できることがあげられます。

また、`aria-describedby` で詳細なテキストを指定する場合に議論したように、基本的には青眼のユーザーに対しても同等の情報を提供できるように、テーブルは視覚的にも表示されるのが好ましいです。スペースの都合上でテーブルを表示するのが難しい場合には同様に `.sr-only` のようなクラスを指定するとよいでしょう。ただし、`<table>` のデフォルトのスタイルである `display: table;` は `width` の指定が効かないため注意が必要です。`<table>` に `display: block;` を指定することで、`width` の指定が効くようになり `width: 1px` として視覚的に表示されないようになります。

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

その他の手段として、`<detail>` 要素を使用してテーブルを折りたたみ/展開可能にするという方法も考えられます。

## まとめ

- `<canvas>` や `<svg>` で描画されたグラフはスクリーンリーダーにとって内容を正しく理解することが難しい
- `<canvas>` に `role="img"` を指定することで、`aria-label` で代替テキストを指定することでスクリーンリーダーがグラフの概要を理解できるようになる
- グラフの詳細なデータは `<table>` で表示することで、グラフの内容を理解できるようになる

## 参考

- [グラフや図解の説明テキスト](https://accessible-usable.net/2018/08/entry_180804.html)
- [table 要素内に th 要素が必要な理由](https://www.mitsue.co.jp/knowledge/blog/a11y/202303/20_1144.html)
- [HTML 表の高度な機能とアクセシビリティ](https://developer.mozilla.org/ja/docs/Learn/HTML/Tables/Advanced)
