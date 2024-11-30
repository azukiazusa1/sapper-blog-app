<script lang="ts">
  import { createBubbler } from 'svelte/legacy';

  const bubble = createBubbler();
  import { fly } from "svelte/transition";
  import { Tooltip } from "bits-ui";
  interface Props {
    label: string;
    className?: string;
    children?: import('svelte').Snippet;
  }

  let { label, className = "", children }: Props = $props();

  const children_render = $derived(children);
</script>

<Tooltip.Root openDelay={300}>
  <Tooltip.Trigger asChild >
    {#snippet children({ builder })}
        <button
        type="button"
        class="{className} sticky right-8 top-8 hidden rounded-full p-5 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"
        use:builder.action
        {...builder}
        onclick={bubble('click')}
        aria-label={label}
      >
        {@render children_render?.()}
      </button>
          {/snippet}
    </Tooltip.Trigger>
  <Tooltip.Content
    transition={fly}
    transitionConfig={{ y: 8, duration: 150 }}
    sideOffset={4}
  >
    <div class="bg-black">
      <Tooltip.Arrow
        class="rounded-[2px] border-l border-t dark:border-zinc-700"
      />
    </div>
    <div
      class="flex items-center justify-center rounded-lg border bg-black p-3 text-sm text-gray-50 outline-none dark:border-zinc-700"
    >
      {label}
    </div>
  </Tooltip.Content>
</Tooltip.Root>
