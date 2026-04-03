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
          class="relative mb-8 text-3xl font-extrabold dark:text-white after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-20 after:bg-indigo-500 after:content-['']"
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
              class="group col-span-2 flex min-w-0 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
            >
              <a
                href={localizeHref(`/blog/${featuredLatest.slug}`)}
                class="flex w-full min-w-0"
              >
                <div class="min-w-0 flex-1 p-6">
                  <div class="mb-4 flex items-center gap-3">
                    <div
                      class="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium dark:bg-zinc-800"
                    >
                      <Time date={featuredLatest.createdAt} />
                    </div>
                    <span
                      class="text-xs font-semibold tracking-[0.24em] text-indigo-600 uppercase dark:text-indigo-400"
                    >
                      Feature
                    </span>
                  </div>

                  <h3
                    class="mb-4 text-2xl leading-tight font-bold transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400"
                  >
                    {featuredLatest.title}
                  </h3>

                  <p
                    class="mb-6 line-clamp-4 text-sm leading-7 text-zinc-700 dark:text-zinc-300"
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
        class="rounded-3xl bg-linear-to-r from-purple-50 to-indigo-50 px-6 py-8 dark:from-purple-950/40 dark:to-indigo-950/40"
      >
        <h2
          class="relative mb-8 text-3xl font-extrabold dark:text-white after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-20 after:bg-purple-500 after:content-['']"
        >
          {m.homePopularArticles()}
        </h2>
        <ol class="list-inside list-decimal space-y-4">
          {#each popularPosts as post}
            <li class="transition-transform duration-200 hover:translate-x-1">
              <a
                class="text-lg hover:text-indigo-600 dark:hover:text-indigo-400"
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
        class="relative text-3xl font-extrabold dark:text-white after:absolute after:-bottom-3 after:left-0 after:h-1 after:w-20 after:bg-indigo-500 after:content-['']"
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
    class="mt-16 mb-8 relative text-3xl font-extrabold dark:text-white after:content-[''] after:absolute after:-bottom-3 after:left-0 after:w-20 after:h-1 after:bg-indigo-500"
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
