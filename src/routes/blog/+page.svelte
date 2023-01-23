<script lang="ts">
  import PostList from '../../components/PostList.svelte'
  import Pagination from '../../components/Pagination/Pagination.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="azukiazusaのテックブログ2です。週に1回 Web 開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。"
  />
  <link rel="canonical" href="https://azukiazusa.dev/search" />
</svelte:head>

<div class="container my-12 md:mx-auto">
  <PostList posts={data.blogPostCollection.items} />
</div>

<Pagination total={data.blogPostCollection.total} limit={data.blogPostCollection.limit} />
