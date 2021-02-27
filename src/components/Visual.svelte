<script lang="ts">
  export let image: string
  export let title: string
</script>

<div class="w-full bg-center bg-cover h-72 md:h-96 rounded-lg" style={`background-image: url(${image});`}>
  <div class="flex items-center justify-center w-full h-full">
    <div class="text-center">
      <h1 class="text-2xl italic tracking-wider font-semibold text-white uppercase md:text-3xl">{title}</h1>
    </div>
  </div>
</div>
<div class="text-right mt-2">
  <span class="text-sm">
    <a
      class="underline hover:opacity-75"
      href="https://pixabay.com/photos/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984251"
      target="_blank"
    >
      Free-Photos
    </a>による
    <a
      class="underline hover:opacity-75"
      href="https://pixabay.com/ja/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984251"
      target="_blank"
    >
      Pixabay
    </a>からの画像
  </span>
</div>
