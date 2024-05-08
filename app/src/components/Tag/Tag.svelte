<script lang="ts">
  export let name = "";
  export let slug = "";
</script>

<a href={`/tags/${slug}`}>
  <span
    class="rounded-full px-3 mb-2 mr-2 inline-block border py-1 text-xs font-semibold no-underline hover:underline dark:border-zinc-700"
  >
    {name}
    <slot />
  </span>
</a>
