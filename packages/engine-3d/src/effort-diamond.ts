import * as THREE from 'three';

export type EffortId = 'wex' | 'railbird' | 'blisser';

export type EffortConfig = {
  id: EffortId;
  label: string;
  accent: number;
  position: THREE.Vector3;
  rotation?: number;
};

export const EFFORT_ACCENTS: Record<EffortId, number> = {
  wex: 0x2563eb,
  railbird: 0x22c55e,
  blisser: 0xf59e0b
};

export const EFFORT_POSITIONS: EffortConfig[] = [
  { id: 'wex', label: 'Wex', accent: EFFORT_ACCENTS.wex, position: new THREE.Vector3(0, 0.05, 3.2), rotation: 0 },
  { id: 'railbird', label: 'Railbird', accent: EFFORT_ACCENTS.railbird, position: new THREE.Vector3(3.2, 0.05, 0), rotation: Math.PI / 2 },
  { id: 'blisser', label: 'Blisser', accent: EFFORT_ACCENTS.blisser, position: new THREE.Vector3(-3.2, 0.05, 0), rotation: -Math.PI / 2 }
];

/** Home plate pentagon shape */
export function createBasePlateMesh(accent: number): THREE.Group {
  const group = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.5);
  shape.lineTo(0.35, 0.15);
  shape.lineTo(0.35, -0.35);
  shape.lineTo(-0.35, -0.35);
  shape.lineTo(-0.35, 0.15);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xf5f5f0,
    roughness: 0.7,
    metalness: 0.05
  });
  const plate = new THREE.Mesh(geo, mat);
  plate.receiveShadow = true;
  group.add(plate);

  const edgeGeo = new THREE.EdgesGeometry(geo);
  const edgeMat = new THREE.LineBasicMaterial({ color: accent, linewidth: 2 });
  const edges = new THREE.LineSegments(edgeGeo, edgeMat);
  group.add(edges);

  const glow = new THREE.PointLight(accent, 0.4, 3);
  glow.position.set(0, 0.3, 0);
  group.add(glow);

  return group;
}

export function createDiamondLines(): THREE.Line {
  const points: THREE.Vector3[] = [
    new THREE.Vector3(0, 0.02, 3.2),
    new THREE.Vector3(3.2, 0.02, 0),
    new THREE.Vector3(0, 0.02, -3.2),
    new THREE.Vector3(-3.2, 0.02, 0),
    new THREE.Vector3(0, 0.02, 3.2)
  ];
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x4a5568, transparent: true, opacity: 0.5 });
  return new THREE.Line(geo, mat);
}

export function createTeeBaseball(accent: number): THREE.Group {
  const group = new THREE.Group();
  const tee = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.04, 0.35, 8),
    new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.6, roughness: 0.4 })
  );
  tee.position.y = 0.175;
  group.add(tee);

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xeee8dc, roughness: 0.8 })
  );
  ball.position.y = 0.42;
  ball.castShadow = true;
  group.add(ball);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.14, 0.008, 8, 24),
    new THREE.MeshBasicMaterial({ color: accent })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.42;
  group.add(ring);

  return group;
}
