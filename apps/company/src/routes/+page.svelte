<script lang="ts">
  import { onMount } from 'svelte';
  import { resume, stats, caseStudies, featuredCaseStudies } from '@showcase/content';
  import { frameworks, frameworkDisclaimer, toolchain } from '@showcase/ai-proof';
  import { OverlayPanel, FrameworkViewer } from '@showcase/ui';
  import NinjaGame from '$lib/game/NinjaGame.svelte';
  import CompanyHero from '$lib/landing/CompanyHero.svelte';
  import type { GameCollectible } from '@showcase/engine-game';

  let started = $state(false);
  let loading = $state(true);
  let unlock: GameCollectible | null = $state(null);
  let gameState = $state('TITLE');
  let bootLine = $state(0);

  const archiveStudies = caseStudies.filter((cs) => cs.featured === false);

  onMount(() => {
    const timer = setInterval(() => {
      bootLine += 1;
      if (bootLine >= 4) {
        clearInterval(timer);
        loading = false;
      }
    }, 220);
    return () => clearInterval(timer);
  });
</script>

<svelte:head>
  <title>3 Ninja LLC — Cloud, AI & Product Engineering</title>
  <meta
    name="description"
    content="3 Ninja LLC — principal-led cloud, AI, and platform engineering. Wex · Railbird YC · Paro. Illinois-built systems studio."
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://images.unsplash.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if loading}
  <div class="screen loader">
    <div class="boot">
      <span>3NINJA / SYSTEM BOOT</span>
      <span class:visible={bootLine > 0}>[01] loading Wex · Railbird · Paro archives</span>
      <span class:visible={bootLine > 1}>[02] loading AI method layer</span>
      <span class:visible={bootLine > 2}>[03] loading Cloud Dojo runtime</span>
      <span class:visible={bootLine > 3}>[04] dojo ready</span>
    </div>
  </div>
{:else if !started}
  <div class="screen hero">
    <div class="hero-grid" aria-hidden="true"></div>
    <header class="hero-nav"><span>3N / CHI-IL</span><span>WEX · RAILBIRD · PARO</span></header>

    <CompanyHero>
      <p class="eyebrow">Principal-led systems studio · Chicago, Illinois</p>
      <h1>3<br /><em>NINJA</em></h1>
      <p class="lede">
        Platform engineering, regulated fintech, and AI-native systems — from Wex-scale microfrontends to YC exits.
      </p>
      <div class="hero-index">
        <span>Wex MFE platform</span><span>Railbird YC exit</span><span>Bedrock AI workflows</span>
      </div>
      <button class="enter-btn" type="button" onclick={() => (started = true)}>
        <span class="enter-btn__label">Enter the Dojo</span>
        <span class="enter-btn__hint">Playable proof · recent wins first</span>
      </button>
      <p class="hint">A playable portfolio of architecture, judgment, and shipped systems.</p>
    </CompanyHero>
  </div>
{:else}
  <main class="studio">
    <header class="top">
      <div>
        <strong>3 Ninja LLC</strong>
        <span>Principal-led consulting · {resume.name}</span>
      </div>
      <nav>
        <a href="#game">Dojo</a>
        <a href="#proof">Proof</a>
        <a href="#frameworks">Frameworks</a>
        <a href="https://seanpcallahan.net" target="_blank" rel="noreferrer">Executive Office</a>
      </nav>
    </header>

    <section id="game" class="panel game-panel">
      <div class="section-kicker"><span>01 / PLAYABLE SYSTEM</span><span>{gameState}</span></div>
      <h1>Cloud Dojo<br /><em>operationalize the idea.</em></h1>
      <p class="intro">
        Level one opens on Railbird. Collect proof from recent platform wins — Wex, Paro, regulated exchange work — then
        ship the system.
      </p>
      <NinjaGame onUnlock={(item) => (unlock = item)} onStateChange={(state) => (gameState = state)} />
      <a class="skip-link" href="#proof">Skip game — show the work ↓</a>
    </section>

    <section id="stats" class="panel stats">
      {#each stats as stat}
        <article>
          <strong>{stat.prefix ?? ''}{stat.value}{stat.suffix}</strong>
          <span>{stat.label}</span>
          <small>{stat.description}</small>
        </article>
      {/each}
    </section>

    <section id="proof" class="panel proof-panel">
      <div class="section-kicker"><span>02 / RECENT PROOF</span><span>WEX · RAILBIRD · PARO</span></div>
      <h2>Work that moved the needle.</h2>
      <p class="intro">Principal and staff-level outcomes from the last five years — platform, regulated fintech, and AI.</p>
      <div class="proof-grid">
        {#each featuredCaseStudies as cs, i}
          <article class="proof-card" class:lead={i === 0}>
            {#if cs.image}
              <div class="proof-image" style="background-image: url({cs.image})">
                <span class="proof-period">{cs.period}</span>
              </div>
            {/if}
            <div class="proof-body">
              <h3>{cs.title}</h3>
              <p class="role">{cs.role}</p>
              <p>{cs.summary}</p>
              <ul>
                {#each cs.metrics as metric}
                  <li>{metric}</li>
                {/each}
              </ul>
            </div>
          </article>
        {/each}
      </div>

      {#if archiveStudies.length}
        <details class="archive">
          <summary>Earlier roles archive</summary>
          <div class="cards">
            {#each archiveStudies as cs}
              <article>
                {#if cs.image}
                  <div class="archive-image" style="background-image: url({cs.image})"></div>
                {/if}
                <h3>{cs.title}</h3>
                <p class="role">{cs.role} · {cs.period}</p>
                <p>{cs.summary}</p>
              </article>
            {/each}
          </div>
        </details>
      {/if}
    </section>

    <section id="services" class="panel method-panel">
      <div class="section-kicker"><span>03 / METHOD</span><span>MADE WITH CARE + CODE</span></div>
      <h2>Systems over artifacts.</h2>
      <p class="intro">AI is not the product. It is the force multiplier inside a disciplined engineering loop.</p>
      <div class="method-grid">
        {#each ['Frame the real problem', 'Architect the leverage', 'Wield AI with tools', 'Evaluate aggressively', 'Operate what ships'] as method, i}
          <article><span>0{i + 1}</span><h3>{method}</h3><p>{['Constraints before prompts.', 'Patterns before implementation.', 'Agents, retrieval, and automation.', 'Tests, evals, security, accessibility.', 'Traces, cost, rollback, learning.'][i]}</p></article>
        {/each}
      </div>
      <p class="toolchain">
        AI toolchain: {toolchain.models.join(' · ')} — patterns: {toolchain.patterns.slice(0, 4).join(', ')}…
      </p>
    </section>

    <section id="frameworks" class="panel framework-panel">
      <div class="section-kicker"><span>04 / FRAMEWORK OUTPUTS</span><span>ANONYMIZED</span></div>
      <h2>Patterns, not secrets.</h2>
      <p class="disclaimer">{frameworkDisclaimer}</p>
      {#each frameworks.slice(0, 4) as fw}
        <article class="fw-card">
          <h3>{fw.title}</h3>
          <FrameworkViewer steps={fw.steps} disclaimer={fw.subtitle} />
        </article>
      {/each}
      <a href="/frameworks">View all frameworks →</a>
    </section>

    <section id="contact" class="panel contact">
      <h2>Build what matters next.</h2>
      <p class="contact-lede">Platform work, AI systems, regulated product engineering — let's talk scope.</p>
      <p>
        <a href="mailto:{resume.contact.email}">{resume.contact.email}</a> ·
        <a href={resume.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>
    </section>
  </main>

  <OverlayPanel
    show={!!unlock}
    title={unlock?.title ?? ''}
    subtitle={unlock?.type ?? ''}
    variant="company"
    onclose={() => (unlock = null)}
  >
    {#if unlock}
      <p>{unlock.body}</p>
    {/if}
  </OverlayPanel>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: #fdfdfd;
    color: #0f0f0f;
  }

  .screen {
    min-height: 100vh;
    display: grid;
    place-content: center;
    text-align: center;
    padding: 2rem;
    gap: 1rem;
  }

  .loader {
    background: #0f0f0f;
    color: #fdfdfd;
    align-items: start;
    justify-items: start;
    font: 0.72rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .boot {
    display: grid;
    gap: 0.7rem;
    width: min(480px, 90vw);
  }

  .boot span:not(:first-child) {
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.35s ease, transform 0.35s ease;
  }

  .boot span.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .hero {
    position: relative;
    overflow: hidden;
    display: block;
    min-height: 100vh;
    text-align: left;
    padding: 1.25rem clamp(1.25rem, 6vw, 6rem);
    background: radial-gradient(circle at 78% 22%, rgba(3, 4, 156, 0.12), transparent 28%), #fdfdfd;
  }

  .hero h1 {
    font-size: clamp(4rem, 14vw, 10rem);
    margin: 0.5rem 0;
    line-height: 0.78;
    letter-spacing: -0.09em;
    width: min(100%, 900px);
  }

  .hero h1 em,
  .panel h1 em {
    font-style: normal;
    -webkit-text-stroke: 2px #0f0f0f;
    color: transparent;
  }

  .eyebrow {
    letter-spacing: 0.18em;
    text-transform: uppercase;
    font-size: 0.75rem;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    opacity: 0.16;
    background-image: linear-gradient(#0f0f0f 1px, transparent 1px), linear-gradient(90deg, #0f0f0f 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: linear-gradient(90deg, transparent, black 42%, transparent);
  }

  .hero-nav {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    width: 100%;
    font: 0.7rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    margin-bottom: 1rem;
  }

  .lede {
    max-width: 32ch;
    line-height: 1.55;
    font-size: clamp(1.05rem, 2vw, 1.45rem);
    margin: 1rem 0 1.25rem;
  }

  .hero-index {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.5rem;
    margin-bottom: 1.5rem;
    font: 0.72rem 'IBM Plex Mono', monospace;
    text-transform: uppercase;
  }

  .hero-index span::before {
    content: '↗ ';
  }

  .enter-btn {
    display: inline-grid;
    gap: 0.15rem;
    padding: 1rem 1.75rem 0.85rem;
    border: 2px solid #0f0f0f;
    background: #0f0f0f;
    color: #fdfdfd;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 700;
    cursor: pointer;
    text-align: left;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 8px 8px 0 rgba(15, 15, 15, 0.15);
  }

  .enter-btn:hover {
    transform: translate(-2px, -2px);
    box-shadow: 12px 12px 0 rgba(15, 15, 15, 0.18);
  }

  .enter-btn__label {
    font-size: 0.95rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .enter-btn__hint {
    font-size: 0.62rem;
    font-weight: 400;
    opacity: 0.7;
    text-transform: none;
  }

  .hint {
    opacity: 0.65;
    font-size: 0.9rem;
    margin-top: 1rem;
  }

  .studio {
    max-width: 1180px;
    margin: 0 auto;
    padding: 1rem clamp(1.25rem, 5vw, 5rem) 6rem;
  }

  .top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    padding: 1rem 0 2rem;
    border-bottom: 1px solid #0f0f0f;
  }

  .top span {
    display: block;
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .top nav {
    display: flex;
    gap: 1rem;
    font-size: 0.85rem;
  }

  .top a {
    color: inherit;
  }

  .panel {
    margin-top: clamp(5rem, 12vw, 10rem);
    position: relative;
  }

  .panel h2 {
    font-size: clamp(2.5rem, 7vw, 6rem);
    letter-spacing: -0.07em;
    line-height: 0.9;
    margin-bottom: 0.75rem;
  }

  .panel h1 {
    font-size: clamp(3rem, 8vw, 8rem);
    letter-spacing: -0.08em;
    line-height: 0.86;
    margin: 1rem 0;
  }

  .section-kicker {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-top: 1px solid #0f0f0f;
    padding-top: 0.65rem;
    font: 0.68rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
  }

  .intro {
    max-width: 48ch;
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .stats article {
    border-top: 1px solid #0f0f0f;
    padding: 1rem 0.5rem;
    text-align: left;
  }

  .stats strong {
    display: block;
    font-size: 1.6rem;
  }

  .stats small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.72rem;
    opacity: 0.65;
    font-family: 'IBM Plex Mono', monospace;
  }

  .proof-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .proof-card {
    border: 1px solid #0f0f0f;
    display: grid;
    grid-template-rows: auto 1fr;
    background: #fdfdfd;
    overflow: hidden;
  }

  .proof-card.lead {
    grid-column: 1 / -1;
    grid-template-columns: 1.1fr 1fr;
    grid-template-rows: none;
  }

  .proof-image {
    min-height: 200px;
    background-size: cover;
    background-position: center;
    position: relative;
  }

  .proof-card.lead .proof-image {
    min-height: 320px;
  }

  .proof-period {
    position: absolute;
    left: 0.75rem;
    bottom: 0.75rem;
    padding: 0.25rem 0.5rem;
    background: rgba(15, 15, 15, 0.82);
    color: #fdfdfd;
    font: 0.65rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em;
  }

  .proof-body {
    padding: 1rem;
  }

  .proof-body ul {
    margin: 0.75rem 0 0;
    padding-left: 1rem;
    font-size: 0.85rem;
    opacity: 0.85;
  }

  .archive {
    margin-top: 2rem;
    border-top: 1px solid #0f0f0f;
    padding-top: 1rem;
  }

  .archive summary {
    cursor: pointer;
    font: 0.75rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.7;
    margin-bottom: 1rem;
  }

  .cards {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 0.75rem;
  }

  .cards article {
    border: 1px solid #0f0f0f;
    padding: 0;
    min-width: min(280px, 75vw);
    flex: 1 0 240px;
    overflow: hidden;
  }

  .archive-image {
    height: 120px;
    background-size: cover;
    background-position: center;
  }

  .cards article h3,
  .cards article p {
    padding: 0 1rem;
  }

  .cards article h3 {
    padding-top: 0.75rem;
  }

  .cards article p:last-child {
    padding-bottom: 1rem;
  }

  .fw-card {
    border: 1px solid #0f0f0f;
    padding: 1rem;
    margin-bottom: 1rem;
    background: #fdfdfd;
  }

  .method-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(130px, 1fr));
    border-top: 1px solid #0f0f0f;
    border-bottom: 1px solid #0f0f0f;
  }

  .method-grid article {
    padding: 1rem;
    border-right: 1px solid #0f0f0f;
  }

  .method-grid article:last-child {
    border-right: 0;
  }

  .method-grid span {
    font: 0.7rem 'IBM Plex Mono', monospace;
    opacity: 0.55;
  }

  .method-grid h3 {
    font-size: 1rem;
    line-height: 1.1;
  }

  .method-grid p {
    font-size: 0.82rem;
    line-height: 1.4;
    opacity: 0.7;
  }

  .role {
    font-size: 0.85rem;
    opacity: 0.7;
  }

  .disclaimer {
    font-size: 0.85rem;
    opacity: 0.75;
    margin-bottom: 1rem;
  }

  .toolchain {
    margin-top: 1rem;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.85rem;
    opacity: 0.8;
  }

  .contact {
    text-align: center;
    padding: clamp(4rem, 12vw, 10rem) 1rem;
    border-top: 1px solid #0f0f0f;
    border-bottom: 1px solid #0f0f0f;
  }

  .contact-lede {
    opacity: 0.75;
    margin-bottom: 1rem;
  }

  .skip-link {
    display: inline-block;
    margin-top: 1rem;
    color: inherit;
    font: 0.72rem 'IBM Plex Mono', monospace;
  }

  @media (max-width: 860px) {
    .proof-grid {
      grid-template-columns: 1fr;
    }

    .proof-card.lead {
      grid-template-columns: 1fr;
    }

    .top {
      align-items: start;
      flex-direction: column;
    }

    .method-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .method-grid article:nth-child(2n) {
      border-right: 0;
    }

    .method-grid article {
      border-bottom: 1px solid #0f0f0f;
    }
  }
</style>
