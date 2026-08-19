<script lang="ts">
  type Props = {
    steps: { id: string; label: string; detail: string }[];
    activeStep?: number;
    disclaimer?: string;
  };

  let { steps, activeStep = 0, disclaimer = '' }: Props = $props();
</script>

<div class="framework-viewer">
  {#if disclaimer}
    <p class="disclaimer">{disclaimer}</p>
  {/if}
  <ol class="steps">
    {#each steps as step, i}
      <li class:active={i === activeStep}>
        <strong>{step.label}</strong>
        <span>{step.detail}</span>
      </li>
    {/each}
  </ol>
</div>

<style>
  .framework-viewer {
    display: grid;
    gap: 1rem;
  }

  .disclaimer {
    font-size: 0.8rem;
    opacity: 0.75;
    line-height: 1.5;
    padding: 0.75rem;
    border-left: 3px solid currentColor;
  }

  .steps {
    list-style: none;
    display: grid;
    gap: 0.75rem;
    padding: 0;
    margin: 0;
  }

  .steps li {
    display: grid;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(127, 127, 127, 0.25);
    border-radius: 0.5rem;
    opacity: 0.65;
    transition: opacity 0.2s ease, border-color 0.2s ease;
  }

  .steps li.active {
    opacity: 1;
    border-color: currentColor;
  }

  .steps strong {
    font-size: 0.9rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .steps span {
    font-size: 0.95rem;
    line-height: 1.5;
  }
</style>
