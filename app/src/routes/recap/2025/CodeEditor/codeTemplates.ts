import type { ThemeId } from "../themes";

export const getDataCode = () => `interface RecapData {
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

export const getStatsCode = (themeId: ThemeId) => {
  const themeColors: Record<ThemeId, { primary: string; secondary: string }> = {
    orange: { primary: "orange", secondary: "red" },
    blue: { primary: "blue", secondary: "cyan" },
    purple: { primary: "purple", secondary: "pink" },
    green: { primary: "green", secondary: "emerald" },
    pink: { primary: "pink", secondary: "rose" },
  };
  const colors = themeColors[themeId];

  return `<script lang="ts">
  import CountUp from "../CountUp.svelte";
  import { recap2025 } from "./Data2025";
</script>

<div class="flex flex-col gap-12 max-w-4xl mx-auto">
  <div class="text-center">
    <div class="text-sm text-gray-500 mb-4">Total Posts</div>
    <div class="text-7xl font-black text-${colors.primary}-600">
      <CountUp value={recap2025.totalPosts} />
    </div>
  </div>
  <div class="text-center">
    <div class="text-sm text-gray-500 mb-4">Total Words</div>
    <div class="text-7xl font-black text-${colors.primary}-600">
      <CountUp value={recap2025.totalWords} />
    </div>
  </div>
</div>`;
};

export const getTagsCode = (themeId: ThemeId) => {
  const themeColors: Record<ThemeId, { primary: string; secondary: string }> = {
    orange: { primary: "orange", secondary: "red" },
    blue: { primary: "blue", secondary: "cyan" },
    purple: { primary: "purple", secondary: "pink" },
    green: { primary: "green", secondary: "emerald" },
    pink: { primary: "pink", secondary: "rose" },
  };
  const colors = themeColors[themeId];

  return `<script lang="ts">
  import { recap2025 } from "./Data2025";
</script>

<div class="flex flex-wrap gap-4">
  {#each recap2025.topTags as tag}
    <div class="bg-${colors.primary}-500 rounded-full px-6 py-3 text-white font-bold">
      <span class="font-black text-2xl">{tag.count}</span>
      <span>{tag.name}</span>
    </div>
  {/each}
</div>`;
};

export const getPostsCode = (themeId: ThemeId) => {
  const themeColors: Record<ThemeId, { primary: string; secondary: string }> = {
    orange: { primary: "orange", secondary: "red" },
    blue: { primary: "blue", secondary: "cyan" },
    purple: { primary: "purple", secondary: "pink" },
    green: { primary: "green", secondary: "emerald" },
    pink: { primary: "pink", secondary: "rose" },
  };
  const colors = themeColors[themeId];

  return `<script lang="ts">
  import CountUp from "../CountUp.svelte";
  import { recap2025 } from "./Data2025";
</script>

{#each recap2025.popularPosts as post, i}
  <a href={post.url} class="bg-white border-${colors.primary}-400 p-1 rounded-2xl">
    <div class="bg-${colors.primary}-500 text-white text-5xl w-20 h-20 rounded-xl">
      #{i + 1}
    </div>
    <div class="flex-1">
      <h3 class="text-2xl font-bold mb-2">{post.title}</h3>
      <div><span class="text-4xl font-black">
        <CountUp value={post.views} /></span> <span class="text-sm text-gray-500">views</span>
      </div>
    </div>
  </a>
{/each}`;
};
