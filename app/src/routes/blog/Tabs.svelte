<script lang="ts">
  import { Tabs } from "bits-ui";
  import { cubicInOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  interface Props {
    value: "blog" | "shorts";
    blog?: import("svelte").Snippet;
    shorts?: import("svelte").Snippet;
  }

  let { value, blog, shorts }: Props = $props();

  const [send, receive] = crossfade({
    duration: 250,
    easing: cubicInOut,
  });

  const handleTabChange = (tab: string) => {
    if (tab === "blog") {
      history.replaceState(null, "", "/blog");
    } else {
      history.replaceState(null, "", "/blog/shorts");
    }
  };
</script>

<div class="w-full bg-gradient-to-r from-indigo-900 to-purple-900 py-16 dark:from-indigo-950 dark:to-purple-950 mb-16">
  <div class="container mx-auto px-4">
    <h1 class="text-center text-4xl font-extrabold text-white mb-6">Blog</h1>
    <p class="text-center text-lg text-indigo-100 max-w-2xl mx-auto mb-10">
      Web開発とフロントエンド技術に関する記事を探索しましょう
    </p>
  </div>
</div>

<Tabs.Root
  onValueChange={handleTabChange}
  bind:value
  class="container mx-auto"
>
  {#snippet children()}
    <Tabs.List
      class="mx-auto -mt-24 mb-16 flex max-w-xs items-center justify-center rounded-full bg-white p-1.5 shadow-lg dark:bg-zinc-800"
    >
      <Tabs.Trigger
        value="blog"
        class="relative z-10 w-full rounded-full px-6 py-2.5 text-center text-sm font-medium transition-all"
      >
        <span class="relative z-20" class:text-white={value === "blog"} class:text-gray-700={value !== "blog"} class:dark:text-gray-300={value !== "blog"}> 
          ブログ 
        </span>
        {#if value === "blog"}
          <div
            class="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500"
            in:send={{ key: "active" }}
            out:receive={{ key: "active" }}
          ></div>
        {/if}
      </Tabs.Trigger>
      <Tabs.Trigger
        value="shorts"
        class="relative z-10 w-full rounded-full px-6 py-2.5 text-center text-sm font-medium transition-all"
      >
        <span class="relative z-20" class:text-white={value === "shorts"} class:text-gray-700={value !== "shorts"} class:dark:text-gray-300={value !== "shorts"}> 
          ショート 
        </span>
        {#if value === "shorts"}
          <div
            class="absolute left-0 top-0 h-full w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500"
            in:send={{ key: "active" }}
            out:receive={{ key: "active" }}
          ></div>
        {/if}
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="blog" class="animate-[fade-in_0.5s_ease-out]">
      {@render blog?.()}
    </Tabs.Content>
    <Tabs.Content value="shorts" class="animate-[fade-in_0.5s_ease-out]">
      {@render shorts?.()}
    </Tabs.Content>
  {/snippet}
</Tabs.Root>
