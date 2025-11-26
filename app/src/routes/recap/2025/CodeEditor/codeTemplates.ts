export const dataCode = `interface RecapData {
  totalPosts: number;
  totalWords: number;
  topTags: Array<{ name: string; count: number }>;
}

export const recap2025: RecapData = {
  totalPosts: 78,
  totalWords: 779239,
  topTags: [
    { name: "AI", count: 33 },
    { name: "MCP", count: 20 },
    { name: "TypeScript", count: 13 },
  ],
};`;

export const statsCode = `<script lang="ts">
  import CountUp from "../CountUp.svelte";
  import { recap2025 } from "./Data2025";
</script>

<div class="text-center">
  <div class="text-6xl font-bold">
    <CountUp value={recap2025.totalPosts} />
    <span class="text-xl">Posts</span>
  </div>
  <p class="text-xl">文字数に換算すると</p>
  <div class="text-6xl font-bold">
    <CountUp value={recap2025.totalWords} />
    <span class="text-2xl">Words</span>
  </div>
</div>`;

export const tagsCode = `<script lang="ts">
  import { scale } from "svelte/transition";
  import { recap2025 } from "./Data2025";
</script>

<div class="flex flex-wrap gap-4 justify-center">
  {#each recap2025.topTags as tag, i}
    <div
      in:scale={{ delay: i * 200, duration: 500 }}
      class="rounded-full bg-purple-100 px-6 py-3"
    >
      <span class="text-2xl font-bold">{tag.name}</span>
      <span class="text-gray-600">({tag.count})</span>
    </div>
  {/each}
</div>`;

export const postsCode = `<script lang="ts">
  import { fly } from "svelte/transition";
  import CountUp from "../CountUp.svelte";
  import { recap2025 } from "./Data2025";
</script>

<div class="space-y-4">
  {#each recap2025.popularPosts as post, i}
    <a
      href={post.url}
      in:fly={{ x: 100, delay: i * 300, duration: 500 }}
      class="block rounded-lg bg-white p-6 shadow hover:shadow-lg"
    >
      <h3 class="text-xl font-bold">{post.title}</h3>
      <div class="mt-2 text-2xl font-bold text-purple-600">
        <CountUp value={post.views} /> views
      </div>
    </a>
  {/each}
</div>`;
