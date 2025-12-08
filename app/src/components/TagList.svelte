<script lang="ts">
  interface Tag {
    name: string;
    slug: string;
  }

  interface Props {
    tags: Tag[];
  }

  let { tags }: Props = $props();

  let scrollContainer: HTMLDivElement | null = $state(null);
  let showLeftArrow = $state(false);
  let showRightArrow = $state(false);
  let isHovered = $state(false);

  function updateArrows() {
    if (!scrollContainer) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
    showLeftArrow = scrollLeft > 0;
    showRightArrow = scrollLeft < scrollWidth - clientWidth - 1;
  }

  function scrollLeft() {
    if (!scrollContainer) return;
    scrollContainer.scrollBy({ left: -300, behavior: "smooth" });
  }

  function scrollRight() {
    if (!scrollContainer) return;
    scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
  }

  $effect(() => {
    if (!scrollContainer) return;

    updateArrows();

    const handleScroll = () => updateArrows();
    const handleResize = () => updateArrows();

    scrollContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  });
</script>

<div class="container mx-auto">
  <div
    class="relative"
    role="region"
    aria-label="タグ一覧"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
  >
    <div class="overflow-x-auto no-scrollbar" bind:this={scrollContainer}>
      <div class="flex gap-3 w-max pr-20">
        {#each tags as tag}
          <div class="flex-shrink-0">
            <a
              href={`/tags/${tag.slug}`}
              class="inline-flex items-center rounded-full bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors border border-gray-200 dark:border-zinc-600"
            >
              #{tag.name}
            </a>
          </div>
        {/each}
      </div>
    </div>

    {#if isHovered && showLeftArrow}
      <button
        onclick={scrollLeft}
        class="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all z-10 border border-gray-200 dark:border-zinc-600"
        aria-label="Scroll left"
      >
        <svg
          class="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    {/if}

    {#if isHovered && showRightArrow}
      <button
        onclick={scrollRight}
        class="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-800 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all z-10 border border-gray-200 dark:border-zinc-600"
        aria-label="Scroll right"
      >
        <svg
          class="w-6 h-6 text-gray-700 dark:text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    {/if}
  </div>
</div>

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
</style>
