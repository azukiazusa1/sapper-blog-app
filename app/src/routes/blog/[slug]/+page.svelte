<script lang="ts">
  import { page } from '$app/stores'
  import Card from '../../../components/Card/Card.svelte'
  import Ogp from '../../../components/Ogp.svelte'
  import PostList from '../../../components/PostList.svelte'
  import TwitterShareButton from '../../../components/TwitterShareButton.svelte'
  import HatenaShareButton from '../../../components/HatenaShareButton.svelte'
  import GitHubEditButton from '../../../components/GitHubEditButton.svelte'
  import type { PageData } from './$types'
  import variables from '$lib/variables'
  import ShareButton from '../../../components/ShareButton.svelte'

  export let data: PageData

  const share = async () => {
    if (!navigator.share) return
    await navigator
      .share({
        title: data.post.title,
        text: data.post.about,
        url: `${variables.baseURL}/blog/${data.post.slug}`,
      })
      .catch(() => {
        // noop
      })
  }

  $: post = data.post
  $: contents = data.contents
  $: tagNames = post.tagsCollection.items.map((t) => encodeURIComponent(t.name))

  $: protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  $: url = `${protocol}://${$page.url.host}${$page.url.pathname}`
  $: supportNavigationShare = 'share' in navigator
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
  <link rel="canonical" href={`${variables.baseURL}/blog/${post.slug}`} />
</svelte:head>

<Ogp
  title={post.title}
  description={post.about}
  {url}
  image={`https://azukiazusa.dev/blog/ogp/${encodeURIComponent(post.title)}/${tagNames.join('/')}.png`}
/>

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
  <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg mt-2 max-w-5xl mx-auto">
    <GitHubEditButton slug={post.slug} />
    {#if supportNavigationShare}
      <div class="mt-4">
        <ShareButton on:click={share} />
      </div>
    {:else}
      <div class="flex mt-4">
        <div>この記事をシェアする</div>
        <div class="ml-4">
          <TwitterShareButton {url} text={post.title} />
        </div>
        <div class="ml-4">
          <HatenaShareButton {url} text={post.title} />
        </div>
      </div>
    {/if}
  </div>
</div>

<h2 class="text-2xl">関連記事</h2>

<PostList posts={post.relatedArticleCollection?.items} small />
<!-- svelte-ignore a11y-missing-content -->
<a href={`/blog/ogp/${encodeURIComponent(post.title)}/${tagNames.join('/')}.png`} />
