<script lang="ts">
  import PrevIcon from './Icons/Prev.svelte'
  import NextIcon from './Icons/Next.svelte'
  import Page from './Page.svelte'

  export let page = 1
  export let total: number
  export let limit: number
  export let href = '/blog/page/'

  $: totalPage = Math.ceil(total / limit)
  $: hasPrev = page !== 1
  $: hasNext = page !== totalPage
  $: prevPage = page - 1
  $: nextPage = page + 1
</script>

<nav class="flex flex-col items-center my-12">
  <div class="flex">
    {#if hasPrev}
      <div
        class="h-12 w-12 mr-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700"
      >
        <a href={`${href}${prevPage}`} sveltekit:prefetch>
          <PrevIcon />
        </a>
      </div>
    {/if}
    <div class="flex h-12 font-medium rounded-full bg-white dark:bg-gray-700">
      {#each Array(totalPage) as _, i (i)}
        <Page current={page === i + 1}>
          <a href={`${href}${i + 1}`} sveltekit:prefetch>{i + 1}</a>
        </Page>
      {/each}
      <Page current sm>{page}</Page>
    </div>
    {#if hasNext}
      <div
        class="h-12 w-12 ml-1 flex justify-center items-center rounded-full cursor-pointer bg-white dark:bg-gray-700"
      >
        <a href={`${href}${nextPage}`} sveltekit:prefetch>
          <NextIcon />
        </a>
      </div>
    {/if}
  </div>
</nav>
