<script lang="ts">
  import ShareIcon from './Icons/Share.svelte'
  import { browser } from '$app/environment'

  export let text: string
  export let url: string

  // Twitter でシェアしやすいように 140 文字に制限
  $: trucatedText = text.length > 140 ? `${text.slice(0, 137)}...` : text

  const share = async () => {
    if (!navigator.share) return
    await navigator.share({ title: trucatedText, text: trucatedText, url }).catch(() => {
      // noop
    })
  }

  $: supportNavigationShare = browser && 'share' in navigator
</script>

{#if supportNavigationShare}
  <button
    type="button"
    class="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 bg-gray-200 dark:bg-neutral-700"
    on:click={share}
  >
    <ShareIcon className="h-6 w-6 mr-2" />
    <span>Share</span>
  </button>
{:else}
  <slot name="fallback" />
{/if}
