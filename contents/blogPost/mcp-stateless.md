---
id: -2URyJ2st2EssgACXErg4
title: "2026-07-28 MCP 仕様ではステートレスファーストになる"
slug: "mcp-stateless"
about: "2026-07-28 MCP 仕様リリース候補の最も大きな変更点は、MCP サーバーがステートレスファーストになることです。これにより、MCP サーバーはシンプルなロードバランサーの背後でスケーリングできるようになります。また `Mcp-Method` ヘッダに基づいたトラフィックのルーティングや、サーバー応答のキャッシュなども可能になります。この記事では 2026-07-28 MCP 仕様リリース候補におけるステートレスなプロトコルの変更点について紹介します。"
createdAt: "2026-05-24T11:05+09:00"
updatedAt: "2026-05-24T11:05+09:00"
tags: ["MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/8Ar8kIwLUSLeUpiBkezry/ed1efe8fdb63319bed61b3c475596a17/cafe_ice-coffee_illust_3515.png"
  title: "アイスコーヒーのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "2026-07-28 MCP 仕様リリース候補で MCP サーバーがステートレスになることの利点として、記事で挙げられているのはどれですか？"
      answers:
        - text: "stdio トランスポートを完全に廃止し、リモート実行のみに統一できる"
          correct: false
          explanation: "記事は stdio から Streamable HTTP への発展は触れていますが、stdio の廃止については述べていません。"
        - text: "シンプルなロードバランサーの背後でスケーリングでき、`Mcp-Method` ヘッダーに基づくトラフィックのルーティングやサーバー応答のキャッシュが可能になる"
          correct: true
          explanation: "記事冒頭で説明されている通り、ステートレス化の主な利点はロードバランサー越しのスケーリング、ヘッダーベースのルーティング、レスポンスのキャッシュです。"
        - text: "クライアントとサーバーの間で WebSocket による双方向通信が可能になる"
          correct: false
          explanation: "記事では WebSocket への移行については述べられていません。むしろ既存のトランスポートを進化させる方針が示されています。"
        - text: "サーバーがクライアントごとに別プロセスで動作するため、障害が他のクライアントに波及しなくなる"
          correct: false
          explanation: "プロセス分離は記事の議論の対象ではありません。ステートレス化はサーバー側のセッション保持を不要にすることが主眼です。"
    - question: "新仕様で `initialize` ハンドシェイクが廃止された後、クライアントが自身のサポートする機能（capabilities）を宣言する方法として、記事で説明されているのはどれですか？"
      answers:
        - text: "接続開始時に `server/discover` メソッドを送信し、サーバーに capabilities をまとめて登録する"
          correct: false
          explanation: "`server/discover` はクライアントがサーバーの機能を取得するためのメソッドで、しかも任意の呼び出しです。クライアント自身の機能を登録する用途ではありません。"
        - text: "最初のリクエストにのみ `notifications/initialized` 通知を添付し、その内容をサーバーが保持する"
          correct: false
          explanation: "`notifications/initialized` は現仕様のハンドシェイクで使われる通知であり、新仕様では廃止されます。またステートレスなのでサーバー側で保持もできません。"
        - text: "すべてのリクエストの `_meta` フィールドと HTTP ヘッダーで、プロトコルバージョン・クライアント情報・capabilities を宣言する"
          correct: true
          explanation: "記事の通り、ステートレスではセッションに保持できないため、クライアントの機能宣言はすべてのリクエストで `_meta` とヘッダーを通じて行われます。"
        - text: "`Mcp-Session-Id` ヘッダーに JSON エンコードした capabilities を付与し、サーバーがセッション状態として保持する"
          correct: false
          explanation: "`Mcp-Session-Id` は現仕様でステートフルなセッションを識別するためのヘッダーであり、新仕様ではセッションそのものが廃止されます。"
published: true
---
MCP（Model Context Protocol）サーバーの初期段階ではローカルの stdio を通じて AI エージェントにツールを提供する手段として使用されていました。しかし、ローカルで動作する MCP サーバーは、AI エージェントが動作する環境に依存してしまうため、AI エージェントがクラウド上で動作している場合などには利用できなかったり、セットアップが複雑になったりするという課題がありました。

Streamable HTTP を通じて MCP サーバーをリモートで実行できるようになったことで、本番環境への普及が大きく進みました。しかし、大規模に MCP サーバーが運用され始めると新たな課題も見えてきました。1 つ目の課題は Streamable HTTP はステートフルなプロトコルであることです。ここでいうセッションとは、`Mcp-Session-Id` ヘッダーで識別される接続単位の状態のことを指します。サーバーはこの ID をキーにクライアントの機能宣言や進行中の処理を保持しており、同一クライアントからの後続リクエストは同じサーバーインスタンスにルーティングされる必要があります。このようなステートフルなセッションはロードバランサーの設定を複雑にし、スケーリングの柔軟性を制限することになります。2 つ目の課題は、クローラーなどがサーバーに接続せずに MCP サーバーが提供している機能を知る標準的な方法が存在しないことです。

このような課題を解決するために、MCP のワーキンググループは MCP 仕様をステートレスファーストなプロトコルにするための改定を進めています。トランスポートの数を少なく抑えるという [MCP の設計原則](https://modelcontextprotocol.io/community/design-principles) に基づき、新しいトランスポートを追加するのではなく、既存のトランスポートを進化させる形でステートレスなプロトコルへの移行を目指しています。

2026-07-28 MCP 仕様リリース候補の最も大きな変更点は、MCP サーバーがステートレスファーストになることです。これにより、MCP サーバーはシンプルなロードバランサーの背後でスケーリングできるようになります。また `Mcp-Method` ヘッダーに基づいたトラフィックのルーティングや、サーバー応答のキャッシュなども可能になります。この記事ではこれらの変更点について順に紹介していきます。

## `initialize` ハンドシェイクの廃止

現仕様である 2025-11-25 MCP 仕様では、必ず `initialize` と `initialized` のハンドシェイクから始まります。`initialize`/`initialized` ハンドシェイクはプロトコルバージョンの合意や、クライアントとサーバーが互いにどのような機能を提供しているかを交換するための重要な役割を果たしています。具体的な手順を見てみましょう。クライアントはサーバーに `initialize` リクエストを送信します。このリクエストにはクライアントのプロトコルバージョン、クライアントがサポートする機能、クライアントの情報などが含まれています。

例えば `capabilities.roots.listChanged` はサーバーからの `roots/list_changed` 通知を受け取れることを示しています。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "roots": {
        "listChanged": true
      },
      "sampling": {},
      "elicitation": {}
    },
    "clientInfo": {
      "name": "ExampleClient",
      "version": "1.0.0"
    }
  }
}
```

サーバーはクライアントの `initialize` リクエストを受け取ると、`initialized` レスポンスを返します。レスポンスの `id` はクライアントからのリクエストの `id` と一致させる必要があります。`initialized` レスポンスにはサーバーがサポートする機能やサーバーの情報などが含まれています。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": {
      "logging": {},
      "prompts": {
        "listChanged": true
      },
      "resources": {
        "subscribe": true,
        "listChanged": true
      },
      "tools": {
        "listChanged": true
      }
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    },
    "instructions": "Optional usage hints for the client/LLM."
  }
}
```

