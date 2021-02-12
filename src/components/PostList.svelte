<script lang="ts">
  import type { PostsQuery } from '../generated/graphql';
  import PostCard from './PostCard.svelte'

  export let posts: PostsQuery
  $: items = posts.blogPostCollection.items
</script>

<div class="container my-12 md:mx-auto md:px-12">
  <div class="flex flex-wrap -mx-1 lg:-mx-4">
    {#each items as post (post.slug)}
      <div class="mt-1 mb-4 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <PostCard {...post} />
      </div>
    {/each}
  </div>
</div>
