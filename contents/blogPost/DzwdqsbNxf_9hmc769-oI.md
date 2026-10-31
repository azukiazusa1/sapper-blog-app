---
id: DzwdqsbNxf_9hmc769-oI
title: "CSS の :navigation-source 擬似クラスでクリックした要素だけを View Transition の対象にする"
slug: "navigation-source-pseudo-class"
about: "一覧から詳細へのページ遷移で特定の画像をアニメーションさせるには、写真ごとに一意な view-transition-name を両方のページへ出力する必要がありました。CSS の :navigation-source 擬似クラスを使うと、クリックした要素だけに固定の名前を付けられます。この記事では、Chrome 156 での動作とマッチする期間を紹介し、戻る操作にも対応する一意な名前の方式との使い分けを動画と検証結果で説明します。"
createdAt: "2026-10-31T15:29+09:00"
updatedAt: "2026-10-31T15:29+09:00"
tags: ["CSS"]
audio: null
selfAssessment:
  quizzes:
    - question: "全サムネイルに同じ view-transition-name を指定して一覧ページから遷移すると、Chrome ではどうなりますか？"
      answers:
        - text: "クリックしたサムネイルだけが自動的に選ばれてアニメーションする"
          correct: false
          explanation: "ブラウザがクリックした要素を自動で選ぶことはありません。その選択を CSS で書くために :navigation-source があります。"
        - text: "先頭のサムネイルだけがアニメーションする"
          correct: false
          explanation: "先頭の要素が優先されることはありません。名前の重複により遷移そのものが実行されません。"
        - text: "コンソールに名前の重複のメッセージが出力され、遷移が実行されない"
          correct: true
          explanation: "view-transition-name はスナップショットの取得時にページ内で一意である必要があります。重複すると Unexpected duplicate view-transition-name と出力され、遷移は実行されませんでした。"
        - text: "すべてのサムネイルが同時に詳細ページのメイン画像へ変化する"
          correct: false
          explanation: "同じ名前の要素を複数同時に変化させることはできません。"
    - question: ":navigation-source が CSS に反映している Navigation API のプロパティはどれですか？"
      answers:
        - text: "NavigateEvent.sourceElement"
          correct: true
          explanation: "仕様では :navigation-source は NavigateEvent.sourceElement を CSS に反映したものと定義されています。"
        - text: "NavigationActivation.from"
          correct: false
          explanation: "from は直前のページの情報を表します。ナビゲーションを開始した要素を表すものではありません。"
        - text: "NavigateEvent.destination"
          correct: false
          explanation: "destination は遷移先の情報です。ナビゲーションを開始した要素を表すものではありません。"
        - text: "PageSwapEvent.activation"
          correct: false
          explanation: "activation はページ間の遷移の情報を表します。ナビゲーションを開始した要素を表すものではありません。"
    - question: "Chrome 156 で :navigation-source がいずれの要素にもマッチしない操作はどれですか？"
      answers:
        - text: "リンクにフォーカスして Enter キーを押す"
          correct: false
          explanation: "キーボード操作でも、フォーカスしていたリンクにマッチします。"
        - text: "応答を待っている間に別のリンクをクリックする"
          correct: false
          explanation: "この場合は後からクリックしたリンクへマッチが移ります。"
        - text: "フォームの送信ボタンをクリックする"
          correct: false
          explanation: "この場合は送信ボタンにマッチします。"
        - text: "ブラウザの戻る操作を行う"
          correct: true
          explanation: "戻る操作には開始元の要素がないためマッチしません。location.href への代入も同様です。"
    - question: "フォームを送信ボタンのクリックで送信したとき、:navigation-source にマッチする要素はどれですか？"
      answers:
        - text: "<form> と <button> の両方"
          correct: false
          explanation: "マッチする要素は常に 1 つです。ボタンから送信すると <form> にはマッチしません。"
        - text: "<button> だけ"
          correct: true
          explanation: "ボタンから送信するとマッチするのはボタンだけです。<form> を選択するには form:has(:navigation-source) を組み合わせます。"
        - text: "<form> だけ"
          correct: false
          explanation: "<form> にマッチするのは form.requestSubmit() や form.submit() で送信した場合です。"
        - text: "どの要素にもマッチしない"
          correct: false
          explanation: "フォームの送信でも :navigation-source はマッチします。"
    - question: "現時点で、戻る操作でも画像がサムネイルへ縮小する遷移にしたい場合に適した方法はどれですか？"
      answers:
        - text: "a:navigation-source .thumb に固定の名前を指定する"
          correct: false
          explanation: "戻る操作では :navigation-source はマッチしないので、サムネイルは名前を持ちません。"
        - text: "写真ごとの一意な view-transition-name を一覧と詳細に出力する"
          correct: true
          explanation: "両方のページに同じ名前があるので、JavaScript なしで進む操作と戻る操作の両方が遷移します。"
        - text: "@navigation で戻る操作のときだけ名前を付ける"
          correct: false
          explanation: "@navigation は Chrome 156 ではまだ使えず、規則は破棄されました。"
        - text: "全サムネイルに同じ固定の名前を指定する"
          correct: false
          explanation: "名前が重複すると遷移は実行されません。"

