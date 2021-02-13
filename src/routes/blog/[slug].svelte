<script context="module" lang="ts">
  import RepositoryFactory, { POST } from '../../repositories/RepositoryFactory'
  const PostRepository = RepositoryFactory[POST]

  export async function preload({ params }) {
    try {
      const res = await PostRepository.find(params.slug)
      if (res.blogPostCollection.items.length === 0) {
        this.error(404, 'Not Found')
      }
      return { post: res.blogPostCollection.items[0] }
    } catch (err) {
      this.error(err.status, err.message)
    }
  }
</script>

<script lang="ts">
  import type { BlogPost } from '../../generated/graphql';

  export let post: Pick<BlogPost, 'title' | 'slug' | 'about' | 'article' | 'createdAt'>
</script>

<svelte:head>
  <title>{post.title}</title>
  <meta name="description" content={post.about}>
</svelte:head>

<h1>{post.title}</h1>

<div class="content">
  {@html post.article}
</div>

