<script lang="ts">
  import AppTag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";
  import type { Tag } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import NavButton from "./NavButton.svelte";
  import { onMount } from "svelte";

  export let title: string;
  export let about: string;
  export let contents: string;
  export let tags: Pick<Tag, "name" | "slug">[];
  export let createdAt: string;
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
        "right-12",
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

      block.insertAdjacentElement("afterend", button);
      button.insertAdjacentElement("afterend", popup);
    });
  });

  // スクロールした時に、目次のアクティブなリンクを変更する
  onMount(() => {
    const contents = document.getElementById("contents");
    const headings = contents?.querySelectorAll("h1, h2, h3, h4, h5, h6");
    const links = document.querySelectorAll(".toc-link");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            links.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("text-indigo-600");
                link.classList.add("dark:text-indigo-400");
                link.classList.add("font-bold");
              } else {
                link.classList.remove("text-indigo-600");
                link.classList.remove("dark:text-indigo-400");
                link.classList.remove("font-bold");
              }
            });
          }
        });
      },
      {
        rootMargin: "-1px 0px -90% 0px",
      },
    );
    headings?.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      observer.disconnect();
    };
  });

  // nav-button の高さは markdown-body - toc の高さに合わせる
  onMount(() => {
    const navButton = document.getElementById("nav-button");
    const contents = document.getElementById("contents");
    navButton?.setAttribute(
      "style",
      `height: ${contents?.clientHeight - 240}px`,
    );
  });

  function closeToc() {
    document.documentElement.classList.remove("open-toc");

    localStorage.setItem("toc-state", "close");
  }

  function openToc() {
    document.documentElement.classList.add("open-toc");

    localStorage.setItem("toc-state", "open");
  }
</script>

<svelte:head>
  <script>
    const initialState =
      localStorage.getItem("toc-state") === "close" ? "close" : "open";

    if (initialState === "open") {
      document.documentElement.classList.add("open-toc");
    }
  </script>
</svelte:head>

<article data-pagefind-body>
  <div class="p-4">
    <div class="mx-auto max-w-3xl">
      <Image
        src={thumbnail.url}
        alt={thumbnail.title}
        width={480}
        height={270}
        {slug}
        main
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
    </div>

    <div class="relative mx-auto max-w-6xl">
      <div id="contents" class="show-line-number mx-auto mt-20 max-w-6xl">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html contents}
      </div>
      <div id="nav-button" class="absolute right-0 top-0">
        <NavButton
          on:click={closeToc}
          label="目次を閉じる"
          className="close-toc-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </NavButton>
        <NavButton
          on:click={openToc}
          label="目次を表示"
          className="open-toc-button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-7 w-7"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </NavButton>
      </div>
    </div>
  </div>
</article>
