<script context="module">
	export async function preload({ query }) {
		const params = new URLSearchParams({ q: query.q })
    const res = await this.fetch(`blog.json?${params}`)
    const { posts } = await res.json()
		return { posts, q: query.q }
	}
</script>

<script lang="ts">
  import PostList from "../../components/PostList.svelte";
  import SearchInput from "../../components/SearchInput.svelte";
  import type { SearchPostsQuery } from '../../generated/graphql'

  export let posts: SearchPostsQuery
  export let q: string

</script>
<svelte:head>
  <title>検索</title>
</svelte:head>
<div class="container my-10 md:mx-auto">
  <SearchInput value={q} />

  <PostList posts={posts.blogPostCollection.items}/>
</div>