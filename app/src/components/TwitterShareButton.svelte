<script lang="ts">
  import { m } from "$paraglide/messages";
  import TwitterIcon from "./Icons/Twitter.svelte";
  interface Props {
    url: string;
    text: string;
  }

  let { url, text }: Props = $props();

  let escapedText = $derived(encodeURIComponent(text));
  let escapedUrl = $derived(encodeURIComponent(url));
</script>

<a
  href={`https://x.com/intent/tweet?url=${escapedUrl}&text=${escapedText}`}
  target="_blank"
  rel="noopener noreferrer"
>
  <span class="sr-only">{m.shareOnX()}</span>
  <TwitterIcon className="h-6 w-6 text-black dark:text-white" />
</a>
