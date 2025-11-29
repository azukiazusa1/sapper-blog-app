<script lang="ts">
	import { onMount } from 'svelte';
	import type { ThemeId } from '../../routes/recap/2025/themes';
	import { getDeviceSettings } from './utils';

	interface Props {
		colors: string[];
		themeId?: ThemeId;
		density?: 'low' | 'medium' | 'high';
	}

	let { colors, themeId = 'orange', density = 'medium' }: Props = $props();

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;
	let particles: Particle[] = [];
	let animationFrame: number;
	let scrollY = $state(0);

	const deviceSettings = getDeviceSettings();

	const particleCount = $derived(() => {
		if (deviceSettings.backgroundParticles === 0) return 0;
		const densityMap = { low: 20, medium: 35, high: 50 };
		return Math.min(densityMap[density], deviceSettings.backgroundParticles);
	});

	class Particle {
		x: number;
		y: number;
		baseY: number;
		size: number;
		color: string;
		speedY: number;
		opacity: number;
		blur: number;

		constructor(canvasWidth: number, canvasHeight: number) {
			this.x = Math.random() * canvasWidth;
			this.y = Math.random() * canvasHeight;
			this.baseY = this.y;
			this.size = Math.random() * 6 + 2;
			this.color = colors[Math.floor(Math.random() * colors.length)];
			this.speedY = Math.random() * 0.5 + 0.2;
			this.opacity = Math.random() * 0.4 + 0.3;
			this.blur = Math.random() * 2 + 1;
		}

		update(canvasHeight: number, parallaxOffset: number) {
			// Apply parallax effect to baseY
			this.y = this.baseY - parallaxOffset;

			// Slow vertical float
			this.baseY -= this.speedY;

			// Wrap around when particle goes off top
			if (this.y < -10) {
				this.baseY = canvasHeight + 10;
				this.x = Math.random() * (canvas?.width || 0);
			}
		}

		draw(context: CanvasRenderingContext2D) {
			context.save();
			context.filter = `blur(${this.blur}px)`;
			context.fillStyle = this.color;
			context.globalAlpha = this.opacity;
			context.beginPath();
			context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			context.fill();
			context.restore();
		}
	}

	function initCanvas() {
		if (!canvas) return;

		ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		resizeCanvas();

		// Create particles
		const count = particleCount();
		particles = [];
		for (let i = 0; i < count; i++) {
			particles.push(new Particle(canvas.width, canvas.height));
		}

		// Start animation
		animate();
	}

	function resizeCanvas() {
		if (!canvas) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function animate() {
		if (!ctx || !canvas) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Calculate parallax offset (0.5x scroll speed)
		const parallaxOffset = scrollY * 0.5;

		// Update and draw particles
		particles.forEach((particle) => {
			particle.update(canvas.height, parallaxOffset);
			particle.draw(ctx!);
		});

		// Continue animation
		animationFrame = requestAnimationFrame(animate);
	}

	function handleScroll() {
		scrollY = window.scrollY;
	}

	onMount(() => {
		if (deviceSettings.backgroundParticles === 0) return;

		initCanvas();

		// Handle scroll for parallax
		window.addEventListener('scroll', handleScroll, { passive: true });

		// Handle resize
		window.addEventListener('resize', resizeCanvas);

		return () => {
			cancelAnimationFrame(animationFrame);
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', resizeCanvas);
		};
	});
</script>

{#if deviceSettings.backgroundParticles > 0}
	<canvas
		bind:this={canvas}
		class="particle-canvas fixed inset-0 pointer-events-none z-0"
		aria-hidden="true"
	></canvas>
{/if}

<style>
	.particle-canvas {
		width: 100%;
		height: 100%;
	}
</style>
