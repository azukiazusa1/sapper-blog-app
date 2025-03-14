<script lang="ts">
  import type { Asset, Tag as TagType } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import Tag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";

  interface Props {
    title: string;
    slug: string;
    about: string;
    thumbnail: Pick<Asset, "title" | "url">;
    createdAt: string;
    tags: Array<Pick<TagType, "name" | "slug">>;
    small?: boolean;
    lazy?: boolean;
  }

  let {
    title,
    slug,
    about,
    thumbnail,
    createdAt,
    tags,
    small = false,
    lazy = true,
  }: Props = $props();
</script>

<article
  class="group relative m-auto flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl dark:bg-zinc-900 dark:shadow-zinc-800/20 h-full max-w-[400px]"
>
  <a
    href={`/blog/${slug}`}
    class="overflow-hidden"
    aria-hidden="true"
    tabindex="-1"
  >
    <div class="relative overflow-hidden aspect-[4/3]">
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100 z-10"
      ></div>
      <Image
        {slug}
        alt={thumbnail.title}
        src={thumbnail.url}
        width={600}
        height={450}
        {lazy}
        {small}
        class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        class="absolute bottom-0 left-0 z-20 p-4"
        style:--tag={small ? null : `time-${slug}`}
      >
        <div
          class="inline-flex items-center gap-1 rounded-full dark:bg-black/50 backdrop-blur-sm px-3 py-1 text-xs font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <Time date={createdAt} />
        </div>
      </div>
    </div>
  </a>

  <div class="flex flex-1 flex-col p-5 h-full">
    <header>
      <h2
        class="mb-2 text-xl font-bold leading-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
        style:--tag={small ? null : `h-${slug}`}
      >
        <a class="no-underline line-clamp-2" href={`/blog/${slug}`}>{title}</a>
      </h2>
    </header>

    {#if !small}
      <p
        class="mb-4 text-sm leading-relaxed text-gray-700 break-words dark:text-gray-300 line-clamp-3 h-[4.5em]"
        style:--tag="about-{slug}"
      >
        {about}
      </p>
    {/if}

    <footer
      class="mt-auto flex flex-wrap items-center gap-1"
      style:--tag={small ? null : `tag-${slug}`}
    >
      <div class="flex flex-wrap gap-1">
        {#each tags as tag (tag.slug)}
          <Tag name={tag.name} slug={tag.slug} />
        {/each}
      </div>
    </footer>
  </div>
</article>
