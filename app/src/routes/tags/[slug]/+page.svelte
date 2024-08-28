<script lang="ts">
  import PostList from "../../../components/PostList.svelte";
  import Pagination from "../../../components/Pagination/Pagination.svelte";
  import variables from "$lib/variables";
  import type { PageData } from "./$types";
  import Next from "../../../components/Icons/Next.svelte";
  export let data: PageData;

  $: tagName = data.tagCollection.items[0].name;
  $: tagSlug = data.tagCollection.items[0].slug;
  $: posts = data.tagCollection.items[0].linkedFrom;
</script>

<svelte:head>
  <title>{tagName} | タグ</title>
  <meta name="description" content="{tagName}の記事一覧です。" />
  <link rel="canonical" href={`${variables.baseURL}/tags/${tagSlug}`} />
</svelte:head>

<h1 class="text-2xl font-bold">
  {tagName}
</h1>

<div class="mt-6">
  <PostList posts={posts.blogPostCollection.items} />
</div>

<Pagination
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
  href={`/tags/${tagSlug}/page/`}
/>
