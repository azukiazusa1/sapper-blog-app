---
id: z49V2qSJR2A5CfkLs81Je
title: "AI エージェントとアプリを動かす Cloudflare OS を試してみた"
slug: "cloudflare-os"
about: "AI エージェントを業務に使うには、社内の知識やシステムへのアクセスと、成果物を共有する仕組みが必要です。Cloudflare OS は、エージェントと小さなアプリを動かすワークスペースを提供します。この記事ではローカルでの利用手順と、アプリの実行環境や Gatekeepers による権限管理の仕組みを紹介します。"
createdAt: "2026-09-09T20:04+09:00"
updatedAt: "2026-09-11T20:00+09:00"
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/1yl63wJhyMQwjQggIS5j8t/8949b9d91d3d1fe2a8a28bceb5b6408c/sanma_nitsuke_15755-768x591.png"
  title: "秋刀魚の煮付けのイラスト"
tags: ["Cloudflare", "AI"]
audio: null
selfAssessment:
  quizzes:
    - question: "今回のメモアプリで、再読み込み後もメモを保持するために使っている仕組みはどれですか？"
      answers:
        - text: "ブラウザの変数にメモを保存する"
          correct: false
          explanation: "ページの再読み込みで失われる変数ではなく、サーバー側に保存しています。"
        - text: "Durable Object のストレージへ保存する"
          correct: true
          explanation: "server.js で ctx.storage.put() を使って保存し、読み出す処理を実装しています。"
        - text: "AI との会話履歴から毎回メモを生成する"
          correct: false
          explanation: "メモの再表示は保存データを読み出す処理で行います。"
        - text: "Blueprint にメモを埋め込む"
          correct: false
          explanation: "Blueprint はコードを再利用する仕組みで、保存データは含みません。"
    - question: "Blueprint を共有するときに含まれるものはどれですか？"
      answers:
        - text: "コードや必要な接続の定義"
          correct: true
          explanation: "Blueprint はコード、接続の定義、メタデータを含み、独立したアプリを作るために使います。"
        - text: "元のアプリの SQLite に保存されたメモ"
          correct: false
          explanation: "SQLite の内容は Blueprint に含まれません。"
        - text: "作成者の外部サービスの資格情報"
          correct: false
          explanation: "資格情報や実際の接続はコピーされません。"
        - text: "アプリを作ったときの会話履歴"
          correct: false
          explanation: "会話履歴は Blueprint の共有対象に含まれません。"

published: true
---

AI エージェントに業務を任せるときに、いかに社内の知識やシステムにアクセスさせるかが課題になります。毎回会社の用語や手順を説明したり、必要な資料を渡したりするのは手間がかかります。また、エージェントが作ったアプリを同僚と共有するなら、アプリが参照した社内データを誰に見せてよいかも考える必要があるでしょう。

