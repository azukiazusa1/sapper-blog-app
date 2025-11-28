<script lang="ts">
  import { inview } from "svelte-inview";
  import CountUp from "../../CountUp.svelte";
  import { recap2025 } from "../Data2025";
  import { defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();

  let isPostsInView = $state(false);
  let isWordsInView = $state(false);

  // Get gradient colors based on theme
  const gradients: Record<
    ThemeId,
    {
      from: string;
      via: string;
      to: string;
      orb1: string;
      orb2: string;
    }
  > = {
    orange: {
      from: "from-orange-600",
      via: "via-orange-700",
      to: "to-red-800",
      orb1: "from-orange-300",
      orb2: "to-red-500",
    },
    blue: {
      from: "from-blue-600",
      via: "via-blue-700",
      to: "to-cyan-800",
      orb1: "from-blue-300",
      orb2: "to-cyan-500",
    },
    purple: {
      from: "from-purple-600",
      via: "via-purple-700",
      to: "to-pink-800",
      orb1: "from-purple-300",
      orb2: "to-pink-500",
    },
    green: {
      from: "from-green-600",
      via: "via-green-700",
      to: "to-emerald-800",
      orb1: "from-green-300",
      orb2: "to-emerald-500",
    },
    pink: {
      from: "from-pink-600",
      via: "via-pink-700",
      to: "to-rose-800",
      orb1: "from-pink-300",
      orb2: "to-rose-500",
    },
  };

  const gradient = $derived(gradients[theme]);
</script>

<div class="relative overflow-hidden px-4">
  <!-- Decorative blur orbs -->
  <div
    class="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gradient-to-br {gradient.orb1} {gradient.orb2} opacity-15 blur-3xl"
  ></div>
  <div
    class="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-br {gradient.orb1} {gradient.orb2} opacity-10 blur-3xl"
  ></div>

  <div
    class="relative mx-auto flex flex-col gap-12 md:gap-16 py-8 w-3xl max-w-full"
  >
    <!-- Total Posts -->
    <div
      use:inview
      on:inview_change={(e) => {
        isPostsInView = e.detail.inView;
      }}
      class="self-start text-center transform transition-all duration-700 ease-out"
      class:scale-100={isPostsInView}
      class:opacity-100={isPostsInView}
      class:scale-90={!isPostsInView}
      class:opacity-0={!isPostsInView}
    >
      <div
        class="mb-6 text-sm uppercase tracking-widest text-gray-500 font-semibold"
      >
        Total Posts
      </div>
      <div
        class="bg-gradient-to-br {gradient.from} {gradient.via} {gradient.to} bg-clip-text text-transparent text-6xl md:text-7xl lg:text-8xl font-black leading-tight py-2 tabular-nums"
      >
        <CountUp initial={0} value={recap2025.totalPosts} duration={1000} />
      </div>
    </div>

    <!-- Total Words -->
    <div
      use:inview
      on:inview_change={(e) => {
        isWordsInView = e.detail.inView;
      }}
      class="self-end text-center transform transition-all duration-700 ease-out"
      class:scale-100={isWordsInView}
      class:opacity-100={isWordsInView}
      class:scale-90={!isWordsInView}
      class:opacity-0={!isWordsInView}
      style="transition-delay: 200ms;"
    >
      <div
        class="mb-6 text-sm uppercase tracking-widest text-gray-500 font-semibold"
      >
        Total Words
      </div>
      <div
        class="bg-gradient-to-br {gradient.from} {gradient.via} {gradient.to} bg-clip-text text-transparent text-6xl md:text-7xl lg:text-8xl font-black leading-tight py-2 tabular-nums"
      >
        <CountUp initial={0} value={recap2025.totalWords} duration={1000} />
      </div>
    </div>
  </div>
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
