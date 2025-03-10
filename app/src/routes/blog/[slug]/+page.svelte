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
  import Prev from "../../../components/Icons/Prev.svelte";
  import SelfAssessment from "../../../components/SelfAssessment/SelfAssessment.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let post = $derived(data.post);
  let contents = $derived(data.contents);
  let contributors = $derived(data.contributors);

  let url = $derived(`${variables.baseURL}/blog/${post.slug}`);
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about} />
  <link rel="canonical" href={url} />
  <meta name="robots" content="max-image-preview:large" />
</svelte:head>

<Ogp
  title={post.title}
  description={post.about}
  {url}
  image={`${variables.baseURL}/blog/ogp/${post.slug}.png`}
/>

<div class="mx-auto my-5 max-w-5xl">
  <a
    href="/blog"
    class="flex items-center text-sm hover:underline md:text-base"
  >
    <Prev className="h-4 w-4 md:h-6 md:w-6" />
    Back to blog
  </a>
</div>

<div class="mb-12">
  {#key post.slug}
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
  {/key}

  <div class="mx-auto max-w-5xl p-4">
    {#if post.selfAssessment?.quizzes.length > 0}
      <SelfAssessment quizzes={post.selfAssessment.quizzes} />
    {/if}
  </div>

  <div class="mx-auto max-w-5xl">
    <hr class="my-4 border-gray-300 dark:border-zinc-700" />
    <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <Contributors {contributors} />
      <Box>
        <GitHubEditButton slug={post.slug} />
        <div class="mt-4 flex">
          <ShareButton {url} text={post.title}>
            {#snippet fallback()}
              <div>この記事をシェアする</div>
              <div class="ml-4">
                <TwitterShareButton {url} text={post.title} />
              </div>
              <div class="ml-4">
                <HatenaShareButton {url} text={post.title} />
              </div>
            {/snippet}
          </ShareButton>
        </div>
        <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
          <a href={`/blog/${post.slug}.md`} class="underline">
            Markdown バージョン
          </a>
        </div>
      </Box>
    </div>
  </div>
</div>

<h2 class="mb-4 p-4 text-2xl font-extrabold leading-none">関連記事</h2>

<PostList posts={post.relatedArticleCollection?.items} small />

<!-- ogp を静的に生成するために空のリンクを設置している -->
<a href={`/blog/ogp/${post.slug}.png`} aria-hidden="true" tabindex="-1"></a>
