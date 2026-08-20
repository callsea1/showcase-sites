<script lang="ts">
  import { caseStudies } from '@showcase/content';

  type Node = {
    id: string;
    label: string;
    type: 'host' | 'remote' | 'shared';
    detail: string;
  };

  const nodes: Node[] = [
    { id: 'shell', label: 'Host Shell', type: 'host', detail: 'Wex company-wide web shell · routing · auth boundary' },
    { id: 'admin', label: 'Admin Portal', type: 'remote', detail: 'Generated admin portals in under 10 minutes' },
    { id: 'payments', label: 'Payments MFE', type: 'remote', detail: 'Regulated fintech UI · independent deploy' },
    { id: 'fleet', label: 'Fleet MFE', type: 'remote', detail: 'Fleet card management · team-owned release' },
    { id: 'shared', label: 'Shared Libs', type: 'shared', detail: 'Design system · auth · telemetry · Module Federation shared scope' }
  ];

  let active = $state<string>('shell');
  const wex = caseStudies.find((c) => c.id === 'wex');
</script>

<div class="mfe-lab">
  <header>
    <span class="kicker">Module Federation · Wex L6</span>
    <h2>Platform composition lab</h2>
    <p>Tap a node to see how host, remotes, and shared dependencies compose at Fortune-scale.</p>
  </header>

  <div class="diagram">
    <div class="host-box">
      <button
        type="button"
        class="node host"
        class:active={active === 'shell'}
        onclick={() => (active = 'shell')}
      >
        Host Shell
      </button>
      <div class="remotes">
        {#each nodes.filter((n) => n.type === 'remote') as node}
          <button
            type="button"
            class="node remote"
            class:active={active === node.id}
            onclick={() => (active = node.id)}
          >
            {node.label}
          </button>
        {/each}
      </div>
      <button
        type="button"
        class="node shared"
        class:active={active === 'shared'}
        onclick={() => (active = 'shared')}
      >
        Shared scope
      </button>
    </div>
  </div>

  <article class="detail">
    {#each nodes.filter((n) => n.id === active) as node}
      <h3>{node.label}</h3>
      <p>{node.detail}</p>
    {/each}
    {#if wex}
      <ul>
        {#each wex.metrics as m}
          <li>{m}</li>
        {/each}
      </ul>
      <div class="tech">
        {#each wex.tech as t}
          <span>{t}</span>
        {/each}
      </div>
    {/if}
  </article>
</div>

<style>
  .mfe-lab {
    display: grid;
    gap: 1.25rem;
    padding: 1rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    border-radius: 0.75rem;
    background: rgba(0, 0, 0, 0.35);
  }

  .kicker {
    font: 0.65rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9ecbff;
  }

  .mfe-lab h2 {
    margin: 0.35rem 0;
    font-size: 1.25rem;
  }

  .mfe-lab > header p {
    margin: 0;
    opacity: 0.8;
    font-size: 0.9rem;
    max-width: 48ch;
  }

  .diagram {
    padding: 1rem;
    background: rgba(13, 17, 23, 0.6);
    border-radius: 0.5rem;
  }

  .host-box {
    display: grid;
    gap: 0.75rem;
  }

  .remotes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.5rem;
    padding-left: 1rem;
    border-left: 2px dashed rgba(158, 203, 255, 0.4);
  }

  .node {
    min-height: 44px;
    padding: 0.65rem 0.85rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(158, 203, 255, 0.35);
    background: rgba(0, 0, 0, 0.4);
    color: #f5f5ff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    text-align: left;
    cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .node.host {
    border-color: #03049c;
    background: linear-gradient(135deg, rgba(3, 4, 156, 0.6), rgba(26, 31, 140, 0.4));
  }

  .node.remote {
    border-color: rgba(93, 255, 149, 0.4);
  }

  .node.shared {
    border-color: rgba(255, 159, 67, 0.5);
  }

  .node.active {
    box-shadow: 0 0 16px rgba(158, 203, 255, 0.35);
    border-color: #9ecbff;
  }

  .detail {
    padding: 1rem;
    border-top: 1px solid rgba(158, 203, 255, 0.2);
  }

  .detail h3 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
  }

  .detail ul {
    margin: 0.75rem 0;
    padding-left: 1.1rem;
    font-size: 0.85rem;
    opacity: 0.9;
  }

  .tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .tech span {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    border: 1px solid rgba(158, 203, 255, 0.3);
    border-radius: 999px;
    font-family: 'IBM Plex Mono', monospace;
  }
</style>
