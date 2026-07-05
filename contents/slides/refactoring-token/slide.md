---
marp: true
theme: default
size: 16:9
class: invert
description: ボーイスカウトルールでメモリやスキルを改善しよう - エージェントの「迷い」はトークンの浪費
style: |
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Noto+Sans+JP:wght@300;400;500;600;700;800;900&display=swap');

  :root {
    --stone-50: #fafaf9;
    --stone-100: #f5f5f4;
    --stone-200: #e7e5e4;
    --stone-300: #d6d3d1;
    --stone-400: #a8a29e;
    --stone-500: #78716c;
    --stone-600: #57534e;
    --stone-700: #44403c;
    --stone-800: #292524;
    --stone-900: #1c1917;
    --stone-950: #0c0a09;
    --accent: #5eead4;
    --accent-dim: #2dd4bf;
    --accent-muted: rgba(94, 234, 212, 0.15);
  }

  section {
    background: var(--stone-950);
    color: var(--stone-200);
    font-family: 'Noto Sans JP', 'Inter', sans-serif;
    font-weight: 400;
    font-size: 30px;
    line-height: 1.6;
    padding: 56px 64px 52px;
    position: relative;
  }

  section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background:
      radial-gradient(ellipse at 10% 90%, rgba(94, 234, 212, 0.06) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 10%, rgba(94, 234, 212, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  section::after {
    content: "";
    position: absolute;
    inset: 24px;
    border: 1px solid rgba(245, 245, 244, 0.06);
    pointer-events: none;
  }

  h1, h2, h3 {
    margin: 0 0 0.6em;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #ffffff;
  }

  h1 {
    font-size: 58px;
    font-weight: 800;
  }

  h2 {
    font-size: 46px;
    font-weight: 700;
    border-bottom: 2px solid var(--accent-muted);
    padding-bottom: 0.3rem;
  }

  h3 {
    font-size: 34px;
    font-weight: 700;
    color: var(--accent);
  }

  p, li {
    color: var(--stone-300);
  }

  strong {
    color: #ffffff;
    font-weight: 700;
  }

  em {
    color: var(--accent);
    font-style: normal;
  }

  a {
    color: var(--accent-dim);
    text-decoration: underline;
    text-underline-offset: 0.14em;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.82em;
    background: var(--stone-800);
    color: var(--accent);
    border: 1px solid var(--stone-700);
    border-radius: 6px;
    padding: 0.14em 0.32em;
  }

  pre {
    margin: 0.8em 0;
    padding: 18px 20px;
    border-radius: 10px;
    border: 1px solid var(--stone-700);
    background: linear-gradient(135deg, var(--stone-900), var(--stone-800));
    font-size: 20px;
    line-height: 1.45;
  }

  pre code {
    background: transparent;
    border: 0;
    color: var(--stone-200);
    padding: 0;
  }

  ul, ol {
    margin: 0.4em 0 0;
    padding-left: 0;
  }

  li {
    list-style: none;
    position: relative;
    padding-left: 1.8rem;
    margin: 0.32em 0;
  }

  li::before {
    content: '▸';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-weight: bold;
    font-size: 1.1em;
  }

  blockquote {
    margin: 1em 0;
    padding: 0.9em 1em;
    border-left: 4px solid var(--accent);
    background: var(--accent-muted);
    border-radius: 0 8px 8px 0;
    color: var(--stone-100);
  }

  blockquote p {
    color: var(--stone-200);
    font-size: 1.0rem;
    margin: 0;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 24px;
  }

  th, td {
    border: 1px solid var(--stone-700);
    padding: 12px 14px;
    text-align: left;
  }

  th {
    color: #ffffff;
    background: var(--stone-800);
  }

  img {
    border-radius: 8px;
  }

  .eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 17px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--stone-400);
    margin-bottom: 18px;
  }

  .lead {
    font-size: 34px;
    line-height: 1.5;
    color: var(--stone-100);
  }

  .muted {
    color: var(--stone-400);
  }

  .accent {
    color: var(--accent);
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero {
    display: grid;
    place-items: center;
    text-align: center;
    height: 100%;
    align-content: center;
    gap: 18px;
  }

  .title {
    max-width: 16em;
  }

  .mono {
    font-family: 'JetBrains Mono', monospace;
  }

  .columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: start;
  }

  .columns-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: stretch;
  }

  .card {
    background: var(--accent-muted);
    border: 1px solid rgba(94, 234, 212, 0.2);
    border-radius: 10px;
    padding: 18px 20px;
  }

  .card h3, .card h4 {
    margin-top: 0;
  }

  .label {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 10px;
  }

  .big {
    font-size: 44px;
    line-height: 1.35;
    color: var(--stone-100);
  }

  .statement {
    font-size: 40px;
    line-height: 1.5;
    color: var(--stone-100);
    text-align: center;
    margin: 1.2em 0;
  }

  .statement strong {
    color: #ffffff;
  }

  .huge {
    font-size: 64px;
    line-height: 1.1;
    color: #ffffff;
  }

  .quote {
    font-size: 40px;
    line-height: 1.4;
    color: var(--stone-100);
  }

  .fit {
    font-size: 24px;
  }

  .small {
    font-size: 20px;
  }

  .tiny {
    font-size: 16px;
  }

  .divider {
    height: 1px;
    background: var(--stone-700);
    margin: 18px 0;
  }

  .flow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin: 1em 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 26px;
  }

  .flow .node {
    background: var(--stone-800);
    border: 1px solid var(--stone-700);
    border-radius: 10px;
    padding: 14px 22px;
    color: var(--stone-100);
  }

  .flow .arrow {
    color: var(--accent);
    font-size: 30px;
  }
