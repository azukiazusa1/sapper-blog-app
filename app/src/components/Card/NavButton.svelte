<script lang="ts">
  import { fly } from "svelte/transition";
  import { Tooltip } from "bits-ui";
  interface Props {
    label: string;
    className?: string;
    children?: import("svelte").Snippet;
    click: (e: MouseEvent) => void;
  }

  let { label, className = "", children, click }: Props = $props();

  const children_render = $derived(children);
</script>

<Tooltip.Provider>
  <Tooltip.Root delayDuration={300}>
    <Tooltip.Trigger>
      {#snippet child({ props })}
        <button
          type="button"
          class="{className} sticky right-8 top-8 hidden rounded-full p-5 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"
          {...props}
          onclick={click}
          aria-label={label}
        >
          {@render children_render?.()}
        </button>
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Content forceMount sideOffset={4}>
      {#snippet child({ wrapperProps, props, open })}
        {#if open}
          <div {...wrapperProps}>
            <div {...props} transition:fly={{ y: 8, duration: 150 }}>
              <div class="bg-black">
                <Tooltip.Arrow
                  class="rounded-[2px] border-l border-t dark:border-zinc-700"
                />
              </div>
              <div
                class="outline-hidden flex items-center justify-center rounded-lg border bg-black p-3 text-sm text-gray-50 dark:border-zinc-700"
              >
                {label}
              </div>
            </div>
          </div>
        {/if}
      {/snippet}
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>
