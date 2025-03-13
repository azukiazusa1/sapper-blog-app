<script lang="ts">
  import Link from "../Link/Link.svelte";

  interface BreadcrumbItem {
    label: string;
    url?: string;
  }

  interface Props {
    items: BreadcrumbItem[];
  }

  let { items }: Props = $props();
</script>

<nav aria-label="Breadcrumb" class="mb-4">
  <ol class="flex flex-wrap items-center text-sm">
    {#each items as item, index}
      <li class="flex items-center">
        {#if item.url && index !== items.length - 1}
          <Link href={item.url}>{item.label}</Link>
        {:else}
          <span
            class="text-gray-700 dark:text-gray-50/60"
            aria-current={index === items.length - 1 ? "page" : undefined}
            >{item.label}</span
          >
        {/if}

        {#if index < items.length - 1}
          <span class="mx-2 text-gray-500 dark:text-gray-400" aria-hidden="true"
            >&gt;</span
          >
        {/if}
      </li>
    {/each}
  </ol>
</nav>
