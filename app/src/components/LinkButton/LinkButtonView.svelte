<script lang="ts">
  import LinkButton from "./LinkButton.svelte";

  export let slot: string;
  export let variant: "primary" | "secondary" = "secondary";
</script>

<LinkButton href="#" {variant}>
  {slot}
</LinkButton>
