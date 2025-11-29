<script lang="ts">
  import { nanoid } from "nanoid";
  import { inview } from "svelte-inview";

  const id = nanoid();

  let isInView = $state();

  interface Props {
    value: number;
    initial?: number;
    duration?: number;
    step?: number;
    roundto?: number;
    format?: boolean;
    onComplete?: () => void;
  }

  let {
    value,
    initial = 0,
    duration = 3000,
    step = $bindable(1),
    roundto = 1,
    format = true,
    onComplete,
  }: Props = $props();

  function formatNumber(input) {
    if (format) {
      return Math.round(input).toLocaleString();
    }
    return input;
  }

  const counterResult = $state([]);
  const timers = [];

  const max = value;
  while (duration / ((max - initial) / step) < 2) {
    step++;
  }

  counterResult[id] = initial;
  let hasCalledComplete = false;
  timers[id] = setInterval(
    () => {
      if (isInView) {
        if (counterResult[id] <= max) {
          counterResult[id] += step;
        } else {
          clearInterval(timers[id]);
          counterResult[id] = Math.round(max / roundto) * roundto;
          // Call onComplete callback if provided
          if (onComplete && !hasCalledComplete) {
            hasCalledComplete = true;
            onComplete();
          }
        }
      }
    },
    duration / ((max - initial) / step),
  );
</script>

<!-- svelte-ignore event_directive_deprecated -->
<span
  use:inview
  on:inview_change={(event) => {
    const { inView } = event.detail;
    isInView = inView;
  }}>{formatNumber(counterResult[id])}</span
>
