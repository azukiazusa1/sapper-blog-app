<script lang="ts">
  import { localizeHref } from "$paraglide/runtime";

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
  <div class="relative overflow-x-hidden">
    <div class="overflow-x-auto no-scrollbar px-4">
      <div class="flex gap-3 w-max pr-20">
        {#each tags as tag}
          <div class="flex-shrink-0">
            <a
              href={localizeHref(`/tags/${tag.slug}`)}
              class="inline-flex items-center rounded bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 px-3 py-1.5 font-mono text-sm font-medium text-stone-700 dark:text-stone-300 transition-colors border border-stone-200 dark:border-stone-700"
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
