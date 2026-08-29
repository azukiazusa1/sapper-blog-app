---
id: d-JdUjEty7czv5hrakgpj
title: "CSS の shape() 関数でレスポンシブな図形を作る"
slug: "responsive-shapes-with-css-shape-function"
about: "clip-path の path() 関数で複雑な図形を作ると、固定座標のため要素のサイズへ追従させにくいという問題があります。shape() 関数ではパーセントや CSS の単位、カスタムプロパティを使って曲線を含む図形を定義できます。この記事では幅を変更できる吹き出しを作り、path() との違いや offset-path への応用を紹介します。"
createdAt: "2026-08-29T19:12+09:00"
updatedAt: "2026-08-29T19:12+09:00"
tags: ["CSS"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3ChGpc9iTszV7sstYi199/b4feb7a7447466f88aebee90c4fb4834/grand-piano_19497.png"
  title: "グランドピアノのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "`path()` と比べた `shape()` の特徴として、記事の説明に合うものはどれですか？"
      answers:
        - text: "SVG のパス文字列をそのまま受け取り、すべての座標を暗黙に `px` として扱う"
          correct: false
          explanation: "これは記事で説明した `path()` の特徴です。`shape()` は CSS の構文で描画命令を記述します。"
        - text: "パーセントや CSS の単位、数学関数を使い、参照ボックスに応じたパスを生成する"
          correct: true
          explanation: "記事では、`shape()` は `%`、CSS の単位、`calc()`、カスタムプロパティなどを使えると説明しています。"
        - text: "直線だけで図形を作り、曲線を使う場合は必ず SVG ファイルを参照する"
          correct: false
          explanation: "`shape()` は `curve`、`smooth`、`arc` などの命令で曲線を記述できます。"
        - text: "要素のレイアウト上のボックス自体を、指定した輪郭と同じ形に変更する"
          correct: false
          explanation: "`clip-path` が変えるのは描画領域であり、レイアウト上のボックスは矩形のままです。"
    - question: "`shape()` の描画命令で使う `to` と `by` の違いとして正しいものはどれですか？"
      answers:
        - text: "`to` は現在の点を基準とする相対位置、`by` は参照ボックスを基準とする絶対位置を表す"
          correct: false
          explanation: "基準が逆です。記事では `to` が絶対位置、`by` が現在の点からの相対位置だと説明しています。"
        - text: "`to` は曲線だけ、`by` は直線だけで使用できる"
          correct: false
          explanation: "`line` や `curve` などの命令では、終点の指定に `to` または `by` を利用できます。"
        - text: "`to` は参照ボックスを基準とする絶対位置、`by` は現在の点を基準とする相対位置を表す"
          correct: true
          explanation: "記事で説明している通り、`line to 100% 100%` は絶対位置、`line by 20px 10px` は現在の点からの相対位置です。"
        - text: "`to` と `by` に違いはなく、どちらも読みやすさのために選べる"
          correct: false
          explanation: "2 つのキーワードは座標の基準が異なるため、置き換えると通常は異なるパスになります。"
    - question: "`curve` 命令の `with` に制御点を `/` で 2 つ指定した場合、どの曲線になりますか？"
      answers:
        - text: "2 次ベジェ曲線"
          correct: false
          explanation: "記事では、制御点が 1 つの場合に 2 次ベジェ曲線になると説明しています。"
        - text: "3 次ベジェ曲線"
          correct: true
          explanation: "記事の複雑な図形の例では、`/` で区切った 2 つの制御点を使って 3 次ベジェ曲線を作っています。"
        - text: "楕円弧"
          correct: false
          explanation: "楕円弧を描く命令は `curve` ではなく `arc` です。"
        - text: "水平線"
          correct: false
          explanation: "水平線を描く命令は `hline` です。制御点を持つ `curve` とは役割が異なります。"

published: true
---

b> shape-function

カードや画像を吹き出しのような形に切り抜きたい場合、CSS の [`clip-path`](https://www.w3.org/TR/css-masking-1/#the-clip-path) プロパティを使用できます。例えば、正方形の画像へ `circle(50%)` を指定すると、画像の中心を基準とした円形に切り抜けます。

```css
.avatar {
  inline-size: 160px;
  aspect-ratio: 1;
  object-fit: cover;
  clip-path: circle(50%);
}
```

`clip-path` はこのように、要素自体の大きさを変えず、指定した図形の外側を描画しないようにします。円や多角形であれば `circle()` や `polygon()` で表現できますが、角丸と曲線を含む複雑な輪郭には `path()` 関数が必要でした。

しかし `path()` の座標は暗黙に CSS ピクセルとして扱われます。そのため `%` やカスタムプロパティを使って要素のサイズに追従させる、といったことができません。要素の幅を変更してもパスの座標は変わらないため、レスポンシブなコンポーネントでは輪郭と要素のサイズがずれるという問題があります。

CSS の [`shape()` 関数](https://drafts.csswg.org/css-shapes/#shape-function) は、SVG パスに似た直線や曲線を `%`、`rem`、`calc()`、カスタムプロパティなどの CSS の値で記述できます。そのため `path()` のように固定座標ではなく、要素のサイズに追従する輪郭を作れるのです。この記事では `shape()` の構文を紹介し、幅を変更できる吹き出しや複数の曲線を組み合わせた有機的な図形を作る例を示します。

## `clip-path` で要素を切り抜く

`clip-path` は、要素のどの領域を描画するかを切り抜きパスで指定するプロパティです。例えば、次のコードは要素を三角形に切り抜きます。

```css
.triangle {
  inline-size: 240px;
  block-size: 160px;
  background: #6750a4;
  clip-path: polygon(50% 0, 100% 100%, 0 100%);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="click-path-triangle" src="https://codepen.io/azukiazusa1/embed/qErdmNV?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/qErdmNV">
  click-path-triangle</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`polygon()` の座標には `%` を指定できるため、要素のサイズが変わっても 3 つの頂点はそれぞれ上中央、右下、左下に配置されます。一方、`polygon()` では直線しか描けないため、角丸や曲線を含む形には対応できません。自由な曲線を含む形には、SVG のパスデータを受け取る `path()` が使われてきました。

以下は、角丸と下向きの突起を持つ吹き出しです。`M` は開始点への移動、`H` と `V` は水平・垂直線、`Q` は 2 次ベジェ曲線、`L` は直線、`Z` はパスを閉じる SVG パスコマンドです。

```css
.bubble {
  inline-size: 320px;
  block-size: 180px;
  background: #6750a4;
  clip-path: path(
    "M 20 0 H 300 Q 320 0 320 20 V 140 Q 320 160 300 160 H 190 L 170 180 L 150 160 H 20 Q 0 160 0 140 V 20 Q 0 0 20 0 Z"
  );
}
```

このパスは 320 × 180px の要素では意図した吹き出しになります。ただし、パスの座標はすべて固定値であるため、要素のサイズを変えても輪郭は追従しません。

## `path()` では要素のサイズに追従しにくい

例えば先ほどの吹き出しで、要素の幅だけを 560px に変更してみます。それでも右端の座標は `320` のままです。要素自体のボックスは広がりますが、描画される輪郭は 320px の範囲に固定されてしまいます。また 320px より小さくすると、今度はパスの右側が要素の外へはみ出します。はみ出した部分は描画されないため、右上・右下の角丸が失われて直角に切り落とされた形になります。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/6FIIGCvT4gAJAfPaARFSk5/c3e34549689dbba5bc5f6c4f97bf9300/13710e97-6c84-4eed-b385-9c7ff6901a67.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS path() で作る固定座標の吹き出し" src="https://codepen.io/azukiazusa1/embed/ByWNRzE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/ByWNRzE">
  CSS path() で作る固定座標の吹き出し</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

このような結果になるのは、`path()` の受け取る値に理由があります。`path()` が受け取るのは [SVG のパスデータ文字列](https://www.w3.org/TR/SVG2/paths.html#PathData)です。[CSS Shapes の仕様](https://drafts.csswg.org/css-shapes/#funcdef-basic-shape-path)では、文字列内の数値は暗黙に `px` 単位として扱われます。`50%` のような割合や `calc(100% - 20px)` は記述できません。

もう 1 つの制約は、パス全体が 1 つの文字列であることです。次のように文字列の途中へ `var()` を差し込み、角丸の大きさだけを動的に変更できないのです。

```css
/* var() は path() の文字列の一部として展開されない */
.bubble {
  --radius: 20px;
  clip-path: path("M var(--radius) 0 ...");
}
```

`shape()` はこの問題に対して、パスデータを CSS の構文で組み立てることで解決します。仕様では、各命令が描画時にパスセグメントへ変換されると説明されています。つまり `shape()` は固定されたパスではなく、参照ボックスと CSS の値から最終的なパスを作るレシピと言えます。

:::note
CSSWG では、`shape()` を新設せず、`path()` に CSS 風の構文を追加する案も議論されました。既存の関数を拡張したほうが見つけやすく、CSS の `circle()` や `polygon()` と SVG 要素の関係にも一貫性がある、という考えです。一方、`shape()` は参照ボックスやカスタムプロパティ、フォントサイズなどの CSS 環境と組み合わせてパスを生成します。同じ記述でも環境によって異なるパスになるため、SVG に近い `path()` とは役割が異なります。CSSWG は 2025 年 2 月に、[`shape()` は現在の名前と設計を維持し、`path()` にはより限定された CSS 風構文を別途検討する](https://www.w3.org/2025/02/12-css-minutes.html#t06)と決議しました。
:::

## `shape()` 関数の構文

`shape()` は開始点と、カンマで区切った 1 つ以上の描画命令を受け取ります。単純な三角形は次のように記述できます。

```css
.triangle {
  clip-path: shape(from 50% 0, line to 100% 100%, line to 0 100%, close);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="shape-triangle" src="https://codepen.io/azukiazusa1/embed/jEBPmrE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEBPmrE">
  shape-triangle</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

`from` は最初の点です。その後の `line to` は現在の点から指定した座標まで直線を引きます。`to` の座標は、参照ボックスの左上を原点とする絶対位置です。`line by 20px 10px` のように `by` を使うと、現在の点を基準とした相対位置になります。座標の `%` は、横方向なら参照ボックスの幅、縦方向なら高さを基準に計算されます。

主な命令は次のとおりです。

| 命令              | 役割                                           |
| ----------------- | ---------------------------------------------- |
| `move`            | 線を引かずに別の点へ移動する                   |
| `line`            | 現在の点から直線を引く                         |
| `hline` / `vline` | 水平線または垂直線を引く                       |
| `curve`           | 2 次または 3 次ベジェ曲線を引く                |
| `smooth`          | 直前の曲線から滑らかにつながるベジェ曲線を引く |
| `arc`             | 楕円弧を引く                                   |
| `close`           | 現在のサブパスを閉じる                         |

`curve` では、終点に続く `with` で制御点を指定します。制御点が 1 つなら 2 次ベジェ曲線、`/` で 2 つ指定すれば 3 次ベジェ曲線になります。

```css
.quadratic {
  clip-path: shape(from 0 100%, curve to 100% 100% with 50% 0, close);
}

.cubic {
  clip-path: shape(from 0 100%, curve to 100% 100% with 25% 0 / 75% 0, close);
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS shape() の2次ベジェ曲線と3次ベジェ曲線" src="https://codepen.io/azukiazusa1/embed/PwpqmbL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/PwpqmbL">
  CSS shape() の2次ベジェ曲線と3次ベジェ曲線</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

完全な構文は[仕様の Shape Commands](https://drafts.csswg.org/css-shapes/#typedef-shape-command)を参照してください。

## 幅を変更できる吹き出しを作る

`shape()` 関数で、前節に示した吹き出しを作ってみましょう。`clip-path` の `path()` 側は固定座標のままという問題があったのに対し、`shape()` 側は横方向の端を `%` と `calc()` で指定します。角丸の半径と突起の高さは `20px` のままにします。

```css:styles.css
.bubble-shape {
  clip-path: shape(
    from 20px 0,
    hline to calc(100% - 20px),
    curve to 100% 20px with 100% 0,
    vline to calc(100% - 40px),
    curve to calc(100% - 20px) calc(100% - 20px)
      with 100% calc(100% - 20px),
    hline to 60%,
    line to calc(60% - 20px) 100%,
    line to calc(60% - 40px) calc(100% - 20px),
    hline to 20px,
    curve to 0 calc(100% - 40px) with 0 calc(100% - 20px),
    vline to 20px,
    curve to 20px 0 with 0 0,
    close
  );
}
```

例えば右上の角とそれに続く右辺は、次の 3 つの命令で作られています。

1. `hline to calc(100% - 20px)` で、右端から 20px 手前まで水平線を引く
2. `curve to 100% 20px with 100% 0` で、右上を制御点とする 2 次ベジェ曲線を引く
3. `vline to calc(100% - 40px)` で、右辺を下方向へ引く

吹き出しの突起は `60%` を基準に配置しています。横方向の位置は要素幅へ追従しますが、突起自体は高さ 20px・底辺の幅 40px を保ちます。このように、追従させたい座標には `%`、一定に保ちたい寸法には `px` を選べることが `shape()` の特徴です。

幅を自由に変更しても、角丸と突起の大きさを保ったまま、吹き出しの輪郭が要素幅へ追従することを確認できます。

<video src="https://videos.ctfassets.net/in6v9lxmm5c8/7xv1JzNGLPStYupnS5pYQa/dd909ce31f5befed02d5d761d6f19a2d/dfda2c6b-6807-42a4-86bd-c63f0893c526.mov" controls></video>

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS shape() で作るレスポンシブな吹き出し" src="https://codepen.io/azukiazusa1/embed/jEBPmVE?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/jEBPmVE">
  CSS shape() で作るレスポンシブな吹き出し</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 複数の曲線を組み合わせた図形を作る

吹き出しより複雑な例として、6 本の 3 次ベジェ曲線をつないだ有機的なカードを作ります。1 本の曲線だけで輪郭全体を表そうとせず、上辺、右辺、下辺、左辺を複数の曲線に分けることで、それぞれの膨らみを個別に調整できます。

`shape()` で輪郭を定義します。各 `curve` には終点と 2 つの制御点があり、`/` が 2 つの制御点を区切ります。

```css:styles.css
.organic-card {
  box-sizing: border-box;
  inline-size: var(--demo-width, 320px);
  block-size: 240px;
  padding: 4rem;
  color: #1d192b;
  background: #f2b8b5;
  clip-path: shape(
    from 8% 12%,
    curve to 45% 5% with 20% -5% / 32% 15%,
    curve to 92% 15% with 65% -2% / 78% 25%,
    curve to 95% 78% with 105% 35% / 86% 58%,
    curve to 55% 95% with 82% 108% / 68% 80%,
    curve to 10% 88% with 38% 110% / 22% 75%,
    curve to 8% 12% with -3% 65% / 18% 40%,
    close
  );
}
```

この輪郭は、次の順番で一周します。

1. `from 8% 12%` で左上付近から開始する
2. 最初の 2 本の `curve` で、中央が浅くへこむ上辺を描く
3. 3 本目で右辺を外側へ膨らませながら右下へ進む
4. 4 本目と 5 本目で、下辺の右側と左側を描く
5. 6 本目で左辺を描き、開始点へ戻る
6. `close` で輪郭を閉じ、切り抜く領域を確定する

制御点は参照ボックスの外側にも配置できます。例えば `105% 35%` は右辺を外側へ、`-3% 65%` は左辺を外側へ引っ張る制御点です。制御点そのものは輪郭上の点ではありません。曲線が終点へ入る向きや、終点から出る向きを決めるハンドルとして働きます。そのため、参照ボックスの外側へ置くことで、要素の端を越えて膨らむような滑らかな曲線を作れます。

この例はすべての座標を `%` で指定しています。サンプルで横幅を変更すると、各終点と制御点の横座標も参照ボックスに対する割合として再計算されるため、6 本の曲線からなる輪郭全体が要素の幅へ追従します。吹き出しのように一部の寸法を固定するのではなく、有機的な輪郭全体を伸縮させたい場合の書き方です。

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS shape() で複数の曲線を組み合わせる" src="https://codepen.io/azukiazusa1/embed/GgWJmEz?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/GgWJmEz">
  CSS shape() で複数の曲線を組み合わせる</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## `offset-path` でモーションパスに応用する

[CSS Motion Path](https://www.w3.org/TR/motion-1/) は、要素を直線や曲線などの経路上へ配置し、その経路に沿って移動させるための CSS の仕組みです。通常のレイアウト位置を変更するのではなく、描画時にオフセット変形を適用するため、移動しても周囲の要素のレイアウトには影響しません。

モーションパスは、主に次のプロパティを組み合わせて制御します。

- [`offset-path`](https://www.w3.org/TR/motion-1/#offset-path-property): 要素が移動する経路を定義する
- [`offset-distance`](https://www.w3.org/TR/motion-1/#offset-distance-property): 経路上の位置を長さまたは割合で指定する
- [`offset-rotate`](https://www.w3.org/TR/motion-1/#offset-rotate-property): 経路の向きに合わせて要素を回転させる
- [`offset-anchor`](https://www.w3.org/TR/motion-1/#offset-anchor-property): 要素のどの点を経路上へ配置するか指定する

`shape()` を `offset-path` に指定すると、要素を移動させる経路を CSS の座標で定義できます。

以下の例では、赤い点が 3 次ベジェ曲線に沿って移動します。経路の始点と終点に `10px` の余白を取り、終点の横座標を `calc(100% - 10px)` とすることで、コンテナー幅へ追従させています。

```css:styles.css
.motion-stage {
  position: relative;
  inline-size: 320px;
  block-size: 10rem;
}

.traveler {
  position: absolute;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  border-radius: 50%;
  background: #e64553;
  offset-path: shape(
    from 10px 80%,
    curve to calc(100% - 10px) 20% with 35% 0 / 65% 100%
  );
  animation: travel 3s ease-in-out infinite alternate;
}

@keyframes travel {
  from {
    offset-distance: 0%;
  }
  to {
    offset-distance: 100%;
  }
}
```

`offset-distance` は、要素が経路上のどこに位置するかを表します。`0%` から `100%` へアニメーションさせると赤い点が曲線に沿って移動し、コンテナーの幅を変更しても始点と終点が両端の 10px を保ったまま追従します。

OS の設定を尊重するため、`prefers-reduced-motion: reduce` が指定されている場合はアニメーションを止めます。

```css
@media (prefers-reduced-motion: reduce) {
  .traveler {
    animation: none;
    offset-distance: 50%;
  }
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="CSS offset-path: shape() のアニメーション" src="https://codepen.io/azukiazusa1/embed/pveJPpb?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true">
  See the Pen <a href="https://codepen.io/azukiazusa1/pen/pveJPpb">
  CSS offset-path: shape() のアニメーション</a> by azukiazusa1 (<a href="https://codepen.io/azukiazusa1">@azukiazusa1</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## まとめ

- `clip-path` の `path()` は複雑な曲線を表現できるが、パス文字列内の座標が暗黙に `px` となるため、要素サイズへ追従させにくい
- `shape()` はパーセント、CSS の単位、数学関数、カスタムプロパティを使い、参照ボックスに応じたパスを描画時に生成する
- 追従させたい座標を `%`、一定に保ちたい角丸や突起を `px` で指定すると、角丸や突起の大きさを保ったまま幅だけが伸縮する吹き出しを作れる
- 複数の `curve` と 2 つの制御点を組み合わせることで、要素の外側へ膨らむ複雑な有機的図形も CSS だけで記述できる
- `shape()` は `offset-path` にも利用でき、コンテナー幅へ追従するモーションパスを定義できる

## 参考

- [CSS shape() 関数 - CSS | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Reference/Values/basic-shape/shape)
- [CSS Shapes Module Level 1](https://drafts.csswg.org/css-shapes/)
- [CSS Masking Module Level 1 - Clipping Paths](https://www.w3.org/TR/css-masking-1/#clipping-paths)
- [Motion Path Module Level 1](https://www.w3.org/TR/motion-1/)
- [CSSWG issue #10647: Overload `path()` for CSS-y SVG path syntax instead of taking up `shape()`](https://github.com/w3c/csswg-drafts/issues/10647)
