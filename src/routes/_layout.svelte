<script lang="ts">
import { onMount } from 'svelte';

	import Nav from '../components/Nav.svelte';

	export let segment: string;
	let body;
	let darkMode = false

	onMount(() => {
		body = document.body
		if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	})
	$: {
			if (body) {
			if (darkMode) {
				body.classList.add('dark')
				localStorage.theme = 'dark'
			} else {
				body.classList.remove('dark')
				localStorage.theme = 'light'
			}
		}
	}

	const toggleDarkMode = () => {
		darkMode = !darkMode
	}
</script>

<button on:click={toggleDarkMode}>button</button>
<Nav {segment}/>

<main class="bg-white dark:bg-black">
	<slot></slot>
</main>