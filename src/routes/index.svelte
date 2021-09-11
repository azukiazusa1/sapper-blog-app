<script context="module">
  export function preload() {
    this.fetch('rss')
    return this.redirect(302, 'blog')
  }
</script>
