<script lang="ts">
  import AppTag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";
  import type { Tag } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import { onMount } from "svelte";

  export let title: string;
  export let about: string;
  export let contents: string;
  export let tags: Pick<Tag, "name" | "slug">[];
  export let createdAt: string;
  export let preview = false;
  export let thumbnail: { title: string; url: string };
  export let slug: string;

  onMount(() => {
    // コードブロックに、コピー用のボタンを追加
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((block) => {
      const button = document.createElement("button");
      button.classList.add(
        "absolute",
        "right-2",
        "top-2",
        "p-1",
        "rounded-md",
        "bg-gray-100",
        "dark:bg-zinc-500",
        "text-gray-500",
        "dark:text-gray-300",
        "hover:bg-gray-200",
        "dark:hover:bg-zinc-400",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-gray-200",
        "dark:focus:ring-zinc-400",
        "focus:ring-opacity-50",
        "dark:focus:ring-opacity-50",
      );
      button.textContent = "Copy";
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(block.textContent);
      });
      block.appendChild(button);
    });
  })
</script>

<article>
  <div class="p-4">
    <Image
      src={thumbnail.url}
      alt={thumbnail.title}
      width={480}
      height={270}
      {slug}
    />
    <h1 class="mt-4 text-2xl font-bold md:text-4xl" style:--tag="h-{slug}">
      {title}
    </h1>
    <p class="my-2" style:--tag="time-{slug}">
      <Time date={createdAt} />
    </p>
    <p
      class="break-words text-sm text-black text-opacity-80 dark:text-gray-50 dark:text-opacity-80"
      style:--tag="about-{slug}"
    >
      {about}
    </p>
    <div
      class="mt-4 flex flex-wrap items-center leading-none"
      style:--tag="tag-{slug}"
    >
      {#each tags as tag (tag.slug)}
        <AppTag {...tag} />
      {/each}
    </div>

    {#if preview}
      <p class="hint error my-4">
        これは下書き記事のプレビューです。内容は不正確な恐れがあります。
      </p>
    {/if}
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    <p id="contents" class="mt-6">{@html contents}</p>
  </div>
</article>
