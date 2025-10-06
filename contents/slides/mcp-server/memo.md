# MCP サーバーの基礎から実践レベルの知識まで（資料作成用メモ）

## 流れ

全体で 45 分程度を想定

1. MCP サーバーの基礎知識について（10分）
2. MCP サーバー構築デモ（15分）
3. MCP サーバーの応用的な知識について（20分）

## MCP サーバーの基礎知識について（10分）

- MCP とはなにか、なぜ必要か
  - LLM は知識カットオフがあるので、最新の情報を取得できない
    - 最新の情報や組織内の情報を取得するために外部ツールを利用する必要がある
  - 従来は外部ツールを利用するために function calling といった仕組みが使われてきた
    - 例えば天気情報を取得するために天気情報 API を呼び出したり、Slack API を呼び出してメッセージを送信したりする
    - しかし function calling はツールのインターフェースが標準化されておらず、LLM ごとに異なる
    - function calling を配布する手段もないので、開発者が独自に実装する必要がある
  - MCP はツールのインターフェースを標準化し、LLM が外部ツールを呼び出すための共通の方法を提供する
    - LSP（Language Server Protocol）の発想を参考にしている
    - MCP があるとできること
      - Google カレンダーに予定を追加する
      - Notion にメモを追加する
      - Web 検索を行う
- MCP の仕組み
  - MCP はクライアント・サーバーモデルを採用している
    - ホスト: Claude Desktop や Cursor といった LLM を搭載したアプリケーション
    - クライアント: MCP サーバーとの通信を担当
    - サーバー: 外部ツールを提供する MCP サーバー。クライアントからのリクエストを受け取り処理する
      - 図があると良い
  - MCP には 2 通りの通信方式がある
    - stdio: 標準入力/出力を使用した通信
    - streamable htttp: HTTP を使用した通信
    - sse: Server-Sent Events を使用した通信。互換性維持のために残されているが、streamable http の使用が推奨されている
  - MCP サーバーは JSON-RPC 2.0 を使用して通信する
    - 簡単な JSON のコード例を出す
  - MCP には以下の 3 つの機能がある
    - リソース: ユーザーや LLM がｓアクセスできるデータ
    - プロンプト: 再利用可能なプロンプトテンプレート
    - ツール: LLM が呼び出せる外部ツール
      - ツールが現在の主流機能であり、この発表でもツールに焦点を当てる

## MCP サーバー構築デモ（15分）

- 基本的な流れは https://azukiazusa.dev/blog/typescript-mcp-server/ を参考にする
- TypeScript SDK を使用して MCP サーバーを構築する
- サイコロが降った目を返すツールを実装する
- mcp inspector で動作確認する
- Claude Desktop で動作確認する

## MCP サーバーの応用的な知識について（20分）

- 本番レベルの MCP サーバーを構築したときの失敗談を元に MCP サーバーの応用的な知識を紹介する
- https://www.anthropic.com/engineering/writing-tools-for-agents の内容を参考にする
- MCP サーバーを単なる API のラッパーとして提供すると失敗する
  - API では　REST に基づいてエンドポイントが設計されるが、ツールはタスクベースで設計されるべき
    - 例えばカレンダーの API には `GET /users` や `GET /events`, `POST /events` といったエンドポイントがある
      - プログラムから空いている予定に予定を追加するには、 `GET /users` でユーザーを取得し、`GET /events` で空いている予定を取得し、`POST /events` で予定を追加する必要がある
      - API の考えでそのままツールを作ると `get_users`, `get_events`, `create_event` といったツールを作ることになる
      - しかしこれはツールの設計としては不適切である。LLM は複数のツールを組み合わせて 1 つのタスクを達成するのは苦手
      - 代わりに `schedule_meeting` といったタスクベースのツールを作るべき
    - https://vercel.com/blog/the-second-wave-of-mcp-building-for-llms-not-developers#how-llms-use-apis-differently
  - ツールの数が多すぎても LLM がどのツールを使えばいいのか混乱して失敗が多くなる
  - ツールの設計をするときは従来の設計の常識を捨てる。ツールを通じてユーザーが何を達成したいのかユースケースを考える
- コンテキストが大きくなりすぎる
  - LLM ではコンテキストの長さに制限がある
    - Claude Code ではデフォルトで 25,000トークン
  - 制限に限らず、コンテキストが大きくなると LLM の性能が低下する
  - 現代の富豪的プログラミングでは 1,000 件のリストをメモリ上に載せてからフィルタリング、ソート、データの整形を行うことが普通
  - しかし MCP サーバーではコンテキストの制限があるため、1,000 件のリストをそのまま渡すことはできない
  - 解決策としては以下のようなものがある
    - ツールの呼び出しにページネーションを導入する
    - GraphQL のように必要なフィールドだけを取得できるようにする
    - API 応答をそのまま返すようにしない
- LLM が誤ったツールの呼び出しを行う
  - ホストメトリックを取得するツールを実装したとき、存在しないメトリック名で繰り返し呼び出しを行った
  - 解決策
    - ツールの description をプロンプトエンジニアリングする
      - ツールの説明は LLM のコンテキストに含まれるため、ツールの説明を工夫することで LLM のツール選択に影響を与えられる
        - 今回の例ではホストがサポートしているメトリック名の一覧をツールの説明に含めた
        - ツールをどのようなｂ場面で使うべきか few shot で例を示した
          - `ホスト目の CPU 使用率を取得する: get_host_metric("hostname", "cpu_usage")`
    - エラー応答を詳細にする
      - API のエラー応答をそのまま返したら `{ code: 404, message: "Not Found" }` のように、LLM にとって意味のない応答になってしまった
      - 代わりになぜ失敗したのか、どうすれば成功するのかを詳細に説明するようにした

```markdown
## Metric Not Found

Your request failed because the specified metric name is invalid or not available for this host.

## Error Summary

${originalError}

## Possible Causes

- The metric name contains typos or incorrect format
- The metric may not be available on this host
- The metric collection may not be enabled

## Resolving Metric Issues

- Check for typos in the metric name
- Verify the metric is available on this host type
```

- ID のような識別子よりも、人間が読める名前を使う
  - エージェントは、難解な識別子よりも自然言語の名前、用語、識別子の方がはるかにうまく処理する傾向があります。任意の英数字UUIDをより意味的に意味があり解釈しやすい言語（あるいは0から始まるIDスキーム）に解決するだけで、幻覚が軽減され、クロードの検索タスクの精度が大幅に向上することがわかりました。
  - 例えばユーザー ID よりもユーザー名、商品 ID よりも商品名を使ってツールを呼び出すようにする
    - `search_user_by_name("Alice")` vs `get_user_by_id("usr_1234567890")`
  - 実際にホスト ID を指定するツールの呼び出しに失敗することがあった
