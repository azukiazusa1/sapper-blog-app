<script lang="ts">
  interface Props {
    title: string;
    slug: string;
    views: string;
    isTestBuild: boolean;
  }

  let { title, slug, views, isTestBuild }: Props = $props();

  const href = $derived(isTestBuild ? `/blog` : `/blog/${slug}`);
</script>

<a
  {href}
  class="block rounded-lg border border-stone-200 bg-white px-6 py-4 shadow-sm hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:hover:bg-stone-700"
>
  <h3
    class="mb-2 text-xl font-bold tracking-tight text-stone-900 md:text-2xl dark:text-white"
  >
    {title}
  </h3>
  <p class="font-normal text-stone-700 dark:text-stone-400">{views} Views</p>
</a>

<style>
  h3 {
    word-break: auto-phrase;
  }
</style>
