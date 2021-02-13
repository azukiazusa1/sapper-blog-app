<script lang="ts">
  export let date
</script>

<time datetime={date}
  class="text-grey-darker text-sm text-opacity-70 text-black dark:text-gray-50 dark:text-opacity-60"
>
  {date}
</time>