<script lang="ts">
  export let name = "";
  export let slug = "";
</script>

<a href={`/tags/${slug}`}>
  <span
    class="mb-2 mr-2 inline-block rounded-fullpx-3 py-1 text-xs font-semibold no-underline hover:underline border dark:border-zinc-700"
  >
    {name}
    <slot />
  </span>
</a>
