<script context="module" lang="ts">
  export async function load({ fetch }) {
    const res = await fetch(`blog.json`)
    const { posts } = await res.json()
    return {
      props: posts
    }
  }
</script>

<script lang="ts">
  import PostList from '../../components/PostList.svelte'
  import Pagination from '../../components/Pagination.svelte'
  import type { PostsQuery } from '../../generated/graphql'

  export let posts: PostsQuery
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
</svelte:head>

<PostList posts={posts.blogPostCollection.items} />

<Pagination total={posts.blogPostCollection.total} limit={posts.blogPostCollection.limit} />
