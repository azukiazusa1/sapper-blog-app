<script lang="ts">
  import PostList from "../../../../../components/PostList.svelte";
  import Pagination from "../../../../../components/Pagination/Pagination.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";
  import Breadcrumb from "../../../../../components/Breadcrumb/Breadcrumb.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let tag = $derived(data.tag);
  let page = $derived(data.page);

  let tagName = $derived(tag.tagCollection.items[0].name);
  let tagSlug = $derived(tag.tagCollection.items[0].slug);
  let posts = $derived(tag.tagCollection.items[0].linkedFrom);

  let items = $derived([
    { label: "Home", url: "/" },
    { label: "Tags", url: "/tags" },
    { label: tagName },
  ]);
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

<div class="container mx-auto my-6">
  <Breadcrumb {items} />

  <div class="mt-6 px-4">
    <PostList posts={posts.blogPostCollection.items} />
  </div>

  <Pagination
    {page}
    total={posts.blogPostCollection.total}
    limit={posts.blogPostCollection.limit}
    href={`/tags/${tagSlug}/page/`}
  />
</div>
