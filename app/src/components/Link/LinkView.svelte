<script lang="ts">
  import Link from "./Link.svelte";

  interface Props {
    slot: string;
    href?: string | undefined;
    target?: "_blank" | "_self" | "_parent" | "_top" | undefined;
  }

  let { slot, href = undefined, target = undefined }: Props = $props();
</script>

<Link {href} {target}>
  {slot}
</Link>
