import * as THREE from 'three';

export function createSkyGradient(): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(80, 32, 32);

  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vWorldPosition;

      vec3 mixPastel(vec3 a, vec3 b, float t) {
        return mix(a, b, smoothstep(0.0, 1.0, t));
      }

      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        float wave = sin(uTime * 0.15 + h * 3.14159) * 0.5 + 0.5;

        vec3 pink = vec3(1.0, 0.576, 0.596);
        vec3 teal = vec3(0.369, 0.812, 0.812);
        vec3 sky = vec3(0.678, 0.847, 0.902);

        vec3 top = mixPastel(pink, teal, wave);
        vec3 bottom = mixPastel(teal, sky, 1.0 - h);
        vec3 color = mix(bottom, top, pow(h, 0.8));

        gl_FragColor = vec4(color, 1.0);
      }
    `
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'sky';
  return mesh;
}

export function updateSkyGradient(sky: THREE.Mesh, elapsed: number): void {
  const mat = sky.material as THREE.ShaderMaterial;
  mat.uniforms.uTime.value = elapsed;
}
