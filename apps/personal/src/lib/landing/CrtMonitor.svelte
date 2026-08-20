<script lang="ts">
  import { onMount } from 'svelte';
  import { prefersReducedMotion } from '@showcase/ui';

  let crtZone: HTMLDivElement;
  let preview: HTMLDivElement;
  let hovering = $state(false);
  let reducedMotion = $state(false);

  let tiltX = $state(2);
  let tiltY = $state(8);
  let floatY = $state(0);

  let beaconX = $state(0);
  let beaconY = $state(0);
  let shadowX = $state(0);
  let shadowY = $state(0);

  const patrol = [
    { x: 0, y: 0 },
    { x: 18, y: -12 },
    { x: 8, y: -24 },
    { x: -12, y: -8 }
  ];

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let shadowCurrentX = 0;
  let shadowCurrentY = 0;

  let raf = 0;
  let lastTime = 0;

  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }

  function patrolPosition(time: number) {
    const speed = 0.35;
    const t = (time * speed) % patrol.length;
    const i = Math.floor(t);
    const f = t - i;
    const from = patrol[i % patrol.length];
    const to = patrol[(i + 1) % patrol.length];
    return {
      x: lerp(from.x, to.x, f),
      y: lerp(from.y, to.y, f)
    };
  }

  function handleMouseMove(event: MouseEvent) {
    if (!preview || reducedMotion) return;
    const rect = preview.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    targetX = Math.max(4, Math.min(rect.width - 12, x - 4));
    targetY = Math.max(4, Math.min(rect.height - 14, y - 5));

    if (crtZone) {
      const zoneRect = crtZone.getBoundingClientRect();
      const nx = (event.clientX - zoneRect.left) / zoneRect.width - 0.5;
      const ny = (event.clientY - zoneRect.top) / zoneRect.height - 0.5;
      tiltY = 8 + nx * 8;
      tiltX = 2 - ny * 6;
    }
  }

  function handleEnter() {
    if (reducedMotion) return;
    hovering = true;
    currentX = targetX;
    currentY = targetY;
    shadowCurrentX = targetX + 4;
    shadowCurrentY = targetY + 4;
  }

  function handleLeave() {
    hovering = false;
    tiltX = 2;
    tiltY = 8;
  }

  function tick(time: number) {
    lastTime = time;

    if (!reducedMotion) {
      floatY = Math.sin(time / 1200) * -6;
    }

    if (hovering && !reducedMotion) {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);
      shadowCurrentX = lerp(shadowCurrentX, currentX + 5, 0.07);
      shadowCurrentY = lerp(shadowCurrentY, currentY + 6, 0.07);
    } else if (!reducedMotion) {
      const pos = patrolPosition(time / 1000);
      currentX = lerp(currentX, pos.x + preview?.clientWidth * 0.45 - 4 || 0, 0.08);
      currentY = lerp(currentY, pos.y + preview?.clientHeight * 0.62 - 5 || 0, 0.08);
      shadowCurrentX = lerp(shadowCurrentX, currentX + 5, 0.06);
      shadowCurrentY = lerp(shadowCurrentY, currentY + 6, 0.06);
    }

    beaconX = currentX;
    beaconY = currentY;
    shadowX = shadowCurrentX;
    shadowY = shadowCurrentY;

    raf = requestAnimationFrame(tick);
  }

  onMount(() => {
    reducedMotion = prefersReducedMotion();
    if (preview) {
      currentX = preview.clientWidth * 0.45 - 4;
      currentY = preview.clientHeight * 0.62 - 5;
      shadowCurrentX = currentX + 5;
      shadowCurrentY = currentY + 6;
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  });
</script>

<div
  class="crt-zone"
  bind:this={crtZone}
  aria-hidden="true"
  onmouseenter={handleEnter}
  onmouseleave={handleLeave}
  onmousemove={handleMouseMove}
  style="transform: perspective(900px) rotateY({tiltY}deg) rotateX({tiltX}deg) translateY({floatY}px)"
>
  <div class="crt-shadow" aria-hidden="true"></div>

  <div class="crt-stand">
    <div class="crt-stand-neck"></div>
    <div class="crt-stand-base"></div>
  </div>

  <div class="crt-body">
    <div class="crt-bezel-top"></div>
    <div class="crt-bezel-side"></div>

    <div class="crt-screen-recess">
      <div class="crt-screen">
        <div class="crt-scanlines"></div>
        <div class="crt-glass"></div>

        <div class="crt-preview" bind:this={preview}>
          <div class="mini-map"></div>
          <div
            class="mini-player-shadow"
            class:patrol={!hovering && !reducedMotion}
            style="transform: translate({shadowX}px, {shadowY}px)"
          ></div>
          <div
            class="mini-player"
            class:patrol={!hovering && !reducedMotion}
            style="transform: translate({beaconX}px, {beaconY}px)"
          ></div>
        </div>

        <span class="crt-brand">SEAN.OS / SUITE 47</span>
        <strong>PORTFOLIO<br />APPS<br />ONLINE</strong>
        <small>5 MODULES · TAP A PILL BELOW</small>
      </div>
    </div>

    <div class="crt-chin">
      {#each Array(12) as _, i}
        <span style="opacity: {0.3 + (i % 3) * 0.15}"></span>
      {/each}
    </div>
  </div>
</div>

<style>
  .crt-zone {
    position: relative;
    width: min(100%, 540px);
    transform-style: preserve-3d;
    transition: transform 0.15s ease-out;
    animation: crt-float 6s ease-in-out infinite;
  }

  @keyframes crt-float {
    0%,
    100% {
      filter: drop-shadow(26px 30px 0 rgba(0, 0, 0, 0.28));
    }
    50% {
      filter: drop-shadow(22px 26px 0 rgba(0, 0, 0, 0.24));
    }
  }

  .crt-shadow {
    position: absolute;
    bottom: -18%;
    left: 12%;
    width: 76%;
    height: 12%;
    background: radial-gradient(ellipse, rgba(0, 0, 0, 0.55), transparent 70%);
    transform: translateZ(-40px) rotateX(75deg);
    pointer-events: none;
  }

  .crt-stand {
    position: absolute;
    bottom: -8%;
    left: 50%;
    transform: translateX(-50%) translateZ(-20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
  }

  .crt-stand-neck {
    width: 18%;
    height: 28px;
    background: linear-gradient(90deg, #7a7268, #b5ab9e, #7a7268);
    border-radius: 2px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }

  .crt-stand-base {
    width: 42%;
    height: 10px;
    margin-top: 2px;
    background: linear-gradient(180deg, #a3988c, #6e655c);
    border-radius: 0 0 6px 6px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
  }

  .crt-body {
    position: relative;
    aspect-ratio: 1.1 / 0.86;
    padding: 5.5% 5% 7%;
    border-radius: 8% 8% 5% 5%;
    background: linear-gradient(145deg, #e8dfd1 0%, #c4b9ab 35%, #9b9184 70%, #7a7268 100%);
    box-shadow:
      inset 0 2px 0 rgba(255, 255, 255, 0.35),
      inset 0 -4px 8px rgba(0, 0, 0, 0.15),
      0 35px 90px rgba(0, 0, 0, 0.5);
    transform-style: preserve-3d;
  }

  .crt-bezel-top {
    position: absolute;
    inset: 0 0 auto 0;
    height: 8%;
    border-radius: 8% 8% 0 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), transparent);
    pointer-events: none;
  }

  .crt-bezel-side {
    position: absolute;
    top: 8%;
    right: 0;
    width: 4%;
    height: 72%;
    background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.22));
    border-radius: 0 8% 0 0;
    transform: translateZ(8px);
    pointer-events: none;
  }

  .crt-screen-recess {
    position: relative;
    height: 100%;
    padding: 3%;
    border-radius: 6% 6% 4% 4%;
    background: linear-gradient(180deg, #5a534c, #3d3832);
    box-shadow:
      inset 0 6px 16px rgba(0, 0, 0, 0.55),
      inset 0 -2px 4px rgba(255, 255, 255, 0.08);
    transform: translateZ(12px);
  }

  .crt-screen {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    overflow: hidden;
    padding: 7%;
    border-radius: 5%;
    background: radial-gradient(circle at 50% 38%, #234d66, #091a28 72%);
    color: #d8f2ff;
    box-shadow:
      inset 0 0 60px rgba(0, 0, 0, 0.85),
      inset 0 0 20px rgba(158, 203, 255, 0.06);
    font-family: 'IBM Plex Mono', monospace;
  }

  .crt-glass {
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 5%;
    background: radial-gradient(ellipse 80% 60% at 30% 25%, rgba(255, 255, 255, 0.12), transparent 50%);
  }

  .crt-scanlines {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(0deg, transparent 0 3px, rgba(216, 242, 255, 0.08) 4px);
    border-radius: 5%;
  }

  .crt-preview {
    position: absolute;
    inset: 18% 12% 38%;
    border: 1px solid rgba(158, 203, 255, 0.35);
    background: #151b28;
    overflow: hidden;
    box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
  }

  .mini-map {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(#234d66 0 30%, #4a90a4 30% 45%, #2d6a4f 45% 100%),
      repeating-linear-gradient(90deg, transparent 0 23%, rgba(158, 203, 255, 0.06) 23% 24%);
    opacity: 0.85;
  }

  .mini-player,
  .mini-player-shadow {
    position: absolute;
    left: 0;
    top: 0;
    width: 8px;
    height: 10px;
    will-change: transform;
  }

  .mini-player {
    background: #9ecbff;
    box-shadow: 0 0 10px #9ecbff;
    z-index: 2;
  }

  .mini-player-shadow {
    background: rgba(3, 4, 156, 0.65);
    filter: blur(3px);
    opacity: 0.45;
    z-index: 1;
  }

  .crt-screen strong {
    position: relative;
    z-index: 1;
    font-family: 'Space Grotesk', sans-serif;
    font-size: clamp(1.2rem, 3.5vw, 2.6rem);
    line-height: 0.88;
    letter-spacing: -0.08em;
  }

  .crt-screen small,
  .crt-brand {
    position: relative;
    z-index: 1;
    font-size: 0.65rem;
    letter-spacing: 0.14em;
  }

  .crt-chin {
    position: absolute;
    bottom: 2%;
    left: 8%;
    right: 8%;
    height: 5%;
    display: flex;
    justify-content: center;
    gap: 3px;
    align-items: center;
    transform: translateZ(6px);
    pointer-events: none;
  }

  .crt-chin span {
    display: block;
    width: 8%;
    height: 40%;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 1px;
  }

  @media (max-width: 720px) {
    .crt-zone {
      width: min(88vw, 440px);
      animation: none;
    }

    .crt-stand {
      display: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .crt-zone {
      animation: none;
    }
  }
</style>
