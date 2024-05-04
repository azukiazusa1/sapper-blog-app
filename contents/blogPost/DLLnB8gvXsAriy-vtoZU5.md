---
id: DLLnB8gvXsAriy-vtoZU5
title: "Svelte v5 で導入された Runes によるリアクティビティシステム"
slug: "svelte-reactivity-system-with-runes"
about: "Svelte v5 で導入された Runes によるリアクティビティシステムについて解説します。従来の Svelte は純粋な JavaScript のコードのみを使用してリアクティビティを実現していましたが、アプリケーションが大規模になると複雑性が増すという問題がありました。Runes は Svelte のリアクティビティシステムをより柔軟にし、アプリケーションの規模が大きくなってもシンプルさを保つことを目指しています。"
createdAt: "2024-05-04T14:54+09:00"
updatedAt: "2024-05-04T14:54+09:00"
tags: ["Svelte", "JavaScript"]
thumbnail:
  url: "https://images.ctfassets.net/in6v9lxmm5c8/3DiWpMzhc1IffEvBT6dLbT/04824286f622909e107d811312400178/magic-circle_5540-768x768.png"
  title: "魔法陣のイラスト"
selfAssessment:
  quizzes:
    - question: "Runes において、リアクティブな変数を宣言するために使用する関数はどれか？"
      answers:
        - text: "$state"
          correct: true
        - text: "$derived"
          correct: false
          explanation: "$derived はある状態から派生した値を計算するために使用されます。"
        - text: "$ref"
          correct: false
          explanation: "$ref という関数は 存在しません。"
        - text: "$reactive"
          correct: false
          explanation: "$reactive という関数は 存在しません。"
published: true
---

従来の Svelte は純粋な JavaScript のコードのみを使用してリアクティビティを実現したのが特徴でした。

```svelte
<script>
  let count = 0;
  function handleClick() {
    count += 1;
  }

  $: doubled = count * 2;
</script>

<button on:click={handleClick}>
  Clicked {count}
  {count === 1 ? "time" : "times"}
</button>

<p>{count} doubled is {doubled}</p>
```

上記のコード例では通常の JavaScript と同じ方法で変数が宣言されていますが、これは Svelte のコンパイラによりリアクティブな変数に変換されます。`count` 変数の値が更新されるたびに、UI が自動的に更新されます。`$:` で始まる式は Svelte のリアクティビティシステムにより自動的に監視され、変更があると再評価されます（構文としては JavaScript として有効な[ラベル](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/label)です）。

Svelte v5 で導入された Runes は、新しいリアクティビティシステムを提供します。Runes を使用したコードは以下のように書き換えられます。

```svelte
<script>
  let count = $state(0);
  function handleClick() {
    count += 1;
  }

  let doubled = $derived(count * 2);
</script>

<button onclick={handleClick}>
  Clicked {count}
  {count === 1 ? "time" : "times"}
</button>
<p>{count} doubled is {doubled}</p>
```

リアクティブな変数は `$state` 関数で宣言され、`$:` の代わりに `$derived` 関数を使用してある状態から派生した値を計算します。Runes は下記の Playground で試すことができます。

https://svelte-5-preview.vercel.app/

なお、Svelte v5 では Runes はオプトインとして提供されおり、従来のリアクティビティシステムを引き続き使用することも可能です。Runes を使用するには以下の　2 つの方法があります。

- `svelte.config.js` ファイルに `compilerOptions: { runes: true }` を追加する
- 個別のコンポーネントごとに `<svelte:options runes={true} />` を追加する

この記事ではなぜ Runes が導入されたのか、どのように使うのかについて解説します。

## なぜ Runes が導入されたのか

冒頭で述べたとおり、Svelte は JavaScript として有効な構文のみを使用してリアクティビティを実現していたことを特徴としていました。これは `useState` や `ref` のような特別な関数の使用方法を学習する必要がなく、よりシンプルなコードを書くことができるという利点がありました。

このような Svelte 特有の利点を捨ててまで Runes を導入する理由は何でしょうか。その理由として、アプリケーションが複雑になるにつれて変数がリアクティブかそうでないかを区別するのが難しくなるという問題があげられます。

`let` キーワードで変数を宣言してその変数がリアクティブとなるのは、トップレベルの Svelte コンポーネントで変数が宣言された場合に限られます。以下のように、`.js` ファイルで変数を宣言して、その値を `.svelte` ファイルで import して使用する場合、変数はリアクティブではありません。このように変数を宣言する場所によってリアクティビティの挙動が異なることは、Svelte の初学者にとって混乱を招く可能性があります。

```javascript:counter.js
export function createCounter() {
  let count = 0;

  function increment() {
    count += 1;
  }

  return { count, increment };
}
```

