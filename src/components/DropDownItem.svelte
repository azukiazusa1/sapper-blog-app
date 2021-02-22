<script lang="ts">
  export let href: string
  export let imageUrl: string
  export let text: string
</script>

<a {href} class="flex items-center px-4 py-3 -mx-2 transition-colors duration-200 transform border-b hover:bg-gray-100 dark:hover:bg-gray-500 dark:border-gray-600">
  <img class="object-cover w-8 h-8 mx-1 rounded-full" src={imageUrl} alt="avatar">
  <p class="mx-2 text-sm text-gray-600 dark:text-gray-50">
      {text}
  </p>
</a>