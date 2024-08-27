<script lang="ts">
  import type { Asset, BlogPost, Tag } from "../generated/graphql";
  import PostCard from "./PostCard/PostCard.svelte";

  export let posts: (Pick<
    BlogPost,
    "title" | "slug" | "about" | "createdAt"
  > & {
    thumbnail?: Pick<Asset, "title" | "url">;
    tagsCollection?: {
      items: Array<Pick<Tag, "name" | "slug">>;
    };
  })[];

  export let small = false;
</script>

<div class="grid gap-6 px-6">
  {#each posts as post, i (post.slug)}
    <PostCard
      title={post.title}
      slug={post.slug}
      about={post.about}
      thumbnail={post.thumbnail}
      createdAt={post.createdAt}
      tags={post.tagsCollection ? post.tagsCollection.items : []}
      {small}
      lazy={i > 2 || small}
    />
  {/each}
</div>

<style>
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  }
</style>
