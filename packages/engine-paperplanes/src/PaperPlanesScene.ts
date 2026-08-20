import * as THREE from 'three';
import { createGlobe, type GlobeLocation } from './Globe.js';
import { createPlaneLauncher, type PlaneLauncher } from './PlaneLauncher.js';
import { createScrollSync, type ScrollSyncHandle } from './ScrollSync.js';
import { createSkyGradient, updateSkyGradient } from './SkyGradient.js';

export type PaperPlanesSceneOptions = {
  canvas: HTMLCanvasElement;
  locations: GlobeLocation[];
  isMobile?: boolean;
  onReady?: () => void;
};

export type PaperPlanesSceneHandle = {
  setScrollProgress: (progress: number) => void;
  launchPlane: () => void;
  resize: () => void;
  dispose: () => void;
};

export function createPaperPlanesScene(options: PaperPlanesSceneOptions): PaperPlanesSceneHandle | null {
  const { canvas, locations, isMobile = false, onReady } = options;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isMobile,
      alpha: true,
      powerPreference: isMobile ? 'low-power' : 'high-performance'
    });
  } catch {
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  camera.position.set(0, 0.5, 7);

  renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const sky = createSkyGradient();
  scene.add(sky);

  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const globe = createGlobe(locations);
  scene.add(globe.group);

  const scrollSync = createScrollSync(locations.length);

  const launcherLocations = locations.map((l) => ({ city: l.city, label: l.label }));
  let launcher: PlaneLauncher | null = null;

  let animationId = 0;
  let elapsed = 0;
  let incomingTimer: ReturnType<typeof setInterval> | null = null;
  let disposed = false;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const width = parent.clientWidth;
    const height = parent.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  function animate(time: number) {
    if (disposed) return;
    animationId = requestAnimationFrame(animate);
    elapsed = time * 0.001;

    updateSkyGradient(sky, elapsed);
    globe.update(elapsed);

    const activeIndex = scrollSync.getActiveLocationIndex();
    globe.setActiveIndex(activeIndex);
    globe.rotateToLocation(activeIndex);

    const drift = scrollSync.getActiveLocationIndex() / Math.max(1, locations.length - 1);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, (drift - 0.5) * 1.2, 0.03);
    camera.lookAt(0, 0, 0);

    launcher?.update();
    renderer.render(scene, camera);
  }

  resize();
  launcher = createPlaneLauncher({
    scene,
    camera,
    domElement: canvas,
    locations: launcherLocations,
    isMobile
  });

  animationId = requestAnimationFrame(animate);
  onReady?.();

  incomingTimer = setInterval(() => {
    launcher?.spawnIncoming();
  }, isMobile ? 6000 : 4500);

  return {
    setScrollProgress(progress: number) {
      scrollSync.setProgress(progress);
    },
    launchPlane() {
      launcher?.launch();
    },
    resize,
    dispose() {
      disposed = true;
      cancelAnimationFrame(animationId);
      if (incomingTimer) clearInterval(incomingTimer);
      launcher?.dispose();
      renderer.dispose();
      sky.geometry.dispose();
      (sky.material as THREE.Material).dispose();
    }
  };
}

export type { GlobeLocation, ScrollSyncHandle, PlaneLauncher };
