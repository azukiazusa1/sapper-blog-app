---
id: JoEoXnV0hiW86xQhOD-ub
title: "カード UI の入れ子のリンクの問題を解決する Link Area Delegation の提案"
slug: "link-area-delegation-proposal"
about: "多くのウェブサイトではリンクを入れ子にしたカード UI が利用されています。しかし、このような UI では HTML 仕様に違反していたり、ハッキーな手法で実装されていることがあります。Open UI コミュニティでは Link Area Delegation という提案を行っており、標準化された方法で入れ子のリンクを実装することで UX やアクセシビリティを損なうことを防ぐことを目的としています。この記事では Link Area Delegation の内容について紹介します。"
createdAt: "2024-12-21T10:30+09:00"
updatedAt: "2024-12-21T10:30+09:00"
tags: ["Open UI", "アクセシビリティ"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4B5sL7jJG1YvPKE42Cx2V3/4c628857bcebdd5589a115bde1517c93/cute-tonakai_20958-200x200.png"
  title: "走っているトナカイのイラスト"
selfAssessment:
  quizzes:
    - question: "HTML 属性を使用したアプローチで使われる 2 つの属性は何か？"
      answers:
        - text: "linkarea, defaultlink"
          correct: true
          explanation: ""
        - text: "contain, expand"
          correct: false
          explanation: ""
        - text: "container, delegate"
          correct: false
          explanation: ""
        - text: "linkcontainer, delegatedlink"
          correct: false
          explanation: ""
    - question: "CSS を使用したアプローチで使われるプロパティは何か？"
      answers:
        - text: "pointer-area"
          correct: true
          explanation: ""
        - text: "pointer-events"
          correct: false
          explanation: ""
        - text: "link-area"
          correct: false
          explanation: ""
        - text: "clickable-area"
          correct: false
          explanation: ""

published: true
---

多くのウェブサイトではリンクを入れ子にしたカード UI が利用されています。入れ子されたリンクとは以下のようなものです。

![](https://images.ctfassets.net/in6v9lxmm5c8/37LDyA9SoRRRXUG6UE7vo7/1b708244392e67d40cf04bd86e4c280d/__________2024-12-21_10.39.02.png)

このような UI ではカード全体をクリックした場合にはカードのリンク先に遷移し、カード内のタグをクリックした場合にはタグのリンク先に遷移するという挙動が期待されます。この挙動を簡単に HTML で実装すると、以下のように `<a>` 要素が入れ子になります。

```html
<a href="/new-product" 　class="card">
  <a class="tag" href="/tag/tech">Tech</a>
  <div>
    <h2>New Product</h2>
    <p>...</p>
  </div>
</a>
```

しかし、このようにインタラクティブな要素（`<a>` や `<button>` など）の子要素にインタラクティブな要素を配置することは HTML 仕様上許可されていません[^1]。現状多くのブラウザではこのようにインタラクティブな要素の入れ子を許容しているものの、将来的に仕様に準拠して無効になる可能性も否定できません。

このような HTML 仕様違反の問題を避けるために、CSS や JavaScript を用いてクリック領域を拡張するような少々ハッキーな手法が用いられていました。

- ネストされたリンクを `::before` 疑似要素とし、それを親要素全体に広げる
- 親要素がクリックされたときに JavaScript でリンク先に遷移する

しかし、このような手法は標準化された方法ではなく、UX やアクセシビリティの観点で問題が生じる恐れがあります。

- CSS を用いた手法では、内部が擬似要素で覆われているためテキストを選択できない
- JavaScript を用いた手法では、キーボードやスクリーンリーダーでの操作が困難。また新しいタブで開く、リンク先をコピーすると行った標準的なリンクの挙動が期待できない

入れ子にされたリンクという、現在のウェブサイトでは一般化された UI パターンを標準的な方法で実装するために、[Open UI](https://open-ui.org/) コミュニティでは Link Area Delegation という提案を行っています。この記事では Link Area Delegation 内容について紹介します。

## Link Area Delegation の概要

この提案を端的に説明すると「コンテナ要素のインタラクティブな領域を子孫のリンク要素に委任する」というものです。この提案を導入することにより、HTML に仕様に違反した方法や CSS や JavaScript を用いたハッキーな手法により UX やアクセシビリティを損なうことを防ぐことを目的としています。

Link Area Delegation でぇあ以下のような挙動が期待されます。

- コンテナ要素をクリックしたときのアクションは、子孫のリンク要素をクリックした場合と同等になる
- コンテナ要素のコンテキストメニューの動作は、子孫のリンク要素のコンテキストメニューの動作によって拡張される（新しいタブで開く・リンク先をコピーするなど）
- ユーザーエージェントにより子孫のリンクの領域を拡張子、カードのクリックよりも優先される（[Understanding Success Criterion 2.5.8: Target Size (Minimum) | WAI | W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) に関連）
- キーボード操作には影響を与えずに、コンテナ要素のセマンティクスにも影響しない
- アクセシビリティツリーに公開されない

現在はいくつのアプローチが提案されていて検討されている段階です。それぞれのアプローチについて詳しく見ていきましょう。

1. Link delegation attributes
2. a new element type
3. CSS instead of HTML
4. Use Invokers

### Link delegation attributes

Link delegation attributes は `linkarea` と `defaultlink` という 2 つの属性を導入するアプローチです。HTML 例は以下のようになります。

```html
<div class="card" linkarea>
  <a class="tag" href="/tag/tech">Tech</a>
  <div>
    <h2>
      <a href="/new-product" defaultlink>New Product</a>
    </h2>
    <p>...</p>
  </div>
</div>
```

上記の例ではカードのコンテナである `<div>` 要素に `linkarea` 属性を追加しています。この要素をクリックすると、`defaultlink` 属性を持つ最初の子孫要素に委任（delegation）されます。

代替手段として、`linkarea` 属性の値に ID を指定することも可能です。

```html
<div class="card" linkarea="new-product">
  <a id="tech" class="tag" href="/tag/tech">Tech</a>
  <div>
    <h2>
      <a id="new-product">New Product</a>
    </h2>
    <p>...</p>
  </div>
</div>
```

この例では ID で指定するリンク要素は必ずカードの子孫である必要があります。

### a new element type

新しい要素型を導入するアプローチでは、`<linkarea>` 要素を導入します。先程の例と同じように `defaultlink` 属性を持つ子孫要素にリンクの委任が行われます。

```html
<div class="card">
  <linkarea>
    <a class="tag" href="/tag/tech">Tech</a>
    <div>
      <h2>
        <a href="/new-product" defaultlink>New Product</a>
      </h2>
      <p>...</p>
    </div>
  </linkarea>
</div>
```

この方法は `linkarea` 属性を使用する場合と比較して柔軟性の観点で望ましくないと指摘されています。例としてテーブルの行全体をリンクにしたい場合を考えてみましょう。`linkarea` 属性を使用する場合には以下のようになります。

```html
<table>
  <tr linkarea>
    <td><a href="/product" defaultlink>Product</a></td>
    <td>...</td>
  </tr>
</table>
```

しかし新しい `<linkarea>` 要素ではこれを実現することが不可能です。なぜなら、`<table>` 内の `<tr>` 要素では特別な HTML パーサーの処理が行われるためです。新しい要素を解析できるように HTML パーサーの挙動を変更すると、新しい要素をサポートしていないブラウザではページが正しく表示されない可能性があります。

一方で `linkarea` 属性を用いたアプローチではポリフィルを介して新しい属性をサポートできるため、ブラウザ間のサポートの差異を埋めることができます。

### CSS instead of HTML

3 つ目のアプローチでは HTML 属性や要素を使用する代わりに、新しい CSS プロパティ `pointer-area` を導入します。

```html
<div class="card">
  <a class="tag" href="/tag/tech">Tech</a>
  <div>
    <h2>
      <a href="/new-product">New Product</a>
    </h2>
    <p>...</p>
  </div>
</div>
```

```css
.card {
  pointer-area: contain;
}

.card h2 a {
  pointer-area: expand;
}
```

この例ではカード要素のコンテナに `pointer-area: contain` を指定しています。これによりカード要素全体がクリック可能な領域となります。`pointer-area: expand` を指定した要素は、その要素のクリック領域が親要素のクリック領域に拡張されます。

### Use Invokers

最後のアプローチでは [Invokers](https://open-ui.org/components/invokers.explainer/) という提案を使用します。

```html
<div class="card" commandfor="new-product" command="click contextmenu">
  <a class="tag" href="/tag/tech">Tech</a>
  <div>
    <h2>
      <a id="new-product" href="/new-product">New Product</a>
    </h2>
    <p>...</p>
  </div>
</div>
```

このアプローチでは `commandfor` 属性の値にリンク要素の ID を指定します。そして `command` 属性を使用してどのようなイベントを行うかを指定しています。

この方法の利点はリンク要素以外にも例えば `<button>` に対しても処理を委任できる点で優れています。一方で宣言する属性が多くなる点がデメリットとして挙げられます。

## アクセシビリティ上の懸念事項

上記の 4 つのアプローチのいずれを採用するせよ、新たなアクセシビリティ上の問題は発生しないと考えられます。`linkarea` 属性を使用した場合でも、コンテナ要素のセマンティクスが変更されることは想定されていないためです。つまりリンクの委任を行うかどうかに関わらず、公開されるアクセシビリティツリーには変更が加えられないということです。このことは `<label>` 要素がアクセシビリティツリーに明示的に公開されないこととよく似ています。オプションとして新しい a11y 属性を追加することでスクリーンリーダーが必要に応じて特別な処理を行うことも考えられるでしょう。

現在の提案では任意の要素に対して `linkarea` 属性を追加できるとされていますが、提案が受け入れる場合には特定のロールを持つ要素にのみ（たとえば `role="button"` を持つ要素）に限られる可能性も述べられています。

### リンクのターゲット領域の確保に関する問題

現在使われている手法とこの提案で共通する問題として、カード内のリンク（タグなど）のターゲット領域が小さすぎる場合にユーザーがリンクをクリックしにくいという問題が挙げられます。カードは領域全体がクリック可能であるため、カード内にあるリンクとは常に接近した状態となっています。カード内にタグをクリックしようとしたら、誤ってカード全体のリンク先へ遷移してしまった経験がある方も多いのではないでしょうか。

リンクの領域に関する問題の詳細については [Understanding Success Criterion 2.5.8: Target Size (Minimum) | WAI | W3C](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) や [Large Links, Buttons, and Controls | Web Accessibility Initiative (WAI) | W3C](https://www.w3.org/WAI/perspective-videos/controls/) を参照してください。

リンクのターゲット領域に関する問題は確かに懸念事項として存在しますが、標準化されたアプローチとして採用されることで以下のように問題を緩和することが期待されます。

- HTML の仕様として、入れ子となったリンクは最小のターゲット領域（24x24 ピクセル）を持つべきであると Web の作成者に対して通知できる
- ユーザーエージェントにより入れ子のリンクのターゲット領域を自動的に拡張される
- ユーザーエージェントスタイルシートにより、入れ子のリンクの `min-height`, `min-width`, `padding` などが自動的に適用される。この値は Web の作成者により上書き可能であるものの、その領域が小さすぎる場合にはコンソールに警告が表示されることが期待される

## まとめ

- カード UI のように入れ子のリンクは現在のウェブサイトでは一般的な UI パターンであるが、HTML 仕様に違反してたり、CSS や JavaScript を用いたハッキーな手法で実装されていることがある
- Open UI コミュニティでは Link Area Delegation という提案を行っており、標準化された方法で入れ子のリンクを実装することで UX やアクセシビリティを損なうことを防ぐことを目的としている
- Link Area Delegation では 4 つのアプローチが提案されている
  - Link delegation attributes
  - a new element type
  - CSS instead of HTML
  - Use Invokers
- キーボード操作やスクリーンリーダーでの操作に影響を与えず、アクセシビリティツリーに変更を加えないため、新たなアクセシビリティ上の問題は発生しないと考えられる
- リンクのターゲット領域に関する問題は依然として存在するが、標準化されたアプローチとして採用されることで問題を緩和することが期待される

## 参考

- [Link Area Delegation (Explainer) | Open UI](https://open-ui.org/components/link-area-delegation-explainer/)
  [Link delegation to descendant · Issue #1104 · openui/open-ui](https://github.com/openui/open-ui/issues/1104)
- [Cardのマークアップでもう悩まない！NestedでClickableなUIを実現する、Link Area Delegationとは - saku](https://blog.sakupi01.com/dev/articles/proposal-link-area-delegation)

[^1]: たとえば HTML Living Standard の a 要素の仕様にはフローコンテンツのみが子要素として許可されていると記載されています。https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element
