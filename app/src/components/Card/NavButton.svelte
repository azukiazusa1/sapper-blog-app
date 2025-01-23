<script lang="ts">
  import { fly } from "svelte/transition";
  import { Tooltip } from "bits-ui";
  export let label: string;
  export let className = "";
</script>

<Tooltip.Root openDelay={300}>
  <Tooltip.Trigger asChild let:builder>
    <button
      type="button"
      class="{className} sticky right-8 top-8 hidden rounded-full p-5 hover:bg-gray-100 lg:block dark:hover:bg-zinc-700"
      use:builder.action
      {...builder}
      on:click
      aria-label={label}
    >
      <slot />
    </button>
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
      class="outline-hidden flex items-center justify-center rounded-lg border bg-black p-3 text-sm text-gray-50 dark:border-zinc-700"
    >
      {label}
    </div>
  </Tooltip.Content>
</Tooltip.Root>
