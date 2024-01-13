<script>
  import variables from "$lib/variables";
  import Avatar from "../../components/Avatar/Avatar.svelte";
  import author from "../../assets/images/azukiazusa.jpeg";
  import Link from "../../components/Link/Link.svelte";
  const content =
    "このブログはSvelteKit + Contentful + Vercelによって作成されています。学んだ技術についてつらつらと書いてきます。毎週日曜日夜くらいに更新されます。JavaScript/TypeScript/Vue.js/React/Svelte/PHP/Laravel/CakePHPあたり。趣味は読書と麻雀。";
</script>

<svelte:head>
  <title>About</title>
  <meta name="description" {content} />
  <link rel="canonical" href={`${variables.baseURL}/about`} />
</svelte:head>

<section>
  <div class="container mx-auto flex flex-col px-5">
    <div class="w-full">
      <div class="mt-10 flex flex-col sm:flex-row">
        <div class="text-center sm:w-1/3 sm:py-8 sm:pr-8">
          <div class="inline-flex items-center justify-center">
            <Avatar size="lg" alt="azukiazusa1" src={author} />
          </div>
          <div class="flex flex-col items-center justify-center text-center">
            <h2 class="mt-4 text-lg font-medium">azukiazusa1</h2>
            <div class="bg-theme mb-4 mt-2 h-1 w-12 rounded" />
            <p class="text-base">
              <a
                class="underline hover:opacity-75"
                target="_blank"
                rel="noreferrer noopener"
                href="https://twitter.com/azukiazusa9">Twitter</a
              >&nbsp;/
              <a
                class="underline hover:opacity-75"
                target="_blank"
                rel="noreferrer noopener"
                href="https://github.com/azukiazusa1">GitHub</a
              >&nbsp;/
              <a
                class="underline hover:opacity-75"
                target="_blank"
                rel="noreferrer noopener"
                href="https://zenn.dev/azukiazusa">Zenn</a
              >&nbsp;/
              <a
                class="underline hover:opacity-75"
                target="_blank"
                rel="noreferrer noopener"
                href="https://qiita.com/azukiazusa">Qiita</a
              >
            </p>
            <p class="mt-2">3年目のエンジニアです。</p>
          </div>
        </div>
        <div
          class="mt-4 border-t border-gray-300 pt-4 sm:mt-0 sm:w-2/3 sm:border-l sm:border-t-0 sm:py-8 sm:pl-8 sm:text-left dark:border-zinc-700"
        >
          <p class="mb-4 break-words text-lg leading-relaxed">
            {content}
          </p>
          <Link href="/blog">
            記事を読む
            <svg
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="ml-2 h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
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
