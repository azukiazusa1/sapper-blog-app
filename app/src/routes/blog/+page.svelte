<script lang="ts">
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
  let { posts, shorts } = $derived(data);
</script>

<svelte:head>
  <title>azukiazusaのテックブログ2</title>
  <meta
    name="description"
    content="azukiazusaのテックブログ2です。週に1回 Web 開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。"
  />
  <link rel="canonical" href={`${variables.baseURL}/blog`} />
</svelte:head>

<Tabs value="blog">
  {#snippet blog()}
  
      <PostList posts={posts.blogPostCollection.items} />
      <Pagination
        total={posts.blogPostCollection.total}
        limit={posts.blogPostCollection.limit}
      />
    
  {/snippet}
  {#snippet shorts()}
  
      <ShortList shorts={shorts.shortCollection.items} />

      <div class="my-16 flex justify-center">
        <LinkButton href="/blog/shorts/page/1">もっと見る</LinkButton>
      </div>
    
  {/snippet}
</Tabs>