published: false
---

写真の一覧ページでサムネイルをクリックすると、その画像が拡大しながら詳細ページのメイン画像へ変化する。[View Transitions](https://drafts.csswg.org/css-view-transitions-2/) でよく作られる遷移です。別々の HTML ページ間でこの遷移を実装するには、写真ごとに一意な `view-transition-name` を両方のページへ出力する方法があります。しかし写真の数だけ名前を生成する必要があり、一覧のサムネイルはクリックしていないものも含めて遷移の対象になります。

[`:navigation-source`](https://drafts.csswg.org/css-navigation-1/#navigation-source-pseudo-class) 擬似クラスは、ナビゲーションを開始した要素にマッチします。クリックされたリンクを CSS で選択できるため、固定の名前を 1 つ CSS に書くだけで、対象のサムネイルにだけ `view-transition-name` を付けられます。

この記事では、`:navigation-source` を使った遷移の実装と、セレクターがマッチする期間を紹介します。戻る操作ではマッチしないという制約があるので、一意な名前を付ける方式との使い分けも説明します。

!> 2026 年 10 月 31 日現在、`:navigation-source` は [Chrome 156](https://chromestatus.com/feature/6327898878377984) で実装されています。Firefox と Safari は未実装で、標準化に対する立場も表明していません（[Mozilla](https://github.com/mozilla/standards-positions/issues/1447)、[WebKit](https://github.com/WebKit/standards-positions/issues/715)）。仕様は Editor's Draft の段階であり、今後変更される可能性があります。

## 一覧と詳細の画像を対応させる方法

View Transition で要素を個別にアニメーションさせるには、遷移前後の要素に同じ `view-transition-name` を指定します。詳細ページのメイン画像には CSS で固定の名前を付けられますが、一覧ページのサムネイルに同じ固定の名前は付けられません。`view-transition-name` はスナップショットの取得時にページ内で一意である必要があるためです。全サムネイルに `view-transition-name: photo` を指定して遷移すると、Chrome のコンソールには `Unexpected duplicate view-transition-name: photo` と出力され、遷移は実行されませんでした。

この制約を避ける方法の 1 つは、写真の ID などから一意な名前を作り、一覧と詳細の両方に出力することです。

```html
<!-- 一覧ページ -->
<img class="thumb" style="view-transition-name: photo-sea" src="/images/sea.svg" alt="海の風景" />

<!-- 詳細ページ -->
<img class="hero" style="view-transition-name: photo-sea" src="/images/sea.svg" alt="海の風景" />
```

この方式は JavaScript なしで動作します。一方で、テンプレートから写真ごとの名前を出力する必要があります。また、名前を持つ要素はすべて遷移の対象になるので、一覧のサムネイルは 1 枚ごとにスナップショットを取得する対象になります。同じ写真が一覧に 2 回表示される場合は名前が重複します。

もう 1 つは、[`pageswap`](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageswap_event) イベントなどのスクリプトで、クリックされたサムネイルにだけ固定の名前を付ける方法です。`:navigation-source` は、この処理を CSS で書けるようにするものです。

## `:navigation-source` とは

`:navigation-source` は、[CSS Navigation Matching](https://drafts.csswg.org/css-navigation-1/) で定義されている擬似クラスで、現在のナビゲーションを開始した要素にマッチします。仕様では、Navigation API の [`NavigateEvent.sourceElement`](https://developer.mozilla.org/en-US/docs/Web/API/NavigateEvent/sourceElement) を CSS に反映したものと定義されています。対象となる要素は `<a>`、`<area>`、`<form>`、送信用の `<input>`、`<button>` です。

以下のように、ナビゲーションを開始したリンクの子孫へ名前を付けられます。

```css
a:navigation-source .thumb {
  view-transition-name: photo;
}
```

提案は 2025 年 2 月の [csswg-drafts の Issue #11801](https://github.com/w3c/csswg-drafts/issues/11801) から始まりました。動機は、View Transition のためにクリックされた要素へ名前を付けるスクリプトを CSS に置き換えることです。Issue では `:local-link:visited` のような既存のセレクターの流用も議論されました。しかし `:local-link` は遷移先ではなく現在の URL へのリンクにマッチし、複数の要素にマッチすることもあります。ナビゲーションを開始した 1 つの要素を選ぶには、新しい擬似クラスが必要でした。

名前と対象は議論の中で変わっています。

- 提案時の案は `:navigation-trigger` や `:navigation-source-element` でした
- 仕様の草案には、リンクだけを対象とする `:trigger-link` として追加されました
- 2026 年 7 月の [CSSWG の会議](https://github.com/w3c/csswg-drafts/issues/11801#issuecomment-4857772799)で、リンクに限定せず、Navigation API の用語に合わせて `:nav-source` とすることが決議されました
- 2026 年 8 月に、`@navigation` などの関連機能と用語を揃えるため [`:navigation-source` へ改名](https://github.com/w3c/csswg-drafts/issues/14303)されました

リンクに限定しなかったのは、対象を区別したければ `a:navigation-source` のように要素セレクターを組み合わせられるためです。会議では、リンクだけを特別扱いするとフォームを使うべき場面でリンクを使う動機になる、という懸念も出ていました。

一部の記事には古い `:nav-source` の名前が残っています。Chrome 156 で `CSS.supports("selector(:nav-source)")` は `false` を返すため、`:navigation-source` と書く必要があります。

## クリックしたサムネイルを詳細ページへ遷移させる

3 枚の写真が並ぶ一覧ページと、写真ごとの詳細ページを持つ静的なサイトで試します。一覧ページはサムネイルとタイトルをリンクで囲んでいます。

```html:index.html
<ul class="cards">
  <li>
    <a class="card" href="/items/mountain.html">
      <img class="thumb" src="/images/mountain.svg" alt="山の風景" />
      <span class="title">山</span>
    </a>
  </li>
  <li>
    <a class="card" href="/items/sea.html">
      <img class="thumb" src="/images/sea.svg" alt="海の風景" />
      <span class="title">海</span>
    </a>
  </li>
  <li>
    <a class="card" href="/items/forest.html">
      <img class="thumb" src="/images/forest.svg" alt="森の風景" />
      <span class="title">森</span>
    </a>
  </li>
</ul>
```

詳細ページには、同じ画像を大きく表示します。

```html:items/sea.html
<p><a href="/">写真一覧へ戻る</a></p>
<img class="hero" src="/images/sea.svg" alt="海の風景" />
<h1>海</h1>
```

両方のページで読み込む CSS に、次の指定を書きます。

```css:style.css
@view-transition {
  navigation: auto;
}

/* クリックしたカードのサムネイルにだけ名前を付ける */
a:navigation-source .thumb {
  view-transition-name: photo;
}

.hero {
  view-transition-name: photo;
}

::view-transition-group(photo) {
  animation-duration: 0.6s;
}
```

`@view-transition` は、同じオリジンのページ間の遷移で View Transition を有効にします。一覧ページではナビゲーションが始まると、クリックしたリンクのサムネイルだけが `photo` という名前を持ちます。詳細ページでは `.hero` が同じ名前を持つため、ブラウザはこの 2 つの要素を同じものとして扱います。

次の動画は Chrome 156.0.8078.74 で録画したものです。赤い丸はマウスカーソルの位置を示しています。前半で海のサムネイルをクリックしたときに、その画像だけが残って拡大する点を見てください。後半はブラウザの戻る操作です。

!v(./navigation-source-transition.mp4)

サムネイルをクリックすると、残りのページがクロスフェードする間に、海の画像が詳細ページのメイン画像の位置まで拡大します。遷移中のアニメーションを `document.getAnimations()` で調べると、`::view-transition-group(photo)` と `::view-transition-group(root)` の 2 つのグループが確認できました。

一方、動画の後半の戻る操作では画像は縮小せず、ページ全体のクロスフェードになります。理由と対処は、「いつマッチするのか」と「戻る操作も遷移させる」の節で説明します。

## いつマッチするのか

仕様では、`:navigation-source` は現在のナビゲーションの状態が存在し、その開始元の要素がその要素であるときにマッチします。クロスドキュメントのナビゲーションの場合、[Explainer](https://github.com/WICG/declarative-partial-updates/blob/main/route-matching-explainer.md#active-navigation-state) によると、状態は開始時から新しいページの最初のフレームまで続きます。ただし、新しいページから見た開始元の要素は `null` と定義されているので、`:navigation-source` がマッチするのは遷移元のページの要素だけです。

Chrome 156 で、詳細ページの応答を 1.5 秒遅らせ、ページ内で定期的に `element.matches(":navigation-source")` を確認した結果は次のとおりです。

| 操作 | マッチした要素 |
| --- | --- |
| リンクのクリック | クリックしたリンク（遷移先のページではなし） |
| リンクにフォーカスして Enter キー | そのリンク |
| 応答を待っている間に別のリンクをクリック | 後からクリックしたリンクへ移る |
| `window.stop()` でナビゲーションを中止 | 中止した時点でマッチしなくなる |
| ブラウザの戻る操作 | なし |
| `location.href` への代入 | なし |
| `target="_blank"` のリンク | なし |

マッチする要素は常に 1 つです。`location.href` のようにスクリプトから開始したナビゲーションには開始元の要素がないため、マッチしません。[Web Platform Tests](https://github.com/web-platform-tests/wpt/blob/master/css/css-navigation/tentative/navigation-source-001.html) でも、`navigation.back()` と `navigation.forward()` ではどの要素にもマッチしないことをテストしています。

### 応答を待つ間の表示に使う

`:active` はマウスボタンを離すと解除されますが、`:navigation-source` はナビゲーションが終わるまでマッチし続けます。実際に応答を待っている間、`a:active` はどの要素にもマッチせず、`:navigation-source` だけがマッチしていました。

この違いは View Transition 以外にも使えます。以下の CSS は、応答を待っている間だけクリックしたカードに読み込み中の表示を出します。

```css:style.css
.card:navigation-source .title::after {
  content: " 読み込み中…";
  color: #b45309;
}
```

次の動画では詳細ページの応答を 2 秒遅らせています。クリック後、海のカードのタイトルの横に表示される文字に注目してください。

!v(./navigation-source-loading.mp4)

クリックした海のカードにだけ「読み込み中…」と表示され、詳細ページが表示されると消えます。ただし、`content` で追加した文字がスクリーンリーダーに通知されるとは限らないので、この表示は視覚的な補助として扱う必要があります。

## リンク以外の要素で使う

フォームの送信でも `:navigation-source` はマッチします。ただし、どの要素にマッチするかは送信の方法で変わります。

| 送信の方法 | マッチした要素 |
| --- | --- |
| 送信ボタンのクリック | `<button>` |
| 入力欄で Enter キー | `<button>` |
| `form.requestSubmit()` | `<form>` |
| `form.submit()` | `<form>` |

ボタンから送信すると、マッチするのはボタンだけで `<form>` にはマッチしません。これは `sourceElement` が送信ボタンを優先する仕様をそのまま反映した結果です。Chrome 156 の実装ではそのように動作しました。

そのため、`form:navigation-source .input` のようなセレクターは、ボタンからの送信では適用されません。送信の方法によらずフォームを選択したい場合は、`:has()` を組み合わせます。Chrome 156 でボタンから送信すると、`<form>` は `form:has(:navigation-source)` にマッチしました。

```css
form:navigation-source .input,
form:has(:navigation-source) .input {
  view-transition-name: search-input;
}
```

SPA のように Navigation API の `intercept()` で処理する同一ドキュメントのナビゲーションでもマッチします。1 秒かかるハンドラーを渡した場合、ハンドラーの完了までリンクにマッチし、完了後はマッチしなくなりました。ページ内リンクの場合は、`click()` の直後にはマッチしていましたが、次のフレームではマッチしなくなっていました。

## 戻る操作も遷移させる

動画で見たとおり、`:navigation-source` だけでは戻る操作で画像がサムネイルへ縮小しません。ブラウザの戻るボタンにはページ内の開始元の要素がないため、一覧ページのサムネイルは名前を持たないままです。Issue #11801 の初期の案では戻る操作でもマッチさせる方法が検討されましたが、このセレクターはナビゲーション中だけマッチするものとし、戻る操作のアニメーションは CSS Navigation Matching の別の機能に任せる方針になりました。ただし、その機能の 1 つである `@navigation` は Chrome 156 ではまだ使えません。`@navigation` を含むスタイルシートを読み込んでも規則は破棄され、`cssRules` に残りませんでした。

現時点で戻る操作も遷移させるなら、最初に紹介した一意な名前の方式が使えます。次の動画は、`:navigation-source` の指定を外し、一覧と詳細の画像に `view-transition-name: photo-sea` のような名前を付けた場合の遷移です。後半の戻る操作で画像がサムネイルの位置へ縮小する点が、先ほどの動画との違いです。

!v(./navigation-source-unique-names.mp4)

JavaScript なしで、進む操作と戻る操作の両方で `::view-transition-group(photo-sea)` のアニメーションが実行されました。

2 つの方式の違いは次のとおりです。

| 観点 | 一意な名前 | `:navigation-source` |
| --- | --- | --- |
| 名前の管理 | 写真ごとの名前を両方のページに出力する | 固定の名前を CSS に書く |
| 戻る操作 | 遷移する | 遷移しない |
| 遷移の対象 | 名前を持つサムネイルすべて | クリックした要素だけ |
| 同じ写真が一覧に複数ある場合 | 名前が重複する | 影響しない |
| 対応ブラウザ | クロスドキュメントの View Transition に対応したブラウザ | Chrome 156 以降 |

戻る操作も遷移させたい場合は、一意な名前を選びます。HTML のテンプレートを変更しにくい場合や、進む操作の遷移だけで十分な場合は、`:navigation-source` が向いています。

## 未対応ブラウザでの扱い

未対応のブラウザでは `a:navigation-source .thumb` のセレクターが無効になり、その規則だけが無視されます。ナビゲーションは通常どおり動作するので、`:navigation-source` は段階的な機能拡張として使えます。サムネイルが名前を持たないだけなので、View Transition に対応したブラウザではページ全体のクロスフェードになると考えられます。Firefox と Safari の実機での動作は確認していません。

セレクターリストの中に書くと、未対応のブラウザではリスト全体が無効になります。既存のセレクターとは別の規則に分けてください。

```css
/* :navigation-source が未対応だと .selected の指定も無効になる */
.selected,
a:navigation-source .thumb {
  view-transition-name: photo;
}
```

すべてのブラウザで同じ遷移が必要な場合は、`:navigation-source` ではなく一意な名前の方式を使います。

## まとめ

- `:navigation-source` は、ナビゲーションを開始した要素にマッチする擬似クラスで、`NavigateEvent.sourceElement` を CSS に反映したもの
- 一覧と詳細に一意な `view-transition-name` を出力する方式は JavaScript なしで動作するが、写真ごとの名前の生成が必要で、名前を持つサムネイルはすべて遷移の対象になる
- `a:navigation-source .thumb` に固定の名前を指定すると、クリックしたサムネイルだけを遷移の対象にできる
- マッチするのはナビゲーションの間だけで、遷移先のページや、戻る操作、`location.href` への代入ではマッチしない
- 応答を待つ間もマッチし続けるので、クリックした要素に読み込み中の表示を出す用途にも使える
- フォームをボタンから送信するとマッチするのはボタンで、`<form>` にはマッチしない
- 戻る操作も遷移させたい場合は、一意な名前の方式を選ぶ
- 2026 年 10 月 31 日現在の対応は Chrome 156 以降のみで、未対応のブラウザではセレクターが無視される

## 参考

- [CSS Navigation Matching](https://drafts.csswg.org/css-navigation-1/)
- [Route matching explainer](https://github.com/WICG/declarative-partial-updates/blob/main/route-matching-explainer.md)
- [[css-navigation-1] Add pseudo-class selector to target the element that initiated the outgoing navigation · Issue #11801 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/11801)
- [[css-navigation-1] Rename `:nav-source` to `:navigation-source` · Issue #14303 · w3c/csswg-drafts](https://github.com/w3c/csswg-drafts/issues/14303)
- [Intent to Ship: CSS pseudo-class for navigation source element](http://www.mail-archive.com/blink-dev@chromium.org/msg17359.html)
- [navigation-source-001.html · web-platform-tests/wpt](https://github.com/web-platform-tests/wpt/blob/master/css/css-navigation/tentative/navigation-source-001.html)
- [Styling the Navigation: Declarative Route and Navigation Matching in CSS | Bram.us](https://www.bram.us/2026/07/30/styling-the-navigation-declarative-route-and-navigation-matching-in-css/)
