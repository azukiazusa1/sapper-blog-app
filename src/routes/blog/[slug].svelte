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
  import Card from '../../components/Card.svelte'
  import PostList from '../../components/PostList.svelte'
  import type { BlogPost } from '../../generated/graphql'

  export let post: Pick<
    BlogPost,
    'title' | 'slug' | 'about' | 'article' | 'createdAt' | 'tagsCollection' | 'relatedArticleCollection'
  >
  export let contents: string
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
</svelte:head>

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
</div>

<h2 class="text-2xl">関連記事</h2>

<PostList posts={post.relatedArticleCollection?.items} small />
