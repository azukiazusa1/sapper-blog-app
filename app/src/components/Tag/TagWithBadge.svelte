<script lang="ts">
  import Tag from "./Tag.svelte";
  import Badge from "../Badge/Badge.svelte";

  interface Props {
    name?: string;
    slug?: string;
  }

  let { name = "", slug = "" }: Props = $props();
</script>

<Tag {name} {slug}>
  <Badge>3</Badge>
</Tag>
