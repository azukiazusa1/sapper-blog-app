---
id: 2hgyTnHqH7WISFTlSvheWb
title: "Sapper + contentful + VercelのJamstackで高速なブログを構築する"
slug: "sapper-contentful-vercel-jamstack-blog"
about: "JamstackのJamはJavaScript/APIs/Markupの頭文字です。 従来の手法と比較して、高速化・堅牢なセキュリティ。より簡単なスケーラブル・開発体験の向上という特徴を持っています。実行時にAPIから取得したデータを動的にレンダリングせずに、ビルド時にAPIから取得して静的なHTMLとして出力されます。"
createdAt: "2021-02-14T00:00+09:00"
updatedAt: "2021-02-14T00:00+09:00"
tags: ["Sapper", "graphQL", "JavaScript", "Svelte"]
published: true
---
# ブログ引っ越しました！

タイトルにあるとおりですが、ブログを新たに作成しました。
以前のブログでもある程度満足はしていたのですが、新たにブログを作成した最大の理由がパフォーマンスです。これに関しては、Lighthouseのスコアを見れば一目瞭然かと思います。

![compare-lighthouse-score](//images.ctfassets.net/in6v9lxmm5c8/6gm2HbmC8ZHjgm2fiPOTRx/be24cbf6369735fa4194f294069975d8/____________________________2021-02-14_20.38.52.png)

旧ブログがここまで遅い理由は、以下の点が考えられます。

- SPAで構築されているため、初期表示に時間がかかっている
- 記事を表示するのにAPI(firastore)に毎回問い合わせている
- 不要なfirebaseのライブラリのコードが含まれている(結構サイズが大きい)

1年前くらいに作ったので、いろいろなところがお粗末でした。
Vue.js + firebaseという構成でしたが、ブログのためにfirebaseを使う辺りオーバースペックだったりしますね。

さて、新ブログのパフォーマンスの速さの秘密に迫っていきましょう。
キーワードは、Jamstackです。

# Jamstackとは

[Jamstack](https://jamstack.org/)のJamはJavaScript/APIs/Markupの頭文字です。
従来の手法と比較して、高速化・堅牢なセキュリティ。より簡単なスケーラブル・開発体験の向上という特徴を持っています。

JamStackの名前の通りすべてのコードはクライアントサイドのJavaScriptによって制御されます。従来のサーバサイドやデータベースの処理は、APIを通じて行います。

そして、最後のMarkupは**実行時にAPIから取得したデータを動的にレンダリングせずに、ビルド時にAPIから取得して静的なHTMLとして出力**されます。

ここが、高速化のための最大の特徴と言えるでしょう。

以下の画像は、公式サイトから持ってきたアーキテクチャです。

![jamstack-architecture](//images.ctfassets.net/in6v9lxmm5c8/5oQMw62AcnUbxyKoW3bmHz/09eb4da9bbaaad25f985fac71db75b90/architecture.svg)

後に見るHeadlessCMSなどで記事を投稿・更新をするなどAPIに更新がある度にホスティングサービスに通知してビルドされます。

このように静的なHTMLを配信するだけでですので堅牢なセキュリティ・簡単なスケーラブルを謳っているわけです。

# Jamstackを支える技術

それでは、実際にJamStackを構成するためにどのような技術が使われているか見ていきましょう。
主に以下の3つで構成されているのが一般的です。

- HeadlessCMS
- SSG(静的サイドジェネレーター)
- ホスティングサービス

## HeadlessCMS

CMSというワードには、聞き覚えがあるのではないでしょうか？

CMS（Content Manegement System）ということで文字通りブログの記事・ファイルなどを管理するシステムのことで**WordPress**が代表的です。

一方のHeadlessCMSは、モノリシックなサービスを提供するWordPressとは異なりバックエンドの機能のみをREST APIやGraphQLで提供しているサービスです。

以下のサービスが有名です。

- contentful
- microCMS
- GraphCMS

バックエンドの機能のみを提供しているので、フロント側は基本的に自前で用意する必要があります。

とはいえ、マイクロアーキテクチャとして提供されているメリットは大きく、フロントの自由度が上がる・バックエンドと分離しているので開発体験の向上・あらゆるデバイスに配信できるなどが上げられます。

また、先述したように基本的には記事の投稿や更新をwebhookで通知するサービスが備わっており、JamstackのCI/CDを支えています。

## SSG(静的サイドジェネレーター)

SSG(静的サイドジェネレーター)とは、静的なHTMLファイルを生成するツールです。
以下が代表的です・

- Next.js
- Nuxt.js
- Gatsby

Next.js・GatsbyはReactベース、Nuxt.jsはVue.jsベースのフレームワークです。

特に、GatsbyNext.js・Nuxt.jsのようにSSRはサポートしておらず、純粋にSSGのためだけに作成されたフレームワークです。
GraphQLを基本的に使用しており、さらにcontentfulなどの連携などのプラグインが豊富でコミュニティも盛り上がっています。

ちなみにこのブログではSvelteのフレームワークである[Sapper](https://sapper.svelte.dev/)で構築されています。

## ホスティングサービス

最後に、ホスティングサービスです。
静的なHTMLファイルを配信するだけですので選択肢が豊富です。
以下のサービスが代表的です。

- Netlify
- Vercel

どちらもGitHubのレポジトリと連携するだけで簡単にデプロイをすることができます。
レポジトリのメインブランチにプッシュなどの変更が走る度に自動でデプロイしてくれます。

さらに、developなどのメインブランチ以外にプッシュされたときには、自動でプレビュー用の環境を作成してくれます。(なにそれすごい）

# 終わりに

というわけで新しいブログはとっても高速です。
SSGにSapper・GraphQLを使用しましたが、この構成ならGatsbyを使ったほうがよっぽど簡単です。利用者も大きな差がありますしね。

更に言えば将来的にSapperはバージョン1.0にはならず[Svelte Kit](https://svelte.dev/blog/whats-the-deal-with-sveltekit)が代替となります。つまりは今Sapperを学んでもあんまり得はありません。
なんでわざわざSapper使ったんだ。

とはいえSapperの使いごこちはかなりよいので、来週あたり記事にしようと思います。

