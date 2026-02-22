<script lang="ts">
  import type { TocItem } from "$lib/server/markdownToHtml";
  import { onMount } from "svelte";

  interface Props {
    items: TocItem[];
    highlight?: boolean;
  }

  let { items, highlight = true }: Props = $props();

  let isOpen = $state(true);
  let activeId = $state("");

  onMount(() => {
    const stored = localStorage.getItem("toc-state");
    isOpen = stored !== "close";
  });

  onMount(() => {
    if (!highlight) return;

    const headingIds = items.map((item) => item.id);
    const headingElements = headingIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        }
      },
      { rootMargin: "0px 0px -80% 0px", threshold: 0 },
    );

    for (const el of headingElements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  });

  function toggle() {
    isOpen = !isOpen;
    localStorage.setItem("toc-state", isOpen ? "open" : "close");
    if (isOpen) {
      document.documentElement.classList.add("open-toc");
    } else {
      document.documentElement.classList.remove("open-toc");
    }
  }

  function indent(level: number): string {
    if (level === 2) return "";
    if (level === 3) return "pl-4";
    return "pl-8";
  }
</script>

<div class="toc-wrapper">
  <button
    onclick={toggle}
    class="toc-toggle"
    aria-label={isOpen ? "目次を閉じる" : "目次を開く"}
    aria-expanded={isOpen}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4 6h16M4 12h16M4 18h7"
      />
    </svg>
    <span class="text-sm font-medium">目次</span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-3 w-3 transition-transform duration-200"
      class:rotate-180={!isOpen}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>

  {#if isOpen}
    <nav class="toc-nav" aria-label="目次">
      <ol class="toc-list">
        {#each items as item (item.id)}
          <li class={indent(item.level)}>
            <a
              href="#{item.id}"
              class="toc-link"
              class:toc-link--active={highlight && activeId === item.id}
              class:text-sm={item.level >= 3}
            >
              {item.text}
            </a>
          </li>
        {/each}
      </ol>
    </nav>
  {/if}
</div>
