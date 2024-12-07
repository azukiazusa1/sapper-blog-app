<script>
  import { fly } from "svelte/transition";
  import { flip } from "svelte/animate";
  import { onMount } from "svelte";
  import { cubicOut } from "svelte/easing";
  let isVisible = false;
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8"];

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
      css: (t, u) => {
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
  {#each colors as color, index}
    {#if isVisible}
      <div
        class="card absolute -mr-1.5 h-64 w-44 cursor-pointer rounded-2xl bg-black shadow-lg"
        style={`opacity: 1; transform: translateX(calc(${index - 2.2} * 100px)); background-color: ${color}; rotate: ${(index - 2.2) * 15}deg; --index: ${index + 1}`}
        transition:getAnimation={{ delay: index * 200, duration: 500, index }}
      >
        <div
          class="flex h-full items-center justify-center text-2xl font-bold text-white"
        >
          Card {index + 1}
        </div>
      </div>
    {/if}
  {/each}
</div>

<style>
  .card:hover {
    translate: 0 -20px;
    transition: translate 0.3s;
  }
</style>
