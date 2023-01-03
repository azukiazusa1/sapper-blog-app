<script lang="ts">
  import type { Asset, Scalars, Tag as TagType } from '../../generated/graphql'
  import Image from '../Image/Image.svelte'
  import Tag from '../Tag/Tag.svelte'
  import Time from '../Time/Time.svelte'

  export let title: string
  export let slug: string
  export let about: string
  export let thumbnail: Pick<Asset, 'title' | 'url'>
  export let createdAt: Scalars['DateTime']
  export let tags: Array<Pick<TagType, 'name' | 'slug'>>
  export let small = false
</script>

<article class="overflow-hidden h-full bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600">
  <a href={`/blog/${slug}`}>
    <Image alt={thumbnail.title} src={thumbnail.url} width={400} height={300} />
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
      {#each tags as tag (tag.slug)}
        <Tag name={tag.name} slug={tag.slug} />
      {/each}
    </footer>
  {/if}
</article>
