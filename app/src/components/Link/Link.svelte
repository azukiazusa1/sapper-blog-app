<script lang="ts">
  interface Props {
    href?: string | undefined;
    target?: "_blank" | "_self" | "_parent" | "_top" | undefined;
    children?: import('svelte').Snippet;
  }

  let { href = undefined, target = undefined, children }: Props = $props();
</script>

<a
  class="inline-flex items-center text-indigo-700 hover:underline dark:text-indigo-400"
  {href}
  {target}
  rel={target === "_blank" ? "noopener noreferrer" : undefined}
>
  {@render children?.()}
</a>
