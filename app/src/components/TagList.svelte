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

<div class="container mx-auto">
  <div class="relative">
    <div class="overflow-x-auto no-scrollbar px-4">
      <div class="flex gap-3 w-max pr-20">
        {#each tags as tag}
          <div class="flex-shrink-0">
            <a
              href={`/tags/${tag.slug}`}
              class="inline-flex items-center rounded-full bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-zinc-600 shadow-sm hover:shadow-md"
            >
              #{tag.name}
            </a>
          </div>
        {/each}
      </div>
    </div>
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
