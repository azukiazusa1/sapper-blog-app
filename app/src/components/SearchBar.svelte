<script lang="ts">
  import { goto } from "$app/navigation";
  import type { SearchPostsQuery } from "../generated/graphql";
  import Combobox from "./Combobox/Combobox.svelte";
  import type { Item } from "./Combobox/types";

  let value = "";
  let posts: SearchPostsQuery;
  let loading = true;

  const search = async () => {
    loading = true;
    posts = await fetch(`/api/search?q=${value}`).then((res) => res.json());
    loading = false;
  };

  $: {
    if (value.trim()) {
      search();
    } else {
      posts = undefined;
    }
  }

  $: items = posts
    ? posts.blogPostCollection.items.map((item) => {
        return {
          imageUrl: item.thumbnail.url,
          text: item.title,
          key: item.slug,
        };
      })
    : [];

  const handleSelect = (e: CustomEvent<Item>) => {
    goto(`/blog/${e.detail.key}`);
  };
</script>

<form action="/blog/search" method="get" role="search">
  <Combobox bind:value on:select={handleSelect} {items} {loading} required />
</form>
