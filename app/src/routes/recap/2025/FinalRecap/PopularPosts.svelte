<script lang="ts">
  import { inview } from "svelte-inview";
  import CountUp from "../../CountUp.svelte";
  import { recap2025 } from "../Data2025";
  import { defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();

  let postInView = $state<boolean[]>(
    new Array(recap2025.popularPosts.length).fill(false),
  );

  // Get gradient colors based on theme
  const gradients: Record<
    ThemeId,
    {
      border: { from: string; to: string };
      badge: { from: string; to: string };
      badgeGlow: { from: string; to: string };
      titleHover: { from: string; to: string };
    }
  > = {
    orange: {
      border: { from: "from-orange-400", to: "to-red-600" },
      badge: { from: "from-orange-500", to: "to-red-700" },
      badgeGlow: { from: "from-orange-400", to: "to-red-600" },
      titleHover: { from: "from-orange-600", to: "to-red-700" },
    },
    blue: {
      border: { from: "from-blue-400", to: "to-cyan-600" },
      badge: { from: "from-blue-500", to: "to-cyan-700" },
      badgeGlow: { from: "from-blue-400", to: "to-cyan-600" },
      titleHover: { from: "from-blue-600", to: "to-cyan-700" },
    },
    purple: {
      border: { from: "from-purple-400", to: "to-pink-600" },
      badge: { from: "from-purple-500", to: "to-pink-700" },
      badgeGlow: { from: "from-purple-400", to: "to-pink-600" },
      titleHover: { from: "from-purple-600", to: "to-pink-700" },
    },
    green: {
      border: { from: "from-green-400", to: "to-emerald-600" },
      badge: { from: "from-green-500", to: "to-emerald-700" },
      badgeGlow: { from: "from-green-400", to: "to-emerald-600" },
      titleHover: { from: "from-green-600", to: "to-emerald-700" },
    },
    pink: {
      border: { from: "from-pink-400", to: "to-rose-600" },
      badge: { from: "from-pink-500", to: "to-rose-700" },
      badgeGlow: { from: "from-pink-400", to: "to-rose-600" },
      titleHover: { from: "from-pink-600", to: "to-rose-700" },
    },
  };

  const gradient = $derived(gradients[theme]);
</script>

<div class="mx-auto max-w-4xl space-y-8 px-4">
  {#each recap2025.popularPosts as post, i}
    <a
      href={post.url}
      use:inview
      oninview_change={(e) => {
        postInView[i] = e.detail.inView;
      }}
      class="group block relative transform transition-all duration-500 ease-out"
      class:translate-x-0={postInView[i]}
      class:opacity-100={postInView[i]}
      class:-translate-x-12={!postInView[i]}
      class:opacity-0={!postInView[i]}
      style="transition-delay: {i * 150}ms;"
    >
      <!-- Gradient border wrapper -->
      <div
        class="bg-gradient-to-r {gradient.border.from} {gradient.border
          .to} p-[3px] rounded-2xl
                  transform transition-all duration-300
                  group-hover:-translate-y-2 group-hover:shadow-2xl"
      >
        <div
          class="bg-white rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6"
        >
          <!-- Gradient rank badge -->
          <div class="flex-shrink-0">
            <div class="relative">
              <div
                class="bg-gradient-to-br {gradient.badge.from} {gradient.badge
                  .to}
                          text-white font-black text-4xl md:text-5xl
                          w-16 h-16 md:w-20 md:h-20 rounded-xl
                          flex items-center justify-center
                          shadow-lg transform transition-transform duration-300
                          group-hover:scale-110"
              >
                #{i + 1}
              </div>
              <!-- Glow effect -->
              <div
                class="absolute inset-0 bg-gradient-to-br {gradient.badgeGlow
                  .from} {gradient.badgeGlow.to}
                          rounded-xl blur-md opacity-50 -z-10
                          transition-opacity duration-300 group-hover:opacity-75"
              ></div>
            </div>
          </div>

          <div class="flex-1">
            <!-- Title with gradient on hover -->
            <h3
              class="text-xl md:text-2xl font-bold mb-4 text-gray-900
                       transition-all duration-300
                       group-hover:bg-gradient-to-r {gradient.titleHover
                .from} {gradient.titleHover.to}
                       group-hover:bg-clip-text group-hover:text-transparent"
            >
              {post.title}
            </h3>

            <!-- View count -->
            <div class="flex items-baseline gap-2">
              <span class="text-3xl md:text-4xl font-black text-gray-800">
                <CountUp value={post.views} duration={1200} />
              </span>
              <span
                class="text-sm uppercase tracking-wider text-gray-500 font-semibold"
                >views</span
              >
            </div>
          </div>
        </div>
      </div>
    </a>
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
