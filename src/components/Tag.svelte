<script lang="ts">
  export let name: string
  export let slug: string
</script>

<span class="inline-block bg-gray-200 rounded-full px-3 py-1 dark:bg-gray-500 text-xs font-semibold mb-2 mr-2">
  <a href={`/tags/${slug}`} sveltekit:prefetch class="no-underline hover:underline">
    {name}
  </a>
  <slot />
</span>
