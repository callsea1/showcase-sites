<script lang="ts">
  import { onMount } from 'svelte';
  import Lenis from 'lenis';
  import { janicaResume } from '@showcase/content';
  import HeroPanel from '$lib/components/HeroPanel.svelte';
  import ExperienceCard from '$lib/components/ExperienceCard.svelte';
  import SkillGrid from '$lib/components/SkillGrid.svelte';
  import ContactPanel from '$lib/components/ContactPanel.svelte';
  import GlassPanel from '$lib/components/GlassPanel.svelte';
  import PaperPlanesCanvas from '$lib/scene/PaperPlanesCanvas.svelte';

  let scrollProgress = $state(0);
  let launchSignal = $state(0);
  let activeExperience = $state(0);
  let webglEnabled = $state(true);

  const locationByExperience: Record<string, number> = {
    'three-ninja': 0,
    peregrine: 1,
    yay: 1
  };

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      webglEnabled = false;
      return;
    }

    const lenis = new Lenis({ smoothWheel: true });
    let frame = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

      const sections = document.querySelectorAll('[data-experience-index]');
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.55 && rect.bottom > window.innerHeight * 0.25) {
          const index = Number((section as HTMLElement).dataset.experienceIndex);
          if (!Number.isNaN(index)) activeExperience = index;
        }
      });
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  });

  function launchPlane() {
    launchSignal += 1;
  }

  function handleWebGlFailed() {
    webglEnabled = false;
  }
</script>

<svelte:head>
  <title>{janicaResume.name} — {janicaResume.title}</title>
  <meta
    name="description"
    content="Janica Callahan — Executive Assistant and Account Manager in Chicago. AI-forward operations, global travel, and stakeholder support."
  />
</svelte:head>

{#if webglEnabled}
  <PaperPlanesCanvas
    locations={janicaResume.locations}
    {scrollProgress}
    {launchSignal}
    onWebGlFailed={handleWebGlFailed}
  />
{/if}

<div class="site" class:static-bg={!webglEnabled}>
  <header class="top">
    <strong>{janicaResume.name}</strong>
    <nav>
      <a href="#about">About</a>
      <a href="#experience">Experience</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
      <a href="/fallback">Accessible</a>
    </nav>
  </header>

  <main>
    <HeroPanel resume={janicaResume} onLaunch={launchPlane} />

    <GlassPanel id="about" class="about-panel">
      <h2>About</h2>
      <p>{janicaResume.summary}</p>
    </GlassPanel>

    <section id="experience" class="experience-section">
      <div class="section-head">
        <h2>Experience</h2>
        <p>Chicago today · Dubai before · connected across continents</p>
      </div>
      <div class="experience-grid">
        {#each janicaResume.experience as job, index}
          <div data-experience-index={index} data-location-index={locationByExperience[job.id] ?? 0}>
            <ExperienceCard experience={job} active={activeExperience === index} />
          </div>
        {/each}
      </div>
    </section>

    <SkillGrid skills={janicaResume.skills} />

    <GlassPanel id="education">
      <h2>Education & Languages</h2>
      <div class="edu-grid">
        <article>
          <h3>{janicaResume.education.degree}</h3>
          <p>{janicaResume.education.school} · {janicaResume.education.year}</p>
        </article>
        <article>
          <h3>Languages</h3>
          <ul>
            {#each janicaResume.languages as lang}
              <li>{lang.name} — {lang.level}</li>
            {/each}
          </ul>
        </article>
      </div>
    </GlassPanel>

    <ContactPanel resume={janicaResume} />
  </main>

  <footer>
    <p>
      © {new Date().getFullYear()} {janicaResume.name}
      <span class="sep" aria-hidden="true">·</span>
      <a class="footer-company" href="https://www.3ninjallc.com" target="_blank" rel="noreferrer">3 Ninja LLC</a>
    </p>
  </footer>
</div>

<style>
  .site {
    position: relative;
    z-index: 1;
    pointer-events: none;
    max-width: 720px;
    margin: 0 auto;
    padding: 1rem 1rem 4rem;
  }

  .site.static-bg {
    background: linear-gradient(180deg, #ffd4d6 0%, #b8ecec 45%, #acd8e6 100%);
    min-height: 100vh;
  }

  .site :global(a),
  .site :global(button),
  .site :global(.panel),
  .site :global(.card),
  .site :global(nav),
  .site :global(footer) {
    pointer-events: auto;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0 1.5rem;
    pointer-events: auto;
  }

  .top strong {
    font-size: 0.95rem;
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem 1rem;
    font-size: 0.85rem;
  }

  nav a {
    text-decoration: none;
    opacity: 0.75;
  }

  nav a:hover {
    opacity: 1;
  }

  main {
    display: grid;
    gap: 1.25rem;
  }

  h2 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  :global(.about-panel p) {
    margin: 0;
    line-height: 1.65;
    color: rgba(30, 42, 50, 0.82);
  }

  .experience-section {
    pointer-events: auto;
  }

  .section-head {
    margin-bottom: 0.75rem;
  }

  .section-head h2 {
    margin-bottom: 0.25rem;
  }

  .section-head p {
    margin: 0;
    color: rgba(30, 42, 50, 0.65);
  }

  .experience-grid {
    display: grid;
    gap: 1rem;
  }

  .edu-grid {
    display: grid;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .edu-grid {
      grid-template-columns: 1.2fr 0.8fr;
    }
  }

  .edu-grid h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
  }

  .edu-grid p,
  .edu-grid ul {
    margin: 0;
    color: rgba(30, 42, 50, 0.75);
  }

  .edu-grid ul {
    padding-left: 1rem;
    display: grid;
    gap: 0.35rem;
  }

  footer {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.78rem;
    color: rgba(30, 42, 50, 0.5);
    pointer-events: auto;
  }

  footer p {
    margin: 0;
  }

  .sep {
    margin: 0 0.35rem;
    opacity: 0.45;
  }

  .footer-company {
    color: rgba(30, 42, 50, 0.62);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .footer-company:hover {
    color: rgba(30, 42, 50, 0.9);
  }
</style>
