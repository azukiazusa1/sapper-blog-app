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

<div class="-mx-1 flex flex-wrap lg:-mx-4">
  {#each posts as post, i (post.slug)}
    <div class="mb-4 mt-1 w-full px-1 md:w-1/2 lg:my-4 lg:w-1/3 lg:px-4">
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
    </div>
  {/each}
</div>
