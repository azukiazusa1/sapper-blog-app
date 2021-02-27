<script lang="ts">
  import { onMount } from 'svelte'
  import AppTag from './Tag.svelte'
  import Time from './Time.svelte'
  import 'prismjs/themes/prism-tomorrow.css'
  import type { Tag } from '../generated/graphql'

  onMount(() => {
    document.querySelectorAll('a').forEach((a) => {
      if (!a.hash && !document.getElementById(a.hash)) {
        return
      }
      const url = new URL(String(window.location))
      a.href = url.origin + url.pathname + a.hash
    })
  })

  export let title: string
  export let contents: string
  export let tags: Tag[]
  export let createdAt: string
</script>

<article class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
  <div class="px-0 md:px-8">
    <h1 class="text-4xl md:text-7xl font-bold mb-8">{title}</h1>
    <div class="flex flex-wrap items-center leading-none mt-2 mb-2">
      {#each tags as tag (tag.slug)}
        <AppTag {...tag} />
      {/each}
    </div>
    <p class="my-2">
      <Time date={createdAt} />
    </p>
    <p id="contents" class="mt-6">{@html contents}</p>
  </div>
</article>
