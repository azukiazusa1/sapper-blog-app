<script lang="ts">
  import FloatingActionButton from './FloatingActionButton.svelte'

  export let slot: string
</script>

<FloatingActionButton>
  {slot}
</FloatingActionButton>
