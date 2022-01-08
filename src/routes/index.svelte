<script context="module" lnag="ts">
  import type { Load } from '@sveltejs/kit';
  export const load: Load = () => {
    return {
      status: 302,
      redirect: 'blog'
    }
  }
</script>
