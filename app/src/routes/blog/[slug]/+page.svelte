<script lang="ts">
  import Card from "../../../components/Card/Card.svelte";
  import Ogp from "../../../components/Ogp.svelte";
  import PostList from "../../../components/PostList.svelte";
  import TwitterShareButton from "../../../components/TwitterShareButton.svelte";
  import HatenaShareButton from "../../../components/HatenaShareButton.svelte";
  import GitHubEditButton from "../../../components/GitHubEditButton.svelte";
  import type { PageData } from "./$types";
  import variables from "$lib/variables";
  import ShareButton from "../../../components/ShareButton.svelte";
  import Box from "../../../components/Box/Box.svelte";
  import Contributors from "../../../components/Contributors/Contributors.svelte";

  export let data: PageData;

  $: post = data.post;
  $: contents = data.contents;
  $: contributors = data.contributors;
  $: tagNames = post.tagsCollection.items.map((t) =>
    encodeURIComponent(t.name),
  );

  $: url = `${variables.baseURL}/blog/${post.slug}`;
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
  <link rel="canonical" href={url} />
</svelte:head>

<Ogp
  title={post.title}
  description={post.about}
  {url}
  image={`${variables.baseURL}/blog/ogp/${encodeURIComponent(
    post.title,
  )}/${tagNames.join("/")}.png`}
/>

<div class="mx-auto my-12 max-w-3xl">
  <Card
    slug={post.slug}
    title={post.title}
    about={post.about}
    tags={post.tagsCollection.items}
    createdAt={post.createdAt}
    thumbnail={{
      title: post.thumbnail?.title ?? "",
      url: post.thumbnail?.url ?? "",
    }}
    {contents}
  />
  <hr class="my-4 border-gray-300 dark:border-zinc-700" />
  <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
    <Contributors {contributors} />
    <Box>
      <GitHubEditButton slug={post.slug} />
      <div class="mt-4 flex">
        <ShareButton {url} text={post.title}>
          <svelte:fragment slot="fallback">
            <div>この記事をシェアする</div>
            <div class="ml-4">
              <TwitterShareButton {url} text={post.title} />
            </div>
            <div class="ml-4">
              <HatenaShareButton {url} text={post.title} />
            </div>
          </svelte:fragment>
        </ShareButton>
      </div>
    </Box>
  </div>
</div>

<h2 class="text-2xl">関連記事</h2>

<PostList posts={post.relatedArticleCollection?.items} small />
<!-- svelte-ignore a11y-missing-content -->
<a
  href={`/blog/ogp/${encodeURIComponent(post.title)}/${tagNames.join("/")}.png`}
/>
