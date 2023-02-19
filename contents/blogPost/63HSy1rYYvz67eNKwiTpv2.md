---
id: 63HSy1rYYvz67eNKwiTpv2
title: "SvelteKit で環境変数を使う"
slug: "sveltekit"
about: null
createdAt: null
updatedAt: null
tags: []
published: false
---
SvelteKit プロジェクトは Vite を使用しているので、[Vite を使った環境変数の参照](https://ja.vitejs.dev/guide/env-and-mode.html) ができます。しかし、この方法はクライアントに公開してよい値とサーバーに隠しおきたい機密データを区別できません。そのため、機密データを誤ってクライアント側から参照してしまうミスが起こりうります。

SvelteKit により提供されている環境変数の仕組みを使用すると、公開してはいけない値をクライアントから参照することができなくなります。

SvelteKit では以下の4つのモジュールから環境変数を参照できます。

- [$env/dynamic/private](https://kit.svelte.jp/docs/modules#$env-dynamic-private)
- [$env/dynamic/public](https://kit.svelte.jp/docs/modules#$env-dynamic-public)
- [$env/static/private](https://kit.svelte.jp/docs/modules#$env-static-private)
- [$env/static/public](https://kit.svelte.jp/docs/modules#$env-static-public)

## `$env` モジュール

## .env ファイル

