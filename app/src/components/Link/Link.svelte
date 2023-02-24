<script lang="ts">
  export let href: string | undefined = undefined
  export let target: '_blank' | '_self' | '_parent' | '_top' | undefined = undefined
</script>

<a
  class="dark:text-blue-300 text-blue-500 hover:underline inline-flex items-center"
  {href}
  {target}
  rel={target === '_blank' ? 'noopener noreferrer' : undefined}
>
  <slot />
</a>
