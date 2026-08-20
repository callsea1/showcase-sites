<script lang="ts">
  import { resume } from '@showcase/content';

  type Sticker = { id: string; label: string; emoji: string; detail: string; unlocked: boolean };

  const leadership = (resume as { leadership?: { id: string; title: string; org: string; detail: string }[] }).leadership ?? [];

  let stickers = $state<Sticker[]>(
    leadership.map((l, i) => ({
      id: l.id,
      label: l.title,
      emoji: ['🏈', '☀️', '🚀', '🏆'][i] ?? '⭐',
      detail: `${l.org} — ${l.detail}`,
      unlocked: false
    }))
  );

  let activeId = $state<string | null>(null);

  function tapSticker(id: string) {
    stickers = stickers.map((s) => (s.id === id ? { ...s, unlocked: true } : s));
    activeId = activeId === id ? null : id;
  }
</script>

<div class="coach">
  <header>
    <span class="kicker">Player-coach</span>
    <h2>Locker room board</h2>
    <p>Tap a sticker to unlock the story — earned by the teams I coach, not handed out.</p>
  </header>

  <div class="helmet-wrap">
    <div class="helmet" aria-hidden="true">
      <div class="helmet__shell"></div>
      <div class="helmet__face"></div>
      {#each stickers as s, i}
        <button
          type="button"
          class="sticker on-helmet"
          class:unlocked={s.unlocked}
          class:active={activeId === s.id}
          style="top: {20 + i * 12}%; left: {15 + (i % 2) * 55}%;"
          aria-label="{s.label}: {s.unlocked ? 'unlocked' : 'tap to unlock'}"
          onclick={() => tapSticker(s.id)}
        >
          {s.emoji}
        </button>
      {/each}
    </div>
  </div>

  <div class="grid">
    {#each stickers as s}
      <button
        type="button"
        class="card"
        class:unlocked={s.unlocked}
        class:active={activeId === s.id}
        onclick={() => tapSticker(s.id)}
      >
        <span class="card__emoji">{s.emoji}</span>
        <strong>{s.label}</strong>
        {#if s.unlocked || activeId === s.id}
          <p>{s.detail}</p>
        {:else}
          <p class="locked">Tap to reveal</p>
        {/if}
      </button>
    {/each}
  </div>
</div>

<style>
  .coach {
    padding: 1rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    border-radius: 0.75rem;
    background: rgba(0, 0, 0, 0.35);
  }

  .kicker {
    font: 0.65rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #ff9f43;
  }

  .coach h2 {
    margin: 0.35rem 0;
    font-size: 1.25rem;
  }

  .coach > header p {
    margin: 0 0 1.25rem;
    font-size: 0.88rem;
    opacity: 0.8;
    max-width: 42ch;
  }

  .helmet-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .helmet {
    position: relative;
    width: min(200px, 50vw);
    height: min(180px, 45vw);
  }

  .helmet__shell {
    position: absolute;
    inset: 0 10% 20% 10%;
    background: linear-gradient(145deg, #2a4a7a, #1a3050);
    border-radius: 50% 50% 45% 45%;
    border: 3px solid #9ecbff;
    box-shadow: inset 0 -8px 20px rgba(0, 0, 0, 0.4);
  }

  .helmet__face {
    position: absolute;
    bottom: 15%;
    left: 20%;
    right: 20%;
    height: 35%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 40% 40%;
  }

  .sticker.on-helmet {
    position: absolute;
    min-width: 44px;
    min-height: 44px;
    width: 2.5rem;
    height: 2.5rem;
    border: 2px dashed rgba(255, 159, 67, 0.5);
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
  }

  .sticker.unlocked {
    border-style: solid;
    border-color: #ff9f43;
    transform: scale(1.05);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .card {
    min-height: 44px;
    padding: 0.85rem;
    text-align: left;
    border: 1px solid rgba(158, 203, 255, 0.25);
    border-radius: 0.5rem;
    background: rgba(0, 0, 0, 0.3);
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.2s;
  }

  .card.unlocked,
  .card.active {
    border-color: #ff9f43;
  }

  .card__emoji {
    font-size: 1.25rem;
    display: block;
    margin-bottom: 0.35rem;
  }

  .card strong {
    display: block;
    font-size: 0.85rem;
    margin-bottom: 0.35rem;
  }

  .card p {
    margin: 0;
    font-size: 0.75rem;
    opacity: 0.85;
    line-height: 1.4;
  }

  .locked {
    opacity: 0.5 !important;
    font-style: italic;
  }
</style>
