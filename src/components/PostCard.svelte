<script lang="ts">
  import type { Asset, Scalars, TagCollection } from '../generated/graphql'
  import Tag from './Tag.svelte'
  import Time from './Time.svelte'

  export let title: string
  export let slug: string
  export let about: string
  export let thumbnail: Pick<Asset, 'title' | 'url'>
  export let createdAt: Scalars['DateTime']
  export let tagsCollection: TagCollection
  export let small = false
</script>

<article class="overflow-hidden h-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600">
  <a href={`/blog/${slug}`}>
    <img alt={thumbnail.title} class="h-72 w-72 block mx-auto" src={thumbnail.url} />
  </a>

  <header class="flex-row items-center justify-between leading-tight p-4 border-t border-gray-300 dark:border-gray-600">
    <h1 class="text-2xl">
      <a class="no-underline hover:underline" href={`/blog/${slug}`}>{title}</a>
    </h1>
    <p class="mt-2">
      <Time date={createdAt} />
    </p>
  </header>

  {#if !small}
    <p class="mx-4 break-words text-sm text-opacity-80 text-black dark:text-gray-50 dark:text-opacity-80">{about}</p>

    <footer class="flex flex-wrap items-center leading-none mt-2 p-2 md:p-4">
      {#each tagsCollection.items as tag (tag.slug)}
        <Tag {...tag} />
      {/each}
    </footer>
  {/if}
</article>
