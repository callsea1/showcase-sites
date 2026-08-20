import * as THREE from 'three';

export function createSmileyTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ffd93d';
  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#e8b800';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#1e2a32';
  ctx.beginPath();
  ctx.arc(48, 54, 7, 0, Math.PI * 2);
  ctx.arc(80, 54, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#1e2a32';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(64, 70, 22, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export type SmileySprite = THREE.Sprite & { flightId?: string };

export function createSmileyFace(texture?: THREE.CanvasTexture): SmileySprite {
  const map = texture ?? createSmileyTexture();
  const material = new THREE.SpriteMaterial({
    map,
    transparent: true,
    depthWrite: false
  });
  const sprite = new THREE.Sprite(material) as SmileySprite;
  const scale = 0.45 + Math.random() * 0.2;
  sprite.scale.set(scale, scale, 1);
  return sprite;
}
