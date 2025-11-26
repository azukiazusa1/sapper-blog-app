<script lang="ts">
  import { fade } from "svelte/transition";
  import PrevIcon from "../../../components/Icons/Prev.svelte";

  interface Props {
    onGetStarted: () => void;
  }

  let { onGetStarted }: Props = $props();
</script>

<div
  class="relative flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white"
>
  <!-- Back button -->
  <div class="absolute top-0 left-0 z-10 p-4">
    <a href="/recap">
      <span class="sr-only">戻る</span>
      <PrevIcon className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors" />
    </a>
  </div>

  <div
    in:fade={{ duration: 600 }}
    class="relative z-10 mx-auto max-w-5xl space-y-12 px-8 text-center"
  >
    <!-- Minimal accent line -->
    <div class="mx-auto h-1 w-16 bg-purple-600"></div>

    <!-- Main typography -->
    <h1 class="text-8xl font-light tracking-tighter text-gray-900 md:text-9xl">
      2025
    </h1>

    <div class="text-2xl font-normal tracking-wide text-gray-600 md:text-3xl">
      azukiazusa.dev
      <span class="mt-2 block text-lg">Year in Review</span>
    </div>

    <!-- CTA Button -->
    <button
      onclick={onGetStarted}
      class="inline-block bg-gray-900 px-8 py-4 text-sm uppercase tracking-widest text-white transition-colors duration-200 hover:bg-gray-800 focus:outline-hidden focus:ring-4 focus:ring-gray-300"
      aria-label="Get started with 2025 recap"
    >
      Enter
    </button>
  </div>
</div>
