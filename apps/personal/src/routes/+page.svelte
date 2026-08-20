<script lang="ts">
  import { onMount } from 'svelte';
  import { resume, stats, appLauncher } from '@showcase/content';
  import { prefersReducedMotion } from '@showcase/ui';
  import CrtMonitor from '$lib/landing/CrtMonitor.svelte';
  import AppLauncher from '$lib/apps/AppLauncher.svelte';
  import MarketSimulator from '$lib/apps/MarketSimulator.svelte';
  import OfficeAdventureApp from '$lib/apps/OfficeAdventureApp.svelte';
  import MfeLab from '$lib/apps/MfeLab.svelte';
  import CareerOrbit from '$lib/apps/CareerOrbit.svelte';
  import CoachBoard from '$lib/apps/CoachBoard.svelte';

  let loading = $state(true);
  let useFallback = $state(false);
  let activeApp = $state('market');
  let bootLine = $state(0);
  let viewportEl = $state<HTMLElement | undefined>(undefined);

  const statusText = (resume as { status?: string }).status ?? 'Engaged, but open to a chat';

  const bootMessages = [
    'SEAN.OS v2026.2 booting…',
    'Loading portfolio apps…',
    'Calibrating evidence modules…',
    'READY'
  ];

  onMount(() => {
    useFallback = prefersReducedMotion();
    const bootInterval = setInterval(() => {
      bootLine = Math.min(bootLine + 1, bootMessages.length - 1);
    }, 380);
    setTimeout(() => {
      loading = false;
      clearInterval(bootInterval);
    }, 1600);
  });

  function selectApp(id: string) {
    activeApp = id;
    requestAnimationFrame(() => {
      viewportEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
</script>

<svelte:head>
  <title>{resume.name} — Principal Engineer</title>
  <meta name="description" content={resume.tagline} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@400;600;700&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{#if loading}
  <div class="screen loading">
    <div class="boot-log">
      {#each bootMessages.slice(0, bootLine + 1) as line, i}
        <p class:active={i === bootLine}>{line}</p>
      {/each}
    </div>
    <div class="loader-bar"><span style="width: {((bootLine + 1) / bootMessages.length) * 100}%"></span></div>
  </div>
{:else}
  <div class="page">
    <header class="terminal-nav">
      <span>SPC / CHICAGO</span>
      <span>STATUS: {statusText.toUpperCase()} <i class="status-dot"></i></span>
    </header>

    <section class="hero">
      <div class="hero__visual">
        <CrtMonitor />
      </div>
      <div class="hero__copy">
        <p class="eyebrow">seanpcallahan.net</p>
        <h1>{resume.name}</h1>
        <p class="title">{resume.title}</p>
        <p class="tagline">{resume.tagline}</p>
        <div class="stats">
          {#each stats as stat}
            <div>
              <strong>{stat.prefix ?? ''}{stat.value}{stat.suffix}</strong>
              <span>{stat.label}</span>
            </div>
          {/each}
        </div>
        {#if useFallback}
          <a class="fallback-link" href="/fallback">Open accessible portfolio →</a>
        {/if}
      </div>
    </section>

    <AppLauncher apps={appLauncher} activeId={activeApp} onSelect={selectApp} />

    <section class="viewport" bind:this={viewportEl} aria-live="polite" aria-label="Active portfolio application">
      {#if activeApp === 'market'}
        <MarketSimulator />
      {:else if activeApp === 'office'}
        <OfficeAdventureApp />
      {:else if activeApp === 'mfe'}
        <MfeLab />
      {:else if activeApp === 'orbit'}
        <CareerOrbit reducedMotion={useFallback} />
      {:else if activeApp === 'coach'}
        <CoachBoard />
      {/if}
    </section>

    <footer class="footer">
      <nav>
        <a href="/frameworks">Frameworks</a>
        <a href="https://3ninjallc.com" target="_blank" rel="noreferrer">3 Ninja LLC</a>
        <a href={resume.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="mailto:{resume.contact.email}">Contact</a>
      </nav>
    </footer>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: #1a1a1a;
    color: #f5f5ff;
  }

  .screen.loading {
    min-height: 100vh;
    display: grid;
    place-content: center;
    padding: 2rem;
    background: radial-gradient(circle at top, #03049c, #1a1a1a 60%);
    font-family: 'IBM Plex Mono', monospace;
    gap: 1.5rem;
  }

  .boot-log p {
    margin: 0.25rem 0;
    font-size: 0.85rem;
    opacity: 0.5;
    letter-spacing: 0.08em;
  }

  .boot-log p.active {
    opacity: 1;
    color: #9ecbff;
  }

  .loader-bar {
    width: min(320px, 80vw);
    height: 3px;
    background: rgba(158, 203, 255, 0.15);
    border-radius: 999px;
    overflow: hidden;
  }

  .loader-bar span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #03049c, #9ecbff);
    transition: width 0.35s ease;
  }

  .page {
    min-height: 100vh;
    padding: 1.25rem clamp(1rem, 5vw, 4rem) 3rem;
    background:
      radial-gradient(circle at 70% 20%, rgba(3, 4, 156, 0.35), transparent 40%),
      #1a1a1a;
  }

  .terminal-nav {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    font: 0.68rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    opacity: 0.85;
    margin-bottom: 1.5rem;
  }

  .status-dot {
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    margin-left: 0.3rem;
    border-radius: 50%;
    background: #ff9f43;
    box-shadow: 0 0 12px #ff9f43;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(240px, 1fr) minmax(260px, 0.85fr);
    gap: clamp(1.5rem, 6vw, 4rem);
    align-items: center;
    margin-bottom: 1rem;
  }

  .eyebrow {
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  h1 {
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 0.92;
    margin: 0.35rem 0;
    letter-spacing: -0.06em;
  }

  .title {
    font-family: 'IBM Plex Mono', monospace;
    color: #9ecbff;
    margin: 0;
  }

  .tagline {
    max-width: 48ch;
    line-height: 1.55;
    opacity: 0.88;
    font-size: 0.95rem;
    margin: 0.75rem 0 1rem;
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
  }

  .stats div {
    min-width: 90px;
    padding: 0.6rem 0.85rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    border-radius: 0.5rem;
    background: rgba(0, 0, 0, 0.25);
  }

  .stats strong {
    display: block;
    font-size: 1.1rem;
  }

  .stats span {
    font-size: 0.68rem;
    opacity: 0.72;
  }

  .fallback-link {
    display: inline-block;
    margin-top: 1rem;
    color: #9ecbff;
    font-size: 0.85rem;
  }

  .viewport {
    min-height: 320px;
    margin-top: 0.5rem;
    scroll-margin-top: 5rem;
  }

  .footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(158, 203, 255, 0.15);
  }

  .footer nav {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    font-size: 0.85rem;
  }

  .footer a {
    color: #9ecbff;
    text-decoration: none;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
  }

  @media (max-width: 720px) {
    .hero {
      grid-template-columns: 1fr;
    }

    .terminal-nav {
      font-size: 0.58rem;
    }
  }
</style>
