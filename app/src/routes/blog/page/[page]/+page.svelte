<script lang="ts">
  import PostList from "../../../../components/PostList.svelte";
  import Pagination from "../../../../components/Pagination/Pagination.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>{data.page}ページ目 | azukiazusaのテックブログ2</title>
  {#if data.page === 1}
    <link rel="canonical" href={`${variables.baseURL}/blog`} />
  {:else}
    <link
      rel="canonical"
      href={`${variables.baseURL}/blog/page/${data.page}`}
    />
  {/if}
</svelte:head>

<PostList posts={data.posts.blogPostCollection.items} />

<Pagination
  page={data.page}
  total={data.posts.blogPostCollection.total}
  limit={data.posts.blogPostCollection.limit}
/>
