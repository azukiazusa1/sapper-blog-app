<script lang="ts">
  import HatenaBookmarkIcon from "../assets/hatenabookmark_symbolmark.png";

  export let url: string;
  export let text: string;

  $: href = `https://b.hatena.ne.jp/add?mode=confirm&url=${url}&title=${text}`;
</script>

<a {href} target="_blank" rel="noopener noreferrer">
  <img
    src={HatenaBookmarkIcon}
    alt="はてなブックマークに追加"
    class="h-6 w-6"
  />
</a>
