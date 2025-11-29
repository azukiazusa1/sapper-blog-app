<script lang="ts">
  import { fade } from "svelte/transition";
  import { onMount } from "svelte";
  import PrevIcon from "../../../components/Icons/Prev.svelte";
  import ParticleBackground from "$lib/effects/ParticleBackground.svelte";
  import Confetti from "$lib/effects/Confetti.svelte";
  import { getDeviceSettings } from "$lib/effects/utils";

  interface Props {
    onGetStarted: () => void;
  }

  let { onGetStarted }: Props = $props();

  const deviceSettings = getDeviceSettings();

  let triggerConfetti = $state(false);

  // Particle background colors (orange theme)
  const particleColors = ['#ea580c', '#dc2626', '#f97316', '#fb923c'];

  // Trigger confetti on mount (after delay)
  onMount(() => {
    // Trigger confetti burst after 600ms (synchronized with 3D entrance)
    const confettiTimer = setTimeout(() => {
      if (deviceSettings.confettiParticles > 0) {
        triggerConfetti = true;
      }
    }, 600);

    return () => {
      clearTimeout(confettiTimer);
    };
  });
</script>

<div
  class="hero-container relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white"
>
  <!-- Particle Background -->
  <ParticleBackground colors={particleColors} density="medium" />

  <!-- Confetti -->
  <Confetti bind:trigger={triggerConfetti} particleCount={50} themeId="orange" spread={120} />

  <!-- Back button -->
  <div class="absolute top-0 left-0 z-10 p-4">
    <a href="/recap">
      <span class="sr-only">戻る</span>
      <PrevIcon
        className="h-6 w-6 text-gray-600 hover:text-gray-900 transition-colors"
      />
    </a>
  </div>

  <div
    in:fade={{ duration: 300 }}
    class="content-wrapper relative z-10 mx-auto max-w-5xl space-y-12 px-8 text-center"
  >
    <!-- Minimal accent line -->
    <div class="accent-line mx-auto h-1 w-16 bg-orange-600"></div>

    <!-- Main typography with 3D effects -->
    <h1 class="hero-year">
      2025
    </h1>

    <div class="hero-subtitle">
      azukiazusa.dev
      <span class="mt-2 block text-lg">Year in Review</span>
    </div>

    <!-- CTA Button with 3D effect -->
    <button
      onclick={onGetStarted}
      class="enter-button"
      aria-label="Get started with 2025 recap"
    >
      Enter
    </button>
  </div>
</div>

<style>
  /* Hero Container */
  .hero-container {
    perspective: 1000px;
  }

  /* Content Wrapper Animations */
  .content-wrapper {
    animation: contentFadeIn 0.3s ease-out 0.1s both;
  }

  @keyframes contentFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  /* Accent Line Animation */
  .accent-line {
    animation: accentSlide 0.4s ease-out 0.3s both;
  }

  @keyframes accentSlide {
    from {
      transform: translateX(-100px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Main Typography - 3D Entrance with Float */
  .hero-year {
    font-size: clamp(4rem, 15vw, 9rem);
    font-weight: 300;
    letter-spacing: -0.05em;
    color: #111827;
    transform-style: preserve-3d;
    animation:
      hero3DEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s both,
      textShine 2s ease-in-out 0.6s 1,
      heroFloat 6s ease-in-out 1.8s infinite;
    background: linear-gradient(
      90deg,
      currentColor 40%,
      rgba(255, 255, 255, 0.9) 50%,
      currentColor 60%
    );
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow:
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 20px 60px rgba(0, 0, 0, 0.05);
  }

  @keyframes hero3DEntrance {
    0% {
      transform: perspective(800px) rotateY(-90deg) scale(0.5);
      opacity: 0;
    }
    50% {
      transform: perspective(800px) rotateY(0deg) scale(1.1);
    }
    100% {
      transform: perspective(800px) rotateY(0deg) scale(1);
      opacity: 1;
    }
  }

  @keyframes textShine {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }

  @keyframes heroFloat {
    0%,
    100% {
      transform: perspective(800px) rotateX(5deg) translateY(0);
    }
    50% {
      transform: perspective(800px) rotateX(5deg) translateY(-10px);
    }
  }

  /* Subtitle */
  .hero-subtitle {
    font-size: clamp(1.5rem, 4vw, 3rem);
    font-weight: 400;
    letter-spacing: 0.05em;
    color: #4b5563;
    animation: subtitleFade 0.6s ease-out 0.9s both;
  }

  @keyframes subtitleFade {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Enter Button - 3D Press Effect */
  .enter-button {
    display: inline-block;
    background: #111827;
    color: white;
    padding: 1rem 2rem;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    transform: perspective(500px) translateZ(0);
    animation:
      buttonScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 1.5s both,
      buttonPulse 2s ease-in-out 2s infinite;
  }

  .enter-button:hover {
    background: #1f2937;
    transform: perspective(500px) translateZ(20px) rotateX(-5deg);
    box-shadow: 0 20px 40px rgba(234, 88, 12, 0.4);
  }

  .enter-button:active {
    transform: perspective(500px) translateZ(5px) rotateX(2deg);
    box-shadow: 0 5px 15px rgba(234, 88, 12, 0.3);
  }

  .enter-button:focus-visible {
    outline: none;
    ring: 4px;
    ring-color: #d1d5db;
  }

  @keyframes buttonScale {
    from {
      opacity: 0;
      transform: perspective(500px) translateZ(0) scale(0.8);
    }
    to {
      opacity: 1;
      transform: perspective(500px) translateZ(0) scale(1);
    }
  }

  @keyframes buttonPulse {
    0%,
    100% {
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }
    50% {
      box-shadow: 0 15px 30px rgba(234, 88, 12, 0.2);
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .hero-year {
      animation: none;
      transform: none;
      background: #111827;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .enter-button {
      animation: none;
      transform: none;
    }

    .enter-button:hover {
      transform: none;
    }

    .accent-line {
      animation: none;
    }

    .hero-subtitle {
      animation: none;
    }

    .content-wrapper {
      animation: none;
    }
  }
</style>
