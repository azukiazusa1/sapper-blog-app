<script lang="ts">
  import GitHubIcon from "./Icons/GitHub.svelte";
  export let slug: string;
</script>

<a
  href={`https://github.com/azukiazusa1/sapper-blog-app/tree/main/contents/blogPost/${slug}.md`}
  target="_blank"
  rel="noopener noreferrer"
  class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-center text-base font-medium text-gray-900 hover:bg-gray-100 dark:border-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-700"
>
  <GitHubIcon className="h6 w-6 mr-2" />
  GitHub で修正を提案する
</a>
