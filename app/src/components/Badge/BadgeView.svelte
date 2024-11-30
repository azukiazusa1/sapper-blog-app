<script lang="ts">
  import Badge from "./Badge.svelte";

  interface Props {
    slot: string;
  }

  let { slot }: Props = $props();
</script>

<Badge>
  {slot}
</Badge>