最後にクライアントからサーバーに `notifications/initialized` 通知が送信され、ハンドシェイクが完了します。以降は通常のツール呼び出しやリソースの購読などのやりとりが行われます。

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

2026-07-28 MCP 仕様リリース候補では、`initialize` ハンドシェイクは廃止され、`initialize` リクエストが担っていた複数の機能は別の役割に分散されます。セッションがプロトコルから削除されたため、「接続時に一度だけ交換してセッションに保持する」という前提そのものが成り立たなくなったためです。

### クライアントの機能の宣言は `_meta` とヘッダーに

クライアントの機能は `_meta` フィールドとヘッダーを通じてすべてのリクエストで宣言されるようになります。ステートレスなセッションではクライアントの機能を一度宣言してセッションに保持できないため、すべてのリクエストでクライアントの機能を宣言する必要があるのです。以下の例では `tools/list` メソッドを呼び出すリクエストに `_meta` フィールドを追加しています。

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list",
  "params": {
    "_meta": {
      // プロトコルバージョン
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      // クライアントの情報
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      // クライアントがサポートする機能
      "io.modelcontextprotocol/clientCapabilities": {
        "elicitation": {
          "form": {}
        }
      }
    }
  }
}
```

プロトコルバージョンは HTTP ヘッダーにも含める必要があります。ヘッダーの値がリクエストボディの値と一致しない場合、サーバーはエラーを返さなければなりません。

```
POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
Content-Type: application/json
Mcp-Method: tools/list
```

### サーバーの機能の取得は `server/discover` に

サーバーの機能の取得は `server/discover` メソッドに集約されます。クライアントは `server/discover` メソッドを呼び出すことで、サーバーの機能やサーバーの情報などを取得できるようになります。従来の `initialize` ハンドシェイクは必須の呼び出しであったのに対して、`server/discover` メソッドはクライアントが必要に応じて呼び出すことができる任意のメソッドになるという点も異なります。

クライアントは以下のように `server/discover` メソッドを呼び出すことができます。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "server/discover",
  "params": {
    "_meta": {
      "io.modelcontextprotocol/protocolVersion": "2026-07-28",
      "io.modelcontextprotocol/clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      },
      "io.modelcontextprotocol/clientCapabilities": {
        "elicitation": {
          "form": {}
        }
      }
    }
  }
}
```

