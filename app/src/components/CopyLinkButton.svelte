<script lang="ts">
  import { m } from "$paraglide/messages";

  interface Props {
    url: string;
    label?: string;
  }

  let { url, label = m.shortShareLink() }: Props = $props();

  let copied = $state(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    copied = true;

    setTimeout(() => {
      copied = false;
    }, 2000);
  };
</script>

<button
  type="button"
  class="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
  onclick={copyLink}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="h-4 w-4"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M7.5 12h9m-9 4.5h6.75M6 3.75h7.5a2.25 2.25 0 012.25 2.25v12A2.25 2.25 0 0113.5 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75z"
    />
  </svg>
  <span>{copied ? m.shortLinkCopied() : label}</span>
</button>
