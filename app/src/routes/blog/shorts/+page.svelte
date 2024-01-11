<script lang="ts">
  import variables from "$lib/variables";
  import type { PageData } from "../$types";
  import Pagination from "../../../components/Pagination/Pagination.svelte";
  import PostList from "../../../components/PostList.svelte";
  import ShortList from "../../../components/ShortList.svelte";
  import Tabs from "../Tabs.svelte";

  export let data: PageData;
  $: ({ shorts, posts } = data);
</script>

<svelte:head>
  <title>ショート | azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="サクサク読める短い記事をショートとして投稿しています。"
  />
  <link rel="canonical" href={`${variables.baseURL}/blog/shorts`} />
</svelte:head>

<Tabs value="shorts">
  <svelte:fragment slot="blog">
    <PostList posts={posts.blogPostCollection.items} />
    <Pagination
      total={posts.blogPostCollection.total}
      limit={posts.blogPostCollection.limit}
    />
  </svelte:fragment>
  <svelte:fragment slot="shorts">
    <ShortList shorts={shorts.shortCollection.items} />
  </svelte:fragment>
</Tabs>
