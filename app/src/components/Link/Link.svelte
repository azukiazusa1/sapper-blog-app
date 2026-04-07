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
  class="inline-flex items-center hover:underline"
  style="color: var(--color-accent)"
  href={href ? getHref(href) : undefined}
  {target}
  rel={target === "_blank" ? "noopener noreferrer" : undefined}
>
  {@render children?.()}
</a>
