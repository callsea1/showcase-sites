<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    id?: string;
    class?: string;
    children?: Snippet;
  };

  let { id, class: className = '', children }: Props = $props();
</script>

<section {id} class="panel {className}">
  {@render children?.()}
</section>

<style>
  .panel {
    background: var(--glass);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid var(--glass-border);
    border-radius: 1.25rem;
    padding: clamp(1.25rem, 3vw, 2rem);
    box-shadow: 0 18px 48px rgba(30, 42, 50, 0.08);
  }
</style>
