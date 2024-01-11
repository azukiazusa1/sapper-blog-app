<script lang="ts">
  import { Tabs } from "bits-ui";
  import { cubicInOut } from "svelte/easing";
  import { crossfade } from "svelte/transition";

  export let value: "blog" | "shorts";

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

<Tabs.Root
  onValueChange={handleTabChange}
  {value}
  class="container my-12 md:mx-auto"
  let:value
>
  <Tabs.List
    class="mx-auto mb-12 grid w-full max-w-xs grid-cols-2 gap-1 rounded-lg border border-gray-200 p-1 text-sm font-semibold dark:border-zinc-600"
  >
    <Tabs.Trigger
      value="blog"
      class="relative h-8 rounded-lg bg-transparent py-1 transition-colors"
    >
      <span class="relative z-20"> ブログ </span>
      {#if value === "blog"}
        <div
          class="absolute left-0 top-0 h-8 w-full rounded-lg bg-gray-200 dark:bg-zinc-600"
          in:send={{ key: "active" }}
          out:receive={{ key: "active" }}
        />
      {/if}
    </Tabs.Trigger>
    <Tabs.Trigger
      value="shorts"
      class="relative h-8 rounded-lg bg-transparent py-1 transition-colors"
    >
      <span class="relative z-20"> ショート </span>
      {#if value === "shorts"}
        <div
          class="absolute left-0 top-0 h-8 w-full rounded-lg bg-gray-200 dark:bg-zinc-600"
          in:send={{ key: "active" }}
          out:receive={{ key: "active" }}
        />
      {/if}
    </Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="blog">
    <slot name="blog" />
  </Tabs.Content>
  <Tabs.Content value="shorts">
    <slot name="shorts" />
  </Tabs.Content>
</Tabs.Root>
