<script lang="ts">
  import PostList from '../../../../../components/PostList.svelte'
  import Pagination from '../../../../../components/Pagination.svelte'
  import type { PageData } from './$types'
  import variables from '$lib/variables'

  export let data: PageData

  $: tag = data.tag
  $: page = data.page

  $: tagName = tag.tagCollection.items[0].name
  $: tagSlug = tag.tagCollection.items[0].slug
  $: posts = tag.tagCollection.items[0].linkedFrom
</script>

<svelte:head>
  <title>{tagName} | タグ</title>
  {#if page === 1}
    <link rel="canonical" href={`https://${variables.baseURL}/tags/${tagSlug}`} />
  {/if}
</svelte:head>

<h1 class="text-2xl">
  <span class="font-bold">{tagName}</span>の記事一覧
</h1>

<PostList posts={posts.blogPostCollection.items} />

<Pagination
  {page}
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
  href={`/tags/${tagSlug}/page/`}
/>
