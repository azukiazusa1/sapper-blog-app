<script lang="ts">
  export let name: string
  export let slug: string
</script>

<a 
  class="inline-block bg-gray-200 rounded-full px-3 py-1 dark:bg-gray-500 text-xs font-semibold mr-2 mb-2"
  href={`tags/${slug}`}
>
  {name}
</a>