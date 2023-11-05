<script lang="ts">
  import PostList from "../../../components/PostList.svelte";
  import Pagination from "../../../components/Pagination/Pagination.svelte";
  import SearchInput from "../../../components/SearchInput/SearchInput.svelte";
  import variables from "$lib/variables";
  import type { PageData } from "./$types";

  export let data: PageData;

  $: q = data.q;
  $: posts = data.posts;
  $: empty = data.empty;
  $: page = data.page;
</script>

<svelte:head>
  <title>{q} | 検索</title>
  <link rel="canonical" href={`${variables.baseURL}/blog/search`} />
  <meta name="description" content={`${q}の検索結果`} />
  <!-- サイト内検索スパムの対策 検索結果がないなら noindex にする -->
  <!-- https://blog.ja.dev/entry/blog/2023/02/08/site-search-spam -->
  {#if empty}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>
<div class="container my-10 md:mx-auto">
  <form role="search" data-sveltekit-keepfocus>
    <SearchInput value={q} required />
  </form>
  {#if !q.trim()}
    <div class="mt-8 text-center">検索ワードを入力してください。</div>
  {:else if empty}
    <div class="mt-8 text-center">検索結果が見つかりませんでした</div>
  {:else}
    <div class="mt-8">
      <PostList posts={posts.blogPostCollection.items} />

      <Pagination
        {page}
        total={posts.blogPostCollection.total}
        limit={posts.blogPostCollection.limit}
        href={`/blog/search?q=${q}&page=`}
      />
    </div>
  {/if}
</div>
