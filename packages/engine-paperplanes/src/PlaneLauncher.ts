import gsap from 'gsap';
import * as THREE from 'three';
import { createPaperPlane, type PaperPlaneMesh } from './PaperPlane.js';
import { createLocationStampTexture } from './LocationStamp.js';

export type PlaneLauncherOptions = {
  scene: THREE.Scene;
  camera: THREE.Camera;
  domElement: HTMLElement;
  locations: { city: string; label: string }[];
  isMobile: boolean;
};

export type PlaneLauncher = {
  launch: (locationIndex?: number) => void;
  spawnIncoming: () => void;
  update: () => void;
  dispose: () => void;
};

type ActiveFlight = {
  mesh: PaperPlaneMesh;
  tween: gsap.core.Tween;
};

export function createPlaneLauncher(options: PlaneLauncherOptions): PlaneLauncher {
  const { scene, camera, domElement, locations, isMobile } = options;
  const activeFlights: ActiveFlight[] = [];
  const maxPlanes = isMobile ? 3 : 5;
  let locationCursor = 0;

  function getStampTexture(city: string, label: string): THREE.CanvasTexture {
    const canvas = createLocationStampTexture(city, label);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  function removeFlight(flight: ActiveFlight) {
    scene.remove(flight.mesh);
    flight.mesh.geometry.dispose();
    (flight.mesh.material as THREE.Material).dispose();
    flight.tween.kill();
    const idx = activeFlights.indexOf(flight);
    if (idx >= 0) activeFlights.splice(idx, 1);
  }

  function launch(locationIndex?: number) {
    if (activeFlights.length >= maxPlanes) {
      removeFlight(activeFlights[0]);
    }

    const loc = locations[locationIndex ?? locationCursor % locations.length];
    locationCursor += 1;

    const texture = getStampTexture(loc.city, loc.label);
    const plane = createPaperPlane(texture);

    const start = new THREE.Vector3(
      (Math.random() - 0.5) * 8,
      -2 + Math.random(),
      -4 - Math.random() * 2
    );
    const mid = new THREE.Vector3(
      start.x * 0.3,
      1.5 + Math.random(),
      0
    );
    const end = new THREE.Vector3(
      -start.x * 0.8,
      0.5 + Math.random() * 0.5,
      4 + Math.random() * 2
    );

    plane.position.copy(start);
    plane.rotation.set(Math.random(), Math.random(), Math.random());
    scene.add(plane);

    const progress = { t: 0 };
    const tween = gsap.to(progress, {
      t: 1,
      duration: 2.8 + Math.random(),
      ease: 'power1.inOut',
      onUpdate: () => {
        const t = progress.t;
        const oneMinusT = 1 - t;
        plane.position.x = oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * mid.x + t * t * end.x;
        plane.position.y = oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * mid.y + t * t * end.y;
        plane.position.z = oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * mid.z + t * t * end.z;
        plane.rotation.y += 0.04;
        plane.rotation.z = Math.sin(t * Math.PI * 2) * 0.3;
        plane.lookAt(end);
      },
      onComplete: () => {
        const flight = activeFlights.find((f) => f.mesh === plane);
        if (flight) removeFlight(flight);
      }
    });

    activeFlights.push({ mesh: plane, tween });
  }

  function spawnIncoming() {
    launch(Math.floor(Math.random() * locations.length));
  }

  function onPointerDown(event: PointerEvent) {
    const rect = domElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    launch();
  }

  domElement.addEventListener('pointerdown', onPointerDown);

  return {
    launch,
    spawnIncoming,
    update() {
      /* gsap drives plane positions */
    },
    dispose() {
      domElement.removeEventListener('pointerdown', onPointerDown);
      [...activeFlights].forEach(removeFlight);
    }
  };
}
