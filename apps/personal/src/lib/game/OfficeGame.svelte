<script lang="ts">
  import { onMount } from 'svelte';
  import {
    OFFICE_MAP,
    OFFICE_ZONES,
    OFFICE_CONFIG,
    createOfficeEnemies,
    isSolidTile,
    tileAt,
    type OfficeEnemy
  } from '@showcase/engine-game';

  type GameState = 'PLAYING' | 'PAUSED' | 'DEFEATED';
  type Direction = 'up' | 'down' | 'left' | 'right';

  type Props = {
    paused?: boolean;
    onZoneEnter?: (zoneId: string) => void;
    onZoneHint?: (label: string | null) => void;
  };

  let { paused = false, onZoneEnter, onZoneHint }: Props = $props();

  const { cols, rows, tileSize: TILE, spawnCol, spawnRow, accent, accentGlow, parkColor } = OFFICE_CONFIG;
  const W = cols * TILE;
  const H = rows * TILE;

  let canvas: HTMLCanvasElement;
  let gameState: GameState = $state('PLAYING');
  let hearts = $state(3);
  let explored = $state<boolean[][]>(Array.from({ length: rows }, () => Array(cols).fill(false)));
  let nearbyZone = $state<string | null>(null);
  let attackTimer = 0;
  let invulnTimer = 0;
  let message = $state('Walk the suite · inspect zones · press E to interact');

  const keys = new Set<string>();
  const touchKeys = new Set<string>();
  let raf = 0;
  let lastTime = 0;

  const player = {
    col: spawnCol + 0.5,
    row: spawnRow + 0.5,
    direction: 'down' as Direction,
    speed: 4.2
  };

  let enemies: OfficeEnemy[] = createOfficeEnemies();
  let enemyMoveTimers = enemies.map(() => 0);

  function active(key: string) {
    return keys.has(key) || touchKeys.has(key);
  }

  function markExplored(col: number, row: number) {
    const c = Math.floor(col);
    const r = Math.floor(row);
    if (r >= 0 && c >= 0 && r < rows && c < cols && !explored[r][c]) {
      explored[r][c] = true;
      explored = explored;
    }
  }

  function collides(col: number, row: number): boolean {
    const margin = 0.22;
    const points = [
      [col - margin, row - margin],
      [col + margin, row - margin],
      [col - margin, row + margin],
      [col + margin, row + margin]
    ];
    for (const [c, r] of points) {
      if (isSolidTile(tileAt(OFFICE_MAP, Math.floor(c), Math.floor(r)))) return true;
    }
    return false;
  }

  function zoneNear(): (typeof OFFICE_ZONES)[number] | null {
    for (const zone of OFFICE_ZONES) {
      const cx = zone.col + zone.width / 2;
      const cy = zone.row + zone.height / 2;
      const dist = Math.hypot(player.col - cx, player.row - cy);
      if (dist < 1.8) return zone;
    }
    return null;
  }

  function tryInteract() {
    const zone = zoneNear();
    if (zone) onZoneEnter?.(zone.id);
  }

  function damage() {
    if (invulnTimer > 0 || gameState !== 'PLAYING' || paused) return;
    hearts -= 1;
    invulnTimer = 1.2;
    if (hearts <= 0) gameState = 'DEFEATED';
  }

  function attack() {
    if (attackTimer > 0 || gameState !== 'PLAYING' || paused) return;
    attackTimer = 0.35;
    const reach = 1.1;
    const px = player.col + (player.direction === 'left' ? -reach : player.direction === 'right' ? reach : 0);
    const py = player.row + (player.direction === 'up' ? -reach : player.direction === 'down' ? reach : 0);
    enemies = enemies.filter((enemy) => {
      const hit = Math.hypot(enemy.col - px, enemy.row - py) < 0.9;
      return !hit;
    });
    enemyMoveTimers = enemies.map(() => 0);
  }

  function resetGame() {
    player.col = spawnCol + 0.5;
    player.row = spawnRow + 0.5;
    player.direction = 'up';
    hearts = 3;
    gameState = 'PLAYING';
    enemies = createOfficeEnemies();
    enemyMoveTimers = enemies.map(() => 0);
    attackTimer = 0;
    invulnTimer = 0;
  }

  function moveEnemy(enemy: OfficeEnemy, index: number, dt: number) {
    enemyMoveTimers[index] -= dt;
    if (enemyMoveTimers[index] > 0) return;
    enemyMoveTimers[index] = 0.4 + Math.random() * 0.5;

    const options: Direction[] = ['up', 'down', 'left', 'right'];
    const shuffled = options.sort(() => Math.random() - 0.5);
    for (const dir of shuffled) {
      let nc = enemy.col;
      let nr = enemy.row;
      if (dir === 'up') nr -= 0.5;
      else if (dir === 'down') nr += 0.5;
      else if (dir === 'left') nc -= 0.5;
      else if (dir === 'right') nc += 0.5;
      if (
        nc >= enemy.minCol &&
        nc <= enemy.maxCol &&
        nr >= enemy.minRow &&
        nr <= enemy.maxRow &&
        !collides(nc, nr)
      ) {
        enemy.col = nc;
        enemy.row = nr;
        enemy.direction = dir;
        break;
      }
    }
  }

  function update(delta: number) {
    if (gameState !== 'PLAYING' || paused) return;
    const dt = Math.min(delta, 0.033);
    if (attackTimer > 0) attackTimer -= dt;
    if (invulnTimer > 0) invulnTimer -= dt;

    let dx = 0;
    let dy = 0;
    if (active('ArrowUp') || active('KeyW')) {
      dy = -1;
      player.direction = 'up';
    } else if (active('ArrowDown') || active('KeyS')) {
      dy = 1;
      player.direction = 'down';
    }
    if (active('ArrowLeft') || active('KeyA')) {
      dx = -1;
      player.direction = 'left';
    } else if (active('ArrowRight') || active('KeyD')) {
      dx = 1;
      player.direction = 'right';
    }

    if (dx !== 0 || dy !== 0) {
      const len = Math.hypot(dx, dy) || 1;
      dx /= len;
      dy /= len;
      const step = player.speed * dt;
      const nextCol = player.col + dx * step;
      const nextRow = player.row + dy * step;
      if (!collides(nextCol, player.row)) player.col = nextCol;
      if (!collides(player.col, nextRow)) player.row = nextRow;
    }

    markExplored(player.col, player.row);

    for (let i = 0; i < enemies.length; i++) {
      moveEnemy(enemies[i], i, dt);
      const dist = Math.hypot(enemies[i].col - player.col, enemies[i].row - player.row);
      if (dist < 0.55) damage();
    }

    const zone = zoneNear();
    nearbyZone = zone?.label ?? null;
    onZoneHint?.(nearbyZone);
    if (zone) message = `Near ${zone.label} — press E to inspect`;
    else message = 'Explore the executive suite · bugs are tech debt — Space to debug';
  }

  function drawTile(context: CanvasRenderingContext2D, tile: number, x: number, y: number) {
    if (tile === 1) {
      context.fillStyle = '#166534';
      context.fillRect(x, y, TILE, TILE);
      context.strokeStyle = 'rgba(74, 222, 128, 0.25)';
      context.strokeRect(x + 2, y + 2, TILE - 4, TILE - 4);
      return;
    }
    if (tile === 4) {
      const sky = context.createLinearGradient(x, y, x, y + TILE);
      sky.addColorStop(0, '#7dd3fc');
      sky.addColorStop(0.5, '#38bdf8');
      sky.addColorStop(0.75, '#86efac');
      sky.addColorStop(1, parkColor);
      context.fillStyle = sky;
      context.fillRect(x, y, TILE, TILE);
      context.fillStyle = 'rgba(255,255,255,0.15)';
      for (let i = 0; i < 3; i++) {
        context.fillRect(x + 6 + i * 11, y + 8 + (i % 2) * 4, 8, 2);
      }
      context.strokeStyle = accentGlow;
      context.lineWidth = 2;
      context.strokeRect(x + 1, y + 1, TILE - 2, TILE - 2);
      return;
    }
    if (tile === 2) {
      context.fillStyle = '#854d0e';
      context.fillRect(x, y, TILE, TILE);
      context.fillStyle = '#a16207';
      context.fillRect(x + 4, y + 8, TILE - 8, TILE - 14);
      context.fillStyle = '#fde047';
      context.fillRect(x + 4, y + 8, TILE - 8, 3);
      return;
    }
    if (tile === 3) {
      context.fillStyle = '#15803d';
      context.fillRect(x, y, TILE, TILE);
      context.fillStyle = 'rgba(74, 222, 128, 0.4)';
      context.fillRect(x + 3, y + 3, TILE - 6, TILE - 6);
      return;
    }
    context.fillStyle = '#4ade80';
    context.fillRect(x, y, TILE, TILE);
    context.fillStyle = 'rgba(34, 197, 94, 0.3)';
    context.fillRect(x + TILE / 2 - 1, y, 2, TILE);
    context.fillRect(x, y + TILE / 2 - 1, TILE, 2);
  }

  function draw() {
    const context = canvas.getContext('2d');
    if (!context) return;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, W, H);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        drawTile(context, OFFICE_MAP[row][col], col * TILE, row * TILE);
      }
    }

    for (const zone of OFFICE_ZONES) {
      const pulse = 0.5 + Math.sin(performance.now() / 400 + zone.col) * 0.5;
      const zx = zone.col * TILE + (zone.width * TILE) / 2;
      const zy = zone.row * TILE + (zone.height * TILE) / 2;
      context.strokeStyle = `rgba(158, 203, 255, ${0.25 + pulse * 0.35})`;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(zx, zy, 14 + pulse * 4, 0, Math.PI * 2);
      context.stroke();
    }

    for (const enemy of enemies) {
      context.fillStyle = '#ff5a5a';
      context.fillRect(enemy.col * TILE - 10, enemy.row * TILE - 10, 20, 20);
      context.fillStyle = '#1a1a1a';
      context.fillRect(enemy.col * TILE - 6, enemy.row * TILE - 4, 4, 4);
      context.fillRect(enemy.col * TILE + 2, enemy.row * TILE - 4, 4, 4);
    }

    if (attackTimer > 0) {
      context.fillStyle = accentGlow;
      const px = player.col * TILE;
      const py = player.row * TILE;
      context.save();
      context.translate(px, py);
      if (player.direction === 'left') context.fillRect(-TILE * 0.7, -4, TILE * 0.6, 8);
      else if (player.direction === 'right') context.fillRect(10, -4, TILE * 0.6, 8);
      else if (player.direction === 'up') context.fillRect(-4, -TILE * 0.7, 8, TILE * 0.6);
      else context.fillRect(-4, 10, 8, TILE * 0.6);
      context.restore();
    }

    const blink = invulnTimer > 0 && Math.floor(performance.now() / 80) % 2 === 0;
    if (!blink) {
      context.fillStyle = accentGlow;
      context.fillRect(player.col * TILE - 11, player.row * TILE - 14, 22, 24);
      context.fillStyle = '#1a1a1a';
      context.fillRect(player.col * TILE - 5, player.row * TILE - 10, 4, 4);
      context.fillRect(player.col * TILE + 1, player.row * TILE - 10, 4, 4);
      context.fillStyle = accent;
      if (player.direction === 'up') context.fillRect(player.col * TILE - 3, player.row * TILE - 18, 6, 6);
      else if (player.direction === 'down') context.fillRect(player.col * TILE - 3, player.row * TILE + 8, 6, 6);
      else if (player.direction === 'left') context.fillRect(player.col * TILE - 18, player.row * TILE - 3, 6, 6);
      else context.fillRect(player.col * TILE + 12, player.row * TILE - 3, 6, 6);
    }

    drawMinimap(context);
    drawHud(context);
  }

  function drawMinimap(context: CanvasRenderingContext2D) {
    const scale = 5;
    const mx = W - cols * scale - 12;
    const my = 12;
    context.fillStyle = 'rgba(26, 26, 26, 0.88)';
    context.fillRect(mx - 4, my - 4, cols * scale + 8, rows * scale + 8);
    context.strokeStyle = accentGlow;
    context.strokeRect(mx - 4, my - 4, cols * scale + 8, rows * scale + 8);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = OFFICE_MAP[row][col];
        if (tile === 1) context.fillStyle = '#3a4560';
        else if (!explored[row][col]) context.fillStyle = '#0a0e16';
        else if (tile === 4) context.fillStyle = '#4a90a4';
        else if (tile === 2) context.fillStyle = accent;
        else context.fillStyle = '#2a3348';
        context.fillRect(mx + col * scale, my + row * scale, scale - 1, scale - 1);
      }
    }
    for (const zone of OFFICE_ZONES) {
      context.fillStyle = '#5dff95';
      context.fillRect(
        mx + (zone.col + zone.width / 2) * scale - 1,
        my + (zone.row + zone.height / 2) * scale - 1,
        3,
        3
      );
    }
    context.fillStyle = '#fdfdfd';
    context.fillRect(mx + player.col * scale - 2, my + player.row * scale - 2, 4, 4);
    context.fillStyle = accentGlow;
    context.font = '9px IBM Plex Mono';
    context.fillText('MAP', mx, my - 6);
  }

  function drawHud(context: CanvasRenderingContext2D) {
    context.fillStyle = 'rgba(26, 26, 26, 0.9)';
    context.fillRect(8, H - 36, W - 16, 28);
    context.strokeStyle = 'rgba(158, 203, 255, 0.35)';
    context.strokeRect(8, H - 36, W - 16, 28);
    context.fillStyle = accentGlow;
    context.font = '11px IBM Plex Mono';
    context.fillText(message, 16, H - 16);

    context.fillStyle = '#ff5a5a';
    for (let i = 0; i < hearts; i++) {
      context.fillRect(16 + i * 18, 14, 12, 12);
    }
    context.fillStyle = accentGlow;
    context.font = '10px IBM Plex Mono';
    context.fillText('HEARTS', 16, 10);
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
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code))
        event.preventDefault();
      if (event.code === 'KeyE' || event.code === 'Enter') tryInteract();
      if (event.code === 'Space') attack();
      if (event.code === 'Escape' && gameState === 'PLAYING') gameState = 'PAUSED';
      else if (event.code === 'Escape' && gameState === 'PAUSED') gameState = 'PLAYING';
    };
    const up = (event: KeyboardEvent) => keys.delete(event.code);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    markExplored(player.col, player.row);
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
      <span class="meta-label">EXECUTIVE SUITE / FLOOR 47</span>
      <strong>Chicago High-Rise Office</strong>
      <small>Overlooking Grant Park · walk · inspect · debug tech debt</small>
    </div>
    <div class="meta-stats">
      <span>MODE <b>EXPLORE</b></span>
      <span>NEAR <b>{nearbyZone ?? '—'}</b></span>
    </div>
  </div>

  <div class="canvas-frame">
    <canvas bind:this={canvas} width={W} height={H} aria-label="Top-down executive office exploration game"></canvas>
    {#if gameState === 'PAUSED'}
      <div class="game-overlay">
        <p class="eyebrow">SUITE PAUSED</p>
        <h3>Resume the walkthrough.</h3>
        <button type="button" onclick={() => (gameState = 'PLAYING')}>RESUME</button>
      </div>
    {:else if gameState === 'DEFEATED'}
      <div class="game-overlay">
        <p class="eyebrow">TECH DEBT WINS</p>
        <h3>Retry the sprint.</h3>
        <p>Every bug is a signal — refactor and run it back.</p>
        <button type="button" onclick={resetGame}>RE-ENTER SUITE</button>
      </div>
    {/if}
  </div>

  <div class="controls">
    <span>MOVE WASD / ARROWS</span>
    <span>INTERACT E</span>
    <span>DEBUG SPACE</span>
    <span>PAUSE ESC</span>
  </div>

  <div class="touch-controls" aria-label="Touch controls">
    <button type="button" aria-label="Move up" onpointerdown={() => press('ArrowUp')} onpointerup={() => release('ArrowUp')}>↑</button>
    <button type="button" aria-label="Move left" onpointerdown={() => press('ArrowLeft')} onpointerup={() => release('ArrowLeft')}>←</button>
    <button type="button" aria-label="Move down" onpointerdown={() => press('ArrowDown')} onpointerup={() => release('ArrowDown')}>↓</button>
    <button type="button" aria-label="Move right" onpointerdown={() => press('ArrowRight')} onpointerup={() => release('ArrowRight')}>→</button>
    <button type="button" aria-label="Interact" onpointerdown={() => tryInteract()}>E</button>
    <button type="button" aria-label="Debug attack" onpointerdown={() => attack()}>⚡</button>
  </div>
</div>

<style>
  .game-shell {
    display: grid;
    gap: 0.75rem;
    height: 100%;
  }

  .game-meta {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: end;
    font-family: 'IBM Plex Mono', monospace;
    text-transform: uppercase;
  }

  .meta-label,
  .eyebrow {
    display: block;
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    opacity: 0.6;
  }

  .game-meta strong {
    display: block;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.2rem;
    text-transform: none;
  }

  .game-meta small {
    display: block;
    margin-top: 0.15rem;
    opacity: 0.6;
    text-transform: none;
  }

  .meta-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    font-size: 0.7rem;
  }

  .meta-stats b {
    margin-left: 0.3rem;
    color: #9ecbff;
  }

  .canvas-frame {
    position: relative;
    flex: 1;
    overflow: hidden;
    background: #091a28;
    border: 1px solid rgba(158, 203, 255, 0.35);
    box-shadow:
      inset 0 0 40px rgba(3, 4, 156, 0.25),
      0 20px 60px rgba(0, 0, 0, 0.45);
  }

  canvas {
    display: block;
    width: 100%;
    height: auto;
    max-height: calc(100vh - 180px);
    image-rendering: pixelated;
  }

  .game-overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-content: center;
    justify-items: center;
    text-align: center;
    padding: 2rem;
    background: rgba(9, 26, 40, 0.92);
    font-family: 'Space Grotesk', sans-serif;
  }

  .game-overlay h3 {
    margin: 0.35rem 0;
    font-size: clamp(1.6rem, 4vw, 2.8rem);
    letter-spacing: -0.05em;
  }

  .game-overlay p:not(.eyebrow) {
    max-width: 36ch;
    line-height: 1.5;
    opacity: 0.78;
  }

  button {
    border: 1px solid #9ecbff;
    background: #03049c;
    color: #f5f5ff;
    padding: 0.7rem 1rem;
    font: inherit;
    font-size: 0.75rem;
    font-weight: 700;
    cursor: pointer;
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem 1.4rem;
    font: 0.68rem 'IBM Plex Mono', monospace;
    opacity: 0.55;
  }

  .touch-controls {
    display: none;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .touch-controls button {
    min-width: 48px;
    min-height: 44px;
    background: rgba(26, 26, 26, 0.9);
  }

  @media (max-width: 640px) {
    .game-meta {
      align-items: start;
      flex-direction: column;
    }

    .touch-controls {
      display: flex;
    }

    .controls {
      font-size: 0.58rem;
    }
  }
</style>
