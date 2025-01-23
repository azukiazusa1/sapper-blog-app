<button
  class="mouse absolute bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-700 p-0 text-white shadow-2xl transition duration-200 ease-in hover:bg-indigo-800 focus:outline-hidden focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900"
  on:click|stopPropagation
>
  <slot />
</button>