サーバーは以下のようにレスポンスを返します。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "complete",
    "supportedVersions": ["2026-07-28"],
    "capabilities": {
      "resources": {},
      "tools": {}
    },
    "serverInfo": {
      "name": "ExampleServer",
      "version": "1.0.0"
    },
    "instructions": "Optional usage hints for the client/LLM."
  }
}
```

## `requestState` によるマルチラウンドトリップ

2025-11-25 MCP 仕様にはサーバーがツールの実行途中にクライアント経由でユーザーに追加入力を求める `elicitation` と呼ばれる機能があります。典型的なユースケースは、破壊的な変更を加えるツールを呼び出す前にユーザーの確認を求めるといったものです。処理の流れは以下のようになっています。

- クライアントが `tools/call` でツールを呼び出す
- サーバーはツールの実行を開始する。このとき、ユーザー入力が追加で必要になった場合は処理を中断し、確立済みの接続を通じてクライアントに `elicitation/create` リクエストを送信する
- クライアントはユーザーに入力を求める UI を表示し、ユーザーからの入力を受け取り、サーバーにレスポンスを返す
- サーバーはレスポンスを受け取るとツールの実行を再開し、最終的に元の `tools/call` リクエストに対するレスポンスを返す

`elicitation/create` リクエストは以下のような構造になっています。

```json
{
  "jsonrpc": "2.0",
  "id": 42,
  "method": "elicitation/create",
  "params": {
    "mode": "form",
    "message": "Delete 3 files?",
    "requestedSchema": {
      "type": "object",
      "properties": {
        "confirm": {
          "type": "boolean",
          "description": "Confirm deletion"
        }
      },
      "required": ["confirm"]
    }
  }
}
```

クライアントのレスポンスは以下のようになります。

```json
{
  "result": {
    "action": "accept",
    "content": {
      "confirm": true
    }
  }
}
```

このように 2025-11-25 MCP 仕様の `elicitation` はステートフルなセッションが前提となっています。Streamable HTTP の場合、双方向のやり取りは開いたままの SSE ストリーム上で行われていました。

2026-07-28 MCP 仕様リリース候補では、`elicitation` は `InputRequiredResult` レスポンスによるマルチラウンドトリップの形に置き換わります。サーバーはセッションを保持する代わりに、`requestState` と呼ばれる一意の識別子をクライアントに返します。クライアントはユーザーからの入力を受け取った後、元のリクエストの `id` とサーバーから受け取った `requestState` を含む新しいリクエストをサーバーに送信します。サーバーはこのリクエストを受け取ると、`requestState` をもとにどの処理がユーザー入力を必要としているかを特定し、処理を再開します。

サーバーが `tools/call` リクエストを受け取り、ツールの実行のためにユーザーの確認が必要だと判断した場合、処理を中断して `InputRequiredResult` レスポンスを返します。レスポンスには `requestState` が含まれています。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "resultType": "input_required",
    "inputRequests": {
      // Elicitation request.
      "delete_file": {
        "method": "elicitation/create",
        "params": {
          "mode": "confirm",
          "message": "Delete 3 files?",
          "requestedSchema": {
            "type": "object",
            "properties": {
              "confirm": { "type": "boolean" }
            },
            "required": ["confirm"]
          }
        }
      }
    },
    "requestState": "eyxxxxxx"
  }
}
```