```svelte:Counter.svelte
<script>
  import { count, increment } from './counter.js';
</script>

<button on:click={increment}>
  Clicked {count}
  {count === 1 ? "time" : "times"}
</button>
```

`.svelte` ファイル以外の場所でリアクティブな変数を定義し、複数のコンポーネントで使用する場合には [svelte/store](https://svelte.jp/docs/svelte-store) モジュールを使用することが一般的です。ストアを使用すると以下のようにリアクティブな変数を宣言できます。

```javascript:counter.js
import { writable } from 'svelte/store';

export function createCounter() {
	const { subscribe, update } = writable(0);

	return {
		subscribe,
		increment: () => update((n) => n + 1)
	};
}
```

そして、`.svelte` ファイルでストアの値を参照するための糖衣構文として、`$` プレフィックスを使用します。

```svelte:Counter.svelte
<script>
  import { createCounter } from './counter.js';
  const counter = createCounter();
</script>

<button on:click={counter.increment}>
  Clicked {$counter}
  {$counter === 1 ? "time" : "times"}
</button>
```

このストアを使用する方法はうまく機能しますが、いくつか奇妙な点が残ります。第 1 にリアクティブな値を宣言する方法が Svelte に複数存在することです。ユーザーは `let` で変数を宣言する方法とストアを使う方法を適切に使い分ける必要があります。第 2 にストア自体の複雑性です。ストアの値をリアクティブに参照するための `$` プレフィックスは `let` で変数を宣言する方法と一貫性が欠けており、JavaScript の構文としても逸脱しています。どの変数に対して `$` プレフィックスを付けるべきかを判断するのは難しいかもしれません。

このようにアプリケーションの規模が大きくなり、ストアを使い始めると徐々に Svelte のシンプルさが失われていくという問題がありました。`$:` や `$$props`、`<script context="module">` のような構文もあり、Svelte は徐々に複雑になっていきます。`useState` や `ref` のような特別な関数を学習する必要がないのは Svelte を使い始めた初期の段階では確かにあてはまりますが、一定規模以上のアプリケーションを開発する場合にはどうしても複雑な構文を使わざるを得なくなります。

Svelte はアプリケーションが小さなうちはシンプルに保てますが、アプリケーションでより高度なことをやり始めると学習コストが急激に上昇してしまうという一般的な問題としてまとめられます。

Runes はこの問題に対処するために導入されました。Runes によるリアクティブシステムは、どのような場所でも一貫して方法でリアクティブな変数を宣言できるようにすることを目的としています。`.js` ファイルにおいても、`.svelte` ファイルと同じ `$state` 関数を使用してリアクティブな変数を宣言できるのです。

```javascript:counter.js
export function createCounter() {
	let count = $state(0);

	return {
		get count() { return count },
		increment: () => count += 1
   };
}
```

SVelte は Runes により、アプリケーション規模に関わらずよりシンプルで高機能となることを目指しています。

## Runes で提供されている関数

Runes は Svelte コンパイラに指示を与えるための関数のようなシンボルです。Runes は Svelte 言語の一部として提供されているため、使用するために import する必要はありません。Runes は以下の関数を提供します。

- `$state`
- `$state.frozen`
- `$state.snapshot`
- `$derived`
- `$derived.by`
- `$effect`
- `$effect.pre`
- `$effect.active`
- `$effect.root`
- `$props`
- `$bindable`
- `$inspect`
- `$host`

### `$state`

`$state` 関数はリアクティブな変数を宣言するために使用されます。`$state` 関数は初期値を引数として受け取り、リアクティブな変数を返します。

```svelte
<script>
  let count = $state(0);
</script>

<button onclick={() => (count += 1)}>
  {count}
</button>
```

`$state` は class のフィールドとしても使用できます。

```js
export class Todo {
  done = $state(false);
  text = $state("");

  constructor(text) {
    this.text = text;
  }
}
```

値は [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) オブジェクトによりラップされているため、オブジェクトや配列に対しても直接値を変更できます。

```svelte
<script>
  let obj = $state({ a: 1, b: 2 });
  let arr = $state([1, 2, 3]);

  function update() {
    obj.a += 1;
    arr.push(4);
  }
</script>

<button onclick={update}> Update </button>

<p>{obj.a}</p>
<p>{arr.join(", ")}</p>
```

### `$state.frozen`

`$state.frozen` で宣言された値は、変更不可能な値として扱われ、値の再代入のみが許可されます。オブジェクトのプロパティを直接更新したり、配列の `push` や `pop` などのメソッドを使用する代わりに、新しいオブジェクトや配列を生成して再代入する必要があります。

```svelte
<script>
  let obj = $state.frozen({ a: 1, b: 2 });
  let arr = $state.frozen([1, 2, 3]);

  function update() {
    obj = { ...obj, a: obj.a + 1 };
    arr = [...arr, 4];
  }
</script>

<button onclick={update}> Update </button>

<p>{obj.a}</p>
<p>{arr.join(", ")}</p>
```

`$state.frozen` は将来変更される予定がない巨大な配列やオブジェクトに対して使用すると効果的です。個別の値をリアクティブにする必要がないため、パフォーマンスが向上します。

### `$state.snapshot`

`$state` にオブジェクトや配列を渡して `console.log` で表示すると、`Proxy` オブジェクトが表示されます。`$state.snapshot` 関数を使用すると、`Proxy` オブジェクトではなく、オブジェクトや配列のスナップショットを取得できます。

```svelte
<script>
  let counter = $state({ count: 0 });

  function onclick() {
    console.log(counter); // `Proxy { ... }`
    console.log($state.snapshot(counter)); // `{ count: 0 }`
  }
</script>
```

### `$derived`

`$derived` 関数はある状態から派生した値を計算するために使用されます。これは従来の Svelte における `$:` に相当します。

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);

  function handleClick() {
    count += 1;
  }
