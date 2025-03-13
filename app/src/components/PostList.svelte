<script lang="ts">
  import type { Asset, BlogPost, Tag } from "../generated/graphql";
  import PostCard from "./PostCard/PostCard.svelte";

  interface Props {
    posts: (Pick<BlogPost, "title" | "slug" | "about" | "createdAt"> & {
      thumbnail?: Pick<Asset, "title" | "url">;
      tagsCollection?: {
        items: Array<Pick<Tag, "name" | "slug">>;
      };
    })[];
    small?: boolean;
  }

  let { posts, small = false }: Props = $props();
</script>

<div class="animate-[fade-in_0.6s_ease-out] grid gap-8">
  {#each posts as post, i (post.slug)}
    <div
      class="transform transition-all duration-300 hover:-translate-y-1 h-full flex"
    >
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

<style>
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }

  @media (min-width: 1280px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
