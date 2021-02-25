<script context="module">
  import { paginateParams } from '../../utils/paginateParams';
  import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]

	export async function preload({ query }) {
    const q = query.q ?? ''
    const page = query.page ? Number(query.page) : 1
    const posts = await PostRepository.search({ q, ...paginateParams(page) })
		return { posts, q, page }
	}
</script>

<script lang="ts">
  import Loading from "../../components/Icons/Loading.svelte"
  import PostList from "../../components/PostList.svelte";
  import Pagination from '../../components/Pagination.svelte'
  import SearchInput from "../../components/SearchInput.svelte"
  import type { SearchPostsQuery } from '../../generated/graphql'

  export let posts: SearchPostsQuery
  export let q: string
  export let page: number
  let value = q
  let promise: Promise<void>
  
  $: empty = posts.blogPostCollection.total === 0

  const search = async () => {
    posts = await PostRepository.search({ q })
  }

  const handleSubmit = () => {
    q = value
    if (!q.trim()) return
    promise = search()
  }
</script>

<svelte:head>
  <title>検索</title>
</svelte:head>
<div class="container my-10 md:mx-auto">
  <form on:submit|preventDefault={handleSubmit}>
    <SearchInput bind:value={value} />
  </form>
  {#await promise}
    <div class="mt-8 text-center">
      <Loading />
    </div>
  {:then fullfill}
    {#if !q.trim()}
      <div class="mt-8 text-center">
        検索ワードを入力してください。
      </div>
    {:else if empty}
      <div class="mt-8 text-center">
        検索結果が見つかりませんでした
      </div>
    {:else}
      <PostList posts={posts.blogPostCollection.items}/>

      <Pagination
        {page}
        total={posts.blogPostCollection.total}
        limit={posts.blogPostCollection.limit}
        href={`/blog/search?q=${q}&page=`}
      />
    {/if}
  {/await}
</div>