<script lang="ts">
  import { onMount } from 'svelte';
  import { resume, stats, zones, type Zone } from '@showcase/content';
  import { prefersReducedMotion, OverlayPanel } from '@showcase/ui';
  import OfficeGame from '$lib/game/OfficeGame.svelte';
  import CrtMonitor from '$lib/landing/CrtMonitor.svelte';
  import AICommandCenter from '$lib/overlays/AICommandCenter.svelte';
  import LocationFlash from '$lib/overlays/LocationFlash.svelte';
  import type { ZoneScenery } from '@showcase/content';

  let started = $state(false);
  let loading = $state(true);
  let useFallback = $state(false);
  let activeZone = $state<Zone | null>(null);
  let showAI = $state(false);
  let frameworkIndex = $state(0);
  let zoneHint = $state<string | null>(null);
  let bootLine = $state(0);
  let flashScenery = $state<ZoneScenery | null>(null);
  let pendingZone = $state<Zone | null>(null);

  const entryScenery: ZoneScenery = {
    city: 'Chicago',
    region: 'Illinois',
    workplace: 'Executive Suite · Floor 47',
    skyline: 'chicago',
    colors: ['#234d66', '#4a90a4', '#2d6a4f'],
    image: 'https://images.unsplash.com/photo-1478821666625-58124673a113?w=1400&q=80&auto=format&fit=crop'
  };

  const bootMessages = [
    'SEAN.OS v2026.1 booting…',
    'Loading Chicago executive suite…',
    'Calibrating AI command center…',
    'Grant Park viewport online…',
    '100X MODE READY'
  ];

  onMount(() => {
    useFallback = prefersReducedMotion();
    const bootInterval = setInterval(() => {
      bootLine = Math.min(bootLine + 1, bootMessages.length - 1);
    }, 420);
    setTimeout(() => {
      loading = false;
      clearInterval(bootInterval);
    }, 2200);
  });

  function triggerScenery(zone: Zone | null) {
    if (!zone?.scenery) return;
    flashScenery = zone.scenery;
  }

  function onFlashDone() {
    flashScenery = null;
    if (pendingZone) {
      activeZone = pendingZone;
      if (pendingZone.id === 'whiteboard') {
        showAI = true;
        frameworkIndex = 0;
      }
      pendingZone = null;
    }
  }

  function handleZoneEnter(zoneId: string) {
    const zone = zones.find((z) => z.id === zoneId) ?? null;
    if (!zone) return;
    pendingZone = zone;
    triggerScenery(zone);
    if (!zone.scenery) {
      activeZone = zone;
      if (zoneId === 'whiteboard') {
        showAI = true;
        frameworkIndex = 0;
      }
      pendingZone = null;
    } else {
      activeZone = null;
      showAI = false;
    }
  }

  function openZone(zone: Zone) {
    pendingZone = zone;
    triggerScenery(zone);
    if (!zone.scenery) {
      activeZone = zone;
      if (zone.id === 'whiteboard') showAI = true;
      pendingZone = null;
    } else {
      activeZone = null;
      showAI = false;
    }
  }

  function enterOffice() {
    flashScenery = entryScenery;
    started = true;
  }
</script>

