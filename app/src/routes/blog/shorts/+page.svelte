<script lang="ts">
  import variables from "$lib/variables";
  import type { PageData } from "../$types";
  import LinkButton from "../../../components/LinkButton/LinkButton.svelte";
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
  <title>ショート | azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="サクサク読める短い記事をショートとして投稿しています。"
  />
  <link rel="canonical" href={`${variables.baseURL}/blog/shorts`} />
</svelte:head>

<Tabs value="shorts">
  {#snippet blog()}
    <div class="px-4">
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
      <LinkButton href="/blog/shorts/page/1">もっと見る</LinkButton>
    </div>
  {/snippet}
</Tabs>
