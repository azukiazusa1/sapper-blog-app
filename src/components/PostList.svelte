<script lang="ts">
  import type { Asset, BlogPost, Tag } from '../generated/graphql'
  import PostCard from './PostCard.svelte'

  export let posts: (Pick<BlogPost, 'title' | 'slug' | 'about' | 'createdAt'> & {
    thumbnail?: Pick<Asset, 'title' | 'url'>
    tagsCollection?: {
      items: Array<Pick<Tag, 'name' | 'slug'>>
    }
  })[]

  export let small = false
</script>

<div class="flex flex-wrap -mx-1 lg:-mx-4">
  {#each posts as post (post.slug)}
    <div class="mt-1 mb-4 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3">
      <PostCard
        title={post.title}
        slug={post.slug}
        about={post.about}
        thumbnail={post.thumbnail}
        createdAt={post.createdAt}
        tags={post.tagsCollection ? post.tagsCollection.items : []}
        {small}
      />
    </div>
  {/each}
</div>
