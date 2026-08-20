import * as THREE from 'three';

export type StageKeyframe = {
  progress: number;
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  fov?: number;
};

export const STAGE_KEYFRAMES: StageKeyframe[] = [
  { progress: 0, position: new THREE.Vector3(0, 2.5, 8), lookAt: new THREE.Vector3(0, 1.2, 0) },
  { progress: 0.25, position: new THREE.Vector3(0, 3.5, 7), lookAt: new THREE.Vector3(0, 1.5, 0) },
  { progress: 0.4, position: new THREE.Vector3(4, 4, 5), lookAt: new THREE.Vector3(0, 0.5, 0) },
  { progress: 0.55, position: new THREE.Vector3(0, 5, 6), lookAt: new THREE.Vector3(0, 1, 0) },
  { progress: 0.7, position: new THREE.Vector3(5, 3, 4), lookAt: new THREE.Vector3(0, 1.5, 0) },
  { progress: 0.85, position: new THREE.Vector3(0, 2.8, 5.5), lookAt: new THREE.Vector3(0, 1, 0) },
  { progress: 1, position: new THREE.Vector3(0, 2, 7), lookAt: new THREE.Vector3(0, 0.5, 0) }
];

export type StageScene = 'intro' | 'efforts' | 'game' | 'outro';

export function sceneAtProgress(progress: number): StageScene {
  if (progress < 0.25) return 'intro';
  if (progress < 0.55) return 'efforts';
  if (progress < 0.85) return 'game';
  return 'outro';
}

export function lerpKeyframes(progress: number, keyframes = STAGE_KEYFRAMES): { position: THREE.Vector3; lookAt: THREE.Vector3 } {
  const p = Math.max(0, Math.min(1, progress));
  let a = keyframes[0]!;
  let b = keyframes[keyframes.length - 1]!;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i]!.progress && p <= keyframes[i + 1]!.progress) {
      a = keyframes[i]!;
      b = keyframes[i + 1]!;
      break;
    }
  }
  const span = b.progress - a.progress || 1;
  const t = (p - a.progress) / span;
  return {
    position: a.position.clone().lerp(b.position, t),
    lookAt: a.lookAt.clone().lerp(b.lookAt, t)
  };
}

export function applyCameraRig(camera: THREE.PerspectiveCamera, progress: number): void {
  const { position, lookAt } = lerpKeyframes(progress);
  camera.position.copy(position);
  camera.lookAt(lookAt);
}

export function createStadiumLights(scene: THREE.Scene): THREE.Group {
  const group = new THREE.Group();
  const ambient = new THREE.AmbientLight(0x1a2744, 0.45);
  group.add(ambient);

  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(5, 8, 4);
  group.add(key);

  const rim = new THREE.PointLight(0x9ecbff, 2.5, 30);
  rim.position.set(-4, 3, 2);
  group.add(rim);

  const fill = new THREE.PointLight(0xffd166, 0.6, 25);
  fill.position.set(3, 1, -2);
  group.add(fill);

  scene.add(group);
  return group;
}

export function createStadiumFloor(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(24, 24);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1a2744,
    roughness: 0.85,
    metalness: 0.1
  });
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  return floor;
}

export function createCrowdBokeh(count = 80): THREE.Points {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 1] = 4 + Math.random() * 8;
    positions[i * 3 + 2] = -8 - Math.random() * 12;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true
  });
  return new THREE.Points(geo, mat);
}
