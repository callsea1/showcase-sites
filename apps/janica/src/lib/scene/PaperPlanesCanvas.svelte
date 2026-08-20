<script lang="ts">
  import { onMount } from 'svelte';
  import { createPaperPlanesScene, type PaperPlanesSceneHandle } from '@showcase/engine-paperplanes';
  import type { JanicaLocation } from '@showcase/content';

  type Props = {
    locations: JanicaLocation[];
    onReady?: () => void;
    onWebGlFailed?: () => void;
    launchSignal?: number;
    scrollProgress?: number;
  };

  let {
    locations,
    onReady,
    onWebGlFailed,
    launchSignal = 0,
    scrollProgress = 0
  }: Props = $props();

  let canvas: HTMLCanvasElement;
  let loading = $state(true);
  let scene: PaperPlanesSceneHandle | null = null;

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      onWebGlFailed?.();
      return;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    scene = createPaperPlanesScene({
      canvas,
      locations,
      isMobile,
      onReady: () => {
        loading = false;
        onReady?.();
      }
    });

    if (!scene) {
      onWebGlFailed?.();
      return;
    }

    const onResize = () => scene?.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      scene?.dispose();
    };
  });

  $effect(() => {
    scene?.setScrollProgress(scrollProgress);
  });

  $effect(() => {
    if (launchSignal > 0) scene?.launchPlane();
  });
</script>

<div class="canvas-wrap" aria-hidden="true">
  <canvas bind:this={canvas}></canvas>
  {#if loading}
    <div class="loader">Loading sky…</div>
  {/if}
</div>

<style>
  .canvas-wrap {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: auto;
    opacity: 1;
  }

  canvas {
    width: 100%;
    height: 100%;
    display: block;
    opacity: 1;
  }

  .loader {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(30, 42, 50, 0.55);
    background: linear-gradient(180deg, #ffd4d6 0%, #b8ecec 45%, #acd8e6 100%);
  }
</style>
