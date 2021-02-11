<script lang="ts">
	export let segment: string;
</script>

<nav class="hidden sm:block">
	<ul class="flex space-x-4">
		<li><a aria-current="{segment === undefined ? 'page' : undefined}" href="." class="capitalize px-3 hover:opacity-75">home</a></li>
		<li><a aria-current="{segment === 'about' ? 'page' : undefined}" href="about" class="capitalize px-3 hover:opacity-75">about</a></li>
		<li><a aria-current="{segment === 'blog' ? 'page' : undefined}" href="blog" class="capitalize px-3 hover:opacity-75">blog</a></li>
	</ul>
</nav>

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
		background-color: rgb(255,62,0);
		display: block;
		bottom: -8px;
	}
</style>