<script lang="ts">
  export let url: string
  export let text: string

  $: href = `https://b.hatena.ne.jp/add?mode=confirm&url=${url}&title=${text}`
</script>

<a {href} target="_blank" rel="noopener noreferrer">
  <img src="https://b.st-hatena.com/images/v4/public/entry-button/button-only.png" alt="Hatena" class="h-6 w-6" />
</a>
