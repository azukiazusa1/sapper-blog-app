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
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 448 512" class="w-4 h-4"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M208 0H332.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V336c0 26.5-21.5 48-48 48H208c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48zM48 128h80v64H64V448H256V416h64v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V176c0-26.5 21.5-48 48-48z"/></svg>`;
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`;
    codeBlocks.forEach((block) => {
      const button = document.createElement("button");
      button.classList.add(
        "absolute",
        "right-2",
        "top-2",
        "rounded-md",
        "text-gray-200",
        "opacity-50",
        "p-2",
        "ring-2",
        "ring-gray-500",
        "ring-opacity-50",
        "text-outline-none",
        "hover:text-gray-500",
        "hover:bg-gray-500",
        "hover:opacity-100",
        "hover:ring-2",
        "hover:ring-gray-500",
        "focus:text-gray-500",
        "focus:ring-2",
        "focus:ring-gray-500",
        "focus:opacity-100",
      );
      // エディタと同じ色
      button.style.backgroundColor = "#212121";
      button.innerHTML = copyIcon;
      button.ariaLabel = "コピー";
      const popup = document.createElement("div");
      popup.classList.add(
        "absolute",
        "top-2",
        "right-14",
        "px-2",
        "py-1",
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
      popup.textContent = "Copied!";
      block.appendChild(popup);
      button.addEventListener("click", () => {
        const text = block.querySelector("code")?.textContent;
        navigator.clipboard.writeText(text);

        button.innerHTML = checkIcon;
        button.classList.remove("text-gray-200");
        button.classList.remove("hover:text-gray-500");
        button.classList.remove("focus:text-gray-500");
        button.classList.add("text-green-500");

        // ポップアップを表示
        popup.classList.remove("opacity-0");

        // 1秒後にポップアップを消す
        setTimeout(() => {
          popup.classList.add("opacity-0");
          button.innerHTML = copyIcon;
          button.classList.remove("text-green-500");
          button.classList.add("text-gray-200");
          button.classList.add("hover:text-gray-500");
          button.classList.add("focus:text-gray-500");
        }, 1000);
      });
      block.appendChild(button);
    });
  });
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
