<script lang="ts">
  import type { Asset, Scalars, Tag as TagType } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import Tag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";

  export let title: string;
  export let slug: string;
  export let about: string;
  export let thumbnail: Pick<Asset, "title" | "url">;
  export let createdAt: string;
  export let tags: Array<Pick<TagType, "name" | "slug">>;
  export let small = false;
  export let lazy = true;
</script>

<article class="m-auto w-full rounded-lg border dark:border-zinc-700">
  <a href={`/blog/${slug}`} aria-hidden="true">
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
        class="mx-4 mt-1 h-fit break-words text-sm text-black text-opacity-80 dark:text-gray-50 dark:text-opacity-80"
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

<style>
  article {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 3;
    gap: 1rem;
  }
</style>
