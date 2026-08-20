export type Vec3 = { x: number; y: number; z: number };

export type PieceType = 'I' | 'O' | 'T' | 'L' | 'J' | 'S' | 'Z';

export type ActivePiece = {
  type: PieceType;
  cells: Vec3[];
  position: Vec3;
  color: string;
};

export type Stack3DState = {
  grid: (string | null)[][][];
  score: number;
  lines: number;
  level: number;
  active: ActivePiece | null;
  next: PieceType;
  gameOver: boolean;
  paused: boolean;
};

export const GRID_W = 6;
export const GRID_D = 6;
export const GRID_H = 14;

const COLORS: Record<PieceType, string> = {
  I: '#e8e8f0',
  O: '#1a2744',
  T: '#c4a574',
  L: '#9ecbff',
  J: '#03049c',
  S: '#5dff95',
  Z: '#ff6b6b'
};

const SHAPES: Record<PieceType, Vec3[]> = {
  I: [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 3, y: 0, z: 0 }
  ],
  O: [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 }
  ],
  T: [
    { x: 1, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 }
  ],
  L: [
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 }
  ],
  J: [
    { x: 2, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 }
  ],
  S: [
    { x: 1, y: 0, z: 0 },
    { x: 2, y: 0, z: 0 },
    { x: 0, y: 0, z: 1 },
    { x: 1, y: 0, z: 1 }
  ],
  Z: [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
    { x: 1, y: 0, z: 1 },
    { x: 2, y: 0, z: 1 }
  ]
};

const PIECE_TYPES: PieceType[] = ['I', 'O', 'T', 'L', 'J', 'S', 'Z'];

function emptyGrid(): (string | null)[][][] {
  return Array.from({ length: GRID_W }, () =>
    Array.from({ length: GRID_H }, () => Array(GRID_D).fill(null))
  );
}

function randomPiece(): PieceType {
  return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)]!;
}

function spawnPiece(type: PieceType): ActivePiece {
  return {
    type,
    cells: SHAPES[type].map((c) => ({ ...c })),
    position: { x: Math.floor(GRID_W / 2) - 2, y: GRID_H - 1, z: Math.floor(GRID_D / 2) - 1 },
    color: COLORS[type]
  };
}

function worldCells(piece: ActivePiece): Vec3[] {
  return piece.cells.map((c) => ({
    x: piece.position.x + c.x,
    y: piece.position.y + c.y,
    z: piece.position.z + c.z
  }));
}

function inBounds(x: number, y: number, z: number): boolean {
  return x >= 0 && x < GRID_W && y >= 0 && y < GRID_H && z >= 0 && z < GRID_D;
}

function canPlace(grid: (string | null)[][][], piece: ActivePiece): boolean {
  return worldCells(piece).every(
    (c) => inBounds(c.x, c.y, c.z) && grid[c.x]![c.y]![c.z] === null
  );
}

function lockPiece(state: Stack3DState): void {
  if (!state.active) return;
  for (const c of worldCells(state.active)) {
    if (inBounds(c.x, c.y, c.z)) {
      state.grid[c.x]![c.y]![c.z] = state.active.color;
    }
  }
  state.active = null;
}

function clearLines(state: Stack3DState): number {
  let cleared = 0;
  for (let y = 0; y < GRID_H; y++) {
    let full = true;
    for (let x = 0; x < GRID_W && full; x++) {
      for (let z = 0; z < GRID_D; z++) {
        if (state.grid[x]![y]![z] === null) {
          full = false;
          break;
        }
      }
    }
    if (!full) continue;
    cleared++;
    for (let yy = y; yy < GRID_H - 1; yy++) {
      for (let x = 0; x < GRID_W; x++) {
        for (let z = 0; z < GRID_D; z++) {
          state.grid[x]![yy]![z] = state.grid[x]![yy + 1]![z];
        }
      }
    }
    for (let x = 0; x < GRID_W; x++) {
      for (let z = 0; z < GRID_D; z++) {
        state.grid[x]![GRID_H - 1]![z] = null;
      }
    }
    y--;
  }
  if (cleared > 0) {
    state.lines += cleared;
    state.score += cleared * 100 * state.level;
    state.level = 1 + Math.floor(state.lines / 5);
  }
  return cleared;
}

