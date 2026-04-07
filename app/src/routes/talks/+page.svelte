<script lang="ts">
  import { m } from "$paraglide/messages";
  import TalkTimelines from "../../components/TalkTimelines.svelte";
</script>

<svelte:head>
  <title>{m.talksTitle()} | {m.siteTitle()}</title>
  <meta name="description" content={m.talksDescription()} />
</svelte:head>

<div
  class="w-full bg-stone-900 dark:bg-stone-900 py-16 mb-16 border-b border-stone-800 dark:border-stone-700"
>
  <div class="container mx-auto px-4">
    <h1
      class="text-center text-4xl font-bold text-white mb-6"
      style="font-family: var(--font-display)"
    >
      {m.talksTitle()}
    </h1>
    <p class="text-center text-base text-stone-400 max-w-2xl mx-auto mb-10">
      {m.talksDescription()}
    </p>
  </div>
</div>

<div class="container mx-auto px-4 max-w-7xl">
  <div class="max-w-5xl mx-auto">
    <TalkTimelines />
  </div>
</div>
