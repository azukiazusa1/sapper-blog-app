<script lang="ts">
  import Box from '../Box/Box.svelte'
  import Avatar from '../Avatar/Avatar.svelte'
  import type { Contributor } from '../../repositories/GitHub'

  export let contributors: Contributor[]
</script>

<Box>
  <h2 class="text-lg font-bold mb-2">Contributors</h2>
  <div class="flex items-center gap-4">
    {#each contributors as contributor (contributor.username)}
      <a href={contributor.url} target="_blank" rel="noopener noreferrer">
        <Avatar src={contributor.avatar} alt={contributor.username} />
      </a>
    {/each}
  </div>
</Box>
