<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  const articles = [
    {
      title: "Remix の SPA モード",
      views: 15933,
      url: "/blog/remix-spa-mode/",
    },
    {
      title: "フルスタック Web フレームワーク HonoX を使ってみる",
      views: 13607,
      url: "/blog/full-stack-web-framework-honox/",
    },
    {
      title: "Tailwind CSS を使う時に一緒に入れたいライブラリ",
      views: 12667,
      url: "/blog/tailwind-css-libs/",
    },
  ];

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<div class="space-y-4">
  {#each articles as post, index}
    {#if mounted}
      <a
        href={post.url}
        in:fly={{
          x: 100,
          delay: index * 400,
        }}
        class="block rounded-lg bg-gray-200 p-2 hover:bg-gray-300 md:p-4"
      >
        <h3 class="font-bold">{post.title}</h3>
        <p class="mt-2 text-sm text-gray-700">
          {post.views.toLocaleString()} views
        </p>
      </a>
    {/if}
  {/each}
</div>
