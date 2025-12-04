<script lang="ts">
  import { inview } from "svelte-inview";
  import { recap2025 } from "../Data2025";
  import { defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();

  let tagInView = $state<boolean[]>(
    new Array(recap2025.topTags.length).fill(false),
  );

  // Get gradient colors based on theme
  const gradients: Record<ThemeId, { from: string; to: string }> = {
    orange: { from: "from-orange-500", to: "to-red-600" },
    blue: { from: "from-blue-500", to: "to-cyan-600" },
    purple: { from: "from-purple-500", to: "to-pink-600" },
    green: { from: "from-green-500", to: "to-emerald-600" },
    pink: { from: "from-pink-500", to: "to-rose-600" },
  };

  const gradient = $derived(gradients[theme]);

  // Calculate relative size for tags (0 = smallest, 1 = largest)
  function getTagScale(count: number): number {
    const maxCount = Math.max(...recap2025.topTags.map((t) => t.count));
    const minCount = Math.min(...recap2025.topTags.map((t) => t.count));
    const range = maxCount - minCount;
    return range > 0 ? (count - minCount) / range : 0.5;
  }
</script>

<div
  class="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 md:gap-4 px-4"
>
  {#each recap2025.topTags as tag, i}
    {@const scale = getTagScale(tag.count)}
    {@const sizeClass =
      scale > 0.66
        ? "text-2xl md:text-3xl"
        : scale > 0.33
          ? "text-xl md:text-2xl"
          : "text-lg md:text-xl"}
    {@const paddingClass =
      scale > 0.66
        ? "px-6 py-3 md:px-8 md:py-4"
        : scale > 0.33
          ? "px-5 py-2.5 md:px-7 md:py-3.5"
          : "px-4 py-2 md:px-6 md:py-3"}

    <div
      use:inview
      oninview_change={(e) => {
        tagInView[i] = e.detail.inView;
      }}
      class="transform transition-all duration-300 ease-out cursor-default
             bg-gradient-to-r {gradient.from} {gradient.to}
             rounded-full {paddingClass}
             text-white font-bold shadow-lg
             hover:scale-110 hover:shadow-2xl hover:brightness-110
             flex items-center gap-2 whitespace-nowrap"
      class:opacity-100={tagInView[i]}
      class:scale-100={tagInView[i]}
      class:opacity-0={!tagInView[i]}
      class:scale-75={!tagInView[i]}
      style="transition-delay: {i * 50}ms;"
    >
      <span class="font-black {sizeClass}">{tag.count}</span>
      <span class={sizeClass}>{tag.name}</span>
    </div>
  {/each}
</div>

<style>
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
