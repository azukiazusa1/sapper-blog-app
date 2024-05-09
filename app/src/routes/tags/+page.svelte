<script lang="ts">
  import Tag from "../../components/Tag/Tag.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";

  export let data: PageData;
</script>

<svelte:head>
  <title>タグ一覧</title>
  <meta name="description" content="ブログに存在するタグの一覧です。" />
  <link rel="canonical" href={`${variables.baseURL}/tags`} />
</svelte:head>

<h1 class="px-4 text-2xl">タグ一覧</h1>

<div class="container my-8 md:mx-auto md:px-12">
  {#each data.tagCollection.items as tag (tag.slug)}
    <Tag name={tag.name} slug={tag.slug}></Tag>
  {/each}
</div>
