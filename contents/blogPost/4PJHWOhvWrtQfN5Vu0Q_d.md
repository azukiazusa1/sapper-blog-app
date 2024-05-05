---
id: 4PJHWOhvWrtQfN5Vu0Q_d
title: "Svelte v5 における イベントハンドラの変更点"
slug: "svelte-v5-event-handlers"
about: "Svelte v5 では、イベントハンドラの書き方が一新され、いくつか非推奨となった書き方があります。この記事では、Svelte v4 と Svelte v5 のイベントハンドラの書き方の違いについて見ていきます。"
createdAt: "2024-05-05T15:15+09:00"
updatedAt: "2024-05-05T15:15+09:00"
tags: ["Svelte"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/xBERA0jHZ420rvwgG6hQK/27f792a616ddcdbae832e2ab85c88b57/ball-juggling_male_20221.png"
  title: "ボールをジャグリングする男性のイラスト"
selfAssessment:
  quizzes:
    - question: "Svelte v5 において、`on:click` の代わりとなるイベントハンドラの書き方はどれか？"
      answers:
        - text: "onclick={handler}"
          correct: true
          explanation: ""
        - text: "v-on:click={handler}"
          correct: false
          explanation: "Vue.js のイベントハンドラの書き方です。"
        - text: "(click)={handler}"
          correct: false
          explanation: "Angular のイベントハンドラの書き方です。"
        - text: "onClick={handler}"
          correct: false
          explanation: "イベントハンドラは小文字で記述します。"
    - question: "Svelte v5 において、`createEventDispatcher` の代わりにコンポーネントからイベントを発火する方法はどれか"
      answers:
        - text: "`$emit` メソッドを使用する"
          correct: false
          explanation: "Vue.js のイベント発火の方法です。"
        - text: "Props としてコールバック関数を渡す"
          correct: true
          explanation: ""
        - text: "`EventEmitter` クラスを使用する"
          correct: false
          explanation: ""
        - text: "`CustomEvent` クラスを使用する"
          correct: false
          explanation: ""
published: true
---

Svelte v5 では、イベントハンドラの書き方が一新され、いくつか非推奨となった書き方があります。この記事では、Svelte v4 と Svelte v5 のイベントハンドラの書き方の違いについて見ていきます。

## `on:` ディレクティブが非推奨に

Svelte v4 までは、DOM イベントを購読するために `on:` ディレクティブを使用していました。例えば、`click` イベントを購読する場合には以下のように記述します。

```svelte
<script>
  function handleClick() {
    console.log("clicked");
  }
</script>

<button on:click={handleClick}>Click me</button>
```

Svelte v5 では、`on:` ディレクティブが非推奨となり、単なるプロパティとしてイベントハンドラを指定するようになりました。上記の例を Svelte v5 で書き直すと以下のようになります。

```svelte
<script>
  function handleClick() {
    console.log("clicked");
  }
</script>

<button onclick={handleClick}>Click me</button>
```

`onclick` もプロパティの 1 つなったため、その他のプロパティと同じように省略記法も使用できます。

```svelte
<script>
  function onclick() {
    console.log("clicked");
  }
</script>

<button {onclick}>Click me</button>
```

## コンポーネントのイベント

Svelte v4 までは Svelte コンポーネントからイベントを発火するために [createEventDispatcher](https://svelte.jp/docs/`svelte#createeventdispatcher) 関数を使用していました。`createEventDispatcher` 関数は [CustomEvent](https://developer.mozilla.org/ja/docs/Web/API/CustomEvent) を作成します。CustomEvent に第 1 引数にイベント名、第 2 引数にイベントデータを渡すことで、コンポーネントからイベントが発火されます。

```svelte:TodoForm.svelte
<script>
  import { createEventDispatcher } from "svelte";

  let title = "";

  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch("createTodo", { title });
  }
</script>

<input bind:value={title} />
<button on:click={handleClick}>Create</button>
```

親コンポーネントからイベントを購読する場合には、`on:createTodo` ディレクティブを使用します。

```svelte
<script>
  import TodoForm from "./TodoForm.svelte";
  import { createTodo } from "./api";

  function handleCreate(event) {
    createTodo(event.detail.title);
  }
</script>

<TodoForm on:createTodo={handleCreate} />
```

Svelte v5 では、`createEventDispatcher` 関数が非推奨となり、代わりに Props としてコールバック関数を渡すことが推奨されます。上記の例を Svelte v5 で書き直すと以下のようになります。

```svelte:TodoForm.svelte
<script>
  let title = $state("");
  const { createTodo } = $props();

  function handleClick() {
    createTodo(title);
  }
</script>

<input bind:value={title} />
<button onclick={handleClick}>Create</button>
```

親コンポーネントからイベントを購読するには、Props としてコールバック関数を渡します。

```svelte
<script>
  import TodoForm from "./TodoForm.svelte";
  import { createTodo } from "./api";

  function handleCreate(title) {
    createTodo(title);
  }
</script>

<TodoForm createTodo={handleCreate} />
```

`on:` ディレクティブと `createEventDispatcher` 関数が非推奨となったことで、以下のような利点が考えられます。

- Svelte の学習コストが軽減される
- `createEventDispatcher` 周りのボイラープレートが削減される
- Props としてコールバック関数を渡すことにより、特定のイベントハンドラーが必須かどうかが明確になったり、コンポーネントが特定のイベントを発火しないことが保証される

## イベントのフォワーディング

Svelte v4 までは、コンポーネントのイベントは DOM のイベントと異なりバブリングされませんでした。孫コンポーネントから親コンポーネントにイベントをフォワーディングするためには、子コンポーネントでイベントのフォーワーディングを行う必要がありました。

`App.svelte` → `Parent.svelte` → `Child.svelte` のような構造で `Child.svelte` でイベントを以下のように発火したとしましょう。

```svelte:Child.svelte
<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  function handleClick() {
    dispatch("click");
  }
</script>

<button on:click={handleClick}>Click me</button>
```

`Parent.svelte` で `Child.svelte` から発火されたイベントをフォワーディングするためには、`Parent.svelte` で以下のように値のない `on:click` ディレクティブを使用します。

```svelte:Parent.svelte
<script>
  import Child from "./Child.svelte";
</script>

<Child on:click />
```

Svelte v5 では、単にイベントを Props として渡します。

```svelte:Child.svelte
<script>
  const { onclick } = $props();

  function handleClick() {
    onclick();
  }
</script>

<button onclick={handleClick}>Click me</button>
```

```svelte:Parent.svelte
<script>
  import Child from "./Child.svelte";
  const { onclick } = $props();
</script>

<Child onclick={onclick} />
```

```svelte:App.svelte
<script>
  import Parent from "./Parent.svelte";
  function handleClick() {
    console.log("clicked");
  }
</script>

<Parent onclick={handleClick} />
```

##　イベントの修飾子

Svelte v4 までは以下のようにイベントの修飾子を使用できました。

```svelte
<button on:click|preventDefault={handler}>...</button>
```

これは `on:` ディレクティブ特有の構文であり、`on:` ディレクティブが非推奨となったことで、上記のような修飾子も使われなくなります。これは明示的にイベントハンドラ内で処理するように変更します。

```svelte
<script>
  function handleClick(event) {
    event.preventDefault();
    console.log("clicked");
  }
</script>

<button onclick={handleClick}>...</button>
```

## 複数のイベントハンドラ

Svelte v4 までは以下のように複数のイベントハンドラを指定できました。

```svelte
<button on:click={handler1} on:click={handler2}>...</button>
```

これはある種のアンチパターンとされていました。属性が多い場合、同じイベントハンドラが登録されていることが認識しづらくなります。Svelte v5 では、重複したイベントハンドラを指定することは許可されなくなります。代わりに以下のように 1 つのイベントハンドラ内で処理するように変更します。

```svelte
<script>
  function handleClick(event) {
    handler1(event);
    handler2(event);
  }
</script>

<button onclick={handleClick}>...</button>
```

## まとめ

- Svelte v5 では、`on:` ディレクティブが非推奨となり、単なるプロパティとしてイベントハンドラを指定するようになった
- `createEventDispatcher` 関数が非推奨となり、代わりに Props としてコールバック関数を渡すことが推奨される

## 参考

- [Event handlers • Docs • Svelte 5 preview](https://svelte-5-preview.vercel.app/docs/event-handlers)