クライアントはユーザーに入力を求める UI を表示し、ユーザーからの入力を受け取った後、元のリクエストに `inputResponses` とサーバーから受け取った `requestState` を含む新しいリクエストをサーバーに送信します。

```json
{
  "jsonrpc": "2.0",
  // id は元のリクエストと異なる必要がある
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "delete-files",
    "arguments": { "files": ["a", "b", "c"] },
    "inputResponses": {
      "delete_file": {
        "action": "accept",
        "content": {
          "confirm": true
        }
      }
    },
    "requestState": "eyxxxxxx"
  }
}
```

このリクエストを受け取ると、サーバーは `requestState` をデコードし、どのステップまで処理が進んでいるかを特定します。ユーザーが `confirm` を `true` として入力していることがわかるため、サーバーはツールの実行を再開し、最終的に `tools/call` リクエストに対するレスポンスを返します。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "status": "success"
  }
}
```

## ヘッダー `Mcp-Method` と `Mcp-Name`

2026-07-28 MCP 仕様リリース候補では、HTTP ヘッダー `Mcp-Method` と `Mcp-Name` が追加されました。`Mcp-Method` ヘッダーはリクエストの対象となる MCP メソッドを宣言するためのもので、すべてのリクエストで必須になります。`Mcp-Name` ヘッダーはその操作がどのリソースやツールなどに対して行われるのかを宣言するためのものです。`tools/call`、`resources/read`、`prompts/get` リクエストでは必須になりますが、`server/discover` のように対象の名前が必要ないリクエストでは必須ではありません。前述の `MCP-Protocol-Version` と同様に、ヘッダーの値とリクエストボディの値が一致しない場合、サーバーはエラーを返さなければなりません。

例えば `search` という名前のツールを呼び出すためのリクエストは以下のようになります。

```http
POST /mcp HTTP/1.1
MCP-Protocol-Version: 2026-07-28
Mcp-Method: tools/call
Mcp-Name: search
Content-Type: application/json
```

`Mcp-Method` と `Mcp-Name` ヘッダーの目的は、これらのヘッダーをもとにロードバランサーや CDN などのインフラストラクチャがリクエストを適切なサーバーにルーティングできるようにすることです。例えば特定のツールの呼び出しはより高性能なサーバーで処理したり、レートリミットを厳しくしたりできるようになります。

従来のステートフルなサーバーでは Sticky Session などを使用してすべてのリクエストを同じサーバーにルーティングする必要があったため、そもそもリクエストの内容に基づいてルーティングできませんでした。ステートレスなサーバーになることで、ルーティングが可能になったものの、リクエストの内容をサーバー側で解析してルーティングするのは効率的ではありません。`Mcp-Method` と `Mcp-Name` ヘッダーを使用することで、リクエストの内容を解析せずにルーティングできるようにしたのです。

## サーバーリスト応答のキャッシュ

2025-11-25 MCP 仕様のステートフルなサーバーでは、`tools/list` や `resources/list` などのリスト応答を 1 度呼び出した後は、サーバー側の通知で更新を受け取る設計になっていました。ツールの一覧が変更されたときにサーバーは `listChanged` 通知を SSE ストリームでクライアントに送信し、クライアントは新しいツールの一覧を取得できたのです。

ステートレスなサーバーでは、クライアントがサーバーからの通知を受け取るための確立された接続が存在しないため、サーバー側からクライアントに更新を通知できません。SSE プッシュ通知への依存を減らすため、クライアントはリスト応答をキャッシュし、キャッシュの有効期限が切れたときに再取得する仕様が追加されました。

`listChanged` 通知とキャッシュは補完的な関係にあり、両者を併用しても問題ありません。サーバーが `listChanged` 通知とキャッシュをどちらもサポートしている場合には、TTL の残り時間を無視して即座にリストを再取得させることもできます。

以下のリスト系の呼び出しのレスポンスには `ttlMs` と `cacheScope` フィールドが必須になりました。

- `tools/list`
- `resources/list`
- `prompts/list`
- `resources/templates/list`
- `resources/read`

`ttlMs` フィールドはクライアントがレスポンスをキャッシュできる期間をミリ秒単位で指定します。機能的には HTTP ヘッダーの `Cache-Control: max-age` とよく似ています。例えば `ttlMs` が 60000 であれば、クライアントはレスポンスを受け取った時点から 60 秒間はキャッシュを有効にできることになります。クライアントはキャッシュが有効期限内であればリスト応答を再取得せずにキャッシュを使用できますが、有効期限が切れている場合はサーバーからリスト応答を再取得する必要があります。

`cacheScope` フィールドはキャッシュのスコープを指定します。値は `public` と `private` のいずれかになります。`public` はすべてのユーザーで共有されるキャッシュであることを示し、`private` は呼び出し元間で共有されるべきではないプライベートデータが含まれているため、キャッシュを呼び出し元で共有してはいけません。

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "search",
        "title": "Search the web",
        "description": "Search the web",
        "inputSchema": { ... }
      }
    ],
    "ttlMs": 60000,
    "cacheScope": "public"
  }
}
```

