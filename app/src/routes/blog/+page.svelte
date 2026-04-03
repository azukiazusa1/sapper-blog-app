<script lang="ts">
  import { m } from "$paraglide/messages";
  import PostList from "../../components/PostList.svelte";
  import Pagination from "../../components/Pagination/Pagination.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";
  import Tabs from "./Tabs.svelte";
  import ShortList from "../../components/ShortList.svelte";
  import LinkButton from "../../components/LinkButton/LinkButton.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { posts, shorts: shortBlogs } = $derived(data);
</script>

<svelte:head>
  <title>{m.siteTitle()}</title>
  <meta name="description" content={m.siteDescription()} />
  <link rel="canonical" href={`${variables.baseURL}/blog`} />
</svelte:head>

<Tabs value="blog">
  {#snippet blog()}
    <div class="px-4 max-w-7xl mx-auto">
      <PostList posts={posts.blogPostCollection.items} />
      <Pagination
        total={posts.blogPostCollection.total}
        limit={posts.blogPostCollection.limit}
      />
    </div>
  {/snippet}
  {#snippet shorts()}
    <ShortList shorts={shortBlogs.shortCollection.items} />

    <div class="my-16 flex justify-center">
      <LinkButton href="/blog/shorts">{m.shortsMore()}</LinkButton>
    </div>
  {/snippet}
</Tabs>
