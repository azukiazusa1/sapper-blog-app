<script lang="ts">
  import PostList from "../../../../components/PostList.svelte";
  import Pagination from "../../../../components/Pagination/Pagination.svelte";
  import Breadcrumb from "../../../../components/Breadcrumb/Breadcrumb.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const breadcrumbItems = $derived([
    { label: "Home", url: "/" },
    { label: "Blog", url: "/blog" },
    { label: `${data.page}ページ目` },
  ]);
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

<div class="container mx-auto mt-16 px-4">
  <Breadcrumb items={breadcrumbItems} />
  <PostList posts={data.posts.blogPostCollection.items} />

  <Pagination
    page={data.page}
    total={data.posts.blogPostCollection.total}
    limit={data.posts.blogPostCollection.limit}
  />
</div>
