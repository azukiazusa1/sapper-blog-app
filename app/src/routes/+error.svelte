<script lang="ts">
  import { page } from "$app/stores";

  $: title =
    $page.error.message === "Not Found" ? "404" : "500 Internal Server Error";
  $: message =
    $page.error.message === "Not Found"
      ? "お探しのページは見つかりませんでした。削除、変更されたか URL が間違っている可能性がございます。"
      : "予期せぬエラーが発生しました。";
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>

<div class="mx-auto max-w-5xl pb-20 pt-10">
  <div class="flex min-h-full flex-col items-center justify-between">
    <div class="mb-20">
      <h1 class="text-center text-6xl font-bold italic tracking-wide">
        {title}
      </h1>
      <p
        class="mb-6 mt-4 max-w-2xl font-light leading-relaxed text-gray-500 dark:text-gray-300 md:text-lg lg:mb-8 lg:text-xl"
      >
        {message}
      </p>
    </div>
    <div>
      <a
        href="/"
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-700"
      >
        トップに戻る
      </a>
    </div>
  </div>
</div>
