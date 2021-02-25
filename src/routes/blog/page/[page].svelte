<script context="module" lang="ts">
  import { paginateParams } from '../../../utils/paginateParams';

  export async function preload({params}) {
    const page = Number(params.page)
    const record = paginateParams(page)
    const searchParams = new URLSearchParams({
      limit: String(record.limit),
      skip: String(record.skip)
    })
    const res = await this.fetch(`blog.json?${searchParams}`)
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

</script>

<svelte:head>
  <title>{page}ページ目 | azukiazusaのテックブログ2</title>
</svelte:head>

<PostList posts={posts.blogPostCollection.items} />

<Pagination
  {page}
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
/>