---

<div class="hero">
  <div class="eyebrow">リファクタリングのためのトークン節約術</div>
  <h1 class="title">ボーイスカウトルールで<br />メモリやスキルを改善しよう</h1>
  <div class="lead">エージェントの迷いを減らしてトークン節約</div>
  <div class="mono muted">azukiazusa · 2026.07.16</div>
</div>

<!--
「ボーイスカウトルールでメモリやスキルを改善しよう」というタイトルでお話しします。
一言でいうと、エージェントの「迷い」はトークンの浪費であり、日々のタスクのついでにメモリやスキルを少しずつ改善することが、そのままトークン節約になるという話です。
-->

---

## 自己紹介

<div class="columns">

<div class="card">

- **azukiazusa**
- Frontend Engineer
- https://azukiazusa.dev
- 週に 1 回、Web 開発と AI の記事を書いています
- FE（フロントエンド | ファイアーエムブレム）が好き

</div>

<div class="center">

![w:280](../mcp-server/images/azukiazusa.png)

</div>

</div>

<!--
簡単に自己紹介です。
azukiazusa という名前で活動していて、フロントエンド中心に情報発信をしています。
最近は特に AI 周りの技術を扱うことが多いです。
-->

---

## エージェントの迷いは、トークンの浪費

- タスクの遂行がスムーズに進められないと、余計なトークンを消費する
  - 探索・試行錯誤・失敗からのリトライ
- 同じパターンのコードを実装するのに、毎回同じ調査をさせている
- 間違ったコードへの手直し指示

<div class="statement">「迷い」を減らすことが、そのままトークン節約になる</div>

<!--
まず今日の前提として、エージェントの迷いはトークンの浪費である、ということを抑えておきたいと思います。
これはエージェントがタスクの遂行をスムーズに進められないと、探索や試行錯誤、失敗からのリトライなどで余計なトークンを消費してしまう、ということです。
例えば、同じパターンのコードを実装するのに、毎回同じ調査をさせている場合や、間違ったコードへの手直し指示などがこれにあたります。

今日の発表では、こうした「迷い」を減らすことが、そのままトークン節約になる、という話をします。
-->

---

## 迷いの多くの原因はプロジェクトの暗黙知や典型作業の手順不足

- プロジェクト特有のルールや暗黙知が CLAUDE.md / AGENTS.md に書かれていない
- 典型的に繰り返す作業の手順がスキルとして明文化されていない

<div class="statement">わかっているが、なかなか言語化されなかったり、整理の時間が取れない</div>

<!--
エージェントの迷いの多くは、プロジェクト特有のルールや暗黙知が CLAUDE.md / AGENTS.md に書かれていないことや、典型的に繰り返す作業の手順がスキルとして明文化されていないことに起因します。
わかっているが、なかなか言語化されなかったり、整理の時間が取れない、ということはよくあります。

-->

---

## ボーイスカウトルール 来たときよりも美しく

> 自分が通った場所を、来たときよりも少しでも良くして帰る

<div class="small muted">Robert C. Martin「ボーイスカウト・ルール」『プログラマが知るべき97のこと』</div>

