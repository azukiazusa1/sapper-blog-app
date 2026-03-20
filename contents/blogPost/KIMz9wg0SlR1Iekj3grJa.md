---
id: KIMz9wg0SlR1Iekj3grJa
title: "Discord から Claude Code とやり取りしてみた"
slug: "discord-claude-code"
about: "Claude Code v2.1.80 から Research Preview 版として Claude Code channels（以下、チャンネル）が利用できるようになりました。チャンネルとは実行中の Claude Code のセッションに対して、外部からイベントを送ることができる MCP サーバーのことです。この記事では、Discord からチャンネルを通じて Claude Code とやり取りする方法を紹介します。"
createdAt: "2026-03-20T14:01+09:00"
updatedAt: "2026-03-20T14:01+09:00"
tags: ["claude-code", "discord"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4A2t0FJTIbUdN33xg07uKu/57d93f0ab8fd7919d3c01fffe9fad543/meat-ball_15991-768x591.png"
  title: "ミートボールのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Discord チャンネルプラグインの MCP サーバーを実行するために必要なランタイムはどれですか？"
      answers:
        - text: "Bun"
          correct: true
          explanation: ""
        - text: "Node.js"
          correct: false
          explanation: "Discord チャンネルプラグインは Node.js ではなく Bun が必要です。"
        - text: "Deno"
          correct: false
          explanation: "Deno ではなく Bun が必要です。"
        - text: "Python"
          correct: false
          explanation: "Python ではなく Bun が必要です。"
    - question: "Claude Code を Discord チャンネルを使って起動するための正しいコマンドはどれですか？"
      answers:
        - text: "claude --discord"
          correct: false
          explanation: "オプション名は --discord ではなく --channels です。"
        - text: "claude --plugin discord"
          correct: false
          explanation: ""
        - text: "claude --channels discord"
          correct: false
          explanation: ""
        - text: "claude --channels plugin:discord@claude-plugins-official"
          correct: true
          explanation: "--channels オプションに「plugin:discord@claude-plugins-official」を指定して起動します。これにより Discord 上の Bot がオンラインになります。"

published: true
---

Claude Code v2.1.80 から Research Preview 版として Claude Code channels（以下、チャンネル）が利用できるようになりました。チャンネルとは実行中の Claude Code のセッションに対して、外部からイベントを送ることができる MCP サーバーのことです。チャンネルは双方向通信が可能で、Claude Code がイベントを受け取ったとき同じチャンネルを通じて応答できます。チャンネルを使用して外部サービスからやり取りしたい場合、Claude Code のセッションが開いている必要があるため、Claude Code をバックグラウンドプロセスもしくはサーバーとして実行しておく必要があります。

公式のチャンネルのプラグインとして以下が提供されています。プラグインを使用せずに独自のチャンネルの実装も可能です。

- Telegram
- Discord
- fakechat（デモ用のチャットクライアント）

この記事では、Discord からチャンネルを通じて Claude Code とやり取りする方法を紹介します。Discord チャンネルプラグインの MCP サーバーの実行には [Bun](https://bun.sh/) が必要です。以下のコマンドで Bun をインストールしてください。

```bash
curl -fsSL https://bun.sh/install | bash
```

既に Bun をインストールしている場合でも、最新版にアップデートしておくことをおすすめします。

```bash
bun upgrade

bun --version
1.3.11
```

## Discord bot の作成

はじめに [Discord の開発者ポータル](https://discord.com/developers/applications) にアクセスして、Discord bot を作成します。ダッシュボード画面で「新しいアプリケーション」ボタンをクリックして、アプリケーションを作成します。アプリケーションの名前は任意で構いません。

![](https://images.ctfassets.net/in6v9lxmm5c8/4TAL7jffepodrqom3Qin2x/28fa80c5639021bb1e8f3761b87d5c47/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/2rScZis0c4Cffxy2mtq8RM/f0731e3436affed4ecd0cbed393c038b/image.png)

アプリケーションの作成が完了したら、左側のメニューから「Bot」を選択して、「トークン」→「トークンをリセット」ボタンをクリックして Bot トークンを発行します。発行されたトークンは後で使用するので、控えておいてください。トークンはセキュリティ上の理由から作成後にのみ表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6yGntkI4MahFIEVfGa7TKv/1081d5afba6283dbf7dab6b2f35095d5/image.png)

さらに下にスクロールして、「Privileged Gateway Intents」セクションで「Message Content Intent」を有効にします。これは Bot がメッセージの内容を読み取るために必要な設定です。

![](https://images.ctfassets.net/in6v9lxmm5c8/1bcZ0p8AD0kOWHGuIqNwRU/8a5a1ca6dbed54a88022b3b84f8eb78b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-20_14.26.51.png)

作成した Bot はサーバーに招待する必要があります。左側のメニューから「OAuth2」→「OAuth2 URL ジェネレーター」を選択して、Bot スコープにチェックを入れます。さらに、Bot の権限に以下の権限を追加します。

- チャンネルを表示
- メッセージを送信
- Threads でメッセージを送信
- メッセージ履歴を読む
- ファイルを添付
- リアクションを追加

![](https://images.ctfassets.net/in6v9lxmm5c8/12zHfGp739H4cWhdLerUlh/795069232d6e1fa33443b86328cd792a/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/67u4bxXjY1OxfrIrHV5y6t/fdd319a698d9a152b4deb743ce06da76/image.png)

「生成された URL」セクションに表示されている URL にアクセスして、Bot をサーバーに招待します。あらかじめ Bot を招待するサーバーを作成しておいてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/3DNFex8ncVqW0ftwKlTnMV/58010e2602d24250942a378e53841b51/image.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/7JjL9BX4AurCXPUvIzpyKE/44127e15f3770b7690d9363aad414252/image.png)

サーバーのメンバーに Bot が追加されたことを確認してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/5KnEFfWma1s2LK1TL9mhm8/13c38a9b359d1dca8ac85529030c88c0/image.png)

## Claude Code のチャンネルプラグインをインストール

続いて Claude Code 側の設定をします。Discord チャンネルプラグインは「claude-plugins-official」マーケットプレイスで管理されているため、まずはこのマーケットプレイスが最新の状態であることを確認してください。`/plugin` コマンドの「Marketplace」タブを開いて、「claude-plugins-official」が表示されていれば問題ありません。もし表示されていない場合は、「+Add Marketplace」を選択して「claude-plugins-official」を追加してください。

![](https://images.ctfassets.net/in6v9lxmm5c8/79u0xyjEQbpQFY3EyHxRp2/a1ded567d229ecf6e219cf968609e6f6/image.png)

「Plugin」タブを開いて検索バーに「discord」と入力して、Discord チャンネルプラグインを見つけます。見つけたら「Install」ボタンをクリックしてインストールしてください。

![](https://images.ctfassets.net/in6v9lxmm5c8/1mBpp2XJORn4cwcJMTeJlS/2f994873c8c4d30e3904420bed0c9b58/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-20_14.46.26.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/5goHMOG97yhNVVphmfsHJR/ffa15762ee70d840d0e9024284db205c/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-20_14.47.12.png)

インストールが完了したら `/reload-plugins` コマンドを実行して、プラグインの状態を更新してください。`/skills` に「configure · discord」と「access · discord」が表示されていれば、プラグインは正常にインストールされています。以下のコマンドを実行して前の手順で発行した Bot トークンを設定してください。

```bash
/discord:configure <token>
```

`.claude/channels/discord/.env` ファイルに Bot トークンが保存されます。続いて一度 Claude Code を終了し、`--channels` オプションを付けて再度起動します。

```bash
claude --channels plugin:discord@claude-plugins-official
```

`--channels` オプションを使用して起動すると、Discord 上の Bot がオンラインになっていることが確認できます。Bot に DM を送信するとペアリングコードが返信されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1pyLUeKZIEir9rStVptF0q/a802fc4fb5ebae9e6801667ae518579b/image.png)

Claude Code のセッションに戻り、以下のコマンドを実行してペアリングコードを入力してください。

```bash
/discord:access pair <pairing_code>
```

ペアリングコードが有効期限内であれば、`.claude/channels/discord/access.json` ファイルの `allowFrom` セクションに Discord のユーザー ID が追加されます。これで Discord からチャンネルを通じて Claude Code とやり取りできるようになりました。Claude Code から「Paired! Say hi to Claude.」というメッセージが Discord に送信されるはずです。

![](https://images.ctfassets.net/in6v9lxmm5c8/4OL0WDI2dmQnQi10P1Kfq6/3feb38d81d5a560a4c944ffad81c147c/image.png)

これ以上ユーザーを追加する必要がなければ、DM ポリシーを `pairing` から `allowlist` に変更することをおすすめします。DM ポリシーを `allowlist` に変更すると、`allowFrom` セクションに追加されたユーザー以外のメッセージを一切受け付けなくなります。ペアリングもできなくなるため、ユーザーを追加したい場合は手動で `access.json` ファイルを編集してユーザー ID を追加する必要があります。以下のコマンドを実行して DM ポリシーを変更してください。

```bash
/discord:access policy allowlist
```

`.claude/channels/discord/access.json` の `dmPolicy` が `allowlist` に変更されます。

```diff:.claude/channels/discord/access.json
  {
-    "dmPolicy": "pairing",
+    "dmPolicy": "allowlist",
    "allowFrom": [
      "123456789012345678"
    ]
  }
```

試しに Discord 上からメッセージを送信してみましょう。`/review-article 記事「Discord から Claude Code とやり取りしてみた」をレビューして` というメッセージを送信してみます。ターミナル上で Discord から送信したメッセージをトリガーにして、Claude Code が応答していることが確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6QilNgvUIYiR9JpZy00jE3/94d04c8af03a4d3266f44ccea1c3996f/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-20_15.08.25.png)

Claude Code はセッションが完了したら MCP サーバー `discord` の `reply` ツールを通じて Discord に応答を返します。

:::warning
Bun のバージョンが最新版（v1.3.11 以降）でない場合、MCP サーバーのツールを発見できないというエラーが発生しました。MCP サーバーの実行に失敗した場合には、Bun のバージョンを確認してみてください。
:::

![](https://images.ctfassets.net/in6v9lxmm5c8/48oJHRaVaKN4JEdzyv0mzs/32d38a70f35d5fd36859eb84d08d3b39/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2026-03-20_16.03.47.png)

![](https://images.ctfassets.net/in6v9lxmm5c8/6aorLYfwDbPJOyquP5Bhvp/1b90eca65c2bb190dc282923a031a106/image.png)

Discord チャンネルプラグインは以下の MCP ツールを提供しています。

- `reply`: `chat_id` と `text` を受け取って、指定されたチャットにメッセージを送信するツール。オプションで `reply_to` や `files` も指定できる。送信されたメッセージ ID が返される
- `react`: 任意のメッセージにリアクションを追加するツール。
- `edit_message`: 送信されたメッセージを編集するツール。
- `fetch_messages`: チャンネルから最近のメッセージを古い順に取得するツール。1 回の呼び出しで最大 100 件のメッセージを取得できる。
- `download_attachment`: メッセージに添付されたファイルをダウンロードするツール。ダウンロードされたファイルのパスが返される。

## まとめ

- Claude Code channels を使用すると、外部サービスから実行中の Claude Code セッションにイベントを送ることができる。
- 公式のチャンネルプラグインとして Telegram、Discord、fakechat が提供されている。
- Discord チャンネルプラグインを使用するには、Discord bot を作成して、Bot トークンを Claude Code に設定する。
- `claude-plugins-official` マーケットプレイスから Discord チャンネルプラグインをインストールして、`/discord:configure` コマンドで Bot トークンを設定する。
- チャンネルを使用するには、Claude Code を `--channels` オプションを付けて起動する必要がある。これにより、Discord 上の Bot がオンラインになり、ペアリングコードを使用して Claude Code とペアリングできるようになる。
- `/discord:access` コマンドを使用してペアリングコードを入力すると、Discord からチャンネルを通じて Claude Code とやり取りできるようになる。

## 参考

- [Push events into a running session with channels - Claude Code Docs](https://code.claude.com/docs/en/channels)
- [Channels reference - Claude Code Docs](https://code.claude.com/docs/en/channels-reference)
- [claude-plugins-official/external_plugins/discord at main · anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official/tree/main/external_plugins/discord)
