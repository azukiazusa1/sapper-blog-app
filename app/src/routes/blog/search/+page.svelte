<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import Loading from '../../../components/Icons/Loading.svelte'
  import PostList from '../../../components/PostList.svelte'
  import Pagination from '../../../components/Pagination/Pagination.svelte'
  import SearchInput from '../../../components/SearchInput/SearchInput.svelte'
  import type { SearchPostsQuery } from '../../../generated/graphql'
  import variables from '$lib/variables'
  import { onDestroy, onMount } from 'svelte'

  let posts: SearchPostsQuery
  let value = ''
  let q = ''
  let promise: Promise<void>
  let currentPage = 1
  let unsubscribe: () => void

  $: empty = !posts || posts.blogPostCollection.total === 0

  const search = async () => {
    posts = await fetch(`/api/search?q=${q}&page=${currentPage}`).then((res) => res.json())
  }

  const handleSubmit = () => {
    goto(`/blog/search?q=${value}`)
  }

  onMount(() => {
    unsubscribe = page.subscribe((page) => {
      q = page.url.searchParams.get('q') || ''
      const p = Number(page.url.searchParams.get('page'))
      currentPage = !Number.isNaN(p) && p > 0 ? p : 1
      if (q.trim()) {
        value = q
        promise = search()
      }
    })
  })

  onDestroy(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })
</script>

<svelte:head>
  <title>検索</title>
  <link rel="canonical" href={`${variables.baseURL}/blog/search`} />
</svelte:head>
<div class="container my-10 md:mx-auto">
  <form on:submit|preventDefault={handleSubmit} role="search">
    <SearchInput bind:value />
  </form>
  {#await promise}
    <div class="mt-8 text-center">
      <Loading />
    </div>
  {:then}
    {#if !q.trim()}
      <div class="mt-8 text-center">検索ワードを入力してください。</div>
    {:else if empty}
      <div class="mt-8 text-center">検索結果が見つかりませんでした</div>
    {:else}
      <div class="mt-8">
        <PostList posts={posts.blogPostCollection.items} />

        <Pagination
          page={currentPage}
          total={posts.blogPostCollection.total}
          limit={posts.blogPostCollection.limit}
          href={`/blog/search?q=${q}&page=`}
        />
      </div>
    {/if}
  {/await}
</div>
