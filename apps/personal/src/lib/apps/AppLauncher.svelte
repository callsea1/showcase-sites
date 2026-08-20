<script lang="ts">
  import type { AppLauncherItem } from '@showcase/content';

  type Props = {
    apps: AppLauncherItem[];
    activeId: string;
    onSelect: (id: string) => void;
  };

  let { apps, activeId, onSelect }: Props = $props();
</script>

<nav class="launcher" aria-label="Portfolio applications">
  <div class="launcher__scroll">
    {#each apps as app (app.id)}
      <button
        type="button"
        class="pill"
        class:active={activeId === app.id}
        aria-pressed={activeId === app.id}
        aria-label="{app.label}: {app.description}"
        onclick={() => onSelect(app.id)}
      >
        <span class="pill__label">{app.label}</span>
        <span class="pill__short">{app.shortLabel}</span>
      </button>
    {/each}
  </div>
</nav>

<style>
  .launcher {
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 0.75rem 0;
    background: linear-gradient(180deg, rgba(26, 26, 26, 0.98) 70%, transparent);
    backdrop-filter: blur(8px);
  }

  .launcher__scroll {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .launcher__scroll::-webkit-scrollbar {
    display: none;
  }

  .pill {
    flex: 0 0 auto;
    min-height: 44px;
    min-width: 44px;
    padding: 0.6rem 1rem;
    border: 1px solid rgba(158, 203, 255, 0.35);
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.35);
    color: #f5f5ff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.15s;
  }

  .pill:hover {
    border-color: rgba(158, 203, 255, 0.7);
    transform: translateY(-1px);
  }

  .pill.active {
    background: linear-gradient(135deg, #03049c, #1a1f8c);
    border-color: #9ecbff;
    box-shadow: 0 0 20px rgba(3, 4, 156, 0.5);
  }

  .pill__short {
    display: none;
  }

  @media (max-width: 640px) {
    .pill__label {
      display: none;
    }

    .pill__short {
      display: inline;
    }

    .pill {
      padding: 0.65rem 0.85rem;
    }
  }
</style>
