<script lang="ts">
  import variables from "$lib/variables";
  import HeroSection from "../components/HeroSection/HeroSection.svelte";
  import PostList from "../components/PostList.svelte";
  import Link from "../components/Link/Link.svelte";
  import type { PageData } from "./$types";
  import TalkTimelines from "../components/TalkTimelines.svelte";
  import ShortList from "../components/ShortList.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { latestPosts, shorts, popularPosts } = $derived(data);
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="azukiazusaのテックブログ2です。週に1回 Web 開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。"
  />
  <link rel="canonical" href={`${variables.baseURL}`} />
</svelte:head>

<HeroSection />

<h2
  class="mt-10 max-w-2xl px-4 text-2xl leading-none font-extrabold dark:text-white"
>
  最新記事
</h2>
<div class="container mt-10 mb-4 md:mx-auto">
  <PostList posts={latestPosts.blogPostCollection.items} />
</div>
<div class="flex flex-row-reverse">
  <Link href="/blog">
    すべての記事を見る
    <svg
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      class="ml-2 h-4 w-4"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </Link>
</div>

<div class="my-4">
  <ShortList shorts={shorts.shortCollection.items} />
</div>

<h2
  class="mt-24 max-w-2xl px-4 text-2xl leading-none font-extrabold dark:text-white"
>
  人気記事
</h2>
<div class="container mx-auto my-10 px-4">
  <ol class="list-inside list-decimal space-y-2">
    {#each popularPosts as post}
      <li>
        <a class="text-lg hover:underline" href={post.path}>
          {post.title}
        </a>
      </li>
    {/each}
  </ol>
</div>

<h2
  class="mt-14 mb-10 max-w-2xl px-4 text-2xl leading-none font-extrabold dark:text-white"
>
  登壇資料
</h2>

<div class="px-4">
  <TalkTimelines />
</div>
