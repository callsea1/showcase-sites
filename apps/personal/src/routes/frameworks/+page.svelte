<script lang="ts">
  import { frameworks, frameworkDisclaimer } from '@showcase/ai-proof';
  import { FrameworkViewer } from '@showcase/ui';
</script>

<svelte:head>
  <title>Framework Diagrams — Sean P. Callahan</title>
</svelte:head>

<main class="page">
  <header>
    <a href="/">← Office</a>
    <h1>Representative Frameworks</h1>
    <p>{frameworkDisclaimer}</p>
  </header>

  {#each frameworks as fw, i}
    <article class="card">
      <h2>{fw.title}</h2>
      <FrameworkViewer steps={fw.steps} activeStep={0} disclaimer={fw.subtitle} />
      <pre>{fw.mermaid}</pre>
    </article>
  {/each}
</main>

<style>
  .page {
    min-height: 100vh;
    background: #1a1a1a;
    color: #f5f5ff;
    padding: 2rem 1.25rem 4rem;
    max-width: 900px;
    margin: 0 auto;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  a {
    color: #9ecbff;
  }

  .card {
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid rgba(3, 4, 156, 0.45);
    border-radius: 0.75rem;
  }

  pre {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(3, 4, 156, 0.12);
    border-radius: 0.5rem;
    overflow-x: auto;
    font-size: 0.75rem;
    font-family: 'IBM Plex Mono', monospace;
  }
</style>
