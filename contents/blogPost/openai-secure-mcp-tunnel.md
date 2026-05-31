---
id: PznjB2Wcgt5Z1mlRlBPvh
title: "OpenAI の Secure MCP Tunnel を試してみた"
slug: "openai-secure-mcp-tunnel"
about: "OpenAI の Secure MCP Tunnel を利用すると、プライベートな MCP サーバーをパブリックなインターネットに公開することなく OpenAI のプロダクトに接続できるようになります。この記事では Secure MCP Tunnel を試してみた様子を紹介します。"
createdAt: "2026-05-31T19:04+09:00"
updatedAt: "2026-05-31T19:04+09:00"
tags: ["OpenAI", "MCP"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2iO58AAEE03fT33QcfIKQF/e69d9a34fcb985fad5d8749f1c1fc61f/traffic_tunnel_18400-768x591.png"
  title: "トンネルのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "記事で説明されている OpenAI の Secure MCP Tunnel の主な役割として正しいものはどれですか？"
      answers:
        - text: "MCP サーバーを Web サーバーとしてパブリックに公開するための CDN サービス"
          correct: false
          explanation: "Secure MCP Tunnel はパブリックに公開するためのものではなく、むしろパブリックに公開せずに接続する仕組みです。"
        - text: "stdio トランスポートで動く MCP サーバーをローカルから ChatGPT に登録するためのインストーラ"
          correct: false
          explanation: "tunnel-client はインストーラではなく、ローカルで動かして OpenAI のプロダクトとプライベート MCP サーバーを中継するクライアントです。"
        - text: "プライベートな MCP サーバーをパブリックなインターネットに公開することなく OpenAI のプロダクトに接続するためのトンネルサービス"
          correct: true
          explanation: "記事の冒頭・まとめで明記されている通り、これが Secure MCP Tunnel の役割です。オンプレミスやファイアウォール内の MCP サーバーを ChatGPT や Codex から呼び出せるようにします。"
        - text: "MCP プロトコル自体を高速化するための新しいトランスポート仕様"
          correct: false
          explanation: "記事では新しいトランスポートではなく、既存の MCP サーバーを安全に OpenAI のプロダクトに接続するための仕組みとして説明されています。"
    - question: "記事によると、OpenAI プラットフォームでトンネルを作成するためのロールには、Permissions の Tunnels でどの権限を有効にする必要がありますか？"
      answers:
        - text: "Read と Use"
          correct: false
          explanation: "Read と Use は API キーに必要な権限として記事で説明されているもので、ロールの権限ではありません。"
        - text: "Manage と Use"
          correct: true
          explanation: "記事で明記されている通り、Owner ロールではトンネル作成ができないため、新しいロールを作って Tunnels の Manage と Use を有効にする必要があります。"
        - text: "Owner ロールにあらかじめ含まれているため設定は不要"
          correct: false
          explanation: "記事では「もともと付与されている Owner ロールではトンネルの作成ができない」と明記されています。"
        - text: "Admin と Write"
          correct: false
          explanation: "記事中にそのような権限名は登場しません。必要なのは Manage と Use です。"
    - question: "記事の手順に従って tunnel-client init を実行した場合、生成されるプロファイルファイルのパスはどれですか？"
      answers:
        - text: "/etc/tunnel-client/config.yaml"
          correct: false
          explanation: "記事ではシステム配下ではなくユーザーのホーム配下に生成されると説明されています。"
        - text: "~/.openai/tunnels.yaml"
          correct: false
          explanation: "記事中にこのパスは登場しません。OpenAI 関連の設定ですが、tunnel-client は専用ディレクトリを使います。"
        - text: "~/tunnel-client/local-stdio.yaml"
          correct: true
          explanation: "記事で示されている通り、`--profile local-stdio` を指定して init を実行すると `~/tunnel-client/local-stdio.yaml` というプロファイルが作成されます。"
        - text: "カレントディレクトリの tunnel.yaml"
          correct: false
          explanation: "記事ではカレントディレクトリではなく、ホーム配下の `~/tunnel-client/` 以下に生成されると説明されています。"
published: true
---
MCP（Model Context Protocol）にはローカルで実行される stdio トランスポートと、リモートで実行される Streamable HTTP トランスポートの 2 種類があります。MCP の登場当初は stdio トランスポートが主に使用されていましたが、以下のような理由から Streamable HTTP トランスポートの利用が増えてきています。

- セットアップ手順が手軽でエンジニア以外も利用しやすい
- クラウド上で動くクライアントからでも利用できる
- OAuth 認証の仕組みが整えられている

一方で Streamable HTTP トランスポートの場合は stdio トランスポートと比較して、HTTP リクエストを受け付けるためのサーバーを立てる必要があり、プライベートに配布する手段が限られているといった課題がありました。

OpenAI の提供する Secure MCP Tunnel は、プライベートな MCP サーバーをパブリックなインターネットに公開することなく OpenAI のプロダクトに接続するためのトンネルサービスです。これにより MCP サーバーがオンプレミスやファイアウォールの内側にあっても、ChatGPT や Codex などから呼び出すことが可能になります。

この記事では OpenAI の Secure MCP Tunnel を試してみた様子を紹介します。

## Secure MCP Tunnel の事前準備

事前準備として [OpenAI プラットフォームの Tunnel 設定](https://platform.openai.com/settings/organization/tunnels) から `tunnel_id` を取得します。もともと付与されている Owner ロールではトンネルの作成ができないため、新しいロールを作成する必要がありました。[People & Permissions > Roles](https://platform.openai.com/settings/organization/people/roles) の「Create role」から新しいロールを作成し「Permissions」から「Tunnels」の「Read」「Manage」を有効にします。

![](https://images.ctfassets.net/in6v9lxmm5c8/6DbnmcTHhOt32R5cEqY6Yd/11d995cbbf11d327fef04ad8bb667e42/image.png)

作成したロールは [Members タブ](https://platform.openai.com/settings/organization/people/members) からユーザーに割り当てることができます。ロールを割り当てたユーザーでログインした状態で [Tunnel 設定](https://platform.openai.com/settings/organization/tunnels) にアクセスすると「Create Tunnel」ボタンが有効になります。

![](https://images.ctfassets.net/in6v9lxmm5c8/4Uh1qCMxcsowo7ienngd88/8a38b6dc7d5fd0e50ae8188c9600c80f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-28_19.28.26.png)

Tunnel を作成するダイアログが表示されるので「Name」と「Description」を入力して「Create」をクリックします。Organization Ids はあらかじめ入力されているものをそのまま利用すれば問題ありません。

![](https://images.ctfassets.net/in6v9lxmm5c8/7f1kCHUdrfjQOM29QyEReK/baf565dac7c2ba9fc0940565e88b04a8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-28_19.32.12.png)

Tunnel を作成したら ID が発行されるので、これを控えておきます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6QaLVJ6IWiYmpiIIS9OoBK/2b273d27590c27893f6c7aa68d34a810/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-05-31_9.28.11.png)

続いて API キーを作成します。API キーは [API Keys](https://platform.openai.com/api-keys) から「Create new secret key」をクリックして作成できます。API キーの権限には、「Tunnels」の「Read」「Use」が必要になります。

![](https://images.ctfassets.net/in6v9lxmm5c8/28b4BadX9vW7RrHH6ZfnWp/5c5320f9ad984c9748be47efbcae4d38/image.png)

## Tunnel クライアントのセットアップ

Secure MCP Tunnel は `tunnel-client` という CLI ツールを使用して、手元で動いている MCP サーバーと OpenAI のプロダクトを接続します。`tunnel-client` は以下の URL からインストールできます。必要に応じて最新のバージョンを確認してください。

https://github.com/openai/tunnel-client/releases/tag/v0.0.9--context-conduit-topaz

ダウンロードが完了したら、`tunnel-client` コマンドが実行できるようにパスを通します。ターミナルで以下のコマンドを実行して、`tunnel-client` が正しくインストールされていることを確認しましょう。

```bash
tunnel-client --version
```

次に説明する `tunnel-client init` では、トンネルが転送する先のローカル MCP サーバーを指定します。そのため、事前に MCP サーバーを 1 つ用意しておきましょう。ここでは簡単な計算をするだけの stdio トランスポートの MCP サーバーを TypeScript で実装しました。

<details>
<summary>stdio トランスポートで動く MCP サーバーの例</summary>

```ts:server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "calculator",
  version: "1.0.0",
});

server.registerTool(
  "add",
  {
    description: "2つの数値を足し算します",
    inputSchema: {
      a: z.number().describe("1つ目の数値"),
      b: z.number().describe("2つ目の数値"),
    },
  },
  async ({ a, b }) => ({
    content: [{ type: "text", text: `${a} + ${b} = ${a + b}` }],
  }),
);

// ... 他のツール

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Calculator MCP サーバーが起動しました");
}

main().catch((err) => {
  console.error("サーバーエラー:", err);
  process.exit(1);
});

```

</details>

環境変数 `CONTROL_PLANE_API_KEY` に先ほど作成した API キーを設定し、`tunnel-client init` を実行します。`--tunnel-id` には先ほど控えた Tunnel の ID を指定します。ローカルの MCP サーバーを起動するコマンドは `--mcp-command` オプションで指定します。もしリモートの MCP サーバーを指定したい場合は `--mcp-server-url http://example.com/mcp` のように指定します。

```bash
export CONTROL_PLANE_API_KEY="sk-xxxxxx" # 先ほど作成した API キーを設定

tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-stdio \
  --tunnel-id tunnel_xxxx \
  --mcp-command "bun /path/to/server.ts"
```

`tunnel-client init` コマンドを実行すると、`~/tunnel-client/local-stdio.yaml` というプロファイルファイルが作成されます。今後はこのプロファイルを指定して `tunnel-client` コマンドを実行することで、毎回コマンドライン引数を指定する必要がなくなります。

```yaml:~/tunnel-client/local-stdio.yaml
config_version: 1
control_plane:
  base_url: "https://api.openai.com"

  tunnel_id: "tunnel_xxx"
  api_key: "env:CONTROL_PLANE_API_KEY"
health:
  # Keep a fixed port when you want a stable local admin URL.
  # For concurrent or clean-room runs, switch listen_addr to "127.0.0.1:0" and
  # set url_file so another process can discover the resolved /healthz, /readyz,
  # /metrics, and /ui base URL.
  listen_addr: "127.0.0.1:8080"
  # url_file: "/tmp/tunnel-client-health.url"
admin_ui:
  open_browser: false
log:
  level: info
  format: json
mcp:
  commands:
    - channel: main
      command: "bun /path/to/server.ts"
```

## Tunnel クライアントの起動

プロファイルの設定が完了したら、`tunnel-client run` コマンドを実行してトンネルを起動します。先ほど作成したプロファイルを引数に指定して実行します。

```bash
tunnel-client run --profile local-stdio
```

コマンドのログに「🟢 tunnel-client started」と表示されていれば OK です。http://localhost:8080 にアクセスすると、管理画面が表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1R2WC17lYajOO5gIbqu5FZ/ad9fdaca21dee3db7292cf6a55c2af06/image.png)

## ChatGPT から MCP サーバーを呼び出す

ChatGPT の[コネクタの設定](https://chatgpt.com/#settings/Connectors)を開き、カスタムコネクタを追加します。カスタムコネクタを追加するためには「高度な設定」から「開発者モード」を有効にする必要があります。

![](https://images.ctfassets.net/in6v9lxmm5c8/1n35emFSq7A4zHC9JwhN7S/b24399c4bf856b031f86a0ebf5fac8e3/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/1RAjINxhHkzKsJtrFwZsj0/339c0fc0332203568adbebd50932e876/image.png)

「開発者モード」を有効にするとコネクタの設定画面に「アプリを作成する」というボタンが表示されるので、これをクリックして新しいコネクタを作成します。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Id4dV0z8jFjfnyKQZXuQr/77557addeb5c0a86efd5c5a14e49b4da/image.png)

「接続」の項目では「トンネル」を選択します。「利用可能なトンネル」がドロップダウンで表示されます。作成したトンネルが読み込まれないこともあるので、その際には「代わりにトンネル ID を入力」をクリックして、先ほど控えた Tunnel の ID を直接入力してみてください。「認証」は「認証なし」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4m71Ss8kX75FTe228vW5u4/767341d920380c25954b47a45ff400b5/image.png)

「作成する」ボタンをクリックすると新しいアプリが追加されるので、これを ChatGPT に接続しましょう。アプリの情報を確認すると、ローカルで動いている MCP サーバーのツールの一覧が表示されていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/16FLUGDH05DMfDo3ZtTgHf/fd24da60926e790bf2b813ccca34ca67/image.png)

実際にチャットからツールを呼び出せるか試してみましょう。チャットの開始前に「+」ボタンをクリックして、先ほど作成したアプリを選択します。これでチャットから MCP サーバーのツールを呼び出すことができるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/Hf4Y93BFfonXfnVePIFET/4e05e1694a2546794d5847a5c86870c3/image.png)

以下のようなプロンプトを入力してみてください。

```
計算ツールを使って 5 + 3 を計算してみて。
```

作成した「tunnel-test」アプリの `add` ツールを呼び出して、正しく計算結果が返ってきていることがわかりますね。

![](https://images.ctfassets.net/in6v9lxmm5c8/1Q9a2ySAaI5cbpBguUxkeQ/5beeabe0d5a8a3de814784bd568ea758/image.png)

今回の例ではローカルの MCP サーバーをトンネルに接続しましたが、`tunnel-client` はプライベートの MCP サーバーにアクセス可能な同じ信頼境界内で実行される必要があります。本番環境で利用する際には、Kubernetes クラスター内の Pod として `tunnel-client` を実行する、あるいは VM 内で `tunnel-client` を実行して同じネットワーク内の MCP サーバーに接続する、といった方法が考えられます。

## まとめ

- OpenAI の Secure MCP Tunnel を利用すると、プライベートな MCP サーバーをパブリックなインターネットに公開することなく OpenAI のプロダクトに接続できる
- Secure MCP Tunnel を利用するためには、OpenAI プラットフォームでトンネルを作成し、API キーを発行し、`tunnel-client` CLI をセットアップする必要がある。トンネルを作成するためには、ユーザーに適切なロールを割り当てる必要がある点に注意
- `tunnel-client` CLI を使用して、ローカルで動いている MCP サーバーと OpenAI のプロダクトを接続する
- ChatGPT のカスタムコネクタを利用して、ChatGPT から MCP サーバーのツールを呼び出すことができる

## 参考

- [Secure MCP Tunnel | OpenAI API](https://developers.openai.com/api/docs/guides/secure-mcp-tunnels)
- [openai/tunnel-client](https://github.com/openai/tunnel-client)
