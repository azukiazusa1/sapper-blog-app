<script lang="ts">
  import { localizeHref } from "$paraglide/runtime";

  interface Props {
    href?: string | undefined;
    target?: "_blank" | "_self" | "_parent" | "_top" | undefined;
    children?: import("svelte").Snippet;
  }

  let { href = undefined, target = undefined, children }: Props = $props();

  const getHref = (value: string) =>
    value.startsWith("/") ? localizeHref(value) : value;
</script>

<a
  class="inline-flex items-center font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors hover:decoration-current dark:text-stone-100 dark:decoration-stone-600"
  href={href ? getHref(href) : undefined}
  {target}
  rel={target === "_blank" ? "noopener noreferrer" : undefined}
>
  {@render children?.()}
</a>
