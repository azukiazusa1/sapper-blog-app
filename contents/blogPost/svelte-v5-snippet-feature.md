---
id: X072AVaE6VZciLZqLYhR2
title: "Svelte v5 で導入されるスニペット機能"
slug: "svelte-v5-snippet-feature"
about: "Svelte v5 ではスニペットと呼ばれる新しい機能が導入されます。スニペットとは、コンポーネント内で使用できる再利用可能なマークアップのことです。`#snippet` ディレクティブを使用してスニペットを定義し、引数を受け取ることができます。スニペットを呼び出す際には `@render` ディレクティブを使用します。またスニペットは単なる値として扱われるため、コンポーネントの Props として渡すことができます。"
createdAt: "2024-05-19T13:36+09:00"
updatedAt: "2024-05-19T13:36+09:00"
tags: ["Svelte"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/6lfMvi62wyl8rRoC32uJ1H/1ea1384cdc7bdad3c9b97bb3a8f62681/food_futomaki_cut_4755-768x609.png"
  title: "カットされた太巻きのイラスト"
audio: null
selfAssessment:
  quizzes:
    - question: "スニペットを宣言する際に使用するディレクティブはどれか？"
      answers:
        - text: "{#snippet}"
          correct: true
          explanation: null
        - text: "{#section}"
          correct: false
          explanation: null
        - text: "{#component}"
          correct: false
          explanation: null
        - text: "{#template}"
          correct: false
          explanation: null
published: true
---
Svelte v5 ではスニペットと呼ばれる新しい機能が導入されます。スニペットとは、コンポーネント内で使用できる再利用可能なマークアップのことです。`#snippet` ディレクティブを使用してスニペットを定義し、引数を受け取ることができます。スニペットを呼び出す際には `@render` ディレクティブを使用します。

```svelte
<script>
  const posts = [
    { id: 1, title: "Hello, Svelte", createdAt: "2024-05-19T13:36+09:00" },
    { id: 2, title: "Svelte is awesome", createdAt: "2024-05-19T13:36+09:00" },
  ];
</script>

{#snippet card(post)}
  <article>
    <h2>{post.title}</h2>
    <time datetime={post.createdAt}>{post.createdAt}</time>
  </article>
{/snippet}

{#each posts as post}
  {@render card(post)}
{/each}
```

上記の例では、`card` というスニペットを定義しています。スニペットは `post` という引数を受け取り、`article` 要素内にタイトルと作成日時を表示するコンポーネントです。`#each` ディレクティブを使用して `posts` 配列をループし、各要素に対して `card` スニペットを呼び出しています。

スニペットの利点はコードの繰り返しを減らしたり、可読性のためにコードを分割することができる点です。またスニペットはコンポーネント内で定義され、コンポーネントの外部からアクセスできないため、コンポーネントのカプセル化を保つことができます。

従来までの Svelte では 1 つのファイルにつき 1 つのコンポーネントしか定義できなかったため、React のようにローカルで小さなコンポーネントを定義することができない点が課題でした。スニペット機能の導入は、JavaScript のオブジェクトとして使いまわしができる JSX の利点を取り入れたものと言えます。

## スニペットをコンポーネントに渡す

スニペットが真価を発揮するのは、スニペットをコンポーネントに渡す際です。スニペットはテンプレート内では単なる値として扱われるため、コンポーネントの Props として渡すことができます。

```svelte:App.svelte
<script>
  import Layout from "./Layout.svelte";
</script>

{#snippet header(title)}
  <h1>{title}</h1>
{/snippet}

{#snippet footer()}
  <p>&copy; 2024 Svelte</p>
{/snippet}

<Layout header={header} footer={footer} />
```

Props として渡されたスニペットは、コンポーネント内で `{@render}` ディレクティブを使用して呼び出すことができます。

```svelte:Layout.svelte
<script lang="ts">
	import type { Snippet } from 'svelte';
	type Props = {
    // Snippet の型引数にはスニペットが受け取る引数の型をタプルで指定する
		header: Snippet<[string]>,
		footer: Snippet
	}
	const { header, footer } = $props<Props>();
</script>

<header>
  {@render header('Hello, Svelte')}
</header>
<main>
  ...
</main>
<footer>
  {@render footer()}
</footer>
```

スニペットをコンポーネントの子要素として直接定義した場合、暗黙的に Props として渡されます。下記のコードは上記の例と同じ動作をします。

```svelte:App.svelte
<script>
  import Layout from "./Layout.svelte";
</script>

<Layout>
  {#snippet header(title)}
    <h1>{title}</h1>
  {/snippet}

  {#snippet footer()}
    <p>&copy; 2024 Svelte</p>
  {/snippet}
</Layout>
```

さらにコンポーネントの子要素としてスニペットではない要素を定義した場合には、特別な `children` スニペットが暗黙的に定義されます。

```svelte:App.svelte {10-12}
<script>
  import Layout from "./Layout.svelte";
</script>

<Layout>
  {#snippet header(title)}
    <h1>{title}</h1>
  {/snippet}

  <div class="container">
    ...
  </div>

  {#snippet footer()}
    <p>&copy; 2024 Svelte</p>
  {/snippet}
</Layout>
```

```svelte:Layout.svelte {6, 8, 15}
<script lang="ts">
  import type { Snippet } from 'svelte';
  type Props = {
    header: Snippet<[string]>,
    footer: Snippet,
    children: Snippet
  }
  const { header, footer, children } = $props<Props>();
</script>

<header>
  {@render header('Hello, Svelte')}
</header>
<main>
  {@render children()}
</main>
<footer>
  {@render footer()}
</footer>
```

ところで、コンポーネントに子要素を渡す書き方はどこかで見たことがないでしょうか？そう、Svelte v4 までこの書き方は [slot](https://svelte.jp/docs/special-elements#slot) 要素を使用していました。`children` はデフォルトスロット、`header` と `footer` は名前付きスロットに相当します。

```svelte:Layout.svelte
<header>
  <slot name="header"></slot>
</header>
<main>
  <slot></slot>
</main>
<footer>
  <slot name="footer"></slot>
</footer>
```

スニペットが導入されたことにより、スロットは v5 から非推奨となりました。スニペットは前述の通りテンプレート内では値として扱われるため、スロットよりも柔軟性があり、また、Props として型定義ができるという利点があります。

## まとめ

- Svelte v5 ではスニペット機能が導入される。スニペットはコンポーネント内で使用できる再利用可能なマークアップである
- スニペットは `#snippet` ディレクティブを使用して定義し、引数を受け取ることができる。スニペットを呼び出す際には `@render` ディレクティブを使用する
- スニペットはコンポーネントの Props として渡すことができ、コンポーネント内で `{@render}` ディレクティブを使用して呼び出す
- スニペットがコンポーネントの子要素として直接定義された場合、暗黙的に Props として渡される。また、スニペット以外の要素が定義された場合には `children` スニペットが暗黙的に定義される
- スニペットはスロットに代わる機能であり、v5 からスロットは非推奨となる
- スニペットの利点はコードの繰り返しを減らしたり、可読性のためにコードを分割することができる点である。これは React の JSX の利点を取り入れたものと言える

## 参考

- [Snippets • Docs • Svelte 5 preview](https://svelte-5-preview.vercel.app/docs/snippets)
- [Svelte Snippets - Say Goodbye To Slots](https://sveltekit.io/blog/snippets)
