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
  import Contributors from "../../../components/Contributors/Contributors.svelte";
  import Prev from "../../../components/Icons/Prev.svelte";
  import SelfAssessment from "../../../components/SelfAssessment/SelfAssessment.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  let post = $derived(data.post);
  let contents = $derived(data.contents);
  let rawMarkdown = $derived(data.rawMarkdown);
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

<div class="mx-auto my-6 px-4 max-w-6xl">
  <a
    href="/blog"
    class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 transition-colors dark:bg-zinc-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700"
  >
    <Prev className="h-4 w-4" />
    Back to blog
  </a>
</div>

<div>
  {#key post.slug}
    <Card
      slug={post.slug}
      title={post.title}
      about={post.about}
      tags={post.tagsCollection.items}
      createdAt={post.createdAt}
      audio={post.audio}
      thumbnail={{
        title: post.thumbnail?.title ?? "",
        url: post.thumbnail?.url ?? "",
      }}
      {contents}
      {rawMarkdown}
    />
  {/key}

  <div class="mx-auto max-w-5xl px-4 py-6">
    {#if post.selfAssessment?.quizzes.length > 0}
      <div
        class="animate-[fade-in_0.5s_ease-out] rounded-xl bg-gray-50 p-6 shadow-sm dark:bg-zinc-900"
      >
        <SelfAssessment quizzes={post.selfAssessment.quizzes} />
      </div>
    {/if}
  </div>

  <div class="mx-auto max-w-5xl px-4">
    <div
      class="my-8 h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-zinc-700"
    ></div>
    <div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
      <div
        class="animate-[fade-in_0.5s_ease-out] overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900"
      >
        <Contributors {contributors} />
      </div>
      <div
        class="animate-[fade-in_0.7s_ease-out] overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900"
      >
        <div class="flex flex-col gap-4">
          <GitHubEditButton slug={post.slug} />
          <div class="flex">
            <ShareButton {url} text={post.title}>
              {#snippet fallback()}
                <div class="mr-2 font-medium">この記事をシェアする</div>
                <div class="flex gap-2">
                  <TwitterShareButton {url} text={post.title} />
                  <HatenaShareButton {url} text={post.title} />
                </div>
              {/snippet}
            </ShareButton>
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <a
              href={`/blog/${post.slug}.md`}
              class="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              Markdown バージョン
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="mx-auto mt-16 max-w-6xl px-4 py-8">
  <h2
    class="mb-6 text-2xl font-extrabold leading-none after:mt-2 after:block after:h-1 after:w-16 after:bg-indigo-500 after:content-['']"
  >
    関連記事
  </h2>
  <div class="animate-[fade-in_0.5s_ease-out]">
    <PostList posts={post.relatedArticleCollection?.items} small />
  </div>
</div>

<!-- ogp を静的に生成するために空のリンクを設置している -->
<a href={`/blog/ogp/${post.slug}.png`} aria-hidden="true" tabindex="-1"></a>
