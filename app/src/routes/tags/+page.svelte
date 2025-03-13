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
  <div
    class="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 py-12 dark:from-indigo-900 dark:to-indigo-950 mb-12"
  >
    <div class="container mx-auto px-4">
      <h1 class="text-center text-3xl font-bold text-white mb-4">タグ一覧</h1>
      <p class="text-center text-base text-indigo-100 max-w-2xl mx-auto">
        興味のあるトピックを選んで記事を探索しましょう
      </p>
    </div>
  </div>

  <div class="container mx-auto px-6 md:px-12 animate-[fade-in_0.6s_ease-out]">
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      {#each data.tagCollection.items as tag}
        <div class="transform transition-all duration-300 hover:-translate-y-1">
          <Tag
            name={tag.name}
            slug={tag.slug}
            count={tag.linkedFrom?.entryCollection?.total || 0}
          ></Tag>
        </div>
      {/each}
    </div>
  </div>
</div>
