<script lang="ts">
  import { onMount } from 'svelte';
  import { ALL_LEVELS, type GameCollectible, type GameLevel } from '@showcase/engine-game';

  type GameState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'DEFEATED' | 'LEVEL_COMPLETE' | 'VICTORY';
  type Props = {
    onUnlock?: (item: GameCollectible) => void;
    onStateChange?: (state: GameState, level: GameLevel) => void;
    onVictory?: () => void;
  };

  let { onUnlock, onStateChange, onVictory }: Props = $props();
  let canvas: HTMLCanvasElement;
  let gameState: GameState = $state('TITLE');
  let levelIndex = $state(0);
  let score = $state(0);
  let lives = $state(3);
  let collected: string[] = $state([]);
  let level = $derived(ALL_LEVELS[levelIndex]);
  let hudText = $derived(`${level.name} / ${level.theme}`);

  const W = 960;
  const H = 540;
  const TILE = 40;
  const keys = new Set<string>();
  const touchKeys = new Set<string>();
  let raf = 0;

  const player = {
    x: 1.2,
    y: 8,
    w: 0.62,
    h: 1.1,
    vx: 0,
    vy: 0,
    grounded: false,
    checkpointX: 1.2,
    checkpointY: 8
  };
  let enemies: { x: number; y: number; minX: number; maxX: number; direction: number }[] = [];
  let remaining: Set<string> = $state(new Set<string>());
  let cameraX = 0;
  let lastTime = 0;
  let jumpBuffer = 0;
  let coyote = 0;

  function active(key: string) {
    return keys.has(key) || touchKeys.has(key);
  }

  function setState(next: GameState) {
    gameState = next;
    onStateChange?.(next, level);
  }

  function resetLevel() {
    const current = ALL_LEVELS[levelIndex];
    player.x = 1.2;
    player.y = 8;
    player.vx = 0;
    player.vy = 0;
    player.checkpointX = 1.2;
    player.checkpointY = 8;
    cameraX = 0;
    enemies = current.enemies.map((enemy) => ({ ...enemy, direction: 1 }));
    remaining = new Set(current.collectibles.map((item) => item.id).filter((id) => !collected.includes(id)));
  }

  function begin() {
    resetLevel();
    setState('PLAYING');
  }

  function nextLevel() {
    if (levelIndex >= ALL_LEVELS.length - 1) {
      setState('VICTORY');
      onVictory?.();
      return;
    }
    levelIndex += 1;
    resetLevel();
    setState('PLAYING');
  }

  function retry() {
    if (lives <= 0) {
      lives = 3;
      score = 0;
      collected = [];
    }
    resetLevel();
    setState('PLAYING');
  }

  function intersects(
    a: { x: number; y: number; w: number; h: number },
    b: { x: number; y: number; w: number; h: number }
  ) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function damage() {
    if (gameState !== 'PLAYING') return;
    lives -= 1;
    if (lives <= 0) setState('DEFEATED');
    else {
      player.x = player.checkpointX;
      player.y = player.checkpointY;
      player.vx = 0;
      player.vy = 0;
    }
  }

  function update(delta: number) {
    if (gameState !== 'PLAYING') return;
    const dt = Math.min(delta, 0.033);
    const left = active('ArrowLeft') || active('KeyA');
    const right = active('ArrowRight') || active('KeyD');
    const sprint = active('ShiftLeft') || active('ShiftRight');
    const speed = sprint ? 8.5 : 6.2;
    const acceleration = player.grounded ? 34 : 20;

    if (left) player.vx = Math.max(-speed, player.vx - acceleration * dt);
    else if (right) player.vx = Math.min(speed, player.vx + acceleration * dt);
    else player.vx *= Math.max(0, 1 - 12 * dt);

    if (jumpBuffer > 0) jumpBuffer -= dt;
    if (coyote > 0) coyote -= dt;
    if (active('Space') || active('KeyW') || active('ArrowUp')) jumpBuffer = 0.12;
    if (jumpBuffer > 0 && (player.grounded || coyote > 0)) {
      player.vy = -12.5;
      player.grounded = false;
      jumpBuffer = 0;
      coyote = 0;
    }

    const previousY = player.y;
    player.vy += 30 * dt;
    player.x += player.vx * dt;
    player.x = Math.max(0, Math.min(level.width - player.w, player.x));
    player.y += player.vy * dt;
    player.grounded = false;

    for (const platform of level.platforms) {
      const body = { x: player.x, y: player.y, w: player.w, h: player.h };
      const top = platform.y;
      if (
        player.vy >= 0 &&
        previousY + player.h <= top + 0.08 &&
        player.y + player.h >= top &&
        player.x + player.w > platform.x &&
        player.x < platform.x + platform.width
      ) {
        player.y = top - player.h;
        player.vy = 0;
        player.grounded = true;
      }
      if (intersects(body, { x: platform.x, y: platform.y, w: platform.width, h: platform.height })) {
        if (player.vx > 0 && player.x < platform.x) player.x = platform.x - player.w;
        if (player.vx < 0 && player.x > platform.x) player.x = platform.x + platform.width;
      }
    }
    if (player.grounded) coyote = 0.1;

    for (const hazard of level.hazards) {
      if (
        intersects(player, {
          x: hazard.x,
          y: hazard.y,
          w: hazard.width,
          h: hazard.height
        })
      )
        damage();
    }
    for (const enemy of enemies) {
      enemy.x += enemy.direction * dt * 1.4;
      if (enemy.x < enemy.minX || enemy.x > enemy.maxX) enemy.direction *= -1;
      const enemyBody = { x: enemy.x, y: enemy.y, w: 0.75, h: 0.75 };
      if (intersects(player, enemyBody)) {
        if (player.vy > 0 && player.y + player.h < enemy.y + 0.4) {
          enemy.x = enemy.maxX + 10;
          player.vy = -8;
          score += 100;
        } else damage();
      }
    }

    for (const item of level.collectibles) {
      if (!remaining.has(item.id)) continue;
      if (intersects(player, { x: item.x, y: item.y, w: 0.6, h: 0.6 })) {
        remaining.delete(item.id);
        collected = [...collected, item.id];
        score += 250;
        onUnlock?.(item);
      }
    }

    if (player.x > level.checkpoint.x) {
      player.checkpointX = level.checkpoint.x;
      player.checkpointY = level.checkpoint.y - player.h;
    }
    if (player.x > level.exit.x && player.y + player.h > level.exit.y - 1.5) {
      score += remaining.size === 0 ? 500 : 100;
      setState('LEVEL_COMPLETE');
    }
    if (player.y > level.height + 2) damage();

    const targetCamera = player.x * TILE - W * 0.35;
    cameraX += (Math.max(0, Math.min(level.width * TILE - W, targetCamera)) - cameraX) * Math.min(1, dt * 8);
  }

  function draw() {
    const context = canvas.getContext('2d');
    if (!context) return;
    const accent = level.accent;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, W, H);
    context.fillStyle = '#0f0f0f';
    context.fillRect(0, 0, W, H);
    context.save();
    context.translate(-cameraX, 0);
    const worldWidth = level.width * TILE;
    const gradient = context.createLinearGradient(0, 0, 0, H);
    gradient.addColorStop(0, '#161616');
    gradient.addColorStop(1, '#080808');
    context.fillStyle = gradient;
    context.fillRect(cameraX, 0, worldWidth, H);

    context.strokeStyle = 'rgba(253,253,253,.06)';
    context.lineWidth = 1;
    for (let x = 0; x < worldWidth; x += TILE) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, H);
      context.stroke();
    }
    for (const platform of level.platforms) {
      context.fillStyle = platform.y >= 10 ? '#fdfdfd' : '#292929';
      context.fillRect(platform.x * TILE, platform.y * TILE, platform.width * TILE, platform.height * TILE);
      context.fillStyle = accent;
      context.fillRect(platform.x * TILE, platform.y * TILE, platform.width * TILE, 3);
    }
    for (const hazard of level.hazards) {
      context.fillStyle = accent;
      for (let x = hazard.x * TILE; x < (hazard.x + hazard.width) * TILE; x += 16) {
        context.beginPath();
        context.moveTo(x, hazard.y * TILE + TILE);
        context.lineTo(x + 8, hazard.y * TILE);
        context.lineTo(x + 16, hazard.y * TILE + TILE);
        context.fill();
      }
    }
    context.fillStyle = '#fdfdfd';
    for (const enemy of enemies) {
      context.fillStyle = accent;
      context.fillRect(enemy.x * TILE, enemy.y * TILE, 30, 30);
      context.fillStyle = '#0f0f0f';
      context.fillRect(enemy.x * TILE + 7, enemy.y * TILE + 8, 5, 5);
      context.fillRect(enemy.x * TILE + 18, enemy.y * TILE + 8, 5, 5);
    }
    for (const item of level.collectibles) {
      if (!remaining.has(item.id)) continue;
      context.strokeStyle = accent;
      context.lineWidth = 3;
      context.beginPath();
      context.arc(item.x * TILE + 12, item.y * TILE + 12, 10 + Math.sin(performance.now() / 250) * 2, 0, Math.PI * 2);
      context.stroke();
      context.fillStyle = '#fdfdfd';
      context.font = '10px IBM Plex Mono';
      context.fillText(item.type === 'scroll' ? 'S' : item.type === 'eval' ? 'E' : '✦', item.x * TILE + 8, item.y * TILE + 16);
    }
    context.fillStyle = accent;
    context.fillRect(level.exit.x * TILE, level.exit.y * TILE, TILE * 0.65, TILE * 1.5);
    context.fillStyle = '#fdfdfd';
    context.fillRect(level.exit.x * TILE + 8, level.exit.y * TILE + 10, 10, 10);
    context.fillStyle = '#fdfdfd';
    context.fillRect(player.x * TILE, player.y * TILE, player.w * TILE, player.h * TILE);
    context.fillStyle = '#0f0f0f';
    context.fillRect(player.x * TILE - 2, player.y * TILE + 14, player.w * TILE + 4, 10);
    context.restore();
  }

  function frame(time: number) {
    const delta = (time - lastTime) / 1000 || 0;
    lastTime = time;
    update(delta);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function press(key: string) {
    touchKeys.add(key);
  }

  function release(key: string) {
    touchKeys.delete(key);
  }

  onMount(() => {
    const down = (event: KeyboardEvent) => {
      keys.add(event.code);
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
      if (event.code === 'Escape' && gameState === 'PLAYING') setState('PAUSED');
      else if (event.code === 'Escape' && gameState === 'PAUSED') setState('PLAYING');
    };
    const up = (event: KeyboardEvent) => keys.delete(event.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    resetLevel();
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  });
</script>

<div class="game-shell">
  <div class="game-meta">
    <div>
      <span class="meta-label">LEVEL {String(levelIndex + 1).padStart(2, '0')}</span>
      <strong>{level.name}</strong>
      <small>{level.theme}</small>
    </div>
    <div class="meta-stats">
      <span>SCORE <b>{score.toString().padStart(5, '0')}</b></span>
      <span>LIVES <b>{'◆'.repeat(Math.max(0, lives))}</b></span>
      <span>PROOF <b>{collected.length}</b></span>
    </div>
  </div>
  <div class="canvas-frame">
    <canvas bind:this={canvas} width={W} height={H} aria-label={`Playable ${hudText} platformer`}></canvas>
    {#if gameState === 'TITLE'}
      <div class="game-overlay">
        <p class="eyebrow">3 NINJA / CLOUD DOJO OS</p>
        <h3>Wield the system.</h3>
        <p>Collect Wex platform evidence as you play — it lands inline below, not in a popup.</p>
        <button type="button" onclick={begin}>START MISSION</button>
      </div>
    {:else if gameState === 'PAUSED'}
      <div class="game-overlay">
        <p class="eyebrow">SYSTEM PAUSED</p>
        <h3>Hold the line.</h3>
        <button type="button" onclick={() => setState('PLAYING')}>RESUME</button>
        <button type="button" class="secondary" onclick={retry}>RESTART LEVEL</button>
      </div>
    {:else if gameState === 'DEFEATED'}
      <div class="game-overlay">
        <p class="eyebrow">SIGNAL LOST</p>
        <h3>Retry the workflow.</h3>
        <p>Every failure is an evaluation signal.</p>
        <button type="button" onclick={retry}>RETRY MISSION</button>
      </div>
    {:else if gameState === 'LEVEL_COMPLETE'}
      <div class="game-overlay">
        <p class="eyebrow">LEVEL CLEAR / +{score}</p>
        <h3>{level.name} complete.</h3>
        <p>{remaining.size === 0 ? 'All evidence recovered.' : 'Replay to pick up remaining evidence.'}</p>
        <button type="button" onclick={nextLevel}>NEXT LEVEL →</button>
      </div>
    {:else if gameState === 'VICTORY'}
      <div class="game-overlay">
        <p class="eyebrow">SYSTEM MASTERED</p>
        <h3>Build what matters.</h3>
        <p>Now inspect the Efforts — Wex, Railbird, Blisser.</p>
        <button type="button" onclick={() => document.getElementById('efforts')?.scrollIntoView({ behavior: 'smooth' })}>VIEW EFFORTS →</button>
      </div>
    {/if}
  </div>
  <div class="controls">
    <span>MOVE A / D</span><span>JUMP W / SPACE</span><span>SPRINT SHIFT</span><span>PAUSE ESC</span>
  </div>
  <div class="touch-controls" aria-label="Touch controls">
    <button type="button" aria-label="Move left" onpointerdown={() => press('ArrowLeft')} onpointerup={() => release('ArrowLeft')}>←</button>
    <button type="button" aria-label="Move right" onpointerdown={() => press('ArrowRight')} onpointerup={() => release('ArrowRight')}>→</button>
    <button type="button" aria-label="Jump" onpointerdown={() => press('Space')} onpointerup={() => release('Space')}>↑</button>
  </div>
</div>

<style>
  .game-shell { display: grid; gap: 0.75rem; }
  .game-meta { display: flex; justify-content: space-between; gap: 1rem; align-items: end; font-family: 'IBM Plex Mono', monospace; text-transform: uppercase; }
  .meta-label, .eyebrow { display: block; font-size: 0.68rem; letter-spacing: 0.16em; opacity: 0.6; }
  .game-meta strong { display: block; font-size: 1.2rem; }
  .game-meta small { display: block; margin-top: 0.15rem; opacity: 0.6; }
  .meta-stats { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.7rem; }
  .meta-stats b { margin-left: 0.3rem; }
  .canvas-frame { position: relative; overflow: hidden; background: #0f0f0f; border: 1px solid #303030; }
  canvas { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; image-rendering: pixelated; }
  .game-overlay { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; text-align: center; padding: 2rem; background: rgba(15,15,15,.88); }
  .game-overlay h3 { margin: 0.35rem 0; font-size: clamp(1.8rem, 5vw, 3.4rem); letter-spacing: -0.05em; }
  .game-overlay p:not(.eyebrow) { max-width: 36ch; line-height: 1.5; opacity: 0.78; }
  button { border: 1px solid currentColor; background: #fdfdfd; color: #0f0f0f; padding: 0.7rem 1rem; font: inherit; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
  button.secondary { margin-left: 0.5rem; background: transparent; color: #fdfdfd; }
  .controls { display: flex; flex-wrap: wrap; gap: 0.8rem 1.4rem; font: 0.68rem 'IBM Plex Mono', monospace; opacity: 0.55; }
  .touch-controls { display: none; gap: 0.5rem; }
  .touch-controls button { min-width: 48px; min-height: 44px; background: #0f0f0f; color: #fdfdfd; }
  @media (max-width: 640px) {
    .game-meta { align-items: start; flex-direction: column; }
    .touch-controls { display: flex; }
    .controls { font-size: 0.58rem; }
  }
</style>
