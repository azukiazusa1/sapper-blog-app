<script lang="ts">
  import PostList from '../../../components/PostList.svelte'
  import Pagination from '../../../components/Pagination/Pagination.svelte'
  import variables from '$lib/variables'
  import type { PageData } from './$types'
  export let data: PageData

  $: tagName = data.tagCollection.items[0].name
  $: tagSlug = data.tagCollection.items[0].slug
  $: posts = data.tagCollection.items[0].linkedFrom
</script>

<svelte:head>
  <title>{tagName} | タグ</title>
  <meta name="description" content="{tagName}の記事一覧です。" />
  <link rel="canonical" href={`https://${variables.baseURL}/tags/${tagSlug}`} />
</svelte:head>

<h1 class="text-2xl">
  <span class="font-bold">{tagName}</span>の記事一覧
</h1>

<PostList posts={posts.blogPostCollection.items} />

<Pagination
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
  href={`/tags/${tagSlug}/page/`}
/>
