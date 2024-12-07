<script lang="ts">
  import { scale } from "svelte/transition";
  import { onMount } from "svelte";
  const tags = [
    { name: "CSS", count: 18 },
    { name: "React", count: 10 },
    { name: "JavaScript", count: 8 },
    { name: "アクセシビリティ", count: 7 },
    { name: "Next.js", count: 4 },
  ];

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<div class="mt-20 flex flex-wrap justify-center gap-4">
  {#each tags as tag, index}
    {#if mounted}
      <div
        in:scale={{ delay: index * 200 }}
        class="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-white"
      >
        <span>{tag.name}</span>
        <span class="font-bold">({tag.count})</span>
      </div>
    {/if}
  {/each}
</div>
