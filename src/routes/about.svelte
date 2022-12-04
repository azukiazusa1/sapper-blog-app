<script>
  import author from '../assets/images/azukiazusa.jpeg'
  const content =
    'このブログはSvelteKit + Contentful + Vercelによって作成されています。学んだ技術についてつらつらと書いてきます。毎週日曜日夜くらいに更新されます。JavaScript/TypeScript/Vue.js/React/Svelte/PHP/Laravel/CakePHPあたり。趣味は読書と麻雀。'
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" {content} />
</svelte:head>

<section>
  <div class="container px-5 mx-auto flex flex-col">
    <div class="w-full">
      <div class="flex flex-col sm:flex-row mt-10">
        <div class="sm:w-1/3 text-center sm:pr-8 sm:py-8">
          <div class="inline-flex items-center justify-center">
            <img class="object-cover w-24 h-24 mx-2 rounded-full" alt="author" src={author} />
          </div>
          <div class="flex flex-col items-center text-center justify-center">
            <h2 class="font-medium mt-4 text-lg">azukiazusa1</h2>
            <div class="w-12 h-1 bg-theme rounded mt-2 mb-4" />
            <p class="text-base">
              <a class="underline hover:opacity-75" target="_blank" href="https://qiita.com/azukiazusa">Qiita</a>&nbsp;/
              <a class="underline hover:opacity-75" target="_blank" href="https://zenn.dev/azukiazusa">Zenn</a>&nbsp;/
              <a class="underline hover:opacity-75" target="_blank" href="https://github.com/azukiazusa1">GitHub</a>
            </p>
            <p class="mt-2">3年目のエンジニアです。</p>
          </div>
        </div>
        <div
          class="sm:w-2/3 sm:pl-8 sm:py-8 sm:border-l border-gray-200 sm:border-t-0 border-t mt-4 pt-4 sm:mt-0 sm:text-left"
        >
          <p class="leading-relaxed text-lg mb-4 break-words">
            {content}
          </p>
          <a class="dark:text-indigo-400  text-indigo-800 inline-flex items-center" href="blog"
            >記事を読む
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="w-4 h-4 ml-2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .bg-theme {
    background-color: rgb(255, 62, 0);
  }
</style>
