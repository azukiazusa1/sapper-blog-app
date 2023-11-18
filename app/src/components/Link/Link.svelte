<script lang="ts">
  export let href: string | undefined = undefined;
  export let target: "_blank" | "_self" | "_parent" | "_top" | undefined =
    undefined;
</script>

<a
  class="inline-flex items-center text-indigo-700 hover:underline dark:text-indigo-400"
  {href}
  {target}
  rel={target === "_blank" ? "noopener noreferrer" : undefined}
>
  <slot />
</a>
