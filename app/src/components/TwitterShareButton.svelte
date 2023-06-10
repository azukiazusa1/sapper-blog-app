<script lang="ts">
  import TwitterIcon from "./Icons/Twitter.svelte";
  export let url: string;
  export let text: string;
</script>

<TwitterIcon
  className="h-6 w-6"
  href={`https://twitter.com/share?url=${url}&text=${text}`}
  target="_blank"
/>
