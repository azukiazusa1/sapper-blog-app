<script lang="ts">
  import GitHubIcon from "./Icons/GitHub.svelte";
  import LinkButton from "./LinkButton/LinkButton.svelte";
  export let slug: string;
</script>

<LinkButton
  href={`https://github.com/azukiazusa1/sapper-blog-app/tree/main/contents/blogPost/${slug}.md`}
  target="_blank"
  rel="noopener noreferrer"
>
  <GitHubIcon className="h6 w-6 mr-2" />
  GitHub で修正を提案する
</LinkButton>
