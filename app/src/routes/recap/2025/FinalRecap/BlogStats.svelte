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

<div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
  <!-- Posts Card -->
  <div
    in:fade={{ delay: 0, duration: 300 }}
    class="rounded-xl border border-gray-200 bg-white p-10 text-center transition-shadow duration-200 {themes[
      theme
    ].colors.cardHoverBorder} hover:shadow-lg"
  >
    <div class="mb-4 text-sm uppercase tracking-wider text-gray-500">
      Total Posts
    </div>
    <div class="mb-2 text-6xl font-bold text-gray-900">
      <CountUp initial={0} value={recap2025.totalPosts} duration={700} />
    </div>
  </div>

  <!-- Words Card -->
  <div
    in:fade={{ delay: 100, duration: 300 }}
    class="rounded-xl border border-gray-200 bg-white p-10 text-center transition-shadow duration-200 {themes[
      theme
    ].colors.cardHoverBorder} hover:shadow-lg"
  >
    <div class="mb-4 text-sm uppercase tracking-wider text-gray-500">
      Total Words
    </div>
    <div class="mb-2 text-6xl font-bold text-gray-900">
      <CountUp initial={0} value={recap2025.totalWords} duration={700} />
    </div>
  </div>
</div>
