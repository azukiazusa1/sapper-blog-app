<script lang="ts">
  import ShortCard from "./ShortCard.svelte";
  export let slot = "";
  export let title: string;
  export let id: string;
</script>

<ShortCard {title} {id}>
  {slot}
</ShortCard>
