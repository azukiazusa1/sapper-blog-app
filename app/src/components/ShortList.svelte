<script lang="ts">
  import type { Short } from "../generated/graphql";
  import ShortCard from "./ShortCard/ShortCard.svelte";

  export let shorts: (Pick<
    Short,
    "title" | "content1" | "content2" | "content3" | "content4" | "createdAt"
  > & { sys: { id: string } })[] = [];
</script>

<div class="flex gap-8 overflow-x-auto p-4">
  {#each shorts as short (short.sys.id)}
    <ShortCard id={short.sys.id} title={short.title}>
      {short.content1}
    </ShortCard>
  {/each}
</div>
