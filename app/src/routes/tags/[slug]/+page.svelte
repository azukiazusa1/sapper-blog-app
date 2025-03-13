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

<div
  class="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 py-12 dark:from-indigo-900 dark:to-indigo-950 mb-12"
>
  <div class="container mx-auto px-4">
    <h1 class="text-center text-3xl font-bold text-white mb-4">#{tagName}</h1>
    <p class="text-center text-base text-indigo-100 max-w-2xl mx-auto">
      <span class="font-medium">{posts.blogPostCollection.total}</span> 件の記事が見つかりました
    </p>

    <div class="mt-6 flex justify-center">
      <a
        href="/tags"
        class="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
        </svg>
        すべてのタグに戻る
      </a>
    </div>
  </div>
</div>

<div class="container mx-auto px-4">
  <div class="animate-[fade-in_0.5s_ease-out]">
    <PostList posts={posts.blogPostCollection.items} />
  </div>

  <Pagination
    total={posts.blogPostCollection.total}
    limit={posts.blogPostCollection.limit}
    href={`/tags/${tagSlug}/page/`}
  />
</div>
