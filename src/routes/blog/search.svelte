<script context="module">
  import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]
	export async function preload({ query }) {
    const q = query.q ?? ''
    const posts = await PostRepository.search({ q })
		return { posts, q }
	}
</script>

<script lang="ts">
  import Loading from "../../components/Icons/Loading.svelte";
  import PostList from "../../components/PostList.svelte";
  import SearchInput from "../../components/SearchInput.svelte";
  import type { SearchPostsQuery } from '../../generated/graphql'

  export let posts: SearchPostsQuery
  export let q: string
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
    {/if}
  {/await}
</div>