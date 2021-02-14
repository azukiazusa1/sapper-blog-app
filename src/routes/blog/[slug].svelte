<script context="module" lang="ts">
  export async function preload({ params }) {
      const res = await this.fetch(`blog/${params.slug}.json`)
      const data = await res.json()
      if (res.status === 200) {
        const { post, contents } = data
        return { post, contents }
		} else {
      const { message } = data
			this.error(res.status, message);
		}
  }
</script>

<script lang="ts">
  import Card from '../../components/Card.svelte';
  import PostCard from '../../components/PostCard.svelte'
  import type { BlogPost } from '../../generated/graphql';

  export let post: Pick<BlogPost, 'title' | 'slug' | 'about' | 'article' | 'createdAt' | 'tagsCollection' | 'relatedArticleCollection'>
  export let contents: string

  console.log(post.relatedArticleCollection)
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about}>
</svelte:head>

<div class="my-12">
  <Card title={post.title} tags={post.tagsCollection.items} createdAt={post.createdAt} {contents} />
</div>

<h2 class="text-2xl">関連記事</h2>

<div class="container my-8 md:mx-auto md:px-12">
  <div class="flex flex-wrap -mx-1 lg:-mx-4">
    {#each post.relatedArticleCollection?.items as item (item.slug)}
      <div class="mt-1 mb-4 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <PostCard 
          title={item.title}
          slug={item.slug}
          createdAt={item.createdAt}
          thumbnail={item.thumbnail}
          small 
        />
      </div>
    {/each}
  </div>
</div>
