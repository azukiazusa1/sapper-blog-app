<script lang="ts">
  interface Tag {
    name: string;
    slug: string;
  }

  interface Props {
    tags: Tag[];
  }

  let { tags }: Props = $props();
</script>

<div class="w-full overflow-x-auto whitespace-nowrap py-4 no-scrollbar">
  <div class="flex gap-2">
    {#each tags as tag}
      <a
        href={`/blog/tags/${tag.slug}`}
        class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
      >
        {tag.name}
      </a>
    {/each}
  </div>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
