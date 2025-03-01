<script lang="ts">
  import { onMount } from "svelte";
  import { type Theme, getTheme, changeTheme } from "../../utils/darkTheme";
  import { DropdownMenu } from "bits-ui";
  import Moon from "../Icons/Moon.svelte";
  import Sun from "../Icons/Sun.svelte";
  import System from "../Icons/system.svelte";
  import { fly } from "svelte/transition";
  import Check from "../Icons/Check.svelte";
  let theme: Theme | undefined = $state(undefined);

  interface Props {
    /**
     * ポップアップを右側に表示するかどうか
     * @default false
     */
    right?: boolean;
  }

  let { right = false }: Props = $props();

  // bits-ui の side の型定義がおかしいので、any で回避
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const side: any = right ? "bottom-end" : "bottom-start";

  onMount(() => {
    theme = getTheme();
  });
  const items = [
    { value: "system", label: "System" },
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
  ] as const satisfies readonly {
    value: Theme;
    label: string;
  }[];

  const handleChange = (t: Theme) => {
    theme = t;
    changeTheme(t);
  };
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger
    class="flex items-center rounded-lg border border-gray-300 p-2 dark:border-zinc-600"
    aria-label="カラーテーマを選択する"
  >
    <Moon className="h-6 w-6 hidden dark:block" />
    <Sun className="h-6 w-6 block dark:hidden" />
  </DropdownMenu.Trigger>
  <DropdownMenu.Content
    class="rounded-br-md rounded-bl-md border-2 border-t-0 border-gray-200 bg-white shadow-lg dark:border-zinc-600 dark:bg-zinc-700"
    forceMount
    {side}
  >
    {#snippet child({ wrapperProps, props, open })}
      {#if open}
        <div {...wrapperProps}>
          <div {...props} transition:fly>
            <DropdownMenu.RadioGroup value={theme} onValueChange={handleChange}>
              {#each items as item}
                <DropdownMenu.RadioItem
                  value={item.value}
                  class={`z-50 flex w-32 transform cursor-pointer items-center px-2 py-3 transition-colors duration-200 hover:bg-gray-100 data-highlighted:bg-gray-100  dark:border-zinc-600 dark:hover:bg-zinc-500 dark:data-highlighted:bg-zinc-500`}
                >
                  {#snippet children({ checked })}
                    {#if item.value === "system"}
                      <System className="h-5 w-5" />
                    {:else if item.value === "light"}
                      <Sun className="h-5 w-5" />
                    {:else if item.value === "dark"}
                      <Moon className="h-5 w-5" />
                    {/if}
                    <span class="ml-2 text-sm">
                      {item.label}
                    </span>
                    <div class="ml-auto">
                      {#if checked}
                        <Check
                          className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                        />
                      {/if}
                    </div>
                  {/snippet}
                </DropdownMenu.RadioItem>
              {/each}
            </DropdownMenu.RadioGroup>
          </div>
        </div>
      {/if}
    {/snippet}
  </DropdownMenu.Content>
</DropdownMenu.Root>