[Cloudflare OS](https://github.com/cloudflare/cloudflare-os) は、組織の知識や外部サービスを利用しながら、エージェントとアプリを動かすためのワークスペースです。ブラウザから指示を出して文書やアプリを作り、その成果物をチームで共有して利用できます。

この記事では、Cloudflare OS をローカルで起動する方法と、アプリの実行環境や権限管理の仕組みを紹介します。

:::warning
Cloudflare OS v2 は early access の段階であり、今後のアップデートで仕様が変わる可能性があります。
:::

## Cloudflare OS とは

Cloudflare OS はブラウザから利用する AI ワークスペースです。Cloudflare Workers を基盤に、エージェントの会話、アプリのコード、保存データ、外部サービスへの接続を管理します。

:::note
ここでいう OS は、PC にインストールする汎用的なオペレーティングシステムとは意味が異なります。企業が AI を活用して生産性を高め、かつ安全な方法で業務を遂行できるようにするための OS、AI ワークロード向けの OS という意味で使われています。
:::

[公式ブログ](https://blog.cloudflare.com/cloudflare-os/#an-agent-workspace-for-everyone-in-your-company)では、開発者を含む組織内の誰もが利用できることを設計の目的として挙げています。日常の利用はブラウザから行い、ターミナルの操作を前提としません。チームで蓄積した知識やスキルをエージェントが利用でき、ある人が作ったアプリを他のメンバーの仕事にも役立てられます。

Cloudflare OS は以下の概念から構成されています。

| 概念 | 役割 |
| --- | --- |
| ワークスペース | エージェントとの会話やアプリ、接続するリソースをまとめて扱う場所。1 つのワークスペースに複数の Gadget を置ける |
| Gadget | Cloudflare OS 内で動く小さなアプリ |
| Blueprint | Gadget のコードを再利用し、別のアプリを作るためのテンプレート |
| Gatekeeper | 外部サービスへのアクセスを仲介し、利用できるリソースや操作を制御する仕組み |

たとえば、エージェントにメモアプリを作ってもらった場合、そのアプリが Gadget です。実際にどのように Gadget を作って組織のメンバーに共有するのかを試してみましょう。

## ローカルで起動する

まずは [公式リポジトリの起動手順](https://github.com/cloudflare/cloudflare-os#run-locally)に従って、Cloudflare OS をローカルで動かしてみましょう。Node.js と、パッケージマネージャーの [pnpm](https://pnpm.io/installation) を利用します。

```bash
git clone https://github.com/cloudflare/cloudflare-os.git
cd cloudflare-os
git checkout 54d5d8b0beaec96500ed6fd19281a282702a82f4
pnpm run-local
```

起動ログに `Ready on http://localhost:8787` と表示されたら、ブラウザで `http://localhost:8787/` を開きます。サインイン画面が表示されるので、初回は「Create one」からローカルアカウントを作成する画面へ進みます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Zx5wZWv3Nsfom7unYGWH8/4e9bc4c88e8b494e1df003ff3424cf98/cloudflare-os-1.png)

ユーザー名とパスワードを設定すると、初期設定画面が表示されます。表示名、利用する AI モデル、接続する外部サービスを順に設定します。今回は OpenAI の `gpt-5.6-luna` を選び、「API Token」に API キーを入力しました。OpenAI の API キーは、[OpenAI のアカウントページ](https://platform.openai.com/api-keys)で作成できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/40SpACed2IyxhoXMqA3U9l/7edd38a5270c1e25bf0521c5f6d01576/cloudflare-os-2.png)

外部サービスは省略し、「Next」「Let's build」で進むと、エージェントとの会話画面が表示されます。ここで、エージェントにアプリを作ってもらう指示を出します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7i4xQ9B55bn60kgJYonZxq/de8846a569eb85df1d07c6c3beca93e1/cloudflare-os-3.png)

## 小さなメモアプリを作ってみる

今回は試しにメモアプリを作ってみましょう。ホーム画面のモデルが「GPT 5.6 Luna」になっていることを確認し、次のプロンプトを送信します。

```text
タイトルと本文を入力して保存できる、小さなメモアプリを作成してください。
保存したメモを一覧から選んで表示できるようにしてください。
データはサーバー側に保存し、ページを再読み込みしても残るようにしてください。
外部サービスとの接続は不要です。
```

送信するとワークスペースが作成され、エージェントがコードを書き始めます。今回の実行では、`client.js`、`server.js`、`README.md` が生成されました。`client.js` はメモの一覧・編集画面、`server.js` はメモの保存・取得処理です。

![](https://images.ctfassets.net/in6v9lxmm5c8/54yxShYtD9GBazaeKH3M5C/9976cff7e009b65afe92029aa30c4b0d/cloudflare-os-4.png)

生成されたアプリは Draft としてプレビューできます。メモアプリが動作するかどうかを確認してみましょう。タイトルと本文を入力して「Save」を押すと、一覧に保存したメモが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/1SHtFb0IrwLwU2vfEXf9ju/b07600e01d7b8ca1cad789fd18fb9f95/cloudflare-os-5.png)


### アプリごとに実行環境と保存領域を持つ

Gadget のサーバー側のコードは、[Dynamic Worker Facet](https://developers.cloudflare.com/dynamic-workers/usage/durable-object-facets/) という実行単位で動きます。Dynamic Worker は実行時にコードを読み込む Worker、Durable Object は状態を保持できる Workers の仕組みで、Facet はその Durable Object の中に独立したストレージと実行単位を設けるものです。この組み合わせによって、Gadget ごとに専用の SQLite データベースが割り当てられます。

Gadget はサンドボックスの中で動きます。サーバー側の Dynamic Worker はインターネットへのアクセスが無効化されており、明示的に指定した外部リソースとしか通信できません。クライアント側のコードもサンドボックス化された iframe で動き、サーバーとの通信は親フレーム経由の RPC に限られます。外部サービスを利用したい場合は、後述する Gatekeeper を通して接続を許可する必要があります。

今回生成された `server.js` でも、`DurableObject` を継承した `Gadget` クラスを定義しています。保存済みメモを読む部分を抜粋すると、次のようになっています。

```js:server.js
import { DurableObject } from "cloudflare:workers";

const NOTES_KEY = "notes";

export class Gadget extends DurableObject {
  async listNotes() {
    const notes = (await this.ctx.storage.get(NOTES_KEY)) || [];
    return [...notes].sort((a, b) => b.updatedAt - a.updatedAt);
  }

  // メモの取得・保存などのメソッドは省略
}
```

`this.ctx.storage.get()` は、Gadget に割り当てられたストレージから値を取得しています。[SQLite バックエンドの Durable Object のストレージ API](https://developers.cloudflare.com/durable-objects/api/storage-api/)では、SQL を実行するメソッドのほかに、キーと値で読み書きする `get()` や `put()` も利用できます。このアプリは SQL 文を書く代わりに、`notes` というキーでメモの配列を扱っています。

保存する `saveNote()` メソッドでは、メモの追加・更新後に次の処理を実行していました。

```js
await this.ctx.storage.put(NOTES_KEY, notes);
return note;
```

クライアント側は `gadget.saveNote()` を呼び出し、保存後に `gadget.listNotes()` で一覧を読み直しています。`gadget` は Cloudflare OS がクライアントへ提供する、サーバー側の Gadget を呼び出すためのオブジェクトです。通信には、離れた実行環境のメソッドを呼び出す RPC（Remote Procedure Call）の仕組みである [Cap'n Web](https://github.com/cloudflare/capnweb) が使われます。

```js
const notes = await gadget.listNotes();
```

## 作ったアプリを別のユーザーに共有する

作成したメモアプリを別のユーザーへ共有してみましょう。ここでは作成者の `test` と、共有先の `test1` という 2 人のユーザーが登場します。

共有前に `test1` で同じワークスペースの URL を開くと、「You don't have access to this workspace」と表示されました。URL を知っているだけでは、メモの一覧や本文を見ることはできません。

![](https://images.ctfassets.net/in6v9lxmm5c8/xMSirgYga7yUTEhkLBTqy/1b547fc5f97bfdf9e0b64d64183cbcf1/cloudflare-os-6.png)

`test1` がワークスペースにアクセスできるように、作成者側でメニューバーにある共有リンクのアイコンをクリックします。

![](https://images.ctfassets.net/in6v9lxmm5c8/4q0wIRkvUTH64hWzNYe58U/022600efb61473a9c93e6e47d003880a/cloudflare-os-7.png)

ダイアログが表示されるので「Username or email」に `test1` を入力し、権限を「Gadget only」にして「Invite」をクリックします。

![test1 に Gadget only 権限を付与した共有画面](https://images.ctfassets.net/in6v9lxmm5c8/25932msTae5kypww9804or/85ade041a028f9fcda8abaf46cc1e20f/cloudflare-os-8.png)

「People with access」に `test1` と「Gadget only」が表示されたら、再度 `test1` ユーザーでメモアプリにアクセスしてみましょう。今度は既存のメモが表示されました。共有先の画面には AI チャットやコード編集のタブがなく、メモアプリを操作する画面が表示されます。もしコードの編集まで許可したい場合には権限を「Workspace」にする必要があります。

さらに `test1` から「＋ 新しいメモ」をクリックし、メモを作成できることも確認できました。

![Gadget only 権限の test1 がメモを保存した画面](https://images.ctfassets.net/in6v9lxmm5c8/2xtbrYkjHfhwmLc5V1HnX0/95af93c2b76b04aa63c8fbacacbd794a/cloudflare-os-9.png)

作成者側でページを再読み込みすると、このメモのタイトルと本文が表示されました。同じアプリの保存データを共同で利用できています。

## Gatekeepers による権限管理

エージェントに作らせるアプリは、はじめのうちは今回作ったような個人で使う小さなものでしょう。しかし組織内での活用を考えると、社内データに接続して全メンバーが使う大規模なアプリになっていきます。その際に課題になるのが、アプリが参照した社内データを誰に見せてよいか、誰がデータを更新できるかといった権限管理です。

Cloudflare は最初のバージョンを社内で運用するなかで、権限管理がコラボレーション上の重要な課題になることに気づいたと述べています。MCP（Model Context Protocol）は、AI アプリケーションから外部のツールやデータを利用するためのプロトコルです。しかし、MCP で呼び出せるツールを制御するだけでは、エージェントが読んだ情報を共有先に見せてよいかまで扱えなかったのです。

Cloudflare OS では、Gatekeeper という仕組みを導入して、アプリが参照した外部リソースの権限を共有相手に確認する設計になっています。

Gatekeeper は外部サービスとの接続を仲介します。資格情報をアプリへ渡す代わりに、特定のリソースを操作する権限を与えます。このような権限を表す参照を capability と呼びます。サーバー側の Gadget は、許可された接続を通じて外部リソースを利用します。

### GitHub Gatekeeper で読み取りと書き込みを試す

実際に、外部サービスへ接続する例として GitHub Gatekeeper を試します。ローカル環境では、[GitHub Gatekeeper の設定手順](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/packages/gatekeeper-github/README.md)に従い、GitHub OAuth App の Client ID と Client Secret を設定して開発サーバーを再起動します。Callback URL は `http://localhost:8787/gatekeeper/github/oauth` です。

![](https://images.ctfassets.net/in6v9lxmm5c8/1yc8PfMLr5srBVxiSYnrbe/2a6815ce0abf944eca6ef211a013b437/cloudflare-os-10.png)

「Connections」のタブから「Connect resource」ボタンをクリックすると外部サービスの一覧が表示されるので「GitHub」→「GitHub Repository」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7IBPxWY6pBwlTwf5NmKrDe/a666e507fda15fca8dbc930d7b736cbe/cloudflare-os-11.png)

「Connect GitHub」で認可します。GitHub App の許可を確認する画面が表示されるので、リポジトリへのアクセスを許可します。認可が完了し、ワークスペースに戻ったら、「Repository」の入力欄からアプリから接続するリポジトリを選択します。今回は検証用の `azukiazusa1/benkyo` を選択しました。

![GitHub Gatekeeper の接続先として benkyo を選択した画面](https://images.ctfassets.net/in6v9lxmm5c8/635V7VQAGVWr8W8OYqpCdP/f8b87f0cb55d9961538a929138b2561f/cloudflare-os-12.png)

「Add connection」をクリックすると、Connection の一覧に GitHub が表示されます。コードからは `this.env.GITHUB_REPO` としてアクセスできるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/7eWy50649YqYga8hs4UAoC/f28714c0d5250eed668e700567db5cc8/cloudflare-os-13.png)

接続した GitHub リポジトリにワークスペースからアクセスできるかどうか確認してみましょう。以下のチャットを送信します。

```text
接続済みの GITHUB_REPO を使って azukiazusa1/benkyo の open な Issue を取得し、番号とタイトルを一覧にしてください。GitHub への書き込みはせず、既存のメモアプリのコードも変更しないでください。
```

エージェントの実行記録では `GITHUB_REPO` バインディングを使用して Issue を取得している様子が確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5zQJhUpxMp0wzjBIjB1NGo/44db24445d7dd48f3531cd7022ec701a/cloudflare-os-14.png)

続いて、`createIssue` でタイトルが `[Gatekeeper 検証] 承認前の Issue 作成` の検証用 Issue を 1 件作るよう指示しました。すると「Create issue」という要求に「Approve」と「Deny」が表示され、Activity にも「NEEDS REVIEW」が表示されました。

![GitHub の Issue 作成が承認待ちになった画面](https://images.ctfassets.net/in6v9lxmm5c8/2yqxhscBG9ZoT0io8zbAUV/cfe72ed2f04d28420a12668e09a93ca8/cloudflare-os-15.png)

書き込み操作は承認が必要で、ワークスペースの所有者が承認するまで GitHub には反映されません。Activity で「Approve」を押すと、GitHub に Issue #14 が作成され、指定した本文も反映されました。

### 共有先のユーザーも GitHub に書き込めるか

所有者だけでなく、「Gadget only」で共有された `test1` からも書き込みを要求できるか確認します。`test1` ユーザーはワークスペースのチャットを使用できないので、既存のメモアプリの画面から GitHub の Issue を読み込むボタンと、作成要求を送信するボタンを追加しました。

GitHub 接続後の共有画面には「Recipient verification」が表示され、共有先自身のアカウントで `azukiazusa1/benkyo` にアクセスできることを確認する必要があります。

![共有先自身のアカウントで元のリポジトリへのアクセスを確認する画面](https://images.ctfassets.net/in6v9lxmm5c8/38RpP9ObmXciOnYuJrW51k/fea04a529e5055fcd5117fa72e3da132/cloudflare-os-16.png)

これは、共有相手にアカウントを指定させることで権限を制御する仕組みです。共有相手は Gadget が使う Gatekeeper ごとに自分のアカウントを指定し、Gatekeeper は「その Gadget がこれまでに読んだ情報を、相手が自分の権限で直接読めるか」を検証します。直接読めない情報が含まれていれば、Gadget へのアクセス自体が拒否されます。共有した後も、Gadget が新しく読もうとした情報を共有相手が直接読めない場合には、その読み取りがブロックされます。アクセス制御のルールを書く代わりに、共有相手がもともと読める情報かどうかで判断する設計です。

`test1` で「GitHub Issue を読み込む」を押すと、先ほど作った検証用 Issue を含む 14 件を取得できました。次に「GitHub 検証 Issue の作成を要求」を押すと、作成要求を送信した旨が表示されました。`test1` の画面には承認ボタンがないため、自身で承認できません。

![test1 が GitHub の Issue 作成を要求した画面](https://images.ctfassets.net/in6v9lxmm5c8/70VGwrZjWfKp1ZyNfT0AQb/c55952c81a7011f6c3bcdca7205c0f4d/cloudflare-os-17.png)

所有者の `test` 側では Activity には「test1 からの作成要求」が表示され、承認待ちの状態になっています。所有者側で「Approve」を押すと、GitHub に `[Gatekeeper 検証] test1 からの作成要求` という Issue #15 が作成されることを確認できました。外部サービスへの書き込みは共有先から要求できても、承認の操作は所有者側にしか現れないということがわかります。

![](https://images.ctfassets.net/in6v9lxmm5c8/6cN3uLmRaOFKwDOy6j0e1K/ae2934f7477394df54d5aad3b8179594/cloudflare-os-18.png)

## アプリの仕組みを配る Blueprint

ここまではメモアプリのアクセス権を他のユーザーに付与して、同じ保存データを共同利用する方法を紹介しました。アプリの仕組みだけを他のユーザーに配布する方法として Blueprint があります。Blueprint は Gadget のソースコードを共有することにより、他のユーザーがそれを元に独自のアプリを作れるようにする仕組みです。

実際に、先ほど作ったメモアプリを Blueprint にして、別ユーザーの `test1` から利用してみます。ワークスペース上部の「Blueprints」を選択するとダイアログが表示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5BKEbagtmPk5F23Akkimsd/faf89b18c7026cad157ffc392d67e786/cloudflare-os-19.png)

「Create blueprint」を選び、タイトルと説明を入力します。外部サービスへの接続には、利用者向けの名前と設定時の説明を付けられます。

![Blueprint のタイトル、説明、必要な接続を設定する画面](https://images.ctfassets.net/in6v9lxmm5c8/4LBENNpQCRuJT1yce2sl9p/f8e35fecd359647b9271566b520b2d6b/cloudflare-os-20.png)

作成後、Blueprint の詳細ページの URL を `test1` で開きました。Blueprint が外部サービスに接続している場合は、接続の設定が必要です。「Required connections」には GitHub 接続が「Needs setup」と表示されます。「Configure」から `test1` に接続済みの GitHub アカウントを選び、利用するリポジトリを指定して「Save connection」を押します。今回は同じ `azukiazusa1/benkyo` を選びました。

![test1 で Blueprint を開くと GitHub 接続の設定が必要になる](https://images.ctfassets.net/in6v9lxmm5c8/5oGhRgjQR3pMYVRik5L9Xf/c2aacddca07b30c0a22a88db2071995d/cloudflare-os-21.png)

接続が「Ready」になったら「Create Gadget」を押します。別の URL を持つワークスペースが作られ、同じメモアプリが起動しました。ただし、元のアプリに保存していた 3 件のメモは引き継がれず、保存件数は 0 件です。チャットの履歴も引き継がれません。

![Blueprint から作ったアプリには元のメモと会話履歴が含まれない](https://images.ctfassets.net/in6v9lxmm5c8/1LWhWPDY5n10PDXlbwan2G/e6a6e7c060aac23b8fb46a409796b45b/cloudflare-os-22.png)

このように、同じ保存データを共同利用したい場合は Gadget の共有を使い、各メンバーが自分のデータでアプリを使いたい場合は Blueprint を使い分けられます。

### 標準の Blueprint でスライドを作成する

Cloudflare OS には、Docs・Slides・Sheets の標準 Blueprint も同梱されています。これらを標準の出力形式として指定すると、エージェントが成果物を作る際に利用できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/3kRV5dJNXaXZqgpWUET295/6cf04883c06ff8dbb8ec0140b4b2ab23/cloudflare-os-23.png)

Slides Blueprint を使うと、企業のスタイルに合わせたスライドを自然言語で作成できます。

ここでは GitHub に接続した状態で、スライド作成を依頼してみます。Blueprint から Gadget を作成する手順もエージェントに任せられます。

```text
接続済みの GITHUB_REPO（azukiazusa1/benkyo）の Issue #1〜#13 の本文を読んで、開発予定の機能と未決事項を整理し、日本語で5枚のスライドにしてください。
標準の Slides Blueprint を一覧から探して使用し、新しい Slides Gadget をこのワークスペースに追加してください。
構成は表紙、サービスの目的、主要機能、開発の進め方、確認すべき事項。
各内容には根拠の Issue 番号を付け、未記載事項や提案はその旨を明記してください。
```

エージェントは Blueprint の一覧と GitHub Issue の一覧を取得し、標準の Slides を使った「勉強会サービス開発計画スライド」が、同じワークスペースの別の Gadget として追加されました。「Accept changes」で確定すると、5 枚のスライドを表示できます。

![GitHub Issue から作成された主要機能のスライド](https://images.ctfassets.net/in6v9lxmm5c8/6sUlgc7fhOt77YjpoCd7zQ/13ac774e4babda2c61664b374e364fa2/cloudflare-os-24.png)

スライド下部の鉛筆アイコン「Edit」で編集モードに切り替えられます。チャットだけでは制御しきれない細かい修正を直接行えるのは便利ですね。

![標準 Slides の編集画面](https://images.ctfassets.net/in6v9lxmm5c8/51Weo65WOPqVyCnNJPz58n/2b9ce39ee1aa115a529aceb422000d03/cloudflare-os-25.png)

作成したスライドは「Outputs」→「Slides」からも確認できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5U15N8nituGi1DQWw1KZvZ/f5abcf1adaa36fd4acd2d010527fd698/image.png)

## まとめ

- Cloudflare OS は、エージェントとの会話と小さなアプリの実行をまとめて扱うワークスペース
- 今回作成したメモアプリは Durable Object のストレージを利用してデータが保持される
- Gadget はアプリの実体で、Blueprint はコードを再利用して独立したアプリを作るために使う
- 外部サービスへの接続は Gatekeeper が仲介し、リソースの利用や共有に必要な権限を扱う

## 参考

- [Cloudflare OS: an open platform for agents, apps, and work](https://blog.cloudflare.com/cloudflare-os/)
- [cloudflare/cloudflare-os](https://github.com/cloudflare/cloudflare-os)
- [Blueprints](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/docs/blueprints.md)
- [Sharing](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/docs/sharing.md)
- [Observer Tracking & Read-Through Sharing Permissions](https://github.com/cloudflare/cloudflare-os/blob/54d5d8b0beaec96500ed6fd19281a282702a82f4/docs/observers.md)
- [SQLite-backed Durable Object Storage](https://developers.cloudflare.com/durable-objects/api/storage-api/)
