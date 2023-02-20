<script lang="ts">
  import ShareIcon from './Icons/Share.svelte'
  import { browser } from '$app/environment'

  export let text: string
  export let url: string

  // Twitter でシェアしやすいように 140 文字に制限
  $: trucatedText = `${text.slice(0, 135)}...`

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
    class="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-3 focus:outline-none focus:ring-2 bg-gray-100 text-slate-900 hover:bg-gray-200 focus:ring-gray-500 dark:bg-gray-600 dark:text-gray-50 dark:hover:bg-gray-500 dark:focus:ring-gray-400"
    on:click={share}
  >
    <ShareIcon className="h-6 w-6 mr-2" />
    <span>Share</span>
  </button>
{:else}
  <slot name="fallback" />
{/if}
