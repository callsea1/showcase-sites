import * as THREE from 'three';

export type TextLabelOptions = {
  text: string;
  fontSize?: number;
  color?: number;
  maxWidth?: number;
};

/** Canvas-texture sprite label for scoreboard-style WebGL text (no troika dep). */
export function createTextSprite(options: TextLabelOptions): THREE.Sprite {
  const { text, fontSize = 48, color = 0xffffff, maxWidth = 512 } = options;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = maxWidth;
  canvas.height = 128;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(maxWidth / 100, 1.28, 1);
  return sprite;
}

export function updateTextSprite(sprite: THREE.Sprite, text: string, fontSize = 48, color = 0xffffff): void {
  const mat = sprite.material as THREE.SpriteMaterial;
  const canvas = (mat.map!.image as HTMLCanvasElement) ?? document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;
  ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  mat.map!.needsUpdate = true;
}

export type AuthoredAssetConfig = {
  useAuthoredAssets: boolean;
  robotUrl?: string;
  baseballUrl?: string;
  hdrUrl?: string;
};

export async function loadAuthoredRobot(
  url: string,
  GLTFLoader: typeof import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader
): Promise<THREE.Group | null> {
  try {
    const loader = new GLTFLoader();
    const gltf = await loader.loadAsync(url);
    const group = gltf.scene;
    group.scale.setScalar(1);
    return group;
  } catch {
    return null;
  }
}
