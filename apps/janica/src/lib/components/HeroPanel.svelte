<script lang="ts">
  import type { JanicaResume } from '@showcase/content';
  import GlassPanel from './GlassPanel.svelte';

  type Props = {
    resume: JanicaResume;
    onLaunch?: () => void;
  };

  let { resume, onLaunch }: Props = $props();
</script>

<GlassPanel id="hero" class="hero-panel">
  <p class="eyebrow">Executive support across time zones</p>
  <div class="status">
    <span class="dot"></span>
    {resume.status}
  </div>
  <h1>{resume.name}</h1>
  <p class="title">{resume.title}</p>
  <p class="location">{resume.location}</p>
  <div class="actions">
    <button type="button" class="primary" onclick={() => onLaunch?.()}>Send a plane</button>
    <a href="#contact" class="secondary">Get in touch</a>
  </div>
  <p class="hint">Tap the sky or click to launch a paper plane</p>
</GlassPanel>

<style>
  :global(.hero-panel) {
    margin-top: 12vh;
  }

  .eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(30, 42, 50, 0.65);
    margin: 0 0 0.75rem;
  }

  .status {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    font-size: 0.85rem;
    font-weight: 500;
    margin-bottom: 1rem;
    padding: 0.35rem 0.75rem;
    border-radius: 999px;
    background: rgba(255, 147, 152, 0.18);
  }

  .dot {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--pink);
    box-shadow: 0 0 0 4px rgba(255, 147, 152, 0.25);
  }

  h1 {
    font-size: clamp(2.4rem, 7vw, 4rem);
    line-height: 1.02;
    margin: 0 0 0.35rem;
    letter-spacing: -0.03em;
  }

  .title {
    font-size: clamp(1.05rem, 2.5vw, 1.35rem);
    font-weight: 500;
    margin: 0 0 0.25rem;
    color: rgba(30, 42, 50, 0.82);
  }

  .location {
    margin: 0 0 1.5rem;
    color: rgba(30, 42, 50, 0.6);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .primary,
  .secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.2rem;
    border-radius: 999px;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    font: inherit;
  }

  .primary {
    background: var(--ink);
    color: white;
  }

  .secondary {
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(30, 42, 50, 0.12);
  }

  .hint {
    font-size: 0.82rem;
    color: rgba(30, 42, 50, 0.55);
    margin: 0;
  }
</style>
