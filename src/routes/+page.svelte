<script lang="ts">
  import variables from '$lib/variables'
  import HeroSection from '../components/HeroSection/HeroSection.svelte'
  import PostList from '../components/PostList.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="azukiazusaのテックブログ2です。週に1回 Web 開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。"
  />
  <link rel="canonical" href={`https://${variables.baseURL}`} />
</svelte:head>

<HeroSection />

<h2 class="max-w-2xl mt-10 text-2xl font-extrabold leading-none md:text-4xl dark:text-white">最新の記事</h2>
<div class="container my-4 md:mx-auto">
  <PostList posts={data.blogPostCollection.items} />
</div>
<a class="dark:text-indigo-400  text-indigo-800 flex items-center flex-row-reverse" href="/blog">もっと見る </a>
