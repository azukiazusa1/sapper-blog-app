<script lang="ts">
  export let title: string;
  export let slug: string;
  export let views: string;
  export let isTestBuild: boolean;

  const href = isTestBuild ? `/blog` : `/blog/${slug}`;
</script>

<a
  {href}
  class="block rounded-lg border border-gray-200 bg-white px-6 py-4 shadow hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700"
>
  <h3
    class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
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
