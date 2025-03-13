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

<div class="container mx-auto px-4">
  <h2
    class="mt-16 mb-8 relative text-3xl font-extrabold dark:text-white after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-20 after:h-1 after:bg-indigo-500"
  >
    最新記事
  </h2>
  <div class="mb-8">
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

  <div class="my-16 p-6">
    <ShortList shorts={shorts.shortCollection.items} />
  </div>

  <div
    class="my-16 px-6 py-8 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/40 dark:to-indigo-950/40 rounded-xl"
  >
    <h2
      class="mb-8 relative text-3xl font-extrabold dark:text-white after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-20 after:h-1 after:bg-purple-500"
    >
      人気記事
    </h2>
    <ol class="list-inside list-decimal space-y-4">
      {#each popularPosts as post}
        <li class="transition-transform duration-200 hover:translate-x-1">
          <a
            class="text-lg hover:text-indigo-600 dark:hover:text-indigo-400"
            href={post.path}
          >
            {post.title}
          </a>
        </li>
      {/each}
    </ol>
  </div>

  <h2
    class="mt-16 mb-8 relative text-3xl font-extrabold dark:text-white after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-20 after:h-1 after:bg-indigo-500"
  >
    登壇資料
  </h2>

  <div class="mb-16">
    <TalkTimelines />
  </div>
</div>
