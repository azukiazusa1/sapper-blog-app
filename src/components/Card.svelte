<script lang="ts">
  import Prism from 'prismjs'
  import 'prismjs/components/prism-typescript'
  import 'prismjs/components/prism-diff'
  import 'prismjs/components/prism-go'
  import 'prismjs/components/prism-json'
  import 'prismjs/components/prism-jsx'
  import 'prismjs/components/prism-python'
  import 'prismjs/components/prism-scss'
  import 'prismjs/components/prism-sass'
  import 'prismjs/components/prism-yaml'
  import 'prismjs/components/prism-bash'
  import 'prismjs/components/prism-java'
  import 'prismjs/themes/prism-tomorrow.css'
  import AppTag from './Tag.svelte'
  import Time from './Time.svelte'
  import { onMount } from 'svelte'
  import type { Tag } from '../generated/graphql';

  onMount(() => {
    Prism.highlightAll()
  })

  export let title: string
  export let contents: string
  export let tags: Tag[]
  export let createdAt: string
</script>

<article class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
  <div class="px-0 md:px-8">
    <h1 class="text-7xl font-bold mb-8">{ title }</h1>
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
