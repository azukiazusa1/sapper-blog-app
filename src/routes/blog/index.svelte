<script context="module" lang="ts">
  export async function preload() {
    const res = await this.fetch(`blog.json`)
    const { posts } = await res.json()
		return { posts }
	}  
</script>

<script lang="ts">
  import PostList from '../../components/PostList.svelte'
  import type { PostsQuery } from '../../generated/graphql';

  export let posts: PostsQuery

</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
</svelte:head>

<PostList posts={posts.blogPostCollection.items} />
