---
id: IBEZc5xm5hg26rjhJ1BBr
title: "AI エージェントを通じてコードとキャンバスを接続するデザインツール Paper を試してみた"
slug: "ai-agent-design-tool-paper"
about: "Paper は AI エージェントを通じてコードとキャンバスを双方向に接続するデザインツールで、AI にデザインの作成やコードへの変換を任せることができます。Paper の MCP サーバーのツールを組み合わせることでキャンバス上のノードの情報を取得したり、デザインを挿入・編集したりすることができます。この記事では実際に Paper を試して、コードからデザインへ、デザインからコードへの双方向のワークフローがどのように実現されているのかを紹介します。"
createdAt: "2026-02-26T19:45+09:00"
updatedAt: "2026-02-26T19:45+09:00"
tags: ["paper", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7rqE4zkCECM9mbHv46AmMq/de8d72510c4369f86d04feee21bfbeb3/airmail_17225-768x591.png"
  title: "エアメールのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "作業完了後に `finish_working_on_nodes()` ツールを呼び出す目的は何ですか？"
      answers:
        - text: "デザインファイルを保存するため"
          correct: false
          explanation: null
        - text: "ノードをすべて削除するため"
          correct: false
          explanation: null
        - text: "AI が編集中であることを示すインジケーターを解除するため"
          correct: true
          explanation: "MCP サーバーの実行中は Paper のキャンバス上で AI が編集中であることを示すインジケーターが表示されます。`finish_working_on_nodes()` を呼び出すことでこのインジケーターを解除できます。"
        - text: "キャンバスの変更を元に戻すため"
          correct: false
          explanation: null
published: true
---
[Paper](https://paper.design/) は Web 標準に基づいて構築されたデザインツールです。AI エージェントを通じてキャンバスからコードに変換し、そしてまたコードからキャンバスに同期するという双方向のワークフローを提供しています。デザインにおける典型的なタスクを AI エージェントに任せることで、より創造的な作業に集中できるようにすることが Paper の目的の 1 つです。

この記事では実際に Paper を試してどのようにコードとキャンバスを接続するワークフローが実現されているのかを紹介します。

## Paper を始める

Paper にはブラウザ版とデスクトップ版があります。Paper と AI エージェントを接続するための MCP サーバーはデスクトップ版でのみ利用できるので、今回はデスクトップ版を使用しています。https://paper.design/downloads から OS に合ったバージョンをダウンロードしてインストールしてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/7COYYSwpIIFyt6JZywSSJP/3a071809ada4ae8c3bb196aac1b4ff86/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_19.53.40.png)

Paper を起動したら Sign in 画面が表示されるので、アカウントを作成してサインインしてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/1CrNzCX750ARuYOUB9DOLu/0661f97c7c2d126360033b39b209ff29/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_19.57.22.png)

サインインが完了すると、サンプルのキャンバスが表示されます。左側のサイドバーにはレイヤーの構造が表示され、右側のサイドバーにはプロパティパネルが表示されていて、一般的なデザインツールと同様の UI になっています。

![](https://images.ctfassets.net/in6v9lxmm5c8/78CAXynSSryn6A5ApPEMU0/9edd97966746fae4437d60251eb5d52b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_19.59.24.png)

## Claude Code と接続してデザインを作成する

AI エージェントを使用したワークフローを試すために、Paper を Claude Code と接続してみましょう。以下のコマンドをターミナルで実行して、Paper の MCP サーバーを Claude Code に登録します。

```bash
claude mcp add paper --transport http http://127.0.0.1:29979/mcp --scope user
```

Claude Code を起動して `/mcp` コマンドを実行すると、Paper の MCP サーバーがリストに表示されているのがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/3kRe1VZ6fdXutOoc81LGMx/89fbee9c23fb5ba68371db0dd94c08d4/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_20.05.55.png)

Paper の MCP サーバーでは以下のツールが提供されています。

- get_basic_info — ファイル名、ページ名、アートボード一覧、使用フォントなどの基本情報を取得
- get_selection — 現在選択中のノードの詳細情報を取得
- get_node_info — 指定 ID のノードの詳細情報（サイズ、表示状態、親子関係、テキスト内容など）を取得
- get_children — 指定ノードの直接の子ノード一覧を取得
- get_tree_summary — ノードのサブツリー階層をコンパクトなテキストで表示
- get_screenshot — 指定ノードのスクリーンショットを撮影
- get_jsx — ノードの JSX コード表現を取得（Tailwind / inline-styles）
- get_computed_styles — ノードの算出済み CSS スタイルを取得（バッチ対応）
- get_fill_image — 画像フィルを持つノードから画像データを抽出
- get_font_family_info — フォントファミリーの利用可否・ウェイト・スタイル情報を確認
- get_guide — 特定トピックの詳細ガイドを取得（例: Figma インポート手順）
- create_artboard — 新しいアートボード（トップレベルフレーム）を作成
- write_html — HTML を解析してデザインノードとして挿入（insert-children / replace モード）
- update_styles — ノードのスタイルを更新（バッチ対応）
- set_text_content — テキストノードの内容を変更（バッチ対応）
- rename_nodes — レイヤー名を変更（バッチ対応）
- duplicate_nodes — ノードを複製（子孫含むディープクローン）
- delete_nodes — ノードを削除（子孫も含む）
- finish_working_on_nodes — 編集中インジケーターを解除（作業完了時に呼ぶ）

実際に Claude Code を使用して新しいデザインを作成してもらいましょう。Paper デスクトップ上で新しいキャンバスを作成して、Claude Code で以下のプロンプトを送信してみてください。

```txt
Paper MCP サーバーでミニマル・モダンなシングルページのポートフォリオを作成して。アースカラーの温かみあるパレットを使い、青・紫・ネオンは一切使わないこと。
カラー設計：背景はオフホワイト(#F5F0EB)、メイン文字はダークチャコール(#2C2825)、サブ文字はウォームグレー(#8A7F76)、アクセントはテラコッタ(#C07050)、カード背景はソフトベージュ(#EDE6DD)、ボーダーはカーキ(#C4B9A8)。
セクション構成：ヒーロー（名前を大きなセリフ体で、名前の下にテラコッタの細い下線、キャッチコピーをサンセリフで）→ About（左に丸型写真＋カーキのボーダー、右に自己紹介文）→ Works（ベージュ背景の角丸カード2列グリッド、ホバーでテラコッタのボーダー）→ Skills（カーキ背景のピル型タグ横並び）→ Contact（中央揃え、「Say Hello」をセリフ体で、メールリンクをテラコッタ色に）。
グラデーション・光彩・重い影は使わない。余白をたっぷり取ること。
```

初めに `get_basic_info()` ツールと `get_font_family_info()` ツールでキャンバスの基本情報と使用可能なフォントを確認します。ここで取得されるのは現在デスクトップアプリ上で開いているキャンバスの情報です。基本的な情報を取得した後、`create_artboard()` ツールで新しいアートボードを作成してから `write_html()` ツールで HTML を使用してデザインを挿入します。

![](https://images.ctfassets.net/in6v9lxmm5c8/OqV3CExK3aYSExSba3rmV/204b95a3f67cefaa9c5a9622c12d1d2e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_20.18.52.png)

`write_html()` ツールを使用することで AI の学習データが豊富な HTML/CSS の知識を活用して、複雑なレイアウトやスタイルのデザインを生成したうえでノードとしてキャンバスに挿入できるという点が Paper のワークフローの大きな特徴の 1 つです。

```sh
⏺ paper - write_html (MCP)(html: "<div layer-name=\"Nav\" style=\"display: flex; justify-content: space-between;
                           align-items: center; padding: 32px 120px;\">\n  <span style=\"font-family: 'Playfair
                          Display', serif; font-weight: 600; font-size: 18px; color: #2C2825; letter-spacing:
                          -0.01em;\">YK.</span>\n  <div style=\"display: flex; gap: 40px; align-items:
                          center;\">\n    <span style=\"font-family: 'DM Sans', sans-serif; font-weight: 400;
                          font-size: 14px; color: #8A7F76; letter-spacing: 0.05em; text-transform:
                          uppercase;\">About</span>\n    <span style=\"font-family: 'DM Sans', sans-serif;
                          font-weight: 400; font-size: 14px; color: #8A7F76; letter-spacing: 0.05em;
                          text-transform: uppercase;\">Works</span>\n    <span style=\"font-family: 'DM Sans',
                          sans-serif; font-weight: 400; font-size: 14px; color: #8A7F76; letter-spacing: 0.05em;
                           text-transform: uppercase;\">Contact</span>\n  </div>\n</div>", targetNodeId: "1-0",
                          mode: "insert-children")
```

MCP サーバーの実行中は Paper のキャンバス上で AI が編集中であることを示すインジケーターが表示されています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6JdpakYsini2oKBYsB3lbW/fc08e845a3d7ec3d57d32c4c27eff175/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_20.20.00.png)

個別にノードを編集するような場合には `node_id` を指定して `update_styles()` ツールや `set_text_content()` ツールを使用してスタイルやテキストの内容を更新できます。

```
⏺ paper - update_styles (MCP)(updates: [{"nodeIds":["K-0"],"styles":{"paddingBottom":"80px"}}])
```

デザインが完了したら `get_screenshot()` ツールでスクリーンショットを撮影し、作成したデザインを AI 自身がレビューします。

![](https://images.ctfassets.net/in6v9lxmm5c8/1BDt7cEnVAZU1lIY7eeJVS/04279a3c072d97937caf4d03d87160ef/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_20.31.26.png)

最後に `finish_working_on_nodes()` ツールを呼び出して、AI が編集中であることを示すインジケーターを解除します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3ln0u8A1Au5L2mxSecmZaT/57e71c23397f31a5d5374449f26bb22b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_20.32.56.png)

最終的に以下のようなデザインが完成しました。

![](https://images.ctfassets.net/in6v9lxmm5c8/mAuS9jvjhGDFtHdbaVTLD/f6f4bf4fef3561cac07f36f37f6517aa/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_20.34.08.png)

## デザインからコードへ変換する

続いて先程作成したデザインをコードに変換してみましょう。あらかじめ Next.js + Tailwind CSS のプロジェクトを用意しておきます。

```bash
npx create-next-app@latest
```

以下のようなプロンプトを Claude Code に送信して、先程作成したデザインをコードに変換するように指示します。

```txt
Paper で作成したポートフォリオのデザインを Next.js と Tailwind CSS を使用したコードに変換して。
```

まずは `get_basic_info()`,　`get_tree_summary()`, `get_screenshot()`, `get_computed_styles()` といったツールを使用してキャンバス上のノードの構造やデザインのスクリーンショットを取得します。`get_computed_styles()` では CSS のスタイルとして取得できていることがわかります。

```sh
⏺ paper - get_computed_styles (MCP)(nodeIds: ["1H-0","1I-0","1J-0","I-0","J-0","22-0","21-0"])
  ⎿  {
       "1H-0": {
         "display": "flex",
         "flexWrap": "wrap",
         "gap": "12px"
       },
       "1I-0": {
         "display": "inline-block",
         "borderRadius": "calc(infinity * 1px)",
         "paddingBlock": "10px",
         "paddingInline": "24px",
         "backgroundColor": "#C4B9A8"
       },
```

以下のように React と Tailwind CSS を使用したコードが生成されました。`px-[120px]` のように arbitrary value を多用しているところが少し気になりますが、全体的に非常に正確にデザインがコードに変換されていることがわかります。今回は `get_jsx()` ツールを使用してくれなかったのですが、AI が選択するツールによって、コードの表現方法が変わる可能性があります。

```tsx:app/page.tsx
const works = [
...
];

const skills = [
...
];

export default function Portfolio() {
  return (
    <div
      className="bg-bg text-primary min-h-screen"
      style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
    >
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-[120px] py-8 bg-bg/80 backdrop-blur-sm">
        <span
          className="text-[18px] font-semibold tracking-[-0.01em] text-primary"
          style={{ fontFamily: "var(--font-playfair), system-ui, serif" }}
        >
          YK.
        </span>
        <div className="flex items-center gap-10">
          {["About", "Works", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[14px] font-normal uppercase tracking-[0.05em] text-secondary hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center pt-[100px] pb-[120px] px-[120px]">
        <h1
          className="text-[72px] font-bold tracking-[-0.03em] leading-[80px] text-primary"
          style={{ fontFamily: "var(--font-playfair), system-ui, serif" }}
        >
          Yuki Kobayashi
        </h1>
        <div className="w-[60px] h-[2px] bg-accent mt-6" />
        <p className="text-[18px] font-light tracking-[0.02em] leading-7 text-secondary mt-7">
          Product Designer &amp; Visual Storyteller
        </p>
      </section>

      {/* About */}
      <section
        id="about"
        className="flex items-start gap-[80px] py-[80px] px-[120px]"
      >
        <div className="w-[200px] h-[200px] rounded-full border-2 border-muted overflow-hidden shrink-0">
          <div
            className="w-full h-full"
            style={{ backgroundColor: "#DDDDDD" }}
          />
        </div>
        <div className="flex flex-col gap-5 max-w-[920px]">
          <h2
            className="text-[32px] font-semibold tracking-[-0.02em] leading-10 text-primary"
            style={{ fontFamily: "var(--font-playfair), system-ui, serif" }}
          >
            About
          </h2>
          <div className="w-[32px] h-[2px] bg-accent" />
          <p className="text-[16px] font-normal leading-7 text-secondary">
            東京を拠点に活動するプロダクトデザイナー。ミニマルで温かみのあるデザインを信条に、ブランドアイデンティティからUI/UXまで幅広く手がけています。余白と素材感を大切にしたデザインで、使う人の日常にそっと寄り添うプロダクトを目指しています。
          </p>
          <p className="text-[16px] font-normal leading-7 text-secondary">
            前職では大手テクノロジー企業のデザインチームに所属し、数百万人が使うアプリケーションのリデザインを主導しました。現在はフリーランスとして、スタートアップから伝統企業まで多様なクライアントと協業しています。
          </p>
        </div>
      </section>

      {/* Works */}
      <section id="works" className="flex flex-col gap-10 py-[80px] px-[120px]">
        <div className="flex flex-col gap-5">
          <h2
            className="text-[32px] font-semibold tracking-[-0.02em] leading-10 text-primary"
            style={{ fontFamily: "var(--font-playfair), system-ui, serif" }}
          >
            Works
          </h2>
          <div className="w-[32px] h-[2px] bg-accent" />
        </div>
        <div className="flex flex-wrap gap-8">
          {works.map((work) => (
            <div
              key={work.title}
              className="w-[568px] rounded-xl overflow-hidden bg-card shrink-0"
            >
              <div
                className="h-[320px] w-full"
                style={{ background: work.gradient }}
              />
              <div className="flex flex-col gap-2 px-7 pt-7 pb-8">
                <span className="text-[12px] font-normal uppercase tracking-[0.08em] leading-4 text-accent">
                  {work.category}
                </span>
                <h3
                  className="text-[22px] font-semibold tracking-[-0.01em] leading-[30px] text-primary"
                  style={{
                    fontFamily: "var(--font-playfair), system-ui, serif",
                  }}
                >
                  {work.title}
                </h3>
                <p className="text-[14px] font-normal leading-[22px] text-secondary">
                  {work.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="flex flex-col gap-10 py-[80px] px-[120px]">
        <div className="flex flex-col gap-5">
          <h2
            className="text-[32px] font-semibold tracking-[-0.02em] leading-10 text-primary"
            style={{ fontFamily: "var(--font-playfair), system-ui, serif" }}
          >
            Skills
          </h2>
          <div className="w-[32px] h-[2px] bg-accent" />
        </div>
        <div className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full px-6 py-[10px] bg-muted text-primary text-[14px] font-medium tracking-[0.02em] leading-[18px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="flex flex-col items-center text-center pt-[100px] pb-[120px] px-[120px] gap-6"
      >
        <h2
          className="text-[40px] font-semibold tracking-[-0.02em] leading-[48px] text-primary"
          style={{ fontFamily: "var(--font-playfair), system-ui, serif" }}
        >
          Say Hello
        </h2>
        <div className="w-[32px] h-[2px] bg-accent" />
        <p className="text-[16px] font-normal leading-[26px] text-secondary max-w-[480px]">
          お仕事のご依頼やご相談など、お気軽にお問い合わせください。
        </p>
        <a
          href="mailto:hello@yukikobayashi.design"
          className="text-[16px] font-medium tracking-[0.02em] leading-5 text-accent mt-2 hover:opacity-70 transition-opacity"
        >
          hello@yukikobayashi.design
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-muted flex justify-center py-8 px-[120px]">
        <span className="text-[13px] font-normal tracking-[0.02em] leading-4 text-muted">
          © 2026 Yuki Kobayashi. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
```

実際にブラウザでコードを確認してみると、Paper 上のデザインと非常に近い見た目で表示されていることがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6zpAlCJhYgjJRDZwNCvQFV/37be37f716a4ad9662a219ca8ea0e980/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_21.03.19.png)

## コードからデザインへ変換する

最後にコードを変更してから、Paper 上のデザインに変更を反映してみましょう。双方向にコードとデザインを変換することで、できる限り本番のコードに近い状態でデザインを維持できるというメリットがあります。試しに先程のコードの Nav コンポーネントの背景を半透明の白に変更してみましょう。

```diff:app/page.tsx
- <nav className="sticky top-0 z-50 flex items-center justify-between px-[120px] py-8 bg-bg/80 backdrop-blur-sm">
+ <nav className="sticky top-0 z-50 flex items-center justify-between px-[120px] py-8 bg-white/80 backdrop-blur-sm">
```

以下のようなプロンプトを Claude Code に送信して、コードの変更を Paper 上のデザインに反映するように指示します。

```txt
コードの Nav コンポーネントの背景を半透明の白に変更したから、Paper 上のデザインにも同じ変更を反映して。
```

現在のコードの状態を確認したうえで、`update_styles()` ツールを使用して Nav コンポーネントの背景スタイルを更新してくれました。

![](https://images.ctfassets.net/in6v9lxmm5c8/2rKHBq8eZpRnbCBC2jmFKL/324b2008409c5902dbb5895a40b53299/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_21.08.15.png)

最終的にコードとデザインの両方で Nav コンポーネントの背景が半透明の白に変更されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/1DE58otTzHluJN2ycipUtu/c2892e4f7977c2021dd042543d6cc34a/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-02-26_21.11.31.png)

## まとめ

- Paper は AI エージェントを通じてコードとキャンバスを双方向に接続するデザインツールで、AI にデザインの作成やコードへの変換を任せることができる
- Paper の MCP サーバーは様々なツールを提供していて、AI はこれらのツールを組み合わせることでキャンバス上のノードの情報を取得したり、デザインを挿入・編集したりできる
- コードからデザインへ、デザインからコードへの双方向の変換が可能で、できる限り本番のコードに近い状態でデザインを維持できる

## 参考

- [Paper MCP server · Paper](https://paper.design/docs/mcp)
