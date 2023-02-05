<script lang="ts">
  import variables from '$lib/variables'
  import type { PageData } from './$types'
  import Table from '../../components/Table/Table.svelte'

  export const prerender = false
  export const ssr = true

  export let data: PageData
</script>

<svelte:head>
  <title>下書き</title>
  <meta name="description" content="下書きの記事の一覧です。" />
  <link rel="canonical" href={`${variables.baseURL}/tags`} />
</svelte:head>

<h1 class="text-2xl">下書き</h1>

<div class="container my-8 md:mx-auto">
  <Table {data} />
</div>
