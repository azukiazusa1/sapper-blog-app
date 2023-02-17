<script lang="ts">
  import Heroimage from '../../assets/images/heroImage.png'
</script>

<section class="bg-white dark:bg-gray-700 rounded-lg shadow-lg">
  <div class="grid max-w-screen-xl px-4 py-6 mx-auto lg:gap-8 xl:gap-0 lg:grid-cols-12">
    <div class="mr-auto place-self-center lg:col-span-7">
      <h1 class="max-w-2xl mb-4 text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white">
        Hey, I'm <span class="text-indigo-600 dark:text-indigo-400">azukiazusa</span>👋
      </h1>
      <p
        class="max-w-2xl mb-6 font-light text-gray-500 leading-relaxed lg:mb-8 md:text-lg lg:text-xl dark:text-gray-300"
      >
        週に1回 Web 開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。
      </p>
      <a
        href="/blog"
        class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
      >
        ブログを読む
        <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
          ><path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          /></svg
        >
      </a>
      <a
        href="/about"
        class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-gray-800 dark:focus:ring-gray-900"
      >
        About me
      </a>
    </div>
    <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
      <img src={Heroimage} alt="" width="400" height="400" />
    </div>
  </div>
</section>