</script>

<button on:click={handleClick}>
  Clicked {count}
  {count === 1 ? "time" : "times"}
</button>

<p>{count} doubled is {doubled}</p>
```

`$derived()` の引数として渡したリアクティブな変数が更新されると、`$derived()` で計算した値も自動的に更新されます。`$derived()` 関数内では副作用を持つ処理を行うことはできません。また、`count++` のように `$derived()` 関数内で変数を更新することもできません。

`$state` と同じく、`$derived` も class のフィールドとしても使用できます。

### `$derived.by`

`$derived.by` 関数は `$derived` 関数と異なり、引数に関数を取ります。単純な式ではなく、複雑な計算を行う場合に使用します。

```svelte
<script>
  let shoppingCart = $state([{
    name: "Apple",
    price: 100,
    quantity: 2
    selected: false
  },
  {
    name: "Banana",
    price: 50,
    quantity: 3,
    selected: true
  }]);

  let total = $derived.by(() => {
    const selectedItems = shoppingCart.filter(item => item.selected);
    let price = 0;
    for (const item of selectedItems) {
      price += item.price * item.quantity;
    }
    return price;
  });
</script>
```

### `$effect`

`$effect` 関数は副作用を持つ処理を行うために使用されます。`$effect` 関数はコンポーネントがマウントされたとき、リアクティブな変数が更新され DOM が更新された後に実行されます。

以下の例では 3 の倍数または 3 のつく数字になるとアラートが表示されます。

```svelte
<script>
  let count = $state(0);

  $effect(() => {
    if (count === 0) return;

    if (count % 3 === 0 || count.toString().includes("3")) {
      alert("3の倍数または3のつく数字です");
    }
  });
</script>

<button onclick={() => (count += 1)}>
  {count}
</button>
```

`$effect` 関数は内部で使用されている `$state` もしくは `$derived` の値を同期的に読み取り監視します。つまり、`await` や `setTimeout` などの関数の値は監視されません。

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);

  $effect(() => {
    // doubled が更新されても、console.log は実行されない
    setTimeout(() => console.log(doubled));
  });
</script>

<button onclick={() => count++}>
  {doubled}
</button>

<p>{count} doubled is {doubled}</p>
```

`$effect` はオブジェクトのプロパティが更新されたときに場合には実行されないことに注意してください。`object.count` のようにプロパティの値を直接参照している場合のみ `$effect` が実行されます。

```svelte
<script>
  let obj = $state({ count: 0 });
  function increment() {
    obj.count += 1;
  }

  $effect(() => {
    // これは実行されない
    console.log(obj);
  });

  $effect(() => {
    // これは実行される
    console.log(obj.count);
  });
</script>
```

`$effect` は返り値として関数を返すことができます。この関数は `$effect` が再実行される直前もしくはコンポーネントがアンマウントされる直前に実行されます。

一般的な使用方法として `$effect` でイベントリスナーやタイマーを登録した場合に、メモリリークを防ぐためにクリーンアップ処理を行うことが挙げられます。

```svelte
<script>
  function handleResize() {
    // ...
  }

  $effect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
</script>
```

`$effect` は従来の Svelte における `onMount`, `afterUpdate`, `onDestroy` を代替する役割を担います。

`$effect` は DOM を直接操作する、アナリティクスデータを送信するといった副作用を行うためのエスケープハッチとしてのみ使用するべきです。例えば、以下のようにある状態が更新された際にその他の状態を更新するような処理を `$effect` で行うべきではありません。

```svelte
<script>
  let count = $state(0);
  let doubled = $state(0);

  $effect(() => {
    doubled = count * 2;
  });
</script>
```

