<script lang="ts">
  import { resume } from '@showcase/content';
</script>

<svelte:head>
  <title>404 — Phased Through the Wall</title>
</svelte:head>

<main class="error">
  <h1>You've phased through the wall.</h1>
  <p>That zone doesn't exist in the executive suite.</p>
  <a href="/">Return to spawn point</a>
  <p class="meta">{resume.name}</p>
</main>

<style>
  .error {
    min-height: 100vh;
    display: grid;
    place-content: center;
    text-align: center;
    gap: 1rem;
    background: #1a1a1a;
    color: #f5f5ff;
    padding: 2rem;
  }

  a {
    color: #9ecbff;
  }

  .meta {
    opacity: 0.5;
    font-size: 0.85rem;
  }
</style>
