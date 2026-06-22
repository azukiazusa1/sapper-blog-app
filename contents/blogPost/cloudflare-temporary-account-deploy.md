---
id: M3M4GejQWg5BYLKISEGcb
title: "Cloudflare の一時アカウントを使って即座にデプロイできるようになった"
slug: "cloudflare-temporary-account-deploy"
about: "Cloudflare の Temporary Cloudflare Accounts を使用すると、人間が介入することなく AI エージェントが即座に Cloudflare Workers にデプロイできるようになります。この記事では、Temporary Cloudflare Accounts を使用して実際に Cloudflare Workers にデプロイする方法を試してみます。"
createdAt: "2026-06-22T19:48+09:00"
updatedAt: "2026-06-22T19:48+09:00"
tags: ["Cloudflare", "AI", "Cloudflare Workers"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/20lwFyK2B0Mti321V9nW34/fc2c1178bf3d2b6dbad1c59d851a7471/nori-bento_18592-768x591.png"
  title: "海苔弁のイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "Cloudflare の一時アカウントを使い、ログイン認証を行わずに Cloudflare Workers へデプロイするには、どのコマンドを実行しますか?"
      answers:
        - text: "wrangler deploy --anonymous"
          correct: false
          explanation: "それらしいオプション名ですが、記事およびドキュメントで使われているのは --anonymous ではありません。"
        - text: "wrangler login --temporary"
          correct: false
          explanation: "wrangler login は認証情報を取得するためのコマンドで、一時アカウントによる認証なしデプロイとは逆の動作です。"
        - text: "wrangler deploy --temporary"
          correct: true
          explanation: "記事の通り、認証をせずにデプロイするには wrangler deploy --temporary を実行します。"
        - text: "wrangler publish --no-auth"
          correct: false
          explanation: "publish や --no-auth は記事で使われていません。コマンドは deploy、オプションは --temporary です。"
    - question: "所有権を主張しなかった場合、一時アカウントとデプロイされたリソースは、デプロイからどれくらいの時間が経過すると削除されますか?"
      answers:
        - text: "10 分"
          correct: false
          explanation: "記事で示されている有効期限は 10 分ではありません。"
        - text: "60 分"
          correct: true
          explanation: "記事の通り、一時的にデプロイされたアプリケーションが有効なのは 60 分間で、その間に所有権を主張しないと削除されます。"
        - text: "24 時間"
          correct: false
          explanation: "24 時間ではありません。記事で示されている期限は 60 分です。"
        - text: "期限はなく、手動で削除するまで残り続ける"
          correct: false
          explanation: "期限がないという説明は誤りです。所有権を主張しなければ 60 分で自動的に削除されます。"
published: true
---
現在の開発のワークフローでは AI エージェントをゴールを達成するまで自律的に動作させて、フィードバックを通じてアプリケーションを改善していくというスタイルが増えてきています。このような開発ワークフローでは、人間ができる限り介入することなく動かせるようなガードレール・実行環境・自動検証ツールを整備するいわゆるハーネスが重要になってきます。人間が介入する頻度が高ければ高いほど、開発のスピードが落ちてしまうからです。

そんな中 AI エージェントがアプリケーションをデプロイするための作業は、どうしても人間が介入する必要のある作業の 1 つでした。何らかのプラットフォームにアカウントを作成し、認証情報をダッシュボードから取得し、多要素認証を満たすという一連の流れは AI エージェントだけに任せることはできません。この作業を行っている間 AI エージェントはただ待ち続けることになってしまいます。

このような状況を解決するために、Cloudflare は Temporary Cloudflare Accounts という機能の提供を開始しました。この機能を使用することにより、AI エージェントは Cloudflare Workers などの Cloudflare のプラットフォームに事前作業無しに即座にデプロイできるようになります。一時的にデプロイされたアプリケーションは 60 分間のみ有効です。ただしその間に一時アカウントの所有権を主張することで、永続的に自分のリソースとして使用することもできます。これはアカウントを作成してからデプロイするという手順から、デプロイしてからアカウントを作成するという手順に変わったと解釈できるでしょう。AI エージェントの作業ループの外に人間を追い出したというわけですね。

この記事では、Cloudflare の Temporary Cloudflare Accounts を使用して実際に Cloudflare Workers にデプロイする方法を試してみます。

## ゼロからアプリケーションを作成して Cloudflare Workers にデプロイする

Temporary Cloudflare Accounts を使用する前準備として、`wrangler` CLI の 4.102.0 以上が必要です。インストールされていない場合は、以下のコマンドでインストールしてください。

```bash
npm install -g wrangler
```

`wrangler` コマンドが使用可能かどうか確認してください。

```bash
$ wrangler --version

⛅️ wrangler 4.103.0
```

なお、既に `wrangler` CLI で Cloudflare にログインしている場合は、`--temporary` オプションを使用してデプロイすることはできません。ログインしている場合は、以下のコマンドでログアウトしてください。

```bash
wrangler logout
```

後は普段と同じように、お好みの AI エージェントに Cloudflare Workers にデプロイするためのアプリケーションを作成させて一連の流れを見てみましょう。ここでは以下のプロンプトで TODO アプリケーションを作成させてみます。

```txt
React + TypeScript で簡単な TODO アプリを作成して、Cloudflare Workers にデプロイしてください。デプロイする際には `wrangler deploy --temporary` コマンドを使用して、認証をせずにデプロイしてください。デプロイ後のアプリケーションに対して動作確認を行い、問題があれば改善してください。
```

:::note
Cloudflare Workers のドキュメントでは「`wrangler deploy` コマンドの実行時に認証情報が含まれていなければ『To continue without logging in, rerun this command with `--temporary`.』というメッセージが表示されるため、AI エージェントはこのメッセージを見て `--temporary` オプションを付けて再度コマンドを実行する」という記載があります。しかし、実際にデプロイ方法について何も指示を与えないと `wrangler login` コマンドを実行して認証情報を取得しようとする AI エージェントが多かったため、プロンプトの中で `--temporary` オプションを使用するように指示しています。
:::

はじめはいつも通り React + Vite のプロジェクトを作成してから TODO アプリケーションを作成してくれました。最終的に `wrangler deploy --temporary` コマンドを実行して、Cloudflare Workers にデプロイを行います。さらに Codex は Computer Use を使ってデプロイ先の本番 URL（`https://cloudflare-todo-example.mica-larkspur.workers.dev`）に実際にアクセスし、TODO アプリが正しく動作するかどうかの確認まで行ってくれました。ここまで人間は作業に一切介入していません。

![](https://images.ctfassets.net/in6v9lxmm5c8/50ZqP6z3TpOuvA4DnE9Rz/0ed7df0da5900d83e6d22ac1782c188f/image.png)

`wrangler deploy --temporary` コマンドの出力は以下のようになっています。

- 一時的に作られたアカウント名
- 一時アカウントの所有権を主張するための URL
- デプロイされたアプリケーションの URL

```bash
$ wrangler deploy --temporary

Solving proof-of-work challenge…
Temporary account ready:
  # 一時的に作られたアカウント名
	Account: Mica Larkspur (created)
	Claim within: 60 minutes
	# 一時アカウントの所有権を主張するための URL
	Claim URL: https://dash.cloudflare.com/claim-preview?claimToken=xxxxx

# ...
✨ Success! Uploaded 4 files (1.30 sec)

Total Upload: 0.31 KiB / gzip: 0.22 KiB
Uploaded cloudflare-todo-example (4.61 sec)
Deployed cloudflare-todo-example triggers (0.66 sec)
  # デプロイされたアプリケーションの URL
  https://cloudflare-todo-example.mica-larkspur.workers.dev
Current Version ID: xxxx
```

:::info
出力の冒頭に表示される `Solving proof-of-work challenge…` は、プルーフ・オブ・ワーク（proof of work）と呼ばれる計算パズルを解いている処理です。プルーフ・オブ・ワークは「解くのに一定の計算コストがかかるが、解の検証は一瞬で済む」という性質を持ちます。一時アカウントは認証なしで作成できるため、何の制約もなければ大量のアカウントを自動生成する悪用が可能になってしまいます。そこで Cloudflare はアカウント作成の前にプルーフ・オブ・ワークを課すことで、大量作成にかかるコストを引き上げ、不正利用を防いでいます。
:::

その後 60 分間は一時的に作成されたアカウント「Mica Larkspur」をセッションで使い回すことができます。つまり、複数のデプロイを行う場合でも、60 分以内であれば同じアカウントを使用してデプロイすることができるということです。

なお、60 分が経過するまでに所有権を主張しなかった場合、一時アカウントとそれに紐づくデプロイ済みのアプリケーションは Cloudflare によって自動的に削除されます。永続的に利用したい場合は、次に説明する手順で 60 分以内に所有権を主張する必要があります。

Claim URL にアクセスすると、対象の Workers の一覧が表示されます。「アカウントを取得」ボタンをクリックすると、表示されているアカウントと紐づくリソースの所有権を主張することができます。

![](https://images.ctfassets.net/in6v9lxmm5c8/6lFx765NHS6mFBAdYMWfuN/b1c626efd69a7e3f14021c7946c009af/image.png)

成功すると一時的に作られた「Mica Larkspur」というアカウントが自分のアカウントに変わり、Cloudflare Workers のダッシュボードから対象の Workers を管理できるようになります。

![](https://images.ctfassets.net/in6v9lxmm5c8/5sXPEa0zmsyxV2tVWi2fhL/6ab711a9a2ec7216edab791ad0fad6cf/image.png)

一時アカウントを取得した後は、通常のアカウントと同じように `wrangler login` コマンドを使用してログインすることができます。

```bash
wrangler login
```

## まとめ

- AI エージェントがアプリケーションをデプロイするための作業は、これまで人間が介入する必要のある作業の 1 つだった
- Cloudflare の Temporary Cloudflare Accounts を使用することで、人間が介入することなく AI エージェントが即座に Cloudflare Workers にデプロイできるようになった
- 一時的にデプロイされたアプリケーションは 60 分間のみ有効で、所有権を主張しなければ自動的に削除されるが、その間に一時アカウントの所有権を主張すれば永続的に自分のリソースとして使用することもできる

## 参考

- [Temporary Cloudflare Accounts for AI agents](https://blog.cloudflare.com/temporary-accounts/)
- [Claim deployments (temporary accounts) · Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/claim-deployments/)
