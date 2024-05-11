<script lang="ts">
  export let name = "";
  export let slug = "";
</script>

<a href={`/tags/${slug}`}>
  <span
    class="mb-2 mr-2 inline-block rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold no-underline hover:underline dark:border-zinc-600"
  >
    {name}
    <slot />
  </span>
</a>
