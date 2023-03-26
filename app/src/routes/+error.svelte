<script lang="ts">
  import { page } from '$app/stores'

  $: title = $page.error.message === 'Not Found' ? '404' : '500 Internal Server Error'
  $: message =
    $page.error.message === 'Not Found'
      ? 'お探しのページは見つかりませんでした。削除、変更されたか URL が間違っている可能性がございます。'
      : '予期せぬエラーが発生しました。'
</script>

<svelte:head>
  <title>
    {title}
  </title>
</svelte:head>

<div class="pt-10 pb-20 max-w-5xl mx-auto">
  <div class="flex flex-col items-center justify-between min-h-full">
    <div class="mb-20">
      <h1 class="font-bold text-6xl italic tracking-wide text-center">{title}</h1>
      <p
        class="max-w-2xl mt-4 mb-6 font-light text-gray-500 leading-relaxed lg:mb-8 md:text-lg lg:text-xl dark:text-gray-300"
      >
        {message}
      </p>
    </div>
    <div>
      <a
        href="/"
        class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 dark:text-white dark:border-zinc-700 dark:hover:bg-zinc-700"
      >
        トップに戻る
      </a>
    </div>
  </div>
</div>
