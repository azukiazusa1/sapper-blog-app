<script lang="ts">
  import Avatar from "../Avatar/Avatar.svelte";
  import type { Contributor } from "../../repositories/GitHub";

  interface Props {
    contributors: Contributor[];
  }

  let { contributors }: Props = $props();
</script>

<div class="flex h-full flex-col">
  <h2 class="mb-4 text-lg font-bold">Contributors</h2>
  <div class="flex flex-wrap items-center gap-4">
    {#each contributors as contributor (contributor.username)}
      <a href={contributor.url} target="_blank" rel="noopener noreferrer">
        <Avatar src={contributor.avatar} alt={contributor.username} />
      </a>
    {/each}
  </div>
</div>
