<script lang="ts">
  export let imageUrl: string;
  export let text: string;
  export let selected: boolean;
  export let id: string;
</script>

<li
  role="option"
  aria-selected={selected}
  {id}
  class={`-mx-2 flex transform cursor-pointer items-center border-b px-4 py-3 transition-colors duration-200 last:border-0 hover:bg-gray-100 dark:border-zinc-700 dark:hover:bg-zinc-500 ${
    selected ? "bg-gray-100 dark:bg-zinc-500" : ""
  }`}
  on:mousedown
>
  <img class="mx-1 h-8 w-8 rounded-full object-cover" src={imageUrl} alt="" />
  <p class="mx-2 text-sm text-gray-600 dark:text-gray-50">
    {text}
  </p>
</li>
