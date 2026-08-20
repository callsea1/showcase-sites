<script lang="ts">
  import type { JanicaResume } from '@showcase/content';
  import GlassPanel from './GlassPanel.svelte';

  type Props = {
    resume: JanicaResume;
  };

  let { resume }: Props = $props();
</script>

<GlassPanel id="contact">
  <h2>Contact</h2>
  <p class="lede">Ready to connect across Chicago, Dubai, and beyond.</p>
  <div class="links">
    <a href="mailto:{resume.contact.email}">{resume.contact.email}</a>
    <a href="tel:{resume.contact.phone.replace(/[^0-9+]/g, '')}">{resume.contact.phone}</a>
    <a href="https://www.3ninjallc.com" target="_blank" rel="noreferrer">Three Ninja LLC</a>
  </div>
</GlassPanel>

<style>
  h2 {
    margin: 0 0 0.5rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  .lede {
    margin: 0 0 1rem;
    color: rgba(30, 42, 50, 0.7);
  }

  .links {
    display: grid;
    gap: 0.65rem;
  }

  .links a {
    font-weight: 600;
    text-decoration: none;
    padding: 0.75rem 1rem;
    border-radius: 0.85rem;
    background: rgba(255, 255, 255, 0.55);
    border: 1px solid rgba(30, 42, 50, 0.08);
    transition: transform 0.2s ease;
  }

  .links a:hover {
    transform: translateX(4px);
  }
</style>
