<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  export const load: Load = async ({ fetch }) => {
    const res = await fetch(`/index.json`)
    const { posts } = await res.json()
    return {
      props: {
        posts,
      },
    }
  }
</script>

<script lang="ts">
  import HeroSection from '../components/HeroSection.svelte'
  import PostList from '../components/PostList.svelte'

  import type { PostsQuery } from '../generated/graphql'

  export let posts: PostsQuery
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
</svelte:head>

<HeroSection />

<h2 class="max-w-2xl mt-10 text-2xl font-extrabold leading-none md:text-4xl dark:text-white">最新の記事</h2>
<div class="container my-4 md:mx-auto">
  <PostList posts={posts.blogPostCollection.items} />
</div>
<a class="dark:text-indigo-400  text-indigo-800 flex items-center flex-row-reverse" href="/blog">もっと見る </a>
