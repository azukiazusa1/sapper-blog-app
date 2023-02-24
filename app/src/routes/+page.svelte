<script lang="ts">
  import variables from '$lib/variables'
  import HeroSection from '../components/HeroSection/HeroSection.svelte'
  import PostList from '../components/PostList.svelte'
  import Link from '../components/Link/Link.svelte'
  import type { PageData } from './$types'

  export let data: PageData
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

<h2 class="max-w-2xl mt-10 text-2xl font-extrabold leading-none md:text-4xl dark:text-white">最新の記事</h2>
<div class="container my-4 md:mx-auto">
  <PostList posts={data.blogPostCollection.items} />
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
      class="w-4 h-4 ml-2"
      viewBox="0 0 24 24"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </Link>
</div>
