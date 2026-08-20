<script lang="ts">
  import { onMount } from 'svelte';
  import { resume, stats, effortsCaseStudies, caseStudies } from '@showcase/content';
  import { frameworks, frameworkDisclaimer } from '@showcase/ai-proof';
  import { FrameworkViewer } from '@showcase/ui';
  import NinjaGame from '$lib/game/NinjaGame.svelte';
  import CompanyHero from '$lib/landing/CompanyHero.svelte';
  import type { GameCollectible } from '@showcase/engine-game';

  let loading = $state(true);
  let showGame = $state(false);
  let unlocks = $state<GameCollectible[]>([]);
  let bootLine = $state(0);

  const wex = effortsCaseStudies.find((c) => c.id === 'wex');
  const archiveStudies = caseStudies.filter((cs) => !cs.effort && cs.featured === false);

  onMount(() => {
    const timer = setInterval(() => {
      bootLine += 1;
      if (bootLine >= 3) {
        clearInterval(timer);
        loading = false;
      }
    }, 200);
    return () => clearInterval(timer);
  });

  function onUnlock(item: GameCollectible) {
    if (!unlocks.some((u) => u.id === item.id)) {
      unlocks = [...unlocks, item];
    }
  }
</script>

<svelte:head>
  <title>3 Ninja LLC — Principal Engineer · Wex Platform</title>
  <meta
    name="description"
    content="Principal Engineer L6 at Wex — $6B revenue fintech. Company-wide MFE platform, Module Federation, AI workflows. Railbird YC · Paro."
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
      <span>3NINJA / BOOT</span>
      <span class:visible={bootLine > 0}>[01] Wex platform · L6</span>
      <span class:visible={bootLine > 1}>[02] MFE · AI · regulated fintech</span>
      <span class:visible={bootLine > 2}>[03] ready</span>
    </div>
  </div>
{:else}
  <div class="site">
    <header class="top">
      <strong>3 Ninja LLC</strong>
      <nav>
        <a href="#wex">Wex</a>
        <a href="#efforts">Efforts</a>
        <a href="#game">Play</a>
        <a href="https://seanpcallahan.net" target="_blank" rel="noreferrer">Portfolio</a>
      </nav>
    </header>

    <CompanyHero>
      <p class="eyebrow">Principal Engineer L6 · Wex · $6B revenue fintech</p>
      <h1>Platform<br /><em>at scale.</em></h1>
      <p class="lede">
        Company-wide microfrontend platform, admin portal generation, and AI agent workflows — hands-on player-coach
        engineering at Fortune-scale.
      </p>
      {#if wex}
        <div class="wex-lead">
          {#if wex.image}
            <div class="wex-lead__img" style="background-image: url({wex.image})"></div>
          {/if}
          <div class="wex-lead__body">
            <h2>{wex.title} · {wex.role}</h2>
            <p>{wex.summary}</p>
            <ul>
              {#each wex.metrics as m}
                <li>{m}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/if}
    </CompanyHero>

    <section id="wex" class="panel stats-panel">
      {#each stats as stat}
        <article>
          <strong>{stat.prefix ?? ''}{stat.value}{stat.suffix}</strong>
          <span>{stat.label}</span>
        </article>
      {/each}
    </section>

    <section id="efforts" class="panel">
      <p class="section-eyebrow">CTO / CPO · startup expert</p>
      <h2>Efforts</h2>
      <div class="proof-grid">
        {#each effortsCaseStudies as cs}
          <article class="proof-card">
            {#if cs.image}
              <div class="proof-img" style="background-image: url({cs.image})"></div>
            {/if}
            <div class="proof-body">
              <h3>{cs.title}</h3>
              <p class="role">{cs.role} · {cs.period}</p>
              <p>{cs.summary}</p>
              <ul>
                {#each cs.metrics.slice(0, 3) as m}
                  <li>{m}</li>
                {/each}
              </ul>
            </div>
          </article>
        {/each}
      </div>

      {#if archiveStudies.length}
        <details class="archive">
          <summary>Earlier roles</summary>
          <div class="archive-grid">
            {#each archiveStudies as cs}
              <article>
                <h3>{cs.title}</h3>
                <p class="role">{cs.role}</p>
                <p>{cs.summary}</p>
              </article>
            {/each}
          </div>
        </details>
      {/if}
    </section>

    <section id="game" class="panel game-section">
      <div class="game-head">
        <div>
          <h2>Platform dojo</h2>
          <p>Optional playable proof — collect evidence inline as you play.</p>
        </div>
        <button type="button" class="toggle-game" onclick={() => (showGame = !showGame)}>
          {showGame ? 'Hide game' : 'Launch game'}
        </button>
      </div>

      {#if showGame}
        <NinjaGame onUnlock={onUnlock} />
      {/if}

      {#if unlocks.length}
        <div class="evidence-rail" aria-label="Collected evidence">
          {#each unlocks as item}
            <article class="evidence-card">
              <span class="evidence-type">{item.type}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          {/each}
        </div>
      {:else if showGame}
        <p class="evidence-hint">Collect ★ in-game — evidence appears here (no popups).</p>
      {/if}
    </section>

    <section id="frameworks" class="panel">
      <h2>Framework outputs</h2>
      <p class="disclaimer">{frameworkDisclaimer}</p>
      {#each frameworks.slice(0, 2) as fw}
        <article class="fw-card">
          <h3>{fw.title}</h3>
          <FrameworkViewer steps={fw.steps} disclaimer={fw.subtitle} />
        </article>
      {/each}
      <a href="/frameworks">All frameworks →</a>
    </section>

    <footer class="contact">
      <p>{resume.name} · Principal-led consulting</p>
      <p>
        <a href="mailto:{resume.contact.email}">{resume.contact.email}</a> ·
        <a href={resume.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>
    </footer>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: #fdfdfd;
    color: #0f0f0f;
  }

  .screen.loader {
    min-height: 100vh;
    display: grid;
    place-content: center;
    background: #0f0f0f;
    color: #fdfdfd;
    font: 0.72rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em;
  }

  .boot {
    display: grid;
    gap: 0.6rem;
  }

  .boot span:not(:first-child) {
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.3s, transform 0.3s;
  }

  .boot span.visible {
    opacity: 1;
    transform: none;
  }

  .site {
    max-width: 1100px;
    margin: 0 auto;
    padding: 1rem clamp(1rem, 4vw, 3rem) 4rem;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #0f0f0f;
  }

  .top nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.85rem;
  }

  .top a {
    color: inherit;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  .eyebrow {
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-size: 0.72rem;
  }

  :global(.hero-stage h1) {
    font-size: clamp(3rem, 10vw, 7rem);
    line-height: 0.85;
    margin: 0.5rem 0;
  }

  :global(.hero-stage h1 em) {
    font-style: normal;
    -webkit-text-stroke: 2px #0f0f0f;
    color: transparent;
  }

  .lede {
    max-width: 40ch;
    line-height: 1.5;
    font-size: 1.05rem;
    margin-bottom: 1.5rem;
  }

  .wex-lead {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 1rem;
    border: 2px solid #0f0f0f;
    margin-top: 1rem;
    overflow: hidden;
  }

  .wex-lead__img {
    min-height: 200px;
    background-size: cover;
    background-position: center;
  }

  .wex-lead__body {
    padding: 1rem;
  }

  .wex-lead__body h2 {
    margin: 0 0 0.5rem;
    font-size: 1.1rem;
  }

  .wex-lead__body ul {
    margin: 0.75rem 0 0;
    padding-left: 1rem;
    font-size: 0.85rem;
  }

  .panel {
    margin-top: clamp(3rem, 8vw, 5rem);
  }

  .panel h2 {
    font-size: clamp(1.75rem, 5vw, 3rem);
    letter-spacing: -0.05em;
    margin: 0 0 1rem;
  }

  .section-eyebrow {
    font: 0.72rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.65;
    margin: 0 0 0.35rem;
  }

  .stats-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .stats-panel article {
    border-top: 2px solid #0f0f0f;
    padding: 0.75rem 0;
  }

  .stats-panel strong {
    display: block;
    font-size: 1.4rem;
  }

  .stats-panel span {
    font-size: 0.75rem;
    opacity: 0.7;
  }

  .proof-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .proof-card {
    border: 1px solid #0f0f0f;
    overflow: hidden;
  }

  .proof-img {
    height: 140px;
    background-size: cover;
    background-position: center;
  }

  .proof-body {
    padding: 1rem;
  }

  .proof-body h3 {
    margin: 0 0 0.25rem;
  }

  .role {
    font-size: 0.8rem;
    opacity: 0.65;
    margin: 0 0 0.5rem;
  }

  .proof-body ul {
    margin: 0.5rem 0 0;
    padding-left: 1rem;
    font-size: 0.82rem;
  }

  .archive {
    margin-top: 1.5rem;
    border-top: 1px solid #0f0f0f;
    padding-top: 0.75rem;
  }

  .archive summary {
    cursor: pointer;
    font: 0.72rem 'IBM Plex Mono', monospace;
    opacity: 0.65;
  }

  .archive-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .archive-grid article {
    border: 1px solid #ddd;
    padding: 0.85rem;
    font-size: 0.88rem;
  }

  .game-head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .game-head p {
    margin: 0.25rem 0 0;
    opacity: 0.7;
    font-size: 0.9rem;
  }

  .toggle-game {
    min-height: 44px;
    padding: 0.65rem 1.25rem;
    border: 2px solid #0f0f0f;
    background: #0f0f0f;
    color: #fdfdfd;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .evidence-rail {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 0.75rem;
    margin-top: 1.25rem;
  }

  .evidence-card {
    border: 1px solid #0f0f0f;
    padding: 0.85rem;
    background: #fafafa;
  }

  .evidence-type {
    font: 0.62rem 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    opacity: 0.55;
  }

  .evidence-card h3 {
    margin: 0.35rem 0;
    font-size: 0.95rem;
  }

  .evidence-card p {
    margin: 0;
    font-size: 0.82rem;
    line-height: 1.45;
    opacity: 0.85;
  }

  .evidence-hint {
    margin-top: 1rem;
    font: 0.72rem 'IBM Plex Mono', monospace;
    opacity: 0.55;
  }

  .fw-card {
    border: 1px solid #0f0f0f;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .disclaimer {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-bottom: 1rem;
  }

  .contact {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #0f0f0f;
    text-align: center;
    opacity: 0.85;
  }

  .contact a {
    color: inherit;
  }

  @media (max-width: 720px) {
    .wex-lead {
      grid-template-columns: 1fr;
    }

    .wex-lead__img {
      min-height: 160px;
    }
  }
</style>