function spawnNext(state: Stack3DState): void {
  const type = state.next;
  state.next = randomPiece();
  const piece = spawnPiece(type);
  if (!canPlace(state.grid, piece)) {
    state.gameOver = true;
    state.active = null;
    return;
  }
  state.active = piece;
}

export function createStack3DState(): Stack3DState {
  const next = randomPiece();
  const state: Stack3DState = {
    grid: emptyGrid(),
    score: 0,
    lines: 0,
    level: 1,
    active: null,
    next,
    gameOver: false,
    paused: false
  };
  spawnNext(state);
  return state;
}

export function tickGravity(state: Stack3DState): boolean {
  if (state.gameOver || state.paused || !state.active) return false;
  const moved = { ...state.active, position: { ...state.active.position, y: state.active.position.y - 1 } };
  if (canPlace(state.grid, moved)) {
    state.active = moved;
    return false;
  }
  lockPiece(state);
  clearLines(state);
  spawnNext(state);
  return true;
}

export function movePiece(state: Stack3DState, dx: number, dz: number): boolean {
  if (!state.active || state.gameOver || state.paused) return false;
  const moved = {
    ...state.active,
    position: {
      x: state.active.position.x + dx,
      y: state.active.position.y,
      z: state.active.position.z + dz
    }
  };
  if (!canPlace(state.grid, moved)) return false;
  state.active = moved;
  return true;
}

export function rotatePiece(state: Stack3DState): boolean {
  if (!state.active || state.gameOver || state.paused) return false;
  const rotated = state.active.cells.map((c) => ({ x: GRID_D - 1 - c.z, y: c.y, z: c.x }));
  const moved = { ...state.active, cells: rotated };
  if (canPlace(state.grid, moved)) {
    state.active = moved;
    return true;
  }
  for (const kick of [-1, 1, -2, 2]) {
    const kicked = { ...moved, position: { ...moved.position, x: moved.position.x + kick } };
    if (canPlace(state.grid, kicked)) {
      state.active = kicked;
      return true;
    }
  }
  return false;
}

export function hardDrop(state: Stack3DState): number {
  if (!state.active || state.gameOver || state.paused) return 0;
  let drops = 0;
  while (state.active) {
    const moved: ActivePiece = {
      ...state.active,
      position: { ...state.active.position, y: state.active.position.y - 1 }
    };
    if (!canPlace(state.grid, moved)) break;
    state.active = moved;
    drops++;
  }
  lockPiece(state);
  clearLines(state);
  spawnNext(state);
  state.score += drops * 2;
  return drops;
}

export function dropIntervalMs(level: number): number {
  return Math.max(120, 800 - (level - 1) * 60);
}

export function getFilledCells(state: Stack3DState): { x: number; y: number; z: number; color: string }[] {
  const out: { x: number; y: number; z: number; color: string }[] = [];
  for (let x = 0; x < GRID_W; x++) {
    for (let y = 0; y < GRID_H; y++) {
      for (let z = 0; z < GRID_D; z++) {
        const c = state.grid[x]![y]![z];
        if (c) out.push({ x, y, z, color: c });
      }
    }
  }
  if (state.active) {
    for (const c of worldCells(state.active)) {
      if (inBounds(c.x, c.y, c.z)) {
        out.push({ x: c.x, y: c.y, z: c.z, color: state.active.color });
      }
    }
  }
  return out;
}

export function effortUnlockCount(lines: number): number {
  return Math.min(3, Math.floor(lines / 3));
}

export function resetStack3D(state: Stack3DState): void {
  const fresh = createStack3DState();
  state.grid = fresh.grid;
  state.score = fresh.score;
  state.lines = fresh.lines;
  state.level = fresh.level;
  state.active = fresh.active;
  state.next = fresh.next;
  state.gameOver = fresh.gameOver;
  state.paused = fresh.paused;
}
