<script lang="ts">
  interface Props {
    name?: string;
    slug?: string;
    count?: number;
    children?: import("svelte").Snippet;
  }

  let { name = "", slug = "", count, children }: Props = $props();

  // タグの色をスラッグに基づいてランダムに割り当て（控えめな色合い）
  function getTagColor(slug: string): string {
    const colorClasses = [
      "from-indigo-400 to-indigo-500 dark:from-indigo-600 dark:to-indigo-700",
      "from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-700",
      "from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700",
      "from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700",
      "from-zinc-400 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700",
    ];

    // スラッグの文字をハッシュ化して一貫したインデックスを生成
    let hash = 0;
    for (let i = 0; i < slug.length; i++) {
      hash = (hash << 5) - hash + slug.charCodeAt(i);
      hash |= 0; // 32ビット整数に変換
    }

    const index = Math.abs(hash) % colorClasses.length;
    return colorClasses[index];
  }

  const colorClass = getTagColor(slug);
</script>

{#if count !== undefined}
  <!-- タグ一覧ページでの大きなタグカード -->
  <a href={`/tags/${slug}`} class="block h-full w-full">
    <div
      class="h-full rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden flex flex-col dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
    >
      <div
        class="bg-gradient-to-r {colorClass} p-3 flex items-center justify-center opacity-90"
      >
        <span class="text-white text-base font-medium">#{name}</span>
      </div>
      <div class="p-4 flex-1 flex items-center justify-center">
        <div class="text-center">
          <span class="block text-xl font-bold text-gray-700 dark:text-gray-200"
            >{count}</span
          >
          <span class="text-xs text-gray-500 dark:text-gray-400">記事</span>
        </div>
      </div>
    </div>
  </a>
{:else}
  <!-- 記事内の小さなタグ -->
  <a
    href={`/tags/${slug}`}
    class="inline-flex items-center rounded-full bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors"
  >
    #{name}
    {@render children?.()}
  </a>
{/if}
