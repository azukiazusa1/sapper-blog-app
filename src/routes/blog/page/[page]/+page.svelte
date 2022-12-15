<script lang="ts">
  import PostList from '../../../../components/PostList.svelte'
  import Pagination from '../../../../components/Pagination.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>{data.page}ページ目 | azukiazusaのテックブログ2</title>
</svelte:head>

<PostList posts={data.posts.blogPostCollection.items} />

<Pagination {page} total={posts.blogPostCollection.total} limit={posts.blogPostCollection.limit} />
