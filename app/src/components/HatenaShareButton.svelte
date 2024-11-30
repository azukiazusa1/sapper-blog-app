<script lang="ts">
  import HatenaBookmarkIcon from "../assets/images/hatenabookmark_symbolmark.png";

  interface Props {
    url: string;
    text: string;
  }

  let { url, text }: Props = $props();

  let href = $derived(`https://b.hatena.ne.jp/add?mode=confirm&url=${url}&title=${text}`);
</script>

<a {href} target="_blank" rel="noopener noreferrer">
  <img
    src={HatenaBookmarkIcon}
    alt="はてなブックマークに追加"
    class="h-6 w-6"
  />
</a>
