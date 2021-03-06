<script context="module" lang="ts">
  export async function preload({ params }) {
    const res = await this.fetch(`blog/${params.slug}.json`)
    const data = await res.json()
    if (res.status === 200) {
      const { post, contents } = data
      return { post, contents }
    } else {
      const { message } = data
      this.error(res.status, message)
    }
  }
</script>

<script lang="ts">
  import { stores } from '@sapper/app';
  import Card from '../../components/Card.svelte'
  import Ogp from '../../components/Ogp.svelte'
  import PostList from '../../components/PostList.svelte'
import TwitterShareButton from '../../components/TwitterShareButton.svelte';
  import type { BlogPost } from '../../generated/graphql'

  const { page } = stores()

  export let post: Pick<
    BlogPost,
    'title' | 'slug' | 'about' | 'article' | 'createdAt' | 'tagsCollection' | 'relatedArticleCollection' | 'thumbnail'
  >
  export let contents: string

  $: protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  $: url = `${protocol}://${$page.host}${$page.path}`
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
</svelte:head>

<Ogp title={post.title}
  description={post.about}
  url={url}
  image={post.thumbnail.url}
/>

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
  <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mt-2">
    <TwitterShareButton url={url} text={post.title} />
  </div>
</div>


<h2 class="text-2xl">関連記事</h2>

<PostList posts={post.relatedArticleCollection?.items} small />
