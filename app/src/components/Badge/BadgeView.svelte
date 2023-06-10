<script lang="ts">
  import Badge from "./Badge.svelte";

  export let slot: string;
</script>

<Badge>
  {slot}
</Badge>
