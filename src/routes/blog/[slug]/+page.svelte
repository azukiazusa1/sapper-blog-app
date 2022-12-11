<script lang="ts">
  import { page } from '$app/stores'
  import Card from '../../../components/Card.svelte'
  import Ogp from '../../../components/Ogp.svelte'
  import PostList from '../../../components/PostList.svelte'
  import TwitterShareButton from '../../../components/TwitterShareButton.svelte'
  import HatenaShareButton from '../../../components/HatenaShareButton.svelte'
  import type { PageData } from './$types'

  export let data: PageData

  $: post = data.post
  $: contents = data.contents

  $: protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  $: url = `${protocol}://${$page.url.host}${$page.url.pathname}`
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
</svelte:head>

<Ogp
  title={post.title}
  description={post.about}
  {url}
  image={`${protocol}://${$page.url.host}/blog/ogp/${encodeURIComponent(post.title)}.png`}
/>

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
  <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mt-2 max-w-5xl mx-auto">
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
<!-- svelte-ignore a11y-missing-content -->
<a href={`/blog/ogp/${encodeURIComponent(post.title)}.png`} />
