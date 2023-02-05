<script lang="ts">
  import Card from '../../../components/Card/Card.svelte'
  import type { PageData } from './$types'
  import variables from '$lib/variables'

  export const prerender = false
  export const ssr = true

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
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} preview />
</div>
