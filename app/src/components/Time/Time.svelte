<script lang="ts">
  interface Props {
    date: string;
  }

  let { date }: Props = $props();

  const format = () => {
    const d = new Date(date);
    const m = `0${d.getMonth() + 1}`.slice(-2);
    const dd = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}.${m}.${dd}`;
  };
</script>

<time
  datetime={date}
  class="text-grey-darker text-base font-medium text-zinc-900/70 dark:text-gray-50/60"
>
  {format()}
</time>
