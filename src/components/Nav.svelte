<style>
  [aria-current] {
    position: relative;
    display: inline-block;
  }

  [aria-current]::after {
    position: absolute;
    content: '';
    width: calc(100% - 1.5rem);
    height: 2px;
    background-color: rgb(255, 62, 0);
    display: block;
    bottom: -8px;
  }
</style>

<script lang="ts">
  export let segment: string

  const routes = ['blog', 'about']
</script>

<nav>
  <ul class="flex space-x-4">
    {#each routes as route}
      <li>
        <a aria-current={segment === route ? 'page' : undefined} href={route} class="capitalize px-3 hover:opacity-75">
          {route}
        </a>
      </li>
    {/each}
  </ul>
</nav>
