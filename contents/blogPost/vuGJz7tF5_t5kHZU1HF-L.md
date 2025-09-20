---
id: vuGJz7tF5_t5kHZU1HF-L
title: "AI エージェントのための Agent Payments Protocol (AP2) を試してみた"
slug: "trying-agent-payments-protocol-ap2"
about: "現状の決済システムでは人間が信頼できる画面上で直接購入ボタンをクリックすることを前提としており、自立型の AI エージェントがユーザーに代わって決済することは想定されていません。そこで Google により Agent Payments Protocol (AP2) と呼ばれる新しいプロトコルが提案されました。プラットフォーム間でエージェント主導の決済を安全に開始・処理することを可能にします。この記事では AP2 のサンプルコードを実際に試してみた手順を紹介します。"
createdAt: "2025-09-20T14:30+09:00"
updatedAt: "2025-09-20T14:30+09:00"
tags: ["AI", "AP2", "MCP", "A2A"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/4t1rnmLvY3wqoCf6gwJxlF/de27fe38f46ed169892122b901685528/saifu_12172-768x768.png"
  title: "折りたたみ財布のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "AP2（Agent Payments Protocol）で信頼を構築するために使用されるデジタル契約の名称は何ですか？"
      answers:
        - text: "Mandates"
          correct: true
          explanation: "AP2では改ざん防止機能を備え、暗号化署名されたデジタル契約である「Mandates」を用いて信頼を構築します。"
        - text: "Contracts"
          correct: false
          explanation: ""
        - text: "Agreements"
          correct: false
          explanation: ""
        - text: "Certificates"
          correct: false
          explanation: ""
    - question: "AP2で支援される支払い方法として、記事で説明されている2つのシナリオは何ですか？"
      answers:
        - text: "リアルタイム購入と委任タスク"
          correct: true
          explanation: "AP2ではリアルタイム購入（人間が立ち会っている場合）と委任タスク（人間が立ち会っていない場合）の2つの方法をサポートしています。"
        - text: "オンライン決済とオフライン決済"
          correct: false
          explanation: "
        - text: "カード決済とデジタルウォレット決済"
          correct: false
          explanation: ""
        - text: "自動決済と手動決済"
          correct: false
          explanation: ""

published: true
---

今日ではユーザーの操作を代行する AI エージェントが普及しつつあります。例えばユーザーが旅行の計画を立てる際には、AI エージェントがウェブサイトを検索し宿泊施設やフライトの手段を提案したり、カレンダーから空き時間を確認してスケジュールを調整するといった操作を委任できます。とはいえすべての操作を AI エージェントに任せるわけにはいきません。例えば宿泊施設の予約やフライトの購入といった支払いを伴う操作は、ユーザー自身が行う必要があります。決済を伴う操作は承認や信頼、説明責任の問題が関わってくるからです。これらの要素をおろそかにすると、ユーザーが不正な請求を受けたり、詐欺に巻き込まれたりするリスクがあります。

現状の決済システムでは人間が信頼できる画面上で直接購入ボタンをクリックすることを前提としており、自立型の AI エージェントがユーザーに代わって決済することは想定されていません。そこで Google により [Agent Payments Protocol (AP2)](https://github.com/google-agentic-commerce/AP2) と呼ばれる新しいプロトコルが提案されました。プラットフォーム間でエージェント主導の決済を安全に開始・処理することを可能にします。このプロトコルは [Model Context Protocol (MCP)](https://modelcontextprotocol.org/) や [A2A](https://a2a-protocol.org/latest/) といった現在標準化が進められている AI エージェント間通信プロトコルを拡張して使用できます。

AP2 では改ざん防止機能を備え、暗号化署名されたデジタル契約である「Mandates」を用いて信頼を構築します。Mandates では以下の 2 つ方法を用いて、エージェントがユーザーに代わって安全に支払いを行うことを可能にします。

- リアルタイム購入（人間が立ち会っている場合）: ユーザーが「新しい白いランニングシューズを探して」のようにエージェントに指示を出すような場合、リクエストは Intent Mandate に記録される。エージェントが希望のシューズをカートに追加すると、ユーザーの承認によって Cart Mandate に署名される
- 委任タスク（人間が立ち会っていない場合）: ユーザーが「コンサートのチケットが発売されたらすぐに購入して」のようにエージェントにタスクを委任する場合、事前に詳細な Intent Mandate に署名する。エージェントは事前に署名された Intent Mandate が正確に条件を満たした時点で、Cart Mandate を自動で生成する

AP2 は現在提案段階にあり、まだ広く採用されているわけではありませんが、以下のレポジトリでサンプルコードを試すことができます。

https://github.com/google-agentic-commerce/AP2

この記事ではサンプルコードを実際に試してみた手順を紹介します。

## 人間が立ち会う場合の支払いのサンプル

人間が立ち会う場合の支払いのサンプルを試してみます。このサンプルでは従来のカード決済を使用し、人間が対面するトランザクションです。ユーザーは購入する商品の詳細と使用する支払い方法を確認し、ユーザーが購入内容を証明することですべての取引関係者が高い信頼性を得られます。このサンプルでは以下の登場人物が登場します。

- Shopping Agent: ユーザーの買い物リクエストを処理し、タスクを専門のエージェントに委任するオーケストレーターエージェント
- Merchant Agent: Shopping Agent からのリクエストを受け取り、商品を提供するエージェント
- Merchant Payment Processor Agent: 加盟店に代わって支払いを処理するエージェント
- Credentials Provider Agent: ユーザーの支払い認証情報を保有するエージェント。以下の 2 つの役割を担う
  - Shopping Agent にユーザーが利用可能な支払い方法を提供する
  - Shopping Agent と販売者の決済プロセッサ間の決済を仲介する

### プロジェクトのセットアップ

前提条件として Python 3.10 以上がインストールされている必要があります。以下のコマンドを実行して Python のバージョンを確認してください。

```bash
python --version
```

AP2 のサンプルコードを提供するリポジトリをクローンします。

```bash
git clone https://github.com/google-agentic-commerce/AP2.git
```

LLM として Gemini 2.5 Flash を使用するため Google API キーが必要です。[Google AI Studio](https://aistudio.google.com/apikey) で API キーを取得し、環境変数 `GOOGLE_API_KEY` に設定してください。

```bash
export GOOGLE_API_KEY="YOUR_API_KEY"
```

もしくは `.env` ファイルに以下のように記述します。

```
GOOGLE_API_KEY="YOUR_API_KEY"
```

以下のコマンドを実行すると、すべての手順を自動で実行できます。

```bash
bash samples/python/scenarios/a2a/human-present/cards/run.sh
```

このスクリプトは以下の手順を実行します。

1. Python 仮想環境（`.venv`）を作成し、依存関係をインストールする
2. ログディレクトリを作成する
3. 各エージェントを別々のポートで起動する

- Merchant Agent (ポート 8001)
- Credentials Provider (ポート 8002)
- Card Processor Agent (ポート 8003)

4. メインアプリケーション（Shopping Agent）を Web サーバーとして起動する（ポート 8000）

http://0.0.0.0:8000/dev-ui/ をブラウザで開くと Agent Development Kit の UI が表示され、Shopping Agent と対話できます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5vTUPFbKDLsXpdqLyJ6Pmx/40da0dc60bb4fb6d25706b830682c2e6/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.06.56.png)

### Shopping Agent とのやりとり

Shopping Agent とのやりとりを試してみましょう。全体の処理フローは以下の図のようになります（この図はリポジトリのソースコードを元に Claude Code が生成したものです）。

![](https://images.ctfassets.net/in6v9lxmm5c8/3Wb53qR9FUvFcoM8wGUNJd/d147974bb7ef097e4eeb9d5f3725bda9/image.png)

始めに右上にドロップダウンメニューから「Shopping Agent」を選択します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4LpNCuJctXTbTRYnSy9FGN/8b8e21bc9ed6b5a2e729cdf7a61b5155/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.09.33.png)

チャット形式の UI が表示されるので「ランニングするための新しいシューズを探して」と入力して送信します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4VPZhDqOcopi8Mi5NpF4Aa/cbd39c54941c276868e74c557e5306da/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.11.10.png)

通常のエージェントとの対話と同じように、どのようなランニングシューズがほしいか（ブランド・色・用途など）を尋ねられます。いくつかの応答の後、Shopping Agent `create_intent_mandate` ツールを使用して `Intent Mandate` の生成をします。ユーザーの購入意図を Merchant Agent と共有するためです。

`Intent Mandate` には以下のような情報が含まれます。

- natural_language_description: ユーザーの購入意図の自然言語説明
- user_cart_confirmation_required: ユーザーのカート確認が必要か
- merchants: 許可された販売業者のリスト
- skus: 許可された SKU のリスト
- requires_refundability: 返金可能性が必要か
- intent_expiry: IntentMandate の有効期限

![](https://images.ctfassets.net/in6v9lxmm5c8/5YB9oDfMcHYwjkDoXUYK31/6d0989c7fc86edca9b95b34887d8ffb9/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.35.58.png)

しばらくすると以下のようなメッセージが表示され、ユーザーが購入内容を確認するよう促されます。

```text
Please confirm the following details for your purchase. Note that this information will be shared with the merchant.

Item Description: 白い、安定性のある長距離ランニングシューズ
User Confirmation Required: Yes
Merchants: Any
SKUs: Any
Refundable: Yes
Expires: in 1 day

Shall I proceed?
```

![](https://images.ctfassets.net/in6v9lxmm5c8/7zjRBTw2ysP6ol4r1LUhkX/3e325ca73b4f89393e7b6a6cb02b9286/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.33.10.png)

ユーザーの確認を求められるので「はい」と応答します。すると Shopping Agent は Merchant Agent にリクエストを送り、`Intent Mandate` の条件に基づいた商品の検索を依頼します。

![](https://images.ctfassets.net/in6v9lxmm5c8/5eUy0xyGxeZD65Hy8ETX2C/bee984242621b4547093234c24a1304b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.37.13.png)

しばらくすると Merchant Agent により `Cart Mandate` が生成され Shopping Agent と共有されます。`Cart Mandate` には以下のような情報が含まれます。

- PaymentRequest:
  - サポートする支払い方法（CARD、PayPal、AMEX 等）
  - 商品詳細と価格
- CartContents:
  - カート ID
  - ユーザー確認要件
  - 商品リスト
  - 有効期限
  - 返金ポリシー

`Cart Mandate` の情報を元に Shopping Agent により購買可能な商品がいくつか提示されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/5svXpGq2GcGEDp9m0Rxek4/8868d251da9f87e157635ff6e6845225/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.38.22.png)

「Stable Long-Distance Running Shoe - Standard　を選択して」と応答します。すると `chosen_cart_id` 状態が更新され、Shopping Agent は `Cart Mandate` の内容を元に購入手続きを開始します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4RjzQpkliPiVCDLq4x9ZZf/f45cac8e8c288a379a0cbec26cdb605e/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_16.41.41.png)

その後購入手続きへと進みます。digital wallet を使うか、配送先住所を手動で入力するか尋ねられます。ここでは「use a digital wallet」と応答します。デモとして使用できる情報として以下にようなものが用意されています。

bugsbunny@gmail.com の場合：

- Digital wallet: Bugs's PayPal account
- Brand: PayPal
- Account identifier: foo@bar.com

elmerfudd@gmail.com の場合：

- Digital wallet: Fudd's PayPal
- Brand: PayPal
- Account identifier: elmerfudd@gmail.com

![](https://images.ctfassets.net/in6v9lxmm5c8/6iYjEHVUILAQm08XdCZ7Kr/1b6845547fe8a687b9d5050e88c6e456/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.02.57.png)

「Bugs's PayPal account」と応答すると、Credentials Provider Agent により認証が行われます。ここではデモのため自動的にログインに成功すると応答されます。このまま認証処理を続行するか尋ねられるので「はい」と応答します。

![](https://images.ctfassets.net/in6v9lxmm5c8/4xNpF4JA2dB3J3mNU2kiin/65caf73552a46fe074629ccc699b4608/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.06.33.png)

`get_shipping_address` ツールを使用して配送先住所を取得し、その情報を元に `Cart Mandate` を更新します。

![](https://images.ctfassets.net/in6v9lxmm5c8/6tuAZrbsACX5obPQNp20n8/c2eee0a535c524864a4db883c56ba5c2/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.08.34.png)

配送先住所が更新されたことを確認した後、`get_payment_methods` ツールを使用してユーザーが利用可能な支払い方法を取得します。「American Express ending in 4444」を選択しましょう。

![](https://images.ctfassets.net/in6v9lxmm5c8/1D9AUHlerl7coT7lOnFZKM/47e184fb1ee25a79ece7070f3cb0cfa7/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.10.56.png)

選択した支払い方法を元に credential token を取得します。本来は購入を確認するために信頼できる画面にリダイレクトされるべきですが、デモのため自動的にトークンが生成されます。

![](https://images.ctfassets.net/in6v9lxmm5c8/7pQrIWOIUSnoieyxNnamwu/53f1f89b3ec735b385e130a233726a48/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.14.36.png)

最終的に Shopping Agent はカートと取引情報をまとめ `PaymentMandate` を生成します。内容を確認し、購入を確定するか尋ねられるので「購入を確定してください」と応答します。

![](https://images.ctfassets.net/in6v9lxmm5c8/7gOGLCK1Qyjd9VgHCJ8FhN/2f0d68b54660ce7efeed0a8211bd3a1b/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.16.10.png)

購入処理に進むと `PaymentMandate` に署名をします。その後加盟店決済処理業者が OTP を要求するというシナリオが発生するので、デモ用に「123」と入力して応答します。

![](https://images.ctfassets.net/in6v9lxmm5c8/2d6MsTViTUOZCjaKzCpHQf/975bce4e612b1e01bea4c0c2e10cc2f0/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.19.26.png)

最終的に商品の購入が完了し、デジタル領収書が表示されました。

![](https://images.ctfassets.net/in6v9lxmm5c8/7kITRJue1Re1UlVS5kXrIA/86c0fc81b97acdbbdb220487e17a20e8/%C3%A3__%C3%A3__%C3%A3_%C2%AA%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3__%C3%A3___2025-09-20_17.20.08.png)

## まとめ

- Agent Payments Protocol (AP2) は AI エージェントがユーザーに代わって安全に支払いを行うことを可能にする新しいプロトコル
- AP2 は改ざん防止機能を備え、暗号化署名されたデジタル契約である「Mandates」を用いて信頼を構築する
- ユーザーが立ち会う場合の支払いと、ユーザーが立ち会わない場合の支払いの両方をサポートする
- サンプルコードでは以下の流れで支払いを行う
  1. Shopping Agent がユーザーのリクエストを受け取り、Merchant Agent に `Intent Mandate` の生成を依頼する
  2. Merchant Agent が商品を検索し、`Cart Mandate` を生成して Shopping Agent と共有する
  3. ユーザーが購入する商品を選択し、配送先住所と支払い方法を提供する
  4. Shopping Agent が `PaymentMandate` を生成し、ユーザーが署名をしたら購入を確定する

## 参考

- [Announcing Agent Payments Protocol (AP2) | Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/announcing-agents-to-payments-ap2-protocol?hl=en)
- [google-agentic-commerce/AP2: Building a Secure and Interoperable Future for AI-Driven Payments.](https://github.com/google-agentic-commerce/AP2?tab=readme-ov-file)
- [AP2/docs/specification.md at main · google-agentic-commerce/AP2](https://github.com/google-agentic-commerce/AP2/blob/main/docs/specification.md)
