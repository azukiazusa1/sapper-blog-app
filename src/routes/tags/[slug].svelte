<script context="module" lang="ts">
  export async function preload({ params }) {
    const res = await this.fetch(`tags/${params.slug}.json`)
    const data = await res.json()
    if (res.status === 200) {
      const { tag } = data
      return { tag }
    } else {
      const { message } = data
      this.error(res.status, message)
    }
  }
</script>

<script lang="ts">
  import PostList from '../../components/PostList.svelte'
  import Pagination from '../../components/Pagination.svelte'
  import type { TagBySlugQuery } from '../../generated/graphql'

  export let tag: TagBySlugQuery

  $: tagName = tag.tagCollection.items[0].name
  $: tagSlug = tag.tagCollection.items[0].slug
  $: posts = tag.tagCollection.items[0].linkedFrom
</script>

<svelte:head>
  <title>{tagName} | タグ</title>
</svelte:head>

<h1 class="text-2xl">
  <span class="font-bold">{tagName}</span>の記事一覧
</h1>

<PostList posts={posts.blogPostCollection.items} />

<Pagination
  total={posts.blogPostCollection.total}
  limit={posts.blogPostCollection.limit}
  href={`tags/${tagSlug}/page/`}
/>
