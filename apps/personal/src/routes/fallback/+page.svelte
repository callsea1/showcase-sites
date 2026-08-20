<script lang="ts">
  import { resume, zones, caseStudies, stats } from '@showcase/content';
  import { frameworks, frameworkDisclaimer } from '@showcase/ai-proof';
  import { FrameworkViewer } from '@showcase/ui';
</script>

<svelte:head>
  <title>{resume.name} — 2D Portfolio</title>
</svelte:head>

<main class="fallback">
  <header>
    <p class="eyebrow">Accessible portfolio mode</p>
    <h1>{resume.name}</h1>
    <p>{resume.tagline}</p>
    <nav class="fallback-nav">
      <a href="/">← Back to office game</a>
      <a href="https://www.3ninjallc.com" target="_blank" rel="noreferrer">3 Ninja LLC →</a>
    </nav>
  </header>

  <section>
    <h2>Impact</h2>
    <div class="stats">
      {#each stats as stat}
        <article>
          <strong>{stat.prefix ?? ''}{stat.value}{stat.suffix}</strong>
          <span>{stat.label}</span>
          <p>{stat.description}</p>
        </article>
      {/each}
    </div>
  </section>

  <section>
    <h2>Office Zones</h2>
    {#each zones as zone}
      <article class="card">
        <h3>{zone.name}</h3>
        <p>{zone.body}</p>
      </article>
    {/each}
  </section>

  <section>
    <h2>Case Studies</h2>
    {#each caseStudies as cs}
      <article class="card">
        <h3>{cs.title} — {cs.role}</h3>
        <p>{cs.summary}</p>
      </article>
    {/each}
  </section>

  <section>
    <h2>Framework Diagrams</h2>
    {#each frameworks as fw}
      <article class="card">
        <h3>{fw.title}</h3>
        <FrameworkViewer steps={fw.steps} disclaimer={frameworkDisclaimer} />
      </article>
    {/each}
  </section>
</main>

<style>
  .fallback {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: #1a1a1a;
    color: #f5f5ff;
    min-height: 100vh;
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.16em;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  h1 {
    font-size: 2.5rem;
    margin: 0.25rem 0;
  }

  section {
    margin-top: 2.5rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .stats article,
  .card {
    border: 1px solid rgba(3, 4, 156, 0.45);
    border-radius: 0.75rem;
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
  }

  a {
    color: #9ecbff;
  }

  .fallback-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    margin-top: 0.75rem;
  }
</style>
