/** Top-down executive office map — original layout, zelda-js-style grid collision. */

export type OfficeTile = 0 | 1 | 2 | 3 | 4;

/** 0 floor · 1 wall · 2 desk · 3 carpet · 4 window (walkable, scenic) */
export const OFFICE_MAP: OfficeTile[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1],
  [1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1],
  [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 2, 0, 3, 3, 0, 2, 2, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
] as OfficeTile[][];

export type OfficeZoneTrigger = {
  id: string;
  label: string;
  col: number;
  row: number;
  width: number;
  height: number;
};

export const OFFICE_ZONES: OfficeZoneTrigger[] = [
  { id: 'desk', label: 'Desk', col: 3, row: 3, width: 3, height: 2 },
  { id: 'window', label: 'View', col: 1, row: 1, width: 16, height: 2 },
  { id: 'whiteboard', label: 'AI Board', col: 7, row: 4, width: 2, height: 2 },
  { id: 'trophy', label: 'Trophies', col: 13, row: 5, width: 2, height: 2 },
  { id: 'bookshelf', label: 'Books', col: 3, row: 7, width: 2, height: 2 },
  { id: 'conference', label: 'Table', col: 7, row: 7, width: 4, height: 3 }
];

export type OfficeEnemy = {
  id: string;
  col: number;
  row: number;
  minCol: number;
  maxCol: number;
  minRow: number;
  maxRow: number;
  direction: 'up' | 'down' | 'left' | 'right';
  hp: number;
};

export function createOfficeEnemies(): OfficeEnemy[] {
  return [
    { id: 'bug-1', col: 10, row: 6, minCol: 8, maxCol: 12, minRow: 5, maxRow: 8, direction: 'left', hp: 1 },
    { id: 'bug-2', col: 5, row: 9, minCol: 4, maxCol: 9, minRow: 8, maxRow: 10, direction: 'right', hp: 1 },
    { id: 'bug-3', col: 14, row: 9, minCol: 12, maxCol: 16, minRow: 8, maxRow: 11, direction: 'up', hp: 1 }
  ];
}

export const OFFICE_CONFIG = {
  cols: 18,
  rows: 14,
  tileSize: 40,
  spawnCol: 8,
  spawnRow: 12,
  accent: '#03049c',
  accentGlow: '#9ecbff',
  parkColor: '#2d6a4f'
};

export function isSolidTile(tile: OfficeTile): boolean {
  return tile === 1 || tile === 2;
}

export function tileAt(map: OfficeTile[][], col: number, row: number): OfficeTile {
  if (row < 0 || col < 0 || row >= map.length || col >= map[0].length) return 1;
  return map[row][col];
}