- 従来の対象は **コードやドキュメント** — ついでに少しだけリファクタリングする
- エージェント時代は **CLAUDE.md / AGENTS.md やスキルも同じルールの対象**になる
- タスクのついでに、メモリやスキルを少しだけ良くして帰る

<!--
そこで持ち出したいのが、プログラミングの世界で古くから知られるボーイスカウトルールです。
「自分が通った場所を、来たときよりも少しでも良くして帰る」という考え方で、「プログラマが知るべき97のこと」という本の中で紹介されています。
従来この対象はコードやドキュメントでした。触ったファイルをついでに少しリファクタリングして帰る、というやつです。
エージェント時代には、この対象に CLAUDE.md や AGENTS.md といったメモリ、そしてスキルが加わえるといいんじゃないか、考えています。
タスクを終えて帰るとき、メモリやスキルを少しだけ良くして帰る。これを習慣にしようという提案です。
-->

---

## 手を入れるポイントはエージェントが迷った箇所

- タスクの様子を観察して、**迷っていた箇所・失敗した箇所**を見つける
- ハーネスが未整備の初期ほど**細かく観察**し、整備が進んだら**任せていく**
- マネジメントと同じ
  - 新人が入ったときはマイクロマネジメントで細かく見て、徐々に任せてマクロマネジメントに移行する

<!--
では、どこを良くすればいいのか。シグナルは「エージェントがタスクを進める中で迷っていた箇所はないか？」です。
そのためには、特にハーネスがまだ整備されていない初期の段階では、完全に自律で動かすのではなく、エージェントが作業する様子を観察するのがおすすめです。
これは人のマネジメントに似ています。最初はマイクロマネジメントで細かく見て、ハーネスが整ってきたら徐々に任せてマクロマネジメントに移行していく。
迷っていた箇所が見つかれば、そこが改善ポイントです。
-->

---

## 事例 1: 暗黙知を CLAUDE.md に書いたら一発で正しいコードに

**課題**: トラッキング用のデータ属性はプロジェクト特有のルール。何も伝えないと付けてくれず、**毎回後から手直しを指示**していた

```markdown
## トラッキング属性のルール

ユーザー操作を計測するため、ボタンやリンクなどの
インタラクティブ要素には必ず以下の属性を付与する

- `data-tracking-id="<画面名>-<操作名>"`
```

**結果**: CLAUDE.md にルールを明文化 → 最初から属性付きのコードが生成される

<!--
ここから実例を 2 つ紹介します。1 つ目はメモリ、CLAUDE.md の話です。
私のプロジェクトでは、ユーザー操作のトラッキングのためにデータ属性を付けるルールがあります。ただこれはプロジェクト特有のルールなので、エージェントにコードを書かせても当然付けてくれません。毎回後から「トラッキング属性を付けて」と追加で指示していました。
そこで、CLAUDE.md に属性と値のルールを明文化しました。すると、最初からトラッキング属性付きの正しいコードが生成されるようになりました。
後から手直しを指示するやり取りが丸ごと消えるので、その分のトークンがそのまま節約になります。こうしたプロジェクト特有の暗黙知こそ、CLAUDE.md に書く価値があります。
-->

---

## 事例 2: API 追加のたびに、同じ調査を繰り返していた

<div class="flow">
  <div class="node">apiClient</div>
  <div class="arrow">→</div>
  <div class="node">service</div>
  <div class="arrow">→</div>
  <div class="node">hooks</div>
</div>

- API 追加のたびに、**このレイヤー構造の調査から**作業が始まっていた
- 各レイヤーで**テストを書くルールが守られない**ことがあった
- service 追加時に必要な作業が漏れて**失敗することが何度か**あった

<!--
2 つ目はスキルの話です。
私のプロジェクトでは、フロントエンドから API を呼び出すとき、apiClient、service、hooks というレイヤー構造になっています。
エージェントに API 追加を頼むと、毎回このプロジェクト構造の調査から作業が始まっていました。しかも調査した上でも、各レイヤーでテストを書くルールが守られなかったり、service レイヤー追加時に必要な作業が漏れて失敗することが何度かありました。
毎回同じ調査にトークンを使い、さらに失敗のリトライでもトークンを使う。典型的な「迷い」です。
-->

---

## 手順をスキル化する

```markdown
---
name: add-api
description: フロントエンドに API 呼び出しを追加する手順
---

1. apiClient にエンドポイントの型と定義を追加
2. service に変換ロジックを実装し、テストを書く
3. hooks から service を呼び出し、テストを書く
4. `npm run typecheck && npm run test` で検証する
```

