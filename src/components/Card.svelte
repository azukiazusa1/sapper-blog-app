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
  import { onMount } from 'svelte'

  onMount(() => {
    Prism.highlightAll()
  })

  export let title: string
  export let contents: string
</script>

<article class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg">
  <h1 class="text-7xl font-bold mb-2">{ title }</h1>
  <p>{@html contents}</p>
</article>
