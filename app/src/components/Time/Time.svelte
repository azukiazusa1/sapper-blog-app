<script lang="ts">
  export let date: string;

  const format = () => {
    const d = new Date(date);
    const m = `0${d.getMonth() + 1}`.slice(-2);
    const dd = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}.${m}.${dd}`;
  };
</script>

<time
  datetime={date}
  class="text-grey-darker text-sm text-neutral-900 text-opacity-70 dark:text-gray-50 dark:text-opacity-60"
>
  {format()}
</time>