- 事前調査なしで**すぐに作業へ着手**できるようになった
- 手順と検証方法が明文化され、**作業漏れによる失敗が減った**

<!--
そこで、API の追加手順と検証手順をスキルとして明文化しました。これは実物を一般化したイメージです。
どのレイヤーに何を追加するか、テストをどう書くか、最後にどう検証するかまで書いてあります。
効果は 2 つありました。まず、毎回の事前調査が不要になり、すぐ作業に取りかかれるようになり、そして手順が明文化されたことで、作業漏れによる失敗が減りました。
-->

---

## スキルはエージェント自身に書かせる

> 今行った作業と私からのフィードバックを元に、
> 次回から実行できるスキルとして保存して

- タスク完了直後ならコンテキストが残っている
- タスクの帰り際にスキルを 1 つ残す = ボーイスカウトルールを片手間にできる

<!--
スキル作成のおすすめのやり方を 1 つ紹介します。スキルは自分で書くのではなく、エージェント自身に書かせることです。
タスクが終わった直後に、「今行った作業と私からのフィードバックを元に、スキルとして実行できるようにして」と頼むと、結構正確に作ってくれます。
タスク直後ならコンテキスト残っているので、実際にやった手順や、途中で受けた指摘まで含めて正確にスキルに落とし込めます。
タスクの帰り際にスキルを 1 つ残して帰るというボーイスカウトルールを、それほど負担に感じず片手間でできる、というのがポイントです。
-->

---

## 改善はタスクと同じコミット / PR に含める

- ついでのリファクタリングと同じようにメモリ・スキルの差分もそのまま PR へ
- 「改善のための専用タスク」を作ると優先度が下がり、結局やらなくなる
- レビューを通じチームに共有
  - 自分のエージェントが迷う場所は、チームのエージェントも迷う
  - 改善がそのままチーム全体のトークン節約に

<!--
そして、書いた改善はどう取り込むか。コードのついでリファクタリングをそのコミットに含めるのと同じように、CLAUDE.md やスキルの差分も、タスクと同じコミット、同じ PR に含めてしまうのがおすすめです。
「メモリ改善のための専用タスク」を別に切ると、優先度が下がって結局やらなくなります。ついでだから続けられる、というのがボーイスカウトルールの肝です。
もう 1 つの利点はレビューです。PR に含まれていればチームメンバーの目に触れ、知識として共有されます。エージェントが迷った箇所は、同じチームの他のメンバーのエージェントも同じように迷うはずなので、改善がそのままチーム全体のトークン節約になります。
-->

---

## 削るのもボーイスカウトルール

- 書き足すだけではコンテキストが肥大化
- 言語規約や一般論は書かず、プロジェクト特有の暗黙知を中心に書く
- 汎用スキルは個人インストールと重複しやすい — 例: PR 作成スキル
- 実際に、AI 時代初期に追加した汎用スキルは見直して削除した

<!--
最後にスキルやメモリを消す勇気を持つことをおすすめします。
メモリやスキルは読み込まれるだけでトークンを消費します。書き足すだけだとコンテキストが肥大化して、それ自体がトークンの浪費になります。

例えば、一般的な言語規約や一般論は書かず、プロジェクト特有の暗黙知を中心に書くことです。汎用スキルは個人インストールと重複しやすいので、例えば PR 作成スキルなどは削除しました。
-->

---

## まとめ

- エージェントの「迷い」はトークンの浪費 — **迷った箇所がメモリ・スキルの改善ポイント**
- 暗黙知は CLAUDE.md へ、繰り返し作業はスキルへ — ボーイスカウトルールで少しずつ改善
- ただ追加するだけでなく、一般論や重複は削るなど継続的な改善を

<!--
まとめです。
エージェントの迷いはトークンの浪費です。迷った箇所を見つけたら、そこがメモリやスキルの改善ポイントです。

暗黙知は CLAUDE.md に、繰り返し作業はスキルに、ボーイスカウトルールで少しずつ改善していきましょう。
ただ追加するだけでなく、一般論や重複は削るなど、継続的な改善を心がけることも大事です。
-->

---

<div class="hero">
  <div class="eyebrow">Thank You</div>
  <div class="huge">ご清聴ありがとうございました</div>
  <div class="lead">azukiazusa.dev</div>
</div>

<!--
ご清聴ありがとうございました。
明日のタスクの帰り際に、メモリかスキルを 1 つだけ良くして帰ってみてください。
-->
