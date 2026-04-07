<script lang="ts">
  import { m } from "$paraglide/messages";
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

<div
  class="w-full bg-stone-900 dark:bg-stone-900 py-16 mb-16 border-b border-stone-800 dark:border-stone-700"
>
  <div class="container mx-auto px-4">
    <h1
      class="text-center text-4xl font-bold text-white mb-6"
      style="font-family: var(--font-display)"
    >
      {m.blogTabsTitle()}
    </h1>
    <p class="text-center text-base text-stone-400 max-w-2xl mx-auto mb-10">
      {m.blogTabsSubtitle()}
    </p>
  </div>
</div>

<Tabs.Root onValueChange={handleTabChange} bind:value class="container mx-auto">
  {#snippet children()}
    <Tabs.List
      class="mx-auto -mt-24 mb-16 flex max-w-xs items-center justify-center rounded-lg bg-white border border-stone-200 p-1.5 dark:bg-stone-800 dark:border-stone-700"
    >
      <Tabs.Trigger
        value="blog"
        class="relative z-10 w-full rounded px-6 py-2.5 text-center text-sm font-medium transition-all"
      >
        <span
          class="relative z-20"
          class:text-white={value === "blog"}
          class:dark:text-stone-900={value === "blog"}
          class:text-stone-700={value !== "blog"}
          class:dark:text-stone-300={value !== "blog"}
        >
          {m.blogTabBlog()}
        </span>
        {#if value === "blog"}
          <div
            class="absolute left-0 top-0 h-full w-full rounded bg-stone-800 dark:bg-stone-100"
            in:send={{ key: "active" }}
            out:receive={{ key: "active" }}
          ></div>
        {/if}
      </Tabs.Trigger>
      <Tabs.Trigger
        value="shorts"
        class="relative z-10 w-full rounded px-6 py-2.5 text-center text-sm font-medium transition-all"
      >
        <span
          class="relative z-20"
          class:text-white={value === "shorts"}
          class:dark:text-stone-900={value === "shorts"}
          class:text-stone-700={value !== "shorts"}
          class:dark:text-stone-300={value !== "shorts"}
        >
          {m.blogTabShorts()}
        </span>
        {#if value === "shorts"}
          <div
            class="absolute left-0 top-0 h-full w-full rounded bg-stone-800 dark:bg-stone-100"
            in:send={{ key: "active" }}
            out:receive={{ key: "active" }}
          ></div>
        {/if}
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="blog">
      {@render blog?.()}
    </Tabs.Content>
    <Tabs.Content value="shorts">
      {@render shorts?.()}
    </Tabs.Content>
  {/snippet}
</Tabs.Root>
