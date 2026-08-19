<script lang="ts">
  import { frameworks, frameworkDisclaimer, workflows } from '@showcase/ai-proof';
  import { FrameworkViewer } from '@showcase/ui';

  type Props = {
    activeFrameworkIndex?: number;
  };

  let { activeFrameworkIndex = 0 }: Props = $props();

  const workflow = workflows[0];
  const framework = $derived(frameworks[activeFrameworkIndex % frameworks.length]);
</script>

<div class="ai-center">
  <p class="badge">100x Engineer · AI Force Multiplier</p>
  <h3>{workflow.title}</h3>
  <ol class="loop">
    {#each workflow.steps as step, i}
      <li>
        <span>{i + 1}</span>
        <div>
          <strong>{step.label}</strong>
          <p>{step.detail}</p>
        </div>
      </li>
    {/each}
  </ol>

  <hr />

  <h4>{framework.title}</h4>
  <FrameworkViewer steps={framework.steps} activeStep={0} disclaimer={frameworkDisclaimer} />

  <pre class="mermaid-note" aria-label="Architecture diagram source">{framework.mermaid}</pre>
</div>

<style>
  .ai-center {
    display: grid;
    gap: 1rem;
  }

  .badge {
    display: inline-block;
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.35rem 0.75rem;
    border: 1px solid #03049c;
    border-radius: 999px;
    color: #9ecbff;
    width: fit-content;
  }

  h3,
  h4 {
    font-weight: 700;
  }

  .loop {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.75rem;
  }

  .loop li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    align-items: start;
  }

  .loop span {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #03049c;
    font-size: 0.8rem;
    font-weight: 700;
  }

  .loop strong {
    display: block;
    margin-bottom: 0.15rem;
  }

  .loop p,
  .mermaid-note {
    font-size: 0.9rem;
    opacity: 0.85;
    line-height: 1.5;
  }

  .mermaid-note {
    white-space: pre-wrap;
    background: rgba(3, 4, 156, 0.15);
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    overflow-x: auto;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
  }
</style>
