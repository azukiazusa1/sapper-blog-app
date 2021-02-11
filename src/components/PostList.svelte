<script lang="ts">
  import type { Post } from '../repositories/post'
  import PostCard from './PostCard.svelte'

  export let posts: Post[]
</script>

<div class="container my-12 mx-auto px-4 md:px-12">
  <div class="flex flex-wrap -mx-1 lg:-mx-4">
    {#each posts as post (post.slug)}
      <div class="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
        <PostCard {...post} />
      </div>
    {/each}
  </div>
</div>
