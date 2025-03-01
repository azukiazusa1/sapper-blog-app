<script lang="ts">
  import ShortCard from "./ShortCard.svelte";
  interface Props {
    slot?: string;
    title: string;
    id: string;
  }

  let { slot = "", title, id }: Props = $props();
</script>

<ShortCard {title} {id}>
  {slot}
</ShortCard>
