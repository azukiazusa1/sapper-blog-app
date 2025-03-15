<script lang="ts">
  import clsx from "clsx";
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
</script>

<a
  {href}
  {target}
  {rel}
  class={clsx(
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-center text-base font-medium transition-all hover:opacity-80",
    {
      "border border-gray-300 text-gray-900  dark:border-zinc-600 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-zinc-700":
        variant === "secondary",
      "bg-indigo-700 text-white  focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700":
        variant === "primary",
      "bg-transparent text-white border-white/20 dark:border-zinc-700 dark:text-gray-50 border hover:opacity-70":
        variant === "transparent",
    },
  )}
>
  {@render children?.()}
</a>
