---
id: 3tATxZH0jXTQW72zPVb5pz
title: "SvelteKit でページ遷移時のプログレスバーを表示する"
slug: "sveltekit-navigate-progressbar"
about: "SPA で画面遷移をする場合、MPA の場合と違い、ブラウザがローディングの表示を行ってくれません。リンクをクリックしてから画面遷移が完了するまで何も表示されないので、ユーザーからすると何も反応していないように感じてしまいます。 SPA で画面遷移した時にプログレスバーを表示したい場合には NProgress が最適です。コンパクトな JavaScript ライブラリでフレームワークを選ばず利用できます。この記事では SvelteKit で NProgress を使用する方法を紹介します。"
createdAt: "2023-02-06T00:00+09:00"
updatedAt: "2023-02-06T00:00+09:00"
tags: ["SvelteKit", "Svelte"]
published: true
---
SPA で画面遷移をする場合、MPA の場合と違い、ブラウザがローディングの表示を行ってくれません。リンクをクリックしてから画面遷移が完了するまで何も表示されないので、ユーザーからすると何も反応していないように感じてしまいます。この問題を解消するには、自前のプログレスバーを表示するのがよいでしょう。Youtube や GitHub でも画面遷移をする際にページ上部にプログレスバーが表示されます。

SPA で画面遷移した時にプログレスバーを表示したい場合には NProgress が最適です。コンパクトな JavaScript ライブラリでフレームワークを選ばず利用できます。

https://github.com/rstacruz/nprogress

この記事では SvelteKit で NProgress を使用する方法を紹介します。

## セットアップ

まずは NProgress をインストールします。

```sh
npm i nprogress
```

続いて `src/routes/+layout.svelte` ファイルで NProgress 本体と CSS を import します。`src/routes/+layout.svelt` というファイルはすべてのページに適用されるレイアウトです。

```html:src/routes/+layout.svelte
<script lang="ts">
  import NProgress from 'nprogress';
  import 'nprogress/nprogress.css';
  import { navigating } from '$app/stores';

  // NProgress の設定 https://github.com/rstacruz/nprogress#configuration
  NProgress.configure({
    showSpinner: false // スピナーを表示しない
  });

	$: {
		if ($navigating) {
      // プログレスバーの表示を開始する
			NProgress.start();
		}
		if (!$navigating) {
      // プログレスバーを完了する
			NProgress.done();
		}
	}
</script>
```

SvelteKit において画面遷移を行っているかどうかは、[$app/stores](https://kit.svelte.jp/docs/modules#$app-stores) モジュールの `$navigating` ストアを使用することで判定できます。`$navigating` ストアは画面遷移が開始すると値が [Navigation](https://kit.svelte.jp/docs/types#public-types-navigation) オブジェクトとなり、画面遷移が終了するとその値は `null` となります。

この `$navigating` ストアの値の変更を[リアクティブステートメント](https://svelte.jp/docs#component-format-script-3-$-marks-a-statement-as-reactive) `$:{ ... }` で監視しています。リアクティブステートメントに依存している値が変更されるたびに実行されます。

このリアクティブステートメントの中で画面遷移が開始（= `$navigating` が `null` ではない）したら `NProgress.start()` でプログレスバーの表示を開始します。画面遷移が終了（= `$navigating` が `null`）した場合、`NProgress.done()` でプログレスバーを完了させます。

このように簡単な実装でプログレスバーを表示できます。

## デモ

![リンクをクリックして画面遷移をするたびに、画面上部にプログレスバーが表示されている様子](//images.ctfassets.net/in6v9lxmm5c8/3Oc6tbPk1TqMDw7jEJcXz8/623405d35e25643f884cff84a58d7f8b/sveltekit-progressbar.gif)
