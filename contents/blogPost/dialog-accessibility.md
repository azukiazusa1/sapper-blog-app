---
id: 5TGGZDETuHgmscU2CjgB1d
title: "アクセシブルなダイアログに必要なこと"
slug: "dialog-accessibility"
about: "ダイアログをアクセシビルに実装するための要件を確認しましょう。"
createdAt: "2022-09-11T00:00+09:00"
updatedAt: "2022-09-11T00:00+09:00"
tags: ["アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4VeGrXphU0UryaCoxD3TOe/e9553a26d4eaee8ecd27cf13c9b6cd4c/andrijana-bozic-pvNwuzyV_CI-unsplash.jpg"
  title: "andrijana-bozic-pvNwuzyV CI-unsplash"
selfAssessment: null
published: true
---
- モーダル要素に `role="dialog"` と `aria-modal="true"` 属性を付与する
- モーダル要素に `aria-labelledby` と `aria-describedby` 属性を付与する
- キーボード操作を JavaScript で管理する

### モーダル要素に `role="dialog"` と `aria-modal="true"` 属性を付与する

[dialog ロール](https://www.w3.org/TR/2009/WD-wai-aria-20091215/roles#dialog) はウェブアプリケーションやウェブページのプライマリウィンドウの上に重なるダイアログをマークアップするために使用します。ダイアログは通常、オーバレーを使用してプライマリウィンドウの上に配置されます。ダイアログはダイアログ外のコンテンツともやりとり可能なノンモーダルと、ダイアログ内のコンテンツのみとやりとり可能なモーダルの 2 つに分類されます。

[alertdialog](https://w3c.github.io/aria/#alertdialog) ロールはユーザーの注意を身近重要なメッセージにそらすダイアログのために特別に設計されたダイアログロールです。

　`dialog` ロールでマークアップすると支援技術がダイアログのコンテンツをページコンテンツの残りの部分からグループ化けして識別するのに役立ちます。だたし、`role="dialog"` を追加するだけでは不十分です。以下の冒頭に上げたその他の要件も満たす必要があります。

ダイアログがモーダルである場合、`dialog` ロールとともに [aria-modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/) を `true` に設定する必要があります。`aria-modal` 属性は表示されちえる要素がモーダルであるかどうか示す属性です。　`aria-modal="true"` を付与すると支援技術がページ上の他のコンテンツと対話したりアクセスしたりするには、モーダルダイアログを閉じるかフォーカスを失う必要があることをユーザーに知らせるように支援技術者に指示します。これはモーダルが表示されているとき、モーダル要素以外に `aria-hidden="true"` を付与することと同じ役割を持ちます。

ただし、`aria-modeal` に対応していないスクリーンリーダーのために `aria-hidden` と `aria-modal` どちらも指定しておくのが無難です。

モーダルはその子孫要素だけを使って制御する必要があります。つまり「閉じるボタン」などモーダルを閉じるための要素は `aria-modal` 属性を付与した DOM の中に存在する必要があります。

ノンモーダルなダイアログには `aria-modale` を含まないようにします。

### モーダル要素に `aria-labelledby` と `aria-describedby` 属性を付与する

どのモーダルが表示されているか支援技術に伝えるために、ダイアログにラベルを付与する必要があります。ダイアログにタイトルが表示されている場合には `aria-labbeledby` 属性を使用してダイアログにラベルを付けることができます。ダイアログにタイトルが存在しない場合には `aria-label` 属性を使用してラベル付けします。

さらに、ダイアログがタイトル以外の説明テキストを含んでいる場合、`aira-describedby` 属性を使用してダイアログに関連付けることができます。

### キーボード操作

ダイアログはキーボードのフォーカス管理について特有の要件があり、JavaScript を使用してフォーカスを管理する必要があります。

- ダイアログは 1 つ以上のフォーカス可能な要素を持つべき
- ダイアログが画面に表示されたら、キーボードのフォーカスを、ダイアログ内のデフォルトのフォーカス可能なコントロールに移動する
  - Tab キーを押したら次のフォーカス可能な要素に移動する。ダイアログ内の最後のフォーカス可能な要素にフォーカスがある場合、ダイアログ内の最初のフォーカス可能な要素にフォーカスを移動する
  - Tab + Shift キーを押したら前のフォーカス可能な要素に移動する。ダイアログ内の最初のフォーカス可能な要素にフォーカスがある場合、ダイアログ内の最後のフォーカス可能な要素に移動する
- ダイアログが閉じられた後、キーボードフォーカスは、ダイアログに移動する前の位置に戻す
- ダイアログを移動やサイズ変更できる場合、マウスユーザーだけでなくキーボードユーザーもこれらの操作をできる必要がある
- モーダルダイアログの場合、ダイアログ外の要素にフォーカスさせない。ノンモーダルダイアログでは、開いているダイアログとメインページの間でフォーカスを移動できるグローバルなキーボードショートカットが必要

- Escape キーがクリックされたらダイアログを閉じる

## 参考

- [ARIA:dialogロール](https://developer.mozilla.org/ja/docs/Web/Accessibility/ARIA/Roles/dialog_role)
- [aria-modal](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-modal)
- [ARIA Authoring Practices Guide (APG) Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/)
- [ARIA Authoring Practices Guide (APG) Modal Dialog Example](https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/dialog)
- [モーダルウィンドウを考える](https://accessible-usable.net/2015/07/entry_150706.html)
