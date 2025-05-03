---
id: 2hgyTnHqH7WISFTlSvheWb
title: "Sapper + contentful + VercelのJamstackで高速なブログを構築する"
slug: "sapper-contentful-vercel-jamstack-blog"
about: "JamstackのJamはJavaScript/APIs/Markupの頭文字です。 従来の手法と比較して、高速化・堅牢なセキュリティ。より簡単なスケーラブル・開発体験の向上という特徴を持っています。実行時にAPIから取得したデータを動的にレンダリングせずに、ビルド時にAPIから取得して静的なHTMLとして出力されます。"
createdAt: "2021-02-14T00:00+09:00"
updatedAt: "2021-02-14T00:00+09:00"
tags: ["", "", "", ""]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/2nVc0113aL8VwYQwWLDPyl/90bc28445ce7ff4ee2c190a858defee5/contentful.jpg"
  title: "contentful"
audio: null
selfAssessment: null
published: true
---
# ブログ引っ越しました！

タイトルにあるとおりですが、ブログを新たに作成しました。
以前のブログでもある程度満足はしていたのですが、新たにブログを作成した最大の理由がパフォーマンスです。これに関しては、Lighthouse のスコアを見れば一目瞭然かと思います。

![compare-lighthouse-score](//images.ctfassets.net/in6v9lxmm5c8/6gm2HbmC8ZHjgm2fiPOTRx/be24cbf6369735fa4194f294069975d8/____________________________2021-02-14_20.38.52.png)

旧ブログがここまで遅い理由は、以下の点が考えられます。

- SPA で構築されているため、初期表示に時間がかかっている
- 記事を表示するのに API(firastore)に毎回問い合わせている
- 不要な firebase のライブラリのコードが含まれている（結構サイズが大きい）

1 年前くらいに作ったので、いろいろなところがお粗末でした。
Vue.js + firebase という構成でしたが、ブログのために firebase を使う辺りオーバースペックだったりしますね。

さて、新ブログのパフォーマンスの速さの秘密に迫っていきましょう。
キーワードは、Jamstack です。

# Jamstackとは

[Jamstack](https://jamstack.org/)の Jam は JavaScript/APIs/Markup の頭文字です。
従来の手法と比較して、高速化・堅牢なセキュリティ。より簡単なスケーラブル・開発体験の向上という特徴を持っています。

JamStack の名前のとおりすべてのコードはクライアントサイドの JavaScript によって制御されます。従来のサーバーサイドやデータベースの処理は、API を通じて行います。

そして、最後の Markup は**実行時にAPIから取得したデータを動的にレンダリングせずに、ビルド時にAPIから取得して静的なHTMLとして出力**されます。

ここが、高速化のための最大の特徴と言えるでしょう。

以下の画像は、公式サイトから持ってきたアーキテクチャです。

![jamstack-architecture](//images.ctfassets.net/in6v9lxmm5c8/5oQMw62AcnUbxyKoW3bmHz/09eb4da9bbaaad25f985fac71db75b90/architecture.svg)

後に見る HeadlessCMS などで記事を投稿・更新をするなど API に更新があるたびにホスティングサービスに通知してビルドされます。

このように静的な HTML を配信するだけでですので堅牢なセキュリティ・簡単なスケーラブルを謳っているわけです。

# Jamstackを支える技術

それでは、実際に JamStack を構成するためにどのような技術が使われているか見ていきましょう。
主に以下の 3 つで構成されているのが一般的です。

- HeadlessCMS
- SSG(静的サイドジェネレーター)
- ホスティングサービス

## HeadlessCMS

CMS というワードには、聞き覚えがあるのではないでしょうか？

CMS（Content Manegement System）ということで文字通りブログの記事・ファイルなどを管理するシステムのことで**WordPress**が代表的です。

一方の HeadlessCMS は、モノリシックなサービスを提供する WordPress とは異なりバックエンドの機能のみを REST API や GraphQL で提供しているサービスです。

以下のサービスが有名です。

- contentful
- microCMS
- GraphCMS

バックエンドの機能のみを提供しているので、フロント側は基本的に自前で用意する必要があります。

とはいえ、マイクロアーキテクチャとして提供されているメリットは大きく、フロントの自由度が上がる・バックエンドと分離しているので開発体験の向上・あらゆるデバイスに配信できるなどが上げられます。

また先述したように基本的には記事の投稿や更新を webhook で通知するサービスが備わっており、Jamstack の CI/CD を支えています。

## SSG(静的サイドジェネレーター)

SSG(静的サイドジェネレーター)とは、静的な HTML ファイルを生成するツールです。
以下が代表的です。

- Next.js
- Nuxt.js
- Gatsby

Next.js・Gatsby は React ベース、Nuxt.js は Vue.js ベースのフレームワークです。

特に、GatsbyNext.js・Nuxt.js のように SSR はサポートしておらず、純粋に SSG のためだけに作成されたフレームワークです。
GraphQL を基本的に使用しており、さらに contentful などの連携などのプラグインが豊富でコミュニティも盛り上がっています。

ちなみにこのブログでは Svelte のフレームワークである[Sapper](https://sapper.svelte.dev/)で構築されています。

## ホスティングサービス

最後に、ホスティングサービスです。
静的な HTML ファイルを配信するだけですので選択肢が豊富です。
以下のサービスが代表的です。

- Netlify
- Vercel

どちらも GitHub のレポジトリと連携するだけで簡単にデプロイをできます。
レポジトリのメインブランチにプッシュなどの変更が走るたびに自動でデプロイしてくれます。

さらに、develop などのメインブランチ以外にプッシュされたときには、自動でプレビュー用の環境を作成してくれます。（なにそれすごい）

# 終わりに

というわけで新しいブログはとっても高速です。
SSG に Sapper・GraphQL を使用しましたが、この構成なら Gatsby を使ったほうがよっぽど簡単です。利用者も大きな差がありますしね。

さらに言えば将来的に Sapper はバージョン 1.0 にはならず[Svelte Kit](https://svelte.dev/blog/whats-the-deal-with-sveltekit)が代替となります。つまりは今 Sapper を学んでもあんまり得はありません。
なんでわざわざ Sapper 使ったんだ。

とはいえ Sapper の使いごこちはかなりよいので、来週あたり記事にしようと思います。
