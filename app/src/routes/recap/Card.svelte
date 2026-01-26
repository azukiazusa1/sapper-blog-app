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
  class="block rounded-lg border border-gray-200 bg-white px-6 py-4 shadow-sm hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
>
  <h3
    class="mb-2 text-xl font-bold tracking-tight text-gray-900 md:text-2xl dark:text-white"
  >
    {title}
  </h3>
  <p class="font-normal text-gray-700 dark:text-gray-400">{views} Views</p>
</a>

<style>
  h3 {
    word-break: auto-phrase;
  }
</style>
