<script lang="ts">
  import Avatar from "../../../components/Avatar/Avatar.svelte";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  export let name: string;
  export let snsLink: string | undefined;
  export let avatarUrl: string;
  export let comment: string;

  let isMounted = false;
  onMount(() => {
    isMounted = true;
  });
</script>

{#if isMounted}
  <div
    class="z-10 flex items-start space-x-4 rounded-lg bg-white p-2 md:p-4"
    in:fly={{ y: 50, duration: 700, delay: 1700 }}
  >
    <a href={snsLink} target="_blank" rel="noopener noreferrer" class="block">
      <Avatar alt={name} src={avatarUrl} size="md" />
    </a>
    <div class="min-w-0 flex-1">
      <div class="flex items-center justify-between">
        <p class="truncate text-sm font-medium text-gray-900">
          <a
            href={snsLink}
            target="_blank"
            rel="noopener noreferrer"
            class="underline"
          >
            {name}
          </a>
        </p>
      </div>
      <p class="mt-1 text-sm text-gray-500">{comment}</p>
    </div>
  </div>
{/if}
