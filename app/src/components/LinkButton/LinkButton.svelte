<script lang="ts">
  import clsx from "clsx";
  import { localizeHref } from "$paraglide/runtime";
  interface Props {
    variant?: "primary" | "secondary" | "transparent";
    href: string;
    target?: string | undefined;
    rel?: string | undefined;
    children?: import("svelte").Snippet;
  }

  let {
    variant = "secondary",
    href,
    target = undefined,
    rel = undefined,
    children,
  }: Props = $props();

  const getHref = (value: string) =>
    value.startsWith("/") ? localizeHref(value) : value;
</script>

<a
  href={getHref(href)}
  {target}
  {rel}
  class={clsx(
    "inline-flex items-center justify-center rounded px-4 py-2 text-center text-base font-medium transition-colors",
    {
      "border border-stone-300 text-stone-900 dark:border-stone-600 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800":
        variant === "secondary",
      "text-white hover:opacity-80": variant === "primary",
      "bg-transparent border border-stone-300 text-stone-700 dark:border-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800":
        variant === "transparent",
    },
  )}
  style={variant === "primary" ? "background-color: var(--color-accent)" : ""}
>
  {@render children?.()}
</a>
