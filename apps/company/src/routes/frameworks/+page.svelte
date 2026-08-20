<script lang="ts">
  import { frameworks, frameworkDisclaimer } from '@showcase/ai-proof';
  import { FrameworkViewer, BrandMark } from '@showcase/ui';
</script>

<svelte:head>
  <title>Frameworks — 3 Ninja LLC</title>
</svelte:head>

<main class="page">
  <header class="page-head">
    <a class="brand" href="/">
      <BrandMark size={28} />
      <span>3 Ninja LLC</span>
    </a>
    <a href="/">← Dojo</a>
  </header>
  <h1>Representative Frameworks</h1>
  <p>{frameworkDisclaimer}</p>
  {#each frameworks as fw}
    <article>
      <h2>{fw.title}</h2>
      <FrameworkViewer steps={fw.steps} disclaimer={fw.subtitle} />
      <pre>{fw.mermaid}</pre>
    </article>
  {/each}
</main>

<style>
  .page {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    font-family: 'Space Grotesk', system-ui, sans-serif;
  }

  .page-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    color: inherit;
    text-decoration: none;
    font-weight: 600;
  }

  article {
    margin-top: 1.5rem;
    border: 1px solid #0f0f0f;
    padding: 1rem;
  }

  pre {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f3f3f3;
    overflow-x: auto;
    font-size: 0.75rem;
    font-family: 'IBM Plex Mono', monospace;
  }
</style>
