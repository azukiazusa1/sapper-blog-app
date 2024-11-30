<script lang="ts">
  import LinkButton from "./LinkButton.svelte";

  interface Props {
    slot: string;
    variant?: "primary" | "secondary";
  }

  let { slot, variant = "secondary" }: Props = $props();
</script>

<LinkButton href="#" {variant}>
  {slot}
</LinkButton>
