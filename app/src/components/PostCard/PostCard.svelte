<script lang="ts">
  import type { Asset, Scalars, Tag as TagType } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import Tag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";

  export let title: string;
  export let slug: string;
  export let about: string;
  export let thumbnail: Pick<Asset, "title" | "url">;
  export let createdAt: Scalars["DateTime"];
  export let tags: Array<Pick<TagType, "name" | "slug">>;
  export let small = false;
  export let lazy = true;
</script>

<!-- なぜか preload すると View Transition API がバグる -->
<article
  class="m-auto h-full w-10/12 overflow-hidden rounded-lg border dark:border-zinc-700 md:w-full"
  data-sveltekit-preload-data="off"
>
  <a href={`/blog/${slug}`} aria-hidden="true">
    <Image
      {slug}
      alt={thumbnail.title}
      src={thumbnail.url}
      width={400}
      height={300}
      {lazy}
    />
  </a>

  <header
    class="flex-row items-center justify-between border-t p-4 leading-tight dark:border-zinc-700"
  >
    <h2 class="text-2xl font-bold" style:--tag="h-{slug}">
      <a class="no-underline hover:underline" href={`/blog/${slug}`}>{title}</a>
    </h2>
    <p class="mt-2" style:--tag="time-{slug}">
      <Time date={createdAt} />
    </p>
  </header>

  {#if !small}
    <p
      class="mx-4 break-words text-sm text-black text-opacity-80 dark:text-gray-50 dark:text-opacity-80"
      style:--tag="about-{slug}"
    >
      {about}
    </p>

    <footer
      class="mt-2 flex flex-wrap items-center p-2 leading-none md:p-4"
      style:--tag="tag-{slug}"
    >
      {#each tags as tag (tag.slug)}
        <Tag name={tag.name} slug={tag.slug} />
      {/each}
    </footer>
  {/if}
</article>
