<script lang="ts">
  import ShareIcon from "./Icons/Share.svelte";
  import { browser } from "$app/environment";

  interface Props {
    text: string;
    url: string;
    fallback?: import('svelte').Snippet;
  }

  let { text, url, fallback }: Props = $props();

  // Twitter でシェアしやすいように 140 文字に制限
  let trucatedText = $derived(text.length > 140 ? `${text.slice(0, 137)}...` : text);

  const share = async () => {
    if (!navigator.share) return;
    await navigator
      .share({ title: trucatedText, text: trucatedText, url })
      .catch(() => {
        // noop
      });
  };

  let supportNavigationShare = $derived(browser && "share" in navigator);
</script>

{#if supportNavigationShare}
  <button
    type="button"
    class="group inline-flex h-9 items-center whitespace-nowrap rounded-full bg-gray-200 px-3 text-sm font-semibold dark:bg-neutral-700"
    onclick={share}
  >
    <ShareIcon className="h-6 w-6 mr-2" />
    <span>Share</span>
  </button>
{:else}
  {@render fallback?.()}
{/if}
