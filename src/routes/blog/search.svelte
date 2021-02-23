<script context="module">
	export async function preload({ query }) {
		const params = new URLSearchParams({ q: query.q })
    const res = await this.fetch(`blog.json?${params}`)
    const { posts } = await res.json()
		return { posts, q: query.q ?? '' }
	}
</script>

<script lang="ts">
  import Loading from "../../components/Icons/Loading.svelte";
  import PostList from "../../components/PostList.svelte";
  import SearchInput from "../../components/SearchInput.svelte";
  import type { SearchPostsQuery } from '../../generated/graphql'

  export let posts: SearchPostsQuery
  export let q: string
  let value: string
  let promise: Promise<void>
  
  $: empty = posts.blogPostCollection.total === 0
  $: params = new URLSearchParams({ q })

  const search = async (params: URLSearchParams) => {
    const res = await fetch(`blog.json?${params}`,)
    const data = await res.json()
    posts = data.posts
  }

  const handleSubmit = () => {
    q = value
    if (!q.trim()) return
    promise = search(params)
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