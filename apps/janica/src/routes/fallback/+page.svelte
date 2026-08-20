<script lang="ts">
  import { janicaResume } from '@showcase/content';
  import ExperienceCard from '$lib/components/ExperienceCard.svelte';
  import SkillGrid from '$lib/components/SkillGrid.svelte';
  import ContactPanel from '$lib/components/ContactPanel.svelte';
  import GlassPanel from '$lib/components/GlassPanel.svelte';
</script>

<svelte:head>
  <title>{janicaResume.name} — Accessible Portfolio</title>
  <meta name="description" content="Accessible portfolio mode for Janica Callahan." />
</svelte:head>

<main class="fallback">
  <header>
    <p class="eyebrow">Accessible portfolio mode</p>
    <h1>{janicaResume.name}</h1>
    <p>{janicaResume.title} · {janicaResume.location}</p>
    <nav class="fallback-nav">
      <a href="/">← Back to interactive site</a>
    </nav>
  </header>

  <GlassPanel id="about">
    <h2>About</h2>
    <p>{janicaResume.summary}</p>
  </GlassPanel>

  <section class="experience">
    <h2>Experience</h2>
    {#each janicaResume.experience as job}
      <ExperienceCard experience={job} />
    {/each}
  </section>

  <SkillGrid skills={janicaResume.skills} />

  <GlassPanel id="education" class="education-panel">
    <h2>Education & Languages</h2>
    <p>
      {janicaResume.education.degree}, {janicaResume.education.school} ({janicaResume.education.year})
    </p>
    <ul class="lang-list">
      {#each janicaResume.languages as lang}
        <li>{lang.name} — {lang.level}</li>
      {/each}
    </ul>
  </GlassPanel>

  <ContactPanel resume={janicaResume} />

  <footer class="fallback-footer">
    <p>
      © {new Date().getFullYear()} {janicaResume.name}
      <span class="sep" aria-hidden="true">·</span>
      <a href="https://www.3ninjallc.com" target="_blank" rel="noreferrer">3 Ninja LLC</a>
    </p>
  </footer>
</main>

<style>
  .fallback {
    max-width: 760px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
    min-height: 100vh;
    background: linear-gradient(180deg, #ffd4d6 0%, #b8ecec 45%, #acd8e6 100%);
    display: grid;
    gap: 1.25rem;
  }

  header h1 {
    margin: 0.25rem 0;
    font-size: clamp(2rem, 5vw, 3rem);
  }

  .eyebrow {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin: 0;
    opacity: 0.7;
  }

  header p {
    margin: 0 0 0.75rem;
  }

  header a {
    color: inherit;
  }

  .fallback-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
  }

  .fallback-footer {
    text-align: center;
    font-size: 0.78rem;
    color: rgba(30, 42, 50, 0.5);
  }

  .fallback-footer p {
    margin: 0;
  }

  .fallback-footer .sep {
    margin: 0 0.35rem;
    opacity: 0.45;
  }

  .fallback-footer a {
    color: rgba(30, 42, 50, 0.62);
    text-decoration: none;
  }

  .fallback-footer a:hover {
    color: rgba(30, 42, 50, 0.9);
  }

  .experience {
    display: grid;
    gap: 1rem;
  }

  .experience h2 {
    margin: 0;
  }

  .lang-list {
    margin: 0.75rem 0 0;
    padding-left: 1.1rem;
  }
</style>
