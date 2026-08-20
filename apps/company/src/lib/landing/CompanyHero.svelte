<script lang="ts">
  import type { Snippet } from 'svelte';
  import { effortsCaseStudies } from '@showcase/content';

  type Props = { children?: Snippet };
  let { children }: Props = $props();

  const heroImage =
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80&auto=format&fit=crop';
  const accentImages = effortsCaseStudies.slice(0, 3).map((cs) => cs.image).filter(Boolean);
</script>

<div class="hero-stage">
  <div class="hero-visual" aria-hidden="true">
    <div class="hero-main" style="background-image: url({heroImage})"></div>
    <div class="hero-stack">
      {#each accentImages as img, i}
        <div class="hero-thumb" style="background-image: url({img}); --i: {i}"></div>
      {/each}
    </div>
    <div class="hero-frame"></div>
    <div class="hero-scan"></div>
  </div>

  <div class="hero-copy">
    {@render children?.()}
  </div>
</div>

<style>
  .hero-stage {
    position: relative;
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(300px, 0.95fr);
    align-items: center;
    gap: clamp(2rem, 6vw, 5rem);
    width: 100%;
    min-height: 72vh;
  }

  .hero-visual {
    position: relative;
    width: min(100%, 560px);
    aspect-ratio: 1 / 1.05;
    transform: perspective(900px) rotateY(-6deg) rotateX(2deg);
    filter: drop-shadow(28px 32px 0 rgba(15, 15, 15, 0.12));
  }

  .hero-main {
    position: absolute;
    inset: 8% 6% 14% 6%;
    background-size: cover;
    background-position: center;
    border: 2px solid #0f0f0f;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  }

  .hero-stack {
    position: absolute;
    right: -2%;
    bottom: 8%;
    display: grid;
    gap: 0.45rem;
    width: 34%;
  }

  .hero-thumb {
    aspect-ratio: 16 / 10;
    background-size: cover;
    background-position: center;
    border: 2px solid #0f0f0f;
    transform: translateX(calc(var(--i) * 6px)) rotate(calc(var(--i) * -1.5deg));
    box-shadow: 8px 8px 0 rgba(15, 15, 15, 0.08);
  }

  .hero-frame {
    position: absolute;
    inset: 0;
    border: 3px solid #0f0f0f;
    pointer-events: none;
  }

  .hero-frame::before {
    content: '';
    position: absolute;
    inset: 5%;
    border: 1px solid rgba(15, 15, 15, 0.25);
  }

  .hero-scan {
    position: absolute;
    inset: 8% 6% 14% 6%;
    background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(255, 255, 255, 0.04) 4px);
    pointer-events: none;
    mix-blend-mode: overlay;
  }

  .hero-copy {
    position: relative;
    z-index: 1;
  }

  @media (max-width: 860px) {
    .hero-stage {
      grid-template-columns: 1fr;
      min-height: auto;
      padding-top: 1rem;
    }

    .hero-visual {
      width: min(92vw, 480px);
      margin: 0 auto;
      transform: none;
    }

    .hero-stack {
      width: 42%;
    }
  }
</style>
