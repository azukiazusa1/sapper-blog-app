---
id: dvLdwU0DC21mMtrb16kpy
title: "Chrome DevTools MCP で AI エージェントのフロントエンド開発をサポートする"
slug: "chrome-devtools-mcp"
about: "自律的な AI エージェントを利用したコーディングでは、生成したコードを実行した結果からフィードバックを得て、コードを改善していく反復的なプロセスが重要です。しかし、フロントエンド開発では、生成したコードはブラウザ上で実行されるため、AI エージェントが直接コードを実行したり、ブラウザのコンソールログを取得したりすることは困難です。Chrome DevTools MCP はこの課題を解決するためのツールです。"
createdAt: "2025-09-27T10:46+09:00"
updatedAt: "2025-09-27T10:46+09:00"
tags: ["AI", "MCP", "claude-code"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/7MWQpUv9F2EyhF3VCjImu0/2cf9b69334dfff29af6fb5bcebd690f0/strawberry_parfait_16885.png"
  title: "いちごパフェのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Chrome DevTools MCP をClaude Code に追加するコマンドは何ですか？"
      answers:
        - text: "claude mcp install chrome-devtools npx chrome-devtools-mcp@latest"
          correct: false
          explanation: null
        - text: "claude mcp add chrome-devtools npx chrome-devtools-mcp@latest"
          correct: true
          explanation: ""
        - text: "claude install chrome-devtools-mcp"
          correct: false
          explanation: null
        - text: "claude mcp add chrome-devtools uvx chrome-devtools-mcp"
          correct: false
          explanation: null
    - question: "Chrome DevTools MCP で利用できるツールに含まれないものはどれですか？"
      answers:
        - text: "performance_start_trace"
          correct: false
          explanation: "パフォーマンストレースを開始するツールとして記事で紹介されています。"
        - text: "take_snapshot"
          correct: false
          explanation: "ページのスナップショットを取得するツールとして使用されています。"
        - text: "list_console_messages"
          correct: false
          explanation: "コンソールログを一覧表示するツールとして記事で使用されています。"
        - text: "list_cookies"
          correct: true
          explanation: ""

published: true
---

自律的な AI エージェントを利用したコーディングでは、生成したコードを実行した結果からフィードバックを得て、コードを改善していく反復的なプロセスが重要です。バックエンドや CLI ツールの開発では、生成したコードはターミナル上で実行されログが表示されるため、AI エージェントはコードの実行結果を容易に取得できます。しかし、フロントエンド開発では、生成したコードはブラウザ上で実行されるため、AI エージェントが直接コードを実行したり、ブラウザのコンソールログを取得したりすることは困難です。そのため人間の開発者がコードをブラウザで実行し、コンソールログを AI エージェントに提供する必要がありました。

[Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) はこの課題を解決するためのツールです。Chrome DevTools MCP により以下のことが可能になります。

- Puppeteer を使用して AI エージェントがブラウザを自動操作できるようにする
- コンソールログやネットワークログを取得したり、スクリーンショットを撮影したりすることで、デバッグ情報を AI エージェントに提供する
- トレース情報を取得して、パフォーマンスの問題を特定できるようにする

この記事では実際に Chrome DevTools MCP を使用した例を紹介します。

## MCP サーバーのセットアップ

Chrome DevTools MCP は [MCP (Model Context Protocol)](https://modelcontextprotocol.org/) に対応している AI エージェント（例えば Codex, Claude Code, Gemini）であればツールを問わず利用できます。この記事では Claude Code を使用した例を紹介します。

Claude Code では以下のコマンドで MCP サーバーを追加できます。

```bash
claude mcp add chrome-devtools npx chrome-devtools-mcp@latest
```

Claude Code を起動した後、`/mcp` コマンドを実行して `chrome-devtools` サーバーが追加されていることを確認します。エンターキーを押すと `chrome-devtools` が公開しているツールの一覧が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/70HtfGzlOIaxF1yJNlkI22/f3c0fe38c1917eecc0b4bdc8112fedc3/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_11.01.24.png)

## パフォーマンスの問題の特定

それでは実際に Chrome DevTools MCP を使用して、フロントエンドのパフォーマンスの問題を特定する例を紹介します。あらかじめ開発サーバーを http://localhost:5174 で起動しておきます。

以下のプロンプトを Claude Code に入力します。

```txt
http://localhost:5173/blog/yaml-file-defined-ai-agent-cagent/ のパフォーマンスをチェックしてください。
```

始めに `new_page` ツールを使用して http://localhost:5173/blog/yaml-file-defined-ai-agent-cagent/ ページを開きます。

![](https://images.ctfassets.net/in6v9lxmm5c8/2KJ76mO73weqhoS8O7b0c8/70f3d66d23eac295d6f9ea8f83889ce5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_11.08.10.png)

Puppeteer が起動して AI エージェントによりブラウザの操作が開始されます。続いて `performance_start_trace` ツールを呼び出してパフォーマンスのトレースを開始します。結果は Web Vitals のスコアとともに、どの点がパフォーマンスのボトルネックになっているかが示されます。

<details>
<summary>`performance_start_trace` ツールの実行結果</summary>

```
⎿ # performance_start_trace response
    The performance trace has been stopped.
    Here is a high level summary of the trace and the Insights that were
    found:
    Information on performance traces may contain main thread activity
    represented as call frames and network requests.

    Each call frame is presented in the following format:

    'id;eventKey;name;duration;selfTime;urlIndex;childRange;[S]'

    Key definitions:

    * id: A unique numerical identifier for the call frame. Never mention
    this id in the output to the user.
    * eventKey: String that uniquely identifies this event in the flame
    chart.
    * name: A concise string describing the call frame (e.g., 'Evaluate
    Script', 'render', 'fetchData').
    * duration: The total execution time of the call frame, including its
    children.
    * selfTime: The time spent directly within the call frame, excluding
    its children's execution.
    * urlIndex: Index referencing the "All URLs" list. Empty if no
    specific script URL is associated.
    * childRange: Specifies the direct children of this node using their
    IDs. If empty ('' or 'S' at the end), the node has no children. If a
    single number (e.g., '4'), the node has one child with that ID. If in
    the format 'firstId-lastId' (e.g., '4-5'), it indicates a consecutive
    range of child IDs from 'firstId' to 'lastId', inclusive.
    * S: _Optional_. The letter 'S' terminates the line if that call frame
     was selected by the user.

    Example Call Tree:

    1;r-123;main;500;100;;
    2;r-124;update;200;50;;3
    3;p-49575-15428179-2834-374;animate;150;20;0;4-5;S
    4;p-49575-15428179-3505-1162;calculatePosition;80;80;;
    5;p-49575-15428179-5391-2767;applyStyles;50;50;;


    Network requests are formatted like this:
    `urlIndex;eventKey;queuedTime;requestSentTime;downloadCompleteTime;pro
    cessingCompleteTime;totalDuration;downloadDuration;mainThreadProcessin
    gDuration;statusCode;mimeType;priority;initialPriority;finalPriority;r
    enderBlocking;protocol;fromServiceWorker;initiators;redirects:[[redire
    ctUrlIndex|startTime|duration]];responseHeaders:[header1Value|header2V
    alue|...]`

    - `urlIndex`: Numerical index for the request's URL, referencing the
    "All URLs" list.
    - `eventKey`: String that uniquely identifies this request's trace
    event.
    Timings (all in milliseconds, relative to navigation start):
    - `queuedTime`: When the request was queued.
    - `requestSentTime`: When the request was sent.
    - `downloadCompleteTime`: When the download completed.
    - `processingCompleteTime`: When main thread processing finished.
    Durations (all in milliseconds):
    - `totalDuration`: Total time from the request being queued until its
    main thread processing completed.
    - `downloadDuration`: Time spent actively downloading the resource.
    - `mainThreadProcessingDuration`: Time spent on the main thread after
    the download completed.
    - `statusCode`: The HTTP status code of the response (e.g., 200, 404).
    - `mimeType`: The MIME type of the resource (e.g., "text/html",
    "application/javascript").
    - `priority`: The final network request priority (e.g., "VeryHigh",
    "Low").
    - `initialPriority`: The initial network request priority.
    - `finalPriority`: The final network request priority (redundant if
    `priority` is always final, but kept for clarity if `initialPriority`
    and `priority` differ).
    - `renderBlocking`: 't' if the request was render-blocking, 'f'
    otherwise.
    - `protocol`: The network protocol used (e.g., "h2", "http/1.1").
    - `fromServiceWorker`: 't' if the request was served from a service
    worker, 'f' otherwise.
    - `initiators`: A list (separated by ,) of URL indices for the
    initiator chain of this request. Listed in order starting from the
    root request to the request that directly loaded this one. This
    represents the network dependencies necessary to load this request. If
     there is no initiator, this is empty.
    - `redirects`: A comma-separated list of redirects, enclosed in square
     brackets. Each redirect is formatted as
    `[redirectUrlIndex|startTime|duration]`, where: `redirectUrlIndex`:
    Numerical index for the redirect's URL. `startTime`: The start time of
     the redirect in milliseconds, relative to navigation start.
    `duration`: The duration of the redirect in milliseconds.
    - `responseHeaders`: A list (separated by '|') of values for specific,
     pre-defined response headers, enclosed in square brackets.
    The order of headers corresponds to an internal fixed list. If a
    header is not present, its value will be empty.



    URL: http://localhost:5173/blog/yaml-file-defined-ai-agent-cagent/
    Bounds: {min: 435301125305, max: 435312699642}
    CPU throttling: none
    Network throttling: none
    Metrics (lab / observed):
      - LCP: 6566 ms, event: (eventKey: r-19301, ts: 435307707442),
    nodeId: 108
      - LCP breakdown:
        - TTFB: 6,289 ms, bounds: {min: 435301141341, max: 435307430566}
        - Render delay: 277 ms, bounds: {min: 435307430566, max:
    435307707442}
      - CLS: 0.00
    Metrics (field / real users): n/a – no data for this page in CrUX
    Available insights:
      - insight name: DocumentLatency
        description: Your first network request is the most important.
    Reduce its latency by avoiding redirects, ensuring a fast server
    response, and enabling text compression.
        relevant trace bounds: {min: 1954, max: 435307478926}
        estimated metric savings: FCP 6182 ms, LCP 6182 ms
        estimated wasted bytes: 237.4 kB
        example question: How do I decrease the initial loading time of my
     page?
        example question: Did anything slow down the request for this
    document?
      - insight name: LCPBreakdown
        description: Each [subpart has specific improvement
    strategies](https://web.dev/articles/optimize-lcp#lcp-breakdown).
    Ideally, most of the LCP time should be spent on loading the
    resources, not within delays.
        relevant trace bounds: {min: 435301141341, max: 435307707442}
        example question: Help me optimize my LCP score
        example question: Which LCP phase was most problematic?
        example question: What can I do to reduce the LCP time for this
    page load?
      - insight name: NetworkDependencyTree
        description: [Avoid chaining critical requests](https://developer.
    chrome.com/docs/lighthouse/performance/critical-request-chains) by
    reducing the length of chains, reducing the download size of
    resources, or deferring the download of unnecessary resources to
    improve page load.
        relevant trace bounds: {min: 435301143791, max: 435307875467}
        example question: How do I optimize my network dependency tree?
      - insight name: DOMSize
        description: A large DOM can increase the duration of style
    calculations and layout reflows, impacting page responsiveness. A
    large DOM will also increase memory usage. [Learn how to avoid an
    excessive DOM size](https://developer.chrome.com/docs/lighthouse/perfo
    rmance/dom-size/).
        relevant trace bounds: {min: 435307502075, max: 435307635893}
        example question: How can I reduce the size of my DOM?
      - insight name: ThirdParties
        description: 3rd party code can significantly impact load
    performance. [Reduce and defer loading of 3rd party
    code](https://web.dev/articles/optimizing-content-efficiency-loading-t
    hird-party-javascript/) to prioritize your page's content.
        relevant trace bounds: {min: 435307448442, max: 435307693850}
        example question: Which third parties are having the largest
    impact on my page performance?
      - insight name: ForcedReflow
        description: A forced reflow occurs when JavaScript queries
    geometric properties (such as `offsetWidth`) after styles have been
    invalidated by a change to the DOM state. This can result in poor
    performance. Learn more about [forced reflows](https://developers.goog
    le.com/web/fundamentals/performance/rendering/avoid-large-complex-layo
    uts-and-layout-thrashing#avoid-forced-synchronous-layouts) and
    possible mitigations.
        relevant trace bounds: {min: 435307799228, max: 435307859520}
        example question: How can I avoid forced reflows and layout
    thrashing?
        example question: What is forced reflow and why is it problematic?
```

</details>

トレースの取得が完了したら `performance_analyze_insight` ツールを呼び出して、パフォーマンスの問題の分析を開始します。引数に指定されたインサイトの名前を詳細に分析し、改善方法を提案します。ここでは以下の 3 つのインサイトを 3 回に分けて分析しています。

- DocumentLatency
- LCPBreakdown
- ThirdParties

![](https://images.ctfassets.net/in6v9lxmm5c8/3ZxzujL1WIFHcbgQYfzPXs/8c7f8a2324c1862cf03173077ad8fbe5/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_11.17.46.png)

さらに `list_network_requests` ツールを呼び出して、ページのネットワークリクエストを一覧表示します。これにより、どのリソースが TTFB に影響を与えているかを特定します。

最終的に LCP と TTBF が遅いこと、HTML ファイルサイズが大きいこと、圧縮されていないこと、第三者スクリプトが多いことなど、パフォーマンスの問題点と改善策が提案されます。この結果を元に、AI エージェントにコードの改善を指示するといった使い方ができるでしょう。なお、実際にはこれらの問題の多くは本番用のビルドで解決できます。

<details>
<summary>Claude Code による分析結果の全文</summary>

```txt
⏺ パフォーマンス分析結果

  http://localhost:5173/blog/yaml-file-defined-ai-agent-cagent/
  のパフォーマンスに重大な問題があります：

  主要な問題

  1. 非常に遅いLCP (Largest Contentful Paint): 6,566ms
    - 推奨値は2.5秒以下ですが、2倍以上遅い
  2. TTFB (Time to First Byte)が非常に遅い: 6,289ms (LCP時間の95.8%)
    - サーバーレスポンスに6秒以上かかっている
    - 開発環境での異常に遅いレスポンス
  3. HTMLファイルサイズが大きい: 354,335バイト (約346KB)
    - 圧縮されていない
    - 一般的なHTMLページとしては大きすぎる

  特定された問題

  - Document Latency: サーバーが600ms以下で応答していない（実際は6秒超）
  - 圧縮未適用: レスポンスヘッダーにgzipやbrotliの圧縮が設定されていない
  - 第三者スクリプト: Google Tag Manager (201.4kB) が追加の負荷

  推奨改善策

  1. 開発サーバーの調査: localhost:5173での異常に遅いレスポンスの原因調査
  2. 圧縮の有効化: 本番環境でgzip/brotli圧縮を設定
  3. HTMLサイズの最適化: 大きなインラインスタイルやスクリプトの削減
  4. 第三者スクリプトの最適化: Google Analytics の遅延読み込み

  現在の開発環境では、サーバーレスポンスが通常の数十倍遅いため、本番環境で
  の検証も必要です。
```

</details>

## アクセシビリティ上の問題を特定

特定のページにアクセシビリティ上の問題がないかを確認できます。ページのスナップショットを取得（`take_snapshot`）したり、スクリプトを実行（`evaluate_script`）してページの要素に適切な属性が設定されているかを調査します。

以下のプロンプトを Claude Code に入力します。

```txt
http://localhost:5173/blog/shorts/7KZCLXbHxoaCfJ92aES3uE/ のアクセシビリティ上の問題を特定して
```

実行した結果プログレスバーに `valuetext` 属性が設定されおらず、スクリーンリーダーで正しく読み上げられない可能性があることなどが指摘されました。

```txt
⏺ アクセシビリティ上の問題点

  このページで特定したアクセシビリティ問題は以下の通りです：

  1. プログレスバーの問題

  - プログレスバー（uid=9_30）に valuetext が空になっている
  - 現在のスライド番号が読み上げソフトで適切に伝わらない

  2. 検索ボタンのラベル不足

  - 「検索 ⌘ K」ボタンに aria-label がない
  - キーボードショートカットの情報が視覚的にしか提供されていない

  ...

  推奨される修正

  1. プログレスバー: aria-valuetext="スライド 1 / 4"
  のような説明的なテキストを追加
  2. 検索ボタン: aria-label="検索を開く（Cmd+K）" を追加

  ...
```

推奨される修正を元に、AI エージェントにコードの改善を指示するといった使い方ができるでしょう。実装が完了したら、再度ページをリロードして変更が適切に反映されているか確認してくれます。`click` や `fill` ツールを使用したブラウザ操作も可能なので、スライドが移動した時に正しく値が更新されるかなども確認できるでしょう。

## コンソールのエラーを調査

フロントエンド開発をしていると、コードの上は正しくても実行時にコンソール上でエラーが表示されることがあります。このようなエラーは AI エージェントが直接確認できず今までは人間の手を介在してエラー情報を提供する必要がありました。Chrome DevTools MCP を使用すると AI エージェント自身が直接コンソールログを取得してエラーを調査できます。

カンバンツールアプリケーションの例を紹介します。ここではタスクを追加するダイアログを開いたとき、`aria-describedby` 属性が設定されていないためにアクセシビリティ上の警告が表示されるという問題が発生しています。

![](https://images.ctfassets.net/in6v9lxmm5c8/6moEUsy7dLxavZMKd2X3J7/6931c3c43a1446c5e1fdc7b101ba102c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_12.01.08.png)

Claude Code に同様のエラーをシミュレートさせ、コンソールエラーを調査させます。

```txt
http://localhost:3000/boards/cmbvl4wz80000f2zvno0k1wmd 画面において、ボードの「タスクを追加」ボタンをクリックしてダイアログを開いた時にコンソール上で warning が表示される問題を調査してください。
```

まずは `new_page` ツールで http://localhost:3000/boards/cmbvl4wz80000f2zvno0k1wmd ページを開きます。続いて `take_snapshot` ツールでページのスナップショットを取得し、どこに「タスクを追加」ボタンがあるかを確認します。その後スナップショットから取得した `uid` を元に `click` ツールで「タスクを追加」ボタンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4TsbB4wnUtfUAHzXYFCcHm/d9852d67fc565295070552d77d771300/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_12.07.38.png)

ダイアログが開かれたことを確認したら、`list_console_messages` ツールを呼び出してコンソールログを一覧表示します。warning の情報を分析し、ダイアログに `aria-describedby` 属性が設定するべきだと正しく問題が特定されました。このまま問題のソースコードの箇所を特定し、修正作業を行いました。

![](https://images.ctfassets.net/in6v9lxmm5c8/4DonMmNJS3oqVQ5lfbmyVk/1a445a26942f5f3b859b5aca75aeea1e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-27_12.10.26.png)

## まとめ

- AI エージェントを使用した開発では、生成したコードを実行した結果からフィードバックを得て、コードを改善していく反復的なプロセスが重要である。しかし、フロントエンド開発では AI エージェントが直接コードを実行したり、ブラウザのコンソールログを取得したりすることは困難であった。
- Chrome DevTools MCP を使用することで以下のことが可能になる。
  - Puppeteer を使用して AI エージェントがブラウザを自動操作できるようにする
  - コンソールログやネットワークログを取得したり、スクリーンショットを撮影したりすることで、デバッグ情報を AI エージェントに提供する
  - トレース情報を取得して、パフォーマンスの問題を特定できるようにする
- パフォーマンスの問題を特定する例では `performance_start_trace` ツールでパフォーマンスのトレースを開始し、`performance_analyze_insight` ツールでパフォーマンスの問題の分析を開始し、改善方法を提案した
- アクセシビリティ上の問題を特定する例では `take_snapshot` ツールでページのスナップショットを取得し、`evaluate_script` ツールでページの要素に適切な属性が設定されているかを調査した
- コンソールのエラーを調査する例では `list_console_messages` ツールを呼び出してコンソールログを一覧表示し、エラーの情報を分析し、問題を特定した

## 参考

- [AI エージェント用の Chrome DevTools（MCP）  |  Blog  |  Chrome for Developers](https://developer.chrome.com/blog/chrome-devtools-mcp?hl=ja)
- [ChromeDevTools/chrome-devtools-mcp: Chrome DevTools for coding agents](https://github.com/ChromeDevTools/chrome-devtools-mcp)
