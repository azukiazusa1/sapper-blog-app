<script lang="ts">
  import TwitterIcon from "./Icons/Twitter.svelte";
  export let url: string;
  export let text: string;
</script>

<a href={`https://twitter.com/share?url=${url}&text=${text}`} target="_blank" rel="noopener noreferrer">
  <span class="sr-only">Xで共有</span>
    <TwitterIcon
      className="h-6 w-6 text-black dark:text-white"
    />
</a>
