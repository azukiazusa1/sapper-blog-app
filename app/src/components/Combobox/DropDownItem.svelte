<script lang="ts">
  export let imageUrl: string
  export let text: string
  export let selected: boolean
  export let id: string
</script>

<li
  role="option"
  aria-selected={selected}
  {id}
  class={`cursor-pointer flex items-center px-4 py-3 -mx-2 transition-colors duration-200 transform border-b last:border-0 hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600 ${
    selected ? 'bg-gray-100 dark:bg-gray-500' : ''
  }`}
  on:mousedown
>
  <img class="object-cover w-8 h-8 mx-1 rounded-full" src={imageUrl} alt="" />
  <p class="mx-2 text-sm text-gray-600 dark:text-gray-50">
    {text}
  </p>
</li>
