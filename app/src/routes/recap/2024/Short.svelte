<script>
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  let isVisible = $state(false);
  const shorts = [
    "人為的な遅延を発生させるために、setTimeout を Promise をラップする方法がよく使われています。これにより、await を使って任意の秒数処理を遅らせることができます。",
    "z-index の値に calc(infinity) を指定すると、絶対に最前面に表示させることができます。",
    "npm は install の alias として isntall が用意されているので、typo して isntall と打ってもコマンドが実行されます。",
    "Svelte ではコンポーネントに Props を渡す際に省略記法が使えます。",
    "clsx は、複数のクラス名を結合するための軽量ライブラリです。条件によってクラスを付け替えたり、グルーピングをする際に簡潔に記述できます。",
  ];

  onMount(() => {
    isVisible = true;
  });

  function getAnimation(node, { delay, duration, index }) {
    const o = +getComputedStyle(node).opacity;
    const x = +getComputedStyle(node).transform.split(",")[4];
    console.log(x);
    return {
      delay,
      duration,
      css: (t) => {
        const ease = cubicOut(t);
        return `
          opacity: ${ease * o};
          transform: translateX(calc(calc(${index - 2.2} * 100px) * ${ease}));
          rotate: ${(index - 2.2) * 15 * ease}deg;

        `;
      },
    };
  }
</script>

<div class="relative flex justify-center">
  {#each shorts as short, index}
    {#if isVisible}
      <div
        class={`card absolute -mr-1.5 h-64 w-44 cursor-pointer rounded-xl border-2 border-gray-800 bg-black shadow-lg ${index === 0 || index === 4 ? "hidden md:block" : ""}`}
        style={`transform: translateX(calc(${index - 2.2} * 100px)); rotate: ${(index - 2.2) * 15}deg; --index: ${index + 1}`}
        transition:getAnimation={{ delay: index * 300, duration: 700, index }}
      >
        <div
          class="flex h-full items-center justify-center px-4 text-sm text-white"
        >
          {short}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .card:hover {
    translate: 0 -20px;
    transition: all 0.3s;
    z-index: 100;
  }
</style>
