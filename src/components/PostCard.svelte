<script lang="ts">
  import type { TagCollection } from '../generated/graphql';

  import Tag from './Tag.svelte'

  export let title: string
  export let slug: string
  export let about: string
  export let tagsCollection: TagCollection
</script>

<!-- Article -->
<article class="overflow-hidden h-full bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600">
  <a href={`/blog/${slug}`}>
    <img alt="Placeholder" class="block h-auto w-full" src="https://picsum.photos/600/400/?random" />
  </a>

  <header class="flex-row items-center justify-between leading-tight p-4">
    <h1 class="text-2xl">
      <a class="no-underline hover:underline" href={`/blog/${slug}`}>{ title }</a>
    </h1>
    <p class="text-grey-darker text-sm mt-2 text-opacity-70 text-black dark:text-gray-50 dark:text-opacity-60">14/4/19</p>
  </header>

  <p class="mx-4 break-words text-sm text-opacity-80 text-black dark:text-gray-50 dark:text-opacity-80">{about}</p>

  <footer class="flex items-center leading-none mt-2 p-2 md:p-4">
      {#each tagsCollection.items as tag (tag.slug)}
        <Tag {...tag} />
      {/each}
  </footer>
</article>
<!-- END Article -->
