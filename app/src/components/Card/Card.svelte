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
      button.textContent = `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>`;
      button.ariaLabel = "コピー";
      button.addEventListener("click", () => {
        navigator.clipboard.writeText(block.textContent);
        // クリックしたらポップアップを表示
        const popup = document.createElement("div");
        popup.classList.add(
          "absolute",
          "top-2",
          "right-2",
          "p-2",
          "rounded-md",
          "bg-gray-100",
          "dark:bg-zinc-500",
          "text-gray-500",
          "dark:text-gray-300",
          "text-sm",
          "transition-opacity",
          "duration-300",
          "opacity-0",
          "pointer-events-none",
        );
        block.appendChild(popup);

        // 1秒後にポップアップを消す
        setTimeout(() => {
          popup.classList.add("opacity-0");
          setTimeout(() => {
            block.removeChild(popup);
          }, 300);
        }, 1000);
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
