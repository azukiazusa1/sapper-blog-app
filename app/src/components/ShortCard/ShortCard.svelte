<script lang="ts">
  interface Props {
    title: string;
    id: string;
    children?: import('svelte').Snippet;
  }

  let { title, id, children }: Props = $props();
</script>

<div class="mx-auto h-[470px] w-60">
  <!-- テキストを中央よせ -->
  <a
    class="flex h-[430px] w-60 flex-col items-center justify-center
    rounded-xl bg-black p-4 text-lg text-white transition-all
    duration-300 ease-in-out hover:scale-105 hover:shadow-xl
    "
    href={`/blog/shorts/${id}`}
    style:--tag="card-{id}"
  >
    {@render children?.()}
  </a>
  <div class="mt-2">
    <h2 class="line-clamp-2 font-bold">
      <a class="no-underline hover:underline" href={`/blog/shorts/${id}`}>
        {title}
      </a>
    </h2>
  </div>
</div>
