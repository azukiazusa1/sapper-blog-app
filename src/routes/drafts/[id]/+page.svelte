<script lang="ts">
  import Card from '../../../components/Card/Card.svelte'
  import FloatingActionButton from '../../../components/FloatingActionButton/FloatingActionButton.svelte'
  import ReloadIcon from '../../../components/Icons/Reload.svelte'
  import type { PageData } from './$types'
  import variables from '$lib/variables'
  import { invalidateAll } from '$app/navigation'
  import NProgress from 'nprogress'

  const reloadPage = async () => {
    NProgress.start()
    await invalidateAll()
    NProgress.done()
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'r' && e.ctrlKey) {
      e.preventDefault()
      reloadPage()
    }
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

<svelte:window on:keydown={handleKeyDown} />

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} preview />
  <FloatingActionButton on:click={reloadPage}>
    <div class="sr-only">リロード</div>
    <ReloadIcon className="h-6 w-6 inline-block" />
  </FloatingActionButton>
</div>
