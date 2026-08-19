export type ZoneTrigger = {
  id: string;
  distance: number;
  onEnter?: (id: string) => void;
};

export function distance3(a: [number, number, number], b: [number, number, number]): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function checkZoneProximity(
  camera: [number, number, number],
  zones: { id: string; position: [number, number, number] }[],
  threshold = 2.5
): string | null {
  for (const zone of zones) {
    if (distance3(camera, zone.position) < threshold) return zone.id;
  }
  return null;
}

export const OFFICE_BOUNDS = {
  minX: -5,
  maxX: 5,
  minZ: -6,
  maxZ: 4,
  floorY: 0
} as const;

export function clampPosition(x: number, z: number): [number, number] {
  return [
    Math.max(OFFICE_BOUNDS.minX, Math.min(OFFICE_BOUNDS.maxX, x)),
    Math.max(OFFICE_BOUNDS.minZ, Math.min(OFFICE_BOUNDS.maxZ, z))
  ];
}