クライアントはツールの一覧を取得する場合、以下のようなコードを書くことになります。

```typescript
async listTools(): Promise<unknown[]> {
  // キャッシュが有効期限内なら、キャッシュを返す
  if (this.toolsCache && Date.now() < this.toolsCache.expiresAt) {
    return this.toolsCache.tools;
  }
  const result = await this.send('tools/list');
  let ttlMs = result.ttlMs || 0;
  if (ttlMs < 0) {
    ttlMs = 0;
  }
  this.toolsCache = {
    tools: result.tools,
    expiresAt: Date.now() + ttlMs,
  };
  return result.tools;
}
```

## まとめ

- 2026-07-28 MCP 仕様リリース候補では、MCP サーバーがステートレスになる
- `initialize` ハンドシェイクは廃止され、クライアントの機能の宣言は `_meta` とヘッダーに、サーバーの機能の取得は `server/discover` に
- `elicitation` は `InputRequiredResult` レスポンスによるマルチラウンドトリップの形に置き換わる
- HTTP ヘッダー `Mcp-Method` と `Mcp-Name` が追加される。これらのヘッダーをもとにロードバランサーや CDN などのインフラストラクチャがリクエストを適切なサーバーにルーティングできるようになる
- SSE プッシュ通知への依存を減らすため、`listChanged` 通知と補完的な関係にあるリスト応答のキャッシュが追加される。リスト系の呼び出しのレスポンスには `ttlMs` と `cacheScope` フィールドが必須になる

## 参考

- [The 2026-07-28 MCP Specification Release Candidate | Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/)
- [The 2026 MCP Roadmap | Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [Specification - Model Context Protocol](https://modelcontextprotocol.io/specification/draft)
- [SEP-2575: Make MCP Stateless](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/seps/2575-stateless-mcp.md)
