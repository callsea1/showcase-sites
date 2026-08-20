import gsap from 'gsap';
import * as THREE from 'three';
import { createSmileyFace, type SmileySprite } from './SmileyFace.js';

export type SmileyFloaterOptions = {
  scene: THREE.Scene;
  isMobile: boolean;
};

export type SmileyFloater = {
  spawn: () => void;
  update: (elapsed: number) => void;
  dispose: () => void;
};

type ActiveFloat = {
  mesh: SmileySprite;
  tween: gsap.core.Tween;
  bobPhase: number;
};

export function createSmileyFloater(options: SmileyFloaterOptions): SmileyFloater {
  const { scene, isMobile } = options;
  const active: ActiveFloat[] = [];
  const maxSmileys = isMobile ? 4 : 7;
  let elapsed = 0;

  function removeFloat(flight: ActiveFloat) {
    scene.remove(flight.mesh);
    (flight.mesh.material as THREE.SpriteMaterial).map?.dispose();
    (flight.mesh.material as THREE.Material).dispose();
    flight.tween.kill();
    const idx = active.indexOf(flight);
    if (idx >= 0) active.splice(idx, 1);
  }

  function spawn() {
    if (active.length >= maxSmileys) {
      removeFloat(active[0]);
    }

    const smiley = createSmileyFace();

    const start = new THREE.Vector3(
      (Math.random() - 0.5) * 9,
      -1.5 + Math.random() * 0.5,
      -3 - Math.random() * 2
    );
    const mid = new THREE.Vector3(start.x * 0.35, 1.2 + Math.random() * 0.8, 0.5);
    const end = new THREE.Vector3(-start.x * 0.7, 0.4 + Math.random() * 0.6, 3.5 + Math.random());

    smiley.position.copy(start);
    scene.add(smiley);

    const progress = { t: 0 };
    const entry: ActiveFloat = {
      mesh: smiley,
      bobPhase: Math.random() * Math.PI * 2,
      tween: gsap.to(progress, {
        t: 1,
        duration: 3.2 + Math.random() * 1.5,
        ease: 'sine.inOut',
        onUpdate: () => {
          const t = progress.t;
          const oneMinusT = 1 - t;
          smiley.position.x = oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * mid.x + t * t * end.x;
          smiley.position.y = oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * mid.y + t * t * end.y;
          smiley.position.z = oneMinusT * oneMinusT * start.z + 2 * oneMinusT * t * mid.z + t * t * end.z;
        },
        onComplete: () => {
          const found = active.find((f) => f.mesh === smiley);
          if (found) removeFloat(found);
        }
      })
    };

    active.push(entry);
  }

  return {
    spawn,
    update(time: number) {
      elapsed = time;
      for (const f of active) {
        f.mesh.position.y += Math.sin(elapsed * 2 + f.bobPhase) * 0.002;
        f.mesh.material.rotation += 0.008;
      }
    },
    dispose() {
      [...active].forEach(removeFloat);
    }
  };
}
