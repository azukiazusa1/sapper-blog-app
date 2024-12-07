<script lang="ts">
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  const articles = [
    {
      title: "Remix の SPA モード",
      views: 15544,
      url: "/blog/remix-spa-mode/",
    },
    {
      title: "2023 年に読んでよかった本",
      views: 14698,
      url: "/blog/books-i-read-in-2023/",
    },
    {
      title: "フルスタック Web フレームワーク HonoX を使ってみる",
      views: 13368,
      url: "/blog/full-stack-web-framework-honox/",
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
          delay: index * 300,
        }}
        class="block rounded-lg bg-gray-200 p-4 hover:bg-gray-300"
      >
        <h3 class="font-bold">{post.title}</h3>
        <p class="mt-2 text-sm text-gray-700">
          {post.views.toLocaleString()} views
        </p>
      </a>
    {/if}
  {/each}
</div>
