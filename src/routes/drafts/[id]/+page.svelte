<script lang="ts">
  import Card from '../../../components/Card/Card.svelte'
  import type { PageData } from './$types'
  import variables from '$lib/variables'
  import { invalidateAll } from '$app/navigation'

  const reloadPage = async () => {
    console.log('リロード')
    const result = await invalidateAll()
    console.log(result)
  }

  export let data: PageData

  $: post = data.post
  $: contents = data.contents
</script>

<svelte:head>
  <title>（下書き）{post.title}</title>
  <meta name="description" content={post.about} />
  <link rel="canonical" href={`${variables.baseURL}/drafts/${post.sys.id}`} />
</svelte:head>
<div class="my-12">
  <button on:click={reloadPage}>リロード</button>
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} preview />
</div>
