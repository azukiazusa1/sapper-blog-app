<script lang="ts">
  import PostList from "../../../../../components/PostList.svelte";
  import Pagination from "../../../../../components/Pagination/Pagination.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";

  export let data: PageData;

  $: tag = data.tag;
  $: page = data.page;

  $: tagName = tag.tagCollection.items[0].name;
  $: tagSlug = tag.tagCollection.items[0].slug;
  $: posts = tag.tagCollection.items[0].linkedFrom;
</script>

<svelte:head>
  <title>{tagName} | タグ</title>
  {#if page === 1}
    <link rel="canonical" href={`${variables.baseURL}/tags/${tagSlug}`} />
  {:else}
    <link
      rel="canonical"
      href={`${variables.baseURL}/tags/${tagSlug}/page/${page}`}
    />
  {/if}
</svelte:head>

<div class="lounded-lg mt-4 mb-12 flex items-center justify-center">
  <h1 class="text-2xl font-bold">
    #{tagName}
  </h1>
</div>

<div class="mt-6 mx-auto max-w-7xl px-4">
  <PostList posts={posts.blogPostCollection.items} />
</div>

<Pagination
  {page}
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
  href={`/tags/${tagSlug}/page/`}
/>
