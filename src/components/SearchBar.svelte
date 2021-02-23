<script lang="ts">
  import { goto } from '@sapper/app';
  import SearchInput from './SearchInput.svelte'
  import DropDownMenu from './DropDownMenu.svelte'
  import type { SearchPostsQuery } from '../generated/graphql';
  import RepositoryFactory, { POST } from '../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]

  let value = ''
  let posts: SearchPostsQuery
  let isFocus = false
  let loading = true
  $: showDropDownMenu = isFocus && value.trim()

  const search = async () => {
    loading = true
    posts = await PostRepository.search({ q })
    loading = false
  }

  $: params = new URLSearchParams({q: value})

  $: {
    if (value.trim()) {
      search()
    }
  }

  $: items = posts ? posts.blogPostCollection.items.map(item => {
    return {
      href: `/blog/${item.slug}`,
      imageUrl: item.thumbnail.url,
      text: item.title
    }
  }) : []

  const handleBlur = () => {
    setTimeout(() => {
      isFocus = false
    }, 100)
  }

  const handleSubmit = () => {
    if (!value.trim()) return
    goto(`/blog/search?${params}`)
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <SearchInput
    bind:value
    on:focus={() => isFocus = true}
    on:blur={handleBlur}
  />
</form>
{#if showDropDownMenu}
  <DropDownMenu {items} {loading} />
{/if}