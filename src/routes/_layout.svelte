<script lang="ts">
import { onMount } from 'svelte';

	import Nav from '../components/Nav.svelte';

	export let segment: string;
	let html: HTMLElement;
	let darkMode = false

	onMount(() => {
		html = document.documentElement
		if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			html.classList.add('dark')
		} else {
			html.classList.remove('dark')
		}
	})
	$: {
		if (html) {
			if (darkMode) {
				html.classList.add('dark')
				localStorage.theme = 'dark'
			} else {
				html.classList.remove('dark')
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

<main>
	<slot></slot>
</main>