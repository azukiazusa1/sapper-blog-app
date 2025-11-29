<script lang="ts">
	import confetti from 'canvas-confetti';
	import type { ThemeId } from '../../routes/recap/2025/themes';
	import { getDeviceSettings } from './utils';

	interface Props {
		trigger: boolean;
		particleCount?: number;
		spread?: number;
		origin?: { x: number; y: number };
		colors?: string[];
		themeId?: ThemeId;
		duration?: number;
		shapes?: Array<'circle' | 'square' | 'star'>;
		gravity?: number;
		angle?: number;
		startVelocity?: number;
		ticks?: number;
	}

	let {
		trigger = $bindable(false),
		particleCount = 100,
		spread = 70,
		origin = { x: 0.5, y: 0.5 },
		colors,
		themeId = 'orange',
		duration = 3000,
		shapes = ['circle', 'square'],
		gravity = 1,
		angle = 90,
		startVelocity = 45,
		ticks = 200
	}: Props = $props();

	// Theme-aware confetti colors
	const confettiColors: Record<ThemeId, string[]> = {
		orange: ['#ea580c', '#dc2626', '#f97316', '#fb923c'],
		blue: ['#2563eb', '#0891b2', '#3b82f6', '#60a5fa'],
		purple: ['#9333ea', '#ec4899', '#a855f7', '#c084fc'],
		green: ['#16a34a', '#059669', '#22c55e', '#4ade80'],
		pink: ['#ec4899', '#f43f5e', '#f472b6', '#fb7185']
	};

	// Get device settings for particle count adjustment
	const deviceSettings = getDeviceSettings();

	// Adjust particle count based on device capabilities
	const adjustedParticleCount = $derived(
		Math.round((particleCount * deviceSettings.confettiParticles) / 100)
	);

	// Use provided colors or theme colors
	const finalColors = $derived(colors || confettiColors[themeId]);

	// Watch trigger and fire confetti
	$effect(() => {
		if (trigger && deviceSettings.confettiParticles > 0) {
			fireConfetti();
			// Reset trigger after firing
			trigger = false;
		}
	});

	function fireConfetti() {
		confetti({
			particleCount: adjustedParticleCount,
			spread,
			origin,
			colors: finalColors,
			shapes: shapes as confetti.Shape[],
			gravity,
			angle,
			startVelocity,
			ticks,
			disableForReducedMotion: true
		});
	}
</script>
