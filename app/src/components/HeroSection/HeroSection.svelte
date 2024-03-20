<script lang="ts">
  import Heroimage from "../../assets/images/heroImage.png";
  import Link from "../Link/Link.svelte";
  import LinkButton from "../LinkButton/LinkButton.svelte";
</script>

<section>
  <div
    class="mx-auto grid max-w-screen-xl px-4 py-6 lg:grid-cols-12 lg:gap-8 xl:gap-0"
  >
    <div class="mr-auto place-self-center lg:col-span-7">
      <h1
        class="mb-4 max-w-2xl text-4xl font-extrabold leading-none md:text-5xl xl:text-6xl dark:text-white"
      >
        Hey, I'm <span class="text-indigo-600 dark:text-indigo-400"
          >azukiazusa</span
        >👋
      </h1>
      <p
        class="mb-6 max-w-2xl font-light leading-relaxed text-gray-500 md:text-lg lg:mb-8 lg:text-xl dark:text-gray-300"
      >
        週に1回 Web
        開発に関する記事をお届けします。フロントエンドに関する分野の記事が中心です。
      </p>
      <div class="flex gap-3">
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
        <LinkButton href="/about">About me</LinkButton>
      </div>
    </div>
    <div class="hidden lg:col-span-5 lg:mt-0 lg:flex">
      <picture>
        <source
          media="(min-width: 1024px)"
          srcset={Heroimage}
          width="400"
          height="400"
        />
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          alt=""
          width="1"
          height="1"
        />
      </picture>
    </div>
  </div>
</section>
