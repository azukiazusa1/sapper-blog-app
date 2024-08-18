<script>
  import variables from "$lib/variables";
  import Avatar from "../../components/Avatar/Avatar.svelte";
  import author from "../../assets/images/azukiazusa.jpeg";
  import LinkButton from "../../components/LinkButton/LinkButton.svelte";
  const content =
    "このブログはSvelteKit + Contentful + Cloudflare Pages によって作成されています。学んだ技術についてつらつらと書いてきます。毎週日曜日夜くらいに更新されます。フロントエンドの技術が好き。趣味は読書と麻雀とポーカー。";
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
                href="https://x.com/azukiazusa9">X</a
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
          <LinkButton variant="primary" href="/blog">
            ブログを読む
            <svg
              class="-mr-1 ml-2 h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              /></svg
            >
          </LinkButton>
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
