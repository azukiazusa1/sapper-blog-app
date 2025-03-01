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
  class="row-span-3 m-auto grid w-full grid-rows-subgrid gap-4 rounded-lg border dark:border-zinc-700"
>
  <a href={`/blog/${slug}`} aria-hidden="true" tabindex="-1">
    <Image
      {slug}
      alt={thumbnail.title}
      src={thumbnail.url}
      width={400}
      height={300}
      {lazy}
      {small}
    />
  </a>
  <div>
    <header
      class="flex-row items-center justify-between border-t p-4 leading-tight dark:border-zinc-700"
    >
      <h2 class="text-xl font-bold" style:--tag={small ? null : `h-${slug}`}>
        <a class="no-underline hover:underline" href={`/blog/${slug}`}
          >{title}</a
        >
      </h2>
      <p class="mt-2" style:--tag={small ? null : `time-${slug}`}>
        <Time date={createdAt} />
      </p>
    </header>

    {#if !small}
      <p
        class="mx-4 mt-1 h-fit text-sm break-words text-black/80 dark:text-gray-50/80"
        style:--tag="about-{slug}"
      >
        {about}
      </p>
    {/if}
  </div>

  <footer
    class="flex flex-wrap items-center p-2 leading-none md:p-4"
    style:--tag={small ? null : `tag-${slug}`}
  >
    {#each tags as tag (tag.slug)}
      <Tag name={tag.name} slug={tag.slug} />
    {/each}
  </footer>
</article>
