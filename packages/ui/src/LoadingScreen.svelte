<script lang="ts">
  type Props = {
    message?: string;
    progress?: number;
    variant?: 'personal' | 'company';
  };

  let { message = 'Loading…', progress = 0, variant = 'personal' }: Props = $props();
</script>

<div class="loader" class:personal={variant === 'personal'} class:company={variant === 'company'} role="status">
  <div class="loader-ring" aria-hidden="true"></div>
  <p>{message}</p>
  {#if progress > 0}
    <div class="loader-bar" aria-hidden="true">
      <span style={`width: ${Math.min(100, progress)}%`}></span>
    </div>
  {/if}
</div>

<style>
  .loader {
    display: grid;
    place-items: center;
    gap: 1rem;
    min-height: 100vh;
    text-align: center;
    padding: 2rem;
  }

  .loader.personal {
    background: radial-gradient(circle at top, #03049c 0%, #1a1a1a 55%);
    color: #f5f5ff;
  }

  .loader.company {
    background: #fdfdfd;
    color: #0f0f0f;
  }

  .loader-ring {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 3px solid currentColor;
    border-top-color: transparent;
    animation: spin 0.8s linear infinite;
  }

  .loader-bar {
    width: min(240px, 60vw);
    height: 4px;
    background: rgba(127, 127, 127, 0.25);
    border-radius: 999px;
    overflow: hidden;
  }

  .loader-bar span {
    display: block;
    height: 100%;
    background: currentColor;
    transition: width 0.2s ease;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
