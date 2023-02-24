<script lang="ts">
  import Link from './Link.svelte'

  export let slot: string
  export let href: string | undefined = undefined
  export let target: '_blank' | '_self' | '_parent' | '_top' | undefined = undefined
</script>

<Link {href} {target}>
  {slot}
</Link>
