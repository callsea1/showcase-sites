import * as THREE from 'three';

export function createPaperPlaneGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0.6, 0.15);
  shape.lineTo(0, 0.35);
  shape.lineTo(-0.6, 0.15);
  shape.lineTo(0, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.02,
    bevelEnabled: false
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.scale(0.5, 0.5, 0.5);
  geometry.center();
  return geometry;
}

export type PaperPlaneMesh = THREE.Mesh & {
  flightId?: string;
};

export function createPaperPlane(stampTexture?: THREE.Texture): PaperPlaneMesh {
  const geometry = createPaperPlaneGeometry();
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.85,
    metalness: 0,
    map: stampTexture ?? null,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material) as PaperPlaneMesh;
  mesh.castShadow = true;
  return mesh;
}
