<script lang="ts">
  import OfficeGame from '$lib/game/OfficeGame.svelte';
  import { zones, type Zone } from '@showcase/content';
  import { OverlayPanel } from '@showcase/ui';
  import AICommandCenter from '$lib/overlays/AICommandCenter.svelte';
  import LocationFlash from '$lib/overlays/LocationFlash.svelte';
  import type { ZoneScenery } from '@showcase/content';

  let activeZone = $state<Zone | null>(null);
  let showAI = $state(false);
  let frameworkIndex = $state(0);
  let zoneHint = $state<string | null>(null);
  let flashScenery = $state<ZoneScenery | null>(null);
  let pendingZone = $state<Zone | null>(null);

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
    if (zone.scenery) {
      flashScenery = zone.scenery;
      activeZone = null;
      showAI = false;
    } else {
      activeZone = zone;
      if (zoneId === 'whiteboard') {
        showAI = true;
        frameworkIndex = 0;
      }
      pendingZone = null;
    }
  }

  function openZone(zone: Zone) {
    handleZoneEnter(zone.id);
  }
</script>

<div class="office-app">
  <LocationFlash scenery={flashScenery} onDone={onFlashDone} />

  <div class="office-app__hud">
    <span class="hint">{zoneHint ? `Near ${zoneHint}` : 'WASD move · E interact · Space attack'}</span>
    <nav class="zone-nav" aria-label="Quick zone jump">
      {#each zones as zone}
        <button type="button" class:active={activeZone?.id === zone.id} onclick={() => openZone(zone)}>
          {zone.name}
        </button>
      {/each}
    </nav>
  </div>

  <div class="canvas-wrap">
    <OfficeGame
      paused={!!activeZone || showAI}
      onZoneEnter={handleZoneEnter}
      onZoneHint={(label) => (zoneHint = label)}
    />
  </div>

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
      <button type="button" onclick={() => (frameworkIndex = (frameworkIndex - 1 + 7) % 7)}>← Prev</button>
      <button type="button" onclick={() => (frameworkIndex = (frameworkIndex + 1) % 7)}>Next →</button>
    </div>
  </OverlayPanel>
</div>

<style>
  .office-app {
    position: relative;
    display: grid;
    gap: 0.5rem;
  }

  .office-app__hud {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .hint {
    font: 0.68rem 'IBM Plex Mono', monospace;
    opacity: 0.7;
  }

  .zone-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
  }

  .zone-nav button {
    min-height: 44px;
    padding: 0.35rem 0.65rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    border-radius: 999px;
    background: rgba(26, 26, 26, 0.8);
    color: #f5f5ff;
    font-size: 0.65rem;
    cursor: pointer;
  }

  .zone-nav button.active {
    background: #03049c;
  }

  .canvas-wrap {
    height: min(70vh, 520px);
    min-height: 280px;
    border-radius: 0.5rem;
    overflow: hidden;
    background: #1a472a;
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
    min-height: 44px;
    background: transparent;
    border: 1px solid #9ecbff;
    color: #9ecbff;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
</style>
