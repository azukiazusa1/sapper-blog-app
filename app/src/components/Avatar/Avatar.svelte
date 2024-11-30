<script lang="ts">
  interface Props {
    alt: string;
    src: string;
    size?: "sm" | "md" | "lg";
  }

  let { alt, src, size = "md" }: Props = $props();

  let className = $derived(`object-cover rounded-full ${
    size === "sm" ? "w-6 h-6" : size === "md" ? "w-8 h-8" : "w-24 h-24"
  }`);

  let pixel = $derived(size === "sm" ? "24" : size === "md" ? "32" : "96");
</script>

<img
  class={className}
  width={pixel}
  height={pixel}
  {alt}
  {src}
  loading="lazy"
  decoding="async"
/>
