<script lang="ts">
  import AppTag from '../Tag/Tag.svelte'
  import Time from '../Time/Time.svelte'
  import 'prismjs/themes/prism-tomorrow.css'
  import type { Tag } from '../../generated/graphql'

  export let title: string
  export let contents: string
  export let tags: Pick<Tag, 'name' | 'slug'>[]
  export let createdAt: string
</script>

<article class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg max-w-5xl mx-auto">
  <div class="px-0 md:px-8">
    <h1 class="text-2xl md:text-4xl font-bold mb-8">{title}</h1>
    <div class="flex flex-wrap items-center leading-none mt-2 mb-2">
      {#each tags as tag (tag.slug)}
        <AppTag {...tag} />
      {/each}
    </div>
    <p class="my-2">
      <Time date={createdAt} />
    </p>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <p id="contents" class="mt-6">{@html contents}</p>
  </div>
</article>
