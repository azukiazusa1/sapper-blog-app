<script lang="ts">
  import { getLocale } from "$paraglide/runtime";

  interface Props {
    date: string;
  }

  let { date }: Props = $props();

  const format = () => {
    const d = new Date(date);
    if (getLocale() === "en") {
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    const m = `0${d.getMonth() + 1}`.slice(-2);
    const dd = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}.${m}.${dd}`;
  };
</script>

<time
  datetime={date}
  class="font-mono text-sm text-stone-500 dark:text-stone-400"
>
  {format()}
</time>
