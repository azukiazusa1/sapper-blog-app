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

<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
