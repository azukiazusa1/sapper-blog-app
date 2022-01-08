<script context="module" lang="ts">
  export async function load({ params, fetch }) {
    const res = await fetch(`/blog/${params.slug}.json`)
    const data = await res.json()
    if (res.status === 200) {
      const { post, contents } = data
      return {
        props: {
          post,
          contents,
        },
      }
    } else {
      const { message } = data
      return {
        status: res.status,
        error: new Error(message),
      }
    }
  }
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import Card from '../../components/Card.svelte'
  import Ogp from '../../components/Ogp.svelte'
  import PostList from '../../components/PostList.svelte'
  import TwitterShareButton from '../../components/TwitterShareButton.svelte'
  import HatenaShareButton from '../../components/HatenaShareButton.svelte'
  import type { BlogPost } from '../../generated/graphql'

  export let post: Pick<
    BlogPost,
    'title' | 'slug' | 'about' | 'article' | 'createdAt' | 'tagsCollection' | 'relatedArticleCollection' | 'thumbnail'
  >
  export let contents: string

  console.log({ page: $page})

  $: protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  $: url = `${protocol}://${$page.url.host}${$page.url.pathname}`
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
</svelte:head>

<Ogp title={post.title} description={post.about} {url} image={post.thumbnail?.url} />

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
  <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mt-2">
    <div class="flex">
      <div>この記事をシェアする</div>
      <div class="ml-4">
        <TwitterShareButton {url} text={post.title} />
      </div>
      <div class="ml-4">
        <HatenaShareButton {url} text={post.title} />
      </div>
    </div>
  </div>
</div>

<h2 class="text-2xl">関連記事</h2>

<PostList posts={post.relatedArticleCollection?.items} small />
