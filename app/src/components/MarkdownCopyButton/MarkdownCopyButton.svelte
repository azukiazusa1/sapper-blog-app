<script lang="ts">
  import { onMount } from "svelte";

  interface Props {
    slug: string;
    contents: string;
  }

  let { slug, contents }: Props = $props();

  let showMenu = $state(false);
  let copied = $state(false);
  let button: HTMLButtonElement;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function closeMenu() {
    showMenu = false;
  }

  function copyMarkdown() {
    navigator.clipboard.writeText(contents);
    closeMenu();

    // コピー成功のフィードバック
    copied = true;
    setTimeout(() => {
      copied = false;
    }, 2000);
  }

  function openMarkdown() {
    window.open(`/blog/${slug}.md`, "_blank");
    closeMenu();
  }

  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      if (button && !button.contains(event.target as Node)) {
        closeMenu();
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  });
</script>

<div class="relative inline-block">
  <div class="flex">
    <button
      onclick={copyMarkdown}
      class="flex items-center gap-2 rounded-l-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 {copied
        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}"
    >
      {#if copied}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
        コピー完了
      {:else}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="h-4 w-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
          />
        </svg>
        マークダウンでコピー
      {/if}
    </button>
    <button
      bind:this={button}
      onclick={toggleMenu}
      aria-label="メニューを開く"
      class="rounded-r-lg border-l px-2 py-2 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 {copied
        ? 'border-green-500 bg-green-600 hover:bg-green-700 focus:ring-green-500'
        : 'border-indigo-500 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-4 w-4 transition-transform duration-200 {showMenu
          ? 'rotate-180'
          : ''}"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </button>
  </div>

  {#if showMenu}
    <div
      class="absolute right-0 top-full z-10 mt-1 w-48 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-zinc-800 dark:ring-zinc-700"
    >
      <div class="py-1">
        <button
          onclick={copyMarkdown}
          class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
        >
          {#if copied}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4 text-green-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            コピー完了
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
              />
            </svg>
            マークダウンをコピー
          {/if}
        </button>
        <button
          onclick={openMarkdown}
          class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-4 w-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
            />
          </svg>
          別タブで開く
        </button>
      </div>
    </div>
  {/if}
</div>
