<script lang="ts">
  import type { Asset, Tag as TagType } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import Tag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";
  import { localizeHref } from "$paraglide/runtime";

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
  class="group relative m-auto flex w-full flex-col overflow-hidden rounded-lg bg-stone-50 border border-stone-200 dark:border-stone-700 dark:bg-stone-950 h-full max-w-[400px] transition-colors"
>
  <a
    href={localizeHref(`/blog/${slug}`)}
    class="overflow-hidden"
    aria-hidden="true"
    tabindex="-1"
  >
    <div class="relative overflow-hidden aspect-[4/3]">
      <Image
        {slug}
        alt={thumbnail.title}
        src={thumbnail.url}
        width={600}
        height={450}
        {lazy}
        {small}
        class="h-full w-full object-cover"
      />
    </div>
  </a>

  <div class="flex flex-1 flex-col p-5 h-full">
    <header>
      <div
        class="mb-2 font-mono text-xs text-stone-400 dark:text-stone-500"
        style:--tag={small ? null : `time-${slug}`}
      >
        <Time date={createdAt} />
      </div>
      <h2
        class="mb-2 text-xl font-bold leading-tight transition-colors"
        style:--tag={small ? null : `h-${slug}`}
      >
        <a
          class="no-underline line-clamp-3 hover:underline"
          style="text-decoration-color: var(--color-accent)"
          href={localizeHref(`/blog/${slug}`)}>{title}</a
        >
      </h2>
    </header>

    {#if !small}
      <p
        class="mb-4 text-sm leading-relaxed text-stone-600 break-words dark:text-stone-400 line-clamp-3 h-[4.5em]"
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
