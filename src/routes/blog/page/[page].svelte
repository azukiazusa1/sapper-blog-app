<script context="module" lang="ts">
  export async function preload({ params }) {
    const page = Number(params.page)
    const res = await this.fetch(`blog/page/${page}.json`)
    const { posts } = await res.json()
    return { posts, page }
  }
</script>

<script lang="ts">
  import PostList from '../../../components/PostList.svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import type { PostsQuery } from '../../../generated/graphql'

  export let page: number
  export let posts: PostsQuery
  console.log(page)
</script>

<svelte:head>
  <title>{page}ページ目 | azukiazusaのテックブログ2</title>
</svelte:head>

<PostList posts={posts.blogPostCollection.items} />

<Pagination {page} total={posts.blogPostCollection.total} limit={posts.blogPostCollection.limit} />
