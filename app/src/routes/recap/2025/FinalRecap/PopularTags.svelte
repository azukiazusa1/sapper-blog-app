<script lang="ts">
  import { fade } from "svelte/transition";
  import { recap2025 } from "../Data2025";
</script>

<div
  class="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
>
  {#each recap2025.topTags as tag, i}
    <div
      in:fade={{ delay: i * 100, duration: 300 }}
      class="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-purple-300 hover:shadow-lg"
    >
      <div class="mb-1 text-3xl font-bold text-gray-900">
        {tag.count}
      </div>
      <div class="text-sm text-gray-600">
        {tag.name}
      </div>
    </div>
  {/each}
</div>
