<script lang="ts">
  import { page } from '$app/stores'
  import Loading from '../../../components/Icons/Loading.svelte'
  import PostList from '../../../components/PostList.svelte'
  import Pagination from '../../../components/Pagination.svelte'
  import SearchInput from '../../../components/SearchInput.svelte'
  import type { SearchPostsQuery } from '../../../generated/graphql'
  import { onMount } from 'svelte'

  let posts: SearchPostsQuery
  let value = ''
  let q = ''
  let promise: Promise<void>
  let currentPage = 1

  $: empty = !posts || posts.blogPostCollection.total === 0

  const search = async () => {
    posts = await fetch(`/api/search?q=${q}&page=${currentPage}`).then((res) => res.json())
  }

  const handleSubmit = () => {
    q = value
    if (!q.trim()) return
    promise = search()
  }

  onMount(() => {
    value = $page.url.searchParams.get('q') || ''
    q = value
    currentPage = $page.url.searchParams.get('page') ? Number($page.url.searchParams.get('page')) : 1
    if (q.trim()) {
      promise = search()
    }
  })
</script>

<svelte:head>
  <title>検索</title>
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
      <PostList posts={posts.blogPostCollection.items} />

      <Pagination
        page={currentPage}
        total={posts.blogPostCollection.total}
        limit={posts.blogPostCollection.limit}
        href={`/blog/search?q=${q}&page=`}
      />
    {/if}
  {/await}
</div>
