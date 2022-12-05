<script lang="ts">
  import PostList from '../../components/PostList.svelte'
  import Pagination from '../../components/Pagination.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
</svelte:head>

<div class="container my-12 md:mx-auto">
  <PostList posts={data.blogPostCollection.items} />
</div>

<Pagination total={data.blogPostCollection.total} limit={data.blogPostCollection.limit} />
