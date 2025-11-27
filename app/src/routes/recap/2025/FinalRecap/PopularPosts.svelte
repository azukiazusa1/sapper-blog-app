<script lang="ts">
  import { fade } from "svelte/transition";
  import CountUp from "../../CountUp.svelte";
  import { recap2025 } from "../Data2025";
  import { themes, defaultTheme, type ThemeId } from "../themes";

  interface Props {
    theme?: ThemeId;
  }

  let { theme = defaultTheme }: Props = $props();
</script>

<div class="mx-auto max-w-3xl space-y-6">
  {#each recap2025.popularPosts as post, i}
    <a
      href={post.url}
      in:fade={{ delay: i * 100, duration: 300 }}
      class="group flex items-start gap-6 rounded-xl border border-gray-200 bg-white p-8 transition-all duration-200 {themes[
        theme
      ].colors.cardHoverBorder} hover:shadow-lg"
    >
      <!-- Ranking badge -->
      <div class="flex-shrink-0 text-4xl font-bold text-gray-300">
        #{i + 1}
      </div>

      <div class="flex-1">
        <!-- Title -->
        <h3
          class="mb-3 text-xl font-semibold text-gray-900 transition-colors {themes[
            theme
          ].colors.hoverTextAccentColor}"
        >
          {post.title}
        </h3>

        <!-- View count -->
        <div class="flex items-baseline gap-2">
          <div class="text-3xl font-bold text-gray-900">
            <CountUp value={post.views} duration={1000} />
          </div>
          <div class="text-sm text-gray-500">views</div>
        </div>
      </div>
    </a>
  {/each}
</div>
