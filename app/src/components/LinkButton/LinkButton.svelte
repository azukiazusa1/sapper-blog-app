<script lang="ts">
  import clsx from "clsx";
  export let variant: "primary" | "secondary" = "secondary";
  export let href: string;
  export let target: string | undefined = undefined;
  export let rel: string | undefined = undefined;
</script>

<a
  {href}
  {target}
  {rel}
  class={clsx(
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-center text-base font-medium",
    {
      "border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-zinc-600 dark:text-gray-50 dark:hover:bg-zinc-700":
        variant === "secondary",
      "bg-indigo-700 text-white hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900":
        variant === "primary",
    },
  )}
  >a
  <slot />
</a>
