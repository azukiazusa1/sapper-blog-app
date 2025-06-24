<script lang="ts">
  import AppTag from "../Tag/Tag.svelte";
  import Time from "../Time/Time.svelte";
  import type { Tag } from "../../generated/graphql";
  import Image from "../Image/Image.svelte";
  import NavButton from "./NavButton.svelte";
  import MarkdownCopyButton from "../MarkdownCopyButton/MarkdownCopyButton.svelte";
  import { onMount } from "svelte";

  interface Props {
    title: string;
    about: string;
    contents: string;
    tags: Pick<Tag, "name" | "slug">[];
    createdAt: string;
    thumbnail: { title: string; url: string };
    slug: string;
    audio?: string;
  }

  let { title, about, contents, tags, createdAt, thumbnail, slug }: Props =
    $props();

  // <baseline-status> を読み込む
  onMount(() => {
    import("baseline-status");
  });

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

  onMount(() => {
    // 画像をクリックした時、拡大表示する
    const images = document.querySelectorAll("#contents img");
    const filteredImages = Array.from(images).filter(
      (image) => !(image.parentElement.tagName === "A"),
    );
    const handleClick = (e: MouseEvent) => {
      const modal = document.createElement("dialog");
      modal.open = true;
      modal.classList.add(
        "fixed",
        "inset-0",
        "w-screen",
        "h-screen",
        "bg-black/80",
        "backdrop-blur-xs",
        "flex",
        "items-center",
        "justify-center",
        "z-50",
        "cursor-zoom-out",
      );
      modal.addEventListener("click", () => {
        modal.remove();
      });
      const image = e.target as HTMLImageElement;
      const copy = image.cloneNode() as HTMLImageElement;
      copy.classList.add("animate-fade-in");
      modal.appendChild(copy);
      document.body.appendChild(modal);
    };
    filteredImages.forEach((image) => {
      image.addEventListener("click", handleClick);
    });

    return () => {
      filteredImages.forEach((image) => {
        image.removeEventListener("click", handleClick);
      });
    };
  });
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

<article data-pagefind-body class="bg-white dark:bg-zinc-900 rounded-2xl">
  <div class="mx-auto px-4 py-8 md:py-12">
    <header class="animate-[fade-in_0.5s_ease-out]">
      <div class="mx-auto max-w-3xl">
        <Image
          src={thumbnail.url}
          alt={thumbnail.title}
          width={960}
          height={540}
          {slug}
          main
        />
        <div
          class="mt-6 flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          <div class="flex items-center pr-4" style:--tag="time-{slug}">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-1 h-4 w-4"
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
          <div
            class="flex flex-wrap items-center leading-none"
            style:--tag="tag-{slug}"
          >
            {#each tags as tag (tag.slug)}
              <AppTag {...tag} />
            {/each}
          </div>
        </div>

        <div class="mt-4 flex items-start justify-between gap-4">
          <h1
            class="text-3xl font-extrabold leading-tight tracking-tight md:text-4xl lg:text-5xl"
            style:--tag="h-{slug}"
          >
            {title}
          </h1>
          <div class="flex-shrink-0 pt-2">
            <MarkdownCopyButton {slug} {contents} />
          </div>
        </div>

        <p
          class="my-4 text-lg leading-relaxed text-gray-700 dark:text-gray-300"
          style:--tag="about-{slug}"
        >
          {about}
        </p>

        <!-- {#if audio}
          <div class="my-4 rounded-lg bg-gray-100 p-4 dark:bg-zinc-800">
            <h2 class="mb-4 text-lg font-semibold">音声による概要</h2>
            <p class="text-sm text-gray-700 dark:text-gray-300 mb-4">
              この音声概要は AI
              によって生成されており、誤りを含む可能性があります。
            </p>
            <audio controls src={audio} class="w-full">
              ご利用のブラウザは audio 要素をサポートしていません。
            </audio>
          </div>
        {/if} -->
      </div>
    </header>

    <div class="relative mx-auto max-w-6xl">
      <div
        id="contents"
        class="prose prose-lg dark:prose-invert prose-zinc show-line-number mx-auto mt-12 max-w-6xl px-4 md:px-8"
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html contents}
      </div>
      <div id="nav-button" class="absolute top-10 right-12">
        <NavButton
          click={closeToc}
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
          click={openToc}
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
