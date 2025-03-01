<script lang="ts">
  interface Props {
    name?: string;
    slug?: string;
    children?: import("svelte").Snippet;
  }

  let { name = "", slug = "", children }: Props = $props();
</script>

<a href={`/tags/${slug}`}>
  <span
    class="mb-2 mr-2 inline-block rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold no-underline hover:underline dark:border-zinc-600"
  >
    {name}
    {@render children?.()}
  </span>
</a>
