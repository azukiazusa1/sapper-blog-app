<script lang="ts">
  import Tag from './Tag.svelte'
  import Badge from '../Badge/Badge.svelte'

  export let name = ''
  export let slug = ''
</script>

<Tag {name} {slug}>
  <Badge>3</Badge>
</Tag>