<svelte:head>
  <title>{resume.name} — Principal Engineer</title>
  <meta name="description" content={resume.tagline} />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="preconnect" href="https://images.unsplash.com" crossorigin="anonymous" />
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
{:else if !started}
  <div class="screen landing">
    <header class="terminal-nav">
      <span>SPC / CHICAGO IL</span>
      <span>STATUS: AVAILABLE FOR IMPACT <i></i></span>
    </header>

    <div class="landing-stage">
      <CrtMonitor />

      <div class="landing-copy">
        <p class="eyebrow">seanpcallahan.net / executive terminal</p>
        <h1>{resume.name}</h1>
        <p class="title">{resume.title}</p>
        <p class="tagline">{resume.tagline}</p>
      </div>
    </div>

    <div class="stats">
      {#each stats as stat}
        <div>
          <strong>{stat.prefix ?? ''}{stat.value}{stat.suffix}</strong>
          <span>{stat.label}</span>
        </div>
      {/each}
    </div>

    <div class="cta-row">
      {#if useFallback}
        <a class="enter-btn" href="/fallback">
          <span class="enter-btn__glow"></span>
          <span class="enter-btn__label">Open Accessible Portfolio</span>
          <span class="enter-btn__hint">Reduced motion mode</span>
        </a>
      {:else}
        <button class="enter-btn" type="button" onclick={enterOffice}>
          <span class="enter-btn__glow"></span>
          <span class="enter-btn__label">Enter the Office</span>
          <span class="enter-btn__hint">WASD · inspect zones · debug tech debt</span>
        </button>
      {/if}
    </div>

    <p class="hint">
      Walk the high-rise suite overlooking Grant Park — discover resume proof, awards, and the AI Command Center.
    </p>
  </div>
{:else if useFallback}
  <div class="screen landing">
    <a class="enter-btn" href="/fallback">Open accessible portfolio</a>
  </div>
{:else}
  <div class="experience">
    <LocationFlash scenery={flashScenery} onDone={onFlashDone} />

    <header class="hud">
      <div>
        <strong>{resume.name}</strong>
        <span>{resume.title}{zoneHint ? ` · near ${zoneHint}` : ''}</span>
      </div>
      <nav>
        <a href="/frameworks">Frameworks</a>
        <a href="https://3ninjallc.com" target="_blank" rel="noreferrer">3 Ninja LLC</a>
        <a href={resume.contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        <button type="button" class="exit-btn" onclick={() => (started = false)}>← Terminal</button>
      </nav>
    </header>

    <div class="canvas-wrap">
      <OfficeGame
        paused={!!activeZone || showAI}
        onZoneEnter={handleZoneEnter}
        onZoneHint={(label) => (zoneHint = label)}
      />
    </div>

    <aside class="zone-list" aria-label="Office zones">
      {#each zones as zone}
        <button type="button" class:active={activeZone?.id === zone.id} onclick={() => openZone(zone)}>
          {zone.name}
        </button>
      {/each}
    </aside>

    <OverlayPanel
      show={!!activeZone && !showAI}
      title={activeZone?.title ?? ''}
      subtitle={activeZone?.name}
      variant="personal"
      onclose={() => (activeZone = null)}
    >
      {#if activeZone}
        <p>{activeZone.body}</p>
        <div class="tags">
          {#each activeZone.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {/if}
    </OverlayPanel>

    <OverlayPanel
      show={showAI}
      title="AI Command Center"
      subtitle="Representative framework"
      variant="personal"
      onclose={() => {
        showAI = false;
        activeZone = null;
      }}
    >
      <AICommandCenter activeFrameworkIndex={frameworkIndex} />
      <div class="framework-nav">
        <button
          type="button"
          onclick={() => (frameworkIndex = (frameworkIndex - 1 + 7) % 7)}
        >
          ← Prev framework
        </button>
        <button type="button" onclick={() => (frameworkIndex = (frameworkIndex + 1) % 7)}>
          Next framework →
        </button>
      </div>
    </OverlayPanel>
  </div>
{/if}

<style>
  :global(body) {
    margin: 0;
    font-family: 'Space Grotesk', system-ui, sans-serif;
    background: #1a1a1a;
    color: #f5f5ff;
  }

  .screen {
    min-height: 100vh;
    display: grid;
    place-content: center;
    padding: 2rem;
    text-align: center;
    gap: 1rem;
  }

  .landing {
    position: relative;
    overflow: hidden;
    display: block;
    min-height: 100vh;
    padding: 1.25rem clamp(1.25rem, 6vw, 6rem);
    text-align: left;
    background:
      radial-gradient(circle at 70% 30%, rgba(3, 4, 156, 0.45), transparent 42%),
      radial-gradient(circle at 20% 80%, rgba(93, 255, 149, 0.08), transparent 35%),
      #1a1a1a;
  }

  .landing::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0.14;
    background: repeating-linear-gradient(0deg, transparent 0 3px, #9ecbff 4px);
    mix-blend-mode: screen;
  }

  .terminal-nav {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    font: 0.68rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    opacity: 0.8;
  }

  .terminal-nav i {
    display: inline-block;
    width: 0.45rem;
    height: 0.45rem;
    margin-left: 0.3rem;
    border-radius: 50%;
    background: #5dff95;
    box-shadow: 0 0 12px #5dff95;
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
  }

  .landing-stage {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: minmax(260px, 1fr) minmax(280px, 0.8fr);
    align-items: center;
    gap: clamp(2rem, 8vw, 8rem);
    min-height: 72vh;
  }

  .landing-copy {
    max-width: 540px;
  }

  .loading {
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

  .eyebrow {
    letter-spacing: 0.2em;
    text-transform: uppercase;
    font-size: 0.75rem;
    opacity: 0.7;
  }

  h1 {
    font-size: clamp(3rem, 7vw, 6rem);
    line-height: 0.9;
    margin: 0;
    letter-spacing: -0.07em;
  }

  .title {
    font-family: 'IBM Plex Mono', monospace;
    color: #9ecbff;
  }

  .landing-copy h1 {
    margin-top: 0.5rem;
  }

  .tagline {
    max-width: 52ch;
    line-height: 1.6;
    opacity: 0.9;
  }

  .stats {
    position: relative;
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1.5rem 0;
  }

  .stats div {
    min-width: 100px;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    border-radius: 0.75rem;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(4px);
  }

  .stats strong {
    display: block;
    font-size: 1.25rem;
  }

  .stats span {
    font-size: 0.75rem;
    opacity: 0.75;
  }

  .cta-row {
    position: relative;
    z-index: 1;
    margin-top: 0.5rem;
  }

  .enter-btn {
    position: relative;
    display: inline-grid;
    gap: 0.15rem;
    padding: 1rem 2rem 0.85rem;
    border: 1px solid rgba(158, 203, 255, 0.55);
    border-radius: 0.5rem;
    background: linear-gradient(135deg, #03049c 0%, #1a1f8c 100%);
    color: white;
    font-family: 'IBM Plex Mono', monospace;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    text-align: left;
    overflow: hidden;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
    box-shadow:
      0 0 0 1px rgba(3, 4, 156, 0.8),
      0 12px 40px rgba(3, 4, 156, 0.45),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
  }

  .enter-btn:hover {
    transform: translateY(-2px);
    box-shadow:
      0 0 0 1px rgba(158, 203, 255, 0.6),
      0 16px 50px rgba(3, 4, 156, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.18);
  }

  .enter-btn:active {
    transform: translateY(0);
  }

  .enter-btn__glow {
    position: absolute;
    inset: -50%;
    background: radial-gradient(circle, rgba(158, 203, 255, 0.25), transparent 60%);
    animation: btn-glow 3s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes btn-glow {
    0%,
    100% {
      transform: translate(-20%, -20%);
    }
    50% {
      transform: translate(20%, 20%);
    }
  }

  .enter-btn__label {
    position: relative;
    font-size: 1rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .enter-btn__hint {
    position: relative;
    font-size: 0.65rem;
    font-weight: 400;
    opacity: 0.65;
    letter-spacing: 0.06em;
    text-transform: none;
  }

  .hint {
    position: relative;
    z-index: 1;
    font-size: 0.85rem;
    opacity: 0.65;
    max-width: 48ch;
    margin: 1rem 0 0;
    line-height: 1.5;
  }

  .experience {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr;
    position: relative;
  }

  .hud {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(3, 4, 156, 0.4);
    z-index: 2;
  }

  .hud span {
    display: block;
    font-size: 0.8rem;
    opacity: 0.7;
  }

  .hud nav {
    display: flex;
    gap: 1rem;
    align-items: center;
    font-size: 0.85rem;
  }

  .hud a {
    color: #9ecbff;
    text-decoration: none;
  }

  .exit-btn {
    background: transparent;
    border: 1px solid rgba(158, 203, 255, 0.4);
    color: #9ecbff;
    padding: 0.35rem 0.65rem;
    border-radius: 0.35rem;
    font-size: 0.75rem;
    cursor: pointer;
    font-family: inherit;
  }

  .canvas-wrap {
    height: calc(100vh - 64px);
    min-height: 480px;
    padding: 0.75rem;
    background: #0d1117;
  }

  .zone-list {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    display: grid;
    gap: 0.35rem;
    z-index: 2;
  }

  .zone-list button {
    text-align: left;
    padding: 0.4rem 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    background: rgba(26, 26, 26, 0.8);
    color: #f5f5ff;
    font-size: 0.75rem;
    cursor: pointer;
  }

  .zone-list button.active {
    background: #03049c;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    border: 1px solid currentColor;
  }

  .framework-nav {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-top: 1rem;
  }

  .framework-nav button {
    background: transparent;
    border: 1px solid #9ecbff;
    color: #9ecbff;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  @media (max-width: 720px) {
    .landing-stage {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding-top: 2rem;
      min-height: auto;
    }

    .terminal-nav {
      font-size: 0.55rem;
      flex-direction: column;
      gap: 0.35rem;
    }

    .zone-list {
      display: none;
    }
  }
</style>
