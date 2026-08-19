<script lang="ts">
  import type { ZoneScenery } from '@showcase/content';
  import { prefersReducedMotion } from '@showcase/ui';

  type Props = {
    scenery: ZoneScenery | null;
    onDone?: () => void;
  };

  let { scenery, onDone }: Props = $props();

  let visible = $state(false);
  let phase: 'flash' | 'hold' | 'out' = $state('flash');
  let reduced = $state(false);

  $effect(() => {
    if (!scenery) {
      visible = false;
      return;
    }

    reduced = prefersReducedMotion();
    visible = true;
    phase = reduced ? 'hold' : 'flash';

    const flashMs = reduced ? 0 : 120;
    const holdMs = reduced ? 800 : 1400;
    const outMs = reduced ? 400 : 600;

    const t1 = setTimeout(() => {
      phase = 'hold';
    }, flashMs);

    const t2 = setTimeout(() => {
      phase = 'out';
    }, flashMs + holdMs);

    const t3 = setTimeout(() => {
      visible = false;
      onDone?.();
    }, flashMs + holdMs + outMs);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  });
</script>

{#if visible && scenery}
  <div
    class="location-flash"
    class:flash={phase === 'flash'}
    class:hold={phase === 'hold'}
    class:out={phase === 'out'}
    aria-live="polite"
    aria-label="Location: {scenery.city}, {scenery.region}"
  >
    <div
      class="scenery-bg"
      style="--c0: {scenery.colors[0]}; --c1: {scenery.colors[1]}; --c2: {scenery.colors[2]}; {scenery.image ? `--scenery-image: url(${scenery.image})` : ''}"
    >
      {#if scenery.image}
        <div class="scenery-photo"></div>
      {/if}
      <div class="scenery-sky"></div>
      <div class="scenery-mid"></div>
      <div class="scenery-ground"></div>

      <svg class="skyline" viewBox="0 0 400 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        {#if scenery.skyline === 'chicago'}
          <rect x="0" y="95" width="400" height="25" fill="rgba(0,0,0,0.35)" />
          <rect x="30" y="55" width="18" height="65" fill="rgba(10,20,40,0.85)" />
          <rect x="55" y="40" width="14" height="80" fill="rgba(10,20,40,0.75)" />
          <rect x="78" y="25" width="22" height="95" fill="rgba(10,20,40,0.9)" />
          <rect x="108" y="50" width="16" height="70" fill="rgba(10,20,40,0.7)" />
          <rect x="130" y="15" width="12" height="105" fill="rgba(10,20,40,0.95)" />
          <rect x="150" y="35" width="20" height="85" fill="rgba(10,20,40,0.8)" />
          <rect x="178" y="48" width="14" height="72" fill="rgba(10,20,40,0.72)" />
          <rect x="200" y="20" width="18" height="100" fill="rgba(10,20,40,0.88)" />
          <rect x="225" y="42" width="16" height="78" fill="rgba(10,20,40,0.78)" />
          <rect x="250" y="30" width="24" height="90" fill="rgba(10,20,40,0.82)" />
          <rect x="285" y="52" width="14" height="68" fill="rgba(10,20,40,0.7)" />
          <rect x="310" y="38" width="20" height="82" fill="rgba(10,20,40,0.8)" />
          <rect x="340" y="58" width="16" height="62" fill="rgba(10,20,40,0.68)" />
          <rect x="365" y="45" width="18" height="75" fill="rgba(10,20,40,0.75)" />
        {:else if scenery.skyline === 'nyc'}
          <rect x="0" y="98" width="400" height="22" fill="rgba(0,0,0,0.4)" />
          <rect x="20" y="60" width="12" height="58" fill="rgba(5,5,15,0.9)" />
          <rect x="38" y="45" width="10" height="73" fill="rgba(5,5,15,0.85)" />
          <rect x="55" y="30" width="14" height="88" fill="rgba(5,5,15,0.92)" />
          <rect x="75" y="50" width="11" height="68" fill="rgba(5,5,15,0.8)" />
          <rect x="92" y="20" width="16" height="98" fill="rgba(5,5,15,0.95)" />
          <rect x="115" y="55" width="10" height="63" fill="rgba(5,5,15,0.78)" />
          <rect x="132" y="35" width="13" height="83" fill="rgba(5,5,15,0.88)" />
          <rect x="152" y="10" width="18" height="108" fill="rgba(5,5,15,0.98)" />
          <rect x="178" y="40" width="12" height="78" fill="rgba(5,5,15,0.82)" />
          <rect x="198" y="25" width="15" height="93" fill="rgba(5,5,15,0.9)" />
          <rect x="220" y="48" width="11" height="70" fill="rgba(5,5,15,0.75)" />
          <rect x="240" y="32" width="14" height="86" fill="rgba(5,5,15,0.86)" />
          <rect x="262" y="55" width="10" height="63" fill="rgba(5,5,15,0.72)" />
          <rect x="280" y="38" width="16" height="80" fill="rgba(5,5,15,0.84)" />
          <rect x="305" y="22" width="13" height="96" fill="rgba(5,5,15,0.91)" />
          <rect x="328" y="50" width="12" height="68" fill="rgba(5,5,15,0.76)" />
          <rect x="350" y="42" width="14" height="76" fill="rgba(5,5,15,0.8)" />
          <rect x="372" y="58" width="18" height="60" fill="rgba(5,5,15,0.7)" />
        {:else if scenery.skyline === 'bend'}
          <path d="M0 120 L0 70 Q50 40 100 55 T200 45 T300 60 T400 50 L400 120 Z" fill="rgba(20,40,25,0.7)" />
          <path d="M0 120 L0 85 Q80 55 160 70 T320 65 T400 75 L400 120 Z" fill="rgba(15,35,20,0.85)" />
          <polygon points="180,75 200,25 220,75" fill="rgba(30,50,35,0.9)" />
          <polygon points="240,80 258,40 276,80" fill="rgba(25,45,30,0.85)" />
          <polygon points="120,82 138,50 156,82" fill="rgba(28,48,32,0.88)" />
          <rect x="0" y="100" width="400" height="20" fill="rgba(45,80,50,0.5)" />
        {:else if scenery.skyline === 'sf'}
          <rect x="0" y="100" width="400" height="20" fill="rgba(0,0,0,0.3)" />
          <path d="M0 100 Q100 70 200 85 T400 75 L400 100 Z" fill="rgba(30,35,50,0.6)" />
          <rect x="60" y="55" width="14" height="65" fill="rgba(15,20,35,0.85)" />
          <rect x="90" y="40" width="12" height="80" fill="rgba(15,20,35,0.8)" />
          <rect x="120" y="50" width="16" height="70" fill="rgba(15,20,35,0.82)" />
          <rect x="200" y="35" width="10" height="85" fill="rgba(15,20,35,0.88)" />
          <rect x="230" y="48" width="14" height="72" fill="rgba(15,20,35,0.78)" />
          <path d="M280 95 L320 60 L360 95 Z" fill="rgba(180,80,60,0.75)" stroke="rgba(220,100,70,0.5)" stroke-width="2" />
          <rect x="310" y="52" width="12" height="68" fill="rgba(15,20,35,0.8)" />
        {:else}
          <circle cx="80" cy="50" r="3" fill="rgba(158,203,255,0.8)" />
          <circle cx="160" cy="35" r="2" fill="rgba(158,203,255,0.6)" />
          <circle cx="240" cy="55" r="3" fill="rgba(158,203,255,0.7)" />
          <circle cx="320" cy="40" r="2" fill="rgba(158,203,255,0.65)" />
          <line x1="80" y1="50" x2="160" y2="35" stroke="rgba(93,255,149,0.25)" stroke-width="1" />
          <line x1="160" y1="35" x2="240" y2="55" stroke="rgba(93,255,149,0.25)" stroke-width="1" />
          <line x1="240" y1="55" x2="320" y2="40" stroke="rgba(93,255,149,0.25)" stroke-width="1" />
          <rect x="0" y="90" width="400" height="30" fill="rgba(3,4,156,0.4)" />
        {/if}
      </svg>

      <div class="scan-beam"></div>
      <div class="grain"></div>
    </div>

    <div class="location-copy">
      <span class="loc-eyebrow">WORKPLACE LOCATED</span>
      <h2>{scenery.city}<span>, {scenery.region}</span></h2>
      <p>{scenery.workplace}</p>
    </div>
  </div>
{/if}

<style>
  .location-flash {
    position: fixed;
    inset: 0;
    z-index: 50;
    pointer-events: none;
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .location-flash.flash {
    animation: white-flash 0.12s ease-out;
  }

  .location-flash.hold .scenery-bg {
    animation: ken-burns 1.4s ease-out forwards;
  }

  .location-flash.out {
    animation: fade-out 0.6s ease-in forwards;
  }

  @keyframes white-flash {
    0% {
      background: rgba(255, 255, 255, 0.95);
    }
    100% {
      background: transparent;
    }
  }

  @keyframes fade-out {
    to {
      opacity: 0;
    }
  }

  @keyframes ken-burns {
    from {
      transform: scale(1.08);
    }
    to {
      transform: scale(1);
    }
  }

  .scenery-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .scenery-photo {
    position: absolute;
    inset: -8%;
    background-image: var(--scenery-image);
    background-size: cover;
    background-position: center;
    filter: saturate(1.05) contrast(1.08);
    animation: ken-burns 1.4s ease-out forwards;
  }

  .scenery-sky {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, var(--c0) 0%, var(--c1) 55%, var(--c2) 100%);
    opacity: 0.72;
    mix-blend-mode: multiply;
  }

  .scenery-mid {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 50% at 50% 80%, rgba(255, 255, 255, 0.08), transparent 60%);
  }

  .scenery-ground {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 35%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.55), transparent);
  }

  .skyline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 45%;
    min-height: 180px;
    opacity: 0.92;
  }

  .scan-beam {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.12) 48%,
      rgba(255, 255, 255, 0.22) 50%,
      rgba(255, 255, 255, 0.12) 52%,
      transparent 60%
    );
    animation: beam-sweep 1.2s ease-out forwards;
  }

  @keyframes beam-sweep {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  .grain {
    position: absolute;
    inset: 0;
    opacity: 0.12;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    mix-blend-mode: overlay;
  }

  .location-copy {
    position: relative;
    z-index: 2;
    text-align: center;
    padding: 2rem;
    color: #f5f5ff;
    text-shadow: 0 2px 24px rgba(0, 0, 0, 0.8);
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .loc-eyebrow {
    display: block;
    font: 0.68rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.2em;
    opacity: 0.85;
    margin-bottom: 0.5rem;
  }

  .location-copy h2 {
    margin: 0;
    font-size: clamp(2.5rem, 8vw, 5rem);
    line-height: 0.95;
    letter-spacing: -0.06em;
    animation: loc-rise 0.5s ease-out 0.1s both;
  }

  .location-copy h2 span {
    font-weight: 400;
    opacity: 0.85;
  }

  .location-copy p {
    margin: 0.75rem 0 0;
    font: 0.85rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em;
    opacity: 0.9;
    animation: loc-rise 0.5s ease-out 0.2s both;
  }

  @keyframes loc-rise {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scan-beam,
    .location-flash.hold .scenery-bg {
      animation: none;
    }

    .location-copy h2,
    .location-copy p {
      animation: none;
    }
  }
</style>
