<script lang="ts">
  import PostList from "../../../components/PostList.svelte";
  import Pagination from "../../../components/Pagination/Pagination.svelte";
  import variables from "$lib/variables";
  import type { PageData } from "./$types";
  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let tagName = $derived(data.tagCollection.items[0].name);
  let tagSlug = $derived(data.tagCollection.items[0].slug);
  let posts = $derived(data.tagCollection.items[0].linkedFrom);
</script>

<svelte:head>
  <title>{tagName} | タグ</title>
  <meta name="description" content="{tagName}の記事一覧です。" />
  <link rel="canonical" href={`${variables.baseURL}/tags/${tagSlug}`} />
</svelte:head>

<div class="lounded-lg mb-12 flex items-center justify-center">
  <h1 class="text-2xl font-bold">
    #{tagName}
  </h1>
</div>

<PostList posts={posts.blogPostCollection.items} />

<Pagination
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
  href={`/tags/${tagSlug}/page/`}
/>
