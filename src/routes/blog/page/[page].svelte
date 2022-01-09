<script context="module" lang="ts">
    import type { Load } from '@sveltejs/kit';
  export const load: Load = async ({ params, fetch }) =>{
    const page = Number(params.page)
    const res = await fetch(`/blog/page/${page}.json`)
    const { posts } = await res.json()
    return { 
      props: {
        posts,
        page,
      }
    }
  }
</script>

<script lang="ts">
  import PostList from '../../../components/PostList.svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import type { PostsQuery } from '../../../generated/graphql'

  export let page: number
  export let posts: PostsQuery
</script>

<svelte:head>
  <title>{page}ページ目 | azukiazusaのテックブログ2</title>
</svelte:head>

<PostList posts={posts.blogPostCollection.items} />

<Pagination {page} total={posts.blogPostCollection.total} limit={posts.blogPostCollection.limit} />
