---
title: "仕事で役に立つかもしれないHTML5のマイナー要素"
about: "HTMLは書いたことがありますか？プログラミング初心者が最初の一歩として書き出すのに好まれる言語ですが、セマンティクスを追求すると奥深い言語だとわかります。タグの種類も数多くあり、全てを把握している人はそう多くなないでしょう。  今回は、そんなHTMLの普段の仕事では余り見かけないであろう要素を紹介していきます。"
createdAt: "2021-06-13T00:00+09:00"
updatedAt: "2021-06-13T00:00+09:00"
tags: ["html5"]
published: true
---
# はじめに

HTMLは書いたことがありますか？プログラミング初心者が最初の一歩として書き出すのに好まれる言語ですが、セマンティクスを追求すると奥深い言語だとわかります。タグの種類も数多くあり、全てを把握している人はそう多くなないでしょう。

今回は、そんなHTMLの普段の仕事では余り見かけないであろう要素を紹介していきます。

- time
- progress
- datelist
- dialog
- input type="color"
- input type="range"
- contentEdiable

# time

はじめは`<time>`タグです。見た目だけは、通常の`<span>`タグを使ったときと差はありません。`<time>`タグの仕事は、機会が判別可能な日付を記述することです。
通常、日付の表現方法は多岐に渡るので検索エンジンがそれを理解できるかどうかはわかりません。そこで、`datetime`属性に妥当な書式の値を渡すことで理解させます。

<iframe height="265" style="width: 100%;" scrolling="no" title="JjRoLXp" src="https://codepen.io/azukiazusa1/embed/JjRoLXp?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/JjRoLXp'>JjRoLXp</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

# progress

`<progress>`タグはタスクの進捗状況を表すために使用されます。
通常プログレスバーとして使用されます。

<iframe height="265" style="width: 100%;" scrolling="no" title="ZEpYxyK" src="https://codepen.io/azukiazusa1/embed/ZEpYxyK?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/ZEpYxyK'>ZEpYxyK</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

# datalist

`<datalist>`タグはフォームの入力で候補となるリストを表示します。
フォームの入力欄を`<input>`タグで作成し、その`<input>`タグの`list`属性の値と`<datalist>`タグのidの値を一致させることでデータを関連づけます。
データの一覧は`<option>`タグで作成します。

<iframe height="265" style="width: 100%;" scrolling="no" title="RwGNMxm" src="https://codepen.io/azukiazusa1/embed/RwGNMxm?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/RwGNMxm'>RwGNMxm</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

# dialog

ダイアログやモーダルはWebページで頻繁に利用されますが、`<dialog>`タグを使用すると、ダイアログやモーダルを簡単に実装することができます。

<iframe height="265" style="width: 100%;" scrolling="no" title="ExgaEJe" src="https://codepen.io/azukiazusa1/embed/ExgaEJe?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/ExgaEJe'>ExgaEJe</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

`<dialog>`要素をJavaScriptで取得すると、[HTMLDialogElement](https://developer.mozilla.org/ja/docs/Web/API/HTMLDialogElement)インターフェースが取得できます。このインターフェースは、以下のメソッドを持っています。

- close()
	- ダイアログを閉じます。
- open()
	- ダイアログをモードレスで開きます。つまり、ダイアログが開いている状態でも外のコンテンツに触れることができます。
- showModal()
	- ダイアログをモーダルで開きます。ダイアログが最前面に表示され、外のコンテンツに触れることができなくなります。

また、`<form>`タグに`method="dialog"`を指定すると、フォームが送信されたときにダイアログを閉じることができます。

`<dialog>`に属性`open`を指定すると、ダイアログがはじめから開いた状態になります。

<iframe height="265" style="width: 100%;" scrolling="no" title="dypPebB" src="https://codepen.io/azukiazusa1/embed/dypPebB?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/dypPebB'>dypPebB</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

# `<input type="color">`

`<input>`要素として`type="color"`を選択すると、カラーピッカーを表示させることができます。`value`として、16進数のカラーコードの値を受け取ります。

<iframe height="265" style="width: 100%;" scrolling="no" title="vYXEjEY" src="https://codepen.io/azukiazusa1/embed/vYXEjEY?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/vYXEjEY'>vYXEjEY</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

# `<input type="range">`

`<input>`要素として`type="range"`を選択すると、スライダー入力を提供してくれます。
視覚的には優れていますが、厳密な値を入力させるのには向かないでしょう。

<iframe height="265" style="width: 100%;" scrolling="no" title="QWKwrbM" src="https://codepen.io/azukiazusa1/embed/QWKwrbM?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/QWKwrbM'>QWKwrbM</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

# contentEditable属性

HTML要素にcontentEditable属性を指定すると、その要素が編集可能になります。
この属性はすべてのHTML要素に指定することが可能です。

<iframe height="265" style="width: 100%;" scrolling="no" title="bGwNMVq" src="https://codepen.io/azukiazusa1/embed/bGwNMVq?height=265&theme-id=dark&default-tab=html,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/azukiazusa1/pen/bGwNMVq'>bGwNMVq</a> by azukiazusa1
  (<a href='https://codepen.io/azukiazusa1'>@azukiazusa1</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

