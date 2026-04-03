<script lang="ts">
  import { m } from "$paraglide/messages";
  import variables from "$lib/variables";
  import type { PageData } from "../$types";
  import Pagination from "../../../components/Pagination/Pagination.svelte";
  import PostList from "../../../components/PostList.svelte";
  import ShortList from "../../../components/ShortList.svelte";
  import Tabs from "../Tabs.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { shorts: shortBlogs, posts } = $derived(data);
</script>

<svelte:head>
  <title>{m.shortsTitle()} | {m.siteTitle()}</title>
  <meta name="description" content={m.shortsDescription()} />
  <link rel="canonical" href={`${variables.baseURL}/blog/shorts`} />
</svelte:head>

<Tabs value="shorts">
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
  {/snippet}
</Tabs>
