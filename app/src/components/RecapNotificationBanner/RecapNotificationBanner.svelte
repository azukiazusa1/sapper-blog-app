<script lang="ts">
  import { onMount } from "svelte";

  const STORAGE_KEY = "recap-2025-banner-dismissed";

  // Start dismissed to prevent flash during SSR/hydration
  let isDismissed = $state(true);

  onMount(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      isDismissed = false;
    }
  });

  function handleDismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    isDismissed = true;
  }
</script>

<div class="w-full">
  <div
    class={`flex items-center justify-center gap-4 px-4 py-3 bg-indigo-500 dark:bg-indigo-600 shadow-md transition-all duration-300 relative ${isDismissed ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"}`}
  >
    <div class="flex items-center gap-2 text-sm md:text-base">
      <span class="text-white"> 2025年のRecapが公開されました! </span>
      <a
        href="/recap/2025"
        class="font-semibold text-white hover:text-indigo-100 underline transition-colors"
      >
        見る →
      </a>
    </div>
    <button
      onclick={handleDismiss}
      class="absolute right-4 rounded-full p-1.5 hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
      aria-label="通知を閉じる"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</div>
