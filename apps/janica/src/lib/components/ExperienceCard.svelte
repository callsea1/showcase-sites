<script lang="ts">
  import type { JanicaExperience } from '@showcase/content';
  import GlassPanel from './GlassPanel.svelte';

  type Props = {
    experience: JanicaExperience;
    active?: boolean;
  };

  let { experience, active = false }: Props = $props();
</script>

<article class="card" class:active data-location={experience.location}>
  <header>
    <p class="period">{experience.period}</p>
    <h3>{experience.role}</h3>
    <p class="org">{experience.org} · {experience.location}</p>
  </header>
  <ul>
    {#each experience.highlights as highlight}
      <li>{highlight}</li>
    {/each}
  </ul>
</article>

<style>
  .card {
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.65);
    border-radius: 1rem;
    padding: 1.25rem;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }

  .card.active {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(255, 147, 152, 0.18);
    border-color: rgba(255, 147, 152, 0.45);
  }

  .period {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--teal);
    margin: 0 0 0.35rem;
  }

  h3 {
    margin: 0 0 0.25rem;
    font-size: 1.15rem;
  }

  .org {
    margin: 0 0 0.85rem;
    color: rgba(30, 42, 50, 0.65);
    font-size: 0.92rem;
  }

  ul {
    margin: 0;
    padding-left: 1.1rem;
    display: grid;
    gap: 0.45rem;
  }

  li {
    color: rgba(30, 42, 50, 0.82);
    line-height: 1.45;
  }
</style>
