<script context="module" lang="ts">
  import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]

  export async function preload({ params }) {
    try {
      const res = await PostRepository.find(params.slug)
      return { post: res.fields }
    } catch (err) {
      this.error(err.status, err.message)
    }
  }
</script>

<script lang="ts">
  export let post: { slug: string; title: string; about: string }
</script>

<svelte:head>
  <title>{post.title}</title>
</svelte:head>

<h1>{post.title}</h1>

<div class="content">
  {@html post.about}
</div>
