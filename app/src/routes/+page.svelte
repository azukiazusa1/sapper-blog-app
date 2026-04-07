<script lang="ts">
  import { m } from "$paraglide/messages";
  import { localizeHref } from "$paraglide/runtime";
  import variables from "$lib/variables";
  import HeroSection from "../components/HeroSection/HeroSection.svelte";
  import Image from "../components/Image/Image.svelte";
  import PostCard from "../components/PostCard/PostCard.svelte";
  import Link from "../components/Link/Link.svelte";
  import Tag from "../components/Tag/Tag.svelte";
  import type { PageData } from "./$types";
  import TalkTimelines from "../components/TalkTimelines.svelte";
  import ShortList from "../components/ShortList.svelte";
  import TagList from "../components/TagList.svelte";
  import Time from "../components/Time/Time.svelte";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let { latestPosts, shorts, popularPosts, tags } = $derived(data);
  let latestItems = $derived(latestPosts.blogPostCollection.items);
  let featuredLatest = $derived(latestItems[0]);
  let secondaryLatest = $derived(latestItems.slice(1, 3));
</script>

<svelte:head>
  <title>{m.siteTitle()}</title>
  <meta name="description" content={m.siteDescription()} />
  <link rel="canonical" href={`${variables.baseURL}`} />
</svelte:head>

<HeroSection />

<div class="container mx-auto px-4 max-w-7xl">
  <div class="my-8">
    <TagList
      tags={tags.tagCollection.items.map((tag) => ({
        name: tag.name,
        slug: tag.slug,
      }))}
    />
  </div>

  <div class="my-16 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
    <div class="min-w-0 space-y-16">
      <section>
        <h2
          class="mb-8 border-b border-stone-200 pb-3 font-mono text-base font-medium uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:text-stone-400"
        >
          {m.homeLatestArticles()}
        </h2>

        <div class="grid gap-6 lg:hidden">
          {#each latestItems as post, index (post.slug)}
            <PostCard
              title={post.title}
              slug={post.slug}
              about={post.about}
              thumbnail={post.thumbnail}
              createdAt={post.createdAt}
              tags={post.tagsCollection ? post.tagsCollection.items : []}
              lazy={index > 1}
            />
          {/each}
        </div>

        <div class="hidden gap-6 lg:grid lg:grid-cols-2">
          {#if featuredLatest}
            <article
              class="group col-span-2 flex min-w-0 overflow-hidden rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-950"
            >
              <a
                href={localizeHref(`/blog/${featuredLatest.slug}`)}
                class="flex w-full min-w-0"
              >
                <div class="min-w-0 flex-1 p-6">
                  <div class="mb-4 flex items-center gap-3">
                    <div
                      class="inline-flex items-center gap-1 font-mono text-xs font-medium text-stone-400 dark:text-stone-500"
                    >
                      <Time date={featuredLatest.createdAt} />
                    </div>
                    <span
                      class="font-mono text-xs font-medium tracking-[0.2em] uppercase"
                      style="color: var(--color-accent)"
                    >
                      Feature
                    </span>
                  </div>

                  <h3
                    class="mb-4 text-2xl leading-tight font-bold transition-colors dark:text-white"
                    style="font-family: var(--font-display)"
                  >
                    {featuredLatest.title}
                  </h3>

                  <p
                    class="mb-6 line-clamp-4 text-sm leading-relaxed text-stone-600 dark:text-stone-400"
                  >
                    {featuredLatest.about}
                  </p>

                  <div class="flex flex-wrap gap-2">
                    {#each featuredLatest.tagsCollection ? featuredLatest.tagsCollection.items : [] as tag (tag.slug)}
                      <Tag name={tag.name} slug={tag.slug} />
                    {/each}
                  </div>
                </div>

                <div class="w-[44%] shrink-0 self-stretch overflow-hidden">
                  <Image
                    slug={featuredLatest.slug}
                    alt={featuredLatest.thumbnail.title}
                    src={featuredLatest.thumbnail.url}
                    width={600}
                    height={450}
                    lazy={false}
                    class="h-full w-full object-cover"
                  />
                </div>
              </a>
            </article>
          {/if}

          {#each secondaryLatest as post, index (post.slug)}
            <PostCard
              title={post.title}
              slug={post.slug}
              about={post.about}
              thumbnail={post.thumbnail}
              createdAt={post.createdAt}
              tags={post.tagsCollection ? post.tagsCollection.items : []}
              lazy={index > 0}
            />
          {/each}
        </div>

        <div class="flex flex-row-reverse mt-2">
          <Link href="/blog">
            {m.homeSeeAllArticles()}
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <section
        class="rounded-lg px-6 py-8 border border-stone-200 dark:border-stone-700"
      >
        <h2
          class="mb-8 border-b border-stone-300 pb-3 font-mono text-base font-medium uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:text-stone-400"
        >
          {m.homePopularArticles()}
        </h2>
        <ol class="list-inside list-decimal space-y-4">
          {#each popularPosts as post}
            <li>
              <a
                class="text-base transition-colors dark:text-stone-200 hover:underline focus-visible:underline focus-visible:outline-hidden hover:[color:var(--color-accent)] focus-visible:[color:var(--color-accent)]"
                href={post.path}
              >
                {post.title}
              </a>
            </li>
          {/each}
        </ol>
      </section>
    </div>

    <section class="min-w-0 space-y-6">
      <h2
        class="border-b border-stone-200 pb-3 font-mono text-base font-medium uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:text-stone-400"
      >
        {m.shortsTitle()}
      </h2>
      <div class="lg:max-h-[1200px] lg:overflow-y-auto lg:pr-2">
        <ShortList
          shorts={shorts.shortCollection.items}
          showMoreHref="/blog/shorts"
        />
      </div>
    </section>
  </div>

  <h2
    class="mt-16 mb-8 border-b border-stone-200 pb-3 font-mono text-base font-medium uppercase tracking-[0.2em] text-stone-500 dark:border-stone-700 dark:text-stone-400"
  >
    {m.homeTalks()}
  </h2>
  <div class="max-w-5xl mx-auto">
    <div class="mb-8">
      <TalkTimelines limit={3} />
    </div>
    <div class="flex flex-row-reverse mb-8">
      <Link href="/talks">
        {m.homeSeeAllTalks()}
        <svg
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          class="ml-2 h-4 w-4"
          viewBox="0 0 24 24"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
</div>
