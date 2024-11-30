<script lang="ts">
  import Tag from "../../components/Tag/Tag.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
</script>

<svelte:head>
  <title>タグ一覧</title>
  <meta name="description" content="ブログに存在するタグの一覧です。" />
  <link rel="canonical" href={`${variables.baseURL}/tags`} />
</svelte:head>

<div class="min-h-[calc(100vh-3.5rem-6rem-2rem)]">
  <h1 class="px-4 text-2xl font-bold">タグ一覧</h1>

  <div class="container my-8 md:mx-auto md:px-12">
    {#each data.tagCollection.items as tag (tag.slug)}
      <Tag name={tag.name} slug={tag.slug}></Tag>
    {/each}
  </div>
</div>
