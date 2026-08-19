<script lang="ts">
  import { prefersReducedMotion } from './motion';

  type Props = {
    show?: boolean;
    title?: string;
    subtitle?: string;
    onclose?: () => void;
    children?: import('svelte').Snippet;
    variant?: 'personal' | 'company';
  };

  let { show = false, title = '', subtitle = '', onclose, children, variant = 'personal' }: Props = $props();

  const reduced = prefersReducedMotion();
</script>

{#if show}
  <div
    class="overlay-backdrop"
    class:personal={variant === 'personal'}
    class:company={variant === 'company'}
    role="dialog"
    aria-modal="true"
    aria-label={title}
    tabindex="-1"
    onclick={(e) => e.target === e.currentTarget && onclose?.()}
    onkeydown={(e) => e.key === 'Escape' && onclose?.()}
  >
    <article class="overlay-panel" class:personal={variant === 'personal'} class:company={variant === 'company'} class:no-motion={reduced}>
      <header class="overlay-header">
        <div>
          {#if subtitle}
            <p class="overlay-subtitle">{subtitle}</p>
          {/if}
          <h2>{title}</h2>
        </div>
        <button type="button" class="overlay-close" onclick={() => onclose?.()} aria-label="Close">
          ×
        </button>
      </header>
      <div class="overlay-body">
        {@render children?.()}
      </div>
    </article>
  </div>
{/if}

<style>
  .overlay-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: grid;
    place-items: center;
    padding: 1.5rem;
    backdrop-filter: blur(8px);
  }

  .overlay-backdrop.personal {
    background: rgba(3, 4, 156, 0.55);
  }

  .overlay-backdrop.company {
    background: rgba(15, 15, 15, 0.72);
  }

  .overlay-panel {
    width: min(640px, 100%);
    max-height: min(80vh, 720px);
    overflow: auto;
    border-radius: 1rem;
    padding: 1.5rem;
    animation: slide-up 0.35s ease;
  }

  .overlay-panel.personal,
  .overlay-backdrop.personal .overlay-panel {
    background: #1a1a1a;
    color: #f5f5ff;
    border: 1px solid rgba(3, 4, 156, 0.8);
    box-shadow: 0 24px 80px rgba(3, 4, 156, 0.35);
  }

  .overlay-backdrop.company .overlay-panel {
    background: #fdfdfd;
    color: #0f0f0f;
    border: 1px solid #0f0f0f;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
  }

  .overlay-panel.no-motion {
    animation: none;
  }

  .overlay-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .overlay-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
  }

  .overlay-subtitle {
    font-size: 0.75rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    opacity: 0.72;
    margin-bottom: 0.35rem;
  }

  .overlay-close {
    border: none;
    background: transparent;
    font-size: 1.75rem;
    line-height: 1;
    cursor: pointer;
    opacity: 0.8;
  }

  .overlay-body :global(p) {
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .overlay-body :global(.tags) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .overlay-body :global(.tag) {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    border: 1px solid currentColor;
    opacity: 0.85;
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
