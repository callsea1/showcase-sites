<script lang="ts">
  import GlassPanel from './GlassPanel.svelte';

  type Props = {
    skills: {
      ai: string[];
      operations: string[];
      admin: string[];
    };
  };

  let { skills }: Props = $props();

  const groups = $derived([
    { id: 'ai', label: 'AI & Automation', items: skills.ai },
    { id: 'operations', label: 'Operations', items: skills.operations },
    { id: 'admin', label: 'Admin & HR', items: skills.admin }
  ]);
</script>

<GlassPanel id="skills">
  <h2>Skills</h2>
  <div class="grid">
    {#each groups as group}
      <div class="group">
        <h3>{group.label}</h3>
        <ul>
          {#each group.items as item}
            <li>{item}</li>
          {/each}
        </ul>
      </div>
    {/each}
  </div>
</GlassPanel>

<style>
  h2 {
    margin: 0 0 1.25rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  .grid {
    display: grid;
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .group h3 {
    font-size: 0.82rem;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--teal);
    margin: 0 0 0.65rem;
  }

  .group ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .group li {
    font-size: 0.82rem;
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.65);
    border: 1px solid rgba(30, 42, 50, 0.08);
  }
</style>
