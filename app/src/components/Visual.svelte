<script lang="ts">
  export let image: string;
  export let title: string;
</script>

<div
  class="h-72 w-full rounded-lg bg-cover bg-center md:h-96"
  style={`background-image: url(${image});`}
>
  <div class="flex h-full w-full items-center justify-center">
    <div class="text-center">
      <h1
        class="text-2xl font-semibold uppercase italic tracking-wider text-white md:text-3xl"
      >
        {title}
      </h1>
    </div>
  </div>
</div>
<div class="mt-2 text-right">
  <span class="text-sm">
    <a
      class="underline hover:opacity-75"
      href="https://pixabay.com/photos/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984251"
      target="_blank"
      rel="noreferrer noopener"
    >
      Free-Photos
    </a>による
    <a
      class="underline hover:opacity-75"
      href="https://pixabay.com/ja/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=984251"
      target="_blank"
      rel="noreferrer noopener"
    >
      Pixabay
    </a>からの画像
  </span>
</div>
