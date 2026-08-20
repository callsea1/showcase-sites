<script lang="ts">
  import { resume } from '@showcase/content';

  type Props = { reducedMotion?: boolean };
  let { reducedMotion = false }: Props = $props();

  const timeline = (resume as { timeline?: { year: string; role: string; org: string; highlight: string }[] }).timeline ?? [];
  const skills = resume.skills;
</script>

<div class="orbit" class:static={reducedMotion}>
  <div class="stars" aria-hidden="true"></div>

  <header class="orbit__head">
    <span class="kicker">Career orbit</span>
    <h2>{resume.name}</h2>
    <p>{resume.title} · {resume.location}</p>
  </header>

  <div class="timeline">
    {#each timeline as entry, i}
      <article class="stop" style="--delay: {i * 0.08}s">
        <div class="stop__dot"></div>
        <div class="stop__body">
          <time>{entry.year}</time>
          <h3>{entry.role}</h3>
          <p class="org">{entry.org}</p>
          <p class="highlight">{entry.highlight}</p>
        </div>
      </article>
    {/each}
  </div>

  <section class="skills">
    <h3>Core stack</h3>
    <div class="chips">
      {#each skills as skill}
        <span>{skill}</span>
      {/each}
    </div>
  </section>

  <section class="highlights">
    <h3>Highlights</h3>
    <ul>
      {#each resume.highlights as h}
        <li>{h}</li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .orbit {
    position: relative;
    padding: 1.5rem 1rem 2rem;
    border: 1px solid rgba(3, 4, 156, 0.5);
    border-radius: 0.75rem;
    background: linear-gradient(180deg, #0d1117 0%, #1a1a2e 50%, #0d1117 100%);
    overflow: hidden;
  }

  .stars {
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 20% 30%, #fff, transparent),
      radial-gradient(1px 1px at 60% 70%, rgba(158, 203, 255, 0.8), transparent),
      radial-gradient(1px 1px at 80% 20%, #fff, transparent),
      radial-gradient(1px 1px at 40% 80%, rgba(93, 255, 149, 0.6), transparent);
    background-size: 200% 200%;
    animation: drift 60s linear infinite;
    opacity: 0.6;
    pointer-events: none;
  }

  .orbit.static .stars {
    animation: none;
  }

  @keyframes drift {
    to {
      background-position: 200% 200%;
    }
  }

  .orbit__head {
    position: relative;
    z-index: 1;
    margin-bottom: 2rem;
  }

  .kicker {
    font: 0.65rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #9ecbff;
  }

  .orbit__head h2 {
    margin: 0.35rem 0 0;
    font-size: clamp(1.5rem, 4vw, 2rem);
  }

  .orbit__head p {
    margin: 0.25rem 0 0;
    opacity: 0.75;
    font-size: 0.9rem;
  }

  .timeline {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 1.5rem;
    padding-left: 1.5rem;
    border-left: 2px solid rgba(158, 203, 255, 0.25);
  }

  .stop {
    position: relative;
    animation: fadeUp 0.5s ease backwards;
    animation-delay: var(--delay);
  }

  .orbit.static .stop {
    animation: none;
  }

  @keyframes fadeUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
  }

  .stop__dot {
    position: absolute;
    left: -1.65rem;
    top: 0.35rem;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #9ecbff;
    box-shadow: 0 0 12px #9ecbff;
  }

  .stop time {
    font: 0.7rem 'IBM Plex Mono', monospace;
    color: #9ecbff;
    opacity: 0.85;
  }

  .stop h3 {
    margin: 0.25rem 0 0;
    font-size: 1.05rem;
  }

  .org {
    margin: 0.15rem 0;
    font-weight: 600;
    opacity: 0.9;
  }

  .highlight {
    margin: 0.35rem 0 0;
    font-size: 0.88rem;
    opacity: 0.75;
    line-height: 1.5;
  }

  .skills,
  .highlights {
    position: relative;
    z-index: 1;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(158, 203, 255, 0.15);
  }

  .skills h3,
  .highlights h3 {
    font: 0.7rem 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    opacity: 0.7;
    margin: 0 0 0.75rem;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .chips span {
    font-size: 0.72rem;
    padding: 0.35rem 0.65rem;
    border: 1px solid rgba(158, 203, 255, 0.3);
    border-radius: 999px;
  }

  .highlights ul {
    margin: 0;
    padding-left: 1.1rem;
    font-size: 0.88rem;
    line-height: 1.6;
    opacity: 0.9;
  }
</style>