これは `$derived` 関数を使用するべきです。

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
</script>
```

### `$effect.pre`

`$effect.pre` 関数は `$effect` 関数と同様に副作用を持つ処理を行うために使用されます。`$effect` 関数は DOM が更新された後に実行されるのに対し、`$effect.pre` 関数は DOM が更新される前に実行されます。

これは従来の Svelte における `beforeUpdate` に相当します。

### `$effect.active`

`$effect.active` 関数は `$effect` コードが `$effect` 内で実行されている場合に `true` を返します。

```svelte
<script>
  console.log($effect.active()); // false

  $effect(() => {
    console.log($effect.active()); // true
  });
</script>
```

### `$effect.root`

`$effect.root` は自動でクリーンアップをせずに監視を行わないスコープを作成する高度な機能です。この関数を使用すると、コンポーネントの初期化時以外のタイミングで `$effect` を作成することもできます。

### `$props`

`$props` 関数はコンポーネントに渡されたプロパティを取得するために使用されます。

```svelte:Hello.svelte
<script>
  const { name, age } = $props();
</script>

<p>Hello, {name}! You are {age} years old.</p>
```

Props は以下のようにコンポーネントに渡されます。

```svelte
<Hello name="Alice" age={30} />
```

オブジェクトの rest 構文を使用して、コンポーネントに渡されたプロパティをまとめて取得することもできます。

```svelte
<script>
  const { name, ...restProps } = $props();
</script>
```

Props のデフォルト値を設定することもできます。

```svelte
<script>
  const { name = "Bob", age = 20 } = $props();
</script>
```

TypeScript を使用する場合には、以下のように型を指定することができます。

```svelte
<script lang="ts">
  type Props = {
    name: string;
    age: number;
  };

  const { name, age }: Props = $props();
</script>
```

デフォルトで Props の値は読み取り専用です。Props の値の変更を試みると、開発モードではコンソールに警告が表示されます。

`$props` は従来の Svelte における `export let` や `$$props`, `$$restProps` を代替する役割を担います。

### `$bindable`

`$props` の値は読み取り専用であるため、[:bind](https://svelte.jp/docs/element-directives) ディレクトリブを使用して Props の値を変更することはできません。`$bindable` 関数は Props の値を子コンポーネントから変更可能にして `bind:` ディレクティブを使用することができるようにします。

```svelte:MyInput.svelte
<script>
  let { value = $bindable() } = $props();
</script>

<input type="text" bind:value />
```

親コンポーネントから `value` Props を `bind:` ディレクティブとして使用することができます。

```svelte
<script>
  import MyInput from "./MyInput.svelte";
  let name = $state("");
</script>

<MyInput bind:value={name} />

{#if name}
  <p>Hello, {name}!</p>
{/if}
```

`$bindable` 関数は以下のように Props のデフォルト値を設定することもできます。

```svelte:MyInput.svelte
<script>
  const { value: $bindable("alice") } = $props();
</script>
```

### `$inspect`

`$inspect` 関数はデバッグ用途で使用され、開発モードでのみ動作ます。`$inspect` 関数は引数として渡された値が更新されるたびにコンソールに表示します。

```svelte
<script>
  let count = $state(0);
  let doubled = $derived(count * 2);
  $inspect(count, doubled);
</script>
```

`$inspect` 関数の返り値の `with` プロパティはコールバック関数を受け取ります。コールバック関数の 1 つ目の引数は `"update"` または `"init"` で、2 つ目の引数は更新された値です。

```svelte
<script>
  let count = $state(0);
  $inspect(count).with((type, value) => {
    if (type === "update") {
      debugger;
    }
  });
</script>
```

### `$host`

`$host` 関数は Svelte を [Custom Element](https://svelte.jp/docs/custom-elements-api) としてコンパイルする場合に使用されます。`$host` 関数は Custom Element のホスト要素を取得します。

```svelte
<!-- Custom Element <my-element> としてコンパイル -->
<svelte:options customElement="my-element" />

<script>
  function greet() {
    $host().dispatchEvent(new CustomEvent("greet"));
  }
</script>

<button onclick={greet}>Greet</button>
```

### まとめ

- Svelte v5 で導入された Runes は新しいリアクティビティシステムを提供する
- Runes は `$state`, `$state.frozen`, `$state.snapshot`, `$derived`, `$derived.by`, `$effect`, `$effect.pre`, `$effect.active`, `$effect.root`, `$props`, `$bindable`, `$inspect`, `$host` の関数を提供する
- Svelte はアプリケーションが小規模なうちはシンプルであるが、アプリケーションが大規模になると複雑性が増すという問題に対処するために Runes が導入された。Runes はどのような場所でも一貫した方法でリアクティブな変数を宣言できるようにする

## 参考

- [Introduction • Docs • Svelte 5preview](https://svelte-5-preview.vercel.app/docs/introduction)
- [Introducing runes](https://svelte.dev/blog/runes)
