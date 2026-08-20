import * as THREE from 'three';

const chromeVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const chromeFragmentShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  uniform vec3 uColor;
  uniform float uMetal;

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vView);
    float fresnel = pow(1.0 - max(dot(n, v), 0.0), 2.0);
    float brush = sin((position.x + position.y) * 40.0) * 0.04 + 0.96;
    vec3 base = uColor * brush;
    vec3 col = mix(base, vec3(0.85, 0.9, 1.0), fresnel * uMetal);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function chromeMaterial(color: THREE.ColorRepresentation, metal = 0.7): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: chromeVertexShader,
    fragmentShader: chromeFragmentShader,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uMetal: { value: metal }
    }
  });
}

function addPart(
  group: THREE.Group,
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  position: THREE.Vector3,
  rotation?: THREE.Euler
): THREE.Mesh {
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.copy(position);
  if (rotation) mesh.rotation.copy(rotation);
  mesh.castShadow = true;
  group.add(mesh);
  return mesh;
}

export type RobotHeroHandle = {
  group: THREE.Group;
  baseballSlot: THREE.Object3D;
  update: (time: number) => void;
};

export function createRobotHero(): RobotHeroHandle {
  const group = new THREE.Group();
  const gunmetal = chromeMaterial(0x3a3f4b, 0.5);
  const chrome = chromeMaterial(0x8a9199, 0.85);
  const accent = chromeMaterial(0x4a5568, 0.6);

  // Bust / thorax
  addPart(group, new THREE.BoxGeometry(1.4, 1.1, 0.7), gunmetal, new THREE.Vector3(0, 1.4, 0));
  addPart(group, new THREE.BoxGeometry(1.0, 0.35, 0.55), accent, new THREE.Vector3(0, 2.05, 0));

  // Shoulder mount
  const shoulder = new THREE.Group();
  shoulder.position.set(0.55, 1.85, 0);
  group.add(shoulder);

  addPart(shoulder, new THREE.SphereGeometry(0.22, 16, 16), chrome, new THREE.Vector3(0, 0, 0));

  // Upper arm
  const upperArm = new THREE.Group();
  upperArm.position.set(0.15, -0.05, 0);
  shoulder.add(upperArm);
  addPart(
    upperArm,
    new THREE.CylinderGeometry(0.14, 0.16, 0.75, 12),
    gunmetal,
    new THREE.Vector3(0, -0.35, 0),
    new THREE.Euler(0, 0, 0.15)
  );

  // Elbow
  const elbow = new THREE.Group();
  elbow.position.set(0.05, -0.72, 0);
  upperArm.add(elbow);
  addPart(elbow, new THREE.SphereGeometry(0.16, 12, 12), chrome, new THREE.Vector3(0, 0, 0));

  // Forearm
  const forearm = new THREE.Group();
  forearm.position.set(0, -0.08, 0);
  elbow.add(forearm);
  addPart(
    forearm,
    new THREE.CylinderGeometry(0.11, 0.13, 0.65, 12),
    gunmetal,
    new THREE.Vector3(0, -0.3, 0),
    new THREE.Euler(0, 0, -0.2)
  );

  // Wrist + claw
  const wrist = new THREE.Group();
  wrist.position.set(-0.05, -0.62, 0.15);
  forearm.add(wrist);
  addPart(wrist, new THREE.SphereGeometry(0.12, 10, 10), chrome, new THREE.Vector3(0, 0, 0));

  const baseballSlot = new THREE.Object3D();
  baseballSlot.position.set(0.35, -0.15, 0.45);
  wrist.add(baseballSlot);

  // Claw fingers
  for (let i = -1; i <= 1; i++) {
    addPart(
      wrist,
      new THREE.BoxGeometry(0.06, 0.22, 0.06),
      accent,
      new THREE.Vector3(0.12 + i * 0.08, -0.08, 0.28 + i * 0.04),
      new THREE.Euler(0.4, i * 0.15, 0)
    );
  }

  group.position.set(0, 0, 0);

  function update(time: number): void {
    const breathe = Math.sin(time * 1.2) * 0.02;
    group.position.y = breathe;
    shoulder.rotation.z = Math.sin(time * 0.8) * 0.04 + 0.1;
    upperArm.rotation.z = Math.sin(time * 0.6) * 0.06 - 0.25;
    elbow.rotation.z = Math.sin(time * 0.9 + 1) * 0.05;
    forearm.rotation.x = Math.sin(time * 0.5) * 0.08 + 0.35;
    wrist.rotation.y = Math.sin(time * 0.7) * 0.06;
  }

  return { group, baseballSlot, update };
}
