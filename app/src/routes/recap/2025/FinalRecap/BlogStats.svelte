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

  // Celebration state
  let postsGlowing = $state(false);
  let wordsGlowing = $state(false);

  // Get gradient colors based on theme
  const gradients: Record<
    ThemeId,
    {
      from: string;
      via: string;
      to: string;
      orb1: string;
      orb2: string;
      glow: string; // RGB values for drop-shadow
    }
  > = {
    orange: {
      from: "from-orange-600",
      via: "via-orange-700",
      to: "to-red-800",
      orb1: "from-orange-300",
      orb2: "to-red-500",
      glow: "234, 88, 12", // orange-600
    },
    blue: {
      from: "from-blue-600",
      via: "via-blue-700",
      to: "to-cyan-800",
      orb1: "from-blue-300",
      orb2: "to-cyan-500",
      glow: "37, 99, 235", // blue-600
    },
    purple: {
      from: "from-purple-600",
      via: "via-purple-700",
      to: "to-pink-800",
      orb1: "from-purple-300",
      orb2: "to-pink-500",
      glow: "147, 51, 234", // purple-600
    },
    green: {
      from: "from-green-600",
      via: "via-green-700",
      to: "to-emerald-800",
      orb1: "from-green-300",
      orb2: "to-emerald-500",
      glow: "22, 163, 74", // green-600
    },
    pink: {
      from: "from-pink-600",
      via: "via-pink-700",
      to: "to-rose-800",
      orb1: "from-pink-300",
      orb2: "to-rose-500",
      glow: "219, 39, 119", // pink-600
    },
  };

  const gradient = $derived(gradients[theme]);

  // Handle posts celebration
  function handlePostsCountComplete() {
    // Glow effect
    postsGlowing = true;
    setTimeout(() => {
      postsGlowing = false;
    }, 500);
  }

  // Handle words celebration
  function handleWordsCountComplete() {
    // Glow effect
    wordsGlowing = true;
    setTimeout(() => {
      wordsGlowing = false;
    }, 500);
  }
</script>

<div class="relative px-4">
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
      oninview_change={(e) => {
        isPostsInView = e.detail.inView;
      }}
      class="self-start transform transition-all duration-500 ease-out"
      class:translate-y-0={isPostsInView}
      class:opacity-100={isPostsInView}
      class:translate-y-8={!isPostsInView}
      class:opacity-0={!isPostsInView}
    >
      <div
        class="stat-card"
        class:celebrating={postsGlowing}
        style="--glow-color: {gradient.glow};"
      >
        <div
          class="mb-6 text-sm uppercase tracking-widest text-gray-500 font-semibold"
        >
          Total Posts
        </div>
        <div
          class="bg-gradient-to-br {gradient.from} {gradient.via} {gradient.to} bg-clip-text text-transparent text-6xl md:text-7xl lg:text-8xl font-black leading-tight py-2 tabular-nums"
        >
          <CountUp
            initial={0}
            value={recap2025.totalPosts}
            duration={1000}
            onComplete={handlePostsCountComplete}
          />
        </div>
      </div>
    </div>

    <!-- Total Words -->
    <div
      use:inview
      oninview_change={(e) => {
        isWordsInView = e.detail.inView;
      }}
      class="self-end transform transition-all duration-500 ease-out"
      class:translate-y-0={isWordsInView}
      class:opacity-100={isWordsInView}
      class:translate-y-8={!isWordsInView}
      class:opacity-0={!isWordsInView}
      style="transition-delay: 200ms;"
    >
      <div
        class="stat-card"
        class:celebrating={wordsGlowing}
        style="--glow-color: {gradient.glow};"
      >
        <div
          class="mb-6 text-sm uppercase tracking-widest text-gray-500 font-semibold"
        >
          Total Words
        </div>
        <div
          class="bg-gradient-to-br {gradient.from} {gradient.via} {gradient.to} bg-clip-text text-transparent text-6xl md:text-7xl lg:text-8xl font-black leading-tight py-2 tabular-nums"
        >
          <CountUp
            initial={0}
            value={recap2025.totalWords}
            duration={1000}
            onComplete={handleWordsCountComplete}
          />
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Stat Card */
  .stat-card {
    padding: 2rem;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition:
      transform 0.3s ease-out,
      filter 0.3s ease-out;
  }

  .stat-card.celebrating {
    animation: celebrationPulse 0.5s ease-out;
  }

  @keyframes celebrationPulse {
    0%,
    100% {
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgba(0, 0, 0, 0));
    }
    50% {
      transform: scale(1.05);
      filter: drop-shadow(0 0 30px rgba(var(--glow-color), 0.6));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .stat-card {
      transition-duration: 0.01ms !important;
    }

    .stat-card.celebrating {
      animation: none;
    }
  }
</style>
