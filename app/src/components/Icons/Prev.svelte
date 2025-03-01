<script lang="ts">
  interface Props {
    className?: string;
  }

  let { className = "" }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="100%"
  height="100%"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class={className}
>
  <polyline points="15 18 9 12 15 6" />
</svg>
